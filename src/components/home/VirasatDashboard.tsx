import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  ArrowRight,
  Landmark,
  Compass,
  Map,
  MessageSquare,
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
  Bot,
  Camera,
  History,
  Trash2,
  X,
  Store,
  Building2,
  BookOpen,
  Train,
  Mountain,
  Trees,
  Bus,
  Plane,
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { PlaceSummary } from '../../types';
import { api } from '../../services/api';
import { MonumentARCameraModal } from '../ar/MonumentARCameraModal';
import {
  AshokaChakra,
  IncredibleIndiaBadge,
  VirasatLogoMark,
  NorthIndiaIcon,
  SouthIndiaIcon,
  EastIndiaIcon,
  WestIndiaIcon,
  CentralIndiaIcon,
  NortheastIndiaIcon,
  IndiaIllustratedMapGraphic,
} from '../common/TricolourBranding';
import { IndiaHeritageMapPreview } from './IndiaHeritageMapPreview';
import { ScrollReveal } from '../common/ScrollReveal';
import { getMonumentRealImage } from '../../data/monumentRealImages';
import { searchMumbaiPlaces } from '../../data/mumbaiDestinations';
import { getNearbyDiscoveryPlaces, calculateHaversineKm } from '../../data/nearbyPlacesMMR';

interface VirasatDashboardProps {
  onSearch: (query: string) => void;
  onNavigateTab: (tab: NavTab, city?: string) => void;
  onSelectPlace?: (placeId: string) => void;
  onSelectCity?: (city: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
  places?: PlaceSummary[];
}

type NearbyCategory = 'attraction' | 'heritage' | 'hill' | 'park' | 'spiritual' | 'transport' | 'market' | 'hotel' | 'library';
const classifyNearbyCategory = (value: unknown): NearbyCategory => {
  const text = String(value || '').toLowerCase();
  if (/bus (stand|station|terminal|depot)|bus depot|bus terminus|railway|rail station|train station|terminus|junction|airport|metro|transit/.test(text)) return 'transport';
  if (/market|bazaar|mandai|mall/.test(text)) return 'market';
  if (/hotel|resort|lodge|accommodation/.test(text)) return 'hotel';
  if (/library|reading room|archive/.test(text)) return 'library';
  if (/fort|palace|monument|heritage|museum|archaeolog|historic|cave|stupa|unesco/.test(text)) return 'heritage';
  if (/temple|mosque|masjid|gurudwara|gurdwara|church|monastery|shrine|pilgrim|spiritual/.test(text)) return 'spiritual';
  if (/amusement|theme park|water park|zoo|zoological|national park|wildlife|sanctuary|bird park/.test(text)) return 'park';
  if (/hill|mountain|valley|peak|pass|ghat|waterfall|lake|forest|viewpoint|nature/.test(text)) return 'hill';
  return 'attraction';
};

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
// High-resolution, locally optimized images for the automatic slideshow
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
  photoCredit?: { name: string; sourceUrl: string };
}

