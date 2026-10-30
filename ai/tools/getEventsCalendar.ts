import fs from 'fs';
import path from 'path';

export const declaration = {
  name: 'getEventsCalendar',
  description: 'Search Virasat festival records from the catalogue and database. These records are not all live schedules; distinguish a usual season from a date verified for the requested year.',
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
let cachedStamp = '';
function getVerifiedFestivalsList(): any[] {
  const sourceCandidates = [
    path.resolve(process.cwd(), 'data/festivals.json'),
    path.resolve(process.cwd(), 'data/festivals_master.json'),
  ].filter(file => fs.existsSync(file));
  const candidates = sourceCandidates.length ? sourceCandidates : [
    path.resolve(process.cwd(), 'dist/data/festivals.json'),
    path.resolve(process.cwd(), 'dist/data/festivals_master.json'),
  ].filter(file => fs.existsSync(file));
  const stamp = candidates.map(file => `${file}:${fs.statSync(file).mtimeMs}`).join('|');
  if (cachedFestivals && cachedStamp === stamp) return cachedFestivals;
  const byId = new Map<string, any>();
  for (const file of candidates) {
    try {
      const source = JSON.parse(fs.readFileSync(file, 'utf-8'));
      if (Array.isArray(source)) for (const record of source) {
        if (!record?.id || !record?.name) continue;
        const prior = byId.get(String(record.id)) || {};
        byId.set(String(record.id), { ...prior, ...record });
      }
    } catch { /* Skip a bad optional file and keep other catalogue sources available. */ }
  }
  cachedFestivals = [...byId.values()];
  cachedStamp = stamp;
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
  const requestedYear = q.match(/\b(20\d{2})\b/)?.[1];
  const cityFilter = (args.city || '').trim().toLowerCase();
  const stateFilter = (args.state || '').trim().toLowerCase();
  const monthFilter = (args.month || '').trim().toLowerCase();
  const limit = Math.min(Math.max(args.limit || 6, 1), 20);


  const FESTIVAL_SEARCH_ALIASES: Record<string, string[]> = {
    holi: ['lathmar holi', 'braj holi', 'rangwali holi', 'dol jatra', 'barsana', 'gulal'],
    diwali: ['deepawali', 'deepavali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    deepawali: ['diwali', 'deepavali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    deepavali: ['diwali', 'deepawali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    karthigai: ['karthigai deepam', 'annamalai deepam', 'tiruvannamalai deepam'],
    deepam: ['karthigai deepam', 'annamalai deepam', 'tiruvannamalai deepam'],
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

  let allFestivals = getVerifiedFestivalsList();

  // Try db.festivals if available
  try {
    const { db } = await import('../../server/src/db/client.js').catch(() => import('../../server/src/db/client'));
    const dbRes = await db.festivals.findAll({ limit: 500 });
    if (dbRes && dbRes.festivals && dbRes.festivals.length > 0) {
      allFestivals = [...dbRes.festivals, ...allFestivals.filter(f => !dbRes.festivals.some((record: any) => record.id === f.id))];
    }
  } catch {
    // fallback to in-memory list
  }

  let matches = allFestivals;

  if (q) {
    const qNorm = q.replace(/\bmysore\b/g, 'mysuru').replace(/\bcalcutta\b/g, 'kolkata');
    const cleanQ = q
      .replace(/\b(what|kind|of|which|festivals?|celebrated|cleeberated|happening|in|at|tell|me|about|list|show|famous|popular|regional|cultural)\b/gi, '')
      .replace(/[?!.,;]/g, '')
      .trim();
    const aliasTerms = FESTIVAL_SEARCH_ALIASES[q] || FESTIVAL_SEARCH_ALIASES[qNorm] || (cleanQ ? FESTIVAL_SEARCH_ALIASES[cleanQ] : null) || [];
    const isMajorTerm = ['holi', 'diwali', 'navratri', 'dasara', 'dussehra'].includes(q);

    matches = matches.filter((f) => {
      const name = (f.name || '').toLowerCase();
      const idLower = (f.id || '').toLowerCase();
      const slugLower = (f.slug || '').toLowerCase();
      const desc = (f.description || '').toLowerCase();
      const vibe = (f.cultural_vibe || '').toLowerCase();
      const city = (f.primary_city || '').toLowerCase();
      const venue = (f.city_or_venue || '').toLowerCase();
      const state = (f.state || '').toLowerCase();
      const stateOrRegion = (f.state_or_region || '').toLowerCase();
      const alts = Array.isArray(f.alternate_locations)
        ? f.alternate_locations.join(' ').toLowerCase()
        : '';
      const aliases = Array.isArray(f.aliases) ? f.aliases.join(' ').toLowerCase() : '';

      // Direct match
      if (name.includes(q) || q.includes(name) || name.includes(qNorm) || qNorm.includes(name)) return true;
      if (cleanQ && (name.includes(cleanQ) || cleanQ.includes(name))) return true;
      if (idLower.includes(q) || (slugLower && slugLower.includes(q))) return true;

      // Alias dictionary check
      for (const term of aliasTerms) {
        if (name.includes(term) || idLower.includes(term) || (slugLower && slugLower.includes(term))) return true;
        if (Array.isArray(f.aliases) && f.aliases.some((a: string) => a.toLowerCase().includes(term))) return true;
      }

      const aliasInQuery =
        Array.isArray(f.aliases) &&
        f.aliases.some((al: string) => {
          const aLower = al.toLowerCase();
          return q.includes(aLower) || qNorm.includes(aLower) || aLower.includes(q) || (cleanQ && (cleanQ.includes(aLower) || aLower.includes(cleanQ)));
        });

      const nameWords = name
        .replace(/[^a-z0-9]/g, ' ')
        .split(/\s+/)
        .filter((w: string) => w.length >= 3);
      const nameWordsInQuery = nameWords.length >= 2 && nameWords.every((w: string) => q.includes(w) || qNorm.includes(w) || (cleanQ && cleanQ.includes(w)));

      if (aliasInQuery || nameWordsInQuery) return true;

      // Bidirectional state and city matching
      if (state && (q.includes(state) || state.includes(q) || (cleanQ && (cleanQ.includes(state) || state.includes(cleanQ))))) return true;
      if (stateOrRegion && (q.includes(stateOrRegion) || stateOrRegion.includes(q) || (cleanQ && (cleanQ.includes(stateOrRegion) || stateOrRegion.includes(cleanQ))))) return true;
      if (city && (q.includes(city) || city.includes(q) || (cleanQ && (cleanQ.includes(city) || city.includes(cleanQ))))) return true;
      if (venue && (q.includes(venue) || venue.includes(q) || (cleanQ && (cleanQ.includes(venue) || venue.includes(cleanQ))))) return true;
      if (alts && (q.includes(alts) || alts.includes(q) || (cleanQ && (cleanQ.includes(alts) || alts.includes(cleanQ))))) return true;
      if (aliases && (q.includes(aliases) || aliases.includes(q) || (cleanQ && (cleanQ.includes(aliases) || aliases.includes(cleanQ))))) return true;
      if (vibe.includes(q) || (cleanQ && vibe.includes(cleanQ))) return true;

      if (!isMajorTerm && (desc.includes(q) || (cleanQ && desc.includes(cleanQ)))) return true;

      return false;
    });

    matches.sort((a, b) => {
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      const aAliases = Array.isArray(a.aliases) ? a.aliases.map((al: string) => al.toLowerCase()) : [];
      const bAliases = Array.isArray(b.aliases) ? b.aliases.map((al: string) => al.toLowerCase()) : [];

      function getScore(name: string, aliases: string[]) {
        let score = 0;
        if (q === name || qNorm === name) score += 100;
        else if (q.includes(name) || qNorm.includes(name)) score += 50;
        else if (name.includes(q) || name.includes(qNorm)) score += 30;
        for (const al of aliases) {
          if (q.includes(al) || qNorm.includes(al)) score += 40;
        }
        const words = name.replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter((w: string) => w.length >= 3);
        for (const w of words) {
          if (q.includes(w) || qNorm.includes(w)) score += 10;
        }
        return score;
      }

      const scoreA = getScore(aName, aAliases);
      const scoreB = getScore(bName, bAliases);
      return scoreB - scoreA;
    });
  }

  if (cityFilter) {
    matches = matches.filter((f) => {
      const city = (f.primary_city || '').toLowerCase();
      const venue = (f.city_or_venue || '').toLowerCase();
      const alts = Array.isArray(f.alternate_locations)
        ? f.alternate_locations.join(' ').toLowerCase()
        : '';
      return city.includes(cityFilter) || venue.includes(cityFilter) || alts.includes(cityFilter);
    });
  }

  if (stateFilter) {
    matches = matches.filter((f) => {
      const state = (f.state || '').toLowerCase();
      const stateId = (f.state_id || '').toLowerCase();
      const stateOrRegion = (f.state_or_region || '').toLowerCase();
      const statesArr = Array.isArray(f.states) ? f.states.map((s: string) => s.toLowerCase()) : [];
      return (
        state.includes(stateFilter) ||
        stateId.includes(stateFilter) ||
        stateOrRegion.includes(stateFilter) ||
        statesArr.some((s: string) => s.includes(stateFilter)) ||
        (f.scope === 'ALL_INDIA' && (stateFilter === 'all india' || stateFilter === 'all-india'))
      );
    });
  }

  if (monthFilter) {
    matches = matches.filter((f) => {
      const m = (f.typical_month || '').toLowerCase();
      const s = (f.typical_season || '').toLowerCase();
      const start = (f.exact_date_start || f.start_date || '').toLowerCase();
      return m.includes(monthFilter) || s.includes(monthFilter) || start.includes(monthFilter);
    });
  }

  const results = matches.slice(0, limit).map((f) => {
    const exactDateText = [f.exact_date_start, f.exact_date_end].filter(Boolean).join(' to ');
    const exactDateMatchesRequestedYear = !requestedYear || exactDateText.includes(requestedYear);
    const verifiedForRequestedYear = Boolean(f.is_date_verified && f.exact_date_start && exactDateMatchesRequestedYear);
    const typicalTiming = [f.typical_month, f.typical_season].filter(Boolean).join(' · ') || 'Annual regional observance';
    let dateStr = f.date_rule || typicalTiming;
    if (verifiedForRequestedYear) {
      const yearLabel = requestedYear || new Date().getFullYear().toString();
      dateStr = `${f.exact_date_start}${f.exact_date_end ? ` to ${f.exact_date_end}` : ''} (verified for ${yearLabel})`;
    } else if (requestedYear) {
      dateStr = `No verified date for ${requestedYear}. Usual timing in Virasat records: ${typicalTiming}.`;
    } else if (f.date_rule) {
      dateStr = `${f.date_rule} (specific date not verified for the current year)`;
    }

    return {
      id: f.id,
      festival: f.name,
      city: f.primary_city || f.city_or_venue || f.state,
      state: f.state || f.state_or_region,
      state_or_region: f.state_or_region || f.state,
      location: `${f.primary_city || f.city_or_venue || f.state}, ${f.state}`,
      season_timing: dateStr,
      is_date_verified: verifiedForRequestedYear,
      requested_year: requestedYear || null,
      date_rule: f.date_rule || null,
      cultural_significance: f.description,
      cultural_vibe: f.cultural_vibe || 'Cultural celebration and living heritage',
      associated_places: f.associated_places || [],
      official_source: f.official_source_url || f.source_url || null,
      verification_status: f.verification_status || (f.is_date_verified ? 'verified' : 'unverified'),
    };
  });

  return {
    total_events: results.length,
    events: results,
    advisory:
      'Exact lunar calendar festival dates vary by regional thithi and state gazette. Always confirm local temple trust / state tourism schedule before booking final transit.',
  };
}
