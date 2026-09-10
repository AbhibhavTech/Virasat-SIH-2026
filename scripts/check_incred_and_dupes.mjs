import fs from 'fs';

const store = JSON.parse(fs.readFileSync('data/.database/virasat_store.json', 'utf8'));
const itdb = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));

// Check for incredibleindia URLs in store.places
let placesWithIncredibleIndia = 0;
for (const [id, p] of Object.entries(store.places)) {
  if (p.source_url && p.source_url.includes('incredibleindia')) {
    placesWithIncredibleIndia++;
  }
}
console.log('Store places with incredibleindia in source_url:', placesWithIncredibleIndia);

// Check for incredibleindia in itdb
let itdbWithIncredibleIndia = 0;
for (const s of itdb.states) {
  if (s.cities) {
    for (const c of s.cities) {
      const catKeys = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
      for (const k of catKeys) {
        if (c[k]) {
          for (const p of c[k]) {
            if ((p.source_page && p.source_page.includes('incredibleindia')) || (p.source_url && p.source_url.includes('incredibleindia'))) {
              itdbWithIncredibleIndia++;
            }
          }
        }
      }
    }
  }
}
console.log('ITDB attractions with incredibleindia URLs:', itdbWithIncredibleIndia);

// Check duplicate place names in store
const namesMap = new Map();
const duplicates = [];
for (const [id, p] of Object.entries(store.places)) {
  const normName = p.name.toLowerCase().trim();
  if (namesMap.has(normName)) {
    duplicates.push({ name: p.name, id1: namesMap.get(normName), id2: id });
  } else {
    namesMap.set(normName, id);
  }
}
console.log('Duplicate place names in store:', duplicates.length);
console.log(duplicates);
