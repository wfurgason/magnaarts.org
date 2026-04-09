import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from './global_Hoz3rGEv.mjs';

const $$GetInvolved = createComponent(($$result, $$props, $$slots) => {
  const volunteerRoles = [
    { icon: "🔧", title: "Setup & Teardown", body: "Help us set up stages, seating, and equipment before events and clean up after." },
    { icon: "👋", title: "Greeter / Info Booth", body: "Welcome attendees, answer questions, and hand out programs at the event entrance." },
    { icon: "🎬", title: "Screen & Sound Crew", body: "Assist with operating the 35-ft inflatable movie screen and sound equipment." },
    { icon: "🍕", title: "Vendor Coordination", body: "Help coordinate food and art vendors at the Arts Festival and other events." },
    { icon: "📸", title: "Photography", body: "Capture photos and video of events for social media and grant documentation." },
    { icon: "📋", title: "Event Administration", body: "Help with sign-in sheets, attendance tracking, and on-site logistics." }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Get Involved — Magna Arts Council", "description": "Volunteer, present a program, or join the board. There are many ways to be part of the Magna Arts Council.", "data-astro-cid-sqexk5lr": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-sqexk5lr": true })} ${maybeRenderHead()}<main data-astro-cid-sqexk5lr> <!-- ── PAGE HERO ── --> <section class="page-hero" data-astro-cid-sqexk5lr> <div class="container" data-astro-cid-sqexk5lr> <div class="hero-badge" data-astro-cid-sqexk5lr>Get Involved</div> <h1 data-astro-cid-sqexk5lr>There's a Place for You Here</h1> <p class="hero-sub" data-astro-cid-sqexk5lr>
The Magna Arts Council runs entirely on community support —
          volunteers, presenters, and board members who care about arts in Magna.
</p> </div> </section> <!-- ── 4 WAYS ── --> <section class="section ways-section" data-astro-cid-sqexk5lr> <div class="container" data-astro-cid-sqexk5lr> <h2 class="section-title reveal" data-astro-cid-sqexk5lr>Four Ways to Participate</h2> <div class="ways-grid" data-astro-cid-sqexk5lr> <div class="way-card way-attend reveal" data-astro-cid-sqexk5lr> <div class="way-num" data-astro-cid-sqexk5lr>01</div> <span class="way-icon" data-astro-cid-sqexk5lr>👥</span> <h3 data-astro-cid-sqexk5lr>Attend</h3> <p data-astro-cid-sqexk5lr>Every event is free and open to all. Come enjoy concerts, movies, open mic nights, art classes, and our annual Arts Festival.</p> <a href="/events" class="way-link" data-astro-cid-sqexk5lr>See upcoming events →</a> </div> <div class="way-card way-volunteer reveal" id="volunteer" data-astro-cid-sqexk5lr> <div class="way-num" data-astro-cid-sqexk5lr>02</div> <span class="way-icon" data-astro-cid-sqexk5lr>🙌</span> <h3 data-astro-cid-sqexk5lr>Volunteer</h3> <p data-astro-cid-sqexk5lr>We need crew before, during, and after every event. No experience needed — just a willingness to help your community.</p> <a href="/volunteer" class="way-link" data-astro-cid-sqexk5lr>Sign up to volunteer →</a> </div> <div class="way-card way-present reveal" data-astro-cid-sqexk5lr> <div class="way-num" data-astro-cid-sqexk5lr>03</div> <span class="way-icon" data-astro-cid-sqexk5lr>💡</span> <h3 data-astro-cid-sqexk5lr>Present</h3> <p data-astro-cid-sqexk5lr>Have an idea for a class, concert, or community event? Submit a proposal and we'll review it at our next board meeting.</p> <a href="/present" class="way-link" data-astro-cid-sqexk5lr>See ways to present →</a> </div> <div class="way-card way-board reveal" id="board" data-astro-cid-sqexk5lr> <div class="way-num" data-astro-cid-sqexk5lr>04</div> <span class="way-icon" data-astro-cid-sqexk5lr>⭐</span> <h3 data-astro-cid-sqexk5lr>Join the Board</h3> <p data-astro-cid-sqexk5lr>Help shape the future of arts in Magna. Board members attend monthly meetings, sponsor programs, and guide our mission.</p> <a href="/contact" class="way-link" data-astro-cid-sqexk5lr>Get in touch →</a> </div> </div> </div> </section> <!-- ── VOLUNTEER ROLES ── --> <section class="section volunteer-section" data-astro-cid-sqexk5lr> <div class="container" data-astro-cid-sqexk5lr> <div class="section-header reveal" data-astro-cid-sqexk5lr> <h2 class="section-title" data-astro-cid-sqexk5lr>Volunteer Opportunities</h2> <p class="section-sub" data-astro-cid-sqexk5lr>Here are some of the ways volunteers help make our events happen.</p> </div> <div class="roles-grid" data-astro-cid-sqexk5lr> ${volunteerRoles.map((r, i) => renderTemplate`<div class="role-card reveal"${addAttribute(`transition-delay:${i * 0.07}s`, "style")} data-astro-cid-sqexk5lr> <span class="role-icon" data-astro-cid-sqexk5lr>${r.icon}</span> <h3 data-astro-cid-sqexk5lr>${r.title}</h3> <p data-astro-cid-sqexk5lr>${r.body}</p> </div>`)} </div> <div class="volunteer-cta reveal" data-astro-cid-sqexk5lr> <a href="/volunteer" class="btn btn-gold" data-astro-cid-sqexk5lr>
Sign Up to Volunteer →
</a> </div> </div> </section> <!-- ── PROPOSE ── --> <section class="propose-section reveal" data-astro-cid-sqexk5lr> <div class="container propose-inner" data-astro-cid-sqexk5lr> <div class="propose-text" data-astro-cid-sqexk5lr> <div class="hero-badge" data-astro-cid-sqexk5lr>Presenters</div> <h2 data-astro-cid-sqexk5lr>Have an Idea? Propose It.</h2> <p data-astro-cid-sqexk5lr>
The Arts Council is always looking for local performers, teachers, and organizers
            who want to bring something new to Magna. Whether it's a concert, a film screening,
            an art class, or something we've never done before — we want to hear it.
