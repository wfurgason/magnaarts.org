import { adminAuth, adminDb } from './firebase-admin_xK7nQJo9.mjs';
import { FieldValue } from 'firebase-admin/firestore';

const POST = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("session")?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  let reviewer;
  try {
    reviewer = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const { id, collection, status } = await request.json();
    const allowed = ["band_applications", "program_submissions", "vendor_applications", "art_class_submissions"];
    if (!allowed.includes(collection)) {
      return new Response(JSON.stringify({ error: "Invalid collection" }), { status: 400 });
    }
    const allowedStatuses = ["approved", "rejected", "pending", "good_standing", "deleted", "assigned", "waitlisted", "paid", "contacted", "scheduled"];
    if (!allowedStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
    }
    await adminDb.collection(collection).doc(id).update({
      status,
      reviewedBy: reviewer.email,
      reviewedAt: FieldValue.serverTimestamp()
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("update-submission error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
