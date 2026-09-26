import fs from 'fs';
import path from 'path';

const storePath = path.resolve('data/.database/virasat_store.json');
const store = fs.existsSync(storePath) ? JSON.parse(fs.readFileSync(storePath, 'utf8')) : null;

const statesJson = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
const citiesJson = JSON.parse(fs.readFileSync('data/cities.json', 'utf8'));
const masterPlacesJson = JSON.parse(fs.readFileSync('data/master_tourism_places.json', 'utf8'));
const hotelsJson = JSON.parse(fs.readFileSync('data/hotels.json', 'utf8'));
const stationsJson = JSON.parse(fs.readFileSync('data/railway_stations.json', 'utf8'));
const cultureJson = fs.existsSync('data/culture.json') ? JSON.parse(fs.readFileSync('data/culture.json', 'utf8')) : null;
const dbTourism = fs.existsSync('data/india_tourism_database.json') ? JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8')) : null;
const imageRegistry = fs.existsSync('data/tourism_image_source_registry.json') ? JSON.parse(fs.readFileSync('data/tourism_image_source_registry.json', 'utf8')) : null;
const tourismImages = fs.existsSync('data/tourism_images.json') ? JSON.parse(fs.readFileSync('data/tourism_images.json', 'utf8')) : null;

console.log('================================================================');
console.log('=== VIRASAT DETAILED DATABASE & DATA AUDIT ===');
console.log('================================================================\n');

// 1. All tourism-related tables and row counts in active database store
console.log('### 1. TOURISM-RELATED TABLES AND ROW COUNTS');
if (store) {
  for (const [table, rows] of Object.entries(store)) {
    console.log(`  - Table: "${table}": ${Object.keys(rows).length} rows`);
  }
} else {
  console.log('  Local virasat_store.json not found');
}

// 2. State and UT coverage
console.log('\n### 2. STATE AND UT COVERAGE');
const statesList = Object.values(store?.states || statesJson);
console.log(`  Total States/UTs in database: ${statesList.length}`);
const officialIndianStatesAndUTs = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];
const recordedStateNames = statesList.map(s => s.name);
const missingOfficialStates = officialIndianStatesAndUTs.filter(s => 
  !recordedStateNames.some(rn => rn.toLowerCase().trim() === s.toLowerCase().trim())
);
console.log(`  Official 28 States + 8 UTs total: 36`);
console.log(`  Recorded in DB: ${statesList.length}`);
console.log(`  Missing Official States/UTs: ${missingOfficialStates.length === 0 ? 'None (100% full coverage of all 28 states & 8 UTs)' : missingOfficialStates.join(', ')}`);

// 3. City coverage
console.log('\n### 3. CITY COVERAGE');
const citiesList = Object.values(store?.cities || citiesJson);
console.log(`  Total Cities in database: ${citiesList.length}`);
const stateCityMap = {};
for (const c of citiesList) {
  const sId = c.state_id || 'unknown';
  stateCityMap[sId] = (stateCityMap[sId] || 0) + 1;
}
const statesWithNoCities = statesList.filter(s => !stateCityMap[s.id]);
console.log(`  States/UTs with 0 cities: ${statesWithNoCities.length}`);
const stateCityCounts = statesList.map(s => ({ state: s.name, id: s.id, count: stateCityMap[s.id] || 0 }));
console.log(`  Min cities per state: ${Math.min(...stateCityCounts.map(x => x.count))}, Max: ${Math.max(...stateCityCounts.map(x => x.count))}`);

// 4. Number of places per city
console.log('\n### 4. NUMBER OF PLACES PER CITY');
const placesList = Object.values(store?.places || masterPlacesJson);
console.log(`  Total Places in database: ${placesList.length}`);
const cityPlacesCount = {};
for (const p of placesList) {
  const cId = p.city_id || p.city || 'unassigned';
  cityPlacesCount[cId] = (cityPlacesCount[cId] || 0) + 1;
}
const citiesWithNoPlaces = citiesList.filter(c => !cityPlacesCount[c.id]);
console.log(`  Cities with 0 places: ${citiesWithNoPlaces.length} out of ${citiesList.length}`);
const sortedPlacesPerCity = Object.entries(cityPlacesCount).sort((a,b) => b[1] - a[1]);
console.log('  Top 10 Cities with most places:');
for (const [cId, count] of sortedPlacesPerCity.slice(0, 10)) {
  const cName = citiesList.find(c => c.id === cId)?.name || cId;
  console.log(`    - ${cName} (${cId}): ${count} places`);
}

