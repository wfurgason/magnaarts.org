# Local Artists Feature — Implementation Plan

A full-stack feature that lets bands with Good Standing status create a public profile,
upload MP3 tracks, and appear in a public artist directory with a rotating audio player.

**New files: ~12 | Edited files: ~5**

---

## Architecture Overview

### Two distinct collections, two distinct owners

| Collection | Owned by | Purpose |
|---|---|---|
| `band_applications/{bandId}` | Admin | Source of truth for event publishing; admin controls edits |
| `artists/{bandId}` | Artist | Public-facing profile on `/local-artists`; artist controls edits |
| `artists/{bandId}/tracks` | Artist | MP3 subcollection for the rotating player |

Artists write to `artists/` only. They never touch `band_applications/`. An admin-initiated
**Sync** button copies profile fields from `artists/{bandId}` back into `band_applications/{bandId}`
on demand — keeping you in control of what flows into event publishing.

### Auth approach — Two-step opt-in + Firebase magic link (passwordless)

No passwords. The invite flow has two steps:

1. **Invitation email** — `sendArtistInvite` stores a one-time UUID token in the top-level
   `optinTokens/{token}` Firestore collection (30-day expiry) and sends an email with an
   "Opt In" button pointing to `/artist/optin?token={token}`.
2. **Opt-in page** — `/artist/optin` displays a confirmation screen. When the artist clicks
   "Opt In — Send My Access Link", it POSTs to `/api/artist/optin`, which validates and burns
   the token, then calls `sendArtistAuthLink` to generate a Firebase magic link (server-side,
   via Admin SDK `generateSignInWithEmailLink`) and email it. The magic link is good for 6 hours.

This two-step design prevents accidental sign-in link generation (e.g. email prefetch bots
clicking links) and gives bands control over when to start the 6-hour auth window.

Returning artists use `/artist/login` (sends a fresh auth link directly, no opt-in token needed).

Artist pages use **client-side Firebase auth** (`onAuthStateChanged`). No server-side session
cookie is needed — artists only access their own data, and all Firestore writes are secured
by matching `request.auth.uid` to the doc's `uid` field in security rules.

---

## Decisions

| # | Decision |
|---|---|
| Photo upload | **Storage upload** (drag-and-drop, follows vendor-application pattern) |
| Portal auth | **Client-side Firebase auth** — `onAuthStateChanged` redirect in JS |
| Good Standing status value | `"good_standing"` — exact string to match in `update-submission.ts` |
| Track play order | **Shuffle on every page load** (Fisher-Yates on the full track list at init); no manual shuffle button needed |
| Rejection workflow | **Admin emails the artist directly** with specific feedback outside the app; `approve-artist.ts` sets status to `'rejected'` with no automated email; admin handles communication personally |

---

## Phase 1 — Security Rules

**Files edited:** `firestore.rules`, `storage.rules`

### Firestore rules to add

```
// artists collection — artist owns their doc (matched by uid field)
match /artists/{bandId} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == resource.data.uid;
  allow create: if request.auth != null;

  match /tracks/{trackId} {
    allow read: if true;
    allow write: if request.auth != null
      && request.auth.uid == get(/databases/$(database)/documents/artists/$(bandId)).data.uid;
  }
}
```

### Storage rules to add

```
// MP3 tracks — written only via Admin SDK (upload-track.ts); no client write access
match /artist_tracks/{bandId}/{filename} {
  allow read: if true;
  allow write: if false;
}

// Profile photos — written only via Admin SDK (register-artist.ts, update-artist.ts); no client write access
match /artist_photos/{bandId}/{filename} {
  allow read: if true;
  allow write: if false;
}
```

**Deploy after this step:**
```bash
firebase deploy --only firestore:rules,storage
```

---

## Phase 2 — API Routes

All routes live in `src/pages/api/artist/`. Mirror the pattern from existing admin routes
(verify session cookie / auth token, build payload from request body, write to Firestore).

### 2a. `send-artist-invite.ts`

