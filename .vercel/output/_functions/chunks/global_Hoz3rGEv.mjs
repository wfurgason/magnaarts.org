import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { a2 as addAttribute, b8 as renderSlot, b9 as renderHead, L as renderTemplate, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import 'clsx';
import { r as renderScript } from './script_BgFssCUG.mjs';

const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "Magna Arts Council",
    description = "Magna, Utah's Designated Local Arts Agency. Free music, art, film, and culture for the community."
  } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title><!-- Favicons --><link rel="icon" type="image/x-icon" href="/images/favicon.ico"><link rel="icon" type="image/svg+xml" href="/images/favicon.svg"><link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png"><link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"><link rel="manifest" href="/images/site.webmanifest"><!-- Open Graph --><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><meta property="og:url" content="https://magnaarts.org">${renderSlot($$result, $$slots["head"])}${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} <!-- Scroll reveal observer — used site-wide --> ${renderScript($$result, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/layouts/BaseLayout.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <div class="container header-inner" data-astro-cid-3ef6ksr2> <a href="/" class="logo" aria-label="Magna Arts Council home" data-astro-cid-3ef6ksr2> <img src="/images/ArtsCouncil_logo.png" alt="Magna Arts Council" class="logo-img" data-astro-cid-3ef6ksr2> </a> <nav aria-label="Main navigation" data-astro-cid-3ef6ksr2> <a href="/events" data-astro-cid-3ef6ksr2>Events</a> <a href="/programs" data-astro-cid-3ef6ksr2>Programs</a> <a href="/get-involved" data-astro-cid-3ef6ksr2>Get Involved</a> <a href="/about" data-astro-cid-3ef6ksr2>About</a> <a href="/present" class="btn btn-gold" data-astro-cid-3ef6ksr2>Propose a Program</a> </nav> <!-- Mobile menu toggle — wired up in JS below --> <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" data-astro-cid-3ef6ksr2> <span data-astro-cid-3ef6ksr2></span><span data-astro-cid-3ef6ksr2></span><span data-astro-cid-3ef6ksr2></span> </button> </div> </header>  ${renderScript($$result, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/components/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer data-astro-cid-sz7xmlte> <div class="container footer-inner" data-astro-cid-sz7xmlte> <div class="footer-brand" data-astro-cid-sz7xmlte> <img src="/images/ArtsCouncil_logo.png" alt="Magna Arts Council logo" class="brand-logo" data-astro-cid-sz7xmlte> <div data-astro-cid-sz7xmlte> <span class="logo" data-astro-cid-sz7xmlte>Magna Arts Council</span> <p data-astro-cid-sz7xmlte>Magna, Utah's Designated Local Arts Agency</p> </div> </div> <nav class="footer-nav" aria-label="Footer navigation" data-astro-cid-sz7xmlte> <div class="footer-nav-row" data-astro-cid-sz7xmlte> <a href="/events" data-astro-cid-sz7xmlte>Events</a> <a href="/programs" data-astro-cid-sz7xmlte>Programs</a> <a href="/get-involved" data-astro-cid-sz7xmlte>Get Involved</a> <a href="/about" data-astro-cid-sz7xmlte>About</a> <a href="/contact" data-astro-cid-sz7xmlte>Contact</a> </div> <div class="footer-nav-row footer-nav-sub" data-astro-cid-sz7xmlte> <a href="/call-for-bands" data-astro-cid-sz7xmlte>Band Application</a> <a href="/vendor-application" data-astro-cid-sz7xmlte>Vendor Application</a> </div> </nav> </div> <div class="footer-bottom" data-astro-cid-sz7xmlte> <div class="container footer-bottom-inner" data-astro-cid-sz7xmlte> <span data-astro-cid-sz7xmlte>© ${(/* @__PURE__ */ new Date()).getFullYear()} Magna Arts Council &nbsp;·&nbsp;
<a href="/privacy" data-astro-cid-sz7xmlte>Privacy</a></span> <img src="/images/ZAPLogoHorizontal_PrimaryColor_White.png" alt="Funded by ZAP — Zoo, Arts & Parks" class="zap-logo" data-astro-cid-sz7xmlte> </div> </div> </footer>`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/components/Footer.astro", void 0);

export { $$BaseLayout as $, $$Header as a, $$Footer as b };
