import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { action, bandId, notes, value } = await request.json();
    if (!bandId) return new Response(JSON.stringify({ error: 'bandId required' }), { status: 400 });

    const ref = adminDb.collection('band_applications').doc(bandId);

    // ── Reject ──────────────────────────────────────────────────────────
    if (action === 'reject') {
      await ref.update({
        status:         'rejected',
        rejectionNotes: notes || '',
        // Strip all milestone and standing flags
        everApproved:   FieldValue.delete(),
        everAssigned:   FieldValue.delete(),
        everPublished:  FieldValue.delete(),
        goodStanding:   false,
        reviewedAt:     FieldValue.serverTimestamp(),
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── Approve (from rejected or pending) ──────────────────────────────
    if (action === 'approve') {
      await ref.update({
        status:         'approved',
        everApproved:   true,
        rejectionNotes: FieldValue.delete(),
        reviewedAt:     FieldValue.serverTimestamp(),
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // ── Toggle Good Standing flag ────────────────────────────────────────
    if (action === 'set-good-standing') {
      await ref.update({
        goodStanding: !!value,
        reviewedAt:   FieldValue.serverTimestamp(),
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
  } catch (err) {
    console.error('band-action error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
