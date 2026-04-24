import type { APIRoute } from 'astro';
import { adminAuth, adminDb, adminStorage } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request }) => {
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
    const { bandId, trackId, storagePath } = await request.json();

    if (!bandId || !trackId || !storagePath) {
      return new Response(JSON.stringify({ error: 'Missing bandId, trackId, or storagePath' }), { status: 400 });
    }

    // Verify uid matches the artist doc
    const artistRef = adminDb.collection('artists').doc(bandId);
    const artistSnap = await artistRef.get();
    if (!artistSnap.exists) {
      return new Response(JSON.stringify({ error: 'Artist not found' }), { status: 404 });
    }
    if (artistSnap.data()?.uid !== uid) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    // Delete from Storage
    try {
      await adminStorage.bucket().file(storagePath).delete();
    } catch {
      // File may already be gone — continue to clean up Firestore
      console.warn('Storage file not found, continuing with Firestore delete:', storagePath);
    }

    // Delete track doc
    await artistRef.collection('tracks').doc(trackId).delete();

    // Recount tracks — if zero, flip visible false
    const remaining = await artistRef.collection('tracks').get();
    if (remaining.size === 0) {
      await artistRef.update({ visible: false });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('delete-track error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
