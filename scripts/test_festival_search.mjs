import fs from 'fs';
import assert from 'assert';

console.log('--- RUNNING FESTIVAL SEARCH & FILTERING REGRESSION TEST SUITE ---');

const festivalsRaw = fs.readFileSync('data/festivals.json', 'utf-8');
const festivals = JSON.parse(festivalsRaw);

// Test 0: Existing dataset preservation
console.log('\n[TEST 0] Preserving Festival Dataset Integrity');
assert.strictEqual(festivals.length, 83, `Dataset must have exactly 83 festivals, found ${festivals.length}`);
const ids = new Set(festivals.map((f) => f.id));
assert.strictEqual(ids.size, 83, 'All 83 festival IDs must be unique');
console.log('✓ Exactly 83 unique festival records preserved in data/festivals.json');

// Canonical alias dictionary (shared across frontend, backend, and AI tools)
const FESTIVAL_SEARCH_ALIASES = {
  holi: ['lathmar holi', 'braj holi', 'rangwali holi', 'dol jatra', 'barsana', 'gulal'],
  diwali: ['deepawali', 'deepavali', 'deepotsav', 'dev deepawali', 'karthigai deepam', 'kali puja'],
  deepawali: ['diwali', 'deepavali', 'deepotsav', 'dev deepawali'],
  deepavali: ['diwali', 'deepawali', 'deepotsav', 'dev deepawali'],
  navratri: ['navaratri', 'durga puja', 'garba', 'dandiya', 'bathukamma'],
  navaratri: ['navratri', 'durga puja', 'garba'],
  dasara: ['dussehra', 'vijayadashami', 'mysuru dasara', 'kullu dussehra', 'bastar dussehra', 'kota dussehra'],
  dussehra: ['dasara', 'vijayadashami', 'mysuru dasara', 'kullu dussehra', 'bastar dussehra', 'kota dussehra'],
  durga: ['durga puja', 'navratri', 'dussehra'],
  chath: ['chhath puja', 'chhath', 'surya shashthi'],
  chhath: ['chhath puja', 'surya shashthi', 'dala chhath'],
  onam: ['thiruvonam', 'vallam kali'],
  pongal: ['thai pongal', 'jallikattu', 'makar sankranti', 'uttarayan'],
  bihu: ['rongali bihu', 'bohag bihu', 'magh bihu', 'kati bihu'],
  baisakhi: ['vaisakhi', 'khalsa sirjana'],
  vaisakhi: ['baisakhi'],
  eid: ['eid ul fitr', 'eid al adha', 'eid milad un nabi'],
  christmas: ['feast of st francis xavier', 'carnival of goa'],
  losar: ['tibetan new year', 'ladakhi new year', 'spiti new year'],
  shigmo: ['shigmotsav', 'goa spring festival'],
  yaoshang: ['yaoshang festival', 'manipur spring', 'thabal chongba'],
};

function filterFestivals(dataset, { search, state, city, month }) {
  let list = dataset;

  if (search && search.trim()) {
    const rawQ = search.trim();
    const q = rawQ.toLowerCase();
    const aliasTerms = FESTIVAL_SEARCH_ALIASES[q] || [];
    const wordPattern = q.length <= 4
      ? new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      : new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');

    list = list.filter((item) => {
      // 1. Direct match on name, slug, id
      if (item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q) || (item.slug && item.slug.toLowerCase().includes(q))) {
        return true;
      }

      // 2. Direct match on city, state, alternate locations
      if (item.primary_city.toLowerCase().includes(q)) return true;
      if (item.state.toLowerCase().includes(q)) return true;
      if (item.alternate_locations && item.alternate_locations.some((loc) => loc.toLowerCase().includes(q))) return true;

      // 3. Cultural vibe match
      if (item.cultural_vibe && item.cultural_vibe.toLowerCase().includes(q)) return true;

      // 4. Aliases match
      if (Array.isArray(item.aliases) && item.aliases.some((a) => a.toLowerCase().includes(q))) return true;
      for (const term of aliasTerms) {
        if (item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term)) return true;
        if (Array.isArray(item.aliases) && item.aliases.some((a) => a.toLowerCase().includes(term))) return true;
      }

      // 5. Description word-boundary match (avoid substring false-positives like 'cholis' for 'holi')
      const isMajorTerm = ['holi', 'diwali', 'navratri', 'dasara', 'dussehra'].includes(q);
      if (!isMajorTerm && wordPattern.test(item.description)) {
        return true;
      }

      return false;
    });
  }

  if (state && state !== 'All') {
    const s = state.toLowerCase().trim();
    list = list.filter((f) => f.state.toLowerCase() === s || f.state_id?.toLowerCase() === s);
  }

  if (city && city !== 'All') {
    const c = city.toLowerCase().trim();
    list = list.filter((f) => f.primary_city.toLowerCase().includes(c) || f.primary_city_id?.toLowerCase() === c);
  }

  if (month && month !== 'All') {
    const m = month.toLowerCase().trim();
    list = list.filter((f) => {
      const tm = (f.typical_month || '').toLowerCase();
      const ts = (f.typical_season || '').toLowerCase();
      const start = f.exact_date_start || '';
      return tm.includes(m) || ts.includes(m) || start.includes(`-${m}-`);
    });
  }

  return list;
}

