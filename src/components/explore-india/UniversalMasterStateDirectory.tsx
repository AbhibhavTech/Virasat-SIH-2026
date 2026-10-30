import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Sparkles,
  Clock,
  IndianRupee,
  UtensilsCrossed,
  Hotel,
  Search,
  Compass,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Award,
  Landmark,
  Shield,
  Share2,
} from 'lucide-react';
import {
  StateDirectoryConfig,
  StateDirectoryAttraction,
} from '../../types/masterStateDirectory';

interface UniversalMasterStateDirectoryProps {
  config: StateDirectoryConfig;
  initialCityId?: string;
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const UniversalMasterStateDirectory: React.FC<UniversalMasterStateDirectoryProps> = ({
  config,
  initialCityId,
  onSelectCity,
  onOpenAIChat,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(
    initialCityId && config.cities.some((c) => c.id === initialCityId)
      ? initialCityId
      : config.cities[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync with initialCityId when prop updates
  useEffect(() => {
    if (initialCityId && config.cities.some((c) => c.id === initialCityId)) {
      setSelectedCityId(initialCityId);
    }
  }, [initialCityId, config.cities]);

  // Selected City object
  const currentCity = useMemo(() => {
    return (
      config.cities.find((c) => c.id === selectedCityId) ||
      config.cities[0]
    );
  }, [config.cities, selectedCityId]);

  // Total curated attractions across the entire state directory
  const totalAttractionsCount = useMemo(() => {
    return config.cities.reduce((sum, c) => sum + (c.attractions?.length || 0), 0);
  }, [config.cities]);

  // Filtered attractions based on search query and category filter
  const displayedAttractions = useMemo(() => {
    if (!currentCity || !currentCity.attractions) return [];
    let list = currentCity.attractions;
    if (attractionFilter === 'core') {
      list = list.filter((a) => !a.isHiddenGem);
    } else if (attractionFilter === 'hidden') {
      list = list.filter((a) => a.isHiddenGem);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [currentCity, attractionFilter, searchQuery]);

  const handleCopyDetails = (attraction: StateDirectoryAttraction) => {
    const text = `${attraction.name} (${currentCity.name}, ${config.stateName})\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCityClick = (cityId: string) => {
    setSelectedCityId(cityId);
    if (onSelectCity) onSelectCity(cityId);
  };

  if (!currentCity) {
    return null;
  }

  // Fallback image helper
  const defaultCityFallback =
    currentCity.coverImage ||
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80';

  return (
    <section className="w-full space-y-6 animate-fadeIn" aria-label={`${config.stateName} Master Directory`}>
      {/* 1. Dynamic Hero Banner matching Maharashtra master layout */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white p-6 sm:p-8 shadow-xl border border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Consolidated {config.stateName} Master Directory · {config.stateCode}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
              <span>{currentCity.name}</span>
              <span className="text-xs sm:text-sm font-sans font-normal px-2.5 py-0.5 rounded-md bg-white/10 text-amber-200 border border-white/15">
                {currentCity.code}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              {currentCity.flashcardBlurb}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>{config.cities.length} Master Regional Hubs</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span>{config.unescoCount}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{totalAttractionsCount} Curated Attractions &amp; Forts</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <UtensilsCrossed className="w-3.5 h-3.5 text-rose-400" />
                <span>{config.cuisineLabel}</span>
              </span>
            </div>
          </div>

          {/* Quick AI Exploration Inquiry */}
          <div className="shrink-0 flex flex-col gap-2">
            <button
              type="button"
              onClick={() =>
                onOpenAIChat?.(
                  `Plan a comprehensive historical and cultural itinerary for ${currentCity.name}, ${config.stateName} covering its top monuments, stays, and authentic regional cuisine.`
                )
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Ask AI Guide about {currentCity.name}</span>
            </button>
            <div className="text-[11px] text-stone-400 text-center">
              State Directory · Verified Field Dossier
            </div>
          </div>
        </div>
      </div>

      {/* 2. City Selector Horizontal Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
          <span>
            Select {config.stateName} Destination ({config.cities.length} Hubs)
          </span>
          <span className="text-amber-700 font-medium">{config.regionalSubtitle}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300">
          {config.cities.map((city) => {
            const isSelected = city.id === selectedCityId;
            const shortCode = city.code
              .replace(`IN-${config.stateCode.split('-')[1] || ''}-CITY-`, '')
              .replace(`IN-${config.stateCode.split('-')[1] || ''}-`, '');

            return (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCityClick(city.id)}
                className={`group shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-300'
                }`}
              >
                <MapPin
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-amber-300' : 'text-stone-400 group-hover:text-amber-600'
                  }`}
                />
                <span>{city.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-amber-800/80 text-amber-100'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {shortCode}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Navigation Tabs (Attractions / Stays / Dining) */}
      <div className="bg-white rounded-xl shadow-xs border border-stone-200 p-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('attractions')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'attractions'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-stone-600 hover:bg-stone-100 border border-transparent'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-700" />
            <span>Attractions &amp; Sights</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
              {currentCity.attractions?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stays')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'stays'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-stone-600 hover:bg-stone-100 border border-transparent'
            }`}
          >
            <Hotel className="w-4 h-4 text-amber-700" />
            <span>Top Stays</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
              {currentCity.topStays?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dining')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'dining'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-stone-600 hover:bg-stone-100 border border-transparent'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-700" />
            <span>Where to Eat</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
              {(currentCity.dining?.veg?.length || 0) + (currentCity.dining?.nonVeg?.length || 0)}
            </span>
          </button>
        </div>

        {/* Search bar inside tab strip */}
        {activeTab === 'attractions' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sights, forts &amp; caves..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800"
            />
          </div>
        )}
      </div>

      {/* 4. Tab Content: ATTRACTIONS */}
      {activeTab === 'attractions' && (
        <div className="space-y-4">
          {/* Subfilter Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 font-medium">Filter Sights:</span>
            <button
              type="button"
              onClick={() => setAttractionFilter('all')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                attractionFilter === 'all'
                  ? 'bg-stone-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All ({currentCity.attractions?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setAttractionFilter('core')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                attractionFilter === 'core'
                  ? 'bg-amber-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Core Heritage (
              {currentCity.attractions?.filter((a) => !a.isHiddenGem).length || 0})
            </button>
            <button
              type="button"
              onClick={() => setAttractionFilter('hidden')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                attractionFilter === 'hidden'
                  ? 'bg-purple-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Hidden Gems (
              {currentCity.attractions?.filter((a) => a.isHiddenGem).length || 0})
            </button>
          </div>

          {/* Attraction Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedAttractions.map((attraction) => {
              const isCopied = copiedId === attraction.id;
              return (
                <div
                  key={attraction.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header with Badge Overlay */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                      <img
                        src={attraction.image || defaultCityFallback}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = defaultCityFallback;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                      {/* Code Badge */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-xs text-amber-300 border border-amber-400/30">
                          {attraction.id}
                        </span>
                        {attraction.isHiddenGem && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3" /> Hidden Gem
                          </span>
                        )}
                        {attraction.category?.includes('UNESCO') && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                            <Award className="w-3 h-3" /> UNESCO
                          </span>
                        )}
                      </div>

                      {/* Photo Credit */}
                      {attraction.photoCredit && (
                        <span className="absolute bottom-2 right-2 text-[10px] text-white/70 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
                          {attraction.photoCredit}
                        </span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <div className="text-[11px] font-semibold text-amber-700 tracking-wide uppercase">
                          {attraction.category}
                        </div>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                          {attraction.name}
                        </h3>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {attraction.summary}
                      </p>

                      {/* Timings and Fee pills */}
                      <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-start gap-1.5 text-stone-600">
                          <Clock className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[10px] text-stone-600 font-semibold uppercase">Timings</div>
                            <div className="font-medium text-stone-800">{attraction.timings || 'Sunrise – Sunset'}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5 text-stone-600">
                          <IndianRupee className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[10px] text-stone-600 font-semibold uppercase">Fee</div>
                            <div className="font-medium text-stone-800">
                              {attraction.fee?.domestic || 'Free'}
                              {attraction.fee?.foreign &&
                                attraction.fee.foreign !== attraction.fee.domestic && (
                                  <span className="text-stone-600 text-[10px] block">
                                    Intl: {attraction.fee.foreign}
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopyDetails(attraction)}
                      className="inline-flex items-center gap-1.5 text-stone-600 hover:text-amber-700 font-medium transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share Details</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenAIChat?.(
                          `Tell me historical secrets, travel tips, and best photography spots for ${attraction.name} in ${currentCity.name}, ${config.stateName}.`
                        )
                      }
                      className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold transition-colors cursor-pointer"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {displayedAttractions.length === 0 && (
            <div className="p-8 text-center bg-white rounded-xl border border-stone-200 space-y-2">
              <Info className="w-8 h-8 text-stone-400 mx-auto" />
              <div className="text-sm font-semibold text-stone-700">No attractions matched your filter.</div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setAttractionFilter('all');
                }}
                className="text-xs text-amber-700 underline font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Tab Content: TOP STAYS */}
      {activeTab === 'stays' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <Hotel className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-amber-950">Curated Accommodations in {currentCity.name}</div>
              <div>
                Hand-picked luxury, heritage havelis, eco-resorts, and boutique stays verified for comfort, safety, and cultural hospitality in {config.stateName}.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentCity.topStays?.map((stay, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <ShieldCheck className="w-3 h-3 text-amber-700" />
                    <span>Top Recommendation #{idx + 1}</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-900">{stay.name}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{stay.category}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">{currentCity.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenAIChat?.(
                        `Find tariffs, availability, room categories, and booking advice for stay at ${stay.name} in ${currentCity.name}, ${config.stateName}.`
                      )
                    }
                    className="text-amber-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Check Amenities</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Tab Content: WHERE TO EAT */}
      {activeTab === 'dining' && (
        <div className="space-y-6">
          {/* Notes Banner */}
          {(currentCity.dining?.culinaryNote ||
            currentCity.dining?.coastalNote ||
            currentCity.dining?.spicyNote ||
            currentCity.dining?.wineNote ||
            currentCity.dining?.peacefulNote) && (
            <div className="p-4 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 text-xs flex items-start gap-3">
              <UtensilsCrossed className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-amber-300">Gastronomic Dossier · {currentCity.name}</div>
                <div className="text-stone-300 mt-0.5">
                  {currentCity.dining.culinaryNote ||
                    currentCity.dining.coastalNote ||
                    currentCity.dining.spicyNote ||
                    currentCity.dining.wineNote ||
                    currentCity.dining.peacefulNote}
                </div>
              </div>
            </div>
          )}

          {/* Veg Spots */}
          {currentCity.dining?.veg && currentCity.dining.veg.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Where to Eat (Vegetarian)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCity.dining.veg.map((spot, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{spot.restaurant}</h4>
                        <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {spot.location}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Pure Veg
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">{spot.specialties}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Veg Spots */}
          {currentCity.dining?.nonVeg && currentCity.dining.nonVeg.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600" />
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Where to Eat (Non-Vegetarian &amp; Regional Specialties)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCity.dining.nonVeg.map((spot, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs hover:border-rose-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{spot.restaurant}</h4>
                        <div className="text-[11px] font-semibold text-rose-700 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {spot.location}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                        Non-Veg
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">{spot.specialties}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
