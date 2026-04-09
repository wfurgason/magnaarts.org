import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, b7 as defineScriptVars, a2 as addAttribute, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, b as $$Footer, a as $$Header } from './global_Hoz3rGEv.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAP3QgOUeZ1ruwoUxOROvKw1JXpTxYAIQg",
    authDomain: "magnaarts.firebaseapp.com",
    projectId: "magnaarts"
  };
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const pinnedSnap = await adminDb.collection("pinned_content").where("active", "==", true).get();
  const activePinned = pinnedSnap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => {
    const aTs = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const bTs = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return bTs - aTs;
  }).filter((item) => {
    if (!item.expiresDate) return true;
    const exp = item.expiresDate.toDate ? item.expiresDate.toDate() : new Date(item.expiresDate);
    exp.setHours(0, 0, 0, 0);
    return today < exp;
  }).filter((item) => !item.showOn || item.showOn === "home" || item.showOn === "both").map((item) => ({
    id: item.id,
    href: item.href || "/",
    badgeText: item.badge || "",
    icon: item.icon || "📌",
    logoSrc: item.logoSrc || null,
    label: item.title || "",
    sublabel: item.sublabel || "",
    meta: item.meta || "",
    cta: item.ctaText ? item.ctaText + " →" : "",
    colorClass: item.colorClass || "tile-pin-gold",
    ctaExternal: !!item.ctaExternal
  }));
  const showPinned = activePinned.length > 0;
  const roles = [
    {
      key: "attend",
      icon: "👥",
      title: "Attend",
      body: "Come enjoy free events, concerts, classes, and the annual Arts Festival.",
      link: "/events",
      cta: "Find an event"
    },
    {
      key: "volunteer",
      icon: "🙌",
      title: "Volunteer",
      body: "Help make events happen. Setup crews, greeters, helpers, and more.",
      link: "/get-involved#volunteer",
      cta: "Sign up"
    },
    {
      key: "present",
      icon: "💡",
      title: "Present",
      body: "Have an idea? Propose a class, concert, or event for approval.",
      link: "/present",
      cta: "Submit a proposal"
    },
    {
      key: "lead",
      icon: "⭐",
      title: "Lead",
      body: "Join the board and help shape the future of arts in Magna.",
      link: "/get-involved#board",
      cta: "Learn more"
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Magna Arts Council — Art is the Heart of Magna" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", `<main> <!-- ── HERO ─────────────────────────────────────────── --> <section class="hero"> <div class="container hero-inner"> <div class="hero-text"> <div class="hero-badge">Magna, Utah's Designated Local Arts Agency</div> <h1>Art is the<br><em>Heart</em> of Magna</h1> <p class="hero-sub">
We bring music, art, film, and culture to our community —
            free and open to everyone.
</p> <div class="hero-ctas"> <a href="/events" class="btn btn-white">See Upcoming Events</a> <a href="/get-involved" class="btn btn-outline-white">Get Involved</a> </div> </div> <!-- Right column: pinned content OR standard program tiles --> `, ` </div> </section> <!-- ── NEXT UP ──────────────────────────────────────── --> <section class="section" id="events"> <div class="container"> <div class="section-header"> <h2 class="section-title">Next Up</h2> <a href="/events" class="all-link">All Events →</a> </div> <div class="events-grid" id="next-up-grid"> <!-- Populated by Firestore client-side script below --> <div id="next-up-empty" style="display:none; grid-column:1/-1; text-align:center; padding:32px 0; color:var(--muted); font-size:15px;">
No upcoming events scheduled yet — check back soon!
</div> </div> </div> </section> <!-- ── YOUR PLACE ───────────────────────────────────── --> <section class="place-section" id="get-involved"> <div class="container"> <h2 class="section-title reveal">Your Place in the Arts</h2> <p class="place-subtitle reveal">There's a role here for everyone — no experience required.</p> <div class="roles-grid"> `, ' </div> </div> </section> <!-- ── DONATE ───────────────────────────────────────── --> <section class="donate-banner"> <div class="container donate-inner"> <div> <h2>Help Art Thrive in Magna</h2> <p>The Arts Council is a non-profit. Every donation goes directly to free community programming.</p> </div> <a href="https://www.paypal.com/donate/?business=magnaartsfestival%40gmail.com&currency_code=USD" target="_blank" rel="noopener" class="btn btn-gold donate-btn">Donate Today</a> </div> </section> </main> ', ' <script type="module">', `
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
  import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

  // 1️⃣ Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const db  = getFirestore(app);

  (async function loadNextUpEvents() {
    try {
      const grid = document.querySelector('.events-grid');
      if (!grid) {
        console.error('Next Up — .events-grid container not found');
        return;
      }

      // 2️⃣ Fetch documents from Firestore
      const q = query(collection(db, 'events'), orderBy('eventDate', 'asc'));
      const snapshot = await getDocs(q);

      // 3️⃣ Build upcoming events array (future dates only)
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const upcoming = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        const dateObj = d.eventDate?.toDate ? d.eventDate.toDate() : new Date(d.eventDate);
        if (isNaN(dateObj.getTime())) return;
        if (dateObj < now) return;

        upcoming.push({
          title:     d.title || 'Untitled Event',
          day:       dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time:      d.eventTime || d.startTime || '',
          location:  d.venueName || d.venue || '',
          eventType: d.eventType || '',
          genre:     d.category || d.genre || d.bandGenre || 'Event',
          _ts:       dateObj.getTime(),
        });
      });

      // 4️⃣ Generate HTML and insert into page
      const html = upcoming.slice(0, 3).map((e, i) => \`
        <article class="event-card \${e.eventType}" style="transition-delay:\${i * 0.1}s">
          <span class="event-tag \${e.eventType ? \`tag-\${e.eventType}\` : ''}">\${e.genre}</span>
          <h3>\${e.title}</h3>
          <div class="event-meta">
            \${e.day ? \`<div class="meta-row"><span class="meta-icon">📅</span>\${e.day}</div>\` : ''}
            \${e.time ? \`<div class="meta-row"><span class="meta-icon">🕐</span>\${e.time}</div>\` : ''}
            \${e.location ? \`<div class="meta-row"><span class="meta-icon">📍</span>\${e.location}</div>\` : ''}
          </div>
          <a href="/events" class="event-link">Learn More →</a>
        </article>
      \`).join('');

      if (upcoming.length === 0) {
        document.getElementById('next-up-empty').style.display = 'block';
        return;
      }

      grid.innerHTML = html;

      // 5️⃣ Optional: scroll reveal
      if (window.observer) {
        grid.querySelectorAll('.event-card').forEach(card => window.observer.observe(card));
      }

    } catch (err) {
      console.error('Next Up — Firestore load failed:', err);
    }
  })();
</script> `], [" ", " ", `<main> <!-- ── HERO ─────────────────────────────────────────── --> <section class="hero"> <div class="container hero-inner"> <div class="hero-text"> <div class="hero-badge">Magna, Utah's Designated Local Arts Agency</div> <h1>Art is the<br><em>Heart</em> of Magna</h1> <p class="hero-sub">
We bring music, art, film, and culture to our community —
            free and open to everyone.
</p> <div class="hero-ctas"> <a href="/events" class="btn btn-white">See Upcoming Events</a> <a href="/get-involved" class="btn btn-outline-white">Get Involved</a> </div> </div> <!-- Right column: pinned content OR standard program tiles --> `, ` </div> </section> <!-- ── NEXT UP ──────────────────────────────────────── --> <section class="section" id="events"> <div class="container"> <div class="section-header"> <h2 class="section-title">Next Up</h2> <a href="/events" class="all-link">All Events →</a> </div> <div class="events-grid" id="next-up-grid"> <!-- Populated by Firestore client-side script below --> <div id="next-up-empty" style="display:none; grid-column:1/-1; text-align:center; padding:32px 0; color:var(--muted); font-size:15px;">
No upcoming events scheduled yet — check back soon!
</div> </div> </div> </section> <!-- ── YOUR PLACE ───────────────────────────────────── --> <section class="place-section" id="get-involved"> <div class="container"> <h2 class="section-title reveal">Your Place in the Arts</h2> <p class="place-subtitle reveal">There's a role here for everyone — no experience required.</p> <div class="roles-grid"> `, ' </div> </div> </section> <!-- ── DONATE ───────────────────────────────────────── --> <section class="donate-banner"> <div class="container donate-inner"> <div> <h2>Help Art Thrive in Magna</h2> <p>The Arts Council is a non-profit. Every donation goes directly to free community programming.</p> </div> <a href="https://www.paypal.com/donate/?business=magnaartsfestival%40gmail.com&currency_code=USD" target="_blank" rel="noopener" class="btn btn-gold donate-btn">Donate Today</a> </div> </section> </main> ', ' <script type="module">', `
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
  import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

  // 1️⃣ Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const db  = getFirestore(app);

  (async function loadNextUpEvents() {
    try {
      const grid = document.querySelector('.events-grid');
      if (!grid) {
        console.error('Next Up — .events-grid container not found');
        return;
      }

      // 2️⃣ Fetch documents from Firestore
      const q = query(collection(db, 'events'), orderBy('eventDate', 'asc'));
      const snapshot = await getDocs(q);

      // 3️⃣ Build upcoming events array (future dates only)
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const upcoming = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        const dateObj = d.eventDate?.toDate ? d.eventDate.toDate() : new Date(d.eventDate);
        if (isNaN(dateObj.getTime())) return;
        if (dateObj < now) return;

        upcoming.push({
          title:     d.title || 'Untitled Event',
          day:       dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          time:      d.eventTime || d.startTime || '',
          location:  d.venueName || d.venue || '',
          eventType: d.eventType || '',
          genre:     d.category || d.genre || d.bandGenre || 'Event',
          _ts:       dateObj.getTime(),
        });
      });

      // 4️⃣ Generate HTML and insert into page
      const html = upcoming.slice(0, 3).map((e, i) => \\\`
        <article class="event-card \\\${e.eventType}" style="transition-delay:\\\${i * 0.1}s">
          <span class="event-tag \\\${e.eventType ? \\\`tag-\\\${e.eventType}\\\` : ''}">\\\${e.genre}</span>
          <h3>\\\${e.title}</h3>
          <div class="event-meta">
            \\\${e.day ? \\\`<div class="meta-row"><span class="meta-icon">📅</span>\\\${e.day}</div>\\\` : ''}
            \\\${e.time ? \\\`<div class="meta-row"><span class="meta-icon">🕐</span>\\\${e.time}</div>\\\` : ''}
            \\\${e.location ? \\\`<div class="meta-row"><span class="meta-icon">📍</span>\\\${e.location}</div>\\\` : ''}
          </div>
          <a href="/events" class="event-link">Learn More →</a>
        </article>
      \\\`).join('');

      if (upcoming.length === 0) {
        document.getElementById('next-up-empty').style.display = 'block';
        return;
      }

      grid.innerHTML = html;

      // 5️⃣ Optional: scroll reveal
      if (window.observer) {
        grid.querySelectorAll('.event-card').forEach(card => window.observer.observe(card));
      }

    } catch (err) {
      console.error('Next Up — Firestore load failed:', err);
    }
  })();
</script> `])), renderComponent($$result2, "Header", $$Header, {}), maybeRenderHead(), showPinned ? renderTemplate`<div${addAttribute(`pinned-tiles ${activePinned.length === 1 ? "pinned-tiles--single" : ""}`, "class")}> ${activePinned.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`pinned-tile ${item.colorClass}`, "class")}> <span class="pinned-tile-badge">${item.badgeText}</span> ${item.logoSrc && renderTemplate`<img${addAttribute(item.logoSrc, "src")} alt="" class="pinned-tile-logo" aria-hidden="true">`} <span class="pinned-tile-icon" aria-hidden="true">${item.icon}</span> <span class="pinned-tile-label">${item.label}</span> <span class="pinned-tile-sublabel">${item.sublabel}</span> <span class="pinned-tile-meta">${item.meta}</span> <span class="pinned-tile-cta">${item.cta}</span> </a>`)} </div>` : renderTemplate`<div class="program-tiles"> <a href="/programs#music-movies" class="tile tile-blue"> <span class="tile-icon">♪</span> <span class="tile-label">Free Concerts</span> </a> <a href="/programs/#art-night" class="tile tile-green"> <span class="tile-icon">✦</span> <span class="tile-label">Art Classes</span> </a> <a href="/programs#music-movies" class="tile tile-red"> <span class="tile-icon">▶</span> <span class="tile-label">Movies in the Park</span> </a> <a href="/programs#festival" class="tile tile-amber"> <span class="tile-icon">★</span> <span class="tile-label">Arts Festival</span> </a> </div>`, roles.map((role, i) => renderTemplate`<div${addAttribute(`role-card ${role.key} reveal`, "class")}${addAttribute(`transition-delay:${i * 0.1}s`, "style")}> <div class="role-icon">${role.icon}</div> <h3>${role.title}</h3> <p>${role.body}</p> <a${addAttribute(role.link, "href")} class="role-link">${role.cta} →</a> </div>`), renderComponent($$result2, "Footer", $$Footer, {}), defineScriptVars({ firebaseConfig })) })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/index.astro", void 0);
const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
