import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

console.log('=== Verifying Arunachal Pradesh & Himachal Pradesh Integration ===\n');

let failed = false;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    failed = true;
  } else {
    console.log(`✓ PASS: ${msg}`);
  }
}

// 1. Raw JSON Files
const arunRawPath = path.join(rootDir, 'data', 'arunachal_pradesh_tourist_places_city_assigned.json');
const hpRawPath = path.join(rootDir, 'data', 'himachal_pradesh_tourist_places_city_assigned.json');

assert(fs.existsSync(arunRawPath), 'data/arunachal_pradesh_tourist_places_city_assigned.json exists');
assert(fs.existsSync(hpRawPath), 'data/himachal_pradesh_tourist_places_city_assigned.json exists');

const arunRaw = readJson(arunRawPath);
const hpRaw = readJson(hpRawPath);

assert(arunRaw.places && arunRaw.places.length === 15, `Arunachal raw JSON has 15 places (got ${arunRaw.places?.length})`);
assert(arunRaw.cities && arunRaw.cities.length === 9, `Arunachal raw JSON has 9 cities (got ${arunRaw.cities?.length})`);
assert(hpRaw.places && hpRaw.places.length === 20, `Himachal raw JSON has 20 places (got ${hpRaw.places?.length})`);
assert(hpRaw.cities && hpRaw.cities.length === 12, `Himachal raw JSON has 12 cities (got ${hpRaw.cities?.length})`);

// 2. Main Tourism Database
const itdbPath = path.join(rootDir, 'data', 'india_tourism_database.json');
const itdb = readJson(itdbPath);

assert(Array.isArray(itdb.states), 'itdb.states is an array');

const arunState = itdb.states.find(s => s.id === 'arunachal-pradesh');
assert(Boolean(arunState), "State 'arunachal-pradesh' found in database");
assert(arunState.total_cities === 9, `Arunachal total_cities is 9 (got ${arunState?.total_cities})`);
assert(arunState.total_attractions === 15, `Arunachal total_attractions is 15 (got ${arunState?.total_attractions})`);
assert(arunState.cities.length === 9, `Arunachal state has 9 city objects (got ${arunState?.cities.length})`);

const hpState = itdb.states.find(s => s.id === 'himachal-pradesh');
assert(Boolean(hpState), "State 'himachal-pradesh' found in database");
assert(hpState.total_cities === 12, `Himachal total_cities is 12 (got ${hpState?.total_cities})`);
assert(hpState.total_attractions === 20, `Himachal total_attractions is 20 (got ${hpState?.total_attractions})`);
assert(hpState.cities.length === 12, `Himachal state has 12 city objects (got ${hpState?.cities.length})`);

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

const arunPlacesInDb = extractPlaces(arunState);
assert(arunPlacesInDb.length === 15, `Extracted exactly 15 Arunachal places from ITDB (got ${arunPlacesInDb.length})`);

const hpPlacesInDb = extractPlaces(hpState);
assert(hpPlacesInDb.length === 20, `Extracted exactly 20 Himachal places from ITDB (got ${hpPlacesInDb.length})`);

// 3. Strict State Isolation Check
const arunIds = new Set(arunRaw.places.map(p => p.id));
const hpIds = new Set(hpRaw.places.map(p => p.id));

for (const state of itdb.states) {
  if (state.id === 'arunachal-pradesh') continue;
  const places = extractPlaces(state);
  for (const p of places) {
    if (arunIds.has(p.id)) {
      assert(false, `Contamination! Arunachal place '${p.id}' (${p.name}) found under '${state.id}'`);
    }
  }
}
assert(true, 'Verified zero Arunachal Pradesh places contaminated into other states or UTs');

for (const state of itdb.states) {
  if (state.id === 'himachal-pradesh') continue;
  const places = extractPlaces(state);
  for (const p of places) {
    if (hpIds.has(p.id)) {
      assert(false, `Contamination! Himachal place '${p.id}' (${p.name}) found under '${state.id}'`);
    }
  }
}
assert(true, 'Verified zero Himachal Pradesh places contaminated into other states or UTs');

// 4. Verify City Distribution
const expectedArunCities = {
  tawang: 5,
  dirang: 1,
  bomdila: 1,
  ziro: 1,
  miao: 1,
  jengging: 1,
  itanagar: 3,
  mechuka: 1,
  pasighat: 1
};

