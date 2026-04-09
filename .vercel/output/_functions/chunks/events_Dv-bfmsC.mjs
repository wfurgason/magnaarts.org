import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, b6 as unescapeHTML, F as Fragment, a2 as addAttribute, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { r as renderScript } from './script_BgFssCUG.mjs';
import { $ as $$AdminLayout } from './AdminLayout_DI2FboVo.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

const events = [
  {
    id: "runaway-fire-despicable-me-4",
    type: "concert",
    date: "Jun 13",
    isoDate: "2025-06-13",
    day: "Friday, June 13, 2025",
    time: "8:00 PM",
    title: "Runaway Fire",
    subtitle: "Despicable Me 4",
    subtitleType: "film",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: "Kick off the summer series with Runaway Fire followed by a screening of Despicable Me 4 on our 35-ft inflatable screen. Free admission — bring a blanket and the whole family.",
    tags: ["Concert", "Film"]
  },
  {
    id: "buster-if",
    type: "concert",
    date: "Jun 20",
    isoDate: "2025-06-20",
    day: "Friday, June 20, 2025",
    time: "8:00 PM",
    title: "Buster",
    subtitle: "IF",
    subtitleType: "film",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: "Salt Lake City rock band Buster takes the stage, followed by a screening of IF. Buster features Wes Furgason (drums), Karl Gilchrist (guitar/vocals), Dave Call (bass), and Jon Beutler (lead guitar).",
    image: "/images/concerts/Creature Vs.1.png",
    tags: ["Concert", "Film"]
  },
  {
    id: "ghost-of-spring-harold-purple-crayon",
    type: "concert",
    date: "Jun 27",
    isoDate: "2025-06-27",
    day: "Friday, June 27, 2025",
    time: "8:00 PM",
    title: "Ghost of Spring",
    subtitle: "Harold and the Purple Crayon",
    subtitleType: "film",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: "Ghost of Spring performs live, followed by a showing of Harold and the Purple Crayon. A great night for families.",
    tags: ["Concert", "Film"]
  },
  {
    id: "dirt-cheap-captain-america",
    type: "concert",
    date: "Jul 11",
    isoDate: "2025-07-11",
    day: "Friday, July 11, 2025",
    time: "8:00 PM",
    title: "Dirt Cheap",
    subtitle: "Captain America: Brave New World",
    subtitleType: "film",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: "Dirt Cheap, Salt Lake City's premier AC/DC tribute band, brings the thunder. Followed by a screening of Captain America: Brave New World.",
    tags: ["Concert", "Film", "Tribute"]
  },
  {
    id: "flying-coffee-beans-moana-2",
    type: "concert",
    date: "Jul 18",
    isoDate: "2025-07-18",
    day: "Friday, July 18, 2025",
    time: "8:00 PM",
    title: "The Flying Coffee Beans",
    subtitle: "Moana 2",
    subtitleType: "film",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: "Heavy jazzy genrefluid jam rock from Utah. The Flying Coffee Beans blend funky bass lines, shreddy guitar, and tight drumming into something you have to hear. Followed by Moana 2.",
    tags: ["Concert", "Film"]
  },
  {
    id: "minecraft-movie",
    type: "film",
    date: "Jul 25",
    isoDate: "2025-07-25",
    day: "Friday, July 25, 2025",
    time: "9:00 PM",
    title: "The Minecraft Movie",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: "From Warner Bros. and Legendary Pictures, starring Jason Momoa and Jack Black. The first-ever live-action Minecraft film comes to our 35-ft inflatable screen. Free admission.",
    tags: ["Film"]
  },
  {
    id: "penrose-wonka",
    type: "concert",
    date: "Aug 1",
    isoDate: "2025-08-01",
    day: "Friday, August 1, 2025",
    time: "8:00 PM",
    title: "Penrose",
    subtitle: "Wonka",
    subtitleType: "film",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: "Modern indie rock from Salt Lake City featuring vocalist Madison Penrose — American Idol Top 30 Finalist and Utah Idol 2014 winner. High energy, dynamic live performance. Followed by Wonka.",
    tags: ["Concert", "Film"]
  },
  {
    id: "anime-girlfriend-transformers-one",
    type: "concert",
    date: "Aug 8",
    isoDate: "2025-08-08",
    day: "Friday, August 8, 2025",
    time: "8:00 PM",
    title: "Anime Girlfriend",
    subtitle: "Transformers One",
    subtitleType: "film",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: 'An all-female rock group from Salt Lake City blending Rock, Midwest Emo, Shoegaze, Indie, and Pop into what they call "Mountain West Emo." Followed by Transformers One.',
    tags: ["Concert", "Film"]
  },
  {
    id: "mouth-wild-robot",
    type: "concert",
    date: "Aug 15",
    isoDate: "2025-08-15",
    day: "Friday, August 15, 2025",
    time: "8:00 PM",
    title: "Mouth",
    subtitle: "Wild Robot",
    subtitleType: "film",
    location: "Pleasant Green Park",
    address: "3250 S 8400 W, Magna, UT 84044",
    description: "Salt Lake City's Mouth is a female-fronted alt punk outfit that blends catchy pop hooks with riot grrrl tenacity. Founded in 2019 by Rachel Clark and Jordan Clark. Followed by Wild Robot.",
    tags: ["Concert", "Film"]
  },
  {
    id: "arts-festival-2026",
    type: "festival",
    date: "Aug 15",
    isoDate: "2026-08-15",
    day: "Saturday, August 15, 2026",
    time: "10:00 AM – 6:00 PM",
    title: "Magna Main Street Arts Festival",
    location: "Historic Magna Main Street",
    address: "Historic Magna Main Street, Magna, UT 84044",
    description: "Our annual flagship event draws 5,000–7,000 people to Historic Magna Main Street for a full day of live music, a fine arts contest, street performers, and arts and food vendors. Free and open to all.",
    image: "/images/festival/mmsaf.png",
    tags: ["Festival", "Family"]
  }
];

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Events = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Events;
  const user = Astro2.locals.user;
  const snap = await adminDb.collection("events").orderBy("eventDate", "asc").get();
  const firestoreEvents = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  function formatDate(ts) {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" });
  }
  const now = /* @__PURE__ */ new Date();
  const upcoming = firestoreEvents.filter((e) => {
    const d = e.eventDate?.toDate ? e.eventDate.toDate() : new Date(e.eventDate);
    return d >= now;
  });
  const firestorePast = firestoreEvents.filter((e) => {
    const d = e.eventDate?.toDate ? e.eventDate.toDate() : new Date(e.eventDate);
    return d < now;
  });
  new Set(firestorePast.map((e) => e.id));
  const staticArchive = events.map((e) => ({
    id: e.id,
    isoDate: e.isoDate,
    displayDate: e.day,
    title: e.title,
    band: e.subtitle && e.subtitleType !== "film" ? e.subtitle : void 0,
    type: e.type.charAt(0).toUpperCase() + e.type.slice(1),
    venue: e.location,
    source: "season"
  }));
  const firestoreArchive = firestorePast.filter((e) => !events.some((s) => s.id === e.id)).map((e) => {
    const d = e.eventDate?.toDate ? e.eventDate.toDate() : new Date(e.eventDate);
    return {
      id: e.id,
      isoDate: d.toISOString().slice(0, 10),
      displayDate: formatDate(e.eventDate),
      title: e.title,
      band: e.bandName,
      type: e.submissionType === "band" ? "Concert" : "Program",
      venue: e.venueName || "—",
      source: "firestore"
    };
  });
  const archive = [...staticArchive, ...firestoreArchive].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  const archiveJson = JSON.stringify(archive);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Published Events", "user": user, "data-astro-cid-xuti7r4t": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="page-header" data-astro-cid-xuti7r4t> <h1 data-astro-cid-xuti7r4t>Published Events</h1> <a href="https://magnaarts.org/events" target="_blank" rel="noopener" class="btn btn-ghost" data-astro-cid-xuti7r4t>\nView Public Page ↗\n</a> </div>  ', ' <section class="archive-section" data-astro-cid-xuti7r4t> <div class="archive-header" data-astro-cid-xuti7r4t> <h2 class="section-title" data-astro-cid-xuti7r4t>Past Events Archive (', ')</h2> <input type="search" id="archive-search" placeholder="Search title, band, venue…" class="archive-search-input" autocomplete="off" data-astro-cid-xuti7r4t> </div> <div class="archive-table-wrap" data-astro-cid-xuti7r4t> <table class="archive-table" id="archive-table" data-astro-cid-xuti7r4t> <thead data-astro-cid-xuti7r4t> <tr data-astro-cid-xuti7r4t> <th class="sortable" data-col="isoDate" data-astro-cid-xuti7r4t>Date <span class="sort-icon" data-astro-cid-xuti7r4t>↕</span></th> <th class="sortable" data-col="title" data-astro-cid-xuti7r4t>Event / Title <span class="sort-icon" data-astro-cid-xuti7r4t>↕</span></th> <th class="sortable" data-col="band" data-astro-cid-xuti7r4t>Band / Presenter <span class="sort-icon" data-astro-cid-xuti7r4t>↕</span></th> <th class="sortable" data-col="type" data-astro-cid-xuti7r4t>Type <span class="sort-icon" data-astro-cid-xuti7r4t>↕</span></th> <th class="sortable" data-col="venue" data-astro-cid-xuti7r4t>Venue <span class="sort-icon" data-astro-cid-xuti7r4t>↕</span></th> <th data-astro-cid-xuti7r4t>Source</th> </tr> </thead> <tbody id="archive-tbody" data-astro-cid-xuti7r4t> <!-- populated by JS --> </tbody> </table> <div id="archive-empty-msg" class="archive-empty" style="display:none" data-astro-cid-xuti7r4t>\nNo events match your search.\n</div> </div> </section> ', '  <script id="archive-data" type="application/json">', "<\/script> "])), maybeRenderHead(), firestoreEvents.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-xuti7r4t> <p data-astro-cid-xuti7r4t>No events published yet. Approve a band or program submission, then click "Publish as Event."</p> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-xuti7r4t": true }, { "default": async ($$result3) => renderTemplate`${upcoming.length > 0 && renderTemplate`<section class="events-section" data-astro-cid-xuti7r4t> <h2 class="section-title" data-astro-cid-xuti7r4t>Upcoming (${upcoming.length})</h2> <div class="event-list" data-astro-cid-xuti7r4t> ${upcoming.map((event) => renderTemplate`<div class="event-card"${addAttribute(event.id, "id")} data-astro-cid-xuti7r4t> <div class="event-card-inner" data-astro-cid-xuti7r4t> ${event.posterUrl && renderTemplate`<img${addAttribute(event.posterUrl, "src")}${addAttribute(event.title, "alt")} class="event-poster" data-astro-cid-xuti7r4t>`} <div class="event-info" data-astro-cid-xuti7r4t> <div class="event-date-badge" data-astro-cid-xuti7r4t>${formatDate(event.eventDate)} · ${event.eventTime}</div> <h3 class="event-title" data-astro-cid-xuti7r4t>${event.title}</h3> ${event.bandName && renderTemplate`<div class="event-sub" data-astro-cid-xuti7r4t>${event.bandName} · ${event.genre}</div>`} <div class="event-venue" data-astro-cid-xuti7r4t>${event.venueName}, ${event.venueAddress}</div> <p class="event-desc" data-astro-cid-xuti7r4t>${event.description}</p> <div class="event-links" data-astro-cid-xuti7r4t> ${event.ticketUrl && renderTemplate`<a${addAttribute(event.ticketUrl, "href")} target="_blank" rel="noopener" class="link-sm" data-astro-cid-xuti7r4t>Tickets ↗</a>`} ${event.rsvpUrl && renderTemplate`<a${addAttribute(event.rsvpUrl, "href")} target="_blank" rel="noopener" class="link-sm" data-astro-cid-xuti7r4t>RSVP ↗</a>`} </div> <div class="event-meta" data-astro-cid-xuti7r4t>Published by ${event.publishedBy}</div> </div> </div> <div class="event-actions" data-astro-cid-xuti7r4t> <button class="btn btn-danger btn-sm" data-action="unpublish"${addAttribute(event.id, "data-id")} data-astro-cid-xuti7r4t>
Unpublish
</button> </div> </div>`)} </div> </section>`}${upcoming.length === 0 && renderTemplate`<div class="empty-state" data-astro-cid-xuti7r4t> <p data-astro-cid-xuti7r4t>No upcoming events. Use the Season Setup or Bands pages to publish the next event.</p> </div>`}` })}`, archive.length, renderScript($$result2, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/events.astro?astro&type=script&index=0&lang.ts"), unescapeHTML(archiveJson)) })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/events.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/events.astro";
const $$url = "/admin/events";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Events,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
