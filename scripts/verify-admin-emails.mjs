/**
 * One-off script: mark admin user emails as verified in Firebase.
 *
 * Usage (from project root):
 *   node scripts/verify-admin-emails.mjs
 *
 * Reads FIREBASE_* vars from .env automatically via --env-file flag,
 * or export them in your shell before running.
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Load .env manually (Node 18 doesn't support --env-file in all versions) ──
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');

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

const app  = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const auth = getAuth(app);

// ── List all users and mark unverified ones ───────────────────────────────────
async function run() {
  console.log('Fetching users from Firebase...\n');

  const result = await auth.listUsers();
  const users  = result.users;

  console.log(`Found ${users.length} user(s):\n`);

  for (const user of users) {
    const status = user.emailVerified ? '✓ already verified' : '✗ NOT verified';
    console.log(`  ${user.email} — ${status}`);
  }

  const unverified = users.filter(u => !u.emailVerified);

  if (unverified.length === 0) {
    console.log('\nAll users are already verified. Nothing to do.');
    return;
  }

  console.log(`\nMarking ${unverified.length} user(s) as email-verified...`);

  for (const user of unverified) {
    await auth.updateUser(user.uid, { emailVerified: true });
    console.log(`  ✓ ${user.email}`);
  }

  console.log('\nDone. All admin emails are now marked as verified in Firebase.');
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
