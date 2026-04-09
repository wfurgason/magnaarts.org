import { adminAuth, adminDb } from './firebase-admin_xK7nQJo9.mjs';

const POST = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("session")?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const { shellId, collection } = await request.json();
    if (!shellId || !collection) {
      return new Response(JSON.stringify({ error: "shellId and collection required" }), { status: 400 });
    }
    const shellDoc = await adminDb.collection(collection).doc(shellId).get();
    if (!shellDoc.exists) {
      return new Response(JSON.stringify({ error: "Shell not found" }), { status: 404 });
    }
    const shellData = shellDoc.data();
    const batch = adminDb.batch();
    batch.delete(adminDb.collection("events").doc(shellId));
    if (collection === "park_events") {
      batch.update(adminDb.collection("park_events").doc(shellId), {
        status: "confirmed",
        publishedAt: null,
        publishedBy: null
      });
      if (shellData.bandId) {
        batch.update(adminDb.collection("band_applications").doc(shellData.bandId), {
          status: "assigned"
        });
      }
    } else if (collection === "festival_events") {
      batch.update(adminDb.collection("festival_events").doc(shellId), {
        status: "confirmed",
        publishedAt: null,
        publishedBy: null
      });
    } else if (collection === "art_night_events") {
      batch.update(adminDb.collection("art_night_events").doc(shellId), {
        status: "confirmed",
        publishedAt: null,
        publishedBy: null
      });
    } else {
      batch.update(adminDb.collection(collection).doc(shellId), {
        status: "shell",
        publishedAt: null
      });
    }
    await batch.commit();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("unpublish-event error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
