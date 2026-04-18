import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { decryptSecret, verifyTotpCode } from '../../../lib/totp';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { idToken, code } = await request.json();

    if (!idToken || !code) {
      return json({ error: 'Missing idToken or code' }, 400);
    }

    // Verify the Firebase ID token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid     = decoded.uid;

    // Look up the stored (encrypted) secret
    const docRef  = adminDb.collection('admin_users').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists || !docSnap.data()?.totpSecret) {
      return json({ error: 'No TOTP secret found — please enroll first' }, 404);
    }

    const data          = docSnap.data()!;
    const encryptedSecret = data.totpSecret as string;

    let secret: string;
    try {
      secret = decryptSecret(encryptedSecret);
    } catch {
      return json({ error: 'Failed to decrypt TOTP secret' }, 500);
    }

    // Verify the submitted code
    const valid = verifyTotpCode(code.trim(), secret);
    if (!valid) {
      return json({ error: 'Invalid or expired code' }, 401);
    }

    // If this was an enrollment confirmation, mark the user as enrolled
    if (!data.totpEnrolled) {
      await docRef.set({ totpEnrolled: true, enrolledAt: new Date() }, { merge: true });
    }

    // Issue the session cookie (5-day expiry)
    const expiresIn    = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure:   import.meta.env.PROD,
      sameSite: 'lax',
      path:     '/',
      maxAge:   expiresIn / 1000,
    });

    return json({ success: true });
  } catch (err) {
    console.error('totp-verify error:', err);
    return json({ error: 'Verification failed' }, 500);
  }
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
