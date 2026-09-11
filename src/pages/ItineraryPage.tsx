import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  IndianRupee,
  Sparkles,
  MapPin,
  Check,
  Loader2,
  Share2,
  Download,
  Map as MapIcon,
  ShoppingBag,
  Leaf,
  ShieldCheck,
  HeartHandshake,
  Luggage,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  Bookmark,
  Navigation,
  Maximize2,
  Minimize2,
  BookOpen,
  LayoutGrid,
  Sun,
  Sunset,
  Utensils,
  Camera,
  Ticket,
  Printer,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse, ItineraryDay } from '../types';
import { NavTab } from '../components/layout/Sidebar';
import { ALL_INDIAN_TOURISM_CITIES, CityOption } from '../data/cityItineraryData';
import { IncredibleIndiaVideoGallery } from '../components/itinerary/IncredibleIndiaVideoGallery';
import { ItineraryCostDonutChart } from '../components/itinerary/ItineraryCostDonutChart';

interface ItineraryPageProps {
  onSelectPlace: (id: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  selectedCity: string;
}

interface PreferencePill {
  id: string;
  label: string;
  icon: string;
}

const PREFERENCE_PILLS: PreferencePill[] = [
  { id: 'heritage', label: 'Heritage & Monuments', icon: '🏛️' },
  { id: 'beaches_nature', label: 'Beaches & Nature', icon: '🌴' },
  { id: 'food_markets', label: 'Food & Local Markets', icon: '🍲' },
  { id: 'museums_arts', label: 'Museums & Arts', icon: '🎨' },
  { id: 'spiritual', label: 'Spiritual & Temples', icon: '🪷' },
  { id: 'family', label: 'Family Friendly', icon: '👨‍👩‍👧‍👦' },
];

export const ItineraryPage: React.FC<ItineraryPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  selectedCity = 'Mumbai',
}) => {
  // Destination state
  const [selectedCityObj, setSelectedCityObj] = useState<CityOption>(() => {
    const found = ALL_INDIAN_TOURISM_CITIES.find(
      (c) => c.name.toLowerCase() === selectedCity.toLowerCase() || c.id.toLowerCase() === selectedCity.toLowerCase()
    );
    return found || ALL_INDIAN_TOURISM_CITIES[0]; // Default to Mumbai
  });

  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Form selections
  const [daysCount, setDaysCount] = useState<number>(5);
  const [pace, setPace] = useState<'relaxed' | 'moderate' | 'fast'>('moderate');
  const [budget, setBudget] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'heritage',
    'beaches_nature',
  ]);

  // View presentation state (Pages vs Grid, Full-Width expander)
  const [isFullWidthPlanner, setIsFullWidthPlanner] = useState<boolean>(true);
  const [plannerViewMode, setPlannerViewMode] = useState<'pages' | 'grid'>('pages');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [selectedModalDay, setSelectedModalDay] = useState<ItineraryDay | null>(null);

  // Plan generation state
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSelectCarouselDestination = (cityId: string, cityName: string) => {
    const targetCityLower = cityName.toLowerCase();
    const targetIdLower = cityId.toLowerCase();
    const foundCity = ALL_INDIAN_TOURISM_CITIES.find(
      (c) =>
        c.id.toLowerCase() === targetIdLower ||
        c.name.toLowerCase() === targetCityLower ||
        targetCityLower.includes(c.name.toLowerCase()) ||
        c.name.toLowerCase().includes(targetCityLower)
    );

    if (foundCity) {
      setSelectedCityObj(foundCity);
      handleGeneratePlan(foundCity.name, daysCount);
    } else {
      handleGeneratePlan(cityName, daysCount);
    }

    setTimeout(() => {
      const plannerSection = document.getElementById('trip-planner-form');
      if (plannerSection) {
        plannerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // Filter cities for search
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) {
      return ALL_INDIAN_TOURISM_CITIES;
    }
    const q = citySearchQuery.toLowerCase();
    return ALL_INDIAN_TOURISM_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.displayName.toLowerCase().includes(q)
    );
  }, [citySearchQuery]);

  // Close city dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initial load: Generate initial plan
  useEffect(() => {
    handleGeneratePlan(selectedCityObj.name, daysCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTogglePreference = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectCity = (c: CityOption) => {
    setSelectedCityObj(c);
    setCitySearchQuery('');
    setIsCityDropdownOpen(false);
  };

  const handleGeneratePlan = async (targetCityName?: string, targetDays?: number) => {
    const cityToQuery = targetCityName || selectedCityObj.name;
    const daysToQuery = targetDays || daysCount;

    setLoading(true);
    setSaveSuccess(false);
    setShareSuccess(false);
    setActiveDayIndex(0);

    try {
      const plan = await api.generateItinerary({
        city: cityToQuery,
        days: daysToQuery,
        days_count: daysToQuery,
        duration_hours: daysToQuery * 8,
        pace,
        budget_level: budget,
        interests: selectedPreferences,
      });
      setItinerary(plan);
    } catch (err) {
      console.error('Failed to generate city trip itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!itinerary) return;
    try {
      const stopsList = itinerary.stops || itinerary.timeline || [];
      await api.saveItinerary({
        title: itinerary.title || `${selectedCityObj.name} ${daysCount}-Day Tour`,
        destination: selectedCityObj.name,
        city: itinerary.city || selectedCityObj.name,
        state: selectedCityObj.state,
        days_count: daysCount,
        pace,
        budget_level: budget,
        summary: itinerary.summary,
        total_cost: itinerary.estimated_total_cost || 3500,
        is_public: true,
        days: itinerary.days?.map((d: any, dIdx: number) => ({
          day_number: d.day_number || dIdx + 1,
          area_title: d.area_title || `Day ${dIdx + 1}`,
          theme: d.theme,
          notes: d.description,
          stops: (d.places || []).map((p: any, pIdx: number) => ({
            place_id: p.id || p.place_id,
            place_name: p.name,
            stop_order: pIdx + 1,
            duration_minutes: p.recommended_duration_minutes || 75,
            travel_mode: p.travel_mode_from_previous || 'Auto-Rickshaw / Local Transit',
            travel_duration_minutes: p.travel_time_from_previous_minutes || 20,
            travel_distance_km: p.distance_from_previous_km || 2.5,
            estimated_cost: p.estimated_cost || 60,
          })),
        })),
      });

      await api.saveTrip({
        title: itinerary.title || `${selectedCityObj.name} ${daysCount}-Day Tour`,
        city: itinerary.city || selectedCityObj.name,
        duration_hours: daysCount * 8,
        estimated_cost: itinerary.estimated_total_cost || 3500,
        stops: stopsList.map((item, idx) => ({
          place_id: item.place_id,
          place_name: item.name || item.place_name || `Stop ${idx + 1}`,
          order: idx + 1,
          visit_minutes: item.recommended_duration_minutes || 60,
        })),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save trip:', err);
    }
  };

  const handleSharePlan = () => {
    if (!itinerary) return;
    const url = window.location.href;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`${itinerary.title} - Planned with VIRASAT: ${url}`)
        .then(() => {
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
        })
        .catch(() => {});
    }
  };

  const handleDownloadPlan = () => {
    if (!itinerary) return;
    const content = [
      `=============================================================`,
      `VIRASAT SMART TRIP PLANNER & HERITAGE CIRCUIT`,
      `${itinerary.title || `${selectedCityObj.name} ${daysCount}-Day Itinerary`}`,
      `City: ${selectedCityObj.name}, ${selectedCityObj.state}`,
      `Duration: ${daysCount} Days`,
      `Pace: ${pace.toUpperCase()} | Budget: ${budget.toUpperCase()}`,
      `=============================================================`,
      ``,
      `${itinerary.summary || ''}`,
      ``,
      ...(itinerary.days || []).map((d) => [
        `-------------------------------------------------------------`,
        `DAY ${d.day_number}: ${d.area_title.toUpperCase()}`,
        `${d.subtitle || ''}`,
        `-------------------------------------------------------------`,
        `SCHEDULED ATTRACTIONS:`,
        ...d.places.map((p, i) => `  ${i + 1}. ${p.name} (${p.distance_info || 'Local stop'})`),
        ``,
        `RECOMMENDED LOCAL SHOPPING & MARKETS:`,
        ...d.shopping.map((s) => `  • ${s}`),
        ``,
      ].join('\n')),
      `=============================================================`,
      `Verified Heritage Data - Government of India Tourism Standards`,
      `VIRASAT | Smart Tourism for Bharat`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCityObj.name.toLowerCase().replace(/\s+/g, '_')}_${daysCount}_days_itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentDay = itinerary?.days?.[activeDayIndex] || itinerary?.days?.[0];

  return (
    <div
      className={`space-y-8 py-2 sm:py-4 animate-fadeIn text-stone-800 pb-16 transition-all duration-300 ${
        isFullWidthPlanner ? 'w-full max-w-none' : 'w-full max-w-7xl mx-auto'
      }`}
    >
      {/* 1. TOP BAR: TITLE, DESTINATION SELECTOR & FULL-WIDTH TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/90">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-[#FF671F] border border-orange-200 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Smart Heritage Planner & Circuits</span>
          </div>

          <span className="hidden sm:inline text-stone-400">•</span>
          <span className="text-stone-500 hidden sm:inline">
            Government of India & ASI Tariffs Aligned
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Full-width expander button */}
          <button
            onClick={() => setIsFullWidthPlanner((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
            title={isFullWidthPlanner ? 'Compact Layout' : 'Expand Full Width'}
          >
            {isFullWidthPlanner ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#FF671F]" />
                <span className="hidden md:inline">Standard Width</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#FF671F]" />
                <span className="hidden md:inline">Expand Full Width</span>
              </>
            )}
          </button>

          {/* Selected Destination Pill / Quick Switch */}
          <div className="relative" ref={cityDropdownRef}>
            <button
              onClick={() => setIsCityDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 shadow-xs text-xs text-stone-700 transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF671F] shrink-0" />
              <div className="text-left">
                <div className="font-bold text-stone-900 leading-tight">
                  {selectedCityObj.name}
                </div>
                <div className="text-[10px] text-stone-500 leading-tight">
                  {selectedCityObj.state}, India
                </div>
              </div>
              <span className="text-[11px] text-[#FF671F] font-semibold ml-1">
                Change ▾
              </span>
            </button>

            {/* Quick city dropdown */}
            {isCityDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 max-h-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-stone-100 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Indian cities..."
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="w-full text-xs bg-transparent focus:outline-hidden text-stone-800 placeholder-stone-400"
                    autoFocus
                  />
                  {citySearchQuery && (
                    <button onClick={() => setCitySearchQuery('')} className="text-stone-400 hover:text-stone-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto flex-1 divide-y divide-stone-50">
                  {filteredCities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCity(c)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50/70 rounded-lg transition ${
                        selectedCityObj.id === c.id ? 'bg-orange-50 text-[#0B192C] font-bold' : 'text-stone-700'
                      }`}
                    >
                      <div>
                        <div>{c.name}</div>
                        <div className="text-[10px] text-stone-400">{c.state}</div>
                      </div>
                      {c.popular && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-[#FF671F] font-medium">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. EXPANDED LIVING HERITAGE SHOWCASE GALLERY */}
      <IncredibleIndiaVideoGallery
        onSelectDestination={handleSelectCarouselDestination}
        selectedCityId={selectedCityObj.id}
      />

      {/* 3. INPUT CARD: DESTINATION, DAYS, PACE, BUDGET & PREFERENCES */}
      <div id="trip-planner-form" className="rounded-3xl bg-white border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-6 scroll-mt-6">
        {/* Row 1: 4 Selectors + Plan Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Destination Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Destination / City</span>
            </label>
            <select
              value={selectedCityObj.id}
              onChange={(e) => {
                const found = ALL_INDIAN_TOURISM_CITIES.find((c) => c.id === e.target.value);
                if (found) setSelectedCityObj(found);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition cursor-pointer"
            >
              <optgroup label="Major Popular Hubs">
                {ALL_INDIAN_TOURISM_CITIES.filter((c) => c.popular).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All Indian States & UTs">
                {ALL_INDIAN_TOURISM_CITIES.filter((c) => !c.popular).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.displayName}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Number of Days */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Number of Days</span>
            </label>
            <select
              value={daysCount}
              onChange={(e) => setDaysCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition cursor-pointer"
            >
              <option value={1}>1 Day (Express Tour)</option>
              <option value={2}>2 Days (Weekend Getaway)</option>
              <option value={3}>3 Days (Long Weekend)</option>
              <option value={4}>4 Days (Deep Immersion)</option>
              <option value={5}>5 Days (Complete Circuit)</option>
              <option value={6}>6 Days (Extended Heritage)</option>
              <option value={7}>7 Days (Grand Bharat Journey)</option>
            </select>
          </div>

          {/* Travel Pace */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Travel Pace</span>
            </label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition cursor-pointer"
            >
              <option value="relaxed">Relaxed (1-2 major stops/day)</option>
              <option value="moderate">Moderate (3-4 balanced stops/day)</option>
              <option value="fast">Fast-paced (5+ stops & highlights)</option>
            </select>
          </div>

          {/* Budget Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Budget Range</span>
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:bg-white focus:outline-hidden focus:border-[#FF671F] focus:ring-2 focus:ring-[#FF671F]/20 transition cursor-pointer"
            >
              <option value="budget">₹ Budget (Hostels & Local transit)</option>
              <option value="moderate">₹₹ Mid-range (Boutique & Cabs)</option>
              <option value="luxury">₹₹₹ Luxury (Palaces & Chauffeur)</option>
            </select>
          </div>

          {/* Plan My Trip Button */}
          <div>
            <button
              onClick={() => handleGeneratePlan()}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Route...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Trip Preferences Pills */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="text-xs font-bold text-stone-700">
            Trip Preferences (Optional)
          </div>
          <div className="flex flex-wrap gap-2.5">
            {PREFERENCE_PILLS.map((pref) => {
              const isSelected = selectedPreferences.includes(pref.id);
              return (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => handleTogglePreference(pref.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-100 text-[#0B192C] border border-orange-200 shadow-xs'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span>{pref.icon}</span>
                  <span>{pref.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. ITINERARY RESULTS SECTION */}
      {itinerary && (
        <div className="space-y-6 animate-fadeIn">
          {/* Section Header with Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#FF671F] font-bold tracking-wider uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>{itinerary.city || selectedCityObj.name} Cultural Immersion</span>
                <span>•</span>
                <span>{itinerary.days_count || daysCount} Days Optimized Route</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                {itinerary.title || `${selectedCityObj.name} Complete Heritage Journey`}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
                {itinerary.summary ||
                  'A balanced mix of UNESCO monuments, cultural landmarks, authentic regional cuisine and artisan markets.'}
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                onClick={() => onNavigateTab('map')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5 text-stone-600" />
                <span>Map Route</span>
              </button>

              <button
                onClick={handleDownloadPlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Export TXT</span>
              </button>

              <button
                onClick={handleSharePlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                {shareSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-stone-600" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSavePlan}
                disabled={saveSuccess}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Saved to My Trips!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-white" />
                    <span>Save Trip</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* D3-BASED ESTIMATED COST BREAKDOWN DONUT CHART */}
          <ItineraryCostDonutChart
            itinerary={itinerary}
            selectedCityName={selectedCityObj.name}
            initialBudgetTier={budget}
            daysCount={daysCount}
          />

          {/* 5. EXPANDED PAGES & DAY DOSSIER SECTION */}
          <div className="space-y-4">
            {/* View Format Selector & Day Page Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-stone-200 shadow-xs">
              {/* Day Pages Tab List */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setPlannerViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer ${
                    plannerViewMode === 'grid'
                      ? 'bg-[#FF671F] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All Days Grid</span>
                </button>

                {(itinerary.days || []).map((d: ItineraryDay, idx: number) => (
                  <button
                    key={d.day_number}
                    onClick={() => {
                      setPlannerViewMode('pages');
                      setActiveDayIndex(idx);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer ${
                      plannerViewMode === 'pages' && activeDayIndex === idx
                        ? 'bg-[#FF671F] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Day {d.day_number}: {d.area_title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Quick Navigation Controls */}
              {plannerViewMode === 'pages' && (
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
                  <button
                    disabled={activeDayIndex <= 0}
                    onClick={() => setActiveDayIndex((prev) => Math.max(0, prev - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 disabled:opacity-30 cursor-pointer text-stone-700 font-semibold"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Day</span>
                  </button>

                  <span className="font-mono text-stone-500 font-bold px-1">
                    {activeDayIndex + 1} / {itinerary.days?.length || daysCount}
                  </span>

                  <button
                    disabled={activeDayIndex >= (itinerary.days?.length || daysCount) - 1}
                    onClick={() =>
                      setActiveDayIndex((prev) =>
                        Math.min((itinerary.days?.length || daysCount) - 1, prev + 1)
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 disabled:opacity-30 cursor-pointer text-stone-700 font-semibold"
                  >
                    <span>Next Day</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* OPTION A: EXPANDED SINGLE-DAY PAGE VIEW */}
            {plannerViewMode === 'pages' && currentDay && (
              <div className="rounded-3xl bg-white border border-stone-200 shadow-md overflow-hidden animate-fadeIn">
                {/* Hero Banner for Day Page */}
                <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-stone-100 border-b border-stone-200">
                  <img
                    src={
                      currentDay.hero_image_url ||
                      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=80'
                    }
                    alt={currentDay.area_title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/25" />

                  <div className="absolute bottom-5 inset-x-6 sm:inset-x-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-stone-900">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-[#FF671F] text-white font-bold text-xs shadow-xs">
                          Day {currentDay.day_number} Dossier Page
                        </span>
                        <span className="text-xs text-stone-600 font-mono font-semibold">
                          {currentDay.places.length} Verified Stops
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                        {currentDay.area_title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-700 max-w-2xl font-medium">
                        {currentDay.subtitle || 'Immersive cultural journey and architectural highlights.'}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedModalDay(currentDay)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-end"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#FF671F]" />
                      <span>Print / Expand Sheet</span>
                    </button>
                  </div>
                </div>

                {/* Day Content Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Detailed Hourly Schedule Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#FF671F]" />
                        <span>Curated Day Timeline & Heritage Stops</span>
                      </h4>
                      <span className="text-xs text-stone-500">
                        Click any place to inspect full monument details
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentDay.places.map((place, pIdx) => {
                        // Assign contextual time period based on index
                        const timeSlots = [
                          { label: 'Morning (08:30 - 11:30)', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
                          { label: 'Midday (12:00 - 14:00)', icon: <Utensils className="w-3.5 h-3.5 text-emerald-500" /> },
                          { label: 'Afternoon (14:30 - 17:00)', icon: <Compass className="w-3.5 h-3.5 text-blue-500" /> },
                          { label: 'Sunset & Evening (17:30 - 20:00)', icon: <Sunset className="w-3.5 h-3.5 text-orange-500" /> },
                        ];
                        const slot = timeSlots[pIdx % timeSlots.length];

                        return (
                          <div
                            key={pIdx}
                            onClick={() => place.id && onSelectPlace(place.id)}
                            className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:shadow-md hover:border-[#FF671F]/50 transition cursor-pointer flex flex-col justify-between group"
                          >
                            <div className="space-y-2">
                              {/* Slot Badge */}
                              <div className="flex items-center justify-between text-[11px] font-semibold">
                                <div className="flex items-center gap-1.5 text-stone-600">
                                  {slot.icon}
                                  <span>{slot.label}</span>
                                </div>
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center justify-center">
                                  {pIdx + 1}
                                </span>
                              </div>

                              {/* Stop Name */}
                              <h5 className="font-bold text-stone-900 text-sm group-hover:text-[#FF671F] transition leading-snug">
                                {place.name}
                              </h5>

                              <div className="text-[11px] text-stone-500 space-y-1">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#FF671F]" />
                                  <span>Transit: {place.distance_info || 'Nearby local stop'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Ticket className="w-3 h-3 text-emerald-600" />
                                  <span>ASI Official Pass / Free Entry</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 mt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-semibold text-[#FF671F]">
                              <span>View monument guide</span>
                              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Two-Column Footer: Nearby Shopping & Practical Transit Advice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Nearby Shopping & Crafts Box */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <ShoppingBag className="w-4 h-4 text-[#FF671F]" />
                        <span>Recommended Day Shopping & Artisan Markets</span>
                      </div>
                      <div className="text-xs text-stone-700 space-y-1 pl-2">
                        {currentDay.shopping.map((shop, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-[#FF671F]">•</span>
                            <span>{shop}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transit & Living Tip Box */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        <span>Day {currentDay.day_number} Transit & Local Guidance</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed pl-2">
                        Pre-book your tickets through official government portals. For inter-monument transit, local metered auto-rickshaws and metro corridors are the quickest way to beat peak traffic.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OPTION B: ALL DAYS MULTI-COLUMN GRID VIEW */}
            {plannerViewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 animate-fadeIn">
                {(itinerary.days || []).map((day: ItineraryDay, idx: number) => (
                  <div
                    key={day.day_number}
                    className="rounded-2xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Top Day Header */}
                      <div className="p-4 space-y-2 border-b border-stone-100">
                        <div className="flex items-center justify-between">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-[#0B192C] text-[11px] font-bold">
                            Day {day.day_number}
                          </span>
                          <button
                            onClick={() => {
                              setPlannerViewMode('pages');
                              setActiveDayIndex(idx);
                            }}
                            className="text-[10px] text-[#FF671F] font-bold hover:underline cursor-pointer"
                          >
                            Expand Page →
                          </button>
                        </div>
                        <h3 className="font-serif font-bold text-stone-900 text-sm leading-snug group-hover:text-[#FF671F] transition">
                          {day.area_title}
                        </h3>
                        <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                          {day.subtitle}
                        </p>
                      </div>

                      {/* Thumbnail Image */}
                      <div className="px-4 pt-3">
                        <div className="h-28 w-full rounded-xl overflow-hidden bg-stone-100 relative">
                          <img
                            src={
                              day.hero_image_url ||
                              'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80'
                            }
                            alt={day.area_title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* List of Ordered Places */}
                      <div className="p-4 space-y-2.5">
                        {day.places.map((place, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => place.id && onSelectPlace(place.id)}
                            className="flex items-start gap-2 text-xs cursor-pointer group/place"
                          >
                            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                              {pIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold text-stone-800 group-hover/place:text-[#FF671F] transition leading-tight truncate">
                                {place.name}
                              </div>
                              <div className="text-[10px] text-stone-400 mt-0.5">
                                {place.distance_info || 'Local stop'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nearby Shopping Box */}
                    <div className="p-3 m-3 mt-0 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-800">
                        <div className="flex items-center gap-1 text-stone-700">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#FF671F]" />
                          <span>Nearby Shopping</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                      <div className="text-[11px] text-stone-600 space-y-0.5 pl-3">
                        {day.shopping.slice(0, 2).map((shop, sIdx) => (
                          <div key={sIdx} className="leading-snug truncate">
                            • {shop}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 6. TRAVEL RESPONSIBLY GREEN BANNER */}
          <div className="rounded-3xl bg-emerald-50/80 border border-emerald-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-emerald-950">
                  Travel Responsibly & Honor India's Living Heritage
                </h4>
                <p className="text-xs text-emerald-800 max-w-2xl leading-relaxed">
                  Support traditional craft artisans, refrain from littering at ancient monuments, respect sacred dress codes, and minimize single-use plastics during your journey.
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold text-emerald-900/80 italic text-right self-end sm:self-center">
              "A smarter journey. A greener tomorrow."
            </div>
          </div>

          {/* 7. BOTTOM 4 VALUE PROPOSITION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-200">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF671F] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Verified Information</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  From official ASI tariffs & Ministry of Tourism databases
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Nearby Routing</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Smart geographical grouping to minimize commute times
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-800 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Local Immersion</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Artisan bazaars, heritage eateries & cultural experiences
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Luggage className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Customized Pace</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Adaptive day itineraries matching budget & traveler preferences
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. EXPANDED DAY MODAL SHEET */}
      {selectedModalDay && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#FF671F] text-white text-xs font-bold">
                  Day {selectedModalDay.day_number}
                </span>
                <h3 className="font-serif font-bold text-stone-900 text-lg">
                  {selectedModalDay.area_title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedModalDay(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Scheduled Monuments & Stops
              </h4>
              <div className="space-y-2">
                {selectedModalDay.places.map((place, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (place.id) onSelectPlace(place.id);
                      setSelectedModalDay(null);
                    }}
                    className="p-3 rounded-xl border border-stone-200 hover:border-[#FF671F] hover:bg-orange-50/50 cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-stone-900 text-xs sm:text-sm">
                          {place.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {place.distance_info || 'Local stop'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-[#FF671F] font-semibold">Inspect →</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>Nearby Shopping & Artisan Markets</span>
              </h4>
              <div className="text-xs text-stone-700 space-y-1">
                {selectedModalDay.shopping.map((shop, sIdx) => (
                  <div key={sIdx} className="leading-snug">
                    • {shop}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedModalDay(null)}
                className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
