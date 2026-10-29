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
  CHANDIGARH_DIRECTORY,
  ChandigarhCity,
  ChandigarhAttraction,
} from '../../data/chandigarhDirectory';

interface ChandigarhDirectorySectionProps {
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const ChandigarhDirectorySection: React.FC<ChandigarhDirectorySectionProps> = ({
  onSelectCity,
  onOpenAIChat,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('chandigarh');
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected City object
  const currentCity = useMemo(() => {
    return (
      CHANDIGARH_DIRECTORY.find((c) => c.id === selectedCityId) ||
      CHANDIGARH_DIRECTORY[0]
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

  const handleCopyDetails = (attraction: ChandigarhAttraction) => {
    const text = `${attraction.name} (${currentCity.name}, Chandigarh)\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCityOverview = () => {
    const text = `=== ${currentCity.name} (${currentCity.code}) — Chandigarh ===\n${currentCity.flashcardBlurb}\n\nTop Stays:\n${currentCity.topStays
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
    <section className="w-full space-y-8 animate-fadeIn" aria-label="Chandigarh Travel Directory">
      {/* =========================================================================
          HERO BANNER: THE CITY BEAUTIFUL & LE CORBUSIER'S VISION
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f172a] text-white p-6 sm:p-10 shadow-xl border border-emerald-500/25">
        {/* Soft emerald, jade, and amber orbs */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wide backdrop-blur-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>Discover Bharat · Complete Chandigarh Directory (IN-CH)</span>
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Chandigarh · <span className="text-emerald-200">The City Beautiful</span>
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl pt-1">
              From the UNESCO World Heritage concrete monuments of the Capitol Complex and Nek Chand’s magical recycled Rock Garden to the calm Shivalik waters of Sukhna Lake and Asia’s largest botanical Rose Garden.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">1</div>
              <div className="text-[11px] text-emerald-100/80 font-medium uppercase tracking-wider">
                Planned Modernist City
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-teal-300">6</div>
              <div className="text-[11px] text-teal-100/80 font-medium uppercase tracking-wider">
                Curated Sights &amp; Hidden Gems
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-amber-300">3</div>
              <div className="text-[11px] text-amber-100/80 font-medium uppercase tracking-wider">
                Luxury Foothill &amp; City Stays
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="text-xl sm:text-2xl font-black text-cyan-300">100%</div>
              <div className="text-[11px] text-cyan-100/80 font-medium uppercase tracking-wider">
                Verified Timings &amp; Tariffs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SELECTED DESTINATION FLASHCARD (EMERALD & SPACIOUS)
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
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-950 border border-emerald-500/30">
                {currentCity.nickname}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {currentCity.attractions.length} Curated Sights · {currentCity.topStays.length} Verified Luxury Stays
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
            <div className="bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-emerald-200/70 shadow-2xs space-y-2 w-full">
              <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-emerald-700" /> Top Curated Stays
              </p>
              <div className="space-y-1.5">
                {currentCity.topStays.map((stay, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 line-clamp-1">{stay.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 font-medium shrink-0 ml-2 border border-emerald-200/60">
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
                  ? 'bg-[#047857] text-white shadow-xs'
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
                  ? 'bg-[#047857] text-white shadow-xs'
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
                  ? 'bg-[#047857] text-white shadow-xs'
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
                    `Plan an architectural and cultural tour of ${currentCity.name}. Recommend visiting slots for Le Corbusier's Capitol Complex, Nek Chand's Rock Garden, evening boating at Sukhna Lake, and authentic Punjabi dining at Pal Dhaba.`
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#047857] hover:bg-[#065f46] text-white shadow-2xs transition-colors cursor-pointer"
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
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${currentCity.name} sights by name, Le Corbusier, lake, or sector...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white border border-stone-200/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition-all shadow-2xs text-stone-800 placeholder:text-stone-400"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setAttractionFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    attractionFilter === 'all'
                      ? 'bg-stone-800 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({currentCity.attractions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAttractionFilter('core')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    attractionFilter === 'core'
                      ? 'bg-emerald-700 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Core Highlights ({currentCity.attractions.filter((a) => !a.isHiddenGem).length})
                </button>
                <button
                  type="button"
                  onClick={() => setAttractionFilter('hidden')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    attractionFilter === 'hidden'
                      ? 'bg-teal-700 text-white'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Hidden Gems ({currentCity.attractions.filter((a) => a.isHiddenGem).length})
                </button>
              </div>
            </div>

            {/* Attractions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedAttractions.map((attraction) => (
                <div
                  key={attraction.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Attraction Image Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Badges Overlay */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs font-semibold border border-white/20">
                          {attraction.id}
                        </span>

                        {attraction.isHiddenGem ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-600 text-white shadow-xs">
                            <Sparkles className="w-3 h-3" /> Hidden Gem
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                            <Compass className="w-3 h-3" /> Must-Visit Highlight
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 text-white">
                        <span className="text-[10px] text-emerald-200 font-semibold tracking-wide uppercase">
                          {attraction.category}
                        </span>
                        <h4 className="font-serif text-lg font-bold leading-snug drop-shadow-xs">
                          {attraction.name}
                        </h4>
                      </div>
                    </div>

                    {/* Metadata & Summary */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="line-clamp-1">{attraction.timings}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="line-clamp-1 font-medium text-stone-800">
                            {attraction.fee.domestic}
                          </span>
                        </div>
                      </div>

                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                        {attraction.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-4 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-stone-400 font-medium truncate max-w-[50%]">
                      {attraction.photoCredit}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyDetails(attraction)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Copy sight details"
                      >
                        {copiedId === attraction.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      {onOpenAIChat && (
                        <button
                          type="button"
                          onClick={() =>
                            onOpenAIChat(
                              `Tell me more about visiting ${attraction.name} in Chandigarh. What are the best hours, architectural highlights, and nearby sector cafes?`
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <span>Ask AI</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {displayedAttractions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200/80 p-6 space-y-2">
                <Info className="w-8 h-8 text-stone-400 mx-auto" />
                <h5 className="font-bold text-stone-700 text-sm">No sights match your query</h5>
                <p className="text-xs text-stone-500">
                  Try clearing the search box or selecting "All" from the sight category filters.
                </p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: VERIFIED LUXURY & BUSINESS STAYS
        ========================================================================= */}
        {activeTab === 'stays' && (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs sm:text-sm text-emerald-950 flex items-start gap-3">
              <Hotel className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-900 uppercase tracking-wide">
                  Curated Stays Across Chandigarh
                </span>
                <p className="text-emerald-900/90 leading-relaxed">
                  From secluded ultra-luxury Ayurvedic forest villas in the Shivalik foothills to sleek executive hotels in the city's central business sectors, Chandigarh offers world-class hospitality.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {currentCity.topStays.map((stay, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:border-emerald-300 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                      <Hotel className="w-4 h-4 text-emerald-700" />
                      <span>{stay.name}</span>
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 shrink-0">
                      Verified Stay
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {stay.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: GASTRONOMY & WHERE TO EAT
        ========================================================================= */}
        {activeTab === 'dining' && (
          <div className="space-y-5">
            {/* Architectural & Culinary Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentCity.dining.architectureNote && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-950 space-y-1 text-xs">
                  <div className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-amber-700" />
                    <span>Urban Grid &amp; Modernist Planning</span>
                  </div>
                  <p className="text-amber-900/90 leading-relaxed">
                    {currentCity.dining.architectureNote}
                  </p>
                </div>
              )}

              {currentCity.dining.culinaryNote && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-950 space-y-1 text-xs">
                  <div className="font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
                    <span>Punjabi Flavors &amp; Cafe Culture</span>
                  </div>
                  <p className="text-emerald-900/90 leading-relaxed">
                    {currentCity.dining.culinaryNote}
                  </p>
                </div>
              )}
            </div>

            {/* Dining Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vegetarian Section */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wide">
                    Pure Vegetarian, Sweets &amp; European Bakeries
                  </h4>
                </div>

                <div className="space-y-3">
                  {currentCity.dining.veg.map((spot, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 text-sm">
                          {spot.restaurant}
                        </span>
                        <span className="text-[11px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/50">
                          {spot.location}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {spot.specialties}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Vegetarian Section */}
              <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <h4 className="font-bold text-sm text-stone-900 uppercase tracking-wide">
                    Legendary Dhabas, Butter Chicken &amp; Pubs
                  </h4>
                </div>

                <div className="space-y-3">
                  {currentCity.dining.nonVeg.map((spot, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 text-sm">
                          {spot.restaurant}
                        </span>
                        <span className="text-[11px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/50">
                          {spot.location}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {spot.specialties}
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
