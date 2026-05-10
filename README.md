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
├── firebase.json               # Firebase project config (Firestore rules, hosting)
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Composite index definitions (mailingList, artists, tracks)
├── cors.json                   # CORS config for Firebase Storage
├── scripts/
│   ├── bootstrap-admin.js      # Seeds initial admin user with custom claims (ESM)
│   └── bootstrap-admin.cjs     # CJS version of the above
├── public/                     # Static assets (favicon, images, etc.)
│   ├── admin-bands.js          # Client-side JS for bands admin page
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
│   │   ├── BaseLayout.astro    # Shared <head>, OG tags, scroll-reveal observer; has <slot name="head" />
│   │   └── AdminLayout.astro   # Admin shell: sidebar nav, user display, logout; has <slot name="head" />
│   ├── components/
│   │   ├── Header.astro        # Sticky nav with mobile hamburger menu
│   │   ├── Footer.astro        # Dark footer with nav links
│   │   └── MailingListBanner.astro  # Slide-in email subscription banner
│   ├── lib/
│   │   ├── firebase-admin.ts   # Firebase Admin SDK init (adminAuth, adminDb, adminStorage exports)
│   │   ├── sendArtistInvite.ts # Email helpers: sendArtistInvite + sendArtistAuthLink (magic link)
│   │   ├── time-utils.ts       # timeToISO() and related date/time helpers
│   │   └── totp.ts             # TOTP helpers: generate/encrypt/decrypt secret, verify code, build otpauth URI
│   ├── middleware.ts            # SSR auth middleware — protects /admin/* routes; /admin/enroll-mfa is public
│   └── pages/
│       ├── index.astro              # Homepage — Firestore-driven pinned tiles + Next Up
│       ├── about.astro
│       ├── contact.astro
│       ├── get-involved.astro
│       ├── programs.astro
│       ├── present.astro            # Presenter landing page (links to sub-forms)
│       ├── volunteer.astro          # Public volunteer sign-up form
│       ├── lens-of-magna.astro      # Lens of Magna photography contest page
│       ├── local-artists.astro      # Public artist directory — reads approved/visible artists from Firestore
│       ├── writing-conference.astro # Writing Conference 2026 event landing page
│       ├── confirm.astro            # Mailing list email confirmation landing page
│       ├── events/
│       │   ├── index.astro          # Events listing (Firestore-driven)
│       │   └── [id].astro           # SSR dynamic event detail (prev/next, calendar link)
│       ├── call-for-bands/
│       │   └── index.astro          # Band application form with file uploads
│       ├── teach-an-art-class/
│       │   └── index.astro          # Art class proposal form → art_class_submissions; Quill rich text
│       ├── vendor-application/
│       │   └── index.astro          # Arts Festival vendor application form
│       ├── propose/
│       │   ├── index.astro          # Multi-step proposal wizard (3 steps)
│       │   └── confirmation.astro
│       ├── artist/                  # Artist self-service portal (Firebase magic-link auth)
│       │   ├── login.astro          # Request magic-link login email
│       │   ├── optin.astro          # Accept admin invitation, trigger magic-link send
│       │   ├── register.astro       # Music artist profile setup form
│       │   ├── register-visual.astro # Visual artist profile setup form
│       │   ├── portal.astro         # Music artist dashboard (upload tracks, manage profile)
│       │   └── portal-visual.astro  # Visual artist dashboard (upload images, manage profile)
│       ├── admin/
│       │   ├── index.astro          # Login (Firebase email/password → session cookie)
│       │   ├── dashboard.astro      # Summary stats + recent activity
│       │   ├── bands.astro          # Band application review queue
│       │   ├── artists.astro        # Local artist profile review queue
│       │   ├── artist-preview.astro # Token-gated artist profile preview for admin
│       │   ├── programs.astro       # Program proposal review queue
│       │   ├── planning.astro       # Event planning (Music & Movies, Open Mic, Art Night, Writing Group, Festival)
│       │   ├── seasons.astro        # 301 redirect → /admin/planning
│       │   ├── events.astro         # Published events management
│       │   ├── manual-event.astro   # Manually publish any event type directly to the events collection
│       │   ├── art-presenters.astro # Art class submission review + Quill edit modal
│       │   ├── volunteers.astro     # Volunteer sign-up review queue
│       │   ├── mailing-list.astro   # Email subscriber management (confirmed/pending, delete)
│       │   ├── vendors.astro        # Vendor application review queue
│       │   ├── pinned-content.astro # Homepage pinned tile manager
│       │   ├── users.astro          # Board user management (super_admin only)
│       │   └── enroll-mfa.astro     # TOTP MFA enrollment (standalone page, no AdminLayout; public route)
│       └── api/
│           ├── auth/
│           │   ├── session.ts       # POST — creates Firebase session cookie from ID token
│           │   └── logout.ts        # POST — deletes session cookie, redirects to /admin
│           ├── contact.ts           # POST — contact form handler (Resend)
│           ├── subscribe.ts         # POST — mailing list subscribe; stores token in mailingList; sends confirmation email
│           ├── unsubscribe.ts       # POST — mailing list unsubscribe by token
│           ├── confirm.ts           # GET — confirm mailing list email via token
│           ├── events/
│           │   └── attend.ts        # POST — RSVP / attend intent for a published event
│           ├── artist/              # Artist portal API (Firebase ID-token auth, not session cookie)
│           │   ├── register-artist.ts   # POST — create artist Firestore doc after Firebase signup
│           │   ├── update-artist.ts     # POST — update artist profile fields
│           │   ├── upload-track.ts      # POST — upload audio track to Storage, save metadata subcollection
│           │   ├── delete-track.ts      # POST — delete a track from Storage + subcollection
│           │   ├── upload-image.ts      # POST — upload image to Storage, save metadata subcollection (visual artists)
│           │   ├── delete-image.ts      # POST — delete an image from Storage + subcollection
│           │   ├── submit-for-review.ts # POST — set artist status to pending_review
│           │   ├── request-login.ts     # POST — send magic-link login email to returning artist
│           │   ├── optin.ts             # POST — accept invite token, send Firebase magic link
│           │   ├── me.ts                # GET — return artist Firestore doc for current authenticated artist
│           │   ├── approve-artist.ts    # POST — admin approve artist (sets status + visible)
│           │   ├── send-artist-invite.ts # POST — admin send invitation email to a band
│           │   ├── sync-artist.ts       # POST — sync Firebase Auth UID to artist Firestore doc
│           │   └── delete-artist.ts     # POST — delete artist profile + all tracks/images
│           └── admin/
│               ├── update-submission.ts   # POST — legacy approve/reject for proposals & bands
│               ├── band-action.ts         # POST — approve/reject/waitlist/reinstate band applications
│               ├── update-band.ts         # POST — inline edit band application fields
│               ├── upload-band-photo.ts   # POST — admin-side band photo upload to Storage
│               ├── publish-event.ts       # POST — publish Music & Movies event
│               ├── publish-open-mic.ts    # POST — publish Open Mic event
│               ├── publish-art-night.ts   # POST — publish Group Art Night event
│               ├── publish-writing-group.ts # POST — publish Writing Group event
│               ├── publish-festival.ts    # POST — publish/republish Arts Festival
│               ├── unpublish-event.ts     # POST — unpublish any event type
│               ├── delete-event.ts        # POST — delete a published event
│               ├── add-manual-event.ts    # POST — manually write any event type to events collection
│               ├── assign-band.ts         # POST — assign/unassign/confirm/publish bands
│               ├── update-presenter.ts    # POST — update art class submission fields
│               ├── delete-presenter.ts    # POST — delete art class submission
│               ├── move-to-art-presenter.ts # POST — promote a band application into art_class_submissions
│               ├── update-proposal.ts     # POST — inline edit program proposal fields
│               ├── delete-proposal.ts     # POST — delete a program proposal
│               ├── vendor-action.ts       # POST — approve/reject/pay/delete vendor apps
│               ├── save-pinned-item.ts    # POST — create/update pinned content item
│               ├── delete-pinned-item.ts  # POST — delete pinned content item
│               ├── manage-user.ts         # POST — create/update board users (super_admin)
│               ├── artist-preview-token.ts # GET — generate short-lived preview token for artist profile
│               ├── delete-subscriber.ts   # POST — delete mailing list subscriber
│               ├── totp-enroll.ts         # POST — generate + encrypt TOTP secret; store in admin_users
│               ├── totp-status.ts         # POST — check whether caller has TOTP enrolled
│               └── totp-verify.ts         # POST — verify a TOTP code against stored encrypted secret
├── src/data/
│   └── events.ts               # Seed data for 2025 events; retained for Past Events Archive in /admin/events
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
3. If TOTP MFA is enrolled, the login page calls `/api/admin/totp-status` and prompts for a 6-digit code before proceeding; code verified via `/api/admin/totp-verify`
4. ID token is POSTed to `/api/auth/session`
5. Server calls `adminAuth.createSessionCookie()` → sets an httpOnly, secure cookie (5-day expiry)
6. All subsequent `/admin/*` requests are verified server-side in `src/middleware.ts`; `/admin/enroll-mfa` is whitelisted as a public route
7. Logout hits `/api/auth/logout` → cookie is deleted, redirected to `/admin`

