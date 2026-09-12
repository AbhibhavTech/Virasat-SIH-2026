import { resolvePlaceEntity, loadPlacesRegistry } from '../ai/engine/placeResolver';

const { list } = loadPlacesRegistry();
console.log('Places with gateway in name:');
for (const p of list) {
  if (p.name.toLowerCase().includes('gateway')) {
    console.log(`- id: "${p.id}", name: "${p.name}", city: "${p.city}"`);
  }
}

const queries = [
  'mujhe gateway of india k baare main batao',
  'Gateway of India ka history batao',
  'Gateway ke nearby kya hai?',
  'Hawa Mahal ke baare mein batao',
  'Tell me about Hampi',
  'Taj Mahal',
  'Ajanta Caves',
  'Charminar',
  'wahan aur kya hai?',
];

console.log('Testing Place Entity Resolution:');
for (const q of queries) {
  // Pass mock context for follow-up
  const mockContext: any = q.includes('wahan') ? {
    lastPlace: { id: 'gateway-of-india', name: 'Gateway of India', city: 'Mumbai' }
  } : undefined;

  const r = resolvePlaceEntity(q, mockContext);
  console.log(`Query: "${q}"`);
  console.log(`  -> Match: ${r?.place?.name || 'NONE'} (${r?.place?.city || ''}) [Type: ${r?.matchType}, Focus: ${r?.queryFocus}]\n`);
}
