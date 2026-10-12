export type MasterDataCategory =
  | 'states'
  | 'cities'
  | 'destinations'
  | 'heritage'
  | 'attractions'
  | 'railway_stations'
  | 'hotels'
  | 'maps_coordinates'
  | 'routes'
  | 'images'
  | 'visiting_details';

export interface DatabaseCategoryMeta {
  key: MasterDataCategory;
  label: string;
  description: string;
  count: number;
  iconName: string;
  primaryKey: string;
  schemaFields: string[];
  isReady: boolean;
}

export interface CategoryStatusDetail {
  count: number;
  label: string;
  description: string;
  ready: boolean;
  fields: string[];
}

export interface DatabaseStatusResponse {
  status: 'connected' | 'ready' | 'synced';
  schema_version: string;
  engine: string;
  database_ready: boolean;
  storage_mode: string;
  total_records: number;
  last_synced: string;
  categories: Record<MasterDataCategory, CategoryStatusDetail>;
  supported_operations: string[];
}

export interface DatabaseRecordQueryOptions {
  category: MasterDataCategory;
  search?: string;
  city?: string;
  state?: string;
  limit?: number;
  offset?: number;
  tags?: string[];
}

export interface DatabaseRecordsResponse {
  category: MasterDataCategory;
  label: string;
  total: number;
  limit: number;
  offset: number;
  records: any[];
}

export interface DatabaseSyncPayload {
  category?: MasterDataCategory;
  records?: any[];
  full_database?: Partial<Record<MasterDataCategory, any[]>>;
  source_name?: string;
  dry_run?: boolean;
}

export interface DatabaseSyncResult {
  success: boolean;
  message: string;
  synced_categories: string[];
  inserted_or_updated: number;
  dry_run: boolean;
  timestamp: string;
}

export interface EntityImageMetadata {
  image_url: string;
  thumbnail_url: string;
  source_page?: string;
  source?: string;
  license?: string;
  creator?: string;
  attribution?: string;
  status?: 'verified' | 'candidate' | 'missing';
  last_checked?: string;
}

export interface ImageRecordMeta {
  id: string;
  url: string;
  image_url?: string;
  thumbnail_url?: string;
  entity_id: string;
  entity_type: 'state' | 'city' | 'destination' | 'heritage' | 'monument' | 'museum' | 'attraction' | 'railway_station' | 'hotel';
  entity_name: string;
  category: string;
  caption: string;
  is_hero: boolean;
  source_page?: string;
  source?: string;
  license?: string;
  creator?: string;
  attribution?: string;
  credit_attribution?: string;
}

/**
 * Virasat Mumbai & Maharashtra Heritage Explorer Image Data Model (Phase 9 Image Pipeline Add-on)
 */
export type ImageMatchStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'PLACEHOLDER';

export interface PlaceImageItem {
  image_url: string | null;
  thumbnail_url: string | null;
  source_page_url: string | null;
  source_name: string | null;
  author: string | null;
  license: string | null;
  attribution_text: string | null;
  alt_text: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  content_hash: string | null;
  depicts_place_id: string;
  match_status: ImageMatchStatus;
  verified_at: string | null;
  is_hero?: boolean;
  order_index?: number;
}

export interface PlaceImageBundle {
  place_id: string;
  place_name: string;
  city: string;
  state: string;
  category?: string;
  is_sensitive?: boolean;
  sensitivity_note?: string | null;
  hero_image: PlaceImageItem | null;
  gallery_images: PlaceImageItem[];
}

