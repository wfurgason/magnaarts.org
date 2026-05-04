# Admin Portal — Improvements & Cleanup Plan

> Generated May 2, 2026 after a deep read of all admin pages and event planning flows.
> Work items are ordered by impact and implementation safety.

---

## Part 1: Ease-of-Use Improvements

### ✦ Priority 1 — Bring Band Assignment Onto the Planning Page (Music & Movies)

**Problem:** The Music & Movies workflow currently splits across two pages. You go to `/admin/bands` to approve and assign a band to a date, then you have to navigate to `/admin/planning` to mark confirmed and publish. Art Night and Festival don't have this split — their full lifecycle (assign → confirm → publish) lives on the Planning page.

**What needs to change:**
- Add an **"Assign Band" button** on each Music & Movies shell row in the planning table (same pattern as the Festival per-slot "Assign Band" button and the Art Night "Assign Presenter" button).
- The `approvedBands` list is *already fetched* on the Planning page — it's just only used for the Festival modal right now.
- Wire the existing festival band-assign modal pattern to M&M shells, or create a parallel M&M-specific modal that posts to `/api/admin/assign-band` with `action: 'assign'`.

**Result:** The entire M&M workflow (assign → confirm → publish) completes on one page. The Bands page remains useful for reviewing applications and editing records, but is no longer a required stop in the publish flow.

**Estimated effort:** Medium — modal UI already exists; mostly wiring it up to M&M shell rows.

---

### ✦ Priority 2 — "Needs Action" Row Highlighting on the Planning Page

**Problem:** The Planning page shows all shells from all years with equal visual weight. Shells at different pipeline stages (needs confirmation call, ready to publish, already done) look identical until you read each status badge.

**What needs to change:**
- Add a colored left border or highlighted row background to shells in actionable states:
  - `band_assigned` / `presenter_assigned` → amber (needs confirmation call)
  - `confirmed` → green (ready to publish)
  - `shell` with no band/presenter → neutral (not yet started)
  - `published` → muted (done, no action needed)
- Optional stretch: add a **"Show: Needs Action"** filter button above each event type table.

**Result:** At a glance you can see exactly which dates need your attention today without scanning every badge.

**Estimated effort:** Small — purely CSS additions to the existing shells table rows, driven by the `status` value already rendered on each row.

---

### ✦ Priority 3 — Dashboard: Add an "Events In Progress" Section

**Problem:** The Dashboard surfaces pending counts for all inbound queues (bands, vendors, presenters, proposals, volunteers), but shows nothing about the planning pipeline. If you have 6 M&M dates with bands assigned but unconfirmed, or 2 Art Night shells with presenters not yet confirmed, that work is invisible until you navigate to Planning.

**What needs to change:**
- Add a new stat card or panel: **"Events In Progress"** — count of shells in `band_assigned`, `presenter_assigned`, or `confirmed` status across all collections.
- Link it to `/admin/planning`.
- Optionally break it down: "X dates need confirmation · Y dates ready to publish."

**Implementation note:** Requires adding queries for `park_events`, `open_mic_events`, `art_night_events`, `festival_events`, and `writing_group_events` to the Dashboard's server-side fetch block. Filter for status `in ['band_assigned', 'presenter_assigned', 'confirmed']`.

**Result:** Dashboard becomes a true command center — actionable for both inbound submissions and the planning pipeline.

**Estimated effort:** Small-to-medium — new Firestore queries + one new stat card in the existing stat grid.

---

## Part 2: Redundancies & Cleanup

### ✦ Priority 4 — Consolidate `timeToISO()` into a Shared Utility

**Problem:** The `timeToISO()` helper function — which converts "7:00 PM" → "19:00:00" for Firestore `Timestamp` construction — is copy-pasted identically into at least 4 separate API route files:
- `assign-band.ts`
- `publish-open-mic.ts`
- `publish-art-night.ts`
- `publish-festival.ts`
- (likely `publish-writing-group.ts` as well)

If a time parsing edge case is ever found and fixed, it must be fixed in 5 places.

**What needs to change:**
1. Create `src/lib/time-utils.ts` with a single exported `timeToISO()` function.
2. Replace the inline copies in each API route with `import { timeToISO } from '../../../lib/time-utils';`.

