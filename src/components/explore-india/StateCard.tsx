import React, { useState } from 'react';
import {
  MapPin,
  Landmark,
  ArrowRight,
  Heart,
  Eye,
  Camera,
  Compass,
  Calendar,
  Sparkles,
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
  onQuickLook: (state: StateHierarchyEntity) => void;
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

  const towns = state.cities || [];
  const topTowns = towns.slice(0, 3);
  const remainingCount = towns.length - topTowns.length;

  const { ref, className: revealClass, style: revealStyle } = useScrollReveal<HTMLDivElement>({
    animation: 'fade-up',
    threshold: 0.08,
  });

  return (
    <div
      ref={ref}
      style={revealStyle}
      className={`bg-white rounded-3xl border border-[#EFE8DF] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1 ${revealClass}`}
      id={`state-card-${state.id}`}
    >
      {/* Hero Photo Header */}
      <div className="relative h-52 w-full overflow-hidden bg-stone-900 shrink-0">
        <img
          src={imageSrc}
          alt={state.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={handleImgError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20 pointer-events-none" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-[#FF671F] backdrop-blur-xs font-mono shadow-xs">
            {state.code}
          </span>
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-xs">
            {isUT ? 'Union Territory' : state.region}
          </span>
        </div>

        {/* Top Right: Heart (Wishlist) & Quick Look */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
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

        {/* Iconic Landmark Tag */}
        {curated.landmark && (
          <div className="absolute top-12 left-3 right-3 pointer-events-none">
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-500/90 text-stone-900 font-semibold backdrop-blur-xs max-w-full truncate shadow-2xs">
              <Sparkles className="w-3 h-3 shrink-0 text-stone-900" />
              <span className="truncate">{curated.landmark}</span>
            </span>
          </div>
        )}

        {/* Photographic Provenance Badge */}
        {curated.creator && (
          <div
            className="absolute bottom-12 right-3 text-[9px] px-2 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-xs font-mono truncate max-w-[150px]"
            title={`Photo: ${curated.creator}`}
          >
            📷 {curated.creator}
          </div>
        )}

        {/* Bottom Title & Capital */}
        <div className="absolute bottom-3 left-4 right-4 text-white pointer-events-none">
          <h3 className="font-serif text-xl font-bold text-white tracking-tight drop-shadow-xs">
            {state.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-stone-200 mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-300" />
              <span>Capital: <strong>{state.capital}</strong></span>
            </span>
            <span className="opacity-60">•</span>
            <span className="flex items-center gap-1 text-amber-200">
              <Calendar className="w-3 h-3" />
              <span>{curated.bestSeason}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col justify-between grow space-y-4">
        {/* Description */}
        <p className="text-xs text-[#5A4E46] leading-relaxed line-clamp-2">
          {state.description || state.heritage_overview}
        </p>

        {/* Interactive Verified Towns & Local Discovery Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#FF671F]">
            <span className="flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              <span>Key Destinations ({towns.length})</span>
            </span>
            <span className="text-[9px] text-stone-400 lowercase font-normal">click to explore town</span>
          </div>

          {towns.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {topTowns.map((city) => (
                <button
                  key={city.id}
                  onClick={() => onSelectTown(state.id, city.id)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#FF671F] text-[#4A3E36] hover:text-white border border-[#EFE8DF] hover:border-[#FF671F] text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 group/chip shadow-2xs"
                  title={`Directly explore ${city.name}`}
                >
                  <span>{city.name}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-50 group-hover/chip:opacity-100 transition-opacity" />
                </button>
              ))}

              {remainingCount > 0 && (
                <button
                  onClick={() => onSelectState(state.id)}
                  className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-medium transition cursor-pointer"
                  title={`View all ${towns.length} towns in ${state.name}`}
                >
                  +{remainingCount} more
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-stone-400 italic">
              Field verification ongoing — 0 towns recorded
            </p>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 flex items-center gap-2">
          {/* Quick Look preview button */}
          <button
            onClick={() => onQuickLook(state)}
            className="py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE5] border border-[#EFE8DF] text-stone-700 hover:text-[#0B192C] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title={`Quick preview of ${state.name}`}
          >
            <Eye className="w-3.5 h-3.5 text-[#FF671F]" />
            <span className="hidden sm:inline">Quick Look</span>
          </button>

          {/* Full Explore button */}
          <button
            onClick={() => onSelectState(state.id)}
            className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
          >
            <span>Explore {state.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
