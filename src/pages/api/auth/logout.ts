import type { APIRoute } from 'astro';
import { adminAuth } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ cookies }) => {
  const sessionCookie = cookies.get('session')?.value;

  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decoded.uid);
    } catch {
      // Cookie is invalid/expired — still clear it
    }
  }

  cookies.delete('session', { path: '/' });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
