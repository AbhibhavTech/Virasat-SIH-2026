// =========================================================================
// Geolocation & Proximity Calculation Utilities for Virasat Heritage
// =========================================================================

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface HeritageHubPreset {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  region: string;
  iconicMonument: string;
}

/**
 * Standard Haversine distance formula between two geographic points in kilometers
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Human-friendly distance formatting
 */
export function formatDistanceKm(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km away`;
  }
  return `${Math.round(km)} km away`;
}

/**
 * Estimate road driving time based on terrain and distance in India
 */
export function estimateTravelTime(km: number): string {
  if (km < 5) return '~10-15 mins';
  if (km < 15) return '~20-35 mins';
  if (km < 40) return '~45-60 mins';
  if (km < 80) return '~1.5-2 hrs drive';
  if (km < 160) return '~3-4 hrs drive';
  if (km < 300) return '~5-7 hrs journey';
  return `~${Math.round(km / 65)} hrs transit`;
}

/**
 * Calculate the estimated time to visit (in minutes) for a heritage site.
 * Utilizes the database's explicit visit_duration if available, or derives the average
 * traversal time (in minutes) based on the monument's architectural typology, scale,
 * and category (e.g. expansive forts/palaces, UNESCO complexes, museums, or shrines).
 */
export function calculateEstimatedVisitMinutes(place: {
  name?: string;
  category?: string;
  subtopic?: string;
  topic?: string;
  importance_level?: string;
  tags?: string[] | readonly string[];
  visit_duration?: {
    recommended_mins?: number;
    label?: string;
  };
}): number {
  // 1. Direct explicit recommended minutes in database
  if (place.visit_duration?.recommended_mins && place.visit_duration.recommended_mins > 0) {
    return Math.round(place.visit_duration.recommended_mins);
  }

  // 2. Parse label if available (e.g. "1.5 - 2 Hours", "90 mins", "2 Hours")
  if (place.visit_duration?.label) {
    const label = place.visit_duration.label.toLowerCase();
    const hourRangeMatch = label.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*h/);
    if (hourRangeMatch) {
      const avgHours = (parseFloat(hourRangeMatch[1]) + parseFloat(hourRangeMatch[2])) / 2;
      return Math.round(avgHours * 60);
    }
    const singleHourMatch = label.match(/(\d+(?:\.\d+)?)\s*h/);
    if (singleHourMatch) {
      return Math.round(parseFloat(singleHourMatch[1]) * 60);
    }
    const minMatch = label.match(/(\d+)\s*m/);
    if (minMatch) {
      return parseInt(minMatch[1], 10);
    }
  }

  const nameLower = (place.name || '').toLowerCase();
  const subtopicLower = (place.subtopic || '').toLowerCase();
  const topicLower = (place.topic || '').toLowerCase();
  const categoryLower = (place.category || '').toLowerCase();
  const isUnesco =
    place.tags?.some((t) => t.toLowerCase().includes('unesco')) ||
    subtopicLower.includes('unesco') ||
    topicLower.includes('unesco');

  // 3. Typology & architectural scale based traversal calculations:
  // Expansive Forts, Palaces, Ruins & Cave Systems (require extensive walking traversal)
  if (
    /fort|palace|mahal|kila|garh|caves?|ruins|complex|citadel|archaeological/i.test(nameLower) ||
    /fort|palace|caves/i.test(subtopicLower)
  ) {
    return isUnesco || place.importance_level === 'iconic' ? 120 : 90;
  }

  // Museums, Science Centers & Galleries (exhibit traversal)
  if (categoryLower === 'museums' || /museum|gallery|sangrahalaya|exhibition/i.test(nameLower)) {
    return 90;
  }

  // National Parks, Zoos, Sanctuaries & Botanical Gardens
  if (
    categoryLower === 'nature_parks_zoo' ||
    /park|zoo|garden|sanctuary|reserve|lake|falls|forest/i.test(nameLower)
  ) {
    return 120;
  }

  // Spiritual Shrines, Temples, Mosques, Gurdwaras & Monasteries
  if (
    categoryLower === 'religious_cultural' ||
    /temple|mandir|masjid|dargah|gurudwara|church|cathedral|stupa|monastery|ghat/i.test(nameLower)
  ) {
    return isUnesco ? 60 : 45;
  }

  // Memorials, Gates, Clock Towers & Stepwells
  if (/gate|minar|tower|baoli|vav|stambha|memorial|statue/i.test(nameLower)) {
    return 45;
  }

  // UNESCO or Iconic Sites default
  if (isUnesco || place.importance_level === 'iconic') {
    return 90;
  }

  // Standard heritage monument traversal baseline in minutes
  return 60;
}

/**
 * Formats the estimated visit duration in minutes
 */
export function formatEstimatedVisitMinutes(mins: number): string {
  return `${mins} mins to visit`;
}

/**
 * Prominent cultural and geographical heritage hubs across Bharat
 * Used for instant recommendations and fallback when GPS is not active
 */
export const POPULAR_HERITAGE_HUBS: HeritageHubPreset[] = [
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi (NCT)',
    lat: 28.6139,
    lng: 77.209,
    region: 'Northern India',
    iconicMonument: 'Qutub Minar & Red Fort',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 18.922,
    lng: 72.8347,
    region: 'Western India',
    iconicMonument: 'Gateway of India & Elephanta Caves',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    region: 'Western India',
    iconicMonument: 'Amber Fort & Hawa Mahal',
  },
  {
    id: 'agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1751,
    lng: 78.0421,
    region: 'Northern India',
    iconicMonument: 'Taj Mahal & Agra Fort',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    region: 'Southern India',
    iconicMonument: 'Bangalore Palace & Tipu Sultan Fort',
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3176,
    lng: 82.9739,
    region: 'Northern India',
    iconicMonument: 'Kashi Vishwanath & Sarnath',
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    region: 'Eastern India',
    iconicMonument: 'Victoria Memorial & Dakshineswar',
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    region: 'Southern India',
    iconicMonument: 'Kapaleeshwarar & Fort St. George',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.385,
    lng: 78.4867,
    region: 'Southern India',
    iconicMonument: 'Charminar & Golconda Fort',
  },
  {
    id: 'amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    lat: 31.634,
    lng: 74.8723,
    region: 'Northern India',
    iconicMonument: 'Sri Harmandir Sahib (Golden Temple)',
  },
  {
    id: 'kochi',
    name: 'Kochi (Cochin)',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    region: 'Southern India',
    iconicMonument: 'Mattancherry Palace & Fort Kochi',
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    region: 'Western India',
    iconicMonument: 'Sarkhej Roza & Adalaj Stepwell',
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    state: 'Jammu and Kashmir',
    lat: 34.0837,
    lng: 74.7973,
    region: 'Northern India',
    iconicMonument: 'Mughal Gardens & Shankaracharya Temple',
  },
  {
    id: 'bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    lat: 23.2599,
    lng: 77.4126,
    region: 'Central India',
    iconicMonument: 'Sanchi Stupa & Bhimbetka Rock Shelters',
  },
  {
    id: 'panaji',
    name: 'Goa (Panaji & Velha)',
    state: 'Goa',
    lat: 15.4909,
    lng: 73.8278,
    region: 'Western India',
    iconicMonument: 'Basilica of Bom Jesus & Reis Magos',
  },
];

/**
 * Finds the nearest cultural hub to a given coordinate
 */
export function findNearestHeritageHub(lat: number, lng: number): HeritageHubPreset {
  let nearest = POPULAR_HERITAGE_HUBS[0];
  let minDistance = Infinity;

  for (const hub of POPULAR_HERITAGE_HUBS) {
    const dist = haversineDistanceKm(lat, lng, hub.lat, hub.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = hub;
    }
  }

  return nearest;
}
