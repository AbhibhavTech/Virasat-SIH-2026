import fs from 'fs';
import path from 'path';

const rootDataDir = path.resolve('data');
const statesPath = path.join(rootDataDir, 'states.json');
const citiesPath = path.join(rootDataDir, 'cities.json');
const itdbPath = path.join(rootDataDir, 'india_tourism_database.json');
const storePath = path.join(rootDataDir, '.database', 'virasat_store.json');
const monumentsPath = path.join(rootDataDir, 'heritage', 'monuments.json');

const states = JSON.parse(fs.readFileSync(statesPath, 'utf8'));
const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
const itdb = JSON.parse(fs.readFileSync(itdbPath, 'utf8'));
const vstore = fs.existsSync(storePath) ? JSON.parse(fs.readFileSync(storePath, 'utf8')) : { places: {}, cities: {}, states: {} };
const monuments = fs.existsSync(monumentsPath) ? JSON.parse(fs.readFileSync(monumentsPath, 'utf8')) : [];

console.log('=====================================================');
console.log('   VIRASAT STEP 1: COMPREHENSIVE REPOSITORY AUDIT   ');
console.log('=====================================================\n');

// 1. GEOGRAPHY
const stateRecords = states.filter(s => s.region_type === 'state');
const utRecords = states.filter(s => s.region_type === 'union_territory');
const unknownRegionType = states.filter(s => s.region_type !== 'state' && s.region_type !== 'union_territory');

console.log('--- SECTION 1: GEOGRAPHIC FOUNDATION ---');
console.log(`Total States: ${stateRecords.length} / 28`);
console.log(`Total Union Territories: ${utRecords.length} / 8`);
console.log(`Total Regions: ${states.length} / 36`);
console.log(`Region Type Separation: ${unknownRegionType.length === 0 ? 'CLEAN (0 invalid)' : 'FAILED'}`);

// 2. CITIES
console.log('\n--- SECTION 2: CITIES & LOCALITIES ---');
console.log(`Total Cities in cities.json: ${cities.length}`);

// Check canonical names
const canonicalCheck = [
  'Chhatrapati Sambhaji Nagar',
  'Junagadh',
  'Mysuru',
  'Udupi',
  'Reckong Peo',
  'Sri Vijaya Puram',
  'Puducherry'
];
console.log('Canonical Name Audit:');
for (const cName of canonicalCheck) {
  const found = cities.find(c => c.name.toLowerCase() === cName.toLowerCase() || c.canonical_name?.toLowerCase() === cName.toLowerCase());
  console.log(`  - ${cName}: ${found ? `OK (id: "${found.id}")` : 'MISSING'}`);
}

// Check old variants
const oldVariants = ['Aurangabad', 'Mysore', 'Port Blair', 'Pondicherry', 'Reckongpeo'];
for (const old of oldVariants) {
  const found = cities.filter(c => c.name.toLowerCase() === old.toLowerCase());
  if (found.length > 0) {
    console.log(`  ! Non-canonical name in use: "${old}"`);
  }
}

// 3. PROBLEMATIC PATTERNS (Section 5)
console.log('\n--- SECTION 3: SECTION 5 PROBLEMATIC PATTERNS ---');
// Raipur
const raipurPlaces = Object.values(vstore.places || {}).filter(p => p.city_id === 'raipur');
console.log(`Raipur city records: ${cities.filter(c => c.name.toLowerCase() === 'raipur').length} (State: ${cities.find(c => c.name.toLowerCase() === 'raipur')?.state})`);
console.log(`Raipur places count: ${raipurPlaces.length}`);
raipurPlaces.forEach(p => console.log(`  * [${p.id}] ${p.name} (Source: ${p.source_url})`));

// Dehradun
const dehradunPlaces = Object.values(vstore.places || {}).filter(p => p.city_id === 'dehradun');
console.log(`Dehradun city records: ${cities.filter(c => c.name.toLowerCase() === 'dehradun').length} (State: ${cities.find(c => c.name.toLowerCase() === 'dehradun')?.state})`);
console.log(`Dehradun places count: ${dehradunPlaces.length}`);
dehradunPlaces.forEach(p => console.log(`  * [${p.id}] ${p.name} (Source: ${p.source_url})`));

