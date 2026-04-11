import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let id: string;
  try {
    ({ id } = await request.json());
    if (!id) throw new Error('Missing id');
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  try {
    const srcRef = adminDb.collection('program_submissions').doc(id);
    const snap   = await srcRef.get();

    if (!snap.exists) {
      return new Response(JSON.stringify({ error: 'Submission not found' }), { status: 404 });
    }

    const src = snap.data() as Record<string, any>;

    const dest: Record<string, any> = {
      fullName:           src.contact_name     || '',
      email:              src.contact_email    || '',
      phone:              src.contact_phone    || '',
      artsArea:           src.additional_notes || '',
      projectDescription: src.description      || '',
      projectImageUrl:    src.image_url        || '',
      links:              '',
      materials:          '',
      status:             src.status           || 'pending',
      submittedAt:        src.submittedAt      || null,
      movedFrom:          'program_submissions',
    };

    await adminDb.collection('art_class_submissions').doc(id).set(dest);
    await srcRef.delete();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: any) {
    console.error('move-to-art-presenter error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), { status: 500 });
  }
};
