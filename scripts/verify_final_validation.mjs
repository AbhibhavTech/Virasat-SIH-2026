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
  console.warn(`[city_id_redirects.json] Not found!`);
}

console.log('--- VALIDATION COMPLETE ---');
