import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  // ── Auth ──
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie)
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // ── Parse ──
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const { title, eventType, customEventType, eventDate, venue, description, notes, attendeeCount } = body;

  // ── Validate ──
  if (!title?.trim())
    return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
  if (!eventType)
    return new Response(JSON.stringify({ error: 'Event type is required' }), { status: 400 });
  if (!eventDate)
    return new Response(JSON.stringify({ error: 'Event date is required' }), { status: 400 });

  const resolvedType = eventType === 'custom' ? (customEventType?.trim() || 'other') : eventType;

  // ── Write to Firestore ──
  try {
    const docRef = await adminDb.collection('events').add({
      title:          title.trim(),
      eventType:      resolvedType,
      submissionType: resolvedType,
      eventDate:      Timestamp.fromDate(new Date(eventDate)),
      venue:          venue?.trim()       || null,
      description:    description?.trim() || null,
      notes:          notes?.trim()       || null,
      attendeeCount:  attendeeCount ? Number(attendeeCount) : null,
      status:         'published',
      source:         'manual-entry',
      publishedAt:    Timestamp.now(),
    });

    return new Response(JSON.stringify({ success: true, id: docRef.id }), { status: 200 });
  } catch (err: any) {
    console.error('add-manual-event error:', err);
    return new Response(JSON.stringify({ error: 'Failed to save event' }), { status: 500 });
  }
};
