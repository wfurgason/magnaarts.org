import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

const MAX_TRACKS = 5;

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
    const body = await request.json() as { bandId?: string; title?: string; storagePath?: string; url?: string };
    const { bandId, title, storagePath, url } = body;

    if (!bandId || !title || !storagePath || !url) {
      return new Response(JSON.stringify({ error: 'Missing bandId, title, storagePath, or url' }), { status: 400 });
    }

    // Validate storagePath is under this artist's folder
    if (!storagePath.startsWith(`artist_tracks/${bandId}/`)) {
      return new Response(JSON.stringify({ error: 'Invalid storage path' }), { status: 400 });
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

    // Check track count limit
    const tracksSnap = await artistRef.collection('tracks').get();
    if (tracksSnap.size >= MAX_TRACKS) {
      return new Response(JSON.stringify({ error: `Maximum ${MAX_TRACKS} tracks allowed` }), { status: 400 });
    }

    // Write track doc to subcollection
    const trackRef  = artistRef.collection('tracks').doc();
    const uploadedAt = new Date().toISOString();
    await trackRef.set({ title, url, storagePath, uploadedAt });

    // If approved, flip visible
    const data = artistSnap.data()!;
    let visible = data.visible ?? false;
    if (data.status === 'approved') {
      await artistRef.update({ visible: true });
      visible = true;
    }

    return new Response(JSON.stringify({ success: true, trackId: trackRef.id, url, visible }), { status: 200 });
  } catch (error) {
    console.error('upload-track error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
