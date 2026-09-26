import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Landmark,
  ArrowRight,
  Heart,
  Eye,
  Sparkles,
  Building2,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Compass,
  CameraOff,
  Globe,
  Layers,
} from 'lucide-react';
import { StateHierarchyEntity, CityHierarchyEntity } from '../../types/indiaHierarchy';
import { getCuratedStateImage } from '../../data/stateCuratedImages';

interface StateCitiesDirectoryProps {
  states: StateHierarchyEntity[];
  onSelectState: (stateId: string) => void;
  onSelectTown: (stateId: string, townId: string) => void;
  onQuickLook: (state: StateHierarchyEntity) => void;
  savedStates?: string[];
  onToggleFavorite?: (stateId: string) => void;
}

export const StateCitiesDirectory: React.FC<StateCitiesDirectoryProps> = ({
  states,
  onSelectState,
  onSelectTown,
  onQuickLook,
  savedStates = [],
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStateIds, setExpandedStateIds] = useState<Set<string>>(() => {
    // Expand all states by default so user can immediately see every city
    return new Set(states.map((s) => s.id));
  });

  const toggleStateExpand = (stateId: string) => {
    setExpandedStateIds((prev) => {
      const next = new Set(prev);
      if (next.has(stateId)) {
        next.delete(stateId);
      } else {
        next.add(stateId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedStateIds(new Set(states.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedStateIds(new Set());
  };

  // Filter states and their cities based on internal search query
  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return states.map((state) => ({
        state,
        matchingCities: state.cities || [],
      }));
    }

    return states
      .map((state) => {
        const stateNameMatches = state.name.toLowerCase().includes(query) ||
          state.code.toLowerCase().includes(query) ||
          (state.region && state.region.toLowerCase().includes(query));

        const matchingCities = (state.cities || []).filter((city) => {
          return (
            stateNameMatches ||
            city.name.toLowerCase().includes(query) ||
            city.district.toLowerCase().includes(query) ||
            (city.tagline && city.tagline.toLowerCase().includes(query))
          );
        });

        return {
          state,
          matchingCities,
        };
      })
      .filter((item) => item.matchingCities.length > 0 || item.state.name.toLowerCase().includes(query));
  }, [states, searchQuery]);

  const totalMatchingCities = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.matchingCities.length, 0);
  }, [filteredData]);

  const getCityPlacesCount = (city: CityHierarchyEntity) => {
    return (
      (city.heritage?.length || 0) +
      (city.monuments?.length || 0) +
      (city.museums?.length || 0) +
      (city.tourist_places?.length || 0) +
      (city.religious_cultural?.length || 0) +
      (city.nature_parks_zoo?.length || 0)
    );
  };

  return (
    <div className="space-y-6" id="state-cities-directory">
      {/* Controls & Summary Bar */}
      <div className="bg-white rounded-3xl border border-[#EFE8DF] p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF671F] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0B192C]">
                Har State ke Verified Cities &amp; Destinations ki List
              </h2>
              <p className="text-xs text-[#6B5E55]">
                {filteredData.length} States &amp; UTs ke total <strong>{totalMatchingCities} cities</strong> listed hain.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Accordion Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#FF671F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="City ya State search karein..."
              className="w-full pl-9 pr-8 py-2 bg-[#FAF8F5] border border-[#EFE8DF] rounded-xl text-xs text-[#0B192C] placeholder:text-stone-400 focus:outline-none focus:border-[#FF671F] transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={expandAll}
              className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-orange-50 border border-[#EFE8DF] hover:border-orange-200 text-stone-700 hover:text-[#FF671F] text-xs font-semibold transition cursor-pointer"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 border border-[#EFE8DF] text-stone-600 text-xs font-semibold transition cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* State by State Cities Listing */}
      {filteredData.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#EFE8DF] space-y-3">
          <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-serif text-base font-bold text-stone-900">
            Koi city ya state match nahi hua
          </h3>
          <p className="text-xs text-stone-500">
            &quot;{searchQuery}&quot; ke liye koi verified city nahi mili. Search clear karein.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-[#FF671F] text-white text-xs font-bold cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredData.map(({ state, matchingCities }) => {
            const isExpanded = expandedStateIds.has(state.id);
            const isFavorite = savedStates.includes(state.id);
            const curated = getCuratedStateImage(state.id, state.hero_image_url);

            return (
              <div
                key={state.id}
                className="bg-white rounded-3xl border border-[#EFE8DF] overflow-hidden shadow-xs transition-all duration-200"
              >
                {/* State Accordion Header */}
                <div
                  onClick={() => toggleStateExpand(state.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5]/80 transition select-none"
                >
                  <div className="flex items-center gap-3.5">
                    {/* State Thumbnail */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-stone-900 shrink-0 border border-[#EFE8DF] shadow-2xs">
                      <img
                        src={curated.url}
                        alt={state.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-white text-[11px] drop-shadow-xs">
                        {state.code}
                      </span>
                    </div>

                    {/* State Details */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#0B192C]">
                          {state.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#FF671F]">
                          {matchingCities.length} {matchingCities.length === 1 ? 'City' : 'Cities'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600">
                          {state.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF671F]" />
                          <span>Capital: <strong>{state.capital}</strong></span>
                        </span>
                        {curated.landmark && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="text-amber-700 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                              <span className="truncate max-w-[160px] sm:max-w-xs">{curated.landmark}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Chevron */}
                  <div
                    className="flex items-center gap-2 self-end sm:self-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onToggleFavorite && (
                      <button
                        onClick={() => onToggleFavorite(state.id)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition border border-[#EFE8DF] cursor-pointer ${
                          isFavorite
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : 'bg-white hover:bg-stone-50 text-stone-400 hover:text-rose-500'
                        }`}
                        title={isFavorite ? 'Wishlist se hatayein' : 'Wishlist me save karein'}
                        aria-label={`Save ${state.name} to wishlist`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    )}

                    <button
                      onClick={() => onQuickLook(state)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE5] border border-[#EFE8DF] text-stone-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FF671F]" />
                      <span className="hidden sm:inline">Quick Look</span>
                    </button>

                    <button
                      onClick={() => onSelectState(state.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <span>State Page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleStateExpand(state.id)}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition cursor-pointer ml-1"
                      aria-label={isExpanded ? 'Collapse cities' : 'Expand cities'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Cities Grid (When expanded) */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-[#EFE8DF]/70 bg-[#FAF8F5]/40">
                    <div className="pt-4">
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[#FF671F]">
                          <Landmark className="w-3.5 h-3.5" />
                          <span>All Documented Cities &amp; Destinations ({matchingCities.length}):</span>
                        </span>
                        <span className="text-[10px] text-stone-400 font-normal lowercase">
                          click any city to explore its heritage sites
                        </span>
                      </div>

                      {matchingCities.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">
                          Is state ke liye field verification chal rahi hai — 0 cities recorded.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {matchingCities.map((city) => {
                            const placesCount = getCityPlacesCount(city);

                            return (
                              <div
                                key={city.id}
                                onClick={() => onSelectTown(state.id, city.id)}
                                className="group bg-white rounded-2xl border border-[#EFE8DF] hover:border-[#FF671F] p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
                              >
                                <div>
                                  {/* Top Row: Name & Capital Tag */}
                                  <div className="flex items-start justify-between gap-1.5">
                                    <h4 className="font-serif text-sm font-bold text-[#0B192C] group-hover:text-[#FF671F] transition-colors line-clamp-1">
                                      {city.name}
                                    </h4>
                                    {city.is_capital && (
                                      <span className="shrink-0 px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold border border-amber-200">
                                        Capital
                                      </span>
                                    )}
                                  </div>

                                  {/* District & Location */}
                                  <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
                                    <MapPin className="w-3 h-3 text-[#FF671F] shrink-0" />
                                    <span className="truncate">{city.district} District</span>
                                  </div>

                                  {/* Tagline / Excerpt */}
                                  {city.tagline && (
                                    <p className="text-[11px] text-stone-600 italic line-clamp-1 mt-1 font-sans">
                                      &quot;{city.tagline}&quot;
                                    </p>
                                  )}
                                </div>

                                {/* Bottom Info Strip */}
                                <div className="mt-3 pt-2.5 border-t border-[#EFE8DF]/60 flex items-center justify-between text-[11px]">
                                  <span className="font-semibold text-stone-700 bg-stone-100 group-hover:bg-orange-50 group-hover:text-[#FF671F] px-2 py-0.5 rounded-md transition-colors">
                                    {placesCount} {placesCount === 1 ? 'place' : 'places'}
                                  </span>
                                  <span className="text-[#FF671F] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform text-[11px]">
                                    <span>Explore</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
