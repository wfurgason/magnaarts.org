import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { timeToISO } from '../../../lib/time-utils';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
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
    const { shellId } = await request.json();

    if (!shellId) {
      return new Response(JSON.stringify({ error: 'shellId required' }), { status: 400 });
    }

    const shellDoc = await adminDb.collection('open_mic_events').doc(shellId).get();
    if (!shellDoc.exists) {
      return new Response(JSON.stringify({ error: 'Open mic shell not found' }), { status: 404 });
    }

    const s = shellDoc.data()!;

    const batch = adminDb.batch();

    // Publish to the public events collection (same collection the public site reads)
    const eventDateObj = Timestamp.fromDate(new Date(s.date + 'T' + timeToISO(s.startTime)));
    const eventRef = adminDb.collection('events').doc(shellId);

    batch.set(eventRef, {
      title:        s.title,
      eventDate:    eventDateObj,
      date:         s.date,
      displayDate:  s.displayDate,
      eventTime:    s.startTime,
      venueName:    s.venue,
      venueAddress: s.address,
      eventType:    'open_mic',
      category:     'Open Mic',
      description:  s.description || '',
      posterUrl:    s.imageUrl || null,
      isFree:       true,
      submissionType: 'open_mic',
      publishedBy:  publisher.email,
      publishedAt:  FieldValue.serverTimestamp(),
      shellId,
    });

    // Mark shell as published
    batch.update(adminDb.collection('open_mic_events').doc(shellId), {
      status:      'published',
      publishedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return new Response(JSON.stringify({ success: true, eventId: shellId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('publish-open-mic error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};


