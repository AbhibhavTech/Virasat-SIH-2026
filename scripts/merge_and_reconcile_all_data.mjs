import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('--- Starting Comprehensive Master Tourism Data Reconciler & Merger ---');

// 1. Fetch raw JSON strings from HEAD and origin/main via git show
const headDbRaw = execSync('git show HEAD:data/india_tourism_database.json', { maxBuffer: 120 * 1024 * 1024 }).toString();
const remoteDbRaw = execSync('git show origin/main:data/india_tourism_database.json', { maxBuffer: 120 * 1024 * 1024 }).toString();

const headDB = JSON.parse(headDbRaw);
const remoteDB = JSON.parse(remoteDbRaw);

const headCitiesRaw = execSync('git show HEAD:data/cities.json', { maxBuffer: 60 * 1024 * 1024 }).toString();
const remoteCitiesRaw = execSync('git show origin/main:data/cities.json', { maxBuffer: 60 * 1024 * 1024 }).toString();

const headCities = JSON.parse(headCitiesRaw);
const remoteCities = JSON.parse(remoteCitiesRaw);

const cats = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];

function mergePlaces(listA = [], listB = []) {
  const map = new Map();

  // First insert listB (remote)
  for (const item of listB) {
    if (!item || !item.name) continue;
    const key = item.id || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    map.set(key, { ...item });
  }

  // Then merge listA (HEAD - which has rich master data for Mumbai, Pune, Tamil Nadu, Himachal)
  for (const item of listA) {
    if (!item || !item.name) continue;
    const key = item.id || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (map.has(key)) {
      const existing = map.get(key);
      const merged = { ...existing, ...item };

      // Ensure we keep best hero_image_url
      if (!merged.hero_image_url && (existing.hero_image_url || existing.image_url)) {
        merged.hero_image_url = existing.hero_image_url || existing.image_url;
      }
      // Ensure we keep best official_url
      if (!merged.official_url && (existing.official_url || existing.source_url)) {
        merged.official_url = existing.official_url || existing.source_url;
      }
      // Prefer longer description
      if ((existing.description?.length || 0) > (merged.description?.length || 0)) {
        merged.description = existing.description;
      }
      map.set(key, merged);
    } else {
      map.set(key, { ...item });
    }
  }

  return Array.from(map.values());
}

function mergeCities(citiesA = [], citiesB = []) {
  const cityMap = new Map();

  // Remote cities first
  for (const c of citiesB) {
    if (!c || !c.id) continue;
    cityMap.set(c.id, { ...c });
  }

  // HEAD cities next
  for (const c of citiesA) {
    if (!c || !c.id) continue;
    if (cityMap.has(c.id)) {
      const bCity = cityMap.get(c.id);
      const mergedCity = { ...bCity, ...c };

      // Merge category lists
      for (const cat of cats) {
        mergedCity[cat] = mergePlaces(c[cat] || [], bCity[cat] || []);
      }

      // Merge transport & hotels if one side has them
      if (!mergedCity.transport && bCity.transport) mergedCity.transport = bCity.transport;
      if (!mergedCity.hotels && bCity.hotels) mergedCity.hotels = bCity.hotels;
      if (!mergedCity.hero_image_url && bCity.hero_image_url) mergedCity.hero_image_url = bCity.hero_image_url;
      if (!mergedCity.official_url && bCity.official_url) mergedCity.official_url = bCity.official_url;

      cityMap.set(c.id, mergedCity);
    } else {
      cityMap.set(c.id, { ...c });
    }
  }

  return Array.from(cityMap.values());
}

// Merge States
const stateMap = new Map();
for (const s of remoteDB.states) {
  stateMap.set(s.id, { ...s });
}
for (const s of headDB.states) {
  if (stateMap.has(s.id)) {
    const rState = stateMap.get(s.id);
    const mergedState = { ...rState, ...s };
    mergedState.cities = mergeCities(s.cities || [], rState.cities || []);

    if (s.attractions || rState.attractions) {
      mergedState.attractions = mergePlaces(s.attractions || [], rState.attractions || []);
    }

    stateMap.set(s.id, mergedState);
  } else {
    stateMap.set(s.id, { ...s });
  }
}

const mergedStates = Array.from(stateMap.values());
let totalAttractions = 0;
let totalCities = 0;
const allCitiesInDb = new Map();

