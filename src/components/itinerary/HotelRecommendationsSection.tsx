import React, { useEffect, useMemo, useState } from 'react';
import { BedDouble, ExternalLink, MapPin, Utensils, Landmark, Compass, Clock3, IndianRupee, RefreshCw, Star } from 'lucide-react';
import { MASTER_TOURISM_PLACES } from '../../data/masterTourismPlacesData';
import { LOCAL_DINING_DATABASE } from '../../data/localDiningDatabase';

type GuideItem = { id: string; name: string; kind: 'restaurant' | 'hotel' | 'temple' | 'attraction'; lat: number; lng: number; locality: string | null; cuisine: string | null; openingHours: string | null; fee: string | null; stars: number | null; website: string | null; image: string | null; sourceUrl: string; source: string; verification: string };
type LocalGuide = { city: string; state: string; restaurants: GuideItem[]; hotels: GuideItem[]; temples: GuideItem[]; attractions: GuideItem[]; attribution: string; retrievedAt: string; note: string };
type DirectoryFoodSpot = { id?: string; restaurant: string; locality: string; cuisine: string; specialties?: string; spendForTwo?: string; checkedOn?: string; sourceUrl?: string; image?: string; imageNote?: string };
type Tab = 'restaurants' | 'stays' | 'temples' | 'attractions';

const directoryModules = import.meta.glob('../../data/*Directory.ts', { eager: true }) as Record<string, Record<string, unknown>>;
const directoryCities = Object.values(directoryModules).flatMap((module) => Object.values(module).flatMap((value) => Array.isArray(value) ? value as Array<{ name?: string; dining?: { veg?: DirectoryFoodSpot[]; nonVeg?: DirectoryFoodSpot[] } }> : []));
const norm = (value: string) => value.toLowerCase().replace(/\b(city|district)\b/g, '').replace(/[^a-z0-9]/g, '');
const aliases: Record<string, string[]> = { oldgoa: ['goa', 'velhagoa', 'panaji'], panjim: ['panaji', 'goa'], panaji: ['goa', 'oldgoa'], goa: ['oldgoa', 'panaji'], bangalore: ['bengaluru'], bengaluru: ['bangalore'], bombay: ['mumbai'], mumbai: ['bombay'], delhi: ['newdelhi'], newdelhi: ['delhi'] };
const mapSearch = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const bookingSearch = (city: string, date?: string, nights = 1, guests = 1) => {
  const params = new URLSearchParams({ ss: `${city}, India`, group_adults: String(guests), no_rooms: String(Math.max(1, Math.ceil(guests / 2))), nflt: 'class=3;class=4;class=5' });
  if (date) { const out = new Date(`${date}T12:00:00`); out.setDate(out.getDate() + Math.max(1, nights)); params.set('checkin', date); params.set('checkout', out.toISOString().slice(0, 10)); }
  return `https://www.booking.com/searchresults.html?${params}`;
};

