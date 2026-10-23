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
  Calendar,
  Layers,
  Leaf,
  Flame,
  Award,
  Heart,
  Share2,
  Sun,
  Waves,
  Palmtree,
  Ship
} from 'lucide-react';
import { GOA_DIRECTORY, GoaDistrict, GoaAttraction } from '../../data/goaDirectory';

interface GoaDirectorySectionProps {
  onSelectDistrict?: (districtId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const GoaDirectorySection: React.FC<GoaDirectorySectionProps> = ({
  onSelectDistrict,
  onOpenAIChat,
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('north-goa');
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected District object
  const currentDistrict = useMemo(() => {
    return GOA_DIRECTORY.find((d) => d.id === selectedDistrictId) || GOA_DIRECTORY[0];
  }, [selectedDistrictId]);

  // Filtered attractions based on search query and category filter
  const displayedAttractions = useMemo(() => {
    let list = currentDistrict.attractions;
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
  }, [currentDistrict, attractionFilter, searchQuery]);

  const handleCopyDetails = (attraction: GoaAttraction) => {
    const text = `${attraction.name} (${currentDistrict.name}, Goa)\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyDistrictOverview = () => {
    const text = `=== ${currentDistrict.name} (${currentDistrict.code}) — Goa ===\n${currentDistrict.flashcardBlurb}\n\nTop Stays:\n${currentDistrict.topStays
      .map((s) => `• ${s.name} (${s.category})`)
      .join('\n')}\n\nWhere to Eat (Veg):\n${currentDistrict.dining.veg
      .map((v) => `• ${v.restaurant} (${v.location}) — ${v.specialties}`)
      .join('\n')}\n\nWhere to Eat (Non-Veg):\n${currentDistrict.dining.nonVeg
      .map((n) => `• ${n.restaurant} (${n.location}) — ${n.specialties}`)
      .join('\n')}\n\nAttractions:\n${currentDistrict.attractions
      .map((a) => `• [${a.isHiddenGem ? 'Hidden Gem' : 'Sight'}] ${a.name} | ${a.category} | Timings: ${a.timings} | Fees: ${a.fee.domestic} / ${a.fee.foreign}`)
      .join('\n')}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(`district-${currentDistrict.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="w-full space-y-8 animate-fadeIn" aria-label="Goa Travel Directory">
      {/* =========================================================================
          HERO BANNER: AZULEJO BLUE & SUN-DRENCHED COASTAL PANORAMA
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F284E] via-[#0D3B66] to-[#036280] text-white p-6 sm:p-10 shadow-xl border border-sky-400/25">
        {/* Soft sunlit background glows */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-sky-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-400/15 border border-sky-400/30 text-sky-200 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Sun className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span>Discover Bharat · Complete Goa Directory (IN-GA)</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Goa · <span className="text-amber-300">Pearl of the Orient</span>
            </h2>
            <p className="text-sky-100/90 text-sm sm:text-base leading-relaxed max-w-2xl pt-1">
              A coastal tapestry of Portuguese Baroque basilicas, red-laterite sea forts, Latin Quarter azulejos, tranquil river islands, and serene palm-sheltered lagoons.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-amber-300">2</div>
              <div className="text-[11px] text-sky-100/80 font-medium uppercase tracking-wider">Districts (North &amp; South)</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-sky-300">14</div>
              <div className="text-[11px] text-sky-100/80 font-medium uppercase tracking-wider">Curated Sights &amp; Gems</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-teal-300">6</div>
              <div className="text-[11px] text-teal-100/80 font-medium uppercase tracking-wider">Verified Heritage Stays</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-rose-300">100%</div>
              <div className="text-[11px] text-rose-100/80 font-medium uppercase tracking-wider">Verified Timings &amp; Fees</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DISTRICT SELECTION PILLS (NORTH GOA vs SOUTH GOA)
      ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Explore Goa by District
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Select North or South Goa to view its complete dossier
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GOA_DIRECTORY.map((district) => {
            const isSelected = district.id === selectedDistrictId;
            return (
              <button
                key={district.id}
                type="button"
                onClick={() => {
                  setSelectedDistrictId(district.id);
                  if (onSelectDistrict) onSelectDistrict(district.id);
                }}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0D3B66] text-white border-sky-500 shadow-md ring-2 ring-sky-400/30'
                    : 'bg-white hover:bg-sky-50/50 text-stone-800 border-stone-200/90 hover:border-sky-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold tracking-tight">{district.name}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-sky-400/25 text-sky-200' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {district.code}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-sky-700'}`}>
                    {district.attractions.length} Sights &amp; Gems &rarr;
                  </span>
                </div>
                <div
                  className={`text-xs font-medium mt-1 ${
                    isSelected ? 'text-sky-200/90' : 'text-stone-500'
                  }`}
                >
                  {district.nickname} · {district.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SELECTED DISTRICT FLASHCARD (PEACEFUL & SPACIOUS)
      ========================================================================= */}
      <div className={`rounded-3xl border border-stone-200/80 bg-gradient-to-br ${currentDistrict.bgGradient} p-5 sm:p-7 shadow-sm space-y-6 transition-all duration-300`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/60">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-stone-800 shadow-2xs border border-stone-200/60">
                {currentDistrict.code}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/15 text-sky-900 border border-sky-500/30">
                {currentDistrict.nickname}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {currentDistrict.attractions.length} Curated Sights · {currentDistrict.topStays.length} Verified Stays
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#0B192C]">
              {currentDistrict.name}
            </h3>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {currentDistrict.flashcardBlurb}
            </p>
          </div>

          {/* Cover Photo & Curated Stays Badges Preview */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:max-w-xs w-full shrink-0">
            {currentDistrict.coverImage && (
              <div className="relative h-28 w-full rounded-2xl overflow-hidden shadow-2xs border border-white/60">
                <img
                  src={currentDistrict.coverImage}
                  alt={currentDistrict.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-1.5 left-2.5 text-[10px] text-white/90 font-medium truncate max-w-[90%]">
                  {currentDistrict.photoCredit}
                </span>
              </div>
            )}
            <div className="bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-sky-100/80 shadow-2xs space-y-2 w-full">
              <p className="text-[11px] font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-sky-600" /> Top Curated Stays
              </p>
              <div className="space-y-1.5">
                {currentDistrict.topStays.map((stay, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 line-clamp-1">{stay.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-medium shrink-0 ml-2 border border-sky-200/60">
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
                  ? 'bg-[#0D3B66] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Attractions &amp; Sights ({currentDistrict.attractions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stays')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'stays'
                  ? 'bg-[#0D3B66] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Hotel className="w-4 h-4" />
              <span>Stays ({currentDistrict.topStays.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dining')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'dining'
                  ? 'bg-[#0D3B66] text-white shadow-xs'
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
              onClick={handleCopyDistrictOverview}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200/80 hover:bg-stone-50 text-stone-700 shadow-2xs transition-colors cursor-pointer"
            >
              {copiedId === `district-${currentDistrict.id}` ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Dossier Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy District Dossier</span>
                </>
              )}
            </button>

            {onOpenAIChat && (
              <button
                type="button"
                onClick={() =>
                  onOpenAIChat(
                    `Plan a peaceful coastal & heritage journey through ${currentDistrict.name}, Goa (${currentDistrict.nickname}). Recommend verified timings, scenic stops, and traditional dining.`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#0D3B66] hover:bg-[#072442] text-white shadow-2xs transition-colors cursor-pointer"
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
                      ? 'bg-sky-100/90 text-sky-950 font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All Sights ({currentDistrict.attractions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAttractionFilter('core')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    attractionFilter === 'core'
                      ? 'bg-sky-100/90 text-sky-950 font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Core Highlights ({currentDistrict.attractions.filter((a) => !a.isHiddenGem).length})
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
                  <span>Hidden Gems ({currentDistrict.attractions.filter((a) => a.isHiddenGem).length})</span>
                </button>
              </div>

              {/* Search bar inside current district */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search in ${currentDistrict.name}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-stone-800 placeholder-stone-400 shadow-2xs"
                />
              </div>
            </div>

            {/* Attractions Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayedAttractions.map((attraction) => (
                <div
                  key={attraction.id}
                  className="group rounded-2xl bg-white border border-stone-200/80 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
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
                          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top status badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs border border-white/20">
                        {attraction.id}
                      </span>
                      {attraction.isHiddenGem && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500 text-white shadow-xs flex items-center gap-1">
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
                      <p className="text-xs text-sky-200/90 font-medium line-clamp-1">
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
                        <Clock className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-800">Timings: </span>
                          <span className="text-stone-600">{attraction.timings}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-stone-700">
                        <IndianRupee className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div>
                            <span className="font-bold text-stone-800">Domestic: </span>
                            <span className="text-sky-900 font-semibold">{attraction.fee.domestic}</span>
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
                              `Tell me more about visiting ${attraction.name} in ${currentDistrict.name}, Goa. What is the historical significance, best time to visit, and insider traveler tips?`
                            )
                          }
                          className="inline-flex items-center gap-1 text-xs font-bold text-sky-800 hover:text-sky-950 transition-colors cursor-pointer"
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
                  className="text-xs font-bold text-sky-700 hover:underline"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: CURATED HERITAGE & ECO STAYS
        ========================================================================= */}
        {activeTab === 'stays' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1">
              <h4 className="text-sm font-bold text-[#0B192C] flex items-center gap-2">
                <Hotel className="w-4 h-4 text-sky-700" />
                <span>Curated Coastal Living in {currentDistrict.name}</span>
              </h4>
              <p className="text-xs text-stone-600">
                Portuguese beachfront resorts, boutique coastal estates, colonial architecture retreats, and eco-luxury clifftop cottages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentDistrict.topStays.map((stay, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-sm hover:border-sky-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200/60 inline-block">
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
                    <span className="flex items-center gap-1 text-sky-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Heritage
                    </span>
                    {onOpenAIChat && (
                      <button
                        type="button"
                        onClick={() =>
                          onOpenAIChat(
                            `Provide stay details, tariff ranges, and booking tips for ${stay.name} in ${currentDistrict.name}, Goa.`
                          )
                        }
                        className="font-bold text-sky-800 hover:underline cursor-pointer"
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
            {currentDistrict.dining.peacefulNote && (
              <div className="p-4 rounded-2xl bg-white/90 border border-sky-200/80 text-sky-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
                <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold">Culinary Tradition: </span>
                  {currentDistrict.dining.peacefulNote}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pure Vegetarian Section */}
              <div className="rounded-2xl bg-white border border-stone-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Where to Eat · Vegetarian &amp; Vegan
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Garden Cafes &amp; Thalis
                  </span>
                </div>

                <div className="space-y-4">
                  {currentDistrict.dining.veg.map((item, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 text-sm">{item.restaurant}</span>
                        <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {item.location}
                        </span>
                      </div>
                      <p className="text-emerald-900 font-medium">
                        <span className="text-stone-500">Must Try: </span>
                        {item.specialties}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Vegetarian & Coastal Section */}
              <div className="rounded-2xl bg-white border border-stone-200/80 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <h4 className="font-serif text-base font-bold text-stone-900">
                      Where to Eat · Coastal &amp; Goan Specialties
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Goan Seafood &amp; Curries
                  </span>
                </div>

                <div className="space-y-4">
                  {currentDistrict.dining.nonVeg.map((item, idx) => (
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
