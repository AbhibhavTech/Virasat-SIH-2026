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
