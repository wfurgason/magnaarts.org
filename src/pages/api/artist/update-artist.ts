import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

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
    const body = await request.json();
    const { bandId, band_name, genre, bio, photo_url, website, music_link, social_instagram, social_facebook } = body;

    if (!bandId || typeof bandId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing bandId' }), { status: 400 });
    }

    // Verify uid matches the artist doc
    const docRef = adminDb.collection('artists').doc(bandId);
    const snap = await docRef.get();
    if (!snap.exists) {
      return new Response(JSON.stringify({ error: 'Artist not found' }), { status: 404 });
    }
    if (snap.data()?.uid !== uid) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    // Build update payload — only include defined fields; never touch status or visible
    const update: Record<string, any> = {};
    if (band_name        !== undefined) update.band_name        = band_name;
    if (genre            !== undefined) update.genre            = genre;
    if (bio              !== undefined) update.bio              = bio;
    if (photo_url        !== undefined) update.photo_url        = photo_url;
    if (website          !== undefined) update.website          = website;
    if (music_link       !== undefined) update.music_link       = music_link;
    if (social_instagram !== undefined) update.social_instagram = social_instagram;
    if (social_facebook  !== undefined) update.social_facebook  = social_facebook;

    if (Object.keys(update).length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400 });
    }

    await docRef.update(update);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('update-artist error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
