// scripts/bootstrap-admin.cjs
// Run this ONCE to create the wfurgason@gmail.com super admin account.
//
// Prerequisites:
//   1. Download your service account JSON from:
//      Firebase Console → Project Settings → Service Accounts → Generate new private key
//   2. Save it as scripts/service-account.json (it's already in .gitignore)
//   3. Run: node scripts/bootstrap-admin.cjs
//
// You only need to run this once. After that, create all other accounts
// through the /admin/users page in the portal.

const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const SUPER_ADMIN_EMAIL    = 'wfurgason@gmail.com';
const SUPER_ADMIN_NAME     = 'Wes Furgason';
const SUPER_ADMIN_PASSWORD = '4Magn@Art$!';

async function main() {
  console.log(`Setting up super admin: ${SUPER_ADMIN_EMAIL}`);

  let user;
  try {
    user = await admin.auth().getUserByEmail(SUPER_ADMIN_EMAIL);
    console.log('  ✓ User already exists, updating...');
    await admin.auth().updateUser(user.uid, { password: SUPER_ADMIN_PASSWORD });
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.log('  Creating new user...');
      user = await admin.auth().createUser({
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
        displayName: SUPER_ADMIN_NAME,
        emailVerified: true,
      });
    } else {
      throw err;
    }
  }

  await admin.auth().setCustomUserClaims(user.uid, { role: 'super_admin' });
  console.log('  ✓ Custom claim set: role = super_admin');

  await admin.firestore().collection('admin_users').doc(user.uid).set({
    uid: user.uid,
    email: SUPER_ADMIN_EMAIL,
    displayName: SUPER_ADMIN_NAME,
    role: 'super_admin',
    createdBy: 'bootstrap',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log('  ✓ Firestore admin_users doc written');

  console.log('\n✅ Super admin ready!');
  console.log(`   Email: ${SUPER_ADMIN_EMAIL}`);
  console.log(`   UID:   ${user.uid}`);
  console.log('\nYou can now log in at https://magnaarts.org/admin');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
