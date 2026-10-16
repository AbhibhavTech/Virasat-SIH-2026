import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Compass,
  Landmark,
  Bot,
  MapPin,
  User,
  Heart,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  Box,
  ShieldCheck,
  Bookmark,
  ExternalLink,
  Database,
  Home,
  BarChart3,
  Navigation,
  Loader2,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavTab } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { VirasatBrand, TricolourTopBar } from '../common/TricolourBranding';
import { findNearestCity, ALL_CITIES_LIST } from '../../data/citiesData';
import { ALL_INDIAN_TOURISM_CITIES } from '../../data/cityItineraryData';

interface CityItemInfo {
  name: string;
  state: string;
  popular?: boolean;
}

export const POPULAR_CITIES: CityItemInfo[] = [
  { name: 'Mumbai', state: 'Maharashtra', popular: true },
  { name: 'Delhi', state: 'National Capital Territory', popular: true },
  { name: 'Varanasi', state: 'Uttar Pradesh', popular: true },
  { name: 'Jaipur', state: 'Rajasthan', popular: true },
  { name: 'Agra', state: 'Uttar Pradesh', popular: true },
  { name: 'Kochi', state: 'Kerala', popular: true },
  { name: 'Goa', state: 'West Coast', popular: true },
  { name: 'Bengaluru', state: 'Karnataka', popular: true },
  { name: 'Amritsar', state: 'Punjab', popular: true },
  { name: 'Kolkata', state: 'West Bengal', popular: true },
  { name: 'Hyderabad', state: 'Telangana', popular: true },
  { name: 'Udaipur', state: 'Rajasthan', popular: true },
  { name: 'Lucknow', state: 'Uttar Pradesh', popular: true },
  { name: 'Srinagar', state: 'Jammu & Kashmir', popular: true },
  { name: 'Ahmedabad', state: 'Gujarat', popular: true },
  { name: 'Bhopal', state: 'Madhya Pradesh', popular: true },
  { name: 'Chennai', state: 'Tamil Nadu', popular: true },
  { name: 'Guwahati', state: 'Assam', popular: true },
  { name: 'Bhubaneswar', state: 'Odisha', popular: true },
  { name: 'Patna', state: 'Bihar', popular: true },
  { name: 'Chandigarh', state: 'Punjab / Haryana', popular: true },
  { name: 'Shimla', state: 'Himachal Pradesh', popular: true },
  { name: 'Rishikesh', state: 'Uttarakhand', popular: true },
  { name: 'Mysuru', state: 'Karnataka', popular: true },
  { name: 'Hampi', state: 'Karnataka', popular: true },
  { name: 'Madurai', state: 'Tamil Nadu', popular: true },
  { name: 'Jodhpur', state: 'Rajasthan', popular: true },
  { name: 'Khajuraho', state: 'Madhya Pradesh', popular: true },
  { name: 'Pune', state: 'Maharashtra', popular: true },
];

