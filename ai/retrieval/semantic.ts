import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readEnvironmentValues } from '../../server/src/config/environment';
import { ingestKnowledge, retrieveKnowledge } from './knowledge';

type VectorIndex = { fingerprint: string; vectors: Record<string, { hash: string; values: number[] }> };
const vectorFile = 'data/.database/knowledge-vectors.json';
function configuration() {
  const env = readEnvironmentValues(['VIRASAT_EMBEDDING_URL', 'VIRASAT_EMBEDDING_MODEL', 'VIRASAT_EMBEDDING_API_KEY']);
  if (!env.VIRASAT_EMBEDDING_URL || !env.VIRASAT_EMBEDDING_MODEL) return null;
  const url = new URL(env.VIRASAT_EMBEDDING_URL);
  if (url.username || url.password || url.search || url.hash || !(url.protocol === 'https:' ||
    (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))) throw new Error('EMBEDDING_CONFIG_INVALID');
  return { url: url.href.replace(/\/$/, ''), model: env.VIRASAT_EMBEDDING_MODEL,
    key: env.VIRASAT_EMBEDDING_API_KEY, fingerprint: createHash('sha256').update(`${url.href}\0${env.VIRASAT_EMBEDDING_MODEL}`).digest('hex') };
}
async function embed(input: string[], config: NonNullable<ReturnType<typeof configuration>>) {
  const response = await fetch(`${config.url}/embeddings`, { method: 'POST', signal: AbortSignal.timeout(15000),
    headers: { 'Content-Type': 'application/json', ...(config.key ? { Authorization: `Bearer ${config.key}` } : {}) },
    body: JSON.stringify({ model: config.model, input }) });
  if (!response.ok) throw new Error('EMBEDDING_PROVIDER_UNAVAILABLE');
  const result = await response.json();
  const values = [...(result.data || [])].sort((a, b) => a.index - b.index).map(entry => entry.embedding);
  if (values.length !== input.length || values.some(vector => !Array.isArray(vector) || !vector.length || vector.length > 8192 || !vector.every(Number.isFinite))) throw new Error('EMBEDDING_RESPONSE_INVALID');
  return values as number[][];
}
export function cosine(a: number[], b: number[]) {
  if (a.length !== b.length) return 0;
  const magnitude = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0) * b.reduce((sum, value) => sum + value * value, 0));
  return magnitude ? a.reduce((sum, value, index) => sum + value * b[index], 0) / magnitude : 0;
}
function loadIndex(config: NonNullable<ReturnType<typeof configuration>>): VectorIndex {
  try { const index = JSON.parse(fs.readFileSync(vectorFile, 'utf8')); if (index.fingerprint === config.fingerprint) return index; } catch { /* No matching index. */ }
  return { fingerprint: config.fingerprint, vectors: {} };
}
export async function indexEmbeddings() {
  const config = configuration();
  if (!config) throw new Error('EMBEDDING_CONFIGURATION_REQUIRED');
  const documents = ingestKnowledge().documents;
  const index = loadIndex(config);
  let updated = 0;
  for (const document of documents) {
    if (index.vectors[document.id]?.hash === document.content_hash) continue;
    const [values] = await embed([document.text], config);
    index.vectors[document.id] = { hash: document.content_hash, values };
    fs.writeFileSync(`${vectorFile}.tmp`, JSON.stringify(index));
    fs.renameSync(`${vectorFile}.tmp`, vectorFile);
    updated++;
  }
  return { indexed: documents.length, updated };
}
export async function hybridKnowledge(query: string, filters: { city?: string; state?: string; entity_id?: string }) {
  const lexical = retrieveKnowledge(query, filters);
  try {
    const config = configuration();
    if (!config) return { retrieval_mode: 'lexical_with_term_expansion', documents: lexical };
    const index = loadIndex(config);
    if (!Object.keys(index.vectors).length) return { retrieval_mode: 'lexical_with_term_expansion', semantic_status: 'index_missing', documents: lexical };
    const [queryVector] = await embed([query.slice(0, 2000)], config);
    const candidates = ingestKnowledge().documents.filter(document =>
      (!filters.city || document.city.toLowerCase() === filters.city.toLowerCase()) &&
      (!filters.state || document.state.toLowerCase() === filters.state.toLowerCase()) &&
      (!filters.entity_id || document.entity_id === filters.entity_id));
    const semantic = candidates.filter(document => index.vectors[document.id]?.hash === document.content_hash)
      .map(document => ({ ...document, text: document.text.slice(0, 1800), score: cosine(queryVector, index.vectors[document.id].values) }))
      .filter(document => document.score > 0.25).sort((a, b) => b.score - a.score).slice(0, 10);
    const fused = new Map<string, { document: any; score: number }>();
    for (const list of [lexical, semantic]) list.forEach((document, rank) => {
      const current = fused.get(document.id); fused.set(document.id, { document, score: (current?.score || 0) + 1 / (60 + rank) });
    });
    return { retrieval_mode: 'hybrid', documents: [...fused.values()].sort((a, b) => b.score - a.score).slice(0, 5).map(entry => entry.document) };
  } catch { return { retrieval_mode: 'lexical_with_term_expansion', semantic_status: 'unavailable', documents: lexical }; }
}
