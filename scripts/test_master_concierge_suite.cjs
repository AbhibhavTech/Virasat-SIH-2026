const http = require('http');
const { spawn } = require('child_process');

console.log('================================================================');
console.log('VIRASAT MASTER CONCIERGE & MULTI-TURN AI VERIFICATION SUITE');
console.log('================================================================\n');

const PORT = 3014;
const env = { ...process.env, PORT: String(PORT), NODE_ENV: 'production' };

const path = require('path');
const projectRoot = path.resolve(__dirname, '..');
const cmd = process.platform === 'win32' ? 'cmd.exe' : 'npx';
const args = process.platform === 'win32' ? ['/c', 'npx', 'tsx', 'server.ts'] : ['tsx', 'server.ts'];
const serverProc = spawn(cmd, args, { env, cwd: projectRoot });

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

    // =========================================================================
    // SECTION 19 & 20: VIRASAT CONCIERGE & GATEWAY OF INDIA MULTI-TURN FLOW
    // =========================================================================
    const gwSession = 'gateway-session-' + Date.now();

    // TEST 11: Direct Monument Resolution - "mujhe gateway of india k baare main batao"
    console.log('\n--- TEST 11: CRITICAL BUG FIX - "mujhe gateway of india k baare main batao" ---');
    const t11 = await request('POST', '/api/ai/chat', {
      message: 'mujhe gateway of india k baare main batao',
      session_id: gwSession,
    });
    console.log('Query: "mujhe gateway of india k baare main batao"');
    console.log('Reply Preview:\n', t11.body.reply.slice(0, 400) + '...');
    console.log('Actions:', t11.body.suggested_actions);
    if (t11.body.reply.includes('Main Bharat ke sabhi 28 States aur 8 Union Territories ke verified monuments')) {
      throw new Error('Test 11 failed: Canned introduction returned instead of Gateway of India dossier!');
    }
    if (!t11.body.reply.includes('Gateway of India') || !t11.body.reply.includes('Mumbai')) {
      throw new Error('Test 11 failed: Gateway of India and Mumbai not resolved in reply');
    }
    if (!t11.body.reply.includes('Historical Significance') || !t11.body.reply.includes('Architecture')) {
      throw new Error('Test 11 failed: Structured sections missing from monument reply');
    }

    // TEST 12: Contextual Nearby Query - "nearby kya hai?"
    console.log('\n--- TEST 12: Contextual Nearby - "nearby kya hai?" ---');
    const t12 = await request('POST', '/api/ai/chat', {
      message: 'nearby kya hai?',
      session_id: gwSession,
    });
    console.log('Query: "nearby kya hai?"');
    console.log('Reply Preview:\n', t12.body.reply.slice(0, 300) + '...');
    if (!t12.body.reply.includes('Gateway of India') && !t12.body.reply.includes('Mumbai')) {
      throw new Error('Test 12 failed: Contextual nearby did not associate with Gateway of India / Mumbai');
    }

    // TEST 13: Contextual 1-Day Plan - "1 din ka plan bana"
    console.log('\n--- TEST 13: Contextual 1-Day Itinerary - "1 din ka plan bana" ---');
    const t13 = await request('POST', '/api/ai/chat', {
      message: '1 din ka plan bana',
      session_id: gwSession,
    });
    console.log('Query: "1 din ka plan bana"');
    console.log('Reply Preview:\n', t13.body.reply.slice(0, 350) + '...');
    if (!t13.body.reply.includes('Day 1') || !t13.body.reply.includes('Mumbai')) {
      throw new Error('Test 13 failed: Did not generate 1-day Mumbai itinerary centered on Gateway of India');
    }

    // TEST 14: Contextual Budget Optimization - "budget 2000 rakho"
    console.log('\n--- TEST 14: Contextual Budget Optimization - "budget 2000 rakho" ---');
    const t14 = await request('POST', '/api/ai/chat', {
      message: 'budget 2000 rakho',
      session_id: gwSession,
    });
    console.log('Query: "budget 2000 rakho"');
    console.log('Reply Preview:\n', t14.body.reply.slice(0, 300) + '...');
    if (!t14.body.reply.includes('2,000') && !t14.body.reply.includes('1,200') && !t14.body.reply.includes('Budget')) {
      throw new Error('Test 14 failed: Budget not optimized to ₹2,000');
    }

    // TEST 15: Contextual Food Addition - "food bhi add karo"
    console.log('\n--- TEST 15: Contextual Food Integration - "food bhi add karo" ---');
    const t15 = await request('POST', '/api/ai/chat', {
      message: 'food bhi add karo',
      session_id: gwSession,
    });
    console.log('Query: "food bhi add karo"');
    console.log('Reply Preview:\n', t15.body.reply.slice(0, 300) + '...');
    if (!t15.body.reply.toLowerCase().includes('food') && !t15.body.reply.toLowerCase().includes('culinary')) {
      throw new Error('Test 15 failed: Food experiences not integrated');
    }

    // TEST 16: Contextual Hotels - "ab hotel bata"
    console.log('\n--- TEST 16: Contextual Hotels - "ab hotel bata" ---');
    const t16 = await request('POST', '/api/ai/chat', {
      message: 'ab hotel bata',
      session_id: gwSession,
    });
    console.log('Query: "ab hotel bata"');
    console.log('Reply Preview:\n', t16.body.reply.slice(0, 350) + '...');
    if (!t16.body.reply.includes('Taj Mahal Palace') && !t16.body.reply.includes('Mumbai')) {
      throw new Error('Test 16 failed: Did not recommend Mumbai/Colaba hotels near Gateway of India');
    }

    // TEST 17: Food query directly - "Gateway of India ke paas food kaha milega?"
    console.log('\n--- TEST 17: Direct Food Query - "Gateway of India ke paas food kaha milega?" ---');
    const t17 = await request('POST', '/api/ai/chat', {
      message: 'Gateway of India ke paas food kaha milega?',
    });
    console.log('Query: "Gateway of India ke paas food kaha milega?"');
    console.log('Reply Preview:\n', t17.body.reply.slice(0, 300) + '...');
    if (!t17.body.reply.includes('Cafe Mondegar') && !t17.body.reply.includes('Bademiya') && !t17.body.reply.includes('Mumbai')) {
      throw new Error('Test 17 failed: Colaba culinary landmarks missing');
    }

    // TEST 18: Gateway of India History
    console.log('\n--- TEST 18: History Query - "Gateway of India ka history batao" ---');
    const t18 = await request('POST', '/api/ai/chat', {
      message: 'Gateway of India ka history batao',
    });
    console.log('Query: "Gateway of India ka history batao"');
    console.log('Reply Preview:\n', t18.body.reply.slice(0, 300) + '...');
    if (!t18.body.reply.includes('George V') && !t18.body.reply.includes('1911')) {
      throw new Error('Test 18 failed: Historical facts missing');
    }

    // TEST 19: Destination Info - "Jaipur ke baare mein batao"
    console.log('\n--- TEST 19: Destination Info - "Jaipur ke baare mein batao" ---');
    const t19 = await request('POST', '/api/ai/chat', {
      message: 'Jaipur ke baare mein batao',
    });
    console.log('Query: "Jaipur ke baare mein batao"');
    console.log('Reply Preview:\n', t19.body.reply.slice(0, 300) + '...');
    if (!t19.body.reply.includes('Jaipur') || (!t19.body.reply.includes('Hawa Mahal') && !t19.body.reply.includes('Rajasthan'))) {
      throw new Error('Test 19 failed: Jaipur details missing');
    }

    // TEST 20: Hampi query - "Tell me about Hampi"
    console.log('\n--- TEST 20: Hampi Query - "Tell me about Hampi" ---');
    const t20 = await request('POST', '/api/ai/chat', {
      message: 'Tell me about Hampi',
    });
    console.log('Query: "Tell me about Hampi"');
    console.log('Reply Preview:\n', t20.body.reply.slice(0, 300) + '...');
    if (!t20.body.reply.includes('Hampi') || !t20.body.reply.includes('Karnataka')) {
      throw new Error('Test 20 failed: Hampi details missing');
    }

    // TEST 21: State Query - "Rajasthan ke best heritage places batao"
    console.log('\n--- TEST 21: State Query - "Rajasthan ke best heritage places batao" ---');
    const t21 = await request('POST', '/api/ai/chat', {
      message: 'Rajasthan ke best heritage places batao',
    });
    console.log('Query: "Rajasthan ke best heritage places batao"');
    console.log('Reply Preview:\n', t21.body.reply.slice(0, 300) + '...');
    if (!t21.body.reply.includes('Rajasthan') && !t21.body.reply.includes('Jaipur')) {
      throw new Error('Test 21 failed: Rajasthan heritage places missing');
    }

    // TEST 22: What is Virasat
    console.log('\n--- TEST 22: Explaining Virasat - "what is Virasat?" ---');
    const t22 = await request('POST', '/api/ai/chat', {
      message: 'what is Virasat?',
    });
    console.log('Query: "what is Virasat?"');
    console.log('Reply Preview:\n', t22.body.reply.slice(0, 300) + '...');
    if (!t22.body.reply.includes('Virasat') && !t22.body.reply.includes('heritage')) {
      throw new Error('Test 22 failed: Virasat explanation missing');
    }

    console.log('\n================================================================');
    console.log('🎉 ALL 22 MASTER CONCIERGE & MULTI-TURN AI TESTS PASSED!');
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
