import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const SOURCE_FILE = path.join(ROOT, 'src', 'data', 'cityItineraryData.ts');
const CITIES_FILE = path.join(ROOT, 'data', 'cities.json');
const HIERARCHY_FILE = path.join(ROOT, 'data', 'india_tourism_database.json');
const DUMP_FILE = path.join(ROOT, 'data', '.tmp_itinerary_cities.json');

const applyChanges = process.argv.includes('--apply');

const CITY_FIELDS = [
  'heritage',
  'monuments',
  'museums',
  'tourist_places',
  'religious_cultural',
  'nature_parks_zoo',
];

function assertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file not found: ${filePath}`);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function backupFile(filePath) {
  const backupPath = `${filePath}.backup-${Date.now()}`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function normalise(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');
}

function pickCityFields(raw) {
  const id = raw.id || raw.city_id || raw.cityId || raw.slug;
  const name = raw.name || raw.city || raw.city_name || raw.cityName;
  const stateId =
    raw.state_id ||
    raw.stateId ||
    raw.state ||
    raw.state_slug ||
    raw.stateSlug;

  if (!id || !name || !stateId) return null;

  return {
    id: normalise(id),
    name: String(name).trim(),
    state_id: normalise(stateId),
  };
}

function extractBalanced(text, startIndex, openChar, closeChar) {
  let i = startIndex;
  while (i < text.length && /\s/.test(text[i])) i++;
  if (text[i] !== openChar) return null;

  let depth = 0;
  let inStr = null;
  let escape = false;

  for (let j = i; j < text.length; j++) {
    const ch = text[j];

    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      continue;
    }

    if (ch === openChar) depth++;
    if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        return { start: i, end: j, text: text.slice(i, j + 1) };
      }
    }
  }

  return null;
}

function extractStringField(objectText, key) {
  const pattern = new RegExp(
    String.raw`["']?${key}["']?\s*:\s*(['"])(.*?)\1`
  );
  const match = objectText.match(pattern);
  return match ? match[2].trim() : null;
}

function parseObjectLiterals(arrayText) {
  const cities = [];
  let i = 0;

  while (i < arrayText.length) {
    const brace = arrayText.indexOf('{', i);
    if (brace === -1) break;

    const obj = extractBalanced(arrayText, brace, '{', '}');
    if (!obj) break;

    const raw = {
      id:
        extractStringField(obj.text, 'id') ||
        extractStringField(obj.text, 'city_id') ||
        extractStringField(obj.text, 'cityId') ||
        extractStringField(obj.text, 'slug'),
      name:
        extractStringField(obj.text, 'name') ||
        extractStringField(obj.text, 'city') ||
        extractStringField(obj.text, 'city_name') ||
        extractStringField(obj.text, 'cityName'),
      state_id:
        extractStringField(obj.text, 'state_id') ||
        extractStringField(obj.text, 'stateId') ||
        extractStringField(obj.text, 'state') ||
        extractStringField(obj.text, 'state_slug'),
    };

    const city = pickCityFields(raw);
    if (city) cities.push(city);

    i = obj.end + 1;
  }

  return cities;
}

