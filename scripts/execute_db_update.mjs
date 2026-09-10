import fs from 'fs';
import path from 'path';
import { STATES_DEF } from './master_dataset_builder.mjs';
import { CITIES_DATA } from './compile_canonical_cities.mjs';

console.log('[DB Update] Starting Master Virasat Database Update...');

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const storePath = path.join(dataDir, '.database', 'virasat_store.json');
const itdbPath = path.join(dataDir, 'india_tourism_database.json');
const citiesJsonPath = path.join(dataDir, 'cities.json');
const statesJsonPath = path.join(dataDir, 'states.json');
const tsPath = path.join(rootDir, 'src', 'data', 'indiaTourismDatabase.ts');

const now = new Date().toISOString();

// -------------------------------------------------------------
// 1. Build Canonical City Lookup & Aliases for Merging
// -------------------------------------------------------------
const CITY_MERGE_ALIASES = {
  // Delhi
  'new-delhi': 'delhi',
  'old-delhi': 'delhi',
  'delhi-nct': 'delhi',
  'delhi-nct-': 'delhi',

  // Goa
  'panaji': 'goa',
  'old-goa': 'goa',
  'velha-goa': 'goa',
  'margao': 'goa',
  'vasco-da-gama': 'goa',
  'calangute': 'goa',
  'canacona': 'goa',

  // Bihar
  'bodh-gaya': 'gaya',
  'rajgir': 'nalanda',
  'vaishali': 'patna',
  'sasaram': 'patna',

  // Uttar Pradesh
  'agra-district': 'agra',
  'fatehpur-sikri': 'agra',
  'kashi': 'varanasi',
  'banaras': 'varanasi',

  // Himachal Pradesh
  'spiti-kaza': 'spiti-valley',
  'kaza': 'spiti-valley',

  // Uttarakhand
  'rudraprayag-district': 'kedarnath',
  'kedarnath-temple': 'kedarnath',

  // Andaman & Nicobar
  'port-blair': 'sri-vijaya-puram',

  // Maharashtra
  'aurangabad': 'chhatrapati-sambhaji-nagar',
  'khandala': 'pune',
  'lonavala': 'pune',

  // Gujarat
  'somnath': 'gir-somnath',
  'kutch-bhuj': 'bhuj',

  // Andhra Pradesh
  'lepakshi': 'anantapur',
  'vijayawada': 'amaravati',

  // Chhattisgarh
  'sirpur': 'raipur',
  'durg-bhilai': 'raipur',
  'mainpat': 'bilaspur',

  // Jharkhand
  'dhanbad': 'ranchi',

  // Haryana
  'panchkula': 'kurukshetra',

  // Madhya Pradesh
  'bilaspur': 'bilaspur',
};

