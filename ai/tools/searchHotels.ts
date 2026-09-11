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

export async function execute(args: {
  city?: string;
  place_id?: string;
  category?: string;
  limit?: number;
}): Promise<any> {
  const cityFilter = (args.city || '').trim().toLowerCase();
  const placeIdFilter = (args.place_id || '').trim().toLowerCase();
  const catFilter = (args.category || '').trim().toLowerCase();
  const limit = Math.min(Math.max(args.limit || 5, 1), 15);

  const matched: any[] = [];
  const baseHotels = getHotels() || [];

  for (const h of baseHotels) {
    if (cityFilter && !h.city.toLowerCase().includes(cityFilter)) continue;
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

  // Also search place-level hotels if place_id was provided or matched count is low
  if (matched.length < limit) {
    try {
      const dbPath = path.join(process.cwd(), 'data', 'india_tourism_database.json');
      if (fs.existsSync(dbPath)) {
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        for (const s of dbData.states || []) {
          for (const c of s.cities || []) {
            if (cityFilter && !c.name.toLowerCase().includes(cityFilter)) continue;
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
