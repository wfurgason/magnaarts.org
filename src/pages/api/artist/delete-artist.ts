import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { bandId } = await request.json();
    if (!bandId || typeof bandId !== 'string') {
      return new Response(JSON.stringify({ error: 'bandId required' }), { status: 400 });
    }

    // ── Auth: accept either admin session cookie OR artist Bearer token ──
    const sessionCookie = cookies.get('session')?.value;
    const authHeader    = request.headers.get('Authorization') ?? '';
    const bearerToken   = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    let isAdmin  = false;
    let callerUid: string | null = null;

    if (sessionCookie) {
      try {
        await adminAuth.verifySessionCookie(sessionCookie, true);
        isAdmin = true;
      } catch {
        // not a valid admin session — fall through to artist auth
      }
    }

    if (!isAdmin && bearerToken) {
      try {
        const decoded = await adminAuth.verifyIdToken(bearerToken);
        callerUid = decoded.uid;
      } catch {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
    }

    if (!isAdmin && !callerUid) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // ── Fetch artist doc ───────────────────────────────────────────────
    const artistRef  = adminDb.collection('artists').doc(bandId);
    const artistSnap = await artistRef.get();

    if (!artistSnap.exists) {
      return new Response(JSON.stringify({ error: 'Artist not found' }), { status: 404 });
    }

    const artist = artistSnap.data()!;

    // If self-delete, verify the caller owns this profile
    if (!isAdmin && callerUid !== artist.uid) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
    }

    // ── 1. Delete Firestore subcollections ─────────────────────────────
    const subcollections = ['tracks', 'images', 'optinTokens'];
    for (const sub of subcollections) {
      const snap = await artistRef.collection(sub).get();
      if (!snap.empty) {
        const batch = adminDb.batch();
        snap.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
      }
    }

    // ── 2. Delete root optinTokens docs for this bandId ────────────────
    const tokenSnap = await adminDb
      .collection('optinTokens')
      .where('bandId', '==', bandId)
      .get();
    if (!tokenSnap.empty) {
      const batch = adminDb.batch();
      tokenSnap.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    }

    // ── 3. Delete Firebase Storage files ──────────────────────────────
    const bucket = getStorage().bucket();
    const storagePrefixes = [
      `artist_tracks/${bandId}/`,
      `artist_images/${bandId}/`,
      `band-promos/${bandId}/`,
    ];
    await Promise.all(
      storagePrefixes.map(prefix =>
        bucket.deleteFiles({ prefix }).catch(err => {
          // Non-fatal: log but don't fail if a prefix has no files
          console.warn(`[delete-artist] Storage prefix not found or empty: ${prefix}`, err?.message);
        })
      )
    );

    // ── 4. Delete the artist doc ───────────────────────────────────────
    await artistRef.delete();

    console.log(`[delete-artist] Deleted artist ${bandId} (${artist.band_name}) — by ${isAdmin ? 'admin' : `uid:${callerUid}`}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('[delete-artist] error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
