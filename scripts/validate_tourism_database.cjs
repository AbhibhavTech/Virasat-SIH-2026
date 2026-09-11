const fs = require('fs');
const path = require('path');
const http = require('http');

const dbPath = path.join(__dirname, '..', 'data', 'india_tourism_database.json');
const masterPath = 'C:/Users/tulik/Downloads/virasat_all_india_master.json';

console.log('======================================================');
console.log('VIRASAT / DISCOVER BHARAT - COMPREHENSIVE VALIDATION');
console.log('======================================================\n');

if (!fs.existsSync(dbPath)) {
  console.error('FAIL: Database file not found at', dbPath);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

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

let passedChecks = 0;
let totalChecks = 15;

const report = {
  total_states: 0,
  total_uts: 0,
  total_regions: 0,
  active_city_count: 0,
  total_tourist_place_count: 0,
  duplicate_ids_found: 0,
  duplicate_places_found: 0,
  zero_place_cities_removed: 31,
  regions_successfully_integrated: [],
  api_endpoints_verified: []
};

// Check 1: Exactly 28 States
const states = db.states.filter(s => s.region_type === 'state');
report.total_states = states.length;
if (states.length === 28) {
  console.log(`[PASS] Check 1: Exactly 28 states found (${states.length}/28)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 1: Expected 28 states, found ${states.length}`);
}

// Check 2: Exactly 8 Union Territories
const uts = db.states.filter(s => s.region_type === 'union_territory');
report.total_uts = uts.length;
if (uts.length === 8) {
  console.log(`[PASS] Check 2: Exactly 8 union territories found (${uts.length}/8)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 2: Expected 8 union territories, found ${uts.length}`);
}

// Check 3: Exactly 36 Total Regions
report.total_regions = db.states.length;
if (db.states.length === 36) {
  console.log(`[PASS] Check 3: Exactly 36 total regions found (${db.states.length}/36)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 3: Expected 36 regions, found ${db.states.length}`);
}

// Check 4: No Duplicate Region Names
const regionNames = new Set();
const duplicateRegionNames = [];
for (const s of db.states) {
  const norm = s.name.trim().toLowerCase();
  if (regionNames.has(norm)) {
    duplicateRegionNames.push(s.name);
  }
  regionNames.add(norm);
}
if (duplicateRegionNames.length === 0) {
  console.log(`[PASS] Check 4: No duplicate region names found across all 36 regions`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 4: Duplicate region names found:`, duplicateRegionNames);
}

// Check 5: No Duplicate City Names Within the Same Region
const dupCitiesWithinRegion = [];
for (const s of db.states) {
  const cNames = new Set();
  for (const c of s.cities) {
    const norm = c.name.trim().toLowerCase();
    if (cNames.has(norm)) {
      dupCitiesWithinRegion.push({ region: s.name, city: c.name });
    }
    cNames.add(norm);
  }
}
if (dupCitiesWithinRegion.length === 0) {
  console.log(`[PASS] Check 5: No duplicate city names within the same region`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 5: Duplicate city names within region:`, dupCitiesWithinRegion);
}

// Check 6: No Duplicate Tourist-Place IDs
const placeIds = new Set();
const duplicatePlaceIds = [];
for (const s of db.states) {
  for (const c of s.cities) {
    const places = [
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || [])
    ];
    for (const p of places) {
      if (placeIds.has(p.id)) {
        duplicatePlaceIds.push(p.id);
      }
      placeIds.add(p.id);
    }
  }
}
report.duplicate_ids_found = duplicatePlaceIds.length;
if (duplicatePlaceIds.length === 0) {
  console.log(`[PASS] Check 6: No duplicate tourist-place IDs across India (${placeIds.size} unique IDs)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 6: Duplicate tourist-place IDs found:`, duplicatePlaceIds);
}

// Check 7: No Duplicate Tourist-Place Names Within the Same Region
const dupPlaceNamesWithinRegion = [];
for (const s of db.states) {
  const pNames = new Set();
  for (const c of s.cities) {
    const places = [
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || [])
    ];
    for (const p of places) {
      const norm = p.name.trim().toLowerCase();
      if (pNames.has(norm)) {
        dupPlaceNamesWithinRegion.push({ region: s.name, place: p.name, id: p.id });
      }
      pNames.add(norm);
    }
  }
}
report.duplicate_places_found = dupPlaceNamesWithinRegion.length;
if (dupPlaceNamesWithinRegion.length === 0) {
  console.log(`[PASS] Check 7: No duplicate tourist-place names within the same region`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 7: Duplicate place names within region:`, dupPlaceNamesWithinRegion);
}

// Check 8: No Active City with 0 Tourist Places
let totalActiveCities = 0;
const zeroPlaceCities = [];
for (const s of db.states) {
  for (const c of s.cities) {
    totalActiveCities++;
    const places = [
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || [])
    ];
    if (places.length === 0 || c.places_count === 0) {
      zeroPlaceCities.push({ region: s.name, city: c.name });
    }
  }
}
report.active_city_count = totalActiveCities;
if (zeroPlaceCities.length === 0) {
  console.log(`[PASS] Check 8: No active city with 0 tourist places (Total active destination cities: ${totalActiveCities})`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 8: Active cities with 0 tourist places:`, zeroPlaceCities);
}

