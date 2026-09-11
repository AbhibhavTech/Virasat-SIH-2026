import http from 'http';
import { spawn } from 'child_process';

const TEST_PORT = 3899;
process.env.PORT = String(TEST_PORT);
process.env.NODE_ENV = 'production';

console.log('--- STARTING VIRASAT SERVER FOR LIVE API VERIFICATION ---');

const serverProc = spawn('npx.cmd', ['tsx', 'server.ts'], {
  env: { ...process.env, PORT: String(TEST_PORT), NODE_ENV: 'production' },
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true
});

serverProc.stdout.on('data', (d) => {
  const msg = d.toString();
  if (msg.includes('Virasat server running')) {
    console.log('✓ Server is ready on port ' + TEST_PORT);
    runApiTests();
  }
});

serverProc.stderr.on('data', (d) => {
  console.error('Server err:', d.toString());
});

async function fetchJson(urlPath) {
  const res = await fetch(`http://127.0.0.1:${TEST_PORT}${urlPath}`);
  if (!res.ok) throw new Error(`GET ${urlPath} returned HTTP ${res.status}`);
  return await res.json();
}

async function runApiTests() {
  try {
    console.log('\n--- 1. Testing /api/india-hierarchy ---');
    const hierarchy = await fetchJson('/api/india-hierarchy');
    console.log(`Loaded India hierarchy with ${hierarchy.states.length} states/UTs`);

    for (const [sId, expCities, expPlaces] of [
      ['bihar', 14, 30],
      ['uttar-pradesh', 12, 40],
      ['karnataka', 20, 40],
      ['chhattisgarh', 22, 30]
    ]) {
      const s = hierarchy.states.find(x => x.id === sId);
      const totalPlaces = (s.cities || []).reduce((acc, c) => acc + (c.places?.length || 0), 0);
      console.log(`Hierarchy ${s.name}: Status=${s.status}, Cities=${s.cities?.length} (Exp: ${expCities}), Places=${totalPlaces} (Exp: ${expPlaces})`);
      if (s.cities?.length !== expCities || totalPlaces !== expPlaces) {
        throw new Error(`Hierarchy check failed for ${sId}`);
      }
    }

    console.log('\n--- 2. Testing /api/india-hierarchy/state/:stateId ---');
    for (const sId of ['bihar', 'uttar-pradesh', 'karnataka', 'chhattisgarh']) {
      const stateData = await fetchJson(`/api/india-hierarchy/state/${sId}`);
      console.log(`State endpoint /${sId}: name=${stateData.name}, cities=${stateData.cities.length}`);
    }

    console.log('\n--- 3. Testing /api/destinations?state=:state ---');
    for (const [sId, exp] of [
      ['bihar', 30],
      ['uttar-pradesh', 40],
      ['karnataka', 40],
      ['chhattisgarh', 30]
    ]) {
      const res = await fetchJson(`/api/destinations?state=${sId}&limit=100`);
      console.log(`Destinations for state=${sId}: total=${res.total}, returned=${res.data.length} (Expected: ${exp})`);
      if (res.total !== exp) {
        throw new Error(`State destinations count mismatch for ${sId}: got ${res.total}, exp ${exp}`);
      }
    }

    console.log('\n--- 4. Testing /api/destinations?city=:city ---');
    const sampleCities = [
      ['patna', 11],
      ['bodh-gaya', 2],
      ['rajgir', 3],
      ['lucknow', 6],
      ['varanasi', 4],
      ['agra', 5],
      ['ayodhya', 6],
      ['bengaluru', 6],
      ['mysuru', 4],
      ['hampi', 5],
      ['hassan', 2],
      ['chitrakote', 1],
      ['kanger-valley', 2],
      ['raipur', 4]
    ];

    for (const [cityId, exp] of sampleCities) {
      const res = await fetchJson(`/api/destinations?city=${cityId}&limit=100`);
      console.log(`Destinations for city=${cityId}: total=${res.total}, returned=${res.data.length} (Expected: ${exp})`);
      if (res.total !== exp) {
        throw new Error(`City destinations count mismatch for ${cityId}: got ${res.total}, exp ${exp}`);
      }
    }

    console.log('\n--- 5. Testing Database API (db.places.findAll) ---');
    const { db } = await import('../server/src/db/client.ts');
    await db.init();

    for (const [sId, exp] of [
      ['bihar', 30],
      ['uttar-pradesh', 40],
      ['karnataka', 40],
      ['chhattisgarh', 30]
    ]) {
      const res = await db.places.findAll({ stateId: sId, limit: 100 });
      console.log(`db.places.findAll for stateId=${sId}: total=${res.total} (Expected: ${exp})`);
      if (res.total !== exp) {
        throw new Error(`DB places findAll count mismatch for ${sId}: got ${res.total}, exp ${exp}`);
      }
    }

    console.log('\n--- 6. Testing Existing States Preservation ---');
    for (const [sId, minPlaces] of [
      ['punjab', 20],
      ['telangana', 15],
      ['nagaland', 10],
      ['meghalaya', 10],
      ['manipur', 10],
      ['mizoram', 10]
    ]) {
      const res = await fetchJson(`/api/destinations?state=${sId}&limit=100`);
      console.log(`Preserved state=${sId}: places total=${res.total}`);
      if (res.total < minPlaces) {
        throw new Error(`Existing state ${sId} has fewer places than expected!`);
      }
    }

    console.log('\n=========================================');
    console.log('>>> ALL LIVE API ENDPOINT CHECKS PASSED! <<<');
    console.log('=========================================');
  } catch (err) {
    console.error('API Verification Test Failed:', err);
    process.exitCode = 1;
  } finally {
    serverProc.kill();
    process.exit(process.exitCode || 0);
  }
}
