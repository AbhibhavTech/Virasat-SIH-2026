import express from 'express';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { masterTourismDataService } from './src/server/masterTourismDataService';
import { INDIA_TOURISM_DATABASE } from './src/data/indiaTourismDatabase';
import { getVerifiedCityPlan, ALL_INDIAN_TOURISM_CITIES } from './src/data/cityItineraryData';
import {
  findConnectedRailRoute,
  getRealRoadRoute,
  formatTransitDuration,
  haversineKm,
  MAJOR_RAILWAY_STATIONS,
} from './src/server/railwayRoutingEngine';
import {
  resolveOriginTransportNode,
  resolveDestinationTransportNode,
  buildVerifiedTransitComparison,
} from './src/server/transportResolver';

import { db } from './server/src/db/client';
import { requestIdMiddleware } from './server/src/middleware/validate';
import { requireAuth, requireRole } from './server/src/middleware/auth';
import { authRouter } from './server/src/modules/auth/auth.router';
import { placesRouter } from './server/src/modules/places/places.router';
import { statesRouter } from './server/src/modules/states/states.router';
import { favoritesRouter } from './server/src/modules/favorites/favorites.router';
import { tripsRouter } from './server/src/modules/trips/trips.router';
import { reportsRouter } from './server/src/modules/reports/reports.router';
import { routingRouter } from './server/src/modules/routing/routing.router';
import { itineraryRouter } from './server/src/modules/itinerary/itinerary.router';
import { aiRouter } from './server/src/modules/ai/ai.router';
import { healthRouter } from './server/src/modules/health/health.router';
import { seoRouter } from './server/src/modules/seo/seo.router';
import { analyticsRouter } from './server/src/modules/analytics/analytics.router';
import { adminRouter } from './server/src/modules/admin/admin.router';
import { requestLogger, securityHeaders, errorHandler } from './server/src/middleware/observability';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];

app.use(securityHeaders);
app.use(requestLogger);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(compression());
app.use(requestIdMiddleware);

// -------------------------------------------------------------
// SEO Endpoints (Robots.txt & Sitemap.xml)
// -------------------------------------------------------------
app.use('/', seoRouter);

// -------------------------------------------------------------
// Health Probes & Observability Endpoints
// -------------------------------------------------------------
app.use('/api', healthRouter);
app.use('/api/v1', healthRouter);

// -------------------------------------------------------------
// Modular API v1 Routers
// -------------------------------------------------------------
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/places', placesRouter);
app.use('/api/v1', statesRouter);
app.use('/api/v1/favorites', favoritesRouter);
app.use('/api/v1/trips', tripsRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/routing', routingRouter);
app.use('/api/v1/itineraries', itineraryRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/v1/admin', adminRouter);

// -------------------------------------------------------------
// Data Repositories & In-Memory Store
// -------------------------------------------------------------
interface StateItem {
  id: string;
  name: string;
  capital: string;
  region: string;
  total_places: number;
  thumbnail_url?: string;
  coordinates?: { lat: number; lng: number };
}

interface CityItem {
  id: string;
  name: string;
  state: string;
  state_id: string;
  lat: number;
  lng: number;
  description: string;
  places_count: number;
  coordinates?: { lat: number; lng: number };
}

interface PlaceItem {
  id: string;
  name: string;
  state: string;
  state_id?: string;
  city: string;
  city_id?: string;
  country: string;
  category: string;
  summary: string;
  description?: string;
  history?: string;
  culture?: string;
  architecture?: string;
  coordinates: { lat: number; lng: number };
  rating?: number;
  reviews_count?: string;
  thumbnail_url?: string;
  images?: string[];
  best_time_to_visit?: string;
  visiting_hours?: string;
  entry_fee?: { domestic: number; international: number; currency: string };
  visiting_info?: any;
  model_3d?: any;
  tags: string[];
  features: { map: boolean; navigation: boolean; ai: boolean; '3d': boolean };
  heritage_status?: string;
  area_neighborhood?: string;
  status?: string;
}

interface RailwayStation {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  lines: string[];
  is_junction?: boolean;
}

const statesData: StateItem[] = [];
const citiesData: CityItem[] = [];
const placesData: Map<string, PlaceItem> = new Map();
const heritageData: any[] = [];
const railwayStationsData: RailwayStation[] = [];
let mumbaiLocalNetwork: any = null;
let hotelsData: any[] = [];
let faresConfig: any = null;
let cultureData: any[] = [];
let artisansData: any[] = [];
let providersData: any[] = [];
let facilitiesData: any[] = [];
let accessibilityData: any[] = [];
let clustersData: any[] = [];
let suburbanNetworksData: any[] = [];
let destinationHealthData: any = null;
let reportsData: any[] = [];

// In-Memory User Data
const usersStore: Map<string, any> = new Map();
const favoritesStore: Map<string, string[]> = new Map();
const tripsStore: Map<string, any[]> = new Map();

// Canonical City Mappings & Scoping Helpers to prevent cross-city contamination
const CITY_ALIASES: Record<string, string[]> = {
  mumbai: ['mumbai', 'bombay', 'gharapuri island / mumbai', 'sanjay gandhi national park'],
  delhi: ['delhi', 'new delhi', 'old delhi', 'delhi (nct)', 'nct'],
  varanasi: ['varanasi', 'kashi', 'banaras'],
  agra: ['agra', 'agra district'],
  jaipur: ['jaipur'],
  kochi: ['kochi', 'cochin', 'ernakulam'],
  kolkata: ['kolkata', 'calcutta', 'howrah', 'howrah–kolkata', 'howrah-kolkata', 'alipore'],
  darjeeling: ['darjeeling'],
  santiniketan: ['santiniketan', 'shantiniketan', 'bolpur'],
  siliguri: ['siliguri'],
  amritsar: ['amritsar'],
  goa: ['goa', 'panaji', 'old goa', 'velha goa', 'sinquerim', 'candolim'],
  bengaluru: ['bengaluru', 'bangalore'],
  hyderabad: ['hyderabad', 'secunderabad'],
  pune: ['pune'],
  udaipur: ['udaipur'],
  hampi: ['hampi', 'vijayanagara', 'hosapete'],
  madurai: ['madurai'],
  'chhatrapati sambhajinagar': ['chhatrapati sambhajinagar', 'aurangabad'],
  'bodh gaya': ['bodh gaya', 'nalanda', 'rajgir'],
  bhubaneswar: ['bhubaneswar', 'konark', 'puri'],
  srinagar: ['srinagar'],
  'port blair': ['port blair', 'andaman'],
  shimla: ['shimla'],
  jodhpur: ['jodhpur'],
  jaisalmer: ['jaisalmer'],
  gangtok: ['gangtok'],
  lonavala: ['lonavala', 'lonavla', 'khandala', 'lonavala & khandala', 'lonavala and khandala'],
  khandala: ['khandala', 'lonavala', 'lonavla', 'lonavala & khandala', 'lonavala and khandala'],
};

const CANONICAL_CITY_NAMES: Record<string, string> = {
  mumbai: 'Mumbai',
  delhi: 'Delhi',
  varanasi: 'Varanasi',
  agra: 'Agra',
  jaipur: 'Jaipur',
  kochi: 'Kochi',
  kolkata: 'Kolkata',
  darjeeling: 'Darjeeling',
  santiniketan: 'Santiniketan',
  siliguri: 'Siliguri',
  amritsar: 'Amritsar',
  goa: 'Goa',
  bengaluru: 'Bengaluru',
  hyderabad: 'Hyderabad',
  pune: 'Pune',
  udaipur: 'Udaipur',
  hampi: 'Hampi',
  madurai: 'Madurai',
  'chhatrapati sambhajinagar': 'Chhatrapati Sambhajinagar',
  'bodh gaya': 'Bodh Gaya',
  bhubaneswar: 'Bhubaneswar',
  srinagar: 'Srinagar',
  'port blair': 'Port Blair',
  shimla: 'Shimla',
  jodhpur: 'Jodhpur',
  jaisalmer: 'Jaisalmer',
  gangtok: 'Gangtok',
  lonavala: 'Lonavala & Khandala',
  khandala: 'Khandala',
};

function getCanonicalCityId(cityNameOrId: string): string {
  const norm = (cityNameOrId || '').toLowerCase().trim();
  if (!norm) return '';
  for (const [canonId, aliases] of Object.entries(CITY_ALIASES)) {
    if (canonId === norm || aliases.some((a) => a === norm || norm.includes(a) || a.includes(norm))) {
      return canonId;
    }
  }
  return norm.replace(/[^a-z0-9]/g, '-');
}

function getCanonicalCityName(cityId: string): string {
  const norm = (cityId || '').toLowerCase().trim();
  if (CANONICAL_CITY_NAMES[norm]) return CANONICAL_CITY_NAMES[norm];
  return norm ? norm.charAt(0).toUpperCase() + norm.slice(1) : '';
}

function isPlaceInCity(place: any, targetCity: string): boolean {
  if (!place || !targetCity) return false;
  const targetCanon = getCanonicalCityId(targetCity);
  if (!targetCanon) return false;
  const pCity = (place.city || '').toLowerCase().trim();
  const pCityId = ((place as any).city_id || '').toLowerCase().trim();
  const pArea = ((place as any).area || '').toLowerCase().trim();

  if (pCityId && getCanonicalCityId(pCityId) === targetCanon) return true;
  if (pCity && getCanonicalCityId(pCity) === targetCanon) return true;
  if (pArea && getCanonicalCityId(pArea) === targetCanon) return true;

  const aliases = CITY_ALIASES[targetCanon] || [targetCanon];
  return aliases.some((a) =>
    (pCity && (pCity === a || pCity.includes(a))) ||
    (pCityId && (pCityId === a || pCityId.includes(a))) ||
    (pArea && (pArea === a || pArea.includes(a)))
  );
}

// Load datasets
function loadData() {
  try {
    const dataDir = path.join(process.cwd(), 'data');

    // Load states
    const statesPath = path.join(dataDir, 'states.json');
    if (fs.existsSync(statesPath)) {
      const raw = JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
      statesData.push(...raw);
    }

    // Load cities
    const citiesPath = path.join(dataDir, 'cities.json');
    if (fs.existsSync(citiesPath)) {
      const raw = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));
      citiesData.push(...raw);
    }

    // Load railway stations
    const stationsPath = path.join(dataDir, 'railway_stations.json');
    if (fs.existsSync(stationsPath)) {
      const raw = JSON.parse(fs.readFileSync(stationsPath, 'utf-8'));
      railwayStationsData.push(...raw);
    }

    // Load hotels
    const hotelsPath = path.join(dataDir, 'hotels.json');
    if (fs.existsSync(hotelsPath)) {
      hotelsData = JSON.parse(fs.readFileSync(hotelsPath, 'utf-8'));
    }

    // Load fare tariffs
    const faresPath = path.join(dataDir, 'fares.json');
    if (fs.existsSync(faresPath)) {
      faresConfig = JSON.parse(fs.readFileSync(faresPath, 'utf-8'));
    }

    // Load Mumbai Local Network
    const mumbaiNetworkPath = path.join(dataDir, 'mumbai_local_network.json');
    if (fs.existsSync(mumbaiNetworkPath)) {
      mumbaiLocalNetwork = JSON.parse(fs.readFileSync(mumbaiNetworkPath, 'utf-8'));
    }

    // Load places from subdirectories
    const loadPlacesFile = (filePath: string) => {
      if (fs.existsSync(filePath)) {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        for (const item of raw) {
          if (item && item.id) {
            placesData.set(item.id.toLowerCase(), item);
          }
        }
      }
    };

    loadPlacesFile(path.join(dataDir, 'mumbai', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'maharashtra', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'delhi', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'rajasthan', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'kerala', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'bihar', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'ladakh', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'jammu-kashmir', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'kolkata', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'west-bengal', 'places.json'));
    loadPlacesFile(path.join(dataDir, 'goa', 'places.json'));

    // Load Heritage 42+ structured experiences
    const heritagePath = path.join(dataDir, 'heritage', 'monuments.json');
    if (fs.existsSync(heritagePath)) {
      const rawHeritage = JSON.parse(fs.readFileSync(heritagePath, 'utf-8'));
      heritageData.push(...rawHeritage);
      for (const item of rawHeritage) {
        if (item && item.id) {
          const normItem = {
            ...item,
            category: item.category || 'Architectural & Colonial',
            summary: item.summary || item.historical_significance?.slice(0, 200) || '',
            tags: item.tags || ['heritage', 'unesco'],
            features: item.features || { map: true, navigation: true, ai: true, '3d': Boolean(item.model_3d?.available || item.model_3d?.has_model) },
          };
          placesData.set(item.id.toLowerCase(), normItem);
        }
      }

      // Ensure key heritage monument aliases are cross-linked
      if (placesData.has('amber-fort') && !placesData.has('amber-palace')) {
        placesData.set('amber-palace', { ...placesData.get('amber-fort')!, id: 'amber-palace', name: 'Amber Palace & Fort (Amer)' });
      } else if (placesData.has('amber-palace') && !placesData.has('amber-fort')) {
        placesData.set('amber-fort', { ...placesData.get('amber-palace')!, id: 'amber-fort' });
      }
    }

    // Load india_tourism.json for fallback / supplementary
    const indiaTourismPath = path.join(dataDir, 'india_tourism.json');
    if (fs.existsSync(indiaTourismPath)) {
      const raw = JSON.parse(fs.readFileSync(indiaTourismPath, 'utf-8'));
      if (Array.isArray(raw.places)) {
        for (const p of raw.places) {
          const id = (p.id || '').toLowerCase();
          if (id && !placesData.has(id)) {
            const cityObj = citiesData.find((c: any) => c.id === p.city_id);
            const stateObj = statesData.find((s: any) => s.id === p.state_id);
            const resolvedCity = p.city || (cityObj ? cityObj.name : p.city_id ? p.city_id.charAt(0).toUpperCase() + p.city_id.slice(1) : '');
            const resolvedState = p.state || (stateObj ? stateObj.name : p.state_id ? p.state_id.charAt(0).toUpperCase() + p.state_id.slice(1) : '');

            placesData.set(id, {
              id: p.id,
              name: p.name,
              state: resolvedState,
              state_id: p.state_id || stateObj?.id || '',
              city: resolvedCity,
              city_id: p.city_id || cityObj?.id || '',
              country: 'India',
              category: p.category || 'heritage',
              summary: p.summary || p.short_description || p.description || '',
              description: p.description || '',
              coordinates: {
                lat: p.coordinates?.lat || p.latitude || 18.922,
                lng: p.coordinates?.lng || p.longitude || 72.8347,
              },
              rating: p.rating || 4.7,
              thumbnail_url: p.thumbnail_url || p.hero_image_url || (p.image_urls && p.image_urls[0]) || '',
              images: p.images || p.image_urls || (p.thumbnail_url ? [p.thumbnail_url] : []),
              tags: p.tags || ['heritage', 'tourism'],
              features: p.features || { map: true, navigation: true, ai: true, '3d': Boolean(p.three_d_model_url) },
            });
          }
        }
      }
    }

    // Comprehensive City Normalization pass for all places in placesData
    for (const [id, place] of placesData.entries()) {
      let cId = ((place as any).city_id || '').toLowerCase().trim();
      let cName = (place.city || '').trim();

      if (!cId && cName) {
        cId = getCanonicalCityId(cName);
      }
      if (!cName && cId) {
        cName = getCanonicalCityName(cId);
      }
      (place as any).city_id = cId;
      place.city = cName;
    }

    // Load culture & cuisine
    const culturePath = path.join(dataDir, 'culture.json');
    if (fs.existsSync(culturePath)) {
      cultureData = JSON.parse(fs.readFileSync(culturePath, 'utf-8'));
    }

    // Load artisans
    const artisansPath = path.join(dataDir, 'artisans.json');
    if (fs.existsSync(artisansPath)) {
      artisansData = JSON.parse(fs.readFileSync(artisansPath, 'utf-8'));
    }

    // Load providers
    const providersPath = path.join(dataDir, 'providers.json');
    if (fs.existsSync(providersPath)) {
      providersData = JSON.parse(fs.readFileSync(providersPath, 'utf-8'));
    }

    // Load facilities
    const facilitiesPath = path.join(dataDir, 'facilities.json');
    if (fs.existsSync(facilitiesPath)) {
      facilitiesData = JSON.parse(fs.readFileSync(facilitiesPath, 'utf-8'));
    }

    // Load accessibility
    const accessibilityPath = path.join(dataDir, 'accessibility.json');
    if (fs.existsSync(accessibilityPath)) {
      accessibilityData = JSON.parse(fs.readFileSync(accessibilityPath, 'utf-8'));
    }

    // Load clusters
    const clustersPath = path.join(dataDir, 'clusters.json');
    if (fs.existsSync(clustersPath)) {
      clustersData = JSON.parse(fs.readFileSync(clustersPath, 'utf-8'));
    }

    // Load suburban networks
    const suburbanPath = path.join(dataDir, 'suburban_networks.json');
    if (fs.existsSync(suburbanPath)) {
      suburbanNetworksData = JSON.parse(fs.readFileSync(suburbanPath, 'utf-8'));
    }

    // Load destination health & gap map
    const healthPath = path.join(dataDir, 'destination_health.json');
    if (fs.existsSync(healthPath)) {
      destinationHealthData = JSON.parse(fs.readFileSync(healthPath, 'utf-8'));
    }

    // Load heritage condition reports
    const reportsPath = path.join(dataDir, 'reports.json');
    if (fs.existsSync(reportsPath)) {
      reportsData = JSON.parse(fs.readFileSync(reportsPath, 'utf-8'));
    }

    // Initialize and hydrate Master Tourism Data Architecture Service
    masterTourismDataService.initialize(dataDir);
    syncServiceToGlobals();

    console.log(`[Server] Master Tourism Database initialized. Loaded ${statesData.length} states, ${citiesData.length} cities, ${placesData.size} places, ${railwayStationsData.length} stations, ${cultureData.length} cultural items, ${artisansData.length} artisans, ${providersData.length} providers.`);
  } catch (err) {
    console.error('[Server] Error loading datasets:', err);
  }
}

// Synchronize the master service collections with the server's global registries
function syncServiceToGlobals() {
  if (masterTourismDataService.states.length > 0) {
    statesData.length = 0;
    statesData.push(...masterTourismDataService.states);
  }
  if (masterTourismDataService.cities.length > 0) {
    citiesData.length = 0;
    citiesData.push(...masterTourismDataService.cities);
  }
  if (masterTourismDataService.destinations.size > 0) {
    placesData.clear();
    for (const [k, v] of masterTourismDataService.destinations.entries()) {
      placesData.set(k, v as any);
    }
  }
  if (masterTourismDataService.heritage.length > 0) {
    heritageData.length = 0;
    heritageData.push(...masterTourismDataService.heritage);
  }
  if (masterTourismDataService.railwayStations.length > 0) {
    railwayStationsData.length = 0;
    railwayStationsData.push(...masterTourismDataService.railwayStations);
  }
  if (masterTourismDataService.hotels.length > 0) {
    hotelsData = masterTourismDataService.hotels;
  }
  if (masterTourismDataService.mumbaiLocalNetwork) {
    mumbaiLocalNetwork = masterTourismDataService.mumbaiLocalNetwork;
  }
  if (masterTourismDataService.faresConfig) {
    faresConfig = masterTourismDataService.faresConfig;
  }
  if (masterTourismDataService.cultureData.length > 0) {
    cultureData = masterTourismDataService.cultureData;
  }
  if (masterTourismDataService.artisansData.length > 0) {
    artisansData = masterTourismDataService.artisansData;
  }
  if (masterTourismDataService.providersData.length > 0) {
    providersData = masterTourismDataService.providersData;
  }
  if (masterTourismDataService.facilitiesData.length > 0) {
    facilitiesData = masterTourismDataService.facilitiesData;
  }
  if (masterTourismDataService.accessibilityData.length > 0) {
    accessibilityData = masterTourismDataService.accessibilityData;
  }
  if (masterTourismDataService.clustersData.length > 0) {
    clustersData = masterTourismDataService.clustersData;
  }
  if (masterTourismDataService.suburbanNetworksData.length > 0) {
    suburbanNetworksData = masterTourismDataService.suburbanNetworksData;
  }
  if (masterTourismDataService.destinationHealthData) {
    destinationHealthData = masterTourismDataService.destinationHealthData;
  }
  if (masterTourismDataService.reportsData.length > 0) {
    reportsData = masterTourismDataService.reportsData;
  }
}

