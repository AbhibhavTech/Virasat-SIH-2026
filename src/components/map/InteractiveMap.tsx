import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { PlaceSummary, RouteResponse, TransportMode, LocationSuggestion, GoogleMapsPlaceInfo, HeritageRouteAnalysisResult } from '../../types';
import { api } from '../../services/api';
import { findNearestCity, calculateHaversineKm } from '../../data/citiesData';
import { VERIFIED_HIDDEN_GEMS, HiddenGemItem } from '../../data/hiddenGemsData';
import {
  INDIAN_AIRPORTS,
  STATE_COORDINATES,
  IndianAirport,
  haversineDistanceKm,
  findNearestAirport,
  searchAirports,
  generateFlightArc,
  getGoogleFlightsUrl,
} from '../../data/indianAirports';
import {
  HeritageRouteAnalyzer,
  SelectedMonumentItem,
  CURATED_HERITAGE_CIRCUITS,
} from './HeritageRouteAnalyzer';
import {
  MapPin,
  Search,
  Layers,
  Compass,
  Navigation,
  Train,
  Landmark,
  Car,
  Footprints,
  Plane,
  Crosshair,
  X,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Clock,
  Ticket,
  ChevronRight,
  Info,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Check,
} from 'lucide-react';

export type MapTransportMode = 'DRIVE' | 'TRANSIT' | 'WALK' | 'FLIGHT';

// Helper to detect dual-point route searches like "delhi to agra" or "csmt - gateway"
function parseDualPointsQuery(query: string): { originQuery: string; destQuery: string } | null {
  const q = (query || '').trim();
  const dualPatterns = [
    /^(.*?)\s+and\s+(?:second\s+)?destination\s*[:-]?\s*(.*)$/i,
    /^(.*?)\s+(?:to|->|-->)\s+(.*)$/i,
    /^(.*?)\s*[-–—]\s*(.*)$/i,
  ];
  for (const pattern of dualPatterns) {
    const m = q.match(pattern);
    if (m && m[1]?.trim().length >= 2 && m[2]?.trim().length >= 2) {
      return { originQuery: m[1].trim(), destQuery: m[2].trim() };
    }
  }
  return null;
}

// Point type used in clustering
export interface MapPointItem {
  id: string;
  name: string;
  type: 'heritage' | 'hidden_gem' | 'station';
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  raw: any;
}

interface InteractiveMapProps {
  onSelectPlace: (id: string) => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
  places?: PlaceSummary[];
  states?: any[];
  onNavigateToPlace?: (placeId: string) => void;
  onView3DPlace?: (placeId: string) => void;
  initialOrigin?: string;
  initialDestination?: string;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectPlace,
  selectedCity = 'Mumbai',
  onSelectCity,
  onNavigateToPlace,
  onView3DPlace,
  initialOrigin,
  initialDestination,
  height = '620px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Unified clustered layer for all points
  const clusterLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.LayerGroup | L.Polyline | null>(null);
  const routeMarkersRef = useRef<L.LayerGroup | null>(null);
  const searchHighlightRef = useRef<L.LayerGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const heritageRouteGroupRef = useRef<L.LayerGroup | null>(null);
  const segmentPolylinesRef = useRef<Record<number, L.Polyline>>({});

  // Datasets
  const [heritageSites, setHeritageSites] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [hiddenGemsList] = useState<HiddenGemItem[]>(VERIFIED_HIDDEN_GEMS);
  const [loading, setLoading] = useState(true);

  // Heritage Route Analyzer State
  const [isHeritageAnalyzerOpen, setIsHeritageAnalyzerOpen] = useState(false);
  const [selectedHeritageMonuments, setSelectedHeritageMonuments] = useState<SelectedMonumentItem[]>(() => {
    return CURATED_HERITAGE_CIRCUITS[0]?.monuments || [];
  });
  const [activeHeritageResult, setActiveHeritageResult] = useState<HeritageRouteAnalysisResult | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');

  // Layer Toggles - ONLY Heritage & Hidden Gems active; Stations HIDDEN by default; Cities & Sights REMOVED
  const [showHeritage, setShowHeritage] = useState(true);
  const [showHiddenGems, setShowHiddenGems] = useState(true);
  const [showStations, setShowStations] = useState(false); // Default HIDDEN

  // Google Maps Live Place Intel Drawer State
  const [mapsIntelPoint, setMapsIntelPoint] = useState<MapPointItem | null>(null);
  const [mapsIntelLoading, setMapsIntelLoading] = useState(false);
  const [mapsIntelData, setMapsIntelData] = useState<GoogleMapsPlaceInfo | null>(null);

  const handleOpenMapsIntel = async (item: MapPointItem) => {
    setMapsIntelPoint(item);
    setMapsIntelLoading(true);
    setMapsIntelData(null);
    try {
      const data = await api.getPlaceMapsInfo({
        place_name: item.name,
        city: item.city,
        state: item.state,
        lat: item.lat,
        lng: item.lng,
      });
      setMapsIntelData(data);
    } catch (err) {
      console.error('Failed to load Google Maps intel:', err);
    } finally {
      setMapsIntelLoading(false);
    }
  };