- **Trigger:** Called from `bands.astro` when a band is marked Good Standing, or manually by admin
- **Input:** `{ bandId, email, bandName }`
- **Logic:**
  1. Check `artists/{bandId}` — if doc exists and `status` is `approved`, set `isReturning: true`
  2. Generate a UUID token; store it in `optinTokens/{token}` with `{ email, bandId, isReturning, expiresAt (30 days), usedAt: null }`
  3. Send Resend invitation email with an "Opt In" button linking to `/artist/optin?token={token}`, AUP summary, and a plain-text explanation of the directory
  4. Does **not** generate a Firebase auth link — that happens in step 2 after the artist clicks Opt In
- **Auth:** Verified via admin session cookie (admin-only trigger)

### 2a-optin. `optin.ts` *(not in original plan — added during implementation)*

- **Trigger:** POST from `/artist/optin` page when artist clicks "Opt In — Send My Access Link"
- **Input:** `{ token }`
- **Logic:**
  1. Look up `optinTokens/{token}` — return 404 if missing, 410 if expired
  2. Burn the token (`usedAt: Date.now()`) before sending email to prevent race-condition double-use
  3. Fetch band name from `artists/{bandId}` (falls back to `band_applications/{bandId}`)
  4. Call `sendArtistAuthLink({ bandId, email, bandName, isReturning })` to generate the Firebase magic link and send the auth email
  5. If `sendArtistAuthLink` fails, un-burn the token so the artist can retry
- **Auth:** Public endpoint — token is the credential; no session cookie required

### 2b. `register-artist.ts`

- **Trigger:** POST from `/artist/register` form submit
- **Input:** `{ bandId, uid, band_name, genre, bio, photo_url, website, music_link, social_* }`
- **Logic:**
  1. Create `artists/{bandId}` doc with `status: 'pending_review'`, `visible: false`, `uid`, profile fields, `registeredAt`
  2. Send Resend notification email to admin with a link to `/admin/artists`
- **Auth:** Firebase ID token in `Authorization` header (artist, client-side auth)

### 2c. `update-artist.ts`

- **Trigger:** POST from `/artist/portal` profile edit form
- **Input:** Any subset of profile fields (mirrors `update-presenter.ts` pattern — build payload from whatever fields are present)
- **Logic:** Update `artists/{bandId}` doc; never touches `status` or `visible`
- **Auth:** Firebase ID token; verify `uid` matches doc's `uid` field

### 2d. `upload-track.ts`

- **Trigger:** POST from `/artist/portal` track upload
- **Input:** Multipart: `{ bandId, title, file (MP3), order }`
- **Logic:**
  1. Count existing tracks in `artists/{bandId}/tracks`; reject with 400 if count ≥ 5 (prevents one artist from dominating the shuffle and caps Storage usage)
  2. Validate file is MP3, size reasonable
  2. Upload to Firebase Storage at `artist_tracks/{bandId}/{filename}.mp3` (use Admin SDK `bucket.file().save()`)
  3. Add doc to `artists/{bandId}/tracks` subcollection: `{ title, url, storagePath, uploadedAt, order }`
  4. If artist has at least one track and status is `approved`, flip `visible: true` on parent doc

> **Track limit:** Maximum 5 tracks per artist. Raise the cap in `upload-track.ts` as needed — no schema change required.
- **Auth:** Firebase ID token; verify uid matches artist

### 2e. `delete-track.ts`

- **Trigger:** POST from `/artist/portal` track delete button
- **Input:** `{ bandId, trackId, storagePath }`
- **Logic:**
  1. Delete Storage file at `storagePath`
  2. Delete Firestore doc `artists/{bandId}/tracks/{trackId}`
  3. Re-count remaining tracks; if zero, set `visible: false` on parent doc
- **Auth:** Firebase ID token; verify uid matches artist

### 2f. `approve-artist.ts`

- **Trigger:** POST from `/admin/artists` approve/reject buttons
- **Input:** `{ bandId, action: 'approve' | 'reject' }`
- **Logic (approve):**
  1. Set `artists/{bandId}.status = 'approved'`
  2. Count tracks in subcollection; if ≥ 1, also set `visible: true`
  3. Send Resend email to artist notifying them they're live (or pending track upload if no tracks yet)
