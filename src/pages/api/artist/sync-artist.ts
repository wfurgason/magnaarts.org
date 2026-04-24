import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify admin session cookie
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
    const { bandId } = await request.json();

    if (!bandId) {
      return new Response(JSON.stringify({ error: 'bandId required' }), { status: 400 });
    }

    // Read from artists collection
    const artistSnap = await adminDb.collection('artists').doc(bandId).get();
    if (!artistSnap.exists) {
      return new Response(JSON.stringify({ error: 'Artist profile not found' }), { status: 404 });
    }

    const artist = artistSnap.data()!;

    if (artist.status !== 'approved') {
      return new Response(JSON.stringify({ error: 'Artist must be approved before syncing' }), { status: 400 });
    }

    // Confirm band_applications doc exists
    const bandRef  = adminDb.collection('band_applications').doc(bandId);
    const bandSnap = await bandRef.get();
    if (!bandSnap.exists) {
      return new Response(JSON.stringify({ error: 'Band application not found' }), { status: 404 });
    }

    // Sync profile fields back to band_applications — only fields the artist owns
    const payload: Record<string, any> = {
      syncedFromArtistAt: FieldValue.serverTimestamp(),
    };
    if (artist.bio       !== undefined) payload.bio        = artist.bio;
    if (artist.genre     !== undefined) payload.genre      = artist.genre;
    if (artist.photo_url !== undefined) payload.photo_url  = artist.photo_url;
    if (artist.website   !== undefined) payload.website    = artist.website;
    if (artist.music_link !== undefined) payload.music_link = artist.music_link;

    await bandRef.update(payload);

    return new Response(JSON.stringify({ success: true, fieldsWritten: Object.keys(payload).filter(k => k !== 'syncedFromArtistAt') }), { status: 200 });

  } catch (error) {
    console.error('[sync-artist] error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
