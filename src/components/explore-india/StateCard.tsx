import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  Heart,
} from 'lucide-react';
import { StateHierarchyEntity } from '../../types/indiaHierarchy';
import { getCuratedStateImage } from '../../data/stateCuratedImages';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface StateCardProps {
  state: StateHierarchyEntity;
  isUT: boolean;
  isFavorite: boolean;
  onToggleFavorite: (stateId: string) => void;
  onSelectState: (stateId: string) => void;
  onSelectTown: (stateId: string, townId: string) => void;
  onQuickLook?: (state: StateHierarchyEntity) => void;
}

export const StateCard: React.FC<StateCardProps> = ({
  state,
  isUT,
  isFavorite,
  onToggleFavorite,
  onSelectState,
  onSelectTown,
  onQuickLook,
}) => {
  const curated = getCuratedStateImage(state.id, state.hero_image_url);
  const [imageSrc, setImageSrc] = useState(curated.url);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

  const handleImgError = () => {
    if (!hasFailedOnce && imageSrc !== curated.url) {
      setHasFailedOnce(true);
      setImageSrc(curated.url);
    }
  };

  // Maximum 3 destinations per requirement
  const towns = state.cities || [];
  const topTowns = towns.slice(0, 3);

  const { ref, className: revealClass, style: revealStyle } = useScrollReveal<HTMLDivElement>({
    animation: 'fade-up',
    threshold: 0.08,
  });

  return (
    <div
      ref={ref}
      style={revealStyle}
      className={`bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1 ${revealClass}`}
      id={`state-card-${state.id}`}
    >
      {/* Hero Photo Header */}
      <div
        className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-900 shrink-0 cursor-pointer"
        onClick={() => onSelectState(state.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') onSelectState(state.id);
        }}
        role="button"
        tabIndex={0}
        aria-label={`Explore ${state.name}`}
      >
        <img
          src={imageSrc}
          alt={state.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={handleImgError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />

        {/* Top Badges: Clean minimal tags */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-amber-800 font-mono shadow-xs">
            {state.code}
          </span>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-black/50 text-white/90 backdrop-blur-xs">
            {isUT ? 'Union Territory' : state.region}
          </span>
        </div>

        {/* Top Right: Wishlist Heart */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {onQuickLook && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                onQuickLook(state);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 hover:bg-white text-white hover:text-[#FF671F] backdrop-blur-xs transition cursor-pointer shadow-xs"
              title={`Quick look at ${state.name}`}
              aria-label={`Quick look at ${state.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(state.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-xs ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-black/40 hover:bg-black/60 text-white/90 hover:text-white'
            }`}
            title={isFavorite ? 'Remove from Saved Wishlist' : 'Save to Wishlist'}
            aria-label={`Save ${state.name} to wishlist`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Title: State Name */}
        <div className="absolute bottom-3 left-3.5 right-3.5 text-white pointer-events-none">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-xs">
            {state.name}
          </h3>
        </div>
      </div>

      {/* Compact interactive body */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between grow gap-3">
        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 min-h-10">
          {state.description || state.heritage_overview || `Explore the culture and heritage of ${state.name}.`}
        </p>

        {topTowns.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {towns.length} {towns.length === 1 ? 'destination' : 'destinations'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {topTowns.map((city) => (
                <button
                  key={city.id}
                  onClick={() => onSelectTown(state.id, city.id)}
                  className="px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200/80 hover:border-amber-300 text-[11px] font-medium transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  title={`Explore ${city.name}`}
                >
                  <span>{city.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <button
            onClick={() => onSelectState(state.id)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#D94F04] hover:bg-[#B83F00] text-white border border-[#C94700] hover:border-[#A93800] text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99] group/btn"
          >
            <span className="text-white font-extrabold">Explore</span>
            <ArrowRight className="w-3.5 h-3.5 text-white transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
