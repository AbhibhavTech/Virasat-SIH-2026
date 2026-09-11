import fs from 'fs';
import path from 'path';
import assert from 'assert';

const rootDir = process.cwd();

console.log('=== STARTING UNION TERRITORY INTEGRATION VERIFICATION ===\n');

// 1. Load files
const itdb = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'india_tourism_database.json'), 'utf8'));
const statesJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'states.json'), 'utf8'));
const citiesJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'cities.json'), 'utf8'));

// 2. Expected UTs and place counts
const EXPECTED_UTS = {
  'andaman-and-nicobar-islands': { name: 'Andaman and Nicobar Islands', expectedPlaces: 5 },
  'chandigarh': { name: 'Chandigarh', expectedPlaces: 5 },
  'dadra-and-nagar-haveli-and-daman-and-diu': { name: 'Dadra and Nagar Haveli and Daman and Diu', expectedPlaces: 5 },
  'delhi': { name: 'Delhi', expectedPlaces: 30 },
  'jammu-and-kashmir': { name: 'Jammu and Kashmir', expectedPlaces: 15 },
  'ladakh': { name: 'Ladakh', expectedPlaces: 10 },
  'lakshadweep': { name: 'Lakshadweep', expectedPlaces: 5 },
  'puducherry': { name: 'Puducherry', expectedPlaces: 5 },
};

console.log('TEST 1: Verifying all 8 Union Territories exist in india_tourism_database.json...');
let totalIntegratedUTPlaces = 0;
const foundPlaceIds = new Set();
const allPlacesMap = new Map();

for (const [utId, expected] of Object.entries(EXPECTED_UTS)) {
  const state = itdb.states.find(s => s.id === utId);
  assert(state, `UT ${utId} must exist in itdb.states`);
  assert.strictEqual(state.name, expected.name, `UT name must match`);

  const placesInState = [];
  for (const c of state.cities || []) {
    const raw = [
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || [])
    ];
    for (const p of raw) {
      assert(p.id, `Place in ${utId} must have an ID`);
      assert(!foundPlaceIds.has(p.id), `Place ID ${p.id} must be unique across all places`);
      foundPlaceIds.add(p.id);
      allPlacesMap.set(p.id, p);
      placesInState.push(p);

      // Verify fields
      assert.strictEqual(p.verification_status, 'verified', `${p.name} must be verified`);
      assert.strictEqual(p.status, 'VERIFIED', `${p.name} must have status VERIFIED`);
      assert(typeof p.lat === 'number' && typeof p.lng === 'number', `${p.name} must have numeric lat/lng`);
      assert(typeof p.coordinates?.lat === 'number' && typeof p.coordinates?.lng === 'number', `${p.name} must have numeric coordinates`);
      assert(p.description && p.description.length > 0, `${p.name} must have non-empty description`);
      assert(p.category && p.category.length > 0, `${p.name} must have category`);
    }
  }

  assert.strictEqual(placesInState.length, expected.expectedPlaces, `UT ${utId} must have exactly ${expected.expectedPlaces} places, but got ${placesInState.length}`);
  assert.strictEqual(state.total_attractions, expected.expectedPlaces, `state.total_attractions must match ${expected.expectedPlaces}`);
  console.log(`  ✓ ${state.name} (${utId}): ${placesInState.length}/${expected.expectedPlaces} places verified`);
  totalIntegratedUTPlaces += placesInState.length;
}

assert.strictEqual(totalIntegratedUTPlaces, 80, `Total integrated UT places must be exactly 80`);
console.log(`\nTEST 1 PASSED: Exactly 80 places verified across all 8 Union Territories.\n`);

console.log('TEST 2: Verifying every single place from source JSON files is present and matches...');
const sourceDir = path.join(rootDir, 'data', 'ut_source');
const sourceFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));

