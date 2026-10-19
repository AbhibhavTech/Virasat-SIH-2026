import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Pool } from 'pg';
import '../server/src/config/environment';

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) throw new Error('DATABASE_URL is required. No database credentials were printed.');
const pool = new Pool({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined, max: 1 });
const client = await pool.connect();
try {
  await client.query('SELECT pg_advisory_lock($1)', [20261019]);
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  const dir = path.resolve('server/src/db/migrations');
  const files = fs.readdirSync(dir).filter(name => /^\d+.*\.sql$/i.test(name)).sort();
  for (const filename of files) {
    const sql = fs.readFileSync(path.join(dir, filename), 'utf8');
    const checksum = createHash('sha256').update(sql).digest('hex');
    const existing = await client.query('SELECT checksum FROM schema_migrations WHERE filename=$1', [filename]);
    if (existing.rows[0]) {
      if (existing.rows[0].checksum !== checksum) throw new Error(`Applied migration changed: ${filename}`);
      continue;
    }
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations(filename, checksum) VALUES($1,$2)', [filename, checksum]);
      await client.query('COMMIT');
      console.log(JSON.stringify({ migration: filename, status: 'applied' }));
    } catch (error) { await client.query('ROLLBACK'); throw error; }
  }
  console.log(JSON.stringify({ database_migrations: 'complete', applied_or_verified: files.length }));
} finally {
  try { await client.query('SELECT pg_advisory_unlock($1)', [20261019]); } catch {}
  client.release(); await pool.end();
}
