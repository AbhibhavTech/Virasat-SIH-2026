const http = require('http');
const { spawn } = require('child_process');

console.log('======================================================');
console.log('VIRASAT ISOLATED /ai/ SUITE VERIFICATION');
console.log('======================================================\n');

const PORT = 3012;
const env = { ...process.env, PORT: String(PORT), NODE_ENV: 'production' };

console.log(`[1] Launching live Virasat server on port ${PORT}...`);
const cmd = process.platform === 'win32' ? 'cmd.exe' : 'npx';
const args = process.platform === 'win32' ? ['/c', 'npx', 'tsx', 'server.ts'] : ['tsx', 'server.ts'];
const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const serverProc = spawn(cmd, args, { env, cwd: projectRoot });

let output = '';
let testsStarted = false;

serverProc.stdout.on('data', (d) => {
  output += d.toString();
  if (output.includes(`http://0.0.0.0:${PORT}`) && !testsStarted) {
    testsStarted = true;
    runTests();
  }
});

serverProc.stderr.on('data', (d) => {
  output += d.toString();
});

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(raw) });
          } catch {
            resolve({ status: res.statusCode, body: raw });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  try {
    console.log('\n[2] Testing AI Subsystem Endpoints:');

    // 1. GET /api/ai/health
    const health = await request('GET', '/api/ai/health');
    console.log(`- GET /api/ai/health: HTTP ${health.status}, tools: ${health.body.tools_registered}`);
    if (health.status !== 200 || health.body.tools_registered !== 18) {
      throw new Error(`Expected 18 registered tools in /api/ai/health, got: ${health.body.tools_registered}`);
    }

    // 2. GET /api/ai/tools
    const tools = await request('GET', '/api/ai/tools');
    console.log(`- GET /api/ai/tools: HTTP ${tools.status}, total_tools: ${tools.body.total_tools}`);
    if (tools.status !== 200 || tools.body.total_tools !== 18) {
      throw new Error(`Expected 18 tools, got ${tools.body.total_tools}`);
    }

    // 3. POST /api/ai/chat - Tourist Places query
    const c1 = await request('POST', '/api/ai/chat', { message: 'What are the top heritage forts in Jaipur?' });
    console.log(`- POST /api/ai/chat (monuments): HTTP ${c1.status}, engine: ${c1.body.engine}, tool_calls: ${c1.body.tool_calls?.length}`);
    if (c1.status !== 200 || !c1.body.reply) throw new Error('Monument chat failed');

    // 4. POST /api/ai/chat - Stays / Hotels query
    const c2 = await request('POST', '/api/ai/chat', { message: 'Find me luxury heritage hotels in Jaipur', city: 'Jaipur' });
    console.log(`- POST /api/ai/chat (hotels): HTTP ${c2.status}, reply preview: ${c2.body.reply.slice(0, 60)}...`);
    if (c2.status !== 200 || !c2.body.reply.includes('🏨')) throw new Error('Hotel chat failed');

    // 5. POST /api/ai/chat - Culinary / Restaurants query
    const c3 = await request('POST', '/api/ai/chat', { message: 'What authentic food should I eat in Agra?', city: 'Agra' });
    console.log(`- POST /api/ai/chat (culinary): HTTP ${c3.status}, reply preview: ${c3.body.reply.slice(0, 60)}...`);
    if (c3.status !== 200 || !c3.body.reply.includes('🥘')) throw new Error('Culinary chat failed');

    // 6. POST /api/ai/chat - Transit / Transport query
    const c4 = await request('POST', '/api/ai/chat', { message: 'How to reach Varanasi from New Delhi by train?', city: 'Varanasi' });
    console.log(`- POST /api/ai/chat (transit): HTTP ${c4.status}, reply preview: ${c4.body.reply.slice(0, 60)}...`);
    if (c4.status !== 200 || !c4.body.reply.includes('🚆')) throw new Error('Transit chat failed');

    // 7. POST /api/ai/chat - Weather query
    const c5 = await request('POST', '/api/ai/chat', { message: 'What is the climate and best time to visit Shimla?', city: 'Shimla' });
    console.log(`- POST /api/ai/chat (weather): HTTP ${c5.status}, reply preview: ${c5.body.reply.slice(0, 60)}...`);
    if (c5.status !== 200 || !c5.body.reply.includes('🌤️')) throw new Error('Weather chat failed');

    // 8. POST /api/ai/chat - Budget estimation query
    const c6 = await request('POST', '/api/ai/chat', { message: 'Estimate budget for 3 days trip to Rajasthan', city: 'Rajasthan' });
    console.log(`- POST /api/ai/chat (budget): HTTP ${c6.status}, reply preview: ${c6.body.reply.slice(0, 60)}...`);
    if (c6.status !== 200 || !c6.body.reply.includes('💰')) throw new Error('Budget chat failed');

    // 9. POST /api/ai/chat - Emergency helplines query
    const c7 = await request('POST', '/api/ai/chat', { message: 'What is the tourist police emergency number in India?' });
    console.log(`- POST /api/ai/chat (emergency): HTTP ${c7.status}, reply preview: ${c7.body.reply.slice(0, 60)}...`);
    if (c7.status !== 200 || !c7.body.reply.includes('1363')) throw new Error('Emergency chat failed');

    // 10. POST /api/ai/chat - Cultural festivals query
    const c8 = await request('POST', '/api/ai/chat', { message: 'Tell me about cultural festivals in Varanasi' });
    console.log(`- POST /api/ai/chat (festivals): HTTP ${c8.status}, reply preview: ${c8.body.reply.slice(0, 60)}...`);
    if (c8.status !== 200 || !c8.body.reply.includes('🗓️')) throw new Error('Festivals chat failed');

    console.log('\n======================================================');
    console.log('ALL 10 /ai/ INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    serverProc.kill();
    process.exit(process.exitCode || 0);
  }
}

setTimeout(() => {
  if (!testsStarted) {
    console.error('Timeout waiting for test server:\n', output);
    serverProc.kill();
    process.exit(1);
  }
}, 30000);
