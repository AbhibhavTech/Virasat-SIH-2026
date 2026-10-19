import { Pool } from 'pg';
import { readEnvironmentValues } from '../../server/src/config/environment';
import type { KnowledgeDocument } from './knowledge';

let pool: Pool | undefined;
function database(): Pool | null {
  const { DATABASE_URL } = readEnvironmentValues(['DATABASE_URL']);
  if (!DATABASE_URL) return null;
  pool ||= new Pool({ connectionString: DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined, max: 3 });
  return pool;
}
const vectorLiteral = (values: number[]) => `[${values.join(',')}]`;

export async function persistKnowledgeVector(document: KnowledgeDocument, values: number[], model: string): Promise<boolean> {
  const db = database();
  if (!db) return false;
  await db.query(`INSERT INTO knowledge_documents
    (id,entity_id,name,canonical_city_id,canonical_state_id,category,language,content,content_hash,source_url,source_identifier,verified_at,review_status,embedding,embedding_model,ingested_at,updated_at)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::vector,$15,$16,NOW())
    ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name, canonical_city_id=EXCLUDED.canonical_city_id,
      canonical_state_id=EXCLUDED.canonical_state_id, content=EXCLUDED.content, content_hash=EXCLUDED.content_hash,
      source_url=EXCLUDED.source_url, verified_at=EXCLUDED.verified_at, review_status=EXCLUDED.review_status,
      embedding=EXCLUDED.embedding, embedding_model=EXCLUDED.embedding_model, updated_at=NOW()`,
    [document.id,document.entity_id,document.name,document.city||null,document.state||null,document.category,document.language,
      document.text,document.content_hash,document.source_url,document.source_identifier,document.verified_at,document.review_status,
      vectorLiteral(values),model,document.ingested_at]);
  return true;
}

export async function searchKnowledgeVectors(values: number[], model: string, filters: {city?:string;state?:string;entity_id?:string}) {
  const db = database();
  if (!db) return null;
  const params: unknown[] = [vectorLiteral(values), model];
  const clauses = ['embedding IS NOT NULL', 'embedding_model=$2'];
  if (filters.city) { params.push(filters.city); clauses.push(`LOWER(canonical_city_id)=LOWER($${params.length})`); }
  if (filters.state) { params.push(filters.state); clauses.push(`LOWER(canonical_state_id)=LOWER($${params.length})`); }
  if (filters.entity_id) { params.push(filters.entity_id); clauses.push(`entity_id=$${params.length}`); }
  const result = await db.query(`SELECT id,entity_id,name,canonical_city_id city,canonical_state_id state,category,language,
    content text,source_url,source_identifier,verified_at,review_status,ingested_at,content_hash,
    1-(embedding <=> $1::vector) score FROM knowledge_documents WHERE ${clauses.join(' AND ')}
    ORDER BY embedding <=> $1::vector LIMIT 10`, params);
  return result.rows;
}
