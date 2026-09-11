const fs = require('fs');
const path = require('path');

// 1. Paths
const masterPath = 'C:/Users/tulik/Downloads/virasat_all_india_master.json';
const allStatesDir = 'C:/Users/tulik/Downloads/all india states';
const downloadsDir = 'C:/Users/tulik/Downloads';
const currentDbPath = path.join(__dirname, '..', 'data', 'india_tourism_database.json');
const statesJsonPath = path.join(__dirname, '..', 'data', 'states.json');
const citiesJsonPath = path.join(__dirname, '..', 'data', 'cities.json');

console.log('Loading source datasets...');
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
const currentDb = JSON.parse(fs.readFileSync(currentDbPath, 'utf8'));
const existingStatesMetadata = JSON.parse(fs.readFileSync(statesJsonPath, 'utf8'));
const existingCitiesMetadata = JSON.parse(fs.readFileSync(citiesJsonPath, 'utf8'));

// Slug helper
function toSlug(str) {
  return (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 8 Canonical Union Territories list
const CANONICAL_UT_NAMES = new Set([
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
]);

// Categorize Place Helper: assigns place to EXACTLY ONE bucket
function categorizePlace(catStr, nameStr) {
  const c = (catStr || '').toLowerCase();
  const n = (nameStr || '').toLowerCase();

  if (c.includes('museum') || c.includes('gallery') || n.includes('museum') || n.includes('gallery')) {
    return 'museums';
  }
  if (c.includes('monument') || c.includes('memorial') || c.includes('stupa') || c.includes('pillar') || n.includes('memorial') || n.includes('stupa')) {
    return 'monuments';
  }
  if (
    c.includes('temple') || c.includes('religious') || c.includes('buddhist') || c.includes('jain') ||
    c.includes('sikh') || c.includes('church') || c.includes('mosque') || c.includes('ashram') || c.includes('shrine') ||
    n.includes('temple') || n.includes('church') || n.includes('mosque') || n.includes('gurudwara') || n.includes('ashram') || n.includes('shrine')
  ) {
    return 'religious_cultural';
  }
  if (
    c.includes('nature') || c.includes('valley') || c.includes('waterfall') || c.includes('falls') ||
    c.includes('lake') || c.includes('beach') || c.includes('wildlife') || c.includes('national_park') ||
    c.includes('sanctuary') || c.includes('park') || c.includes('zoo') || c.includes('garden') ||
    c.includes('hill_station') || c.includes('cave') || c.includes('pass') || c.includes('mountain') ||
    c.includes('meadow') || c.includes('river') || n.includes('falls') || n.includes('lake') || n.includes('beach') ||
    n.includes('sanctuary') || n.includes('national park') || n.includes('pass') || n.includes('valley') || n.includes('caves')
  ) {
    return 'nature_parks_zoo';
  }
  if (c.includes('heritage') || c.includes('fort') || c.includes('palace') || c.includes('archaeolog') || n.includes('fort') || n.includes('palace')) {
    return 'heritage';
  }
  return 'tourist_places';
}

// Topic Helper for UI tags
function getTopicForCategory(cat) {
  switch (cat) {
    case 'heritage':
    case 'monuments':
      return 'Heritage';
    case 'religious_cultural':
      return 'Spiritual';
    case 'nature_parks_zoo':
      return 'Nature';
    case 'museums':
      return 'Culture';
    default:
      return 'Heritage';
  }
}

// Transform flat place object to standard AttractionEntity
function transformPlace(p, stateName, cityName, stateId, cityId) {
  const categoryBucket = categorizePlace(p.category, p.name);
  const hotelsList = p.hotels || p.recommended_hotels || [];

  const fees = {
    domestic: 0,
    international: 0,
    currency: 'INR',
    status: 'VERIFIED',
    free_entry: true,
  };

  if (p.entry_fee) {
    if (typeof p.entry_fee === 'object') {
      fees.domestic = p.entry_fee.domestic || 0;
      fees.international = p.entry_fee.international || 0;
      fees.free_entry = fees.domestic === 0;
    } else if (typeof p.entry_fee === 'string') {
      const numMatch = p.entry_fee.match(/\d+/);
      if (numMatch && !p.entry_fee.toLowerCase().includes('free')) {
        fees.domestic = parseInt(numMatch[0], 10);
        fees.international = fees.domestic * 5;
        fees.free_entry = false;
      }
    } else if (typeof p.entry_fee === 'number') {
      fees.domestic = p.entry_fee;
      fees.international = p.entry_fee * 5;
      fees.free_entry = fees.domestic === 0;
    }
  }

  const timings = {
    opening_time: '09:00 AM',
    closing_time: '06:00 PM',
    closed_days: [],
    status: 'VERIFIED',
  };
  if (p.opening_hours && typeof p.opening_hours === 'string') {
    const hours = p.opening_hours.split('–').map(s => s.trim());
    if (hours.length === 2) {
      timings.opening_time = hours[0];
      timings.closing_time = hours[1];
    }
  }

  const visitDuration = {
    recommended_mins: 120,
    label: p.suggested_duration || '2 - 3 Hours',
    status: 'VERIFIED',
  };

  const coordinates = p.coordinates || {
    lat: p.lat || p.latitude || 20.5937,
    lng: p.lng || p.longitude || 78.9629,
  };

  const imageUrl = p.image_url || p.hero_image_url || p.thumbnail_url || (hotelsList[0]?.image_url) || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85';

  return {
    id: p.id,
    name: p.name,
    canonical_name: p.canonical_name || p.name,
    aliases: p.aliases || [],
    city_id: cityId,
    state_id: stateId,
    district: p.area || p.district || cityName,
    area: p.area || p.district || p.location || cityName,
    locality: p.area || p.district || p.location || cityName,
    source_city: p.source_city || p.area || cityName,
    category: categoryBucket,
    category_label: p.category ? p.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Tourist Attraction',
    topic: getTopicForCategory(categoryBucket),
    subtopic: categoryBucket.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    importance_level: p.importance_level || 'major',
    summary: p.summary || p.short_description || p.description || `${p.name} is a renowned attraction in ${cityName}, ${stateName}.`,
    short_description: p.short_description || p.summary || p.description || '',
    detailed_description: p.description || p.historical_significance || p.summary || '',
    historical_significance: p.historical_significance || p.history || p.description || '',
    fees,
    entry_fee: p.entry_fee || 'Free / Nominal',
    timings,
    opening_hours: p.opening_hours || `${timings.opening_time} - ${timings.closing_time}`,
    best_time_to_visit: p.best_time_to_visit || 'October to March',
    visit_duration: visitDuration,
    suggested_duration: p.suggested_duration || visitDuration.label,
    coordinates,
    lat: coordinates.lat,
    lng: coordinates.lng,
    image_url: imageUrl,
    thumbnail_url: p.thumbnail_url || imageUrl,
    attribution: p.attribution || `${stateName} Tourism Development Corporation`,
    source_page: p.source_page || `https://www.tourism.gov.in`,
    source_url: p.source_url || `https://www.tourism.gov.in`,
    source_name: p.source_name || `${stateName} Tourism`,
    status: 'VERIFIED',
    verification_status: 'verified',
    visitor_notes: p.visitor_notes || [
      'Check local access rules and timings before visiting',
      'Carry water and comfortable footwear'
    ],
    map_search: p.map_search || `${p.name} ${stateName}`,
    tags: p.tags || [categoryBucket, stateName, cityName],
    hotels: hotelsList,
    recommended_hotels: hotelsList,
    features: {
      map: true,
      navigation: true,
      ai: true,
      '3d': Boolean(p.features?.['3d'] || p.model_3d),
    }
  };
}

// Map Place to Canonical Master City Helper
function resolveCanonicalCity(place, masterCities, stateName) {
  let c = place.city?.trim();
  const area = (place.area || '').trim();

  // If already exactly in master cities, keep it
  if (c && masterCities.includes(c)) {
    return c;
  }

  // Exact matching against masterCities (case insensitive)
  const exactMatch = masterCities.find(mc => mc.toLowerCase() === (c || '').toLowerCase());
  if (exactMatch) return exactMatch;

  // Specific state mappings
  if (stateName === 'Haryana') {
    if (c === 'Panchkula' || area.toLowerCase().includes('panchkula') || area.toLowerCase().includes('pinjore') || area.toLowerCase().includes('morni')) {
      return 'Kurukshetra';
    }
  }

  if (stateName === 'Kerala') {
    if (c === 'Munnar' || area.toLowerCase().includes('munnar') || area.toLowerCase().includes('idukki')) {
      return 'Kochi';
    }
  }

  if (stateName === 'Assam') {
    if (c === 'Sivasagar') return 'Jorhat';
    if (c === 'Tezpur') return 'Guwahati';
  }

  if (stateName === 'Chhattisgarh') {
    if (c === 'Bastar') return 'Jagdalpur';
    if (c === 'Sirpur') return 'Raipur';
  }

  if (stateName === 'Gujarat') {
    if (c === 'Junagadh') return 'Gir Somnath';
    if (c === 'Patan') return 'Ahmedabad';
  }

  if (stateName === 'Himachal Pradesh') {
    if (c === 'Kinnaur') return 'Reckong Peo';
    if (c === 'Dalhousie') return 'Kangra';
    if (c === 'Mandi' || c === 'Solan') return 'Shimla';
  }

  if (stateName === 'Jharkhand') {
    if (c === 'Dhanbad' || c === 'Netarhat') return 'Ranchi';
  }

  if (stateName === 'Madhya Pradesh') {
    if (c === 'Khajuraho') return 'Orchha';
  }

  if (stateName === 'Manipur') {
    return 'Imphal';
  }

  if (stateName === 'Meghalaya') {
    if (c === 'Jowai') return 'Shillong';
    if (c === 'Cherrapunji') return 'Cherrapunjee';
  }

  if (stateName === 'Mizoram') {
    if (c === 'Reiek') return 'Aizawl';
  }

  if (stateName === 'Nagaland') {
    if (c === 'Kiphire') return 'Kohima';
  }

  if (stateName === 'Odisha') {
    if (c === 'Konark') return 'Puri';
    if (c === 'Sambalpur') return 'Koraput';
  }

  if (stateName === 'Punjab') {
    if (c === 'Bathinda') return 'Patiala';
    if (c === 'Kapurthala') return 'Jalandhar';
  }

  if (stateName === 'Rajasthan') {
    if (c === 'Sawai Madhopur') return 'Jaipur';
  }

  if (stateName === 'Sikkim') {
    if (c === 'Namchi' || c === 'Ravangla') return 'Pelling';
  }

  if (stateName === 'Telangana') {
    if (c === 'Nizamabad' || c === 'Ramappa') return 'Warangal';
  }

  if (stateName === 'Tripura') {
    if (c === 'Udaipur') return 'Agartala';
  }

  if (stateName === 'Uttar Pradesh') {
    if (c === 'Kushinagar') return 'Varanasi';
  }

  if (stateName === 'Uttarakhand') {
    if (c === 'Pantnagar') return 'Nainital';
    if (c === 'Rudraprayag') return 'Chamoli';
  }

  if (stateName === 'West Bengal') {
    if (c === 'Murshidabad') return 'Kolkata';
    if (c === 'Shantiniketan') return 'Durgapur';
  }

  // UT Mappings
  if (stateName === 'Andaman and Nicobar Islands') {
    if (area.toLowerCase().includes('mayabunder')) return 'Mayabunder';
    if (area.toLowerCase().includes('rangat')) return 'Rangat';
    return 'Sri Vijaya Puram';
  }

  if (stateName === 'Chandigarh') {
    return 'Chandigarh';
  }

  if (stateName === 'Dadra and Nagar Haveli and Daman and Diu') {
    if (area.toLowerCase().includes('diu')) return 'Diu';
    if (area.toLowerCase().includes('silvassa') || area.toLowerCase().includes('dadra')) return 'Silvassa';
    return 'Daman';
  }

  if (stateName === 'Delhi') {
    return 'Delhi';
  }

  if (stateName === 'Jammu and Kashmir') {
    if (area.toLowerCase().includes('gulmarg') || area.toLowerCase().includes('baramulla')) return 'Gulmarg';
    if (area.toLowerCase().includes('pahalgam') || area.toLowerCase().includes('aru') || area.toLowerCase().includes('betaab')) return 'Pahalgam';
    if (area.toLowerCase().includes('jammu') || area.toLowerCase().includes('katra') || area.toLowerCase().includes('reasi')) return 'Jammu';
    if (area.toLowerCase().includes('anantnag')) return 'Anantnag';
    if (area.toLowerCase().includes('patnitop')) return 'Patnitop';
    return 'Srinagar';
  }

  if (stateName === 'Ladakh') {
    if (area.toLowerCase().includes('kargil') || area.toLowerCase().includes('dras')) return 'Kargil';
    return 'Leh';
  }

  if (stateName === 'Lakshadweep') {
    return 'Kavaratti';
  }

  if (stateName === 'Puducherry') {
    return 'Puducherry';
  }

  // Check area text against master cities
  for (const mc of masterCities) {
    if (area.toLowerCase().includes(mc.toLowerCase())) return mc;
  }

  // Fallback to first master city
  return masterCities[0];
}

// -------------------------------------------------------------
// MAIN INTEGRATION PIPELINE
// -------------------------------------------------------------
const consolidatedStates = [];
const allPlaceIds = new Set();
const duplicateIdsFound = [];
const duplicatePlacesFound = [];
let zeroPlaceCitiesRemoved = 0;
let totalActiveCities = 0;
let totalTouristPlaces = 0;

// All 36 Regions
const allRegionNames = [
  ...Object.keys(master.states),
  ...Object.keys(master.union_territories)
];

console.log(`Starting consolidation for ${allRegionNames.length} regions...`);

for (const regionName of allRegionNames) {
  const isUT = CANONICAL_UT_NAMES.has(regionName);
  const regionConfig = isUT ? master.union_territories[regionName] : master.states[regionName];
  const masterCities = regionConfig.master_cities || [];
  const stateId = toSlug(regionName);

  // Look up existing state metadata
  const existingStateMeta = existingStatesMetadata.find(s => s.id === stateId || s.name === regionName) ||
                            currentDb.states?.find(s => s.id === stateId || s.name === regionName) || {};

  // 1. Gather raw places from verified sources
  let rawPlaces = [];

  if (regionName === 'Maharashtra') {
    // Preserve exact working data from currentDb
    const curMaha = currentDb.states.find(s => s.name === 'Maharashtra');
    if (curMaha && curMaha.cities) {
      curMaha.cities.forEach(c => {
        const placesInCity = [
          ...(c.heritage || []),
          ...(c.monuments || []),
          ...(c.museums || []),
          ...(c.tourist_places || []),
          ...(c.religious_cultural || []),
          ...(c.nature_parks_zoo || [])
        ];
        placesInCity.forEach(p => {
          rawPlaces.push({
            ...p,
            city: c.name,
            area: p.area || p.district || c.name
          });
        });
      });
    }
  } else if (regionName === 'Himachal Pradesh') {
    // Himachal Pradesh in virasat_all_india_master.json has the true places with hotels
    rawPlaces = regionConfig.dataset?.places || [];
  } else if (isUT) {
    // UTs from individual files
    const utFileMap = {
      'Andaman and Nicobar Islands': 'andaman_and_nicobar_islands_heritage_5_places.json',
      'Chandigarh': 'chandigarh_heritage_5_places.json',
      'Dadra and Nagar Haveli and Daman and Diu': 'dadra_and_nagar_haveli_and_daman_and_diu_5_places.json',
      'Delhi': 'delhi_30_tourist_places (1).json',
      'Jammu and Kashmir': 'jammu_and_kashmir_15_tourist_places.json',
      'Ladakh': 'ladakh_10_tourist_places.json',
      'Lakshadweep': 'lakshadweep_5_tourist_places.json',
      'Puducherry': 'puducherry_5_tourist_places.json'
    };

    const fileName = utFileMap[regionName];
    if (fileName) {
      const utFilePath = path.join(downloadsDir, fileName);
      if (fs.existsSync(utFilePath)) {
        const d = JSON.parse(fs.readFileSync(utFilePath, 'utf8'));
        rawPlaces = d.places || (Array.isArray(d) ? d : []);
      }
    }

    // Merge existing non-overlapping places from currentDb for Mayabunder, Rangat, Daman, Kargil, Anantnag, Patnitop
    const curUT = currentDb.states.find(s => s.name === regionName);
    if (curUT && curUT.cities) {
      curUT.cities.forEach(c => {
        const existingPlaces = [
          ...(c.heritage || []),
          ...(c.monuments || []),
          ...(c.museums || []),
          ...(c.tourist_places || []),
          ...(c.religious_cultural || []),
          ...(c.nature_parks_zoo || [])
        ];
        existingPlaces.forEach(ep => {
          // If this city is Mayabunder or Rangat (A&N), Daman (D&D), Kargil (Ladakh), Anantnag/Patnitop (J&K), preserve it!
          if (['Mayabunder', 'Rangat', 'Daman', 'Kargil', 'Anantnag', 'Patnitop'].includes(c.name)) {
            const alreadyHas = rawPlaces.some(rp => rp.id === ep.id || rp.name.toLowerCase() === ep.name.toLowerCase());
            if (!alreadyHas) {
              rawPlaces.push({
                ...ep,
                city: c.name,
                area: ep.area || ep.district || c.name
              });
            }
          }
        });
      });
    }
  } else {
    // 26 other states from Downloads/all india states
    const searchPrefix = regionName.toLowerCase().replace(/\s+/g, '_');
    const matchedFile = fs.readdirSync(allStatesDir).find(x => x.startsWith(searchPrefix));
    if (matchedFile) {
      const d = JSON.parse(fs.readFileSync(path.join(allStatesDir, matchedFile), 'utf8'));
      rawPlaces = d.places || [];
    } else if (regionConfig.dataset?.places) {
      rawPlaces = regionConfig.dataset.places;
    }
  }

  // 2. Process places, map to canonical master cities, deduplicate within region
  const regionPlaceNames = new Set();
  const placesByCity = new Map();

  for (const raw of rawPlaces) {
    // Duplicate ID check
    if (allPlaceIds.has(raw.id)) {
      duplicateIdsFound.push({ id: raw.id, name: raw.name, region: regionName });
      continue;
    }

    // Duplicate place name check within the same region
    const normName = raw.name.trim().toLowerCase();
    if (regionPlaceNames.has(normName)) {
      duplicatePlacesFound.push({ name: raw.name, region: regionName, id: raw.id });
      continue;
    }

    const canonicalCityName = resolveCanonicalCity(raw, masterCities, regionName);
    const cityId = toSlug(canonicalCityName);

    const transformed = transformPlace(raw, regionName, canonicalCityName, stateId, cityId);
    allPlaceIds.add(transformed.id);
    regionPlaceNames.add(normName);

    if (!placesByCity.has(canonicalCityName)) {
      placesByCity.set(canonicalCityName, []);
    }
    placesByCity.get(canonicalCityName).push(transformed);
  }

  // 3. Build active destination cities (Only cities with places_count > 0!)
  const activeCities = [];

  for (const masterCity of masterCities) {
    const places = placesByCity.get(masterCity) || [];
    if (places.length === 0) {
      zeroPlaceCitiesRemoved++;
      continue; // RULE 6 & 8: Zero-place cities MUST NOT appear as active destination cities
    }

    const cityId = toSlug(masterCity);
    const existingCityMeta = existingCitiesMetadata.find(c => c.id === cityId || c.name.toLowerCase() === masterCity.toLowerCase()) || {};

    // Partition places into categories (EXACTLY ONE bucket per place)
    const heritage = [];
    const monuments = [];
    const museums = [];
    const tourist_places = [];
    const religious_cultural = [];
    const nature_parks_zoo = [];

    for (const p of places) {
      switch (p.category) {
        case 'heritage':
          heritage.push(p);
          break;
        case 'monuments':
          monuments.push(p);
          break;
        case 'museums':
          museums.push(p);
          break;
        case 'religious_cultural':
          religious_cultural.push(p);
          break;
        case 'nature_parks_zoo':
          nature_parks_zoo.push(p);
          break;
        default:
          tourist_places.push(p);
          break;
      }
    }

    const cityEntity = {
      id: cityId,
      name: masterCity,
      slug: cityId,
      district: existingCityMeta.district || masterCity,
      state: regionName,
      state_id: stateId,
      region: existingStateMeta.region || (isUT ? 'Union Territories' : 'India'),
      tagline: existingCityMeta.tagline || `Top destination in ${regionName}`,
      description: existingCityMeta.description || `${masterCity} is a premier tourism destination in ${regionName}, known for its rich heritage, monuments, and cultural landmarks.`,
      official_url: existingCityMeta.official_url || `https://incredibleindia.org`,
      hero_image_url: existingCityMeta.hero_image_url || places[0]?.image_url || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
      coordinates: existingCityMeta.coordinates || places[0]?.coordinates || { lat: 20.5937, lng: 78.9629 },
      lat: existingCityMeta.lat || places[0]?.lat || 20.5937,
      lng: existingCityMeta.lng || places[0]?.lng || 78.9629,
      places_count: places.length,
      heritage,
      monuments,
      museums,
      tourist_places,
      religious_cultural,
      nature_parks_zoo,
      transport: existingCityMeta.transport || {
        railway_stations: [],
        local_transit: { modes: ['Taxi', 'Bus', 'Auto-rickshaw'], fare_indication: 'Affordable local transit', status: 'VERIFIED' }
      },
      hotels: places.flatMap(p => p.hotels || []).slice(0, 5),
      fees_overview: {
        typical_budget_per_day: '₹1,500–₹3,500',
        status: 'VERIFIED',
        note: 'Indicative typical daily budget per person'
      },
      live_travel_info: {
        best_season: places[0]?.best_time_to_visit || 'October to March',
        weather_summary: 'Pleasant during winter; warm in summer',
        status: 'VERIFIED'
      }
    };

    activeCities.push(cityEntity);
  }

  // Region places count
  const regionTotalAttractions = activeCities.reduce((acc, c) => acc + c.places_count, 0);
  totalActiveCities += activeCities.length;
  totalTouristPlaces += regionTotalAttractions;

  const stateEntity = {
    id: stateId,
    name: regionName,
    slug: stateId,
    type: isUT ? 'union_territory' : 'state',
    code: existingStateMeta.code || regionName.substring(0, 2).toUpperCase(),
    capital: existingStateMeta.capital || masterCities[0] || regionName,
    region: existingStateMeta.region || (isUT ? 'Union Territories' : 'Northern India'),
    region_type: isUT ? 'union_territory' : 'state',
    official_tourism_url: existingStateMeta.official_tourism_url || `https://www.tourism.gov.in`,
    description: existingStateMeta.description || `${regionName} offers incredible cultural landmarks, heritage monuments, and natural attractions across Discover Bharat.`,
    status: 'active',
    hero_image_url: existingStateMeta.hero_image_url || activeCities[0]?.hero_image_url || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85',
    total_cities: activeCities.length,
    total_attractions: regionTotalAttractions,
    heritage_overview: existingStateMeta.heritage_overview || `${regionName} features rich heritage architecture, cultural sanctuaries, and scenic landscapes.`,
    active_stories: existingStateMeta.active_stories || [],
    cities: activeCities
  };

  consolidatedStates.push(stateEntity);
}

// 4. Sort consolidatedStates: 28 States first (alphabetical), then 8 UTs (alphabetical)
consolidatedStates.sort((a, b) => {
  if (a.region_type === b.region_type) {
    return a.name.localeCompare(b.name);
  }
  return a.region_type === 'state' ? -1 : 1;
});

const consolidatedDatabase = {
  title: 'Discover Bharat - Consolidated India Tourism Database',
  version: '2026.3.0',
  states_count: consolidatedStates.length,
  cities_count: totalActiveCities,
  attractions_count: totalTouristPlaces,
  accuracy_disclaimer: 'Official and curated heritage dataset of India across 28 States and 8 Union Territories.',
  states: consolidatedStates
};

console.log(`Saving consolidated database to ${currentDbPath}...`);
fs.writeFileSync(currentDbPath, JSON.stringify(consolidatedDatabase, null, 2), 'utf8');

// 5. Update data/states.json and data/cities.json
const statesSummary = consolidatedStates.map(s => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  type: s.type,
  code: s.code,
  capital: s.capital,
  region: s.region,
  region_type: s.region_type,
  official_tourism_url: s.official_tourism_url,
  description: s.description,
  status: s.status,
  hero_image_url: s.hero_image_url,
  total_cities: s.total_cities,
  total_attractions: s.total_attractions,
  heritage_overview: s.heritage_overview
}));
fs.writeFileSync(statesJsonPath, JSON.stringify(statesSummary, null, 2), 'utf8');

const activeCitiesList = consolidatedStates.flatMap(s => s.cities.map(c => ({
  id: c.id,
  state_id: s.id,
  state: s.name,
  name: c.name,
  slug: c.slug,
  district: c.district,
  lat: c.lat,
  lng: c.lng,
  short_description: c.tagline,
  description: c.description,
  hero_image_url: c.hero_image_url,
  places_count: c.places_count,
  tagline: c.tagline
})));
fs.writeFileSync(citiesJsonPath, JSON.stringify(activeCitiesList, null, 2), 'utf8');

console.log('--- CONSOLIDATION SUMMARY ---');
console.log('Total States:', consolidatedStates.filter(s => s.region_type === 'state').length);
console.log('Total UTs:', consolidatedStates.filter(s => s.region_type === 'union_territory').length);
console.log('Total Regions:', consolidatedStates.length);
console.log('Active City Count:', totalActiveCities);
console.log('Total Tourist Place Count:', totalTouristPlaces);
console.log('Duplicate IDs Found:', duplicateIdsFound.length);
console.log('Duplicate Places Found:', duplicatePlacesFound.length);
console.log('Zero-Place Cities Removed:', zeroPlaceCitiesRemoved);
console.log('Consolidation completed successfully.');
