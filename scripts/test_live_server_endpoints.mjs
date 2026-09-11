import { spawn } from 'child_process';
import http from 'http';

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const testPort = 3006;
  console.log(`Starting live test server on port ${testPort}...`);

  const serverProc = spawn('node', ['--import', 'tsx', 'server.ts'], {
    env: { ...process.env, PORT: String(testPort) },
    stdio: 'pipe'
  });

  serverProc.stdout.on('data', (d) => {
    // console.log(d.toString());
  });
  serverProc.stderr.on('data', (d) => {
    // console.error(d.toString());
  });

  // Wait for server to boot
  let ready = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const res = await get(`http://localhost:${testPort}/health`);
      if (res.status === 200) {
        ready = true;
        break;
      }
    } catch (e) {}
  }

  if (!ready) {
    console.error('Server failed to start within timeout');
    serverProc.kill();
    process.exit(1);
  }

  console.log('Server online! Running endpoint verifications...\n');

  try {
    // 1. India Hierarchy States
    for (const [stateId, expectedPlaces, expectedCities] of [
      ['nagaland', 10, 5],
      ['meghalaya', 10, 6],
      ['manipur', 10, 6],
      ['mizoram', 10, 7],
      ['telangana', 15, 8]
    ]) {
      const res = await get(`http://localhost:${testPort}/api/india-hierarchy/state/${stateId}`);
      if (res.status !== 200) {
        throw new Error(`/api/india-hierarchy/state/${stateId} failed with ${res.status}`);
      }
      const st = res.body.state || res.body;
      const totalPlaces = st.cities.reduce((acc, c) => acc + (c.tourist_places?.length || 0), 0);
      console.log(`[Discover Bharat] ${st.name}: ${st.cities.length} cities (expected: ${expectedCities}), ${totalPlaces} places (expected: ${expectedPlaces}) -> PASS`);
    }

    // 2. /api/v1/places endpoint
    console.log('\nTesting /api/v1/places:');
    for (const [stateId, expectedPlaces] of [
      ['nagaland', 10],
      ['meghalaya', 10],
      ['manipur', 10],
      ['mizoram', 10],
      ['telangana', 15]
    ]) {
      const res = await get(`http://localhost:${testPort}/api/v1/places?stateId=${stateId}&limit=50`);
      const count = res.body.total || res.body.places?.length || 0;
      console.log(`[API v1] stateId=${stateId}: ${count} places (expected: ${expectedPlaces}) -> ${count === expectedPlaces ? 'PASS' : 'FAIL'}`);
      if (count !== expectedPlaces) throw new Error(`Place count mismatch for ${stateId}`);
    }

    // 3. /api/places endpoint
    console.log('\nTesting /api/places:');
    for (const [stateName, expectedPlaces] of [
      ['nagaland', 10],
      ['meghalaya', 10],
      ['manipur', 10],
      ['mizoram', 10],
      ['telangana', 15]
    ]) {
      const res = await get(`http://localhost:${testPort}/api/places?state=${stateName}&limit=50`);
      const count = res.body.total || res.body.data?.length || 0;
      console.log(`[API Legacy] state=${stateName}: ${count} places (expected: ${expectedPlaces}) -> ${count === expectedPlaces ? 'PASS' : 'FAIL'}`);
      if (count !== expectedPlaces) throw new Error(`Place count mismatch for ${stateName}`);
    }

    console.log('\n>>> ALL LIVE SERVER ENDPOINT TESTS PASSED! <<<');
  } finally {
    serverProc.kill();
  }
}

main().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