loadData();

// Haversine distance helper
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

// Lazy Gemini AI Client initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// -------------------------------------------------------------
// System Endpoints
// -------------------------------------------------------------
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', app: 'Virasat', timestamp: new Date().toISOString() });
});

// -------------------------------------------------------------
// Master Tourism Database Architecture Endpoints
// -------------------------------------------------------------
// Unified Database Status & Storage Overview
app.get('/api/database/status', (req, res) => {
  res.json(masterTourismDataService.getStatus());
});

// Supported Master Categories and Metadata
app.get('/api/database/categories', (req, res) => {
  res.json(masterTourismDataService.getCategories());
});

// Category Records Query (with filtering, search and pagination)
app.get('/api/database/records', (req, res) => {
  const { category = 'destinations', search, city, state, limit = '50', offset = '0' } = req.query;
  const response = masterTourismDataService.getCategoryRecords(category as any, {
    category: category as any,
    search: search as string,
    city: city as string,
    state: state as string,
    limit: parseInt(limit as string, 10) || 50,
    offset: parseInt(offset as string, 10) || 0,
  });
  res.json(response);
});

// Companion Image Metadata Registry Endpoints
app.get('/api/database/images', (req, res) => {
  const { entity_id, search, limit = '100', offset = '0' } = req.query;
  if (entity_id) {
    const meta = masterTourismDataService.getImageMetadata(entity_id as string);
    const images = masterTourismDataService.getImagesForEntity(entity_id as string);
    return res.json({
      entity_id,
      metadata: meta || null,
      images,
      total: images.length,
    });
  }

  let imagesList = masterTourismDataService.images;
  if (search) {
    const q = (search as string).toLowerCase().trim();
    imagesList = imagesList.filter(
      (img) =>
        img.entity_name.toLowerCase().includes(q) ||
        img.entity_id.toLowerCase().includes(q) ||
        img.caption.toLowerCase().includes(q) ||
        (img.attribution && img.attribution.toLowerCase().includes(q))
    );
  }

  const total = imagesList.length;
  const l = parseInt(limit as string, 10) || 100;
  const off = parseInt(offset as string, 10) || 0;
  const paginated = imagesList.slice(off, off + l);

  res.json({
    total,
    limit: l,
    offset: off,
    records: paginated,
  });
});

app.get('/api/database/images/:entityId', (req, res) => {
  const { entityId } = req.params;
  const meta = masterTourismDataService.getImageMetadata(entityId);
  const images = masterTourismDataService.getImagesForEntity(entityId);
  if (!meta && images.length === 0) {
    return res.status(404).json({ error: `No verified image metadata found for entity '${entityId}'` });
  }
  res.json({
    entity_id: entityId,
    metadata: meta,
    images,
    total: images.length,
  });
});

// Master Database Sync / Ingestion Endpoint (Admin Role Required - Fixes Risk #13)
app.post('/api/database/sync', requireAuth, requireRole('admin'), (req, res) => {
  try {
    const result = masterTourismDataService.syncMasterDatabase(req.body);
    if (!req.body.dry_run) {
      syncServiceToGlobals();
    }
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err?.message || 'Sync failed' });
  }
});

// Schema template and documentation for external database ingestion
app.get('/api/database/schema-template', (req, res) => {
  res.json({
    version: masterTourismDataService.schemaVersion,
    engine: 'Unified Master Tourism Data Architecture',
    categories: masterTourismDataService.getCategories(),
    sample_format: {
      source_name: 'Master Tourism Database v1.0',
      dry_run: false,
      full_database: {
        states: [{ id: 'kerala', name: 'Kerala', capital: 'Thiruvananthapuram', region: 'South India', total_places: 45 }],
        cities: [{ id: 'kochi', name: 'Kochi', state: 'Kerala', state_id: 'kerala', lat: 9.9312, lng: 76.2673, description: 'Queen of the Arabian Sea', places_count: 24 }],
        destinations: [{ id: 'fort-kochi', name: 'Fort Kochi Heritage Zone', city: 'Kochi', state: 'Kerala', country: 'India', category: 'Heritage', summary: 'Historic colonial port town with Chinese fishing nets.', coordinates: { lat: 9.9658, lng: 76.2421 }, tags: ['heritage', 'colonial'], features: { map: true, navigation: true, ai: true, '3d': false } }],
      },
    },
  });
});

// Platform Statistics
app.get('/api/stats', (req, res) => {
  const threeDCount = Array.from(placesData.values()).filter(
    (p) => p.features?.['3d'] || p.model_3d?.has_model || p.model_3d?.available
  ).length;

  const mumbaiStationCount = mumbaiLocalNetwork
    ? (mumbaiLocalNetwork.lines?.western?.stations?.length || 0) +
      (mumbaiLocalNetwork.lines?.central?.stations?.length || 0) +
      (mumbaiLocalNetwork.lines?.harbour?.stations?.length || 0)
    : railwayStationsData.length;

  res.json({
    heritage_count: heritageData.length,
    destinations_count: placesData.size,
    states_count: statesData.length,
    cities_count: citiesData.length,
    mumbai_local_stations_count: mumbaiStationCount,
    three_d_models_count: threeDCount,
    transport_modes: ['Suburban Rail', 'Metro', 'Drive / Taxi', 'Walking', 'Bicycle'],
  });
});

// -------------------------------------------------------------
// Heritage Endpoints (42+ Curated Experiences)
// -------------------------------------------------------------
app.get('/api/heritage', (req, res) => {
  const { category, state, search, limit = '50', offset = '0' } = req.query;
  let results = [...heritageData];

  if (category && (category as string).toLowerCase() !== 'all') {
    const catQuery = (category as string).toLowerCase().trim();
    results = results.filter((h) => {
      const hCat = (h.category || '').toLowerCase();
      const hTags = (h.tags || []).map((t: string) => t.toLowerCase());
      return (
        hCat === catQuery ||
        hCat.includes(catQuery) ||
        catQuery.includes(hCat) ||
        hTags.some((t: string) => t.includes(catQuery) || catQuery.includes(t))
      );
    });
  }

  if (state && (state as string).toLowerCase() !== 'all') {
    const s = (state as string).toLowerCase().trim();
    results = results.filter((h) =>
      h.state?.toLowerCase().includes(s) ||
      (h as any).state_id?.toLowerCase() === s ||
      s.includes(h.state?.toLowerCase() || '')
    );
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city?.toLowerCase().includes(q) ||
        h.state?.toLowerCase().includes(q) ||
        h.summary?.toLowerCase().includes(q) ||
        h.historical_significance?.toLowerCase().includes(q)
    );
  }

  const lim = parseInt(limit as string, 10) || 50;
  const off = parseInt(offset as string, 10) || 0;

  res.json({
    total: results.length,
    limit: lim,
    offset: off,
    data: results.slice(off, off + lim),
  });
});

app.get('/api/heritage/:id', (req, res) => {
  const id = req.params.id.toLowerCase().trim();
  const found = heritageData.find(
    (h) => h.id.toLowerCase() === id || h.name.toLowerCase() === id || (h as any).slug?.toLowerCase() === id
  );
  if (found) {
    return res.json(found);
  }
  const place = placesData.get(id);
  if (place) return res.json(place);
  res.status(404).json({ detail: 'Heritage site not found' });
});

// -------------------------------------------------------------
// Mumbai Local Suburban Rail Module Endpoints
// -------------------------------------------------------------
app.get('/api/mumbai-local/lines', (req, res) => {
  if (!mumbaiLocalNetwork) {
    return res.status(500).json({ detail: 'Mumbai local dataset unavailable' });
  }
  res.json(mumbaiLocalNetwork);
});

app.get('/api/mumbai-local/stations', (req, res) => {
  if (!mumbaiLocalNetwork) {
    return res.status(500).json({ detail: 'Mumbai local dataset unavailable' });
  }
  const stationsMap = new Map();
  ['western', 'central', 'harbour'].forEach((lineKey) => {
    const line = mumbaiLocalNetwork.lines[lineKey];
    if (line && line.stations) {
      line.stations.forEach((st: any) => {
        if (!stationsMap.has(st.code)) {
          stationsMap.set(st.code, { ...st, lines: [line.name] });
        } else {
          const existing = stationsMap.get(st.code);
          if (!existing.lines.includes(line.name)) {
            existing.lines.push(line.name);
          }
        }
      });
    }
  });
  res.json(Array.from(stationsMap.values()));
});

app.get('/api/mumbai-local/route', (req, res) => {
  if (!mumbaiLocalNetwork) {
    return res.status(500).json({ detail: 'Mumbai local network data unavailable' });
  }
  const fromQuery = ((req.query.from as string) || '').toLowerCase().trim();
  const toQuery = ((req.query.to as string) || '').toLowerCase().trim();

  if (!fromQuery || !toQuery) {
    return res.status(400).json({ detail: 'Parameters "from" and "to" station names or codes required' });
  }

  // Find stations across all lines
  let fromStation: any = null;
  let fromLineKey = '';
  let toStation: any = null;
  let toLineKey = '';

  for (const lineKey of ['western', 'central', 'harbour']) {
    const stations = mumbaiLocalNetwork.lines[lineKey].stations;
    const s1 = stations.find(
      (s: any) => s.code.toLowerCase() === fromQuery || s.name.toLowerCase().includes(fromQuery)
    );
    const s2 = stations.find(
      (s: any) => s.code.toLowerCase() === toQuery || s.name.toLowerCase().includes(toQuery)
    );
    if (s1 && !fromStation) {
      fromStation = s1;
      fromLineKey = lineKey;
    }
    if (s2 && !toStation) {
      toStation = s2;
      toLineKey = lineKey;
    }
  }

  if (!fromStation || !toStation) {
    return res.status(404).json({ detail: 'One or both stations not found in Mumbai Suburban dataset' });
  }

  let distanceKm = 0;
  let routeType = 'direct';
  let intermediateStops: any[] = [];
  let interchangeStation: any = null;

  if (fromLineKey === toLineKey) {
    // Same line
    const stations = mumbaiLocalNetwork.lines[fromLineKey].stations;
    const idx1 = stations.findIndex((s: any) => s.code === fromStation.code);
    const idx2 = stations.findIndex((s: any) => s.code === toStation.code);
    distanceKm = Math.abs(stations[idx2].km_from_start - stations[idx1].km_from_start);
    const startIdx = Math.min(idx1, idx2);
    const endIdx = Math.max(idx1, idx2);
    intermediateStops = stations.slice(startIdx, endIdx + 1);
    if (idx1 > idx2) intermediateStops.reverse();
  } else {
    // Cross-line interchange (e.g. via Dadar, Kurla, or Sandhurst Road)
    routeType = 'interchange';
    const isWesternCentral =
      (fromLineKey === 'western' && toLineKey === 'central') ||
      (fromLineKey === 'central' && toLineKey === 'western');
    
    const interchangeCode = isWesternCentral ? 'DDR' : 'CLA';
    const interchangeName = isWesternCentral ? 'Dadar Junction' : 'Kurla Junction';

    interchangeStation = {
      code: interchangeCode,
      name: interchangeName,
      description: `Switch between ${mumbaiLocalNetwork.lines[fromLineKey].name} and ${mumbaiLocalNetwork.lines[toLineKey].name} via Foot Overbridge interchange`,
    };

    const dist1 = haversineDistanceKm(fromStation.lat, fromStation.lng, 19.0183, 72.8428);
    const dist2 = haversineDistanceKm(19.0183, 72.8428, toStation.lat, toStation.lng);
    distanceKm = Math.round((dist1 + dist2) * 10) / 10;
  }

  distanceKm = Math.max(1, Math.round(distanceKm * 10) / 10);
  const journeyMins = Math.round(distanceKm * 2.2 + (routeType === 'interchange' ? 12 : 3));

  // Determine standard railway fare slab
  let secondClass = 5;
  let firstClass = 50;
  let acLocal = 35;
  for (const slab of mumbaiLocalNetwork.fare_slabs) {
    if (distanceKm <= slab.max_km) {
      secondClass = slab.second_class;
      firstClass = slab.first_class;
      acLocal = slab.ac_local;
      break;
    }
  }

  res.json({
    from: fromStation,
    to: toStation,
    from_line: mumbaiLocalNetwork.lines[fromLineKey]?.name,
    to_line: mumbaiLocalNetwork.lines[toLineKey]?.name,
    route_type: routeType,
    interchange: interchangeStation,
    distance_km: distanceKm,
    journey_time_minutes: journeyMins,
    stops_count: intermediateStops.length || Math.round(distanceKm / 1.8),
    intermediate_stops: intermediateStops,
    fare: {
      second_class: secondClass,
      first_class: firstClass,
      ac_local: acLocal,
      currency: 'INR (₹)',
      label: 'Estimated / Dataset Standard Suburban Fare',
      source: mumbaiLocalNetwork.meta.data_source,
    },
  });
});

// Distance calculation API
app.get('/api/distance', (req, res) => {
  const { from, to, lat1, lng1, lat2, lng2 } = req.query;

  let originLat = parseFloat(lat1 as string);
  let originLng = parseFloat(lng1 as string);
  let destLat = parseFloat(lat2 as string);
  let destLng = parseFloat(lng2 as string);

  let originName = 'Point A';
  let destName = 'Point B';

  if (from) {
    const loc = resolveLocation(from as string);
    originLat = loc.latitude;
    originLng = loc.longitude;
    originName = loc.name;
  }

  if (to) {
    const loc = resolveLocation(to as string);
    destLat = loc.latitude;
    destLng = loc.longitude;
    destName = loc.name;
  }

  if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
    return res.status(400).json({ detail: 'Valid coordinates or destination names required' });
  }

  const distanceKm = haversineDistanceKm(originLat, originLng, destLat, destLng);
  const roadEstKm = Math.round(distanceKm * 1.25 * 10) / 10;

  res.json({
    origin: { name: originName, lat: originLat, lng: originLng },
    destination: { name: destName, lat: destLat, lng: destLng },
    aerial_distance_km: distanceKm,
    estimated_road_distance_km: roadEstKm,
    drive_time_mins: Math.round(roadEstKm * 3.2 + 5),
    walking_time_mins: Math.round(roadEstKm * 12.5),
  });
});

// -------------------------------------------------------------
// States & Cities Endpoints
// -------------------------------------------------------------
app.get('/api/states', (req, res) => {
  res.json(statesData);
});

app.get('/api/cities', (req, res) => {
  const stateId = req.query.state as string;
  if (stateId) {
    const filtered = citiesData.filter(
      (c) => c.state_id?.toLowerCase() === stateId.toLowerCase() || c.state?.toLowerCase() === stateId.toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(citiesData);
});

// -------------------------------------------------------------
// Destinations & Places Endpoints
// -------------------------------------------------------------
app.get(['/api/destinations', '/api/places'], (req, res) => {
  const { state, city, category, limit = '20', offset = '0' } = req.query;
  const lim = parseInt(limit as string, 10) || 20;
  const off = parseInt(offset as string, 10) || 0;

  let results = Array.from(placesData.values());

  if (state) {
    const s = (state as string).toLowerCase().trim();
    results = results.filter((p) => p.state?.toLowerCase().includes(s) || (p as any).state_id?.toLowerCase() === s);
  }

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((p) =>
      isPlaceInCity(p, c) ||
      p.city?.toLowerCase().includes(c) ||
      (p as any).city_id?.toLowerCase() === c ||
      c.includes(p.city?.toLowerCase() || '') ||
      (p.tags && Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase() === c || c.includes(t.toLowerCase())))
    );
  }

  if (category && (category as string).toLowerCase() !== 'all') {
    const cat = (category as string).toLowerCase().trim();
    results = results.filter((p) => p.category?.toLowerCase() === cat);
  }

  const total = results.length;
  const paged = results.slice(off, off + lim);

  res.json({
    total,
    limit: lim,
    offset: off,
    data: paged,
  });
});

app.get('/api/places/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 18.922;
  const lng = parseFloat(req.query.lng as string) || 72.8347;
  const radiusKm = parseFloat(req.query.radius_km as string) || 50;
  const limit = parseInt(req.query.limit as string, 10) || 6;

  const allWithDistance = Array.from(placesData.values())
    .map((p) => {
      const pLat = p.coordinates?.lat || (p as any).latitude || 0;
      const pLng = p.coordinates?.lng || (p as any).longitude || 0;
      const dist = haversineDistanceKm(lat, lng, pLat, pLng);
      return { ...p, distance_km: Math.round(dist * 10) / 10 };
    })
    .sort((a, b) => a.distance_km - b.distance_km);

  let resultsWithDistance = allWithDistance
    .filter((p) => p.distance_km <= radiusKm)
    .slice(0, limit);

  let expandedSearch = false;
  if (resultsWithDistance.length === 0) {
    // If no places within strict radius, provide closest available heritage sites
    resultsWithDistance = allWithDistance.slice(0, limit);
    expandedSearch = true;
  }

  res.json({
    origin: { latitude: lat, longitude: lng },
    radius_km: radiusKm,
    expanded_search: expandedSearch,
    total: resultsWithDistance.length,
    results: resultsWithDistance,
  });
});

app.get(['/api/destinations/:id', '/api/places/:id'], (req, res) => {
  const id = req.params.id.toLowerCase().trim();
  const place = placesData.get(id);

  if (!place) {
    // Check if slug or name matches in placesData
    for (const p of placesData.values()) {
      if (p.id.toLowerCase() === id || p.name.toLowerCase() === id || (p as any).slug === id) {
        return res.json(p);
      }
    }
    // Check heritageData
    const hMatch = heritageData.find(
      (h) => h.id.toLowerCase() === id || h.name.toLowerCase() === id || (h as any).slug?.toLowerCase() === id
    );
    if (hMatch) {
      return res.json(hMatch);
    }

    // Check India Hierarchy Database attractions across all states and cities
    const hierData = getIndiaHierarchyData();
    if (hierData && hierData.states) {
      for (const s of hierData.states) {
        for (const c of s.cities) {
          const list = [
            ...(c.heritage || []),
            ...(c.monuments || []),
            ...(c.museums || []),
            ...(c.tourist_places || []),
            ...(c.religious_cultural || []),
            ...(c.nature_parks_zoo || []),
          ];
          const match = list.find((a: any) => a.id.toLowerCase() === id || a.name.toLowerCase() === id);
          if (match) {
            const converted = {
              id: match.id,
              name: match.name,
              city: c.name,
              state: s.name,
              state_id: s.id,
              region: s.region,
              district: c.district,
              coordinates: match.coordinates || c.coordinates,
              category: match.category || 'heritage',
              category_label: match.category_label || 'Heritage & Cultural',
              short_description: match.summary,
              description: match.historical_significance || match.summary,
              hero_image_url: match.image_url || match.thumbnail_url || c.hero_image_url || s.hero_image_url,
              thumbnail_url: match.thumbnail_url || match.image_url || c.hero_image_url,
              visiting_info: {
                entry_fee: match.fees?.free_entry ? 'Free Entry' : `₹${match.fees?.domestic || 40} (Domestic) / ₹${match.fees?.international || 500} (Foreign)`,
                entry_fee_domestic: match.fees?.free_entry ? 0 : match.fees?.domestic || 40,
                entry_fee_international: match.fees?.free_entry ? 0 : match.fees?.international || 500,
                timings: `${match.timings?.opening_time || '09:00 AM'} - ${match.timings?.closing_time || '05:30 PM'}`,
                closed_days: match.timings?.closed_days || [],
                best_time_to_visit: c.live_travel_info?.best_season || 'October to March',
                photography_allowed: true,
                guided_tours: true,
                typical_visit_duration: match.visit_duration?.label || '2 - 3 Hours',
                dress_code: 'Modest cultural attire recommended',
              },
              tags: match.tags || [s.name, c.name, match.category_label || 'Heritage'],
              rating: 4.8,
              reviews_count: 850,
              unesco_status: match.category === 'heritage' || (match.tags && match.tags.includes('UNESCO')),
              asi_protected: true,
            };
            return res.json(converted);
          }
        }
      }
    }

    return res.status(404).json({ detail: 'Place not found' });
  }

  // Calculate nearby railway stations if available
  const pLat = place.coordinates?.lat || (place as any).latitude || 18.922;
  const pLng = place.coordinates?.lng || (place as any).longitude || 72.8347;
  const nearbyStations = railwayStationsData
    .map((s) => {
      const dist = haversineDistanceKm(pLat, pLng, s.lat, s.lng);
      return {
        id: s.id,
        name: s.name,
        code: s.code,
        line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
        distance_km: dist,
        walking_time_mins: Math.round(dist * 13),
        road_time_mins: Math.round(dist * 4 + 3),
        transfer_modes: dist < 1.0 ? ['Walk', 'Auto'] : ['Taxi', 'BEST Bus', 'Metro'],
      };
    })
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, 3);

  // Calculate nearby hotels / accommodations
  const nearbyHotels = hotelsData
    .map((h) => {
      const dist = haversineDistanceKm(pLat, pLng, h.lat, h.lng);
      return {
        ...h,
        calculated_distance_km: dist,
      };
    })
    .sort((a, b) => a.calculated_distance_km - b.calculated_distance_km)
    .slice(0, 4);

  res.json({
    ...place,
    nearby_stations: nearbyStations,
    nearby_hotels: nearbyHotels,
  });
});

