/**
 * Artist invite utilities
 *
 * sendArtistInvite  — sends the invitation-only email with an opt-in button.
 *                     No Firebase auth link is generated here.
 *                     Stores a one-time opt-in token in Firestore.
 *
 * sendArtistAuthLink — called by /api/artist/optin after the band clicks
 *                      opt-in. Generates the Firebase magic link and emails it.
 *
 * Auth is the caller's responsibility — these functions perform no session check.
 */

import { randomUUID } from 'crypto';
import { adminAuth, adminDb } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// ── Shared email sender ────────────────────────────────────────────────────

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY || (import.meta as any).env?.RESEND_API_KEY;
  const from   = process.env.RESEND_FROM   || (import.meta as any).env?.RESEND_FROM
                 || 'Magna Arts Council <wfurgason@magnaarts.org>';

  if (!apiKey || apiKey === 're_your_key_here') {
    console.warn('[artistInvite] RESEND_API_KEY not configured — email skipped');
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: opts.to, subject: opts.subject, html: opts.html }),
    });
    const body = await res.text();
    console.log('[artistInvite] Resend response:', res.status, body);
    return res.ok ? { ok: true } : { ok: false, error: `Resend ${res.status}: ${body}` };
  } catch (err: any) {
    const msg = `sendEmail fetch threw: ${err?.message ?? err}`;
    console.error('[artistInvite]', msg);
    return { ok: false, error: msg };
  }
}

function minifyHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ── Invitation email (no auth link) ───────────────────────────────────────

