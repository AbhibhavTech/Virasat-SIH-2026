import fs from 'fs';
import path from 'path';
import { Pool, PoolClient } from 'pg';
import {
  UserRecord,
  StateRecord,
  CityRecord,
  PlaceRecord,
  SourceQualityTier,
  computeSourceQuality,
  TransitNodeRecord,
  ItineraryRecord,
  FavoriteRecord,
  CitizenReportRecord,
  DestinationHealthRecord,
  AuditLogRecord,
  PlaceSourceRecord,
  PlaceFactRecord,
  ImageLicenseRecord,
  ItineraryDayRecord,
  ItineraryStopRecord,
  AISessionRecord,
  AIMessageRecord,
  AIGroundingRecord,
} from './types';
import { runDatabaseSeed } from './seed';

interface DatabaseData {
  users: Record<string, UserRecord>;
  states: Record<string, StateRecord>;
  cities: Record<string, CityRecord>;
  places: Record<string, PlaceRecord>;
  transit_nodes: Record<string, TransitNodeRecord>;
  itineraries: Record<string, ItineraryRecord>;
  favorites: Record<string, FavoriteRecord>;
  reports: Record<string, CitizenReportRecord>;
  audit_logs: Record<string, AuditLogRecord>;
  place_sources: Record<string, PlaceSourceRecord>;
  place_facts: Record<string, PlaceFactRecord>;
  image_licenses: Record<string, ImageLicenseRecord>;
  itinerary_days: Record<string, ItineraryDayRecord>;
  itinerary_stops: Record<string, ItineraryStopRecord>;
  ai_sessions: Record<string, AISessionRecord>;
  ai_messages: Record<string, AIMessageRecord>;
  ai_groundings: Record<string, AIGroundingRecord>;
}

export type DatabaseMode = 'postgresql' | 'json';

export interface DatabaseHealthStatus {
  status: 'ok' | 'degraded' | 'error';
  mode: DatabaseMode;
  database: string;
  latencyMs?: number;
  error?: string;
  total_places?: number;
}

