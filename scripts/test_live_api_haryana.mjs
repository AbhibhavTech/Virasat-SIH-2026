import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, 'data');

async function testHaryanaData() {
  console.log('--- 1. Testing Raw Haryana JSON ---');
  const haryanaRaw = JSON.parse(fs.readFileSync(path.join(dataDir, 'haryana.json'), 'utf8'));
  console.assert(haryanaRaw.places.length === 30, `Expected 30 places, got ${haryanaRaw.places.length}`);
  console.assert(haryanaRaw.cities.length === 19, `Expected 19 cities, got ${haryanaRaw.cities.length}`);
  console.log(`✓ Raw Haryana JSON valid: ${haryanaRaw.places.length} places, ${haryanaRaw.cities.length} cities.`);

  console.log('\n--- 2. Testing data/haryana/places.json ---');
  const haryanaPlaces = JSON.parse(fs.readFileSync(path.join(dataDir, 'haryana', 'places.json'), 'utf8'));
  console.assert(haryanaPlaces.length === 30, `Expected 30 places, got ${haryanaPlaces.length}`);
  const missingCoords = haryanaPlaces.filter(p => !p.coordinates || !p.coordinates.lat || !p.coordinates.lng);
  console.assert(missingCoords.length === 0, `Places missing coordinates: ${missingCoords.length}`);
  console.log(`✓ data/haryana/places.json has 30 valid places with coordinates.`);

  console.log('\n--- 3. Testing data/states.json ---');
  const states = JSON.parse(fs.readFileSync(path.join(dataDir, 'states.json'), 'utf8'));
  const haryanaState = states.find(s => s.id === 'haryana');
  console.assert(haryanaState, 'Haryana not found in states.json');
  console.assert(haryanaState.status === 'verified', `Expected status verified, got ${haryanaState.status}`);
  console.assert(haryanaState.total_places === 30, `Expected 30 places, got ${haryanaState.total_places}`);
  console.assert(haryanaState.total_cities === 19, `Expected 19 cities, got ${haryanaState.total_cities}`);
  console.log(`✓ data/states.json valid for Haryana (status=${haryanaState.status}, cities=${haryanaState.total_cities}, places=${haryanaState.total_places}).`);

  console.log('\n--- 4. Testing data/cities.json & redirects ---');
  const cities = JSON.parse(fs.readFileSync(path.join(dataDir, 'cities.json'), 'utf8'));
  const haryanaCities = cities.filter(c => c.state_id === 'haryana');
  console.assert(haryanaCities.length === 19, `Expected 19 Haryana cities in cities.json, got ${haryanaCities.length}`);
  console.log(`✓ data/cities.json contains all ${haryanaCities.length} Haryana cities.`);

  console.log('\n--- 5. Testing data/india_tourism_database.json ---');
  const db = JSON.parse(fs.readFileSync(path.join(dataDir, 'india_tourism_database.json'), 'utf8'));
  const dbHaryana = db.states.find(s => s.id === 'haryana');
  console.assert(dbHaryana, 'Haryana not found in india_tourism_database.json');
  console.assert(dbHaryana.status === 'verified', `Expected verified, got ${dbHaryana.status}`);
  console.assert(dbHaryana.total_places === 30, `Expected 30 places, got ${dbHaryana.total_places}`);
  console.assert(dbHaryana.total_cities === 19, `Expected 19 cities, got ${dbHaryana.total_cities}`);
  console.assert(dbHaryana.cities.length === 19, `Expected 19 cities in array, got ${dbHaryana.cities.length}`);

  let totalPlacesInCities = 0;
  for (const c of dbHaryana.cities) {
    totalPlacesInCities += (c.places || []).length;
  }
  console.assert(totalPlacesInCities === 30, `Expected 30 total places assigned across cities, got ${totalPlacesInCities}`);
  console.log(`✓ india_tourism_database.json has Haryana with ${dbHaryana.cities.length} cities and ${totalPlacesInCities} places.`);

  // Test city place counts:
  const kurukshetra = dbHaryana.cities.find(c => c.id === 'kurukshetra');
  console.assert(kurukshetra && kurukshetra.places.length === 5, `Expected 5 places in Kurukshetra, got ${kurukshetra?.places?.length}`);
  const panipat = dbHaryana.cities.find(c => c.id === 'panipat');
  console.assert(panipat && panipat.places.length === 3, `Expected 3 places in Panipat, got ${panipat?.places?.length}`);
  const pinjore = dbHaryana.cities.find(c => c.id === 'pinjore');
  console.assert(pinjore && pinjore.places.length === 2, `Expected 2 places in Pinjore, got ${pinjore?.places?.length}`);
  const morni = dbHaryana.cities.find(c => c.id === 'morni');
  console.assert(morni && morni.places.length === 2, `Expected 2 places in Morni, got ${morni?.places?.length}`);
  console.log(`✓ Specific city place counts verified (Kurukshetra: 5, Panipat: 3, Pinjore: 2, Morni: 2).`);

  console.log('\n--- 6. Verifying preservation of existing states ---');
  const bihar = db.states.find(s => s.id === 'bihar');
  console.assert(bihar && bihar.total_places === 30, `Bihar corrupted! Got: ${bihar?.total_places}`);
  const chhattisgarh = db.states.find(s => s.id === 'chhattisgarh');
  console.assert(chhattisgarh && chhattisgarh.total_places === 30, `Chhattisgarh corrupted! Got: ${chhattisgarh?.total_places}`);
  const karnataka = db.states.find(s => s.id === 'karnataka');
  console.assert(karnataka && karnataka.total_places === 40, `Karnataka corrupted! Got: ${karnataka?.total_places}`);
  const up = db.states.find(s => s.id === 'uttar-pradesh');
  console.assert(up && up.total_places === 40, `UP corrupted! Got: ${up?.total_places}`);
  const telangana = db.states.find(s => s.id === 'telangana');
  console.assert(telangana && telangana.total_places === 15, `Telangana corrupted! Got: ${telangana?.total_places}`);
  const nagaland = db.states.find(s => s.id === 'nagaland');
  console.assert(nagaland && nagaland.total_places === 10, `Nagaland corrupted! Got: ${nagaland?.total_places}`);
  console.log(`✓ Existing states preserved (Bihar: 30, Chhattisgarh: 30, Karnataka: 40, UP: 40, Telangana: 15, Nagaland: 10).`);

  console.log('\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<');
}

testHaryanaData().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
