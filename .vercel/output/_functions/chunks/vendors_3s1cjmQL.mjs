import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute, F as Fragment } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { r as renderScript } from './script_BgFssCUG.mjs';
import { $ as $$AdminLayout } from './AdminLayout_DI2FboVo.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

const $$Vendors = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Vendors;
  const user = Astro2.locals.user;
  const filterParam = Astro2.url.searchParams.get("filter") || "all";
  const snap = await adminDb.collection("vendor_applications").orderBy("submitted_at", "desc").get();
  let vendors = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const filters = ["all", "pending", "approved", "paid", "rejected"];
  const filterLabels = {
    all: "All",
    pending: "Pending",
    approved: "Approved",
    paid: "Paid",
    rejected: "Rejected"
  };
  const counts = { all: vendors.length };
  for (const f of ["pending", "approved", "paid", "rejected"]) {
    counts[f] = vendors.filter((v) => (v.status || "pending") === f).length;
  }
  if (filterParam !== "all") {
    vendors = vendors.filter((v) => (v.status || "pending") === filterParam);
  }
  const feeMap = {
    "Individual Artist": 25,
    "Food Vendor": 100,
    "Retail / Franchise / non-profit": 50,
    "Political": 75
  };
  function calcTotal(v) {
    return (feeMap[v.vendor_type] ?? 0) + (v.needs_electricity === "yes" ? 10 : 0) + (v.needs_water === "yes" ? 10 : 0);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Vendor Applications", "user": user, "data-astro-cid-pl4ri4bl": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-header" data-astro-cid-pl4ri4bl> <div data-astro-cid-pl4ri4bl> <h1 data-astro-cid-pl4ri4bl>Vendor Applications</h1> <p class="page-sub" data-astro-cid-pl4ri4bl>Magna Main Street Arts Festival · August 15, 2025</p> </div> </div> <div class="filter-tabs" data-astro-cid-pl4ri4bl> ${filters.map((f) => renderTemplate`<a${addAttribute(`/admin/vendors${f === "all" ? "" : `?filter=${f}`}`, "href")}${addAttribute(["filter-tab", { active: filterParam === f }], "class:list")} data-astro-cid-pl4ri4bl> ${filterLabels[f]} ${counts[f] > 0 && renderTemplate`<span class="tab-badge" data-astro-cid-pl4ri4bl>${counts[f]}</span>`} </a>`)} </div> ${vendors.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-pl4ri4bl> <p data-astro-cid-pl4ri4bl>No vendor applications matching this filter.</p> <p style="margin-top:8px;font-size:13px;" data-astro-cid-pl4ri4bl>Applications come in through <a href="/vendor-application" data-astro-cid-pl4ri4bl>/vendor-application</a>.</p> </div>` : renderTemplate`<div class="submission-list" data-astro-cid-pl4ri4bl> ${vendors.map((v) => {
    const total = calcTotal(v);
    const feeBreakdown = [
      `${v.vendor_type}: $${feeMap[v.vendor_type] ?? 0}`,
      v.needs_electricity === "yes" ? "+$10 electric" : "",
      v.needs_water === "yes" ? "+$10 water" : ""
    ].filter(Boolean).join(" · ");
    return renderTemplate`<div class="submission-card"${addAttribute(`card-${v.id}`, "id")} data-astro-cid-pl4ri4bl> <div class="submission-header" data-astro-cid-pl4ri4bl> <div class="submission-title-group" data-astro-cid-pl4ri4bl> <div data-astro-cid-pl4ri4bl> <h2 class="submission-name" data-astro-cid-pl4ri4bl>${v.company_name}</h2> <span class="submission-meta" data-astro-cid-pl4ri4bl>${v.contact_name} · ${v.email}</span> </div> </div> <div class="header-right" data-astro-cid-pl4ri4bl> ${v.status === "paid" && v.space_number && renderTemplate`<div class="space-badge" data-astro-cid-pl4ri4bl>Space ${v.space_number}</div>`} <span${addAttribute(`badge badge-${v.status || "pending"}`, "class")} data-astro-cid-pl4ri4bl>${v.status || "pending"}</span> </div> </div> <div class="submission-body" data-astro-cid-pl4ri4bl> <div class="detail-grid" data-astro-cid-pl4ri4bl> <div data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>Contact</div> <div data-astro-cid-pl4ri4bl>${v.contact_name}</div> <div data-astro-cid-pl4ri4bl><a${addAttribute(`mailto:${v.email}`, "href")} data-astro-cid-pl4ri4bl>${v.email}</a></div> <div data-astro-cid-pl4ri4bl>${v.phone}</div> </div> <div data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>Address</div> <div data-astro-cid-pl4ri4bl>${v.address}</div> <div data-astro-cid-pl4ri4bl>${v.city_zip}</div> </div> <div data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>Fee</div> <div class="fee-total" data-astro-cid-pl4ri4bl>$${total}</div> <div style="font-size:12px;color:var(--muted);margin-top:2px;" data-astro-cid-pl4ri4bl>${feeBreakdown}</div> </div> <div data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>Utilities + Links</div> <div data-astro-cid-pl4ri4bl>⚡ ${v.needs_electricity === "yes" ? "Electric: Yes" : "No electric"}</div> <div data-astro-cid-pl4ri4bl>💧 ${v.needs_water === "yes" ? "Water: Yes" : "No water"}</div> ${v.website && renderTemplate`<div style="margin-top:4px;" data-astro-cid-pl4ri4bl><a${addAttribute(v.website, "href")} target="_blank" rel="noopener" data-astro-cid-pl4ri4bl>Website ↗</a></div>`} </div> </div> ${v.location_request && renderTemplate`<div class="detail-bio location-request" data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>📍 Requested Space Location</div> <p data-astro-cid-pl4ri4bl>${v.location_request}</p> </div>`} <div class="detail-bio" data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>What They're Selling</div> <p data-astro-cid-pl4ri4bl>${v.selling}</p> </div> ${v.description && renderTemplate`<div class="detail-bio" data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>Public Website Description</div> <p data-astro-cid-pl4ri4bl>${v.description}</p> </div>`} ${v.profile_image_url && renderTemplate`<div class="detail-bio" data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>Profile Image</div> <img${addAttribute(v.profile_image_url, "src")}${addAttribute(`${v.company_name} profile`, "alt")} class="vendor-profile-img" data-astro-cid-pl4ri4bl> </div>`} ${v.additional_comments && renderTemplate`<div class="detail-bio" data-astro-cid-pl4ri4bl> <div class="detail-label" data-astro-cid-pl4ri4bl>Additional Comments</div> <p data-astro-cid-pl4ri4bl>${v.additional_comments}</p> </div>`} <div class="waiver-notice" data-astro-cid-pl4ri4bl> <span data-astro-cid-pl4ri4bl>✓</span> <span data-astro-cid-pl4ri4bl>Waiver agreed &amp; signed by <strong data-astro-cid-pl4ri4bl>${v.signature}</strong></span> </div> ${v.status === "paid" && renderTemplate`<div class="paid-notice" data-astro-cid-pl4ri4bl> <span data-astro-cid-pl4ri4bl>✅</span> <span data-astro-cid-pl4ri4bl>
Payment confirmed · Space <strong data-astro-cid-pl4ri4bl>${v.space_number}</strong> ${v.payment_method && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-pl4ri4bl": true }, { "default": async ($$result3) => renderTemplate` · ${v.payment_method}` })}`} </span> </div>`} </div> <div class="submission-actions" data-astro-cid-pl4ri4bl> ${v.status === "pending" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-pl4ri4bl": true }, { "default": async ($$result3) => renderTemplate` <button class="btn btn-success" data-action="approve"${addAttribute(v.id, "data-id")}${addAttribute(v.company_name, "data-company")} data-astro-cid-pl4ri4bl>
✓ Approve &amp; Notify
</button> <button class="btn btn-danger" data-action="reject"${addAttribute(v.id, "data-id")}${addAttribute(v.company_name, "data-company")} data-astro-cid-pl4ri4bl>
Reject
</button> ` })}`} ${v.status === "approved" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-pl4ri4bl": true }, { "default": async ($$result3) => renderTemplate` <button class="btn btn-paid" data-action="open-paid-modal"${addAttribute(v.id, "data-id")}${addAttribute(v.company_name, "data-company")}${addAttribute(total, "data-total")} data-astro-cid-pl4ri4bl>
💳 Mark as Paid &amp; Assign Space
</button> <button class="btn btn-muted" data-action="reject"${addAttribute(v.id, "data-id")}${addAttribute(v.company_name, "data-company")} data-astro-cid-pl4ri4bl>
Revoke
</button> ` })}`} ${v.status === "paid" && renderTemplate`<button class="btn btn-muted" data-action="reject"${addAttribute(v.id, "data-id")}${addAttribute(v.company_name, "data-company")} data-astro-cid-pl4ri4bl>
Revoke (move to rejected)
</button>`} ${v.status === "rejected" && renderTemplate`<button class="btn btn-success" data-action="approve"${addAttribute(v.id, "data-id")}${addAttribute(v.company_name, "data-company")} data-astro-cid-pl4ri4bl>
Re-approve
</button>`} <button class="btn btn-delete" data-action="delete"${addAttribute(v.id, "data-id")}${addAttribute(v.company_name, "data-company")} data-astro-cid-pl4ri4bl>
🗑 Delete
</button> <div class="submitted-at" data-astro-cid-pl4ri4bl>
Submitted ${v.submitted_at ? new Date(v.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"} </div> </div> </div>`;
  })} </div>`} <div id="paid-modal" class="modal-backdrop" style="display:none" role="dialog" aria-modal="true" data-astro-cid-pl4ri4bl> <div class="modal-box" data-astro-cid-pl4ri4bl> <div class="modal-header" data-astro-cid-pl4ri4bl> <h2 data-astro-cid-pl4ri4bl>Mark as Paid &amp; Assign Space</h2> <button id="modal-close" class="modal-close" aria-label="Close" data-astro-cid-pl4ri4bl>✕</button> </div> <p class="modal-sub" id="modal-company-name" data-astro-cid-pl4ri4bl></p> <div class="modal-field" data-astro-cid-pl4ri4bl> <label for="modal-space" data-astro-cid-pl4ri4bl>Assigned Space Number <span class="req" data-astro-cid-pl4ri4bl>*</span></label> <input type="text" id="modal-space" placeholder="e.g. 14 or A7" data-astro-cid-pl4ri4bl> </div> <div class="modal-field" data-astro-cid-pl4ri4bl> <label for="modal-method" data-astro-cid-pl4ri4bl>Payment Method</label> <select id="modal-method" data-astro-cid-pl4ri4bl> <option value="" data-astro-cid-pl4ri4bl>Select…</option> <option value="PayPal" data-astro-cid-pl4ri4bl>PayPal</option> <option value="Venmo" data-astro-cid-pl4ri4bl>Venmo</option> <option value="Cash" data-astro-cid-pl4ri4bl>Cash</option> <option value="Check" data-astro-cid-pl4ri4bl>Check</option> <option value="Other" data-astro-cid-pl4ri4bl>Other</option> </select> </div> <div class="modal-field" data-astro-cid-pl4ri4bl> <label for="modal-note" data-astro-cid-pl4ri4bl>Payment Note (optional)</label> <input type="text" id="modal-note" placeholder="Reference # or other notes" data-astro-cid-pl4ri4bl> </div> <div class="modal-actions" data-astro-cid-pl4ri4bl> <button id="modal-cancel" class="btn btn-muted" data-astro-cid-pl4ri4bl>Cancel</button> <button id="modal-confirm" class="btn btn-paid" data-astro-cid-pl4ri4bl>Confirm &amp; Send Email</button> </div> </div> </div>  <div id="delete-modal" class="modal-backdrop" style="display:none" role="dialog" aria-modal="true" data-astro-cid-pl4ri4bl> <div class="modal-box" data-astro-cid-pl4ri4bl> <div class="modal-header" data-astro-cid-pl4ri4bl> <h2 style="color:#991b1b" data-astro-cid-pl4ri4bl>🗑 Delete Vendor Record</h2> <button id="delete-modal-close" class="modal-close" aria-label="Close" data-astro-cid-pl4ri4bl>✕</button> </div> <p class="modal-sub" id="delete-modal-sub" data-astro-cid-pl4ri4bl></p> <div style="background:#fee2e2;border:1.5px solid #fca5a5;border-radius:8px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#991b1b;line-height:1.6;" data-astro-cid-pl4ri4bl>
This will permanently delete the application from Firestore. This action cannot be undone.
</div> <div class="modal-actions" data-astro-cid-pl4ri4bl> <button id="delete-modal-cancel" class="btn btn-muted" data-astro-cid-pl4ri4bl>Cancel</button> <button id="delete-modal-confirm" class="btn btn-danger" data-astro-cid-pl4ri4bl>Yes, Delete</button> </div> </div> </div> ${renderScript($$result2, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/vendors.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/vendors.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/vendors.astro";
const $$url = "/admin/vendors";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Vendors,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
