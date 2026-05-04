import type { APIRoute } from 'astro';
import { adminDb } from '../../lib/firebase-admin';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const token = data.token?.toString().trim() ?? '';

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token required.' }), { status: 400 });
    }

    const snap = await adminDb
      .collection('mailingList')
      .where('token', '==', token)
      .limit(1)
      .get();

    if (snap.empty) {
      return new Response(JSON.stringify({ error: 'Not found.' }), { status: 404 });
    }

    await snap.docs[0].ref.delete();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('unsubscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
  }
};