export const HotelRecommendationsSection: React.FC<{ selectedCity: string; selectedState?: string; checkInDate?: string; nights?: number; guests?: number }> = ({ selectedCity, selectedState = 'India', checkInDate, nights = 1, guests = 1 }) => {
  const [tab, setTab] = useState<Tab>('restaurants');
  const [guide, setGuide] = useState<LocalGuide | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const normalizedCity = norm(selectedCity);
  const destination = `${selectedCity}, ${selectedState}`;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setGuide(null);
    fetch(`/api/v1/itineraries/local-guide?city=${encodeURIComponent(selectedCity)}`, { signal: controller.signal })
      .then(async (response) => { const payload = await response.json(); if (!response.ok || !payload?.success) throw new Error(payload?.error || 'Local listings could not be loaded.'); return payload.data as LocalGuide; })
      .then((data) => setGuide(data))
      .catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Local listings could not be loaded.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [selectedCity]);

  const curatedPlaces = useMemo(() => {
    const names = new Set([normalizedCity, ...(aliases[normalizedCity] || []).map(norm)]);
    return MASTER_TOURISM_PLACES.filter((place) => names.has(norm(place.city_name)) || names.has(norm(place.city_id.replace(/-/g, ' '))));
  }, [normalizedCity]);
  const directoryFood = useMemo(() => {
    const candidates = [normalizedCity, ...(aliases[normalizedCity] || []).map(norm)];
    const city = directoryCities.find((entry) => entry.name && candidates.includes(norm(entry.name))) || directoryCities.find((entry) => entry.name && candidates.some((candidate) => norm(entry.name!).startsWith(candidate) || candidate.startsWith(norm(entry.name!))));
    return [...(city?.dining?.veg || []), ...(city?.dining?.nonVeg || [])].filter((item, index, all) => item.restaurant && all.findIndex((other) => other.restaurant === item.restaurant) === index);
  }, [normalizedCity]);

  const tabs: Array<{ id: Tab; label: string; icon: React.ElementType; count: number }> = [
    { id: 'restaurants', label: 'Restaurants', icon: Utensils, count: (guide?.restaurants.length || 0) + (guide ? 0 : directoryFood.length) },
    { id: 'stays', label: '3–5 star stays', icon: BedDouble, count: guide?.hotels.length || 0 },
    { id: 'temples', label: 'Temples', icon: Landmark, count: (guide?.temples.length || 0) + curatedPlaces.filter((p) => /temple|shrine|religious|spiritual/i.test(p.category)).length },
    { id: 'attractions', label: 'Heritage & places', icon: Compass, count: (guide?.attractions.length || 0) + curatedPlaces.length },
  ];
  const osm = tab === 'restaurants' ? guide?.restaurants || [] : tab === 'stays' ? guide?.hotels || [] : tab === 'temples' ? guide?.temples || [] : guide?.attractions || [];
  const localPlaces = tab === 'temples' ? curatedPlaces.filter((p) => /temple|shrine|religious|spiritual/i.test(p.category)) : tab === 'attractions' ? curatedPlaces : [];
  const title = tabs.find((item) => item.id === tab)?.label || '';

  const renderOSMCard = (item: GuideItem) => <article key={item.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
    {item.image ? <img src={item.image} alt={item.name} loading="lazy" className="h-40 w-full bg-stone-100 object-cover" /> : <div className="grid h-28 place-items-center bg-gradient-to-br from-amber-50 to-orange-100 text-orange-700"><MapPin className="h-7 w-7" /><span className="sr-only">No listing photo available</span></div>}
    <div className="space-y-2.5 p-4"><div className="flex items-start justify-between gap-2"><h4 className="font-bold text-stone-900">{item.name}</h4>{item.stars !== null && <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900"><Star className="h-3 w-3 fill-amber-500 text-amber-500" />{item.stars}★</span>}</div>
      <p className="flex items-center gap-1 text-xs text-stone-600"><MapPin className="h-3.5 w-3.5 shrink-0" />{item.locality || `${selectedCity}, ${selectedState}`}</p>
      {item.cuisine && <p className="text-sm text-stone-700">Cuisine: {item.cuisine.replace(/;/g, ', ')}</p>}
      {item.openingHours && <p className="flex gap-1.5 text-sm text-stone-700"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" />Hours listed: {item.openingHours}</p>}
      {item.fee && <p className="flex gap-1.5 text-sm text-stone-700"><IndianRupee className="h-4 w-4 shrink-0 text-orange-700" />Listed entry/charge: {item.fee}</p>}
      {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" className="block break-all text-xs font-semibold text-orange-800 underline">Venue website <ExternalLink className="inline h-3 w-3" /></a>}
      <p className="text-[11px] text-stone-500">Community-mapped listing · confirm with the venue</p>
      <div className="flex flex-wrap gap-3 border-t border-stone-100 pt-2"><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 underline">OpenStreetMap record <ExternalLink className="h-3 w-3" /></a><a href={mapSearch(`${item.lat},${item.lng}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-orange-800 underline">Directions <MapPin className="h-3 w-3" /></a></div>
    </div>
  </article>;

  return <section className="space-y-5 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="stay-search-title">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-700"><MapPin className="h-4 w-4" /> Local guide for every destination</div><h3 id="stay-search-title" className="mt-1 font-serif text-xl font-bold text-stone-900">{title} around {selectedCity}</h3><p className="mt-1 max-w-3xl text-sm leading-relaxed text-stone-600">Restaurants, hotels and places near this itinerary. Source links, map directions, and any available hours or charges are shown on each listing.</p></div><div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 font-semibold text-orange-900">{nights} {nights === 1 ? 'night' : 'nights'}</span><span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 font-semibold text-stone-700">{guests} {guests === 1 ? 'traveller' : 'travellers'}</span></div></div>
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Local listings">{tabs.map(({ id, label, icon: Icon, count }) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold ${tab === id ? 'bg-orange-700 text-white' : 'border border-stone-200 bg-white text-stone-700 hover:bg-orange-50'}`}><Icon className="h-4 w-4" />{label}<span className={`rounded-full px-1.5 text-xs ${tab === id ? 'bg-white/20' : 'bg-stone-100'}`}>{count}</span></button>)}</div>

    {loading && <div className="flex items-center gap-2 rounded-xl bg-stone-50 p-4 text-sm text-stone-600"><RefreshCw className="h-4 w-4 animate-spin text-orange-700" />Finding nearby listings for {selectedCity}…</div>}
    {!loading && error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error} Showing Virasat’s saved place and dining records where available.</div>}
    {!loading && <>
      {tab === 'restaurants' && !guide && directoryFood.length > 0 && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{directoryFood.slice(0, 12).map((spot, index) => <article key={`${spot.restaurant}-${index}`} className="rounded-2xl border border-stone-200 p-4"><h4 className="font-bold text-stone-900">{spot.restaurant}</h4><p className="mt-1 text-xs text-stone-600">{spot.locality || selectedCity}{spot.cuisine ? ` · ${spot.cuisine}` : ''}</p>{spot.specialties && <p className="mt-2 text-sm text-stone-700">{spot.specialties}</p>}<p className="mt-2 text-xs text-stone-500">{spot.spendForTwo ? `${spot.spendForTwo} for two · saved estimate, not live` : 'Menu pricing and hours not available in saved records.'}</p><a href={spot.sourceUrl || mapSearch(`${spot.restaurant}, ${selectedCity}, ${selectedState}`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-orange-800 underline">Listing & directions <ExternalLink className="h-3 w-3" /></a></article>)}</div>}
      {osm.length > 0 && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{osm.map(renderOSMCard)}</div>}
      {(tab === 'temples' || tab === 'attractions') && localPlaces.length > 0 && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{localPlaces.map((place) => <article key={place.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">{place.thumbnail_url ? <img src={place.thumbnail_url} alt={place.name} loading="lazy" className="h-40 w-full object-cover" /> : <div className="grid h-28 place-items-center bg-amber-50 text-orange-700"><Landmark className="h-7 w-7" /></div>}<div className="space-y-2 p-4"><span className="text-[11px] font-bold uppercase tracking-wide text-orange-800">{place.category}{place.heritage_status ? ` · ${place.heritage_status}` : ''}</span><h4 className="font-bold text-stone-900">{place.name}</h4><p className="text-sm leading-relaxed text-stone-700">{place.summary}</p><div className="text-xs text-stone-600">{place.opening_hours || 'Hours: check with venue'}{place.entry_fee_domestic !== null && place.entry_fee_domestic !== undefined ? ` · Entry listed: ₹${place.entry_fee_domestic}` : ''} · approx. {Math.max(1, Math.round(place.visit_duration_minutes / 60))} hr visit</div><p className="text-[11px] text-stone-500">{place.verification_status} · last checked {place.last_verified}</p><div className="flex gap-3 border-t pt-2"><a href={place.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 underline">Record source <ExternalLink className="h-3 w-3" /></a><a href={mapSearch(`${place.lat},${place.lng}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-orange-800 underline">Map <MapPin className="h-3 w-3" /></a></div></div></article>)}</div>}
      {osm.length === 0 && !(tab === 'restaurants' && !guide && directoryFood.length) && localPlaces.length === 0 && <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center"><h4 className="font-bold text-stone-900">{tab === 'stays' ? `No 3–5 star hotel records found for ${selectedCity}` : `No saved ${title.toLowerCase()} listings found for ${selectedCity}`}</h4><p className="mt-1 text-sm text-stone-600">We only show star ratings, operating details and charges when the listing provides them. Use the current search to check availability.</p><a href={tab === 'stays' ? bookingSearch(destination, checkInDate, nights, guests) : mapSearch(`${title} in ${destination}`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 font-bold text-orange-800 underline">{tab === 'stays' ? 'Search available 3–5 star stays' : `Search ${title.toLowerCase()} on map`} <ExternalLink className="h-4 w-4" /></a></div>}
    </>}

    <div className="flex flex-col gap-2 border-t border-stone-100 pt-4 text-xs leading-relaxed text-stone-500 sm:flex-row sm:items-center sm:justify-between"><span>{checkInDate ? `Trip starts ${checkInDate}; accommodation search uses ${nights} night${nights === 1 ? '' : 's'}.` : 'Add trip dates to personalize current stay searches.'} Rates, menus, and availability can change; confirm directly before paying.</span><a href={guide?.attribution ? 'https://www.openstreetmap.org/copyright' : mapSearch(`restaurants, markets and local places in ${destination}`)} target="_blank" rel="noopener noreferrer" className="shrink-0 font-semibold text-stone-700 underline">{guide?.attribution || 'Search local markets & places'} <ExternalLink className="inline h-3.5 w-3.5" /></a></div>
    {guide?.attribution && <p className="text-[11px] text-stone-500">{guide.attribution} · Updated {new Date(guide.retrievedAt).toLocaleString()}</p>}
  </section>;
};
