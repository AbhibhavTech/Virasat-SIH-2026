import React, { useMemo, useState } from 'react';
import { BedDouble, ExternalLink, MapPin, Utensils, ShoppingBag, CalendarDays, Users, BadgeIndianRupee } from 'lucide-react';
import hotelRecords from '../../../data/hotels.json';
import { LOCAL_DINING_DATABASE } from '../../data/localDiningDatabase';

type DirectoryFoodSpot = { restaurant: string; location?: string; specialties?: string };
type DirectoryCity = {
  name?: string;
  coverImage?: string;
  topStays?: Array<{ name: string; category?: string }>;
  dining?: { veg?: DirectoryFoodSpot[]; nonVeg?: DirectoryFoodSpot[] };
};
type HotelRecord = {
  id: string; name: string; city: string; state?: string; category?: string;
  price_indication?: string; price_range?: string; location?: string;
  thumbnail_url?: string; image_url?: string; amenities?: string[];
};

// Regional city guides provide Virasat's restaurant and stay names; the hotel
// registry provides indicative nightly ranges and image records when available.
const directoryModules = import.meta.glob('../../data/*Directory.ts', { eager: true }) as Record<string, Record<string, unknown>>;
const directoryCities: DirectoryCity[] = Object.values(directoryModules).flatMap((module) =>
  Object.values(module).flatMap((exported) => Array.isArray(exported) ? exported as DirectoryCity[] : []),
);
const hotels = hotelRecords as HotelRecord[];

