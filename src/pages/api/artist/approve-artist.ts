import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// ── Email sender (mirrors vendor-action.ts pattern) ────────────────────────
async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const from   = 'Magna Arts Council <wfurgason@magnaarts.org>';

  if (!apiKey || apiKey === 're_your_key_here') {
    console.warn('[approve-artist] RESEND_API_KEY not configured — email skipped');
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
    console.log('[approve-artist] Resend response:', res.status, body);
    return res.ok ? { ok: true } : { ok: false, error: `Resend ${res.status}: ${body}` };
  } catch (err: any) {
    const msg = `sendEmail fetch threw: ${err?.message ?? err}`;
    console.error('[approve-artist]', msg);
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

// ── Email templates ────────────────────────────────────────────────────────

// ── Music: approved with tracks ──
function approvedWithTracksEmail(opts: { bandName: string; siteUrl: string }): string {
  const { bandName, siteUrl } = opts;
  return minifyHtml(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You're Live on Local Artists</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#1a2456,#2d3e8e,#4a5fa8);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:12px;">Magna Arts Council</div>
          <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">🎶 You're Live!</h1>
          <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.9);">Your artist profile is now on the Local Artists directory.</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#1a2456;line-height:1.6;">Hi <strong>${bandName}</strong>,</p>
          <p style="margin:0 0 20px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            Your profile has been approved and your tracks are now streaming on the
            <a href="${siteUrl}/local-artists" style="color:#2d3e8e;font-weight:600;">Local Artists</a> page.
            Community members can discover your music and learn more about your band.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${siteUrl}/local-artists" style="display:inline-block;background:#2d3e8e;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">View Your Listing →</a>
          </div>
          <p style="margin:0 0 16px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            You can update your bio, photo, and tracks anytime. Just sign in to your
            <a href="${siteUrl}/artist/login" style="color:#2d3e8e;font-weight:600;">Artist Portal</a>
            using the email address you registered with — we'll send you a one-click sign-in link.
          </p>
          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:14px;color:#166534;line-height:1.6;">
              Questions? Email us at <a href="mailto:wfurgason@magnaarts.org" style="color:#16a34a;">wfurgason@magnaarts.org</a>
            </div>
          </div>
          <p style="margin:0;font-size:15px;color:#5a5a7a;line-height:1.65;">Thank you for being part of the Magna arts community! 🎨</p>
        </td></tr>
        <tr><td style="background:#1a2456;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">
            Magna Arts Council · Magna, Utah<br>
            <a href="${siteUrl}" style="color:rgba(255,255,255,0.5);">${siteUrl}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`);
}

// ── Music: approved with no tracks ──
function approvedNoTracksEmail(opts: { bandName: string; siteUrl: string }): string {
  const { bandName, siteUrl } = opts;
  return minifyHtml(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Profile Approved — Upload a Track to Go Live</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7,#38bdf8);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:12px;">Magna Arts Council</div>
          <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">✅ Profile Approved!</h1>
          <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.9);">One more step — upload a track to go live.</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#1a2456;line-height:1.6;">Hi <strong>${bandName}</strong>,</p>
          <p style="margin:0 0 20px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            Your artist profile has been approved by the Magna Arts Council. To appear on the
            <a href="${siteUrl}/local-artists" style="color:#0284c7;font-weight:600;">Local Artists</a> directory,
            upload at least one MP3 track from your Artist Portal.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${siteUrl}/artist/login" style="display:inline-block;background:#0284c7;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">Go to Artist Portal →</a>
          </div>
          <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:13px;color:#92400e;line-height:1.7;">
              <strong>Reminder:</strong> You can upload up to 5 MP3 tracks (radio edits only).
              You retain all rights to your music — by uploading, you grant the Magna Arts Council
              a non-exclusive license to stream them on magnaarts.org.
            </div>
          </div>
          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:14px;color:#166534;">
            Questions? Email <a href="mailto:wfurgason@magnaarts.org" style="color:#16a34a;">wfurgason@magnaarts.org</a>
            </div>
          </div>
        </td></tr>
        <tr><td style="background:#1a2456;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">
            Magna Arts Council · Magna, Utah<br>
            <a href="${siteUrl}" style="color:rgba(255,255,255,0.5);">${siteUrl}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`);
}

