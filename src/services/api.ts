import {
  StateItem,
  CityItem,
  PlaceDetail,
  PlaceListResponse,
  PlaceSummary,
  RouteResponse,
  AIChatRequest,
  AIChatResponse,
  ItineraryRequest,
  ItineraryResponse,
  UserProfile,
  OnboardingSurvey,
  FavoriteItem,
  TripItem,
  CityWeather,
  RailwayStationInfo,
  NearbyPlacesResponse,
  PlatformStats,
  MumbaiLocalStation,
  MumbaiLocalRouteResult,
  CulturalItem,
  ArtisanProfile,
  LocalProvider,
  AccessibilityRecord,
  InfrastructureFacility,
  DestinationHealthResponse,
  HeritageConditionReport,
  HeritageCluster,
  CommuterNetwork,
  DatabaseStatusResponse,
  DatabaseCategoryMeta,
  DatabaseRecordsResponse,
  DatabaseRecordQueryOptions,
  DatabaseSyncPayload,
  DatabaseSyncResult,
  EntityImageMetadata,
  LocationSuggestion,
  ReverseGeocodeResponse,
  UserLocationContext,
  VisualIdentificationResult,
  GoogleMapsPlaceInfo,
  HeritageRouteAnalysisResult,
  FestivalItem,
  FestivalLiveInfoResponse,
  FestivalLiveSearchResponse,
  MaharashtraDestination,
  DestinationsResponse,
} from '../types';
import { safeLocalStorage } from '../utils/storage';

const API_BASE_URL = '/api';

export function chatHeaders(): Record<string, string> {
  let owner = safeLocalStorage.getItem('virasat_chat_owner');
  if (!owner) { owner = crypto.randomUUID(); safeLocalStorage.setItem('virasat_chat_owner', owner); }
  const token = safeLocalStorage.getItem('virasat_token');
  return { 'Content-Type': 'application/json', 'X-Virasat-Chat-Owner': owner, ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}
export function aiError(body: any, response?: Response) {
  const header = response?.headers.get('retry-after');
  const seconds = body.retry_after_seconds ?? body.provider_error?.retry_after_seconds ?? (header ? (/^\d+$/.test(header) ? Number(header) : Math.max(0, (Date.parse(header)-Date.now())/1000)) : undefined);
  return Object.assign(new Error(typeof body.error === 'string' ? body.error : body.error?.code || 'AI_UNAVAILABLE'), {
    hostedMessage: body.reply || body.error?.message,
    retryAfterSeconds: Number.isFinite(seconds) ? Math.max(0, Math.ceil(seconds)) : undefined,
    category: body.provider_error?.category,
  });
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = safeLocalStorage.getItem('virasat_token');
  const headers: Record<string, string> = {
    ...chatHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    const error = new Error(`API Error ${res.status}: ${errorBody || res.statusText}`);
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.generation_mode === 'unavailable' && typeof parsed.reply === 'string') Object.assign(error, { hostedMessage: parsed.reply });
    } catch { /* Non-JSON errors keep the existing error handling. */ }
    throw error;
  }

  return res.json();
}

