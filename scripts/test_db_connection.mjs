import dotenv from 'dotenv';
dotenv.config({ path: 'server/.env' });

console.log('\x1b[34m[Database Connection Test]\x1b[0m Starting verification...');

async function runConnectionTest() {
  const { db } = await import('../server/src/db/client.ts');
  await db.init();

  const mode = db.getMode();
  console.log(`\x1b[32m?\x1b[0m Database mode: ${mode}`);

  const health = await db.checkHealth();
  console.log(`\x1b[32m?\x1b[0m Health status: ${health.status} (mode: ${health.mode}, database: ${health.database})`);

  if (mode === 'postgresql') {
    console.log('\x1b[34m[PostgreSQL Mode Verification]\x1b[0m');

    const ping = await db.query('SELECT 1 as connected, NOW() as server_time;');

    if (!ping || ping.length === 0 || !ping[0].connected) {
      throw new Error('Failed simple SELECT 1 query on PostgreSQL');
    }

    console.log(`\x1b[32m?\x1b[0m PostgreSQL connection verified (server time: ${ping[0].server_time})`);

    const tableRows = await db.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );

    const existingTables = new Set(tableRows.map((r) => r.table_name));

    const requiredTables = [
      'users',
      'states',
      'cities',
      'places',
      'place_images',
      'place_sources',
      'place_facts',
      'image_licenses',
      'transit_nodes',
      'favorites',
      'itineraries',
      'itinerary_days',
      'itinerary_stops',
      'ai_sessions',
      'ai_messages',
      'ai_grounding_records',
      'citizen_reports',
      'audit_logs',
      'destination_health_metrics',
    ];

    console.log(`Found ${existingTables.size} tables in public schema.`);

    const missingTables = requiredTables.filter((t) => !existingTables.has(t));

    if (missingTables.length > 0) {
      console.warn(`\x1b[33m? Missing tables:\x1b[0m ${missingTables.join(', ')}`);
      console.log('Ensure server/src/db/migrations/supabase_full_schema.sql has been executed on Supabase.');
    } else {
      console.log(`\x1b[32m?\x1b[0m All ${requiredTables.length} required tables exist in PostgreSQL schema.`);
    }

    const placeCountResult = await db.query(
      'SELECT COUNT(*) as cnt FROM places;'
    );

    console.log(
      `\x1b[32m?\x1b[0m SELECT COUNT(*) FROM places returned: ${placeCountResult[0]?.cnt || 0}`
    );
  } else {
    throw new Error('PostgreSQL mode was not activated. DATABASE_URL may not be loaded or the connection failed.');
  }

  console.log('\x1b[32m[Database Connection Test PASSED]\x1b[0m\n');
  process.exit(0);
}

runConnectionTest().catch((err) => {
  console.error('\x1b[31m[Database Connection Test FAILED]\x1b[0m', err);
  process.exit(1);
});
