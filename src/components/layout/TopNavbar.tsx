import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavTab } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { VirasatBrand, TricolourTopBar } from '../common/TricolourBranding';

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
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = Boolean(user);
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Curated cities list for instant regional switching
  const cities = ['All India', 'Mumbai', 'Delhi', 'Jaipur', 'Agra', 'Varanasi', 'Kochi', 'Goa', 'Bengaluru'];

  // Close dropdowns on outside click
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
      isActive: activeTab === 'heritage' || activeTab === '3d',
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
    { id: '3d', label: '3D Heritage Museum', description: 'Real-time WebGL architectural models', icon: Box },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EFE8DF] transition-all duration-200">
      <TricolourTopBar />
      <div className="w-full max-w-[98%] sm:max-w-[96%] lg:max-w-[94%] xl:max-w-[92%] 2xl:max-w-[1760px] mx-auto px-1.5 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-13 sm:h-16 md:h-18 gap-1 sm:gap-4">
          {/* Brand Logo */}
          <VirasatBrand onClick={() => handleNav('home')} size="sm" />

          {/* Desktop Primary Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {mainNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                  link.isActive
                    ? 'text-[#FF671F] bg-orange-50/90 border border-orange-200/80 shadow-2xs font-bold'
                    : 'text-stone-700 hover:text-[#0B192C] hover:bg-stone-100/60'
                }`}
              >
                {link.id === 'home' && <Home className="w-3.5 h-3.5 text-[#FF671F]" />}
                <span>{link.label}</span>
              </button>
            ))}

            {/* Contextual More Dropdown */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-150 flex items-center gap-1 ${
                  moreDropdownOpen || ['map', '3d'].includes(activeTab)
                    ? 'text-[#0B192C] bg-stone-100 border border-stone-200 shadow-2xs'
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
                {/* Desktop Search Trigger */}
                <div className="hidden md:flex items-center">
                  <button
                    type="button"
                    onClick={onOpenSearch}
                    className="flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-600 hover:text-stone-900 text-xs transition cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-600 focus:outline-none w-36 lg:w-48"
                    title="Search destinations & monuments"
                    aria-label="Search destinations & monuments"
                  >
                    <Search className="w-3.5 h-3.5 text-stone-500 shrink-0" aria-hidden="true" />
                    <span className="truncate text-[11px] text-stone-500 font-medium">Search heritage...</span>
                    <span className="ml-auto text-[9px] font-mono text-stone-400 bg-white px-1.5 py-0.5 rounded border border-stone-200 hidden lg:inline">⌘K</span>
                  </button>
                </div>

                {/* Mobile Search Button */}
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="md:hidden p-1.5 sm:p-2 rounded-full text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-amber-600 focus:outline-none cursor-pointer"
                  title="Search destinations & monuments"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-stone-700" aria-hidden="true" />
                </button>
              </>
            )}

            {/* City Selector Pill */}
            <div className="relative shrink-0" ref={cityDropdownRef}>
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white border border-stone-200 hover:border-[#FF671F]/50 text-xs font-semibold text-[#0B192C] shadow-2xs transition cursor-pointer max-w-[70px] xs:max-w-[85px] sm:max-w-none shrink-0"
                title="Filter regional content"
              >
                <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#FF671F] shrink-0" />
                <span className="truncate text-[10px] sm:text-xs font-bold">{selectedCity}</span>
                <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400 shrink-0" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EFE8DF] p-2 space-y-0.5 z-50 animate-fadeIn">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Region / City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        onSelectCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                        selectedCity === city
                          ? 'bg-amber-50 text-amber-800 font-bold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

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

            {/* Profile / Auth Button (High Visibility on Mobile) */}
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
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full border transition min-h-[32px] sm:min-h-[38px] shrink-0 focus-visible:ring-2 focus-visible:ring-amber-600 focus:outline-none cursor-pointer ${
                  isAuthenticated
                    ? 'bg-white border-[#EFE8DF] hover:border-[#046A38] text-stone-800 shadow-2xs'
                    : 'bg-[#046A38] hover:bg-[#03542C] border-[#046A38] text-white shadow-xs font-semibold text-[11px] sm:text-xs active:scale-95'
                }`}
                title={isAuthenticated ? 'Account Profile' : 'Sign In'}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" aria-hidden="true" />
                <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
                  {isAuthenticated ? user?.name?.split(' ')[0] || 'Profile' : 'Sign In'}
                </span>
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
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

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
