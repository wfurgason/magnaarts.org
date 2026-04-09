import { Resend } from 'resend';

const resend = new Resend("re_UPW4jASQ_78DhysdHmQCHqWYwcyMYxTqm");
const POST = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get("name")?.toString().trim() ?? "";
    const email = data.get("email")?.toString().trim() ?? "";
    const subject = data.get("subject")?.toString().trim() ?? "General question";
    const message = data.get("message")?.toString().trim() ?? "";
    const honeypot = data.get("contact_url")?.toString() ?? "";
    if (honeypot) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await resend.emails.send({
      from: "Magna Arts Council <wfurgason@magnaarts.org>",
      to: "wfurgason@gmail.com",
      replyTo: email,
      subject: `[Contact] ${subject} — from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `
    });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response(JSON.stringify({ error: "Failed to send. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
