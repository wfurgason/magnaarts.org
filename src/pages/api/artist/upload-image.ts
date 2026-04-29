import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

const MAX_IMAGES = 10;

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

    if (!bandId || !storagePath || !url) {
      return new Response(JSON.stringify({ error: 'Missing bandId, storagePath, or url' }), { status: 400 });
    }

    // Validate storagePath is under this artist's folder
    if (!storagePath.startsWith(`artist_images/${bandId}/`)) {
      return new Response(JSON.stringify({ error: 'Invalid storage path' }), { status: 400 });
    }

    // Verify uid matches the artist doc
    const artistRef  = adminDb.collection('artists').doc(bandId);
    const artistSnap = await artistRef.get();
    if (!artistSnap.exists) {
      return new Response(JSON.stringify({ error: 'Artist not found' }), { status: 404 });
    }
    if (artistSnap.data()?.uid !== uid) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    // Check image count limit
    const imagesSnap = await artistRef.collection('images').get();
    if (imagesSnap.size >= MAX_IMAGES) {
      return new Response(JSON.stringify({ error: `Maximum ${MAX_IMAGES} images allowed` }), { status: 400 });
    }

    // Write image doc to subcollection
    const imgRef     = artistRef.collection('images').doc();
    const uploadedAt = new Date().toISOString();
    await imgRef.set({ title: title || '', url, storagePath, uploadedAt });

    // If approved, flip visible
    const data = artistSnap.data()!;
    let visible = data.visible ?? false;
    if (data.status === 'approved') {
      await artistRef.update({ visible: true });
      visible = true;
    }

    return new Response(
      JSON.stringify({ success: true, imageId: imgRef.id, url, visible }),
      { status: 200 }
    );
  } catch (error) {
    console.error('upload-image error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
