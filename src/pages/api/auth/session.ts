import type { APIRoute } from 'astro';
import { adminAuth } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return new Response(JSON.stringify({ error: 'No token provided' }), { status: 400 });
    }

    // 5-day session
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Session creation failed:', error);
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
};
