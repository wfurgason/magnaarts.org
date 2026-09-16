import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { sendConfirmationEmail } from '../../../lib/mailing-list';

// Admin actions for a single mailingList subscriber. Currently just
// "resend-confirmation" — deletion already has its own endpoint
// (delete-subscriber.ts); this file exists so future subscriber actions
// have a natural home without another one-off endpoint per action.
export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { action, id } = await request.json();

    if (action !== 'resend-confirmation') {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }
    if (!id) {
      return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
    }

    const docRef = adminDb.collection('mailingList').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return new Response(JSON.stringify({ error: 'Subscriber not found' }), { status: 404 });
    }

    const sub = snap.data()!;
    if (sub.status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Only pending subscribers can be resent a confirmation.' }), { status: 400 });
    }

    // Give the resend a fresh 48-hour confirmation window, same as the old
    // auto-resend behavior — this is now the only place that happens, and
    // it's gated behind an admin session rather than an anonymous POST.
    await docRef.update({ subscribedAt: new Date() });
    await sendConfirmationEmail(sub.email, sub.token);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('mailing-list-action error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
