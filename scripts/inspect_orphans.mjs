import fs from 'fs';

const store = JSON.parse(fs.readFileSync('data/.database/virasat_store.json', 'utf8'));
const cities = JSON.parse(fs.readFileSync('data/cities.json', 'utf8'));
const cityMap = new Map();
for (const c of cities) {
  cityMap.set(c.id, c);
}

const orphaned = Object.values(store.places).filter(p => !cityMap.has(p.city_id));
const distinctOrphanCityIds = Array.from(new Set(orphaned.map(p => p.city_id)));

console.log('Total orphaned places count:', orphaned.length);
console.log('Distinct orphan city_ids:', distinctOrphanCityIds.length);

for (const orphanId of distinctOrphanCityIds) {
  const matchingPlaces = orphaned.filter(p => p.city_id === orphanId);
  console.log(`\nOrphan ID: "${orphanId}" (${matchingPlaces.length} places)`);
  for (const p of matchingPlaces) {
    console.log(`  - [${p.id}] "${p.name}" (State: ${p.state_id})`);
  }
}