const normalize = (value: string) => value.toLowerCase().replace(/\b(city|district)\b/g, '').replace(/[^a-z0-9]/g, '');
const areaAliases: Record<string, string[]> = {
  oldgoa: ['goa', 'velhagoa', 'panaji'],
  velhagoa: ['oldgoa', 'goa', 'panaji'],
  panjim: ['panaji', 'goa'],
  goa: ['oldgoa', 'panaji'],
};
const foodImage = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=82';
const bookingSearchUrl = (city: string, checkInDate?: string, nights = 1, guests = 1) => {
  const params = new URLSearchParams({ ss: city, group_adults: String(guests), no_rooms: String(Math.max(1, Math.ceil(guests / 2))) });
  if (checkInDate && nights > 0) {
    const checkout = new Date(`${checkInDate}T12:00:00`);
    checkout.setDate(checkout.getDate() + nights);
    params.set('checkin', checkInDate);
    params.set('checkout', checkout.toISOString().slice(0, 10));
  }
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
};
const mapsSearch = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const HotelRecommendationsSection: React.FC<{
  selectedCity: string; selectedState?: string; checkInDate?: string; nights?: number; guests?: number;
}> = ({ selectedCity, selectedState = 'India', checkInDate, nights = 1, guests = 1 }) => {
  const [activeTab, setActiveTab] = useState<'stays' | 'food'>('food');
  const cityRecord = useMemo(() => {
    const needle = normalize(selectedCity);
    const candidates = [needle, ...(areaAliases[needle] || [])];
    return directoryCities.find((city) => {
      const cityName = city.name;
      return Boolean(cityName && candidates.includes(normalize(cityName)));
    }) || directoryCities.find((city) => {
      const cityName = city.name;
      return Boolean(cityName && candidates.some((candidate) => normalize(cityName).startsWith(candidate) || candidate.startsWith(normalize(cityName))));
    });
  }, [selectedCity]);
  const cityHotels = useMemo(() => {
    const needle = normalize(selectedCity);
    return hotels.filter((hotel) => normalize(hotel.city) === needle);
  }, [selectedCity]);
  const stayNames = cityRecord?.topStays || [];
  const foodSpots = [...(cityRecord?.dining?.veg || []), ...(cityRecord?.dining?.nonVeg || [])]
    .filter((spot, index, all) => spot.restaurant && all.findIndex((candidate) => candidate.restaurant === spot.restaurant) === index)
    .slice(0, 8);
  const areaDining = LOCAL_DINING_DATABASE[normalize(selectedCity)] || LOCAL_DINING_DATABASE[(areaAliases[normalize(selectedCity)] || []).map((alias) => normalize(alias)).find((alias) => LOCAL_DINING_DATABASE[alias]) || ''];
  const destination = `${selectedCity}, ${selectedState}`;
  const bookingUrl = bookingSearchUrl(destination, checkInDate, nights, guests);

  return (
    <section className="space-y-5 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="stay-search-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-700"><BedDouble className="h-4 w-4" /> Stay, food & local discovery</div>
          <h3 id="stay-search-title" className="mt-1 font-serif text-xl font-bold text-stone-900">Make your {selectedCity} stay part of the plan</h3>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-stone-600">Virasat shows names, place details, images and saved price guidance here. The links are only for checking current availability, menus and final prices.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 font-semibold text-orange-900"><CalendarDays className="h-3.5 w-3.5" />{nights} {nights === 1 ? 'night' : 'nights'}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 font-semibold text-stone-700"><Users className="h-3.5 w-3.5" />{guests} {guests === 1 ? 'traveller' : 'travellers'}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Stay and food recommendations">
        <button type="button" role="tab" aria-selected={activeTab === 'stays'} onClick={() => setActiveTab('stays')} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === 'stays' ? 'bg-orange-700 text-white' : 'border border-stone-200 bg-white text-stone-700 hover:bg-orange-50'}`}><BedDouble className="mr-1.5 inline h-4 w-4" />Places to stay</button>
        <button type="button" role="tab" aria-selected={activeTab === 'food'} onClick={() => setActiveTab('food')} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === 'food' ? 'bg-orange-700 text-white' : 'border border-stone-200 bg-white text-stone-700 hover:bg-orange-50'}`}><Utensils className="mr-1.5 inline h-4 w-4" />Restaurants & local food</button>
      </div>

      {activeTab === 'stays' ? <>
        {cityHotels.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cityHotels.slice(0, 6).map((hotel) => <article key={hotel.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="relative"><img src={hotel.image_url || hotel.thumbnail_url || cityRecord?.coverImage || ''} alt={`Illustrative stay image for ${hotel.name}`} loading="lazy" className="h-40 w-full bg-stone-100 object-cover" /><span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white">Illustrative stay image</span></div>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2"><div><h4 className="font-bold text-stone-900">{hotel.name}</h4><p className="mt-0.5 text-xs text-stone-600">{hotel.category || 'Stay'}{hotel.location ? ` · ${hotel.location}` : ''}</p></div><BedDouble className="h-4 w-4 shrink-0 text-orange-700" /></div>
              <div className="flex items-center gap-1 text-sm font-bold text-stone-900"><BadgeIndianRupee className="h-4 w-4 text-orange-700" />{hotel.price_indication || hotel.price_range || 'Price not in Virasat records'}</div>
              <p className="text-xs leading-relaxed text-stone-500">Saved indicative range per night; not a live quote. Check taxes, dates and room availability before booking.</p>
              {!!hotel.amenities?.length && <p className="text-xs text-stone-700">{hotel.amenities.slice(0, 3).join(' · ')}</p>}
              <div className="flex flex-wrap gap-3 pt-1"><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-orange-800 underline">Check dates & price <ExternalLink className="h-3.5 w-3.5" /></a><a href={mapsSearch(`${hotel.name}, ${destination}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-stone-700 underline"><MapPin className="h-3.5 w-3.5" />Map</a></div>
            </div>
          </article>)}
        </div> : stayNames.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stayNames.slice(0, 6).map((stay) => <article key={stay.name} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            {cityRecord?.coverImage && <img src={cityRecord.coverImage} alt={`${selectedCity} destination image`} loading="lazy" className="h-40 w-full bg-stone-100 object-cover" />}
            <div className="space-y-2 p-4"><h4 className="font-bold text-stone-900">{stay.name}</h4><p className="text-sm text-stone-600">{stay.category || 'Accommodation listed in Virasat city guide'}</p><p className="text-sm font-semibold text-stone-800">Nightly price: not listed in Virasat records</p><p className="text-xs text-stone-500">The city guide names this stay; current operation, dates and rate need confirmation.</p><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-orange-800 underline">Check dates & price <ExternalLink className="h-3.5 w-3.5" /></a></div>
          </article>)}
        </div> : <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center"><BedDouble className="mx-auto h-7 w-7 text-orange-700" /><h4 className="mt-2 font-bold text-stone-900">No named stays are recorded for {selectedCity} yet</h4><p className="mt-1 text-sm text-stone-600">Open the date-specific search to see current properties. Virasat won’t invent hotel names or prices.</p><a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-orange-800 underline">See current stays <ExternalLink className="h-3.5 w-3.5" /></a></div>}
      </> : <>
        {areaDining?.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {areaDining.map((spot) => <article key={spot.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="relative"><img src={spot.image} alt={spot.imageNote} loading="lazy" className="h-36 w-full bg-stone-100 object-cover" /><span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white">{spot.imageNote}</span></div>
            <div className="space-y-2 p-4"><div className="flex items-start justify-between gap-2"><h4 className="font-bold text-stone-900">{spot.restaurant}</h4><Utensils className="h-4 w-4 shrink-0 text-orange-700" /></div><p className="flex items-center gap-1 text-xs text-stone-600"><MapPin className="h-3.5 w-3.5" />{spot.locality}</p><p className="text-sm text-stone-700">{spot.cuisine}</p><p className="text-sm leading-relaxed text-stone-700">{spot.specialties}</p><p className="text-sm font-bold text-stone-900">{spot.spendForTwo || 'Spend estimate not available'} <span className="text-xs font-normal text-stone-500">for two{spot.spendForTwo ? ' · listing estimate' : ''}</span></p><p className="text-xs text-stone-500">Price checked {spot.checkedOn}; menu and final bill may differ.</p><a href={spot.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 underline">Reference: {spot.sourceName} <ExternalLink className="h-3.5 w-3.5" /></a><a href={mapsSearch(`${spot.restaurant}, ${spot.locality}, Goa`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-bold text-orange-800 underline">Check current status & directions <ExternalLink className="h-3.5 w-3.5" /></a></div>
          </article>)}
        </div> : foodSpots.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {foodSpots.map((spot, index) => <article key={`${spot.restaurant}-${index}`} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="relative"><img src={foodImage} alt="Illustrative Indian meal; restaurant image is not verified" loading="lazy" className="h-36 w-full bg-stone-100 object-cover" /><span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white">Illustrative food image</span></div>
            <div className="space-y-2 p-4"><div className="flex items-start justify-between gap-2"><h4 className="font-bold text-stone-900">{spot.restaurant}</h4><Utensils className="h-4 w-4 shrink-0 text-orange-700" /></div><p className="flex items-center gap-1 text-xs text-stone-600"><MapPin className="h-3.5 w-3.5" />{spot.location || selectedCity}</p>{spot.specialties && <p className="text-sm leading-relaxed text-stone-700">{spot.specialties}</p>}<p className="text-xs font-medium text-stone-500">Menu prices and opening hours are not listed in Virasat records.</p><a href={mapsSearch(`${spot.restaurant}, ${spot.location || selectedCity}, ${selectedState}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-orange-800 underline">View on map & check menu <ExternalLink className="h-3.5 w-3.5" /></a></div>
          </article>)}
        </div> : <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center"><Utensils className="mx-auto h-7 w-7 text-orange-700" /><h4 className="mt-2 font-bold text-stone-900">Restaurant names aren’t in Virasat’s {selectedCity} records yet</h4><p className="mt-1 text-sm text-stone-600">Browse current local restaurants and menus; we’ll only show named recommendations once they’re in our database.</p><a href={mapsSearch(`restaurants and local food in ${destination}`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-orange-800 underline">Browse nearby food <ExternalLink className="h-3.5 w-3.5" /></a></div>}
      </>}

      <div className="flex flex-col gap-2 border-t border-stone-100 pt-4 text-xs leading-relaxed text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{checkInDate ? `Trip begins ${checkInDate}; stay guidance uses ${nights} night${nights === 1 ? '' : 's'}.` : 'Add travel dates above to personalize stay searches.'} Prices from Virasat records are indicative, not live.</span>
        <a href={mapsSearch(`markets and bazaars in ${destination}`)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 font-semibold text-stone-700 underline"><ShoppingBag className="h-3.5 w-3.5" />Local markets reference <ExternalLink className="h-3.5 w-3.5" /></a>
      </div>
    </section>
  );
};
