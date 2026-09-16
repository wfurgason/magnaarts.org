import { Resend } from 'resend';
import { adminDb } from './firebase-admin';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

/**
 * Sends the double opt-in confirmation email for a mailing list signup.
 * Shared between the public /api/subscribe endpoint and the admin
 * "Resend" action on /admin/mailing-list.
 */
export async function sendConfirmationEmail(email: string, token: string): Promise<void> {
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

const DEFAULT_DAILY_CAP = 20;

/**
 * Atomically checks and increments a rolling daily counter of accepted
 * (brand-new) mailing list signups, stored in settings/mailingList.
 *
 * This is a hard safety net on confirmation-email volume regardless of how
 * many distinct IPs an attack uses — it exists specifically because per-IP
 * rate limiting (see isRateLimited in subscribe.ts) can't catch a
 * distributed "subscription bombing" attack, where every request looks
 * like a first-time visitor to the per-IP check.
 *
 * Because it's a Firestore transaction (not an in-memory Map), it's also
 * consistent across every serverless instance Vercel spins up — unlike
 * the per-IP map, which resets per cold start and doesn't share state
 * across concurrent instances.
 *
 * The cap (`dailyCap`) can be changed anytime from the Firestore console
 * (settings/mailingList.dailyCap) without a redeploy. Defaults to 20/day —
 * a few times normal signup volume (currently well under 5/day genuine),
 * while staying far under Resend's daily send limit.
 *
 * Returns true if the signup is allowed (and the counter has been
 * incremented), false if today's cap has already been reached.
 */
export async function tryConsumeDailySignupCap(): Promise<boolean> {
  const settingsRef = adminDb.collection('settings').doc('mailingList');
  const todayKey = new Date().toISOString().slice(0, 10); // UTC day

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(settingsRef);
    const data = snap.data() ?? {};
    const dailyCap = typeof data.dailyCap === 'number' ? data.dailyCap : DEFAULT_DAILY_CAP;
    const isNewDay = data.dailyCountDate !== todayKey;
    const currentCount = isNewDay ? 0 : (data.dailyCount ?? 0);

    if (currentCount >= dailyCap) {
      return false;
    }

    tx.set(settingsRef, {
      dailyCap,
      dailyCount: currentCount + 1,
      dailyCountDate: todayKey,
    }, { merge: true });

    return true;
  });
}