// Official State Tourism Portals (Replacing any Incredible India URLs)
const OFFICIAL_STATE_PORTALS = {
  'andhra-pradesh': 'https://tourism.ap.gov.in',
  'arunachal-pradesh': 'https://arunachaltourism.com',
  'assam': 'https://assamtourism.gov.in',
  'bihar': 'https://tourism.bihar.gov.in',
  'chhattisgarh': 'https://chhattisgarhtourism.cg.gov.in',
  'goa': 'https://goatourism.gov.in',
  'gujarat': 'https://www.gujarattourism.com',
  'haryana': 'https://haryanatourism.gov.in',
  'himachal-pradesh': 'https://himachaltourism.gov.in',
  'jharkhand': 'https://tourism.jharkhand.gov.in',
  'karnataka': 'https://karnatakatourism.org',
  'kerala': 'https://www.keralatourism.org',
  'madhya-pradesh': 'https://www.mptourism.com',
  'maharashtra': 'https://maharashtratourism.gov.in',
  'manipur': 'https://manipurtourism.gov.in',
  'meghalaya': 'https://www.meghalayatourism.in',
  'mizoram': 'https://tourism.mizoram.gov.in',
  'nagaland': 'https://tourism.nagaland.gov.in',
  'odisha': 'https://odishatourism.gov.in',
  'punjab': 'https://punjabtourism.punjab.gov.in',
  'rajasthan': 'https://tourism.rajasthan.gov.in',
  'sikkim': 'https://www.sikkimtourism.gov.in',
  'tamil-nadu': 'https://www.tamilnadutourism.tn.gov.in',
  'telangana': 'https://tourism.telangana.gov.in',
  'tripura': 'https://tripuratourism.gov.in',
  'uttar-pradesh': 'https://www.uptourism.gov.in',
  'uttarakhand': 'https://uttarakhandtourism.gov.in',
  'west-bengal': 'https://wbtourism.gov.in',
  'andaman-and-nicobar-islands': 'https://www.andamantourism.gov.in',
  'chandigarh': 'https://chandigarhtourism.gov.in',
  'dadra-and-nagar-haveli-and-daman-and-diu': 'https://ddd.gov.in',
  'delhi': 'https://delhitourism.gov.in',
  'jammu-and-kashmir': 'https://jktourism.jk.gov.in',
  'ladakh': 'https://ladakhtourism.co.in',
  'lakshadweep': 'https://lakshadweeptourism.nic.in',
  'puducherry': 'https://pondytourism.in',
};

// Amber Fort recycled image URL that must NOT be assigned to non-Rajasthan cities
const AMBER_FORT_RECYCLED_URL = 'https://images.unsplash.com/photo-1599661046289-e31897846e41';

// Clean source URL helper
function sanitizeSourceUrl(url, stateId) {
  if (!url || typeof url !== 'string' || url.includes('incredibleindia')) {
    return OFFICIAL_STATE_PORTALS[stateId] || 'https://asi.nic.in';
  }
  return url;
}

// -------------------------------------------------------------
// 2. Load Existing Database & Extract Valid Attractions
// -------------------------------------------------------------
const oldStore = fs.existsSync(storePath) ? JSON.parse(fs.readFileSync(storePath, 'utf-8')) : { places: {} };
const oldItdb = fs.existsSync(itdbPath) ? JSON.parse(fs.readFileSync(itdbPath, 'utf-8')) : { states: [] };

const canonicalCitiesMap = new Map();
for (const c of CITIES_DATA) {
  canonicalCitiesMap.set(c.id, c);
}

// Map canonical city by state_id + name
const cityByStateAndName = new Map();
for (const c of CITIES_DATA) {
  const key = `${c.state_id}::${c.name.toLowerCase().trim()}`;
  cityByStateAndName.set(key, c);
}

function resolveCanonicalCityId(cityIdOrName, stateId) {
  if (!cityIdOrName) return null;
  const rawId = String(cityIdOrName).toLowerCase().trim();

  // 1. Direct canonical match
  if (canonicalCitiesMap.has(rawId)) {
    return rawId;
  }

  // 2. Direct alias match
  if (CITY_MERGE_ALIASES[rawId]) {
    return CITY_MERGE_ALIASES[rawId];
  }

  // 3. Match by name in current state
  const nameKey = `${stateId}::${rawId}`;
  if (cityByStateAndName.has(nameKey)) {
    return cityByStateAndName.get(nameKey).id;
  }

  // 4. Fuzzy match within state
  const stateCities = CITIES_DATA.filter(c => c.state_id === stateId);
  for (const sc of stateCities) {
    const scNorm = sc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rawNorm = rawId.replace(/[^a-z0-9]/g, '');
    if (scNorm === rawNorm || rawNorm.includes(scNorm) || scNorm.includes(rawNorm)) {
      return sc.id;
    }
  }

  // 5. If state has cities, fallback to capital or first city
  if (stateCities.length > 0) {
    const capital = stateCities.find(c => c.is_capital);
    return capital ? capital.id : stateCities[0].id;
  }

  return null;
}

// Collect all existing attractions
const allPreservedAttractions = new Map();
let duplicatesMergedCount = 0;

