import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  ArrowRight,
  Landmark,
  Compass,
  Map,
  MessageSquare,
  Sparkles,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Navigation,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  Layers,
  Bot
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { PlaceSummary } from '../../types';
import { api } from '../../services/api';
import {
  AshokaChakra,
  FlowingTricolourRibbon,
  IncredibleIndiaBadge,
  HeritageSkylineSilhouette,
  VirasatLogoMark,
  NorthIndiaIcon,
  SouthIndiaIcon,
  EastIndiaIcon,
  WestIndiaIcon,
  CentralIndiaIcon,
  NortheastIndiaIcon,
  IndiaIllustratedMapGraphic,
  RoyalBengalTigerEmblem,
} from '../common/TricolourBranding';
import { IndiaHeritageMapPreview } from './IndiaHeritageMapPreview';
import { ScrollReveal } from '../common/ScrollReveal';
import { getMonumentRealImage } from '../../data/monumentRealImages';

interface VirasatDashboardProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: NavTab) => void;
  onSelectPlace?: (placeId: string) => void;
  onSelectCity?: (city: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
  places?: PlaceSummary[];
}

// -------------------------------------------------------------
// Vector Icons & Silhouettes
// -------------------------------------------------------------
const HeroBranchFoliage: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 320 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} pointer-events-none select-none`}
    aria-hidden="true"
  >
    {/* Dark woody bough flowing from top-left */}
    <path
      d="M-30 -20 C40 15, 110 20, 180 12 C230 6, 270 24, 310 14"
      stroke="#2D1E12"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M80 16 C120 48, 170 60, 210 82"
      stroke="#3E2723"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M175 14 C205 38, 240 44, 270 68"
      stroke="#3E2723"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M30 4 C50 35, 75 55, 95 75"
      stroke="#3E2723"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Lush Green Leaves in layered natural tones */}
    <g fill="#1B5E20" opacity="0.95">
      <ellipse cx="60" cy="28" rx="18" ry="9" transform="rotate(25 60 28)" />
      <ellipse cx="100" cy="38" rx="20" ry="10" transform="rotate(35 100 38)" />
      <ellipse cx="145" cy="42" rx="22" ry="11" transform="rotate(15 145 42)" />
      <ellipse cx="190" cy="32" rx="19" ry="10" transform="rotate(-10 190 32)" />
      <ellipse cx="235" cy="26" rx="20" ry="10" transform="rotate(20 235 26)" />
      <ellipse cx="280" cy="22" rx="18" ry="9" transform="rotate(40 280 22)" />
      <ellipse cx="310" cy="28" rx="15" ry="8" transform="rotate(50 310 28)" />
    </g>
    <g fill="#2E7D32" opacity="0.9">
      <ellipse cx="120" cy="62" rx="20" ry="10" transform="rotate(45 120 62)" />
      <ellipse cx="165" cy="72" rx="22" ry="10" transform="rotate(30 165 72)" />
      <ellipse cx="210" cy="88" rx="20" ry="9" transform="rotate(20 210 88)" />
      <ellipse cx="245" cy="56" rx="18" ry="10" transform="rotate(35 245 56)" />
      <ellipse cx="290" cy="50" rx="16" ry="9" transform="rotate(15 290 50)" />
      <ellipse cx="195" cy="52" rx="18" ry="9" transform="rotate(-25 195 52)" />
      <ellipse cx="80" cy="68" rx="17" ry="9" transform="rotate(40 80 68)" />
    </g>
    <g fill="#388E3C" opacity="0.85">
      <ellipse cx="40" cy="20" rx="15" ry="8" transform="rotate(10 40 20)" />
      <ellipse cx="138" cy="52" rx="17" ry="9" transform="rotate(20 138 52)" />
      <ellipse cx="225" cy="74" rx="17" ry="8" transform="rotate(40 225 74)" />
      <ellipse cx="265" cy="38" rx="15" ry="8" transform="rotate(-15 265 38)" />
      <ellipse cx="178" cy="85" rx="16" ry="8" transform="rotate(10 178 85)" />
    </g>
    <g fill="#66BB6A" opacity="0.8">
      <ellipse cx="105" cy="26" rx="13" ry="7" transform="rotate(25 105 26)" />
      <ellipse cx="200" cy="35" rx="13" ry="7" transform="rotate(-5 200 35)" />
      <ellipse cx="295" cy="32" rx="12" ry="6" transform="rotate(30 295 32)" />
      <ellipse cx="150" cy="88" rx="12" ry="6" transform="rotate(15 150 88)" />
    </g>
  </svg>
);
const CuteAiRobot: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg
    viewBox="0 0 170 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} filter drop-shadow-md select-none`}
  >
    <defs>
      <linearGradient id="robotWhite3D" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="robotVisor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
      <linearGradient id="robotBlueAccent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF671F" />
        <stop offset="100%" stopColor="#046A38" />
      </linearGradient>
      <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M52 110 C52 95, 108 95, 108 110 L112 144 C112 154, 48 154, 48 144 Z"
      fill="url(#robotWhite3D)"
    />
    <ellipse cx="80" cy="124" rx="8" ry="8" fill="#FF671F" opacity="0.9" />
    <ellipse cx="80" cy="124" rx="5" ry="5" fill="#FAF8F5" />
    <path
      d="M50 114 C42 120, 36 130, 42 140 C46 146, 52 142, 53 134 C54 126, 54 120, 50 114 Z"
      fill="url(#robotWhite3D)"
    />
    {/* Right Arm waving */}
    <path
      d="M108 112 C118 106, 126 94, 134 84 C139 78, 145 84, 140 91 C132 103, 122 118, 114 122 Z"
      fill="url(#robotWhite3D)"
    />
    <ellipse cx="137" cy="80" rx="9" ry="8" fill="url(#robotWhite3D)" />
    <circle cx="135" cy="72" r="3.2" fill="url(#robotWhite3D)" />
    <circle cx="142" cy="74" r="3.2" fill="url(#robotWhite3D)" />
    <circle cx="146" cy="80" r="3" fill="url(#robotWhite3D)" />
    <circle cx="129" cy="79" r="2.8" fill="url(#robotWhite3D)" />

    {/* Indian Tricolour Flag held by Robot */}
    <line x1="140" y1="92" x2="140" y2="35" stroke="#78716C" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="140" cy="34" r="2" fill="#D97706" />
    <g transform="translate(141, 35)">
      {/* Saffron Stripe */}
      <path d="M0 0 C8 -2, 16 2, 24 0 L24 6 C16 8, 8 4, 0 6 Z" fill="#FF671F" />
      {/* White Stripe */}
      <path d="M0 6 C8 4, 16 8, 24 6 L24 12 C16 14, 8 10, 0 12 Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.3" />
      {/* Ashoka Chakra */}
      <circle cx="12" cy="9" r="2.2" stroke="#000080" strokeWidth="0.6" fill="none" />
      {/* India Green Stripe */}
      <path d="M0 12 C8 10, 16 14, 24 12 L24 18 C16 20, 8 16, 0 18 Z" fill="#046A38" />
    </g>

    <rect x="73" y="94" width="14" height="8" rx="4" fill="#94A3B8" />
    <rect x="35" y="28" width="90" height="72" rx="34" fill="url(#robotWhite3D)" />
    <rect x="29" y="50" width="8" height="28" rx="4" fill="#FF671F" />
    <rect x="123" y="50" width="8" height="28" rx="4" fill="#046A38" />
    <rect x="43" y="38" width="74" height="52" rx="22" fill="url(#robotVisor)" />
    <path d="M57 60 C57 53, 69 53, 69 60 C69 67, 57 67, 57 60 Z" fill="#38BDF8" filter="url(#eyeGlow)" />
    <circle cx="63" cy="59" r="2.5" fill="#FFFFFF" />
    <path d="M91 60 C91 53, 103 53, 103 60 C103 67, 91 67, 91 60 Z" fill="#38BDF8" filter="url(#eyeGlow)" />
    <circle cx="97" cy="59" r="2.5" fill="#FFFFFF" />
    <path d="M74 74 Q80 79 86 74" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// -------------------------------------------------------------
