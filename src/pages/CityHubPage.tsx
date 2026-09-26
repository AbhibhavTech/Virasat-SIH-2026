import React, { useEffect, useState, useMemo } from 'react';
import { PlaceSummary, CityWeather, FestivalItem } from '../types';
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
  ShoppingBag,
  PartyPopper,
  Hotel,
  Bot,
  Calendar,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar';
import { CityImmersionHeader } from '../components/destination/CityImmersionHeader';
import { ThreeDDestinationCard } from '../components/common/ThreeDDestinationCard';
import { updatePageSEO, generateCitySchema } from '../utils/seo';

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
  { id: 'monuments', label: 'Monuments & Heritage', icon: Landmark },
  { id: 'markets', label: 'Markets & Bazaars', icon: ShoppingBag },
  { id: 'festivals', label: 'City Festivals', icon: PartyPopper },
  { id: 'hotels', label: 'Verified Hotels', icon: Hotel },
  { id: 'tourist-places', label: 'Scenic Viewpoints', icon: Compass },
  { id: 'nature', label: 'Nature & Lakes', icon: CloudSun },
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

  if (catId === 'markets') {
    return (
      cat.includes('market') ||
      cat.includes('bazaar') ||
      cat.includes('shopping') ||
      tags.includes('market') ||
      tags.includes('bazaar') ||
      name.includes('market') ||
      name.includes('bazaar') ||
      name.includes('chowk') ||
      summary.includes('market') ||
      summary.includes('bazaar')
    );
  }

  if (catId === 'tourist-places') {
    return (
      cat.includes('viewpoint') ||
      cat.includes('tourist') ||
      cat.includes('scenic') ||
      tags.includes('viewpoint') ||
      tags.includes('tourist_places') ||
      tags.includes('sunset') ||
      tags.includes('adventure') ||
      name.includes('point') ||
      name.includes('leap') ||
      name.includes('sunset') ||
      name.includes('nose') ||
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
      tags.includes('nature') ||
      tags.includes('waterfall') ||
      tags.includes('dam') ||
      tags.includes('lake') ||
      name.includes('dam') ||
      name.includes('waterfall') ||
      name.includes('lake') ||
      name.includes('falls') ||
      summary.includes('waterfall') ||
      summary.includes('dam') ||
      summary.includes('lake') ||
      summary.includes('reservoir')
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

export const CityHubPage: React.FC<CityHubPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity,
  onSelectCity,
}) => {
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [weather, setWeather] = useState<CityWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const cities = [
    'Mumbai',
    'Delhi',
    'Jaipur',
    'Agra',
    'Varanasi',
    'Kolkata',
    'Patna',
    'Pune',
    'Hyderabad',
    'Visakhapatnam',
    'Goa',
    'Kochi',
    'Bengaluru',
    'Amritsar',
    'Lonavala & Khandala',
  ];

  useEffect(() => {
    updatePageSEO({
      title: `${selectedCity} Heritage, Markets, Hotels & Festivals`,
      description: `Explore top monuments, cultural landmarks, markets, hotels, and festivals in ${selectedCity}.`,
      jsonLd: generateCitySchema({ name: selectedCity }),
    });

    const loadCityData = async () => {
      setLoading(true);
      try {
        const queryCity = selectedCity.includes('&')
          ? selectedCity.split('&')[0].trim()
          : selectedCity;

        const [placesRes, weatherRes, festivalsRes, hotelsRes] = await Promise.allSettled([
          api.getPlaces({ city: queryCity, limit: 60 }),
          api.getWeather(queryCity),
          api.getFestivals({ city: queryCity }),
          api.getHotels({ city: queryCity }),
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

        // If city places is empty (e.g. edge-case), load fallback places
        if (loadedPlaces.length === 0) {
          const fallbackRes = await api.getPlaces({ limit: 40 });
          loadedPlaces = fallbackRes.data || [];
        }

        setPlaces(loadedPlaces);

        if (weatherRes.status === 'fulfilled') {
          setWeather(weatherRes.value);
        }

        if (festivalsRes.status === 'fulfilled') {
          setFestivals(festivalsRes.value || []);
        }

        if (hotelsRes.status === 'fulfilled') {
          setHotels(hotelsRes.value || []);
        }
      } catch (err) {
        console.error('Failed to load city data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCityData();
  }, [selectedCity]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: places.length,
      festivals: festivals.length,
      hotels: hotels.length,
    };
    for (const cat of CATEGORIES) {
      if (cat.id === 'all' || cat.id === 'festivals' || cat.id === 'hotels') continue;
      counts[cat.id] = places.filter((p) => matchesCategory(p, cat.id)).length;
    }
    return counts;
  }, [places, festivals, hotels]);

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

      {/* Unified Cross-Navigation Bar: Plan Trip, Interactive Map, AI Assistant, Festivals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateTab('itinerary')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs hover:shadow-md transition flex items-center justify-between text-left group"
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-100">Itinerary</div>
            <div className="text-xs sm:text-sm font-black mt-0.5">Plan Trip to {selectedCity}</div>
          </div>
          <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('map')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs hover:shadow-md transition flex items-center justify-between text-left group"
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">Live Navigation</div>
            <div className="text-xs sm:text-sm font-black mt-0.5">View on Map</div>
          </div>
          <Navigation className="w-4 h-4 opacity-80 group-hover:scale-110 transition" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('ai')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs hover:shadow-md transition flex items-center justify-between text-left group"
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-100">Virasat AI</div>
            <div className="text-xs sm:text-sm font-black mt-0.5">Ask AI Concierge</div>
          </div>
          <Bot className="w-4 h-4 opacity-80 group-hover:scale-110 transition" />
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('festivals')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xs hover:shadow-md transition flex items-center justify-between text-left group"
        >
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-100">Cultural Vibe</div>
            <div className="text-xs sm:text-sm font-black mt-0.5">Explore Festivals</div>
          </div>
          <PartyPopper className="w-4 h-4 opacity-80 group-hover:scale-110 transition" />
        </button>
      </div>

      {/* Filter Tabs Navigation Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 bg-white rounded-2xl border border-[#EFE8DF] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.id] ?? 0;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
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
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[#FF671F] font-bold animate-pulse">
          Loading verified {selectedCity} destinations, festivals, and hotels...
        </div>
      ) : activeCategory === 'festivals' ? (
        /* ---------------- Festivals Section ---------------- */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-orange-500" />
              <span>Cultural Festivals & Celebrations in {selectedCity}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('festivals')}
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>View All 63 National Festivals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {festivals.length === 0 ? (
            <div className="p-8 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-2">
              <PartyPopper className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="text-sm font-bold text-slate-800">
                No specific festivals indexed exclusively for {selectedCity}
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Check our master database of 63 verified national festivals spanning all 28 Indian States & 8 Union Territories.
              </p>
              <button
                onClick={() => onNavigateTab('festivals')}
                className="mt-3 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
              >
                Browse All Festivals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {festivals.map((fest) => (
                <div
                  key={fest.id}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                >
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={fest.image_url}
                      alt={fest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black shadow-xs">
                      {fest.typical_season || 'Annual'}
                    </div>
                    {fest.cultural_vibe && (
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                        ✨ {fest.cultural_vibe}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{fest.name}</h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                        <span>{fest.primary_city}, {fest.state}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {fest.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onNavigateTab('map')}
                        className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Compass className="w-3 h-3 text-emerald-600" />
                        <span>Map</span>
                      </button>
                      <button
                        onClick={() => onNavigateTab('itinerary')}
                        className="py-1.5 px-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Calendar className="w-3 h-3 text-orange-600" />
                        <span>Plan Trip</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeCategory === 'hotels' ? (
        /* ---------------- Hotels Section ---------------- */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-indigo-500" />
              <span>Verified Accommodations in {selectedCity}</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">{hotels.length} verified stays</span>
          </div>

          {hotels.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <Hotel className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-800">
                No specific hotels indexed directly in {selectedCity}
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Use the Interactive Map to explore regional boutique stays and government guest houses.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotels.map((h) => (
                <div
                  key={h.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-black text-slate-900">{h.name}</h4>
                      {h.star_rating && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{h.star_rating}★</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>{h.address || `${h.city}, India`}</span>
                    </div>
                    {h.price_level && (
                      <div className="text-xs font-extrabold text-emerald-700 mt-2">
                        {h.price_level}
                      </div>
                    )}
                    {h.description && (
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {h.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Verified Virasat Partner
                    </span>
                    <button
                      onClick={() => onNavigateTab('map')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Navigation className="w-3 h-3 text-indigo-600" />
                      <span>View on Map</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ---------------- Standard Places & Attractions Grid ---------------- */
        <div className="space-y-6">
          {/* Highlights Banner if viewing 'all' and city has active festivals */}
          {activeCategory === 'all' && festivals.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-orange-900">
                    Cultural Celebration Spotlight in {selectedCity}
                  </div>
                  <div className="text-xs text-orange-700">
                    {festivals.map(f => f.name).join(', ')} is celebrated here!
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveCategory('festivals')}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shrink-0 transition"
              >
                View Festival Details
              </button>
            </div>
          )}

          {filteredPlaces.length === 0 ? (
            <div className="space-y-6">
              <div className="rounded-2xl bg-orange-50/70 border border-orange-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#FF671F]" />
                    <h4 className="text-sm font-bold text-[#0B192C]">
                      Showing Flagship Attractions in {selectedCity}
                    </h4>
                  </div>
                  <p className="text-xs text-[#FF671F]/80 leading-relaxed">
                    There are no direct items listed under "{CATEGORIES.find((c) => c.id === activeCategory)?.label}" for {selectedCity}. Surfacing all verified tourist places below.
                  </p>
                </div>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold shadow-xs shrink-0 transition"
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
      )}
    </div>
  );
};
