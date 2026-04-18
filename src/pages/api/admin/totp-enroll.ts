import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import {
  generateTotpSecret,
  encryptSecret,
  buildOtpauthUri,
} from '../../../lib/totp';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return json({ error: 'No token provided' }, 400);
    }

    // Verify the Firebase ID token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid     = decoded.uid;
    const email   = decoded.email ?? '';

    // Check if already enrolled — don't overwrite a live secret
    const docRef  = adminDb.collection('admin_users').doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists && docSnap.data()?.totpEnrolled === true) {
      return json({ error: 'Already enrolled' }, 409);
    }

    // Generate a fresh secret and store it (not yet confirmed enrolled)
    const secret    = generateTotpSecret();
    const encrypted = encryptSecret(secret);

    await docRef.set(
      {
        uid,
        email,
        totpSecret:   encrypted,
        totpEnrolled: false,
        updatedAt:    new Date(),
      },
      { merge: true },
    );

    // Return the otpauth URI — QR code is generated client-side
    const otpauthUri = buildOtpauthUri(secret, email);
    return json({ otpauthUri });

  } catch (err) {
    console.error('totp-enroll error:', err);
    return json({ error: 'Enrollment failed' }, 500);
  }
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
