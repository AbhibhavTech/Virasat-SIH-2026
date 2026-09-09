/**
 * Phase 9 Verification Suite: SEO, Performance & Product Analytics
 *
 * Validates:
 * 1. Robots.txt, dynamic sitemap.xml generation & crawler directives
 * 2. Static and dynamic OpenGraph, Twitter cards, Canonical links & JSON-LD schemas
 * 3. Privacy-first telemetry ingestion endpoint with strict sanitization
 * 4. Telemetry aggregation summary endpoint (metrics, top searches, top places)
 * 5. Client analytics service methods and non-blocking telemetry integration
 */

import fs from 'fs';
import path from 'path';
import { db } from '../server/src/db/client.js';
import { seoRouter } from '../server/src/modules/seo/seo.router.js';
import { analyticsRouter } from '../server/src/modules/analytics/analytics.router.js';

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runPhase9Tests() {
  console.log('\n🚀 [Test] Starting Phase 9: SEO, Performance & Product Analytics Verification...\n');

  // Initialize DB
  await db.init();

  // ----------------------------------------------------------------
  // Test Suite 1: Robots.txt & Dynamic Sitemap Validation
  // ----------------------------------------------------------------
  console.log('--- Test Suite 1: Robots.txt & Dynamic Sitemap Generation ---');

  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  assert(fs.existsSync(robotsPath), 'public/robots.txt file exists on filesystem');

  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  assert(robotsContent.includes('User-agent: *'), 'robots.txt specifies wildcard User-agent: *');
  assert(robotsContent.includes('Allow: /search'), 'robots.txt permits indexing of /search');
  assert(robotsContent.includes('Allow: /place/'), 'robots.txt permits indexing of /place/ routes');
  assert(robotsContent.includes('Disallow: /api/'), 'robots.txt protects /api/ internal backend routes');
  assert(robotsContent.includes('Sitemap: https://virasat.in/sitemap.xml'), 'robots.txt declares canonical sitemap.xml');

  // Test Sitemap Generation via seoRouter
  assert(typeof seoRouter === 'function', 'seoRouter is exported as an Express router');

  let sitemapXml = '';
  let sitemapContentType = '';
  let sitemapStatus = 0;

  const mockSitemapRes = {
    setHeader: (key, val) => {
      if (key.toLowerCase() === 'content-type') sitemapContentType = val;
    },
    status: (code) => {
      sitemapStatus = code;
      return mockSitemapRes;
    },
    send: (body) => {
      sitemapXml = body;
    },
  };

  // Trigger GET /sitemap.xml route handler
  const sitemapRoute = seoRouter.stack.find((layer) => layer.route && layer.route.path === '/sitemap.xml');
  assert(Boolean(sitemapRoute), 'seoRouter defines GET /sitemap.xml route');

  await sitemapRoute.route.stack[0].handle({}, mockSitemapRes);

  assert(sitemapStatus === 200, 'Sitemap endpoint returns HTTP 200 OK');
  assert(sitemapContentType.includes('xml'), 'Sitemap Content-Type declares application/xml');
  assert(sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Sitemap begins with valid XML declaration');
  assert(sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), 'Sitemap defines standard sitemap 0.9 namespace');
  assert(sitemapXml.includes('https://virasat.in/search'), 'Sitemap includes core /search route');
  assert(sitemapXml.includes('https://virasat.in/place/gateway-of-india'), 'Sitemap dynamically includes Gateway of India destination');
  assert(sitemapXml.includes('https://virasat.in/place/taj-mahal'), 'Sitemap dynamically includes Taj Mahal destination');
  assert(sitemapXml.includes('<changefreq>'), 'Sitemap entries specify changefreq tag');
  assert(sitemapXml.includes('<priority>'), 'Sitemap entries specify priority tag');

  // ----------------------------------------------------------------
  // Test Suite 2: Static & Dynamic OpenGraph, Twitter Cards & JSON-LD
  // ----------------------------------------------------------------
  console.log('\n--- Test Suite 2: Meta Tags, OpenGraph & JSON-LD Schema ---');

  const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  assert(indexHtml.includes('property="og:title"'), 'index.html defines og:title meta tag');
  assert(indexHtml.includes('property="og:description"'), 'index.html defines og:description meta tag');
  assert(indexHtml.includes('property="og:image"'), 'index.html defines og:image meta tag');
  assert(indexHtml.includes('property="og:site_name"'), 'index.html defines og:site_name meta tag');
  assert(indexHtml.includes('name="twitter:card" content="summary_large_image"'), 'index.html defines Twitter large image card');
  assert(indexHtml.includes('name="theme-color" content="#FF671F"'), 'index.html defines tricolour saffron theme-color');
  assert(indexHtml.includes('rel="canonical"'), 'index.html defines canonical link element');
  assert(indexHtml.includes('"@type": "WebSite"'), 'index.html provides structured WebSite schema.org JSON-LD');
  assert(indexHtml.includes('"@type": "SearchAction"'), 'index.html embeds SearchAction deep-link discovery for Google');

  const seoUtilPath = path.join(process.cwd(), 'src', 'utils', 'seo.ts');
  assert(fs.existsSync(seoUtilPath), 'src/utils/seo.ts utility exists');
  const seoUtilContent = fs.readFileSync(seoUtilPath, 'utf8');
  assert(seoUtilContent.includes('generateTouristAttractionSchema'), 'seo.ts provides generateTouristAttractionSchema generator');
  assert(seoUtilContent.includes('generateWebSiteSchema'), 'seo.ts provides generateWebSiteSchema generator');
  assert(seoUtilContent.includes('updatePageSEO'), 'seo.ts exports dynamic updatePageSEO DOM updater');

  const seoHeadPath = path.join(process.cwd(), 'src', 'components', 'common', 'SEOHead.tsx');
  assert(fs.existsSync(seoHeadPath), 'src/components/common/SEOHead.tsx dynamic component exists');

  // ----------------------------------------------------------------
  // Test Suite 3: Privacy-First Analytics Ingestion Endpoint
  // ----------------------------------------------------------------
  console.log('\n--- Test Suite 3: Analytics Event Ingestion API ---');

  assert(typeof analyticsRouter === 'function', 'analyticsRouter is exported as an Express router');

  const postEventRoute = analyticsRouter.stack.find(
    (layer) => layer.route && layer.route.path === '/event' && layer.route.methods.post
  );
  assert(Boolean(postEventRoute), 'analyticsRouter defines POST /event route');

  // 1. Rejection of illegal event types
  let rejectedStatus = 0;
  let rejectedBody = null;
  const mockRejectRes = {
    status: (code) => {
      rejectedStatus = code;
      return {
        json: (data) => {
          rejectedBody = data;
        },
      };
    },
  };

  await postEventRoute.route.stack[0].handle(
    { body: { event_type: 'illegal_unregistered_event' }, ip: '127.0.0.1' },
    mockRejectRes
  );
  assert(rejectedStatus === 400, 'Invalid event_type is rejected with HTTP 400 Bad Request');
  assert(Boolean(rejectedBody.error), 'Rejection response returns descriptive error');

  // 2. Acceptance of legitimate telemetry events
  let acceptedStatus = 0;
  let acceptedBody = null;
  const mockAcceptRes = {
    status: (code) => {
      acceptedStatus = code;
      return {
        json: (data) => {
          acceptedBody = data;
        },
      };
    },
  };

  await postEventRoute.route.stack[0].handle(
    {
      body: {
        event_type: 'search_query',
        path: '/search',
        session_id: 'sess_test_123',
        metadata: {
          query: 'hawa mahal jaipur',
          result_count: 5,
          user_password: 'SECRET_SHOULD_BE_STRIPPED', // Should be purged by sanitizer
        },
      },
      ip: '192.168.1.50',
    },
    mockAcceptRes
  );

  assert(acceptedStatus === 202, 'Legitimate event accepted with HTTP 202 Accepted');
  assert(acceptedBody.status === 'accepted', 'Response status confirmed as accepted');

  // 3. Verify sanitization and audit persistence
  const auditLogs = await db.audit_logs.findAll(50);
  const recordedEvent = auditLogs.find(
    (log) => log.entity_id === 'search_query' && (log.to_value?.metadata?.query === 'hawa mahal jaipur' || log.details?.metadata?.query === 'hawa mahal jaipur')
  );

  assert(Boolean(recordedEvent), 'Event persisted into immutable audit logs store');
  const details = recordedEvent.to_value || recordedEvent.details;
  assert(!details.metadata.user_password, 'Sensitive secret fields stripped from telemetry payload (Zero PII)');
  assert(details.ip_hash && !details.ip_hash.includes('192.168.1.50'), 'IP address anonymized with cryptographic salt hash');

  // Ingest additional diverse telemetry events for summary verification
  await postEventRoute.route.stack[0].handle(
    {
      body: {
        event_type: 'place_viewed',
        path: '/place/taj-mahal',
        metadata: { place_id: 'taj-mahal', name: 'Taj Mahal' },
      },
    },
    mockAcceptRes
  );

  await postEventRoute.route.stack[0].handle(
    {
      body: {
        event_type: 'route_calculated',
        path: '/place/gateway-of-india',
        metadata: { from: 'csmt', to: 'gateway-of-india', mode: 'METRO' },
      },
    },
    mockAcceptRes
  );

  await postEventRoute.route.stack[0].handle(
    {
      body: {
        event_type: '3d_viewed',
        path: '/heritage-3d',
        metadata: { monument_id: 'hawa-mahal' },
      },
    },
    mockAcceptRes
  );

  // ----------------------------------------------------------------
  // Test Suite 4: Analytics Aggregation Summary API
  // ----------------------------------------------------------------
  console.log('\n--- Test Suite 4: Analytics Summary Aggregation API ---');

  const summaryRoute = analyticsRouter.stack.find(
    (layer) => layer.route && layer.route.path === '/summary' && layer.route.methods.get
  );
  assert(Boolean(summaryRoute), 'analyticsRouter defines GET /summary route');

  let summaryJson = null;
  const mockSummaryRes = {
    json: (data) => {
      summaryJson = data;
    },
    status: (code) => mockSummaryRes,
  };

  await summaryRoute.route.stack[0].handle({}, mockSummaryRes);

  assert(Boolean(summaryJson), 'Analytics summary returned valid response');
  assert(summaryJson.status === 'success', 'Summary reports status: success');
  assert(typeof summaryJson.platform_metrics.total_verified_places === 'number', 'Summary counts total verified places');
  assert(summaryJson.platform_metrics.total_verified_places > 0, 'Total verified places reflects database seeded count');
  assert(summaryJson.platform_metrics.ai_grounding_compliance_rate === 100, 'AI grounding compliance certified at 100%');
  assert(summaryJson.platform_metrics.total_telemetry_events >= 4, 'Total telemetry events aggregates recent actions');
  assert(summaryJson.event_breakdown.search_query >= 1, 'Event breakdown tracks search queries');
  assert(summaryJson.event_breakdown.place_viewed >= 1, 'Event breakdown tracks place views');
  assert(summaryJson.event_breakdown.route_calculated >= 1, 'Event breakdown tracks multimodal routes calculated');
  assert(summaryJson.popular_searches.length > 0, 'Popular searches list aggregates trending terms');
  assert(summaryJson.popular_searches.some((s) => s.query.includes('hawa mahal')), 'Recorded search query appears in popular searches');

  // ----------------------------------------------------------------
  // Test Suite 5: Frontend Analytics Service & UI Integration
  // ----------------------------------------------------------------
  console.log('\n--- Test Suite 5: Frontend Analytics Client & UI Integration ---');

  const analyticsClientPath = path.join(process.cwd(), 'src', 'services', 'analytics.ts');
  assert(fs.existsSync(analyticsClientPath), 'src/services/analytics.ts client exists');
  const clientContent = fs.readFileSync(analyticsClientPath, 'utf8');
  assert(clientContent.includes('trackPageView'), 'analytics service provides trackPageView()');
  assert(clientContent.includes('trackSearch'), 'analytics service provides trackSearch()');
  assert(clientContent.includes('trackPlaceView'), 'analytics service provides trackPlaceView()');
  assert(clientContent.includes('trackRouteCalculation'), 'analytics service provides trackRouteCalculation()');
  assert(clientContent.includes('track3DView'), 'analytics service provides track3DView()');
  assert(clientContent.includes('getSummary'), 'analytics service provides getSummary() fetcher');

  const modalPath = path.join(process.cwd(), 'src', 'components', 'analytics', 'AnalyticsDashboardModal.tsx');
  assert(fs.existsSync(modalPath), 'AnalyticsDashboardModal component exists');
  const modalContent = fs.readFileSync(modalPath, 'utf8');
  assert(modalContent.includes('SIH Evaluation Metrics'), 'Modal displays SIH Evaluation Metrics');
  assert(modalContent.includes('Trending Heritage Searches'), 'Modal renders trending heritage searches');
  assert(modalContent.includes('Most Explored Monuments'), 'Modal renders most explored monuments');

  const appContent = fs.readFileSync(path.join(process.cwd(), 'src', 'App.tsx'), 'utf8');
  assert(appContent.includes('AnalyticsDashboardModal'), 'App.tsx mounts AnalyticsDashboardModal');
  assert(appContent.includes('analytics.trackPageView'), 'App.tsx tracks page views upon route transition');

  console.log('\n=============================================================');
  console.log(`📊 Phase 9 Test Results: ${passedTests} Passed, ${totalTests - passedTests} Failed`);
  console.log('=============================================================\n');
}

runPhase9Tests().catch((err) => {
  console.error('\n❌ Phase 9 Verification Suite Failed:', err);
  process.exit(1);
});
