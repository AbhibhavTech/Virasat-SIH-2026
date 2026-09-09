import fs from 'fs';
import path from 'path';

console.log('[CI Data Quality] Starting comprehensive data integrity and provenance verification...');

const storePath = path.join(process.cwd(), 'data', '.database', 'virasat_store.json');
if (!fs.existsSync(storePath)) {
  console.error('❌ Database store file not found at:', storePath);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(storePath, 'utf-8'));

let errors = [];
let warnings = [];

// -------------------------------------------------------------
// 1. Check Railway Station Uniqueness
// -------------------------------------------------------------
const stationCodes = new Set();
for (const stn of Object.values(db.transit_nodes || {})) {
  const code = (stn.code || '').toUpperCase();
  if (!code) {
    errors.push(`Transit node ${stn.id} has empty station code.`);
  } else if (stationCodes.has(code)) {
    errors.push(`Duplicate transit station code detected: ${code}`);
  }
  stationCodes.add(code);
}
console.log(`✓ Transit Stations Check: ${stationCodes.size} unique stations verified.`);

// -------------------------------------------------------------
// 2. Check Place ID Uniqueness & Slug Validity
// -------------------------------------------------------------
const placeIds = new Set();
const placeNames = new Set();

// India geographic bounding box (approximate envelope):
// Lat: ~6.5° N to ~37.5° N
// Lng: ~68.0° E to ~97.5° E
const MIN_LAT = 6.0;
const MAX_LAT = 38.0;
const MIN_LNG = 68.0;
const MAX_LNG = 98.0;

let verifiedOfficialCount = 0;
let unverifiedCount = 0;

for (const p of Object.values(db.places || {})) {
  if (placeIds.has(p.id)) {
    errors.push(`Duplicate place ID: ${p.id}`);
  }
  placeIds.add(p.id);

  // Coordinate check
  if (p.lat === 0 && p.lng === 0) {
    errors.push(`Place '${p.id}' has impossible (0,0) coordinates.`);
  } else if (p.lat < MIN_LAT || p.lat > MAX_LAT || p.lng < MIN_LNG || p.lng > MAX_LNG) {
    errors.push(`Place '${p.id}' coordinates (${p.lat}, ${p.lng}) fall outside India geographic bounds.`);
  }

  // Provenance check
  const conf = (p.data_confidence || '').toLowerCase();
  if (conf === 'official' || conf === 'trusted_third_party') {
    verifiedOfficialCount++;
    if (!p.source_url || p.source_url.trim() === '') {
      errors.push(`Place '${p.id}' claims ${p.data_confidence} confidence but has empty source_url.`);
    }
  } else if (conf === 'unverified') {
    unverifiedCount++;
  } else {
    warnings.push(`Place '${p.id}' has unexpected confidence value: '${p.data_confidence}'`);
  }

  // Required field checks
  if (!p.name || p.name.trim() === '') {
    errors.push(`Place '${p.id}' has empty name.`);
  }
}
console.log(`✓ Places Check: ${placeIds.size} total places (${verifiedOfficialCount} verified/official, ${unverifiedCount} honestly unverified).`);

// -------------------------------------------------------------
// 3. Field-Level Facts Provenance Check
// -------------------------------------------------------------
const facts = Object.values(db.place_facts || {});
let factErrors = 0;
for (const f of facts) {
  if (!f.place_id || !db.places[f.place_id]) {
    errors.push(`Orphan fact '${f.id}' points to non-existent place '${f.place_id}'.`);
    factErrors++;
  }
  if ((f.data_confidence === 'OFFICIAL' || f.data_confidence === 'TRUSTED_THIRD_PARTY') && !f.source_url) {
    errors.push(`Fact '${f.id}' claims ${f.data_confidence} but missing source_url.`);
    factErrors++;
  }
}
console.log(`✓ Field-Level Facts: ${facts.length} granular facts verified across destinations.`);

// -------------------------------------------------------------
// 4. Summary & Exit Code
// -------------------------------------------------------------
if (warnings.length > 0) {
  console.log(`⚠️  ${warnings.length} data quality warnings:`);
  warnings.slice(0, 5).forEach((w) => console.log('   -', w));
}

if (errors.length > 0) {
  console.error(`❌ Data quality check failed with ${errors.length} errors:`);
  errors.slice(0, 10).forEach((e) => console.error('   -', e));
  process.exit(1);
}

console.log('\n[All CI Data Quality & Provenance Checks Passed Successfully!]\n');
process.exit(0);
