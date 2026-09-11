import { db } from '../server/src/db/client';

async function main() {
  await db.seedFromStaticFiles();
  console.log('Reseeded virasat_store.json successfully!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
