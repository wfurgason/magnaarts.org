import type { APIRoute } from 'astro';
import { adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { eventId } = await request.json();
    if (!eventId) return json({ error: 'Missing eventId' }, 400);

    // Get caller IP for deduplication
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('cf-connecting-ip') ||
      'unknown';

    const eventRef = adminDb.collection('events').doc(eventId);
    const ipDocRef = eventRef.collection('attendees').doc(ip.replace(/[:.]/g, '_'));
    const ipSnap   = await ipDocRef.get();

    if (ipSnap.exists) {
      const eventSnap = await eventRef.get();
      const count = eventSnap.data()?.attendingCount || 0;
      return json({ count }, 409);
    }

    // Record the IP and increment the count atomically
    await ipDocRef.set({ recordedAt: FieldValue.serverTimestamp() });
    await eventRef.update({ attendingCount: FieldValue.increment(1) });

    const updated = await eventRef.get();
    const count   = updated.data()?.attendingCount || 1;

    return json({ count });
  } catch (err) {
    console.error('attend error:', err);
    return json({ error: 'Server error' }, 500);
  }
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
