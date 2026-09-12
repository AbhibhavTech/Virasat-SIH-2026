import fs from 'fs';
import path from 'path';
import { TripMemoryState } from './conversationMemory';

export interface ResolvedPlace {
  id: string;
  name: string;
  canonical_name: string;
  city: string;
  state: string;
  country: string;
  category: string;
  summary: string;
  detailed_description: string;
  historical_significance: string;
  architecture: string;
  culture: string;
  why_visit: string;
  visiting_hours: string;
  entry_fee: string;
  recommended_duration: string;
  how_to_reach: string;
  nearby_places: Array<{ id: string; name: string; category?: string; summary?: string }>;
  coordinates: { lat: number; lng: number };
  tags: string[];
  source_url: string;
  image_url: string;
  aliases: string[];
}

let cachedPlacesIndex: Map<string, ResolvedPlace> | null = null;
let cachedPlacesList: ResolvedPlace[] | null = null;
let cityPlacesMap: Map<string, ResolvedPlace[]> = new Map();

import { fileURLToPath } from 'url';

function getDirname(): string {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
}

function findFile(filename: string): string | null {
  const baseDir = getDirname();
  const candidates = [
    path.join(process.cwd(), 'data', filename),
    path.join(baseDir, '..', '..', 'data', filename),
    path.join(baseDir, '..', 'data', filename),
    path.join(process.cwd(), 'Virasat-SIH-2026-main', 'data', filename),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function normalizeKey(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Loads and indexes all verified tourist places from the 36-region Virasat database
 */
export function loadPlacesRegistry(): { list: ResolvedPlace[]; index: Map<string, ResolvedPlace> } {
  if (cachedPlacesList && cachedPlacesIndex) {
    return { list: cachedPlacesList, index: cachedPlacesIndex };
  }

  const index = new Map<string, ResolvedPlace>();
  const list: ResolvedPlace[] = [];
  cityPlacesMap = new Map();

  const dbPath = findFile('india_tourism_database.json');
  if (!dbPath) {
    console.error('[PlaceResolver] india_tourism_database.json not found');
    return { list: [], index: new Map() };
  }

  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(raw);

    // Optional supplementary files for rich details
    let mumbaiPlacesExtra: any[] = [];
    const mumbaiPath = findFile(path.join('mumbai', 'places.json'));
    if (mumbaiPath) {
      try {
        mumbaiPlacesExtra = JSON.parse(fs.readFileSync(mumbaiPath, 'utf8'));
      } catch {}
    }

    for (const s of db.states || []) {
      for (const c of s.cities || []) {
        const cityName = c.name;
        const stateName = s.name;
        const cityKey = normalizeKey(cityName);

        const allPlaces = [
          ...(c.heritage || []),
          ...(c.monuments || []),
          ...(c.religious_cultural || []),
          ...(c.nature_parks_zoo || []),
          ...(c.museums || []),
          ...(c.tourist_places || []),
        ];

        for (const p of allPlaces) {
          const id = p.id || normalizeKey(p.name).replace(/\s+/g, '-');
          const name = p.name || 'Historic Landmark';

          // Format clean strings for hours & fees
          let cleanHours = '9:00 AM - 6:00 PM';
          if (typeof p.visiting_hours === 'string') cleanHours = p.visiting_hours;
          else if (typeof p.timings === 'string') cleanHours = p.timings;
          else if (p.timings && typeof p.timings === 'object') {
            if (p.timings.opening_time && p.timings.closing_time) {
              cleanHours = `${p.timings.opening_time} - ${p.timings.closing_time}`;
            } else if (p.timings.opening && p.timings.closing) {
              cleanHours = `${p.timings.opening} - ${p.timings.closing}`;
            }
          }

          let cleanFee = 'Free / Nominal Entry';
          if (typeof p.entry_fee === 'string') cleanFee = p.entry_fee;
          else if (typeof p.entry_fee === 'number') cleanFee = `₹${p.entry_fee}`;
          else if (p.fees && p.fees.free_entry) cleanFee = 'Free Public Entry';
          else if (p.entry_fee && typeof p.entry_fee === 'object') {
            cleanFee = p.entry_fee.domestic !== undefined ? `₹${p.entry_fee.domestic} (Domestic) / ₹${p.entry_fee.international || 300} (International)` : 'Standard Entry Fee';
          }

          let duration = '1 - 2 Hours';
          if (p.suggested_duration) duration = p.suggested_duration;
          else if (p.visit_duration && p.visit_duration.label) duration = p.visit_duration.label;

          // Check extra details if available
          let extraHistory = '';
          let extraArch = '';
          let extraCulture = '';
          if (cityKey === 'mumbai') {
            const extra = mumbaiPlacesExtra.find((m) => m.id === id || normalizeKey(m.name) === normalizeKey(name));
            if (extra) {
              extraHistory = extra.history || '';
              extraCulture = extra.culture || '';
            }
          }

          // Specific historical & architectural enrichments for major national monuments
          let archDesc = p.topic || 'Indo-Islamic and regional vernacular architecture';
          if (id === 'gateway-of-india' || name.toLowerCase().includes('gateway of india')) {
            archDesc = 'Indo-Saracenic triumphal arch designed by Scottish architect George Wittet, crafted from yellow basalt stone and reinforced concrete with 16th-century Gujarati architectural elements.';
            extraHistory = 'Erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder in 1911. In 1948, the First Battalion of the Somerset Light Infantry marched through its arch in a ceremonial parade marking the final withdrawal of British troops from India.';
            extraCulture = 'A bustling coastal promenade flanked by the historic Taj Mahal Palace Hotel and the principal embarkation jetty for ferries to Elephanta Island.';
          } else if (id === 'csmt' || name.toLowerCase().includes('chhatrapati shivaji')) {
            archDesc = 'UNESCO World Heritage High Victorian Gothic Revival architecture designed by F. W. Stevens, featuring stone domes, turrets, and pointed arches combined with traditional Indian palace features.';
          } else if (id === 'hawa-mahal' || name.toLowerCase().includes('hawa mahal')) {
            archDesc = 'Five-storey pyramidal palace façade constructed from red and pink sandstone, featuring 953 intricately carved jharokhas (latticed windows) designed by Lal Chand Ustad.';
          } else if (id === 'amber-fort' || name.toLowerCase().includes('amber')) {
            archDesc = 'Massive Rajput-Mughal hill fort constructed with red sandstone and white marble, featuring the Maota Lake vista, Sheesh Mahal (Mirror Palace), and Diwan-e-Aam.';
          }

          let howToReach = `Easily accessible by auto-rickshaw, city cab, or local bus from ${cityName} railway junction.`;
          if (cityKey === 'mumbai') {
            if (id === 'gateway-of-india') {
              howToReach = 'Located at Apollo Bunder, Colaba. Nearest railway stations are Churchgate (Western Line, ~2.5 km) and CSMT (Central Line, ~2.8 km), connected by regular taxis and BEST buses.';
            } else if (id === 'csmt') {
              howToReach = 'Directly at CSMT terminal, intersecting Mumbai Suburban Railway Central Line and Harbour Line.';
            }
          } else if (cityKey === 'jaipur') {
            howToReach = `Located in ${cityName}. Nearest railhead is Jaipur Junction (JP), with direct metro and taxi connections across the walled city.`;
          }

          const resolved: ResolvedPlace = {
            id,
            name,
            canonical_name: p.canonical_name || name,
            city: cityName,
            state: stateName,
            country: 'India',
            category: p.category || 'heritage',
            summary: p.summary || p.short_description || `${name} is an iconic heritage landmark in ${cityName}.`,
            detailed_description: p.detailed_description || p.description || p.summary || '',
            historical_significance: extraHistory || p.historical_significance || p.history || p.summary || 'Significant national landmark of cultural and architectural renown.',
            architecture: archDesc,
            culture: extraCulture || p.culture || `Central focal point of living culture and heritage in ${cityName}.`,
            why_visit: p.short_description || p.summary || `One of India's most visited and celebrated heritage destinations.`,
            visiting_hours: cleanHours,
            entry_fee: cleanFee,
            recommended_duration: duration,
            how_to_reach: howToReach,
            nearby_places: [],
            coordinates: {
              lat: p.coordinates?.lat || p.lat || 0,
              lng: p.coordinates?.lng || p.lng || 0,
            },
            tags: p.tags || ['Heritage', 'Monument'],
            source_url: p.source_url || p.source_page || 'https://asi.nic.in',
            image_url: p.image_url || p.thumbnail_url || '',
            aliases: p.aliases || [],
          };

          // Index by id and canonical name
          index.set(id, resolved);
          index.set(normalizeKey(name), resolved);
          if (p.canonical_name) index.set(normalizeKey(p.canonical_name), resolved);

          // Add to city map
          const existingCityPlaces = cityPlacesMap.get(cityKey) || [];
          existingCityPlaces.push(resolved);
          cityPlacesMap.set(cityKey, existingCityPlaces);

          list.push(resolved);
        }
      }
    }

    // Attach nearby places to each place from the same city
    for (const p of list) {
      const cityKey = normalizeKey(p.city);
      const peers = cityPlacesMap.get(cityKey) || [];
      p.nearby_places = peers
        .filter((peer) => peer.id !== p.id)
        .slice(0, 4)
        .map((peer) => ({
          id: peer.id,
          name: peer.name,
          category: peer.category,
          summary: peer.summary,
        }));
    }

    // Specific aliases for famous monuments to guarantee 100% resolution
    const monumentAliases: Record<string, string> = {
      'gateway': 'gateway-of-india',
      'gateway of india': 'gateway-of-india',
      'gateway india': 'gateway-of-india',
      'gateway of india mumbai': 'gateway-of-india',
      'mumbai gateway': 'gateway-of-india',
      'hawa mahal': 'hawa-mahal',
      'hawamahal': 'hawa-mahal',
      'amber fort': 'amber-fort',
      'amer fort': 'amber-fort',
      'amber palace': 'amber-fort',
      'csmt': 'csmt',
      'chhatrapati shivaji terminus': 'csmt',
      'chhatrapati shivaji maharaj terminus': 'csmt',
      'marine drive': 'marine-drive',
      'elephanta caves': 'elephanta-caves',
      'elephanta': 'elephanta-caves',
      'taj mahal': 'taj-mahal',
      'qutub minar': 'qutub-minar',
      'qutab minar': 'qutub-minar',
      'red fort': 'red-fort',
      'lal qila': 'red-fort',
      'india gate': 'india-gate',
      'charminar': 'charminar',
      'hampi': 'hampi',
      'konark': 'konark-sun-temple',
      'konark temple': 'konark-sun-temple',
      'konark sun temple': 'konark-sun-temple',
      'golden temple': 'golden-temple',
      'harmandir sahib': 'golden-temple',
      'ajanta caves': 'ajanta-caves',
      'ajanta': 'ajanta-caves',
      'ellora caves': 'ellora-caves',
      'ellora': 'ellora-caves',
      'victoria memorial': 'victoria-memorial',
      'mysore palace': 'mysore-palace',
      'khajuraho': 'khajuraho-temples',
    };

    for (const [alias, targetId] of Object.entries(monumentAliases)) {
      const match = list.find((p) => p.id === targetId || normalizeKey(p.name) === alias || p.id.includes(targetId));
      if (match) {
        index.set(alias, match);
      }
    }

    cachedPlacesList = list;
    cachedPlacesIndex = index;
    return { list, index };
  } catch (err) {
    console.error('[PlaceResolver] Failed to parse places:', err);
    return { list: [], index: new Map() };
  }
}

/**
 * Resolves a tourist place entity from natural language query or active conversation memory
 */
export function resolvePlaceEntity(
  rawQuery: string,
  context?: TripMemoryState
): {
  place: ResolvedPlace;
  matchType: 'exact' | 'fuzzy' | 'alias' | 'contextual';
  queryFocus: 'general' | 'history' | 'architecture' | 'nearby' | 'timing' | 'ticket' | 'duration' | 'family';
} | null {
  const { list, index } = loadPlacesRegistry();
  if (!list.length) return null;

  const rawLower = (rawQuery || '').toLowerCase().trim();

  // Determine query focus
  let queryFocus: 'general' | 'history' | 'architecture' | 'nearby' | 'timing' | 'ticket' | 'duration' | 'family' = 'general';
  if (/history|itihaas|kab bana|kisne banaya|story|british|king george/i.test(rawLower)) {
    queryFocus = 'history';
  } else if (/architecture|design|structure|architect|kaisa dikhta hai|banawat/i.test(rawLower)) {
    queryFocus = 'architecture';
  } else if (/nearby|wahan aur kya|waha aur kya|paas me|around|aur kya dekh sakte|what else to see/i.test(rawLower)) {
    queryFocus = 'nearby';
  } else if (/kitna time|kitna samay|how long|duration|kab tak ghum sakte/i.test(rawLower)) {
    queryFocus = 'duration';
  } else if (/ticket|entry fee|free|pass|price|charge/i.test(rawLower)) {
    queryFocus = 'ticket';
  } else if (/timing|open right now|visiting hours|kab khulta|closed/i.test(rawLower)) {
    queryFocus = 'timing';
  } else if (/family|bachon|kids|parents|buzurg/i.test(rawLower)) {
    queryFocus = 'family';
  }

  // Strip common conversational Hindi/English prefix & suffix phrases
  const cleanedText = rawLower
    .replace(/(?:mujhe|humko|humein|bhai|yaar|please|can you|tell me about|information about|info on|details of)/gi, ' ')
    .replace(/(?:ke baare mein batao|k baare main batao|ke baare me batao|k bare me|ke bare mein|k baare me|ke baare|k bare)/gi, ' ')
    .replace(/(?:ka itihaas batao|ki history batao|ka history batao|ka itihas batao|ki history|ka itihaas|ka history)/gi, ' ')
    .replace(/(?:ke paas|k paas|ke aas paas|nearby|around|paas me|kahan hai|kidhar hai|batao|bataiye|dikhao)/gi, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Direct index check for cleaned text
  const direct = index.get(cleanedText);
  if (direct) {
    return { place: direct, matchType: 'exact', queryFocus };
  }

  // 2. Substring matching against known places (prioritize longer name matches)
  let bestMatch: ResolvedPlace | null = null;
  let bestMatchLength = 0;

  for (const p of list) {
    const pNorm = normalizeKey(p.name);
    if (pNorm.length >= 4) {
      if (rawLower.includes(pNorm) || cleanedText.includes(pNorm)) {
        if (pNorm.length > bestMatchLength) {
          bestMatch = p;
          bestMatchLength = pNorm.length;
        }
      }
    }
  }

  if (bestMatch) {
    return { place: bestMatch, matchType: 'alias', queryFocus };
  }

  // 3. Keyword / Alias Substring Search (e.g., "gateway", "hawa mahal", "hampi")
  const keyAliases: Record<string, string> = {
    gateway: 'gateway-of-india',
    hampi: 'hampi',
    'hawa mahal': 'hawa-mahal',
    'amber fort': 'amber-fort',
    'charminar': 'charminar',
    'taj mahal': 'taj-mahal',
    'qutub minar': 'qutub-minar',
    'csmt': 'csmt',
    'marine drive': 'marine-drive',
    'elephanta': 'elephanta-caves',
  };

  for (const [keyword, targetId] of Object.entries(keyAliases)) {
    if (new RegExp(`\\b${keyword}\\b`, 'i').test(rawLower)) {
      const p = list.find((item) => item.id === targetId || item.id.includes(targetId)) || list.find((item) => normalizeKey(item.name) === keyword);
      if (p) {
        return { place: p, matchType: 'alias', queryFocus };
      }
    }
  }

  // 4. Contextual Resolution: If query is a follow-up ("wahan aur kya hai?", "kitna time lagega?", "nearby hotel")
  // and no new place was mentioned, resolve to context.lastPlace
  if (context && context.lastPlace) {
    const isContextualFollowup =
      queryFocus !== 'general' ||
      /wahan|waha|nearby|is ke|iske|uske|paas|hotel|food|restaurant|1 din|ek din|plan/i.test(rawLower);

    if (isContextualFollowup) {
      // Find full place from registry
      const existing = list.find((p) => p.id === context.lastPlace?.id) || (context.lastPlace as ResolvedPlace);
      return { place: existing, matchType: 'contextual', queryFocus };
    }
  }

  return null;
}

/**
 * Returns other verified places in the same city (excluding the active place)
 */
export function getNearbyPlacesInCity(cityName: string, excludePlaceId?: string): ResolvedPlace[] {
  const { list } = loadPlacesRegistry();
  const cKey = normalizeKey(cityName);
  return list.filter((p) => normalizeKey(p.city) === cKey && p.id !== excludePlaceId).slice(0, 6);
}
