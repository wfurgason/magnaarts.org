# Vendor Applications Open/Closed Toggle — Plan

## Goal
Add an open/closed toggle for vendor applications, controlled from `/admin/vendors`. Exact same pattern as the band applications toggle (see `BAND-APPLICATIONS-TOGGLE-PLAN.md`), with "band" swapped for "vendor" throughout.

When closed:
- `/vendor-application` shows a "not accepting applications" message instead of the form (no submissions possible while closed)
- The message includes a mailing list signup so people can be notified when it reopens
- Signups from that page are tagged `interest: 'vendors'` on the existing `mailingList` collection (no separate list)

## Design decisions (confirmed with Wes)
- State stored in Firestore: `settings/vendors` doc, field `applicationsOpen: boolean` (default `true`)
- Toggle button placed next to the "Vendor Applications" `<h1>` on `/admin/vendors`
- Toggle requires a confirm step before flipping
- `/vendor-application` checks `applicationsOpen` server-side (SSR) — when `false`, the form does not render at all, only the closed-state message + mailing list signup
- Mailing list signup reuses existing `mailingList` collection/flow (`subscribe.ts`, `confirm.ts`, double opt-in, purge, etc.), tagged with `interest: 'vendors'`
- Closed-state copy is identical to the bands version with "band" swapped for "vendor"

## Steps

- [x] **Step 1 — Firestore settings doc + read helper**
  - `settings/vendors` doc (`applicationsOpen: true`) — created lazily on first read if missing
  - Done: `src/lib/site-settings.ts` — `getVendorApplicationsOpen()` reads `settings/vendors`, defaults to `true` if doc missing or on error

- [x] **Step 2 — Toggle API route**
  - New route `src/pages/api/admin/toggle-vendor-applications.ts`
  - `POST` — flips `applicationsOpen` on `settings/vendors` (admin-session-protected, same pattern as `toggle-band-applications.ts`)
  - Done: created, mirrors `toggle-band-applications.ts` exactly; creates the doc via `set(..., {merge:true})` if it doesn't exist yet

- [x] **Step 3 — Toggle UI on `/admin/vendors`**
  - Toggle button next to the "Vendor Applications" `<h1>` in `vendors.astro`, reflecting current state (Open/Closed)
  - Confirm before calling the toggle API
  - Done: `vendors.astro` reads `applicationsOpen` via `getVendorApplicationsOpen()`, renders `.btn-toggle-applications` pill inside a new `.page-header-title-row` wrapper next to the h1 (reuses the existing generic `.btn-toggle-applications`/`.page-header-title-row` CSS already in `admin.css` from the bands build — no new styles needed); click handler added inline to `vendors.astro`'s existing `<script>` block (vendors has no separate `admin-vendors.js` file the way bands does, so no new JS file was created) → native `confirm()` → POST `/api/admin/toggle-vendor-applications` → reload

- [x] **Step 4 — `/vendor-application` closed state**
  - In `vendor-application/index.astro` frontmatter, read `applicationsOpen` server-side
  - If `false`: render a "not currently accepting applications" message instead of the `<form>`
  - Done: form-intro/status-banners/`<form>` and the two `<script>` blocks (Firebase config + module submit script) wrapped in `{applicationsOpen ? (...) : (...)}` / `{applicationsOpen && (...)}`; closed state renders a message + `#vendors-signup-form` email field posting to `/api/subscribe` with `interest: 'vendors'`; CSS for `.closed-state`/`.closed-signup-form`/`.signup-status` added to the page's `<style>` block (the hero, info strip, and Terms & Conditions accordion sections above the form stay visible regardless of state)

- [x] **Step 5 — Mailing list signup on closed-state message**
  - Wired to existing `/api/subscribe` endpoint, passing `interest: 'vendors'`
  - No changes needed to `subscribe.ts` — it already accepts and stores an arbitrary `interest` string generically (built for bands, works as-is for vendors)

- [x] **Step 6 — Verify all links to `/vendor-application` respect closed state**
  - Searched all `.astro` files for `vendor-application` references: `Footer.astro` ("Vendor Application"), `present.astro` (programs list `link:`), and `vendors.astro` itself (a plain reference note pointing admins to the public form URL)
  - All are plain `<a href>` links (or non-interactive text), so they automatically reflect the closed state since the check happens server-side on the destination page. `vendor_applications` is only written to from `vendor-application/index.astro`'s client script, which is now gated behind `applicationsOpen` — no duplicate/bypassable submission entry point exists

- [x] **Step 7 — README.md update**
  - Added entry under "Recent Changes" describing the toggle feature
  - Extended the `settings` row in the Firestore Collections table to mention `settings/vendors`

## Notes
- Dry-run all edits before applying (Wes reviews diffs) — not used this session per Wes's request to proceed without confirmation
- Deploy via `git add . && git commit -m "..." && git push` (Wes runs this — Claude cannot run git)
