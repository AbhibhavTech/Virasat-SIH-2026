import fs from 'fs';
import path from 'path';

const itdb = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('data/.database/virasat_store.json', 'utf8'));

console.log('Total store places:', Object.keys(store.places).length);

// Check places in itdb
let itdbPlaces = [];
for (const s of itdb.states) {
  if (s.cities) {
    for (const c of s.cities) {
      const catKeys = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
      for (const k of catKeys) {
        if (c[k] && Array.isArray(c[k])) {
          for (const p of c[k]) {
            itdbPlaces.push({
              place_id: p.id,
              name: p.name,
              category: p.category || k,
              city_id: c.id,
              city_name: c.name,
              state_id: s.id,
              state_name: s.name,
              data: p
            });
          }
        }
      }
    }
  }
}

console.log('Total itdb attractions found:', itdbPlaces.length);

// Check store places not in itdb
let storeOnly = [];
for (const [id, p] of Object.entries(store.places)) {
  const found = itdbPlaces.find(ip => ip.place_id === id);
  if (!found) {
    storeOnly.push({ id, name: p.name, city_id: p.city_id, state_id: p.state_id });
  }
}
console.log('Store places not in itdb:', storeOnly.length);
console.log('Sample store only places:', storeOnly.slice(0, 10));
