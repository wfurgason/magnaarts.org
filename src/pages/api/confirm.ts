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

    await doc.ref.update({ status: 'confirmed', confirmedAt: new Date() });

    return new Response(null, { status: 302, headers: { Location: '/confirm?status=success' } });
  } catch (err) {
    console.error('confirm error:', err);
    return new Response(null, { status: 302, headers: { Location: '/confirm?error=server' } });
  }
};
