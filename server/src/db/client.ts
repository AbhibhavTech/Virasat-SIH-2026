import fs from 'fs';
import path from 'path';
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

class DatabaseManager {
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

  public async init(): Promise<void> {
    if (this.isInitialized) return;

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

    this.isInitialized = true;

    // If fresh / empty or missing place_facts from Phase 2, auto-seed
    if (Object.keys(this.data.places).length === 0 || Object.keys(this.data.place_facts).length === 0) {
      await this.seedFromStaticFiles();
    }
  }

  private persist(): void {
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
  // USERS REPOSITORY
  // -------------------------------------------------------------
  public users = {
    findById: async (id: string): Promise<UserRecord | null> => {
      return this.data.users[id] || null;
    },
    findByEmail: async (email: string): Promise<UserRecord | null> => {
      const lower = email.toLowerCase().trim();
      const match = Object.values(this.data.users).find(
        (u) => u.email.toLowerCase() === lower
      );
      return match || null;
    },
    findByGoogleId: async (googleId: string): Promise<UserRecord | null> => {
      const match = Object.values(this.data.users).find((u) => u.google_id === googleId);
      return match || null;
    },
    create: async (record: UserRecord): Promise<UserRecord> => {
      this.data.users[record.id] = { ...record };
      this.persist();
      return record;
    },
    update: async (id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> => {
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
      return Object.values(this.data.users);
    },
  };

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
  // PLACES REPOSITORY
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
      let list = Object.values(this.data.places);

      // Public exploration rule: only show 'verified' with Tier 1 (place_specific) or Tier 2 (official_site)
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
        const rawTarget = (filters.cityId || filters.city || '').trim().toLowerCase();
        const slugTarget = rawTarget.replace(/[^a-z0-9]+/g, '-');
        list = list.filter((p) => {
          const cId = (p.city_id || '').toLowerCase().trim();
          const aCity = (p.assigned_city || '').toLowerCase().trim();
          const cName = (p.city || '').toLowerCase().trim();
          return (
            cId === rawTarget ||
            cId === slugTarget ||
            aCity === rawTarget ||
            aCity.replace(/[^a-z0-9]+/g, '-') === slugTarget ||
            cName === rawTarget ||
            cName.replace(/[^a-z0-9]+/g, '-') === slugTarget ||
            (aCity.length > 2 && (rawTarget.includes(aCity) || aCity.includes(rawTarget))) ||
            (cName.length > 2 && (rawTarget.includes(cName) || cName.includes(rawTarget)))
          );
        });
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
            (p.tourist_place?.toLowerCase() || '').includes(q) ||
            (p.assigned_city?.toLowerCase() || '').includes(q) ||
            (p.city?.toLowerCase() || '').includes(q) ||
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
      return this.data.places[id] || this.data.places[id.toLowerCase()] || null;
    },

    findNearby: async (lat: number, lng: number, radiusKm = 50, limit = 20): Promise<PlaceRecord[]> => {
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
      return Object.values(this.data.places)
        .filter((p) => {
          const s = (p.verification_status || 'verified').toLowerCase();
          return (s === 'verified' || s === 'official') && (
            p.name.toLowerCase().includes(q) ||
            p.summary?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.city_id?.toLowerCase().includes(q) ||
            p.state_id?.toLowerCase().includes(q)
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

      // 3. Enforce source requirement and quality tier before verification
      const sourceUrl = record.source_url || (Array.isArray(record.sources) ? record.sources[0]?.source_url : undefined);
      const quality = computeSourceQuality(sourceUrl);
      record.source_quality = quality;

      if (record.verification_status === 'verified') {
        if (quality === 'generic_homepage' || quality === 'missing') {
          throw new Error('VERIFIED FORBIDDEN: Generic homepage URL (like asi.nic.in or whc.unesco.org) cannot be marked as verified. Must be Tier 1 (place_specific deep link) or Tier 2 (official place site).');
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

      this.data.places[cleanRecord.id] = cleanRecord;
      this.persist();
      return cleanRecord;
    },

    update: async (id: string, updates: Partial<PlaceRecord>): Promise<PlaceRecord | null> => {
      const existing = this.data.places[id];
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

      // Source check if marking as verified
      const updatedSourceUrl = merged.source_url || (Array.isArray(merged.sources) ? merged.sources[0]?.source_url : undefined);
      const quality = computeSourceQuality(updatedSourceUrl);
      merged.source_quality = quality;

      if (updates.verification_status === 'verified' || (merged.verification_status === 'verified' && updates.source_url !== undefined)) {
        if (quality === 'generic_homepage' || quality === 'missing') {
          throw new Error('VERIFIED FORBIDDEN: Generic homepage URL (like asi.nic.in or whc.unesco.org) cannot be marked as verified. Must be Tier 1 (place_specific deep link) or Tier 2 (official place site).');
        }
        if (!merged.last_verified_on) {
          merged.last_verified_on = new Date().toISOString().split('T')[0];
        }
      }

      this.data.places[id] = merged;
      this.persist();
      return merged;
    },

    delete: async (id: string): Promise<boolean> => {
      if (!this.data.places[id]) return false;
      delete this.data.places[id];
      this.persist();
      return true;
    },
  };

  // -------------------------------------------------------------
  // STATES & CITIES REPOSITORIES
  // -------------------------------------------------------------
  public states = {
    findAll: async (): Promise<StateRecord[]> => {
      return Object.values(this.data.states);
    },
    findById: async (id: string): Promise<StateRecord | null> => {
      return this.data.states[id] || null;
    },
    create: async (record: StateRecord): Promise<StateRecord> => {
      if (this.data.states[record.id]) {
        throw new Error(`State with id "${record.id}" already exists.`);
      }
      this.data.states[record.id] = { ...record };
      this.persist();
      return record;
    },
    update: async (id: string, updates: Partial<StateRecord>): Promise<StateRecord | null> => {
      const existing = this.data.states[id];
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      this.data.states[id] = updated;
      this.persist();
      return updated;
    },
    delete: async (id: string): Promise<boolean> => {
      if (!this.data.states[id]) return false;
      delete this.data.states[id];
      this.persist();
      return true;
    },
  };

  public cities = {
    findAll: async (): Promise<CityRecord[]> => {
      return Object.values(this.data.cities);
    },
    findById: async (id: string): Promise<CityRecord | null> => {
      return this.data.cities[id] || null;
    },
    findByStateId: async (stateId: string): Promise<CityRecord[]> => {
      return Object.values(this.data.cities).filter((c) => c.state_id?.toLowerCase() === stateId.toLowerCase());
    },
    create: async (record: CityRecord): Promise<CityRecord> => {
      // 1. Validate coordinates
      const lat = record.lat ?? record.latitude;
      const lng = record.lng ?? record.longitude;
      if (lat !== undefined && lng !== undefined) {
        this.validateCoordinates(lat, lng);
      }

      // 2. Prevent duplicate city names inside the same state
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
      const existing = this.data.cities[id];
      if (!existing) return null;

      const merged = { ...existing, ...updates };
      if (updates.name || updates.state_id) {
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

      this.data.cities[id] = merged;
      this.persist();
      return merged;
    },
    delete: async (id: string): Promise<boolean> => {
      if (!this.data.cities[id]) return false;
      delete this.data.cities[id];
      this.persist();
      return true;
    },
  };

  // -------------------------------------------------------------
  // ADMIN METRICS
  // -------------------------------------------------------------
  public getAdminMetrics = async () => {
    const allPlaces = Object.values(this.data.places);
    const allCities = Object.values(this.data.cities);
    const allStates = Object.values(this.data.states);

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
        Object.values(this.data.place_sources).some((s) => s.place_id === p.id);
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
  // TRANSIT NODES REPOSITORY
  // -------------------------------------------------------------
  public transit = {
    findAll: async (): Promise<TransitNodeRecord[]> => {
      return Object.values(this.data.transit_nodes);
    },
    findByCode: async (code: string): Promise<TransitNodeRecord | null> => {
      const match = Object.values(this.data.transit_nodes).find(
        (t) => t.code.toUpperCase() === code.toUpperCase()
      );
      return match || null;
    },
    findById: async (id: string): Promise<TransitNodeRecord | null> => {
      return this.data.transit_nodes[id] || null;
    },
  };

  // -------------------------------------------------------------
  // PLACE SOURCES REPOSITORY (Section XI.2)
  // -------------------------------------------------------------
  public placeSources = {
    findAll: async (): Promise<PlaceSourceRecord[]> => {
      return Object.values(this.data.place_sources);
    },
    findById: async (id: string): Promise<PlaceSourceRecord | null> => {
      return this.data.place_sources[id] || null;
    },
    create: async (record: PlaceSourceRecord): Promise<PlaceSourceRecord> => {
      this.data.place_sources[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // PLACE FACTS REPOSITORY (Field-level provenance, Section XI.1 & XV.2)
  // -------------------------------------------------------------
  public placeFacts = {
    findByPlaceId: async (placeId: string): Promise<PlaceFactRecord[]> => {
      return Object.values(this.data.place_facts).filter((f) => f.place_id === placeId);
    },
    create: async (record: PlaceFactRecord): Promise<PlaceFactRecord> => {
      this.data.place_facts[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // IMAGE LICENSES REPOSITORY (Section XI.4 & XV.2)
  // -------------------------------------------------------------
  public imageLicenses = {
    findByUrl: async (imageUrl: string): Promise<ImageLicenseRecord | null> => {
      return Object.values(this.data.image_licenses).find((l) => l.image_url === imageUrl) || null;
    },
    create: async (record: ImageLicenseRecord): Promise<ImageLicenseRecord> => {
      this.data.image_licenses[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // FAVORITES REPOSITORY (Scoped to user_id, IDOR protected)
  // -------------------------------------------------------------
  public favorites = {
    listByUser: async (userId: string): Promise<FavoriteRecord[]> => {
      return Object.values(this.data.favorites).filter((f) => f.user_id === userId);
    },
    add: async (userId: string, placeId: string): Promise<FavoriteRecord> => {
      const existing = Object.values(this.data.favorites).find(
        (f) => f.user_id === userId && f.place_id === placeId
      );
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
      const match = Object.values(this.data.favorites).find(
        (f) => f.user_id === userId && (f.place_id === placeId || f.id === placeId)
      );
      if (!match) return false;
      delete this.data.favorites[match.id];
      this.persist();
      return true;
    },
    isFavorite: async (userId: string, placeId: string): Promise<boolean> => {
      return Boolean(
        Object.values(this.data.favorites).find(
          (f) => f.user_id === userId && f.place_id === placeId
        )
      );
    },
  };

  // -------------------------------------------------------------
  // ITINERARIES & DAYS / STOPS REPOSITORY (Section XV.2 & XXI)
  // -------------------------------------------------------------
  public itineraries = {
    findAll: async (params?: { userId?: string; city?: string; isPublic?: boolean }): Promise<ItineraryRecord[]> => {
      let list = Object.values(this.data.itineraries);
      if (params?.userId) list = list.filter((i) => i.user_id === params.userId);
      if (params?.city) list = list.filter((i) => i.city?.toLowerCase() === params.city?.toLowerCase() || i.destination?.toLowerCase() === params.city?.toLowerCase());
      if (params?.isPublic !== undefined) list = list.filter((i) => i.is_public === params.isPublic);
      return list;
    },
    listByUser: async (userId: string): Promise<ItineraryRecord[]> => {
      return Object.values(this.data.itineraries).filter((t) => t.user_id === userId);
    },
    findByUser: async (userId: string): Promise<ItineraryRecord[]> => {
      return Object.values(this.data.itineraries).filter((t) => t.user_id === userId);
    },
    findById: async (id: string): Promise<ItineraryRecord | null> => {
      return this.data.itineraries[id] || null;
    },
    findFullById: async (id: string): Promise<(ItineraryRecord & { days: (ItineraryDayRecord & { stops: ItineraryStopRecord[] })[] }) | null> => {
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
      days?: Array<Omit<ItineraryDayRecord, 'id' | 'itinerary_id' | 'created_at'> & { stops?: Array<Omit<ItineraryStopRecord, 'id' | 'day_id' | 'itinerary_id' | 'created_at'>> }>
    ): Promise<ItineraryRecord> => {
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
      newDays?: Array<Omit<ItineraryDayRecord, 'id' | 'itinerary_id' | 'created_at'> & { stops?: Array<Omit<ItineraryStopRecord, 'id' | 'day_id' | 'itinerary_id' | 'created_at'>> }>
    ): Promise<ItineraryRecord | null> => {
      const existing = this.data.itineraries[id];
      if (!existing || existing.user_id !== userId) return null; // IDOR Protection

      const updated: ItineraryRecord = {
        ...existing,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.data.itineraries[id] = updated;

      if (newDays) {
        // Cascade delete old days and stops
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

        // Insert new days and stops
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
      const existing = this.data.itineraries[id];
      if (!existing || existing.user_id !== userId) return false; // IDOR Protection

      delete this.data.itineraries[id];
      // Cascade delete child days and stops
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
  // ITINERARY DAYS & STOPS REPOSITORIES
  // -------------------------------------------------------------
  public itineraryDays = {
    findByItinerary: async (itineraryId: string): Promise<ItineraryDayRecord[]> => {
      return Object.values(this.data.itinerary_days)
        .filter((d) => d.itinerary_id === itineraryId)
        .sort((a, b) => a.day_number - b.day_number);
    },
    create: async (record: ItineraryDayRecord): Promise<ItineraryDayRecord> => {
      this.data.itinerary_days[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  public itineraryStops = {
    findByDay: async (dayId: string): Promise<ItineraryStopRecord[]> => {
      return Object.values(this.data.itinerary_stops)
        .filter((s) => s.day_id === dayId)
        .sort((a, b) => a.stop_order - b.stop_order);
    },
    findByItinerary: async (itineraryId: string): Promise<ItineraryStopRecord[]> => {
      return Object.values(this.data.itinerary_stops)
        .filter((s) => s.itinerary_id === itineraryId)
        .sort((a, b) => a.stop_order - b.stop_order);
    },
    create: async (record: ItineraryStopRecord): Promise<ItineraryStopRecord> => {
      this.data.itinerary_stops[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // AI SESSIONS, MESSAGES & GROUNDING REPOSITORY (Section XVI & XX)
  // -------------------------------------------------------------
  public aiSessions = {
    findById: async (id: string): Promise<AISessionRecord | null> => {
      return this.data.ai_sessions[id] || null;
    },
    findByUser: async (userId: string): Promise<AISessionRecord[]> => {
      return Object.values(this.data.ai_sessions).filter((s) => s.user_id === userId);
    },
    create: async (record: AISessionRecord): Promise<AISessionRecord> => {
      this.data.ai_sessions[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  public aiMessages = {
    findBySession: async (sessionId: string): Promise<AIMessageRecord[]> => {
      return Object.values(this.data.ai_messages)
        .filter((m) => m.session_id === sessionId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    },
    create: async (record: AIMessageRecord): Promise<AIMessageRecord> => {
      this.data.ai_messages[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  public aiGroundings = {
    findByMessage: async (messageId: string): Promise<AIGroundingRecord[]> => {
      return Object.values(this.data.ai_groundings).filter((g) => g.message_id === messageId);
    },
    findBySession: async (sessionId: string): Promise<AIGroundingRecord[]> => {
      const msgIds = new Set(
        Object.values(this.data.ai_messages)
          .filter((m) => m.session_id === sessionId)
          .map((m) => m.id)
      );
      return Object.values(this.data.ai_groundings).filter((g) => msgIds.has(g.message_id));
    },
    create: async (record: AIGroundingRecord): Promise<AIGroundingRecord> => {
      this.data.ai_groundings[record.id] = { ...record };
      this.persist();
      return record;
    },
  };

  // -------------------------------------------------------------
  // CITIZEN REPORTS & STEWARDSHIP REPOSITORY (Section XI.3 & XV.2)
  // -------------------------------------------------------------
  public reports = {
    findAll: async (params?: {
      placeId?: string;
      city?: string;
      status?: string;
      severity?: string;
      userId?: string;
    }): Promise<CitizenReportRecord[]> => {
      let list = Object.values(this.data.reports);
      if (params?.placeId) list = list.filter((r) => r.place_id === params.placeId);
      if (params?.city) list = list.filter((r) => r.city?.toLowerCase().includes(params.city!.toLowerCase()));
      if (params?.status) list = list.filter((r) => r.status.toUpperCase() === params.status?.toUpperCase());
      if (params?.severity) list = list.filter((r) => r.severity?.toLowerCase() === params.severity?.toLowerCase());
      if (params?.userId) list = list.filter((r) => r.user_id === params.userId);
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    findById: async (id: string): Promise<CitizenReportRecord | null> => {
      return this.data.reports[id] || null;
    },
    create: async (record: CitizenReportRecord): Promise<CitizenReportRecord> => {
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
      const place = Object.values(this.data.places).find((p) => p.id === placeId);
      const reports = Object.values(this.data.reports).filter((r) => r.place_id === placeId);

      const openReports = reports.filter((r) => r.status !== 'RESOLVED' && r.status !== 'REJECTED');
      const resolvedReports = reports.filter((r) => r.status === 'RESOLVED');

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
        place_name: place?.name || placeId,
        city: place?.city_id || 'India',
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
  // AUDIT LOGS REPOSITORY
  // -------------------------------------------------------------
  public audit = {
    log: async (record: AuditLogRecord): Promise<void> => {
      this.data.audit_logs[record.id] = { ...record };
      this.persist();
    },
    findAll: async (limit = 100): Promise<AuditLogRecord[]> => {
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
