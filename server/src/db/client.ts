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
} from './types';

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
        };
      } catch (err) {
        console.error('[DB] Failed to load local database, initializing fresh store:', err);
      }
    }

    this.isInitialized = true;

    // If fresh / empty, auto-seed from static JSON files
    if (Object.keys(this.data.places).length === 0) {
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

  // -------------------------------------------------------------
  // SEEDING LOGIC (Phase 1 Task 2: data_confidence='unverified')
  // -------------------------------------------------------------
  public async seedFromStaticFiles(): Promise<void> {
    console.log('[DB] Seeding persistent database from JSON files with data_confidence=unverified...');
    const rootDataDir = path.join(process.cwd(), 'data');

    // 1. States
    const statesPath = path.join(rootDataDir, 'states.json');
    if (fs.existsSync(statesPath)) {
      try {
        const statesList = JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
        if (Array.isArray(statesList)) {
          for (const s of statesList) {
            this.data.states[s.id] = {
              id: s.id,
              name: s.name,
              capital: s.capital || '',
              region: s.region || '',
              description: s.description || '',
              hero_image_id: s.hero_image_id,
              created_at: new Date().toISOString(),
            };
          }
        }
      } catch (e) {
        console.error('[DB] Error reading states.json:', e);
      }
    }

    // 2. Cities
    const citiesPath = path.join(rootDataDir, 'cities.json');
    if (fs.existsSync(citiesPath)) {
      try {
        const citiesList = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));
        if (Array.isArray(citiesList)) {
          for (const c of citiesList) {
            this.data.cities[c.id] = {
              id: c.id,
              state_id: c.state_id || '',
              name: c.name,
              lat: Number(c.lat) || 0,
              lng: Number(c.lng) || 0,
              description: c.description || '',
              created_at: new Date().toISOString(),
            };
          }
        }
      } catch (e) {
        console.error('[DB] Error reading cities.json:', e);
      }
    }

    // 3. Places from Master Tourism Database
    const dbPath = path.join(rootDataDir, 'india_tourism_database.json');
    if (fs.existsSync(dbPath)) {
      try {
        const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        if (Array.isArray(dbContent.states)) {
          for (const state of dbContent.states) {
            if (Array.isArray(state.cities)) {
              for (const city of state.cities) {
                const categoryKeys = ['heritage', 'monuments', 'museums', 'tourist_places', 'religious_cultural', 'nature_parks_zoo', 'attractions', 'places'];
                for (const catKey of categoryKeys) {
                  const list = (city as any)[catKey];
                  if (Array.isArray(list)) {
                    for (const attr of list) {
                      const placeId = attr.id || `${city.id}-${attr.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                      const visitingHours = typeof attr.timings === 'string'
                        ? attr.timings
                        : (attr.timings?.opening_time && attr.timings?.closing_time
                            ? `${attr.timings.opening_time} - ${attr.timings.closing_time}`
                            : (attr.visiting_hours || '09:00 - 17:00'));

                      const domesticFee = Number(attr.fees?.domestic ?? attr.entry_fee?.domestic ?? 0);
                      const intlFee = Number(attr.fees?.international ?? attr.entry_fee?.foreigner ?? 0);

                      this.data.places[placeId] = {
                        id: placeId,
                        city_id: city.id,
                        state_id: state.id,
                        name: attr.name,
                        category: attr.category || catKey || 'heritage',
                        summary: attr.summary || attr.historical_significance || attr.description || '',
                        description: attr.description || attr.summary || '',
                        history: attr.history || attr.historical_significance || '',
                        lat: Number(attr.lat || attr.coordinates?.lat || city.coordinates?.lat || 0),
                        lng: Number(attr.lng || attr.coordinates?.lng || city.coordinates?.lng || 0),
                        entry_fee_domestic: isNaN(domesticFee) ? 0 : domesticFee,
                        entry_fee_intl: isNaN(intlFee) ? 0 : intlFee,
                        visiting_hours: visitingHours,
                        heritage_status: attr.heritage_status || 'State Protected',
                        data_confidence: 'unverified', // Per Phase 1 rule: all initial legacy data is UNVERIFIED
                        source_url: attr.source_page || attr.source_url || 'https://asi.nic.in',
                        last_verified_at: undefined,
                        rating: Number(attr.rating) || 4.5,
                        thumbnail_url: attr.image_url || attr.thumbnail_url || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
                        created_at: new Date().toISOString(),
                      };
                    }
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('[DB] Error reading india_tourism_database.json:', e);
      }
    }

    // 4. Railway Stations (Deduplicated)
    const stationsPath = path.join(rootDataDir, 'railway_stations.json');
    if (fs.existsSync(stationsPath)) {
      try {
        const stationsList = JSON.parse(fs.readFileSync(stationsPath, 'utf-8'));
        if (Array.isArray(stationsList)) {
          const seenCodes = new Set<string>();
          for (const stn of stationsList) {
            const code = (stn.code || stn.id).toUpperCase();
            if (seenCodes.has(code)) {
              continue; // Deduplicate to satisfy UNIQUE constraint
            }
            seenCodes.add(code);
            const stnId = stn.id || code.toLowerCase();
            this.data.transit_nodes[stnId] = {
              id: stnId,
              type: 'railway',
              name: stn.name,
              code,
              lat: Number(stn.lat) || 0,
              lng: Number(stn.lng) || 0,
              city_id: stn.city_id,
              is_junction: Boolean(stn.is_junction || stn.isJunction),
              created_at: new Date().toISOString(),
            };
          }
        }
      } catch (e) {
        console.error('[DB] Error reading railway_stations.json:', e);
      }
    }

    // 5. Seed default admin user for initial operations
    const bcrypt = await import('bcryptjs');
    const adminSalt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('AdminVirasat2026!', adminSalt);
    this.data.users['user-admin-1'] = {
      id: 'user-admin-1',
      email: 'admin@virasat.in',
      password_hash: adminHash,
      name: 'Virasat Admin',
      home_city: 'New Delhi',
      auth_provider: 'local',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.persist();
    console.log(`[DB] Seeding complete: ${Object.keys(this.data.states).length} states, ${Object.keys(this.data.cities).length} cities, ${Object.keys(this.data.places).length} places, ${Object.keys(this.data.transit_nodes).length} transit nodes.`);
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
    }
  };

  // -------------------------------------------------------------
  // PLACES REPOSITORY
  // -------------------------------------------------------------
  public places = {
    findAll: async (filters?: {
      stateId?: string;
      cityId?: string;
      category?: string;
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
