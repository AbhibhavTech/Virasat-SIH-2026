import React, { useState } from 'react';
import { ExternalLink, Luggage, MapPin, Plus, Trash2 } from 'lucide-react';

const PROVIDERS = [
  { name: 'IRCTC Tourism', description: 'Rail and land tours', url: 'https://www.irctctourism.com/tourpkgs' },
  { name: 'MakeMyTrip', description: 'Holiday packages', url: 'https://www.makemytrip.com/holidays-india/' },
  { name: 'Yatra', description: 'Group and custom holidays', url: 'https://packages.yatra.com/holidays/' },
  { name: 'SOTC', description: 'Guided and custom tours', url: 'https://www.sotc.in/holidays' },
  { name: 'Thomas Cook India', description: 'Holiday packages', url: 'https://www.thomascook.in/holidays' },
] as const;

type Quote = {
  id: string;
  provider: string;
  name: string;
  packageDays: number;
  totalPrice: number;
  travellers: number;
  includedPlaces: string[];
  hotel: boolean;
  transfers: boolean;
  cancellation: string;
};

export function PackageReferences({ city, days, startDate, travellers = 1, places = [] }: { city: string; days: number; startDate?: string; travellers?: number; places?: string[] }) {
  const destination = city.trim() || 'India';
  const highlights = [...new Set(places.map(place => place.trim()).filter(Boolean))].slice(0, 8);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [provider, setProvider] = useState<string>(PROVIDERS[0].name);
  const [name, setName] = useState('');
  const [packageDays, setPackageDays] = useState(days);
  const [totalPrice, setTotalPrice] = useState('');
  const [quoteTravellers, setQuoteTravellers] = useState(1);
  const [includedPlaces, setIncludedPlaces] = useState<string[]>([]);
  const [hotel, setHotel] = useState(false);
  const [transfers, setTransfers] = useState(false);
  const [cancellation, setCancellation] = useState('');
  const [error, setError] = useState('');

  function addQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(totalPrice);
    if (!Number.isFinite(price) || price <= 0 || price > 100000000 || !Number.isInteger(packageDays) || packageDays < 1 || packageDays > 60 || !Number.isInteger(quoteTravellers) || quoteTravellers < 1 || quoteTravellers > 50) {
      setError('Enter a valid total price, trip duration and traveller count.');
      return;
    }
    setQuotes(current => [...current, {
      id: crypto.randomUUID(), provider, name: name.trim() || `${destination} package`, packageDays,
      totalPrice: price, travellers: quoteTravellers, includedPlaces: includedPlaces.filter(place => highlights.includes(place)), hotel, transfers, cancellation: cancellation.trim(),
    }]);
    setName(''); setTotalPrice(''); setIncludedPlaces([]); setHotel(false); setTransfers(false); setCancellation(''); setError(''); setShowForm(false);
  }

  return (
    <section aria-labelledby="package-references-title" className="rounded-3xl border border-orange-100 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/60 p-5 sm:p-7 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-orange-100 p-2.5 text-orange-700"><Luggage className="h-5 w-5" /></span>
        <div>
          <h2 id="package-references-title" className="text-xl sm:text-2xl font-bold text-stone-900">Explore travel packages</h2>
          <p className="mt-1 text-sm sm:text-base text-stone-600">Planning {days} {days === 1 ? 'day' : 'days'} in <strong>{destination}</strong>{startDate ? ` from ${startDate}` : ''} for {travellers} {travellers === 1 ? 'traveller' : 'travellers'}? Open a provider to check live package details.</p>
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
      <p className="mt-4 text-sm leading-relaxed text-stone-600">These are provider search links, not an API feed: Virasat does not import their live inventory or prices. On the provider site, check the route, {days}-day duration, dates, traveller count, inclusions, taxes and cancellation terms. Packages may differ from this suggested plan.</p>

      <div className="mt-6 border-t border-orange-100 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Compare a package with your plan</h3>
            <p className="text-sm text-stone-600">Found a quote on a provider site? Enter its details to compare up to three options here.</p>
          </div>
          <button type="button" onClick={() => { setShowForm(value => !value); setError(''); }} disabled={!showForm && quotes.length >= 3} className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50">
            <Plus className="h-4 w-4" aria-hidden="true" /> {showForm ? 'Close form' : 'Add a quote'}
          </button>
        </div>

        {showForm && <form onSubmit={addQuote} className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5" aria-label="Add travel package quote">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-semibold text-stone-800">Provider
              <select value={provider} onChange={event => setProvider(event.target.value)} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white p-2.5 font-normal">{PROVIDERS.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}</select>
            </label>
            <label className="text-sm font-semibold text-stone-800">Package name
              <input value={name} onChange={event => setName(event.target.value)} maxLength={100} placeholder="As shown on the provider site" className="mt-1 block w-full rounded-lg border border-stone-300 p-2.5 font-normal" />
            </label>
            <label className="text-sm font-semibold text-stone-800">Trip days
              <input type="number" min="1" max="60" required value={packageDays} onChange={event => setPackageDays(Number(event.target.value))} className="mt-1 block w-full rounded-lg border border-stone-300 p-2.5 font-normal" />
            </label>
            <label className="text-sm font-semibold text-stone-800">Total quoted price (₹)
              <input type="number" min="1" max="100000000" step="1" required value={totalPrice} onChange={event => setTotalPrice(event.target.value)} placeholder="Full price, not deposit" className="mt-1 block w-full rounded-lg border border-stone-300 p-2.5 font-normal" />
            </label>
            <label className="text-sm font-semibold text-stone-800">Travellers covered
              <input type="number" min="1" max="50" required value={quoteTravellers} onChange={event => setQuoteTravellers(Number(event.target.value))} className="mt-1 block w-full rounded-lg border border-stone-300 p-2.5 font-normal" />
            </label>
            <label className="text-sm font-semibold text-stone-800">Cancellation terms
              <input value={cancellation} onChange={event => setCancellation(event.target.value)} maxLength={180} placeholder="Copy the key condition, if stated" className="mt-1 block w-full rounded-lg border border-stone-300 p-2.5 font-normal" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-700">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={hotel} onChange={event => setHotel(event.target.checked)} />Hotel included</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={transfers} onChange={event => setTransfers(event.target.checked)} />Local transfers included</label>
          </div>
          {highlights.length > 0 && <fieldset className="mt-4"><legend className="text-sm font-semibold text-stone-800">Planned stops explicitly included in this package</legend><div className="mt-2 flex flex-wrap gap-2">{highlights.map(place => <label key={place} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-sm"><input type="checkbox" checked={includedPlaces.includes(place)} onChange={event => setIncludedPlaces(current => event.target.checked ? [...current, place] : current.filter(item => item !== place))} />{place}</label>)}</div></fieldset>}
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3"><button type="submit" className="rounded-xl bg-orange-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-800">Add to comparison</button><p className="text-xs text-stone-600">Only your entered details are used. Virasat does not verify this quote or make a booking.</p></div>
        </form>}

        {quotes.length > 0 && <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Package comparison">
          {quotes.map(quote => <article key={quote.id} className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2"><div><div className="text-xs font-bold uppercase tracking-wide text-orange-700">{quote.provider}</div><h4 className="mt-1 font-bold text-stone-900">{quote.name}</h4></div><button type="button" onClick={() => setQuotes(current => current.filter(item => item.id !== quote.id))} aria-label={`Remove ${quote.name} quote`} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-stone-500">Total quote</dt><dd className="font-bold text-stone-900">₹{quote.totalPrice.toLocaleString('en-IN')}</dd></div><div><dt className="text-stone-500">Per traveller</dt><dd className="font-bold text-stone-900">₹{Math.round(quote.totalPrice / quote.travellers).toLocaleString('en-IN')}</dd></div><div><dt className="text-stone-500">Duration</dt><dd className="font-semibold">{quote.packageDays} days {quote.packageDays === days ? '· matches plan' : `· plan: ${days}`}</dd></div><div><dt className="text-stone-500">Planned stops</dt><dd className="font-semibold">{highlights.length ? `${quote.includedPlaces.filter(place => highlights.includes(place)).length} of ${highlights.length} included` : 'Generate a plan to compare'}</dd></div></dl>
            <p className="mt-3 text-sm text-stone-700">Hotel: {quote.hotel ? 'Included per your notes' : 'Not marked as included'} · Transfers: {quote.transfers ? 'Included per your notes' : 'Not marked as included'}</p>
            <p className="mt-2 text-sm text-stone-700">Cancellation: {quote.cancellation || 'Check provider terms'}</p>
          </article>)}
        </div>}
        <p className="mt-3 text-xs text-stone-500">Quotes stay on this page until you leave or refresh. Check the final itinerary, taxes, availability and cancellation policy directly with the provider before paying.</p>
      </div>
    </section>
  );
}
