import { VERIFIED_HIDDEN_GEMS } from '../../src/data/hiddenGemsData';

export const declaration = {
  name: 'searchHiddenGems',
  description: 'Search Virasat-curated lesser-known place candidates. Candidate records are not proof of low popularity or current public access; clearly label them as candidates and ask travelers to verify local conditions.',
  parameters: {
    type: 'OBJECT',
    properties: {
      city: { type: 'STRING', description: 'Optional city or town name.' },
      state: { type: 'STRING', description: 'Optional state or union territory name.' },
      limit: { type: 'NUMBER', description: 'Maximum candidate records to return (default 5, maximum 20).' },
      offset: { type: 'NUMBER', description: 'Number of previously returned candidates to skip.' },
    },
  },
};

function normalize(value: string): string {
  return (value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function execute(args: { city?: string; state?: string; limit?: number; offset?: number }): Promise<any> {
  const city = normalize(args.city || '');
  const state = normalize(args.state || '');
  const limit = Math.min(Math.max(Math.floor(args.limit || 5), 1), 20);
  const offset = Math.max(0, Math.floor(args.offset || 0));
  const matches = VERIFIED_HIDDEN_GEMS.filter((candidate) => {
    const matchesCity = !city || normalize(candidate.city) === city;
    const matchesState = !state || normalize(candidate.state) === state || normalize(candidate.state_id || '') === state;
    return matchesCity && matchesState;
  });

  return {
    total_found: matches.length,
    offset,
    candidates: matches.slice(offset, offset + limit).map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      city: candidate.city,
      state: candidate.state,
      category: candidate.category,
      century: candidate.century,
      summary: candidate.whyInteresting,
      best_time_to_visit: candidate.bestTimeToVisit || null,
      access_tips: candidate.accessTips || null,
      coordinates: { lat: candidate.lat, lng: candidate.lng },
      candidate_status: 'curated candidate; popularity and current access not verified',
    })),
  };
}
