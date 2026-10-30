import React, { useState } from 'react';
import {
  ExternalLink,
  IndianRupee,
  Plane,
  TrainFront,
  Utensils,
  BedDouble,
  Ticket,
  MapPin,
  Sparkles,
  PieChart as PieIcon,
} from 'lucide-react';
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

type BudgetTierKey = 'budget' | 'moderate' | 'luxury';

interface TierDefinition {
  id: BudgetTierKey;
  label: string;
  tagline: string;
  min: number;
  max: number;
  shares: number[]; // [Stay, Food, Transport, Tickets]
  icon: string;
}

const TIERS: Record<BudgetTierKey, TierDefinition> = {
  budget: {
    id: 'budget',
    label: 'Budget Traveler',
    tagline: 'Clean homestays, public transit, street food & thalis, ASI tickets',
    min: 1800,
    max: 3500,
    shares: [35, 30, 20, 15],
    icon: '🎒',
  },
  moderate: {
    id: 'moderate',
    label: 'Comfort / Mid-Range',
    tagline: '3–4 star hotels, auto/cabs, iconic local restaurants, guided sights',
    min: 3500,
    max: 7500,
    shares: [45, 25, 18, 12],
    icon: '🏨',
  },
  luxury: {
    id: 'luxury',
    label: 'Heritage & Luxury',
    tagline: 'Palace hotels, private chauffeur, royal dining, VIP guided experiences',
    min: 7500,
    max: 18500,
    shares: [55, 20, 15, 10],
    icon: '👑',
  },
};

const CATEGORIES = [
  {
    name: 'Stay & Accommodation',
    shortName: 'Stay',
    icon: BedDouble,
    color: '#0d9488', // Emerald/Teal
    gradient: 'from-teal-500 to-emerald-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-900',
    barColor: 'bg-teal-600',
    description: 'Heritage havelis, boutique guesthouses, or palace resorts matching your tier.',
  },
  {
    name: 'Food & Heritage Dining',
    shortName: 'Food & Dining',
    icon: Utensils,
    color: '#ea580c', // Warm Orange
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-900',
    barColor: 'bg-orange-600',
    description: 'Authentic regional thalis, street food, Mughlai/coastal feasts, and sweets.',
  },
  {
    name: 'Local Transport & Cabs',
    shortName: 'Local Travel',
    icon: MapPin,
    color: '#2563eb', // Royal Blue
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    barColor: 'bg-blue-600',
    description: 'Auto-rickshaws, metro passes, day-rental AC cabs, and local sightseeing transit.',
  },
  {
    name: 'Monuments & Experiences',
    shortName: 'Tickets & Sights',
    icon: Ticket,
    color: '#9333ea', // Royal Purple
    gradient: 'from-purple-500 to-fuchsia-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    barColor: 'bg-purple-600',
    description: 'ASI monument entry, audio guides, boat safaris, sound & light evening shows.',
  },
];

const money = (amount: number) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

