import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Landmark,
  Calendar,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  ExternalLink,
  Heart,
  Camera,
  Layers,
} from 'lucide-react';
import { StateHierarchyEntity } from '../../types/indiaHierarchy';

interface StateQuickLookModalProps {
  state: StateHierarchyEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onExploreState: (stateId: string) => void;
  onSelectTown: (stateId: string, townId: string) => void;
  onOpenAIPlan?: (stateName: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (stateId: string) => void;
}

export const StateQuickLookModal: React.FC<StateQuickLookModalProps> = ({
  state,
  isOpen,
  onClose,
  onExploreState,
  onSelectTown,
  onOpenAIPlan,
  isFavorite = false,
  onToggleFavorite,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !state) return null;

  const isUT = state.region_type === 'union_territory';
  const towns = state.cities || [];
  
  // Estimate total attractions
  const totalAttractions = towns.reduce((acc, c) => {
    const count =
      (c.heritage?.length || 0) +
      (c.monuments?.length || 0) +
      (c.museums?.length || 0) +
      (c.tourist_places?.length || 0) +
      (c.religious_cultural?.length || 0) +
      (c.nature_parks_zoo?.length || 0);
    return acc + count;
  }, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EFE8DF] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-900 shrink-0 overflow-hidden">
          <img
            src={state.hero_image_url}
            alt={state.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Badges */}
          <div className="absolute top-3.5 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#FF671F] font-mono shadow-xs">
              {state.code}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/50 text-white backdrop-blur-xs">
              {isUT ? 'Union Territory' : state.region}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white backdrop-blur-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Entity</span>
            </span>
          </div>

          {/* Photo Credit */}
          {state.creator && (
            <div className="absolute bottom-3 right-4 text-[10px] text-white/80 bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
              <Camera className="w-3 h-3" />
              <span>{state.creator}</span>
            </div>
          )}

          {/* Bottom Title & Details */}
          <div className="absolute bottom-3 left-4 right-20 text-white pointer-events-none">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-xs">
              {state.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-200 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Capital: <strong className="text-white">{state.capital}</strong></span>
              <span className="opacity-60">•</span>
              <span>{towns.length} Documented Towns</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 grow">
          {/* Heritage Overview */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
              <Compass className="w-3 h-3" />
              <span>Heritage Essence</span>
            </span>
            <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed">
              {state.description || state.heritage_overview}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-center">
              <div className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider">
                Towns & Hubs
              </div>
              <div className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                {towns.length}
              </div>
              <div className="text-[10px] text-stone-500">Verified locations</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-center">
              <div className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider">
                Heritage Sites
              </div>
              <div className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
                {totalAttractions > 0 ? totalAttractions : state.total_attractions || '12+'}
              </div>
              <div className="text-[10px] text-stone-500">Monuments & parks</div>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] text-center">
              <div className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider">
                Best Season
              </div>
              <div className="font-serif text-xs sm:text-sm font-bold text-stone-900 mt-1 truncate">
                {towns[0]?.live_travel_info?.best_season || 'Oct - Mar'}
              </div>
              <div className="text-[10px] text-stone-500">Ideal weather</div>
            </div>
          </div>

          {/* Interactive Towns Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
                <Landmark className="w-3 h-3" />
                <span>Verified Destinations ({towns.length})</span>
              </span>
              <span className="text-[10px] text-stone-400">Click any destination to explore</span>
            </div>

            {towns.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {towns.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onClose();
                      onSelectTown(state.id, city.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#FF671F] text-[#4A3E36] hover:text-white border border-[#EFE8DF] hover:border-[#FF671F] text-xs font-semibold transition cursor-pointer flex items-center gap-1 group/chip shadow-2xs"
                  >
                    <span>{city.name}</span>
                    <ArrowRight className="w-3 h-3 text-stone-400 group-hover/chip:text-white transition-transform group-hover/chip:translate-x-0.5" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">Field verification ongoing for towns.</p>
            )}
          </div>

          {/* Cultural Stories if any */}
          {state.active_stories && state.active_stories.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-[#EFE8DF]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F]">
                Cultural Traditions &amp; Stories
              </span>
              <ul className="space-y-1.5 text-xs text-[#5A4E46]">
                {state.active_stories.slice(0, 3).map((story, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F] shrink-0 mt-1.5" />
                    <span>{story}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Official Tourism Link */}
          {state.official_tourism_url && (
            <div className="pt-2 border-t border-[#EFE8DF] flex items-center justify-between text-xs">
              <span className="text-stone-500">Government Portal:</span>
              <a
                href={state.official_tourism_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#046A38] hover:text-[#03542C] font-semibold inline-flex items-center gap-1 underline text-xs"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit Official State Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-t border-[#EFE8DF] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(state.id)}
                className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                    : 'bg-white border-[#EFE8DF] text-stone-600 hover:text-rose-600'
                }`}
                title={isFavorite ? 'Remove from Saved Wishlist' : 'Save to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Wishlist'}</span>
              </button>
            )}

            {onOpenAIPlan && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAIPlan(state.name);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-[#FF671F] border border-[#EFE8DF] hover:border-[#FF671F] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>Ask AI Concierge</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onExploreState(state.id);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-98"
          >
            <Layers className="w-4 h-4" />
            <span>Explore All {state.name} Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
