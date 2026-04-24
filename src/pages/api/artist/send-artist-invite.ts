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
    const { bandId, email, bandName } = await request.json();

    if (!bandId || !email || !bandName) {
      return new Response(
        JSON.stringify({ error: 'bandId, email, and bandName are required' }),
        { status: 400 }
      );
    }

    // Pass existing status so sendArtistInvite skips its own Firestore read
    const artistSnap = await adminDb.collection('artists').doc(bandId).get();
    const existingStatus = artistSnap.exists ? artistSnap.data()?.status : undefined;

    const result = await sendArtistInvite({ bandId, email, bandName, existingStatus });

    if (!result.ok) {
      return new Response(JSON.stringify({ success: false, error: result.error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, isReturning: result.isReturning }), { status: 200 });

  } catch (error) {
    console.error('[send-artist-invite] error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
