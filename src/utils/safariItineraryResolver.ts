import { ALL_INDIA_WILDLIFE_RESERVES, WildlifeReserveEntity } from '../data/allIndiaWildlifeData';
import { ALL_INDIAN_TOURISM_CITIES } from '../data/cityItineraryData';
import { StateWildlifeReserve } from '../types/masterStateDirectory';

// Explicit high-fidelity base hubs for famous wildlife reserves
const EXPLICIT_SAFARI_HUBS: Record<string, string> = {
  similipal: 'Bhubaneswar',
  bhitarkanika: 'Bhubaneswar',
  tadoba: 'Nagpur',
  'sanjay gandhi': 'Mumbai',
  ranthambore: 'Jaipur',
  keoladeo: 'Bharatpur',
  sariska: 'Alwar',
  desert: 'Jaisalmer',
  gir: 'Junagadh',
  'jim corbett': 'Nainital',
  corbett: 'Nainital',
  rajaji: 'Haridwar',
  kaziranga: 'Guwahati',
  manas: 'Guwahati',
  sundarbans: 'Kolkata',
  periyar: 'Kochi',
  'silent valley': 'Palakkad',
  eravikulam: 'Munnar',
  bandipur: 'Mysuru',
  nagarhole: 'Mysuru',
  kanha: 'Jabalpur',
  bandhavgarh: 'Jabalpur',
  pench: 'Nagpur',
  panna: 'Khajuraho',
  satpura: 'Bhopal',
  mudumalai: 'Ooty',
  anamudi: 'Munnar',
  parambikulam: 'Palakkad',
  dudhwa: 'Lucknow',
  katerniaghat: 'Lucknow',
  pilibhit: 'Bareilly',
  hemis: 'Leh',
  dani: 'Srinagar',
  dachigam: 'Srinagar',
  namdapha: 'Dibrugarh',
  balpakram: 'Shillong',
  nokrek: 'Shillong',
  keibul: 'Imphal',
  khangchendzonga: 'Gangtok',
};

const CITY_NAME_SET = new Set(ALL_INDIAN_TOURISM_CITIES.map((c) => c.name.toLowerCase()));

export function resolveSafariBaseCity(
  reserve: StateWildlifeReserve,
  stateName: string,
  currentCityName?: string
): string {
  const normName = (reserve.name || '').toLowerCase();

  // 1. Check explicit mappings
  for (const [key, hub] of Object.entries(EXPLICIT_SAFARI_HUBS)) {
    if (normName.includes(key)) {
      return hub;
    }
  }

  // 2. Check candidate tokens from nearestCity, currentCity, and district
  const candidates: string[] = [];
  if (reserve.nearestCity) {
    candidates.push(
      ...reserve.nearestCity
        .split(/[\/,]/)
        .map((s) => s.trim().replace(/\(.*?\)/g, ''))
    );
  }
  if (currentCityName) candidates.push(currentCityName);
  if (reserve.district) candidates.push(reserve.district.replace(/district/i, '').trim());

  // Exact match against ALL_INDIAN_TOURISM_CITIES
  for (const cand of candidates) {
    const clean = cand.toLowerCase().trim();
    if (CITY_NAME_SET.has(clean)) {
      const match = ALL_INDIAN_TOURISM_CITIES.find((c) => c.name.toLowerCase() === clean);
      if (match) return match.name;
    }
  }

  // Partial match
  for (const cand of candidates) {
    const clean = cand.toLowerCase().trim();
    const match = ALL_INDIAN_TOURISM_CITIES.find(
      (c) => c.name.toLowerCase().includes(clean) || clean.includes(c.name.toLowerCase())
    );
    if (match) return match.name;
  }

  // Fallback to currentCityName or first candidate or state capital fallback
  return currentCityName || candidates[0] || 'Bhubaneswar';
}

export function getPlanSafariUrl(
  reserve: StateWildlifeReserve,
  stateName: string,
  currentCityName?: string,
  days: number = 3
): string {
  const baseCity = resolveSafariBaseCity(reserve, stateName, currentCityName);
  const params = new URLSearchParams({
    city: baseCity,
    safari: reserve.name,
    reserveId: reserve.id,
    state: stateName,
    days: String(days),
    prefs: 'wildlife,beaches_nature,adventure',
  });
  return `/itinerary?${params.toString()}`;
}

export function findWildlifeReserve(queryOrId: string): WildlifeReserveEntity | undefined {
  if (!queryOrId) return undefined;
  const q = queryOrId.trim().toLowerCase();
  return ALL_INDIA_WILDLIFE_RESERVES.find(
    (r) =>
      r.id.toLowerCase() === q ||
      r.name.toLowerCase() === q ||
      r.name.toLowerCase().includes(q) ||
      q.includes(r.name.toLowerCase()) ||
      r.id.replace(/-/g, ' ').includes(q)
  );
}
