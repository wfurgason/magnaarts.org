import { adminAuth, adminDb } from './firebase-admin_xK7nQJo9.mjs';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

const POST = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("session")?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  let publisher;
  try {
    publisher = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const { shellId } = await request.json();
    if (!shellId) {
      return new Response(JSON.stringify({ error: "shellId required" }), { status: 400 });
    }
    const shellDoc = await adminDb.collection("open_mic_events").doc(shellId).get();
    if (!shellDoc.exists) {
      return new Response(JSON.stringify({ error: "Open mic shell not found" }), { status: 404 });
    }
    const s = shellDoc.data();
    const batch = adminDb.batch();
    const eventDateObj = Timestamp.fromDate(/* @__PURE__ */ new Date(s.date + "T" + timeToISO(s.startTime)));
    const eventRef = adminDb.collection("events").doc(shellId);
    batch.set(eventRef, {
      title: s.title,
      eventDate: eventDateObj,
      date: s.date,
      displayDate: s.displayDate,
      eventTime: s.startTime,
      startTime: s.startTime,
      venueName: s.venue,
      venueAddress: s.address,
      venue: s.venue,
      address: s.address,
      eventType: "open_mic",
      category: "Open Mic",
      description: s.description || "",
      posterUrl: s.imageUrl || null,
      photoUrl: s.imageUrl || null,
      isFree: true,
      submissionType: "open_mic",
      publishedBy: publisher.email,
      publishedAt: FieldValue.serverTimestamp(),
      shellId
    });
    batch.update(adminDb.collection("open_mic_events").doc(shellId), {
      status: "published",
      publishedAt: FieldValue.serverTimestamp()
    });
    await batch.commit();
    return new Response(JSON.stringify({ success: true, eventId: shellId }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("publish-open-mic error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
function timeToISO(timeStr) {
  try {
    const [time, meridiem] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")}:00`;
  } catch {
    return "19:00:00";
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
