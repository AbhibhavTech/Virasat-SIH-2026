export type AccuracyStatus = 'VERIFIED' | 'UNVERIFIED';

export type AttractionCategory =
  | 'heritage'
  | 'monuments'
  | 'museums'
  | 'tourist_places'
  | 'religious_cultural'
  | 'nature_parks_zoo';

export interface EntryFeeInfo {
  domestic: number;
  international: number;
  currency: string;
  student_discount?: boolean;
  camera_fee?: number;
  free_entry?: boolean;
  status: AccuracyStatus;
  note?: string;
}

export interface TimingsInfo {
  opening_time: string;
  closing_time: string;
  closed_days: string[] | readonly string[];
  status: AccuracyStatus;
  note?: string;
}

export interface VisitDurationInfo {
  recommended_mins: number;
  label: string;
  status: AccuracyStatus;
}

export interface AttractionEntity {
  id: string;
  name: string;
  slug?: string;
  canonical_name?: string;
  aliases?: string[] | readonly string[];
  city_id?: string;
  state_id?: string;
  district?: string;
  place_type?: string;
  category: AttractionCategory | string;
  category_label: string;
  categories?: string[] | readonly string[];
  subcategories?: string[] | readonly string[];
  topic?: string;
  subtopic?: string;
  category_links?: Array<{ topic: string; subtopic: string }>;
  importance_level?: 'iconic' | 'major' | 'notable' | 'local' | 'hidden_gem' | string;
  summary: string;
  short_description?: string;
  detailed_description?: string;
  historical_significance?: string;
  address?: string;
  fees: EntryFeeInfo;
  entry_fee?: string | number;
  timings: TimingsInfo;
  opening_hours?: string;
  best_time_to_visit?: string;
  contact_information?: string;
  official_website?: string;
  visit_duration: VisitDurationInfo;
  coordinates: { lat: number; lng: number };
  image_url: string;
  thumbnail_url: string;
  attribution: string;
  source_page?: string;
  source_url?: string;
  source_name?: string;
  source_type?: string;
  provenance_type?: string;
  status: AccuracyStatus;
  verification_status?: 'draft' | 'pending' | 'verified' | 'needs_review' | 'rejected' | string;
  source_quality?: 'place_specific' | 'official_site' | 'generic_homepage' | 'missing';
  last_verified_on?: string;
  verification_note?: string;
  sources?: Array<{
    id?: string;
    source_name: string;
    source_url: string;
    source_type?: string;
    evidence_note?: string;
    accessed_on?: string;
    verification_status?: string;
  }>;
  features?: {
    map?: boolean;
    navigation?: boolean;
    ai?: boolean;
    '3d'?: boolean;
  };
  tags?: string[] | readonly string[];
}

export interface RailwayStationEntity {
  id: string;
  name: string;
  code: string;
  lines?: string[] | readonly string[];
  is_junction?: boolean;
  distance_km?: number;
  status: AccuracyStatus;
}

export interface AirportEntity {
  id: string;
  name: string;
  code: string;
  type: string;
  distance_km?: number;
  status: AccuracyStatus;
}

export interface LocalTransitInfo {
  modes: string[] | readonly string[];
  fare_indication: string;
  status: AccuracyStatus;
  tips?: string;
}

export interface TransportInfo {
  railway_stations: RailwayStationEntity[];
  airport?: AirportEntity;
  local_transit: LocalTransitInfo;
}

export interface HotelEntity {
  id: string;
  name: string;
  category: string;
  rating: number;
  price_indication: string;
  location: string;
  amenities: string[] | readonly string[];
  image_url: string;
  status: AccuracyStatus;
  source_note?: string;
}

export interface ImageProvenance {
  image_url: string;
  source_url: string;
  source_name: string;
  creator?: string | null;
  license: string;
  verification_status: 'verified' | 'unverified' | 'unavailable';
  verified_at?: string;
  research_note?: string;
}

export interface CityHierarchyEntity {
  id: string;
  name: string;
  slug?: string;
  canonical_name?: string;
  entity_type?: 'city' | 'town' | 'district' | 'valley' | 'island' | 'region' | 'village' | string;
  district: string;
  state: string;
  state_id: string;
  region?: string;
  city_type?: string;
  tagline: string;
  short_description?: string;
  description: string;
  official_url?: string;
  status?: string;
  hero_image_url: string;
  hero_image?: ImageProvenance;
  source_url?: string;
  source_name?: string;
  creator?: string | null;
  license?: string;
  coordinates: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  places_count?: number;
  tourism_categories?: string[];
  prominence?: string;
  is_capital?: boolean;
  capital_status?: string;
  verification_status?: string;
  source_provenance?: string;
  aliases?: string[] | readonly string[];
  administrative_status?: string;
  review_flag?: string;
  created_at?: string;
  updated_at?: string;
  heritage: AttractionEntity[];
  monuments: AttractionEntity[];
  museums: AttractionEntity[];
  tourist_places: AttractionEntity[];
  religious_cultural: AttractionEntity[];
  nature_parks_zoo: AttractionEntity[];
  transport: TransportInfo;
  hotels: HotelEntity[];
  fees_overview: {
    typical_budget_per_day: string;
    status: AccuracyStatus;
    note?: string;
  };
  live_travel_info: {
    best_season: string;
    weather_summary: string;
    status: AccuracyStatus;
    advisory?: string;
  };
  active_stories?: string[] | readonly string[];
}

export interface StateHierarchyEntity {
  id: string;
  name: string;
  slug?: string;
  type?: 'state' | 'union_territory';
  code: string;
  capital: string;
  region: string;
  region_type: 'state' | 'union_territory';
  official_tourism_url?: string;
  description?: string;
  status?: string;
  hero_image_url: string;
  hero_image?: ImageProvenance;
  source_url?: string;
  source_name?: string;
  creator?: string | null;
  license?: string;
  verification_status?: string;
  total_cities: number;
  total_attractions: number;
  heritage_overview: string;
  active_stories?: string[] | readonly string[];
  cities: CityHierarchyEntity[];
}

export interface IndiaHierarchyDatabase {
  title: string;
  version: string;
  states_count: number;
  cities_count: number;
  attractions_count: number;
  accuracy_disclaimer: string;
  states: StateHierarchyEntity[];
}
