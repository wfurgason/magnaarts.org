import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  // ── Auth ──────────────────────────────────────────────────────────
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
    const body = await request.json();
    const {
      id,
      title,
      sublabel,
      meta,
      href,
      badge,
      icon,
      colorClass,
      ctaText,
      ctaExternal,
      expiresDate,
      active,
      showOn,
    } = body;

    // Build the update/create payload
    const data: Record<string, any> = {
      updatedAt: Timestamp.now(),
    };

    if (title        !== undefined) data.title        = String(title).trim();
    if (sublabel     !== undefined) data.sublabel      = String(sublabel).trim();
    if (meta         !== undefined) data.meta          = String(meta).trim();
    if (href         !== undefined) data.href          = String(href).trim();
    if (badge        !== undefined) data.badge         = String(badge).trim();
    if (icon         !== undefined) data.icon          = String(icon).trim();
    if (colorClass   !== undefined) data.colorClass    = String(colorClass).trim();
    if (ctaText      !== undefined) data.ctaText       = String(ctaText).trim();
    if (ctaExternal  !== undefined) data.ctaExternal   = Boolean(ctaExternal);
    if (active       !== undefined) data.active        = Boolean(active);
    if (showOn       !== undefined) data.showOn        = String(showOn).trim();

    if (expiresDate !== undefined && expiresDate) {
      const d = new Date(expiresDate);
      if (!isNaN(d.getTime())) {
        // Store as noon UTC of the day AFTER the entered date.
        // This ensures the item is visible for the full entered day in Mountain
        // Time and expires early the following morning (≈ 6 AM MDT).
        d.setUTCDate(d.getUTCDate() + 1);
        d.setUTCHours(12, 0, 0, 0);
        data.expiresDate = Timestamp.fromDate(d);
      }
    }

    if (id) {
      // ── Update existing document ──
      await adminDb.collection('pinned_content').doc(String(id)).update(data);
      return new Response(JSON.stringify({ success: true, id }), { status: 200 });
    } else {
      // ── Create new document ──
      data.createdAt = Timestamp.now();
      if (data.active === undefined) data.active = true;
      const ref = await adminDb.collection('pinned_content').add(data);
      return new Response(JSON.stringify({ success: true, id: ref.id }), { status: 200 });
    }
  } catch (err) {
    console.error('save-pinned-item error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
