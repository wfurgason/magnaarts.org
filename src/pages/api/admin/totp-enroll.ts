import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import {
  generateTotpSecret,
  encryptSecret,
  buildOtpauthUri,
  generateQrDataUrl,
} from '../../../lib/totp';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return json({ error: 'No token provided' }, 400);
    }

    // Step 1: Verify the Firebase ID token
    let decoded: Awaited<ReturnType<typeof adminAuth.verifyIdToken>>;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch (e) {
      console.error('totp-enroll [step 1 verifyIdToken]:', e);
      return json({ error: 'Token verification failed' }, 401);
    }

    const uid   = decoded.uid;
    const email = decoded.email ?? '';

    // Step 2: Check if already enrolled
    let docSnap: FirebaseFirestore.DocumentSnapshot;
    try {
      const docRef = adminDb.collection('admin_users').doc(uid);
      docSnap = await docRef.get();
      if (docSnap.exists && docSnap.data()?.totpEnrolled === true) {
        return json({ error: 'Already enrolled' }, 409);
      }
    } catch (e) {
      console.error('totp-enroll [step 2 Firestore read]:', e);
      return json({ error: 'Firestore read failed' }, 500);
    }

    // Step 3: Generate TOTP secret
    let secret: string;
    try {
      secret = generateTotpSecret();
      console.log('totp-enroll [step 3] secret generated OK');
    } catch (e) {
      console.error('totp-enroll [step 3 generateTotpSecret]:', e);
      return json({ error: 'Secret generation failed' }, 500);
    }

    // Step 4: Encrypt the secret
    let encrypted: string;
    try {
      encrypted = encryptSecret(secret);
      console.log('totp-enroll [step 4] secret encrypted OK');
    } catch (e) {
      console.error('totp-enroll [step 4 encryptSecret]:', e);
      return json({ error: 'Secret encryption failed' }, 500);
    }

    // Step 5: Write to Firestore
    try {
      const docRef = adminDb.collection('admin_users').doc(uid);
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
      console.log('totp-enroll [step 5] Firestore write OK');
    } catch (e) {
      console.error('totp-enroll [step 5 Firestore write]:', e);
      return json({ error: 'Firestore write failed' }, 500);
    }

    // Step 6: Build otpauth URI and QR code
    let qrDataUrl: string;
    let otpauthUri: string;
    try {
      otpauthUri = buildOtpauthUri(secret, email);
      qrDataUrl  = await generateQrDataUrl(otpauthUri);
      console.log('totp-enroll [step 6] QR generated OK');
    } catch (e) {
      console.error('totp-enroll [step 6 QR generation]:', e);
      return json({ error: 'QR generation failed' }, 500);
    }

    return json({ qrDataUrl, otpauthUri });
  } catch (err) {
    console.error('totp-enroll [unhandled]:', err);
    return json({ error: 'Enrollment failed' }, 500);
  }
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
