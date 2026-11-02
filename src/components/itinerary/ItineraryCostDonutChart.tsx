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
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Star,
  Award,
  ArrowRight,
  Landmark,
  Building,
} from 'lucide-react';
import { ItineraryResponse } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCityTravelIntelligence } from '../../data/cityTravelIntelligence';

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
  const { currentLanguage } = useLanguage();
  const [activeIntelTab, setActiveIntelTab] = useState<'stays' | 'trains' | 'flights' | 'asi' | 'dining'>('stays');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [costViewMode, setCostViewMode] = useState<'total' | 'daily'>('total');

  const city = itinerary.city || selectedCityName;
  const cityIntel = getCityTravelIntelligence(city, itinerary.state);
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

      {/* In-App Real-World Travel Intelligence Dossier */}
      <div className="mt-8 pt-6 border-t border-stone-200/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div className="text-xs font-bold uppercase tracking-wider text-orange-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>
              {currentLanguage === 'hi'
                ? `${city} हेतु इन-ऐप सत्यापित यात्रा गाइड एवं वास्तविक विवरण`
                : `In-App Verified Real-World Travel Intelligence for ${city}`}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            {currentLanguage === 'hi' ? 'सत्यापित ऑन-ग्राउंड डेटा' : 'Verified On-Ground Intelligence'}
          </span>
        </div>

        {/* Tab Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-5">
          {[
            {
              id: 'stays' as const,
              icon: BedDouble,
              label: currentLanguage === 'hi' ? 'सत्यापित आवास' : 'Verified Stays',
              subtext: currentLanguage === 'hi' ? 'होटल व हेरिटेज हवेलियां' : `${cityIntel.stays.length} Curated Options`,
            },
            {
              id: 'trains' as const,
              icon: TrainFront,
              label: currentLanguage === 'hi' ? 'आईआरसीटीसी रेल' : 'IRCTC Trains',
              subtext: currentLanguage === 'hi' ? 'वंदे भारत व मुख्य मार्ग' : `${cityIntel.trains.premierTrains.length} Premier Services`,
            },
            {
              id: 'flights' as const,
              icon: Plane,
              label: currentLanguage === 'hi' ? 'उड़ान व एयरपोर्ट' : 'Flight Fares',
              subtext: currentLanguage === 'hi' ? 'हवाई अड्डा व टैक्सी' : 'Airport & Transit',
            },
            {
              id: 'asi' as const,
              icon: Ticket,
              label: currentLanguage === 'hi' ? 'एएसआई स्मारक टिकट' : 'ASI Monuments',
              subtext: currentLanguage === 'hi' ? 'आधिकारिक दरें व समय' : 'Official Entry Rates',
            },
            {
              id: 'dining' as const,
              icon: Utensils,
              label: currentLanguage === 'hi' ? 'प्रसिद्ध भोजनालय' : 'Local Dining',
              subtext: currentLanguage === 'hi' ? 'प्रतिष्ठित खान-पान स्थल' : `${cityIntel.dining.length} Iconic Eateries`,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeIntelTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveIntelTab(tab.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-orange-600 to-amber-700 text-white border-orange-600 shadow-md scale-[1.02]'
                    : 'bg-white border-stone-200 text-stone-800 hover:border-orange-300 hover:bg-orange-50/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-amber-200' : 'text-orange-700'}`} />
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />}
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-stone-900'}`}>
                    {tab.label}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-orange-100' : 'text-stone-500'}`}>
                    {tab.subtext}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic In-App Intelligence Content Area */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs">
          {/* TAB 1: VERIFIED STAYS */}
          {activeIntelTab === 'stays' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div>
                  <h4 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-orange-600" />
                    {currentLanguage === 'hi'
                      ? `${city} में सत्यापित हेरिटेज हवेलियां व आरामदायक आवास`
                      : `Verified Heritage Havelis & Curated Stays in ${city}`}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {currentLanguage === 'hi'
                      ? 'ऑन-साइट सत्यापित दरें, हेरिटेज सुविधाएं व आधिकारिक बुकिंग परामर्श'
                      : 'On-site verified tariff brackets, heritage amenities, and booking guidelines'}
                  </p>
                </div>
                <a
                  href={`https://www.booking.com/searchresults.html?${stayParams.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-orange-700 hover:text-orange-800 inline-flex items-center gap-1 hover:underline shrink-0"
                >
                  {currentLanguage === 'hi' ? 'लाइव उपलब्धता देखें' : 'Optional live rates on Booking.com'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cityIntel.stays.map((stay) => (
                  <div
                    key={stay.id}
                    className="rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-orange-300 hover:shadow-md transition-all p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          {stay.category}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{stay.rating}</span>
                          <span className="text-stone-400 font-normal">({stay.reviewCount})</span>
                        </div>
                      </div>

                      <h5 className="text-sm font-bold text-stone-900 font-serif">{stay.name}</h5>
                      <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{stay.locality}</span>
                      </div>

                      <div className="mt-2.5 inline-block px-2.5 py-1 rounded-lg bg-orange-100/70 text-orange-950 font-bold text-xs font-mono">
                        {stay.priceRange}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {stay.amenities.map((am, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700"
                          >
                            ✓ {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-200/70 text-[11px] text-stone-600 flex items-start gap-1.5 bg-amber-50/50 p-2 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-stone-800">Tip:</strong> {stay.bookingTip}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: IRCTC TRAINS & CONNECTIVITY */}
          {activeIntelTab === 'trains' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div>
                  <h4 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                    <TrainFront className="w-4 h-4 text-orange-600" />
                    {currentLanguage === 'hi'
                      ? `${city} हेतु भारतीय रेल (IRCTC) प्रमुख मार्ग एवं किराया संरचना`
                      : `Indian Railways (IRCTC) Connectivity & Route Intelligence for ${city}`}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {currentLanguage === 'hi'
                      ? 'वंदे भारत, शताब्दी व सुपरफास्ट ट्रेनों का समय एवं आधिकारिक श्रेणी किराया'
                      : 'Vande Bharat, Shatabdi & Superfast services with official class fare breakdown'}
                  </p>
                </div>
                <a
                  href="https://www.irctc.co.in/nget/train-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-orange-700 hover:text-orange-800 inline-flex items-center gap-1 hover:underline shrink-0"
                >
                  {currentLanguage === 'hi' ? 'IRCTC.co.in पोर्टल खोलें' : 'Open IRCTC.co.in directly'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Station Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {cityIntel.trains.stations.map((st, i) => (
                  <div key={i} className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                    <div className="text-[11px] text-stone-500 font-medium">Railway Station</div>
                    <div className="text-sm font-bold text-stone-900 flex items-center justify-between">
                      <span>{st.name}</span>
                      <span className="font-mono bg-orange-100 text-orange-900 px-2 py-0.5 rounded text-xs">
                        {st.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 mt-1">
                      {st.distanceToCenter} • {st.platforms} Platforms
                    </div>
                  </div>
                ))}
              </div>

              {/* Premier Trains List */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  {currentLanguage === 'hi' ? 'प्रमुख एक्सप्रेस व वंदे भारत सेवाएं' : 'Premier Express & Vande Bharat Services'}
                </h5>
                <div className="space-y-2.5">
                  {cityIntel.trains.premierTrains.map((tr, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl border border-stone-200 bg-amber-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{tr.name}</span>
                          <span className="text-[10px] font-mono bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">
                            {tr.trainNo}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 mt-0.5">
                          {tr.route} • <strong className="text-orange-800">{tr.travelTime}</strong>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{tr.highlights}</div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-stone-700 shrink-0 self-start sm:self-center">
                        {tr.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class Fares */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
                  {currentLanguage === 'hi' ? 'आधिकारिक आईआरसीटीसी श्रेणी किराया' : 'Official IRCTC Travel Class Fares'}
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {cityIntel.trains.classFares.map((cf, i) => (
                    <div key={i} className="p-3 rounded-xl border border-stone-200 bg-white">
                      <div className="text-[11px] font-bold text-stone-500">{cf.code}</div>
                      <div className="text-xs font-extrabold text-stone-900 truncate">{cf.tier.split(' ')[0]}</div>
                      <div className="text-sm font-mono font-bold text-orange-700 mt-1">{cf.typicalFare}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5 leading-tight">{cf.amenities}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transit Advice */}
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-900">
                    {currentLanguage === 'hi' ? 'स्टेशन परिवहन सलाह: ' : 'Station Exit Transit Advice: '}
                  </strong>
                  {cityIntel.trains.transitAdvice}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLIGHTS & AIRPORT TRANSIT */}
          {activeIntelTab === 'flights' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div>
                  <h4 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                    <Plane className="w-4 h-4 text-orange-600" />
                    {currentLanguage === 'hi'
                      ? `${city} हवाई अड्डा व सीधी विमान सेवाएं`
                      : `Airport & Nonstop Aerial Transit for ${city}`}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {currentLanguage === 'hi'
                      ? 'प्रमुख हवाई संपर्क, औसत किराया दरें व प्रीपेड टैक्सी दरें'
                      : 'Major flight corridors, typical one-way fare ranges, and prepaid airport transit'}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/travel/flights?q=${encodeURIComponent(`flights${routeQuery}${dateQuery}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-orange-700 hover:text-orange-800 inline-flex items-center gap-1 hover:underline shrink-0"
                >
                  {currentLanguage === 'hi' ? 'गूगल फ्लाइट्स देखें' : 'View Google Flights'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Airport Details */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <div>
                    <div className="text-xs text-stone-500 font-semibold">Commercial Airport</div>
                    <div className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                      <span>{cityIntel.flights.airportName}</span>
                      <span className="font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs font-bold">
                        {cityIntel.flights.iataCode}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mt-0.5">{cityIntel.flights.terminal}</div>
                  </div>

                  <div>
                    <div className="text-xs text-stone-500 font-semibold mb-1">
                      {currentLanguage === 'hi' ? 'सीधे हवाई मार्ग (उड़ानें)' : 'Major Direct Flight Hubs'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cityIntel.flights.majorDirectHubs.map((hub, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-stone-800"
                        >
                          ✈ {hub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-xs text-stone-500">
                      {currentLanguage === 'hi' ? 'विमान किराया मानक: ' : 'Typical Economy Fare: '}
                    </span>
                    <strong className="text-orange-800 font-mono text-sm">
                      {cityIntel.flights.typicalOneWayFare}
                    </strong>
                  </div>
                </div>

                {/* Transit into City */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-stone-500 font-semibold mb-1">
                      {currentLanguage === 'hi' ? 'हवाई अड्डे से शहर केंद्र आवागमन' : 'Transit from Airport to City Center'}
                    </div>
                    <div className="space-y-1.5 text-xs text-stone-700">
                      <div>
                        <strong>Distance:</strong> {cityIntel.flights.transitToCityCenter.distanceKm}
                      </div>
                      <div>
                        <strong>Estimated Time:</strong> {cityIntel.flights.transitToCityCenter.travelTime}
                      </div>
                      <div>
                        <strong>Prepaid Taxi Fare:</strong>{' '}
                        <span className="font-mono font-bold text-emerald-800">
                          {cityIntel.flights.transitToCityCenter.prepaidTaxiFare}
                        </span>
                      </div>
                      <div>
                        <strong>Public Metro / Bus:</strong>{' '}
                        {cityIntel.flights.transitToCityCenter.metroOrBusOption}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-amber-950 border border-amber-200">
                    ℹ {cityIntel.flights.travelerNote}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ASI MONUMENTS & ENTRY TICKETS */}
          {activeIntelTab === 'asi' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div>
                  <h4 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-orange-600" />
                    {currentLanguage === 'hi'
                      ? `${city} में भारतीय पुरातत्व सर्वेक्षण (ASI) स्मारक व टिकट दरें`
                      : `Archaeological Survey of India (ASI) Official Entry Tickets for ${city}`}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {currentLanguage === 'hi'
                      ? 'आधिकारिक टिकट मूल्य, निःशुल्क प्रवेश नियम एवं स्मारक खुलने का समय'
                      : 'Verified ticket tariffs, free entry rules, and official monument visiting hours'}
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {currentLanguage === 'hi' ? '15 वर्ष से कम आयु हेतु निःशुल्क प्रवेश' : 'Free Entry Under 15 Years'}
                </div>
              </div>

              {/* Universal ASI Rules */}
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 space-y-1.5 text-xs text-amber-950">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-orange-700" />
                  {currentLanguage === 'hi' ? 'आधिकारिक ASI राष्ट्रीय दिशा-निर्देश' : 'Official ASI National Regulations'}
                </div>
                {cityIntel.asiMonuments.generalRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-orange-700 font-bold">•</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Monument Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cityIntel.asiMonuments.monuments.map((mon, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-orange-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                          {mon.monumentType}
                        </span>
                        {mon.qrKioskAvailable && (
                          <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> QR Ticket Kiosk
                          </span>
                        )}
                      </div>

                      <h5 className="text-sm font-bold text-stone-900 font-serif">{mon.name}</h5>
                      <div className="text-xs text-stone-600 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{mon.timings}</span>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2 rounded-xl border border-stone-200">
                          <div className="text-[10px] text-stone-500 font-semibold">
                            {currentLanguage === 'hi' ? 'भारतीय नागरिक' : 'Indian / Domestic'}
                          </div>
                          <div className="text-xs font-mono font-bold text-stone-900 mt-0.5">
                            {mon.domesticFee}
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-stone-200">
                          <div className="text-[10px] text-stone-500 font-semibold">SAARC / BIMSTEC</div>
                          <div className="text-xs font-mono font-bold text-stone-900 mt-0.5">
                            {mon.saarcFee}
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-stone-200">
                          <div className="text-[10px] text-stone-500 font-semibold">
                            {currentLanguage === 'hi' ? 'विदेशी पर्यटक' : 'Foreign Tourists'}
                          </div>
                          <div className="text-xs font-mono font-bold text-orange-700 mt-0.5">
                            {mon.foreignFee}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 text-[11px] text-stone-600 border-t border-stone-200/60">
                      <strong>Highlights:</strong> {mon.highlights}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LOCAL DINING & LEGENDARY EATERIES */}
          {activeIntelTab === 'dining' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                <div>
                  <h4 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-orange-600" />
                    {currentLanguage === 'hi'
                      ? `${city} के सुप्रसिद्ध व ऐतिहासिक खान-पान संस्थान`
                      : `Iconic Culinary Institutions & Legendary Eateries in ${city}`}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {currentLanguage === 'hi'
                      ? 'दशकों पुरानी प्रतिष्ठित दुकानें, हस्ताक्षर व्यंजन व औसत खर्च'
                      : 'Decades-old heritage spots, signature specialties, and average spend for two'}
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                  {cityIntel.dining.length} {currentLanguage === 'hi' ? 'प्रमाणित संस्थान' : 'Verified Institutions'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cityIntel.dining.map((eat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/40 hover:bg-white hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-mono text-stone-500 font-semibold">
                          Est. {eat.established}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            eat.isPureVeg
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {eat.isPureVeg ? 'Pure Veg' : 'Non-Veg / Multi'}
                        </span>
                      </div>

                      <h5 className="text-sm font-bold text-stone-900 font-serif">{eat.name}</h5>
                      <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{eat.locality}</span>
                      </div>

                      <div className="mt-2 text-xs text-stone-700">
                        <span className="text-stone-500">Spend for two: </span>
                        <strong className="text-stone-900 font-mono">{eat.spendForTwo}</strong>
                      </div>

                      <div className="mt-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                          Signature Specialties:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {eat.signatureDishes.map((dish, dIdx) => (
                            <span
                              key={dIdx}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-800 font-medium"
                            >
                              {dish}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 text-[11px] text-stone-600 border-t border-stone-200/60 bg-amber-50/40 p-2 rounded-xl">
                      🍴 <strong className="text-stone-800">Must Try:</strong> {eat.mustTryNote}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
