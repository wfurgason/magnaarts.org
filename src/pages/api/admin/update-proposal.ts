import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

    // Only allow known fields to be written
    const allowed = [
      'contact_name', 'contact_email', 'contact_phone', 'connection',
      'event_type', 'program_title', 'description',
      'proposed_date', 'proposed_time', 'proposed_venue',
      'estimated_attendance', 'budget', 'additional_notes',
      'image_url', 'status',
    ];

    const update: Record<string, any> = { updatedAt: FieldValue.serverTimestamp() };
    for (const key of allowed) {
      if (key in fields) update[key] = fields[key] ?? null;
    }

    await adminDb.collection('program_submissions').doc(id).update(update);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('update-proposal error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
