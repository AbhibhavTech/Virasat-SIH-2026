import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Compass,
  Film,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export interface VideoTheme {
  id: string;
  title: string;
  tagline: string;
  city: string;
  cityId: string;
  state: string;
  region: string;
  videoWebm?: string;
  videoMp4?: string;
  poster: string;
  badge: string;
  era: string;
  architecture: string;
  bestTime: string;
  unescoNumber?: string;
  connectivity: string;
}

export const INCREDIBLE_INDIA_VIDEO_THEMES: VideoTheme[] = [
  {
    id: 'taj-mahal',
    title: 'Taj Mahal & Imperial Agra',
    tagline: 'Mughal Architectural Zenith & Timeless Monument of Eternal Love',
    city: 'Agra',
    cityId: 'agra',
    state: 'Uttar Pradesh',
    region: 'Golden Triangle',
    videoMp4: '/videos/taj-mahal.mp4',
    poster: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=80',
    badge: 'UNESCO World Heritage Site',
    era: '1632 – 1653 CE (Mughal Emperor Shah Jahan)',
    architecture: 'Indo-Islamic Pure White Makrana Marble',
    bestTime: 'October to March (Pleasant Autumn & Winter)',
    unescoNumber: 'UNESCO #252',
    connectivity: 'Agra Cantt Railway / Delhi IGI Airport (3.5 hrs via Yamuna Expressway)',
  },
  {
    id: 'gateway-mumbai',
    title: 'Gateway of India & Mumbai Harbor',
    tagline: 'Colonial Splendor along the Arabian Sea & Historic Queen\'s Necklace',
    city: 'Mumbai',
    cityId: 'mumbai',
    state: 'Maharashtra',
    region: 'Konkan Gateway',
    videoMp4: '/videos/mumbai.mp4',
    poster: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&auto=format&fit=crop&q=80',
    badge: 'Arabian Sea Front Landmark',
    era: '1911 – 1924 CE (Architect George Wittet)',
    architecture: 'Indo-Saracenic Basalt Archway',
    bestTime: 'November to February (Cool Coastal Breeze)',
    connectivity: 'CSMT Mumbai (2.5 km) / Chhatrapati Shivaji Maharaj Int. Airport',
  },
  {
    id: 'amber-fort',
    title: 'Amber Fort & Pink City Citadels',
    tagline: 'Majestic Hilltop Citadels, Honeycomb Facades & Royal Rajputana',
    city: 'Jaipur',
    cityId: 'jaipur',
    state: 'Rajasthan',
    region: 'Royal Rajputana Circuit',
    videoWebm: '/videos/jaipur-amber-fort.webm',
    poster: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&auto=format&fit=crop&q=80',
    badge: 'Hill Forts of Rajasthan',
    era: '1592 CE (Raja Man Singh I)',
    architecture: 'Rajput & Mughal Red Sandstone & Sheesh Mahal Glasswork',
    bestTime: 'October to March (Royal Festival Season)',
    unescoNumber: 'UNESCO #247',
    connectivity: 'Jaipur Junction (11 km) / Jaipur International Airport',
  },
  {
    id: 'sacred-varanasi',
    title: 'Sacred Ghats & Ganga Aarti',
    tagline: 'Evening Lamp Offerings, Timeless Chants & The Spiritual Soul of Bharat',
    city: 'Varanasi',
    cityId: 'varanasi',
    state: 'Uttar Pradesh',
    region: 'Sacred Heart of Bharat',
    videoWebm: '/videos/varanasi-ghats.webm',
    poster: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&auto=format&fit=crop&q=80',
    badge: 'Oldest Living City on Earth',
    era: 'Vedic Antiquity (Continuously inhabited for 3,000+ years)',
    architecture: 'Historic Riverside Stone Ghats & Kashi Vishwanath Sanctum',
    bestTime: 'October to March (Dev Deepawali & Winter Twilight)',
    connectivity: 'Varanasi Junction (4 km) / Lal Bahadur Shastri International Airport',
  },
  {
    id: 'kerala-backwaters',
    title: 'Emerald Backwaters & Coastal Lagoons',
    tagline: 'Serene Palm Canals, Traditional Houseboats & God\'s Own Country',
    city: 'Kochi',
    cityId: 'kochi',
    state: 'Kerala',
    region: 'Malabar & Palm Coast',
    videoMp4: '/videos/kerala.mp4',
    poster: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&auto=format&fit=crop&q=80',
    badge: 'National Geographic Top 50 Ecotourism',
    era: 'Ancient Malabar Spice Trade (1st Millennium BCE onwards)',
    architecture: 'Eco-Crafted Anjili Wood Houseboats & Dutch-Colonial Fort Kochi',
    bestTime: 'September to March (Post-Monsoon Greenery & Boat Races)',
    connectivity: 'Ernakulam Junction / Cochin International Airport (Solar Powered)',
  },
  {
    id: 'golden-temple',
    title: 'Harmandir Sahib (The Golden Temple)',
    tagline: 'Gleaming Gold Sanctuary of Universal Peace, Sacred Sarovar & Langar',
    city: 'Amritsar',
    cityId: 'amritsar',
    state: 'Punjab',
    region: 'Heart of Punjab',
    videoWebm: '/videos/golden-temple-amritsar.webm',
    poster: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1600&auto=format&fit=crop&q=80',
    badge: 'Universal Spiritual Sanctuary',
    era: '1581 – 1604 CE (Guru Ram Das & Guru Arjan)',
    architecture: 'Sikh Architecture with Marble Inlay & Pure Gold Leaf Foil',
    bestTime: 'October to March (Crisp Winter & Gurpurab Festivities)',
    connectivity: 'Amritsar Junction (2 km) / Sri Guru Ram Dass Jee International Airport',
  },
];

