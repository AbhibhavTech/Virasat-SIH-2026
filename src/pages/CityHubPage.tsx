import React, { useEffect, useState, useMemo } from 'react';
import { PlaceSummary, CityWeather } from '../types';
import { api } from '../services/api';
import {
  MapPin,
  CloudSun,
  Star,
  Sparkles,
  Filter,
  Navigation,
  ArrowRight,
  Box,
  Landmark,
  ChevronRight,
  Layers,
  Compass,
  CheckCircle2,
  Info
} from 'lucide-react';
import { NavTab } from '../components/layout/Sidebar';
import { CityImmersionHeader } from '../components/destination/CityImmersionHeader';
import { ThreeDDestinationCard } from '../components/common/ThreeDDestinationCard';

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
    'Udaipur',
    'Amritsar',
  ];

  useEffect(() => {
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

  // Curated flagship destinations for the top horizontal bar
  const flagshipDestinations = useMemo(() => {
    return places.slice(0, 6);
  }, [places]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn pb-8">
      {/* 3D City Immersion Header with Layered Background & Guide */}
      <CityImmersionHeader
        cityName={selectedCity}
        weather={weather}
        cities={cities}
        onSelectCity={onSelectCity}
        onExploreHeritage={() => onNavigateTab('heritage')}
        onExploreTransit={() => onNavigateTab('routes')}
      />

      {/* TOP DESTINATIONS BAR: Highlights of Most Famous Places in Selected City */}
      {flagshipDestinations.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#EFE8DF] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-[#FF671F] text-xs font-bold">
                ★
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                Most Famous Places & Major Highlights in {selectedCity}
              </h3>
            </div>
            <span className="text-[11px] font-medium text-stone-500">
              Verified coordinates & tourist attractions
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
            {flagshipDestinations.map((p) => {
              const has3d = p.features?.['3d'] || (p as any).model_3d?.available;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPlace(p.id)}
                  className="shrink-0 w-64 p-2.5 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-orange-50/60 hover:border-orange-300 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        p.thumbnail_url ||
                        'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={p.name}
                      className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider truncate">
                          {has3d ? '3D Model' : p.category || 'Famous Place'}
                        </span>
                        <div className="flex items-center text-[#FF671F] text-[10px] font-bold ml-auto shrink-0">
                          <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                          <span>{p.rating || 4.8}</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-[#FF671F] transition">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {p.summary || `${p.city}, ${p.state}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('heritage')}
            className="px-3.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-[#FF671F] flex items-center gap-1.5 transition"
          >
            <Landmark className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Major Monuments</span>
          </button>
          <button
            onClick={() => onNavigateTab('india')}
            className="px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800 flex items-center gap-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5 text-stone-700" />
            <span>28 States DB</span>
          </button>
          <button
            onClick={() => onNavigateTab('routes')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold text-stone-800 flex items-center gap-1.5 transition"
          >
            <Navigation className="w-3.5 h-3.5 text-stone-700" />
            <span>Transit Engine</span>
          </button>
        </div>
      </div>

      {/* Places Grid with 3D Depth Cards & Never-Empty Fallback */}
      {loading ? (
        <div className="text-center py-16 text-xs text-[#FF671F] font-bold animate-pulse">
          Loading verified {selectedCity} destinations & monuments...
        </div>
      ) : filteredPlaces.length === 0 ? (
        /* If category filter has no direct match, show rich suggestions instead of a blank box */
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
