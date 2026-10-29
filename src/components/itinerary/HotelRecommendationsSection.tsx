import React from 'react';
import { BedDouble, ExternalLink, MapPin, Utensils } from 'lucide-react';

interface HotelRecommendationsSectionProps {
  selectedCity: string;
  selectedState?: string;
  checkInDate?: string;
  nights?: number;
  guests?: number;
}

function bookingSearchUrl(city: string, checkInDate?: string, nights = 1, guests = 1) {
  const params = new URLSearchParams({ ss: `${city}`, group_adults: String(guests), no_rooms: String(Math.max(1, Math.ceil(guests / 2))) });
  if (checkInDate && nights > 0) {
    const checkout = new Date(`${checkInDate}T12:00:00`);
    checkout.setDate(checkout.getDate() + nights);
    params.set('checkin', checkInDate);
    params.set('checkout', checkout.toISOString().slice(0, 10));
  }
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

const mapsSearch = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const HotelRecommendationsSection: React.FC<HotelRecommendationsSectionProps> = ({
  selectedCity, selectedState = 'India', checkInDate, nights = 1, guests = 1,
}) => {
  const destination = `${selectedCity}, ${selectedState}`;
  const stayUrl = bookingSearchUrl(destination, checkInDate, nights, guests);
  const stayMapUrl = mapsSearch(`hotels and homestays in ${destination}`);
  const foodMapUrl = mapsSearch(`restaurants and local food in ${destination}`);
  const marketMapUrl = mapsSearch(`local markets and bazaars in ${destination}`);

  const options = [
    { icon: BedDouble, title: 'Stays', detail: 'Search rooms and homestays for your trip dates', url: stayUrl, action: 'Check live availability' },
    { icon: MapPin, title: 'Nearby stays', detail: 'Explore currently listed properties on a map', url: stayMapUrl, action: 'Open map search' },
    { icon: Utensils, title: 'Food & markets', detail: 'Find restaurants, food streets and local bazaars', url: foodMapUrl, action: 'Find local places' },
  ];

  return (
    <section className="space-y-5 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" aria-labelledby="stay-search-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-700"><BedDouble className="h-4 w-4" /> Stay, food & local discovery</div>
          <h3 id="stay-search-title" className="mt-1 font-serif text-xl font-bold text-stone-900">Find current options in {selectedCity}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">Choose your dates and party size above, then check current listings directly with the provider. Virasat has no live booking or restaurant inventory feed.</p>
        </div>
        <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">No prices or availability cached</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {options.map(({ icon: Icon, title, detail, url, action }) => (
          <article key={title} className="flex min-h-40 flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
            <div><Icon className="h-5 w-5 text-orange-700" /><h4 className="mt-3 font-semibold text-stone-900">{title}</h4><p className="mt-1 text-sm leading-relaxed text-stone-600">{detail}</p></div>
            <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-orange-800 underline">{action}<ExternalLink className="h-3.5 w-3.5" /></a>
          </article>
        ))}
      </div>

      <a href={marketMapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 underline">Search local markets and bazaars <ExternalLink className="h-3.5 w-3.5" /></a>
      <p className="text-xs leading-relaxed text-stone-500">External listings can change. Confirm the property, address, taxes, cancellation rules, opening status and final amount with the provider or venue before paying or travelling. Virasat does not make reservations.</p>
    </section>
  );
};
