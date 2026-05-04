/**
 * migrate-event-fields.ts
 *
 * One-time migration: removes alias fields from all docs in the `events`
 * collection that were written by older publish endpoints.
 *
 * Alias fields being removed:
 *   startTime   → canonical: eventTime
 *   venue       → canonical: venueName
 *   address     → canonical: venueAddress
 *   photoUrl    → canonical: posterUrl
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/migrate-event-fields.ts
 *
 * Safe to run multiple times — FieldValue.delete() on a non-existent field
 * is a no-op.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load service account — adjust path if yours is elsewhere
const serviceAccount = JSON.parse(
  readFileSync(resolve(process.cwd(), 'service-account.json'), 'utf-8')
);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

const ALIAS_FIELDS = ['startTime', 'venue', 'address', 'photoUrl'];

async function migrate() {
  const snap = await db.collection('events').get();
  console.log(`Found ${snap.size} event docs.`);

  let updated = 0;
  let skipped = 0;
  const batch = db.batch();

  for (const doc of snap.docs) {
    const data = doc.data();
    const hasAlias = ALIAS_FIELDS.some(f => f in data);

    if (!hasAlias) {
      skipped++;
      continue;
    }

    const updates: Record<string, any> = {};
    for (const field of ALIAS_FIELDS) {
      if (field in data) {
        updates[field] = FieldValue.delete();
      }
    }

    batch.update(doc.ref, updates);
    updated++;
    console.log(`  Queued cleanup for: ${doc.id} (${Object.keys(updates).join(', ')})`);
  }

  if (updated === 0) {
    console.log('Nothing to migrate — all docs already clean.');
    return;
  }

  await batch.commit();
  console.log(`\nDone. Updated: ${updated}, Skipped (already clean): ${skipped}`);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