- **Logic (reject):**
  1. Set `artists/{bandId}.status = 'rejected'`
  2. No automated email — admin will follow up directly with specific feedback
- **Auth:** Admin session cookie

### 2g. `sync-artist.ts`

- **Trigger:** POST from "Sync from Artist Profile" button in `bands.astro`
- **Input:** `{ bandId }`
- **Logic:**
  1. Read `artists/{bandId}` — confirm status is `approved`
  2. Write `bio`, `genre`, `photo_url`, `website`, `music_link` back to `band_applications/{bandId}`
- **Auth:** Admin session cookie

---

## Phase 3 — Artist Pages

### 3a. `/artist/login` — `src/pages/artist/login.astro`

Simple one-field form: email address input + "Send Sign-In Link" button.

- Client-side: calls Firebase `sendSignInLinkToEmail(email, actionCodeSettings)`
  - `actionCodeSettings.url` = `https://magnaarts.org/artist/portal` (returning artists always land on portal)
  - Save email to `localStorage` for the confirmation step
- On submit: show confirmation message ("Check your email for a sign-in link")
- No server-side component needed — pure Firebase client SDK

### 3b. `/artist/register` — `src/pages/artist/register.astro`

Reached from the Good Standing invite email. URL includes `?bandId={id}`.

**Page structure:**
1. **Acceptable Use Policy** — displayed in a scrollable block above the form; artist must scroll to reveal the Submit button (or check an acknowledgment checkbox)
2. **Profile form fields:**
   - Band name (pre-filled from `band_applications/{bandId}.band_name`, read-only or editable)
   - Genre
   - Bio (textarea, ~300 chars)
   - Profile photo — drag-and-drop Storage upload (follows vendor-application pattern); uploaded server-side via `register-artist.ts` to `artist_photos/{bandId}/profile.{ext}` using Admin SDK
   - Website URL
   - Music link (Spotify, Bandcamp, SoundCloud, etc.)
   - Social links (Instagram, Facebook — optional)
3. **Submit** → POST to `/api/artist/register`
4. **Success state:** "Profile submitted for review. You'll get an email when you're approved."

**Auth flow on this page:**
- Page load: check if Firebase magic link URL (`isSignInWithEmailLink`)
  - If yes: complete sign-in (`signInWithEmailLink`), get UID, proceed to form
  - If no: show "Sign in first" message with link to `/artist/login`
- `bandId` pulled from query param (passed via `actionCodeSettings.url` in the invite email — see `send-artist-invite.ts`); pre-populate band name from Firestore read (public read allowed)

### 3c. `/artist/portal` — `src/pages/artist/portal.astro`

Ongoing profile and track management for signed-in artists. Auth handled entirely
client-side — `onAuthStateChanged` at the top of the page script redirects to
`/artist/login` if no user is present.

**Page sections:**

#### Profile section
- Display current profile fields (read from `artists/{bandId}` client-side)
- Edit button opens an inline edit form (same fields as register, including photo upload zone)
- Save → POST to `/api/artist/update-artist`

#### Tracks section
- List all tracks from `artists/{bandId}/tracks` subcollection (ordered by `uploadedAt` ascending)
- Each track row: title, upload date, 🗑 delete button
- Delete → confirm dialog → POST to `/api/artist/delete-track`

#### Upload new track section
- Condensed AUP reminder: _"You retain all rights to your music. By uploading, you grant the Magna Arts Council a non-exclusive license to stream these tracks on magnaarts.org. MP3 / radio edits only."_
- Required checkbox: "I confirm I have the rights to share this track"
- Track title input
- Drag-and-drop / file picker (`.mp3` only)
- Upload button (disabled until checkbox checked and file selected)
- Upload → POST to `/api/artist/upload-track`

#### Status banner
- If `status === 'pending_review'`: yellow banner — "Your profile is under review. We'll notify you by email."
- If `status === 'rejected'`: red banner — "Your profile wasn't approved. Check your email for details from the Arts Council."
- If `status === 'approved'` and no tracks: blue banner — "Upload your first track to go live on the directory."
- If `status === 'approved'` and `visible: true`: green banner — "You're live! View your listing →"

