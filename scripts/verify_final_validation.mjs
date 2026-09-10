import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

console.log('--- RUNNING COMPREHENSIVE VALIDATION ---');

// 1. Check data/cities.json
const citiesPath = path.join(process.cwd(), 'data', 'cities.json');
const citiesRaw = fs.readFileSync(citiesPath, 'utf-8');
const cities = JSON.parse(citiesRaw);

console.log(`[cities.json] Total cities: ${cities.length}`);

// 2. Check data/india_tourism_database.json
const dbPath = path.join(process.cwd(), 'data', 'india_tourism_database.json');
const dbRaw = fs.readFileSync(dbPath, 'utf-8');
const db = JSON.parse(dbRaw);

const gzipped = zlib.gzipSync(Buffer.from(dbRaw));
console.log(`[india_tourism_database.json] Raw size: ${(dbRaw.length / 1024).toFixed(1)} KB, Gzipped size: ${(gzipped.length / 1024).toFixed(1)} KB`);

console.log(`[india_tourism_database.json] states_count: ${db.states_count}, cities_count: ${db.cities_count}, attractions_count: ${db.attractions_count}`);

const canonicalUts = new Set([
  'andaman-and-nicobar-islands',
  'chandigarh',
  'dadra-and-nagar-haveli-and-daman-and-diu',
  'delhi',
  'jammu-and-kashmir',
  'ladakh',
  'lakshadweep',
  'puducherry',
]);

const states = db.states.filter(s => s.region_type === 'state' || (!s.region_type && !canonicalUts.has(s.id)));
const uts = db.states.filter(s => s.region_type === 'union_territory' || canonicalUts.has(s.id));
console.log(`[Entities] States: ${states.length}, UTs: ${uts.length}, Total Entities: ${db.states.length}`);

let totalCitiesInDb = 0;
let totalAttractions = 0;
let jaipurPlaces = 0;
let agraPlaces = 0;
const allCityIds = new Set();
let anandpurSahib = null;
let ziroValleyExists = false;
let mangaloreExists = false;
let mangaluruExists = false;

for (const state of db.states) {
  for (const city of state.cities || []) {
    totalCitiesInDb++;
    allCityIds.add(city.id);
    if (city.id === 'anandpur-sahib') anandpurSahib = city;
    if (city.id === 'ziro-valley') ziroValleyExists = true;
    if (city.id === 'mangalore') mangaloreExists = true;
    if (city.id === 'mangaluru') mangaluruExists = true;

    const places = [
      ...(city.heritage || []),
      ...(city.monuments || []),
      ...(city.museums || []),
      ...(city.tourist_places || []),
      ...(city.religious_cultural || []),
      ...(city.nature_parks_zoo || []),
    ];
    totalAttractions += places.length;

    if (city.id === 'jaipur') jaipurPlaces = places.length;
    if (city.id === 'agra') agraPlaces = places.length;

    // Check bounds
    const lat = city.coordinates?.lat;
    const lng = city.coordinates?.lng;
    if (typeof lat !== 'number' || typeof lng !== 'number' || lat < 6 || lat > 38 || lng < 68 || lng > 98) {
      console.warn(`WARNING: City ${city.id} coordinates out of bounds: lat=${lat}, lng=${lng}`);
    }
  }
}

console.log(`[Hierarchy] Total cities embedded: ${totalCitiesInDb}`);
console.log(`[Hierarchy] Total attractions embedded: ${totalAttractions}`);
console.log(`[Hierarchy] Jaipur places: ${jaipurPlaces}`);
console.log(`[Hierarchy] Agra places: ${agraPlaces}`);
console.log(`[Alias Checks]`);
console.log(` - ziro-valley in DB: ${ziroValleyExists} (Should be false)`);
console.log(` - mangalore in DB: ${mangaloreExists} (Should be false)`);
console.log(` - mangaluru in DB: ${mangaluruExists} (Should be true)`);
console.log(` - anandpur-sahib: status=${anandpurSahib?.administrative_status}, review_flag=${anandpurSahib?.review_flag}`);

// 3. Check city_id_redirects.json
const redirectsPath = path.join(process.cwd(), 'data', 'city_id_redirects.json');
if (fs.existsSync(redirectsPath)) {
  const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf-8'));
  console.log(`[city_id_redirects.json] Mappings:`, redirects);
} else {
  console.error(`[city_id_redirects.json] Not found!`);
  process.exit(1);
}

