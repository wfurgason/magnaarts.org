import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// ── Fee calculation ────────────────────────────────────────────────────────
const BASE_FEES: Record<string, number> = {
  'Individual Artist': 25,
  'Food Vendor': 100,
  'Retail / Franchise / non-profit': 50,
  'Political': 75,
};

function calcTotal(vendorType: string, electricity: string, water: string): number {
  const base = BASE_FEES[vendorType] ?? 0;
  const elec = electricity === 'yes' ? 10 : 0;
  const wat  = water === 'yes' ? 10 : 0;
  return base + elec + wat;
}

// ── Email sender (Resend REST API — no package needed) ─────────────────────
async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const from   = import.meta.env.RESEND_FROM || 'Magna Arts Festival <festival@magnaarts.org>';

  console.log('[vendor-action] sendEmail called — to:', opts.to, '| from:', from, '| key set:', !!apiKey);

  if (!apiKey || apiKey === 're_your_key_here') {
    const msg = 'RESEND_API_KEY not configured — email skipped';
    console.warn('[vendor-action]', msg);
    return { ok: false, error: msg };
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
    console.log('[vendor-action] Resend response:', res.status, body);

    if (!res.ok) {
      return { ok: false, error: `Resend ${res.status}: ${body}` };
    }

    return { ok: true };
  } catch (err: any) {
    const msg = `sendEmail fetch threw: ${err?.message ?? err}`;
    console.error('[vendor-action]', msg);
    return { ok: false, error: msg };
  }
}

// ── Email templates ────────────────────────────────────────────────────────

