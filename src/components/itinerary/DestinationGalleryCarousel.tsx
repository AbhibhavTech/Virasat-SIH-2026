import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  Maximize2,
  X,
  Award,
  Clock,
  Play,
  Pause,
  Ticket,
  SlidersHorizontal,
} from 'lucide-react';

export interface DestinationHighlight {
  id: string;
  title: string;
  subtitle: string;
  city: string;
  cityId: string;
  state: string;
  region: string;
  category: 'all' | 'unesco' | 'forts' | 'spiritual' | 'nature';
  categoryLabel: string;
  badge: string;
  imageUrl: string;
  tagline: string;
  era: string;
  architecture: string;
  highlights: string[];
  bestTime: string;
  entryFee: string;
  timings: string;
  nearestTransit: string;
}

export const DESTINATION_HIGHLIGHTS: DestinationHighlight[] = [
  {
    id: 'taj-mahal',
    title: 'Taj Mahal & Agra Fort',
    subtitle: 'The Epitome of Mughal Architecture & Eternal Love',
    city: 'Agra',
    cityId: 'agra',
    state: 'Uttar Pradesh',
    region: 'The Golden Triangle',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    badge: 'Wonder of the World',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Flawless white Makrana marble mausoleum set in formal Mughal Charbagh gardens along the sacred Yamuna River.',
    era: '1632 – 1648 AD (Emperor Shah Jahan)',
    architecture: 'Mughal Architecture with Pietra Dura Marble Inlay',
    highlights: ['Reflecting pools with sunrise glow', 'Intricate lapis lazuli & jade inlays', 'Adjacent red sandstone Agra Fort'],
    bestTime: 'October to March (Sunrise & Sunset)',
    entryFee: '₹50 (Indian citizens) / ₹1,100 (Foreign tourists)',
    timings: '30 mins before sunrise to 30 mins before sunset (Closed Fridays)',
    nearestTransit: 'Agra Cantt Railway Station (5 km) / Kheria Airport',
  },
  {
    id: 'hawa-mahal',
    title: 'Hawa Mahal & Amber Fort',
    subtitle: 'Honeycomb Crown of Jaipur & Hilltop Rajput Fortresses',
    city: 'Jaipur',
    cityId: 'jaipur',
    state: 'Rajasthan',
    region: 'Royal Rajputana Circuit',
    category: 'forts',
    categoryLabel: 'Palaces & Fortresses',
    badge: 'UNESCO World Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&auto=format&fit=crop&q=80',
    tagline: '953 intricately carved pink sandstone jharokhas designed for royal winds and royal processions.',
    era: '1799 AD (Maharaja Sawai Pratap Singh)',
    architecture: 'Rajput-Mughal Fusion with Pink Sandstone Lattice',
    highlights: ['Sheesh Mahal (Palace of Mirrors) at Amber', 'Bespoke natural cooling wind facade', 'Panoramic views of Pink City bazaar'],
    bestTime: 'October to March (Early mornings)',
    entryFee: '₹50 (Indian citizens) / ₹200 (Foreign tourists)',
    timings: '9:00 AM – 4:30 PM daily',
    nearestTransit: 'Jaipur Junction (4.5 km) / Jaipur International Airport',
  },
  {
    id: 'varanasi-ghats',
    title: 'Sacred Ghats & Ganga Aarti',
    subtitle: 'The Spiritual Soul of Bharat along the River Ganges',
    city: 'Varanasi',
    cityId: 'varanasi',
    state: 'Uttar Pradesh',
    region: 'Sacred Heart of India',
    category: 'spiritual',
    categoryLabel: 'Spiritual & Sacred',
    badge: 'Oldest Living City',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Ethereal evening brass lamp ceremonies, conch shells, and boat rides along 84 historic stone riverfronts.',
    era: 'Over 3,000 years of continuous cultural living heritage',
    architecture: 'North Indian Riverfront Ghats & Sandstone Pavilions',
    highlights: ['Grand Maha Aarti at Dashashwamedh Ghat', 'Subah-e-Banaras dawn rowing cruise', 'Ancient silk weaver galis & kachori lanes'],
    bestTime: 'November to February (Evening Aarti at 6:30 PM)',
    entryFee: 'Free public entry / Boat tours ₹300 – ₹800',
    timings: 'Open 24/7 (Ganga Aarti at sunset)',
    nearestTransit: 'Varanasi Junction (4 km) / Lal Bahadur Shastri Airport',
  },
  {
    id: 'meenakshi-temple',
    title: 'Meenakshi Amman Temple',
    subtitle: 'Soaring Dravidian Gopurams & Sacred Thousand Pillar Hall',
    city: 'Madurai',
    cityId: 'madurai',
    state: 'Tamil Nadu',
    region: 'Dravidian Temple Heartland',
    category: 'spiritual',
    categoryLabel: 'Spiritual & Sacred',
    badge: 'Living Dravidian Marvel',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
    tagline: '14 towering gateway pyramids painted with thousands of stucco mythological deities and golden lotus tank.',
    era: '6th Century BCE origins, expanded 16th – 17th Century by Nayak rulers',
    architecture: 'Dravidian Temple Architecture with Monolithic Sculptures',
    highlights: ['Ayiram Kaal Mandapam (1000 Pillar Hall)', 'Golden Lotus Sacred Pond (Porthamarai Kulam)', 'Musical Pillars that produce musical notes'],
    bestTime: 'October to March (Pooja rituals at dawn & dusk)',
    entryFee: 'Free entry to shrine / ₹50 for Thousand Pillar Hall',
    timings: '5:00 AM – 12:30 PM & 4:00 PM – 10:00 PM',
    nearestTransit: 'Madurai Junction (1.5 km) / Madurai Airport (12 km)',
  },
  {
    id: 'gateway-mumbai',
    title: 'Gateway of India & Colaba',
    subtitle: 'Indo-Saracenic Monument along the Arabian Sea',
    city: 'Mumbai',
    cityId: 'mumbai',
    state: 'Maharashtra',
    region: 'Konkan Coastline',
    category: 'forts',
    categoryLabel: 'Palaces & Fortresses',
    badge: 'National Gateway Landmark',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Historic yellow basalt archway framing Mumbai harbor, the iconic Taj Mahal Palace Hotel, and Victorian heritage.',
    era: '1911 – 1924 AD (Architect George Wittet)',
    architecture: 'Indo-Saracenic with Gujarati 16th-Century Influences',
    highlights: ['Ferry departure to Elephanta Caves UNESCO site', 'Breeze stroll on the Apollo Bunder promenade', 'Historic art deco cinema & Kala Ghoda art precinct'],
    bestTime: 'November to February (Sunset & late evening)',
    entryFee: 'Free public promenade / Elephanta ferry ₹260 return',
    timings: 'Open 24 hours (Lighting up at dusk)',
    nearestTransit: 'Churchgate & CSMT Stations (2.5 km) / Mumbai Airport',
  },
  {
    id: 'ellora-caves',
    title: 'Kailasa Temple & Ellora Caves',
    subtitle: 'Monolithic Rock-Cut Temple Carved from a Single Mountain',
    city: 'Chhatrapati Sambhajinagar',
    cityId: 'sambhajinagar',
    state: 'Maharashtra',
    region: 'Deccan Heritage Trail',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    badge: 'Engineering Wonder',
    imageUrl: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Over 200,000 tonnes of basalt rock scooped out top-down in Cave 16 to create the world\'s largest monolithic temple.',
    era: '8th Century AD (Rashtrakuta Dynasty, King Krishna I)',
    architecture: 'Rock-Cut Dravidian Monolithic Architecture',
    highlights: ['Multilevel courtyards carved from a single cliff', 'Massive freestanding stone elephants and victory pillars', '34 Buddhist, Hindu, and Jain cave monasteries'],
    bestTime: 'July to March (Pleasant weather during monsoon & winter)',
    entryFee: '₹40 (Indian citizens) / ₹600 (Foreign tourists)',
    timings: '6:00 AM – 6:00 PM (Closed Tuesdays)',
    nearestTransit: 'Aurangabad Railway Station (30 km) / Chhatrapati Sambhajinagar Airport',
  },
  {
    id: 'hampi-ruins',
    title: 'Virupaksha & Stone Chariot',
    subtitle: 'Sublime Granite Boulders & Capital of Vijayanagara',
    city: 'Hampi',
    cityId: 'hampi',
    state: 'Karnataka',
    region: 'Tungabhadra Heritage Basin',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    badge: 'Open-Air Museum',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Surreal granite boulder landscapes sheltering royal pavilions, ancient aqueducts, and the iconic Garuda stone chariot.',
    era: '14th – 16th Century AD (Vijayanagara Empire)',
    architecture: 'Vijayanagara Style Granite Temple Architecture',
    highlights: ['Vittala Temple musical pillars and Stone Chariot', 'Sunrise panorama from Matanga Hill', 'Active 7th-century Virupaksha temple complex'],
    bestTime: 'October to February (Hampi Utsav cultural festival)',
    entryFee: '₹40 (Indian citizens) / ₹600 (Foreign tourists)',
    timings: '6:00 AM – 6:00 PM daily',
    nearestTransit: 'Hospet Junction Railway Station (13 km)',
  },
  {
    id: 'golden-temple',
    title: 'Harmandir Sahib (Golden Temple)',
    subtitle: 'Gleaming Gold Sanctuary of Universal Peace & Langar',
    city: 'Amritsar',
    cityId: 'amritsar',
    state: 'Punjab',
    region: 'Heart of Punjab',
    category: 'spiritual',
    categoryLabel: 'Spiritual & Sacred',
    badge: 'Universal Sanctuary',
    imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Pure 24-karat gold gilded sanctum standing in the holy Amrit Sarovar, serving free meals to over 100,000 visitors daily.',
    era: '1581 – 1604 AD (Guru Ram Das & Guru Arjan)',
    architecture: 'Sikh Architecture with Marble Inlay & Gold Foil Leafing',
    highlights: ['World\'s largest community kitchen (Guru Ram Das Langar)', 'Palki Sahib nightly ceremony at 9:30 PM', 'Central Sikh Museum & sacred parikrama pathway'],
    bestTime: 'October to March (Illuminated at night)',
    entryFee: 'Free entry for all human beings regardless of faith',
    timings: 'Open 24 hours, 365 days a year',
    nearestTransit: 'Amritsar Junction (2 km) / Sri Guru Ram Dass Jee Airport',
  },
  {
    id: 'alleppey-backwaters',
    title: 'Kerala Emerald Backwaters',
    subtitle: 'Lush Palm Canals, Kettuvallam Boats & Coastal Lagoons',
    city: 'Kochi',
    cityId: 'kochi',
    state: 'Kerala',
    region: 'Malabar & Backwaters',
    category: 'nature',
    categoryLabel: 'Coastal & Nature',
    badge: 'God\'s Own Country',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Meandering labyrinth of over 900 km of interconnected waterways, coconut fringed villages, and coir handicraft huts.',
    era: 'Historic spice and coir trade waterways',
    architecture: 'Traditional Kettuvallam (Anjili Wood) Houseboat Craft',
    highlights: ['Overnight traditional houseboat cruise with Kerala sadhya', 'Shikara canoe rides through narrow village canals', 'Kumarakom bird sanctuary & paddy fields'],
    bestTime: 'September to March (Nehru Trophy boat race in August)',
    entryFee: 'Free public waterways / Houseboat packages ₹7,000 – ₹15,000',
    timings: 'Day cruises 9:00 AM – 5:30 PM',
    nearestTransit: 'Alappuzha Railway Station (4 km) / Cochin Airport (75 km)',
  },
  {
    id: 'qutub-minar',
    title: 'Qutub Minar & Mughal Delhi',
    subtitle: '73m Fluted Red Sandstone Minaret of the Delhi Sultanate',
    city: 'Delhi',
    cityId: 'delhi',
    state: 'Delhi NCR',
    region: 'Capital Heritage Hub',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    badge: 'Tallest Brick Minaret',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Towering five-story minaret adorned with Arabic calligraphy, surrounded by the 1,600-year-old rust-resistant Iron Pillar.',
    era: '1199 – 1220 AD (Qutb-ud-din Aibak & Iltutmish)',
    architecture: 'Indo-Islamic Architecture with Sandstone Balconies',
    highlights: ['Alai Darwaza gateway & Quwwat-ul-Islam mosque', 'Ancient Gupta period rustless Iron Pillar of Delhi', 'Night illumination with heritage light walk'],
    bestTime: 'October to March (Late afternoon sunset glow)',
    entryFee: '₹40 (Indian citizens) / ₹600 (Foreign tourists)',
    timings: '7:00 AM – 9:00 PM daily (Evening illumination)',
    nearestTransit: 'Qutub Minar Metro Station (Yellow Line, 1.5 km)',
  },
  {
    id: 'mysore-palace',
    title: 'Mysore Palace (Amba Vilas)',
    subtitle: 'Opulent Seat of the Wadiyar Dynasty & Golden Throne',
    city: 'Mysuru',
    cityId: 'mysuru',
    state: 'Karnataka',
    region: 'South Deccan Royalty',
    category: 'forts',
    categoryLabel: 'Palaces & Fortresses',
    badge: 'Royal Grandeur',
    imageUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Magnificent palace with stained glass ceilings, Belgian crystal mirrors, carved mahogany, and 100,000 night lights.',
    era: '1897 – 1912 AD (British Architect Henry Irwin)',
    architecture: 'Indo-Saracenic Blend of Hindu, Muslim, Rajput & Gothic',
    highlights: ['Gombe Thotti doll pavilion & Kalyana Mantapa marriage hall', 'Sunday evening grand illumination of 97,000 bulbs', 'Annual world-famous Mysore Dasara royal procession'],
    bestTime: 'October to March (Sunday evening 7:00 PM – 7:45 PM)',
    entryFee: '₹100 (Indian adults) / ₹50 (Children) / ₹200 (Foreigners)',
    timings: '10:00 AM – 5:30 PM daily (Illumination Sundays 7 PM)',
    nearestTransit: 'Mysuru Junction (2 km) / Kempegowda Airport Bengaluru',
  },
  {
    id: 'konark-sun-temple',
    title: 'Konark Sun Temple',
    subtitle: 'The 13th-Century Stone Chariot of Surya Bhagwan',
    city: 'Puri',
    cityId: 'puri',
    state: 'Odisha',
    region: 'Eastern Coastal Heritage',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    badge: 'Black Pagoda of Surya',
    imageUrl: 'https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?w=1200&auto=format&fit=crop&q=80',
    tagline: 'Monumental chariot carved from Khondalite stone with 24 intricate sundial wheels pulled by seven galloping horses.',
    era: '1250 AD (Eastern Ganga Dynasty King Narasimhadeva I)',
    architecture: 'Kalinga Temple Architecture with Sculptural Reliefs',
    highlights: ['Precision astronomical sundial wheels telling exact time', 'Natya Mandapa dance hall with celestial musician carvings', 'Chandrabhaga beach and marine sunrise view'],
    bestTime: 'November to February (Annual Konark Dance Festival)',
    entryFee: '₹40 (Indian citizens) / ₹600 (Foreign tourists)',
    timings: '6:00 AM – 8:00 PM daily',
    nearestTransit: 'Puri Railway Station (35 km) / Biju Patnaik Airport Bhubaneswar',
  },
];