</p> <p data-astro-cid-sqexk5lr>
All proposals are reviewed by the full board. Accepted programs are assigned a board
            sponsor who works alongside you through planning, promotion, and day-of logistics.
</p> <a href="/present" class="btn btn-gold" style="margin-top: 8px;" data-astro-cid-sqexk5lr>Submit a Proposal →</a> </div> <div class="propose-steps" data-astro-cid-sqexk5lr> <div class="step" data-astro-cid-sqexk5lr> <div class="step-num" data-astro-cid-sqexk5lr>1</div> <div data-astro-cid-sqexk5lr> <strong data-astro-cid-sqexk5lr>Submit</strong> <p data-astro-cid-sqexk5lr>Fill out the proposal form with your idea, intended audience, and needs.</p> </div> </div> <div class="step" data-astro-cid-sqexk5lr> <div class="step-num" data-astro-cid-sqexk5lr>2</div> <div data-astro-cid-sqexk5lr> <strong data-astro-cid-sqexk5lr>Review</strong> <p data-astro-cid-sqexk5lr>The board reviews your proposal at the next monthly meeting and votes.</p> </div> </div> <div class="step" data-astro-cid-sqexk5lr> <div class="step-num" data-astro-cid-sqexk5lr>3</div> <div data-astro-cid-sqexk5lr> <strong data-astro-cid-sqexk5lr>Plan</strong> <p data-astro-cid-sqexk5lr>A board sponsor is assigned to help you plan, promote, and run your event.</p> </div> </div> <div class="step" data-astro-cid-sqexk5lr> <div class="step-num" data-astro-cid-sqexk5lr>4</div> <div data-astro-cid-sqexk5lr> <strong data-astro-cid-sqexk5lr>Present</strong> <p data-astro-cid-sqexk5lr>Your event goes live — free and open to the Magna community.</p> </div> </div> </div> </div> </section> <!-- ── CTA ── --> <section class="cta-banner" data-astro-cid-sqexk5lr> <div class="container cta-inner reveal" data-astro-cid-sqexk5lr> <div data-astro-cid-sqexk5lr> <h2 data-astro-cid-sqexk5lr>Questions?</h2> <p data-astro-cid-sqexk5lr>Reach out any time — we'd love to talk about how you can be part of what we're building in Magna.</p> </div> <a href="/contact" class="btn btn-gold" data-astro-cid-sqexk5lr>Contact Us →</a> </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-sqexk5lr": true })} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/get-involved.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/get-involved.astro";
const $$url = "/get-involved";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$GetInvolved,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
