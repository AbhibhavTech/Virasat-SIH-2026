import React, { useState, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Landmark,
  Calendar,
  Clock,
  IndianRupee,
  Search,
  CheckSquare,
  Square,
  BookOpen,
  Eye,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Filter,
  Map as MapIcon,
  Layers,
  Award,
  ArrowRight,
  X,
  Share2,
  Heart,
  CameraOff
} from 'lucide-react';
import { INDIA_TOURISM_DATABASE } from '../data/indiaTourismDatabase';
import {
  StateHierarchyEntity,
  CityHierarchyEntity,
  AttractionEntity,
  IndiaHierarchyDatabase
} from '../types/indiaHierarchy';
import { NavTab } from '../components/layout/Sidebar';
import { ExploreIndiaMap } from '../components/explore-india/ExploreIndiaMap';
import { PlaceDetailDrawer } from '../components/explore-india/PlaceDetailDrawer';

const db = INDIA_TOURISM_DATABASE as unknown as IndiaHierarchyDatabase;

interface IndiaHierarchyPageProps {
  onSelectPlace?: (placeId: string) => void;
  onNavigateTab?: (tab: NavTab) => void;
  onSelectCity?: (cityName: string) => void;
}

type NavigationLevel = 'india' | 'state' | 'city';
type TerritoryTab = 'states' | 'uts' | 'all';