---

## Phase 4 — Admin Artists Page

**File:** `src/pages/admin/artists.astro`

Mirror the pattern from `admin/volunteers.astro` (filter tabs, status badges, action buttons).

**Filter tabs:** Pending Review | Approved | Rejected

**Per-artist card shows:**
- Band name, genre, bio excerpt
- Profile photo (if set)
- Track count (from subcollection)
- Registration date
- Status badge
- **Approve** / **Reject** buttons (pending only)
- **View Portal** link (opens `/artist/portal` — useful for debugging)

**Approve flow:** POST to `/api/artist/approve-artist` → page reloads with updated status

**Reject flow:** POST to `/api/artist/approve-artist` with `action: 'reject'` → status set to
`rejected`; admin then emails the artist directly with specific content feedback.

**Add to AdminLayout sidebar nav** between "Bands" and "Programs" (or at the bottom of the primary group).

---

## Shared Utility — `src/lib/sendArtistInvite.ts`

Shared utility imported by `send-artist-invite.ts`, `optin.ts`, and `update-submission.ts`. Exports two functions:

```typescript
// src/lib/sendArtistInvite.ts

/**
 * Step 1 — Send the invitation email with an opt-in button.
 * Stores a one-time UUID token in optinTokens/{token} (30-day expiry).
 * Does NOT generate a Firebase auth link.
 */
export async function sendArtistInvite(opts: {
  bandId: string;
  email: string;
  bandName: string;
  existingStatus?: string; // skips Firestore read if already known
}): Promise<{ ok: boolean; isReturning: boolean; error?: string }>

/**
 * Step 2 — Called by /api/artist/optin after token validation.
 * Generates Firebase magic link via Admin SDK generateSignInWithEmailLink
 * and emails it via Resend.
 */
export async function sendArtistAuthLink(opts: {
  bandId: string;
  email: string;
  bandName: string;
  isReturning: boolean;
}): Promise<{ ok: boolean; error?: string }>
```

- `sendArtistInvite` sends an invitation-only email (no auth link). The `isReturning` flag is derived from whether `artists/{bandId}.status === 'approved'` and is stored in the opt-in token for use in step 2.
- `sendArtistAuthLink` uses the Admin SDK (`generateSignInWithEmailLink`) server-side — **not** the client-side `sendSignInLinkToEmail`. The `continueUrl` is `/artist/portal` for returning artists or `/artist/register?bandId={bandId}` for new ones.
- Both functions share a private `sendEmail` helper that calls the Resend API.
- Token storage: top-level `optinTokens/{token}` collection (not a subcollection under `artists/`).

Import and call directly from both `update-submission.ts` and the `send-artist-invite.ts` API route (which becomes a thin wrapper for manual admin use). Errors propagate naturally — no silent HTTP failures.

---

## Phase 5 — Good Standing Email Trigger

**File edited:** `src/pages/api/admin/update-submission.ts`

The existing `update-submission` route handles band status changes. When a band transitions
to `good_standing`, fire the invite:

```typescript
import { sendArtistInvite } from '../../../lib/sendArtistInvite';

if (newStatus === 'good_standing') {
  await sendArtistInvite({ bandId, email: band.email, bandName: band.band_name });
}
```

> **Note:** Uses the shared utility directly — no internal `fetch()` round-trip. See `src/lib/sendArtistInvite.ts`.

Also **add Sync button to `bands.astro`** for approved artists:
- Appears on the band card only when `artists/{bandId}` exists and `status === 'approved'`
- Calls `/api/artist/sync-artist` with `{ bandId }`
- Success: toast confirmation; no page reload needed

---

## Phase 6 — `/local-artists` Public Page

**File:** `src/pages/local-artists.astro`

### Artist grid

Server-side Firestore query in frontmatter:

