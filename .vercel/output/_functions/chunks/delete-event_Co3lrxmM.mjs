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
    const { eventId } = await request.json();
    const eventDoc = await adminDb.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      return new Response(JSON.stringify({ error: "Event not found" }), { status: 404 });
    }
    const data = eventDoc.data();
    const { submissionType, submissionId, shellId } = data;
    const batch = adminDb.batch();
    batch.delete(adminDb.collection("events").doc(eventId));
    if (submissionType === "band_application") {
      const sid = shellId || eventId;
      batch.update(adminDb.collection("park_events").doc(sid), {
        status: "confirmed",
        publishedAt: null
      });
      if (data.bandId) {
        batch.update(adminDb.collection("band_applications").doc(data.bandId), {
          status: "assigned"
        });
      }
    } else if (submissionType === "open_mic") {
      const sid = shellId || eventId;
      batch.update(adminDb.collection("open_mic_events").doc(sid), {
        status: "shell",
        publishedAt: null
      });
    } else if (submissionType === "art_night") {
      const sid = shellId || eventId;
      batch.update(adminDb.collection("art_night_events").doc(sid), {
        status: "shell",
        publishedAt: null
      });
    } else if (submissionType === "band") {
      batch.update(adminDb.collection("band_applications").doc(submissionId), {
        status: "approved",
        eventId: null
      });
    } else {
      if (submissionId) {
        batch.update(adminDb.collection("program_submissions").doc(submissionId), {
          status: "approved",
          eventId: null
        });
      }
    }
    await batch.commit();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("delete-event error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
