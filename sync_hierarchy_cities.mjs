import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();

const SOURCE_FILE = path.join(
  ROOT,
  'src',
  'data',
  'cityItineraryData.ts'
);

const CITIES_FILE = path.join(ROOT, 'data', 'cities.json');
const HIERARCHY_FILE = path.join(
  ROOT,
  'data',
  'india_tourism_database.json'
);

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
  fs.writeFileSync(
    filePath,
    JSON.stringify(value, null, 2) + '\n',
    'utf8'
  );
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

function extractString(objectText, key) {
  const pattern = new RegExp(
    String.raw`(?:^|[,{\n])\s*${key}\s*:\s*(['"])(.*?)\1`,
    's'
  );

  const match = objectText.match(pattern);
  return match ? match[2].trim() : null;
}

function extractItineraryCities(sourceText) {
  const marker = 'ALL_INDIAN_TOURISM_CITIES';

  const markerIndex = sourceText.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error(
      `Could not find ${marker} in ${SOURCE_FILE}`
    );
  }

  const arrayStart = sourceText.indexOf('[', markerIndex);

  if (arrayStart === -1) {
    throw new Error(
      `Could not find city array start in ${SOURCE_FILE}`
    );
  }

  /*
   * We only need the city objects. This intentionally does not try
   * to execute the TypeScript file.
   */
  const arrayText = sourceText.slice(arrayStart);

  const cities = [];
  const objectRegex = /\{[\s\S]*?\}/g;

  for (const match of arrayText.matchAll(objectRegex)) {
    const objectText = match[0];

    const id =
      extractString(objectText, 'id') ||
      extractString(objectText, 'city_id');

    const name =
      extractString(objectText, 'name') ||
      extractString(objectText, 'city');

    const stateId =
      extractString(objectText, 'state_id') ||
      extractString(objectText, 'stateId');

    if (!id || !name || !stateId) {
      continue;
    }

    cities.push({
      id: normalise(id),
      name,
      state_id: normalise(stateId),
    });
  }

  const unique = new Map();

  for (const city of cities) {
    if (!unique.has(city.id)) {
      unique.set(city.id, city);
    }
  }

  return [...unique.values()];
}

function createCityJsonShell(city) {
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

    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),

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

  for (const field of CITY_FIELDS) {
    shell[field] = [];
  }

  return shell;
}

function findStateById(states, stateId) {
  const wanted = normalise(stateId);

  return states.find((state) => {
    return (
      normalise(state.id) === wanted ||
      normalise(state.slug) === wanted
    );
  });
}

function ensureCitiesArray(state) {
  if (!Array.isArray(state.cities)) {
    state.cities = [];
  }

  return state.cities;
}

function cityExistsInArray(cities, cityId) {
  return cities.some((city) => {
    return normalise(city.id) === normalise(cityId);
  });
}

function updateSafeTotals(state) {
  if (Array.isArray(state.cities)) {
    state.total_cities = state.cities.length;
  }

  let totalAttractions = 0;

  for (const city of state.cities || []) {
    for (const field of CITY_FIELDS) {
      totalAttractions += Array.isArray(city[field])
        ? city[field].length
        : 0;
    }
  }

  /*
   * Only update totals if these fields already exist.
   * This avoids changing the existing schema unnecessarily.
   */
  if (Object.prototype.hasOwnProperty.call(state, 'total_attractions')) {
    state.total_attractions = totalAttractions;
  }
}

