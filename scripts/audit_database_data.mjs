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

console.log('=== DATA AUDIT START ===\n');

// 1. Table row counts
console.log('--- 1. TABLE ROW COUNTS ---');
if (store) {
  for (const [table, rows] of Object.entries(store)) {
    console.log(`Table: ${table} -> ${Object.keys(rows).length} rows`);
  }
}

// 2. State & UT Coverage
console.log('\n--- 2. STATE & UT COVERAGE ---');
const statesList = Object.values(store?.states || statesJson);
console.log(`Total States/UTs in records: ${statesList.length}`);
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
console.log(`Missing Official States/UTs (${missingOfficialStates.length}):`, missingOfficialStates);

// 3. City Coverage
console.log('\n--- 3. CITY COVERAGE ---');
const citiesList = Object.values(store?.cities || citiesJson);
console.log(`Total Cities in records: ${citiesList.length}`);
const stateCityMap = {};
for (const c of citiesList) {
  const sId = c.state_id || 'unknown';
  stateCityMap[sId] = (stateCityMap[sId] || 0) + 1;
}
const statesWithNoCities = statesList.filter(s => !stateCityMap[s.id]);
console.log(`States/UTs with 0 cities (${statesWithNoCities.length}):`, statesWithNoCities.map(s => `${s.name} (${s.id})`));

// 4. Places per City
console.log('\n--- 4. PLACES PER CITY ---');
const placesList = Object.values(store?.places || masterPlacesJson);
console.log(`Total Places in records: ${placesList.length}`);
const cityPlacesCount = {};
for (const p of placesList) {
  const cId = p.city_id || p.city || 'unassigned';
  cityPlacesCount[cId] = (cityPlacesCount[cId] || 0) + 1;
}
const citiesWithNoPlaces = citiesList.filter(c => !cityPlacesCount[c.id]);
console.log(`Cities with 0 places in places table: ${citiesWithNoPlaces.length} out of ${citiesList.length}`);
const topCitiesByPlaces = Object.entries(cityPlacesCount).sort((a,b) => b[1] - a[1]).slice(0, 10);
console.log('Top 10 Cities by places count:', topCitiesByPlaces);

// 5. Cities missing Lat/Lng
console.log('\n--- 5. CITIES MISSING LAT/LNG ---');
const citiesMissingCoords = citiesList.filter(c => 
  c.latitude === undefined || c.latitude === null || isNaN(Number(c.latitude)) ||
  c.longitude === undefined || c.longitude === null || isNaN(Number(c.longitude)) ||
  (Number(c.latitude) === 0 && Number(c.longitude) === 0)
);
console.log(`Cities missing coordinates: ${citiesMissingCoords.length}`);
if (citiesMissingCoords.length > 0) {
  console.log('Sample missing coords cities:', citiesMissingCoords.slice(0, 5).map(c => c.name));
}

// 6. Places missing Lat/Lng
console.log('\n--- 6. PLACES MISSING LAT/LNG ---');
const placesMissingCoords = placesList.filter(p => {
  const lat = p.latitude ?? p.coordinates?.lat;
  const lng = p.longitude ?? p.coordinates?.lng;
  return lat === undefined || lat === null || isNaN(Number(lat)) ||
         lng === undefined || lng === null || isNaN(Number(lng)) ||
         (Number(lat) === 0 && Number(lng) === 0);
});
console.log(`Places missing coordinates: ${placesMissingCoords.length} / ${placesList.length}`);
if (placesMissingCoords.length > 0) {
  console.log('Sample places missing coords:', placesMissingCoords.slice(0, 5).map(p => `${p.name} (${p.id})`));
}

// 7. Cities missing Images
console.log('\n--- 7. CITIES MISSING IMAGES ---');
const citiesMissingImage = citiesList.filter(c => !c.image_url && !c.hero_image_url && !c.hero_image);
console.log(`Cities missing images: ${citiesMissingImage.length} / ${citiesList.length}`);

// 8. Places missing Images
console.log('\n--- 8. PLACES MISSING IMAGES ---');
const placesMissingImage = placesList.filter(p => !p.image_url && !p.hero_image_url && !p.hero_image);
console.log(`Places missing images: ${placesMissingImage.length} / ${placesList.length}`);