```typescript
// Note: no .orderBy() — combining .where() on multiple fields with .orderBy() on a
// different field requires a composite index. Sort small result set in JS instead.
const snapshot = await adminDb
  .collection('artists')
  .where('visible', '==', true)
  .where('status', '==', 'approved')
  .get();

const artists = snapshot.docs
  .map(doc => doc.data())
  .sort((a, b) => a.band_name.localeCompare(b.band_name));
```

Each artist card shows:
- Photo (with fallback placeholder)
- Band name (Playfair Display)
- Genre tag
- Bio excerpt (truncated, ~120 chars)
- Links: Website, Music link, socials (icon buttons)

### Rotating player

Sits fixed at the bottom of the page. Renders only if at least one track exists.

**Client-side on page load:**
1. Fetch all tracks from all visible artists (client-side `getDocs` with `collectionGroup('tracks')`)
2. Build a flat playlist array: `[{ title, url, artistName, bandId }, ...]`
3. **Shuffle immediately on load** using Fisher-Yates — playlist order is randomized every visit, so no listener hears the same sequence twice
4. Initialize `<audio>` element, begin playback

**Player UI:**
- Current artist name + track title (Playfair Display)
- Play / Pause button
- Skip button (advances index, wraps to 0)
- Progress bar (HTML5 `timeupdate` event, click-to-seek)
- No third-party dependency — native `<audio>` only

**Firestore index required** for `collectionGroup('tracks')` — add to `firestore.indexes.json`:

```json
{
  "collectionGroup": "tracks",
  "queryScope": "COLLECTION_GROUP",
  "fields": [{ "fieldPath": "uploadedAt", "order": "DESCENDING" }]
}
```

Deploy: `firebase deploy --only firestore:indexes`

---

## Editing Checklist (files touched across all phases)

### New files
- [ ] `src/lib/sendArtistInvite.ts` — shared utility; exports `sendArtistInvite` and `sendArtistAuthLink`
- [ ] `src/pages/api/artist/send-artist-invite.ts`
- [ ] `src/pages/api/artist/optin.ts` — validates opt-in token, burns it, calls `sendArtistAuthLink`
- [ ] `src/pages/api/artist/me.ts` — returns artist doc + tracks for the authenticated artist
- [ ] `src/pages/api/artist/register-artist.ts`
- [ ] `src/pages/api/artist/update-artist.ts`
- [ ] `src/pages/api/artist/upload-track.ts`
- [ ] `src/pages/api/artist/delete-track.ts`
- [ ] `src/pages/api/artist/approve-artist.ts`
- [ ] `src/pages/api/artist/sync-artist.ts`
- [ ] `src/pages/artist/login.astro`
- [ ] `src/pages/artist/optin.astro` — opt-in landing page with confirmation UI and token in query param
- [ ] `src/pages/artist/register.astro`
- [ ] `src/pages/artist/portal.astro`
- [ ] `src/pages/admin/artists.astro`
- [ ] `src/pages/local-artists.astro`

### Edited files
- [ ] `firestore.rules` — add `artists` + `artists/tracks` rules
- [ ] `storage.rules` — add `artist_tracks` path
- [ ] `firestore.indexes.json` — add `tracks` collectionGroup index
- [ ] `src/pages/api/admin/update-submission.ts` — trigger invite on `good_standing` status
- [ ] `src/pages/admin/bands.astro` — add Sync button to approved-artist cards
- [ ] `src/layouts/AdminLayout.astro` — add Local Artists link to sidebar nav

---

## Session Groupings — Efficient Build Order

Each session opens with one `read_multiple_files` call to load all reference files simultaneously,
then writes or edits as many related files as possible before the tool limit is reached.
The groupings below reflect actual auth patterns and file dependencies observed in the codebase —
not just phase order.

---

### Session 1 — Security Rules & Indexes
**Unblocks everything. Do this first.**

**Read at session start (one call):**
```
firestore.rules
storage.rules
firestore.indexes.json
```
All three are short — read together, rewrite together in one pass.

**Write / edit:**
- `firestore.rules` — append `artists` + `artists/{bandId}/tracks` blocks
- `storage.rules` — append `artist_tracks/{bandId}/{filename}` block
- `firestore.indexes.json` — append `tracks` collectionGroup index entry

