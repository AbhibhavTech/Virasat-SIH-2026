import React, { useRef, useEffect } from 'react';
import {
  Landmark,
  Sparkles,
  Compass,
  Map as MapIcon,
  Layers,
  Calendar,
  Bot,
  Bookmark,
  Heart,
  User,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  const favCount = favorites ? favorites.length : 0;
  const navContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const handleNav = (tab: NavTab) => {
    if (setActiveTab) setActiveTab(tab);
    else if (onNavigateTab) onNavigateTab(tab);
  };

  // Auto-scroll the active tab into center view on mobile
  useEffect(() => {
    if (activeTabRef.current && navContainerRef.current) {
      const container = navContainerRef.current;
      const tabElement = activeTabRef.current;
      const containerWidth = container.offsetWidth;
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const scrollTarget = tabLeft - containerWidth / 2 + tabWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: 'smooth',
      });
    }
  }, [activeTab]);

  const allTabs: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeCount?: number;
    highlight?: boolean;
  }> = [
    {
      id: 'heritage',
      label: t('heritage'),
      icon: Landmark,
      badge: 'UNESCO',
    },
    {
      id: 'festivals',
      label: t('festivals'),
      icon: Sparkles,
      badge: 'Live',
    },
    {
      id: 'home',
      label: t('explore'),
      icon: Compass,
    },
    {
      id: 'map',
      label: t('map'),
      icon: MapIcon,
    },
    {
      id: 'india',
      label: t('bharat'),
      icon: Layers,
    },
    {
      id: 'itinerary',
      label: t('planTrip'),
      icon: Calendar,
    },
    {
      id: 'ai',
      label: t('aiConcierge'),
      icon: Bot,
      highlight: true,
    },
    {
      id: 'trips',
      label: t('trips'),
      icon: Bookmark,
    },
    {
      id: 'favorites',
      label: t('saved'),
      icon: Heart,
      badgeCount: favCount,
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: User,
    },
  ];

  return (
    <div
      aria-label="Mobile Navigation Tabs"
      className="md:hidden sticky top-13 sm:top-14 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EFE8DF] shadow-2xs select-none"
    >
      <div
        ref={navContainerRef}
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-center gap-1.5 px-2.5 py-2 overflow-x-auto scrollbar-none no-scrollbar scroll-smooth"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {allTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : undefined}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleNav(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 active:scale-95 focus:outline-none ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white shadow-xs font-bold'
                  : tab.highlight
                  ? 'bg-orange-50/90 text-orange-900 border border-orange-200/80 hover:bg-orange-100'
                  : 'bg-white text-stone-700 border border-stone-200/90 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive
                    ? 'text-white'
                    : tab.highlight
                    ? 'text-orange-600'
                    : 'text-stone-500'
                }`}
              />
              <span>{tab.label}</span>

              {/* Text Badge */}
              {tab.badge && !isActive && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-200/60 leading-tight">
                  {tab.badge}
                </span>
              )}

              {/* Numeric Badge (e.g. Saved count) */}
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight ${
                    isActive
                      ? 'bg-white text-orange-700'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
