import React from 'react';

export type HeritageCategoryType = 'fort' | 'cave' | 'beach' | 'temple' | 'nature' | 'museum' | 'market' | 'default';

interface CategoryIllustrationProps {
  category: HeritageCategoryType | string;
  placeName?: string;
  className?: string;
}

export const HeritageCategoryIllustration: React.FC<CategoryIllustrationProps> = ({
  category,
  placeName,
  className = 'w-full h-full'
}) => {
  const normalized = (category || 'default').toLowerCase();

  const getIllustrationDetails = () => {
    if (normalized.includes('fort') || normalized.includes('citadel')) {
      return {
        label: 'Historic Fort & Bastion',
        color: '#78350F', // deep amber/stone
        icon: (
          <path
            d="M3 21h18M5 21V9l2-2 2 2 2-2 2 2 2-2 2 2 2-2v12M9 13h2v4H9v-4zm4 0h2v4h-2v-4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      };
    }
    if (normalized.includes('cave') || normalized.includes('rock-cut')) {
      return {
        label: 'Rock-Cut Cave Sanctuary',
        color: '#44403C', // warm basalt
        icon: (
          <path
            d="M4 21h16M4 21c0-8 3.5-14 8-14s8 6 8 14M9 21v-6c0-1.7 1.3-3 3-3s3 1.3 3 3v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      };
    }
    if (normalized.includes('beach') || normalized.includes('sea') || normalized.includes('coast') || normalized.includes('water')) {
      return {
        label: 'Coastal Marine Landscape',
        color: '#0E7490', // cyan/ocean
        icon: (
          <path
            d="M2 12c3-2 6 2 10 0s6-2 10 0M2 17c3-2 6 2 10 0s6-2 10 0M12 3v3M12 9a3 3 0 100-6 3 3 0 000 6z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      };
    }
    if (normalized.includes('temple') || normalized.includes('sacred') || normalized.includes('tank') || normalized.includes('shrine')) {
      return {
        label: 'Sacred Sanctum & Water Tank',
        color: '#B45309', // terracotta saffron
        icon: (
          <path
            d="M12 2L4 8h16l-8-6zm-6 6v13m12-13v13M9 14h6v7H9v-7zM2 21h20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      };
    }
    if (normalized.includes('nature') || normalized.includes('park') || normalized.includes('forest') || normalized.includes('wildlife')) {
      return {
        label: 'Natural Forest & Wildlife Haven',
        color: '#15803D', // emerald forest
        icon: (
          <path
            d="M12 2L6 10h3l-4 6h14l-4-6h3L12 2zm0 14v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      };
    }
    if (normalized.includes('museum') || normalized.includes('gallery') || normalized.includes('art')) {
      return {
        label: 'Museum & Cultural Repository',
        color: '#1D4ED8', // cobalt royal
        icon: (
          <path
            d="M3 21h18M4 10h16M4 10l8-6 8 6M6 10v8m4-8v8m4-8v8m4-8v8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      };
    }
    if (normalized.includes('village') || normalized.includes('hamlet') || normalized.includes('dock') || normalized.includes('market') || normalized.includes('settlement')) {
      return {
        label: 'Living Heritage Hamlet & Streetscape',
        color: '#9A3412', // warm rustic brick
        icon: (
          <path
            d="M3 21h18M4 21V10l6-5 6 5v11M9 21v-5h2v5m4-11h2v3h-2zm-8 0h2v3H7z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      };
    }

    return {
      label: 'Heritage Monument',
      color: '#475569', // slate
      icon: (
        <path
          d="M12 3v18M5 8l7-5 7 5M5 8v13h14V8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )
    };
  };

  const details = getIllustrationDetails();

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-stone-900 overflow-hidden select-none ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 100%)`
      }}
      role="img"
      aria-label={`Illustration placeholder for ${placeName || details.label}`}
    >
      {/* Delicate background decorative grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Center Architectural Icon */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg text-white"
          style={{ backgroundColor: details.color }}
        >
          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24">
            {details.icon}
          </svg>
        </div>

        <div>
          <div className="text-sm font-semibold text-stone-200 tracking-wide font-serif">
            {placeName || details.label}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {details.label}
          </div>
        </div>

        {/* Unambiguous, clear badge as required by Step 6 */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Illustration Placeholder
        </div>
      </div>

      {/* Discrete bottom disclaimer note */}
      <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-stone-500 font-mono tracking-tight">
        Authentic photographic record under peer verification
      </div>
    </div>
  );
};