const HERO_HERITAGE_SLIDES: HeroHeritageSlide[] = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra',
    state: 'Uttar Pradesh',
    category: 'UNESCO World Heritage',
    tag: 'Mughal Marble Wonder & Symbol of Eternal Love',
    builtEra: '1632–1653 CE • Emperor Shah Jahan',
    bestTime: 'Sunrise 06:00 AM – 08:30 AM',
    rating: '4.9',
    reviewsCount: '68.9k',
    imageUrl: '/images/home-hero/taj-mahal.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
  },
  {
    id: 'india-gate',
    name: 'India Gate',
    location: 'New Delhi',
    state: 'Delhi (NCT)',
    category: 'National Memorial',
    tag: 'Kartavya Path Imperial Arch & Amar Jawan Jyoti',
    builtEra: '1921–1931 CE • Sir Edwin Lutyens',
    bestTime: 'Evening 6:00 – 9:00 PM',
    rating: '4.8',
    reviewsCount: '38.4k',
    imageUrl: '/images/home-hero/india-gate.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/1280px-India_Gate_in_New_Delhi_03-2016.jpg',
  },
  {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    location: 'Mumbai',
    state: 'Maharashtra',
    category: 'Historic Seafront Gateway',
    tag: 'Indo-Saracenic Harbor Arch Overlooking Arabian Sea',
    builtEra: '1911–1924 CE • George Wittet',
    bestTime: 'Sunrise & Sunset by Mumbai Harbor',
    rating: '4.7',
    reviewsCount: '52.1k',
    imageUrl: '/images/home-hero/gateway-of-india.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg',
  },
  {
    id: 'dal-lake',
    name: 'Dal Lake & Shikara',
    location: 'Srinagar',
    state: 'Jammu and Kashmir',
    category: 'Himalayan Water Heritage',
    tag: 'Jewel of Srinagar • Floating Gardens & Char Chinar',
    builtEra: 'Mughal Royal Era • Emperor Jahangir',
    bestTime: 'Apr – Oct (Golden Morning Shikara)',
    rating: '4.8',
    reviewsCount: '29.7k',
    imageUrl: '/images/home-hero/dal-lake.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Dal_Lake_Srinagar_Kashmir.jpg/1280px-Dal_Lake_Srinagar_Kashmir.jpg',
  },
  {
    id: 'tirumala-venkateswara-temple',
    name: 'Sri Venkateswara Swamy Temple',
    location: 'Tirumala, Tirupati',
    state: 'Andhra Pradesh',
    category: 'Sacred Vaishnavite Epicenter',
    tag: 'Golden Ananda Nilayam & Srivari Brahmotsavam',
    builtEra: '300 CE onwards • Chola, Pallava & Vijayanagara Dynasties',
    bestTime: 'Year-round (Early Morning Suprabhatam)',
    rating: '4.9',
    reviewsCount: '74.2k',
    imageUrl: '/images/home-hero/tirumala.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1280px-Tirumala_090615.jpg',
  },
  {
    id: 'victoria-memorial',
    name: 'Victoria Memorial',
    location: 'Kolkata',
    state: 'West Bengal',
    category: 'Architectural Marvel & Museum',
    tag: 'Pristine White Makrana Marble Monument on the Maidan',
    builtEra: '1906–1921 CE • Sir William Emerson',
    bestTime: 'Oct – Mar 10:00 AM – 5:00 PM',
    rating: '4.8',
    reviewsCount: '41.8k',
    imageUrl: '/images/home-hero/victoria-memorial.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_situated_in_Kolkata.jpg/1280px-Victoria_Memorial_situated_in_Kolkata.jpg',
  },
  {
    id: 'red-fort',
    name: 'Red Fort (Lal Qila)',
    location: 'Old Delhi',
    state: 'Delhi (NCT)',
    category: 'UNESCO World Heritage',
    tag: 'Historic Red Sandstone Citadel & Lahori Gate',
    builtEra: '1638–1648 CE • Shah Jahan',
    bestTime: 'Morning 9:00 AM – 1:00 PM',
    rating: '4.7',
    reviewsCount: '45.2k',
    imageUrl: '/images/home-hero/red-fort.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Red_Fort_in_Delhi_03-2016_img1.jpg/1280px-Red_Fort_in_Delhi_03-2016_img1.jpg',
  },
  {
    id: 'kedarnath-temple',
    name: 'Kedarnath Temple',
    location: 'Kedarnath',
    state: 'Uttarakhand',
    category: 'Himalayan Jyotirlinga',
    tag: 'Ancient stone shrine beneath the Garhwal Himalayas',
    builtEra: 'Traditional stone temple • Garhwal Himalayas',
    bestTime: 'During the annual temple season; check current access conditions',
    rating: '4.9',
    reviewsCount: '63.5k',
    imageUrl: '/images/home-hero/kedarnath.webp',
    fallbackUrl: '/images/uttarakhand/kedarnath-temple.png',
  },
  {
    id: 'diwali-festival',
    name: 'Diwali — Festival of Lights',
    location: 'Across India',
    state: 'Pan-India',
    category: 'Festival of Lights',
    tag: 'Diyas, shared celebrations and the triumph of light',
    builtEra: 'Five-day festival • dates follow the Hindu lunisolar calendar',
    bestTime: 'Diwali evening • exact dates vary each year',
    rating: '4.9',
    reviewsCount: '58.3k',
    imageUrl: '/images/home-hero/diwali.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/2018_Diwali_Diya.jpg',
    photoCredit: {
      name: 'Sangram Keshari Senapati',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:2018_Diwali_Diya.jpg',
    },
  },
  {
    id: 'varanasi-ganga-ghats',
    name: 'Varanasi Ganga Ghats (Dashashwamedh)',
    location: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'Spiritual Heart of India',
    tag: 'Eternal Riverfront Ghats & Evening Maha Ganga Aarti',
    builtEra: 'Ancient Living Heritage • Reconstructed by Ahilyabai Holkar',
    bestTime: 'Sunset Ganga Aarti & Dawn Boat Ride',
    rating: '4.9',
    reviewsCount: '82.6k',
    imageUrl: '/images/home-hero/varanasi-ghats.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&auto=format&fit=crop&q=85',
  },
  {
    id: 'kaziranga-national-park',
    name: 'Kaziranga National Park (One-Horned Rhino)',
    location: 'Golaghat & Nagaon',
    state: 'Assam',
    category: 'UNESCO World Natural Heritage',
    tag: 'Sanctuary of the Great Indian One-Horned Rhinoceros',
    builtEra: 'Established 1905 CE • UNESCO Declared 1985',
    bestTime: 'Nov – Apr (Morning Wildlife Safari)',
    rating: '4.8',
    reviewsCount: '34.9k',
    imageUrl: '/images/home-hero/kaziranga-rhino.webp',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Kaziranga_Rhinoceros.jpg',
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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<PlaceSummary[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Recent Searches for Explore Page (stored in localStorage)
  const [recentSearches, setRecentSearches] = useState<Array<{ id: string; query: string; timestamp: number }>>(() => {
    try {
      const stored = localStorage.getItem('virasat_recent_searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => item && typeof item.query === 'string' && item.query.trim().length > 0
          );
        }
      }
    } catch (e) {
      console.warn('Failed to parse recent searches:', e);
    }
    return [];
  });

  const saveRecentSearches = (items: Array<{ id: string; query: string; timestamp: number }>) => {
    setRecentSearches(items);
    try {
      localStorage.setItem('virasat_recent_searches', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save recent searches:', e);
    }
  };

  const recordRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    const lower = trimmed.toLowerCase();
    const filtered = recentSearches.filter((item) => item.query.toLowerCase() !== lower);
    const updated = [
      { id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, query: trimmed, timestamp: Date.now() },
      ...filtered,
    ].slice(0, 10);
    saveRecentSearches(updated);
  };

  const handleRemoveRecentSearch = (queryToRemove: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = recentSearches.filter(
      (item) => item.query.toLowerCase() !== queryToRemove.toLowerCase()
    );
    saveRecentSearches(updated);
  };

  const handleClearHistory = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    saveRecentSearches([]);
  };

  // AR Camera Scanner Modal State
  const [isARModalOpen, setIsARModalOpen] = useState(false);

  // Popular destinations category filter
  const [activePopularCategory, setActivePopularCategory] = useState<'All' | 'Forts' | 'Temples' | 'UNESCO'>('All');

  // Near You Geolocation State
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'ready' | 'denied' | 'error'>('idle');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [nearbyRadius, setNearbyRadius] = useState<number>(50);
  const [detectedCityName, setDetectedCityName] = useState<string>('');
  const [nearbyCategoryTab, setNearbyCategoryTab] = useState<'all' | NearbyCategory>('all');

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
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
        const localResults = searchMumbaiPlaces(searchQuery.trim()).slice(0, 5);
        const results = await api.searchPlaces(searchQuery.trim());
        const localNames = new Set(localResults.map((place) => place.name.trim().toLowerCase()));
        const mergedResults = [
          ...localResults,
          ...results.filter((place) => !localNames.has(place.name.trim().toLowerCase())),
        ];
        setSearchSuggestions(mergedResults.slice(0, 5));
        setShowSuggestions(mergedResults.length > 0 || /mumbai|bombay/i.test(searchQuery));
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
    setIsSearchFocused(false);
    if (searchQuery.trim()) {
      recordRecentSearch(searchQuery.trim());
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
      // 1. Curated verified MMR & India discovery places (tourist places, markets, hotels, libraries, stations)
      const localMMR = getNearbyDiscoveryPlaces(lat, lng, radius, 'all');

      // 2. Query backend API for indexed places
      let apiItems: any[] = [];
      try {
        const resp = await api.getNearbyPlaces(lat, lng, radius, 50);
        apiItems = resp?.results || resp?.data || resp?.places || (Array.isArray(resp) ? resp : []);
      } catch (apiErr) {
        console.warn('API getNearbyPlaces error (falling back to discovery DB):', apiErr);
      }

      // 3. Merge datasets avoiding duplicates
      const seenNames = new Set<string>();
      const seenIds = new Set<string>();
      const mergedList: any[] = [];

      // Add local MMR discovery items first (with exact category, accurate distance, details)
      for (const item of localMMR) {
        const normKey = item.name.toLowerCase().trim();
        const normId = item.id.toLowerCase().trim();
        seenNames.add(normKey);
        seenIds.add(normId);
        mergedList.push({
          id: item.id,
          name: item.name,
          category: classifyNearbyCategory(`${item.category} ${item.categoryLabel} ${item.name} ${(item.tags || []).join(' ')}`),
          categoryLabel: item.categoryLabel,
          area: item.area,
          city: item.city,
          state: item.state,
          lat: item.lat,
          lng: item.lng,
          distance_km: item.distance_km,
          rating: item.rating ?? 4.7,
          summary: item.summary,
          best_time: item.best_time,
        });
      }

      // Add backend items if not already added
      for (const p of apiItems) {
        const normKey = (p.name || '').toLowerCase().trim();
        const normId = (p.id || '').toLowerCase().trim();
        if (!seenNames.has(normKey) && !seenIds.has(normId)) {
          seenNames.add(normKey);
          seenIds.add(normId);

          const pLat = p.lat ?? p.latitude ?? lat;
          const pLng = p.lng ?? p.longitude ?? lng;
          const dist = p.distance_km !== undefined ? p.distance_km : calculateHaversineKm(lat, lng, pLat, pLng);

          // Infer category type for filtering
          const catType = classifyNearbyCategory(`${p.category || ''} ${p.categoryLabel || ''} ${p.name || ''} ${(p.tags || []).join(' ')}`);

          mergedList.push({
            id: p.id,
            name: p.name,
            category: catType,
            categoryLabel: p.categoryLabel || p.category || 'Place to visit',
            area: p.area || p.district || p.city,
            city: p.city || 'Navi Mumbai',
            state: p.state || 'Maharashtra',
            lat: pLat,
            lng: pLng,
            distance_km: typeof dist === 'number' ? Math.round(dist * 10) / 10 : dist,
            rating: p.rating || 4.7,
            summary: p.summary || p.description || '',
            best_time: p.best_time_to_visit || p.visiting_hours || (p as any).best_time,
          });
        }
      }

      // Sort by distance ascending
      mergedList.sort((a, b) => (Number(a.distance_km) || 0) - (Number(b.distance_km) || 0));

      setNearbyPlaces(mergedList);
      setDetectedCityName(cityName || `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`);
      setLocationStatus('ready');
    } catch (err) {
      console.error('fetchNearbyPlaces failure:', err);
      setNearbyPlaces([]);
      setLocationStatus('error');
    }
  };

  // Quick City fallback for Near You
  const handleSelectFallbackCity = (city: { name: string; lat: number; lng: number }) => {
    setUserCoords({ lat: city.lat, lng: city.lng });
    fetchNearbyPlaces(city.lat, city.lng, nearbyRadius, city.name);
  };

  // Keep only the active and next high-resolution slide loaded to avoid a heavy first paint.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIdx((curr) => (curr + 1) % HERO_HERITAGE_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
      imageUrl: '/images/varanasi-ganga-aarti.jpg',
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

  // Offbeat discoveries use specifically named local photos. “Popular” is editorial,
  // not a visitor-count claim; official status and operational details need confirmation.
  const popularHiddenPlaces = [
    { id: 'meghalaya_010', name: 'Mawlynnong Village', location: 'East Khasi Hills, Meghalaya', type: 'Village & local life', image: '/images/meghalaya/mawlynnong-village.jpg' },
    { id: 'living-root-bridges', name: 'Living Root Bridges', location: 'Nongriat, Meghalaya', type: 'Living-root trail', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg/1280px-Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg' },
    { id: 'meghalaya_009', name: 'Umngot River', location: 'Dawki, Meghalaya', type: 'River & landscapes', image: '/images/meghalaya/umngot-river-dawki.png' },
    { id: 'meghalaya_006', name: 'Nohkalikai Falls', location: 'Sohra, Meghalaya', type: 'Waterfall', image: '/images/meghalaya/nohkalikai-falls.jpg' },
    { id: 'meghalaya_002', name: 'Umiam Lake', location: 'Ri-Bhoi, Meghalaya', type: 'Lake & viewpoints', image: '/images/meghalaya/umiam-lake.png' },
    { id: 'arunachal_pradesh_008', name: 'Ziro Valley', location: 'Lower Subansiri, Arunachal Pradesh', type: 'Valley & culture', image: '/images/arunachal/ziro-valley.jpg' },
    { id: 'manipur_002', name: 'Loktak Lake', location: 'Bishnupur, Manipur', type: 'Lake & phumdis', image: '/images/manipur/loktak-lake-floating-phumdis.jpg' },
    { id: 'andhra_pradesh_004', name: 'Borra Caves', location: 'Ananthagiri, Andhra Pradesh', type: 'Caves & geology', image: '/images/andhra/borra-caves.jpg' },
    { id: 'lepakshi-veerabhadra-temple', name: 'Lepakshi', location: 'Sri Sathya Sai, Andhra Pradesh', type: 'Temple art & Nandi', image: '/images/andhra/lepakshi-nandi.jpg' },
  ];

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
      {/* 1. HERO SECTION: UNIVERSAL SEARCH & HIGH-RESOLUTION HERITAGE SLIDESHOW    */}
      {/* ========================================================================= */}
      <section
        className="relative w-full rounded-2xl sm:rounded-[36px] overflow-hidden border border-[#EFE8DF] shadow-xl min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] xl:min-h-[720px] 2xl:min-h-[760px] flex flex-col justify-between p-4 sm:p-7 lg:p-10 xl:p-12 select-none bg-stone-900/10"
        aria-label="Incredible India Living Heritage Slideshow"
      >
        {/* ========================================================================= */}
        {/* AUTOMATIC HERITAGE SLIDESHOW BACKGROUND                                  */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {HERO_HERITAGE_SLIDES.map((slide, idx) => {
            const isActive = idx === activeSlideIdx;
            const isNext = idx === (activeSlideIdx + 1) % HERO_HERITAGE_SLIDES.length;
            if (!isActive && !isNext) return null;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
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
                  className="w-full h-full object-cover object-[center_35%] select-none filter contrast-[1.05] brightness-[1.0] saturate-[1.05]"
                  loading="eager"
                  style={{ opacity: 1 }}
                />
              </div>
            );
          })}

          {/* A non-blurred dark gradient keeps the photograph crisp while making
              the white headline readable across both bright and dark slides. */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              background:
                'linear-gradient(90deg, rgba(13, 24, 30, 0.82) 0%, rgba(13, 24, 30, 0.66) 34%, rgba(13, 24, 30, 0.22) 65%, rgba(13, 24, 30, 0.04) 100%)',
            }}
          />

          {/* Very subtle bottom-right vignette for navigation controls */}
          <div
            className="absolute bottom-0 inset-x-0 h-36 pointer-events-none z-[2]"
            style={{
              background:
                'linear-gradient(to top, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.08) 55%, transparent 100%)',
            }}
          />
        </div>

        {/* Ashoka Chakra Translucent Watermark in Far Sky */}
        <div className="absolute top-3 left-1/3 -translate-x-1/2 z-0 pointer-events-none opacity-[0.07] hidden md:block">
          <AshokaChakra size={240} color="#0B407A" />
        </div>

        {/* Top Right "From Our Heritage To A Brighter Tomorrow" Banner */}
        <div className="hidden sm:flex absolute top-5 right-5 sm:top-8 sm:right-8 bg-white px-4 py-2 rounded-2xl border border-white shadow-sm items-center gap-3 text-stone-800 z-10 select-none">
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
            <div className="mb-4 sm:mb-5 w-fit max-w-full p-1 sm:p-2">
              <IncredibleIndiaBadge className="mb-3 sm:mb-4" />

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-bold tracking-tight text-white leading-[1.15] [text-shadow:0_2px_8px_rgba(0,0,0,0.55)]">
                <span>Discover India&apos;s</span>
                <span className="block mt-1 sm:mt-1.5">
                  <span className="text-[#FF8A45]">Living</span>{' '}
                  <span className="text-[#77D49A]">Heritage</span>
                </span>
              </h1>

              <p className="text-sm sm:text-base text-white max-w-xl mt-2.5 sm:mt-3.5 leading-relaxed font-semibold [text-shadow:0_1px_5px_rgba(0,0,0,0.7)]">
                Explore monuments, cultures, natural wonders and hidden gems across every region of India.
              </p>
            </div>

            {/* Universal Search Input Bar with Live Suggestions Dropdown */}
            <div ref={searchContainerRef} className="relative mt-5 sm:mt-6 max-w-xl xl:max-w-2xl">
              <form onSubmit={handleSearchSubmit}>
                <div className="bg-white rounded-full p-2 sm:p-2.5 pl-4 sm:pl-6 shadow-md hover:shadow-lg border border-stone-200 flex items-center gap-2 sm:gap-3 transition-all focus-within:ring-2 focus-within:ring-[#FF671F]/30 focus-within:border-[#FF671F]">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      if (searchSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="Search monuments, cities, or trails..."
                    className="w-full bg-transparent text-xs sm:text-sm md:text-base text-stone-800 placeholder-stone-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchSuggestions([]);
                      }}
                      className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer shrink-0"
                      aria-label="Clear search query"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isSearching && <Loader2 className="w-4 h-4 text-amber-600 animate-spin mr-1 shrink-0" />}
                  {/* Camera Button Small for AR Monument Explorer */}
                  <button
                    type="button"
                    onClick={() => setIsARModalOpen(true)}
                    title="Scan Monument with AR Camera or Upload Photo"
                    className="p-2 sm:p-2.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[#FF671F] border border-orange-200/80 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer shadow-2xs"
                    aria-label="Open AR Camera & Visual Identification"
                  >
                    <Camera className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#FF671F]" />
                  </button>
                  <button
                    type="submit"
                    className="bg-[#FF671F] hover:bg-[#E65100] text-white px-4 sm:px-7 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </form>

              {/* Recent Searches Dropdown: Shown when clicking/focusing search bar with empty query */}
              {isSearchFocused && !searchQuery.trim() && recentSearches.length > 0 && !showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-30 animate-fadeIn">
                  <div className="p-2.5 border-b border-stone-100 flex items-center justify-between px-3.5">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-[#FF671F]" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleClearHistory(e);
                      }}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer transition"
                      title="Clear recent search history"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear History</span>
                    </button>
                  </div>

                  <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                    {recentSearches.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchQuery(item.query);
                          recordRecentSearch(item.query);
                          setShowSuggestions(false);
                          setIsSearchFocused(false);
                          onSearch(item.query);
                        }}
                        className="p-3 hover:bg-orange-50/60 cursor-pointer transition flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#FF671F] shrink-0 transition-colors" />
                          <span className="text-xs font-medium text-stone-800 group-hover:text-stone-950 truncate">
                            {item.query}
                          </span>
                        </div>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveRecentSearch(item.query, e);
                          }}
                          className="p-1 rounded-md text-stone-300 hover:text-stone-700 hover:bg-stone-200/50 transition shrink-0"
                          title={`Remove "${item.query}"`}
                          aria-label={`Remove ${item.query}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-stone-100 bg-[#FAF8F5] flex items-center justify-between px-3.5">
                    <span className="text-[11px] text-stone-400">Latest {Math.min(5, recentSearches.length)} searches</span>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleClearHistory(e);
                      }}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear History</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Live Suggestions Dropdown */}
              {showSuggestions && (searchSuggestions.length > 0 || /mumbai|bombay/i.test(searchQuery)) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-30 animate-fadeIn">
                  {/mumbai|bombay/i.test(searchQuery) && (
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        recordRecentSearch('Mumbai');
                        setSearchQuery('Mumbai');
                        setShowSuggestions(false);
                        setIsSearchFocused(false);
                        onSelectCity?.('Mumbai');
                        onNavigateTab('dashboard', 'Mumbai');
                      }}
                      className="w-full p-3 bg-orange-50/80 hover:bg-orange-100/80 border-b border-orange-100 cursor-pointer transition flex items-center justify-between gap-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 text-[#FF671F] flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-xs font-bold text-stone-900">Mumbai</h4>
                          <p className="text-[11px] text-stone-500">Maharashtra · City destination</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#FF671F] bg-white border border-orange-200 px-2 py-1 rounded-lg shrink-0">Explore city</span>
                    </button>
                  )}
                  {searchSuggestions.length > 0 && (
                  <div className="p-2 border-b border-stone-100 text-[11px] font-bold text-stone-400 px-3 uppercase tracking-wider">
                    Mumbai attractions and hidden gem candidates
                  </div>
                  )}
                  <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                    {searchSuggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setShowSuggestions(false);
                          setIsSearchFocused(false);
                          recordRecentSearch(item.name);
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
            <div className="flex overflow-x-auto sm:flex-wrap items-center gap-2 sm:gap-2.5 mt-5 sm:mt-6 pb-1 scrollbar-none mobile-scroll-row">
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
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-stone-200 hover:border-[#FF671F] hover:bg-white text-xs sm:text-sm font-semibold text-stone-800 shadow-2xs hover:shadow-xs transition flex items-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF671F] shrink-0" />
                  <span>{chip.name}</span>
                </button>
              ))}
            </div>

            {/* Verified Heritage Highlights & Tourism Trust Strip */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-5 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-300/40">
              <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-white shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF671F] shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 leading-none">42 UNESCO</div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5">Heritage Sites</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-white shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#046A38] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 leading-none">3,600+ ASI</div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5">Protected Shrines</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-white shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center text-[#0284C7] shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 leading-none">28 States & UTs</div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5">Curated Trails</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {HERO_HERITAGE_SLIDES[activeSlideIdx].photoCredit && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 max-w-[42%] rounded-lg bg-stone-950 px-2 py-1 text-[9px] leading-tight text-white sm:text-[10px]">
            Photo:{' '}
            <a
              className="underline underline-offset-2 hover:text-white"
              href={HERO_HERITAGE_SLIDES[activeSlideIdx].photoCredit!.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {HERO_HERITAGE_SLIDES[activeSlideIdx].photoCredit!.name}
            </a>
            {' · '}
            <a
              className="underline underline-offset-2 hover:text-white"
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              CC BY-SA 4.0
            </a>
            {' · cropped & WebP'}
          </div>
        )}

        {/* Small caption identifies the current slideshow image without covering it. */}
        <div
          className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100%_-_1.5rem)] truncate rounded-full border border-white bg-stone-950 px-3 py-1 text-[10px] font-semibold text-white shadow-sm sm:px-3.5 sm:py-1.5 sm:text-xs"
          aria-live="polite"
          title={HERO_HERITAGE_SLIDES[activeSlideIdx].name}
        >
            {HERO_HERITAGE_SLIDES[activeSlideIdx].name}
        </div>

      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-orange-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5" aria-label="Arunachal Pradesh permit guide">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-sky-100 p-2.5 text-sky-800"><ShieldCheck className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-800">Before you travel</p>
            <h2 className="mt-0.5 font-serif text-lg font-bold text-slate-900">Visiting Arunachal Pradesh?</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">Indian visitors need an ILP; foreign visitors need a PAP. Check the current rules and official application links.</p>
          </div>
        </div>
        <a href="/explore?state=arunachal-pradesh" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700">Open permit guide <ArrowRight className="h-4 w-4" /></a>
      </section>

      {/* ========================================================================= */}
      {/* 2. EXPLORE NEAR YOU (REAL GEOLOCATION WITH PERMISSION)                     */}
      {/* ========================================================================= */}
      <section id="explore-near-you" className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-[#FBFFFC] to-[#FFF7EF] border border-[#E8E2D8] p-4 sm:p-7 shadow-sm space-y-4 sm:space-y-5 relative overflow-hidden">
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-emerald-100/45 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-16 w-64 h-64 rounded-full bg-orange-100/50 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#046A38] uppercase tracking-wider mb-1">
              <Navigation className="w-3.5 h-3.5 text-[#046A38]" />
              <span>Nearby discovery</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Explore Near You
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
              Find remarkable places around you or start from a popular Indian city.
            </p>
          </div>

          {/* Action to trigger or re-trigger location */}
          {locationStatus !== 'idle' && <div className="flex flex-wrap items-center gap-2 relative z-10">
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
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-stone-200 text-[11px] sm:text-xs font-semibold text-stone-700 bg-stone-50"
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
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#046A38] hover:bg-[#03542C] text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {locationStatus === 'detecting' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{locationStatus === 'ready' ? 'Update Location' : 'Use Current Location'}</span>
                </>
              )}
            </button>
          </div>}
        </div>

        {/* State 1: Idle Prompt */}
        {locationStatus === 'idle' && (
          <div className="relative z-10 rounded-2xl bg-white/85 backdrop-blur-xs border border-[#DCEDE2] shadow-xs overflow-hidden grid md:grid-cols-[0.9fr_1.25fr]">
            <div className="p-5 sm:p-6 bg-gradient-to-br from-[#075D36] to-[#043F27] text-white flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center shadow-sm">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">See what&apos;s nearby</h3>
                  <p className="text-xs sm:text-sm text-emerald-50/85 mt-1.5 leading-relaxed max-w-sm">
                    Find nearby attractions, heritage sites, hills, parks, wildlife areas and transport hubs with approximate distances.
                  </p>
                </div>
              </div>
              <div>
                <button
                  onClick={handleDetectLocation}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E45716] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Use my location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-emerald-100/70 mt-2">Location is used only to calculate nearby results.</p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF671F]">Choose a starting point</span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-1">Popular heritage gateways</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Hyderabad', region: 'Deccan forts & old city', lat: 17.385, lng: 78.4867 },
                { name: 'Mumbai Coast', region: 'Colaba, Fort & Marine Drive', lat: 18.922, lng: 72.8347 },
                { name: 'Delhi NCR', region: 'Capital heritage', lat: 28.6139, lng: 77.209 },
                { name: 'Jaipur', region: 'Royal Rajasthan', lat: 26.9124, lng: 75.7873 },
                { name: 'Agra', region: 'Mughal heritage', lat: 27.1767, lng: 78.0081 },
                { name: 'Varanasi', region: 'Sacred ghats', lat: 25.3176, lng: 82.9739 },
              ].map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleSelectFallbackCity(c)}
                  className="group p-3 rounded-xl bg-[#FAF8F5] hover:bg-white border border-[#E8E2D8] hover:border-[#FF9D68] text-left shadow-2xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <MapPin className="w-4 h-4 text-[#FF671F] shrink-0" />
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#FF671F] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 mt-2">{c.name}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{c.region}</div>
                </button>
              ))}
              </div>
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
                { name: 'Hyderabad Heritage', lat: 17.385, lng: 78.4867 },
                { name: 'Mumbai Coast', lat: 18.922, lng: 72.8347 },
                { name: 'Delhi NCR', lat: 28.6139, lng: 77.209 },
                { name: 'Jaipur / Amer', lat: 26.9124, lng: 75.7873 },
                { name: 'Agra Heritage', lat: 27.1767, lng: 78.0081 },
                { name: 'Varanasi Ghats', lat: 25.3176, lng: 82.9739 },
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
        {locationStatus === 'ready' && (() => {
          const nearbyTabs: Array<{ id: 'all' | NearbyCategory; label: string; icon: any }> = [
            { id: 'all', label: 'All nearby', icon: Compass },
            { id: 'attraction', label: 'Places to visit', icon: Landmark },
            { id: 'heritage', label: 'Heritage & forts', icon: History },
            { id: 'spiritual', label: 'Spiritual', icon: Landmark },
            { id: 'hill', label: 'Hills & nature', icon: Mountain },
            { id: 'park', label: 'Parks & wildlife', icon: Trees },
            { id: 'transport', label: 'Transport', icon: Bus },
            { id: 'library', label: 'Libraries', icon: BookOpen },
            { id: 'market', label: 'Markets', icon: Store },
            { id: 'hotel', label: 'Hotels', icon: Building2 },
          ];
          const filteredNearbyPlaces = nearbyPlaces.filter((p) => nearbyCategoryTab === 'all' || p.category === nearbyCategoryTab);

          const categoryPills: Record<string, { label: string; badge: string; text: string; bgSoft: string; border: string }> = {
            attraction: { label: 'Place to visit', badge: 'bg-emerald-700 text-white', text: 'text-emerald-700', bgSoft: 'bg-emerald-50/70', border: 'border-emerald-200' },
            heritage: { label: 'Heritage & history', badge: 'bg-orange-700 text-white', text: 'text-orange-700', bgSoft: 'bg-orange-50/70', border: 'border-orange-200' },
            spiritual: { label: 'Spiritual place', badge: 'bg-violet-700 text-white', text: 'text-violet-700', bgSoft: 'bg-violet-50/70', border: 'border-violet-200' },
            hill: { label: 'Hills & nature', badge: 'bg-teal-700 text-white', text: 'text-teal-700', bgSoft: 'bg-teal-50/70', border: 'border-teal-200' },
            park: { label: 'Parks & wildlife', badge: 'bg-green-700 text-white', text: 'text-green-700', bgSoft: 'bg-green-50/70', border: 'border-green-200' },
            transport: { label: 'Transport hub', badge: 'bg-sky-700 text-white', text: 'text-sky-700', bgSoft: 'bg-sky-50/70', border: 'border-sky-200' },
            market: { label: 'Market', badge: 'bg-amber-700 text-white', text: 'text-amber-700', bgSoft: 'bg-amber-50/70', border: 'border-amber-200' },
            hotel: { label: 'Hotel', badge: 'bg-blue-700 text-white', text: 'text-blue-700', bgSoft: 'bg-blue-50/70', border: 'border-blue-200' },
            library: { label: 'Library', badge: 'bg-teal-700 text-white', text: 'text-teal-700', bgSoft: 'bg-teal-50/70', border: 'border-teal-200' },
          };

          return (
            <div className="space-y-4">
              {/* Category Filter Tabs Bar */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
                  {nearbyTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = nearbyCategoryTab === tab.id;
                    const count = tab.id === 'all' ? nearbyPlaces.length : nearbyPlaces.filter((place) => place.category === tab.id).length;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setNearbyCategoryTab(tab.id as any)}
                        className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-[#046A38] text-white shadow-sm shadow-emerald-900/20'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                        <span>{tab.label}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-stone-600 font-medium ml-auto flex items-center gap-2">
                  <span>Near <strong className="text-stone-900">{detectedCityName}</strong></span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
                    {filteredNearbyPlaces.length} places
                  </span>
                </div>
              </div>

              {filteredNearbyPlaces.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                  No places found in this category within {nearbyRadius} km. Try choosing &quot;All nearby&quot; or expanding the radius above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                  {filteredNearbyPlaces.map((p) => {
                    const pill = categoryPills[p.category] || categoryPills.attraction;
                    return (
                      <div
                        key={p.id}
                        onClick={() => onSelectPlace && onSelectPlace(p.id)}
                        className={`group cursor-pointer rounded-2xl bg-white border ${pill.border} hover:border-[#046A38] p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 relative overflow-hidden`}
                      >
                        {/* Top Accent Strip */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${pill.badge.split(' ')[0]}`} />

                        {/* Top Header: Category Badge + Distance Badge */}
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <span className={`px-2.5 py-1 rounded-lg ${pill.bgSoft} ${pill.text} border ${pill.border} text-[11px] font-bold shadow-2xs flex items-center gap-1.5`}>
                            {p.category === 'market' && <Store className="w-3 h-3" />}
                            {p.category === 'hotel' && <Building2 className="w-3 h-3" />}
                            {p.category === 'library' && <BookOpen className="w-3 h-3" />}
                            {p.category === 'transport' && (/airport/i.test(p.categoryLabel || p.name) ? <Plane className="w-3 h-3" /> : /rail|train/i.test(p.categoryLabel || p.name) ? <Train className="w-3 h-3" /> : <Bus className="w-3 h-3" />)}
                            {['attraction', 'heritage', 'spiritual'].includes(p.category) && <Landmark className="w-3 h-3" />}
                            {p.category === 'hill' && <Mountain className="w-3 h-3" />}
                            {p.category === 'park' && <Trees className="w-3 h-3" />}
                            <span>{pill.label}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            {p.distance_km !== undefined && (
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[#046A38] border border-emerald-200 text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                                <Navigation className="w-2.5 h-2.5" />
                                <span>{p.distance_km} km</span>
                              </span>
                            )}
                            {p.rating && (
                              <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                <span>{p.rating}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Category Sub-label */}
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            {p.categoryLabel || p.category}
                          </div>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-emerald-700 transition line-clamp-1 mt-0.5">
                            {p.name}
                          </h4>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-xs text-stone-600">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate font-medium">{p.area || p.city}, {p.state}</span>
                        </div>

                        {/* Summary */}
                        {p.summary && (
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {p.summary}
                          </p>
                        )}

                        {/* Footer: Timings & Details Link */}
                        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                          {p.best_time ? (
                            <div className="flex items-center gap-1 truncate text-stone-500 max-w-[75%]">
                              <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="truncate">{p.best_time}</span>
                            </div>
                          ) : (
                            <span className="text-stone-400 text-[10px]">Open to public</span>
                          )}
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0">
                            <span>Details</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR DESTINATIONS                                                   */}
      {/* ========================================================================= */}
      <section className="space-y-4 sm:space-y-5">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#FF671F] uppercase tracking-wider mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Curated Highlights</span>
              </div>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Popular Destinations
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
                Iconic places that inspire every journey
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
              <div className="flex items-center rounded-full border border-stone-200 bg-white p-1 shadow-2xs">
                {(['All', 'Forts', 'Temples', 'UNESCO'] as const).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActivePopularCategory(category)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition sm:px-3 sm:text-[11px] ${
                      activePopularCategory === category
                        ? 'bg-[#FF671F] text-white shadow-sm'
                        : 'text-stone-500 hover:bg-orange-50 hover:text-[#C64F16]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="text-xs font-bold text-[#FF671F] hover:text-[#E65100] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full hover:bg-orange-50/60 transition flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
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
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 flex items-center justify-center shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next destination"
                  onClick={() => {
                    const el = document.getElementById('popular-destinations-grid');
                    if (el) el.scrollBy({ left: 260, behavior: 'smooth' });
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 flex items-center justify-center shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 6 Destination Cards Grid */}
        <div
          id="popular-destinations-grid"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 overflow-x-auto pb-1 scrollbar-none"
        >
          {filteredPopular.map((place, pIdx) => (
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
                <div className="h-44 sm:h-56 lg:h-64 w-full overflow-hidden bg-stone-100 relative">
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
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-2.5 top-2.5 rounded-full border border-white/30 bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    {place.badge}
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-bold text-stone-800 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {place.rating}
                  </span>
                </div>

                <div className="p-3 sm:p-4 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#FF671F] transition truncate">
                      {place.name}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-stone-500 truncate mt-0.5 font-medium">
                      {place.location}
                    </p>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 group-hover:bg-[#FF671F] group-hover:text-white text-stone-600 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Popular offbeat picks: discovery suggestions, not an official popularity ranking. */}
      <section className="space-y-4 sm:space-y-5" aria-labelledby="popular-hidden-title">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#A84B13] uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Local favourites &amp; offbeat finds</span>
              </div>
              <h2 id="popular-hidden-title" className="font-serif text-xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Popular Hidden Places
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
                Less-obvious places travellers discover through local recommendations.
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] sm:text-xs font-semibold text-emerald-900">
              Discovery picks · popularity, official status &amp; visit details need local confirmation
            </span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {popularHiddenPlaces.map((place, index) => (
            <ScrollReveal key={place.id} animation="fade-up" delay={(index % 4) * 45} className="h-full">
              <button
                type="button"
                onClick={() => onSelectPlace ? onSelectPlace(place.id) : onNavigateTab('heritage')}
                className="group w-full h-full overflow-hidden rounded-2xl border border-[#EFE8DF] bg-white text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:border-[#D86620]/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-label={`Explore ${place.name}, ${place.location}`}
              >
                <div className="relative h-36 sm:h-44 overflow-hidden bg-emerald-50">
                  <img
                    src={place.image}
                    alt={`${place.name} in ${place.location}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-950/70 to-transparent" />
                  <span className="absolute left-2.5 top-2.5 rounded-full border border-white/35 bg-stone-950/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    Offbeat pick
                  </span>
                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-stone-800 shadow-sm">
                    {place.type}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#B64C0D]">
                      {place.name}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] sm:text-xs text-stone-600">{place.location}</p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#B64C0D] transition-colors group-hover:bg-[#C8510B] group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3 sm:gap-4" aria-label="Plan your next discovery">
        {[
          { title: 'Build a trip', text: 'Choose a city, pace and interests for a practical itinerary.', action: 'Plan a journey', icon: Compass, onClick: () => onNavigateTab('itinerary'), tone: 'from-[#FFF2E8] to-white', accent: 'text-[#D7581B]' },
          { title: 'Find a festival', text: 'Browse celebrations by date, region and tradition.', action: 'Open calendar', icon: Landmark, onClick: () => onNavigateTab('festivals'), tone: 'from-[#F5F0FF] to-white', accent: 'text-[#7049A5]' },
          { title: 'Ask Virasat AI', text: 'Get a personal India travel answer with route-aware context.', action: 'Start a conversation', icon: Bot, onClick: () => onNavigateTab('ai'), tone: 'from-[#EAF9F1] to-white', accent: 'text-[#047044]' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              onClick={item.onClick}
              className={`group rounded-2xl border border-stone-200/80 bg-gradient-to-br ${item.tone} p-5 text-left shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ${item.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">{item.title}</h3>
              <p className="mt-1.5 min-h-10 text-xs leading-relaxed text-stone-600">{item.text}</p>
              <span className={`mt-4 inline-flex items-center gap-1 text-xs font-bold ${item.accent}`}>
                {item.action} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </section>

      {/* ========================================================================= */}
      {/* 4. EXPLORE INDIA BY REGION                                                */}
      {/* ========================================================================= */}
      <section className="space-y-4 sm:space-y-5">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#FF671F] uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>Pan-India Cultural Geographies</span>
              </div>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-stone-900 tracking-tight">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Left: 6 Region Cards in 3x2 Grid with Authentic Heritage Photography */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
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
                    className="group cursor-pointer rounded-2xl overflow-hidden relative border border-stone-200/80 hover:border-[#FF671F] shadow-2xs hover:shadow-warm transition-all duration-300 min-h-[145px] sm:min-h-[175px] h-full flex flex-col justify-between p-3 sm:p-3.5 text-left bg-stone-900"
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
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/95 backdrop-blur-md flex items-center justify-center shadow-xs border border-white/40 group-hover:scale-105 transition-transform">
                        <IconComp className={`w-4 h-4 sm:w-5 sm:h-5 ${reg.iconColor}`} />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-stone-100 bg-black/55 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full border border-white/15">
                        {reg.statesCount}
                      </span>
                    </div>

                    {/* Bottom: Region Name & Iconic Heritage Highlights */}
                    <div className="relative z-10 space-y-0.5 pt-3 sm:pt-4">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-serif font-bold text-white text-xs sm:text-base tracking-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                          {reg.name}
                        </h3>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-stone-300 line-clamp-1 font-medium drop-shadow-xs">
                        {reg.landmarkHighlight}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Right: Map and festivals */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
            {/* Card 1: Explore on Map */}
            <ScrollReveal animation="fade-left" delay={100} className="flex-1 flex">
              <div
                onClick={() => onNavigateTab('map')}
                className="rounded-2xl bg-white border border-[#EFE8DF] p-3.5 sm:p-5 shadow-2xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer group flex-1 w-full"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IndiaIllustratedMapGraphic className="w-16 h-16 sm:w-24 sm:h-24" />
                </div>
                <div className="space-y-1 sm:space-y-1.5 flex-1">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 leading-snug">
                    Explore on Map
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Find destinations, heritage sites, railway stations and more.
                  </p>
                  <button
                    type="button"
                    className="bg-[#046A38] hover:bg-[#03542C] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition active:scale-95 mt-1 cursor-pointer"
                  >
                    <span>Open Interactive Map</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Festivals */}
            <ScrollReveal animation="fade-left" delay={200} className="flex-1 flex">
              <div
                onClick={() => onNavigateTab('festivals')}
                className="rounded-2xl overflow-hidden relative p-5 sm:p-6 shadow-2xs hover:shadow-md transition flex flex-col justify-center min-h-[170px] text-white cursor-pointer group flex-1 w-full"
              >
                <img
                  src="/images/diwali-lamps-diyas.jpg"
                  alt="Diyas lit during Diwali"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <img
                  src="/images/braj-holi-celebration.jpg"
                  alt="Colours of Holi"
                  className="absolute inset-y-0 right-0 w-[30%] h-full object-cover hidden sm:block border-l-2 border-white/50 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#13283D]/95 via-[#13283D]/80 to-[#13283D]/25 pointer-events-none" />
                <div className="relative z-10 space-y-1.5 max-w-[75%]">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200">Celebrate the seasons</span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                    Festivals of India
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    Discover traditions, stories and celebrations across every region.
                  </p>
                  <button
                    type="button"
                    className="bg-[#FF671F] hover:bg-[#E65100] text-white px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition active:scale-95 self-start mt-2 cursor-pointer"
                  >
                    <span>Explore Festivals</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INDIA FLAG & HERITAGE MESSAGE */}
      {/* ========================================================================= */}
      <ScrollReveal animation="fade-up">
        <section className="rounded-2xl sm:rounded-3xl border border-[#E8DCCB] overflow-hidden shadow-sm p-5 sm:p-8 bg-gradient-to-br from-[#FFF8EE] via-white to-[#F1F9F3]">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <div role="img" aria-label="Flag of India with saffron, white and green bands and a 24-spoke Ashoka Chakra" className="relative w-52 sm:w-60 aspect-[3/2] shrink-0 overflow-hidden rounded-lg border border-stone-200 shadow-md">
              <div className="h-1/3 bg-[#FF671F]" />
              <div className="h-1/3 bg-white" />
              <div className="h-1/3 bg-[#046A38]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <AshokaChakra size={50} color="#000080" opacity={1} />
              </div>
            </div>
            <div className="text-center sm:text-left space-y-2">
              <div className="text-[11px] font-bold text-[#8D4B18] uppercase tracking-[0.18em]">Explore · Respect · Preserve</div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-[#0B192C] leading-tight">Incredible India.<br />For Generations.</p>
              <p className="text-sm text-stone-600 max-w-sm">A journey through the places, cultures and celebrations that bring us together.</p>
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

      {/* AR Camera & Visual Monument Identification Modal */}
      <MonumentARCameraModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
