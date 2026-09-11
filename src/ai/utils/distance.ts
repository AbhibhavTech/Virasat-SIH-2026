/**
 * Geographic and distance calculation utilities for Virasat AI Assistant
 */

export interface LatLng {
  lat: number;
  lng: number;
}

// India bounding box (approx): Lat 6.5°N - 37.5°N, Lng 68.0°E - 97.5°E
export function isValidIndiaCoordinate(lat: number, lng: number): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return false;
  }
  // Discard (0,0) or reversed/null coordinates
  if (Math.abs(lat) < 0.001 && Math.abs(lng) < 0.001) {
    return false;
  }
  return lat >= 6.5 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
}

/**
 * Calculate Great-Circle distance in kilometers using the Haversine formula
 */
export function haversineDistanceKm(p1: LatLng, p2: LatLng): number {
  if (!p1 || !p2) return 0;
  const R = 6371; // Earth's radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

/**
 * Estimate road distance from direct distance (detour factor ~ 1.25x - 1.4x)
 */
export function estimateRoadDistanceKm(directKm: number): number {
  if (directKm <= 0) return 0;
  if (directKm < 5) return Math.round(directKm * 1.35 * 10) / 10;
  if (directKm < 50) return Math.round(directKm * 1.3 * 10) / 10;
  return Math.round(directKm * 1.25 * 10) / 10;
}

/**
 * Format duration string from minutes
 */
export function formatDurationMinutes(minutes: number): string {
  if (minutes < 1) return '1 min';
  if (minutes < 60) return `${Math.round(minutes)} mins`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = Math.round(minutes % 60);
  if (remainingMins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
}

/**
 * Estimate transit duration per travel mode
 */
export function estimateTravelTime(
  roadKm: number,
  mode: 'walking' | 'auto' | 'taxi' | 'bus' | 'suburban_train' | 'express_train' | 'metro' | 'flight'
): { minutes: number; formatted: string } {
  let minutes = 0;
  switch (mode) {
    case 'walking':
      minutes = (roadKm / 4.5) * 60;
      break;
    case 'auto':
      minutes = (roadKm / 22) * 60 + 5; // city traffic + boarding
      break;
    case 'taxi':
      if (roadKm <= 35) {
        minutes = (roadKm / 25) * 60 + 5;
      } else {
        minutes = (35 / 25) * 60 + ((roadKm - 35) / 65) * 60 + 10;
      }
      break;
    case 'bus':
      minutes = (roadKm / 18) * 60 + 15; // stops & wait
      break;
    case 'metro':
      minutes = (roadKm / 32) * 60 + 8; // wait & platform
      break;
    case 'suburban_train':
      minutes = (roadKm / 35) * 60 + 10;
      break;
    case 'express_train':
      minutes = (roadKm / 60) * 60 + 30; // buffer + speed
      break;
    case 'flight':
      minutes = (roadKm / 700) * 60 + 150; // airport buffer 2.5 hrs + gate
      break;
    default:
      minutes = (roadKm / 30) * 60;
  }

  return {
    minutes: Math.round(minutes),
    formatted: formatDurationMinutes(minutes),
  };
}
