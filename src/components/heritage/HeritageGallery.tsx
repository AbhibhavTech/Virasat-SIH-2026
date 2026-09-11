import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Landmark,
  Sparkles,
  Filter,
  ShieldCheck,
  Eye,
  Box,
  Layers,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  Calendar
} from 'lucide-react';
import { api } from '../../services/api';
import { PlaceSummary } from '../../types';
import MONUMENTS_DATA from '../../../data/heritage/monuments.json';
import { getRealMonumentImage } from '../../data/heritageRealImages';

export interface GalleryItem {
  id: string;
  name: string;
  nameHindi?: string;
  city: string;
  state: string;
  region: string;
  category: string;
  era?: string;
  dynasty?: string;
  architecturalStyle?: string;
  material?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatioClass: string;
  summary: string;
  unesco: boolean;
  has3d: boolean;
  rating?: number;
  tags?: string[];
}

interface HeritageGalleryProps {
  onSelectPlace?: (placeId: string) => void;
  onNavigateTab?: (tab: any) => void;
  className?: string;
  embedded?: boolean;
}

// Aspect ratio classes for organic masonry stagger
const ASPECT_RATIOS = [
  'aspect-[3/4]',    // Tall portrait
  'aspect-[4/5]',    // Classic portrait
  'aspect-[16/10]',  // Widescreen landscape
  'aspect-[1/1]',    // Square
  'aspect-[3/2]',    // Classic 35mm
  'aspect-[5/6]',    // Soft vertical
];

