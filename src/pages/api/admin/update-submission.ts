import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify session
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  let reviewer: import('firebase-admin/auth').DecodedIdToken;
  try {
    reviewer = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id, collection, status } = await request.json();
    // collection must be one of the two submission collections
    const allowed = ['band_applications', 'program_submissions'];
    if (!allowed.includes(collection)) {
      return new Response(JSON.stringify({ error: 'Invalid collection' }), { status: 400 });
    }
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
    }

    await adminDb.collection(collection).doc(id).update({
      status,
      reviewedBy: reviewer.email,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('update-submission error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