// 9. Places / Cities missing Tourism Facts
console.log('\n--- 9. TOURISM FACTS COVERAGE ---');
const factsInStore = store?.place_facts ? Object.values(store.place_facts) : [];
console.log(`Total Place Facts in store: ${factsInStore.length}`);
const placesWithFacts = new Set(factsInStore.map(f => f.place_id));
const placesMissingFacts = placesList.filter(p => !placesWithFacts.has(p.id));
console.log(`Places without associated place_facts: ${placesMissingFacts.length} / ${placesList.length}`);

// 10 & 11. Hotels & City Relationships
console.log('\n--- 10 & 11. HOTELS & CITY RELATIONSHIPS ---');
console.log(`Hotels in hotels.json: ${hotelsJson.length}`);
const hotelsByCity = {};
for (const h of hotelsJson) {
  hotelsByCity[h.city] = (hotelsByCity[h.city] || 0) + 1;
}
console.log('hotels.json breakdown by city:', hotelsByCity);

let embeddedHotelsCount = 0;
const embeddedHotelsByCity = {};
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
          embeddedHotelsCount += p.hotels.length;
          embeddedHotelsByCity[c.name] = (embeddedHotelsByCity[c.name] || 0) + p.hotels.length;
        }
      }
    }
  }
}
console.log(`Total embedded hotels in india_tourism_database.json: ${embeddedHotelsCount}`);
console.log(`Cities with embedded hotels in india_tourism_database.json: ${Object.keys(embeddedHotelsByCity).length}`);
console.log('Sample embedded hotel cities:', Object.entries(embeddedHotelsByCity).slice(0, 10));

// 12. Festivals & Culture Relationships
console.log('\n--- 12. FESTIVALS & CULTURE RELATIONSHIPS ---');
if (cultureJson) {
  console.log(`Items in culture.json: ${cultureJson.length || Object.keys(cultureJson).length}`);
  const sample = Array.isArray(cultureJson) ? cultureJson.slice(0, 3) : Object.values(cultureJson).slice(0, 3);
  console.log('Culture sample:', sample);
} else {
  console.log('culture.json not present or empty');
}

// 13. Transit Nodes & City Relationships
console.log('\n--- 13. TRANSIT NODES & CITY RELATIONSHIPS ---');
const transitList = Object.values(store?.transit_nodes || stationsJson);
console.log(`Total Transit Nodes: ${transitList.length}`);
const transitByCity = {};
for (const t of transitList) {
  const c = t.city || t.city_id || 'unknown';
  transitByCity[c] = (transitByCity[c] || 0) + 1;
}
console.log(`Unique cities represented in transit nodes: ${Object.keys(transitByCity).length}`);
console.log('Transit nodes by city (first 10):', Object.entries(transitByCity).slice(0, 10));

// 14. Duplicate Cities
console.log('\n--- 14. DUPLICATE CITIES ---');
const cityNameCount = {};
for (const c of citiesList) {
  const nameNorm = c.name.toLowerCase().trim();
  cityNameCount[nameNorm] = (cityNameCount[nameNorm] || []).concat(c.id);
}
const dupCities = Object.entries(cityNameCount).filter(([_, ids]) => ids.length > 1);
console.log(`Duplicate City names (${dupCities.length}):`, dupCities);

// 15. Duplicate Places
console.log('\n--- 15. DUPLICATE PLACES ---');
const placeNameCount = {};
for (const p of placesList) {
  const norm = `${p.name.toLowerCase().trim()}__${(p.city_id || p.city || '').toLowerCase().trim()}`;
  placeNameCount[norm] = (placeNameCount[norm] || []).concat(p.id);
}
const dupPlaces = Object.entries(placeNameCount).filter(([_, ids]) => ids.length > 1);
console.log(`Duplicate Places in same city (${dupPlaces.length}):`);
if (dupPlaces.length > 0) {
  console.log(dupPlaces.slice(0, 5));
}

