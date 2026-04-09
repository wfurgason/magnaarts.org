import { adminAuth, adminDb } from './firebase-admin_xK7nQJo9.mjs';
import { Timestamp } from 'firebase-admin/firestore';

const POST = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("session")?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
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
      showOn
    } = body;
    const data = {
      updatedAt: Timestamp.now()
    };
    if (title !== void 0) data.title = String(title).trim();
    if (sublabel !== void 0) data.sublabel = String(sublabel).trim();
    if (meta !== void 0) data.meta = String(meta).trim();
    if (href !== void 0) data.href = String(href).trim();
    if (badge !== void 0) data.badge = String(badge).trim();
    if (icon !== void 0) data.icon = String(icon).trim();
    if (colorClass !== void 0) data.colorClass = String(colorClass).trim();
    if (ctaText !== void 0) data.ctaText = String(ctaText).trim();
    if (ctaExternal !== void 0) data.ctaExternal = Boolean(ctaExternal);
    if (active !== void 0) data.active = Boolean(active);
    if (showOn !== void 0) data.showOn = String(showOn).trim();
    if (expiresDate !== void 0 && expiresDate) {
      const d = new Date(expiresDate);
      if (!isNaN(d.getTime())) {
        data.expiresDate = Timestamp.fromDate(d);
      }
    }
    if (id) {
      await adminDb.collection("pinned_content").doc(String(id)).update(data);
      return new Response(JSON.stringify({ success: true, id }), { status: 200 });
    } else {
      data.createdAt = Timestamp.now();
      if (data.active === void 0) data.active = true;
      const ref = await adminDb.collection("pinned_content").add(data);
      return new Response(JSON.stringify({ success: true, id: ref.id }), { status: 200 });
    }
  } catch (err) {
    console.error("save-pinned-item error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
