# Band Applications Open/Closed Toggle — Plan

## Goal
Add an open/closed toggle for band applications, controlled from `/admin/bands`.
When closed:
- `/call-for-bands` shows a "not accepting applications" message instead of the form (no submissions possible while closed)
- The message includes a mailing list signup so people can be notified when it reopens
- Signups from that page are tagged `interest: 'bands'` on the existing `mailingList` collection (no separate list)

## Design decisions (confirmed with Wes)
- State stored in Firestore: `settings/bands` doc, field `applicationsOpen: boolean` (default `true`)
- Toggle button placed next to the "Band Applications" `<h1>` on `/admin/bands`
- Toggle requires a confirm step before flipping
- `/call-for-bands` checks `applicationsOpen` server-side (SSR) — when `false`, the form does not render at all, only the closed-state message + mailing list signup
- Mailing list signup reuses existing `mailingList` collection/flow (`subscribe.ts`, `confirm.ts`, double opt-in, purge, etc.), tagged with `interest: 'bands'`

## Steps

- [x] **Step 1 — Firestore settings doc + read helper**
  - Create `settings/bands` doc (`applicationsOpen: true`) — can be created lazily on first read if missing
  - Add a small server-side helper (e.g. in `src/lib/`) to read `applicationsOpen`, defaulting to `true` if the doc doesn't exist
  - Done: `src/lib/site-settings.ts` — `getBandApplicationsOpen()` reads `settings/bands`, defaults to `true` if doc missing or on error

- [x] **Step 2 — Toggle API route**
  - New route `src/pages/api/admin/toggle-band-applications.ts`
  - `POST` — flips `applicationsOpen` on `settings/bands` (admin-session-protected, same pattern as other admin API routes)
  - Returns the new state
  - Done: created, follows `delete-pinned-item.ts` auth pattern; creates the doc via `set(..., {merge:true})` if it doesn't exist yet

- [x] **Step 3 — Toggle UI on `/admin/bands`**
  - Add toggle button next to the "Band Applications" `<h1>` in `bands.astro`, reflecting current state (Open/Closed)
  - Add confirm modal ("Close applications?" / "Reopen applications?") before calling the toggle API
  - On success, reload/update the button state
  - Done: `bands.astro` reads `applicationsOpen` via `getBandApplicationsOpen()`, renders `.btn-toggle-applications` pill next to the h1; `admin-bands.js` handles click → native `confirm()` → POST `/api/admin/toggle-band-applications` → reload; styles added to `admin.css`

- [x] **Step 4 — `/call-for-bands` closed state**
  - In `call-for-bands/index.astro` frontmatter, read `applicationsOpen` server-side
  - If `false`: render a "not currently accepting applications" message instead of the `<form>` (form markup not rendered — prevents any client-side submission)
  - If `true`: existing behavior, unchanged
  - Done: form-intro/status-banners/`<form>` and the two `<script>` blocks now wrapped in `{applicationsOpen ? (...) : (...)}` / `{applicationsOpen && (...)}`; closed state renders a message + `#bands-signup-form` email field posting to `/api/subscribe` with `interest: 'bands'`; CSS added for `.closed-state`/`.closed-signup-form`/`.signup-status`

- [x] **Step 5 — Mailing list signup on closed-state message**
  - Add an email signup field/button on the closed-state message
  - Wire to existing `/api/subscribe` endpoint, passing `interest: 'bands'`
  - Update `subscribe.ts` to accept and store an optional `interest` field on the `mailingList` doc (defaults to none/general if not passed — no behavior change for existing callers)
  - Done: `subscribe.ts` reads `interest` from the request body and stores it on new docs; on resend-to-existing-pending it only adds `interest` if one was passed AND the record has none yet (never overwrites, never tags an untagged/general subscriber)

- [x] **Step 6 — Verify all links to `/call-for-bands` respect closed state**
  - Confirm no other page links directly to a bypassable sub-route or query param that could skip the check
  - Since the check is server-side on the page itself, any link to `/call-for-bands` (Header nav, homepage, programs page, etc.) automatically shows the closed state — just confirm no other form entry point exists (e.g. no duplicate form embedded elsewhere)
  - Done: searched all `.astro` pages/components for `call-for-bands` links — found links in `present.astro` ("Apply to perform →") and `Footer.astro` ("Band Application"); both are plain `<a href>` links, so they automatically reflect the closed state since the check happens server-side on the destination page. Confirmed `band_applications` is only written to from `call-for-bands/index.astro`'s client script, which is now gated behind `applicationsOpen` — no duplicate/bypassable submission entry point exists.

- [x] **Step 7 — README.md update**
  - Add entry under "Recent Changes" describing the toggle feature
  - Add `settings` collection to the Firestore Collections table
  - Done: both added

## Notes
- Dry-run all edits before applying (Wes reviews diffs)
- Deploy via `git add . && git commit -m "..." && git push` (Wes runs this — Claude cannot run git)