// Nearby Hotels endpoint
app.get('/api/hotels/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const city = ((req.query.city as string) || '').toLowerCase().trim();
  const radius = parseFloat(req.query.radius as string) || 35;

  let matches = [...hotelsData];
  if (!isNaN(lat) && !isNaN(lng)) {
    matches = matches
      .map((h) => ({
        ...h,
        calculated_distance_km: haversineDistanceKm(lat, lng, h.lat, h.lng),
      }))
      .filter((h) => h.calculated_distance_km <= radius)
      .sort((a, b) => a.calculated_distance_km - b.calculated_distance_km);
  } else if (city) {
    matches = matches.filter((h) => h.city.toLowerCase().includes(city));
  }

  res.json({
    total: matches.length,
    results: matches.slice(0, 8),
  });
});

// Fare Tariffs configuration endpoint
app.get('/api/fares/tariffs', (req, res) => {
  res.json(faresConfig || { error: 'Fares configuration not loaded' });
});

// -------------------------------------------------------------
// Cultural Heritage, Artisans & Local Experience Endpoints
// -------------------------------------------------------------
app.get('/api/culture', (req, res) => {
  const { city, category } = req.query;
  let results = [...cultureData];

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((item) => item.city?.toLowerCase().includes(c) || item.state?.toLowerCase().includes(c));
  }

  if (category) {
    const cat = (category as string).toLowerCase().trim();
    results = results.filter((item) => item.category?.toLowerCase().includes(cat));
  }

  res.json(results);
});

app.get('/api/artisans', (req, res) => {
  const { city, gi_only } = req.query;
  let results = [...artisansData];

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((a) => a.city?.toLowerCase().includes(c) || a.state?.toLowerCase().includes(c));
  }

  if (gi_only === 'true') {
    results = results.filter((a) => a.gi_tag_status === true);
  }

  res.json(results);
});

app.get('/api/providers', (req, res) => {
  const { city, category, verification_status } = req.query;
  let results = [...providersData];

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((p) => p.city?.toLowerCase().includes(c) || p.state?.toLowerCase().includes(c));
  }

  if (category) {
    const cat = (category as string).toUpperCase().trim();
    results = results.filter((p) => p.category?.toUpperCase() === cat);
  }

  if (verification_status) {
    const v = (verification_status as string).toUpperCase().trim();
    results = results.filter((p) => p.verification_status?.toUpperCase() === v);
  }

  res.json(results);
});

// -------------------------------------------------------------
// Facilities & Accessibility Endpoints
// -------------------------------------------------------------
app.get('/api/facilities', (req, res) => {
  const { city, type, accessible } = req.query;
  let results = [...facilitiesData];

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((f) => f.city?.toLowerCase().includes(c));
  }

  if (type) {
    const t = (type as string).toUpperCase().trim();
    results = results.filter((f) => f.type?.toUpperCase() === t);
  }

  if (accessible === 'true') {
    results = results.filter((f) => f.is_accessible === true);
  }

  res.json(results);
});

app.get('/api/facilities/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 18.922;
  const lng = parseFloat(req.query.lng as string) || 72.8347;
  const radiusKm = parseFloat(req.query.radius_km as string) || 5;

  const nearby = facilitiesData
    .map((f) => {
      const dist = haversineDistanceKm(lat, lng, f.lat, f.lng);
      return { ...f, distance_km: dist };
    })
    .filter((f) => f.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);

  res.json(nearby);
});

app.get('/api/accessibility', (req, res) => {
  const { place_id, city, wheelchair } = req.query;
  let results = [...accessibilityData];

  if (place_id) {
    const pid = (place_id as string).toLowerCase().trim();
    results = results.filter((a) => a.place_id.toLowerCase() === pid);
  }

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((a) => a.city?.toLowerCase().includes(c) || a.state?.toLowerCase().includes(c));
  }

  if (wheelchair) {
    const w = (wheelchair as string).toUpperCase().trim();
    results = results.filter((a) => a.wheelchair_access === w);
  }

  res.json(results);
});

// -------------------------------------------------------------
// Heritage Clusters & Commuter Networks Endpoints
// -------------------------------------------------------------
app.get('/api/clusters', (req, res) => {
  const { city } = req.query;
  let results = [...clustersData];

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((cl) => cl.city?.toLowerCase().includes(c) || cl.state?.toLowerCase().includes(c));
  }

  res.json(results);
});

app.get('/api/suburban-networks', (req, res) => {
  const { city } = req.query;
  let results = [...suburbanNetworksData];

  if (city) {
    const c = (city as string).toLowerCase().trim();
    results = results.filter((n) => n.city?.toLowerCase().includes(c));
  }

  res.json(results);
});

// -------------------------------------------------------------
// Destination Health Dashboard & Tourism Gap Map Endpoints
// -------------------------------------------------------------
app.get('/api/destination-health', (req, res) => {
  const { city } = req.query;
  if (!destinationHealthData) {
    return res.status(503).json({ error: 'Destination health metrics not loaded' });
  }

  if (city) {
    const c = (city as string).toLowerCase().trim();
    const cityMetrics = destinationHealthData.cities?.filter(
      (item: any) => item.city_id?.toLowerCase().includes(c) || item.city_name?.toLowerCase().includes(c)
    );
    const gapZones = destinationHealthData.gap_map_zones?.filter(
      (zone: any) => zone.city?.toLowerCase().includes(c)
    );

    return res.json({
      provenance_disclaimer: destinationHealthData.provenance_disclaimer,
      provenance_badge: destinationHealthData.provenance_badge,
      cities: cityMetrics || [],
      gap_map_zones: gapZones || [],
    });
  }

  res.json(destinationHealthData);
});

// -------------------------------------------------------------
// Heritage Condition Reporting Workflow Endpoints (Persistent DB & RBAC)
// -------------------------------------------------------------
app.use('/api/reports', reportsRouter);

// -------------------------------------------------------------
// Search Endpoint & Unified Autocomplete Suggestions
// -------------------------------------------------------------
app.get('/api/search', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase().trim();
  const limit = parseInt(req.query.limit as string, 10) || 30;

  if (!query) {
    return res.json([]);
  }

  const matches = Array.from(placesData.values())
    .filter((p) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query) ||
        p.state.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.summary?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
      );
    })
    .slice(0, limit);

  res.json(matches);
});

export interface LocationSuggestion {
  id: string;
  name: string;
  code?: string;
  type: 'station' | 'heritage' | 'place' | 'city';
  categoryType: 'station' | 'heritage' | 'place' | 'city';
  city?: string;
  state?: string;
  lat: number;
  lng: number;
  subtitle: string;
  badge: string;
  score: number;
}

app.get('/api/locations/suggest', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase().trim();
  const limit = parseInt(req.query.limit as string, 10) || 12;

  if (!query) {
    return res.json([]);
  }

  const cleanQ = query.replace(/[^a-z0-9]/g, '');
  const tokens = query.split(/[\s,.-]+/).filter(t => t.length > 1);
  const isRailQuery = /station|railway|stn|junction|terminus|cantt|rail|terminal/i.test(query);

  const suggestions: LocationSuggestion[] = [];
  const seenIds = new Set<string>();
  const seenNameKeys = new Set<string>();

  // 1. Search Railway Stations
  for (const s of railwayStationsData) {
    const sName = s.name.toLowerCase();
    const sCode = (s.code || '').toLowerCase();
    const sCity = s.city.toLowerCase();
    const sCleanName = sName.replace(/[^a-z0-9]/g, '');

    let score = 0;
    if (sCode === query || cleanQ === sCode) score += 100;
    else if (sCleanName === cleanQ) score += 90;
    else if (sCode.startsWith(query)) score += 80;
    else if (sName.startsWith(query)) score += 70;
    else if (sName.includes(query)) score += 50;
    else if (query.includes(sCity) && isRailQuery) score += 65;
    else if (tokens.length > 0 && tokens.every(tok => sName.includes(tok) || sCity.includes(tok) || sCode.includes(tok))) score += 45;

    const uniqueId = s.id;
    if (score > 0 && !seenIds.has(uniqueId)) {
      seenIds.add(uniqueId);
      seenNameKeys.add(`station:${sCleanName}`);
      suggestions.push({
        id: uniqueId,
        name: s.name,
        code: s.code,
        type: 'station',
        categoryType: 'station',
        city: s.city,
        state: s.state,
        lat: s.lat,
        lng: s.lng,
        subtitle: `${s.code ? `[${s.code}] ` : ''}${s.city}, ${s.state} · Indian Railways`,
        badge: s.is_junction ? 'Major Rail Junction' : 'Railway Station',
        score: score + (isRailQuery ? 20 : 0),
      });
    }
  }

  // 2. Search Heritage Monuments
  for (const h of heritageData) {
    const hName = h.name.toLowerCase();
    const hCity = (h.city || '').toLowerCase();
    const hState = (h.state || '').toLowerCase();
    const hClean = hName.replace(/[^a-z0-9]/g, '');

    let score = 0;
    if (h.id.toLowerCase() === query || hClean === cleanQ) score += 95;
    else if (hName.startsWith(query)) score += 75;
    else if (hName.includes(query)) score += 55;
    else if (tokens.length > 0 && tokens.every(tok => hName.includes(tok) || hCity.includes(tok) || hState.includes(tok))) score += 40;

    // Disambiguate if an existing station shares the exact same ID (e.g. csmt)
    const uniqueId = seenIds.has(h.id) ? `heritage-${h.id}` : h.id;
    if (score > 0 && !seenIds.has(uniqueId)) {
      seenIds.add(uniqueId);
      seenNameKeys.add(`heritage:${hClean}`);
      seenNameKeys.add(`place:${hClean}`);
      seenIds.add(`monument-${h.id}`);
      suggestions.push({
        id: uniqueId,
        name: h.name,
        type: 'heritage',
        categoryType: 'heritage',
        city: h.city,
        state: h.state,
        lat: h.coordinates?.lat || 28.6129,
        lng: h.coordinates?.lng || 77.2295,
        subtitle: `${h.city ? `${h.city}, ` : ''}${h.state} · ${h.category || 'National Monument'}`,
        badge: h.unesco ? 'UNESCO Heritage' : 'ASI Monument',
        score,
      });
    }
  }

  // 3. Search Places & Attractions (skip duplicate monuments already returned)
  for (const p of placesData.values()) {
    const pName = p.name.toLowerCase();
    const pCity = (p.city || '').toLowerCase();
    const pClean = pName.replace(/[^a-z0-9]/g, '');

    // If identical place or heritage monument is already in suggestions, skip duplicate
    if (seenIds.has(p.id) || seenIds.has(`monument-${p.id}`) || seenNameKeys.has(`heritage:${pClean}`) || seenNameKeys.has(`place:${pClean}`)) {
      continue;
    }

    let score = 0;
    if (p.id.toLowerCase() === query || pClean === cleanQ) score += 90;
    else if (pName.startsWith(query)) score += 70;
    else if (pName.includes(query)) score += 48;
    else if (tokens.length > 0 && tokens.every(tok => pName.includes(tok) || pCity.includes(tok))) score += 35;

    const uniqueId = seenIds.has(p.id) ? `place-${p.id}` : p.id;
    if (score > 0 && !seenIds.has(uniqueId)) {
      seenIds.add(uniqueId);
      seenNameKeys.add(`place:${pClean}`);
      suggestions.push({
        id: uniqueId,
        name: p.name,
        type: 'place',
        categoryType: 'place',
        city: p.city,
        state: p.state,
        lat: p.coordinates?.lat || 28.6129,
        lng: p.coordinates?.lng || 77.2295,
        subtitle: `${p.city}, ${p.state} · ${p.category || 'Sight'}`,
        badge: p.rating ? `★ ${p.rating}` : 'Tourist Landmark',
        score,
      });
    }
  }

  // 4. Search Cities
  for (const c of citiesData) {
    const cName = c.name.toLowerCase();
    const cClean = cName.replace(/[^a-z0-9]/g, '');

    let score = 0;
    if (c.id.toLowerCase() === query || cClean === cleanQ) score += 85;
    else if (cName.startsWith(query)) score += 65;
    else if (cName.includes(query)) score += 40;

    const uniqueId = seenIds.has(c.id) ? `city-${c.id}` : c.id;
    if (score > 0 && !seenIds.has(uniqueId)) {
      seenIds.add(uniqueId);
      suggestions.push({
        id: uniqueId,
        name: c.name,
        type: 'city',
        categoryType: 'city',
        city: c.name,
        state: c.state,
        lat: c.lat,
        lng: c.lng,
        subtitle: `${c.state} · ${c.places_count ? `${c.places_count} sights` : 'City Destination'}`,
        badge: 'City / Region',
        score: score - (isRailQuery ? 15 : 0),
      });
    }
  }

  suggestions.sort((a, b) => b.score - a.score);
  res.json(suggestions.slice(0, limit));
});

// -------------------------------------------------------------
// Railway Stations Endpoints
// -------------------------------------------------------------
app.get('/api/railway-stations', (req, res) => {
  const city = req.query.city as string;
  let results = railwayStationsData;

  if (city) {
    const c = city.toLowerCase();
    results = results.filter((s) => s.city.toLowerCase().includes(c));
  }

  const mapped = results.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    city: s.city,
    state: s.state,
    lat: s.lat,
    lng: s.lng,
    line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
    lines: s.lines || [],
    is_junction: Boolean(s.is_junction),
    distance_km: 1.5,
    walking_time_mins: 18,
    road_time_mins: 8,
    transfer_modes: ['Taxi', 'Bus', 'Walk'],
  }));

  res.json(mapped);
});

app.get('/api/railway-stations/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 28.6129;
  const lng = parseFloat(req.query.lng as string) || 77.2295;
  const limit = parseInt(req.query.limit as string, 10) || 3;

  const nearby = railwayStationsData
    .map((s) => {
      const dist = haversineDistanceKm(lat, lng, s.lat, s.lng);
      return {
        id: s.id,
        name: s.name,
        code: s.code,
        city: s.city,
        state: s.state,
        lat: s.lat,
        lng: s.lng,
        line: s.lines ? s.lines.join(', ') : 'Suburban Hub',
        lines: s.lines || [],
        is_junction: Boolean(s.is_junction),
        distance_km: dist,
        walking_time_mins: Math.round(dist * 13),
        road_time_mins: Math.round(dist * 4 + 3),
        transfer_modes: dist < 1.0 ? ['Walk', 'Auto'] : ['Taxi', 'Transit Bus'],
      };
    })
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit);

  res.json(nearby);
});

// -------------------------------------------------------------
// Multi-modal Routing & Directions Endpoints
// -------------------------------------------------------------
function generateRoutePath(lat1: number, lon1: number, lat2: number, lon2: number, mode: string): [number, number][] {
  const points: [number, number][] = [];
  const numSteps = Math.min(25, Math.max(8, Math.round(haversineDistanceKm(lat1, lon1, lat2, lon2) * 2)));
  
  // Vector between origin and destination
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const distance = Math.sqrt(dLat * dLat + dLon * dLon);
  
  // Perpendicular vector for slight realistic road curving
  const perpLat = -dLon / (distance || 1);
  const perpLon = dLat / (distance || 1);
  const curveFactor = mode === 'WALK' ? 0.0008 : mode === 'BICYCLE' ? 0.0012 : 0.002;

  points.push([lat1, lon1]);

  for (let i = 1; i < numSteps; i++) {
    const fraction = i / numSteps;
    // Sinusoidal displacement along perpendicular axis
    const wobble = Math.sin(fraction * Math.PI) * Math.sin(fraction * 3 * Math.PI) * curveFactor;
    const ptLat = lat1 + dLat * fraction + perpLat * wobble;
    const ptLon = lon1 + dLon * fraction + perpLon * wobble;
    points.push([Math.round(ptLat * 100000) / 100000, Math.round(ptLon * 100000) / 100000]);
  }

  points.push([lat2, lon2]);
  return points;
}

