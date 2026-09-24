import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { PlaceSummary, RouteResponse, TransportMode, LocationSuggestion, GoogleMapsPlaceInfo } from '../../types';
import { api } from '../../services/api';
import { findNearestCity, calculateHaversineKm } from '../../data/citiesData';
import { VERIFIED_HIDDEN_GEMS, HiddenGemItem } from '../../data/hiddenGemsData';
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

export interface IndianAirport {
  iata: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  aliases: string[];
}

export const INDIAN_AIRPORTS: IndianAirport[] = [
  { iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000, aliases: ['new delhi', 'ncr', 'gurugram', 'noida'] },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra', lat: 19.0896, lng: 72.8656, aliases: ['bombay', 'navi mumbai', 'thane'] },
  { iata: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka', lat: 13.1986, lng: 77.7066, aliases: ['bangalore'] },
  { iata: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9941, lng: 80.1709, aliases: ['madras', 'meenambakkam'] },
  { iata: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal', lat: 22.6547, lng: 88.4467, aliases: ['calcutta', 'dum dum'] },
  { iata: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana', lat: 17.2403, lng: 78.4294, aliases: ['shamshabad', 'secunderabad'] },
  { iata: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala', lat: 10.1518, lng: 76.3930, aliases: ['cochin', 'nedumbassery', 'ernakulam'] },
  { iata: 'GOI', name: 'Dabolim Airport', city: 'Goa', state: 'Goa', lat: 15.3808, lng: 73.8314, aliases: ['south goa', 'vasco'] },
  { iata: 'GOX', name: 'Manohar International Airport (Mopa)', city: 'Goa', state: 'Goa', lat: 15.7667, lng: 73.8667, aliases: ['north goa', 'mopa'] },
  { iata: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra', lat: 18.5822, lng: 73.9197, aliases: ['lohegaon', 'poona'] },
  { iata: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan', lat: 26.8242, lng: 75.8122, aliases: ['sanganer', 'pink city'] },
  { iata: 'VNS', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.4524, lng: 82.8593, aliases: ['banaras', 'kashi', 'babatpur'] },
  { iata: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0726, lng: 72.6347, aliases: ['ahmedabad', 'gandhinagar'] },
  { iata: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', state: 'Punjab', lat: 31.7096, lng: 74.7973, aliases: ['rajasansi', 'golden temple'] },
  { iata: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 33.9871, lng: 74.7744, aliases: ['kashmir', 'dal lake'] },
  { iata: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', state: 'Rajasthan', lat: 24.6178, lng: 73.8961, aliases: ['dabok', 'lake city'] },
  { iata: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2514, lng: 73.0489, aliases: ['blue city'] },
  { iata: 'IXU', name: 'Chhatrapati Sambhaji Nagar Airport (Aurangabad)', city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8631, lng: 75.3981, aliases: ['aurangabad', 'ajanta', 'ellora', 'daulatabad'] },
  { iata: 'HJR', name: 'Khajuraho Airport', city: 'Khajuraho', state: 'Madhya Pradesh', lat: 24.8172, lng: 79.9189, aliases: ['khajuraho temples', 'chhatarpur'] },
  { iata: 'AGR', name: 'Agra Airport (Kheria)', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1558, lng: 77.9609, aliases: ['taj mahal', 'kheria', 'fatehpur sikri'] },
  { iata: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam', lat: 26.1061, lng: 91.5859, aliases: ['borjhar', 'kamakhya', 'assam'] },
  { iata: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2444, lng: 85.8178, aliases: ['puri', 'konark', 'cuttack'] },
  { iata: 'PAT', name: 'Jay Prakash Narayan Airport', city: 'Patna', state: 'Bihar', lat: 25.5913, lng: 85.0880, aliases: ['nalanda', 'bodh gaya'] },
  { iata: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.7606, lng: 80.8893, aliases: ['amausi', 'ayodhya hub'] },
  { iata: 'IXC', name: 'Shaheed Bhagat Singh International Airport', city: 'Chandigarh', state: 'Chandigarh', lat: 30.6735, lng: 76.7885, aliases: ['mohali', 'panchkula'] },
  { iata: 'TRV', name: 'Thiruvananthapuram International Airport', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4821, lng: 76.9200, aliases: ['trivandrum', 'kovalam'] },
  { iata: 'IXB', name: 'Bagdogra International Airport', city: 'Siliguri', state: 'West Bengal', lat: 26.6812, lng: 88.3286, aliases: ['darjeeling', 'gangtok', 'sikkim'] },
  { iata: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport', city: 'Nagpur', state: 'Maharashtra', lat: 21.0922, lng: 79.0472, aliases: ['sonegaon', 'orange city'] },
  { iata: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', state: 'Jharkhand', lat: 23.3143, lng: 85.3217, aliases: ['ranchi'] },
  { iata: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara', state: 'Gujarat', lat: 22.3325, lng: 73.2264, aliases: ['baroda', 'statue of unity'] },
  { iata: 'VDY', name: 'Jindal Vijayanagar Airport', city: 'Toranagallu', state: 'Karnataka', lat: 15.1683, lng: 76.6342, aliases: ['hampi', 'ballari', 'bellary'] },
  { iata: 'HBX', name: 'Hubballi Airport', city: 'Hubballi', state: 'Karnataka', lat: 15.3617, lng: 75.0849, aliases: ['hubli', 'dharwad', 'hampi'] },
  { iata: 'IXM', name: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu', lat: 9.8345, lng: 78.0934, aliases: ['meenakshi amman temple'] },
  { iata: 'TIR', name: 'Tirupati Airport', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6325, lng: 79.5433, aliases: ['renigunta', 'tirumala'] },
  { iata: 'DED', name: 'Jolly Grant Airport', city: 'Dehradun', state: 'Uttarakhand', lat: 30.1897, lng: 78.1803, aliases: ['rishikesh', 'haridwar'] },
  { iata: 'IXJ', name: 'Jammu Airport', city: 'Jammu', state: 'Jammu & Kashmir', lat: 32.6891, lng: 74.8374, aliases: ['satwari', 'vaishno devi'] },
  { iata: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh', lat: 21.1804, lng: 81.7388, aliases: ['mana'] },
  { iata: 'IDR', name: 'Devi Ahilya Bai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7217, lng: 75.8011, aliases: ['ujjain gateway', 'indore'] },
  { iata: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2875, lng: 77.3378, aliases: ['sanchi gateway', 'bhopal'] },
];

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function findNearestAirport(lat: number, lng: number): { airport: IndianAirport; distanceKm: number } {
  let nearest = INDIAN_AIRPORTS[0];
  let minDistance = Infinity;
  for (const ap of INDIAN_AIRPORTS) {
    const d = haversineDistanceKm(lat, lng, ap.lat, ap.lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = ap;
    }
  }
  return { airport: nearest, distanceKm: minDistance };
}

function searchAirports(query: string): IndianAirport[] {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return INDIAN_AIRPORTS.filter((ap) => {
    if (ap.iata.toLowerCase() === q) return true;
    if (ap.city.toLowerCase().includes(q)) return true;
    if (ap.name.toLowerCase().includes(q)) return true;
    if (ap.state.toLowerCase().includes(q)) return true;
    if (ap.aliases.some((al) => al.includes(q))) return true;
    return false;
  });
}

function generateFlightArc(p1: [number, number], p2: [number, number], numPoints = 60): [number, number][] {
  const [lat1, lng1] = p1;
  const [lat2, lng2] = p2;
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  const curveFactor = Math.min(Math.max(dist * 0.16, 1.2), 6.5);
  const normalLat = -dLng / (dist || 1);
  const normalLng = dLat / (dist || 1);
  const ctrlLat = midLat + normalLat * curveFactor;
  const ctrlLng = midLng + normalLng * curveFactor;

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * ctrlLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * ctrlLng + t * t * lng2;
    points.push([Number(lat.toFixed(5)), Number(lng.toFixed(5))]);
  }
  return points;
}

function getGoogleFlightsUrl(originQuery: string, destQuery: string, dateStr: string): string {
  return `https://www.google.com/travel/flights?q=Flights+to+${encodeURIComponent(destQuery)}+from+${encodeURIComponent(originQuery)}+on+${encodeURIComponent(dateStr)}`;
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

  // Datasets
  const [heritageSites, setHeritageSites] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [hiddenGemsList] = useState<HiddenGemItem[]>(VERIFIED_HIDDEN_GEMS);
  const [loading, setLoading] = useState(true);

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

  // Autocomplete Search States
  const [searchSuggestions, setSearchSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // Route Studio Autocomplete States
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOriginSuggestOpen, setIsOriginSuggestOpen] = useState(false);
  const [isDestSuggestOpen, setIsDestSuggestOpen] = useState(false);

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

  // In-Map Route State
  const [isRoutingOpen, setIsRoutingOpen] = useState(Boolean(initialOrigin || initialDestination));
  const [routeOrigin, setRouteOrigin] = useState<string>(initialOrigin || 'csmt');
  const [routeOriginName, setRouteOriginName] = useState<string>('CSMT Railway Station');
  const [routeOriginCoords, setRouteOriginCoords] = useState<{ lat: number; lng: number } | null>({ lat: 18.94, lng: 72.8353 });
  const [routeDestination, setRouteDestination] = useState<string>(initialDestination || 'gateway-of-india');
  const [routeDestName, setRouteDestName] = useState<string>('Gateway of India');
  const [routeDestCoords, setRouteDestCoords] = useState<{ lat: number; lng: number } | null>({ lat: 18.922, lng: 72.8347 });
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
    } catch (initErr) {
      console.error('[Map] Failed to initialize Leaflet:', initErr);
    }

    return () => {
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

        <div style="display: flex; gap: 6px;">
          <button id="btn-dossier-${site.id}" style="flex: 1; background: #ea580c; color: #fff; border: none; border-radius: 6px; padding: 6px 0; font-size: 11px; font-weight: 700; cursor: pointer;">
            View Details
          </button>
          ${site.model_3d?.available || site.features?.['3d'] ? `
            <button id="btn-3d-${site.id}" style="background: #0284c7; color: #fff; border: none; border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              🧊 3D
            </button>
          ` : ''}
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

    const btn3d = card.querySelector(`#btn-3d-${item.id}`) as HTMLElement;
    if (btn3d && onView3DPlace) {
      btn3d.onclick = () => onView3DPlace(item.id);
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

  // 7. Search autocomplete handler (Heritage, Hidden Gems, Stations)
  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) {
      setSearchSuggestions([]);
      setIsSearchDropdownOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      const results: LocationSuggestion[] = [];

      // 1. Heritage matches
      heritageSites.forEach((h) => {
        if (
          h.name?.toLowerCase().includes(trimmed) ||
          h.city?.toLowerCase().includes(trimmed) ||
          h.state?.toLowerCase().includes(trimmed)
        ) {
          const coords = extractValidCoordinates(h);
          if (coords) {
            results.push({
              id: h.id,
              name: h.name,
              subtitle: `${h.city || ''}, ${h.state || 'India'} • Heritage`,
              type: 'heritage',
              categoryType: 'heritage',
              badge: 'UNESCO/ASI',
              lat: coords[0],
              lng: coords[1],
            });
          }
        }
      });

      // 2. Hidden Gems matches
      hiddenGemsList.forEach((gem) => {
        if (
          gem.name.toLowerCase().includes(trimmed) ||
          gem.city.toLowerCase().includes(trimmed) ||
          gem.state.toLowerCase().includes(trimmed) ||
          gem.category.toLowerCase().includes(trimmed)
        ) {
          results.push({
            id: gem.id,
            name: gem.name,
            subtitle: `${gem.city}, ${gem.state} • ${gem.category}`,
            type: 'place',
            categoryType: 'hidden_gem',
            badge: 'Hidden Gem',
            lat: gem.lat,
            lng: gem.lng,
          });
        }
      });

      // 3. Station matches
      stations.forEach((st) => {
        if (
          st.name?.toLowerCase().includes(trimmed) ||
          st.code?.toLowerCase().includes(trimmed) ||
          st.city?.toLowerCase().includes(trimmed)
        ) {
          const coords = extractValidCoordinates(st);
          if (coords) {
            results.push({
              id: st.id || st.code,
              name: st.name,
              subtitle: `${st.city} • Code: ${st.code || 'IR'}`,
              type: 'station',
              categoryType: 'station',
              badge: 'Railway Hub',
              lat: coords[0],
              lng: coords[1],
            });
          }
        }
      });

      setSearchSuggestions(results.slice(0, 8));
      setIsSearchDropdownOpen(results.length > 0);
      setIsSearching(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery, heritageSites, hiddenGemsList, stations]);

  const dualQuery = useMemo(() => parseDualPointsQuery(searchQuery), [searchQuery]);

  const handleSelectSearchItem = (item: LocationSuggestion) => {
    setIsSearchDropdownOpen(false);
    setSearchQuery(item.name);
    const map = mapInstanceRef.current;
    if (map && item.lat && item.lng) {
      map.flyTo([item.lat, item.lng], 14, { duration: 1 });

      if (searchHighlightRef.current) {
        searchHighlightRef.current.clearLayers();
        const icon = L.divIcon({
          className: 'search-pin',
          html: `<div style="background:#ea580c; width:34px; height:34px; border-radius:50%; border:3px solid white; box-shadow:0 0 16px rgba(234,88,12,0.8); display:flex; align-items:center; justify-content:center; color:white; font-size:16px;">📍</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });
        L.marker([item.lat, item.lng], { icon })
          .bindTooltip(`<b>${item.name}</b><br/>${item.subtitle}`, { permanent: false })
          .addTo(searchHighlightRef.current);
      }
    }
  };

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
            onClick={() => setIsRoutingOpen(!isRoutingOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              isRoutingOpen
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route Studio</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 bg-stone-100 shadow-md" style={{ height }}>
        {/* Leaflet Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Minimal Search Bar Overlay (Top Left) */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:left-4 sm:top-4 z-[400] sm:w-80">
          <div className="relative shadow-md rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchSuggestions.length > 0) setIsSearchDropdownOpen(true);
              }}
              placeholder="Search heritage, hidden gems, stations..."
              className="w-full pl-10 pr-9 py-2 rounded-2xl bg-transparent text-xs text-stone-800 font-medium placeholder-stone-400 focus:outline-none"
            />
            {isSearching && (
              <div className="absolute right-9 top-2.5 w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            )}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchSuggestions([]);
                  setIsSearchDropdownOpen(false);
                  if (searchHighlightRef.current) searchHighlightRef.current.clearLayers();
                }}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchDropdownOpen && (dualQuery || searchSuggestions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200 overflow-hidden max-h-[300px] overflow-y-auto z-[500] divide-y divide-stone-100">
              {dualQuery && (
                <div
                  onClick={() => {
                    handleCalculateRoute(
                      { id: dualQuery.originQuery, name: dualQuery.originQuery },
                      { id: dualQuery.destQuery, name: dualQuery.destQuery }
                    );
                    setIsSearchDropdownOpen(false);
                  }}
                  className="p-2.5 bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 transition flex items-center justify-between text-xs"
                >
                  <span className="font-bold">
                    Route: {dualQuery.originQuery} ➔ {dualQuery.destQuery}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}

              {searchSuggestions.map((item, idx) => (
                <div
                  key={`sugg-${item.id}-${idx}`}
                  onClick={() => handleSelectSearchItem(item)}
                  className="p-2.5 hover:bg-stone-50 transition flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">
                      {item.categoryType === 'heritage' ? '🏛️' : item.categoryType === 'hidden_gem' ? '💎' : '🚆'}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-800 truncate">{item.name}</div>
                      <div className="text-[10px] text-stone-400 truncate">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 bg-stone-100 text-stone-600">
                    {item.badge}
                  </span>
                </div>
              ))}
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
                {/* Inputs */}
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Origin (Point A)
                    </label>
                    <input
                      type="text"
                      value={routeOriginName || routeOrigin}
                      onChange={(e) => {
                        setRouteOrigin(e.target.value);
                        setRouteOriginName(e.target.value);
                      }}
                      placeholder="e.g. CSMT Railway Station or Delhi"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Destination (Point B)
                    </label>
                    <input
                      type="text"
                      value={routeDestName || routeDestination}
                      onChange={(e) => {
                        setRouteDestination(e.target.value);
                        setRouteDestName(e.target.value);
                      }}
                      placeholder="e.g. Gateway of India or Taj Mahal"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-emerald-600"
                    />
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

                {/* Calculate Route Action */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCalculateRoute()}
                    disabled={isCalculatingRoute}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
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
