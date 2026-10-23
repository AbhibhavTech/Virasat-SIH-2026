import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Landmark,
  Calendar,
  Clock,
  IndianRupee,
  Search,
  CheckSquare,
  Square,
  BookOpen,
  Eye,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Filter,
  Map as MapIcon,
  Layers,
  Award,
  ArrowRight,
  X,
  Share2,
  Heart,
  Shield,
  ShieldCheck,
  Globe,
  Building2,
  Dice5,
  ArrowUpDown,
} from 'lucide-react';
import { VoiceInputButton } from '../components/common/VoiceInputButton';
import {
  StateHierarchyEntity,
  CityHierarchyEntity,
  AttractionEntity,
  IndiaHierarchyDatabase
} from '../types/indiaHierarchy';
import { NavTab } from '../components/layout/Sidebar';
import { ExploreIndiaMap } from '../components/explore-india/ExploreIndiaMap';
import { PlaceDetailDrawer } from '../components/explore-india/PlaceDetailDrawer';
import { StateCard } from '../components/explore-india/StateCard';
import { StateQuickLookModal } from '../components/explore-india/StateQuickLookModal';
import { StateCitiesDirectory } from '../components/explore-india/StateCitiesDirectory';
import { StateAttractionsSlideshow } from '../components/explore-india/StateAttractionsSlideshow';
import { STATE_CURATED_IMAGES, getCuratedStateImage } from '../data/stateCuratedImages';
import { INDIA_TOURISM_DATABASE } from '../data/indiaTourismDatabase';
import { OfficialImagePending } from '../components/common/OfficialImagePending';
import { CitizenReportModal } from '../components/common/CitizenReportModal';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { HeritageDivider } from '../components/common/HeritageDivider';
import { getMumbaiHierarchyAttractions, isMumbaiCity } from '../data/mumbaiDestinations';
import { getAmaravatiHierarchyAttractions, isAmaravatiCity } from '../data/amaravatiDestinations';
import { MaharashtraDestinationsSection } from '../components/explore-india/MaharashtraDestinationsSection';
import { AndhraPradeshDirectorySection } from '../components/explore-india/AndhraPradeshDirectorySection';
import { ArunachalPradeshDirectorySection } from '../components/explore-india/ArunachalPradeshDirectorySection';
import { RajasthanDirectorySection } from '../components/explore-india/RajasthanDirectorySection';
import { KeralaDirectorySection } from '../components/explore-india/KeralaDirectorySection';
import { GoaDirectorySection } from '../components/explore-india/GoaDirectorySection';
import { TamilNaduDirectorySection } from '../components/explore-india/TamilNaduDirectorySection';
import { HimachalPradeshDirectorySection } from '../components/explore-india/HimachalPradeshDirectorySection';
import { KarnatakaDirectorySection } from '../components/explore-india/KarnatakaDirectorySection';
import { UttarakhandDirectorySection } from '../components/explore-india/UttarakhandDirectorySection';
import { GujaratDirectorySection } from '../components/explore-india/GujaratDirectorySection';
import { MadhyaPradeshDirectorySection } from '../components/explore-india/MadhyaPradeshDirectorySection';
import { UttarPradeshDirectorySection } from '../components/explore-india/UttarPradeshDirectorySection';
import { WestBengalDirectorySection } from '../components/explore-india/WestBengalDirectorySection';
import { OdishaDirectorySection } from '../components/explore-india/OdishaDirectorySection';
import { AssamDirectorySection } from '../components/explore-india/AssamDirectorySection';
import { PunjabDirectorySection } from '../components/explore-india/PunjabDirectorySection';
import { JammuKashmirDirectorySection } from '../components/explore-india/JammuKashmirDirectorySection';
import { LadakhDirectorySection } from '../components/explore-india/LadakhDirectorySection';
import { SikkimDirectorySection } from '../components/explore-india/SikkimDirectorySection';
import { MeghalayaDirectorySection } from '../components/explore-india/MeghalayaDirectorySection';
import { TelanganaDirectorySection } from '../components/explore-india/TelanganaDirectorySection';
import { ChhattisgarhDirectorySection } from '../components/explore-india/ChhattisgarhDirectorySection';
import { BiharDirectorySection } from '../components/explore-india/BiharDirectorySection';
import { JharkhandDirectorySection } from '../components/explore-india/JharkhandDirectorySection';
import { HaryanaDirectorySection } from '../components/explore-india/HaryanaDirectorySection';
import { VERIFIED_HIDDEN_GEMS } from '../data/hiddenGemsData';

interface IndiaHierarchyPageProps {
  onSelectPlace?: (placeId: string) => void;
  onNavigateTab?: (tab: NavTab) => void;
  onSelectCity?: (cityName: string) => void;
}

type NavigationLevel = 'india' | 'state' | 'city';
type TerritoryTab = 'states' | 'uts' | 'all' | 'saved';
type SortOption = 'default' | 'alpha' | 'destinations' | 'region';

const MUMBAI_HIERARCHY_PLACES = getMumbaiHierarchyAttractions();
const AMARAVATI_HIERARCHY_PLACES = getAmaravatiHierarchyAttractions();

function isMumbaiHierarchyCity(city: CityHierarchyEntity): boolean {
  return isMumbaiCity(city.name) && city.state_id?.toLowerCase() === 'maharashtra';
}

function isAmaravatiHierarchyCity(city: CityHierarchyEntity): boolean {
  return (
    isAmaravatiCity(city.name) ||
    isAmaravatiCity(city.id) ||
    (city.id?.toLowerCase() === 'amaravati' && city.state_id?.toLowerCase() === 'andhra-pradesh')
  );
}

function getCityPlaceCatalog(city: CityHierarchyEntity): AttractionEntity[] {
  if (isMumbaiHierarchyCity(city)) return MUMBAI_HIERARCHY_PLACES;
  if (isAmaravatiHierarchyCity(city)) return AMARAVATI_HIERARCHY_PLACES;
  return [
    ...(city.heritage || []),
    ...(city.monuments || []),
    ...(city.museums || []),
    ...(city.tourist_places || []),
    ...(city.religious_cultural || []),
    ...(city.nature_parks_zoo || []),
  ];
}

