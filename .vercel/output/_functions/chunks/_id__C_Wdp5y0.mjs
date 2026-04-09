import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute, F as Fragment } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from './global_Hoz3rGEv.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const eventDoc = await adminDb.collection("events").doc(id).get();
  if (!eventDoc.exists) {
    return Astro2.redirect("/events");
  }
  const event = { id: eventDoc.id, ...eventDoc.data() };
  const isoDate = event.date || (event.eventDate?.toDate ? event.eventDate.toDate().toISOString().slice(0, 10) : null);
  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  const displayDate = isoDate ? (() => {
    const [y, m, d] = isoDate.split("-").map(Number);
    const monthName = new Date(y, m - 1, 1).toLocaleString("en-US", { month: "long" });
    return `${monthName} ${ordinal(d)}, ${y}`;
  })() : event.displayDate || "";
  const isFestival = event.eventType === "arts_festival";
  const vendorTypeIcon = {
    "Individual Artist": "🎨",
    "Food Vendor": "🌮",
    "Retail / Franchise / non-profit": "🛒",
    "Political": "📜"
  };
  let vendors = [];
  if (isFestival) {
    const vendorSnap = await adminDb.collection("vendor_applications").where("status", "in", ["approved", "paid"]).get();
    vendors = vendorSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter(
      (v) => (v.payment_status === "paid" || v.status === "paid") && (v.space_number || v.booth_number)
    );
  }
  const eventTime = event.eventTime || event.startTime || "";
  const endTime = event.endTime || null;
  const timeDisplay = isFestival && eventTime && endTime ? `${eventTime} – ${endTime}` : eventTime;
  const venueName = event.venueName || event.venue || "";
  const venueAddress = event.venueAddress || event.address || "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${event.title} — Magna Arts Council`, "description": event.description || `${event.title} at ${venueName} on ${displayDate}.`, "data-astro-cid-xoscxyy6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-xoscxyy6": true })} ${maybeRenderHead()}<main data-astro-cid-xoscxyy6> <!-- ── EVENT HERO ── --> <section${addAttribute(`event-hero ${isFestival ? "hero-amber" : "hero-navy"}`, "class")} data-astro-cid-xoscxyy6> <div class="container hero-inner" data-astro-cid-xoscxyy6> <div class="hero-left" data-astro-cid-xoscxyy6> <div class="back-link-wrap" data-astro-cid-xoscxyy6> <a href="/events" class="back-link" data-astro-cid-xoscxyy6>← All Events</a> </div> <div class="type-badge" data-astro-cid-xoscxyy6> ${isFestival ? "Arts Festival" : event.category || "Event"} </div> <h1 data-astro-cid-xoscxyy6>${event.title}</h1> ${event.bandName && !isFestival && renderTemplate`<div class="hero-subtitle" data-astro-cid-xoscxyy6>🎵 ${event.bandName}</div>`} <div class="hero-meta" data-astro-cid-xoscxyy6> <div class="meta-item" data-astro-cid-xoscxyy6> <span class="meta-icon" data-astro-cid-xoscxyy6>🗓</span> <span data-astro-cid-xoscxyy6>${displayDate}</span> </div> ${timeDisplay && renderTemplate`<div class="meta-item" data-astro-cid-xoscxyy6> <span class="meta-icon" data-astro-cid-xoscxyy6>🕗</span> <span data-astro-cid-xoscxyy6>${timeDisplay}</span> </div>`} <div class="meta-item" data-astro-cid-xoscxyy6> <span class="meta-icon" data-astro-cid-xoscxyy6>📍</span> <span data-astro-cid-xoscxyy6>${venueName}</span> </div> ${venueAddress && renderTemplate`<div class="meta-item meta-address" data-astro-cid-xoscxyy6> <span class="meta-icon" data-astro-cid-xoscxyy6>↳</span> <a${addAttribute(`https://maps.google.com?q=${encodeURIComponent(venueAddress)}`, "href")} target="_blank" rel="noopener" class="map-link" data-astro-cid-xoscxyy6> ${venueAddress} (map)
