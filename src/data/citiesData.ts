import rawCities from '../../data/cities.json';

export interface CityMapItem {
  id: string;
  state_id: string;
  state: string;
  name: string;
  slug?: string;
  district: string;
  lat: number;
  lng: number;
  short_description?: string;
  description: string;
  hero_image_url?: string;
  places_count?: number;
  tagline?: string;
}

export const ALL_CITIES_LIST: CityMapItem[] = (rawCities as any[]).map((c) => ({
  id: c.id,
  state_id: c.state_id || '',
  state: c.state || '',
  name: c.name,
  slug: c.slug || c.id,
  district: c.district || '',
  lat: Number(c.lat),
  lng: Number(c.lng),
  short_description: c.short_description || c.tagline || '',
  description: c.description || '',
  hero_image_url: c.hero_image_url || 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b2?w=800&auto=format&fit=crop&q=80',
  places_count: typeof c.places_count === 'number' ? c.places_count : 0,
  tagline: c.tagline || '',
}));

/**
 * Find nearest city given latitude and longitude coordinates
 */
export function findNearestCity(lat: number, lng: number): { city: CityMapItem; distanceKm: number } {
  let nearest = ALL_CITIES_LIST[0];
  let minDistance = Infinity;

  for (const c of ALL_CITIES_LIST) {
    const d = calculateHaversineKm(lat, lng, c.lat, c.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = c;
    }
  }

  return { city: nearest, distanceKm: Math.round(minDistance) };
}

/**
 * Standard Haversine distance in Kilometers
 */
export function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Search cities by name, state, or district
 */
export function searchCities(query: string): CityMapItem[] {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  return ALL_CITIES_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q)
  );
}
