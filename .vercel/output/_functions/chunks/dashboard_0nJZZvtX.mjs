import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$AdminLayout } from './AdminLayout_DI2FboVo.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Dashboard;
  const user = Astro2.locals.user;
  const [bandsSnap, programsSnap, eventsSnap] = await Promise.all([
    adminDb.collection("band_applications").get(),
    adminDb.collection("program_submissions").get(),
    adminDb.collection("events").get()
  ]);
  const bands = bandsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const programs = programsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const counts = {
    bandsPending: bands.filter((b) => !b.status || b.status === "pending").length,
    bandsApproved: bands.filter((b) => b.status === "approved").length,
    bandsPublished: bands.filter((b) => b.status === "published").length,
    programsPending: programs.filter((p) => !p.status || p.status === "pending").length,
    eventsTotal: eventsSnap.size
  };
  const recentBands = [...bands].sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0)).slice(0, 5);
  const recentPrograms = [...programs].sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0)).slice(0, 5);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard", "user": user }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-header"> <h1>Dashboard</h1> </div> <div class="stat-grid"> <div class="stat-card stat-warning"> <div class="stat-number">${counts.bandsPending}</div> <div class="stat-label">Band Applications Pending</div> <a href="/admin/bands?filter=pending" class="stat-link">Review →</a> </div> <div class="stat-card stat-success"> <div class="stat-number">${counts.bandsApproved}</div> <div class="stat-label">Approved (ready to publish)</div> <a href="/admin/bands?filter=approved" class="stat-link">Publish →</a> </div> <div class="stat-card stat-info"> <div class="stat-number">${counts.programsPending}</div> <div class="stat-label">Program Proposals Pending</div> <a href="/admin/programs?filter=pending" class="stat-link">Review →</a> </div> <div class="stat-card stat-primary"> <div class="stat-number">${counts.eventsTotal}</div> <div class="stat-label">Published Events</div> <a href="/admin/events" class="stat-link">Manage →</a> </div> </div> <div class="recent-grid"> <section class="recent-section"> <div class="section-header"> <h2>Recent Band Applications</h2> <a href="/admin/bands" class="link-sm">View all</a> </div> ${recentBands.length === 0 ? renderTemplate`<p class="empty-msg">No applications yet.</p>` : renderTemplate`<table class="data-table"> <thead> <tr> <th>Band</th> <th>Genre</th> <th>Status</th> </tr> </thead> <tbody> ${recentBands.map((b) => renderTemplate`<tr> <td><a${addAttribute(`/admin/bands#${b.id}`, "href")}>${b.band_name}</a></td> <td>${b.genre}</td> <td><span${addAttribute(`badge badge-${b.status || "pending"}`, "class")}>${b.status || "pending"}</span></td> </tr>`)} </tbody> </table>`} </section> <section class="recent-section"> <div class="section-header"> <h2>Recent Program Proposals</h2> <a href="/admin/programs" class="link-sm">View all</a> </div> ${recentPrograms.length === 0 ? renderTemplate`<p class="empty-msg">No proposals yet.</p>` : renderTemplate`<table class="data-table"> <thead> <tr> <th>Title</th> <th>Contact</th> <th>Status</th> </tr> </thead> <tbody> ${recentPrograms.map((p) => renderTemplate`<tr> <td><a${addAttribute(`/admin/programs#${p.id}`, "href")}>${p.program_title || p.title || "(untitled)"}</a></td> <td>${p.contact_name}</td> <td><span${addAttribute(`badge badge-${p.status || "pending"}`, "class")}>${p.status || "pending"}</span></td> </tr>`)} </tbody> </table>`} </section> </div> ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/dashboard.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/dashboard.astro";
const $$url = "/admin/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
