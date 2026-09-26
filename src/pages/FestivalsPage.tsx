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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [festivalsRes, currentUpcomingRes, statesRes, citiesRes] = await Promise.allSettled([
          api.getFestivals({ limit: 100 }),
          api.getCurrentUpcomingFestivals('2026-09-26'),
          api.getStates(),
          api.getCities(),
        ]);

        if (festivalsRes.status === 'fulfilled' && festivalsRes.value) {
          setFestivals(festivalsRes.value);
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
      } catch (err) {
        console.error('Failed to load festivals data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update query params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedState !== 'All') params.state = selectedState;
    if (selectedCity !== 'All') params.city = selectedCity;
    if (selectedMonth !== 'All') params.month = selectedMonth;
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedState, selectedCity, selectedMonth, setSearchParams]);

  // Filtered festival list
  const filteredFestivals = useMemo(() => {
    let list = festivals;

    if (activeFilterTab === 'current') {
      const currentIds = new Set(currentFestivals.map((f) => f.id));
      list = list.filter((f) => currentIds.has(f.id));
    } else if (activeFilterTab === 'upcoming') {
      const upcomingIds = new Set(upcomingFestivals.map((f) => f.id));
      list = list.filter((f) => upcomingIds.has(f.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.state.toLowerCase().includes(q) ||
          f.primary_city.toLowerCase().includes(q) ||
          (f.cultural_vibe && f.cultural_vibe.toLowerCase().includes(q))
      );
    }

    if (selectedState !== 'All') {
      const s = selectedState.toLowerCase();
      list = list.filter((f) => f.state.toLowerCase() === s || f.state_id?.toLowerCase() === s);
    }

    if (selectedCity !== 'All') {
      const c = selectedCity.toLowerCase();
      list = list.filter((f) => f.primary_city.toLowerCase().includes(c) || f.primary_city_id?.toLowerCase() === c);
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
  }, [festivals, activeFilterTab, currentFestivals, upcomingFestivals, searchQuery, selectedState, selectedCity, selectedMonth]);

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
            Festivals of <span className="text-[#FF9933] italic">Virasat</span>
          </h1>
          <p className="text-base sm:text-lg text-[#EFE8DF]/90 max-w-3xl leading-relaxed mb-8">
            Experience India's soul through its grand chariot processions, sacred ghat illuminations, tribal music valleys, and vibrant seasonal harvest traditions across every state and union territory.
          </p>

          {/* Quick Search Bar */}
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-xl max-w-3xl flex flex-col sm:flex-row items-center gap-2 border border-white/20">
            <div className="flex items-center gap-3 px-3 flex-1 w-full text-neutral-800">
              <Search className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                id="festival-search-input"
                type="text"
                placeholder="Search Ganeshotsav, Durga Puja, Pushkar Fair, Hornbill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-neutral-900 placeholder-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {}}
              className="w-full sm:w-auto px-6 py-3 bg-[#E06D24] hover:bg-[#D45B10] text-white text-sm font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter Events
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Current & Upcoming Section Highlight */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#EFE8DF] mb-10">
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
                All ({festivals.length})
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
                Live Now ({currentFestivals.length})
              </button>
              <button
                onClick={() => setActiveFilterTab('upcoming')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilterTab === 'upcoming'
                    ? 'bg-[#E06D24] text-white shadow-sm'
                    : 'text-[#E06D24] hover:text-orange-700'
                }`}
              >
                Upcoming Autumn & Winter ({upcomingFestivals.length})
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
                <option value="All">All States & Territories</option>
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
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="text-sm font-semibold text-neutral-700">
            Showing <span className="text-[#E06D24] font-bold">{filteredFestivals.length}</span> structured festival records
          </div>
          {(selectedState !== 'All' || selectedCity !== 'All' || selectedMonth !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCity('All');
                setSelectedMonth('All');
                setSearchQuery('');
                setActiveFilterTab('all');
              }}
              className="text-xs font-semibold text-[#E06D24] hover:underline flex items-center gap-1"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Festival Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-[#EFE8DF]" />
            ))}
          </div>
        ) : filteredFestivals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EFE8DF] max-w-xl mx-auto my-12">
            <Sparkles className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-neutral-800 mb-2">
              No matching festivals found
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              We couldn't find any festival matching your current search or filter combination. Try clearing filters to see all 63 flagship Indian celebrations.
            </p>
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCity('All');
                setSelectedMonth('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#E06D24] text-white font-semibold text-sm rounded-xl shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFestivals.map((fest) => {
              const isVerifiedDate = fest.is_date_verified && fest.exact_date_start;
              return (
                <article
                  key={fest.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Festival Image & Badges */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-neutral-100">
                    <img
                      src={fest.image_url}
                      alt={fest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
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
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {fest.primary_city}
                        {fest.alternate_locations && fest.alternate_locations.length > 0 && (
                          <span className="text-white/70"> &amp; more</span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-white drop-shadow-sm">
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
                          <Calendar className="w-3.5 h-3.5 text-[#E06D24]" />
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
                    <div className="pt-2 border-t border-[#EFE8DF] flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedFestival(fest)}
                        className="px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:text-[#E06D24] transition-colors"
                      >
                        View Full Details
                      </button>

                      <div className="flex items-center gap-1.5">
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
