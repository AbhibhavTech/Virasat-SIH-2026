/**
 * Automated Verification Test Suite for Phase 3:
 * - Persistent Itineraries CRUD & Cascading Days/Stops
 * - Multimodal Routing & Regulated Fares
 * - Grounded AI Concierge & Provenance Citations
 */

import { db } from '../server/src/db/client.ts';
import {
  resolveOriginTransportNode,
  resolveDestinationTransportNode,
  buildVerifiedTransitComparison,
} from '../src/server/transportResolver.ts';
import { findConnectedRailRoute, MAJOR_RAILWAY_STATIONS } from '../src/server/railwayRoutingEngine.ts';
import { OFFICIAL_TARIFF_BENCHMARKS } from '../server/src/modules/routing/routing.router.ts';
import { getVerifiedCityPlan } from '../src/data/cityItineraryData.ts';

async function runPhase3Tests() {
  console.log('🚀 [Test] Starting Phase 3: Core Features Verification...\n');
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
  // Test 1: Persistent Multi-Day Itinerary CRUD
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Persistent Multi-Day Itinerary & IDOR Security ---');
  const testUserId = 'test-user-p3';
  const itinId = `itin-test-${Date.now()}`;

  const createdItin = await db.itineraries.create(
    {
      id: itinId,
      user_id: testUserId,
      title: 'Jaipur 3-Day Heritage & Forts Circuit',
      destination: 'Jaipur',
      city: 'Jaipur',
      state: 'Rajasthan',
      days_count: 3,
      pace: 'moderate',
      budget_level: 'moderate',
      summary: 'Curated royal heritage circuit including Amber Palace, Hawa Mahal, and City Palace.',
      total_cost: 2850,
      is_public: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    [
      {
        day_number: 1,
        area_title: 'Walled Pink City & Bazaars',
        theme: 'Historic Architecture',
        notes: 'Visit Hawa Mahal early in the morning for best light.',
        stops: [
          {
            place_id: 'hawa-mahal',
            place_name: 'Hawa Mahal',
            stop_order: 1,
            arrival_time: '09:00',
            duration_minutes: 60,
            travel_mode: 'Walking',
            travel_duration_minutes: 0,
            travel_distance_km: 0,
            estimated_cost: 50,
            notes: 'Palace of Winds facade and museum.',
          },
          {
            place_id: 'jantar-mantar-jaipur',
            place_name: 'Jantar Mantar',
            stop_order: 2,
            arrival_time: '10:30',
            duration_minutes: 75,
            travel_mode: 'Walk',
            travel_duration_minutes: 10,
            travel_distance_km: 0.8,
            estimated_cost: 50,
            notes: 'UNESCO astronomical observatory.',
          },
        ],
      },
      {
        day_number: 2,
        area_title: 'Amer Fort & Nahargarh Ridge',
        theme: 'Hilltop Fortresses',
        stops: [
          {
            place_id: 'amber-palace',
            place_name: 'Amber Palace',
            stop_order: 1,
            arrival_time: '09:30',
            duration_minutes: 120,
            travel_mode: 'Auto-Rickshaw / Cab',
            travel_duration_minutes: 25,
            travel_distance_km: 11.0,
            estimated_cost: 100,
            notes: 'Sheesh Mahal mirror palace.',
          },
        ],
      },
    ]
  );

  assert(createdItin.id === itinId, 'Itinerary record created in persistent database');

  // Verify full retrieval with nested days and ordered stops
  const fullItin = await db.itineraries.findFullById(itinId);
  assert(fullItin !== null, 'Retrieved full itinerary by ID');
  assert(fullItin?.days.length === 2, `Itinerary has 2 days attached (got ${fullItin?.days.length})`);
  assert(fullItin?.days[0].stops.length === 2, `Day 1 has 2 stops attached (got ${fullItin?.days[0].stops.length})`);
  assert(fullItin?.days[0].stops[0].place_name === 'Hawa Mahal', 'Day 1 Stop 1 is Hawa Mahal');
  assert(fullItin?.days[1].stops[0].place_name === 'Amber Palace', 'Day 2 Stop 1 is Amber Palace');

  // IDOR Protection Test
  const strangerUserId = 'stranger-user-999';
  const unauthorizedUpdate = await db.itineraries.update(itinId, strangerUserId, { title: 'Hacked Title' });
  assert(unauthorizedUpdate === null, 'IDOR security: Unauthorized user cannot update another user itinerary');

  const unauthorizedDelete = await db.itineraries.delete(itinId, strangerUserId);
  assert(unauthorizedDelete === false, 'IDOR security: Unauthorized user cannot delete another user itinerary');

  // Authorized Update
  const authorizedUpdate = await db.itineraries.update(itinId, testUserId, { total_cost: 3100 });
  assert(authorizedUpdate?.total_cost === 3100, 'Authorized owner can successfully update itinerary');

  // Authorized Delete & Cascade Check
  const authorizedDelete = await db.itineraries.delete(itinId, testUserId);
  assert(authorizedDelete === true, 'Authorized owner can delete itinerary');

  const deletedItin = await db.itineraries.findFullById(itinId);
  assert(deletedItin === null, 'Itinerary deleted from database');
  const orphanDays = await db.itineraryDays.findByItinerary(itinId);
  assert(orphanDays.length === 0, 'Child days were cascade deleted');
  const orphanStops = await db.itineraryStops.findByItinerary(itinId);
  assert(orphanStops.length === 0, 'Child stops were cascade deleted');

  // -------------------------------------------------------------
  // Test 2: Algorithmic City Itinerary Generator
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: Algorithmic City Itinerary Generator ---');
  const cityPlan = getVerifiedCityPlan('Jaipur', 3, 'moderate', 'moderate');
  assert(cityPlan.city_name === 'Jaipur', 'Generated plan for Jaipur');
  assert(cityPlan.days.length === 3, 'Plan contains exactly 3 days');
  assert(cityPlan.days[0].places.length >= 2, 'Day 1 contains verified places');

  // -------------------------------------------------------------
  // Test 3: Multimodal Routing & Regulated Fares
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: Multimodal Transit & Regulated Tariffs ---');
  const originNode = resolveOriginTransportNode('Mumbai');
  const destNode = resolveDestinationTransportNode('New Delhi');

  assert(originNode !== null, 'Resolved origin node for Mumbai');
  assert(originNode?.city.toLowerCase() === 'mumbai', `Origin city is Mumbai (got ${originNode?.city})`);
  assert(destNode.city.toLowerCase() === 'delhi' || destNode.city.toLowerCase() === 'new delhi', `Destination city is Delhi (got ${destNode.city})`);

  const transitComp = buildVerifiedTransitComparison(originNode, destNode);
  assert(transitComp.distance_km > 1000, `Haversine distance is realistic (>1000 km, got ${transitComp.distance_km} km)`);
  assert(transitComp.train !== undefined, 'Train transit option is available');
  assert(transitComp.air !== undefined, 'Air transit option is available');
  assert(transitComp.road !== undefined, 'Road transit option is available');

  // Verify railway station registry
  const stationCount = Object.keys(MAJOR_RAILWAY_STATIONS).length;
  assert(stationCount >= 10, `Major railway station registry loaded (${stationCount} stations)`);
  assert(MAJOR_RAILWAY_STATIONS['CSMT'] !== undefined || MAJOR_RAILWAY_STATIONS['NDLS'] !== undefined, 'CSMT or NDLS stations present in registry');

  // Verify official tariff benchmarks
  assert(OFFICIAL_TARIFF_BENCHMARKS.mumbai_metropolitan.auto_rickshaw.minimum_fare === 23, 'Mumbai auto regulated minimum fare is ₹23');
  assert(OFFICIAL_TARIFF_BENCHMARKS.delhi_ncr.auto_rickshaw.minimum_fare === 30, 'Delhi auto regulated minimum fare is ₹30');
  assert(OFFICIAL_TARIFF_BENCHMARKS.national_railway_benchmarks.sleeper_sl_per_km > 0, 'IRCTC sleeper rate per km benchmark defined');

  // -------------------------------------------------------------
  // Test 4: Grounded AI Sessions & Provenance Citations
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: Grounded AI Sessions & Citations ---');
  const aiSessionId = `test-ai-${Date.now()}`;
  const aiSession = await db.aiSessions.create({
    id: aiSessionId,
    user_id: testUserId,
    title: 'Jaipur Heritage Inquiry',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  assert(aiSession.id === aiSessionId, 'AI chat session created');

  const userMsg = await db.aiMessages.create({
    id: `msg-u-${Date.now()}`,
    session_id: aiSessionId,
    role: 'user',
    content: 'Which monuments should I visit in Jaipur and what are the visiting hours?',
    created_at: new Date().toISOString(),
  });
  assert(userMsg.role === 'user', 'User message logged');

  const asstMsg = await db.aiMessages.create({
    id: `msg-a-${Date.now()}`,
    session_id: aiSessionId,
    role: 'assistant',
    content: 'In Jaipur, top verified monuments are Hawa Mahal (09:00 AM - 05:00 PM) and Amber Palace.',
    created_at: new Date().toISOString(),
  });
  assert(asstMsg.role === 'assistant', 'Assistant message logged');

  // Grounding Citation Record
  const groundingRec = await db.aiGroundings.create({
    id: `grd-${Date.now()}`,
    message_id: asstMsg.id,
    place_id: 'hawa-mahal',
    field_name: 'visiting_hours',
    confidence: 'OFFICIAL',
    source_name: 'Archaeological Survey of India (ASI)',
    source_url: 'https://asi.nic.in',
    created_at: new Date().toISOString(),
  });
  assert(groundingRec.place_id === 'hawa-mahal', 'AI Grounding record linked to place_id');
  assert(groundingRec.source_url.startsWith('https://'), `Cites valid https URL: ${groundingRec.source_url}`);

  const sessionHistory = await db.aiMessages.findBySession(aiSessionId);
  assert(sessionHistory.length === 2, 'Session history contains exactly 2 messages');
  const sessionGroundings = await db.aiGroundings.findBySession(aiSessionId);
  assert(sessionGroundings.length === 1, 'Session groundings retrieved successfully');

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log(`\n=============================================================`);
  console.log(`Phase 3 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`=============================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase3Tests().catch((err) => {
  console.error('Fatal error in Phase 3 test runner:', err);
  process.exit(1);
});
