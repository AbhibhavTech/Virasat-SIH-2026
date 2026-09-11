import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Film,
  Camera,
  Calendar,
  Layers,
} from 'lucide-react';

export interface HeritageCircuitDestination {
  id: string;
  title: string;
  tagline: string;
  city: string;
  cityId: string;
  state: string;
  region: string;
  category: 'royal' | 'spiritual' | 'coastal' | 'unesco' | 'himalayan';
  imageUrl: string;
  videoUrl?: string;
  badge: string;
  unescoNumber?: string;
  bestSeason: string;
  highlights: string[];
}

export const HERITAGE_CIRCUIT_DESTINATIONS: HeritageCircuitDestination[] = [
  {
    id: 'taj-mahal',
    title: 'Taj Mahal & Imperial Agra',
    tagline: 'Mughal Architectural Zenith & Timeless Monument of Eternal Love',
    city: 'Agra',
    cityId: 'agra',
    state: 'Uttar Pradesh',
    region: 'Golden Triangle',
    category: 'unesco',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=85',
    badge: 'UNESCO World Heritage Site',
    unescoNumber: 'UNESCO #252',
    bestSeason: 'Oct - Mar',
    highlights: ['Taj Mahal at Sunrise', 'Agra Fort Palaces', 'Fatehpur Sikri', 'Mehtab Bagh View'],
  },
  {
    id: 'gateway-mumbai',
    title: 'Gateway of India & Mumbai Harbor',
    tagline: 'Colonial Splendor along the Arabian Sea & Historic Queen\'s Necklace',
    city: 'Mumbai',
    cityId: 'mumbai',
    state: 'Maharashtra',
    region: 'Konkan Gateway',
    category: 'coastal',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&auto=format&fit=crop&q=85',
    videoUrl: '/videos/mumbai.mp4',
    badge: 'Arabian Sea Landmark',
    bestSeason: 'Nov - Feb',
    highlights: ['Gateway Harbor Plaza', 'Elephanta Caves', 'Marine Drive Promenade', 'Colaba Causeway Art'],
  },
  {
    id: 'amber-fort',
    title: 'Amber Fort & Pink City Citadels',
    tagline: 'Majestic Hilltop Citadels, Honeycomb Facades & Royal Rajputana',
    city: 'Jaipur',
    cityId: 'jaipur',
    state: 'Rajasthan',
    region: 'Royal Rajputana Circuit',
    category: 'royal',
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&auto=format&fit=crop&q=85',
    videoUrl: '/videos/jaipur-amber-fort.webm',
    badge: 'Hill Forts of Rajasthan',
    unescoNumber: 'UNESCO #247',
    bestSeason: 'Oct - Mar',
    highlights: ['Sheesh Mahal Mirror Hall', 'Hawa Mahal Breezes', 'City Palace Museum', 'Nahargarh Sunset'],
  },
  {
    id: 'sacred-varanasi',
    title: 'Sacred Ghats & Ganga Aarti',
    tagline: 'Evening Brass Lamp Offerings, Timeless Chants & The Spiritual Soul of Bharat',
    city: 'Varanasi',
    cityId: 'varanasi',
    state: 'Uttar Pradesh',
    region: 'Sacred Heart of Bharat',
    category: 'spiritual',
    imageUrl: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1600&auto=format&fit=crop&q=85',
    badge: 'Oldest Living City on Earth',
    bestSeason: 'Oct - Mar',
    highlights: ['Dashashwamedh Maha Aarti', 'Sunrise Subah-e-Banaras Boat', 'Assi Ghat Walks', 'Sarnath Deer Park'],
  },
  {
    id: 'kerala-backwaters',
    title: 'Emerald Backwaters & Coastal Lagoons',
    tagline: 'Serene Palm Canals, Traditional Houseboats & God\'s Own Country',
    city: 'Kochi',
    cityId: 'kochi',
    state: 'Kerala',
    region: 'Malabar & Palm Coast',
    category: 'coastal',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&auto=format&fit=crop&q=85',
    videoUrl: '/videos/kerala.mp4',
    badge: 'God\'s Own Country',
    bestSeason: 'Sep - Mar',
    highlights: ['Alleppey Houseboat Canals', 'Fort Kochi Chinese Nets', 'Mattancherry Murals', 'Kathakali Centers'],
  },
  {
    id: 'golden-temple',
    title: 'Harmandir Sahib (The Golden Temple)',
    tagline: 'Gleaming Gold Sanctuary of Universal Peace, Sacred Sarovar & Langar',
    city: 'Amritsar',
    cityId: 'amritsar',
    state: 'Punjab',
    region: 'Heart of Punjab',
    category: 'spiritual',
    imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1600&auto=format&fit=crop&q=85',
    badge: 'Universal Spiritual Sanctuary',
    bestSeason: 'Oct - Mar',
    highlights: ['Amrit Sarovar Parikrama', 'World\'s Largest Community Langar', 'Jallianwala Bagh', 'Wagah Border Ceremony'],
  },
  {
    id: 'udaipur-palaces',
    title: 'City Palace & Lake Pichola',
    tagline: 'Venice of the East, Floating Marble Palaces & Aravalli Mountain Vistas',
    city: 'Udaipur',
    cityId: 'udaipur',
    state: 'Rajasthan',
    region: 'Mewar Heritage Circuit',
    category: 'royal',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1600&auto=format&fit=crop&q=85',
    badge: 'Royal Mewar Capital',
    bestSeason: 'Sep - Mar',
    highlights: ['City Palace Complex', 'Jag Mandir Island Boat', 'Saheliyon Ki Bari', 'Bagore Ki Haveli Dance'],
  },
  {
    id: 'hampi-ruins',
    title: 'Vijayanagara Empire & Stone Chariot',
    tagline: 'Surreal Boulder Landscapes, 14th-Century Megaliths & Ancient Temples',
    city: 'Hampi',
    cityId: 'hampi',
    state: 'Karnataka',
    region: 'Deccan Plateau',
    category: 'unesco',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?w=1600&auto=format&fit=crop&q=85',
    badge: 'UNESCO World Heritage Site',
    unescoNumber: 'UNESCO #241',
    bestSeason: 'Nov - Feb',
    highlights: ['Vittala Temple Stone Chariot', 'Virupaksha Temple', 'Lotus Mahal Pavilions', 'Hemakuta Hill Sunset'],
  },
  {
    id: 'goa-coastal',
    title: 'Old Goa Basilicas & Coastal Heritage',
    tagline: '16th-Century Baroque Cathedrals, Latin Quarter & Arabian Palm Shores',
    city: 'Goa',
    cityId: 'goa',
    state: 'Goa',
    region: 'Konkan Coast',
    category: 'coastal',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=85',
    badge: 'UNESCO World Heritage Site',
    unescoNumber: 'UNESCO #234',
    bestSeason: 'Nov - Feb',
    highlights: ['Basilica of Bom Jesus', 'Se Cathedral Chimes', 'Fontainhas Heritage Walk', 'Aguada Lighthouse'],
  },
  {
    id: 'ladakh-monasteries',
    title: 'High Himalayan Monasteries & Azure Lakes',
    tagline: 'Tibetan Buddhist Monasteries, Pangong Tso & Highest Motorable Passes',
    city: 'Leh Ladakh',
    cityId: 'ladakh',
    state: 'Ladakh',
    region: 'Trans-Himalayan Frontier',
    category: 'himalayan',
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1600&auto=format&fit=crop&q=85',
    badge: 'Roof of the World',
    bestSeason: 'May - Sep',
    highlights: ['Thiksey Monastery Chants', 'Pangong Tso Blue Waters', 'Nubra Valley Dunes', 'Khardung La Pass (17,982 ft)'],
  },
  {
    id: 'khajuraho-temples',
    title: 'Chandela Temples & Sculptural Marvels',
    tagline: 'Medieval Nagara Architecture, Intricate Carvings & Artistic Heritage',
    city: 'Khajuraho',
    cityId: 'khajuraho',
    state: 'Madhya Pradesh',
    region: 'Central Bundelkhand',
    category: 'unesco',
    imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=1600&auto=format&fit=crop&q=85',
    badge: 'UNESCO World Heritage Site',
    unescoNumber: 'UNESCO #240',
    bestSeason: 'Oct - Mar',
    highlights: ['Kandariya Mahadeva Temple', 'Western Group of Temples', 'Sound & Light Show', 'Raneh Waterfalls'],
  },
  {
    id: 'rishikesh-himalayas',
    title: 'Rishikesh & Sacred Ganga Foothills',
    tagline: 'Yoga Capital of the World, Ram Jhula Suspensions & Himalayan Waters',
    city: 'Rishikesh',
    cityId: 'rishikesh',
    state: 'Uttarakhand',
    region: 'Garhwal Himalayas',
    category: 'spiritual',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?w=1600&auto=format&fit=crop&q=85',
    badge: 'Yoga Capital of the World',
    bestSeason: 'Sep - Nov & Mar - May',
    highlights: ['Triveni Ghat Evening Aarti', 'Lakshman Jhula Footbridge', 'Beatles Ashram Murals', 'Neelkanth Mahadev'],
  },
];

