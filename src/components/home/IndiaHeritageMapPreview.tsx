import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Map,
  MapPin,
  ExternalLink,
  Layers,
  RotateCcw,
  Compass,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

export interface HeritageHubPin {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  category: string;
  unesco: boolean;
  image: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'Northeast';
  description: string;
}

const REAL_HERITAGE_HUBS: HeritageHubPin[] = [
  {
    id: 'red-fort',
    name: 'Red Fort (Lal Qila)',
    city: 'Old Delhi',
    state: 'Delhi (NCT)',
    lat: 28.6562,
    lng: 77.241,
    category: 'Mughal Citadel & UNESCO Heritage',
    unesco: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1280px-Delhi_fort.jpg',
    region: 'North',
    description: 'Vast 17th-century red sandstone fortress palace by Emperor Shah Jahan, symbol of Indian national sovereignty.',
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    city: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1751,
    lng: 78.0421,
    category: 'Mughal Mausoleum & UNESCO Wonder',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    region: 'North',
    description: 'Pietra-dura ivory-white marble mausoleum on the Yamuna river, universal masterpiece of Mughal symmetry.',
  },
  {
    id: 'amber-palace',
    name: 'Amber Palace & Fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9855,
    lng: 75.8513,
    category: 'Hill Forts of Rajasthan (UNESCO)',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1603288967527-24861e6878b3?w=800&auto=format&fit=crop&q=80',
    region: 'North',
    description: 'Opulent hilltop fortress with Sheesh Mahal mirror palace overlooking Maota Lake in the Aravalli hills.',
  },
  {
    id: 'hampi-monuments',
    name: 'Hampi & Virupaksha Temple',
    city: 'Hampi',
    state: 'Karnataka',
    lat: 15.335,
    lng: 76.46,
    category: 'Vijayanagara Ruins (UNESCO)',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b780?w=800&auto=format&fit=crop&q=80',
    region: 'South',
    description: 'Breathtaking granite boulder empire with 1,600 surviving monuments, stone chariot, and Tungabhadra riverfront.',
  },
  {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 18.922,
    lng: 72.8347,
    category: 'Indo-Saracenic Basalt Monument',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    region: 'West',
    description: 'Grand 26m yellow basalt arch on Mumbai Harbour, ceremonial entrance to India facing the Arabian Sea.',
  },
  {
    id: 'sun-temple-konark',
    name: 'Sun Temple Konark',
    city: 'Konark',
    state: 'Odisha',
    lat: 19.8876,
    lng: 86.0945,
    category: 'Kalinga Sun Chariot (UNESCO)',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
    region: 'East',
    description: 'Colossal 13th-century stone chariot with 24 intricately carved sun wheels pulled by seven mythical horses.',
  },
  {
    id: 'kashi-vishwanath-corridor',
    name: 'Kashi Vishwanath & Ganga Ghats',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3109,
    lng: 83.0107,
    category: 'Sacred Jyotirlinga & Ghats',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&auto=format&fit=crop&q=80',
    region: 'North',
    description: 'One of the world’s oldest living cities, spiritual sanctum on the holy Ganges with eternal evening Ganga Aarti.',
  },
  {
    id: 'meenakshi-temple',
    name: 'Meenakshi Amman Temple',
    city: 'Madurai',
    state: 'Tamil Nadu',
    lat: 9.9195,
    lng: 78.1193,
    category: 'Dravidian Gopuram Architecture',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
    region: 'South',
    description: 'Spectacular 14 multihued sculptured gopurams reaching 52 meters, housing thousands of mythological stone deities.',
  },
  {
    id: 'golden-temple',
    name: 'Sri Harmandir Sahib (Golden Temple)',
    city: 'Amritsar',
    state: 'Punjab',
    lat: 31.62,
    lng: 74.8765,
    category: 'Sacred Sikh Sanctum & Sarovar',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&auto=format&fit=crop&q=80',
    region: 'North',
    description: 'Gilded gurdwara floating amidst the Amrit Sarovar sacred pool, world-renowned for communal harmony and langar.',
  },
  {
    id: 'ajanta-caves',
    name: 'Ajanta & Ellora Rock Caves',
    city: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    lat: 20.5519,
    lng: 75.7033,
    category: 'Rock-Cut Cave Sanctuaries (UNESCO)',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1600100397608-f010e422a59e?w=800&auto=format&fit=crop&q=80',
    region: 'West',
    description: 'Ancient 2nd-century BCE rock-cut monasteries with exquisite Buddhist murals and the monolithic Kailash temple.',
  },
  {
    id: 'khajuraho-monuments',
    name: 'Khajuraho Group of Monuments',
    city: 'Khajuraho',
    state: 'Madhya Pradesh',
    lat: 24.8515,
    lng: 79.9215,
    category: 'Nagara Temple Sculptures (UNESCO)',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1609137144822-0a1215b4976c?w=800&auto=format&fit=crop&q=80',
    region: 'Central',
    description: 'Medieval Chandela dynasty sandstone temples celebrated for architectural brilliance and symbolic sculptural panels.',
  },
  {
    id: 'victoria-memorial',
    name: 'Victoria Memorial Hall',
    city: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5448,
    lng: 88.3426,
    category: 'White Makrana Marble Hall',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80',
    region: 'East',
    description: 'Monumental British-era white marble building blending British, Mughal, and Venetian architectural styles on the Maidan.',
  },
  {
    id: 'charminar',
    name: 'Charminar',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3616,
    lng: 78.4747,
    category: 'Qutb Shahi Four-Minaret Landmark',
    unesco: false,
    image: 'https://images.unsplash.com/photo-1572917711467-f376cfbcfe98?w=800&auto=format&fit=crop&q=80',
    region: 'South',
    description: '1591 CE Indo-Islamic square structure with four grand 56-meter minarets towering over Hyderabad’s bustling Laad Bazaar.',
  },
  {
    id: 'rani-ki-vav',
    name: 'Rani ki Vav (The Queen’s Stepwell)',
    city: 'Patan',
    state: 'Gujarat',
    lat: 23.8589,
    lng: 72.1016,
    category: 'Subterranean Stepwell (UNESCO)',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1609137144822-0a1215b4976c?w=800&auto=format&fit=crop&q=80',
    region: 'West',
    description: 'Subterranean stepwell sanctuary on Saraswati River designed as an inverted temple with seven levels of 500+ master sculptures.',
  },
  {
    id: 'kaziranga',
    name: 'Kaziranga Sanctuary',
    city: 'Golaghat & Nagaon',
    state: 'Assam',
    lat: 26.5775,
    lng: 93.1711,
    category: 'Brahmaputra Biosphere (UNESCO)',
    unesco: true,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    region: 'Northeast',
    description: 'Floodplain wilderness harboring the world’s largest population of great Indian one-horned rhinoceroses and wild water buffalo.',
  },
];

