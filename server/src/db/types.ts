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
  google_id?: string;
  home_city: string;
  auth_provider: string;
  role: UserRole;
  preferences?: Record<string, any>;
  survey?: {
    travel_style?: string;
    pace?: string;
    interests?: string[];
    budget?: string;
    companion?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
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

export type VerificationStatus =
  | 'draft'
  | 'pending'
  | 'verified'
  | 'needs_review'
  | 'rejected';

export type EntityType =
  | 'city'
  | 'town'
  | 'district'
  | 'valley'
  | 'island'
  | 'region'
  | 'village';

export type SourceType =
  | 'state_tourism'
  | 'district_administration'
  | 'asi'
  | 'unesco'
  | 'forest_department'
  | 'ministry_of_tourism'
  | 'official_institution'
  | 'google_maps'
  | 'openstreetmap'
  | 'other'
  | 'tier1_official'
  | 'tier2_trusted'
  | 'tier3_secondary'
  | 'tier4_community';

export type SourceQualityTier = 'place_specific' | 'official_site' | 'generic_homepage' | 'missing';

export const OFFICIAL_SITE_ALLOWLIST = [
  'shrikashivishwanath.org',
  'partitionmuseum.org',
  'eternalmewar.in',
  'somnath.org',
];

export function computeSourceQuality(url?: string): SourceQualityTier {
  if (!url || typeof url !== 'string' || !url.trim()) return 'missing';
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (OFFICIAL_SITE_ALLOWLIST.some(allowed => host === allowed || host.endsWith('.' + allowed))) {
      return 'official_site';
    }
    const path = parsed.pathname;
    if (path && path !== '/' && path.length > 1) {
      return 'place_specific';
    }
    return 'generic_homepage';
  } catch {
    return 'missing';
  }
}

export interface CategoryLink {
  topic: string;
  subtopic: string;
}


export interface StateRecord {
  id: string;
  name: string;
  slug?: string;
  type?: 'state' | 'union_territory';
  region_type?: 'state' | 'union_territory';
  capital: string;
  region: string;
  official_tourism_url?: string;
  description: string;
  status?: string;
  hero_image_id?: string;
  hero_image_url?: string;
  hero_image?: ImageProvenance;
  source_url?: string;
  source_name?: string;
  creator?: string | null;
  license?: string;
  created_at: string;
}

export interface CityRecord {
  id: string;
  state_id: string;
  name: string;
  slug?: string;
  entity_type?: EntityType;
  district?: string | null;
  latitude?: number;
  longitude?: number;
  lat: number;
  lng: number;
  short_description?: string;
  description: string;
  tagline?: string;
  official_url?: string;
  status?: string;
  canonical_name?: string;
  state?: string;
  region?: string;
  city_type?: string;
  tourism_categories?: string[];
  prominence?: string;
  is_capital?: boolean;
  capital_status?: string;
  verification_status?: VerificationStatus | string;
  source_provenance?: string;
  hero_image_url?: string;
  hero_image?: ImageProvenance;
  source_url?: string;
  source_name?: string;
  creator?: string | null;
  license?: string;
  places_count?: number;
  created_at: string;
  updated_at?: string;
}

export type ImportanceLevel = 'iconic' | 'major' | 'notable' | 'local' | 'hidden_gem';

export interface MediaRecord {
  id: string;
  place_id: string;
  image_url: string;
  image_source_url?: string;
  photographer?: string;
  license?: string;
  alt_text?: string;
  is_primary?: boolean;
  approval_status?: 'approved' | 'pending' | 'rejected';
  created_at?: string;
}

export interface PlaceRecord {
  id: string;
  city_id?: string;
  state_id?: string;
  district?: string;
  name: string;
  slug?: string;
  canonical_name?: string;
  aliases?: string[];
  place_type?: string;
  category: string;
  categories?: string[];
  subcategories?: string[];
  topic?: string;
  subtopic?: string;
  category_links?: CategoryLink[];
  importance_level?: ImportanceLevel;
  locality_type?: string;
  short_description?: string;
  summary: string;
  detailed_description?: string;
  description: string;
  history: string;
  address?: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  opening_hours?: string;
  visiting_hours: string;
  entry_fee?: string | number;
  entry_fee_domestic: number;
  entry_fee_intl: number;
  best_time_to_visit?: string;
  contact_information?: string;
  official_website?: string;
  heritage_status: string;
  data_confidence: DataConfidence;
  source_url?: string;
  source_name?: string;
  source_type?: SourceType;
  provenance_type?: string;
  verification_status: VerificationStatus;
  source_quality?: SourceQualityTier;
  last_verified_on?: string;
  last_verified_at?: string;
  rating: number;
  thumbnail_url?: string;
  media?: MediaRecord[];
  sources?: PlaceSourceRecord[];
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
  city?: string;
  state?: string;
  days_count?: number;
  pace?: 'relaxed' | 'moderate' | 'fast';
  budget_level?: 'budget' | 'moderate' | 'luxury';
  summary?: string;
  total_cost?: number;
  start_date?: string;
  end_date?: string;
  city_ids?: string[];
  is_public: boolean;
  places_count?: number;
  total_distance_km?: number;
  estimated_budget?: number;
  created_at: string;
  updated_at: string;
}

export interface ItineraryDayRecord {
  id: string;
  itinerary_id: string;
  day_number: number;
  area_title: string;
  theme?: string;
  notes?: string;
  created_at: string;
}

export interface ItineraryStopRecord {
  id: string;
  day_id: string;
  itinerary_id: string;
  place_id?: string;
  place_name: string;
  stop_order: number;
  arrival_time?: string;
  duration_minutes: number;
  travel_mode?: string;
  travel_duration_minutes?: number;
  travel_distance_km?: number;
  estimated_cost?: number;
  notes?: string;
  created_at: string;
}

export interface AISessionRecord {
  id: string;
  user_id?: string;
  title: string;
  context_json?: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessageRecord {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls_json?: string;
  metadata_json?: string;
  created_at: string;
}

export interface AIGroundingRecord {
  id: string;
  message_id: string;
  place_id?: string;
  fact_id?: string;
  field_name: string;
  confidence: string;
  source_name: string;
  source_url: string;
  created_at: string;
}

export interface FavoriteRecord {
  id: string;
  user_id: string;
  place_id: string;
  created_at: string;
}

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface CitizenReportRecord {
  id: string;
  place_id?: string;
  place_name?: string;
  city?: string;
  reported_by: string;
  user_id?: string;
  issue_type: string;
  title?: string;
  description: string;
  severity?: ReportSeverity;
  status: ReportStatus;
  media_url?: string;
  resolution_notes?: string;
  resolved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DestinationHealthRecord {
  place_id: string;
  place_name: string;
  city: string;
  health_score: number;
  open_issues_count: number;
  resolved_issues_count: number;
  status_label: string;
  last_inspected_at: string;
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

export interface PlaceSourceRecord {
  id: string;
  place_id?: string;
  source_name: string;
  source_url: string;
  url?: string; // backwards compatibility
  source_type: SourceType;
  evidence_note?: string;
  accessed_on?: string;
  verification_status?: VerificationStatus | string;
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

