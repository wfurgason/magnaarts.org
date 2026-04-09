import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$BaseLayout, a as $$Header, b as $$Footer } from './global_Hoz3rGEv.mjs';

const $$Confirmation = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Proposal Received — Magna Arts Council", "description": "Thank you for submitting your event proposal to the Magna Arts Council.", "data-astro-cid-vumx5dpq": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-vumx5dpq": true })} ${maybeRenderHead()}<main data-astro-cid-vumx5dpq> <section class="confirm-section" data-astro-cid-vumx5dpq> <div class="container confirm-inner" data-astro-cid-vumx5dpq> <div class="confirm-card reveal" data-astro-cid-vumx5dpq> <div class="confirm-icon" data-astro-cid-vumx5dpq>✓</div> <h1 data-astro-cid-vumx5dpq>Proposal Received!</h1> <p class="confirm-lead" data-astro-cid-vumx5dpq>
Thank you for sharing your idea with the Magna Arts Council.
            A confirmation has been sent to your email.
</p> <div class="what-next" data-astro-cid-vumx5dpq> <h2 data-astro-cid-vumx5dpq>What happens next</h2> <ol class="next-steps" data-astro-cid-vumx5dpq> <li data-astro-cid-vumx5dpq> <span class="step-num" data-astro-cid-vumx5dpq>1</span> <div data-astro-cid-vumx5dpq> <strong data-astro-cid-vumx5dpq>Board review</strong> <p data-astro-cid-vumx5dpq>The board reviews all proposals at our monthly meeting.</p> </div> </li> <li data-astro-cid-vumx5dpq> <span class="step-num" data-astro-cid-vumx5dpq>2</span> <div data-astro-cid-vumx5dpq> <strong data-astro-cid-vumx5dpq>You'll hear back within 2–3 weeks</strong> <p data-astro-cid-vumx5dpq>We'll email you with the board's decision — approved, declined, or questions.</p> </div> </li> <li data-astro-cid-vumx5dpq> <span class="step-num" data-astro-cid-vumx5dpq>3</span> <div data-astro-cid-vumx5dpq> <strong data-astro-cid-vumx5dpq>If approved — planning begins</strong> <p data-astro-cid-vumx5dpq>A board member is assigned as your sponsor and will reach out to start planning together.</p> </div> </li> </ol> </div> <div class="confirm-actions" data-astro-cid-vumx5dpq> <a href="/events" class="btn btn-gold" data-astro-cid-vumx5dpq>See Upcoming Events</a> <a href="/" class="btn btn-back" data-astro-cid-vumx5dpq>Back to Home</a> </div> </div> </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-vumx5dpq": true })} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/propose/confirmation.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/propose/confirmation.astro";
const $$url = "/propose/confirmation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Confirmation,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
