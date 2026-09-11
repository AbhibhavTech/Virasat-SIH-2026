import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Award,
  ArrowRight,
  Clock,
  ShieldCheck,
  Eye,
  Crosshair,
  Landmark,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  IndiaHierarchyDatabase,
  AttractionEntity,
} from '../../types/indiaHierarchy';
import {
  haversineDistanceKm,
  formatDistanceKm,
  estimateTravelTime,
  calculateEstimatedVisitMinutes,
  formatEstimatedVisitMinutes,
  POPULAR_HERITAGE_HUBS,
  HeritageHubPreset,
} from '../../utils/geoUtils';
import { OfficialImagePending } from '../common/OfficialImagePending';

export interface NearbyAttractionItem {
  place: AttractionEntity;
  stateId: string;
  stateName: string;
  cityId: string;
  cityName: string;
  district: string;
  distanceKm: number;
  driveTimeFormatted: string;
  estimatedVisitMinutes: number;
  estimatedVisitFormatted: string;
}

export interface RecommendedPlacesNearYouProps {
  /** Optional preloaded India hierarchy database; will fetch automatically if omitted */
  db?: IndiaHierarchyDatabase | null;
  /** Optional external user coordinates */
  userCoords?: { lat: number; lng: number } | null;
  /** Optional location name label */
  locationName?: string;
  /** Optional location detection status */
  locationStatus?: 'idle' | 'detecting' | 'detected' | 'denied' | 'custom';
  /** Active search radius in km (0 for all India) */
  radiusFilter?: number;
  /** Callback to trigger browser geolocation */
  onDetectLocation?: () => void;
  /** Callback when user selects a heritage hub */
  onSelectHub?: (hub: { name: string; state: string; lat: number; lng: number }) => void;
  /** Callback when search radius is updated */
  onSetRadiusFilter?: (radius: number) => void;
  /** Callback when user selects a place */
  onSelectPlace?: (place: AttractionEntity, stateId: string, cityId: string) => void;
  /** Callback for 'View All' linking directly to the corresponding filter in Discover Bharat */
  onViewAll?: () => void;
  /** Alias for onViewAll */
  onViewAllNearMe?: () => void;
  /** Map of broken images */
  brokenImages?: Record<string, boolean>;
  /** Callback when an image fails to load */
  onImageError?: (id: string) => void;
}

