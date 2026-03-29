import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { shellId, collection } = await request.json();

    if (!shellId || !collection) {
      return new Response(JSON.stringify({ error: 'shellId and collection required' }), { status: 400 });
    }

    const shellDoc = await adminDb.collection(collection).doc(shellId).get();
    if (!shellDoc.exists) {
      return new Response(JSON.stringify({ error: 'Shell not found' }), { status: 404 });
    }

    const shellData = shellDoc.data()!;
    const batch = adminDb.batch();

    // Remove from public events collection
    batch.delete(adminDb.collection('events').doc(shellId));

    if (collection === 'park_events') {
      // Reset shell back to 'confirmed' so band is still assigned but event can be re-published
      batch.update(adminDb.collection('park_events').doc(shellId), {
        status: 'confirmed',
        publishedAt: null,
      });
      // Reset band application from 'published' → 'assigned'
      if (shellData.bandId) {
        batch.update(adminDb.collection('band_applications').doc(shellData.bandId), {
          status: 'assigned',
        });
      }
    } else {
      // open_mic_events or art_night_events — reset to 'shell'
      batch.update(adminDb.collection(collection).doc(shellId), {
        status: 'shell',
        publishedAt: null,
      });
    }

    await batch.commit();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('unpublish-event error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
