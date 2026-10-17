import fs from 'fs';
import path from 'path';
import { db } from '../../server/src/db/client';

export const declaration = {
  name: 'searchTouristPlaces',
  description: 'Search and discover verified tourist places and heritage monuments across all 28 states and 8 union territories of India. Supports filtering by keyword, city, state, category (heritage, monuments, museums, religious_cultural, nature_parks_zoo), and tags.',
  parameters: {
    type: 'OBJECT',
    properties: {
      query: {
        type: 'STRING',
        description: 'Keyword, monument name, or theme to search (e.g. "fort", "temple", "Taj Mahal", "waterfall").',
      },
      city: {
        type: 'STRING',
        description: 'Destination city name (e.g. "Jaipur", "Varanasi", "Mumbai", "Agra").',
      },
      state: {
        type: 'STRING',
        description: 'Indian State or Union Territory name (e.g. "Rajasthan", "Kerala", "Ladakh").',
      },
      category: {
        type: 'STRING',
        description: 'Category bucket: heritage, monuments, museums, tourist_places, religious_cultural, or nature_parks_zoo.',
      },
      limit: {
        type: 'NUMBER',
        description: 'Maximum number of results to return (default 6, max 20).',
      },
      offset: {
        type: 'NUMBER',
        description: 'Number of already-shown results to skip when continuing a previous search.',
      },
    },
  },
};

