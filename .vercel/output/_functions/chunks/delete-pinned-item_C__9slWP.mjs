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
    const { id } = await request.json();
    if (!id || typeof id !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid id" }), { status: 400 });
    }
    await adminDb.collection("pinned_content").doc(id).delete();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("delete-pinned-item error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
