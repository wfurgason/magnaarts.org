import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  let publisher: import('firebase-admin/auth').DecodedIdToken;
  try {
    publisher = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { shellId } = await request.json();
    if (!shellId) return new Response(JSON.stringify({ error: 'shellId required' }), { status: 400 });

    const shellRef  = adminDb.collection('festival_events').doc(shellId);
    const shellSnap = await shellRef.get();
    if (!shellSnap.exists) return new Response(JSON.stringify({ error: 'Shell not found' }), { status: 404 });

    const shell = shellSnap.data()!;

    // Enrich each assigned band slot with full profile from band_applications
    const rawBands: any[] = shell.bands || [];
    const enrichedBands = await Promise.all(
      rawBands.map(async (b: any) => {
        if (!b.bandId) {
          return { slot: b.slot, time: b.time || null, bandId: null, bandName: null, confirmed: false };
        }
        const bandDoc = await adminDb.collection('band_applications').doc(b.bandId).get();
        const band    = bandDoc.exists ? bandDoc.data()! : {};
        return {
          slot:          b.slot,
          time:          b.time || null,
          bandId:        b.bandId,
          bandName:      b.bandName || band.band_name || null,
          confirmed:     b.confirmed || false,
          bio:           band.bio           || null,
          genre:         band.genre         || null,
          website:       band.website       || null,
          musicLink:     band.music_link    || null,
          photoUrl:      band.promo_photo_url || null,
          memberCount:   band.member_count  || null,
          contactName:   band.contact_name  || null,
          contactEmail:  band.contact_email || null,
        };
      })
    );

    await adminDb.collection('events').doc(shellId).set({
      title:          shell.title,
      eventDate:      Timestamp.fromDate(new Date(shell.date + 'T12:00:00')),
      eventTime:      shell.startTime,
      endTime:        shell.endTime || null,
      venueName:      shell.venue,
      venueAddress:   shell.address,
      description:    shell.description || '',
      image:          shell.image || null,
      eventType:      'arts_festival',
      submissionType: 'festival',
      bands:          enrichedBands,
      isFree:         true,
      status:         'published',
      publishedBy:    publisher.email,
      publishedAt:    FieldValue.serverTimestamp(),
    }, { merge: false });

    await shellRef.update({
      status:      'published',
      publishedBy: publisher.email,
      publishedAt: FieldValue.serverTimestamp(),
    });

    return new Response(JSON.stringify({ success: true, eventId: shellId }), { status: 200 });
  } catch (error) {
    console.error('publish-festival error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
