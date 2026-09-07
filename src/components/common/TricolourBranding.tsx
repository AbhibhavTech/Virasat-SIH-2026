import React from 'react';

/**
 * Virasat Temple / Gateway Arch Emblem
 * Handcrafted vector honoring traditional Indian architectural arches (Torana / Jharokha)
 * with a luminous tricolour gradient (Saffron #FF671F to India Green #046A38) and subtle gold highlight.
 */
export const VirasatLogoMark: React.FC<{ className?: string; size?: number }> = ({ className = 'w-9 h-9', size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={size ? { width: size, height: size } : undefined}
    className={`${className} shrink-0 select-none`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="virasatArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF671F" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#046A38" />
      </linearGradient>
      <linearGradient id="goldKalash" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#FF671F" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Outer Temple Shikhara / Torana Arch */}
    <path
      d="M24 4 L28 10 L38 15 L38 42 L10 42 L10 15 L20 10 Z"
      fill="url(#virasatArchGrad)"
      filter="url(#softGlow)"
    />

    {/* Crown Kalash Finial */}
    <circle cx="24" cy="5" r="2.2" fill="url(#goldKalash)" />
    <path d="M24 2 L24 4.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

    {/* Stepped Architectural Details */}
    <rect x="13" y="14" width="22" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
    <rect x="15" y="18" width="18" height="1.8" rx="0.8" fill="#FDE68A" opacity="0.95" />

    {/* Inner Traditional Arch Doorway (Cusped Arch) */}
    <path
      d="M17 42 L17 28 C17 23, 21 21, 24 21 C27 21, 31 23, 31 28 L31 42 Z"
      fill="#FFFFFF"
    />
    <path
      d="M19 42 L19 29 C19 25, 21.5 23.5, 24 23.5 C26.5 23.5, 29 25, 29 29 L29 42 Z"
      fill="#FAF8F5"
    />

    {/* Micro Ashoka Chakra in Center Doorway */}
    <circle cx="24" cy="30" r="3.2" stroke="#000080" strokeWidth="0.8" fill="none" opacity="0.85" />
    <circle cx="24" cy="30" r="0.8" fill="#000080" />
    {/* 8 representative spokes */}
    <path d="M24 27 L24 33 M21 30 L27 30 M22 28 L26 32 M22 32 L26 28" stroke="#000080" strokeWidth="0.5" opacity="0.75" />

    {/* Stepped Base Pedestal */}
    <rect x="7" y="42" width="34" height="2.5" rx="1.2" fill="#046A38" />
  </svg>
);

/**
 * Complete Virasat Brand Component (Logo Mark + Serif Typography + Subtitle)
 */
export const VirasatBrand: React.FC<{
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}> = ({ onClick, size = 'md', variant = 'light' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 text-left group select-none ${
        onClick ? 'cursor-pointer focus:outline-none' : ''
      }`}
    >
      <div
        className={`${
          isSm ? 'w-8 h-8' : isLg ? 'w-11 h-11' : 'w-10 h-10'
        } rounded-xl bg-white border border-[#EFE8DF] shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform duration-200 p-1`}
      >
        <VirasatLogoMark className={isSm ? 'w-7 h-7' : isLg ? 'w-9 h-9' : 'w-8 h-8'} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif font-bold tracking-tight leading-tight ${
              isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl'
            } ${variant === 'dark' ? 'text-white' : 'text-[#0B192C]'}`}
          >
            Virasat
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#FF671F]" />
        </div>
        <span
          className={`text-[10px] font-medium tracking-tight ${
            variant === 'dark' ? 'text-stone-300' : 'text-stone-500'
          }`}
        >
          Explore India&apos;s Heritage
        </span>
      </div>
    </div>
  );
};

/**
 * Authentic 24-Spoke Ashoka Chakra SVG
 * Perfect mathematical vector with exact 24 rays, hub, and outer ring
 */
export const AshokaChakra: React.FC<{
  className?: string;
  color?: string;
  size?: number;
  opacity?: number;
  spinning?: boolean;
}> = ({ className = '', color = '#000080', size = 240, opacity = 0.12, spinning = false }) => {
  // Generate 24 spokes at 15-degree increments
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180;
    const x2 = 100 + 78 * Math.cos(angle);
    const y2 = 100 + 78 * Math.sin(angle);
    return <line key={i} x1="100" y1="100" x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />;
  });

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`${className} ${spinning ? 'animate-spin-slow' : ''} select-none pointer-events-none`}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer Ring */}
      <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="5.5" fill="none" />
      <circle cx="100" cy="100" r="80" stroke={color} strokeWidth="1.5" fill="none" />

      {/* 24 Micro beads on outer perimeter */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = ((i * 15 + 7.5) * Math.PI) / 180;
        const bx = 100 + 84 * Math.cos(angle);
        const by = 100 + 84 * Math.sin(angle);
        return <circle key={`bead-${i}`} cx={bx} cy={by} r="1.6" fill={color} />;
      })}

      {/* Spokes */}
      {spokes}

      {/* Central Hub */}
      <circle cx="100" cy="100" r="16" fill={color} />
      <circle cx="100" cy="100" r="6" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * Flowing Indian Tricolour Ribbon Vector
 * Saffron, White, and India Green sweeping banner
 */
export const FlowingTricolourRibbon: React.FC<{
  className?: string;
  variant?: 'hero' | 'footer' | 'accent';
}> = ({ className = '', variant = 'hero' }) => {
  if (variant === 'footer') {
    return (
      <svg
        viewBox="0 0 1200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-auto select-none pointer-events-none ${className}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 80 C300 20, 600 110, 1200 40 L1200 60 C600 130, 300 40, 0 100 Z"
          fill="#FF671F"
          opacity="0.85"
        />
        <path
          d="M0 90 C300 30, 600 120, 1200 50 L1200 70 C600 140, 300 50, 0 110 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        <path
          d="M0 100 C300 40, 600 130, 1200 60 L1200 80 C600 150, 300 60, 0 120 Z"
          fill="#046A38"
          opacity="0.85"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 900 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full select-none pointer-events-none ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="saffronFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF671F" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#FFA040" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF671F" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="greenFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#046A38" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#138808" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#046A38" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Saffron Wave */}
      <path
        d="M-50 220 C200 120, 420 310, 750 140 C820 100, 890 120, 950 160 L950 200 C890 160, 820 140, 750 180 C420 350, 200 160, -50 260 Z"
        fill="url(#saffronFlow)"
      />

      {/* White / Light Ivory Wave */}
      <path
        d="M-50 250 C200 150, 420 340, 750 170 C820 130, 890 150, 950 190 L950 230 C890 190, 820 170, 750 210 C420 380, 200 190, -50 290 Z"
        fill="#FFFFFF"
        opacity="0.95"
      />

      {/* India Green Wave */}
      <path
        d="M-50 280 C200 180, 420 370, 750 200 C820 160, 890 180, 950 220 L950 260 C890 220, 820 200, 750 240 C420 410, 200 220, -50 320 Z"
        fill="url(#greenFlow)"
      />
    </svg>
  );
};

/**
 * Indian Heritage Skyline Silhouette
 * Featuring iconic monuments: Taj Mahal, India Gate, Qutub Minar, Gateway of India, Konark, Lotus Temple
 */
export const HeritageSkylineSilhouette: React.FC<{
  className?: string;
  fillColor?: string;
  opacity?: number;
}> = ({ className = 'w-full h-16 sm:h-20', fillColor = '#CBD5E1', opacity = 0.35 }) => (
  <svg
    viewBox="0 0 1200 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} select-none pointer-events-none`}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="
        M0 140
        L0 125
        L30 125 L35 110 L45 110 L50 125
        L70 125
        /* Qutub Minar silhouette */
        L90 125 L92 40 L97 25 L99 15 L101 25 L106 40 L108 125
        L130 125
        /* Gateway of India silhouette */
        L145 125 L145 80 L155 75 L165 75 L165 65 L175 60 L185 65 L185 75 L195 75 L205 80 L205 125
        L235 125
        /* Stepwell / Havelis */
        L250 125 L250 100 L265 95 L280 100 L280 125
        L310 125
        /* Red Fort / Citadel bastions */
        L325 125 L325 90 L335 85 L345 90 L355 85 L365 90 L375 85 L385 90 L385 125
        L415 125
        /* India Gate Arch */
        L430 125 L430 65 L445 60 L460 60 L470 50 L490 50 L500 60 L515 60 L530 65 L530 125
        L560 125
        /* Sanchi Stupa Dome */
        L580 125 L580 100 C580 80, 620 80, 620 100 L620 125
        L645 125
        /* Taj Mahal Silhouette */
        /* Left Minaret */
        L660 125 L662 45 L665 35 L668 45 L670 125
        L685 125
        /* Left Domelet */
        L695 125 L695 85 C695 75, 705 75, 705 85 L705 125
        /* Central Grand Dome */
        L715 125 L715 80 C715 50, 745 35, 755 20 C765 35, 795 50, 795 80 L795 125
        /* Right Domelet */
        L805 125 L805 85 C805 75, 815 75, 815 85 L815 125
        L830 125
        /* Right Minaret */
        L840 125 L842 45 L845 35 L848 45 L850 125
        L880 125
        /* Hampi / Vijayanagara Chariot Tower */
        L900 125 L905 85 L915 70 L925 70 L935 85 L940 125
        L970 125
        /* Konark Kalinga Temple Shikhara */
        L990 125 L995 80 L1005 50 L1010 35 L1015 50 L1025 80 L1030 125
        L1060 125
        /* Lotus Temple Petals */
        L1080 125 C1090 90, 1105 80, 1115 70 C1125 80, 1140 90, 1150 125
        L1180 125
        L1200 125
        L1200 140
        Z
      "
      fill={fillColor}
      style={{ opacity }}
    />
  </svg>
);

/**
 * Top Hairline Tricolour Accent Line
 */
export const TricolourTopBar: React.FC = () => (
  <div className="w-full h-[3px] bg-gradient-to-r from-[#FF671F] via-white via-50% to-[#046A38]" />
);

/**
 * Official Incredible India Badge
 */
export const IncredibleIndiaBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#EFE8DF] shadow-2xs text-[11px] font-bold text-[#0B192C] tracking-wide uppercase ${className}`}
  >
    <span className="w-2 h-2 rounded-full bg-[#FF671F]" />
    <span className="text-[#FF671F]">✦</span>
    <span className="text-[#0B192C]">Incredible</span>
    <span className="text-[#046A38]">India</span>
  </div>
);

/**
 * Regional Architectural Icons (North, South, East, West, Central, Northeast)
 */
export const NorthIndiaIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10 text-[#FF671F]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Red Fort / Taj Mahal inspired northern monumental arches & central dome */}
    <path d="M32 6 C28 12, 23 16, 23 23 L41 23 C41 16, 36 12, 32 6 Z" />
    <circle cx="32" cy="4" r="1.5" />
    <rect x="22" y="24" width="20" height="4" rx="1" />
    {/* Side chhatris */}
    <path d="M12 18 C10 21, 8 23, 8 26 L16 26 C16 23, 14 21, 12 18 Z" />
    <rect x="7" y="26" width="10" height="2" />
    <path d="M52 18 C50 21, 48 23, 48 26 L56 26 C56 23, 54 21, 52 18 Z" />
    <rect x="47" y="26" width="10" height="2" />
    {/* Wall ramparts with crenellations */}
    <path d="M4 29 L60 29 L60 56 L4 56 Z" />
    {/* Arched doorways cut out */}
    <path d="M26 56 L26 42 C26 38, 29 36, 32 36 C35 36, 38 38, 38 42 L38 56 Z" fill="#FFF6ED" />
    <path d="M12 56 L12 46 C12 43, 14 41, 16 41 C18 41, 20 43, 20 46 L20 56 Z" fill="#FFF6ED" />
    <path d="M44 56 L44 46 C44 43, 46 41, 48 41 C50 41, 52 43, 52 46 L52 56 Z" fill="#FFF6ED" />
    <rect x="2" y="56" width="60" height="4" rx="1" />
  </svg>
);

export const SouthIndiaIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10 text-[#046A38]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Stepped Dravidian Gopuram Tower */}
    <circle cx="32" cy="5" r="1.5" />
    <circle cx="27" cy="6" r="1.2" />
    <circle cx="37" cy="6" r="1.2" />
    <path d="M25 8 L39 8 L37 14 L27 14 Z" />
    <rect x="23" y="14" width="18" height="3" rx="0.5" />
    <path d="M21 17 L43 17 L40 25 L24 25 Z" />
    <rect x="19" y="25" width="26" height="3" rx="0.5" />
    <path d="M17 28 L47 28 L44 38 L20 38 Z" />
    <rect x="15" y="38" width="34" height="3" rx="0.5" />
    <path d="M13 41 L51 41 L53 56 L11 56 Z" />
    {/* Traditional Tall Gopuram Entrance Doorway */}
    <path d="M27 56 L27 45 C27 43, 30 42, 32 42 C34 42, 37 43, 37 45 L37 56 Z" fill="#F0F8F3" />
    <rect x="8" y="56" width="48" height="4" rx="1" />
  </svg>
);

export const EastIndiaIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10 text-[#0284C7]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Howrah Bridge Cantilever Truss Silhouette & River Wave */}
    <path d="M6 52 L12 24 L18 24 L22 52 Z" />
    <path d="M58 52 L52 24 L46 24 L42 52 Z" />
    {/* Horizontal girder */}
    <rect x="12" y="24" width="40" height="3" rx="0.5" />
    {/* Cantilever diagonals */}
    <path d="M16 27 L32 40 L48 27" stroke="currentColor" strokeWidth="2.5" fill="none" />
    <path d="M14 42 L32 30 L50 42" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="4" y="50" width="56" height="4" rx="1" />
    {/* Flowing Hooghly River water underneath */}
    <path d="M4 57 C14 55, 22 59, 32 57 C42 55, 50 59, 60 57 L60 61 L4 61 Z" fill="#CCE4F8" />
  </svg>
);

export const WestIndiaIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10 text-[#EA580C]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Gateway of India / Western Basalt Portal */}
    {/* Main central arch and side towers */}
    <path d="M10 20 L20 20 L20 56 L10 56 Z" />
    <path d="M44 20 L54 20 L54 56 L44 56 Z" />
    {/* Corner minarets/domes */}
    <path d="M12 14 C12 11, 15 9, 15 7 C15 9, 18 11, 18 14 Z" />
    <path d="M46 14 C46 11, 49 9, 49 7 C49 9, 52 11, 52 14 Z" />
    <rect x="8" y="16" width="48" height="4" rx="1" />
    {/* Central Hall Roof with Indo-Saracenic Dome */}
    <path d="M22 20 L42 20 L42 56 L22 56 Z" />
    <path d="M26 16 C26 11, 32 9, 32 7 C32 9, 38 11, 38 16 Z" />
    {/* Main arched portal cut out */}
    <path d="M26 56 L26 34 C26 28, 30 25, 32 25 C34 25, 38 28, 38 34 L38 56 Z" fill="#FFF4EC" />
    {/* Side arches */}
    <path d="M13 56 L13 42 C13 39, 15 37, 17 37 C19 37, 21 39, 21 42 L21 56 Z" fill="#FFF4EC" />
    <path d="M43 56 L43 42 C43 39, 45 37, 47 37 C49 37, 51 39, 51 42 L51 56 Z" fill="#FFF4EC" />
    <rect x="6" y="56" width="52" height="4" rx="1" />
  </svg>
);

export const CentralIndiaIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10 text-[#059669]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Great Sanchi Stupa Dome & Harmika with Chhatra umbrellas */}
    <circle cx="32" cy="7" r="1.5" />
    <line x1="32" y1="7" x2="32" y2="17" stroke="currentColor" strokeWidth="1.8" />
    <line x1="28" y1="10" x2="36" y2="10" stroke="currentColor" strokeWidth="1.8" />
    <line x1="26" y1="13" x2="38" y2="13" stroke="currentColor" strokeWidth="1.8" />
    <rect x="28" y="16" width="8" height="4" rx="0.5" />
    {/* Semi-hemispherical Anda Dome */}
    <path d="M12 46 C12 25, 20 20, 32 20 C44 20, 52 25, 52 46 Z" />
    {/* Medhi terrace and balustrades */}
    <rect x="8" y="46" width="48" height="5" rx="1" />
    <rect x="6" y="53" width="52" height="4" rx="1" />
    {/* Torana gateway pillars */}
    <rect x="18" y="44" width="2" height="13" fill="#EEF8F5" />
    <rect x="44" y="44" width="2" height="13" fill="#EEF8F5" />
  </svg>
);

export const NortheastIndiaIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10 text-[#3B82F6]' }) => (
  <svg viewBox="0 0 64 64" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Himalayan Monastery Pagoda & Golden Finial */}
    <circle cx="32" cy="6" r="2" />
    <path d="M32 9 L32 14" stroke="currentColor" strokeWidth="2" />
    {/* Top Curved Eaves */}
    <path d="M22 18 C26 16, 38 16, 42 18 L39 14 L25 14 Z" />
    <rect x="26" y="18" width="12" height="6" />
    {/* Middle Curved Eaves */}
    <path d="M15 28 C22 25, 42 25, 49 28 L46 24 L18 24 Z" />
    <rect x="20" y="28" width="24" height="8" />
    {/* Main Grand Eaves */}
    <path d="M8 40 C18 36, 46 36, 56 40 L52 35 L12 35 Z" />
    <rect x="14" y="40" width="36" height="16" />
    {/* Windows & Doors */}
    <rect x="28" y="46" width="8" height="10" rx="1" fill="#F0F4FC" />
    <rect x="18" y="44" width="5" height="5" rx="0.5" fill="#F0F4FC" />
    <rect x="41" y="44" width="5" height="5" rx="0.5" fill="#F0F4FC" />
    <rect x="6" y="56" width="52" height="4" rx="1" />
  </svg>
);

/**
 * Illustrated Mini India Map with Location Pins for "Explore on Map" card
 */
export const IndiaIllustratedMapGraphic: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <div className={`relative ${className} select-none shrink-0 flex items-center justify-center`}>
    <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="mapFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2E8" />
          <stop offset="50%" stopColor="#E8F4EC" />
          <stop offset="100%" stopColor="#E6EFF9" />
        </linearGradient>
      </defs>
      {/* India Outline Silhouette */}
      <path
        d="M62 10 C66 12, 74 12, 78 18 C83 24, 88 28, 85 35 C81 41, 92 45, 96 50 C100 55, 109 57, 114 61 C121 63, 134 59, 138 65 C139 70, 133 77, 127 79 C121 81, 112 76, 105 78 C101 81, 98 86, 102 93 C104 98, 109 104, 107 111 C105 116, 98 121, 94 128 C90 135, 86 145, 80 152 C76 156, 73 150, 70 142 C67 132, 62 124, 58 116 C55 109, 50 102, 48 97 C45 92, 38 88, 33 85 C28 80, 21 77, 19 70 C17 65, 24 60, 28 57 C33 52, 39 50, 42 45 C47 40, 50 35, 53 28 C56 22, 60 14, 62 10 Z"
        fill="url(#mapFillGrad)"
        stroke="#D5D9E2"
        strokeWidth="1.5"
      />
      {/* Colorful Location Pins */}
      {/* Delhi / North - Red */}
      <circle cx="60" cy="42" r="5" fill="#EF4444" />
      <circle cx="60" cy="42" r="2" fill="#FFFFFF" />
      <path d="M60 47 L60 52" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />

      {/* Jaipur / West - Orange */}
      <circle cx="48" cy="54" r="4.5" fill="#FF671F" />
      <circle cx="48" cy="54" r="1.8" fill="#FFFFFF" />
      <path d="M48 58.5 L48 63" stroke="#FF671F" strokeWidth="1.5" strokeLinecap="round" />

      {/* Kolkata / East - Blue */}
      <circle cx="102" cy="74" r="4.5" fill="#0284C7" />
      <circle cx="102" cy="74" r="1.8" fill="#FFFFFF" />
      <path d="M102 78.5 L102 83" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />

      {/* Mumbai / West - Green */}
      <circle cx="40" cy="94" r="4" fill="#046A38" />
      <circle cx="40" cy="94" r="1.6" fill="#FFFFFF" />
      <path d="M40 98 L40 102" stroke="#046A38" strokeWidth="1.5" strokeLinecap="round" />

      {/* South / Bengaluru / Hampi - Purple */}
      <circle cx="62" cy="120" r="4.5" fill="#8B5CF6" />
      <circle cx="62" cy="120" r="1.8" fill="#FFFFFF" />
      <path d="M62 124.5 L62 129" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

/**
 * Royal Bengal Tiger Emblem & Responsibility Crest for Footer
 */
export const RoyalBengalTigerEmblem: React.FC<{ className?: string }> = ({ className = 'h-10' }) => (
  <div className={`flex items-center gap-3 select-none ${className}`}>
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
      {/* Silhouette of leaping Royal Bengal Tiger */}
      <path
        d="M8 26 C12 24, 15 20, 18 18 C22 16, 26 15, 30 16 C34 17, 37 19, 41 18 C46 17, 52 14, 57 15 C62 16, 67 20, 71 19 C74 18, 76 16, 78 14 C79 17, 77 20, 74 22 C70 24, 65 24, 61 26 C57 28, 54 32, 50 33 C46 34, 43 31, 39 30 C35 29, 31 31, 27 32 C23 33, 18 34, 14 32 C11 30, 9 28, 8 26 Z"
        fill="#0B192C"
      />
      {/* Front Paws & Hind Legs */}
      <path d="M62 25 L65 34 L62 35" stroke="#0B192C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M54 28 L56 36 L52 36" stroke="#0B192C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 28 L18 36 L15 35" stroke="#0B192C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 28 L28 36 L25 36" stroke="#0B192C" strokeWidth="2.5" strokeLinecap="round" />
      {/* Graceful curving tail */}
      <path d="M12 25 C8 23, 4 18, 5 12 C6 9, 8 8, 9 10" stroke="#0B192C" strokeWidth="2" strokeLinecap="round" />
    </svg>

    {/* Green Leaf / Lotus Responsibility Emblem */}
    <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#046A38]">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 3 C10 7, 7 11, 7 15 C7 18.5, 9.5 21, 12 21 C14.5 21, 17 18.5, 17 15 C17 11, 14 7, 12 3 Z" opacity="0.9" />
        <path d="M12 21 L12 11" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>

    <div className="text-left leading-tight">
      <div className="text-xs font-serif font-bold text-[#0B192C]">Our Heritage</div>
      <div className="text-[11px] font-semibold text-[#046A38]">Our Responsibility</div>
    </div>
  </div>
);

/**
 * Top Corner Tricolour Ribbon Swirl for page layout framing
 */
export const TopCornerTricolourRibbon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 450 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none ${className}`}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="cornerSaffron" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF671F" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#FFA040" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#FF671F" stopOpacity="0.75" />
      </linearGradient>
      <linearGradient id="cornerGreen" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#046A38" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#138808" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#046A38" stopOpacity="0.75" />
      </linearGradient>
    </defs>
    {/* Saffron Ribbon Band */}
    <path
      d="M450 15 C370 15, 310 65, 270 115 C230 165, 190 195, 90 215 L100 238 C195 218, 240 185, 285 135 C325 85, 380 40, 450 40 Z"
      fill="url(#cornerSaffron)"
    />
    {/* White Ribbon Band */}
    <path
      d="M450 40 C380 40, 325 85, 285 135 C240 185, 195 218, 100 238 L110 260 C205 240, 255 205, 302 155 C345 105, 395 62, 450 62 Z"
      fill="#FFFFFF"
      opacity="0.95"
    />
    {/* India Green Ribbon Band */}
    <path
      d="M450 62 C395 62, 345 105, 302 155 C255 205, 205 240, 110 260 L120 282 C215 262, 270 225, 320 172 C365 122, 410 85, 450 85 Z"
      fill="url(#cornerGreen)"
    />
  </svg>
);
