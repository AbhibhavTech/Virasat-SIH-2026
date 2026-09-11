import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { safeLocalStorage } from '../utils/storage';
import { PlaceSummary } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import {
  Landmark,
  Search,
  MapPin,
  Clock,
  Ticket,
  Box,
  Compass,
  Heart,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Train,
  SlidersHorizontal,
  Info,
  CheckSquare,
  Square,
  CheckCircle2,
  LayoutGrid,
  FileText,
  Table as TableIcon,
  Scale,
  Sun,
  Camera,
  Layers,
  Award,
  X,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { MonumentComparisonModal } from '../components/heritage/MonumentComparisonModal';
import { HeritageGallery } from '../components/heritage/HeritageGallery';
import { HeritageBackgroundVideoManager } from '../components/heritage/HeritageBackgroundVideoManager';
import { getRealMonumentImage } from '../data/heritageRealImages';

interface HeritageSitesPageProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: any) => void;
  onSelectPlaceForRoute?: (placeId: string) => void;
}

const ERA_KEYWORDS: Record<string, string[]> = {
  'ancient-buddhist': ['sanchi', 'stupa', 'ashoka', 'buddhist', 'mauryan', 'chaitya', 'buddha'],
  'classical-rockcut': ['rock-cut', 'cave', 'ellora', 'elephanta', 'mahabalipuram', 'basalt', 'chalukya', 'rashtrakuta', 'kailash'],
  'dravidian-chola': ['dravidian', 'chola', 'brihadisvara', 'thanjavur', 'gopuram', 'vimana', 'hampi', 'virupaksha', 'granite'],
  'kalinga-hoysala': ['kalinga', 'hoysala', 'konark', 'sun temple', 'belur', 'chariot', 'khondalite', 'jagannath'],
  'indo-islamic': ['sultanate', 'qutub', 'minar', 'islamic', 'golconda', 'fluted', 'tughlaq', 'khalji'],
  'imperial-mughal': ['mughal', 'taj mahal', 'red fort', 'humayun', 'fatehpur', 'pietra dura', 'agra fort', 'shah jahan', 'akbar'],
  'rajputana-forts': ['rajput', 'amber', 'jaipur', 'mehrangarh', 'fort', 'jodhpur', 'chittor', 'kumbhalgarh', 'jharokha'],
  'colonial-saracenic': ['colonial', 'saracenic', 'gateway of india', 'victoria memorial', 'chhatrapati shivaji', 'gothic', 'basalt'],
};

const MATERIAL_OPTIONS = [
  { id: 'All', label: 'All Materials' },
  { id: 'Makrana Marble', label: 'Makrana White Marble' },
  { id: 'Red Sandstone', label: 'Red Sandstone' },
  { id: 'Rock-Cut Basalt', label: 'Rock-Cut Basalt' },
  { id: 'Monolithic Granite', label: 'Monolithic Granite' },
  { id: 'Khondalite Stone', label: 'Khondalite Stone' },
];

