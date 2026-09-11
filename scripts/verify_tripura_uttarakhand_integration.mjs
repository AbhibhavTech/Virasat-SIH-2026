import fs from 'fs';
import path from 'path';
import assert from 'assert';

const rootDir = process.cwd();

console.log('=== STARTING TRIPURA & UTTARAKHAND INTEGRATION VERIFICATION ===\n');

// 1. Check raw source files
console.log('TEST 1: Verifying assigned JSON files in data/...');
const tripuraRawPath = path.join(rootDir, 'data', 'tripura_tourist_places_city_assigned.json');
const ukRawPath = path.join(rootDir, 'data', 'uttarakhand_tourist_places_city_assigned.json');

assert(fs.existsSync(tripuraRawPath), 'tripura_tourist_places_city_assigned.json must exist');
assert(fs.existsSync(ukRawPath), 'uttarakhand_tourist_places_city_assigned.json must exist');

const tripuraRaw = JSON.parse(fs.readFileSync(tripuraRawPath, 'utf8'));
const ukRaw = JSON.parse(fs.readFileSync(ukRawPath, 'utf8'));

assert.strictEqual(tripuraRaw.places.length, 5, 'Tripura raw must have 5 places');
assert.strictEqual(tripuraRaw.cities.length, 5, 'Tripura raw must have 5 cities');
assert.strictEqual(ukRaw.places.length, 20, 'Uttarakhand raw must have 20 places');
assert.strictEqual(ukRaw.cities.length, 17, 'Uttarakhand raw must have 17 cities');
console.log('  ✓ Tripura and Uttarakhand assigned JSON files present and valid.\n');

// 2. Regional files
console.log('TEST 2: Verifying regional places.json files...');
const tripuraRegionalPath = path.join(rootDir, 'data', 'tripura', 'places.json');
const ukRegionalPath = path.join(rootDir, 'data', 'uttarakhand', 'places.json');

assert(fs.existsSync(tripuraRegionalPath), 'data/tripura/places.json must exist');
assert(fs.existsSync(ukRegionalPath), 'data/uttarakhand/places.json must exist');

const tripuraRegional = JSON.parse(fs.readFileSync(tripuraRegionalPath, 'utf8'));
const ukRegional = JSON.parse(fs.readFileSync(ukRegionalPath, 'utf8'));

assert.strictEqual(tripuraRegional.length, 5, 'Tripura regional places must have 5 places');
assert.strictEqual(ukRegional.length, 20, 'Uttarakhand regional places must have 20 places');
console.log('  ✓ Regional places files verified with 5 Tripura and 20 Uttarakhand places.\n');

// 3. Database files
console.log('TEST 3: Verifying india_tourism_database.json...');
const itdb = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'india_tourism_database.json'), 'utf8'));
assert(Array.isArray(itdb.states), 'itdb.states must be an array');
assert.strictEqual(itdb.states.length, 36, 'itdb must have 36 states (28 states + 8 UTs)');

const tripura = itdb.states.find(s => s.id === 'tripura');
assert(tripura, 'Tripura state must exist in itdb');
assert.strictEqual(tripura.name, 'Tripura');
assert.strictEqual(tripura.cities.length, 5, `Tripura must have 5 cities, found ${tripura.cities.length}`);
assert.strictEqual(tripura.total_attractions, 5, `Tripura total_attractions must be 5, found ${tripura.total_attractions}`);

const uttarakhand = itdb.states.find(s => s.id === 'uttarakhand');
assert(uttarakhand, 'Uttarakhand state must exist in itdb');
assert.strictEqual(uttarakhand.name, 'Uttarakhand');
assert.strictEqual(uttarakhand.cities.length, 17, `Uttarakhand must have 17 cities, found ${uttarakhand.cities.length}`);
assert.strictEqual(uttarakhand.total_attractions, 20, `Uttarakhand total_attractions must be 20, found ${uttarakhand.total_attractions}`);

// Helper to extract unique places from a state
function extractUniquePlaces(stateObj) {
  const placesList = [];
  const seen = new Set();
  for (const city of stateObj.cities || []) {
    const raw = [
      ...(city.places || []),
      ...(city.heritage || []),
      ...(city.monuments || []),
      ...(city.museums || []),
      ...(city.tourist_places || []),
      ...(city.religious_cultural || []),
      ...(city.nature_parks_zoo || []),
      ...(city.attractions || [])
    ];
    for (const p of raw) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        placesList.push({ ...p, cityId: city.id, cityName: city.name });
      }
    }
  }
  return placesList;
}

const tripuraPlaces = extractUniquePlaces(tripura);
assert.strictEqual(tripuraPlaces.length, 5, `Tripura must contain exactly 5 places across its cities, got ${tripuraPlaces.length}`);

const ukPlaces = extractUniquePlaces(uttarakhand);
assert.strictEqual(ukPlaces.length, 20, `Uttarakhand must contain exactly 20 places across its cities, got ${ukPlaces.length}`);
console.log('  ✓ Tripura (5 cities, 5 places) and Uttarakhand (17 cities, 20 places) verified in ITDB.\n');

// 4. City-wise assignment verification
console.log('TEST 4: Verifying exact city-to-place mappings...');
const expectedTripuraCityPlaces = {
  'agartala': ['tripura-001'],
  'melaghar': ['tripura-002'],
  'kailashahar': ['tripura-003'],
  'bishalgarh': ['tripura-004'],
  'jampui-hills': ['tripura-005']
};

