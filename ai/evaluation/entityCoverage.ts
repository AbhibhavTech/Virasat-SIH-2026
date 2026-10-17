/** Lexical entity coverage diagnostic, NOT a factual correctness or hallucination detector.
 * Recognizes named monument phrases only; cannot verify claims about dates, ownership or fees.
 */
export function auditEntityCoverage(text: string, retrieved: Array<{name: string}>, _catalog: unknown,
  citations: number, latency: number, model: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const mentions = [...new Set(text.match(/\b(?:[A-Z][a-z]+\s+){1,5}(?:Fort|Palace|Temple|Mahal|Stupa|Museum)\b/g) || [])];
  const known = new Set(retrieved.map(place => normalize(place.name)));
  const unsupported = mentions.filter(mention => ![...known].some(name => name === normalize(mention) || name.startsWith(normalize(mention) + ' ')));
  return {
    entity_coverage: mentions.length ? (mentions.length - unsupported.length) / mentions.length : null,
    unsupported_entities: unsupported, citations_count: citations, latency_ms: latency, model_used: model,
    method: 'lexical named-monument overlap; not claim verification',
  };
}
