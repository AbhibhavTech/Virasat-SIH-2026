import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🏛️  VIRASAT — PILOT DATASET & POLICY QUALITY AUDITOR 🏛️');
console.log('=====================================================');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, testName, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedChecks++;
    console.error(`  ❌ [FAIL] ${testName} ${details ? `— ${details}` : ''}`);
  }
}

// 1. Load Files
const dbStorePath = path.join(rootDir, 'data', '.database', 'virasat_store.json');
const indiaTourismJsonPath = path.join(rootDir, 'data', 'india_tourism_database.json');
const statesPath = path.join(rootDir, 'data', 'states.json');
const citiesPath = path.join(rootDir, 'data', 'cities.json');

assert(fs.existsSync(dbStorePath), 'Database store file exists');
assert(fs.existsSync(indiaTourismJsonPath), 'Frontend tourism database JSON exists');
assert(fs.existsSync(statesPath), 'Canonical states.json exists');
assert(fs.existsSync(citiesPath), 'Canonical cities.json exists');

const dbStore = JSON.parse(fs.readFileSync(dbStorePath, 'utf8'));
const indiaTourismData = JSON.parse(fs.readFileSync(indiaTourismJsonPath, 'utf8'));
const canonicalStates = JSON.parse(fs.readFileSync(statesPath, 'utf8'));
const canonicalCities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));

const pilotStateIds = [
  'himachal-pradesh',
  'punjab',
  'rajasthan',
  'uttar-pradesh',
  'arunachal-pradesh',
];

console.log('\n--- TEST SUITE 1: 5 PILOT STATES INGESTION & COMPLETENESS ---');
for (const stateId of pilotStateIds) {
  const storeState = dbStore.states[stateId];
  assert(Boolean(storeState), `Pilot state '${stateId}' present in database store`);
  if (storeState) {
    assert(storeState.status === 'verified', `State '${stateId}' has status 'verified'`);
    assert(Boolean(storeState.official_tourism_url), `State '${stateId}' has official_tourism_url: ${storeState.official_tourism_url}`);
    assert(Boolean(storeState.capital), `State '${stateId}' has capital: ${storeState.capital}`);
    assert(Boolean(storeState.region), `State '${stateId}' has region: ${storeState.region}`);
  }

  const hierarchyState = indiaTourismData.states.find(s => s.id === stateId);
  assert(Boolean(hierarchyState), `Pilot state '${stateId}' present in hierarchy database`);
  if (hierarchyState) {
    assert(hierarchyState.cities && hierarchyState.cities.length > 0, `State '${stateId}' contains destinations (${hierarchyState.cities?.length || 0})`);
  }
}

console.log('\n--- TEST SUITE 2: PILOT DESTINATIONS & ENTITY TYPE SANITY ---');
const pilotDestinations = Object.values(dbStore.cities).filter(c => pilotStateIds.includes(c.state_id));
assert(pilotDestinations.length >= 10, `Found ${pilotDestinations.length} destinations in pilot states (expected >= 10)`);

// Check Spiti Valley and Ziro Valley entity_type
const spiti = Object.values(dbStore.cities).find(c => c.name.toLowerCase().includes('spiti') || c.slug === 'spiti-valley');
assert(Boolean(spiti && spiti.entity_type === 'valley'), `Spiti Valley has correct entity_type: 'valley' (actual: ${spiti?.entity_type})`);

const ziro = Object.values(dbStore.cities).find(c => c.name.toLowerCase().includes('ziro') || c.slug === 'ziro-valley');
assert(Boolean(ziro && ziro.entity_type === 'valley'), `Ziro Valley has correct entity_type: 'valley' (actual: ${ziro?.entity_type})`);

// Duplicate city name check inside same state
console.log('\n--- TEST SUITE 3: PREVENT DUPLICATE DESTINATIONS IN SAME STATE ---');
const stateCityMap = new Map();
let duplicateCityFound = false;

for (const city of Object.values(dbStore.cities)) {
  const key = `${city.state_id}:::${city.name.trim().toLowerCase()}`;
  if (stateCityMap.has(key)) {
    console.error(`Duplicate city detected: ${city.name} in state ${city.state_id}`);
    duplicateCityFound = true;
  }
  stateCityMap.set(key, city.id);
}
assert(!duplicateCityFound, 'Zero duplicate city names inside the same state in database store');

// Duplicate place name check inside same city
console.log('\n--- TEST SUITE 4: PREVENT DUPLICATE PLACES IN SAME CITY ---');
const cityPlaceMap = new Map();
let duplicatePlaceFound = false;

