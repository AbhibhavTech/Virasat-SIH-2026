import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Hotel,
  Palmtree,
  Car,
  Train,
  UtensilsCrossed,
  Landmark,
  Sparkles,
} from 'lucide-react';

export interface HeritageCircuitDestination {
  id: string;
  title: string;
  tagline: string;
  city: string;
  cityId: string;
  state: string;
  region: string;
  category: 'hotels' | 'resorts' | 'taxis' | 'trains' | 'restaurants' | 'monuments';
  imageUrl: string;
  badge: string;
  featureLabel: string;
  iconName: 'hotel' | 'palmtree' | 'car' | 'train' | 'utensils' | 'landmark';
  highlights: string[];
  imagePosition?: string;
}

export const HERITAGE_CIRCUIT_DESTINATIONS: HeritageCircuitDestination[] = [
  {
    id: 'lotus-temple',
    title: 'Lotus Temple (Baháʼí House of Worship)',
    tagline: 'Iconic pure white marble petals, tranquil reflecting pools, and universal sanctuary of peace in the heart of Delhi.',
    city: 'New Delhi',
    cityId: 'delhi',
    state: 'Delhi NCR',
    region: 'National Capital Region',
    category: 'monuments',
    imageUrl: '/images/lotus-temple-delhi.png',
    badge: 'Architectural Wonder & Sacred Landmark',
    featureLabel: 'Lotus Temple',
    iconName: 'landmark',
    highlights: ['27 Pure Marble Petals', '9 Tranquil Ponds & Gardens', 'Universal Silent Sanctuary'],
  },
  {
    id: 'indian-railways',
    title: 'Vande Bharat Express & High-Speed Rail',
    tagline: 'Experience world-class semi-high speed transit, aerodynamic executive comfort, and scenic Indian rail corridors.',
    city: 'Pan-India',
    cityId: 'delhi',
    state: 'Indian Railways',
    region: 'National High-Speed Corridors',
    category: 'trains',
    imageUrl: '/images/vande-bharat-express.jpg',
    badge: 'Indian Railways & Vande Bharat',
    featureLabel: 'Trains',
    iconName: 'train',
    highlights: ['Vande Bharat Express', 'Vistadome Glass Cars', 'IRCTC Executive Connectivity'],
    imagePosition: 'object-right lg:object-center',
  },
  {
    id: 'nature-resorts',
    title: 'Mountain Eco-Resorts & Plantation Stays',
    tagline: 'Unwind under majestic misty peaks in authentic thatched cottages, spice plantation bungalows, and forest retreats.',
    city: 'Wayanad & Munnar',
    cityId: 'kochi',
    state: 'Kerala',
    region: 'Western Ghats Eco-Circuits',
    category: 'resorts',
    imageUrl: '/images/mountain-eco-resort.jpg',
    badge: 'Hillside Eco-Resorts & Nature Villas',
    featureLabel: 'Resorts',
    iconName: 'palmtree',
    highlights: ['Traditional Thatched Cottages', 'Misty Mountain Panoramas', 'Ayurveda Wellness Retreats'],
  },
  {
    id: 'heritage-hotels',
    title: 'Royal Palace Hotels & Heritage Stays',
    tagline: 'Experience timeless Indian hospitality in restored royal havelis, lake palaces, and luxury heritage suites.',
    city: 'Udaipur',
    cityId: 'udaipur',
    state: 'Rajasthan',
    region: 'Royal Rajasthan',
    category: 'hotels',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&auto=format&fit=crop&q=85',
    badge: 'Heritage Hotels & Palaces',
    featureLabel: 'Hotels',
    iconName: 'hotel',
    highlights: ['Royal Palace Suites', 'Verified Heritage Tariffs', 'Courtyard Dining'],
  },
  {
    id: 'tourist-taxis',
    title: 'Prepaid Sightseeing Cabs & Outstation Taxis',
    tagline: 'Fixed tourism rate cards, sanitized AC tourist cabs, and reliable local chauffeurs for seamless point-to-point travel.',
    city: 'Mumbai',
    cityId: 'mumbai',
    state: 'Maharashtra',
    region: 'Konkan Coast',
    category: 'taxis',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&auto=format&fit=crop&q=85',
    badge: 'Verified Cabs & Outstation Taxis',
    featureLabel: 'Taxis',
    iconName: 'car',
    highlights: ['Airport Prepaid Counters', 'AC Outstation Cabs', 'Fixed Tourist Tariffs'],
  },
  {
    id: 'heritage-dining',
    title: 'Royal Thalis & Historic Dining Enclaves',
    tagline: 'Relish 24-dish traditional thalis, royal Awadhi dum-pukht curries, South Indian filter coffee, and iconic street food.',
    city: 'Amritsar',
    cityId: 'amritsar',
    state: 'Punjab',
    region: 'Heart of Punjab',
    category: 'restaurants',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1600&auto=format&fit=crop&q=85',
    badge: 'Authentic Regional Restaurants',
    featureLabel: 'Restaurants',
    iconName: 'utensils',
    highlights: ['24-Dish Heritage Thalis', 'Legendary Food Bazaars', 'Pure Vegetarian Stalls'],
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

  const destinations = HERITAGE_CIRCUIT_DESTINATIONS;
  const total = destinations.length;
  const current = destinations[currentIndex] || destinations[0];

  // Jump to slide if a matching city was selected externally
  useEffect(() => {
    if (!selectedCityId) return;
    const matchIndex = destinations.findIndex(
      (d) => d.cityId.toLowerCase() === selectedCityId.toLowerCase()
    );
    if (matchIndex !== -1) {
      setCurrentIndex(matchIndex);
    }
  }, [selectedCityId, destinations]);

  // Auto-move rotation timer: advances smoothly every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);

    return () => clearInterval(interval);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const renderIcon = (name: HeritageCircuitDestination['iconName']) => {
    switch (name) {
      case 'hotel':
        return <Hotel className="w-3.5 h-3.5 text-[#FF671F]" />;
      case 'palmtree':
        return <Palmtree className="w-3.5 h-3.5 text-emerald-600" />;
      case 'car':
        return <Car className="w-3.5 h-3.5 text-amber-600" />;
      case 'train':
        return <Train className="w-3.5 h-3.5 text-blue-600" />;
      case 'utensils':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-rose-600" />;
      case 'landmark':
        return <Landmark className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />;
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-sm border border-[#EFE8DF] bg-white transition-all duration-300 group select-none h-[460px] sm:h-[520px] lg:h-[580px]"
      id="incredible-india-living-gallery"
    >
      {/* 1. VIBRANT FULL-VIEW PHOTOGRAPH WITH ZERO DARK SCRIMS */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-stone-100">
        <img
          key={current.imageUrl}
          src={current.imageUrl}
          alt={current.title}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/images/lotus-temple-delhi.png') {
              target.src = '/images/lotus-temple-delhi.png';
            }
          }}
          className={`w-full h-full object-cover ${current.imagePosition || 'object-center'} transform scale-100 group-hover:scale-101 transition-transform duration-700 ease-out`}
          loading="eager"
        />

        {/* Soft, ultra-subtle directional wash on the left to ensure floating card contrast without dimming the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent sm:hidden pointer-events-none" />
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-white/80 via-white/15 via-45% to-transparent pointer-events-none" />
      </div>

      {/* 2. FLOATING WHITE THEME CONTENT CARD */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex items-center h-full max-w-xl sm:max-w-2xl pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-md p-5 sm:p-7 space-y-3 sm:space-y-4 animate-fadeIn">
          {/* Badge & Location Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/90 text-amber-950 text-xs font-bold shadow-2xs">
              {renderIcon(current.iconName)}
              <span>{current.badge}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200">
              <MapPin className="w-3 h-3 text-[#FF671F]" />
              <span>{current.city}, {current.state}</span>
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed line-clamp-2">
              {current.tagline}
            </p>
          </div>

          {/* Feature Highlights Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {current.highlights.map((highlight) => (
              <span
                key={highlight}
                className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-[10px] sm:text-[11px] font-medium"
              >
                ✓ {highlight}
              </span>
            ))}
          </div>

          {/* Action CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => onSelectDestination(current.cityId, current.city)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer active:scale-98"
            >
              <span>Explore {current.city} Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. PREV / NEXT NAVIGATION BUTTONS (CLEAN WHITE THEME) */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center transition cursor-pointer hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 text-stone-700" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center transition cursor-pointer hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 text-stone-700" />
      </button>

      {/* 4. BOTTOM CAROUSEL PROGRESS INDICATORS (CLEAN WHITE THEME) */}
      <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex justify-center pointer-events-none">
        <div className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-xs flex items-center gap-1.5">
          {destinations.map((dest, idx) => (
            <button
              key={dest.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}: ${dest.featureLabel}`}
              title={`${dest.featureLabel}: ${dest.city}`}
              className={`rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 h-1.5 bg-[#FF671F]'
                  : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
