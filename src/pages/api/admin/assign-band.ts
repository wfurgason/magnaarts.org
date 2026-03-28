import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify session
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
    const { action, bandId, shellId } = await request.json();

    if (action === 'assign') {
      if (!bandId || !shellId) {
        return new Response(JSON.stringify({ error: 'bandId and shellId required' }), { status: 400 });
      }

      // Load both docs
      const [bandDoc, shellDoc] = await Promise.all([
        adminDb.collection('band_applications').doc(bandId).get(),
        adminDb.collection('park_events').doc(shellId).get(),
      ]);

      if (!bandDoc.exists) {
        return new Response(JSON.stringify({ error: 'Band not found' }), { status: 404 });
      }
      if (!shellDoc.exists) {
        return new Response(JSON.stringify({ error: 'Event shell not found' }), { status: 404 });
      }

      const shellData = shellDoc.data()!;

      // Don't allow reassigning a shell that already has a band
      if (shellData.status !== 'shell') {
        return new Response(
          JSON.stringify({ error: `This date already has a band assigned (${shellData.bandName}). Remove them first.` }),
          { status: 409 }
        );
      }

      const bandData = bandDoc.data()!;
      const batch = adminDb.batch();

      // Update the event shell
      batch.update(adminDb.collection('park_events').doc(shellId), {
        status:        'band_assigned',
        bandId,
        bandName:      bandData.band_name,
        bandEmail:     bandData.contact_email,
        bandPhone:     bandData.contact_phone || null,
        bandBio:       bandData.bio,
        bandGenre:     bandData.genre,
        bandWebsite:   bandData.website || null,
        bandMusicLink: bandData.music_link || null,
        bandPhotoUrl:  bandData.promo_photo_url || null,
        bandConfirmed: false,
        assignedAt:    FieldValue.serverTimestamp(),
      });

      // Update the band application
      batch.update(adminDb.collection('band_applications').doc(bandId), {
        status:          'assigned',
        assignedShellId: shellId,
        assignedDate:    shellData.date,
        assignedAt:      FieldValue.serverTimestamp(),
      });

      await batch.commit();

      return new Response(JSON.stringify({ success: true, date: shellData.displayDate }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'unassign') {
      // Remove band from a shell (in case you need to reassign)
      if (!shellId) {
        return new Response(JSON.stringify({ error: 'shellId required' }), { status: 400 });
      }

      const shellDoc = await adminDb.collection('park_events').doc(shellId).get();
      if (!shellDoc.exists) {
        return new Response(JSON.stringify({ error: 'Shell not found' }), { status: 404 });
      }

      const shellData = shellDoc.data()!;
      const batch = adminDb.batch();

      // Reset shell to empty
      batch.update(adminDb.collection('park_events').doc(shellId), {
        status:        'shell',
        bandId:        null,
        bandName:      null,
        bandEmail:     null,
        bandPhone:     null,
        bandBio:       null,
        bandGenre:     null,
        bandWebsite:   null,
        bandMusicLink: null,
        bandPhotoUrl:  null,
        bandConfirmed: false,
        assignedAt:    null,
      });

      // Reset the band application back to approved
      if (shellData.bandId) {
        batch.update(adminDb.collection('band_applications').doc(shellData.bandId), {
          status:          'approved',
          assignedShellId: null,
          assignedDate:    null,
        });
      }

      await batch.commit();

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'confirm') {
      // Mark band as confirmed for their date
      if (!shellId) {
        return new Response(JSON.stringify({ error: 'shellId required' }), { status: 400 });
      }

      await adminDb.collection('park_events').doc(shellId).update({
        bandConfirmed: true,
        status:        'confirmed',
        confirmedAt:   FieldValue.serverTimestamp(),
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'publish') {
      // Publish the event shell to the public events collection
      if (!shellId) {
        return new Response(JSON.stringify({ error: 'shellId required' }), { status: 400 });
      }

      const shellDoc = await adminDb.collection('park_events').doc(shellId).get();
      if (!shellDoc.exists) {
        return new Response(JSON.stringify({ error: 'Shell not found' }), { status: 404 });
      }

      const s = shellDoc.data()!;

      if (!s.bandConfirmed) {
        return new Response(
          JSON.stringify({ error: 'Band confirmation is required before publishing.' }),
          { status: 409 }
        );
      }

      const batch = adminDb.batch();

      // Write to public events collection (use shellId as the event doc ID for easy cross-reference)
      // Parse the date string into a real Date for Firestore querying
      const eventDateObj = new Date(s.date + 'T19:00:00');

      const eventRef = adminDb.collection('events').doc(shellId);
      batch.set(eventRef, {
        title:        `Music & Movie in the Park — ${s.displayDate}`,
        eventDate:    eventDateObj,          // used by events.astro for sorting/filtering
        date:         s.date,               // YYYY-MM-DD string, kept for reference
        displayDate:  s.displayDate,
        eventTime:    s.startTime,          // matched to events.astro field name
        startTime:    s.startTime,
        venueName:    s.venue,              // matched to events.astro field name
        venueAddress: s.address,            // matched to events.astro field name
        venue:        s.venue,
        address:      s.address,
        eventType:    'music_movie_in_park',
        category:     'Concert',
        bandName:     s.bandName,
        genre:        s.bandGenre,          // matched to events.astro field name
        bandBio:      s.bandBio,
        bandGenre:    s.bandGenre,
        bandWebsite:  s.bandWebsite || null,
        musicLink:    s.bandMusicLink || null,
        photoUrl:     s.bandPhotoUrl || null,
        posterUrl:    s.bandPhotoUrl || null, // matched to events.astro field name
        description:  s.bandBio || '',       // matched to events.astro field name
        movie:        s.movie || null,
        movieToken:   s.movieToken || null,
        isFree:       true,
        submissionType: 'band_application',
        publishedBy:  'admin',
        publishedAt:  FieldValue.serverTimestamp(),
        shellId,
      });

      // Mark shell as published
      batch.update(adminDb.collection('park_events').doc(shellId), {
        status:      'published',
        publishedAt: FieldValue.serverTimestamp(),
      });

      // Mark band application as published
      if (s.bandId) {
        batch.update(adminDb.collection('band_applications').doc(s.bandId), {
          status: 'published',
        });
      }

      await batch.commit();

      return new Response(JSON.stringify({ success: true, eventId: shellId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });

  } catch (err) {
    console.error('assign-band error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