export const api = {
  claimAIConversation: (id: string) => request<any>(`/ai/conversations/${encodeURIComponent(id)}/claim`, { method: 'POST' }),
  listAIConversations: () => request<any>('/ai/conversations'),
  getAIConversation: (id: string) => request<any>(`/ai/conversations/${encodeURIComponent(id)}`),
  deleteAIConversation: (id?: string) => request<any>(`/ai/conversations${id ? '/' + encodeURIComponent(id) : ''}`, { method: 'DELETE' }),
  clearAILocation: (id: string) => request<any>(`/ai/conversations/${encodeURIComponent(id)}/clear-location`, { method: 'POST' }),
  editAIDraft: (id: string, edit: any) => request<any>(`/ai/conversations/${encodeURIComponent(id)}/draft`, { method: 'PATCH', body: JSON.stringify(edit) }),
  confirmAIDraft: (id: string, revision: number) => request<any>(`/ai/conversations/${encodeURIComponent(id)}/draft/confirm`, { method: 'POST', body: JSON.stringify({ revision, confirmed: true }) }),
  async streamAIChat(req: AIChatRequest, onText: (text: string) => void, signal?: AbortSignal): Promise<AIChatResponse> {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, { method: 'POST', signal,
      headers: chatHeaders(), body: JSON.stringify({ ...req, stream: true }) });
    if (!response.headers.get('content-type')?.includes('text/event-stream')) {
      const body = await response.json();
      if (!response.ok) throw aiError(body, response);
      return body;
    }
    if (!response.body) throw new Error('AI_STREAM_UNAVAILABLE');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let pending = '', event = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        pending += decoder.decode(value, { stream: true });
        if (pending.length > 2_000_000) throw new Error('AI_STREAM_TOO_LARGE');
        let newline: number;
        while ((newline = pending.indexOf('\n')) >= 0) {
          const line = pending.slice(0, newline).trim(); pending = pending.slice(newline + 1);
          if (line.startsWith('event:')) event = line.slice(6).trim();
          if (!line.startsWith('data:')) continue;
          const data = JSON.parse(line.slice(5));
          if (event === 'delta' && typeof data.text === 'string') onText(data.text);
          if (event === 'done') return data;
          if (event === 'error') throw aiError(data);
        }
      }
      throw new Error('AI_STREAM_INTERRUPTED');
    } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
  },
  // -------------------------------------------------------------
  // States & Cities
  // -------------------------------------------------------------
  async getStates(): Promise<StateItem[]> {
    try {
      const data = await request<any>('/v1/states');
      return Array.isArray(data) ? data : (data.states || data.data || []);
    } catch {
      return [];
    }
  },

  async getCities(): Promise<CityItem[]> {
    try {
      const data = await request<any>('/v1/cities');
      return Array.isArray(data) ? data : (data.cities || data.data || []);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Places & Search
  // -------------------------------------------------------------
  async getPlaces(params?: {
    state?: string;
    city?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<PlaceListResponse> {
    const q = new URLSearchParams();
    if (params?.state) q.set('state', params.state);
    if (params?.city) q.set('city', params.city);
    if (params?.category) q.set('category', params.category);
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));

    try {
      return await request<PlaceListResponse>(`/v1/places?${q.toString()}`);
    } catch {
      return { total: 0, limit: 20, offset: 0, data: [] };
    }
  },

  async getDestinations(params?: {
    state?: string;
    city?: string;
    type?: 'famous' | 'hidden';
    category?: string;
    limit?: number;
    offset?: number;
  }): Promise<DestinationsResponse> {
    const q = new URLSearchParams();
    if (params?.state) q.set('state', params.state);
    if (params?.city) q.set('city', params.city);
    if (params?.type) q.set('type', params.type);
    if (params?.category) q.set('category', params.category);
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));

    try {
      return await request<DestinationsResponse>(`/destinations?${q.toString()}`);
    } catch {
      return {
        success: false,
        total: 0,
        limit: 20,
        offset: 0,
        city_counts: {
          Mumbai: { famous: 0, hidden: 0, total: 0 },
          Pune: { famous: 0, hidden: 0, total: 0 },
        },
        data: [],
        destinations: [],
      };
    }
  },

  async getPlaceById(id: string): Promise<PlaceDetail> {
    const data = await request<any>(`/v1/places/${id}`);
    return data.place || data.data || data;
  },

  async getPlace(id: string): Promise<PlaceDetail> {
    return this.getPlaceById(id);
  },

  async searchPlaces(query: string): Promise<PlaceSummary[]> {
    try {
      const q = new URLSearchParams({ q: query });
      const res = await request<any>(`/search?${q.toString()}`);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.places)) return res.places;
      if (res && Array.isArray(res.results)) return res.results;
      return [];
    } catch {
      return [];
    }
  },

  async suggestLocations(query: string, limit: number = 12): Promise<LocationSuggestion[]> {
    try {
      const q = new URLSearchParams({ q: query, limit: String(limit) });
      return await request<LocationSuggestion[]>(`/locations/suggest?${q.toString()}`);
    } catch {
      return [];
    }
  },

  async search(query: string, city?: string, limit?: number): Promise<{ total: number; results: any[] }> {
    const results = await this.searchPlaces(query);
    return { total: results.length, results };
  },

  async getNearbyPlaces(latOrParams: any, lng?: number, radiusKm: number = 50, limit: number = 50): Promise<any> {
    let lat: number;
    let long: number;
    let rad = radiusKm;
    let lim = limit;

    if (typeof latOrParams === 'object' && latOrParams !== null) {
      lat = latOrParams.lat;
      long = latOrParams.lng;
      rad = latOrParams.radius_km || latOrParams.radius || 50;
      lim = latOrParams.limit || 50;
    } else {
      lat = latOrParams;
      long = lng || 72.8347;
    }

    const q = new URLSearchParams({
      lat: String(lat),
      lng: String(long),
      radius_km: String(rad),
      radius: String(rad),
      limit: String(lim),
    });

    try {
      const data = await request<any>(`/v1/places/nearby?${q.toString()}`);
      if (Array.isArray(data)) {
        return { origin: { latitude: lat, longitude: long }, radius_km: rad, total: data.length, results: data };
      }
      return data;
    } catch {
      return { origin: { latitude: lat, longitude: long }, radius_km: rad, total: 0, results: [] };
    }
  },

  async getNearby(lat: number, lng: number, radiusKm: number = 50, limit: number = 50): Promise<any> {
    return this.getNearbyPlaces(lat, lng, radiusKm, limit);
  },

  // -------------------------------------------------------------
  // Hotels & Accommodation
  // -------------------------------------------------------------
  async getNearbyHotels(lat?: number, lng?: number, city?: string): Promise<any[]> {
    try {
      const q = new URLSearchParams();
      if (lat !== undefined && lng !== undefined) {
        q.set('lat', String(lat));
        q.set('lng', String(lng));
      }
      if (city) q.set('city', city);
      const res = await request<{ total: number; results: any[] }>(`/hotels/nearby?${q.toString()}`);
      return res.results || [];
    } catch {
      return [];
    }
  },

  async getFareTariffs(): Promise<any> {
    try {
      return await request<any>('/fares/tariffs');
    } catch {
      return null;
    }
  },

  // -------------------------------------------------------------
  // Railway Stations
  // -------------------------------------------------------------
  async getRailwayStations(city?: string): Promise<RailwayStationInfo[]> {
    try {
      const q = city ? `?city=${encodeURIComponent(city)}` : '';
      const data = await request<any[]>(`/railway-stations${q}`);
      return data.map((s: any) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
        distance_km: s.distance_km || 0,
        walking_time_mins: s.walking_time_mins || 15,
        road_time_mins: s.road_time_mins || 8,
        transfer_modes: s.transfer_modes || ['Taxi', 'Bus', 'Walk'],
      }));
    } catch {
      return [];
    }
  },

  async getNearbyRailwayStations(lat: number, lng: number, limit: number = 3): Promise<RailwayStationInfo[]> {
    try {
      const q = new URLSearchParams({ lat: String(lat), lng: String(lng), limit: String(limit) });
      const data = await request<any[]>(`/railway-stations/nearby?${q.toString()}`);
      return data.map((s: any) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
        distance_km: s.distance_km || 1.2,
        walking_time_mins: s.walking_time_mins || 15,
        road_time_mins: s.road_time_mins || 8,
        transfer_modes: s.transfer_modes || ['Taxi', 'Bus', 'Walk'],
      }));
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Routes & Maps
  // -------------------------------------------------------------
  async getRoutes(
    originOrObj: any,
    destination?: string,
    mode?: string,
    city?: string,
    origLat?: number,
    origLng?: number,
    destLat?: number,
    destLng?: number
  ): Promise<RouteResponse> {
    let orig: string;
    let dest: string;
    let m = mode;
    let c = city;
    let oLat = origLat;
    let oLng = origLng;
    let dLat = destLat;
    let dLng = destLng;

    let qParamDate: string | undefined = undefined;

    if (typeof originOrObj === 'object' && originOrObj !== null) {
      orig = originOrObj.origin;
      dest = originOrObj.destination;
      m = originOrObj.mode || mode;
      c = originOrObj.city || originOrObj.cityContext || city;
      if (originOrObj.orig_lat !== undefined) oLat = originOrObj.orig_lat;
      if (originOrObj.orig_lng !== undefined) oLng = originOrObj.orig_lng;
      if (originOrObj.dest_lat !== undefined) dLat = originOrObj.dest_lat;
      if (originOrObj.dest_lng !== undefined) dLng = originOrObj.dest_lng;
      if (originOrObj.date) qParamDate = originOrObj.date;
    } else {
      orig = originOrObj;
      dest = destination || 'gateway-of-india';
    }

    const q = new URLSearchParams({ origin: orig, destination: dest });
    if (m) q.set('mode', m);
    if (c) q.set('city', c);
    if (qParamDate) q.set('date', qParamDate);
    if (oLat !== undefined && !isNaN(oLat)) q.set('orig_lat', String(oLat));
    if (oLng !== undefined && !isNaN(oLng)) q.set('orig_lng', String(oLng));
    if (dLat !== undefined && !isNaN(dLat)) q.set('dest_lat', String(dLat));
    if (dLng !== undefined && !isNaN(dLng)) q.set('dest_lng', String(dLng));

    return await request<RouteResponse>(`/routes?${q.toString()}`);
  },

  async getDirectionsUrl(originOrObj: any, destination?: string, mode: string = 'driving', city?: string): Promise<{ url: string } & string> {
    let orig: string;
    let dest: string;
    let m = mode;
    let c = city;

    if (typeof originOrObj === 'object' && originOrObj !== null) {
      orig = originOrObj.origin;
      dest = originOrObj.destination;
      m = originOrObj.mode || 'driving';
      c = originOrObj.city || originOrObj.cityContext || city;
    } else {
      orig = originOrObj;
      dest = destination || 'gateway-of-india';
    }

    const q = new URLSearchParams({ origin: orig, destination: dest, mode: m });
    if (c) q.set('city', c);
    try {
      const data = await request<{ navigation_url: string }>(`/maps/directions?${q.toString()}`);
      const resStr: any = data.navigation_url;
      resStr.url = data.navigation_url;
      return resStr;
    } catch {
      const fallback = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(orig)}&destination=${encodeURIComponent(dest)}&travelmode=${m.toLowerCase()}`;
      const resStr: any = fallback;
      resStr.url = fallback;
      return resStr;
    }
  },

  async getGoogleMapsUrl(origin: string, destination: string, mode: string = 'driving', city?: string): Promise<string> {
    const res: any = await this.getDirectionsUrl(origin, destination, mode, city);
    return typeof res === 'string' ? res : (res?.url || '');
  },

  // -------------------------------------------------------------
  // AI Assistant
  // -------------------------------------------------------------
  async sendAIChat(req: AIChatRequest): Promise<AIChatResponse> {
    try {
      return await request<AIChatResponse>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    } catch (error) {
      // Retrying another route after provider/rate-limit failures can duplicate
      // paid model requests. Only fall back when the endpoint does not exist.
      if (!(error instanceof Error) || !/API Error (404|405):/.test(error.message)) throw error;
      return await request<AIChatResponse>('/v1/ai/chat', {
        method: 'POST',
        body: JSON.stringify(req),
      });
    }
  },

  async chatAI(req: any): Promise<AIChatResponse> {
    return this.sendAIChat(req);
  },

  async getPlaceMapsInfo(params: {
    place_name: string;
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
  }): Promise<GoogleMapsPlaceInfo> {
    try {
      return await request<GoogleMapsPlaceInfo>('/v1/ai/place-maps-info', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    } catch {
      const q = encodeURIComponent(`${params.place_name} ${params.city || ''}`);
      return {
        success: true,
        place_name: params.place_name,
        verified_title: params.place_name,
        city: params.city,
        maps_url: `https://www.google.com/maps/search/?api=1&query=${q}`,
        directions_url: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
        summary: 'No Virasat place record is available for this location. Check its details with an official source.',
        review_snippets: [],
        coordinates: params.lat && params.lng ? { lat: params.lat, lng: params.lng } : undefined,
      };
    }
  },

  async analyzeHeritageRoute(params: {
    monuments: Array<{
      id: string;
      name: string;
      city?: string;
      lat: number;
      lng: number;
      summary?: string;
    }>;
    transport_mode?: 'DRIVE' | 'TRANSIT' | 'WALK';
    city?: string;
    travel_style?: string;
  }): Promise<HeritageRouteAnalysisResult> {
    return await request<HeritageRouteAnalysisResult>('/v1/ai/heritage-route-analyzer', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async reverseGeocode(latitude: number, longitude: number): Promise<ReverseGeocodeResponse> {
    return await request<ReverseGeocodeResponse>('/geo/reverse-geocode', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    });
  },

  // -------------------------------------------------------------
  // Itinerary Planner & Persistence
  // -------------------------------------------------------------
  async generateItinerary(req: ItineraryRequest): Promise<ItineraryResponse> {
    return await request<ItineraryResponse>('/v1/itineraries/generate', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },

  async getItineraryCities(): Promise<{ total: number; cities: any[] }> {
    return await request<{ total: number; cities: any[] }>('/itinerary/cities');
  },

  async getSavedItineraries(params?: { city?: string; public?: boolean }): Promise<any[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.public !== undefined) q.set('public', String(params.public));
    try {
      const data = await request<any>(`/v1/itineraries?${q.toString()}`);
      return data.data || [];
    } catch {
      return [];
    }
  },

  async getItineraryById(id: string): Promise<any> {
    const data = await request<any>(`/v1/itineraries/${id}`);
    return data.data || data;
  },

  async saveItinerary(itinerary: any): Promise<any> {
    const data = await request<any>('/v1/itineraries', {
      method: 'POST',
      body: JSON.stringify(itinerary),
    });
    return data.data || data;
  },

  async updateItinerary(id: string, updates: any): Promise<any> {
    const data = await request<any>(`/v1/itineraries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.data || data;
  },

  async deleteItinerary(id: string): Promise<void> {
    await request<void>(`/v1/itineraries/${id}`, { method: 'DELETE' });
  },

  // -------------------------------------------------------------
  // Weather
  // -------------------------------------------------------------
  async getWeather(city: string = 'mumbai'): Promise<CityWeather> {
    try {
      const q = new URLSearchParams({ city });
      return await request<CityWeather>(`/weather?${q.toString()}`);
    } catch {
      return {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        temperature_c: 28,
        condition: 'Sunny & Coastal Breeze',
        humidity: 68,
        wind_kmh: 14,
        status: 'Estimated',
      };
    }
  },

  // -------------------------------------------------------------
  // Auth & Profile
  // -------------------------------------------------------------
  async register(name: string, email: string, password: string, home_city?: string): Promise<{ token: string; profile: UserProfile }> {
    const data = await request<{ token: string; profile?: UserProfile; user?: UserProfile }>('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, home_city }),
    });
    if (data.token) {
      safeLocalStorage.setItem('virasat_token', data.token);
    }
    return { token: data.token, profile: (data.profile || data.user)! };
  },

  async login(email: string, password: string): Promise<{ token: string; profile: UserProfile }> {
    const data = await request<{ token: string; profile?: UserProfile; user?: UserProfile }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      safeLocalStorage.setItem('virasat_token', data.token);
    }
    return { token: data.token, profile: (data.profile || data.user)! };
  },

  async loginWithGoogle(payload: {
    token_type?: 'google' | 'firebase';
    credential?: string;
    id_token?: string;
    client_id?: string;
    user_info?: any;
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
  }): Promise<{ token: string; profile: UserProfile }> {
    const data = await request<{ token: string; profile?: UserProfile; user?: UserProfile }>('/v1/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (data.token) {
      safeLocalStorage.setItem('virasat_token', data.token);
    }
    return { token: data.token, profile: (data.profile || data.user)! };
  },

  async getProfile(): Promise<UserProfile> {
    const data = await request<any>('/v1/auth/me');
    return (data.profile || data.user || data) as UserProfile;
  },

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    const data = await request<any>('/v1/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
    return (data.profile || data.user || data) as UserProfile;
  },

  async saveSurvey(survey: OnboardingSurvey): Promise<UserProfile> {
    const data = await request<any>('/v1/auth/survey', {
      method: 'POST',
      body: JSON.stringify(survey),
    });
    return (data.profile || data.user || data) as UserProfile;
  },

  // -------------------------------------------------------------
  // Favorites
  // -------------------------------------------------------------
  async getFavorites(): Promise<FavoriteItem[]> {
    try {
      const data = await request<any>('/v1/favorites');
      return Array.isArray(data) ? data : (data.favorites || data.data || []);
    } catch {
      return [];
    }
  },

  async addFavorite(placeId: string): Promise<FavoriteItem> {
    const data = await request<any>('/v1/favorites', {
      method: 'POST',
      body: JSON.stringify({ place_id: placeId }),
    });
    return data.favorite || data;
  },

  async removeFavorite(placeId: string): Promise<void> {
    await request<void>(`/v1/favorites/${placeId}`, { method: 'DELETE' });
  },

  // -------------------------------------------------------------
  // Trips
  // -------------------------------------------------------------
  async getTrips(): Promise<TripItem[]> {
    try {
      const data = await request<any>('/v1/trips');
      return Array.isArray(data) ? data : (data.trips || data.data || []);
    } catch {
      return [];
    }
  },

  async createTrip(trip: Omit<TripItem, 'id' | 'created_at'>): Promise<TripItem> {
    const data = await request<any>('/v1/trips', {
      method: 'POST',
      body: JSON.stringify(trip),
    });
    return data.trip || data;
  },

  async saveTrip(trip: Omit<TripItem, 'id' | 'created_at'>): Promise<TripItem> {
    return await this.createTrip(trip);
  },

  async deleteTrip(tripId: string): Promise<void> {
    await request<void>(`/v1/trips/${tripId}`, { method: 'DELETE' });
  },

  // -------------------------------------------------------------
  // Platform Statistics
  // -------------------------------------------------------------
  async getStats(): Promise<PlatformStats> {
    try {
      return await request<PlatformStats>('/stats');
    } catch {
      return {
        heritage_count: 45,
        destinations_count: 78,
        states_count: 36,
        cities_count: 24,
        mumbai_local_stations_count: 65,
        three_d_models_count: 45,
        transport_modes: ['Suburban Rail', 'Metro', 'Drive / Taxi', 'Walking', 'Bicycle'],
      };
    }
  },

  // -------------------------------------------------------------
  // Heritage Experiences (42+ Curated UNESCO & National Sites)
  // -------------------------------------------------------------
  async getHeritage(params?: {
    category?: string;
    state?: string;
    unesco_status?: string;
    search?: string;
    lang?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; limit?: number; offset?: number; count?: number; data: any[] }> {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.state) q.set('state', params.state);
    if (params?.unesco_status) q.set('unesco_status', params.unesco_status);
    if (params?.search) q.set('search', params.search);
    if (params?.lang) q.set('lang', params.lang);
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));

    try {
      return await request<{ total: number; limit?: number; offset?: number; count?: number; data: any[] }>(`/heritages?${q.toString()}`);
    } catch {
      return { total: 0, count: 0, data: [] };
    }
  },

  async getHeritageById(id: string, lang?: string): Promise<any> {
    const q = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    return await request<any>(`/heritages/${encodeURIComponent(id)}${q}`);
  },

  async getHeritageBySlug(slug: string, lang?: string): Promise<any> {
    const q = lang ? `?lang=${encodeURIComponent(lang)}` : '';
    return await request<any>(`/heritages/${encodeURIComponent(slug)}${q}`);
  },

  async getLanguages(): Promise<any> {
    try {
      return await request<any>('/languages');
    } catch {
      return { success: true, count: 0, data: [] };
    }
  },

  // -------------------------------------------------------------
  // Mumbai Suburban Local Rail Module
  // -------------------------------------------------------------
  async getMumbaiLocalLines(): Promise<any> {
    return await request<any>('/mumbai-local/lines');
  },

  async getMumbaiLocalStations(): Promise<MumbaiLocalStation[]> {
    return await request<MumbaiLocalStation[]>('/mumbai-local/stations');
  },

  async getMumbaiLocalRoute(from: string, to: string): Promise<MumbaiLocalRouteResult> {
    const q = new URLSearchParams({ from, to });
    return await request<MumbaiLocalRouteResult>(`/mumbai-local/route?${q.toString()}`);
  },

  // -------------------------------------------------------------
  // Distance Calculation
  // -------------------------------------------------------------
  async getDistance(params: {
    from?: string;
    to?: string;
    lat1?: number;
    lng1?: number;
    lat2?: number;
    lng2?: number;
  }): Promise<{
    origin: { name: string; lat: number; lng: number };
    destination: { name: string; lat: number; lng: number };
    aerial_distance_km: number;
    estimated_road_distance_km: number;
    drive_time_mins: number;
    walking_time_mins: number;
  }> {
    const q = new URLSearchParams();
    if (params.from) q.set('from', params.from);
    if (params.to) q.set('to', params.to);
    if (params.lat1 !== undefined) q.set('lat1', String(params.lat1));
    if (params.lng1 !== undefined) q.set('lng1', String(params.lng1));
    if (params.lat2 !== undefined) q.set('lat2', String(params.lat2));
    if (params.lng2 !== undefined) q.set('lng2', String(params.lng2));

    return await request<any>(`/distance?${q.toString()}`);
  },

  // -------------------------------------------------------------
  // Culture & Living Heritage
  // -------------------------------------------------------------
  async getCulture(params?: { city?: string; category?: string }): Promise<CulturalItem[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.category) q.set('category', params.category);
    try {
      return await request<CulturalItem[]>(`/culture?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Artisans & GI Craft Traditions
  // -------------------------------------------------------------
  async getArtisans(params?: { city?: string; gi_only?: boolean }): Promise<ArtisanProfile[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.gi_only) q.set('gi_only', 'true');
    try {
      return await request<ArtisanProfile[]>(`/artisans?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Verified Local Providers & Homestays
  // -------------------------------------------------------------
  async getProviders(params?: {
    city?: string;
    category?: string;
    verification_status?: string;
  }): Promise<LocalProvider[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.category) q.set('category', params.category);
    if (params?.verification_status) q.set('verification_status', params.verification_status);
    try {
      return await request<LocalProvider[]>(`/providers?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Infrastructure Facilities & Nearby Lookup
  // -------------------------------------------------------------
  async getFacilities(params?: {
    city?: string;
    type?: string;
    accessible?: boolean;
  }): Promise<InfrastructureFacility[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    if (params?.type) q.set('type', params.type);
    if (params?.accessible) q.set('accessible', 'true');
    try {
      return await request<InfrastructureFacility[]>(`/facilities?${q.toString()}`);
    } catch {
      return [];
    }
  },

  async getNearbyFacilities(lat: number, lng: number, radiusKm: number = 5): Promise<InfrastructureFacility[]> {
    const q = new URLSearchParams({ lat: String(lat), lng: String(lng), radius_km: String(radiusKm) });
    try {
      return await request<InfrastructureFacility[]>(`/facilities/nearby?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Barrier-Free Accessibility Audits
  // -------------------------------------------------------------
  async getAccessibility(params?: {
    place_id?: string;
    city?: string;
    wheelchair?: string;
  }): Promise<AccessibilityRecord[]> {
    const q = new URLSearchParams();
    if (params?.place_id) q.set('place_id', params.place_id);
    if (params?.city) q.set('city', params.city);
    if (params?.wheelchair) q.set('wheelchair', params.wheelchair);
    try {
      return await request<AccessibilityRecord[]>(`/accessibility?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Heritage Clusters & Pan-India Commuter Networks
  // -------------------------------------------------------------
  async getClusters(params?: { city?: string }): Promise<HeritageCluster[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    try {
      return await request<HeritageCluster[]>(`/clusters?${q.toString()}`);
    } catch {
      return [];
    }
  },

  async getSuburbanNetworks(params?: { city?: string }): Promise<CommuterNetwork[]> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    try {
      return await request<CommuterNetwork[]>(`/suburban-networks?${q.toString()}`);
    } catch {
      return [];
    }
  },

  // -------------------------------------------------------------
  // Destination Health & Tourism Gap Map
  // -------------------------------------------------------------
  async getDestinationHealth(params?: { city?: string }): Promise<DestinationHealthResponse> {
    const q = new URLSearchParams();
    if (params?.city) q.set('city', params.city);
    try {
      return await request<DestinationHealthResponse>(`/destination-health?${q.toString()}`);
    } catch {
      return {
        provenance_disclaimer: 'MODELLED / ANALYTICAL ESTIMATE FOR DEMO',
        provenance_badge: 'MODELLED',
        cities: [],
        gap_map_zones: [],
      };
    }
  },

  async getDestinationHealthForPlace(placeId: string): Promise<{
    place_id: string;
    place_name: string;
    city: string;
    health_score: number;
    open_issues_count: number;
    resolved_issues_count: number;
    status_label: string;
    recent_reports?: any[];
  } | null> {
    try {
      const res = await request<any>(`/reports/destination-health/${encodeURIComponent(placeId)}`);
      return res.data || res;
    } catch {
      return null;
    }
  },

  // -------------------------------------------------------------
  // Heritage Condition Citizen Reporting Workflow
  // -------------------------------------------------------------
  async getReports(params?: {
    site_id?: string;
    place_id?: string;
    city?: string;
    status?: string;
  }): Promise<HeritageConditionReport[]> {
    const q = new URLSearchParams();
    const pid = params?.place_id || params?.site_id;
    if (pid) q.set('place_id', pid);
    if (params?.city) q.set('city', params.city);
    if (params?.status) q.set('status', params.status);
    try {
      const res = await request<any>(`/reports?${q.toString()}`);
      if (Array.isArray(res)) return res;
      return res.data || res.reports || [];
    } catch {
      return [];
    }
  },

  async createReport(data: {
    site_id?: string;
    place_id?: string;
    site_name?: string;
    place_name?: string;
    city?: string;
    title?: string;
    reported_by?: string;
    user_role?: string;
    issue_category?: string;
    issue_type?: string;
    severity?: string;
    description: string;
    image_url?: string;
    media_url?: string;
  }): Promise<HeritageConditionReport> {
    const res = await request<any>('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data || res.report || res;
  },

  async updateReportStatus(
    id: string,
    status: string,
    note?: string,
    actor?: string
  ): Promise<HeritageConditionReport> {
    const res = await request<any>(`/reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note, actor }),
    });
    return res.data || res.report || res;
  },

  // -------------------------------------------------------------
  // Master Tourism Database & Common Data Service Layer
  // -------------------------------------------------------------
  async getDatabaseStatus(): Promise<DatabaseStatusResponse> {
    return await request<DatabaseStatusResponse>('/database/status');
  },

  async getDatabaseCategories(): Promise<DatabaseCategoryMeta[]> {
    return await request<DatabaseCategoryMeta[]>('/database/categories');
  },

  async getDatabaseRecords(
    category: string,
    params?: { search?: string; city?: string; state?: string; limit?: number; offset?: number }
  ): Promise<DatabaseRecordsResponse> {
    const q = new URLSearchParams({ category });
    if (params?.search) q.set('search', params.search);
    if (params?.city) q.set('city', params.city);
    if (params?.state) q.set('state', params.state);
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));

    return await request<DatabaseRecordsResponse>(`/database/records?${q.toString()}`);
  },

  async syncMasterDatabase(payload: DatabaseSyncPayload): Promise<DatabaseSyncResult> {
    return await request<DatabaseSyncResult>('/database/sync', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getDatabaseSchemaTemplate(): Promise<any> {
    return await request<any>('/database/schema-template');
  },

  async getDatabaseImages(params?: {
    entity_id?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ total: number; limit: number; offset: number; records: any[] }> {
    const q = new URLSearchParams();
    if (params?.entity_id) q.set('entity_id', params.entity_id);
    if (params?.search) q.set('search', params.search);
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));
    return await request<any>(`/database/images?${q.toString()}`);
  },

  async getEntityImageMetadata(entityId: string): Promise<{
    entity_id: string;
    metadata: EntityImageMetadata;
    images: any[];
    total: number;
  }> {
    return await request<any>(`/database/images/${encodeURIComponent(entityId)}`);
  },

  async getIndiaHierarchy(): Promise<any> {
    return await request<any>('/india-hierarchy');
  },

  async getIndiaStates(): Promise<any[]> {
    return await request<any[]>('/india-hierarchy/states');
  },

  async getIndiaState(stateId: string): Promise<any> {
    return await request<any>(`/india-hierarchy/state/${encodeURIComponent(stateId)}`);
  },

  async getIndiaCity(cityId: string): Promise<any> {
    return await request<any>(`/india-hierarchy/city/${encodeURIComponent(cityId)}`);
  },

  // -------------------------------------------------------------
  // Augmented Reality & Visual Monument Identification
  // -------------------------------------------------------------
  async visualIdentify(payload: {
    image: string;
    mode?: 'identify' | 'ar_facts';
    current_location?: { latitude: number; longitude: number };
  }): Promise<VisualIdentificationResult> {
    try {
      return await request<VisualIdentificationResult>('/v1/ai/visual-identify', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      // Retry once on transient fetch / socket disconnect issues
      const isFetchError =
        err?.message?.includes('Failed to fetch') ||
        err?.message?.includes('NetworkError') ||
        err?.name === 'TypeError';

      if (isFetchError) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return await request<VisualIdentificationResult>('/v1/ai/visual-identify', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      throw err;
    }
  },

  // -------------------------------------------------------------
  // Festivals (Flagship Cultural & Heritage Festivals)
  // -------------------------------------------------------------
  async getFestivals(params?: {
    state?: string;
    state_id?: string;
    city?: string;
    city_id?: string;
    month?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<FestivalItem[]> {
    try {
      const q = new URLSearchParams();
      if (params?.state) q.set('state', params.state);
      if (params?.state_id) q.set('state_id', params.state_id);
      if (params?.city) q.set('city', params.city);
      if (params?.city_id) q.set('city_id', params.city_id);
      if (params?.month) q.set('month', params.month);
      if (params?.search) q.set('search', params.search);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.offset) q.set('offset', String(params.offset));

      const res = await request<any>(`/v1/festivals?${q.toString()}`);
      return Array.isArray(res) ? res : (res.festivals || res.data || []);
    } catch {
      return [];
    }
  },

  async getCurrentUpcomingFestivals(date = '2026-09-26'): Promise<{
    current: FestivalItem[];
    upcoming: FestivalItem[];
    currentDate: string;
  }> {
    try {
      const res = await request<any>(`/v1/festivals/current-upcoming?date=${encodeURIComponent(date)}`);
      return {
        current: res.current || res.data?.current || [],
        upcoming: res.upcoming || res.data?.upcoming || [],
        currentDate: res.currentDate || date,
      };
    } catch {
      return { current: [], upcoming: [], currentDate: date };
    }
  },

  async getFestivalById(id: string): Promise<FestivalItem | null> {
    try {
      const res = await request<any>(`/v1/festivals/${encodeURIComponent(id)}`);
      return res.festival || res.data || null;
    } catch {
      return null;
    }
  },

  async getFestivalLiveInfo(id: string, refresh = false): Promise<FestivalLiveInfoResponse> {
    try {
      const res = await request<FestivalLiveInfoResponse>(
        `/v1/festivals/${encodeURIComponent(id)}/live-info${refresh ? '?refresh=true' : ''}`,
        {
          method: 'POST',
          body: JSON.stringify({ refresh }),
        }
      );
      return res;
    } catch (err: any) {
      return {
        success: false,
        has_sources: false,
        error_message: err?.message || 'Failed to connect to Google Search live info service',
        message: err?.message || 'Failed to connect to Google Search live info service',
        sources: [],
        data: null,
        live_info: null,
        last_fetched: new Date().toISOString(),
      };
    }
  },

  async searchFestivalsLive(query: string): Promise<FestivalLiveSearchResponse> {
    try {
      const res = await request<FestivalLiveSearchResponse>(
        '/v1/festivals/live-search',
        {
          method: 'POST',
          body: JSON.stringify({ query }),
        }
      );
      return res;
    } catch (err: any) {
      return {
        success: false,
        has_sources: false,
        query,
        error_message: err?.message || 'Live Search service unavailable',
        sources: [],
        last_fetched: new Date().toISOString(),
      };
    }
  },

  async searchGlobalFestivalLiveInfo(query: string, refresh = false): Promise<any> {
    try {
      const params = new URLSearchParams({ q: query });
      if (refresh) params.set('refresh', 'true');
      return await request<any>(`/v1/festivals/live-info?${params.toString()}`);
    } catch (err: any) {
      return {
        success: false,
        has_sources: false,
        sources: [],
        live_info: null,
        message: err?.message || 'Failed to search live festival info',
      };
    }
  },

  async getHotels(params?: { city?: string; lat?: number; lng?: number; radius?: number }): Promise<any[]> {
    try {
      const q = new URLSearchParams();
      if (params?.city) q.set('city', params.city);
      if (params?.lat !== undefined) q.set('lat', String(params.lat));
      if (params?.lng !== undefined) q.set('lng', String(params.lng));
      if (params?.radius !== undefined) q.set('radius', String(params.radius));
      const res = await request<any>(`/hotels/nearby?${q.toString()}`);
      return res.data || [];
    } catch {
      return [];
    }
  },
};
