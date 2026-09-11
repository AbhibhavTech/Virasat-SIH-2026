import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=== VERIFYING JHARKHAND INTEGRATION ===');

// 1. Check data/india_tourism_database.json
const itdb = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'india_tourism_database.json'), 'utf8'));
const jharkhand = itdb.states.find(s => s.id === 'jharkhand');

if (!jharkhand) throw new Error('Jharkhand not found in itdb');
console.log(`✓ Jharkhand state found: ${jharkhand.name}`);

if (jharkhand.cities.length !== 9) {
  throw new Error(`Expected 9 cities in Jharkhand, found ${jharkhand.cities.length}`);
}
console.log(`✓ Exactly 9 cities found in Jharkhand.`);

const expectedCityPlaces = {
  Ranchi: [
    'Dassam Falls',
    'Hundru Falls',
    'Jonha Falls',
    'Jagannath Temple Ranchi',
    'Pahari Mandir',
    'Birsa Munda Tribal University and Museum Area',
    'Tribal Research Institute and Museum',
  ],
  Chaibasa: ['Hirni Falls'],
  Latehar: ['Lodh Falls', 'Betla National Park', 'Palamau Tiger Reserve'],
  Netarhat: ['Netarhat'],
  Patratu: ['Patratu Valley', 'Patratu Dam'],
  Deoghar: ['Deoghar', 'Baba Baidyanath Temple', 'Trikut Pahar'],
  Giridih: ['Parasnath Hill'],
  Dhanbad: ['Maithon Dam'],
  Dumka: ['Maluti Temples'],
};

const allJharkhandPlaces = [];
const seenIds = new Set();

for (const city of jharkhand.cities) {
  const catKeys = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
  for (const k of catKeys) {
    for (const p of (city[k] || [])) {
      if (seenIds.has(p.id)) {
        throw new Error(`Duplicate place id found: ${p.id}`);
      }
      seenIds.add(p.id);
      allJharkhandPlaces.push(p);

      if (!p.city) {
        throw new Error(`Place ${p.name} (${p.id}) is missing 'city' field!`);
      }
      if (!p.area) {
        throw new Error(`Place ${p.name} (${p.id}) is missing 'area' field!`);
      }
      if (!p.id.startsWith('jharkhand_')) {
        throw new Error(`Place id ${p.id} does not follow jharkhand_ format!`);
      }
    }
  }
}

if (allJharkhandPlaces.length !== 20) {
  throw new Error(`Expected exactly 20 Jharkhand places, found ${allJharkhandPlaces.length}`);
}
console.log(`✓ Exactly 20 Jharkhand places found with no duplicates.`);

// Verify city assignments
for (const [cityName, expectedNames] of Object.entries(expectedCityPlaces)) {
  const placesInCity = allJharkhandPlaces.filter(p => p.city === cityName);
  if (placesInCity.length !== expectedNames.length) {
    throw new Error(`City ${cityName} expected ${expectedNames.length} places, found ${placesInCity.length}`);
  }
  for (const expectedName of expectedNames) {
    const found = placesInCity.find(p => p.name.toLowerCase() === expectedName.toLowerCase());
    if (!found) {
      throw new Error(`Place ${expectedName} not found in city ${cityName}`);
    }
  }
  console.log(`✓ ${cityName}: ${placesInCity.length} places matched perfectly (${placesInCity.map(p => p.name).join(', ')}).`);
}

// Check other states are untouched
console.log(`✓ Total states in database: ${itdb.states.length}`);
const otherStates = itdb.states.filter(s => s.id !== 'jharkhand');
if (otherStates.length !== 35) {
  throw new Error(`Expected 35 other states/UTs, found ${otherStates.length}`);
}
console.log(`✓ All 35 other states and UTs are preserved intact.`);

// Check data/cities.json
const cities = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'cities.json'), 'utf8'));
const jharkhandCitiesInRegistry = cities.filter(c => c.state_id === 'jharkhand');
if (jharkhandCitiesInRegistry.length !== 9) {
  throw new Error(`Expected 9 Jharkhand cities in cities.json, found ${jharkhandCitiesInRegistry.length}`);
}
console.log(`✓ data/cities.json contains all 9 Jharkhand cities.`);

// Check data/states.json
const states = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'states.json'), 'utf8'));
const stateJh = states.find(s => s.id === 'jharkhand');
if (!stateJh || stateJh.total_cities !== 9 || stateJh.total_attractions !== 20) {
  throw new Error(`states.json mismatch: ${JSON.stringify(stateJh)}`);
}
console.log(`✓ data/states.json correctly lists total_cities: 9, total_attractions: 20.`);

console.log('=== ALL TESTS PASSED SUCCESSFULLY ===');
