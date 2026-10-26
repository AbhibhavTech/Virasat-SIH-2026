import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { FestivalItem } from '../types';
import {
  Sparkles,
  Calendar,
  MapPin,
  Search,
  Bot,
  Hotel,
  Landmark,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Clock,
  X,
  Filter,
  Flame,
  Info,
  Layers,
  AlertCircle,
  RefreshCw,
  Flag,
  Share2,
  Compass,
  ChevronLeft,
} from 'lucide-react';

const calendarDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseFestivalDate = (value?: string | null) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const FESTIVAL_HERO_SLIDES = [
  {
    src: '/images/durga-puja.jpg',
    label: 'Durga Puja',
    alt: 'Durga Puja pandal celebration and Dhunuchi dance in Kolkata',
    sourceHref: 'https://ich.unesco.org/en/RL/durga-puja-in-kolkata-00703',
  },
  {
    src: '/images/mahashivaratri.jpg',
    label: 'Mahashivaratri',
    alt: 'Mahashivaratri sacred celebration with Mahakaleshwar Jyotirlinga, Varanasi Ganga Aarti, Somnath, and temple gopuram',
    sourceHref: 'https://himachaltourism.gov.in/',
  },
  {
    src: '/images/holi.jpg',
    label: 'Holi',
    alt: 'Holi festival of colors with rainbow gulal in the air',
    sourceHref: 'https://uptourism.gov.in/',
  },
  {
    src: '/images/diwali.png',
    label: 'Diwali',
    alt: 'Diwali festival of lights with earthen diyas and floral rangoli',
    sourceHref: 'https://uptourism.gov.in/',
  },
  {
    src: '/images/bihar-chhath-puja.jpg',
    label: 'Chhath Puja',
    alt: 'Devotees offering prayers and traditional offerings during Chhath Puja',
  },
  {
    src: '/images/tamil-nadu-pongal.jpg',
    label: 'Pongal',
    alt: 'Pongal harvest celebration with decorated pots and a colourful kolam',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/The_61_Cavalry_contingent_passes_through_the_Rajpath_during_the_62nd_Republic_Day_Parade-2011%2C_in_New_Delhi_on_January_26%2C_2011.jpg',
    label: 'Republic Day',
    alt: 'Republic Day celebration in India',
    sourceHref: 'https://commons.wikimedia.org/wiki/File:The_61_Cavalry_contingent_passes_through_the_Rajpath_during_the_62nd_Republic_Day_Parade-2011,_in_New_Delhi_on_January_26,_2011.jpg',
  },
];

const LEGACY_GENERIC_FESTIVAL_IMAGE =
  'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&auto=format&fit=crop&q=80';

const hasVerifiedFestivalImage = (festival: FestivalItem) => Boolean(
  festival.image_url &&
  festival.image_url !== LEGACY_GENERIC_FESTIVAL_IMAGE &&
  festival.verification_status === 'verified' &&
  festival.source_url
);

export const FESTIVAL_CATEGORIES = [
  'All',
  'National Festivals',
  'Major Harvest Festivals (State-Wise)',
  'Major Cultural & Religious Festivals',
  'Notable State-Specific & Tribal Festivals',
] as const;

