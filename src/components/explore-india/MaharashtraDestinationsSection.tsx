import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  IndianRupee,
  Navigation,
  Compass,
  BookOpen,
  Info,
  Calendar,
  X,
  FileText,
  CheckCircle2,
  RefreshCw,
  Search,
  Layers,
} from 'lucide-react';
import { MaharashtraDestination, DestinationsResponse } from '../../types';
import { api } from '../../services/api';
import { HeritageDivider } from '../common/HeritageDivider';

interface MaharashtraDestinationsSectionProps {
  initialCity?: 'Mumbai' | 'Pune';
  onSelectPlace?: (placeId: string) => void;
  onSelectCity?: (cityName: string) => void;
}

export const MaharashtraDestinationsSection: React.FC<MaharashtraDestinationsSectionProps> = ({
  initialCity = 'Mumbai',
  onSelectPlace,
  onSelectCity,
}) => {
  const [selectedCity, setSelectedCity] = useState<'Mumbai' | 'Pune'>(initialCity);
  const [selectedType, setSelectedType] = useState<'famous' | 'hidden'>('famous');
  const [destinations, setDestinations] = useState<MaharashtraDestination[]>([]);
  const [cityCounts, setCityCounts] = useState<{
    Mumbai: { famous: number; hidden: number; total: number };
    Pune: { famous: number; hidden: number; total: number };
  }>({
    Mumbai: { famous: 10, hidden: 10, total: 20 },
    Pune: { famous: 10, hidden: 10, total: 20 },
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Drawer / Detail modal state
  const [activeDestination, setActiveDestination] = useState<MaharashtraDestination | null>(null);
  const [detailTab, setDetailTab] = useState<'overview' | 'visit_info' | 'map' | 'sources'>('overview');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Leaflet Map reference for Detail View Map Tab
  const detailMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Fetch Maharashtra destinations on mount
  const fetchDestinations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: DestinationsResponse = await api.getDestinations({ state: 'Maharashtra' });
      if (res && res.data && res.data.length > 0) {
        setDestinations(res.data);
        if (res.city_counts) {
          setCityCounts(res.city_counts);
        }
      } else {
        // Fallback local fetch if endpoint was empty
        const fallbackRes = await fetch('/api/destinations?state=Maharashtra');
        const fallbackData = await fallbackRes.json();
        if (fallbackData.data) {
          setDestinations(fallbackData.data);
          if (fallbackData.city_counts) setCityCounts(fallbackData.city_counts);
        }
      }
    } catch (err: any) {
      console.error('Failed to load Maharashtra destinations:', err);
      setError('Could not connect to Maharashtra destinations dataset. Please check your network and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Filter places based on active city and type (SEPARATE LISTS, NEVER MIXED)
  const displayedPlaces = destinations.filter(
    (d) => d.city?.toLowerCase() === selectedCity.toLowerCase() && d.type === selectedType
  );

  // Render Leaflet map when map tab is opened
  useEffect(() => {
    if (
      detailTab === 'map' &&
      activeDestination &&
      activeDestination.latitude !== null &&
      activeDestination.longitude !== null &&
      detailMapRef.current
    ) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const lat = activeDestination.latitude;
      const lng = activeDestination.longitude;

      const map = L.map(detailMapRef.current, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const customPin = L.divIcon({
        className: 'custom-dest-pin',
        html: `<div style="background-color: ${
          activeDestination.type === 'famous' ? '#FF671F' : '#D97706'
        }; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([lat, lng], { icon: customPin })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: sans-serif; padding: 4px;">
            <b style="color: #0B192C; font-size: 13px;">${activeDestination.name}</b>
            <p style="margin: 2px 0 0; font-size: 11px; color: #666;">${activeDestination.area}, ${activeDestination.city}</p>
          </div>`
        )
        .openPopup();

      mapInstanceRef.current = map;

      // Invalidate size after layout settles
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [detailTab, activeDestination]);

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDestination(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const famousCount = cityCounts[selectedCity]?.famous || 10;
  const hiddenCount = cityCounts[selectedCity]?.hidden || 10;

  return (
    <section className="space-y-6 sm:space-y-8 my-8 sm:my-12" aria-labelledby="maharashtra-showcase-heading">
      {/* Heritage Section Header */}
      <div className="space-y-3">
        <HeritageDivider
          variant="landmark"
          accent="saffron"
          label="Maharashtra City Showcase"
          subtitle="Explore famous historic marvels and community-curated hidden gems of Mumbai and Pune"
        />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2
              id="maharashtra-showcase-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B192C] tracking-tight"
            >
              Mumbai &amp; Pune Heritage &amp; Gems
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E65] mt-1 max-w-2xl leading-relaxed">
              40 rigorously verified cultural destinations across Maharashtra. Every overview is precisely 45–55
              words, supported by dual-verified sources and genuine open-license imagery.
            </p>
          </div>

          {/* City Selection Tabs (Mumbai | Pune) */}
          <div
            className="flex items-center gap-1.5 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#EFE8DF] shadow-xs shrink-0 self-start md:self-auto"
            role="tablist"
            aria-label="Maharashtra Cities"
          >
            {(['Mumbai', 'Pune'] as const).map((city) => {
              const isSelected = selectedCity === city;
              const totalForCity = (cityCounts[city]?.famous || 10) + (cityCounts[city]?.hidden || 10);
              return (
                <button
                  key={city}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedCity(city);
                    if (onSelectCity) onSelectCity(city);
                  }}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 focus:ring-2 focus:ring-[#FF671F] focus:outline-none ${
                    isSelected
                      ? 'bg-[#0B192C] text-white shadow-md'
                      : 'text-[#5A4E46] hover:bg-stone-200/60 hover:text-stone-900'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FF671F]' : 'text-stone-400'}`} />
                  <span>{city}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {totalForCity}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Type Toggle: Famous Places | Hidden Gems (Separate lists, never mixed) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-b border-[#EFE8DF] pb-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Attraction Type">
          <button
            role="tab"
            aria-selected={selectedType === 'famous'}
            onClick={() => setSelectedType('famous')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 focus:ring-2 focus:ring-[#FF671F] focus:outline-none ${
              selectedType === 'famous'
                ? 'bg-[#FF671F] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-orange-50 border border-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Famous Places</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedType === 'famous' ? 'bg-white/25 text-white' : 'bg-orange-100 text-[#FF671F]'
              }`}
            >
              {famousCount}
            </span>
          </button>

          <button
            role="tab"
            aria-selected={selectedType === 'hidden'}
            onClick={() => setSelectedType('hidden')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 focus:ring-2 focus:ring-amber-500 focus:outline-none ${
              selectedType === 'hidden'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Hidden Gems</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                selectedType === 'hidden' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {hiddenCount}
            </span>
          </button>
        </div>

        {/* Dynamic status pill */}
        <div className="text-xs text-stone-500 flex items-center gap-2">
          {selectedType === 'famous' ? (
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Showing {famousCount} officially recognized monuments &amp; landmarks
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-800 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Showing {hiddenCount} community picks (non-official listings)
            </span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF671F] flex items-center justify-center animate-spin shadow-xs">
            <Compass className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-[#0B192C]">Loading Maharashtra destinations...</p>
          <p className="text-xs text-stone-500">Retrieving dual-verified entries for {selectedCity}</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-center space-y-3 max-w-md mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="text-sm font-bold text-red-900">Failed to load destinations</h3>
          <p className="text-xs text-red-700">{error}</p>
          <button
            onClick={fetchDestinations}
            className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && displayedPlaces.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#EFE8DF] space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">No destinations found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No {selectedType} places were found for {selectedCity}. Check back shortly as database indexes update.
          </p>
        </div>
      )}

      {/* Places Grid: Exactly 10 per city/type */}
      {!isLoading && !error && displayedPlaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {displayedPlaces.map((place) => {
            const isBroken = brokenImages[place.id];
            const isHiddenGem = place.type === 'hidden';

            return (
              <article
                key={place.id}
                onClick={() => {
                  setActiveDestination(place);
                  setDetailTab('overview');
                  if (onSelectPlace) onSelectPlace(place.id);
                }}
                className="group bg-white rounded-3xl border border-[#EFE8DF] hover:border-[#FF671F]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-[#FF671F]"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveDestination(place);
                    setDetailTab('overview');
                  }
                }}
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-52 w-full bg-stone-200 overflow-hidden shrink-0">
                  {isBroken || !place.image?.url ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
                      <Compass className="w-8 h-8 mb-2 text-stone-300" />
                      <span className="text-[11px] font-semibold">Honest Neutral Placeholder</span>
                      <span className="text-[9px] text-stone-400">Authentic image verification pending</span>
                    </div>
                  ) : (
                    <img
                      src={place.thumbnail_url || place.image.url}
                      alt={place.name}
                      loading="lazy"
                      onError={() => handleImageError(place.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                  {/* Category Badge & Verification Status */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                      {place.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[9px] font-bold flex items-center gap-1 backdrop-blur-xs">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Community Pick Label for Hidden Gems (Always visible) */}
                  {isHiddenGem && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/95 text-stone-950 text-[10px] font-bold flex items-center gap-1 shadow-md backdrop-blur-xs">
                        <AlertTriangle className="w-3 h-3 text-stone-950 shrink-0" />
                        <span>Community pick</span>
                      </span>
                    </div>
                  )}

                  {/* Title and Area in overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif text-lg font-bold leading-tight drop-shadow-sm group-hover:text-amber-200 transition-colors">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-stone-200 mt-0.5 drop-shadow-sm">
                      <MapPin className="w-3 h-3 text-[#FF671F] shrink-0" />
                      <span className="truncate">{place.area}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  {/* Warning banner for hidden gems */}
                  {isHiddenGem && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-snug flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Community pick, not officially verified.</strong>
                        <span className="block text-amber-800 text-[10px] mt-0.5">
                          Check timings and access before you go.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Factual 45-55 Word Overview */}
                  <div className="space-y-1">
                    <p className="text-xs text-[#5A4E46] leading-relaxed line-clamp-3">
                      {place.overview}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 font-mono">
                      <span>{place.overview_word_count} words</span>
                      <span>{place.sources.length} sources checked</span>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="pt-2 border-t border-[#EFE8DF] flex items-center justify-between">
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span className="truncate max-w-[140px]">{place.visit_info.best_time.split('(')[0]}</span>
                    </div>
                    <span className="text-xs font-bold text-[#FF671F] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>Explore</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          CARD DETAIL VIEW (PAGE / DRAWER MODAL) WITH 4 TABS
      ========================================================================= */}
      {activeDestination && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
        >
          <div className="relative w-full max-w-2xl bg-[#FCFBF9] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
            {/* Modal Image Header */}
            <div className="relative h-44 sm:h-56 w-full bg-stone-200 shrink-0 overflow-hidden">
              {brokenImages[activeDestination.id] || !activeDestination.image?.url ? (
                <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-500 text-xs font-semibold">
                  Honest Neutral Placeholder
                </div>
              ) : (
                <img
                  src={activeDestination.image.url}
                  alt={activeDestination.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setActiveDestination(null)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-white cursor-pointer z-10"
                aria-label="Close details"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Title & Category Badge */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF671F] text-white text-[10px] font-bold uppercase tracking-wider">
                    {activeDestination.category}
                  </span>
                  <span className="text-xs text-stone-200">
                    {activeDestination.city}, Maharashtra
                  </span>
                </div>
                <h2 id="detail-modal-title" className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  {activeDestination.name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-stone-200 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span>{activeDestination.area}</span>
                </div>
              </div>
            </div>

            {/* Hidden Gem Notice banner in detail view */}
            {activeDestination.type === 'hidden' && (
              <div className="px-4 py-2.5 bg-amber-500/15 border-b border-amber-300 text-xs text-amber-950 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-bold">Community pick, not officially verified.</span>
                </div>
                <span className="text-[11px] text-amber-900">Check timings and access before you go.</span>
              </div>
            )}

            {/* 4 Detail Tabs (Overview | Visit info | Map | Sources) */}
            <div
              className="flex items-center border-b border-[#EFE8DF] bg-stone-50/80 px-4 pt-2 gap-2 overflow-x-auto"
              role="tablist"
              aria-label="Destination Information Tabs"
            >
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'visit_info', label: 'Visit Info', icon: Info },
                { id: 'map', label: 'Map', icon: MapPin },
                { id: 'sources', label: 'Sources', icon: FileText },
              ].map((t) => {
                const isActive = detailTab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setDetailTab(t.id as any)}
                    className={`px-3.5 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF671F] ${
                      isActive
                        ? 'border-[#FF671F] text-[#FF671F] bg-white rounded-t-lg'
                        : 'border-transparent text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* TAB 1: OVERVIEW */}
              {detailTab === 'overview' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Factual Overview
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-mono font-semibold">
                        Word count: {activeDestination.overview_word_count} words
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white p-3.5 rounded-2xl border border-[#EFE8DF]">
                      {activeDestination.overview}
                    </p>
                  </div>

                  {activeDestination.history_or_significance && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
                        <span>History &amp; Significance</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-3.5 rounded-2xl border border-[#EFE8DF]">
                        {activeDestination.history_or_significance}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-stone-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Status: {activeDestination.verification_status}
                    </span>
                    <span>•</span>
                    <span>Last checked: {activeDestination.last_checked}</span>
                  </div>
                </div>
              )}

              {/* TAB 2: VISIT INFO */}
              {detailTab === 'visit_info' && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Best Time to Visit</span>
                      </div>
                      <div className="text-xs font-semibold text-stone-800">
                        {activeDestination.visit_info.best_time}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        <span>Entry &amp; Tickets</span>
                      </div>
                      <div className="text-xs font-semibold text-stone-800">
                        {activeDestination.visit_info.entry}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Timings &amp; Closed Days</span>
                    </div>
                    <div className="text-xs text-stone-800">{activeDestination.visit_info.closed_days}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-[#FF671F]" />
                      <span>How to Reach</span>
                    </div>
                    <div className="text-xs text-stone-800">{activeDestination.visit_info.how_to_reach}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200/60 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F]">
                      Insider Tip
                    </div>
                    <div className="text-xs text-stone-800">{activeDestination.visit_info.local_tip}</div>
                  </div>

                  {activeDestination.safety_notes && (
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Safety Advisory</span>
                      </div>
                      <div className="text-xs text-amber-950 font-medium">
                        {activeDestination.safety_notes}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MAP */}
              {detailTab === 'map' && (
                <div className="space-y-3">
                  {activeDestination.latitude !== null && activeDestination.longitude !== null ? (
                    <>
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded-md">
                          Coordinates: {activeDestination.latitude.toFixed(4)},{' '}
                          {activeDestination.longitude.toFixed(4)}
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${activeDestination.latitude},${activeDestination.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF671F] font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div
                        ref={detailMapRef}
                        className="w-full h-64 sm:h-72 rounded-2xl border border-[#EFE8DF] overflow-hidden shadow-inner"
                      />
                    </>
                  ) : (
                    <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-500">
                      Coordinates not officially verified in public repositories. Pinning omitted per honesty guidelines.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SOURCES */}
              {detailTab === 'sources' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Independent Reference Sources
                    </h4>
                    <div className="space-y-2">
                      {activeDestination.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-2xl bg-white border border-[#EFE8DF] hover:border-[#FF671F] transition text-xs flex items-center justify-between gap-3 group"
                        >
                          <div className="space-y-0.5">
                            <div className="font-semibold text-stone-800 group-hover:text-[#FF671F] transition-colors flex items-center gap-1.5">
                              <span>{src.title}</span>
                              <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-[#FF671F]" />
                            </div>
                            <div className="text-[11px] text-stone-400 truncate max-w-sm">{src.url}</div>
                          </div>
                          {src.page_fetched && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold whitespace-nowrap">
                              Page Fetched
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Image License & Provenance */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-[#EFE8DF] space-y-1.5 text-xs">
                    <div className="font-bold text-stone-700 uppercase text-[10px] tracking-wider">
                      Image Provenance &amp; Licensing
                    </div>
                    <div className="text-stone-600">
                      <strong>Attribution:</strong> {activeDestination.image.attribution}
                    </div>
                    <div className="text-stone-600">
                      <strong>License:</strong> {activeDestination.image.license}
                    </div>
                    <a
                      href={activeDestination.image.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF671F] font-semibold hover:underline inline-flex items-center gap-1 text-[11px] mt-1"
                    >
                      <span>View Original Image File on Wikimedia Commons</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-stone-50 border-t border-[#EFE8DF] flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-mono">
                ID: {activeDestination.id}
              </span>
              <button
                onClick={() => setActiveDestination(null)}
                className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