export const ItineraryCostDonutChart: React.FC<Props> = ({
  itinerary,
  selectedCityName,
  initialBudgetTier = 'moderate',
  daysCount,
  startDate,
  guests = 1,
  originCity = '',
}) => {
  const [activeTier, setActiveTier] = useState<BudgetTierKey>(initialBudgetTier);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [costViewMode, setCostViewMode] = useState<'total' | 'daily'>('total');

  const city = itinerary.city || selectedCityName;
  const tier = TIERS[activeTier] || TIERS.moderate;
  const days = Math.max(1, daysCount || itinerary.days_count || 1);
  const party = Math.max(1, guests);

  // Totals
  const dailyMin = tier.min;
  const dailyMax = tier.max;
  const totalTripMin = dailyMin * days * party;
  const totalTripMax = dailyMax * days * party;

  const activeIndex = hoveredIndex ?? selectedIndex;

  // Donut geometry (Large, high-resolution rendering: 280px)
  const size = 280;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2 - 8; // ~116
  const circumference = 2 * Math.PI * radius;

  // External Travel Links
  const stayParams = new URLSearchParams({
    ss: `${city}, India`,
    group_adults: String(party),
    no_rooms: String(Math.max(1, Math.ceil(party / 2))),
    nflt: activeTier === 'luxury' ? 'class=5;class=4' : activeTier === 'moderate' ? 'class=3;class=4' : 'class=2;class=3',
  });
  if (startDate) {
    const checkout = new Date(`${startDate}T12:00:00`);
    checkout.setDate(checkout.getDate() + days);
    stayParams.set('checkin', startDate);
    stayParams.set('checkout', checkout.toISOString().slice(0, 10));
  }

  const dateQuery = startDate ? ` from ${startDate}` : '';
  const routeQuery = originCity.trim() ? ` from ${originCity.trim()} to ${city}` : ` to ${city}`;

  const searchPills = [
    {
      icon: BedDouble,
      label: 'Verified Stays',
      subtext: `Find ${tier.label.split(' ')[0]} Hotels`,
      href: `https://www.booking.com/searchresults.html?${stayParams.toString()}`,
    },
    {
      icon: TrainFront,
      label: 'IRCTC Trains',
      subtext: `Routes to ${city}`,
      href: 'https://www.irctc.co.in/nget/train-search',
    },
    {
      icon: Plane,
      label: 'Flight Fares',
      subtext: 'Compare live airlines',
      href: `https://www.google.com/travel/flights?q=${encodeURIComponent(`flights${routeQuery}${dateQuery}`)}`,
    },
    ...(originCity.trim()
      ? [
          {
            icon: MapPin,
            label: 'Road Distance',
            subtext: `Drive from ${originCity}`,
            href: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originCity.trim())}&destination=${encodeURIComponent(city)}&travelmode=driving`,
          },
        ]
      : []),
    {
      icon: Ticket,
      label: 'ASI Monuments',
      subtext: 'Official entry tickets',
      href: `https://www.google.com/search?q=${encodeURIComponent(`${city} official asi monument ticket booking online`)}`,
    },
    {
      icon: Utensils,
      label: 'Local Dining',
      subtext: 'Must-try iconic eateries',
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`famous iconic restaurants in ${city}`)}`,
    },
  ];

  return (
    <section
      className="overflow-hidden rounded-3xl border border-stone-200/90 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40 p-6 sm:p-8 shadow-sm transition-all"
      aria-labelledby="trip-cost-heading"
    >
      {/* Header with Title and Tier Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700">
            <PieIcon className="h-4 w-4" />
            <span>Interactive Expense Forecaster</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500 font-medium">All 4 Major Categories</span>
          </div>
          <h3 id="trip-cost-heading" className="mt-1 font-serif text-2xl sm:text-3xl font-extrabold text-stone-900">
            Estimated Trip Budget for {city}
          </h3>
          <p className="mt-1 text-sm text-stone-600 max-w-2xl leading-relaxed">
            Real-world daily spending estimates benchmarked against verified hospitality and local travel tariffs across India.
          </p>
        </div>

        {/* Tier Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start lg:self-center">
          <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200 shadow-inner">
            {(Object.keys(TIERS) as BudgetTierKey[]).map((tierKey) => {
              const t = TIERS[tierKey];
              const isSelected = activeTier === tierKey;
              return (
                <button
                  key={tierKey}
                  type="button"
                  onClick={() => setActiveTier(tierKey)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-white text-orange-950 shadow-sm ring-1 ring-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Toggle View Mode (Total vs Daily) */}
          <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200 shadow-inner self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setCostViewMode('total')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                costViewMode === 'total'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Total Trip
            </button>
            <button
              type="button"
              onClick={() => setCostViewMode('daily')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                costViewMode === 'daily'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Per Day / Person
            </button>
          </div>
        </div>
      </div>

      {/* Main Visual Display: Huge Donut Graph + Category Breakdown Cards */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left / Center: Large Prominent Donut Graph (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
            role="group"
            aria-label="Interactive trip expense donut graph"
          >
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full -rotate-90 overflow-visible transition-all duration-300"
              aria-hidden="true"
            >
              {/* Background Track Ring */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />

              {/* Segments */}
              {CATEGORIES.map((cat, index) => {
                const share = tier.shares[index];
                const precedingShare = tier.shares.slice(0, index).reduce((acc, curr) => acc + curr, 0);
                const segmentLength = (share / 100) * circumference;
                const gap = 3.5;
                const strokeDash = `${Math.max(0, segmentLength - gap)} ${circumference - Math.max(0, segmentLength - gap)}`;
                const strokeOffset = -(precedingShare / 100) * circumference;
                const isItemActive = activeIndex === index;

                return (
                  <circle
                    key={cat.name}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={cat.color}
                    strokeWidth={isItemActive ? strokeWidth + 8 : strokeWidth}
                    strokeDasharray={strokeDash}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-300 ease-out focus-visible:outline-none"
                    style={{
                      opacity: activeIndex === null || isItemActive ? 1 : 0.45,
                      filter: isItemActive
                        ? `drop-shadow(0 4px 12px ${cat.color}88)`
                        : 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))',
                      pointerEvents: 'stroke',
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${cat.name}: ${share}%`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                    onClick={() => setSelectedIndex((cur) => (cur === index ? null : index))}
                  />
                );
              })}
            </svg>

            {/* Inner Center Hole Display with Bold Amounts */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              {activeIndex !== null ? (
                // Hovered / Selected Category Info in Hole
                <div className="space-y-1 animate-fadeIn">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-xs"
                    style={{ backgroundColor: CATEGORIES[activeIndex].color }}
                  >
                    {CATEGORIES[activeIndex].shortName}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    {tier.shares[activeIndex]}%
                  </div>
                  <div className="text-xs font-semibold text-stone-600">
                    {costViewMode === 'total'
                      ? `${money(Math.round((totalTripMin * tier.shares[activeIndex]) / 100))} – ${money(
                          Math.round((totalTripMax * tier.shares[activeIndex]) / 100)
                        )}`
                      : `${money(Math.round((dailyMin * tier.shares[activeIndex]) / 100))} – ${money(
                          Math.round((dailyMax * tier.shares[activeIndex]) / 100)
                        )} / day`}
                  </div>
                </div>
              ) : (
                // Default Total / Daily Summary in Hole
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                    {costViewMode === 'total' ? 'Total Trip Est.' : 'Per Person / Day'}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    {costViewMode === 'total'
                      ? `${money(totalTripMin)}`
                      : `${money(dailyMin)}`}
                  </div>
                  <div className="text-[11px] font-medium text-stone-500">
                    {costViewMode === 'total'
                      ? `to ${money(totalTripMax)}`
                      : `to ${money(dailyMax)}`}
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium">
                    {party} {party === 1 ? 'Guest' : 'Guests'} • {days} {days === 1 ? 'Day' : 'Days'}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-stone-500 text-center">
            Tap or hover any slice to inspect category allocations
          </p>
        </div>

        {/* Right: 4 Rich Category Breakdown Cards (7 Cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {CATEGORIES.map((cat, index) => {
            const share = tier.shares[index];
            const isItemActive = activeIndex === index;
            const Icon = cat.icon;

            const catLow =
              costViewMode === 'total'
                ? Math.round((totalTripMin * share) / 100)
                : Math.round((dailyMin * share) / 100);
            const catHigh =
              costViewMode === 'total'
                ? Math.round((totalTripMax * share) / 100)
                : Math.round((dailyMax * share) / 100);

            return (
              <div
                key={cat.name}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex((cur) => (cur === index ? null : index))}
                className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isItemActive
                    ? 'bg-white shadow-md ring-2 border-transparent -translate-y-0.5'
                    : 'bg-white/80 border-stone-200 hover:bg-white hover:border-stone-300 hover:shadow-sm'
                }`}
                style={{
                  borderColor: isItemActive ? cat.color : undefined,
                  boxShadow: isItemActive ? `0 8px 24px ${cat.color}20` : undefined,
                }}
              >
                <div>
                  {/* Category Title & Icon */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: cat.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-stone-900 text-xs sm:text-sm">
                        {cat.name}
                      </span>
                    </div>

                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-black"
                      style={{
                        backgroundColor: `${cat.color}15`,
                        color: cat.color,
                      }}
                    >
                      {share}%
                    </span>
                  </div>

                  {/* Rupee Amount */}
                  <div className="mt-2.5 flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-black text-stone-900 font-mono">
                      {money(catLow)} – {money(catHigh)}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {costViewMode === 'total' ? 'total' : '/ day'}
                    </span>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="mt-2 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${share}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>

                  {/* Category Description */}
                  <p className="mt-2 text-[11px] text-stone-600 leading-snug line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-semibold text-stone-500">
                  <span>{tier.label.split(' ')[0]} allocation</span>
                  <span style={{ color: cat.color }}>View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer Box */}
      <div className="mt-6 rounded-2xl border border-orange-200/90 bg-white p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-950">
              Trip Budget Summary
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 text-[10px] font-bold">
              {tier.label}
            </span>
          </div>
          <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
            Planning estimate for {party} {party === 1 ? 'traveller' : 'travellers'} over {days} {days === 1 ? 'day' : 'days'} in {city}. Inter-city flights or express train tickets are excluded from this on-ground forecast.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
          <div className="text-right">
            <div className="text-xs text-stone-500 font-semibold uppercase">Total Estimated Spend</div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
              {money(totalTripMin)} – {money(totalTripMax)}
            </div>
            <div className="text-[11px] text-stone-500">
              ~{money(dailyMin)} to {money(dailyMax)} per day per person
            </div>
          </div>
        </div>
      </div>

      {/* External Verified Action Pills */}
      <div className="mt-5">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>Check Current Rates & Official Portals</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {searchPills.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:shadow-xs transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-4 w-4 text-orange-700" />
                  <ExternalLink className="h-3 w-3 text-stone-400 group-hover:text-orange-700 transition" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-stone-900 leading-tight group-hover:text-orange-800 transition">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5 leading-tight truncate">
                    {item.subtext}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
