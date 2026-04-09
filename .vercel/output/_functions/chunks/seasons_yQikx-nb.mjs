import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import './sequence_B8w407xz.mjs';
import 'clsx';

const $$Seasons = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Seasons;
  return Astro2.redirect("/admin/planning", 301);
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/seasons.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/seasons.astro";
const $$url = "/admin/seasons";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Seasons,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
