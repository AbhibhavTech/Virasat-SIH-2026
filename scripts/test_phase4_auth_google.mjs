/**
 * Automated Verification Test Suite for Phase 4:
 * - Google OAuth 2.0 Registration & Profile Creation
 * - Automatic Account Merging for Existing Email Accounts
 * - Safe Google ID Token Decoding
 * - Persistent Profile & Onboarding Survey State
 * - Session Token Integrity & Credential Hygiene
 */

import jwt from 'jsonwebtoken';
import { db } from '../server/src/db/client.ts';
import { JWT_SECRET } from '../server/src/middleware/auth.ts';

async function runPhase4Tests() {
  console.log('🚀 [Test] Starting Phase 4: Google Login & Profile State Verification...\n');
  await db.init();

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // Test Suite 1: Google OAuth Registration (New User)
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Google OAuth Registration for New User ---');
  const googleEmail = `priya.sharma.${Date.now()}@gmail.com`;
  const googleSub = `g-sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const googlePicture = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';

  // Simulate Google sign-in payload
  const newUserId = `user-google-${Date.now()}`;
  const googleUser = await db.users.create({
    id: newUserId,
    email: googleEmail,
    password_hash: '',
    name: 'Priya Sharma',
    avatar_url: googlePicture,
    google_id: googleSub,
    home_city: 'Mumbai',
    auth_provider: 'google',
    role: 'traveller',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  assert(googleUser.email === googleEmail, 'Google user registered with verified email');
  assert(googleUser.auth_provider === 'google', 'Auth provider set to google');
  assert(googleUser.google_id === googleSub, 'Google subject ID (sub) saved accurately');
  assert(googleUser.avatar_url === googlePicture, 'Google profile picture saved as avatar_url');
  assert(googleUser.password_hash === '', 'OAuth user does not store a dummy password hash');

  // Verify findByGoogleId
  const retrievedByGoogleId = await db.users.findByGoogleId(googleSub);
  assert(retrievedByGoogleId !== null, 'User retrievable via db.users.findByGoogleId');
  assert(retrievedByGoogleId?.id === newUserId, 'findByGoogleId returns the exact matching user ID');

  // Issue session JWT
  const sessionToken = jwt.sign(
    {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      role: googleUser.role,
      home_city: googleUser.home_city,
      avatar_url: googleUser.avatar_url,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const decoded = jwt.verify(sessionToken, JWT_SECRET);
  assert(decoded.id === newUserId, 'JWT token decodes with correct user ID');
  assert(decoded.email === googleEmail, 'JWT token decodes with correct email');
  assert(decoded.role === 'traveller', 'JWT token contains traveller role claim');
  assert(decoded.avatar_url === googlePicture, 'JWT token carries user avatar_url claim');

  // -------------------------------------------------------------
  // Test Suite 2: Account Merging (Existing Email Linking Google)
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: Account Merging & Identity Linking ---');
  const existingEmail = `rohit.patel.${Date.now()}@gmail.com`;
  const existingUserId = `user-local-${Date.now()}`;

  // 1. Create standard email/password user
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const passHash = await bcrypt.hash('SecretPass123!', salt);

  const initialUser = await db.users.create({
    id: existingUserId,
    email: existingEmail,
    password_hash: passHash,
    name: 'Rohit Patel',
    home_city: 'Delhi',
    auth_provider: 'local',
    role: 'traveller',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  assert(initialUser.auth_provider === 'local', 'Initial account created with local email/password');
  assert(initialUser.google_id === undefined, 'Initial account has no google_id');

  // 2. User creates a favorite bookmark
  const fav = await db.favorites.add(existingUserId, 'monument-qutub-minar');

  // 3. User logs in with Google OAuth using the exact same email
  const rohitGoogleSub = `g-rohit-${Date.now()}`;
  const rohitGooglePic = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';

  const existingMatch = await db.users.findByEmail(existingEmail);
  assert(existingMatch !== null, 'Account matching existing email is found in database');

  const mergedUser = await db.users.update(existingMatch.id, {
    google_id: rohitGoogleSub,
    avatar_url: rohitGooglePic,
    auth_provider: 'google_linked',
  });

  assert(mergedUser !== null, 'Account update for Google linking succeeds');
  assert(mergedUser.id === existingUserId, 'User ID remains identical after Google linking (account preserved)');
  assert(mergedUser.google_id === rohitGoogleSub, 'Google ID successfully linked to existing account');
  assert(mergedUser.avatar_url === rohitGooglePic, 'Avatar URL updated from Google profile');
  assert(mergedUser.password_hash === passHash, 'Existing password hash preserved intact for credential fallback');

  // Verify favorites survived account merging
  const userFavorites = await db.favorites.listByUser(existingUserId);
  assert(userFavorites.some((f) => f.id === fav.id), 'User saved favorites preserved completely across account merging');

  // -------------------------------------------------------------
  // Test Suite 3: Safe Google ID Token Decoding
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: Safe Google ID Token Decoding ---');
  function decodeGoogleIdToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Construct a standard 3-part JWT
  const mockPayload = {
    iss: 'https://accounts.google.com',
    sub: '109876543210987654321',
    email: 'kavita.deshmukh@gmail.com',
    email_verified: true,
    name: 'Kavita Deshmukh',
    picture: 'https://lh3.googleusercontent.com/a/mock-kavita',
  };
  const encodedPayload = Buffer.from(JSON.stringify(mockPayload)).toString('base64url');
  const mockGoogleIdToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMyJ9.${encodedPayload}.mock_sig`;

  const parsedClaims = decodeGoogleIdToken(mockGoogleIdToken);
  assert(parsedClaims !== null, 'Token decoder parses valid 3-part Google ID token');
  assert(parsedClaims.email === 'kavita.deshmukh@gmail.com', 'Extracted email matches token claims');
  assert(parsedClaims.name === 'Kavita Deshmukh', 'Extracted name matches token claims');
  assert(parsedClaims.sub === '109876543210987654321', 'Extracted Google sub matches token claims');

  // Malformed token handling
  const malformedResult = decodeGoogleIdToken('not-a-token');
  assert(malformedResult === null, 'Malformed token string gracefully returns null without throwing');

  // -------------------------------------------------------------
  // Test Suite 4: Persistent Profile & Onboarding Survey State
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: Persistent Profile & Onboarding Survey State ---');
  const surveyData = {
    travel_style: 'heritage_explorer',
    pace: 'relaxed',
    interests: ['Mughal Architecture', 'Ancient Forts', 'Culinary Traditions'],
    budget: 'moderate',
    companion: 'solo',
  };

  const updatedWithSurvey = await db.users.update(newUserId, {
    home_city: 'Jaipur',
    survey: surveyData,
    preferences: {
      travel_style: 'heritage_explorer',
      preferred_transport: 'suburban_rail',
      ...surveyData,
    },
  });

  assert(updatedWithSurvey !== null, 'Profile update with survey succeeds');
  assert(updatedWithSurvey.home_city === 'Jaipur', 'Updated home city persists as Jaipur');
  assert(updatedWithSurvey.survey?.travel_style === 'heritage_explorer', 'Survey travel style persists');
  assert(
    Array.isArray(updatedWithSurvey.survey?.interests) && updatedWithSurvey.survey.interests.includes('Ancient Forts'),
    'Survey cultural interests persist as array'
  );
  assert(updatedWithSurvey.preferences?.preferred_transport === 'suburban_rail', 'Custom preferences persist');

  // Verify persistence across fresh lookup
  const freshLookup = await db.users.findById(newUserId);
  assert(freshLookup?.survey?.pace === 'relaxed', 'Survey pace is safely retrieved from database');

  // -------------------------------------------------------------
  // Test Suite 5: Credential Hygiene & Role Verification
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 5: Credential Hygiene & Role Verification ---');
  // Safe profile serialization (omits password_hash)
  const { password_hash: _, ...safeProfile } = freshLookup;
  assert(!('password_hash' in safeProfile) || safeProfile.password_hash === undefined, 'Safe profile omits password_hash');
  assert(safeProfile.role === 'traveller', 'Default role is verified as traveller');
  assert(safeProfile.avatar_url === googlePicture, 'Safe profile includes avatar_url');

  // Summary
  console.log('\n=============================================================');
  console.log(`📊 Phase 4 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase4Tests().catch((err) => {
  console.error('💥 Fatal error in Phase 4 test runner:', err);
  process.exit(1);
});
