import type { APIRoute } from 'astro';
import { adminDb } from '../../lib/firebase-admin';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

// In-memory per-IP rate limit: 1 accepted submission per hour.
// Resets on cold start/redeploy — this is meant to blunt bursts of
// bot signups, not act as a hard/persistent cap.
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
      // Resend confirmation for pending — reset subscribedAt for a fresh 48-hour window
      const token = sub.token;
      await existing.docs[0].ref.update({ subscribedAt: new Date() });
      await sendConfirmationEmail(email, token);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const token = randomUUID();
    await adminDb.collection('mailingList').add({
      email,
      status: 'pending',
      token,
      subscribedAt: new Date(),
      confirmedAt: null,
    });

    await sendConfirmationEmail(email, token);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
  }
};

async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${import.meta.env.SITE_URL}/api/confirm?token=${token}`;
  await resend.emails.send({
    from: 'Magna Arts Council <noreply@magnaarts.org>',
    to: email,
    subject: 'Confirm your subscription — Magna Arts Council',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Almost there!</h2>
        <p>Thanks for signing up for updates from Magna Arts Council. Click the button below to confirm your email address.</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${confirmUrl}"
             style="background:#1a1a2e; color:#fff; padding:14px 28px; border-radius:6px; text-decoration:none; font-weight:bold;">
            Confirm Subscription
          </a>
        </p>
        <p style="font-size: 0.85em; color: #666;">If you didn't sign up for this, you can safely ignore this email.</p>
        <p style="font-size: 0.85em; color: #666;">Or copy this link: ${confirmUrl}</p>
      </div>
    `,
  });
}
