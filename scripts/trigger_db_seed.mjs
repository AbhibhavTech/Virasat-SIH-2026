// scripts/trigger_db_seed.mjs
import { db } from '../server/src/db/client.ts';

async function main() {
  await db.init();
  await db.seedFromStaticFiles();
  console.log('✓ Database re-seeded and saved to virasat_store.json successfully!');
  const allPlaces = await db.places.findAll({ cityId: 'pune' });
  console.log(`✓ Total Pune places in DB: ${allPlaces.total}`);
}

main().catch(console.error);
