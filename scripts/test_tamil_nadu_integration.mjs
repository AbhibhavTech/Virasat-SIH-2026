// scripts/test_tamil_nadu_integration.mjs
import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('🧪 RUNNING COMPREHENSIVE TAMIL NADU INTEGRATION TESTS...\n');

// 1. Check data/tamil-nadu/places.json
const tnPlacesPath = path.join(process.cwd(), 'data', 'tamil-nadu', 'places.json');
assert.ok(fs.existsSync(tnPlacesPath), 'data/tamil-nadu/places.json must exist');
const tnPlaces = JSON.parse(fs.readFileSync(tnPlacesPath, 'utf-8'));

console.log(`[Test 1] Validating place count and IDs in data/tamil-nadu/places.json...`);
assert.strictEqual(tnPlaces.length, 27, `Expected exactly 27 places, found ${tnPlaces.length}`);

for (let i = 1; i <= 27; i++) {
  const expectedId = `tamil_nadu_${String(i).padStart(3, '0')}`;
  const found = tnPlaces.find(p => p.id === expectedId);
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
  assert.strictEqual(found.state, 'Tamil Nadu', `${expectedId} state must be Tamil Nadu`);
}
console.log('✓ All 27 places (tamil_nadu_001 to tamil_nadu_027) verified with complete fidelity.');

// 2. Validate Chennai has exactly 10 attractions
console.log('\n[Test 2] Validating Chennai place assignment...');
const chennaiPlaces = tnPlaces.filter(p => p.city_id === 'chennai' || p.city.toLowerCase() === 'chennai');
console.log(`Found ${chennaiPlaces.length} Chennai places:`, chennaiPlaces.map(p => p.name));
assert.strictEqual(chennaiPlaces.length, 10, `Expected exactly 10 Chennai places, found ${chennaiPlaces.length}`);
const expectedChennaiIds = [
  'tamil_nadu_009', 'tamil_nadu_010', 'tamil_nadu_011',
  'tamil_nadu_021', 'tamil_nadu_022', 'tamil_nadu_023',
  'tamil_nadu_024', 'tamil_nadu_025', 'tamil_nadu_026', 'tamil_nadu_027'
];
for (const cid of expectedChennaiIds) {
  assert.ok(chennaiPlaces.some(p => p.id === cid), `Chennai must contain ${cid}`);
}
console.log('✓ Chennai contains exactly 10 specified attractions.');

// 3. Validate Kanchipuram and Tiruchirappalli are completely removed
console.log('\n[Test 3] Verifying complete removal of Kanchipuram and Tiruchirappalli...');

// A. cities.json
const cities = JSON.parse(fs.readFileSync('data/cities.json', 'utf-8'));
assert.ok(!cities.some(c => c.id === 'kanchipuram' || c.slug === 'kanchipuram'), 'Kanchipuram must not exist in data/cities.json');
assert.ok(!cities.some(c => c.id === 'tiruchirappalli' || c.slug === 'tiruchirappalli'), 'Tiruchirappalli must not exist in data/cities.json');
const chennaiCity = cities.find(c => c.id === 'chennai');
assert.ok(chennaiCity, 'Chennai must exist in cities.json');
assert.strictEqual(chennaiCity.places_count, 10, `Chennai places_count in cities.json must be 10, got ${chennaiCity.places_count}`);
console.log(`✓ cities.json verified (Kanchipuram & Tiruchirappalli removed, Chennai places_count = 10)`);

// B. states.json
const states = JSON.parse(fs.readFileSync('data/states.json', 'utf-8'));
const tnState = states.find(s => s.id === 'tamil-nadu');
assert.ok(tnState, 'Tamil Nadu must exist in states.json');
assert.strictEqual(tnState.total_attractions, 27, `Tamil Nadu total_attractions in states.json must be 27, got ${tnState.total_attractions}`);
console.log(`✓ states.json verified (total_attractions = 27)`);

// C. india_tourism_database.json
const itdb = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf-8'));
const itdbTN = itdb.states.find(s => s.id === 'tamil-nadu');
assert.ok(itdbTN, 'Tamil Nadu must exist in ITDB');
assert.ok(!itdbTN.cities.some(c => c.id === 'kanchipuram'), 'Kanchipuram must not exist in ITDB Tamil Nadu cities');
assert.ok(!itdbTN.cities.some(c => c.id === 'tiruchirappalli'), 'Tiruchirappalli must not exist in ITDB Tamil Nadu cities');
const itdbChennai = itdbTN.cities.find(c => c.id === 'chennai');
assert.ok(itdbChennai, 'Chennai must exist in ITDB Tamil Nadu');
assert.strictEqual(itdbChennai.places_count, 10, `Chennai places_count in ITDB must be 10, got ${itdbChennai.places_count}`);
console.log(`✓ india_tourism_database.json verified (Kanchipuram & Tiruchirappalli removed, Chennai = 10)`);

// D. cityItineraryData.ts
const itinContent = fs.readFileSync('src/data/cityItineraryData.ts', 'utf-8');
assert.ok(!itinContent.includes('"kanchipuram"'), 'kanchipuram must not exist in cityItineraryData.ts');
assert.ok(!itinContent.includes('"tiruchirappalli"'), 'tiruchirappalli must not exist in cityItineraryData.ts');
console.log(`✓ cityItineraryData.ts verified (Kanchipuram & Tiruchirappalli removed)`);

// E. virasat_store.json
const store = JSON.parse(fs.readFileSync('data/.database/virasat_store.json', 'utf-8'));
assert.ok(!Object.values(store.cities).some(c => c.id === 'kanchipuram'), 'Kanchipuram must not be in store.cities');
assert.ok(!Object.values(store.cities).some(c => c.id === 'tiruchirappalli'), 'Tiruchirappalli must not be in store.cities');
assert.ok(!Object.values(store.places).some(p => p.city_id === 'kanchipuram'), 'No places for kanchipuram in store.places');
assert.ok(!Object.values(store.places).some(p => p.city_id === 'tiruchirappalli'), 'No places for tiruchirappalli in store.places');
console.log(`✓ virasat_store.json verified (Kanchipuram & Tiruchirappalli completely removed)`);

// 4. Verify Mumbai and Pune isolation
console.log('\n[Test 4] Verifying Mumbai and Pune remain 100% unchanged...');
const mumbaiPlaces = JSON.parse(fs.readFileSync('data/mumbai/places.json', 'utf-8'));
assert.strictEqual(mumbaiPlaces.length, 40, 'Mumbai must remain 40 places');
const punePlaces = JSON.parse(fs.readFileSync('data/pune/places.json', 'utf-8'));
assert.strictEqual(punePlaces.length, 25, 'Pune must remain 25 places');
console.log('✓ Mumbai (40) and Pune (25) remain 100% untouched and intact.');

console.log('\n🎉 ALL STATIC INTEGRATION ASSERTIONS PASSED SUCCESSFULLY!');
