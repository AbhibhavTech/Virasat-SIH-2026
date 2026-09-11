/**
 * Location Resolver for Virasat AI Assistant
 * Resolves places, cities, railway stations, and monuments against verified registries.
 */

import { ResolvedLocation } from '../types';
import { masterTourismDataService } from '../../server/masterTourismDataService';
import { resolveOriginTransportNode, resolveDestinationTransportNode } from '../../server/transportResolver';
import { isValidIndiaCoordinate } from '../utils/distance';
import { checkLocationAmbiguity } from './ambiguityHandler';

// Common Indian station aliases
const STATION_ALIASES: Record<string, { name: string; code: string; city: string; lat: number; lng: number }> = {
  csmt: { name: 'Chhatrapati Shivaji Maharaj Terminus', code: 'CSMT', city: 'Mumbai', lat: 18.9401, lng: 72.8354 },
  cst: { name: 'Chhatrapati Shivaji Maharaj Terminus', code: 'CSMT', city: 'Mumbai', lat: 18.9401, lng: 72.8354 },
  vt: { name: 'Chhatrapati Shivaji Maharaj Terminus', code: 'CSMT', city: 'Mumbai', lat: 18.9401, lng: 72.8354 },
  churchgate: { name: 'Churchgate Railway Station', code: 'CCG', city: 'Mumbai', lat: 18.9322, lng: 72.8264 },
  dadar: { name: 'Dadar Railway Station', code: 'DDR', city: 'Mumbai', lat: 19.0178, lng: 72.8478 },
  bandra: { name: 'Bandra Terminus', code: 'BDTS', city: 'Mumbai', lat: 19.0607, lng: 72.8407 },
  andheri: { name: 'Andheri Railway Station', code: 'ADH', city: 'Mumbai', lat: 19.1197, lng: 72.8464 },
  ndls: { name: 'New Delhi Railway Station', code: 'NDLS', city: 'Delhi', lat: 28.6425, lng: 77.2201 },
  dli: { name: 'Old Delhi Railway Station', code: 'DLI', city: 'Delhi', lat: 28.6609, lng: 77.2307 },
  hwh: { name: 'Howrah Junction', code: 'HWH', city: 'Kolkata', lat: 22.5857, lng: 88.3426 },
  mas: { name: 'Chennai Central', code: 'MAS', city: 'Chennai', lat: 13.0827, lng: 80.2755 },
  sbc: { name: 'KSR Bengaluru City', code: 'SBC', city: 'Bengaluru', lat: 12.9781, lng: 77.5695 },
  jp: { name: 'Jaipur Junction', code: 'JP', city: 'Jaipur', lat: 26.9208, lng: 75.7878 },
  bsb: { name: 'Varanasi Junction', code: 'BSB', city: 'Varanasi', lat: 25.3277, lng: 82.9863 },
  agc: { name: 'Agra Cantt', code: 'AGC', city: 'Agra', lat: 27.1577, lng: 78.0041 },
};

export function resolveLocation(rawName: string, activeCityHint?: string): ResolvedLocation {
  if (!rawName || typeof rawName !== 'string') {
    return {
      name: 'Unknown',
      entity_type: 'unknown',
      confidence: 0,
      is_verified: false,
    };
  }

  const clean = rawName.trim();
  const lower = clean.toLowerCase();

  // 1. Check known Station Aliases
  if (STATION_ALIASES[lower]) {
    const s = STATION_ALIASES[lower];
    return {
      name: s.name,
      entity_type: 'station',
      city: s.city,
      station_code: s.code,
      coordinates: { lat: s.lat, lng: s.lng },
      confidence: 0.98,
      is_verified: true,
    };
  }

  // 2. Check Ambiguity (e.g. City Palace Jaipur vs Udaipur)
  const ambiguity = checkLocationAmbiguity(clean, activeCityHint);
  if (ambiguity.isAmbiguous) {
    const selected = ambiguity.selectedOption;
    return {
      name: selected.name,
      entity_type: 'poi',
      city: selected.city,
      state: selected.state,
      confidence: 0.85,
      is_verified: true,
      is_ambiguous: true,
      possible_matches: ambiguity.possibleMatches,
    };
  }

  // 3. Check Transport Resolver (origin or destination node)
  const destNode = resolveDestinationTransportNode(clean);
  if (destNode && destNode.destination_name && destNode.destination_name.toLowerCase() !== 'india') {
    const coords = destNode.coordinates;
    const hasValidCoords = coords && isValidIndiaCoordinate(coords.lat, coords.lng);

    return {
      name: destNode.poi_name || destNode.destination_name,
      entity_type: destNode.is_poi ? 'poi' : 'city',
      city: destNode.city,
      state: destNode.state,
      coordinates: hasValidCoords ? coords : undefined,
      station_code: destNode.railway_hub?.status === 'VERIFIED' ? destNode.railway_hub.station_code : undefined,
      confidence: 0.95,
      is_verified: true,
    };
  }

  // 4. Check Master Tourism Data Service Cities
  if (masterTourismDataService && masterTourismDataService.cities) {
    const matchedCity = masterTourismDataService.cities.find(
      (c) => c.name.toLowerCase() === lower || lower.includes(c.name.toLowerCase())
    );
    if (matchedCity) {
      return {
        name: matchedCity.name,
        entity_type: 'city',
        city: matchedCity.name,
        state: matchedCity.state,
        coordinates: isValidIndiaCoordinate(matchedCity.lat, matchedCity.lng)
          ? { lat: matchedCity.lat, lng: matchedCity.lng }
          : undefined,
        confidence: 0.92,
        is_verified: true,
      };
    }
  }

  // 5. Check Master Tourism Data Service Destinations / Monuments
  if (masterTourismDataService && masterTourismDataService.destinations) {
    for (const [id, dest] of masterTourismDataService.destinations.entries()) {
      if (
        id === lower ||
        dest.name.toLowerCase() === lower ||
        dest.name.toLowerCase().includes(lower) ||
        lower.includes(dest.name.toLowerCase())
      ) {
        return {
          name: dest.name,
          entity_type: 'poi',
          city: dest.city,
          state: dest.state,
          coordinates: dest.coordinates && isValidIndiaCoordinate(dest.coordinates.lat, dest.coordinates.lng)
            ? dest.coordinates
            : undefined,
          confidence: 0.9,
          is_verified: true,
        };
      }
    }
  }

  // 6. Check Railway Stations dataset directly
  if (masterTourismDataService && masterTourismDataService.railwayStations) {
    const matchedStation = masterTourismDataService.railwayStations.find(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        lower.includes(s.name.toLowerCase()) ||
        s.code.toLowerCase() === lower
    );
    if (matchedStation) {
      return {
        name: matchedStation.name,
        entity_type: 'station',
        city: matchedStation.city,
        state: matchedStation.state,
        station_code: matchedStation.code,
        coordinates: isValidIndiaCoordinate(matchedStation.lat, matchedStation.lng)
          ? { lat: matchedStation.lat, lng: matchedStation.lng }
          : undefined,
        confidence: 0.9,
        is_verified: true,
      };
    }
  }

  // Unresolved fallback
  return {
    name: clean,
    entity_type: 'unknown',
    confidence: 0.4,
    is_verified: false,
  };
}
