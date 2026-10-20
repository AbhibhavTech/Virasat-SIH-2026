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
  territoryOnly?: boolean;
}

export const StateCard: React.FC<StateCardProps> = ({
  state,
  isUT,
  isFavorite,
  onToggleFavorite,
  onSelectState,
  onSelectTown,
  onQuickLook,
  territoryOnly = false,
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
  const towns = territoryOnly ? [] : (state.cities || []);
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
        className={`relative h-56 sm:h-64 lg:h-72 w-full overflow-hidden bg-stone-900 shrink-0 ${territoryOnly ? '' : 'cursor-pointer'}`}
        onClick={territoryOnly ? undefined : () => onSelectState(state.id)}
        onKeyDown={territoryOnly ? undefined : (event) => {
          if (event.key === 'Enter' || event.key === ' ') onSelectState(state.id);
        }}
        role={territoryOnly ? undefined : 'button'}
        tabIndex={territoryOnly ? undefined : 0}
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
          {!territoryOnly && onQuickLook && (
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
          <h3 className="font-serif text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
            {state.name}
          </h3>
        </div>
      </div>

      {/* Compact interactive body */}
      <div className="p-4 sm:p-5 flex flex-col justify-between grow gap-3.5">
        <p className="text-sm text-stone-700 leading-relaxed line-clamp-2 min-h-11">
          {state.description || state.heritage_overview || `Explore the culture and heritage of ${state.name}.`}
        </p>

        {territoryOnly ? (
          <div className="text-xs text-stone-600">
            <span className="font-semibold text-stone-800">Capital:</span> {state.capital || 'Not listed'}
          </div>
        ) : topTowns.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {towns.length} {towns.length === 1 ? 'destination' : 'destinations'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {topTowns.map((city) => (
                <button
                  key={city.id}
                  onClick={() => onSelectTown(state.id, city.id)}
                  className="px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200/80 hover:border-amber-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
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
            className="w-full py-3 px-5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white border border-[#E65100] hover:border-[#C94D0A] text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99] group/btn"
          >
            <span className="text-white font-black">Explore</span>
            <ArrowRight className="w-4 h-4 text-white transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
