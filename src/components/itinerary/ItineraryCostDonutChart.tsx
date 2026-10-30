import React, { useState } from 'react';
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

const tiers = {
  budget: { label: 'Budget', min: 1800, max: 3500, shares: [35, 30, 20, 15] },
  moderate: { label: 'Comfort', min: 3500, max: 7500, shares: [45, 25, 15, 15] },
  luxury: { label: 'Premium', min: 7500, max: 18000, shares: [55, 20, 15, 10] },
} as const;
const categoryNames = ['Stay', 'Food', 'Local travel', 'Tickets & extras'];
const categoryColors = ['#0f766e', '#f97316', '#2563eb', '#a855f7'];
const categoryDescriptions = [
  'A planning share for accommodation during your stay. This is an estimate, not a hotel quote or availability check.',
  'A planning share for meals, snacks, and trying local food during the trip.',
  'A planning share for getting around within the destination by local transport.',
  'A planning share for entry tickets and small activities. Check each venue for current fees.',
];
const money = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export const ItineraryCostDonutChart: React.FC<Props> = ({ itinerary, selectedCityName, initialBudgetTier = 'moderate', daysCount, startDate, guests = 1, originCity = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const city = itinerary.city || selectedCityName;
  const tier = tiers[initialBudgetTier] || tiers.moderate;
  const days = Math.max(1, daysCount || itinerary.days_count || 1);
  const party = Math.max(1, guests);
  const totalMin = tier.min * days * party;
  const totalMax = tier.max * days * party;
  const activeIndex = hoveredIndex ?? selectedIndex;
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const stayParams = new URLSearchParams({
    ss: `${city}, India`, group_adults: String(party), no_rooms: String(Math.max(1, Math.ceil(party / 2))),
    nflt: 'class=3;class=4;class=5',
  });
  if (startDate) {
    const checkout = new Date(`${startDate}T12:00:00`);
    checkout.setDate(checkout.getDate() + days);
    stayParams.set('checkin', startDate);
    stayParams.set('checkout', checkout.toISOString().slice(0, 10));
  }
  const dateQuery = startDate ? ` from ${startDate}` : '';
  const routeQuery = originCity.trim() ? ` from ${originCity.trim()} to ${city}` : ` to ${city}`;
  const searches = [
    { icon: BedDouble, label: '3–5 star stays', text: 'Check dates & current rates', href: `https://www.booking.com/searchresults.html?${stayParams.toString()}` },
    { icon: TrainFront, label: 'Rail', text: 'Search route on IRCTC', href: 'https://www.irctc.co.in/nget/train-search' },
    { icon: Plane, label: 'Flights', text: 'Search live flight options', href: `https://www.google.com/travel/flights?q=${encodeURIComponent(`flights${routeQuery}${dateQuery}`)}` },
    ...(originCity.trim() ? [{ icon: MapPin, label: 'Road route', text: 'Open driving directions', href: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originCity.trim())}&destination=${encodeURIComponent(city)}&travelmode=driving` }] : []),
    { icon: Ticket, label: 'Attraction tickets', text: 'Check official venue details', href: `https://www.google.com/search?q=${encodeURIComponent(`${city} official monument ticket booking opening hours`)}` },
    { icon: Utensils, label: 'Restaurants', text: 'Explore local restaurants', href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`restaurants in ${city}`)}` },
  ];

  return (
    <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50/60 to-orange-50/70 p-5 shadow-sm sm:p-7" aria-labelledby="trip-cost-heading">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-800"><IndianRupee className="h-4 w-4" /> Trip budget estimate</div>
          <h3 id="trip-cost-heading" className="mt-1 font-serif text-xl font-bold text-stone-900">Expected costs in {city}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-700">A planning range for the selected {tier.label.toLowerCase()} tier. It is not a live quote. Flight or train tickets to {city} are excluded because the departure city and live fares can change the total considerably.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-700">{days} {days === 1 ? 'day' : 'days'}</span>
            <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 font-semibold text-stone-700">{party} {party === 1 ? 'traveller' : 'travellers'}</span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 font-semibold text-orange-900">{tier.label} assumptions</span>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-5 self-center lg:w-[min(100%,460px)] lg:flex-row lg:items-start">
          <div className="relative grid h-40 w-40 shrink-0 place-items-center" role="group" aria-label="Interactive trip expense chart. Hover, focus, or select a colour for details.">
            <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90 overflow-visible" aria-hidden="true">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="25" />
              {categoryNames.map((name, index) => {
                const preceding = tier.shares.slice(0, index).reduce((sum, share) => sum + share, 0);
                const segmentLength = (tier.shares[index] / 100) * circumference;
                const gap = 2.5;
                const isActive = activeIndex === index;
                return <circle key={name} cx="70" cy="70" r={radius} fill="none" stroke={categoryColors[index]} strokeWidth={isActive ? 30 : 25}
                  strokeDasharray={`${Math.max(0, segmentLength - gap)} ${circumference - Math.max(0, segmentLength - gap)}`}
                  strokeDashoffset={-(preceding / 100) * circumference} strokeLinecap="butt"
                  className="cursor-pointer transition-all duration-200 ease-out hover:brightness-110 focus-visible:outline-none"
                  style={{ opacity: activeIndex === null || isActive ? 1 : 0.55, filter: isActive ? `drop-shadow(0 2px 5px ${categoryColors[index]}66)` : undefined, pointerEvents: 'stroke' }}
                  role="button" tabIndex={0} aria-label={`${name}: ${tier.shares[index]} percent, ${money(Math.round(tier.min * tier.shares[index] / 100))} to ${money(Math.round(tier.max * tier.shares[index] / 100))} per person per day`}
                  aria-pressed={selectedIndex === index}
                  onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)} onBlur={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex((current) => current === index ? null : index)}
                  onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedIndex((current) => current === index ? null : index); } }} />;
              })}
            </svg>
            <div className="pointer-events-none absolute grid h-[5.8rem] w-[5.8rem] content-center rounded-full bg-white text-center shadow-inner">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-stone-500">Per person · day</span>
              <strong className="text-sm text-stone-900">{money(tier.min)}</strong>
              <span className="text-[9px] text-stone-500">to {money(tier.max)}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2.5 text-xs">
            {categoryNames.map((name, index) => {
              const share = tier.shares[index];
              const low = Math.round((tier.min * share) / 100);
              const high = Math.round((tier.max * share) / 100);
              const segmentTripLow = low * days * party;
              const segmentTripHigh = high * days * party;
              return <button key={name} type="button" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)} onFocus={() => setHoveredIndex(index)} onBlur={() => setHoveredIndex(null)} onClick={() => setSelectedIndex((current) => current === index ? null : index)} aria-pressed={selectedIndex === index}
                className={`w-full rounded-xl px-2.5 py-2 text-left transition duration-200 ${activeIndex === index ? 'bg-white shadow-sm ring-1' : 'hover:bg-white/70'}`} style={{ ['--tw-ring-color' as string]: activeIndex === index ? `${categoryColors[index]}55` : undefined }}>
                <span className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 font-bold text-stone-800"><span className="h-3 w-3 rounded-full ring-2 ring-white shadow-sm" style={{ backgroundColor: categoryColors[index] }} />{name}</span><span className="font-bold" style={{ color: categoryColors[index] }}>{share}%</span></span>
                <span className="mt-0.5 block pl-5 text-stone-500">{money(low)}–{money(high)} / person / day</span>
                {activeIndex === index && <span className="mt-2 block border-t border-stone-100 pt-2 leading-relaxed text-stone-600">{categoryDescriptions[index]}<span className="mt-1 block font-semibold" style={{ color: categoryColors[index] }}>About {money(segmentTripLow)}–{money(segmentTripHigh)} across this trip</span></span>}
              </button>;
            })}
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-orange-200 bg-white p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div><span className="text-xs font-bold uppercase tracking-wide text-stone-500">Estimated on-trip spend</span><div className="mt-1 text-xl font-extrabold text-stone-900">{money(totalMin)}–{money(totalMax)} <span className="text-sm font-semibold text-stone-500">for {party} · {days} {days === 1 ? 'day' : 'days'}</span></div></div>
          <span className="text-xs text-stone-500">{money(tier.min)}–{money(tier.max)} per person per day</span>
        </div>
        <div className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-stone-600"><Info className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" /><p>Planning assumptions: lodging, meals, local travel and entry/miscellaneous are split by tier. Actual venue prices and stay rates depend on dates, season and choices; use the links below to check the current amount before booking.</p></div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {searches.map((item) => {
          const Icon = item.icon;
          return <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md">
            <Icon className="h-5 w-5 text-orange-700" /><div className="mt-3 font-bold text-stone-900">{item.label}</div>
            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-orange-800 group-hover:underline">{item.text}<ExternalLink className="h-3.5 w-3.5" /></div>
          </a>;
        })}
      </div>
    </section>
  );
};
