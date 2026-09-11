import fs from 'fs';

const db = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));

const cats = [
  'heritage',
  'monuments',
  'museums',
  'tourist_places',
  'religious_cultural',
  'nature_parks_zoo'
];

const statusCounts = {};
const withSourceStatusCounts = {};
const sourceStats = {
  total: 0,
  sourcePresent: 0,
  sourceMissing: 0,
  verifiedNoSource: 0,
  verifiedWithSource: 0
};

const images = new Map();

for (const state of db.states || []) {
  for (const city of state.cities || []) {
    for (const cat of cats) {
      for (const place of city[cat] || []) {
        sourceStats.total++;

        const status = place.status || 'MISSING_STATUS';
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        const hasSource =
          typeof place.source_url === 'string' &&
          place.source_url.trim().length > 0;

        if (hasSource) {
          sourceStats.sourcePresent++;
          withSourceStatusCounts[status] =
            (withSourceStatusCounts[status] || 0) + 1;
        } else {
          sourceStats.sourceMissing++;
        }

        if (status === 'VERIFIED' && !hasSource) {
          sourceStats.verifiedNoSource++;
        }

        if (status === 'VERIFIED' && hasSource) {
          sourceStats.verifiedWithSource++;
        }

        const imageUrl =
          typeof place.image_url === 'string'
            ? place.image_url.trim()
            : '';

        if (imageUrl) {
          if (!images.has(imageUrl)) {
            images.set(imageUrl, []);
          }

          images.get(imageUrl).push({
            place: place.name,
            city: city.name,
            status
          });
        }
      }
    }
  }
}

const duplicateGroups = [...images.entries()]
  .filter(([, places]) => places.length > 1);

const imageAssignments = [...images.values()]
  .reduce((sum, places) => sum + places.length, 0);

console.log('--- Master Data Integrity Audit ---');
console.log('Total attractions:', sourceStats.total);
console.log('Status distribution:', statusCounts);
console.log('Source URL present:', sourceStats.sourcePresent);
console.log('Source URL missing:', sourceStats.sourceMissing);
console.log('VERIFIED + source URL:', sourceStats.verifiedWithSource);
console.log('VERIFIED + NO source URL:', sourceStats.verifiedNoSource);
console.log('Status distribution among sourced records:', withSourceStatusCounts);
console.log('');
console.log('Non-empty image assignments:', imageAssignments);
console.log('Unique image URLs:', images.size);
console.log('Remaining duplicate image URL groups:', duplicateGroups.length);
console.log('');
console.log(
  sourceStats.verifiedNoSource === 0
    ? 'PASS: No unsourced place remains VERIFIED.'
    : 'FAIL: Some unsourced places are still VERIFIED.'
);
console.log(
  duplicateGroups.length === 0
    ? 'PASS: No duplicate displayed image URLs remain.'
    : 'FAIL: Duplicate image URLs remain.'
);
