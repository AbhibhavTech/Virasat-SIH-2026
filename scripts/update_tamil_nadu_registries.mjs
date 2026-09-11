// scripts/update_tamil_nadu_registries.mjs
import fs from 'fs';
import path from 'path';

console.log('🔄 UPDATING VIRASAT REGISTRIES FOR TAMIL NADU...');

const tnPlaces = JSON.parse(fs.readFileSync('data/tamil-nadu/places.json', 'utf-8'));
console.log(`Loaded ${tnPlaces.length} Tamil Nadu places from data/tamil-nadu/places.json`);

// -------------------------------------------------------------
// 1. UPDATE data/cities.json
// -------------------------------------------------------------
const citiesPath = 'data/cities.json';
let cities = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));
const initialCount = cities.length;

// Remove kanchipuram and tiruchirappalli
cities = cities.filter(c => c.id !== 'kanchipuram' && c.id !== 'tiruchirappalli' && c.slug !== 'kanchipuram' && c.slug !== 'tiruchirappalli');
console.log(`Removed Kanchipuram and Tiruchirappalli from cities.json (count: ${initialCount} -> ${cities.length})`);

// Define counts per city in Tamil Nadu
const tnCityCounts = {};
for (const p of tnPlaces) {
  tnCityCounts[p.city_id] = (tnCityCounts[p.city_id] || 0) + 1;
}
console.log('City place distribution:', tnCityCounts);

// New cities metadata if not present
const newCitiesMeta = [
  {
    id: 'kodaikanal',
    state_id: 'tamil-nadu',
    name: 'Kodaikanal',
    slug: 'kodaikanal',
    entity_type: 'hill_station',
    district: 'Dindigul',
    latitude: 10.2381,
    longitude: 77.4892,
    lat: 10.2381,
    lng: 77.4892,
    short_description: 'Princess of Hill Stations renowned for star-shaped Kodaikanal Lake, pine forests, Pillar Rocks, and cool mountain climate.',
    description: 'Scenic hill retreat in the Palani Hills of Tamil Nadu, famous for its misty lake, Coaker’s Walk, waterfalls, and rich flora.',
    official_url: 'https://www.tamilnadutourism.tn.gov.in/destinations/kodaikanal',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    places_count: tnCityCounts['kodaikanal'] || 1
  },
  {
    id: 'gangaikonda-cholapuram',
    state_id: 'tamil-nadu',
    name: 'Gangaikonda Cholapuram',
    slug: 'gangaikonda-cholapuram',
    entity_type: 'heritage_site',
    district: 'Ariyalur',
    latitude: 11.2061,
    longitude: 79.4503,
    lat: 11.2061,
    lng: 79.4503,
    short_description: 'Historic capital of the Chola empire, founded by Rajendra Chola I, housing the magnificent UNESCO World Heritage Brihadisvara Temple.',
    description: 'An architectural marvel celebrating the victorious expedition of Rajendra Chola I to the River Ganga.',
    official_url: 'https://whc.unesco.org/en/list/250/',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80',
    places_count: tnCityCounts['gangaikonda-cholapuram'] || 1
  },
  {
    id: 'chidambaram',
    state_id: 'tamil-nadu',
    name: 'Chidambaram',
    slug: 'chidambaram',
    entity_type: 'heritage_site',
    district: 'Cuddalore',
    latitude: 11.3992,
    longitude: 79.6934,
    lat: 11.3992,
    lng: 79.6934,
    short_description: 'Sacred temple town celebrated for the historic Thillai Nataraja Temple, depicting Lord Shiva in the cosmic Ananda Tandava posture.',
    description: 'One of the Pancha Bhoota Sthalams representing Akasha (ether), renowned for ancient bronze sculptures and Bharatanatyam dance sculptures.',
    official_url: 'https://www.tamilnadutourism.tn.gov.in/destinations/chidambaram-nataraja-temple',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1600100397608-f010e421e4a3?w=1200&auto=format&fit=crop&q=80',
    places_count: tnCityCounts['chidambaram'] || 1
  },
  {
    id: 'courtallam',
    state_id: 'tamil-nadu',
    name: 'Courtallam',
    slug: 'courtallam',
    entity_type: 'natural_heritage',
    district: 'Tenkasi',
    latitude: 8.9297,
    longitude: 77.2694,
    lat: 8.9297,
    lng: 77.2694,
    short_description: 'Spa of South India, famous for mineral-rich medicinal waterfalls cascading down the Western Ghats.',
    description: 'Popular natural destination featuring Main Falls, Five Falls, and Old Courtallam cascades renowned for therapeutic waters.',
    official_url: 'https://www.tamilnadutourism.tn.gov.in/destinations/courtallam-falls',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1200&auto=format&fit=crop&q=80',
    places_count: tnCityCounts['courtallam'] || 1
  },
  {
    id: 'yercaud',
    state_id: 'tamil-nadu',
    name: 'Yercaud',
    slug: 'yercaud',
    entity_type: 'hill_station',
    district: 'Salem',
    latitude: 11.7753,
    longitude: 78.2093,
    lat: 11.7753,
    lng: 78.2093,
    short_description: 'Tranquil hill station in the Shevaroy Hills celebrated for emerald lakes, coffee plantations, and panoramic viewpoints.',
    description: 'Jewel of the South located 1515 meters above sea level, offering botanical gardens, deer park, and Pagoda Point.',
    official_url: 'https://www.tamilnadutourism.tn.gov.in/destinations/yercaud',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    places_count: tnCityCounts['yercaud'] || 1
  }
];

