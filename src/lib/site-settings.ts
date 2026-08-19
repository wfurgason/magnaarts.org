import { adminDb } from './firebase-admin';

/**
 * Reads settings/bands.applicationsOpen.
 * Defaults to true (open) if the doc doesn't exist yet or on any read error,
 * so a missing/misconfigured settings doc never accidentally blocks the
 * public call-for-bands form.
 */
export async function getBandApplicationsOpen(): Promise<boolean> {
  try {
    const snap = await adminDb.collection('settings').doc('bands').get();
    if (!snap.exists) return true;
    const data = snap.data();
    return data?.applicationsOpen !== false;
  } catch (e) {
    console.warn('getBandApplicationsOpen: failed to read settings/bands, defaulting to open:', (e as Error).message);
    return true;
  }
}

/**
 * Reads settings/vendors.applicationsOpen.
 * Defaults to true (open) if the doc doesn't exist yet or on any read error,
 * so a missing/misconfigured settings doc never accidentally blocks the
 * public vendor-application form.
 */
export async function getVendorApplicationsOpen(): Promise<boolean> {
  try {
    const snap = await adminDb.collection('settings').doc('vendors').get();
    if (!snap.exists) return true;
    const data = snap.data();
    return data?.applicationsOpen !== false;
  } catch (e) {
    console.warn('getVendorApplicationsOpen: failed to read settings/vendors, defaulting to open:', (e as Error).message);
    return true;
  }
}
