import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  // ── Auth ──────────────────────────────────────────────────────────
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const ref = adminDb.collection('settings').doc('bands');
    const snap = await ref.get();
    const current = snap.exists ? snap.data()?.applicationsOpen !== false : true;
    const next = !current;

    await ref.set({ applicationsOpen: next }, { merge: true });

    return new Response(JSON.stringify({ success: true, applicationsOpen: next }), { status: 200 });
  } catch (err) {
    console.error('toggle-band-applications error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