// 5. Cities missing latitude/longitude
console.log('\n### 5. CITIES MISSING LATITUDE / LONGITUDE');
const citiesMissingCoords = citiesList.filter(c => {
  const lat = c.lat ?? c.latitude ?? c.coordinates?.lat;
  const lng = c.lng ?? c.longitude ?? c.coordinates?.lng;
  return lat === undefined || lat === null || isNaN(Number(lat)) ||
         lng === undefined || lng === null || isNaN(Number(lng)) ||
         (Number(lat) === 0 && Number(lng) === 0);
});
console.log(`  Cities missing valid lat/lng coordinates: ${citiesMissingCoords.length} / ${citiesList.length}`);
if (citiesMissingCoords.length > 0) {
  for (const c of citiesMissingCoords) {
    console.log(`    - ${c.name} (${c.id}): lat=${c.lat}, lng=${c.lng}`);
  }
}

// 6. Places missing latitude/longitude
console.log('\n### 6. PLACES MISSING LATITUDE / LONGITUDE');
const placesMissingCoords = placesList.filter(p => {
  const lat = p.lat ?? p.latitude ?? p.coordinates?.lat;
  const lng = p.lng ?? p.longitude ?? p.coordinates?.lng;
  return lat === undefined || lat === null || isNaN(Number(lat)) ||
         lng === undefined || lng === null || isNaN(Number(lng)) ||
         (Number(lat) === 0 && Number(lng) === 0);
});
console.log(`  Places missing valid lat/lng coordinates: ${placesMissingCoords.length} / ${placesList.length}`);
if (placesMissingCoords.length > 0) {
  for (const p of placesMissingCoords.slice(0, 10)) {
    console.log(`    - ${p.name} (${p.id}): lat=${p.lat}, lng=${p.lng}`);
  }
}

// 7. Cities missing images
console.log('\n### 7. CITIES MISSING IMAGES');
const citiesMissingImage = citiesList.filter(c => {
  const img = c.hero_image_url || c.hero_image || c.image_url || c.thumbnail_url;
  return !img || (typeof img === 'string' && img.trim() === '');
});
console.log(`  Cities missing hero/display image: ${citiesMissingImage.length} / ${citiesList.length}`);
if (citiesMissingImage.length > 0) {
  for (const c of citiesMissingImage.slice(0, 5)) {
    console.log(`    - ${c.name} (${c.id})`);
  }
}

// 8. Places missing images
console.log('\n### 8. PLACES MISSING IMAGES');
const placesMissingImage = placesList.filter(p => {
  const img = p.thumbnail_url || p.image_url || p.hero_image_url || p.hero_image || p.imageUrl;
  return !img || (typeof img === 'string' && img.trim() === '');
});
console.log(`  Places missing image/thumbnail: ${placesMissingImage.length} / ${placesList.length}`);
if (placesMissingImage.length > 0) {
  for (const p of placesMissingImage.slice(0, 5)) {
    console.log(`    - ${p.name} (${p.id})`);
  }
}

// 9. Cities / Places missing tourism facts
console.log('\n### 9. TOURISM FACTS COVERAGE');
const factsInStore = store?.place_facts ? Object.values(store.place_facts) : [];
console.log(`  Total Place Facts rows in database: ${factsInStore.length}`);
const placesWithFacts = new Set(factsInStore.map(f => f.place_id));
const placesWithoutFacts = placesList.filter(p => !placesWithFacts.has(p.id));
console.log(`  Places without rows in place_facts table: ${placesWithoutFacts.length} / ${placesList.length}`);
// Check if cities have facts or descriptions
const citiesMissingDesc = citiesList.filter(c => !c.description && !c.short_description);
console.log(`  Cities missing descriptive text/facts: ${citiesMissingDesc.length} / ${citiesList.length}`);