### TOTP MFA Enrollment

MFA is optional but available to all admin accounts. It uses a custom server-side TOTP implementation (`src/lib/totp.ts`, backed by Node's `crypto` module) — Firebase's built-in MFA was abandoned due to SMS/reCAPTCHA failures and TOTP requiring an unavailable Cloud Identity Platform tier.

- Admin visits `/admin/enroll-mfa` (public route, no session cookie required)
- Page generates a TOTP secret server-side, stores it encrypted in `admin_users/{uid}` via `/api/admin/totp-enroll`
- QR code displayed for scanning with any authenticator app
- On next login the login page detects enrollment and gates session creation behind code verification
- Encryption key: `TOTP_ENCRYPTION_KEY` env var (64-character hex string, 32 bytes AES-256-GCM)

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
  - [x] `src/lib/time-utils.ts` — shared `timeToISO()` helper used by all publish endpoints

- [x] **Phase 1.6 — Call for Bands Form**
  - [x] Application form (`/call-for-bands`) — contact info, genre, member count, 300-char bio, website/music links, date availability
  - [x] Submissions saved to Firestore `band_applications` collection
  - [x] File uploads (promo photo, tech rider) — wired to Firebase Storage (`band-promos/`, `band-tech-riders/`)
  - [x] Date availability: replaced free-text field with 2026 date checkboxes (7 dates, min 2 required), saves as array to Firestore
  - [ ] Wire `/call-for-bands` into Header nav under "Movie and Music in the Park"
  - [ ] Email notification to board on new submission

- [x] **Phase 2 — Proposal Wizard** (community-facing)
  - [x] Multi-step proposal form (`/propose`) — 3 steps: About You, Your Idea, Details
  - [x] Confirmation page (`/propose/confirmation`)
  - [ ] Wire submissions to Firestore `program_submissions` collection
  - [ ] Email notification to board on submit

- [x] **Phase 3 — Board Dashboard** (auth-protected, SSR)
  - [x] Login (`/admin`) — Firebase email/password auth → httpOnly session cookie; TOTP gate if enrolled
  - [x] Auth middleware (`src/middleware.ts`) — protects all `/admin/*` except login and `/admin/enroll-mfa`; role check for `/admin/users`
  - [x] Dashboard (`/admin/dashboard`) — stat cards (pending bands, approved bands, pending proposals, total events) + recent activity tables
  - [x] Band applications (`/admin/bands`) — filterable list with milestone tabs, status badges, inline editing, rejection notes modal; `band-action.ts` + `update-band.ts` + `upload-band-photo.ts`
  - [x] Program proposals (`/admin/programs`) — filterable list, status badges, inline edit (`update-proposal.ts`), delete (`delete-proposal.ts`)
  - [x] Events management (`/admin/events`) — view/unpublish/delete published events
  - [x] Manual event entry (`/admin/manual-event`) — publish any event type directly to `events` collection via `add-manual-event.ts`; supports all known event types including custom
  - [x] User management (`/admin/users`) — create/manage board users, assign roles (super_admin only)
  - [x] TOTP MFA enrollment (`/admin/enroll-mfa`) — standalone page (no AdminLayout); generates QR code, stores encrypted secret via `totp-enroll.ts`
  - [x] `AdminLayout.astro` — shared admin shell with sidebar, user display, logout link; `<slot name="head" />` supported
  - [x] `admin.css` — admin-specific styles (login card, stat grid, data tables, badges)
  - [ ] Assign Board Sponsor to a proposal
  - [ ] Email notifications to presenter on status change

- [x] **Phase 3.5 — Music & Movie in the Park Planning**
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
  - [x] Per-event workflows: Music & Movies (existing), Open Mic (existing), Group Art Night (new), Writing Group (new)
  - [x] Group Art Night shells saved to `art_night_events` Firestore collection
  - [x] Writing Group shells saved to `writing_group_events` Firestore collection; published via `publish-writing-group.ts`
  - [x] Arts Festival shells saved to `festival_events` Firestore collection
  - [x] Public "Teach an Art Class" form at `/teach-an-art-class` — saves to `art_class_submissions`; Quill rich text on artsArea, projectDescription, materials fields
  - [x] Link to `/teach-an-art-class` added above "See Upcoming Events" on `programs.astro#art-night`
  - [x] Open Mic shells table now visible on planning page
  - [x] Edit modal updated to pass `collection` param; works for park_events, open_mic_events, art_night_events, writing_group_events
  - [x] Admin page to review art class submissions (`/admin/art-presenters`) — filter tabs, status actions, sidebar nav link; Quill edit modal
  - [x] `art_class_submissions` Firestore security rules — allow public create
  - [x] Band assignment — "Assign to Date" button on approved bands; modal shows available shells; warns if date not in band's availability list
  - [x] Unassign / reassign — removes band from shell, resets both docs; available from bands page and seasons page
  - [x] Band confirmation tracking — "Mark Confirmed" on season shell; sets `bandConfirmed: true`; Publish button only enabled after confirmation
  - [x] Publish event to public site — writes to `events` collection using shell ID; marks shell + band application as `published`
  - [x] `/api/admin/assign-band` — handles assign / unassign / confirm / publish actions
  - [x] `assigned` filter tab added to band applications list
  - [x] `move-to-art-presenter.ts` — promotes a band application doc into `art_class_submissions`
  - [ ] Movie info token-protected form for licensor
  - [ ] Update public `/events/[id]` to render band + movie combined layout

- [x] **Phase 3.7 — Vendor Application**
  - [x] Public vendor application form (`/vendor-application`) — business name, contact, products/services, space preference, profile image upload
  - [x] Submissions saved to Firestore `vendor_applications` collection
  - [x] Profile image upload to Firebase Storage (`vendor-profiles/`)
  - [x] Admin vendor review page (`/admin/vendors`) — approval, payment tracking, space number assignment, delete
  - [x] `vendor-action.ts` API route — handles approve/reject/pay/delete actions

- [x] **Phase 3.8 — Volunteer Sign-Up**
  - [x] Public volunteer form (`/volunteer`) — name, email, phone, can-lift checkbox, interest checkboxes
  - [x] Submissions saved to Firestore `volunteer_signups` collection
  - [x] Admin volunteers page (`/admin/volunteers`) — searchable/filterable table, status tabs (new/contacted/active/inactive)
  - [x] Added Volunteers to AdminLayout sidebar nav
  - [x] Replaced Google Form links on `get-involved.astro` with `/volunteer`

- [x] **Phase 3.9 — Pinned Content**
  - [x] Admin pinned content page (`/admin/pinned-content`) — slide-in drawer form, live preview tile, emoji picker
  - [x] Fields: title, subtitle, badge, icon, detail line, URL, CTA text, external link toggle, show-on selector, expiry date, active toggle
  - [x] `save-pinned-item.ts` — create/update `pinned_content` Firestore docs
  - [x] `delete-pinned-item.ts` — delete `pinned_content` docs
  - [x] `index.astro` homepage now reads `pinned_content` from Firestore server-side; replaces hardcoded `pinnedItems` array
  - [x] Items filtered by `active: true`, expiry date, and `showOn` (home / events / both)
  - [x] Added Pinned Content to AdminLayout sidebar nav

- [x] **Phase 3.10 — Mailing List**
  - [x] `MailingListBanner.astro` component — slide-in subscription banner in public pages
  - [x] Double opt-in flow: `subscribe.ts` stores pending subscriber + sends confirmation email via Resend; `confirm.ts` verifies token → sets status to `confirmed`; `confirm.astro` landing page shows status
  - [x] `unsubscribe.ts` — remove subscriber by token (linked from emails)
  - [x] `mailingList` Firestore collection with `allow create: if true` security rule
  - [x] Admin mailing list page (`/admin/mailing-list`) — view confirmed/pending subscribers, delete; linked in sidebar
  - [x] `delete-subscriber.ts` — admin-only delete of a subscriber doc
  - [x] Composite index on `mailingList`: `status ASC` + `subscribedAt DESC`

- [x] **Phase 3.11 — Local Artist Portal**
  - [x] Artist invitation flow: admin sends invite email from `/admin/artists` via `send-artist-invite.ts`; email contains opt-in link (`/artist/optin`); opt-in stores token in Firestore, sends Firebase magic link
  - [x] Artist login (`/artist/login`) — email magic-link auth (request via `request-login.ts`)
  - [x] Music artist registration (`/artist/register`) → `register-artist.ts` creates `artists` doc
  - [x] Visual artist registration (`/artist/register-visual`) → same endpoint with `artistType: 'visual'`
  - [x] Music artist portal (`/artist/portal`) — upload/delete audio tracks, edit profile, submit for review
  - [x] Visual artist portal (`/artist/portal-visual`) — upload/delete images, edit profile, submit for review
  - [x] Artist API routes: `me.ts`, `update-artist.ts`, `upload-track.ts`, `delete-track.ts`, `upload-image.ts`, `delete-image.ts`, `submit-for-review.ts`, `sync-artist.ts`, `approve-artist.ts`, `delete-artist.ts`
  - [x] Admin artist review queue (`/admin/artists`) — filter tabs (pending_review / approved / rejected), approve/reject actions, track/image counts, send invite from the page
  - [x] Admin artist preview (`/admin/artist-preview`) — token-gated preview of an artist's public profile; token generated by `artist-preview-token.ts`
  - [x] `local-artists.astro` — public artist directory showing approved + visible artists
  - [x] `artists` Firestore collection with subcollections `tracks` and `images`; security rules allow public read, authenticated artist writes
  - [x] Composite index on `artists`: `visible ASC` + `status ASC`; Collection-group index on `tracks`: `uploadedAt DESC`
  - [x] `sendArtistInvite.ts` lib — `sendArtistInvite` (invitation email with opt-in token) + `sendArtistAuthLink` (Firebase magic-link email)

- [x] **Phase 3.12 — TOTP MFA**
  - [x] `src/lib/totp.ts` — `generateTotpSecret`, `encryptSecret`, `decryptSecret`, `verifyTotpCode`, `buildOtpauthUri` using Node `crypto` (AES-256-GCM + HMAC-SHA1 TOTP)
  - [x] `/admin/enroll-mfa` — standalone enrollment page; shows QR code; calls `totp-enroll.ts`
  - [x] `totp-enroll.ts` — generates + stores encrypted secret in `admin_users/{uid}`
  - [x] `totp-status.ts` — checks whether a given ID token's UID has TOTP enrolled
  - [x] `totp-verify.ts` — verifies submitted 6-digit code against stored encrypted secret
  - [x] Admin login page polls `totp-status` after Firebase sign-in; shows TOTP prompt if enrolled
  - [x] `admin_users` Firestore collection — no client access (rules: `allow read, write: if false`)
  - [x] Middleware whitelists `/admin/enroll-mfa` so unenrolled admins can set up MFA before first session
  - [ ] Grace period / backup codes for locked-out admins

- [x] **Phase 3.13 — Writing Conference + Manual Event Entry**
  - [x] `writing-conference.astro` — public landing page for Writing Conference 2026 event
  - [x] Writing Group shells added to planning page; `publish-writing-group.ts` publishes to `events` collection
  - [x] `/admin/manual-event` — admin form to directly write any event type to `events` collection; supports all series types plus custom; backed by `add-manual-event.ts`
  - [x] Manual event linked as indented sub-item under Published Events in the admin sidebar

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
| `band_applications` | Call-for-bands submissions; status: `pending` → `approved` / `declined` / `waitlisted` / `published`; milestone flags: `everApproved`, `everAssigned`, `everPublished`; `goodStanding` boolean is independent of status |
| `program_submissions` | Proposal wizard submissions; status: `pending` → `approved` / `rejected` |
| `events` | Published events with date/time/location; written by all publish endpoints + `add-manual-event.ts` |
| `park_seasons` | One doc per season year; holds year + array of event shell IDs |
| `park_events` | Music & Movies in the Park event shells; status: `shell` → `band_assigned` → `confirmed` → `published` |
| `open_mic_events` | Open Mic Night event shells; status: `shell` → `published` |
| `art_night_events` | Group Art Night event shells; status: `shell` → `published` |
| `writing_group_events` | Writing Group event shells; status: `shell` → `published` |
| `festival_events` | Arts Festival event shells; one doc per festival year |
| `art_class_submissions` | Teach an Art Class proposals from the public form; status: `pending` → `approved` / `rejected` / `contacted` |
| `vendor_applications` | Arts Festival vendor applications; status: `pending` → `approved` → `paid` / `rejected`; `space_number` assigned on payment |
| `volunteer_signups` | Public volunteer sign-up submissions; status: `new` → `contacted` → `active` / `inactive` |
| `pinned_content` | Homepage hero pinned tiles; fields: `title`, `badge`, `icon`, `sublabel`, `meta`, `href`, `ctaText`, `ctaExternal`, `colorClass`, `showOn`, `active`, `expiresDate`, `createdAt` |
| `mailingList` | Email subscribers; fields: `email`, `status` (`pending` / `confirmed`), `token`, `subscribedAt`, `confirmedAt`; double opt-in via confirmation email |
| `artists` | Local artist profiles; fields: `band_name`, `artistType` (`music` / `visual`), `genre`, `bio`, `photo_url`, `email`, `website`, `music_link`, `social_instagram`, `social_facebook`, `uid`, `status` (`pending_review` / `approved` / `rejected`), `visible`, `registeredAt`; subcollections: `tracks` (music artists), `images` (visual artists) |
| `admin_users` | Per-admin MFA data; fields: `totpSecret` (AES-256-GCM encrypted), `totpEnrolled` (boolean); keyed by Firebase Auth UID |

### Planned collections (Phase 4–5)

| Collection | Purpose |
|---|---|
| `attendance` | Intent-to-attend and actual attendance per event |
| `endorsements` | Post-event testimonials / quotes |
| `board_members` | Board roster, roles, sponsor assignments |

---

## Environment Variables

Create a `.env` file at the project root and fill in these values before running locally.

| Variable | Scope | Description |
|---|---|---|
| `PUBLIC_FIREBASE_API_KEY` | Public (browser-safe) | Firebase web API key |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | Public (browser-safe) | Firebase auth domain (e.g. `yourapp.firebaseapp.com`) |
| `PUBLIC_FIREBASE_PROJECT_ID` | Public (browser-safe) | Firebase project ID |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | Public (browser-safe) | Firebase Storage bucket (e.g. `yourapp.appspot.com`) |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Public (browser-safe) | Firebase messaging sender ID |
| `PUBLIC_FIREBASE_APP_ID` | Public (browser-safe) | Firebase web app ID |
| `FIREBASE_PROJECT_ID` | **Server-side only** | Same project ID — used by Admin SDK |
| `FIREBASE_CLIENT_EMAIL` | **Server-side only** | Service account client email |
| `FIREBASE_PRIVATE_KEY` | **Server-side only** | Service account private key (with `\\n` escaped newlines) |
| `RESEND_API_KEY` | **Server-side only** | Resend API key for transactional email (contact form, mailing list, artist invites) |
| `TOTP_ENCRYPTION_KEY` | **Server-side only** | 64-character hex string (32 bytes) used to AES-256-GCM encrypt TOTP secrets in Firestore |
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

## Recent Changes

### April 7, 2026 — Pinned Content admin + homepage Firestore hookup
- Created `/admin/pinned-content` — slide-in drawer form to create/edit/delete homepage hero tiles
- Fields: title, subtitle, badge, icon, detail line, URL, CTA text, external-link toggle, show-on (home/events/both), expiry date, active toggle; live preview tile updates as you type
- `save-pinned-item.ts` — upserts docs in `pinned_content` collection; converts `expiresDate` string to Firestore Timestamp
- `delete-pinned-item.ts` — deletes a `pinned_content` doc by ID
- Added Pinned Content link to AdminLayout sidebar nav
- `index.astro` homepage now queries `pinned_content` server-side via Admin SDK; replaced hardcoded `pinnedItems` array entirely
- Query filters: `active == true`, expiry date not yet passed, `showOn` is `home` or `both`; sorted newest-first in JS (avoids composite index requirement)
- CSS variable aliases added to `pinned-content.astro` `<style>` block — admin pages only load `admin.css`, so site tokens (`--white`, `--navy`, `--border`, etc.) were undefined and rendering dim/invisible

### April 1, 2026 — admin/vendors: delete vendor record
- Added a 🗑 Delete button to every vendor card (visually separated right with `margin-left:auto`)
- Clicking opens a confirmation modal; modal shows the vendor name and a permanent-action warning before proceeding
- Confirmed delete calls `vendor-action.ts` with `action: 'delete'`; API deletes the Firestore doc and reloads the page
- Added `btn-delete` CSS style (soft red outline, no filled background)
- Added `delete` to the allowed-actions list and delete handler in `vendor-action.ts`

### April 1, 2026 — vendor-application: profile image upload
- Added drag-and-drop image upload zone labeled "Upload a Profile Image" in the Vendor Details fieldset, directly after the "What are you selling / offering?" textarea
- Uploads to Firebase Storage at `vendor-profiles/{timestamp}.{ext}` on submit; saves download URL as `profile_image_url` in Firestore
- Added `vendor-profiles/` rule to `storage.rules`
- Run `firebase deploy --only storage` after pushing to activate the storage rule

### March 31, 2026 — Arts Festival: dynamic schedule + Republish
- `publish-festival.ts`: writes `bands` array to the `events` doc on every publish/republish
- `planning.astro`: published festival shells now show a **Republish ↗** button alongside the Published badge; calls the same endpoint; reloads the page instead of redirecting to /admin/events
- `[id].astro`: Main Stage Schedule now loads dynamically from `events/arts-festival-2026` (bands field) instead of hardcoded TBA rows; shows "Band lineup being announced soon!" if no bands assigned
- Workflow: assign + confirm bands on planning page → Publish (first time) or Republish (updates) → public festival page reflects latest lineup

### March 31, 2026 — teach-an-art-class: replace Links field with Project Image upload
- Replaced "Links to Your Work" textarea with a drag-and-drop image upload zone labeled "Project Image"
- Added Firebase Storage import + upload logic; saves download URL as `projectImageUrl` in Firestore
- Added `art-class-images/` rule to `storage.rules`
- Run `firebase deploy --only storage` after pushing

### March 31, 2026 — storage.rules: add band-promos + band-tech-riders paths
- Fixed Firebase Storage `storage/unauthorized` errors on call-for-bands form
- `storage.rules` only had `band-images/`; form uploads to both `band-promos/` and `band-tech-riders/` — added both rules
- Run `firebase deploy --only storage` to push the fix

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

*README maintained throughout active development. Updated with every significant change.*
