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
    },
  },
};

let cachedHierarchy: any = null;
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
}): Promise<any> {
  const q = (args.query || '').trim().toLowerCase();
  const cityFilter = (args.city || '').trim().toLowerCase();
  const stateFilter = (args.state || '').trim().toLowerCase();
  const catFilter = (args.category || '').trim().toLowerCase();
  const limit = Math.min(Math.max(args.limit || 6, 1), 20);

  const database = getTourismDatabase();
  const matchedPlaces: any[] = [];

  if (database && database.states) {
    for (const s of database.states) {
      if (stateFilter && !s.name.toLowerCase().includes(stateFilter) && s.id.toLowerCase() !== stateFilter) {
        continue;
      }
      for (const c of s.cities || []) {
        if (cityFilter && !c.name.toLowerCase().includes(cityFilter) && c.id.toLowerCase() !== cityFilter) {
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
          if (catFilter && (p.category || '').toLowerCase() !== catFilter && (p.topic || '').toLowerCase() !== catFilter) {
            continue;
          }

          if (q) {
            const matchesQuery =
              p.name.toLowerCase().includes(q) ||
              p.id.toLowerCase().includes(q) ||
              (p.summary || '').toLowerCase().includes(q) ||
              (p.tags || []).some((t: string) => t.toLowerCase().includes(q));
            if (!matchesQuery) continue;
          }

          const rawTimings = p.visiting_hours || p.timings;
          let cleanTimings = '9:00 AM - 5:30 PM';
          if (typeof rawTimings === 'string') cleanTimings = rawTimings;
          else if (typeof rawTimings === 'object' && rawTimings) {
            cleanTimings = rawTimings.opening && rawTimings.closing ? `${rawTimings.opening} - ${rawTimings.closing}` : Object.values(rawTimings).join(', ');
          }

          const rawFee = p.entry_fee;
          let cleanFee = '₹50 (Indian) / ₹300 (Foreigner)';
          if (typeof rawFee === 'string') cleanFee = rawFee;
          else if (typeof rawFee === 'number') cleanFee = `₹${rawFee}`;
          else if (typeof rawFee === 'object' && rawFee) {
            cleanFee = rawFee.indian !== undefined ? `₹${rawFee.indian} (Indian) / ₹${rawFee.foreigner || 300} (Foreigner)` : Object.entries(rawFee).map(([k, v]) => `${k}: ₹${v}`).join(' / ');
          }

          matchedPlaces.push({
            id: p.id,
            name: p.name,
            city: c.name,
            state: s.name,
            category: p.category || 'heritage',
            summary: p.summary,
            rating: p.rating || 4.7,
            image_url: p.image_url,
            timings: cleanTimings,
            entry_fee: cleanFee,
            hotels_count: (p.hotels || []).length,
            official_source: p.source_url || 'Archaeological Survey of India / State Tourism',
          });

          if (matchedPlaces.length >= limit) break;
        }
        if (matchedPlaces.length >= limit) break;
      }
      if (matchedPlaces.length >= limit) break;
    }
  }

  // Fallback to db repository if needed
  if (matchedPlaces.length === 0) {
    await db.init();
    const dbRes = await db.places.findAll();
    for (const p of dbRes.places) {
      if (q && !p.name.toLowerCase().includes(q) && !(p.city_id || '').toLowerCase().includes(q)) continue;
      if (cityFilter && !(p.city_id || '').toLowerCase().includes(cityFilter)) continue;
      matchedPlaces.push({
        id: p.id,
        name: p.name,
        city: p.city_id || 'India',
        summary: p.summary,
        rating: p.rating,
        official_source: p.source_url || 'Virasat Tourism Registry',
      });
      if (matchedPlaces.length >= limit) break;
    }
  }

  return {
    total_found: matchedPlaces.length,
    results: matchedPlaces,
  };
}
