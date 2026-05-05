import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

async function sendEmail(opts: { to: string; subject: string; text: string }): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const from   = 'Magna Arts <noreply@magnaarts.org>';
  if (!apiKey) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: opts.to, subject: opts.subject, text: opts.text }),
  });
}

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization') ?? '';
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { bandId } = await request.json();
    if (!bandId) {
      return new Response(JSON.stringify({ error: 'bandId required' }), { status: 400 });
    }

    const artistRef  = adminDb.collection('artists').doc(bandId);
    const artistSnap = await artistRef.get();
    if (!artistSnap.exists) {
      return new Response(JSON.stringify({ error: 'Artist not found' }), { status: 404 });
    }
    const artist = artistSnap.data()!;
    if (artist.uid !== uid) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }
    if (artist.status !== 'pending_review') {
      return new Response(JSON.stringify({ error: 'Profile is not in pending_review status' }), { status: 400 });
    }

    await artistRef.update({ submittedForReviewAt: FieldValue.serverTimestamp() });

    const adminEmail = import.meta.env.ADMIN_EMAIL ?? 'admin@magnaarts.org';
    const artistType = artist.artistType === 'visual' ? 'visual artist' : 'music artist';
    const siteUrl    = import.meta.env.SITE_URL || 'https://magnaarts.org';

    await sendEmail({
      to:      adminEmail,
      subject: `Artist profile ready for review — ${artist.band_name}`,
      text:    `${artist.band_name} has finished setting up their ${artistType} profile and is ready for review.\n\nReview at: ${siteUrl}/admin/artists`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('submit-for-review error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
