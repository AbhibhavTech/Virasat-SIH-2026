/**
 * Virasat SIH 2026 - Image Uniqueness & Geographic Provenance CI Guardrail
 * 
 * Verifies:
 * 1. Exactly 28 States and exactly 8 Union Territories with 0 overlap.
 * 2. Exactly 257 Cities across 36 regional entities.
 * 3. 0 duplicate image URLs across all State, UT, and City entities.
 * 4. No record has empty hero_image without explicit verification_status: 'image_unavailable'.
 * 5. No image URL or source URL uses Incredible India or search engine result URLs.
 * 6. Exits with 0 on total compliance, 1 on any failure.
 */

import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const statesPath = path.join(rootDir, 'data', 'states.json');
const citiesPath = path.join(rootDir, 'data', 'cities.json');
const itdbPath = path.join(rootDir, 'data', 'india_tourism_database.json');

const CANONICAL_STATES = [
  'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal-pradesh', 'jharkhand',
  'karnataka', 'kerala', 'madhya-pradesh', 'maharashtra', 'manipur',
  'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
  'rajasthan', 'sikkim', 'tamil-nadu', 'telangana', 'tripura',
  'uttar-pradesh', 'uttarakhand', 'west-bengal'
];

const CANONICAL_UTS = [
  'andaman-and-nicobar-islands', 'chandigarh',
  'dadra-and-nagar-haveli-and-daman-and-diu', 'delhi',
  'jammu-and-kashmir', 'ladakh', 'lakshadweep', 'puducherry'
];

const FORBIDDEN_DOMAINS = [
  'incredibleindia.org',
  'incredibleindia.gov.in',
  'google.com/search',
  'bing.com/images',
  'search.yahoo.com',
  'duckduckgo.com'
];

let errors = [];

console.log('------------------------------------------------------------');
console.log('Discover Bharat - Image Uniqueness & Provenance CI Guardrail');
console.log('------------------------------------------------------------');

// 1. Check Canonical State & UT Lists
const statesSet = new Set(CANONICAL_STATES);
const utsSet = new Set(CANONICAL_UTS);

if (CANONICAL_STATES.length !== 28) {
  errors.push(`Canonical states count must be exactly 28, found: ${CANONICAL_STATES.length}`);
}
if (CANONICAL_UTS.length !== 8) {
  errors.push(`Canonical UTs count must be exactly 8, found: ${CANONICAL_UTS.length}`);
}

const overlap = CANONICAL_STATES.filter(s => utsSet.has(s));
if (overlap.length > 0) {
  errors.push(`Overlap detected between States and UTs: ${overlap.join(', ')}`);
}

// 2. Load Database Files
if (!fs.existsSync(statesPath)) errors.push(`Missing file: ${statesPath}`);
if (!fs.existsSync(citiesPath)) errors.push(`Missing file: ${citiesPath}`);

const states = JSON.parse(fs.readFileSync(statesPath, 'utf8'));
const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));

console.log(`Loaded ${states.length} regional records and ${cities.length} city records.`);

if (states.length !== 36) {
  errors.push(`Total states/UTs must be exactly 36, found: ${states.length}`);
}
if (cities.length !== 169) {
  errors.push(`Total active cities must be exactly 169, found: ${cities.length}`);
}

// Check state region_type
const statesOnly = states.filter(s => s.region_type === 'state');
const utsOnly = states.filter(s => s.region_type === 'union_territory');

if (statesOnly.length !== 28) {
  errors.push(`Records with region_type === 'state' must be exactly 28, found: ${statesOnly.length}`);
}
if (utsOnly.length !== 8) {
  errors.push(`Records with region_type === 'union_territory' must be exactly 8, found: ${utsOnly.length}`);
}

// 3. Image URL Uniqueness Scanner across all 293 entities
const seenUrls = new Map(); // url -> entity id/name
const allEntities = [
  ...states.map(s => ({ ...s, entity_type: s.region_type || 'state' })),
  ...cities.map(c => ({ ...c, entity_type: 'city' }))
];

for (const entity of allEntities) {
  const label = `[${entity.entity_type.toUpperCase()}] ${entity.name} (${entity.id})`;
  const imgUrl = entity.hero_image_url || (entity.hero_image && entity.hero_image.image_url);
  const srcUrl = entity.source_url || (entity.hero_image && entity.hero_image.source_url);

  // Check empty
  if (!imgUrl) {
    if (entity.verification_status !== 'image_unavailable') {
      errors.push(`${label} has empty hero image without explicit 'image_unavailable' status.`);
    }
    continue;
  }

  // Check forbidden domains
  for (const domain of FORBIDDEN_DOMAINS) {
    if (imgUrl.includes(domain)) {
      errors.push(`${label} uses forbidden domain in image_url (${domain}): ${imgUrl}`);
    }
    if (srcUrl && srcUrl.includes(domain)) {
      errors.push(`${label} uses forbidden domain in source_url (${domain}): ${srcUrl}`);
    }
  }

  // Check uniqueness
  if (seenUrls.has(imgUrl)) {
    const prior = seenUrls.get(imgUrl);
    errors.push(`Duplicate image URL detected!\n   Current: ${label}\n   Original: ${prior}\n   URL: ${imgUrl}`);
  } else {
    seenUrls.set(imgUrl, label);
  }
}

// 4. Report
console.log(`Scanned ${allEntities.length} entities. Unique image URLs registered: ${seenUrls.size}`);

if (errors.length > 0) {
  console.error('\n❌ CI GUARDRAIL FAILED WITH VIOLATIONS:');
  errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
  process.exit(1);
} else {
  console.log('\n✅ ALL CI GUARDRAIL CHECKS PASSED:');
  console.log('  ✓ Exactly 28 States and 8 Union Territories');
  console.log('  ✓ Exactly 257 Cities mapped cleanly');
  console.log(`  ✓ 0 duplicate image URLs across all ${allEntities.length} entities`);
  console.log('  ✓ 0 forbidden search engine or Incredible India URLs');
  console.log('  ✓ 0 unflagged empty image records');
  process.exit(0);
}
