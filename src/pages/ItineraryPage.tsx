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
  Compass,
  HeartHandshake,
  Luggage,
  ChevronRight,
  Search,
  X,
  Bookmark,
  CheckCircle2,
  Navigation,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { ItineraryResponse, ItineraryDay } from '../types';
import { NavTab } from '../components/layout/Sidebar';
import { ALL_INDIAN_TOURISM_CITIES, CityOption } from '../data/cityItineraryData';

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

  // Plan generation state
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

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

  // Initial load: Generate Mumbai 5 Days (or chosen city) on mount
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
        .catch(() => {
          // Safe ignore if clipboard permission denied
        });
    }
  };

  const handleDownloadPlan = () => {
    if (!itinerary) return;
    const content = [
      `=============================================================`,
      `VIRASAT AI CITY TRIP PLANNER`,
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
        `PLACES & ATTRACTIONS:`,
        ...d.places.map((p, i) => `  ${i + 1}. ${p.name} (${p.distance_info})`),
        ``,
        `NEARBY SHOPPING & MARKETS:`,
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

  return (
    <div className="space-y-8 w-full py-2 sm:py-4 animate-fadeIn text-stone-800 pb-12">
      {/* 1. TOP BAR: PLAN YOUR JOURNEY */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-[#FF671F] border border-orange-200 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Smart Day Planner & Circuits</span>
          </div>
        </div>

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

      {/* 2. HERO BANNER: PLAN YOUR TRIP */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-50/70 via-white to-emerald-50/40 border border-stone-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs overflow-hidden relative">
        <div className="space-y-3 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-[#FF671F] border border-orange-200/80 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>AI City Trip Planner • Bharat Tourism</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 tracking-tight">
            Plan Your Trip
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Create a personalized travel itinerary for any city in India with nearby attractions,
            travel routes, and local experiences.
          </p>
        </div>

        {/* Hero Panorama Illustration / Gateway of India Sunset banner */}
        <div className="w-full md:w-80 h-40 sm:h-44 rounded-2xl overflow-hidden shadow-sm border border-stone-200 relative shrink-0">
          <img
            src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80"
            alt="Gateway of India and Taj Mahal Palace, Mumbai"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex items-end p-3">
            <div className="text-white text-xs">
              <span className="font-semibold block">{selectedCityObj.name} Heritage</span>
              <span className="text-[10px] text-stone-200 opacity-90">{selectedCityObj.state}, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INPUT CARD: DESTINATION, DAYS, PACE, BUDGET & PREFERENCES */}
      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm p-6 sm:p-7 space-y-6">
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
              <option value={1}>1 Day</option>
              <option value={2}>2 Days</option>
              <option value={3}>3 Days</option>
              <option value={4}>4 Days</option>
              <option value={5}>5 Days</option>
              <option value={6}>6 Days</option>
              <option value={7}>7 Days</option>
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
              <option value="relaxed">Relaxed</option>
              <option value="moderate">Moderate</option>
              <option value="fast">Fast-paced</option>
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
              <option value="budget">Budget</option>
              <option value="moderate">Mid-range</option>
              <option value="luxury">Luxury</option>
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
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Plan My Trip</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Trip Preferences (Optional) Pills */}
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
                Your {itinerary.days_count || daysCount}-Day Itinerary for {itinerary.city || selectedCityObj.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
                {itinerary.summary ||
                  'A perfect mix of heritage, culture, beaches, food and local experiences — planned with nearby places to make your journey smooth and enjoyable.'}
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => onNavigateTab('map')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5 text-stone-600" />
                <span>View on Map</span>
              </button>

              <button
                onClick={handleDownloadPlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Download Plan</span>
              </button>

              <button
                onClick={handleSharePlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs transition cursor-pointer"
              >
                {shareSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Saved!</span>
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

          {/* DAY-BY-DAY CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {(itinerary.days || []).map((day: ItineraryDay) => (
              <div
                key={day.day_number}
                className="rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Day Header */}
                  <div className="p-4 space-y-2 border-b border-stone-100">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-[#0B192C] text-[11px] font-bold">
                      Day {day.day_number}
                    </span>
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
                        src={day.hero_image_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80'}
                        alt={day.area_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* List of Ordered Places */}
                  <div className="p-4 space-y-3">
                    {day.places.map((place, idx) => (
                      <div
                        key={idx}
                        onClick={() => place.id && onSelectPlace(place.id)}
                        className="flex items-start gap-2.5 text-xs cursor-pointer group/place"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-stone-800 group-hover/place:text-[#FF671F] transition leading-tight">
                            {place.name}
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                            <span>📍 {place.distance_info || '0 km'}</span>
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
                  <div className="text-[11px] text-stone-600 space-y-0.5 pl-4">
                    {day.shopping.map((shop, sIdx) => (
                      <div key={sIdx} className="leading-snug list-disc">
                        • {shop}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5. TRAVEL RESPONSIBLY GREEN BANNER */}
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/90 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-950">
                  Travel Responsibly
                </h4>
                <p className="text-xs text-emerald-800 max-w-2xl leading-relaxed">
                  Help preserve India's heritage, respect local culture, keep places clean, and support local communities.
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold text-emerald-900/80 italic text-right self-end sm:self-center">
              "A smarter journey. A greener tomorrow."
            </div>
          </div>

          {/* 6. BOTTOM 4 VALUE PROPOSITION CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-200/80">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF671F] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Verified Information</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  From government and trusted sources
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Nearby Places</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Smartly grouped for less travel
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-800 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Local Experiences</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Discover more than just the famous
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Luggage className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">Your Perfect Journey</div>
                <div className="text-[11px] text-stone-500 leading-snug">
                  Simple, cozy and personalized
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