function approvalEmail(opts: {
  contactName: string;
  companyName: string;
  vendorType: string;
  total: number;
  electricity: string;
  water: string;
  locationRequest?: string;
  siteUrl: string;
}): string {
  const { contactName, companyName, vendorType, total, electricity, water, locationRequest, siteUrl } = opts;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vendor Application Approved</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#a86300,#c87e0a,#e8a020);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:12px;">Magna Main Street Arts Festival</div>
          <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">🎉 You're Approved!</h1>
          <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.9);">Your vendor application has been accepted.</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#1a2456;line-height:1.6;">Hi <strong>${contactName}</strong>,</p>
          <p style="margin:0 0 20px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            Great news — the festival committee has approved <strong>${companyName}</strong> as a <strong>${vendorType}</strong> at the Magna Main Street Arts Festival on <strong>Friday, August 15, 2026</strong>.
          </p>

          <!-- Fee box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:10px;margin:0 0 28px;">
            <tr><td style="padding:24px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#92400e;margin-bottom:16px;">Your Booth Fee</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#78350f;">Booth Space (10&times;10 ft)</td>
                  <td style="padding:6px 0;font-size:14px;color:#78350f;text-align:right;">${BASE_FEES[vendorType] ?? 0}</td>
                </tr>
                ${electricity === 'yes' ? `<tr>
                  <td style="padding:6px 0;font-size:14px;color:#78350f;">Electricity</td>
                  <td style="padding:6px 0;font-size:14px;color:#78350f;text-align:right;">$10</td>
                </tr>` : ''}
                ${water === 'yes' ? `<tr>
                  <td style="padding:6px 0;font-size:14px;color:#78350f;">Water</td>
                  <td style="padding:6px 0;font-size:14px;color:#78350f;text-align:right;">$10</td>
                </tr>` : ''}
                <tr>
                  <td colspan="2" style="border-top:1.5px solid #fde68a;padding-top:10px;margin-top:6px;"></td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:16px;font-weight:700;color:#92400e;">Total Due</td>
                  <td style="padding:4px 0;font-size:22px;font-weight:900;color:#c87e0a;text-align:right;">${total}</td>
                </tr>
              </table>
              <div style="font-size:12px;color:#78350f;margin-top:12px;">Payment confirms your space. <strong>Space numbers are assigned after payment is received.</strong></div>
            </td></tr>
          </table>

          ${locationRequest ? `
          <div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#1e40af;margin-bottom:6px;">Your Space Request</div>
            <div style="font-size:14px;color:#1e3a8a;">${locationRequest}</div>
            <div style="font-size:12px;color:#3b82f6;margin-top:4px;">We'll do our best to honor your preference — final assignment confirmed after payment.</div>
          </div>` : ''}

          <h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#1a2456;">What Happens Next</h2>
          <ol style="margin:0 0 16px;padding-left:20px;color:#5a5a7a;font-size:15px;line-height:1.8;">
            <li>You will receive an invoice from <strong>service@paypal.com</strong>. Please select the <strong>&ldquo;View Your Invoice&rdquo;</strong> button to pay your festival fees.</li>
            <li>Once we have verified your payment you&rsquo;ll receive a confirmation email with your <strong>assigned space number</strong> and setup details.</li>
          </ol>
          <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:8px;padding:14px 18px;margin:0 0 28px;font-size:13px;color:#9a3412;line-height:1.7;">
            <strong>⚠️ Important:</strong> Please pay your invoice as soon as possible to secure your booth space. No spaces will be assigned until fees are paid. If all spaces are filled, any approved vendors with unpaid fees will not be able to attend.
          </div>

          <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 28px;">
            <div style="font-size:14px;color:#166534;line-height:1.6;">
              <strong>Questions?</strong> Email us at <a href="mailto:festival@magnaarts.org" style="color:#16a34a;">festival@magnaarts.org</a>
            </div>
          </div>

          <p style="margin:0;font-size:15px;color:#5a5a7a;line-height:1.65;">We're excited to have you at the festival. See you on August 15th, 2026! 🎨</p>

        </td></tr>

        <!-- Footer -->
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
</html>`;
}

function paidConfirmationEmail(opts: {
  contactName: string;
  companyName: string;
  spaceNumber: string;
  vendorType: string;
  needsElectricity: string;
  needsWater: string;
  siteUrl: string;
}): string {
  const { contactName, companyName, spaceNumber, vendorType, needsElectricity, needsWater, siteUrl } = opts;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Payment Confirmed — You're All Set!</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#166534,#16a34a,#22c55e);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:12px;">Magna Main Street Arts Festival</div>
          <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">✅ Payment Confirmed!</h1>
          <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.9);">Your spot at the festival is locked in.</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;color:#1a2456;line-height:1.6;">Hi <strong>${contactName}</strong>,</p>
          <p style="margin:0 0 28px;font-size:15px;color:#5a5a7a;line-height:1.65;">
            Your payment has been received and verified. <strong>${companyName}</strong> is officially confirmed for the Magna Main Street Arts Festival — you're all set!
          </p>

          <!-- Space number callout -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a2456;border-radius:12px;margin:0 0 32px;">
            <tr><td style="padding:32px;text-align:center;">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:10px;">Your Assigned Space</div>
              <div style="font-size:64px;font-weight:900;color:#e8a020;line-height:1;">${spaceNumber}</div>
              <div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:8px;">Look for this number on the day-of layout map</div>
            </td></tr>
          </table>

          <!-- Festival details -->
          <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a2456;">Festival Day Details</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;border-radius:8px;margin:0 0 24px;">
            <tr><td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a5a7a;width:140px;">📍 Location</td>
                  <td style="padding:6px 0;font-size:14px;color:#1a2456;font-weight:600;">Historic Magna Main Street</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a5a7a;">📅 Date</td>
                  <td style="padding:6px 0;font-size:14px;color:#1a2456;font-weight:600;">Friday, August 15, 2026</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a5a7a;">⏰ Hours</td>
                  <td style="padding:6px 0;font-size:14px;color:#1a2456;font-weight:600;">10:00 AM – 6:00 PM</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a5a7a;">🕘 Setup Window</td>
                  <td style="padding:6px 0;font-size:14px;color:#1a2456;font-weight:600;">9:00 AM – 10:00 AM</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a5a7a;">📐 Booth Size</td>
                  <td style="padding:6px 0;font-size:14px;color:#1a2456;font-weight:600;">10 × 10 ft</td>
                </tr>
                ${needsElectricity === 'yes' ? `<tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a5a7a;">⚡ Electricity</td>
                  <td style="padding:6px 0;font-size:14px;color:#16a34a;font-weight:600;">✓ Requested — we'll have it ready</td>
                </tr>` : ''}
                ${needsWater === 'yes' ? `<tr>
                  <td style="padding:6px 0;font-size:14px;color:#5a5a7a;">💧 Water</td>
                  <td style="padding:6px 0;font-size:14px;color:#16a34a;font-weight:600;">✓ Requested — we'll have it ready</td>
                </tr>` : ''}
              </table>
            </td></tr>
          </table>

          <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
            <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:6px;">⚠️ Important Reminders</div>
            <ul style="margin:0;padding-left:18px;font-size:13px;color:#78350f;line-height:1.8;">
              <li>No vehicles on the street after 10:00 AM or before 6:00 PM</li>
              <li>Bring your own booth materials — awning, tables, chairs, displays, and signage</li>
              <li>All products must comply with local laws; counterfeit merchandise is prohibited</li>
              <li>Booth must remain open and staffed for the full duration of the festival</li>
            </ul>
          </div>

          <p style="margin:0 0 8px;font-size:15px;color:#5a5a7a;line-height:1.65;">Questions? Reach us at <a href="mailto:magnaartsfestival@gmail.com" style="color:#c87e0a;font-weight:600;">magnaartsfestival@gmail.com</a></p>
          <p style="margin:0;font-size:15px;color:#5a5a7a;line-height:1.65;">Can't wait to see you there! 🎨🎶</p>

        </td></tr>

        <!-- Footer -->
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
</html>`;
}

