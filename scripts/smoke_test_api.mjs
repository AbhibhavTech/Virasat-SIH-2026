import { spawn } from 'child_process';
import http from 'http';

const PORT = 3008;
const env = { ...process.env, PORT: String(PORT), NODE_ENV: 'production' };

console.log(`Starting live Virasat server on port ${PORT}...`);
const cmd = process.platform === 'win32' ? 'cmd.exe' : 'npx';
const args = process.platform === 'win32' ? ['/c', 'npx', 'tsx', 'server.ts'] : ['tsx', 'server.ts'];
const serverProc = spawn(cmd, args, { env });

let output = '';
let testsStarted = false;

serverProc.stdout.on('data', (d) => {
  output += d.toString();
  if (output.includes(`http://0.0.0.0:${PORT}`) && !testsStarted) {
    testsStarted = true;
    console.log(`Server started! Running comprehensive endpoint smoke tests...`);
    runTests();
  }
});

serverProc.stderr.on('data', (d) => {
  output += d.toString();
});

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${path}`, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  try {
    // 1. GET /api/india-hierarchy
    const r1 = await get('/api/india-hierarchy');
    console.log(`1. GET /api/india-hierarchy: HTTP ${r1.status}`);
    console.log(`   - states_count: ${r1.body.states_count}`);
    console.log(`   - cities_count: ${r1.body.cities_count}`);
    console.log(`   - attractions_count: ${r1.body.attractions_count}`);
    console.log(`   - states array length: ${r1.body.states?.length}`);

    // 2. GET /regions
    const r2 = await get('/regions');
    console.log(`2. GET /regions: HTTP ${r2.status}, total_regions: ${r2.body.region_counts?.total_regions}, states: ${r2.body.region_counts?.states}, UTs: ${r2.body.region_counts?.union_territories}`);

    // 3. GET /api/regions
    const r3 = await get('/api/regions');
    console.log(`3. GET /api/regions: HTTP ${r3.status}`);

    // 4. GET /regions/rajasthan
    const r4 = await get('/regions/rajasthan');
    console.log(`4. GET /regions/rajasthan: HTTP ${r4.status}, name: ${r4.body.name}, active cities: ${r4.body.total_active_cities}`);

    // 5. GET /api/regions/delhi
    const r5 = await get('/api/regions/delhi');
    console.log(`5. GET /api/regions/delhi: HTTP ${r5.status}, name: ${r5.body.name}, active cities: ${r5.body.total_active_cities}`);

    // 6. GET /regions/rajasthan/cities/jaipur
    const r6 = await get('/regions/rajasthan/cities/jaipur');
    console.log(`6. GET /regions/rajasthan/cities/jaipur: HTTP ${r6.status}, city: ${r6.body.city}, places: ${r6.body.total_places}`);

    // 7. GET /places/andhra_pradesh_001
    const r7 = await get('/places/andhra_pradesh_001');
    console.log(`7. GET /places/andhra_pradesh_001: HTTP ${r7.status}, name: ${r7.body.name}, hotels: ${r7.body.hotels?.length}`);

    // 8. GET /places/DEL001 (Red Fort)
    const r8 = await get('/places/DEL001');
    console.log(`8. GET /places/DEL001: HTTP ${r8.status}, name: ${r8.body.name}, city: ${r8.body.city}`);

    // 9. GET /search?q=temple
    const r9 = await get('/search?q=temple');
    console.log(`9. GET /search?q=temple: HTTP ${r9.status}, total_results: ${r9.body.total_results}, places: ${r9.body.places?.length}`);

    // 10. GET /api/search?q=lake
    const r10 = await get('/api/search?q=lake');
    console.log(`10. GET /api/search?q=lake: HTTP ${r10.status}, total_results: ${r10.body.total_results}, places: ${r10.body.places?.length}`);

    if (
      r1.status !== 200 || r2.status !== 200 || r3.status !== 200 ||
      r4.status !== 200 || r5.status !== 200 || r6.status !== 200 ||
      r7.status !== 200 || r8.status !== 200 || r9.status !== 200 || r10.status !== 200
    ) {
      throw new Error('One or more endpoints failed');
    }

    console.log(`\nALL 10 LIVE SERVER SMOKE TESTS PASSED!`);
  } catch (err) {
    console.error(`Smoke test failed:`, err);
  } finally {
    serverProc.kill();
    process.exit(0);
  }
}

// Timeout fallback
setTimeout(() => {
  if (!testsStarted) {
    console.error('Server timed out waiting to start. Logs:\n', output);
    serverProc.kill();
    process.exit(1);
  }
}, 30000);
