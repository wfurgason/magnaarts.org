/**
 * One-off migration: strip redundant band-detail fields from park_events shell docs.
 *
 * After the band-data-flow refactor, `park_events` shells only need:
 *   bandId, bandName, bandConfirmed, assignedAt
 * These fields were previously copied at assign-time but are now sourced
 * exclusively from `band_applications` at publish-time:
 *   bandEmail, bandPhone, bandBio, bandGenre, bandWebsite, bandMusicLink, bandPhotoUrl
 *
 * Usage (from project root):
 *   node scripts/migrate-strip-shell-band-fields.mjs          # live run
 *   node scripts/migrate-strip-shell-band-fields.mjs --dry-run # preview only
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const DRY_RUN = process.argv.includes('--dry-run');

// ── Load .env ─────────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath   = resolve(__dirname, '../.env');

try {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.log('.env not found — using environment variables already set in shell.');
}

// ── Init Firebase Admin ───────────────────────────────────────────────────────
const projectId   = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY.');
  process.exit(1);
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

// ── Fields to remove ─────────────────────────────────────────────────────────
const STALE_FIELDS = [
  'bandEmail',
  'bandPhone',
  'bandBio',
  'bandGenre',
  'bandWebsite',
  'bandMusicLink',
  'bandPhotoUrl',
];

// ── Run ───────────────────────────────────────────────────────────────────────
async function run() {
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN — no writes will be made.\n');
  }

  console.log('Fetching all park_events documents...\n');
  const snap = await db.collection('park_events').get();
  console.log(`Found ${snap.size} park_events doc(s) total.\n`);

  const toUpdate = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    const presentStale = STALE_FIELDS.filter(f => f in data);
    if (presentStale.length > 0) {
      toUpdate.push({ id: doc.id, ref: doc.ref, fields: presentStale, bandName: data.bandName || '(no band)' });
    }
  }

  if (toUpdate.length === 0) {
    console.log('✅ No stale fields found. Nothing to migrate.');
    return;
  }

  console.log(`Found ${toUpdate.length} doc(s) with stale fields:\n`);
  for (const item of toUpdate) {
    console.log(`  [${item.id}]  ${item.bandName}`);
    for (const f of item.fields) {
      console.log(`    — ${f}`);
    }
  }

  if (DRY_RUN) {
    console.log('\nDry run complete. Re-run without --dry-run to apply changes.');
    return;
  }

  console.log('\nStripping stale fields...\n');

  // Firestore batch limit is 500 — safe here, but chunk anyway for correctness
  const BATCH_SIZE = 400;
  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    const chunk = toUpdate.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    for (const item of chunk) {
      const update = {};
      for (const f of item.fields) {
        update[f] = FieldValue.delete();
      }
      batch.update(item.ref, update);
    }
    await batch.commit();
    console.log(`  Committed batch of ${chunk.length} update(s).`);
  }

  console.log(`\n✅ Done. Stripped stale fields from ${toUpdate.length} park_events doc(s).`);
}

run().catch(err => {
  console.error('Migration error:', err.message);
  process.exit(1);
});
