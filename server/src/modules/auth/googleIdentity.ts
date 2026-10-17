import { OAuth2Client } from 'google-auth-library';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import config from '../../../../firebase-applet-config.json';

export interface VerifiedGoogleIdentity { subject: string; email: string; name: string; picture?: string }
const google = new OAuth2Client();

// Only signed credentials are accepted. Browser profile fields never establish identity.
export async function verifyGoogleIdentity(token: string, kind: 'google' | 'firebase'): Promise<VerifiedGoogleIdentity> {
  let payload: any;
  if (kind === 'firebase') {
    const projectId = process.env.FIREBASE_PROJECT_ID || config.projectId;
    const app = getApps().find(app => app.name === 'virasat-auth') || initializeApp({ projectId }, 'virasat-auth');
    payload = await getAuth(app).verifyIdToken(token);
    if (payload.firebase?.sign_in_provider !== 'google.com') throw new Error('Invalid provider');
    const subject = payload.firebase?.identities?.['google.com']?.[0];
    if (typeof subject !== 'string' || !subject) throw new Error('Missing provider subject');
    payload = { ...payload, sub: subject };
  } else {
    const audience = process.env.GOOGLE_CLIENT_ID || config.oAuthClientId;
    payload = (await google.verifyIdToken({ idToken: token, audience })).getPayload();
  }
  if (!payload?.sub || payload.email_verified !== true || typeof payload.email !== 'string') throw new Error('Unverified identity');
  return { subject: payload.sub, email: payload.email.toLowerCase().trim(), name: payload.name || 'Virasat Traveller', picture: payload.picture };
}