for (const place of Object.values(dbStore.places)) {
  const key = `${place.city_id}:::${place.name.trim().toLowerCase()}`;
  if (cityPlaceMap.has(key)) {
    console.error(`Duplicate place detected: ${place.name} in city ${place.city_id}`);
    duplicatePlaceFound = true;
  }
  cityPlaceMap.set(key, place.id);
}
assert(!duplicatePlaceFound, 'Zero duplicate places inside the same city in database store');

console.log('\n--- TEST SUITE 5: SOURCE-BACKED VERIFICATION POLICY AUDIT ---');
const pilotPlaces = Object.values(dbStore.places).filter(p => {
  const city = dbStore.cities[p.city_id];
  return city && pilotStateIds.includes(city.state_id);
});

assert(pilotPlaces.length >= 25, `Pilot states contain ${pilotPlaces.length} places (expected >= 25)`);

let unverifiedPilotPlaces = 0;
let missingSourcesPilotPlaces = 0;
let dummyTextFound = 0;
let invalidCoordsFound = 0;

let verifiedPilotPlaces = 0;
let invalidTierVerifiedPlaces = 0;
let genericHomepageVerifiedPlaces = 0;

for (const p of pilotPlaces) {
  if (p.verification_status === 'verified') {
    verifiedPilotPlaces++;
    if (p.source_quality !== 'place_specific' && p.source_quality !== 'official_site') {
      invalidTierVerifiedPlaces++;
    }
  }

  if (p.source_quality === 'generic_homepage' && p.verification_status === 'verified') {
    genericHomepageVerifiedPlaces++;
  }

  // Must have at least 1 valid HTTP source
  const hasValidSource = p.sources && p.sources.length > 0 && p.sources.some(s => s.source_url && s.source_url.startsWith('http'));
  if (!hasValidSource) {
    missingSourcesPilotPlaces++;
  }

  // Check coordinates (India bounds: Lat 6.0-38.5, Lng 68.0-98.5)
  const lat = p.latitude;
  const lng = p.longitude;
  if (typeof lat !== 'number' || typeof lng !== 'number' || lat < 6.0 || lat > 38.5 || lng < 68.0 || lng > 98.5) {
    invalidCoordsFound++;
  }

  // Check dummy text
  const textToCheck = `${p.name} ${p.short_description || ''} ${p.detailed_description || ''}`.toLowerCase();
  if (
    textToCheck.includes('lorem ipsum') ||
    textToCheck.includes('dummy') ||
    textToCheck.includes('fake') ||
    textToCheck.includes('tbd')
  ) {
    dummyTextFound++;
  }
}

assert(verifiedPilotPlaces >= 25, `Verified pilot places count is ${verifiedPilotPlaces} (expected >= 25)`);
assert(invalidTierVerifiedPlaces === 0, '100% of verified pilot places are Tier 1 (place_specific) or Tier 2 (official_site)', `${invalidTierVerifiedPlaces} invalid tier verified places`);
assert(genericHomepageVerifiedPlaces === 0, 'Zero generic homepage (Tier 3) places are marked verified (must be needs_review)', `${genericHomepageVerifiedPlaces} generic homepage places verified`);
assert(missingSourcesPilotPlaces === 0, '100% of pilot places have official source URLs attached', `${missingSourcesPilotPlaces} missing sources`);
assert(invalidCoordsFound === 0, '100% of pilot places have valid geographic coordinates within India bounds', `${invalidCoordsFound} invalid coords`);
assert(dummyTextFound === 0, 'Zero dummy text ("Lorem ipsum", fake/dummy) in pilot places', `${dummyTextFound} dummy text records`);

console.log('\n--- TEST SUITE 6: TAXONOMY (11 TOPICS) GROUNDING ---');
const ALLOWED_TOPICS = new Set([
  'Wildlife',
  'Heritage',
  'Spiritual',
  'Adventure',
  'Gastronomy',
  'Weddings',
  'Wellness',
  'Arts',
  'Rural',
  'Nature',
  'Recreation',
]);

let invalidTopics = 0;
for (const p of pilotPlaces) {
  if (p.topic && !ALLOWED_TOPICS.has(p.topic)) {
    invalidTopics++;
  }
  if (p.category_links && p.category_links.length > 0) {
    for (const link of p.category_links) {
      if (!ALLOWED_TOPICS.has(link.topic)) {
        invalidTopics++;
      }
    }
  }
}
assert(invalidTopics === 0, 'All pilot place topics map to 11 Virasat canonical topics');

console.log('\n=====================================================');
console.log(`AUDIT SUMMARY: ${passedChecks}/${totalChecks} PASSED (${failedChecks} failed)`);
if (failedChecks > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL DATA QUALITY & PROVENANCE POLICIES ARE FULLY VERIFIED!\n');
}
