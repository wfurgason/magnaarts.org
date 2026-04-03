import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name    = data.get('name')?.toString().trim()    ?? '';
    const email   = data.get('email')?.toString().trim()   ?? '';
    const subject = data.get('subject')?.toString().trim() ?? 'General question';
    const message = data.get('message')?.toString().trim() ?? '';

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await resend.emails.send({
      from: 'Magna Arts Council <wfurgason@magnaarts.org>',
      to:   'wfurgason@gmail.com',
      replyTo: email,
      subject: `[Contact] ${subject} — from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
