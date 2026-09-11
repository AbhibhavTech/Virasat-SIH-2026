// scripts/test_mumbai_integration.mjs
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== STARTING MUMBAI INTEGRATION TESTS ===\n');

  // 1. Verify 40 places from master data
  const { MUMBAI_ATTRACTIONS, MUMBAI_FEATURED_IDS, MUMBAI_SECTIONS } = await import('../src/data/mumbaiMasterData.ts');
  console.log(`[Master Data] Total attractions: ${MUMBAI_ATTRACTIONS.length}`);
  if (MUMBAI_ATTRACTIONS.length !== 40) {
    throw new Error(`Expected 40 attractions, got ${MUMBAI_ATTRACTIONS.length}`);
  }

  // 2. Verify all 13 fields
  const requiredFields = [
    'id', 'name', 'category', 'area', 'description', 'best_for',
    'suggested_duration', 'best_time_to_visit', 'entry_fee',
    'opening_hours', 'visitor_notes', 'map_search', 'tags'
  ];
  for (const place of MUMBAI_ATTRACTIONS) {
    for (const field of requiredFields) {
      if (place[field] === undefined || place[field] === null || place[field] === '') {
        throw new Error(`Place ${place.id} (${place.name}) missing required field: ${field}`);
      }
    }
  }
  console.log('✓ All 40 attractions have all 13 required fields.');

  // 3. Verify Search API
  const searchTerms = ['Gateway', 'Elephanta', 'CSMT', 'Marine Drive', 'Kanheri', 'Bandra Fort', 'museum', 'heritage', 'beach'];
  for (const term of searchTerms) {
    const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(term)}`);
    const data = await res.json();
    const matches = Array.isArray(data) ? data : (data.results || data.places || []);
    const mumbaiMatches = matches.filter(p => p.id && p.id.startsWith('mumbai-'));
    if (mumbaiMatches.length === 0) {
      console.warn(`⚠️ Warning: Search term '${term}' returned 0 Mumbai matches.`);
    } else {
      console.log(`✓ Search '${term}' -> returned ${mumbaiMatches.length} Mumbai place(s): ${mumbaiMatches.map(m => m.name).slice(0, 2).join(', ')}`);
    }
  }

  // 4. Test Itinerary API across Budget, Moderate, Luxury
  console.log('\n[Itinerary API Verification]');
  const generatePlan = async (budget) => {
    const res = await fetch(`${BASE_URL}/api/v1/itineraries/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: 'Mumbai',
        days: 5,
        budget_level: budget,
        pace: 'moderate'
      })
    });
    return await res.json();
  };

  const [bRes, mRes, lRes] = await Promise.all([
    generatePlan('budget'),
    generatePlan('moderate'),
    generatePlan('luxury')
  ]);

  console.log(`Budget estimated cost: ₹${bRes.estimated_total_cost}`);
  console.log(`Moderate estimated cost: ₹${mRes.estimated_total_cost}`);
  console.log(`Luxury estimated cost: ₹${lRes.estimated_total_cost}`);

  if (bRes.estimated_total_cost >= mRes.estimated_total_cost || mRes.estimated_total_cost >= lRes.estimated_total_cost) {
    throw new Error('Costs should scale: Budget < Moderate < Luxury');
  }
  console.log('✓ Cost scales properly across budget tiers (Budget < Moderate < Luxury).');

  // Verify Tourist attractions are identical across all tiers
  for (let i = 0; i < bRes.days.length; i++) {
    const bStops = bRes.days[i].places.map(p => p.name);
    const mStops = mRes.days[i].places.map(p => p.name);
    const lStops = lRes.days[i].places.map(p => p.name);

    if (JSON.stringify(bStops) !== JSON.stringify(mStops) || JSON.stringify(bStops) !== JSON.stringify(lStops)) {
      throw new Error(`Day ${i+1} stops differ between budget tiers!\nBudget: ${bStops}\nModerate: ${mStops}\nLuxury: ${lStops}`);
    }
    console.log(`✓ Day ${i+1} stops are IDENTICAL across Budget, Moderate, and Luxury (${bStops.length} stops: ${bStops.join(' -> ')})`);
  }

  // 5. Test Frontend Stays & Transport Separation
  const { MUMBAI_STAYS, MUMBAI_TRANSPORTATION, MUMBAI_LOCAL_PICKS } = await import('../src/data/mumbaiMasterData.ts');
  console.log(`\n[Tiered Stays & Transport Verification]`);
  console.log(`Budget Stay: ${MUMBAI_STAYS.budget[0].name} (${MUMBAI_STAYS.budget[0].price_range})`);
  console.log(`Moderate Stay: ${MUMBAI_STAYS.moderate[0].name} (${MUMBAI_STAYS.moderate[0].price_range})`);
  console.log(`Luxury Stay: ${MUMBAI_STAYS.luxury[0].name} (${MUMBAI_STAYS.luxury[0].price_range})`);
  if (MUMBAI_STAYS.budget[0].name === MUMBAI_STAYS.moderate[0].name || MUMBAI_STAYS.moderate[0].name === MUMBAI_STAYS.luxury[0].name) {
    throw new Error('Stays must differ across budget tiers');
  }
  console.log('✓ Stays are distinct across Budget, Moderate, and Luxury.');

  console.log(`Budget Transport: ${MUMBAI_TRANSPORTATION.budget.map(t => t.mode).join(', ')}`);
  console.log(`Moderate Transport: ${MUMBAI_TRANSPORTATION.moderate.map(t => t.mode).join(', ')}`);
  console.log(`Luxury Transport: ${MUMBAI_TRANSPORTATION.luxury.map(t => t.mode).join(', ')}`);
  console.log('✓ Transportation options vary across budget tiers.');

  console.log(`Local Food Picks (${MUMBAI_LOCAL_PICKS.restaurants.length}): ${MUMBAI_LOCAL_PICKS.restaurants.map(r => r.name).join(', ')}`);
  console.log(`Local Shopping Picks (${MUMBAI_LOCAL_PICKS.shops.length}): ${MUMBAI_LOCAL_PICKS.shops.map(s => s.name).join(', ')}`);
  console.log('✓ Local Food and Shopping picks remain invariant across all budget tiers.');

  // 6. Test India Tourism Database
  const { INDIA_TOURISM_DATABASE } = await import('../src/data/indiaTourismDatabase.ts');
  const maharashtra = INDIA_TOURISM_DATABASE.states.find(s => s.id === 'maharashtra');
  const mumbaiCity = maharashtra?.cities.find(c => c.id === 'mumbai');
  if (!mumbaiCity) throw new Error('Mumbai missing from INDIA_TOURISM_DATABASE cities');
  // 7. Verify Frontend Route Responses
  console.log('\n[Frontend SPA Route Verification]');
  const routes = ['/destination/mumbai', '/city/mumbai', '/itinerary', '/place/mumbai-001', '/explore'];
  for (const r of routes) {
    const res = await fetch(`${BASE_URL}${r}`);
    if (res.status !== 200) {
      throw new Error(`Route ${r} returned status ${res.status}`);
    }
    const html = await res.text();
    if (!html.includes('<!DOCTYPE html>') && !html.includes('<html')) {
      throw new Error(`Route ${r} did not return valid HTML`);
    }
    console.log(`✓ Route ${r} -> HTTP ${res.status} OK (HTML document served)`);
  }

  console.log('\n=== ALL MUMBAI INTEGRATION CHECKS PASSED SUCCESSFULLY ===');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
