// scripts/test_pune_integration.mjs
import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('🧪 RUNNING COMPREHENSIVE PUNE DATA INTEGRATION AUDIT...\n');

// 1. Check data/pune/places.json
const punePlaces = JSON.parse(fs.readFileSync('data/pune/places.json', 'utf8'));
console.log(`[Test 1] Checking data/pune/places.json count...`);
assert.strictEqual(punePlaces.length, 25, `Expected exactly 25 places in data/pune/places.json, got ${punePlaces.length}`);
console.log(`✓ Exactly 25 places found in data/pune/places.json`);

// Verify ID range: pune_001 to pune_025
const ids = punePlaces.map(p => p.id);
assert.strictEqual(ids[0], 'pune_001', 'First record must be pune_001');
assert.strictEqual(ids[24], 'pune_025', '25th record must be pune_025');
const invalidHigherIds = ids.filter(id => {
  const num = parseInt(id.replace('pune_', ''), 10);
  return num > 25;
});
assert.strictEqual(invalidHigherIds.length, 0, `Forbidden IDs (> 25) found: ${invalidHigherIds.join(', ')}`);
console.log(`✓ Verified IDs: strictly pune_001 to pune_025 (no pune_026 onwards)`);

// 2. Check source JSON fidelity against original JSON
const SOURCE_PATH = 'c:/Users/sinha/Downloads/maharashtra heritage/pune_clean_unique_tourist_places.json';
const sourceRaw = JSON.parse(fs.readFileSync(SOURCE_PATH, 'utf8'));
const top25Source = sourceRaw.places.slice(0, 25);

console.log(`[Test 2] Verifying verbatim fidelity against source JSON fields...`);
for (let i = 0; i < 25; i++) {
  const src = top25Source[i];
  const target = punePlaces[i];

  assert.strictEqual(target.id, src.id, `ID mismatch at index ${i}`);
  assert.strictEqual(target.name, src.name, `Name mismatch for ${src.id}`);
  assert.strictEqual(target.category, src.category, `Category mismatch for ${src.id}`);
  assert.strictEqual(target.area, src.area, `Area mismatch for ${src.id}`);
  assert.strictEqual(target.description, src.description, `Description mismatch for ${src.id}`);
  assert.strictEqual(target.suggested_duration, src.suggested_duration, `suggested_duration mismatch for ${src.id}`);
  assert.strictEqual(target.best_time_to_visit, src.best_time_to_visit, `best_time_to_visit mismatch for ${src.id}`);
  assert.strictEqual(target.entry_fee, src.entry_fee, `entry_fee mismatch for ${src.id}`);
  assert.strictEqual(target.opening_hours, src.opening_hours, `opening_hours mismatch for ${src.id}`);
  assert.strictEqual(target.visitor_notes, src.visitor_notes, `visitor_notes mismatch for ${src.id}`);
  assert.strictEqual(target.map_search, src.map_search, `map_search mismatch for ${src.id}`);
  assert.deepStrictEqual(target.tags, src.tags, `tags mismatch for ${src.id}`);
  assert.ok(target.thumbnail_url && target.thumbnail_url.startsWith('http'), `Valid image URL required for ${src.id}`);
}
console.log(`✓ All 25 records match original source JSON fields verbatim without modifications!`);

// 3. Check Mumbai dataset remains unchanged
console.log(`[Test 3] Verifying Mumbai dataset remains unchanged...`);
const mumbaiPlaces = JSON.parse(fs.readFileSync('data/mumbai/places.json', 'utf8'));
assert.strictEqual(mumbaiPlaces.length, 40, `Expected 40 Mumbai places, got ${mumbaiPlaces.length}`);
assert.strictEqual(mumbaiPlaces[0].id, 'mumbai-001', 'Mumbai first record unchanged');
console.log(`✓ Mumbai dataset verified intact with 40 attractions`);

// 4. Check cities.json
console.log(`[Test 4] Checking data/cities.json...`);
const cities = JSON.parse(fs.readFileSync('data/cities.json', 'utf8'));
const puneCity = cities.find(c => c.id === 'pune');
assert.ok(puneCity, 'Pune city must exist in cities.json');
assert.strictEqual(puneCity.places_count, 25, `Pune places_count must be 25, got ${puneCity.places_count}`);
console.log(`✓ Pune in cities.json has places_count: 25`);

// 5. Check India Tourism Database JSON
console.log(`[Test 5] Checking data/india_tourism_database.json...`);
const itdb = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));
const maha = itdb.states.find(s => s.id === 'maharashtra');
assert.ok(maha, 'Maharashtra state must exist in india_tourism_database.json');
const itdbPune = maha.cities.find(c => c.id === 'pune');
assert.ok(itdbPune, 'Pune city must exist under Maharashtra in india_tourism_database.json');
assert.strictEqual(itdbPune.places_count, 25, `Pune places_count must be 25 in itdb`);
assert.strictEqual(itdbPune.heritage.length, 25, `Pune heritage count must be 25 in itdb`);
console.log(`✓ India Tourism Database has Pune with exactly 25 heritage attractions`);

// 6. Check CityHubPage.tsx title requirement
console.log(`[Test 6] Checking CityHubPage title requirement...`);
const cityHubContent = fs.readFileSync('src/pages/CityHubPage.tsx', 'utf8');
assert.ok(
  cityHubContent.includes('Verified Heritage Sites & Places in Pune (25)'),
  'CityHubPage must include exact text "Verified Heritage Sites & Places in Pune (25)"'
);
assert.ok(
  cityHubContent.includes('PUNE_ATTRACTIONS'),
  'CityHubPage must import and use PUNE_ATTRACTIONS'
);
console.log(`✓ CityHubPage displays exact requirement: "Verified Heritage Sites & Places in Pune (25)"`);

console.log('\n🎉 ALL 6 COMPREHENSIVE PUNE INTEGRATION TESTS PASSED PERFECTLY!\n');
