import { runDatabaseSeed } from '../server/src/db/seed';
import { db } from '../server/src/db/client';
import { MasterTourismDataService } from '../src/server/masterTourismDataService';

async function runVerification() {
  console.log('=== Step 2: Verify Database Seeding ===');
  const seeded = await runDatabaseSeed();
  
  // Verify Telangana in seeded states
  const tgState = seeded.states['telangana'];
  if (!tgState) throw new Error('Telangana state missing from seeded database!');
  console.log(`✓ Seeded states: Telangana found (total_cities=${tgState.total_cities}, total_attractions=${tgState.total_attractions})`);
  
  // Verify all 15 Telangana places in seeded.places
  const tgPlaces = Object.values(seeded.places).filter((p: any) => p.state_id === 'telangana');
  console.log(`✓ Seeded places: Telangana has ${tgPlaces.length} places (expected: 15).`);
  if (tgPlaces.length !== 15) {
    console.error('Found places in Telangana:', tgPlaces.map((p: any) => ({ id: p.id, name: p.name, city: p.city })));
    throw new Error(`Expected exactly 15 Telangana places in seed, but found ${tgPlaces.length}`);
  }

  for (let i = 1; i <= 15; i++) {
    const id = `telangana_${String(i).padStart(3, '0')}`;
    const place = seeded.places[id];
    if (!place) throw new Error(`Place ${id} missing from seeded.places!`);
  }
  console.log('✓ All 15 IDs (telangana_001 to telangana_015) exist in seeded.places.');

  // Verify legacy records removed
  for (const legacy of ['charminar', 'golconda-fort', 'ramappa-temple']) {
    if (seeded.places[legacy]) {
      throw new Error(`Legacy record '${legacy}' was not deduplicated in seeded.places!`);
    }
  }
  console.log('✓ Legacy monuments (charminar, golconda-fort, ramappa-temple) properly deduplicated.');

  // Verify existing data in seed
  const punjabPlaces = Object.values(seeded.places).filter((p: any) => p.state_id === 'punjab');
  console.log(`✓ Existing state check: Punjab has ${punjabPlaces.length} places (expected: 20).`);
  if (punjabPlaces.length !== 20) {
    throw new Error(`Punjab places corrupted: expected 20, got ${punjabPlaces.length}`);
  }

  const mumbaiPlaces = Object.values(seeded.places).filter((p: any) => p.city_id === 'mumbai');
  console.log(`✓ Existing city check: Mumbai has ${mumbaiPlaces.length} places.`);
  if (mumbaiPlaces.length === 0) {
    throw new Error('Mumbai places missing!');
  }

  console.log('\n=== Step 3: Verify DB Client API (db.places) ===');
  await db.init();
  // Force re-seed in memory to verify integration
  await db.seedFromStaticFiles();

  const stateQueryResult = await db.places.findAll({ stateId: 'telangana', limit: 100 });
  console.log(`✓ db.places.findAll(stateId: 'telangana') returned ${stateQueryResult.places.length} places.`);
  if (stateQueryResult.places.length !== 15) {
    throw new Error(`db.places.findAll expected 15 Telangana places, got ${stateQueryResult.places.length}`);
  }

  // Verify city filtering
  const expectedCityCounts = {
    'hyderabad': 7,
    'warangal': 2,
    'hanamkonda': 1,
    'yadadri-bhuvanagiri': 1,
    'yadadri': 1,
    'nirmal': 1,
    'bhadradri-kothagudem': 1,
    'nalgonda': 1
  };

  for (const [cityId, count] of Object.entries(expectedCityCounts)) {
    const cityResult = await db.places.findAll({ cityId, limit: 50 });
    console.log(`✓ db.places.findAll(cityId: '${cityId}') returned ${cityResult.places.length} places (expected ${count}).`);
    if (cityResult.places.length !== count) {
      throw new Error(`City ${cityId} expected ${count} places, got ${cityResult.places.length}`);
    }
  }

  // Verify individual lookup
  for (let i = 1; i <= 15; i++) {
    const id = `telangana_${String(i).padStart(3, '0')}`;
    const p = await db.places.findById(id);
    if (!p) throw new Error(`db.places.findById('${id}') returned null!`);
  }
  console.log('✓ db.places.findById returned valid place records for all 15 IDs.');

  console.log('\n=== Step 4: Verify MasterTourismDataService ===');
  const masterService = MasterTourismDataService.getInstance();
  masterService.initialize();

  const masterTgDestinations = masterService.getCategoryRecords('destinations', { state: 'telangana', limit: 100 });
  console.log(`✓ masterService.getCategoryRecords('destinations', state: 'telangana') returned ${masterTgDestinations.records.length} records.`);
  if (masterTgDestinations.records.length !== 15) {
    throw new Error(`MasterTourismDataService expected 15 Telangana destinations, got ${masterTgDestinations.records.length}`);
  }

  const hydDestinations = masterService.getCategoryRecords('destinations', { city: 'hyderabad', limit: 100 });
  const tgHyd = hydDestinations.records.filter((p: any) => p.id.startsWith('telangana_'));
  console.log(`✓ masterService Hyderabad destinations contains ${tgHyd.length} Telangana places (expected: 7).`);
  if (tgHyd.length !== 7) {
    throw new Error(`MasterTourismDataService expected 7 Hyderabad Telangana places, got ${tgHyd.length}`);
  }

  console.log('\n>>> ALL SERVICE AND DATABASE INTEGRATION TESTS PASSED SUCCESSFULLY! <<<');
}

runVerification().catch((err) => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
