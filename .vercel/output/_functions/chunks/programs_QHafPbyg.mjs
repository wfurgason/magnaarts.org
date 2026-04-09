import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, b7 as defineScriptVars, a2 as addAttribute, F as Fragment, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, b as $$Footer, a as $$Header } from './global_Hoz3rGEv.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Programs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Programs;
  const firebaseConfig = {
    apiKey: "AIzaSyAP3QgOUeZ1ruwoUxOROvKw1JXpTxYAIQg",
    authDomain: "magnaarts.firebaseapp.com",
    projectId: "magnaarts"
  };
  const programs = [
    {
      id: "music-movies",
      icon: "♪",
      color: "blue",
      title: "Music & Movies in the Park",
      tagline: "Most Fridays · June–August · Free",
      image: "/images/concerts/Creature Vs.1.png",
      body: [
        "Our flagship summer series brings live music and a free movie to Pleasant Green Park most Friday nights from June through August.",
        "Each evening starts with a live band at 8 PM, followed by a movie on our 35-ft inflatable screen at dusk. Over 300 people attend each event — 14 musical acts presented each summer.",
        "Salt Lake County Parks and Recreation waives park rental fees, making the entire series free and open to all."
      ],
      details: [
        { label: "Location", value: "Pleasant Green Park, 3250 S 8400 W, Magna", mapAddress: "Pleasant Green Park, 3250 S 8400 W, Magna, UT 84044" },
        { label: "When", value: "Most Fridays, June – August, 8:00 PM" },
        { label: "Admission", value: "Free" },
        { label: "Attendance", value: "300+ per event" },
        { label: "Acts per season", value: "14 musical acts" }
      ]
    },
    {
      id: "festival",
      icon: "★",
      color: "amber",
      title: "Magna Main Street Arts Festival",
      tagline: "Annual · August · Historic Magna Main Street",
      image: "/images/festival/mmsaf.png",
      body: [
        "Our annual flagship event transforms Historic Magna Main Street into a full day of art, music, and community.",
        "The festival features live music on multiple stages, a juried fine arts contest, street performers, and dozens of arts and food vendors.",
        "5,000–7,000 attendees come each year, making it one of the largest community events in Magna's history."
      ],
      details: [
        { label: "Location", value: "Historic Magna Main Street", mapAddress: "Magna Main Street, Magna, UT 84044" },
        { label: "When", value: "Annual — August" },
        { label: "Admission", value: "Free" },
        { label: "Attendance", value: "5,000 – 7,000" },
        { label: "Features", value: "Live music, fine arts contest, vendors, performers" }
      ],
      link: "/events/arts-festival-2026",
      linkLabel: "Festival Details →"
    },
    {
      id: "open-mic",
      icon: "🎤",
      color: "red",
      title: "Open Mic Night",
      tagline: "8–10 events per year · Magna Library",
      image: null,
      body: [
        "Open Mic Night gives community members a stage to share their talents — music, comedy, poetry, spoken word, and more.",
        "Held in partnership with the Magna Library, each event runs two hours. The Arts Council provides a professional sound system; the Library provides the space and refreshments.",
        "8 to 10 events are held each year, making it one of our most consistent programs for local performers."
      ],
      details: [
        { label: "Location", value: "Magna Library, 2675 S 8950 W", mapAddress: "Magna Library, 2675 S 8950 W, Magna, UT 84044" },
        { label: "Frequency", value: "8–10 events per year" },
        { label: "Duration", value: "2 hours per event" },
        { label: "Admission", value: "Free" },
        { label: "Features", value: "Music, comedy, poetry — open to all performers" }
      ],
      link: "/events",
      linkLabel: "See All Events →"
    },
    {
      id: "art-night",
      icon: "✦",
      color: "green",
      title: "Group Art Night",
      tagline: "Ongoing · Magna Library · ~20 participants",
      image: "/images/classes/ArtAtLib-1.png",
      body: [
        "Group Art Night is an artist-guided session where community members come together to create art in a relaxed, social setting.",
        "Held at the Magna Library in partnership with their programming team, each session is led by a local artist who guides participants through a project.",
        "Consistently one of our most popular programs, with around 20 participants per session."
      ],
      details: [
        { label: "Location", value: "Magna Library, 2675 S 8950 W", mapAddress: "Magna Library, 2675 S 8950 W, Magna, UT 84044" },
        { label: "Admission", value: "Free" },
        { label: "Attendance", value: "~20 participants per session" },
        { label: "Format", value: "Artist-guided; all skill levels welcome" }
      ],
      link: "/events",
      linkLabel: "See Upcoming Events →"
    },
    {
      id: "seminar",
      icon: "📚",
      color: "purple",
      title: "Annual Arts Seminar",
      tagline: "Annual · Magna Library",
      image: null,
      body: [
        "Each year the Arts Council hosts a seminar focused on a different art discipline — from music and film to visual arts and community design.",
        "The seminar features a panel of local and regional experts, educational presentations, community outreach, and an open Q&A session.",
        "The seminar is designed to deepen community appreciation for the arts and connect Magna residents with working artists."
      ],
      details: [
        { label: "Location", value: "Magna Library, 2675 S 8950 W", mapAddress: "Magna Library, 2675 S 8950 W, Magna, UT 84044" },
        { label: "Frequency", value: "Annual" },
        { label: "Format", value: "Panel, presentation, Q&A" },
        { label: "Admission", value: "Free" }
      ],
      link: "/events",
      linkLabel: "See Upcoming Events →"
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Programs — Magna Arts Council", "description": "Explore all Magna Arts Council programs — Music & Movies in the Park, the Arts Festival, Open Mic Night, Group Art Night, and the Annual Arts Seminar.", "data-astro-cid-iru3ew3w": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<main data-astro-cid-iru3ew3w> <!-- ── PAGE HERO ── --> <section class="page-hero" data-astro-cid-iru3ew3w> <div class="container" data-astro-cid-iru3ew3w> <div class="hero-badge" data-astro-cid-iru3ew3w>Our Programs</div> <h1 data-astro-cid-iru3ew3w>Arts for Everyone, All Year</h1> <p class="hero-sub" data-astro-cid-iru3ew3w>\nFrom summer concerts to art classes to our annual festival — everything\n          the Magna Arts Council produces is free and open to the community.\n</p> </div> </section> <!-- ── QUICK NAV ── --> <nav class="program-nav" aria-label="Jump to program" data-astro-cid-iru3ew3w> <div class="container program-nav-inner" data-astro-cid-iru3ew3w> ', " </div> </nav> <!-- ── PROGRAMS ── --> ", ` <!-- ── CTA ── --> <section class="cta-banner" data-astro-cid-iru3ew3w> <div class="container cta-inner reveal" data-astro-cid-iru3ew3w> <div data-astro-cid-iru3ew3w> <h2 data-astro-cid-iru3ew3w>Want to Propose a New Program?</h2> <p data-astro-cid-iru3ew3w>Got an idea for a concert, class, screening, or event? We'd love to hear it. Submit a proposal and the board will review it at our next meeting.</p> </div> <a href="/present" class="btn btn-gold" data-astro-cid-iru3ew3w>Submit a Proposal →</a> </div> </section> </main> `, ' <script type="module">', `
    import { initializeApp, getApps, getApp }                         from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
    import { getFirestore, collection, getDocs, orderBy, query }      from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db  = getFirestore(app);

    const now = new Date();

    // ── Helper: render ticket stubs into a glance list ─────────────────
    function renderGlance(loadingId, listId, emptyId, items) {
      const loadingEl = document.getElementById(loadingId);
      const listEl    = document.getElementById(listId);
      const emptyEl   = document.getElementById(emptyId);
      if (!listEl) return;

      if (loadingEl) loadingEl.style.display = 'none';

      if (items.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      listEl.innerHTML = items.map(e => {
        const d   = new Date(e.rawDate);
        const mon = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = d.toLocaleDateString('en-US', { day: 'numeric' });
        return \`
          <li class="glance-item">
            <div class="ticket-stub">
              <div class="ticket-left">
                <span class="ticket-mon">\${mon}</span>
                <span class="ticket-day">\${day}</span>
              </div>
              <div class="ticket-body">
                <span class="ticket-band">\${e.title}</span>
                \${e.time ? \`<span class="ticket-time">🎤 Doors open at \${e.time}</span>\` : ''}
              </div>
              <div class="ticket-right">
                <span class="ticket-free">FREE</span>
              </div>
            </div>
          </li>\`;
      }).join('');
      listEl.style.display = 'block';
    }

    try {
      const q    = query(collection(db, 'events'), orderBy('eventDate', 'asc'));
      const snap = await getDocs(q);

      const concertEvents  = [];
      const openMicEvents  = [];
      const artNightEvents = [];
      const festivalItems  = [];

      snap.forEach(doc => {
        const d       = doc.data();
        const dateObj = d.eventDate?.toDate ? d.eventDate.toDate() : new Date(d.eventDate);
        if (dateObj < now) return;

        const item = {
          id:      doc.id,
          rawDate: dateObj.toISOString(),
          time:    d.eventTime || d.startTime || '',
          title:   d.presenterName || d.bandName || d.title || 'TBA',
          type:    d.eventType || '',
        };

        if (d.eventType === 'open_mic') {
          openMicEvents.push(item);
        } else if (d.eventType === 'group_art_night') {
          artNightEvents.push(item);
        } else if (d.eventType === 'arts_festival') {
          // Expand each assigned band slot into its own ticket
          const festDate = dateObj;
          (d.bands || []).forEach(b => {
            if (!b.bandId) return; // skip empty slots
            festivalItems.push({
              id:      doc.id + '-slot' + b.slot,
              rawDate: festDate.toISOString(),
              time:    b.time || '',
              title:   b.bandName || 'TBA',
              type:    'arts_festival',
            });
          });
        } else {
          concertEvents.push(item);
        }
      });

      // Music & Movies glance
      renderGlance('glance-loading', 'glance-list', 'glance-empty', concertEvents);

      // Open Mic glance
      renderGlance('om-glance-loading', 'om-glance-list', 'om-glance-empty', openMicEvents);

      // Group Art Night glance
      renderGlance('an-glance-loading', 'an-glance-list', 'an-glance-empty', artNightEvents);

      // Arts Festival lineup
      renderGlance('fest-glance-loading', 'fest-glance-list', 'fest-glance-empty', festivalItems);

    } catch (err) {
      // Fail silently — show empty state for both
      ['glance-loading', 'om-glance-loading', 'an-glance-loading', 'fest-glance-loading'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      ['glance-empty', 'om-glance-empty', 'an-glance-empty', 'fest-glance-empty'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'block';
      });
      console.warn('Could not load events for programs page:', err);
    }
  </script> `], [" ", " ", '<main data-astro-cid-iru3ew3w> <!-- ── PAGE HERO ── --> <section class="page-hero" data-astro-cid-iru3ew3w> <div class="container" data-astro-cid-iru3ew3w> <div class="hero-badge" data-astro-cid-iru3ew3w>Our Programs</div> <h1 data-astro-cid-iru3ew3w>Arts for Everyone, All Year</h1> <p class="hero-sub" data-astro-cid-iru3ew3w>\nFrom summer concerts to art classes to our annual festival — everything\n          the Magna Arts Council produces is free and open to the community.\n</p> </div> </section> <!-- ── QUICK NAV ── --> <nav class="program-nav" aria-label="Jump to program" data-astro-cid-iru3ew3w> <div class="container program-nav-inner" data-astro-cid-iru3ew3w> ', " </div> </nav> <!-- ── PROGRAMS ── --> ", ` <!-- ── CTA ── --> <section class="cta-banner" data-astro-cid-iru3ew3w> <div class="container cta-inner reveal" data-astro-cid-iru3ew3w> <div data-astro-cid-iru3ew3w> <h2 data-astro-cid-iru3ew3w>Want to Propose a New Program?</h2> <p data-astro-cid-iru3ew3w>Got an idea for a concert, class, screening, or event? We'd love to hear it. Submit a proposal and the board will review it at our next meeting.</p> </div> <a href="/present" class="btn btn-gold" data-astro-cid-iru3ew3w>Submit a Proposal →</a> </div> </section> </main> `, ' <script type="module">', `
    import { initializeApp, getApps, getApp }                         from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
    import { getFirestore, collection, getDocs, orderBy, query }      from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db  = getFirestore(app);

    const now = new Date();

    // ── Helper: render ticket stubs into a glance list ─────────────────
    function renderGlance(loadingId, listId, emptyId, items) {
      const loadingEl = document.getElementById(loadingId);
      const listEl    = document.getElementById(listId);
      const emptyEl   = document.getElementById(emptyId);
      if (!listEl) return;

      if (loadingEl) loadingEl.style.display = 'none';

      if (items.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }

      listEl.innerHTML = items.map(e => {
        const d   = new Date(e.rawDate);
        const mon = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = d.toLocaleDateString('en-US', { day: 'numeric' });
        return \\\`
          <li class="glance-item">
            <div class="ticket-stub">
              <div class="ticket-left">
                <span class="ticket-mon">\\\${mon}</span>
                <span class="ticket-day">\\\${day}</span>
              </div>
              <div class="ticket-body">
                <span class="ticket-band">\\\${e.title}</span>
                \\\${e.time ? \\\`<span class="ticket-time">🎤 Doors open at \\\${e.time}</span>\\\` : ''}
              </div>
              <div class="ticket-right">
                <span class="ticket-free">FREE</span>
              </div>
            </div>
          </li>\\\`;
      }).join('');
      listEl.style.display = 'block';
    }

    try {
      const q    = query(collection(db, 'events'), orderBy('eventDate', 'asc'));
      const snap = await getDocs(q);

      const concertEvents  = [];
      const openMicEvents  = [];
      const artNightEvents = [];
      const festivalItems  = [];

      snap.forEach(doc => {
        const d       = doc.data();
        const dateObj = d.eventDate?.toDate ? d.eventDate.toDate() : new Date(d.eventDate);
        if (dateObj < now) return;

        const item = {
          id:      doc.id,
          rawDate: dateObj.toISOString(),
          time:    d.eventTime || d.startTime || '',
          title:   d.presenterName || d.bandName || d.title || 'TBA',
          type:    d.eventType || '',
        };

        if (d.eventType === 'open_mic') {
          openMicEvents.push(item);
        } else if (d.eventType === 'group_art_night') {
          artNightEvents.push(item);
        } else if (d.eventType === 'arts_festival') {
          // Expand each assigned band slot into its own ticket
          const festDate = dateObj;
          (d.bands || []).forEach(b => {
            if (!b.bandId) return; // skip empty slots
            festivalItems.push({
              id:      doc.id + '-slot' + b.slot,
              rawDate: festDate.toISOString(),
              time:    b.time || '',
              title:   b.bandName || 'TBA',
              type:    'arts_festival',
            });
          });
        } else {
          concertEvents.push(item);
        }
      });

      // Music & Movies glance
      renderGlance('glance-loading', 'glance-list', 'glance-empty', concertEvents);

      // Open Mic glance
      renderGlance('om-glance-loading', 'om-glance-list', 'om-glance-empty', openMicEvents);

      // Group Art Night glance
      renderGlance('an-glance-loading', 'an-glance-list', 'an-glance-empty', artNightEvents);

      // Arts Festival lineup
      renderGlance('fest-glance-loading', 'fest-glance-list', 'fest-glance-empty', festivalItems);

    } catch (err) {
      // Fail silently — show empty state for both
      ['glance-loading', 'om-glance-loading', 'an-glance-loading', 'fest-glance-loading'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      ['glance-empty', 'om-glance-empty', 'an-glance-empty', 'fest-glance-empty'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'block';
      });
      console.warn('Could not load events for programs page:', err);
    }
  </script> `])), renderComponent($$result2, "Header", $$Header, { "data-astro-cid-iru3ew3w": true }), maybeRenderHead(), programs.map((p) => renderTemplate`<a${addAttribute(`#${p.id}`, "href")}${addAttribute(`pnav-item pnav-${p.color}`, "class")} data-astro-cid-iru3ew3w> <span data-astro-cid-iru3ew3w>${p.icon}</span> <span data-astro-cid-iru3ew3w>${p.title}</span> </a>`), programs.map((p, i) => renderTemplate`<section${addAttribute(p.id, "id")}${addAttribute(`program-section section ${i % 2 === 1 ? "section-cream" : ""}`, "class")} data-astro-cid-iru3ew3w> <div class="container program-inner" data-astro-cid-iru3ew3w> <div class="program-text reveal" data-astro-cid-iru3ew3w> <div${addAttribute(`program-label label-${p.color}`, "class")} data-astro-cid-iru3ew3w> ${p.icon} ${p.title} </div> <p class="program-tagline" data-astro-cid-iru3ew3w>${p.tagline}</p> ${p.body.map((para) => renderTemplate`<p class="program-body" data-astro-cid-iru3ew3w>${para}</p>`)} ${p.id === "festival" && renderTemplate`<div class="events-glance" data-astro-cid-iru3ew3w> <h3 class="glance-heading" data-astro-cid-iru3ew3w>Festival Lineup</h3> <div id="fest-glance-loading" class="glance-loading" data-astro-cid-iru3ew3w>Loading lineup…</div> <ul id="fest-glance-list" class="glance-list" style="display:none" data-astro-cid-iru3ew3w></ul> <div id="fest-glance-empty" class="glance-empty" style="display:none" data-astro-cid-iru3ew3w>
Lineup coming soon — <a href="/events" data-astro-cid-iru3ew3w>check back closer to the festival</a>.
</div> </div>`} ${p.id === "art-night" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-iru3ew3w": true }, { "default": async ($$result3) => renderTemplate` <a href="/teach-an-art-class"${addAttribute(`program-link link-${p.color}`, "class")} style="display:block; margin-bottom:12px;" data-astro-cid-iru3ew3w>
Want to Teach a Session? Apply Here →
</a> <div class="events-glance" data-astro-cid-iru3ew3w> <h3 class="glance-heading" data-astro-cid-iru3ew3w>Upcoming Group Art Nights</h3> <div id="an-glance-loading" class="glance-loading" data-astro-cid-iru3ew3w>Loading schedule…</div> <ul id="an-glance-list" class="glance-list" style="display:none" data-astro-cid-iru3ew3w></ul> <div id="an-glance-empty" class="glance-empty" style="display:none" data-astro-cid-iru3ew3w>
Schedule coming soon — <a href="/events" data-astro-cid-iru3ew3w>check the events page</a> for updates.
</div> </div> ` })}`} <a${addAttribute(p.link, "href")}${addAttribute(`program-link link-${p.color}`, "class")} data-astro-cid-iru3ew3w>${p.linkLabel}</a> ${p.id === "music-movies" && renderTemplate`<div class="events-glance" data-astro-cid-iru3ew3w> <h3 class="glance-heading" data-astro-cid-iru3ew3w>Upcoming Events</h3> <div id="glance-loading" class="glance-loading" data-astro-cid-iru3ew3w>Loading schedule…</div> <ul id="glance-list" class="glance-list" style="display:none" data-astro-cid-iru3ew3w></ul> <div id="glance-empty" class="glance-empty" style="display:none" data-astro-cid-iru3ew3w>
Season schedule coming soon — <a href="/events" data-astro-cid-iru3ew3w>check the events page</a> for updates.
</div> </div>`} ${p.id === "open-mic" && renderTemplate`<div class="events-glance" data-astro-cid-iru3ew3w> <h3 class="glance-heading" data-astro-cid-iru3ew3w>Upcoming Open Mic Nights</h3> <div id="om-glance-loading" class="glance-loading" data-astro-cid-iru3ew3w>Loading schedule…</div> <ul id="om-glance-list" class="glance-list" style="display:none" data-astro-cid-iru3ew3w></ul> <div id="om-glance-empty" class="glance-empty" style="display:none" data-astro-cid-iru3ew3w>
Schedule coming soon — <a href="/events" data-astro-cid-iru3ew3w>check the events page</a> for updates.
</div> </div>`} </div> <div class="program-sidebar reveal" data-astro-cid-iru3ew3w> ${p.image && renderTemplate`<div class="program-img-wrap" data-astro-cid-iru3ew3w> <img${addAttribute(p.image, "src")}${addAttribute(p.title, "alt")}${addAttribute(`program-img${p.id === "festival" ? " program-img--top" : ""}`, "class")} data-astro-cid-iru3ew3w> </div>`} <div${addAttribute(`details-card card-${p.color}`, "class")} data-astro-cid-iru3ew3w> <h3 data-astro-cid-iru3ew3w>At a Glance</h3> <dl data-astro-cid-iru3ew3w> ${p.details.map((d) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-iru3ew3w": true }, { "default": async ($$result3) => renderTemplate` <dt data-astro-cid-iru3ew3w>${d.label}</dt> <dd data-astro-cid-iru3ew3w> ${d.mapAddress ? renderTemplate`<a${addAttribute(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.mapAddress)}`, "href")} target="_blank" rel="noopener noreferrer" class="map-link" data-astro-cid-iru3ew3w> <span class="map-pin-icon" aria-hidden="true" data-astro-cid-iru3ew3w> <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" data-astro-cid-iru3ew3w> <path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 3.85 5.5 8.5 5.5 8.5S11 9.35 11 5.5C11 2.46 8.54 0 5.5 0zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor" data-astro-cid-iru3ew3w></path> </svg> </span> ${d.value} <span class="map-link-hint" data-astro-cid-iru3ew3w>Open map →</span> </a>` : d.value} </dd> ` })}`)} </dl> </div> </div> </div> </section>`), renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-iru3ew3w": true }), defineScriptVars({ firebaseConfig })) })}  <!-- Ticket styles must be global — these elements are injected via innerHTML and won't receive Astro's scoped hash -->`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/programs.astro", void 0);
const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/programs.astro";
const $$url = "/programs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Programs,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
