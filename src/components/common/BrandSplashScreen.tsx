import React, { useState, useEffect, useRef } from 'react';
import { VirasatLogoMark } from './TricolourBranding';
import { useLanguage } from '../../contexts/LanguageContext';

interface BrandSplashScreenProps {
  isLoading?: boolean;
  minDurationMs?: number;
  onFinished?: () => void;
}

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({
  isLoading = true,
  minDurationMs = 1100,
  onFinished,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const mountTimeRef = useRef<number>(Date.now());
  const { currentLanguage } = useLanguage();
  const isHi = currentLanguage === 'hi';

  useEffect(() => {
    if (!isLoading) {
      const elapsed = Date.now() - mountTimeRef.current;
      const remaining = Math.max(0, minDurationMs - elapsed);

      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, remaining);

      const unmountTimer = setTimeout(() => {
        setIsVisible(false);
        if (onFinished) onFinished();
      }, remaining + 700);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isLoading, minDurationMs, onFinished]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="virasat-startup-screen"
      role="status"
      aria-label="Virasat: Explore India's Heritage"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5] overflow-hidden select-none cursor-default transition-all duration-700 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-[1.03] filter blur-[2px] pointer-events-none'
          : 'opacity-100 scale-100 filter blur-0'
      }`}
    >
      {/* Indian Cultural Heritage Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/patterns/indian-cultural-pattern.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '360px 360px',
          opacity: 0.35,
          mixBlendMode: 'multiply',
        }}
        aria-hidden="true"
      />
      {/* Soft radial vignette to keep brand emblem prominent */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#FAF8F5]/30 to-[#FAF8F5]/85 pointer-events-none" />

      {/* Main Centered Brand Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm w-full">
        {/* Centered Virasat Logo with Subtle Breathing Aura */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-400/25 via-orange-400/20 to-emerald-400/25 animate-aura-pulse filter blur-md" />
          <div className="absolute -inset-1.5 rounded-full border border-amber-300/40 border-dashed animate-golden-spin" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-2xl ring-2 ring-stone-200/90 flex items-center justify-center p-2 transition-transform duration-500 overflow-hidden animate-logo-breath">
            <VirasatLogoMark className="w-full h-full object-contain" />
          </div>
        </div>

        {/* "VIRASAT" typography */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-[#0B192C] uppercase leading-tight mb-1 pl-1">
          VIRASAT
        </h1>

        {/* Hindi & English Tagline */}
        <p className="text-xs sm:text-sm font-semibold text-amber-950/80 tracking-wide mb-1">
          {isHi ? 'अतुल्य भारत की समृद्ध विरासत' : "Explore India's Living Heritage"}
        </p>
        <p className="text-[11px] text-stone-500 font-medium tracking-wider">
          {isHi ? 'संस्कृति · इतिहास · तीर्थ एवं पर्यटन' : 'Monuments · Culture · Pilgrimages'}
        </p>

        {/* Thin elegant tricolour loading/progress bar */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <div
            className="w-48 sm:w-56 h-[3px] bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner"
            role="progressbar"
            aria-label="Loading..."
          >
            <div
              className="splash-tricolour-bar h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, #FF671F 0%, #FFA040 28%, #FFFFFF 48%, #000080 50%, #FFFFFF 52%, #138808 72%, #046A38 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
