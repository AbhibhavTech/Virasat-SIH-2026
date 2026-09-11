import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');

console.log('=== Step 1: Verify Static JSON Datasets ===');

// 1. Check raw telangana.json
const rawJsonPath = path.join(dataDir, 'telangana.json');
if (!fs.existsSync(rawJsonPath)) {
  throw new Error('data/telangana.json is missing!');
}
const rawData = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));
console.log(`✓ data/telangana.json exists: ${rawData.total_places} places across ${rawData.total_cities} cities.`);

if (rawData.places.length !== 15) {
  throw new Error(`Expected 15 places in raw data, got ${rawData.places.length}`);
}

// 2. Check data/telangana/places.json
const telanganaPlacesPath = path.join(dataDir, 'telangana', 'places.json');
if (!fs.existsSync(telanganaPlacesPath)) {
  throw new Error('data/telangana/places.json is missing!');
}
const telanganaPlaces = JSON.parse(fs.readFileSync(telanganaPlacesPath, 'utf-8'));
console.log(`✓ data/telangana/places.json exists: ${telanganaPlaces.length} places.`);

if (telanganaPlaces.length !== 15) {
  throw new Error(`Expected 15 places in telangana/places.json, got ${telanganaPlaces.length}`);
}

// Check each place preserves all raw fields exactly
for (const rawPlace of rawData.places) {
  const place = telanganaPlaces.find(p => p.id === rawPlace.id);
  if (!place) {
    throw new Error(`Place ${rawPlace.id} missing from telangana/places.json`);
  }
  if (place.name !== rawPlace.name) throw new Error(`Name mismatch for ${rawPlace.id}`);
  if (place.category !== rawPlace.category) throw new Error(`Category mismatch for ${rawPlace.id}`);
  if (place.area !== rawPlace.area) throw new Error(`Area mismatch for ${rawPlace.id}`);
  if (place.description !== rawPlace.description) throw new Error(`Description mismatch for ${rawPlace.id}`);
  if (place.suggested_duration !== rawPlace.suggested_duration) throw new Error(`suggested_duration mismatch for ${rawPlace.id}`);
  if (place.best_time_to_visit !== rawPlace.best_time_to_visit) throw new Error(`best_time_to_visit mismatch for ${rawPlace.id}`);
  if (place.entry_fee !== rawPlace.entry_fee) throw new Error(`entry_fee mismatch for ${rawPlace.id}`);
  if (place.opening_hours !== rawPlace.opening_hours) throw new Error(`opening_hours mismatch for ${rawPlace.id}`);
  if (place.map_search !== rawPlace.map_search) throw new Error(`map_search mismatch for ${rawPlace.id}`);
  if (place.city !== rawPlace.city) throw new Error(`city mismatch for ${rawPlace.id}`);
  if (JSON.stringify(place.best_for) !== JSON.stringify(rawPlace.best_for)) throw new Error(`best_for mismatch for ${rawPlace.id}`);
  if (JSON.stringify(place.visitor_notes) !== JSON.stringify(rawPlace.visitor_notes)) throw new Error(`visitor_notes mismatch for ${rawPlace.id}`);
  if (JSON.stringify(place.tags) !== JSON.stringify(rawPlace.tags)) throw new Error(`tags mismatch for ${rawPlace.id}`);
}
console.log('✓ All 15 Telangana place records preserve all original fields exactly.');

// 3. Check data/states.json
const states = JSON.parse(fs.readFileSync(path.join(dataDir, 'states.json'), 'utf-8'));
const telanganaState = states.find(s => s.id === 'telangana');
if (!telanganaState) throw new Error('Telangana state missing from states.json');
console.log(`✓ states.json: Telangana state found, total_cities=${telanganaState.total_cities}, total_attractions=${telanganaState.total_attractions}`);

// 4. Check data/cities.json
const cities = JSON.parse(fs.readFileSync(path.join(dataDir, 'cities.json'), 'utf-8'));
const expectedCities = ['hyderabad', 'hanamkonda', 'warangal', 'yadadri-bhuvanagiri', 'yadadri', 'nirmal', 'bhadradri-kothagudem', 'nalgonda'];
for (const cid of expectedCities) {
  const found = cities.find(c => c.id === cid && (c.state_id === 'telangana' || c.state === 'Telangana'));
  if (!found) throw new Error(`City ${cid} missing from cities.json for Telangana`);
}
console.log(`✓ cities.json: All 8 Telangana cities present and mapped to Telangana.`);

// 5. Check data/india_tourism_database.json
const tourismDb = JSON.parse(fs.readFileSync(path.join(dataDir, 'india_tourism_database.json'), 'utf-8'));
const tgHierarchy = tourismDb.states.find(s => s.id === 'telangana');
if (!tgHierarchy) throw new Error('Telangana missing from india_tourism_database.json');
console.log(`✓ india_tourism_database.json: Telangana found with ${tgHierarchy.cities.length} cities and ${tgHierarchy.total_attractions} total attractions.`);

// Check existing states in india_tourism_database.json
const maharashtra = tourismDb.states.find(s => s.id === 'maharashtra');
const punjab = tourismDb.states.find(s => s.id === 'punjab');
const westBengal = tourismDb.states.find(s => s.id === 'west-bengal');
if (!maharashtra) throw new Error('Maharashtra missing from india_tourism_database.json');
if (!punjab) throw new Error('Punjab missing from india_tourism_database.json');
if (!westBengal) throw new Error('West Bengal missing from india_tourism_database.json');
console.log(`✓ Existing states intact: Maharashtra (${maharashtra.total_attractions}), Punjab (${punjab.total_attractions}), West Bengal (${westBengal.total_attractions}).`);

console.log('All static dataset checks passed successfully!');
