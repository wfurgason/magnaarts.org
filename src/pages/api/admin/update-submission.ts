import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendArtistInvite } from '../../../lib/sendArtistInvite';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify session
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  let reviewer: import('firebase-admin/auth').DecodedIdToken;
  try {
    reviewer = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id, collection, status } = await request.json();
    // collection must be one of the two submission collections
    const allowed = ['band_applications', 'program_submissions', 'vendor_applications', 'art_class_submissions'];
    if (!allowed.includes(collection)) {
      return new Response(JSON.stringify({ error: 'Invalid collection' }), { status: 400 });
    }
    const allowedStatuses = ['approved', 'rejected', 'pending', 'good_standing', 'deleted', 'assigned', 'waitlisted', 'paid', 'contacted', 'scheduled'];
    if (!allowedStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400 });
    }

    await adminDb.collection(collection).doc(id).update({
      status,
      reviewedBy: reviewer.email,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    // Fire artist invite when a band is marked Good Standing
    if (collection === 'band_applications' && status === 'good_standing') {
      try {
        const bandDoc = await adminDb.collection('band_applications').doc(id).get();
        const band = bandDoc.data();
        if (band?.contact_email && band?.band_name) {
          await sendArtistInvite({
            bandId: id,
            email: band.contact_email,
            bandName: band.band_name,
          });
        }
      } catch (inviteErr) {
        // Non-fatal — status was already saved; log and continue
        console.error('[update-submission] Artist invite failed:', inviteErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('update-submission error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