interface IncredibleIndiaVideoGalleryProps {
  onSelectDestination: (cityId: string, cityName: string) => void;
  selectedCityId?: string;
}

export const IncredibleIndiaVideoGallery: React.FC<IncredibleIndiaVideoGalleryProps> = ({
  onSelectDestination,
  selectedCityId,
}) => {
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [showDossier, setShowDossier] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTheme = INCREDIBLE_INDIA_VIDEO_THEMES[activeThemeIndex] || INCREDIBLE_INDIA_VIDEO_THEMES[0];

  // Auto-sync with selectedCityId if changed from parent planner
  useEffect(() => {
    if (!selectedCityId) return;
    const target = selectedCityId.toLowerCase();
    const idx = INCREDIBLE_INDIA_VIDEO_THEMES.findIndex(
      (t) => t.cityId.toLowerCase() === target || t.city.toLowerCase() === target
    );
    if (idx !== -1 && idx !== activeThemeIndex) {
      setActiveThemeIndex(idx);
      setVideoError(false);
    }
  }, [selectedCityId]);

  // Video naturally plays at 0.5x speed smoothly without user intervention
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const setNaturalSlowSpeed = () => {
      video.playbackRate = 0.5;
    };

    // Apply speed immediately
    setNaturalSlowSpeed();

    const handleLoadedMetadata = () => {
      setNaturalSlowSpeed();
      video.play().catch(() => {});
    };

    const handlePlay = () => {
      setNaturalSlowSpeed();
    };

    const handleEnded = () => {
      setActiveThemeIndex((prev) => (prev + 1) % INCREDIBLE_INDIA_VIDEO_THEMES.length);
      setVideoError(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, [activeThemeIndex]);

  // Keyboard navigation shortcuts (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextTheme();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTheme = (index: number) => {
    setActiveThemeIndex(index);
    setVideoError(false);
  };

  const handleNextTheme = () => {
    setActiveThemeIndex((prev) => (prev + 1) % INCREDIBLE_INDIA_VIDEO_THEMES.length);
    setVideoError(false);
  };

  const handlePrevTheme = () => {
    setActiveThemeIndex((prev) => (prev - 1 + INCREDIBLE_INDIA_VIDEO_THEMES.length) % INCREDIBLE_INDIA_VIDEO_THEMES.length);
    setVideoError(false);
  };

  const handlePlanThisCircuit = (theme: VideoTheme) => {
    onSelectDestination(theme.cityId, theme.city);
    setTimeout(() => {
      const plannerSection = document.getElementById('trip-planner-form');
      if (plannerSection) {
        plannerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const prevTheme = INCREDIBLE_INDIA_VIDEO_THEMES[(activeThemeIndex - 1 + INCREDIBLE_INDIA_VIDEO_THEMES.length) % INCREDIBLE_INDIA_VIDEO_THEMES.length];
  const nextTheme = INCREDIBLE_INDIA_VIDEO_THEMES[(activeThemeIndex + 1) % INCREDIBLE_INDIA_VIDEO_THEMES.length];

  return (
    <div
      ref={containerRef}
      id="incredible-india-video-gallery"
      className="relative w-full rounded-3xl overflow-hidden shadow-xl transition-all duration-300 border-2 border-amber-300/80 bg-gradient-to-b from-amber-50/70 via-white to-orange-50/40 text-stone-900 min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] xl:min-h-[820px]"
    >
      {/* 1. TOP NATIONAL TRI-COLOR & HERITAGE MOTIF HEADER RIBBON (CLEAN: NO SPEED/PAUSE/MUTE/EXPAND BUTTONS) */}
      <div className="relative z-20 w-full bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 sm:px-8 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Incredible India Official Branding & Devanagari Calligraphy */}
        <div className="flex items-center gap-3">
          {/* Saffron Chakra Seal */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF671F] to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#FF671F] font-serif">
                अतुल्य भारत
              </span>
              <span className="text-xs text-stone-300 font-light">|</span>
              <span className="text-sm sm:text-base font-bold tracking-tight text-stone-900 font-serif">
                Incredible India!
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Living Heritage
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-medium">
              Ministry of Tourism • Living Heritage & Architectural Wonders
            </p>
          </div>
        </div>

        {/* Right: Cultural Hospitality Motto */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-pulse" />
            <span>अतिथि देवो भव • Atithi Devo Bhava • Guest is God</span>
          </div>
        </div>
      </div>

      {/* 2. FULL-SIZE WIDESCREEN VIDEO STAGE (EXACT 4K VIDEO AT NATURAL 0.5x SPEED, NO LOAD BAR) */}
      <div className="relative w-full h-[470px] sm:h-[530px] lg:h-[590px] xl:h-[630px] overflow-hidden bg-amber-50 group select-none">
        {/* The Live Video Element Naturally Playing at 0.5x */}
        {!videoError ? (
          <video
            ref={videoRef}
            key={currentTheme.id}
            autoPlay
            loop
            muted
            playsInline
            poster={currentTheme.poster}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover brightness-105 contrast-102 saturate-105 transition-all duration-700 ease-out"
          >
            {currentTheme.videoWebm && <source src={currentTheme.videoWebm} type="video/webm" />}
            {currentTheme.videoMp4 && <source src={currentTheme.videoMp4} type="video/mp4" />}
          </video>
        ) : (
          <img
            src={currentTheme.poster}
            alt={currentTheme.title}
            className="w-full h-full object-cover brightness-105 contrast-102 saturate-105"
          />
        )}

        {/* Luminous Sunlit Daylight Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-black/10 to-stone-900/15 pointer-events-none" />

        {/* Traditional Mughal / Rajasthani Jali Filigree Corner Accents */}
        <div className="absolute top-4 left-4 pointer-events-none opacity-40 hidden sm:block">
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H64V12C45 12 32 25 32 44V64H0V0Z" fill="url(#jaaliGold)" fillOpacity="0.7"/>
            <path d="M4 4H48V14C35 15 22 28 22 46V60H4V4Z" stroke="#FF671F" strokeWidth="1.5" strokeDasharray="3 3"/>
            <circle cx="16" cy="16" r="5" fill="#FFB703" fillOpacity="0.8"/>
            <defs>
              <linearGradient id="jaaliGold" x1="0" y1="0" x2="64" y2="64">
                <stop stopColor="#FFE8B0"/>
                <stop offset="1" stopColor="#FF9E00"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute top-4 right-4 pointer-events-none opacity-40 hidden sm:block transform scale-x-[-1]">
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H64V12C45 12 32 25 32 44V64H0V0Z" fill="url(#jaaliGold2)" fillOpacity="0.7"/>
            <path d="M4 4H48V14C35 15 22 28 22 46V60H4V4Z" stroke="#FF671F" strokeWidth="1.5" strokeDasharray="3 3"/>
            <circle cx="16" cy="16" r="5" fill="#FFB703" fillOpacity="0.8"/>
            <defs>
              <linearGradient id="jaaliGold2" x1="0" y1="0" x2="64" y2="64">
                <stop stopColor="#FFE8B0"/>
                <stop offset="1" stopColor="#FF9E00"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 3. HERO CONTENT & HIGHLIGHT OVERLAY */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 pointer-events-none">
          {/* Top Left: Destination Title & Region Pill */}
          <div className="max-w-2xl space-y-3 pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-amber-300/80 shadow-md text-stone-900 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>{currentTheme.city}, {currentTheme.state}</span>
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-[#FF671F] uppercase tracking-wider text-[10px]">{currentTheme.region}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] tracking-tight leading-[1.1]">
              {currentTheme.title}
            </h2>

            <p className="text-sm sm:text-base text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium max-w-xl leading-relaxed">
              {currentTheme.tagline}
            </p>

            {/* Quick Badges Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold shadow-md">
                <Award className="w-3.5 h-3.5" />
                <span>{currentTheme.badge}</span>
              </div>
              {currentTheme.unescoNumber && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md text-blue-900 border border-blue-200 text-xs font-bold shadow-md">
                  <span>{currentTheme.unescoNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls & Floating "Heritage Dossier" Card */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 pointer-events-auto">
            {/* Direct Plan Journey CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePlanThisCircuit(currentTheme)}
                className="group px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF671F] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-orange-500/30 flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer border border-amber-300"
              >
                <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                <span>Plan Trip to {currentTheme.city}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowDossier((prev) => !prev)}
                className="px-3.5 py-3 rounded-2xl bg-white/90 hover:bg-white backdrop-blur-md text-stone-800 border border-amber-200 text-xs font-semibold shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>{showDossier ? 'Hide Details' : 'Heritage Facts'}</span>
              </button>
            </div>

            {/* Quick Dossier Details Box */}
            {showDossier && (
              <div className="w-full sm:w-auto max-w-md p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-xl text-stone-800 space-y-2">
                <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 text-xs">
                  <span className="text-stone-500 font-medium">Historical Era:</span>
                  <span className="font-bold text-stone-900 text-right">{currentTheme.era}</span>
                </div>
                <div className="flex items-center justify-between border-b border-amber-100 pb-1.5 text-xs">
                  <span className="text-stone-500 font-medium">Architectural Style:</span>
                  <span className="font-bold text-stone-900 text-right">{currentTheme.architecture}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Best Season to Visit:</span>
                  <span className="font-bold text-[#FF671F] text-right">{currentTheme.bestTime}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. PREV / NEXT DIRECT FLIP BUTTONS ON VIDEO STAGE */}
        <button
          onClick={handlePrevTheme}
          aria-label={`Previous destination: ${prevTheme.city}`}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-md border border-amber-300/80 text-stone-900 hover:text-[#FF671F] flex items-center justify-center shadow-lg transition-all transform hover:scale-110 cursor-pointer"
          title={`Previous: ${prevTheme.title}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNextTheme}
          aria-label={`Next destination: ${nextTheme.city}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-md border border-amber-300/80 text-stone-900 hover:text-[#FF671F] flex items-center justify-center shadow-lg transition-all transform hover:scale-110 cursor-pointer"
          title={`Next: ${nextTheme.title}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 5. BRIGHT THEMATIC VIDEO REEL CAROUSEL STRIP */}
      <div className="p-5 sm:p-7 bg-gradient-to-b from-white via-amber-50/40 to-orange-50/30 border-t border-amber-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF671F]" />
            <h3 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
              Curated Living Heritage Circuit Videos (Click or use ← → arrow keys)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-semibold">
              <Film className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Reel {activeThemeIndex + 1} of {INCREDIBLE_INDIA_VIDEO_THEMES.length}</span>
            </div>
          </div>
        </div>

        {/* The 6 Bright Video Reel Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INCREDIBLE_INDIA_VIDEO_THEMES.map((theme, idx) => {
            const isActive = idx === activeThemeIndex;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(idx)}
                className={`group relative text-left rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                  isActive
                    ? 'ring-2 ring-[#FF671F] border-[#FF671F] bg-white shadow-lg -translate-y-1'
                    : 'border-amber-200/90 bg-white hover:border-amber-400 hover:shadow-md hover:bg-amber-50/50'
                }`}
              >
                {/* Thumbnail Header Image */}
                <div className="relative w-full h-24 sm:h-28 overflow-hidden bg-stone-100">
                  <img
                    src={theme.poster}
                    alt={theme.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      isActive ? 'brightness-105' : 'brightness-95'
                    }`}
                  />

                  {/* Active Playing Equalizer or Indicator */}
                  <div className="absolute top-2 right-2">
                    {isActive ? (
                      <div className="flex items-center gap-0.5 px-2 py-1 rounded-md bg-[#FF671F] text-white text-[10px] font-bold shadow-md">
                        <span className="w-1 h-3 bg-white animate-pulse" />
                        <span className="w-1 h-2 bg-white animate-pulse delay-75" />
                        <span className="w-1 h-3.5 bg-white animate-pulse delay-150" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white/85 group-hover:bg-[#FF671F] group-hover:text-white text-stone-800 flex items-center justify-center shadow-xs transition">
                        <span className="w-2 h-2 rounded-full bg-stone-700 group-hover:bg-white" />
                      </div>
                    )}
                  </div>

                  {/* City Pill */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                    {theme.city}
                  </div>
                </div>

                {/* Card Body in Bright Tone */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-[#FF671F] transition">
                      {theme.title}
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-1">
                      {theme.region}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px]">
                    <span className="text-[#FF671F] font-semibold line-clamp-1">
                      {theme.badge.split(' ')[0]}
                    </span>
                    <span className="text-stone-400 font-medium text-[9px]">
                      {theme.city}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 6. INCREDIBLE INDIA TOURISM CREDENTIALS & HELPLINE BAR */}
        <div className="pt-3 border-t border-amber-200/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-700 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF671F] flex items-center justify-center font-bold">
              36
            </div>
            <div>
              <div className="font-bold text-stone-900">States & UTs</div>
              <div className="text-[10px] text-stone-500">Pan-India Circuits</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              42
            </div>
            <div>
              <div className="font-bold text-stone-900">UNESCO World Heritage</div>
              <div className="text-[10px] text-stone-500">Cultural & Natural Sites</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              3.6k+
            </div>
            <div>
              <div className="font-bold text-stone-900">ASI Monuments</div>
              <div className="text-[10px] text-stone-500">Protected Architecture</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              1363
            </div>
            <div>
              <div className="font-bold text-stone-900">Tourist Helpline</div>
              <div className="text-[10px] text-stone-500">24x7 Multi-lingual Care</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
