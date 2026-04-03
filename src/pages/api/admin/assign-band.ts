import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify session
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let publisher: import('firebase-admin/auth').DecodedIdToken;
  try {
    publisher = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { action, bandId, shellId } = await request.json();

    if (action === 'assign') {
      if (!bandId || !shellId) {
        return new Response(JSON.stringify({ error: 'bandId and shellId required' }), { status: 400 });
      }

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

      if (shellData.status !== 'shell') {
        return new Response(
          JSON.stringify({ error: `This date already has a band assigned (${shellData.bandName}). Remove them first.` }),
          { status: 409 }
        );
      }

      const bandData = bandDoc.data()!;
      const batch = adminDb.batch();

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
      if (!shellId) {
        return new Response(JSON.stringify({ error: 'shellId required' }), { status: 400 });
      }

      const shellDoc = await adminDb.collection('park_events').doc(shellId).get();
      if (!shellDoc.exists) {
        return new Response(JSON.stringify({ error: 'Shell not found' }), { status: 404 });
      }

      const shellData = shellDoc.data()!;
      const batch = adminDb.batch();

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
      if (!shellId) {
        return new Response(JSON.stringify({ error: 'shellId required' }), { status: 400 });
      }

      const shellDoc = await adminDb.collection('park_events').doc(shellId).get();
      if (!shellDoc.exists) {
        return new Response(JSON.stringify({ error: 'Shell not found' }), { status: 404 });
      }

      const s = shellDoc.data()!;
      const batch = adminDb.batch();

      // Use timeToISO() — consistent with Open Mic and Art Night
      const eventDateObj = Timestamp.fromDate(new Date(s.date + 'T' + timeToISO(s.startTime)));

      const eventRef = adminDb.collection('events').doc(shellId);
      batch.set(eventRef, {
        title:        `Music & Movie in the Park — ${s.displayDate}`,
        eventDate:    eventDateObj,
        date:         s.date,
        displayDate:  s.displayDate,
        eventTime:    s.startTime,
        startTime:    s.startTime,
        venueName:    s.venue,
        venueAddress: s.address,
        venue:        s.venue,
        address:      s.address,
        eventType:    'music_movie_in_park',
        category:     'Concert',
        bandName:     s.bandName,
        genre:        s.bandGenre,
        bandBio:      s.bandBio,
        bandGenre:    s.bandGenre,
        bandWebsite:  s.bandWebsite || null,
        musicLink:    s.bandMusicLink || null,
        photoUrl:     s.imageUrl || s.bandPhotoUrl || null,
        posterUrl:    s.imageUrl || s.bandPhotoUrl || null,
        description:  s.bandBio || '',
        movie:             s.movie || null,
        movieToken:        s.movieToken || null,
        movieTitle:        s.movie_title || null,
        moviePreviewEmbed: s.movie_preview_embed || null,
        displayType:       s.display_type || 'music_only',
        isFree:       true,
        submissionType: 'band_application',
        publishedBy:  publisher.email,
        publishedAt:  FieldValue.serverTimestamp(),
        shellId,
      });

      batch.update(adminDb.collection('park_events').doc(shellId), {
        status:      'published',
        publishedAt: FieldValue.serverTimestamp(),
      });

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

// Convert a time string like "7:00 PM" to "19:00:00" for Date parsing
function timeToISO(timeStr: string): string {
  try {
    const [time, meridiem] = timeStr.trim().split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (meridiem?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (meridiem?.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`;
  } catch {
    return '19:00:00';
  }
}
