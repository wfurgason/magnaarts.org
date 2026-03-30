import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { eventId } = await request.json();
    const eventDoc = await adminDb.collection('events').doc(eventId).get();

    if (!eventDoc.exists) {
      return new Response(JSON.stringify({ error: 'Event not found' }), { status: 404 });
    }

    const data = eventDoc.data()!;
    const { submissionType, submissionId, shellId } = data;
    const batch = adminDb.batch();

    // Delete the public event doc
    batch.delete(adminDb.collection('events').doc(eventId));

    if (submissionType === 'band_application') {
      // Published via assign-band: reset park_events shell → confirmed, band → assigned
      const sid = shellId || eventId;
      batch.update(adminDb.collection('park_events').doc(sid), {
        status: 'confirmed',
        publishedAt: null,
      });
      if (data.bandId) {
        batch.update(adminDb.collection('band_applications').doc(data.bandId), {
          status: 'assigned',
        });
      }
    } else if (submissionType === 'open_mic') {
      // Published via publish-open-mic: reset shell → shell
      const sid = shellId || eventId;
      batch.update(adminDb.collection('open_mic_events').doc(sid), {
        status: 'shell',
        publishedAt: null,
      });
    } else if (submissionType === 'art_night') {
      // Published via publish-art-night: reset shell → shell
      const sid = shellId || eventId;
      batch.update(adminDb.collection('art_night_events').doc(sid), {
        status: 'shell',
        publishedAt: null,
      });
    } else if (submissionType === 'band') {
      // Published via publish-event (legacy band submission)
      batch.update(adminDb.collection('band_applications').doc(submissionId), {
        status: 'approved',
        eventId: null,
      });
    } else {
      // Published via publish-event (program submission)
      if (submissionId) {
        batch.update(adminDb.collection('program_submissions').doc(submissionId), {
          status: 'approved',
          eventId: null,
        });
      }
    }

    await batch.commit();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('delete-event error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
