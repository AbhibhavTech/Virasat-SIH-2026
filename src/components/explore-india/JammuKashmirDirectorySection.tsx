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
  Share2,
  AlertTriangle,
  MountainSnow,
  Trees,
} from 'lucide-react';
import {
  JAMMU_KASHMIR_DIRECTORY,
  JammuKashmirCity,
  JammuKashmirAttraction,
} from '../../data/jammuKashmirDirectory';

interface JammuKashmirDirectorySectionProps {
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const JammuKashmirDirectorySection: React.FC<JammuKashmirDirectorySectionProps> = ({
  onSelectCity,
  onOpenAIChat,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('srinagar');
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Destination object
  const currentCity = useMemo(() => {
    return (
      JAMMU_KASHMIR_DIRECTORY.find((c) => c.id === selectedCityId) ||
      JAMMU_KASHMIR_DIRECTORY[0]
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

  const handleCopyDetails = (attraction: JammuKashmirAttraction) => {
    const text = `${attraction.name} (${currentCity.name}, Jammu & Kashmir)\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCityOverview = () => {
    const text = `=== ${currentCity.name} (${currentCity.code}) — Jammu & Kashmir ===\n${currentCity.flashcardBlurb}\n\nTop Stays:\n${currentCity.topStays
      .map((s) => `• ${s.name} (${s.category})`)
      .join('\n')}\n\nWhere to Eat (Veg):\n${currentCity.dining.veg
      .map((v) => `• ${v.restaurant} (${v.location}) — ${v.specialties}`)
      .join('\n')}\n\nWhere to Eat (Non-Veg):\n${
      currentCity.dining.nonVeg.length > 0
        ? currentCity.dining.nonVeg
            .map((n) => `• ${n.restaurant} (${n.location}) — ${n.specialties}`)
            .join('\n')
        : 'Pure Vegetarian Region'
    }\n\nAttractions:\n${currentCity.attractions
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
    <section className="w-full space-y-8 animate-fadeIn" aria-label="Jammu & Kashmir Travel Directory">
      {/* =========================================================================
          HERO BANNER: PIR PANJAL SNOW, CHINAR CRIMSON & DAL LAKE SAPPHIRE
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#831843] text-white p-6 sm:p-10 shadow-xl border border-sky-400/25">
        {/* Soft sky reflection & chinar crimson aura */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-400/20 border border-sky-300/35 text-sky-100 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <MountainSnow className="w-3.5 h-3.5 text-sky-200 animate-pulse" />
            <span>Discover Bharat · Complete Jammu &amp; Kashmir Directory (IN-JK)</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Jammu &amp; Kashmir · <span className="text-sky-300">Paradise on Earth</span>
            </h2>
            <p className="text-sky-100/90 text-sm sm:text-base leading-relaxed max-w-2xl pt-1">
              From the timeless wooden shikaras and Mughal terraced gardens of Srinagar to the snow-cloaked powder bowls of Gulmarg, Lidder trout glades of Pahalgam, and the sacred temple citadels of Jammu along the Tawi.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-sky-300">4</div>
              <div className="text-[11px] text-sky-100/80 font-medium uppercase tracking-wider">Premier Hubs</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-rose-300">23+</div>
              <div className="text-[11px] text-rose-100/80 font-medium uppercase tracking-wider">Curated Sights &amp; Hidden Gems</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">12+</div>
              <div className="text-[11px] text-emerald-100/80 font-medium uppercase tracking-wider">Palace &amp; Houseboat Stays</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-amber-300">100%</div>
              <div className="text-[11px] text-amber-100/80 font-medium uppercase tracking-wider">Verified Rates &amp; Union Tariffs</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4-DESTINATION NAVIGATION TABS (SXR, GUL, PHG, JMU)
      ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Explore Jammu &amp; Kashmir by Destination
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Select a destination to explore its complete verified travel dossier
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {JAMMU_KASHMIR_DIRECTORY.map((city) => {
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
                    ? 'bg-[#0369a1] text-white border-sky-500 shadow-md ring-2 ring-sky-400/30'
                    : 'bg-white hover:bg-sky-50/50 text-stone-800 border-stone-200/90 hover:border-sky-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight">{city.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-sky-400/25 text-sky-100' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {city.code.replace('IN-JK-CITY-', '').replace('IN-JK-', '')}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-sky-100/90' : 'text-stone-500'
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
      <div className={`rounded-3xl border border-stone-200/80 bg-gradient-to-br ${currentCity.bgGradient} p-5 sm:p-7 shadow-sm space-y-6 transition-all duration-300`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/60">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-stone-800 shadow-2xs border border-stone-200/60">
                {currentCity.code}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/15 text-sky-950 border border-sky-500/30">
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

          {/* Quick Heritage Stays Badges Preview */}
          <div className="shrink-0 bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-sky-200/70 shadow-2xs space-y-2 lg:max-w-xs w-full">
            <p className="text-[11px] font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
              <Hotel className="w-3.5 h-3.5 text-sky-700" /> Top Curated Stays
            </p>
            <div className="space-y-1.5">
              {currentCity.topStays.map((stay, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 line-clamp-1">{stay.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-900 font-medium shrink-0 ml-2 border border-sky-200/60">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-2xl bg-white border border-stone-200/80 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('attractions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'attractions'
                  ? 'bg-[#0369a1] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Attractions &amp; Sights ({currentCity.attractions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stays')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'stays'
                  ? 'bg-[#0369a1] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Hotel className="w-4 h-4" />
              Where to Stay ({currentCity.topStays.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dining')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'dining'
                  ? 'bg-[#0369a1] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              Where to Eat
            </button>
          </div>

          {/* Quick Copy City Dossier Action */}
          <button
            type="button"
            onClick={handleCopyCityOverview}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-sky-300 transition-all cursor-pointer self-start sm:self-auto"
          >
            {copiedId === `city-${currentCity.id}` ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Dossier Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Copy {currentCity.name} Dossier</span>
              </>
            )}
          </button>
        </div>

        {/* =========================================================================
            TAB 1: ATTRACTIONS & SIGHTS
        ========================================================================= */}
        {activeTab === 'attractions' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Filter Pills + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-stone-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setAttractionFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    attractionFilter === 'all'
                      ? 'bg-sky-100 text-sky-950 font-black'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({currentCity.attractions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAttractionFilter('core')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    attractionFilter === 'core'
                      ? 'bg-sky-100 text-sky-950 font-black'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>Core Sights</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200/60 text-stone-700">
                    {currentCity.attractions.filter((a) => !a.isHiddenGem).length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttractionFilter('hidden')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    attractionFilter === 'hidden'
                      ? 'bg-sky-100 text-sky-950 font-black'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  <span>Hidden Gems</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-200/80 text-sky-900 font-bold">
                    {currentCity.attractions.filter((a) => a.isHiddenGem).length}
                  </span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter sights, categories, fees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 text-stone-800 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Attractions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedAttractions.map((attraction) => {
                const isCopied = copiedId === attraction.id;
                return (
                  <div
                    key={attraction.id}
                    className="group bg-white rounded-2xl border border-stone-200/90 hover:border-sky-400/80 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Image Preview Banner */}
                      <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-100">
                        <img
                          src={attraction.image}
                          alt={attraction.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs border border-white/20">
                            {attraction.id}
                          </span>
                          {attraction.isHiddenGem && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500 text-white shadow-xs flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Hidden Gem
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

                      {/* Header & Category */}
                      <div className="space-y-1">
                        <h4 className="font-serif text-lg font-bold text-stone-900 group-hover:text-sky-900 transition-colors">
                          {attraction.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-sky-800 line-clamp-1">
                          {attraction.category}
                        </p>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {attraction.summary}
                      </p>
                    </div>

                    {/* Meta Footer: Timings & Tariffs */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-start gap-1.5 text-stone-600">
                          <Clock className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">
                            <strong className="text-stone-800 font-semibold">Hours:</strong> {attraction.timings}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 text-stone-600">
                          <IndianRupee className="w-3.5 h-3.5 text-sky-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">
                            <strong className="text-stone-800 font-semibold">Entry:</strong> Dom: {attraction.fee.domestic} | Fore: {attraction.fee.foreign}
                          </span>
                        </div>
                      </div>

                      {/* Copy Action */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-stone-400 font-medium">
                          Verified Official Record
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyDetails(attraction)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-900 hover:text-sky-700 hover:underline cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3 h-3 text-stone-400" />
                              <span>Copy Details</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {displayedAttractions.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs">
                No sights match your query "{searchQuery}". Try clearing your search or switching filters.
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: WHERE TO STAY
        ========================================================================= */}
        {activeTab === 'stays' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-sky-700" />
                <h4 className="text-sm font-bold text-stone-900">
                  Curated Stays, Alpine Lodges &amp; Houseboats in {currentCity.name}
                </h4>
              </div>
              <p className="text-xs text-stone-600">
                Hand-picked properties representing luxury alpine resorts, cedarwood houseboats on tranquil lakes, and historic Dogra royal palace hotels.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentCity.topStays.map((stay, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-800 font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <h5 className="font-serif text-base font-bold text-stone-900">
                      {stay.name}
                    </h5>
                    <p className="text-xs text-sky-900 font-medium">
                      {stay.category}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> High-Confidence Stay
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const q = `${stay.name} ${currentCity.name} Jammu Kashmir hotel booking`;
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
                      }}
                      className="text-sky-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Book <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: WHERE TO EAT (GASTRONOMY: WAZWAN, TROUT, KAHWA & KALARI)
        ========================================================================= */}
        {activeTab === 'dining' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Pilgrimage or General Dining Notice */}
            {currentCity.dining.pilgrimageNotice && (
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-950 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold">Dining Protocol</p>
                  <p className="leading-relaxed text-stone-700">
                    {currentCity.dining.pilgrimageNotice}
                  </p>
                </div>
              </div>
            )}

            {currentCity.dining.peacefulNote && (
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 text-stone-700 flex items-start gap-3">
                <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  {currentCity.dining.peacefulNote}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VEGETARIAN DINING & TEA ROOMS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-sky-300/40">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border border-emerald-800" />
                  <h4 className="font-serif text-base font-bold text-emerald-950">
                    Where to Eat (Vegetarian &amp; Tea Rooms)
                  </h4>
                </div>

                <div className="space-y-3">
                  {currentCity.dining.veg.map((spot, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h5 className="font-bold text-sm text-stone-900">
                          {spot.restaurant}
                        </h5>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium shrink-0">
                          {spot.location}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        <strong className="text-stone-700 font-semibold">Specialties:</strong> {spot.specialties}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* NON-VEGETARIAN DINING & WAZWAN */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-sky-300/40">
                  <span className="w-3 h-3 rounded-full bg-red-600 inline-block border border-red-800" />
                  <h4 className="font-serif text-base font-bold text-sky-950">
                    Where to Eat (Kashmiri Wazwan &amp; River Trout)
                  </h4>
                </div>

                <div className="space-y-3">
                  {currentCity.dining.nonVeg.map((spot, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2 hover:border-red-300 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h5 className="font-bold text-sm text-stone-900">
                          {spot.restaurant}
                        </h5>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 text-red-800 border border-red-200 font-medium shrink-0">
                          {spot.location}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        <strong className="text-stone-700 font-semibold">Specialties:</strong> {spot.specialties}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          JAMMU & KASHMIR HERITAGE FOOTER DOSSIER & PROVENANCE
      ========================================================================= */}
      <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-rose-50 rounded-2xl border border-sky-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-serif font-black shadow-2xs">
            JK
          </div>
          <div>
            <h4 className="text-xs font-bold text-sky-950 tracking-wide uppercase">
              Jammu &amp; Kashmir Tourism Dossier (IN-JK)
            </h4>
            <p className="text-[11px] text-stone-600">
              Verified records for Srinagar, Gulmarg, Pahalgam, and Jammu in Discover Bharat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAIChat && (
            <button
              type="button"
              onClick={() => onOpenAIChat(`Tell me a detailed 5-day itinerary for ${currentCity.name}, Jammu & Kashmir including local attractions and scenic viewpoints.`)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0369a1] hover:bg-[#0284c7] text-white shadow-xs transition-all cursor-pointer"
            >
              Ask AI about {currentCity.name}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