// 16. Duplicate Image URLs
console.log('\n--- 16. DUPLICATE IMAGE URLS ---');
const imageUrlCounts = {};
for (const p of placesList) {
  const url = p.image_url || p.hero_image_url || p.hero_image;
  if (url && typeof url === 'string') {
    imageUrlCounts[url] = (imageUrlCounts[url] || []).concat(p.id);
  }
}
const dupImages = Object.entries(imageUrlCounts).filter(([_, ids]) => ids.length > 1);
console.log(`Total unique image URLs in places: ${Object.keys(imageUrlCounts).length}`);
console.log(`Image URLs shared across multiple places: ${dupImages.length}`);
if (dupImages.length > 0) {
  console.log('Sample shared image URLs:', dupImages.slice(0, 3).map(([url, ids]) => ({ url: url.slice(0, 60), placeCount: ids.length, places: ids.slice(0, 3) })));
}

// 17. Orphaned Records
console.log('\n--- 17. ORPHANED RECORDS ---');
const stateIdSet = new Set(statesList.map(s => s.id.toLowerCase().trim()));
const cityIdSet = new Set(citiesList.map(c => c.id.toLowerCase().trim()));

const orphanedCities = citiesList.filter(c => !stateIdSet.has((c.state_id || '').toLowerCase().trim()));
console.log(`Cities referencing non-existent state_id: ${orphanedCities.length}`);
if (orphanedCities.length > 0) {
  console.log('Sample orphaned cities:', orphanedCities.slice(0, 5).map(c => `${c.name} (state_id: ${c.state_id})`));
}

const orphanedPlaces = placesList.filter(p => !cityIdSet.has((p.city_id || '').toLowerCase().trim()));
console.log(`Places referencing non-existent city_id: ${orphanedPlaces.length}`);
if (orphanedPlaces.length > 0) {
  console.log('Sample orphaned places:', orphanedPlaces.slice(0, 5).map(p => `${p.name} (city_id: ${p.city_id})`));
}

const orphanedTransit = transitList.filter(t => {
  const cId = (t.city_id || t.city || '').toLowerCase().trim();
  return !cityIdSet.has(cId);
});
console.log(`Transit nodes referencing non-existent city: ${orphanedTransit.length}`);
if (orphanedTransit.length > 0) {
  console.log('Sample transit with unmapped city_id:', orphanedTransit.slice(0, 5).map(t => `${t.name} (city: ${t.city || t.city_id})`));
}

// 18. Specific Transport Inspection for Mumbai, CSMT, Kolkata, Howrah, Patna
console.log('\n--- 18. TRANSPORT DATA INSPECTION ---');
const targetKeywords = ['mumbai', 'csmt', 'kolkata', 'howrah', 'patna'];
for (const kw of targetKeywords) {
  const matchingTransit = transitList.filter(t => 
    (t.name || '').toLowerCase().includes(kw) ||
    (t.code || '').toLowerCase().includes(kw) ||
    (t.city || '').toLowerCase().includes(kw) ||
    (t.city_id || '').toLowerCase().includes(kw)
  );
  console.log(`Transit nodes matching "${kw}" (${matchingTransit.length}):`);
  for (const m of matchingTransit) {
    console.log(`  - [${m.code || m.id}] ${m.name} | City: ${m.city || m.city_id} | Type: ${m.type || m.mode || 'rail'} | Coords: ${m.latitude}, ${m.longitude}`);
  }
}

// 19. Existing Sources & Licenses
console.log('\n--- 19. SOURCES & LICENSES ---');
if (store?.place_sources) {
  console.log(`Total Place Sources in store: ${Object.keys(store.place_sources).length}`);
  console.log(Object.values(store.place_sources).map(s => `${s.id}: ${s.source_name} (${s.source_type})`));
}
if (store?.image_licenses) {
  console.log(`Total Image Licenses in store: ${Object.keys(store.image_licenses).length}`);
  const licenses = Object.values(store.image_licenses);
  const licenseTypes = {};
  for (const l of licenses) {
    licenseTypes[l.license_type || l.license || 'unknown'] = (licenseTypes[l.license_type || l.license || 'unknown'] || 0) + 1;
  }
  console.log('Image license types:', licenseTypes);
}
if (imageRegistry) {
  console.log(`Sources in tourism_image_source_registry.json: ${imageRegistry.sources?.length || Object.keys(imageRegistry).length}`);
}

console.log('\n=== DATA AUDIT COMPLETE ===');
