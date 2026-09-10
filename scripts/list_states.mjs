import fs from 'fs';

const states = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
console.log('States count in data/states.json:', states.length);
for (const s of states) {
  console.log(`- ${s.id} | ${s.name} | Region: ${s.region} | Capital: ${s.capital}`);
}
