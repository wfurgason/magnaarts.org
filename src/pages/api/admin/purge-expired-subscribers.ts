import type { APIRoute } from 'astro';
import { adminDb, adminAuth } from '../../../lib/firebase-admin';

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

export const GET: APIRoute = async ({ request, cookies }) => {
  // Accept either a valid cron secret or an active admin session
  const authHeader = request.headers.get('authorization') ?? '';
  const cronSecret = import.meta.env.CRON_SECRET;
  const isCron = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isCron) {
    // Fall back to session cookie auth for manual use from the admin UI
    const sessionCookie = cookies.get('session')?.value;
    if (!sessionCookie) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    try {
      await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
  }

  try {
    const cutoff = new Date(Date.now() - FORTY_EIGHT_HOURS_MS);

    const snap = await adminDb
      .collection('mailingList')
      .where('status', '==', 'pending')
      .get();

    const expired = snap.docs.filter(doc => {
      const subscribedAt = doc.data().subscribedAt?.toDate?.();
      return subscribedAt && subscribedAt < cutoff;
    });

    if (expired.length === 0) {
      return new Response(JSON.stringify({ deleted: 0 }), { status: 200 });
    }

    // Firestore batch deletes are limited to 500 ops — chunk if needed
    const BATCH_SIZE = 500;
    for (let i = 0; i < expired.length; i += BATCH_SIZE) {
      const batch = adminDb.batch();
      expired.slice(i, i + BATCH_SIZE).forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    }

    return new Response(JSON.stringify({ deleted: expired.length }), { status: 200 });
  } catch (err) {
    console.error('purge-expired-subscribers error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