let cachedHierarchy: any = null;
function normalizeFilter(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getTourismDatabase() {
  if (!cachedHierarchy) {
    const dbPath = path.join(process.cwd(), 'data', 'india_tourism_database.json');
    if (fs.existsSync(dbPath)) {
      try {
        cachedHierarchy = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      } catch (err) {
        console.error('[AI Tool] Failed to load india_tourism_database.json:', err);
      }
    }
  }
  return cachedHierarchy;
}

export async function execute(args: {
  query?: string;
  city?: string;
  state?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<any> {
  const q = (args.query || '').trim().toLowerCase();
  const cityFilter = (args.city || '').trim().toLowerCase();
  const stateFilter = (args.state || '').trim().toLowerCase();
  const catFilter = (args.category || '').trim().toLowerCase();
  const limit = Math.min(Math.max(args.limit || 6, 1), 20);
  const offset = Math.max(0, Math.floor(args.offset || 0));
  const heritageCategories = new Set(['heritage', 'monuments', 'museums', 'religious_cultural']);
  const cityKey = normalizeFilter(cityFilter);
  const stateKey = normalizeFilter(stateFilter);

  const database = getTourismDatabase();
  await db.init();
  if (db.getMode() === 'postgresql') {
    const states = database?.states || [];
    const region = stateFilter ? states.find((entry: any) => [normalizeFilter(entry.name), normalizeFilter(entry.id)].includes(stateKey)) : undefined;
    const city = cityFilter ? states.flatMap((entry: any) => entry.cities || []).find((entry: any) => [normalizeFilter(entry.name), normalizeFilter(entry.id)].includes(cityKey)) : undefined;
    if ((stateFilter && !region) || (cityFilter && !city)) return { total_found: 0, results: [], data_origin: 'postgresql' };
    const result = await db.places.findAll({ stateId: region?.id, cityId: city?.id, search: q || undefined,
      category: catFilter || undefined, limit, offset });
    return { total_found: result.total, offset, data_origin: 'postgresql', results: result.places.map(place => ({
      id: place.id, name: place.name, city: place.city_id, state: place.state_id, summary: place.summary,
      official_source: place.source_url, category: place.category,
    })) };
  }
  const matchedPlaces: Array<{ place: any; score: number }> = [];

  // Ignore conversational framing and location words so natural prompts
  // become useful browse/search queries instead of literal sentence matches.
  const stopWords = new Set([
    'bhai', 'yaar', 'please', 'mujhe', 'batao', 'bataiye', 'dikhao', 'show', 'find', 'tell', 'recommend',
    'best', 'top', 'famous', 'popular', 'places', 'place', 'tourist', 'tourism', 'attractions', 'attraction',
    'visit', 'visiting', 'explore', 'sightseeing', 'things', 'thing', 'do', 'ghumne', 'ghoomne', 'ghumna', 'layak',
    'what', 'are', 'is', 'can', 'i', 'you', 'see', 'kya', 'hai', 'hain', 'mein', 'me', 'in', 'at', 'for', 'to', 'the', 'a', 'an', 'and', 'of', 'near', 'around', 'ke', 'ka', 'ki', 'ko', 'se',
    'par', 'pe', 'aur', 'kuch', 'koi', 'option', 'options', 'more', 'other', 'another', 'hidden', 'gems',
    'offbeat', 'lesser', 'known', 'secret', 'spots',
  ]);
  const queryTerms = q
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 2 && !stopWords.has(term) && normalizeFilter(term) !== cityKey && normalizeFilter(term) !== stateKey);
  const shouldFilterQuery = queryTerms.length > 0;

  if (database && database.states) {
    for (const s of database.states) {
      if (stateFilter && normalizeFilter(s.name) !== stateKey && normalizeFilter(s.id) !== stateKey) {
        continue;
      }
      for (const c of s.cities || []) {
        if (cityFilter && normalizeFilter(c.name) !== cityKey && normalizeFilter(c.id) !== cityKey) {
          continue;
        }

        const places = [
          ...(c.heritage || []),
          ...(c.monuments || []),
          ...(c.museums || []),
          ...(c.tourist_places || []),
          ...(c.religious_cultural || []),
          ...(c.nature_parks_zoo || []),
        ];

        for (const p of places) {
          const placeCategory = (p.category || '').toLowerCase();
          const matchesCategory = catFilter === 'heritage'
            ? heritageCategories.has(placeCategory) || (p.topic || '').toLowerCase() === catFilter
            : !catFilter || placeCategory === catFilter || (p.topic || '').toLowerCase() === catFilter;
          if (!matchesCategory) {
            continue;
          }

          // Some registries contain a destination overview as if it were a
          // place. Keep it out of attraction lists for that same city.
          if (cityFilter && p.name.trim().toLowerCase() === c.name.trim().toLowerCase()) {
            continue;
          }

          const searchableText = [p.name, p.id, p.category, p.topic, p.summary, ...(p.tags || [])]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          const matchedTerms = shouldFilterQuery ? queryTerms.filter((term) => searchableText.includes(term)) : [];
          if (shouldFilterQuery && matchedTerms.length === 0) continue;

          const rawTimings = p.visiting_hours || p.timings;
          let cleanTimings: string | undefined;
          if (typeof rawTimings === 'string') cleanTimings = rawTimings;
          else if (typeof rawTimings === 'object' && rawTimings) {
            cleanTimings = rawTimings.opening && rawTimings.closing ? `${rawTimings.opening} - ${rawTimings.closing}` : Object.values(rawTimings).join(', ');
          }

          const rawFee = p.entry_fee;
          let cleanFee: string | undefined;
          if (typeof rawFee === 'string') cleanFee = rawFee;
          else if (typeof rawFee === 'number') cleanFee = `₹${rawFee}`;
          else if (typeof rawFee === 'object' && rawFee) {
            cleanFee = rawFee.indian !== undefined
              ? `₹${rawFee.indian} (Indian)${rawFee.foreigner !== undefined ? ` / ₹${rawFee.foreigner} (Foreigner)` : ''}`
              : Object.entries(rawFee).map(([k, v]) => `${k}: ₹${v}`).join(' / ');
          }

          const place = {
            id: p.id,
            name: p.name,
            city: c.name,
            state: s.name,
            category: p.category || 'heritage',
            summary: p.summary,
            rating: p.rating,
            image_url: p.image_url,
            timings: cleanTimings,
            entry_fee: cleanFee,
            hotels_count: (p.hotels || []).length,
            official_source: p.source_url || p.source_page,
          };
          const nameText = p.name.toLowerCase();
          const score = shouldFilterQuery
            ? matchedTerms.length * 10 + (nameText.includes(q) ? 100 : 0) + (p.id.toLowerCase().includes(q) ? 80 : 0)
            : 0;
          matchedPlaces.push({ place, score });
        }
      }
    }
  }

  if (shouldFilterQuery) matchedPlaces.sort((a, b) => b.score - a.score);

  // Fallback to db repository if needed
  if (matchedPlaces.length === 0) {
    await db.init();
    const dbRes = await db.places.findAll();
    for (const p of dbRes.places) {
      if (stateFilter && normalizeFilter(p.state_id || '') !== stateKey) continue;
      if (catFilter && (catFilter === 'heritage' ? !heritageCategories.has(p.category || '') : p.category !== catFilter)) continue;
      const text = `${p.name} ${p.city_id || ''} ${p.summary || ''}`.toLowerCase();
      if (shouldFilterQuery && !queryTerms.some((term) => text.includes(term))) continue;
      if (cityFilter) {
        const placeCityKey = normalizeFilter(p.city_id || '');
        if (placeCityKey !== cityKey && !placeCityKey.endsWith(`-${cityKey}`)) continue;
      }
      matchedPlaces.push({ place: {
        id: p.id,
        name: p.name,
        city: p.city_id || 'India',
        summary: p.summary,
        rating: p.rating,
        official_source: p.source_url || 'Virasat Tourism Registry',
      }, score: 0 });
    }
  }

  return {
    total_found: matchedPlaces.length,
    offset,
    results: matchedPlaces.slice(offset, offset + limit).map(({ place }) => place),
  };
}
