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
  Info
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
            onClick={() => onNavigateTab('map')}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold text-stone-800 flex items-center gap-1.5 transition"
          >
            <Compass className="w-3.5 h-3.5 text-stone-700" />
            <span>Interactive Map</span>
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
