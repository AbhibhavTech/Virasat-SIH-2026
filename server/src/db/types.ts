// =====================================================================
// Database Entity Types
// Aligned with Section XV.1 of the Master Blueprint V2
// =====================================================================

export type DataConfidence =
  | 'official'
  | 'trusted_third_party'
  | 'community_reported'
  | 'modelled'
  | 'estimated'
  | 'stale'
  | 'unverified';

export type UserRole =
  | 'traveller'
  | 'contributor'
  | 'verified_provider'
  | 'moderator'
  | 'heritage_officer'
  | 'admin';

export type TransitType = 'railway' | 'metro' | 'bus' | 'airport';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar_url?: string;
  home_city: string;
  auth_provider: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface StateRecord {
  id: string;
  name: string;
  capital: string;
  region: string;
  description: string;
  hero_image_id?: string;
  created_at: string;
}

export interface CityRecord {
  id: string;
  state_id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  created_at: string;
}

export interface PlaceRecord {
  id: string;
  city_id?: string;
  state_id?: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  history: string;
  lat: number;
  lng: number;
  entry_fee_domestic: number;
  entry_fee_intl: number;
  visiting_hours: string;
  heritage_status: string;
  data_confidence: DataConfidence;
  source_url?: string;
  last_verified_at?: string;
  rating: number;
  thumbnail_url?: string;
  created_at: string;
}

export interface TransitNodeRecord {
  id: string;
  type: TransitType;
  name: string;
  code: string;
  lat: number;
  lng: number;
  city_id?: string;
  is_junction: boolean;
  created_at: string;
}

export interface ItineraryRecord {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date?: string;
  end_date?: string;
  city_ids: string[];
  is_public: boolean;
  places_count?: number;
  total_distance_km?: number;
  estimated_budget?: number;
  created_at: string;
  updated_at: string;
}

export interface FavoriteRecord {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
}

export interface CitizenReportRecord {
  id: string;
  place_id?: string;
  reported_by: string;
  issue_type: string;
  description: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  media_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLogRecord {
  id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  from_value?: any;
  to_value?: any;
  created_at: string;
}

export type SourceType = 'tier1_official' | 'tier2_trusted' | 'tier3_secondary' | 'tier4_community';

export interface PlaceSourceRecord {
  id: string;
  source_name: string;
  source_type: SourceType;
  url: string;
  created_at: string;
}

export interface PlaceFactRecord {
  id: string;
  place_id: string;
  fact_key: string;
  fact_value: string;
  data_confidence: string; // 'OFFICIAL' | 'TRUSTED_THIRD_PARTY' | etc.
  source_url: string;
  source_type: SourceType;
  verified_at: string;
  expires_at?: string;
  created_at: string;
}

export interface ImageLicenseRecord {
  id: string;
  image_url: string;
  license_type: string;
  attribution_required: boolean;
  attribution_text?: string;
  source_portal?: string;
  created_at: string;
}

