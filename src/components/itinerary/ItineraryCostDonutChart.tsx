import React from 'react';
import { ExternalLink, Info, IndianRupee, Plane, TrainFront, Utensils, BedDouble, Ticket, MapPin } from 'lucide-react';
import { ItineraryResponse } from '../../types';

interface Props {
  itinerary: ItineraryResponse;
  selectedCityName: string;
  initialBudgetTier?: 'budget' | 'moderate' | 'luxury';
  daysCount: number;
  startDate?: string;
  guests?: number;
  originCity?: string;
}

export const ItineraryCostDonutChart: React.FC<Props> = ({ itinerary, selectedCityName, daysCount, startDate, guests = 1, originCity = '' }) => {
  const city = itinerary.city || selectedCityName;
  const stayParams = new URLSearchParams({ ss: city, group_adults: String(guests), no_rooms: String(Math.max(1, Math.ceil(guests / 2))) });
  if (startDate && daysCount > 1) {
    const checkout = new Date(`${startDate}T12:00:00`);
    checkout.setDate(checkout.getDate() + daysCount - 1);
    stayParams.set('checkin', startDate);
    stayParams.set('checkout', checkout.toISOString().slice(0, 10));
  }
  const dateQuery = startDate ? ` from ${startDate}` : '';
  const routeQuery = originCity.trim() ? ` from ${originCity.trim()} to ${city}` : ` to ${city}`;
  const searches = [
    { icon: BedDouble, label: 'Stay', text: 'Check live room prices', href: `https://www.booking.com/searchresults.html?${stayParams.toString()}` },
    { icon: TrainFront, label: 'Rail', text: originCity.trim() ? 'Enter this route on IRCTC' : 'Choose route on IRCTC', href: 'https://www.irctc.co.in/nget/train-search' },
    { icon: Plane, label: 'Flights', text: 'Search current flight options', href: `https://www.google.com/travel/flights?q=${encodeURIComponent(`flights${routeQuery}${dateQuery}`)}` },
    ...(originCity.trim() ? [{ icon: MapPin, label: 'Road route', text: 'Open live driving directions', href: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originCity.trim())}&destination=${encodeURIComponent(city)}&travelmode=driving` }] : []),
    { icon: Ticket, label: 'Attraction tickets', text: 'Check venue ticket details', href: `https://www.google.com/search?q=${encodeURIComponent(`${city} official monument ticket booking opening hours`)}` },
    { icon: Utensils, label: 'Food & local travel', text: 'Find current local options', href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`restaurants local transport ${city}`)}` },
  ];

  return (
    <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50/60 to-orange-50/70 p-5 shadow-sm sm:p-7" aria-labelledby="live-cost-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-800"><IndianRupee className="h-4 w-4" /> Trip costs</div>
          <h3 id="live-cost-heading" className="mt-1 font-serif text-xl font-bold text-stone-900">Live prices for {city}</h3>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-stone-700">We do not have live hotel, transport, ticket or restaurant quote APIs connected, so this plan does not invent a total or display stale prices. Use these searches to check current availability for your dates and party.</p>
        </div>
        <span className="w-fit shrink-0 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900">No live quote returned</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {searches.map(item => {
          const Icon = item.icon;
          return <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md">
            <Icon className="h-5 w-5 text-orange-700" />
            <div className="mt-3 font-bold text-stone-900">{item.label}</div>
            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-orange-800 group-hover:underline">{item.text}<ExternalLink className="h-3.5 w-3.5" /></div>
          </a>;
        })}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/80 p-3 text-xs leading-relaxed text-stone-600"><Info className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" /><p>{daysCount} {daysCount === 1 ? 'day' : 'days'} planned. These links open current external searches; Virasat does not receive or guarantee their quotes. Confirm final taxes, fees, opening status and cancellation terms before payment.</p></div>
    </section>
  );
};