// Chandigarh
const chStates = states.filter(s => s.name.toLowerCase() === 'chandigarh');
const chCities = cities.filter(c => c.name.toLowerCase() === 'chandigarh');
console.log(`Chandigarh UT entity: ${chStates.length} in states.json (type: ${chStates[0]?.region_type})`);
console.log(`Chandigarh City entity: ${chCities.length} in cities.json (state: ${chCities[0]?.state})`);
console.log(`Haryana capital: ${states.find(s => s.id === 'haryana')?.capital}`);
console.log(`Punjab capital: ${states.find(s => s.id === 'punjab')?.capital}`);

// Hampi / Hosapete
const hampiCity = cities.find(c => c.id === 'hampi');
const hampiPlaces = Object.values(vstore.places || {}).filter(p => p.city_id === 'hampi' || p.name.toLowerCase().includes('hampi'));
console.log(`Hampi city entity: ${hampiCity ? `id: ${hampiCity.id}, district: ${hampiCity.district}` : 'MISSING'}`);
console.log(`Hampi places:`, hampiPlaces.map(p => `[${p.id}] "${p.name}" -> city_id: ${p.city_id}, state_id: ${p.state_id}`));

// Palampet / Ramappa
const ramappaPlaces = Object.values(vstore.places || {}).filter(p => p.name.toLowerCase().includes('ramappa') || p.id.includes('ramappa'));
console.log(`Palampet / Ramappa places:`, ramappaPlaces.map(p => `[${p.id}] "${p.name}" -> city_id: ${p.city_id}, state_id: ${p.state_id}`));

// Pelling / Rabdentse
const pellingCity = cities.find(c => c.id === 'pelling');
const pellingPlaces = Object.values(vstore.places || {}).filter(p => p.city_id === 'pelling' || p.name.toLowerCase().includes('pelling'));
console.log(`Pelling city entity: ${pellingCity ? `id: ${pellingCity.id}, district: ${pellingCity.district}` : 'MISSING'}`);
console.log(`Pelling places:`, pellingPlaces.map(p => `[${p.id}] "${p.name}" -> city_id: ${p.city_id}`));

// 4. TOURIST PLACES COVERAGE & QUALITY
console.log('\n--- SECTION 4: TOURIST PLACES INVENTORY & DISTRIBUTION ---');
const vstorePlaces = Object.values(vstore.places || {});
console.log(`Total Places in virasat_store.json: ${vstorePlaces.length}`);
console.log(`Total Curated Monuments: ${monuments.length}`);

// Detect synthetic generic placeholders
const syntheticPlaces = vstorePlaces.filter(p =>
  p.id.includes('historic-monument-gateway') ||
  p.id.includes('sacred-temple-cultural-center') ||
  p.id.includes('scenic-promenade-viewpoint') ||
  p.id.includes('heritage-fort-complex') ||
  p.id.includes('state-museum-heritage-gallery') ||
  p.id.includes('national-wildlife-botanical-park') ||
  p.id.includes('monument-health-test')
);
console.log(`Synthetic / Placeholder Pattern Places in vstore: ${syntheticPlaces.length}`);

// City place count breakdown
const cityCoverageMap = {};
for (const c of cities) {
  cityCoverageMap[c.id] = { id: c.id, name: c.name, state: c.state, state_id: c.state_id, count: 0 };
}
for (const p of vstorePlaces) {
  if (p.city_id && cityCoverageMap[p.city_id]) {
    cityCoverageMap[p.city_id].count++;
  }
}

const citiesWithZero = Object.values(cityCoverageMap).filter(c => c.count === 0);
const citiesWithPlaces = Object.values(cityCoverageMap).filter(c => c.count > 0);
console.log(`Cities with at least 1 place: ${citiesWithPlaces.length} / 257 (${((citiesWithPlaces.length/257)*100).toFixed(1)}%)`);
console.log(`Cities with ZERO places: ${citiesWithZero.length} / 257 (${((citiesWithZero.length/257)*100).toFixed(1)}%)`);

// State-level breakdown
console.log('\nState-by-State Places Breakdown:');
const stateBreakdown = {};
states.forEach(s => {
  stateBreakdown[s.id] = { name: s.name, type: s.region_type, totalCities: 0, coveredCities: 0, totalPlaces: 0 };
});
cities.forEach(c => {
  if (stateBreakdown[c.state_id]) {
    stateBreakdown[c.state_id].totalCities++;
    if (cityCoverageMap[c.id].count > 0) {
      stateBreakdown[c.state_id].coveredCities++;
    }
  }
});
vstorePlaces.forEach(p => {
  if (p.state_id && stateBreakdown[p.state_id]) {
    stateBreakdown[p.state_id].totalPlaces++;
  }
});

