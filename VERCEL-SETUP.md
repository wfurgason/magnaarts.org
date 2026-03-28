# Vercel Environment Variables Setup

The admin login works locally but **not on the live Vercel site** until you complete
these steps. The Firebase private key and other server-side secrets live only on your
local machine — they need to be added to Vercel manually.

---

## Steps

### 1. Open your Vercel project settings

Go to **vercel.com** → your `magnaarts` project → **Settings** → **Environment Variables**

---

### 2. Add each variable below

Click **Add New** for each one and paste the name and value exactly as shown.

| Variable Name | Value |
|---|---|
| `PUBLIC_FIREBASE_API_KEY` | `AIzaSyAP3QgOUeZ1ruwoUxOROvKw1JXpTxYAIQg` |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | `magnaarts.firebaseapp.com` |
| `PUBLIC_FIREBASE_PROJECT_ID` | `magnaarts` |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | `magnaarts.firebasestorage.app` |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1084773655627` |
| `PUBLIC_FIREBASE_APP_ID` | `1:1084773655627:web:3501bdbb5fbfb04952d9ce` |
| `FIREBASE_PROJECT_ID` | `magnaarts` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@magnaarts.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | *(see section below)* |
| `SITE_URL` | `https://magnaarts.org` |

---

### 3. Adding the Private Key ⚠️

The `FIREBASE_PRIVATE_KEY` is the most important and most finicky one.

**Do this:**
- Open your local `.env` file (in this same project folder)
- Copy everything between the outer quote marks for `FIREBASE_PRIVATE_KEY`
- It starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`
- Paste that entire block into the Vercel value field — **do not include the surrounding quote marks**
- Vercel handles the newline formatting automatically

**If login still fails after deploying**, it's almost always the private key. Try this:
- Delete the `FIREBASE_PRIVATE_KEY` entry in Vercel
- Re-add it, making sure there are no extra spaces or quote marks around it

---

### 4. Redeploy

After adding all the variables:

1. Go to the **Deployments** tab in your Vercel project
2. Click the **three dots (⋯)** on your most recent deployment
3. Click **Redeploy**
4. Wait about 60 seconds for the build to finish
5. Visit your live site and try logging in at `/admin`

---

## Why this is needed

Your local `.env` file is intentionally never uploaded to GitHub (it's listed in
`.gitignore`) because it contains your Firebase private key. Vercel deploys from
GitHub, so it never sees your `.env` file. You have to tell Vercel about these
secrets separately through their environment variables UI — that way they stay
secure and out of your code.

Once set, Vercel remembers them for every future deploy automatically.

---

## Checklist

- [ ] `PUBLIC_FIREBASE_API_KEY` added
- [ ] `PUBLIC_FIREBASE_AUTH_DOMAIN` added
- [ ] `PUBLIC_FIREBASE_PROJECT_ID` added
- [ ] `PUBLIC_FIREBASE_STORAGE_BUCKET` added
- [ ] `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` added
- [ ] `PUBLIC_FIREBASE_APP_ID` added
- [ ] `FIREBASE_PROJECT_ID` added
- [ ] `FIREBASE_CLIENT_EMAIL` added
- [ ] `FIREBASE_PRIVATE_KEY` added (no surrounding quote marks)
- [ ] `SITE_URL` set to `https://magnaarts.org`
- [ ] Redeployed from the Deployments tab
- [ ] Tested login at `https://magnaarts.org/admin`
