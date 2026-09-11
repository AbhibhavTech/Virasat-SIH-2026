import fs from 'fs';
import path from 'path';
import assert from 'assert';

const rootDir = process.cwd();

console.log('=== STARTING KERALA & SIKKIM INTEGRATION VERIFICATION ===\n');

// 1. Check raw source files
console.log('TEST 1: Verifying assigned JSON files in data/...');
const keralaRawPath = path.join(rootDir, 'data', 'kerala_tourist_places_city_assigned.json');
const sikkimRawPath = path.join(rootDir, 'data', 'sikkim_tourist_places_city_assigned.json');

assert(fs.existsSync(keralaRawPath), 'kerala_tourist_places_city_assigned.json must exist');
assert(fs.existsSync(sikkimRawPath), 'sikkim_tourist_places_city_assigned.json must exist');

const keralaRaw = JSON.parse(fs.readFileSync(keralaRawPath, 'utf8'));
const sikkimRaw = JSON.parse(fs.readFileSync(sikkimRawPath, 'utf8'));

assert.strictEqual(keralaRaw.places.length, 20, 'Kerala raw must have 20 places');
assert.strictEqual(keralaRaw.cities.length, 15, 'Kerala raw must have 15 cities');
assert.strictEqual(sikkimRaw.places.length, 10, 'Sikkim raw must have 10 places');
assert.strictEqual(sikkimRaw.cities.length, 5, 'Sikkim raw must have 5 cities');
console.log('  ✓ Kerala and Sikkim assigned JSON files present and valid.\n');

// 2. Regional files
console.log('TEST 2: Verifying regional places.json files...');
const keralaRegionalPath = path.join(rootDir, 'data', 'kerala', 'places.json');
const sikkimRegionalPath = path.join(rootDir, 'data', 'sikkim', 'places.json');

assert(fs.existsSync(keralaRegionalPath), 'data/kerala/places.json must exist');
assert(fs.existsSync(sikkimRegionalPath), 'data/sikkim/places.json must exist');

const keralaRegional = JSON.parse(fs.readFileSync(keralaRegionalPath, 'utf8'));
const sikkimRegional = JSON.parse(fs.readFileSync(sikkimRegionalPath, 'utf8'));

assert.strictEqual(keralaRegional.length, 20, 'Kerala regional places must have 20 places');
assert.strictEqual(sikkimRegional.length, 10, 'Sikkim regional places must have 10 places');
console.log('  ✓ Regional places files verified with 20 Kerala and 10 Sikkim places.\n');

// 3. Database files
console.log('TEST 3: Verifying india_tourism_database.json...');
const itdb = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'india_tourism_database.json'), 'utf8'));
assert(Array.isArray(itdb.states), 'itdb.states must be an array');
assert.strictEqual(itdb.states.length, 36, 'itdb must have 36 states (28 states + 8 UTs)');

const kerala = itdb.states.find(s => s.id === 'kerala');
assert(kerala, 'Kerala state must exist in itdb');
assert.strictEqual(kerala.name, 'Kerala');
assert.strictEqual(kerala.cities.length, 15, `Kerala must have 15 cities, found ${kerala.cities.length}`);
assert.strictEqual(kerala.total_attractions, 20, `Kerala total_attractions must be 20, found ${kerala.total_attractions}`);

const sikkim = itdb.states.find(s => s.id === 'sikkim');
assert(sikkim, 'Sikkim state must exist in itdb');
assert.strictEqual(sikkim.name, 'Sikkim');
assert.strictEqual(sikkim.cities.length, 5, `Sikkim must have 5 cities, found ${sikkim.cities.length}`);
assert.strictEqual(sikkim.total_attractions, 10, `Sikkim total_attractions must be 10, found ${sikkim.total_attractions}`);

// Collect all places from Kerala
const keralaPlaces = [];
for (const city of kerala.cities) {
  const cPlaces = [
    ...(city.heritage || []),
    ...(city.monuments || []),
    ...(city.museums || []),
    ...(city.tourist_places || []),
    ...(city.religious_cultural || []),
    ...(city.nature_parks_zoo || [])
  ];
  keralaPlaces.push(...cPlaces);
}
assert.strictEqual(keralaPlaces.length, 20, `Kerala must contain exactly 20 places across its cities`);

// Collect all places from Sikkim
const sikkimPlaces = [];
for (const city of sikkim.cities) {
  const cPlaces = [
    ...(city.heritage || []),
    ...(city.monuments || []),
    ...(city.museums || []),
    ...(city.tourist_places || []),
    ...(city.religious_cultural || []),
    ...(city.nature_parks_zoo || [])
  ];
  sikkimPlaces.push(...cPlaces);
}
assert.strictEqual(sikkimPlaces.length, 10, `Sikkim must contain exactly 10 places across its cities`);
console.log('  ✓ Kerala (15 cities, 20 places) and Sikkim (5 cities, 10 places) verified in ITDB.\n');

// 4. City-wise assignment verification
console.log('TEST 4: Verifying exact city-to-place mappings...');
const expectedKeralaCityPlaces = {
  'munnar': ['kerala_001'],
  'alappuzha': ['kerala_002', 'kerala_018'],
  'kochi': ['kerala_003', 'kerala_004', 'kerala_005'],
  'thiruvananthapuram': ['kerala_006', 'kerala_008'],
  'varkala': ['kerala_007'],
  'thekkady': ['kerala_009'],
  'wayanad': ['kerala_010', 'kerala_011'],
  'athirappilly': ['kerala_012'],
  'kumarakom': ['kerala_013'],
  'kozhikode': ['kerala_014'],
  'bekal': ['kerala_015'],
  'silent-valley': ['kerala_016'],
  'sabarimala': ['kerala_017'],
  'thattekad': ['kerala_019'],
  'tripunithura': ['kerala_020']
};

