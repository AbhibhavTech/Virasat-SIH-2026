import assert from 'assert';

async function test() {
  console.log('=== VERIFYING PUNJAB INTEGRATION ===\n');

  // 1. Test GET /api/v1/places?stateId=punjab
  console.log('1. Testing GET /api/v1/places?stateId=punjab ...');
  const r1 = await fetch('http://localhost:3000/api/v1/places?stateId=punjab&limit=50');
  const d1 = await r1.json();
  console.log(`HTTP ${r1.status}, success: ${d1.success}, total: ${d1.total}, places count: ${d1.places.length}`);
  assert.strictEqual(r1.status, 200, 'HTTP 200 expected');
  assert.strictEqual(d1.total, 20, 'Expected exactly 20 total Punjab places');
  assert.strictEqual(d1.places.length, 20, 'Expected exactly 20 places returned');

  // Check all IDs from punjab_001 to punjab_020
  const ids = d1.places.map(p => p.id).sort();
  const expectedIds = Array.from({ length: 20 }, (_, i) => `punjab_${String(i + 1).padStart(3, '0')}`).sort();
  assert.deepStrictEqual(ids, expectedIds, 'All 20 IDs punjab_001 to punjab_020 must match');
  console.log('✓ All 20 IDs (punjab_001 to punjab_020) verified in /api/v1/places');

  // Check fields on a sample place
  const p1 = d1.places.find(p => p.id === 'punjab_001');
  assert.strictEqual(p1.name, 'Golden Temple');
  assert.strictEqual(p1.category, 'religious_heritage');
  assert.strictEqual(p1.area, 'Amritsar');
  assert.strictEqual(p1.city, 'Amritsar');
  assert(Array.isArray(p1.best_for) && p1.best_for.includes('spirituality'));
  assert.strictEqual(p1.suggested_duration, '2–3 hours');
  assert(Array.isArray(p1.visitor_notes) && p1.visitor_notes.includes('Head covering required'));
  assert.strictEqual(p1.map_search, 'Golden Temple Amritsar');
  assert(Array.isArray(p1.tags) && p1.tags.includes('Sikhism'));
  console.log('✓ Original fields preserved on punjab_001');

  // 2. Test GET /api/v1/places/:id
  console.log('\n2. Testing GET /api/v1/places/punjab_001 and /punjab_020 ...');
  const r2a = await fetch('http://localhost:3000/api/v1/places/punjab_001');
  const d2a = await r2a.json();
  assert.strictEqual(r2a.status, 200);
  assert.strictEqual(d2a.data.name, 'Golden Temple');

  const r2b = await fetch('http://localhost:3000/api/v1/places/punjab_020');
  const d2b = await r2b.json();
  assert.strictEqual(r2b.status, 200);
  assert.strictEqual(d2b.data.name, 'Punjab Agricultural University Museum');
  assert.strictEqual(d2b.data.city, 'Ludhiana');
  console.log('✓ Individual place GET endpoints verified');

  // 3. Test city filter GET /api/v1/places?cityId=amritsar
  console.log('\n3. Testing city filter GET /api/v1/places?cityId=amritsar ...');
  const r3 = await fetch('http://localhost:3000/api/v1/places?cityId=amritsar&limit=20');
  const d3 = await r3.json();
  console.log(`Amritsar places count: ${d3.places.length}`);
  assert.strictEqual(d3.places.length, 6, 'Expected 6 places in Amritsar');
  console.log('✓ Amritsar city filter verified (6 places)');

  // 4. Test legacy /api/places?state=Punjab
  console.log('\n4. Testing GET /api/places?state=Punjab ...');
  const r4 = await fetch('http://localhost:3000/api/places?state=Punjab&limit=50');
  const d4 = await r4.json();
  console.log(`Total: ${d4.total}, returned: ${d4.data.length}`);
  assert.strictEqual(d4.total, 20, 'Expected 20 places in /api/places?state=Punjab');
  console.log('✓ /api/places?state=Punjab verified (20 places)');

  // 5. Test India hierarchy state endpoint
  console.log('\n5. Testing GET /api/india-hierarchy/state/punjab ...');
  const r5 = await fetch('http://localhost:3000/api/india-hierarchy/state/punjab');
  const d5 = await r5.json();
  assert.strictEqual(r5.status, 200);
  assert.strictEqual(d5.total_attractions, 20);
  console.log('✓ /api/india-hierarchy/state/punjab verified (total_attractions = 20)');

  // 6. Test existing data unchanged (Mumbai, Pune)
  console.log('\n6. Testing existing data (Mumbai, Pune) ...');
  const r6m = await fetch('http://localhost:3000/api/places?city=Mumbai');
  const d6m = await r6m.json();
  assert(d6m.total > 0, 'Mumbai places should be present');
  console.log(`✓ Mumbai places intact: ${d6m.total}`);

  console.log('\n=== ALL PUNJAB VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
}

test().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
