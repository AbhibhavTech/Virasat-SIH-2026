import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { FestivalItem } from '../types';
import {
  Sparkles,
  Calendar,
  MapPin,
  Search,
  Compass,
  Bot,
  Hotel,
  Landmark,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  ArrowRight,
  X,
  Filter,
  Flame,
  Info,
  Layers,
  AlertCircle,
  RefreshCw,
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

  // Pagination / Load More
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('month') || 'All');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'current' | 'upcoming'>('all');

  // Detail Modal
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);

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
        api.getFestivals({ limit: 200 }),
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

  // Update query params when filters change & reset pagination
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedState !== 'All') params.state = selectedState;
    if (selectedCity !== 'All') params.city = selectedCity;
    if (selectedMonth !== 'All') params.month = selectedMonth;
    setSearchParams(params, { replace: true });
    setVisibleCount(12);
  }, [searchQuery, selectedState, selectedCity, selectedMonth, activeFilterTab, setSearchParams]);

const FESTIVAL_SEARCH_ALIASES: Record<string, string[]> = {
  holi: ['lathmar holi', 'braj holi', 'rangwali holi', 'dol jatra', 'barsana', 'gulal'],
  diwali: ['deepawali', 'deepavali', 'deepotsav', 'dev deepawali', 'karthigai deepam', 'kali puja'],
  deepawali: ['diwali', 'deepavali', 'deepotsav', 'dev deepawali'],
  deepavali: ['diwali', 'deepawali', 'deepotsav', 'dev deepawali'],
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

  // Base list filtered by search, state, city, month (independent of activeFilterTab)
  const baseFilteredFestivals = useMemo(() => {
    let list = festivals;

    if (searchQuery.trim()) {
      const rawQ = searchQuery.trim();
      const q = rawQ.toLowerCase();
      const aliasTerms = FESTIVAL_SEARCH_ALIASES[q] || [];
      const wordPattern = q.length <= 4
        ? new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        : new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');

      list = list.filter((item) => {
        const nameLower = item.name.toLowerCase();
        const idLower = item.id.toLowerCase();
        const slugLower = (item.slug || '').toLowerCase();

        // 1. Direct match on name, slug, id in either direction
        if (nameLower.includes(q) || idLower.includes(q) || slugLower.includes(q)) {
          return true;
        }
        if (q.includes(nameLower) || (slugLower && q.includes(slugLower)) || q.includes(idLower)) {
          return true;
        }

        // Multi-word festival name has all its main tokens in query (e.g. "Mysore Dasara kab hota hai...")
        const nameWords = nameLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2);
        if (nameWords.length >= 2 && nameWords.every((w) => q.includes(w))) {
          return true;
        }

        // 2. Direct match on primary city, state, alternate locations
        if (item.primary_city.toLowerCase().includes(q)) return true;
        if (item.state.toLowerCase().includes(q)) return true;
        if (item.alternate_locations && item.alternate_locations.some((loc) => loc.toLowerCase().includes(q))) return true;

        // 3. Cultural vibe match
        if (item.cultural_vibe && item.cultural_vibe.toLowerCase().includes(q)) return true;

        // 4. Aliases match (from item.aliases or FESTIVAL_SEARCH_ALIASES dictionary)
        if (Array.isArray(item.aliases)) {
          for (const a of item.aliases) {
            const aLower = a.toLowerCase();
            if (aLower.includes(q) || (aLower.length >= 4 && q.includes(aLower))) return true;
          }
        }
        for (const term of aliasTerms) {
          if (nameLower.includes(term) || idLower.includes(term)) return true;
          if (q.includes(term)) return true;
          if (Array.isArray(item.aliases) && item.aliases.some((a) => a.toLowerCase().includes(term))) return true;
        }

        // 5. Description word-boundary match (avoid substring false-positives like 'cholis' for 'holi')
        const isMajorTerm = ['holi', 'diwali', 'navratri', 'dasara', 'dussehra'].includes(q);
        if (!isMajorTerm && wordPattern.test(item.description)) {
          return true;
        }

        return false;
      });

      // Relevance ranking: exact name match and query token density first
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
      list = list.filter((f) => f.state.toLowerCase() === s || f.state_id?.toLowerCase() === s);
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

  // Tab counts and IDs
  const currentIds = useMemo(() => new Set(currentFestivals.map((f) => f.id)), [currentFestivals]);
  const upcomingIds = useMemo(() => new Set(upcomingFestivals.map((f) => f.id)), [upcomingFestivals]);

  const currentMatchingCount = useMemo(() => {
    return baseFilteredFestivals.filter((f) => currentIds.has(f.id)).length;
  }, [baseFilteredFestivals, currentIds]);

  const upcomingMatchingCount = useMemo(() => {
    return baseFilteredFestivals.filter((f) => upcomingIds.has(f.id)).length;
  }, [baseFilteredFestivals, upcomingIds]);

  // Filtered festival list respecting active tab
  const filteredFestivals = useMemo(() => {
    if (activeFilterTab === 'current') {
      return baseFilteredFestivals.filter((f) => currentIds.has(f.id));
    }
    if (activeFilterTab === 'upcoming') {
      return baseFilteredFestivals.filter((f) => upcomingIds.has(f.id));
    }
    return baseFilteredFestivals;
  }, [baseFilteredFestivals, activeFilterTab, currentIds, upcomingIds]);

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
    navigate(`/ai?q=${encodeURIComponent(`Tell me about the ${festival.name} in ${festival.primary_city}, ${festival.state}. What are the key rituals, best places to see, and visitor advice?`)}`);
  };

  const handleExploreCity = (cityId?: string, cityName?: string) => {
    const target = cityId || (cityName ? cityName.toLowerCase().replace(/\s+/g, '-') : 'mumbai');
    navigate(`/city/${target}`);
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
              Reference Date: September 2026 • 28 States & 8 UTs Verified
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight mb-4">
            Festivals Across <span className="text-[#FF9933] italic">India</span>
          </h1>
          <p className="text-base sm:text-lg text-[#EFE8DF]/90 max-w-3xl leading-relaxed mb-8">
            Experience India's soul through its grand chariot processions, sacred ghat illuminations, tribal music valleys, and vibrant seasonal harvest traditions across every state and union territory.
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
                placeholder="Search Holi, Diwali, Durga Puja, Navratri, Hornbill, Bihu..."
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
                Current & Upcoming Celebrations
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
                Upcoming Autumn & Winter ({upcomingMatchingCount})
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
                    <img
                      src={fest.image_url}
                      alt={fest.name}
                      className="w-20 h-20 rounded-lg object-cover shrink-0 border border-neutral-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {fest.state}
                        </span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {fest.primary_city}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-neutral-900 text-base truncate">
                        {fest.name}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-1 mb-2">
                        {fest.cultural_vibe || fest.description}
                      </p>
                      <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {fest.exact_date_start} to {fest.exact_date_end}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#EFE8DF]">
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
                <option value="All">All India (All States & UTs)</option>
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="text-sm font-semibold text-neutral-700">
            {searchQuery.trim() || selectedState !== 'All' || selectedCity !== 'All' || selectedMonth !== 'All' ? (
              <span>
                Found <span className="text-[#E06D24] font-bold">{filteredFestivals.length}</span> matching {filteredFestivals.length === 1 ? 'festival' : 'festivals'} (of {festivals.length} across India)
                {searchQuery.trim() && (
                  <span className="text-neutral-500 font-normal"> for &ldquo;<span className="text-neutral-900 font-semibold">{searchQuery}</span>&rdquo;</span>
                )}
              </span>
            ) : (
              <span>
                Showing <span className="text-[#E06D24] font-bold">{filteredFestivals.length}</span> structured festival records across India
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
                setVisibleCount(12);
              }}
              className="text-xs font-semibold text-[#E06D24] hover:underline flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters & Show All {festivals.length}
            </button>
          )}
        </div>

        {/* Festival Cards Grid / Loading / Error State */}
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
              We encountered an issue communicating with the Virasat Cultural Registry. Please verify your connection or click retry below.
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
              We couldn't find any festival matching your current search or filter combination. Try clearing filters to see all {festivals.length} flagship Indian celebrations.
            </p>
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCity('All');
                setSelectedMonth('All');
                setSearchQuery('');
                setActiveFilterTab('all');
                setVisibleCount(12);
              }}
              className="px-6 py-2.5 bg-[#E06D24] hover:bg-[#D45B10] text-white font-semibold text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters & Show All {festivals.length} Celebrations
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFestivals.slice(0, visibleCount).map((fest) => {
                const isVerifiedDate = fest.is_date_verified && fest.exact_date_start;
                return (
                  <article
                    key={fest.id}
                    onClick={() => setSelectedFestival(fest)}
                    className="bg-white rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer h-full"
                  >
                    {/* Festival Image & Badges */}
                    <div className="relative h-48 sm:h-52 shrink-0 overflow-hidden bg-neutral-100">
                      <img
                        src={fest.image_url}
                        alt={fest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b2?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                          {fest.state}
                        </span>

                        {isVerifiedDate ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                            <ShieldCheck className="w-3 h-3" /> Verified Date
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
                            <Clock className="w-3 h-3" /> Expected Season
                          </span>
                        )}
                      </div>

                      {/* Bottom overlay title info */}
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
                    </div>

                    {/* Body Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Cultural Vibe pill */}
                        {fest.cultural_vibe && (
                          <div className="inline-block px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200/60 text-[#D45B10] text-xs font-semibold mb-3">
                            {fest.cultural_vibe}
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 mb-4 leading-relaxed">
                          {fest.description}
                        </p>

                        {/* Date Indicator (Date Aware) */}
                        <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#EFE8DF] mb-4 text-xs">
                          <div className="font-semibold text-neutral-800 flex items-center gap-1.5 mb-0.5">
                            <Calendar className="w-3.5 h-3.5 text-[#E06D24] shrink-0" />
                            {isVerifiedDate ? (
                              <span>
                                {fest.exact_date_start} — {fest.exact_date_end}
                              </span>
                            ) : (
                              <span>Typical Period: {fest.typical_season}</span>
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
                          View Full Details <ChevronRight className="w-3.5 h-3.5" />
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
              })}
            </div>

            {/* Pagination / Load More Control */}
            {visibleCount < filteredFestivals.length && (
              <div className="mt-12 flex flex-col items-center justify-center gap-3">
                <div className="text-xs font-semibold text-neutral-500">
                  Showing {Math.min(visibleCount, filteredFestivals.length)} of {filteredFestivals.length} festivals across India
                </div>
                <div className="w-full max-w-xs bg-[#EFE8DF] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#E06D24] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.round((Math.min(visibleCount, filteredFestivals.length) / filteredFestivals.length) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    id="load-more-festivals-btn"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-6 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold rounded-xl border border-[#EFE8DF] shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    Load More Celebrations
                    <span className="text-xs text-[#E06D24] bg-orange-50 px-2 py-0.5 rounded-full font-bold">
                      +{Math.min(12, filteredFestivals.length - visibleCount)}
                    </span>
                  </button>
                  <button
                    onClick={() => setVisibleCount(filteredFestivals.length)}
                    className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-[#E06D24] transition-colors"
                  >
                    Show All ({filteredFestivals.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Festival Detail Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFE8DF] flex flex-col">
            {/* Modal Header Media */}
            <div className="relative h-64 sm:h-72 shrink-0 bg-neutral-900">
              <img
                src={selectedFestival.image_url}
                alt={selectedFestival.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b2?w=1200&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <button
                onClick={() => setSelectedFestival(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-1 text-xs text-amber-300 font-semibold uppercase">
                  <span>{selectedFestival.state}</span>
                  <span>•</span>
                  <span>{selectedFestival.primary_city}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {selectedFestival.name}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 flex-1 space-y-6">
              {/* Cultural Vibe & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                  <div className="text-xs text-neutral-500 font-medium mb-1">Cultural Essence</div>
                  <div className="text-sm font-semibold text-neutral-900">
                    {selectedFestival.cultural_vibe || 'Traditional celebration'}
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                  <div className="text-xs text-neutral-500 font-medium mb-1">
                    {selectedFestival.is_date_verified ? 'Verified Dates' : 'Typical Season'}
                  </div>
                  <div className="text-sm font-semibold text-neutral-900">
                    {selectedFestival.is_date_verified && selectedFestival.exact_date_start
                      ? `${selectedFestival.exact_date_start} to ${selectedFestival.exact_date_end}`
                      : selectedFestival.typical_season}
                  </div>
                </div>
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

              {/* Alternate Locations */}
              {selectedFestival.alternate_locations && selectedFestival.alternate_locations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Also Celebrated Across
                  </h4>
                  <p className="text-xs text-neutral-700">
                    {selectedFestival.alternate_locations.join(', ')}
                  </p>
                </div>
              )}

              {/* Verified Image Attribution & License */}
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

              {/* Modal Direct Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#EFE8DF]">
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
        </div>
      )}
    </div>
  );
};
