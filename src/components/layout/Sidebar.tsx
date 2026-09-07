import React from 'react';
import {
  Compass,
  MapPin,
  Map as MapIcon,
  Navigation,
  Calendar,
  Box,
  Bot,
  Bookmark,
  Heart,
  User,
  LogOut,
  LogIn,
  Layers,
  ChevronRight,
  Landmark,
  Sparkles,
  Utensils,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { VirasatBrand } from '../common/TricolourBranding';

export type NavTab = 
  | 'home'
  | 'india'
  | 'heritage'
  | 'dashboard'
  | 'map'
  | 'routes'
  | 'itinerary'
  | '3d'
  | 'ai'
  | 'trips'
  | 'favorites'
  | 'profile';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) => {
  const { user, logout, setIsAuthModalOpen } = useAuth();

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }> = [
    { id: 'home', label: 'Explore & Overview', icon: Compass },
    { id: 'india', label: 'Explore India', icon: Compass, badge: 'States & Gems', badgeColor: 'bg-orange-100 text-orange-900 border-orange-200' },
    { id: 'heritage', label: 'Major Monuments & Heritage', icon: Landmark, badge: 'UNESCO & ASI', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    { id: 'dashboard', label: 'States & Hubs', icon: Layers, badge: '36 States/UTs', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    { id: 'map', label: 'Interactive Map', icon: MapIcon },
    { id: 'routes', label: 'Transit & Route Studio', icon: Navigation },
    { id: 'itinerary', label: 'Plan Trip (AI Planner)', icon: Calendar, badge: 'Cozy', badgeColor: 'bg-orange-100 text-orange-900 border-orange-200' },
    { id: '3d', label: '3D Heritage Models', icon: Box, badge: 'WebGL', badgeColor: 'bg-blue-100 text-blue-900 border-blue-200' },
    { id: 'ai', label: 'AI Travel Guide', icon: Bot, badge: 'Gemini', badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200' },
    { id: 'trips', label: 'My Saved Trips', icon: Bookmark },
    { id: 'favorites', label: 'Saved Places', icon: Heart },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-[#0B192C]/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-40 w-64 max-w-[85vw] bg-white border-r border-[#EFE8DF] flex flex-col transition-transform duration-300 shadow-xl lg:shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#EFE8DF] bg-white flex items-center justify-between gap-2">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group min-w-0 flex-1 cursor-pointer"
          >
            <VirasatBrand />
          </button>

          {/* Close button on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0 transition"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 tracking-wider uppercase">
            Platform Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-50 text-[#FF671F] border border-orange-200 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-[#FF671F]' : 'text-stone-400 group-hover:text-stone-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${
                      item.badgeColor || 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  isActive && <ChevronRight className="w-3.5 h-3.5 text-[#FF671F] flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Card / Auth */}
        <div className="p-3 border-t border-[#EFE8DF] bg-[#FAF8F5]/80">
          {user ? (
            <div className="p-3 rounded-xl bg-white border border-[#EFE8DF] space-y-2 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-300 text-[#FF671F] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-800 truncate">{user.name}</p>
                  <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                <button
                  onClick={() => handleNav('profile')}
                  className="text-[#FF671F] hover:text-[#E65100] font-semibold hover:underline cursor-pointer"
                >
                  Preferences
                </button>
                <button
                  onClick={logout}
                  className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Profile</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
