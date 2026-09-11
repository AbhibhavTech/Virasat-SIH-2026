// scripts/test_live_tamil_nadu_api.mjs
import assert from 'assert';

async function runTests() {
  console.log('🌐 TESTING LIVE VIRASAT APIS FOR TAMIL NADU & CHENNAI...\n');
  const baseUrl = 'http://localhost:3000';

  // 1. Test Chennai places
  console.log('[API Test 1] GET /api/places?city=chennai');
  const chennaiRes = await fetch(`${baseUrl}/api/places?city=chennai`);
  assert.strictEqual(chennaiRes.status, 200, 'Chennai places status 200');
  const chennaiData = await chennaiRes.json();
  const chennaiPlaces = chennaiData.places || chennaiData.data || chennaiData;
  console.log(`✓ Returned ${chennaiPlaces.length} Chennai places (Expected: 10)`);
  assert.strictEqual(chennaiPlaces.length, 10, `Expected 10 Chennai places, got ${chennaiPlaces.length}`);

  // Verify all 10 expected IDs
  const expectedChennaiIds = [
    'tamil_nadu_009', 'tamil_nadu_010', 'tamil_nadu_011',
    'tamil_nadu_021', 'tamil_nadu_022', 'tamil_nadu_023',
    'tamil_nadu_024', 'tamil_nadu_025', 'tamil_nadu_026', 'tamil_nadu_027'
  ];
  for (const cid of expectedChennaiIds) {
    assert.ok(chennaiPlaces.some(p => p.id === cid), `Chennai list must include ${cid}`);
  }
  console.log('✓ All 10 Chennai attractions verified by ID.');

  // 2. Test Tamil Nadu state places
  console.log('\n[API Test 2] GET /api/places?state=tamil-nadu&limit=50');
  const tnRes = await fetch(`${baseUrl}/api/places?state=tamil-nadu&limit=50`);
  assert.strictEqual(tnRes.status, 200, 'Tamil Nadu places status 200');
  const tnData = await tnRes.json();
  const tnPlaces = tnData.places || tnData.data;
  console.log(`✓ Total TN places: ${tnData.total}, Returned: ${tnPlaces.length} (Expected: 27)`);
  assert.strictEqual(tnData.total, 27, `Expected total 27 Tamil Nadu places, got ${tnData.total}`);
  assert.strictEqual(tnPlaces.length, 27, `Expected 27 Tamil Nadu places in payload, got ${tnPlaces.length}`);

  // 3. Test Specific Place Details
  console.log('\n[API Test 3] GET /api/places/tamil_nadu_001');
  const p1Res = await fetch(`${baseUrl}/api/places/tamil_nadu_001`);
  assert.strictEqual(p1Res.status, 200);
  const p1 = await p1Res.json();
  assert.strictEqual(p1.id, 'tamil_nadu_001');
  assert.strictEqual(p1.name, 'Meenakshi Amman Temple');
  assert.strictEqual(p1.category, 'religious_heritage');
  assert.strictEqual(p1.city, 'Madurai');
  console.log(`✓ tamil_nadu_001 details verified: ${p1.name} (${p1.city})`);

  console.log('\n[API Test 4] GET /api/places/tamil_nadu_021');
  const p21Res = await fetch(`${baseUrl}/api/places/tamil_nadu_021`);
  assert.strictEqual(p21Res.status, 200);
  const p21 = await p21Res.json();
  assert.strictEqual(p21.id, 'tamil_nadu_021');
  assert.strictEqual(p21.name, 'Kapaleeswarar Temple');
  assert.strictEqual(p21.category, 'religious_heritage');
  assert.strictEqual(p21.city, 'Chennai');
  console.log(`✓ tamil_nadu_021 details verified: ${p21.name} (${p21.city})`);

  // 4. Test Search endpoint
  console.log('\n[API Test 5] GET /api/search?q=meenakshi');
  const searchRes1 = await fetch(`${baseUrl}/api/search?q=meenakshi`);
  assert.strictEqual(searchRes1.status, 200);
  const searchData1 = await searchRes1.json();
  const results1 = Array.isArray(searchData1) ? searchData1 : (searchData1.results || searchData1.places || searchData1.data || []);
  assert.ok(results1.some(r => r.name.toLowerCase().includes('meenakshi')), 'Meenakshi found in search results');
  console.log('✓ Search query "meenakshi" returns Meenakshi Amman Temple.');

  console.log('\n[API Test 6] GET /api/search?q=chennai');
  const searchRes2 = await fetch(`${baseUrl}/api/search?q=chennai`);
  assert.strictEqual(searchRes2.status, 200);
  const searchData2 = await searchRes2.json();
  const results2 = Array.isArray(searchData2) ? searchData2 : (searchData2.results || searchData2.places || searchData2.data || []);
  assert.strictEqual(results2.length, 10, `Expected 10 search results for Chennai, got ${results2.length}`);
  console.log(`✓ Search query "chennai" returns all 10 matching records.`);

  // 5. Verify Mumbai and Pune unaffected
  console.log('\n[API Test 7] GET /api/places?city=mumbai&limit=60');
  const mumbaiRes = await fetch(`${baseUrl}/api/places?city=mumbai&limit=60`);
  assert.strictEqual(mumbaiRes.status, 200);
  const mumbaiData = await mumbaiRes.json();
  const mumbaiPlaces = mumbaiData.places || mumbaiData.data || mumbaiData;
  const canonicalMumbaiPlaces = mumbaiPlaces.filter(p => p.id.startsWith('mumbai-'));
  console.log(`✓ Mumbai places count: ${canonicalMumbaiPlaces.length} canonical places (Expected: 40)`);
  assert.strictEqual(canonicalMumbaiPlaces.length, 40, `Mumbai should have 40 canonical places, got ${canonicalMumbaiPlaces.length}`);

  console.log('\n[API Test 8] GET /api/places?city=pune&limit=50');
  const puneRes = await fetch(`${baseUrl}/api/places?city=pune&limit=50`);
  assert.strictEqual(puneRes.status, 200);
  const puneData = await puneRes.json();
  const punePlaces = puneData.places || puneData.data || puneData;
  console.log(`✓ Pune places count: ${punePlaces.length} (Expected: 25)`);
  assert.strictEqual(punePlaces.length, 25, `Pune should be 25 places, got ${punePlaces.length}`);

  console.log('\n🎉 ALL LIVE API INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch(err => {
  console.error('❌ LIVE API TEST FAILED:', err);
  process.exit(1);
});
