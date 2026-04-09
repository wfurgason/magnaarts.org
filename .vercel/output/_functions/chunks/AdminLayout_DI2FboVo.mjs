import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { b8 as renderSlot, b9 as renderHead, a2 as addAttribute, L as renderTemplate } from './sequence_B8w407xz.mjs';
import 'clsx';
import { r as renderScript } from './script_BgFssCUG.mjs';
/* empty css                */

const $$AdminLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title, user } = Astro2.props;
  const isSuperAdmin = user.customClaims?.role === "super_admin";
  const currentPath = Astro2.url.pathname;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} — Magna Arts Admin</title><link rel="icon" type="image/x-icon" href="/images/favicon.ico"><link rel="icon" type="image/svg+xml" href="/images/favicon.svg"><link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png"><link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"><link rel="manifest" href="/images/site.webmanifest"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">${renderSlot($$result, $$slots["head"])}${renderHead()}</head> <body class="admin-body"> <aside class="admin-sidebar"> <div class="sidebar-brand"> <div class="sidebar-logo-wrap"> <img src="/images/ArtsCouncil_logo.png" alt="Magna Arts Council" class="sidebar-logo"> </div> <div class="sidebar-brand-text"> <span class="brand-name">Magna Arts</span> <span class="brand-sub">Board Portal</span> </div> </div> <nav class="sidebar-nav"> <a href="/admin/dashboard"${addAttribute(["nav-link", { active: currentPath === "/admin/dashboard" }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
Dashboard
</a> <a href="/admin/bands"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/bands") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
Band Applications
</a> <a href="/admin/programs"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/programs") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
Program Proposals
</a> <a href="/admin/planning"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/planning") || currentPath.startsWith("/admin/seasons") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.42z"></path></svg>
Plan Events
</a> <a href="/admin/events"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/events") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
Published Events
</a> <a href="/admin/pinned-content"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/pinned-content") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
Pinned Content
</a> <a href="/admin/art-presenters"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/art-presenters") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 1 0 5 5A5 5 0 0 0 12 2zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-14 0v1"></path></svg>
Art Presenters
</a> <a href="/admin/volunteers"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/volunteers") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line><line x1="20" y1="8" x2="20" y2="14"></line></svg>
Volunteers
</a> <a href="/admin/vendors"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/vendors") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
Vendor Applications
</a> ${isSuperAdmin && renderTemplate`<a href="/admin/users"${addAttribute(["nav-link", { active: currentPath.startsWith("/admin/users") }], "class:list")}> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
Board Members
</a>`} </nav> <div class="sidebar-footer"> <span class="user-email">${user.email}</span> <button id="logout-btn" class="btn-logout">Sign Out</button> </div> </aside> <main class="admin-main"> ${renderSlot($$result, $$slots["default"])} </main> ${renderScript($$result, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/layouts/AdminLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
