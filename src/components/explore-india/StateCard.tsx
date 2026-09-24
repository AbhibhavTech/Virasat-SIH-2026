import React, { useState } from 'react';
import {
  ArrowRight,
  Heart,
  MapPin,
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
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-900 shrink-0">
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
        <div className="absolute top-3 right-3 z-10">
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

      {/* Card Content Body: Clean, 50% less clutter */}
      <div className="p-4 sm:p-5 flex flex-col justify-between grow space-y-3">
        {/* Short 1-line description */}
        <p className="text-xs text-stone-600 leading-relaxed line-clamp-1 font-normal">
          {state.description || state.heritage_overview}
        </p>

        {/* Popular Destinations: Max 3 */}
        {topTowns.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-800 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Popular Destinations</span>
            </div>
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

        {/* Single Explore Action Button with Orange Font */}
        <div className="pt-2">
          <button
            onClick={() => onSelectState(state.id)}
            className="w-full py-2.5 px-4 rounded-xl bg-orange-50/80 hover:bg-orange-100/90 text-[#FF671F] hover:text-[#e05615] border border-orange-200 hover:border-orange-300 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99] group/btn"
          >
            <span className="text-[#FF671F] font-extrabold">Explore {state.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF671F] transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
