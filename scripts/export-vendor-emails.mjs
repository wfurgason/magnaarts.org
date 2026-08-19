/**
 * One-off script: export emails of paid/confirmed Arts Festival vendors to a .txt file.
 *
 * Usage (from project root):
 *   node scripts/export-vendor-emails.mjs
 *
 * Reads FIREBASE_* vars from .env.local automatically.
 * Output written to: vendor-emails.txt (project root)
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Load .env.local manually ──────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

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
  console.log('.env.local not found — using environment variables already set in shell.');
}

// ── Init Firebase Admin ──────────────────────────────────────────────────
const projectId   = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY.');
  process.exit(1);
}

const app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db  = getFirestore(app);

// ── Fetch paid vendors and export emails ──────────────────────────────────
async function run() {
  console.log('Fetching paid/confirmed vendors from Firestore...\n');

  const snap = await db.collection('vendor_applications').where('status', '==', 'paid').get();

  if (snap.empty) {
    console.log('No paid vendors found.');
    return;
  }

  const rows = [];
  snap.forEach((doc) => {
    const v = doc.data();
    if (v.email) {
      rows.push({ email: v.email.trim(), company: v.company_name || '', space: v.space_number || '' });
    }
  });

  // Sort by company name for readability
  rows.sort((a, b) => a.company.localeCompare(b.company));

  const outPath = resolve(__dirname, '../vendor-emails.txt');
  const lines = rows.map(r => r.email);
  writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');

  console.log(`Found ${rows.length} paid vendor(s):\n`);
  for (const r of rows) {
    console.log(`  ${r.email}  (${r.company}, space ${r.space})`);
  }

  console.log(`\nDone. Emails written to: ${outPath}`);
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