for (const state of mergedStates) {
  let stateAttractions = 0;
  if (Array.isArray(state.attractions)) stateAttractions += state.attractions.length;

  if (Array.isArray(state.cities)) {
    totalCities += state.cities.length;
    for (const city of state.cities) {
      let cityPlaces = 0;
      for (const cat of cats) {
        cityPlaces += city[cat]?.length || 0;
      }
      city.places_count = cityPlaces;
      stateAttractions += cityPlaces;
      allCitiesInDb.set(city.id, city);
    }
    state.total_cities = state.cities.length;
  }
  state.total_attractions = stateAttractions;
  totalAttractions += stateAttractions;
}

console.log(`Merged Database Statistics:`);
console.log(`- States: ${mergedStates.length}`);
console.log(`- Total Cities: ${totalCities}`);
console.log(`- Total Attractions: ${totalAttractions}`);

// 2. Merge cities.json
const headCityMap = new Map(headCities.map(c => [c.id, c]));
const remoteCityMap = new Map(remoteCities.map(c => [c.id, c]));
const allCityKeys = Array.from(new Set([...headCityMap.keys(), ...remoteCityMap.keys()])).sort();

const mergedCitiesList = [];
for (const cid of allCityKeys) {
  const h = headCityMap.get(cid);
  const r = remoteCityMap.get(cid);
  let merged;
  if (h && !r) {
    merged = { ...h };
  } else if (!h && r) {
    merged = { ...r };
  } else {
    // Both exist - take best fields
    const primary = (h.places_count || 0) >= (r.places_count || 0) ? h : r;
    const secondary = primary === h ? r : h;
    merged = { ...secondary, ...primary };
  }

  // If this city exists in the merged tourism database, sync its accurate count
  const dbCity = allCitiesInDb.get(cid);
  if (dbCity) {
    merged.places_count = dbCity.places_count;
    if (dbCity.places_count > 0) merged.status = 'active';
    if (dbCity.official_url && !merged.official_url) merged.official_url = dbCity.official_url;
    if (dbCity.hero_image_url && !merged.hero_image_url) merged.hero_image_url = dbCity.hero_image_url;
  }

  mergedCitiesList.push(merged);
}

console.log(`- Synchronized Cities List Count: ${mergedCitiesList.length}`);

// 3. Update states.json
let statesList = [];
try {
  statesList = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
  for (const s of statesList) {
    const dbState = stateMap.get(s.id) || stateMap.get(s.slug);
    if (dbState) {
      s.total_cities = dbState.total_cities;
      s.total_attractions = dbState.total_attractions;
      s.status = 'active';
    }
  }
  fs.writeFileSync('data/states.json', JSON.stringify(statesList, null, 2) + '\n', 'utf8');
  console.log(`- Successfully updated data/states.json`);
} catch (e) {
  console.warn('Note on states.json:', e.message);
}

// 4. Construct Final Database Object
const finalDb = {
  title: "VIRASAT — COMPLETE INDIA TOURISM DATABASE",
  version: "3.5.0",
  states_count: mergedStates.length,
  cities_count: totalCities,
  attractions_count: totalAttractions,
  accuracy_disclaimer: "Fees, timings, hotel prices, train schedules, route durations and availability can change. UNVERIFIED means it must be checked from an official/current source before being shown to a user.",
  states: mergedStates
};

// 5. Write data/india_tourism_database.json
fs.writeFileSync('data/india_tourism_database.json', JSON.stringify(finalDb, null, 2) + '\n', 'utf8');
console.log(`- Successfully written data/india_tourism_database.json`);

// 6. Write src/data/indiaTourismDatabase.ts
const tsContent = `// Autogenerated verified database export\nexport const INDIA_TOURISM_DATABASE: any = ${JSON.stringify(finalDb, null, 2)};\n`;
fs.writeFileSync('src/data/indiaTourismDatabase.ts', tsContent, 'utf8');
console.log(`- Successfully written src/data/indiaTourismDatabase.ts`);

// 7. Write data/cities.json
fs.writeFileSync('data/cities.json', JSON.stringify(mergedCitiesList, null, 2) + '\n', 'utf8');
console.log(`- Successfully written data/cities.json`);

console.log('--- Merge & Reconcile Completed Successfully ---');
