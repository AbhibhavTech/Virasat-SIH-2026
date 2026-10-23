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
  Leaf,
  Flame,
  Share2,
  Mountain,
  Trees,
  ShieldAlert,
  Church,
  Award
} from 'lucide-react';
import {
  MIZORAM_DIRECTORY,
  MizoramCity,
  MizoramAttraction,
} from '../../data/mizoramDirectory';

interface MizoramDirectorySectionProps {
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const MizoramDirectorySection: React.FC<MizoramDirectorySectionProps> = ({
  onSelectCity,
  onOpenAIChat,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('aizawl');
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Destination object
  const currentCity = useMemo(() => {
    return (
      MIZORAM_DIRECTORY.find((c) => c.id === selectedCityId) ||
      MIZORAM_DIRECTORY[0]
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

  const handleCopyDetails = (attraction: MizoramAttraction) => {
    const text = `${attraction.name} (${currentCity.name}, Mizoram)\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCityOverview = () => {
    const text = `=== ${currentCity.name} (${currentCity.code}) — Mizoram ===\n${currentCity.flashcardBlurb}\n\nTop Stays:\n${currentCity.topStays
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
    <section className="w-full space-y-8 animate-fadeIn" aria-label="Mizoram Travel Directory">
      {/* =========================================================================
          MANDATORY TRAVEL REQUIREMENT BANNER (ILP & FRO NOTICE)
      ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs backdrop-blur-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs sm:text-sm">
            <span className="font-bold text-amber-900 uppercase tracking-wide">
              Official Travel Requirement Notice (Inner Line Permit &amp; FRO)
            </span>
            <p className="text-amber-900/90 leading-relaxed">
              All Indian domestic tourists must obtain an <strong>Inner Line Permit (ILP)</strong> to enter Mizoram (apply online at <span className="underline font-mono">ilp.mizoram.gov.in</span> or obtain on arrival at Lengpui Airport and Bairabi railway station). International visitors no longer require a PAP but must register with the local <strong>Foreigners Registration Office (FRO)</strong> within 24 hours of arrival.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HERO BANNER: LAND OF BLUE MOUNTAINS & SACRED VALLEYS
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#0f172a] text-white p-6 sm:p-10 shadow-xl border border-blue-500/25">
        {/* Soft sapphire, azure, and emerald orbs */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-400/15 border border-blue-400/30 text-blue-200 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Church className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>Discover Bharat · Complete Mizoram Directory (IN-MZ)</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Mizoram · <span className="text-blue-200">The Land of Rolling Hills &amp; Choirs</span>
            </h2>
            <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-2xl pt-1">
              From the cliffside skyline and marble spires of Aizawl to the natural geological rock bridges of Lunglei, the fertile borderlands and sacred heart-shaped lake Rih Dil in Champhai, and the dramatic grassy ridges of Reiek Peak.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-blue-300">4</div>
              <div className="text-[11px] text-blue-100/80 font-medium uppercase tracking-wider">
                Ridge &amp; Valley Hubs
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-teal-300">17</div>
              <div className="text-[11px] text-teal-100/80 font-medium uppercase tracking-wider">
                Curated Sights &amp; Hidden Gems
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-amber-300">12</div>
              <div className="text-[11px] text-amber-100/80 font-medium uppercase tracking-wider">
                Curated Lodges &amp; Stays
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">100%</div>
              <div className="text-[11px] text-emerald-100/80 font-medium uppercase tracking-wider">
                Verified ILP &amp; Tariffs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4-DESTINATION NAVIGATION TABS (AJL, LGL, CMP, REK)
      ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-800" />
            <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Explore Mizoram by Destination
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Select a destination to view its verified dossier
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MIZORAM_DIRECTORY.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  setSelectedCityId(city.id);
                  if (onSelectCity) onSelectCity(city.id);
                }}
                className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1d4ed8] text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                    : 'bg-white hover:bg-blue-50/50 text-stone-800 border-stone-200/90 hover:border-blue-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight">{city.name.split('&')[0].trim()}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-blue-400/25 text-blue-200' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {city.code.replace('IN-MZ-CITY-', '')}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-blue-200/90' : 'text-stone-500'
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
          SELECTED DESTINATION FLASHCARD (PEACEFUL & SPACIOUS)
      ========================================================================= */}
      <div
        className={`rounded-3xl border border-stone-200/80 bg-gradient-to-br ${currentCity.bgGradient} p-5 sm:p-7 shadow-sm space-y-6 transition-all duration-300`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/60">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-stone-800 shadow-2xs border border-stone-200/60">
                {currentCity.code}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/15 text-blue-950 border border-blue-500/30">
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
          </div>

          {/* Cover Photo & Curated Stays Badges Preview */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:max-w-xs w-full shrink-0">
            {currentCity.coverImage && (
              <div className="relative h-28 w-full rounded-2xl overflow-hidden shadow-2xs border border-white/60">
                <img
                  src={currentCity.coverImage}
                  alt={currentCity.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-1.5 left-2.5 text-[10px] text-white/90 font-medium truncate max-w-[90%]">
                  {currentCity.photoCredit}
                </span>
              </div>
            )}
            <div className="bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-blue-200/70 shadow-2xs space-y-2 w-full">
              <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-blue-700" /> Top Curated Stays
              </p>
              <div className="space-y-1.5">
                {currentCity.topStays.map((stay, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 line-clamp-1">{stay.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-medium shrink-0 ml-2 border border-blue-200/60">
                      {stay.category.split('—')[0].trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION TABS (Attractions | Curated Stays | Gastronomy)
        ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-2xl bg-white border border-stone-200/80 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('attractions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'attractions'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Attractions &amp; Sights ({currentCity.attractions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stays')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'stays'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Hotel className="w-4 h-4" />
              <span>Stays ({currentCity.topStays.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dining')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'dining'
                  ? 'bg-[#1d4ed8] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Where to Eat</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCityOverview}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200/80 hover:bg-stone-50 text-stone-700 shadow-2xs transition-colors cursor-pointer"
            >
              {copiedId === `city-${currentCity.id}` ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Dossier Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy City Dossier</span>
                </>
              )}
            </button>

            {onOpenAIChat && (
              <button
                type="button"
                onClick={() =>
                  onOpenAIChat(
                    `Plan an authentic mountain journey through ${currentCity.name}, Mizoram (${currentCity.nickname}). Recommend verified timings, ILP permit guidelines, high-ridge viewpoints, and traditional Mizo cuisine.`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask AI Guide</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            TAB 1: ATTRACTIONS & SIGHTS (SEARCH & FILTERS)
        ========================================================================= */}
        {activeTab === 'attractions' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Filter pills: All, Core, Hidden */}
              <div className="inline-flex p-1 rounded-xl bg-white border border-stone-200/80 shadow-2xs gap-1">
                <button
                  type="button"
                  onClick={() => setAttractionFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    attractionFilter === 'all'
                      ? 'bg-blue-100/90 text-blue-950 font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All Sights ({currentCity.attractions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAttractionFilter('core')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    attractionFilter === 'core'
                      ? 'bg-blue-100/90 text-blue-950 font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Core Highlights ({currentCity.attractions.filter((a) => !a.isHiddenGem).length})
                </button>
                <button
                  type="button"
                  onClick={() => setAttractionFilter('hidden')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    attractionFilter === 'hidden'
                      ? 'bg-teal-100/90 text-teal-950 font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span>Hidden Gems ({currentCity.attractions.filter((a) => a.isHiddenGem).length})</span>
                </button>
              </div>

              {/* Search bar inside current city */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search in ${currentCity.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-stone-800 placeholder-stone-400 shadow-2xs"
                />
              </div>
            </div>

            {/* Attractions Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayedAttractions.map((attraction) => (
                <div
                  key={attraction.id}
                  className="group rounded-2xl bg-white border border-stone-200/80 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Photo with badges */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top status badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs border border-white/20">
                        {attraction.id}
                      </span>
                      {attraction.isHiddenGem && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-600 text-white shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Hidden Gem</span>
                        </span>
                      )}
                    </div>

                    {/* Title overlay at bottom of photo */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-white drop-shadow-sm">
                        {attraction.name}
                      </h4>
                      <p className="text-xs text-blue-200/90 font-medium line-clamp-1">
                        {attraction.category}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {attraction.summary}
                    </p>

                    {/* Verified Metadata: Timings & Entry Fees */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="flex items-start gap-2 text-xs text-stone-700">
                        <Clock className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-800">Timings: </span>
                          <span className="text-stone-600">{attraction.timings}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-stone-700">
                        <IndianRupee className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div>
                            <span className="font-bold text-stone-800">Domestic: </span>
                            <span className="text-blue-950 font-semibold">{attraction.fee.domestic}</span>
                          </div>
                          <span className="text-stone-300">|</span>
                          <div>
                            <span className="font-bold text-stone-800">Foreign: </span>
                            <span className="text-stone-600 font-medium">{attraction.fee.foreign}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => handleCopyDetails(attraction)}
                        className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                      >
                        {copiedId === attraction.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Copy Info</span>
                          </>
                        )}
                      </button>

                      {onOpenAIChat && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenAIChat(
                              `Tell me more about visiting ${attraction.name} in ${currentCity.name}, Mizoram. What are the best hours, route advice, and cultural significance?`
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 transition-colors cursor-pointer"
                        >
                          <span>Explore with AI</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayedAttractions.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200/80 space-y-2">
                <p className="text-sm font-semibold text-stone-700">No attractions match your search.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setAttractionFilter('all');
                  }}
                  className="text-xs font-bold text-blue-800 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: CURATED HERITAGE & MOUNTAIN STAYS
        ========================================================================= */}
        {activeTab === 'stays' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1">
              <h4 className="text-sm font-bold text-[#0B192C] flex items-center gap-2">
                <Hotel className="w-4 h-4 text-blue-800" />
                <span>Curated Living in {currentCity.name}</span>
              </h4>
              <p className="text-xs text-stone-600">
                Ridge-view city hotels, state tourism tourist lodges, eco-resort cottages below mountain peaks, and border guest houses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentCity.topStays.map((stay, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200/60 inline-block">
                      {stay.category.split('—')[0].trim()}
                    </span>
                    <h5 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                      {stay.name}
                    </h5>
                    <p className="text-xs text-stone-500">
                      {stay.category.includes('—') ? stay.category.split('—')[1].trim() : stay.category}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1 text-blue-800 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Stay
                    </span>
                    {onOpenAIChat && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenAIChat(
                            `Provide stay details, tariff ranges, and booking tips for ${stay.name} in ${currentCity.name}, Mizoram.`
                          )
                        }
                        className="font-bold text-blue-800 hover:underline cursor-pointer"
                      >
                        Details &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: WHERE TO EAT (GASTRONOMY GUIDE)
        ========================================================================= */}
        {activeTab === 'dining' && (
          <div className="space-y-6">
            {currentCity.dining.permitNotice && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold">Entry Permit Requirement: </span>
                  {currentCity.dining.permitNotice}
                </p>
              </div>
            )}

            {currentCity.dining.culinaryNote && (
              <div className="p-4 rounded-2xl bg-white/90 border border-blue-200/80 text-blue-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
                <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold">Culinary Tradition: </span>
                  {currentCity.dining.culinaryNote}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vegetarian Section */}
              <div className="rounded-2xl bg-white border border-stone-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Where to Eat · Vegetarian Options &amp; Cafes
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Scarce in Hills
                  </span>
                </div>

                <div className="space-y-4">
                  {currentCity.dining.veg.map((item, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-sm">{item.restaurant}</span>
                        <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {item.location}
                        </span>
                      </div>
                      <p className="text-blue-950 font-medium">
                        <span className="text-stone-500">Must Try: </span>
                        {item.specialties}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Vegetarian or Regional Section */}
              <div className="rounded-2xl bg-white border border-stone-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Where to Eat · Traditional Mizo Flavors
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Vawksa Rep &amp; Bai
                  </span>
                </div>

                <div className="space-y-4">
                  {currentCity.dining.nonVeg.map((item, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-sm">{item.restaurant}</span>
                        <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {item.location}
                        </span>
                      </div>
                      <p className="text-stone-800 font-medium">
                        <span className="text-stone-500">Must Try: </span>
                        {item.specialties}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
