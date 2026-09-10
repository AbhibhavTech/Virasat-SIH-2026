import fs from 'fs';

const masterPath = 'data/india_tourism_database.json';
const backupPath = 'data/india_tourism_database.json.backup-1789074071231';

if (!fs.existsSync(backupPath)) {
  console.error(`Error: original backup file not found at ${backupPath}`);
  process.exit(1);
}

const masterDb = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
const backupDb = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

const cats = [
  'heritage',
  'monuments',
  'museums',
  'tourist_places',
  'religious_cultural',
  'nature_parks_zoo'
];

// Step 1: Identify image_url groups that appeared in >1 place in the backup
const backupImageCounts = new Map();

for (const state of backupDb.states || []) {
  for (const city of state.cities || []) {
    for (const cat of cats) {
      for (const place of city[cat] || []) {
        const img = (place.image_url || '').trim();
        if (img) {
          if (!backupImageCounts.has(img)) {
            backupImageCounts.set(img, []);
          }
          backupImageCounts.get(img).push({
            place: place.name,
            city: city.name
          });
        }
      }
    }
  }
}

const duplicatedUrls = new Set();
for (const [url, occurrences] of backupImageCounts.entries()) {
  if (occurrences.length > 1) {
    duplicatedUrls.add(url);
  }
}

console.log(`Original duplicate URL group count (backup): ${duplicatedUrls.size}`);

// Step 2: Check if image_verification_status already exists anywhere in master
let hasImageVerificationStatusField = false;
for (const state of masterDb.states || []) {
  for (const city of state.cities || []) {
    for (const cat of cats) {
      for (const place of city[cat] || []) {
        if ('image_verification_status' in place) {
          hasImageVerificationStatusField = true;
          break;
        }
      }
    }
  }
}

// Step 3: Clear image_url for remaining places in masterDb that used any of the duplicated URLs
let retainedClearedCount = 0;
const clearedPlaces = [];

for (const state of masterDb.states || []) {
  for (const city of state.cities || []) {
    for (const cat of cats) {
      for (const place of city[cat] || []) {
        const currentImg = (place.image_url || '').trim();
        if (currentImg && duplicatedUrls.has(currentImg)) {
          place.image_url = '';
          if (hasImageVerificationStatusField) {
            place.image_verification_status = 'UNVERIFIED';
          }
          retainedClearedCount++;
          clearedPlaces.push({
            place: place.name,
            city: city.name,
            url: currentImg
          });
        }
      }
    }
  }
}

// Step 4: Create fresh backup before write
const newBackupPath = `${masterPath}.backup-${Date.now()}`;
fs.writeFileSync(newBackupPath, fs.readFileSync(masterPath, 'utf8'), 'utf8');
console.log(`Created fresh backup: ${newBackupPath}`);

// Step 5: Write modified masterDb
fs.writeFileSync(masterPath, JSON.stringify(masterDb, null, 2), 'utf8');
console.log(`Updated ${masterPath}`);

// Step 6: Verify final master state
const finalImages = new Map();
for (const state of masterDb.states || []) {
  for (const city of state.cities || []) {
    for (const cat of cats) {
      for (const place of city[cat] || []) {
        const img = (place.image_url || '').trim();
        if (img) {
          if (!finalImages.has(img)) finalImages.set(img, []);
          finalImages.get(img).push(place.name);
        }
      }
    }
  }
}

const finalDupGroups = [...finalImages.entries()].filter(([, places]) => places.length > 1);
const finalNonEmptyImages = [...finalImages.values()].reduce((sum, places) => sum + places.length, 0);

console.log('\n--- Image Provenance Remediation Summary ---');
console.log('Original duplicate URL group count:', duplicatedUrls.size);
console.log('Retained first images now cleared:', retainedClearedCount);
console.log('Final non-empty images:', finalNonEmptyImages);
console.log('Final duplicate groups:', finalDupGroups.length);

if (clearedPlaces.length > 0) {
  console.log('\nCleared arbitrary first images from:');
  for (const item of clearedPlaces) {
    console.log(` - [${item.city}] ${item.place}`);
  }
}