</a> </div>`} </div> <div class="hero-actions" data-astro-cid-xoscxyy6> ${isoDate && renderTemplate`<a${addAttribute(`https://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${isoDate.replace(/-/g, "")}T020000Z/${isoDate.replace(/-/g, "")}T055900Z&location=${encodeURIComponent(venueAddress || venueName)}`, "href")} target="_blank" rel="noopener" class="btn btn-white" data-astro-cid-xoscxyy6>
+ Add to Google Calendar
</a>`} </div> </div> ${event.image && isFestival && renderTemplate`<div class="hero-image-wrap" data-astro-cid-xoscxyy6> <img${addAttribute(event.image, "src")}${addAttribute(event.title, "alt")} class="hero-image" data-astro-cid-xoscxyy6> </div>`} ${event.posterUrl && !isFestival && renderTemplate`<div class="hero-image-wrap" data-astro-cid-xoscxyy6> <img${addAttribute(event.posterUrl, "src")}${addAttribute(event.title, "alt")} class="hero-image" data-astro-cid-xoscxyy6> </div>`} </div> </section> <!-- ── DESCRIPTION ── --> ${event.description && renderTemplate`<section class="section desc-section reveal" data-astro-cid-xoscxyy6> <div class="container desc-inner" data-astro-cid-xoscxyy6> <div class="desc-body" data-astro-cid-xoscxyy6> <h2 data-astro-cid-xoscxyy6>About This Event</h2> <p data-astro-cid-xoscxyy6>${event.description}</p> </div> <div class="desc-sidebar" data-astro-cid-xoscxyy6> <div class="sidebar-card" data-astro-cid-xoscxyy6> <h3 data-astro-cid-xoscxyy6>Event Details</h3> <dl data-astro-cid-xoscxyy6> <dt data-astro-cid-xoscxyy6>Date</dt> <dd data-astro-cid-xoscxyy6>${displayDate}</dd> ${timeDisplay && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xoscxyy6": true }, { "default": async ($$result3) => renderTemplate`<dt data-astro-cid-xoscxyy6>Time</dt><dd data-astro-cid-xoscxyy6>${timeDisplay}</dd>` })}`} <dt data-astro-cid-xoscxyy6>Location</dt> <dd data-astro-cid-xoscxyy6>${venueName}</dd> ${venueAddress && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xoscxyy6": true }, { "default": async ($$result3) => renderTemplate`<dt data-astro-cid-xoscxyy6>Address</dt><dd data-astro-cid-xoscxyy6>${venueAddress}</dd>` })}`} <dt data-astro-cid-xoscxyy6>Admission</dt> <dd data-astro-cid-xoscxyy6>Free — all ages welcome</dd> </dl> </div> ${!isFestival && renderTemplate`<div class="sidebar-card attend-card" data-astro-cid-xoscxyy6> <h3 data-astro-cid-xoscxyy6>Planning to Attend?</h3> <p data-astro-cid-xoscxyy6>Let the community know — it helps us secure sponsorship and plan for the season.</p> <a href="/contact" class="btn btn-gold" style="width:100%;justify-content:center;" data-astro-cid-xoscxyy6>RSVP / Contact Us</a> </div>`} </div> </div> </section>`} <!-- ── FESTIVAL: BAND PROFILES + VENDORS ── --> ${isFestival && renderTemplate`<section class="section festival-body" data-astro-cid-xoscxyy6> <div class="container" data-astro-cid-xoscxyy6> <!-- Band Profiles --> ${(event.bands || []).filter((b) => b.bandId).length > 0 && renderTemplate`<div class="festival-section reveal" data-astro-cid-xoscxyy6> <h2 class="festival-section-heading" data-astro-cid-xoscxyy6>🎸 Main Stage Lineup</h2> <div class="band-profiles" data-astro-cid-xoscxyy6> ${event.bands.filter((b) => b.bandId).sort((a, b) => a.slot - b.slot).map((b) => renderTemplate`<div class="band-profile-card" data-astro-cid-xoscxyy6> <div class="band-photo-col" data-astro-cid-xoscxyy6> ${b.photoUrl && renderTemplate`<div class="band-photo-wrap" data-astro-cid-xoscxyy6> <img${addAttribute(b.photoUrl, "src")}${addAttribute(b.bandName, "alt")} class="band-photo" data-astro-cid-xoscxyy6> </div>`} <h3 class="band-name" data-astro-cid-xoscxyy6>${b.bandName}</h3> </div> <div class="band-info" data-astro-cid-xoscxyy6> <div class="band-genre-row" data-astro-cid-xoscxyy6> ${b.time && renderTemplate`<span class="slot-time" data-astro-cid-xoscxyy6>${b.time}</span>`} ${b.genre && renderTemplate`<div class="band-genre" data-astro-cid-xoscxyy6>${b.genre}</div>`} ${b.website && renderTemplate`<a${addAttribute(b.website, "href")} target="_blank" rel="noopener" class="band-link" data-astro-cid-xoscxyy6>
Website ↗
</a>`} ${b.musicLink && renderTemplate`<a${addAttribute(b.musicLink, "href")} target="_blank" rel="noopener" class="band-link band-link-music" data-astro-cid-xoscxyy6>
🎵 Listen
</a>`} </div> ${b.bio && renderTemplate`<p class="band-bio" data-astro-cid-xoscxyy6>${b.bio}</p>`} </div> </div>`)} </div> </div>`} ${(event.bands || []).filter((b) => b.bandId).length === 0 && renderTemplate`<div class="festival-section reveal" data-astro-cid-xoscxyy6> <h2 class="festival-section-heading" data-astro-cid-xoscxyy6>🎸 Main Stage Lineup</h2> <p class="coming-soon" data-astro-cid-xoscxyy6>Band lineup being announced soon — check back!</p> </div>`} <!-- Vendor List (server-rendered) --> <div class="festival-section reveal" data-astro-cid-xoscxyy6> <h2 class="festival-section-heading" data-astro-cid-xoscxyy6>🛒 Participating Vendors</h2> ${vendors.length > 0 ? renderTemplate`<div class="vendor-list" data-astro-cid-xoscxyy6> ${vendors.map((v) => {
    const icon = vendorTypeIcon[v.vendor_type] || "✓";
    const space = v.space_number || v.booth_number;
    const vendorName = v.company_name || v.vendor_name || v.contact_name;
    return renderTemplate`<div class="vendor-profile-card" data-astro-cid-xoscxyy6> <div class="vendor-photo-col" data-astro-cid-xoscxyy6> ${v.profile_image_url ? renderTemplate`<div class="vendor-photo-wrap" data-astro-cid-xoscxyy6><img${addAttribute(v.profile_image_url, "src")}${addAttribute(vendorName, "alt")} class="vendor-photo" data-astro-cid-xoscxyy6></div>` : renderTemplate`<div class="vendor-photo-placeholder" data-astro-cid-xoscxyy6>${icon}</div>`} <h3 class="vendor-name" data-astro-cid-xoscxyy6>${vendorName}</h3> </div> <div class="vendor-info" data-astro-cid-xoscxyy6> <div class="vendor-meta-row" data-astro-cid-xoscxyy6> ${space && renderTemplate`<span class="vendor-space" data-astro-cid-xoscxyy6>Space #${space}</span>`} ${v.vendor_type && renderTemplate`<div class="vendor-genre" data-astro-cid-xoscxyy6>${v.vendor_type}</div>`} ${v.website && renderTemplate`<a${addAttribute(v.website, "href")} target="_blank" rel="noopener" class="band-link" data-astro-cid-xoscxyy6>Website ↗</a>`} </div> ${v.description && renderTemplate`<p class="band-bio" data-astro-cid-xoscxyy6>${v.description}</p>`} </div> </div>`;
  })} </div>` : renderTemplate`<div class="vendor-empty" data-astro-cid-xoscxyy6>
Vendor announcements coming soon! <a href="/vendor-application" data-astro-cid-xoscxyy6>Apply to be a vendor →</a> </div>`} <a href="/vendor-application" class="vendor-apply-link" data-astro-cid-xoscxyy6>Apply to be a vendor →</a> </div> </div> </section>`} <!-- ── PARK TIPS (non-festival concerts/films) ── --> ${!isFestival && event.eventType === "music_movie_in_park" && renderTemplate`<section class="park-info reveal" data-astro-cid-xoscxyy6> <div class="container park-inner" data-astro-cid-xoscxyy6> <span class="park-icon" data-astro-cid-xoscxyy6>🌳</span> <div data-astro-cid-xoscxyy6> <strong data-astro-cid-xoscxyy6>Tips for Attending</strong> <p data-astro-cid-xoscxyy6>Bring a blanket or lawn chairs. Parking is free on surrounding streets. Food vendors are on site most nights. All events are free and open to the public.</p> </div> </div> </section>`} </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-xoscxyy6": true })} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/events/[id].astro", void 0);
const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/events/[id].astro";
const $$url = "/events/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
