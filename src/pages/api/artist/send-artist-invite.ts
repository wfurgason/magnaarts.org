import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { sendArtistInvite } from '../../../lib/sendArtistInvite';

// Admin-only: manually send an artist invitation for a given band.
// Sends the invitation-only email with the opt-in button (no Firebase auth link).
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
    const { bandId: reqBandId, email, bandName, artistType = 'music' } = await request.json();

    if (!email || !bandName) {
      return new Response(
        JSON.stringify({ error: 'email and bandName are required' }),
        { status: 400 }
      );
    }

    let bandId: string = reqBandId;
    let existingStatus: string | undefined;

    if (!bandId) {
      // New invite — create a placeholder artist doc
      const newRef = adminDb.collection('artists').doc();
      bandId = newRef.id;
      await newRef.set({
        band_name: bandName,
        email,
        artistType,
        status: 'pending_review',
        visible: false,
        uid: null,
        invitedAt: new Date(),
        registeredAt: null,
      });
      existingStatus = 'pending_review';
    } else {
      // Pass existing status so sendArtistInvite skips its own Firestore read
      const artistSnap = await adminDb.collection('artists').doc(bandId).get();
      existingStatus = artistSnap.exists ? artistSnap.data()?.status : undefined;
    }

    const result = await sendArtistInvite({ bandId, email, bandName, artistType, existingStatus });

    if (!result.ok) {
      return new Response(JSON.stringify({ success: false, error: result.error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, isReturning: result.isReturning }), { status: 200 });

  } catch (error) {
    console.error('[send-artist-invite] error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
