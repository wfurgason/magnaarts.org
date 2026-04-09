import { adminAuth } from './firebase-admin_xK7nQJo9.mjs';

const POST = async ({ request, cookies }) => {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return new Response(JSON.stringify({ error: "No token provided" }), { status: 400 });
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1e3;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1e3
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Session creation failed:", error);
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