// 10 & 11. Hotels and their city relationships
console.log('\n### 10 & 11. HOTELS AND CITY RELATIONSHIPS');
console.log(`  Hotels in standalone data/hotels.json: ${hotelsJson.length}`);
const cityIdMap = new Map(citiesList.map(c => [c.id.toLowerCase().trim(), c]));
const cityNameMap = new Map(citiesList.map(c => [c.name.toLowerCase().trim(), c]));

const hotelsInJsonSummary = hotelsJson.map(h => {
  const cityMatch = cityNameMap.get((h.city || '').toLowerCase().trim()) || cityIdMap.get((h.city || '').toLowerCase().trim());
  return {
    id: h.id,
    name: h.name,
    cityDeclared: h.city,
    matchedCityInDb: cityMatch ? `${cityMatch.name} (${cityMatch.id})` : 'NOT FOUND IN CITIES TABLE',
    valid: Boolean(cityMatch)
  };
});
const invalidCityHotels = hotelsInJsonSummary.filter(h => !h.valid);
console.log(`  Hotels in hotels.json with unresolved city: ${invalidCityHotels.length}`);
for (const h of invalidCityHotels) {
  console.log(`    - Hotel "${h.name}" declared city "${h.cityDeclared}" -> Not found in cities table!`);
}

// Embedded hotels in india_tourism_database.json
let totalEmbeddedHotels = 0;
let embeddedHotelsMismatchCity = 0;
if (dbTourism) {
  for (const s of dbTourism.states || []) {
    for (const c of s.cities || []) {
      const places = [
        ...(c.heritage || []),
        ...(c.monuments || []),
        ...(c.museums || []),
        ...(c.tourist_places || []),
        ...(c.religious_cultural || []),
        ...(c.nature_parks_zoo || []),
      ];
      for (const p of places) {
        if (p.hotels && Array.isArray(p.hotels)) {
          totalEmbeddedHotels += p.hotels.length;
          for (const ph of p.hotels) {
            // Check if hotel name or area indicates another city
            if (ph.area && !ph.area.toLowerCase().includes(c.name.toLowerCase()) && !c.name.toLowerCase().includes(ph.area.toLowerCase())) {
              // Potential mismatch
            }
          }
        }
      }
    }
  }
}
console.log(`  Total embedded hotels across all cities in india_tourism_database.json: ${totalEmbeddedHotels}`);

// 12. Festivals and culture relationships
console.log('\n### 12. FESTIVALS AND CULTURE RELATIONSHIPS');
if (cultureJson) {
  const items = Array.isArray(cultureJson) ? cultureJson : Object.values(cultureJson);
  console.log(`  Total Culture / Festival items: ${items.length}`);
  for (const item of items) {
    const cityMatch = item.city ? (cityNameMap.get(item.city.toLowerCase().trim()) || cityIdMap.get(item.city.toLowerCase().trim())) : null;
    const stateMatch = item.state ? statesList.find(s => s.name.toLowerCase().trim() === item.state.toLowerCase().trim() || s.id === item.state.toLowerCase().trim()) : null;
    console.log(`    - "${item.name}" (${item.category}): City="${item.city}" [${cityMatch ? 'VALID' : 'UNMAPPED'}], State="${item.state}" [${stateMatch ? 'VALID' : 'UNMAPPED'}]`);
  }
} else {
  console.log('  culture.json does not exist');
}

// 13. Transit nodes and city relationships
console.log('\n### 13. TRANSIT NODES AND CITY RELATIONSHIPS');
const transitList = Object.values(store?.transit_nodes || stationsJson);
console.log(`  Total Transit Nodes: ${transitList.length}`);
const sampleTransit = transitList.slice(0, 3);
console.log('  Transit sample keys:', Object.keys(sampleTransit[0] || {}));
const unmappedTransit = [];
const mappedTransit = [];
for (const t of transitList) {
  // Check how city is identified
  const cIdentifier = t.city_id || t.city || t.city_name;
  const match = cIdentifier ? (cityIdMap.get(cIdentifier.toLowerCase().trim()) || cityNameMap.get(cIdentifier.toLowerCase().trim())) : null;
  if (match) {
    mappedTransit.push({ t, match });
  } else {
    unmappedTransit.push(t);
  }
}
console.log(`  Transit nodes properly mapped to cities: ${mappedTransit.length} / ${transitList.length}`);
console.log(`  Transit nodes with missing/unresolved city_id: ${unmappedTransit.length} / ${transitList.length}`);
console.log('  Sample unmapped transit nodes:');
for (const t of unmappedTransit.slice(0, 5)) {
  console.log(`    - Code: ${t.code}, Name: "${t.name}", city field: ${t.city}, city_id field: ${t.city_id}`);
}