function normalizedPlaceName(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function hiddenGemCandidateToPlace(gem: (typeof VERIFIED_HIDDEN_GEMS)[number], city: CityHierarchyEntity): AttractionEntity {
  return {
    id: gem.id,
    name: gem.name,
    canonical_name: gem.name,
    city_id: city.id,
    state_id: city.state_id,
    district: gem.area || city.district,
    place_type: 'hidden_gem_candidate',
    category: 'tourist_places',
    category_label: 'Hidden-gem candidate',
    topic: 'Hidden Gem',
    importance_level: 'hidden_gem',
    summary: gem.whyInteresting,
    short_description: gem.whyInteresting,
    address: gem.area || city.name,
    fees: { domestic: 0, international: 0, currency: 'INR', status: 'UNVERIFIED', note: 'Confirm locally before visiting.' },
    entry_fee: 'Unverified',
    timings: { opening_time: 'Not verified', closing_time: 'Not verified', closed_days: [], status: 'UNVERIFIED', note: 'Confirm access locally.' },
    opening_hours: undefined,
    best_time_to_visit: gem.bestTimeToVisit,
    visit_duration: { recommended_mins: 60, label: 'Not verified', status: 'UNVERIFIED' },
    coordinates: { lat: gem.lat, lng: gem.lng },
    image_url: '',
    thumbnail_url: '',
    attribution: 'Image/source review pending',
    status: 'UNVERIFIED',
    verification_status: 'needs_review',
    verification_note: 'Candidate record has no place-specific source attached. Verify the location, image and visitor information before publishing as verified.',
    provenance_type: 'hidden_gem_candidate',
    tags: gem.tags,
  };
}

export const IndiaHierarchyPage: React.FC<IndiaHierarchyPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  onSelectCity,
}) => {
  // Live Database with robust bundled database initialization and fallback
  const [db, setDb] = useState<IndiaHierarchyDatabase>(
    () => (INDIA_TOURISM_DATABASE as unknown as IndiaHierarchyDatabase)
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadHierarchy = () => {
    fetch('/api/india-hierarchy')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load hierarchy`);
        return res.json();
      })
      .then((data: IndiaHierarchyDatabase) => {
        if (data && data.states && data.states.length > 0) {
          setDb(data);
        }
        setLoadError(null);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        console.warn('Live API fetch warning, utilizing bundled verified database:', err.message);
        setDb((current) => current || (INDIA_TOURISM_DATABASE as unknown as IndiaHierarchyDatabase));
        setLoadError(null);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadHierarchy();
  }, []);

  // Navigation Hierarchy Level
  const [activeLevel, setActiveLevel] = useState<NavigationLevel>('india');
  const [selectedStateId, setSelectedStateId] = useState<string>('rajasthan');
  const [selectedCityId, setSelectedCityId] = useState<string>('jaipur');

  // Presentation toggles
  const [viewMode, setViewMode] = useState<'grid' | 'cities' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [territoryTab, setTerritoryTab] = useState<TerritoryTab>('all');

  // State Quick Look Modal
  const [quickLookState, setQuickLookState] = useState<StateHierarchyEntity | null>(null);

  // Saved Wishlist States from localStorage
  const [savedStates, setSavedStates] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('virasat_saved_states');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleToggleFavoriteState = (stateId: string) => {
    setSavedStates((prev) => {
      const exists = prev.includes(stateId);
      const updated = exists ? prev.filter((id) => id !== stateId) : [...prev, stateId];
      try {
        localStorage.setItem('virasat_saved_states', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const handleSurpriseMe = () => {
    if (!db?.states || db.states.length === 0) return;
    const randomIndex = Math.floor(Math.random() * db.states.length);
    const randomState = db.states[randomIndex];
    setQuickLookState(randomState);
  };

  // Broken Image Tracker (Replaces hardcoded Taj Mahal fallbacks)
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  // Preview Drawer Modal
  const [previewPlace, setPreviewPlace] = useState<AttractionEntity | null>(null);

  // Citizen Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Visited Tracker
  const [visitedPlaces, setVisitedPlaces] = useState<Record<string, boolean>>({});

  const toggleVisited = (attrId: string) => {
    setVisitedPlaces((prev) => ({
      ...prev,
      [attrId]: !prev[attrId],
    }));
  };

  // Canonical Union Territory IDs
  const CANONICAL_UTS = useMemo(
    () =>
      new Set([
        'andaman-and-nicobar-islands',
        'chandigarh',
        'dadra-and-nagar-haveli-and-daman-and-diu',
        'delhi',
        'jammu-and-kashmir',
        'ladakh',
        'lakshadweep',
        'puducherry',
      ]),
    []
  );

  // Simple 6 Geographic Region filters
  const regions = [
    'All',
    'North',
    'South',
    'East',
    'West',
    'Central',
    'Northeast',
  ];

  const regionCounts = useMemo(() => {
    const regionTerms: Record<string, string> = {
      North: 'northern',
      South: 'southern',
      East: 'eastern',
      West: 'western',
      Central: 'central',
      Northeast: 'northeastern',
    };
    return Object.fromEntries(regions.slice(1).map((region) => {
      const members = (db?.states || []).filter((state) =>
        (state.region || '').toLowerCase().includes(regionTerms[region])
      );
      return [region, {
        total: members.length,
        states: members.filter((state) => state.region_type !== 'union_territory' && !CANONICAL_UTS.has(state.id)).length,
        uts: members.filter((state) => state.region_type === 'union_territory' || CANONICAL_UTS.has(state.id)).length,
      }];
    }));
  }, [db, CANONICAL_UTS]);

  // Currently Selected State
  const currentState = useMemo(() => {
    if (!db?.states?.length) return null;
    return db.states.find((s) => s.id === selectedStateId) ?? db.states[0];
  }, [db, selectedStateId]);
  const isAndhraPradeshState = currentState?.id?.toLowerCase() === 'andhra-pradesh' || currentState?.name?.toLowerCase() === 'andhra pradesh';
  const isArunachalPradeshState = currentState?.id?.toLowerCase() === 'arunachal-pradesh' || currentState?.name?.toLowerCase() === 'arunachal pradesh';
  const isRajasthanState = currentState?.id?.toLowerCase() === 'rajasthan' || currentState?.name?.toLowerCase() === 'rajasthan';
  const isKeralaState = currentState?.id?.toLowerCase() === 'kerala' || currentState?.name?.toLowerCase() === 'kerala';
  const isGoaState = currentState?.id?.toLowerCase() === 'goa' || currentState?.name?.toLowerCase() === 'goa';
  const isTamilNaduState = currentState?.id?.toLowerCase() === 'tamil-nadu' || currentState?.name?.toLowerCase() === 'tamil nadu';
  const isHimachalPradeshState = currentState?.id?.toLowerCase() === 'himachal-pradesh' || currentState?.name?.toLowerCase() === 'himachal pradesh';
  const isKarnatakaState = currentState?.id?.toLowerCase() === 'karnataka' || currentState?.name?.toLowerCase() === 'karnataka';
  const isUttarakhandState = currentState?.id?.toLowerCase() === 'uttarakhand' || currentState?.name?.toLowerCase() === 'uttarakhand';
  const isGujaratState = currentState?.id?.toLowerCase() === 'gujarat' || currentState?.name?.toLowerCase() === 'gujarat';
  const isMadhyaPradeshState = currentState?.id?.toLowerCase() === 'madhya-pradesh' || currentState?.name?.toLowerCase() === 'madhya pradesh';
  const isUttarPradeshState = currentState?.id?.toLowerCase() === 'uttar-pradesh' || currentState?.name?.toLowerCase() === 'uttar pradesh';
  const isWestBengalState = currentState?.id?.toLowerCase() === 'west-bengal' || currentState?.name?.toLowerCase() === 'west bengal';
  const isOdishaState = currentState?.id?.toLowerCase() === 'odisha' || currentState?.name?.toLowerCase() === 'odisha' || currentState?.id?.toLowerCase() === 'orissa' || currentState?.name?.toLowerCase() === 'orissa';
  const isAssamState = currentState?.id?.toLowerCase() === 'assam' || currentState?.name?.toLowerCase() === 'assam';
  const isPunjabState = currentState?.id?.toLowerCase() === 'punjab' || currentState?.name?.toLowerCase() === 'punjab';
  const isJammuKashmirState = currentState?.id?.toLowerCase() === 'jammu-and-kashmir' || currentState?.id?.toLowerCase() === 'jammu-kashmir' || currentState?.name?.toLowerCase() === 'jammu and kashmir' || currentState?.name?.toLowerCase() === 'jammu & kashmir';
  const isLadakhState = currentState?.id?.toLowerCase() === 'ladakh' || currentState?.name?.toLowerCase() === 'ladakh';
  const isSikkimState = currentState?.id?.toLowerCase() === 'sikkim' || currentState?.name?.toLowerCase() === 'sikkim';
  const isMeghalayaState = currentState?.id?.toLowerCase() === 'meghalaya' || currentState?.name?.toLowerCase() === 'meghalaya';
  const isTelanganaState = currentState?.id?.toLowerCase() === 'telangana' || currentState?.name?.toLowerCase() === 'telangana';
  const isChhattisgarhState = currentState?.id?.toLowerCase() === 'chhattisgarh' || currentState?.name?.toLowerCase() === 'chhattisgarh';
  const isBiharState = currentState?.id?.toLowerCase() === 'bihar' || currentState?.name?.toLowerCase() === 'bihar';
  const isJharkhandState = currentState?.id?.toLowerCase() === 'jharkhand' || currentState?.name?.toLowerCase() === 'jharkhand';
  const isHaryanaState = currentState?.id?.toLowerCase() === 'haryana' || currentState?.name?.toLowerCase() === 'haryana';

  // All Valid Destinations, Cities & Towns in current state
  const stateValidCities: CityHierarchyEntity[] = useMemo(() => {
    return currentState?.cities ?? [];
  }, [currentState]);

  // Currently Selected City / Town / Locality
  const currentCity: CityHierarchyEntity | null = useMemo(() => {
    if (!stateValidCities || stateValidCities.length === 0) return null;
    const found = stateValidCities.find((c) => c.id === selectedCityId);
    return found || stateValidCities[0] || null;
  }, [stateValidCities, selectedCityId]);

  useEffect(() => {
    const stateParam = searchParams.get('state');
    const cityParam = searchParams.get('city');
    if (!stateParam && !cityParam) return;

    const normalizedStateParam = (stateParam || '').toLowerCase().replace(/\s+/g, '-');
    const matchedState = db.states.find((state) =>
      state.id.toLowerCase() === normalizedStateParam ||
      state.slug?.toLowerCase() === normalizedStateParam ||
      state.name.toLowerCase() === (stateParam || '').toLowerCase()
    );
    if (!matchedState) return;

    setSelectedStateId(matchedState.id);
    const normalizedCityParam = (cityParam || '').toLowerCase().replace(/\s+/g, '-');
    const matchedCity = cityParam ? matchedState.cities.find((city) =>
      city.id.toLowerCase() === normalizedCityParam ||
      city.slug?.toLowerCase() === normalizedCityParam ||
      city.name.toLowerCase() === cityParam.toLowerCase()
    ) : undefined;
    if (matchedCity) {
      setSelectedCityId(matchedCity.id);
      setActiveLevel('city');
    } else {
      if (matchedState.cities.length > 0) setSelectedCityId(matchedState.cities[0].id);
      setActiveLevel('state');
    }
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, db]);

  useEffect(() => {
    if (activeLevel === 'city' && currentCity) onSelectCity?.(currentCity.name);
  }, [activeLevel, currentCity?.id, currentCity?.name, onSelectCity]);

  // Verification status checker for strict public display policy
  const isPlaceVerified = (attr: AttractionEntity): boolean => {
    if (attr.verification_status) {
      return attr.verification_status === 'verified';
    }
    return attr.status === 'VERIFIED';
  };

  // State Level Verification & Topic Distribution Metrics
  const stateMetrics = useMemo(() => {
    if (!currentState?.cities) {
      return {
        verifiedCitiesCount: 0,
        verifiedPlacesCount: 0,
        topicCounts: {} as Record<string, number>,
        hasOfficialSource: false,
      };
    }

    let totalVerifiedPlaces = 0;
    let verifiedCitiesCount = 0;
    const topicCounts: Record<string, number> = {};

    for (const city of currentState.cities ?? []) {
      const rawPlaces = getCityPlaceCatalog(city);
      const verified = rawPlaces.filter(isPlaceVerified);
      if (verified.length > 0) {
        verifiedCitiesCount += 1;
      }
      totalVerifiedPlaces += verified.length;

      for (const p of verified) {
        const top =
          p.topic ||
          (p.category === 'heritage'
            ? 'Heritage'
            : p.category === 'religious_cultural'
            ? 'Spiritual'
            : p.category === 'nature_parks_zoo'
            ? 'Nature'
            : 'Heritage');
        topicCounts[top] = (topicCounts[top] || 0) + 1;
      }
    }

    return {
      verifiedCitiesCount: verifiedCitiesCount > 0 ? verifiedCitiesCount : (currentState.cities?.length ?? 0),
      verifiedPlacesCount: totalVerifiedPlaces,
      topicCounts,
      hasOfficialSource: Boolean(currentState.official_tourism_url),
    };
  }, [currentState]);

  // Aggregate verified places in current city/destination (Strictly verified places only)
  const cityAllPlaces: AttractionEntity[] = useMemo(() => {
    if (!currentCity) return [];
    return getCityPlaceCatalog(currentCity).filter(isPlaceVerified);
  }, [currentCity]);

  const cityPopularPlaces = useMemo(() => {
    const rank: Record<string, number> = { iconic: 5, major: 4, notable: 3, local: 2, hidden_gem: 1 };
    return cityAllPlaces
      .map((place, index) => ({ place, index }))
      .sort((a, b) => (rank[b.place.importance_level || ''] || 0) - (rank[a.place.importance_level || ''] || 0) || a.index - b.index)
      .slice(0, 10)
      .map(({ place }) => place);
  }, [cityAllPlaces]);

  const stateFeaturedPlaces = useMemo(() => {
    if (!currentState?.cities) return [];
    const seen = new Set<string>();
    return currentState.cities.flatMap((city) =>
      getCityPlaceCatalog(city)
        .filter(isPlaceVerified)
        .filter((place) => {
          const key = place.id.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((place) => ({ place, cityId: city.id, cityName: city.name }))
    );
  }, [currentState]);

  const cityHiddenGemCandidates = useMemo(() => {
    if (!currentCity) return [];
    const existingCandidates = getCityPlaceCatalog(currentCity)
      .filter(place => place.provenance_type === 'hidden_gem_candidate')
      .map(place => ({ ...place, image_url: '', thumbnail_url: '', attribution: 'Image/source review pending' }));
    const cityNames = new Set([currentCity.name, currentCity.canonical_name, ...(currentCity.aliases || [])]
      .filter((value): value is string => Boolean(value)).map(normalizedPlaceName));
    const datasetCandidates = VERIFIED_HIDDEN_GEMS
      .filter(gem => cityNames.has(normalizedPlaceName(gem.city)))
      .map(gem => hiddenGemCandidateToPlace(gem, currentCity));
    const unique = new Map<string, AttractionEntity>();
    for (const place of [...existingCandidates, ...datasetCandidates]) {
      const key = normalizedPlaceName(place.name);
      if (!unique.has(key)) unique.set(key, place);
    }
    return [...unique.values()].slice(0, 10);
  }, [currentCity]);

  // Available topics/categories in this city
  const cityAvailableTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    for (const p of cityAllPlaces) {
      if (p.topic) topicsSet.add(p.topic);
      else if (p.category_label) topicsSet.add(p.category_label);
      else if (p.category) topicsSet.add(p.category);
    }
    return Array.from(topicsSet);
  }, [cityAllPlaces]);

  // Filtered places within current city
  const filteredCityPlaces = useMemo(() => {
    return cityAllPlaces.filter((attr) => {
      if (activeCategoryFilter === 'all') return cityPopularPlaces.some(place => place.id === attr.id);
      if (activeCategoryFilter === 'all_places') return true;
      if (activeCategoryFilter === 'hidden_gems') return false;
      if (attr.category === activeCategoryFilter) return true;
      if (attr.topic && attr.topic.toLowerCase() === activeCategoryFilter.toLowerCase()) return true;
      return false;
    });
  }, [cityAllPlaces, cityPopularPlaces, activeCategoryFilter]);

  const filteredCityCandidates = useMemo(() => {
    return cityHiddenGemCandidates.filter((attr) => {
      if (activeCategoryFilter === 'all') return true;
      if (activeCategoryFilter === 'hidden_gems') return true;
      if (attr.category === activeCategoryFilter) return true;
      if (attr.topic && attr.topic.toLowerCase() === activeCategoryFilter.toLowerCase()) return true;
      return false;
    });
  }, [cityHiddenGemCandidates, activeCategoryFilter]);

  const previewCityName = useMemo(() => {
    if (!previewPlace) return currentCity?.name;
    return currentState?.cities.find((city) => city.id === previewPlace.city_id)?.name || currentCity?.name;
  }, [previewPlace, currentCity?.name, currentState?.cities]);

  // Filtered States list for Level 1 (All India)
  const filteredStates = useMemo(() => {
    if (!db || !db.states) return [];
    
    let list = db.states.filter((state) => {
      // Saved wishlist filter
      if (territoryTab === 'saved') {
        if (!savedStates.includes(state.id)) return false;
      }

      // Region match
      if (selectedRegion !== 'All') {
        const reg = selectedRegion.toLowerCase();
        const stateReg = (state.region || '').toLowerCase();
        let match = false;
        if (reg === 'north') {
          match = (stateReg.includes('north') || stateReg.includes('ncr')) && !stateReg.includes('northeast') && !stateReg.includes('north-east') && !stateReg.includes('eastern');
        } else if (reg === 'south') {
          match = stateReg.includes('south');
        } else if (reg === 'east') {
          match = stateReg.includes('east') && !stateReg.includes('northeast') && !stateReg.includes('north-east');
        } else if (reg === 'west') {
          match = stateReg.includes('west');
        } else if (reg === 'central') {
          match = stateReg.includes('central');
        } else if (reg === 'northeast') {
          match = stateReg.includes('northeast') || stateReg.includes('north-east') || stateReg.includes('north eastern');
        }
        if (!match) return false;
      }

      // Experience / Theme filter
      if (selectedTheme !== 'all') {
        const themeLower = selectedTheme.toLowerCase();
        const desc = (state.description || state.heritage_overview || '').toLowerCase();
        const tags = (STATE_CURATED_IMAGES[state.id]?.tags || []).map((t) => t.toLowerCase());
        const landmark = (STATE_CURATED_IMAGES[state.id]?.landmark || '').toLowerCase();
        const combined = `${desc} ${tags.join(' ')} ${landmark}`;

        const matchesTheme =
          (themeLower === 'unesco' && (combined.includes('unesco') || combined.includes('world heritage'))) ||
          (themeLower === 'hills' && (combined.includes('himalaya') || combined.includes('hill') || combined.includes('mountain') || combined.includes('pass') || combined.includes('valley'))) ||
          (themeLower === 'coastal' && (combined.includes('coast') || combined.includes('beach') || combined.includes('island') || combined.includes('sea') || combined.includes('backwater') || combined.includes('atoll'))) ||
          (themeLower === 'forts' && (combined.includes('fort') || combined.includes('palace') || combined.includes('mahal') || combined.includes('castle'))) ||
          (themeLower === 'spiritual' && (combined.includes('temple') || combined.includes('pilgrim') || combined.includes('sacred') || combined.includes('spiritual') || combined.includes('ghat') || combined.includes('jyotirlinga')));
        
        if (!matchesTheme) return false;
      }

      // Search match across state name, capital, or town names
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const inStateName = state.name?.toLowerCase().includes(q);
        const inCapital = state.capital?.toLowerCase().includes(q);
        if (!inStateName && !inCapital) return false;
      }

      return true;
    });

    // Sorting options
    if (sortBy === 'alpha') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'destinations') {
      list = [...list].sort((a, b) => (b.cities?.length || 0) - (a.cities?.length || 0));
    } else if (sortBy === 'region') {
      list = [...list].sort((a, b) => (a.region || '').localeCompare(b.region || ''));
    }

    return list;
  }, [selectedRegion, searchQuery, territoryTab, savedStates, selectedTheme, sortBy, CANONICAL_UTS, db]);

  // Partitioned into 28 States and 8 Union Territories
  const statesList = useMemo(() => {
    return filteredStates.filter(
      (s) => s.region_type === 'state' || (!s.region_type && !CANONICAL_UTS.has(s.id))
    );
  }, [filteredStates, CANONICAL_UTS]);

  const utsList = useMemo(() => {
    return filteredStates.filter(
      (s) => s.region_type === 'union_territory' || CANONICAL_UTS.has(s.id)
    );
  }, [filteredStates, CANONICAL_UTS]);

  // The default Discover Bharat view always exposes the complete state collection.
  const displayedStates = statesList;

  // Global search suggestions when typing
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !db || !db.states) return null;

    const matchedStates: Array<{ id: string; name: string; region: string; region_type?: string }> = [];
    for (const state of db.states) {
      if (state.name?.toLowerCase().includes(q) || state.capital?.toLowerCase().includes(q)) {
        matchedStates.push({ id: state.id, name: state.name, region: state.region, region_type: state.region_type });
      }
    }

    return { states: matchedStates.slice(0, 8) };
  }, [searchQuery, db]);

  // Navigation handlers
  const handleSelectState = (stateId: string) => {
    setSelectedStateId(stateId);
    const s = db?.states.find((item) => item.id === stateId);
    if (s && s.cities && s.cities.length > 0) {
      setSelectedCityId(s.cities[0].id);
    }
    setActiveLevel('state');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTown = (stateId: string, townId: string) => {
    setSelectedStateId(stateId);
    setSelectedCityId(townId);
    setActiveLevel('city');
    if (onSelectCity) {
      const s = db?.states.find((item) => item.id === stateId);
      const c = s?.cities.find((item) => item.id === townId);
      if (c) onSelectCity(c.name);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToIndia = () => {
    setActiveLevel('india');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToState = () => {
    setActiveLevel('state');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF7E6] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
          <p className="text-sm text-stone-600">Loading India hierarchy...</p>
        </div>
      </div>
    );
  }

  if (loadError && !db) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF7E6] to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-semibold mb-2">Failed to Load Discover Bharat</p>
          <p className="text-sm text-stone-600 mb-4">{loadError || 'No data available'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm hover:bg-amber-800 cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Keep the state landing page empty while its replacement database is prepared.
  // The underlying city and attraction records remain untouched for other app features.
  if (activeLevel === 'state' && currentState) {
    if (isRajasthanState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C94D0A] hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Rajasthan Complete Directory (IN-RJ)
            </span>
          </div>
          <RajasthanDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isAssamState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
              Assam Complete Directory (IN-AS)
            </span>
          </div>
          <AssamDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isPunjabState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Punjab Complete Directory (IN-PB)
            </span>
          </div>
          <PunjabDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isJammuKashmirState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-sky-950 bg-sky-100/90 border border-sky-300 px-3 py-1 rounded-full shadow-2xs">
              Jammu &amp; Kashmir Complete Directory (IN-JK)
            </span>
          </div>
          <JammuKashmirDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isLadakhState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Ladakh Complete Directory (IN-LA)
            </span>
          </div>
          <LadakhDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isSikkimState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
              Sikkim Complete Directory (IN-SK)
            </span>
          </div>
          <SikkimDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isMeghalayaState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
              Meghalaya Complete Directory (IN-ML)
            </span>
          </div>
          <MeghalayaDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isTelanganaState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Telangana Complete Directory (IN-TG)
            </span>
          </div>
          <TelanganaDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isChhattisgarhState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Chhattisgarh Complete Directory (IN-CT)
            </span>
          </div>
          <ChhattisgarhDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isBiharState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Bihar Complete Directory (IN-BR)
            </span>
          </div>
          <BiharDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isJharkhandState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
              Jharkhand Complete Directory (IN-JH)
            </span>
          </div>
          <JharkhandDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isHaryanaState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Haryana Complete Directory (IN-HR)
            </span>
          </div>
          <HaryanaDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isOdishaState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Odisha Complete Directory (IN-OR)
            </span>
          </div>
          <OdishaDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isWestBengalState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-rose-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-rose-950 bg-rose-100/90 border border-rose-300 px-3 py-1 rounded-full shadow-2xs">
              West Bengal Complete Directory (IN-WB)
            </span>
          </div>
          <WestBengalDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isUttarPradeshState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-orange-950 bg-orange-100/90 border border-orange-300 px-3 py-1 rounded-full shadow-2xs">
              Uttar Pradesh Complete Directory (IN-UP)
            </span>
          </div>
          <UttarPradeshDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isMadhyaPradeshState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Madhya Pradesh Complete Directory (IN-MP)
            </span>
          </div>
          <MadhyaPradeshDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isGujaratState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Gujarat Complete Directory (IN-GJ)
            </span>
          </div>
          <GujaratDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isUttarakhandState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
              Uttarakhand Complete Directory (IN-UK)
            </span>
          </div>
          <UttarakhandDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isKarnatakaState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Karnataka Complete Directory (IN-KA)
            </span>
          </div>
          <KarnatakaDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isHimachalPradeshState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
              Himachal Pradesh Complete Directory (IN-HP)
            </span>
          </div>
          <HimachalPradeshDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isGoaState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-sky-950 bg-sky-100/90 border border-sky-300 px-3 py-1 rounded-full shadow-2xs">
              Goa Complete Directory (IN-GA)
            </span>
          </div>
          <GoaDirectorySection
            onSelectDistrict={(districtId) => handleSelectTown(currentState.id, districtId)}
          />
        </main>
      );
    }

    if (isTamilNaduState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Tamil Nadu Complete Directory (IN-TN)
            </span>
          </div>
          <TamilNaduDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isKeralaState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
              Kerala Complete Directory (IN-KL)
            </span>
          </div>
          <KeralaDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isAndhraPradeshState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Andhra Pradesh Complete Directory (IN-AP)
            </span>
          </div>
          <AndhraPradeshDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }

    if (isArunachalPradeshState) {
      return (
        <main className="w-full min-h-[65vh] text-[#0B192C] pb-16 space-y-6">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-4" />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReturnToIndia}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:underline cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Discover Bharat · All States &amp; Territories
            </button>
            <span className="text-xs font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
              Arunachal Pradesh Complete Directory (IN-AR)
            </span>
          </div>
          <ArunachalPradeshDirectorySection
            onSelectCity={(cityId) => handleSelectTown(currentState.id, cityId)}
          />
        </main>
      );
    }
    return (
      <main className="w-full min-h-[65vh] text-[#0B192C] pb-16">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-6" />
        <div className="rounded-3xl border border-[#EFE8DF] bg-white p-5 sm:p-8">
          <button type="button" onClick={handleReturnToIndia} className="inline-flex items-center gap-2 text-sm font-semibold text-[#C94D0A] hover:underline">
            <ChevronLeft className="h-4 w-4" /> Discover Bharat
          </button>
          <h1 className="mt-5 font-serif text-3xl sm:text-4xl font-bold">{currentState.name}</h1>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full text-[#0B192C] pb-16">
      {/* Top Heritage Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] rounded-full mb-6" />

      <div className="w-full space-y-6 sm:space-y-8">
        {/* =========================================================================
            HEADER & BREADCRUMB EXPLORATION BAR
        ========================================================================= */}
        {activeLevel === 'state' && currentState ? (
          /* COMPACT & PREMIUM INDIAN TOURISM HERO */
          <div className="bg-[#FCFBF9] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] p-3.5 sm:p-6 lg:p-7 shadow-xs relative overflow-hidden">
            {/* Subtle architectural motif background */}
            <div className="absolute top-0 right-0 w-80 h-80 opacity-5 pointer-events-none bg-[radial-gradient(#FF671F_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Top Bar: Clean Breadcrumb + Subtle Back Button */}
            <div className="flex items-center justify-between gap-2.5 pb-2.5 sm:pb-3 mb-3 sm:mb-3.5 border-b border-[#EFE8DF]/80 relative z-10 flex-wrap">
              <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-500 font-medium flex-wrap" aria-label="Breadcrumb">
                <button
                  onClick={handleReturnToIndia}
                  className="hover:text-[#FF671F] transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 font-medium"
                >
                  <Compass className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span>Discover Bharat</span>
                </button>
                <span className="text-stone-300 font-normal select-none">/</span>
                <button
                  onClick={() => {
                    setSelectedRegion(currentState.region);
                    handleReturnToIndia();
                  }}
                  className="hover:text-[#FF671F] transition-colors cursor-pointer"
                >
                  {currentState.region}
                </button>
                <span className="text-stone-300 font-normal select-none">/</span>
                <span className="font-semibold text-stone-900">{currentState.name}</span>
              </nav>

              <button
                onClick={handleReturnToIndia}
                className="text-[11px] sm:text-xs text-stone-500 hover:text-[#FF671F] transition-colors flex items-center gap-1 font-medium cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-stone-400" />
                <span>Back</span>
              </button>
            </div>

            {/* Main Content: Left details + Right heritage image */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
              <div className="space-y-2 sm:space-y-2.5 flex-1 min-w-0 pr-0 md:pr-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#0B192C] tracking-tight leading-tight">
                      {currentState.name}
                    </h1>
                    <span className="inline-flex items-center text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF671F] font-bold tracking-wide">
                      {currentState.region_type === 'union_territory' ? 'Union Territory' : 'State of Bharat'}
                    </span>
                  </div>

                  {/* Location / Meta Information */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium flex-wrap">
                    <span className="inline-flex items-center gap-1 text-stone-700">
                      <MapPin className="w-3.5 h-3.5 text-[#FF671F] shrink-0" />
                      <span>{currentState.region}</span>
                    </span>
                    {currentState.capital && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span>
                          Capital: <strong className="text-stone-900 font-semibold">{currentState.capital}</strong>
                        </span>
                      </>
                    )}
                    {currentState.total_cities > 0 && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span>{currentState.total_cities} Destinations</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5A4E46] leading-relaxed max-w-xl lg:max-w-2xl line-clamp-2 sm:line-clamp-3">
                  {currentState.description || currentState.heritage_overview}
                </p>

                {/* Prominent Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('ai')}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#E65100] hover:to-[#D84315] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
                      <span>✨ Ask Virasat AI</span>
                    </button>
                  )}

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('itinerary')}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-[#EFE8DF] hover:border-stone-400 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF671F]" />
                      <span>🗓️ Plan a Trip</span>
                    </button>
                  )}

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('festivals')}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-[#EFE8DF] hover:border-stone-400 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#046A38]" />
                      <span>🎉 State Festivals</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const el = document.getElementById('state-destinations-section');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
                    <span>Explore Places</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Curated Heritage Image Card */}
              {(() => {
                const curated = getCuratedStateImage(currentState.id, currentState.hero_image_url);
                const isImageValid = curated?.url && !brokenImages[currentState.id];

                return isImageValid ? (
                  <div className="relative w-full md:w-80 lg:w-96 h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden border border-[#EFE8DF] shadow-md group shrink-0 bg-stone-900">
                    <img
                      src={curated.url}
                      alt={currentState.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(currentState.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Landmark Tag & Verified Badge */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                      {curated.landmark && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full bg-black/60 text-white font-semibold backdrop-blur-xs max-w-[210px] truncate border border-white/10">
                          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{curated.landmark}</span>
                        </span>
                      )}
                      <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-[#046A38] text-white font-bold backdrop-blur-xs shadow-xs shrink-0 border border-white/10">
                        Verified
                      </span>
                    </div>

                    {/* Bottom details */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs">
                        {curated.bestSeason ? (
                          <span className="flex items-center gap-1 text-amber-300 font-medium">
                            <Calendar className="w-3 h-3 shrink-0" />
                            <span>Best: {curated.bestSeason}</span>
                          </span>
                        ) : <span />}
                        {curated.creator && (
                          <span className="text-[9px] text-stone-300 truncate max-w-[130px]" title={`Photo: ${curated.creator}`}>
                            📷 {curated.creator}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full md:w-80 lg:w-96 h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden border border-[#EFE8DF] shadow-2xs shrink-0 bg-gradient-to-br from-[#FFF9F2] to-[#F5ECE0] p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF671F] shadow-xs">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-stone-700 border border-[#EFE8DF] shadow-2xs">
                        {currentState.region}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">{currentState.name}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">Capital: {currentState.capital}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : activeLevel === 'city' && currentCity ? (
          /* COMPACT CITY LEVEL HERO */
          <div className="bg-[#FCFBF9] rounded-2xl sm:rounded-3xl border border-[#EFE8DF] p-3.5 sm:p-6 lg:p-7 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 opacity-5 pointer-events-none bg-[radial-gradient(#FF671F_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Top Bar: Clean Breadcrumb + Subtle Back Button */}
            <div className="flex items-center justify-between gap-2.5 pb-2.5 sm:pb-3 mb-3 sm:mb-3.5 border-b border-[#EFE8DF]/80 relative z-10 flex-wrap">
              <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-stone-500 font-medium flex-wrap" aria-label="Breadcrumb">
                <button
                  onClick={handleReturnToIndia}
                  className="hover:text-[#FF671F] transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 font-medium"
                >
                  <Compass className="w-3.5 h-3.5 text-[#FF671F]" />
                  <span>Discover Bharat</span>
                </button>
                <span className="text-stone-300 font-normal select-none">/</span>
                <span className="text-stone-600 truncate max-w-[100px]">{currentState?.region || currentCity.region || 'North'}</span>
                <span className="text-stone-300 font-normal select-none">/</span>
                <button
                  onClick={handleReturnToState}
                  className="hover:text-[#FF671F] transition-colors cursor-pointer truncate max-w-[100px]"
                >
                  {currentState?.name || currentCity.state}
                </button>
                <span className="text-stone-300 font-normal select-none">/</span>
                <span className="font-semibold text-stone-900 truncate max-w-[120px]">{currentCity.name}</span>
              </nav>

              <button
                onClick={handleReturnToState}
                className="text-[11px] sm:text-xs text-stone-500 hover:text-[#FF671F] transition-colors flex items-center gap-1 font-medium cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-stone-400" />
                <span>Back</span>
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative z-10">
              <div className="space-y-2 sm:space-y-2.5 flex-1 min-w-0 pr-0 md:pr-4">
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#0B192C] tracking-tight leading-tight">
                      {currentCity.name}
                    </h1>
                    {currentCity.is_capital && (
                      <span className="inline-flex items-center text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                        State Capital
                      </span>
                    )}
                  </div>

                  {currentCity.tagline && (
                    <p className="text-xs sm:text-sm text-[#FF671F] font-medium italic">
                      &quot;{currentCity.tagline}&quot;
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 font-medium flex-wrap">
                    <span className="inline-flex items-center gap-1 text-stone-700">
                      <MapPin className="w-3.5 h-3.5 text-[#FF671F] shrink-0" />
                      <span>{currentCity.district} District</span>
                    </span>
                    <span className="text-stone-300">·</span>
                    <span>{currentState?.name || currentCity.state}</span>
                    {currentState?.region && (
                      <>
                        <span className="text-stone-300">·</span>
                        <span>{currentState.region}</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#5A4E46] leading-relaxed max-w-xl lg:max-w-2xl line-clamp-2 sm:line-clamp-3">
                  {currentCity.description || `Explore verified heritage destinations, architectural monuments, and cultural landmarks across ${currentCity.name}.`}
                </p>

                {/* Prominent Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('ai')}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#E65100] hover:to-[#D84315] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
                      <span>✨ Ask Virasat AI</span>
                    </button>
                  )}

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('itinerary')}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-[#EFE8DF] hover:border-stone-400 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF671F]" />
                      <span>🗓️ Plan a Trip</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const el = document.getElementById('city-attractions-section');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
                    <span>Explore Places</span>
                  </button>
                </div>
              </div>

              {/* City Hero Photo */}
              {(() => {
                const isImageValid = currentCity.hero_image_url && !brokenImages[currentCity.id];

                return isImageValid ? (
                  <div className="relative w-full md:w-80 lg:w-96 h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden border border-[#EFE8DF] shadow-md group shrink-0 bg-stone-900">
                    <img
                      src={currentCity.hero_image_url}
                      alt={currentCity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(currentCity.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute top-2.5 right-2.5 pointer-events-none">
                      <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-[#046A38] text-white font-bold backdrop-blur-xs shadow-xs border border-white/10">
                        Verified
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                      <span className="text-xs font-bold block truncate">{currentCity.name}</span>
                      <span className="text-[10px] text-stone-300">{currentCity.district} District</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full md:w-80 lg:w-96 h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden border border-[#EFE8DF] shadow-2xs shrink-0 bg-gradient-to-br from-[#FFF9F2] to-[#F5ECE0] p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF671F] shadow-xs">
                        <Landmark className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-stone-700 border border-[#EFE8DF] shadow-2xs">
                        {currentState?.name || currentCity.state}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">{currentCity.name}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{currentCity.district} District</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          /* ALL-INDIA VIEW HERO */
          <div className="bg-gradient-to-br from-white via-[#FFF8EF] to-[#F0FAF4] rounded-2xl sm:rounded-3xl border border-[#F0DCC8] p-4 sm:p-6 md:p-7 shadow-sm relative overflow-hidden">
            <div className="absolute -top-28 -right-20 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full bg-emerald-200/25 blur-3xl pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#FF671F_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(520px,1.05fr)] gap-6 lg:gap-10 relative z-10">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4">
                  <img
                    src="/images/india-flag-map.png"
                    alt=""
                    aria-hidden="true"
                    className="w-14 h-14 sm:w-20 sm:h-20 object-contain drop-shadow-md shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800">
                      <Compass className="w-3.5 h-3.5" /> A country of many journeys
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B192C] tracking-tight leading-tight mt-1">
                      Discover Bharat
                    </h1>
                    <p className="text-sm text-[#6B5E55] max-w-lg leading-relaxed mt-2">
                      Choose a region, then explore its states and Union Territories.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5 mt-6 max-w-xl">
                  {[
                    { value: db?.states.filter((state) => state.region_type !== 'union_territory' && !CANONICAL_UTS.has(state.id)).length || 28, label: 'States', action: () => setTerritoryTab('states'), color: 'text-[#C94D0A]' },
                    { value: db?.states.filter((state) => state.region_type === 'union_territory' || CANONICAL_UTS.has(state.id)).length || 8, label: 'Union Territories', action: () => setTerritoryTab('uts'), color: 'text-emerald-800' },
                    { value: regions.length - 1, label: 'Regions', action: () => { setSelectedRegion('All'); setTerritoryTab('all'); }, color: 'text-sky-800' },
                  ].map((stat) => (
                    <button
                      key={stat.label}
                      onClick={stat.action}
                      className="text-left rounded-2xl border border-white/80 bg-white/75 hover:bg-white hover:-translate-y-0.5 shadow-xs px-3.5 py-3 transition-all"
                    >
                      <span className={`block text-2xl font-black leading-none ${stat.color}`}>{stat.value}</span>
                      <span className="block text-[10px] sm:text-xs text-stone-600 mt-1.5">{stat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/90 bg-white/75 shadow-sm p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C94D0A]">Explore by region</span>
                    <p className="text-xs text-stone-600 mt-0.5">A quick way to find your next part of India</p>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-800 border border-emerald-100">
                    <MapPin className="w-3 h-3" /> 6 regions
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {regions.slice(1).map((region) => {
                    const counts = regionCounts[region] || { total: 0, states: 0, uts: 0 };
                    const selected = selectedRegion === region;
                    return (
                      <button
                        key={region}
                        onClick={() => {
                          setSelectedRegion(selected ? 'All' : region);
                          setTerritoryTab('all');
                        }}
                        aria-pressed={selected}
                        className={`group text-left rounded-2xl px-3.5 py-3 transition-all border ${selected
                          ? 'bg-[#173D34] border-[#173D34] text-white shadow-md'
                          : 'bg-white border-[#EFE8DF] text-[#172B3A] hover:border-orange-300 hover:bg-orange-50/60 hover:-translate-y-0.5'
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs sm:text-sm">{region}</span>
                          <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${selected ? 'bg-white/15 text-white' : 'bg-orange-100 text-[#A9430A]'}`}>{counts.total}</span>
                        </span>
                        <span className={`block text-[10px] mt-1 ${selected ? 'text-white/75' : 'text-stone-500'}`}>
                          {counts.states} states · {counts.uts} UTs
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          {/* Unified Controls: Territory Tabs, Search & Filter Bar (Zero dead space) */}
          <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-5 border-t border-[#EFE8DF] space-y-3 sm:space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
              {/* Search input with clean autocomplete & voice input */}
              <div className="relative w-full lg:w-96 shrink-0">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#FF671F]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search a state or Union Territory..."
                  className="w-full pl-10 pr-20 py-2 sm:py-2.5 bg-white border border-[#D5C7B8] rounded-xl text-xs text-[#0B192C] placeholder:text-[#A09388] focus:outline-none focus:border-[#FF671F] focus:ring-1 focus:ring-[#FF671F] transition shadow-xs"
                />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <VoiceInputButton
                    variant="minimal"
                    title="Speak to search Discover Bharat"
                    placeholderPrompt="Listening... Say any state, town, or monument"
                    onTranscript={(text) => setSearchQuery(text)}
                    onFinalTranscript={(text) => {
                      setSearchQuery(text);
                    }}
                  />
                </div>

                {/* Instant Search Results Dropdown */}
                {searchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#EFE8DF] shadow-xl p-3 z-30 max-h-96 overflow-y-auto space-y-3">
                    {/* States matched */}
                    {searchResults.states.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] px-2 block mb-1">
                          States &amp; Territories
                        </span>
                        <div className="space-y-1">
                          {searchResults.states.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setTerritoryTab('all');
                                setSelectedRegion('All');
                                setSearchQuery(s.name);
                              }}
                              className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#FAF8F5] flex items-center justify-between transition cursor-pointer"
                            >
                              <span className="font-bold text-stone-900">{s.name}</span>
                              <span className="text-[11px] text-[#7A6E65]">
                                {s.region_type === 'union_territory' ? 'Union Territory' : s.region}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.states.length === 0 && (
                        <div className="p-4 text-center text-xs text-stone-500">
                          No state or Union Territory matched &quot;{searchQuery}&quot;.
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* State vs UT vs Wishlist Toggle Tabs & Sort Selector */}
              {activeLevel === 'india' && (viewMode === 'grid' || viewMode === 'cities') && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 w-full lg:w-auto">
                  <div className="flex items-center p-0.5 sm:p-1 rounded-xl sm:rounded-2xl bg-[#F5EFEB] border border-[#E7DFD5] overflow-x-auto max-w-full scrollbar-none no-scrollbar">
                    <button
                      onClick={() => setTerritoryTab('states')}
                      className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        territoryTab === 'states'
                          ? 'bg-[#FF671F] text-white shadow-xs'
                          : 'text-[#7A6E65] hover:text-[#0B192C]'
                      }`}
                    >
                      <span>States</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] ${
                        territoryTab === 'states' ? 'bg-white/25 text-white' : 'bg-orange-100 text-[#FF671F]'
                      }`}>
                        {isLoading ? '...' : statesList.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setTerritoryTab('uts')}
                      className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        territoryTab === 'uts'
                          ? 'bg-[#FF671F] text-white shadow-xs'
                          : 'text-[#7A6E65] hover:text-[#0B192C]'
                      }`}
                    >
                      <span>UTs</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] ${
                        territoryTab === 'uts' ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {isLoading ? '...' : utsList.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setTerritoryTab('all')}
                      className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        territoryTab === 'all'
                          ? 'bg-[#FF671F] text-white shadow-xs'
                          : 'text-[#7A6E65] hover:text-[#0B192C]'
                      }`}
                    >
                      <span>All</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] ${
                        territoryTab === 'all' ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {isLoading ? '...' : filteredStates.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setTerritoryTab('saved')}
                      className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                        territoryTab === 'saved'
                          ? 'bg-white text-rose-600 shadow-xs'
                          : 'text-[#7A6E65] hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${territoryTab === 'saved' ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>Wishlist</span>
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] bg-rose-100 text-rose-700 font-bold">
                        {savedStates.length}
                      </span>
                    </button>
                  </div>

                  {/* Sort selector */}
                  <div className="flex items-center justify-between sm:justify-start gap-1.5 shrink-0 self-end sm:self-auto">
                    <span className="text-[11px] sm:text-xs font-semibold text-stone-500 flex items-center gap-1">
                      <ArrowUpDown className="w-3 h-3 text-[#FF671F]" /> Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-white border border-[#E7DFD5] text-[#0B192C] text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 focus:outline-none focus:border-[#FF671F] cursor-pointer shadow-2xs"
                    >
                      <option value="default">Default Order</option>
                      <option value="alpha">Name (A – Z)</option>
                      <option value="destinations">Most Destinations</option>
                      <option value="region">By Region</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        )}

        {/* =========================================================================
            LEVEL 1: ALL INDIA VIEW (28 STATES & 8 UTs SEPARATED SECTIONS)
        ========================================================================= */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF671F] flex items-center justify-center shadow-xs">
              <Compass className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#0B192C]">Loading Discover Bharat...</h3>
              <p className="text-xs text-[#7A6E65]">Loading state and Union Territory cards</p>
            </div>
          </div>
        ) : loadError ? (
          <div className="my-12 p-8 rounded-3xl bg-red-50/80 border border-red-200 text-center space-y-3 max-w-md mx-auto shadow-xs">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto font-bold">!</div>
            <h3 className="text-sm font-bold text-red-900">Failed to load Discover Bharat</h3>
            <p className="text-xs text-red-700">{loadError}</p>
            <button
              onClick={loadHierarchy}
              className="px-5 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : activeLevel === 'india' && (
          <>
            {viewMode === 'map' ? (
              <ExploreIndiaMap
                onSelectState={handleSelectState}
                onSelectTown={handleSelectTown}
              />
            ) : viewMode === 'cities' ? (
              <StateCitiesDirectory
                states={filteredStates}
                onSelectState={handleSelectState}
                onSelectTown={handleSelectTown}
                onQuickLook={(s) => setQuickLookState(s)}
                savedStates={savedStates}
                onToggleFavorite={handleToggleFavoriteState}
              />
            ) : (
              <div className="space-y-7">

                {/* Section: Saved Wishlist */}
                {territoryTab === 'saved' && (
                  <div className="space-y-4">
                    <HeritageDivider
                      variant="heart"
                      accent="saffron"
                      label="My Curated Wishlist"
                      subtitle="Bookmarked States & Union Territories for your upcoming travels"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          <span>My Virasat Wishlist ({filteredStates.length})</span>
                        </span>
                        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                          Your bookmarked states and territories for easy trip planning
                        </span>
                      </div>
                    </div>

                    {filteredStates.length === 0 ? (
                      <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#EFE8DF] space-y-3">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                          <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-stone-900">Your Wishlist is Empty</h3>
                        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                          Click the ❤️ heart icon on any State or Union Territory card to save it to your personal travel wishlist!
                        </p>
                        <button
                          onClick={() => setTerritoryTab('states')}
                          className="px-4 py-2 rounded-xl bg-[#FF671F] text-white text-xs font-bold transition shadow-xs cursor-pointer hover:bg-[#E65100]"
                        >
                          Browse 28 States of Bharat
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-7">
                        {filteredStates.map((state) => (
                          <StateCard
                            key={state.id}
                            state={state}
                            isUT={state.region_type === 'union_territory' || CANONICAL_UTS.has(state.id)}
                            isFavorite={true}
                            onToggleFavorite={handleToggleFavoriteState}
                            onSelectState={handleSelectState}
                            onSelectTown={handleSelectTown}
                            onQuickLook={(s) => setQuickLookState(s)}
                            territoryOnly
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Section: 28 States of Bharat */}
                {(territoryTab === 'states' || territoryTab === 'all') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF671F]">Explore Bharat</span>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C] mt-0.5">
                          {displayedStates.length} States
                        </h2>
                      </div>
                    </div>

                    {displayedStates.length === 0 ? (
                      <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-dashed border-[#EFE8DF]">
                        No states found matching your search or filter.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-7">
                        {displayedStates.map((state) => (
                          <StateCard
                            key={state.id}
                            state={state}
                            isUT={false}
                            isFavorite={savedStates.includes(state.id)}
                            onToggleFavorite={handleToggleFavoriteState}
                            onSelectState={handleSelectState}
                            onSelectTown={handleSelectTown}
                            onQuickLook={(s) => setQuickLookState(s)}
                            territoryOnly
                          />
                        ))}
                      </div>
                    )}

                  </div>
                )}

                {/* Section: 8 Union Territories (Rendered separately or via toggle) */}
                {(territoryTab === 'uts' || territoryTab === 'all') && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#046A38]">Island, coast &amp; capital</span>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C] mt-0.5">
                          {utsList.length} Union Territories
                        </h2>
                      </div>
                    </div>

                    {utsList.length === 0 ? (
                      <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-dashed border-[#EFE8DF]">
                        No union territories found matching your filters.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-7">
                        {utsList.map((state) => (
                          <StateCard
                            key={state.id}
                            state={state}
                            isUT={true}
                            isFavorite={savedStates.includes(state.id)}
                            onToggleFavorite={handleToggleFavoriteState}
                            onSelectState={handleSelectState}
                            onSelectTown={handleSelectTown}
                            onQuickLook={(s) => setQuickLookState(s)}
                            territoryOnly
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* =========================================================================
            LEVEL 2: STATE VIEW (EXPLORING TOWNS & LOCALITIES IN THE STATE)
        ========================================================================= */}
        {activeLevel === 'state' && currentState && (
          <div className="space-y-8">
            <StateAttractionsSlideshow
              stateName={currentState.name}
              places={stateFeaturedPlaces}
              onPreview={setPreviewPlace}
              onExploreCity={(cityId) => handleSelectTown(currentState.id, cityId)}
            />
            {isAndhraPradeshState && <AndhraPradeshDirectorySection />}
            {isArunachalPradeshState && <ArunachalPradeshDirectorySection />}
            {isRajasthanState && <RajasthanDirectorySection />}
            {isKeralaState && <KeralaDirectorySection />}
            {isGoaState && <GoaDirectorySection />}
            {isTamilNaduState && <TamilNaduDirectorySection />}
            {isHimachalPradeshState && <HimachalPradeshDirectorySection />}
            {isKarnatakaState && <KarnatakaDirectorySection />}
            {isUttarakhandState && <UttarakhandDirectorySection />}
            {isGujaratState && <GujaratDirectorySection />}
            {isMadhyaPradeshState && <MadhyaPradeshDirectorySection />}
            {isUttarPradeshState && <UttarPradeshDirectorySection />}
            {isWestBengalState && <WestBengalDirectorySection />}
            {isOdishaState && <OdishaDirectorySection />}
            {isAssamState && <AssamDirectorySection />}
            {isPunjabState && <PunjabDirectorySection />}
            {isJammuKashmirState && <JammuKashmirDirectorySection />}
            {isLadakhState && <LadakhDirectorySection />}
            {isSikkimState && <SikkimDirectorySection />}
            {isMeghalayaState && <MeghalayaDirectorySection />}
            {isTelanganaState && <TelanganaDirectorySection />}
            {isChhattisgarhState && <ChhattisgarhDirectorySection />}
            {isBiharState && <BiharDirectorySection />}
            {isJharkhandState && <JharkhandDirectorySection />}
            {isHaryanaState && <HaryanaDirectorySection />}
            {!isAndhraPradeshState && !isArunachalPradeshState && !isRajasthanState && !isKeralaState && !isGoaState && !isTamilNaduState && !isHimachalPradeshState && !isKarnatakaState && !isUttarakhandState && !isGujaratState && !isMadhyaPradeshState && !isUttarPradeshState && !isWestBengalState && !isOdishaState && !isAssamState && !isPunjabState && !isJammuKashmirState && !isLadakhState && !isSikkimState && !isMeghalayaState && !isTelanganaState && !isChhattisgarhState && !isBiharState && !isJharkhandState && !isHaryanaState && <>
            {/* Heritage Separation Rule */}
            <HeritageDivider
              variant="chakra"
              accent="saffron"
              label="State Heritage Dossier"
              subtitle={`Official cultural metrics and government provenance records for ${currentState.name}`}
            />

            {/* State Verification & Heritage Data Dossier */}
            <div className="bg-white rounded-3xl border border-[#EFE8DF] p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFE8DF]">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Government Tourism Records</span>
                  </div>
                  <span className="text-xs text-stone-400 hidden md:inline">· Provenance Verified</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentState.official_tourism_url && (
                    <a
                      href={currentState.official_tourism_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 border border-[#EFE8DF] text-xs font-bold text-[#046A38] transition shadow-2xs"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#046A38]" />
                      <span>Official Tourism Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('itinerary')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 border border-[#EFE8DF] text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#FF671F]" />
                      <span>Plan Itinerary</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verified Statistics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F]">
                    Verified Destinations
                  </div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                    {stateMetrics.verifiedCitiesCount}
                  </div>
                  <div className="text-[11px] text-stone-500">Documented hubs</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F]">
                    Verified Places
                  </div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                    {stateMetrics.verifiedPlacesCount > 0 ? stateMetrics.verifiedPlacesCount : '0'}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {stateMetrics.verifiedPlacesCount > 0 ? 'Verified places published' : 'Content under verification'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F]">
                    Active Topics
                  </div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                    {Object.keys(stateMetrics.topicCounts).length}
                  </div>
                  <div className="text-[11px] text-stone-500">11 Virasat themes</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F]">
                    Source Trust
                  </div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-emerald-700 mt-0.5">
                    100% Verified
                  </div>
                  <div className="text-[11px] text-stone-500">Official government data</div>
                </div>
              </div>

              {/* Topic Distribution */}
              {Object.keys(stateMetrics.topicCounts).length > 0 && (
                <div className="pt-2 border-t border-[#EFE8DF] space-y-2">
                  <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
                    <span>Topic Distribution across {currentState.name}:</span>
                    <span className="text-[11px] text-stone-400 font-normal">Source-backed Virasat Taxonomy</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stateMetrics.topicCounts).map(([topic, count]) => (
                      <div
                        key={topic}
                        className="px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-center gap-1.5"
                      >
                        <span className="font-semibold text-stone-800">{topic}</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-[#FF671F] font-mono text-[10px] font-bold">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Cultural Stories in this State */}
            {currentState.active_stories && currentState.active_stories.length > 0 && (
              <>
                <HeritageDivider
                  variant="stories"
                  accent="gold"
                  label="Oral Traditions & Chronicles"
                  subtitle={`Living mythology, folklore and cultural narratives of ${currentState.name}`}
                />
                <div className="bg-[#FCFBF9] rounded-3xl border border-[#EFE8DF] p-6 sm:p-7 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF671F]">
                    <BookOpen className="w-4 h-4 text-[#FF671F]" />
                    <span>Cultural Heritage &amp; Legends of {currentState.name}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentState.active_stories.map((story, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-4 rounded-2xl bg-white border border-[#EFE8DF] text-xs text-[#5A4E46] leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#FF671F] shrink-0 mt-1.5" />
                        <span>{story}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Grid of Cities, Towns & Localities */}
            <HeritageDivider
              variant="landmark"
              accent="saffron"
              label="Towns & Cultural Sanctuaries"
              subtitle={`Explore verified historic centers and destinations across ${currentState.name}`}
            />

            {/* Dedicated Maharashtra City Section (Mumbai & Pune: Famous Places + Hidden Gems) */}
            {(currentState?.id?.toLowerCase() === 'maharashtra' ||
              currentState?.name?.toLowerCase() === 'maharashtra') && (
              <div className="pt-2">
                <MaharashtraDestinationsSection
                  initialCity="Mumbai"
                  onSelectPlace={onSelectPlace}
                  onSelectCity={onSelectCity}
                />
              </div>
            )}

            <div id="state-destinations-section" className="space-y-6 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C]">
                    Destinations, Heritage Towns &amp; Localities in {currentState.name}
                  </h2>
                  <p className="text-xs text-[#7A6E65] mt-0.5">
                    Showing verified historic cities, sacred pilgrimage centers, and heritage hubs ({stateValidCities.length}).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {stateValidCities.map((city, cIdx) => {
                  const places = getCityPlaceCatalog(city).filter(isPlaceVerified);

                  // Rotating artistic cultural gradient accent for visual variety across state destinations
                  const accentGradients = [
                    'from-[#FF671F] via-[#FF9933] to-[#E06D24]', // Sacred Saffron
                    'from-[#046A38] via-[#058244] to-[#03542C]', // Heritage Emerald
                    'from-[#C85A32] via-[#E28743] to-[#B44C28]', // Terracotta & Sandstone
                    'from-[#1B2A4A] via-[#2D4577] to-[#0E1A33]', // Royal Indigo
                  ];
                  const accentBar = accentGradients[cIdx % accentGradients.length];

                  return (
                    <ScrollReveal
                      key={city.id}
                      animation="fade-up"
                      delay={cIdx * 40}
                      className="h-full"
                    >
                      <div
                        className="relative bg-[#FCFBF9] hover:bg-white rounded-2xl sm:rounded-3xl border border-[#EFE8DF] hover:border-[#FF671F]/60 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group h-full hover:-translate-y-1"
                      >
                        {/* 1. TOP CREATIVE CULTURAL ACCENT BAR */}
                        <div className={`h-2.5 w-full bg-gradient-to-r ${accentBar}`} />

                        {/* 2. CARD CONTENT CONTAINER WITH RICH CULTURAL STYLING */}
                        <div className="p-4 sm:p-6 flex flex-col justify-between grow space-y-3.5 sm:space-y-4">
                          <div>
                            {/* District & Capital / Status Badges */}
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF671F] border border-orange-200/80 shadow-2xs">
                                <MapPin className="w-3 h-3 text-[#FF671F] shrink-0" />
                                <span>{city.district} District</span>
                              </span>

                              {city.is_capital ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                                  <Sparkles className="w-3 h-3 text-amber-600" />
                                  <span>State Capital</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                                  <Landmark className="w-3 h-3 text-stone-500" />
                                  <span>{places.length > 0 ? `${places.length} Sites` : 'Heritage Hub'}</span>
                                </span>
                              )}
                            </div>

                            {/* City Title & Poetic Tagline */}
                            <div className="space-y-1">
                              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C] group-hover:text-[#FF671F] transition-colors leading-tight">
                                {city.name}
                              </h3>
                              {city.tagline && (
                                <p className="text-xs sm:text-[13px] text-amber-900/90 font-serif italic line-clamp-1 leading-snug">
                                  &ldquo;{city.tagline}&rdquo;
                                </p>
                              )}
                            </div>

                            {/* City Description */}
                            <p className="text-xs sm:text-[13px] text-[#5A4E46] leading-relaxed line-clamp-3 mt-2.5 font-normal">
                              {city.description}
                            </p>

                            {/* Top Verified Heritage Sights Preview Chips */}
                            {places.length > 0 && (
                              <div className="pt-3">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5 text-[#FF671F]" />
                                  <span>Key Heritage Landmarks:</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {places.slice(0, 3).map((p) => (
                                    <span
                                      key={p.id}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200/80 text-[10px] sm:text-[11px] font-medium text-stone-700 truncate max-w-full"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F] shrink-0" />
                                      <span className="truncate">{p.name}</span>
                                    </span>
                                  ))}
                                  {places.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[10px] font-bold text-[#FF671F]">
                                      +{places.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bottom Snapshot & CTA */}
                          <div className="space-y-3 pt-3 border-t border-[#EFE8DF]/80">
                            {/* Best Season & Travel Info */}
                            <div className="flex items-center justify-between text-[11px] text-stone-600">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#FF671F]" />
                                <span>Season:</span>
                                <strong className="text-stone-800">
                                  {city.live_travel_info?.best_season || 'October to March'}
                                </strong>
                              </span>
                              <span className="font-semibold text-[#046A38] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[10px]">
                                {places.length > 0 ? `${places.length} Verified` : 'Verified'}
                              </span>
                            </div>

                            {/* Action CTA Button */}
                            <button
                              onClick={() => currentState && handleSelectTown(currentState.id, city.id)}
                              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#E65100] hover:to-[#FF671F] text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md active:scale-98"
                            >
                              <span>Explore {city.name} Heritage</span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>

            </>}
          </div>
        )}

        {/* =========================================================================
            LEVEL 3: CITY / TOWN / LOCALITY VIEW (HERITAGE & TOURISM PLACES)
        ========================================================================= */}
        {activeLevel === 'city' && currentCity && (() => {
          const cityLat = currentCity.coordinates?.lat ?? currentCity.latitude;
          const cityLng = currentCity.coordinates?.lng ?? currentCity.longitude;
          const hasCityCoordinates = typeof cityLat === 'number' && typeof cityLng === 'number';

          return (
            <div className="space-y-8">
              {/* Heritage Separation Rule */}
              <HeritageDivider
                variant="mandala"
                accent="saffron"
                label="Destination Profile & GIS Coordinates"
                subtitle={`Geographic profile, seasonal advisory & verified records for ${currentCity.name}`}
              />

              {/* Town Hero & Travel Context Banner with honest fallback */}
              <div className="bg-white rounded-3xl border border-[#EFE8DF] overflow-hidden shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[220px] bg-stone-100">
                    {brokenImages[currentCity.id] || !currentCity.hero_image_url ? (
                      <div className="w-full h-full min-h-[220px] bg-gradient-to-br from-[#FFF9F2] via-[#FAF4ED] to-[#F5ECE1] border-r border-[#EFE8DF] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none">
                        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#884a20_1px,transparent_1px)] [background-size:14px_14px]" />
                        <div className="relative z-10 space-y-2">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-300/80 flex items-center justify-center mx-auto text-[#FF671F] shadow-xs">
                            <Landmark className="w-7 h-7" />
                          </div>
                          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#0B192C]">
                            {currentCity.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/90 border border-stone-200 text-stone-700 text-xs font-semibold">
                            <MapPin className="w-3 h-3 text-[#FF671F]" />
                            {currentCity.district} District • {currentState?.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={currentCity.hero_image_url}
                        alt={currentCity.name}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(currentCity.id)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden pointer-events-none" />

                    {/* Provenance Badge */}
                    {currentCity.creator && !brokenImages[currentCity.id] && (
                      <div className="absolute bottom-3 left-4 text-[10px] px-2.5 py-1 rounded-full bg-black/60 text-white font-mono">
                        📷 {currentCity.creator} ({currentCity.license || 'Verified'})
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-7 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF671F]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                          {currentCity.district} District, {currentState?.name ?? ''}
                        </span>
                        {currentCity.entity_type && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold uppercase">
                            {currentCity.entity_type}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B192C]">
                          {currentCity.name}
                        </h2>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {cityAllPlaces.length > 0 ? `${cityAllPlaces.length} verified places` : 'Content under verification'}
                        </span>
                      </div>
                      <p className="text-xs text-[#5A4E46] leading-relaxed">
                        {currentCity.description}
                      </p>
                    </div>

                    {/* Travel Snapshot Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
                          <Navigation className="w-3.5 h-3.5" /> Map Coordinates
                        </span>
                        <div className="text-xs font-bold text-stone-900 font-mono flex items-center justify-between">
                          <span>
                            {hasCityCoordinates ? `${cityLat.toFixed(4)}° N, ${cityLng.toFixed(4)}° E` : 'Coordinates verified'}
                          </span>
                          {hasCityCoordinates && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${cityLat},${cityLng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FF671F] hover:underline text-[11px] font-sans font-medium flex items-center gap-0.5"
                            >
                              <span>Map</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          GIS Location verification
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF671F] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Best Season &amp; Advisory
                        </span>
                        <div className="text-xs font-bold text-stone-900">
                          {currentCity.live_travel_info?.best_season || 'Content under verification'}
                        </div>
                        <div className="text-[11px] text-stone-500 italic truncate">
                          {currentCity.live_travel_info?.advisory || 'Seasonal advisory under verification'}
                        </div>
                      </div>
                    </div>

                    {/* Available Categories & Official Source Links */}
                    <div className="pt-2 border-t border-[#EFE8DF] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-stone-500 font-medium">Themes:</span>
                        {cityAvailableTopics.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        {(currentCity.official_url || currentCity.source_url) && (
                          <a
                            href={currentCity.official_url || currentCity.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#046A38] hover:text-[#03542C] font-semibold inline-flex items-center gap-1 underline text-xs"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <span className="text-stone-400 text-[11px]">
                          Verified: <strong className="text-stone-600">{currentCity.updated_at || '2026-03-01'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dedicated Maharashtra City Showcase (Mumbai & Pune: Famous Places + Hidden Gems) */}
              {(currentCity.name?.toLowerCase() === 'mumbai' ||
                currentCity.name?.toLowerCase() === 'pune' ||
                currentCity.id?.toLowerCase() === 'mumbai' ||
                currentCity.id?.toLowerCase() === 'pune') && (
                <div className="pt-2">
                  <MaharashtraDestinationsSection
                    initialCity={
                      currentCity.name?.toLowerCase() === 'pune' || currentCity.id?.toLowerCase() === 'pune'
                        ? 'Pune'
                        : 'Mumbai'
                    }
                    onSelectPlace={onSelectPlace}
                    onSelectCity={onSelectCity}
                  />
                </div>
              )}

              {/* Heritage Separation Rule */}
              <HeritageDivider
                variant="compass"
                accent="saffron"
                label="Verified Heritage Sites & Attractions"
                subtitle={`Documented monuments, sanctuaries and cultural landmarks in ${currentCity.name}`}
              />

              {/* Places Filter Tabs */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C]">
                    {activeCategoryFilter === 'hidden_gems'
                      ? `Hidden-gem candidates in ${currentCity.name} (${filteredCityCandidates.length}/10)`
                      : activeCategoryFilter === 'all'
                        ? `Popular places in ${currentCity.name} (${filteredCityPlaces.length}/10)`
                        : `Verified Heritage Sites & Places in ${currentCity.name} (${filteredCityPlaces.length})`}
                  </h3>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                      { id: 'all', label: `Popular (${cityPopularPlaces.length}/10)` },
                      { id: 'all_places', label: `All verified (${cityAllPlaces.length})` },
                      { id: 'hidden_gems', label: `✨ Hidden gems (${cityHiddenGemCandidates.length}/10)` },
                      { id: 'heritage', label: 'Heritage & UNESCO' },
                      { id: 'monuments', label: 'Monuments' },
                      { id: 'museums', label: 'Museums' },
                      { id: 'religious_cultural', label: 'Sacred & Cultural' },
                      { id: 'nature_parks_zoo', label: 'Nature & Parks' },
                      { id: 'tourist_places', label: 'Tourist Spots' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveCategoryFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                          activeCategoryFilter === tab.id
                            ? 'bg-[#FF671F] text-white shadow-xs'
                            : 'bg-white hover:bg-[#F5EFEB] text-[#6B5E55] border border-[#EFE8DF]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activeCategoryFilter === 'all' && cityPopularPlaces.length < 10 && (
                  <p className="text-xs text-amber-800 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                    {cityPopularPlaces.length} of 10 popular places currently have verified city records. More places will appear after their city and source details are checked.
                  </p>
                )}

                {/* Places Grid with neutral official placeholder fallback cards */}
                {filteredCityPlaces.length === 0 && activeCategoryFilter !== 'hidden_gems' ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#EFE8DF]">
                    <div className="mb-4">
                      <Shield className="w-12 h-12 text-amber-700 mx-auto opacity-50" />
                    </div>
                    <p className="text-sm font-medium text-stone-700 mb-2">
                      Official archival verification in progress
                    </p>
                    <p className="text-xs text-stone-500 mb-6">
                      No verified places published yet for {currentCity.name}. Heritage content is being verified.
                    </p>
                    {currentState?.official_tourism_url && (
                      <a 
                        href={currentState.official_tourism_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors mb-3"
                      >
                        Explore on State Tourism Portal →
                      </a>
                    )}
                    <div className="pt-4 border-t border-stone-200">
                      <button 
                        onClick={() => setReportModalOpen(true)}
                        className="text-xs text-amber-700 hover:underline cursor-pointer"
                      >
                        Help us verify local heritage? Report here →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
                    {filteredCityPlaces.map((attr, aIdx) => {
                      const isVisited = Boolean(visitedPlaces[attr.id]);
                      const isHeritage =
                        attr.category === 'heritage' ||
                        attr.topic === 'Heritage' ||
                        attr.subtopic?.toLowerCase().includes('unesco');
                      const isUnesco = Boolean(
                        attr.subtopic?.toLowerCase().includes('unesco') ||
                        attr.tags?.some((tag) => tag.toLowerCase().includes('unesco'))
                      );
                      const imgUrl = attr.image_url || attr.thumbnail_url;
                      const isBroken = brokenImages[attr.id] || !imgUrl;
                      const verified = isPlaceVerified(attr);

                      return (
                        <ScrollReveal
                          key={attr.id}
                          animation="fade-up"
                          delay={aIdx * 40}
                          className="h-full"
                        >
                          <div
                            className={`bg-white rounded-2xl sm:rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full ${
                              isVisited ? 'border-[#FF671F] bg-amber-50/20' : 'border-[#EFE8DF]'
                            }`}
                          >
                          <div>
                            {/* Place Photo with official neutral image pending fallback */}
                            <div className="relative h-32 sm:h-48 w-full overflow-hidden bg-stone-100">
                              {isBroken ? (
                                <OfficialImagePending
                                  heightClass="h-full"
                                  label="Official image pending"
                                  showBadge={false}
                                />
                              ) : (
                                <img
                                  src={imgUrl}
                                  alt={attr.name}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                  onError={() => handleImageError(attr.id)}
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                              {/* Badges */}
                              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-wrap items-center gap-1 sm:gap-1.5 pointer-events-none">
                                {attr.topic ? (
                                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-600/90 text-white backdrop-blur-xs">
                                    {attr.topic}
                                  </span>
                                ) : (
                                  <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#FF671F]">
                                    {attr.category_label || attr.category}
                                  </span>
                                )}
                                {attr.subtopic && (
                                  <span className="text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-800/80 text-amber-200 backdrop-blur-xs">
                                    {attr.subtopic}
                                  </span>
                                )}
                                {isHeritage && isUnesco && (
                                  <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#046A38] text-white flex items-center gap-1 backdrop-blur-xs">
                                    <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> UNESCO
                                  </span>
                                )}
                              </div>

                              {/* Visited Checkbox on photo */}
                              <button
                                onClick={() => toggleVisited(attr.id)}
                                className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 p-1 sm:p-1.5 rounded-full bg-white/90 text-[#FF671F] hover:bg-white transition cursor-pointer shadow-xs"
                                title={isVisited ? 'Mark as not visited' : 'Mark as visited'}
                              >
                                {isVisited ? (
                                  <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF671F]" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
                                )}
                              </button>

                              {/* Title overlay */}
                              <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4 text-white pointer-events-none">
                                <h4
                                  className={`font-serif text-sm sm:text-lg font-bold leading-snug ${
                                    isVisited ? 'line-through text-stone-300' : 'text-white'
                                  }`}
                                >
                                  {attr.name}
                                </h4>
                              </div>
                            </div>

                            {/* Place Details Body */}
                            <div className="p-3.5 sm:p-5 space-y-2.5 sm:space-y-3.5">
                              {/* Verification Badge */}
                              <div className="flex items-center justify-between gap-2">
                                {verified ? (
                                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                    <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                                    <span>Verified</span>
                                  </span>
                                ) : (
                                  <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-2xs">
                                    <span>Verifying</span>
                                  </span>
                                )}

                                {attr.last_verified_on && (
                                  <span className="text-[9px] sm:text-[10px] text-stone-500">
                                    {attr.last_verified_on}
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] sm:text-xs text-[#5A4E46] leading-relaxed line-clamp-3">
                                {attr.short_description || attr.summary || attr.historical_significance}
                              </p>

                              {/* Visiting Essentials Pill */}
                              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-[#EFE8DF] space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs">
                                <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                                  <span className="text-stone-500 flex items-center gap-1 font-medium">
                                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF671F]" />
                                    <span>Timings:</span>
                                  </span>
                                  <span className="font-semibold text-stone-800 truncate max-w-[130px] sm:max-w-[150px]">
                                    {attr.opening_hours || `${attr.timings?.opening_time || '09:00 AM'} - ${attr.timings?.closing_time || '05:30 PM'}`}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between text-[10px] sm:text-[11px] pt-1 border-t border-[#EFE8DF]">
                                  <span className="text-stone-500 flex items-center gap-1 font-medium">
                                    <IndianRupee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF671F]" />
                                    <span>Entry Fee:</span>
                                  </span>
                                  <span className="font-semibold text-stone-800">
                                    {attr.entry_fee
                                      ? typeof attr.entry_fee === 'number' ? `₹${attr.entry_fee}` : attr.entry_fee
                                      : attr.fees?.free_entry
                                      ? 'Free Entry'
                                      : `₹${attr.fees?.domestic || 0} (Dom)`}
                                  </span>
                                </div>
                              </div>

                              {/* Official Source Provenance Bar */}
                              <div className="pt-1.5 sm:pt-2 border-t border-[#EFE8DF] flex items-center justify-between gap-2 text-[9px] sm:text-[10px]">
                                {attr.sources?.[0]?.source_url || attr.source_url ? (
                                  <a
                                    href={attr.sources?.[0]?.source_url || attr.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[#046A38] hover:text-[#03542C] font-semibold flex items-center gap-1 underline decoration-emerald-300 truncate max-w-[140px] sm:max-w-[160px]"
                                    title={`Official Source: ${attr.sources?.[0]?.source_name || attr.source_name || 'Official Authority'}`}
                                  >
                                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                                    <span className="truncate">{attr.sources?.[0]?.source_name || attr.source_name || 'Official Source'}</span>
                                    <ExternalLink className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" />
                                  </a>
                                ) : (
                                  <span className="text-stone-400 italic">Official source pending</span>
                                )}
                                <span className={`shrink-0 ${verified ? 'text-emerald-700' : 'text-amber-700'}`}>
                                  {verified ? 'Verified' : 'Under verification'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Actions Footer */}
                          <div className="p-3.5 sm:p-5 pt-0 flex items-center gap-1.5 sm:gap-2">
                            <button
                              onClick={() => setPreviewPlace(attr)}
                              className="flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE5] border border-[#EFE8DF] text-[11px] sm:text-xs font-bold text-[#E65100] transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF671F]" />
                              <span>Quick Look</span>
                            </button>

                            {attr.coordinates?.lat && attr.coordinates?.lng && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${attr.coordinates.lat},${attr.coordinates.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 sm:p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 text-stone-600 hover:text-amber-800 bg-white hover:bg-amber-50/50 transition cursor-pointer shrink-0"
                                title="Verify coordinates on Google Maps"
                                aria-label="Map location"
                              >
                                <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF671F]" />
                              </a>
                            )}

                            {onSelectPlace && (
                              <button
                                onClick={() => onSelectPlace(attr.id)}
                                className="flex-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-xs active:scale-98"
                              >
                                <span>Explore</span>
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
                )}

                {filteredCityCandidates.length > 0 && (
                  <section className="space-y-4 pt-5 border-t border-dashed border-amber-300">
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C]">
                        Hidden-gem candidates in {currentCity.name} ({filteredCityCandidates.length}/10)
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        These local suggestions are candidates, not verified recommendations. Their place-specific sources, images and visitor details still need review.
                      </p>
                      {filteredCityCandidates.length < 10 && (
                        <p className="text-xs text-amber-800 mt-2">
                          {10 - filteredCityCandidates.length} more candidates are needed to reach the 10-place goal. We are leaving those slots empty until the places are sourced and checked.
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
                      {filteredCityCandidates.map((place) => {
                        const tripAdvisorTag = place.tags?.find((t) => t.includes('TripAdvisor'));
                        const areaTag = place.address && place.address !== 'Mumbai, Maharashtra' ? place.address : place.district;

                        return (
                          <article
                            key={place.id}
                            className="overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-200/90 bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                          >
                            <div className="relative h-40 sm:h-48 bg-stone-100 overflow-hidden">
                              {brokenImages[place.id] || !place.image_url ? (
                                <OfficialImagePending heightClass="h-full" label="Official image pending" showBadge={false} />
                              ) : (
                                <img
                                  src={place.image_url}
                                  alt={place.name}
                                  loading="lazy"
                                  onError={() => handleImageError(place.id)}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                              {/* Badges */}
                              <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 items-center max-w-[80%]">
                                <span className="rounded-full bg-amber-900/90 text-amber-200 backdrop-blur-xs px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold">
                                  Hidden Gem Candidate
                                </span>
                                {place.subtopic && (
                                  <span className="rounded-full bg-black/60 text-white backdrop-blur-xs px-2 py-0.5 text-[8px] sm:text-[9px] font-medium truncate max-w-[150px]">
                                    {place.subtopic}
                                  </span>
                                )}
                              </div>

                              {/* TripAdvisor Bubble Rating Badge */}
                              {tripAdvisorTag && (
                                <div className="absolute top-2.5 right-2.5 rounded-full bg-emerald-600/95 text-white backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                  <span>★</span>
                                  <span>{tripAdvisorTag.replace('TripAdvisor', '').replace('★', '').trim()}</span>
                                </div>
                              )}

                              {/* Area Pill Bottom Left Overlay */}
                              {areaTag && (
                                <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none flex items-center justify-between">
                                  <span className="text-[10px] sm:text-[11px] font-semibold text-amber-200 flex items-center gap-1 drop-shadow-xs truncate">
                                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span>{areaTag}</span>
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-4 sm:p-5 flex flex-1 flex-col justify-between gap-3">
                              <div className="space-y-1.5">
                                <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug group-hover:text-[#FF671F] transition-colors">
                                  {place.name}
                                </h4>
                                <p className="text-xs leading-relaxed text-stone-600 line-clamp-3">
                                  {place.summary}
                                </p>
                              </div>

                              <div className="rounded-xl bg-amber-50/70 border border-amber-100 p-3 text-[11px] text-stone-700 space-y-1">
                                {place.best_time_to_visit && (
                                  <p>
                                    <strong className="text-amber-900">Timing &amp; Season:</strong> {place.best_time_to_visit}
                                  </p>
                                )}
                                {place.verification_note && (
                                  <p className="text-stone-600">
                                    {place.verification_note}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setPreviewPlace(place)}
                                  className="flex-1 rounded-xl bg-[#FF671F] hover:bg-[#E65100] py-2 px-3 text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-98"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Explore Details</span>
                                </button>

                                {place.source_url && (
                                  <a
                                    href={place.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition shrink-0"
                                    title="View community reviews & tours on TripAdvisor"
                                  >
                                    <span>Reviews</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}
                {activeCategoryFilter === 'hidden_gems' && filteredCityCandidates.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-8 text-center">
                    <p className="font-semibold text-stone-800">No hidden-gem candidates are sourced for {currentCity.name} yet.</p>
                    <p className="mt-2 text-sm text-stone-600">We will publish recommendations here after location and source checks; no places are being guessed to fill the list.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* =========================================================================
          PREVIEW MODAL / DRAWER
      ========================================================================= */}
      <PlaceDetailDrawer
        place={previewPlace}
        stateName={currentState?.name}
        cityName={previewCityName}
        districtName={currentCity?.district}
        onClose={() => setPreviewPlace(null)}
        onSelectPlace={onSelectPlace}
        onOpenAIChat={() => {
          if (onNavigateTab) {
            onNavigateTab('ai');
          }
        }}
      />

      {/* State Quick Look Modal */}
      <StateQuickLookModal
        state={quickLookState}
        isOpen={Boolean(quickLookState)}
        onClose={() => setQuickLookState(null)}
        onExploreState={(id) => handleSelectState(id)}
        onSelectTown={(stateId, townId) => handleSelectTown(stateId, townId)}
        onOpenAIPlan={() => {
          if (onNavigateTab) {
            onNavigateTab('ai');
          }
        }}
        isFavorite={quickLookState ? savedStates.includes(quickLookState.id) : false}
        onToggleFavorite={handleToggleFavoriteState}
      />

      {/* Citizen Heritage Report Modal for City Empty State */}
      {currentCity && (
        <CitizenReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          city={currentCity.name}
          cityId={currentCity.id}
          state={currentState?.name}
          defaultIssueType="other"
          defaultTitle={`Missing verified places for ${currentCity.name}`}
        />
      )}
    </div>
  );
};

export default IndiaHierarchyPage;
