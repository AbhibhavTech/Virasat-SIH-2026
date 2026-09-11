// scripts/test_live_himachal_api.mjs
import assert from 'assert';

async function runTests() {
  console.log('🌐 TESTING LIVE VIRASAT APIS FOR HIMACHAL PRADESH...\n');
  const baseUrl = 'http://localhost:3000';

  // 1. Test Himachal Pradesh state places
  console.log('[API Test 1] GET /api/places?state=himachal-pradesh&limit=50');
  const hpRes = await fetch(`${baseUrl}/api/places?state=himachal-pradesh&limit=50`);
  assert.strictEqual(hpRes.status, 200, 'Himachal Pradesh places status 200');
  const hpData = await hpRes.json();
  const hpPlaces = hpData.places || hpData.data;
  console.log(`✓ Total HP places: ${hpData.total}, Returned: ${hpPlaces.length} (Expected: 20)`);
  assert.strictEqual(hpData.total, 20, `Expected total 20 Himachal Pradesh places, got ${hpData.total}`);
  assert.strictEqual(hpPlaces.length, 20, `Expected 20 Himachal Pradesh places in payload, got ${hpPlaces.length}`);

  // Verify all 20 IDs exist
  for (let i = 1; i <= 20; i++) {
    const expectedId = `himachal_${String(i).padStart(3, '0')}`;
    assert.ok(hpPlaces.some(p => p.id === expectedId), `State list must include ${expectedId}`);
  }
  console.log('✓ All 20 Himachal places verified by ID (himachal_001 to himachal_020).');

  // 2. Test City endpoints
  console.log('\n[API Test 2] Validating individual City endpoints:');
  const cityChecks = [
    { city: 'shimla', expectedCount: 4, expectedIds: ['himachal_001', 'himachal_002', 'himachal_003', 'himachal_004'] },
    { city: 'kufri', expectedCount: 1, expectedIds: ['himachal_005'] },
    { city: 'manali', expectedCount: 4, expectedIds: ['himachal_006', 'himachal_007', 'himachal_008', 'himachal_009'] },
    { city: 'kasol', expectedCount: 2, expectedIds: ['himachal_010', 'himachal_011'] },
    { city: 'dharamshala', expectedCount: 4, expectedIds: ['himachal_012', 'himachal_013', 'himachal_014', 'himachal_015'] },
    { city: 'khajjiar', expectedCount: 1, expectedIds: ['himachal_016'] },
    { city: 'dalhousie', expectedCount: 1, expectedIds: ['himachal_017'] },
    { city: 'chail', expectedCount: 1, expectedIds: ['himachal_018'] },
    { city: 'kullu', expectedCount: 1, expectedIds: ['himachal_019'] },
    { city: 'spiti-valley', expectedCount: 1, expectedIds: ['himachal_020'] }
  ];

  for (const check of cityChecks) {
    const res = await fetch(`${baseUrl}/api/places?city=${check.city}&limit=50`);
    assert.strictEqual(res.status, 200, `${check.city} places status 200`);
    const data = await res.json();
    const places = data.places || data.data || data;
    console.log(`- ${check.city}: returned ${places.length} places (Expected: ${check.expectedCount})`);
    assert.strictEqual(places.length, check.expectedCount, `Expected ${check.expectedCount} places for ${check.city}, got ${places.length}`);
    for (const eid of check.expectedIds) {
      assert.ok(places.some(p => p.id === eid), `${check.city} must contain ${eid}`);
    }
  }
  console.log('✓ All 10 city endpoints return correct place counts and exact IDs.');

  // 3. Test Specific Place Details
  console.log('\n[API Test 3] GET /api/places/himachal_001');
  const p1Res = await fetch(`${baseUrl}/api/places/himachal_001`);
  assert.strictEqual(p1Res.status, 200);
  const p1 = await p1Res.json();
  assert.strictEqual(p1.id, 'himachal_001');
  assert.strictEqual(p1.name, 'Shimla');
  assert.strictEqual(p1.category, 'hill_station');
  assert.strictEqual(p1.city, 'Shimla');
  console.log(`✓ himachal_001 details verified: ${p1.name} (${p1.category}, ${p1.city})`);

  console.log('\n[API Test 4] GET /api/places/himachal_009');
  const p9Res = await fetch(`${baseUrl}/api/places/himachal_009`);
  assert.strictEqual(p9Res.status, 200);
  const p9 = await p9Res.json();
  assert.strictEqual(p9.id, 'himachal_009');
  assert.strictEqual(p9.name, 'Hadimba Devi Temple');
  assert.strictEqual(p9.category, 'religious_heritage');
  assert.strictEqual(p9.city, 'Manali');
  console.log(`✓ himachal_009 details verified: ${p9.name} (${p9.category}, ${p9.city})`);

  console.log('\n[API Test 5] GET /api/places/himachal_020');
  const p20Res = await fetch(`${baseUrl}/api/places/himachal_020`);
  assert.strictEqual(p20Res.status, 200);
  const p20 = await p20Res.json();
  assert.strictEqual(p20.id, 'himachal_020');
  assert.strictEqual(p20.name, 'Spiti Valley');
  assert.strictEqual(p20.city, 'Spiti Valley');
  console.log(`✓ himachal_020 details verified: ${p20.name} (${p20.city})`);

  // 4. Test Search endpoint
  console.log('\n[API Test 6] GET /api/search?q=hadimba');
  const searchRes1 = await fetch(`${baseUrl}/api/search?q=hadimba`);
  assert.strictEqual(searchRes1.status, 200);
  const searchData1 = await searchRes1.json();
  const results1 = Array.isArray(searchData1) ? searchData1 : (searchData1.results || searchData1.places || searchData1.data || []);
  assert.ok(results1.some(r => r.name.toLowerCase().includes('hadimba')), 'Hadimba found in search results');
  console.log('✓ Search query "hadimba" returns Hadimba Devi Temple.');

  console.log('\n[API Test 7] GET /api/search?q=shimla');
  const searchRes2 = await fetch(`${baseUrl}/api/search?q=shimla`);
  assert.strictEqual(searchRes2.status, 200);
  const searchData2 = await searchRes2.json();
  const results2 = Array.isArray(searchData2) ? searchData2 : (searchData2.results || searchData2.places || searchData2.data || []);
  assert.ok(results2.length >= 4, `Expected at least 4 search results for Shimla, got ${results2.length}`);
  console.log(`✓ Search query "shimla" returns ${results2.length} matching records.`);

  // 5. Verify Mumbai, Pune, and Tamil Nadu unaffected
  console.log('\n[API Test 8] Verifying existing data isolation:');
  const mumbaiRes = await fetch(`${baseUrl}/api/places?city=mumbai&limit=60`);
  assert.strictEqual(mumbaiRes.status, 200);
  const mumbaiData = await mumbaiRes.json();
  const mumbaiPlaces = mumbaiData.places || mumbaiData.data || mumbaiData;
  const canonicalMumbaiPlaces = mumbaiPlaces.filter(p => p.id.startsWith('mumbai-'));
  console.log(`✓ Mumbai canonical places: ${canonicalMumbaiPlaces.length} (Expected: 40)`);
  assert.strictEqual(canonicalMumbaiPlaces.length, 40, `Mumbai should have 40 canonical places, got ${canonicalMumbaiPlaces.length}`);

  const puneRes = await fetch(`${baseUrl}/api/places?city=pune&limit=50`);
  assert.strictEqual(puneRes.status, 200);
  const puneData = await puneRes.json();
  const punePlaces = puneData.places || puneData.data || puneData;
  console.log(`✓ Pune places count: ${punePlaces.length} (Expected: 25)`);
  assert.strictEqual(punePlaces.length, 25, `Pune should be 25 places, got ${punePlaces.length}`);

  const tnRes = await fetch(`${baseUrl}/api/places?state=tamil-nadu&limit=50`);
  assert.strictEqual(tnRes.status, 200);
  const tnData = await tnRes.json();
  const tnPlaces = tnData.places || tnData.data;
  console.log(`✓ Tamil Nadu places count: ${tnData.total} (Expected: 27)`);
  assert.strictEqual(tnData.total, 27, `Tamil Nadu should have 27 places, got ${tnData.total}`);

  console.log('\n🎉 ALL LIVE HIMACHAL PRADESH API TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch(err => {
  console.error('❌ LIVE API TEST FAILED:', err);
  process.exit(1);
});
