# Visual Artists Feature — Build Plan

Expand the Local Artists page to include visual artists (painters, photographers, sculptors, etc.)
alongside music artists. The existing music artist flow is reused almost entirely — the key
difference is image uploads instead of MP3s, and a carousel card instead of an audio player.

---

## Data Model Change

Add `artistType: 'music' | 'visual'` to every `artists/{bandId}` Firestore doc.
Also add it to `optinTokens/{token}` so the opt-in flow routes to the correct register page.

Existing music artist docs do **not** need migration — treat a missing `artistType` field as `'music'`.

---

## Build Order

### Step 1 — Email templates (`src/lib/sendArtistInvite.ts`)

Update `sendArtistInvite()` to accept `artistType: 'music' | 'visual'` and store it on the
`optinTokens` doc. Branch `buildInvitationEmail()` so the visual version says:

- "upload images of your work" instead of "upload MP3 tracks"
- "up to 5 images" instead of "up to 5 tracks"
- Remove the Acceptable Use / explicit-content language (not relevant for images)
- Replace with: "Images must be your original work or work you have rights to display."
- Keep the opt-in button, security tip, and auth link email identical

No change needed to `buildAuthLinkEmail()` — it is type-agnostic.

---

### Step 2 — Firestore data model (API routes)

**`src/pages/api/artist/send-artist-invite.ts`**
- Accept `artistType` in the request body (default `'music'` if omitted)
- Pass `artistType` through to `sendArtistInvite()`

**`src/pages/api/artist/register-artist.ts`**
- Accept and store `artistType` on the artist doc
- Admin notification email should mention the type: "New music artist" / "New visual artist"

**`src/pages/api/artist/me.ts`**
- Return `artistType` from the artist doc
- Return `images` subcollection for visual artists, `tracks` for music artists

---

### Step 3 — Admin invite UI (`src/pages/admin/artists.astro`)

Add an inline invite form at the **top** of the page (above the filter tabs).

Fields:
- Artist / Group Name (text input)
- Email Address (email input)
- Type toggle: **Music** | **Visual** (styled segmented control)
- Send Invite button

On success: show inline confirmation ("Invite sent to email@example.com").
On failure: show inline error.

Also add an `artistType` column (or badge) to the artists table so you can see the type of
each pending/approved profile at a glance.

**Also:** Remove the existing invite button from `src/pages/admin/bands.astro`.

---

### Step 4 — Visual artist opt-in routing (`src/pages/artist/optin.astro`)

The existing opt-in page reads the token from Firestore. Update it to check `artistType` on the
token doc and redirect to the correct register page:

- `'music'`  → `/artist/register?bandId=X` (existing, no change)
- `'visual'` → `/artist/register-visual?bandId=X` (new)

---

### Step 5 — Visual artist register page (`src/pages/artist/register-visual.astro`)

New page, mirrors `artist/register.astro` with these differences:

**Remove:**
- Genre field
- Music Link field
- MP3 / track upload section

**Add:**
- Image upload section: up to 5 JPG/PNG images, drag-and-drop (same drop zone pattern as
  the existing profile photo drop zone)
- Images upload directly to Firebase Storage: `artist_images/{bandId}/{filename}`
- On submit, call `register-artist` API with `artistType: 'visual'` and an array of image URLs

**Keep identical:**
- Artist / group name, bio, website, Instagram, Facebook
- Profile photo (headshot / avatar)
- Same auth pattern (Firebase magic link → `register-visual?bandId=X`)

---

### Step 6 — Visual artist portal (`src/pages/artist/portal-visual.astro`)

New page, mirrors `artist/portal.astro` with these differences:

**Replace track section with image section:**
- Display: grid of up to 5 uploaded images with a Delete button on each
- Upload form: drag-and-drop zone for JPG/PNG (max 10 MB each); image title optional
- Firebase Storage path: `artist_images/{bandId}/{timestamp}_{filename}`
- Firestore subcollection: `artists/{bandId}/images/{imageId}`
- Limit: 5 images max

**New API routes needed:**
- `src/pages/api/artist/upload-image.ts` — registers uploaded image URL in Firestore
- `src/pages/api/artist/delete-image.ts` — deletes image from Storage + Firestore

**Keep identical:**
- Top bar, sign-out, status banner, profile edit form, all auth patterns

---

### Step 7 — Public Local Artists page (`src/pages/local-artists.astro`)

**Visual artist card layout:**

```
┌─────────────────────────────────────┐
│  [Image carousel — auto-rotates]    │  ← up to 5 images, JS setInterval
│  Image 1 of 5  ●○○○○               │
├─────────────────────────────────────┤
│  🎨 Visual  (type badge)            │
│  Artist Name                        │
│  Bio (truncated ~120 chars)         │
│  [Website] [Instagram] [Facebook]   │
└─────────────────────────────────────┘
```

Carousel implementation: JS `setInterval` swapping a CSS class — no library needed.
Music cards get a `🎵 Music` badge; visual cards get `🎨 Visual`.

**Mixing music and visual artists:**
- Fetch all approved + visible artists from Firestore regardless of type
- Render music and visual cards interleaved in the same grid
- No separate sections or filter tabs — the "virtual arts festival" feel works best mixed

---

## New Files Summary

| File | Purpose |
|------|---------|
| `src/pages/artist/register-visual.astro` | Registration form for visual artists |
| `src/pages/artist/portal-visual.astro` | Portal for visual artists (image upload/manage) |
| `src/pages/api/artist/upload-image.ts` | Register uploaded image in Firestore |
| `src/pages/api/artist/delete-image.ts` | Delete image from Storage + Firestore |

## Modified Files Summary

| File | Change |
|------|--------|
| `src/lib/sendArtistInvite.ts` | Branch invitation email by `artistType` |
| `src/pages/api/artist/send-artist-invite.ts` | Accept + pass through `artistType` |
| `src/pages/api/artist/register-artist.ts` | Store `artistType`; branch admin notification |
| `src/pages/api/artist/me.ts` | Return images subcollection for visual artists |
| `src/pages/artist/optin.astro` | Route to correct register page by `artistType` |
| `src/pages/admin/artists.astro` | Add inline invite form; add type badge to table |
| `src/pages/admin/bands.astro` | Remove existing invite button |
| `src/pages/local-artists.astro` | Add visual artist cards with image carousel |

---

## Misc Notes

- Firebase Storage rules for `artist_images/` need a separate `firebase deploy --only storage`
  after adding the new path (same pattern as the existing `artist_tracks/` and `band-promos/` rules).
- Treat a missing `artistType` field on existing docs as `'music'` — no Firestore migration needed.

---

## Completed Work

### ✅ Approval email branching (`src/pages/api/artist/approve-artist.ts`)

The approval route previously used music-only email templates for all artist types. Fixed:

- Added `approvedWithImagesEmail()` — sent to visual artists who already have images uploaded;
  references artwork, not tracks or streaming.
- Added `approvedNoImagesEmail()` — sent to visual artists with no images yet; prompts them to
  upload images (not MP3s); includes image rights/license reminder instead of music AUP language.
- Approval logic now reads `artist.artist_type` and branches accordingly:
  - Visual artists: checks `images` subcollection for upload count
  - Music artists: checks `tracks` subcollection (unchanged)
- API response now returns `artistType` and `uploadCount` (renamed from `trackCount`) for both types.
- Existing music artist templates and subjects are unchanged.
