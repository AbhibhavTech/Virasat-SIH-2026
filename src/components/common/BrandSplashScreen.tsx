import React, { useState, useEffect, useRef } from 'react';
import { VirasatLogoMark } from './TricolourBranding';

interface BrandSplashScreenProps {
  isLoading?: boolean;
  minDurationMs?: number;
  onFinished?: () => void;
}

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({
  isLoading = true,
  minDurationMs = 1200,
  onFinished,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const mountTimeRef = useRef<number>(Date.now());

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
      }, remaining + 500);

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
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5] overflow-hidden select-none cursor-default transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
        {/* Centered Virasat Logo */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border border-[#EFE8DF] shadow-[0_4px_20px_-2px_rgba(180,83,9,0.06)] flex items-center justify-center p-2 mb-4 transition-transform duration-300">
          <VirasatLogoMark size={48} className="drop-shadow-xs" />
        </div>

        {/* "VIRASAT" below logo */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-[#0B192C] uppercase leading-tight mb-1.5 pl-1">
          VIRASAT
        </h1>

        {/* Tagline: "Explore India's Heritage" */}
        <p className="text-xs sm:text-sm font-medium text-stone-500 tracking-wider">
          Explore India&apos;s Heritage
        </p>

        {/* Thin elegant tricolour loading/progress bar */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <div
            className="w-44 sm:w-52 h-[3px] bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner"
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
