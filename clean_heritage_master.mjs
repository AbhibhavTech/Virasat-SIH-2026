import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const HIERARCHY_FILE = path.join(ROOT, 'data', 'india_tourism_database.json');

function backupFile(filePath) {
  const backupPath = `${filePath}.backup-${Date.now()}`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function main() {
  if (!fs.existsSync(HIERARCHY_FILE)) {
    throw new Error('Database file not found!');
  }

  const db = JSON.parse(fs.readFileSync(HIERARCHY_FILE, 'utf8'));
  const backup = backupFile(HIERARCHY_FILE);
  console.log(`Backup created at: ${backup}`);

  const CATEGORIES = [
    'heritage',
    'monuments',
    'museums',
    'tourist_places',
    'religious_cultural',
    'nature_parks_zoo'
  ];

  let totalProcessed = 0;
  let falseVerifiedCorrected = 0;
  let duplicatedImagesRemoved = 0;

  // Track seen image URLs to identify duplicates
  const seenImages = new Set();

  db.states.forEach((state) => {
    (state.cities || []).forEach((city) => {
      CATEGORIES.forEach((cat) => {
        (city[cat] || []).forEach((place) => {
          totalProcessed++;

          // Rule 1: Source Verification
          const hasSource = place.source_url && place.source_url.trim() !== '';
          if (place.status === 'VERIFIED' && !hasSource) {
            place.status = 'UNVERIFIED';
            if (place.verification_status) {
              place.verification_status = 'unverified';
            }
            place.verification_note = 'Metadata pending official archival verification. Source URL omitted.';
            falseVerifiedCorrected++;
          }

          // Rule 2: Duplicate Images Check
          if (place.image_url && place.image_url.trim() !== '') {
            const url = place.image_url.trim();
            if (seenImages.has(url)) {
              // Duplicate found! Blank it out to prevent false visual association
              place.image_url = '';
              duplicatedImagesRemoved++;
            } else {
              seenImages.add(url);
            }
          }
        });
      });
    });
  });

  // Write changes back to json file
  fs.writeFileSync(HIERARCHY_FILE, JSON.stringify(db, null, 2) + '\n', 'utf8');

  console.log('\n--- Clean-up Completed Successfully ---');
  console.log(`Total Attractions Processed : ${totalProcessed}`);
  console.log(`False VERIFIED Statuses Reset: ${falseVerifiedCorrected} (Now UNVERIFIED)`);
  console.log(`Duplicated Images Reset      : ${duplicatedImagesRemoved} (Blanked out)`);
}

main();
