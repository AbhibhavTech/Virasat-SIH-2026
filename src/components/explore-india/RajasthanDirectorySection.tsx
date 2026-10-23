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
  Share2
} from 'lucide-react';
import { RAJASTHAN_DIRECTORY, RajasthanCity, RajasthanAttraction } from '../../data/rajasthanDirectory';

interface RajasthanDirectorySectionProps {
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const RajasthanDirectorySection: React.FC<RajasthanDirectorySectionProps> = ({
  onSelectCity,
  onOpenAIChat,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('jaipur');
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected City object
  const currentCity = useMemo(() => {
    return RAJASTHAN_DIRECTORY.find((c) => c.id === selectedCityId) || RAJASTHAN_DIRECTORY[0];
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

  const handleCopyDetails = (attraction: RajasthanAttraction) => {
    const text = `${attraction.name} (${currentCity.name}, Rajasthan)\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="w-full space-y-8 animate-fadeIn" aria-label="Rajasthan Travel Directory">
      {/* =========================================================================
          HERO BANNER: PEACEFUL & MAJESTIC RAJASTHAN PANORAMA
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#451A03] text-white p-6 sm:p-10 shadow-xl border border-amber-500/20">
        {/* Subtle royal background glow */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Discover Bharat · Complete Rajasthan Directory (IN-RJ)</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Padharo Mhare Desh
            </h2>
            <p className="text-amber-200/90 font-serif italic text-base sm:text-lg">
              Explore 9 Iconic Cities, UNESCO Citadels, Sacred Ghats &amp; Living Mewari Traditions
            </p>
          </div>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            From the terracotta grid avenues of Jaipur to the tranquil marble lakes of Udaipur and the remote sandstone ramparts of Jaisalmer, explore verified entry fees, heritage havelis, authentic thalis, and offbeat desert treasures.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-stone-300">
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-1.5 font-medium">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> 9 Major Cities
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-1.5 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400" /> 6 UNESCO Hill Forts
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 14 Verified Hidden Gems
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-1.5 font-medium">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" /> Curated Dining &amp; Stays
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL CITY NAVIGATION TABS (9 CITIES)
      ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
            Select a Destination ({RAJASTHAN_DIRECTORY.length} Regions)
          </p>
          <span className="text-xs text-stone-400">Scroll to view all cities →</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
          {RAJASTHAN_DIRECTORY.map((city) => {
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
                className={`snap-start shrink-0 px-4 py-2.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B192C] text-white border-[#0B192C] shadow-md shadow-stone-900/10 scale-[1.02]'
                    : 'bg-white hover:bg-amber-50/60 text-stone-700 border-stone-200/80 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight">{city.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {city.code.replace('IN-RJ-CITY-', '')}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-amber-200/80' : 'text-stone-500'
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
          SELECTED CITY SHOWCASE FLASHCARD (PEACEFUL & SPACIOUS)
      ========================================================================= */}
      <div className={`rounded-3xl border border-stone-200/80 bg-gradient-to-br ${currentCity.bgGradient} p-5 sm:p-7 shadow-sm space-y-6 transition-all duration-300`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/60">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-stone-800 shadow-2xs border border-stone-200/60">
                {currentCity.code}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30">
                {currentCity.nickname}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {currentCity.attractions.length} Curated Sights · {currentCity.topStays.length} Heritage Stays
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#0B192C]">
              {currentCity.name}
            </h3>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {currentCity.flashcardBlurb}
            </p>
          </div>

          {/* Cover Photo & Heritage Stays Badges Preview */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:max-w-xs w-full shrink-0">
            {currentCity.coverImage && (
              <div className="relative h-28 w-full rounded-2xl overflow-hidden shadow-2xs border border-white/60">
                <img
                  src={currentCity.coverImage}
                  alt={currentCity.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-1.5 left-2.5 text-[10px] text-white/90 font-medium truncate max-w-[90%]">
                  {currentCity.photoCredit}
                </span>
              </div>
            )}
            <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2 w-full">
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-[#FF671F]" /> Top Heritage Stays
              </p>
              <div className="space-y-1.5">
                {currentCity.topStays.map((stay, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 line-clamp-1">{stay.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium shrink-0 ml-2">
                      {stay.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION TABS (Attractions | Heritage Stays | Gastronomy)
        ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-2xl bg-white border border-stone-200/80 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('attractions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'attractions'
                  ? 'bg-[#C74B0A] text-white shadow-xs'
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
                  ? 'bg-[#C74B0A] text-white shadow-xs'
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
                  ? 'bg-[#C74B0A] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Where to Eat</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab === 'attractions' && (
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${currentCity.name}...`}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-800 shadow-2xs"
              />
            </div>
          )}
        </div>

        {/* =========================================================================
            TAB 1: ATTRACTIONS & SIGHTS (GRID WITH CARDS)
        ========================================================================= */}
        {activeTab === 'attractions' && (
          <div className="space-y-4">
            {/* Filter Toggle: All vs Core vs Hidden Gems */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAttractionFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  attractionFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                All Sights ({currentCity.attractions.length})
              </button>
              <button
                type="button"
                onClick={() => setAttractionFilter('core')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  attractionFilter === 'core'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                Core Attractions ({currentCity.attractions.filter((a) => !a.isHiddenGem).length})
              </button>
              <button
                type="button"
                onClick={() => setAttractionFilter('hidden')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  attractionFilter === 'hidden'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Hidden Gems ({currentCity.attractions.filter((a) => a.isHiddenGem).length})</span>
              </button>
            </div>

            {/* Attractions Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedAttractions.map((attraction) => (
                <article
                  key={attraction.id}
                  className="rounded-2xl border border-stone-200/90 bg-white shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Photo Preview Banner */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Top Badges over image */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs border border-white/20">
                        {attraction.id}
                      </span>
                      {attraction.isHiddenGem ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                          <Sparkles className="w-2.5 h-2.5" /> Hidden Gem
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Bottom image overlay */}
                    <div className="absolute bottom-2 left-2.5 right-2.5">
                      <p className="text-[10px] text-white/80 line-clamp-1 italic">
                        {attraction.photoCredit}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Title & Category */}
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#0B192C] group-hover:text-[#C74B0A] transition">
                        {attraction.name}
                      </h4>
                      <p className="text-xs font-semibold text-amber-800/90 mt-0.5 line-clamp-1">
                        {attraction.category}
                      </p>
                    </div>

                    {/* Factual Summary */}
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {attraction.summary}
                    </p>

                    {/* Practical Visit Info */}
                    <div className="pt-2 border-t border-stone-100 space-y-1.5 text-[11.5px] text-stone-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-medium text-stone-800">{attraction.timings}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>
                          <strong className="text-stone-800">Fee:</strong> {attraction.fee.domestic} (Dom) · {attraction.fee.foreign} (Foreign)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopyDetails(attraction)}
                      className="text-stone-500 hover:text-stone-900 flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedId === attraction.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copy Info</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenAIChat?.(
                          `Tell me more about visiting ${attraction.name} in ${currentCity.name}, including best time, photography tips and nearby itinerary options.`
                        )
                      }
                      className="text-[#C74B0A] hover:text-[#9A3805] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ask AI</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {displayedAttractions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6">
                <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-700">No matching attractions found</p>
                <p className="text-xs text-stone-500 mt-1">Try adjusting your search terms or filters.</p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: TOP STAYS (HERITAGE & ECO-RESORTS)
        ========================================================================= */}
        {activeTab === 'stays' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Hotel className="w-5 h-5 text-amber-600" />
                <h4 className="font-serif text-xl font-bold text-stone-900">
                  Curated Stays &amp; Heritage Havelis in {currentCity.name}
                </h4>
              </div>
              <p className="text-xs text-stone-600 max-w-2xl">
                Experience royal Rajasthani hospitality in restored 18th-century havelis, luxury palace hotels, and serene desert eco-camps verified for cultural authenticity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {currentCity.topStays.map((stay, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                        {stay.category}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <h5 className="font-serif text-base font-bold text-stone-900">{stay.name}</h5>
                    <p className="text-xs text-stone-500">
                      Located in prime cultural quarters of {currentCity.name}.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: GASTRONOMY & WHERE TO EAT (VEG & NON-VEG)
        ========================================================================= */}
        {activeTab === 'dining' && (
          <div className="space-y-4">
            {/* Special Holy Decree Note for Pushkar */}
            {currentCity.dining.peacefulNote && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-2xs">
                <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wide">Pilgrimage Sanctity Notice</h5>
                  <p className="text-xs mt-0.5 leading-relaxed">{currentCity.dining.peacefulNote}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Vegetarian Specialties */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Leaf className="w-4 h-4" />
                  </span>
                  <div>
                    <h5 className="font-serif text-base font-bold text-stone-900">Where to Eat (Pure Veg)</h5>
                    <p className="text-[11px] text-stone-500">Traditional Marwari &amp; Mewari delicacies</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentCity.dining.veg.map((spot, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-xs text-stone-900">{spot.restaurant}</span>
                        <span className="text-[10px] text-stone-500 font-medium">{spot.location}</span>
                      </div>
                      <p className="text-xs text-emerald-800 font-medium">
                        ✨ Specialties: {spot.specialties}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Vegetarian Specialties */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <h5 className="font-serif text-base font-bold text-stone-900">Where to Eat (Non-Veg)</h5>
                    <p className="text-[11px] text-stone-500">Royal Shikar curries &amp; Laal Maas</p>
                  </div>
                </div>

                {currentCity.dining.nonVeg.length > 0 ? (
                  <div className="space-y-3">
                    {currentCity.dining.nonVeg.map((spot, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-bold text-xs text-stone-900">{spot.restaurant}</span>
                          <span className="text-[10px] text-stone-500 font-medium">{spot.location}</span>
                        </div>
                        <p className="text-xs text-rose-800 font-medium">
                          🍖 Specialties: {spot.specialties}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-stone-400 bg-stone-50 rounded-xl">
                    <p className="text-xs font-medium">No non-vegetarian restaurants in this sacred pilgrimage zone.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
