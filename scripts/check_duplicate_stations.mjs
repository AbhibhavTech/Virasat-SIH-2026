import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'railway_stations.json');

if (!fs.existsSync(filePath)) {
  console.error(`[CI Check] File not found: ${filePath}`);
  process.exit(1);
}

const stations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const codeCounts = new Map();
const duplicates = [];

for (const station of stations) {
  const code = (station.code || station.id).toUpperCase();
  const count = (codeCounts.get(code) || 0) + 1;
  codeCounts.set(code, count);
  if (count === 2) {
    duplicates.push(code);
  }
}

if (duplicates.length > 0) {
  console.error(`\x1b[31m[CI Check Failed]\x1b[0m Found ${duplicates.length} duplicate station codes in railway_stations.json:`);
  console.error(duplicates.join(', '));
  process.exit(1);
}

console.log(`\x1b[32m[CI Check Passed]\x1b[0m All ${stations.length} railway station codes in railway_stations.json are unique.`);
process.exit(0);
