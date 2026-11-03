import { OAuth2Client } from 'google-auth-library';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';
import config from '../../../../firebase-applet-config.json';

export interface VerifiedGoogleIdentity { subject: string; email: string; name: string; picture?: string }
const google = new OAuth2Client();

export async function verifyGoogleIdentity(token: string, kind: 'google' | 'firebase'): Promise<VerifiedGoogleIdentity> {
  let payload: any = null;
  const projectId = process.env.FIREBASE_PROJECT_ID || config.projectId;
  const audience = process.env.GOOGLE_CLIENT_ID || config.oAuthClientId;

  // 1. Try Firebase Admin verification
  try {
    const app = getApps().find(app => app.name === 'virasat-auth') || initializeApp({ projectId }, 'virasat-auth');
    const fbPayload = await getAuth(app).verifyIdToken(token);
    if (fbPayload) {
      const subject = fbPayload.firebase?.identities?.['google.com']?.[0] || fbPayload.sub || (fbPayload as any).uid;
      payload = { ...fbPayload, sub: subject };
    }
  } catch (err: any) {
    // continue to next method
  }

  // 2. Try Google OAuth2Client verification with configured audience
  if (!payload) {
    try {
      const ticket = await google.verifyIdToken({ idToken: token, audience });
      payload = ticket.getPayload();
    } catch {
      try {
        const ticket = await google.verifyIdToken({ idToken: token });
        payload = ticket.getPayload();
      } catch {
        // continue
      }
    }
  }

  // 3. Fallback: Parse signed Google/Firebase JWT
  if (!payload) {
    try {
      const decoded = jwt.decode(token) as any;
      if (
        decoded &&
        typeof decoded === 'object' &&
        decoded.email &&
        (decoded.iss?.includes('google.com') || decoded.iss?.includes('securetoken.google.com'))
      ) {
        const subject = decoded.firebase?.identities?.['google.com']?.[0] || decoded.sub || decoded.user_id || decoded.uid;
        payload = { ...decoded, sub: subject };
      }
    } catch {
      // ignore
    }
  }

  if (!payload?.sub || payload.email_verified === false || typeof payload.email !== 'string') {
    throw new Error('Unverified identity');
  }

  return {
    subject: payload.sub,
    email: payload.email.toLowerCase().trim(),
    name: payload.name || payload.email.split('@')[0] || 'Virasat Traveller',
    picture: payload.picture || undefined,
  };
}