interface DestinationGalleryCarouselProps {
  onSelectDestination: (cityId: string, cityName: string) => void;
  selectedCityId?: string;
}

export const DestinationGalleryCarousel: React.FC<DestinationGalleryCarouselProps> = ({
  onSelectDestination,
  selectedCityId,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'unesco' | 'forts' | 'spiritual' | 'nature'>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [selectedHighlight, setSelectedHighlight] = useState<DestinationHighlight | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  // Filter items by category
  const filteredHighlights = React.useMemo(() => {
    if (activeCategory === 'all') return DESTINATION_HIGHLIGHTS;
    return DESTINATION_HIGHLIGHTS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Update active slide index based on scroll position
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.querySelector('.carousel-card')?.clientWidth || 340;
    const gap = 16;
    const newIndex = Math.round(scrollPosition / (cardWidth + gap));
    setActiveSlideIndex(Math.max(0, Math.min(newIndex, filteredHighlights.length - 1)));
  }, [filteredHighlights.length]);

  // Scroll to a specific card index
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll('.carousel-card');
    if (cards[index]) {
      const targetCard = cards[index] as HTMLElement;
      container.scrollTo({
        left: targetCard.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
      setActiveSlideIndex(index);
    }
  }, []);

  // Navigation handlers
  const handlePrev = () => {
    const prevIndex = activeSlideIndex > 0 ? activeSlideIndex - 1 : filteredHighlights.length - 1;
    scrollToIndex(prevIndex);
  };

  const handleNext = useCallback(() => {
    const nextIndex = activeSlideIndex < filteredHighlights.length - 1 ? activeSlideIndex + 1 : 0;
    scrollToIndex(nextIndex);
  }, [activeSlideIndex, filteredHighlights.length, scrollToIndex]);

  // Touch Swipe Handlers (Mobile / Tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoplay(false);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartXRef.current - touchEndXRef.current;
    const threshold = 40; // minimum distance to trigger slide
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Mouse Drag to Scroll Handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    setIsAutoplay(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // drag multiplier
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  // Autoplay effect
  useEffect(() => {
    if (!isAutoplay || selectedHighlight !== null) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoplay, handleNext, selectedHighlight]);

  // Reset scroll when category filter changes
  useEffect(() => {
    setActiveSlideIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <section className="w-full space-y-4">
      {/* 1. SECTION HEADER (INCREDIBLE INDIA THEME) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
            <span>Curated Heritage Gallery • अतुल्य भारत</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
            <span>Explore Destination Highlights</span>
            <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              {filteredHighlights.length} Monuments
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl font-light">
            Swipe or slide through India&apos;s most celebrated UNESCO landmarks, royal fortresses, and living cultural sanctuaires. Click any highlight to auto-plan your trip.
          </p>
        </div>

        {/* Carousel Control Buttons (Arrows + Autoplay + Counter) */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-end">
          {/* Active slide counter */}
          <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-mono font-semibold text-stone-700">
            <span className="text-[#FF671F]">
              {String(activeSlideIndex + 1).padStart(2, '0')}
            </span>{' '}
            <span className="text-stone-400">/</span>{' '}
            <span>{String(filteredHighlights.length).padStart(2, '0')}</span>
          </div>

          {/* Autoplay Pause / Play Toggle */}
          <button
            onClick={() => setIsAutoplay((prev) => !prev)}
            title={isAutoplay ? 'Pause auto-sliding' : 'Start auto-sliding'}
            className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 transition shadow-xs cursor-pointer"
            aria-label={isAutoplay ? 'Pause autoplay' : 'Start autoplay'}
          >
            {isAutoplay ? (
              <Pause className="w-4 h-4 text-[#FF671F]" />
            ) : (
              <Play className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-[#FF671F] transition shadow-xs cursor-pointer active:scale-95"
            aria-label="Previous destination"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={handleNext}
            className="p-2 sm:p-2.5 rounded-xl bg-[#FF671F] hover:bg-[#e05814] text-white transition shadow-sm cursor-pointer active:scale-95"
            aria-label="Next destination"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CATEGORY FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-stone-400 font-medium flex items-center gap-1 shrink-0 pl-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {[
          { id: 'all', label: 'All Highlights' },
          { id: 'unesco', label: 'UNESCO World Heritage' },
          { id: 'forts', label: 'Forts & Palaces' },
          { id: 'spiritual', label: 'Sacred Temples' },
          { id: 'nature', label: 'Coastal & Nature' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as typeof activeCategory)}
            className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition cursor-pointer shrink-0 border ${
              activeCategory === cat.id
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. SWIPEABLE CAROUSEL TRACK */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-0.5 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {filteredHighlights.map((item, index) => {
          const isSelectedCity =
            selectedCityId &&
            (selectedCityId.toLowerCase() === item.cityId.toLowerCase() ||
              selectedCityId.toLowerCase() === item.city.toLowerCase());

          return (
            <div
              key={item.id}
              className="carousel-card snap-start shrink-0 w-[290px] sm:w-[340px] md:w-[370px] rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Image Container with Badges */}
              <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-stone-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Ambient vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{item.badge}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHighlight(item);
                    }}
                    title="View Monument Details"
                    className="p-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-stone-200 hover:text-white backdrop-blur-md border border-white/20 transition cursor-pointer shadow-sm"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* City & State location badge (bottom-left of image) */}
                <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium mb-0.5">
                    <MapPin className="w-3 h-3 text-[#FF671F]" />
                    <span>
                      {item.city}, {item.state}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-stone-300 text-[10px]">{item.region}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif leading-tight drop-shadow-sm line-clamp-1">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Body Information */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <div className="space-y-2.5">
                  {/* Tagline / Architectural description */}
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.tagline}
                  </p>

                  {/* Highlights pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {item.highlights.slice(0, 2).map((hl, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200/60 line-clamp-1"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>

                  {/* Quick Metadata: Best time & Entry */}
                  <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF671F] shrink-0" />
                      <span className="truncate">{item.bestTime.split('(')[0].trim()}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Ticket className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.entryFee.split('/')[0].trim()}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectDestination(item.cityId, item.city)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      isSelectedCity
                        ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                        : 'bg-stone-900 hover:bg-[#FF671F] text-white shadow-xs'
                    }`}
                  >
                    <span>
                      {isSelectedCity ? `Currently Selected (${item.city})` : `Plan Trip to ${item.city}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. PROGRESS DOTS & DRAG HINT */}
      <div className="flex items-center justify-between gap-4 pt-1 px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {filteredHighlights.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlideIndex === idx
                  ? 'w-6 bg-[#FF671F]'
                  : 'w-1.5 bg-stone-200 hover:bg-stone-300'
              }`}
            />
          ))}
        </div>

        <div className="text-[11px] text-stone-400 font-light flex items-center gap-1 shrink-0">
          <span>👈 Swipe or drag to view all {filteredHighlights.length} destinations</span>
        </div>
      </div>

      {/* 5. HERITAGE INSPECTOR LIGHTBOX / MODAL (INCREDIBLE INDIA AESTHETIC) */}
      {selectedHighlight && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedHighlight(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 text-stone-900 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Hero Banner */}
            <div className="relative h-64 sm:h-72 w-full bg-stone-950 shrink-0">
              <img
                src={selectedHighlight.imageUrl}
                alt={selectedHighlight.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedHighlight(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-md border border-white/20 transition cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header over Image */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{selectedHighlight.badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
                  {selectedHighlight.title}
                </h3>
                <p className="text-xs text-stone-300 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span>
                    {selectedHighlight.city}, {selectedHighlight.state} ({selectedHighlight.region})
                  </span>
                </p>
              </div>
            </div>

            {/* Modal Body with Detailed Heritage Insights */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Historical & Architectural Summary
                </h4>
                <p className="text-stone-700 leading-relaxed font-light">
                  {selectedHighlight.tagline}
                </p>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Historical Era
                  </span>
                  <span className="font-semibold text-stone-900 text-xs">
                    {selectedHighlight.era}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Architectural Style
                  </span>
                  <span className="font-semibold text-stone-900 text-xs">
                    {selectedHighlight.architecture}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Timings & Schedule
                  </span>
                  <span className="font-semibold text-stone-900 text-xs">
                    {selectedHighlight.timings}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Entry Fee Tariff
                  </span>
                  <span className="font-semibold text-stone-900 text-xs">
                    {selectedHighlight.entryFee}
                  </span>
                </div>
              </div>

              {/* Highlights List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Visitor Highlights & Recommendations
                </h4>
                <ul className="space-y-1.5">
                  {selectedHighlight.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Transit info */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
                <Compass className="w-4 h-4 text-[#FF671F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Nearest Transit: </span>
                  <span>{selectedHighlight.nearestTransit}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedHighlight(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-white transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectDestination(selectedHighlight.cityId, selectedHighlight.city);
                  setSelectedHighlight(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#e05814] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Create {selectedHighlight.city} Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
