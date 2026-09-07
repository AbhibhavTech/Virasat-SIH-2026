import React, { useState, useEffect } from 'react';
import { safeSessionStorage } from '../../utils/storage';
import { VirasatLogoMark, AshokaChakra, FlowingTricolourRibbon } from './TricolourBranding';

interface BrandSplashScreenProps {
  onFinished?: () => void;
  minDurationMs?: number;
  forceShow?: boolean;
}

const SPLASH_STORAGE_KEY = 'virasat_splash_session_seen';

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({
  onFinished,
  minDurationMs = 2200,
  forceShow = false,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    if (forceShow) return true;
    try {
      if (typeof window !== 'undefined' && window.location.search.includes('splash=true')) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    if (!isVisible) {
      if (onFinished) onFinished();
      return;
    }

    // Set session storage key so page/tab navigation does not replay it
    try {
      safeSessionStorage.setItem(SPLASH_STORAGE_KEY, 'true');
    } catch {
      // Local/session storage disabled or unavailable
    }

    // Timer for initial display
    const exitTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDurationMs);

    // Timer for complete unmount after smooth fade/scale transition (500ms)
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinished) onFinished();
    }, minDurationMs + 500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [isVisible, minDurationMs, onFinished]);

  const handleDismissEarly = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onFinished) onFinished();
    }, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="virasat-brand-splash"
      role="status"
      aria-label="Welcome to Virasat"
      onClick={handleDismissEarly}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5] overflow-hidden select-none cursor-default transition-all duration-500 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-[1.02] pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Flowing Tricolour Ribbon & Ambient Glow */}
      <FlowingTricolourRibbon variant="hero" className="opacity-90 z-1" />

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full bg-gradient-to-tr from-orange-200/25 via-emerald-100/35 to-blue-100/20 blur-3xl" />
        <div className="absolute opacity-15">
          <AshokaChakra size={400} spinning />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg w-full">
        {/* Virasat Logo Emblem */}
        <div className="relative mb-5 sm:mb-6">
          <div className="absolute -inset-3 rounded-3xl bg-[#FF671F]/15 blur-xl transition-opacity" />
          <VirasatLogoMark size={72} className="shadow-lg hover:scale-105 transition-transform" />
        </div>

        {/* Brand Name */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#0B192C]">
            Virasat
          </h1>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-[#FF671F] border border-orange-200 tracking-wider uppercase">
            Official
          </span>
        </div>

        {/* Supporting Tagline */}
        <p className="text-base sm:text-lg font-serif font-semibold text-stone-800 tracking-tight mt-1 mb-1">
          Discover India&apos;s Living Heritage
        </p>

        <p className="text-xs sm:text-sm font-medium text-stone-500 tracking-wider uppercase text-center mb-7">
          Monuments • Culture • Dynasties • Experiences
        </p>

        {/* Small, Elegant Tricolour Loading Indicator */}
        <div className="flex flex-col items-center gap-2 w-full">
          <div
            className="w-36 sm:w-44 h-1.5 bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner"
            aria-hidden="true"
          >
            <div className="splash-progress-bar h-full rounded-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]" />
          </div>
          <span className="text-[11px] text-stone-400 font-medium tracking-wide">
            Entering India&apos;s Timeless Treasury...
          </span>
        </div>
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">
        Virasat: Discover India&apos;s Living Heritage. Loading platform.
      </span>

      {/* Skip control */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismissEarly();
          }}
          className="text-xs text-stone-400 hover:text-stone-700 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-stone-200 transition font-medium shadow-2xs"
        >
          Skip
        </button>
      </div>
    </div>
  );
};
