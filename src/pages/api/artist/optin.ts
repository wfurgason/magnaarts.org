import type { APIRoute } from 'astro';
import { adminDb } from '../../../lib/firebase-admin';
import { sendArtistAuthLink } from '../../../lib/sendArtistInvite';

/**
 * POST /api/artist/optin
 *
 * Public endpoint — no admin session required.
 * Validates the one-time opt-in token, burns it, then sends the Firebase auth link email.
 *
 * Token docs are stored at artists/{bandId}/optinTokens/{token}
 * and include a `bandId` field so we can locate them via collectionGroup.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 });
    }

    // Query collectionGroup — usedAt null filters out burned tokens, then we match by doc ID
    const snapshot = await adminDb
      .collectionGroup('optinTokens')
      .where('usedAt', '==', null)
      .get();

    const tokenDoc = snapshot.docs.find(d => d.id === token);

    if (!tokenDoc) {
      return new Response(
        JSON.stringify({ error: 'Invalid or already-used link' }),
        { status: 404 }
      );
    }

    const data = tokenDoc.data();

    // Check expiry
    if (data.expiresAt < Date.now()) {
      return new Response(
        JSON.stringify({ error: 'This opt-in link has expired. Contact wfurgason@magnaarts.org for a new one.' }),
        { status: 410 }
      );
    }

    const { bandId, email, isReturning } = data;

    // Fetch band name
    const artistSnap = await adminDb.collection('artists').doc(bandId).get();
    if (!artistSnap.exists) {
      return new Response(JSON.stringify({ error: 'Artist record not found' }), { status: 404 });
    }
    const bandName = artistSnap.data()?.band_name || 'Your Band';

    // Burn the token before sending email (prevents race condition double-use)
    await tokenDoc.ref.update({ usedAt: Date.now() });

    // Send the Firebase auth link email
    const result = await sendArtistAuthLink({ bandId, email, bandName, isReturning });

    if (!result.ok) {
      // Un-burn on failure so they can try again
      await tokenDoc.ref.update({ usedAt: null });
      return new Response(JSON.stringify({ success: false, error: result.error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('[optin] error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
