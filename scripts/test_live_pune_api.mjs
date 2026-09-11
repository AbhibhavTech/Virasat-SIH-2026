// scripts/test_live_pune_api.mjs
import assert from 'assert';

async function testLiveEndpoints() {
  console.log('🌐 TESTING LIVE BACKEND / DEV SERVER ENDPOINTS FOR PUNE...\n');

  // 1. Test /api/places?city=pune
  console.log('[Test 1] Fetching /api/places?city=pune ...');
  const res1 = await fetch('http://localhost:3000/api/places?city=pune&limit=50');
  assert.ok(res1.ok, `/api/places?city=pune failed with ${res1.status}`);
  const data1 = await res1.json();
  const places = data1.data || data1.places || [];
  console.log(`✓ /api/places?city=pune returned exactly ${places.length} places (total: ${data1.total})`);
  assert.strictEqual(places.length, 25, `Expected exactly 25 places, got ${places.length}`);
  assert.strictEqual(data1.total, 25, `Expected total 25, got ${data1.total}`);
  
  const p1 = places.find(p => p.id === 'pune_001');
  assert.ok(p1, 'pune_001 Shaniwar Wada must be in places');
  assert.strictEqual(p1.name, 'Shaniwar Wada');
  console.log(`✓ Verified Shaniwar Wada (pune_001): area = "${p1.area}", suggested_duration = "${p1.suggested_duration}"`);

  const p25 = places.find(p => p.id === 'pune_025');
  assert.ok(p25, 'pune_025 Purandar Fort must be in places');
  assert.strictEqual(p25.name, 'Purandar Fort');
  console.log(`✓ Verified Purandar Fort (pune_025): area = "${p25.area}", map_search = "${p25.map_search}"`);

  // 2. Test /api/search?q=shaniwar
  console.log('\n[Test 2] Searching /api/search?q=shaniwar ...');
  const res2 = await fetch('http://localhost:3000/api/search?q=shaniwar');
  assert.ok(res2.ok);
  const results2 = await res2.json();
  console.log(`✓ /api/search?q=shaniwar returned ${results2.length} results`);
  assert.ok(results2.some(p => p.name.includes('Shaniwar Wada')), 'Search must return Shaniwar Wada');

  // 3. Test /api/search?q=pune
  console.log('\n[Test 3] Searching /api/search?q=pune ...');
  const res3 = await fetch('http://localhost:3000/api/search?q=pune');
  assert.ok(res3.ok);
  const results3 = await res3.json();
  console.log(`✓ /api/search?q=pune returned ${results3.length} results`);
  assert.ok(results3.length >= 25, 'Search for Pune must return all Pune places');

  // 4. Test /api/destinations/pune_001
  console.log('\n[Test 4] Fetching /api/destinations/pune_001 ...');
  const res4 = await fetch('http://localhost:3000/api/destinations/pune_001');
  assert.ok(res4.ok);
  const p = await res4.json();
  assert.strictEqual(p.id, 'pune_001');
  assert.strictEqual(p.name, 'Shaniwar Wada');
  console.log(`✓ Place details verified: ${p.name} (${p.id}), area: "${p.area}", timings: "${p.visiting_hours || p.opening_hours}"`);

  // 5. Test Mumbai remains intact
  console.log('\n[Test 5] Verifying Mumbai at /api/places?city=mumbai ...');
  const res5 = await fetch('http://localhost:3000/api/places?city=mumbai&limit=50');
  assert.ok(res5.ok);
  const data5 = await res5.json();
  const mPlaces = data5.data || data5.places || [];
  console.log(`✓ Mumbai returned ${mPlaces.length} places (total: ${data5.total})`);
  assert.ok(data5.total >= 40, 'Mumbai places must remain intact');

  console.log('\n🎉 ALL LIVE SERVER ENDPOINTS VERIFIED 100% WORKING!\n');
}

testLiveEndpoints();
