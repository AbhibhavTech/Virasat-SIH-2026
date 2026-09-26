import { db } from '../server/src/db/client.ts';
import fs from 'fs';
import path from 'path';
import { resolveCanonicalCityId, isCityExactMatch } from '../server/src/db/canonicalLocationResolver.ts';

async function runTests() {
  console.log('--- 1. Testing DB Init & Canonical Match ---');
  await db.init();

  // Test Patna hotel search vs Visakhapatnam
  const hotelsPath = path.join(process.cwd(), 'data', 'hotels.json');
  const hotels = JSON.parse(fs.readFileSync(hotelsPath, 'utf-8'));

  const patnaTarget = resolveCanonicalCityId('Patna');
  const patnaMatches = hotels.filter((h) => {
    const hCity = h.city || '';
    const hCityId = h.city_id || resolveCanonicalCityId(hCity);
    if (patnaTarget && hCityId && hCityId.toLowerCase() === patnaTarget.toLowerCase()) return true;
    return isCityExactMatch(hCity, 'Patna');
  });
  console.log('Patna hotel count:', patnaMatches.length);
  if (patnaMatches.some(h => h.city.toLowerCase().includes('visakha'))) {
    throw new Error('CRITICAL BUG: Patna hotel search returned Visakhapatnam hotel!');
  }
  console.log('✓ Patna hotel search does NOT match Visakhapatnam.');

  // Test Mumbai hotels
  const mumbaiTarget = resolveCanonicalCityId('Mumbai');
  const mumbaiMatches = hotels.filter((h) => {
    const hCity = h.city || '';
    const hCityId = h.city_id || resolveCanonicalCityId(hCity);
    if (mumbaiTarget && hCityId && hCityId.toLowerCase() === mumbaiTarget.toLowerCase()) return true;
    return isCityExactMatch(hCity, 'Mumbai');
  });
  console.log('Mumbai hotel count:', mumbaiMatches.length, mumbaiMatches.map(h => h.name));
  if (mumbaiMatches.length === 0) throw new Error('Expected Mumbai hotels to be found');
  console.log('✓ Mumbai hotels found correctly.');

  // Test Crawford market
  const crawford = await db.places.findById('crawford-market');
  console.log('Crawford market:', crawford?.name, crawford?.lat, crawford?.lng);
  if (!crawford) throw new Error('Crawford market not found in DB');
  console.log('✓ Crawford Market is in DB.');

  // Test Maharashtra festivals
  const mhFestivals = await db.festivals.findByState('Maharashtra');
  console.log('Maharashtra festivals count:', mhFestivals.length, mhFestivals.map(f => f.name));
  if (mhFestivals.length === 0) throw new Error('Expected Maharashtra festivals');
  console.log('✓ Maharashtra festivals found in DB.');

  console.log('ALL AI & HOTEL DATA INTEGRATION TESTS PASSED!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
