import { db } from '../server/src/db/client';
import { loadAllHeritagesFromDisk, STATIC_LANGUAGES } from '../server/src/db/seedHeritages';

async function main() {
  console.log('[Seed Heritages] Starting idempotent heritage database import...');
  await db.init();

  const heritages = loadAllHeritagesFromDisk();
  console.log(`[Seed Heritages] Loaded ${heritages.length} records from source of truth (all_heritages.json).`);

  if (heritages.length !== 45) {
    throw new Error(`Expected exactly 45 heritage records, found ${heritages.length}`);
  }

  // Seed languages
  let seededLangs = 0;
  for (const lang of STATIC_LANGUAGES) {
    await db.languages.createOrUpdate(lang);
    seededLangs++;
  }
  console.log(`[Seed Heritages] Seeded ${seededLangs} scheduled languages (English + 22).`);

  // Seed heritages
  let seededHeritages = 0;
  for (const h of heritages) {
    await db.heritages.createOrUpdate(h);
    seededHeritages++;
  }

  console.log(`[Seed Heritages] Successfully seeded/updated ${seededHeritages} heritage records.`);

  // Verification
  const verifyList = await db.heritages.findAll({ limit: 100 });
  console.log(`[Seed Heritages] Verification query returned ${verifyList.total} total heritages.`);

  const sample = await db.heritages.findBySlug('taj-mahal');
  console.log(`[Seed Heritages] Sample record #1 (Taj Mahal): name="${sample?.name}", unesco_status="${sample?.unesco_status}".`);

  console.log('[Seed Heritages] DONE! All 45 heritages and 23 languages seeded idempotently.');
}

main().catch((err) => {
  console.error('[Seed Heritages] Error:', err);
  process.exit(1);
});
