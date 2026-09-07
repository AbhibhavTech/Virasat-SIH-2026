import React from 'react';
import { NavTab } from './Sidebar';
import { Calendar, Navigation, Landmark, Box, Layers, Utensils, Sparkles, MapPin } from 'lucide-react';

interface ContextualSubNavProps {
  activeTab: NavTab;
  onNavigateTab?: (tab: NavTab) => void;
  setActiveTab?: (tab: NavTab) => void;
}

export const ContextualSubNav: React.FC<ContextualSubNavProps> = ({
  activeTab,
  onNavigateTab,
  setActiveTab,
}) => {
  const handleNav = (tab: NavTab) => {
    if (setActiveTab) setActiveTab(tab);
    else if (onNavigateTab) onNavigateTab(tab);
  };
  // Plan Trip contextual cluster
  if (['itinerary', 'routes'].includes(activeTab)) {
    return (
      <div className="bg-white/90 backdrop-blur-md border-b border-[#EFE8DF] sticky top-16 sm:top-18 z-30 px-4 py-2.5 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-2 hidden sm:inline">
              Plan Your Journey:
            </span>
            <button
              onClick={() => handleNav('itinerary')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'itinerary'
                  ? 'bg-[#FF671F] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Day Planner & Circuits</span>
            </button>

            <button
              onClick={() => handleNav('routes')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'routes'
                  ? 'bg-[#FF671F] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Multimodal Routes & Fares</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Destinations & India Hierarchy contextual cluster
  if (['dashboard', 'india'].includes(activeTab)) {
    return (
      <div className="bg-white/90 backdrop-blur-md border-b border-[#EFE8DF] sticky top-16 sm:top-18 z-30 px-4 py-2.5 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-2 hidden sm:inline">
              Regional Tourism:
            </span>
            <button
              onClick={() => handleNav('india')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'india'
                  ? 'bg-[#FF671F] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>28 States Master Hierarchy</span>
            </button>

            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'dashboard'
                  ? 'bg-[#FF671F] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>City Destinations Hub</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Heritage contextual cluster
  if (['heritage', '3d'].includes(activeTab)) {
    return (
      <div className="bg-white/90 backdrop-blur-md border-b border-[#EFE8DF] sticky top-16 sm:top-18 z-30 px-4 py-2.5 transition-all shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-2 hidden sm:inline">
              Heritage Collections:
            </span>
            <button
              onClick={() => handleNav('heritage')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'heritage'
                  ? 'bg-[#FF671F] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Major Monuments & Famous Heritage</span>
            </button>

            <button
              onClick={() => handleNav('3d')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === '3d'
                  ? 'bg-[#FF671F] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Interactive Museum</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