interface FestivalsPageProps {
  onSelectPlace?: (placeId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const FestivalsPage: React.FC<FestivalsPageProps> = ({
  onSelectPlace,
  onNavigateTab,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [currentFestivals, setCurrentFestivals] = useState<FestivalItem[]>([]);
  const [upcomingFestivals, setUpcomingFestivals] = useState<FestivalItem[]>([]);
  const [allStates, setAllStates] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Pagination / Display limit
  const [visibleCount, setVisibleCount] = useState<number>(60);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('month') || 'All');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'current' | 'upcoming'>('all');
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [systemToday, setSystemToday] = useState(() => new Date());
  const [calendarCursor, setCalendarCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(() => calendarDateKey(new Date()));

  // Detail Modal State
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);

  const months = [
    'All',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const fetchData = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const [festivalsRes, currentUpcomingRes, statesRes, citiesRes] = await Promise.allSettled([
        api.getFestivals({ limit: 400 }),
        api.getCurrentUpcomingFestivals(calendarDateKey(new Date())),
        api.getStates(),
        api.getCities(),
      ]);

      if (festivalsRes.status === 'fulfilled' && festivalsRes.value) {
        setFestivals(festivalsRes.value);
      } else {
        setApiError('Unable to connect to the festival registry. Please retry.');
      }

      if (currentUpcomingRes.status === 'fulfilled' && currentUpcomingRes.value) {
        setCurrentFestivals(currentUpcomingRes.value.current || []);
        setUpcomingFestivals(currentUpcomingRes.value.upcoming || []);
      }

      if (statesRes.status === 'fulfilled' && Array.isArray(statesRes.value)) {
        const statesList = Array.from(new Set(statesRes.value.map((s: any) => s.name || s.id))).sort();
        setAllStates(statesList);
      }

      if (citiesRes.status === 'fulfilled' && Array.isArray(citiesRes.value)) {
        const citiesList = Array.from(new Set(citiesRes.value.map((c: any) => c.name))).sort();
        setAllCities(citiesList);
      }
    } catch (err: any) {
      console.error('Failed to load festivals data:', err);
      setApiError(err?.message || 'Failed to load festivals from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let midnightTimer: number;
    const scheduleDailyRefresh = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
      midnightTimer = window.setTimeout(() => {
        const freshToday = new Date();
        setSystemToday(freshToday);
        setCalendarCursor(new Date(freshToday.getFullYear(), freshToday.getMonth(), 1));
        setSelectedCalendarDate(calendarDateKey(freshToday));
        fetchData();
        scheduleDailyRefresh();
      }, nextDay.getTime() - now.getTime());
    };
    scheduleDailyRefresh();
    return () => window.clearTimeout(midnightTimer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlideIndex((current) => (current + 1) % FESTIVAL_HERO_SLIDES.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);



  // Update query params when filters change & reset pagination
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedState !== 'All') params.state = selectedState;
    if (selectedCity !== 'All') params.city = selectedCity;
    if (selectedMonth !== 'All') params.month = selectedMonth;
    setSearchParams(params, { replace: true });
    setVisibleCount(60);
  }, [searchQuery, selectedCategory, selectedState, selectedCity, selectedMonth, activeFilterTab, setSearchParams]);

  const FESTIVAL_SEARCH_ALIASES: Record<string, string[]> = {
    independence: ['independence day', '15 august', 'swatantrata diwas'],
    republic: ['republic day', '26 january', 'gantantra diwas'],
    gandhi: ['gandhi jayanti', '2 october', 'mahatma gandhi'],
    makar: ['makar sankranti', 'uttarayan', 'sankranti'],
    uttarayan: ['makar sankranti', 'kite festival'],
    sankranti: ['makar sankranti', 'uttarayan'],
    pongal: ['thai pongal', 'jallikattu', 'mattu pongal'],
    onam: ['thiruvonam', 'vallam kali', 'pookkalam'],
    baisakhi: ['vaisakhi', 'khalsa sirjana'],
    vaisakhi: ['baisakhi'],
    bihu: ['bhogali bihu', 'magh bihu', 'bohag bihu', 'meji'],
    bhogali: ['bhogali bihu', 'magh bihu'],
    magh: ['bhogali bihu', 'magh bihu'],
    lohri: ['lohri', 'dulla bhatti'],
    nuakhai: ['nuakhai', 'nabanna', 'samaleswari'],
    nabanna: ['nabanna', 'nuakhai', 'aman paddy'],
    gudi: ['gudi padwa', 'ugadi', 'marathi new year'],
    padwa: ['gudi padwa'],
    ugadi: ['ugadi', 'gudi padwa', 'telugu new year', 'kannada new year'],
    wangala: ['wangala', '100 drums festival', 'garo'],
    vishu: ['vishukkani', 'kerala new year', 'medam'],
    diwali: ['deepawali', 'deepavali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    deepawali: ['diwali', 'deepavali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    deepavali: ['diwali', 'deepawali', 'deepotsav', 'dev deepawali', 'ayodhya deepotsav'],
    holi: ['lathmar holi', 'braj holi', 'rangwali holi', 'barsana', 'gulal'],
    navratri: ['navaratri', 'durga puja', 'garba', 'dandiya'],
    navaratri: ['navratri', 'durga puja', 'garba'],
    durga: ['durga puja', 'navratri', 'kolkata durga puja', 'dhunuchi'],
    ganesh: ['ganesh chaturthi', 'ganeshotsav', 'lalbaugcha raja', 'vinayaka chaturthi'],
    chaturthi: ['ganesh chaturthi', 'ganeshotsav'],
    eid: ['eid ul fitr', 'eid al adha', 'bakrid', 'eid-ul-fitr', 'eid-ul-adha'],
    christmas: ['xmas', 'bada din', 'nativity'],
    shivratri: ['mahashivaratri', 'maha shivratri', 'mandi shivaratri'],
    mahashivaratri: ['shivratri', 'maha shivratri', 'mandi shivaratri'],
    chath: ['chhath puja', 'chhath', 'surya shashthi'],
    chhath: ['chhath puja', 'surya shashthi', 'dala chhath'],
    brahmotsavam: ['tirupati brahmotsavam', 'garuda seva', 'tirumala'],
    losar: ['tibetan new year', 'monpa losar'],
    dree: ['dree festival', 'apatani', 'ziro'],
    bastar: ['bastar dussehra', 'danteshwari'],
    shigmo: ['shigmo mela', 'shigmotsav', 'goa spring festival'],
    bahu: ['bahu mela', 'bave wali mata', 'jammu fort'],
    karam: ['karam festival', 'karma puja'],
    sarhul: ['sarhul', 'sal blossom', 'sarna'],
    yaoshang: ['yaoshang festival', 'manipur spring', 'thabal chongba'],
    chapchar: ['chapchar kut', 'cheraw', 'mizoram'],
    hornbill: ['hornbill festival', 'kisama', 'naga'],
    rath: ['rath yatra', 'puri rath yatra', 'jagannath'],
    gangaur: ['gangaur', 'gauri puja'],
    bonalu: ['bonalu', 'mahakali', 'golconda'],
    kharchi: ['kharchi puja', 'fourteen gods', 'chaturdash devata'],
    hemis: ['hemis festival', 'cham dance', 'ladakh'],
    ladakh: ['ladakh harvest festival', 'hemis festival'],
  };

  // Base list filtered by search, state, city, month
  const baseFilteredFestivals = useMemo(() => {
    let list = festivals;

    if (searchQuery.trim()) {
      const rawQ = searchQuery.trim();
      const q = rawQ.toLowerCase();
      const aliasTerms = FESTIVAL_SEARCH_ALIASES[q] || [];
      const wordPattern =
        q.length <= 4
          ? new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
          : new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');

      list = list.filter((item) => {
        const nameLower = item.name.toLowerCase();
        const idLower = item.id.toLowerCase();
        const slugLower = (item.slug || '').toLowerCase();

        // 1. Direct match on name, slug, id
        if (nameLower.includes(q) || idLower.includes(q) || slugLower.includes(q)) {
          return true;
        }
        if (q.includes(nameLower) || (slugLower && q.includes(slugLower)) || q.includes(idLower)) {
          return true;
        }

        // Multi-word festival name match
        const nameWords = nameLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2);
        if (nameWords.length >= 2 && nameWords.every((w) => q.includes(w))) {
          return true;
        }

        // 2. Direct match on city, state, alternate locations
        if (item.primary_city.toLowerCase().includes(q)) return true;
        if (item.state.toLowerCase().includes(q)) return true;
        if (item.alternate_locations && item.alternate_locations.some((loc) => loc.toLowerCase().includes(q))) return true;
        if (Array.isArray(item.states) && item.states.some((s) => s.toLowerCase().includes(q))) return true;

        // 3. Cultural vibe or category match
        if (item.cultural_vibe && item.cultural_vibe.toLowerCase().includes(q)) return true;
        if (item.religion_or_category && item.religion_or_category.toLowerCase().includes(q)) return true;

        // 4. Aliases match
        if (Array.isArray(item.aliases)) {
          for (const a of item.aliases) {
            const aLower = a.toLowerCase();
            if (aLower.includes(q) || (aLower.length >= 4 && q.includes(aLower))) return true;
          }
        }
        for (const term of aliasTerms) {
          if (nameLower.includes(term) || idLower.includes(term) || (slugLower && slugLower.includes(term))) return true;
          if (Array.isArray(item.aliases) && item.aliases.some((a) => a.toLowerCase().includes(term))) return true;
        }

        // 5. Description word-boundary match
        const isMajorTerm = ['holi', 'diwali', 'navratri', 'dasara', 'dussehra'].includes(q);
        if (!isMajorTerm && wordPattern.test(item.description)) {
          return true;
        }

        return false;
      });

      // Relevance ranking
      list.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aDirect = aName === q || q.includes(aName) || aName.includes(q);
        const bDirect = bName === q || q.includes(bName) || bName.includes(q);
        if (aDirect && !bDirect) return -1;
        if (!aDirect && bDirect) return 1;

        const qWords = q.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2);
        const aScore = qWords.filter((w) => aName.includes(w) || a.primary_city.toLowerCase().includes(w)).length;
        const bScore = qWords.filter((w) => bName.includes(w) || b.primary_city.toLowerCase().includes(w)).length;
        if (aScore !== bScore) return bScore - aScore;

        return a.name.localeCompare(b.name);
      });
    }

