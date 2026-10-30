import { Router, Request, Response } from 'express';
import { ALL_INDIAN_TOURISM_CITIES } from '../../../../src/data/cityItineraryData';
import { INDIA_TOURISM_DATABASE } from '../../../../src/data/indiaTourismDatabase';
import { MASTER_TOURISM_PLACES } from '../../../../src/data/masterTourismPlacesData';

export const localGuideRouter = Router();

type OSMItem = {
  id: string;
  name: string;
  kind: 'restaurant' | 'hotel' | 'temple' | 'attraction';
  lat: number;
  lng: number;
  locality: string | null;
  cuisine: string | null;
  openingHours: string | null;
  fee: string | null;
  stars: number | null;
  website: string | null;
  image: string | null;
  sourceUrl: string;
  source: 'OpenStreetMap';
  verification: 'crowd-mapped listing';
}

type GuideResponse = {
  city: string;
  state: string;
  center: { lat: number; lng: number };
  restaurants: OSMItem[];
  hotels: OSMItem[];
  temples: OSMItem[];
  attractions: OSMItem[];
  sourceUrl: string;
  attribution: string;
  retrievedAt: string;
  note: string;
};

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const GEOCODE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const guideCache = new Map<string, { expiresAt: number; value: GuideResponse }>();
const geocodeCache = new Map<string, { expiresAt: number; center: { lat: number; lng: number } }>();
let geocodeQueue = Promise.resolve();
let lastNominatimCallAt = 0;
let lastOverpassCallAt = 0;
let overpassCoolingDownUntil = 0;

const cityAliases: Record<string, string[]> = {
  'panajioldgoa': ['goa', 'panaji', 'oldgoa', 'velhagoa'],
  'oldgoa': ['goa', 'panaji', 'velhagoa'],
  'panjim': ['goa', 'panaji', 'oldgoa'],
  'bombay': ['mumbai'],
  'bangalore': ['bengaluru'],
  'newdelhi': ['delhi'],
};

const normalize = (value: string) => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getKnownCityCenter(cityId: string, cityName: string): { lat: number; lng: number } | null {
  const db = INDIA_TOURISM_DATABASE as { states?: Array<{ cities?: Array<{ id?: string; name?: string; lat?: number; lng?: number; coordinates?: { lat?: number; lng?: number } }> }> };
  const records = db.states?.flatMap((state) => state.cities || []) || [];
  const cityRecord = records.find((record) => record.id?.toLowerCase() === cityId.toLowerCase()) ||
    records.find((record) => normalize(record.name || '') === normalize(cityName));
  const lat = cityRecord?.coordinates?.lat ?? cityRecord?.lat;
  const lng = cityRecord?.coordinates?.lng ?? cityRecord?.lng;
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat: Number(lat), lng: Number(lng) };

  const matchingPlaces = MASTER_TOURISM_PLACES.filter((place) => place.city_id.toLowerCase() === cityId.toLowerCase());
  if (!matchingPlaces.length) return null;
  return {
    lat: matchingPlaces.reduce((sum, place) => sum + place.lat, 0) / matchingPlaces.length,
    lng: matchingPlaces.reduce((sum, place) => sum + place.lng, 0) / matchingPlaces.length,
  };
}

