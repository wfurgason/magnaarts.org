import type { APIRoute } from 'astro';
import { adminDb } from '../../lib/firebase-admin';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const email = data.email?.toString().trim().toLowerCase() ?? '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email required.' }), { status: 400 });
    }

    // Check for existing subscriber
    const existing = await adminDb
      .collection('mailingList')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existing.empty) {
      const sub = existing.docs[0].data();
      if (sub.status === 'confirmed') {
        return new Response(JSON.stringify({ error: 'already_subscribed' }), { status: 409 });
      }
      // Resend confirmation for pending
      const token = sub.token;
      await sendConfirmationEmail(email, token);
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const token = randomUUID();
    await adminDb.collection('mailingList').add({
      email,
      status: 'pending',
      token,
      subscribedAt: new Date(),
      confirmedAt: null,
    });

    await sendConfirmationEmail(email, token);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error.' }), { status: 500 });
  }
};

async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${import.meta.env.SITE_URL}/api/confirm?token=${token}`;
  await resend.emails.send({
    from: 'Magna Arts Council <noreply@magnaarts.org>',
    to: email,
    subject: 'Confirm your subscription — Magna Arts Council',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Almost there!</h2>
        <p>Thanks for signing up for updates from Magna Arts Council. Click the button below to confirm your email address.</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${confirmUrl}"
             style="background:#1a1a2e; color:#fff; padding:14px 28px; border-radius:6px; text-decoration:none; font-weight:bold;">
            Confirm Subscription
          </a>
        </p>
        <p style="font-size: 0.85em; color: #666;">If you didn't sign up for this, you can safely ignore this email.</p>
        <p style="font-size: 0.85em; color: #666;">Or copy this link: ${confirmUrl}</p>
      </div>
    `,
  });
}
