import { hybridKnowledge } from '../retrieval/semantic';
export const declaration = {
  name: 'searchHeritageKnowledge',
  description: 'Retrieve stored heritage descriptions and source metadata. Review labels are inherited, not independent fact checks. No live prices or availability.',
  parameters: { type: 'OBJECT', properties: {
    query: { type: 'STRING' }, city: { type: 'STRING' }, state: { type: 'STRING' }, entity_id: { type: 'STRING' },
  }, required: ['query'] },
};
export async function execute(args: { query: string; city?: string; state?: string; entity_id?: string }) {
  return { live: false, ...await hybridKnowledge(args.query, args) };
}
