import type { APIRoute } from 'astro';
import { adminAuth, adminDb, adminStorage } from '../../../lib/firebase-admin';

const MAX_TRACKS = 5;
const MAX_FILE_SIZE_MB = 20;

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
    const formData = await request.formData();
    const bandId = formData.get('bandId') as string | null;
    const title  = formData.get('title')  as string | null;
    const file   = formData.get('file')   as File   | null;

    if (!bandId || !title || !file) {
      return new Response(JSON.stringify({ error: 'Missing bandId, title, or file' }), { status: 400 });
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

    // Validate file type
    if (!file.type.includes('mpeg') && !file.name.toLowerCase().endsWith('.mp3')) {
      return new Response(JSON.stringify({ error: 'Only MP3 files are allowed' }), { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return new Response(JSON.stringify({ error: `File must be under ${MAX_FILE_SIZE_MB}MB` }), { status: 400 });
    }

    // Check track count limit
    const tracksSnap = await artistRef.collection('tracks').get();
    if (tracksSnap.size >= MAX_TRACKS) {
      return new Response(JSON.stringify({ error: `Maximum ${MAX_TRACKS} tracks allowed` }), { status: 400 });
    }

    // Upload to Firebase Storage via Admin SDK
    const timestamp = Date.now();
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename  = `${safeTitle}_${timestamp}.mp3`;
    const storagePath = `artist_tracks/${bandId}/${filename}`;

    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(storagePath);
    const buffer  = Buffer.from(await file.arrayBuffer());

    await fileRef.save(buffer, { contentType: 'audio/mpeg', resumable: false });
    await fileRef.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    // Write track doc to subcollection
    const trackRef = artistRef.collection('tracks').doc();
    const uploadedAt = new Date().toISOString();
    await trackRef.set({ title, url, storagePath, uploadedAt });

    // If approved and has tracks, flip visible
    const data = artistSnap.data()!;
    if (data.status === 'approved') {
      await artistRef.update({ visible: true });
    }

    return new Response(JSON.stringify({ success: true, trackId: trackRef.id, url }), { status: 200 });
  } catch (error) {
    console.error('upload-track error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
