/**
 * list-events.mjs
 * Lists all published events (title + date) from Firestore.
 * Run from the project root:  node scripts/list-events.mjs
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ── Load .env ─────────────────────────────────────────────────────────────────
const root = process.cwd();
const envPath = ['.env.local', '.env']
  .map(f => resolve(root, f))
  .find(p => { try { readFileSync(p); return true; } catch { return false; } });

if (!envPath) {
  console.error('❌  Could not find .env or .env.local in', root);
  process.exit(1);
}

const env = {};
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  const key = trimmed.slice(0, eq).trim();
  const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = val;
}

// ── Init Firebase Admin ───────────────────────────────────────────────────────
const projectId   = env.FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
const privateKey  = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('❌  Missing Firebase env vars.');
  process.exit(1);
}

const app = getApps().length === 0
  ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  : getApps()[0];

const db = getFirestore(app);

// ── Query and print ───────────────────────────────────────────────────────────
const snap = await db.collection('events').get();

if (snap.empty) {
  console.log('No events found.');
  process.exit(0);
}

const events = snap.docs.map(doc => {
  const d = doc.data();
  const date = d.eventDate?.toDate ? d.eventDate.toDate() : new Date(d.eventDate);
  return { title: d.title ?? '(no title)', date, status: d.status ?? '(none)' };
}).sort((a, b) => a.date - b.date);

console.log(`\n${events.length} event(s) in the events collection:\n`);
for (const e of events) {
  const label = e.date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  console.log(`  ${label.padEnd(28)}  [${e.status.padEnd(12)}]  ${e.title}`);
}
console.log();
