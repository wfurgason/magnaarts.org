/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import('firebase-admin/auth').DecodedIdToken & {
      customClaims?: { role?: 'super_admin' | 'board_member' };
    };
  }
}

interface ImportMetaEnv {
  readonly FIREBASE_PROJECT_ID: string;
  readonly FIREBASE_CLIENT_EMAIL: string;
  readonly FIREBASE_PRIVATE_KEY: string;
  readonly PUBLIC_FIREBASE_API_KEY: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
