import { adminAuth, adminDb } from './firebase-admin_xK7nQJo9.mjs';

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
    const { id, fullName, email, phone, artsArea, projectDescription, materials, projectImageUrl } = body;
    if (!id || typeof id !== "string") {
      return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
    }
    const update = {};
    if (fullName !== void 0) update.fullName = fullName;
    if (email !== void 0) update.email = email;
    if (phone !== void 0) update.phone = phone;
    if (artsArea !== void 0) update.artsArea = artsArea;
    if (projectDescription !== void 0) update.projectDescription = projectDescription;
    if (materials !== void 0) update.materials = materials;
    if (projectImageUrl !== void 0) update.projectImageUrl = projectImageUrl;
    if (Object.keys(update).length === 0) {
      return new Response(JSON.stringify({ error: "No fields to update" }), { status: 400 });
    }
    await adminDb.collection("art_class_submissions").doc(id).update(update);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("update-presenter error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
