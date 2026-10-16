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
  Bot,
  Camera,
  History,
  Trash2,
  X,
  Store,
  Building2,
  BookOpen,
  Train,
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';
import { PlaceSummary } from '../../types';
import { api } from '../../services/api';
import { MonumentARCameraModal } from '../ar/MonumentARCameraModal';
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
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&auto=format&fit=crop&q=85',
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
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&auto=format&fit=crop&q=85',
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
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&auto=format&fit=crop&q=85',
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
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1600&auto=format&fit=crop&q=85',
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
    imageUrl: '/images/andhra-pradesh-tirumala-4k.jpg',
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
    imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1600&auto=format&fit=crop&q=85',
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
    imageUrl: '/images/delhi-red-fort-4k.jpg',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Red_Fort_in_Delhi_03-2016_img1.jpg/1280px-Red_Fort_in_Delhi_03-2016_img1.jpg',
  },
  {
    id: 'mahakaleshwar-temple-ujjain',
    name: 'Shri Mahakaleshwar Jyotirlinga',
    location: 'Ujjain',
    state: 'Madhya Pradesh',
    category: 'Sacred Jyotirlinga & Mahakal Lok',
    tag: 'Dakshinmukhi Swayambhu Jyotirlinga & Sacred Bhasma Aarti',
    builtEra: 'Ancient Epoch • Rebuilt by Maratha Scindias 1734 CE',
    bestTime: 'Early Morning Bhasma Aarti & Shravan Month',
    rating: '4.9',
    reviewsCount: '63.5k',
    imageUrl: '/images/madhya-pradesh-mahakaleshwar-ujjain-4k.jpg',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Mahakaleshwar_temple_in_Ujjain.jpg/1280px-Mahakaleshwar_temple_in_Ujjain.jpg',
  },
  {
    id: 'jagannath-temple-puri',
    name: 'Shree Jagannath Temple & Rath Yatra',
    location: 'Puri',
    state: 'Odisha',
    category: 'Char Dham Sacred Pilgrimage',
    tag: 'World-Famous Chariot Festival (Rath Yatra) & Nilachakra',
    builtEra: '1161 CE • King Anantavarman Chodaganga',
    bestTime: 'Rath Yatra Festival (Ashadha) & Oct – Mar',
    rating: '4.9',
    reviewsCount: '58.3k',
    imageUrl: '/images/odisha-puri-jagannath-4k.jpg',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Puri_Jagannatha_Temple.jpg/1280px-Puri_Jagannatha_Temple.jpg',
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
    imageUrl: '/images/varanasi-ganga-aarti.jpg',
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
    imageUrl: '/images/kaziranga-rhino-4k.jpg',
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
  const [nearbyCategoryTab, setNearbyCategoryTab] = useState<'all' | 'tourist' | 'market' | 'hotel' | 'library' | 'station'>('all');

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

      // Add local MMR discovery items first (with exact category, real photo, accurate distance)
      for (const item of localMMR) {
        const normKey = item.name.toLowerCase().trim();
        const normId = item.id.toLowerCase().trim();
        seenNames.add(normKey);
        seenIds.add(normId);
        mergedList.push({
          id: item.id,
          name: item.name,
          category: item.category,
          categoryLabel: item.categoryLabel,
          area: item.area,
          city: item.city,
          state: item.state,
          lat: item.lat,
          lng: item.lng,
          distance_km: item.distance_km,
          rating: item.rating ?? 4.7,
          thumbnail_url: item.thumbnail_url,
          image_url: item.image_url,
          summary: item.summary,
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
          let catType: 'tourist' | 'market' | 'hotel' | 'library' | 'station' = 'tourist';
          const pCatLower = ((p.category || '') + ' ' + (p.name || '')).toLowerCase();
          if (pCatLower.includes('market') || pCatLower.includes('bazaar') || pCatLower.includes('mandai') || pCatLower.includes('mall')) {
            catType = 'market';
          } else if (pCatLower.includes('hotel') || pCatLower.includes('palace hotel') || pCatLower.includes('resort')) {
            catType = 'hotel';
          } else if (pCatLower.includes('library') || pCatLower.includes('reading room') || pCatLower.includes('archives')) {
            catType = 'library';
          } else if (pCatLower.includes('station') || pCatLower.includes('terminus') || pCatLower.includes('junction') || pCatLower.includes('metro')) {
            catType = 'station';
          }

          mergedList.push({
            id: p.id,
            name: p.name,
            category: catType,
            categoryLabel: p.category || 'Heritage Landmark',
            area: p.area || p.district || p.city,
            city: p.city || 'Navi Mumbai',
            state: p.state || 'Maharashtra',
            lat: pLat,
            lng: pLng,
            distance_km: typeof dist === 'number' ? Math.round(dist * 10) / 10 : dist,
            rating: p.rating || 4.7,
            thumbnail_url: p.thumbnail_url || p.image_url,
            image_url: p.image_url || p.thumbnail_url,
            summary: p.summary || p.description || '',
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

  // Preload all 11 heritage slideshow images immediately on mount for zero-latency instant transitions
  useEffect(() => {
    HERO_HERITAGE_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.imageUrl;
    });
  }, []);

  // 100% Unconditional Continuous Automatic Heritage Slideshow (Always advances every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIdx((curr) => (curr + 1) % HERO_HERITAGE_SLIDES.length);
    }, 3000);

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
      {/* 1. HERO SECTION: UNIVERSAL SEARCH & 3-SECOND HERITAGE SLIDESHOW           */}
      {/* ========================================================================= */}
      <section
        className="relative w-full rounded-2xl sm:rounded-[36px] overflow-hidden border border-[#EFE8DF] shadow-xl min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] xl:min-h-[720px] 2xl:min-h-[760px] flex flex-col justify-between p-4 sm:p-7 lg:p-10 xl:p-12 select-none bg-stone-900/10"
        aria-label="Incredible India Living Heritage Slideshow"
      >
        {/* ========================================================================= */}
        {/* 3-SECOND AUTOMATIC HERITAGE SLIDESHOW BACKGROUND                          */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {HERO_HERITAGE_SLIDES.map((slide, idx) => {
            const isActive = idx === activeSlideIdx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-95 scale-100 z-[1]'
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
                  style={{ opacity: 0.95 }}
                />
              </div>
            );
          })}

          {/* 95% REAL PHOTO VISIBILITY TINT:
              Keeps 95% true photo visibility without milky white washout
          */}
          {/* Desktop/Tablet Horizontal Subtle Gradient Overlay */}
          <div
            className="absolute inset-0 hidden sm:block pointer-events-none z-[2]"
            style={{
              background:
                'linear-gradient(to right, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.16) 32%, rgba(255, 255, 255, 0.03) 55%, transparent 75%)',
            }}
          />

          {/* Mobile Vertical Subtle Gradient Overlay */}
          <div
            className="absolute inset-0 sm:hidden pointer-events-none z-[2]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.18) 40%, transparent 75%)',
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
        <div className="hidden sm:flex absolute top-5 right-5 sm:top-8 sm:right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/90 shadow-sm items-center gap-3 text-stone-800 z-10 select-none">
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
            <IncredibleIndiaBadge className="mb-3 sm:mb-4" />

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-bold tracking-tight text-[#0B192C] leading-[1.15] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
              <span>Discover India&apos;s</span>
              <span className="block mt-1 sm:mt-1.5">
                <span className="text-[#FF671F]">Living</span>{' '}
                <span className="text-[#046A38]">Heritage</span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-stone-700 max-w-xl mt-2.5 sm:mt-3.5 leading-relaxed font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              Explore monuments, cultures, natural wonders and hidden gems across every region of India.
            </p>

            {/* Universal Search Input Bar with Live Suggestions Dropdown */}
            <div ref={searchContainerRef} className="relative mt-5 sm:mt-6 max-w-xl xl:max-w-2xl">
              <form onSubmit={handleSearchSubmit}>
                <div className="bg-white/95 backdrop-blur-md rounded-full p-2 sm:p-2.5 pl-4 sm:pl-6 shadow-md hover:shadow-lg border border-stone-200/90 flex items-center gap-2 sm:gap-3 transition-all focus-within:ring-2 focus-within:ring-[#FF671F]/30 focus-within:border-[#FF671F]">
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
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-sm border border-stone-200/90 hover:border-[#FF671F] hover:bg-white text-xs sm:text-sm font-semibold text-stone-800 shadow-2xs hover:shadow-xs transition flex items-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF671F] shrink-0" />
                  <span>{chip.name}</span>
                </button>
              ))}
            </div>

            {/* Verified Heritage Highlights & Tourism Trust Strip */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-5 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-300/40">
              <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/70 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#FF671F] shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 leading-none">42 UNESCO</div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5">Heritage Sites</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/70 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#046A38] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900 leading-none">3,600+ ASI</div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5">Protected Shrines</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/70 shadow-2xs">
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

        {/* Centered Slideshow Navigation Bar (Free of any overlap with Virasat AI) */}
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-white/90 bg-white/95 px-3.5 py-1.5 sm:px-4 sm:py-2 shadow-lg backdrop-blur-md">
          <button
            type="button"
            aria-label="Previous destination slide"
            onClick={() => setActiveSlideIdx((index) => (index - 1 + HERO_HERITAGE_SLIDES.length) % HERO_HERITAGE_SLIDES.length)}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>
          <div className="flex items-center gap-1.5 px-1 sm:px-1.5" aria-label="Featured destination slideshow">
            {HERO_HERITAGE_SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.name}`}
                onClick={() => setActiveSlideIdx(index)}
                title={slide.name}
                className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                  index === activeSlideIdx ? 'w-6 sm:w-7 bg-[#FF671F]' : 'w-2 sm:w-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next destination slide"
            onClick={() => setActiveSlideIdx((index) => (index + 1) % HERO_HERITAGE_SLIDES.length)}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>
          <span className="hidden md:flex items-center gap-1.5 pl-2 text-xs font-bold text-stone-800 border-l border-stone-200 ml-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{HERO_HERITAGE_SLIDES[activeSlideIdx].name}</span>
          </span>
        </div>

        {/* Bottom Right Floating AI Assistant Quick Trigger */}
        <button
          type="button"
          onClick={() => onNavigateTab('ai')}
          className="hidden sm:flex absolute bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 bg-white/95 hover:bg-white backdrop-blur-md px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-white/90 hover:border-orange-300 shadow-md hover:shadow-lg transition-all duration-200 items-center gap-3 text-stone-800 z-20 cursor-pointer group active:scale-95 text-left"
          title="Open Virasat AI"
        >
          {/* AI Logo Icon */}
          <div className="relative">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#FF671F] to-[#046A38] p-0.5 shadow-xs flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#FF671F]" />
              </div>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
          </div>

          {/* AI Assistant Label & Action */}
          <div className="leading-tight pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#0B192C] tracking-tight group-hover:text-[#FF671F] transition-colors flex items-center gap-1">
                Virasat AI <Sparkles className="w-3.5 h-3.5 text-[#FF671F]" />
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
                    Use your device location to discover verified heritage places and real travel distances around you.
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
                { name: 'Kharghar / Panvel', region: 'Navi Mumbai & Raigad', lat: 19.033, lng: 73.064 },
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
                { name: 'Kharghar / Panvel (Navi Mumbai)', lat: 19.033, lng: 73.064 },
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
          const counts = {
            all: nearbyPlaces.length,
            tourist: nearbyPlaces.filter((p) => p.category === 'tourist' || (!['market', 'hotel', 'library', 'station'].includes(p.category))).length,
            market: nearbyPlaces.filter((p) => p.category === 'market').length,
            hotel: nearbyPlaces.filter((p) => p.category === 'hotel').length,
            library: nearbyPlaces.filter((p) => p.category === 'library').length,
            station: nearbyPlaces.filter((p) => p.category === 'station').length,
          };

          const filteredNearbyPlaces = nearbyPlaces.filter((p) => {
            if (nearbyCategoryTab === 'all') return true;
            if (nearbyCategoryTab === 'tourist') {
              return p.category === 'tourist' || (!['market', 'hotel', 'library', 'station'].includes(p.category));
            }
            return p.category === nearbyCategoryTab;
          });

          const categoryPills: Record<string, { label: string; bg: string; text: string }> = {
            tourist: { label: 'Tourist Place', bg: 'bg-emerald-600', text: 'text-white' },
            market: { label: 'Market', bg: 'bg-amber-600', text: 'text-white' },
            hotel: { label: 'Hotel', bg: 'bg-blue-600', text: 'text-white' },
            library: { label: 'Library', bg: 'bg-teal-600', text: 'text-white' },
            station: { label: 'Station', bg: 'bg-rose-600', text: 'text-white' },
          };

          return (
            <div className="space-y-4">
              {/* Category Filter Tabs Bar */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
                  {[
                    { id: 'all', label: 'All', icon: Compass, count: counts.all },
                    { id: 'tourist', label: 'Tourist Places', icon: Landmark, count: counts.tourist },
                    { id: 'market', label: 'Markets', icon: Store, count: counts.market },
                    { id: 'hotel', label: 'Hotels', icon: Building2, count: counts.hotel },
                    { id: 'library', label: 'Libraries', icon: BookOpen, count: counts.library },
                    { id: 'station', label: 'Stations', icon: Train, count: counts.station },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = nearbyCategoryTab === tab.id;
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
                          {tab.count}
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
                  No places found in this category within {nearbyRadius} km. Try choosing &quot;All&quot; or expanding the radius above.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                  {filteredNearbyPlaces.map((p) => {
                    const pill = categoryPills[p.category] || categoryPills.tourist;
                    return (
                      <div
                        key={p.id}
                        onClick={() => onSelectPlace && onSelectPlace(p.id)}
                        className="group cursor-pointer rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                      >
                        {/* Image banner with category badge & distance */}
                        <div className="h-32 w-full overflow-hidden bg-stone-100 relative">
                          <img
                            src={getMonumentRealImage(p.id, p.thumbnail_url || p.image_url)}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const fallback = getMonumentRealImage(p.id, p.image_url);
                              if (target.src !== fallback) {
                                target.src = fallback;
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

                          {/* Category Badge top-left */}
                          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md ${pill.bg} ${pill.text} text-[10px] font-bold shadow-xs flex items-center gap-1`}>
                            {p.category === 'market' && <Store className="w-2.5 h-2.5" />}
                            {p.category === 'hotel' && <Building2 className="w-2.5 h-2.5" />}
                            {p.category === 'library' && <BookOpen className="w-2.5 h-2.5" />}
                            {p.category === 'station' && <Train className="w-2.5 h-2.5" />}
                            {p.category === 'tourist' && <Landmark className="w-2.5 h-2.5" />}
                            <span>{pill.label}</span>
                          </span>

                          {/* Rating badge top-right */}
                          {p.rating && (
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white/90 text-stone-900 text-[10px] font-bold shadow-xs flex items-center gap-0.5 backdrop-blur-xs">
                              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              <span>{p.rating}</span>
                            </span>
                          )}

                          {/* Distance badge bottom-left */}
                          {p.distance_km !== undefined && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#046A38] text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                              <Navigation className="w-2.5 h-2.5" />
                              <span>{p.distance_km} km away</span>
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800 line-clamp-1">
                              {p.categoryLabel || p.category}
                            </div>
                            <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition line-clamp-1 mt-0.5">
                              {p.name}
                            </h4>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[11px] text-stone-500 line-clamp-1">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{p.area || p.city}, {p.state}</span>
                            </div>
                            {p.summary && (
                              <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">
                                {p.summary}
                              </p>
                            )}
                          </div>
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

          {/* Right: Stacked 2 Cards ("Explore on Map" & "Hidden Gems") */}
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

            {/* Card 2: Hidden Gems */}
            <ScrollReveal animation="fade-left" delay={200} className="flex-1 flex">
              <div
                onClick={() => onNavigateTab('heritage')}
                className="rounded-2xl overflow-hidden relative p-4 sm:p-5 shadow-2xs hover:shadow-md transition flex flex-col justify-end min-h-[135px] sm:min-h-[145px] text-white cursor-pointer group flex-1 w-full"
              >
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80"
                  alt="Majestic Mountain Ridge"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight">
                    Hidden Gems
                  </h3>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    Offbeat destinations beyond the ordinary.
                  </p>
                  <button
                    type="button"
                    className="bg-[#FF671F] hover:bg-[#E65100] text-white px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition active:scale-95 self-start mt-2 cursor-pointer"
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
        <section className="rounded-2xl sm:rounded-3xl bg-white border border-[#EFE8DF] overflow-hidden shadow-2xs p-4 sm:p-8 relative">
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