// ── API Route ──────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let reviewer: import('firebase-admin/auth').DecodedIdToken;
  try {
    reviewer = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, id } = body;

    if (!['approve', 'unapprove', 'reject', 'mark-paid', 'edit', 'delete'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }

    // Fetch the vendor doc
    const docRef  = adminDb.collection('vendor_applications').doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return new Response(JSON.stringify({ error: 'Vendor not found' }), { status: 404 });
    }
    const vendor = docSnap.data()!;

    const siteUrl    = import.meta.env.SITE_URL || 'https://magnaarts.org';
    const paypalLink = import.meta.env.PAYPAL_ME_LINK || 'https://paypal.me/MagnaArtsFestival';
    const venmo      = import.meta.env.VENMO_HANDLE || '@MagnaArtsFestival';

    // ── EDIT ───────────────────────────────────────────────────────────
    if (action === 'edit') {
      const { vendorType, needsElectricity, needsWater } = body;
      if (!vendorType) {
        return new Response(JSON.stringify({ error: 'Vendor type required' }), { status: 400 });
      }
      await docRef.update({
        vendor_type:       vendorType,
        needs_electricity: needsElectricity || 'no',
        needs_water:       needsWater || 'no',
        editedBy:          reviewer.email,
        editedAt:          FieldValue.serverTimestamp(),
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── APPROVE ─────────────────────────────────────────────────────────────
    if (action === 'approve') {
      await docRef.update({
        status:     'approved',
        reviewedBy: reviewer.email,
        reviewedAt: FieldValue.serverTimestamp(),
      });

      const total = calcTotal(vendor.vendor_type, vendor.needs_electricity, vendor.needs_water);

      const emailResult = await sendEmail({
        to:      vendor.email,
        subject: `✓ Your Vendor Application is Approved — ${vendor.company_name}`,
        html:    approvalEmail({
          contactName:     vendor.contact_name,
          companyName:     vendor.company_name,
          vendorType:      vendor.vendor_type,
          total,
          electricity:     vendor.needs_electricity,
          water:           vendor.needs_water,
          locationRequest: vendor.location_request || undefined,
          siteUrl,
        }),
      });

      if (!emailResult.ok) {
        return new Response(JSON.stringify({
          success: true,
          emailError: emailResult.error,
        }), { status: 200 });
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── UNAPPROVE ────────────────────────────────────────────────────────────
    if (action === 'unapprove') {
      await docRef.update({
        status:     'pending',
        reviewedBy: null,
        reviewedAt: null,
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── REJECT ──────────────────────────────────────────────────────────────
    if (action === 'reject') {
      await docRef.update({
        status:     'rejected',
        reviewedBy: reviewer.email,
        reviewedAt: FieldValue.serverTimestamp(),
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── MARK PAID ───────────────────────────────────────────────────────────
    if (action === 'mark-paid') {
      const { spaceNumber, paymentMethod, paymentNote } = body;
      if (!spaceNumber) {
        return new Response(JSON.stringify({ error: 'Space number required' }), { status: 400 });
      }

      await docRef.update({
        status:        'paid',
        space_number:  spaceNumber,
        payment_method: paymentMethod || null,
        payment_note:   paymentNote || null,
        paidBy:        reviewer.email,
        paidAt:        FieldValue.serverTimestamp(),
      });

      await sendEmail({
        to:      vendor.email,
        subject: `✅ Payment Confirmed — Space ${spaceNumber} — ${vendor.company_name}`,
        html:    paidConfirmationEmail({
          contactName:      vendor.contact_name,
          companyName:      vendor.company_name,
          spaceNumber,
          vendorType:       vendor.vendor_type,
          needsElectricity: vendor.needs_electricity,
          needsWater:       vendor.needs_water,
          siteUrl,
        }),
      });

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── DELETE ───────────────────────────────────────────────────────────────
    if (action === 'delete') {
      await adminDb.collection('vendor_applications').doc(id).delete();
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Unhandled action' }), { status: 400 });

  } catch (error) {
    console.error('[vendor-action] error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
