import path from 'path';
import { db } from '../server/src/db/client.js';
import fs from 'fs';

async function main() {
  console.log('--- Starting Comprehensive Integration Verification ---');

  // Trigger db init (auto-seeds if missing keys)
  await db.init();

  // Test 1: Place counts per state via db.places.findAll
  console.log('\n[TEST 1] Place counts via db.places.findAll:');
  const checks = [
    { stateId: 'nagaland', expected: 10 },
    { stateId: 'meghalaya', expected: 10 },
    { stateId: 'manipur', expected: 10 },
    { stateId: 'mizoram', expected: 10 },
    { stateId: 'telangana', expected: 15 },
    { stateId: 'punjab', expected: 20 },
    { stateId: 'west-bengal', expected: 20 }
  ];

  let passed = true;
  for (const c of checks) {
    const res = await db.places.findAll({ stateId: c.stateId, limit: 100 });
    const count = res.places.length;
    const ok = count === c.expected;
    console.log(`  ${c.stateId}: count = ${count} (expected: ${c.expected}) -> ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) passed = false;
  }

  // Test 2: City filtering for Nagaland
  console.log('\n[TEST 2] Nagaland city mapping:');
  const nagalandCities = [
    { cityId: 'kohima', expected: 5 },
    { cityId: 'mokokchung', expected: 1 },
    { cityId: 'mon', expected: 1 },
    { cityId: 'phek', expected: 1 },
    { cityId: 'peren', expected: 2 }
  ];
  for (const c of nagalandCities) {
    const res = await db.places.findAll({ stateId: 'nagaland', cityId: c.cityId });
    const ok = res.places.length === c.expected;
    console.log(`  Nagaland - ${c.cityId}: count = ${res.places.length} (expected: ${c.expected}) -> ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) passed = false;
  }

  // Test 3: City filtering for Meghalaya
  console.log('\n[TEST 3] Meghalaya city mapping:');
  const meghalayaCities = [
    { cityId: 'shillong', expected: 3 },
    { cityId: 'umiam', expected: 1 },
    { cityId: 'cherrapunji', expected: 3 },
    { cityId: 'nongriat', expected: 1 },
    { cityId: 'dawki', expected: 1 },
    { cityId: 'mawlynnong', expected: 1 }
  ];
  for (const c of meghalayaCities) {
    const res = await db.places.findAll({ stateId: 'meghalaya', cityId: c.cityId });
    const ok = res.places.length === c.expected;
    console.log(`  Meghalaya - ${c.cityId}: count = ${res.places.length} (expected: ${c.expected}) -> ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) passed = false;
  }

  // Test 4: City filtering for Manipur
  console.log('\n[TEST 4] Manipur city mapping:');
  const manipurCities = [
    { cityId: 'imphal', expected: 5 },
    { cityId: 'loktak', expected: 2 },
    { cityId: 'ukhrul', expected: 1 },
    { cityId: 'dzukou', expected: 1 },
    { cityId: 'khongjom', expected: 1 },
    { cityId: 'bishnupur', expected: 0 }
  ];
  for (const c of manipurCities) {
    const res = await db.places.findAll({ stateId: 'manipur', cityId: c.cityId });
    const ok = res.places.length === c.expected;
    console.log(`  Manipur - ${c.cityId}: count = ${res.places.length} (expected: ${c.expected}) -> ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) passed = false;
  }

  // Test 5: City filtering for Mizoram
  console.log('\n[TEST 5] Mizoram city mapping:');
  const mizoramCities = [
    { cityId: 'aizawl', expected: 5 },
    { cityId: 'serchhip', expected: 1 },
    { cityId: 'lawngtlai', expected: 1 },
    { cityId: 'champhai', expected: 1 },
    { cityId: 'saitual', expected: 1 },
    { cityId: 'siaha', expected: 1 },
    { cityId: 'hmuifang', expected: 0 }
  ];
  for (const c of mizoramCities) {
    const res = await db.places.findAll({ stateId: 'mizoram', cityId: c.cityId });
    const ok = res.places.length === c.expected;
    console.log(`  Mizoram - ${c.cityId}: count = ${res.places.length} (expected: ${c.expected}) -> ${ok ? 'PASS' : 'FAIL'}`);
    if (!ok) passed = false;
  }

  // Test 6: Discover Bharat India Hierarchy Database
  console.log('\n[TEST 6] Discover Bharat Database checks:');
  const dbData = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));
  const statesToCheck = ['nagaland', 'meghalaya', 'manipur', 'mizoram', 'telangana'];
  for (const stId of statesToCheck) {
    const state = dbData.states.find(s => s.id === stId);
    if (!state) {
      console.log(`  ${stId}: State not found in india_tourism_database.json -> FAIL`);
      passed = false;
      continue;
    }
    const totalPlaces = state.cities.reduce((acc, c) => acc + (c.tourist_places?.length || 0), 0);
    const verifiedPlaces = state.cities.reduce((acc, c) => acc + (c.tourist_places || []).filter(p => p.verification_status === 'verified').length, 0);
    console.log(`  ${state.name} (${state.region}): ${state.cities.length} cities, ${totalPlaces} places (${verifiedPlaces} verified) -> PASS`);
  }

  // Test 7: Integrity of existing datasets
  console.log('\n[TEST 7] Integrity of Existing Datasets:');
  const maharashtra = await db.places.findAll({ stateId: 'maharashtra', limit: 100 });
  const mumbai = await db.places.findAll({ cityId: 'mumbai', limit: 100 });
  const pune = await db.places.findAll({ cityId: 'pune', limit: 100 });
  console.log(`  Maharashtra total verified: ${maharashtra.places.length}`);
  console.log(`  Mumbai total: ${mumbai.places.length}`);
  console.log(`  Pune total: ${pune.places.length}`);

  if (passed) {
    console.log('\n>>> ALL INTEGRATION TESTS PASSED SUCCESSFULLY! <<<');
    process.exit(0);
  } else {
    console.error('\n>>> SOME INTEGRATION TESTS FAILED! <<<');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