interface TopNavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenAuthModal?: () => void;
  onOpenSearch?: () => void;
  onOpenDatabaseStatus?: () => void;
  onOpenAnalytics?: () => void;
  onOpenARCamera?: () => void;
  onOpenSOS?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  onSelectCity,
  onOpenAuthModal,
  onOpenSearch,
  onOpenDatabaseStatus,
  onOpenAnalytics,
  onOpenARCamera,
  onOpenSOS,
}) => {
  const navigate = useNavigate();
  const { user, logout, loginWithGoogle } = useAuth();
  const isAuthenticated = Boolean(user);
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Exact City Location Finder States
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Resolve state of current selected city for exact location display
  const currentState = useMemo(() => {
    if (!selectedCity || selectedCity === 'All India') return null;
    const match =
      ALL_INDIAN_TOURISM_CITIES.find(
        (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
      ) ||
      ALL_CITIES_LIST.find(
        (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
      );
    return match?.state || null;
  }, [selectedCity]);

  // Search filter across India's master tourism database
  const filteredCities = useMemo(() => {
    const q = citySearchQuery.trim().toLowerCase();
    if (!q) {
      return POPULAR_CITIES;
    }
    const matches = ALL_INDIAN_TOURISM_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
    return matches.slice(0, 30).map((c) => ({
      name: c.name,
      state: c.state,
    }));
  }, [citySearchQuery]);

  // Detect exact GPS location and reverse-geocode to exact Indian city
  const handleDetectCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationError('Browser me geolocation support uplabdh nahi hai.');
      setTimeout(() => setLocationError(null), 4000);
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationNotice(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          let detectedCity = '';
          let detectedState = '';

          // 1. Try reverse geocoding via OpenStreetMap Nominatim for exact city & state
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4500);
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { signal: controller.signal }
            );
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const rawCity =
                addr.city ||
                addr.town ||
                addr.village ||
                addr.county ||
                addr.state_district ||
                '';
              const rawState = addr.state || '';

              if (rawCity) {
                detectedCity = rawCity;
                detectedState = rawState;
              }
            }
          } catch (e) {
            console.warn('Reverse geocode failed or timed out:', e);
          }

          // 2. Nearest city fallback or canonical match
          const { city: nearest } = findNearestCity(latitude, longitude);

          if (detectedCity) {
            // Check if detected city matches a known canonical Indian city
            const foundCanonical = ALL_INDIAN_TOURISM_CITIES.find(
              (c) =>
                c.name.toLowerCase() === detectedCity.toLowerCase() ||
                detectedCity.toLowerCase().includes(c.name.toLowerCase()) ||
                c.name.toLowerCase().includes(detectedCity.toLowerCase())
            );
            if (foundCanonical) {
              detectedCity = foundCanonical.name;
              detectedState = foundCanonical.state;
            }
          } else if (nearest) {
            detectedCity = nearest.name;
            detectedState = nearest.state;
          }

          const finalCity = detectedCity || nearest?.name || 'Mumbai';
          const finalState = detectedState || nearest?.state || '';

          onSelectCity(finalCity);
          setLocationNotice(`Detected: ${finalCity}${finalState ? `, ${finalState}` : ''}`);
          setTimeout(() => {
            setLocationNotice(null);
            setCityDropdownOpen(false);
          }, 1800);
        } catch (err) {
          console.error('Error determining location:', err);
          const { city: nearest } = findNearestCity(pos.coords.latitude, pos.coords.longitude);
          if (nearest) {
            onSelectCity(nearest.name);
            setLocationNotice(`Detected: ${nearest.name}, ${nearest.state}`);
            setTimeout(() => {
              setLocationNotice(null);
              setCityDropdownOpen(false);
            }, 1800);
          }
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation access denied or error:', err);
        setIsLocating(false);
        setLocationError('Location permission denied. Please select from the list below.');
        setTimeout(() => setLocationError(null), 5000);
      },
      { timeout: 9000, enableHighAccuracy: true }
    );
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(target)) {
        setMoreDropdownOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(target)) {
        setCityDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setProfileDropdownOpen(false);
  };

  // Primary top links as specified in user guidelines
  const mainNavLinks: Array<{
    id: NavTab;
    label: string;
    isActive: boolean;
  }> = [
    {
      id: 'home',
      label: 'Explore',
      isActive: activeTab === 'home',
    },
    {
      id: 'festivals',
      label: 'Festivals',
      isActive: activeTab === 'festivals',
    },
    {
      id: 'india',
      label: 'Discover Bharat',
      isActive: activeTab === 'india',
    },
    {
      id: 'heritage',
      label: 'Heritage',
      isActive: activeTab === 'heritage',
    },
    {
      id: 'itinerary',
      label: 'Plan Trip',
      isActive: activeTab === 'itinerary',
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      isActive: activeTab === 'ai',
    },
  ];

  // Secondary items cleanly organized under "More"
  const secondaryItems: Array<{
    id: NavTab;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'map', label: 'Interactive Map', description: 'GIS markers across all Indian regions', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE8DF] transition-all duration-200">
      <TricolourTopBar />
      <div className="w-full max-w-[98%] xl:max-w-[96%] 2xl:max-w-[1880px] mx-auto px-2 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-1.5 sm:gap-4">
          {/* Brand Logo */}
          <VirasatBrand onClick={() => handleNav('home')} size="md" />

          {/* Desktop Primary Navigation (Shifted toward right side) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 ml-auto mr-1.5 lg:mr-3">
            {mainNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3.5 lg:px-4 py-2 rounded-full text-xs md:text-sm lg:text-[15px] transition-all duration-150 flex items-center gap-1.5 ${
                  link.isActive
                    ? 'text-[#FF671F] bg-orange-50/90 border border-orange-200/80 shadow-2xs font-bold'
                    : 'text-stone-700 hover:text-[#0B192C] hover:bg-stone-100/60 font-semibold'
                }`}
              >
                {link.id === 'home' && <Home className="w-4 h-4 text-[#FF671F]" />}
                <span>{link.label}</span>
              </button>
            ))}

            {/* Contextual More Dropdown */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3.5 lg:px-4 py-2 rounded-full text-xs md:text-sm lg:text-[15px] font-semibold transition-all duration-150 flex items-center gap-1 ${
                  moreDropdownOpen || activeTab === 'map'
                    ? 'text-[#0B192C] bg-stone-100 border border-stone-200 shadow-2xs font-bold'
                    : 'text-stone-700 hover:text-[#0B192C] hover:bg-stone-100/60'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-stone-500 ${
                    moreDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EFE8DF] p-2 space-y-1 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Extended Tourism Tools
                  </div>
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition ${
                          isSelected
                            ? 'bg-amber-50 text-amber-900 font-semibold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-stone-100 text-stone-600 shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">{item.label}</div>
                          <div className="text-[11px] text-stone-500 line-clamp-1">{item.description}</div>
                        </div>
                      </button>
                    );
                  })}

                  <div className="pt-1 mt-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onOpenDatabaseStatus?.();
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-amber-50/70 text-stone-700 transition group"
                    >
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 shrink-0 mt-0.5 group-hover:bg-amber-100 transition">
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          Database Architecture
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Live
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          11 Master categories & storage status
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onOpenAnalytics?.();
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-purple-50/70 text-stone-700 transition group"
                    >
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 shrink-0 mt-0.5 group-hover:bg-purple-100 transition">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          Evaluation Telemetry
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-50 text-purple-800 border border-purple-200">
                            SIH 2026
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          Live metrics, routes & AI grounding rate
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        navigate('/admin');
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-emerald-50/70 text-stone-700 transition group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 mt-0.5 group-hover:bg-emerald-100 transition">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                          Admin & Verification
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Portal
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          Audit, review places & official sources
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tools: City Switcher, Search, Saved, Auth */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Universal Search Bar Trigger */}
            {onOpenSearch && (
              <>
                {/* Desktop Search Trigger (Compact & Reduced) */}
                <div className="hidden md:flex items-center">
                  <button
                    type="button"
                    onClick={onOpenSearch}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-medium transition cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-600 focus:outline-none w-28 sm:w-32 lg:w-36"
                    title="Search destinations & monuments"
                    aria-label="Search destinations & monuments"
                  >
                    <Search className="w-3.5 h-3.5 text-stone-500 shrink-0" aria-hidden="true" />
                    <span className="truncate text-xs text-stone-500 font-medium">Search...</span>
                    <span className="ml-auto text-[9px] font-mono text-stone-400 bg-white px-1.5 py-0.2 rounded border border-stone-200 hidden lg:inline">⌘K</span>
                  </button>
                </div>

                {/* Mobile Search Button */}
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="md:hidden p-2 sm:p-2.5 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition min-h-[36px] min-w-[36px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-amber-600 focus:outline-none cursor-pointer"
                  title="Search destinations & monuments"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700" aria-hidden="true" />
                </button>
              </>
            )}

            {/* City Selector Pill with Exact Location Finder */}
            <div className="relative shrink-0" ref={cityDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setCityDropdownOpen(!cityDropdownOpen);
                  setCitySearchQuery('');
                  setLocationError(null);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white border border-stone-200 hover:border-[#FF671F]/60 text-xs sm:text-sm font-bold text-[#0B192C] shadow-2xs transition cursor-pointer shrink-0"
                title={currentState ? `${selectedCity}, ${currentState}` : selectedCity}
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF671F] shrink-0" />
                <div className="text-left flex flex-col justify-center min-w-0">
                  <span className="truncate text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                    {selectedCity}
                  </span>
                  {currentState && selectedCity !== 'All India' && (
                    <span className="text-[9px] text-stone-500 font-medium leading-none hidden lg:block truncate mt-0.5">
                      {currentState}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400 shrink-0 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2.5 z-50 animate-fadeIn flex flex-col max-h-[460px]">
                  {/* Dropdown Header */}
                  <div className="px-2 pb-2 border-b border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF671F]" />
                        <span>Select Exact Location</span>
                      </div>
                      <div className="text-[10px] text-stone-500">
                        Exact city &amp; state pata karein
                      </div>
                    </div>
                    {selectedCity && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#D45B10] text-[10px] font-bold border border-orange-200/60 truncate max-w-[110px]">
                        {selectedCity}
                      </span>
                    )}
                  </div>

                  {/* 1. Detect My Exact Location Action Button */}
                  <div className="pt-2 pb-1.5">
                    <button
                      type="button"
                      onClick={handleDetectCurrentLocation}
                      disabled={isLocating}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 text-stone-800 transition cursor-pointer text-left shadow-2xs group disabled:opacity-60"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FF671F] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {isLocating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Navigation className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#B24508] flex items-center gap-1">
                          <span>{isLocating ? 'Detecting your GPS position...' : 'Detect My Exact Location'}</span>
                        </div>
                        <div className="text-[10px] text-stone-600 truncate">
                          {isLocating ? 'Finding exact city & state...' : 'GPS se current city & state pata karein'}
                        </div>
                      </div>
                    </button>

                    {/* Feedback notices */}
                    {locationNotice && (
                      <div className="mt-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 animate-fadeIn">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{locationNotice}</span>
                      </div>
                    )}

                    {locationError && (
                      <div className="mt-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-medium leading-tight">
                        {locationError}
                      </div>
                    )}
                  </div>

                  {/* 2. Search Any City Input */}
                  <div className="py-1">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-200 focus-within:border-[#FF671F] focus-within:bg-white transition">
                      <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search city or state in India..."
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        className="w-full text-xs bg-transparent focus:outline-hidden text-stone-800 placeholder-stone-400 font-medium"
                      />
                      {citySearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCitySearchQuery('')}
                          className="text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 3. Cities List (with exact state and highlight) */}
                  <div className="overflow-y-auto flex-1 divide-y divide-stone-50 pt-1 -mx-1 px-1">
                    {/* All India option (when no search query or matches "all") */}
                    {(!citySearchQuery || 'all india'.includes(citySearchQuery.toLowerCase())) && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCity('All India');
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer mb-1 ${
                          selectedCity === 'All India'
                            ? 'bg-stone-900 text-white font-bold'
                            : 'text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs">All India</div>
                          <div className={`text-[10px] ${selectedCity === 'All India' ? 'text-stone-300' : 'text-stone-500'}`}>
                            Pan-India Living Heritage &amp; Monuments
                          </div>
                        </div>
                        {selectedCity === 'All India' && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    )}

                    {/* Filtered Cities */}
                    {filteredCities.map((c) => {
                      const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase();
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            onSelectCity(c.name);
                            setCityDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/80'
                              : 'text-stone-800 hover:bg-stone-50'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-xs text-stone-900 truncate">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-stone-500 font-medium truncate">
                              {c.state}
                            </div>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#FF671F] shrink-0" />
                          )}
                        </button>
                      );
                    })}

                    {filteredCities.length === 0 && (
                      <div className="py-6 text-center text-xs text-stone-400">
                        No matching city found. Try another city name.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 24x7 Tourist Emergency SOS Helpline (Compact & Reduced) */}
            {onOpenSOS && (
              <button
                type="button"
                onClick={onOpenSOS}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-rose-700 hover:text-rose-900 transition shadow-2xs active:scale-95 cursor-pointer shrink-0"
                title="24x7 Tourist Emergency SOS Helpline (112 / 1363)"
                aria-label="24x7 Tourist Emergency SOS Helpline"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-600"></span>
                </span>
                <span className="text-[10.5px] font-black tracking-tight text-rose-700">SOS</span>
              </button>
            )}

            {/* Notifications & Updates Bell */}
            <button
              onClick={() => handleNav('favorites')}
              className="p-1.5 sm:p-2 rounded-full text-stone-800 hover:text-stone-950 hover:bg-stone-200/50 transition relative min-h-[32px] min-w-[32px] sm:min-h-[44px] sm:min-w-[44px] hidden xs:flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-amber-600 focus:outline-none cursor-pointer"
              title="Notifications & Saved"
              aria-label="Notifications and Saved Favorites"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-800" aria-hidden="true" />
              <span className="absolute top-0.5 sm:top-1.5 right-0.5 sm:right-1.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FF671F] text-white text-[7px] sm:text-[8px] font-bold flex items-center justify-center shadow-xs">
                1
              </span>
            </button>

            {/* Profile / Auth Button (With Integrated Google Sign In) */}
            <div className="relative shrink-0" ref={profileDropdownRef}>
              <button
                onClick={() => {
                  setMoreDropdownOpen(false);
                  setCityDropdownOpen(false);
                  setMobileMenuOpen(false);
                  if (isAuthenticated) {
                    setProfileDropdownOpen(!profileDropdownOpen);
                  } else if (onOpenAuthModal) {
                    setProfileDropdownOpen(false);
                    onOpenAuthModal();
                  } else {
                    handleNav('profile');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition min-h-[32px] sm:min-h-[36px] shrink-0 focus-visible:ring-2 focus-visible:ring-amber-600 focus:outline-none cursor-pointer ${
                  isAuthenticated
                    ? 'bg-white border-[#EFE8DF] hover:border-[#046A38] text-stone-800 shadow-2xs'
                    : 'bg-[#046A38] hover:bg-[#03542C] border-[#046A38] text-white shadow-xs font-semibold text-xs active:scale-95'
                }`}
                title={isAuthenticated ? 'Account Profile' : 'Sign In with Google / Account'}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                {isAuthenticated ? (
                  <>
                    <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="text-xs font-bold whitespace-nowrap">
                      {user?.name?.split(' ')[0] || 'Profile'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0 p-0.5 shadow-2xs">
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    </span>
                    <span className="text-xs font-bold whitespace-nowrap">Sign In</span>
                  </>
                )}
              </button>

              {profileDropdownOpen && isAuthenticated && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EFE8DF] p-2 space-y-1 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900">{user?.name || 'Explorer'}</p>
                    <p className="text-[11px] text-stone-600 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center gap-2 min-h-[44px]"
                  >
                    <User className="w-4 h-4 text-stone-600" aria-hidden="true" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => handleNav('trips')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center gap-2 min-h-[44px]"
                  >
                    <Bookmark className="w-4 h-4 text-stone-600" aria-hidden="true" />
                    <span>Saved Trips & Circuits</span>
                  </button>
                  <button
                    onClick={() => handleNav('favorites')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-stone-800 hover:bg-stone-50 flex items-center gap-2 min-h-[44px]"
                  >
                    <Heart className="w-4 h-4 text-stone-600" aria-hidden="true" />
                    <span>Favorite Places</span>
                  </button>
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 min-h-[44px] flex items-center"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-stone-800 hover:bg-stone-200/60 focus:outline-none min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-amber-600 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu & Backdrop Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-13 sm:top-14 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-13 sm:top-14 left-0 right-0 max-h-[calc(100dvh-4rem)] overflow-y-auto z-50 md:hidden border-b border-[#EFE8DF] bg-[#FAF8F5] px-3 pt-3 pb-24 space-y-3 shadow-2xl rounded-b-2xl animate-fadeIn">
            {/* Dedicated Authentication Card on Mobile */}
            {!isAuthenticated ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-amber-50 border border-emerald-200/80 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#046A38] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-900">Welcome to Virasat</div>
                    <div className="text-[11px] text-stone-500 truncate">Sign in to save trips & favorites</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuthModal) onOpenAuthModal();
                    else handleNav('profile');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#046A38] hover:bg-[#03542C] text-white text-xs font-bold shadow-xs active:scale-95 shrink-0 cursor-pointer transition flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-white border border-[#EFE8DF] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 truncate">{user?.name || 'Explorer'}</div>
                      <div className="text-[10px] text-stone-500 truncate">{user?.email}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                    Signed In
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-stone-100">
                  <button
                    onClick={() => handleNav('profile')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-[11px] font-semibold"
                  >
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => handleNav('favorites')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-800 text-[11px] font-semibold"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Saved ({favorites?.length || 0})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Region Switcher on Mobile */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#EFE8DF] text-xs min-h-[38px]">
              <div className="flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                <span className="font-semibold text-stone-800 text-[11px]">Region:</span>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-stone-900 border-0 focus:ring-0 cursor-pointer max-w-[170px] truncate"
                aria-label="Select region or city"
              >
                <option value="All India">All India</option>
                {POPULAR_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency SOS on Mobile */}
            {onOpenSOS && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSOS();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition min-h-[38px] active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                  <span>24x7 Tourist Emergency Helpline</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                  112 / 1363
                </span>
              </button>
            )}

            {/* Primary Navigation on Mobile */}
            <div className="space-y-0.5">
              <div className="px-2 text-[9px] font-bold text-stone-500 uppercase tracking-wider">
                Explore India
              </div>
              {mainNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition min-h-[38px] ${
                    link.isActive
                      ? 'bg-amber-100 text-amber-950'
                      : 'text-stone-800 hover:bg-stone-200/50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-700" aria-hidden="true" />}
                </button>
              ))}
            </div>

            {/* Secondary Tools on Mobile */}
            <div className="space-y-0.5 pt-2 border-t border-[#EFE8DF]">
              <div className="px-2 text-[9px] font-bold text-stone-500 uppercase tracking-wider">
                Specialized Tools
              </div>
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition min-h-[38px] ${
                      isSelected
                        ? 'bg-amber-50 text-amber-950 font-bold'
                        : 'text-stone-800 hover:bg-stone-200/40 font-medium'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDatabaseStatus?.();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-950 bg-amber-50/80 border border-amber-300 font-semibold mt-1 min-h-[38px]"
              >
                <Database className="w-3.5 h-3.5 text-amber-800 shrink-0" aria-hidden="true" />
                <span className="truncate">Master Database Architecture</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/admin');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-emerald-950 bg-emerald-50/80 border border-emerald-300 font-semibold mt-1 min-h-[38px]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" aria-hidden="true" />
                <span className="truncate">Admin Verification Portal</span>
              </button>
            </div>

            {/* Logout on Mobile if authenticated */}
            {isAuthenticated && (
              <div className="pt-2 border-t border-[#EFE8DF]">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition"
                >
                  Sign Out of Account
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};