export const RecommendedPlacesNearYou: React.FC<RecommendedPlacesNearYouProps> = ({
  db: propDb,
  userCoords: propUserCoords,
  locationName: propLocationName,
  locationStatus: propLocationStatus,
  radiusFilter: propRadiusFilter = 50,
  onDetectLocation: propOnDetectLocation,
  onSelectHub: propOnSelectHub,
  onSetRadiusFilter: propOnSetRadiusFilter,
  onSelectPlace,
  onViewAll,
  onViewAllNearMe,
  brokenImages: propBrokenImages,
  onImageError: propOnImageError,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Internal state fallback if props not provided
  const [internalDb, setInternalDb] = useState<IndiaHierarchyDatabase | null>(null);
  const [internalCoords, setInternalCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [internalLocationName, setInternalLocationName] = useState<string>('Delhi NCR (Heritage Hub)');
  const [internalStatus, setInternalStatus] = useState<'idle' | 'detecting' | 'detected' | 'denied' | 'custom'>('custom');
  const [internalRadius, setInternalRadius] = useState<number>(propRadiusFilter);
  const [internalBrokenImages, setInternalBrokenImages] = useState<Record<string, boolean>>({});
  const watchIdRef = useRef<number | null>(null);

  const db = propDb ?? internalDb;
  const userCoords = propUserCoords !== undefined ? propUserCoords : internalCoords;
  const locationName = propLocationName ?? internalLocationName;
  const locationStatus = propLocationStatus ?? internalStatus;
  const radiusFilter = propRadiusFilter ?? internalRadius;
  const brokenImages = propBrokenImages ?? internalBrokenImages;

  // Fetch hierarchy DB if not provided
  useEffect(() => {
    if (!propDb && !internalDb) {
      fetch('/api/india-hierarchy')
        .then((res) => (res.ok ? res.json() : null))
        .then((data: IndiaHierarchyDatabase | null) => {
          if (data) setInternalDb(data);
        })
        .catch((err) => console.warn('RecommendedPlacesNearYou fetch error:', err));
    }
  }, [propDb, internalDb]);

  // Clean up geolocation watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // Request real-time browser geolocation
  const handleDetectBrowserLocation = () => {
    if (propOnDetectLocation) {
      propOnDetectLocation();
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setInternalStatus('denied');
      return;
    }

    setInternalStatus('detecting');

    // Clear previous watch if active
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // High accuracy single prompt first
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setInternalCoords(coords);
        setInternalLocationName('Current Geolocation');
        setInternalStatus('detected');

        // Start watching position for continuous real-time distance updates
        try {
          watchIdRef.current = navigator.geolocation.watchPosition(
            (watchPos) => {
              setInternalCoords({
                lat: watchPos.coords.latitude,
                lng: watchPos.coords.longitude,
              });
              setInternalStatus('detected');
            },
            (err) => console.warn('Geolocation live watch issue:', err.message),
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
          );
        } catch (e) {
          console.warn('watchPosition not supported:', e);
        }
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err.message);
        setInternalStatus('denied');
        if (!internalCoords) {
          setInternalCoords({ lat: 28.6139, lng: 77.209 });
          setInternalLocationName('Delhi NCR (Heritage Hub)');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  const handleHubSelect = (hub: HeritageHubPreset) => {
    // If switching to preset hub, clear live geolocation watch
    if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (propOnSelectHub) {
      propOnSelectHub({ name: hub.name, state: hub.state, lat: hub.lat, lng: hub.lng });
    } else {
      setInternalCoords({ lat: hub.lat, lng: hub.lng });
      setInternalLocationName(`${hub.name}, ${hub.state}`);
      setInternalStatus('custom');
    }
  };

  const handleRadiusChange = (val: number) => {
    if (propOnSetRadiusFilter) {
      propOnSetRadiusFilter(val);
    } else {
      setInternalRadius(val);
    }
  };

  const handleImageFail = (id: string) => {
    if (propOnImageError) {
      propOnImageError(id);
    } else {
      setInternalBrokenImages((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else if (onViewAllNearMe) {
      onViewAllNearMe();
    }
  };

  // Active coordinates (fallback to Delhi NCR if null)
  const activeCoords = useMemo(() => {
    if (userCoords && userCoords.lat && userCoords.lng) {
      return userCoords;
    }
    return { lat: 28.6139, lng: 77.209 };
  }, [userCoords]);

  // Scroll carousel controls
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 340;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Extract, calculate distance, and rank nearby heritage sites
  const rankedPlaces: NearbyAttractionItem[] = useMemo(() => {
    if (!db || !db.states) return [];

    const items: NearbyAttractionItem[] = [];

    for (const state of db.states) {
      for (const city of state.cities || []) {
        const rawPlaces = [
          ...(city.heritage || []),
          ...(city.monuments || []),
          ...(city.museums || []),
          ...(city.tourist_places || []),
          ...(city.religious_cultural || []),
          ...(city.nature_parks_zoo || []),
        ];

        for (const p of rawPlaces) {
          const isVerified =
            p.verification_status === 'verified' || p.status === 'VERIFIED';
          if (!isVerified) continue;

          let pLat = p.coordinates?.lat;
          let pLng = p.coordinates?.lng;

          // Fallback to city coordinates if attraction coordinates are zero/missing
          if (!pLat || !pLng || (pLat === 0 && pLng === 0)) {
            if (city.coordinates && (city.coordinates.lat || city.coordinates.lng)) {
              pLat = city.coordinates.lat;
              pLng = city.coordinates.lng;
            }
          }

          if (!pLat || !pLng || (pLat === 0 && pLng === 0)) continue;

          const dist = haversineDistanceKm(
            activeCoords.lat,
            activeCoords.lng,
            pLat,
            pLng
          );

          if (radiusFilter > 0 && dist > radiusFilter) continue;

          const estVisitMins = calculateEstimatedVisitMinutes(p);

          items.push({
            place: p,
            stateId: state.id,
            stateName: state.name,
            cityId: city.id,
            cityName: city.name,
            district: city.district || city.name,
            distanceKm: dist,
            driveTimeFormatted: estimateTravelTime(dist),
            estimatedVisitMinutes: estVisitMins,
            estimatedVisitFormatted: formatEstimatedVisitMinutes(estVisitMins),
          });
        }
      }
    }

    // Sort by proximity ascending with slight boost for UNESCO sites
    items.sort((a, b) => {
      const isAUnesco =
        a.place.tags?.some((t) => t.toLowerCase().includes('unesco')) ||
        a.place.subtopic?.toLowerCase().includes('unesco');
      const isBUnesco =
        b.place.tags?.some((t) => t.toLowerCase().includes('unesco')) ||
        b.place.subtopic?.toLowerCase().includes('unesco');

      const scoreA = a.distanceKm - (isAUnesco ? 12 : 0);
      const scoreB = b.distanceKm - (isBUnesco ? 12 : 0);
      return scoreA - scoreB;
    });

    return items;
  }, [db, activeCoords, radiusFilter]);

  const topRecommendations = useMemo(() => {
    return rankedPlaces.slice(0, 10);
  }, [rankedPlaces]);

  return (
    <section
      id="recommended-places-near-you"
      aria-label="Recommended Places Near You"
      className="bg-gradient-to-br from-[#FFFBF7] via-white to-[#FDF8F3] rounded-3xl border border-[#EFE8DF] p-6 sm:p-8 shadow-xs relative overflow-hidden space-y-6"
    >
      {/* Subtle geometric motif in background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(#FF671F_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-[0.07] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-orange-100/40 blur-2xl pointer-events-none" />

      {/* Header & Geolocation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF671F]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF671F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF671F]"></span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live Geolocation Radar
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B192C] tracking-tight">
            Recommended Places Near You
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E55] max-w-2xl leading-relaxed">
            Utilizing browser geolocation to uncover local heritage landmarks, sacred architecture, and historic monuments near your coordinates in Bharat.
          </p>
        </div>

        {/* Location Detection & Hub Switcher Bar */}
        <div className="flex flex-wrap items-center gap-2.5 p-2 rounded-2xl bg-white/90 border border-[#E7DFD5] shadow-2xs backdrop-blur-xs">
          {/* Active Origin Display */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#EFE8DF]">
            <MapPin className="w-4 h-4 text-[#FF671F] shrink-0" />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-[#A09388]">Active Origin</span>
                {locationStatus === 'detected' && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live GPS
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-[#0B192C] truncate max-w-[170px] sm:max-w-[210px]">
                {locationStatus === 'detected'
                  ? `Live (${activeCoords.lat.toFixed(2)}°N, ${activeCoords.lng.toFixed(2)}°E)`
                  : (locationName || 'Delhi NCR, Bharat')}
              </span>
            </div>
          </div>

          {/* Browser Geolocation API Trigger */}
          <button
            onClick={handleDetectBrowserLocation}
            disabled={locationStatus === 'detecting'}
            className="px-3 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
            title="Fetch local heritage sites using browser geolocation API"
          >
            <Crosshair className={`w-3.5 h-3.5 ${locationStatus === 'detecting' ? 'animate-spin' : ''}`} />
            <span>{locationStatus === 'detecting' ? 'Locating...' : 'Locate Me'}</span>
          </button>

          {/* Heritage Hub Quick Selector */}
          <div className="relative">
            <select
              aria-label="Select Heritage Hub"
              onChange={(e) => {
                const hub = POPULAR_HERITAGE_HUBS.find((h) => h.id === e.target.value);
                if (hub) handleHubSelect(hub);
              }}
              className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] text-stone-700 border border-[#D5C7B8] text-xs font-semibold focus:outline-none focus:border-[#FF671F] transition cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                Switch Hub...
              </option>
              {POPULAR_HERITAGE_HUBS.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name} ({hub.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Geolocation Status Banner (if denied) */}
      {locationStatus === 'denied' && (
        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Browser geolocation was declined or timed out. Defaulted to Delhi NCR hub. You can pick any Indian heritage hub above or click &quot;Locate Me&quot; to re-prompt.
            </span>
          </div>
        </div>
      )}

      {/* Radius Filters & Count Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-[#EFE8DF]/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-[#7A6E65] uppercase tracking-wider mr-1 shrink-0">
            Radius:
          </span>
          {[
            { label: '< 25 km (Local)', value: 25 },
            { label: '< 50 km (Day Trip)', value: 50 },
            { label: '< 150 km (Circuit)', value: 150 },
            { label: '< 300 km (Regional)', value: 300 },
            { label: 'All Bharat', value: 0 },
          ].map((pill) => (
            <button
              key={pill.label}
              onClick={() => handleRadiusChange(pill.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                radiusFilter === pill.value
                  ? 'bg-[#FF671F] text-white shadow-2xs font-bold'
                  : 'bg-white hover:bg-[#FAF8F5] text-[#6B5E55] border border-[#EFE8DF]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#7A6E65] font-medium hidden sm:block">
          Showing closest <strong>{topRecommendations.length}</strong> of <strong>{rankedPlaces.length}</strong> verified sites
        </div>
      </div>

      {/* Local Heritage Sites Carousel / Grid */}
      <div className="relative">
        {/* Navigation Arrows */}
        {topRecommendations.length > 3 && (
          <div className="hidden sm:flex items-center gap-1.5 absolute -top-12 right-0 z-10">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-[#EFE8DF] text-stone-700 transition shadow-2xs cursor-pointer hover:border-[#FF671F]"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-[#EFE8DF] text-stone-700 transition shadow-2xs cursor-pointer hover:border-[#FF671F]"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {topRecommendations.length === 0 ? (
          <div className="py-12 px-6 text-center rounded-2xl bg-white border border-dashed border-[#EFE8DF] space-y-3">
            <Landmark className="w-10 h-10 text-stone-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-800">
                No verified monuments found within {radiusFilter} km of {locationName}
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Try expanding your search radius or selecting one of our popular heritage hubs above to discover nearby treasures.
              </p>
            </div>
            <button
              onClick={() => handleRadiusChange(150)}
              className="px-4 py-2 rounded-xl bg-[#FF671F] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Expand to 150 km Radius
            </button>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {topRecommendations.map((item) => {
              const {
                place,
                stateId,
                cityId,
                cityName,
                stateName,
                distanceKm,
                driveTimeFormatted,
                estimatedVisitMinutes,
              } = item;
              const imgUrl = place.image_url || place.thumbnail_url;
              const isBroken = brokenImages[place.id] || !imgUrl;
              const isHeritage =
                place.category === 'heritage' ||
                place.topic === 'Heritage' ||
                place.subtopic?.toLowerCase().includes('unesco');

              return (
                <div
                  key={`rec-${stateId}-${cityId}-${place.id}`}
                  className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-white rounded-2xl border border-[#EFE8DF] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Photo Banner with Proximity Tag */}
                  <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                    {isBroken ? (
                      <OfficialImagePending
                        heightClass="h-full"
                        label="Official Image Pending"
                        showBadge={false}
                      />
                    ) : (
                      <img
                        src={imgUrl}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => handleImageFail(place.id)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Real-Time Distance & Estimated Time to Visit Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none max-w-[calc(100%-80px)]">
                      <div
                        id={`distance-badge-overlay-${place.id}`}
                        className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FF671F] text-white backdrop-blur-xs flex items-center gap-1.5 shadow-md border border-white/20 shrink-0"
                        title={`Real-time distance: ${distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km from your current geolocation`}
                      >
                        <Navigation className="w-3 h-3 text-white shrink-0 animate-pulse" />
                        <span>{distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km</span>
                      </div>

                      {/* Estimated time to visit badge next to distance badge */}
                      <div
                        id={`visit-duration-overlay-${place.id}`}
                        className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-950/85 text-amber-300 backdrop-blur-md flex items-center gap-1 shadow-md border border-white/20 shrink-0"
                        title={`Estimated time to visit: ${estimatedVisitMinutes} minutes based on average site traversal`}
                      >
                        <Clock className="w-3 h-3 text-amber-300 shrink-0" />
                        <span>{estimatedVisitMinutes} mins to visit</span>
                      </div>
                    </div>

                    {/* UNESCO Badge */}
                    {isHeritage && (
                      <div className="absolute top-3 right-3 pointer-events-none">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#046A38] text-white flex items-center gap-1 backdrop-blur-xs">
                          <Award className="w-2.5 h-2.5" /> UNESCO
                        </span>
                      </div>
                    )}

                    {/* Card Title Overlay */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                      <h3 className="font-serif text-base font-bold text-white leading-tight truncate">
                        {place.name}
                      </h3>
                      <div className="text-[11px] text-stone-200 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#FF671F]" />
                        <span>
                          {cityName}, {stateName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex flex-col justify-between grow">
                    <p className="text-xs text-[#5A4E46] line-clamp-2 leading-relaxed">
                      {place.summary || place.short_description || 'Verified landmark in Discover Bharat heritage directory.'}
                    </p>

                    {/* Real-time distance and estimated time to visit badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#EFE8DF]/70 text-[11px]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <div
                          id={`distance-badge-${place.id}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#E65100] font-bold border border-orange-200/90 shadow-2xs"
                          title={`Real-time distance from user geolocation: ${distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km`}
                        >
                          <Compass className="w-3 h-3 text-[#FF671F] shrink-0" />
                          <span>{distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km away</span>
                        </div>

                        <div
                          id={`visit-time-badge-${place.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200 shadow-2xs"
                          title={`Estimated time to visit: ${estimatedVisitMinutes} minutes based on average traversal time for this heritage site`}
                        >
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{estimatedVisitMinutes} mins to visit</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-stone-500 font-medium text-[11px] shrink-0" title="Estimated driving duration">
                        <Navigation className="w-3 h-3 text-stone-400" />
                        <span>Drive: {driveTimeFormatted}</span>
                      </div>
                    </div>

                    {/* Key Travel Indicators */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-stone-600 truncate">
                        <Clock className="w-3 h-3 text-[#FF671F] shrink-0" />
                        <span className="truncate">
                          {place.timings?.opening_time
                            ? `${place.timings.opening_time} - ${place.timings.closing_time}`
                            : 'Open Daily'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600 truncate">
                        <ShieldCheck className="w-3 h-3 text-[#046A38] shrink-0" />
                        <span className="truncate">ASI / Verified</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onSelectPlace?.(place, stateId, cityId)}
                        className="py-2 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] text-[#0B192C] border border-[#EFE8DF] text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-500" />
                        <span>Quick View</span>
                      </button>

                      <button
                        onClick={() => onSelectPlace?.(place, stateId, cityId)}
                        className="py-2 px-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <span>Explore Town</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Linking Directly to Discover Bharat Filter */}
      <div className="pt-2 border-t border-[#EFE8DF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-xs text-[#6B5E55] flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#046A38]" />
          <span>
            Explore all <strong>{rankedPlaces.length}</strong> verified heritage monuments near{' '}
            <strong>{locationName}</strong> in the Discover Bharat section.
          </span>
        </div>

        {/* The 'View All' button linking directly to the corresponding filter in Discover Bharat */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleViewAllClick}
            id="view-all-nearby-heritage-btn"
            className="px-5 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer group"
          >
            <span>View All ({rankedPlaces.length}) in Discover Bharat</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedPlacesNearYou;
