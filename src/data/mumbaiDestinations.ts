import { PlaceDetail, PlaceSummary } from '../types';
import { MUMBAI_ATTRACTIONS, MumbaiAttraction } from './mumbaiMasterData';
import { HiddenGemItem, VERIFIED_HIDDEN_GEMS } from './hiddenGemsData';

export interface MumbaiDestination extends PlaceDetail {
  area?: string;
  best_for?: string[];
  suggested_duration?: string;
  entry_fee_label?: string;
  visitor_notes?: string;
  source_name?: string;
  verification_status?: string;
  is_hidden_gem_candidate?: boolean;
  coordinates_verified: boolean;
}

function hasValidCoordinates(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function toAttractionDestination(attraction: MumbaiAttraction): MumbaiDestination {
  const coordinatesVerified = attraction.verification_status.toLowerCase() === 'verified'
    && hasValidCoordinates(attraction.lat, attraction.lng);
  const durationHours = Number.parseFloat(attraction.suggested_duration);

  return {
    id: attraction.id,
    name: attraction.name,
    city: attraction.city,
    state: attraction.state,
    country: attraction.country,
    category: attraction.category,
    summary: attraction.description,
    description: attraction.description,
    history: attraction.description,
    coordinates: { lat: attraction.lat, lng: attraction.lng },
    rating: attraction.rating,
    thumbnail_url: attraction.thumbnail_url,
    image_url: attraction.image_url,
    images: attraction.images,
    tags: [...attraction.tags, ...attraction.best_for],
    features: attraction.features,
    heritage_status: attraction.heritage_status,
    data_confidence: attraction.data_confidence,
    source_url: attraction.source_url,
    source_name: attraction.source_name,
    area: attraction.area,
    area_neighborhood: attraction.area,
    best_for: attraction.best_for,
    best_time_to_visit: attraction.best_time_to_visit,
    suggested_duration: attraction.suggested_duration,
    entry_fee_label: attraction.entry_fee,
    visiting_hours: attraction.opening_hours,
    visitor_notes: attraction.visitor_notes,
    verification_status: attraction.verification_status,
    coordinates_verified: coordinatesVerified,
    visiting_info: {
      ideal_duration_hours: Number.isFinite(durationHours) ? durationHours : undefined,
    },
  };
}

function toHiddenGemDestination(gem: HiddenGemItem): MumbaiDestination {
  const coordinatesVerified = hasValidCoordinates(gem.lat, gem.lng);

  return {
    id: gem.id,
    name: gem.name,
    city: gem.city,
    state: gem.state,
    country: 'India',
    category: gem.category,
    summary: gem.whyInteresting,
    description: gem.whyInteresting,
    coordinates: { lat: gem.lat, lng: gem.lng },
    thumbnail_url: gem.thumbnailUrl,
    image_url: gem.thumbnailUrl,
    images: [gem.thumbnailUrl],
    tags: [...gem.tags, 'hidden gem candidate'],
    features: { map: coordinatesVerified, navigation: coordinatesVerified, ai: true, '3d': false },
    heritage_status: 'Hidden Gem Candidate',
    data_confidence: 'UNVERIFIED',
    area: gem.city,
    area_neighborhood: gem.city,
    best_time_to_visit: gem.bestTimeToVisit,
    entry_fee_label: 'Not listed; check locally before visiting',
    visiting_hours: 'Not listed; check locally before visiting',
    visitor_notes: gem.accessTips,
    is_hidden_gem_candidate: true,
    coordinates_verified: coordinatesVerified,
  };
}

const MUMBAI_GEMS = VERIFIED_HIDDEN_GEMS.filter(
  (gem) => gem.city.trim().toLowerCase() === 'mumbai'
);

export function isMumbaiCity(city?: string | null): boolean {
  const normalized = (city || '').trim().toLowerCase();
  return normalized === 'mumbai' || normalized === 'bombay';
}

export function getMumbaiVerifiedAttractions(): MumbaiDestination[] {
  return MUMBAI_ATTRACTIONS
    .filter((attraction) =>
      attraction.verification_status.toLowerCase() === 'verified'
      && hasValidCoordinates(attraction.lat, attraction.lng)
    )
    .map(toAttractionDestination);
}

export function getMumbaiPlaceSummaries(): MumbaiDestination[] {
  return [
    ...MUMBAI_ATTRACTIONS.map(toAttractionDestination),
    ...MUMBAI_GEMS.map(toHiddenGemDestination),
  ];
}

export function getMumbaiDestinationById(id: string): MumbaiDestination | undefined {
  const normalizedId = (id || '').toLowerCase().trim();
  const attraction = MUMBAI_ATTRACTIONS.find((item) => item.id.toLowerCase() === normalizedId);
  if (attraction) return toAttractionDestination(attraction);

  const gem = MUMBAI_GEMS.find((item) => item.id.toLowerCase() === normalizedId);
  return gem ? toHiddenGemDestination(gem) : undefined;
}

export function getMumbaiDestinationByName(name: string): MumbaiDestination | undefined {
  const normalizedName = (name || '').trim().toLowerCase();
  if (!normalizedName) return undefined;
  const attraction = MUMBAI_ATTRACTIONS.find((item) => item.name.toLowerCase() === normalizedName);
  if (attraction) return toAttractionDestination(attraction);
  const gem = MUMBAI_GEMS.find((item) => item.name.toLowerCase() === normalizedName);
  return gem ? toHiddenGemDestination(gem) : undefined;
}

export function searchMumbaiPlaces(query: string): MumbaiDestination[] {
  const normalizedQuery = (query || '').trim().toLowerCase();
  const destinations = getMumbaiPlaceSummaries();
  if (!normalizedQuery) return destinations;

  const tokens = normalizedQuery
    .split(/[^a-z0-9]+/i)
    .filter((token) => token && !['in', 'at', 'the', 'and', 'for', 'to', 'explore', 'visit', 'places', 'attractions'].includes(token))
    .map((token) => token.endsWith('s') ? token.slice(0, -1) : token);
  const isCityQuery = tokens.length === 0 || tokens.every((token) => ['mumbai', 'bombay'].includes(token));
  if (isCityQuery) return destinations;

  const searchable = (destination: MumbaiDestination) => [
    destination.name,
    destination.city,
    destination.state,
    destination.area,
    destination.category,
    destination.summary,
    ...(destination.tags || []),
    ...(destination.best_for || []),
    destination.is_hidden_gem_candidate ? 'hidden gem candidate' : '',
  ].join(' ').toLowerCase();

  return destinations.filter((destination) => {
    const text = searchable(destination);
    return tokens.every((token) => text.includes(token));
  });
}

export function toPlaceSummary(destination: MumbaiDestination): PlaceSummary {
  return {
    id: destination.id,
    name: destination.name,
    city: destination.city,
    state: destination.state,
    category: destination.category,
    summary: destination.summary,
    coordinates: destination.coordinates,
    rating: destination.rating,
    thumbnail_url: destination.thumbnail_url,
    image_url: destination.image_url,
    tags: destination.tags,
    features: destination.features,
    heritage_status: destination.heritage_status,
    data_confidence: destination.data_confidence,
    source_url: destination.source_url,
    area_neighborhood: destination.area_neighborhood,
  };
}
