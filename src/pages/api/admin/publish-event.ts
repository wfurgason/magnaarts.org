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
    const {
      submissionId,
      submissionType, // 'band' | 'program'
      // Event display fields (filled by admin in publish modal)
      title,
      eventDate,     // ISO string e.g. "2025-08-15"
      eventTime,     // e.g. "7:00 PM"
      venueName,
      venueAddress,
      ticketUrl,
      rsvpUrl,
      posterUrl,
      description,
      // Carry-over from submission
      bandName,
      genre,
      musicLink,
    } = await request.json();

    const collection = submissionType === 'band' ? 'band_applications' : 'program_submissions';

    // Create the public events doc
    const eventRef = await adminDb.collection('events').add({
      title,
      eventDate: Timestamp.fromDate(new Date(eventDate)),
      eventTime,
      venueName,
      venueAddress,
      ticketUrl: ticketUrl || null,
      rsvpUrl: rsvpUrl || null,
      posterUrl: posterUrl || null,
      description,
      bandName: bandName || null,
      genre: genre || null,
      musicLink: musicLink || null,
      submissionId,
      submissionType,
      status: 'published',
      publishedBy: publisher.email,
      publishedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });

    // Mark submission as published
    await adminDb.collection(collection).doc(submissionId).update({
      status: 'published',
      eventId: eventRef.id,
      publishedBy: publisher.email,
      publishedAt: FieldValue.serverTimestamp(),
    });

    return new Response(JSON.stringify({ success: true, eventId: eventRef.id }), { status: 200 });
  } catch (error) {
    console.error('publish-event error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
