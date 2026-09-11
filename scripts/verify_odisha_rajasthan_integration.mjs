import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

console.log('=== VERIFYING ODISHA & RAJASTHAN INTEGRATION ===');

const itdb = readJson(path.join(rootDir, 'data', 'india_tourism_database.json'));

// -----------------------------------------------------------------
// 1. Verify Odisha
// -----------------------------------------------------------------
const odisha = itdb.states.find((s) => s.id === 'odisha');
if (!odisha) throw new Error('Odisha not found in itdb!');
console.log(`✓ Odisha state found: ${odisha.name}`);

if (odisha.cities.length !== 10) {
  throw new Error(`Expected exactly 10 cities in Odisha, found ${odisha.cities.length}`);
}
console.log('✓ Exactly 10 cities found in Odisha.');

const expectedOdishaCityPlaces = {
  Puri: ['Jagannath Temple', 'Puri Beach', 'Raghurajpur Heritage Crafts Village'],
  Konark: ['Konark Sun Temple'],
  Chilika: ['Chilika Lake'],
  Bhubaneswar: [
    'Udayagiri and Khandagiri Caves',
    'Lingaraj Temple',
    'Dhauli Shanti Stupa',
    'Nandankanan Zoological Park',
  ],
  Cuttack: ['Barabati Fort'],
  Baripada: ['Similipal National Park'],
  Rajnagar: ['Bhitarkanika National Park'],
  Gopalpur: ['Gopalpur Beach'],
  Daringbadi: ['Daringbadi'],
  Sambalpur: ['Hirakud Dam'],
};

const allOdishaPlaces = [];
const seenOdishaIds = new Set();

for (const city of odisha.cities) {
  const catKeys = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
  const cityPlaces = [];
  for (const k of catKeys) {
    for (const p of city[k] || []) {
      if (seenOdishaIds.has(p.id)) {
        throw new Error(`Duplicate Odisha place ID found: ${p.id}`);
      }
      seenOdishaIds.add(p.id);
      allOdishaPlaces.push(p);
      cityPlaces.push(p);

      if (!p.city) throw new Error(`Place ${p.name} (${p.id}) is missing 'city' field!`);
      if (!p.area) throw new Error(`Place ${p.name} (${p.id}) is missing 'area' field!`);
      if (p.state_id !== 'odisha') throw new Error(`Place ${p.name} state_id is ${p.state_id}, expected 'odisha'`);
    }
  }

  const expectedNames = expectedOdishaCityPlaces[city.name];
  if (!expectedNames) {
    throw new Error(`Unexpected Odisha city in database: ${city.name}`);
  }
  if (cityPlaces.length !== expectedNames.length) {
    throw new Error(`City ${city.name} has ${cityPlaces.length} places, expected ${expectedNames.length}`);
  }
  for (const expName of expectedNames) {
    if (!cityPlaces.some((p) => p.name === expName)) {
      throw new Error(`City ${city.name} is missing expected place: "${expName}"`);
    }
  }
  console.log(`✓ Odisha ${city.name}: ${cityPlaces.length} places verified (${cityPlaces.map((p) => p.name).join(', ')})`);
}

if (allOdishaPlaces.length !== 15) {
  throw new Error(`Expected exactly 15 Odisha places, found ${allOdishaPlaces.length}`);
}
console.log('✓ Exactly 15 Odisha places verified.');

// -----------------------------------------------------------------
// 2. Verify Rajasthan
// -----------------------------------------------------------------
const rajasthan = itdb.states.find((s) => s.id === 'rajasthan');
if (!rajasthan) throw new Error('Rajasthan not found in itdb!');
console.log(`✓ Rajasthan state found: ${rajasthan.name}`);

if (rajasthan.cities.length !== 9) {
  throw new Error(`Expected exactly 9 cities in Rajasthan, found ${rajasthan.cities.length}`);
}
console.log('✓ Exactly 9 cities found in Rajasthan.');

const expectedRajasthanCityPlaces = {
  Jaipur: ['Jaipur', 'Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar'],
  Jaisalmer: ['Jaisalmer Fort', 'Sam Sand Dunes'],
  Jodhpur: ['Mehrangarh Fort', 'Jaswant Thada', 'Umaid Bhawan Palace'],
  Udaipur: ['Lake Pichola', 'City Palace Udaipur', 'Sajjangarh Monsoon Palace'],
  'Sawai Madhopur': ['Ranthambore National Park'],
  Chittorgarh: ['Chittorgarh Fort'],
  Pushkar: ['Pushkar Lake', 'Brahma Temple'],
  'Mount Abu': ['Dilwara Temples', 'Mount Abu'],
  Bikaner: ['Bikaner Junagarh Fort'],
};

const allRajasthanPlaces = [];
const seenRajasthanIds = new Set();

