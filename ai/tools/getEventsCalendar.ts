import fs from 'fs';
import path from 'path';
import { db } from '../../server/src/db/client';

export const declaration = {
  name: 'getEventsCalendar',
  description: 'Discover verified cultural festivals, temple celebrations, heritage fairs, and seasonal arts events across all 36 Indian states and union territories.',
  parameters: {
    type: 'OBJECT',
    properties: {
      query: {
        type: 'STRING',
        description: 'Specific festival name or keyword (e.g. "Mysore Dasara", "Durga Puja", "Pushkar Mela", "Hornbill", "Bihu", "Konark").',
      },
      city: {
        type: 'STRING',
        description: 'Optional city filter (e.g. "Varanasi", "Kolkata", "Mysuru", "Pushkar", "Jaipur").',
      },
      state: {
        type: 'STRING',
        description: 'Optional state filter (e.g. "Rajasthan", "Karnataka", "West Bengal", "Assam", "Nagaland").',
      },
      month: {
        type: 'STRING',
        description: 'Optional month filter (e.g. "October", "November", "January").',
      },
      limit: {
        type: 'NUMBER',
        description: 'Maximum number of festivals to return (default 6, max 20).',
      },
    },
  },
};

let cachedFestivals: any[] | null = null;
function getVerifiedFestivalsList(): any[] {
  if (!cachedFestivals) {
    const candidates = [
      path.resolve(process.cwd(), 'data/festivals.json'),
      path.resolve(process.cwd(), 'dist/data/festivals.json'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        try {
          cachedFestivals = JSON.parse(fs.readFileSync(p, 'utf-8'));
          break;
        } catch (err) {
          console.error('[AI Tool] Failed to read festivals.json:', err);
        }
      }
    }
    if (!cachedFestivals) cachedFestivals = [];
  }
  return cachedFestivals;
}

export async function execute(args: {
  query?: string;
  city?: string;
  state?: string;
  month?: string;
  limit?: number;
}): Promise<any> {
  const q = (args.query || '').trim().toLowerCase();
  const cityFilter = (args.city || '').trim().toLowerCase();
  const stateFilter = (args.state || '').trim().toLowerCase();
  const monthFilter = (args.month || '').trim().toLowerCase();
  const limit = Math.min(Math.max(args.limit || 6, 1), 20);

  let allFestivals = getVerifiedFestivalsList();

  // Try db.festivals if available
  try {
    const dbRes = await db.festivals.findAll({ limit: 100 });
    if (dbRes && dbRes.festivals && dbRes.festivals.length > 0) {
      allFestivals = dbRes.festivals;
    }
  } catch {
    // fallback to loaded array
  }

  let matches = allFestivals;

  if (q) {
    matches = matches.filter((f) => {
      const name = (f.name || '').toLowerCase();
      const desc = (f.description || '').toLowerCase();
      const vibe = (f.cultural_vibe || '').toLowerCase();
      const city = (f.primary_city || '').toLowerCase();
      const state = (f.state || '').toLowerCase();
      const alts = Array.isArray(f.alternate_locations)
        ? f.alternate_locations.join(' ').toLowerCase()
        : '';
      return (
        name.includes(q) ||
        desc.includes(q) ||
        vibe.includes(q) ||
        city.includes(q) ||
        state.includes(q) ||
        alts.includes(q) ||
        q.includes(name)
      );
    });
  }

  if (cityFilter) {
    matches = matches.filter((f) => {
      const city = (f.primary_city || '').toLowerCase();
      const alts = Array.isArray(f.alternate_locations)
        ? f.alternate_locations.join(' ').toLowerCase()
        : '';
      return city.includes(cityFilter) || alts.includes(cityFilter);
    });
  }

  if (stateFilter) {
    matches = matches.filter((f) => {
      const state = (f.state || '').toLowerCase();
      const stateId = (f.state_id || '').toLowerCase();
      return state.includes(stateFilter) || stateId.includes(stateFilter);
    });
  }

  if (monthFilter) {
    matches = matches.filter((f) => {
      const m = (f.typical_month || '').toLowerCase();
      const s = (f.typical_season || '').toLowerCase();
      return m.includes(monthFilter) || s.includes(monthFilter);
    });
  }

  const results = matches.slice(0, limit).map((f) => {
    let dateStr = f.typical_season || f.typical_month || 'Annual regional observance';
    if (f.exact_date_start && f.exact_date_end && f.is_date_verified) {
      dateStr = `${f.exact_date_start} to ${f.exact_date_end} (Verified 2026)`;
    } else if (f.typical_month) {
      dateStr = `${f.typical_month} (${f.typical_season || 'Seasonal'})`;
    }

    return {
      id: f.id,
      festival: f.name,
      city: f.primary_city,
      state: f.state,
      location: `${f.primary_city}, ${f.state}`,
      season_timing: dateStr,
      cultural_significance: f.description,
      cultural_vibe: f.cultural_vibe || 'Cultural celebration and living heritage',
      associated_places: f.associated_places || [],
      official_source: f.source_url || 'Ministry of Culture / State Tourism',
    };
  });

  return {
    total_events: results.length,
    events: results,
    advisory:
      'Exact lunar calendar festival dates vary by regional thithi and state gazette. Always confirm local temple trust / state tourism schedule before booking final transit.',
  };
}
