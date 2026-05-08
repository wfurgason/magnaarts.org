/**
 * seed-past-events.mjs
 *
 * One-time backfill script — adds Lens of Magna and Writing Conference
 * to the Firestore `events` collection so they appear in grant stats.
 *
 * Usage (from project root):
 *   node seed-past-events.mjs
 *
 * Safe to re-run: checks for existing docs before inserting.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp }       from 'firebase-admin/firestore';
import { createRequire }                  from 'module';
import { readFileSync }                   from 'fs';
import { resolve, dirname }               from 'path';
import { fileURLToPath }                  from 'url';

// ── Load .env manually (no dotenv dependency needed) ──
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath   = resolve(__dirname, '.env.local');

try {
  const envFile = readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val    = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes if present
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
  console.log('✓ Loaded .env');
} catch {
  console.warn('⚠ Could not read .env — relying on existing environment variables.');
}

// ── Init Firebase Admin ──
const projectId   = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Missing Firebase Admin env vars. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');
  process.exit(1);
}

const app = getApps().length === 0
  ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  : getApps()[0];

const db = getFirestore(app);

// ── Events to seed ──
const EVENTS = [
  {
    id:             'lens-of-magna-2026',
    title:          'Lens of Magna — Main Photo Exhibition 2026',
    eventType:      'lens_of_magna',
    submissionType: 'lens_of_magna',
    eventDate:      Timestamp.fromDate(new Date('2026-04-16T18:00:00')),
    venue:          'Magna Branch — Salt Lake County Library',
    description:    'Public reception showcasing entries from the 3rd annual Lens of Magna Main Street Photography Contest. 104 submissions. $2,875 in prizes awarded across Youth, Amateur, and Professional categories.',
    status:         'published',
    publishedAt:    Timestamp.now(),
    source:         'manual-backfill',
  },
  {
    id:             'magna-writing-conference-2026',
    title:          'Magna Writing Conference 2026',
    eventType:      'writing_conference',
    submissionType: 'writing_conference',
    eventDate:      Timestamp.fromDate(new Date('2026-04-25T13:00:00')),
    venue:          'Magna Branch — Salt Lake County Library',
    description:    'Free mini writing conference on the fundamentals of writing. Keynote by Jodi L. Milner. Six workshops covering story structure, character development, world building, plotting, and screenwriting. Special teen workshop included.',
    status:         'published',
    publishedAt:    Timestamp.now(),
    source:         'manual-backfill',
  },
];

// ── Insert (idempotent) ──
async function seed() {
  const col = db.collection('events');

  for (const event of EVENTS) {
    const { id, ...data } = event;
    const ref = col.doc(id);
    const existing = await ref.get();

    if (existing.exists) {
      console.log(`⏭  Skipped  "${data.title}" — already exists (${id})`);
    } else {
      await ref.set(data);
      console.log(`✅ Inserted "${data.title}" → events/${id}`);
    }
  }

  console.log('\nDone. You can delete this script when the backfill is confirmed in the dashboard.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
