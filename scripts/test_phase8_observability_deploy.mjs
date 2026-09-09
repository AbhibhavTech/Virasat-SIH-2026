/**
 * Automated Verification Test Suite for Phase 8:
 * - Containerization Configuration Integrity (Dockerfile, .dockerignore, docker-compose.yml)
 * - CI/CD Pipeline Validation (.github/workflows/ci.yml)
 * - Health & Readiness Telemetry Probes (/api/health, /api/ready)
 * - Security Headers & Observability Middleware (X-Request-Id, nosniff, frame-options)
 * - Frontend Bundle Secret Sanitization (Zero API keys or DB credentials in client assets)
 */

import fs from 'fs';
import path from 'path';
import { db } from '../server/src/db/client.ts';
import { healthRouter } from '../server/src/modules/health/health.router.ts';
import { securityHeaders, requestLogger } from '../server/src/middleware/observability.ts';

async function runPhase8Tests() {
  console.log('🚀 [Test] Starting Phase 8: Observability, Deployment & CI/CD Verification...\n');
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

  const rootDir = process.cwd();

  // -------------------------------------------------------------
  // Test Suite 1: Containerization Configuration Integrity
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Containerization Configuration Integrity ---');
  const dockerfilePath = path.join(rootDir, 'Dockerfile');
  assert(fs.existsSync(dockerfilePath), 'Dockerfile exists in project root');

  const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf-8');
  assert(dockerfileContent.includes('AS builder'), 'Dockerfile implements multi-stage builder stage');
  assert(dockerfileContent.includes('AS runner'), 'Dockerfile implements minimal production runner stage');
  assert(dockerfileContent.includes('USER node'), 'Dockerfile enforces unprivileged non-root node user (CIS benchmark)');
  assert(dockerfileContent.includes('HEALTHCHECK'), 'Dockerfile defines container healthcheck instruction');
  assert(dockerfileContent.includes('/api/health'), 'Dockerfile healthcheck probes /api/health');

  const dockerignorePath = path.join(rootDir, '.dockerignore');
  assert(fs.existsSync(dockerignorePath), '.dockerignore file exists');
  const dockerignoreContent = fs.readFileSync(dockerignorePath, 'utf-8');
  assert(dockerignoreContent.includes('node_modules'), '.dockerignore excludes node_modules');
  assert(dockerignoreContent.includes('.env'), '.dockerignore excludes local environment secrets');

  const composePath = path.join(rootDir, 'docker-compose.yml');
  assert(fs.existsSync(composePath), 'docker-compose.yml exists');
  const composeContent = fs.readFileSync(composePath, 'utf-8');
  assert(composeContent.includes('healthcheck:'), 'docker-compose specifies automated healthcheck');

  // -------------------------------------------------------------
  // Test Suite 2: CI Pipeline Validation
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: CI Pipeline Validation (.github/workflows/ci.yml) ---');
  const ciPath = path.join(rootDir, '.github', 'workflows', 'ci.yml');
  assert(fs.existsSync(ciPath), 'GitHub Actions CI workflow file exists');

  const ciContent = fs.readFileSync(ciPath, 'utf-8');
  assert(ciContent.includes('push:') && ciContent.includes('pull_request:'), 'CI triggers on both push and pull_request');
  assert(ciContent.includes('npm run lint'), 'CI executes TypeScript type checking (npm run lint)');
  assert(ciContent.includes('npm test'), 'CI executes full regression test suite (npm test)');
  assert(ciContent.includes('npm run build'), 'CI executes production bundle compilation');
  assert(ciContent.includes('Secret Hygiene Audit'), 'CI includes automated Secret Hygiene audit step');

  // -------------------------------------------------------------
  // Test Suite 3: Observability & Health Telemetry
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: Observability & Health Telemetry Probes ---');
  
  // Mock request/response for /health
  let healthPayload = null;
  const mockHealthRes = {
    json: (data) => {
      healthPayload = data;
    },
  };
  const mockReq = { headers: {}, method: 'GET', url: '/health' };

  // Trigger health handler (router stack inspection)
  const healthLayer = healthRouter.stack.find((s) => s.route?.path === '/health');
  assert(healthLayer !== undefined, 'healthRouter defines GET /health route');
  healthLayer.route.stack[0].handle(mockReq, mockHealthRes);

  assert(healthPayload?.status === 'ok', 'Health probe reports status: "ok"');
  assert(healthPayload?.version === '1.0.0', 'Health probe includes service semantic version');
  assert(typeof healthPayload?.uptime_seconds === 'number', 'Health probe includes numeric process uptime');
  assert(healthPayload?.memory?.rss_mb > 0, 'Health probe reports active resident memory usage');

  // Mock request/response for /ready
  let readyPayload = null;
  let readyStatusCode = 200;
  const mockReadyRes = {
    status: (code) => {
      readyStatusCode = code;
      return {
        json: (data) => {
          readyPayload = data;
        },
      };
    },
    json: (data) => {
      readyPayload = data;
    },
  };

  const readyLayer = healthRouter.stack.find((s) => s.route?.path === '/ready');
  assert(readyLayer !== undefined, 'healthRouter defines GET /ready route');
  await readyLayer.route.stack[0].handle(mockReq, mockReadyRes);

  assert(readyStatusCode === 200, 'Readiness probe returns HTTP 200 OK');
  assert(readyPayload?.status === 'ready', 'Readiness probe reports status: "ready"');
  assert(readyPayload?.database?.status === 'healthy', 'Readiness probe confirms database connection is healthy');
  assert(readyPayload?.database?.total_places > 0, 'Readiness probe confirms catalog contains seeded places');

  // -------------------------------------------------------------
  // Test Suite 4: Security Headers & Correlation Tracking
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: Security Headers & Correlation Tracking ---');
  const headersSet = {};
  const mockSecRes = {
    setHeader: (k, v) => {
      headersSet[k] = v;
    },
    on: () => {},
  };
  let nextCalled = false;
  securityHeaders(mockReq, mockSecRes, () => {
    nextCalled = true;
  });

  assert(nextCalled, 'securityHeaders invokes next() middleware');
  assert(headersSet['X-Content-Type-Options'] === 'nosniff', 'Security header nosniff enforced');
  assert(headersSet['X-Frame-Options'] === 'SAMEORIGIN', 'Security header SAMEORIGIN clickjacking defense enforced');
  assert(headersSet['X-XSS-Protection'] === '1; mode=block', 'Security header XSS protection enforced');
  assert(headersSet['Referrer-Policy'] === 'strict-origin-when-cross-origin', 'Strict referrer policy enforced');

  // -------------------------------------------------------------
  // Test Suite 5: Frontend Bundle Secret Sanitization
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 5: Frontend Bundle Secret Sanitization ---');
  const distAssetsDir = path.join(rootDir, 'dist', 'assets');
  if (fs.existsSync(distAssetsDir)) {
    const assetFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.js'));
    assert(assetFiles.length > 0, `Compiled frontend assets detected (${assetFiles.length} bundles)`);

    let leakedSecretsCount = 0;
    for (const file of assetFiles) {
      const content = fs.readFileSync(path.join(distAssetsDir, file), 'utf-8');
      if (content.includes('AIzaSy') || content.includes('postgres://') || content.includes('postgresql://')) {
        leakedSecretsCount++;
        console.error(`  ❌ Credential leak detected in client bundle: ${file}`);
      }
    }
    assert(leakedSecretsCount === 0, 'Frontend bundles are completely free of raw API keys and DB connection strings');
  } else {
    console.log('  ⚠️ dist/assets not yet compiled. Running bundle check against src/ config files.');
    const clientEnv = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf-8') : '';
    assert(!clientEnv.includes('VITE_GEMINI_API_KEY'), 'Raw Gemini API key is never exposed via VITE_ public prefix');
  }

  // Summary
  console.log('\n=============================================================');
  console.log(`📊 Phase 8 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase8Tests().catch((err) => {
  console.error('💥 Fatal error in Phase 8 test runner:', err);
  process.exit(1);
});