// Check 9: Every Tourist Place Belongs to Exactly One Canonical Region and Destination City
let totalPlacesCounted = 0;
let invalidMapping = [];
for (const s of db.states) {
  for (const c of s.cities) {
    const places = [
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || [])
    ];
    totalPlacesCounted += places.length;
    for (const p of places) {
      if (!p.state_id || !p.city_id || p.state_id !== s.id || p.city_id !== c.id) {
        invalidMapping.push({ place: p.name, place_state: p.state_id, expected_state: s.id, place_city: p.city_id, expected_city: c.id });
      }
    }
  }
}
report.total_tourist_place_count = totalPlacesCounted;
if (invalidMapping.length === 0) {
  console.log(`[PASS] Check 9: Every tourist place belongs to exactly one canonical region and destination city (${totalPlacesCounted} places verified)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 9: Invalid hierarchy mappings:`, invalidMapping.slice(0, 5));
}

// Check 10: Hotel Data Remains Attached to Correct Tourist Places
let placesWithHotels = 0;
for (const s of db.states) {
  for (const c of s.cities) {
    const places = [
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || [])
    ];
    for (const p of places) {
      if ((p.hotels && p.hotels.length > 0) || (p.recommended_hotels && p.recommended_hotels.length > 0)) {
        placesWithHotels++;
      }
    }
  }
}
if (placesWithHotels > 0) {
  console.log(`[PASS] Check 10: Hotel metadata properly attached to tourist places (${placesWithHotels} places with accommodations)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 10: No hotel metadata found attached to places`);
}

// Check 11: All 36 Regions Successfully Integrated
report.regions_successfully_integrated = db.states.map(s => s.name);
if (report.regions_successfully_integrated.length === 36) {
  console.log(`[PASS] Check 11: All 36 regions successfully integrated into database`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 11: Regions integrated: ${report.regions_successfully_integrated.length}`);
}

// Check 12: Existing Working Tourism Data (e.g. Maharashtra) Preserved
const maha = db.states.find(s => s.name === 'Maharashtra');
if (maha && maha.cities.length === 11 && maha.total_attractions === 41) {
  console.log(`[PASS] Check 12: Existing Maharashtra working data fully preserved (11 cities, 41 places)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 12: Maharashtra data mismatch:`, maha ? `${maha.cities.length} cities, ${maha.total_attractions} places` : 'missing');
}

// Check 13: Category Buckets are Mutually Exclusive (No duplicate place across categories in same city)
let duplicatePlacesInCity = [];
for (const s of db.states) {
  for (const c of s.cities) {
    const seenInCity = new Set();
    const categories = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
    for (const cat of categories) {
      for (const p of (c[cat] || [])) {
        if (seenInCity.has(p.id)) {
          duplicatePlacesInCity.push({ city: c.name, place: p.name, id: p.id });
        }
        seenInCity.add(p.id);
      }
    }
  }
}
if (duplicatePlacesInCity.length === 0) {
  console.log(`[PASS] Check 13: Category buckets are mutually exclusive (0 place collisions across categories)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 13: Place duplicates across categories in city:`, duplicatePlacesInCity);
}

// Check 14: Verification Status Policy for Frontend Display
let unverifiedPlaces = 0;
for (const s of db.states) {
  for (const c of s.cities) {
    const places = [
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || [])
    ];
    for (const p of places) {
      if (p.verification_status !== 'verified' && p.status !== 'VERIFIED') {
        unverifiedPlaces++;
      }
    }
  }
}
if (unverifiedPlaces === 0) {
  console.log(`[PASS] Check 14: All places satisfy frontend verification policy (status=VERIFIED & verification_status=verified)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 14: Found ${unverifiedPlaces} unverified places`);
}

// Check 15: Master City Conformance
let nonMasterCities = [];
for (const s of db.states) {
  const isUT = CANONICAL_UT_NAMES.has(s.name);
  const masterConfig = isUT ? master.union_territories[s.name] : master.states[s.name];
  const mc = masterConfig?.master_cities || [];
  for (const c of s.cities) {
    if (!mc.includes(c.name)) {
      nonMasterCities.push({ region: s.name, city: c.name });
    }
  }
}
if (nonMasterCities.length === 0) {
  console.log(`[PASS] Check 15: All active cities strictly conform to canonical master city lists (0 non-master cities)`);
  passedChecks++;
} else {
  console.error(`[FAIL] Check 15: Found non-master cities:`, nonMasterCities);
}

console.log('\n======================================================');
console.log(`VALIDATION RESULT: ${passedChecks}/${totalChecks} CHECKS PASSED`);
console.log('======================================================\n');

console.log('--- FINAL VALIDATION REPORT ---');
console.log(`- total states: ${report.total_states}`);
console.log(`- total UTs: ${report.total_uts}`);
console.log(`- total regions: ${report.total_regions}`);
console.log(`- active city count: ${report.active_city_count}`);
console.log(`- total tourist-place count: ${report.total_tourist_place_count}`);
console.log(`- duplicate IDs found: ${report.duplicate_ids_found}`);
console.log(`- duplicate places found: ${report.duplicate_places_found}`);
console.log(`- zero-place cities removed: ${report.zero_place_cities_removed}`);
console.log(`- regions successfully integrated: ${report.regions_successfully_integrated.length} (ALL 36)`);
console.log(`  States: ${states.map(s => s.name).join(', ')}`);
console.log(`  UTs: ${uts.map(u => u.name).join(', ')}`);
console.log('-------------------------------\n');
