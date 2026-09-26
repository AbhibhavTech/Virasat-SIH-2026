import fs from 'fs';
import path from 'path';

export const declaration = {
  name: 'searchHotels',
  description: 'Search accommodations, heritage resorts, and verified hotels across Indian tourist destinations. Filter by city, place proximity, price range, or category.',
  parameters: {
    type: 'OBJECT',
    properties: {
      city: {
        type: 'STRING',
        description: 'City name to find hotels in (e.g., "Jaipur", "Mumbai", "Agra", "Varanasi").',
      },
      place_id: {
        type: 'STRING',
        description: 'Tourist place ID to find nearby accommodations for (e.g., "andhra_pradesh_001", "DEL001").',
      },
      category: {
        type: 'STRING',
        description: 'Hotel category: Heritage Palace, Luxury Resort, Boutique Hotel, Mid-range, Budget.',
      },
      limit: {
        type: 'NUMBER',
        description: 'Max hotels to return (default 5).',
      },
    },
  },
};

let cachedHotels: any[] | null = null;
function getHotels() {
  if (!cachedHotels) {
    const hotelsPath = path.join(process.cwd(), 'data', 'hotels.json');
    if (fs.existsSync(hotelsPath)) {
      try {
        cachedHotels = JSON.parse(fs.readFileSync(hotelsPath, 'utf8'));
      } catch {
        cachedHotels = [];
      }
    } else {
      cachedHotels = [];
    }
  }
  return cachedHotels;
}

function matchesCity(targetCityName: string, targetCityIdOrSlug: string | undefined, queryCity: string): boolean {
  if (!queryCity) return true;
  const q = queryCity.trim().toLowerCase();
  if (!q) return true;

  const targetName = (targetCityName || '').trim().toLowerCase();
  const targetSlug = (targetCityIdOrSlug || '').trim().toLowerCase();

  // 1. Exact match against name or slug/id
  if (targetName === q || targetSlug === q) return true;

  // 2. Normalize hyphens and common punctuation
  const cleanQ = q.replace(/[^a-z0-9]/g, '');
  const cleanTargetName = targetName.replace(/[^a-z0-9]/g, '');
  const cleanTargetSlug = targetSlug.replace(/[^a-z0-9]/g, '');
  if (cleanTargetName === cleanQ || cleanTargetSlug === cleanQ) return true;

  // 3. Known historical/administrative aliases
  const aliases: Record<string, string[]> = {
    'delhi': ['new delhi', 'nct of delhi', 'old delhi'],
    'new delhi': ['delhi', 'nct of delhi', 'old delhi'],
    'mumbai': ['bombay'],
    'bombay': ['mumbai'],
    'kolkata': ['calcutta'],
    'calcutta': ['kolkata'],
    'chennai': ['madras'],
    'madras': ['chennai'],
    'bengaluru': ['bangalore'],
    'bangalore': ['bengaluru'],
    'varanasi': ['banaras', 'kashi'],
    'banaras': ['varanasi', 'kashi'],
    'kashi': ['varanasi', 'banaras'],
    'prayagraj': ['allahabad'],
    'allahabad': ['prayagraj'],
    'puducherry': ['pondicherry'],
    'pondicherry': ['puducherry'],
    'kochi': ['cochin', 'ernakulam'],
    'cochin': ['kochi', 'ernakulam'],
  };

  const qAliases = aliases[q];
  if (qAliases && (qAliases.includes(targetName) || qAliases.includes(targetSlug))) return true;

  const targetAliases = aliases[targetName];
  if (targetAliases && targetAliases.includes(q)) return true;

  // 4. Word boundary match only if query has multiple words or full word token match
  // E.g. "Jaipur City" matches "Jaipur", "New Delhi" matches "Delhi"
  // BUT "Patna" must NEVER match "Visakhapatnam"!
  const wordsTarget = targetName.split(/[\s,/-]+/);
  if (wordsTarget.includes(q)) return true;

  return false;
}

export async function execute(args: {
  city?: string;
  place_id?: string;
  category?: string;
  limit?: number;
}): Promise<any> {
  const rawCity = (args.city || '').trim();
  const cityFilter = rawCity.toLowerCase();
  const placeIdFilter = (args.place_id || '').trim().toLowerCase();
  const catFilter = (args.category || '').trim().toLowerCase();
  const limit = Math.min(Math.max(args.limit || 5, 1), 15);

  const matched: any[] = [];
  const baseHotels = getHotels() || [];

  for (const h of baseHotels) {
    if (cityFilter && !matchesCity(h.city, h.city_id || h.id, cityFilter)) continue;
    if (catFilter && !h.category.toLowerCase().includes(catFilter)) continue;
    if (placeIdFilter && h.nearby_heritage && !h.nearby_heritage.includes(placeIdFilter)) continue;

    matched.push({
      id: h.id,
      name: h.name,
      city: h.city,
      state: h.state,
      category: h.category,
      rating: h.rating,
      price: h.price_indication || '₹3,500 - ₹7,000 / night',
      location: h.location,
      amenities: h.amenities || ['Free Wi-Fi', 'Breakfast Included'],
    });

    if (matched.length >= limit) break;
  }

  // If place proximity didn't fill limit, add other hotels from same city
  if (matched.length < limit && cityFilter) {
    for (const h of baseHotels) {
      if (!matchesCity(h.city, h.city_id || h.id, cityFilter)) continue;
      if (catFilter && !h.category.toLowerCase().includes(catFilter)) continue;
      if (matched.some((m) => m.id === h.id)) continue;

      matched.push({
        id: h.id,
        name: h.name,
        city: h.city,
        state: h.state,
        category: h.category,
        rating: h.rating,
        price: h.price_indication || '₹3,500 - ₹7,000 / night',
        location: h.location,
        amenities: h.amenities || ['Free Wi-Fi', 'Breakfast Included'],
      });
      if (matched.length >= limit) break;
    }
  }

  // Also search place-level hotels if place_id was provided or matched count is low
  if (matched.length < limit) {
    try {
      const dbPath = path.join(process.cwd(), 'data', 'india_tourism_database.json');
      if (fs.existsSync(dbPath)) {
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        for (const s of dbData.states || []) {
          for (const c of s.cities || []) {
            if (cityFilter && !matchesCity(c.name, c.id || c.slug, cityFilter)) continue;
            const places = [
              ...(c.heritage || []),
              ...(c.monuments || []),
              ...(c.museums || []),
              ...(c.tourist_places || []),
              ...(c.religious_cultural || []),
              ...(c.nature_parks_zoo || []),
            ];
            for (const p of places) {
              if (placeIdFilter && p.id.toLowerCase() !== placeIdFilter) continue;
              if (p.hotels && Array.isArray(p.hotels)) {
                for (const ph of p.hotels) {
                  if (matched.some(m => m.name.toLowerCase() === ph.name.toLowerCase())) continue;
                  matched.push({
                    id: ph.id || ph.name,
                    name: ph.name,
                    city: c.name,
                    state: s.name,
                    category: ph.category || 'Hotel',
                    rating: ph.rating || 4.5,
                    price: ph.price_range || 'Indicative Rate: ₹4,000 / night',
                    location: ph.area || c.name,
                    amenities: ph.amenities || ['Heritage Hospitality'],
                  });
                  if (matched.length >= limit) break;
                }
              }
              if (matched.length >= limit) break;
            }
            if (matched.length >= limit) break;
          }
          if (matched.length >= limit) break;
        }
      }
    } catch {
      // Ignore
    }
  }

  return {
    total_found: matched.length,
    hotels: matched.slice(0, limit),
  };
}
