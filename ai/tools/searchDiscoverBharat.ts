import { loadDiscoverBharat } from '../retrieval/discoverBharat';

export const declaration = {
  name: 'searchDiscoverBharat',
  description: 'Search the newly imported Discover Bharat state, city, attraction, and proposed hidden-gem records. These five region files are editorial drafts with pending verification; use facts in the record but never describe pending practical details as current or verified.',
  parameters: { type: 'OBJECT', properties: {
    query: { type: 'STRING', description: 'Place, city, state, category, or question keywords.' },
    city: { type: 'STRING' },
    state: { type: 'STRING' },
    hidden_gems_only: { type: 'BOOLEAN' },
    limit: { type: 'NUMBER' },
  } },
};

const norm = (value: unknown) => String(value || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ').trim();

export async function execute(args: { query?: string; city?: string; state?: string; hidden_gems_only?: boolean; limit?: number }) {
  const data = loadDiscoverBharat();
  const query = norm(args.query);
  const city = norm(args.city);
  const state = norm(args.state);
  const terms = query.split(/\s+/).filter(term => term.length > 1);
  const max = Math.min(Math.max(Math.floor(args.limit || 8), 1), 20);
  const candidates = data.attractions.filter(place => {
    if (city && !norm(place.city).includes(city) && !norm(place.city_id).includes(city)) return false;
    if (state && !norm(place.state).includes(state) && !norm(place.state_id).includes(state)) return false;
    if (args.hidden_gems_only && !place.is_hidden_gem) return false;
    return true;
  }).map(place => {
    const searchable = norm([place.name, place.city, place.state, place.category, ...place.sub_categories, place.summary,
      place.is_hidden_gem ? 'hidden gem offbeat local lesser known' : '', JSON.stringify(place.detail_page)].join(' '));
    const name = norm(place.name);
    const exactScore = query ? (name === query ? 100 : name.includes(query) || query.includes(name) ? 40 : 0) : 0;
    const score = exactScore + terms.reduce((sum, term) => sum + (name.includes(term) ? 8 : searchable.includes(term) ? 1 : 0), 0) + (args.hidden_gems_only && place.is_hidden_gem ? 2 : 0);
    return { place, score };
  }).filter(entry => !query || entry.score > 0).sort((a, b) => b.score - a.score || a.place.name.localeCompare(b.place.name)).slice(0, max).map(({ place }) => ({
    id: place.id, name: place.name, city: place.city, state: place.state, category: place.category, source_dataset: place.source_dataset,
    sub_categories: place.sub_categories, summary: place.summary, is_hidden_gem: place.is_hidden_gem,
    verification_status: place.verification_status, detail_page: place.detail_page, app_path: place.url,
  }));
  return { source: 'Discover Bharat region draft files', publication_status: 'editorial_drafts_not_runtime_published', regions_available: data.regions.map(region => region.name), total_matches_returned: candidates.length, results: candidates,
    advisory: 'Preserve each record verification_status and source_dataset. Null or needs_verification operational fields are unknown. Stored hotel suggestions do not establish that a business is open or has current availability.' };
}