**Deploy before moving on:**
```bash
firebase deploy --only firestore:rules,storage,firestore:indexes
```

**Why grouped:** These three files are all config, all short, all must be in place before any
artist data can be read or written from the browser. Deploying them as one batch avoids a broken
intermediate state where rules and indexes are out of sync.

---

### Session 2 — Artist-Auth API Routes
**The four endpoints that artists call directly. All share the same ID token auth pattern.**

**Read at session start (one call):**
```
src/pages/api/admin/update-presenter.ts    ← payload-building pattern (build from present fields)
src/pages/api/admin/delete-presenter.ts    ← delete + 404 guard pattern
```

**Write (all new files):**
- `src/pages/api/artist/register-artist.ts` — create `artists/{bandId}` doc; send admin notification email
- `src/pages/api/artist/update-artist.ts` — partial update (mirror `update-presenter.ts`, swap collection + auth)
- `src/pages/api/artist/upload-track.ts` — Storage upload via Admin SDK bucket, then subcollection write
- `src/pages/api/artist/delete-track.ts` — delete Storage file + subcollection doc, recount tracks, flip `visible`

**Why grouped:** All four use the same ID token auth check (`Authorization: Bearer <idToken>` →
`adminAuth.verifyIdToken()`). Writing them together means the auth boilerplate is written once
and pasted — no drift between files. `register-artist.ts` and `update-artist.ts` both mirror
`update-presenter.ts` almost exactly; having that file freshly read before writing both keeps
them consistent on the first pass.

---

### Session 3 — Admin-Auth API Routes + Admin Artists Page
**Three admin-only API routes plus the page that calls them — all session-cookie auth.**

**Read at session start (one call):**
```
src/pages/api/admin/update-submission.ts   ← session cookie verify + status update pattern
src/pages/api/admin/delete-presenter.ts    ← session cookie verify + delete pattern
src/pages/admin/volunteers.astro           ← filter tab + action button pattern for the admin page
```

**Write (all new files):**
- `src/pages/api/artist/approve-artist.ts` — session cookie auth; approve flips status + visible; reject just sets status
- `src/pages/api/artist/sync-artist.ts` — session cookie auth; reads `artists/{bandId}`, writes fields back to `band_applications/{bandId}`
- `src/pages/api/artist/send-artist-invite.ts` — session cookie auth; checks for existing artist doc to decide register vs portal link; sends Resend email
- `src/pages/admin/artists.astro` — filter tabs (Pending / Approved / Rejected); artist cards with photo, bio, track count; Approve / Reject buttons POSTing to `approve-artist.ts`

**Why grouped:** The three API routes all share the same session cookie verification header
(copy once, paste three times). The admin page is written in the same session because it calls
`approve-artist.ts` — having both open at the same time means the button `data-` attributes and
fetch body will match the route's expected input without a second context-load.
`volunteers.astro` is the direct structural template for `admin/artists.astro`.

---

### Session 4 — Edits to Existing Files
**Three files that already exist and need targeted additions — no new files.**

**Read at session start (one call):**
```
src/pages/api/admin/update-submission.ts   ← add Good Standing trigger (~8 lines)
src/pages/admin/bands.astro                ← add Sync button to approved-artist cards
src/layouts/AdminLayout.astro              ← add Local Artists nav link
```
Read all three together at the top of the session, then edit all three before the context goes stale.

**Edit:**
- `update-submission.ts` — after the Firestore `update()` call, add: if `status === 'good_standing'`,
  call `send-artist-invite` with `bandId`, `email`, `band_name`
- `bands.astro` — for each band card where `artists/{bandId}` exists and `status === 'approved'`,
  render a "Sync to Application" button; click handler POSTs `{ bandId }` to `/api/artist/sync-artist`
- `AdminLayout.astro` — add a Local Artists `<a>` nav link between Band Applications and
  Program Proposals

