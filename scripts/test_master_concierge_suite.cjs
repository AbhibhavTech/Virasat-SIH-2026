const http = require('http');
const { spawn } = require('child_process');

console.log('================================================================');
console.log('VIRASAT MASTER CONCIERGE & MULTI-TURN AI VERIFICATION SUITE');
console.log('================================================================\n');

const PORT = 3014;
const env = { ...process.env, PORT: String(PORT), NODE_ENV: 'production' };

console.log(`[1] Launching Virasat server on port ${PORT}...`);
const cmd = process.platform === 'win32' ? 'cmd.exe' : 'npx';
const args = process.platform === 'win32' ? ['/c', 'npx', 'tsx', 'server.ts'] : ['tsx', 'server.ts'];
const serverProc = spawn(cmd, args, { env });

let output = '';
let testsStarted = false;

serverProc.stdout.on('data', (d) => {
  output += d.toString();
  if (output.includes(`http://0.0.0.0:${PORT}`) && !testsStarted) {
    testsStarted = true;
    runMasterTests();
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

async function runMasterTests() {
  try {
    console.log('[2] Running Multi-Turn Travel & Heritage Concierge Tests:\n');
    const sessionId = 'test-sih-session-' + Date.now();

    // TEST 1: Greeting
    console.log('--- TEST 1: Casual Greeting ---');
    const t1 = await request('POST', '/api/ai/chat', { message: 'hello', session_id: sessionId });
    console.log('Query: "hello"');
    console.log('Reply:', t1.body.reply);
    console.log('Actions:', t1.body.suggested_actions);
    if (!t1.body.reply.toLowerCase().includes('namaste') && !t1.body.reply.toLowerCase().includes('virasat')) {
      throw new Error('Test 1 failed: Expected warm greeting');
    }
    if (t1.body.reply.includes('Archaeological Survey of India (ASI) aur State Tourism')) {
      throw new Error('Test 1 failed: Canned monument response returned for hello!');
    }

    // TEST 2: Casual Conversation
    console.log('\n--- TEST 2: Casual In-Conversation Question ---');
    const t2 = await request('POST', '/api/ai/chat', { message: 'kaise ho', session_id: sessionId });
    console.log('Query: "kaise ho"');
    console.log('Reply:', t2.body.reply);
    if (!t2.body.reply.toLowerCase().includes('badhiya') && !t2.body.reply.toLowerCase().includes('aap')) {
      throw new Error('Test 2 failed: Expected conversational reply to kaise ho');
    }

    // TEST 3: Multi-parameter Trip Planning in Hinglish
    console.log('\n--- TEST 3: Complex Trip Planning in Hinglish ---');
    const t3 = await request('POST', '/api/ai/chat', {
      message: 'bhai mujhe 3 din ka Jaipur trip bana de, 15k ke andar, heritage aur local food ke saath',
      session_id: sessionId,
    });
    console.log('Query: "bhai mujhe 3 din ka Jaipur trip bana de, 15k ke andar, heritage aur local food ke saath"');
    console.log('Reply Preview:\n', t3.body.reply.slice(0, 300) + '...');
    console.log('Actions:', t3.body.suggested_actions);
    console.log('Sources:', t3.body.sources);
    if (!t3.body.reply.includes('Day 1') || !t3.body.reply.includes('Jaipur')) {
      throw new Error('Test 3 failed: Did not generate day-by-day itinerary');
    }
    if (!t3.body.context?.memory?.destination || t3.body.context?.memory?.destination !== 'Jaipur') {
      throw new Error('Test 3 failed: Memory destination not saved as Jaipur');
    }

    // TEST 4: Multi-turn State Modification (Hotel preference)
    console.log('\n--- TEST 4: Multi-Turn Memory - "hotel moderate rakh" ---');
    const t4 = await request('POST', '/api/ai/chat', { message: 'hotel moderate rakh', session_id: sessionId });
    console.log('Query: "hotel moderate rakh"');
    console.log('Reply:', t4.body.reply);
    if (t4.body.context?.memory?.hotel_tier !== 'moderate') {
      throw new Error(`Test 4 failed: Expected hotel_tier moderate, got ${t4.body.context?.memory?.hotel_tier}`);
    }

    // TEST 5: Multi-turn State Modification (Transport preference)
    console.log('\n--- TEST 5: Multi-Turn Memory - "travel cheap karo" ---');
    const t5 = await request('POST', '/api/ai/chat', { message: 'travel cheap karo', session_id: sessionId });
    console.log('Query: "travel cheap karo"');
    console.log('Reply:', t5.body.reply);

    // TEST 6: Multi-turn Itinerary Modification (Add spiritual place)
    console.log('\n--- TEST 6: Multi-Turn Memory - "ek spiritual place add karo" ---');
    const t6 = await request('POST', '/api/ai/chat', { message: 'ek spiritual place add karo', session_id: sessionId });
    console.log('Query: "ek spiritual place add karo"');
    console.log('Reply Preview:\n', t6.body.reply.slice(0, 250) + '...');
    if (!t6.body.reply.includes('Day 1') && !t6.body.reply.includes('Spiritual') && !t6.body.reply.includes('Mandir') && !t6.body.reply.includes('Temple')) {
      throw new Error('Test 6 failed: Spiritual place was not integrated into itinerary');
    }

    // TEST 7: Budget Query using Conversation State
    console.log('\n--- TEST 7: Multi-Turn Budget Breakdown - "ab final budget bata" ---');
    const t7 = await request('POST', '/api/ai/chat', { message: 'ab final budget bata', session_id: sessionId });
    console.log('Query: "ab final budget bata"');
    console.log('Reply:\n', t7.body.reply);
    if (!t7.body.reply.includes('Hotels') && !t7.body.reply.includes('Transport')) {
      throw new Error('Test 7 failed: Budget calculation missing breakdown');
    }

    // TEST 8: Comparison Mode
    console.log('\n--- TEST 8: Comparison Mode - "Jaipur vs Udaipur" ---');
    const t8 = await request('POST', '/api/ai/chat', { message: 'Jaipur vs Udaipur' });
    console.log('Query: "Jaipur vs Udaipur"');
    console.log('Reply Preview:\n', t8.body.reply.slice(0, 250) + '...');
    if (!t8.body.reply.includes('Jaipur') || !t8.body.reply.includes('Udaipur')) {
      throw new Error('Test 8 failed: Comparison did not mention both cities');
    }

    // TEST 9: "You Decide" Mode
    console.log('\n--- TEST 9: "You Decide" Mode ---');
    const t9 = await request('POST', '/api/ai/chat', { message: 'I have 10000 rupees and 3 days, you decide where I should go' });
    console.log('Query: "I have 10000 rupees and 3 days, you decide where I should go"');
    console.log('Reply Preview:\n', t9.body.reply.slice(0, 250) + '...');
    if (!t9.body.reply.includes('budget') && !t9.body.reply.includes('option') && !t9.body.reply.includes('Jaipur') && !t9.body.reply.includes('Agra')) {
      throw new Error('Test 9 failed: You decide did not offer recommendations');
    }

    // TEST 10: Monument Intelligence
    console.log('\n--- TEST 10: Monument Intelligence with Provenance ---');
    const t10 = await request('POST', '/api/ai/chat', { message: 'Hawa Mahal ke baare mein batao' });
    console.log('Query: "Hawa Mahal ke baare mein batao"');
    console.log('Reply Preview:\n', t10.body.reply.slice(0, 250) + '...');
    console.log('Sources:', t10.body.sources);
    if (!t10.body.reply.toLowerCase().includes('hawa mahal') && !t10.body.reply.toLowerCase().includes('jaipur')) {
      throw new Error('Test 10 failed: Monument info missing');
    }

    console.log('\n================================================================');
    console.log('🎉 ALL 10 MASTER CONCIERGE & MULTI-TURN AI TESTS PASSED!');
    console.log('================================================================\n');
  } catch (err) {
    console.error('❌ Master Test suite failed:', err);
    process.exitCode = 1;
  } finally {
    serverProc.kill();
    process.exit(process.exitCode || 0);
  }
}

setTimeout(() => {
  if (!testsStarted) {
    console.error('Timeout waiting for server startup:\n', output);
    serverProc.kill();
    process.exit(1);
  }
}, 35000);