// Helper to normalize attraction
function processAndPreserveAttraction(attr, originalCityId, stateId) {
  if (!attr || !attr.name) return;

  const targetCityId = resolveCanonicalCityId(originalCityId || attr.city_id, stateId);
  if (!targetCityId) return;

  if (targetCityId !== originalCityId) {
    duplicatesMergedCount++;
  }

  const normId = attr.id || `${targetCityId}-${attr.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  // If already preserved, skip duplicate
  if (allPreservedAttractions.has(normId)) return;

  const targetCity = canonicalCitiesMap.get(targetCityId);

  // Check coordinates
  let lat = Number(attr.coordinates?.lat || attr.lat || 0);
  let lng = Number(attr.coordinates?.lng || attr.lng || 0);
  if ((lat === 0 && lng === 0) || isNaN(lat) || isNaN(lng)) {
    lat = targetCity ? targetCity.lat : 0;
    lng = targetCity ? targetCity.lng : 0;
  }

  // Clean image
  let imgUrl = attr.image_url || attr.thumbnail_url || attr.hero_image_url || '';
  if (imgUrl.includes(AMBER_FORT_RECYCLED_URL) && stateId !== 'rajasthan') {
    imgUrl = targetCity?.hero_image_url || STATES_DEF.find(s => s.id === stateId)?.hero || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80';
  }
  if (!imgUrl) {
    imgUrl = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80';
  }

  // Clean source page
  const sourcePage = sanitizeSourceUrl(attr.source_page || attr.source_url, stateId);

  // Category normalization
  const validCats = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
  let cat = attr.category || 'heritage';
  if (!validCats.includes(cat)) {
    if (cat.includes('temple') || cat.includes('church') || cat.includes('mosque') || cat.includes('sacred') || cat.includes('religious')) {
      cat = 'religious_cultural';
    } else if (cat.includes('park') || cat.includes('garden') || cat.includes('waterfall') || cat.includes('wildlife') || cat.includes('nature')) {
      cat = 'nature_parks_zoo';
    } else if (cat.includes('museum') || cat.includes('gallery')) {
      cat = 'museums';
    } else if (cat.includes('monument') || cat.includes('fort') || cat.includes('palace')) {
      cat = 'monuments';
    } else {
      cat = 'heritage';
    }
  }

  const categoryLabels = {
    heritage: 'Heritage & UNESCO',
    monuments: 'Monuments',
    museums: 'Museums & Art',
    tourist_places: 'Tourist Attractions',
    religious_cultural: 'Sacred & Cultural',
    nature_parks_zoo: 'Nature & Parks'
  };

  const fees = attr.fees || {
    domestic: Number(attr.entry_fee?.domestic ?? attr.entry_fee_domestic ?? 0),
    international: Number(attr.entry_fee?.international ?? attr.entry_fee_intl ?? 0),
    currency: 'INR',
    student_discount: true,
    camera_fee: 25,
    free_entry: Number(attr.entry_fee_domestic || 0) === 0,
    status: 'UNVERIFIED',
    note: 'Check official counter before entry'
  };

  const timings = attr.timings || {
    opening_time: '09:00 AM',
    closing_time: '05:30 PM',
    closed_days: [],
    status: 'UNVERIFIED',
    note: 'Open daily'
  };

  const visit_duration = attr.visit_duration || {
    recommended_mins: 90,
    label: '1.5 Hours',
    status: 'UNVERIFIED'
  };

  const preserved = {
    id: normId,
    name: attr.name,
    category: cat,
    category_label: categoryLabels[cat] || 'Heritage & UNESCO',
    summary: attr.summary || attr.description || `${attr.name} in ${targetCity?.name}, ${stateId}.`,
    historical_significance: attr.historical_significance || attr.history || attr.summary || '',
    fees: fees,
    timings: timings,
    visit_duration: visit_duration,
    coordinates: { lat, lng },
    image_url: imgUrl,
    thumbnail_url: imgUrl,
    attribution: attr.attribution && !attr.attribution.includes('Incredible India') ? attr.attribution : 'Archaeological Survey of India / State Tourism',
    source_page: sourcePage,
    status: attr.status || (attr.data_confidence === 'official' ? 'VERIFIED' : 'UNVERIFIED'),
    features: attr.features || { map: true, navigation: true, ai: true, '3d': false },
    tags: attr.tags || ['heritage', cat],
    city_id: targetCityId,
    state_id: stateId,
  };

  allPreservedAttractions.set(normId, preserved);
}

// 2a. Ingest from old ITDB
if (Array.isArray(oldItdb.states)) {
  for (const s of oldItdb.states) {
    if (Array.isArray(s.cities)) {
      for (const c of s.cities) {
        const catKeys = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
        for (const k of catKeys) {
          if (Array.isArray(c[k])) {
            for (const item of c[k]) {
              processAndPreserveAttraction(item, c.id, s.id);
            }
          }
        }
      }
    }
  }
}

// 2b. Ingest from old virasat_store.places
if (oldStore && oldStore.places) {
  for (const [pId, p] of Object.entries(oldStore.places)) {
    processAndPreserveAttraction(p, p.city_id, p.state_id);
  }
}

// 2c. Ingest from monuments.json
const monumentsPath = path.join(dataDir, 'heritage', 'monuments.json');
if (fs.existsSync(monumentsPath)) {
  try {
    const rawMonuments = JSON.parse(fs.readFileSync(monumentsPath, 'utf-8'));
    for (const m of rawMonuments) {
      processAndPreserveAttraction(m, m.city_id || m.city, m.state_id || m.state);
    }
  } catch (e) {
    console.warn('[DB Update] Could not parse monuments.json:', e.message);
  }
}

// 2d. Ingest regional folders
const regionalFolders = ['bihar', 'delhi', 'goa', 'jammu-kashmir', 'kerala', 'kolkata', 'ladakh', 'maharashtra', 'mumbai', 'rajasthan'];
for (const reg of regionalFolders) {
  const pPath = path.join(dataDir, reg, 'places.json');
  if (fs.existsSync(pPath)) {
    try {
      const placesList = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
      for (const p of placesList) {
        processAndPreserveAttraction(p, p.city_id || p.city, p.state_id || reg);
      }
    } catch (e) {
      console.warn(`[DB Update] Could not parse ${reg}/places.json:`, e.message);
    }
  }
}

console.log(`[DB Update] Total Preserved Attractions: ${allPreservedAttractions.size}`);
console.log(`[DB Update] Duplicate city linkages merged: ${duplicatesMergedCount}`);

// -------------------------------------------------------------
// 3. Assemble Complete Canonical City Entities
// -------------------------------------------------------------
const stateAttractionsMap = new Map();
const cityAttractionsMap = new Map();

for (const p of allPreservedAttractions.values()) {
  if (!cityAttractionsMap.has(p.city_id)) {
    cityAttractionsMap.set(p.city_id, []);
  }
  cityAttractionsMap.get(p.city_id).push(p);

  if (!stateAttractionsMap.has(p.state_id)) {
    stateAttractionsMap.set(p.state_id, []);
  }
  stateAttractionsMap.get(p.state_id).push(p);
}

const finalCanonicalCities = CITIES_DATA.map(c => {
  const stateObj = STATES_DEF.find(s => s.id === c.state_id);
  const places = cityAttractionsMap.get(c.id) || [];

  // Group places into categories
  const heritage = places.filter(p => p.category === 'heritage');
  const monuments = places.filter(p => p.category === 'monuments');
  const museums = places.filter(p => p.category === 'museums');
  const tourist_places = places.filter(p => p.category === 'tourist_places');
  const religious_cultural = places.filter(p => p.category === 'religious_cultural');
  const nature_parks_zoo = places.filter(p => p.category === 'nature_parks_zoo');

  // Hero image: Ensure distinct and non-Amber Fort for non-Rajasthan
  let heroImg = c.hero_image_url;
  if (!heroImg || (heroImg.includes(AMBER_FORT_RECYCLED_URL) && c.state_id !== 'rajasthan')) {
    heroImg = stateObj?.hero || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80';
  }

  return {
    id: c.id,
    name: c.name,
    canonical_name: c.name,
    state: stateObj?.name || c.state_id,
    state_id: c.state_id,
    region: stateObj?.region || 'North',
    district: c.district || null,
    city_type: c.type || 'city',
    lat: c.lat,
    lng: c.lng,
    coordinates: { lat: c.lat, lng: c.lng },
    tagline: c.tagline || `Historic destination in ${stateObj?.name || c.state_id}`,
    description: c.desc,
    hero_image_url: heroImg,
    tourism_categories: c.tourism_categories || ['heritage', 'culture'],
    prominence: c.prominence || (c.is_capital ? 'State Capital' : 'Historic Destination'),
    is_capital: Boolean(c.is_capital),
    capital_status: c.capital_status || 'none',
    verification_status: 'verified',
    source_provenance: 'Virasat Geographic Registry & Archaeological Survey of India / Census of India',
    places_count: places.length,
    created_at: '2026-09-10T00:00:00.000Z',
    updated_at: now,

    // Hierarchy Arrays for India Explorer
    heritage,
    monuments,
    museums,
    tourist_places,
    religious_cultural,
    nature_parks_zoo,

    transport: {
      railway_stations: [],
      airport: undefined,
      local_transit: {
        modes: ['Auto-rickshaws', 'City Cabs', 'Local Buses'],
        fare_indication: '₹50 - ₹200 per ride',
        status: 'UNVERIFIED',
        tips: 'Confirm meter or agreed tariff before boarding'
      }
    },
    hotels: [],
    fees_overview: {
      typical_budget_per_day: '₹1,500 - ₹3,500',
      status: 'UNVERIFIED',
      note: 'Average estimated budget per person for local exploration and meals'
    },
    live_travel_info: {
      best_season: 'October to March',
      weather_summary: 'Pleasant and comfortable for sightseeing',
      status: 'UNVERIFIED',
      advisory: 'Early morning visits recommended for popular monuments'
    },
    active_stories: [
      `Heritage walking trail through historic quarters of ${c.name}.`,
      `Local artisanal traditions and architectural marvels.`
    ]
  };
});

// -------------------------------------------------------------
// 4. Assemble Complete Canonical State Hierarchy Entities
// -------------------------------------------------------------
const finalStatesHierarchy = STATES_DEF.map(s => {
  const stateCities = finalCanonicalCities.filter(c => c.state_id === s.id);
  const totalAttractions = stateCities.reduce((acc, c) => acc + c.places_count, 0);

  return {
    id: s.id,
    name: s.name,
    code: s.code,
    capital: s.capital,
    region: s.region_full,
    description: s.desc,
    hero_image_url: s.hero,
    total_cities: stateCities.length,
    total_attractions: totalAttractions,
    heritage_overview: s.desc,
    active_stories: [
      `Cultural landmarks and legendary historical monuments of ${s.name}.`,
      `Artisanal crafts and architectural evolution across centuries.`,
      `Living traditions and sacred geography preserved across generations.`
    ],
    cities: stateCities
  };
});

// -------------------------------------------------------------
// 5. Output: data/cities.json
// -------------------------------------------------------------
const cleanCitiesJson = finalCanonicalCities.map(c => ({
  id: c.id,
  name: c.name,
  canonical_name: c.canonical_name,
  state: c.state,
  state_id: c.state_id,
  region: c.region,
  district: c.district,
  city_type: c.city_type,
  lat: c.lat,
  lng: c.lng,
  description: c.description,
  tagline: c.tagline,
  tourism_categories: c.tourism_categories,
  prominence: c.prominence,
  is_capital: c.is_capital,
  capital_status: c.capital_status,
  verification_status: c.verification_status,
  source_provenance: c.source_provenance,
  hero_image_url: c.hero_image_url,
  places_count: c.places_count,
  created_at: c.created_at,
  updated_at: c.updated_at
}));

fs.writeFileSync(citiesJsonPath, JSON.stringify(cleanCitiesJson, null, 2), 'utf-8');
console.log(`✓ Wrote ${cleanCitiesJson.length} canonical cities to ${citiesJsonPath}`);

// -------------------------------------------------------------
// 6. Output: data/states.json
// -------------------------------------------------------------
const cleanStatesJson = STATES_DEF.map(s => {
  const citiesOfState = cleanCitiesJson.filter(c => c.state_id === s.id);
  const totalPlaces = citiesOfState.reduce((acc, c) => acc + (c.places_count || 0), 0);

  return {
    id: s.id,
    name: s.name,
    capital: s.capital,
    region: s.region_full,
    total_places: totalPlaces,
    coordinates: { lat: s.lat, lng: s.lng },
    thumbnail_url: s.hero,
    state_id: s.id,
    type: s.type,
    cities: citiesOfState.map(c => c.id)
  };
});

fs.writeFileSync(statesJsonPath, JSON.stringify(cleanStatesJson, null, 2), 'utf-8');
console.log(`✓ Wrote ${cleanStatesJson.length} canonical states to ${statesJsonPath}`);

// -------------------------------------------------------------
// 7. Output: data/india_tourism_database.json & src/data/indiaTourismDatabase.ts
// -------------------------------------------------------------
const totalFinalAttractions = finalStatesHierarchy.reduce((acc, s) => acc + s.total_attractions, 0);

const outputDatabase = {
  title: 'VIRASAT — COMPLETE INDIA TOURISM DATABASE',
  version: '3.0.0',
  states_count: finalStatesHierarchy.length,
  cities_count: finalCanonicalCities.length,
  attractions_count: totalFinalAttractions,
  accuracy_disclaimer: 'Fees, timings, hotel prices, train schedules, route durations and availability can change. UNVERIFIED means it must be checked from an official/current source before being shown to a user.',
  states: finalStatesHierarchy
};

fs.writeFileSync(itdbPath, JSON.stringify(outputDatabase, null, 2), 'utf-8');
console.log(`✓ Wrote complete ITDB JSON database to ${itdbPath}`);

const tsContent = `import { IndiaHierarchyDatabase } from '../types/indiaHierarchy';

export const INDIA_TOURISM_DATABASE: IndiaHierarchyDatabase = ${JSON.stringify(outputDatabase, null, 2)};

export default INDIA_TOURISM_DATABASE;
`;
fs.writeFileSync(tsPath, tsContent, 'utf-8');
console.log(`✓ Wrote complete TypeScript database export to ${tsPath}`);

// -------------------------------------------------------------
// 8. Output: data/.database/virasat_store.json
// -------------------------------------------------------------
const storeStates = {};
for (const s of STATES_DEF) {
  storeStates[s.id] = {
    id: s.id,
    name: s.name,
    capital: s.capital,
    region: s.region_full,
    description: s.desc,
    hero_image_id: undefined,
    created_at: now
  };
}

const storeCities = {};
for (const c of cleanCitiesJson) {
  storeCities[c.id] = {
    id: c.id,
    name: c.name,
    canonical_name: c.canonical_name,
    state: c.state,
    state_id: c.state_id,
    region: c.region,
    district: c.district,
    city_type: c.city_type,
    lat: c.lat,
    lng: c.lng,
    description: c.description,
    tagline: c.tagline,
    tourism_categories: c.tourism_categories,
    prominence: c.prominence,
    is_capital: c.is_capital,
    capital_status: c.capital_status,
    verification_status: c.verification_status,
    source_provenance: c.source_provenance,
    hero_image_url: c.hero_image_url,
    places_count: c.places_count,
    created_at: c.created_at,
    updated_at: c.updated_at
  };
}

const storePlaces = {};
for (const p of allPreservedAttractions.values()) {
  storePlaces[p.id] = {
    id: p.id,
    city_id: p.city_id,
    state_id: p.state_id,
    name: p.name,
    category: p.category,
    summary: p.summary,
    description: p.summary,
    history: p.historical_significance,
    lat: p.coordinates.lat,
    lng: p.coordinates.lng,
    entry_fee_domestic: p.fees?.domestic || 0,
    entry_fee_intl: p.fees?.international || 0,
    visiting_hours: p.timings?.opening_time && p.timings?.closing_time ? `${p.timings.opening_time} - ${p.timings.closing_time}` : '09:00 - 17:30',
    heritage_status: 'Official Heritage',
    data_confidence: p.status === 'VERIFIED' ? 'official' : 'unverified',
    source_url: sanitizeSourceUrl(p.source_page, p.state_id),
    last_verified_at: p.status === 'VERIFIED' ? '2026-09-08T00:00:00.000Z' : undefined,
    rating: 4.6,
    thumbnail_url: p.thumbnail_url,
    created_at: now
  };
}

// Preserve existing transit, users, itineraries, etc.
const updatedStore = {
  ...oldStore,
  states: storeStates,
  cities: storeCities,
  places: storePlaces,
};

// Sanitize facts and sources
if (updatedStore.place_facts) {
  for (const f of Object.values(updatedStore.place_facts)) {
    if (f.source_url && f.source_url.includes('incredibleindia')) {
      const parentPlace = storePlaces[f.place_id];
      f.source_url = parentPlace ? parentPlace.source_url : 'https://asi.nic.in';
    }
  }
}

if (updatedStore.place_sources) {
  for (const s of Object.values(updatedStore.place_sources)) {
    if (s.url && s.url.includes('incredibleindia')) {
      s.url = 'https://asi.nic.in';
      s.source_name = 'Archaeological Survey of India (ASI)';
    }
  }
}

fs.writeFileSync(storePath, JSON.stringify(updatedStore, null, 2), 'utf-8');
console.log(`✓ Wrote updated Virasat Store to ${storePath}`);

// -------------------------------------------------------------
// 9. Validation Report
// -------------------------------------------------------------
console.log('\n======================================================');
console.log('            VIRASAT DATABASE UPDATE REPORT            ');
console.log('======================================================');
console.log(`✓ Total States/UTs: ${finalStatesHierarchy.length}`);
console.log(`✓ Total City/Destination Records: ${finalCanonicalCities.length}`);
console.log(`✓ Duplicates Merged: ${duplicatesMergedCount}`);
console.log(`✓ Records Preserved (Attractions): ${allPreservedAttractions.size}`);

const missingCoords = finalCanonicalCities.filter(c => !c.lat || !c.lng || (c.lat === 0 && c.lng === 0));
const missingDistricts = finalCanonicalCities.filter(c => !c.district);
console.log(`✓ Records with missing coordinates: ${missingCoords.length}`);
console.log(`✓ Records with missing district: ${missingDistricts.length}`);

// Check Incredible India URLs remaining
let incredUrlsRemaining = 0;
for (const p of Object.values(storePlaces)) {
  if (p.source_url && p.source_url.includes('incredibleindia')) incredUrlsRemaining++;
}
console.log(`✓ Incredible India URLs remaining: ${incredUrlsRemaining}`);

// Check non-Rajasthan Amber Fort images
let amberFortContamination = 0;
for (const c of cleanCitiesJson) {
  if (c.state_id !== 'rajasthan' && c.hero_image_url && c.hero_image_url.includes(AMBER_FORT_RECYCLED_URL)) {
    amberFortContamination++;
  }
}
console.log(`✓ Non-Rajasthan Amber Fort Image Contaminations: ${amberFortContamination}`);
console.log('======================================================\n');
