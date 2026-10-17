# Google sign-in setup and verification

The popup uses Firebase Authentication. One Tap uses Google Identity Services.
Both send signed ID tokens to `POST /api/v1/auth/google`; the backend verifies
signature, issuer, audience and expiration using firebase-admin/google-auth-library.
Only verified email and Google provider subjects are accepted. Browser profile fields
cannot create sessions. New accounts are travellers; existing local/email accounts
are not automatically linked or granted admin privileges.

## Configuration

- Enable Google under Firebase Authentication → Sign-in method for the project in
  `firebase-applet-config.json`.
- Add the actual development and production hostnames to Firebase authorized domains.
- For One Tap, configure authorized JavaScript origins on the Google web OAuth client.
  `VITE_GOOGLE_CLIENT_ID` in the frontend must match server `GOOGLE_CLIENT_ID`.
  Both default to the client ID in the existing applet configuration.
- Server `FIREBASE_PROJECT_ID` defaults to the applet project ID and must match the
  frontend Firebase project. Never put Admin credentials in VITE variables.
- Set a private, randomly generated `JWT_SECRET` of at least 32 characters in the
  server environment. Production rejects missing/short/default secrets. Development
  generates an ephemeral secret when absent, invalidating sessions on restart.
- Restart the server after authentication configuration changes. Basic Firebase token
  signature verification uses public certificates; revocation checking is not enabled.
  Backend sessions currently last seven days and are stored in browser localStorage.

## Verification

`npm run test:auth` exercises the actual route with mocked external verification:
profile spoof rejection, invalid token redaction, unverified email, account-link
conflict, traveller creation, safe response and repeat subject login.

Then use Sign In → Google in a browser, complete the account chooser, confirm
`/api/v1/auth/me` returns the backend account, and reload to verify restoration.
This interactive step has not been completed by the agent. Never paste tokens,
passwords or service-account keys into chat or commit them.

References: [Firebase token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
and [Google ID token verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
