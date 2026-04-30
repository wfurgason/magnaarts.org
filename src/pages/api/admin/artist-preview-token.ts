import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const GET: APIRoute = async ({ request, cookies }) => {
  // Verify admin session
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const url    = new URL(request.url);
  const bandId = url.searchParams.get('bandId');
  if (!bandId) {
    return new Response(JSON.stringify({ error: 'bandId required' }), { status: 400 });
  }

  // Fetch artist to get their uid and artistType
  const artistSnap = await adminDb.collection('artists').doc(bandId).get();
  if (!artistSnap.exists) {
    return new Response(JSON.stringify({ error: 'Artist not found' }), { status: 404 });
  }

  const artist = artistSnap.data()!;
  const uid    = artist.uid;
  if (!uid) {
    return new Response(JSON.stringify({ error: 'Artist has no uid — they have not signed in yet' }), { status: 422 });
  }

  const artistType = artist.artistType ?? 'music';

  // Mint a short-lived custom token (Firebase custom tokens expire in 1 hour)
  const customToken = await adminAuth.createCustomToken(uid, { adminPreview: true });

  return new Response(JSON.stringify({ customToken, artistType }), { status: 200 });
};
