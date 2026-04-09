import { adminAuth, adminDb } from './firebase-admin_xK7nQJo9.mjs';
import { FieldValue } from 'firebase-admin/firestore';

const POST = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("session")?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  let creator;
  try {
    creator = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const claims = creator.customClaims;
  if (claims?.role !== "super_admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  try {
    const { email, password, displayName, role } = await request.json();
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName
    });
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      role: role || "board_member"
    });
    await adminDb.collection("admin_users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName,
      role: role || "board_member",
      createdBy: creator.email,
      createdAt: FieldValue.serverTimestamp()
    });
    return new Response(JSON.stringify({ success: true, uid: userRecord.uid }), { status: 200 });
  } catch (error) {
    console.error("create-user error:", error);
    return new Response(JSON.stringify({ error: error.message || "Server error" }), { status: 500 });
  }
};
const DELETE = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("session")?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  let caller;
  try {
    caller = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const claims = caller.customClaims;
  if (claims?.role !== "super_admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  try {
    const { uid } = await request.json();
    if (uid === caller.uid) {
      return new Response(JSON.stringify({ error: "Cannot delete your own account" }), { status: 400 });
    }
    await adminAuth.deleteUser(uid);
    await adminDb.collection("admin_users").doc(uid).delete();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
