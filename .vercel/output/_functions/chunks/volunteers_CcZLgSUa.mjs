import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute, F as Fragment } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { r as renderScript } from './script_BgFssCUG.mjs';
import { $ as $$AdminLayout } from './AdminLayout_DI2FboVo.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

const $$Volunteers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Volunteers;
  const user = Astro2.locals.user;
  const filterParam = Astro2.url.searchParams.get("filter") || "all";
  const snap = await adminDb.collection("volunteer_signups").orderBy("submittedAt", "desc").get();
  const filters = ["all", "new", "contacted", "active", "inactive"];
  let volunteers = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  if (filterParam !== "all") {
    volunteers = volunteers.filter((v) => (v.status || "new") === filterParam);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Volunteers", "user": user, "data-astro-cid-cenpxk2z": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-header" data-astro-cid-cenpxk2z> <h1 data-astro-cid-cenpxk2z>Volunteer Sign-Ups</h1> <p class="page-sub" data-astro-cid-cenpxk2z>${snap.size} total submission${snap.size !== 1 ? "s" : ""}</p> <div class="filter-tabs" data-astro-cid-cenpxk2z> ${filters.map((f) => renderTemplate`<a${addAttribute(`/admin/volunteers${f === "all" ? "" : `?filter=${f}`}`, "href")}${addAttribute(["filter-tab", { active: filterParam === f }], "class:list")} data-astro-cid-cenpxk2z> ${f.charAt(0).toUpperCase() + f.slice(1)} </a>`)} </div> </div> ${volunteers.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-cenpxk2z> <p data-astro-cid-cenpxk2z>No volunteer sign-ups matching this filter.</p> </div>` : renderTemplate`<div class="vol-table-wrap" data-astro-cid-cenpxk2z> <table class="vol-table" id="vol-table" data-astro-cid-cenpxk2z> <thead data-astro-cid-cenpxk2z> <tr data-astro-cid-cenpxk2z> <th data-astro-cid-cenpxk2z>Name<br data-astro-cid-cenpxk2z><input class="col-filter" data-col="0" placeholder="Filter..." data-astro-cid-cenpxk2z></th> <th data-astro-cid-cenpxk2z>Email<br data-astro-cid-cenpxk2z><input class="col-filter" data-col="1" placeholder="Filter..." data-astro-cid-cenpxk2z></th> <th data-astro-cid-cenpxk2z>Phone<br data-astro-cid-cenpxk2z><input class="col-filter" data-col="2" placeholder="Filter..." data-astro-cid-cenpxk2z></th> <th data-astro-cid-cenpxk2z>Interests<br data-astro-cid-cenpxk2z><input class="col-filter" data-col="3" placeholder="Filter..." data-astro-cid-cenpxk2z></th> <th data-astro-cid-cenpxk2z>Status<br data-astro-cid-cenpxk2z><input class="col-filter" data-col="4" placeholder="Filter..." data-astro-cid-cenpxk2z></th> <th data-astro-cid-cenpxk2z>Actions</th> </tr> </thead> <tbody data-astro-cid-cenpxk2z> ${volunteers.map((v) => renderTemplate`<tr${addAttribute(v.id, "id")} data-astro-cid-cenpxk2z> <td class="vol-name" data-astro-cid-cenpxk2z>${v.fullName}</td> <td data-astro-cid-cenpxk2z><a${addAttribute(`mailto:${v.email}`, "href")} data-astro-cid-cenpxk2z>${v.email}</a></td> <td data-astro-cid-cenpxk2z>${v.phone || ""}</td> <td class="interests-cell" data-astro-cid-cenpxk2z> ${v.interests && v.interests.length > 0 ? v.interests.map((i) => renderTemplate`<span class="interest-chip" data-astro-cid-cenpxk2z>${i}</span>`) : renderTemplate`<span class="muted" data-astro-cid-cenpxk2z>&mdash;</span>`} </td> <td data-astro-cid-cenpxk2z><span${addAttribute(`badge badge-${v.status || "new"}`, "class")} data-astro-cid-cenpxk2z>${v.status || "new"}</span></td> <td class="actions-cell" data-astro-cid-cenpxk2z> ${(v.status === "new" || !v.status) && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-cenpxk2z": true }, { "default": async ($$result3) => renderTemplate` <button class="btn-xs btn-primary" data-action="contacted"${addAttribute(v.id, "data-id")} data-astro-cid-cenpxk2z>Contacted</button> <button class="btn-xs btn-success" data-action="active"${addAttribute(v.id, "data-id")} data-astro-cid-cenpxk2z>Active</button> <button class="btn-xs btn-danger" data-action="inactive"${addAttribute(v.id, "data-id")} data-astro-cid-cenpxk2z>Inactive</button> ` })}`} ${v.status === "contacted" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-cenpxk2z": true }, { "default": async ($$result3) => renderTemplate` <button class="btn-xs btn-success" data-action="active"${addAttribute(v.id, "data-id")} data-astro-cid-cenpxk2z>Active</button> <button class="btn-xs btn-danger" data-action="inactive"${addAttribute(v.id, "data-id")} data-astro-cid-cenpxk2z>Inactive</button> ` })}`} ${v.status === "active" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-cenpxk2z": true }, { "default": async ($$result3) => renderTemplate` <button class="btn-xs btn-primary" data-action="contacted"${addAttribute(v.id, "data-id")} data-astro-cid-cenpxk2z>Contacted</button> <button class="btn-xs btn-danger" data-action="inactive"${addAttribute(v.id, "data-id")} data-astro-cid-cenpxk2z>Inactive</button> ` })}`} ${v.status === "inactive" && renderTemplate`<button class="btn-xs btn-success" data-action="new"${addAttribute(v.id, "data-id")} data-astro-cid-cenpxk2z>Restore</button>`} </td> </tr>`)} </tbody> </table> </div>`} ${renderScript($$result2, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/volunteers.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/volunteers.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/volunteers.astro";
const $$url = "/admin/volunteers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Volunteers,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