function main() {
  assertFile(SOURCE_FILE);
  assertFile(CITIES_FILE);
  assertFile(HIERARCHY_FILE);

  const sourceText = fs.readFileSync(SOURCE_FILE, 'utf8');
  const itineraryCities = extractItineraryCities(sourceText);

  const citiesJson = readJson(CITIES_FILE);
  const hierarchy = readJson(HIERARCHY_FILE);

  if (!Array.isArray(citiesJson)) {
    throw new Error('data/cities.json must contain an array');
  }

  if (!Array.isArray(hierarchy.states)) {
    throw new Error(
      'data/india_tourism_database.json must contain states[]'
    );
  }

  const existingCitiesJson = new Set(
    citiesJson.map((city) => normalise(city.id))
  );

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

  const missingStateRecords = [];

  for (const city of itineraryCities) {
    const state = findStateById(hierarchy.states, city.state_id);

    if (!state) {
      missingStateRecords.push(city);
    }
  }

  console.log('--- Virasat City Sync Audit ---');
  console.log(`Source itinerary cities: ${itineraryCities.length}`);
  console.log(`Existing data/cities.json cities: ${citiesJson.length}`);
  console.log(
    `Missing from data/cities.json: ${missingFromCitiesJson.length}`
  );
  console.log(
    `Missing from hierarchy master: ${missingFromHierarchy.length}`
  );
  console.log(
    `Cities with missing state mapping: ${missingStateRecords.length}`
  );

  if (missingFromCitiesJson.length > 0) {
    console.log('\nMissing from data/cities.json:');

    for (const city of missingFromCitiesJson) {
      console.log(
        `  - ${city.id} | ${city.name} | ${city.state_id}`
      );
    }
  }

  if (missingFromHierarchy.length > 0) {
    console.log('\nMissing from hierarchy master:');

    for (const city of missingFromHierarchy) {
      console.log(
        `  - ${city.id} | ${city.name} | ${city.state_id}`
      );
    }
  }

  if (missingStateRecords.length > 0) {
    console.log('\nMissing state mappings:');

    for (const city of missingStateRecords) {
      console.log(
        `  - ${city.id} | ${city.name} | ${city.state_id}`
      );
    }

    throw new Error(
      'Some cities reference states that do not exist. No files were changed.'
    );
  }

  if (!applyChanges) {
    console.log(
      '\nDRY RUN ONLY. No files changed.'
    );
    console.log(
      'Run with --apply to add missing city shells.'
    );
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

    if (!state) {
      throw new Error(
        `State not found while applying city: ${city.id}`
      );
    }

    const stateCities = ensureCitiesArray(state);

    if (!cityExistsInArray(stateCities, city.id)) {
      stateCities.push(createHierarchyCityShell(city));
      addedToHierarchy++;
    }

    updateSafeTotals(state);
  }

  writeJson(CITIES_FILE, citiesJson);
  writeJson(HIERARCHY_FILE, hierarchy);

  console.log('\n--- Sync Applied ---');
  console.log(`Added to data/cities.json: ${addedToCitiesJson}`);
  console.log(
    `Added to data/india_tourism_database.json: ${addedToHierarchy}`
  );
  console.log(`Backup created: ${citiesBackup}`);
  console.log(`Backup created: ${hierarchyBackup}`);

  console.log('\nValidation:');

  const writtenCities = readJson(CITIES_FILE);
  const writtenHierarchy = readJson(HIERARCHY_FILE);

  const invalidCoordinates = [];

  for (const city of writtenCities) {
    if (
      city.latitude === 0 ||
      city.longitude === 0 ||
      city.lat === 0 ||
      city.lng === 0
    ) {
      invalidCoordinates.push({
        file: 'data/cities.json',
        id: city.id,
      });
    }
  }

  for (const state of writtenHierarchy.states) {
    for (const city of state.cities || []) {
      if (
        city.latitude === 0 ||
        city.longitude === 0 ||
        city.lat === 0 ||
        city.lng === 0
      ) {
        invalidCoordinates.push({
          file: 'data/india_tourism_database.json',
          id: city.id,
        });
      }
    }
  }

  if (invalidCoordinates.length > 0) {
    console.error(
      'ERROR: Found zero coordinates:',
      invalidCoordinates
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    'PASS: No city shell has coordinates equal to 0.'
  );
  console.log(
    'PASS: New shell coordinates remain null until verified.'
  );
}

main();
