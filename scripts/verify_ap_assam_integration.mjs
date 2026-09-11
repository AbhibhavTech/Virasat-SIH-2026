import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

console.log('=== Verifying Andhra Pradesh & Assam Integration ===\n');

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    failed = true;
  } else {
    console.log(`✓ PASS: ${msg}`);
  }
}

// 1. Check raw JSON files
const apRawPath = path.join(rootDir, 'data', 'andhra_pradesh_tourist_places_city_assigned.json');
const assamRawPath = path.join(rootDir, 'data', 'assam_tourist_places_city_assigned.json');

assert(fs.existsSync(apRawPath), 'data/andhra_pradesh_tourist_places_city_assigned.json exists');
assert(fs.existsSync(assamRawPath), 'data/assam_tourist_places_city_assigned.json exists');

const apRaw = readJson(apRawPath);
const assamRaw = readJson(assamRawPath);

assert(apRaw.places && apRaw.places.length === 15, `AP raw JSON has exactly 15 places (got ${apRaw.places?.length})`);
assert(apRaw.cities && apRaw.cities.length === 10, `AP raw JSON has exactly 10 cities (got ${apRaw.cities?.length})`);
assert(assamRaw.places && assamRaw.places.length === 15, `Assam raw JSON has exactly 15 places (got ${assamRaw.places?.length})`);
assert(assamRaw.cities && assamRaw.cities.length === 10, `Assam raw JSON has exactly 10 cities (got ${assamRaw.cities?.length})`);

// 2. Check india_tourism_database.json
const itdbPath = path.join(rootDir, 'data', 'india_tourism_database.json');
const itdb = readJson(itdbPath);

assert(Array.isArray(itdb.states), 'itdb.states is an array');

const apState = itdb.states.find(s => s.id === 'andhra-pradesh');
assert(Boolean(apState), "State 'andhra-pradesh' found in database");
assert(apState.total_cities === 10, `AP total_cities is 10 (got ${apState?.total_cities})`);
assert(apState.total_attractions === 15, `AP total_attractions is 15 (got ${apState?.total_attractions})`);
assert(apState.cities.length === 10, `AP state has 10 city objects (got ${apState?.cities.length})`);

const assamState = itdb.states.find(s => s.id === 'assam');
assert(Boolean(assamState), "State 'assam' found in database");
assert(assamState.total_cities === 10, `Assam total_cities is 10 (got ${assamState?.total_cities})`);
assert(assamState.total_attractions === 15, `Assam total_attractions is 15 (got ${assamState?.total_attractions})`);
assert(assamState.cities.length === 10, `Assam state has 10 city objects (got ${assamState?.cities.length})`);

// Count places in AP and Assam
function extractPlaces(stateObj) {
  const list = [];
  for (const c of stateObj.cities || []) {
    const pList = [
      ...(c.places || []),
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || []),
      ...(c.attractions || [])
    ];
    const seen = new Set();
    for (const p of pList) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        list.push({ ...p, cityId: c.id, cityName: c.name });
      }
    }
  }
  return list;
}

const apPlacesInDb = extractPlaces(apState);
assert(apPlacesInDb.length === 15, `Extracted exactly 15 AP places (got ${apPlacesInDb.length})`);

const assamPlacesInDb = extractPlaces(assamState);
assert(assamPlacesInDb.length === 15, `Extracted exactly 15 Assam places (got ${assamPlacesInDb.length})`);

// Check AP place isolation: No AP place should exist in any other state or UT
const apIds = new Set(apRaw.places.map(p => p.id));
const assamIds = new Set(assamRaw.places.map(p => p.place_id));

for (const state of itdb.states) {
  if (state.id === 'andhra-pradesh') continue;
  const places = extractPlaces(state);
  for (const p of places) {
    if (apIds.has(p.id)) {
      assert(false, `Contamination! AP place '${p.id}' (${p.name}) found under '${state.id}'`);
    }
  }
}
assert(true, 'Verified zero AP places contaminated into other states or UTs');

for (const state of itdb.states) {
  if (state.id === 'assam') continue;
  const places = extractPlaces(state);
  for (const p of places) {
    if (assamIds.has(p.id)) {
      assert(false, `Contamination! Assam place '${p.id}' (${p.name}) found under '${state.id}'`);
    }
  }
}
assert(true, 'Verified zero Assam places contaminated into other states or UTs');

