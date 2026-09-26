import { ALL_CANONICAL_CITIES } from './compile_canonical_cities.mjs';

console.log('Total cities in ALL_CANONICAL_CITIES:', ALL_CANONICAL_CITIES.length);
const mp = ALL_CANONICAL_CITIES.filter(c => c.state_id === 'madhya-pradesh');
console.log('MP in compile_canonical_cities:', mp.map(c => `${c.name} (${c.id})`));
const khaj = ALL_CANONICAL_CITIES.find(c => c.id === 'khajuraho');
console.log('Khajuraho in compile_canonical_cities:', khaj);
const patan = ALL_CANONICAL_CITIES.find(c => c.id === 'patan');
console.log('Patan in compile_canonical_cities:', patan);