for (const s of Object.values(stateBreakdown)) {
  const status = s.coveredCities === s.totalCities ? 'FULL' : (s.coveredCities === 0 ? 'NONE' : 'PARTIAL');
  console.log(`  ${s.name.padEnd(35)} [${s.type.padEnd(15)}] Places: ${String(s.totalPlaces).padStart(3)} | Cities: ${s.coveredCities}/${s.totalCities} (${status})`);
}

// 5. PROTECTED AREAS AUDIT (Section 11)
console.log('\n--- SECTION 5: PROTECTED AREAS AUDIT (Section 11) ---');
const protectedAreas = [
  { name: 'Mahatma Gandhi Marine National Park', state: 'Andaman and Nicobar Islands', district: 'South Andaman (Wandoor)' },
  { name: 'Mount Manipur National Park', state: 'Andaman and Nicobar Islands', district: 'South Andaman (Mount Harriet)' },
  { name: 'Kondakarla Bird Sanctuary', state: 'Andhra Pradesh', district: 'Anakapalli / Visakhapatnam' },
  { name: 'Sri Venkateswara National Park', state: 'Andhra Pradesh', district: 'Tirupati / Chittoor' },
  { name: 'Veerapuram Bird Sanctuary', state: 'Andhra Pradesh', district: 'Sri Sathya Sai / Anantapur' },
  { name: 'Namdapha National Park', state: 'Arunachal Pradesh', district: 'Changlang' },
  { name: 'Dibru-Saikhowa National Park', state: 'Assam', district: 'Dibrugarh / Tinsukia' },
  { name: 'National Zoological Park Delhi', state: 'Delhi', district: 'Central / New Delhi' },
  { name: 'Mollem National Park', state: 'Goa', district: 'South Goa (Dharbandora)' },
  { name: 'Gir National Park', state: 'Gujarat', district: 'Gir Somnath / Junagadh' },
  { name: 'Velavadar Blackbuck National Park', state: 'Gujarat', district: 'Bhavnagar' },
  { name: 'Great Himalayan National Park', state: 'Himachal Pradesh', district: 'Kullu' },
  { name: 'Dachigam National Park', state: 'Jammu and Kashmir', district: 'Srinagar' },
  { name: 'Kishtwar National Park', state: 'Jammu and Kashmir', district: 'Kishtwar' },
  { name: 'Salim Ali National Park', state: 'Jammu and Kashmir', district: 'Srinagar' },
  { name: 'Betla National Park', state: 'Jharkhand', district: 'Latehar / Palamu' },
  { name: 'Dandeli National Park', state: 'Karnataka', district: 'Uttara Kannada' },
  { name: 'Kudremukh National Park', state: 'Karnataka', district: 'Chikkamagaluru' },
  { name: 'Eravikulam National Park', state: 'Kerala', district: 'Idukki (Munnar)' },
  { name: 'Silent Valley National Park', state: 'Kerala', district: 'Palakkad' },
  { name: 'Hemis National Park', state: 'Ladakh', district: 'Leh' },
  { name: 'Kanha National Park', state: 'Madhya Pradesh', district: 'Mandla / Balaghat' },
  { name: 'Kuno National Park', state: 'Madhya Pradesh', district: 'Sheopur' },
  { name: 'Panna National Park', state: 'Madhya Pradesh', district: 'Panna / Chhatarpur' },
  { name: 'Chandoli National Park', state: 'Maharashtra', district: 'Sangli / Satara / Kolhapur' },
  { name: 'Karnala Bird Sanctuary', state: 'Maharashtra', district: 'Raigad' },
  { name: 'Sanjay Gandhi National Park', state: 'Maharashtra', district: 'Mumbai Suburban' },
  { name: 'Murlen National Park', state: 'Mizoram', district: 'Champhai' },
  { name: 'Bhitarkanika National Park', state: 'Odisha', district: 'Kendrapara' },
  { name: 'Chandaka Elephant Sanctuary', state: 'Odisha', district: 'Khurda / Cuttack' },
  { name: 'Nalaban Bird Sanctuary', state: 'Odisha', district: 'Puri / Chilika' },
  { name: 'Kathlour-Kushlian Wildlife Sanctuary', state: 'Punjab', district: 'Pathankot' },
  { name: 'Desert National Park', state: 'Rajasthan', district: 'Jaisalmer / Barmer' },
  { name: 'Sariska National Park', state: 'Rajasthan', district: 'Alwar' },
  { name: 'Khangchendzonga National Park', state: 'Sikkim', district: 'Mangan / Gyalshing' },
  { name: 'KBR National Park', state: 'Telangana', district: 'Hyderabad' },
  { name: 'Mrugavani National Park', state: 'Telangana', district: 'Ranga Reddy / Hyderabad' },
  { name: 'Nanda Devi National Park', state: 'Uttarakhand', district: 'Chamoli' },
  { name: 'Rajaji National Park', state: 'Uttarakhand', district: 'Dehradun / Haridwar / Pauri' },
  { name: 'Gorumara National Park', state: 'West Bengal', district: 'Jalpaiguri' },
  { name: 'Neora Valley National Park', state: 'West Bengal', district: 'Kalimpong' },
  { name: 'Singalila National Park', state: 'West Bengal', district: 'Darjeeling' }
];

