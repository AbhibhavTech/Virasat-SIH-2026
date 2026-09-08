import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { PlaceSummary, RouteResponse, TransportMode, LocationSuggestion } from '../../types';
import { api } from '../../services/api';

// Helper to detect dual-point route searches like "srinagar station to csmt" or "srinagar - csmt"
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
  Bike,
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
  ArrowUpDown
} from 'lucide-react';

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
  places: propPlaces,
  onNavigateToPlace,
  onView3DPlace,
  initialOrigin,
  initialDestination,
  height = '620px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heritageLayerRef = useRef<L.LayerGroup | null>(null);
  const stationLayerRef = useRef<L.LayerGroup | null>(null);
  const sightsLayerRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.LayerGroup | L.Polyline | null>(null);
  const routeMarkersRef = useRef<L.LayerGroup | null>(null);
  const searchHighlightRef = useRef<L.LayerGroup | null>(null);

  // Autocomplete Search States (All India Cities, Stations, Heritage, Tourist Sights)
  const [searchSuggestions, setSearchSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // Route Studio Autocomplete States
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOriginSuggestOpen, setIsOriginSuggestOpen] = useState(false);
  const [isDestSuggestOpen, setIsDestSuggestOpen] = useState(false);

  // Duration display formatter (e.g., "15 hr 40 min", "45 min")
  const formatDurationDisplay = (mins?: number, formatted?: string) => {
    if (formatted) return formatted;
    if (!mins || isNaN(mins)) return '--';
    if (mins < 60) return `${Math.round(mins)} min`;
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    if (h >= 24) {
      const d = Math.floor(h / 24);
      const rh = h % 24;
      return `${d}d ${rh}h${m > 0 ? ` ${m}m` : ''}`;
    }
    return `${h} hr${m > 0 ? ` ${m} min` : ''}`;
  };

  // Datasets
  const [heritageSites, setHeritageSites] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [allPlaces, setAllPlaces] = useState<PlaceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Layer Toggles
  const [showHeritage, setShowHeritage] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showSights, setShowSights] = useState(true);

  // Safe LatLng coordinate parser & extractor to prevent Leaflet "Invalid LatLng object: (NaN, NaN)" exceptions
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

  // In-Map Route State
  const [isRoutingOpen, setIsRoutingOpen] = useState(Boolean(initialOrigin || initialDestination));
  const [routeOrigin, setRouteOrigin] = useState<string>(initialOrigin || 'csmt');
  const [routeOriginName, setRouteOriginName] = useState<string>('CSMT Railway Station');
  const [routeOriginCoords, setRouteOriginCoords] = useState<{ lat: number; lng: number } | null>({ lat: 18.94, lng: 72.8353 });
  const [routeDestination, setRouteDestination] = useState<string>(initialDestination || 'gateway-of-india');
  const [routeDestName, setRouteDestName] = useState<string>('Gateway of India');
  const [routeDestCoords, setRouteDestCoords] = useState<{ lat: number; lng: number } | null>({ lat: 18.922, lng: 72.8347 });
  const [selectedMode, setSelectedMode] = useState<TransportMode>('DRIVE');
  const [activeRoute, setActiveRoute] = useState<RouteResponse | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isRoutePanelMinimized, setIsRoutePanelMinimized] = useState(false);

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

  // 1. Fetch all datasets (Heritage 42+, Stations, Places)
  useEffect(() => {
    let isMounted = true;
    const loadAllMapData = async () => {
      setLoading(true);
      try {
        const [heritageRes, stationsRes, placesRes] = await Promise.all([
          api.getHeritage({ limit: 100 }),
          api.getRailwayStations(),
          propPlaces && propPlaces.length > 0 ? Promise.resolve({ data: propPlaces }) : api.getPlaces({ limit: 100 }),
        ]);

        if (isMounted) {
          setHeritageSites(heritageRes.data || []);
          setStations(stationsRes || []);
          setAllPlaces(placesRes.data || []);
        }
      } catch (err) {
        console.error('[Map] Error fetching map datasets:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAllMapData();
    return () => {
      isMounted = false;
    };
  }, [propPlaces]);

  // City preset coordinates for rapid panning
  const cityCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
    'all-india': { lat: 22.5, lng: 79.0, zoom: 5 },
    mumbai: { lat: 18.9431, lng: 72.833, zoom: 13 },
    delhi: { lat: 28.6139, lng: 77.209, zoom: 12 },
    jaipur: { lat: 26.9124, lng: 75.7873, zoom: 13 },
    agra: { lat: 27.1751, lng: 78.0421, zoom: 13 },
    kochi: { lat: 9.9312, lng: 76.2673, zoom: 13 },
    varanasi: { lat: 25.3176, lng: 82.9739, zoom: 13 },
    goa: { lat: 15.4909, lng: 73.8278, zoom: 12 },
    bengaluru: { lat: 12.9716, lng: 77.5946, zoom: 12 },
    kolkata: { lat: 22.5726, lng: 88.3639, zoom: 12 },
    amritsar: { lat: 31.6340, lng: 74.8723, zoom: 13 },
  };

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

      // Add Zoom Control to bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Standard Tiles
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Layers
      heritageLayerRef.current = L.layerGroup().addTo(map);
      stationLayerRef.current = L.layerGroup().addTo(map);
      sightsLayerRef.current = L.layerGroup().addTo(map);
      routeMarkersRef.current = L.layerGroup().addTo(map);
      searchHighlightRef.current = L.layerGroup().addTo(map);
    } catch (initErr) {
      console.error('[Map] Failed to initialize Leaflet map instance:', initErr);
    }

    return () => {
      if (searchHighlightRef.current) {
        try {
          searchHighlightRef.current.clearLayers();
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
        mapInstanceRef.current.flyTo(safeCenter, safeZoom, { duration: 1.2 });
      } catch (err) {
        console.warn('[Map] flyTo failed:', err);
      }
    }
  }, [selectedCity]);

  const handleCityJump = (cityKey: string) => {
    const key = cityKey.toLowerCase().replace(/\s+/g, '-');
    const cfg = cityCoordinates[key] || cityCoordinates['all-india'];
    if (cfg && mapInstanceRef.current) {
      const safeCenter = parseLatLng(cfg.lat, cfg.lng) || [22.5, 79.0];
      const safeZoom = typeof cfg.zoom === 'number' && !isNaN(cfg.zoom) ? cfg.zoom : 5;
      try {
        mapInstanceRef.current.flyTo(safeCenter, safeZoom, { duration: 1.2 });
      } catch (err) {
        console.warn('[Map] handleCityJump failed:', err);
      }
    }
    if (onSelectCity) {
      if (key === 'all-india') {
        onSelectCity('All India');
      } else {
        onSelectCity(cityKey.charAt(0).toUpperCase() + cityKey.slice(1));
      }
    }
  };

  // 4. Update Markers on Map based on layers & search query
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const hLayer = heritageLayerRef.current;
    const stLayer = stationLayerRef.current;
    const sLayer = sightsLayerRef.current;

    if (hLayer) hLayer.clearLayers();
    if (stLayer) stLayer.clearLayers();
    if (sLayer) sLayer.clearLayers();

    const q = searchQuery.toLowerCase().trim();

    // Helper to create HTML popup card
    const createPopupContent = (item: any, type: 'heritage' | 'station' | 'sight') => {
      const isHeritage = type === 'heritage';
      const isStation = type === 'station';
      const name = item.name;
      const subtitle = isStation
        ? `${item.city} • Code: ${item.code || 'IR'}`
        : `${item.city || ''}, ${item.state || 'India'}`;
      const img = item.thumbnail_url || (item.images && item.images[0]) || '';
      const fee = item.entry_fee
        ? item.entry_fee.domestic === 0
          ? 'Free Entry'
          : `₹${item.entry_fee.domestic}`
        : item.entry_fee_inr
        ? `₹${item.entry_fee_inr}`
        : isStation
        ? 'Platform Ticket ₹10'
        : 'Free Access';

      const timing = item.visiting_hours || item.timings || (isStation ? 'Open 24/7' : '09:00 AM - 05:30 PM');

      const card = document.createElement('div');
      card.className = 'p-3 text-slate-900 max-w-[270px] font-sans rounded-xl';
      card.innerHTML = `
        ${img ? `<div style="position: relative; margin: -12px -12px 10px -12px; border-top-left-radius: 12px; border-top-right-radius: 12px; overflow: hidden; height: 110px;">
          <img src="${img}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; bottom: 8px; left: 8px; font-size: 10px; font-weight: 700; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 7px; border-radius: 6px; text-transform: uppercase;">
            ${isHeritage ? 'Heritage Site' : isStation ? 'Railway Hub' : 'Attraction'}
          </span>
        </div>` : ''}
        <h4 style="font-weight: 800; font-size: 14px; margin: 0 0 2px 0; color: #0f172a; line-height: 1.25;">${name}</h4>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">${subtitle}</div>
        
        <div style="display: flex; gap: 8px; margin-bottom: 10px; font-size: 11px; background: #f8fafc; padding: 6px 8px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="flex: 1;">
            <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Hours</div>
            <div style="font-weight: 600; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${timing}</div>
          </div>
          <div style="border-left: 1px solid #cbd5e1; padding-left: 8px;">
            <div style="font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Fee</div>
            <div style="font-weight: 700; color: #059669;">${fee}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
          <button id="btn-origin-${item.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            🚩 Start Route
          </button>
          <button id="btn-dest-${item.id}" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 6px; padding: 5px; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            🎯 Route To Here
          </button>
        </div>

        <div style="display: flex; gap: 6px;">
          <button id="btn-dossier-${item.id}" style="flex: 1; background: #059669; color: #fff; border: none; border-radius: 6px; padding: 6px 0; font-size: 11px; font-weight: 700; cursor: pointer;">
            View Details
          </button>
          ${item.model_3d?.available || item.features?.['3d'] ? `
            <button id="btn-3d-${item.id}" style="background: #f97316; color: #fff; border: none; border-radius: 6px; padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer;">
              🧊 3D
            </button>
          ` : ''}
        </div>
      `;
      return card;
    };

    // A. Plot Heritage Sites (UNESCO & ASI)
    if (showHeritage && hLayer) {
      heritageSites.forEach((site) => {
        try {
          const coords = extractValidCoordinates(site);
          if (!coords) return;

          const matchesSearch =
            !q ||
            site.name?.toLowerCase().includes(q) ||
            site.city?.toLowerCase().includes(q) ||
            site.state?.toLowerCase().includes(q);

          if (!matchesSearch) return;

          const iconHtml = `
            <div style="background-color: #ea580c; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.45); cursor: pointer; transition: transform 0.2s;" title="${site.name || 'Heritage'}">
              <span style="font-size: 16px;">🏛️</span>
            </div>
          `;
          const markerIcon = L.divIcon({
            className: 'heritage-pin',
            html: iconHtml,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -18],
          });

          const marker = L.marker(coords, { icon: markerIcon });
          const popup = createPopupContent(site, 'heritage');
          marker.bindPopup(popup);

          marker.on('popupopen', () => {
            const btnDossier = document.getElementById(`btn-dossier-${site.id}`);
            if (btnDossier) btnDossier.onclick = () => onSelectPlace(site.id);

            const btnOrigin = document.getElementById(`btn-origin-${site.id}`);
            if (btnOrigin)
              btnOrigin.onclick = () => {
                setRouteOrigin(site.id);
                setRouteOriginName(site.name);
                setRouteOriginCoords({ lat: coords[0], lng: coords[1] });
                setIsRoutingOpen(true);
              };

            const btnDest = document.getElementById(`btn-dest-${site.id}`);
            if (btnDest)
              btnDest.onclick = () => {
                setRouteDestination(site.id);
                setRouteDestName(site.name);
                setRouteDestCoords({ lat: coords[0], lng: coords[1] });
                setIsRoutingOpen(true);
              };

            const btn3d = document.getElementById(`btn-3d-${site.id}`);
            if (btn3d && onView3DPlace) btn3d.onclick = () => onView3DPlace(site.id);
          });

          hLayer.addLayer(marker);
        } catch (err) {
          console.warn('[Map] Skipping invalid heritage marker:', site?.name, err);
        }
      });
    }

    // B. Plot Railway Stations & Transit Hubs
    if (showStations && stLayer) {
      stations.forEach((st) => {
        try {
          const coords = extractValidCoordinates(st);
          if (!coords) return;

          const matchesSearch =
            !q ||
            st.name?.toLowerCase().includes(q) ||
            st.code?.toLowerCase().includes(q) ||
            st.city?.toLowerCase().includes(q);

          if (!matchesSearch) return;

          const iconHtml = `
            <div style="background-color: #0284c7; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(2, 132, 199, 0.4); cursor: pointer;" title="${st.name || 'Station'} (${st.code || 'IR'})">
              <span style="font-size: 14px;">🚆</span>
            </div>
          `;
          const markerIcon = L.divIcon({
            className: 'station-pin',
            html: iconHtml,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -16],
          });

          const marker = L.marker(coords, { icon: markerIcon });
          const popup = createPopupContent(st, 'station');
          marker.bindPopup(popup);

          marker.on('popupopen', () => {
            const btnOrigin = document.getElementById(`btn-origin-${st.id}`);
            if (btnOrigin)
              btnOrigin.onclick = () => {
                setRouteOrigin(st.id || st.code);
                setRouteOriginName(st.name);
                setRouteOriginCoords({ lat: coords[0], lng: coords[1] });
                setIsRoutingOpen(true);
              };

            const btnDest = document.getElementById(`btn-dest-${st.id}`);
            if (btnDest)
              btnDest.onclick = () => {
                setRouteDestination(st.id || st.code);
                setRouteDestName(st.name);
                setRouteDestCoords({ lat: coords[0], lng: coords[1] });
                setIsRoutingOpen(true);
              };
          });

          stLayer.addLayer(marker);
        } catch (err) {
          console.warn('[Map] Skipping invalid station marker:', st?.name, err);
        }
      });
    }

    // C. Plot Tourism Attractions & Sights
    if (showSights && sLayer) {
      allPlaces.forEach((p) => {
        try {
          const coords = extractValidCoordinates(p);
          if (!coords) return;
          // Avoid duplicate pin if already in heritage list
          if (heritageSites.some((h) => h.id === p.id)) return;

          const matchesSearch =
            !q ||
            p.name?.toLowerCase().includes(q) ||
            p.city?.toLowerCase().includes(q) ||
            p.summary?.toLowerCase().includes(q);

          if (!matchesSearch) return;

          const iconHtml = `
            <div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 3px 8px rgba(16, 185, 129, 0.4); cursor: pointer;" title="${p.name || 'Attraction'}">
              <span style="color: white; font-size: 11px; font-weight: 800;">★</span>
            </div>
          `;
          const markerIcon = L.divIcon({
            className: 'sight-pin',
            html: iconHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, -15],
          });

          const marker = L.marker(coords, { icon: markerIcon });
          const popup = createPopupContent(p, 'sight');
          marker.bindPopup(popup);

          marker.on('popupopen', () => {
            const btnDossier = document.getElementById(`btn-dossier-${p.id}`);
            if (btnDossier) btnDossier.onclick = () => onSelectPlace(p.id);

            const btnOrigin = document.getElementById(`btn-origin-${p.id}`);
            if (btnOrigin)
              btnOrigin.onclick = () => {
                setRouteOrigin(p.id);
                setRouteOriginName(p.name);
                setRouteOriginCoords({ lat: coords[0], lng: coords[1] });
                setIsRoutingOpen(true);
              };

            const btnDest = document.getElementById(`btn-dest-${p.id}`);
            if (btnDest)
              btnDest.onclick = () => {
                setRouteDestination(p.id);
                setRouteDestName(p.name);
                setRouteDestCoords({ lat: coords[0], lng: coords[1] });
                setIsRoutingOpen(true);
              };
          });

          sLayer.addLayer(marker);
        } catch (err) {
          console.warn('[Map] Skipping invalid attraction marker:', p?.name, err);
        }
      });
    }
  }, [
    heritageSites,
    stations,
    allPlaces,
    showHeritage,
    showStations,
    showSights,
    searchQuery,
    onSelectPlace,
    onView3DPlace,
  ]);

  // 5. In-Map Real Routing Execution & Autocomplete Handlers
  const handleCalculateRoute = async (
    customOrigin?: { id: string; name: string; lat?: number; lng?: number },
    customDest?: { id: string; name: string; lat?: number; lng?: number },
    customMode?: TransportMode
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

    try {
      const res = await api.getRoutes({
        origin: originId,
        destination: destId,
        mode: mode,
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

      // Clean old polyline
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
      if (routeMarkersRef.current) {
        routeMarkersRef.current.clearLayers();
      }

      // Pick option matching mode or first option
      const opt: any = res.options?.find((o: any) => o.mode === mode) || res.options?.[0];

      let polyCoords: [number, number][] = [];
      if (opt && opt.polyline && Array.isArray(opt.polyline) && opt.polyline.length > 0) {
        polyCoords = opt.polyline
          .map((pt: any) => (Array.isArray(pt) ? parseLatLng(pt[0], pt[1]) : parseLatLng(pt?.lat, pt?.lng)))
          .filter((pt: [number, number] | null): pt is [number, number] => pt !== null);
      } else if (res.origin?.latitude && res.destination?.latitude) {
        const p1 = parseLatLng(res.origin.latitude, res.origin.longitude);
        const p2 = parseLatLng(res.destination.latitude, res.destination.longitude);
        if (p1 && p2) {
          polyCoords = [p1, p2];
        }
      }

      if (polyCoords.length > 0) {
        const routeGroup = L.layerGroup();

        if (mode === 'TRANSIT') {
          // Authentic Dual-layer Railroad Track Geometry (just like Google Maps rail layer)
          // Layer 1: Dark steel ballast base
          L.polyline(polyCoords, {
            color: '#0f172a',
            weight: 7,
            opacity: 0.95,
            lineJoin: 'round',
          }).addTo(routeGroup);

          // Layer 2: High-contrast rail ties (amber & white dashes)
          L.polyline(polyCoords, {
            color: '#fbbf24',
            weight: 3.5,
            opacity: 1,
            dashArray: '8, 8',
            lineJoin: 'round',
          }).addTo(routeGroup);
        } else if (mode === 'DRIVE') {
          // Highway Vector: Navy blue border with vibrant royal blue core
          L.polyline(polyCoords, {
            color: '#1e3a8a',
            weight: 7,
            opacity: 0.9,
            lineJoin: 'round',
          }).addTo(routeGroup);

          L.polyline(polyCoords, {
            color: '#2563eb',
            weight: 4.5,
            opacity: 1,
            lineJoin: 'round',
          }).addTo(routeGroup);
        } else if (mode === 'WALK') {
          L.polyline(polyCoords, {
            color: '#059669',
            weight: 5,
            opacity: 0.9,
            lineJoin: 'round',
            dashArray: '6, 8',
          }).addTo(routeGroup);
        } else if (mode === 'BICYCLE') {
          L.polyline(polyCoords, {
            color: '#0284c7',
            weight: 5,
            opacity: 0.9,
            lineJoin: 'round',
          }).addTo(routeGroup);
        } else {
          L.polyline(polyCoords, {
            color: '#ea580c',
            weight: 6,
            opacity: 0.9,
            lineJoin: 'round',
          }).addTo(routeGroup);
        }

        routeGroup.addTo(map);
        routePolylineRef.current = routeGroup;

        // Add distinct Start (A) & Destination (B) route markers
        const startIcon = L.divIcon({
          className: 'route-start-pin',
          html: `<div style="background:#10b981; color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; border:2.5px solid white; box-shadow:0 3px 10px rgba(0,0,0,0.35);">A</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const endIcon = L.divIcon({
          className: 'route-end-pin',
          html: `<div style="background:#ea580c; color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; border:2.5px solid white; box-shadow:0 3px 10px rgba(0,0,0,0.35);">B</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const startPt = polyCoords[0];
        const endPt = polyCoords[polyCoords.length - 1];

        const oTitle = res.origin?.name || originName;
        const dTitle = res.destination?.name || destName;

        if (routeMarkersRef.current && startPt && endPt) {
          L.marker(startPt, { icon: startIcon })
            .bindTooltip(`Origin: ${oTitle}`, { direction: 'top' })
            .addTo(routeMarkersRef.current);
          L.marker(endPt, { icon: endIcon })
            .bindTooltip(`Destination: ${dTitle}`, { direction: 'top' })
            .addTo(routeMarkersRef.current);
        }

        // Fit map smoothly to route bounds
        try {
          const boundsPoly = L.polyline(polyCoords);
          map.fitBounds(boundsPoly.getBounds(), { padding: [60, 60], maxZoom: 15 });
        } catch (boundsErr) {
          console.warn('[Map] fitBounds warning:', boundsErr);
        }
      }
    } catch (err: any) {
      setRouteError('Unable to generate route coordinates. Please choose other points.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Debounced search for top search bar
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchSuggestions([]);
      setIsSearchDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.suggestLocations(trimmed, 10);
        setSearchSuggestions(results);
        setIsSearchDropdownOpen(true);
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Dual-query detection (e.g. "srinagar station to csmt" or "srinagar station and second destination - csmt")
  const dualQuery = useMemo(() => parseDualPointsQuery(searchQuery), [searchQuery]);

  const handleExecuteDualRoute = async (originQ: string, destQ: string) => {
    setIsSearchDropdownOpen(false);
    setIsRoutingOpen(true);
    setIsRoutePanelMinimized(false);
    setIsCalculatingRoute(true);
    setRouteError(null);

    try {
      const [origList, destList] = await Promise.all([
        api.suggestLocations(originQ, 1),
        api.suggestLocations(destQ, 1),
      ]);

      const oItem = origList[0];
      const dItem = destList[0];

      const origId = oItem ? oItem.id : originQ;
      const origName = oItem ? oItem.name : originQ;
      const origLat = oItem?.lat;
      const origLng = oItem?.lng;

      const dId = dItem ? dItem.id : destQ;
      const dName = dItem ? dItem.name : destQ;
      const dLat = dItem?.lat;
      const dLng = dItem?.lng;

      setRouteOrigin(origId);
      setRouteOriginName(origName);
      if (origLat !== undefined && origLng !== undefined) {
        setRouteOriginCoords({ lat: origLat, lng: origLng });
      }

      setRouteDestination(dId);
      setRouteDestName(dName);
      if (dLat !== undefined && dLng !== undefined) {
        setRouteDestCoords({ lat: dLat, lng: dLng });
      }

      await handleCalculateRoute(
        { id: origId, name: origName, lat: origLat, lng: origLng },
        { id: dId, name: dName, lat: dLat, lng: dLng }
      );
    } catch (e) {
      console.error('Dual route execution error:', e);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Focus & highlight location selected from search bar
  const highlightAndFocusLocation = (loc: {
    id: string;
    name: string;
    categoryType: string;
    city?: string;
    state?: string;
    lat: number;
    lng: number;
    subtitle?: string;
  }) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const coords = parseLatLng(loc.lat, loc.lng);
    if (!coords) return;

    map.flyTo(coords, Math.max(map.getZoom(), 12), { duration: 1.2 });

    if (searchHighlightRef.current) {
      searchHighlightRef.current.clearLayers();

      const iconBg =
        loc.categoryType === 'station'
          ? '#0284c7'
          : loc.categoryType === 'heritage'
          ? '#ea580c'
          : loc.categoryType === 'city'
          ? '#6366f1'
          : '#10b981';
      const iconEmoji =
        loc.categoryType === 'station'
          ? '🚆'
          : loc.categoryType === 'heritage'
          ? '🏛️'
          : loc.categoryType === 'city'
          ? '🏙️'
          : '📍';

      const iconHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: ${iconBg}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="background-color: ${iconBg}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35); font-size: 18px; z-index: 2;">
            ${iconEmoji}
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

      const popupContent = `
        <div style="padding: 10px; min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 14px;">${iconEmoji}</span>
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${iconBg};">
              ${loc.categoryType}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3;">${loc.name}</h4>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 10px 0;">${loc.subtitle || `${loc.city || ''} ${loc.state || ''}`}</p>
          <div style="display: flex; gap: 6px;">
            <button id="btn-search-orig-${loc.id}" style="flex: 1; background: #0284c7; color: #fff; border: none; border-radius: 8px; padding: 7px 0; font-size: 11px; font-weight: 700; cursor: pointer;">
              🚩 Set Origin (A)
            </button>
            <button id="btn-search-dest-${loc.id}" style="flex: 1; background: #ea580c; color: #fff; border: none; border-radius: 8px; padding: 7px 0; font-size: 11px; font-weight: 700; cursor: pointer;">
              🎯 Set Dest (B)
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();

      marker.on('popupopen', () => {
        const btnOrig = document.getElementById(`btn-search-orig-${loc.id}`);
        if (btnOrig) {
          btnOrig.onclick = () => {
            setRouteOrigin(loc.id);
            setRouteOriginName(loc.name);
            setRouteOriginCoords({ lat: coords[0], lng: coords[1] });
            setIsRoutingOpen(true);
            setIsRoutePanelMinimized(false);
            if (routeDestination && routeDestination !== loc.id) {
              handleCalculateRoute(
                { id: loc.id, name: loc.name, lat: coords[0], lng: coords[1] },
                undefined
              );
            }
          };
        }

        const btnDst = document.getElementById(`btn-search-dest-${loc.id}`);
        if (btnDst) {
          btnDst.onclick = () => {
            setRouteDestination(loc.id);
            setRouteDestName(loc.name);
            setRouteDestCoords({ lat: coords[0], lng: coords[1] });
            setIsRoutingOpen(true);
            setIsRoutePanelMinimized(false);
            if (routeOrigin && routeOrigin !== loc.id) {
              handleCalculateRoute(
                undefined,
                { id: loc.id, name: loc.name, lat: coords[0], lng: coords[1] }
              );
            }
          };
        }
      });

      searchHighlightRef.current.addLayer(marker);
    }
  };

  // Route Studio Autocomplete Handlers
  const handleOriginSearch = async (val: string) => {
    setRouteOrigin(val);
    setRouteOriginName(val);
    if (!val.trim() || val.trim().length < 2) {
      setOriginSuggestions([]);
      setIsOriginSuggestOpen(false);
      return;
    }
    try {
      const results = await api.suggestLocations(val, 8);
      setOriginSuggestions(results);
      setIsOriginSuggestOpen(true);
    } catch {
      setOriginSuggestions([]);
    }
  };

  const handleSelectOriginSuggestion = (item: LocationSuggestion) => {
    setRouteOrigin(item.id);
    setRouteOriginName(item.name);
    setRouteOriginCoords({ lat: item.lat, lng: item.lng });
    setIsOriginSuggestOpen(false);

    if (routeDestination && routeDestination !== item.id) {
      handleCalculateRoute(
        { id: item.id, name: item.name, lat: item.lat, lng: item.lng },
        undefined
      );
    }
  };

  const handleDestSearch = async (val: string) => {
    setRouteDestination(val);
    setRouteDestName(val);
    if (!val.trim() || val.trim().length < 2) {
      setDestSuggestions([]);
      setIsDestSuggestOpen(false);
      return;
    }
    try {
      const results = await api.suggestLocations(val, 8);
      setDestSuggestions(results);
      setIsDestSuggestOpen(true);
    } catch {
      setDestSuggestions([]);
    }
  };

  const handleSelectDestSuggestion = (item: LocationSuggestion) => {
    setRouteDestination(item.id);
    setRouteDestName(item.name);
    setRouteDestCoords({ lat: item.lat, lng: item.lng });
    setIsDestSuggestOpen(false);

    if (routeOrigin && routeOrigin !== item.id) {
      handleCalculateRoute(
        undefined,
        { id: item.id, name: item.name, lat: item.lat, lng: item.lng }
      );
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

  const activeOption: any =
    activeRoute?.options?.find((o: any) => o.mode === selectedMode) || activeRoute?.options?.[0];

  return (
    <div className="space-y-4">
      {/* Top Map Toolbar: City Jumps & Layer Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        {/* City Quick Jumps */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" /> Jump:
          </span>
          {[
            { id: 'all-india', label: 'All India' },
            { id: 'mumbai', label: 'Mumbai' },
            { id: 'delhi', label: 'Delhi' },
            { id: 'jaipur', label: 'Jaipur' },
            { id: 'agra', label: 'Agra' },
            { id: 'kochi', label: 'Kochi' },
            { id: 'varanasi', label: 'Varanasi' },
            { id: 'goa', label: 'Goa' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => handleCityJump(c.id)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200 transition"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Layer Toggles & Route Studio Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showHeritage}
              onChange={(e) => setShowHeritage(e.target.checked)}
              className="accent-orange-600 rounded cursor-pointer"
            />
            <span>🏛️ Heritage ({heritageSites.length})</span>
          </label>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showStations}
              onChange={(e) => setShowStations(e.target.checked)}
              className="accent-sky-600 rounded cursor-pointer"
            />
            <span>🚆 Stations ({stations.length})</span>
          </label>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer">
            <input
              type="checkbox"
              checked={showSights}
              onChange={(e) => setShowSights(e.target.checked)}
              className="accent-emerald-600 rounded cursor-pointer"
            />
            <span>📍 Sights</span>
          </label>

          <button
            onClick={() => setIsRoutingOpen(!isRoutingOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
              isRoutingOpen
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route Studio</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 shadow-lg" style={{ height }}>
        {/* Leaflet Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Live Smart Search Bar Overlay (Responsive Top Left) */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:left-4 sm:top-4 z-[400] sm:w-80 md:w-96">
          <div className="relative shadow-md rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchSuggestions.length > 0 || searchQuery.trim().length >= 2) {
                  setIsSearchDropdownOpen(true);
                }
              }}
              placeholder="Search station, city, monument (e.g. srinagar to csmt)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-transparent text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none"
            />
            {isSearching && (
              <div className="absolute right-9 top-3 w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            )}
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchSuggestions([]);
                  setIsSearchDropdownOpen(false);
                  if (searchHighlightRef.current) searchHighlightRef.current.clearLayers();
                }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Results Dropdown */}
          {isSearchDropdownOpen && (dualQuery || searchSuggestions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[380px] overflow-y-auto z-[500] divide-y divide-slate-100">
              {/* Dual points quick route banner */}
              {dualQuery && (
                <div
                  onClick={() => handleExecuteDualRoute(dualQuery.originQuery, dualQuery.destQuery)}
                  className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white cursor-pointer hover:from-emerald-700 hover:to-teal-800 transition flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Navigation className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                        Calculate Route Path
                      </div>
                      <div className="text-xs font-bold truncate">
                        {dualQuery.originQuery} <span className="text-emerald-200">➔</span> {dualQuery.destQuery}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-lg shrink-0">
                    <span>Plot</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}

              {/* Suggestions List across all stations, monuments, tourist spots, and cities */}
              {searchSuggestions.map((item, idx) => (
                <div
                  key={`search-sugg-${item.categoryType || item.type || 'loc'}-${item.id}-${idx}`}
                  className="p-2.5 hover:bg-slate-50 transition flex items-center justify-between gap-2 group cursor-pointer"
                  onClick={() => {
                    highlightAndFocusLocation({
                      id: item.id,
                      name: item.name,
                      categoryType: item.categoryType || item.type || 'place',
                      lat: item.lat,
                      lng: item.lng,
                      subtitle: item.subtitle,
                      city: item.city,
                      state: item.state,
                    });
                    setIsSearchDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        item.type === 'station'
                          ? 'bg-sky-100 text-sky-700'
                          : item.type === 'heritage'
                          ? 'bg-orange-100 text-orange-700'
                          : item.type === 'city'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.type === 'station' ? (
                        <Train className="w-3.5 h-3.5" />
                      ) : item.type === 'heritage' ? (
                        <Landmark className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700 transition">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Origin / Destination Quick Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        setRouteOrigin(item.id);
                        setRouteOriginName(item.name);
                        setRouteOriginCoords({ lat: item.lat, lng: item.lng });
                        setIsRoutingOpen(true);
                        setIsRoutePanelMinimized(false);
                        setIsSearchDropdownOpen(false);
                        if (routeDestination && routeDestination !== item.id) {
                          handleCalculateRoute(
                            { id: item.id, name: item.name, lat: item.lat, lng: item.lng },
                            undefined
                          );
                        }
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition"
                      title="Set as Route Origin (Point A)"
                    >
                      Start
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRouteDestination(item.id);
                        setRouteDestName(item.name);
                        setRouteDestCoords({ lat: item.lat, lng: item.lng });
                        setIsRoutingOpen(true);
                        setIsRoutePanelMinimized(false);
                        setIsSearchDropdownOpen(false);
                        if (routeOrigin && routeOrigin !== item.id) {
                          handleCalculateRoute(
                            undefined,
                            { id: item.id, name: item.name, lat: item.lat, lng: item.lng }
                          );
                        }
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition"
                      title="Set as Route Destination (Point B)"
                    >
                      Dest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive In-Map Route Panel: Mobile Bottom Sheet / Desktop Floating Side Panel */}
        {isRoutingOpen && (
          <div
            className={`absolute inset-x-0 bottom-0 z-[450] md:inset-auto md:top-4 md:right-4 md:w-96 bg-white/98 md:bg-white/95 backdrop-blur-md rounded-t-3xl md:rounded-3xl border-t md:border border-slate-200 shadow-2xl flex flex-col transition-all duration-300 ${
              isRoutePanelMinimized
                ? 'max-h-[60px] overflow-hidden'
                : 'max-h-[72%] sm:max-h-[75%] md:max-h-[calc(100%-32px)]'
            }`}
          >
            {/* Drag/Swipe Indicator for Mobile */}
            <div
              onClick={() => setIsRoutePanelMinimized(!isRoutePanelMinimized)}
              className="w-full pt-2.5 pb-1 flex justify-center md:hidden cursor-pointer touch-manipulation"
              title={isRoutePanelMinimized ? "Tap to expand Route Engine" : "Tap to minimize Route Engine"}
            >
              <div className="w-10 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3 border-b border-slate-100 shrink-0">
              <div
                onClick={() => setIsRoutePanelMinimized(!isRoutePanelMinimized)}
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer md:cursor-default"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    In-Map Route Engine
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                    {isRoutePanelMinimized && activeOption
                      ? `${formatDurationDisplay(activeOption.duration_minutes || activeOption.duration_mins, activeOption.duration_formatted)} • ${activeOption.distance_km} km • ₹${activeOption.estimated_fare ?? 0}`
                      : 'Calculate distance, fare & real paths'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                {/* Mobile Minimize / Expand Toggle */}
                <button
                  type="button"
                  onClick={() => setIsRoutePanelMinimized(!isRoutePanelMinimized)}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label={isRoutePanelMinimized ? "Expand Route Engine" : "Minimize Route Engine"}
                  title={isRoutePanelMinimized ? "Expand Route Engine" : "Minimize to view map"}
                >
                  {isRoutePanelMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsRoutingOpen(false);
                    setIsRoutePanelMinimized(false);
                  }}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Close Route Engine"
                  title="Close Route Engine"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body (Hidden when minimized) */}
            {!isRoutePanelMinimized && (
              <div className="overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4 flex-1">
                {/* Origin & Destination Inputs with Swap & Autocomplete Dropdowns */}
                <div className="space-y-2.5">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <span>🚩</span> Origin (Point A)
                      </label>
                      {(routeOrigin || routeOriginName) && (
                        <button
                          type="button"
                          onClick={() => {
                            setRouteOrigin('');
                            setRouteOriginName('');
                            setRouteOriginCoords(null);
                            setOriginSuggestions([]);
                            setIsOriginSuggestOpen(false);
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={routeOriginName || routeOrigin}
                      onChange={(e) => handleOriginSearch(e.target.value)}
                      onFocus={() => {
                        if (originSuggestions.length > 0) setIsOriginSuggestOpen(true);
                      }}
                      placeholder="Type station (e.g. Srinagar, CSMT), city, heritage..."
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />

                    {/* Origin Suggestions Dropdown */}
                    {isOriginSuggestOpen && originSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-48 overflow-y-auto z-[550] divide-y divide-slate-100">
                        {originSuggestions.map((item, idx) => (
                          <div
                            key={`orig-sugg-${item.categoryType || item.type || 'loc'}-${item.id}-${idx}`}
                            onClick={() => handleSelectOriginSuggestion(item)}
                            className="p-2 hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                item.type === 'station'
                                  ? 'bg-sky-100 text-sky-700'
                                  : item.type === 'heritage'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {item.type === 'station' ? (
                                <Train className="w-3 h-3" />
                              ) : item.type === 'heritage' ? (
                                <Landmark className="w-3 h-3" />
                              ) : (
                                <MapPin className="w-3 h-3" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-800 truncate">{item.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{item.subtitle}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swap Origin & Destination Button */}
                  <div className="flex justify-center -my-1">
                    <button
                      type="button"
                      onClick={handleSwapPoints}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition shadow-2xs flex items-center gap-1 text-[10px] font-bold px-2.5"
                      title="Swap Origin and Destination"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      <span>Swap</span>
                    </button>
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <span>🎯</span> Destination (Point B)
                      </label>
                      {(routeDestination || routeDestName) && (
                        <button
                          type="button"
                          onClick={() => {
                            setRouteDestination('');
                            setRouteDestName('');
                            setRouteDestCoords(null);
                            setDestSuggestions([]);
                            setIsDestSuggestOpen(false);
                          }}
                          className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={routeDestName || routeDestination}
                      onChange={(e) => handleDestSearch(e.target.value)}
                      onFocus={() => {
                        if (destSuggestions.length > 0) setIsDestSuggestOpen(true);
                      }}
                      placeholder="Type destination station, city, tourist place..."
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />

                    {/* Destination Suggestions Dropdown */}
                    {isDestSuggestOpen && destSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-48 overflow-y-auto z-[550] divide-y divide-slate-100">
                        {destSuggestions.map((item, idx) => (
                          <div
                            key={`dest-sugg-${item.categoryType || item.type || 'loc'}-${item.id}-${idx}`}
                            onClick={() => handleSelectDestSuggestion(item)}
                            className="p-2 hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                                item.type === 'station'
                                  ? 'bg-sky-100 text-sky-700'
                                  : item.type === 'heritage'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {item.type === 'station' ? (
                                <Train className="w-3 h-3" />
                              ) : item.type === 'heritage' ? (
                                <Landmark className="w-3 h-3" />
                              ) : (
                                <MapPin className="w-3 h-3" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-800 truncate">{item.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{item.subtitle}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mode Selectors */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Transport Mode
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                    {[
                      { mode: 'DRIVE' as TransportMode, label: 'Taxi', icon: Car },
                      { mode: 'TRANSIT' as TransportMode, label: 'Train', icon: Train },
                      { mode: 'WALK' as TransportMode, label: 'Walk', icon: Footprints },
                      { mode: 'BICYCLE' as TransportMode, label: 'Cycle', icon: Bike },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = selectedMode === m.mode;
                      return (
                        <button
                          key={m.mode}
                          type="button"
                          onClick={() => setSelectedMode(m.mode)}
                          className={`min-h-[44px] py-2 px-1 rounded-xl text-[11px] sm:text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                            isSelected
                              ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/90'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCalculateRoute()}
                    disabled={isCalculatingRoute}
                    className="flex-1 min-h-[44px] py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 touch-manipulation"
                  >
                    <Navigation className="w-4 h-4 shrink-0" />
                    <span>{isCalculatingRoute ? 'Tracing Route...' : 'Plot Route on Map'}</span>
                  </button>

                  {activeRoute && (
                    <button
                      type="button"
                      onClick={handleClearRoute}
                      className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shrink-0"
                      title="Clear Route and Polyline"
                      aria-label="Clear Route"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {routeError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {routeError}
                  </div>
                )}

                {/* Active Route Summary Result Cards */}
                {activeOption && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    {/* Header with Title & Provider */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-900 truncate">
                          {activeOption.title || `${selectedMode} Route`}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {activeOption.provider || 'Indian Transit Engine'}
                        </div>
                      </div>
                      {activeOption.speed_tier && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800">
                          {activeOption.speed_tier}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                      <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Duration</div>
                        <div className="text-xs sm:text-sm md:text-base font-black text-slate-900 font-mono mt-0.5">
                          {formatDurationDisplay(activeOption.duration_minutes || activeOption.duration_mins, activeOption.duration_formatted)}
                        </div>
                      </div>
                      <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Distance</div>
                        <div className="text-xs sm:text-sm md:text-base font-black text-slate-900 font-mono mt-0.5">
                          {activeOption.distance_km} km
                        </div>
                      </div>
                      <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fare</div>
                        <div className="text-xs sm:text-sm md:text-base font-black text-emerald-600 font-mono mt-0.5">
                          {activeOption.estimated_fare === 0
                            ? 'Free'
                            : activeOption.estimated_fare !== null && activeOption.estimated_fare !== undefined
                            ? `₹${activeOption.estimated_fare}`
                            : 'Pass'}
                        </div>
                      </div>
                    </div>

                    {/* Authentic Railway Alignment Badge */}
                    {activeOption.railway_corridor && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <Train className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>Track Corridor: {activeOption.railway_corridor}</span>
                        </div>
                        {activeOption.railway_stops && activeOption.railway_stops.length > 0 && (
                          <div className="text-[11px] text-amber-800 leading-snug">
                            Key Junctions: {activeOption.railway_stops.join(' → ')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fare / Tariff note */}
                    {activeOption.fare_note && (
                      <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                        {activeOption.fare_note}
                      </div>
                    )}

                    {/* Verify & Compare with Google Maps button */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(routeOriginName || routeOrigin)}&destination=${encodeURIComponent(routeDestName || routeDestination)}&travelmode=${selectedMode === 'TRANSIT' ? 'transit' : selectedMode === 'WALK' ? 'walking' : selectedMode === 'BICYCLE' ? 'bicycling' : 'driving'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition shadow-2xs touch-manipulation"
                      title="Open same origin & destination on Google Maps to verify railway alignment"
                    >
                      <span>Verify & Compare on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>

                    {/* Quick minimize helper on mobile to inspect polyline */}
                    <div className="flex items-center justify-between pt-1 md:hidden">
                      <button
                        type="button"
                        onClick={() => setIsRoutePanelMinimized(true)}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      >
                        <span>Minimize to inspect polyline on map</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Steps summary */}
                    {activeOption.steps_summary && activeOption.steps_summary.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                          Route Stages & Guidance
                        </div>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {activeOption.steps_summary.map((step: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed bg-white p-2 rounded-xl border border-slate-100">
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="flex-1 break-words">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Floating Quick Route Button when panel is closed */}
        {!isRoutingOpen && (
          <button
            type="button"
            onClick={() => {
              setIsRoutingOpen(true);
              setIsRoutePanelMinimized(false);
            }}
            className="md:hidden absolute bottom-4 right-4 z-[400] flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl border border-emerald-500/50 active:scale-95 transition"
            aria-label="Open In-Map Route Engine"
          >
            <Navigation className="w-4 h-4" />
            <span>Route Engine</span>
          </button>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs z-[1000] flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-800 font-bold">Plotting India Heritage & Rail Network...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