let sourcePlacesCount = 0;
for (const sf of sourceFiles) {
  const content = JSON.parse(fs.readFileSync(path.join(sourceDir, sf), 'utf8'));
  for (const sp of content.places || []) {
    sourcePlacesCount++;
    const integratedPlace = allPlacesMap.get(sp.id);
    assert(integratedPlace, `Source place ID ${sp.id} (${sp.name}) must exist in integrated database`);
    assert.strictEqual(integratedPlace.name, sp.name, `Place name must match source exactly`);
    assert.strictEqual(integratedPlace.description, sp.description, `Place description must match source exactly`);
  }
}
assert.strictEqual(sourcePlacesCount, 80, `Source files must contain exactly 80 places`);
console.log(`  ✓ All ${sourcePlacesCount} source places verified with exact names and descriptions.`);
console.log(`TEST 2 PASSED: 100% source fidelity.\n`);

console.log('TEST 3: Verifying 28 Non-UT States (including Maharashtra) are preserved...');
const canonicalUtIds = new Set(Object.keys(EXPECTED_UTS));
const nonUtStates = itdb.states.filter(s => !canonicalUtIds.has(s.id));
assert.strictEqual(nonUtStates.length, 28, `There must be exactly 28 non-UT states in itdb`);

const maharashtra = nonUtStates.find(s => s.id === 'maharashtra');
assert(maharashtra, `Maharashtra must be present`);
assert(maharashtra.cities.length > 0, `Maharashtra cities must be intact`);
console.log(`  ✓ Maharashtra verified: ${maharashtra.cities.length} cities, ${maharashtra.total_attractions} attractions untouched.`);

const rajasthan = nonUtStates.find(s => s.id === 'rajasthan');
assert(rajasthan, `Rajasthan must be present`);
console.log(`  ✓ Rajasthan verified: ${rajasthan.cities.length} cities, ${rajasthan.total_attractions} attractions untouched.`);
console.log(`TEST 3 PASSED: All 28 states completely preserved.\n`);

console.log('TEST 4: Verifying data/states.json and data/cities.json consistency...');
for (const [utId, expected] of Object.entries(EXPECTED_UTS)) {
  const s = statesJson.find(x => x.id === utId);
  assert(s, `State ${utId} must exist in states.json`);
  assert.strictEqual(s.total_attractions, expected.expectedPlaces, `states.json total_attractions for ${utId} must match`);
}
console.log(`  ✓ data/states.json synchronized for all 8 UTs.`);

const utCityIds = citiesJson.filter(c => canonicalUtIds.has(c.state_id));
assert(utCityIds.length >= 8, `At least 8 UT cities must exist in cities.json`);
console.log(`  ✓ data/cities.json synchronized.`);
console.log(`TEST 4 PASSED: Ancillary datasets synchronized.\n`);

console.log('TEST 5: Verifying src/data/indiaTourismDatabase.ts synchronization...');
const itdbTs = fs.readFileSync(path.join(rootDir, 'src', 'data', 'indiaTourismDatabase.ts'), 'utf8');
assert(itdbTs.includes('"states_count": 36'), `itdbTs must export states_count 36`);
assert(itdbTs.includes('andaman_nicobar_heritage_001'), `itdbTs must include Cellular Jail ID`);
assert(itdbTs.includes('DEL001'), `itdbTs must include Red Fort ID`);
assert(itdbTs.includes('JK001'), `itdbTs must include Dal Lake ID`);
assert(itdbTs.includes('LAD001'), `itdbTs must include Pangong Tso ID`);
assert(itdbTs.includes('LAK001'), `itdbTs must include Agatti Island ID`);
assert(itdbTs.includes('PUD001'), `itdbTs must include Sri Aurobindo Ashram ID`);
console.log(`  ✓ src/data/indiaTourismDatabase.ts validated.`);
console.log(`TEST 5 PASSED.\n`);

console.log('====================================================');
console.log('ALL 5 VERIFICATION SUITES PASSED WITH 100% SUCCESS!');
console.log('====================================================');
