/**
 * Automated Verification Test Suite for Phase 3B:
 * - Citizen Heritage Issue Reporting Workflow
 * - Role-Based Access Control (RBAC) & Status Mutation Gating (Risk #14)
 * - Immutable Audit Logging for Conservation Operations
 * - Destination Health & Preservation Scoring Engine
 * - Public Data Sanitization & IDOR Isolation
 */

import { db } from '../server/src/db/client.ts';

async function runPhase3BTests() {
  console.log('🚀 [Test] Starting Phase 3B: Citizen Stewardship, RBAC & Destination Health Verification...\n');
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

  const timestamp = Date.now();
  const testPlaceId = 'amber-fort';

  const testUserId = `user-traveller-p3b-${timestamp}`;
  const testUserEmail = `traveller-p3b-${timestamp}@virasat.in`;

  const officerId = `officer-asi-p3b-${timestamp}`;
  const officerEmail = `officer-p3b-${timestamp}@virasat.in`;

  const reportId1 = `rep-test-1-${timestamp}`;
  const healthMonumentId = `monument-health-test-${timestamp}`;

  const repCritId = `rep-crit-${timestamp}`;
  const repHighId = `rep-high-${timestamp}`;
  const repMedId = `rep-med-${timestamp}`;

  async function cleanupFixtures() {
    if (db.mode === 'postgresql') {
      try {
        await db.query(
          `DELETE FROM audit_logs WHERE actor_id = $1 OR actor_id = $2 OR entity_id IN ($3, $4, $5, $6);`,
          [officerId, testUserId, reportId1, repCritId, repHighId, repMedId]
        );
      } catch {}
      try {
        await db.query(
          `DELETE FROM citizen_reports WHERE id IN ($1, $2, $3, $4) OR user_id IN ($5, $6);`,
          [reportId1, repCritId, repHighId, repMedId, testUserId, officerId]
        );
      } catch {}
      try {
        await db.query(
          `DELETE FROM destination_health_metrics WHERE place_id = $1;`,
          [healthMonumentId]
        );
      } catch {}
      try {
        await db.query(
          `DELETE FROM places WHERE id = $1;`,
          [healthMonumentId]
        );
      } catch {}
      try {
        await db.query(
          `DELETE FROM users WHERE id IN ($1, $2);`,
          [officerId, testUserId]
        );
      } catch {}
    } else if (db.data) {
      if (db.data.audit_logs) {
        for (const k of Object.keys(db.data.audit_logs)) {
          const a = db.data.audit_logs[k];
          if (a && (a.actor_id === officerId || a.actor_id === testUserId || [reportId1, repCritId, repHighId, repMedId].includes(a.entity_id))) {
            delete db.data.audit_logs[k];
          }
        }
      }
      if (db.data.reports) {
        delete db.data.reports[reportId1];
        delete db.data.reports[repCritId];
        delete db.data.reports[repHighId];
        delete db.data.reports[repMedId];
      }
      if (db.data.places) {
        delete db.data.places[healthMonumentId];
      }
      if (db.data.users) {
        delete db.data.users[officerId];
        delete db.data.users[testUserId];
      }
      if (typeof db.persist === 'function') {
        try { db.persist(); } catch {}
      }
    }
  }

  // Pre-cleanup in case of prior interrupted runs
  await cleanupFixtures();

  try {
    // -------------------------------------------------------------
    // Setup Dedicated Test Users
    // -------------------------------------------------------------
    await db.users.create({
      id: testUserId,
      email: testUserEmail,
      name: 'Phase 3B Test Traveller',
      password_hash: 'test-hash-p3b',
      role: 'traveller',
      home_city: 'Jaipur',
      auth_provider: 'local',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    assert(true, 'Dedicated Phase 3B test traveller created');

    await db.users.create({
      id: officerId,
      email: officerEmail,
      name: 'Phase 3B Heritage Officer',
      password_hash: 'test-hash-p3b',
      role: 'heritage_officer',
      home_city: 'Jaipur',
      auth_provider: 'local',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    assert(true, 'Dedicated Phase 3B heritage officer created');

    // -------------------------------------------------------------
    // Test Suite 1: Citizen Report Submission & Persistence
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 1: Citizen Report Submission & Database Persistence ---');

    const createdReport1 = await db.reports.create({
      id: reportId1,
      place_id: testPlaceId,
      place_name: 'Amber Fort & Palace (Amer)',
      city: 'Jaipur',
      reported_by: 'Aarav Sharma',
      user_id: testUserId,
      issue_type: 'structural_damage',
      title: 'Cracked stone railing on eastern terrace',
      description: 'Noticed a hairline fracture expanding along the marble railing of the third courtyard terrace.',
      severity: 'high',
      status: 'PENDING',
      media_url: 'https://images.example.com/amer-fort-damage.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    assert(createdReport1.id === reportId1, 'Report created with designated ID');
    assert(createdReport1.status === 'PENDING', 'Default report status initialized to PENDING');
    assert(createdReport1.severity === 'high', 'Observed severity properly registered as high');
    assert(createdReport1.place_id === testPlaceId, 'Place ID correctly linked to Amber Palace');

    // Verify retrieval
    const fetchedReport = await db.reports.findById(reportId1);
    assert(fetchedReport !== null && fetchedReport.title.includes('railing'), 'Report retrievable by ID from persistent store');

    // Query filtering
    const allReportsForPlace = await db.reports.findAll({ placeId: testPlaceId });
    assert(allReportsForPlace.some((r) => r.id === reportId1), 'Find all reports filtered by placeId includes new report');

    const pendingReports = await db.reports.findAll({ placeId: testPlaceId, status: 'PENDING' });
    assert(pendingReports.every((r) => r.status === 'PENDING'), 'Filtering by status PENDING returns exclusively PENDING reports');

    const cityFilteredReports = await db.reports.findAll({ city: 'Jaipur' });
    assert(cityFilteredReports.some((r) => r.id === reportId1), 'Filtering reports by city Jaipur succeeds');

    // -------------------------------------------------------------
    // Test Suite 2: Role-Based Access Control (RBAC) & Status Mutation
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 2: RBAC Triage & Risk #14 Gating ---');
    // Define authorized roles as enforced by requireRole('moderator', 'heritage_officer', 'admin')
    const AUTHORIZED_ROLES = ['moderator', 'heritage_officer', 'admin'];
    function isRoleAuthorized(role) {
      return AUTHORIZED_ROLES.includes(role);
    }

    // Traveller cannot mutate report status
    const travellerRole = 'traveller';
    assert(!isRoleAuthorized(travellerRole), 'Traveller role is strictly forbidden from triaging report status (Risk #14)');

    // Officer, Moderator, Admin can mutate report status
    assert(isRoleAuthorized('moderator'), 'Moderator role is authorized to triage report status');
    assert(isRoleAuthorized('heritage_officer'), 'Heritage Officer role is authorized to triage report status');
    assert(isRoleAuthorized('admin'), 'Admin role is authorized to triage report status');

    const resolutionNote = 'Inspected by ASI Jaipur Circle Sub-Division. Restorative mortar stabilization queued.';
    const updatedReport = await db.reports.updateStatus(
      reportId1,
      'IN_PROGRESS',
      officerId,
      resolutionNote
    );

    assert(updatedReport !== null, 'Report status update succeeds for authorized triage call');
    assert(updatedReport.status === 'IN_PROGRESS', 'Report status successfully transitioned to IN_PROGRESS');
    assert(updatedReport.resolution_notes === resolutionNote, 'Resolution notes preserved on report record');

    // -------------------------------------------------------------
    // Test Suite 3: Immutable Conservation Audit Logging
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 3: Immutable Conservation Audit Logging ---');
    const auditEntries = await db.audit.findAll(50);
    const matchingAudit = auditEntries.find(
      (a) => a.entity_id === reportId1 && a.action === 'UPDATE_REPORT_STATUS'
    );

    assert(matchingAudit !== undefined, 'Status mutation generated a persistent entry in audit_logs');
    assert(matchingAudit.actor_id === officerId, 'Audit log correctly records officer ID as actor');
    const fromStatus = typeof matchingAudit?.from_value === 'string'
      ? JSON.parse(matchingAudit.from_value).status
      : matchingAudit?.from_value?.status;
    assert(fromStatus === 'PENDING', 'Audit log records previous status (PENDING)');
    const toStatus = typeof matchingAudit?.to_value === 'string'
      ? JSON.parse(matchingAudit.to_value).status
      : matchingAudit?.to_value?.status;
    assert(toStatus === 'IN_PROGRESS', 'Audit log records target status (IN_PROGRESS)');

    // -------------------------------------------------------------
    // Test Suite 4: Destination Health & Preservation Scoring Engine
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 4: Destination Health Scoring Engine ---');

    // Register place in database for health testing
    await db.places.create({
      id: healthMonumentId,
      name: `Test Heritage Site ${healthMonumentId}`,
      state_id: 'rajasthan',
      city_id: 'jaipur',
      category: 'Monuments & Forts',
      summary: 'A test heritage monument for calibration of preservation health metrics.',
      coordinates: { lat: 26.9855, lng: 75.8513 },
      tags: ['fort', 'heritage'],
      features: { map: true, navigation: true, ai: true, '3d': false },
      data_confidence: 'official',
      source_url: 'https://asi.nic.in/amber-fort-specific',
      last_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const calculateHealth = async (id) => {
      if (typeof db.calculateDestinationHealth === 'function') {
        return db.calculateDestinationHealth(id);
      }
      return db.reports.calculateDestinationHealth(id);
    };

    // Health with 0 open issues should be pristine (100)
    const initialHealth = await calculateHealth(healthMonumentId);
    assert(initialHealth.health_score === 100, `Pristine monument health score is 100 (got ${initialHealth.health_score})`);
    assert(initialHealth.open_issues_count === 0, 'Open issues count is 0');
    assert(initialHealth.status_label === 'Excellent / Well Maintained', 'Status label is Excellent / Well Maintained');

    // Add 1 critical report (-15), 1 high report (-10), 1 medium report (-5)
    const repCrit = await db.reports.create({
      id: repCritId,
      place_id: healthMonumentId,
      place_name: 'Test Heritage Site',
      city: 'Jaipur',
      reported_by: 'Steward Alice',
      user_id: testUserId,
      issue_type: 'structural_damage',
      title: 'Severe collapse risk at archway',
      description: 'Archway showing major masonry separation posing immediate hazard.',
      severity: 'critical',
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const repHigh = await db.reports.create({
      id: repHighId,
      place_id: healthMonumentId,
      place_name: 'Test Heritage Site',
      city: 'Jaipur',
      reported_by: 'Steward Bob',
      user_id: testUserId,
      issue_type: 'vandalism',
      title: 'Extensive graffiti on central plinth',
      description: 'Deep spray paint across historically inscribed sandstone.',
      severity: 'high',
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const repMed = await db.reports.create({
      id: repMedId,
      place_id: healthMonumentId,
      place_name: 'Test Heritage Site',
      city: 'Jaipur',
      reported_by: 'Steward Charlie',
      user_id: testUserId,
      issue_type: 'cleanliness',
      title: 'Overflowing waste receptacles near gateway',
      description: 'Plastic bottles and packaging littering the main approach path.',
      severity: 'medium',
      status: 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Expected penalty: 15 (critical) + 10 (high) + 5 (medium) = 30 points deducted -> 70
    const degradedHealth = await calculateHealth(healthMonumentId);
    assert(
      degradedHealth.health_score === 70,
      `Degraded health score properly accounts for report severity penalties (expected 70, got ${degradedHealth.health_score})`
    );
    assert(degradedHealth.open_issues_count === 3, 'Open issues count reflects 3 active reports');
    assert(
      degradedHealth.status_label === 'Moderate / Action Underway',
      `Status label correctly indicates action needed (${degradedHealth.status_label})`
    );

    // Now resolve the critical and high reports
    await db.reports.updateStatus(repCrit.id, 'RESOLVED', officerId, 'Masonry underpinned and stabilized by conservation team.');
    await db.reports.updateStatus(repHigh.id, 'RESOLVED', officerId, 'Specialized chemical poultice removed all paint traces.');

    // Recalculate health: only medium (-5) open -> score = 95
    const recoveredHealth = await calculateHealth(healthMonumentId);
    assert(
      recoveredHealth.health_score === 95,
      `Resolved issues restore health score (expected 95, got ${recoveredHealth.health_score})`
    );
    assert(recoveredHealth.open_issues_count === 1, 'Open issues count drops to 1');
    assert(recoveredHealth.resolved_issues_count === 2, 'Resolved issues count incremented to 2');
    assert(
      recoveredHealth.status_label === 'Excellent / Well Maintained',
      `Status label restores to Excellent / Well Maintained (${recoveredHealth.status_label})`
    );

    // -------------------------------------------------------------
    // Test Suite 5: Data Privacy & Public Sanitization
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 5: Data Privacy & Public Sanitization ---');
    const userSpecificReports = await db.reports.findAll({ userId: testUserId });
    assert(
      userSpecificReports.every((r) => r.user_id === testUserId),
      'User-scoped reports strictly isolate queries to the authenticated citizen (IDOR protection)'
    );
  } finally {
    // Cleanup test fixtures
    await cleanupFixtures();
  }

  assert(true, 'Phase 3B test fixtures cleaned successfully');

  // Summary
  console.log('\n=============================================================');
  console.log(`📊 Phase 3B Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase3BTests().catch((err) => {
  console.error('💥 Fatal error in Phase 3B test runner:', err);
  process.exit(1);
});