let paFound = 0;
let paMissing = 0;
for (const pa of protectedAreas) {
  const norm = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const paNorm = norm(pa.name);
  const found = vstorePlaces.find(p => {
    const pNorm = norm(p.name);
    return pNorm.includes(paNorm) || paNorm.includes(pNorm) ||
      (pa.name.includes('Khangchendzonga') && pNorm.includes('kanchenjunga')) ||
      (pa.name.includes('Velavadar') && pNorm.includes('velavadar')) ||
      (pa.name.includes('Mount Manipur') && (pNorm.includes('harriet') || pNorm.includes('manipur')));
  });

  if (found) {
    paFound++;
    console.log(`  ✓ PRESENT: ${pa.name} -> [${found.id}] (city: ${found.city_id}, state: ${found.state_id})`);
  } else {
    paMissing++;
    console.log(`  ✗ MISSING: ${pa.name} (Real Location: ${pa.district}, ${pa.state})`);
  }
}
console.log(`Protected Areas: ${paFound} Present, ${paMissing} Missing (Total: ${protectedAreas.length})`);

// 6. METADATA & SCHEMA CHECK
console.log('\n--- SECTION 6: METADATA & SCHEMA ALIGNMENT ---');
console.log(`Places with importance_level populated: ${vstorePlaces.filter(p => p.importance_level).length} / ${vstorePlaces.length}`);
console.log(`Places with categories array: ${vstorePlaces.filter(p => Array.isArray(p.categories)).length} / ${vstorePlaces.length}`);
console.log(`Places with subcategories array: ${vstorePlaces.filter(p => Array.isArray(p.subcategories)).length} / ${vstorePlaces.length}`);
console.log(`Places with district field: ${vstorePlaces.filter(p => p.district).length} / ${vstorePlaces.length}`);
console.log(`Places with aliases array: ${vstorePlaces.filter(p => Array.isArray(p.aliases)).length} / ${vstorePlaces.length}`);

// 7. DUPLICATES IN VSTORE
console.log('\n--- SECTION 7: DUPLICATES IN CURRENT DB ---');
const nameMap = new Map();
const duplicates = [];
for (const p of vstorePlaces) {
  const norm = p.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (nameMap.has(norm)) {
    duplicates.push({ name: p.name, first: nameMap.get(norm), duplicate: { id: p.id, city_id: p.city_id, state_id: p.state_id } });
  } else {
    nameMap.set(norm, { id: p.id, city_id: p.city_id, state_id: p.state_id });
  }
}
console.log(`Total duplicate place names: ${duplicates.length}`);
duplicates.forEach(d => console.log(`  - "${d.name}": ${d.first.id} vs ${d.duplicate.id} (city: ${d.duplicate.city_id})`));

// 8. MISMAPPED CITIES/STATES
console.log('\n--- SECTION 8: INCORRECT CITY / STATE MAPPINGS ---');
const cityStateMap = new Map(cities.map(c => [c.id, c.state_id]));
const mismapped = [];
for (const p of vstorePlaces) {
  if (p.city_id && cityStateMap.has(p.city_id)) {
    const expected = cityStateMap.get(p.city_id);
    if (p.state_id && p.state_id !== expected) {
      mismapped.push({ id: p.id, name: p.name, city_id: p.city_id, placeState: p.state_id, expectedState: expected });
    }
  }
}
console.log(`Total state/city ID mismatches: ${mismapped.length}`);
mismapped.forEach(m => console.log(`  - [${m.id}] "${m.name}": city "${m.city_id}" belongs to "${m.expectedState}", but place state_id is "${m.placeState}"`));
