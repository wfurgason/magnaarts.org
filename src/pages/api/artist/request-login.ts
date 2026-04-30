import type { APIRoute } from 'astro';
import { adminDb } from '../../../lib/firebase-admin';
import { sendArtistAuthLink } from '../../../lib/sendArtistInvite';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400 });
    }

    // Look up artist by email
    const snap = await adminDb
      .collection('artists')
      .where('email', '==', email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snap.empty) {
      // Return success anyway — don't reveal whether email exists
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const doc      = snap.docs[0];
    const bandId   = doc.id;
    const artist   = doc.data();
    const bandName = artist.band_name || 'Artist';
    const status   = artist.status || 'pending_review';

    const result = await sendArtistAuthLink({
      bandId,
      email: artist.email,
      bandName,
      isReturning: status === 'approved',
      artistType: artist.artistType === 'visual' ? 'visual' : 'music',
    });

    if (!result.ok) {
      console.error('[request-login] sendArtistAuthLink failed:', result.error);
      return new Response(JSON.stringify({ error: 'Failed to send sign-in link' }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (err) {
    console.error('[request-login] error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