for (const city of rajasthan.cities) {
  const catKeys = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
  const cityPlaces = [];
  for (const k of catKeys) {
    for (const p of city[k] || []) {
      if (seenRajasthanIds.has(p.id)) {
        throw new Error(`Duplicate Rajasthan place ID found: ${p.id}`);
      }
      seenRajasthanIds.add(p.id);
      allRajasthanPlaces.push(p);
      cityPlaces.push(p);

      if (!p.city) throw new Error(`Place ${p.name} (${p.id}) is missing 'city' field!`);
      if (!p.area) throw new Error(`Place ${p.name} (${p.id}) is missing 'area' field!`);
      if (p.state_id !== 'rajasthan') throw new Error(`Place ${p.name} state_id is ${p.state_id}, expected 'rajasthan'`);
    }
  }

  const expectedNames = expectedRajasthanCityPlaces[city.name];
  if (!expectedNames) {
    throw new Error(`Unexpected Rajasthan city in database: ${city.name}`);
  }
  if (cityPlaces.length !== expectedNames.length) {
    throw new Error(`City ${city.name} has ${cityPlaces.length} places, expected ${expectedNames.length}`);
  }
  for (const expName of expectedNames) {
    if (!cityPlaces.some((p) => p.name === expName)) {
      throw new Error(`City ${city.name} is missing expected place: "${expName}"`);
    }
  }
  console.log(`✓ Rajasthan ${city.name}: ${cityPlaces.length} places verified (${cityPlaces.map((p) => p.name).join(', ')})`);
}

if (allRajasthanPlaces.length !== 20) {
  throw new Error(`Expected exactly 20 Rajasthan places, found ${allRajasthanPlaces.length}`);
}
console.log('✓ Exactly 20 Rajasthan places verified.');

// -----------------------------------------------------------------
// 3. Verify Database Integrity & Other States
// -----------------------------------------------------------------
if (itdb.states.length !== 36) {
  throw new Error(`Expected 36 total states, found ${itdb.states.length}`);
}
console.log('✓ Total states in database: 36 (all states and UTs preserved intact).');

// Verify Jharkhand is still 20 places
const jharkhand = itdb.states.find((s) => s.id === 'jharkhand');
let jkCount = 0;
for (const c of jharkhand.cities) {
  for (const k of ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo']) {
    jkCount += (c[k] || []).length;
  }
}
if (jkCount !== 20) throw new Error(`Jharkhand place count corrupted: ${jkCount}`);
console.log('✓ Jharkhand: 20 places across 9 cities intact.');

// Verify Punjab is still 20 places
const punjab = itdb.states.find((s) => s.id === 'punjab');
let pbCount = 0;
for (const c of punjab.cities) {
  for (const k of ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo', 'places']) {
    pbCount += (c[k] || []).length;
  }
}
// Note: Punjab has places array
const pbPlacesActual = punjab.cities.reduce((sum, c) => sum + (c.places?.length || 0), 0);
if (pbPlacesActual !== 20) throw new Error(`Punjab places corrupted: ${pbPlacesActual}`);
console.log('✓ Punjab: 20 places intact.');

// -----------------------------------------------------------------
// 4. Verify data/cities.json
// -----------------------------------------------------------------
const citiesList = readJson(path.join(rootDir, 'data', 'cities.json'));
const odishaCitiesInJson = citiesList.filter((c) => c.state_id === 'odisha');
if (odishaCitiesInJson.length !== 10) {
  throw new Error(`data/cities.json has ${odishaCitiesInJson.length} Odisha cities, expected 10`);
}
console.log('✓ data/cities.json contains all 10 Odisha cities.');

const rajasthanCitiesInJson = citiesList.filter((c) => c.state_id === 'rajasthan');
if (rajasthanCitiesInJson.length !== 9) {
  throw new Error(`data/cities.json has ${rajasthanCitiesInJson.length} Rajasthan cities, expected 9`);
}
console.log('✓ data/cities.json contains all 9 Rajasthan cities.');

// -----------------------------------------------------------------
// 5. Verify data/states.json
// -----------------------------------------------------------------
const statesList = readJson(path.join(rootDir, 'data', 'states.json'));
const odishaState = statesList.find((s) => s.id === 'odisha');
if (odishaState.total_cities !== 10 || odishaState.total_attractions !== 15) {
  throw new Error(`data/states.json Odisha totals wrong: ${JSON.stringify(odishaState)}`);
}
console.log('✓ data/states.json correctly lists Odisha total_cities: 10, total_attractions: 15.');

const rajasthanState = statesList.find((s) => s.id === 'rajasthan');
if (rajasthanState.total_cities !== 9 || rajasthanState.total_attractions !== 20) {
  throw new Error(`data/states.json Rajasthan totals wrong: ${JSON.stringify(rajasthanState)}`);
}
console.log('✓ data/states.json correctly lists Rajasthan total_cities: 9, total_attractions: 20.');

console.log('=== ALL VERIFICATIONS PASSED WITH 100% SUCCESS ===');
