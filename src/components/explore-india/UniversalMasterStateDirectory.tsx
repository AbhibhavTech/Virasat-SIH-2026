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
  Trees,
  Binoculars,
  Footprints,
} from 'lucide-react';
import {
  StateDirectoryConfig,
  StateDirectoryAttraction,
} from '../../types/masterStateDirectory';
import { SacredSite } from '../../data/sacredPilgrimageCircuits';
import { Link } from 'react-router-dom';
import { HotelAmenitiesModal } from './HotelAmenitiesModal';
import { resolveHotelDossier, HotelDossier } from '../../utils/hotelDossierResolver';
import { getPlanSafariUrl } from '../../utils/safariItineraryResolver';
import { Star, Wifi, Waves, BedDouble, ArrowRight, Eye } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  translateTextToHindi,
  CITIES_HINDI_MAP,
  WILDLIFE_HINDI_MAP,
} from '../../i18n/hindiDictionary';

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
  const { currentLanguage } = useLanguage();
  const [selectedCityId, setSelectedCityId] = useState<string>(
    initialCityId && config.cities.some((c) => c.id === initialCityId)
      ? initialCityId
      : config.cities[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'attractions' | 'stays' | 'dining' | 'wildlife' | 'sacred'>('attractions');
  const [sacredFilter, setSacredFilter] = useState<'all' | 'city'>('all');
  const [attractionFilter, setAttractionFilter] = useState<'all' | 'core' | 'hidden' | 'wildlife'>('all');
  const [wildlifeFilter, setWildlifeFilter] = useState<'all' | 'tiger' | 'np' | 'sanctuary'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedStayDossier, setSelectedStayDossier] = useState<HotelDossier | null>(null);
  const [isStayModalOpen, setIsStayModalOpen] = useState(false);

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

  // Wildlife reserves for this state
  const wildlifeReserves = useMemo(() => {
    return config.wildlifeReserves || [];
  }, [config.wildlifeReserves]);

  // Sacred shrines for this state
  const sacredSites = useMemo(() => {
    return config.sacredSites || [];
  }, [config.sacredSites]);

  // Shrines belonging to the currently selected city
  const citySacredSites = useMemo(() => {
    if (!currentCity) return [];
    const cName = currentCity.name.toLowerCase();
    return sacredSites.filter(
      (s) => s.city.toLowerCase().includes(cName) || cName.includes(s.city.toLowerCase())
    );
  }, [sacredSites, currentCity]);

  // Filtered sacred shrines based on city filter and search query
  const filteredSacredList = useMemo(() => {
    let list = sacredSites;
    if (sacredFilter === 'city' && currentCity) {
      const cName = currentCity.name.toLowerCase();
      list = list.filter(
        (s) => s.city.toLowerCase().includes(cName) || cName.includes(s.city.toLowerCase())
      );
    }
    if (searchQuery.trim() && activeTab === 'sacred') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.vernacularName && s.vernacularName.toLowerCase().includes(q)) ||
          s.city.toLowerCase().includes(q) ||
          s.circuitName.toLowerCase().includes(q) ||
          s.spiritualSignificance.toLowerCase().includes(q) ||
          s.traditionLabel.toLowerCase().includes(q)
      );
    }
    return list;
  }, [sacredSites, sacredFilter, currentCity, searchQuery, activeTab]);

  // Filtered wildlife list based on category & search
  const filteredWildlifeList = useMemo(() => {
    let list = wildlifeReserves;
    if (wildlifeFilter === 'tiger') {
      list = list.filter((r) => r.category === 'Tiger Reserve');
    } else if (wildlifeFilter === 'np') {
      list = list.filter((r) => r.category === 'National Park' || r.category === 'Marine National Park');
    } else if (wildlifeFilter === 'sanctuary') {
      list = list.filter((r) => r.category === 'Wildlife Sanctuary' || r.category === 'Bird Sanctuary' || r.category === 'Biosphere Reserve');
    }

    if (searchQuery.trim() && activeTab === 'wildlife') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.keyHighlight.toLowerCase().includes(q) ||
          r.prominentFauna.some((f) => f.toLowerCase().includes(q))
      );
    }
    return list;
  }, [wildlifeReserves, wildlifeFilter, searchQuery, activeTab]);

  // Filtered attractions based on search query and category filter
  const displayedAttractions = useMemo(() => {
    if (!currentCity || !currentCity.attractions) return [];
    let list = currentCity.attractions;
    if (attractionFilter === 'core') {
      list = list.filter((a) => !a.isHiddenGem);
    } else if (attractionFilter === 'hidden') {
      list = list.filter((a) => a.isHiddenGem);
    } else if (attractionFilter === 'wildlife') {
      list = list.filter(
        (a) =>
          a.category.toLowerCase().includes('wildlife') ||
          a.category.toLowerCase().includes('park') ||
          a.category.toLowerCase().includes('sanctuary') ||
          a.category.toLowerCase().includes('nature') ||
          a.summary.toLowerCase().includes('wildlife') ||
          a.summary.toLowerCase().includes('tiger') ||
          a.summary.toLowerCase().includes('bird')
      );
    }

    if (searchQuery.trim() && activeTab === 'attractions') {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [currentCity, attractionFilter, searchQuery, activeTab]);

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
              <span>{currentLanguage === 'hi' ? `एकीकृत ${config.stateName} मास्टर डायरेक्टरी · ${config.stateCode}` : `Consolidated ${config.stateName} Master Directory · ${config.stateCode}`}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white flex flex-wrap items-center gap-3">
              <span>{currentLanguage === 'hi' ? (CITIES_HINDI_MAP[currentCity.name] || currentCity.name) : currentCity.name}</span>
              <span className="text-xs sm:text-sm font-sans font-normal px-2.5 py-0.5 rounded-md bg-white/10 text-amber-200 border border-white/15">
                {currentCity.code}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              {currentLanguage === 'hi' ? translateTextToHindi(currentCity.flashcardBlurb) : currentCity.flashcardBlurb}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>{config.cities.length} {currentLanguage === 'hi' ? 'प्रमुख क्षेत्रीय केंद्र' : 'Master Regional Hubs'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span>{currentLanguage === 'hi' ? translateTextToHindi(config.unescoCount) : config.unescoCount}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{totalAttractionsCount} {currentLanguage === 'hi' ? 'प्रमाणित आकर्षण एवं किले' : 'Curated Attractions & Forts'}</span>
              </span>
              {wildlifeReserves.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                  <Trees className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{wildlifeReserves.length} {currentLanguage === 'hi' ? 'राष्ट्रीय उद्यान एवं अभयारण्य' : 'National Parks & Reserves'}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-stone-200">
                <UtensilsCrossed className="w-3.5 h-3.5 text-rose-400" />
                <span>{currentLanguage === 'hi' ? translateTextToHindi(config.cuisineLabel) : config.cuisineLabel}</span>
              </span>
            </div>
          </div>

          {/* Quick AI Exploration Inquiry */}
          <div className="shrink-0 flex flex-col gap-2">
            <button
              type="button"
              onClick={() =>
                onOpenAIChat?.(
                  `Plan a comprehensive historical, wildlife safari and cultural itinerary for ${currentCity.name}, ${config.stateName} covering its top monuments, national parks, stays, and authentic regional cuisine.`
                )
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-semibold text-xs sm:text-sm shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>{currentLanguage === 'hi' ? `एआई गाइड से पूछें (${CITIES_HINDI_MAP[currentCity.name] || currentCity.name})` : `Ask AI Guide about ${currentCity.name}`}</span>
            </button>
            <div className="text-[11px] text-stone-400 text-center">
              {currentLanguage === 'hi' ? 'राज्य डायरेक्टरी · सत्यापित फील्ड संचिका' : 'State Directory · Verified Field Dossier'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. City Selector Horizontal Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
          <span>
            {currentLanguage === 'hi' ? `${config.stateName} गंतव्य चुनें (${config.cities.length} केंद्र)` : `Select ${config.stateName} Destination (${config.cities.length} Hubs)`}
          </span>
          <span className="text-amber-700 font-medium">{currentLanguage === 'hi' ? translateTextToHindi(config.regionalSubtitle) : config.regionalSubtitle}</span>
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
                <span>{currentLanguage === 'hi' ? (CITIES_HINDI_MAP[city.name] || city.name) : city.name}</span>
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

      {/* 3. Navigation Tabs (Attractions / Wildlife / Stays / Dining) */}
      <div className="bg-white rounded-xl shadow-xs border border-stone-200 p-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
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
            <span>{currentLanguage === 'hi' ? 'आकर्षण एवं स्थल' : 'Attractions & Sights'}</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
              {currentCity.attractions?.length || 0}
            </span>
          </button>

          {/* Dedicated Wildlife & Reserves Tab */}
          {wildlifeReserves.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('wildlife')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'wildlife'
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
            >
              <Trees className="w-4 h-4 text-emerald-700" />
              <span>{currentLanguage === 'hi' ? 'वन्यजीव एवं अभयारण्य' : 'Wildlife & Reserves'}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                {wildlifeReserves.length}
              </span>
            </button>
          )}

          {/* Dedicated Sacred Shrines & Divine Sanctuaries Tab */}
          {sacredSites.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('sacred')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeTab === 'sacred'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
            >
              <span className="text-sm">🕉️</span>
              <span>{currentLanguage === 'hi' ? 'पवित्र तीर्थ एवं धाम' : 'Sacred Shrines & Pilgrimage'}</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold">
                {sacredSites.length}
              </span>
            </button>
          )}

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
            <span>{currentLanguage === 'hi' ? 'प्रमुख आवास' : 'Top Stays'}</span>
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
            <span>{currentLanguage === 'hi' ? 'प्रसिद्ध व्यंजन' : 'Where to Eat'}</span>
            <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
              {(currentCity.dining?.veg?.length || 0) + (currentCity.dining?.nonVeg?.length || 0)}
            </span>
          </button>
        </div>

        {/* Search bar inside tab strip */}
        {(activeTab === 'attractions' || activeTab === 'wildlife' || activeTab === 'sacred') && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLanguage === 'hi'
                  ? (activeTab === 'wildlife' ? 'बाघ अभयारण्य, वन्यजीव खोजें...' : 'दर्शनीय स्थल, किले, गुफाएं खोजें...')
                  : (activeTab === 'wildlife' ? 'Search tiger reserves, fauna...' : activeTab === 'sacred' ? 'Search sacred shrines, temples, ghats...' : 'Search sights, forts & caves...')
              }
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800"
            />
          </div>
        )}
      </div>

      {/* 4. Tab Content: ATTRACTIONS */}
      {activeTab === 'attractions' && (
        <div className="space-y-4">
          {/* Sacred Shrines Spotlight Banner if current city has shrines */}
          {citySacredSites.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center text-lg shrink-0">
                  🕉️
                </span>
                <div>
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <span>
                      {currentLanguage === 'hi'
                        ? `${CITIES_HINDI_MAP[currentCity.name] || currentCity.name} में ${citySacredSites.length} प्रमुख पवित्र तीर्थ एवं आध्यात्मिक धाम`
                        : `${citySacredSites.length} Sacred Pilgrimage Sanctuaries in ${currentCity.name}`}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-200 text-amber-950 font-semibold">
                      IN-SACRED-MASTER
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 line-clamp-1 mt-0.5">
                    {citySacredSites.map((s) => s.name).join(' • ')}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSacredFilter('city');
                  setActiveTab('sacred');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <span>{currentLanguage === 'hi' ? 'तीर्थ दर्शन विवरण' : 'View Sacred Dossiers'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {/* Subfilter Pills */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-stone-500 font-medium">{currentLanguage === 'hi' ? 'आकर्षण फ़िल्टर:' : 'Filter Sights:'}</span>
            <button
              type="button"
              onClick={() => setAttractionFilter('all')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                attractionFilter === 'all'
                  ? 'bg-stone-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {currentLanguage === 'hi' ? `सभी (${currentCity.attractions?.length || 0})` : `All (${currentCity.attractions?.length || 0})`}
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
              {currentLanguage === 'hi' ? `मुख्य धरोहर (${currentCity.attractions?.filter((a) => !a.isHiddenGem).length || 0})` : `Core Heritage (${currentCity.attractions?.filter((a) => !a.isHiddenGem).length || 0})`}
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
              {currentLanguage === 'hi' ? `अन्वेषित धरोहर (${currentCity.attractions?.filter((a) => a.isHiddenGem).length || 0})` : `Hidden Gems (${currentCity.attractions?.filter((a) => a.isHiddenGem).length || 0})`}
            </button>
            {wildlifeReserves.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('wildlife')}
                className="px-3 py-1 rounded-full cursor-pointer transition-colors bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium hover:bg-emerald-100 flex items-center gap-1"
              >
                <Trees className="w-3 h-3 text-emerald-600" />
                <span>{currentLanguage === 'hi' ? `राज्य के वन्यजीव एवं पार्क देखें (${wildlifeReserves.length})` : `View State Wildlife & Parks (${wildlifeReserves.length})`}</span>
              </button>
            )}
          </div>

          {/* Attraction Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedAttractions.map((attraction) => {
              const isCopied = copiedId === attraction.id;
              return (
                <div
                  key={attraction.id}
                  className="card-smooth group bg-white rounded-2xl overflow-hidden border border-stone-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header with Badge Overlay */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                      <img
                        src={attraction.image || defaultCityFallback}
                        alt={attraction.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
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
                            <Sparkles className="w-3 h-3" /> {currentLanguage === 'hi' ? 'अन्वेषित धरोहर' : 'Hidden Gem'}
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
                            <div className="text-[10px] text-stone-600 font-semibold uppercase">{currentLanguage === 'hi' ? 'दर्शन समय' : 'Timings'}</div>
                            <div className="font-medium text-stone-800">{attraction.timings || 'Sunrise – Sunset'}</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5 text-stone-600">
                          <IndianRupee className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-[10px] text-stone-600 font-semibold uppercase">{currentLanguage === 'hi' ? 'प्रवेश शुल्क' : 'Fee'}</div>
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
                          <span className="text-emerald-700 font-semibold">{currentLanguage === 'hi' ? 'कॉपी किया गया!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{currentLanguage === 'hi' ? 'साझा करें' : 'Share Details'}</span>
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
                      <span>{currentLanguage === 'hi' ? 'अन्वेषण करें' : 'Explore'}</span>
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

      {/* 5. Tab Content: WILDLIFE & NATIONAL PARKS */}
      {activeTab === 'wildlife' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Wildlife Hero Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-[#064E3B] to-[#042F2E] text-white border border-emerald-500/30 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Trees className="w-3.5 h-3.5 text-emerald-400" />
                  <span>State Wildlife Protected Areas · {config.stateName}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {currentLanguage === 'hi' ? 'राष्ट्रीय उद्यान, बाघ अभयारण्य एवं वन्यजीव शरणगाह' : 'National Parks, Tiger Reserves & Sanctuaries'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                  {currentLanguage === 'hi' ? `${config.stateName} के पारिस्थितिक गलियारे, प्रोजेक्ट टाइगर अभयारण्य एवं यूनेस्को बायोस्फीयर रिजर्व जो संकटग्रस्त वन्यजीवों को सुरक्षित प्राकृतिक आवास प्रदान करते हैं।` : `Ecological corridors, Project Tiger sanctuaries, and UNESCO Biosphere Reserves sheltering endangered apex predators and unique biodiversity in ${config.stateName}.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onOpenAIChat?.(
                      `Provide comprehensive wildlife safari booking rules, gate zones, best photography seasons, and eco-stay advice for national parks and tiger reserves in ${config.stateName}.`
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-stone-950 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Binoculars className="w-4 h-4 text-stone-950" />
                  <span>{currentLanguage === 'hi' ? 'एआई सफारी विशेषज्ञ से पूछें' : 'Ask AI Safari Expert'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Subfilter Pills for Wildlife */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-stone-500 font-medium">{currentLanguage === 'hi' ? 'संरक्षित क्षेत्र फ़िल्टर:' : 'Filter Protected Areas:'}</span>
            <button
              type="button"
              onClick={() => setWildlifeFilter('all')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                wildlifeFilter === 'all'
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {currentLanguage === 'hi' ? `सभी (${wildlifeReserves.length})` : `All (${wildlifeReserves.length})`}
            </button>
            <button
              type="button"
              onClick={() => setWildlifeFilter('tiger')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                wildlifeFilter === 'tiger'
                  ? 'bg-amber-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {currentLanguage === 'hi' ? `बाघ अभयारण्य (${wildlifeReserves.filter((r) => r.category === 'Tiger Reserve').length})` : `Tiger Reserves (${wildlifeReserves.filter((r) => r.category === 'Tiger Reserve').length})`}
            </button>
            <button
              type="button"
              onClick={() => setWildlifeFilter('np')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                wildlifeFilter === 'np'
                  ? 'bg-teal-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {currentLanguage === 'hi' ? `राष्ट्रीय उद्यान (${wildlifeReserves.filter((r) => r.category === 'National Park' || r.category === 'Marine National Park').length})` : `National Parks (${wildlifeReserves.filter((r) => r.category === 'National Park' || r.category === 'Marine National Park').length})`}
            </button>
            <button
              type="button"
              onClick={() => setWildlifeFilter('sanctuary')}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                wildlifeFilter === 'sanctuary'
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {currentLanguage === 'hi' ? `अभयारण्य व पक्षी रिजर्व (${wildlifeReserves.filter((r) => r.category === 'Wildlife Sanctuary' || r.category === 'Bird Sanctuary' || r.category === 'Biosphere Reserve').length})` : `Sanctuaries & Bird Reserves (${wildlifeReserves.filter((r) => r.category === 'Wildlife Sanctuary' || r.category === 'Bird Sanctuary' || r.category === 'Biosphere Reserve').length})`}
            </button>
          </div>

          {/* Wildlife Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWildlifeList.map((reserve) => {
              const isCopied = copiedId === reserve.id;
              return (
                <div
                  key={reserve.id}
                  className="card-smooth group bg-white rounded-2xl overflow-hidden border border-emerald-900/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                      <img
                        src={reserve.image}
                        alt={reserve.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Badges Overlay */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs border ${
                            reserve.category === 'Tiger Reserve'
                              ? 'bg-amber-600/95 text-white border-amber-400/40'
                              : reserve.category === 'Marine National Park'
                              ? 'bg-sky-600/95 text-white border-sky-400/40'
                              : reserve.category === 'Bird Sanctuary'
                              ? 'bg-teal-600/95 text-white border-teal-400/40'
                              : 'bg-emerald-700/95 text-white border-emerald-400/40'
                          }`}
                        >
                          {reserve.category}
                        </span>
                        {reserve.isUnesco && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                            <Award className="w-3 h-3" /> UNESCO
                          </span>
                        )}
                      </div>

                      {reserve.areaSqKm && (
                        <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-emerald-300 backdrop-blur-xs border border-emerald-400/20">
                          {reserve.areaSqKm}
                        </div>
                      )}

                      {/* District & Location Pill at bottom of image */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{currentLanguage === 'hi' ? `${reserve.district} ज़िला` : `${reserve.district} District`}</span>
                        </span>
                        {reserve.nearestCity && (
                          <span className="text-[10px] text-stone-300 truncate">
                            {currentLanguage === 'hi' ? `मार्ग: ${CITIES_HINDI_MAP[reserve.nearestCity] || reserve.nearestCity}` : `via ${reserve.nearestCity}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {reserve.name}
                      </h4>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {reserve.keyHighlight}
                      </p>

                      {/* Prominent Fauna Tags */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                          <Footprints className="w-3 h-3 text-emerald-600" />
                          <span>Key Wildlife &amp; Species:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {reserve.prominentFauna.map((fauna, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium"
                            >
                              {fauna}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Safari Timings & Best Season */}
                      <div className="pt-2.5 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-stone-400 font-semibold uppercase block">Best Season</span>
                          <span className="font-medium text-stone-800 line-clamp-1">{reserve.bestSeason}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-stone-400 font-semibold uppercase block">Safaris</span>
                          <span className="font-medium text-stone-800 line-clamp-1">{reserve.safariTimings}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        const text = `${reserve.name} (${config.stateName})\nCategory: ${reserve.category} (${reserve.district})\nFauna: ${reserve.prominentFauna.join(', ')}\nBest Season: ${reserve.bestSeason}\nSafaris: ${reserve.safariTimings}\n${reserve.keyHighlight}`;
                        navigator.clipboard?.writeText(text);
                        setCopiedId(reserve.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 text-stone-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">{currentLanguage === 'hi' ? 'कॉपी किया गया!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{currentLanguage === 'hi' ? 'साझा करें' : 'Share Details'}</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={getPlanSafariUrl(reserve, config.stateName, currentCity.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all duration-200 cursor-pointer"
                      title={currentLanguage === 'hi' ? 'सफारी यात्रा योजना खोलें' : 'Plan trip for this safari'}
                    >
                      <Binoculars className="w-3.5 h-3.5" />
                      <span>{currentLanguage === 'hi' ? 'सफारी योजना बनाएं' : 'Plan Safari'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredWildlifeList.length === 0 && (
            <div className="p-8 text-center bg-white rounded-xl border border-stone-200 space-y-2">
              <Info className="w-8 h-8 text-stone-400 mx-auto" />
              <div className="text-sm font-semibold text-stone-700">No wildlife reserves matched your search filter.</div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setWildlifeFilter('all');
                }}
                className="text-xs text-emerald-700 underline font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5B. Tab Content: SACRED SHRINES & DIVINE SANCTUARIES */}
      {activeTab === 'sacred' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sacred Hero Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-950 via-[#78350F] to-[#451A03] text-white border border-amber-500/30 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  <span>🕉️</span>
                  <span>Sacred Pilgrimage Directory · {config.stateName}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {currentLanguage === 'hi'
                    ? 'पवित्र तीर्थ, शक्तिपीठ एवं आध्यात्मिक धाम'
                    : 'Sacred Shrines, Shakti Peethas & Divine Sanctuaries'}
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
                  {currentLanguage === 'hi'
                    ? `${config.stateName} के सर्वोच्च पूज्य आध्यात्मिक केंद्र, शक्तिपीठ, राम-कृष्ण अवतार परिपथ एवं मोक्षदायिनी नदियां व घाट जो शताब्दियों से आस्था के महातीर्थ हैं।`
                    : `Venerated spiritual landmarks, epic Ramayana & Krishna circuits, Shakti peethas, and sacred river ghats enshrined across ${config.stateName}.`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onOpenAIChat?.(
                      `Provide comprehensive spiritual guidance, darshan customs, aarti timings, sacred prasadam, and pilgrimage routes for shrines in ${config.stateName}.`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{currentLanguage === 'hi' ? 'एआई तीर्थ मार्गदर्शक' : 'Ask AI Pilgrim Guide'}</span>
                </button>
              </div>
            </div>

            {/* Filter Pills inside Sacred tab */}
            <div className="relative z-10 mt-4 pt-3 border-t border-amber-700/50 flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSacredFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  sacredFilter === 'all'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-amber-200'
                }`}
              >
                {currentLanguage === 'hi'
                  ? `समस्त ${config.stateName} के तीर्थ (${sacredSites.length})`
                  : `All ${config.stateName} Shrines (${sacredSites.length})`}
              </button>

              {citySacredSites.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSacredFilter('city')}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    sacredFilter === 'city'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-amber-200'
                  }`}
                >
                  {currentLanguage === 'hi'
                    ? `${currentCity.name} के धाम (${citySacredSites.length})`
                    : `${currentCity.name} Shrines (${citySacredSites.length})`}
                </button>
              )}
            </div>
          </div>

          {/* Grid of Sacred Sites */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSacredList.map((shrine) => {
              const isCopied = copiedId === shrine.id;

              return (
                <div
                  key={shrine.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:border-amber-400"
                >
                  <div>
                    {/* Hero Image Container */}
                    <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                      <img
                        src={shrine.imageUrl}
                        alt={shrine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Tradition & Circuit Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-md text-white backdrop-blur-xs flex items-center gap-1 shadow-xs"
                          style={{ background: shrine.badgeColor || '#d97706' }}
                        >
                          <span>{shrine.emoji}</span>
                          <span>{shrine.traditionLabel}</span>
                        </span>
                      </div>

                      {/* Circuit Name on Top Right */}
                      <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-amber-300 backdrop-blur-xs border border-amber-400/20 max-w-[160px] truncate">
                        {shrine.circuitName}
                      </div>

                      {/* City & State Location at Bottom of Image */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{shrine.city}, {shrine.state}</span>
                        </span>
                        {shrine.locality && (
                          <span className="text-[10px] text-stone-300 truncate max-w-[130px]">
                            {shrine.locality}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      <div>
                        <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                          {shrine.name}
                        </h4>
                        {shrine.vernacularName && (
                          <div className="text-xs text-amber-800/90 font-medium mt-0.5">
                            {shrine.vernacularName}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {shrine.spiritualSignificance}
                      </p>

                      {/* Architectural Style & Visiting Hours */}
                      <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 space-y-1.5 text-xs text-stone-700">
                        <div className="flex items-start gap-1.5">
                          <Landmark className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                          <span className="leading-snug">
                            <strong className="text-stone-900">Architecture: </strong>
                            <span className="line-clamp-2">{shrine.architecturalStyle}</span>
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                          <span className="leading-snug">
                            <strong className="text-stone-900">Timings: </strong>
                            <span className="line-clamp-1">{shrine.visitingHours}</span>
                          </span>
                        </div>
                      </div>

                      {/* Key Festivals */}
                      {shrine.festivals && shrine.festivals.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Venerated Festivals &amp; Celebrations:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {shrine.festivals.slice(0, 3).map((fest, fIdx) => (
                              <span
                                key={fIdx}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                              >
                                {fest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer with Quick GIS Map Jump & Google Maps */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <a
                        href={`/map?q=${encodeURIComponent(shrine.name)}`}
                        className="py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>View on GIS Map</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shrine.googleMapsQuery || (shrine.name + ' ' + shrine.city))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-center transition flex items-center justify-center gap-1.5 border border-stone-200"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
                        <span>Google Maps</span>
                      </a>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-500">
                      <span className="text-[10px] truncate max-w-[180px]">
                        Transit: {shrine.nearestTransit?.railway?.split('(')[0] || 'Rail link active'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const text = `${shrine.name} (${shrine.vernacularName || ''})
Location: ${shrine.city}, ${shrine.state}
Circuit: ${shrine.circuitName}
Timings: ${shrine.visitingHours}
Significance: ${shrine.spiritualSignificance}`;
                          navigator.clipboard?.writeText(text);
                          setCopiedId(shrine.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="text-stone-600 hover:text-amber-800 font-medium inline-flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3 h-3" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSacredList.length === 0 && (
            <div className="p-8 text-center bg-white rounded-xl border border-stone-200 space-y-2">
              <Info className="w-8 h-8 text-stone-400 mx-auto" />
              <div className="text-sm font-semibold text-stone-700">No sacred shrines matched your search filter.</div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSacredFilter('all');
                }}
                className="text-xs text-amber-700 underline font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. Tab Content: TOP STAYS */}
      {activeTab === 'stays' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 shrink-0 mt-0.5">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-amber-950 font-serif">
                  {currentLanguage === 'hi'
                    ? `${CITIES_HINDI_MAP[currentCity.name] || currentCity.name} में प्रमाणित आवास, हेरिटेज होटल व रिसॉर्ट्स`
                    : `Verified Heritage Stays & Luxury Accommodations in ${currentCity.name}`}
                </div>
                <div className="text-stone-600 mt-0.5">
                  Hand-picked 4-star &amp; 5-star heritage havelis, luxury beachfront retreats, and boutique eco-stays verified for safety, cultural hospitality, and authentic regional dining in {config.stateName}.
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300 text-[11px] font-bold shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Virasat Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentCity.topStays?.map((stay, idx) => {
              const dossier = resolveHotelDossier(
                stay,
                currentCity.name,
                config.stateName,
                config.stateId,
                currentCity.attractions
              );

              return (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Cover Image with Quick Actions */}
                  <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
                    <img
                      src={dossier.coverImage}
                      alt={dossier.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/90 text-white backdrop-blur-xs shadow-sm">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{currentLanguage === 'hi' ? `अनुशंसा #${idx + 1}` : `Top Pick #${idx + 1}`}</span>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-amber-300 backdrop-blur-xs border border-amber-400/30">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>{dossier.stars}★ {dossier.tier.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Bottom Locality on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs flex items-center justify-between">
                      <span className="font-semibold text-amber-300 truncate text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{dossier.locality}</span>
                      </span>
                      <span className="text-[10px] text-stone-300 bg-white/20 px-2 py-0.5 rounded backdrop-blur-xs">
                        {currentCity.name}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-2">
                      <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">
                        {dossier.name}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {dossier.category}
                      </p>

                      {/* Top Curated Amenities Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dossier.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200"
                          >
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            <span>{amenity.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tariffs Breakdown */}
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-stone-900 font-bold">
                        <span className="text-[11px] text-stone-500 font-medium">Night Stay:</span>
                        <span>{dossier.nightTariff}</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-800 text-[11px]">
                        <span className="text-stone-500 font-medium">Day Transit Pass:</span>
                        <span className="font-semibold">{dossier.dayTariff}</span>
                      </div>
                    </div>

                    {/* Action Buttons: Check Amenities Modal & Dedicated Page */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStayDossier(dossier);
                          setIsStayModalOpen(true);
                        }}
                        className="text-stone-600 hover:text-amber-800 font-semibold inline-flex items-center gap-1 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-stone-50 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{currentLanguage === 'hi' ? 'त्वरित पूर्वावलोकन' : 'Quick View'}</span>
                      </button>

                      <Link
                        to={`/hotel/${dossier.slug}`}
                        className="text-amber-800 hover:text-amber-900 font-bold inline-flex items-center gap-1 cursor-pointer py-1.5 px-3 rounded-xl bg-amber-100/70 hover:bg-amber-100 border border-amber-300/80 transition"
                      >
                        <span>{currentLanguage === 'hi' ? 'सुविधाएं व विवरण देखें' : 'Check Amenities & Details'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Tab Content: WHERE TO EAT */}
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
                <div className="font-bold text-amber-300">{currentLanguage === 'hi' ? `स्वादिष्ट खानपान संचिका · ${CITIES_HINDI_MAP[currentCity.name] || currentCity.name}` : `Gastronomic Dossier · ${currentCity.name}`}</div>
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
                  {currentLanguage === 'hi' ? 'प्रसिद्ध शाकाहारी भोजनालय' : 'Where to Eat (Vegetarian)'}
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
                        {currentLanguage === 'hi' ? 'शुद्ध शाकाहारी' : 'Pure Veg'}
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
                  {currentLanguage === 'hi' ? 'मांसाहारी एवं क्षेत्रीय लजीज व्यंजन' : 'Where to Eat (Non-Vegetarian & Regional Specialties)'}
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
                        {currentLanguage === 'hi' ? 'मांसाहारी' : 'Non-Veg'}
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
    
      {/* Hotel Amenities & Stay Dossier Interactive Modal */}
      <HotelAmenitiesModal
        dossier={selectedStayDossier}
        isOpen={isStayModalOpen}
        onClose={() => setIsStayModalOpen(false)}
        onOpenAIChat={onOpenAIChat}
      />
    </section>
  );
};
