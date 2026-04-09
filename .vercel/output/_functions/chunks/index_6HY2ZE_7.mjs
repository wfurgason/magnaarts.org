import { c as createComponent } from './astro-component_CdpYp1nz.mjs';
import 'piccolore';
import { L as renderTemplate, b7 as defineScriptVars, b9 as renderHead } from './sequence_B8w407xz.mjs';
import 'clsx';
/* empty css                */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const sessionCookie = Astro2.cookies.get("session")?.value;
  if (sessionCookie) {
    try {
      const { adminAuth } = await import('./firebase-admin_xK7nQJo9.mjs');
      await adminAuth.verifySessionCookie(sessionCookie, true);
      return Astro2.redirect("/admin/dashboard");
    } catch {
      Astro2.cookies.delete("session", { path: "/" });
    }
  }
  const firebaseConfig = {
    apiKey: "AIzaSyAP3QgOUeZ1ruwoUxOROvKw1JXpTxYAIQg",
    authDomain: "magnaarts.firebaseapp.com",
    projectId: "magnaarts"
  };
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Login — Magna Arts</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">', '</head> <body class="admin-login-body"> <div class="login-card"> <div class="login-logo"> <img src="/images/ArtsCouncil_logo.png" alt="Magna Arts Council"> <span class="login-logo-text">Magna Arts Council</span> <span class="login-logo-sub">Board Portal</span> </div> <form id="login-form" novalidate> <div class="field-group"> <label for="email">Email</label> <input type="email" id="email" name="email" required autocomplete="email"> </div> <div class="field-group"> <label for="password">Password</label> <input type="password" id="password" name="password" required autocomplete="current-password"> </div> <div id="login-error" class="error-msg" hidden></div> <button type="submit" class="btn btn-primary btn-full" id="login-btn">\nSign In\n</button> </form> </div> <script type="module">', "\n    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';\n    import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';\n\n    const app = initializeApp(firebaseConfig);\n    const auth = getAuth(app);\n\n    const form = document.getElementById('login-form');\n    const errorEl = document.getElementById('login-error');\n    const btn = document.getElementById('login-btn');\n\n    form.addEventListener('submit', async (e) => {\n      e.preventDefault();\n      errorEl.hidden = true;\n      btn.disabled = true;\n      btn.textContent = 'Signing in…';\n\n      const email = document.getElementById('email').value.trim();\n      const password = document.getElementById('password').value;\n\n      try {\n        const cred = await signInWithEmailAndPassword(auth, email, password);\n        const idToken = await cred.user.getIdToken();\n\n        const res = await fetch('/api/auth/session', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ idToken }),\n        });\n\n        if (res.ok) {\n          window.location.href = '/admin/dashboard';\n        } else {\n          throw new Error('Session creation failed');\n        }\n      } catch (err) {\n        const msg = err.code === 'auth/invalid-credential'\n          ? 'Invalid email or password.'\n          : err.code === 'auth/too-many-requests'\n          ? 'Too many attempts. Try again later.'\n          : 'Sign-in failed. Please try again.';\n        errorEl.textContent = msg;\n        errorEl.hidden = false;\n        btn.disabled = false;\n        btn.textContent = 'Sign In';\n      }\n    });\n  </script> </body> </html>"])), renderHead(), defineScriptVars({ firebaseConfig }));
}, "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/index.astro", void 0);
const $$file = "/Users/wfurgason/Documents/Arts Council/magnaarts.org/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