// Verified Heritage Slides for 7-Second Automatic Slideshow
// -------------------------------------------------------------
interface HeroHeritageSlide {
  id: string;
  name: string;
  location: string;
  state: string;
  category: string;
  tag: string;
  builtEra: string;
  bestTime: string;
  rating: string;
  reviewsCount: string;
  imageUrl: string;
  fallbackUrl: string;
}

const HERO_HERITAGE_SLIDES: HeroHeritageSlide[] = [
  {
    id: 'india-gate',
    name: 'India Gate',
    location: 'New Delhi',
    state: 'Delhi (NCT)',
    category: 'National War Memorial',
    tag: 'Kartavya Path Imperial Arch',
    builtEra: '1921–1931 CE • Edwin Lutyens',
    bestTime: 'Evening 6:00 – 9:00 PM',
    rating: '4.8',
    reviewsCount: '38.4k',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&auto=format&fit=crop&q=85',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/1280px-India_Gate_in_New_Delhi_03-2016.jpg',
  },
  {
    id: 'red-fort',
    name: 'Red Fort (Lal Qila)',
    location: 'Old Delhi',
    state: 'Delhi (NCT)',
    category: 'UNESCO World Heritage',
    tag: 'Mughal Imperial Citadel',
    builtEra: '1638–1648 CE • Shah Jahan',
    bestTime: 'Morning 9:30 AM – 1:00 PM',
    rating: '4.7',
    reviewsCount: '45.2k',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Red_Fort_in_Delhi_03-2016_img1.jpg/1280px-Red_Fort_in_Delhi_03-2016_img1.jpg',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1280px-Delhi_fort.jpg',
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra',
    state: 'Uttar Pradesh',
    category: 'UNESCO World Heritage',
    tag: 'Mughal Marble Wonder',
    builtEra: '1632–1653 CE • Shah Jahan',
    bestTime: 'Sunrise 06:00 AM – 08:30 AM',
    rating: '4.9',
    reviewsCount: '68.9k',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=85',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
  },
];

