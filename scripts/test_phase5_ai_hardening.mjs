/**
 * Automated Verification Test Suite for Phase 5:
 * - Hallucination Guardrail & Entity Verification Filter
 * - Grounding Scoring Engine (0.0 to 1.0 calibration)
 * - Sliding-Window Rate Limiting & 429 Throttling Guardrails
 * - Immutable AI Audit Logging (`db.audit_logs`)
 * - Multi-tier Model Fallback & Latency Metrics
 */

import { db } from '../server/src/db/client.ts';
import { auditHallucinations } from '../server/src/modules/ai/ai.router.ts';
import { rateLimiter, resetRateLimitStore } from '../server/src/middleware/rateLimiter.ts';

async function runPhase5Tests() {
  console.log('🚀 [Test] Starting Phase 5: AI Hardening & Grounding Verification...\n');
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
  // Test Suite 1: Grounded Response Audit (High Confidence)
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Grounded Response Audit (High Confidence) ---');
  const placesResult = await db.places.findAll({ limit: 1000 });
  const allPlaces = placesResult.places;

  const verifiedText = `In Jaipur, you can visit the magnificent Amber Fort and the iconic Hawa Mahal. Both are verified monuments maintained by the Archaeological Survey of India.`;
  const verifiedPlaces = allPlaces.filter((p) => p.name.includes('Amber') || p.name.includes('Hawa'));

  const cleanAudit = auditHallucinations(
    verifiedText,
    verifiedPlaces,
    allPlaces,
    4,
    45,
    'Gemini 2.5 Flash'
  );

  assert(cleanAudit.grounding_score >= 0.95, `Grounded response achieves high score (got ${cleanAudit.grounding_score})`);
  assert(cleanAudit.unverified_entities_count === 0, 'No ungrounded claims flagged in verified text');
  assert(cleanAudit.flagged_unverified_claims.length === 0, 'Flagged unverified list is empty');
  assert(cleanAudit.citations_count === 4, 'Citations count preserved in audit metadata');
  assert(cleanAudit.latency_ms === 45, 'Latency accurately captured');
  assert(cleanAudit.model_used === 'Gemini 2.5 Flash', 'Model identifier accurately captured');

  // -------------------------------------------------------------
  // Test Suite 2: Hallucination Detection Guardrail
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: Hallucination Detection Guardrail ---');
  const hallucinatedText = `You should definitely visit the Mystic Crystal Palace and the ancient Skyline Lotus Temple, followed by a tour of the Fictitious Cloud Fort in Jaipur!`;

  const hallucinatedAudit = auditHallucinations(
    hallucinatedText,
    [],
    allPlaces,
    0,
    65,
    'Untrusted Model'
  );

  assert(
    hallucinatedAudit.flagged_unverified_claims.length >= 2,
    `Guardrail successfully flagged ungrounded entities (${hallucinatedAudit.flagged_unverified_claims.join(', ')})`
  );
  assert(
    hallucinatedAudit.unverified_entities_count >= 2,
    `Unverified entity count reflects detected hallucinations (got ${hallucinatedAudit.unverified_entities_count})`
  );
  assert(
    hallucinatedAudit.grounding_score < 0.5,
    `Grounding score heavily penalizes hallucinated claims (got ${hallucinatedAudit.grounding_score})`
  );

  // -------------------------------------------------------------
  // Test Suite 3: Rate Limiting & Throttling Guardrails
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: Sliding-Window Rate Limiting Guardrail ---');
  resetRateLimitStore();

  const testLimiter = rateLimiter({ windowMs: 10000, max: 3, message: 'Too many queries' });
  const mockReq = { user: { id: 'test-user-rate-limit' }, headers: {} };
  const mockHeaders = {};
  let statusCode = 200;
  let jsonResponse = null;

  function createMockRes() {
    const resObj = {
      setHeader: (name, val) => {
        mockHeaders[name] = val;
      },
      status: (code) => {
        statusCode = code;
        return resObj;
      },
      json: (data) => {
        jsonResponse = data;
        return resObj;
      },
    };
    return resObj;
  }

  let nextCalled = 0;
  const mockNext = () => {
    nextCalled++;
  };

  // 3 requests within limit
  testLimiter(mockReq, createMockRes(), mockNext);
  testLimiter(mockReq, createMockRes(), mockNext);
  testLimiter(mockReq, createMockRes(), mockNext);

  assert(nextCalled === 3, 'First 3 requests within quota proceed through next()');
  assert(mockHeaders['X-RateLimit-Limit'] === 3, 'X-RateLimit-Limit header set to 3');
  assert(mockHeaders['X-RateLimit-Remaining'] === 0, 'X-RateLimit-Remaining reaches 0 on third request');

  // 4th request exceeds quota -> 429 Too Many Requests
  const res4 = createMockRes();
  testLimiter(mockReq, res4, mockNext);

  assert(statusCode === 429, `4th burst request rejected with HTTP 429 (got ${statusCode})`);
  assert(jsonResponse?.error === 'RATE_LIMIT_EXCEEDED', 'Response payload contains RATE_LIMIT_EXCEEDED error code');
  assert(mockHeaders['Retry-After'] !== undefined, 'Retry-After header included on 429 response');
  assert(nextCalled === 3, 'next() is NOT called when rate limit is breached');

  // -------------------------------------------------------------
  // Test Suite 4: Immutable AI Audit Trail Logging
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: Immutable AI Audit Trail Logging ---');
  const auditSessionId = `session-audit-${Date.now()}`;
  const auditUserId = `user-ai-auditor-${Date.now()}`;

  await db.audit.log({
    id: `audit-ai-test-${Date.now()}`,
    actor_id: auditUserId,
    action: 'AI_QUERY_GROUNDED',
    entity_type: 'ai_session',
    entity_id: auditSessionId,
    to_value: {
      query: 'Tell me about Hawa Mahal architecture',
      model: 'Gemini 2.5 Flash',
      grounding_score: 1.0,
      citations_count: 5,
      latency_ms: 112,
    },
    created_at: new Date().toISOString(),
  });

  const recentAudits = await db.audit.findAll(50);
  const matchedAudit = recentAudits.find((a) => a.entity_id === auditSessionId && a.action === 'AI_QUERY_GROUNDED');

  assert(matchedAudit !== undefined, 'AI query logged successfully to audit_logs');
  assert(matchedAudit.actor_id === auditUserId, 'Actor ID preserved in audit trail');
  assert(matchedAudit.to_value?.grounding_score === 1.0, 'Grounding score persisted in audit log entry');
  assert(matchedAudit.to_value?.citations_count === 5, 'Citations count persisted in audit log entry');
  assert(matchedAudit.to_value?.latency_ms === 112, 'Latency metrics persisted in audit log entry');

  // -------------------------------------------------------------
  // Test Suite 5: Grounded Deterministic Response Schema Parity
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 5: Response Schema & Provenance Citations ---');
  const citations = await db.placeFacts.findByPlaceId('amber-fort');
  assert(citations.length > 0, 'Database contains granular verified facts for Amber Palace');

  const sampleFact = citations[0];
  assert(sampleFact.fact_key !== undefined, 'Fact record contains fact_key');
  assert(sampleFact.source_url.startsWith('https://'), 'Fact record cites secure https provenance source');

  // Summary
  console.log('\n=============================================================');
  console.log(`📊 Phase 5 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error('💥 Fatal error in Phase 5 test runner:', err);
  process.exit(1);
});
