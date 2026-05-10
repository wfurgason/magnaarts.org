/**
 * confirm-pending.mjs
 * Manually confirms all pending mailing list subscribers in Firestore.
 * Run from the project root:  node scripts/confirm-pending.mjs
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ── Load .env manually (no dotenv dependency needed) ─────────────────────────
// Try .env.local first (Astro's preferred local override), fall back to .env
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
  console.error('❌  Missing Firebase env vars. Check your .env file.');
  process.exit(1);
}

const app = getApps().length === 0
  ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  : getApps()[0];

const db = getFirestore(app);

// ── Confirm pending subscribers ───────────────────────────────────────────────
const snap = await db.collection('mailingList').where('status', '==', 'pending').get();

if (snap.empty) {
  console.log('✅  No pending subscribers found.');
  process.exit(0);
}

console.log(`Found ${snap.size} pending subscriber(s):\n`);

for (const doc of snap.docs) {
  const { email } = doc.data();
  await doc.ref.update({ status: 'confirmed', confirmedAt: new Date() });
  console.log(`  ✓  ${email}`);
}

console.log('\nDone.');
