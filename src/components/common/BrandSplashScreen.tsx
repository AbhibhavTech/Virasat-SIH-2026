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
      {/* Very subtle Indian heritage pattern background (Traditional Jali Lattice) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="virasat-subtle-jali"
            x="0"
            y="0"
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            {/* Mughal / Rajput Ashtakon Star & Diamond Jali Lattice */}
            <path
              d="M28 0 L35 21 L56 28 L35 35 L28 56 L21 35 L0 28 L21 21 Z"
              fill="none"
              stroke="#B45309"
              strokeWidth="0.75"
              strokeOpacity="0.045"
            />
            <circle
              cx="28"
              cy="28"
              r="4.5"
              fill="none"
              stroke="#0B192C"
              strokeWidth="0.5"
              strokeOpacity="0.035"
            />
            <path
              d="M0 0 L14 14 M56 0 L42 14 M0 56 L14 42 M56 56 L42 42"
              stroke="#B45309"
              strokeWidth="0.5"
              strokeOpacity="0.03"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#virasat-subtle-jali)" />
      </svg>

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
