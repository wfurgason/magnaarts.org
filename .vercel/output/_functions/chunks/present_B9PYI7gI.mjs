import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from './global_Hoz3rGEv.mjs';

const $$Present = createComponent(($$result, $$props, $$slots) => {
  const options = [
    {
      icon: "💡",
      num: "01",
      title: "Propose a Program",
      body: "Have an idea for an event, class, performance, or community program that doesn't fit the categories below? Submit a general proposal and the board will review it at the next monthly meeting.",
      link: "/propose",
      label: "Submit a proposal →",
      color: "red"
    },
    {
      icon: "🎸",
      num: "02",
      title: "Apply as a Band",
      body: "Perform live at Music & Movies in the Park — our summer Friday night concert series at Pleasant Green Park. Open to all genres. Reviewed by the board each season.",
      link: "/call-for-bands",
      label: "Apply to perform →",
      color: "blue"
    },
    {
      icon: "🎨",
      num: "03",
      title: "Teach an Art Class",
      body: "Lead a Group Art Night session at the Magna Library. Share your skill — painting, drawing, pottery, crafts, or any hands-on art form — with your neighbors.",
      link: "/teach-an-art-class",
      label: "Submit your interest →",
      color: "green"
    },
    {
      icon: "🛒",
      num: "04",
      title: "Vendor at the Arts Festival",
      body: "Sell your art, crafts, or food at the Magna Main Street Arts Festival. Applications open each spring for our annual flagship event drawing thousands of attendees.",
      link: "/vendor-application",
      label: "Apply as a vendor →",
      color: "amber"
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Present or Perform — Magna Arts Council", "description": "Ways to present, perform, or participate in Magna Arts Council programs — propose an event, apply as a band, teach an art class, or become a festival vendor.", "data-astro-cid-mis5sgv3": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-mis5sgv3": true })} ${maybeRenderHead()}<main data-astro-cid-mis5sgv3> <!-- ── PAGE HERO ── --> <section class="page-hero" data-astro-cid-mis5sgv3> <div class="container" data-astro-cid-mis5sgv3> <div class="hero-badge" data-astro-cid-mis5sgv3>Present &amp; Perform</div> <h1 data-astro-cid-mis5sgv3>Bring Your Talent to Magna</h1> <p class="hero-sub" data-astro-cid-mis5sgv3>
There are several ways to share your art with the community.
          Choose the path that fits what you do.
</p> </div> </section> <!-- ── OPTIONS GRID ── --> <section class="section options-section" data-astro-cid-mis5sgv3> <div class="container" data-astro-cid-mis5sgv3> <div class="options-grid" data-astro-cid-mis5sgv3> ${options.map((o) => renderTemplate`<div${addAttribute(`option-card option-${o.color}`, "class")} data-astro-cid-mis5sgv3> <div class="option-num" data-astro-cid-mis5sgv3>${o.num}</div> <span class="option-icon" data-astro-cid-mis5sgv3>${o.icon}</span> <h3 data-astro-cid-mis5sgv3>${o.title}</h3> <p data-astro-cid-mis5sgv3>${o.body}</p> <a${addAttribute(o.link, "href")} class="option-link" data-astro-cid-mis5sgv3>${o.label}</a> </div>`)} </div> </div> </section> <!-- ── PROCESS ── --> <section class="process-section" data-astro-cid-mis5sgv3> <div class="container process-inner" data-astro-cid-mis5sgv3> <div class="process-text" data-astro-cid-mis5sgv3> <div class="hero-badge" data-astro-cid-mis5sgv3>How It Works</div> <h2 data-astro-cid-mis5sgv3>What Happens After You Apply</h2> <p data-astro-cid-mis5sgv3>
Every submission is reviewed by the full Arts Council board. We meet monthly
            and respond to all applicants. Accepted presenters and performers are paired with
            a board sponsor who helps you plan, promote, and run your event.
</p> <p data-astro-cid-mis5sgv3>
All events are free and open to the Magna community — your audience is built in.
</p> <a href="/contact" class="btn btn-gold" style="margin-top: 8px;" data-astro-cid-mis5sgv3>Have a question? Contact us →</a> </div> <div class="process-steps" data-astro-cid-mis5sgv3> <div class="step" data-astro-cid-mis5sgv3> <div class="step-num" data-astro-cid-mis5sgv3>1</div> <div data-astro-cid-mis5sgv3> <strong data-astro-cid-mis5sgv3>Apply or Propose</strong> <p data-astro-cid-mis5sgv3>Submit your application or proposal using the form that matches your interest.</p> </div> </div> <div class="step" data-astro-cid-mis5sgv3> <div class="step-num" data-astro-cid-mis5sgv3>2</div> <div data-astro-cid-mis5sgv3> <strong data-astro-cid-mis5sgv3>Board Review</strong> <p data-astro-cid-mis5sgv3>The board reviews your submission at the next monthly meeting and votes to accept.</p> </div> </div> <div class="step" data-astro-cid-mis5sgv3> <div class="step-num" data-astro-cid-mis5sgv3>3</div> <div data-astro-cid-mis5sgv3> <strong data-astro-cid-mis5sgv3>Plan Together</strong> <p data-astro-cid-mis5sgv3>A board sponsor is assigned to help you with logistics, promotion, and setup.</p> </div> </div> <div class="step" data-astro-cid-mis5sgv3> <div class="step-num" data-astro-cid-mis5sgv3>4</div> <div data-astro-cid-mis5sgv3> <strong data-astro-cid-mis5sgv3>Take the Stage</strong> <p data-astro-cid-mis5sgv3>Your event goes live — free and open to the whole Magna community.</p> </div> </div> </div> </div> </section> <!-- ── CTA ── --> <section class="cta-banner" data-astro-cid-mis5sgv3> <div class="container cta-inner" data-astro-cid-mis5sgv3> <div data-astro-cid-mis5sgv3> <h2 data-astro-cid-mis5sgv3>Not Sure Which Fits?</h2> <p data-astro-cid-mis5sgv3>Reach out and we'll point you in the right direction.</p> </div> <a href="/contact" class="btn btn-gold" data-astro-cid-mis5sgv3>Contact Us →</a> </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-mis5sgv3": true })} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/present.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/present.astro";
const $$url = "/present";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Present,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
