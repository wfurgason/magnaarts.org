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
    const { bandId, fields } = await request.json();
    if (!bandId || !fields) return new Response(JSON.stringify({ error: 'bandId and fields required' }), { status: 400 });

    const allowed = [
      'genre', 'contact_name', 'contact_email', 'contact_phone',
      'bio', 'music_link', 'website', 'set_length', 'member_count',
      'available_dates', 'availability', 'performed_before', 'additional_notes',
    ];

    const update: Record<string, any> = { updatedAt: FieldValue.serverTimestamp() };
    for (const key of allowed) {
      if (key in fields) update[key] = fields[key];
    }

    await adminDb.collection('band_applications').doc(bandId).update(update);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('update-band error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
