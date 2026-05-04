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

    const shellDoc = await adminDb.collection('art_night_events').doc(shellId).get();
    if (!shellDoc.exists) {
      return new Response(JSON.stringify({ error: 'Art Night shell not found' }), { status: 404 });
    }

    const s = shellDoc.data()!;

    // Fetch presenter submission data if assigned
    let presenterArtsArea: string | null = null;
    let presenterProjectDescription: string | null = null;
    let presenterImageUrl: string | null = null;
    let presenterPhotoUrl: string | null = null;
    let presenterProjectTitle: string | null = null;
    let presenterSocialUrl: string | null = null;
    if (s.presenterId) {
      const presSnap = await adminDb.collection('art_class_submissions').doc(s.presenterId).get();
      if (presSnap.exists) {
        const pData = presSnap.data()!;
        presenterArtsArea = pData.artsArea || null;
        presenterProjectDescription = pData.projectDescription || null;
        presenterImageUrl = pData.projectImageUrl || null;
        presenterPhotoUrl = pData.presenterPhotoUrl || null;
        presenterProjectTitle = pData.projectTitle || null;
        presenterSocialUrl = pData.socialUrl || null;
      }
    }

    const batch = adminDb.batch();

    const eventDateObj = Timestamp.fromDate(new Date(s.date + 'T' + timeToISO(s.startTime)));
    const eventRef = adminDb.collection('events').doc(shellId);

    batch.set(eventRef, {
      title:         s.title || 'Group Art Night',
      eventDate:     eventDateObj,
      date:          s.date,
      displayDate:   s.displayDate,
      eventTime:     s.startTime,
      venueName:     s.venue,
      venueAddress:  s.address,
      eventType:     'group_art_night',
      category:      'Art Night',
      description:   s.description || '',
      posterUrl:     s.imageUrl || null,
      presenterName:               s.presenterName || null,
      presenterId:                 s.presenterId || null,
      presenterArtsArea,
      presenterProjectDescription,
      presenterImageUrl,
      presenterPhotoUrl,
      presenterProjectTitle,
      presenterSocialUrl,
      isFree:        true,
      submissionType: 'art_night',
      publishedBy:   publisher.email,
      publishedAt:   FieldValue.serverTimestamp(),
      shellId,
    });

    // Mark shell as published
    batch.update(adminDb.collection('art_night_events').doc(shellId), {
      status:      'published',
      publishedAt: FieldValue.serverTimestamp(),
    });

    // Mark art class submission as published
    if (s.presenterId) {
      batch.update(adminDb.collection('art_class_submissions').doc(s.presenterId), {
        status:          'published',
        assignedShellId: shellId,
        publishedAt:     FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();

    return new Response(JSON.stringify({ success: true, eventId: shellId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('publish-art-night error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};


