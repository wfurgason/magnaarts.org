# Plan: Mailing List 48-Hour Confirmation Expiry

**Goal:** Unconfirmed (`pending`) mailing list subscribers are automatically purged
after 48 hours. Expired tokens are rejected at confirmation time. The admin portal
shows which pending records are expired and provides a manual purge button.

**Status:** Not started

---

## Background

The `mailingList` Firestore collection stores subscribers with these fields:
- `email` — subscriber address
- `status` — `'pending'` or `'confirmed'`
- `token` — UUID used in the confirmation link
- `subscribedAt` — Firestore Timestamp (set on signup)
- `confirmedAt` — Firestore Timestamp (set on confirm) or `null`

The double opt-in flow:
1. User submits email → `subscribe.ts` writes a `pending` doc + sends confirmation email
2. User clicks link → `confirm.ts` verifies token → sets `status: 'confirmed'`

A large number of `pending` records exist because of a list-bombing attack. Double
opt-in protected confirmed subscribers, but the unconfirmed records need to be cleaned
up and prevented from accumulating further.

---

## New Environment Variable

| Variable | Description |
|---|---|
| `CRON_SECRET` | Random secret string; sent as `Authorization` header by the Vercel cron job to authenticate the purge endpoint |

**Suggested value** (generate your own or use this):
```
cron_mla_8f3k2p9xQvNtLwZdY7hJbRmCeAuGsT4
```

Add this to Vercel: Project → Settings → Environment Variables → Add New.
Also add it to your local `.env` file for testing.

---

## Chunks

---

### Chunk 1 — Create `purge-expired-subscribers.ts`
**File:** `src/pages/api/admin/purge-expired-subscribers.ts`
**Method:** GET
**Auth:** `Authorization: Bearer <CRON_SECRET>` header check (for cron);
also accepts a valid admin session cookie (for manual use from the admin UI)

**Logic:**
- Calculate cutoff = now minus 48 hours
- Query `mailingList` where `status == 'pending'`
- Filter in JS for docs where `subscribedAt` is before the cutoff
- Delete all matching docs in a Firestore batch
- Return JSON `{ deleted: N }`

**Status:** [ ] Not started

---

### Chunk 2 — Update `confirm.ts`
**File:** `src/pages/api/confirm.ts`
**Change:** Before confirming, check if `subscribedAt` is older than 48 hours.
If expired → redirect to `/confirm?error=expired` instead of confirming.

**Logic to add** (after the `snap.empty` check):
```
const subscribedAt = doc.data().subscribedAt?.toDate?.() ?? null;
const ageMs = subscribedAt ? Date.now() - subscribedAt.getTime() : Infinity;
if (ageMs > 48 * 60 * 60 * 1000) {
  return redirect to /confirm?error=expired
}
```

**Status:** [ ] Not started

---

### Chunk 3 — Update `confirm.astro`
**File:** `src/pages/confirm.astro`
**Change:** Add a new card for `error === 'expired'`.

**UI copy:**
- Icon: ⏰
- Heading: "Confirmation link expired"
- Message: "This confirmation link has expired (links are valid for 48 hours).
  If you'd still like to subscribe, sign up again using the form on our site."
- Button: "Back to Home" → `/`

**Status:** [ ] Not started

---

### Chunk 4 — Update `subscribe.ts`
**File:** `src/pages/api/subscribe.ts`
**Change:** When a `pending` record already exists for an email and the user signs
up again, reset `subscribedAt` to `new Date()` before resending the confirmation
email. This gives the user a fresh 48-hour window after re-subscribing.

**Current behavior:** Resends the email but does not update `subscribedAt`,
so the token could still expire before they click.

**Logic change** (in the "Resend confirmation for pending" branch):
```
await existing.docs[0].ref.update({ subscribedAt: new Date() });
// then send confirmation email
```

**Status:** [ ] Not started

---

### Chunk 5 — Update `mailing-list.astro`
**File:** `src/pages/admin/mailing-list.astro`

**Two changes:**

#### 5a — Expired badge
In the server frontmatter, compute `isExpired` for each subscriber:
- A pending record is "expired" if `subscribedAt` is older than 48 hours
- Add an `expired` boolean to the mapped subscriber object
- In the table, if `s.status === 'pending'` and `s.expired`, show a red
  `expired` badge instead of (or alongside) the yellow `pending` badge

#### 5b — Purge Expired button
- Add a "Purge Expired" button in the `header-actions` bar
- On click, POST to `/api/admin/purge-expired-subscribers`
- Show a simple confirm dialog first: "Remove all expired pending subscribers?"
- On success, reload the page and show the count deleted

**Status:** [ ] Not started

---

### Chunk 6 — Create `vercel.json`
**File:** `vercel.json` (project root)
**Purpose:** Configure the Vercel cron job to call the purge endpoint once daily.

**Structure:**
```json
{
  "crons": [
    {
      "path": "/api/admin/purge-expired-subscribers",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Schedule: `0 3 * * *` = 3:00 AM UTC daily (8 PM or 9 PM Mountain, depending on DST).

**How Vercel authenticates the cron call:**
Vercel automatically sends a `Authorization: Bearer <CRON_SECRET>` header on cron
invocations when `CRON_SECRET` is set as an environment variable. The endpoint
checks for this header.

**Status:** [ ] Not started

---

## Completion Checklist

- [ ] Chunk 1 — `purge-expired-subscribers.ts` created and tested
- [ ] Chunk 2 — `confirm.ts` expiry check added
- [ ] Chunk 3 — `confirm.astro` expired card added
- [ ] Chunk 4 — `subscribe.ts` `subscribedAt` reset on resend
- [ ] Chunk 5a — Expired badge in `mailing-list.astro`
- [ ] Chunk 5b — Purge button in `mailing-list.astro`
- [ ] Chunk 6 — `vercel.json` cron job created
- [ ] `CRON_SECRET` added to Vercel environment variables
- [ ] `CRON_SECRET` added to local `.env` for testing
- [ ] Deployed and verified on live site

---

## Order of Operations (safe to do in any session)

Each chunk is independent and safe to implement one at a time. Recommended order
matches the chunk numbers. Chunks 2 and 4 are the highest priority — they prevent
new expired tokens from being accepted and fix the resend window immediately.