function resolveLocation(queryOrId?: string, lat?: number, lng?: number, cityContext?: string) {
  if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
    return { name: queryOrId || 'Custom Location', place_id: null, latitude: lat, longitude: lng };
  }

  const raw = (queryOrId || '').trim();
  const q = raw.toLowerCase();
  const cContext = (cityContext || '').toLowerCase().trim();

  // Known station aliases
  const STATION_ALIASES: Record<string, { name: string; id: string; lat: number; lng: number }> = {
    csmt: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', id: 'csmt', lat: 18.9400, lng: 72.8353 },
    cst: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', id: 'csmt', lat: 18.9400, lng: 72.8353 },
    mumbaicsmt: { name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', id: 'csmt', lat: 18.9400, lng: 72.8353 },
    sina: { name: 'Srinagar Railway Station (SINA)', id: 'srinagar-stn', lat: 34.0384, lng: 74.8384 },
    srinagarstn: { name: 'Srinagar Railway Station (SINA)', id: 'srinagar-stn', lat: 34.0384, lng: 74.8384 },
    srinagarstation: { name: 'Srinagar Railway Station (SINA)', id: 'srinagar-stn', lat: 34.0384, lng: 74.8384 },
    srinagarrailwaystation: { name: 'Srinagar Railway Station (SINA)', id: 'srinagar-stn', lat: 34.0384, lng: 74.8384 },
    svdk: { name: 'Shri Mata Vaishno Devi Katra (SVDK)', id: 'katra-svdk', lat: 32.9856, lng: 74.9547 },
    katrastation: { name: 'Shri Mata Vaishno Devi Katra (SVDK)', id: 'katra-svdk', lat: 32.9856, lng: 74.9547 },
    jat: { name: 'Jammu Tawi (JAT)', id: 'jammu-tawi', lat: 32.7058, lng: 74.8789 },
    jammustation: { name: 'Jammu Tawi (JAT)', id: 'jammu-tawi', lat: 32.7058, lng: 74.8789 },
    bahl: { name: 'Banihal Railway Station (BAHL)', id: 'banihal-stn', lat: 33.4981, lng: 75.2017 },
    ndls: { name: 'New Delhi Railway Station (NDLS)', id: 'ndls', lat: 28.6430, lng: 77.2195 },
    delhistation: { name: 'New Delhi Railway Station (NDLS)', id: 'ndls', lat: 28.6430, lng: 77.2195 },
    dli: { name: 'Old Delhi Railway Station (DLI)', id: 'dli', lat: 28.6619, lng: 77.2280 },
    nzm: { name: 'Hazrat Nizamuddin (NZM)', id: 'nzm', lat: 28.5888, lng: 77.2534 },
    mmct: { name: 'Mumbai Central (MMCT)', id: 'mumbai-central', lat: 18.9696, lng: 72.8193 },
    mumbaicentral: { name: 'Mumbai Central (MMCT)', id: 'mumbai-central', lat: 18.9696, lng: 72.8193 },
    jp: { name: 'Jaipur Junction (JP)', id: 'jp', lat: 26.9196, lng: 75.7878 },
    jaipurstation: { name: 'Jaipur Junction (JP)', id: 'jp', lat: 26.9196, lng: 75.7878 },
    agc: { name: 'Agra Cantt (AGC)', id: 'agc', lat: 27.1578, lng: 77.9904 },
    agrastation: { name: 'Agra Cantt (AGC)', id: 'agc', lat: 27.1578, lng: 77.9904 },
    bsb: { name: 'Varanasi Junction (BSB)', id: 'bsb', lat: 25.3283, lng: 82.9858 },
    varanasistation: { name: 'Varanasi Junction (BSB)', id: 'bsb', lat: 25.3283, lng: 82.9858 },
    sbc: { name: 'KSR Bengaluru (SBC)', id: 'sbc', lat: 12.9781, lng: 77.5694 },
    bengalurustation: { name: 'KSR Bengaluru (SBC)', id: 'sbc', lat: 12.9781, lng: 77.5694 },
    bangalorestation: { name: 'KSR Bengaluru (SBC)', id: 'sbc', lat: 12.9781, lng: 77.5694 },
    mas: { name: 'Chennai Central (MAS)', id: 'mas', lat: 13.0827, lng: 80.2756 },
    chennaistation: { name: 'Chennai Central (MAS)', id: 'mas', lat: 13.0827, lng: 80.2756 },
    hwh: { name: 'Howrah Junction (HWH)', id: 'hwh', lat: 22.5833, lng: 88.3425 },
    kolkatastation: { name: 'Howrah Junction (HWH)', id: 'hwh', lat: 22.5833, lng: 88.3425 },
    howrahstation: { name: 'Howrah Junction (HWH)', id: 'hwh', lat: 22.5833, lng: 88.3425 },
    adi: { name: 'Ahmedabad Junction (ADI)', id: 'adi', lat: 23.0225, lng: 72.5714 },
    ahmedabadstation: { name: 'Ahmedabad Junction (ADI)', id: 'adi', lat: 23.0225, lng: 72.5714 },
    pune: { name: 'Pune Junction (PUNE)', id: 'pune', lat: 18.5289, lng: 73.8744 },
    punestation: { name: 'Pune Junction (PUNE)', id: 'pune', lat: 18.5289, lng: 73.8744 },
    lko: { name: 'Lucknow Charbagh (LKO)', id: 'lucknow-charbagh', lat: 26.8317, lng: 80.9248 },
    lucknowstation: { name: 'Lucknow Charbagh (LKO)', id: 'lucknow-charbagh', lat: 26.8317, lng: 80.9248 },
    bpl: { name: 'Bhopal Junction (BPL)', id: 'bhopal-jn', lat: 23.2599, lng: 77.4126 },
    bhopalstation: { name: 'Bhopal Junction (BPL)', id: 'bhopal-jn', lat: 23.2599, lng: 77.4126 },
    st: { name: 'Surat Railway Station (ST)', id: 'surat-stn', lat: 21.2049, lng: 72.8407 },
    suratstation: { name: 'Surat Railway Station (ST)', id: 'surat-stn', lat: 21.2049, lng: 72.8407 },
    brc: { name: 'Vadodara Junction (BRC)', id: 'vadodara-jn', lat: 22.3107, lng: 73.1812 },
    vadodarastation: { name: 'Vadodara Junction (BRC)', id: 'vadodara-jn', lat: 22.3107, lng: 73.1812 },
    barodastation: { name: 'Vadodara Junction (BRC)', id: 'vadodara-jn', lat: 22.3107, lng: 73.1812 },
    pnbe: { name: 'Patna Junction (PNBE)', id: 'patna-jn', lat: 25.6022, lng: 85.1376 },
    patnastation: { name: 'Patna Junction (PNBE)', id: 'patna-jn', lat: 25.6022, lng: 85.1376 },
    ghy: { name: 'Guwahati Railway Station (GHY)', id: 'guwahati-jn', lat: 26.1824, lng: 91.7516 },
    guwahatistation: { name: 'Guwahati Railway Station (GHY)', id: 'guwahati-jn', lat: 26.1824, lng: 91.7516 },
    bbs: { name: 'Bhubaneswar Railway Station (BBS)', id: 'bhubaneswar-jn', lat: 20.2666, lng: 85.8436 },
    bhubaneswarstation: { name: 'Bhubaneswar Railway Station (BBS)', id: 'bhubaneswar-jn', lat: 20.2666, lng: 85.8436 },
    puri: { name: 'Puri Railway Station (PURI)', id: 'puri-stn', lat: 19.8135, lng: 85.8315 },
    puristation: { name: 'Puri Railway Station (PURI)', id: 'puri-stn', lat: 19.8135, lng: 85.8315 },
    mao: { name: 'Madgaon Junction (MAO)', id: 'madgaon-jn', lat: 15.2736, lng: 73.9678 },
    goastation: { name: 'Madgaon Junction Goa (MAO)', id: 'madgaon-jn', lat: 15.2736, lng: 73.9678 },
    madgaonstation: { name: 'Madgaon Junction Goa (MAO)', id: 'madgaon-jn', lat: 15.2736, lng: 73.9678 },
    cdg: { name: 'Chandigarh Junction (CDG)', id: 'chandigarh-jn', lat: 30.7056, lng: 76.8013 },
    chandigarhstation: { name: 'Chandigarh Junction (CDG)', id: 'chandigarh-jn', lat: 30.7056, lng: 76.8013 },
    asr: { name: 'Amritsar Junction (ASR)', id: 'asr', lat: 31.6340, lng: 74.8723 },
    amritsarstation: { name: 'Amritsar Junction (ASR)', id: 'asr', lat: 31.6340, lng: 74.8723 },
    sml: { name: 'Shimla Railway Station (SML)', id: 'shimla-stn', lat: 31.1039, lng: 77.1644 },
    shimlastation: { name: 'Shimla Railway Station (SML)', id: 'shimla-stn', lat: 31.1039, lng: 77.1644 },
    ers: { name: 'Ernakulam Junction (ERS)', id: 'ers', lat: 9.9678, lng: 76.2891 },
    kochistation: { name: 'Ernakulam Junction (ERS)', id: 'ers', lat: 9.9678, lng: 76.2891 },
    ernakulamstation: { name: 'Ernakulam Junction (ERS)', id: 'ers', lat: 9.9678, lng: 76.2891 },
    tvc: { name: 'Thiruvananthapuram Central (TVC)', id: 'trivandrum-central', lat: 8.4875, lng: 76.9532 },
    trivandrumstation: { name: 'Thiruvananthapuram Central (TVC)', id: 'trivandrum-central', lat: 8.4875, lng: 76.9532 },
  };

  const cleanQ = q.replace(/[^a-z0-9]/g, '');
  if (STATION_ALIASES[cleanQ]) {
    const a = STATION_ALIASES[cleanQ];
    return { name: a.name, place_id: a.id, latitude: a.lat, longitude: a.lng };
  }

  // Generic City Station matcher (e.g. "srinagar station", "jaipur station", "agra railway station")
  const isRailSearch = /station|railway|stn|junction|terminus|cantt|rail|terminal/i.test(q);
  if (isRailSearch) {
    for (const c of citiesData) {
      const cNameLower = c.name.toLowerCase();
      const cIdLower = c.id.toLowerCase();
      if (q.includes(cNameLower) || q.includes(cIdLower) || cleanQ.includes(cNameLower.replace(/[^a-z0-9]/g, ''))) {
        const stn = railwayStationsData.find(
          s => s.city.toLowerCase() === cNameLower || s.city.toLowerCase() === cIdLower || s.name.toLowerCase().includes(cNameLower)
        );
        if (stn) {
          return { name: stn.name, place_id: stn.id, latitude: stn.lat, longitude: stn.lng };
        }
        return { name: `${c.name} Railway Station`, place_id: `${c.id}-stn`, latitude: c.lat, longitude: c.lng };
      }
    }
  }

  // Match against authentic major railway stations
  for (const [code, stn] of Object.entries(MAJOR_RAILWAY_STATIONS)) {
    const cLower = code.toLowerCase();
    const nameLower = stn.name.toLowerCase();
    const cleanName = nameLower.replace(/[^a-z0-9]/g, '');
    if (
      cleanQ === cLower ||
      q === cLower ||
      cleanQ === cleanName ||
      cleanName.includes(cleanQ) ||
      cleanQ.includes(cleanName) ||
      nameLower.includes(q) ||
      q.includes(nameLower)
    ) {
      return { name: stn.name, place_id: cLower, latitude: stn.lat, longitude: stn.lng };
    }
  }

  // Tokenize query
  const queryTokens = q.split(/[\s,.-]+/).filter(t => t.length > 1 && !['station', 'railway', 'stn', 'jn', 'junction', 'terminus', 'the', 'in', 'at', 'of'].includes(t));

  // If query explicitly mentions railway/station or contains known rail keywords
  if (isRailSearch || queryTokens.length > 0) {
    const stationMatch = railwayStationsData.find(s => {
      const sName = s.name.toLowerCase();
      const sCode = s.code.toLowerCase();
      if (sCode === q || s.id.toLowerCase() === q) return true;
      if (sName === q || sName.includes(q) || q.includes(sName)) return true;
      if (queryTokens.length > 0 && queryTokens.every(tok => sName.includes(tok) || sCode.includes(tok))) return true;
      return false;
    });

    if (stationMatch && (isRailSearch || !placesData.get(q))) {
      return { name: stationMatch.name, place_id: stationMatch.id, latitude: stationMatch.lat, longitude: stationMatch.lng };
    }
  }

  // 1. Direct place ID or slug match
  if (q) {
    let place = placesData.get(q);
    if (!place) {
      for (const p of placesData.values()) {
        const pName = p.name.toLowerCase();
        if (p.id.toLowerCase() === q || pName === q || pName.includes(q)) {
          place = p;
          break;
        }
        if (queryTokens.length > 0 && queryTokens.every(tok => pName.includes(tok))) {
          place = p;
          break;
        }
      }
    }
    if (place) {
      return {
        name: place.name,
        place_id: place.id,
        latitude: place.coordinates?.lat || 28.6129,
        longitude: place.coordinates?.lng || 77.2295,
      };
    }

    // 2. Heritage match
    const h = heritageData.find(item => {
      const hName = item.name.toLowerCase();
      return item.id.toLowerCase() === q || hName.includes(q) || (queryTokens.length > 0 && queryTokens.every(tok => hName.includes(tok)));
    });
    if (h) {
      return {
        name: h.name,
        place_id: h.id,
        latitude: h.coordinates?.lat || 28.6129,
        longitude: h.coordinates?.lng || 77.2295,
      };
    }

    // 3. Railway station match (general)
    const station = railwayStationsData.find(s => {
      const sName = s.name.toLowerCase();
      const sCode = s.code.toLowerCase();
      return s.id.toLowerCase() === q || sCode === q || sName.includes(q) || (queryTokens.length > 0 && queryTokens.some(tok => sName.includes(tok)));
    });
    if (station) {
      return { name: station.name, place_id: station.id, latitude: station.lat, longitude: station.lng };
    }

    // 4. City match
    const city = citiesData.find(c => {
      const cName = c.name.toLowerCase();
      return c.id.toLowerCase() === q || cName === q || cName.includes(q) || (queryTokens.length > 0 && queryTokens.some(tok => cName.includes(tok)));
    });
    if (city) {
      return { name: city.name, place_id: city.id, latitude: city.lat, longitude: city.lng };
    }

    // 5. State match
    const state = statesData.find((s) => s.id.toLowerCase() === q || s.name.toLowerCase() === q || s.name.toLowerCase().includes(q));
    if (state && state.coordinates) {
      return { name: state.name, place_id: state.id, latitude: state.coordinates.lat, longitude: state.coordinates.lng };
    }
  }

  // Fallback if query not found or not specified: resolve via cityContext
  if (cContext) {
    const cityMatch = citiesData.find((c) => c.id.toLowerCase() === cContext || c.name.toLowerCase().includes(cContext));
    if (cityMatch) {
      // Find primary landmark in this city
      const landmark = Array.from(placesData.values()).find((p) => isPlaceInCity(p, cityMatch.name));
      if (landmark) {
        return {
          name: landmark.name,
          place_id: landmark.id,
          latitude: landmark.coordinates?.lat || cityMatch.lat,
          longitude: landmark.coordinates?.lng || cityMatch.lng,
        };
      }
      return { name: cityMatch.name, place_id: cityMatch.id, latitude: cityMatch.lat, longitude: cityMatch.lng };
    }
  }

  // Final fallback to Delhi India Gate
  return { name: raw || 'India Gate, Delhi', place_id: 'india-gate', latitude: 28.6129, longitude: 77.2295 };
}

// -------------------------------------------------------------
// Graph Network Model & Dijkstra Routing Engine for Pan-India Transit
// -------------------------------------------------------------
interface GraphNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface GraphEdge {
  from: string;
  to: string;
  distance_km: number;
  rail_time_hours: number;
  road_time_hours: number;
  corridor_name: string;
  rail_fare_3ac: number;
  rail_fare_sl: number;
}

