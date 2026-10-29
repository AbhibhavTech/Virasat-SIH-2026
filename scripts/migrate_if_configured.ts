import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Pool } from 'pg';
import '../server/src/config/environment';

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  console.log(JSON.stringify({ database_migrations: 'skipped', reason: 'DATABASE_URL_not_configured' }));
} else {
  const filename = '008_itinerary_live_facts.sql';
  const migrationPath = path.resolve('server/src/db/migrations', filename);
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const checksum = createHash('sha256').update(sql).digest('hex');
  const pool = new Pool({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined, max: 1 });
  const client = await pool.connect();
  try {
    await client.query('SELECT pg_advisory_lock($1)', [20261019]);
    const schema = await client.query<{ itineraries: string | null; itinerary_stops: string | null }>(
      "SELECT to_regclass('public.itineraries') AS itineraries, to_regclass('public.itinerary_stops') AS itinerary_stops",
    );
    if (!schema.rows[0]?.itineraries || !schema.rows[0]?.itinerary_stops) {
      throw new Error('Itinerary tables are not present; database setup must complete before the server starts.');
    }
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    const existing = await client.query<{ checksum: string }>('SELECT checksum FROM schema_migrations WHERE filename=$1', [filename]);
    if (existing.rows[0]) {
      if (existing.rows[0].checksum !== checksum) throw new Error(`Applied migration checksum mismatch: ${filename}`);
      console.log(JSON.stringify({ migration: filename, status: 'already_applied' }));
    } else {
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations(filename, checksum) VALUES($1,$2)', [filename, checksum]);
        await client.query('COMMIT');
        console.log(JSON.stringify({ migration: filename, status: 'applied' }));
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    try { await client.query('SELECT pg_advisory_unlock($1)', [20261019]); } catch {}
    client.release();
    await pool.end();
  }
}