**Why grouped:** All three are surgical additions to existing files — no scaffolding needed.
Reading all three upfront before touching any of them avoids the stale-context problem where
an earlier edit makes a subsequent `str_replace` target no longer match. These edits are also
interdependent: the Sync button in `bands.astro` calls `sync-artist.ts` (Session 3), and the
invite trigger in `update-submission.ts` calls `send-artist-invite.ts` (also Session 3).
Doing all three edits together confirms the full wiring is complete before moving to UI.

---

### Session 5 — Artist-Facing Pages
**Three public pages. Photo upload pattern comes from `vendor-application/index.astro`.**

**Read at session start (one call):**
```
src/pages/vendor-application/index.astro   ← drag-and-drop Storage upload (drop zone, FileReader preview, uploadBytes)
```
The vendor application is the definitive reference for the photo upload UI used on both
`register.astro` and `portal.astro`. Reading it once before writing both pages means the
drop zone HTML, preview logic, and `uploadBytes` call are accurate on the first pass.

**Write (all new files, in this order):**
1. `src/pages/artist/login.astro` — email input; `sendSignInLinkToEmail`; localStorage save; confirmation message. Short, write first.
2. `src/pages/artist/register.astro` — magic link completion on load (`isSignInWithEmailLink` → `signInWithEmailLink`); AUP block; profile form with drag-and-drop photo upload; POST to `register-artist.ts`
3. `src/pages/artist/portal.astro` — `onAuthStateChanged` guard; client-side reads from `artists/{bandId}` and tracks subcollection; status banner; track list with delete; MP3 upload with rights checkbox; profile edit form

**Why grouped:** All three pages share Firebase client SDK initialization (same
`define:vars={{ firebaseConfig }}` → `window.__FIREBASE_CONFIG__` pattern used throughout
the project). Writing `login.astro` first gives the other two pages a concrete redirect
target to reference inline. The drop zone code in `register.astro` and `portal.astro` is
a near-direct copy of the vendor-application implementation — keeping that reference file
fresh in context for all three writes prevents subtle divergence.

---

### Session 6 — Public `/local-artists` Page
**The payoff. Its own session because the rotating player is the largest single block of new JS in the build.**

**Read at session start (one call):**
```
src/pages/events/index.astro    ← server-side Firestore query pattern in frontmatter + client Firebase init
```

**Write (one new file):**
- `src/pages/local-artists.astro` — server-side artist grid query in frontmatter; artist card grid;
  fixed-bottom player with `<audio>`, Fisher-Yates shuffle on load, collectionGroup tracks fetch,
  play/pause/skip controls, progress bar

**Why its own session:** The rotating player alone — collectionGroup fetch, playlist state
machine, audio element event wiring, progress bar — warrants focused attention without
competing concerns. Splitting it from Session 5 also means you can smoke-test the artist
pages with real Firestore data before building the player that depends on it.

**Note:** Confirm the `tracks` collectionGroup index from Session 1 is deployed before testing,
or the player's fetch will fail silently.

---

### Session Summary

| Session | Reads | New files written | Existing files edited | Deploy needed |
|---|---|---|---|---|
| 1 — Security Rules | 3 | 0 | 3 | Yes — rules + indexes |
| 2 — Artist API Routes | 2 | 4 | 0 | No |
| 3 — Admin API Routes + Admin Page | 3 | 4 | 0 | No |
| 4 — Existing File Edits | 3 | 0 | 3 | No |
| 5 — Artist Pages | 1 | 3 | 0 | No |
| 6 — Public Page | 1 | 1 | 0 | No |

---

---

## Firestore Collections Added

| Collection | Purpose |
|---|---|
| `optinTokens/{token}` | One-time opt-in tokens (top-level, for direct lookup without index). Fields: `email`, `bandId`, `isReturning`, `expiresAt` (ms), `usedAt` (ms\|null), `createdAt` |
| `artists/{bandId}` | Artist profiles (see Phase 1) |
| `artists/{bandId}/tracks/{trackId}` | MP3 track metadata (see Phase 1) |

---

*Created April 2026. Updated April 2026 to reflect actual two-step opt-in implementation, new files (`optin.ts`, `optin.astro`, `me.ts`), and `sendArtistInvite.ts` dual-export shape. Update this file as phases complete — check off items in the Editing Checklist above.*
