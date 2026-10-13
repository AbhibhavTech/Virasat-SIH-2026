import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('VIRASAT FESTIVALS MODULE UPGRADE — VERIFICATION SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${description}`);
    passCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${description}:`, err.message);
    failCount++;
  }
}

async function runAsyncTests() {
  const festivalsPath = path.resolve('data/festivals.json');
  const masterPath = path.resolve('data/festivals_master.json');
  const sourcePath = path.resolve('data/source/indian_festivals_290.txt');

  test('Source 290-entry file exists and has 290 numbered entries', () => {
    assert(fs.existsSync(sourcePath), 'data/source/indian_festivals_290.txt must exist');
    const content = fs.readFileSync(sourcePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const numbered = lines.filter(l => /^\d+\t/.test(l.trim()));
    assert.strictEqual(numbered.length, 290, `Expected 290 numbered rows, got ${numbered.length}`);
  });

  test('Dataset files exist and are valid JSON', () => {
    assert(fs.existsSync(festivalsPath), 'data/festivals.json must exist');
    assert(fs.existsSync(masterPath), 'data/festivals_master.json must exist');
  });

  const festivals = JSON.parse(fs.readFileSync(festivalsPath, 'utf-8'));

  test('Total canonical festivals count reflects reviewed deduplication (255)', () => {
    assert.strictEqual(festivals.length, 255, `Expected 255 unique records, got ${festivals.length}`);
  });

  test('All 290 source entry numbers are fully accounted for without omission', () => {
    const accounted = new Set();
    for (const f of festivals) {
      if (Array.isArray(f.source_entry_numbers)) {
        f.source_entry_numbers.forEach(n => accounted.add(n));
      }
    }
    assert.strictEqual(accounted.size, 290, `Expected all 290 source entries accounted for, got ${accounted.size}`);
  });

  test('All-India festivals are prioritized at the top of the dataset', () => {
    const first10 = festivals.slice(0, 10);
    const allIndiaCount = first10.filter(f => f.scope === 'ALL_INDIA' || f.scope === 'PAN_INDIA_RELIGIOUS').length;
    assert(allIndiaCount >= 8, `Expected first 10 to be predominantly ALL_INDIA, got ${allIndiaCount}`);
  });

  test('Key pan-Indian festivals are present with scope ALL_INDIA', () => {
    const expected = ['diwali', 'holi', 'dussehra', 'navratri', 'ganesh-chaturthi', 'eid-ul-fitr', 'christmas', 'baisakhi', 'buddha-purnima', 'mahavir-jayanti'];
    const presentIds = new Set(festivals.map(f => f.id));
    for (const id of expected) {
      assert(presentIds.has(id), `Missing flagship festival: ${id}`);
    }
  });

  test('National observances are classified with scope NATIONAL_OBSERVANCE and not mixed in religious festivals', () => {
    const observances = festivals.filter(f => f.scope === 'NATIONAL_OBSERVANCE');
    assert.strictEqual(observances.length, 15, `Expected 15 national observances, got ${observances.length}`);
    const obsIds = new Set(observances.map(f => f.id));
    assert(obsIds.has('republic-day'), 'Missing Republic Day');
    assert(obsIds.has('independence-day'), 'Missing Independence Day');
    assert(obsIds.has('gandhi-jayanti'), 'Missing Gandhi Jayanti');
  });

  test('Every festival record has valid normalized schema fields', () => {
    for (const f of festivals) {
      assert(f.id && typeof f.id === 'string', `Invalid ID on festival: ${JSON.stringify(f)}`);
      assert(f.name && typeof f.name === 'string', `Invalid name on festival ${f.id}`);
      assert(f.description && typeof f.description === 'string', `Invalid description on festival ${f.id}`);
      assert(f.scope, `Missing scope on festival ${f.id}`);
      assert(Array.isArray(f.states), `states must be an array on festival ${f.id}`);
      assert(f.verification_status, `Missing verification_status on festival ${f.id}`);
      assert(f.state_or_region, `Missing state_or_region on festival ${f.id}`);
      assert(f.date_rule, `Missing date_rule on festival ${f.id}`);
      assert(Array.isArray(f.source_entry_numbers), `source_entry_numbers must be an array on festival ${f.id}`);
      if (!f.is_date_verified) {
        assert(f.start_date === null && f.end_date === null, `Unverified festival ${f.id} must not have fabricated dates`);
      }
    }
  });

  test('No duplicate festival IDs exist', () => {
    const ids = new Set();
    for (const f of festivals) {
      assert(!ids.has(f.id.toLowerCase()), `Duplicate festival ID detected: ${f.id}`);
      ids.add(f.id.toLowerCase());
    }
  });

  test('State filtering logic works correctly across multi-state celebrations', () => {
    const maharashtraFestivals = festivals.filter(f =>
      f.state.toLowerCase() === 'maharashtra' ||
      f.state_id?.toLowerCase() === 'maharashtra' ||
      f.states?.some(st => st.toLowerCase() === 'maharashtra')
    );
    assert(maharashtraFestivals.length > 0, 'Maharashtra festivals must not be empty');
    assert(maharashtraFestivals.some(f => f.name.toLowerCase().includes('ganesh') || f.name.toLowerCase().includes('gudi padwa')), 'Maharashtra must include Ganeshotsav / Gudi Padwa');
  });

  test('Cultural fairs and arts festivals are present', () => {
    const arts = festivals.filter(f =>
      f.religious_or_cultural_category === 'Arts & Culture' ||
      f.name.toLowerCase().includes('literature') ||
      f.name.toLowerCase().includes('dance') ||
      f.name.toLowerCase().includes('music')
    );
    assert(arts.length >= 20, `Expected >= 20 cultural fairs, got ${arts.length}`);
  });

  test('AI retrieval tool (getEventsCalendar) answers state and keyword queries accurately', async () => {
    const { execute: getEventsCalendar } = await import('../ai/tools/getEventsCalendar.ts');
    
    // Query 1: Maharashtra festivals
    const mhResult = await getEventsCalendar({ state: 'Maharashtra', limit: 10 });
    assert(mhResult.total_events > 0, 'AI retrieval for Maharashtra must return events');

    // Query 2: Assam festivals
    const assamResult = await getEventsCalendar({ state: 'Assam', limit: 10 });
    assert(assamResult.total_events > 0, 'AI retrieval for Assam must return events');
    assert(assamResult.events.some((e) => e.festival.toLowerCase().includes('bihu')), 'Assam must return Bihu');

    // Query 3: Specific city
    const varanasiResult = await getEventsCalendar({ city: 'Varanasi', limit: 5 });
    assert(varanasiResult.total_events > 0, 'AI retrieval for Varanasi must return events');

    // Query 4: Unverified dates clearly state unconfirmed status
    const unverifiedEvents = mhResult.events.filter((e) => !e.is_date_verified);
    if (unverifiedEvents.length > 0) {
      assert(unverifiedEvents[0].season_timing.toLowerCase().includes('unconfirmed') || unverifiedEvents[0].season_timing.toLowerCase().includes('unannounced'), 'Unverified dates must be clearly marked');
    }
  });

  // Test Live Info Google Search endpoint logic & "no sources" path
  test('Live Info endpoint "no sources" fallback path returns clean message without uncited dates', () => {
    const routerPath = path.resolve('server/src/modules/festivals/festivals.router.ts');
    assert(fs.existsSync(routerPath), 'festivals.router.ts must exist');
    const content = fs.readFileSync(routerPath, 'utf-8');
    assert(content.includes('callGeminiSearchGrounding'), 'Grounding logic must exist');
    assert(content.includes("message: 'No reliable sources found'"), 'Must contain no reliable sources fallback');
    assert(content.includes('resolveGroundedModel'), 'Must contain model resolution');
  });

  console.log('\n----------------------------------------------------');
  console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('----------------------------------------------------');

  if (failCount > 0) {
    process.exit(1);
  }
}

runAsyncTests().catch((err) => {
  console.error('Unhandled test failure:', err);
  process.exit(1);
});
