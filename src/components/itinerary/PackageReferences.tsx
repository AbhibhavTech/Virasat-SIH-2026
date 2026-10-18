import React from 'react';
import { ExternalLink, Luggage, MapPin } from 'lucide-react';

const PROVIDERS = [
  { name: 'IRCTC Tourism', description: 'Rail and land tours', url: 'https://www.irctctourism.com/tourpkgs' },
  { name: 'MakeMyTrip', description: 'Holiday packages', url: 'https://www.makemytrip.com/holidays-india/' },
  { name: 'Yatra', description: 'Group and custom holidays', url: 'https://packages.yatra.com/holidays/' },
  { name: 'SOTC', description: 'Guided and custom tours', url: 'https://www.sotc.in/holidays' },
  { name: 'Thomas Cook India', description: 'Holiday packages', url: 'https://www.thomascook.in/holidays' },
] as const;

export function PackageReferences({ city, days, places = [] }: { city: string; days: number; places?: string[] }) {
  const destination = city.trim() || 'India';
  const highlights = [...new Set(places.map(place => place.trim()).filter(Boolean))].slice(0, 4);
  return (
    <section aria-labelledby="package-references-title" className="rounded-3xl border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/60 p-5 sm:p-7 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-orange-100 p-2.5 text-orange-700"><Luggage className="h-5 w-5" /></span>
        <div>
          <h2 id="package-references-title" className="text-xl sm:text-2xl font-bold text-stone-900">Explore travel packages</h2>
          <p className="mt-1 text-sm sm:text-base text-stone-600">Planning {days} {days === 1 ? 'day' : 'days'} in <strong>{destination}</strong>? Compare packages from these providers.</p>
        </div>
      </div>

      {highlights.length > 0 && <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-stone-700">
        <MapPin className="h-4 w-4 text-orange-700" aria-hidden="true" />
        <span className="font-semibold">Places in your plan:</span>
        {highlights.map(place => <span key={place} className="rounded-full border border-orange-200 bg-white px-3 py-1">{place}</span>)}
      </div>}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {PROVIDERS.map(provider => <a key={provider.name} href={provider.name === 'MakeMyTrip' && destination.toLowerCase() === 'mumbai' ? 'https://www.makemytrip.com/holidays-india/mumbai-travel-packages.html' : provider.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-28 flex-col justify-between rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-orange-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-600" aria-label={`Browse ${provider.name} packages in a new tab`}>
          <div><div className="font-bold text-stone-900">{provider.name}</div><div className="mt-1 text-sm text-stone-600">{provider.description}</div></div>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange-700 group-hover:underline">Browse packages <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></span>
        </a>)}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">On the provider site, search <strong>{destination}</strong> and compare the route, {days}-day duration, included heritage stops, hotel, transport, dates, full price and cancellation terms. Package listings and availability are provided by those sites and may differ from this Virasat plan.</p>
    </section>
  );
}
