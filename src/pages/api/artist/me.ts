import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

/**
 * GET /api/artist/me
 * Returns the artist doc for the currently authenticated artist.
 * Uses Admin SDK so Firestore security rules don't apply.
 */
export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization') ?? '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!idToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const snapshot = await adminDb
      .collection('artists')
      .where('uid', '==', uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return new Response(JSON.stringify({ error: 'No profile found' }), { status: 404 });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const artistType = data.artistType ?? 'music';

    if (artistType === 'visual') {
      // Fetch images subcollection
      const imagesSnap = await adminDb
        .collection('artists').doc(doc.id)
        .collection('images')
        .orderBy('uploadedAt', 'asc')
        .get();

      const images = imagesSnap.docs.map(i => ({ id: i.id, ...i.data() }));

      return new Response(JSON.stringify({
        bandId: doc.id,
        artist: data,
        artistType,
        images,
      }), { status: 200 });
    }

    // Fetch tracks subcollection
    const tracksSnap = await adminDb
      .collection('artists').doc(doc.id)
      .collection('tracks')
      .orderBy('uploadedAt', 'asc')
      .get();

    const tracks = tracksSnap.docs.map(t => ({ id: t.id, ...t.data() }));

    return new Response(JSON.stringify({
      bandId: doc.id,
      artist: data,
      artistType,
      tracks,
    }), { status: 200 });

  } catch (error) {
    console.error('[api/artist/me] error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
