import { db } from '../server/src/db/client';

async function main() {
  console.log('🔄 Re-seeding database from static files...');
  await db.init();
  await db.seedFromStaticFiles();
  const metrics = await db.getAdminMetrics();
  console.log('✅ Database successfully re-seeded!');
  console.log('Metrics:', JSON.stringify(metrics, null, 2));
}

main().catch((err) => {
  console.error('❌ Failed to re-seed:', err);
  process.exit(1);
});
