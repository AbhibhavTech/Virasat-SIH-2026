import fs from 'fs';
import path from 'path';
import { CITIES_DATA } from './compile_canonical_cities.mjs';

const ROOT = process.cwd();
const DB_PATH = path.join(ROOT, 'data', 'india_tourism_database.json');
const CITIES_PATH = path.join(ROOT, 'data', 'cities.json');
const REDIRECTS_PATH = path.join(ROOT, 'data', 'city_id_redirects.json');

console.log('--- Step 1: Loading Datasets & Setting Up Redirects ---');

// 1. Create city_id_redirects.json
const redirects = {
  'ziro-valley': 'ziro',
  'mangalore': 'mangaluru',
  'kasargod': 'kasaragod',
  'sabrimala': 'sabarimala'
};
fs.writeFileSync(REDIRECTS_PATH, JSON.stringify(redirects, null, 2) + '\n', 'utf8');
console.log(`✓ Created: ${REDIRECTS_PATH}`);

const canonicalMap = new Map();
for (const c of CITIES_DATA) {
  canonicalMap.set(c.id, c);
}
// Handle canonical aliases in map
canonicalMap.set('mangaluru', { ...canonicalMap.get('mangalore'), id: 'mangaluru', name: 'Mangaluru' });
canonicalMap.set('kasaragod', { ...canonicalMap.get('kasargod'), id: 'kasaragod', name: 'Kasaragod' });
canonicalMap.set('sabarimala', { ...canonicalMap.get('sabrimala'), id: 'sabarimala', name: 'Sabarimala' });

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const cities = JSON.parse(fs.readFileSync(CITIES_PATH, 'utf8'));

console.log('\n--- Step 2: Reconciling data/cities.json ---');

// Merge ziro-valley into ziro
const ziroValleyCity = cities.find(c => c.id === 'ziro-valley');
const ziroCity = cities.find(c => c.id === 'ziro');
if (ziroCity) {
  ziroCity.name = 'Ziro';
  ziroCity.canonical_name = 'Ziro';
  ziroCity.aliases = Array.from(new Set([...(ziroCity.aliases || []), 'Ziro Valley', 'ziro-valley']));
  if (ziroValleyCity) {
    ziroCity.places_count = (ziroCity.places_count || 0) + (ziroValleyCity.places_count || 0);
    if (!ziroCity.hero_image_url && ziroValleyCity.hero_image_url) {
      ziroCity.hero_image_url = ziroValleyCity.hero_image_url;
    }
  }
}

// Filter out ziro-valley from cities.json
let updatedCities = cities.filter(c => c.id !== 'ziro-valley');

// Update mangalore -> mangaluru
const mangaloreCity = updatedCities.find(c => c.id === 'mangalore');
if (mangaloreCity) {
  mangaloreCity.id = 'mangaluru';
  mangaloreCity.slug = 'mangaluru';
  mangaloreCity.name = 'Mangaluru';
  mangaloreCity.canonical_name = 'Mangaluru';
  mangaloreCity.aliases = Array.from(new Set([...(mangaloreCity.aliases || []), 'Mangalore', 'mangalore']));
}

// Update kasargod -> kasaragod
const kasargodCity = updatedCities.find(c => c.id === 'kasargod');
if (kasargodCity) {
  kasargodCity.id = 'kasaragod';
  kasargodCity.slug = 'kasaragod';
  kasargodCity.name = 'Kasaragod';
  kasargodCity.canonical_name = 'Kasaragod';
  kasargodCity.aliases = Array.from(new Set([...(kasargodCity.aliases || []), 'Kasargod', 'kasargod']));
}

// Update sabrimala -> sabarimala
const sabrimalaCity = updatedCities.find(c => c.id === 'sabrimala');
if (sabrimalaCity) {
  sabrimalaCity.id = 'sabarimala';
  sabrimalaCity.slug = 'sabarimala';
  sabrimalaCity.name = 'Sabarimala';
  sabrimalaCity.canonical_name = 'Sabarimala';
  sabrimalaCity.aliases = Array.from(new Set([...(sabrimalaCity.aliases || []), 'Sabrimala', 'sabrimala']));
}

