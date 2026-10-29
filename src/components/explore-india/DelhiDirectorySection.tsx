import React, { useState, useMemo } from 'react';
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
  Trees,
  Sun,
  Share2,
  Building2,
  Award,
  Landmark
} from 'lucide-react';
import {
  DELHI_DIRECTORY,
  DelhiCity,
  DelhiAttraction,
} from '../../data/delhiDirectory';

interface DelhiDirectorySectionProps {
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const DelhiDirectorySection: React.FC<DelhiDirectorySectionProps> = ({
  onSelectCity,
  onOpenAIChat,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('south-east-delhi');
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected City object
  const currentCity = useMemo(() => {
    return (
      DELHI_DIRECTORY.find((c) => c.id === selectedCityId) ||
      DELHI_DIRECTORY[0]
    );
  }, [selectedCityId]);

  // Filtered attractions based on search query and category filter
  const displayedAttractions = useMemo(() => {
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

  const handleCopyDetails = (attraction: DelhiAttraction) => {
    const text = `${attraction.name} (${currentCity.name}, Delhi NCR)\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCityOverview = () => {
    const text = `=== ${currentCity.name} (${currentCity.code}) — Delhi NCR ===\n${currentCity.flashcardBlurb}\n\nTop Stays:\n${currentCity.topStays
      .map((s) => `• ${s.name} (${s.category})`)
      .join('\n')}\n\nWhere to Eat (Veg):\n${currentCity.dining.veg
      .map((v) => `• ${v.restaurant} (${v.location}) — ${v.specialties}`)
      .join('\n')}\n\nWhere to Eat (Non-Veg):\n${currentCity.dining.nonVeg
      .map((n) => `• ${n.restaurant} (${n.location}) — ${n.specialties}`)
      .join('\n')}\n\nAttractions:\n${currentCity.attractions
      .map(
        (a) =>
          `• [${a.isHiddenGem ? 'Hidden Gem' : 'Sight'}] ${a.name} | ${a.category} | Timings: ${a.timings} | Fees: ${a.fee.domestic} / ${a.fee.foreign}`
      )
      .join('\n')}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(`city-${currentCity.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="w-full space-y-8 animate-fadeIn" aria-label="Delhi Travel Directory">
      {/* =========================================================================
          HERO BANNER: DELHI NCR CITADELS, WETLANDS, MODERN HUBS & CULTURE
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0f172a] text-white p-6 sm:p-10 shadow-xl border border-indigo-500/20">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discover Bharat · Complete Delhi Directory (IN-DL)</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Dilli Dilwalon Ki
            </h2>
            <p className="text-indigo-200/90 font-serif italic text-base sm:text-lg">
              Explore 4 Vibrant Districts, 14th-Century Fortress Citadels, Migratory Wetlands &amp; Modern Urban Hubs
            </p>
          </div>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            From the rugged cyclopean stone monoliths of Tughlaqabad Fort and the avian paradise of Okhla Bird Sanctuary to the world-class transit luxury of Aerocity, the buzzing Punjabi food lanes of Rajouri Garden, and the open-air craft amphitheatres of Dilli Haat.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-indigo-200/80">
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-1.5 font-medium">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> {DELHI_DIRECTORY.length} Key Districts
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-1.5 font-medium">
              <Landmark className="w-3.5 h-3.5 text-indigo-400" /> Medieval Citadels &amp; Shrines
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-1.5 font-medium">
              <Trees className="w-3.5 h-3.5 text-indigo-400" /> Wetlands &amp; 250-Acre Parks
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-1.5 font-medium">
              <UtensilsCrossed className="w-3.5 h-3.5 text-indigo-400" /> Curated Dining &amp; Stays
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL DISTRICT NAVIGATION TABS (4 REGIONS)
      ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
            Select a District ({DELHI_DIRECTORY.length} Zones)
          </p>
          <span className="text-xs text-stone-400">Scroll to view all zones →</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DELHI_DIRECTORY.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  setSelectedCityId(city.id);
                  setSearchQuery('');
                  onSelectCity?.(city.id);
                }}
                className={`px-4 py-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e1b4b] text-white border-[#312e81] shadow-md shadow-indigo-900/10 scale-[1.01]'
                    : 'bg-white hover:bg-indigo-50/60 text-stone-700 border-stone-200/80 hover:border-indigo-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold tracking-tight line-clamp-1">{city.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                      isSelected ? 'bg-indigo-400/20 text-indigo-200' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {city.code.replace('IN-DL-CITY-', '')}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-medium line-clamp-1 mt-1 ${
                    isSelected ? 'text-indigo-200/80' : 'text-stone-500'
                  }`}
                >
                  {city.nickname}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SELECTED DISTRICT SHOWCASE FLASHCARD
      ========================================================================= */}
      <div className={`rounded-3xl border border-stone-200/80 bg-gradient-to-br ${currentCity.bgGradient} p-5 sm:p-7 shadow-sm space-y-6 transition-all duration-300`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/60">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-stone-800 shadow-2xs border border-stone-200/60">
                {currentCity.code}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-900 border border-indigo-500/20">
                {currentCity.nickname}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {currentCity.attractions.length} Curated Sights · {currentCity.topStays.length} Verified Stays
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#0B192C]">
              {currentCity.name}
            </h3>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {currentCity.flashcardBlurb}
            </p>

            <p className="text-xs text-stone-500 italic pt-1">
              {currentCity.tagline}
            </p>
          </div>

          {/* Quick Heritage Stays Badges Preview */}
          <div className="shrink-0 bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/70 shadow-2xs space-y-2 lg:max-w-xs w-full">
            <p className="text-[11px] font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Hotel className="w-3.5 h-3.5 text-indigo-600" /> Top Curated Stays
            </p>
            <div className="space-y-1.5">
              {currentCity.topStays.map((stay, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 line-clamp-1">{stay.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-50 text-stone-700 font-medium shrink-0 ml-2 border border-stone-200/60">
                    {stay.category.split('—')[0].trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION TABS (Attractions | Curated Stays | Gastronomy)
        ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('attractions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'attractions'
                    ? 'bg-[#1e1b4b] text-white shadow-xs'
                    : 'bg-white/80 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Key Sights &amp; Hidden Gems ({currentCity.attractions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('stays')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'stays'
                    ? 'bg-[#1e1b4b] text-white shadow-xs'
                    : 'bg-white/80 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Top Stays ({currentCity.topStays.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dining')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'dining'
                    ? 'bg-[#1e1b4b] text-white shadow-xs'
                    : 'bg-white/80 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Where to Eat ({currentCity.dining.veg.length + currentCity.dining.nonVeg.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyCityOverview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200/80 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-500" />
              <span>{copiedId === `city-${currentCity.id}` ? 'Copied City Overview!' : 'Share Dossier'}</span>
            </button>
          </div>

          {/* TAB 1: ATTRACTIONS & SIGHTS */}
          {activeTab === 'attractions' && (
            <div className="space-y-5">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 p-3 rounded-2xl border border-stone-200/60 backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-semibold px-2">Filter:</span>
                  <div className="inline-flex rounded-xl p-1 bg-stone-100 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setAttractionFilter('all')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        attractionFilter === 'all'
                          ? 'bg-white text-stone-900 font-bold shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      All ({currentCity.attractions.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttractionFilter('core')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        attractionFilter === 'core'
                          ? 'bg-white text-stone-900 font-bold shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Core Sights ({currentCity.attractions.filter((a) => !a.isHiddenGem).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttractionFilter('hidden')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        attractionFilter === 'hidden'
                          ? 'bg-white text-stone-900 font-bold shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Hidden Gems ({currentCity.attractions.filter((a) => a.isHiddenGem).length})
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search attractions..."
                    className="w-full sm:w-56 pl-9 pr-3 py-1.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Attractions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedAttractions.map((attraction) => (
                  <div
                    key={attraction.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    {/* Attraction Image Header */}
                    <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to a solid pleasant background if image fails
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                          {attraction.id}
                        </span>
                        {attraction.isHiddenGem && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-stone-900 shadow-2xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Hidden Gem
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <h4 className="font-bold text-base line-clamp-1 group-hover:text-amber-200 transition-colors">
                          {attraction.name}
                        </h4>
                        <p className="text-[11px] text-stone-200 line-clamp-1">
                          {attraction.category}
                        </p>
                      </div>
                    </div>

                    {/* Attraction Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {attraction.summary}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-stone-100 text-[11px]">
                        <div className="flex items-center justify-between text-stone-600">
                          <span className="flex items-center gap-1 text-stone-500">
                            <Clock className="w-3.5 h-3.5 text-stone-400" /> Timings
                          </span>
                          <span className="font-medium line-clamp-1 max-w-[60%] text-right">
                            {attraction.timings}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-stone-600">
                          <span className="flex items-center gap-1 text-stone-500">
                            <IndianRupee className="w-3.5 h-3.5 text-stone-400" /> Entry Fee
                          </span>
                          <span className="font-medium text-right line-clamp-1 max-w-[60%]">
                            Dom: {attraction.fee.domestic} | For: {attraction.fee.foreign}
                          </span>
                        </div>
                      </div>

                      {/* Card Action footer */}
                      <div className="pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleCopyDetails(attraction)}
                          className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === attraction.id ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Copy Details</span>
                            </>
                          )}
                        </button>

                        {onOpenAIChat && (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenAIChat(
                                `Tell me more about ${attraction.name} in ${currentCity.name}, Delhi. What is the historical context, best time to visit, and nearby spots?`
                              )
                            }
                            className="text-[11px] text-stone-500 hover:text-indigo-600 font-medium inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Ask AI Guide</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {displayedAttractions.length === 0 && (
                <div className="text-center py-12 bg-white/60 rounded-2xl border border-stone-200/60 p-6 space-y-2">
                  <Info className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-sm font-bold text-stone-700">No attractions found matching your search</p>
                  <p className="text-xs text-stone-500">Try clearing the search query or changing your filter.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TOP CURATED STAYS */}
          {activeTab === 'stays' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCity.topStays.map((stay, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
                          Verified Stay
                        </span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-base text-stone-900 pt-1">{stay.name}</h4>
                      <p className="text-xs text-stone-500">{stay.category}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400 text-[11px]">Recommended District Lodging</span>
                      {onOpenAIChat && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenAIChat(
                              `Check booking advice and reviews for ${stay.name} in ${currentCity.name}, Delhi.`
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                        >
                          Check Details →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GASTRONOMY & WHERE TO EAT */}
          {activeTab === 'dining' && (
            <div className="space-y-6">
              {currentCity.dining.peacefulNote && (
                <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 text-indigo-900 text-xs leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Culinary Character: </span>
                    {currentCity.dining.peacefulNote}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vegetarian Highlights */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-200/70">
                    <span className="w-3 h-3 rounded-full bg-emerald-600" />
                    <h4 className="font-bold text-sm text-stone-800">
                      Where to Eat (Vegetarian Specialties)
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {currentCity.dining.veg.map((spot, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900">{spot.restaurant}</span>
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                            {spot.location}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed pt-0.5">
                          {spot.specialties}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Non-Vegetarian Highlights */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-200/70">
                    <span className="w-3 h-3 rounded-full bg-rose-600" />
                    <h4 className="font-bold text-sm text-stone-800">
                      Where to Eat (Non-Vegetarian Curries &amp; Kebabs)
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {currentCity.dining.nonVeg.length > 0 ? (
                      currentCity.dining.nonVeg.map((spot, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-stone-900">{spot.restaurant}</span>
                            <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                              {spot.location}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed pt-0.5">
                            {spot.specialties}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500 italic">
                        Non-vegetarian dining options are limited or restricted in this zone.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
