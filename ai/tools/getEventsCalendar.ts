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

  let matches: any[] = [];

  // 1. Try enhanced db.festivals.findAll
  try {
    const dbRes = await db.festivals.findAll({
      search: q || undefined,
      city: cityFilter || undefined,
      state: stateFilter || undefined,
      month: monthFilter || undefined,
      limit: 100,
    });
    if (dbRes && Array.isArray(dbRes.festivals)) {
      matches = dbRes.festivals;
    }
  } catch {
    // fallback to in-memory list
  }

  // 2. If db did not return results and we have static cache fallback:
  if (matches.length === 0) {
    let allFestivals = getVerifiedFestivalsList();
    matches = allFestivals;

    const FESTIVAL_SEARCH_ALIASES: Record<string, string[]> = {
      holi: ['lathmar holi', 'braj holi', 'rangwali holi', 'dol jatra', 'barsana', 'gulal'],
      diwali: ['deepawali', 'deepavali', 'deepotsav', 'dev deepawali', 'karthigai deepam', 'kali puja'],
      deepawali: ['diwali', 'deepavali', 'deepotsav', 'dev deepawali'],
      deepavali: ['diwali', 'deepawali', 'deepotsav', 'dev deepawali'],
      navratri: ['navaratri', 'durga puja', 'garba', 'dandiya', 'bathukamma'],
      navaratri: ['navratri', 'durga puja', 'garba'],
      dasara: ['dussehra', 'vijayadashami', 'mysuru dasara', 'kullu dussehra', 'bastar dussehra', 'kota dussehra'],
      dussehra: ['dasara', 'vijayadashami', 'mysuru dasara', 'kullu dussehra', 'bastar dussehra', 'kota dussehra'],
      durga: ['durga puja', 'navratri', 'dussehra'],
      chath: ['chhath puja', 'chhath', 'surya shashthi'],
      chhath: ['chhath puja', 'surya shashthi', 'dala chhath'],
      onam: ['thiruvonam', 'vallam kali'],
      pongal: ['thai pongal', 'jallikattu', 'makar sankranti', 'uttarayan'],
      bihu: ['rongali bihu', 'bohag bihu', 'magh bihu', 'kati bihu'],
      baisakhi: ['vaisakhi', 'khalsa sirjana'],
      vaisakhi: ['baisakhi'],
      eid: ['eid ul fitr', 'eid al adha', 'eid milad un nabi'],
      christmas: ['feast of st francis xavier', 'carnival of goa'],
      losar: ['tibetan new year', 'ladakhi new year', 'spiti new year'],
      shigmo: ['shigmotsav', 'goa spring festival'],
      yaoshang: ['yaoshang festival', 'manipur spring', 'thabal chongba'],
    };

    if (q) {
      const aliasTerms = FESTIVAL_SEARCH_ALIASES[q] || [];
      const wordPattern = q.length <= 4
        ? new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        : new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');

      matches = matches.filter((item) => {
        const nameLower = item.name.toLowerCase();
        const idLower = item.id.toLowerCase();
        const slugLower = (item.slug || '').toLowerCase();

        // 1. Direct match on name, slug, id in either direction
        if (nameLower.includes(q) || idLower.includes(q) || slugLower.includes(q)) {
          return true;
        }
        if (q.includes(nameLower) || (slugLower && q.includes(slugLower)) || q.includes(idLower)) {
          return true;
        }

        // Multi-word festival name has all its main tokens in query (e.g. "Mysore Dasara kab hota hai...")
        const nameWords = nameLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w: string) => w.length > 2);
        if (nameWords.length >= 2 && nameWords.every((w: string) => q.includes(w))) {
          return true;
        }

        if (item.primary_city.toLowerCase().includes(q)) return true;
        if (item.state.toLowerCase().includes(q)) return true;
        if (item.alternate_locations && item.alternate_locations.some((loc: string) => loc.toLowerCase().includes(q))) return true;
        if (item.cultural_vibe && item.cultural_vibe.toLowerCase().includes(q)) return true;
        if (Array.isArray(item.aliases)) {
          for (const a of item.aliases) {
            const aLower = a.toLowerCase();
            if (aLower.includes(q) || (aLower.length >= 4 && q.includes(aLower))) return true;
          }
        }
        for (const term of aliasTerms) {
          if (nameLower.includes(term) || idLower.includes(term)) return true;
          if (q.includes(term)) return true;
          if (Array.isArray(item.aliases) && item.aliases.some((a: string) => a.toLowerCase().includes(term))) return true;
        }
        const isMajorTerm = ['holi', 'diwali', 'navratri', 'dasara', 'dussehra'].includes(q);
        if (!isMajorTerm && wordPattern.test(item.description)) {
          return true;
        }
        return false;
      });

      // Relevance ranking
      matches.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aDirect = aName === q || q.includes(aName) || aName.includes(q);
        const bDirect = bName === q || q.includes(bName) || bName.includes(q);
        if (aDirect && !bDirect) return -1;
        if (!aDirect && bDirect) return 1;

        const qWords = q.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w: string) => w.length > 2);
        const aScore = qWords.filter((w: string) => aName.includes(w) || a.primary_city.toLowerCase().includes(w)).length;
        const bScore = qWords.filter((w: string) => bName.includes(w) || b.primary_city.toLowerCase().includes(w)).length;
        if (aScore !== bScore) return bScore - aScore;

        return a.name.localeCompare(b.name);
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
