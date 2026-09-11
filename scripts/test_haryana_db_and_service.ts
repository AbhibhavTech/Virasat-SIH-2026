import { db } from '../server/src/db/client.js';
import { MasterTourismDataService } from '../src/server/masterTourismDataService.js';
import { INDIA_TOURISM_DATABASE } from '../src/data/indiaTourismDatabase.js';

async function main() {
  console.log('--- 1. Testing db ---');
  await db.init();

  const resHaryana = await db.places.findAll({ stateId: 'haryana', limit: 100 });
  console.log(`db.places.findAll({ stateId: 'haryana' }) returned: total=${resHaryana.total}, places=${resHaryana.places.length}`);
  if (resHaryana.total !== 30 || resHaryana.places.length !== 30) {
    throw new Error(`Expected 30 places in db, got total=${resHaryana.total}, count=${resHaryana.places.length}`);
  }

  // Check IDs haryana_001 to haryana_030
  for (let i = 1; i <= 30; i++) {
    const id = `haryana_${String(i).padStart(3, '0')}`;
    const p = await db.places.findById(id);
    if (!p) {
      throw new Error(`Place ${id} not found in database!`);
    }
  }
  console.log('✓ All 30 places (haryana_001 to haryana_030) verified in database client.');

  const kurukshetraRes = await db.places.findAll({ cityId: 'kurukshetra' });
  console.log(`Kurukshetra places count: ${kurukshetraRes.places.length}`);
  if (kurukshetraRes.places.length !== 5) {
    throw new Error(`Expected 5 places for Kurukshetra, got ${kurukshetraRes.places.length}`);
  }

  const panipatRes = await db.places.findAll({ cityId: 'panipat' });
  console.log(`Panipat places count: ${panipatRes.places.length}`);
  if (panipatRes.places.length !== 3) {
    throw new Error(`Expected 3 places for Panipat, got ${panipatRes.places.length}`);
  }

  const pinjoreRes = await db.places.findAll({ cityId: 'pinjore' });
  console.log(`Pinjore places count: ${pinjoreRes.places.length}`);
  if (pinjoreRes.places.length !== 2) {
    throw new Error(`Expected 2 places for Pinjore, got ${pinjoreRes.places.length}`);
  }

  const morniRes = await db.places.findAll({ cityId: 'morni' });
  console.log(`Morni places count: ${morniRes.places.length}`);
  if (morniRes.places.length !== 2) {
    throw new Error(`Expected 2 places for Morni, got ${morniRes.places.length}`);
  }

  console.log('\n--- 2. Testing MasterTourismDataService ---');
  const service = MasterTourismDataService.getInstance();
  service.initialize();

  let haryanaDestCount = 0;
  for (const [id, dest] of service.destinations.entries()) {
    if (id.startsWith('haryana_') || (dest.state || '').toLowerCase() === 'haryana' || (dest.state_id || '').toLowerCase() === 'haryana') {
      haryanaDestCount++;
    }
  }
  console.log(`MasterTourismDataService Haryana destinations count: ${haryanaDestCount}`);
  if (haryanaDestCount !== 30) {
    throw new Error(`Expected 30 Haryana destinations in service, got ${haryanaDestCount}`);
  }

  console.log('\n--- 3. Testing INDIA_TOURISM_DATABASE TypeScript Export ---');
  const state = INDIA_TOURISM_DATABASE.states.find((s: any) => s.id === 'haryana');
  if (!state) throw new Error('Haryana state not found in INDIA_TOURISM_DATABASE');
  if (state.total_places !== 30) throw new Error(`Expected 30 places, got ${state.total_places}`);
  if (state.total_cities < 19) throw new Error(`Expected at least 19 cities, got ${state.total_cities}`);
  if (state.status !== 'verified') throw new Error(`Expected verified status, got ${state.status}`);
  console.log(`✓ INDIA_TOURISM_DATABASE has verified Haryana state with ${state.cities.length} cities and ${state.total_places} places.`);

  console.log('\n>>> ALL BACKEND & SERVICE TESTS PASSED! <<<');
  process.exit(0);
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