export const HeritageSitesPage: React.FC<HeritageSitesPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  onSelectPlaceForRoute,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [heritageSites, setHeritageSites] = useState<any[]>([]);
  const [allStates, setAllStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedEraId, setSelectedEraId] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'gallery' | 'dossier' | 'table'>('grid');
  const [filterVisitedOnly, setFilterVisitedOnly] = useState(false);

  // Comparison drawer & modal state
  const [comparisonItems, setComparisonItems] = useState<any[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const [visitedSites, setVisitedSites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = safeLocalStorage.getItem('yatra_visited_heritage');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleVisited = (siteId: string) => {
    setVisitedSites((prev) => {
      const updated = { ...prev, [siteId]: !prev[siteId] };
      try {
        safeLocalStorage.setItem('yatra_visited_heritage', JSON.stringify(updated));
      } catch {
        // Safe ignore
      }
      return updated;
    });
  };

  const handleResetVisited = () => {
    setVisitedSites({});
    try {
      safeLocalStorage.removeItem('yatra_visited_heritage');
    } catch {}
  };

  const toggleCompare = (site: any) => {
    setComparisonItems((prev) => {
      const exists = prev.find((p) => p.id === site.id);
      if (exists) {
        return prev.filter((p) => p.id !== site.id);
      }
      if (prev.length >= 2) {
        // Replace second item
        return [prev[0], site];
      }
      const updated = [...prev, site];
      if (updated.length === 2) {
        setIsComparisonOpen(true);
      }
      return updated;
    });
  };

  useEffect(() => {
    const fetchHeritage = async () => {
      setLoading(true);
      try {
        const [res, statesRes] = await Promise.allSettled([
          api.getHeritage({ limit: 100 }),
          api.getStates(),
        ]);

        if (res.status === 'fulfilled' && res.value?.data && res.value.data.length > 0) {
          setHeritageSites(res.value.data);
        } else {
          // Fallback to places with heritage category
          const placesRes = await api.getPlaces({ limit: 100 });
          setHeritageSites(placesRes.data || []);
        }

        if (statesRes.status === 'fulfilled' && Array.isArray(statesRes.value)) {
          setAllStates(statesRes.value.map((s: any) => s.name || s.id));
        }
      } catch (err) {
        console.error('Failed to load heritage sites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeritage();

    const handleViewChange = (e: any) => {
      if (e.detail === 'gallery') {
        setViewMode('gallery');
      }
    };
    window.addEventListener('virasat:set-heritage-view', handleViewChange);
    return () => window.removeEventListener('virasat:set-heritage-view', handleViewChange);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: heritageSites.length,
      'Forts & Palaces': 0,
      'Temples & Sacred': 0,
      'Caves & Rock-Cut': 0,
      'Architectural & Colonial': 0,
      'Natural & Ghats': 0,
    };

    heritageSites.forEach((site) => {
      const siteCat = (site.category || '').toLowerCase();
      const siteTags = (site.tags || []).map((t: string) => t.toLowerCase());

      if (
        siteCat.includes('fort') ||
        siteCat.includes('palace') ||
        siteTags.includes('fort') ||
        siteTags.includes('palace')
      ) {
        counts['Forts & Palaces']++;
      } else if (
        siteCat.includes('temple') ||
        siteCat.includes('sacred') ||
        siteTags.includes('temple') ||
        siteTags.includes('religious')
      ) {
        counts['Temples & Sacred']++;
      } else if (
        siteCat.includes('cave') ||
        siteTags.includes('cave') ||
        siteTags.includes('rock-cut')
      ) {
        counts['Caves & Rock-Cut']++;
      } else if (
        siteCat.includes('colonial') ||
        siteCat.includes('monument') ||
        siteCat.includes('architecture') ||
        siteTags.includes('colonial')
      ) {
        counts['Architectural & Colonial']++;
      } else if (
        siteCat.includes('ghat') ||
        siteCat.includes('nature') ||
        siteTags.includes('ghat') ||
        siteTags.includes('lake')
      ) {
        counts['Natural & Ghats']++;
      } else {
        counts['Architectural & Colonial']++;
      }
    });

    return counts;
  }, [heritageSites]);

  const categories = useMemo(
    () => [
      { id: 'All', label: `All Heritage (${categoryCounts['All'] || heritageSites.length})` },
      { id: 'Forts & Palaces', label: `Forts & Palaces (${categoryCounts['Forts & Palaces'] || 0})` },
      { id: 'Temples & Sacred', label: `Temples & Sacred (${categoryCounts['Temples & Sacred'] || 0})` },
      { id: 'Caves & Rock-Cut', label: `Rock-Cut Caves (${categoryCounts['Caves & Rock-Cut'] || 0})` },
      { id: 'Architectural & Colonial', label: `Colonial & Monuments (${categoryCounts['Architectural & Colonial'] || 0})` },
      { id: 'Natural & Ghats', label: `Ghats & Natural (${categoryCounts['Natural & Ghats'] || 0})` },
    ],
    [categoryCounts, heritageSites.length]
  );

  const statesList = useMemo(() => {
    const set = new Set<string>();
    heritageSites.forEach((s) => {
      if (s.state) set.add(s.state);
    });
    allStates.forEach((st) => {
      if (st) set.add(st);
    });
    return ['All', ...Array.from(set).sort()];
  }, [heritageSites, allStates]);

  const filteredSites = useMemo(() => {
    return heritageSites.filter((site) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        site.name?.toLowerCase().includes(q) ||
        site.city?.toLowerCase().includes(q) ||
        site.state?.toLowerCase().includes(q) ||
        site.summary?.toLowerCase().includes(q) ||
        site.historical_significance?.toLowerCase().includes(q) ||
        site.architectural_style?.toLowerCase().includes(q);

      const matchesState =
        selectedState === 'All' ||
        site.state === selectedState ||
        site.state_id === selectedState ||
        (site.state || '').toLowerCase().includes(selectedState.toLowerCase());

      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        const siteCat = (site.category || '').toLowerCase();
        const siteTags = (site.tags || []).map((t: string) => t.toLowerCase());

        if (selectedCategory === 'Forts & Palaces') {
          matchesCategory =
            siteCat.includes('fort') ||
            siteCat.includes('palace') ||
            siteTags.includes('fort') ||
            siteTags.includes('palace');
        } else if (selectedCategory === 'Temples & Sacred') {
          matchesCategory =
            siteCat.includes('temple') ||
            siteCat.includes('sacred') ||
            siteTags.includes('temple') ||
            siteTags.includes('religious');
        } else if (selectedCategory === 'Caves & Rock-Cut') {
          matchesCategory =
            siteCat.includes('cave') || siteTags.includes('cave') || siteTags.includes('rock-cut');
        } else if (selectedCategory === 'Architectural & Colonial') {
          matchesCategory =
            siteCat.includes('colonial') ||
            siteCat.includes('monument') ||
            siteCat.includes('architecture') ||
            siteTags.includes('colonial');
        } else if (selectedCategory === 'Natural & Ghats') {
          matchesCategory =
            siteCat.includes('ghat') ||
            siteCat.includes('nature') ||
            siteTags.includes('ghat') ||
            siteTags.includes('lake');
        }
      }

      // Filter by Architectural Era if selected
      let matchesEra = true;
      if (selectedEraId && ERA_KEYWORDS[selectedEraId]) {
        const keywords = ERA_KEYWORDS[selectedEraId];
        const siteText = `${site.name || ''} ${site.summary || ''} ${site.historical_significance || ''} ${site.architectural_style || ''} ${(site.tags || []).join(' ')}`.toLowerCase();
        matchesEra = keywords.some((kw) => siteText.includes(kw));
      }

      // Filter by Material if selected
      let matchesMaterial = true;
      if (selectedMaterial !== 'All') {
        const siteText = `${site.name || ''} ${site.summary || ''} ${site.historical_significance || ''} ${site.architectural_style || ''}`.toLowerCase();
        if (selectedMaterial === 'Makrana Marble') {
          matchesMaterial = siteText.includes('marble') || siteText.includes('makrana');
        } else if (selectedMaterial === 'Red Sandstone') {
          matchesMaterial = siteText.includes('sandstone') || siteText.includes('sikri');
        } else if (selectedMaterial === 'Rock-Cut Basalt') {
          matchesMaterial = siteText.includes('basalt') || siteText.includes('rock-cut') || siteText.includes('cave');
        } else if (selectedMaterial === 'Monolithic Granite') {
          matchesMaterial = siteText.includes('granite') || siteText.includes('monolithic');
        } else if (selectedMaterial === 'Khondalite Stone') {
          matchesMaterial = siteText.includes('khondalite') || siteText.includes('chlorite');
        }
      }

      // Filter Visited Only if active
      let matchesVisited = true;
      if (filterVisitedOnly) {
        matchesVisited = !!visitedSites[site.id];
      }

      return matchesSearch && matchesState && matchesCategory && matchesEra && matchesMaterial && matchesVisited;
    });
  }, [
    heritageSites,
    searchQuery,
    selectedCategory,
    selectedState,
    selectedEraId,
    selectedMaterial,
    filterVisitedOnly,
    visitedSites,
  ]);

  const visitedCount = Object.values(visitedSites).filter(Boolean).length;
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  return (
    <div className="relative space-y-8 animate-fadeIn pb-16">
      {/* Full-Section Background Video (Plays continuously across complete Heritage Section while scrolling) */}
      <HeritageBackgroundVideoManager
        currentIndex={activeVideoIndex}
        onIndexChange={setActiveVideoIndex}
        isPlaying={isVideoPlaying}
        onTogglePlay={() => setIsVideoPlaying(!isVideoPlaying)}
      />

      <div className="relative z-10 space-y-6">
        {/* Heritage Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Heritage Sites & Monuments
            </h1>
            <p className="text-sm text-stone-600 font-sans mt-1">
              Explore India's UNESCO World Heritage sanctuaries, ancient rock-cut marvels, and iconic landmarks.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xs text-stone-700 border border-stone-200/80 text-xs font-semibold shadow-xs">
              {loading ? 'Loading...' : `${heritageSites.length} Verified Monuments`}
            </span>
          </div>
        </div>

        {/* Filter, Search & View Modes Control Bar */}
        <div id="heritage-catalog-controls" className="bg-white/75 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/60 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search monuments, historical dynasties, architectural styles, or cities..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200/80 bg-white/70 backdrop-blur-xs text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF671F]/20 focus:border-[#FF671F] transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-stone-200/80 bg-white/70 backdrop-blur-xs text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#FF671F]/20 focus:border-[#FF671F] cursor-pointer"
            >
              <option value="All">All States / UTs {statesList.length > 1 ? `(${statesList.length - 1})` : ''}</option>
              {statesList
                .filter((s) => s !== 'All')
                .map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
            </select>
          </div>

          {/* Material Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-stone-200/80 bg-white/70 backdrop-blur-xs text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#FF671F]/20 focus:border-[#FF671F] cursor-pointer"
            >
              {MATERIAL_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 backdrop-blur-xs rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#FF671F] shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Visual Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'gallery' ? 'bg-white text-[#FF671F] shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Masonry Photo Gallery"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('dossier')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'dossier' ? 'bg-white text-[#FF671F] shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Curatorial Dossier View"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#FF671F] shadow-2xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Comparative Logistics Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF671F] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 px-1 font-sans">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            {loading ? (
              <span className="text-stone-400">Loading catalogued heritage destinations...</span>
            ) : (
              <>
                Showing <strong className="text-stone-800">{filteredSites.length}</strong> of{' '}
                <strong className="text-stone-800">{heritageSites.length}</strong> destinations
              </>
            )}
          </span>

          {selectedEraId && (
            <span className="bg-orange-100 text-orange-900 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <span>Era: {selectedEraId}</span>
              <button onClick={() => setSelectedEraId(null)} className="cursor-pointer hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedMaterial !== 'All' && (
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <span>Material: {selectedMaterial}</span>
              <button onClick={() => setSelectedMaterial('All')} className="cursor-pointer hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterVisitedOnly && (
            <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <span>Visited Only</span>
              <button onClick={() => setFilterVisitedOnly(false)} className="cursor-pointer hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {selectedState !== 'All' && (
          <span className="bg-orange-50 text-orange-800 px-2 py-0.5 rounded-md border border-orange-200 font-medium">
            Filtered by: {selectedState}
          </span>
        )}
      </div>

      {/* 7. Heritage Content Display based on View Mode */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-stone-100 animate-pulse border border-[#EFE8DF]" />
          ))}
        </div>
      ) : filteredSites.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#EFE8DF] space-y-3">
          <Landmark className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-serif font-bold text-stone-800">No heritage sites found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try adjusting your search keywords or resetting your state, era, or material filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedState('All');
              setSelectedEraId(null);
              setSelectedMaterial('All');
              setFilterVisitedOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#FF671F] text-white text-xs font-semibold hover:bg-[#E65100] transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'gallery' ? (
        /* Masonry Image Gallery View */
        <HeritageGallery
          onSelectPlace={onSelectPlace}
          onNavigateTab={onNavigateTab}
        />
      ) : viewMode === 'grid' ? (
        /* Visual Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSites.map((site) => {
            const has3d = site.features?.['3d'] || site.model_3d?.available;
            const fav = isFavorite(site.id);
            const isCompared = comparisonItems.some((p) => p.id === site.id);
            const realPhoto = getRealMonumentImage(site.id, site.name) || site.thumbnail_url || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={site.id}
                className="group bg-white/80 backdrop-blur-md hover:bg-white/95 rounded-2xl border border-white/60 hover:border-orange-400 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Thumbnail Image Container */}
                <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={realPhoto}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                        site.unesco_site ? 'bg-[#FF671F]' : 'bg-[#046A38]'
                      }`}
                    >
                      {site.heritage_status || (site.unesco_site ? 'UNESCO World Heritage' : 'National Monument')}
                    </span>
                    {has3d && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#000080] text-white shadow-xs flex items-center gap-1">
                        <Box className="w-2.5 h-2.5" />
                        <span>3D Scan</span>
                      </span>
                    )}
                  </div>

                  {/* Top Right Controls: Compare, Visited, Favorite */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {/* Compare Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(site);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        isCompared ? 'bg-[#FF671F] text-white shadow-md' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>

                    {/* Visited Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisited(site.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        visitedSites[site.id]
                          ? 'bg-[#046A38] text-white shadow-md'
                          : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title={visitedSites[site.id] ? 'Mark as unvisited' : 'Mark as visited'}
                    >
                      {visitedSites[site.id] ? (
                        <CheckSquare className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(site.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        fav ? 'bg-rose-500 text-white shadow-md' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                      title={fav ? 'Remove from saved' : 'Save to favorites'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Location Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">
                        {site.city}, {site.state}
                      </span>
                    </div>
                    {site.rating && (
                      <span className="text-[11px] font-bold bg-black/60 px-2 py-0.5 rounded-full text-amber-300 backdrop-blur-xs">
                        ★ {site.rating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base leading-snug group-hover:text-[#FF671F] transition-colors">
                      {site.name}
                    </h3>
                    {site.architectural_style && (
                      <p className="text-[11px] font-semibold text-[#046A38] mt-0.5">
                        Style: {site.architectural_style}
                      </p>
                    )}
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed font-sans">
                      {site.summary || site.historical_significance}
                    </p>
                  </div>

                  {/* Visiting Details Grid */}
                  <div className="pt-3 border-t border-[#EFE8DF] grid grid-cols-2 gap-2 text-[11px] text-stone-600 font-sans">
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span className="truncate">{site.visiting_hours || site.timings || '9:00 AM - 5:30 PM'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Ticket className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span className="truncate">
                        {site.entry_fee?.domestic !== undefined
                          ? `₹${site.entry_fee.domestic} (INR)`
                          : '₹50 standard'}
                      </span>
                    </div>
                  </div>

                  {/* Nearest Transit Info */}
                  {(site.nearest_transport?.railway_station || site.visiting_info?.railway_station) && (
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-100 font-sans">
                      <Train className="w-3 h-3 text-[#000080] flex-shrink-0" />
                      <span className="truncate">
                        Station: {site.nearest_transport?.railway_station || site.visiting_info?.railway_station}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectPlace(site.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer active:scale-95"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {has3d && (
                      <button
                        onClick={() => onNavigateTab('3d')}
                        className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#000080] border border-blue-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Interactive 3D Model"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>3D</span>
                      </button>
                    )}

                    <button
                      onClick={() => onNavigateTab('itinerary')}
                      className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Plan visit to this site"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Plan</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'dossier' ? (
        /* Curatorial Dossier View */
        <div className="space-y-4">
          {filteredSites.map((site) => {
            const has3d = site.features?.['3d'] || site.model_3d?.available;
            const fav = isFavorite(site.id);
            const isCompared = comparisonItems.some((p) => p.id === site.id);

            const realPhoto = getRealMonumentImage(site.id, site.name) || site.thumbnail_url || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600';

            return (
              <div
                key={site.id}
                className="group bg-white/80 backdrop-blur-md hover:bg-white/95 rounded-3xl border border-white/60 hover:border-orange-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6"
              >
                {/* Image Section */}
                <div className="md:w-72 h-52 sm:h-60 rounded-2xl overflow-hidden bg-stone-900 relative shrink-0">
                  <img
                    src={realPhoto}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF671F] text-white shadow-xs">
                    {site.unesco_site ? 'UNESCO World Heritage' : 'National Monument'}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{site.city}, {site.state}</span>
                    </div>
                  </div>
                </div>

                {/* Dossier Content */}
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#046A38] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {site.architectural_style || 'Monumental Architecture'}
                        </span>
                        {site.rating && (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            ★ {site.rating}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleCompare(site)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            isCompared
                              ? 'bg-[#FF671F] text-white shadow-xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>{isCompared ? 'Selected for Compare' : 'Compare'}</span>
                        </button>
                        <button
                          onClick={() => toggleVisited(site.id)}
                          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                            visitedSites[site.id]
                              ? 'bg-emerald-50 text-[#046A38] border-emerald-300'
                              : 'bg-stone-50 text-stone-500 border-stone-200 hover:text-stone-800'
                          }`}
                          title="Toggle visited"
                        >
                          {visitedSites[site.id] ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#FF671F] transition-colors">
                      {site.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                      {site.summary || site.historical_significance}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block">Visiting Timings</span>
                      <span className="font-bold text-stone-800 text-[11px] truncate block">
                        {site.visiting_hours || site.timings || '09:00 AM - 05:30 PM'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block">Domestic Fee</span>
                      <span className="font-bold text-[#046A38] text-[11px] block">
                        {site.entry_fee?.domestic !== undefined ? `₹${site.entry_fee.domestic}` : '₹50 standard'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block">Foreigner Fee</span>
                      <span className="font-bold text-stone-800 text-[11px] block">
                        {site.entry_fee?.foreigner !== undefined ? `₹${site.entry_fee.foreigner}` : '₹600 standard'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block">Nearest Station</span>
                      <span className="font-bold text-[#000080] text-[11px] truncate block">
                        {site.nearest_transport?.railway_station || 'Central Hub'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => onSelectPlace(site.id)}
                      className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer active:scale-95"
                    >
                      <span>Explore Verified Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {has3d && (
                      <button
                        onClick={() => onNavigateTab('3d')}
                        className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#000080] border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>Interactive 3D Virtual Model</span>
                      </button>
                    )}

                    <button
                      onClick={() => onNavigateTab('itinerary')}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Add to Trip Itinerary</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Comparative Logistics Table View */
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-white/80 border-b border-stone-200/80 text-stone-700 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Monument & Location</th>
                  <th className="py-3 px-4">Architectural Style</th>
                  <th className="py-3 px-4">Visiting Hours</th>
                  <th className="py-3 px-4">Domestic / Foreigner</th>
                  <th className="py-3 px-4">Nearest Railway</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100/80 text-stone-700">
                {filteredSites.map((site) => {
                  const has3d = site.features?.['3d'] || site.model_3d?.available;
                  const isCompared = comparisonItems.some((p) => p.id === site.id);
                  const realPhoto = getRealMonumentImage(site.id, site.name) || site.thumbnail_url || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=100';

                  return (
                    <tr key={site.id} className="hover:bg-orange-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={realPhoto}
                            alt={site.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200"
                          />
                          <div>
                            <div className="font-serif font-bold text-stone-900 text-sm">{site.name}</div>
                            <div className="text-[11px] text-stone-500">
                              {site.city}, {site.state}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-stone-800">
                        {site.architectural_style || 'Heritage Masonry'}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {site.visiting_hours || site.timings || '09:00 - 17:30'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-[#046A38]">
                          {site.entry_fee?.domestic !== undefined ? `₹${site.entry_fee.domestic}` : '₹50'}
                        </span>{' '}
                        /{' '}
                        <span className="text-stone-500">
                          {site.entry_fee?.foreigner !== undefined ? `₹${site.entry_fee.foreigner}` : '₹600'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#000080] font-medium">
                        {site.nearest_transport?.railway_station || 'Station Junction'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            site.unesco_site ? 'bg-orange-100 text-[#FF671F]' : 'bg-emerald-100 text-[#046A38]'
                          }`}
                        >
                          {site.unesco_site ? 'UNESCO' : 'ASI'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleCompare(site)}
                            className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                              isCompared ? 'bg-[#FF671F] text-white border-[#FF671F]' : 'bg-stone-50 border-stone-200 text-stone-600'
                            }`}
                            title="Compare"
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectPlace(site.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#FF671F] hover:bg-[#E65100] text-white font-semibold text-xs transition cursor-pointer"
                          >
                            Explore
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Comparison Tray Bar (appears when 1 or 2 items selected) */}
      {comparisonItems.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#0B192C] text-white px-5 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-4 animate-slideUp">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold font-serif">
              Comparing {comparisonItems.length} of 2 Monuments
            </span>
          </div>

          <div className="flex items-center gap-2">
            {comparisonItems.map((item) => (
              <span
                key={item.id}
                className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5"
              >
                <span className="truncate max-w-[120px]">{item.name}</span>
                <button
                  onClick={() => toggleCompare(item)}
                  className="hover:text-rose-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {comparisonItems.length === 2 && (
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-3 py-1 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Open Dossier
            </button>
          )}

          <button
            onClick={() => setComparisonItems([])}
            className="text-xs text-stone-400 hover:text-white cursor-pointer ml-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* 8. Side-by-Side Monument Comparison Modal */}
      <MonumentComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        siteA={comparisonItems[0] || null}
        siteB={comparisonItems[1] || null}
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
      />
      </div>
    </div>
  );
};
