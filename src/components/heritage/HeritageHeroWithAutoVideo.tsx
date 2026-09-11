import React, { useEffect, useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Compass,
  MapPin,
} from 'lucide-react';
import {
  HERITAGE_BACKGROUND_VIDEOS,
  HeritageBackgroundVideo,
} from './HeritageBackgroundVideoManager';

interface HeritageHeroWithAutoVideoProps {
  totalMonumentsCount: number;
  visitedCount: number;
  loading: boolean;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onFilterByLocation?: (loc: string) => void;
}

export const HeritageHeroWithAutoVideo: React.FC<HeritageHeroWithAutoVideoProps> = ({
  totalMonumentsCount,
  visitedCount,
  loading,
  currentIndex,
  onIndexChange,
  isPlaying,
  onTogglePlay,
  onFilterByLocation,
}) => {
  const activeVideo: HeritageBackgroundVideo =
    HERITAGE_BACKGROUND_VIDEOS[currentIndex] || HERITAGE_BACKGROUND_VIDEOS[0];

  // Animated progress bar that fills over 14 seconds for auto-move
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }
    const interval = 100;
    const totalDuration = 14000;
    const step = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    onIndexChange((currentIndex + 1) % HERITAGE_BACKGROUND_VIDEOS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    onIndexChange(
      (currentIndex - 1 + HERITAGE_BACKGROUND_VIDEOS.length) %
        HERITAGE_BACKGROUND_VIDEOS.length
    );
    setProgress(0);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/75 backdrop-blur-md text-stone-900 p-6 sm:p-10 shadow-lg border border-white/60">
      {/* Subtle tricolour ribbon strip at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]" />

      {/* Auto-advancing video progress bar right underneath the ribbon */}
      <div className="absolute top-1 left-0 right-0 h-1 bg-stone-100/60">
        <div
          className="h-full bg-gradient-to-r from-[#FF671F] to-[#046A38] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Column: Heritage Catalog Title and Curatorial Highlights */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/90 text-orange-900 border border-orange-200/80 text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Catalogued ASI & UNESCO Heritage Records</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-[#0B192C]">
            Major Monuments, Famous Tourist Places & Iconic Heritage
          </h1>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
            Curated catalog of India&apos;s most celebrated monuments, world-renowned heritage sanctuaries, and iconic tourist attractions. Background video gallery of India&apos;s Union Territories and festivals auto-plays continuously at 0.5x speed as you scroll through the entire heritage catalog.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-700 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#046A38]"></span>
              <span>{loading ? '...' : totalMonumentsCount} Verified Monuments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF671F]"></span>
              <span>UNESCO World Heritage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#000080]"></span>
              <span>0.5x Ambient Video Scrolling</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-50/90 text-orange-900 border border-orange-200 font-bold backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Visited: {visitedCount} / {totalMonumentsCount}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sleek Current Video Widget & Auto-Move Controls */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-white/70 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-pulse" />
              {activeVideo.category}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition cursor-pointer"
                title="Previous video"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onTogglePlay}
                className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition cursor-pointer"
                title={isPlaying ? 'Pause Auto Video' : 'Resume Auto Video'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#046A38]" />}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition cursor-pointer"
                title="Next video"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-900 line-clamp-1">
              {activeVideo.shortTitle}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#FF671F] flex-shrink-0" />
              <span className="truncate">{activeVideo.location}</span>
            </div>
            <p className="text-[12px] text-stone-600 leading-snug line-clamp-2 pt-1 font-sans">
              {activeVideo.description}
            </p>
          </div>

          {onFilterByLocation && activeVideo.category === 'Union Territory' && (
            <button
              type="button"
              onClick={() => onFilterByLocation(activeVideo.stateOrUT.replace(' (UT)', ''))}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-orange-50 text-[#FF671F] border border-orange-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore {activeVideo.stateOrUT} in Catalog</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
