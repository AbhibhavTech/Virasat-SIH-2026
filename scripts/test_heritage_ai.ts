import assert from 'node:assert/strict';
import { loadHeritages, heritageContext, cleanHeritage, matchHeritage } from '../ai/retrieval/heritage';
import { ingestKnowledge, retrieveKnowledge } from '../ai/retrieval/knowledge';
import { resolvePlaceEntity } from '../ai/engine/placeResolver';
import { buildContextPayload } from '../ai/context/buildContextPayload';
const sites = loadHeritages();
assert.equal(sites.length,45);
const documents = ingestKnowledge(true).documents;
for (const site of sites) {
  const h = heritageContext(site);
  assert.equal(resolvePlaceEntity(site.name)?.place.id,site.slug);
  assert.equal(h.unesco_status,site.authenticity.unesco_status);
  assert.equal(documents.filter(d=>d.id.startsWith(`heritage/${site.slug}/`)).length,5);
  assert(retrieveKnowledge(site.name,{entity_id:site.slug}).every(d=>d.source_identifier.startsWith('all_heritages.json')));
  assert(!/\[\d+-\d+ words/.test(JSON.stringify(h)));
}
assert.equal(matchHeritage('Taj ka architecture')?.slug,'taj-mahal');
assert.equal(resolvePlaceEntity('Harmandir Sahib timing')?.place.id,'golden-temple');
assert.equal(heritageContext(matchHeritage('Golden Temple')).unesco_status,'tentative');
assert.equal(cleanHeritage(null),'');
assert.equal(cleanHeritage('[400-700 words: draft]'),'');
for(const language of ['en','as','bn','brx','doi','gu','hi','kn','ks','kok','mai','ml','mni','mr','ne','or','pa','sa','sat','sd','ta','te','ur']) assert.equal(buildContextPayload({body:{language},query:{},headers:{}} as any).metadata?.language,language);
assert.equal(buildContextPayload({body:{language:'invalid'},query:{},headers:{}} as any).metadata?.language,'auto');
console.log('Heritage AI: all 45 records, aliases, 225 chunks, authenticity, null safety and 23 languages passed.');
