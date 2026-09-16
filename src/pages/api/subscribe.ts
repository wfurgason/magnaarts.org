import type { APIRoute } from 'astro';
import { adminDb } from '../../lib/firebase-admin';
import { randomUUID } from 'crypto';
import { checkBotId } from 'botid/server';
import { sendConfirmationEmail, tryConsumeDailySignupCap } from '../../lib/mailing-list';

// In-memory per-IP rate limit: 1 accepted submission per hour.
// Resets on cold start/redeploy, and Vercel can run multiple parallel
// instances under load — so this only blunts simple single-source bursts.
// It is NOT sufficient against a distributed attack using many different
// IPs; see tryConsumeDailySignupCap() in lib/mailing-list.ts for the
// cross-instance safety net that actually protects the Resend quota.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const lastSubmissionByIp = new Map<string, number>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = lastSubmissionByIp.get(ip);

  // Occasionally prune old entries so the map doesn't grow forever
  // between cold starts.
  if (lastSubmissionByIp.size > 500) {
    for (const [key, ts] of lastSubmissionByIp) {
      if (now - ts > RATE_LIMIT_WINDOW_MS) lastSubmissionByIp.delete(key);
    }
  }

  if (last && now - last < RATE_LIMIT_WINDOW_MS) {
    return true;
  }
  lastSubmissionByIp.set(ip, now);
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const email = data.email?.toString().trim().toLowerCase() ?? '';
    const interest = typeof data.interest === 'string' && data.interest.trim() ? data.interest.trim() : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required.' }), { status: 400 });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      // Silently pretend success so bots/scrapers get no signal —
      // just skip the DB write and the confirmation email.
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // BotID catches the distributed "many different IPs" case the per-IP
    // limiter above can't — every request there looks like a first-time
    // visitor. Same silent-success behavior on detection: no signal, no
    // DB write, no email.
    const botCheck = await checkBotId({ advancedOptions: { headers: request.headers } });
    if (botCheck.isBot) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Check for existing subscriber
    const existing = await adminDb
      .collection('mailingList')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existing.empty) {
      const sub = existing.docs[0].data();
      if (sub.status === 'confirmed') {
        return new Response(JSON.stringify({ error: 'already_subscribed' }), { status: 409 });
      }
      // Already pending — merge in an interest tag if one was passed and the
      // record doesn't already have one, but never auto-resend the
      // confirmation email or reset the 48-hour window on a repeat
      // submission. A resend now only happens via an explicit admin action
      // (the "Resend" button on /admin/mailing-list), so a flood of repeat
      // submissions for the same address can't burn through the email quota.
      if (interest && !sub.interest) {
        await existing.docs[0].ref.update({ interest });
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    // Brand-new signup — enforce the hard daily cap before writing/emailing.
    const allowed = await tryConsumeDailySignupCap();
    if (!allowed) {
      // Same silent-success behavior as the other guards above, so an
      // automated submitter gets no signal that anything was blocked.
      console.warn('subscribe: daily signup cap reached, silently dropping new signup');
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const token = randomUUID();
    await adminDb.collection('mailingList').add({
      email,
      status: 'pending',
      token,
      subscribedAt: new Date(),
      confirmedAt: null,
      interest,
    });

    await sendConfirmationEmail(email, token);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
  }
};
