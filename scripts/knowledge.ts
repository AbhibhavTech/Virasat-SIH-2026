import { ingestKnowledge, retrieveKnowledge } from '../ai/retrieval/knowledge';
import { indexEmbeddings } from '../ai/retrieval/semantic';
const [command, ...query] = process.argv.slice(2);
if (command === 'embed') console.log(JSON.stringify(await indexEmbeddings()));
else if (command === 'search') console.log(JSON.stringify(retrieveKnowledge(query.join(' ')), null, 2));
else if (command === 'ingest' || command === 'reindex') {
  const result = ingestKnowledge(command === 'reindex');
  console.log(JSON.stringify({ documents: result.documents.length, changed: result.changed, index: 'data/.database/knowledge-index.json' }));
} else throw new Error('Use ingest, reindex, or search <question>');
