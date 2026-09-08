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
} from 'lucide-react';
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
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  onSelectCity,
  onOpenAuthModal,
  onOpenSearch,
  onOpenDatabaseStatus,
}) => {
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
      id: 'india',
      label: 'India Explorer',
      isActive: activeTab === 'india',
    },
    {
      id: 'dashboard',
      label: 'Destinations',
      isActive: activeTab === 'dashboard',
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
      label: 'AI Guide',
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
      <div className="w-full max-w-[96%] lg:max-w-[94%] xl:max-w-[92%] 2xl:max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Brand Logo */}
          <VirasatBrand onClick={() => handleNav('home')} />

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
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tools: City Switcher, Saved, Auth */}
          <div className="flex items-center gap-2">
            {/* City Selector Pill */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 hover:border-[#FF671F]/50 text-xs font-semibold text-[#0B192C] shadow-2xs transition cursor-pointer"
                title="Filter regional content"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF671F] shrink-0" />
                <span className="truncate">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
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
              className="p-2 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-200/50 transition relative"
              title="Notifications & Saved"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-700" />
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#FF671F] text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                1
              </span>
            </button>

            {/* Profile / Auth Button */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setProfileDropdownOpen(!profileDropdownOpen);
                  } else if (onOpenAuthModal) {
                    onOpenAuthModal();
                  } else {
                    handleNav('profile');
                  }
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition ${
                  isAuthenticated
                    ? 'bg-white border-[#EFE8DF] hover:border-[#046A38] text-stone-800 shadow-2xs'
                    : 'bg-[#046A38] hover:bg-[#03542C] border-[#046A38] text-white shadow-xs font-semibold text-xs active:scale-95 cursor-pointer'
                }`}
                title={isAuthenticated ? 'Account Profile' : 'Sign In'}
              >
                <User className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">
                  {isAuthenticated ? user?.name?.split(' ')[0] || 'Profile' : 'Sign In'}
                </span>
              </button>

              {profileDropdownOpen && isAuthenticated && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#EFE8DF] p-2 space-y-1 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-bold text-stone-900">{user?.name || 'Explorer'}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => handleNav('profile')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => handleNav('trips')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                    <span>Saved Trips & Circuits</span>
                  </button>
                  <button
                    onClick={() => handleNav('favorites')}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Heart className="w-3.5 h-3.5 text-stone-500" />
                    <span>Favorite Places</span>
                  </button>
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EFE8DF] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-4 animate-fadeIn">
          {/* Region Switcher on Mobile */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EFE8DF] text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-700" />
              <span className="font-semibold text-stone-700">Region:</span>
            </div>
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-xs font-bold text-stone-900 border-0 focus:ring-0 cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Navigation on Mobile */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Explore India
            </div>
            {mainNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                  link.isActive
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-stone-700 hover:bg-stone-200/50'
                }`}
              >
                <span>{link.label}</span>
                {link.isActive && <span className="w-2 h-2 rounded-full bg-amber-700" />}
              </button>
            ))}
          </div>

          {/* Secondary Tools on Mobile */}
          <div className="space-y-1 pt-2 border-t border-[#EFE8DF]">
            <div className="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Specialized Tools
            </div>
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-200/40 font-medium'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-700/80" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDatabaseStatus?.();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-900 bg-amber-50/70 border border-amber-200/60 font-semibold mt-2"
            >
              <Database className="w-4 h-4 text-amber-800" />
              <span>Master Database Architecture (Live)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