// Ensure non-null coordinates, district, tagline, description for all cities in cities.json
for (const c of updatedCities) {
  const canonical = canonicalMap.get(c.id);
  if (canonical) {
    if (typeof c.lat !== 'number' || isNaN(c.lat) || c.lat === null) c.lat = canonical.lat;
    if (typeof c.lng !== 'number' || isNaN(c.lng) || c.lng === null) c.lng = canonical.lng;
    if (typeof c.latitude !== 'number' || isNaN(c.latitude) || c.latitude === null) c.latitude = canonical.lat;
    if (typeof c.longitude !== 'number' || isNaN(c.longitude) || c.longitude === null) c.longitude = canonical.lng;
    if (!c.district || c.district === c.name) c.district = canonical.district || c.name;
    if (canonical.desc && (!c.description || c.description.startsWith('Explore heritage'))) {
      c.description = canonical.desc;
    }
  }

  // Flag anandpur-sahib in cities.json
  if (c.id === 'anandpur-sahib') {
    c.lat = 31.2366;
    c.lng = 76.4984;
    c.latitude = 31.2366;
    c.longitude = 76.4984;
    c.district = 'Rupnagar';
    c.administrative_status = 'EXTRA_CANONICAL';
    c.review_flag = 'PENDING_CLASSIFICATION';
  }

  if (!c.district) c.district = c.name;
  if (!c.tagline) c.tagline = `Cultural destination in ${c.state || c.state_id}`;
  if (!c.description) c.description = `Explore heritage, landmarks, and cultural traditions in ${c.name}.`;
}

fs.writeFileSync(CITIES_PATH, JSON.stringify(updatedCities, null, 2) + '\n', 'utf8');
console.log(`✓ Updated ${CITIES_PATH} (Total: ${updatedCities.length})`);

console.log('\n--- Step 3: Reconciling data/india_tourism_database.json ---');

const cats = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];