// Update existing TN cities
for (const city of cities) {
  if (city.state_id === 'tamil-nadu') {
    if (tnCityCounts[city.id] !== undefined) {
      city.places_count = tnCityCounts[city.id];
    } else if (city.id === 'chennai') {
      city.places_count = 10;
    }
  }
}

// Add new cities if not present
for (const nc of newCitiesMeta) {
  const existing = cities.find(c => c.id === nc.id);
  if (!existing) {
    cities.push(nc);
  } else {
    existing.places_count = nc.places_count;
  }
}

fs.writeFileSync(citiesPath, JSON.stringify(cities, null, 2), 'utf-8');
console.log(`✓ Updated data/cities.json with Tamil Nadu cities`);

// -------------------------------------------------------------
// 2. UPDATE data/states.json
// -------------------------------------------------------------
const statesPath = 'data/states.json';
let states = JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
const tnState = states.find(s => s.id === 'tamil-nadu');
if (tnState) {
  tnState.total_attractions = 27;
  tnState.total_cities = cities.filter(c => c.state_id === 'tamil-nadu').length;
  tnState.official_tourism_url = 'https://www.tamilnadutourism.tn.gov.in/';
}
fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), 'utf-8');
console.log(`✓ Updated data/states.json (Tamil Nadu attractions: 27, cities: ${tnState?.total_cities})`);

// -------------------------------------------------------------
// 3. UPDATE data/india_tourism_database.json & src/data/indiaTourismDatabase.ts
// -------------------------------------------------------------
const itdbPath = 'data/india_tourism_database.json';
const itdb = JSON.parse(fs.readFileSync(itdbPath, 'utf-8'));

