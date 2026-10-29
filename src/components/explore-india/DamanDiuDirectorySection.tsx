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
  Waves,
  Trees,
  Sun,
  Share2,
  Anchor,
  Palmtree,
  Landmark,
  Shield,
  Award,
} from 'lucide-react';
import {
  DAMAN_DIU_DIRECTORY,
  DamanDiuCity,
  DamanDiuAttraction,
} from '../../data/damanDiuDirectory';

interface DamanDiuDirectorySectionProps {
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const DamanDiuDirectorySection: React.FC<DamanDiuDirectorySectionProps> = ({
  onSelectCity,
  onOpenAIChat,
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('daman');
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining'>('attractions');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Hub object
  const currentCity = useMemo(() => {
    return (
      DAMAN_DIU_DIRECTORY.find((c) => c.id === selectedCityId) ||
      DAMAN_DIU_DIRECTORY[0]
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

  const handleCopyDetails = (attraction: DamanDiuAttraction) => {
    const text = `${attraction.name} (${currentCity.name}, Dadra & Nagar Haveli and Daman & Diu)\nCategory: ${attraction.category}\nTimings: ${attraction.timings}\nEntry: Dom: ${attraction.fee.domestic} | Foreign: ${attraction.fee.foreign}\n${attraction.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(attraction.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCityClick = (cityId: string) => {
    setSelectedCityId(cityId);
    if (onSelectCity) onSelectCity(cityId);
  };

  return (
    <section className="w-full space-y-6">
      {/* 1. Header Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0F2942] via-[#0A192F] to-[#134E4A] text-white p-6 sm:p-8 shadow-xl border border-teal-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(#2DD4BF_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-teal-500/20 to-sky-500/20 border border-teal-400/40 text-teal-300">
              <Anchor className="w-3.5 h-3.5 text-teal-400" />
              <span>Dadra &amp; Nagar Haveli and Daman &amp; Diu Directory · IN-DN</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
              <span>{currentCity.name}</span>
              <span className="text-xs sm:text-sm font-sans font-normal px-2.5 py-0.5 rounded-md bg-white/10 text-teal-200 border border-white/15">
                {currentCity.code}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              {currentCity.flashcardBlurb}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Palmtree className="w-3.5 h-3.5 text-teal-400" />
                <span>3 Historic Districts</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Portuguese Sea Forts &amp; Ramparts</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Waves className="w-3.5 h-3.5 text-sky-400" />
                <span>13 Curated Attractions &amp; Caves</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Trees className="w-3.5 h-3.5 text-emerald-400" />
                <span>Warli Tribal Culture &amp; Lion Safari</span>
              </span>
            </div>
          </div>

          {/* Quick AI Inquiry */}
          <div className="shrink-0 flex flex-col gap-2">
            <button
              type="button"
              onClick={() =>
                onOpenAIChat?.(
                  `Provide a detailed coastal and cultural travel itinerary for ${currentCity.name}, Dadra & Nagar Haveli and Daman & Diu, highlighting sea forts, beaches, and local gastronomy.`
                )
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-sky-600 hover:from-teal-400 hover:to-sky-500 text-stone-950 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-teal-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Ask AI Guide about {currentCity.name}</span>
            </button>
            <div className="text-[11px] text-stone-400 text-center">
              UT Directory · Verified Heritage Dossier
            </div>
          </div>
        </div>
      </div>

      {/* 2. City Selector Horizontal Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
          <span>Select District / Enclave ({DAMAN_DIU_DIRECTORY.length} Hubs)</span>
          <span className="text-teal-700 font-medium">Arabian Sea, Gulf of Khambhat &amp; Western Ghats</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300">
          {DAMAN_DIU_DIRECTORY.map((city) => {
            const isSelected = city.id === selectedCityId;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => handleCityClick(city.id)}
                className={`group shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-800 shadow-md ring-2 ring-teal-400/30'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 hover:border-teal-300'
                }`}
              >
                <MapPin
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-teal-300' : 'text-stone-400 group-hover:text-teal-600'
                  }`}
                />
                <span>{city.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-teal-800/80 text-teal-100'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {city.code.replace('IN-DN-CITY-', '')}
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
                ? 'bg-teal-100 text-teal-900 border border-teal-300'
                : 'text-stone-600 hover:bg-stone-100 border border-transparent'
            }`}
          >
            <Compass className="w-4 h-4 text-teal-700" />
            <span>Attractions &amp; Sights</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-teal-200 text-teal-900">
              {currentCity.attractions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stays')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'stays'
                ? 'bg-teal-100 text-teal-900 border border-teal-300'
                : 'text-stone-600 hover:bg-stone-100 border border-transparent'
            }`}
          >
            <Hotel className="w-4 h-4 text-teal-700" />
            <span>Top Stays</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
              {currentCity.topStays.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dining')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'dining'
                ? 'bg-teal-100 text-teal-900 border border-teal-300'
                : 'text-stone-600 hover:bg-stone-100 border border-transparent'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-teal-700" />
            <span>Where to Eat</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
              {currentCity.dining.veg.length + currentCity.dining.nonVeg.length}
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
              placeholder="Search forts, beaches &amp; caves..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-stone-800"
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
              All ({currentCity.attractions.length})
            </button>
            <button
              type="button"
              onClick={() => setAttractionFilter('core')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                attractionFilter === 'core'
                  ? 'bg-teal-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Core Heritage ({currentCity.attractions.filter((a) => !a.isHiddenGem).length})
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
              Hidden Gems ({currentCity.attractions.filter((a) => a.isHiddenGem).length})
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
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Diu_Fort_Lighthouse_and_Bastions.jpg/1280px-Diu_Fort_Lighthouse_and_Bastions.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                      {/* Code Badge */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-xs text-teal-300 border border-teal-400/30">
                          {attraction.id}
                        </span>
                        {attraction.isHiddenGem && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3" /> Hidden Gem
                          </span>
                        )}
                      </div>

                      {/* Photo Credit */}
                      <span className="absolute bottom-2 right-2 text-[10px] text-white/70 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
                        {attraction.photoCredit}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <div className="text-[11px] font-semibold text-teal-700 tracking-wide uppercase">
                          {attraction.category}
                        </div>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
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
                            <div className="text-[10px] text-stone-400 font-semibold uppercase">Timings</div>
                            <div className="font-medium text-stone-800">{attraction.timings}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5 text-stone-600">
                          <IndianRupee className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[10px] text-stone-400 font-semibold uppercase">Fee</div>
                            <div className="font-medium text-stone-800">
                              {attraction.fee.domestic}
                              {attraction.fee.foreign !== attraction.fee.domestic && (
                                <span className="text-stone-400 text-[10px] block">
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
                      className="inline-flex items-center gap-1.5 text-stone-600 hover:text-teal-700 font-medium transition-colors cursor-pointer"
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
                          `Tell me historical context, photography angles, and visitor tips for ${attraction.name} in ${currentCity.name}, Dadra & Nagar Haveli and Daman & Diu.`
                        )
                      }
                      className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-semibold transition-colors cursor-pointer"
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
              <div className="text-sm font-semibold text-stone-700">No attractions matched your search.</div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setAttractionFilter('all');
                }}
                className="text-xs text-teal-700 underline font-semibold cursor-pointer"
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
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-start gap-3">
            <Hotel className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-teal-950">Curated Accommodations in {currentCity.name}</div>
              <div>
                Featuring luxury casino beachfront resorts on the Arabian Sea, Portuguese colonial heritage boutique stays, and peaceful riverside retreats along the Daman Ganga river.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentCity.topStays.map((stay, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-300">
                    <ShieldCheck className="w-3 h-3 text-teal-700" />
                    <span>Recommendation #{idx + 1}</span>
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
                        `Find tariffs, availability, room categories, and booking advice for stay at ${stay.name} in ${currentCity.name}, Dadra & Nagar Haveli and Daman & Diu.`
                      )
                    }
                    className="text-teal-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
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
          {(currentCity.dining.culinaryNote ||
            currentCity.dining.coastalNote ||
            currentCity.dining.tribalNote) && (
            <div className="p-4 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 text-xs flex items-start gap-3">
              <UtensilsCrossed className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold text-teal-300">Gastronomic Dossier · {currentCity.name}</div>
                <div className="text-stone-300 mt-0.5">
                  {currentCity.dining.culinaryNote ||
                    currentCity.dining.coastalNote ||
                    currentCity.dining.tribalNote}
                </div>
              </div>
            </div>
          )}

          {/* Veg Spots */}
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

          {/* Non-Veg Spots */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Where to Eat (Non-Vegetarian &amp; Coastal Seafood)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      )}
    </section>
  );
};
