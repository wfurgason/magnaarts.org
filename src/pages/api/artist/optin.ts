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

    // Tokens are stored in the top-level 'optinTokens' collection for direct lookup (no index needed)
    const tokenDocRef = adminDb.collection('optinTokens').doc(token);
    const tokenDoc = await tokenDocRef.get();

    if (!tokenDoc.exists) {
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

    // Fetch band name — check band_applications since artist doc may not exist yet
    let bandName = 'Your Band';
    const artistSnap = await adminDb.collection('artists').doc(bandId).get();
    if (artistSnap.exists) {
      bandName = artistSnap.data()?.band_name || bandName;
    } else {
      const bandSnap = await adminDb.collection('band_applications').doc(bandId).get();
      if (bandSnap.exists) {
        bandName = bandSnap.data()?.band_name || bandName;
      }
    }

    // Burn the token before sending email (prevents race condition double-use)
    await tokenDocRef.update({ usedAt: Date.now() });

    // Send the Firebase auth link email
    const result = await sendArtistAuthLink({ bandId, email, bandName, isReturning });

    if (!result.ok) {
      // Un-burn on failure so they can try again
      await tokenDocRef.update({ usedAt: null });
      return new Response(JSON.stringify({ success: false, error: result.error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('[optin] error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
