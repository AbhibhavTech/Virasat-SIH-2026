import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./scripts/explore_image_audit_results.json', 'utf8'));

const urlMap = new Map();
for (const item of data) {
  if (!item.imageUrl) continue;
  if (!urlMap.has(item.imageUrl)) urlMap.set(item.imageUrl, []);
  urlMap.get(item.imageUrl).push(item.destination);
}

const reused = [...urlMap.entries()]
  .filter(([url, list]) => list.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

console.log('=== TOP REUSED / GENERIC IMAGE URLS ===');
for (const [url, list] of reused) {
  console.log(`\nURL (${list.length} places): ${url}`);
  list.slice(0, 6).forEach((p) => console.log(`   - ${p}`));
  if (list.length > 6) {
    console.log(`   ... and ${list.length - 6} more`);
  }
}

// Check broken URLs
const broken = data.filter((item) => item.status !== 'Working');
console.log(`\n=== TOTAL BROKEN / MISSING: ${broken.length} ===`);
const empty = broken.filter((b) => !b.imageUrl);
console.log(`- Empty string URLs: ${empty.length}`);
const httpErrors = broken.filter((b) => b.imageUrl);
console.log(`- HTTP 404/Error URLs: ${httpErrors.length}`);

// Breakdown by level
console.log('\n=== BREAKDOWN BY LEVEL ===');
for (const level of ['State/UT (Level 1)', 'Destination/Town (Level 2)', 'Attraction (Level 3)', 'Explore Map Pin']) {
  const levelItems = data.filter((d) => d.level === level);
  const levelWorking = levelItems.filter((d) => d.status === 'Working');
  const levelBroken = levelItems.filter((d) => d.status !== 'Working');
  const levelReused = levelItems.filter((d) => d.isReused);
  console.log(`${level}: Total ${levelItems.length} | Working: ${levelWorking.length} | Broken/Missing: ${levelBroken.length} | Reused: ${levelReused.length}`);
}
