import React from 'react';
import { NavTab } from './Sidebar';
import { Landmark, Box, Layers, Utensils, Sparkles, MapPin } from 'lucide-react';

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

  // Destinations & India Hierarchy secondary navigation removed per user specification

  // Heritage contextual cluster
  if (['heritage', '3d'].includes(activeTab)) {
    return (
      <div className="bg-white/90 backdrop-blur-md border-b border-[#EFE8DF] sticky top-14 sm:top-16 md:top-18 z-30 px-2.5 sm:px-4 py-1.5 sm:py-2.5 transition-all shadow-2xs">
        <div className="w-full max-w-[96%] lg:max-w-[94%] xl:max-w-[92%] 2xl:max-w-[1760px] mx-auto px-1 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none mobile-scroll-row">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wider mr-1 sm:mr-2 hidden sm:inline">
              Heritage Collections:
            </span>
            <button
              onClick={() => handleNav('heritage')}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition whitespace-nowrap ${
                activeTab === 'heritage'
                  ? 'bg-[#FF671F] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="hidden sm:inline">Major Monuments &amp; Famous Heritage</span>
              <span className="sm:hidden">Monuments</span>
            </button>

            <button
              onClick={() => handleNav('3d')}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition whitespace-nowrap ${
                activeTab === '3d'
                  ? 'bg-[#FF671F] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Box className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="hidden sm:inline">3D Interactive Museum</span>
              <span className="sm:hidden">3D Gallery</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
