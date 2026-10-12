import fs from 'fs';
import path from 'path';

// Load raw 290 master items
const masterPath = path.resolve('data/festivals_master.json');
const masterFestivals = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

// Extract pristine 83 festivals from SQL seed
const sqlPath = path.resolve('server/src/db/migrations/006_festivals_migration_and_seed.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

function parseSqlSeed() {
  const lines = sqlContent.split('\n');
  const festivals = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("('")) continue;
    // Extract values: ('id', 'name', ...)
    // Split by comma ignoring commas inside strings
    const match = trimmed.match(/^\s*\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',/);
    if (match) {
      const id = match[1];
      const name = match[2];
      const slug = match[3];
      const state = match[4];
      const state_id = match[5];
      const primary_city = match[6];

      // Extract full row fields using regex
      const rawTokens = trimmed
        .replace(/^\s*\(/, '')
        .replace(/\)[,;]?\s*$/, '')
        .split(/,\s*(?=(?:[^']*'[^']*')*[^']*$)/);

      const unquote = (s) => (s ? s.trim().replace(/^'|'$/g, '').replace(/''/g, "'") : '');

      const fest = {
        id: unquote(rawTokens[0]),
        name: unquote(rawTokens[1]),
        slug: unquote(rawTokens[2]),
        state: unquote(rawTokens[3]),
        state_id: unquote(rawTokens[4]),
        primary_city: unquote(rawTokens[5]),
        primary_city_id: unquote(rawTokens[6]),
        alternate_locations: rawTokens[7] ? rawTokens[7].replace(/[{}"']/g, '').split(',').filter(Boolean) : [],
        description: unquote(rawTokens[8]),
        cultural_vibe: unquote(rawTokens[9]),
        typical_season: unquote(rawTokens[10]),
        typical_month: unquote(rawTokens[11]),
        exact_date_start: unquote(rawTokens[12]) || undefined,
        exact_date_end: unquote(rawTokens[13]) || undefined,
        is_date_verified: rawTokens[14] ? rawTokens[14].trim() === 'TRUE' : false,
        is_recurring: rawTokens[15] ? rawTokens[15].trim() === 'TRUE' : true,
        associated_places: rawTokens[16] ? rawTokens[16].replace(/[{}"']/g, '').split(',').filter(Boolean) : [],
        lat: rawTokens[17] && rawTokens[17].trim() !== 'NULL' ? parseFloat(rawTokens[17]) : undefined,
        lng: rawTokens[18] && rawTokens[18].trim() !== 'NULL' ? parseFloat(rawTokens[18]) : undefined,
        image_url: unquote(rawTokens[19]),
        source_url: unquote(rawTokens[20]),
        source_name: unquote(rawTokens[21]),
        license: unquote(rawTokens[22]),
        attribution_text: unquote(rawTokens[23]),
        verification_status: unquote(rawTokens[24]) || 'verified',
        created_at: unquote(rawTokens[25]) || new Date().toISOString(),
        updated_at: unquote(rawTokens[26]) || new Date().toISOString(),
      };
      festivals.push(fest);
    }
  }
  return festivals;
}

const pristine83 = parseSqlSeed();
console.log(`Parsed ${pristine83.length} pristine festivals from SQL seed.`);

// Explicit mapping dictionary from existing IDs to master IDs
const EXPLICIT_ID_MAP = {
  'ganeshotsav-maharashtra': 'ganesh-chaturthi',
  'durga-puja-kolkata': 'durga-puja',
  'baisakhi': 'vaisakhi-baisakhi',
  'sonepur-cattle-fair': 'sonepur-mela',
  'tansen-music-festival': 'tansen-music-samaroh',
  'desert-festival-jaisalmer': 'desert-festival-jaisalmer',
  'pushkar-camel-fair': 'pushkar-camel-fair',
  'jaipur-literature-festival': 'jaipur-literature-festival-jlf',
  'hampi-utsav': 'hampi-utsav-vijaya-utsav',
  'international-kite-festival': 'international-kite-festival-uttarayan',
  'bohag-bihu': 'bohag-bihu-rongali-bihu',
  'khajuraho-dance-festival': 'khajuraho-dance-festival',
  'ellora-ajanta-festival': 'ellora-ajanta-festival',
  'sangai-festival': 'sangai-festival',
  'saga-dawa': 'saga-dawa',
  'pongal-tamil-nadu': 'pongal',
  'jallikattu': 'jallikattu',
  'bonalu': 'bonalu',
  'bathukamma': 'bathukamma',
  'kharchi-puja': 'kharchi-puja',
  'dev-deepawali': 'dev-deepawali',
  'hemis-festival': 'hemis-festival',
  'navratri-gujarat': 'sharad-navratri',
  'mysore-dasara': 'mysore-dasara',
  'kullu-dussehra': 'kullu-dussehra',
  'thrissur-pooram': 'thrissur-pooram',
  'kambala': 'kambala',
  'goa-carnival': 'goa-carnival',
  'bastar-dussehra': 'bastar-dussehra',
  'losar': 'losar',
  'ziro-festival-of-music': 'ziro-festival-of-music',
  'eid-ul-fitr': 'eid-ul-fitr',
  'eid-ul-adha': 'eid-ul-adha-bakrid',
  'christmas-goa': 'christmas',
  'ugadi-andhra-pradesh': 'ugadi',
  'dree-festival': 'dree-festival',
  'mahavir-jayanti-bihar': 'mahavir-jayanti',
  'karma-utsav': 'karam-karma',
  'yaoshang-manipur': 'yaoshang-festival',
  'gangaur-festival': 'gangaur-festival',
  'medaram-jathara': 'medaram-jatara',
  'ganga-dussehra': 'ganga-dussehra',
  'ambubachi-mela': 'ambubachi-mela',
  'sarhul': 'sarhul',
  'onam': 'onam',
  'wangala-festival': 'wangala-festival',
  'chapchar-kut': 'chapchar-kut',
  'hornbill-festival': 'hornbill-festival',
  'puri-rath-yatra': 'puri-rath-yatra',
  'rann-utsav': 'rann-utsav',
  'surajkund-mela': 'surajkund-crafts-mela',
  'konark-dance-festival': 'konark-dance-festival',
  'sand-art-festival': 'konark-dance-sand-art-festival',
  'tulip-festival-srinagar': 'tulip-festival-srinagar',
  'ladakh-festival': 'ladakh-festival',
  'lathmar-holi': 'lathmar-holi-barsana-nandgaon',
};

// Map master items by id
const masterMap = new Map();
masterFestivals.forEach((m) => masterMap.set(m.id, m));

const matchedPristineIds = new Set();
const mergedList = [];
let matchedCount = 0;
let newlyAddedCount = 0;

for (const master of masterFestivals) {
  // Check if any pristine 83 maps to this master
  let pristineMatch = null;

  for (const [pId, mId] of Object.entries(EXPLICIT_ID_MAP)) {
    if (mId === master.id) {
      pristineMatch = pristine83.find((p) => p.id === pId);
      if (pristineMatch) break;
    }
  }

  if (!pristineMatch) {
    pristineMatch = pristine83.find(
      (p) => p.id === master.id || p.name.toLowerCase() === master.name.toLowerCase()
    );
  }

  if (pristineMatch) {
    matchedCount++;
    matchedPristineIds.add(pristineMatch.id);

    // Merge: keep pristine authentic photos and coordinates, fill in master schema fields
    const combinedStates = Array.from(new Set([
      ...(master.states || []),
      ...(pristineMatch.state ? [pristineMatch.state] : []),
    ]));

    const combinedAliases = Array.from(new Set([
      ...(pristineMatch.aliases || []),
      ...(master.aliases || []),
      master.name,
    ])).filter((a) => a.toLowerCase() !== pristineMatch.name.toLowerCase());

    let finalImageUrl = pristineMatch.image_url || '';
    if (pristineMatch.id === 'lathmar-holi') {
      finalImageUrl = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80';
    } else if (pristineMatch.id === 'durga-puja-kolkata') {
      finalImageUrl = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80';
    }

    mergedList.push({
      id: pristineMatch.id,
      name: pristineMatch.name,
      slug: pristineMatch.slug || pristineMatch.id,
      aliases: combinedAliases,
      state: pristineMatch.state || (master.states[0] || 'All India'),
      state_id: pristineMatch.state_id || (master.states[0] ? master.states[0].toLowerCase().replace(/\s+/g, '-') : 'all-india'),
      primary_city: pristineMatch.id === 'lathmar-holi' ? 'Mathura' : (pristineMatch.primary_city || (master.states[0] || 'Pan-India')),
      primary_city_id: pristineMatch.primary_city_id || (master.states[0] ? master.states[0].toLowerCase().replace(/\s+/g, '-') : 'all-india'),
      alternate_locations: pristineMatch.alternate_locations && pristineMatch.alternate_locations.length > 0
        ? pristineMatch.alternate_locations
        : master.states.slice(1),
      description: pristineMatch.description || master.description,
      cultural_vibe: pristineMatch.cultural_vibe || `${master.religion_or_category} Celebration`,
      typical_season: pristineMatch.typical_season || 'Annual Observance',
      typical_month: pristineMatch.typical_month || undefined,
      exact_date_start: pristineMatch.exact_date_start || undefined,
      exact_date_end: pristineMatch.exact_date_end || undefined,
      is_date_verified: pristineMatch.is_date_verified || false,
      is_recurring: pristineMatch.is_recurring !== undefined ? pristineMatch.is_recurring : true,
      associated_places: pristineMatch.associated_places || [],
      lat: pristineMatch.lat,
      lng: pristineMatch.lng,
      image_url: finalImageUrl,
      source_url: pristineMatch.source_url || 'https://incredibleindia.gov.in',
      source_name: pristineMatch.source_name || 'Ministry of Tourism',
      license: pristineMatch.license || 'Official Reference Record',
      attribution_text: pristineMatch.attribution_text || 'Ministry of Tourism Indian Festivals Master Dataset',
      verification_status: pristineMatch.verification_status || 'verified',
      scope: master.scope,
      religion_or_category: master.religion_or_category,
      states: combinedStates,
      region: master.region,
      source_section: master.source_section,
      source_row_no: master.source_row_no,
      source_rows: master.source_rows,
      tradition_notes: master.tradition_notes,
      related_festivals: master.related_festivals,
      date_info: null,
      created_at: pristineMatch.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } else {
    newlyAddedCount++;
    const isPanIndia = master.scope === 'ALL_INDIA' || master.scope === 'PAN_INDIA_RELIGIOUS' || master.scope === 'NATIONAL_OBSERVANCE' || !master.states || master.states.length === 0;
    const primaryState = isPanIndia ? 'All India' : master.states[0];
    const primaryStateId = isPanIndia ? 'all-india' : primaryState.toLowerCase().replace(/[\s&]+/g, '-');

    mergedList.push({
      id: master.id,
      name: master.name,
      slug: master.id,
      aliases: master.aliases,
      state: primaryState,
      state_id: primaryStateId,
      primary_city: isPanIndia ? 'Pan-India' : primaryState,
      primary_city_id: isPanIndia ? 'all-india' : primaryStateId,
      alternate_locations: isPanIndia ? (master.states || []) : master.states.slice(1),
      description: master.description,
      cultural_vibe: `${master.religion_or_category} Celebration`,
      typical_season: 'Annual Observance',
      typical_month: undefined,
      exact_date_start: undefined,
      exact_date_end: undefined,
      is_date_verified: false,
      is_recurring: true,
      associated_places: [],
      lat: undefined,
      lng: undefined,
      image_url: '', // Neutral placeholder in UI
      source_url: 'https://incredibleindia.gov.in',
      source_name: 'Ministry of Tourism',
      license: 'Official Reference Record',
      attribution_text: 'Ministry of Tourism Indian Festivals Master Dataset',
      verification_status: 'verified',
      scope: master.scope,
      religion_or_category: master.religion_or_category,
      states: master.states,
      region: master.region,
      source_section: master.source_section,
      source_row_no: master.source_row_no,
      source_rows: master.source_rows,
      tradition_notes: master.tradition_notes,
      related_festivals: master.related_festivals,
      date_info: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
}

// Preserve any remaining pristine items not explicitly matched
let preservedCount = 0;
for (const p of pristine83) {
  if (!matchedPristineIds.has(p.id)) {
    preservedCount++;
    mergedList.push({
      ...p,
      scope: p.scope || 'STATE_REGIONAL',
      religion_or_category: p.religion_or_category || 'Arts & Culture',
      states: p.states || (p.state ? [p.state] : []),
      region: p.region || 'North',
      source_section: 'Existing Virasat Verified Registry',
      source_row_no: 0,
      source_rows: [],
      date_info: null,
    });
  }
}

console.log('\n--- RECONCILIATION SUMMARY ---');
console.log(`Matched with pristine records: ${matchedCount}`);
console.log(`Newly added from 290 database: ${newlyAddedCount}`);
console.log(`Preserved pristine records without 290 match: ${preservedCount}`);
console.log(`Total final merged festivals in app: ${mergedList.length}`);

// Write back to data/festivals.json
const festivalsJsonPath = path.resolve('data/festivals.json');
fs.writeFileSync(festivalsJsonPath, JSON.stringify(mergedList, null, 2), 'utf-8');
console.log(`✓ Updated ${festivalsJsonPath}`);

// Write back to data/.database/virasat_store.json
const storePath = path.resolve('data/.database/virasat_store.json');
if (fs.existsSync(storePath)) {
  const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
  store.festivals = {};
  mergedList.forEach((f) => {
    store.festivals[f.id] = f;
  });
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
  console.log(`✓ Synchronized ${mergedList.length} festivals into ${storePath}`);
}
