# Magna Arts Council — magnaarts.org

**Magna, Utah's Designated Local Arts Agency**

A fast, beautiful, community-focused website for the Magna Arts Council. Built to encourage community participation, gather event data for grant reporting, and manage the full lifecycle of arts programming — from proposal to post-event report.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | [Astro](https://astro.build) — SSR mode via Vercel adapter |
| Styling | Plain CSS with design tokens (CSS variables) |
| Backend / database | [Supabase](https://supabase.com) — Postgres + auth + realtime |
| Hosting | [Vercel](https://vercel.com) — free tier, auto-deploys on push |
| Fonts | Playfair Display (headings) + DM Sans (body) via Google Fonts |

**Why Vercel over GitHub Pages:**
GitHub Pages is static-only. Vercel gives us server-side rendering, which means:
- The board dashboard has real server-side auth protection (not just JS redirects)
- The Supabase service role key stays server-side and never reaches the browser
- API routes work — needed for report generation, form handling, and webhooks
- No `base` path hacks needed — the site serves from the root

---

## Project Structure

```
magnaarts.org/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Disabled — Vercel handles deploys automatically
├── .env.example                # Template for required environment variables
├── public/                     # Static assets (favicon, images, etc.)
├── src/
│   ├── styles/
│   │   └── global.css          # Design tokens, reset, utility classes, buttons
│   ├── layouts/
│   │   └── BaseLayout.astro    # Shared <head>, OG tags, scroll-reveal observer
│   ├── components/
│   │   ├── Header.astro        # Sticky nav with mobile hamburger menu
│   │   └── Footer.astro        # Dark footer with nav links
│   └── pages/
│       └── index.astro         # Homepage (events data hardcoded — see Data Notes)
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

- [x] **Phase 1.5 — Shared Data**
  - [x] `src/data/events.ts` — single source of truth for all event data (used by homepage, listing, and detail pages)

- [x] **Phase 2 — Proposal Wizard** (community-facing)
  - [x] Multi-step proposal form (`/propose`) — 3 steps: About You, Your Idea, Details. UI only, Supabase wired up in Phase 3+.
  - [x] Confirmation page (`/propose/confirmation`) — shows next steps, links back to events
  - [ ] Email notification to board on submit (needs Supabase or form service)
  - [ ] Save submission to Supabase `programs` table

- [ ] **Phase 3 — Board Dashboard** (auth-protected, SSR)
  - [ ] Login (`/board/login`)
  - [ ] Review queue (`/board`)
  - [ ] Approve / reject / request changes
  - [ ] Assign sponsor

- [ ] **Phase 4 — Planning Checklist**
  - [ ] Sponsor + presenter shared checklist
  - [ ] Auto-publish trigger when checklist complete

- [ ] **Phase 5 — Reporting**
  - [ ] Attendance tracking (intent + actual)
  - [ ] Endorsement / testimonial collection
  - [ ] Auto-generated post-event report
  - [ ] Grant data export

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values before running locally.

```bash
cp .env.example .env
```

| Variable | Scope | Description |
|---|---|---|
| `PUBLIC_SUPABASE_URL` | Public (browser-safe) | Your Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Public (browser-safe) | Supabase anon key — safe to expose, RLS enforces security |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-side only** | Admin key — never expose in browser or commit to git |
| `SITE_URL` | Server-side | Full URL of the site (used in emails, OG tags) |

**In Vercel:** add these in Project → Settings → Environment Variables.
Set `SUPABASE_SERVICE_ROLE_KEY` to Production + Preview only (never Development if you're cautious).

---

## Data Notes

### Current state
- Events on the homepage are **hardcoded arrays** in `src/pages/index.astro`
- Marked with `// TODO: replace with Supabase query` comments
- Supabase integration begins in Phase 2

### Planned Supabase tables (draft)

| Table | Purpose |
|---|---|
| `programs` | Proposals and approved programs, workflow stage tracking |
| `events` | Published events with date/time/location |
| `attendance` | Intent-to-attend and actual attendance per event |
| `endorsements` | Post-event testimonials / quotes |
| `board_members` | Board roster, roles, sponsor assignments |
| `volunteers` | Volunteer signups per event |

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
- [ ] Create Vercel account (or confirm existing — Vercel MCP is already connected)
- [ ] Import the `magnaarts.org` GitHub repo in Vercel dashboard
- [ ] Add all environment variables in Vercel → Project → Settings → Environment Variables
- [ ] Confirm build succeeds in Vercel dashboard (should take ~60 seconds)
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

### Supabase
- [ ] Create production Supabase project
- [ ] Run database migrations / create tables
- [ ] Configure Row Level Security (RLS) policies for all tables
- [ ] Seed initial events data
- [ ] Add production Supabase keys to Vercel environment variables
- [ ] Test auth flows end-to-end in Vercel preview URL

### Content
- [ ] Replace hardcoded event data with real Supabase queries
- [x] Add real logo / favicon — `ArtsCouncil_logo.png` added to `Header.astro` (48px height, scales on mobile)
- [ ] Add real photography / imagery
- [ ] Write and publish About page content
- [ ] Add real board member names and bios
- [ ] Confirm all contact information is accurate

### Legal / Compliance
- [ ] Write and publish Privacy Policy page
- [ ] Confirm donation flow complies with non-profit disclosure requirements
- [ ] Verify 501(c)(3) / Designated Local Arts Agency language is accurate sitewide

### QA
- [ ] Test all pages on mobile (iOS Safari, Android Chrome)
- [ ] Test nav hamburger menu on small screens
- [ ] Run Lighthouse audit — target 95+ Performance, 100 Accessibility
- [ ] Check all internal links resolve correctly
- [ ] Confirm Google Fonts load (no mixed-content warnings)
- [ ] Submit sitemap to Google Search Console
- [ ] Verify OG tags render correctly (use https://opengraph.xyz)

---

*README maintained throughout active development. Updated with every significant change.*
