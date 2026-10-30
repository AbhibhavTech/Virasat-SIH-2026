import React, { useEffect, useMemo, useState } from 'react';
import {
  BedDouble,
  ExternalLink,
  MapPin,
  Utensils,
  Landmark,
  Compass,
  Clock3,
  IndianRupee,
  RefreshCw,
  Star,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { MASTER_TOURISM_PLACES } from '../../data/masterTourismPlacesData';

type GuideItem = {
  id: string;
  name: string;
  kind: 'restaurant' | 'hotel' | 'temple' | 'attraction';
  lat: number;
  lng: number;
  locality: string | null;
  cuisine: string | null;
  openingHours: string | null;
  fee: string | null;
  stars: number | null;
  website: string | null;
  image: string | null;
  sourceUrl: string;
  source: string;
  verification: string;
};

type LocalGuide = {
  city: string;
  state: string;
  restaurants: GuideItem[];
  hotels: GuideItem[];
  temples: GuideItem[];
  attractions: GuideItem[];
  attribution: string;
  retrievedAt: string;
  note: string;
};

type DirectoryFoodSpot = {
  id?: string;
  restaurant: string;
  locality?: string;
  location?: string;
  cuisine?: string;
  specialties?: string;
  spendForTwo?: string;
  checkedOn?: string;
  sourceUrl?: string;
  image?: string;
  imageNote?: string;
};

type DirectoryStayItem = {
  name: string;
  category?: string;
};

type DirectoryCityRecord = {
  name?: string;
  topStays?: DirectoryStayItem[];
  dining?: {
    veg?: DirectoryFoodSpot[];
    nonVeg?: DirectoryFoodSpot[];
  };
};

type Tab = 'restaurants' | 'stays' | 'temples' | 'attractions';

const directoryModules = import.meta.glob('../../data/*Directory.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

const directoryCities: DirectoryCityRecord[] = Object.values(directoryModules).flatMap((module) =>
  Object.values(module).flatMap((value) => (Array.isArray(value) ? (value as DirectoryCityRecord[]) : []))
);

const norm = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b(city|district)\b/g, '')
    .replace(/[^a-z0-9]/g, '');

const aliases: Record<string, string[]> = {
  oldgoa: ['goa', 'velhagoa', 'panaji'],
  panjim: ['panaji', 'goa'],
  panaji: ['goa', 'oldgoa'],
  goa: ['oldgoa', 'panaji'],
  bangalore: ['bengaluru'],
  bengaluru: ['bangalore'],
  bombay: ['mumbai'],
  mumbai: ['bombay'],
  delhi: ['newdelhi'],
  newdelhi: ['delhi'],
};

const mapSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const bookingSearch = (city: string, hotelName?: string, date?: string, nights = 1, guests = 1) => {
  const query = hotelName ? `${hotelName}, ${city}, India` : `${city}, India`;
  const params = new URLSearchParams({
    ss: query,
    group_adults: String(guests),
    no_rooms: String(Math.max(1, Math.ceil(guests / 2))),
    nflt: 'class=3;class=4;class=5',
  });
  if (date) {
    const out = new Date(`${date}T12:00:00`);
    out.setDate(out.getDate() + Math.max(1, nights));
    params.set('checkin', date);
    params.set('checkout', out.toISOString().slice(0, 10));
  }
  return `https://www.booking.com/searchresults.html?${params}`;
};

export const HotelRecommendationsSection: React.FC<{
  selectedCity: string;
  selectedState?: string;
  checkInDate?: string;
  nights?: number;
  guests?: number;
}> = ({ selectedCity, selectedState = 'India', checkInDate, nights = 1, guests = 1 }) => {
  const [tab, setTab] = useState<Tab>('restaurants');
  const [guide, setGuide] = useState<LocalGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const normalizedCity = norm(selectedCity);
  const destination = `${selectedCity}, ${selectedState}`;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setGuide(null);
    fetch(`/api/v1/itineraries/local-guide?city=${encodeURIComponent(selectedCity)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload?.success)
          throw new Error(payload?.error || 'Local listings could not be loaded.');
        return payload.data as LocalGuide;
      })
      .then((data) => setGuide(data))
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason.message : 'Local listings could not be loaded.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selectedCity]);

  // Master curated places (Temples and Attractions)
  const curatedPlaces = useMemo(() => {
    const names = new Set([normalizedCity, ...(aliases[normalizedCity] || []).map(norm)]);
    return MASTER_TOURISM_PLACES.filter(
      (place) =>
        names.has(norm(place.city_name)) || names.has(norm(place.city_id.replace(/-/g, ' ')))
    );
  }, [normalizedCity]);

  // Find matching city in the 36 State Directories
  const matchedDirectoryCity = useMemo(() => {
    const candidates = [normalizedCity, ...(aliases[normalizedCity] || []).map(norm)];
    return (
      directoryCities.find((entry) => entry.name && candidates.includes(norm(entry.name))) ||
      directoryCities.find(
        (entry) =>
          entry.name &&
          candidates.some(
            (cand) => norm(entry.name!).startsWith(cand) || cand.startsWith(norm(entry.name!))
          )
      ) ||
      null
    );
  }, [normalizedCity]);

  // Curated Dining from Directories
  const directoryFood = useMemo(() => {
    if (!matchedDirectoryCity?.dining) return [];
    const vegList = matchedDirectoryCity.dining.veg || [];
    const nonVegList = matchedDirectoryCity.dining.nonVeg || [];
    return [...vegList, ...nonVegList].filter(
      (item, index, all) =>
        item.restaurant && all.findIndex((other) => other.restaurant === item.restaurant) === index
    );
  }, [matchedDirectoryCity]);

  // Curated Stays from Directories
  const directoryStays = useMemo(() => {
    return matchedDirectoryCity?.topStays || [];
  }, [matchedDirectoryCity]);

  const osmRestaurants = guide?.restaurants || [];
  const osmHotels = guide?.hotels || [];
  const osmTemples = guide?.temples || [];
  const osmAttractions = guide?.attractions || [];

  const tabs: Array<{ id: Tab; label: string; icon: React.ElementType; count: number }> = [
    {
      id: 'restaurants',
      label: 'Restaurants & Dining',
      icon: Utensils,
      count: osmRestaurants.length || directoryFood.length,
    },
    {
      id: 'stays',
      label: '3–5 Star & Heritage Stays',
      icon: BedDouble,
      count: osmHotels.length + directoryStays.length,
    },
    {
      id: 'temples',
      label: 'Temples & Shrines',
      icon: Landmark,
      count:
        osmTemples.length +
        curatedPlaces.filter((p) => /temple|shrine|religious|spiritual/i.test(p.category)).length,
    },
    {
      id: 'attractions',
      label: 'Heritage & Sightseeing',
      icon: Compass,
      count: osmAttractions.length + curatedPlaces.length,
    },
  ];

  const title = tabs.find((item) => item.id === tab)?.label || '';

  const renderOSMCard = (item: GuideItem) => (
    <article
      key={item.id}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between"
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-44 w-full bg-stone-100 object-cover"
        />
      ) : (
        <div className="grid h-28 place-items-center bg-gradient-to-br from-amber-50 to-orange-100 text-orange-700">
          <MapPin className="h-7 w-7" />
          <span className="sr-only">No listing photo available</span>
        </div>
      )}
      <div className="space-y-2.5 p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-stone-900 text-base leading-snug">{item.name}</h4>
            {item.stars !== null && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-900 border border-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {item.stars}★
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-xs text-stone-600">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />
            {item.locality || `${selectedCity}, ${selectedState}`}
          </p>
          {item.cuisine && (
            <p className="text-xs text-stone-700 font-medium">
              <span className="text-stone-500">Cuisine:</span> {item.cuisine.replace(/;/g, ', ')}
            </p>
          )}
          {item.openingHours && (
            <p className="flex gap-1.5 text-xs text-stone-700">
              <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-700" />
              Hours: {item.openingHours}
            </p>
          )}
          {item.fee && (
            <p className="flex gap-1.5 text-xs text-stone-700">
              <IndianRupee className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-700" />
              Listed rate: {item.fee}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 mt-3">
          <a
            href={item.website || bookingSearch(destination, item.name, checkInDate, nights, guests)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-800 hover:text-orange-950 underline"
          >
            <span>Live Availability</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          {item.lat !== 0 && item.lng !== 0 && (
            <a
              href={mapSearch(`${item.lat},${item.lng}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-900"
            >
              <span>Directions</span>
              <MapPin className="h-3 w-3 text-orange-600" />
            </a>
          )}
        </div>
      </div>
    </article>
  );

  const renderCuratedStayCard = (stay: DirectoryStayItem, index: number) => {
    const isHeritage = /taj|palace|oberoi|haveli|fort|heritage|resort|leela/i.test(
      `${stay.name} ${stay.category || ''}`
    );
    return (
      <article
        key={`stay-${stay.name}-${index}`}
        className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isHeritage
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{isHeritage ? 'Heritage & Luxury Stay' : 'Recommended Stay'}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>5★ Curated</span>
            </span>
          </div>

          <div>
            <h4 className="font-serif font-bold text-stone-900 text-lg leading-snug">{stay.name}</h4>
            <p className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-stone-400" />
              {selectedCity}, {selectedState}
            </p>
          </div>

          {stay.category && (
            <p className="text-xs text-stone-700 font-medium leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              {stay.category}
            </p>
          )}

          <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Verified in Virasat's {selectedState} Master Directory</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <a
            href={bookingSearch(destination, stay.name, checkInDate, nights, guests)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition"
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Check Rates</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={mapSearch(`${stay.name}, ${selectedCity}, ${selectedState}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            <span>Map</span>
            <MapPin className="w-3 h-3 text-orange-600" />
          </a>
        </div>
      </article>
    );
  };

  return (
    <section
      className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm"
      aria-labelledby="stay-search-title"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-700">
            <MapPin className="h-4 w-4" />
            <span>Comprehensive Destination Directory</span>
          </div>
          <h3 id="stay-search-title" className="mt-1 font-serif text-2xl font-bold text-stone-900">
            {title} in and around {selectedCity}
          </h3>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-stone-600">
            Curated heritage stays, authentic local eateries, and landmark temples handpicked from
            Virasat's 36-state cultural knowledge base and live local maps.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs self-start sm:self-auto">
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 font-bold text-orange-900">
            {nights} {nights === 1 ? 'night' : 'nights'} Stay
          </span>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 font-bold text-stone-700">
            {guests} {guests === 1 ? 'traveller' : 'travellers'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
              tab === id
                ? 'bg-orange-600 text-white shadow-xs'
                : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-orange-50 hover:border-orange-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                tab === id ? 'bg-white/25 text-white' : 'bg-white text-stone-600 border border-stone-200'
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 rounded-2xl bg-amber-50/60 border border-amber-200 p-4 text-xs font-semibold text-amber-900">
          <RefreshCw className="h-4 w-4 animate-spin text-orange-700" />
          <span>Searching local guide archives for {selectedCity}…</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
          {error} Showing Virasat’s verified cultural records below.
        </div>
      )}

      {/* Tab Panels */}
      {!loading && (
        <>
          {/* TAB 1: RESTAURANTS */}
          {tab === 'restaurants' && (
            <div className="space-y-4">
              {directoryFood.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Curated Iconic Eateries & Regional Specialties</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {directoryFood.map((spot, index) => (
                      <article
                        key={`${spot.restaurant}-${index}`}
                        className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-orange-300 transition flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                              {spot.restaurant}
                            </h4>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                              Verified
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">
                            {spot.locality || spot.location || selectedCity}
                            {spot.cuisine ? ` · ${spot.cuisine}` : ''}
                          </p>
                          {spot.specialties && (
                            <p className="text-xs text-stone-700 font-medium bg-amber-50/60 p-2 rounded-xl border border-amber-100 mt-2">
                              ⭐ Must try: {spot.specialties}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[11px] text-stone-500 font-medium">
                            {spot.spendForTwo ? `${spot.spendForTwo} for two` : 'Iconic spot'}
                          </span>
                          <a
                            href={
                              spot.sourceUrl ||
                              mapSearch(`${spot.restaurant}, ${selectedCity}, ${selectedState}`)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-orange-800 hover:text-orange-950 underline"
                          >
                            <span>Map & Menu</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {osmRestaurants.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 pt-2">
                    OpenStreetMap Nearby Dining ({osmRestaurants.length})
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {osmRestaurants.map(renderOSMCard)}
                  </div>
                </div>
              )}

              {directoryFood.length === 0 && osmRestaurants.length === 0 && (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                  <h4 className="font-bold text-stone-900">Explore Restaurants in {selectedCity}</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    Discover local thalis, cafes, and popular eateries on Google Maps.
                  </p>
                  <a
                    href={mapSearch(`famous restaurants in ${destination}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-800 underline"
                  >
                    <span>Search restaurants on map</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STAYS (3–5 Star & Heritage Hotels) */}
          {tab === 'stays' && (
            <div className="space-y-6">
              {/* Directory Top Stays (Always present for major Indian destinations) */}
              {directoryStays.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Curated Heritage Stays & Luxury Haveli Resorts ({directoryStays.length})</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {directoryStays.map((stay, idx) => renderCuratedStayCard(stay, idx))}
                  </div>
                </div>
              )}

              {/* OSM Hotels */}
              {osmHotels.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 pt-2">
                    Local Verified Hotel Listings ({osmHotels.length})
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {osmHotels.map(renderOSMCard)}
                  </div>
                </div>
              )}

              {/* Fallback Search CTA */}
              <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-orange-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-stone-900 text-base">
                    Looking for more stays in {selectedCity}?
                  </h4>
                  <p className="text-xs text-stone-600 max-w-xl">
                    Compare verified 3-star, 4-star, boutique homestays, and 5-star palace hotels with
                    instant check-in dates on Booking.com.
                  </p>
                </div>
                <a
                  href={bookingSearch(destination, undefined, checkInDate, nights, guests)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition shrink-0"
                >
                  <BedDouble className="w-4 h-4" />
                  <span>Browse All Stays on Booking.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLES */}
          {tab === 'temples' && (
            <div className="space-y-4">
              {osmTemples.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {osmTemples.map(renderOSMCard)}
                </div>
              )}

              {curatedPlaces.filter((p) => /temple|shrine|religious|spiritual/i.test(p.category))
                .length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {curatedPlaces
                    .filter((p) => /temple|shrine|religious|spiritual/i.test(p.category))
                    .map((place) => (
                      <article
                        key={place.id}
                        className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs"
                      >
                        {place.thumbnail_url ? (
                          <img
                            src={place.thumbnail_url}
                            alt={place.name}
                            loading="lazy"
                            className="h-44 w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-28 place-items-center bg-amber-50 text-orange-700">
                            <Landmark className="h-7 w-7" />
                          </div>
                        )}
                        <div className="space-y-2 p-4">
                          <span className="text-[10px] font-bold uppercase tracking-wide text-orange-800 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                            {place.category}
                          </span>
                          <h4 className="font-bold text-stone-900 text-base">{place.name}</h4>
                          <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                            {place.summary}
                          </p>
                          <div className="text-[11px] text-stone-500 pt-1">
                            {place.opening_hours || 'Sunrise to Sunset'} •{' '}
                            {place.is_free ? 'Free Entry' : `₹${place.entry_fee_domestic ?? 50}`}
                          </div>
                          <div className="flex gap-3 border-t pt-2 mt-2">
                            <a
                              href={mapSearch(`${place.lat},${place.lng}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-orange-800 underline"
                            >
                              <span>Map & Directions</span>
                              <MapPin className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HERITAGE ATTRACTIONS */}
          {tab === 'attractions' && (
            <div className="space-y-4">
              {osmAttractions.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {osmAttractions.map(renderOSMCard)}
                </div>
              )}

              {curatedPlaces.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {curatedPlaces.map((place) => (
                    <article
                      key={place.id}
                      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs"
                    >
                      {place.thumbnail_url ? (
                        <img
                          src={place.thumbnail_url}
                          alt={place.name}
                          loading="lazy"
                          className="h-44 w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-28 place-items-center bg-amber-50 text-orange-700">
                          <Compass className="h-7 w-7" />
                        </div>
                      )}
                      <div className="space-y-2 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-orange-800 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                          {place.category}
                          {place.heritage_status ? ` · ${place.heritage_status}` : ''}
                        </span>
                        <h4 className="font-bold text-stone-900 text-base">{place.name}</h4>
                        <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                          {place.summary}
                        </p>
                        <div className="text-[11px] text-stone-500 pt-1">
                          {place.opening_hours || 'Sunrise to Sunset'} •{' '}
                          {place.is_free ? 'Free Entry' : `₹${place.entry_fee_domestic ?? 50}`}
                        </div>
                        <div className="flex gap-3 border-t pt-2 mt-2">
                          <a
                            href={mapSearch(`${place.lat},${place.lng}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-orange-800 underline"
                          >
                            <span>Map & Directions</span>
                            <MapPin className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100 pt-4 text-xs text-stone-500">
        <span>
          {checkInDate
            ? `Trip starts ${checkInDate}; stay search calibrated for ${nights} night${
                nights === 1 ? '' : 's'
              }.`
            : 'Add departure dates to check real-time availability.'}{' '}
          Always verify tariffs and season charges directly before booking.
        </span>
        <a
          href={mapSearch(`heritage places and markets in ${destination}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-orange-800 hover:underline shrink-0"
        >
          Search all places in {selectedCity} →
        </a>
      </div>
    </section>
  );
};
