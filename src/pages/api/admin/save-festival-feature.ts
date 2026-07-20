import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  // ── Auth ──────────────────────────────────────────────────────────
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      eventId,
      featureTitle,
      name,
      bio,
      websiteUrl,
      artistPhotoUrl,
      artworkPhotoUrl,
      order,
    } = body;

    // ── Required fields ──────────────────────────────────────────────
    if (!featureTitle || !String(featureTitle).trim()) {
      return new Response(JSON.stringify({ error: 'featureTitle is required' }), { status: 400 });
    }
    if (!name || !String(name).trim()) {
      return new Response(JSON.stringify({ error: 'name is required' }), { status: 400 });
    }

    // Build the update/create payload
    const data: Record<string, any> = {
      updatedAt: Timestamp.now(),
    };

    if (eventId          !== undefined) data.eventId          = String(eventId).trim();
    if (featureTitle      !== undefined) data.featureTitle      = String(featureTitle).trim();
    if (name              !== undefined) data.name              = String(name).trim();
    if (bio                !== undefined) data.bio                = String(bio).trim();
    if (websiteUrl        !== undefined) data.websiteUrl        = String(websiteUrl).trim();
    if (artistPhotoUrl    !== undefined) data.artistPhotoUrl    = String(artistPhotoUrl).trim();
    if (artworkPhotoUrl   !== undefined) data.artworkPhotoUrl   = String(artworkPhotoUrl).trim();
    if (order              !== undefined && order !== '') data.order = Number(order);

    if (id) {
      // ── Update existing document ──
      await adminDb.collection('festival_features').doc(String(id)).update(data);
      return new Response(JSON.stringify({ success: true, id }), { status: 200 });
    } else {
      // ── Create new document ──
      data.createdAt = Timestamp.now();
      const ref = await adminDb.collection('festival_features').add(data);
      return new Response(JSON.stringify({ success: true, id: ref.id }), { status: 200 });
    }
  } catch (err) {
    console.error('save-festival-feature error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
