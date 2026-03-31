# Magna Arts Council — magnaarts.org

**Magna, Utah's Designated Local Arts Agency**

A fast, beautiful, community-focused website for the Magna Arts Council. Built to encourage community participation, gather event data for grant reporting, and manage the full lifecycle of arts programming — from proposal to post-event report.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | [Astro](https://astro.build) — SSR mode via Vercel adapter |
| Styling | Plain CSS with design tokens (CSS variables) |
| Backend / database | [Firebase](https://firebase.google.com) — Firestore (database) + Firebase Auth + Firebase Admin SDK |
| Hosting | [Vercel](https://vercel.com) — free tier, auto-deploys on push |
| Fonts | Playfair Display (headings) + DM Sans (body) via Google Fonts |

**Why Vercel over GitHub Pages:**
GitHub Pages is static-only. Vercel gives us server-side rendering, which means:
- The board dashboard has real server-side auth protection (not just JS redirects)
- The Firebase service account key stays server-side and never reaches the browser
- API routes work — needed for report generation, form handling, and webhooks
- No `base` path hacks needed — the site serves from the root

**Why Firebase (vs. original Supabase plan):**
Firebase was chosen for the backend during Phase 1.6–3 implementation:
- Firebase Auth session cookies provide secure, httpOnly, server-verifiable sessions
- Firestore's flexible document model fits the varied shape of proposals and applications
- Firebase Admin SDK integrates cleanly with Astro SSR middleware for role-based access
- `scripts/bootstrap-admin.js` seeds the initial board user with custom claims

---

## Project Structure

```
magnaarts.org/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Disabled — Vercel handles deploys automatically
├── .env.example                # Template for required environment variables
├── firebase.json               # Firebase project config (Firestore rules, hosting)
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Composite index definitions
├── cors.json                   # CORS config for Firebase Storage
├── scripts/
│   ├── bootstrap-admin.js      # Seeds initial admin user with custom claims (ESM)
│   └── bootstrap-admin.cjs     # CJS version of the above
├── public/                     # Static assets (favicon, images, etc.)
│   └── images/
│       ├── ArtsCouncil_logo.png
│       ├── classes/
│       ├── concerts/
│       ├── events/
│       ├── festival/
│       └── people/
├── src/
│   ├── styles/
│   │   ├── global.css          # Design tokens, reset, utility classes, buttons
│   │   └── admin.css           # Admin dashboard styles (login, tables, badges, stats)
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Shared <head>, OG tags, scroll-reveal observer
│   │   └── AdminLayout.astro   # Admin shell: sidebar nav, user display, logout
│   ├── components/
│   │   ├── Header.astro        # Sticky nav with mobile hamburger menu
│   │   └── Footer.astro        # Dark footer with nav links
│   ├── lib/
│   │   └── firebase-admin.ts   # Firebase Admin SDK init (adminAuth + adminDb exports)
│   ├── middleware.ts            # SSR auth middleware — protects /admin/* routes
│   └── pages/
│       ├── index.astro         # Homepage
│       ├── about.astro
│       ├── contact.astro
│       ├── get-involved.astro
│       ├── programs.astro
│       ├── events/
│       │   ├── index.astro     # Events listing
│       │   └── [id].astro      # SSR dynamic event detail (prev/next, calendar link)
│       ├── call-for-bands/
│       │   └── index.astro     # Band application form (Firebase backend)
│       ├── propose/
│       │   ├── index.astro     # Multi-step proposal wizard (3 steps)
│       │   └── confirmation.astro
│       ├── admin/
│       │   ├── index.astro     # Login page (Firebase email/password → session cookie)
│       │   ├── dashboard.astro # Summary stats + recent activity
│       │   ├── bands.astro     # Band application review queue
│       │   ├── programs.astro  # Program proposal review queue
│       │   ├── events.astro    # Published events management
│       │   └── users.astro     # Board user management (super_admin only)
│       └── api/
│           ├── auth/
│           │   ├── session.ts  # POST — creates Firebase session cookie from ID token
│           │   └── logout.ts   # GET — deletes session cookie, redirects to /admin
│           └── admin/
│               ├── update-submission.ts  # POST — approve/reject/status proposals & bands
│               ├── publish-event.ts      # POST — publish an approved event
│               ├── delete-event.ts       # POST — delete an event
│               └── manage-user.ts        # POST — create/update board users (super_admin)
├── src/data/
│   └── events.ts               # Single source of truth for 2025 event data
├── astro.config.mjs            # Vercel adapter, SSR output, site URL
├── package.json
└── README.md
```

---

## Design System

### Brand Colors

| Token | Value | Usage |
|---|---|---|
| `--navy` | `#1a2456` | Primary brand, headings |
| `--navy-dk` | `#111833` | Dark backgrounds (donate banner, footer) |
| `--gold` | `#e8a020` | Primary accent, CTA buttons |
| `--gold-lt` | `#f5b942` | Hover state for gold |
| `--blue` | `#2563b0` | Concerts, attend role, links |
| `--green` | `#2d7a3a` | Art classes, volunteer role |
| `--red` | `#b52626` | Film / movies, present role |
| `--amber` | `#c87e0a` | Arts festival, lead role |
| `--cream` | `#f7f5f0` | Section backgrounds |
| `--muted` | `#5a5a7a` | Body text, meta info |

### Typography

- **Display / Headings:** Playfair Display (700, 900; italic for hero emphasis)
- **Body / UI:** DM Sans (300–700)

### Event & Program Color Coding

Each event type and community role has a consistent color used across cards, tags, links, and top-border accents:

| Type | Color |
|---|---|
| Concert | Blue |
| Film | Red |
| Class | Green |
| Festival | Amber |

### Key Utility Classes (`global.css`)

| Class | Purpose |
|---|---|
| `.container` | max-width 1140px, centered, padded |
| `.section` | standard vertical padding |
| `.reveal` | scroll-triggered fade-up (JS observer in BaseLayout) |
| `.btn` | base button |
| `.btn-gold` | primary CTA (gold fill) |
| `.btn-white` | hero primary (white fill, inverts on hover) |
| `.btn-outline-white` | hero secondary (white outline) |

---

## Authentication & Admin Access

### How it works

1. Board member visits `/admin` and enters email + password
2. Firebase client SDK (`signInWithEmailAndPassword`) authenticates and returns an ID token
3. ID token is POSTed to `/api/auth/session`
4. Server calls `adminAuth.createSessionCookie()` → sets an httpOnly, secure cookie (5-day expiry)
5. All subsequent `/admin/*` requests are verified server-side in `src/middleware.ts`
6. Logout hits `/api/auth/logout` → cookie is deleted, redirected to `/admin`

### Roles (custom claims)

| Claim | Access |
|---|---|
| `role: 'admin'` | All admin pages: dashboard, bands, programs, events |
| `role: 'super_admin'` | Everything above + `/admin/users` (board user management) |

### Bootstrapping admin users

Run this once to create the initial board admin account:

```bash
cd "Documents/Arts Council/magnaarts.org"
node scripts/bootstrap-admin.js
```

The script requires `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` to be set in `.env`.

---

## Program Workflow

Every arts program moves through these stages. Each has a clear owner.

```
PROPOSE → REVIEW → ASSIGN SPONSOR → PLAN → PUBLISH → RUN → REPORT
```

| Stage | Owner | Description |
|---|---|---|
| **PROPOSE** | Community member | Submit a program idea via the proposal wizard |
| **REVIEW** | Full board | Board votes to accept, reject, or request changes |
| **ASSIGN SPONSOR** | Board | A board member is assigned as sponsor (required to advance) |
| **PLAN** | Sponsor + Presenter | Complete the planning checklist together |
| **PUBLISH** | Automatic | Event publishes when planning checklist is complete |
| **RUN** | Sponsor | Sponsor manages day-of logistics |
| **REPORT** | System | Auto-generated post-event report for grant data |

---

## Build Sequence

- [x] **Phase 1 — Public Site**
  - [x] Homepage (`/`)
  - [x] Events listing (`/events`) — refactored to `events/index.astro`, links to detail pages
  - [x] Event detail (`/events/[id]`) — SSR dynamic route, prev/next nav, calendar link, park tips
  - [x] Programs (`/programs`) — sticky jump nav, all 5 programs with real photos, at-a-glance cards
  - [x] About (`/about`) — mission, programs, board, partners
  - [x] Get Involved (`/get-involved`) — 4 ways, volunteer roles, propose flow
  - [x] Contact (`/contact`) — contact form, phone/email/address, board note
  - [x] Call for Bands (`/call-for-bands`) — Firebase-backed application form with file uploads; see below

- [x] **Phase 1.5 — Shared Data**
  - [x] `src/data/events.ts` — single source of truth for 2025 season event data; used by the admin past-events archive; **no longer imported by public-facing pages** (public site is 100% Firestore-driven as of March 2026)

- [x] **Phase 1.6 — Call for Bands Form**
  - [x] Application form (`/call-for-bands`) — contact info, genre, member count, 300-char bio, website/music links, date availability
  - [x] Submissions saved to Firestore `band_applications` collection
  - [x] File uploads (promo photo, tech rider) — wired to Firebase Storage
  - [x] Date availability: replaced free-text field with 2026 date checkboxes (7 dates, min 2 required), saves as array to Firestore
  - [ ] Wire `/call-for-bands` into Header nav under "Movie and Music in the Park"
  - [ ] Email notification to board on new submission

- [x] **Phase 2 — Proposal Wizard** (community-facing)
  - [x] Multi-step proposal form (`/propose`) — 3 steps: About You, Your Idea, Details
  - [x] Confirmation page (`/propose/confirmation`)
  - [ ] Wire submissions to Firestore `program_submissions` collection
  - [ ] Email notification to board on submit

- [x] **Phase 3 — Board Dashboard** (auth-protected, SSR)
  - [x] Login (`/admin`) — Firebase email/password auth → httpOnly session cookie
  - [x] Auth middleware (`src/middleware.ts`) — protects all `/admin/*` except login; role check for `/admin/users`
  - [x] Dashboard (`/admin/dashboard`) — stat cards (pending bands, approved bands, pending proposals, total events) + recent activity tables
  - [x] Band applications (`/admin/bands`) — filterable list, status badges, inline review actions
  - [x] Program proposals (`/admin/programs`) — filterable list, status badges, inline review actions
  - [x] Events management (`/admin/events`) — view/publish/delete published events
  - [x] User management (`/admin/users`) — create/manage board users, assign roles (super_admin only)
  - [x] API routes — `update-submission`, `publish-event`, `delete-event`, `manage-user`, `session`, `logout`
  - [x] `AdminLayout.astro` — shared admin shell with sidebar, user display, logout link
  - [x] `admin.css` — admin-specific styles (login card, stat grid, data tables, badges)
  - [ ] Assign Board Sponsor to a proposal
  - [ ] Email notifications to presenter on status change

- [ ] **Phase 3.5 — Music & Movie in the Park Planning**
  - [x] Season Setup wizard (`/admin/seasons`) — enter year + dates, generates Firestore event shells with static template (venue, address, start time); skips existing dates; 2026 pre-populated
  - [x] Event shells editable (venue, address, start time) and deletable from the season table
  - [x] `park_seasons` Firestore collection — one doc per year
  - [x] `park_events` Firestore collection — one doc per event shell; status: `shell` → `band_assigned` → `confirmed` → `published`
  - [x] Season Setup added to Admin sidebar nav

- [x] **Phase 3.6 — Plan Events Refactor**
  - [x] Renamed `/admin/seasons` → `/admin/planning`; old URL issues a 301 redirect
  - [x] Renamed sidebar nav item "Season Setup" → "Plan Events"
  - [x] Replaced event-type radio toggle with dropdown populated from EVA.rtf event list
  - [x] Dropdown auto-fills venue & address for each event title (still editable)
  - [x] Per-event workflows: Music & Movies (existing), Open Mic (existing), Group Art Night (new)
  - [x] Group Art Night shells saved to `art_night_events` Firestore collection
  - [x] Group Art Night shell table with placeholder "Assign Presenter" button (disabled; wired in next build)
  - [x] Annual Arts Seminar, Arts Festival, "or something else" show placeholder UI (no workflow yet)
  - [x] Public "Teach an Art Class" form at `/teach-an-art-class` — saves to `art_class_submissions`
  - [x] Link to `/teach-an-art-class` added above "See Upcoming Events" on `programs.astro#art-night`
  - [x] Open Mic shells table now visible on planning page
  - [x] Edit modal updated to pass `collection` param; works for park_events, open_mic_events, art_night_events
  - [ ] Wire presenter assignment for Group Art Night (pulls from `art_class_submissions`)
  - [x] Admin page to review art class submissions (`/admin/art-presenters`) — filter tabs, status actions, sidebar nav link
  - [ ] Add `art_class_submissions` to Firestore security rules (allow public write)
  - [x] Band assignment — "Assign to Date" button on approved bands; modal shows available shells; warns if date not in band's availability list
  - [x] Unassign / reassign — removes band from shell, resets both docs; available from bands page and seasons page
  - [x] Band confirmation tracking — "Mark Confirmed" on season shell; sets `bandConfirmed: true`; Publish button only enabled after confirmation
  - [x] Publish event to public site — writes to `events` collection using shell ID; marks shell + band application as `published`
  - [x] `/api/admin/assign-band` — handles assign / unassign / confirm / publish actions
  - [x] `assigned` filter tab added to band applications list
  - [ ] Movie info token-protected form for licensor
  - [ ] Update public `/events/[id]` to render band + movie combined layout

- [ ] **Phase 4 — Planning Checklist**
  - [ ] Sponsor + presenter shared checklist
  - [ ] Auto-publish trigger when checklist complete

- [ ] **Phase 5 — Reporting**
  - [ ] Attendance tracking (intent + actual)
  - [ ] Endorsement / testimonial collection
  - [ ] Auto-generated post-event report
  - [ ] Grant data export

---

## Firestore Collections

| Collection | Purpose |
|---|---|
| `band_applications` | Call-for-bands submissions; status: `pending` → `approved` / `declined` / `waitlisted` / `published` |
| `program_submissions` | Proposal wizard submissions; status: `pending` → `approved` / `rejected` |
| `events` | Published events with date/time/location |
| `vendor_applications` | Arts Festival vendor applications; status: `pending` → `approved` → `paid` / `rejected`; `space_number` assigned on payment |

### Planned collections (Phase 4–5)

| Collection | Purpose |
|---|---|
| `attendance` | Intent-to-attend and actual attendance per event |
| `endorsements` | Post-event testimonials / quotes |
| `board_members` | Board roster, roles, sponsor assignments |
| `volunteers` | Volunteer signups per event |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values before running locally.

```bash
cp .env.example .env
```

| Variable | Scope | Description |
|---|---|---|
| `PUBLIC_FIREBASE_API_KEY` | Public (browser-safe) | Firebase web API key |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | Public (browser-safe) | Firebase auth domain (e.g. `yourapp.firebaseapp.com`) |
| `PUBLIC_FIREBASE_PROJECT_ID` | Public (browser-safe) | Firebase project ID |
| `FIREBASE_PROJECT_ID` | **Server-side only** | Same project ID — used by Admin SDK |
| `FIREBASE_CLIENT_EMAIL` | **Server-side only** | Service account client email |
| `FIREBASE_PRIVATE_KEY` | **Server-side only** | Service account private key (with `\\n` escaped newlines) |
| `SITE_URL` | Server-side | Full URL of the site (used in emails, OG tags) |

**In Vercel:** add these in Project → Settings → Environment Variables.
Never commit `FIREBASE_PRIVATE_KEY` or `FIREBASE_CLIENT_EMAIL` to git.

---

## Data Notes

### Current state
- Public-facing events are sourced **exclusively from Firestore** (`events` collection) — no static fallback
- Homepage and `/events` both show a friendly empty-state message if Firestore has no upcoming events
- Admin dashboard reads live from Firestore
- `src/data/events.ts` is retained as seed data for the Past Events Archive in `/admin/events`

---

## Local Development

```bash
cd "Documents/Arts Council/magnaarts.org"
npm install
npm run dev
```

Site runs at `http://localhost:4321`

---

## Deployment

Vercel watches the `main` branch and deploys automatically on every push.
No workflow file or manual steps needed.

Preview URLs are generated for every branch and pull request.

---

## ✅ Dev → Prod Checklist

### Vercel Setup
- [ ] Confirm Vercel project is linked to `magnaarts.org` GitHub repo
- [ ] Add all environment variables in Vercel → Project → Settings → Environment Variables
- [ ] Confirm build succeeds in Vercel dashboard (~60 seconds)
- [ ] Test preview URL before pointing domain

### Custom Domain
- [ ] Add `magnaarts.org` in Vercel → Project → Settings → Domains
- [ ] Update DNS at registrar (Bluehost per records):
  - Remove old A records pointing to GitHub Pages IPs
  - Add Vercel's A record: `76.76.21.21`
  - Add CNAME `www` → `cname.vercel-dns.com`
- [ ] Wait for DNS propagation (up to 24hrs, usually faster)
- [ ] Confirm SSL certificate provisioned in Vercel dashboard
- [ ] Confirm `https://magnaarts.org` loads correctly

### Firebase Setup
- [ ] Confirm Firebase project is created and Firestore is enabled
- [ ] Deploy Firestore security rules (`firebase deploy --only firestore:rules`)
- [ ] Deploy Firestore indexes (`firebase deploy --only firestore:indexes`)
- [ ] Run `node scripts/bootstrap-admin.js` to create initial admin user
- [ ] Add production Firebase keys to Vercel environment variables
- [ ] Test admin login end-to-end on Vercel preview URL

### Content
- [ ] Replace hardcoded event data with real Firestore queries
- [x] Add real logo / favicon — `ArtsCouncil_logo.png` added to `Header.astro` (48px height, scales on mobile)
- [ ] Add real photography / imagery
- [ ] Confirm all contact information is accurate
- [ ] Wire `/call-for-bands` link into Header nav

### Legal / Compliance
- [ ] Write and publish Privacy Policy page
- [ ] Confirm donation flow complies with non-profit disclosure requirements
- [ ] Verify 501(c)(3) / Designated Local Arts Agency language is accurate sitewide

### QA
- [ ] Test all pages on mobile (iOS Safari, Android Chrome)
- [ ] Test nav hamburger menu on small screens
- [ ] Test admin login, review, and publish flows end-to-end
- [ ] Run Lighthouse audit — target 95+ Performance, 100 Accessibility
- [ ] Check all internal links resolve correctly
- [ ] Confirm Google Fonts load (no mixed-content warnings)
- [ ] Submit sitemap to Google Search Console
- [ ] Verify OG tags render correctly (use https://opengraph.xyz)

---

---

## Recent Changes

### March 30, 2026 — Plan Events flow audit (no code changes)
- Mapped all 4 event planning flows (Music & Movies, Open Mic, Art Night, Arts Festival) and produced a visual workflow comparison
- Documented structural inconsistencies: Open Mic skips the confirmation gate (shell → published directly); Music & Movies band assignment happens on /admin/bands, not the planning page
- Post-publish navigation mismatch: Music & Movies + Festival redirect to /admin/events; Open Mic + Art Night reload the planning page
- eventDate timestamp hardcoding: Music & Movies uses T19:00:00, Festival uses T12:00:00, Open Mic + Art Night correctly use timeToISO(startTime)
- publishedBy in assign-band.ts is hardcoded as the string 'admin' instead of publisher.email (unlike all other flows)
- Festival: band_applications not updated when a band is assigned to a festival slot
- Art Night: art_class_submissions not updated when event is published
- Unpublish asymmetry: Music & Movies → confirmed (band preserved); Open Mic + Art Night → shell (presenter lost); Festival shell status is NOT reset (existing bug from prior session)

### March 30, 2026 — delete-event.ts: fix unpublish failing for all event types
- `delete-event.ts` only handled `submissionType === 'band'` or defaulted to `program_submissions`
- Events published via `assign-band` use `submissionType: 'band_application'`; open mic uses `'open_mic'`; art night uses `'art_night'` — none were handled, causing "Failed to unpublish"
- Fixed: switch on `submissionType` and reset the correct shell collection (`park_events`, `open_mic_events`, `art_night_events`) or submission collection (`band_applications`, `program_submissions`) using a Firestore batch
- `band_application` unpublish resets shell → `confirmed` and band → `assigned` (preserves the band assignment)
- `open_mic` / `art_night` unpublish resets shell → `shell`

### March 30, 2026 — Volunteer sign-up form + admin page
- Created `/volunteer` public form (name, email, phone, can lift 40lb, interests checkboxes) — saves to `volunteer_signups` Firestore collection
- Created `/admin/volunteers` review page with filter tabs (new / contacted / active / inactive) and status action buttons
- Added Volunteers to AdminLayout sidebar nav (between Art Presenters and Vendor Applications)
- Added `volunteer_signups` public-create rule to `firestore.rules`
- Replaced both Google Form links on `get-involved.astro` with `/volunteer`
- Outstanding: run `firebase deploy --only firestore:rules` to push updated rules

### March 30, 2026 — planning.astro: Replace Image in edit modal
- Edit modal now shows an image replace section for Open Mic and Art Night shells (collections with `imageUrl`)
- `openEditModal` accepts a 6th `currentImageUrl` arg; shows current image preview and a drag-and-drop upload zone
- On submit with a new file chosen, uploads to Storage (`open-mic-images` or `art-night-images` folder) before POSTing
- `update_shell` POST handler now saves `imageUrl` to Firestore if included in the form
- Music & Movies and Festival Edit buttons unchanged (no image field)

### March 30, 2026 — planning.astro: Group Art Night image upload
- Added image upload zone to Group Art Night form fields (same pattern as Open Mic)
- Drag-and-drop + file picker; previews before upload
- On submit, uploads to Firebase Storage at `art-night-images/{year}/event-image.{ext}`
- `anImageUrl` saved to each `art_night_events` shell doc as `imageUrl`

### March 29, 2026 (3) — planning.astro: calendar CSS fix
- Root cause: `.cal-dow-row` and `.cal-days` are JS-created elements; `is:global` CSS wasn't reliably applied to them in AdminLayout (which doesn't load global.css)
- Fix: set `display:grid` and `grid-template-columns` as inline `style.cssText` directly on those elements when building the calendar in JS
- Pattern to remember: for JS-injected elements in admin pages, inline styles are more reliable than even `is:global` CSS for layout-critical properties

### March 29, 2026 (2) — planning.astro: calendar date picker + Open Mic image upload
- Replaced dates textarea (YYYY-MM-DD manual entry) with a scrollable 12-month calendar for all 3 series types (Music & Movies, Open Mic, Art Night)
- Calendar renders all 12 months for the selected season year; click any day to toggle it on/off (highlighted navy); year change resets selection
- Selected dates appear as removable chips above the calendar; dates written to hidden `<textarea name="dates">` — server POST handler unchanged
- Replaced Open Mic `omImageUrl` text input with a drag-and-drop file upload zone (same pattern as call-for-bands)
- On submit, image is uploaded to Firebase Storage at `open-mic-images/{year}/event-image.{ext}`, download URL injected into hidden `omImageUrl` input, then form POSTs normally
- Firebase client SDK initialized via `define:vars={{ firebaseConfig }}` (same env vars already in use)

### March 29, 2026 — index.astro "Next Up" script fixes
- Fixed homepage events not displaying: resolved script issue (details confirmed by Wes)
- Added past-event filter: events with `eventDate` before today (midnight) are excluded from the "Next Up" grid
- Added empty-state reveal: if no upcoming events exist, `#next-up-empty` is shown instead of an empty grid
- Firebase init uses no dedup guard (single init on homepage — no conflict risk)

### March 28, 2026 (4) — programs.astro map links in At a Glance sidebar
- Added `mapAddress` field to all 5 program detail objects
- Location rows in the sidebar now render as a styled inline link → opens Google Maps `maps/search/?query=` in a new tab (no API key needed)
- Interaction: dashed blue underline at rest; on hover pin icon bounces up, underline goes solid, "OPEN MAP →" hint slides in from the left
- All other detail rows (When, Admission, etc.) remain plain text — only Location rows with a `mapAddress` get the link treatment

### March 28, 2026 (3) — programs.astro fix Astro scoped CSS bug on ticket stubs
- Root cause of unstyled ticket list: Astro's `<style>` block scopes all CSS with a unique hash attribute, but dynamically injected `innerHTML` elements never receive that hash, so selectors never matched
- Fix: split into two style blocks — scoped `<style>` for static template elements, `<style is:global>` for `.glance-item` and all `.ticket-*` classes which are injected at runtime

### March 28, 2026 (2) — programs.astro ticket stub styling
- Removed venue address from glance list (already shown in the sidebar panel)
- Restyled each event as a **concert ticket row** (inspired by venue event listings): navy background card, gold left border accent, large day number + month abbreviation on the left, band name large (Playfair Display 20px bold white) + "Live at HH:MM" subtitle in the middle, gold "FREE" badge on the right
- Date now split into `ticket-mon` (gold uppercase) + `ticket-day` (30px Playfair Display white)
- Hover lifts card with deeper shadow

### March 28, 2026 — programs.astro `#music-movies` glance list fix
- Renamed "Events at a Glance" heading → **"Upcoming Events"**
- Expanded glance list items to show **Date · Time**, **Band Name**, and **Venue · Venue Address** (previously only showed Date + title link)
- Added `getApps()`/`getApp()` Firebase deduplication guard so duplicate `initializeApp` calls don't silently crash the script and leave "Loading schedule…" stuck
- Replaced top-level `return` guard with a safe `display:none` fallback for the loading element
- All field names confirmed to match `publish-event.ts` output (`eventDate`, `eventTime`, `venueName`, `venueAddress`, `bandName`)
- Firestore rules confirmed: `events` collection has `allow read: if true` — public reads work

---

## Recent Changes

### March 28, 2026 — programs.astro `#music-movies` glance list fix
- Renamed **"Events at a Glance"** heading → **"Upcoming Events"**
- Expanded glance list items to show **Date · Time**, **Band Name**, and **Venue · Address** (previously only showed Date + title link)
- Added `getApps()`/`getApp()` Firebase deduplication guard so duplicate `initializeApp` calls don't silently crash the script and leave "Loading schedule…" stuck
- Replaced top-level module `return` guard with a safe `display:none` fallback for the loading element
- All Firestore field names confirmed to match `publish-event.ts` output (`eventDate`, `eventTime`, `venueName`, `venueAddress`, `bandName`)
- Firestore rules confirmed: `events` collection has `allow read: if true` — public reads OK

### March 29, 2026 (3) — programs.astro festival image fix + arts-festival-2025 → 2026 rename

**Festival image fix (`programs.astro`)**
- New festival image (`/images/festival/mmsaf.png`) was being cropped because the `.program-img` style uses `aspect-ratio: 4/3` with `object-fit: cover`, clipping the subject
- Image was created at 1:1 (square), so fix was to add a `.program-img--top` modifier class that overrides `aspect-ratio` to `1/1` for the festival image only
- Applied via conditional class: `p.id === 'festival' ? ' program-img--top' : ''` — all other program images unaffected

**Festival page rename: 2025 → 2026**

All references to `arts-festival-2025` updated across 3 files:

- **`src/data/events.ts`** — event `id` changed to `arts-festival-2026`; `isoDate` updated to `2026-08-15`; `day` updated to `Saturday, August 15, 2026`; added `image: '/images/festival/mmsaf.png'` so the festival logo appears in the event hero on the detail page; file comment updated to reference 2026
- **`src/pages/events/[id].astro`** — both `event.id === 'arts-festival-2025'` checks (festival extras section and vendor Firestore script) updated to `arts-festival-2026`
- **`src/pages/programs.astro`** — `link` updated from `/events/arts-festival-2025` → `/events/arts-festival-2026`

---

*README maintained throughout active development. Updated with every significant change.*
