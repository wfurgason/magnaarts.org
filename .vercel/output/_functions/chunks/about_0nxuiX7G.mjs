import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from './global_Hoz3rGEv.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  const board = [
    { name: "Wes Furgason", role: "President" },
    { name: "Tammy Furgason", role: "Secretary" },
    { name: "Todd Richards", role: "Treasurer" },
    { name: "Carolyn Richards", role: "Board Member" },
    { name: "Melissa Wayman", role: "Board Member" },
    { name: "Melissa Gates", role: "Board Member" }
  ];
  const programs = [
    {
      icon: "♪",
      color: "blue",
      title: "Music & Movies in the Park",
      body: "Every Friday night June through August at Pleasant Green Park. Live music from 8 PM followed by a movie on our 35-ft inflatable screen. Over 300 people attend each event — 14 musical acts each summer."
    },
    {
      icon: "★",
      color: "amber",
      title: "Magna Main Street Arts Festival",
      body: "Our flagship annual event each August draws 5,000–7,000 attendees to historic Magna Main Street. Live music, a fine arts contest, street performers, and arts and food vendors."
    },
    {
      icon: "🎤",
      color: "green",
      title: "Open Mic Night",
      body: "8–10 events per year at the Magna Library. Two hours of music, comedy, and poetry by community participants. Sound system by the Arts Council; space and refreshments by the Library."
    },
    {
      icon: "✦",
      color: "green",
      title: "Group Art Night",
      body: "Artist-guided sessions at the Magna Library where participants create art together. Consistently draws around 20 participants — one of our most popular ongoing programs."
    },
    {
      icon: "📚",
      color: "blue",
      title: "Annual Arts Seminar",
      body: "Each seminar focuses on a different art discipline and features a panel of experts, educational presentations, community outreach, and an open Q&A session."
    }
  ];
  const partners = [
    { name: "Magna Library", detail: "Host venue for Open Mic, Group Art Night, and Arts Seminars." },
    { name: "Salt Lake County Parks & Rec", detail: "Waives park rental fees for Music & Movies in the Park at Pleasant Green Park." },
    { name: "ZAP (Zoo, Arts & Parks)", detail: "Sales tax funding program supporting Salt Lake County arts organizations." },
    { name: "Utah Division of Arts & Museums", detail: "State-level arts agency partnership and grant support." }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "About — Magna Arts Council", "description": "Learn about the Magna Arts Council — Magna, Utah's Designated Local Arts Agency. Meet our board, explore our programs, and discover our community partners.", "data-astro-cid-kh7btl4r": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-kh7btl4r": true })} ${maybeRenderHead()}<main data-astro-cid-kh7btl4r> <!-- ── PAGE HERO ── --> <section class="page-hero" data-astro-cid-kh7btl4r> <div class="container" data-astro-cid-kh7btl4r> <div class="hero-badge" data-astro-cid-kh7btl4r>About Us</div> <h1 data-astro-cid-kh7btl4r>Community. Culture. Magna.</h1> <p class="hero-sub" data-astro-cid-kh7btl4r>
The Magna Arts Council is Magna, Utah's Designated Local Arts Agency —
          bringing free music, art, film, and culture to our community.
</p> </div> </section> <!-- ── MISSION ── --> <section class="section mission-section reveal" data-astro-cid-kh7btl4r> <div class="container mission-inner" data-astro-cid-kh7btl4r> <div class="mission-text" data-astro-cid-kh7btl4r> <h2 data-astro-cid-kh7btl4r>Who We Are</h2> <p data-astro-cid-kh7btl4r>
The Magna Arts Council has a well-structured team and a network of partners
            to support its activities and events. We believe a strong community engagement
            strategy — utilizing both institutional partnerships and grassroots volunteer
            efforts — is essential to the success of everything we do.
</p> <p data-astro-cid-kh7btl4r>
Regular meetings are open to partners, volunteers, and community residents.
            Our goal is to keep everyone aligned with the organization's mission and
            to ensure arts programming continues to enrich Magna's cultural landscape.
</p> <div class="mission-stats" data-astro-cid-kh7btl4r> <div class="stat" data-astro-cid-kh7btl4r> <span class="stat-number" data-astro-cid-kh7btl4r>300+</span> <span class="stat-label" data-astro-cid-kh7btl4r>per concert</span> </div> <div class="stat" data-astro-cid-kh7btl4r> <span class="stat-number" data-astro-cid-kh7btl4r>5–7k</span> <span class="stat-label" data-astro-cid-kh7btl4r>Arts Festival attendance</span> </div> <div class="stat" data-astro-cid-kh7btl4r> <span class="stat-number" data-astro-cid-kh7btl4r>14</span> <span class="stat-label" data-astro-cid-kh7btl4r>live acts each summer</span> </div> </div> </div> <div class="mission-pillars" data-astro-cid-kh7btl4r> <div class="pillar pillar-navy" data-astro-cid-kh7btl4r> <span class="pillar-icon" data-astro-cid-kh7btl4r>👥</span> <div data-astro-cid-kh7btl4r> <h3 data-astro-cid-kh7btl4r>Leadership</h3> <p data-astro-cid-kh7btl4r>An elected board committed to transparency, community service, and growing the arts in Magna.</p> </div> </div> <div class="pillar pillar-gold" data-astro-cid-kh7btl4r> <span class="pillar-icon" data-astro-cid-kh7btl4r>🤝</span> <div data-astro-cid-kh7btl4r> <h3 data-astro-cid-kh7btl4r>Partnerships</h3> <p data-astro-cid-kh7btl4r>Collaboration with the Library, Salt Lake County, ZAP, and local schools and organizations.</p> </div> </div> <div class="pillar pillar-blue" data-astro-cid-kh7btl4r> <span class="pillar-icon" data-astro-cid-kh7btl4r>🎶</span> <div data-astro-cid-kh7btl4r> <h3 data-astro-cid-kh7btl4r>Events</h3> <p data-astro-cid-kh7btl4r>Free, open, and welcoming events for everyone in Magna — year-round programming for all ages.</p> </div> </div> </div> </div> </section> <!-- ── PROGRAMS ── --> <section class="section programs-section" data-astro-cid-kh7btl4r> <div class="container" data-astro-cid-kh7btl4r> <div class="section-header reveal" data-astro-cid-kh7btl4r> <h2 class="section-title" data-astro-cid-kh7btl4r>Our Programs</h2> </div> <div class="programs-grid" data-astro-cid-kh7btl4r> ${programs.map((p, i) => renderTemplate`<div${addAttribute(`program-card program-${p.color} reveal`, "class")}${addAttribute(`transition-delay:${i * 0.08}s`, "style")} data-astro-cid-kh7btl4r> <span class="program-icon" data-astro-cid-kh7btl4r>${p.icon}</span> <h3 data-astro-cid-kh7btl4r>${p.title}</h3> <p data-astro-cid-kh7btl4r>${p.body}</p> </div>`)} </div> </div> </section> <!-- ── BOARD ── --> <section class="section board-section" data-astro-cid-kh7btl4r> <div class="container" data-astro-cid-kh7btl4r> <div class="section-header reveal" data-astro-cid-kh7btl4r> <h2 class="section-title" data-astro-cid-kh7btl4r>Board of Directors</h2> </div> <div class="board-grid" data-astro-cid-kh7btl4r> ${board.map((m) => renderTemplate`<div class="board-card reveal" data-astro-cid-kh7btl4r> <div class="board-avatar" data-astro-cid-kh7btl4r>${m.name.charAt(0)}</div> <div data-astro-cid-kh7btl4r> <div class="board-name" data-astro-cid-kh7btl4r>${m.name}</div> <div class="board-role" data-astro-cid-kh7btl4r>${m.role}</div> </div> </div>`)} </div> </div> </section> <!-- ── PARTNERS ── --> <section class="section partners-section" data-astro-cid-kh7btl4r> <div class="container" data-astro-cid-kh7btl4r> <div class="section-header reveal" data-astro-cid-kh7btl4r> <h2 class="section-title" data-astro-cid-kh7btl4r>Our Partners</h2> <p class="section-sub" data-astro-cid-kh7btl4r>We couldn't do this without the support of these organizations.</p> </div> <div class="partners-grid" data-astro-cid-kh7btl4r> ${partners.map((p) => renderTemplate`<div class="partner-card reveal" data-astro-cid-kh7btl4r> <h3 data-astro-cid-kh7btl4r>${p.name}</h3> <p data-astro-cid-kh7btl4r>${p.detail}</p> </div>`)} </div> </div> </section> <!-- ── CTA ── --> <section class="cta-banner" data-astro-cid-kh7btl4r> <div class="container cta-inner reveal" data-astro-cid-kh7btl4r> <div data-astro-cid-kh7btl4r> <h2 data-astro-cid-kh7btl4r>Get Involved</h2> <p data-astro-cid-kh7btl4r>Volunteer, attend, propose a program, or join the board. There's a place for you here.</p> </div> <a href="/get-involved" class="btn btn-gold" data-astro-cid-kh7btl4r>Find Your Place →</a> </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-kh7btl4r": true })} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/about.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