for (const [cId, pIds] of Object.entries(expectedTripuraCityPlaces)) {
  const city = tripura.cities.find(c => c.id === cId);
  assert(city, `City ${cId} must exist in Tripura`);
  const cPlaces = (city.places || []).map(p => p.id).sort();
  const expIds = [...pIds].sort();
  assert.deepStrictEqual(cPlaces, expIds, `City ${cId} places mismatch: got ${cPlaces}, expected ${expIds}`);
  console.log(`  ✓ Tripura -> ${city.name} (${cId}): ${cPlaces.join(', ')}`);
}

const expectedUkCityPlaces = {
  'rishikesh': ['uttarakhand_001'],
  'haridwar': ['uttarakhand_002'],
  'mussoorie': ['uttarakhand_003'],
  'nainital': ['uttarakhand_004', 'uttarakhand_005'],
  'ramnagar': ['uttarakhand_006'],
  'ghangaria': ['uttarakhand_007', 'uttarakhand_008'],
  'kedarnath': ['uttarakhand_009'],
  'badrinath': ['uttarakhand_010'],
  'gangotri': ['uttarakhand_011'],
  'janki-chatti': ['uttarakhand_012'],
  'auli': ['uttarakhand_013'],
  'chopta': ['uttarakhand_014', 'uttarakhand_015'],
  'ranikhet': ['uttarakhand_016'],
  'almora': ['uttarakhand_017'],
  'pithoragarh': ['uttarakhand_018'],
  'landour': ['uttarakhand_019'],
  'tehri': ['uttarakhand_020']
};

for (const [cId, pIds] of Object.entries(expectedUkCityPlaces)) {
  const city = uttarakhand.cities.find(c => c.id === cId);
  assert(city, `City ${cId} must exist in Uttarakhand`);
  const cPlaces = (city.places || []).map(p => p.id).sort();
  const expIds = [...pIds].sort();
  assert.deepStrictEqual(cPlaces, expIds, `City ${cId} places mismatch: got ${cPlaces}, expected ${expIds}`);
  console.log(`  ✓ Uttarakhand -> ${city.name} (${cId}): ${cPlaces.join(', ')}`);
}
console.log('TEST 4 PASSED: Exact city-level assignments verified for all 25 places.\n');

// 5. Strict containment check (No contamination to other states/UTs)
console.log('TEST 5: Verifying strict state isolation (no cross-contamination)...');
const tripuraPlaceIdSet = new Set(tripuraPlaces.map(p => p.id));
const ukPlaceIdSet = new Set(ukPlaces.map(p => p.id));

for (const state of itdb.states) {
  if (state.id !== 'tripura' && state.id !== 'uttarakhand') {
    const sPlaces = extractUniquePlaces(state);
    for (const p of sPlaces) {
      assert(!tripuraPlaceIdSet.has(p.id), `CRITICAL: Tripura place ${p.id} found in other state ${state.id} (${p.cityId})`);
      assert(!ukPlaceIdSet.has(p.id), `CRITICAL: Uttarakhand place ${p.id} found in other state ${state.id} (${p.cityId})`);
    }
  }
}
console.log('  ✓ Zero contamination: No Tripura or Uttarakhand place appears under any other state or UT.\n');

// 6. Check data/cities.json and data/states.json
console.log('TEST 6: Verifying data/cities.json and data/states.json...');
const citiesJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'cities.json'), 'utf8'));
const statesJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'states.json'), 'utf8'));

const tripuraCitiesInJson = citiesJson.filter(c => c.state_id === 'tripura');
assert.strictEqual(tripuraCitiesInJson.length, 5, `cities.json must have 5 Tripura cities, got ${tripuraCitiesInJson.length}`);

const ukCitiesInJson = citiesJson.filter(c => c.state_id === 'uttarakhand');
assert.strictEqual(ukCitiesInJson.length, 17, `cities.json must have 17 Uttarakhand cities, got ${ukCitiesInJson.length}`);

const tripuraInStatesJson = statesJson.find(s => s.id === 'tripura');
assert(tripuraInStatesJson, 'tripura in states.json');
assert.strictEqual(tripuraInStatesJson.total_attractions, 5);
assert.strictEqual(tripuraInStatesJson.total_cities, 5);

const ukInStatesJson = statesJson.find(s => s.id === 'uttarakhand');
assert(ukInStatesJson, 'uttarakhand in states.json');
assert.strictEqual(ukInStatesJson.total_attractions, 20);
assert.strictEqual(ukInStatesJson.total_cities, 17);
console.log('  ✓ data/cities.json and data/states.json properly synchronized.\n');

// 7. Check place details, coordinates, metadata
console.log('TEST 7: Verifying place attributes (coords, description, etc.)...');
for (const p of [...tripuraPlaces, ...ukPlaces]) {
  assert(p.id, 'place has id');
  assert(p.name, `${p.id} has name`);
  assert(p.description, `${p.id} has description`);
  assert(typeof p.lat === 'number' && !isNaN(p.lat), `${p.id} has valid lat`);
  assert(typeof p.lng === 'number' && !isNaN(p.lng), `${p.id} has valid lng`);
  assert(p.coordinates && typeof p.coordinates.lat === 'number' && typeof p.coordinates.lng === 'number', `${p.id} coordinates`);
  assert(p.suggested_duration, `${p.id} suggested_duration`);
  assert(p.best_time_to_visit, `${p.id} best_time_to_visit`);
  assert(p.entry_fee, `${p.id} entry_fee`);
  assert(p.opening_hours, `${p.id} opening_hours`);
}
console.log('  ✓ All 25 places have valid coordinates, descriptions, and metadata.\n');

console.log('====================================================');
console.log('ALL VERIFICATION CHECKS PASSED WITH ZERO ERRORS! 🚀');
console.log('====================================================\n');
