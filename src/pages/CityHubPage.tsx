import React, { useEffect, useState, useMemo } from 'react';
import { PlaceSummary, CityWeather } from '../types';
import { api } from '../services/api';
import {
  MapPin,
  CloudSun,
  Star,
  Sparkles,
  Filter,
  ArrowRight,
  Box,
  Landmark,
  ChevronRight,
  Layers,
  Compass,
  CheckCircle2,
  Info,
  Navigation,
  Calendar,
} from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar';
import { CityImmersionHeader } from '../components/destination/CityImmersionHeader';
import { ThreeDDestinationCard } from '../components/common/ThreeDDestinationCard';
import { updatePageSEO, generateCitySchema } from '../utils/seo';
import { MUMBAI_ATTRACTIONS, MUMBAI_SECTIONS } from '../data/mumbaiMasterData';
import { PUNE_ATTRACTIONS } from '../data/puneMasterData';
import { TAMIL_NADU_ATTRACTIONS, CHENNAI_ATTRACTIONS } from '../data/tamilNaduMasterData';
import { HIMACHAL_PRADESH_ATTRACTIONS, getHimachalAttractionsByCity } from '../data/himachalPradeshMasterData';

interface CityHubPageProps {
  onSelectPlace: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

interface CategoryFilter {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryFilter[] = [
  { id: 'all', label: 'All Famous Places', icon: Sparkles },
  { id: 'monuments', label: 'Major Monuments & Heritage', icon: Landmark },
  { id: 'tourist-places', label: 'Famous Tourist Places & Viewpoints', icon: Compass },
  { id: 'nature', label: 'Nature, Waterfalls & Lakes', icon: CloudSun },
  { id: 'museums', label: 'Museums & Culture', icon: Box },
];

function matchesCategory(place: PlaceSummary, catId: string): boolean {
  if (catId === 'all') return true;
  const cat = (place.category || '').toLowerCase();
  const name = (place.name || '').toLowerCase();
  const summary = (place.summary || '').toLowerCase();
  const tags: string[] = Array.isArray((place as any).tags)
    ? (place as any).tags.map((t: any) => String(t).toLowerCase())
    : [];

  if (catId === 'monuments') {
    return (
      cat.includes('heritage') ||
      cat.includes('monument') ||
      cat.includes('fort') ||
      cat.includes('temple') ||
      cat.includes('cave') ||
      cat.includes('palace') ||
      tags.includes('heritage') ||
      tags.includes('monument') ||
      tags.includes('caves') ||
      tags.includes('fort') ||
      tags.includes('unesco') ||
      name.includes('fort') ||
      name.includes('caves') ||
      name.includes('temple') ||
      name.includes('tomb') ||
      name.includes('monument') ||
      name.includes('palace') ||
      name.includes('gateway')
    );
  }

  if (catId === 'tourist-places') {
    return (
      cat.includes('viewpoint') ||
      cat.includes('tourist') ||
      cat.includes('scenic') ||
      cat.includes('garden') ||
      tags.includes('viewpoint') ||
      tags.includes('tourist_places') ||
      tags.includes('sunset') ||
      tags.includes('adventure') ||
      tags.includes('trekking') ||
      name.includes('point') ||
      name.includes('leap') ||
      name.includes('sunset') ||
      name.includes('nose') ||
      name.includes('tekdi') ||
      name.includes('hill') ||
      name.includes('marine drive') ||
      summary.includes('viewpoint') ||
      summary.includes('panoramic') ||
      summary.includes('tourist')
    );
  }

  if (catId === 'nature') {
    return (
      cat.includes('nature') ||
      cat.includes('coastal') ||
      cat.includes('garden') ||
      cat.includes('park') ||
      cat.includes('tekdi') ||
      cat.includes('hill') ||
      tags.includes('nature') ||
      tags.includes('waterfall') ||
      tags.includes('dam') ||
      tags.includes('lake') ||
      tags.includes('garden') ||
      tags.includes('park') ||
      tags.includes('tekdi') ||
      name.includes('dam') ||
      name.includes('waterfall') ||
      name.includes('lake') ||
      name.includes('falls') ||
      name.includes('garden') ||
      name.includes('tekdi') ||
      name.includes('hill') ||
      summary.includes('waterfall') ||
      summary.includes('dam') ||
      summary.includes('lake') ||
      summary.includes('reservoir') ||
      summary.includes('garden')
    );
  }

  if (catId === 'museums') {
    return (
      cat.includes('museum') ||
      cat.includes('art') ||
      tags.includes('museum') ||
      tags.includes('art') ||
      name.includes('museum') ||
      summary.includes('museum') ||
      summary.includes('wax') ||
      summary.includes('sculptor')
    );
  }

  return cat.includes(catId) || tags.includes(catId);
}

const MumbaiPlaceCard: React.FC<{
  place: any;
  onSelectPlace: (id: string) => void;
}> = ({ place, onSelectPlace }) => {
  const mapQuery = place.map_search || `${place.name}, ${place.area ? `${place.area}, ` : ''}${place.city || 'India'}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-stone-100">
          <img
            src={place.thumbnail_url || place.image_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80'}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none max-w-[85%]">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-600/90 text-white backdrop-blur-xs">
              {place.category}
            </span>
            {Array.isArray(place.tags) && place.tags.slice(0, 2).map((t: string) => (
              <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-900/70 text-amber-200 backdrop-blur-xs">
                #{t}
              </span>
            ))}
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
            <h4 className="font-serif text-base font-bold leading-tight drop-shadow-xs">
              {place.name}
            </h4>
            {place.area && (
              <div className="text-[11px] text-amber-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                <span className="truncate">{place.area}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {place.description || place.summary}
          </p>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
            <span>⏱️ {place.suggested_duration || place.duration || '1–2 hours'}</span>
            <span className="truncate max-w-[140px]">🎟️ {typeof place.entry_fee === 'number' ? `₹${place.entry_fee}` : (place.entry_fee || 'Public access')}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          onClick={() => onSelectPlace(place.id)}
          className="flex-1 py-2 px-3 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer"
          title={`View ${place.name} on Google Maps`}
        >
          <Navigation className="w-4 h-4 text-[#FF671F]" />
        </a>
      </div>
    </div>
  );
};

export const CityHubPage: React.FC<CityHubPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity,
  onSelectCity,
}) => {
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const cities = [
    'Lonavala & Khandala',
    'Mumbai',
    'Delhi',
    'Jaipur',
    'Agra',
    'Varanasi',
    'Goa',
    'Kochi',
    'Bengaluru',
    'Pune',
    'Chennai',
    'Shimla',
    'Udaipur',
    'Amritsar',
  ];

  useEffect(() => {
    updatePageSEO({
      title: `${selectedCity} Heritage & Attractions`,
      description: `Explore top monuments, cultural landmarks, and heritage attractions in ${selectedCity}.`,
      jsonLd: generateCitySchema({ name: selectedCity }),
    });

    const loadCityData = async () => {
      setLoading(true);
      try {
        const queryCity = selectedCity.includes('&')
          ? selectedCity.split('&')[0].trim()
          : selectedCity;

        const [placesRes, weatherRes] = await Promise.allSettled([
          api.getPlaces({ city: queryCity, limit: 60 }),
          api.getWeather(queryCity),
        ]);

        let loadedPlaces = placesRes.status === 'fulfilled' ? placesRes.value.data || [] : [];

        // If user picked Lonavala & Khandala, ensure we query both sub-regions and merge
        if (
          selectedCity.toLowerCase().includes('lonavala') ||
          selectedCity.toLowerCase().includes('khandala')
        ) {
          try {
            const [lRes, kRes] = await Promise.allSettled([
              api.getPlaces({ city: 'Lonavala', limit: 50 }),
              api.getPlaces({ city: 'Khandala', limit: 50 }),
            ]);
            const lPlaces = lRes.status === 'fulfilled' ? lRes.value.data || [] : [];
            const kPlaces = kRes.status === 'fulfilled' ? kRes.value.data || [] : [];

            const map = new Map<string, PlaceSummary>();
            for (const p of [...loadedPlaces, ...lPlaces, ...kPlaces]) {
              if (p && p.id) {
                map.set(p.id.toLowerCase(), p);
              }
            }
            loadedPlaces = Array.from(map.values());
          } catch (e) {
            console.warn('Error merging Lonavala/Khandala places:', e);
          }
        }

        // If user picked Pune, load exactly the 25 verified Pune attractions
        if (selectedCity.toLowerCase().includes('pune')) {
          loadedPlaces = (PUNE_ATTRACTIONS as any).slice(0, 25);
        } else if (selectedCity.toLowerCase().includes('chennai')) {
          // If user picked Chennai, load exactly the 10 verified Chennai attractions
          loadedPlaces = (CHENNAI_ATTRACTIONS as any);
        } else if (selectedCity.toLowerCase().includes('tamil nadu')) {
          // If user picked Tamil Nadu, load all 27 verified attractions
          loadedPlaces = (TAMIL_NADU_ATTRACTIONS as any);
        } else if (selectedCity.toLowerCase().includes('himachal')) {
          // If user picked Himachal Pradesh, load all 20 verified attractions
          loadedPlaces = (HIMACHAL_PRADESH_ATTRACTIONS as any);
        } else if (['shimla', 'kufri', 'manali', 'kasol', 'dharamshala', 'khajjiar', 'dalhousie', 'chail', 'kullu', 'spiti'].some((c) => selectedCity.toLowerCase().includes(c))) {
          // If user picked a Himachal city, load its verified attractions
          loadedPlaces = (getHimachalAttractionsByCity(selectedCity) as any);
        }

        // If city places is empty (e.g. edge-case), load all available places so it never looks blank
        if (loadedPlaces.length === 0) {
          const fallbackRes = await api.getPlaces({ limit: 40 });
          loadedPlaces = fallbackRes.data || [];
        }

        setPlaces(loadedPlaces);

        if (weatherRes.status === 'fulfilled') {
          setWeather(weatherRes.value);
        }
      } catch (err) {
        console.error('Failed to load city data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCityData();
  }, [selectedCity]);

  const isMumbai = selectedCity.toLowerCase().includes('mumbai');
  const isPune = selectedCity.toLowerCase().includes('pune');
  const isChennai = selectedCity.toLowerCase().includes('chennai');
  const isTamilNadu = selectedCity.toLowerCase().includes('tamil nadu');
  const isHimachal = selectedCity.toLowerCase().includes('himachal') || ['shimla', 'kufri', 'manali', 'kasol', 'dharamshala', 'khajjiar', 'dalhousie', 'chail', 'kullu', 'spiti'].some((c) => selectedCity.toLowerCase().includes(c));
  const mumbaiMap = useMemo(() => new Map(MUMBAI_ATTRACTIONS.map((a) => [a.id, a])), []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: places.length };
    for (const cat of CATEGORIES) {
      if (cat.id === 'all') continue;
      counts[cat.id] = places.filter((p) => matchesCategory(p, cat.id)).length;
    }
    return counts;
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => matchesCategory(p, activeCategory));
  }, [places, activeCategory]);

  return (
    <div className="space-y-6 w-full animate-fadeIn pb-8">
      {/* 3D City Immersion Header with Layered Background & Guide */}
      <CityImmersionHeader
        cityName={selectedCity}
        weather={weather}
        cities={cities}
        onSelectCity={onSelectCity}
        onExploreHeritage={() => onNavigateTab('heritage')}
        onExploreTransit={() => onNavigateTab('map')}
      />

      {/* Filter Tabs & Quick Action Navigation Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 bg-white rounded-2xl border border-[#EFE8DF] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.id] ?? 0;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#FF671F] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#EFE8DF]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-100' : 'text-stone-500'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#E65100] text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('heritage')}
            className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-[#FF671F] flex items-center gap-1.5 transition cursor-pointer"
          >
            <Landmark className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Major Monuments</span>
          </button>
          <button
            onClick={() => onNavigateTab('india')}
            className="px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-stone-700" />
            <span>28 States DB</span>
          </button>
          <button
            onClick={() => onNavigateTab('map')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold text-stone-800 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-stone-700" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Places Rendering */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[#FF671F] font-bold animate-pulse">
          Loading verified {selectedCity} destinations & monuments...
        </div>
      ) : isMumbai && activeCategory === 'all' ? (
        <div className="space-y-12">
          {/* Mumbai Overview Quick Insights */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/80 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF671F]" />
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Welcome to Mumbai: The Gateway of India & Coastal Metropolis
                  </h3>
                </div>
                <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
                  From the Victorian Gothic pinnacles of Fort and the sacred rock-cut sanctums of Elephanta & Kanheri, to the tranquil sunsets of Marine Drive and the untamed wilderness of Sanjay Gandhi National Park — explore 40 verified heritage monuments, cultural institutions, and scenic coastal treasures.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-2 bg-white rounded-xl border border-amber-200 text-center shadow-2xs">
                  <div className="text-xs font-bold text-[#FF671F]">40 Places</div>
                  <div className="text-[10px] text-stone-500">Verified Attractions</div>
                </div>
                <div className="px-3 py-2 bg-white rounded-xl border border-amber-200 text-center shadow-2xs">
                  <div className="text-xs font-bold text-emerald-600">3 UNESCO</div>
                  <div className="text-[10px] text-stone-500">World Heritage Sites</div>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Mumbai Destination Sections */}
          {MUMBAI_SECTIONS.map((sec) => {
            const sectionPlaces = sec.placeIds
              .map((id) => mumbaiMap.get(id))
              .filter(Boolean);

            return (
              <section key={sec.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200 pb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                      <span>{sec.title}</span>
                      <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF671F] font-sans">
                        {sectionPlaces.length}
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">{sec.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sectionPlaces.map((p: any) => (
                    <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* Section 8: Trip Planner CTA Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-[#0B192C] via-stone-900 to-[#1E3E62] text-white p-8 sm:p-10 shadow-xl border border-stone-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF671F]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF671F]/20 text-[#FF8542] text-xs font-bold uppercase tracking-wider border border-[#FF671F]/30">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Curated Travel Circuits</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                  Ready to Explore Mumbai Your Way?
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Generate an intelligent 1 to 7-day Mumbai itinerary grouping attractions by geographic circuits (South Mumbai, Fort/Kala Ghoda, Bandra & Worli, SGNP & Kanheri). Customize your budget tier for stays and transit while enjoying verified attractions and authentic local food picks!
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('itinerary')}
                className="px-6 py-3.5 rounded-2xl bg-[#FF671F] hover:bg-[#E65100] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer group"
              >
                <span>Open Mumbai Trip Planner</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      ) : isMumbai ? (
        /* Filtered view for Mumbai */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900">
              Showing {filteredPlaces.length} places for "{CATEGORIES.find((c) => c.id === activeCategory)?.label}"
            </h4>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-bold text-[#FF671F] hover:underline cursor-pointer"
            >
              View All 40 Mumbai Places
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((p) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : isPune && activeCategory === 'all' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>Verified Heritage Sites & Places in Pune (25)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Explore Pune’s historic Peshwa palaces, rock-cut cave temples, cultural museums, green tekdis, and Maratha hill forts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map((p: any) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : isPune ? (
        /* Filtered view for Pune */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900">
              Showing {filteredPlaces.length} places for "{CATEGORIES.find((c) => c.id === activeCategory)?.label}"
            </h4>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-bold text-[#FF671F] hover:underline cursor-pointer"
            >
              View All 25 Pune Places
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((p) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : isChennai && activeCategory === 'all' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>Verified Heritage Sites & Places in Chennai (10)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Explore Chennai’s iconic beaches, Dravidian temples, historic forts, museums, and natural sanctuaries.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map((p: any) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : isChennai ? (
        /* Filtered view for Chennai */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900">
              Showing {filteredPlaces.length} places for "{CATEGORIES.find((c) => c.id === activeCategory)?.label}"
            </h4>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-bold text-[#FF671F] hover:underline cursor-pointer"
            >
              View All 10 Chennai Places
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((p) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : isTamilNadu && activeCategory === 'all' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>Verified Heritage Sites & Places in Tamil Nadu (27)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Explore Tamil Nadu’s world heritage Chola temples, soaring Madurai gopurams, coastal monuments, and Nilgiri hill railways.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map((p: any) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : isTamilNadu ? (
        /* Filtered view for Tamil Nadu */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900">
              Showing {filteredPlaces.length} places for "{CATEGORIES.find((c) => c.id === activeCategory)?.label}"
            </h4>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-bold text-[#FF671F] hover:underline cursor-pointer"
            >
              View All 27 Tamil Nadu Places
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((p) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : isHimachal && activeCategory === 'all' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
                <span>Verified Heritage Sites & Places in {selectedCity} ({places.length})</span>
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Explore Himachal Pradesh’s snow-capped peaks, colonial landmarks, cedar-wood pagoda temples, and high Himalayan passes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map((p: any) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : isHimachal ? (
        /* Filtered view for Himachal */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900">
              Showing {filteredPlaces.length} places for "{CATEGORIES.find((c) => c.id === activeCategory)?.label}"
            </h4>
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-bold text-[#FF671F] hover:underline cursor-pointer"
            >
              View All {places.length} {selectedCity} Places
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((p) => (
              <MumbaiPlaceCard key={p.id} place={p} onSelectPlace={onSelectPlace} />
            ))}
          </div>
        </div>
      ) : filteredPlaces.length === 0 ? (
        /* Non-Mumbai fallback when filter has no match */
        <div className="space-y-6">
          <div className="rounded-2xl bg-orange-50/70 border border-orange-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF671F]" />
                <h4 className="text-sm font-bold text-[#0B192C]">
                  Showing All Flagship Attractions in {selectedCity}
                </h4>
              </div>
              <p className="text-xs text-[#FF671F]/80 leading-relaxed">
                There are no direct "{CATEGORIES.find((c) => c.id === activeCategory)?.label}" listed for {selectedCity}. We have surfaced {selectedCity}’s most famous tourist places, forts, and scenic viewpoints below so you never miss an iconic spot!
              </p>
            </div>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold shadow-xs shrink-0 transition cursor-pointer"
            >
              Show All {places.length} Places
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {places.map((p) => {
              const has3d = p.features?.['3d'] || (p as any).model_3d?.available;
              return (
                <ThreeDDestinationCard
                  key={p.id}
                  id={p.id}
                  title={p.name}
                  subtitle={`${p.city}, ${p.state}`}
                  badge={has3d ? '3D Available' : p.category || 'Famous Place'}
                  confidence={p.data_confidence}
                  imageUrl={
                    p.thumbnail_url ||
                    'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80'
                  }
                  tagline={p.summary}
                  onClick={() => onSelectPlace(p.id)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaces.map((p) => {
            const has3d = p.features?.['3d'] || (p as any).model_3d?.available;
            return (
              <ThreeDDestinationCard
                key={p.id}
                id={p.id}
                title={p.name}
                subtitle={`${p.city}, ${p.state}`}
                badge={has3d ? '3D Available' : p.category || 'Famous Place'}
                confidence={p.data_confidence}
                imageUrl={
                  p.thumbnail_url ||
                  'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80'
                }
                tagline={p.summary}
                onClick={() => onSelectPlace(p.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
