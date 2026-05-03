import type { APIRoute } from 'astro';
import { adminAuth, adminDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request, cookies }) => {
  // Verify session
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
    const { id, fullName, email, phone, artsArea, projectDescription, materials, projectImageUrl, presenterPhotoUrl, projectTitle } = body;

    if (!id || typeof id !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    }

    // Build update payload — only include defined fields
    const update: Record<string, any> = {};
    if (fullName        !== undefined) update.fullName        = fullName;
    if (email           !== undefined) update.email           = email;
    if (phone           !== undefined) update.phone           = phone;
    if (artsArea            !== undefined) update.artsArea            = artsArea;
    if (projectDescription  !== undefined) update.projectDescription  = projectDescription;
    if (materials           !== undefined) update.materials           = materials;
    if (projectImageUrl    !== undefined) update.projectImageUrl    = projectImageUrl;
    if (presenterPhotoUrl  !== undefined) update.presenterPhotoUrl  = presenterPhotoUrl;
    if (projectTitle       !== undefined) update.projectTitle       = projectTitle;

    if (Object.keys(update).length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400 });
    }

    await adminDb.collection('art_class_submissions').doc(id).update(update);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('update-presenter error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
