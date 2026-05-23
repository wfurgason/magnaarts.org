import type { APIRoute } from 'astro';
import { adminDb } from '../../lib/firebase-admin';

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(null, { status: 302, headers: { Location: '/confirm?error=invalid' } });
  }

  try {
    const snap = await adminDb
      .collection('mailingList')
      .where('token', '==', token)
      .limit(1)
      .get();

    if (snap.empty) {
      return new Response(null, { status: 302, headers: { Location: '/confirm?error=invalid' } });
    }

    const doc = snap.docs[0];
    if (doc.data().status === 'confirmed') {
      return new Response(null, { status: 302, headers: { Location: '/confirm?status=already' } });
    }

    // Reject tokens older than 48 hours
    const subscribedAt = doc.data().subscribedAt?.toDate?.() ?? null;
    const ageMs = subscribedAt ? Date.now() - subscribedAt.getTime() : Infinity;
    if (ageMs > 48 * 60 * 60 * 1000) {
      return new Response(null, { status: 302, headers: { Location: '/confirm?error=expired' } });
    }

    await doc.ref.update({ status: 'confirmed', confirmedAt: new Date() });

    return new Response(null, { status: 302, headers: { Location: '/confirm?status=success' } });
  } catch (err) {
    console.error('confirm error:', err);
    return new Response(null, { status: 302, headers: { Location: '/confirm?error=server' } });
  }
};
