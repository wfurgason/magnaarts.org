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
    const { shellId } = await request.json();
    if (!shellId) return new Response(JSON.stringify({ error: "shellId required" }), { status: 400 });
    const shellRef = adminDb.collection("festival_events").doc(shellId);
    const shellSnap = await shellRef.get();
    if (!shellSnap.exists) return new Response(JSON.stringify({ error: "Shell not found" }), { status: 404 });
    const shell = shellSnap.data();
    const rawBands = shell.bands || [];
    const enrichedBands = await Promise.all(
      rawBands.map(async (b) => {
        if (!b.bandId) {
          return { slot: b.slot, time: b.time || null, bandId: null, bandName: null, confirmed: false };
        }
        const bandDoc = await adminDb.collection("band_applications").doc(b.bandId).get();
        const band = bandDoc.exists ? bandDoc.data() : {};
        return {
          slot: b.slot,
          time: b.time || null,
          bandId: b.bandId,
          bandName: b.bandName || band.band_name || null,
          confirmed: b.confirmed || false,
          bio: band.bio || null,
          genre: band.genre || null,
          website: band.website || null,
          musicLink: band.music_link || null,
          photoUrl: band.promo_photo_url || null,
          memberCount: band.member_count || null,
          contactName: band.contact_name || null,
          contactEmail: band.contact_email || null
        };
      })
    );
    await adminDb.collection("events").doc(shellId).set({
      title: shell.title,
      eventDate: Timestamp.fromDate(/* @__PURE__ */ new Date(shell.date + "T" + timeToISO(shell.startTime))),
      eventTime: shell.startTime,
      endTime: shell.endTime || null,
      venueName: shell.venue,
      venueAddress: shell.address,
      description: shell.description || "",
      image: shell.image || null,
      eventType: "arts_festival",
      submissionType: "festival",
      bands: enrichedBands,
      isFree: true,
      status: "published",
      publishedBy: publisher.email,
      publishedAt: FieldValue.serverTimestamp()
    }, { merge: false });
    await shellRef.update({
      status: "published",
      publishedBy: publisher.email,
      publishedAt: FieldValue.serverTimestamp()
    });
    return new Response(JSON.stringify({ success: true, eventId: shellId }), { status: 200 });
  } catch (error) {
    console.error("publish-festival error:", error);
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
    return "12:00:00";
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
