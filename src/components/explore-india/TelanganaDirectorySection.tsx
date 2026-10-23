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
  Landmark,
  Building2,
  Waves,
} from 'lucide-react';
import {
  TELANGANA_DIRECTORY,
  TelanganaCity,
  TelanganaAttraction,
} from '../../data/telanganaDirectory';

interface TelanganaDirectorySectionProps {
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const TelanganaDirectorySection: React.FC<TelanganaDirectorySectionProps> = ({
  onSelectCity,
  onOpenAIChat,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('hyderabad');
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Destination object
  const currentCity = useMemo(() => {
    return (
      TELANGANA_DIRECTORY.find((c) => c.id === selectedCityId) ||
      TELANGANA_DIRECTORY[0]
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

  const handleCopyDetails = (attraction: TelanganaAttraction) => {
    const text = `${attraction.name} (${currentCity.name}, Telangana)\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCityOverview = () => {
    const text = `=== ${currentCity.name} (${currentCity.code}) — Telangana ===\n${currentCity.flashcardBlurb}\n\nTop Stays:\n${currentCity.topStays
      .map((s) => `• ${s.name} (${s.category})`)
      .join('\n')}\n\nWhere to Eat (Veg):\n${currentCity.dining.veg
      .map((v) => `• ${v.restaurant} (${v.location}) — ${v.specialties}`)
      .join('\n')}\n\nWhere to Eat (Non-Veg):\n${
      currentCity.dining.nonVeg.length > 0
        ? currentCity.dining.nonVeg
            .map((n) => `• ${n.restaurant} (${n.location}) — ${n.specialties}`)
            .join('\n')
        : 'Pure Vegetarian / Village Homestay Fare'
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
    <section className="w-full space-y-8 animate-fadeIn" aria-label="Telangana Travel Directory">
      {/* =========================================================================
          HERO BANNER: NIZAMI GOLD, KAKATIYA GRANITE & KRISHNA RIVER TEAL
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#0f766e] text-white p-6 sm:p-10 shadow-xl border border-amber-400/25">
        {/* Soft royal aura & architectural golden glow */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/35 text-amber-100 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Landmark className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Discover Bharat · Complete Telangana Directory (IN-TG)</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Telangana · <span className="text-amber-300">City of Pearls &amp; Kakatiya Splendour</span>
            </h2>
            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed max-w-2xl pt-1">
              From the 400-year-old minarets of Charminar and acoustic wonders of Golconda Fort to the star-shaped temples of Warangal, the UNESCO floating-brick marvel of Ramappa, and the colossus masonry dam at Nagarjuna Sagar.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-amber-300">4</div>
              <div className="text-[11px] text-amber-100/80 font-medium uppercase tracking-wider">Iconic Heritage Hubs</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">22+</div>
              <div className="text-[11px] text-emerald-100/80 font-medium uppercase tracking-wider">Forts, Tombs &amp; UNESCO Sites</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-sky-300">12+</div>
              <div className="text-[11px] text-sky-100/80 font-medium uppercase tracking-wider">Palaces &amp; Lakeside Resorts</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-orange-200">1st</div>
              <div className="text-[11px] text-orange-100/80 font-medium uppercase tracking-wider">UNESCO Ramappa Temple</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4-DESTINATION NAVIGATION TABS (HYD, WGL, RMP, NGS)
      ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Explore Telangana by Destination
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Select a destination to explore its complete verified travel dossier
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TELANGANA_DIRECTORY.map((city) => {
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
                    ? 'bg-[#78350f] text-white border-amber-500 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-white hover:bg-amber-50/50 text-stone-800 border-stone-200/90 hover:border-amber-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight">{city.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-amber-400/25 text-amber-100' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {city.code.replace('IN-TG-CITY-', '')}
                  </span>
                </div>
                <div
                  className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${
                    isSelected ? 'text-amber-100/90' : 'text-stone-500'
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
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-950 border border-amber-500/30">
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

          {/* Quick Curated Stays Badges Preview */}
          <div className="shrink-0 bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/70 shadow-2xs space-y-2 lg:max-w-xs w-full">
            <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Hotel className="w-3.5 h-3.5 text-amber-700" /> Top Curated Stays
            </p>
            <div className="space-y-1.5">
              {currentCity.topStays.map((stay, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 line-clamp-1">{stay.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-medium shrink-0 ml-2 border border-amber-200/60">
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
                  ? 'bg-[#78350f] text-white shadow-xs'
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
                  ? 'bg-[#78350f] text-white shadow-xs'
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
                  ? 'bg-[#78350f] text-white shadow-xs'
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
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-300 transition-all cursor-pointer self-start sm:self-auto"
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
                      ? 'bg-amber-100 text-amber-950 font-black'
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
                      ? 'bg-amber-100 text-amber-950 font-black'
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
                      ? 'bg-amber-100 text-amber-950 font-black'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Hidden Gems</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200/80 text-amber-900 font-bold">
                    {currentCity.attractions.filter((a) => a.isHiddenGem).length}
                  </span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter forts, palaces, temples, reservoirs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 text-stone-800 placeholder:text-stone-400"
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
                    className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400/80 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
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
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white shadow-xs flex items-center gap-1">
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
                        <h4 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                          {attraction.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-amber-800 line-clamp-1">
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
                          <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span className="line-clamp-2 leading-tight">
                            <strong className="text-stone-800 font-semibold">Hours:</strong> {attraction.timings}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 text-stone-600">
                          <IndianRupee className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
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
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 hover:text-amber-700 hover:underline cursor-pointer"
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
                <Hotel className="w-4 h-4 text-amber-700" />
                <h4 className="text-sm font-bold text-stone-900">
                  Curated Stays, Heritage Palaces &amp; Lakeside Resorts in {currentCity.name}
                </h4>
              </div>
              <p className="text-xs text-stone-600">
                Hand-picked stays representing iconic royal palaces of the Nizams, high-tech luxury, and scenic lakeside retreats.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentCity.topStays.map((stay, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 font-bold text-xs">
                      0{idx + 1}
                    </div>
                    <h5 className="font-serif text-base font-bold text-stone-900">
                      {stay.name}
                    </h5>
                    <p className="text-xs text-amber-900 font-medium">
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
                        const q = `${stay.name} ${currentCity.name} Telangana hotel booking`;
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
                      }}
                      className="text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
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
            TAB 3: WHERE TO EAT (NIZAMI DUM BIRYANI & TELANGANA SPICE)
        ========================================================================= */}
        {activeTab === 'dining' && (
          <div className="space-y-6 animate-fadeIn">
            {currentCity.dining.peacefulNote && (
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 text-stone-700 flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  {currentCity.dining.peacefulNote}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VEGETARIAN DINING & BREAKFAST HUBS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-300/40">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block border border-emerald-800" />
                  <h4 className="font-serif text-base font-bold text-amber-950">
                    Where to Eat (Vegetarian &amp; Traditional Breakfasts)
                  </h4>
                </div>

                <div className="space-y-3">
                  {currentCity.dining.veg.map((spot, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h5 className="font-bold text-sm text-stone-900">
                          {spot.restaurant}
                        </h5>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium shrink-0">
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

              {/* NON-VEGETARIAN DINING & NIZAMI MEATS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-amber-300/40">
                  <span className="w-3 h-3 rounded-full bg-red-600 inline-block border border-red-800" />
                  <h4 className="font-serif text-base font-bold text-amber-950">
                    Where to Eat (Authentic Biryani, Haleem &amp; Spicy Curries)
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
          TELANGANA HERITAGE FOOTER DOSSIER & PROVENANCE
      ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-teal-50 rounded-2xl border border-amber-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-serif font-black shadow-2xs">
            TG
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950 tracking-wide uppercase">
              Telangana Tourism Dossier (IN-TG)
            </h4>
            <p className="text-[11px] text-stone-600">
              Verified records for Hyderabad, Warangal &amp; Hanamkonda, Ramappa / Palampet, and Nagarjuna Sagar in Discover Bharat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAIChat && (
            <button
              type="button"
              onClick={() => onOpenAIChat(`Tell me a detailed 5-day travel itinerary for ${currentCity.name}, Telangana covering historical monuments, authentic gastronomy, and cultural heritage.`)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#78350f] hover:bg-[#92400e] text-white shadow-xs transition-all cursor-pointer"
            >
              Ask AI about {currentCity.name}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