// 3. Verify city distribution
const expectedApCities = {
  tirupati: 1,
  srikalahasti: 1,
  'araku-valley': 3,
  visakhapatnam: 3,
  lepakshi: 1,
  amaravati: 1,
  vijayawada: 2,
  rajamahendravaram: 1,
  sullurpeta: 1,
  kondapalli: 1
};

for (const [cityId, expCount] of Object.entries(expectedApCities)) {
  const city = apState.cities.find(c => c.id === cityId);
  assert(Boolean(city), `AP city '${cityId}' exists`);
  const cPlaces = city?.places || [];
  assert(cPlaces.length === expCount, `AP city '${cityId}' has ${expCount} places (got ${cPlaces.length})`);
}

const expectedAssamCities = {
  guwahati: 4,
  mayong: 1,
  kohora: 1,
  bansbari: 1,
  orang: 1,
  bhalukpong: 1,
  majuli: 1,
  sivasagar: 3,
  sonari: 1,
  haflong: 1
};

for (const [cityId, expCount] of Object.entries(expectedAssamCities)) {
  const city = assamState.cities.find(c => c.id === cityId);
  assert(Boolean(city), `Assam city '${cityId}' exists`);
  const cPlaces = city?.places || [];
  assert(cPlaces.length === expCount, `Assam city '${cityId}' has ${expCount} places (got ${cPlaces.length})`);
}

// 4. Verify data/cities.json
const citiesList = readJson(path.join(rootDir, 'data', 'cities.json'));
const apCitiesInJson = citiesList.filter(c => c.state_id === 'andhra-pradesh');
assert(apCitiesInJson.length === 10, `data/cities.json has 10 AP cities (got ${apCitiesInJson.length})`);

const assamCitiesInJson = citiesList.filter(c => c.state_id === 'assam');
assert(assamCitiesInJson.length === 10, `data/cities.json has 10 Assam cities (got ${assamCitiesInJson.length})`);

// 5. Verify data/states.json
const statesList = readJson(path.join(rootDir, 'data', 'states.json'));
const apStateInJson = statesList.find(s => s.id === 'andhra-pradesh');
assert(apStateInJson?.total_cities === 10, `states.json AP total_cities is 10 (got ${apStateInJson?.total_cities})`);
assert(apStateInJson?.total_attractions === 15, `states.json AP total_attractions is 15 (got ${apStateInJson?.total_attractions})`);

const assamStateInJson = statesList.find(s => s.id === 'assam');
assert(assamStateInJson?.total_cities === 10, `states.json Assam total_cities is 10 (got ${assamStateInJson?.total_cities})`);
assert(assamStateInJson?.total_attractions === 15, `states.json Assam total_attractions is 15 (got ${assamStateInJson?.total_attractions})`);

// 6. Verify regional files
const apRegionalPlaces = readJson(path.join(rootDir, 'data', 'andhra-pradesh', 'places.json'));
assert(Array.isArray(apRegionalPlaces) && apRegionalPlaces.length === 15, `data/andhra-pradesh/places.json has 15 places (got ${apRegionalPlaces?.length})`);

const assamRegionalPlaces = readJson(path.join(rootDir, 'data', 'assam', 'places.json'));
assert(Array.isArray(assamRegionalPlaces) && assamRegionalPlaces.length === 15, `data/assam/places.json has 15 places (got ${assamRegionalPlaces?.length})`);

// 7. Verify Coordinates & Required Attributes
for (const p of [...apPlacesInDb, ...assamPlacesInDb]) {
  assert(p.coordinates && typeof p.coordinates.lat === 'number' && typeof p.coordinates.lng === 'number', `Place ${p.id} has valid coordinates`);
  assert(p.coordinates.lat > 6 && p.coordinates.lat < 38 && p.coordinates.lng > 68 && p.coordinates.lng < 98, `Place ${p.id} coordinates (${p.coordinates.lat}, ${p.coordinates.lng}) within India bounds`);
  assert(typeof p.name === 'string' && p.name.length > 0, `Place ${p.id} has valid name`);
  assert(typeof p.summary === 'string' && p.summary.length > 0, `Place ${p.id} has non-empty summary`);
}

if (failed) {
  console.error('\n❌ INTEGRATION VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('\n======================================================');
  console.log('✅ ALL VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('======================================================');
}
