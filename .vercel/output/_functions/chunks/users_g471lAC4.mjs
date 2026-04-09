import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, x as maybeRenderHead, a2 as addAttribute } from './sequence_B8w407xz.mjs';
import { r as renderComponent } from './entrypoint_Diq9N73R.mjs';
import { r as renderScript } from './script_BgFssCUG.mjs';
import { $ as $$AdminLayout } from './AdminLayout_DI2FboVo.mjs';
import { adminDb } from './firebase-admin_xK7nQJo9.mjs';

const $$Users = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Users;
  const user = Astro2.locals.user;
  const snap = await adminDb.collection("admin_users").orderBy("createdAt", "desc").get();
  const adminUsers = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Board Members", "user": user }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="page-header"> <h1>Board Members</h1> <button id="add-user-btn" class="btn btn-primary">+ Add Member</button> </div> <div class="user-list"> ${adminUsers.map((u) => renderTemplate`<div class="user-row"${addAttribute(u.id, "data-uid")}> <div class="user-info"> <div class="user-name">${u.displayName || "(no name)"}</div> <div class="user-email">${u.email}</div> </div> <div class="user-role"> <span${addAttribute(["badge", u.role === "super_admin" ? "badge-primary" : "badge-info"], "class:list")}> ${u.role === "super_admin" ? "Super Admin" : "Board Member"} </span> </div> <div class="user-actions"> ${u.role !== "super_admin" && renderTemplate`<button class="btn btn-danger btn-sm" data-action="delete"${addAttribute(u.id, "data-uid")}${addAttribute(u.displayName || u.email, "data-name")}>
Remove
</button>`} </div> </div>`)} ${adminUsers.length === 0 && renderTemplate`<p class="empty-msg">No board members yet.</p>`} </div>  <div id="user-modal" class="modal-backdrop" hidden> <div class="modal modal-sm"> <div class="modal-header"> <h2>Add Board Member</h2> <button id="user-modal-close" class="modal-close">✕</button> </div> <form id="user-form" novalidate> <div class="field-group"> <label for="u-name">Full Name</label> <input type="text" id="u-name" required> </div> <div class="field-group"> <label for="u-email">Email *</label> <input type="email" id="u-email" required autocomplete="off"> </div> <div class="field-group"> <label for="u-password">Temporary Password *</label> <input type="password" id="u-password" required minlength="8"> <span class="field-hint">They can change this after first login.</span> </div> <div class="field-group"> <label for="u-role">Role</label> <select id="u-role"> <option value="board_member">Board Member</option> <option value="super_admin">Super Admin</option> </select> </div> <div id="user-error" class="error-msg" hidden></div> <div class="modal-actions"> <button type="button" id="user-modal-cancel" class="btn btn-ghost">Cancel</button> <button type="submit" class="btn btn-primary" id="user-submit">Create Account</button> </div> </form> </div> </div> ${renderScript($$result2, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/users.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/users.astro", void 0);

const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/users.astro";
const $$url = "/admin/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Users,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