const tnStateObj = itdb.states.find(s => s.id === 'tamil-nadu');
if (tnStateObj) {
  // Filter out kanchipuram and tiruchirappalli
  tnStateObj.cities = tnStateObj.cities.filter(c => c.id !== 'kanchipuram' && c.id !== 'tiruchirappalli');

  // Convert each of our 27 places into the ITDB attraction format
  const convertToItdbPlace = (p) => ({
    id: p.id,
    name: p.name,
    canonical_name: p.name,
    aliases: [],
    city_id: p.city_id,
    state_id: 'tamil-nadu',
    district: p.area,
    category: p.category,
    category_label: p.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    categories: [p.category],
    subcategories: p.tags || [],
    importance_level: 'top_landmark',
    summary: p.description,
    historical_significance: p.description,
    fees: {
      domestic: 0,
      international: 0,
      description: p.entry_fee,
      currency: 'INR'
    },
    timings: {
      description: p.opening_hours,
      visiting_hours: p.opening_hours
    },
    visit_duration: {
      label: p.suggested_duration
    },
    coordinates: {
      lat: p.lat,
      lng: p.lng
    },
    image_url: p.image_url,
    thumbnail_url: p.thumbnail_url,
    attribution: p.source_name,
    source_url: p.source_url,
    source_name: p.source_name,
    source_type: 'official_site',
    source_quality: 'place_specific',
    verification_status: 'verified',
    status: 'VERIFIED',
    tags: p.tags,
    best_time_to_visit: p.best_time_to_visit,
    visitor_notes: p.visitor_notes,
    map_search: p.map_search,
    area: p.area
  });

  // Ensure all cities in newCitiesMeta exist in tnStateObj.cities
  for (const nc of newCitiesMeta) {
    let cityObj = tnStateObj.cities.find(c => c.id === nc.id);
    if (!cityObj) {
      cityObj = {
        id: nc.id,
        name: nc.name,
        canonical_name: nc.name,
        state_id: 'tamil-nadu',
        district: nc.district,
        latitude: nc.latitude,
        longitude: nc.longitude,
        coordinates: { lat: nc.latitude, lng: nc.longitude },
        description: nc.description,
        short_description: nc.short_description,
        places_count: nc.places_count,
        verification_status: 'verified',
        heritage: [],
        monuments: [],
        museums: [],
        tourist_places: [],
        religious_cultural: [],
        nature_parks_zoo: [],
        transport: { railway_stations: [] }
      };
      tnStateObj.cities.push(cityObj);
    }
  }

  // Populate city attractions
  for (const cityObj of tnStateObj.cities) {
    const matchingPlaces = tnPlaces.filter(p => p.city_id === cityObj.id);
    cityObj.places_count = matchingPlaces.length;

    // Reset categories
    cityObj.heritage = [];
    cityObj.monuments = [];
    cityObj.museums = [];
    cityObj.tourist_places = [];
    cityObj.religious_cultural = [];
    cityObj.nature_parks_zoo = [];

    for (const p of matchingPlaces) {
      const converted = convertToItdbPlace(p);
      const cat = p.category.toLowerCase();
      if (cat.includes('museum') || cat.includes('railway')) {
        cityObj.museums.push(converted);
      } else if (cat.includes('religious') || cat.includes('temple')) {
        cityObj.religious_cultural.push(converted);
        cityObj.heritage.push(converted);
      } else if (cat.includes('nature') || cat.includes('wildlife') || cat.includes('waterfall')) {
        cityObj.nature_parks_zoo.push(converted);
      } else if (cat.includes('beach') || cat.includes('hill') || cat.includes('coastal') || cat.includes('monument')) {
        cityObj.tourist_places.push(converted);
      } else {
        cityObj.heritage.push(converted);
      }
    }
  }
}

fs.writeFileSync(itdbPath, JSON.stringify(itdb, null, 2), 'utf-8');
console.log(`✓ Updated data/india_tourism_database.json`);

// Write TS version
const tsITDBContent = `import { DatabaseMetadata, StateItem } from './types';\n\nexport const INDIA_TOURISM_DATABASE: { metadata: DatabaseMetadata; states: StateItem[] } = ${JSON.stringify(itdb, null, 2)};\n`;
fs.writeFileSync('src/data/indiaTourismDatabase.ts', tsITDBContent, 'utf-8');
console.log(`✓ Synchronized src/data/indiaTourismDatabase.ts`);

// -------------------------------------------------------------
// 4. UPDATE src/data/cityItineraryData.ts
// -------------------------------------------------------------
const itineraryPath = 'src/data/cityItineraryData.ts';
let itinContent = fs.readFileSync(itineraryPath, 'utf-8');

// Regex removal of Kanchipuram and Tiruchirappalli JSON entries in cityItineraryData
itinContent = itinContent.replace(/\s*\{\s*"id":\s*"kanchipuram"[^}]+},?/g, '');
itinContent = itinContent.replace(/\s*\{\s*"id":\s*"tiruchirappalli"[^}]+},?/g, '');

fs.writeFileSync(itineraryPath, itinContent, 'utf-8');
console.log(`✓ Removed Kanchipuram and Tiruchirappalli from src/data/cityItineraryData.ts`);

console.log('🎉 REGISTRIES UPDATED SUCCESSFULLY!');
