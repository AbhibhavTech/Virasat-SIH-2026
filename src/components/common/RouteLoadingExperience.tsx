import React from 'react';
import { VirasatLogoMark } from './TricolourBranding';
import { useLanguage } from '../../contexts/LanguageContext';

interface RouteLoadingExperienceProps {
  title?: string;
  subtext?: string;
  compact?: boolean;
}

export const RouteLoadingExperience: React.FC<RouteLoadingExperienceProps> = ({
  title,
  subtext,
  compact = false,
}) => {
  const { currentLanguage } = useLanguage();
  const isHi = currentLanguage === 'hi';

  const displayTitle = title || (isHi ? 'विरासत · अतुल्य भारत' : "Virasat · Explore India's Heritage");
  const displaySubtext = subtext || (isHi ? 'सांस्कृतिक धरोहर के पन्ने खुल रहे हैं...' : 'Unfolding living heritage & cultural trails...');

  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center p-8 space-y-3 animate-fadeIn"
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-amber-200 border-t-[#FF671F] animate-spin" />
          <VirasatLogoMark className="w-7 h-7 object-contain" />
        </div>
        <p className="text-xs font-bold text-stone-600 tracking-wide text-center">
          {displayTitle}
        </p>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full min-h-[68vh] flex flex-col justify-start items-center pt-8 pb-16 px-4 animate-fadeIn"
    >
      {/* Top Indeterminate Tricolour Flow Beam */}
      <div className="fixed top-0 left-0 right-0 h-[3.5px] z-50 overflow-hidden pointer-events-none">
        <div
          className="splash-tricolour-bar h-full rounded-full"
          style={{
            background:
              'linear-gradient(90deg, #FF671F 0%, #FFA040 28%, #FFFFFF 48%, #000080 50%, #FFFFFF 52%, #138808 72%, #046A38 100%)',
          }}
        />
      </div>

      {/* Floating Center Brand Crest */}
      <div className="flex flex-col items-center text-center max-w-md w-full mb-10 mt-4">
        <div className="relative mb-4 flex items-center justify-center">
          {/* Pulsing Aura Ring */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-amber-400/20 via-orange-400/20 to-emerald-400/20 animate-aura-pulse filter blur-sm" />
          
          {/* Rotating Subtle Golden Aura */}
          <div className="absolute -inset-1.5 rounded-full border border-amber-300/40 border-dashed animate-golden-spin" />

          {/* Logo Badge */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-xl ring-2 ring-amber-200/80 p-2 flex items-center justify-center animate-logo-breath">
            <VirasatLogoMark className="w-full h-full object-contain" />
          </div>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-black text-stone-900 tracking-wider">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
          {displaySubtext}
        </p>

        {/* Delicate Tricolour Dots Indicator */}
        <div className="flex items-center gap-1.5 mt-3">
          <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#046A38] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Sophisticated Pre-rendered Shimmer Skeleton Layout (prevents layout shift) */}
      <div className="w-full max-w-5xl space-y-6 opacity-75">
        {/* Banner Skeleton */}
        <div className="h-32 sm:h-44 w-full rounded-3xl virasat-skeleton border border-stone-200/60 p-6 flex flex-col justify-end">
          <div className="h-6 w-1/3 bg-stone-300/50 rounded-lg mb-2" />
          <div className="h-4 w-2/3 bg-stone-300/40 rounded-lg" />
        </div>

        {/* 3 Grid Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="h-64 rounded-3xl virasat-skeleton border border-stone-200/60 p-4 flex flex-col justify-between"
            >
              <div className="h-32 w-full bg-stone-300/40 rounded-2xl mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-stone-300/50 rounded-md" />
                <div className="h-3 w-1/2 bg-stone-300/40 rounded-md" />
              </div>
              <div className="h-8 w-full bg-stone-300/30 rounded-xl mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
