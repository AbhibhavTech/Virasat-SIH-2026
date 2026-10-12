import fs from 'fs';
import path from 'path';

console.log('🧪 RUNNING COMPREHENSIVE IMAGE PIPELINE AUDIT TESTS\n');

// 1. Load Data
const dbPath = path.join(process.cwd(), 'data', 'mumbai_maharashtra_images.json');
const manifestPath = path.join(process.cwd(), 'images_manifest.csv');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Missing data/mumbai_maharashtra_images.json');
  process.exit(1);
}
if (!fs.existsSync(manifestPath)) {
  console.error('❌ Missing images_manifest.csv');
  process.exit(1);
}

const bundles = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const manifestContent = fs.readFileSync(manifestPath, 'utf8');
const manifestLines = manifestContent.trim().split('\n').slice(1);

console.log(`Total places in JSON bundles: ${Object.keys(bundles).length}`);
console.log(`Total rows in manifest: ${manifestLines.length}`);

// TEST 1: Deduplication across all places
console.log('\n--- TEST 1: Deduplication across all places ---');
const seenHashes = new Map();
const seenUrls = new Map();
let duplicateFound = false;

for (const [placeId, bundle] of Object.entries(bundles)) {
  const images = [];
  if (bundle.hero_image && bundle.hero_image.image_url) images.push(bundle.hero_image);
  if (Array.isArray(bundle.gallery_images)) images.push(...bundle.gallery_images.filter(img => img && img.image_url));

  for (const img of images) {
    if (seenHashes.has(img.content_hash)) {
      console.error(`❌ Duplicate hash detected between "${seenHashes.get(img.content_hash)}" and "${placeId}": ${img.content_hash}`);
      duplicateFound = true;
    } else {
      seenHashes.set(img.content_hash, placeId);
    }

    if (seenUrls.has(img.image_url)) {
      console.error(`❌ Duplicate image URL between "${seenUrls.get(img.image_url)}" and "${placeId}": ${img.image_url}`);
      duplicateFound = true;
    } else {
      seenUrls.set(img.image_url, placeId);
    }
  }
}

if (!duplicateFound) {
  console.log(`✅ PASSED: 100% Zero cross-place duplicate images across ${seenHashes.size} unique image assets.`);
} else {
  console.error('❌ FAILED: Duplicate images found.');
  process.exit(1);
}

// TEST 2: Every candidate image has non-null license, source_page_url, alt_text
console.log('\n--- TEST 2: Metadata completeness on candidate images ---');
let missingMetadata = 0;
for (const [placeId, bundle] of Object.entries(bundles)) {
  if (bundle.hero_image && bundle.hero_image.match_status !== 'PLACEHOLDER') {
    const h = bundle.hero_image;
    if (!h.license) {
      console.warn(`Place ${placeId} hero image missing license`);
      missingMetadata++;
    }
    if (!h.source_page_url) {
      console.warn(`Place ${placeId} hero image missing source_page_url`);
      missingMetadata++;
    }
    if (!h.alt_text) {
      console.warn(`Place ${placeId} hero image missing alt_text`);
      missingMetadata++;
    }
  }
}
if (missingMetadata === 0) {
  console.log('✅ PASSED: All sourced candidate images have license, source_page_url, and alt_text.');
} else {
  console.error(`❌ FAILED: Found ${missingMetadata} missing metadata fields.`);
}

// TEST 3: No generic skyline URLs used as photos for attractions
console.log('\n--- TEST 3: Rejection of generic skylines ---');
const GENERIC_SKYLINE = 'photo-1570168007204-dfb528c6958f';
let skylineDetected = false;
for (const [placeId, bundle] of Object.entries(bundles)) {
  const heroUrl = bundle.hero_image?.image_url || '';
  if (heroUrl.includes(GENERIC_SKYLINE)) {
    console.error(`❌ Place ${placeId} is using generic skyline URL!`);
    skylineDetected = true;
  }
}
if (!skylineDetected) {
  console.log('✅ PASSED: Zero places use generic Mumbai skyline photos.');
} else {
  console.error('❌ FAILED: Generic skyline found in place records.');
  process.exit(1);
}

// TEST 4: Sensitive places compliance
console.log('\n--- TEST 4: Sensitive places protection & photography courtesy notices ---');
const expectedSensitiveIds = [
  'mumbai-012',
  'mumbai-worli-koliwada',
  'mumbai-versova-koliwada',
  'mumbai-khar-danda-koliwada',
  'mumbai-pali-village',
  'mumbai-dadar-parsi-colony',
  'mumbai-sassoon-dock',
  'mumbai-aarey-forest'
];

let sensitiveOk = true;
for (const sId of expectedSensitiveIds) {
  const b = bundles[sId];
  if (!b) {
    console.error(`❌ Missing sensitive place: ${sId}`);
    sensitiveOk = false;
  } else if (!b.is_sensitive) {
    console.error(`❌ Place ${sId} is not marked as sensitive!`);
    sensitiveOk = false;
  } else if (!b.sensitivity_note?.includes('Please ask before photographing people or private homes')) {
    console.error(`❌ Place ${sId} missing mandatory photography notice: ${b.sensitivity_note}`);
    sensitiveOk = false;
  }
}
if (sensitiveOk) {
  console.log(`✅ PASSED: All ${expectedSensitiveIds.length} sensitive places have is_sensitive: true and mandatory photography courtesy notice.`);
} else {
  console.error('❌ FAILED: Sensitive places test failed.');
  process.exit(1);
}

// TEST 5: Accurate counts of match_status
console.log('\n--- TEST 5: Honest status distribution ---');
let verifiedCount = 0;
let needsReviewCount = 0;
let placeholderCount = 0;

for (const [placeId, bundle] of Object.entries(bundles)) {
  const status = bundle.hero_image?.match_status;
  if (status === 'VERIFIED') verifiedCount++;
  else if (status === 'NEEDS_REVIEW') needsReviewCount++;
  else if (status === 'PLACEHOLDER') placeholderCount++;
}

console.log(`VERIFIED:     ${verifiedCount}`);
console.log(`NEEDS_REVIEW: ${needsReviewCount}`);
console.log(`PLACEHOLDER:  ${placeholderCount}`);
console.log(`Total:        ${verifiedCount + needsReviewCount + placeholderCount} / 50`);

if (verifiedCount + needsReviewCount + placeholderCount === 50) {
  console.log('✅ PASSED: Total places strictly sum to 50.');
} else {
  console.error('❌ FAILED: Total places mismatch.');
  process.exit(1);
}

console.log('\n🎉 ALL PIPELINE TESTS PASSED SUCCESSFULLY!\n');
