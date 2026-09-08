// Combines all parts and writes data/heritage/monuments.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { monuments as p1 } from './monuments_part1.js';
import { monuments as p2 } from './monuments_part2.js';
import { monuments as p3 } from './monuments_part3.js';
import { monuments as p4 } from './monuments_part4.js';

const allMonuments = [...p1, ...p2, ...p3, ...p4];

console.log(`Loaded ${allMonuments.length} monuments in total.`);

// 1. Check for unique IDs
const idSet = new Set();
for (const m of allMonuments) {
  if (idSet.has(m.id)) {
    throw new Error(`Duplicate monument ID found: ${m.id}`);
  }
  idSet.add(m.id);
}
console.log('ID uniqueness check PASSED: all IDs are unique.');

// 2. Regional breakdown
const regionCounts = {};
for (const m of allMonuments) {
  regionCounts[m.region] = (regionCounts[m.region] || 0) + 1;
}
console.log('Regional breakdown:', regionCounts);

// 3. State breakdown
const stateCounts = {};
for (const m of allMonuments) {
  stateCounts[m.state] = (stateCounts[m.state] || 0) + 1;
}
console.log(`Covering ${Object.keys(stateCounts).length} states and union territories.`);
console.log('State counts:', stateCounts);

// 4. UNESCO breakdown
const unescoSites = allMonuments.filter(m => m.unesco_site);
const nonUnescoSites = allMonuments.filter(m => !m.unesco_site);
console.log(`UNESCO World Heritage Sites: ${unescoSites.length}`);
console.log(`National / Iconic Heritage Monuments: ${nonUnescoSites.length}`);

// 5. Category breakdown
const categoryCounts = {};
for (const m of allMonuments) {
  categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
}
console.log('Category breakdown:', categoryCounts);

// Write to data/heritage/monuments.json
const outputPath = path.resolve('data/heritage/monuments.json');
fs.writeFileSync(outputPath, JSON.stringify(allMonuments, null, 2), 'utf-8');
console.log(`Successfully written ${allMonuments.length} curated monuments to ${outputPath}`);