    if (selectedState !== 'All') {
      const s = selectedState.toLowerCase();
      list = list.filter((f) => {
        const matchesPrimary = f.state.toLowerCase() === s || f.state_id?.toLowerCase() === s;
        const matchesStatesList = Array.isArray(f.states) && f.states.some((st) => st.toLowerCase() === s);
        return matchesPrimary || matchesStatesList;
      });
    }

    if (selectedCity !== 'All') {
      const c = selectedCity.toLowerCase();
      list = list.filter(
        (f) =>
          f.primary_city.toLowerCase().includes(c) ||
          f.primary_city_id?.toLowerCase() === c ||
          (f.alternate_locations && f.alternate_locations.some((loc) => loc.toLowerCase().includes(c)))
      );
    }

    if (selectedMonth !== 'All') {
      const m = selectedMonth.toLowerCase();
      list = list.filter((f) => {
        const tm = (f.typical_month || '').toLowerCase();
        const ts = (f.typical_season || '').toLowerCase();
        const start = f.exact_date_start || '';
        return tm.includes(m) || ts.includes(m) || start.includes(`-${m}-`);
      });
    }

    if (selectedCategory !== 'All') {
      list = list.filter((f) => f.category === selectedCategory || f.religious_or_cultural_category === selectedCategory);
    }

