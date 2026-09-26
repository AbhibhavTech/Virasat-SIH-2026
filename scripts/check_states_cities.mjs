import fs from 'fs';

const dbData = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));
const tg = dbData.states.find(s => s.name === 'Telangana');

for (const c of tg.cities) {
  const places = [
    ...(c.heritage || []),
    ...(c.monuments || []),
    ...(c.museums || []),
    ...(c.tourist_places || []),
    ...(c.religious_cultural || []),
    ...(c.nature_parks_zoo || []),
  ];
  const found = places.filter(p => (p.name || '').toLowerCase().includes('ramappa'));
  if (found.length) {
    console.log(`City "${c.name}" (${c.id}) contains:`, found.map(p => p.name));
  }
}
