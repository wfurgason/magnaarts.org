# Festival Feature Roster — Build Plan

**Status:** Steps 1-5 complete. Step 6 (testing + README update) remains.
**Started:** July 20, 2026
**Last updated:** July 20, 2026

## What this is

A new admin-managed roster feature, tied to a specific event. First use case: chalk artists at the Magna Main Street Arts Festival (see festival flyer / reference photos shared July 20, 2026). Built as a general, reusable pattern — each entry belongs to a **feature** of the festival, identified by a `featureTitle` like "Chalk Art" or "Car Show", so the same collection and admin UI can hold multiple different kinds of festival features without new code per feature type.

Modeled on the existing **Pinned Content** admin pattern (`/admin/pinned-content`): a card list + "+ Add" button that opens a slide-in drawer form. Chosen over the Vendors pattern because entries are added directly by the board, not submitted via a public application form.

The Festival planning card in `/admin/planning` will get a small summary block (count + "Manage ↗" link) the same way the Vendors section does today — see `planning.astro` lines ~892-903 for the exact pattern to copy.

## Naming — CONFIRMED

- Firestore collection: `festival_features`
- Admin page: `src/pages/admin/festival-features.astro`
- API routes: `save-festival-feature.ts`, `delete-festival-feature.ts`
- UI section title: TBD per feature — the admin page itself should probably be titled "Festival Features" in the sidebar, with each entry's `featureTitle` shown as a grouping label/badge on its card (e.g. a "Chalk Art" pill)

## Data model — CONFIRMED (flat collection)

One flat `festival_features` collection. Each doc = one entry (e.g. one chalk artist), grouped by a `featureTitle` string field — not a nested subcollection or array.

| Field | Type | Notes |
|---|---|---|
| `featureTitle` | string | groups entries, e.g. "Chalk Art", "Car Show" — free text, admin types it on each entry (consider a datalist/autocomplete of existing titles in the form so entries stay consistently spelled) |
| `name` | string | required — person/entry name |
| `bio` | string (textarea) | short description |
| `websiteUrl` | string | website / portfolio / Instagram link |
| `artistPhotoUrl` | string (Storage URL) | photo of the artist/entrant |
| `artworkPhotoUrl` | string (Storage URL) | photo of their artwork/entry |
| `eventId` | string | which event/festival this entry belongs to |
| `order` | number (optional) | manual sort order for public display |
| `createdAt` | timestamp | |

## Step-by-step build plan

### Step 1 — Firestore + Storage setup — DONE
- [x] Storage rules added for `festival-feature-photos/` and `festival-feature-artwork/` paths in `storage.rules` (allow read: true, write: true — matches existing admin-upload pattern like `art-night-images/`)
- [x] Deployed via `firebase deploy --only storage` (project linked with alias `default`, creating `.firebaserc`)
- [x] Confirmed `firestore.rules` needs no change — `festival_features` will be read/written entirely via the Admin SDK from admin pages and SSR public pages (same as `pinned_content` today), bypassing client-side security rules entirely

### Step 2 — API routes (`src/pages/api/admin/`) — DONE
- [x] `save-festival-feature.ts` — POST, create/update a `festival_features` doc (mirrors `save-pinned-item.ts`); requires `featureTitle` and `name`, accepts `eventId`, `bio`, `websiteUrl`, `artistPhotoUrl`, `artworkPhotoUrl`, `order`
- [x] `delete-festival-feature.ts` — POST, delete a doc by id (mirrors `delete-pinned-item.ts`)
- [ ] Images upload client-side directly to Storage (same pattern as Vendor/Band photos) — save route only accepts the resulting URLs as strings, does not handle file bytes itself
- [ ] Upload targets (to wire up in Step 3 admin page): `festival-feature-photos/{timestamp}.{ext}` and `festival-feature-artwork/{timestamp}.{ext}`

### Step 3 — Admin page (`src/pages/admin/festival-features.astro`) — DONE
- [x] Built modeled on `pinned-content.astro`: page header, "+ Add Entry" button, card grid grouped by `featureTitle` (each group shows a count badge), slide-in drawer form
- [x] Card shows: artist photo + artwork photo thumbnails side by side, name, bio excerpt (clamped to 3 lines), website link, Edit/Delete icon buttons
- [x] Drawer form fields: Feature title (text input with a `<datalist>` of existing titles to encourage consistent spelling), Event dropdown (populated from `festival_events`), Name, Bio, Website/portfolio link, Artist photo upload, Artwork photo upload
- [x] Photo uploads: drag-and-drop zones, live preview, client-side upload straight to `festival-feature-photos/` and `festival-feature-artwork/` in Storage on submit
- [x] Added "Festival Features" link to `AdminLayout.astro` sidebar nav (after Vendor Applications)

### Step 4 — Festival planning summary block — DONE
- [x] `planning.astro` now queries `festival_features` alongside the other collections and builds per-event counts (`festivalFeatureCountsByEvent`) and per-event/per-`featureTitle` breakdowns (`festivalFeatureTitlesByEvent`), keyed by the festival shell's `id` (matches the `eventId` field the admin page dropdown writes)
- [x] Added a "Festival Features" `.fest-section` inside `.fest-body`, right after Vendors — shows total entry count + "Manage Festival Features ↗" link (reuses `.vendor-summary-card` styling), plus a breakdown line like "Chalk Art: 6 · Car Show: 3" or an empty-state hint if no entries exist yet

### Step 5 — Public display — DONE
- [x] `events/[id].astro` now queries `festival_features` where `eventId == event.id` when `isFestival`, groups results by `featureTitle`, sorted alphabetically by group and by `order`/`name` within each group
- [x] Renders one `.festival-section` per feature group, placed between "Main Stage Lineup" and "Participating Vendors" — heading is 🎨 + the `featureTitle` (e.g. "🎨 Chalk Art")
- [x] Each entry reuses the `.vendor-profile-card` styling: artwork photo large (falls back to artist photo, then a placeholder icon, if missing), small circular artist portrait when both photos exist, name, bio, website link
- [x] Nothing renders if there are no entries for that event — no empty section or broken layout
- [ ] Confirm ZAP logo requirement doesn't apply here (that's for event listings, not feature sub-sections — double check with Wes)

### Step 6 — Testing
- [ ] Add a few real chalk artist entries from the festival flyer as a live test, all with `featureTitle: "Chalk Art"` (Brooke Keithley, Becky Darling, Camille Grimshaw, Chelsea Snyder, Jenn D'Haenens, Kat Ralston)
- [ ] Confirm image uploads work end-to-end (storage rules deployed correctly)
- [ ] Confirm public page renders correctly on mobile, and groups by `featureTitle` correctly
- [ ] Update `README.md`: add `festival_features` to Firestore Collections table, add to Build Sequence phase list, add Recent Changes entry

## Open questions for next session
- Should `featureTitle` have any validation/autocomplete to prevent typos creating duplicate near-identical groups ("Chalk Art" vs "Chalk Artists")?
- Should this support multiple events at once (reusable dropdown) or start festival-only and generalize later?
- Any cap on number of entries shown per feature, or pagination needed?
- Does festival flyer info (Instagram handles specifically, vs generic "website") need its own field, or does `websiteUrl` cover it?
