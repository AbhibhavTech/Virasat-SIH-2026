import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');

console.log('--- 1. VERIFYING REGIONAL PLACES JSON FILES ---');
const biharPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'bihar', 'places.json'), 'utf8'));
const upPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'uttar-pradesh', 'places.json'), 'utf8'));
const karnatakaPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'karnataka', 'places.json'), 'utf8'));
const cgPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'chhattisgarh', 'places.json'), 'utf8'));

console.log(`Bihar places: ${biharPlaces.length} (Expected: 30)`);
console.log(`UP places: ${upPlaces.length} (Expected: 40)`);
console.log(`Karnataka places: ${karnatakaPlaces.length} (Expected: 40)`);
console.log(`Chhattisgarh places: ${cgPlaces.length} (Expected: 30)`);

if (biharPlaces.length !== 30 || upPlaces.length !== 40 || karnatakaPlaces.length !== 40 || cgPlaces.length !== 30) {
  throw new Error('Places count mismatch!');
}

console.log('--- 2. VERIFYING INDIA TOURISM DATABASE (DISCOVER BHARAT HIERARCHY) ---');
const hierarchyDb = JSON.parse(fs.readFileSync(path.join(dataDir, 'india_tourism_database.json'), 'utf8'));

const testHierarchy = (stateId, expCities, expPlaces) => {
  const s = hierarchyDb.states.find(x => x.id === stateId);
  if (!s) throw new Error(`State ${stateId} not found in hierarchy`);
  const placesInCities = (s.cities || []).reduce((acc, c) => acc + (c.places?.length || 0), 0);
  console.log(`[Hierarchy] ${s.name}: Status=${s.status}, Cities=${s.cities?.length} (Exp: ${expCities}), Places in Cities=${placesInCities} (Exp: ${expPlaces})`);
  if (s.status !== 'verified') throw new Error(`${stateId} is not verified`);
  if (s.cities?.length !== expCities) throw new Error(`${stateId} city count mismatch: got ${s.cities?.length}, exp ${expCities}`);
  if (placesInCities !== expPlaces) throw new Error(`${stateId} places in cities mismatch: got ${placesInCities}, exp ${expPlaces}`);
};

testHierarchy('bihar', 14, 30);
testHierarchy('uttar-pradesh', 12, 40);
testHierarchy('karnataka', 20, 40);
testHierarchy('chhattisgarh', 22, 30);

console.log('--- 3. VERIFYING STATES REGISTRY ---');
const statesList = JSON.parse(fs.readFileSync(path.join(dataDir, 'states.json'), 'utf8'));
for (const [id, expC, expP] of [['bihar', 14, 30], ['uttar-pradesh', 12, 40], ['karnataka', 20, 40], ['chhattisgarh', 22, 30]]) {
  const s = statesList.find(x => x.id === id);
  console.log(`[states.json] ${id}: status=${s?.status}, total_cities=${s?.total_cities}, total_places=${s?.total_places}`);
  if (s?.status !== 'verified' || s?.total_places !== expP) {
    throw new Error(`states.json invalid for ${id}`);
  }
}

console.log('--- 4. VERIFYING CITIES REGISTRY NO DUPLICATES ---');
const citiesList = JSON.parse(fs.readFileSync(path.join(dataDir, 'cities.json'), 'utf8'));
const cityIdCounts = new Map();
for (const c of citiesList) {
  cityIdCounts.set(c.id, (cityIdCounts.get(c.id) || 0) + 1);
}
const duplicateIds = [...cityIdCounts.entries()].filter(([id, cnt]) => cnt > 1);
if (duplicateIds.length > 0) {
  throw new Error(`Duplicate city IDs found in cities.json: ${JSON.stringify(duplicateIds)}`);
}
console.log(`cities.json verified: ${citiesList.length} unique cities, 0 duplicates.`);

console.log('--- 5. VERIFYING PRESERVATION OF EXISTING DATASETS ---');
const punjab = statesList.find(s => s.id === 'punjab');
const telangana = statesList.find(s => s.id === 'telangana');
const wb = statesList.find(s => s.id === 'west-bengal');
const maharashtra = statesList.find(s => s.id === 'maharashtra');
const nagaland = statesList.find(s => s.id === 'nagaland');
const meghalaya = statesList.find(s => s.id === 'meghalaya');
const manipur = statesList.find(s => s.id === 'manipur');
const mizoram = statesList.find(s => s.id === 'mizoram');

console.log(`Punjab: status=${punjab?.status}, places=${punjab?.total_places}`);
console.log(`Telangana: status=${telangana?.status}, places=${telangana?.total_places}`);
console.log(`West Bengal: status=${wb?.status}`);
console.log(`Maharashtra: status=${maharashtra?.status}`);
console.log(`Nagaland: status=${nagaland?.status}, places=${nagaland?.total_places}`);
console.log(`Meghalaya: status=${meghalaya?.status}, places=${meghalaya?.total_places}`);
console.log(`Manipur: status=${manipur?.status}, places=${manipur?.total_places}`);
console.log(`Mizoram: status=${mizoram?.status}, places=${mizoram?.total_places}`);

if (!punjab || !telangana || !wb || !maharashtra || !nagaland || !meghalaya || !manipur || !mizoram) {
  throw new Error('Existing states corrupted or missing!');
}

console.log('>>> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<');