// ── Visual: approved with images ──
function approvedWithImagesEmail(opts: { bandName: string; siteUrl: string }): string {
  const { bandName, siteUrl } = opts;
  return minifyHtml(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>You're Live on Local Artists</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#1a2456,#2d3e8e,#4a5fa8);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:12px;">Magna Arts Council</div>
          <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">🎨 You're Live!</h1>
          <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.9);">Your artist profile is now on the Local Artists directory.</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#1a2456;line-height:1.6;">Hi <strong>${bandName}</strong>,</p>
          <p style="margin:0 0 20px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            Your profile has been approved and your artwork is now visible on the
            <a href="${siteUrl}/local-artists" style="color:#2d3e8e;font-weight:600;">Local Artists</a> page.
            Community members can discover your work and learn more about you.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${siteUrl}/local-artists" style="display:inline-block;background:#2d3e8e;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">View Your Listing →</a>
          </div>
          <p style="margin:0 0 16px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            You can update your bio, photo, and images anytime. Just sign in to your
            <a href="${siteUrl}/artist/login" style="color:#2d3e8e;font-weight:600;">Artist Portal</a>
            using the email address you registered with — we'll send you a one-click sign-in link.
          </p>
          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:14px;color:#166534;line-height:1.6;">
              Questions? Email us at <a href="mailto:wfurgason@magnaarts.org" style="color:#16a34a;">wfurgason@magnaarts.org</a>
            </div>
          </div>
          <p style="margin:0;font-size:15px;color:#5a5a7a;line-height:1.65;">Thank you for being part of the Magna arts community! 🎨</p>
        </td></tr>
        <tr><td style="background:#1a2456;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">
            Magna Arts Council · Magna, Utah<br>
            <a href="${siteUrl}" style="color:rgba(255,255,255,0.5);">${siteUrl}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`);
}

// ── Visual: approved with no images ──
function approvedNoImagesEmail(opts: { bandName: string; siteUrl: string }): string {
  const { bandName, siteUrl } = opts;
  return minifyHtml(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Profile Approved — Upload Images to Go Live</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#0369a1,#0284c7,#38bdf8);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:12px;">Magna Arts Council</div>
          <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">✅ Profile Approved!</h1>
          <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.9);">One more step — upload images to go live.</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#1a2456;line-height:1.6;">Hi <strong>${bandName}</strong>,</p>
          <p style="margin:0 0 20px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            Your artist profile has been approved by the Magna Arts Council. To appear on the
            <a href="${siteUrl}/local-artists" style="color:#0284c7;font-weight:600;">Local Artists</a> directory,
            upload at least one image of your work from your Artist Portal.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${siteUrl}/artist/login" style="display:inline-block;background:#0284c7;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">Go to Artist Portal →</a>
          </div>
          <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:13px;color:#92400e;line-height:1.7;">
              <strong>Reminder:</strong> You can upload up to 10 images of your artwork.
              Images must be your original work or content you have the rights to display.
              You retain full rights to your work — by uploading, you grant the Magna Arts Council
              a non-exclusive license to display them on magnaarts.org.
            </div>
          </div>
          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:14px;color:#166534;">
            Questions? Email <a href="mailto:wfurgason@magnaarts.org" style="color:#16a34a;">wfurgason@magnaarts.org</a>
            </div>
          </div>
        </td></tr>
        <tr><td style="background:#1a2456;padding:24px 40px;text-align:center;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.6);line-height:1.6;">
            Magna Arts Council · Magna, Utah<br>
            <a href="${siteUrl}" style="color:rgba(255,255,255,0.5);">${siteUrl}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`);
}

// ── Route ──────────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify admin session cookie
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
    const { bandId, action } = await request.json();

    if (!bandId) {
      return new Response(JSON.stringify({ error: 'bandId required' }), { status: 400 });
    }
    if (!['approve', 'reject'].includes(action)) {
      return new Response(JSON.stringify({ error: 'action must be approve or reject' }), { status: 400 });
    }

    const artistRef = adminDb.collection('artists').doc(bandId);
    const artistSnap = await artistRef.get();
    if (!artistSnap.exists) {
      return new Response(JSON.stringify({ error: 'Artist not found' }), { status: 404 });
    }
    const artist = artistSnap.data()!;

    const siteUrl = import.meta.env.SITE_URL || 'https://magnaarts.org';

    // ── APPROVE ────────────────────────────────────────────────────────────
    if (action === 'approve') {
      const artistType: 'music' | 'visual' = artist.artist_type === 'visual' ? 'visual' : 'music';

      // Check the relevant subcollection for the artist type
      const uploadsSnap = artistType === 'visual'
        ? await artistRef.collection('images').get()
        : await artistRef.collection('tracks').get();
      const uploadCount = uploadsSnap.size;
      const shouldBeVisible = uploadCount >= 1;

      await artistRef.update({
        status:  'approved',
        visible: shouldBeVisible,
        approvedAt: FieldValue.serverTimestamp(),
      });

      // Send appropriate approval email based on type and upload status
      let html: string;
      let subject: string;

      if (artistType === 'visual') {
        html = shouldBeVisible
          ? approvedWithImagesEmail({ bandName: artist.band_name, siteUrl })
          : approvedNoImagesEmail({ bandName: artist.band_name, siteUrl });
        subject = shouldBeVisible
          ? `🎨 You're live on the Magna Local Artists directory!`
          : `✅ Profile Approved — Upload images to go live`;
      } else {
        html = shouldBeVisible
          ? approvedWithTracksEmail({ bandName: artist.band_name, siteUrl })
          : approvedNoTracksEmail({ bandName: artist.band_name, siteUrl });
        subject = shouldBeVisible
          ? `🎶 You're live on the Magna Local Artists directory!`
          : `✅ Profile Approved — Upload a track to go live`;
      }

      const emailResult = await sendEmail({ to: artist.email, subject, html });

      return new Response(JSON.stringify({
        success: true,
        visible: shouldBeVisible,
        uploadCount,
        artistType,
        ...(emailResult.ok ? {} : { emailError: emailResult.error }),
      }), { status: 200 });
    }

    // ── REJECT ─────────────────────────────────────────────────────────────
    if (action === 'reject') {
      await artistRef.update({
        status:  'rejected',
        visible: false,
        rejectedAt: FieldValue.serverTimestamp(),
      });
      // No automated email — admin follows up directly with specific feedback
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Unhandled action' }), { status: 400 });

  } catch (error) {
    console.error('[approve-artist] error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
