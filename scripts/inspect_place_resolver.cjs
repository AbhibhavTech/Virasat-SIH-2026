const fs = require('fs');
const path = require('path');

const candidates = [
  path.join(process.cwd(), 'data', 'india_tourism_database.json'),
  path.join(__dirname, '..', 'data', 'india_tourism_database.json'),
  path.join(process.cwd(), 'Virasat-SIH-2026-main', 'data', 'india_tourism_database.json'),
];

let dbPath = null;
for (const c of candidates) {
  if (fs.existsSync(c)) {
    dbPath = c;
    break;
  }
}

if (!dbPath) {
  console.error('Database not found in candidate paths:', candidates);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
let count = 0;
let samplePlace = null;
let gatewayPlace = null;

for (const s of db.states || []) {
  for (const c of s.cities || []) {
    const places = [
      ...(c.heritage || []),
      ...(c.monuments || []),
      ...(c.religious_cultural || []),
      ...(c.nature_parks_zoo || []),
      ...(c.museums || []),
      ...(c.tourist_places || []),
    ];
    for (const p of places) {
      count++;
      if (p.name.toLowerCase().includes('gateway')) {
        gatewayPlace = { state: s.name, city: c.name, place: p };
      }
      if (!samplePlace) samplePlace = { state: s.name, city: c.name, place: p };
    }
  }
}

console.log('Total places parsed:', count);
console.log('Gateway place found:', gatewayPlace ? gatewayPlace.place.name : 'NO');
if (gatewayPlace) {
  console.log('City:', gatewayPlace.city, 'State:', gatewayPlace.state);
  console.log('Summary:', gatewayPlace.place.summary);
  console.log('Description:', gatewayPlace.place.description || gatewayPlace.place.detailed_description);
  console.log('History:', gatewayPlace.place.history || gatewayPlace.place.historical_significance);
  console.log('Timings:', gatewayPlace.place.timings);
  console.log('Entry fee:', gatewayPlace.place.entry_fee);
}
