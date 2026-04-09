import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
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

    const shellDoc = await adminDb.collection('writing_group_events').doc(shellId).get();
    if (!shellDoc.exists) {
      return new Response(JSON.stringify({ error: 'Writing group shell not found' }), { status: 404 });
    }

    const s = shellDoc.data()!;

    const batch = adminDb.batch();

    // Publish to the public events collection
    const eventDateObj = Timestamp.fromDate(new Date(s.date + 'T' + timeToISO(s.startTime)));
    const eventRef = adminDb.collection('events').doc(shellId);

    batch.set(eventRef, {
      title:        s.title,
      eventDate:    eventDateObj,
      date:         s.date,
      displayDate:  s.displayDate,
      eventTime:    s.startTime,
      startTime:    s.startTime,
      venueName:    s.venue,
      venueAddress: s.address,
      venue:        s.venue,
      address:      s.address,
      eventType:    'writing_group',
      category:     'Writing Group',
      description:  s.description || '',
      posterUrl:    s.imageUrl || null,
      photoUrl:     s.imageUrl || null,
      isFree:       true,
      submissionType: 'writing_group',
      publishedBy:  publisher.email,
      publishedAt:  FieldValue.serverTimestamp(),
      shellId,
    });

    // Mark shell as published
    batch.update(adminDb.collection('writing_group_events').doc(shellId), {
      status:      'published',
      publishedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return new Response(JSON.stringify({ success: true, eventId: shellId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('publish-writing-group error:', err);
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
