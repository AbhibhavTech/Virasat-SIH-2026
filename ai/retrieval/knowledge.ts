import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export interface KnowledgeDocument {
  id: string; entity_id: string; name: string; city: string; state: string;
  category: string; language: string; text: string; source_url: string | null;
  source_identifier: string; verified_at: string | null; review_status: string;
  ingested_at: string; content_hash: string;
}
const sourceFile = 'data/india_tourism_database.json';
const indexFile = 'data/.database/knowledge-index.json';
const categories = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo'];
let cache: { stamp: number; documents: KnowledgeDocument[] } | undefined;

export function safeSourceUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function ingestKnowledge(force = false): { documents: KnowledgeDocument[]; changed: number } {
  const stamp = fs.statSync(path.resolve(sourceFile)).mtimeMs;
  if (!force && cache?.stamp === stamp) return { documents: cache.documents, changed: 0 };
  let previous: KnowledgeDocument[] = [];
  try { previous = JSON.parse(fs.readFileSync(indexFile, 'utf8')); } catch { /* First ingestion. */ }
  const old = new Map(previous.map(document => [document.id, document]));
  const hierarchy = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  const documents = new Map<string, KnowledgeDocument>();
  let changed = 0;
  for (const state of hierarchy.states || []) for (const city of state.cities || []) {
    for (const category of categories) for (const place of city[category] || []) {
      if (!place.id || !place.name) continue;
      const text = [place.name, place.summary, typeof place.history === 'string' ? place.history : null,
        typeof place.description === 'string' ? place.description : null].filter(Boolean).join('\n').slice(0, 12000);
      const record = {
        id: `${state.id}/${city.id}/${place.id}`, entity_id: String(place.id), name: String(place.name),
        city: String(city.name), state: String(state.name), category, language: place.language || 'en', text,
        source_url: safeSourceUrl(place.source_url || place.source_page),
        source_identifier: `${sourceFile}#${state.id}/${city.id}/${category}/${place.id}`,
        verified_at: typeof place.last_verified_at === 'string' ? place.last_verified_at : null,
        review_status: String(place.verification_status || 'unreviewed'),
      };
      const content_hash = createHash('sha256').update(JSON.stringify(record)).digest('hex');
      const existing = old.get(record.id);
      if (existing?.content_hash !== content_hash) changed++;
      documents.set(record.id, { ...record, content_hash,
        ingested_at: existing?.content_hash === content_hash ? existing.ingested_at : new Date().toISOString() });
    }
  }
  const result = [...documents.values()];
  fs.mkdirSync(path.dirname(indexFile), { recursive: true });
  const temporary = `${indexFile}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(result));
  fs.renameSync(temporary, indexFile);
  cache = { stamp, documents: result };
  return { documents: result, changed };
}

const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[-_]/g, ' ').trim();
const expansions: Record<string, string> = {
  mandir: 'temple', मंदिर: 'temple', kila: 'fort', किला: 'fort', इतिहास: 'history',
  samudra: 'beach', समुद्र: 'beach', संग्रहालय: 'museum', palace: 'palace royal',
};
export function retrieveKnowledge(query: string, filters: { city?: string; state?: string; entity_id?: string; limit?: number } = {}, documents = ingestKnowledge().documents) {
  const terms = normalize(query).split(/[^\p{L}\p{M}\p{N}]+/u).filter(term => term.length > 1);
  const expanded = [...new Set(terms.flatMap(term => [term, ...(expansions[term]?.split(' ') || [])]))];
  return documents.filter(document => (!filters.city || normalize(document.city) === normalize(filters.city)) &&
    (!filters.state || normalize(document.state) === normalize(filters.state)) &&
    (!filters.entity_id || document.entity_id === filters.entity_id))
    .map(document => {
      const name = normalize(document.name);
      const content = normalize(`${document.text} ${document.city} ${document.state} ${document.category}`);
      const score = expanded.reduce((total, term) => total + (name.includes(term) ? 5 : content.includes(term) ? 1 : 0), 0);
      return { ...document, text: document.text.slice(0, 1800), score };
    }).filter(document => document.score > 0 || Boolean(filters.entity_id))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, Math.min(Math.max(filters.limit || 5, 1), 10));
}
