import fs from 'fs';
import path from 'path';

const festivalsPath = path.resolve('data/festivals.json');
const schemaPath = path.resolve('server/src/db/migrations/006_phase6_festivals_schema.sql');
const outputPath = path.resolve('server/src/db/migrations/006_festivals_migration_and_seed.sql');

const festivals = JSON.parse(fs.readFileSync(festivalsPath, 'utf-8'));
const schema = fs.readFileSync(schemaPath, 'utf-8');

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val.toString();
  if (Array.isArray(val)) {
    const escaped = val.map((e) => '"' + String(e).replace(/"/g, '\\"').replace(/'/g, "''") + '"');
    return "'{" + escaped.join(',') + "}'";
  }
  return "'" + String(val).replace(/'/g, "''") + "'";
}

let sql = `-- =====================================================================
-- VIRASAT FESTIVALS MIGRATION AND SEED (PHASE 6)
-- Safe, Additive, Idempotent: ON CONFLICT (id) DO NOTHING
-- Target: Supabase PostgreSQL
-- Total Records: ${festivals.length}
-- =====================================================================

${schema}

-- -------------------------------------------------------------
-- FESTIVALS SEED DATA (${festivals.length} Verified Flagship Celebrations)
-- -------------------------------------------------------------
INSERT INTO festivals (
  id, name, slug, state, state_id, primary_city, primary_city_id,
  alternate_locations, description, cultural_vibe, typical_season, typical_month,
  exact_date_start, exact_date_end, is_date_verified, is_recurring,
  associated_places, lat, lng, image_url, source_url, source_name,
  license, attribution_text, verification_status, created_at, updated_at
) VALUES
`;

const rows = festivals.map((f) => {
  const values = [
    escapeSql(f.id),
    escapeSql(f.name),
    escapeSql(f.slug || f.id),
    escapeSql(f.state),
    escapeSql(f.state_id),
    escapeSql(f.primary_city),
    escapeSql(f.primary_city_id || null),
    escapeSql(f.alternate_locations || []),
    escapeSql(f.description),
    escapeSql(f.cultural_vibe || ''),
    escapeSql(f.typical_season || ''),
    escapeSql(f.typical_month || null),
    escapeSql(f.exact_date_start || null),
    escapeSql(f.exact_date_end || null),
    escapeSql(f.is_date_verified || false),
    escapeSql(f.is_recurring !== undefined ? f.is_recurring : true),
    escapeSql(f.associated_places || []),
    escapeSql(f.lat || null),
    escapeSql(f.lng || null),
    escapeSql(f.image_url || ''),
    escapeSql(f.source_url || ''),
    escapeSql(f.source_name || ''),
    escapeSql(f.license || 'editorial_fair_use'),
    escapeSql(f.attribution_text || null),
    escapeSql(f.verification_status || 'verified'),
    escapeSql(f.created_at || '2026-09-26T00:00:00Z'),
    escapeSql(f.updated_at || '2026-09-26T00:00:00Z'),
  ];
  return `  (${values.join(', ')})`;
});

sql += rows.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n';

fs.writeFileSync(outputPath, sql, 'utf-8');
console.log(`[Success] Generated ${outputPath} with ${festivals.length} festival records.`);