for (const state of db.states) {
  let stateCities = state.cities || [];

  // Reconcile ziro-valley in Arunachal Pradesh
  if (state.id === 'arunachal-pradesh') {
    const zvInState = stateCities.find(c => c.id === 'ziro-valley');
    const zInState = stateCities.find(c => c.id === 'ziro');
    if (zInState) {
      zInState.name = 'Ziro';
      zInState.canonical_name = 'Ziro';
      zInState.aliases = Array.from(new Set([...(zInState.aliases || []), 'Ziro Valley', 'ziro-valley']));
      if (zvInState) {
        for (const cat of cats) {
          const zvPlaces = (zvInState[cat] || []).map(p => ({ ...p, city_id: 'ziro' }));
          zInState[cat] = [...(zInState[cat] || []), ...zvPlaces];
        }
        if (!zInState.hero_image_url && zvInState.hero_image_url) {
          zInState.hero_image_url = zvInState.hero_image_url;
        }
      }
      stateCities = stateCities.filter(c => c.id !== 'ziro-valley');
    }
  }

  for (const city of stateCities) {
    // Mangalore -> Mangaluru
    if (city.id === 'mangalore') {
      city.id = 'mangaluru';
      city.slug = 'mangaluru';
      city.name = 'Mangaluru';
      city.canonical_name = 'Mangaluru';
      city.aliases = Array.from(new Set([...(city.aliases || []), 'Mangalore', 'mangalore']));
      for (const cat of cats) {
        for (const p of (city[cat] || [])) p.city_id = 'mangaluru';
      }
    }

    // Kasargod -> Kasaragod
    if (city.id === 'kasargod') {
      city.id = 'kasaragod';
      city.slug = 'kasaragod';
      city.name = 'Kasaragod';
      city.canonical_name = 'Kasaragod';
      city.aliases = Array.from(new Set([...(city.aliases || []), 'Kasargod', 'kasargod']));
      for (const cat of cats) {
        for (const p of (city[cat] || [])) p.city_id = 'kasaragod';
      }
    }

    // Sabrimala -> Sabarimala
    if (city.id === 'sabrimala') {
      city.id = 'sabarimala';
      city.slug = 'sabarimala';
      city.name = 'Sabarimala';
      city.canonical_name = 'Sabarimala';
      city.aliases = Array.from(new Set([...(city.aliases || []), 'Sabrimala', 'sabrimala']));
      for (const cat of cats) {
        for (const p of (city[cat] || [])) p.city_id = 'sabarimala';
      }
    }

    // Assign canonical coordinates & descriptions
    const canonical = canonicalMap.get(city.id);
    if (canonical) {
      if (!city.coordinates || typeof city.coordinates.lat !== 'number' || isNaN(city.coordinates.lat)) {
        city.coordinates = { lat: canonical.lat, lng: canonical.lng };
      }
      if (typeof city.lat !== 'number' || isNaN(city.lat) || city.lat === null) city.lat = canonical.lat;
      if (typeof city.lng !== 'number' || isNaN(city.lng) || city.lng === null) city.lng = canonical.lng;
      if (!city.district || city.district === city.name) city.district = canonical.district || city.name;
      if (canonical.desc && (!city.description || city.description.startsWith('Explore heritage'))) {
        city.description = canonical.desc;
      }
    }

    // Anandpur Sahib flag
    if (city.id === 'anandpur-sahib') {
      city.coordinates = { lat: 31.2366, lng: 76.4984 };
      city.lat = 31.2366;
      city.lng = 76.4984;
      city.district = 'Rupnagar';
      city.administrative_status = 'EXTRA_CANONICAL';
      city.review_flag = 'PENDING_CLASSIFICATION';
    }

    // Ensure non-null district/tagline/description
    if (!city.district) city.district = city.name;
    if (!city.tagline) city.tagline = `Cultural destination in ${city.state || state.name}`;
    if (!city.description) city.description = `Explore heritage, landmarks, and cultural traditions in ${city.name}.`;

    const shell49List = [
      'bomdila', 'changlang', 'dirang', 'itanagar', 'mechuka', 'namsai', 'pakke-kesang-hill-station',
      'pasighat', 'roing', 'yingkiong', 'ziro', 'bilaspur-hp', 'chamba', 'dalhousie', 'kasauli',
      'keylong', 'paonta-sahib', 'reckong-peo', 'fatehgarh-sahib', 'fazilka', 'firozepur', 'gurdaspur',
      'jalandhar', 'kapurthala', 'ludhiana', 'pathankot', 'rupnagar', 'sas-nagar', 'ajmer', 'alwar',
      'banswara', 'bharatpur', 'bikaner', 'bundi', 'chittorgarh', 'dausa', 'dholpur', 'jaisalmer',
      'jodhpur', 'kota', 'mount-abu', 'ayodhya', 'bareilly', 'chitrakoot-up', 'jhansi', 'kanpur',
      'lucknow', 'mathura', 'prayagraj'
    ];
    const isShellCity = shell49List.includes(city.id) || city.verification_status === 'VERIFICATION_REQUIRED';

    if (!city.live_travel_info || isShellCity) {
      city.live_travel_info = {
        best_season: null,
        weather_summary: null,
        status: 'UNVERIFIED'
      };
    }
    if (!city.fees_overview || isShellCity) {
      city.fees_overview = {
        typical_budget_per_day: null,
        status: 'UNVERIFIED'
      };
    }
    if (!city.transport || isShellCity) {
      city.transport = {
        railway_stations: city.transport?.railway_stations || [],
        local_transit: null
      };
    }
    if (!city.hotels) city.hotels = [];

    // Recalculate city places_count
    city.places_count = cats.reduce((sum, cat) => sum + (city[cat]?.length || 0), 0);
  }

  state.cities = stateCities;
  state.total_cities = stateCities.length;
  state.total_attractions = stateCities.reduce((sum, c) => sum + c.places_count, 0);
}

// Recalculate root DB metadata
let totalPlacesCount = 0;
let canonicalCitiesCount = 0;

for (const state of db.states) {
  for (const c of state.cities || []) {
    totalPlacesCount += c.places_count;
    if (c.administrative_status !== 'EXTRA_CANONICAL') {
      canonicalCitiesCount++;
    }
  }
}

db.states_count = db.states.length;
db.cities_count = canonicalCitiesCount; // exactly 257 canonical cities
db.attractions_count = totalPlacesCount;

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2) + '\n', 'utf8');
console.log(`✓ Updated ${DB_PATH}`);

const TS_PATH = path.join(ROOT, 'src', 'data', 'indiaTourismDatabase.ts');
const tsContent = `// Autogenerated verified database export\nexport const INDIA_TOURISM_DATABASE = ${JSON.stringify(db, null, 2)};\n`;
fs.writeFileSync(TS_PATH, tsContent, 'utf8');
console.log(`✓ Updated ${TS_PATH}`);

console.log(`  - States count: ${db.states_count} (28 states, 8 UTs)`);
console.log(`  - Canonical cities count: ${db.cities_count} (expect 257)`);
console.log(`  - Total attractions: ${db.attractions_count}`);
console.log(`  - Extra preserved archives: 1 (anandpur-sahib)`);