  // Autocomplete Search States (Global Map Search)
  const [searchSuggestions, setSearchSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchHighlightedIndex, setSearchHighlightedIndex] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Route Studio Autocomplete States
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOriginSuggestOpen, setIsOriginSuggestOpen] = useState(false);
  const [isDestSuggestOpen, setIsDestSuggestOpen] = useState(false);
  const [isOriginSearching, setIsOriginSearching] = useState(false);
  const [isDestSearching, setIsDestSearching] = useState(false);
  const [originHighlightedIndex, setOriginHighlightedIndex] = useState<number>(-1);
  const [destHighlightedIndex, setDestHighlightedIndex] = useState<number>(-1);
  const originContainerRef = useRef<HTMLDivElement>(null);
  const destContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsSearchDropdownOpen(false);
      }
      if (originContainerRef.current && !originContainerRef.current.contains(target)) {
        setIsOriginSuggestOpen(false);
      }
      if (destContainerRef.current && !destContainerRef.current.contains(target)) {
        setIsDestSuggestOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Geolocation
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    nearestCity?: string;
    nearestHeritage?: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // In-Map Route State - Empty by default (no hardcoded CSMT or Mumbai)
  const [isRoutingOpen, setIsRoutingOpen] = useState(Boolean(initialOrigin || initialDestination));
  const [routeOrigin, setRouteOrigin] = useState<string>(initialOrigin || '');
  const [routeOriginName, setRouteOriginName] = useState<string>(initialOrigin ? 'Origin Location' : '');
  const [routeOriginCoords, setRouteOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [routeDestination, setRouteDestination] = useState<string>(initialDestination || '');
  const [routeDestName, setRouteDestName] = useState<string>(initialDestination ? 'Destination' : '');
  const [routeDestCoords, setRouteDestCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedMode, setSelectedMode] = useState<MapTransportMode>('DRIVE');
  const [activeRoute, setActiveRoute] = useState<RouteResponse | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isRoutePanelMinimized, setIsRoutePanelMinimized] = useState(false);
  const [flightDate, setFlightDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Coordinate parser
  const parseLatLng = (latVal: any, lngVal: any): [number, number] | null => {
    if (latVal === undefined || latVal === null || lngVal === undefined || lngVal === null) return null;
    const lat = typeof latVal === 'number' ? latVal : parseFloat(String(latVal));
    const lng = typeof lngVal === 'number' ? lngVal : parseFloat(String(lngVal));
    if (isNaN(lat) || isNaN(lng) || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return [lat, lng];
  };

  const extractValidCoordinates = (item: any): [number, number] | null => {
    if (!item) return null;
    if (item.coordinates) {
      if (Array.isArray(item.coordinates) && item.coordinates.length >= 2) {
        const res = parseLatLng(item.coordinates[0], item.coordinates[1]);
        if (res) return res;
      }
      if (typeof item.coordinates === 'object') {
        const lat = item.coordinates.lat ?? item.coordinates.latitude;
        const lng = item.coordinates.lng ?? item.coordinates.longitude;
        const res = parseLatLng(lat, lng);
        if (res) return res;
      }
    }
    const topLat = item.lat ?? item.latitude;
    const topLng = item.lng ?? item.longitude;
    return parseLatLng(topLat, topLng);
  };

  // City preset coordinates for rapid panning
  const cityCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
    'all-india': { lat: 22.5, lng: 79.0, zoom: 5 },
    mumbai: { lat: 18.9431, lng: 72.833, zoom: 12 },
    delhi: { lat: 28.6139, lng: 77.209, zoom: 12 },
    jaipur: { lat: 26.9124, lng: 75.7873, zoom: 13 },
    agra: { lat: 27.1751, lng: 78.0421, zoom: 13 },
    varanasi: { lat: 25.3176, lng: 82.9739, zoom: 13 },
    kochi: { lat: 9.9312, lng: 76.2673, zoom: 13 },
    goa: { lat: 15.4909, lng: 73.8278, zoom: 12 },
  };

  // Dynamically resolve flight endpoints and distances
  const resolvedFlightInfo = useMemo(() => {
    const origLat = routeOriginCoords?.lat;
    const origLng = routeOriginCoords?.lng;
    const destLat = routeDestCoords?.lat;
    const destLng = routeDestCoords?.lng;

    let origAirport: IndianAirport | null = null;
    let destAirport: IndianAirport | null = null;
    let origDistToAirport = 0;
    let destDistToAirport = 0;

    if (origLat !== undefined && origLng !== undefined) {
      const res = findNearestAirport(origLat, origLng);
      origAirport = res.airport;
      origDistToAirport = res.distanceKm;
    } else if (routeOriginName || routeOrigin) {
      const match = searchAirports(routeOriginName || routeOrigin);
      if (match.length > 0) origAirport = match[0];
    }

    if (destLat !== undefined && destLng !== undefined) {
      const res = findNearestAirport(destLat, destLng);
      destAirport = res.airport;
      destDistToAirport = res.distanceKm;
    } else if (routeDestName || routeDestination) {
      const match = searchAirports(routeDestName || routeDestination);
      if (match.length > 0) destAirport = match[0];
    }

    let distanceKm = 0;
    let estDurationMinutes = 0;
    if (origAirport && destAirport) {
      distanceKm = haversineDistanceKm(origAirport.lat, origAirport.lng, destAirport.lat, destAirport.lng);
      estDurationMinutes = Math.round((distanceKm / 750) * 60 + 35);
    }

    return {
      origAirport,
      destAirport,
      origDistToAirport,
      destDistToAirport,
      distanceKm,
      estDurationMinutes,
    };
  }, [routeOriginCoords, routeDestCoords, routeOriginName, routeOrigin, routeDestName, routeDestination]);

  const handleSwapPoints = () => {
    const tempOrigin = routeOrigin;
    const tempOriginName = routeOriginName;
    const tempOriginCoords = routeOriginCoords;
    setRouteOrigin(routeDestination);
    setRouteOriginName(routeDestName);
    setRouteOriginCoords(routeDestCoords);
    setRouteDestination(tempOrigin);
    setRouteDestName(tempOriginName);
    setRouteDestCoords(tempOriginCoords);
  };

  // 1. Fetch datasets: Heritage & Stations
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const [heritageRes, stationsRes] = await Promise.all([
          api.getHeritage({ limit: 100 }),
          api.getRailwayStations(),
        ]);
        if (isMounted) {
          setHeritageSites(heritageRes.data || []);
          setStations(stationsRes || []);
        }
      } catch (err) {
        console.error('[Map] Error fetching map datasets:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (err) {
        console.warn('[Map] Container cleanup warning:', err);
      }
      mapInstanceRef.current = null;
    }

    const cityKey = (selectedCity || 'all-india').toLowerCase().replace(/\s+/g, '-');
    const cityCfg = cityCoordinates[cityKey] || cityCoordinates['all-india'];
    const safeCenter = parseLatLng(cityCfg?.lat, cityCfg?.lng) || [22.5, 79.0];
    const safeZoom = typeof cityCfg?.zoom === 'number' && !isNaN(cityCfg.zoom) ? cityCfg.zoom : 5;

    try {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: true,
      }).setView(safeCenter, safeZoom);

      mapInstanceRef.current = map;

      // Add Zoom Control bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clean OpenStreetMap tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Layer groups
      clusterLayerRef.current = L.layerGroup().addTo(map);
      routeMarkersRef.current = L.layerGroup().addTo(map);
      searchHighlightRef.current = L.layerGroup().addTo(map);
      heritageRouteGroupRef.current = L.layerGroup().addTo(map);
    } catch (initErr) {
      console.error('[Map] Failed to initialize Leaflet:', initErr);
    }

    return () => {
      if (heritageRouteGroupRef.current) {
        try {
          heritageRouteGroupRef.current.clearLayers();
        } catch {}
      }
      if (searchHighlightRef.current) {
        try {
          searchHighlightRef.current.clearLayers();
        } catch {}
      }
      if (clusterLayerRef.current) {
        try {
          clusterLayerRef.current.clearLayers();
        } catch {}
      }
      if (userAccuracyCircleRef.current) {
        try {
          userAccuracyCircleRef.current.remove();
        } catch {}
      }
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('[Map] Unmount cleanup warning:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Pan map when selectedCity changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCity) return;
    const key = selectedCity.toLowerCase().replace(/\s+/g, '-');
    const cfg = cityCoordinates[key] || cityCoordinates['all-india'];
    if (cfg) {
      const safeCenter = parseLatLng(cfg.lat, cfg.lng) || [22.5, 79.0];
      const safeZoom = typeof cfg.zoom === 'number' && !isNaN(cfg.zoom) ? cfg.zoom : 5;
      try {
        mapInstanceRef.current.flyTo(safeCenter, safeZoom, { duration: 1.1 });
      } catch (err) {
        console.warn('[Map] flyTo failed:', err);
      }
    }
  }, [selectedCity]);

  // Create popup HTML for single markers
  const createSinglePopupContent = (item: MapPointItem): HTMLElement => {
    const card = document.createElement('div');
    card.className = 'p-3 text-slate-900 max-w-[275px] font-sans rounded-xl';

    if (item.type === 'heritage') {
      const site = item.raw;
      const img = site.thumbnail_url || (site.images && site.images[0]) || '';
      const fee = site.entry_fee
        ? site.entry_fee.domestic === 0
          ? 'Free Entry'
          : `₹${site.entry_fee.domestic}`
        : site.entry_fee_inr
        ? `₹${site.entry_fee_inr}`
        : 'Free Access';
      const timing = site.visiting_hours || site.timings || '09:00 AM - 05:30 PM';

      card.innerHTML = `
        ${img ? `
          <div style="position: relative; margin: -12px -12px 10px -12px; border-top-left-radius: 12px; border-top-right-radius: 12px; overflow: hidden; height: 110px;">
            <img src="${img}" alt="${site.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; bottom: 8px; left: 8px; font-size: 10px; font-weight: 800; background: rgba(234, 88, 12, 0.92); color: #fff; padding: 2px 7px; border-radius: 6px; text-transform: uppercase;">
              🏛️ Heritage Monument
            </span>
          </div>
        ` : ''}
        <h4 style="font-weight: 800; font-size: 14px; margin: 0 0 2px 0; color: #0f172a; line-height: 1.25;">${site.name}</h4>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${site.city || ''}, ${site.state || 'India'}</div>

        <div style="display: flex; gap: 8px; margin-bottom: 10px; font-size: 11px; background: #f8fafc; padding: 6px 8px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="flex: 1;">
            <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Hours</div>
            <div style="font-weight: 600; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${timing}</div>
          </div>
          <div style="border-left: 1px solid #cbd5e1; padding-left: 8px;">
            <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Entry</div>
            <div style="font-weight: 700; color: #059669;">${fee}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
          <button id="btn-orig-${site.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            🚩 Start Route
          </button>
          <button id="btn-dest-${site.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            🎯 Route Here
          </button>
        </div>

        <div style="display: flex; gap: 4px; margin-bottom: 6px;">
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.name + ' ' + (site.city || ''))}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-decoration: none; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: 700; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>🗺️ Google Maps</span>
          </a>
          <button id="btn-maps-intel-${site.id}" style="flex: 1; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>📍 Maps Intel</span>
          </button>
        </div>

        <button id="btn-add-analyzer-${site.id}" style="width: 100%; background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 6px;">
          <span>🏛️ Add to Heritage Route Analyzer</span>
        </button>

        <div style="display: flex; gap: 6px;">
          <button id="btn-dossier-${site.id}" style="flex: 1; background: #ea580c; color: #fff; border: none; border-radius: 6px; padding: 6px 0; font-size: 11px; font-weight: 700; cursor: pointer;">
            View Details
          </button>
        </div>
      `;
    } else if (item.type === 'hidden_gem') {
      const gem = item.raw;
      card.innerHTML = `
        ${gem.thumbnailUrl ? `
          <div style="position: relative; margin: -12px -12px 10px -12px; border-top-left-radius: 12px; border-top-right-radius: 12px; overflow: hidden; height: 115px;">
            <img src="${gem.thumbnailUrl}" alt="${gem.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; bottom: 8px; left: 8px; font-size: 10px; font-weight: 800; background: rgba(147, 51, 234, 0.92); color: #fff; padding: 2px 7px; border-radius: 6px; text-transform: uppercase;">
              💎 Hidden Gem
            </span>
          </div>
        ` : ''}
        <h4 style="font-weight: 800; font-size: 14px; margin: 0 0 2px 0; color: #0f172a; line-height: 1.25;">${gem.name}</h4>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${gem.city}, ${gem.state} • <span style="color:#9333ea; font-weight:700;">${gem.category}</span></div>

        <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px; color: #4c1d95; line-height: 1.35;">
          ${gem.whyInteresting}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
          <button id="btn-orig-${gem.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer;">
            🚩 Start Route
          </button>
          <button id="btn-dest-${gem.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer;">
            🎯 Route Here
          </button>
        </div>

        <div style="display: flex; gap: 4px; margin-bottom: 6px;">
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gem.name + ' ' + (gem.city || ''))}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-decoration: none; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: 700; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>🗺️ Google Maps</span>
          </a>
          <button id="btn-maps-intel-${gem.id}" style="flex: 1; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>📍 Maps Intel</span>
          </button>
        </div>

        <button id="btn-add-analyzer-${gem.id}" style="width: 100%; background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 6px;">
          <span>🏛️ Add to Heritage Route Analyzer</span>
        </button>

        <button id="btn-dossier-${gem.id}" style="width: 100%; background: #9333ea; color: #fff; border: none; border-radius: 6px; padding: 6px 0; font-size: 11px; font-weight: 700; cursor: pointer;">
          View Secret Place Dossier
        </button>
      `;
    } else {
      // Station
      const st = item.raw;
      card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <span style="font-size: 16px;">🚆</span>
          <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0284c7;">Railway Station</span>
        </div>
        <h4 style="font-weight: 800; font-size: 14px; margin: 0 0 2px 0; color: #0f172a;">${st.name}</h4>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${st.city} • Code: <span style="font-family: monospace; font-weight: 700; color: #0284c7;">${st.code || 'IR'}</span></div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
          <button id="btn-orig-${st.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer;">
            🚩 Start Route
          </button>
          <button id="btn-dest-${st.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer;">
            🎯 Route Here
          </button>
        </div>

        <div style="display: flex; gap: 4px; margin-bottom: 6px;">
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(st.name + ' ' + (st.city || '') + ' Railway Station')}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-decoration: none; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: 700; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>🗺️ Google Maps</span>
          </a>
          <button id="btn-maps-intel-${st.id}" style="flex: 1; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; border-radius: 6px; padding: 4px 6px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <span>📍 Maps Intel</span>
          </button>
        </div>
      `;
    }

    return card;
  };

  const bindPopupActions = (card: HTMLElement, item: MapPointItem) => {
    const btnDossier = card.querySelector(`#btn-dossier-${item.id}`) as HTMLElement;
    if (btnDossier) {
      btnDossier.onclick = () => onSelectPlace(item.id);
    }

    const btnMaps = card.querySelector(`#btn-maps-intel-${item.id}`) as HTMLElement;
    if (btnMaps) {
      btnMaps.onclick = () => handleOpenMapsIntel(item);
    }

    const btnAddAnalyzer = card.querySelector(`#btn-add-analyzer-${item.id}`) as HTMLElement;
    if (btnAddAnalyzer) {
      btnAddAnalyzer.onclick = () => {
        handleAddMonumentToAnalyzer({
          id: item.id,
          name: item.name,
          city: item.city,
          state: item.state,
          lat: item.lat,
          lng: item.lng,
          summary: item.raw?.summary || item.raw?.whyInteresting || '',
          category: item.raw?.category,
        });
        setIsHeritageAnalyzerOpen(true);
      };
    }

    const btnOrigin = card.querySelector(`#btn-orig-${item.id}`) as HTMLElement;
    if (btnOrigin) {
      btnOrigin.onclick = () => {
        setRouteOrigin(item.id);
        setRouteOriginName(item.name);
        setRouteOriginCoords({ lat: item.lat, lng: item.lng });
        setIsRoutingOpen(true);
        setIsRoutePanelMinimized(false);
      };
    }

    const btnDest = card.querySelector(`#btn-dest-${item.id}`) as HTMLElement;
    if (btnDest) {
      btnDest.onclick = () => {
        setRouteDestination(item.id);
        setRouteDestName(item.name);
        setRouteDestCoords({ lat: item.lat, lng: item.lng });
        setIsRoutingOpen(true);
        setIsRoutePanelMinimized(false);
      };
    }
  };

  // 4. SMART CLUSTERING ENGINE
  // Groups nearby points at current zoom level to avoid crowded pins
  const updateClusters = useCallback(() => {
    const map = mapInstanceRef.current;
    const cLayer = clusterLayerRef.current;
    if (!map || !cLayer) return;

    cLayer.clearLayers();

    // Collect all enabled active points
    const activePoints: MapPointItem[] = [];

    const q = searchQuery.toLowerCase().trim();

    // Heritage
    if (showHeritage) {
      heritageSites.forEach((site) => {
        const coords = extractValidCoordinates(site);
        if (!coords) return;
        if (
          q &&
          !site.name?.toLowerCase().includes(q) &&
          !site.city?.toLowerCase().includes(q) &&
          !site.state?.toLowerCase().includes(q)
        ) {
          return;
        }
        activePoints.push({
          id: site.id,
          name: site.name,
          type: 'heritage',
          lat: coords[0],
          lng: coords[1],
          city: site.city,
          state: site.state,
          raw: site,
        });
      });
    }

    // Hidden Gems
    if (showHiddenGems) {
      hiddenGemsList.forEach((gem) => {
        const coords = parseLatLng(gem.lat, gem.lng);
        if (!coords) return;
        if (
          q &&
          !gem.name.toLowerCase().includes(q) &&
          !gem.city.toLowerCase().includes(q) &&
          !gem.state.toLowerCase().includes(q) &&
          !gem.category.toLowerCase().includes(q) &&
          !gem.whyInteresting.toLowerCase().includes(q)
        ) {
          return;
        }
        activePoints.push({
          id: gem.id,
          name: gem.name,
          type: 'hidden_gem',
          lat: coords[0],
          lng: coords[1],
          city: gem.city,
          state: gem.state,
          raw: gem,
        });
      });
    }

    // Stations (Only if enabled, default OFF)
    if (showStations) {
      stations.forEach((st) => {
        const coords = extractValidCoordinates(st);
        if (!coords) return;
        if (
          q &&
          !st.name?.toLowerCase().includes(q) &&
          !st.code?.toLowerCase().includes(q) &&
          !st.city?.toLowerCase().includes(q)
        ) {
          return;
        }
        activePoints.push({
          id: st.id || st.code,
          name: st.name,
          type: 'station',
          lat: coords[0],
          lng: coords[1],
          city: st.city,
          raw: st,
        });
      });
    }

    const zoom = map.getZoom();
    // In high zoom levels (street/city >= 13), show individual pins without clustering
    const clusterPixelRadius = zoom >= 13 ? 0 : 50;

    interface ClusterGroup {
      id: string;
      centerLat: number;
      centerLng: number;
      screenX: number;
      screenY: number;
      items: MapPointItem[];
    }

    const clusters: ClusterGroup[] = [];

    for (const pt of activePoints) {
      const proj = map.project(L.latLng(pt.lat, pt.lng), zoom);
      let matchedCluster: ClusterGroup | null = null;

      if (clusterPixelRadius > 0) {
        for (const c of clusters) {
          const dx = proj.x - c.screenX;
          const dy = proj.y - c.screenY;
          if (Math.sqrt(dx * dx + dy * dy) <= clusterPixelRadius) {
            matchedCluster = c;
            break;
          }
        }
      }

      if (matchedCluster) {
        matchedCluster.items.push(pt);
        const count = matchedCluster.items.length;
        matchedCluster.centerLat = (matchedCluster.centerLat * (count - 1) + pt.lat) / count;
        matchedCluster.centerLng = (matchedCluster.centerLng * (count - 1) + pt.lng) / count;
        const newProj = map.project(L.latLng(matchedCluster.centerLat, matchedCluster.centerLng), zoom);
        matchedCluster.screenX = newProj.x;
        matchedCluster.screenY = newProj.y;
      } else {
        clusters.push({
          id: `cluster-${pt.id}`,
          centerLat: pt.lat,
          centerLng: pt.lng,
          screenX: proj.x,
          screenY: proj.y,
          items: [pt],
        });
      }
    }

    // Render clusters & single markers onto clusterLayer
    clusters.forEach((cluster) => {
      if (cluster.items.length > 1) {
        // MULTIPLE ITEMS: RENDER CLUSTER BADGE
        const count = cluster.items.length;
        const heritageCount = cluster.items.filter((i) => i.type === 'heritage').length;
        const gemCount = cluster.items.filter((i) => i.type === 'hidden_gem').length;
        const stationCount = cluster.items.filter((i) => i.type === 'station').length;

        // Gradient styling depending on cluster composition
        let bgStyle = 'background: linear-gradient(135deg, #ea580c, #c2410c);';
        if (heritageCount > 0 && gemCount > 0) {
          bgStyle = 'background: linear-gradient(135deg, #ea580c, #9333ea);';
        } else if (gemCount > 0 && heritageCount === 0) {
          bgStyle = 'background: linear-gradient(135deg, #9333ea, #7e22ce);';
        } else if (stationCount > 0 && heritageCount === 0 && gemCount === 0) {
          bgStyle = 'background: linear-gradient(135deg, #0284c7, #0369a1);';
        }

        const size = Math.min(Math.max(34 + Math.log2(count) * 4, 34), 48);

        const clusterHtml = `
          <div class="virasat-cluster-marker cursor-pointer" style="width: ${size}px; height: ${size}px; border-radius: 50%; ${bgStyle} display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.25); color: #ffffff; font-weight: 800; font-size: 13px; transition: transform 0.2s;">
            <span>${count}</span>
          </div>
        `;

        const clusterIcon = L.divIcon({
          className: 'cluster-icon',
          html: clusterHtml,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([cluster.centerLat, cluster.centerLng], { icon: clusterIcon });

        const tooltipBreakdown = [
          heritageCount > 0 ? `🏛️ ${heritageCount} Heritage` : '',
          gemCount > 0 ? `💎 ${gemCount} Hidden Gems` : '',
          stationCount > 0 ? `🚆 ${stationCount} Stations` : '',
        ]
          .filter(Boolean)
          .join(' • ');

        marker.bindTooltip(
          `<div style="font-family:sans-serif; text-align:center;"><b>${count} Places</b><br/><span style="font-size:11px; color:#475569;">${tooltipBreakdown}</span><br/><span style="font-size:10px; color:#ea580c;">Click to zoom in</span></div>`,
          { direction: 'top', offset: [0, -size / 2] }
        );

        marker.on('click', () => {
          const latLngs = cluster.items.map((i) => L.latLng(i.lat, i.lng));
          if (latLngs.length > 1) {
            const bounds = L.latLngBounds(latLngs);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
          } else {
            map.flyTo([cluster.centerLat, cluster.centerLng], Math.min(map.getZoom() + 2, 14), { duration: 0.6 });
          }
        });

        cLayer.addLayer(marker);
      } else {
        // SINGLE ITEM: RENDER RICH INDIVIDUAL PIN
        const item = cluster.items[0];

        let iconHtml = '';
        if (item.type === 'heritage') {
          iconHtml = `
            <div class="heritage-pin" style="background-color: #ea580c; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.45); cursor: pointer; transition: transform 0.2s;" title="${item.name}">
              <span style="font-size: 15px;">🏛️</span>
            </div>
          `;
        } else if (item.type === 'hidden_gem') {
          iconHtml = `
            <div class="gem-pin" style="background: linear-gradient(135deg, #9333ea, #ec4899); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.55); cursor: pointer; transition: transform 0.2s;" title="💎 ${item.name}">
              <span style="font-size: 15px;">💎</span>
            </div>
          `;
        } else {
          iconHtml = `
            <div class="station-pin" style="background-color: #0284c7; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 3px 10px rgba(2, 132, 199, 0.4); cursor: pointer;" title="🚆 ${item.name}">
              <span style="font-size: 13px;">🚆</span>
            </div>
          `;
        }

        const markerIcon = L.divIcon({
          className: `${item.type}-marker`,
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([item.lat, item.lng], { icon: markerIcon });
        const popupContent = createSinglePopupContent(item);
        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          bindPopupActions(popupContent, item);
        });

        cLayer.addLayer(marker);
      }
    });
  }, [heritageSites, hiddenGemsList, stations, showHeritage, showHiddenGems, showStations, searchQuery, onView3DPlace]);

  // Hook map zoom/move events to clustering
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    updateClusters();

    map.on('zoomend', updateClusters);
    map.on('moveend', updateClusters);

    return () => {
      map.off('zoomend', updateClusters);
      map.off('moveend', updateClusters);
    };
  }, [updateClusters]);

  // 5. Locate Me Handler
  const handleUseMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const lat = Number(latitude.toFixed(5));
        const lng = Number(longitude.toFixed(5));

        const { city: nearestCity } = findNearestCity(lat, lng);

        let nearestHeritage: any = heritageSites[0];
        let minHDist = Infinity;
        for (const h of heritageSites) {
          const coords = extractValidCoordinates(h);
          if (coords) {
            const d = calculateHaversineKm(lat, lng, coords[0], coords[1]);
            if (d < minHDist) {
              minHDist = d;
              nearestHeritage = h;
            }
          }
        }

        setUserLocation({
          lat,
          lng,
          accuracy: Math.round(accuracy),
          nearestCity: nearestCity?.name,
          nearestHeritage: nearestHeritage?.name,
        });

        setRouteOrigin('CURRENT_LOCATION');
        setRouteOriginName(`Our Location (${nearestCity ? nearestCity.name : `${lat.toFixed(2)}, ${lng.toFixed(2)}`})`);
        setRouteOriginCoords({ lat, lng });

        const map = mapInstanceRef.current;
        if (map) {
          if (userLocationMarkerRef.current) userLocationMarkerRef.current.remove();
          if (userAccuracyCircleRef.current) userAccuracyCircleRef.current.remove();

          userAccuracyCircleRef.current = L.circle([lat, lng], {
            radius: Math.max(accuracy, 60),
            color: '#0284c7',
            fillColor: '#38bdf8',
            fillOpacity: 0.15,
            weight: 1.5,
          }).addTo(map);

          const userIcon = L.divIcon({
            className: 'user-pin',
            html: `
              <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:rgba(2, 132, 199, 0.4); animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
                <div style="width:20px; height:20px; border-radius:50%; background:#0284c7; border:3px solid white; box-shadow:0 0 12px rgba(2, 132, 199, 0.95); display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold;">📍</div>
              </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
          });

          userLocationMarkerRef.current = L.marker([lat, lng], { icon: userIcon }).addTo(map);
          map.flyTo([lat, lng], 13, { duration: 1.2 });
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationError('Unable to detect GPS position. Please enter origin manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 6. Real Multimodal Route Calculation
  const handleCalculateRoute = async (
    customOrigin?: { id: string; name: string; lat?: number; lng?: number },
    customDest?: { id: string; name: string; lat?: number; lng?: number },
    customMode?: MapTransportMode
  ) => {
    const originId = customOrigin ? customOrigin.id : routeOrigin;
    const destId = customDest ? customDest.id : routeDestination;
    const originName = customOrigin ? customOrigin.name : routeOriginName;
    const destName = customDest ? customDest.name : routeDestName;
    const origLat = customOrigin?.lat !== undefined ? customOrigin.lat : routeOriginCoords?.lat;
    const origLng = customOrigin?.lng !== undefined ? customOrigin.lng : routeOriginCoords?.lng;
    const destLat = customDest?.lat !== undefined ? customDest.lat : routeDestCoords?.lat;
    const destLng = customDest?.lng !== undefined ? customDest.lng : routeDestCoords?.lng;
    const mode = customMode || selectedMode;

    if (customOrigin) {
      setRouteOrigin(customOrigin.id);
      setRouteOriginName(customOrigin.name);
      if (customOrigin.lat !== undefined && customOrigin.lng !== undefined) {
        setRouteOriginCoords({ lat: customOrigin.lat, lng: customOrigin.lng });
      }
    }
    if (customDest) {
      setRouteDestination(customDest.id);
      setRouteDestName(customDest.name);
      if (customDest.lat !== undefined && customDest.lng !== undefined) {
        setRouteDestCoords({ lat: customDest.lat, lng: customDest.lng });
      }
    }
    if (customMode) {
      setSelectedMode(customMode);
    }

    if (!originId || !destId) {
      setRouteError('Please choose both an origin and a destination.');
      return;
    }
    if (originId.toLowerCase() === destId.toLowerCase()) {
      setRouteError('Origin and destination cannot be identical.');
      return;
    }

    setIsRoutingOpen(true);
    setIsRoutePanelMinimized(false);
    setIsCalculatingRoute(true);
    setRouteError(null);

    // FLIGHT MODE
    if (mode === 'FLIGHT') {
      try {
        const map = mapInstanceRef.current;
        if (!map) return;

        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
          routePolylineRef.current = null;
        }
        if (routeMarkersRef.current) {
          routeMarkersRef.current.clearLayers();
        }

        let origAirport: IndianAirport | null = null;
        if (origLat !== undefined && origLng !== undefined) {
          origAirport = findNearestAirport(origLat, origLng).airport;
        } else {
          const match = searchAirports(originName || originId);
          if (match.length > 0) origAirport = match[0];
        }

        let destAirport: IndianAirport | null = null;
        if (destLat !== undefined && destLng !== undefined) {
          destAirport = findNearestAirport(destLat, destLng).airport;
        } else {
          const match = searchAirports(destName || destId);
          if (match.length > 0) destAirport = match[0];
        }

        if (!origAirport || !destAirport) {
          setRouteError('Could not resolve Indian commercial airports for selected points.');
          setIsCalculatingRoute(false);
          return;
        }

        const polyCoords = generateFlightArc([origAirport.lat, origAirport.lng], [destAirport.lat, destAirport.lng], 60);
        const routeGroup = L.layerGroup();

        L.polyline(polyCoords, {
          color: '#38bdf8',
          weight: 6,
          opacity: 0.4,
          lineCap: 'round',
        }).addTo(routeGroup);

        L.polyline(polyCoords, {
          color: '#0284c7',
          weight: 3.5,
          opacity: 0.95,
          dashArray: '8, 8',
          lineCap: 'round',
        }).addTo(routeGroup);

        routeGroup.addTo(map);
        routePolylineRef.current = routeGroup;

        const origIcon = L.divIcon({
          className: 'flight-orig-pin',
          html: `<div style="background:#0284c7; color:white; padding:3px 7px; border-radius:10px; font-weight:800; font-size:11px; border:2px solid white; box-shadow:0 3px 10px rgba(2,132,199,0.4);">🛫 ${origAirport.iata}</div>`,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const destIcon = L.divIcon({
          className: 'flight-dest-pin',
          html: `<div style="background:#0369a1; color:white; padding:3px 7px; border-radius:10px; font-weight:800; font-size:11px; border:2px solid white; box-shadow:0 3px 10px rgba(3,105,161,0.4);">🛬 ${destAirport.iata}</div>`,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        if (routeMarkersRef.current) {
          L.marker([origAirport.lat, origAirport.lng], { icon: origIcon })
            .bindTooltip(`Airport: ${origAirport.name} (${origAirport.iata})`, { direction: 'top' })
            .addTo(routeMarkersRef.current);

          L.marker([destAirport.lat, destAirport.lng], { icon: destIcon })
            .bindTooltip(`Airport: ${destAirport.name} (${destAirport.iata})`, { direction: 'top' })
            .addTo(routeMarkersRef.current);
        }

        const distKm = haversineDistanceKm(origAirport.lat, origAirport.lng, destAirport.lat, destAirport.lng);
        const estMins = Math.round((distKm / 750) * 60 + 35);

        setActiveRoute({
          origin: {
            id: `airport-${origAirport.iata.toLowerCase()}`,
            name: `${origAirport.name} (${origAirport.iata})`,
            latitude: origAirport.lat,
            longitude: origAirport.lng,
          },
          destination: {
            id: `airport-${destAirport.iata.toLowerCase()}`,
            name: `${destAirport.name} (${destAirport.iata})`,
            latitude: destAirport.lat,
            longitude: destAirport.lng,
          },
          options: [
            {
              mode: 'FLIGHT' as any,
              distance_km: distKm,
              duration_minutes: estMins,
              duration_formatted: `${Math.floor(estMins / 60)}h ${estMins % 60}m direct flight`,
              fare: 0,
              polyline: polyCoords,
              steps_summary: [
                `Board flight at ${origAirport.name} (${origAirport.iata}), ${origAirport.city}`,
                `Direct flight corridor (${distKm} km geodesic distance)`,
                `Arrive at ${destAirport.name} (${destAirport.iata}), ${destAirport.city}`,
              ],
            } as any,
          ],
        });

        try {
          const boundsPoly = L.polyline(polyCoords);
          map.fitBounds(boundsPoly.getBounds(), { padding: [60, 60], maxZoom: 11 });
        } catch {}
      } catch (fErr) {
        setRouteError('Unable to generate flight corridor.');
      } finally {
        setIsCalculatingRoute(false);
      }
      return;
    }

    // GROUND / TRANSIT / WALK MODES
    try {
      const res = await api.getRoutes({
        origin: originId,
        destination: destId,
        mode: mode as TransportMode,
        city: selectedCity,
        orig_lat: origLat,
        orig_lng: origLng,
        dest_lat: destLat,
        dest_lng: destLng,
      });

      setActiveRoute(res);

      if (res.origin?.name) setRouteOriginName(res.origin.name);
      if (res.destination?.name) setRouteDestName(res.destination.name);
      if (res.origin?.latitude && res.origin?.longitude) {
        setRouteOriginCoords({ lat: res.origin.latitude, lng: res.origin.longitude });
      }
      if (res.destination?.latitude && res.destination?.longitude) {
        setRouteDestCoords({ lat: res.destination.latitude, lng: res.destination.longitude });
      }

      const map = mapInstanceRef.current;
      if (!map) return;

      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
      if (routeMarkersRef.current) {
        routeMarkersRef.current.clearLayers();
      }

      const opt: any = res.options?.find((o: any) => o.mode === mode) || res.options?.[0];

      let polyCoords: [number, number][] = [];
      if (opt && opt.polyline && Array.isArray(opt.polyline) && opt.polyline.length > 0) {
        polyCoords = opt.polyline
          .map((pt: any) => (Array.isArray(pt) ? parseLatLng(pt[0], pt[1]) : parseLatLng(pt?.lat, pt?.lng)))
          .filter((pt: [number, number] | null): pt is [number, number] => pt !== null);
      } else if (res.origin?.latitude && res.destination?.latitude) {
        const p1 = parseLatLng(res.origin.latitude, res.origin.longitude);
        const p2 = parseLatLng(res.destination.latitude, res.destination.longitude);
        if (p1 && p2) polyCoords = [p1, p2];
      }

      if (polyCoords.length > 0) {
        const routeGroup = L.layerGroup();

        if (mode === 'TRANSIT') {
          L.polyline(polyCoords, { color: '#0f172a', weight: 6, opacity: 0.95, lineJoin: 'round' }).addTo(routeGroup);
          L.polyline(polyCoords, { color: '#fbbf24', weight: 3, opacity: 1, dashArray: '6, 6', lineJoin: 'round' }).addTo(routeGroup);
        } else if (mode === 'DRIVE') {
          L.polyline(polyCoords, { color: '#1e3a8a', weight: 6, opacity: 0.85, lineJoin: 'round' }).addTo(routeGroup);
          L.polyline(polyCoords, { color: '#2563eb', weight: 4, opacity: 1, lineJoin: 'round' }).addTo(routeGroup);
        } else {
          // Walk
          L.polyline(polyCoords, { color: '#059669', weight: 4, opacity: 0.9, lineJoin: 'round', dashArray: '5, 6' }).addTo(routeGroup);
        }

        routeGroup.addTo(map);
        routePolylineRef.current = routeGroup;

        // Start (A) & Destination (B) route markers
        const startIcon = L.divIcon({
          className: 'route-start-pin',
          html: `<div style="background:#10b981; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; border:2px solid white; box-shadow:0 3px 10px rgba(0,0,0,0.3);">A</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const endIcon = L.divIcon({
          className: 'route-end-pin',
          html: `<div style="background:#ea580c; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; border:2px solid white; box-shadow:0 3px 10px rgba(0,0,0,0.3);">B</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const startPt = polyCoords[0];
        const endPt = polyCoords[polyCoords.length - 1];
        if (routeMarkersRef.current && startPt && endPt) {
          L.marker(startPt, { icon: startIcon }).bindTooltip(`A: ${res.origin?.name || originName}`, { direction: 'top' }).addTo(routeMarkersRef.current);
          L.marker(endPt, { icon: endIcon }).bindTooltip(`B: ${res.destination?.name || destName}`, { direction: 'top' }).addTo(routeMarkersRef.current);
        }

        try {
          const boundsPoly = L.polyline(polyCoords);
          map.fitBounds(boundsPoly.getBounds(), { padding: [55, 55], maxZoom: 15 });
        } catch {}
      }
    } catch (err) {
      setRouteError('Unable to generate route coordinates. Please try alternate points.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Category visual metadata helper
  const getCategoryDetails = (item: LocationSuggestion) => {
    const cat = item.categoryType || item.type || 'place';
    switch (cat) {
      case 'state':
        return { icon: '🗺️', color: '#4f46e5', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'city':
        return { icon: '🏙️', color: '#6366f1', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'heritage':
        return { icon: '🏛️', color: '#d97706', badgeBg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'hidden_gem':
        return { icon: '💎', color: '#9333ea', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'station':
        return { icon: '🚆', color: '#0284c7', badgeBg: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'airport':
        return { icon: '✈️', color: '#0ea5e9', badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200' };
      case 'hotel':
        return { icon: '🏨', color: '#059669', badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'market':
        return { icon: '🛍️', color: '#e11d48', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'festival':
        return { icon: '🪔', color: '#ea580c', badgeBg: 'bg-orange-50 text-orange-800 border-orange-200' };
      default:
        return { icon: '📍', color: '#10b981', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  // 7. Unified Global Map Autocomplete Search (debounced 220ms)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchSuggestions([]);
      setIsSearchDropdownOpen(false);
      setIsSearching(false);
      setSearchHighlightedIndex(-1);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await api.suggestLocations(trimmed, 12);
        setSearchSuggestions(results);
        setIsSearchDropdownOpen(true);
        setSearchHighlightedIndex(-1);
      } catch (err) {
        console.error('Failed to load global map suggestions:', err);
        setSearchSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const dualQuery = useMemo(() => parseDualPointsQuery(searchQuery), [searchQuery]);

  const handleSelectSearchItem = (item: LocationSuggestion) => {
    setIsSearchDropdownOpen(false);
    setSearchQuery(item.name);
    setSearchHighlightedIndex(-1);

    const coords = parseLatLng(item.lat, item.lng);
    if (!coords) return;

    const map = mapInstanceRef.current;
    if (!map) return;

    let targetZoom = 13;
    if (item.categoryType === 'state') targetZoom = 7;
    else if (item.categoryType === 'city') targetZoom = 12;
    else if (item.categoryType === 'station' || item.categoryType === 'airport') targetZoom = 14;
    else targetZoom = 15;

    map.flyTo(coords, targetZoom, { duration: 1.2 });

    if (item.categoryType === 'city' && onSelectCity) {
      onSelectCity(item.name);
    }

    if (searchHighlightRef.current) {
      searchHighlightRef.current.clearLayers();

      const details = getCategoryDetails(item);
      const iconHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: ${details.color}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="background-color: ${details.color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35); font-size: 18px; z-index: 2;">
            ${details.icon}
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        className: 'search-focus-pin',
        html: iconHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });

      const marker = L.marker(coords, { icon: markerIcon });
      const cleanId = item.id.replace(/^(heritage|gem|station|airport|city|state|place|hotel|festival|market)-/, '');

      const popupContent = `
        <div style="padding: 10px; min-width: 230px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="font-size: 15px;">${details.icon}</span>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${details.color};">
                ${item.badge || item.categoryType}
              </span>
            </div>
            ${item.city ? `<span style="font-size: 10px; color: #64748b; font-weight: 600;">📍 ${item.city}</span>` : ''}
          </div>
          <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">${item.name}</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 10px 0; line-height: 1.4;">${item.subtitle || `${item.city || ''}, ${item.state || ''}`}</p>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button id="btn-search-orig-${item.id}" style="flex: 1; min-width: 95px; background: #0284c7; color: #fff; border: none; border-radius: 8px; padding: 7px 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
              🚩 Set Origin (A)
            </button>
            <button id="btn-search-dest-${item.id}" style="flex: 1; min-width: 95px; background: #ea580c; color: #fff; border: none; border-radius: 8px; padding: 7px 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
              🎯 Set Dest (B)
            </button>
          </div>
          ${cleanId ? `
            <button id="btn-search-view-${item.id}" style="width: 100%; margin-top: 6px; background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 0; font-size: 11px; font-weight: 700; cursor: pointer;">
              🏛️ Explore Details
            </button>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();

      marker.on('popupopen', () => {
        const btnOrig = document.getElementById(`btn-search-orig-${item.id}`);
        if (btnOrig) {
          btnOrig.onclick = () => {
            setRouteOrigin(item.id);
            setRouteOriginName(item.name);
            setRouteOriginCoords({ lat: coords[0], lng: coords[1] });
            setIsRoutingOpen(true);
            setIsRoutePanelMinimized(false);
          };
        }

        const btnDst = document.getElementById(`btn-search-dest-${item.id}`);
        if (btnDst) {
          btnDst.onclick = () => {
            setRouteDestination(item.id);
            setRouteDestName(item.name);
            setRouteDestCoords({ lat: coords[0], lng: coords[1] });
            setIsRoutingOpen(true);
            setIsRoutePanelMinimized(false);
          };
        }

        const btnView = document.getElementById(`btn-search-view-${item.id}`);
        if (btnView && onSelectPlace) {
          btnView.onclick = () => {
            onSelectPlace(cleanId);
          };
        }
      });

      searchHighlightRef.current.addLayer(marker);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsSearchDropdownOpen(true);
      setSearchHighlightedIndex((prev) => (prev < searchSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchHighlightedIndex >= 0 && searchHighlightedIndex < searchSuggestions.length) {
        handleSelectSearchItem(searchSuggestions[searchHighlightedIndex]);
      } else if (searchSuggestions.length > 0) {
        handleSelectSearchItem(searchSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchDropdownOpen(false);
      setSearchHighlightedIndex(-1);
    }
  };

  // 8. Route Studio Origin Autocomplete (debounced 220ms)
  useEffect(() => {
    const trimmed = routeOriginName.trim();
    if (!trimmed || trimmed.length < 2 || routeOrigin === 'CURRENT_LOCATION') {
      setOriginSuggestions([]);
      setIsOriginSearching(false);
      setOriginHighlightedIndex(-1);
      return;
    }

    setIsOriginSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await api.suggestLocations(trimmed, 10);
        let combined = results;
        if (selectedMode === 'FLIGHT') {
          const airportMatches: LocationSuggestion[] = searchAirports(trimmed).slice(0, 4).map((ap) => ({
            id: `airport-${ap.iata.toLowerCase()}`,
            name: `${ap.name} (${ap.iata})`,
            subtitle: `${ap.city}, ${ap.state} • Airport Hub`,
            type: 'airport' as const,
            categoryType: 'airport' as const,
            badge: 'Airport',
            code: ap.iata,
            city: ap.city,
            state: ap.state,
            lat: ap.lat,
            lng: ap.lng,
          }));
          combined = [...airportMatches, ...results.filter((r) => !airportMatches.some((a) => a.code === r.code))];
        }
        setOriginSuggestions(combined);
        setOriginHighlightedIndex(-1);
      } catch {
        setOriginSuggestions([]);
      } finally {
        setIsOriginSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [routeOriginName, selectedMode, routeOrigin]);

  // 9. Route Studio Destination Autocomplete (debounced 220ms)
  useEffect(() => {
    const trimmed = routeDestName.trim();
    if (!trimmed || trimmed.length < 2) {
      setDestSuggestions([]);
      setIsDestSearching(false);
      setDestHighlightedIndex(-1);
      return;
    }

    setIsDestSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await api.suggestLocations(trimmed, 10);
        let combined = results;
        if (selectedMode === 'FLIGHT') {
          const airportMatches: LocationSuggestion[] = searchAirports(trimmed).slice(0, 4).map((ap) => ({
            id: `airport-${ap.iata.toLowerCase()}`,
            name: `${ap.name} (${ap.iata})`,
            subtitle: `${ap.city}, ${ap.state} • Airport Hub`,
            type: 'airport' as const,
            categoryType: 'airport' as const,
            badge: 'Airport',
            code: ap.iata,
            city: ap.city,
            state: ap.state,
            lat: ap.lat,
            lng: ap.lng,
          }));
          combined = [...airportMatches, ...results.filter((r) => !airportMatches.some((a) => a.code === r.code))];
        }
        setDestSuggestions(combined);
        setDestHighlightedIndex(-1);
      } catch {
        setDestSuggestions([]);
      } finally {
        setIsDestSearching(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [routeDestName, selectedMode]);

  const handleSelectOriginSuggestion = (item: LocationSuggestion) => {
    setRouteOrigin(item.id);
    setRouteOriginName(item.name);
    setRouteOriginCoords({ lat: item.lat, lng: item.lng });
    setIsOriginSuggestOpen(false);
    setOriginHighlightedIndex(-1);
    setRouteError(null);
  };

  const handleSelectDestSuggestion = (item: LocationSuggestion) => {
    setRouteDestination(item.id);
    setRouteDestName(item.name);
    setRouteDestCoords({ lat: item.lat, lng: item.lng });
    setIsDestSuggestOpen(false);
    setDestHighlightedIndex(-1);
    setRouteError(null);
  };

  const handleOriginKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOriginSuggestOpen(true);
      setOriginHighlightedIndex((prev) => (prev < originSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOriginHighlightedIndex((prev) => (prev > 0 ? prev - 1 : originSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (originHighlightedIndex >= 0 && originHighlightedIndex < originSuggestions.length) {
        handleSelectOriginSuggestion(originSuggestions[originHighlightedIndex]);
      } else if (originSuggestions.length > 0) {
        handleSelectOriginSuggestion(originSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOriginSuggestOpen(false);
      setOriginHighlightedIndex(-1);
    }
  };

  const handleDestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsDestSuggestOpen(true);
      setDestHighlightedIndex((prev) => (prev < destSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDestHighlightedIndex((prev) => (prev > 0 ? prev - 1 : destSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (destHighlightedIndex >= 0 && destHighlightedIndex < destSuggestions.length) {
        handleSelectDestSuggestion(destSuggestions[destHighlightedIndex]);
      } else if (destSuggestions.length > 0) {
        handleSelectDestSuggestion(destSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsDestSuggestOpen(false);
      setDestHighlightedIndex(-1);
    }
  };

  const handleSwapEndpoints = () => {
    const tempId = routeOrigin;
    const tempName = routeOriginName;
    const tempCoords = routeOriginCoords;

    setRouteOrigin(routeDestination);
    setRouteOriginName(routeDestName);
    setRouteOriginCoords(routeDestCoords);

    setRouteDestination(tempId);
    setRouteDestName(tempName);
    setRouteDestCoords(tempCoords);

    if (activeRoute && routeDestination && tempId) {
      handleCalculateRoute(
        { id: routeDestination, name: routeDestName, lat: routeDestCoords?.lat, lng: routeDestCoords?.lng },
        { id: tempId, name: tempName, lat: tempCoords?.lat, lng: tempCoords?.lng }
      );
    }
  };

  const isRouteValid = Boolean(
    (routeOrigin || routeOriginCoords) &&
    (routeDestination || routeDestCoords) &&
    (routeOrigin.trim().toLowerCase() !== routeDestination.trim().toLowerCase())
  );

  const handleClearRoute = () => {
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (routeMarkersRef.current) {
      routeMarkersRef.current.clearLayers();
    }
    setActiveRoute(null);
    setRouteError(null);
  };

  const handleAddMonumentToAnalyzer = (monument: SelectedMonumentItem) => {
    setSelectedHeritageMonuments((prev) => {
      if (prev.some((m) => m.id === monument.id || m.name.toLowerCase() === monument.name.toLowerCase())) {
        return prev;
      }
      return [...prev, monument];
    });
  };

  const handleRemoveMonumentFromAnalyzer = (monumentId: string) => {
    setSelectedHeritageMonuments((prev) => prev.filter((m) => m.id !== monumentId));
  };

  const handleReorderMonumentsInAnalyzer = (newOrder: SelectedMonumentItem[]) => {
    setSelectedHeritageMonuments(newOrder);
  };

  const handleClearMonumentsInAnalyzer = () => {
    setSelectedHeritageMonuments([]);
  };

  const handleClearHeritageRoute = () => {
    if (heritageRouteGroupRef.current) {
      heritageRouteGroupRef.current.clearLayers();
    }
    segmentPolylinesRef.current = {};
    setActiveHeritageResult(null);
  };

  const handleApplyHeritageRouteToMap = (result: HeritageRouteAnalysisResult) => {
    if (!mapInstanceRef.current || !result.ordered_stops || result.ordered_stops.length === 0) return;

    setActiveHeritageResult(result);

    // Clear previous heritage route layers
    if (heritageRouteGroupRef.current) {
      heritageRouteGroupRef.current.clearLayers();
    } else {
      heritageRouteGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    // Also clear point-to-point route studio to avoid clutter
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (routeMarkersRef.current) {
      routeMarkersRef.current.clearLayers();
    }

    const segmentPolylines: Record<number, L.Polyline> = {};
    const latLngs: L.LatLngExpression[] = [];

    const segmentColors = ['#ea580c', '#9333ea', '#059669', '#0284c7', '#d97706', '#db2777', '#10b981'];

    // 1. Draw Numbered Stop Markers
    result.ordered_stops.forEach((stop) => {
      if (!stop.lat || !stop.lng) return;
      const pos: [number, number] = [stop.lat, stop.lng];
      latLngs.push(pos);

      const stopIcon = L.divIcon({
        className: 'heritage-route-stop-icon',
        html: `
          <div style="background: linear-gradient(135deg, #ea580c, #c2410c); width: 34px; height: 34px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(234, 88, 12, 0.7); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 13px; cursor: pointer; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">
            ${stop.stop_order}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker(pos, { icon: stopIcon }).addTo(heritageRouteGroupRef.current!);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; max-width: 250px;">
          <div style="font-size: 10px; font-weight: 800; color: #ea580c; text-transform: uppercase;">Stop ${stop.stop_order}</div>
          <h4 style="font-size: 13px; font-weight: 800; margin: 2px 0 4px 0; color: #0f172a;">${stop.name}</h4>
          <div style="font-size: 11px; color: #b45309; font-weight: 700; margin-bottom: 4px;">🏛️ ${stop.historical_era}</div>
          <div style="font-size: 11px; color: #475569; line-height: 1.35; margin-bottom: 6px;">${stop.key_highlight}</div>
          ${stop.visit_duration_minutes ? `<div style="font-size: 10px; color: #64748b; font-weight: 600;">⏱️ Recommended Visit: ~${stop.visit_duration_minutes} min</div>` : ''}
          <div style="display: flex; gap: 4px; margin-top: 6px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.name)}" target="_blank" rel="noopener noreferrer" style="flex: 1; text-align: center; background: #2563eb; color: #ffffff; font-size: 10px; font-weight: 700; padding: 5px; border-radius: 6px; text-decoration: none;">
              Google Maps ↗
            </a>
          </div>
        </div>
      `);
    });

    // 2. Draw Interactive Segment Polylines
    result.segments.forEach((seg, idx) => {
      const fromStop = result.ordered_stops.find((s) => s.id === seg.from_stop_id) || result.ordered_stops[idx];
      const toStop = result.ordered_stops.find((s) => s.id === seg.to_stop_id) || result.ordered_stops[idx + 1];

      if (!fromStop || !toStop || !fromStop.lat || !toStop.lat) return;

      const segPoints: [number, number][] = [
        [fromStop.lat, fromStop.lng],
        [toStop.lat, toStop.lng],
      ];

      const segColor = segmentColors[idx % segmentColors.length];

      const polyline = L.polyline(segPoints, {
        color: segColor,
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '8, 8',
      }).addTo(heritageRouteGroupRef.current!);

      segmentPolylines[idx] = polyline;

      polyline.bindPopup(`
        <div style="max-width: 290px; font-family: sans-serif; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; color: ${segColor}; text-transform: uppercase;">
              Transit Segment ${seg.segment_index}
            </span>
            <span style="font-size: 10px; font-weight: 700; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #334155;">
              ${seg.recommended_mode}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 800; margin: 0 0 6px 0; color: #0f172a;">
            ${seg.from_name} ➔ ${seg.to_name}
          </h4>
          <div style="display: flex; gap: 6px; margin-bottom: 8px; font-size: 11px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px;">
            <div style="flex: 1;">
              <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Duration</div>
              <div style="font-weight: 800; color: #0f172a;">${seg.travel_time_minutes} mins</div>
            </div>
            <div style="flex: 1; border-left: 1px solid #e2e8f0; padding-left: 6px;">
              <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Distance</div>
              <div style="font-weight: 800; color: #0f172a;">${seg.distance_km} km</div>
            </div>
          </div>

          <div style="margin-bottom: 8px;">
            <div style="font-size: 10px; font-weight: 800; color: #78350f; text-transform: uppercase; margin-bottom: 2px;">
              📜 Historical Significance
            </div>
            <div style="font-size: 11px; color: #334155; line-height: 1.4; background: #fffbeb; padding: 6px 8px; border-radius: 6px; border: 1px solid #fef3c7;">
              ${seg.historical_significance}
            </div>
          </div>

          ${seg.architectural_transition ? `
            <div style="font-size: 10px; color: #64748b; margin-bottom: 8px;">
              <b>Architecture:</b> ${seg.architectural_transition}
            </div>
          ` : ''}

          <a href="https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(seg.from_name)}&destination=${encodeURIComponent(seg.to_name)}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #2563eb; color: #ffffff; font-size: 10px; font-weight: 700; padding: 6px; border-radius: 6px; text-decoration: none;">
            Open Segment Directions in Google Maps ↗
          </a>
        </div>
      `);

      polyline.on('mouseover', () => {
        polyline.setStyle({ weight: 8, opacity: 1 });
      });
      polyline.on('mouseout', () => {
        polyline.setStyle({ weight: 5, opacity: 0.9 });
      });
    });

    segmentPolylinesRef.current = segmentPolylines;

    if (latLngs.length >= 2) {
      const bounds = L.latLngBounds(latLngs);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  };

  const handleHighlightSegmentOnMap = (segmentIndex: number) => {
    if (!mapInstanceRef.current || !segmentPolylinesRef.current[segmentIndex]) return;
    const poly = segmentPolylinesRef.current[segmentIndex];
    const bounds = poly.getBounds();
    mapInstanceRef.current.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
    poly.openPopup();
  };

  const handleCityJump = (cityKey: string) => {
    const key = cityKey.toLowerCase().replace(/\s+/g, '-');
    const cfg = cityCoordinates[key] || cityCoordinates['all-india'];
    if (cfg && mapInstanceRef.current) {
      const safeCenter = parseLatLng(cfg.lat, cfg.lng) || [22.5, 79.0];
      const safeZoom = typeof cfg.zoom === 'number' ? cfg.zoom : 5;
      mapInstanceRef.current.flyTo(safeCenter, safeZoom, { duration: 1 });
    }
    if (onSelectCity) {
      onSelectCity(key === 'all-india' ? 'All India' : cityKey.charAt(0).toUpperCase() + cityKey.slice(1));
    }
  };

  const activeOption: any =
    activeRoute?.options?.find((o: any) => o.mode === selectedMode) || activeRoute?.options?.[0];

  return (
    <div className="space-y-3 font-sans">
      {/* Clean, Minimal Map Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
        {/* Rapid Regional Jumps */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Jump:
          </span>
          {[
            { id: 'all-india', label: 'All India' },
            { id: 'delhi', label: 'Delhi' },
            { id: 'mumbai', label: 'Mumbai' },
            { id: 'jaipur', label: 'Jaipur' },
            { id: 'varanasi', label: 'Varanasi' },
            { id: 'kochi', label: 'Kochi' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => handleCityJump(c.id)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Minimal Filters & Controls: Heritage, Hidden Gems, Stations (default off), Locate Me, Route Studio */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Heritage Toggle */}
          <button
            onClick={() => setShowHeritage(!showHeritage)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              showHeritage
                ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <span>🏛️ Heritage ({heritageSites.length})</span>
          </button>

          {/* Hidden Gems Toggle */}
          <button
            onClick={() => setShowHiddenGems(!showHiddenGems)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              showHiddenGems
                ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <span>💎 Hidden Gems ({hiddenGemsList.length})</span>
          </button>

          {/* Stations (Default HIDE, optional) */}
          <button
            onClick={() => setShowStations(!showStations)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showStations
                ? 'bg-sky-600 text-white border-sky-700'
                : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
            }`}
            title="Toggle railway transit hubs"
          >
            <span>🚆 Stations {showStations ? 'On' : 'Off'}</span>
          </button>

          <div className="h-4 w-px bg-stone-200 mx-0.5 hidden sm:block" />

          {/* Locate Me */}
          <button
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              userLocation
                ? 'bg-sky-700 text-white border-sky-800'
                : 'bg-white text-sky-800 border-sky-200 hover:bg-sky-50'
            }`}
            title="Locate my position on map"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
          </button>

          {/* Route Studio */}
          <button
            onClick={() => {
              setIsRoutingOpen(!isRoutingOpen);
              if (!isRoutingOpen) {
                setIsHeritageAnalyzerOpen(false);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              isRoutingOpen
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route Studio</span>
          </button>

          {/* Heritage Route Analyzer (Gemini AI Powered) */}
          <button
            onClick={() => {
              setIsHeritageAnalyzerOpen(!isHeritageAnalyzerOpen);
              if (!isHeritageAnalyzerOpen) {
                setIsRoutingOpen(false);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              isHeritageAnalyzerOpen
                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-amber-800 shadow-sm'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-2xs'
            }`}
            title="Analyze multi-monument transit routes and historical significance with Gemini API"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isHeritageAnalyzerOpen ? 'text-amber-200' : 'text-amber-600'}`} />
            <span>Heritage Route Analyzer</span>
            {selectedHeritageMonuments.length > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                isHeritageAnalyzerOpen ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
              }`}>
                {selectedHeritageMonuments.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 bg-stone-100 shadow-md" style={{ height }}>
        {/* Leaflet Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Unified Global Map Search Bar Overlay (Top Left) */}
        <div
          ref={searchContainerRef}
          className="absolute top-3 left-3 right-3 sm:right-auto sm:left-4 sm:top-4 z-[500] sm:w-84 md:w-96"
        >
          <div className="relative shadow-lg rounded-2xl bg-white/98 backdrop-blur-md border border-stone-200/90 transition-all focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-amber-700/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchSuggestions.length > 0 || searchQuery.trim().length >= 2) {
                  setIsSearchDropdownOpen(true);
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search states, cities, monuments, hotels, markets..."
              className="w-full pl-10 pr-14 py-2.5 rounded-2xl bg-transparent text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none"
              aria-label="Unified map location search"
              aria-autocomplete="list"
            />
            <div className="absolute right-2.5 top-2 flex items-center gap-1.5">
              {isSearching && (
                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchSuggestions([]);
                    setIsSearchDropdownOpen(false);
                    setSearchHighlightedIndex(-1);
                    if (searchHighlightRef.current) searchHighlightRef.current.clearLayers();
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition shrink-0"
                  aria-label="Clear search input"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchDropdownOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden max-h-[340px] overflow-y-auto z-[550] divide-y divide-stone-100"
              role="listbox"
            >
              {isSearching && searchSuggestions.length === 0 && (
                <div className="p-3 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  <span>Searching verified destinations & places across India...</span>
                </div>
              )}

              {dualQuery && (
                <div
                  onClick={() => {
                    handleCalculateRoute(
                      { id: dualQuery.originQuery, name: dualQuery.originQuery },
                      { id: dualQuery.destQuery, name: dualQuery.destQuery }
                    );
                    setIsSearchDropdownOpen(false);
                  }}
                  className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer transition flex items-center justify-between text-xs"
                >
                  <span className="font-bold flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Plot Route: {dualQuery.originQuery} ➔ {dualQuery.destQuery}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}

              {!isSearching && searchSuggestions.length === 0 && searchQuery.trim().length >= 2 && !dualQuery && (
                <div className="p-4 text-center space-y-1.5 bg-stone-50/50">
                  <div className="text-stone-400 text-lg">🔍</div>
                  <div className="text-xs font-bold text-stone-800">No matching places found</div>
                  <p className="text-[11px] text-stone-500 max-w-xs mx-auto leading-relaxed">
                    No results found for "<span className="text-stone-800 font-semibold">{searchQuery}</span>". Try searching for an Indian city (e.g. Patna, Jaipur), state, monument, railway station, airport, hotel, or festival.
                  </p>
                </div>
              )}

              {searchSuggestions.map((item, idx) => {
                const details = getCategoryDetails(item);
                const isHighlighted = idx === searchHighlightedIndex;
                return (
                  <div
                    key={`sugg-${item.id}-${idx}`}
                    onClick={() => handleSelectSearchItem(item)}
                    onMouseEnter={() => setSearchHighlightedIndex(idx)}
                    className={`p-2.5 transition flex items-center justify-between gap-2.5 cursor-pointer ${
                      isHighlighted
                        ? 'bg-amber-50/90 text-stone-900 border-l-4 border-amber-500 pl-2'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                    role="option"
                    aria-selected={isHighlighted}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{details.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-800 truncate flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {item.code && (
                            <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-1 py-0.2 rounded font-semibold">
                              {item.code}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400 truncate">
                          {item.subtitle || `${item.city || ''}, ${item.state || 'India'}`}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border ${details.badgeBg}`}>
                      {item.badge || item.categoryType}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clean Floating Map Legend (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-[400] hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-sm text-[11px] font-semibold text-stone-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> Heritage
          </span>
          <span className="text-stone-300">•</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Hidden Gems
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-[10px] text-stone-400">Click clusters to zoom</span>
        </div>

        {/* Route Studio Floating Side Panel / Mobile Bottom Sheet */}
        {isRoutingOpen && (
          <div
            className={`absolute inset-x-0 bottom-0 z-[450] md:inset-auto md:top-4 md:right-4 md:w-96 bg-white/98 md:bg-white/95 backdrop-blur-md rounded-t-3xl md:rounded-3xl border-t md:border border-stone-200 shadow-2xl flex flex-col transition-all duration-300 ${
              isRoutePanelMinimized ? 'max-h-[58px] overflow-hidden' : 'max-h-[72%] md:max-h-[calc(100%-32px)]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 shrink-0">
              <div
                onClick={() => setIsRoutePanelMinimized(!isRoutePanelMinimized)}
                className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <Navigation className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">Virasat Route Studio</h4>
                  <p className="text-[10px] text-stone-500 truncate">
                    {activeOption ? `${activeOption.duration_formatted || `${activeOption.duration_minutes}m`} • ${activeOption.distance_km} km` : 'Multi-modal transit engine'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsRoutePanelMinimized(!isRoutePanelMinimized)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  {isRoutePanelMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRoutingOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Panel Body */}
            {!isRoutePanelMinimized && (
              <div className="overflow-y-auto p-4 space-y-3 flex-1 text-xs">
                {/* Inputs: Origin (Point A) and Destination (Point B) */}
                <div className="space-y-2.5">
                  {/* Origin Field */}
                  <div ref={originContainerRef} className="relative z-30">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Origin (Point A)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleUseMyLocation}
                        disabled={isLocating}
                        className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition"
                        title="Detect GPS coordinates via browser"
                      >
                        <Crosshair className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                        <span>{isLocating ? 'Locating...' : 'Use my current location'}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={routeOriginName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRouteOrigin(val);
                          setRouteOriginName(val);
                          setIsOriginSuggestOpen(true);
                        }}
                        onFocus={() => {
                          if (routeOriginName.trim().length >= 2 || originSuggestions.length > 0) {
                            setIsOriginSuggestOpen(true);
                          }
                        }}
                        onKeyDown={handleOriginKeyDown}
                        placeholder="Type starting city, station, hotel, or monument..."
                        className="w-full min-h-[42px] pl-3 pr-14 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                        aria-label="Route origin search"
                        aria-autocomplete="list"
                      />
                      <div className="absolute right-2 top-2.5 flex items-center gap-1">
                        {isOriginSearching && (
                          <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                        {routeOriginName && (
                          <button
                            type="button"
                            onClick={() => {
                              setRouteOrigin('');
                              setRouteOriginName('');
                              setRouteOriginCoords(null);
                              setOriginSuggestions([]);
                              setIsOriginSuggestOpen(false);
                              setOriginHighlightedIndex(-1);
                            }}
                            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition shrink-0"
                            title="Clear origin"
                            aria-label="Clear origin"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Origin Suggestions Dropdown */}
                    {isOriginSuggestOpen && (
                      <div
                        className="absolute top-full left-0 right-0 mt-1 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-56 overflow-y-auto z-[600] divide-y divide-stone-100"
                        role="listbox"
                      >
                        {/* Quick action: Current Location */}
                        <div
                          onClick={() => {
                            handleUseMyLocation();
                            setIsOriginSuggestOpen(false);
                          }}
                          className="p-2 bg-sky-50/70 hover:bg-sky-100 transition cursor-pointer flex items-center justify-between text-xs text-sky-800 font-bold"
                        >
                          <span className="flex items-center gap-1.5">
                            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                            <span>Use my current GPS location</span>
                          </span>
                          <span className="text-[10px] font-normal text-sky-600">Browser GPS</span>
                        </div>

                        {isOriginSearching && originSuggestions.length === 0 && (
                          <div className="p-3 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                            <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            <span>Searching route points...</span>
                          </div>
                        )}

                        {!isOriginSearching && originSuggestions.length === 0 && routeOriginName.trim().length >= 2 && (
                          <div className="p-3 text-center text-[11px] text-stone-500">
                            No route points found matching "<span className="text-stone-700 font-semibold">{routeOriginName}</span>".
                          </div>
                        )}

                        {originSuggestions.map((item, idx) => {
                          const details = getCategoryDetails(item);
                          const isHighlighted = idx === originHighlightedIndex;
                          return (
                            <div
                              key={`orig-sugg-${item.id}-${idx}`}
                              onClick={() => handleSelectOriginSuggestion(item)}
                              onMouseEnter={() => setOriginHighlightedIndex(idx)}
                              className={`p-2.5 transition flex items-center justify-between gap-2 cursor-pointer ${
                                isHighlighted
                                  ? 'bg-emerald-50 text-stone-900 border-l-4 border-emerald-600 pl-2'
                                  : 'hover:bg-stone-50 text-stone-700'
                              }`}
                              role="option"
                              aria-selected={isHighlighted}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm shrink-0">{details.icon}</span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-stone-800 truncate">{item.name}</div>
                                  <div className="text-[10px] text-stone-400 truncate">{item.subtitle}</div>
                                </div>
                              </div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border ${details.badgeBg}`}>
                                {item.badge || item.categoryType}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center -my-1 relative z-20">
                    <button
                      type="button"
                      onClick={handleSwapEndpoints}
                      className="p-1 rounded-full bg-white hover:bg-stone-100 border border-stone-200 shadow-xs text-stone-500 hover:text-stone-800 transition flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold"
                      title="Swap Origin and Destination"
                    >
                      <ArrowUpDown className="w-3 h-3 text-stone-600" />
                      <span>Swap Points</span>
                    </button>
                  </div>

                  {/* Destination Field */}
                  <div ref={destContainerRef} className="relative z-10">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Destination (Point B)</span>
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        value={routeDestName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRouteDestination(val);
                          setRouteDestName(val);
                          setIsDestSuggestOpen(true);
                        }}
                        onFocus={() => {
                          if (routeDestName.trim().length >= 2 || destSuggestions.length > 0) {
                            setIsDestSuggestOpen(true);
                          }
                        }}
                        onKeyDown={handleDestKeyDown}
                        placeholder="Type destination city, station, hotel, or landmark..."
                        className="w-full min-h-[42px] pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                        aria-label="Route destination search"
                        aria-autocomplete="list"
                      />
                      <div className="absolute right-2 top-2.5 flex items-center gap-1">
                        {isDestSearching && (
                          <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                        {routeDestName && (
                          <button
                            type="button"
                            onClick={() => {
                              setRouteDestination('');
                              setRouteDestName('');
                              setRouteDestCoords(null);
                              setDestSuggestions([]);
                              setIsDestSuggestOpen(false);
                              setDestHighlightedIndex(-1);
                            }}
                            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition shrink-0"
                            title="Clear destination"
                            aria-label="Clear destination"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Destination Suggestions Dropdown */}
                    {isDestSuggestOpen && (
                      <div
                        className="absolute top-full left-0 right-0 mt-1 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-56 overflow-y-auto z-[600] divide-y divide-stone-100"
                        role="listbox"
                      >
                        {isDestSearching && destSuggestions.length === 0 && (
                          <div className="p-3 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                            <div className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                            <span>Searching route points...</span>
                          </div>
                        )}

                        {!isDestSearching && destSuggestions.length === 0 && routeDestName.trim().length >= 2 && (
                          <div className="p-3 text-center text-[11px] text-stone-500">
                            No route points found matching "<span className="text-stone-700 font-semibold">{routeDestName}</span>".
                          </div>
                        )}

                        {destSuggestions.map((item, idx) => {
                          const details = getCategoryDetails(item);
                          const isHighlighted = idx === destHighlightedIndex;
                          return (
                            <div
                              key={`dest-sugg-${item.id}-${idx}`}
                              onClick={() => handleSelectDestSuggestion(item)}
                              onMouseEnter={() => setDestHighlightedIndex(idx)}
                              className={`p-2.5 transition flex items-center justify-between gap-2 cursor-pointer ${
                                isHighlighted
                                  ? 'bg-amber-50 text-stone-900 border-l-4 border-amber-500 pl-2'
                                  : 'hover:bg-stone-50 text-stone-700'
                              }`}
                              role="option"
                              aria-selected={isHighlighted}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm shrink-0">{details.icon}</span>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-stone-800 truncate">{item.name}</div>
                                  <div className="text-[10px] text-stone-400 truncate">{item.subtitle}</div>
                                </div>
                              </div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border ${details.badgeBg}`}>
                                {item.badge || item.categoryType}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mode Selectors */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[
                    { mode: 'DRIVE' as MapTransportMode, icon: Car, label: 'Drive' },
                    { mode: 'TRANSIT' as MapTransportMode, icon: Train, label: 'Rail' },
                    { mode: 'WALK' as MapTransportMode, icon: Footprints, label: 'Walk' },
                    { mode: 'FLIGHT' as MapTransportMode, icon: Plane, label: 'Flight' },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSel = selectedMode === m.mode;
                    return (
                      <button
                        key={m.mode}
                        type="button"
                        onClick={() => {
                          setSelectedMode(m.mode);
                          handleCalculateRoute(undefined, undefined, m.mode);
                        }}
                        className={`flex flex-col items-center py-2 px-1 rounded-xl border text-[10px] font-bold transition ${
                          isSel
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-0.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Validation message if endpoints incomplete */}
                {!isRouteValid && (
                  <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
                    <span className="shrink-0">⚠️</span>
                    <span>
                      {!routeOrigin && !routeDestination
                        ? 'Select both origin (Point A) and destination (Point B).'
                        : !routeOrigin
                        ? 'Please enter or choose a starting point (Point A).'
                        : !routeDestination
                        ? 'Please enter or choose a destination (Point B).'
                        : 'Origin and destination cannot be identical.'}
                    </span>
                  </div>
                )}

                {/* Calculate Route Action */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCalculateRoute()}
                    disabled={!isRouteValid || isCalculatingRoute}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm ${
                      !isRouteValid || isCalculatingRoute
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300 shadow-none'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
                    }`}
                  >
                    {isCalculatingRoute ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Navigation className="w-3.5 h-3.5" />
                    )}
                    <span>{isCalculatingRoute ? 'Calculating...' : 'Plot Route Path'}</span>
                  </button>
                  {activeRoute && (
                    <button
                      type="button"
                      onClick={handleClearRoute}
                      className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs border border-stone-200"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {locationError && (
                  <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-[11px] flex items-center justify-between gap-1">
                    <span>{locationError}</span>
                    <button onClick={() => setLocationError(null)} className="text-sky-600 hover:text-sky-800 font-bold text-xs p-0.5">×</button>
                  </div>
                )}

                {routeError && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px]">
                    {routeError}
                  </div>
                )}

                {/* Route Result Card */}
                {activeOption && (
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-white border border-stone-100">
                        <div className="text-[9px] uppercase font-bold text-stone-400">Distance</div>
                        <div className="text-xs font-black text-stone-800 mt-0.5">{activeOption.distance_km} km</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-100">
                        <div className="text-[9px] uppercase font-bold text-stone-400">Duration</div>
                        <div className="text-xs font-black text-stone-800 mt-0.5">
                          {activeOption.duration_formatted || `${activeOption.duration_minutes}m`}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-stone-100">
                        <div className="text-[9px] uppercase font-bold text-stone-400">Fare</div>
                        <div className="text-xs font-black text-emerald-700 mt-0.5">
                          {activeOption.estimated_fare ? `₹${activeOption.estimated_fare}` : 'Pass/Free'}
                        </div>
                      </div>
                    </div>

                    {/* Step guidance */}
                    {activeOption.steps_summary && activeOption.steps_summary.length > 0 && (
                      <div className="space-y-1 pt-1 max-h-32 overflow-y-auto">
                        <div className="text-[9px] uppercase font-bold text-stone-400">Stage Guidance</div>
                        {activeOption.steps_summary.map((st: string, i: number) => (
                          <div key={i} className="text-[11px] text-stone-600 bg-white p-1.5 rounded-lg border border-stone-100">
                            {st}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* External Link */}
                    {selectedMode === 'FLIGHT' ? (
                      <a
                        href={getGoogleFlightsUrl(routeOriginName || routeOrigin, routeDestName || routeDestination, flightDate)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-[11px] transition shadow-2xs"
                      >
                        <Plane className="w-3.5 h-3.5" />
                        <span>Search Google Flights</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(routeOriginName || routeOrigin)}&destination=${encodeURIComponent(routeDestName || routeDestination)}&travelmode=${selectedMode === 'TRANSIT' ? 'transit' : selectedMode === 'WALK' ? 'walking' : 'driving'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold text-[11px] transition"
                      >
                        <span>Compare on Google Maps</span>
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Floating Google Maps Verified Place Intel Drawer */}
        {mapsIntelPoint && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[460] w-80 sm:w-96 max-h-[88%] bg-white/98 backdrop-blur-md rounded-3xl border border-stone-200/90 shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-stone-200">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  🗺️
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {mapsIntelPoint.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-blue-700 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Google Maps Verified Cartography</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMapsIntelPoint(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-white/80 transition"
                aria-label="Close Maps Intel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 overflow-y-auto text-xs text-stone-700">
              {mapsIntelLoading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-stone-500">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium">Retrieving Google Maps data...</span>
                </div>
              ) : (
                <>
                  {/* Location badge & Coordinates */}
                  <div className="flex items-center justify-between text-[11px] bg-stone-50 p-2 rounded-xl border border-stone-100">
                    <span className="font-semibold text-stone-800">
                      📍 {mapsIntelPoint.city || 'India'}, {mapsIntelPoint.state || ''}
                    </span>
                    <span className="text-stone-400 font-mono text-[10px]">
                      {mapsIntelPoint.lat.toFixed(4)}, {mapsIntelPoint.lng.toFixed(4)}
                    </span>
                  </div>

                  {/* Summary */}
                  {mapsIntelData?.summary && (
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                        Live Highlights & Visiting Intel
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-100">
                        {mapsIntelData.summary}
                      </p>
                    </div>
                  )}

                  {/* Review Snippets from Google Maps */}
                  {mapsIntelData?.review_snippets && mapsIntelData.review_snippets.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-stone-400 flex items-center gap-1">
                        <span>💬 Visitor Insights from Google Maps</span>
                      </div>
                      <div className="space-y-1">
                        {mapsIntelData.review_snippets.map((snip, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-stone-700 italic">
                            "{snip}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Action Links */}
                  <div className="pt-2 space-y-2">
                    <a
                      href={mapsIntelData?.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsIntelPoint.name + ' ' + (mapsIntelPoint.city || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Open on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href={mapsIntelData?.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsIntelPoint.name + ' ' + (mapsIntelPoint.city || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions on Google Maps</span>
                    </a>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setRouteDestination(mapsIntelPoint.id);
                          setRouteDestName(mapsIntelPoint.name);
                          setRouteDestCoords({ lat: mapsIntelPoint.lat, lng: mapsIntelPoint.lng });
                          setIsRoutingOpen(true);
                          setIsRoutePanelMinimized(false);
                          setMapsIntelPoint(null);
                        }}
                        className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] transition text-center"
                      >
                        🎯 Route Here
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPlace(mapsIntelPoint.id);
                          setMapsIntelPoint(null);
                        }}
                        className="py-1.5 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#FF671F] font-bold text-[11px] border border-orange-200 transition text-center"
                      >
                        🏛️ View Place
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Floating Active Heritage Route Banner */}
        {activeHeritageResult && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[410] max-w-[90%] sm:max-w-md bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-300 shadow-lg flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-extrabold text-stone-900 truncate">
                  {activeHeritageResult.circuit_title}
                </div>
                <div className="text-[10px] text-amber-800 font-semibold truncate">
                  {activeHeritageResult.ordered_stops.length} Monuments • {activeHeritageResult.total_distance_km} km • ~{activeHeritageResult.total_transit_minutes}m transit
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsHeritageAnalyzerOpen(true)}
                className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] transition"
              >
                View Route
              </button>
              <button
                type="button"
                onClick={handleClearHeritageRoute}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
                title="Clear route from map"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Heritage Route Analyzer Drawer */}
        <HeritageRouteAnalyzer
          isOpen={isHeritageAnalyzerOpen}
          onClose={() => setIsHeritageAnalyzerOpen(false)}
          availableMonuments={heritageSites}
          selectedMonuments={selectedHeritageMonuments}
          onAddMonument={handleAddMonumentToAnalyzer}
          onRemoveMonument={handleRemoveMonumentFromAnalyzer}
          onReorderMonuments={handleReorderMonumentsInAnalyzer}
          onClearMonuments={handleClearMonumentsInAnalyzer}
          onApplyRouteToMap={handleApplyHeritageRouteToMap}
          onHighlightSegmentOnMap={handleHighlightSegmentOnMap}
          selectedCity={selectedCity}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-[1000] flex items-center justify-center">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-lg flex items-center gap-2.5">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-stone-800 font-bold">Loading Virasat Heritage Cartography...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
