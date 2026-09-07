import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Compass,
  ChevronRight,
  Landmark,
  Layers,
  RotateCcw,
  Sparkles,
  Map as MapIcon,
  Globe2,
  Navigation
} from 'lucide-react';

export interface MapPinData {
  id: string;
  name: string;
  type: 'state' | 'town';
  stateId: string;
  townId?: string;
  stateName: string;
  region: string;
  iconicPlace: string;
  lat: number;
  lng: number;
  thumbnail: string;
}

export const INDIA_PINS: MapPinData[] = [
  // North
  {
    id: 'ladakh',
    name: 'Ladakh (Leh & Nubra)',
    type: 'state',
    stateId: 'ladakh',
    stateName: 'Ladakh',
    region: 'Northern India',
    iconicPlace: 'Pangong Tso & Leh Palace',
    lat: 34.1526,
    lng: 77.5771,
    thumbnail: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'kashmir',
    name: 'Kashmir (Srinagar & Gulmarg)',
    type: 'state',
    stateId: 'jammu-and-kashmir',
    stateName: 'Jammu and Kashmir',
    region: 'Northern India',
    iconicPlace: 'Dal Lake & Thajiwas Glacier',
    lat: 34.0837,
    lng: 74.7973,
    thumbnail: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'himachal',
    name: 'Himachal (Spiti & Kaza)',
    type: 'town',
    stateId: 'himachal-pradesh',
    townId: 'kaza',
    stateName: 'Himachal Pradesh',
    region: 'Northern India',
    iconicPlace: 'Key Monastery & Spiti Valley',
    lat: 32.2276,
    lng: 78.0076,
    thumbnail: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'punjab',
    name: 'Punjab (Amritsar)',
    type: 'town',
    stateId: 'punjab',
    townId: 'amritsar',
    stateName: 'Punjab',
    region: 'Northern India',
    iconicPlace: 'Sri Harmandir Sahib (Golden Temple)',
    lat: 31.62,
    lng: 74.8765,
    thumbnail: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand (Rishikesh & Garhwal)',
    type: 'state',
    stateId: 'uttarakhand',
    stateName: 'Uttarakhand',
    region: 'Northern India',
    iconicPlace: 'Kedarnath Sanctum & Ganga Aarti',
    lat: 30.0869,
    lng: 78.2676,
    thumbnail: 'https://images.unsplash.com/photo-1588096344356-9b552d431057?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'delhi',
    name: 'Delhi NCR (Capital Region)',
    type: 'state',
    stateId: 'delhi',
    stateName: 'Delhi (NCT)',
    region: 'Northern India',
    iconicPlace: 'Red Fort & Qutub Minar',
    lat: 28.6562,
    lng: 77.241,
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1280px-Delhi_fort.jpg',
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan (Jaipur & Amer)',
    type: 'state',
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    region: 'Northern India',
    iconicPlace: 'Amber Fort, Hawa Mahal & Mehrangarh',
    lat: 26.9124,
    lng: 75.7873,
    thumbnail: 'https://images.unsplash.com/photo-1609137144822-0a1215b4976c?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh (Agra & Varanasi)',
    type: 'state',
    stateId: 'uttar-pradesh',
    stateName: 'Uttar Pradesh',
    region: 'Northern India',
    iconicPlace: 'Taj Mahal & Kashi Vishwanath',
    lat: 27.1751,
    lng: 78.0421,
    thumbnail: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&auto=format&fit=crop&q=80',
  },
  // West
  {
    id: 'gujarat',
    name: 'Gujarat (Patan & Rani ki Vav)',
    type: 'town',
    stateId: 'gujarat',
    townId: 'patan',
    stateName: 'Gujarat',
    region: 'Western India',
    iconicPlace: "Rani ki Vav (Queen's Stepwell)",
    lat: 23.8589,
    lng: 72.1016,
    thumbnail: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra (Ajanta & Mumbai)',
    type: 'state',
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    region: 'Western India',
    iconicPlace: 'Ajanta & Ellora Caves & Gateway of India',
    lat: 19.8762,
    lng: 75.3433,
    thumbnail: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'goa',
    name: 'Goa (Old Goa & Panaji)',
    type: 'town',
    stateId: 'goa',
    townId: 'old-goa-velha-goa',
    stateName: 'Goa',
    region: 'Western India',
    iconicPlace: 'Basilica of Bom Jesus & Mandovi Coast',
    lat: 15.5039,
    lng: 73.9118,
    thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop&q=80',
  },
  // Central
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh (Khajuraho & Sanchi)',
    type: 'state',
    stateId: 'madhya-pradesh',
    stateName: 'Madhya Pradesh',
    region: 'Central India',
    iconicPlace: 'Khajuraho Temples & Great Sanchi Stupa',
    lat: 24.8515,
    lng: 79.9215,
    thumbnail: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=500&auto=format&fit=crop&q=80',
  },
  // East
  {
    id: 'bihar',
    name: 'Bihar (Bodh Gaya & Nalanda)',
    type: 'town',
    stateId: 'bihar',
    townId: 'bodh-gaya',
    stateName: 'Bihar',
    region: 'Eastern India',
    iconicPlace: 'Mahabodhi Temple & Nalanda Ancient University',
    lat: 24.696,
    lng: 84.9913,
    thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'west-bengal',
    name: 'West Bengal (Bishnupur & Kolkata)',
    type: 'town',
    stateId: 'west-bengal',
    townId: 'bishnupur',
    stateName: 'West Bengal',
    region: 'Eastern India',
    iconicPlace: 'Terracotta Temples of Bishnupur & Victoria Memorial',
    lat: 23.0678,
    lng: 87.3168,
    thumbnail: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'odisha',
    name: 'Odisha (Konark Sun Temple)',
    type: 'town',
    stateId: 'odisha',
    townId: 'konark',
    stateName: 'Odisha',
    region: 'Eastern India',
    iconicPlace: 'Black Pagoda Sun Temple & Puri Jagannath',
    lat: 19.8876,
    lng: 86.0945,
    thumbnail: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=500&auto=format&fit=crop&q=80',
  },
  // South
  {
    id: 'karnataka',
    name: 'Karnataka (Hampi & Badami)',
    type: 'town',
    stateId: 'karnataka',
    townId: 'hampi',
    stateName: 'Karnataka',
    region: 'Southern India',
    iconicPlace: 'Vijayanagara Stone Chariot & Virupaksha',
    lat: 15.335,
    lng: 76.46,
    thumbnail: 'https://images.unsplash.com/photo-1600100397608-f010f443b780?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh (Lepakshi & Tirupati)',
    type: 'town',
    stateId: 'andhra-pradesh',
    townId: 'lepakshi',
    stateName: 'Andhra Pradesh',
    region: 'Southern India',
    iconicPlace: 'Veerabhadra Temple Hanging Pillar & Tirumala',
    lat: 13.8052,
    lng: 77.6074,
    thumbnail: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'telangana',
    name: 'Telangana (Hyderabad & Warangal)',
    type: 'state',
    stateId: 'telangana',
    stateName: 'Telangana',
    region: 'Southern India',
    iconicPlace: 'Charminar & Ramappa UNESCO Temple',
    lat: 17.3616,
    lng: 78.4747,
    thumbnail: 'https://images.unsplash.com/photo-1572917711467-f376cfbcfe98?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu (Thanjavur & Madurai)',
    type: 'state',
    stateId: 'tamil-nadu',
    stateName: 'Tamil Nadu',
    region: 'Southern India',
    iconicPlace: 'Brihadisvara & Meenakshi Amman Gopurams',
    lat: 10.7828,
    lng: 79.1318,
    thumbnail: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'kerala',
    name: 'Kerala (Kochi & Wayanad)',
    type: 'state',
    stateId: 'kerala',
    stateName: 'Kerala',
    region: 'Southern India',
    iconicPlace: 'Fort Kochi Chinese Nets & Backwaters',
    lat: 9.9656,
    lng: 76.2421,
    thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=80',
  },
  // Northeast
  {
    id: 'assam',
    name: 'Assam (Majuli & Kaziranga)',
    type: 'town',
    stateId: 'assam',
    townId: 'majuli',
    stateName: 'Assam',
    region: 'Northeastern India',
    iconicPlace: 'Majuli River Island & Kaziranga Rhinos',
    lat: 26.9535,
    lng: 94.2188,
    thumbnail: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya (Cherrapunji & Shillong)',
    type: 'town',
    stateId: 'meghalaya',
    townId: 'cherrapunji-sohra',
    stateName: 'Meghalaya',
    region: 'Northeastern India',
    iconicPlace: 'Double Decker Living Root Bridges & Nohkalikai',
    lat: 25.2986,
    lng: 91.7314,
    thumbnail: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'sikkim',
    name: 'Sikkim (Gangtok & Kanchenjunga)',
    type: 'state',
    stateId: 'sikkim',
    stateName: 'Sikkim',
    region: 'Northeastern India',
    iconicPlace: 'Rumtek Monastery & Kanchenjunga Biosphere',
    lat: 27.3389,
    lng: 88.6065,
    thumbnail: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'tripura',
    name: 'Tripura (Unakoti Rock Carvings)',
    type: 'town',
    stateId: 'tripura',
    townId: 'unakoti-kailashahar',
    stateName: 'Tripura',
    region: 'Northeastern India',
    iconicPlace: 'Colossal Shiva Rock-Relief Sculptures',
    lat: 24.3167,
    lng: 92.0167,
    thumbnail: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'andaman',
    name: 'Andaman & Nicobar Islands',
    type: 'state',
    stateId: 'andaman-and-nicobar-islands',
    stateName: 'Andaman & Nicobar',
    region: 'Island Territories',
    iconicPlace: 'Cellular Jail & Radhanagar Coral Bay',
    lat: 11.6738,
    lng: 92.7479,
    thumbnail: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=500&auto=format&fit=crop&q=80',
  },
];

