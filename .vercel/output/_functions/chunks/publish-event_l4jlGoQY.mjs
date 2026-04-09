import { adminAuth, adminDb } from './firebase-admin_xK7nQJo9.mjs';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

const POST = async ({ request, cookies }) => {
  const sessionCookie = cookies.get("session")?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  let publisher;
  try {
    publisher = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const {
      submissionId,
      submissionType,
      // 'band' | 'program'
      // Event display fields (filled by admin in publish modal)
      title,
      eventDate,
      // ISO string e.g. "2025-08-15"
      eventTime,
      // e.g. "7:00 PM"
      venueName,
      venueAddress,
      ticketUrl,
      rsvpUrl,
      posterUrl,
      description,
      // Carry-over from submission
      bandName,
      genre,
      musicLink
    } = await request.json();
    const collection = submissionType === "band" ? "band_applications" : "program_submissions";
    const eventRef = await adminDb.collection("events").add({
      title,
      eventDate: Timestamp.fromDate(new Date(eventDate)),
      eventTime,
      venueName,
      venueAddress,
      ticketUrl: ticketUrl || null,
      rsvpUrl: rsvpUrl || null,
      posterUrl: posterUrl || null,
      description,
      bandName: bandName || null,
      genre: genre || null,
      musicLink: musicLink || null,
      submissionId,
      submissionType,
      status: "published",
      publishedBy: publisher.email,
      publishedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp()
    });
    await adminDb.collection(collection).doc(submissionId).update({
      status: "published",
      eventId: eventRef.id,
      publishedBy: publisher.email,
      publishedAt: FieldValue.serverTimestamp()
    });
    return new Response(JSON.stringify({ success: true, eventId: eventRef.id }), { status: 200 });
  } catch (error) {
    console.error("publish-event error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