interface IndiaHeritageMapPreviewProps {
  onSelectPlace?: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const IndiaHeritageMapPreview: React.FC<IndiaHeritageMapPreviewProps> = ({
  onSelectPlace,
  onNavigateTab,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [selectedHub, setSelectedHub] = useState<HeritageHubPin>(REAL_HERITAGE_HUBS[0]);
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [mapStyle, setMapStyle] = useState<'voyager' | 'satellite'>('voyager');
  const [isMapReady, setIsMapReady] = useState(false);

  const tileUrls = {
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  const tileAttributions = {
    voyager: '&copy; OpenStreetMap &copy; CARTO',
    satellite: '&copy; Esri World Imagery, USGS',
  };

  // Initialize Real Leaflet Map
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
      // Center on India geographic center
      const map = L.map(mapContainerRef.current, {
        center: [22.8, 79.6],
        zoom: 4.8,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      // Add zoom control top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Base Tile Layer
      const baseTile = L.tileLayer(tileUrls[mapStyle], {
        attribution: tileAttributions[mapStyle],
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = baseTile;

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      mapInstanceRef.current = map;
      setIsMapReady(true);
    } catch (err) {
      console.error('Failed to init real India map preview:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Cleanup warning:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update base tile when mapStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    try {
      map.removeLayer(tileLayerRef.current);
      const newTile = L.tileLayer(tileUrls[mapStyle], {
        attribution: tileAttributions[mapStyle],
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);
      tileLayerRef.current = newTile;
    } catch (err) {
      console.warn('Error switching tile layer:', err);
    }
  }, [mapStyle]);

  // Update real monument markers on the map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filtered =
      activeRegion === 'All'
        ? REAL_HERITAGE_HUBS
        : REAL_HERITAGE_HUBS.filter((h) => h.region === activeRegion);

    filtered.forEach((hub) => {
      const isSelected = selectedHub.id === hub.id;

      const iconHtml = `
        <div style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          ${
            isSelected
              ? `<div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: rgba(255, 103, 31, 0.25); border: 1.5px solid #FF671F; animation: pulse 1.8s infinite;"></div>`
              : ''
          }
          <div style="
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            border-radius: 50%;
            background: ${isSelected ? '#FF671F' : '#0B192C'};
            border: 2px solid #FFFFFF;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: bold;
            transition: transform 0.2s;
          ">
            ${hub.unesco ? '★' : '✦'}
          </div>
          <div style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 3px;
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
            ${hub.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'real-heritage-pin',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([hub.lat, hub.lng], { icon: customIcon }).addTo(markersGroup);

      marker.on('click', () => {
        setSelectedHub(hub);
        map.flyTo([hub.lat, hub.lng], 7.5, { duration: 1.1 });
      });
    });
  }, [activeRegion, selectedHub, isMapReady]);

  // Handler to center on all India
  const handleResetIndiaView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([22.8, 79.6], 4.8, { duration: 1.0 });
  };

  // Handler to select hub from card or list
  const handleSelectHub = (hub: HeritageHubPin) => {
    setSelectedHub(hub);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([hub.lat, hub.lng], 8, { duration: 1.2 });
    }
  };

  const regionsList = ['All', 'North', 'South', 'West', 'East', 'Central', 'Northeast'];

  return (
    <section className="rounded-3xl bg-[#FAF8F5] border border-[#EAE2D5] p-6 sm:p-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF671F] uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Real Geographic GIS Distribution</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            India Heritage Map Preview
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Accurate real-world map with verified GPS coordinates of India&apos;s UNESCO &amp; ASI heritage monuments
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Tile Style Switcher */}
          <div className="flex bg-stone-200/80 p-0.5 rounded-full text-xs">
            <button
              onClick={() => setMapStyle('voyager')}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
                mapStyle === 'voyager'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Street &amp; Carto
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
                mapStyle === 'satellite'
                  ? 'bg-[#0B192C] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Satellite Real
            </button>
          </div>

          <button
            onClick={() => onNavigateTab('map')}
            className="px-3.5 py-1.5 rounded-full bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <span>Full Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
          Region:
        </span>
        {regionsList.map((reg) => (
          <button
            key={reg}
            onClick={() => setActiveRegion(reg)}
            className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition cursor-pointer ${
              activeRegion === reg
                ? 'bg-[#FF671F] text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            {reg} {reg === 'All' ? `(${REAL_HERITAGE_HUBS.length})` : ''}
          </button>
        ))}

        <button
          onClick={handleResetIndiaView}
          className="ml-auto px-3 py-1 rounded-full bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 shrink-0 transition cursor-pointer"
          title="Reset to All-India View"
        >
          <RotateCcw className="w-3 h-3 text-stone-500" />
          <span>Reset India View</span>
        </button>
      </div>

      {/* Visual Map Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Real Leaflet Map Container */}
        <div className="lg:col-span-2 relative min-h-[420px] h-[420px] sm:h-[460px] rounded-3xl bg-stone-100 border border-[#E5DAC8] overflow-hidden shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Overlay Badges */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1.5">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold text-stone-800">
                Real World Geographic GIS Map
              </span>
            </div>
            <div className="bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-mono tracking-tight self-start">
              Lat 8°N – 37°N • Lng 68°E – 97°E
            </div>
          </div>

          {/* Bottom Live Controls */}
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
            <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-stone-200 text-[10px] text-stone-600 font-medium">
              ★ UNESCO Site • ✦ Iconic Landmark
            </div>
          </div>

          <button
            onClick={handleResetIndiaView}
            className="absolute bottom-3 right-3 z-10 bg-white/95 hover:bg-white text-stone-700 p-2 rounded-xl shadow-md border border-stone-200 transition cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            title="Recenter India"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FF671F]" />
            <span className="hidden sm:inline">Recenter</span>
          </button>
        </div>

        {/* Right Selected Pin Preview Drawer / Active Info */}
        <div className="rounded-3xl bg-white border border-[#E5DAC8] p-5 shadow-sm flex flex-col justify-between min-h-[420px]">
          {selectedHub ? (
            <div className="space-y-4 flex flex-col h-full justify-between">
              <div className="space-y-3">
                <div className="h-44 w-full rounded-2xl overflow-hidden relative group">
                  <img
                    src={selectedHub.image}
                    alt={selectedHub.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1280px-Delhi_fort.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                      {selectedHub.region} India
                    </span>
                  </div>
                  {selectedHub.unesco && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#FF671F] text-white text-[10px] font-bold shadow-xs">
                      UNESCO World Heritage
                    </span>
                  )}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="text-[11px] font-medium opacity-90">{selectedHub.category}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                    {selectedHub.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF671F] shrink-0" />
                    <span className="font-semibold text-stone-800">{selectedHub.city}</span>,{' '}
                    <span>{selectedHub.state}</span>
                  </div>

                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                    {selectedHub.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-[11px] font-mono text-stone-600">
                    <span>GPS Coordinates</span>
                    <span className="font-semibold text-stone-900">
                      {selectedHub.lat.toFixed(4)}° N, {selectedHub.lng.toFixed(4)}° E
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectPlace && onSelectPlace(selectedHub.id)}
                  className="flex-1 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold text-center transition shadow-xs active:scale-95 cursor-pointer"
                >
                  View Destination Dossier
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('map')}
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 transition cursor-pointer"
                  title="Open in Full Interactive GIS Map"
                >
                  <Map className="w-4 h-4 text-stone-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF671F] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-bold text-stone-900">
                Select a Heritage Landmark
              </h4>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Click on any verified monument pin on the real world map to explore its coordinates and historical dossier.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
