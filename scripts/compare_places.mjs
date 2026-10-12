import fs from 'fs';

const mumbaiPlaces = JSON.parse(fs.readFileSync('data/mumbai/places.json', 'utf8'));
const maharashtraPlaces = JSON.parse(fs.readFileSync('data/maharashtra/places.json', 'utf8'));

console.log('data/mumbai/places.json count:', mumbaiPlaces.length);
console.log('data/maharashtra/places.json count:', maharashtraPlaces.length);

console.log('\ndata/mumbai/places.json IDs:');
mumbaiPlaces.forEach((p, i) => console.log(`${i+1}. [${p.id}] ${p.name}`));

console.log('\ndata/maharashtra/places.json IDs:');
maharashtraPlaces.forEach((p, i) => console.log(`${i+1}. [${p.id}] ${p.name}`));
