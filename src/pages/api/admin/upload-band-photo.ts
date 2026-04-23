import type { APIRoute } from 'astro';
import { adminAuth, adminStorage } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    const bandId   = formData.get('bandId') as string;
    const file     = formData.get('file') as File | null;

    if (!bandId || !file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'bandId and file required' }), { status: 400 });
    }

    const buffer      = Buffer.from(await file.arrayBuffer());
    const ext         = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const contentType = file.type || 'image/jpeg';
    const storagePath = `band_photos/${bandId}/promo.${ext}`;

    const bucket  = adminStorage.bucket();
    const fileRef = bucket.file(storagePath);

    await fileRef.save(buffer, { metadata: { contentType }, resumable: false });
    await fileRef.makePublic();

    // Build the public GCS URL (works for publicly-readable objects)
    const bucketName = bucket.name;
    const encodedPath = encodeURIComponent(storagePath);
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('upload-band-photo error:', err);
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
};
