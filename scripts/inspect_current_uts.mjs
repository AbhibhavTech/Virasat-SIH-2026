import fs from 'fs';

const db = JSON.parse(fs.readFileSync('data/india_tourism_database.json', 'utf8'));
const canonicalUts = [
  'andaman-and-nicobar-islands',
  'chandigarh',
  'dadra-and-nagar-haveli-and-daman-and-diu',
  'delhi',
  'jammu-and-kashmir',
  'ladakh',
  'lakshadweep',
  'puducherry'
];

console.log('Total states/UTs in db:', db.states.length);
for (const id of canonicalUts) {
  const s = db.states.find(x => x.id === id);
  if (!s) {
    console.log('MISSING UT:', id);
  } else {
    const totalPlaces = (s.cities || []).reduce((acc, c) => {
      const places = [
        ...(c.heritage || []),
        ...(c.monuments || []),
        ...(c.museums || []),
        ...(c.tourist_places || []),
        ...(c.religious_cultural || []),
        ...(c.nature_parks_zoo || [])
      ];
      return acc + places.length;
    }, 0);
    console.log(`UT: ${s.id} (${s.name}) | capital: ${s.capital} | total_cities: ${s.total_cities} (actual: ${s.cities?.length}) | total_attractions: ${s.total_attractions} (actual places: ${totalPlaces})`);
    for (const c of s.cities || []) {
      const cPlaces = [
        ...(c.heritage || []),
        ...(c.monuments || []),
        ...(c.museums || []),
        ...(c.tourist_places || []),
        ...(c.religious_cultural || []),
        ...(c.nature_parks_zoo || [])
      ];
      console.log(`  -> City: ${c.id} (${c.name}) | places: ${cPlaces.length}`);
      for (const p of cPlaces) {
        console.log(`     * [${p.id}] ${p.name} (cat: ${p.category}, status: ${p.verification_status || p.status})`);
      }
    }
  }
}
