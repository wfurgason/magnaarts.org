# Mailing List Subscription Abuse — Fix Plan

## Background
- Double opt-in mailing list is being hit by a distributed "subscription bombing"
  attack: real third-party email addresses (not the attacker's own) submitted from
  many different source IPs, so the existing per-IP rate limit (1 accepted/hour,
  in-memory `Map` in `src/pages/api/subscribe.ts`) doesn't catch it — each request
  looks like a first-time visitor.
- Confirmed from `/admin/mailing-list` export on 2026-09-15: 150+ "pending" rows
  dated Sep 13–15, varied real domains, several with Gmail dot-trick obfuscation.
- Consequence: Resend's 100/day free-tier email cap gets burned by confirmation
  emails sent to people who never asked to subscribe.
- Secondary bug found: the in-memory rate-limit `Map` resets on every cold start /
  redeploy, and Vercel can spin up multiple parallel instances under load, each
  with its own empty map — so even same-IP bursts aren't reliably caught.
- Vercel Firewall + BotID cost check done: WAF/DDoS protection is free on all
  plans; BotID basic detection is free; BotID Deep Analysis is $1/1,000 checks
  (only worth enabling on `/api/subscribe`, not site-wide) — cost is a non-issue
  at this site's traffic volume.

## Approach (agreed 2026-09-15)
Two layers, both server-enforced, no CAPTCHA/user friction:

### 1. Server-side hardening (no new dependencies)
- [x] Add a global daily cap on accepted signups — Firestore transaction-based
      counter in `settings/mailingList` (`dailyCap`, default 20, editable from
      the Firestore console without a redeploy). Implemented in
      `src/lib/mailing-list.ts` (`tryConsumeDailySignupCap`), wired into
      `src/pages/api/subscribe.ts`. Done 2026-09-15.
- [x] Stop resending the confirmation email on repeat submission of a
      still-pending address — per Wes: no automatic resend at all; only via
      an explicit admin action. Interest-tag merging is preserved (silent,
      no email) since it carries no abuse risk. Done 2026-09-15.
- [ ] Per-email throttle: not needed as a separate mechanism — covered by the
      "no auto-resend for pending" + "409 for confirmed" behavior above.
- [ ] Keep the existing per-IP hourly limit as-is (harmless, still stops
      single-source scripts) — not attempting to fix the in-memory/cold-start
      issue separately since BotID + the global cap make it moot.
- [x] Add admin "Resend" button + `/api/admin/mailing-list-action.ts` endpoint
      (action: `resend-confirmation`) on `/admin/mailing-list`, following the
      `vendor-action.ts` / `delete-subscriber.ts` pattern. Done 2026-09-15.

### 2. BotID (Vercel) on the subscribe endpoint
- [x] `botid` added to `package.json` — run `npm install` to pull it down locally.
- [x] `vercel.json` rewrites/headers added for the BotID proxy (fixed values
      from Vercel's own docs, not project-specific).
- [x] Client-side `initBotId({ protect: [{ path: '/api/subscribe', method: 'POST' }] })`
      added in `src/layouts/BaseLayout.astro`, loaded site-wide (covers
      `MailingListBanner.astro`, `call-for-bands/index.astro`, and any other
      form posting to `/api/subscribe`).
- [x] Server-side `checkBotId()` added in `src/pages/api/subscribe.ts`; on
      `isBot`, returns the same silent-success response used by the other
      guards (no signal, no DB write, no email). Done 2026-09-15.
- [ ] Run `npm install` (Wes, locally) before the next deploy.
- [ ] Test in production after deploy — BotID only activates on real page
      sessions (not curl/direct hits), so verify via the actual signup form.
- [ ] Note: "Bot Management" (off/log/challenge) in the Firewall dashboard is
      a *different*, separate heuristic feature — not BotID. Left untouched.
      BotID's only dashboard-side option is optional paid "Deep Analysis"
      (Firewall → Rules → Managed Rulesets) — not needed for this fix.

## Open questions (asking Wes before writing code)
- [ ] Rough daily volume of *genuine* signups, to size the global daily cap sensibly.
- [ ] How long to suppress confirmation re-sends for a repeat "pending" submission
      of the same address.

## Rollout
- Dry-run diff review on every file edit before applying (per usual workflow).
- Wes runs `git add . && git commit -m "..." && git push` himself.
- Small resumable steps, checked off above as completed.
