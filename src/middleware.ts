import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Login page is public; all other /admin/* routes are protected
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin' || pathname === '/admin/';

  if (isAdminRoute && !isLoginPage) {
    const sessionCookie = context.cookies.get('session')?.value;

    if (!sessionCookie) {
      return context.redirect('/admin');
    }

    try {
      // Import lazily so Firebase Admin only initializes on /admin/* routes,
      // not on every public page like /events
      const { adminAuth } = await import('./lib/firebase-admin');
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      // Attach user to locals for use in pages
      context.locals.user = decoded;

      // Users page is super_admin only
      if (pathname.startsWith('/admin/users')) {
        const claims = decoded.customClaims as Record<string, string> | undefined;
        if (claims?.role !== 'super_admin') {
          return context.redirect('/admin/dashboard');
        }
      }
    } catch {
      context.cookies.delete('session', { path: '/' });
      return context.redirect('/admin');
    }
  }

  return next();
});
