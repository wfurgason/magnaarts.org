import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  let creator: import('firebase-admin/auth').DecodedIdToken;
  try {
    creator = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Only super_admin can create users
  const claims = creator.customClaims as Record<string, string> | undefined;
  if (claims?.role !== 'super_admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const { email, password, displayName, role } = await request.json();

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName,
    });

    // Set custom claims for role-based access
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      role: role || 'board_member',
    });

    // Store in Firestore for easy listing
    await adminDb.collection('admin_users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      displayName,
      role: role || 'board_member',
      createdBy: creator.email,
      createdAt: FieldValue.serverTimestamp(),
    });

    return new Response(JSON.stringify({ success: true, uid: userRecord.uid }), { status: 200 });
  } catch (error: any) {
    console.error('create-user error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const sessionCookie = cookies.get('session')?.value;
  if (!sessionCookie) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  let caller: import('firebase-admin/auth').DecodedIdToken;
  try {
    caller = await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const claims = caller.customClaims as Record<string, string> | undefined;
  if (claims?.role !== 'super_admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  try {
    const { uid } = await request.json();
    // Prevent deleting yourself
    if (uid === caller.uid) {
      return new Response(JSON.stringify({ error: 'Cannot delete your own account' }), { status: 400 });
    }

    await adminAuth.deleteUser(uid);
    await adminDb.collection('admin_users').doc(uid).delete();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Server error' }), { status: 500 });
  }
};