export const VirasatDashboard: React.FC<VirasatDashboardProps> = ({
  onSearch,
  onNavigateTab,
  onSelectPlace,
  onSelectCity,
  onOpenAIChat,
}) => {
  // Automatic Background Hero Slideshow State
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<PlaceSummary[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Popular destinations category filter
  const [activePopularCategory, setActivePopularCategory] = useState<'All' | 'Forts' | 'Temples' | 'UNESCO'>('All');

  // Near You Geolocation State
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'ready' | 'denied' | 'error'>('idle');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [nearbyRadius, setNearbyRadius] = useState<number>(50);
  const [detectedCityName, setDetectedCityName] = useState<string>('');

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.searchPlaces(searchQuery.trim());
        setSearchSuggestions(results.slice(0, 5));
        setShowSuggestions(true);
      } catch {
        setSearchSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  // Real Near You Geolocation Detection
  const handleDetectLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('detecting');

    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          await fetchNearbyPlaces(latitude, longitude, nearbyRadius, 'Your Detected Location');
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err);
          setLocationStatus('denied');
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } catch (geoErr) {
      console.warn('Geolocation access failed:', geoErr);
      setLocationStatus('denied');
    }
  };

  const fetchNearbyPlaces = async (lat: number, lng: number, radius: number, cityName?: string) => {
    setLocationStatus('detecting');
    try {
      const resp = await api.getNearbyPlaces(lat, lng, radius, 6);
      const list = resp?.results || resp?.data || (Array.isArray(resp) ? resp : []);
      setNearbyPlaces(list);
      setDetectedCityName(cityName || `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`);
      setLocationStatus('ready');
    } catch {
      setNearbyPlaces([]);
      setLocationStatus('error');
    }
  };

  // Quick City fallback for Near You
  const handleSelectFallbackCity = (city: { name: string; lat: number; lng: number }) => {
    setUserCoords({ lat: city.lat, lng: city.lng });
    fetchNearbyPlaces(city.lat, city.lng, nearbyRadius, city.name);
  };

  // Check prefers-reduced-motion for slideshow accessibility
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Simple automatic heritage slideshow working in the background (5-second intervals)
  useEffect(() => {
    if (reducedMotion) return;

    const timer = setInterval(() => {
      setActiveSlideIdx((curr) => (curr + 1) % HERO_HERITAGE_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reducedMotion]);

  // Quick Chips matching template
  const quickChips = [
    { name: 'Taj Mahal', placeId: 'taj-mahal' },
    { name: 'Red Fort', placeId: 'red-fort' },
    { name: 'Gateway of India', placeId: 'gateway-of-india' },
    { name: 'Hampi', placeId: 'hampi-monuments' },
    { name: 'Jaipur', city: 'Jaipur' },
    { name: 'Varanasi', city: 'Varanasi' },
    { name: 'Konark', placeId: 'sun-temple-konark' },
  ];

  // Popular Destinations (Exact 6 cards from template)
  const popularDestinationsList = [
    {
      id: 'red-fort',
      name: 'Red Fort (Lal Qila)',
      location: 'Old Delhi, Delhi',
      category: 'UNESCO World Heritage',
      categoryType: 'UNESCO',
      rating: 4.9,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1280px-Delhi_fort.jpg',
      badge: 'UNESCO',
    },
    {
      id: 'hampi-monuments',
      name: 'Hampi',
      location: 'Karnataka',
      category: 'Temples & Spiritual',
      categoryType: 'Temples',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b780?w=800&auto=format&fit=crop&q=80',
      badge: 'UNESCO',
    },
    {
      id: 'amber-palace',
      name: 'Amber Palace',
      location: 'Jaipur, Rajasthan',
      category: 'Forts & Palaces',
      categoryType: 'Forts',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1603288967527-24861e6878b3?w=800&auto=format&fit=crop&q=80',
      badge: 'Hill Forts',
    },
    {
      id: 'varanasi-ghats',
      name: 'Varanasi',
      location: 'Uttar Pradesh',
      category: 'Spiritual & Ghats',
      categoryType: 'Temples',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&auto=format&fit=crop&q=80',
      badge: 'Sacred Ghats',
    },
    {
      id: 'sun-temple-konark',
      name: 'Konark Sun Temple',
      location: 'Odisha',
      category: 'Temples & Spiritual',
      categoryType: 'Temples',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1609137144822-79f972b901fc?w=800&auto=format&fit=crop&q=80',
      badge: 'Stone Chariot',
    },
    {
      id: 'kaziranga-park',
      name: 'Kaziranga',
      location: 'Assam',
      category: 'Natural Heritage & Wildlife',
      categoryType: 'UNESCO',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&auto=format&fit=crop&q=80',
      badge: 'UNESCO Park',
    },
  ];

  const filteredPopular = popularDestinationsList.filter((item) => {
    if (activePopularCategory === 'All') return true;
    if (activePopularCategory === 'Forts') return item.categoryType === 'Forts';
    if (activePopularCategory === 'Temples') return item.categoryType === 'Temples';
    if (activePopularCategory === 'UNESCO') return item.categoryType === 'UNESCO';
    return true;
  });

  // 6 Regional Hubs with authentic heritage photography, bespoke architectural vector icons, and iconic highlights
  const regionalHubs = [
    {
      id: 'north',
      name: 'North India',
      statesCount: '9 States & UTs',
      landmarkHighlight: 'Taj Mahal • Amber Fort • Varanasi',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
      icon: NorthIndiaIcon,
      bgColor: 'bg-[#FFF6ED]',
      borderColor: 'border-[#FCE1CE]',
      iconColor: 'text-[#FF671F]',
      query: 'North India',
    },
    {
      id: 'south',
      name: 'South India',
      statesCount: '5 States & 2 UTs',
      landmarkHighlight: 'Meenakshi • Hampi • Backwaters',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
      icon: SouthIndiaIcon,
      bgColor: 'bg-[#F0F8F3]',
      borderColor: 'border-[#CEEBD9]',
      iconColor: 'text-[#046A38]',
      query: 'South India',
    },
    {
      id: 'east',
      name: 'East India',
      statesCount: '4 States',
      landmarkHighlight: 'Victoria Memorial • Konark • Nalanda',
      image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80',
      icon: EastIndiaIcon,
      bgColor: 'bg-[#F0F7FD]',
      borderColor: 'border-[#CCE4F8]',
      iconColor: 'text-[#0284C7]',
      query: 'East India',
    },
    {
      id: 'west',
      name: 'West India',
      statesCount: '3 States & 2 UTs',
      landmarkHighlight: 'Gateway of India • Jaisalmer • Ajanta',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
      icon: WestIndiaIcon,
      bgColor: 'bg-[#FFF4EC]',
      borderColor: 'border-[#FBDBC6]',
      iconColor: 'text-[#EA580C]',
      query: 'West India',
    },
    {
      id: 'central',
      name: 'Central India',
      statesCount: '2 States',
      landmarkHighlight: 'Khajuraho Temples • Sanchi Stupa',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
      icon: CentralIndiaIcon,
      bgColor: 'bg-[#EEF8F5]',
      borderColor: 'border-[#CAECE0]',
      iconColor: 'text-[#059669]',
      query: 'Central India',
    },
    {
      id: 'northeast',
      name: 'Northeast India',
      statesCount: '8 States',
      landmarkHighlight: 'Living Root Bridges • Kaziranga',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
      icon: NortheastIndiaIcon,
      bgColor: 'bg-[#F0F4FC]',
      borderColor: 'border-[#CCD8F7]',
      iconColor: 'text-[#3B82F6]',
      query: 'Northeast India',
    },
  ];

  return (
    <div className="w-full space-y-10 sm:space-y-14 animate-fadeIn pb-16 font-sans text-stone-800">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: UNIVERSAL SEARCH & 7-SECOND HERITAGE SLIDESHOW           */}
      {/* ========================================================================= */}
      <section
        className="relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden border border-[#EFE8DF] shadow-md min-h-[520px] sm:min-h-[550px] lg:min-h-[580px] flex flex-col justify-between p-6 sm:p-8 lg:p-10 select-none bg-stone-900/5"
        aria-label="Incredible India Living Heritage Slideshow"
      >
        {/* ========================================================================= */}
        {/* 7-SECOND AUTOMATIC HERITAGE SLIDESHOW BACKGROUND                          */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {HERO_HERITAGE_SLIDES.map((slide, idx) => {
            const isActive = idx === activeSlideIdx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                  isActive
                    ? 'opacity-100 scale-100 z-[1]'
                    : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
              >
                <img
                  src={slide.imageUrl}
                  alt={`${slide.name} - ${slide.location}, ${slide.state}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (slide.fallbackUrl && (e.target as HTMLImageElement).src !== slide.fallbackUrl) {
                      (e.target as HTMLImageElement).src = slide.fallbackUrl;
                    }
                  }}
                  className="w-full h-full object-cover object-[center_35%] select-none filter contrast-[1.05] brightness-[1.02] saturate-[1.05]"
                />
              </div>
            );
          })}

          {/* SUBTLE TRANSPARENT OVERLAY (REDUCED WHITE AREA):
              Allows real heritage photograph to remain clearly visible across almost the entire hero,
              while ensuring crisp text readability for headings, search bar and destination chips.
          */}
          {/* Desktop/Tablet Horizontal Gradient Overlay */}
          <div
            className="absolute inset-0 hidden sm:block pointer-events-none z-[2]"
            style={{
              background:
                'linear-gradient(to right, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.58) 32%, rgba(255, 255, 255, 0.22) 60%, rgba(255, 255, 255, 0.05) 78%, rgba(255, 255, 255, 0) 100%)',
            }}
          />

          {/* Mobile Vertical Gradient Overlay */}
          <div
            className="absolute inset-0 sm:hidden pointer-events-none z-[2]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0.84) 0%, rgba(255, 255, 255, 0.60) 45%, rgba(255, 255, 255, 0.20) 80%, rgba(255, 255, 255, 0.05) 100%)',
            }}
          />

          {/* Very subtle bottom-right vignette for place badge and navigation controls */}
          <div
            className="absolute bottom-0 right-0 w-full sm:w-2/3 h-48 pointer-events-none z-[2]"
            style={{
              background:
                'radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 0.28) 0%, rgba(0, 0, 0, 0.10) 45%, rgba(0, 0, 0, 0) 75%)',
            }}
          />
        </div>

        {/* Ashoka Chakra Translucent Watermark in Far Sky */}
        <div className="absolute top-3 left-1/3 -translate-x-1/2 z-0 pointer-events-none opacity-[0.07] hidden md:block">
          <AshokaChakra size={240} color="#0B407A" />
        </div>

        {/* Top Right "From Our Heritage To A Brighter Tomorrow" Banner */}
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/90 shadow-sm flex items-center gap-3 text-stone-800 z-10 select-none">
          <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF671F] shrink-0">
            <Landmark className="w-4 h-4 text-[#FF671F]" />
          </div>
          <div className="leading-tight text-left">
            <div className="text-[10px] font-bold text-[#0B192C] uppercase tracking-wider">From Our Heritage To</div>
            <div className="text-xs font-serif font-bold mt-0.5">
              <span className="text-[#046A38]">A Brighter</span> <span className="text-[#FF671F]">Tomorrow</span>
            </div>
            <div className="w-14 h-0.5 rounded-full bg-gradient-to-r from-[#FF671F] via-[#EFE8DF] to-[#046A38] mt-0.5" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl pt-2 sm:pt-4">
          {/* Heading, Search, Chips & Verified Tourism Trust Strip */}
          <div>
            <IncredibleIndiaBadge className="mb-3" />

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold tracking-tight text-[#0B192C] leading-[1.12]">
              <span>Discover India&apos;s</span>
              <span className="block mt-1">
                <span className="text-[#FF671F]">Living</span>{' '}
                <span className="text-[#046A38]">Heritage</span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-stone-700 max-w-lg mt-3 sm:mt-3.5 leading-relaxed font-medium">
              Explore monuments, cultures, natural wonders and hidden gems across every region of India.
            </p>

            {/* Universal Search Input Bar with Live Suggestions Dropdown */}
            <div ref={searchContainerRef} className="relative mt-5 sm:mt-6 max-w-xl xl:max-w-2xl">
              <form onSubmit={handleSearchSubmit}>
                <div className="bg-white/95 backdrop-blur-md rounded-full p-1.5 pl-4 sm:pl-5 shadow-md border border-stone-200/90 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-[#FF671F]/30 focus-within:border-[#FF671F]">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="Search destinations, monuments, cities, or experiences..."
                    className="w-full bg-transparent text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
                  />
                  {isSearching && <Loader2 className="w-4 h-4 text-amber-600 animate-spin mr-1 shrink-0" />}
                  <button
                    type="submit"
                    className="bg-[#FF671F] hover:bg-[#E65100] text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Live Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-30 animate-fadeIn">
                  <div className="p-2 border-b border-stone-100 text-[11px] font-bold text-stone-400 px-3 uppercase tracking-wider">
                    Verified Heritage Results
                  </div>
                  <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                    {searchSuggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setShowSuggestions(false);
                          if (onSelectPlace) {
                            onSelectPlace(item.id);
                          } else {
                            onSearch(item.name);
                          }
                        }}
                        className="p-3 hover:bg-orange-50/60 cursor-pointer transition flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.thumbnail_url || item.image_url || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200'}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="text-left">
                            <h4 className="font-serif text-xs font-bold text-stone-900">{item.name}</h4>
                            <p className="text-[11px] text-stone-500">{item.city}, {item.state}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-orange-950 bg-orange-100/70 px-2 py-0.5 rounded-md shrink-0">
                          {item.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Destination Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-4 sm:mt-5">
              {quickChips.map((chip) => (
                <button
                  key={chip.name}
                  type="button"
                  onClick={() => {
                    if (chip.placeId && onSelectPlace) {
                      onSelectPlace(chip.placeId);
                    } else if (chip.city && onSelectCity) {
                      onSelectCity(chip.city);
                      onNavigateTab('dashboard');
                    } else {
                      onSearch(chip.name);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-stone-200/90 hover:border-[#FF671F] hover:bg-white text-xs font-semibold text-stone-800 shadow-2xs hover:shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FF671F] shrink-0" />
                  <span>{chip.name}</span>
                </button>
              ))}
            </div>

            {/* Verified Heritage Highlights & Tourism Trust Strip */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-stone-300/40">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF671F] shrink-0">
                  <Landmark className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 leading-none">42 UNESCO</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Heritage Sites</div>
                </div>
              </div>

              <div className="hidden sm:block h-5 w-px bg-stone-300/60" />

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#046A38] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 leading-none">3,600+ ASI</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Protected Shrines</div>
                </div>
              </div>

              <div className="hidden sm:block h-5 w-px bg-stone-300/60" />

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center text-[#0284C7] shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 leading-none">28 States & UTs</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Curated Trails</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right Floating AI Assistant Quick Trigger */}
        <button
          type="button"
          onClick={() => onNavigateTab('ai')}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 bg-white/95 hover:bg-white backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/90 hover:border-orange-300 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-3 text-stone-800 z-20 cursor-pointer group active:scale-95 text-left"
          title="Open Virasat AI Assistant"
        >
          {/* AI Logo Icon */}
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF671F] to-[#046A38] p-0.5 shadow-xs flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#FF671F]" />
              </div>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>

          {/* AI Assistant Label & Action */}
          <div className="leading-tight pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#0B192C] tracking-tight group-hover:text-[#FF671F] transition-colors flex items-center gap-1">
                Virasat AI <Sparkles className="w-3 h-3 text-[#FF671F]" />
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                Online
              </span>
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-0.5 flex items-center gap-1">
              <span>Ask Heritage AI</span>
              <ArrowRight className="w-3 h-3 text-stone-400 group-hover:text-[#FF671F] group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>
      </section>

      {/* ========================================================================= */}
      {/* 2. EXPLORE NEAR YOU (REAL GEOLOCATION WITH PERMISSION)                     */}
      {/* ========================================================================= */}
      <section id="explore-near-you" className="rounded-3xl bg-white border border-[#EFE8DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#046A38] uppercase tracking-wider mb-1">
              <Navigation className="w-3.5 h-3.5 text-[#046A38]" />
              <span>Real-Time Proximity</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Explore Near You
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
              Find verified monuments, fortresses, and heritage temples nearest to your current location
            </p>
          </div>

          {/* Action to trigger or re-trigger location */}
          <div className="flex items-center gap-2">
            {locationStatus === 'ready' && (
              <select
                value={nearbyRadius}
                onChange={(e) => {
                  const r = Number(e.target.value);
                  setNearbyRadius(r);
                  if (userCoords) {
                    fetchNearbyPlaces(userCoords.lat, userCoords.lng, r, detectedCityName);
                  }
                }}
                className="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 bg-stone-50"
              >
                <option value={25}>Within 25 km</option>
                <option value={50}>Within 50 km</option>
                <option value={150}>Within 150 km</option>
                <option value={300}>Within 300 km</option>
              </select>
            )}

            <button
              onClick={handleDetectLocation}
              disabled={locationStatus === 'detecting'}
              className="px-4 py-2 rounded-full bg-[#046A38] hover:bg-[#03542C] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {locationStatus === 'detecting' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{locationStatus === 'ready' ? 'Update My Location' : 'Use My Current Location'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* State 1: Idle Prompt */}
        {locationStatus === 'idle' && (
          <div className="rounded-2xl bg-[#F8FBF9] border border-[#DCEDE2] p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF5EE] text-[#046A38] flex items-center justify-center mx-auto shadow-2xs">
              <Compass className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Discover Heritage Around Your City
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Allow browser location permission to compute authentic geodesic distances to monuments, or choose from major historic centers below:
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold text-stone-500">Popular hubs:</span>
              {[
                { name: 'Delhi', lat: 28.6139, lng: 77.209 },
                { name: 'Mumbai', lat: 18.922, lng: 72.8347 },
                { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
                { name: 'Agra', lat: 27.1767, lng: 78.0081 },
                { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
                { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
                { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSelectFallbackCity(c)}
                  className="px-3 py-1 rounded-full bg-white border border-stone-200 hover:border-emerald-500 text-xs font-semibold text-stone-700 shadow-2xs transition"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* State 2: Permission Denied or Error */}
        {(locationStatus === 'denied' || locationStatus === 'error') && (
          <div className="rounded-2xl bg-orange-50/60/70 border border-orange-200 p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-900 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#FF671F]" />
              <span>
                {locationStatus === 'denied'
                  ? 'Location access was not granted by your browser.'
                  : 'Unable to pinpoint exact device coordinates.'}
              </span>
            </div>
            <p className="text-xs text-stone-600">
              No problem! You can select any major heritage hub below to immediately view monuments around that city:
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { name: 'Delhi NCR', lat: 28.6139, lng: 77.209 },
                { name: 'Mumbai Coast', lat: 18.922, lng: 72.8347 },
                { name: 'Jaipur / Amer', lat: 26.9124, lng: 75.7873 },
                { name: 'Agra Heritage', lat: 27.1767, lng: 78.0081 },
                { name: 'Varanasi Ghats', lat: 25.3176, lng: 82.9739 },
                { name: 'Karnataka (Hampi)', lat: 15.335, lng: 76.46 },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSelectFallbackCity(c)}
                  className="px-3 py-1.5 rounded-full bg-white border border-orange-300 hover:bg-amber-100/60 text-xs font-bold text-stone-800 transition shadow-2xs"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* State 3: Ready with nearby cards */}
        {locationStatus === 'ready' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-600 font-medium px-1">
              <span>Showing monuments near <strong className="text-stone-900">{detectedCityName}</strong>:</span>
              <span className="text-emerald-700 font-bold">{nearbyPlaces.length} locations found</span>
            </div>

            {nearbyPlaces.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl">
                No verified monuments indexed within {nearbyRadius} km. Try expanding the search radius above.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {nearbyPlaces.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectPlace && onSelectPlace(p.id)}
                    className="group cursor-pointer rounded-2xl bg-white border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-500 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div className="h-28 w-full overflow-hidden bg-stone-100 relative">
                      <img
                        src={getMonumentRealImage(p.id, p.thumbnail_url || p.image_url)}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallback = getMonumentRealImage(p.id);
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                      />
                      {p.distance_km !== undefined && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#046A38] text-white text-[10px] font-bold shadow-xs">
                          {p.distance_km} km away
                        </span>
                      )}
                    </div>

                    <div className="p-3 space-y-1">
                      <h4 className="font-serif text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 truncate">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{p.city}, {p.state}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR DESTINATIONS                                                   */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#FF671F] uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Curated Highlights</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Popular Destinations
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
                Iconic places that inspire every journey
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="text-xs font-bold text-[#FF671F] hover:text-[#E65100] px-3.5 py-1.5 rounded-full hover:bg-orange-50/60 transition flex items-center gap-1 cursor-pointer"
              >
                <span>View All Destinations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Carousel Arrow Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous destination"
                  onClick={() => {
                    const el = document.getElementById('popular-destinations-grid');
                    if (el) el.scrollBy({ left: -260, behavior: 'smooth' });
                  }}
                  className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 flex items-center justify-center shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next destination"
                  onClick={() => {
                    const el = document.getElementById('popular-destinations-grid');
                    if (el) el.scrollBy({ left: 260, behavior: 'smooth' });
                  }}
                  className="w-8 h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 flex items-center justify-center shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 6 Destination Cards Grid */}
        <div
          id="popular-destinations-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-1 scrollbar-none"
        >
          {popularDestinationsList.map((place, pIdx) => (
            <ScrollReveal
              key={place.id}
              animation="fade-up"
              delay={pIdx * 50}
              className="h-full"
            >
              <div
                onClick={() => {
                  if (onSelectPlace) {
                    onSelectPlace(place.id);
                  } else {
                    onNavigateTab('heritage');
                  }
                }}
                className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#FF671F]/50 transition-all duration-200 flex flex-col justify-between h-full"
              >
                <div className="h-36 sm:h-40 w-full overflow-hidden bg-stone-100 relative">
                  <img
                    src={getMonumentRealImage(place.id, place.imageUrl)}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallback = getMonumentRealImage(place.id);
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />
                </div>

                <div className="p-3.5 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#FF671F] transition truncate">
                      {place.name}
                    </h4>
                    <p className="text-xs text-stone-500 truncate mt-0.5 font-medium">
                      {place.location}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-[#FF671F] group-hover:text-white text-stone-600 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. EXPLORE INDIA BY REGION                                                */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#FF671F] uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>Pan-India Cultural Geographies</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Explore India by Region
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
                Discover the diverse beauty of every region
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('india')}
              className="text-xs font-bold text-[#FF671F] hover:text-[#E65100] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>View All Regions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </ScrollReveal>

        {/* 2-Column Layout matching template */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: 6 Region Cards in 3x2 Grid with Authentic Heritage Photography */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {regionalHubs.map((reg, rIdx) => {
              const IconComp = reg.icon;
              return (
                <ScrollReveal
                  key={reg.id}
                  animation="fade-up"
                  delay={rIdx * 50}
                  className="h-full"
                >
                  <div
                    onClick={() => onSearch(reg.query)}
                    className="group cursor-pointer rounded-2xl overflow-hidden relative border border-stone-200/80 hover:border-[#FF671F] shadow-2xs hover:shadow-warm transition-all duration-300 min-h-[165px] sm:min-h-[175px] h-full flex flex-col justify-between p-3.5 text-left bg-stone-900"
                  >
                    {/* Authentic High-Resolution Regional Photo */}
                    <img
                      src={reg.image}
                      alt={`${reg.name} - ${reg.landmarkHighlight}`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay for Optimal Text Readability & Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-stone-950/20 group-hover:from-stone-950/98 transition-colors" />

                    {/* Top Bar: Regional Architectural Emblem & State Count */}
                    <div className="relative z-10 flex items-center justify-between gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md flex items-center justify-center shadow-xs border border-white/40 group-hover:scale-105 transition-transform">
                        <IconComp className={`w-5 h-5 ${reg.iconColor}`} />
                      </div>
                      <span className="text-[10px] font-semibold text-stone-100 bg-black/55 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15">
                        {reg.statesCount}
                      </span>
                    </div>

                    {/* Bottom: Region Name & Iconic Heritage Highlights */}
                    <div className="relative z-10 space-y-0.5 pt-4">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-serif font-bold text-white text-sm sm:text-base tracking-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                          {reg.name}
                        </h3>
                        <ArrowRight className="w-3.5 h-3.5 text-white/70 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                      <p className="text-[11px] text-stone-300 line-clamp-1 font-medium drop-shadow-xs">
                        {reg.landmarkHighlight}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Right: Stacked 2 Cards ("Explore on Map" & "Hidden Gems") */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Card 1: Explore on Map */}
            <ScrollReveal animation="fade-left" delay={100} className="flex-1 flex">
              <div
                onClick={() => onNavigateTab('map')}
                className="rounded-2xl bg-white border border-[#EFE8DF] p-5 shadow-2xs hover:shadow-md transition flex items-center justify-between gap-4 cursor-pointer group flex-1 w-full"
              >
                <div className="w-24 h-24 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IndiaIllustratedMapGraphic className="w-24 h-24" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-serif text-base font-bold text-stone-900 leading-snug">
                    Explore on Map
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Find destinations, heritage sites, railway stations and more.
                  </p>
                  <button
                    type="button"
                    className="bg-[#046A38] hover:bg-[#03542C] text-white px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition active:scale-95 mt-1 cursor-pointer"
                  >
                    <span>Open Interactive Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Hidden Gems */}
            <ScrollReveal animation="fade-left" delay={200} className="flex-1 flex">
              <div
                onClick={() => onNavigateTab('heritage')}
                className="rounded-2xl overflow-hidden relative p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-end min-h-[145px] text-white cursor-pointer group flex-1 w-full"
              >
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"
                  alt="Majestic Mountain Ridge"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    Hidden Gems
                  </h3>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    Offbeat destinations beyond the ordinary.
                  </p>
                  <button
                    type="button"
                    className="bg-[#FF671F] hover:bg-[#E65100] text-white px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition active:scale-95 self-start mt-2 cursor-pointer"
                  >
                    <span>Explore Hidden India</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRICOLOUR HERITAGE BANNER / FOOTER EMBLEM (MATCHING TEMPLATE)           */}
      {/* ========================================================================= */}
      <ScrollReveal animation="fade-up">
        <section className="rounded-3xl bg-white border border-[#EFE8DF] overflow-hidden shadow-2xs p-6 sm:p-8 relative">
          <FlowingTricolourRibbon variant="footer" className="opacity-90 z-1" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Heritage Skyline Silhouette */}
            <div className="w-full md:w-1/3 opacity-80">
              <HeritageSkylineSilhouette className="w-full h-12 text-stone-400" />
            </div>

            {/* Center Slogan */}
            <div className="text-center space-y-1 flex-1">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-widest">
                <span className="w-4 h-0.5 bg-[#FF671F] rounded-full" />
                <span>Explore • Respect • Preserve</span>
                <span className="w-4 h-0.5 bg-[#046A38] rounded-full" />
              </div>
              <p className="font-serif text-sm sm:text-base font-bold text-stone-800">
                Incredible India. For Generations.
              </p>
            </div>

            {/* Right Bengal Tiger Emblem */}
            <div className="shrink-0 flex items-center justify-end">
              <RoyalBengalTigerEmblem className="w-48 h-auto" />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* 6. INDIA MAP PREVIEW (ACCURATE REAL WORLD GIS MAP & INTERACTIVE MONUMENT PINS) */}
      {/* ========================================================================= */}
      <IndiaHeritageMapPreview
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
