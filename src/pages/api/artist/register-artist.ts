import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request }) => {
  // Verify Firebase ID token from artist client
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
    const {
      bandId, band_name, genre, bio, photo_url,
      website, music_link, social_instagram, social_facebook, email,
      artistType = 'music',
    } = body;

    if (!bandId || typeof bandId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing bandId' }), { status: 400 });
    }

    const artistDoc: Record<string, any> = {
      uid,
      band_name:        band_name        ?? '',
      artistType,
      genre:            genre            ?? '',
      bio:              bio              ?? '',
      photo_url:        photo_url        ?? '',
      website:          website          ?? '',
      music_link:       music_link       ?? '',
      social_instagram: social_instagram ?? '',
      social_facebook:  social_facebook  ?? '',
      email:            email            ?? '',
      status:           'pending_review',
      visible:          false,
      registeredAt:     new Date().toISOString(),
    };

    await adminDb.collection('artists').doc(bandId).set(artistDoc);

    // Admin is notified later when the artist submits for review via /api/artist/submit-for-review

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('register-artist error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