// 14. Duplicate cities
console.log('\n### 14. DUPLICATE CITIES');
const cityNamesNormalized = {};
for (const c of citiesList) {
  const norm = c.name.toLowerCase().trim();
  cityNamesNormalized[norm] = (cityNamesNormalized[norm] || []).concat(c);
}
const duplicateCities = Object.entries(cityNamesNormalized).filter(([_, list]) => list.length > 1);
console.log(`  Duplicate city names: ${duplicateCities.length}`);
for (const [name, list] of duplicateCities) {
  console.log(`    - "${name}": IDs [${list.map(c => c.id).join(', ')}] in states [${list.map(c => c.state_id).join(', ')}]`);
}

// 15. Duplicate places
console.log('\n### 15. DUPLICATE PLACES');
const placeNamesInCity = {};
for (const p of placesList) {
  const key = `${p.name.toLowerCase().trim()}__${(p.city_id || '').toLowerCase().trim()}`;
  placeNamesInCity[key] = (placeNamesInCity[key] || []).concat(p);
}
const duplicatePlacesInCity = Object.entries(placeNamesInCity).filter(([_, list]) => list.length > 1);
console.log(`  Duplicate places within same city: ${duplicatePlacesInCity.length}`);
for (const [key, list] of duplicatePlacesInCity.slice(0, 5)) {
  console.log(`    - "${list[0].name}" in city "${list[0].city_id}": IDs [${list.map(p => p.id).join(', ')}]`);
}

// Also check overall duplicate place names across India
const placeNamesOverall = {};
for (const p of placesList) {
  const key = p.name.toLowerCase().trim();
  placeNamesOverall[key] = (placeNamesOverall[key] || []).concat(p);
}
const dupOverallPlaces = Object.entries(placeNamesOverall).filter(([_, list]) => list.length > 1);
console.log(`  Places with identical name in different cities/regions: ${dupOverallPlaces.length}`);
for (const [key, list] of dupOverallPlaces.slice(0, 5)) {
  console.log(`    - "${list[0].name}": in cities [${list.map(p => p.city_id).join(', ')}]`);
}

// 16. Duplicate image URLs
console.log('\n### 16. DUPLICATE IMAGE URLS');
const imageUrlTracker = {};
for (const p of placesList) {
  const img = p.thumbnail_url || p.image_url || p.hero_image_url;
  if (img && typeof img === 'string') {
    imageUrlTracker[img] = (imageUrlTracker[img] || []).concat(p.id);
  }
}
const duplicateImages = Object.entries(imageUrlTracker).filter(([_, ids]) => ids.length > 1);
console.log(`  Unique image URLs in places: ${Object.keys(imageUrlTracker).length}`);
console.log(`  Image URLs reused across multiple places: ${duplicateImages.length}`);
console.log('  Top reused image URLs:');
const sortedDupImages = duplicateImages.sort((a,b) => b[1].length - a[1].length);
for (const [url, ids] of sortedDupImages.slice(0, 5)) {
  console.log(`    - Reused ${ids.length} times: ${url.slice(0, 75)}...`);
  console.log(`      Places: [${ids.slice(0, 4).join(', ')}${ids.length > 4 ? '...' : ''}]`);
}

// 17. Orphaned records
console.log('\n### 17. ORPHANED RECORDS');
const stateIds = new Set(statesList.map(s => s.id.toLowerCase().trim()));
const cityIds = new Set(citiesList.map(c => c.id.toLowerCase().trim()));

const orphanedCities = citiesList.filter(c => !stateIds.has((c.state_id || '').toLowerCase().trim()));
console.log(`  Cities referencing non-existent state_id: ${orphanedCities.length}`);
for (const c of orphanedCities) {
  console.log(`    - City: ${c.name} (${c.id}) -> Unknown state_id: "${c.state_id}"`);
}

