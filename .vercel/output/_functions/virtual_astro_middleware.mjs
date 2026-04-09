import { a6 as defineMiddleware, af as sequence } from './chunks/sequence_B8w407xz.mjs';
import 'piccolore';
import 'clsx';

const onRequest$1 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin" || pathname === "/admin/";
  if (isAdminRoute && !isLoginPage) {
    const sessionCookie = context.cookies.get("session")?.value;
    if (!sessionCookie) {
      return context.redirect("/admin");
    }
    try {
      const { adminAuth } = await import('./chunks/firebase-admin_xK7nQJo9.mjs');
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      context.locals.user = decoded;
      if (pathname.startsWith("/admin/users")) {
        const claims = decoded.customClaims;
        if (claims?.role !== "super_admin") {
          return context.redirect("/admin/dashboard");
        }
      }
    } catch {
      context.cookies.delete("session", { path: "/" });
      return context.redirect("/admin");
    }
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
