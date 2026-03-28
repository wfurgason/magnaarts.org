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
  - [x] `src/data/events.ts` — single source of truth for all event data (used by homepage, listing, and detail pages)

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
- Public-facing events are sourced from `src/data/events.ts` (hardcoded array)
- Marked with `// TODO: replace with Firestore query` comments
- Admin dashboard reads live from Firestore

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

*README maintained throughout active development. Updated with every significant change.*