interface ExploreIndiaMapProps {
  onSelectState: (stateId: string) => void;
  onSelectTown?: (stateId: string, townId: string) => void;
}

export const ExploreIndiaMap: React.FC<ExploreIndiaMapProps> = ({
  onSelectState,
  onSelectTown,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activePin, setActivePin] = useState<MapPinData>(INDIA_PINS[6]); // Default to Rajasthan
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [mapTileStyle, setMapTileStyle] = useState<'voyager' | 'satellite'>('voyager');
  const [isMapReady, setIsMapReady] = useState(false);

  const tileUrls = {
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const tileAttributions = {
    voyager: '&copy; OpenStreetMap &copy; CARTO',
    satellite: '&copy; Esri World Imagery, USGS',
  };

  // Region bounds coordinates for quick flying
  const regionCoordinates: Record<string, { center: [number, number]; zoom: number }> = {
    All: { center: [22.8, 79.6], zoom: 4.8 },
    'Northern India': { center: [29.5, 77.0], zoom: 6 },
    'Southern India': { center: [13.0, 77.5], zoom: 6 },
    'Western India': { center: [20.5, 74.0], zoom: 6 },
    'Eastern India': { center: [22.5, 86.0], zoom: 6 },
    'Central India': { center: [23.5, 78.5], zoom: 6.5 },
    'Northeastern India': { center: [26.0, 92.5], zoom: 6.5 },
    'Island Territories': { center: [11.6, 92.7], zoom: 7 },
  };

  // Initialize Real Leaflet Map of India
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Map cleanup error:', e);
      }
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [22.8, 79.6],
        zoom: 4.8,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const baseTile = L.tileLayer(tileUrls[mapTileStyle], {
        attribution: tileAttributions[mapTileStyle],
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = baseTile;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      mapInstanceRef.current = map;
      setIsMapReady(true);
    } catch (err) {
      console.error('Failed to init explore India map:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Map cleanup error:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update base tile when mapTileStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    try {
      map.removeLayer(tileLayerRef.current);
      const newTile = L.tileLayer(tileUrls[mapTileStyle], {
        attribution: tileAttributions[mapTileStyle],
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = newTile;
    } catch (err) {
      console.warn('Error updating tile layer:', err);
    }
  }, [mapTileStyle]);

  // Update Markers on the Real Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filteredPins =
      selectedRegion === 'All'
        ? INDIA_PINS
        : INDIA_PINS.filter((p) => p.region === selectedRegion);

    filteredPins.forEach((pin) => {
      const isSelected = activePin.id === pin.id;
      const isTown = pin.type === 'town';

      const iconHtml = `
        <div style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          ${
            isSelected
              ? `<div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: rgba(255, 103, 31, 0.25); border: 2px solid #FF671F; animation: pulse 1.8s infinite;"></div>`
              : ''
          }
          <div style="
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            border-radius: 50%;
            background: ${isSelected ? '#FF671F' : isTown ? '#059669' : '#0B192C'};
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: bold;
            transition: transform 0.2s;
          ">
            ${isTown ? '🏛' : '📍'}
          </div>
          <div style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 2px;
            background: rgba(11, 25, 44, 0.9);
            color: #FFFFFF;
            padding: 1px 6px;
            border-radius: 6px;
            font-size: 9px;
            font-weight: 700;
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            border: 1px solid rgba(255,255,255,0.15);
          ">
            ${pin.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'explore-india-pin',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon: customIcon }).addTo(markersGroup);

      marker.on('click', () => {
        setActivePin(pin);
        map.flyTo([pin.lat, pin.lng], 7.5, { duration: 1.1 });
      });
    });
  }, [selectedRegion, activePin, isMapReady]);

  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    const target = regionCoordinates[reg] || regionCoordinates.All;
    if (mapInstanceRef.current && target) {
      mapInstanceRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
    }
  };

  const handleResetView = () => {
    setSelectedRegion('All');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.8, 79.6], 4.8, { duration: 1.0 });
    }
  };

  const handleExploreAction = () => {
    if (activePin.type === 'town' && activePin.townId && onSelectTown) {
      onSelectTown(activePin.stateId, activePin.townId);
    } else {
      onSelectState(activePin.stateId);
    }
  };

  const regionsList = [
    'All',
    'Northern India',
    'Southern India',
    'Western India',
    'Eastern India',
    'Central India',
    'Northeastern India',
    'Island Territories',
  ];

  return (
    <div className="bg-[#FCFBF9] rounded-3xl border border-[#EFE8DF] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF671F] uppercase tracking-wider mb-1">
            <Globe2 className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Accurate Real World GIS &amp; Political Subcontinent Map</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Explore India — Geographic &amp; Heritage Map
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real satellite &amp; street cartography mapped with authentic coordinates of India&apos;s 36 States, Union Territories, &amp; Heritage Towns
          </p>
        </div>

        {/* Tile Switcher & Reset Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-stone-200/80 p-0.5 rounded-full text-xs">
            <button
              onClick={() => setMapTileStyle('voyager')}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
                mapTileStyle === 'voyager'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Street Map
            </button>
            <button
              onClick={() => setMapTileStyle('satellite')}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
                mapTileStyle === 'satellite'
                  ? 'bg-[#0B192C] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Satellite Real
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer"
            title="Reset India View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Reset India</span>
          </button>
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
          Zone:
        </span>
        {regionsList.map((reg) => (
          <button
            key={reg}
            onClick={() => handleRegionChange(reg)}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition cursor-pointer ${
              selectedRegion === reg
                ? 'bg-[#FF671F] text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            {reg} {reg === 'All' ? `(${INDIA_PINS.length})` : ''}
          </button>
        ))}
      </div>

      {/* Map + Detail Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left: Real World Leaflet Map Canvas */}
        <div className="w-full lg:w-3/5">
          <div className="relative w-full h-[450px] sm:h-[500px] rounded-2xl bg-stone-100 border border-[#E7DFD5] overflow-hidden shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Map Status Overlays */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1.5">
              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold text-stone-800">
                  Real Geographic Coordinates Active
                </span>
              </div>
            </div>

            {/* Map Legend on Canvas */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-stone-200 text-[10px] text-stone-700 font-medium shadow-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0B192C]" />
                State / Territory
              </span>
              <span className="flex items-center gap-1 ml-2">
                <span className="w-2 h-2 rounded-full bg-[#059669]" />
                Heritage Town
              </span>
              <span className="flex items-center gap-1 ml-2">
                <span className="w-2 h-2 rounded-full bg-[#FF671F]" />
                Selected
              </span>
            </div>

            <button
              onClick={handleResetView}
              className="absolute bottom-3 right-3 z-10 bg-white/95 hover:bg-white text-stone-700 p-2 rounded-xl shadow-md border border-stone-200 transition cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              title="Reset India View"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FF671F]" />
              <span className="hidden sm:inline">Recenter</span>
            </button>
          </div>
        </div>

        {/* Right: Active Pin Highlight Dossier Card */}
        <div className="w-full lg:w-2/5 flex flex-col justify-between">
          <div className="bg-white rounded-2xl border border-[#EFE8DF] overflow-hidden shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-stone-100 group">
                <img
                  src={activePin.thumbnail}
                  alt={activePin.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FF671F] text-white shadow-xs">
                    {activePin.region}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-medium text-stone-200 uppercase tracking-wider">
                    {activePin.type === 'town' ? 'Heritage Cultural Town' : 'Indian State / Union Territory'}
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-0.5 text-white">
                    {activePin.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-3.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F]">
                    Iconic Heritage &amp; Cultural Landmark
                  </span>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5">
                    {activePin.iconicPlace}
                  </p>
                </div>

                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  {activePin.type === 'town'
                    ? `Explore verified archaeological sanctuaries, craft traditions, and architectural monuments preserved in ${activePin.name}.`
                    : `Discover historic cities, temple complexes, wildlife sanctuaries, and artisan corridors across ${activePin.stateName}.`}
                </p>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-[11px] font-mono text-stone-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
                    Coordinates
                  </span>
                  <span className="font-semibold text-stone-900">
                    {activePin.lat.toFixed(4)}° N, {activePin.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={handleExploreAction}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <span>
                  {activePin.type === 'town'
                    ? `Explore ${activePin.name.split(' ')[0]} Places`
                    : `Explore ${activePin.stateName} Towns & Gems`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