// 4. Detailed Focused Audit on Shell Cities & Anandpur Sahib
console.log('\n--- FOCUSED INTEGRITY AUDIT ---');
const shell49List = [
  'bomdila', 'changlang', 'dirang', 'itanagar', 'mechuka', 'namsai', 'pakke-kesang-hill-station',
  'pasighat', 'roing', 'yingkiong', 'ziro', 'bilaspur-hp', 'chamba', 'dalhousie', 'kasauli',
  'keylong', 'paonta-sahib', 'reckong-peo', 'fatehgarh-sahib', 'fazilka', 'firozepur', 'gurdaspur',
  'jalandhar', 'kapurthala', 'ludhiana', 'pathankot', 'rupnagar', 'sas-nagar', 'ajmer', 'alwar',
  'banswara', 'bharatpur', 'bikaner', 'bundi', 'chittorgarh', 'dausa', 'dholpur', 'jaisalmer',
  'jodhpur', 'kota', 'mount-abu', 'ayodhya', 'bareilly', 'chitrakoot-up', 'jhansi', 'kanpur',
  'lucknow', 'mathura', 'prayagraj'
];

let shellTransitCount = 0;
let shellBudgetCount = 0;
let shellSeasonCount = 0;
let shellWeatherCount = 0;

for (const state of db.states) {
  for (const city of state.cities || []) {
    if (shell49List.includes(city.id) || city.verification_status === 'VERIFICATION_REQUIRED') {
      if (city.transport?.local_transit !== null && city.transport?.local_transit !== undefined) {
        shellTransitCount++;
      }
      if (city.fees_overview?.typical_budget_per_day !== null && city.fees_overview?.typical_budget_per_day !== undefined) {
        shellBudgetCount++;
      }
      if (city.live_travel_info?.best_season !== null && city.live_travel_info?.best_season !== undefined) {
        shellSeasonCount++;
      }
      if (city.live_travel_info?.weather_summary !== null && city.live_travel_info?.weather_summary !== undefined) {
        shellWeatherCount++;
      }
    }
  }
}

console.log(`[Audit] Shell cities with non-null generic transport: ${shellTransitCount} (Must be 0)`);
console.log(`[Audit] Shell cities with non-null generic budget: ${shellBudgetCount} (Must be 0)`);
console.log(`[Audit] Shell cities with non-null generic best_season: ${shellSeasonCount} (Must be 0)`);
console.log(`[Audit] Shell cities with non-null generic weather_summary: ${shellWeatherCount} (Must be 0)`);

const apLatOk = anandpurSahib?.coordinates?.lat === 31.2366 && anandpurSahib?.lat === 31.2366;
const apLngOk = anandpurSahib?.coordinates?.lng === 76.4984 && anandpurSahib?.lng === 76.4984;
console.log(`[Audit] anandpur-sahib coordinates restored: ${apLatOk && apLngOk} (lat=${anandpurSahib?.lat}, lng=${anandpurSahib?.lng})`);

const citiesJsonAP = cities.find(c => c.id === 'anandpur-sahib');
const citiesJsonApOk = citiesJsonAP?.lat === 31.2366 && citiesJsonAP?.lng === 76.4984;
console.log(`[Audit] cities.json anandpur-sahib coordinates: ${citiesJsonApOk} (lat=${citiesJsonAP?.lat}, lng=${citiesJsonAP?.lng})`);

let hasError = false;
if (totalAttractions !== 388) {
  console.error(`ERROR: Expected 388 attractions, found ${totalAttractions}`);
  hasError = true;
}
if (totalCitiesInDb !== 258) {
  console.error(`ERROR: Expected 258 total embedded cities (257 canonical + 1 extra), found ${totalCitiesInDb}`);
  hasError = true;
}
if (shellTransitCount > 0 || shellBudgetCount > 0 || shellSeasonCount > 0 || shellWeatherCount > 0) {
  console.error(`ERROR: Generic fallback values remain on shell cities!`);
  hasError = true;
}
if (!apLatOk || !apLngOk || !citiesJsonApOk) {
  console.error(`ERROR: anandpur-sahib coordinates incorrect!`);
  hasError = true;
}

if (hasError) {
  console.error('--- AUDIT FAILED ---');
  process.exit(1);
} else {
  console.log('--- ALL VALIDATION & INTEGRITY CHECKS PASSED ---');
}
