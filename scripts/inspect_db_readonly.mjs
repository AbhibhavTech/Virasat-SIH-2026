import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Connected to Supabase PostgreSQL successfully.');

    // Check all schemas and tables/views
    const allTables = await client.query(`
      SELECT table_schema, table_name, table_type
      FROM information_schema.tables 
      WHERE table_name ILIKE '%fest%' OR table_name ILIKE '%event%' OR table_name ILIKE '%culture%'
      ORDER BY table_schema, table_name;
    `);
    console.log('Matching tables/views in all schemas:', allTables.rows);

    const schemas = await client.query(`SELECT schema_name FROM information_schema.schemata;`);
    console.log('All Schemas:', schemas.rows.map(r => r.schema_name));

    // Check each schema for tables
    for (const s of schemas.rows) {
      if (['pg_catalog', 'information_schema', 'pg_toast'].includes(s.schema_name)) continue;
      const sTables = await client.query(`
        SELECT table_name FROM information_schema.tables WHERE table_schema = $1;
      `, [s.schema_name]);
      console.log(`Schema ${s.schema_name} tables:`, sTables.rows.map(r => r.table_name));
    }


    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const hasFestivals = tablesRes.rows.some(r => r.table_name === 'festivals');
    if (hasFestivals) {
      const countFest = await client.query('SELECT count(*) FROM festivals');
      console.log('Festivals total count in public.festivals:', countFest.rows[0].count);

      const colsRes = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'festivals'
        ORDER BY ordinal_position;
      `);
      console.log('Festivals columns:', colsRes.rows);

      const festRes = await client.query(`SELECT * FROM festivals LIMIT 10;`);
      console.log('Festivals sample:', festRes.rows);

      const searchRes = await client.query(`
        SELECT * FROM festivals 
        WHERE name ILIKE '%holi%' OR name ILIKE '%diwali%' OR name ILIKE '%navratri%'
        LIMIT 20;
      `);
      console.log('Festivals matching holi/diwali/navratri:', searchRes.rows);
    }

    const auditRes = await client.query(`
      SELECT action, entity_type, entity_id, to_value, created_at 
      FROM audit_logs 
      ORDER BY created_at DESC 
      LIMIT 30;
    `);
    for (const a of auditRes.rows) {
      console.log('AUDIT LOG:', a.action, a.created_at, JSON.stringify(a.to_value));
    }



    // Check if there are places with category or tags mentioning festival
    const festivalPlaces = await client.query(`
      SELECT id, name, category, state_id, city_id, tags
      FROM places
      WHERE category ILIKE '%fest%' OR tags::text ILIKE '%fest%' OR name ILIKE '%holi%' OR name ILIKE '%diwali%' OR name ILIKE '%mela%' OR name ILIKE '%utsav%'
      LIMIT 50;
    `);
    console.log('Places with festival/mela/utsav/holi/diwali:', festivalPlaces.rows.length, festivalPlaces.rows);

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Database inspection error:', err);
  process.exit(1);
});
