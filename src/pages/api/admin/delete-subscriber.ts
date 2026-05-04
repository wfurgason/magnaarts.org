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

  try {
    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
    }

    const docRef = adminDb.collection('mailingList').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return new Response(JSON.stringify({ error: 'Subscriber not found' }), { status: 404 });
    }

    await docRef.delete();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('delete-subscriber error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
