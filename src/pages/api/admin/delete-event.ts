import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { eventId } = await request.json();
    const eventDoc = await adminDb.collection('events').doc(eventId).get();

    if (!eventDoc.exists) {
      return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    const { submissionId, submissionType } = eventDoc.data()!;
    const collection = submissionType === 'band' ? 'band_applications' : 'program_submissions';

    // Reset submission back to approved so it can be re-published
    await adminDb.collection(collection).doc(submissionId).update({
      status: 'approved',
      eventId: null,
    });

    await adminDb.collection('events').doc(eventId).delete();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('delete-event error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