export const HeritageGallery: React.FC<HeritageGalleryProps> = ({
  onSelectPlace,
  onNavigateTab,
  className = '',
  embedded = false,
}) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [density, setDensity] = useState<'standard' | 'dense'>('standard');
  const [onlyUnesco, setOnlyUnesco] = useState(false);

  // Lightbox Modal state
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // 1. Fetch data from API and fallback/merge with curated monuments JSON
  useEffect(() => {
    let isMounted = true;

    async function loadHeritageSites() {
      setLoading(true);
      try {
        // Fetch from live places API
        const apiPlacesRes = await api.getPlaces({ limit: 40 });
        const apiPlaces: PlaceSummary[] = apiPlacesRes?.data || [];

        // Build a lookup by place ID
        const apiLookup = new Map<string, PlaceSummary>();
        apiPlaces.forEach((p) => apiLookup.set(p.id, p));

        // Format curated monuments from data/heritage/monuments.json
        const curatedItems: GalleryItem[] = (MONUMENTS_DATA as any[]).map((monument, idx) => {
          const apiMatch = apiLookup.get(monument.id);
          const rawImg =
            getRealMonumentImage(monument.id, monument.name) ||
            monument.thumbnail_url ||
            (monument.images && monument.images[0]) ||
            apiMatch?.thumbnail_url ||
            apiMatch?.image_url ||
            'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80';

          return {
            id: monument.id,
            name: monument.name,
            city: monument.city || 'India',
            state: monument.state || '',
            region: monument.region || 'All India',
            category: monument.category || 'Architectural & Colonial',
            era: monument.era || '',
            dynasty: monument.historical_period || '',
            architecturalStyle: monument.architectural_style || '',
            material: monument.material || '',
            imageUrl: rawImg,
            thumbnailUrl: rawImg,
            aspectRatioClass: ASPECT_RATIOS[idx % ASPECT_RATIOS.length],
            summary: monument.summary || monument.historical_significance || '',
            unesco: Boolean(monument.unesco_site || monument.heritage_status?.includes('UNESCO')),
            has3d: Boolean(monument.model_3d?.available || monument.features?.['3d']),
            rating: monument.rating || 4.8,
            tags: monument.tags || [],
          };
        });

        // Also add any API places that were not in monuments.json if they have images
        const additionalItems: GalleryItem[] = [];
        apiPlaces.forEach((place, idx) => {
          if (!curatedItems.some((c) => c.id === place.id) && (place.thumbnail_url || place.image_url)) {
            additionalItems.push({
              id: place.id,
              name: place.name,
              city: place.city || '',
              state: place.state || '',
              region: 'India',
              category: place.category || 'Heritage',
              imageUrl: place.thumbnail_url || place.image_url || '',
              aspectRatioClass: ASPECT_RATIOS[(curatedItems.length + idx) % ASPECT_RATIOS.length],
              summary: place.summary || '',
              unesco: Boolean(place.heritage_status?.includes('UNESCO') || place.tags?.includes('unesco')),
              has3d: Boolean(place.features?.['3d']),
              rating: place.rating || 4.7,
              tags: place.tags || [],
            });
          }
        });

        const combined = [...curatedItems, ...additionalItems];

        if (isMounted) {
          setItems(combined);
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
        // Fallback to purely local monuments dataset
        if (isMounted) {
          const fallback: GalleryItem[] = (MONUMENTS_DATA as any[]).map((m, idx) => ({
            id: m.id,
            name: m.name,
            city: m.city || 'India',
            state: m.state || '',
            region: m.region || 'All India',
            category: m.category || 'Heritage',
            era: m.era || '',
            dynasty: m.historical_period || '',
            architecturalStyle: m.architectural_style || '',
            material: m.material || '',
            imageUrl: m.thumbnail_url || (m.images && m.images[0]) || '',
            aspectRatioClass: ASPECT_RATIOS[idx % ASPECT_RATIOS.length],
            summary: m.summary || '',
            unesco: Boolean(m.unesco_site || m.heritage_status?.includes('UNESCO')),
            has3d: Boolean(m.model_3d?.available),
            rating: m.rating || 4.8,
            tags: m.tags || [],
          }));
          setItems(fallback);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHeritageSites();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q) ||
          (item.dynasty && item.dynasty.toLowerCase().includes(q)) ||
          (item.architecturalStyle && item.architecturalStyle.toLowerCase().includes(q)) ||
          (item.material && item.material.toLowerCase().includes(q)) ||
          item.tags?.some((t) => t.toLowerCase().includes(q));

        if (!matchesQuery) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = item.category.toLowerCase();
        const tags = (item.tags || []).map((t) => t.toLowerCase());

        if (selectedCategory === 'forts') {
          if (!cat.includes('fort') && !cat.includes('palace') && !tags.includes('fort')) return false;
        } else if (selectedCategory === 'temples') {
          if (!cat.includes('temple') && !cat.includes('sacred') && !tags.includes('temple')) return false;
        } else if (selectedCategory === 'caves') {
          if (!cat.includes('cave') && !tags.includes('cave') && !tags.includes('rock-cut')) return false;
        } else if (selectedCategory === 'monuments') {
          if (!cat.includes('monument') && !cat.includes('colonial') && !cat.includes('architecture')) return false;
        }
      }

      // Region filter
      if (selectedRegion !== 'all') {
        const reg = item.region.toLowerCase();
        if (!reg.includes(selectedRegion.toLowerCase())) return false;
      }

      // UNESCO filter
      if (onlyUnesco && !item.unesco) {
        return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedCategory, selectedRegion, onlyUnesco]);

  // Lightbox handlers
  const activeItem = activeItemIndex !== null ? filteredItems[activeItemIndex] : null;

  const handleOpenLightbox = (index: number) => {
    setActiveItemIndex(index);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleCloseLightbox = useCallback(() => {
    setActiveItemIndex(null);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleNextPhoto = useCallback(() => {
    if (activeItemIndex === null || filteredItems.length === 0) return;
    setActiveItemIndex((prev) => ((prev ?? 0) + 1) % filteredItems.length);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, [activeItemIndex, filteredItems.length]);

  const handlePrevPhoto = useCallback(() => {
    if (activeItemIndex === null || filteredItems.length === 0) return;
    setActiveItemIndex((prev) => ((prev ?? 0) - 1 + filteredItems.length) % filteredItems.length);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, [activeItemIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeItemIndex === null) return;
      if (e.key === 'Escape') handleCloseLightbox();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === '+' || e.key === '=') setZoomLevel((z) => Math.min(3, z + 0.25));
      if (e.key === '-' || e.key === '_') setZoomLevel((z) => Math.max(1, z - 0.25));
      if (e.key === '0') {
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeItemIndex, handleCloseLightbox, handleNextPhoto, handlePrevPhoto]);

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ========================================================================= */}
      {/* 1. GALLERY HEADER BAR & ATMOSPHERIC BRANDING                              */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-white/60 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-950 text-xs font-bold shadow-2xs mb-2">
            <Landmark className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Heritage Visual Archives</span>
            <span className="text-stone-300">•</span>
            <span className="text-[#046A38] uppercase tracking-wider text-[11px]">Masonry Collection</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
            Heritage Gallery
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl font-normal leading-relaxed">
            High-definition photographic archives capturing the monolithic vimanas, Makrana marble mausoleums, and rock-cut sanctuaries across India's civilizational landscape.
          </p>
        </div>

        {/* Quick Stats / Density Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-xs border border-stone-200/80 text-xs font-semibold text-stone-700 shadow-2xs flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>{filteredItems.length} Sites Archiving</span>
          </div>

          <button
            type="button"
            onClick={() => setOnlyUnesco(!onlyUnesco)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs border ${
              onlyUnesco
                ? 'bg-[#046A38] text-white border-[#03542C]'
                : 'bg-white/80 backdrop-blur-xs hover:bg-emerald-50 text-stone-700 border-stone-200/80'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>UNESCO Sites Only</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-stone-200/60 backdrop-blur-xs rounded-xl border border-stone-300/40">
            <button
              type="button"
              onClick={() => setDensity('standard')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                density === 'standard'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Standard Masonry Columns"
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setDensity('dense')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                density === 'dense'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Dense Masonry Columns"
            >
              Dense
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & SEARCH CONTROLS BAR                                           */}
      {/* ========================================================================= */}
      <div className="bg-white/75 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/60 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by monument name, city, dynasty, architectural stone..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-stone-200/80 bg-white/70 backdrop-blur-xs placeholder-stone-400 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#FF671F]/20 focus:border-[#FF671F]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Compass className="w-4 h-4 text-stone-500 hidden sm:inline" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="py-2 px-3 rounded-xl border border-stone-200/80 bg-white/70 backdrop-blur-xs text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#FF671F]/20 focus:border-[#FF671F] cursor-pointer"
            >
              <option value="all">Pan-India (All Regions)</option>
              <option value="north">Northern Realm</option>
              <option value="south">Southern Heartland</option>
              <option value="west">Western Horizons</option>
              <option value="east">Eastern Frontiers</option>
              <option value="central">Central Plateau</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'All Heritage Archival Gems' },
            { id: 'forts', label: 'Forts & Royal Citadels' },
            { id: 'temples', label: 'Temples & Vimanas' },
            { id: 'caves', label: 'Rock-Cut Sanctuaries' },
            { id: 'monuments', label: 'Colonial & Memorial Arches' },
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MASONRY-STYLE IMAGE GRID WITH SMOOTH HOVER ZOOM EFFECTS                */}
      {/* ========================================================================= */}
      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl bg-stone-200 animate-pulse break-inside-avoid ${
                ASPECT_RATIOS[i % ASPECT_RATIOS.length]
              }`}
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-stone-50 border border-stone-200 space-y-3">
          <Landmark className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-800">No Heritage Photos Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            No monuments matched your current search and filter criteria. Try resetting filters to explore the full collection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedRegion('all');
              setOnlyUnesco(false);
            }}
            className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold hover:bg-amber-900 transition shadow-xs cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          className={`columns-1 sm:columns-2 ${
            density === 'dense' ? 'lg:columns-4 xl:columns-5' : 'lg:columns-3 xl:columns-4'
          } gap-4 space-y-4`}
        >
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(index)}
              className={`group relative overflow-hidden rounded-2xl border border-[#E8DFC8] bg-stone-950 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer break-inside-avoid ${item.aspectRatioClass}`}
            >
              {/* Image with Smooth Hover Zoom Effect (scale-110, duration-700, contrast boost) */}
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:filter group-hover:contrast-105 group-hover:brightness-95"
              />

              {/* Permanent Soft Bottom Gradient for Base Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none transition-opacity duration-300" />

              {/* Deep Hover Scrim Layer with Smooth Entrance */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* TOP BADGE CHIPS: UNESCO & 3D WebGL */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.unesco && (
                    <span className="px-2 py-0.5 rounded-full bg-[#046A38]/90 text-white text-[10px] font-bold border border-white/20 shadow-xs flex items-center gap-1 backdrop-blur-xs">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-300" />
                      <span>UNESCO</span>
                    </span>
                  )}
                  {item.has3d && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-600/90 text-white text-[10px] font-bold border border-white/20 shadow-xs flex items-center gap-1 backdrop-blur-xs">
                      <Box className="w-2.5 h-2.5 text-amber-200" />
                      <span>3D Model</span>
                    </span>
                  )}
                </div>

                {/* Floating Zoom / Inspect Button (reveals on hover) */}
                <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 shadow-md">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* BOTTOM METADATA CONTAINER: Smooth Slide-Up Reveal */}
              <div className="absolute bottom-0 inset-x-0 p-4 z-10 text-white transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                {/* Dynasty / Era Pill (visible on hover) */}
                {item.dynasty && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1">
                    <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                      {item.dynasty}
                    </span>
                  </div>
                )}

                {/* Monument Name */}
                <h4 className="font-serif text-base sm:text-lg font-bold leading-tight drop-shadow-md text-white group-hover:text-amber-100 transition-colors">
                  {item.name}
                </h4>

                {/* City & State location */}
                <div className="flex items-center gap-1.5 text-stone-300 text-xs mt-1 drop-shadow-xs">
                  <MapPin className="w-3 h-3 text-[#FF671F] shrink-0" />
                  <span className="font-medium">
                    {item.city}{item.state ? `, ${item.state}` : ''}
                  </span>
                </div>

                {/* Architectural summary & View Details button (reveals on hover) */}
                <div className="max-h-0 group-hover:max-h-28 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out pt-0 group-hover:pt-2">
                  <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed font-light">
                    {item.summary}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between border-t border-white/20 pt-2">
                    <span className="text-[10px] text-amber-200 font-semibold flex items-center gap-1">
                      <span>Click to view full photo</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                    {item.rating && (
                      <span className="text-[10px] font-bold text-amber-400">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. HIGH-RESOLUTION LIGHTBOX ZOOM & INSPECT MODAL                          */}
      {/* ========================================================================= */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn select-none"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/40 z-20">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-stone-200 text-xs font-semibold border border-white/10">
                {activeItemIndex! + 1} / {filteredItems.length}
              </span>
              <div className="hidden sm:block">
                <h3 className="font-serif text-white font-bold text-base leading-tight">
                  {activeItem.name}
                </h3>
                <span className="text-stone-400 text-xs">
                  {activeItem.city}, {activeItem.state}
                </span>
              </div>
            </div>

            {/* Zoom Controls & Close */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                  className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-stone-300 px-2 min-w-[48px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                {zoomLevel > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      setPanOffset({ x: 0, y: 0 });
                    }}
                    className="p-1.5 rounded-full text-amber-400 hover:text-amber-300 hover:bg-white/10 transition cursor-pointer"
                    title="Reset Zoom (0)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleCloseLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer border border-white/10"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image Viewport with Pan & Zoom */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden p-4 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Previous Photo Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition cursor-pointer hover:scale-110 shadow-lg"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Photo Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition cursor-pointer hover:scale-110 shadow-lg"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scalable & Pannable Image */}
            <div
              className="transition-transform duration-100 ease-out max-w-full max-h-full flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              }}
            >
              <img
                src={activeItem.imageUrl}
                alt={activeItem.name}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl pointer-events-none"
              />
            </div>
          </div>

          {/* Bottom Architectural Dossier Drawer */}
          <div className="border-t border-white/10 bg-black/80 backdrop-blur-md p-4 sm:p-6 z-20">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-serif font-bold text-amber-400 text-lg sm:text-xl">
                    {activeItem.name}
                  </span>
                  {activeItem.unesco && (
                    <span className="px-2 py-0.5 rounded-full bg-[#046A38] text-white text-[10px] font-bold">
                      UNESCO World Heritage Site
                    </span>
                  )}
                  {activeItem.dynasty && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-900/60 border border-amber-500/40 text-amber-200 text-[10px] font-semibold">
                      {activeItem.dynasty}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-300 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#FF671F]" />
                    {activeItem.city}, {activeItem.state}
                  </span>
                  {activeItem.architecturalStyle && (
                    <span>• Style: {activeItem.architecturalStyle}</span>
                  )}
                  {activeItem.material && (
                    <span>• Stone: {activeItem.material}</span>
                  )}
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-light pt-0.5 line-clamp-2 sm:line-clamp-none">
                  {activeItem.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => {
                    handleCloseLightbox();
                    if (onSelectPlace) {
                      onSelectPlace(activeItem.id);
                    } else if (onNavigateTab) {
                      onNavigateTab('heritage');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white text-xs font-bold transition shadow-md flex items-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Landmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>View Heritage Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {activeItem.has3d && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseLightbox();
                      if (onNavigateTab) {
                        onNavigateTab('3d');
                      }
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition flex items-center gap-1.5 active:scale-98 cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5 text-amber-300" />
                    <span>3D Model</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
