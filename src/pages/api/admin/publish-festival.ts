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

    // Read the festival shell
    const shellRef  = adminDb.collection('festival_events').doc(shellId);
    const shellSnap = await shellRef.get();
    if (!shellSnap.exists) return new Response(JSON.stringify({ error: 'Shell not found' }), { status: 404 });

    const shell = shellSnap.data()!;

    // Write to the public events collection using the shell id as the doc id
    // so /events/arts-festival-2026 resolves correctly in [id].astro
    await adminDb.collection('events').doc(shellId).set({
      title:          shell.title,
      eventDate:      Timestamp.fromDate(new Date(shell.date + 'T12:00:00')),
      eventTime:      shell.startTime,
      venueName:      shell.venue,
      venueAddress:   shell.address,
      description:    shell.description || '',
      image:          shell.image || null,
      eventType:      'festival',
      submissionType: 'festival',
      ticketUrl:      null,
      rsvpUrl:        null,
      posterUrl:      null,
      bandName:       null,
      genre:          null,
      status:         'published',
      publishedBy:    publisher.email,
      publishedAt:    FieldValue.serverTimestamp(),
      createdAt:      FieldValue.serverTimestamp(),
    });

    // Mark the shell as published
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