export const IndiaHierarchyPage: React.FC<IndiaHierarchyPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  onSelectCity,
}) => {
  // Navigation Hierarchy Level
  const [activeLevel, setActiveLevel] = useState<NavigationLevel>('india');
  const [selectedStateId, setSelectedStateId] = useState<string>('rajasthan');
  const [selectedCityId, setSelectedCityId] = useState<string>('jaipur');

  // Presentation toggles
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [territoryTab, setTerritoryTab] = useState<TerritoryTab>('states');

  // Broken Image Tracker (Replaces hardcoded Taj Mahal fallbacks)
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  // Preview Drawer Modal
  const [previewPlace, setPreviewPlace] = useState<AttractionEntity | null>(null);

  // Visited Tracker
  const [visitedPlaces, setVisitedPlaces] = useState<Record<string, boolean>>({});

  const toggleVisited = (attrId: string) => {
    setVisitedPlaces((prev) => ({
      ...prev,
      [attrId]: !prev[attrId],
    }));
  };

  // Canonical Union Territory IDs
  const CANONICAL_UTS = useMemo(
    () =>
      new Set([
        'andaman-and-nicobar-islands',
        'chandigarh',
        'dadra-and-nagar-haveli-and-daman-and-diu',
        'delhi',
        'jammu-and-kashmir',
        'ladakh',
        'lakshadweep',
        'puducherry',
      ]),
    []
  );

  // Regions list
  const regions = [
    'All',
    'Northern India',
    'Western India',
    'Southern India',
    'Eastern India',
    'Central India',
    'Northeastern India',
    'Union Territories',
  ];

  // Currently Selected State
  const currentState: StateHierarchyEntity = useMemo(() => {
    return (
      db.states.find((s) => s.id === selectedStateId) ||
      db.states[0]
    );
  }, [selectedStateId]);

  // All Valid Destinations, Cities & Towns in current state
  const stateValidCities: CityHierarchyEntity[] = useMemo(() => {
    if (!currentState || !currentState.cities) return [];
    return currentState.cities;
  }, [currentState]);

  // Currently Selected City / Town / Locality
  const currentCity: CityHierarchyEntity | null = useMemo(() => {
    if (!stateValidCities || stateValidCities.length === 0) return null;
    const found = stateValidCities.find((c) => c.id === selectedCityId);
    return found || stateValidCities[0] || null;
  }, [stateValidCities, selectedCityId]);

  // Aggregate all places in the current city/town across all pillars
  const cityAllPlaces: AttractionEntity[] = useMemo(() => {
    if (!currentCity) return [];
    return [
      ...(currentCity.heritage || []),
      ...(currentCity.monuments || []),
      ...(currentCity.museums || []),
      ...(currentCity.tourist_places || []),
      ...(currentCity.religious_cultural || []),
      ...(currentCity.nature_parks_zoo || []),
    ];
  }, [currentCity]);

  // Filtered places within current city
  const filteredCityPlaces = useMemo(() => {
    return cityAllPlaces.filter((attr) => {
      if (activeCategoryFilter !== 'all' && attr.category !== activeCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [cityAllPlaces, activeCategoryFilter]);

  // Filtered States list for Level 1 (All India)
  const filteredStates = useMemo(() => {
    return db.states.filter((state) => {
      // Region match
      let matchesRegion = true;
      if (selectedRegion !== 'All') {
        if (selectedRegion === 'Union Territories') {
          matchesRegion = CANONICAL_UTS.has(state.id) || state.region_type === 'union_territory';
        } else {
          matchesRegion = state.region
            .toLowerCase()
            .includes(selectedRegion.toLowerCase().replace(' india', ''));
        }
      }

      // Search match across state name, capital, or town names
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const inStateName = state.name.toLowerCase().includes(q);
        const inCapital = state.capital.toLowerCase().includes(q);
        const inCities = state.cities.some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.district.toLowerCase().includes(q) ||
            c.tagline.toLowerCase().includes(q)
        );
        matchesSearch = inStateName || inCapital || inCities;
      }

      return matchesRegion && matchesSearch;
    });
  }, [selectedRegion, searchQuery, CANONICAL_UTS]);

  // Partitioned into 28 States and 8 Union Territories
  const statesList = useMemo(() => {
    return filteredStates.filter(
      (s) => s.region_type === 'state' || (!s.region_type && !CANONICAL_UTS.has(s.id))
    );
  }, [filteredStates, CANONICAL_UTS]);

  const utsList = useMemo(() => {
    return filteredStates.filter(
      (s) => s.region_type === 'union_territory' || CANONICAL_UTS.has(s.id)
    );
  }, [filteredStates, CANONICAL_UTS]);

  // Global search suggestions when typing
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedStates: Array<{ id: string; name: string; region: string; region_type?: string }> = [];
    const matchedTowns: Array<{
      stateId: string;
      stateName: string;
      townId: string;
      townName: string;
      district: string;
    }> = [];
    const matchedPlaces: Array<{
      stateId: string;
      townId: string;
      townName: string;
      place: AttractionEntity;
    }> = [];

    for (const state of db.states) {
      if (state.name.toLowerCase().includes(q) || state.capital.toLowerCase().includes(q)) {
        matchedStates.push({ id: state.id, name: state.name, region: state.region, region_type: state.region_type });
      }

      for (const city of state.cities) {
        if (
          city.name.toLowerCase().includes(q) ||
          city.district.toLowerCase().includes(q) ||
          city.tagline.toLowerCase().includes(q)
        ) {
          matchedTowns.push({
            stateId: state.id,
            stateName: state.name,
            townId: city.id,
            townName: city.name,
            district: city.district,
          });
        }

        const places = [
          ...(city.heritage || []),
          ...(city.monuments || []),
          ...(city.museums || []),
          ...(city.tourist_places || []),
          ...(city.religious_cultural || []),
          ...(city.nature_parks_zoo || []),
        ];

        for (const p of places) {
          if (
            p.name.toLowerCase().includes(q) ||
            p.summary.toLowerCase().includes(q) ||
            (p.category_label && p.category_label.toLowerCase().includes(q))
          ) {
            matchedPlaces.push({
              stateId: state.id,
              townId: city.id,
              townName: city.name,
              place: p,
            });
          }
        }
      }
    }

    return {
      states: matchedStates.slice(0, 4),
      towns: matchedTowns.slice(0, 6),
      places: matchedPlaces.slice(0, 6),
    };
  }, [searchQuery]);

  // Navigation handlers
  const handleSelectState = (stateId: string) => {
    setSelectedStateId(stateId);
    const s = db.states.find((item) => item.id === stateId);
    if (s && s.cities && s.cities.length > 0) {
      setSelectedCityId(s.cities[0].id);
    }
    setActiveLevel('state');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTown = (stateId: string, townId: string) => {
    setSelectedStateId(stateId);
    setSelectedCityId(townId);
    setActiveLevel('city');
    if (onSelectCity) {
      const s = db.states.find((item) => item.id === stateId);
      const c = s?.cities.find((item) => item.id === townId);
      if (c) onSelectCity(c.name);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToIndia = () => {
    setActiveLevel('india');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToState = () => {
    setActiveLevel('state');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reusable State / UT Card Renderer
  const renderStateCard = (state: StateHierarchyEntity) => {
    const isUT = state.region_type === 'union_territory' || CANONICAL_UTS.has(state.id);
    const townsList = state.cities.map((c) => c.name);
    const displayTowns = townsList.slice(0, 4).join(' • ');
    const isBroken = brokenImages[state.id] || !state.hero_image_url;

    return (
      <div
        key={state.id}
        className="bg-white rounded-3xl border border-[#EFE8DF] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
      >
        {/* Hero photo with honest photograph fallback */}
        <div className="relative h-48 w-full overflow-hidden bg-stone-100 shrink-0">
          {isBroken ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-600 p-4 text-center">
              <CameraOff className="w-8 h-8 text-stone-400 mb-1.5" />
              <span className="text-xs font-semibold text-stone-700">Photograph unavailable</span>
              <span className="text-[10px] text-stone-500">Field verification pending</span>
            </div>
          ) : (
            <img
              src={state.hero_image_url}
              alt={state.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => handleImageError(state.id)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#FF671F] backdrop-blur-xs font-mono">
              {state.code}
            </span>
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-xs">
              {isUT ? 'Union Territory' : state.region}
            </span>
          </div>

          {/* Photographic Provenance Badge */}
          {state.creator && !isBroken && (
            <div
              className="absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-full bg-black/50 text-white/90 backdrop-blur-xs font-mono truncate max-w-[150px]"
              title={`Photo: ${state.creator} (${state.license || 'Verified'})`}
            >
              📷 {state.creator}
            </div>
          )}

          {/* Bottom Title & Capital */}
          <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
            <h3 className="font-serif text-xl font-bold text-white">
              {state.name}
            </h3>
            <div className="text-xs text-stone-200 mt-0.5">
              Capital: {state.capital}
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 flex flex-col justify-between grow space-y-4">
          <p className="text-xs text-[#5A4E46] leading-relaxed line-clamp-2">
            {state.description || state.heritage_overview}
          </p>

          {/* Data-Driven Verified Towns / Local Discovery Highlights */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              <span>Verified Towns &amp; Heritage Hubs ({state.cities.length})</span>
            </span>
            {state.cities.length > 0 ? (
              <p className="text-xs font-medium text-stone-800 line-clamp-1">
                {displayTowns}
                {townsList.length > 4 ? ` + ${townsList.length - 4} more` : ''}
              </p>
            ) : (
              <p className="text-xs text-stone-400 italic">
                Field verification ongoing — 0 towns recorded
              </p>
            )}
          </div>

          {/* Explore Action Button */}
          <button
            onClick={() => handleSelectState(state.id)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#FF671F] text-[#FF671F] hover:text-white border border-[#EFE8DF] hover:border-[#FF671F] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Explore {state.name} Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full text-[#0B192C] pb-16">
      {/* Top Heritage Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-6" />

      <div className="w-full space-y-6 sm:space-y-8">
        {/* =========================================================================
            HEADER & BREADCRUMB EXPLORATION BAR
        ========================================================================= */}
        <div className="bg-[#FCFBF9] rounded-3xl border border-[#EFE8DF] p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle architectural motif background */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-5 pointer-events-none bg-[radial-gradient(#FF671F_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-3">
              {/* Dynamic Heritage Breadcrumb */}
              <nav
                className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#FF671F]"
                aria-label="Breadcrumb"
              >
                <button
                  onClick={handleReturnToIndia}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition cursor-pointer ${
                    activeLevel === 'india'
                      ? 'bg-[#FF671F]/10 font-bold text-[#FF671F]'
                      : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span>Discover Bharat</span>
                </button>

                {activeLevel !== 'india' && currentState && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <button
                      onClick={handleReturnToState}
                      className={`px-3 py-1 rounded-full transition cursor-pointer ${
                        activeLevel === 'state'
                          ? 'bg-[#FF671F]/10 font-bold text-[#FF671F]'
                          : 'hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      {currentState.name}
                    </button>
                  </>
                )}

                {activeLevel === 'city' && currentCity && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="px-3 py-1 rounded-full bg-[#FF671F] text-white font-bold">
                      {currentCity.name}
                    </span>
                  </>
                )}
              </nav>

              {/* Title & Subtitle based on active navigation level */}
              {activeLevel === 'india' && (
                <div>
                  <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B192C] tracking-tight">
                    Discover Bharat — 28 States &amp; 8 Union Territories
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B5E55] max-w-3xl leading-relaxed mt-1.5">
                    Explore India&apos;s rich cultural heritage across all 28 States and 8 Union Territories. Discover verified UNESCO World Heritage monuments, historic towns, sacred sites, and living traditions with documented photographic provenance.
                  </p>
                </div>
              )}

              {activeLevel === 'state' && currentState && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF671F]">
                    <span>{currentState.region}</span>
                    <span>•</span>
                    <span>Capital: {currentState.capital}</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-0.5">
                    {currentState.name} — Towns &amp; Cultural Sanctuaries
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B5E55] max-w-3xl leading-relaxed mt-1.5">
                    {currentState.heritage_overview}
                  </p>
                </div>
              )}

              {activeLevel === 'city' && currentCity && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FF671F]">
                    <span>{currentCity.district} District</span>
                    <span>•</span>
                    <span>{currentState.name}</span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#0B192C] tracking-tight mt-0.5">
                    {currentCity.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#FF671F] font-medium italic mt-1">
                    &quot;{currentCity.tagline}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Right Controls: View Switcher (Grid vs Map) */}
            <div className="flex items-center gap-2 shrink-0">
              {activeLevel === 'india' && (
                <div className="flex items-center p-1 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#FF671F] shadow-xs'
                        : 'text-[#7A6E65] hover:text-[#0B192C]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Regional Cards</span>
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-white text-[#FF671F] shadow-xs'
                        : 'text-[#7A6E65] hover:text-[#0B192C]'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Map Explorer</span>
                  </button>
                </div>
              )}

              {activeLevel !== 'india' && (
                <button
                  onClick={activeLevel === 'city' ? handleReturnToState : handleReturnToIndia}
                  className="px-4 py-2.5 rounded-xl border border-[#D5C7B8] hover:bg-[#F5EFEB] text-xs font-bold text-[#E65100] transition flex items-center gap-1.5 cursor-pointer shadow-xs bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to {activeLevel === 'city' ? currentState.name : 'Discover Bharat'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Unified Controls: Territory Tabs, Search & Filter Bar (Zero dead space) */}
          <div className="mt-6 pt-5 border-t border-[#EFE8DF] space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search input with clean autocomplete */}
              <div className="relative w-full lg:w-96 shrink-0">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#FF671F]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 36 states/UTs, 257 towns, or monuments..."
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#D5C7B8] rounded-xl text-xs text-[#0B192C] placeholder:text-[#A09388] focus:outline-none focus:border-[#FF671F] focus:ring-1 focus:ring-[#FF671F] transition shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Instant Search Results Dropdown */}
                {searchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#EFE8DF] shadow-xl p-3 z-30 max-h-96 overflow-y-auto space-y-3">
                    {/* States matched */}
                    {searchResults.states.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] px-2 block mb-1">
                          States &amp; Territories
                        </span>
                        <div className="space-y-1">
                          {searchResults.states.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                handleSelectState(s.id);
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#FAF8F5] flex items-center justify-between transition cursor-pointer"
                            >
                              <span className="font-bold text-stone-900">{s.name}</span>
                              <span className="text-[11px] text-[#7A6E65]">
                                {s.region_type === 'union_territory' ? 'Union Territory' : s.region}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Towns / Localities matched */}
                    {searchResults.towns.length > 0 && (
                      <div className="border-t border-stone-100 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] px-2 block mb-1">
                          Cities, Towns &amp; Localities
                        </span>
                        <div className="space-y-1">
                          {searchResults.towns.map((t) => (
                            <button
                              key={`${t.stateId}-${t.townId}`}
                              onClick={() => {
                                handleSelectTown(t.stateId, t.townId);
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#FAF8F5] flex items-center justify-between transition cursor-pointer"
                            >
                              <div>
                                <span className="font-bold text-stone-900">{t.townName}</span>
                                <span className="text-[11px] text-[#7A6E65] ml-2">
                                  ({t.district} Dist, {t.stateName})
                                </span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-[#FF671F]" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Places matched */}
                    {searchResults.places.length > 0 && (
                      <div className="border-t border-stone-100 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] px-2 block mb-1">
                          Monuments &amp; Tourist Places
                        </span>
                        <div className="space-y-1">
                          {searchResults.places.map((item) => (
                            <button
                              key={item.place.id}
                              onClick={() => {
                                handleSelectTown(item.stateId, item.townId);
                                setPreviewPlace(item.place);
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#FAF8F5] flex items-center justify-between transition cursor-pointer"
                            >
                              <div>
                                <div className="font-bold text-stone-900">{item.place.name}</div>
                                <div className="text-[10px] text-[#7A6E65]">
                                  {item.townName} • {item.place.category_label || item.place.category}
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-[#FF671F] bg-amber-50 px-2 py-0.5 rounded">
                                View Place
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.states.length === 0 &&
                      searchResults.towns.length === 0 &&
                      searchResults.places.length === 0 && (
                        <div className="p-4 text-center text-xs text-stone-500">
                          No entities matched &quot;{searchQuery}&quot;.
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* State vs UT Toggle Tabs (Default: 28 States of Bharat) */}
              {activeLevel === 'india' && viewMode === 'grid' && (
                <div className="flex items-center p-1 rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] overflow-x-auto self-start sm:self-auto">
                  <button
                    onClick={() => setTerritoryTab('states')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      territoryTab === 'states'
                        ? 'bg-white text-[#FF671F] shadow-xs'
                        : 'text-[#7A6E65] hover:text-[#0B192C]'
                    }`}
                  >
                    <span>28 States of Bharat</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-100 text-[#FF671F]">
                      {statesList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setTerritoryTab('uts')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      territoryTab === 'uts'
                        ? 'bg-white text-[#FF671F] shadow-xs'
                        : 'text-[#7A6E65] hover:text-[#0B192C]'
                    }`}
                  >
                    <span>8 Union Territories</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-700">
                      {utsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setTerritoryTab('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      territoryTab === 'all'
                        ? 'bg-white text-[#FF671F] shadow-xs'
                        : 'text-[#7A6E65] hover:text-[#0B192C]'
                    }`}
                  >
                    <span>All 36 Entities</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-700">
                      {filteredStates.length}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Region Filter Pills (Applicable on Level 1) */}
            {activeLevel === 'india' && viewMode === 'grid' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                {regions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => {
                      setSelectedRegion(reg);
                      if (reg === 'Union Territories') {
                        setTerritoryTab('uts');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedRegion === reg
                        ? 'bg-[#FF671F] text-white shadow-xs'
                        : 'bg-white hover:bg-[#F5EFEB] text-[#6B5E55] border border-[#EFE8DF]'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            LEVEL 1: ALL INDIA VIEW (28 STATES & 8 UTs SEPARATED SECTIONS)
        ========================================================================= */}
        {activeLevel === 'india' && (
          <>
            {viewMode === 'map' ? (
              <ExploreIndiaMap
                onSelectState={handleSelectState}
                onSelectTown={handleSelectTown}
              />
            ) : (
              <div className="space-y-8">
                {/* Verified Coordinates Grounded Claim Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 border border-orange-200/70 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FF671F] text-white flex items-center justify-center shadow-xs">
                      <MapIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">
                        Accurate Real-World Bharat Geographic &amp; Satellite Map
                      </div>
                      <div className="text-[11px] text-stone-600">
                        View real satellite &amp; street cartography mapped with 197+ ASI &amp; UNESCO verified coordinates across 33 states &amp; UTs.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewMode('map')}
                    className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
                  >
                    <span>Open Bharat Map</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Section: 28 States of Bharat */}
                {(territoryTab === 'states' || territoryTab === 'all') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF671F]">
                          28 States of Bharat ({statesList.length})
                        </span>
                        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                          Canonical constituent states of the Republic of India
                        </span>
                      </div>
                    </div>

                    {statesList.length === 0 ? (
                      <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-dashed border-[#EFE8DF]">
                        No states found matching your search or regional filter.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {statesList.map(renderStateCard)}
                      </div>
                    )}
                  </div>
                )}

                {/* Section: 8 Union Territories (Rendered separately or via toggle) */}
                {(territoryTab === 'uts' || territoryTab === 'all') && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#046A38]">
                          8 Union Territories ({utsList.length})
                        </span>
                        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                          Federally administered territories with distinctive heritage &amp; coastal landmarks
                        </span>
                      </div>
                    </div>

                    {utsList.length === 0 ? (
                      <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-dashed border-[#EFE8DF]">
                        No union territories found matching your filters.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {utsList.map(renderStateCard)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* =========================================================================
            LEVEL 2: STATE VIEW (EXPLORING TOWNS & LOCALITIES IN THE STATE)
        ========================================================================= */}
        {activeLevel === 'state' && currentState && (
          <div className="space-y-8">
            {/* Active Cultural Stories in this State */}
            {currentState.active_stories && currentState.active_stories.length > 0 && (
              <div className="bg-[#FCFBF9] rounded-3xl border border-[#EFE8DF] p-6 sm:p-7 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF671F]">
                  <BookOpen className="w-4 h-4 text-[#FF671F]" />
                  <span>Cultural Heritage &amp; Legends of {currentState.name}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentState.active_stories.map((story, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl bg-white border border-[#EFE8DF] text-xs text-[#5A4E46] leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#FF671F] shrink-0 mt-1.5" />
                      <span>{story}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid of Cities, Towns & Localities */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C]">
                    Destinations, Heritage Towns &amp; Localities in {currentState.name}
                  </h2>
                  <p className="text-xs text-[#7A6E65] mt-0.5">
                    Showing verified historic cities, sacred pilgrimage centers, and heritage hubs ({stateValidCities.length}).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stateValidCities.map((city) => {
                  const places = [
                    ...(city.heritage || []),
                    ...(city.monuments || []),
                    ...(city.museums || []),
                    ...(city.tourist_places || []),
                    ...(city.religious_cultural || []),
                    ...(city.nature_parks_zoo || []),
                  ];
                  const isBroken = brokenImages[city.id] || !city.hero_image_url;

                  return (
                    <div
                      key={city.id}
                      className="bg-white rounded-3xl border border-[#EFE8DF] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                    >
                      {/* Town Hero Photo with honest fallback */}
                      <div className="relative h-44 w-full overflow-hidden bg-stone-100 shrink-0">
                        {isBroken ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-600 p-4 text-center">
                            <CameraOff className="w-7 h-7 text-stone-400 mb-1" />
                            <span className="text-xs font-semibold text-stone-700">Photograph unavailable</span>
                            <span className="text-[10px] text-stone-500">Field verification pending</span>
                          </div>
                        ) : (
                          <img
                            src={city.hero_image_url}
                            alt={city.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => handleImageError(city.id)}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                        <div className="absolute top-3 left-3 pointer-events-none">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#FF671F]">
                            {city.district} District
                          </span>
                        </div>

                        {/* City Photographic Provenance Credit */}
                        {city.creator && !isBroken && (
                          <div
                            className="absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-full bg-black/50 text-white/90 backdrop-blur-xs font-mono truncate max-w-[140px]"
                            title={`Photo: ${city.creator} (${city.license || 'Verified'})`}
                          >
                            📷 {city.creator}
                          </div>
                        )}

                        <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                          <h3 className="font-serif text-xl font-bold">{city.name}</h3>
                          <div className="text-[11px] text-amber-200 line-clamp-1 italic mt-0.5">
                            &quot;{city.tagline}&quot;
                          </div>
                        </div>
                      </div>

                      {/* Town Body */}
                      <div className="p-5 flex flex-col justify-between grow space-y-4">
                        <p className="text-xs text-[#5A4E46] leading-relaxed line-clamp-3">
                          {city.description}
                        </p>

                        {/* Quick Tourism Snapshot */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8DF]">
                            <div className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider">
                              Places
                            </div>
                            <div className="font-bold text-stone-900 mt-0.5">
                              {places.length} Curated
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8DF]">
                            <div className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider">
                              Season
                            </div>
                            <div className="font-bold text-stone-900 mt-0.5 truncate">
                              {city.live_travel_info.best_season || 'Oct - Mar'}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleSelectTown(currentState.id, city.id)}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                          >
                            <span>Explore Places ({places.length})</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            LEVEL 3: CITY / TOWN / LOCALITY VIEW (HERITAGE & TOURISM PLACES)
        ========================================================================= */}
        {activeLevel === 'city' && currentCity && (
          <div className="space-y-8">
            {/* Town Hero & Travel Context Banner with honest fallback */}
            <div className="bg-white rounded-3xl border border-[#EFE8DF] overflow-hidden shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[220px] bg-stone-100">
                  {brokenImages[currentCity.id] || !currentCity.hero_image_url ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-600 p-6 text-center">
                      <CameraOff className="w-10 h-10 text-stone-400 mb-2" />
                      <span className="text-sm font-semibold text-stone-700">Photograph unavailable</span>
                      <span className="text-xs text-stone-500">Field verification pending</span>
                    </div>
                  ) : (
                    <img
                      src={currentCity.hero_image_url}
                      alt={currentCity.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(currentCity.id)}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden pointer-events-none" />

                  {/* Provenance Badge */}
                  {currentCity.creator && !brokenImages[currentCity.id] && (
                    <div className="absolute bottom-3 left-4 text-[10px] px-2.5 py-1 rounded-full bg-black/60 text-white font-mono">
                      📷 {currentCity.creator} ({currentCity.license || 'Verified'})
                    </div>
                  )}
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF671F]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {currentCity.district} District, {currentState.name}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B192C]">
                      {currentCity.name}
                    </h2>
                    <p className="text-xs text-[#5A4E46] leading-relaxed">
                      {currentCity.description}
                    </p>
                  </div>

                  {/* Travel Snapshot Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Best Season &amp; Advisory
                      </span>
                      <div className="text-xs font-bold text-stone-900">
                        {currentCity.live_travel_info.best_season}
                      </div>
                      {currentCity.live_travel_info.advisory && (
                        <div className="text-[11px] text-stone-500 italic">
                          {currentCity.live_travel_info.advisory}
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5" /> Daily Travel Budget
                      </span>
                      <div className="text-xs font-bold text-stone-900">
                        {currentCity.fees_overview.typical_budget_per_day}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Local commute, meals &amp; entry fees
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Places Filter Tabs */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C]">
                  Heritage Sites &amp; Attractions in {currentCity.name} ({filteredCityPlaces.length})
                </h3>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'All Places' },
                    { id: 'heritage', label: 'Heritage & UNESCO' },
                    { id: 'monuments', label: 'Monuments' },
                    { id: 'museums', label: 'Museums' },
                    { id: 'religious_cultural', label: 'Sacred & Cultural' },
                    { id: 'nature_parks_zoo', label: 'Nature & Parks' },
                    { id: 'tourist_places', label: 'Tourist Spots' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategoryFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        activeCategoryFilter === tab.id
                          ? 'bg-[#FF671F] text-white shadow-xs'
                          : 'bg-white hover:bg-[#F5EFEB] text-[#6B5E55] border border-[#EFE8DF]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Places Grid with honest fallback cards */}
              {filteredCityPlaces.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-dashed border-[#EFE8DF]">
                  No places found in this category for {currentCity.name}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCityPlaces.map((attr) => {
                    const isVisited = Boolean(visitedPlaces[attr.id]);
                    const isHeritage = attr.category === 'heritage';
                    const imgUrl = attr.image_url || attr.thumbnail_url;
                    const isBroken = brokenImages[attr.id] || !imgUrl;

                    return (
                      <div
                        key={attr.id}
                        className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                          isVisited ? 'border-[#FF671F] bg-amber-50/20' : 'border-[#EFE8DF]'
                        }`}
                      >
                        <div>
                          {/* Place Photo with honest fallback */}
                          <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                            {isBroken ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-600 p-4 text-center">
                                <CameraOff className="w-7 h-7 text-stone-400 mb-1" />
                                <span className="text-xs font-semibold text-stone-700">Photograph unavailable</span>
                                <span className="text-[10px] text-stone-500">Field verification pending</span>
                              </div>
                            ) : (
                              <img
                                src={imgUrl}
                                alt={attr.name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                onError={() => handleImageError(attr.id)}
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-[#FF671F]">
                                {attr.category_label || attr.category}
                              </span>
                              {isHeritage && (
                                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#FF671F] text-white flex items-center gap-1">
                                  <Award className="w-3 h-3" /> UNESCO
                                </span>
                              )}
                            </div>

                            {/* Visited Checkbox on photo */}
                            <button
                              onClick={() => toggleVisited(attr.id)}
                              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-[#FF671F] hover:bg-white transition cursor-pointer shadow-xs"
                              title={isVisited ? 'Mark as not visited' : 'Mark as visited'}
                            >
                              {isVisited ? (
                                <CheckSquare className="w-4 h-4 text-[#FF671F]" />
                              ) : (
                                <Square className="w-4 h-4 text-stone-400" />
                              )}
                            </button>

                            {/* Title overlay */}
                            <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
                              <h4
                                className={`font-serif text-lg font-bold leading-snug ${
                                  isVisited ? 'line-through text-stone-300' : 'text-white'
                                }`}
                              >
                                {attr.name}
                              </h4>
                            </div>
                          </div>

                          {/* Place Details Body */}
                          <div className="p-5 space-y-4">
                            <p className="text-xs text-[#5A4E46] leading-relaxed line-clamp-3">
                              {attr.summary || attr.historical_significance}
                            </p>

                            {/* Visiting Essentials Pill */}
                            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-stone-500 flex items-center gap-1 font-medium">
                                  <Clock className="w-3.5 h-3.5 text-[#FF671F]" />
                                  <span>Timings:</span>
                                </span>
                                <span className="font-semibold text-stone-800">
                                  {attr.timings.opening_time} - {attr.timings.closing_time}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#EFE8DF]">
                                <span className="text-stone-500 flex items-center gap-1 font-medium">
                                  <IndianRupee className="w-3.5 h-3.5 text-[#FF671F]" />
                                  <span>Entry Tariff:</span>
                                </span>
                                <span className="font-semibold text-stone-800">
                                  {attr.fees.free_entry
                                    ? 'Free Entry'
                                    : `₹${attr.fees.domestic} (Dom) / ₹${attr.fees.international} (Intl)`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="p-5 pt-0 flex items-center gap-2">
                          <button
                            onClick={() => setPreviewPlace(attr)}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE5] border border-[#EFE8DF] text-xs font-bold text-[#E65100] transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#FF671F]" />
                            <span>Quick Details</span>
                          </button>

                          {onSelectPlace && (
                            <button
                              onClick={() => onSelectPlace(attr.id)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>Explore</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
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

      {/* =========================================================================
          PREVIEW MODAL / DRAWER
      ========================================================================= */}
      <PlaceDetailDrawer
        place={previewPlace}
        stateName={currentState?.name}
        cityName={currentCity?.name}
        districtName={currentCity?.district}
        onClose={() => setPreviewPlace(null)}
        onSelectPlace={onSelectPlace}
        onOpenAIChat={() => {
          if (onNavigateTab) {
            onNavigateTab('ai');
          }
        }}
      />
    </div>
  );
};

export default IndiaHierarchyPage;
