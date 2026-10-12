import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { FestivalItem, FestivalLiveInfoResponse } from '../types';
import {
  Sparkles,
  Calendar,
  MapPin,
  Search,
  Bot,
  Hotel,
  Landmark,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  X,
  Filter,
  Flame,
  Info,
  Layers,
  AlertCircle,
  RefreshCw,
  Globe,
  Flag,
  Share2,
  Compass,
} from 'lucide-react';

interface FestivalsPageProps {
  onSelectPlace?: (placeId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const FestivalsPage: React.FC<FestivalsPageProps> = ({
  onSelectPlace,
  onNavigateTab,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [currentFestivals, setCurrentFestivals] = useState<FestivalItem[]>([]);
  const [upcomingFestivals, setUpcomingFestivals] = useState<FestivalItem[]>([]);
  const [allStates, setAllStates] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Pagination / Load More for State-Regional section
  const [visibleCount, setVisibleCount] = useState<number>(18);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('month') || 'All');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'current' | 'upcoming'>('all');

  // Detail Modal & Live Info State
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'live-info'>('overview');
  const [liveInfoLoading, setLiveInfoLoading] = useState<boolean>(false);
  const [liveInfoData, setLiveInfoData] = useState<FestivalLiveInfoResponse | null>(null);

  const months = [
    'All',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const fetchData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [festivalsRes, currentUpcomingRes, statesRes, citiesRes] = await Promise.allSettled([
        api.getFestivals({ limit: 400 }),
        api.getCurrentUpcomingFestivals('2026-09-26'),
        api.getStates(),
        api.getCities(),
      ]);

      if (festivalsRes.status === 'fulfilled' && festivalsRes.value) {
        setFestivals(festivalsRes.value);
      } else {
        setApiError('Unable to connect to the festival registry. Please retry.');
      }

      if (currentUpcomingRes.status === 'fulfilled' && currentUpcomingRes.value) {
        setCurrentFestivals(currentUpcomingRes.value.current || []);
        setUpcomingFestivals(currentUpcomingRes.value.upcoming || []);
      }

      if (statesRes.status === 'fulfilled' && Array.isArray(statesRes.value)) {
        const statesList = Array.from(new Set(statesRes.value.map((s: any) => s.name || s.id))).sort();
        setAllStates(statesList);
      }

      if (citiesRes.status === 'fulfilled' && Array.isArray(citiesRes.value)) {
        const citiesList = Array.from(new Set(citiesRes.value.map((c: any) => c.name))).sort();
        setAllCities(citiesList);
      }
    } catch (err: any) {
      console.error('Failed to load festivals data:', err);
      setApiError(err?.message || 'Failed to load festivals from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset modal state when selected festival changes
  useEffect(() => {
    setActiveModalTab('overview');
    setLiveInfoData(null);
    setLiveInfoLoading(false);
  }, [selectedFestival]);

  const fetchLiveInfo = async (festivalId: string, refresh = false) => {
    setLiveInfoLoading(true);
    try {
      const res = await api.getFestivalLiveInfo(festivalId, refresh);
      setLiveInfoData(res);
    } catch (err: any) {
      setLiveInfoData({
        success: false,
        has_sources: false,
        error_message: err?.message || 'Failed to connect to Google Search live info service',
        sources: [],
        last_fetched: new Date().toISOString(),
        disclaimer: 'Fetched from Google Search via Gemini – verify with official sources before travel.',
      });
    } finally {
      setLiveInfoLoading(false);
    }
  };

  // Update query params when filters change & reset pagination
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedState !== 'All') params.state = selectedState;
    if (selectedCity !== 'All') params.city = selectedCity;
    if (selectedMonth !== 'All') params.month = selectedMonth;
    setSearchParams(params, { replace: true });
    setVisibleCount(18);
  }, [searchQuery, selectedState, selectedCity, selectedMonth, activeFilterTab, setSearchParams]);

  const FESTIVAL_SEARCH_ALIASES: Record<string, string[]> = {
    holi: ['lathmar holi', 'braj holi', 'rangwali holi', 'dol jatra', 'barsana', 'gulal'],
    diwali: ['deepawali', 'deepavali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    deepawali: ['diwali', 'deepavali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    deepavali: ['diwali', 'deepawali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    karthigai: ['karthigai deepam', 'annamalai deepam', 'tiruvannamalai deepam'],
    deepam: ['karthigai deepam', 'annamalai deepam', 'tiruvannamalai deepam'],
    navratri: ['navaratri', 'durga puja', 'garba', 'dandiya', 'bathukamma'],
    navaratri: ['navratri', 'durga puja', 'garba'],
    dasara: ['dussehra', 'vijayadashami', 'mysuru dasara', 'kullu dussehra', 'bastar dussehra', 'kota dussehra'],
    dussehra: ['dasara', 'vijayadashami', 'mysuru dasara', 'kullu dussehra', 'bastar dussehra', 'kota dussehra'],
    durga: ['durga puja', 'navratri', 'dussehra'],
    chath: ['chhath puja', 'chhath', 'surya shashthi'],
    chhath: ['chhath puja', 'surya shashthi', 'dala chhath'],
    onam: ['thiruvonam', 'vallam kali'],
    pongal: ['thai pongal', 'jallikattu', 'makar sankranti', 'uttarayan'],
    bihu: ['rongali bihu', 'bohag bihu', 'magh bihu', 'kati bihu'],
    baisakhi: ['vaisakhi', 'khalsa sirjana'],
    vaisakhi: ['baisakhi'],
    eid: ['eid ul fitr', 'eid al adha', 'eid milad un nabi'],
    christmas: ['feast of st francis xavier', 'carnival of goa'],
    losar: ['tibetan new year', 'ladakhi new year', 'spiti new year'],
    shigmo: ['shigmotsav', 'goa spring festival'],
    yaoshang: ['yaoshang festival', 'manipur spring', 'thabal chongba'],
  };

  // Base list filtered by search, state, city, month
  const baseFilteredFestivals = useMemo(() => {
    let list = festivals;

    if (searchQuery.trim()) {
      const rawQ = searchQuery.trim();
      const q = rawQ.toLowerCase();
      const aliasTerms = FESTIVAL_SEARCH_ALIASES[q] || [];
      const wordPattern =
        q.length <= 4
          ? new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
          : new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');

      list = list.filter((item) => {
        const nameLower = item.name.toLowerCase();
        const idLower = item.id.toLowerCase();
        const slugLower = (item.slug || '').toLowerCase();

        // 1. Direct match on name, slug, id
        if (nameLower.includes(q) || idLower.includes(q) || slugLower.includes(q)) {
          return true;
        }
        if (q.includes(nameLower) || (slugLower && q.includes(slugLower)) || q.includes(idLower)) {
          return true;
        }

        // Multi-word festival name match
        const nameWords = nameLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2);
        if (nameWords.length >= 2 && nameWords.every((w) => q.includes(w))) {
          return true;
        }

        // 2. Direct match on city, state, alternate locations
        if (item.primary_city.toLowerCase().includes(q)) return true;
        if (item.state.toLowerCase().includes(q)) return true;
        if (item.alternate_locations && item.alternate_locations.some((loc) => loc.toLowerCase().includes(q))) return true;
        if (Array.isArray(item.states) && item.states.some((s) => s.toLowerCase().includes(q))) return true;

        // 3. Cultural vibe or category match
        if (item.cultural_vibe && item.cultural_vibe.toLowerCase().includes(q)) return true;
        if (item.religion_or_category && item.religion_or_category.toLowerCase().includes(q)) return true;

        // 4. Aliases match
        if (Array.isArray(item.aliases)) {
          for (const a of item.aliases) {
            const aLower = a.toLowerCase();
            if (aLower.includes(q) || (aLower.length >= 4 && q.includes(aLower))) return true;
          }
        }
        for (const term of aliasTerms) {
          if (nameLower.includes(term) || idLower.includes(term) || (slugLower && slugLower.includes(term))) return true;
          if (Array.isArray(item.aliases) && item.aliases.some((a) => a.toLowerCase().includes(term))) return true;
        }

        // 5. Description word-boundary match
        const isMajorTerm = ['holi', 'diwali', 'navratri', 'dasara', 'dussehra'].includes(q);
        if (!isMajorTerm && wordPattern.test(item.description)) {
          return true;
        }

        return false;
      });

      // Relevance ranking
      list.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aDirect = aName === q || q.includes(aName) || aName.includes(q);
        const bDirect = bName === q || q.includes(bName) || bName.includes(q);
        if (aDirect && !bDirect) return -1;
        if (!aDirect && bDirect) return 1;

        const qWords = q.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2);
        const aScore = qWords.filter((w) => aName.includes(w) || a.primary_city.toLowerCase().includes(w)).length;
        const bScore = qWords.filter((w) => bName.includes(w) || b.primary_city.toLowerCase().includes(w)).length;
        if (aScore !== bScore) return bScore - aScore;

        return a.name.localeCompare(b.name);
      });
    }

    if (selectedState !== 'All') {
      const s = selectedState.toLowerCase();
      list = list.filter((f) => {
        const matchesPrimary = f.state.toLowerCase() === s || f.state_id?.toLowerCase() === s;
        const matchesStatesList = Array.isArray(f.states) && f.states.some((st) => st.toLowerCase() === s);
        return matchesPrimary || matchesStatesList;
      });
    }

    if (selectedCity !== 'All') {
      const c = selectedCity.toLowerCase();
      list = list.filter(
        (f) =>
          f.primary_city.toLowerCase().includes(c) ||
          f.primary_city_id?.toLowerCase() === c ||
          (f.alternate_locations && f.alternate_locations.some((loc) => loc.toLowerCase().includes(c)))
      );
    }

    if (selectedMonth !== 'All') {
      const m = selectedMonth.toLowerCase();
      list = list.filter((f) => {
        const tm = (f.typical_month || '').toLowerCase();
        const ts = (f.typical_season || '').toLowerCase();
        const start = f.exact_date_start || '';
        return tm.includes(m) || ts.includes(m) || start.includes(`-${m}-`);
      });
    }

    return list;
  }, [festivals, searchQuery, selectedState, selectedCity, selectedMonth]);

  // Tab counts
  const currentIds = useMemo(() => new Set(currentFestivals.map((f) => f.id)), [currentFestivals]);
  const upcomingIds = useMemo(() => new Set(upcomingFestivals.map((f) => f.id)), [upcomingFestivals]);

  const currentMatchingCount = useMemo(() => {
    return baseFilteredFestivals.filter((f) => currentIds.has(f.id)).length;
  }, [baseFilteredFestivals, currentIds]);

  const upcomingMatchingCount = useMemo(() => {
    return baseFilteredFestivals.filter((f) => upcomingIds.has(f.id)).length;
  }, [baseFilteredFestivals, upcomingIds]);

  // Filtered festival list respecting active calendar tab
  const filteredFestivals = useMemo(() => {
    if (activeFilterTab === 'current') {
      return baseFilteredFestivals.filter((f) => currentIds.has(f.id));
    }
    if (activeFilterTab === 'upcoming') {
      return baseFilteredFestivals.filter((f) => upcomingIds.has(f.id));
    }
    return baseFilteredFestivals;
  }, [baseFilteredFestivals, activeFilterTab, currentIds, upcomingIds]);

  // Partition festivals into 3 distinct sections per brief:
  // 1. National Days & Observances (Republic Day, Independence Day, Gandhi Jayanti, etc.)
  const nationalObservances = useMemo(() => {
    return filteredFestivals.filter((f) => f.scope === 'NATIONAL_OBSERVANCE');
  }, [filteredFestivals]);

  // 2. All-India & Pan-India Festivals (appear at the very top of festival listings)
  const allIndiaFestivals = useMemo(() => {
    return filteredFestivals.filter(
      (f) =>
        f.scope !== 'NATIONAL_OBSERVANCE' &&
        (f.scope === 'ALL_INDIA' ||
          f.scope === 'PAN_INDIA_RELIGIOUS' ||
          f.state === 'All India' ||
          f.primary_city === 'Pan-India')
    );
  }, [filteredFestivals]);

  // 3. State & Regional Festivals (listed below All-India, clearly showing State/Region)
  const stateRegionalFestivals = useMemo(() => {
    return filteredFestivals.filter(
      (f) =>
        f.scope !== 'NATIONAL_OBSERVANCE' &&
        f.scope !== 'ALL_INDIA' &&
        f.scope !== 'PAN_INDIA_RELIGIOUS' &&
        f.state !== 'All India' &&
        f.primary_city !== 'Pan-India'
    );
  }, [filteredFestivals]);

  // Actions
  const handleShowOnMap = (festival: FestivalItem) => {
    const lat = festival.lat;
    const lng = festival.lng;
    const query = festival.name;
    if (lat && lng) {
      navigate(`/map?q=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`);
    } else {
      navigate(`/map?q=${encodeURIComponent(query)}`);
    }
  };

  const handleAddToItinerary = (festival: FestivalItem) => {
    navigate(`/itinerary?destination=${encodeURIComponent(festival.primary_city)}&festival=${encodeURIComponent(festival.name)}`);
  };

  const handleAskAI = (festival: FestivalItem) => {
    navigate(`/ai?q=${encodeURIComponent(`Tell me about ${festival.name} in ${festival.primary_city}, ${festival.state}. What are the key rituals, best places to see, and visitor advice?`)}`);
  };

  const handleExploreCity = (cityId?: string, cityName?: string) => {
    const target = cityId || (cityName ? cityName.toLowerCase().replace(/\s+/g, '-') : 'mumbai');
    navigate(`/city/${target}`);
  };

  // Reusable card media renderer with clean neutral placeholder for new festivals without photos
  const renderCardMedia = (fest: FestivalItem) => {
    const hasImage = fest.image_url && fest.image_url.trim().length > 0;

    if (hasImage) {
      return (
        <div className="relative h-48 sm:h-52 shrink-0 overflow-hidden bg-neutral-900">
          <img
            src={fest.image_url}
            alt={fest.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
          {renderCardOverlayBadges(fest)}
        </div>
      );
    }

    // Authentic Neutral Placeholder (Zero stock photos, clean cultural aesthetic)
    return (
      <div className="relative h-48 sm:h-52 shrink-0 overflow-hidden bg-gradient-to-br from-[#241A14] via-[#35251C] to-[#1C1510] p-4 flex flex-col justify-between text-white group-hover:brightness-105 transition-all">
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#E06D24]/15 blur-2xl pointer-events-none" />
        {renderCardOverlayBadges(fest)}

        {/* Title overlay in placeholder */}
        <div className="mt-auto pt-6 z-10">
          <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{fest.state || 'All India'}</span>
            {fest.region && (
              <>
                <span className="text-white/40">•</span>
                <span className="text-amber-200/90 text-[11px] shrink-0">{fest.region} India</span>
              </>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-white drop-shadow-sm leading-snug line-clamp-2">
            {fest.name}
          </h3>
        </div>
      </div>
    );
  };

  const renderCardOverlayBadges = (fest: FestivalItem) => {
    const isVerifiedDate = fest.is_date_verified && fest.exact_date_start;
    const hasImage = fest.image_url && fest.image_url.trim().length > 0;

    return (
      <>
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap max-w-[70%]">
            <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{fest.state}</span>
            </span>

            {fest.region && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 text-[11px] font-semibold border border-amber-400/30">
                {fest.region}
              </span>
            )}
          </div>

          {isVerifiedDate ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-sm shrink-0">
              <ShieldCheck className="w-3 h-3" /> Verified Date
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 shadow-sm shrink-0">
              <Clock className="w-3 h-3" /> Expected
            </span>
          )}
        </div>

        {/* Bottom overlay for image cards */}
        {hasImage && (
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none z-10">
            <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{fest.primary_city}</span>
              {fest.alternate_locations && fest.alternate_locations.length > 0 && (
                <span className="text-white/70 text-[11px] shrink-0"> &amp; more</span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white drop-shadow-sm leading-snug line-clamp-2">
              {fest.name}
            </h3>
          </div>
        )}
      </>
    );
  };

  const renderFestivalCard = (fest: FestivalItem, isAllIndia = false) => {
    const isVerifiedDate = fest.is_date_verified && fest.exact_date_start;

    return (
      <article
        key={fest.id}
        onClick={() => setSelectedFestival(fest)}
        className="bg-white rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer h-full"
      >
        {renderCardMedia(fest)}

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Cultural Vibe & Tradition pills */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {fest.religion_or_category && (
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                  {fest.religion_or_category}
                </span>
              )}

              {fest.cultural_vibe && (
                <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-200/60 text-[#D45B10] text-xs font-semibold truncate max-w-[200px]">
                  {fest.cultural_vibe}
                </span>
              )}

              {isAllIndia && (
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  Pan-India Celebration
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 mb-4 leading-relaxed">
              {fest.description}
            </p>

            {/* Date Indicator */}
            <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#EFE8DF] mb-4 text-xs">
              <div className="font-semibold text-neutral-800 flex items-center gap-1.5 mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#E06D24] shrink-0" />
                {isVerifiedDate ? (
                  <span>
                    {fest.exact_date_start} — {fest.exact_date_end}
                  </span>
                ) : (
                  <span>Typical Period: {fest.typical_season || 'Annual Observance'}</span>
                )}
              </div>
              <div className="text-[11px] text-neutral-500">
                {isVerifiedDate
                  ? 'Synchronized 2026 festival schedule'
                  : 'Traditional annual timing estimate; verify local panchanga'}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-3 border-t border-[#EFE8DF] flex items-center justify-between gap-2 mt-auto">
            <span className="text-xs font-semibold text-neutral-800 group-hover:text-[#E06D24] transition-colors flex items-center gap-1">
              View Details <ChevronRight className="w-3.5 h-3.5" />
            </span>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                title="Show festival location on Map"
                onClick={() => handleShowOnMap(fest)}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                title="Add to Itinerary"
                onClick={() => handleAddToItinerary(fest)}
                className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#D45B10] transition-colors"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                title="Ask AI Assistant about festival"
                onClick={() => handleAskAI(fest)}
                className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
              >
                <Bot className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C241E] pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1C1612] via-[#2A1D15] to-[#FAF7F2] pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Living Heritage & Celebrations of India
            </div>
            <div className="text-xs text-amber-200/80 font-medium bg-black/30 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
              Master Registry • All-India &amp; State-Wise Traditions
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight mb-4">
            Festivals Across <span className="text-[#FF9933] italic">India</span>
          </h1>
          <p className="text-base sm:text-lg text-[#EFE8DF]/90 max-w-3xl leading-relaxed mb-8">
            Experience India&apos;s soul through its nationwide celebrations, sacred ghat illuminations, tribal music valleys, and vibrant seasonal harvests across all 28 states and 8 union territories.
          </p>

          {/* Quick Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById('festival-filter-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl max-w-3xl flex flex-col sm:flex-row items-center gap-2 border border-white/20"
          >
            <div className="flex items-center gap-3 px-3 flex-1 w-full text-neutral-800">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                id="festival-search-input"
                type="text"
                placeholder="Search Holi, Diwali, Durga Puja, Hornbill, Bihu, Onam, Losar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-neutral-900 placeholder-neutral-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#E06D24] hover:bg-[#D45B10] text-white text-sm font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter Events
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Current & Upcoming Section Highlight */}
        <section id="festival-filter-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#EFE8DF] mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#E06D24] text-xs font-bold uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                Date-Aware Cultural Calendar (Sept - Nov 2026)
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C241E]">
                Current &amp; Upcoming Celebrations
              </h2>
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE8DF] text-xs font-semibold">
              <button
                onClick={() => setActiveFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilterTab === 'all'
                    ? 'bg-[#2C241E] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All ({baseFilteredFestivals.length})
              </button>
              <button
                onClick={() => setActiveFilterTab('current')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeFilterTab === 'current'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Now ({currentMatchingCount})
              </button>
              <button
                onClick={() => setActiveFilterTab('upcoming')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilterTab === 'upcoming'
                    ? 'bg-[#E06D24] text-white shadow-sm'
                    : 'text-[#E06D24] hover:text-orange-700'
                }`}
              >
                Upcoming Autumn &amp; Winter ({upcomingMatchingCount})
              </button>
            </div>
          </div>

          {/* Current Festivals Spotlight Banner */}
          {currentFestivals.length > 0 && activeFilterTab !== 'upcoming' && (
            <div className="mb-6 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-amber-50/40 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Live Currently in India
                </span>
                <span className="text-xs text-emerald-800 font-medium">
                  Verified Active Festival Period: September 2026
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentFestivals.map((fest) => (
                  <div
                    key={fest.id}
                    className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm flex gap-4 items-center hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedFestival(fest)}
                  >
                    {fest.image_url ? (
                      <img
                        src={fest.image_url}
                        alt={fest.name}
                        className="w-20 h-20 rounded-lg object-cover shrink-0 border border-neutral-100"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-[#2C241E] flex flex-col items-center justify-center text-amber-400 p-2 text-center shrink-0">
                        <Sparkles className="w-5 h-5 mb-1" />
                        <span className="text-[10px] leading-tight text-white/90 font-medium line-clamp-1">{fest.state}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {fest.state}
                        </span>
                        {fest.region && (
                          <span className="text-[11px] font-semibold text-neutral-500">
                            • {fest.region}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-neutral-900 truncate">
                        {fest.name}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                        {fest.cultural_vibe || fest.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Three Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EFE8DF]">
            {/* State Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Filter by State / UT
              </label>
              <select
                id="festival-state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-3 py-2 text-sm text-neutral-800 font-medium focus:outline-none focus:border-[#E06D24]"
              >
                <option value="All">All States &amp; UTs</option>
                {allStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Filter by Primary City
              </label>
              <select
                id="festival-city-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-3 py-2 text-sm text-neutral-800 font-medium focus:outline-none focus:border-[#E06D24]"
              >
                <option value="All">All Cities</option>
                {allCities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Typical Month / Season
              </label>
              <select
                id="festival-month-filter"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-3 py-2 text-sm text-neutral-800 font-medium focus:outline-none focus:border-[#E06D24]"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All' ? 'All Months & Seasons' : m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Results Counter & Active Query Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="text-sm font-semibold text-neutral-700">
            {searchQuery.trim() || selectedState !== 'All' || selectedCity !== 'All' || selectedMonth !== 'All' ? (
              <span>
                Found <span className="text-[#E06D24] font-bold">{filteredFestivals.length}</span> matching celebrations (of {festivals.length} across India)
                {searchQuery.trim() && (
                  <span className="text-neutral-500 font-normal"> for &ldquo;<span className="text-neutral-900 font-semibold">{searchQuery}</span>&rdquo;</span>
                )}
              </span>
            ) : (
              <span>
                Showing <span className="text-[#E06D24] font-bold">{filteredFestivals.length}</span> verified festivals and cultural observances across India
              </span>
            )}
          </div>
          {(selectedState !== 'All' || selectedCity !== 'All' || selectedMonth !== 'All' || searchQuery || activeFilterTab !== 'all') && (
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCity('All');
                setSelectedMonth('All');
                setSearchQuery('');
                setActiveFilterTab('all');
                setVisibleCount(18);
              }}
              className="text-xs font-semibold text-[#E06D24] hover:underline flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters &amp; Show All {festivals.length}
            </button>
          )}
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-[#EFE8DF]" />
            ))}
          </div>
        ) : apiError && festivals.length === 0 ? (
          <div className="bg-red-50 rounded-3xl p-10 text-center border border-red-200 max-w-xl mx-auto my-12 shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-neutral-900 mb-2">
              Unable to Load Festivals
            </h3>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              We encountered an issue communicating with the Virasat Cultural Registry. Please retry below.
            </p>
            <button
              onClick={() => fetchData()}
              className="px-6 py-2.5 bg-[#E06D24] hover:bg-[#D45B10] text-white font-semibold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        ) : filteredFestivals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EFE8DF] max-w-xl mx-auto my-12">
            <Sparkles className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-neutral-800 mb-2">
              No matching festivals found
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              We couldn&apos;t find any festival matching your current search or filter combination. Try clearing filters to see all celebrations.
            </p>
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCity('All');
                setSelectedMonth('All');
                setSearchQuery('');
                setActiveFilterTab('all');
                setVisibleCount(18);
              }}
              className="px-6 py-2.5 bg-[#E06D24] hover:bg-[#D45B10] text-white font-semibold text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters &amp; Show All {festivals.length} Celebrations
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* =========================================================================
                SECTION 1: ALL-INDIA FESTIVALS (AT THE VERY TOP)
               ========================================================================= */}
            {allIndiaFestivals.length > 0 && (
              <section id="all-india-festivals-section" className="scroll-mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EFE8DF]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E06D24]" />
                      Pan-India Celebrations
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
                      All-India &amp; Trans-Regional Festivals
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                      Nationwide cultural and spiritual observances celebrated across multiple states and union territories.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-neutral-500 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE8DF] self-start sm:self-auto">
                    {allIndiaFestivals.length} Pan-India {allIndiaFestivals.length === 1 ? 'Festival' : 'Festivals'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allIndiaFestivals.map((fest) => renderFestivalCard(fest, true))}
                </div>
              </section>
            )}

            {/* =========================================================================
                SECTION 2: STATE-WISE FESTIVALS (LISTED BELOW)
               ========================================================================= */}
            {stateRegionalFestivals.length > 0 && (
              <section id="state-regional-festivals-section" className="scroll-mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EFE8DF]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#D45B10] text-xs font-bold uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E06D24]" />
                      State &amp; Regional Heritage
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
                      State-Wise Celebrations &amp; Regional Fairs
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                      Unique regional traditions, temple festivals, and indigenous tribal celebrations with explicit state and regional provenance.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-neutral-500 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE8DF] self-start sm:self-auto">
                    Showing {Math.min(visibleCount, stateRegionalFestivals.length)} of {stateRegionalFestivals.length} Regional Celebrations
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stateRegionalFestivals.slice(0, visibleCount).map((fest) => renderFestivalCard(fest, false))}
                </div>

                {/* Pagination / Load More for State Festivals */}
                {visibleCount < stateRegionalFestivals.length && (
                  <div className="mt-12 flex flex-col items-center justify-center gap-3">
                    <div className="text-xs font-semibold text-neutral-500">
                      Showing {Math.min(visibleCount, stateRegionalFestivals.length)} of {stateRegionalFestivals.length} state-specific festivals
                    </div>
                    <div className="w-full max-w-xs bg-[#EFE8DF] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#E06D24] h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round((Math.min(visibleCount, stateRegionalFestivals.length) / stateRegionalFestivals.length) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        id="load-more-festivals-btn"
                        onClick={() => setVisibleCount((prev) => prev + 18)}
                        className="px-6 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold rounded-xl border border-[#EFE8DF] shadow-sm hover:shadow transition-all flex items-center gap-2"
                      >
                        Load More Regional Celebrations
                        <span className="text-xs text-[#E06D24] bg-orange-50 px-2 py-0.5 rounded-full font-bold">
                          +{Math.min(18, stateRegionalFestivals.length - visibleCount)}
                        </span>
                      </button>
                      <button
                        onClick={() => setVisibleCount(stateRegionalFestivals.length)}
                        className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-[#E06D24] transition-colors"
                      >
                        Show All ({stateRegionalFestivals.length})
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* =========================================================================
                SECTION 3: NATIONAL DAYS & OBSERVANCES (SEPARATE DEDICATED BLOCK)
               ========================================================================= */}
            {nationalObservances.length > 0 && (
              <section
                id="national-observances-section"
                className="bg-gradient-to-br from-[#FFF9F2] via-white to-[#F2F8F4] rounded-3xl p-6 sm:p-8 border-2 border-orange-200/70 shadow-sm scroll-mt-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EFE8DF]">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#FF9933] via-white to-[#138808] border border-neutral-300 shadow-sm shrink-0">
                      <Flag className="w-5 h-5 text-neutral-800" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
                        Republic of India
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
                        National Days &amp; Observances
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                        Sovereign national commemorations, constitutional celebrations, and historic remembrance days observed across the Republic of India.
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 self-start sm:self-auto">
                    {nationalObservances.length} National Observances
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nationalObservances.map((fest) => (
                    <article
                      key={fest.id}
                      onClick={() => setSelectedFestival(fest)}
                      className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-[#E06D24] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-100 to-green-100 text-neutral-800 text-[11px] font-bold border border-neutral-200 flex items-center gap-1">
                            <Flag className="w-3 h-3 text-[#E06D24]" />
                            National Observance
                          </span>
                          <span className="text-xs text-neutral-500 font-medium">
                            Pan-India
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-neutral-900 group-hover:text-[#E06D24] transition-colors mb-2">
                          {fest.name}
                        </h4>
                        <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                          {fest.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                        <span className="text-[#E06D24] font-semibold flex items-center gap-1">
                          View Protocol &amp; Details <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-neutral-400 font-medium">
                          Official Observance
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          FESTIVAL DETAIL MODAL (WITH LIVE INFO GOOGLE TAB)
         ========================================================================= */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFE8DF] flex flex-col">
            {/* Modal Header Media */}
            <div className="relative h-60 sm:h-72 shrink-0 bg-neutral-900">
              {selectedFestival.image_url ? (
                <img
                  src={selectedFestival.image_url}
                  alt={selectedFestival.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#241A14] via-[#35251C] to-[#1C1510] flex flex-col justify-end p-6 text-white relative">
                  <div className="absolute top-6 left-6 p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedFestival(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Title Overlay */}
              <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                <div className="flex items-center gap-2 mb-1 text-xs text-amber-300 font-semibold uppercase tracking-wider">
                  <span>{selectedFestival.state}</span>
                  {selectedFestival.region && (
                    <>
                      <span>•</span>
                      <span>{selectedFestival.region} India</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{selectedFestival.primary_city}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-sm">
                  {selectedFestival.name}
                </h2>
              </div>
            </div>

            {/* Modal Navigation Tabs (Overview vs Live Info Google) */}
            <div className="flex border-b border-[#EFE8DF] px-6 sm:px-8 bg-[#FAF7F2] sticky top-0 z-20">
              <button
                onClick={() => setActiveModalTab('overview')}
                className={`py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  activeModalTab === 'overview'
                    ? 'border-[#E06D24] text-[#E06D24]'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Landmark className="w-4 h-4" />
                Overview &amp; Traditions
              </button>
              <button
                onClick={() => {
                  setActiveModalTab('live-info');
                  if (!liveInfoData && selectedFestival) {
                    fetchLiveInfo(selectedFestival.id);
                  }
                }}
                className={`py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
                  activeModalTab === 'live-info'
                    ? 'border-[#E06D24] text-[#E06D24]'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Globe className="w-4 h-4 text-blue-600" />
                Live Info (Google)
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  Search Grounded
                </span>
              </button>
            </div>

            {/* Modal Tab 1: Overview & Heritage */}
            {activeModalTab === 'overview' && (
              <div className="p-6 sm:p-8 flex-1 space-y-6">
                {/* Cultural Vibe & Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                    <div className="text-xs text-neutral-500 font-medium mb-1">Cultural Essence</div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {selectedFestival.cultural_vibe || `${selectedFestival.religion_or_category || 'Traditional'} celebration`}
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                    <div className="text-xs text-neutral-500 font-medium mb-1">
                      {selectedFestival.is_date_verified ? 'Verified Dates' : 'Typical Season'}
                    </div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {selectedFestival.is_date_verified && selectedFestival.exact_date_start
                        ? `${selectedFestival.exact_date_start} to ${selectedFestival.exact_date_end}`
                        : selectedFestival.typical_season || 'Annual Observance'}
                    </div>
                  </div>
                </div>

                {/* Scope & Religion/Category */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-[#D45B10] font-bold">
                    Scope: {selectedFestival.scope || 'ALL_INDIA'}
                  </span>
                  {selectedFestival.religion_or_category && (
                    <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                      Tradition: {selectedFestival.religion_or_category}
                    </span>
                  )}
                  {selectedFestival.region && (
                    <span className="px-3 py-1 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium">
                      Region: {selectedFestival.region} India
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    About the Celebration
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {selectedFestival.description}
                  </p>
                </div>

                {/* Tradition Notes if any (e.g. Jain & Sikh perspectives on Diwali) */}
                {selectedFestival.tradition_notes && (
                  <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-950">
                    <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-[#E06D24]" />
                      Multi-Tradition Observance Notes
                    </div>
                    <p className="leading-relaxed">{selectedFestival.tradition_notes}</p>
                  </div>
                )}

                {/* Associated Places / Heritage Sites */}
                {selectedFestival.associated_places && selectedFestival.associated_places.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-2">
                      Key Sacred Sites &amp; Landmarks
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFestival.associated_places.map((place, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-900 flex items-center gap-1.5"
                        >
                          <Landmark className="w-3.5 h-3.5 text-[#E06D24]" />
                          {place}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* States / Alternate Locations */}
                {((selectedFestival.states && selectedFestival.states.length > 0) ||
                  (selectedFestival.alternate_locations && selectedFestival.alternate_locations.length > 0)) && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                      Celebrated Across States &amp; Regions
                    </h4>
                    <div className="flex flex-wrap gap-1.5 text-xs text-neutral-700">
                      {Array.from(
                        new Set([
                          ...(selectedFestival.states || []),
                          ...(selectedFestival.alternate_locations || []),
                        ])
                      ).map((st, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-medium">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified Image Attribution & License */}
                {selectedFestival.image_url ? (
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-3">
                    <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-800 mb-0.5">Image Provenance &amp; Verification</div>
                      <div>Source: {selectedFestival.source_name || 'Wikimedia Commons / Ministry of Tourism'}</div>
                      {selectedFestival.license && <div>License: {selectedFestival.license}</div>}
                      {selectedFestival.attribution_text && <div>Attribution: {selectedFestival.attribution_text}</div>}
                      {selectedFestival.source_url && (
                        <a
                          href={selectedFestival.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E06D24] hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                        >
                          View Source Archive <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-3">
                    <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-800 mb-0.5">Official Registry Record</div>
                      <div>Sourced from the National Festivals and Cultural Events Master Database. Neutral placeholder displayed in accordance with verified image standards.</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Tab 2: Live Info (Google) */}
            {activeModalTab === 'live-info' && (
              <div className="p-6 sm:p-8 flex-1 space-y-6">
                {/* Live Grounding Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/80 border border-blue-200 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        Google Search Live Grounding
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="text-[11px] text-blue-700">
                        Real-time web search for upcoming dates, lunar variations, and crowd advisories
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => fetchLiveInfo(selectedFestival.id, true)}
                    disabled={liveInfoLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-50 text-blue-800 text-xs font-semibold border border-blue-200 shadow-sm transition-all self-start sm:self-auto disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${liveInfoLoading ? 'animate-spin' : ''}`} />
                    Refresh from Google
                  </button>
                </div>

                {/* Loading State */}
                {liveInfoLoading && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <h4 className="text-sm font-bold text-neutral-800">
                      Grounding search via Gemini and Google Search...
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-sm">
                      Retrieving current celebration schedules, local temple announcements, and transport advisories for {selectedFestival.name}.
                    </p>
                  </div>
                )}

                {/* Loaded Content */}
                {!liveInfoLoading && liveInfoData && (
                  <>
                    {/* Error / No sources banner */}
                    {(!liveInfoData.has_sources || !liveInfoData.data) && (
                      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-center space-y-3">
                        <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                        <h4 className="text-sm font-bold text-amber-950">
                          {liveInfoData.error_message || 'No reliable sources found'}
                        </h4>
                        <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                          Live Google Search grounding did not return sufficiently authoritative sources for this specific search query. Please refer to traditional astronomical panchanga or local district administration.
                        </p>
                        <button
                          onClick={() => fetchLiveInfo(selectedFestival.id, true)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Retry Live Search
                        </button>
                      </div>
                    )}

                    {/* Successfully Grounded Data Display */}
                    {liveInfoData.has_sources && liveInfoData.data && (
                      <div className="space-y-5">
                        {/* 1. Dates & Timing Card */}
                        <div className="bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-white rounded-2xl p-5 border border-orange-200/80 shadow-sm">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#D45B10] uppercase tracking-wider mb-2">
                            <Calendar className="w-4 h-4 text-[#E06D24]" />
                            Upcoming / Current Celebration Schedule
                          </div>
                          <div className="text-lg font-serif font-bold text-neutral-900 mb-1">
                            {liveInfoData.data.upcoming_dates || 'Refer to search sources below'}
                          </div>
                          {liveInfoData.data.date_variation_notes && (
                            <div className="text-xs text-neutral-600 mt-2 bg-white/80 p-2.5 rounded-xl border border-orange-100 leading-relaxed">
                              <span className="font-semibold text-neutral-800">Astronomical &amp; Lunar Notes: </span>
                              {liveInfoData.data.date_variation_notes}
                            </div>
                          )}
                          {liveInfoData.data.duration && (
                            <div className="text-xs text-neutral-600 mt-2 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              <span className="font-semibold">Duration: </span> {liveInfoData.data.duration}
                            </div>
                          )}
                        </div>

                        {/* 2. Best Places to Experience */}
                        {liveInfoData.data.best_experienced_places && liveInfoData.data.best_experienced_places.length > 0 && (
                          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#E06D24]" />
                              Best Places to Experience
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {liveInfoData.data.best_experienced_places.map((place, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-xl bg-white border border-[#EFE8DF] text-xs font-semibold text-neutral-800 shadow-2xs"
                                >
                                  {place}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. Key Rituals & Ceremonies */}
                        {liveInfoData.data.key_rituals && liveInfoData.data.key_rituals.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-[#E06D24]" />
                              Key Rituals &amp; Highlights
                            </h4>
                            <ul className="space-y-1.5 text-xs text-neutral-700 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                              {liveInfoData.data.key_rituals.map((r, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#E06D24] font-bold">•</span>
                                  <span className="leading-relaxed">{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 4. Practical Travel Advice & Crowd Warnings */}
                        {liveInfoData.data.travel_tips && liveInfoData.data.travel_tips.length > 0 && (
                          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
                            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-amber-700" />
                              Practical Travel Advice &amp; Crowd Guidance
                            </h4>
                            <ul className="space-y-1.5 text-xs text-amber-950">
                              {liveInfoData.data.travel_tips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-amber-600 font-bold">•</span>
                                  <span className="leading-relaxed">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 5. Official Notices & Advisory */}
                        {liveInfoData.data.official_notices && (
                          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1.5">
                              Official Advisory &amp; Temple Notices
                            </h4>
                            <p className="text-xs text-neutral-700 leading-relaxed">
                              {liveInfoData.data.official_notices}
                            </p>
                          </div>
                        )}

                        {/* 6. Grounding Sources (Citations) */}
                        {liveInfoData.sources && liveInfoData.sources.length > 0 && (
                          <div className="pt-2">
                            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-blue-600" />
                              Google Search Sources ({liveInfoData.sources.length})
                            </h4>
                            <div className="space-y-1.5">
                              {liveInfoData.sources.map((src, i) => (
                                <a
                                  key={i}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs text-blue-700 font-medium transition-colors group"
                                >
                                  <span className="truncate pr-2 group-hover:underline">
                                    {src.title || src.uri}
                                  </span>
                                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mandatory Disclaimer Box */}
                    <div className="mt-4 p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-600 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <div>
                        {liveInfoData.disclaimer || 'Fetched from Google Search via Gemini – verify with official sources before travel.'}
                        {liveInfoData.last_fetched && (
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            Last checked: {new Date(liveInfoData.last_fetched).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Modal Direct Actions Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-[#EFE8DF] grid grid-cols-2 sm:grid-cols-4 gap-3 sticky bottom-0 z-20">
              <button
                onClick={() => handleShowOnMap(selectedFestival)}
                className="px-3 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Show on Map
              </button>

              <button
                onClick={() => handleAddToItinerary(selectedFestival)}
                className="px-3 py-2.5 rounded-xl bg-[#E06D24] hover:bg-[#D45B10] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                Plan Itinerary
              </button>

              <button
                onClick={() => handleAskAI(selectedFestival)}
                className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                Ask Virasat AI
              </button>

              <button
                onClick={() => handleExploreCity(selectedFestival.primary_city_id, selectedFestival.primary_city)}
                className="px-3 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Hotel className="w-3.5 h-3.5" />
                Hotels &amp; City
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
