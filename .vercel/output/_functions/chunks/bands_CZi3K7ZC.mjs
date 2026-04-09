import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, a2 as addAttribute, F as Fragment, x as maybeRenderHead } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { $ as $$AdminLayout } from './AdminLayout_DI2FboVo.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Bands = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Bands;
  const user = Astro2.locals.user;
  const filterParam = Astro2.url.searchParams.get("filter") || "all";
  const snap = await adminDb.collection("band_applications").orderBy("submitted_at", "desc").get();
  let bands = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  const filters = ["all", "pending", "approved", "assigned", "good_standing", "rejected", "published"];
  if (filterParam !== "all") {
    bands = bands.filter((b) => (b.status || "pending") === filterParam);
  }
  const shellsSnap = await adminDb.collection("park_events").where("status", "==", "shell").orderBy("date", "asc").get();
  const availableShells = shellsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Band Applications", "user": user, "data-astro-cid-oga4ctxi": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="page-header" data-astro-cid-oga4ctxi> <h1 data-astro-cid-oga4ctxi>Band Applications</h1> <div class="filter-tabs" data-astro-cid-oga4ctxi> ', " </div> </div> ", ' <div id="assign-modal" class="modal-backdrop" style="display:none" data-astro-cid-oga4ctxi> <div class="modal" data-astro-cid-oga4ctxi> <div class="modal-header" data-astro-cid-oga4ctxi> <h2 data-astro-cid-oga4ctxi>Assign to Date</h2> <button id="assign-close" class="modal-close" aria-label="Close" data-astro-cid-oga4ctxi>✕</button> </div> <p class="modal-sub" id="assign-sub" data-astro-cid-oga4ctxi>Select a date for <strong id="assign-band-name" data-astro-cid-oga4ctxi></strong>.</p> <div id="assign-shells" data-astro-cid-oga4ctxi> ', ' </div> <div id="assign-match-warning" class="match-warning" hidden data-astro-cid-oga4ctxi>\n⚠️ This band did not list this date as available. You can still assign them — just confirm with them first.\n</div> <div id="assign-error" class="error-msg" hidden data-astro-cid-oga4ctxi></div> <div class="modal-actions" data-astro-cid-oga4ctxi> <button type="button" id="assign-cancel" class="btn btn-ghost" data-astro-cid-oga4ctxi>Cancel</button> <button type="button" id="assign-submit" class="btn btn-primary" disabled data-astro-cid-oga4ctxi>\nAssign Date →\n</button> </div> </div> </div> <script src="/admin-bands.js" defer><\/script> '])), maybeRenderHead(), filters.map((f) => renderTemplate`<a${addAttribute(`/admin/bands${f === "all" ? "" : `?filter=${f}`}`, "href")}${addAttribute(["filter-tab", { active: filterParam === f }], "class:list")} data-astro-cid-oga4ctxi> ${f === "good_standing" ? "⭐ Good Standing" : f.charAt(0).toUpperCase() + f.slice(1)} </a>`), bands.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-oga4ctxi> <p data-astro-cid-oga4ctxi>No applications matching this filter.</p> </div>` : renderTemplate`<div class="submission-list" data-astro-cid-oga4ctxi> ${bands.map((band) => renderTemplate`<div class="submission-card"${addAttribute(band.id, "id")} data-astro-cid-oga4ctxi> <div class="submission-header" data-astro-cid-oga4ctxi> <div class="submission-title-group" data-astro-cid-oga4ctxi> ${band.promo_photo_url && renderTemplate`<img${addAttribute(band.promo_photo_url, "src")}${addAttribute(band.band_name, "alt")} class="submission-photo" data-astro-cid-oga4ctxi>`} <div data-astro-cid-oga4ctxi> <h2 class="submission-name" data-astro-cid-oga4ctxi>${band.band_name}</h2> <span class="submission-meta" data-astro-cid-oga4ctxi>${band.genre} · ${band.member_count} members · ${band.set_length} set</span> </div> </div> <span${addAttribute(`badge badge-${band.status || "pending"}`, "class")} data-astro-cid-oga4ctxi>${band.status || "pending"}</span> </div> <div class="submission-body" data-astro-cid-oga4ctxi> <div class="detail-grid" data-astro-cid-oga4ctxi> <div data-astro-cid-oga4ctxi> <div class="detail-label" data-astro-cid-oga4ctxi>Contact</div> <div data-astro-cid-oga4ctxi>${band.contact_name}</div> <div data-astro-cid-oga4ctxi><a${addAttribute(`mailto:${band.contact_email}`, "href")} data-astro-cid-oga4ctxi>${band.contact_email}</a></div> <div data-astro-cid-oga4ctxi>${band.contact_phone}</div> </div> <div data-astro-cid-oga4ctxi> <div class="detail-label" data-astro-cid-oga4ctxi>Available Dates</div> ${band.available_dates && band.available_dates.length > 0 ? renderTemplate`<div class="date-chips" data-astro-cid-oga4ctxi> ${band.available_dates.map((d) => {
    const dt = /* @__PURE__ */ new Date(d + "T12:00:00");
    const label = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return renderTemplate`<span class="date-chip" data-astro-cid-oga4ctxi>${label}</span>`;
  })} </div>` : renderTemplate`<div class="muted" data-astro-cid-oga4ctxi>${band.availability || "—"}</div>`} </div> <div data-astro-cid-oga4ctxi> <div class="detail-label" data-astro-cid-oga4ctxi>Performed Before?</div> <div data-astro-cid-oga4ctxi>${band.performed_before ? "Yes" : "No"}</div> </div> <div data-astro-cid-oga4ctxi> <div class="detail-label" data-astro-cid-oga4ctxi>Links</div> ${band.music_link && renderTemplate`<div data-astro-cid-oga4ctxi><a${addAttribute(band.music_link, "href")} target="_blank" rel="noopener" data-astro-cid-oga4ctxi>Music ↗</a></div>`} ${band.website && renderTemplate`<div data-astro-cid-oga4ctxi><a${addAttribute(band.website, "href")} target="_blank" rel="noopener" data-astro-cid-oga4ctxi>Website ↗</a></div>`} ${band.tech_rider_url && renderTemplate`<div data-astro-cid-oga4ctxi><a${addAttribute(band.tech_rider_url, "href")} target="_blank" rel="noopener" data-astro-cid-oga4ctxi>Tech Rider ↗</a></div>`} </div> </div> ${band.bio && renderTemplate`<div class="detail-bio" data-astro-cid-oga4ctxi> <div class="detail-label" data-astro-cid-oga4ctxi>Bio</div> <p data-astro-cid-oga4ctxi>${band.bio}</p> </div>`} ${band.additional_notes && renderTemplate`<div class="detail-bio" data-astro-cid-oga4ctxi> <div class="detail-label" data-astro-cid-oga4ctxi>Additional Notes</div> <p data-astro-cid-oga4ctxi>${band.additional_notes}</p> </div>`}  ${band.status === "good_standing" && renderTemplate`<div class="good-standing-notice" data-astro-cid-oga4ctxi> <span data-astro-cid-oga4ctxi>⭐</span> <span data-astro-cid-oga4ctxi>This band is in <strong data-astro-cid-oga4ctxi>Good Standing</strong> — reliable and welcome back for future seasons.</span> </div>`}  ${band.assignedDate && renderTemplate`<div class="assigned-notice" data-astro-cid-oga4ctxi> <span class="assigned-icon" data-astro-cid-oga4ctxi>📅</span> <span data-astro-cid-oga4ctxi>Assigned to <strong data-astro-cid-oga4ctxi>${(/* @__PURE__ */ new Date(band.assignedDate + "T12:00:00")).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong></span> <button class="btn-link unassign-btn"${addAttribute(band.assignedShellId, "data-shell-id")}${addAttribute(band.band_name, "data-band-name")} data-astro-cid-oga4ctxi>
Remove assignment
</button> </div>`} </div> <div class="submission-actions" data-astro-cid-oga4ctxi>  ${band.status === "pending" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-oga4ctxi": true }, { "default": async ($$result3) => renderTemplate` <button class="btn btn-success" data-action="approve"${addAttribute(band.id, "data-id")} data-collection="band_applications" data-astro-cid-oga4ctxi>
Approve
</button> <button class="btn btn-primary assign-btn"${addAttribute(band.id, "data-band-id")}${addAttribute(band.band_name, "data-band-name")}${addAttribute(JSON.stringify(band.available_dates || []), "data-available")} data-auto-approve="true" data-astro-cid-oga4ctxi>
Approve &amp; Assign Date →
</button> <button class="btn btn-danger" data-action="reject"${addAttribute(band.id, "data-id")} data-collection="band_applications" data-astro-cid-oga4ctxi>
Reject
</button> ` })}`}  ${band.status === "approved" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-oga4ctxi": true }, { "default": async ($$result3) => renderTemplate` <button class="btn btn-primary assign-btn"${addAttribute(band.id, "data-band-id")}${addAttribute(band.band_name, "data-band-name")}${addAttribute(JSON.stringify(band.available_dates || []), "data-available")} data-astro-cid-oga4ctxi>
Assign to Date →
</button> <button class="btn btn-danger" data-action="reject"${addAttribute(band.id, "data-id")} data-collection="band_applications" data-astro-cid-oga4ctxi>
Reject
</button> ` })}`}  ${band.status === "assigned" && renderTemplate`<button class="btn btn-outline unassign-btn"${addAttribute(band.assignedShellId, "data-shell-id")}${addAttribute(band.band_name, "data-band-name")} data-astro-cid-oga4ctxi>
Reassign Date
</button>`}  ${band.status === "good_standing" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-oga4ctxi": true }, { "default": async ($$result3) => renderTemplate` <button class="btn btn-primary assign-btn"${addAttribute(band.id, "data-band-id")}${addAttribute(band.band_name, "data-band-name")}${addAttribute(JSON.stringify(band.available_dates || []), "data-available")} data-astro-cid-oga4ctxi>
Assign to Date →
</button> ` })}`}  ${band.status !== "published" && renderTemplate`<button class="btn btn-danger delete-btn" style="margin-left:auto"${addAttribute(band.id, "data-band-id")}${addAttribute(band.band_name, "data-band-name")}${addAttribute(band.assignedShellId || "", "data-assigned-shell")} data-astro-cid-oga4ctxi>
Delete
</button>`}  ${(band.status === "approved" || band.status === "assigned" || band.status === "published") && renderTemplate`<button class="btn btn-gold good-standing-btn"${addAttribute(band.id, "data-band-id")}${addAttribute(band.band_name, "data-band-name")} data-astro-cid-oga4ctxi>
⭐ Good Standing
</button>`} </div> </div>`)} </div>`, availableShells.length === 0 ? renderTemplate`<p class="empty-shells" data-astro-cid-oga4ctxi>No open event dates available. Generate event shells in <a href="/admin/seasons" data-astro-cid-oga4ctxi>Season Setup</a> first.</p>` : renderTemplate`<div class="shell-list" data-astro-cid-oga4ctxi> ${availableShells.map((shell) => renderTemplate`<label class="shell-option"${addAttribute(shell.date, "data-date")} data-astro-cid-oga4ctxi> <input type="radio" name="shell"${addAttribute(shell.id, "value")}${addAttribute(shell.displayDate, "data-display")} data-astro-cid-oga4ctxi> <div class="shell-option-body" data-astro-cid-oga4ctxi> <span class="shell-date" data-astro-cid-oga4ctxi>${shell.displayDate}</span> <span class="shell-time" data-astro-cid-oga4ctxi>${shell.startTime} · ${shell.venue}</span> </div> </label>`)} </div>`) })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/bands.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/bands.astro";
const $$url = "/admin/bands";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Bands,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