for (const [cityId, expCount] of Object.entries(expectedArunCities)) {
  const city = arunState.cities.find(c => c.id === cityId);
  assert(Boolean(city), `Arunachal city '${cityId}' exists`);
  const cPlaces = city?.places || [];
  assert(cPlaces.length === expCount, `Arunachal city '${cityId}' has ${expCount} places (got ${cPlaces.length})`);
}

const expectedHpCities = {
  shimla: 4,
  kufri: 1,
  manali: 4,
  kasol: 1,
  barshaini: 1,
  dharamshala: 2,
  'mcleod-ganj': 2,
  khajjiar: 1,
  dalhousie: 1,
  chail: 1,
  kullu: 1,
  kaza: 1
};

for (const [cityId, expCount] of Object.entries(expectedHpCities)) {
  const city = hpState.cities.find(c => c.id === cityId);
  assert(Boolean(city), `Himachal city '${cityId}' exists`);
  const cPlaces = city?.places || [];
  assert(cPlaces.length === expCount, `Himachal city '${cityId}' has ${expCount} places (got ${cPlaces.length})`);
}

// 5. Verify data/cities.json
const citiesList = readJson(path.join(rootDir, 'data', 'cities.json'));
const arunCitiesInJson = citiesList.filter(c => c.state_id === 'arunachal-pradesh');
assert(arunCitiesInJson.length === 9, `data/cities.json has 9 Arunachal cities (got ${arunCitiesInJson.length})`);

const hpCitiesInJson = citiesList.filter(c => c.state_id === 'himachal-pradesh');
assert(hpCitiesInJson.length === 12, `data/cities.json has 12 Himachal cities (got ${hpCitiesInJson.length})`);

// 6. Verify data/states.json
const statesList = readJson(path.join(rootDir, 'data', 'states.json'));
const arunStateInJson = statesList.find(s => s.id === 'arunachal-pradesh');
assert(arunStateInJson?.total_cities === 9, `states.json Arunachal total_cities is 9 (got ${arunStateInJson?.total_cities})`);
assert(arunStateInJson?.total_attractions === 15, `states.json Arunachal total_attractions is 15 (got ${arunStateInJson?.total_attractions})`);

const hpStateInJson = statesList.find(s => s.id === 'himachal-pradesh');
assert(hpStateInJson?.total_cities === 12, `states.json Himachal total_cities is 12 (got ${hpStateInJson?.total_cities})`);
assert(hpStateInJson?.total_attractions === 20, `states.json Himachal total_attractions is 20 (got ${hpStateInJson?.total_attractions})`);

// 7. Verify regional files
const arunRegionalPlaces = readJson(path.join(rootDir, 'data', 'arunachal-pradesh', 'places.json'));
assert(Array.isArray(arunRegionalPlaces) && arunRegionalPlaces.length === 15, `data/arunachal-pradesh/places.json has 15 places (got ${arunRegionalPlaces?.length})`);

const hpRegionalPlaces = readJson(path.join(rootDir, 'data', 'himachal-pradesh', 'places.json'));
assert(Array.isArray(hpRegionalPlaces) && hpRegionalPlaces.length === 20, `data/himachal-pradesh/places.json has 20 places (got ${hpRegionalPlaces?.length})`);

// 8. Coordinates & Required Attributes
for (const p of [...arunPlacesInDb, ...hpPlacesInDb]) {
  assert(p.coordinates && typeof p.coordinates.lat === 'number' && typeof p.coordinates.lng === 'number', `Place ${p.id} has valid coordinates`);
  assert(p.coordinates.lat > 6 && p.coordinates.lat < 38 && p.coordinates.lng > 68 && p.coordinates.lng < 98, `Place ${p.id} coordinates within India bounds`);
  assert(typeof p.name === 'string' && p.name.length > 0, `Place ${p.id} has valid name`);
  assert(typeof p.summary === 'string' && p.summary.length > 0, `Place ${p.id} has non-empty summary`);
}

if (failed) {
  console.error('\n❌ VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('\n======================================================');
  console.log('✅ ALL ARUNACHAL & HIMACHAL VERIFICATIONS PASSED!');
  console.log('======================================================');
}
