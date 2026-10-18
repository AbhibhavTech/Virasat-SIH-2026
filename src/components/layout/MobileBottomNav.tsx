import React from 'react';
import { Compass, Landmark, Sparkles, Calendar, Bot, Heart } from 'lucide-react';
import { NavTab } from './Sidebar';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onNavigateTab: (tab: NavTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigateTab,
}) => {
  const { t } = useLanguage();
  const { favorites } = useFavorites();
  const favCount = favorites ? favorites.length : 0;

  const tabs: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isSpecial?: boolean;
    badgeCount?: number;
    matches: NavTab[];
  }> = [
    {
      id: 'home',
      label: t('explore'),
      icon: Compass,
      matches: ['home', 'dashboard'],
    },
    {
      id: 'heritage',
      label: t('heritage'),
      icon: Landmark,
      matches: ['heritage'],
    },
    {
      id: 'festivals',
      label: t('festivals'),
      icon: Sparkles,
      matches: ['festivals'],
    },
    {
      id: 'itinerary',
      label: t('planTrip'),
      icon: Calendar,
      matches: ['itinerary', 'trips'],
    },
    {
      id: 'ai',
      label: t('aiConcierge'),
      icon: Bot,
      isSpecial: true,
      matches: ['ai'],
    },
    {
      id: 'favorites',
      label: t('saved'),
      icon: Heart,
      badgeCount: favCount,
      matches: ['favorites', 'profile'],
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-stone-200/90 shadow-[0_-4px_24px_rgba(11,25,44,0.06)] transition-all select-none"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)',
      }}
    >
      <div className="grid grid-cols-6 items-center h-14 max-w-lg mx-auto px-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.matches.includes(activeTab);

          return (
            <button
              key={tab.id}
              onClick={() => {
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  try {
                    navigator.vibrate(10);
                  } catch {}
                }
                onNavigateTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center h-full w-full py-1 rounded-xl transition-all duration-150 active:scale-90 focus:outline-none ${
                isActive
                  ? 'text-[#FF671F]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active top pill indicator */}
              {isActive && (
                <span className="absolute -top-[1px] w-7 h-[2.5px] rounded-full bg-[#FF671F] shadow-xs animate-fadeIn" />
              )}

              {/* Icon Container */}
              <div
                className={`relative flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                  tab.isSpecial
                    ? isActive
                      ? 'bg-gradient-to-tr from-[#FF671F] to-[#FFA040] text-white shadow-xs'
                      : 'bg-orange-50 text-[#FF671F]'
                    : isActive
                    ? 'bg-orange-50 text-[#FF671F]'
                    : ''
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                />

                {/* Badge Count for Favorites */}
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#FF671F] text-white text-[8px] font-bold flex items-center justify-center shadow-2xs border border-white">
                    {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9.5px] tracking-tight mt-0.5 leading-none transition-all ${
                  isActive ? 'font-bold text-[#FF671F]' : 'font-medium text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