    return list;
  }, [festivals, searchQuery, selectedCategory, selectedState, selectedCity, selectedMonth]);

  const calendarMonthLabel = useMemo(
    () => calendarCursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    [calendarCursor]
  );

  const calendarDays = useMemo(() => {
    const year = calendarCursor.getFullYear();
    const month = calendarCursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(year, month, 1 - mondayOffset);
    const eventsByDate = new Map<string, FestivalItem[]>();

    for (const festival of baseFilteredFestivals) {
      const start = parseFestivalDate(festival.exact_date_start || festival.start_date);
      if (!start) continue;
      const declaredEnd = parseFestivalDate(festival.exact_date_end || festival.end_date);
      const end = declaredEnd && declaredEnd >= start ? declaredEnd : start;
      const cursor = new Date(start);
      let guard = 0;
      while (cursor <= end && guard < 45) {
        if (cursor.getFullYear() === year && cursor.getMonth() === month) {
          const key = calendarDateKey(cursor);
          const list = eventsByDate.get(key) || [];
          list.push(festival);
          eventsByDate.set(key, list);
        }
        cursor.setDate(cursor.getDate() + 1);
        guard++;
      }
    }

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const key = calendarDateKey(date);
      return { date, key, inMonth: date.getMonth() === month, events: eventsByDate.get(key) || [] };
    });
  }, [baseFilteredFestivals, calendarCursor]);

  const selectedDayFestivals = useMemo(
    () => calendarDays.find((day) => day.key === selectedCalendarDate)?.events || [],
    [calendarDays, selectedCalendarDate]
  );

  const datedFestivalsInMonth = useMemo(() => {
    const unique = new Map<string, FestivalItem>();
    calendarDays.forEach((day) => {
      if (day.inMonth) day.events.forEach((festival) => unique.set(festival.id, festival));
    });
    return Array.from(unique.values()).sort((a, b) =>
      String(a.exact_date_start || a.start_date || '').localeCompare(String(b.exact_date_start || b.start_date || ''))
    );
  }, [calendarDays]);

  const moveCalendarMonth = (offset: number) => {
    setCalendarCursor((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedCalendarDate(null);
  };

  const showCurrentMonth = () => {
    setCalendarCursor(new Date(systemToday.getFullYear(), systemToday.getMonth(), 1));
    setSelectedCalendarDate(calendarDateKey(systemToday));
  };

  // Tab counts
  const currentIds = useMemo(() => new Set(currentFestivals.map((f) => f.id)), [currentFestivals]);
  const upcomingIds = useMemo(() => new Set(upcomingFestivals.map((f) => f.id)), [upcomingFestivals]);

  const currentMatchingCount = useMemo(() => {
    return baseFilteredFestivals.filter((f) => currentIds.has(f.id)).length;
  }, [baseFilteredFestivals, currentIds]);

  const upcomingMatchingCount = useMemo(() => {
    return baseFilteredFestivals.filter((f) => upcomingIds.has(f.id)).length;
  }, [baseFilteredFestivals, upcomingIds]);

  // Filtered festival list respecting active calendar tab
  const filteredFestivals = useMemo(() => {
    if (activeFilterTab === 'current') {
      return baseFilteredFestivals.filter((f) => currentIds.has(f.id));
    }
    if (activeFilterTab === 'upcoming') {
      return baseFilteredFestivals.filter((f) => upcomingIds.has(f.id));
    }
    return baseFilteredFestivals;
  }, [baseFilteredFestivals, activeFilterTab, currentIds, upcomingIds]);

  const sortedFestivalDirectory = useMemo(
    () => [...filteredFestivals].sort((a, b) => a.name.localeCompare(b.name, 'en-IN')),
    [filteredFestivals]
  );

  // Partition festivals into the 4 curated categories
  const nationalFestivals = useMemo(() => {
    return sortedFestivalDirectory.filter((f) => f.category === 'National Festivals');
  }, [sortedFestivalDirectory]);

  const harvestFestivals = useMemo(() => {
    return sortedFestivalDirectory.filter((f) => f.category === 'Major Harvest Festivals (State-Wise)');
  }, [sortedFestivalDirectory]);

  const culturalReligiousFestivals = useMemo(() => {
    return sortedFestivalDirectory.filter((f) => f.category === 'Major Cultural & Religious Festivals');
  }, [sortedFestivalDirectory]);

  const tribalRegionalFestivals = useMemo(() => {
    return sortedFestivalDirectory.filter((f) => f.category === 'Notable State-Specific & Tribal Festivals');
  }, [sortedFestivalDirectory]);

  const isFilteringActive = Boolean(
    searchQuery.trim() ||
    selectedCategory !== 'All' ||
    selectedState !== 'All' ||
    selectedCity !== 'All' ||
    selectedMonth !== 'All' ||
    activeFilterTab !== 'all'
  );

  // Actions
  const handleShowOnMap = (festival: FestivalItem) => {
    const lat = festival.lat;
    const lng = festival.lng;
    const query = festival.name;
    if (lat && lng) {
      navigate(`/map?q=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}`);
    } else {
      navigate(`/map?q=${encodeURIComponent(query)}`);
    }
  };

  const handleAddToItinerary = (festival: FestivalItem) => {
    navigate(`/itinerary?destination=${encodeURIComponent(festival.primary_city)}&festival=${encodeURIComponent(festival.name)}`);
  };

  const handleAskAI = (festival: FestivalItem) => {
    navigate(`/ai?q=${encodeURIComponent(`Tell me about ${festival.name} in ${festival.primary_city}, ${festival.state}. What are the key rituals, best places to see, and visitor advice?`)}`);
  };

  const handleExploreCity = (cityId?: string, cityName?: string) => {
    const target = cityId || (cityName ? cityName.toLowerCase().replace(/\s+/g, '-') : 'mumbai');
    navigate(`/city/${target}`);
  };

  // The registry contains a legacy generic stock photo reused by unrelated
  // festivals. Show images only for records marked verified with a source.
  const renderCardMedia = (fest: FestivalItem) => {
    const hasImage = hasVerifiedFestivalImage(fest);

    if (hasImage) {
      return (
        <div className="relative h-56 sm:h-64 lg:h-72 shrink-0 overflow-hidden bg-neutral-900">
          <img
            src={fest.image_url}
            alt={fest.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
          {renderCardOverlayBadges(fest)}
        </div>
      );
    }

    // A clean identity panel is better than an unrelated stock photograph.
    return (
      <div className="relative h-56 sm:h-64 lg:h-72 shrink-0 overflow-hidden bg-gradient-to-br from-[#241A14] via-[#35251C] to-[#1C1510] p-5 flex flex-col justify-between text-white group-hover:brightness-105 transition-all">
        <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#E06D24]/15 blur-2xl pointer-events-none" />
        {renderCardOverlayBadges(fest)}

        {/* Title overlay in placeholder */}
        <div className="mt-auto pt-6 z-10">
          <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{fest.state || 'All India'}</span>
            {fest.region && (
              <>
                <span className="text-white/40">•</span>
                <span className="text-amber-200/90 text-[11px] shrink-0">{fest.region} India</span>
              </>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-black text-white drop-shadow-sm leading-snug line-clamp-2">
            {fest.name}
          </h3>
        </div>
      </div>
    );
  };

  const renderCardOverlayBadges = (fest: FestivalItem) => {
    const isVerifiedDate = fest.is_date_verified && fest.exact_date_start;
    const hasImage = hasVerifiedFestivalImage(fest);

    return (
      <>
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap max-w-[70%]">
            <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{fest.state}</span>
            </span>

            {fest.region && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 text-[11px] font-semibold border border-amber-400/30">
                {fest.region}
              </span>
            )}
          </div>

          {isVerifiedDate ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-sm shrink-0">
              <ShieldCheck className="w-3 h-3" /> Verified Date
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 shadow-sm shrink-0">
              <Clock className="w-3 h-3" /> Expected
            </span>
          )}
        </div>

        {/* Bottom overlay for image cards */}
        {hasImage && (
          <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none z-10">
            <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{fest.primary_city}</span>
              {fest.alternate_locations && fest.alternate_locations.length > 0 && (
                <span className="text-white/70 text-[11px] shrink-0"> &amp; more</span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white drop-shadow-sm leading-snug line-clamp-2">
              {fest.name}
            </h3>
          </div>
        )}
      </>
    );
  };

  const renderFestivalCard = (fest: FestivalItem, isAllIndia = false) => {
    const isVerifiedDate = fest.is_date_verified && fest.exact_date_start;

    return (
      <article
        key={fest.id}
        onClick={() => setSelectedFestival(fest)}
        className="bg-white rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer h-full"
      >
        {renderCardMedia(fest)}

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Cultural Vibe & Tradition pills */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {fest.religion_or_category && (
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                  {fest.religion_or_category}
                </span>
              )}

              {fest.cultural_vibe && (
                <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-200/60 text-[#D45B10] text-xs font-semibold truncate max-w-[200px]">
                  {fest.cultural_vibe}
                </span>
              )}

              {isAllIndia && (
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  Pan-India Celebration
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-neutral-700 line-clamp-3 mb-4 leading-relaxed font-normal">
              {fest.description}
            </p>

            {/* Date Indicator */}
            <div className="bg-[#FAF7F2] rounded-xl p-3.5 sm:p-4 border border-[#EFE8DF] mb-4 text-xs sm:text-sm">
              <div className="font-semibold text-neutral-800 flex items-center gap-1.5 mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#E06D24] shrink-0" />
                {isVerifiedDate ? (
                  <span>
                    {fest.exact_date_start} — {fest.exact_date_end}
                  </span>
                ) : (
                  <span>Typical Period: {fest.typical_season || 'Annual Observance'}</span>
                )}
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500">
                {isVerifiedDate
                  ? 'Synchronized 2026 festival schedule'
                  : 'Traditional annual timing estimate; verify local panchanga'}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-3 border-t border-[#EFE8DF] flex items-center justify-between gap-2 mt-auto">
            <span className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-[#E06D24] transition-colors flex items-center gap-1">
              View Details <ChevronRight className="w-4 h-4" />
            </span>

            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                title="Show festival location on Map"
                onClick={() => handleShowOnMap(fest)}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                title="Add to Itinerary"
                onClick={() => handleAddToItinerary(fest)}
                className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#D45B10] transition-colors"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                title="Ask AI Assistant about festival"
                onClick={() => handleAskAI(fest)}
                className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
              >
                <Bot className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-[#2C241E] pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFDF8] via-[#FFF8EE] to-[#F2FAF5] pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#EADFD3]">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="max-w-[1720px] mx-auto relative z-10 grid lg:grid-cols-[minmax(0,0.92fr)_minmax(460px,1.08fr)] items-center gap-8 lg:gap-12">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-[#31251E] tracking-tight mb-4 leading-[1.04]">
              India&apos;s Cultural <span className="text-[#D96520]">Calendar</span>
            </h1>
            <p className="text-base sm:text-lg text-[#695B51] max-w-2xl leading-relaxed mb-7">
              Explore every celebration across India, with verified dates, regional traditions and a calendar that follows your system date.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                document.getElementById('festival-filter-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white p-2 rounded-2xl shadow-[0_16px_45px_rgba(91,61,38,0.12)] flex flex-col sm:flex-row items-center gap-2 border border-[#EADFD3]"
            >
              <div className="flex items-center gap-3 px-3 flex-1 w-full text-neutral-800">
                <Search className="w-5 h-5 text-[#B27A56] shrink-0" />
                <input
                  id="festival-search-input"
                  type="text"
                  placeholder="Search festivals across India..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-neutral-900 placeholder-neutral-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#D96520] hover:bg-[#B94E12] text-white text-sm font-semibold rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Explore Festivals
              </button>
            </form>
          </div>

          <div className="relative">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[30px] border-[6px] border-white shadow-[0_26px_70px_rgba(79,51,31,0.18)] bg-[#F5EDE3]">
              {FESTIVAL_HERO_SLIDES.map((slide, index) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${
                    index === heroSlideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2" aria-label="Festival slideshow navigation">
                {FESTIVAL_HERO_SLIDES.map((slide, index) => (
                  <button
                    key={slide.alt}
                    type="button"
                    onClick={() => setHeroSlideIndex(index)}
                    aria-label={`Show ${slide.label} slide`}
                    className={`h-2 rounded-full transition-all ${index === heroSlideIndex ? 'w-7 bg-white' : 'w-2 bg-white/65 hover:bg-white'}`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-3xl border border-orange-200 bg-orange-100/70 -z-10" />
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full border border-emerald-200 bg-emerald-100/70 -z-10" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 -mt-8 relative z-20">
        {/* Current & Upcoming Section Highlight */}
        <section id="festival-filter-section" className="bg-white rounded-[28px] p-5 sm:p-8 shadow-[0_24px_70px_rgba(57,39,26,0.10)] border border-[#E9E0D6] mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#E06D24] text-xs font-bold uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                Explore every celebration
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2C241E]">
                All Festivals &amp; Daily Calendar
              </h2>
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE8DF] text-xs font-semibold">
              <button
                onClick={() => setActiveFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilterTab === 'all'
                    ? 'bg-[#2C241E] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All ({baseFilteredFestivals.length})
              </button>
              <button
                onClick={() => setActiveFilterTab('current')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeFilterTab === 'current'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 hover:text-emerald-800'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Now ({currentMatchingCount})
              </button>
              <button
                onClick={() => setActiveFilterTab('upcoming')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilterTab === 'upcoming'
                    ? 'bg-[#E06D24] text-white shadow-sm'
                    : 'text-[#E06D24] hover:text-orange-700'
                }`}
              >
                Upcoming ({upcomingMatchingCount})
              </button>
            </div>
          </div>

          {/* Formal month calendar and agenda */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_340px] items-start gap-5 mb-7">
            <div className="md:order-2 rounded-2xl border border-[#E7DED4] bg-[#FCFAF7] overflow-hidden shadow-sm">
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E7DED4] bg-white">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A4C1C] mb-1">Monthly calendar</div>
                  <h3 className="font-serif text-lg font-bold text-[#2C241E]">{calendarMonthLabel}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveCalendarMonth(-1)}
                    aria-label="Previous month"
                    className="w-9 h-9 rounded-lg border border-[#DED4C8] bg-white text-neutral-700 hover:border-[#C65E1B] hover:text-[#C65E1B] transition-colors flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={showCurrentMonth}
                    className="h-9 px-3 rounded-lg border border-[#DED4C8] bg-white text-xs font-semibold text-neutral-700 hover:border-[#C65E1B] hover:text-[#C65E1B] transition-colors"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCalendarMonth(1)}
                    aria-label="Next month"
                    className="w-9 h-9 rounded-lg border border-[#DED4C8] bg-white text-neutral-700 hover:border-[#C65E1B] hover:text-[#C65E1B] transition-colors flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-7 mb-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="py-2 text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-[#E7DED4] border border-[#E7DED4] rounded-xl overflow-hidden">
                  {calendarDays.map((day) => {
                    const isToday = day.key === calendarDateKey(systemToday);
                    const isSelected = day.key === selectedCalendarDate;
                    return (
                      <button
                        type="button"
                        key={day.key}
                        onClick={() => setSelectedCalendarDate(day.key)}
                        className={`relative min-h-[46px] p-1.5 text-left transition-colors ${
                          day.inMonth ? 'bg-white hover:bg-orange-50/60' : 'bg-[#F6F2ED] text-neutral-400'
                        } ${isSelected ? 'ring-2 ring-inset ring-[#D96520] z-10' : ''}`}
                      >
                        <span className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold ${
                          isToday ? 'bg-[#2C241E] text-white' : day.inMonth ? 'text-neutral-800' : 'text-neutral-400'
                        }`}>
                          {day.date.getDate()}
                        </span>
                        {day.events.length > 0 && (
                          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 inline-flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-[#F8D8C2] text-[8px] font-bold text-[#9A4C1C]">
                            {day.events.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="md:order-1 rounded-2xl border border-[#E7DED4] bg-gradient-to-br from-white to-[#FFFBF6] p-5 flex flex-col min-h-[360px]">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#EEE7DF]">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A4C1C] mb-1">Default view</div>
                  <h3 className="font-serif text-xl font-bold text-[#2C241E]">All Festivals Across India</h3>
                  <p className="text-xs text-neutral-500 mt-1">The calendar is a daily guide. It does not limit the complete festival collection shown below.</p>
                </div>
                <Calendar className="w-5 h-5 text-[#D96520] shrink-0" />
              </div>

              <div className="py-4 space-y-3 flex-1">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F7EFE7] px-3 py-2.5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#9A4C1C]">Calendar preview</div>
                    <div className="text-sm font-semibold text-[#392C24]">
                      {selectedCalendarDate
                        ? new Date(`${selectedCalendarDate}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
                        : calendarMonthLabel}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#D96520]">{selectedCalendarDate ? selectedDayFestivals.length : datedFestivalsInMonth.length} events</span>
                </div>
                {(selectedCalendarDate ? selectedDayFestivals : datedFestivalsInMonth.slice(0, 6)).length > 0 ? (
                  (selectedCalendarDate ? selectedDayFestivals : datedFestivalsInMonth.slice(0, 6)).map((festival) => (
                    <button
                      type="button"
                      key={festival.id}
                      onClick={() => setSelectedFestival(festival)}
                      className="w-full text-left p-3 rounded-xl border border-[#EEE7DF] hover:border-[#D96520]/50 hover:bg-[#FFF9F4] transition-colors group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B25218]">
                          {festival.exact_date_start || festival.start_date || festival.typical_month || 'Annual'}
                        </span>
                        {festival.is_date_verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="font-serif font-bold text-sm text-neutral-900 group-hover:text-[#9A4C1C] transition-colors line-clamp-1">
                        {festival.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {festival.primary_city}, {festival.state}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center px-5">
                    <div className="w-11 h-11 rounded-full bg-[#F6F1EB] flex items-center justify-center mb-3">
                      <Calendar className="w-5 h-5 text-[#9A6E50]" />
                    </div>
                    <div className="font-semibold text-sm text-neutral-800">No verified dates on this day</div>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">Select another date or browse the traditional seasonal listings below.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#EEE7DF] flex items-center justify-between text-[11px] text-neutral-500">
                <span>{datedFestivalsInMonth.length} festivals with calendar dates</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified records</span>
              </div>
            </aside>
          </div>

          {/* Current Festivals Spotlight Banner */}
          {currentFestivals.length > 0 && activeFilterTab === 'current' && (
            <div className="mb-6 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-amber-50/40 border border-emerald-200/80 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Live Currently in India
                </span>
                <span className="text-xs text-emerald-800 font-medium">
                  Active period checked for {systemToday.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentFestivals.map((fest) => (
                  <div
                    key={fest.id}
                    className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm flex gap-4 items-center hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedFestival(fest)}
                  >
                    {hasVerifiedFestivalImage(fest) ? (
                      <img
                        src={fest.image_url}
                        alt={fest.name}
                        className="w-20 h-20 rounded-lg object-cover shrink-0 border border-neutral-100"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-[#2C241E] flex flex-col items-center justify-center text-amber-400 p-2 text-center shrink-0">
                        <Sparkles className="w-5 h-5 mb-1" />
                        <span className="text-[10px] leading-tight text-white/90 font-medium line-clamp-1">{fest.state}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {fest.state}
                        </span>
                        {fest.region && (
                          <span className="text-[11px] font-semibold text-neutral-500">
                            • {fest.region}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-neutral-900 truncate">
                        {fest.name}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                        {fest.cultural_vibe || fest.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Quick Filter Pills */}
          <div className="pt-4 border-t border-[#EFE8DF]">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Browse by Curated Classification
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {FESTIVAL_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#E06D24] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-neutral-700 hover:bg-[#F2ECE4] border border-[#EFE8DF]'
                    }`}
                  >
                    {cat === 'All' ? `All Festivals (${festivals.length})` : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Four Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Filter by Category
              </label>
              <select
                id="festival-category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-3 py-2 text-sm text-neutral-800 font-medium focus:outline-none focus:border-[#E06D24]"
              >
                {FESTIVAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? `All Categories (${festivals.length})` : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Filter by State / UT
              </label>
              <select
                id="festival-state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-3 py-2 text-sm text-neutral-800 font-medium focus:outline-none focus:border-[#E06D24]"
              >
                <option value="All">All States &amp; UTs</option>
                {allStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Filter by Primary City
              </label>
              <select
                id="festival-city-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-3 py-2 text-sm text-neutral-800 font-medium focus:outline-none focus:border-[#E06D24]"
              >
                <option value="All">All Cities</option>
                {allCities.map((ct) => (
                  <option key={ct} value={ct}>
                    {ct}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">
                Typical Month / Season
              </label>
              <select
                id="festival-month-filter"
                value={selectedMonth}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedMonth(value);
                  if (value !== 'All') {
                    const monthIndex = months.indexOf(value) - 1;
                    setCalendarCursor((current) => new Date(current.getFullYear(), monthIndex, 1));
                    setSelectedCalendarDate(null);
                  }
                }}
                className="w-full bg-[#FAF7F2] border border-[#EFE8DF] rounded-xl px-3 py-2 text-sm text-neutral-800 font-medium focus:outline-none focus:border-[#E06D24]"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All' ? 'All Months & Seasons' : m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Results Counter & Active Query Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="text-sm font-semibold text-neutral-700">
            {isFilteringActive ? (
              <span>
                Found <span className="text-[#E06D24] font-bold">{filteredFestivals.length}</span> matching celebrations (of {festivals.length} curated across India)
                {searchQuery.trim() && (
                  <span className="text-neutral-500 font-normal"> for &ldquo;<span className="text-neutral-900 font-semibold">{searchQuery}</span>&rdquo;</span>
                )}
              </span>
            ) : (
              <span>
                Showing all <span className="text-[#E06D24] font-bold">{filteredFestivals.length}</span> official curated festivals across India
              </span>
            )}
          </div>
          {isFilteringActive && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedState('All');
                setSelectedCity('All');
                setSelectedMonth('All');
                setSearchQuery('');
                setActiveFilterTab('all');
                setVisibleCount(60);
              }}
              className="text-xs font-semibold text-[#E06D24] hover:underline flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Filters &amp; Show All {festivals.length}
            </button>
          )}
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-[#EFE8DF]" />
            ))}
          </div>
        ) : apiError && festivals.length === 0 ? (
          <div className="bg-red-50 rounded-3xl p-10 text-center border border-red-200 max-w-xl mx-auto my-12 shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-neutral-900 mb-2">
              Unable to Load Festivals
            </h3>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
              We encountered an issue communicating with the Virasat Cultural Registry. Please retry below.
            </p>
            <button
              onClick={() => fetchData()}
              className="px-6 py-2.5 bg-[#E06D24] hover:bg-[#D45B10] text-white font-semibold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        ) : filteredFestivals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EFE8DF] max-w-xl mx-auto my-12">
            <Sparkles className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl text-neutral-800 mb-2">
              No matching festivals found
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              We couldn&apos;t find any festival matching your current search or filter combination. Try clearing filters to see all celebrations.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedState('All');
                setSelectedCity('All');
                setSelectedMonth('All');
                setSearchQuery('');
                setActiveFilterTab('all');
                setVisibleCount(60);
              }}
              className="px-6 py-2.5 bg-[#E06D24] hover:bg-[#D45B10] text-white font-semibold text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters &amp; Show All {festivals.length} Celebrations
            </button>
          </div>
        ) : !isFilteringActive ? (
          <div className="space-y-16">
            {/* 1. National Festivals */}
            {nationalFestivals.length > 0 && (
              <section id="national-festivals-section" className="scroll-mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EFE8DF]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-1">
                      <Flag className="w-3.5 h-3.5 text-blue-700" />
                      National Festivals
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
                      National Days &amp; Observances
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                      Sovereign national commemorations, constitutional celebrations, and historic remembrance days observed across India.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-neutral-500 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE8DF] self-start sm:self-auto">
                    {nationalFestivals.length} National {nationalFestivals.length === 1 ? 'Festival' : 'Festivals'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
                  {nationalFestivals.map((fest) => renderFestivalCard(fest, false))}
                </div>
              </section>
            )}

            {/* 2. Major Harvest Festivals (State-Wise) */}
            {harvestFestivals.length > 0 && (
              <section id="harvest-festivals-section" className="scroll-mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EFE8DF]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E06D24]" />
                      State-Wise Harvest Heritage
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
                      Major Harvest Festivals
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                      Agrarian thanksgiving festivals, solar equinox milestones, and regional New Year celebrations across Indian states.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-neutral-500 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE8DF] self-start sm:self-auto">
                    {harvestFestivals.length} Harvest Celebrations
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
                  {harvestFestivals.map((fest) => renderFestivalCard(fest, false))}
                </div>
              </section>
            )}

            {/* 3. Major Cultural & Religious Festivals */}
            {culturalReligiousFestivals.length > 0 && (
              <section id="cultural-festivals-section" className="scroll-mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EFE8DF]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#D45B10] text-xs font-bold uppercase tracking-wider mb-1">
                      <Flame className="w-3.5 h-3.5 text-[#E06D24]" />
                      Pan-India &amp; State-Specific
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
                      Major Cultural &amp; Religious Festivals
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                      Prominent spiritual, mythological, and community celebrations celebrated with deep devotion and grandeur.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-neutral-500 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE8DF] self-start sm:self-auto">
                    {culturalReligiousFestivals.length} Major Celebrations
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
                  {culturalReligiousFestivals.map((fest) => renderFestivalCard(fest, false))}
                </div>
              </section>
            )}

            {/* 4. Notable State-Specific & Tribal Festivals */}
            {tribalRegionalFestivals.length > 0 && (
              <section id="tribal-festivals-section" className="scroll-mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EFE8DF]">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      Indigenous &amp; State Traditions
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
                      Notable State-Specific &amp; Tribal Festivals
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                      Unique regional traditions, sacred temple car festivals, and indigenous tribal celebrations with explicit state provenance.
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-neutral-500 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE8DF] self-start sm:self-auto">
                    {tribalRegionalFestivals.length} State &amp; Tribal Traditions
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
                  {tribalRegionalFestivals.map((fest) => renderFestivalCard(fest, false))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            <section id="filtered-festivals-section" className="scroll-mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-[#EFE8DF]">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#E06D24]" />
                    Filtered Celebrations
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241E]">
                    {selectedCategory !== 'All' ? selectedCategory : 'Matching Festivals'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                    Showing {sortedFestivalDirectory.length} verified celebration{sortedFestivalDirectory.length === 1 ? '' : 's'} matching your search and filter criteria.
                  </p>
                </div>
                <div className="text-xs font-semibold text-neutral-500 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#EFE8DF] self-start sm:self-auto">
                  {sortedFestivalDirectory.length} {sortedFestivalDirectory.length === 1 ? 'Festival' : 'Festivals'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
                {sortedFestivalDirectory.slice(0, visibleCount).map((fest) => renderFestivalCard(fest, false))}
              </div>
              {visibleCount < sortedFestivalDirectory.length && (
                <div className="mt-12 flex flex-col items-center justify-center gap-3">
                  <div className="text-xs font-semibold text-neutral-500">
                    Showing {Math.min(visibleCount, sortedFestivalDirectory.length)} of {sortedFestivalDirectory.length} festivals
                  </div>
                  <button
                    id="load-more-festivals-btn"
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="px-6 py-2.5 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold rounded-xl border border-[#EFE8DF] shadow-sm hover:shadow transition-all"
                  >
                    Load more festivals
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* =========================================================================
          FESTIVAL DETAIL MODAL
         ========================================================================= */}
      {selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EFE8DF] flex flex-col">
            {/* Modal Header Media */}
            <div className="relative h-60 sm:h-72 shrink-0 bg-neutral-900">
              {hasVerifiedFestivalImage(selectedFestival) ? (
                <img
                  src={selectedFestival.image_url}
                  alt={selectedFestival.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#241A14] via-[#35251C] to-[#1C1510] flex flex-col justify-end p-6 text-white relative">
                  <div className="absolute top-6 left-6 p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedFestival(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Title Overlay */}
              <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                <div className="flex items-center gap-2 mb-1 text-xs text-amber-300 font-semibold uppercase tracking-wider">
                  <span>{selectedFestival.state}</span>
                  {selectedFestival.region && (
                    <>
                      <span>•</span>
                      <span>{selectedFestival.region} India</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{selectedFestival.primary_city}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-sm">
                  {selectedFestival.name}
                </h2>
              </div>
            </div>

            {/* Modal Body: Overview & Heritage */}
            <div className="p-6 sm:p-8 flex-1 space-y-6">
                {/* Cultural Vibe & Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                    <div className="text-xs text-neutral-500 font-medium mb-1">Cultural Essence</div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {selectedFestival.cultural_vibe || `${selectedFestival.religion_or_category || 'Traditional'} celebration`}
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                    <div className="text-xs text-neutral-500 font-medium mb-1">
                      {selectedFestival.is_date_verified ? 'Verified Dates' : 'Typical Season'}
                    </div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {selectedFestival.is_date_verified && selectedFestival.exact_date_start
                        ? `${selectedFestival.exact_date_start} to ${selectedFestival.exact_date_end}`
                        : selectedFestival.typical_season || 'Annual Observance'}
                    </div>
                  </div>
                </div>

                {/* Scope & Religion/Category */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-[#D45B10] font-bold">
                    Scope: {selectedFestival.scope || 'ALL_INDIA'}
                  </span>
                  {selectedFestival.religion_or_category && (
                    <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                      Tradition: {selectedFestival.religion_or_category}
                    </span>
                  )}
                  {selectedFestival.region && (
                    <span className="px-3 py-1 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium">
                      Region: {selectedFestival.region} India
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-2">
                    About the Celebration
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {selectedFestival.description}
                  </p>
                </div>

                {/* Tradition Notes if any (e.g. Jain & Sikh perspectives on Diwali) */}
                {selectedFestival.tradition_notes && (
                  <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-950">
                    <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-[#E06D24]" />
                      Multi-Tradition Observance Notes
                    </div>
                    <p className="leading-relaxed">{selectedFestival.tradition_notes}</p>
                  </div>
                )}

                {/* Associated Places / Heritage Sites */}
                {selectedFestival.associated_places && selectedFestival.associated_places.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-2">
                      Key Sacred Sites &amp; Landmarks
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFestival.associated_places.map((place, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-semibold text-orange-900 flex items-center gap-1.5"
                        >
                          <Landmark className="w-3.5 h-3.5 text-[#E06D24]" />
                          {place}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* States / Alternate Locations */}
                {((selectedFestival.states && selectedFestival.states.length > 0) ||
                  (selectedFestival.alternate_locations && selectedFestival.alternate_locations.length > 0)) && (
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                      Celebrated Across States &amp; Regions
                    </h4>
                    <div className="flex flex-wrap gap-1.5 text-xs text-neutral-700">
                      {Array.from(
                        new Set([
                          ...(selectedFestival.states || []),
                          ...(selectedFestival.alternate_locations || []),
                        ])
                      ).map((st, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-medium">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified Image Attribution & License */}
                {hasVerifiedFestivalImage(selectedFestival) ? (
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-3">
                    <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-800 mb-0.5">Image Provenance &amp; Verification</div>
                      <div>Source: {selectedFestival.source_name || 'Wikimedia Commons / Ministry of Tourism'}</div>
                      {selectedFestival.license && <div>License: {selectedFestival.license}</div>}
                      {selectedFestival.attribution_text && <div>Attribution: {selectedFestival.attribution_text}</div>}
                      {selectedFestival.source_url && (
                        <a
                          href={selectedFestival.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E06D24] hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                        >
                          View Source Archive <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs text-neutral-600 flex items-start gap-3">
                    <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-800 mb-0.5">Official Registry Record</div>
                      <div>Sourced from the National Festivals and Cultural Events Master Database. Neutral placeholder displayed in accordance with verified image standards.</div>
                    </div>
                  </div>
                )}
              </div>

            {/* Modal Direct Actions Footer */}
            <div className="p-4 sm:p-6 bg-white border-t border-[#EFE8DF] grid grid-cols-2 sm:grid-cols-4 gap-3 sticky bottom-0 z-20">
              <button
                onClick={() => handleShowOnMap(selectedFestival)}
                className="px-3 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Show on Map
              </button>

              <button
                onClick={() => handleAddToItinerary(selectedFestival)}
                className="px-3 py-2.5 rounded-xl bg-[#E06D24] hover:bg-[#D45B10] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                Plan Itinerary
              </button>

              <button
                onClick={() => handleAskAI(selectedFestival)}
                className="px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Bot className="w-3.5 h-3.5" />
                Ask Virasat AI
              </button>

              <button
                onClick={() => handleExploreCity(selectedFestival.primary_city_id, selectedFestival.primary_city)}
                className="px-3 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Hotel className="w-3.5 h-3.5" />
                Hotels &amp; City
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