**Result:** One canonical implementation. Zero behavioral change. Future fixes propagate automatically.

**Estimated effort:** Small and mechanical — find/replace across 5 files.

---

### ✦ Priority 5 — ✅ DONE — `publish-event.ts` Audited and Documented

**Finding:** `publish-event.ts` IS still active. `programs.astro` calls it for the "Publish as Event" button on approved program proposals (`submissionType: 'program'`). It was not dead code — it just has narrower scope than the shell-based endpoints.

**What was done:**
- Added a file-level comment to `publish-event.ts` clearly documenting:
  - It is ACTIVE for program proposal publishing
  - It is NOT used by any shell-based event flows (M&M, Open Mic, Art Night, Festival, Writing Group)
  - Conditions under which it could eventually be retired

**Future consideration:** If program proposals are ever given a shell-based planning workflow (Phase 4), this endpoint could be replaced with a dedicated `publish-program.ts` that follows the shell ID = event ID pattern used by all other event types.

---

### ✦ Priority 6 — ✅ DONE — Stopped Writing to `park_seasons` Collection

**What was done:**
- Removed the `adminDb.collection('park_seasons').doc(String(year)).set(...)` call from the Music & Movies shell creation branch in `planning.astro`.
- Removed `park_seasons` from the `Promise.all` query at the top of the page (eliminated one unnecessary Firestore read on every page load too).
- `seasonsSnap` variable also removed from the destructuring.

**Remaining:** Optionally delete existing `park_seasons` docs from the Firestore console — they are now orphaned and can be cleaned up at any time with no impact.

---

### ✦ Priority 7 — ✅ DONE — Deduplicated Event Doc Field Aliases

**What was done:**
1. Stripped alias fields (`startTime`, `venue`, `address`, `photoUrl`) from all 4 publish endpoints that were writing them: `assign-band.ts`, `publish-open-mic.ts`, `publish-art-night.ts`, `publish-writing-group.ts`. (`publish-festival.ts` was already clean.)
2. Removed `|| d.startTime`, `|| d.photoUrl` fallbacks from `events/index.astro`.
3. Removed `|| event.startTime`, `|| event.venue`, `|| event.address` fallbacks from `events/[id].astro`.
4. Created `scripts/migrate-event-fields.ts` — a one-time script to delete the alias fields from existing event docs in Firestore.

**To complete:** Run the migration script once against production:
```
npx ts-node --project tsconfig.json scripts/migrate-event-fields.ts
```
Then delete the script file. Requires `service-account.json` in the project root.

**Problem:** Every publish endpoint writes the same data under two different field names into the `events` collection — a result of different endpoints being written at different times:

| Canonical field | Alias field |
|---|---|
| `venueName` | `venue` |
| `venueAddress` | `address` |
| `eventTime` | `startTime` |
| `posterUrl` | `photoUrl` |

This means every published event doc is larger than it needs to be, and it's unclear which field names the public pages are actually reading.

**What needs to change:**
1. Audit `events/[id].astro` and `events/index.astro` to determine which field names are actually consumed.
2. Pick one canonical set across all publish endpoints.
3. Update all publish endpoints to write only the canonical fields.
4. Run a one-time Firestore migration script to clean up existing event docs.

**Note:** This is lower priority than 4–6 since it's non-breaking and cosmetic. Best done before the events collection grows significantly larger or before Phase 5 (reporting) begins, since those features will read these fields heavily.

**Estimated effort:** Medium — audit + update 5 publish endpoints + migration script.

---

## Summary Table

| # | Item | Type | Effort | Priority |
|---|---|---|---|---|
| 1 | Band assign on Planning page (M&M) | UX improvement | Medium | High |
| 2 | "Needs action" row highlighting | UX improvement | Small | High |
| 3 | Dashboard events-in-progress panel | UX improvement | Small–Medium | Medium |
| 4 | Consolidate `timeToISO()` to shared lib | Code cleanup | Small | High |
| 5 | Audit / retire `publish-event.ts` | Code cleanup | Tiny | Medium |
| 6 | Stop writing `park_seasons` docs | Code cleanup | Tiny | Medium |
| 7 | Deduplicate event doc field aliases | Code cleanup | Medium | Low |
