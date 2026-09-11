import http from 'http';

const TEST_PORT = 3005;
process.env.PORT = String(TEST_PORT);
process.env.NODE_ENV = 'production';

function fetchJson(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${TEST_PORT}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    }).on('error', reject);
  });
}

async function runLiveServerTests() {
  console.log(`Starting live server on port ${TEST_PORT}...`);
  // Dynamically import server.ts (which launches express on TEST_PORT)
  await import('../server.ts');

  // Wait a moment for server to listen
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n--- 1. Testing GET /api/india-hierarchy ---');
  const hierRes = await fetchJson('/api/india-hierarchy');
  if (hierRes.status !== 200) {
    throw new Error(`GET /api/india-hierarchy returned status ${hierRes.status}`);
  }
  const haryanaInHier = hierRes.data.states?.find(s => s.id === 'haryana');
  if (!haryanaInHier) {
    throw new Error('Haryana not found in /api/india-hierarchy');
  }
  console.log(`✓ /api/india-hierarchy: status=${haryanaInHier.status}, cities=${haryanaInHier.cities?.length}, places=${haryanaInHier.total_places}`);
  if (haryanaInHier.total_places !== 30 || haryanaInHier.cities?.length !== 19) {
    throw new Error(`Expected 30 places and 19 cities, got places=${haryanaInHier.total_places}, cities=${haryanaInHier.cities?.length}`);
  }

  console.log('\n--- 2. Testing GET /api/india-hierarchy/state/haryana ---');
  const stateRes = await fetchJson('/api/india-hierarchy/state/haryana');
  if (stateRes.status !== 200) {
    throw new Error(`GET /api/india-hierarchy/state/haryana returned status ${stateRes.status}`);
  }
  console.log(`✓ /api/india-hierarchy/state/haryana: name=${stateRes.data.name}, cities count=${stateRes.data.cities?.length}`);
  if (stateRes.data.cities?.length !== 19) {
    throw new Error(`Expected 19 cities for Haryana state endpoint, got ${stateRes.data.cities?.length}`);
  }

  console.log('\n--- 3. Testing GET /api/destinations?state=haryana ---');
  const destRes = await fetchJson('/api/destinations?state=haryana&limit=100');
  if (destRes.status !== 200) {
    throw new Error(`GET /api/destinations?state=haryana returned status ${destRes.status}`);
  }
  const destItems = Array.isArray(destRes.data) ? destRes.data : destRes.data.data || [];
  const destTotal = destRes.data.total ?? destItems.length;
  console.log(`✓ /api/destinations?state=haryana returned total=${destTotal}, data length=${destItems.length}`);
  if (destTotal !== 30 || destItems.length !== 30) {
    throw new Error(`Expected 30 destinations for Haryana, got total=${destTotal}, data length=${destItems.length}`);
  }

  console.log('\n--- 4. Testing GET /api/destinations with Haryana cities ---');
  const testCities = [
    { city: 'kurukshetra', expected: 5 },
    { city: 'panipat', expected: 3 },
    { city: 'pinjore', expected: 2 },
    { city: 'morni', expected: 2 },
    { city: 'karnal', expected: 2 },
    { city: 'jhajjar', expected: 2 },
    { city: 'narnaul', expected: 2 },
    { city: 'hisar', expected: 1 },
    { city: 'faridabad', expected: 1 },
    { city: 'sultanpur', expected: 1 },
    { city: 'kalesar', expected: 1 },
    { city: 'agroha', expected: 1 },
    { city: 'ballabhgarh', expected: 1 },
    { city: 'sohna', expected: 1 },
    { city: 'panchkula', expected: 1 },
    { city: 'rohtak', expected: 1 },
    { city: 'chhachhrauli', expected: 1 },
    { city: 'kaithal', expected: 1 },
    { city: 'rakhigarhi', expected: 1 }
  ];

  for (const { city, expected } of testCities) {
    const res = await fetchJson(`/api/destinations?city=${city}&limit=100`);
    const items = Array.isArray(res.data) ? res.data : res.data.data || [];
    const total = res.data.total ?? items.length;
    console.log(`  - City: ${city} => total=${total}, returned ${items.length} (expected ${expected})`);
    if (total !== expected || items.length !== expected) {
      throw new Error(`City ${city} expected ${expected} places, got total=${total}, length=${items.length}`);
    }
  }

  console.log('\n--- 5. Checking other states are preserved in live server ---');
  const biharRes = await fetchJson('/api/destinations?state=bihar&limit=100');
  const biharTotal = biharRes.data.total ?? (Array.isArray(biharRes.data) ? biharRes.data.length : biharRes.data.data?.length);
  console.log(`✓ Bihar places in live server: ${biharTotal}`);
  if (biharTotal !== 30) {
    throw new Error(`Expected 30 places for Bihar, got ${biharTotal}`);
  }

  const cgRes = await fetchJson('/api/destinations?state=chhattisgarh&limit=100');
  const cgTotal = cgRes.data.total ?? (Array.isArray(cgRes.data) ? cgRes.data.length : cgRes.data.data?.length);
  console.log(`✓ Chhattisgarh places in live server: ${cgTotal}`);
  if (cgTotal !== 30) {
    throw new Error(`Expected 30 places for Chhattisgarh, got ${cgTotal}`);
  }

  console.log('\n>>> ALL LIVE API ENDPOINT TESTS PASSED SUCCESSFULLY! <<<');
  process.exit(0);
}

runLiveServerTests().catch(err => {
  console.error('API Test Error:', err);
  process.exit(1);
});