function buildInvitationEmail(opts: {
  bandName: string;
  optinUrl: string;
  siteUrl:  string;
}): string {
  const { bandName, optinUrl, siteUrl } = opts;

  return minifyHtml(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You're Invited — Magna Local Artists</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a2456,#2d3e8e,#4a5fa8);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:12px;">Magna Arts Council</div>
          <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;line-height:1.2;">🎶 You're Invited to Join Local Artists</h1>
          <p style="margin:12px 0 0;font-size:15px;color:rgba(255,255,255,0.9);">A free listing for your band on magnaarts.org</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#1a2456;line-height:1.6;">Hi <strong>${bandName}</strong>,</p>
          <p style="margin:0 0 24px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            The Magna Arts Council would like to feature <strong>${bandName}</strong> in the
            <strong>Local Artists</strong> directory on magnaarts.org — a public page where
            community members can discover local bands and stream your music.
          </p>

          <!-- What's included -->
          <div style="background:#f0f4ff;border:1.5px solid #c7d2fe;border-radius:8px;padding:20px 24px;margin:0 0 28px;">
            <div style="font-size:13px;font-weight:700;color:#3730a3;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.06em;">What's Included</div>
            <ul style="margin:0;padding-left:18px;font-size:14px;color:#4338ca;line-height:1.9;">
              <li>A public band profile (photo, bio, genre, website &amp; social links)</li>
              <li>Up to 5 MP3 tracks in the rotating audio player on the Local Artists page</li>
              <li>Managed entirely by you — update your profile anytime via your Artist Portal</li>
            </ul>
          </div>

          <!-- Acceptable use -->
          <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:8px;padding:16px 20px;margin:0 0 28px;">
            <div style="font-size:12px;font-weight:700;color:#92400e;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Acceptable Use</div>
            <p style="margin:0;font-size:13px;color:#78350f;line-height:1.7;">
              Tracks must be radio-edit versions and free of explicit content. You retain full rights to your music.
              By uploading, you grant the Magna Arts Council a non-exclusive, royalty-free license to stream your
              tracks on magnaarts.org. The Arts Council reserves the right to remove content that violates this policy.
            </p>
          </div>

          <!-- How it works -->
          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 28px;">
            <div style="font-size:12px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">How It Works</div>
            <p style="margin:0;font-size:13px;color:#166534;line-height:1.75;">
              When you're ready to set up your profile, click <strong>Opt In</strong> below.
              We'll immediately send a secure sign-in link to this email address.
              That link is <strong>good for 6 hours</strong>, so click Opt In only when
              you have a few minutes to complete your profile. No password required — ever.
            </p>
          </div>

          <!-- Opt-in CTA -->
          <div style="text-align:center;margin:32px 0;">
            <a href="${optinUrl}" style="display:inline-block;background:#2d3e8e;color:#fff;font-weight:700;font-size:16px;padding:16px 40px;border-radius:8px;text-decoration:none;">Opt In →</a>
          </div>

          <!-- Security note -->
          <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:8px;padding:14px 18px;margin:0 0 24px;">
            <div style="font-size:12px;color:#64748b;line-height:1.7;">
              <strong>Security tip:</strong> The Opt In button is tied to this email address only.
              Do not forward this email — anyone who clicks the button will receive a sign-in link
              for your artist account.
            </div>
          </div>

          <!-- Questions -->
          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:14px;color:#166534;">
              Questions? Email <a href="mailto:wfurgason@magnaarts.org" style="color:#16a34a;">wfurgason@magnaarts.org</a>
            </div>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#1a2456;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">
            Magna Arts Council · Magna, Utah<br>
            <a href="${siteUrl}" style="color:rgba(255,255,255,0.85);text-decoration:underline;">${siteUrl}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`);
}

// ── Auth link email (sent after opt-in) ───────────────────────────────────

function buildAuthLinkEmail(opts: {
  bandName:    string;
  magicLink:   string;
  isReturning: boolean;
  siteUrl:     string;
}): string {
  const { bandName, magicLink, isReturning, siteUrl } = opts;

  const headerTitle = isReturning ? '🎶 Sign In to Your Artist Portal' : '🎶 Your Artist Portal Access Link';
  const ctaLabel    = isReturning ? 'Sign In to Portal →' : 'Create My Artist Profile →';
  const bodyIntro   = isReturning
    ? `Here is your sign-in link for the Magna Artist Portal. It is good for 6 hours.`
    : `You opted in — great! Click the button below to create your artist profile. This link is good for <strong>6 hours</strong> from when you clicked Opt In.`;

  return minifyHtml(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${headerTitle}</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a2456,#2d3e8e,#4a5fa8);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:12px;">Magna Arts Council</div>
          <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;line-height:1.2;">${headerTitle}</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#1a2456;line-height:1.6;">Hi <strong>${bandName}</strong>,</p>
          <p style="margin:0 0 28px;font-size:15px;color:#5a5a7a;line-height:1.65;">${bodyIntro}</p>

          <!-- CTA -->
          <div style="text-align:center;margin:32px 0;">
            <a href="${magicLink}" style="display:inline-block;background:#2d3e8e;color:#fff;font-weight:700;font-size:16px;padding:16px 36px;border-radius:8px;text-decoration:none;">${ctaLabel}</a>
          </div>

          <!-- Warning -->
          <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:8px;padding:14px 18px;margin:0 0 24px;">
            <div style="font-size:12px;color:#64748b;line-height:1.7;">
              <strong>⚠️ This link expires in 6 hours</strong> and can only be used once.
              If it expires, return to <strong>magnaarts.org/artist/login</strong> and enter
              your email — we'll send you a fresh link. No password needed.<br><br>
              <strong>Security tip:</strong> Do not forward this email — the link signs in whoever clicks it.
            </div>
          </div>

          <!-- Questions -->
          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:14px;color:#166534;">
              Questions? Email <a href="mailto:wfurgason@magnaarts.org" style="color:#16a34a;">wfurgason@magnaarts.org</a>
            </div>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#1a2456;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">
            Magna Arts Council · Magna, Utah<br>
            <a href="${siteUrl}" style="color:rgba(255,255,255,0.85);text-decoration:underline;">${siteUrl}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`);
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface SendArtistInviteOptions {
  bandId: string;
  email:  string;
  bandName: string;
  /** Pass existing artist status if you already have it — skips the Firestore read */
  existingStatus?: string;
}

export interface SendArtistInviteResult {
  ok: boolean;
  isReturning: boolean;
  error?: string;
}

/**
 * Step 1 — Send the invitation email with an opt-in button.
 * Stores a one-time token in Firestore under artists/{bandId}/optinTokens/{token}.
 * Does NOT generate a Firebase auth link.
 */
export async function sendArtistInvite(opts: SendArtistInviteOptions): Promise<SendArtistInviteResult> {
  const { bandId, email, bandName, existingStatus } = opts;
  const siteUrl = process.env.SITE_URL || (import.meta as any).env?.SITE_URL || 'https://magnaarts.org';

  let status = existingStatus;
  if (status === undefined) {
    const snap = await adminDb.collection('artists').doc(bandId).get();
    status = snap.exists ? snap.data()?.status : undefined;
  }
  const isReturning = status === 'approved';

  // Generate a one-time opt-in token
  const token = randomUUID();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days — plenty of time to decide

  await adminDb
    .collection('artists').doc(bandId)
    .collection('optinTokens').doc(token)
    .set({ email, bandId, isReturning, expiresAt, usedAt: null, createdAt: FieldValue.serverTimestamp() });

  const optinUrl = `${siteUrl}/artist/optin?token=${token}`;

  const subject = `🎶 You're invited to join the Magna Local Artists directory`;
  const html    = buildInvitationEmail({ bandName, optinUrl, siteUrl });

  const result = await sendEmail({ to: email, subject, html });
  return { ok: result.ok, isReturning, error: result.error };
}

/**
 * Step 2 — Called by /api/artist/optin after validating the token.
 * Generates the Firebase magic link and sends the auth email.
 */
export async function sendArtistAuthLink(opts: {
  bandId:      string;
  email:       string;
  bandName:    string;
  isReturning: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  const { bandId, email, bandName, isReturning } = opts;
  const siteUrl = process.env.SITE_URL || (import.meta as any).env?.SITE_URL || 'https://magnaarts.org';

  const continueUrl = isReturning
    ? `${siteUrl}/artist/portal`
    : `${siteUrl}/artist/register?bandId=${bandId}`;

  let magicLink: string;
  try {
    magicLink = await adminAuth.generateSignInWithEmailLink(email, {
      url:             continueUrl,
      handleCodeInApp: true,
    });
  } catch (err: any) {
    const msg = `generateSignInWithEmailLink failed: ${err?.message ?? err}`;
    console.error('[sendArtistAuthLink]', msg);
    return { ok: false, error: msg };
  }

  const subject = isReturning
    ? `Sign in to your Magna Artist Portal — ${bandName}`
    : `🎶 Your Magna Artist Portal access link`;

  const html = buildAuthLinkEmail({ bandName, magicLink, isReturning, siteUrl });
  return sendEmail({ to: email, subject, html });
}