for (const [cId, pIds] of Object.entries(expectedKeralaCityPlaces)) {
  const city = kerala.cities.find(c => c.id === cId);
  assert(city, `City ${cId} must exist in Kerala`);
  const cPlaces = [
    ...(city.heritage || []),
    ...(city.monuments || []),
    ...(city.museums || []),
    ...(city.tourist_places || []),
    ...(city.religious_cultural || []),
    ...(city.nature_parks_zoo || [])
  ];
  const actualIds = cPlaces.map(p => p.id).sort();
  const expIds = [...pIds].sort();
  assert.deepStrictEqual(actualIds, expIds, `City ${cId} places mismatch: got ${actualIds}, expected ${expIds}`);
  console.log(`  ✓ Kerala -> ${city.name} (${cId}): ${actualIds.join(', ')}`);
}

const expectedSikkimCityPlaces = {
  'gangtok': ['sikkim_001', 'sikkim_002'],
  'tsomgo': ['sikkim_003', 'sikkim_004', 'sikkim_005'],
  'lachung': ['sikkim_006', 'sikkim_007'],
  'lachen': ['sikkim_008'],
  'pelling': ['sikkim_009', 'sikkim_010']
};

for (const [cId, pIds] of Object.entries(expectedSikkimCityPlaces)) {
  const city = sikkim.cities.find(c => c.id === cId);
  assert(city, `City ${cId} must exist in Sikkim`);
  const cPlaces = [
    ...(city.heritage || []),
    ...(city.monuments || []),
    ...(city.museums || []),
    ...(city.tourist_places || []),
    ...(city.religious_cultural || []),
    ...(city.nature_parks_zoo || [])
  ];
  const actualIds = cPlaces.map(p => p.id).sort();
  const expIds = [...pIds].sort();
  assert.deepStrictEqual(actualIds, expIds, `City ${cId} places mismatch: got ${actualIds}, expected ${expIds}`);
  console.log(`  ✓ Sikkim -> ${city.name} (${cId}): ${actualIds.join(', ')}`);
}
console.log('TEST 4 PASSED: Exact city-level assignments verified for all 30 places.\n');

// 5. Strict containment check (No contamination to other states/UTs)
console.log('TEST 5: Verifying strict state isolation (no cross-contamination)...');
const keralaPlaceIdSet = new Set(keralaPlaces.map(p => p.id));
const sikkimPlaceIdSet = new Set(sikkimPlaces.map(p => p.id));

for (const state of itdb.states) {
  if (state.id !== 'kerala' && state.id !== 'sikkim') {
    for (const city of state.cities || []) {
      const cPlaces = [
        ...(city.heritage || []),
        ...(city.monuments || []),
        ...(city.museums || []),
        ...(city.tourist_places || []),
        ...(city.religious_cultural || []),
        ...(city.nature_parks_zoo || [])
      ];
      for (const p of cPlaces) {
        assert(!keralaPlaceIdSet.has(p.id), `CRITICAL: Kerala place ${p.id} found in other state ${state.id} (${city.id})`);
        assert(!sikkimPlaceIdSet.has(p.id), `CRITICAL: Sikkim place ${p.id} found in other state ${state.id} (${city.id})`);
      }
    }
  }
}
console.log('  ✓ Zero contamination: No Kerala or Sikkim place appears under any other state or UT.\n');

// 6. Check data/cities.json and data/states.json
console.log('TEST 6: Verifying data/cities.json and data/states.json...');
const citiesJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'cities.json'), 'utf8'));
const statesJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'states.json'), 'utf8'));

const keralaCitiesInJson = citiesJson.filter(c => c.state_id === 'kerala');
assert.strictEqual(keralaCitiesInJson.length, 15, `cities.json must have 15 Kerala cities, got ${keralaCitiesInJson.length}`);

const sikkimCitiesInJson = citiesJson.filter(c => c.state_id === 'sikkim');
assert.strictEqual(sikkimCitiesInJson.length, 5, `cities.json must have 5 Sikkim cities, got ${sikkimCitiesInJson.length}`);

const keralaInStatesJson = statesJson.find(s => s.id === 'kerala');
assert(keralaInStatesJson, 'kerala in states.json');
assert.strictEqual(keralaInStatesJson.total_attractions, 20);
assert.strictEqual(keralaInStatesJson.total_cities, 15);

const sikkimInStatesJson = statesJson.find(s => s.id === 'sikkim');
assert(sikkimInStatesJson, 'sikkim in states.json');
assert.strictEqual(sikkimInStatesJson.total_attractions, 10);
assert.strictEqual(sikkimInStatesJson.total_cities, 5);
console.log('  ✓ data/cities.json and data/states.json properly synchronized.\n');

// 7. Check place details, coordinates, metadata
console.log('TEST 7: Verifying place attributes (coords, description, etc.)...');
for (const p of [...keralaPlaces, ...sikkimPlaces]) {
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
console.log('  ✓ All 30 places have valid coordinates, descriptions, and metadata.\n');

console.log('====================================================');
console.log('ALL VERIFICATION CHECKS PASSED WITH ZERO ERRORS! 🚀');
console.log('====================================================\n');