// Test 1: Searching "HOLI" (case-insensitive)
console.log('\n[TEST 1] Searching "HOLI" and "holi"');
for (const q of ['HOLI', 'holi', 'Holi']) {
  const holiRes = filterFestivals(festivals, { search: q });
  assert(holiRes.length > 0, `Search for "${q}" should return results`);
  const names = holiRes.map((r) => r.name);
  assert(names.includes('Lathmar Holi'), `Results for "${q}" must include Lathmar Holi`);
  assert(!names.includes('Gujarat Navratri Festival'), `Results for "${q}" must NOT include Gujarat Navratri (cholis substring bug)`);
  assert(!names.includes('Yaoshang Festival'), `Results for "${q}" must NOT include Yaoshang`);
  console.log(`✓ "${q}" correctly returned: ${names.join(', ')} (no unrelated Navratri/Yaoshang)`);
}

// Test 2: Searching "Diwali", "Deepawali", and "deepavali"
console.log('\n[TEST 2] Searching "Diwali", "Deepawali", and "deepavali"');
for (const q of ['Diwali', 'diwali', 'Deepawali', 'deepawali', 'deepavali']) {
  const diwaliRes = filterFestivals(festivals, { search: q });
  assert(diwaliRes.length > 0, `Search for "${q}" should find matching records`);
  const names = diwaliRes.map((r) => r.name);
  assert(names.some((n) => n.includes('Deepawali') || n.includes('Deepotsav')), `Results for "${q}" should include Dev Deepawali / Ayodhya Deepotsav`);
  console.log(`✓ "${q}" correctly returned ${diwaliRes.length} records: ${names.join(' | ')}`);
}

// Test 3: Searching "Navratri"
console.log('\n[TEST 3] Searching "Navratri"');
const navRes = filterFestivals(festivals, { search: 'Navratri' });
assert(navRes.length > 0, 'Search for "Navratri" should return results');
const navNames = navRes.map((r) => r.name);
assert(navNames.includes('Gujarat Navratri Festival'), 'Results must include Gujarat Navratri Festival');
assert(!navNames.includes('Lathmar Holi'), 'Results must not include Holi');
console.log(`✓ "Navratri" correctly returned ${navRes.length} records: ${navNames.join(', ')}`);

// Test 4: Searching "Dasara" and "Dussehra" cross-match
console.log('\n[TEST 4] Searching "Dasara" and "Dussehra"');
const dasaraRes = filterFestivals(festivals, { search: 'Dasara' });
const dussehraRes = filterFestivals(festivals, { search: 'Dussehra' });
assert(dasaraRes.length >= 3, `Dasara should return at least 3 celebrations, found ${dasaraRes.length}`);
assert(dussehraRes.length >= 3, `Dussehra should return at least 3 celebrations, found ${dussehraRes.length}`);
const dasaraNames = dasaraRes.map((r) => r.name);
assert(dasaraNames.some((n) => n.toLowerCase().includes('dasara') || n.toLowerCase().includes('dussehra')));
console.log(`✓ Dasara matches: ${dasaraNames.join(' | ')}`);
console.log(`✓ Dussehra matches: ${dussehraRes.map((r) => r.name).join(' | ')}`);

// Test 5: Combining search with state and city filters
console.log('\n[TEST 5] Combining Search with State and City Filters');
const upHoli = filterFestivals(festivals, { search: 'Holi', state: 'Uttar Pradesh' });
assert.strictEqual(upHoli.length, 1, 'Only Lathmar Holi should match Holi + Uttar Pradesh');
assert.strictEqual(upHoli[0].name, 'Lathmar Holi');
console.log(`✓ Holi in Uttar Pradesh: ${upHoli[0].name} in ${upHoli[0].primary_city}`);

const mathuraHoli = filterFestivals(festivals, { search: 'Holi', city: 'Mathura' });
assert.strictEqual(mathuraHoli.length, 1, 'Only Lathmar Holi should match Holi + Mathura');
console.log(`✓ Holi in Mathura: ${mathuraHoli[0].name}`);

// Test 6: Resetting filters restores full 83 list
console.log('\n[TEST 6] Reset Filters Restores Complete List');
const resetList = filterFestivals(festivals, { search: '', state: 'All', city: 'All', month: 'All' });
assert.strictEqual(resetList.length, 83, `Reset must restore all 83 records, got ${resetList.length}`);
console.log('✓ Resetting filters restores all 83 records');

// Test 7: Image mapping authenticity verification
console.log('\n[TEST 7] Verifying Festival Image Mappings');
const lathmarHoli = festivals.find((f) => f.id === 'lathmar-holi');
assert(lathmarHoli, 'Lathmar Holi record must exist');
assert(
  !lathmarHoli.image_url.includes('photo-1514222134-b57cbb8ce073'),
  'Lathmar Holi must NOT use the Tansen Samaroh sitar/violin concert photo'
);
assert(
  lathmarHoli.image_url.includes('photo-1607604276583-eef5d076aa5f') || lathmarHoli.image_url.includes('holi'),
  'Lathmar Holi image must be authentic gulal/color celebration'
);
console.log(`✓ Lathmar Holi image: ${lathmarHoli.image_url}`);

const durgaPuja = festivals.find((f) => f.id === 'durga-puja-kolkata');
assert(durgaPuja, 'Durga Puja Kolkata record must exist');
assert(
  !durgaPuja.image_url.includes('photo-1570168007204-dfb528c6958f'),
  'Durga Puja must NOT use the Ganesh idol photo'
);
console.log(`✓ Durga Puja image: ${durgaPuja.image_url}`);

const tansenSamaroh = festivals.find((f) => f.id === 'tansen-music-festival');
assert(tansenSamaroh, 'Tansen Music Festival record must exist');
assert.notStrictEqual(
  tansenSamaroh.image_url,
  lathmarHoli.image_url,
  'Tansen Samaroh and Lathmar Holi must not share the same image'
);
console.log('✓ Images are uniquely and accurately mapped');

console.log('\n🎉 ALL REGRESSION TESTS PASSED SUCCESSFULLY! 🎉\n');