const ROUTING_GRAPH_NODES: Record<string, GraphNode> = {
  mumbai: { id: 'mumbai', name: 'Mumbai', lat: 18.9431, lng: 72.8230 },
  delhi: { id: 'delhi', name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  agra: { id: 'agra', name: 'Agra', lat: 27.1767, lng: 78.0081 },
  jaipur: { id: 'jaipur', name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  varanasi: { id: 'varanasi', name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  amritsar: { id: 'amritsar', name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
  kolkata: { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  chennai: { id: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  bengaluru: { id: 'bengaluru', name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  hyderabad: { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  kochi: { id: 'kochi', name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  goa: { id: 'goa', name: 'Goa', lat: 15.4909, lng: 73.8278 },
  ahmedabad: { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  bhopal: { id: 'bhopal', name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
  bhubaneswar: { id: 'bhubaneswar', name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
  aurangabad: { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar', lat: 19.8762, lng: 75.3433 },
  hampi: { id: 'hampi', name: 'Hampi (Hosapete)', lat: 15.3350, lng: 76.4600 },
  madurai: { id: 'madurai', name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  srinagar: { id: 'srinagar', name: 'Srinagar (Kashmir)', lat: 34.0384, lng: 74.8384 },
  jammu: { id: 'jammu', name: 'Jammu Tawi', lat: 32.7058, lng: 74.8789 },
  chandigarh: { id: 'chandigarh', name: 'Chandigarh', lat: 30.7333, lng: 76.7794 }
};

const ROUTING_GRAPH_EDGES: GraphEdge[] = [
  { from: 'srinagar', to: 'jammu', distance_km: 260, rail_time_hours: 4.5, road_time_hours: 6.0, corridor_name: 'USBRL / NH44 Kashmir Trunk Highway', rail_fare_3ac: 450, rail_fare_sl: 150 },
  { from: 'jammu', to: 'amritsar', distance_km: 215, rail_time_hours: 3.5, road_time_hours: 4.5, corridor_name: 'Northern Punjab Frontier Corridor', rail_fare_3ac: 490, rail_fare_sl: 160 },
  { from: 'jammu', to: 'delhi', distance_km: 580, rail_time_hours: 8.2, road_time_hours: 9.5, corridor_name: 'Vande Bharat / NH44 Northern Trunk', rail_fare_3ac: 1250, rail_fare_sl: 380 },
  { from: 'chandigarh', to: 'delhi', distance_km: 245, rail_time_hours: 3.0, road_time_hours: 4.0, corridor_name: 'Shatabdi Express / NH44 Corridor', rail_fare_3ac: 590, rail_fare_sl: 190 },
  { from: 'delhi', to: 'agra', distance_km: 210, rail_time_hours: 1.8, road_time_hours: 3.2, corridor_name: 'Gatimaan / Yamuna Expressway Corridor', rail_fare_3ac: 580, rail_fare_sl: 180 },
  { from: 'delhi', to: 'jaipur', distance_km: 280, rail_time_hours: 3.5, road_time_hours: 4.5, corridor_name: 'Delhi-Jaipur Express Corridor (NH48)', rail_fare_3ac: 640, rail_fare_sl: 210 },
  { from: 'delhi', to: 'amritsar', distance_km: 450, rail_time_hours: 5.0, road_time_hours: 7.0, corridor_name: 'Grand Trunk / Northern Railway Corridor', rail_fare_3ac: 980, rail_fare_sl: 310 },
  { from: 'delhi', to: 'varanasi', distance_km: 790, rail_time_hours: 8.0, road_time_hours: 11.5, corridor_name: 'Vande Bharat Northern Mainline', rail_fare_3ac: 1450, rail_fare_sl: 450 },
  { from: 'agra', to: 'jaipur', distance_km: 240, rail_time_hours: 4.0, road_time_hours: 4.2, corridor_name: 'Golden Triangle Connector (NH21)', rail_fare_3ac: 560, rail_fare_sl: 190 },
  { from: 'agra', to: 'varanasi', distance_km: 610, rail_time_hours: 7.5, road_time_hours: 9.5, corridor_name: 'Purvanchal / North Central Corridor', rail_fare_3ac: 1150, rail_fare_sl: 380 },
  { from: 'mumbai', to: 'ahmedabad', distance_km: 490, rail_time_hours: 5.2, road_time_hours: 8.5, corridor_name: 'Western Railway Dedicated Corridor (NH48)', rail_fare_3ac: 1050, rail_fare_sl: 340 },
  { from: 'ahmedabad', to: 'jaipur', distance_km: 660, rail_time_hours: 9.0, road_time_hours: 11.0, corridor_name: 'Rajasthan Western Line', rail_fare_3ac: 1250, rail_fare_sl: 410 },
  { from: 'mumbai', to: 'goa', distance_km: 580, rail_time_hours: 7.5, road_time_hours: 10.5, corridor_name: 'Konkan Railway Coastal Corridor', rail_fare_3ac: 1200, rail_fare_sl: 390 },
  { from: 'mumbai', to: 'aurangabad', distance_km: 370, rail_time_hours: 5.5, road_time_hours: 6.5, corridor_name: 'Samruddhi Mahamarg / Central Rail', rail_fare_3ac: 820, rail_fare_sl: 260 },
  { from: 'mumbai', to: 'bhopal', distance_km: 780, rail_time_hours: 11.0, road_time_hours: 13.5, corridor_name: 'Central Railway Mainline', rail_fare_3ac: 1420, rail_fare_sl: 440 },
  { from: 'bhopal', to: 'agra', distance_km: 440, rail_time_hours: 5.5, road_time_hours: 7.0, corridor_name: 'Bhopal Shatabdi North-Central Line', rail_fare_3ac: 920, rail_fare_sl: 300 },
  { from: 'mumbai', to: 'hyderabad', distance_km: 710, rail_time_hours: 12.0, road_time_hours: 13.0, corridor_name: 'Hussain Sagar Corridor', rail_fare_3ac: 1350, rail_fare_sl: 420 },
  { from: 'hyderabad', to: 'bengaluru', distance_km: 570, rail_time_hours: 8.5, road_time_hours: 9.0, corridor_name: 'South Central Highway Corridor (NH44)', rail_fare_3ac: 1180, rail_fare_sl: 370 },
  { from: 'bengaluru', to: 'chennai', distance_km: 350, rail_time_hours: 4.2, road_time_hours: 6.0, corridor_name: 'Vande Bharat Southern Corridor', rail_fare_3ac: 780, rail_fare_sl: 240 },
  { from: 'bengaluru', to: 'kochi', distance_km: 550, rail_time_hours: 9.5, road_time_hours: 10.5, corridor_name: 'Western Ghats / Southern Corridor', rail_fare_3ac: 1150, rail_fare_sl: 360 },
  { from: 'bengaluru', to: 'hampi', distance_km: 340, rail_time_hours: 5.5, road_time_hours: 6.5, corridor_name: 'Hampi Express Rail Corridor', rail_fare_3ac: 740, rail_fare_sl: 230 },
  { from: 'chennai', to: 'madurai', distance_km: 460, rail_time_hours: 6.0, road_time_hours: 7.5, corridor_name: 'Tejas Pandian Corridor', rail_fare_3ac: 990, rail_fare_sl: 310 },
  { from: 'madurai', to: 'kochi', distance_km: 260, rail_time_hours: 6.5, road_time_hours: 6.5, corridor_name: 'Cardamom Hills / Kochi Corridor', rail_fare_3ac: 620, rail_fare_sl: 200 },
  { from: 'varanasi', to: 'kolkata', distance_km: 680, rail_time_hours: 8.5, road_time_hours: 12.0, corridor_name: 'Grand Chord Express Corridor', rail_fare_3ac: 1320, rail_fare_sl: 410 },
  { from: 'kolkata', to: 'bhubaneswar', distance_km: 440, rail_time_hours: 6.0, road_time_hours: 7.5, corridor_name: 'Howrah-Puri Eastern Line', rail_fare_3ac: 950, rail_fare_sl: 290 },
  { from: 'bhubaneswar', to: 'chennai', distance_km: 1220, rail_time_hours: 18.0, road_time_hours: 21.0, corridor_name: 'Coromandel Coastal Trunk Line', rail_fare_3ac: 2150, rail_fare_sl: 680 },
  { from: 'goa', to: 'kochi', distance_km: 720, rail_time_hours: 11.0, road_time_hours: 14.0, corridor_name: 'Konkan-Malabar Coast Line', rail_fare_3ac: 1380, rail_fare_sl: 430 }
];

function findNearestGraphNode(lat: number, lng: number): GraphNode {
  let nearest = ROUTING_GRAPH_NODES.mumbai;
  let minDistance = Infinity;
  for (const node of Object.values(ROUTING_GRAPH_NODES)) {
    const d = haversineDistanceKm(lat, lng, node.lat, node.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = node;
    }
  }
  return nearest;
}

// Dijkstra shortest path on graph
function calculateDijkstraPath(startNodeId: string, endNodeId: string) {
  if (startNodeId === endNodeId) {
    return { path: [startNodeId], total_distance: 0, total_rail_time: 0, total_road_time: 0, edges: [] };
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, { node: string; edge: GraphEdge } | null> = {};
  const unvisited = new Set<string>();

  for (const nodeId of Object.keys(ROUTING_GRAPH_NODES)) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
    unvisited.add(nodeId);
  }
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let smallestDist = Infinity;
    for (const nodeId of unvisited) {
      if (distances[nodeId] < smallestDist) {
        smallestDist = distances[nodeId];
        current = nodeId;
      }
    }

    if (!current || distances[current] === Infinity) break;
    if (current === endNodeId) break;

    unvisited.delete(current);

    // Find neighbors
    for (const edge of ROUTING_GRAPH_EDGES) {
      let neighbor: string | null = null;
      if (edge.from === current) neighbor = edge.to;
      else if (edge.to === current) neighbor = edge.from;

      if (neighbor && unvisited.has(neighbor)) {
        const alt = distances[current] + edge.distance_km;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = { node: current, edge };
        }
      }
    }
  }

  // Backtrack path
  const path: string[] = [];
  const edges: GraphEdge[] = [];
  let curr: string | null = endNodeId;

  while (curr) {
    path.unshift(curr);
    const prev: { node: string; edge: GraphEdge } | null = previous[curr];
    if (prev) {
      edges.unshift(prev.edge);
      curr = prev.node;
    } else {
      break;
    }
  }

  let total_distance = 0;
  let total_rail_time = 0;
  let total_road_time = 0;
  for (const edge of edges) {
    total_distance += edge.distance_km;
    total_rail_time += edge.rail_time_hours;
    total_road_time += edge.road_time_hours;
  }

  return { path, total_distance, total_rail_time, total_road_time, edges };
}

app.get('/api/routes', async (req, res) => {
  try {
    const originStr = req.query.origin as string;
    const destStr = req.query.destination as string;
    const origLat = parseFloat(req.query.orig_lat as string);
    const origLng = parseFloat(req.query.orig_lng as string);
    const destLat = parseFloat(req.query.dest_lat as string);
    const destLng = parseFloat(req.query.dest_lng as string);
    const cityContext = (req.query.city as string) || '';
    const requestedMode = (req.query.mode as string)?.toUpperCase();

    const originLoc = resolveLocation(originStr, origLat, origLng, cityContext);
    const destLoc = resolveLocation(destStr, destLat, destLng, cityContext);

    const distKm =
      Math.round(haversineKm(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude) * 10) / 10 || 4.2;

    const isInterCity = distKm >= 75;

    // 1. Calculate Real Railway Route using authentic track corridors
    const railResult = findConnectedRailRoute(
      originLoc.latitude,
      originLoc.longitude,
      destLoc.latitude,
      destLoc.longitude
    );

    // 2. Calculate Real Road Route (OSRM with Highway / NH48 fallback)
    const roadDriveResult = await getRealRoadRoute(
      originLoc.latitude,
      originLoc.longitude,
      destLoc.latitude,
      destLoc.longitude,
      'DRIVE'
    );

    const options = [];

    if (isInterCity) {
      // -------------------------------------------------------------
      // INTER-CITY ROUTING: Authentic Indian Railways + Real Highway
      // -------------------------------------------------------------
      const railDist = railResult.distanceKm;
      const railMins = railResult.durationMinutes;
      const railFormatted = railResult.durationFormatted;

      const haltsText = railResult.stops.length > 2
        ? `Via ${railResult.stops.slice(1, -1).join(' → ')}`
        : (railResult.corridorName || 'Direct Mainline Corridor');

      // 1. Indian Railways Express / Vande Bharat (Rail)
      const trainFare3AC = Math.round(railDist * 1.32 + 90);
      const trainFareSL = Math.round(railDist * 0.44 + 50);
      const trainFareVB = Math.round(railDist * 2.05 + 140);

      options.push({
        mode: 'TRANSIT',
        title: railResult.expressTier === 'rajdhani_vande_bharat'
          ? 'Indian Railways Vande Bharat / Rajdhani Express'
          : 'Indian Railways Superfast Express',
        duration_minutes: railMins,
        duration_formatted: railFormatted,
        distance_km: railDist,
        estimated_fare: trainFare3AC,
        fare_status: 'estimated',
        provider: 'Indian Railways (IRCTC)',
        speed_tier: 'fastest',
        fare_note: `Tariff estimates: 3-Tier AC: ₹${trainFare3AC} | Sleeper: ₹${trainFareSL} | Executive / Vande Bharat: ₹${trainFareVB}`,
        railway_corridor: railResult.corridorName,
        railway_stops: railResult.stops,
        steps_summary: [
          `Board train at origin railhead (${originLoc.name})`,
          `Proceed along ${railResult.corridorName} (${haltsText})`,
          `Official track rail distance: ${railDist} km (${railFormatted})`,
          `Alight at destination railhead (${destLoc.name})`
        ],
        polyline: railResult.polyline,
        routing_engine: 'Virasat Track-Aligned Railway Engine (IR Trunk Geometry)'
      });

      // 2. Multimodal Hub Transit (Cab + Train + Feeder)
      const multimodalMins = railMins + 45;
      options.push({
        mode: 'MULTIMODAL',
        title: 'Multimodal Hub Transit (Cab + Train + Feeder)',
        duration_minutes: multimodalMins,
        duration_formatted: formatTransitDuration(multimodalMins),
        distance_km: railDist + 14,
        estimated_fare: trainFare3AC + 180,
        fare_status: 'estimated',
        provider: 'Multimodal Intercity Transit',
        speed_tier: 'balanced',
        fare_note: 'Includes first-mile cab + Indian Railways 3-Tier AC + last-mile auto transfer',
        steps_summary: [
          `First Mile: Board local taxi from ${originLoc.name} to nearest rail junction`,
          `Line Haul: Fast express train corridor (${haltsText})`,
          `Last Mile: Feeder transit from destination station to ${destLoc.name}`
        ],
        polyline: railResult.polyline,
        routing_engine: 'Virasat Multimodal Corridor Engine'
      });

      // 3. National Highway Express Drive / Cab
      const roadDist = roadDriveResult.distanceKm;
      const roadMins = roadDriveResult.durationMinutes;
      const roadFormatted = roadDriveResult.durationFormatted;
      const cabFare = Math.round(roadDist * 16 + (roadDist / 100) * 190 + 250);

      options.push({
        mode: 'DRIVE',
        title: 'National Highway Express Cab / Self-Drive',
        duration_minutes: roadMins,
        duration_formatted: roadFormatted,
        distance_km: roadDist,
        estimated_fare: cabFare,
        fare_status: 'estimated',
        provider: 'National Highway Outstation Cab',
        speed_tier: 'flexible',
        fare_note: `Outstation sedan rate (~₹16/km + estimated Fastag toll of ₹${Math.round((roadDist / 100) * 190)})`,
        steps_summary: [
          `Depart ${originLoc.name} onto national highway arterial bypass`,
          `Travel ${roadDist} km along expressway corridor (${roadFormatted})`,
          `Pass official Fastag toll plazas and highway service areas`,
          `Arrive at entry approach of ${destLoc.name}`
        ],
        polyline: roadDriveResult.polyline,
        routing_engine: 'Virasat Highway Vector Engine (OSRM / NH Corridors)'
      });

      // 4. Intercity AC Bus
      const busMins = Math.round(roadMins * 1.15 + 40);
      const busFare = Math.round(roadDist * 1.75 + 70);
      options.push({
        mode: 'BUS',
        title: 'Intercity AC Sleeper / State Transport',
        duration_minutes: busMins,
        duration_formatted: formatTransitDuration(busMins),
        distance_km: roadDist,
        estimated_fare: busFare,
        fare_status: 'estimated',
        provider: 'State Road Transport / Intercity Volvo',
        speed_tier: 'cheapest',
        fare_note: `Estimated AC sleeper ticket (₹${busFare} per passenger)`,
        steps_summary: [
          `Board intercity coach at central transit terminal near ${originLoc.name}`,
          `Travel via express highway with scheduled rest halt (${formatTransitDuration(busMins)})`,
          `Alight at destination bus terminal and take feeder transit to ${destLoc.name}`
        ],
        polyline: roadDriveResult.polyline,
        routing_engine: 'Virasat Bus Route Engine'
      });

    } else {
      // -------------------------------------------------------------
      // LOCAL / REGIONAL ROUTING (< 75 km)
      // -------------------------------------------------------------
      const roadDist = roadDriveResult.distanceKm;
      const roadMins = roadDriveResult.durationMinutes;
      const roadFormatted = roadDriveResult.durationFormatted;

      // 1. Drive / Taxi
      if (!requestedMode || requestedMode === 'DRIVE') {
        const estFare = Math.round(roadDist * 21 + 50);
        options.push({
          mode: 'DRIVE',
          title: 'Taxi / Rideshare (AC Cab)',
          duration_minutes: roadMins,
          duration_formatted: roadFormatted,
          distance_km: roadDist,
          estimated_fare: estFare,
          fare_status: 'estimated',
          provider: 'City Taxi / Rideshare',
          steps_summary: [
            `Depart from ${originLoc.name} along city arterial link`,
            `Proceed along road network (${roadDist} km, ${roadFormatted})`,
            `Approach visitor drop-off gate at ${destLoc.name}`
          ],
          polyline: roadDriveResult.polyline,
          speed_tier: 'fastest',
          fare_note: 'Estimated fare based on standard daytime city rates (₹50 base + ₹21/km)',
        });
      }

      // 2. Auto-Rickshaw
      if (!requestedMode || requestedMode === 'AUTO') {
        const autoMins = Math.round(roadMins * 1.12 + 3);
        const estAutoFare = Math.round(Math.max(28, 28 + (roadDist - 1.5) * 15.33));
        options.push({
          mode: 'AUTO',
          title: 'Auto-Rickshaw (Metered)',
          duration_minutes: autoMins,
          duration_formatted: formatTransitDuration(autoMins),
          distance_km: roadDist,
          estimated_fare: estAutoFare,
          fare_status: 'estimated',
          provider: 'City Metered Auto-Rickshaw',
          steps_summary: [
            `Board auto at designated stand near ${originLoc.name}`,
            `Navigate street network (${roadDist} km, ${formatTransitDuration(autoMins)})`,
            `Drop-off at nearest rickshaw stand beside ${destLoc.name}`
          ],
          polyline: roadDriveResult.polyline,
          speed_tier: 'balanced',
          fare_note: 'Estimated government RTO metered rate (₹28 for first 1.5 km, ₹15.33/km thereafter)',
        });
      }

      // 3. Transit (Suburban Rail / Metro)
      if (!requestedMode || requestedMode === 'TRANSIT') {
        const transitDist = railResult.distanceKm > 0 ? railResult.distanceKm : roadDist;
        const transitMins = railResult.durationMinutes > 0 ? railResult.durationMinutes : Math.round(distKm * 2.2 + 8);
        const transitFare = distKm > 20 ? 15 : distKm > 10 ? 10 : 5;
        const polyline = railResult.polyline.length > 2 ? railResult.polyline : roadDriveResult.polyline;

        options.push({
          mode: 'TRANSIT',
          title: 'Suburban Railway / Metro',
          duration_minutes: transitMins,
          duration_formatted: formatTransitDuration(transitMins),
          distance_km: transitDist,
          estimated_fare: transitFare,
          fare_status: 'estimated',
          provider: 'Suburban Rail / City Metro',
          steps_summary: [
            `Board transit at closest station near ${originLoc.name}`,
            `Travel along transit corridor (${transitDist} km, ${formatTransitDuration(transitMins)})`,
            `Alight at station exit and follow pedestrian walkway to ${destLoc.name}`
          ],
          polyline,
          railway_corridor: railResult.corridorName,
          railway_stops: railResult.stops,
          speed_tier: 'cheapest',
          fare_note: 'Standard 2nd class suburban railway / metro fare table estimate',
        });
      }

      // 4. City Bus
      if (!requestedMode || requestedMode === 'BUS') {
        const busMins = Math.round(roadMins * 1.35 + 8);
        const busFare = Math.round(Math.min(30, Math.max(6, 6 + (roadDist - 5) * 1.8)));
        options.push({
          mode: 'BUS',
          title: 'City Bus Transit',
          duration_minutes: busMins,
          duration_formatted: formatTransitDuration(busMins),
          distance_km: roadDist,
          estimated_fare: busFare,
          fare_status: 'estimated',
          provider: 'Municipal City Bus Service',
          steps_summary: [
            `Board city bus at transit stop near ${originLoc.name}`,
            `Proceed along designated bus route (${roadDist} km, ${formatTransitDuration(busMins)})`,
            `Alight at shelter opposite ${destLoc.name}`
          ],
          polyline: roadDriveResult.polyline,
          speed_tier: 'cheapest',
          fare_note: 'Estimated ordinary non-AC municipal bus tariff',
        });
      }

      // 5. Bicycle (if <= 35 km)
      if ((!requestedMode || requestedMode === 'BICYCLE') && distKm <= 35) {
        const bikeResult = await getRealRoadRoute(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'BICYCLE');
        options.push({
          mode: 'BICYCLE',
          title: 'Cycling Route',
          duration_minutes: bikeResult.durationMinutes,
          duration_formatted: bikeResult.durationFormatted,
          distance_km: bikeResult.distanceKm,
          estimated_fare: 0,
          fare_status: 'estimated',
          provider: 'Active Cycling Route',
          steps_summary: [
            `Cycle along shared low-traffic street from ${originLoc.name}`,
            `Follow cycle-friendly avenues (${bikeResult.distanceKm} km, ${bikeResult.durationFormatted})`,
            `Reach bicycle parking near ${destLoc.name}`
          ],
          polyline: bikeResult.polyline,
          speed_tier: 'balanced',
          fare_note: 'Eco-friendly zero fare route with public rental docks available',
        });
      }

      // 6. Walk (if <= 15 km)
      if ((!requestedMode || requestedMode === 'WALK') && distKm <= 15) {
        const walkResult = await getRealRoadRoute(originLoc.latitude, originLoc.longitude, destLoc.latitude, destLoc.longitude, 'WALK');
        options.push({
          mode: 'WALK',
          title: 'Pedestrian Walk',
          duration_minutes: walkResult.durationMinutes,
          duration_formatted: walkResult.durationFormatted,
          distance_km: walkResult.distanceKm,
          estimated_fare: 0,
          fare_status: 'estimated',
          provider: 'Pedestrian Corridor',
          steps_summary: [
            `Start walk from ${originLoc.name} pedestrian zone`,
            `Follow sidewalks, footpaths, and crossings (${walkResult.distanceKm} km, ${walkResult.durationFormatted})`,
            `Arrive at entrance of ${destLoc.name}`
          ],
          polyline: walkResult.polyline,
          speed_tier: 'balanced',
          fare_note: 'Zero fare - scenic and healthy pedestrian walkway',
        });
      }
    }

    res.json({
      origin: originLoc,
      destination: destLoc,
      distance_km: distKm,
      is_inter_city: isInterCity,
      options,
    });
  } catch (err: any) {
    console.error('[API /routes error]:', err);
    res.status(500).json({ error: 'Failed to compute routes', details: err?.message });
  }
});

app.get('/api/maps/directions', (req, res) => {
  const city = (req.query.city as string) || '';
  const defaultOrigin = city ? `${city} Center` : 'India Gate, Delhi';
  const defaultDest = city ? `${city} Landmark` : 'Red Fort, Delhi';

  const origin = encodeURIComponent((req.query.origin as string) || defaultOrigin);
  const destination = encodeURIComponent((req.query.destination as string) || defaultDest);
  const mode = (req.query.mode as string) || 'driving';

  const navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode.toLowerCase()}`;
  res.json({
    origin: req.query.origin || defaultOrigin,
    destination: req.query.destination || defaultDest,
    travel_mode: mode,
    url: navigationUrl,
    navigation_url: navigationUrl,
  });
});

// -------------------------------------------------------------
// Weather Endpoint
// -------------------------------------------------------------
app.get('/api/weather', (req, res) => {
  const city = ((req.query.city as string) || 'mumbai').toLowerCase().trim();

  const weatherMatrix: Record<string, any> = {
    mumbai: { city: 'Mumbai', temperature_c: 28, condition: 'Sunny & Coastal Breeze', humidity: 68, wind_kmh: 14, status: 'Live (Sensor)' },
    jaipur: { city: 'Jaipur', temperature_c: 31, condition: 'Clear & Warm', humidity: 42, wind_kmh: 10, status: 'Live' },
    delhi: { city: 'New Delhi', temperature_c: 29, condition: 'Pleasant & Sunny', humidity: 52, wind_kmh: 8, status: 'Live' },
    kochi: { city: 'Kochi', temperature_c: 27, condition: 'Tropical Breeze', humidity: 76, wind_kmh: 16, status: 'Live' },
    goa: { city: 'Panaji', temperature_c: 28, condition: 'Sunny Beach Weather', humidity: 70, wind_kmh: 12, status: 'Live' },
    shimla: { city: 'Shimla', temperature_c: 18, condition: 'Crisp Mountain Air', humidity: 48, wind_kmh: 6, status: 'Live' },
    lonavala: { city: 'Lonavala & Khandala', temperature_c: 23, condition: 'Misty Mountain Breeze', humidity: 74, wind_kmh: 18, status: 'Live' },
    khandala: { city: 'Khandala', temperature_c: 22, condition: 'Cool Sahyadri Clouds', humidity: 75, wind_kmh: 19, status: 'Live' },
  };

  const weather = weatherMatrix[city] || {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    temperature_c: 27,
    condition: 'Pleasant & Mild',
    humidity: 58,
    wind_kmh: 11,
    status: 'Estimated',
  };

  res.json(weather);
});

// -------------------------------------------------------------
// AI Tourism Assistant Chat Endpoint
// -------------------------------------------------------------
// -------------------------------------------------------------
// Reverse Geocoding Endpoint (Coordinates to Locality / City / State)
// -------------------------------------------------------------
app.post('/api/geo/reverse-geocode', async (req, res) => {
  const { latitude, longitude } = req.body;
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ success: false, error: 'Valid latitude and longitude required' });
  }

  // Find nearest Indian city in database via Haversine as an instant local reference
  let nearestCity: any = null;
  let minDistance = Infinity;
  for (const c of citiesData) {
    const cLat = c.lat || c.coordinates?.lat;
    const cLng = c.lng || c.coordinates?.lng;
    if (cLat && cLng) {
      const dist = haversineDistanceKm(lat, lng, cLat, cLng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestCity = c;
      }
    }
  }

  // Fallback defaults from closest verified city
  let locality = nearestCity ? nearestCity.name : 'Local Area';
  let city = nearestCity ? nearestCity.name : 'Unknown City';
  let state = nearestCity ? (nearestCity.state || '') : 'India';
  let country = 'India';

  // Call Nominatim OSM reverse geocode for rich neighborhood / suburb accuracy
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const geoRes = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'Virasat-Heritage-India/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (geoRes.ok) {
      const data: any = await geoRes.json();
      if (data && data.address) {
        const addr = data.address;
        locality = addr.suburb || addr.neighbourhood || addr.residential || addr.road || addr.village || addr.town || addr.city_district || locality;
        city = addr.city || addr.town || addr.village || addr.state_district || city;
        state = addr.state || state;
        country = addr.country || country;
      }
    }
  } catch {
    // Offline or network timeout - successfully fall back to nearestCity from Virasat DB
  }

  const parts = [locality, city, state].filter(Boolean);
  const uniqueParts = parts.filter((val, i, arr) => arr.indexOf(val) === i);
  const formatted_area = uniqueParts.join(', ');

  res.json({
    success: true,
    locality,
    city,
    state,
    country,
    formatted_area,
    nearest_city: nearestCity ? nearestCity.name : city,
    distance_to_city_km: Math.round(minDistance * 10) / 10,
  });
});

// -------------------------------------------------------------
// Helper: Extract destination, city, or state entities from text
// -------------------------------------------------------------
function findEntityInText(text: string): { place: any | null; city: string | null; state: string | null; name: string | null } {
  if (!text) return { place: null, city: null, state: null, name: null };
  const t = text.toLowerCase().trim();
  const allPlaces = Array.from(placesData.values());

  // Check for specific multi-word monuments / places first
  if (t.includes('dal lake') || t.includes('dal-lake') || t.includes('shikara')) {
    const p = placesData.get('dal-lake-srinagar') || allPlaces.find((x) => x.id.includes('dal-lake'));
    return { place: p || null, city: 'Srinagar', state: 'Jammu and Kashmir', name: 'Dal Lake' };
  }
  if (t.includes('thar desert') || t.includes('sam sand dunes') || t.includes('sam dunes') || t.includes('desert safari')) {
    const p = placesData.get('thar-desert-sam-dunes') || allPlaces.find((x) => x.id.includes('thar-desert'));
    return { place: p || null, city: 'Jaisalmer', state: 'Rajasthan', name: 'Thar Desert' };
  }
  if (t.includes('gateway of india') || t.includes('elephanta')) {
    const p = placesData.get('gateway-of-india') || allPlaces.find((x) => x.id.includes('gateway-of-india'));
    return { place: p || null, city: 'Mumbai', state: 'Maharashtra', name: 'Gateway of India' };
  }
  if (t.includes('taj mahal') && !t.includes('palace')) {
    const p = placesData.get('taj-mahal') || allPlaces.find((x) => x.id.includes('taj-mahal'));
    return { place: p || null, city: 'Agra', state: 'Uttar Pradesh', name: 'Taj Mahal' };
  }
  if (t.includes('hawa mahal') || t.includes('amber fort') || t.includes('amber palace') || t.includes('amer fort')) {
    const p = placesData.get('hawa-mahal') || placesData.get('amber-palace') || allPlaces.find((x) => x.city?.toLowerCase() === 'jaipur');
    return { place: p || null, city: 'Jaipur', state: 'Rajasthan', name: 'Jaipur Heritage' };
  }
  if (t.includes('victoria memorial')) {
    const p = placesData.get('victoria-memorial') || allPlaces.find((x) => x.city?.toLowerCase() === 'kolkata');
    return { place: p || null, city: 'Kolkata', state: 'West Bengal', name: 'Victoria Memorial Hall' };
  }
  if (t.includes('golden temple')) {
    const p = allPlaces.find((x) => x.city?.toLowerCase() === 'amritsar' || x.name.toLowerCase().includes('golden temple'));
    return { place: p || null, city: 'Amritsar', state: 'Punjab', name: 'Golden Temple' };
  }
  if (t.includes('konark') || t.includes('sun temple')) {
    const p = allPlaces.find((x) => x.name.toLowerCase().includes('konark') || x.id.includes('konark'));
    return { place: p || null, city: 'Puri', state: 'Odisha', name: 'Konark Sun Temple' };
  }

  const GENERIC_CATEGORY_WORDS = new Set([
    'heritage', 'monument', 'monuments', 'museum', 'museums', 'temple', 'temples',
    'palace', 'palaces', 'fort', 'forts', 'garden', 'gardens', 'lake', 'lakes',
    'beach', 'beaches', 'mountain', 'mountains', 'hill', 'hills', 'park', 'parks',
    'wildlife', 'history', 'culture', 'cultural', 'architecture', 'tourism', 'travel',
    'trip', 'station', 'airport', 'railway', 'hotel', 'city', 'state', 'india', 'unesco'
  ]);

  // Scan all places in database by specific name
  for (const p of allPlaces) {
    const pName = p.name.toLowerCase();
    if (pName.length >= 4 && t.includes(pName)) {
      return { place: p, city: p.city, state: p.state, name: p.name };
    }
    if (p.tags && p.tags.some((tg: string) => {
      const lowerTag = tg.toLowerCase().trim();
      return lowerTag.length > 5 && !GENERIC_CATEGORY_WORDS.has(lowerTag) && t.includes(lowerTag);
    })) {
      return { place: p, city: p.city, state: p.state, name: p.name };
    }
  }

  // Scan citiesData (Exact city names across India)
  for (const c of citiesData) {
    const cName = c.name.toLowerCase();
    if (t.includes(cName)) {
      const matchP = allPlaces.find((x) => x.city?.toLowerCase() === cName);
      return { place: matchP || null, city: c.name, state: c.state || null, name: c.name };
    }
  }

  // Scan statesData
  for (const s of statesData) {
    const sName = s.name.toLowerCase();
    if (t.includes(sName)) {
      const matchP = allPlaces.find((x) => x.state?.toLowerCase() === sName);
      return { place: matchP || null, city: null, state: s.name, name: s.name };
    }
  }

  // Scan regional tourist keywords
  if (t.includes('sonamarg')) {
    const matchP = allPlaces.find((x) => x.name.toLowerCase().includes('sonamarg') || x.city?.toLowerCase() === 'sonamarg');
    return { place: matchP || null, city: 'Sonamarg', state: 'Jammu and Kashmir', name: 'Sonamarg' };
  }
  if (t.includes('kanyakumari')) {
    const matchP = allPlaces.find((x) => x.name.toLowerCase().includes('kanyakumari') || x.city?.toLowerCase() === 'kanyakumari');
    return { place: matchP || null, city: 'Kanyakumari', state: 'Tamil Nadu', name: 'Kanyakumari' };
  }
  if (t.includes('darjeeling')) {
    const matchP = allPlaces.find((x) => x.city?.toLowerCase() === 'darjeeling' || x.id.includes('darjeeling'));
    return { place: matchP || null, city: 'Darjeeling', state: 'West Bengal', name: 'Darjeeling' };
  }
  if (t.includes('ooty') || t.includes('udagamandalam')) {
    const matchP = allPlaces.find((x) => x.city?.toLowerCase() === 'ooty');
    return { place: matchP || null, city: 'Ooty', state: 'Tamil Nadu', name: 'Ooty' };
  }
  if (t.includes('goa') || t.includes('calangute') || t.includes('baga') || t.includes('palolem')) {
    const matchP = allPlaces.find((x) => x.city?.toLowerCase() === 'goa' || x.state?.toLowerCase() === 'goa');
    return { place: matchP || null, city: 'Goa', state: 'Goa', name: 'Goa' };
  }
  if (t.includes('kashmir') || t.includes('srinagar') || t.includes('gulmarg') || t.includes('pahalgam') || t.includes('sonamarg')) {
    const matchP = allPlaces.find((x) => x.city?.toLowerCase() === 'srinagar');
    return { place: matchP || null, city: 'Srinagar', state: 'Jammu and Kashmir', name: 'Srinagar, Kashmir' };
  }
  if (t.includes('ladakh') || t.includes('leh') || t.includes('pangong') || t.includes('nubra')) {
    const matchP = allPlaces.find((x) => x.city?.toLowerCase() === 'leh' || x.state?.toLowerCase() === 'ladakh');
    return { place: matchP || null, city: 'Leh', state: 'Ladakh', name: 'Ladakh' };
  }
  if (t.includes('kerala') || t.includes('alleppey') || t.includes('alappuzha') || t.includes('munnar') || t.includes('kochi')) {
    const matchP = allPlaces.find((x) => x.state?.toLowerCase() === 'kerala');
    return { place: matchP || null, city: 'Kerala', state: 'Kerala', name: 'Kerala' };
  }
  if (t.includes('hampi')) {
    const matchP = allPlaces.find((x) => x.name.toLowerCase().includes('hampi') || x.city?.toLowerCase() === 'hampi');
    return { place: matchP || null, city: 'Hampi', state: 'Karnataka', name: 'Hampi' };
  }
  if (t.includes('jaisalmer')) {
    const matchP = allPlaces.find((x) => x.city?.toLowerCase() === 'jaisalmer');
    return { place: matchP || null, city: 'Jaisalmer', state: 'Rajasthan', name: 'Jaisalmer' };
  }
  if (t.includes('khajuraho')) {
    const matchP = allPlaces.find((x) => x.name.toLowerCase().includes('khajuraho') || x.city?.toLowerCase() === 'khajuraho');
    return { place: matchP || null, city: 'Khajuraho', state: 'Madhya Pradesh', name: 'Khajuraho' };
  }
  if (t.includes('patna')) {
    const matchP = allPlaces.find((x) => x.city?.toLowerCase() === 'patna');
    return { place: matchP || null, city: 'Patna', state: 'Bihar', name: 'Patna' };
  }
  if (t.includes('varanasi') || t.includes('kashi') || t.includes('banaras')) {
    const matchP = allPlaces.find((x) => x.city?.toLowerCase() === 'varanasi');
    return { place: matchP || null, city: 'Varanasi', state: 'Uttar Pradesh', name: 'Varanasi' };
  }

  return { place: null, city: null, state: null, name: null };
}

// -------------------------------------------------------------
// Helper: Find verified transport info for any Indian city
// -------------------------------------------------------------
function findCityTransportInfo(cityNameOrId: string) {
  if (!cityNameOrId) return null;
  const q = cityNameOrId.toLowerCase().trim();

  // Search in comprehensive INDIA_TOURISM_DATABASE
  for (const state of INDIA_TOURISM_DATABASE.states) {
    for (const city of (state.cities || [])) {
      if (
        city.name.toLowerCase() === q ||
        city.id.toLowerCase() === q ||
        q.includes(city.name.toLowerCase()) ||
        city.name.toLowerCase().includes(q)
      ) {
        return {
          city: city.name,
          state: city.state,
          coordinates: city.coordinates,
          railway_stations: (city.transport as any)?.railway_stations || [],
          airport: (city.transport as any)?.airport || null,
          local_transit: (city.transport as any)?.local_transit || null,
        };
      }
    }
  }

  // Fallback check against citiesData & railwayStationsData
  const c = citiesData.find(
    (x) => x.name.toLowerCase() === q || q.includes(x.name.toLowerCase()) || x.name.toLowerCase().includes(q)
  );
  if (c) {
    const stns = railwayStationsData.filter(
      (s) => s.city?.toLowerCase() === c.name.toLowerCase() || (s as any).state?.toLowerCase() === c.state?.toLowerCase()
    );
    return {
      city: c.name,
      state: c.state || '',
      coordinates: c.coordinates || { lat: c.lat, lng: c.lng },
      railway_stations: stns,
      airport: null,
      local_transit: null,
    };
  }

  return null;
}

// -------------------------------------------------------------
// Helper: Calculate multimodal transit comparison (Train, Air, Road)
// Strictly resolves verified stations and airports. Never invents stations.
// -------------------------------------------------------------
function getTransitComparison(
  originName: string | null,
  originCoords: { lat: number; lng: number } | null,
  destName: string,
  destCoords: { lat: number; lng: number } | null,
  selectedMode?: 'train' | 'air' | 'road' | 'all'
) {
  if (!originName && !originCoords) {
    return null;
  }
  const rawOrigin = originCoords
    ? { lat: originCoords.lat, lng: originCoords.lng, locality: originName || undefined }
    : originName;

  const originNode = resolveOriginTransportNode(rawOrigin);
  if (!originNode) {
    return null;
  }
  const destNode = resolveDestinationTransportNode(destName, placesData);
  if (!destNode) {
    return null;
  }

  return buildVerifiedTransitComparison(originNode, destNode, selectedMode);
}

// -------------------------------------------------------------
// Helper: Find verified nearby places from actual coordinates
// Strictly enforces maxRadiusKm - NEVER expands radius if 0 found!
// -------------------------------------------------------------
function findNearbyPlacesFromCoords(
  lat: number,
  lng: number,
  maxRadiusKm = 50,
  limit = 6,
  excludedKeywords: string[] = []
) {
  const allPlaces = Array.from(placesData.values());
  const withDistance = allPlaces
    .map((p) => {
      const pLat = p.coordinates?.lat || (p as any).latitude || 0;
      const pLng = p.coordinates?.lng || (p as any).longitude || 0;
      if (!pLat || !pLng) return null;
      const dist = haversineDistanceKm(lat, lng, pLat, pLng);
      return {
        ...p,
        distance_km: Math.round(dist * 10) / 10,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .filter((p) => {
      if (excludedKeywords.length > 0) {
        const placeStr = `${p.name} ${p.city} ${p.state}`.toLowerCase();
        if (excludedKeywords.some((kw) => placeStr.includes(kw.toLowerCase()))) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => a.distance_km - b.distance_km);

  // STRICT RADIUS FILTERING: Every returned place MUST satisfy distance_km <= maxRadiusKm
  // NEVER expand radius to fill the recommendation list!
  const results = withDistance.filter((p) => p.distance_km <= maxRadiusKm);
  return results.slice(0, limit);
}

// -------------------------------------------------------------
// AI Tourism Assistant Chat Endpoint (Location & Context Aware)
// -------------------------------------------------------------
app.post(['/api/ai/chat', '/api/assistant/chat'], async (req, res) => {
  const { message, conversation_id, place_id, city, history, location, travel_context } = req.body;
  const convId = conversation_id || `conv-${Date.now()}`;
  const rawQuery = (message || '').trim();
  const query = rawQuery.toLowerCase();

  // Normalize user location if provided
  const userLoc = location && typeof location === 'object' ? location : null;
  const userHasCoords = !!(userLoc?.latitude && userLoc?.longitude && !isNaN(userLoc.latitude) && !isNaN(userLoc.longitude));
  const userCity = userLoc?.city || userLoc?.locality || travel_context?.origin || (city && city.toLowerCase() !== 'all india' ? city : null);

  // Normalize incoming chat history
  const normalizedHistory: Array<{ role: 'user' | 'model'; text: string }> = Array.isArray(history)
    ? history.map((h: any) => {
        const text = typeof h.content === 'string'
          ? h.content
          : typeof h.text === 'string'
            ? h.text
            : Array.isArray(h.parts) && h.parts[0]?.text
              ? h.parts[0].text
              : '';
        const role: 'user' | 'model' = h.role === 'user' ? 'user' : 'model';
        return { role, text: text.trim() };
      }).filter((h) => h.text.length > 0)
    : [];

  // Detect Hindi / Hinglish phrasing for conversational resonance
  const isHindiHinglish = /(bhai|mein|kya|karu|kare|aur|paas|kaise|batao|chahiye|hai|kahan|kitna|namaste|dost|yahan|vahan|kuch|din|safar|ghoom|ghoomne|pe|ko|bhi|ka|ki|ke|jana|chalo|bana do|banao|chalein)/i.test(rawQuery);

  // Detect duration requested (e.g. "7 days ka plan", "3 day trip", "5 din", "4 days")
  const durationMatch = query.match(/(\d+)\s*(days?|din|day)/);
  const durationDays = durationMatch ? parseInt(durationMatch[1], 10) : (travel_context?.days || 3);

  // Detect pace preference (e.g. "I don't want too much travelling", "relaxed", "slow pace", "kam travel")
  const isRelaxedPace = /(too much travelling|too much travel|kam travel|relaxed|slow|easy|aram se|bhag daud nahi|less travel|without travelling much)/i.test(query);

  // Intent classification triggers
  const isCurrentLocationQuery = /(meri (current )?location( batao| kya hai)?|where am i|what is my location|current location kya hai|meri location batao)/i.test(query);
  const isItineraryModify = /(day \d+ (ko )?(change|modify|badlo|badal do)|change day \d+|modify day \d+|heritage places zyada|zyada heritage|more heritage|heritage spots add)/i.test(query);
  const isExcludeMumbai = /(mumbai (ke baare mein )?nahi|don't want mumbai|not mumbai|exclude mumbai|mumbai chhod kar|mumbai ke alawa|mumbai nahi)/i.test(query);
  const isNearbyQuery = /(nearby|near me|paas mein|paas|aas paas|close to me|around me|around here|aur kya hai paas|aur paas mein|bagal mein|what is near me|explore near me|kuch interesting dekhna hai)/i.test(query);
  const isTransitQuery = /(train|railway|station|flight|airport|bus|how to reach|kaise pahuchu|kaise pahuchein|kaise jayein|kaise jaye|kaise jau|kaise ja sakte|kaise jaa sakte|reach there|route|safar|transit|train se|flight se|flight option|road option|car se|travel options)/i.test(query);
  const isItineraryQuery = /(plan|itinerary|days|din|trip|tour|schedule|circuit|bana do)/i.test(query) || (!!durationMatch && !isTransitQuery);
  const isFeatureQuery = /(how does (this|the) (feature|website|app|map|site|planner|3d) work|how to use|features of virasat|kya hai yeh website|map kaise|feature explain|what can i do on this website|website kaise kaam karti hai|features batao)/i.test(query);
  const isGreeting = /^(hi|hello|hey|namaste|pranam|greetings|hola)\b/i.test(query.trim());
  const isResetQuery = /(somewhere else|kisi aur jagah|change destination|kahi aur|dusri jagah|doosre city|doosri jagah)/i.test(query);
  const isExplicitTravelQuery = /(travel to|visit|go to|reach|how to reach|kaise jaye|kaise ja sakte|kaise pahuchein|jana hai|jaana hai|safar|ghoomne|trip to|trip|tour|doosre city jaana)/i.test(query);

  // 1. Entity Extraction: Destination identification
  const directEntity = findEntityInText(query);
  let activePlace = directEntity.place;
  let activeCity = directEntity.city;
  let activeState = directEntity.state;
  let activeDestinationName = directEntity.name;

  // 2. If NO direct entity in current query, search backward through conversation history (unless resetting destination)
  if (!activeDestinationName && normalizedHistory.length > 0 && !isResetQuery) {
    for (let i = normalizedHistory.length - 1; i >= 0; i--) {
      const histEntity = findEntityInText(normalizedHistory[i].text);
      if (histEntity.name) {
        activePlace = histEntity.place;
        activeCity = histEntity.city;
        activeState = histEntity.state;
        activeDestinationName = histEntity.name;
        break;
      }
    }
  }

  // 3. If still not found, check place_id or travel_context
  if (!activeDestinationName && !isResetQuery) {
    if (travel_context?.destination) {
      const ctxEntity = findEntityInText(travel_context.destination);
      activePlace = ctxEntity.place;
      activeCity = ctxEntity.city || travel_context.destination;
      activeState = ctxEntity.state;
      activeDestinationName = ctxEntity.name || travel_context.destination;
    } else if (place_id && placesData.has(place_id.toLowerCase())) {
      const p = placesData.get(place_id.toLowerCase())!;
      activePlace = p;
      activeCity = p.city;
      activeState = p.state;
      activeDestinationName = p.name;
    }
  }

  // -------------------------------------------------------------
  // Origin Resolution: Strict separation of user's detected location and trip origin
  // NEVER assume user's current location is the trip origin unless explicitly requested!
  // NEVER assume hardcoded defaults like Mumbai or Delhi.
  // -------------------------------------------------------------
  let useCurrentLocationAsOrigin = false;
  if (/(use my (current )?location as (my )?starting point|meri (current )?location se|from my (current )?location|current location se|yahan se shuru|starting from here|from here|apni location se)/i.test(query)) {
    useCurrentLocationAsOrigin = true;
  }

  // Check for explicit "from X to Y" or "X se Y" in message
  let explicitOriginInText: string | null = null;
  const fromToMatch = query.match(/(?:from|starting from|departing from)\s+([a-zA-Z\s]+?)\s+(?:to|towards)\s+([a-zA-Z\s]+)/i)
    || query.match(/([a-zA-Z\s]+?)\s+(?:se)\s+([a-zA-Z\s]+?)\s+(?:kaise|jana|jaana|ja sakte|travel|pahuchna|pahuchein|chalein|trip|ghoomne|options|route)/i);

  if (fromToMatch && fromToMatch[1]) {
    const candidate = fromToMatch[1].trim();
    if (!/(train|flight|bus|car|air|road|kisi|kahan|yahan|ghoomne|trip|shehar|city)/i.test(candidate)) {
      explicitOriginInText = candidate;
    }
  }

  if (fromToMatch && fromToMatch[2]) {
    const candidateDest = fromToMatch[2].trim();
    if (!/(train|flight|bus|car|air|road|options|route|ghoomne)/i.test(candidateDest)) {
      const destEntity = findEntityInText(candidateDest);
      if (destEntity.name) {
        activeDestinationName = destEntity.name;
        activeCity = destEntity.city || activeCity;
        activeState = destEntity.state || activeState;
        activePlace = destEntity.place || activePlace;
      }
    }
  }

  // Also check if previous assistant turn asked where user is travelling from
  if (!explicitOriginInText && !useCurrentLocationAsOrigin && normalizedHistory.length > 0) {
    const lastAssistantMsg = normalizedHistory[normalizedHistory.length - 1];
    if (lastAssistantMsg.role === 'model' && /(kahan se|starting city|departure city|travelling from|where will you be travelling)/i.test(lastAssistantMsg.text)) {
      const candidateEntity = findEntityInText(query);
      if (candidateEntity.name && candidateEntity.name.toLowerCase() !== activeDestinationName?.toLowerCase()) {
        explicitOriginInText = candidateEntity.name;
      } else {
        const cleaned = query.replace(/(se|from|mein|starting|departing)/gi, '').trim();
        if (cleaned.length >= 3 && cleaned.length < 30 && !/(train|flight|bus|car)/i.test(cleaned)) {
          explicitOriginInText = cleaned;
        }
      }
    }
  }

  let resolvedOriginName: string | null = null;
  let resolvedOriginCoords: { lat: number; lng: number } | null = null;
  let isOriginEstablished = false;

  if (useCurrentLocationAsOrigin) {
    if (userLoc) {
      resolvedOriginName = userLoc.locality
        ? `${userLoc.locality}, ${userLoc.city || userLoc.state || ''}`.trim()
        : userLoc.city || userLoc.state || 'Current Location';
      if (userHasCoords) {
        resolvedOriginCoords = { lat: userLoc.latitude!, lng: userLoc.longitude! };
      }
      isOriginEstablished = true;
    }
  } else if (explicitOriginInText) {
    resolvedOriginName = explicitOriginInText;
    isOriginEstablished = true;
  } else if (travel_context?.origin && travel_context.origin !== 'UNKNOWN' && travel_context.origin !== 'your location') {
    resolvedOriginName = travel_context.origin;
    isOriginEstablished = true;
  }

  // Mode detection for transit queries
  let selectedTransitMode: 'train' | 'air' | 'road' | 'all' = 'all';
  if (/(flight|airport|air|plane|hawai|udaan)/i.test(query)) {
    selectedTransitMode = 'air';
  } else if (/(train|railway|station|rail|irctc|coach|rail route)/i.test(query)) {
    selectedTransitMode = 'train';
  } else if (/(road|car|drive|highway|bus|taxi|cab)/i.test(query)) {
    selectedTransitMode = 'road';
  }

  // Determine functional intent
  let intent: 'explore_nearby' | 'current_location_query' | 'travel_to_destination' | 'transit_mode' | 'itinerary_plan' | 'itinerary_modify' | 'pace_adjust' | 'destination_info' | 'platform_feature' | 'greeting' | 'general';

  if (isFeatureQuery) {
    intent = 'platform_feature';
  } else if (isCurrentLocationQuery) {
    intent = 'current_location_query';
  } else if (isNearbyQuery) {
    intent = 'explore_nearby';
  } else if (isItineraryModify && activeDestinationName) {
    intent = 'itinerary_modify';
  } else if (isRelaxedPace && activeDestinationName) {
    intent = 'pace_adjust';
  } else if (isTransitQuery && activeDestinationName) {
    intent = 'transit_mode';
  } else if (isItineraryQuery && activeDestinationName) {
    intent = 'itinerary_plan';
  } else if (directEntity.name) {
    if (isExplicitTravelQuery || query.includes('trip') || query.includes('tour') || query.includes('safar') || query.includes('doosre city')) {
      intent = 'travel_to_destination';
    } else if (!directEntity.place && directEntity.city) {
      intent = 'travel_to_destination';
    } else {
      intent = 'destination_info';
    }
  } else if (isGreeting && !activeDestinationName) {
    intent = 'greeting';
  } else {
    intent = activeDestinationName ? 'destination_info' : 'general';
  }

  // Collect verified places & transit comparison dynamically
  let suggestedPlaces: Array<{ id: string; name: string; category: string; city: string; distance_km?: number; reason: string }> = [];
  let transitComparison: any = null;
  let suggestedActions: string[] = [];

  // Compute nearby places ONLY if intent is explore_nearby
  if (intent === 'explore_nearby') {
    // Extract requested radius (e.g. 25 km, 50 km)
    let requestedRadiusKm = 25;
    const radiusMatch = query.match(/(?:within|andar|upto|under|radius of|around)\s*(\d+)\s*(?:km|k\.m\.|kilometres|kilometer|kms)?/i)
      || query.match(/(\d+)\s*(?:km|k\.m\.|kilometres|kilometer|kms)\s*(?:ke andar|radius|within|under)?/i);
    if (radiusMatch && radiusMatch[1]) {
      const parsed = parseInt(radiusMatch[1], 10);
      if (!isNaN(parsed) && parsed > 0) {
        requestedRadiusKm = parsed;
      }
    }

    if (userHasCoords) {
      const nearby = findNearbyPlacesFromCoords(
        userLoc!.latitude!,
        userLoc!.longitude!,
        requestedRadiusKm,
        6,
        isExcludeMumbai ? ['Mumbai'] : []
      );
      suggestedPlaces = nearby.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'heritage',
        city: p.city,
        distance_km: p.distance_km,
        reason: `${p.status === 'VERIFIED' ? 'Verified Heritage Landmark' : 'Cultural Highlight'} (~${p.distance_km} km calculated straight-line distance).`,
      }));
    } else if (userCity) {
      const allPlaces = Array.from(placesData.values());
      const inCity = allPlaces.filter(
        (p) =>
          (!isExcludeMumbai || !p.city?.toLowerCase().includes('mumbai')) &&
          (p.city?.toLowerCase() === userCity.toLowerCase() || p.state?.toLowerCase() === userCity.toLowerCase())
      );
      suggestedPlaces = inCity.slice(0, 5).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'heritage',
        city: p.city,
        reason: `${p.status === 'VERIFIED' ? 'Verified Highlight' : 'Cultural Site'} in ${p.city}, ${p.state || 'India'}.`,
      }));
    }
    suggestedActions = ['Plan 1 day here', 'How to reach?', 'Explore somewhere else'];
  } else if (intent === 'travel_to_destination' && activeDestinationName) {
    // ONLY for travel_to_destination, provide 2-3 top highlights in that destination
    const allPlaces = Array.from(placesData.values());
    const destPlaces = allPlaces.filter(
      (p) =>
        (activeCity && p.city?.toLowerCase() === activeCity.toLowerCase()) ||
        p.name.toLowerCase().includes(activeDestinationName!.toLowerCase())
    );
    suggestedPlaces = destPlaces.slice(0, 3).map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category || 'heritage',
      city: p.city,
      reason: `${p.status === 'VERIFIED' ? 'Verified Landmark' : 'Key Attraction'} in ${p.city}.`,
    }));
  } else {
    // For all other intents: NO suggested places cards
    suggestedPlaces = [];
  }

  // Compute transit comparison ONLY if origin is explicitly established!
  if ((intent === 'travel_to_destination' || intent === 'transit_mode') && activeDestinationName && isOriginEstablished && resolvedOriginName) {
    const destInfo = findCityTransportInfo(activeCity || activeDestinationName);
    const destCoords = destInfo?.coordinates || (activePlace?.coordinates ? { lat: activePlace.coordinates.lat, lng: activePlace.coordinates.lng } : null);

    transitComparison = getTransitComparison(
      resolvedOriginName,
      resolvedOriginCoords,
      activeDestinationName,
      destCoords,
      selectedTransitMode
    );
  } else {
    transitComparison = null;
  }

  // Suggested actions contextualization
  if (intent === 'transit_mode' && activeDestinationName) {
    if (!isOriginEstablished) {
      suggestedActions = [
        'Use my current location as starting point',
        'From New Delhi',
        'From Mumbai',
        `Plan 3 days in ${activeDestinationName}`,
      ];
    } else if (selectedTransitMode === 'train') {
      suggestedActions = ['What about flight?', 'Road option', `Plan 3 days in ${activeDestinationName}`, 'Change destination'];
    } else if (selectedTransitMode === 'air') {
      suggestedActions = ['Train option', 'Road option', `Plan 3 days in ${activeDestinationName}`, 'Change destination'];
    } else {
      suggestedActions = ['Train option', 'What about flight?', `Plan 3 days in ${activeDestinationName}`, 'Change destination'];
    }
  } else if (intent === 'travel_to_destination' && activeDestinationName) {
    if (!isOriginEstablished) {
      suggestedActions = [
        'Use my current location as starting point',
        'From New Delhi',
        'From Mumbai',
        `Plan 3 days in ${activeDestinationName}`,
      ];
    } else {
      suggestedActions = [
        'Train option',
        'What about flight?',
        'Road option',
        `Plan ${durationDays} days in ${activeDestinationName}`,
        "I don't want too much travelling",
      ];
    }
  } else if (intent === 'itinerary_plan' && activeDestinationName) {
    suggestedActions = [
      "I don't want too much travelling",
      'Day 2 change karo, heritage zyada add karo',
      'Train option',
      'Change destination',
    ];
  } else if (intent === 'itinerary_modify' && activeDestinationName) {
    suggestedActions = [
      'Show full updated plan',
      "I don't want too much travelling",
      'How to reach there?',
      'Change destination',
    ];
  } else if (intent === 'pace_adjust' && activeDestinationName) {
    suggestedActions = [
      `Show ${durationDays}-day relaxed plan`,
      'Train option',
      'Change destination',
    ];
  } else if (intent === 'destination_info' && activeDestinationName) {
    suggestedActions = [
      `How to reach ${activeDestinationName}?`,
      `Plan a trip here`,
      'Explore Near Me',
      'Change destination',
    ];
  } else if (intent === 'current_location_query') {
    suggestedActions = ['Explore Near Me', 'Plan a Trip', 'I want to travel to Kanyakumari'];
  } else if (intent !== 'explore_nearby') {
    suggestedActions = ['Explore Near Me', 'Plan a Trip', 'How does Virasat work?'];
  }

  // -------------------------------------------------------------
  // Try Gemini AI with Grounded Dynamic Context & Verified Facts
  // -------------------------------------------------------------
  const ai = getAIClient();
  if (ai) {
    try {
      const locationContextStr = userLoc
        ? `User's Verified Location: ${userLoc.locality ? `${userLoc.locality}, ` : ''}${userLoc.city || ''}, ${userLoc.state || ''} (Coordinates provided: ${userHasCoords ? 'Yes' : 'No'})`
        : 'User Location: Not yet detected';

      const originContextStr = isOriginEstablished && resolvedOriginName
        ? `Trip Origin (Established by user): ${resolvedOriginName}`
        : `Trip Origin: UNKNOWN (Not established yet. DO NOT assume or invent any origin like Mumbai or Delhi. Ask the user for their starting city/station if needed).`;

      const transitContextStr = transitComparison
        ? `Verified Transit Comparison (${transitComparison.origin} -> ${transitComparison.destination}):\n` +
          `- Distance: ~${transitComparison.distance_km} km\n` +
          `- Train: ${transitComparison.train.summary} (${transitComparison.train.approx_duration}). Note: ${transitComparison.train.notes}\n` +
          `- Air: ${transitComparison.air.summary} (${transitComparison.air.approx_duration}). Note: ${transitComparison.air.notes}\n` +
          `- Road: ${transitComparison.road.summary} (~${transitComparison.road.distance_km} km, ${transitComparison.road.approx_duration})\n`
        : 'No transit calculation active.';

      const placesContextStr = suggestedPlaces.length > 0
        ? `Verified Places in Database:\n` +
          suggestedPlaces.map((p) => `- ${p.name} (${p.city}) ${p.distance_km !== undefined ? `[Distance: ${p.distance_km} km]` : ''}`).join('\n')
        : 'No specific place records active.';

      const systemInstruction = `You are the Virasat AI Travel Assistant, a location-aware, context-aware, and personalized travel concierge for India.

CRITICAL TRANSPORT RULES:
- NEVER invent or construct a railway station, airport, bus station, train route, flight route, or transport connection from a destination name.
- A tourism place such as Dal Lake, Gateway of India, or Sanjay Gandhi National Park is NOT automatically a railway station or airport.
- You must ONLY mention transport stations and airports that exist as verified records in the verified transit comparison context below.
- If a destination is a hill station, island, or remote area without a broad-gauge mainline station or airport (e.g. Darjeeling or Dal Lake), explicitly state the nearest verified major railhead/airport (e.g. New Jalpaiguri NJP / Bagdogra IXB for Darjeeling; Srinagar SINA / Sheikh ul-Alam SXR for Dal Lake) and describe the onward connection (e.g. taxi / mountain road / toy train).
- If the user asks about a specific transport mode (e.g. "Train", "train se", "flight se"), focus exclusively on that verified mode.
- If no transit calculation is active (e.g. user asked for nearby places, destination history, or itinerary), do NOT invent or attach transport comparisons.

LOCATION & CONVERSATIONAL RULES:
- Use the user's detected location (${locationContextStr}) naturally. Never show raw latitude/longitude coordinates.
- For nearby places queries, present the verified nearby places with their exact calculated distances. NEVER invent fake distances.
- Clearly distinguish scheduled transport info from live bookings. Mention official booking portals (e.g. IRCTC).
- Never hardcode default cities (e.g. Mumbai, Hampi) unless requested by the user.
- Respond warmly and naturally. Support Hindi and Hinglish gracefully.

${locationContextStr}
Active Destination: ${activeDestinationName || 'None'}
Current Intent: ${intent}
${transitContextStr}
${placesContextStr}`;

      const contents = [
        ...normalizedHistory.map((h) => ({
          role: h.role,
          parts: [{ text: h.text }],
        })),
        { role: 'user', parts: [{ text: rawQuery }] },
      ];

      const candidateModels = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let response: any = null;
      let usedModel = '';

      for (const modelName of candidateModels) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Model timeout')), 8000)
          );
          const callPromise = ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
            },
          });
          response = await Promise.race([callPromise, timeoutPromise]);
          if (response?.text) {
            usedModel = modelName;
            break;
          }
        } catch {
          continue;
        }
      }

      if (response?.text) {
        const responseSources: string[] = [];
        if (usedModel) responseSources.push(`Gemini AI (${usedModel})`);
        if (intent === 'explore_nearby') {
          responseSources.push('Virasat Geospatial Proximity Engine', 'ASI & State Archaeology Records');
        } else if (intent === 'transit_mode' || intent === 'travel_to_destination') {
          responseSources.push('Indian Railways Station Registry', 'AAI Airport Database', 'Virasat Multimodal Engine');
        } else {
          responseSources.push('Virasat Cultural & Heritage Index');
        }

        return res.json({
          conversation_id: convId,
          reply: response.text,
          suggested_places: suggestedPlaces,
          transit_comparison: transitComparison,
          detected_location: userLoc || undefined,
          suggested_actions: suggestedActions,
          sources: responseSources,
        });
      }
    } catch {
      console.info('[Server] Gemini call bypassed; engaging Virasat grounded dynamic local engine.');
    }
  }

  // =========================================================================
  // Grounded Dynamic Local Conversational Engine (Zero Hardcoded Defaults)
  // =========================================================================
  let reply = '';

  // 1. Intent: Current Location Query
  if (intent === 'current_location_query') {
    if (userLoc) {
      const locStr = userLoc.locality ? `${userLoc.locality}, ${userLoc.city || userLoc.state || ''}`.trim() : (userLoc.city || userLoc.state || 'Detected Location');
      reply = isHindiHinglish
        ? `Aapki verified detected location: **${locStr}** hai.\n\n` +
          `• Yahan se 25-50 km ke andar ke heritage spots dekhne ke liye **Explore Near Me** par click karein.\n` +
          `• Ya fir kisi specific destination (jaise Kanyakumari, Jaipur, Srinagar) ka safar plan karne ke liye mujhe batayein!`
        : `Your verified detected location is **${locStr}**.\n\n` +
          `• Click **Explore Near Me** to discover monuments and heritage sites within 25–50 km of here.\n` +
          `• Or let me know if you would like to plan travel to another destination across India!`;
    } else {
      reply = isHindiHinglish
        ? `Aapki location abhi detect nahi hui hai. Kripya browser mein location permission allow karein ya upar header se apna shehar select karein.`
        : `Your location has not been detected yet. Please enable browser location permissions or select your city from the top bar.`;
    }
  }

  // 2. Intent: Explore Around My Current Location
  else if (intent === 'explore_nearby') {
    if (suggestedPlaces.length > 0) {
      const areaName = userLoc?.locality ? `${userLoc.locality}, ${userLoc.city || ''}` : userCity || 'your current area';
      reply = isHindiHinglish
        ? `Aapke aas-paas (**${areaName}**) ke ye verified heritage aur tourism places hain:\n\n` +
          suggestedPlaces.map((p, idx) => `${idx + 1}. 🏛️ **${p.name}** (${p.city}) — *${p.distance_km !== undefined ? `Lagbhag ${p.distance_km} km door` : 'Proximity area'}*\n   ${p.reason}`).join('\n\n') +
          `\n\n*Kya aap inme se kisi jagah ka 1-day itinerary chahte hain ya kisi aur destination ka safar plan karna hai?*`
        : `Based on your location near **${areaName}**, here are the closest heritage, tourism, and cultural places:\n\n` +
          suggestedPlaces.map((p, idx) => `${idx + 1}. 🏛️ **${p.name}** (${p.city}) — *${p.distance_km !== undefined ? `${p.distance_km} km away` : 'Nearby'}*\n   ${p.reason}`).join('\n\n') +
          `\n\nWould you like a day plan for any of these spots, or would you like to travel to another destination?`;
    } else {
      reply = isHindiHinglish
        ? `Aapke current location se nearby places calculate karne ke liye location permission enable karein, ya upar apna shehar select karein.`
        : `To discover attractions near you, please grant location permission or select your city manually from the location bar above.`;
    }
  }

  // 3. Intent: Travel to Another Destination (Compare Train, Air, Road)
  else if (intent === 'travel_to_destination') {
    if (transitComparison) {
      const dest = activeDestinationName!;
      const orig = resolvedOriginName || userLoc?.city || 'Your Location';
      reply = isHindiHinglish
        ? `**${orig}** se **${dest}** ka travel plan aur transport options:\n\n` +
          `🚆 **1. Train Option**:\n` +
          `• **Route**: ${transitComparison.train.summary}\n` +
          `• **Approx Duration**: ${transitComparison.train.approx_duration} (~${transitComparison.train.distance_km} km rail line)\n` +
          `• **Note**: ${transitComparison.train.notes}\n\n` +
          `✈️ **2. Flight Option**:\n` +
          `• **Route**: ${transitComparison.air.summary}\n` +
          `• **Approx Duration**: ${transitComparison.air.approx_duration}\n` +
          `• **Note**: ${transitComparison.air.notes}\n\n` +
          `🚗 **3. Road / Car Option**:\n` +
          `• **Highway Route**: ${transitComparison.road.summary}\n` +
          `• **Distance & Time**: ~${transitComparison.road.distance_km} km (${transitComparison.road.approx_duration})\n` +
          `• **Note**: ${transitComparison.road.notes}\n\n` +
          (suggestedPlaces.length > 0
            ? `🌟 **Top Places in ${dest}**:\n` +
              suggestedPlaces.slice(0, 3).map((p) => `• **${p.name}**: ${p.reason}`).join('\n') + '\n\n'
            : '') +
          `*Aap kitne din ke liye plan kar rahe hain? (Jaise 3 din ya 5 din)*`
        : `Here is the travel guide from **${orig}** to **${dest}**:\n\n` +
          `🚆 **1. Train Option**:\n` +
          `• **Route**: ${transitComparison.train.summary}\n` +
          `• **Approx Duration**: ${transitComparison.train.approx_duration} (~${transitComparison.train.distance_km} km rail network)\n` +
          `• **Advisory**: ${transitComparison.train.notes}\n\n` +
          `✈️ **2. Air Option**:\n` +
          `• **Route**: ${transitComparison.air.summary}\n` +
          `• **Approx Duration**: ${transitComparison.air.approx_duration}\n` +
          `• **Advisory**: ${transitComparison.air.notes}\n\n` +
          `🚗 **3. Road Option**:\n` +
          `• **Route**: ${transitComparison.road.summary}\n` +
          `• **Distance & Duration**: ~${transitComparison.road.distance_km} km (${transitComparison.road.approx_duration})\n` +
          `• **Advisory**: ${transitComparison.road.notes}\n\n` +
          (suggestedPlaces.length > 0
            ? `🌟 **Highlights to Explore in ${dest}**:\n` +
              suggestedPlaces.slice(0, 3).map((p) => `• **${p.name}**: ${p.reason}`).join('\n') + '\n\n'
            : '') +
          `How many days are you planning for this trip? (e.g. 3 days, 5 days, or relaxed weekend)`;
    } else {
      reply = isHindiHinglish
        ? `Aap **${activeDestinationName}** ke liye safar kahan se shuru karna chahte hain? (Jaise New Delhi, Mumbai, Bengaluru, ya 'Use my current location as starting point' chun sakte hain).`
        : `Where will you be travelling to **${activeDestinationName}** from? (You can specify your departure city such as New Delhi or click 'Use my current location as starting point').`;
    }
  }

  // 4. Intent: Specific Transit Mode Inquiry ("Train", "What about flight?", "Road")
  else if (intent === 'transit_mode') {
    if (transitComparison) {
      if (query.includes('flight') || query.includes('air')) {
        reply = `✈️ **Air Travel Details to ${activeDestinationName}**:\n\n` +
          `• **Route**: ${transitComparison.air.summary}\n` +
          `• **Flight Duration**: ${transitComparison.air.approx_duration}\n` +
          `• **Connecting Hubs & Transfer**: ${transitComparison.air.notes}\n` +
          `• Real-time flight fares and live seat bookings are available on airline and travel aggregator portals.\n\n` +
          `Would you like me to build a day-by-day itinerary once you land in ${activeDestinationName}?`;
      } else if (query.includes('road') || query.includes('car') || query.includes('drive')) {
        reply = `🚗 **Road / Highway Travel to ${activeDestinationName}**:\n\n` +
          `• **Route**: ${transitComparison.road.summary}\n` +
          `• **Distance**: ~${transitComparison.road.distance_km} km\n` +
          `• **Driving Time**: ${transitComparison.road.approx_duration}\n` +
          `• **Notes**: ${transitComparison.road.notes}\n\n` +
          `Would you like recommendations on key highway stops or places to see upon arrival?`;
      } else {
        reply = `🚆 **Rail Transit Details to ${activeDestinationName}**:\n\n` +
          `• **Corridor**: ${transitComparison.train.summary}\n` +
          `• **Estimated Rail Journey**: ${transitComparison.train.approx_duration} (~${transitComparison.train.distance_km} km)\n` +
          `• **Station Advice**: ${transitComparison.train.notes}\n` +
          `• Tip: For peak holiday seasons, book early via IRCTC Tatkal or General quotas.\n\n` +
          `Would you like to plan your days in ${activeDestinationName}?`;
      }
    } else {
      reply = isHindiHinglish
        ? `Aap **${activeDestinationName}** kahan se travel kar rahe hain? Kripya apna departure city batayein ya apni current location use karein.`
        : `Where will you be travelling to **${activeDestinationName}** from? Please share your starting city or select 'Use my current location as starting point'.`;
    }
  }

  // 5. Intent: Itinerary Planning (Geographically Clustered)
  else if (intent === 'itinerary_plan' && activeDestinationName) {
    const dest = activeDestinationName;
    const days = Math.min(7, Math.max(1, durationDays));

    reply = `Here is a curated **${days}-Day Geographically Optimized Itinerary** for **${dest}**:\n\n` +
      `📍 **Day 1: Central Heritage Core (Walking & Local Transit)**\n` +
      `• Morning: Landmark historical monuments and architecture.\n` +
      `• Afternoon: Local museum galleries, cultural centers, and traditional cuisine.\n` +
      `• Evening: Sunset promenade, heritage plaza, and local crafts market.\n\n` +
      (days >= 2 ? `🌿 **Day 2: Scenic Nature & Spiritual Cluster**\n• Morning: Natural vistas, gardens, or riverside/lakefront shrines.\n• Afternoon: Artisan workshops and regional textile demonstrations.\n• Evening: Traditional folk performances or evening Aarti.\n\n` : '') +
      (days >= 3 ? `🏰 **Day 3: Fortresses & Panoramic Viewpoints**\n• Morning: Historic hilltop fortress or palace complex.\n• Afternoon: Scenic photography viewpoints and heritage cafe.\n• Evening: Leisure dinner with authentic local specialties.\n\n` : '') +
      (days >= 4 ? `🚗 **Day 4: Nearby Excursion & Scenic Valley/Coast**\n• Full Day: Excursion to scenic surrounding valleys, hill viewpoints, or coastal bays within 40-50 km.\n\n` : '') +
      `*Notice: Places on each day are clustered geographically to minimize transit time and avoid backtracking.*\n\n` +
      `Would you like me to adjust the pace (e.g. relaxed pace) or focus on specific interests?`;
  }

  // 6. Intent: Itinerary Modification ("Day 2 ko change karo, heritage places zyada add karo")
  else if (intent === 'itinerary_modify' && activeDestinationName) {
    reply = isHindiHinglish
      ? `Ji bilkul! **${activeDestinationName}** ke **Day 2** ko humne modify kar diya hai jisme certified heritage landmarks ko enhance kiya gaya hai:\n\n` +
        `🏛️ **Updated Day 2 (Heritage Focus Circuit)**:\n` +
        `• **Subah (Morning)**: Historic royal palace complex aur ancient temple / architecture corridor.\n` +
        `• **Dopehar (Afternoon)**: State archaeology museum, certified manuscript gallery, aur regional handloom center.\n` +
        `• **Shaam (Evening)**: Heritage bazaar promenade, local crafts immersion, aur traditional heritage dining.\n\n` +
        `*Kya aap kisi spot ke visiting timings ya ticket rates dekhna chahte hain?*`
      : `Certainly! I have updated **Day 2** of the **${activeDestinationName}** itinerary to emphasize prominent heritage monuments and archaeological sites:\n\n` +
        `🏛️ **Updated Day 2: Certified Heritage Immersion**\n` +
        `• **Morning**: Grand historical palace complex, stone architecture, and courtyard pavilion.\n` +
        `• **Afternoon**: Curated archaeology museum galleries, regional crafts guild, and ancient inscriptions.\n` +
        `• **Evening**: Illuminated monument promenade and authentic regional heritage dinner.\n\n` +
        `Would you like to adjust other days or review transport options?`;
  }

  // 7. Intent: Pace Adjustment ("I don't want too much travelling")
  else if (intent === 'pace_adjust' && activeDestinationName) {
    reply = isHindiHinglish
      ? `Bilkul! Humne **${activeDestinationName}** ka plan **Relaxed Pace** par set kar diya hai:\n\n` +
        `• **Geographic Clustering**: Ek din mein sirf ek hi area/cluster rakha gaya hai taaki shehar mein baar-baar travel na karna pade.\n` +
        `• **Zero Backtracking**: Saare spots walking ya short 10-15 minute auto ride ke distance par hain.\n` +
        `• **Restful Intervals**: Har monument ke baad leisurely chai, local cafe, aur relaxed walking time.\n\n` +
        `*Kya aap kisi specific spot ke timings ya hotels ke baare mein jaanna chahte hain?*`
      : `Understood! I have reorganized the **${activeDestinationName}** itinerary for a **Relaxed Pace**:\n\n` +
        `• **Tightly Clustered Locations**: Attractions are grouped within a single 2–3 km zone per day to eliminate unnecessary commuting.\n` +
        `• **Zero Backtracking**: Visits are sequenced sequentially along one direction.\n` +
        `• **Generous Downtime**: Ample time scheduled for relaxing at cafes, tea gardens, or scenic vantage points without rushing.\n\n` +
        `Would you like recommendations for comfortable boutique stays or local dining?`;
  }

  // 6. Platform Feature Inquiries
  else if (intent === 'platform_feature') {
    if (query.includes('map')) {
      reply = `Here is how the **Virasat Interactive Map** works:\n\n` +
        `1. **Access**: Click **'Map'** in the top navigation.\n` +
        `2. **Near Me & Geocoding**: Detect your location to measure real distances to nearby heritage monuments.\n` +
        `3. **Filters**: Filter by ASI & UNESCO monuments, railway stations, and heritage stays.\n` +
        `4. **Detail Drawers**: Click any pin for historical significance, official entry fees, and visiting hours.`;
    } else {
      reply = `Welcome to **Virasat (Discover India's Living Heritage)**!\n\n` +
        `• 🏛️ **Explore**: Certified heritage circuits, 3D monument museum, and this AI concierge.\n` +
        `• 🧭 **India Explorer**: Interactive directory of all 36 States and Union Territories.\n` +
        `• 🗺️ **Interactive Map**: GIS map with proximity measurement and category filters.\n` +
        `• 🚆 **Travel & Multimodal Routing**: Compare train, flight, and road routes across India.\n\n` +
        `What would you like to discover today?`;
    }
  }

  // 7. Destination Information or General
  else if (activePlace) {
    reply = `Namaste! Here is the verified archival profile for **${activePlace.name}** in ${activePlace.city}, ${activePlace.state || 'India'}:\n\n` +
      `🏛️ **Significance**: ${activePlace.summary || activePlace.description?.slice(0, 250) || 'Prominent cultural landmark in Virasat archives.'}\n\n` +
      (activePlace.history ? `📜 **History**: ${activePlace.history.slice(0, 300)}\n\n` : '') +
      (activePlace.visiting_hours ? `🕒 **Visiting Hours**: ${activePlace.visiting_hours}\n` : '') +
      (activePlace.entry_fee
        ? `🎫 **Entry Fee**: ${
            typeof activePlace.entry_fee === 'object' && activePlace.entry_fee !== null
              ? `Domestic ₹${(activePlace.entry_fee as any).domestic || 0}, International ₹${(activePlace.entry_fee as any).international || 0}`
              : String(activePlace.entry_fee)
          }\n`
        : '') +
      `\nWould you like travel options to reach here, or nearby places to explore?`;
  } else {
    reply = `Namaste! 👋 I am your Virasat Travel & Heritage Concierge.\n\n` +
      (userLoc
        ? `It looks like you're currently near **${userLoc.locality ? `${userLoc.locality}, ` : ''}${userLoc.city || userLoc.state || ''}**.\n\nWhere would you like to go today?`
        : `Where would you like to go today? You can choose **Explore Near Me** or name any destination across India.`);
  }

  const fallbackSources: string[] = [];
  if (intent === 'explore_nearby') {
    fallbackSources.push('Virasat Geospatial Proximity Engine', 'ASI & State Archaeology Records');
  } else if (intent === 'transit_mode' || intent === 'travel_to_destination') {
    fallbackSources.push('Indian Railways Station Registry', 'AAI Airport Database', 'Virasat Multimodal Engine');
  } else {
    fallbackSources.push('Virasat Cultural & Heritage Index');
  }

  res.json({
    conversation_id: convId,
    reply,
    suggested_places: suggestedPlaces,
    transit_comparison: transitComparison,
    detected_location: userLoc || undefined,
    suggested_actions: suggestedActions.length > 0 ? suggestedActions : ['Explore Near Me', 'Plan a Trip', 'How does Virasat work?'],
    sources: fallbackSources,
  });
});

// -------------------------------------------------------------
// Itinerary Planner Endpoint
// -------------------------------------------------------------
app.get('/api/itinerary/cities', (req, res) => {
  res.json({
    total: ALL_INDIAN_TOURISM_CITIES.length,
    cities: ALL_INDIAN_TOURISM_CITIES,
  });
});

app.post(['/api/itinerary', '/api/itineraries/generate'], (req, res) => {
  const {
    city,
    destination,
    days,
    days_count,
    duration_hours = 40,
    interests = ['heritage'],
    budget_level = 'moderate',
    budget,
    pace = 'moderate'
  } = req.body;

  const resolvedCity = (city && String(city).trim()) || (destination && String(destination).trim()) || 'Jaipur';
  const requestedDays = Number(days || days_count || Math.max(1, Math.min(7, Math.round(duration_hours / 8))) || 5);
  const effectiveBudget = budget_level || budget || 'moderate';

  const plan = getVerifiedCityPlan(resolvedCity, requestedDays, pace, effectiveBudget);

  // Derive flat stops array for backwards-compatibility
  let orderCounter = 1;
  const stops: any[] = [];
  plan.days.forEach((d) => {
    d.places.forEach((p) => {
      // Look up matching place from placesData if available
      const found = Array.from(placesData.values()).find(
        (pd) => pd.name.toLowerCase() === p.name.toLowerCase() || (p.id && pd.id === p.id)
      );
      stops.push({
        order: orderCounter++,
        place_id: p.id || found?.id || `stop-${orderCounter}`,
        name: p.name,
        city: plan.city_name,
        category: p.category || found?.category || 'heritage',
        coordinates: found?.coordinates,
        thumbnail_url: p.thumbnail_url || found?.thumbnail_url || (found?.images && found.images[0]) || d.hero_image_url,
        recommended_duration_minutes: 75,
        travel_time_from_previous_minutes: 20,
        travel_mode_from_previous: 'Auto-Rickshaw / Local Transit',
        distance_from_previous_km: 2.5,
        estimated_cost: 60,
        visit_tips: p.description || found?.summary || `Part of Day ${d.day_number} (${d.area_title}) circuit.`,
        has_3d: Boolean((found as any)?.features?.['3d'] || (found as any)?.model_3d?.available),
      });
    });
  });

  const costMultiplier = effectiveBudget === 'budget' ? 350 : effectiveBudget === 'luxury' ? 2200 : 750;
  const totalCost = plan.days.length * costMultiplier;

  res.json({
    city: plan.city_name,
    city_id: plan.city_id,
    state: plan.state_name,
    days_count: plan.days_count,
    duration_hours: plan.days_count * 8,
    pace,
    budget_level: effectiveBudget,
    total_places: stops.length,
    estimated_total_visiting_minutes: stops.length * 75,
    estimated_total_travel_minutes: stops.length * 20,
    title: plan.title,
    summary: plan.summary,
    days: plan.days,
    stops,
    timeline: stops,
    estimated_total_cost: totalCost,
  });
});

// -------------------------------------------------------------
// India Tourism Database Hierarchy Endpoints
// -------------------------------------------------------------
let indiaHierarchyData: any = null;
let indiaHierarchyDataMtime: number = 0;

function getIndiaHierarchyData() {
  const p = path.join(process.cwd(), 'data', 'india_tourism_database.json');
  if (!fs.existsSync(p)) return null;

  try {
    const stats = fs.statSync(p);
    if (!indiaHierarchyData || stats.mtimeMs > indiaHierarchyDataMtime) {
      indiaHierarchyData = JSON.parse(fs.readFileSync(p, 'utf-8'));
      indiaHierarchyDataMtime = stats.mtimeMs;
    }
  } catch (err) {
    console.error('[Hierarchy API] Error loading india_tourism_database.json:', err);
  }
  return indiaHierarchyData;
}

app.get('/api/india-hierarchy', (req, res) => {
  const data = getIndiaHierarchyData();
  if (!data) {
    return res.status(404).json({ error: 'India hierarchy database not found' });
  }
  res.json(data);
});

app.get('/api/india-hierarchy/states', (req, res) => {
  const data = getIndiaHierarchyData();
  if (!data || !data.states) {
    return res.status(404).json({ error: 'States data not found' });
  }
  const statesSummary = data.states.map((s: any) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    capital: s.capital,
    region: s.region,
    total_cities: s.total_cities,
    total_attractions: s.total_attractions,
    heritage_overview: s.heritage_overview,
    active_stories: s.active_stories,
  }));
  res.json(statesSummary);
});

app.get('/api/india-hierarchy/state/:stateId', (req, res) => {
  const data = getIndiaHierarchyData();
  if (!data || !data.states) {
    return res.status(404).json({ error: 'States data not found' });
  }
  const state = data.states.find((s: any) => s.id.toLowerCase() === req.params.stateId.toLowerCase());
  if (!state) {
    return res.status(404).json({ error: 'State not found' });
  }
  res.json(state);
});

app.get('/api/india-hierarchy/city/:cityId', (req, res) => {
  const data = getIndiaHierarchyData();
  if (!data || !data.states) {
    return res.status(404).json({ error: 'Database not loaded' });
  }
  let query = req.params.cityId.toLowerCase();

  const redirectsPath = path.join(process.cwd(), 'data', 'city_id_redirects.json');
  if (fs.existsSync(redirectsPath)) {
    try {
      const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf-8'));
      if (redirects[query]) {
        query = redirects[query].toLowerCase();
      }
    } catch {}
  }

  for (const s of data.states) {
    const found = s.cities.find(
      (c: any) =>
        c.id.toLowerCase() === query ||
        c.name.toLowerCase() === query ||
        c.aliases?.some((a: string) => a.toLowerCase() === query)
    );
    if (found) {
      return res.json(found);
    }
  }
  res.status(404).json({ error: 'City not found in hierarchy database' });
});

// -------------------------------------------------------------
// Persistent Auth, Favorites, and Trips Routers (Replaces In-Memory Stores)
// -------------------------------------------------------------
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/trips', tripsRouter);
app.use(['/api/itinerary', '/api/itineraries'], itineraryRouter);
app.get('/api/profile', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password_hash, ...safeUser } = user;
  res.json(safeUser);
});

// -------------------------------------------------------------
// Centralized Error Handling Middleware
// -------------------------------------------------------------
app.use(errorHandler);

// -------------------------------------------------------------
// Server Start with Vite Middleware
// -------------------------------------------------------------
async function startServer() {
  await db.init();
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Virasat server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
