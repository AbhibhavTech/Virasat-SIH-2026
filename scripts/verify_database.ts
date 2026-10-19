import { Pool } from 'pg';
import '../server/src/config/environment';
const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) throw new Error('DATABASE_URL is required.');
const pool = new Pool({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined, max: 1 });
try {
  const checks = await Promise.all([
    pool.query("SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname='vector') ok"),
    pool.query("SELECT to_regclass('public.knowledge_documents') IS NOT NULL ok"),
    pool.query("SELECT to_regclass('public.data_quality_issues') IS NOT NULL ok"),
    pool.query("SELECT COUNT(*)::int count FROM schema_migrations"),
  ]);
  console.log(JSON.stringify({ connected: true, pgvector: checks[0].rows[0].ok, knowledge_store: checks[1].rows[0].ok,
    quality_store: checks[2].rows[0].ok, migrations: checks[3].rows[0].count }, null, 2));
} finally { await pool.end(); }