function extractFromTypeScriptLiteral(sourceText) {
  const marker = 'ALL_INDIAN_TOURISM_CITIES';
  const markerIndex = sourceText.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find ${marker} in cityItineraryData.ts`);
  }

  const afterName = sourceText.slice(markerIndex + marker.length);
  const eq = afterName.indexOf('=');
  if (eq === -1) {
    return { method: 'literal', cities: [], snippet: afterName.slice(0, 300) };
  }

  const valueStart = markerIndex + marker.length + eq + 1;
  let i = valueStart;
  while (i < sourceText.length && /\s/.test(sourceText[i])) i++;

  if (sourceText[i] !== '[') {
    return {
      method: 'non-literal',
      cities: [],
      snippet: sourceText.slice(i, i + 400),
    };
  }

  const arr = extractBalanced(sourceText, i, '[', ']');
  if (!arr) {
    return { method: 'literal-unbalanced', cities: [], snippet: sourceText.slice(i, i + 400) };
  }

  return {
    method: 'literal',
    cities: parseObjectLiterals(arr.text),
    snippet: arr.text.slice(0, 200),
  };
}

function extractViaTsx() {
  const script = `
    import { ALL_INDIAN_TOURISM_CITIES } from './src/data/cityItineraryData.ts';
    const rows = (ALL_INDIAN_TOURISM_CITIES || []).map((c) => ({
      id: c.id || c.city_id || c.cityId || c.slug,
      name: c.name || c.city || c.city_name || c.cityName,
      state_id: c.state_id || c.stateId || c.state || c.state_slug || c.stateSlug
    }));
    console.log(JSON.stringify(rows));
  `;

  const result = spawnSync('npx', ['tsx', '-e', script], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: true,
  });

  if (result.status !== 0) {
    return {
      ok: false,
      error: (result.stderr || result.stdout || 'tsx failed').slice(0, 1000),
      cities: [],
    };
  }

  const stdout = (result.stdout || '').trim();
  const jsonStart = stdout.lastIndexOf('[');
  if (jsonStart === -1) {
    return { ok: false, error: stdout.slice(0, 1000), cities: [] };
  }

  try {
    const parsed = JSON.parse(stdout.slice(jsonStart));
    const cities = parsed.map(pickCityFields).filter(Boolean);
    return { ok: true, cities };
  } catch (err) {
    return { ok: false, error: String(err), cities: [] };
  }
}

function uniqueCities(list) {
  const map = new Map();
  for (const city of list) {
    if (!map.has(city.id)) map.set(city.id, city);
  }
  return [...map.values()];
}

function createCityJsonShell(city) {
  const now = new Date().toISOString();
  return {
    id: city.id,
    state_id: city.state_id,
    name: city.name,
    slug: city.id,
    entity_type: 'city',
    district: null,
    latitude: null,
    longitude: null,
    lat: null,
    lng: null,
    tagline: null,
    short_description: null,
    description: null,
    official_url: null,
    status: 'draft',
    prominence: null,
    is_capital: false,
    places_count: 0,
    hero_image_url: null,
    hero_image: null,
    aliases: [],
    search_keywords: [],
    created_at: now,
    updated_at: now,
    verification_status: 'VERIFICATION_REQUIRED',
    verification_note:
      'City shell added from itinerary city registry. Metadata and places pending verification.',
  };
}

function createHierarchyCityShell(city) {
  const shell = {
    id: city.id,
    name: city.name,
    slug: city.id,
    state_id: city.state_id,
    entity_type: 'city',
    district: null,
    latitude: null,
    longitude: null,
    lat: null,
    lng: null,
    tagline: null,
    short_description: null,
    description: null,
    official_url: null,
    status: 'DRAFT',
    prominence: null,
    is_capital: false,
    places_count: 0,
    hero_image_url: null,
    hero_image: null,
    aliases: [],
    search_keywords: [],
    verification_status: 'VERIFICATION_REQUIRED',
    verification_note:
      'City shell added from itinerary city registry. Metadata and places pending verification.',
  };

  for (const field of CITY_FIELDS) shell[field] = [];
  return shell;
}

function findStateById(states, stateId) {
  const wanted = normalise(stateId);
  return states.find((state) => {
    return (
      normalise(state.id) === wanted ||
      normalise(state.slug) === wanted ||
      normalise(state.name) === wanted
    );
  });
}

function cityExistsInArray(cities, cityId) {
  return cities.some((city) => normalise(city.id) === normalise(cityId));
}

function updateSafeTotals(state) {
  if (Array.isArray(state.cities)) {
    state.total_cities = state.cities.length;
  }

  let totalAttractions = 0;
  for (const city of state.cities || []) {
    for (const field of CITY_FIELDS) {
      totalAttractions += Array.isArray(city[field]) ? city[field].length : 0;
    }
  }

  if (Object.prototype.hasOwnProperty.call(state, 'total_attractions')) {
    state.total_attractions = totalAttractions;
  }
}

function loadItineraryCities() {
  console.log('Trying tsx import of ALL_INDIAN_TOURISM_CITIES...');
  const viaTsx = extractViaTsx();
  if (viaTsx.ok && viaTsx.cities.length > 0) {
    console.log(`Parser: tsx import (${viaTsx.cities.length} cities)`);
    return uniqueCities(viaTsx.cities);
  }
  if (!viaTsx.ok) {
    console.log('tsx import failed:');
    console.log(viaTsx.error);
  }

  console.log('Falling back to TypeScript literal parser...');
  const sourceText = fs.readFileSync(SOURCE_FILE, 'utf8');
  const viaLiteral = extractFromTypeScriptLiteral(sourceText);
  console.log(`Parser: ${viaLiteral.method}`);
  console.log('Snippet:');
  console.log(viaLiteral.snippet);

  if (viaLiteral.cities.length > 0) {
    return uniqueCities(viaLiteral.cities);
  }

  if (fs.existsSync(DUMP_FILE)) {
    const dumped = readJson(DUMP_FILE);
    if (Array.isArray(dumped) && dumped.length >= 210) {
      console.log(`Parser: dump file (${dumped.length} cities)`);
      return uniqueCities(dumped.map(pickCityFields).filter(Boolean));
    }
  }

  throw new Error(
    'Could not extract ALL_INDIAN_TOURISM_CITIES. Run the diagnostic snippet command first and paste the output.'
  );
}

function main() {
  assertFile(SOURCE_FILE);
  assertFile(CITIES_FILE);
  assertFile(HIERARCHY_FILE);

  const itineraryCities = loadItineraryCities();
  const citiesJson = readJson(CITIES_FILE);
  const hierarchy = readJson(HIERARCHY_FILE);

  if (!Array.isArray(citiesJson)) {
    throw new Error('data/cities.json must contain an array');
  }
  if (!Array.isArray(hierarchy.states)) {
    throw new Error('data/india_tourism_database.json must contain states[]');
  }

  if (itineraryCities.length < 210) {
    throw new Error(
      `Extracted only ${itineraryCities.length} itinerary cities; expected ~257. Refusing to sync.`
    );
  }

  fs.writeFileSync(DUMP_FILE, JSON.stringify(itineraryCities, null, 2));
  console.log(`Wrote debug dump: ${DUMP_FILE}`);

  const existingCitiesJson = new Set(citiesJson.map((city) => normalise(city.id)));
  const existingHierarchyCities = new Set();
  for (const state of hierarchy.states) {
    for (const city of state.cities || []) {
      existingHierarchyCities.add(normalise(city.id));
    }
  }

  const missingFromCitiesJson = itineraryCities.filter(
    (city) => !existingCitiesJson.has(city.id)
  );
  const missingFromHierarchy = itineraryCities.filter(
    (city) => !existingHierarchyCities.has(city.id)
  );

  const missingStateRecords = itineraryCities.filter(
    (city) => !findStateById(hierarchy.states, city.state_id)
  );

  console.log('\n--- Virasat City Sync Audit ---');
  console.log(`Source itinerary cities: ${itineraryCities.length}`);
  console.log(`Existing data/cities.json cities: ${citiesJson.length}`);
  console.log(`Missing from data/cities.json: ${missingFromCitiesJson.length}`);
  console.log(`Missing from hierarchy master: ${missingFromHierarchy.length}`);
  console.log(`Cities with missing state mapping: ${missingStateRecords.length}`);

  const preview = missingFromHierarchy.slice(0, 30);
  if (preview.length) {
    console.log('\nMissing from hierarchy (first 30):');
    for (const city of preview) {
      console.log(`  - ${city.id} | ${city.name} | ${city.state_id}`);
    }
  }

  if (missingStateRecords.length > 0) {
    console.log('\nMissing state mappings:');
    for (const city of missingStateRecords) {
      console.log(`  - ${city.id} | ${city.name} | ${city.state_id}`);
    }
    throw new Error('Some cities reference states that do not exist. No files were changed.');
  }

  if (!applyChanges) {
    console.log('\nDRY RUN ONLY. No files changed.');
    console.log('Run with --apply to add missing city shells.');
    return;
  }

  const citiesBackup = backupFile(CITIES_FILE);
  const hierarchyBackup = backupFile(HIERARCHY_FILE);

  let addedToCitiesJson = 0;
  let addedToHierarchy = 0;

  for (const city of missingFromCitiesJson) {
    citiesJson.push(createCityJsonShell(city));
    addedToCitiesJson++;
  }

  for (const city of missingFromHierarchy) {
    const state = findStateById(hierarchy.states, city.state_id);
    if (!state) throw new Error(`State not found while applying city: ${city.id}`);
    if (!Array.isArray(state.cities)) state.cities = [];
    if (!cityExistsInArray(state.cities, city.id)) {
      state.cities.push(createHierarchyCityShell(city));
      addedToHierarchy++;
    }
    updateSafeTotals(state);
  }

  writeJson(CITIES_FILE, citiesJson);
  writeJson(HIERARCHY_FILE, hierarchy);

  console.log('\n--- Sync Applied ---');
  console.log(`Added to data/cities.json: ${addedToCitiesJson}`);
  console.log(`Added to data/india_tourism_database.json: ${addedToHierarchy}`);
  console.log(`Backup created: ${citiesBackup}`);
  console.log(`Backup created: ${hierarchyBackup}`);

  const writtenCities = readJson(CITIES_FILE);
  const writtenHierarchy = readJson(HIERARCHY_FILE);
  const invalidCoordinates = [];

  for (const city of writtenCities) {
    if (city.latitude === 0 || city.longitude === 0 || city.lat === 0 || city.lng === 0) {
      invalidCoordinates.push({ file: 'data/cities.json', id: city.id });
    }
  }

  for (const state of writtenHierarchy.states) {
    for (const city of state.cities || []) {
      if (city.latitude === 0 || city.longitude === 0 || city.lat === 0 || city.lng === 0) {
        invalidCoordinates.push({
          file: 'data/india_tourism_database.json',
          id: city.id,
        });
      }
    }
  }

  if (invalidCoordinates.length > 0) {
    console.error('ERROR: Found zero coordinates:', invalidCoordinates);
    process.exitCode = 1;
    return;
  }

  console.log('PASS: No city shell has coordinates equal to 0.');
}

main();