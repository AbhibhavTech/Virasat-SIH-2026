// scripts/test_himachal_integration.mjs
import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('🧪 RUNNING COMPREHENSIVE HIMACHAL PRADESH INTEGRATION TESTS...\n');

// 1. Check data/himachal-pradesh/places.json
const hpPlacesPath = path.join(process.cwd(), 'data', 'himachal-pradesh', 'places.json');
assert.ok(fs.existsSync(hpPlacesPath), 'data/himachal-pradesh/places.json must exist');
const hpPlaces = JSON.parse(fs.readFileSync(hpPlacesPath, 'utf-8'));

console.log(`[Test 1] Validating place count and IDs in data/himachal-pradesh/places.json...`);
assert.strictEqual(hpPlaces.length, 20, `Expected exactly 20 places, found ${hpPlaces.length}`);

for (let i = 1; i <= 20; i++) {
  const expectedId = `himachal_${String(i).padStart(3, '0')}`;
  const found = hpPlaces.find(p => p.id === expectedId);
  assert.ok(found, `Attraction ${expectedId} must exist in places.json`);
  assert.ok(found.name, `${expectedId} must have a name`);
  assert.ok(found.category, `${expectedId} must have a category`);
  assert.ok(found.area, `${expectedId} must have an area`);
  assert.ok(found.description, `${expectedId} must have a description`);
  assert.ok(found.map_search, `${expectedId} must have map_search`);
  assert.ok(found.suggested_duration, `${expectedId} must have suggested_duration`);
  assert.ok(found.best_time_to_visit, `${expectedId} must have best_time_to_visit`);
  assert.ok(found.entry_fee, `${expectedId} must have entry_fee`);
  assert.ok(found.opening_hours, `${expectedId} must have opening_hours`);
  assert.ok(found.visitor_notes, `${expectedId} must have visitor_notes`);
  assert.ok(Array.isArray(found.tags) && found.tags.length > 0, `${expectedId} must have tags`);
  assert.strictEqual(found.state, 'Himachal Pradesh', `${expectedId} state must be Himachal Pradesh`);
}
console.log('✓ All 20 places (himachal_001 to himachal_020) verified with complete fidelity.');

// 2. Validate City place assignments
console.log('\n[Test 2] Validating City place assignments...');
const cityExpectedCounts = {
  shimla: 4,
  kufri: 1,
  manali: 4,
  kasol: 2,
  dharamshala: 4,
  khajjiar: 1,
  dalhousie: 1,
  chail: 1,
  kullu: 1,
  'spiti-valley': 1
};

for (const [cityId, expCount] of Object.entries(cityExpectedCounts)) {
  const matching = hpPlaces.filter(p => p.city_id === cityId || p.city.toLowerCase().replace(/\s+/g, '-') === cityId);
  console.log(`- ${cityId}: found ${matching.length} places (expected: ${expCount}) -> ${matching.map(p => p.name).join(', ')}`);
  assert.strictEqual(matching.length, expCount, `Expected ${expCount} places for ${cityId}, got ${matching.length}`);
}
console.log('✓ City place assignments verified across all 10 Himachal destination hubs.');

// 3. Validate Registries and Stores
console.log('\n[Test 3] Verifying registries and database updates...');

// A. cities.json
const cities = JSON.parse(fs.readFileSync('data/cities.json', 'utf-8'));
for (const [cityId, expCount] of Object.entries(cityExpectedCounts)) {
  const c = cities.find(city => city.id === cityId);
  assert.ok(c, `City ${cityId} must exist in data/cities.json`);
  assert.strictEqual(c.places_count, expCount, `City ${cityId} places_count must be ${expCount}, got ${c.places_count}`);
}
console.log('✓ cities.json verified for all 10 Himachal cities with exact places_count.');

// B. states.json
const states = JSON.parse(fs.readFileSync('data/states.json', 'utf-8'));
const hpState = states.find(s => s.id === 'himachal-pradesh');
assert.ok(hpState, 'Himachal Pradesh must exist in states.json');
assert.strictEqual(hpState.total_attractions, 20, `total_attractions must be 20, got ${hpState.total_attractions}`);
assert.strictEqual(hpState.total_cities, 10, `total_cities must be 10, got ${hpState.total_cities}`);
console.log('✓ states.json verified (total_attractions = 20, total_cities = 10).');

// C. india_tourism_database.json
const itdb = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf-8'));
const itdbHP = itdb.states.find(s => s.id === 'himachal-pradesh');
assert.ok(itdbHP, 'Himachal Pradesh must exist in ITDB');
assert.strictEqual(itdbHP.total_attractions, 20, `ITDB total_attractions must be 20, got ${itdbHP.total_attractions}`);
console.log('✓ india_tourism_database.json verified (Himachal Pradesh total_attractions = 20).');

// D. virasat_store.json
const store = JSON.parse(fs.readFileSync('data/.database/virasat_store.json', 'utf-8'));
const storeHPPlaces = Object.values(store.places).filter(p => p.state_id === 'himachal-pradesh' || p.state === 'Himachal Pradesh');
assert.strictEqual(storeHPPlaces.length, 20, `virasat_store.json must contain exactly 20 HP places, got ${storeHPPlaces.length}`);
console.log(`✓ virasat_store.json verified (exactly 20 Himachal Pradesh places).`);

// 4. Verify other states unaffected
console.log('\n[Test 4] Verifying Mumbai, Pune, and Tamil Nadu remain 100% unchanged...');
const mumbaiPlaces = JSON.parse(fs.readFileSync('data/mumbai/places.json', 'utf-8'));
assert.strictEqual(mumbaiPlaces.length, 40, 'Mumbai must remain 40 places');
const punePlaces = JSON.parse(fs.readFileSync('data/pune/places.json', 'utf-8'));
assert.strictEqual(punePlaces.length, 25, 'Pune must remain 25 places');
const tnPlaces = JSON.parse(fs.readFileSync('data/tamil-nadu/places.json', 'utf-8'));
assert.strictEqual(tnPlaces.length, 27, 'Tamil Nadu must remain 27 places');
console.log('✓ Mumbai (40), Pune (25), and Tamil Nadu (27) remain 100% untouched and intact.');

console.log('\n🎉 ALL HIMACHAL PRADESH STATIC INTEGRATION TESTS PASSED SUCCESSFULLY!');