class DatabaseManager {
  private mode: DatabaseMode = 'json';
  private pool: Pool | null = null;
  private dataDir: string;
  private dbFilePath: string;
  private data: DatabaseData;
  private isInitialized = false;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data', '.database');
    this.dbFilePath = path.join(this.dataDir, 'virasat_store.json');
    this.data = {
      users: {},
      states: {},
      cities: {},
      places: {},
      transit_nodes: {},
      itineraries: {},
      favorites: {},
      reports: {},
      audit_logs: {},
      place_sources: {},
      place_facts: {},
      image_licenses: {},
      itinerary_days: {},
      itinerary_stops: {},
      ai_sessions: {},
      ai_messages: {},
      ai_groundings: {},
    };
  }

  // -------------------------------------------------------------
  // INITIALIZATION & LIFECYCLE
  // -------------------------------------------------------------
  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const rawDbUrl = process.env.DATABASE_URL?.trim();

    if (rawDbUrl) {
      try {
        const isRemoteOrSupabase =
          rawDbUrl.includes('supabase') ||
          rawDbUrl.includes('pooler') ||
          rawDbUrl.includes('aws') ||
          process.env.NODE_ENV === 'production';

        this.pool = new Pool({
          connectionString: rawDbUrl,
          ssl: isRemoteOrSupabase ? { rejectUnauthorized: false } : undefined,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });

        // Test probe query without printing connection string or credentials
        const client = await this.pool.connect();
        try {
          await client.query('SELECT 1');
        } finally {
          client.release();
        }

        this.mode = 'postgresql';
        this.isInitialized = true;
        console.log('[DB] Database mode: PostgreSQL');
        return;
      } catch (err: any) {
        console.error('[DB] PostgreSQL connection check failed:', err?.message || 'Unknown error');
        console.warn('[DB] Reverting to local JSON store fallback.');
        if (this.pool) {
          try {
            await this.pool.end();
          } catch {}
          this.pool = null;
        }
      }
    }

    // Fallback: Local JSON File Store
    this.mode = 'json';
    console.log('[DB] Database mode: JSON fallback');
    await this.initJsonStore();
    this.isInitialized = true;
  }

  private async initJsonStore(): Promise<void> {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (fs.existsSync(this.dbFilePath)) {
      try {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || {},
          states: parsed.states || {},
          cities: parsed.cities || {},
          places: parsed.places || {},
          transit_nodes: parsed.transit_nodes || {},
          itineraries: parsed.itineraries || {},
          favorites: parsed.favorites || {},
          reports: parsed.reports || {},
          audit_logs: parsed.audit_logs || {},
          place_sources: parsed.place_sources || {},
          place_facts: parsed.place_facts || {},
          image_licenses: parsed.image_licenses || {},
          itinerary_days: parsed.itinerary_days || {},
          itinerary_stops: parsed.itinerary_stops || {},
          ai_sessions: parsed.ai_sessions || {},
          ai_messages: parsed.ai_messages || {},
          ai_groundings: parsed.ai_groundings || {},
        };
      } catch (err) {
        console.error('[DB] Failed to load local database, initializing fresh store:', err);
      }
    }

    // If fresh / empty or missing place_facts from Phase 2, auto-seed
    if (Object.keys(this.data.places).length === 0 || Object.keys(this.data.place_facts).length === 0) {
      await this.seedFromStaticFiles();
    }
  }

  private persist(): void {
    if (this.mode === 'postgresql') return;
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      const tmpPath = `${this.dbFilePath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, this.dbFilePath);
    } catch (err) {
      console.error('[DB] Error writing to persistent storage:', err);
    }
  }

  public async seedFromStaticFiles(): Promise<void> {
    const seeded = await runDatabaseSeed();
    this.data.states = seeded.states;
    this.data.cities = seeded.cities;
    this.data.places = seeded.places;
    this.data.transit_nodes = seeded.transit_nodes;
    this.data.place_sources = seeded.place_sources;
    this.data.place_facts = seeded.place_facts;
    this.data.image_licenses = seeded.image_licenses;
    if (Object.keys(this.data.users).length === 0) {
      this.data.users = seeded.users;
    }
    this.persist();
  }

  // -------------------------------------------------------------
  // HEALTH & MODE PROBES
  // -------------------------------------------------------------
  public getMode(): DatabaseMode {
    return this.mode;
  }

  public async checkHealth(): Promise<DatabaseHealthStatus> {
    if (this.mode === 'postgresql' && this.pool) {
      const start = Date.now();
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query('SELECT COUNT(*) AS count FROM places');
          const latencyMs = Date.now() - start;
          const totalPlaces = parseInt(res.rows[0]?.count || '0', 10);
          return {
            status: 'ok',
            mode: 'postgresql',
            database: 'Supabase PostgreSQL (Connected)',
            latencyMs,
            total_places: totalPlaces,
          };
        } finally {
          client.release();
        }
      } catch (err: any) {
        return {
          status: 'error',
          mode: 'postgresql',
          database: 'Supabase PostgreSQL (Query Failed)',
          error: err?.message || 'Database ping error',
        };
      }
    }

    return {
      status: 'ok',
      mode: 'json',
      database: 'Local JSON File Store',
      total_places: Object.keys(this.data.places).length,
    };
  }

  // -------------------------------------------------------------
  // SQL QUERY EXECUTION HELPER
  // -------------------------------------------------------------
  private async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.pool) {
      throw new Error('[DB] PostgreSQL pool is not initialized');
    }
    const res = await this.pool.query(sql, params);
    return res.rows;
  }

  // -------------------------------------------------------------
  // ROW MAPPERS (PostgreSQL Rows -> TypeScript Records)
  // -------------------------------------------------------------
  private mapUser(row: any): UserRecord {
    return {
      id: row.id,
      email: row.email,
      password_hash: row.password_hash || '',
      name: row.name,
      avatar_url: row.avatar_url || undefined,
      google_id: row.google_id || undefined,
      home_city: row.home_city || 'Mumbai',
      auth_provider: row.auth_provider || 'local',
      role: row.role || 'traveller',
      preferences: typeof row.preferences === 'string' ? JSON.parse(row.preferences) : row.preferences || {},
      survey: typeof row.survey === 'string' ? JSON.parse(row.survey) : row.survey || {},
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || new Date().toISOString()),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at || new Date().toISOString()),
    };
  }

  private mapState(row: any): StateRecord {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug || row.id,
      type: row.type || 'state',
      region_type: row.region_type || 'state',
      capital: row.capital || '',
      region: row.region || '',
      official_tourism_url: row.official_tourism_url || '',
      description: row.description || '',
      status: row.status || 'verified',
      hero_image_id: row.hero_image_id || undefined,
      hero_image_url: row.hero_image_url || undefined,
      hero_image: typeof row.hero_image === 'string' ? JSON.parse(row.hero_image) : row.hero_image || undefined,
      source_url: row.source_url || undefined,
      source_name: row.source_name || undefined,
      creator: row.creator || null,
      license: row.license || undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || new Date().toISOString()),
    };
  }

  private mapCity(row: any): CityRecord {
    return {
      id: row.id,
      state_id: row.state_id,
      name: row.name,
      slug: row.slug || row.id,
      canonical_name: row.canonical_name || row.name,
      entity_type: row.entity_type || 'city',
      district: row.district || null,
      lat: Number(row.lat) || 0,
      lng: Number(row.lng) || 0,
      latitude: Number(row.lat) || 0,
      longitude: Number(row.lng) || 0,
      short_description: row.short_description || row.description || '',
      description: row.description || '',
      tagline: row.tagline || '',
      official_url: row.official_url || '',
      status: row.status || 'verified',
      state: row.state || '',
      region: row.region || '',
      city_type: row.city_type || 'city',
      tourism_categories: typeof row.tourism_categories === 'string' ? JSON.parse(row.tourism_categories) : row.tourism_categories || [],
      prominence: row.prominence || '',
      is_capital: Boolean(row.is_capital),
      capital_status: row.capital_status || '',
      verification_status: row.verification_status || 'verified',
      source_provenance: row.source_provenance || '',
      hero_image_url: row.hero_image_url || '',
      hero_image: typeof row.hero_image === 'string' ? JSON.parse(row.hero_image) : row.hero_image || undefined,
      source_url: row.source_url || '',
      source_name: row.source_name || '',
      creator: row.creator || null,
      license: row.license || '',
      places_count: Number(row.places_count) || 0,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || new Date().toISOString()),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at || new Date().toISOString()),
    };
  }

  private mapPlace(row: any): PlaceRecord {
    return {
      id: row.id,
      city_id: row.city_id || undefined,
      state_id: row.state_id || undefined,
      district: row.district || undefined,
      name: row.name,
      slug: row.slug || row.id,
      canonical_name: row.canonical_name || row.name,
      aliases: typeof row.aliases === 'string' ? JSON.parse(row.aliases) : row.aliases || [],
      place_type: row.place_type || undefined,
      category: row.category,
      categories: typeof row.categories === 'string' ? JSON.parse(row.categories) : row.categories || [],
      subcategories: typeof row.subcategories === 'string' ? JSON.parse(row.subcategories) : row.subcategories || [],
      topic: row.topic || undefined,
      subtopic: row.subtopic || undefined,
      category_links: typeof row.category_links === 'string' ? JSON.parse(row.category_links) : row.category_links || [],
      importance_level: row.importance_level || undefined,
      locality_type: row.locality_type || undefined,
      short_description: row.short_description || undefined,
      summary: row.summary || row.description || '',
      detailed_description: row.detailed_description || undefined,
      description: row.description || row.summary || '',
      history: row.history || '',
      address: row.address || undefined,
      area: row.area || undefined,
      best_for: row.best_for || undefined,
      suggested_duration: row.suggested_duration || undefined,
      visitor_notes: row.visitor_notes || undefined,
      map_search: row.map_search || undefined,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [],
      lat: Number(row.lat) || 0,
      lng: Number(row.lng) || 0,
      latitude: Number(row.latitude ?? row.lat) || 0,
      longitude: Number(row.longitude ?? row.lng) || 0,
      opening_hours: row.opening_hours || undefined,
      visiting_hours: row.visiting_hours || 'Sunrise to Sunset',
      entry_fee: row.entry_fee || undefined,
      entry_fee_domestic: Number(row.entry_fee_domestic) || 0,
      entry_fee_intl: Number(row.entry_fee_intl) || 0,
      best_time_to_visit: row.best_time_to_visit || undefined,
      contact_information: row.contact_information || undefined,
      official_website: row.official_website || undefined,
      heritage_status: row.heritage_status || 'verified',
      data_confidence: row.data_confidence || 'unverified',
      source_url: row.source_url || undefined,
      source_name: row.source_name || undefined,
      source_type: row.source_type || undefined,
      provenance_type: row.provenance_type || undefined,
      verification_status: row.verification_status || 'unverified',
      source_quality: row.source_quality || undefined,
      last_verified_on: row.last_verified_on || undefined,
      last_verified_at: row.last_verified_at instanceof Date ? row.last_verified_at.toISOString() : (row.last_verified_at || undefined),
      rating: Number(row.rating) || 4.5,
      thumbnail_url: row.thumbnail_url || undefined,
      sources: typeof row.sources === 'string' ? JSON.parse(row.sources) : row.sources || [],
      media: typeof row.media === 'string' ? JSON.parse(row.media) : row.media || [],
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || new Date().toISOString()),
    };
  }

  private mapTransitNode(row: any): TransitNodeRecord {
    return {
      id: row.id,
      type: row.type,
      name: row.name,
      code: row.code,
      lat: Number(row.lat),
      lng: Number(row.lng),
      city_id: row.city_id || undefined,
      is_junction: Boolean(row.is_junction),
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapPlaceSource(row: any): PlaceSourceRecord {
    return {
      id: row.id,
      source_name: row.source_name,
      source_type: row.source_type,
      source_url: row.url,
      url: row.url,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapPlaceFact(row: any): PlaceFactRecord {
    return {
      id: row.id,
      place_id: row.place_id,
      fact_key: row.fact_key,
      fact_value: row.fact_value,
      data_confidence: row.data_confidence,
      source_url: row.source_url,
      source_type: row.source_type,
      verified_at: row.verified_at instanceof Date ? row.verified_at.toISOString() : String(row.verified_at),
      expires_at: row.expires_at ? (row.expires_at instanceof Date ? row.expires_at.toISOString() : String(row.expires_at)) : undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapImageLicense(row: any): ImageLicenseRecord {
    return {
      id: row.id,
      image_url: row.image_url,
      license_type: row.license_type,
      attribution_required: Boolean(row.attribution_required),
      attribution_text: row.attribution_text || undefined,
      source_portal: row.source_portal || undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapFavorite(row: any): FavoriteRecord {
    return {
      id: row.id,
      user_id: row.user_id,
      place_id: row.place_id,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapItinerary(row: any): ItineraryRecord {
    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      destination: row.destination,
      city: row.city || row.destination,
      state: row.state || undefined,
      days_count: Number(row.days_count) || 1,
      pace: row.pace || 'moderate',
      budget_level: row.budget_level || 'moderate',
      summary: row.summary || undefined,
      total_cost: Number(row.total_cost) || 0,
      start_date: row.start_date ? String(row.start_date) : undefined,
      end_date: row.end_date ? String(row.end_date) : undefined,
      city_ids: typeof row.city_ids === 'string' ? JSON.parse(row.city_ids) : row.city_ids || [],
      is_public: Boolean(row.is_public),
      places_count: Number(row.places_count) || 0,
      total_distance_km: Number(row.total_distance_km) || 0,
      estimated_budget: Number(row.estimated_budget) || 0,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    };
  }

  private mapItineraryDay(row: any): ItineraryDayRecord {
    return {
      id: row.id,
      itinerary_id: row.itinerary_id,
      day_number: Number(row.day_number),
      area_title: row.area_title,
      theme: row.theme || undefined,
      notes: row.notes || undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapItineraryStop(row: any): ItineraryStopRecord {
    return {
      id: row.id,
      day_id: row.day_id,
      itinerary_id: row.itinerary_id,
      place_id: row.place_id || undefined,
      place_name: row.place_name,
      stop_order: Number(row.stop_order),
      arrival_time: row.arrival_time || undefined,
      duration_minutes: Number(row.duration_minutes) || 60,
      travel_mode: row.travel_mode || undefined,
      travel_duration_minutes: Number(row.travel_duration_minutes) || 15,
      travel_distance_km: Number(row.travel_distance_km) || 2.0,
      estimated_cost: Number(row.estimated_cost) || 50,
      notes: row.notes || undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapAISession(row: any): AISessionRecord {
    return {
      id: row.id,
      user_id: row.user_id || undefined,
      title: row.title,
      context_json: row.context_json || undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    };
  }

  private mapAIMessage(row: any): AIMessageRecord {
    return {
      id: row.id,
      session_id: row.session_id,
      role: row.role,
      content: row.content,
      tool_calls_json: row.tool_calls_json || undefined,
      metadata_json: row.metadata_json || undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapAIGrounding(row: any): AIGroundingRecord {
    return {
      id: row.id,
      message_id: row.message_id,
      place_id: row.place_id || undefined,
      fact_id: row.fact_id || undefined,
      field_name: row.field_name,
      confidence: row.confidence,
      source_name: row.source_name,
      source_url: row.source_url,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  private mapCitizenReport(row: any): CitizenReportRecord {
    return {
      id: row.id,
      place_id: row.place_id || undefined,
      place_name: row.place_name || undefined,
      city: row.city || undefined,
      reported_by: row.reported_by,
      user_id: row.user_id || undefined,
      issue_type: row.issue_type,
      title: row.title || undefined,
      description: row.description,
      severity: row.severity || 'medium',
      status: row.status || 'PENDING',
      media_url: row.media_url || undefined,
      resolution_notes: row.resolution_notes || undefined,
      resolved_by: row.resolved_by || undefined,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
      updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    };
  }

  private mapAuditLog(row: any): AuditLogRecord {
    return {
      id: row.id,
      actor_id: row.actor_id || undefined,
      action: row.action,
      entity_type: row.entity_type,
      entity_id: row.entity_id,
      from_value: row.from_value,
      to_value: row.to_value,
      created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    };
  }

  // -------------------------------------------------------------
  // VALIDATION HELPERS
  // -------------------------------------------------------------
  public validateCoordinates(lat?: number, lng?: number): void {
    if (lat !== undefined) {
      if (isNaN(lat) || lat < 6.0 || lat > 38.5) {
        throw new Error(`Invalid latitude: ${lat}. Must be between 6.0 and 38.5 within India.`);
      }
    }
    if (lng !== undefined) {
      if (isNaN(lng) || lng < 68.0 || lng > 98.5) {
        throw new Error(`Invalid longitude: ${lng}. Must be between 68.0 and 98.5 within India.`);
      }
    }
  }

  // -------------------------------------------------------------
  // 1. USERS REPOSITORY
  // -------------------------------------------------------------
  public users = {
    findById: async (id: string): Promise<UserRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0] ? this.mapUser(rows[0]) : null;
      }
      return this.data.users[id] || null;
    },

    findByEmail: async (email: string): Promise<UserRecord | null> => {
      const lower = email.toLowerCase().trim();
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM users WHERE LOWER(email) = $1', [lower]);
        return rows[0] ? this.mapUser(rows[0]) : null;
      }
      const match = Object.values(this.data.users).find((u) => u.email.toLowerCase() === lower);
      return match || null;
    },

    findByGoogleId: async (googleId: string): Promise<UserRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        return rows[0] ? this.mapUser(rows[0]) : null;
      }
      const match = Object.values(this.data.users).find((u) => u.google_id === googleId);
      return match || null;
    },

    findByFirebaseUid: async (firebaseUid: string): Promise<UserRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid]);
        return rows[0] ? this.mapUser(rows[0]) : null;
      }
      const match = Object.values(this.data.users).find((u: any) => u.firebase_uid === firebaseUid);
      return match || null;
    },

    create: async (record: UserRecord): Promise<UserRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO users (
            id, email, password_hash, name, avatar_url, home_city,
            auth_provider, role, google_id, preferences, survey, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.email.toLowerCase().trim(),
          record.password_hash || null,
          record.name,
          record.avatar_url || null,
          record.home_city || 'Mumbai',
          record.auth_provider || 'local',
          record.role || 'traveller',
          record.google_id || null,
          JSON.stringify(record.preferences || {}),
          JSON.stringify(record.survey || {}),
          record.created_at || new Date().toISOString(),
          record.updated_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapUser(rows[0]);
      }

      this.data.users[record.id] = { ...record };
      this.persist();
      return record;
    },

    update: async (id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> => {
      if (this.mode === 'postgresql') {
        const existing = await this.users.findById(id);
        if (!existing) return null;

        const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };
        const sql = `
          UPDATE users SET
            email = $2, password_hash = $3, name = $4, avatar_url = $5, home_city = $6,
            auth_provider = $7, role = $8, google_id = $9, preferences = $10, survey = $11, updated_at = $12
          WHERE id = $1
          RETURNING *;
        `;
        const params = [
          id,
          merged.email.toLowerCase().trim(),
          merged.password_hash || null,
          merged.name,
          merged.avatar_url || null,
          merged.home_city || 'Mumbai',
          merged.auth_provider || 'local',
          merged.role || 'traveller',
          merged.google_id || null,
          JSON.stringify(merged.preferences || {}),
          JSON.stringify(merged.survey || {}),
          merged.updated_at,
        ];
        const rows = await this.query(sql, params);
        return rows[0] ? this.mapUser(rows[0]) : null;
      }

      const existing = this.data.users[id];
      if (!existing) return null;
      const updated: UserRecord = {
        ...existing,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.data.users[id] = updated;
      this.persist();
      return updated;
    },

    list: async (): Promise<UserRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM users ORDER BY created_at DESC');
        return rows.map((r) => this.mapUser(r));
      }
      return Object.values(this.data.users);
    },
  };

  // -------------------------------------------------------------
  // 2. PLACES REPOSITORY
  // -------------------------------------------------------------
  public places = {
    findAll: async (filters?: {
      stateId?: string;
      cityId?: string;
      city?: string;
      category?: string;
      importance_level?: string;
      confidence?: string;
      data_confidence?: string;
      verification_status?: string;
      status?: string;
      source_quality?: SourceQualityTier | string;
      topic?: string;
      subtopic?: string;
      missing_image?: boolean;
      missing_source?: boolean;
      includeAllStatuses?: boolean;
      search?: string;
      limit?: number;
      offset?: number;
    }): Promise<{ places: PlaceRecord[]; total: number }> => {
      if (this.mode === 'postgresql') {
        const conditions: string[] = [];
        const params: any[] = [];
        let pIndex = 1;

        const statusFilter = filters?.verification_status || filters?.status;
        if (statusFilter && statusFilter !== 'all') {
          conditions.push(`LOWER(verification_status) = $${pIndex++}`);
          params.push(statusFilter.toLowerCase());
        } else if (!filters?.includeAllStatuses) {
          conditions.push(`LOWER(verification_status) = 'verified' AND LOWER(source_quality) IN ('place_specific', 'official_site')`);
        }

        if (filters?.source_quality && filters.source_quality !== 'all') {
          conditions.push(`LOWER(source_quality) = $${pIndex++}`);
          params.push(filters.source_quality.toLowerCase());
        }

        if (filters?.stateId) {
          conditions.push(`LOWER(state_id) = $${pIndex++}`);
          params.push(filters.stateId.toLowerCase());
        }

        if (filters?.cityId || filters?.city) {
          conditions.push(`LOWER(city_id) = $${pIndex++}`);
          params.push((filters.cityId || filters.city || '').toLowerCase());
        }

        if (filters?.category) {
          conditions.push(`(LOWER(category) = $${pIndex} OR categories @> $${pIndex + 1}::jsonb)`);
          params.push(filters.category.toLowerCase(), JSON.stringify([filters.category]));
          pIndex += 2;
        }

        if (filters?.topic) {
          conditions.push(`(LOWER(topic) = $${pIndex} OR categories @> $${pIndex + 1}::jsonb)`);
          params.push(filters.topic.toLowerCase(), JSON.stringify([filters.topic]));
          pIndex += 2;
        }

        if (filters?.subtopic) {
          conditions.push(`(LOWER(subtopic) = $${pIndex} OR subcategories @> $${pIndex + 1}::jsonb)`);
          params.push(filters.subtopic.toLowerCase(), JSON.stringify([filters.subtopic]));
          pIndex += 2;
        }

        if (filters?.importance_level) {
          conditions.push(`importance_level = $${pIndex++}`);
          params.push(filters.importance_level);
        }

        if (filters?.missing_image) {
          conditions.push(`(thumbnail_url IS NULL OR TRIM(thumbnail_url) = '')`);
        }

        if (filters?.missing_source) {
          conditions.push(`((source_url IS NULL OR TRIM(source_url) = '') AND (sources IS NULL OR sources = '[]'::jsonb))`);
        }

        if (filters?.search) {
          const q = `%${filters.search.toLowerCase().trim()}%`;
          conditions.push(`(
            LOWER(name) LIKE $${pIndex} OR
            LOWER(summary) LIKE $${pIndex} OR
            LOWER(description) LIKE $${pIndex} OR
            LOWER(city_id) LIKE $${pIndex} OR
            LOWER(state_id) LIKE $${pIndex}
          )`);
          params.push(q);
          pIndex++;
        }

        const targetConfidence = filters?.confidence || filters?.data_confidence;
        if (targetConfidence) {
          conditions.push(`LOWER(data_confidence) = $${pIndex++}`);
          params.push(targetConfidence.toLowerCase());
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const countSql = `SELECT COUNT(*) AS total FROM places ${whereClause};`;
        const countRows = await this.query(countSql, params);
        const total = parseInt(countRows[0]?.total || '0', 10);

        const limit = filters?.limit || 50;
        const offset = filters?.offset || 0;
        const selectSql = `
          SELECT * FROM places
          ${whereClause}
          ORDER BY name ASC
          LIMIT $${pIndex++} OFFSET $${pIndex++};
        `;
        const selectParams = [...params, limit, offset];
        const rows = await this.query(selectSql, selectParams);

        return {
          places: rows.map((r) => this.mapPlace(r)),
          total,
        };
      }

      // JSON Mode
      let list = Object.values(this.data.places);

      const statusFilter = filters?.verification_status || filters?.status;
      if (statusFilter && statusFilter !== 'all') {
        list = list.filter((p) => (p.verification_status || 'draft').toLowerCase() === statusFilter.toLowerCase());
      } else if (!filters?.includeAllStatuses) {
        list = list.filter((p) => {
          const s = (p.verification_status || 'draft').toLowerCase();
          const q = p.source_quality || computeSourceQuality(p.source_url || (p.sources && p.sources[0]?.source_url));
          return s === 'verified' && (q === 'place_specific' || q === 'official_site');
        });
      }

      if (filters?.source_quality && filters.source_quality !== 'all') {
        list = list.filter((p) => {
          const q = p.source_quality || computeSourceQuality(p.source_url || (p.sources && p.sources[0]?.source_url));
          return q === filters.source_quality;
        });
      }

      if (filters?.stateId) {
        list = list.filter((p) => p.state_id?.toLowerCase() === filters.stateId?.toLowerCase());
      }
      if (filters?.cityId || filters?.city) {
        const targetCity = (filters.cityId || filters.city || '').toLowerCase();
        list = list.filter((p) => p.city_id?.toLowerCase() === targetCity);
      }
      if (filters?.category) {
        const targetCat = filters.category.toLowerCase();
        list = list.filter(
          (p) =>
            p.category?.toLowerCase() === targetCat ||
            (Array.isArray(p.categories) && p.categories.some((c) => c.toLowerCase() === targetCat))
        );
      }
      if (filters?.topic) {
        const targetTopic = filters.topic.toLowerCase();
        list = list.filter(
          (p) =>
            p.topic?.toLowerCase() === targetTopic ||
            (Array.isArray(p.category_links) && p.category_links.some((cl) => cl.topic.toLowerCase() === targetTopic)) ||
            (Array.isArray(p.categories) && p.categories.some((c) => c.toLowerCase() === targetTopic))
        );
      }
      if (filters?.subtopic) {
        const targetSubtopic = filters.subtopic.toLowerCase();
        list = list.filter(
          (p) =>
            p.subtopic?.toLowerCase() === targetSubtopic ||
            (Array.isArray(p.category_links) && p.category_links.some((cl) => cl.subtopic.toLowerCase() === targetSubtopic)) ||
            (Array.isArray(p.subcategories) && p.subcategories.some((sc) => sc.toLowerCase() === targetSubtopic))
        );
      }
      if (filters?.importance_level) {
        list = list.filter((p) => p.importance_level === filters.importance_level);
      }
      if (filters?.missing_image) {
        list = list.filter((p) => !p.thumbnail_url || p.thumbnail_url.trim() === '');
      }
      if (filters?.missing_source) {
        list = list.filter((p) => {
          const hasField = p.source_url && p.source_url.trim() !== '';
          const hasInline = Array.isArray(p.sources) && p.sources.length > 0;
          return !hasField && !hasInline;
        });
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(
          (p) =>
            (p.name?.toLowerCase() || '').includes(q) ||
            (p.summary?.toLowerCase() || '').includes(q) ||
            (p.description?.toLowerCase() || '').includes(q) ||
            (p.city_id?.toLowerCase() || '').includes(q) ||
            (p.state_id?.toLowerCase() || '').includes(q)
        );
      }
      const targetConfidence = filters?.confidence || filters?.data_confidence;
      if (targetConfidence) {
        list = list.filter((p) => (p.data_confidence || '').toLowerCase() === targetConfidence.toLowerCase());
      }

      const total = list.length;
      const offset = filters?.offset || 0;
      const limit = filters?.limit || 50;
      return {
        places: list.slice(offset, offset + limit),
        total,
      };
    },

    findById: async (id: string): Promise<PlaceRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM places WHERE LOWER(id) = LOWER($1)', [id]);
        return rows[0] ? this.mapPlace(rows[0]) : null;
      }
      return this.data.places[id] || this.data.places[id.toLowerCase()] || null;
    },

    findNearby: async (lat: number, lng: number, radiusKm = 50, limit = 20): Promise<PlaceRecord[]> => {
      if (this.mode === 'postgresql') {
        // Haversine formula calculation in PostgreSQL
        const sql = `
          SELECT *, (
            6371 * acos(
              LEAST(1.0, GREATEST(-1.0,
                cos(radians($1)) * cos(radians(lat)) * cos(radians(lng) - radians($2)) +
                sin(radians($1)) * sin(radians(lat))
              ))
            )
          ) AS distance_km
          FROM places
          WHERE LOWER(verification_status) IN ('verified', 'official')
            AND (
              6371 * acos(
                LEAST(1.0, GREATEST(-1.0,
                  cos(radians($1)) * cos(radians(lat)) * cos(radians(lng) - radians($2)) +
                  sin(radians($1)) * sin(radians(lat))
                ))
              )
            ) <= $3
          ORDER BY distance_km ASC
          LIMIT $4;
        `;
        const rows = await this.query(sql, [lat, lng, radiusKm, limit]);
        return rows.map((r) => this.mapPlace(r));
      }

      const R = 6371;
      const withDistance = Object.values(this.data.places)
        .filter((p) => {
          const s = (p.verification_status || 'verified').toLowerCase();
          return s === 'verified' || s === 'official';
        })
        .map((p) => {
          const dLat = (p.lat - lat) * (Math.PI / 180);
          const dLon = (p.lng - lng) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat * (Math.PI / 180)) * Math.cos(p.lat * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return { place: p, distance: dist };
        });
      return withDistance
        .filter((item) => item.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)
        .map((item) => item.place);
    },

    search: async (query: string, limit = 20): Promise<PlaceRecord[]> => {
      const q = query.toLowerCase().trim();
      if (this.mode === 'postgresql') {
        const sql = `
          SELECT * FROM places
          WHERE LOWER(verification_status) IN ('verified', 'official')
            AND (
              LOWER(name) LIKE $1 OR
              LOWER(summary) LIKE $1 OR
              LOWER(description) LIKE $1 OR
              LOWER(category) LIKE $1 OR
              LOWER(city_id) LIKE $1 OR
              LOWER(state_id) LIKE $1
            )
          ORDER BY name ASC
          LIMIT $2;
        `;
        const rows = await this.query(sql, [`%${q}%`, limit]);
        return rows.map((r) => this.mapPlace(r));
      }

      return Object.values(this.data.places)
        .filter((p) => {
          const s = (p.verification_status || 'verified').toLowerCase();
          return (
            (s === 'verified' || s === 'official') &&
            (p.name.toLowerCase().includes(q) ||
              p.summary?.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q) ||
              p.category?.toLowerCase().includes(q) ||
              p.city_id?.toLowerCase().includes(q) ||
              p.state_id?.toLowerCase().includes(q))
          );
        })
        .slice(0, limit);
    },

    create: async (record: PlaceRecord): Promise<PlaceRecord> => {
      // 1. Validate coordinates
      const lat = record.lat ?? record.latitude;
      const lng = record.lng ?? record.longitude;
      if (lat !== undefined && lng !== undefined) {
        this.validateCoordinates(lat, lng);
      }

      // 2. Prevent duplicate places inside the same city
      if (record.city_id && record.name) {
        if (this.mode === 'postgresql') {
          const dupRows = await this.query(
            'SELECT id FROM places WHERE LOWER(city_id) = LOWER($1) AND LOWER(TRIM(name)) = LOWER(TRIM($2)) AND id != $3',
            [record.city_id, record.name, record.id]
          );
          if (dupRows.length > 0) {
            throw new Error(`Duplicate place: "${record.name}" already exists in city "${record.city_id}".`);
          }
        } else {
          const dup = Object.values(this.data.places).find(
            (p) =>
              p.city_id?.toLowerCase() === record.city_id?.toLowerCase() &&
              p.name.trim().toLowerCase() === record.name.trim().toLowerCase() &&
              p.id !== record.id
          );
          if (dup) {
            throw new Error(`Duplicate place: "${record.name}" already exists in city "${record.city_id}".`);
          }
        }
      }

      // 3. Enforce source requirement and quality tier before verification
      const sourceUrl = record.source_url || (Array.isArray(record.sources) ? record.sources[0]?.source_url : undefined);
      const quality = computeSourceQuality(sourceUrl);
      record.source_quality = quality;

      if (record.verification_status === 'verified') {
        if (quality === 'generic_homepage' || quality === 'missing') {
          throw new Error(
            'VERIFIED FORBIDDEN: Generic homepage URL (like asi.nic.in or whc.unesco.org) cannot be marked as verified. Must be Tier 1 (place_specific deep link) or Tier 2 (official place site).'
          );
        }
        if (!record.last_verified_on) {
          record.last_verified_on = new Date().toISOString().split('T')[0];
        }
      }

      const cleanRecord: PlaceRecord = {
        ...record,
        lat: lat ?? 20.5937,
        lng: lng ?? 78.9629,
        created_at: record.created_at || new Date().toISOString(),
      };

      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO places (
            id, city_id, state_id, district, name, slug, canonical_name, aliases, place_type,
            category, categories, subcategories, topic, subtopic, category_links, importance_level,
            locality_type, short_description, summary, detailed_description, description, history,
            address, area, best_for, suggested_duration, visitor_notes, map_search, tags,
            lat, lng, latitude, longitude, opening_hours, visiting_hours, entry_fee,
            entry_fee_domestic, entry_fee_intl, best_time_to_visit, contact_information, official_website,
            heritage_status, data_confidence, source_url, source_name, source_type, provenance_type,
            verification_status, source_quality, last_verified_on, last_verified_at, rating,
            thumbnail_url, sources, media, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19, $20, $21, $22,
            $23, $24, $25, $26, $27, $28, $29,
            $30, $31, $32, $33, $34, $35, $36,
            $37, $38, $39, $40, $41,
            $42, $43, $44, $45, $46, $47,
            $48, $49, $50, $51, $52,
            $53, $54, $55, $56, $57
          ) RETURNING *;
        `;
        const params = [
          cleanRecord.id,
          cleanRecord.city_id || null,
          cleanRecord.state_id || null,
          cleanRecord.district || null,
          cleanRecord.name,
          cleanRecord.slug || cleanRecord.id,
          cleanRecord.canonical_name || cleanRecord.name,
          JSON.stringify(cleanRecord.aliases || []),
          cleanRecord.place_type || null,
          cleanRecord.category,
          JSON.stringify(cleanRecord.categories || []),
          JSON.stringify(cleanRecord.subcategories || []),
          cleanRecord.topic || null,
          cleanRecord.subtopic || null,
          JSON.stringify(cleanRecord.category_links || []),
          cleanRecord.importance_level || null,
          cleanRecord.locality_type || null,
          cleanRecord.short_description || null,
          cleanRecord.summary,
          cleanRecord.detailed_description || null,
          cleanRecord.description,
          cleanRecord.history || '',
          cleanRecord.address || null,
          cleanRecord.area || null,
          cleanRecord.best_for || null,
          cleanRecord.suggested_duration || null,
          cleanRecord.visitor_notes || null,
          cleanRecord.map_search || null,
          JSON.stringify(cleanRecord.tags || []),
          cleanRecord.lat,
          cleanRecord.lng,
          cleanRecord.latitude ?? cleanRecord.lat,
          cleanRecord.longitude ?? cleanRecord.lng,
          cleanRecord.opening_hours || null,
          cleanRecord.visiting_hours || 'Sunrise to Sunset',
          cleanRecord.entry_fee ? String(cleanRecord.entry_fee) : null,
          cleanRecord.entry_fee_domestic || 0,
          cleanRecord.entry_fee_intl || 0,
          cleanRecord.best_time_to_visit || null,
          cleanRecord.contact_information || null,
          cleanRecord.official_website || null,
          cleanRecord.heritage_status || 'verified',
          cleanRecord.data_confidence || 'unverified',
          cleanRecord.source_url || null,
          cleanRecord.source_name || null,
          cleanRecord.source_type || null,
          cleanRecord.provenance_type || null,
          cleanRecord.verification_status || 'unverified',
          cleanRecord.source_quality || null,
          cleanRecord.last_verified_on || null,
          cleanRecord.last_verified_at || null,
          cleanRecord.rating || 4.5,
          cleanRecord.thumbnail_url || null,
          JSON.stringify(cleanRecord.sources || []),
          JSON.stringify(cleanRecord.media || []),
          cleanRecord.created_at,
          new Date().toISOString(),
        ];

        const rows = await this.query(sql, params);
        return this.mapPlace(rows[0]);
      }

      this.data.places[cleanRecord.id] = cleanRecord;
      this.persist();
      return cleanRecord;
    },

    update: async (id: string, updates: Partial<PlaceRecord>): Promise<PlaceRecord | null> => {
      const existing = await this.places.findById(id);
      if (!existing) return null;

      const merged = { ...existing, ...updates };

      // Validate coordinates if changed
      const lat = updates.lat ?? updates.latitude;
      const lng = updates.lng ?? updates.longitude;
      if (lat !== undefined || lng !== undefined) {
        this.validateCoordinates(merged.lat, merged.lng);
      }

      // Check duplicate place inside same city
      if (updates.name || updates.city_id) {
        if (this.mode === 'postgresql') {
          const dupRows = await this.query(
            'SELECT id FROM places WHERE LOWER(city_id) = LOWER($1) AND LOWER(TRIM(name)) = LOWER(TRIM($2)) AND id != $3',
            [merged.city_id || '', merged.name, id]
          );
          if (dupRows.length > 0) {
            throw new Error(`Duplicate place: "${merged.name}" already exists in city "${merged.city_id}".`);
          }
        } else {
          const dup = Object.values(this.data.places).find(
            (p) =>
              p.id !== id &&
              p.city_id?.toLowerCase() === merged.city_id?.toLowerCase() &&
              p.name.trim().toLowerCase() === merged.name.trim().toLowerCase()
          );
          if (dup) {
            throw new Error(`Duplicate place: "${merged.name}" already exists in city "${merged.city_id}".`);
          }
        }
      }

      // Source check if marking as verified
      const updatedSourceUrl = merged.source_url || (Array.isArray(merged.sources) ? merged.sources[0]?.source_url : undefined);
      const quality = computeSourceQuality(updatedSourceUrl);
      merged.source_quality = quality;

      if (updates.verification_status === 'verified' || (merged.verification_status === 'verified' && updates.source_url !== undefined)) {
        if (quality === 'generic_homepage' || quality === 'missing') {
          throw new Error(
            'VERIFIED FORBIDDEN: Generic homepage URL (like asi.nic.in or whc.unesco.org) cannot be marked as verified. Must be Tier 1 (place_specific deep link) or Tier 2 (official place site).'
          );
        }
        if (!merged.last_verified_on) {
          merged.last_verified_on = new Date().toISOString().split('T')[0];
        }
      }

      if (this.mode === 'postgresql') {
        const sql = `
          UPDATE places SET
            city_id = $2, state_id = $3, district = $4, name = $5, slug = $6, canonical_name = $7,
            aliases = $8, place_type = $9, category = $10, categories = $11, subcategories = $12,
            topic = $13, subtopic = $14, category_links = $15, importance_level = $16, locality_type = $17,
            short_description = $18, summary = $19, detailed_description = $20, description = $21,
            history = $22, address = $23, area = $24, best_for = $25, suggested_duration = $26,
            visitor_notes = $27, map_search = $28, tags = $29, lat = $30, lng = $31,
            latitude = $32, longitude = $33, opening_hours = $34, visiting_hours = $35, entry_fee = $36,
            entry_fee_domestic = $37, entry_fee_intl = $38, best_time_to_visit = $39,
            contact_information = $40, official_website = $41, heritage_status = $42,
            data_confidence = $43, source_url = $44, source_name = $45, source_type = $46,
            provenance_type = $47, verification_status = $48, source_quality = $49,
            last_verified_on = $50, last_verified_at = $51, rating = $52, thumbnail_url = $53,
            sources = $54, media = $55, updated_at = $56
          WHERE id = $1
          RETURNING *;
        `;
        const params = [
          id,
          merged.city_id || null,
          merged.state_id || null,
          merged.district || null,
          merged.name,
          merged.slug || id,
          merged.canonical_name || merged.name,
          JSON.stringify(merged.aliases || []),
          merged.place_type || null,
          merged.category,
          JSON.stringify(merged.categories || []),
          JSON.stringify(merged.subcategories || []),
          merged.topic || null,
          merged.subtopic || null,
          JSON.stringify(merged.category_links || []),
          merged.importance_level || null,
          merged.locality_type || null,
          merged.short_description || null,
          merged.summary,
          merged.detailed_description || null,
          merged.description,
          merged.history || '',
          merged.address || null,
          merged.area || null,
          merged.best_for || null,
          merged.suggested_duration || null,
          merged.visitor_notes || null,
          merged.map_search || null,
          JSON.stringify(merged.tags || []),
          merged.lat,
          merged.lng,
          merged.latitude ?? merged.lat,
          merged.longitude ?? merged.lng,
          merged.opening_hours || null,
          merged.visiting_hours || 'Sunrise to Sunset',
          merged.entry_fee ? String(merged.entry_fee) : null,
          merged.entry_fee_domestic || 0,
          merged.entry_fee_intl || 0,
          merged.best_time_to_visit || null,
          merged.contact_information || null,
          merged.official_website || null,
          merged.heritage_status || 'verified',
          merged.data_confidence || 'unverified',
          merged.source_url || null,
          merged.source_name || null,
          merged.source_type || null,
          merged.provenance_type || null,
          merged.verification_status || 'unverified',
          merged.source_quality || null,
          merged.last_verified_on || null,
          merged.last_verified_at || null,
          merged.rating || 4.5,
          merged.thumbnail_url || null,
          JSON.stringify(merged.sources || []),
          JSON.stringify(merged.media || []),
          new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return rows[0] ? this.mapPlace(rows[0]) : null;
      }

      this.data.places[id] = merged;
      this.persist();
      return merged;
    },

    delete: async (id: string): Promise<boolean> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('DELETE FROM places WHERE LOWER(id) = LOWER($1) RETURNING id', [id]);
        return rows.length > 0;
      }

      if (!this.data.places[id]) return false;
      delete this.data.places[id];
      this.persist();
      return true;
    },
  };

  // -------------------------------------------------------------
  // 3. STATES REPOSITORY
  // -------------------------------------------------------------
  public states = {
    findAll: async (): Promise<StateRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM states ORDER BY name ASC');
        return rows.map((r) => this.mapState(r));
      }
      return Object.values(this.data.states);
    },

    findById: async (id: string): Promise<StateRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM states WHERE LOWER(id) = LOWER($1)', [id]);
        return rows[0] ? this.mapState(rows[0]) : null;
      }
      return this.data.states[id] || null;
    },

    create: async (record: StateRecord): Promise<StateRecord> => {
      if (this.mode === 'postgresql') {
        const existing = await this.states.findById(record.id);
        if (existing) {
          throw new Error(`State with id "${record.id}" already exists.`);
        }
        const sql = `
          INSERT INTO states (
            id, name, slug, type, region_type, capital, region,
            official_tourism_url, description, status, hero_image_id, hero_image_url,
            hero_image, source_url, source_name, creator, license, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.name,
          record.slug || record.id,
          record.type || 'state',
          record.region_type || 'state',
          record.capital || '',
          record.region || '',
          record.official_tourism_url || null,
          record.description || '',
          record.status || 'verified',
          record.hero_image_id || null,
          record.hero_image_url || null,
          record.hero_image ? JSON.stringify(record.hero_image) : null,
          record.source_url || null,
          record.source_name || null,
          record.creator || null,
          record.license || null,
          record.created_at || new Date().toISOString(),
          new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapState(rows[0]);
      }

      if (this.data.states[record.id]) {
        throw new Error(`State with id "${record.id}" already exists.`);
      }
      this.data.states[record.id] = { ...record };
      this.persist();
      return record;
    },

    update: async (id: string, updates: Partial<StateRecord>): Promise<StateRecord | null> => {
      if (this.mode === 'postgresql') {
        const existing = await this.states.findById(id);
        if (!existing) return null;
        const merged = { ...existing, ...updates };

        const sql = `
          UPDATE states SET
            name = $2, slug = $3, type = $4, region_type = $5, capital = $6, region = $7,
            official_tourism_url = $8, description = $9, status = $10, hero_image_id = $11,
            hero_image_url = $12, hero_image = $13, source_url = $14, source_name = $15,
            creator = $16, license = $17, updated_at = $18
          WHERE LOWER(id) = LOWER($1)
          RETURNING *;
        `;
        const params = [
          id,
          merged.name,
          merged.slug || id,
          merged.type || 'state',
          merged.region_type || 'state',
          merged.capital || '',
          merged.region || '',
          merged.official_tourism_url || null,
          merged.description || '',
          merged.status || 'verified',
          merged.hero_image_id || null,
          merged.hero_image_url || null,
          merged.hero_image ? JSON.stringify(merged.hero_image) : null,
          merged.source_url || null,
          merged.source_name || null,
          merged.creator || null,
          merged.license || null,
          new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return rows[0] ? this.mapState(rows[0]) : null;
      }

      const existing = this.data.states[id];
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      this.data.states[id] = updated;
      this.persist();
      return updated;
    },

    delete: async (id: string): Promise<boolean> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('DELETE FROM states WHERE LOWER(id) = LOWER($1) RETURNING id', [id]);
        return rows.length > 0;
      }

      if (!this.data.states[id]) return false;
      delete this.data.states[id];
      this.persist();
      return true;
    },
  };

  // -------------------------------------------------------------
  // 4. CITIES REPOSITORY
  // -------------------------------------------------------------
  public cities = {
    findAll: async (): Promise<CityRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM cities ORDER BY name ASC');
        return rows.map((r) => this.mapCity(r));
      }
      return Object.values(this.data.cities);
    },

    findById: async (id: string): Promise<CityRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM cities WHERE LOWER(id) = LOWER($1)', [id]);
        return rows[0] ? this.mapCity(rows[0]) : null;
      }
      return this.data.cities[id] || null;
    },

    findByStateId: async (stateId: string): Promise<CityRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM cities WHERE LOWER(state_id) = LOWER($1) ORDER BY name ASC', [stateId]);
        return rows.map((r) => this.mapCity(r));
      }
      return Object.values(this.data.cities).filter((c) => c.state_id?.toLowerCase() === stateId.toLowerCase());
    },

    create: async (record: CityRecord): Promise<CityRecord> => {
      const lat = record.lat ?? record.latitude;
      const lng = record.lng ?? record.longitude;
      if (lat !== undefined && lng !== undefined) {
        this.validateCoordinates(lat, lng);
      }

      if (this.mode === 'postgresql') {
        const dupRows = await this.query(
          'SELECT id FROM cities WHERE LOWER(state_id) = LOWER($1) AND LOWER(TRIM(name)) = LOWER(TRIM($2)) AND id != $3',
          [record.state_id, record.name, record.id]
        );
        if (dupRows.length > 0) {
          throw new Error(`Duplicate city: "${record.name}" already exists in state "${record.state_id}".`);
        }

        const sql = `
          INSERT INTO cities (
            id, state_id, name, slug, canonical_name, entity_type, district, lat, lng,
            short_description, description, tagline, official_url, status, state, region,
            city_type, tourism_categories, prominence, is_capital, capital_status,
            verification_status, source_provenance, hero_image_url, hero_image, source_url,
            source_name, creator, license, places_count, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19, $20, $21,
            $22, $23, $24, $25, $26,
            $27, $28, $29, $30, $31, $32
          ) RETURNING *;
        `;
        const params = [
          record.id,
          record.state_id,
          record.name,
          record.slug || record.id,
          record.canonical_name || record.name,
          record.entity_type || 'city',
          record.district || null,
          lat ?? 20.5937,
          lng ?? 78.9629,
          record.short_description || record.description || '',
          record.description || '',
          record.tagline || '',
          record.official_url || null,
          record.status || 'verified',
          record.state || '',
          record.region || '',
          record.city_type || 'city',
          JSON.stringify(record.tourism_categories || []),
          record.prominence || '',
          Boolean(record.is_capital),
          record.capital_status || '',
          record.verification_status || 'verified',
          record.source_provenance || '',
          record.hero_image_url || '',
          record.hero_image ? JSON.stringify(record.hero_image) : null,
          record.source_url || '',
          record.source_name || '',
          record.creator || null,
          record.license || '',
          record.places_count || 0,
          record.created_at || new Date().toISOString(),
          new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapCity(rows[0]);
      }

      const dup = Object.values(this.data.cities).find(
        (c) =>
          c.state_id?.toLowerCase() === record.state_id?.toLowerCase() &&
          c.name.trim().toLowerCase() === record.name.trim().toLowerCase() &&
          c.id !== record.id
      );
      if (dup) {
        throw new Error(`Duplicate city: "${record.name}" already exists in state "${record.state_id}".`);
      }

      this.data.cities[record.id] = {
        ...record,
        lat: lat ?? 20.5937,
        lng: lng ?? 78.9629,
        entity_type: record.entity_type || 'city',
        created_at: record.created_at || new Date().toISOString(),
      };
      this.persist();
      return this.data.cities[record.id];
    },

    update: async (id: string, updates: Partial<CityRecord>): Promise<CityRecord | null> => {
      const existing = await this.cities.findById(id);
      if (!existing) return null;

      const merged = { ...existing, ...updates };

      if (updates.name || updates.state_id) {
        if (this.mode === 'postgresql') {
          const dupRows = await this.query(
            'SELECT id FROM cities WHERE LOWER(state_id) = LOWER($1) AND LOWER(TRIM(name)) = LOWER(TRIM($2)) AND id != $3',
            [merged.state_id, merged.name, id]
          );
          if (dupRows.length > 0) {
            throw new Error(`Duplicate city: "${merged.name}" already exists in state "${merged.state_id}".`);
          }
        } else {
          const dup = Object.values(this.data.cities).find(
            (c) =>
              c.id !== id &&
              c.state_id?.toLowerCase() === merged.state_id?.toLowerCase() &&
              c.name.trim().toLowerCase() === merged.name.trim().toLowerCase()
          );
          if (dup) {
            throw new Error(`Duplicate city: "${merged.name}" already exists in state "${merged.state_id}".`);
          }
        }
      }

      if (this.mode === 'postgresql') {
        const sql = `
          UPDATE cities SET
            state_id = $2, name = $3, slug = $4, canonical_name = $5, entity_type = $6, district = $7,
            lat = $8, lng = $9, short_description = $10, description = $11, tagline = $12, official_url = $13,
            status = $14, state = $15, region = $16, city_type = $17, tourism_categories = $18, prominence = $19,
            is_capital = $20, capital_status = $21, verification_status = $22, source_provenance = $23,
            hero_image_url = $24, hero_image = $25, source_url = $26, source_name = $27, creator = $28,
            license = $29, places_count = $30, updated_at = $31
          WHERE LOWER(id) = LOWER($1)
          RETURNING *;
        `;
        const params = [
          id,
          merged.state_id,
          merged.name,
          merged.slug || id,
          merged.canonical_name || merged.name,
          merged.entity_type || 'city',
          merged.district || null,
          merged.lat,
          merged.lng,
          merged.short_description || merged.description || '',
          merged.description || '',
          merged.tagline || '',
          merged.official_url || null,
          merged.status || 'verified',
          merged.state || '',
          merged.region || '',
          merged.city_type || 'city',
          JSON.stringify(merged.tourism_categories || []),
          merged.prominence || '',
          Boolean(merged.is_capital),
          merged.capital_status || '',
          merged.verification_status || 'verified',
          merged.source_provenance || '',
          merged.hero_image_url || '',
          merged.hero_image ? JSON.stringify(merged.hero_image) : null,
          merged.source_url || '',
          merged.source_name || '',
          merged.creator || null,
          merged.license || '',
          merged.places_count || 0,
          new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return rows[0] ? this.mapCity(rows[0]) : null;
      }

      this.data.cities[id] = merged;
      this.persist();
      return merged;
    },

    delete: async (id: string): Promise<boolean> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('DELETE FROM cities WHERE LOWER(id) = LOWER($1) RETURNING id', [id]);
        return rows.length > 0;
      }

      if (!this.data.cities[id]) return false;
      delete this.data.cities[id];
      this.persist();
      return true;
    },
  };

  // -------------------------------------------------------------
  // 5. ADMIN METRICS
  // -------------------------------------------------------------
  public getAdminMetrics = async () => {
    let allPlaces: PlaceRecord[];
    let allCities: CityRecord[];
    let allStates: StateRecord[];
    let placeSourcesList: PlaceSourceRecord[] = [];

    if (this.mode === 'postgresql') {
      allPlaces = (await this.query('SELECT * FROM places')).map((r) => this.mapPlace(r));
      allCities = (await this.query('SELECT * FROM cities')).map((r) => this.mapCity(r));
      allStates = (await this.query('SELECT * FROM states')).map((r) => this.mapState(r));
      placeSourcesList = (await this.query('SELECT * FROM place_sources')).map((r) => this.mapPlaceSource(r));
    } else {
      allPlaces = Object.values(this.data.places);
      allCities = Object.values(this.data.cities);
      allStates = Object.values(this.data.states);
      placeSourcesList = Object.values(this.data.place_sources);
    }

    let verifiedCount = 0;
    let pendingCount = 0;
    let needsReviewCount = 0;
    let draftCount = 0;
    let rejectedCount = 0;
    let missingSourceCount = 0;
    let missingCoordsCount = 0;
    let missingImageCount = 0;
    let tier1Count = 0;
    let tier2Count = 0;
    let tier3GenericCount = 0;

    for (const p of allPlaces) {
      const status = (p.verification_status || 'draft').toLowerCase();
      if (status === 'verified' || status === 'official') verifiedCount++;
      else if (status === 'pending') pendingCount++;
      else if (status === 'needs_review') needsReviewCount++;
      else if (status === 'draft') draftCount++;
      else if (status === 'rejected') rejectedCount++;

      const quality = p.source_quality || computeSourceQuality(p.source_url || (p.sources && p.sources[0]?.source_url));
      if (quality === 'place_specific') tier1Count++;
      else if (quality === 'official_site') tier2Count++;
      else if (quality === 'generic_homepage') tier3GenericCount++;

      const hasSource =
        (p.source_url && p.source_url.trim() !== '') ||
        (Array.isArray(p.sources) && p.sources.length > 0) ||
        placeSourcesList.some((s) => s.place_id === p.id);
      if (!hasSource) missingSourceCount++;

      const hasValidCoords = p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng) && p.lat >= 6 && p.lat <= 38.5;
      if (!hasValidCoords) missingCoordsCount++;

      const hasImage = p.thumbnail_url && p.thumbnail_url.trim() !== '';
      if (!hasImage) missingImageCount++;
    }

    return {
      total_states: allStates.length,
      total_cities: allCities.length,
      total_places: allPlaces.length,
      verified_places: verifiedCount,
      pending_places: pendingCount,
      needs_review_places: needsReviewCount,
      draft_places: draftCount,
      rejected_places: rejectedCount,
      places_without_sources: missingSourceCount,
      places_without_coordinates: missingCoordsCount,
      places_without_images: missingImageCount,
      tier1_places: tier1Count,
      tier2_places: tier2Count,
      tier3_generic_places: tier3GenericCount,
    };
  };

  // -------------------------------------------------------------
  // 6. TRANSIT NODES REPOSITORY
  // -------------------------------------------------------------
  public transit = {
    findAll: async (): Promise<TransitNodeRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM transit_nodes ORDER BY name ASC');
        return rows.map((r) => this.mapTransitNode(r));
      }
      return Object.values(this.data.transit_nodes);
    },
    findByCode: async (code: string): Promise<TransitNodeRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM transit_nodes WHERE UPPER(code) = UPPER($1)', [code]);
        return rows[0] ? this.mapTransitNode(rows[0]) : null;
      }
      const match = Object.values(this.data.transit_nodes).find((t) => t.code.toUpperCase() === code.toUpperCase());
      return match || null;
    },
    findById: async (id: string): Promise<TransitNodeRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM transit_nodes WHERE id = $1', [id]);
        return rows[0] ? this.mapTransitNode(rows[0]) : null;
      }
      return this.data.transit_nodes[id] || null;
    },
  };

  // -------------------------------------------------------------
  // 7. PLACE SOURCES REPOSITORY (Section XI.2)
  // -------------------------------------------------------------
  public placeSources = {
    findAll: async (): Promise<PlaceSourceRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM place_sources ORDER BY source_name ASC');
        return rows.map((r) => this.mapPlaceSource(r));
      }
      return Object.values(this.data.place_sources);
    },
    findById: async (id: string): Promise<PlaceSourceRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM place_sources WHERE id = $1', [id]);
        return rows[0] ? this.mapPlaceSource(rows[0]) : null;
      }
      return this.data.place_sources[id] || null;
    },
    create: async (record: PlaceSourceRecord): Promise<PlaceSourceRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO place_sources (id, source_name, source_type, url, created_at)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.source_name,
          record.source_type,
          record.source_url || record.url || '',
          record.created_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapPlaceSource(rows[0]);
      }

      this.data.place_sources[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // 8. PLACE FACTS REPOSITORY (Field-level provenance)
  // -------------------------------------------------------------
  public placeFacts = {
    findByPlaceId: async (placeId: string): Promise<PlaceFactRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM place_facts WHERE place_id = $1 ORDER BY fact_key ASC', [placeId]);
        return rows.map((r) => this.mapPlaceFact(r));
      }
      return Object.values(this.data.place_facts).filter((f) => f.place_id === placeId);
    },
    create: async (record: PlaceFactRecord): Promise<PlaceFactRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO place_facts (
            id, place_id, fact_key, fact_value, data_confidence,
            source_url, source_type, verified_at, expires_at, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.place_id,
          record.fact_key,
          record.fact_value,
          record.data_confidence,
          record.source_url,
          record.source_type,
          record.verified_at || new Date().toISOString(),
          record.expires_at || null,
          record.created_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapPlaceFact(rows[0]);
      }

      this.data.place_facts[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // 9. IMAGE LICENSES REPOSITORY (Section XI.4 & XV.2)
  // -------------------------------------------------------------
  public imageLicenses = {
    findByUrl: async (imageUrl: string): Promise<ImageLicenseRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM image_licenses WHERE image_url = $1', [imageUrl]);
        return rows[0] ? this.mapImageLicense(rows[0]) : null;
      }
      return Object.values(this.data.image_licenses).find((l) => l.image_url === imageUrl) || null;
    },
    create: async (record: ImageLicenseRecord): Promise<ImageLicenseRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO image_licenses (
            id, image_url, license_type, attribution_required, attribution_text, source_portal, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.image_url,
          record.license_type || 'editorial_fair_use',
          record.attribution_required ?? true,
          record.attribution_text || null,
          record.source_portal || null,
          record.created_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapImageLicense(rows[0]);
      }

      this.data.image_licenses[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // 10. FAVORITES REPOSITORY (Scoped to user_id, IDOR protected)
  // -------------------------------------------------------------
  public favorites = {
    listByUser: async (userId: string): Promise<FavoriteRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return rows.map((r) => this.mapFavorite(r));
      }
      return Object.values(this.data.favorites).filter((f) => f.user_id === userId);
    },
    add: async (userId: string, placeId: string): Promise<FavoriteRecord> => {
      if (this.mode === 'postgresql') {
        const id = `fav-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const sql = `
          INSERT INTO favorites (id, user_id, place_id, created_at)
          VALUES ($1, $2, $3, NOW())
          ON CONFLICT (user_id, place_id) DO UPDATE SET user_id = EXCLUDED.user_id
          RETURNING *;
        `;
        const rows = await this.query(sql, [id, userId, placeId]);
        return this.mapFavorite(rows[0]);
      }

      const existing = Object.values(this.data.favorites).find((f) => f.user_id === userId && f.place_id === placeId);
      if (existing) return existing;

      const record: FavoriteRecord = {
        id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: userId,
        place_id: placeId,
        created_at: new Date().toISOString(),
      };
      this.data.favorites[record.id] = record;
      this.persist();
      return record;
    },
    remove: async (userId: string, placeId: string): Promise<boolean> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query(
          'DELETE FROM favorites WHERE user_id = $1 AND (place_id = $2 OR id = $2) RETURNING id',
          [userId, placeId]
        );
        return rows.length > 0;
      }

      const match = Object.values(this.data.favorites).find(
        (f) => f.user_id === userId && (f.place_id === placeId || f.id === placeId)
      );
      if (!match) return false;
      delete this.data.favorites[match.id];
      this.persist();
      return true;
    },
    isFavorite: async (userId: string, placeId: string): Promise<boolean> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT 1 FROM favorites WHERE user_id = $1 AND place_id = $2 LIMIT 1', [userId, placeId]);
        return rows.length > 0;
      }
      return Boolean(Object.values(this.data.favorites).find((f) => f.user_id === userId && f.place_id === placeId));
    },
  };

  // -------------------------------------------------------------
  // 11. ITINERARIES REPOSITORY
  // -------------------------------------------------------------
  public itineraries = {
    findAll: async (params?: { userId?: string; city?: string; isPublic?: boolean }): Promise<ItineraryRecord[]> => {
      if (this.mode === 'postgresql') {
        const conditions: string[] = [];
        const queryParams: any[] = [];
        let pIndex = 1;

        if (params?.userId) {
          conditions.push(`user_id = $${pIndex++}`);
          queryParams.push(params.userId);
        }
        if (params?.city) {
          conditions.push(`(LOWER(city) = $${pIndex} OR LOWER(destination) = $${pIndex})`);
          queryParams.push(params.city.toLowerCase());
          pIndex++;
        }
        if (params?.isPublic !== undefined) {
          conditions.push(`is_public = $${pIndex++}`);
          queryParams.push(params.isPublic);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const rows = await this.query(`SELECT * FROM itineraries ${whereClause} ORDER BY created_at DESC;`, queryParams);
        return rows.map((r) => this.mapItinerary(r));
      }

      let list = Object.values(this.data.itineraries);
      if (params?.userId) list = list.filter((i) => i.user_id === params.userId);
      if (params?.city)
        list = list.filter(
          (i) => i.city?.toLowerCase() === params.city?.toLowerCase() || i.destination?.toLowerCase() === params.city?.toLowerCase()
        );
      if (params?.isPublic !== undefined) list = list.filter((i) => i.is_public === params.isPublic);
      return list;
    },

    listByUser: async (userId: string): Promise<ItineraryRecord[]> => {
      return this.itineraries.findAll({ userId });
    },

    findByUser: async (userId: string): Promise<ItineraryRecord[]> => {
      return this.itineraries.findAll({ userId });
    },

    findById: async (id: string): Promise<ItineraryRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM itineraries WHERE id = $1', [id]);
        return rows[0] ? this.mapItinerary(rows[0]) : null;
      }
      return this.data.itineraries[id] || null;
    },

    findFullById: async (
      id: string
    ): Promise<(ItineraryRecord & { days: (ItineraryDayRecord & { stops: ItineraryStopRecord[] })[] }) | null> => {
      if (this.mode === 'postgresql') {
        const it = await this.itineraries.findById(id);
        if (!it) return null;

        const dayRows = await this.query('SELECT * FROM itinerary_days WHERE itinerary_id = $1 ORDER BY day_number ASC', [id]);
        const stopRows = await this.query('SELECT * FROM itinerary_stops WHERE itinerary_id = $1 ORDER BY stop_order ASC', [id]);

        const days = dayRows.map((d) => this.mapItineraryDay(d));
        const stops = stopRows.map((s) => this.mapItineraryStop(s));

        const fullDays = days.map((d) => {
          const matchedStops = stops.filter((s) => s.day_id === d.id);
          return { ...d, stops: matchedStops };
        });

        return { ...it, days: fullDays };
      }

      const it = this.data.itineraries[id];
      if (!it) return null;

      const days = Object.values(this.data.itinerary_days)
        .filter((d) => d.itinerary_id === id)
        .sort((a, b) => a.day_number - b.day_number);

      const fullDays = days.map((d) => {
        const stops = Object.values(this.data.itinerary_stops)
          .filter((s) => s.day_id === d.id)
          .sort((a, b) => a.stop_order - b.stop_order);
        return { ...d, stops };
      });

      return { ...it, days: fullDays };
    },

    create: async (
      record: ItineraryRecord,
      days?: Array<
        Omit<ItineraryDayRecord, 'id' | 'itinerary_id' | 'created_at'> & {
          stops?: Array<Omit<ItineraryStopRecord, 'id' | 'day_id' | 'itinerary_id' | 'created_at'>>;
        }
      >
    ): Promise<ItineraryRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO itineraries (
            id, user_id, title, destination, city, state, days_count, pace, budget_level,
            summary, total_cost, start_date, end_date, city_ids, is_public, places_count,
            total_distance_km, estimated_budget, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9,
            $10, $11, $12, $13, $14, $15, $16,
            $17, $18, $19, $20
          ) RETURNING *;
        `;
        const params = [
          record.id,
          record.user_id,
          record.title,
          record.destination,
          record.city || record.destination,
          record.state || null,
          record.days_count || 1,
          record.pace || 'moderate',
          record.budget_level || 'moderate',
          record.summary || null,
          record.total_cost || 0,
          record.start_date || null,
          record.end_date || null,
          JSON.stringify(record.city_ids || []),
          Boolean(record.is_public),
          record.places_count || 0,
          record.total_distance_km || 0,
          record.estimated_budget || 0,
          record.created_at || new Date().toISOString(),
          record.updated_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        const createdItinerary = this.mapItinerary(rows[0]);

        if (days && Array.isArray(days)) {
          for (let dIdx = 0; dIdx < days.length; dIdx++) {
            const d = days[dIdx];
            const dayId = `day-${record.id}-${d.day_number || dIdx + 1}`;
            await this.query(
              `INSERT INTO itinerary_days (id, itinerary_id, day_number, area_title, theme, notes, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7);`,
              [dayId, record.id, d.day_number || dIdx + 1, d.area_title || `Day ${dIdx + 1}`, d.theme || null, d.notes || null, new Date().toISOString()]
            );

            if (d.stops && Array.isArray(d.stops)) {
              for (let sIdx = 0; sIdx < d.stops.length; sIdx++) {
                const s = d.stops[sIdx];
                const stopId = `stop-${dayId}-${s.stop_order || sIdx + 1}`;
                await this.query(
                  `INSERT INTO itinerary_stops (
                    id, day_id, itinerary_id, place_id, place_name, stop_order, arrival_time,
                    duration_minutes, travel_mode, travel_duration_minutes, travel_distance_km,
                    estimated_cost, notes, created_at
                  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
                  [
                    stopId,
                    dayId,
                    record.id,
                    s.place_id || null,
                    s.place_name,
                    s.stop_order || sIdx + 1,
                    s.arrival_time || null,
                    s.duration_minutes || 60,
                    s.travel_mode || 'Auto-Rickshaw / Local Transit',
                    s.travel_duration_minutes || 15,
                    s.travel_distance_km || 2.0,
                    s.estimated_cost || 50,
                    s.notes || null,
                    new Date().toISOString(),
                  ]
                );
              }
            }
          }
        }

        return createdItinerary;
      }

      // JSON Mode
      this.data.itineraries[record.id] = { ...record };

      if (days && Array.isArray(days)) {
        days.forEach((d, dIdx) => {
          const dayId = `day-${record.id}-${d.day_number || dIdx + 1}`;
          const dayRecord: ItineraryDayRecord = {
            id: dayId,
            itinerary_id: record.id,
            day_number: d.day_number || dIdx + 1,
            area_title: d.area_title || `Day ${dIdx + 1}`,
            theme: d.theme,
            notes: d.notes,
            created_at: new Date().toISOString(),
          };
          this.data.itinerary_days[dayId] = dayRecord;

          if (d.stops && Array.isArray(d.stops)) {
            d.stops.forEach((s, sIdx) => {
              const stopId = `stop-${dayId}-${s.stop_order || sIdx + 1}`;
              const stopRecord: ItineraryStopRecord = {
                id: stopId,
                day_id: dayId,
                itinerary_id: record.id,
                place_id: s.place_id,
                place_name: s.place_name,
                stop_order: s.stop_order || sIdx + 1,
                arrival_time: s.arrival_time,
                duration_minutes: s.duration_minutes || 60,
                travel_mode: s.travel_mode || 'Auto-Rickshaw / Local Transit',
                travel_duration_minutes: s.travel_duration_minutes || 15,
                travel_distance_km: s.travel_distance_km || 2.0,
                estimated_cost: s.estimated_cost || 50,
                notes: s.notes,
                created_at: new Date().toISOString(),
              };
              this.data.itinerary_stops[stopId] = stopRecord;
            });
          }
        });
      }

      this.persist();
      return record;
    },

    update: async (
      id: string,
      userId: string,
      updates: Partial<ItineraryRecord>,
      newDays?: Array<
        Omit<ItineraryDayRecord, 'id' | 'itinerary_id' | 'created_at'> & {
          stops?: Array<Omit<ItineraryStopRecord, 'id' | 'day_id' | 'itinerary_id' | 'created_at'>>;
        }
      >
    ): Promise<ItineraryRecord | null> => {
      if (this.mode === 'postgresql') {
        const existing = await this.itineraries.findById(id);
        if (!existing || existing.user_id !== userId) return null; // IDOR Protection

        const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };
        const sql = `
          UPDATE itineraries SET
            title = $2, destination = $3, city = $4, state = $5, days_count = $6,
            pace = $7, budget_level = $8, summary = $9, total_cost = $10,
            start_date = $11, end_date = $12, city_ids = $13, is_public = $14,
            places_count = $15, total_distance_km = $16, estimated_budget = $17, updated_at = $18
          WHERE id = $1
          RETURNING *;
        `;
        const params = [
          id,
          merged.title,
          merged.destination,
          merged.city,
          merged.state || null,
          merged.days_count,
          merged.pace,
          merged.budget_level,
          merged.summary || null,
          merged.total_cost,
          merged.start_date || null,
          merged.end_date || null,
          JSON.stringify(merged.city_ids || []),
          merged.is_public,
          merged.places_count || 0,
          merged.total_distance_km || 0,
          merged.estimated_budget || 0,
          merged.updated_at,
        ];
        const rows = await this.query(sql, params);
        const updated = this.mapItinerary(rows[0]);

        if (newDays) {
          await this.query('DELETE FROM itinerary_stops WHERE itinerary_id = $1;', [id]);
          await this.query('DELETE FROM itinerary_days WHERE itinerary_id = $1;', [id]);

          for (let dIdx = 0; dIdx < newDays.length; dIdx++) {
            const d = newDays[dIdx];
            const dayId = `day-${id}-${d.day_number || dIdx + 1}`;
            await this.query(
              `INSERT INTO itinerary_days (id, itinerary_id, day_number, area_title, theme, notes, created_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7);`,
              [dayId, id, d.day_number || dIdx + 1, d.area_title || `Day ${dIdx + 1}`, d.theme || null, d.notes || null, new Date().toISOString()]
            );

            if (d.stops) {
              for (let sIdx = 0; sIdx < d.stops.length; sIdx++) {
                const s = d.stops[sIdx];
                const stopId = `stop-${dayId}-${s.stop_order || sIdx + 1}`;
                await this.query(
                  `INSERT INTO itinerary_stops (
                    id, day_id, itinerary_id, place_id, place_name, stop_order, arrival_time,
                    duration_minutes, travel_mode, travel_duration_minutes, travel_distance_km,
                    estimated_cost, notes, created_at
                  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
                  [
                    stopId,
                    dayId,
                    id,
                    s.place_id || null,
                    s.place_name,
                    s.stop_order || sIdx + 1,
                    s.arrival_time || null,
                    s.duration_minutes || 60,
                    s.travel_mode || 'Auto-Rickshaw / Local Transit',
                    s.travel_duration_minutes || 15,
                    s.travel_distance_km || 2.0,
                    s.estimated_cost || 50,
                    s.notes || null,
                    new Date().toISOString(),
                  ]
                );
              }
            }
          }
        }

        return updated;
      }

      // JSON Mode
      const existing = this.data.itineraries[id];
      if (!existing || existing.user_id !== userId) return null; // IDOR Protection

      const updated: ItineraryRecord = {
        ...existing,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.data.itineraries[id] = updated;

      if (newDays) {
        Object.keys(this.data.itinerary_stops).forEach((sId) => {
          if (this.data.itinerary_stops[sId].itinerary_id === id) {
            delete this.data.itinerary_stops[sId];
          }
        });
        Object.keys(this.data.itinerary_days).forEach((dId) => {
          if (this.data.itinerary_days[dId].itinerary_id === id) {
            delete this.data.itinerary_days[dId];
          }
        });

        newDays.forEach((d, dIdx) => {
          const dayId = `day-${id}-${d.day_number || dIdx + 1}`;
          this.data.itinerary_days[dayId] = {
            id: dayId,
            itinerary_id: id,
            day_number: d.day_number || dIdx + 1,
            area_title: d.area_title || `Day ${dIdx + 1}`,
            theme: d.theme,
            notes: d.notes,
            created_at: new Date().toISOString(),
          };
          if (d.stops) {
            d.stops.forEach((s, sIdx) => {
              const stopId = `stop-${dayId}-${s.stop_order || sIdx + 1}`;
              this.data.itinerary_stops[stopId] = {
                id: stopId,
                day_id: dayId,
                itinerary_id: id,
                place_id: s.place_id,
                place_name: s.place_name,
                stop_order: s.stop_order || sIdx + 1,
                arrival_time: s.arrival_time,
                duration_minutes: s.duration_minutes || 60,
                travel_mode: s.travel_mode || 'Auto-Rickshaw / Local Transit',
                travel_duration_minutes: s.travel_duration_minutes || 15,
                travel_distance_km: s.travel_distance_km || 2.0,
                estimated_cost: s.estimated_cost || 50,
                notes: s.notes,
                created_at: new Date().toISOString(),
              };
            });
          }
        });
      }

      this.persist();
      return updated;
    },

    delete: async (id: string, userId: string): Promise<boolean> => {
      if (this.mode === 'postgresql') {
        const existing = await this.itineraries.findById(id);
        if (!existing || existing.user_id !== userId) return false; // IDOR Protection

        const rows = await this.query('DELETE FROM itineraries WHERE id = $1 RETURNING id;', [id]);
        return rows.length > 0;
      }

      const existing = this.data.itineraries[id];
      if (!existing || existing.user_id !== userId) return false; // IDOR Protection

      delete this.data.itineraries[id];
      Object.keys(this.data.itinerary_stops).forEach((sId) => {
        if (this.data.itinerary_stops[sId].itinerary_id === id) {
          delete this.data.itinerary_stops[sId];
        }
      });
      Object.keys(this.data.itinerary_days).forEach((dId) => {
        if (this.data.itinerary_days[dId].itinerary_id === id) {
          delete this.data.itinerary_days[dId];
        }
      });

      this.persist();
      return true;
    },
  };

  // Backwards-compatible alias for existing trips router
  public trips = this.itineraries;

  // -------------------------------------------------------------
  // 12. ITINERARY DAYS & STOPS REPOSITORIES
  // -------------------------------------------------------------
  public itineraryDays = {
    findByItinerary: async (itineraryId: string): Promise<ItineraryDayRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM itinerary_days WHERE itinerary_id = $1 ORDER BY day_number ASC;', [itineraryId]);
        return rows.map((r) => this.mapItineraryDay(r));
      }
      return Object.values(this.data.itinerary_days)
        .filter((d) => d.itinerary_id === itineraryId)
        .sort((a, b) => a.day_number - b.day_number);
    },
    create: async (record: ItineraryDayRecord): Promise<ItineraryDayRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO itinerary_days (id, itinerary_id, day_number, area_title, theme, notes, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.itinerary_id,
          record.day_number,
          record.area_title,
          record.theme || null,
          record.notes || null,
          record.created_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapItineraryDay(rows[0]);
      }

      this.data.itinerary_days[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  public itineraryStops = {
    findByDay: async (dayId: string): Promise<ItineraryStopRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM itinerary_stops WHERE day_id = $1 ORDER BY stop_order ASC;', [dayId]);
        return rows.map((r) => this.mapItineraryStop(r));
      }
      return Object.values(this.data.itinerary_stops)
        .filter((s) => s.day_id === dayId)
        .sort((a, b) => a.stop_order - b.stop_order);
    },
    findByItinerary: async (itineraryId: string): Promise<ItineraryStopRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM itinerary_stops WHERE itinerary_id = $1 ORDER BY stop_order ASC;', [itineraryId]);
        return rows.map((r) => this.mapItineraryStop(r));
      }
      return Object.values(this.data.itinerary_stops)
        .filter((s) => s.itinerary_id === itineraryId)
        .sort((a, b) => a.stop_order - b.stop_order);
    },
    create: async (record: ItineraryStopRecord): Promise<ItineraryStopRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO itinerary_stops (
            id, day_id, itinerary_id, place_id, place_name, stop_order, arrival_time,
            duration_minutes, travel_mode, travel_duration_minutes, travel_distance_km,
            estimated_cost, notes, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.day_id,
          record.itinerary_id,
          record.place_id || null,
          record.place_name,
          record.stop_order,
          record.arrival_time || null,
          record.duration_minutes || 60,
          record.travel_mode || 'Auto-Rickshaw / Local Transit',
          record.travel_duration_minutes || 15,
          record.travel_distance_km || 2.0,
          record.estimated_cost || 50,
          record.notes || null,
          record.created_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapItineraryStop(rows[0]);
      }

      this.data.itinerary_stops[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // 13. AI SESSIONS, MESSAGES & GROUNDINGS REPOSITORIES
  // -------------------------------------------------------------
  public aiSessions = {
    findById: async (id: string): Promise<AISessionRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM ai_sessions WHERE id = $1;', [id]);
        return rows[0] ? this.mapAISession(rows[0]) : null;
      }
      return this.data.ai_sessions[id] || null;
    },
    findByUser: async (userId: string): Promise<AISessionRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM ai_sessions WHERE user_id = $1 ORDER BY updated_at DESC;', [userId]);
        return rows.map((r) => this.mapAISession(r));
      }
      return Object.values(this.data.ai_sessions).filter((s) => s.user_id === userId);
    },
    create: async (record: AISessionRecord): Promise<AISessionRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO ai_sessions (id, user_id, title, context_json, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.user_id || null,
          record.title,
          record.context_json || null,
          record.created_at || new Date().toISOString(),
          record.updated_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapAISession(rows[0]);
      }

      this.data.ai_sessions[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  public aiMessages = {
    findBySession: async (sessionId: string): Promise<AIMessageRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM ai_messages WHERE session_id = $1 ORDER BY created_at ASC;', [sessionId]);
        return rows.map((r) => this.mapAIMessage(r));
      }
      return Object.values(this.data.ai_messages)
        .filter((m) => m.session_id === sessionId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    },
    create: async (record: AIMessageRecord): Promise<AIMessageRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO ai_messages (id, session_id, role, content, tool_calls_json, metadata_json, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.session_id,
          record.role,
          record.content,
          record.tool_calls_json || null,
          record.metadata_json || null,
          record.created_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapAIMessage(rows[0]);
      }

      this.data.ai_messages[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  public aiGroundings = {
    findByMessage: async (messageId: string): Promise<AIGroundingRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM ai_grounding_records WHERE message_id = $1;', [messageId]);
        return rows.map((r) => this.mapAIGrounding(r));
      }
      return Object.values(this.data.ai_groundings).filter((g) => g.message_id === messageId);
    },
    findBySession: async (sessionId: string): Promise<AIGroundingRecord[]> => {
      if (this.mode === 'postgresql') {
        const sql = `
          SELECT g.* FROM ai_grounding_records g
          JOIN ai_messages m ON g.message_id = m.id
          WHERE m.session_id = $1
          ORDER BY g.created_at ASC;
        `;
        const rows = await this.query(sql, [sessionId]);
        return rows.map((r) => this.mapAIGrounding(r));
      }
      const msgIds = new Set(
        Object.values(this.data.ai_messages)
          .filter((m) => m.session_id === sessionId)
          .map((m) => m.id)
      );
      return Object.values(this.data.ai_groundings).filter((g) => msgIds.has(g.message_id));
    },
    create: async (record: AIGroundingRecord): Promise<AIGroundingRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO ai_grounding_records (
            id, message_id, place_id, fact_id, field_name, confidence, source_name, source_url, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.message_id,
          record.place_id || null,
          record.fact_id || null,
          record.field_name,
          record.confidence,
          record.source_name,
          record.source_url,
          record.created_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapAIGrounding(rows[0]);
      }

      this.data.ai_groundings[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // 14. CITIZEN REPORTS & STEWARDSHIP REPOSITORY
  // -------------------------------------------------------------
  public reports = {
    findAll: async (params?: {
      placeId?: string;
      city?: string;
      status?: string;
      severity?: string;
      userId?: string;
    }): Promise<CitizenReportRecord[]> => {
      if (this.mode === 'postgresql') {
        const conditions: string[] = [];
        const queryParams: any[] = [];
        let pIndex = 1;

        if (params?.placeId) {
          conditions.push(`place_id = $${pIndex++}`);
          queryParams.push(params.placeId);
        }
        if (params?.city) {
          conditions.push(`LOWER(city) LIKE $${pIndex++}`);
          queryParams.push(`%${params.city.toLowerCase()}%`);
        }
        if (params?.status) {
          conditions.push(`UPPER(status) = UPPER($${pIndex++})`);
          queryParams.push(params.status);
        }
        if (params?.severity) {
          conditions.push(`LOWER(severity) = LOWER($${pIndex++})`);
          queryParams.push(params.severity);
        }
        if (params?.userId) {
          conditions.push(`user_id = $${pIndex++}`);
          queryParams.push(params.userId);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const rows = await this.query(`SELECT * FROM citizen_reports ${whereClause} ORDER BY created_at DESC;`, queryParams);
        return rows.map((r) => this.mapCitizenReport(r));
      }

      let list = Object.values(this.data.reports);
      if (params?.placeId) list = list.filter((r) => r.place_id === params.placeId);
      if (params?.city) list = list.filter((r) => r.city?.toLowerCase().includes(params.city!.toLowerCase()));
      if (params?.status) list = list.filter((r) => r.status.toUpperCase() === params.status?.toUpperCase());
      if (params?.severity) list = list.filter((r) => r.severity?.toLowerCase() === params.severity?.toLowerCase());
      if (params?.userId) list = list.filter((r) => r.user_id === params.userId);
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },

    findById: async (id: string): Promise<CitizenReportRecord | null> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM citizen_reports WHERE id = $1;', [id]);
        return rows[0] ? this.mapCitizenReport(rows[0]) : null;
      }
      return this.data.reports[id] || null;
    },

    create: async (record: CitizenReportRecord): Promise<CitizenReportRecord> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO citizen_reports (
            id, place_id, place_name, city, reported_by, user_id, issue_type,
            title, description, severity, status, media_url, resolution_notes, resolved_by,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING *;
        `;
        const params = [
          record.id,
          record.place_id || null,
          record.place_name || null,
          record.city || null,
          record.reported_by,
          record.user_id || null,
          record.issue_type,
          record.title || null,
          record.description,
          record.severity || 'medium',
          record.status || 'PENDING',
          record.media_url || null,
          record.resolution_notes || null,
          record.resolved_by || null,
          record.created_at || new Date().toISOString(),
          record.updated_at || new Date().toISOString(),
        ];
        const rows = await this.query(sql, params);
        return this.mapCitizenReport(rows[0]);
      }

      this.data.reports[record.id] = { ...record };
      this.persist();
      return record;
    },

    updateStatus: async (
      id: string,
      status: CitizenReportRecord['status'],
      actorId: string,
      resolutionNotes?: string
    ): Promise<CitizenReportRecord | null> => {
      if (this.mode === 'postgresql') {
        const existing = await this.reports.findById(id);
        if (!existing) return null;

        const prevStatus = existing.status;
        const resolvedBy = status === 'RESOLVED' || status === 'REJECTED' ? actorId : existing.resolved_by || null;
        const now = new Date().toISOString();

        const sql = `
          UPDATE citizen_reports SET
            status = $2,
            resolution_notes = COALESCE($3, resolution_notes),
            resolved_by = $4,
            updated_at = $5
          WHERE id = $1
          RETURNING *;
        `;
        const rows = await this.query(sql, [id, status, resolutionNotes || null, resolvedBy, now]);
        const updated = rows[0] ? this.mapCitizenReport(rows[0]) : null;

        // Log audit trail
        await this.audit.log({
          id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          actor_id: actorId,
          action: 'UPDATE_REPORT_STATUS',
          entity_type: 'heritage_report',
          entity_id: id,
          from_value: { status: prevStatus },
          to_value: { status, resolution_notes: resolutionNotes },
          created_at: now,
        });

        return updated;
      }

      const existing = this.data.reports[id];
      if (!existing) return null;
      const prevStatus = existing.status;
      existing.status = status;
      if (resolutionNotes) existing.resolution_notes = resolutionNotes;
      if (status === 'RESOLVED' || status === 'REJECTED') existing.resolved_by = actorId;
      existing.updated_at = new Date().toISOString();
      this.data.reports[id] = existing;

      // Log to audit log
      await this.audit.log({
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        actor_id: actorId,
        action: 'UPDATE_REPORT_STATUS',
        entity_type: 'heritage_report',
        entity_id: id,
        from_value: { status: prevStatus },
        to_value: { status, resolution_notes: resolutionNotes },
        created_at: new Date().toISOString(),
      });

      this.persist();
      return existing;
    },

    calculateDestinationHealth: async (placeId: string): Promise<DestinationHealthRecord> => {
      let placeName = placeId;
      let placeCity = 'India';
      let reportsList: CitizenReportRecord[] = [];

      if (this.mode === 'postgresql') {
        const placeRows = await this.query('SELECT name, city_id FROM places WHERE id = $1;', [placeId]);
        if (placeRows[0]) {
          placeName = placeRows[0].name;
          placeCity = placeRows[0].city_id || 'India';
        }
        reportsList = await this.reports.findAll({ placeId });
      } else {
        const place = Object.values(this.data.places).find((p) => p.id === placeId);
        placeName = place?.name || placeId;
        placeCity = place?.city_id || 'India';
        reportsList = Object.values(this.data.reports).filter((r) => r.place_id === placeId);
      }

      const openReports = reportsList.filter((r) => r.status !== 'RESOLVED' && r.status !== 'REJECTED');
      const resolvedReports = reportsList.filter((r) => r.status === 'RESOLVED');

      let penalty = 0;
      for (const r of openReports) {
        if (r.severity === 'critical') penalty += 15;
        else if (r.severity === 'high') penalty += 10;
        else if (r.severity === 'medium') penalty += 5;
        else penalty += 2;
      }

      const healthScore = Math.max(20, Math.min(100, 100 - penalty));

      let statusLabel = 'Excellent / Well Maintained';
      if (healthScore < 50) statusLabel = 'Attention Required';
      else if (healthScore < 75) statusLabel = 'Moderate / Action Underway';
      else if (healthScore < 90) statusLabel = 'Good / Minor Maintenance';

      return {
        place_id: placeId,
        place_name: placeName,
        city: placeCity,
        health_score: healthScore,
        open_issues_count: openReports.length,
        resolved_issues_count: resolvedReports.length,
        status_label: statusLabel,
        last_inspected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
  };

  // -------------------------------------------------------------
  // 15. AUDIT LOGS REPOSITORY
  // -------------------------------------------------------------
  public audit = {
    log: async (record: AuditLogRecord): Promise<void> => {
      if (this.mode === 'postgresql') {
        const sql = `
          INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, from_value, to_value, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `;
        const params = [
          record.id,
          record.actor_id || null,
          record.action,
          record.entity_type,
          record.entity_id,
          record.from_value ? JSON.stringify(record.from_value) : null,
          record.to_value ? JSON.stringify(record.to_value) : null,
          record.created_at || new Date().toISOString(),
        ];
        await this.query(sql, params);
        return;
      }

      this.data.audit_logs[record.id] = { ...record };
      this.persist();
    },

    findAll: async (limit = 100): Promise<AuditLogRecord[]> => {
      if (this.mode === 'postgresql') {
        const rows = await this.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1;', [limit]);
        return rows.map((r) => this.mapAuditLog(r));
      }

      return Object.values(this.data.audit_logs)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    },
  };

  public audit_logs = {
    create: async (record: {
      user_id?: string;
      actor_id?: string;
      action: string;
      entity_type: string;
      entity_id: string;
      details?: any;
      from_value?: any;
      to_value?: any;
    }): Promise<AuditLogRecord> => {
      const fullRecord: AuditLogRecord = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        actor_id: record.actor_id || record.user_id,
        action: record.action,
        entity_type: record.entity_type,
        entity_id: record.entity_id,
        from_value: record.from_value,
        to_value: record.to_value || record.details,
        created_at: new Date().toISOString(),
      };
      await this.audit.log(fullRecord);
      return fullRecord;
    },
    findAll: async (limit = 100): Promise<AuditLogRecord[]> => {
      return this.audit.findAll(limit);
    },
  };
}

export const db = new DatabaseManager();
