import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Compass, 
  Landmark, 
  Train, 
  Calendar,
  Waves, 
  Sun, 
  Sunset, 
  CloudSun, 
  Eye, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Film
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface CinematicHeroProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace?: (placeId: string) => void;
  onSelectCity?: (city: string) => void;
  selectedCity?: string;
  onOpenAIChat?: (prompt?: string) => void;
}

type AmbienceMode = 'daylight' | 'golden' | 'oceanic';

interface MonumentPreview {
  id: string;
  name: string;
  city: string;
  state: string;
  style: string;
  year: string;
  material: string;
  facts: string;
  coordinates: string;
  imageUrl: string;
  tab: NavTab;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onSearch,
  onNavigateTab,
  onSelectPlace,
  onSelectCity,
  selectedCity = 'All India',
  onOpenAIChat,
}) => {
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ambience, setAmbience] = useState<AmbienceMode>('golden');
  const [clarity, setClarity] = useState<'vivid' | 'balanced'>('vivid');
  const [activeMonumentIdx, setActiveMonumentIdx] = useState(0);
  const [isHoveredOverWallpaper, setIsHoveredOverWallpaper] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gateway of India is the default featured architectural monument
  const monumentShowcase: MonumentPreview[] = [
    {
      id: 'gateway-of-india',
      name: 'Gateway of India',
      city: 'Mumbai',
      state: 'Maharashtra',
      style: 'Indo-Saracenic Basalt Arch',
      year: '1911 – 1924 CE',
      material: 'Yellow Basalt & Reinforced Concrete',
      facts: 'George Wittet design blending Roman triumphal arch with 16th-c. Gujarati Sultanate jali screens.',
      coordinates: '18.9220° N, 72.8347° E',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=85',
      tab: 'heritage',
    },
    {
      id: 'taj-mahal',
      name: 'Taj Mahal',
      city: 'Agra',
      state: 'Uttar Pradesh',
      style: 'Mughal Symmetrical Marble',
      year: '1632 – 1648 CE',
      material: 'Makrana Marble & Pietra Dura Inlay',
      facts: 'UNESCO World Heritage wonder set on the Yamuna river with quadripartite Charbagh gardens.',
      coordinates: '27.1751° N, 78.0421° E',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=85',
      tab: 'heritage',
    },
    {
      id: 'amber-palace',
      name: 'Amber Fort & Sheesh Mahal',
      city: 'Jaipur',
      state: 'Rajasthan',
      style: 'Rajput & Mughal Hill Architecture',
      year: '1592 CE',
      material: 'Yellow & Pink Sandstone with Convex Mirror Mosaic',
      facts: 'UNESCO Hill Fort rising above Maota Lake with the legendary Hall of Mirrors reflecting oil lamps.',
      coordinates: '26.9855° N, 75.8513° E',
      imageUrl: 'https://images.unsplash.com/photo-1603288967527-24861e6878b3?w=1200&auto=format&fit=crop&q=85',
      tab: 'heritage',
    }
  ];

  const currentMonument = monumentShowcase[activeMonumentIdx];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: x * 20, y: y * 14 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  // Curated, verified destination chips respecting active city context
  const getCityQuickPicks = () => {
    const city = selectedCity.toLowerCase();
    if (city.includes('mumbai')) {
      return [
        { label: 'Gateway of India', id: 'gateway-of-india', tab: 'dashboard' as NavTab },
        { label: 'Elephanta Caves', id: 'elephanta-caves', tab: 'heritage' as NavTab },
        { label: 'Marine Drive', id: 'marine-drive', tab: 'dashboard' as NavTab },
        { label: 'CSMT Victorian Terminus', id: 'csmt', tab: 'heritage' as NavTab },
      ];
    }
    if (city.includes('delhi')) {
      return [
        { label: 'Qutub Minar', id: 'qutub-minar', tab: 'heritage' as NavTab },
        { label: 'Humayun’s Tomb', id: 'humayuns-tomb', tab: 'heritage' as NavTab },
        { label: 'Red Fort', id: 'red-fort', tab: 'heritage' as NavTab },
        { label: 'India Gate', id: 'india-gate', tab: 'dashboard' as NavTab },
      ];
    }
    if (city.includes('jaipur')) {
      return [
        { label: 'Amber Palace', id: 'amber-palace', tab: 'heritage' as NavTab },
        { label: 'Hawa Mahal', id: 'hawa-mahal', tab: 'heritage' as NavTab },
        { label: 'Jantar Mantar', id: 'jantar-mantar', tab: 'heritage' as NavTab },
        { label: 'City Palace', id: 'city-palace-jaipur', tab: 'dashboard' as NavTab },
      ];
    }
    if (city.includes('agra')) {
      return [
        { label: 'Taj Mahal', id: 'taj-mahal', tab: 'heritage' as NavTab },
        { label: 'Agra Fort', id: 'agra-fort', tab: 'heritage' as NavTab },
        { label: 'Fatehpur Sikri', id: 'fatehpur-sikri', tab: 'heritage' as NavTab },
      ];
    }
    if (city.includes('varanasi')) {
      return [
        { label: 'Kashi Vishwanath', id: 'kashi-vishwanath', tab: 'heritage' as NavTab },
        { label: 'Dashashwamedh Ghat', id: 'dashashwamedh-ghat', tab: 'dashboard' as NavTab },
        { label: 'Sarnath Lion Capital', id: 'sarnath', tab: 'heritage' as NavTab },
      ];
    }
    return [
      { label: 'Gateway of India', id: 'gateway-of-india', tab: 'dashboard' as NavTab },
      { label: 'Taj Mahal', id: 'taj-mahal', tab: 'heritage' as NavTab },
      { label: 'Amber Palace', id: 'amber-palace', tab: 'heritage' as NavTab },
      { label: 'Qutub Minar', id: 'qutub-minar', tab: 'heritage' as NavTab },
      { label: 'Meenakshi Temple', id: 'meenakshi-temple', tab: 'heritage' as NavTab },
    ];
  };

  const quickPicks = getCityQuickPicks();

  // Ambience tint classes for the Gateway wallpaper
  const getAmbienceFilter = () => {
    switch (ambience) {
      case 'golden':
        return 'sepia-[0.12] contrast-[1.06] brightness-[1.02] saturate-[1.12]';
      case 'oceanic':
        return 'hue-rotate-[-8deg] contrast-[1.04] brightness-[1.04] saturate-[1.08]';
      case 'daylight':
      default:
        return 'contrast-[1.05] brightness-[1.05] saturate-[1.05]';
    }
  };

  return (
    <div className="space-y-6">
      {/* 
        HERO SECTION:
        Gateway of India wallpaper prominently displayed in the background with minimal transparency (high clarity),
        paired with a refined, tactile light-theme reading canvas, warm sandstone accents, and live interactivity.
      */}
      <section
        id="gateway-hero-section"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHoveredOverWallpaper(true)}
        onMouseLeave={() => setIsHoveredOverWallpaper(false)}
        className="relative rounded-3xl overflow-hidden border border-[#E8DFC8] shadow-3d-card p-6 sm:p-10 lg:p-12 transition-all duration-300 group/hero"
      >
        {/* ========================================================================= */}
        {/* 1. GATEWAY OF INDIA WALLPAPER BACKGROUND (HIGH CLARITY / LOW TRANSPARENCY) */}
        {/* ========================================================================= */}
        <div
          id="gateway-wallpaper-layer"
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none ${getAmbienceFilter()}`}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&auto=format&fit=crop&q=90')`,
            backgroundPosition: 'center 46%',
            transform: !reducedMotion
              ? `scale(1.05) translate3d(${offset.x * -0.4}px, ${offset.y * -0.4}px, 0)`
              : undefined,
          }}
        />

        {/* 
          2. ELEGANT LIGHT THEME ATMOSPHERIC SCRIM:
          Engineered so the Gateway of India's iconic basalt arch, waterfront, and domes remain 
          strikingly and clearly visible ("transparency should be that it should be less"),
          while providing smooth, soft contrast for reading without washing out the photo.
        */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            clarity === 'vivid'
              ? ambience === 'golden'
                ? 'bg-gradient-to-r from-[#FAF8F5]/80 via-[#FAF8F5]/52 to-transparent'
                : ambience === 'oceanic'
                ? 'bg-gradient-to-r from-[#FAF8F5]/80 via-[#FAF8F5]/50 to-transparent'
                : 'bg-gradient-to-r from-[#FAF8F5]/80 via-[#FAF8F5]/48 to-transparent'
              : ambience === 'golden' 
              ? 'bg-gradient-to-r from-[#FAF8F5]/92 via-[#FAF8F5]/75 to-[#FFF7ED]/45 md:to-transparent' 
              : ambience === 'oceanic'
              ? 'bg-gradient-to-r from-[#FAF8F5]/92 via-[#FAF8F5]/72 to-[#EFF6FF]/45 md:to-transparent'
              : 'bg-gradient-to-r from-[#FAF8F5]/92 via-[#FAF8F5]/70 to-[#FAF8F5]/40 md:to-transparent'
          }`}
        />
        {/* Soft vertical gradient to ground cards at the base */}
        <div className={`absolute inset-0 pointer-events-none ${clarity === 'vivid' ? 'bg-gradient-to-t from-[#FAF8F5]/90 via-transparent to-[#FAF8F5]/20' : 'bg-gradient-to-t from-[#FAF8F5]/95 via-transparent to-[#FAF8F5]/30'}`} />

        {/* Subtle decorative Indian sandstone jaali pattern watermark */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#b45309_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none" />

        {/* TOP BAR / AMBIENCE CONTROLS & LIVE HARBOR BADGE */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Active Context & Monument Landmark Chip */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onSelectPlace ? onSelectPlace('gateway-of-india') : onNavigateTab('heritage')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white border border-[#E5DAC8] shadow-xs text-xs font-semibold text-stone-800 transition hover:border-amber-500 active:scale-98 group/badge"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700 animate-ping" />
              <Landmark className="w-3.5 h-3.5 text-amber-800" />
              <span className="font-bold text-stone-900">Gateway of India</span>
              <span className="text-stone-300">|</span>
              <span className="text-[11px] text-amber-900 font-medium">Apollo Bunder, Mumbai Harbour</span>
              <ExternalLink className="w-3 h-3 text-stone-400 group-hover/badge:text-amber-800 transition-colors" />
            </button>

            {/* Live Coastal Weather Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#EBE3D3] text-[11px] font-medium text-stone-700 shadow-2xs">
              <Waves className="w-3.5 h-3.5 text-sky-600" />
              <span>Arabian Sea: 28°C Breeze</span>
              <span className="text-stone-300">•</span>
              <span className="text-emerald-700 font-semibold">Elephanta Ferries Active</span>
            </div>
          </div>

          {/* Interactive Controls: Wallpaper Clarity & Ambience Lighting */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Clarity Toggle (Less Transparency / High Wallpaper Visibility) */}
            <button
              onClick={() => setClarity(clarity === 'vivid' ? 'balanced' : 'vivid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all border shadow-xs ${
                clarity === 'vivid'
                  ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                  : 'bg-white/95 text-stone-700 border-[#E5DAC8] hover:bg-white'
              }`}
              title="Toggle transparency: Vivid lets the Gateway wallpaper shine through with minimal overlay"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{clarity === 'vivid' ? 'Vivid Gateway Wallpaper' : 'Balanced Overlay'}</span>
            </button>

            {/* Ambience Lighting Switcher */}
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E5DAC8] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-2">
                Light:
              </span>
              <button
                onClick={() => setAmbience('golden')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  ambience === 'golden'
                    ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title="Golden Hour: Warm golden sun on yellow basalt"
              >
                <Sunset className="w-3 h-3 text-amber-700" />
                <span>Golden</span>
              </button>
              <button
                onClick={() => setAmbience('daylight')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  ambience === 'daylight'
                    ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title="Clear Daylight: Vibrant sunlight across Mumbai Harbour"
              >
                <Sun className="w-3 h-3 text-amber-600" />
                <span>Daylight</span>
              </button>
              <button
                onClick={() => setAmbience('oceanic')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  ambience === 'oceanic'
                    ? 'bg-sky-100 text-sky-950 border border-sky-300 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
                title="Ocean Breeze: Cool twilight coastal hues"
              >
                <CloudSun className="w-3 h-3 text-sky-600" />
                <span>Oceanic</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN HERO GRID: HEADLINE, SEARCH & INTERACTIVE ARCHITECTURAL SHOWCASE     */}
        {/* ========================================================================= */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Clean Light-Theme Frosted Pod for 100% Legibility & Polish */}
          <div className="lg:col-span-7 space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl shadow-warm space-y-5 transition-all ${clarity === 'vivid' ? 'bg-white/80 backdrop-blur-md border border-white/70' : 'bg-white/90 backdrop-blur-md border border-white/85'}`}>
              {/* Regional Discovery Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{selectedCity === 'All India' ? 'Incredible India • Living Cultural Portal' : `Exploring ${selectedCity}`}</span>
              </div>

              {/* Exact Prompt Required Headline with Crisp Typography & Saffron Accent */}
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.12]">
                  Where will <span className="relative inline-block text-amber-950">India<span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full" /></span> take you today?
                </h1>
                <p className="text-sm sm:text-base text-stone-700 max-w-xl leading-relaxed font-normal">
                  Discover heritage, living traditions, hidden places, and unforgettable journeys across verified monuments, multimodal transit lines, and dynastic architecture.
                </p>
              </div>

              {/* Prominent Search Bar with Light Theme Polish */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl group">
                <div className="flex items-center rounded-2xl bg-white border-2 border-[#E5DAC8] group-focus-within:border-amber-700 group-focus-within:ring-3 group-focus-within:ring-amber-600/20 shadow-md transition-all p-1.5">
                  <div className="pl-3.5 pr-2 text-stone-500 group-focus-within:text-amber-800 transition-colors">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Gateway of India, Ajanta Caves, Taj Mahal, Vande Bharat..."
                    className="w-full py-2.5 px-2 text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-400 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-amber-950 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0 active:scale-98"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Curated Trending Destination Chips */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Curated Destinations in {selectedCity}:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {quickPicks.map((pick) => (
                    <button
                      key={pick.id}
                      onClick={() => {
                        if (onSelectPlace) onSelectPlace(pick.id);
                        else onNavigateTab(pick.tab);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition shadow-2xs flex items-center gap-1.5 active:scale-95 ${
                        pick.id === 'gateway-of-india'
                          ? 'bg-amber-100/90 text-amber-950 border-amber-300 hover:bg-amber-200'
                          : 'bg-white hover:bg-amber-50 border-[#E8DFC8] text-stone-800 hover:text-amber-950 hover:border-amber-300'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{pick.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Action Mode Launchers */}
              <div className="flex items-center gap-2.5 pt-1 flex-wrap text-xs font-semibold">
                <button
                  onClick={() => {
                    if (onSelectPlace) onSelectPlace('gateway-of-india');
                    else onNavigateTab('heritage');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white shadow-xs transition active:scale-98 font-bold"
                >
                  <Landmark className="w-3.5 h-3.5 text-amber-300" />
                  <span>Explore Gateway in 3D</span>
                </button>

                <button
                  onClick={() => onNavigateTab('itinerary')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition active:scale-98"
                >
                  <Compass className="w-3.5 h-3.5 text-stone-700" />
                  <span>Plan Itinerary</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenAIChat) onOpenAIChat('Plan a 1-day heritage walk starting at Gateway of India, Colaba Causeway, and Elephanta Caves');
                    else onNavigateTab('ai');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>AI Itinerary Planner</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('incredible-media-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171513] hover:bg-black text-white border border-stone-800 transition active:scale-98 shadow-2xs font-semibold"
                >
                  <Film className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span>Incredible India Films & Photos</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive 3D Architectural Showcase Featuring Gateway of India */}
          <div className="lg:col-span-5 relative flex flex-col justify-center items-center select-none">
            <div className="w-full max-w-sm sm:max-w-md rounded-3xl bg-white/95 backdrop-blur-md border-2 border-[#E5DAC8] p-5 sm:p-6 shadow-xl space-y-4">
              
              {/* Header with Monument Switcher tabs */}
              <div className="flex items-center justify-between gap-2 border-b border-[#EFE7D8] pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="text-xs font-bold text-stone-900">Featured 3D Heritage</span>
                </div>
                <div className="flex items-center gap-1">
                  {monumentShowcase.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMonumentIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        activeMonumentIdx === idx
                          ? 'bg-amber-800 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {m.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monument Interactive Visual Card */}
              <div 
                onClick={() => {
                  if (onSelectPlace) onSelectPlace(currentMonument.id);
                  else onNavigateTab('heritage');
                }}
                className="group/card cursor-pointer relative h-52 sm:h-56 rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-inner"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-108"
                  style={{
                    backgroundImage: `url('${currentMonument.imageUrl}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

                {/* Badges on top */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>3D Interactive Architecture</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-600/30">
                    {currentMonument.year}
                  </span>
                </div>

                {/* Floating 3D WebGL trigger badge */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <div className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover/card:translate-y-0 transition-transform">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                    <span>Launch 3D WebGL Orbit</span>
                  </div>
                </div>

                {/* Bottom title & location overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-base font-bold drop-shadow-md">
                      {currentMonument.name}
                    </h3>
                    <span className="text-xs text-amber-300 font-medium">
                      {currentMonument.city}, {currentMonument.state}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-200 line-clamp-1">
                    {currentMonument.style}
                  </p>
                </div>
              </div>

              {/* Architectural Highlights Dossier */}
              <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#EFE7D8] space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-600 block font-semibold">Material:</span>
                    <span className="font-bold text-stone-900">{currentMonument.material}</span>
                  </div>
                  <div>
                    <span className="text-stone-600 block font-semibold">Coordinates:</span>
                    <span className="font-mono font-bold text-stone-800">{currentMonument.coordinates}</span>
                  </div>
                </div>

                <p className="text-stone-600 text-[11px] leading-relaxed border-t border-stone-200/60 pt-2">
                  {currentMonument.facts}
                </p>

                {/* Direct Action Bar */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      if (onSelectPlace) onSelectPlace(currentMonument.id);
                      else onNavigateTab('heritage');
                    }}
                    className="text-amber-800 hover:text-amber-950 font-bold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>View Dynastic Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenAIChat) onOpenAIChat(`Tell me the complete architectural history, architectural style, and visiting guide for ${currentMonument.name}`);
                      else onNavigateTab('ai');
                    }}
                    className="text-stone-500 hover:text-amber-800 font-semibold inline-flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Ask AI Guide</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INDIA TRAVEL PULSE: LIGHT THEME TACTILE DISCOVERY BAR                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Monuments & Heritage */}
        <div 
          onClick={() => onNavigateTab('heritage')}
          className="group cursor-pointer rounded-2xl bg-white border border-[#E8DFC8] p-4 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors">
              <Landmark className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              3D Orbit
            </span>
          </div>
          <div className="font-serif text-lg font-bold text-stone-900 leading-tight">
            3,600+
          </div>
          <p className="text-xs font-bold text-stone-700 mt-0.5">ASI Heritage Sites</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Basalt arches, stepwells & forts</p>
        </div>

        {/* Card 2: UNESCO World Heritage */}
        <div 
          onClick={() => onNavigateTab('heritage')}
          className="group cursor-pointer rounded-2xl bg-white border border-[#E8DFC8] p-4 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              World Heritage
            </span>
          </div>
          <div className="font-serif text-lg font-bold text-stone-900 leading-tight">
            42 Wonders
          </div>
          <p className="text-xs font-bold text-stone-700 mt-0.5">UNESCO Enclaves</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Elephanta, Taj, Ellora & Hampi</p>
        </div>

        {/* Card 3: Plan Trip & Curated Circuits */}
        <div 
          onClick={() => onNavigateTab('itinerary')}
          className="group cursor-pointer rounded-2xl bg-white border border-[#E8DFC8] p-4 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Plan Trip
            </span>
          </div>
          <div className="font-serif text-lg font-bold text-stone-900 leading-tight">
            Day Circuits
          </div>
          <p className="text-xs font-bold text-stone-700 mt-0.5">AI Smart Itineraries</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Custom Heritage Day Tours & Timing</p>
        </div>

        {/* Card 4: 36 States & Geographic Diversity */}
        <div 
          onClick={() => {
            const el = document.getElementById('explore-by-region-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group cursor-pointer rounded-2xl bg-white border border-[#E8DFC8] p-4 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all active:scale-98"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Pan-India
            </span>
          </div>
          <div className="font-serif text-lg font-bold text-stone-900 leading-tight">
            36 States & UTs
          </div>
          <p className="text-xs font-bold text-stone-700 mt-0.5">Regional Territories</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Ladakh passes to Malabar coast</p>
        </div>
      </div>
    </div>
  );
};
