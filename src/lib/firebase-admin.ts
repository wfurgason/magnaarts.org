import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

try {
  const projectId   = import.meta.env.FIREBASE_PROJECT_ID;
  const clientEmail = import.meta.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin environment variables');
  }

  const apps = getApps();
  adminApp = apps.length === 0
    ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    : apps[0];

} catch (e) {
  // This will happen on public pages if env vars aren't set.
  // Admin pages will handle the null case — public pages don't use this at all.
  console.warn('Firebase Admin SDK not initialized:', (e as Error).message);
}

export const adminAuth = adminApp ? getAuth(adminApp) : null as any;
export const adminDb   = adminApp ? getFirestore(adminApp) : null as any;