export const INCREDIBLE_INDIA_VIDEO_THEMES = HERITAGE_CIRCUIT_DESTINATIONS;

interface IncredibleIndiaVideoGalleryProps {
  onSelectDestination: (cityId: string, cityName: string) => void;
  selectedCityId?: string;
}

export const IncredibleIndiaVideoGallery: React.FC<IncredibleIndiaVideoGalleryProps> = ({
  onSelectDestination,
  selectedCityId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpandedMode, setIsExpandedMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'unesco' | 'royal' | 'spiritual' | 'coastal' | 'himalayan'>('all');
  const [mediaMode, setMediaMode] = useState<'photo' | 'video'>('photo');

  // Filter destinations based on category
  const filteredDestinations = HERITAGE_CIRCUIT_DESTINATIONS.filter((d) =>
    selectedCategory === 'all' ? true : d.category === selectedCategory
  );

  const total = filteredDestinations.length;
  const current = filteredDestinations[currentIndex] || filteredDestinations[0] || HERITAGE_CIRCUIT_DESTINATIONS[0];

  // Keep index within bounds if category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // If a city was selected externally, jump to its slide if matched
  useEffect(() => {
    if (!selectedCityId) return;
    const matchIndex = filteredDestinations.findIndex(
      (d) => d.cityId.toLowerCase() === selectedCityId.toLowerCase()
    );
    if (matchIndex !== -1) {
      setCurrentIndex(matchIndex);
    }
  }, [selectedCityId, filteredDestinations]);

  // Auto-move rotation timer: smoothly advances every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const hasVideo = Boolean(current.videoUrl);

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden shadow-sm border border-stone-200/90 bg-stone-50 text-stone-800 transition-all duration-500 group select-none ${
        isExpandedMode
          ? 'h-[560px] sm:h-[620px] lg:h-[700px]'
          : 'h-[440px] sm:h-[500px] lg:h-[560px]'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="incredible-india-living-gallery"
    >
      {/* 1. BACKGROUND MEDIA: HIGH-RES PHOTOGRAPH OR MOTION VIDEO */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-stone-100">
        {mediaMode === 'video' && hasVideo ? (
          <video
            key={current.videoUrl}
            src={current.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover animate-fadeIn"
          />
        ) : (
          <img
            key={current.imageUrl}
            src={current.imageUrl}
            alt={current.title}
            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            loading="eager"
          />
        )}

        {/* Luminous Light Sunlit Vignette Gradients for Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent pointer-events-none" />
      </div>

      {/* 2. TOP HEADER BAR: TITLE, EXPAND TOGGLE & CIRCUIT FILTERS */}
      <div className="relative z-20 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 bg-white/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FF671F] text-white flex items-center justify-center font-bold text-sm shadow-md shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                <span>Living Heritage Circuit Showcase</span>
                <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#FF671F] border border-orange-200 text-[10px] font-mono font-bold">
                  {currentIndex + 1}/{total}
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-stone-600 hidden sm:block">
              Auto-advancing journey across Bharat's most iconic UNESCO monuments & royal circuits
            </p>
          </div>
        </div>

        {/* Controls: Category Filter Tabs, Media Mode & Expand Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter Pills */}
          <div className="hidden md:inline-flex p-0.5 rounded-xl bg-stone-100/90 backdrop-blur-md border border-stone-200 text-[11px]">
            {[
              { id: 'all', label: 'All' },
              { id: 'unesco', label: 'UNESCO' },
              { id: 'royal', label: 'Royal Forts' },
              { id: 'spiritual', label: 'Spiritual' },
              { id: 'coastal', label: 'Coastal' },
              { id: 'himalayan', label: 'Himalayan' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF671F] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Media Mode Toggle (Photo vs Video) */}
          {hasVideo && (
            <button
              onClick={() => setMediaMode((prev) => (prev === 'photo' ? 'video' : 'photo'))}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition cursor-pointer ${
                mediaMode === 'video'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-white/90 text-stone-700 border-stone-200 hover:bg-white hover:text-stone-900 shadow-2xs'
              }`}
              title={mediaMode === 'video' ? 'Switch to High-Res Photo' : 'Switch to Motion Video Tour'}
            >
              {mediaMode === 'video' ? (
                <>
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">Photo</span>
                </>
              ) : (
                <>
                  <Film className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span className="hidden sm:inline">Motion</span>
                </>
              )}
            </button>
          )}

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 rounded-xl bg-white/90 hover:bg-white border border-stone-200 text-stone-700 hover:text-stone-900 transition cursor-pointer shadow-2xs"
            title={isPaused ? 'Resume Auto-Advance' : 'Pause Auto-Advance'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-stone-800" /> : <Pause className="w-3.5 h-3.5 text-stone-800" />}
          </button>

          {/* Expand / Collapse Gallery Toggle */}
          <button
            onClick={() => setIsExpandedMode((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title={isExpandedMode ? 'Standard Height' : 'Expand Gallery View'}
          >
            {isExpandedMode ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#FF671F]" />
                <span className="hidden sm:inline">Compact</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#FF671F]" />
                <span className="hidden sm:inline">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. MAIN CENTER CONTENT: EXPANDED DESTINATION SPOTLIGHT */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-12 pt-4 sm:pt-6 pb-24 flex flex-col justify-end h-[calc(100%-120px)]">
        <div className="max-w-3xl space-y-3 sm:space-y-4 animate-fadeIn">
          {/* Badges: Location & UNESCO Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 text-stone-800 text-xs font-bold shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
              {current.city}, {current.state}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50/95 backdrop-blur-md border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              {current.badge}
            </span>

            {current.unescoNumber && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50/95 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-semibold">
                {current.unescoNumber}
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-stone-700 text-[11px]">
              <Calendar className="w-3 h-3 text-[#FF671F]" />
              Best Season: {current.bestSeason}
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              {current.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 max-w-2xl font-medium leading-relaxed">
              {current.tagline}
            </p>
          </div>

          {/* Highlights Tag Cloud */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {current.highlights.map((hl, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-stone-200/90 text-stone-800 text-xs font-medium shadow-2xs"
              >
                • {hl}
              </span>
            ))}
          </div>

          {/* Action Callouts */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onSelectDestination(current.cityId, current.city)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Plan {current.city} Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectDestination(current.cityId, current.city)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-200 shadow-xs transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#FF671F]" />
              <span>Explore Circuit Stops</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. PREV / NEXT CHEVRON BUTTONS */}
      <button
        onClick={handlePrev}
        aria-label="Previous destination"
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-stone-200 text-stone-800 flex items-center justify-center transition cursor-pointer shadow-md"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next destination"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-stone-200 text-stone-800 flex items-center justify-center transition cursor-pointer shadow-md"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* 5. BOTTOM CAROUSEL THUMBNAIL RIBBON & TIMER PROGRESS */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col gap-2">
        {/* Progress Bar for Auto-rotation */}
        <div className="w-full bg-stone-200/80 h-1 rounded-full overflow-hidden">
          <div
            key={currentIndex}
            className={`h-full bg-[#FF671F] transition-all ${
              isPaused ? 'w-full opacity-40' : 'w-full animate-[shrink_5s_linear]'
            }`}
          />
        </div>

        {/* Scrollable Mini Thumbnail Reel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredDestinations.map((dest, idx) => (
            <button
              key={dest.id}
              onClick={() => setCurrentIndex(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-left shrink-0 transition-all cursor-pointer backdrop-blur-md ${
                currentIndex === idx
                  ? 'bg-orange-50 text-stone-900 shadow-sm border-2 border-[#FF671F]'
                  : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-900 border border-stone-200 shadow-2xs'
              }`}
            >
              <img
                src={dest.imageUrl}
                alt={dest.city}
                className="w-6 h-6 rounded-md object-cover"
              />
              <div className="leading-tight">
                <div className="text-[11px] font-bold truncate max-w-[100px] text-stone-900">
                  {dest.city}
                </div>
                <div className="text-[9px] truncate max-w-[100px] text-stone-500">
                  {dest.state}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
