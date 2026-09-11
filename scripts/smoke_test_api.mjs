import { spawn } from 'child_process';
import http from 'http';

const PORT = 3005;
const env = { ...process.env, PORT: String(PORT), NODE_ENV: 'production' };

console.log(`Starting test server on port ${PORT}...`);
const serverProc = spawn('npx', ['tsx', 'server.ts'], { env, stdio: ['ignore', 'pipe', 'pipe'], shell: true });

let output = '';
serverProc.stdout.on('data', (d) => {
  output += d.toString();
  if (output.includes(`http://0.0.0.0:${PORT}`)) {
    console.log(`Server started! Running endpoint smoke tests...`);
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

    // 2. GET /api/india-hierarchy/states
    const r2 = await get('/api/india-hierarchy/states');
    console.log(`2. GET /api/india-hierarchy/states: HTTP ${r2.status}, count: ${r2.body?.length}`);

    // 3. GET /api/india-hierarchy/state/rajasthan
    const r3 = await get('/api/india-hierarchy/state/rajasthan');
    console.log(`3. GET /api/india-hierarchy/state/rajasthan: HTTP ${r3.status}, state: ${r3.body?.name}, cities: ${r3.body?.cities?.length}`);

    // 4. GET /api/india-hierarchy/city/jaipur
    const r4 = await get('/api/india-hierarchy/city/jaipur');
    console.log(`4. GET /api/india-hierarchy/city/jaipur: HTTP ${r4.status}, city: ${r4.body?.name}`);

    // 5. GET /api/india-hierarchy/city/mangalore (alias/redirect to Mangaluru)
    const r5 = await get('/api/india-hierarchy/city/mangalore');
    console.log(`5. GET /api/india-hierarchy/city/mangalore: HTTP ${r5.status}, resolved to: ${r5.body?.name}`);

    if (r1.status !== 200 || r2.status !== 200 || r3.status !== 200 || r4.status !== 200 || r5.status !== 200) {
      throw new Error('One or more endpoints failed');
    }

    console.log(`\nALL API SMOKE TESTS PASSED!`);
  } catch (err) {
    console.error(`Smoke test failed:`, err);
  } finally {
    console.log(`Shutting down test server...`);
    serverProc.kill('SIGTERM');
    process.exit(0);
  }
}

setTimeout(() => {
  console.error(`Timeout waiting for server. Output was:\n${output}`);
  serverProc.kill('SIGTERM');
  process.exit(1);
}, 25000);