const orphanedPlaces = placesList.filter(p => !cityIds.has((p.city_id || '').toLowerCase().trim()));
console.log(`  Places referencing non-existent city_id: ${orphanedPlaces.length}`);
for (const p of orphanedPlaces) {
  console.log(`    - Place: "${p.name}" (${p.id}) -> Unknown city_id: "${p.city_id}"`);
}

const orphanedPlaceFacts = factsInStore.filter(f => !placesList.some(p => p.id === f.place_id));
console.log(`  Place facts referencing non-existent place_id: ${orphanedPlaceFacts.length}`);

// 18. Records associated with wrong city
console.log('\n### 18. RECORDS ASSOCIATED WITH WRONG CITY / STATE_AS_CITY');
// Check places where city_id is actually a state_id
const placesWithStateAsCity = placesList.filter(p => {
  const cId = (p.city_id || '').toLowerCase().trim();
  return stateIds.has(cId) && !cityIds.has(cId);
});
console.log(`  Places where city_id is a state_id (e.g. city_id="goa", "delhi", "chandigarh", "puducherry"): ${placesWithStateAsCity.length}`);
for (const p of placesWithStateAsCity.slice(0, 10)) {
  console.log(`    - "${p.name}" (${p.id}) has city_id="${p.city_id}" (State/UT level assignment)`);
}

// Geographic distance check between place coordinates and assigned city coordinates
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const severeGeoMismatches = [];
for (const p of placesList) {
  const c = cityIdMap.get((p.city_id || '').toLowerCase().trim());
  if (c && c.lat && c.lng && p.lat && p.lng) {
    const dist = getDistanceKm(Number(p.lat), Number(p.lng), Number(c.lat), Number(c.lng));
    if (dist > 80) { // More than 80km from assigned city center
      severeGeoMismatches.push({ place: p, city: c, dist: Math.round(dist) });
    }
  }
}
console.log(`  Places with coordinates >80km from assigned city center: ${severeGeoMismatches.length}`);
for (const m of severeGeoMismatches.slice(0, 10)) {
  console.log(`    - "${m.place.name}" (${m.place.id}) assigned to City "${m.city.name}" (${m.city.id}) is ${m.dist} km away!`);
}

// 19. Existing Sources & Licenses
console.log('\n### 19. EXISTING SOURCES AND LICENSES');
if (store?.place_sources) {
  console.log(`  Total place_sources records: ${Object.keys(store.place_sources).length}`);
  for (const s of Object.values(store.place_sources)) {
    console.log(`    - ${s.id}: "${s.source_name}" | Type: ${s.source_type} | URL: ${s.source_url || 'None'}`);
  }
}
if (store?.image_licenses) {
  console.log(`  Total image_licenses records: ${Object.keys(store.image_licenses).length}`);
  const sampleLicenses = Object.values(store.image_licenses).slice(0, 3);
  for (const l of sampleLicenses) {
    console.log(`    - License ID: ${l.id} | Place: ${l.place_id} | License: ${l.license_type} | Attrib: ${l.attribution}`);
  }
}

// Transport data inspection for Mumbai, CSMT, Kolkata, Howrah, Patna
console.log('\n### TRANSPORT DATA INSPECTION: MUMBAI, CSMT, KOLKATA, HOWRAH, PATNA');
const transportNodes = Object.values(store?.transit_nodes || stationsJson);
const targetStations = ['mumbai', 'csmt', 'kolkata', 'howrah', 'patna'];
for (const target of targetStations) {
  const found = transportNodes.filter(t => 
    (t.name || '').toLowerCase().includes(target) ||
    (t.code || '').toLowerCase().includes(target) ||
    (t.city || '').toLowerCase().includes(target) ||
    (t.city_id || '').toLowerCase().includes(target)
  );
  console.log(`  Query "${target}": Found ${found.length} node(s)`);
  for (const n of found) {
    console.log(`    - Code: ${n.code} | Name: "${n.name}" | City: ${n.city || 'UNDEFINED'} | City_id: ${n.city_id || 'UNDEFINED'} | State: ${n.state || 'UNDEFINED'} | Coords: [${n.lat || n.latitude}, ${n.lng || n.longitude}]`);
  }
}

console.log('\n================================================================');
console.log('=== AUDIT COMPLETE ===');
console.log('================================================================');
