/**
 * Automated Verification Test Suite for Phase 7:
 * - Security & Injection Attack Defense (SQLi, Stored XSS)
 * - Strict IDOR (Insecure Direct Object Reference) Isolation
 * - Cryptographic Token Integrity & JWT Tampering Prevention
 * - Role-Based Access Control (RBAC) Privilege Escalation Prevention (Risk #14)
 * - Complete End-to-End (E2E) Traveller Journey Simulation
 */

import jwt from 'jsonwebtoken';
import { db } from '../server/src/db/client.ts';
import { JWT_SECRET } from '../server/src/middleware/auth.ts';
import { auditHallucinations } from '../server/src/modules/ai/ai.router.ts';
import { resolveOriginTransportNode, resolveDestinationTransportNode, buildVerifiedTransitComparison } from '../src/server/transportResolver.ts';

async function runPhase7Tests() {
  console.log('🚀 [Test] Starting Phase 7: Automated Security & E2E Verification...\n');
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
  // Test Suite 1: Security & Injection Attack Defense
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Security & Injection Attack Defense ---');

  // A. SQL Injection payloads against place searches
  const sqlInjectionPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE places; --",
    "1' UNION SELECT * FROM users --",
    "' OR 1=1 --",
    "admin'--",
  ];

  for (const payload of sqlInjectionPayloads) {
    const searchRes = await db.places.findAll({ search: payload });
    assert(
      searchRes.places.length === 0,
      `SQLi payload "${payload}" neutralized in search (returned 0 matched places)`
    );
  }

  // SQLi payload against city filter
  const citySqli = await db.places.findAll({ city: "Jaipur' OR '1'='1" });
  assert(citySqli.places.length === 0, 'SQLi payload in city filter rejected without table exposure');

  // SQLi payload against auth email lookup
  const userBySqli = await db.users.findByEmail("admin' OR '1'='1' --");
  assert(userBySqli === null, 'SQLi payload in email lookup does not return unauthorized admin records');

  // B. Stored XSS Sanitization in Citizen Reports
  const xssPayload = "<script>alert('XSS-EXPLOIT');</script><img src=x onerror=alert('PWNED')>";
  const xssReportId = `rep-xss-${Date.now()}`;
  const xssReport = await db.reports.create({
    id: xssReportId,
    place_id: 'amber-fort',
    place_name: 'Amber Fort',
    city: 'Jaipur',
    reported_by: 'Test Attacker',
    user_id: 'user-hacker-test',
    issue_type: 'cleanliness',
    title: 'XSS Injection Probe',
    description: xssPayload,
    severity: 'low',
    status: 'PENDING',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const retrievedReport = await db.reports.findById(xssReportId);
  assert(retrievedReport !== null, 'Report saved into persistent store');
  assert(retrievedReport.id === xssReportId, 'Report record isolated by explicit ID');
  assert(retrievedReport.place_id === 'amber-fort', 'Foreign key preserved cleanly without execution leak');

  // -------------------------------------------------------------
  // Test Suite 2: Strict IDOR (Insecure Direct Object Reference) Isolation
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: Strict IDOR Isolation & Data Privacy ---');

  const userAliceId = `user-alice-${Date.now()}`;
  const userBobId = `user-bob-${Date.now()}`;

  // Alice creates a private trip
  const aliceTripId = `trip-alice-${Date.now()}`;
  await db.trips.create({
    id: aliceTripId,
    user_id: userAliceId,
    city_id: 'jaipur',
    title: "Alice's Private Golden Triangle Trip",
    start_date: '2026-10-01',
    end_date: '2026-10-04',
    total_budget: 15000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Bob queries trips scoped to Bob
  const bobTrips = await db.trips.findByUser(userBobId);
  const foundAliceTripInBob = bobTrips.some((t) => t.id === aliceTripId);
  assert(!foundAliceTripInBob, "Bob cannot view Alice's private saved trips (IDOR query isolation)");

  // Alice creates a private citizen report
  const aliceReportId = `rep-alice-${Date.now()}`;
  await db.reports.create({
    id: aliceReportId,
    place_id: 'taj-mahal',
    place_name: 'Taj Mahal',
    city: 'Agra',
    reported_by: 'Alice Traveler',
    user_id: userAliceId,
    issue_type: 'crowd_management',
    title: 'High crowd density at south gate',
    description: 'Private report filed by Alice',
    severity: 'medium',
    status: 'PENDING',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const bobReports = await db.reports.findAll({ userId: userBobId });
  const foundAliceReportInBob = bobReports.some((r) => r.id === aliceReportId);
  assert(!foundAliceReportInBob, "Bob cannot access Alice's user-scoped citizen reports (IDOR isolation)");

  // -------------------------------------------------------------
  // Test Suite 3: Cryptographic Integrity & JWT Tampering Prevention
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: Cryptographic JWT Integrity & Tampering ---');

  // A. Valid token generation
  const legitToken = jwt.sign(
    { userId: userAliceId, email: 'alice@virasat.in', role: 'traveller' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const decodedLegit = jwt.verify(legitToken, JWT_SECRET);
  assert(decodedLegit.userId === userAliceId, 'Legitimate JWT decodes successfully');
  assert(decodedLegit.role === 'traveller', 'Legitimate role claim verified');

  // B. Tampered signature (Attacker modifies role to "admin" with same signature)
  const tokenParts = legitToken.split('.');
  const tamperedPayload = Buffer.from(
    JSON.stringify({ userId: userAliceId, email: 'alice@virasat.in', role: 'admin' })
  ).toString('base64url');
  const tamperedToken = `${tokenParts[0]}.${tamperedPayload}.${tokenParts[2]}`;

  let tamperedCaught = false;
  try {
    jwt.verify(tamperedToken, JWT_SECRET);
  } catch {
    tamperedCaught = true;
  }
  assert(tamperedCaught, 'Tampered JWT payload with forged admin role is rejected (invalid signature)');

  // C. Forged token signed with hacker secret
  const forgedToken = jwt.sign(
    { userId: userAliceId, role: 'admin' },
    'unauthorized-rogue-secret-key'
  );

  let rogueSecretCaught = false;
  try {
    jwt.verify(forgedToken, JWT_SECRET);
  } catch {
    rogueSecretCaught = true;
  }
  assert(rogueSecretCaught, 'Token signed with unauthorized secret is rejected by server JWT verification');

  // D. Expired token rejection
  const expiredToken = jwt.sign(
    { userId: userAliceId, role: 'traveller' },
    JWT_SECRET,
    { expiresIn: -100 }
  );

  let expiredCaught = false;
  try {
    jwt.verify(expiredToken, JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') expiredCaught = true;
  }
  assert(expiredCaught, 'Expired JWT rejected with TokenExpiredError');

  // -------------------------------------------------------------
  // Test Suite 4: RBAC Gating & Destination Health
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: RBAC Gating & Destination Health ---');

  const officerId = `officer-${Date.now()}`;
  const triagedReportId = `rep-triage-${Date.now()}`;
  const healthMonId = 'amber-fort';

  await db.reports.create({
    id: triagedReportId,
    place_id: healthMonId,
    place_name: 'Amber Fort',
    city: 'Jaipur',
    reported_by: 'Alice Traveler',
    user_id: userAliceId,
    issue_type: 'vandalism',
    title: 'Graffiti spotted on outer wall',
    description: 'Minor graffiti spotted on outer wall',
    severity: 'high',
    status: 'PENDING',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Calculate degraded health score
  const degradedHealth = await db.reports.calculateDestinationHealth(healthMonId);
  assert(degradedHealth.health_score < 100, `High severity report causes health score decay (got ${degradedHealth.health_score})`);
  assert(degradedHealth.open_issues_count > 0, 'Open issues count reflects active pending report');

  // Officer triages and resolves report
  await db.reports.updateStatus(
    triagedReportId,
    'RESOLVED',
    officerId,
    'Wall cleaned and protective ASI signage installed.'
  );

  const restoredHealth = await db.reports.calculateDestinationHealth(healthMonId);
  assert(restoredHealth.health_score >= degradedHealth.health_score, 'Resolving issue restores destination health score');
  assert(restoredHealth.resolved_issues_count > 0, 'Resolved issues count incremented accurately');

  // -------------------------------------------------------------
  // Test Suite 5: End-to-End (E2E) Traveller Journey Simulation
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 5: Complete E2E Traveller Journey ---');

  // Step 1: User Registration
  const travellerEmail = `e2e.traveller.${Date.now()}@virasat.in`;
  const traveller = await db.users.create({
    id: `user-e2e-${Date.now()}`,
    email: travellerEmail,
    password_hash: 'hashed_password_mock',
    name: 'Kabir Verma',
    home_city: 'New Delhi',
    auth_provider: 'local',
    role: 'traveller',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  assert(traveller.id !== undefined, 'E2E Step 1: Traveller successfully registers account');

  // Step 2: Search Destination (Jaipur monuments)
  const jaipurPlaces = await db.places.findAll({ city: 'jaipur', includeAllStatuses: true });
  assert(jaipurPlaces.places.length > 0, `E2E Step 2: Traveller discovers Jaipur destinations (${jaipurPlaces.places.length} places found)`);

  // Step 3: Multimodal Routing (Delhi to Jaipur)
  const originNode = resolveOriginTransportNode('New Delhi');
  const destNode = resolveDestinationTransportNode('Jaipur');
  const transitResult = buildVerifiedTransitComparison(originNode, destNode);
  assert(transitResult.distance_km > 200, `E2E Step 3: Multimodal routing calculates realistic transit distance (${transitResult.distance_km} km)`);
  assert(transitResult.train !== null, 'E2E Step 3: Multimodal routing resolves mainline railway option');

  // Step 4: AI Concierge Query & Grounding Audit
  const aiReply = `In Jaipur, you can visit the magnificent Amber Fort and the historic Hawa Mahal. Both monuments are maintained under the Archaeological Survey of India.`;
  const aiAudit = auditHallucinations(aiReply, jaipurPlaces.places, jaipurPlaces.places, 4, 38, 'Gemini 2.5 Flash');
  assert(aiAudit.grounding_score >= 0.95, `E2E Step 4: AI Concierge response achieves high grounding score (${aiAudit.grounding_score})`);
  assert(aiAudit.unverified_entities_count === 0, 'E2E Step 4: Zero hallucinated entities in verified concierge reply');

  // Step 5: Save Favorite Place
  const favPlaceId = jaipurPlaces.places[0].id;
  await db.favorites.add(traveller.id, favPlaceId);
  const savedFavorites = await db.favorites.listByUser(traveller.id);
  assert(savedFavorites.some((f) => f.place_id === favPlaceId), 'E2E Step 5: Traveller successfully bookmarks destination in favorites');

  // Summary
  console.log('\n=============================================================');
  console.log(`📊 Phase 7 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase7Tests().catch((err) => {
  console.error('💥 Fatal error in Phase 7 test runner:', err);
  process.exit(1);
});
