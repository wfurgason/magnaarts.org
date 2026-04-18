import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return json({ error: 'No token provided' }, 400);
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid     = decoded.uid;

    const docSnap = await adminDb.collection('admin_users').doc(uid).get();
    const enrolled = docSnap.exists && docSnap.data()?.totpEnrolled === true;

    return json({ enrolled });
  } catch (err) {
    console.error('totp-status error:', err);
    return json({ error: 'Status check failed' }, 500);
  }
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
