import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let adminApp = null;
try {
  const projectId = "magnaarts";
  const clientEmail = "firebase-adminsdk-fbsvc@magnaarts.iam.gserviceaccount.com";
  const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDvZx716qmR3jqm\n4bwWQrlxWgZ1UFiOi13APDW4kKy1YvvrroR9dRQpBd0XCUFJTmHZvzyIaRCLNMus\nHcStEl9E7T67c/eGYpzY2gEup1aHD80/4L4R2rbHyQGeR0iEiaBYZpv6zoYeF8RD\nbFHqL2V5+E79AqCl+eiZOHWxHca13Tc7VmeCNGXDcyNHa5sA7pYr0Uj1hlf1P7y5\npxIlVz0NsnqhFj1RZ3OrUXbSH/3DDhi9couZyqIU/UvW9iAH2MI2suCfOZYWnWk+\nHCv81yTTFsNzxWc+gWD+INssmTrosHy01+gl8t4mxpQqkLbMw0Jr9snVEy1amARg\nRHEKYufJAgMBAAECggEATYgnijv3s8J1W0OC/vCYDyI5MjgVngB7mbzGJyJPlKTc\ncm0AAoNuxoRcIFBCgQOuA+9/oqvoDDVKetDfN6/aA8ATz3CUqsR4CHC97kaKas5O\nyg+2bqDXDifGauSqEyZhNA/zFwxYehl3WeCUPNQhuJkWt7Dopygi0LBsyTIb/xxn\noxo+CoaP066vLKZktyc5RFpEbTZYx4KPrq/99rKsJKifgI8T721OwUCWs/FpAMb7\nXc6g+eCnscVmXX7+Wi6jPpiCxVNlVH26qqQdMOe44IjdxheEzzl6PPNcvXN+UmcN\nZ+yuIVlLx/XRoGS9/XByczwKdi6B9Mu9bnguywyHKwKBgQD4chw3p/6NSDhI9zlQ\n1CptWepjaTICmBDM0WMfyJYCn+l2OjfQTECsx6pBdD7J3XPqi9x2rBelQI3LCcfZ\nxrYcGbj+oJmJIyfswwHrVR9UfLuAQvoaJHTDAJH/RDt4RWp67ONTHNMJzhM+ZfZr\nrJciYzu4sTJmL+fcN/qaUKk5BwKBgQD2rp76NiXrj0zWmCL6sFWM1U8UsN9g/8M+\nUPm69JPkDul6lzFCLXCp5g4neLDtVawT+XbI4WaegOVwbFWaVtu4z9C+FVjcjjOf\nUnnWETDurM352dhVuQp7kuDsYs/mvTzIPedyTdoR7fkMtW5Oc9T4RvAtc7CHu0Ll\nDO52pYS0rwKBgQCZXJ8sgAgzIDyWVf3MdluGSvXTzdDwJvxf4nUE3qYzEpFjyMZB\nT4Cw50OiyeYkaA4w34sEunCSMsoUZoI2XWJ28C3xCCQeslPn4+ygX1hKqAB6SV3n\nm090PDrjTzRCpt726Jne6TEgoVPhtcEqcEyPDqCD/uX0jGfc2bVZYqdDKwKBgG/h\nq0EYpgI8sED0J4lDyMljRcbAoc/AsLDm0R02KI1bJhHv2OuG6H5mVS0Z1EUQgkdc\n8b8SXBSvqWBgAkNJ+cXMm4Ra8j62UDuGkLPCgEsAHTugzjmy/0okx9buyhSA57x6\nNyrknG9dW4OkFi+G4aTpp601t28YQ7LXNqChWZsJAoGAJPkeAd1Eoh46WLcMGQVy\nlAFhXbj/4RFJRtw4ii/LSA0Ef8RyzIjrOq2VsaP3l/C/XH9YWUqGmPjlwPMHCEmx\n/kdSsDfNfah8NuIHKyhWv+WyAjlZgFQnWcen6ZhwG9i+JTX4tscCxP3obI4lfY+U\n0eaeMVra/ySsaB4k4KRTIxU=\n-----END PRIVATE KEY-----\n"?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin environment variables");
  }
  const apps = getApps();
  adminApp = apps.length === 0 ? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }) : apps[0];
} catch (e) {
  console.warn("Firebase Admin SDK not initialized:", e.message);
}
const adminAuth = adminApp ? getAuth(adminApp) : null;
const adminDb = adminApp ? getFirestore(adminApp) : null;
const adminStorage = adminApp ? getStorage(adminApp) : null;

export { adminAuth, adminDb, adminStorage };
