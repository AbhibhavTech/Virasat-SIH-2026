/**
 * Virasat SIH 2026 - Unified Canonical Location Resolver
 *
 * Single source of truth for:
 * - Normalizing transliterations and diacritics (e.g., Kolkāta -> Kolkata, Hyderābād -> Hyderabad)
 * - Mapping historical and regional aliases (e.g., Trichinopoly -> Tiruchirappalli, Bombay -> Mumbai)
 * - Mapping orphaned city references to canonical entities
 * - Preserving all supplied source names as searchable aliases
 */

export interface CanonicalLocation {
  id: string;
  name: string;
  normalized_name: string;
  state_id: string;
  state_name: string;
  lat: number;
  lng: number;
  aliases: string[];
  entity_type: 'city' | 'town' | 'district' | 'metro';
}

/**
 * Remove diacritics and normalize transliterations to standard ASCII lowercase.
 * Examples:
 *   Kolkāta -> kolkata
 *   Hyderābād -> hyderabad
 *   Vishākhapatnam -> visakhapatnam
 *   Vārānasi -> varanasi
 *   Rājkot -> rajkot
 *   Nāgpur -> nagpur
 *   Guwāhāti -> guwahati
 *   Rānchi -> ranchi
 *   Āgra -> agra
 *   Farīdābād -> faridabad
 *   Chandīgarh -> chandigarh
 */
export function normalizeTransliteration(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove combining diacritical marks
    .toLowerCase()
    .replace(/[\u0101\u00E1\u00E0\u00E2\u00E4\u00E3]/g, 'a')
    .replace(/[\u012B\u00ED\u00EC\u00EE\u00EF]/g, 'i')
    .replace(/[\u016B\u00FA\u00F9\u00FB\u00FC]/g, 'u')
    .replace(/[\u0113\u00E9\u00E8\u00EA\u00EB]/g, 'e')
    .replace(/[\u014D\u00F3\u00F2\u00F4\u00F6\u00F5]/g, 'o')
    .replace(/[\u1E47\u00F1]/g, 'n')
    .replace(/[\u015B\u1E63]/g, 's')
    .replace(/[\u1E0D]/g, 'd')
    .replace(/[\u1E6D]/g, 't')
    .replace(/[\u1E5B]/g, 'r')
    .replace(/[\u1E37]/g, 'l')
    .trim();
}

/**
 * Known historical, colonial, regional, and district aliases mapping to canonical city IDs.
 */
export const CITY_ALIASES_MAP: Record<string, string> = {
  // Transliterations & historical names
  'calcutta': 'kolkata',
  'madras': 'chennai',
  'bombay': 'mumbai',
  'bangalore': 'bengaluru',
  'poona': 'pune',
  'allahabad': 'prayagraj',
  'prayag': 'prayagraj',
  'cawnpore': 'kanpur',
  'baroda': 'vadodara',
  'gauhati': 'guwahati',
  'kovai': 'coimbatore',
  'patliputra': 'patna',
  'vizag': 'visakhapatnam',
  'waltair': 'visakhapatnam',
  'pimpri-chinchwad': 'pimpri-chinchwad',
  'pimpri chinchwad': 'pimpri-chinchwad',
  'pimpri': 'pimpri-chinchwad',
  'chinchwad': 'pimpri-chinchwad',
  'nasik': 'nashik',
  'kalyan-dombivli': 'kalyan',
  'vijayavada': 'vijayawada',
  'vasai-virar': 'vasai-virar',
  'vasai virar': 'vasai-virar',
  'vasai': 'vasai-virar',
  'virar': 'vasai-virar',
  'benares': 'varanasi',
  'banaras': 'varanasi',
  'kashi': 'varanasi',
  'aurangabad': 'chhatrapati-sambhaji-nagar',
  'chhatrapati sambhajinagar': 'chhatrapati-sambhaji-nagar',
  'chhatrapati-sambhajinagar': 'chhatrapati-sambhaji-nagar',
  'haora': 'howrah',
  'trichinopoly': 'tiruchirappalli',
  'trichy': 'tiruchirappalli',
  'tiruchirapalli': 'tiruchirappalli',
  'gurgaon': 'gurugram',
  'bhubaneshwar': 'bhubaneswar',
  'trivandrum': 'thiruvananthapuram',
  'simla': 'shimla',
  'pondicherry': 'puducherry',
  'cochin': 'kochi',
  'ernakulam': 'kochi',
  'mangalore': 'mangaluru',
  'mysore': 'mysuru',
  'belgaum': 'belagavi',
  'gulbarga': 'kalaburagi',
  'hubli': 'hubballi',
  'udhagamandalam': 'ooty',
  'panjim': 'panaji',
  'madgaon': 'margao',
  'ladakh': 'leh',
  'port blair': 'port-blair',

  // Reconciled Orphan References in Existing Datasets
  'new-delhi': 'delhi',
  'new delhi': 'delhi',
  'old-delhi': 'delhi',
  'old delhi': 'delhi',
  'delhi-nct-': 'delhi',
  'rudraprayag-district': 'kedarnath',
  'panchmahal': 'champaner',
  'old-goa': 'goa',
  'vijayanagara-district': 'hampi',
  'bagalkot-district': 'badami',
  'hassan-district': 'mysuru',
  'chengalpattu-district': 'kanchipuram',
  'sri-sathya-sai-anantapur-': 'anantapur',
  'palampet-mulugu': 'warangal',
  'chhatarpur-district': 'khajuraho',
  'raisen-district': 'bhopal',
  'mahasamund-district': 'raipur',
  'puri-district': 'puri',
  'bodh-gaya': 'gaya',
  'bodh gaya': 'gaya',
  'golaghat-nagaon': 'guwahati',
  'cherrapunji-sohra-nongriat': 'shillong',
  'cherrapunji': 'shillong',
  'north-goa': 'goa',
  'canacona-south-goa-': 'goa',
  'sinquerim-candolim-goa-': 'goa',
  'leh-ladakh': 'leh',
  'nubra-valley': 'leh',
  'sonamarg': 'srinagar',
  'lonavala': 'pune',
  'khandala': 'pune',
};

/**
 * Normalizes any query or city reference into a canonical city ID.
 */
export function resolveCanonicalCityId(query: string): string {
  if (!query) return '';
  const normalized = normalizeTransliteration(query);
  const cleanKey = normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const spaceKey = normalized.replace(/[^a-z0-9]+/g, ' ').trim();

  if (CITY_ALIASES_MAP[cleanKey]) return CITY_ALIASES_MAP[cleanKey];
  if (CITY_ALIASES_MAP[spaceKey]) return CITY_ALIASES_MAP[spaceKey];
  if (CITY_ALIASES_MAP[normalized]) return CITY_ALIASES_MAP[normalized];

  return cleanKey;
}

/**
 * Returns true if a given candidate matches target city accurately (preventing substring collisions like Patna in Visakhapatnam).
 */
export function isCityExactMatch(candidateCity: string, queryCity: string): boolean {
  if (!candidateCity || !queryCity) return false;
  const canonicalCandidate = resolveCanonicalCityId(candidateCity);
  const canonicalQuery = resolveCanonicalCityId(queryCity);

  if (canonicalCandidate && canonicalQuery) {
    return canonicalCandidate === canonicalQuery;
  }

  const normCandidate = normalizeTransliteration(candidateCity).replace(/[^a-z0-9]/g, '');
  const normQuery = normalizeTransliteration(queryCity).replace(/[^a-z0-9]/g, '');
  return normCandidate === normQuery;
}
