import assert from 'node:assert/strict';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { authRouter } from '../server/src/modules/auth/auth.router';
import { db } from '../server/src/db/client';

// Mock only the external signature verifier and persistence; exercise the actual HTTP route.
const original = OAuth2Client.prototype.verifyIdToken;
const saved = { ...db.users };
let bySubject: any = null;
let byEmail: any = null;
let writes = 0;
OAuth2Client.prototype.verifyIdToken = (async ({ idToken }: any) => {
  if (idToken === 'invalid-token-do-not-log') throw new Error('secret-token-do-not-log');
  return { getPayload: () => ({ sub: 'verified-subject', email: 'traveller@example.com', email_verified: idToken !== 'unverified-email-token', name: 'Traveller' }) };
}) as any;
db.users.findByGoogleId = async () => bySubject;
db.users.findByEmail = async () => byEmail;
db.users.create = async record => { writes++; return record; };
const app = express(); app.use(express.json()); app.use('/auth', authRouter);
const server = app.listen(0);
await new Promise<void>(resolve => server.once('listening', resolve));
const address = server.address() as any;
async function post(body: unknown) {
  const result = await fetch(`http://127.0.0.1:${address.port}/auth/google`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return { status: result.status, body: await result.json() };
}
try {
  assert.equal((await post({ email: 'admin@example.com' })).status, 400);
  const invalid = await post({ id_token: 'invalid-token-do-not-log' });
  assert.equal(invalid.status, 401); assert.doesNotMatch(JSON.stringify(invalid), /secret-token|invalid-token-do-not-log/);
  assert.equal((await post({ id_token: 'unverified-email-token' })).status, 401);
  byEmail = { id: 'existing-local' };
  assert.equal((await post({ id_token: 'valid-signed-token-placeholder' })).status, 409);
  assert.equal(writes, 0);
  byEmail = null;
  const created = await post({ id_token: 'valid-signed-token-placeholder' });
  assert.equal(created.status, 200); assert.equal(created.body.profile.role, 'traveller');
  assert.equal(created.body.profile.google_id, 'verified-subject');
  assert.equal(created.body.profile.password_hash, undefined); assert.ok(created.body.token);
  bySubject = created.body.profile;
  assert.equal((await post({ id_token: 'valid-signed-token-placeholder' })).status, 200);
  assert.equal(writes, 1);
  console.log('Google authentication route: 7 scenarios passed (mocked verifier; no real Google login claimed).');
} finally {
  OAuth2Client.prototype.verifyIdToken = original;
  Object.assign(db.users, saved);
  await new Promise<void>(resolve => server.close(() => resolve()));
}
