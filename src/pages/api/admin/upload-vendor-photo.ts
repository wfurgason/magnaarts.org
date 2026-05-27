import type { APIRoute } from 'astro';
import { adminAuth, adminStorage } from '../../../lib/firebase-admin';

// Parse a Firebase Storage public URL back to its storage path so we can delete it.
// URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media
function storagePathFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const segments = u.pathname.split('/o/');
    if (segments.length < 2) return null;
    return decodeURIComponent(segments[1]);
  } catch {
    return null;
  }
}

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
    const formData = await request.formData();
    const vendorId = formData.get('vendorId') as string;
    const file     = formData.get('file') as File | null;
    const oldUrl   = (formData.get('oldUrl') as string) || '';

    if (!vendorId || !file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'vendorId and file required' }), { status: 400 });
    }

    const bucket = adminStorage.bucket();

    // Delete the old photo if one exists
    if (oldUrl) {
      const oldPath = storagePathFromUrl(oldUrl);
      if (oldPath) {
        try {
          await bucket.file(oldPath).delete();
        } catch (e) {
          // Non-fatal — log and continue
          console.warn('[upload-vendor-photo] Could not delete old file:', oldPath, e);
        }
      }
    }

    // Upload the new file
    const buffer      = Buffer.from(await file.arrayBuffer());
    const ext         = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const contentType = file.type || 'image/jpeg';
    const storagePath = `vendor-profiles/${vendorId}/profile.${ext}`;

    const fileRef = bucket.file(storagePath);
    await fileRef.save(buffer, { metadata: { contentType }, resumable: false });
    await fileRef.makePublic();

    const bucketName  = bucket.name;
    const encodedPath = encodeURIComponent(storagePath);
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[upload-vendor-photo] error:', err);
    return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
  }
};
