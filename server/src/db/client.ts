import fs from 'fs';
import path from 'path';
import {
  UserRecord,
  StateRecord,
  CityRecord,
  PlaceRecord,
  TransitNodeRecord,
  ItineraryRecord,
  FavoriteRecord,
  CitizenReportRecord,
  AuditLogRecord,
  PlaceSourceRecord,
  PlaceFactRecord,
  ImageLicenseRecord,
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
  // PLACES REPOSITORY
  // -------------------------------------------------------------
  public places = {
    findAll: async (filters?: {
      stateId?: string;
      cityId?: string;
      category?: string;
      confidence?: string;
      data_confidence?: string;
      limit?: number;
      offset?: number;
    }): Promise<{ places: PlaceRecord[]; total: number }> => {
      let list = Object.values(this.data.places);
      if (filters?.stateId) {
        list = list.filter((p) => p.state_id?.toLowerCase() === filters.stateId?.toLowerCase());
      }
      if (filters?.cityId) {
        list = list.filter((p) => p.city_id?.toLowerCase() === filters.cityId?.toLowerCase());
      }
      if (filters?.category) {
        list = list.filter((p) => p.category.toLowerCase() === filters.category?.toLowerCase());
      }
      const targetConfidence = filters?.confidence || filters?.data_confidence;
      if (targetConfidence) {
        list = list.filter((p) => p.data_confidence.toLowerCase() === targetConfidence.toLowerCase());
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
      const withDistance = Object.values(this.data.places).map((p) => {
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
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.summary.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.city_id?.toLowerCase().includes(q) ||
            p.state_id?.toLowerCase().includes(q)
        )
        .slice(0, limit);
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
  };

  public cities = {
    findAll: async (): Promise<CityRecord[]> => {
      return Object.values(this.data.cities);
    },
    findById: async (id: string): Promise<CityRecord | null> => {
      return this.data.cities[id] || null;
    },
    findByStateId: async (stateId: string): Promise<CityRecord[]> => {
      return Object.values(this.data.cities).filter((c) => c.state_id === stateId);
    },
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
  // TRIPS / ITINERARIES REPOSITORY (Scoped to user_id)
  // -------------------------------------------------------------
  public trips = {
    listByUser: async (userId: string): Promise<ItineraryRecord[]> => {
      return Object.values(this.data.itineraries).filter((t) => t.user_id === userId);
    },
    findById: async (id: string): Promise<ItineraryRecord | null> => {
      return this.data.itineraries[id] || null;
    },
    create: async (record: ItineraryRecord): Promise<ItineraryRecord> => {
      this.data.itineraries[record.id] = { ...record };
      this.persist();
      return record;
    },
    update: async (id: string, userId: string, updates: Partial<ItineraryRecord>): Promise<ItineraryRecord | null> => {
      const existing = this.data.itineraries[id];
      if (!existing || existing.user_id !== userId) return null; // IDOR Protection
      const updated: ItineraryRecord = {
        ...existing,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      this.data.itineraries[id] = updated;
      this.persist();
      return updated;
    },
    delete: async (id: string, userId: string): Promise<boolean> => {
      const existing = this.data.itineraries[id];
      if (!existing || existing.user_id !== userId) return false; // IDOR Protection
      delete this.data.itineraries[id];
      this.persist();
      return true;
    },
  };

  // -------------------------------------------------------------
  // CITIZEN REPORTS REPOSITORY
  // -------------------------------------------------------------
  public reports = {
    findAll: async (): Promise<CitizenReportRecord[]> => {
      return Object.values(this.data.reports);
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
      actorId: string
    ): Promise<CitizenReportRecord | null> => {
      const existing = this.data.reports[id];
      if (!existing) return null;
      const prevStatus = existing.status;
      existing.status = status;
      existing.updated_at = new Date().toISOString();
      this.data.reports[id] = existing;

      // Log to audit log
      await this.audit.log({
        id: `audit-${Date.now()}`,
        actor_id: actorId,
        action: 'UPDATE_REPORT_STATUS',
        entity_type: 'heritage_report',
        entity_id: id,
        from_value: { status: prevStatus },
        to_value: { status },
        created_at: new Date().toISOString(),
      });

      this.persist();
      return existing;
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
      return Object.values(this.data.audit_logs).slice(0, limit);
    },
  };
}

export const db = new DatabaseManager();