async function geocodeCity(cityName: string, stateName: string, cacheKey: string): Promise<{ lat: number; lng: number } | null> {
  const cached = geocodeCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.center;

  const task = geocodeQueue.then(async () => {
    const waitMs = Math.max(0, 1100 - (Date.now() - lastNominatimCallAt));
    if (waitMs) await wait(waitMs);
    lastNominatimCallAt = Date.now();
    const query = new URLSearchParams({ q: `${cityName}, ${stateName}, India`, format: 'jsonv2', limit: '1', countrycodes: 'in' });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${query.toString()}`, {
      headers: {
        'User-Agent': 'Virasat-Travel-Guide/1.0 (https://virasat-sih-2026-1.onrender.com; city discovery)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(9000),
    });
    if (!response.ok) return null;
    const rows = await response.json() as Array<{ lat: string; lon: string }>;
    const first = rows[0];
    if (!first) return null;
    const center = { lat: Number(first.lat), lng: Number(first.lon) };
    if (!Number.isFinite(center.lat) || !Number.isFinite(center.lng)) return null;
    geocodeCache.set(cacheKey, { center, expiresAt: Date.now() + GEOCODE_TTL_MS });
    return center;
  });
  geocodeQueue = task.then(() => undefined, () => undefined);
  return task;
}

function asItem(element: any): OSMItem | null {
  const tags = element?.tags || {};
  const name = String(tags['name:en'] || tags.name || '').trim();
  if (!name || name.length > 120) return null;
  const lat = Number(element.lat ?? element.center?.lat);
  const lng = Number(element.lon ?? element.center?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  let kind: OSMItem['kind'] | null = null;
  if (tags.amenity === 'restaurant' || tags.amenity === 'cafe' || tags.amenity === 'fast_food' || tags.amenity === 'food_court') kind = 'restaurant';
  else if (tags.tourism === 'hotel' || tags.tourism === 'motel') kind = 'hotel';
  else if (tags.amenity === 'place_of_worship' || tags.building === 'temple') kind = 'temple';
  else if (tags.tourism === 'attraction' || tags.tourism === 'museum' || tags.tourism === 'viewpoint' || tags.historic || tags.leisure === 'park' || tags.natural === 'beach') kind = 'attraction';
  if (!kind) return null;

  const rawStars = String(tags.stars || tags['hotel:stars'] || '').trim().match(/^([3-5])(?:\D|$)/)?.[1];
  const commons = String(tags.wikimedia_commons || '').replace(/^File:/i, '').trim();
  let image = /^https?:\/\//i.test(tags.image || '') ? String(tags.image) : null;
  if (!image && commons) image = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(commons)}`;
  const address = [tags['addr:suburb'], tags['addr:neighbourhood'], tags['addr:city']].filter(Boolean).join(', ');
  const elementType = ['node', 'way', 'relation'].includes(element.type) ? element.type : 'node';
  return {
    id: `osm-${elementType}-${element.id}`,
    name,
    kind,
    lat,
    lng,
    locality: address || null,
    cuisine: tags.cuisine || null,
    openingHours: tags.opening_hours || null,
    fee: tags.charge || (tags.fee === 'no' ? 'Free (OSM listing)' : null),
    stars: rawStars ? Number(rawStars) : null,
    website: /^https?:\/\//i.test(tags.website || '') ? String(tags.website) : null,
    image,
    sourceUrl: `https://www.openstreetmap.org/${elementType}/${element.id}`,
    source: 'OpenStreetMap',
    verification: 'crowd-mapped listing',
  };
}

async function fetchOSMItems(center: { lat: number; lng: number }): Promise<OSMItem[]> {
  if (Date.now() < overpassCoolingDownUntil) throw new Error('Place-data service is cooling down after a rate-limit response.');
  const waitMs = Math.max(0, 5000 - (Date.now() - lastOverpassCallAt));
  if (waitMs) await wait(waitMs);
  lastOverpassCallAt = Date.now();
  const around = `around:5000,${center.lat.toFixed(5)},${center.lng.toFixed(5)}`;
  const query = `[out:json][timeout:12];(nwr(${around})[amenity~"^(restaurant|cafe|fast_food|food_court)$"];nwr(${around})[tourism~"^(hotel|motel|attraction|museum|viewpoint)$"];nwr(${around})[amenity="place_of_worship"];nwr(${around})[building="temple"];nwr(${around})[historic];nwr(${around})[leisure="park"];nwr(${around})[natural="beach"];);out center tags 300;`;
  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Accept: 'application/json',
      'User-Agent': 'Virasat-Travel-Guide/1.0 (https://virasat-sih-2026-1.onrender.com; city discovery)',
      Referer: 'https://virasat-sih-2026-1.onrender.com/',
    },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(24000),
  });
  if (!response.ok) {
    if (response.status === 406 || response.status === 429) overpassCoolingDownUntil = Date.now() + 30_000;
    throw new Error(`Overpass returned ${response.status}`);
  }
  const payload = await response.json() as { elements?: any[] };
  return (payload.elements || []).map(asItem).filter((item): item is OSMItem => Boolean(item));
}

localGuideRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const cityKey = String(req.query.city || '').trim();
  const normalizedKey = normalize(cityKey.replace(/\s*\([^)]*\)\s*$/, ''));
  const acceptedAliases = cityAliases[normalizedKey] || [];
  const city = ALL_INDIAN_TOURISM_CITIES.find((entry) =>
    entry.id.toLowerCase() === cityKey.toLowerCase() ||
    normalize(entry.name) === normalizedKey ||
    normalize(entry.displayName) === normalizedKey ||
    acceptedAliases.includes(normalize(entry.name))
  );
  if (!city) {
    res.status(400).json({ success: false, error: 'Choose a city from the Plan Trip destination list.' });
    return;
  }
  const cacheKey = city.id.toLowerCase();
  const cached = guideCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    res.setHeader('Cache-Control', 'public, max-age=900');
    res.json({ success: true, data: cached.value, cached: true });
    return;
  }

  try {
    const center = getKnownCityCenter(city.id, city.name) || await geocodeCity(city.name, city.state, cacheKey);
    if (!center) {
      res.status(404).json({ success: false, error: `Could not locate ${city.name} in the local places index.` });
      return;
    }
    const items = await fetchOSMItems(center);
    const take = (kind: OSMItem['kind'], max: number) => items.filter((item) => item.kind === kind)
      .sort((a, b) => (a.lat - center.lat) ** 2 + (a.lng - center.lng) ** 2 - ((b.lat - center.lat) ** 2 + (b.lng - center.lng) ** 2))
      .slice(0, max);
    const guide: GuideResponse = {
      city: city.name,
      state: city.state,
      center,
      restaurants: take('restaurant', 30),
      hotels: items.filter((item) => item.kind === 'hotel' && item.stars !== null && item.stars >= 3 && item.stars <= 5).slice(0, 18),
      temples: take('temple', 20),
      attractions: take('attraction', 30),
      sourceUrl: 'https://www.openstreetmap.org/copyright',
      attribution: 'Local place listings © OpenStreetMap contributors (ODbL). Listings are community mapped and should be confirmed with the venue.',
      retrievedAt: new Date().toISOString(),
      note: 'Restaurant costs, room rates, official opening status and ticket prices are only shown when the map record explicitly contains them. This feed is not an official venue verification or live booking inventory.',
    };
    guideCache.set(cacheKey, { value: guide, expiresAt: Date.now() + CACHE_TTL_MS });
    res.setHeader('Cache-Control', 'public, max-age=900');
    res.json({ success: true, data: guide, cached: false });
  } catch {
    res.status(503).json({ success: false, error: 'Local place listings are temporarily unavailable. Your saved Virasat city guide is still available.' });
  }
});
