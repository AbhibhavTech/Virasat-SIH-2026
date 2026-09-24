import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  IndianRupee,
  Users,
  Sparkles,
  TrendingDown,
  Check,
  Info,
} from 'lucide-react';
import { ItineraryResponse } from '../../types';

export interface CostCategoryItem {
  id: 'transport' | 'lodging' | 'activities' | 'meals';
  name: string;
  shortName: string;
  icon: string;
  color: string;
  hoverColor: string;
  lightBg: string;
  textColor: string;
  borderColor: string;
  description: string;
  inclusions: string[];
  amount: number;
  minAmount: number;
  maxAmount: number;
  percentage: number;
}

interface ItineraryCostDonutChartProps {
  itinerary: ItineraryResponse;
  selectedCityName: string;
  initialBudgetTier?: 'budget' | 'moderate' | 'luxury';
  daysCount: number;
}

export const ItineraryCostDonutChart: React.FC<ItineraryCostDonutChartProps> = ({
  itinerary,
  selectedCityName,
  initialBudgetTier = 'moderate',
  daysCount,
}) => {
  const [budgetTier, setBudgetTier] = useState<'budget' | 'moderate' | 'luxury'>(
    initialBudgetTier || 'moderate'
  );
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'total' | 'per_day'>('total');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Sync budget tier if parent prop changes
  useEffect(() => {
    if (initialBudgetTier) {
      setBudgetTier(initialBudgetTier);
    }
  }, [initialBudgetTier]);

  // Compute calculated days
  const effectiveDays = Math.max(1, itinerary.days_count || itinerary.days?.length || daysCount || 1);
  const totalStopsCount = itinerary.stops?.length || (itinerary.days?.reduce((acc, d) => acc + (d.places?.length || 0), 0)) || (effectiveDays * 3);

  // Derive city tier multiplier (Metros vs Heritage hubs)
  const cityMultiplier = useMemo(() => {
    const c = (selectedCityName || '').toLowerCase();
    if (c.includes('mumbai') || c.includes('delhi') || c.includes('bengaluru') || c.includes('goa')) {
      return 1.25;
    }
    if (c.includes('jaipur') || c.includes('agra') || c.includes('udaipur') || c.includes('kochi')) {
      return 1.05;
    }
    return 0.95;
  }, [selectedCityName]);

  // Daily baseline rates per person by tier
  const tierConfig = useMemo(() => {
    switch (budgetTier) {
      case 'budget':
        return {
          transportDaily: 220,
          lodgingDaily: 900,
          activitiesDaily: 250,
          mealsDaily: 450,
          lodgingLabel: 'Heritage Hostels & Budget Haveli Stays',
          diningLabel: 'Authentic Local Dhabas, Street Food & Thalis',
          transportLabel: 'Metro, Suburban Rail & Auto-Rickshaws',
          activitiesLabel: 'Standard ASI Monument & Temple Entry',
        };
      case 'luxury':
        return {
          transportDaily: 1400,
          lodgingDaily: 5800,
          activitiesDaily: 1200,
          mealsDaily: 2200,
          lodgingLabel: '5-Star Heritage Palaces & Luxury Resorts',
          diningLabel: 'Royal Fine Dining & Gourmet Curated Feasts',
          transportLabel: 'Private Chauffeur Sedan & Airport Pickups',
          activitiesLabel: 'VIP Monument Access, Private Historian Guides',
        };
      case 'moderate':
      default:
        return {
          transportDaily: 550,
          lodgingDaily: 2400,
          activitiesDaily: 550,
          mealsDaily: 950,
          lodgingLabel: '3-Star Boutique Haveli & Cozy Hotels',
          diningLabel: 'Popular Heritage Cafes & Multicuisine Dining',
          transportLabel: 'App Cabs, AC Taxis & Auto Rides',
          activitiesLabel: 'ASI Passes, Guided Walks & Audio Tours',
        };
    }
  }, [budgetTier]);

  // Calculate the 4 requested cost categories
  const costBreakdown: CostCategoryItem[] = useMemo(() => {
    // Transport
    const baseTransport = Math.round(tierConfig.transportDaily * effectiveDays * cityMultiplier * travelersCount);
    // Lodging (billed per room: 1-2 travelers = 1 room, 3-4 = 2 rooms)
    const roomsCount = Math.max(1, Math.ceil(travelersCount / 2));
    const baseLodging = Math.round(tierConfig.lodgingDaily * Math.max(1, effectiveDays - 1 || 1) * cityMultiplier * roomsCount);
    // Activities (incorporating verified entry fees from Master Tourism Database)
    const verifiedFeesSum = (itinerary.days || []).reduce((acc, d) => {
      return acc + (d.places || []).reduce((pAcc, p) => pAcc + (typeof p.entry_fee === 'number' ? p.entry_fee : 0), 0);
    }, 0);
    const placeBonus = verifiedFeesSum > 0 ? (verifiedFeesSum * travelersCount) : Math.round(totalStopsCount * 45 * travelersCount);
    const baseActivities = Math.round(tierConfig.activitiesDaily * effectiveDays * travelersCount + placeBonus);
    // Meals (scales per person per day)
    const baseMeals = Math.round(tierConfig.mealsDaily * effectiveDays * travelersCount);

    const total = Math.max(1, baseTransport + baseLodging + baseActivities + baseMeals);

    const items: CostCategoryItem[] = [
      {
        id: 'transport',
        name: 'Transport',
        shortName: 'Transport',
        icon: '🚗',
        color: '#FF671F', // Virasat iconic saffron
        hoverColor: '#EA580C',
        lightBg: 'bg-orange-50',
        textColor: 'text-orange-950',
        borderColor: 'border-orange-200',
        description: tierConfig.transportLabel,
        inclusions: [
          'Inter-monument local transfers',
          'Metro / suburban rail connectivity',
          'Station & airport transit',
          'Local auto-rickshaws',
        ],
        amount: baseTransport,
        minAmount: Math.round((baseTransport * 0.9) / 100) * 100,
        maxAmount: Math.round((baseTransport * 1.15) / 100) * 100,
        percentage: Math.round((baseTransport / total) * 100),
      },
      {
        id: 'lodging',
        name: 'Accommodation',
        shortName: 'Accommodation',
        icon: '🏨',
        color: '#2563EB', // Royal Blue
        hoverColor: '#1D4ED8',
        lightBg: 'bg-blue-50',
        textColor: 'text-blue-950',
        borderColor: 'border-blue-200',
        description: tierConfig.lodgingLabel,
        inclusions: [
          `${effectiveDays > 1 ? effectiveDays - 1 : 1} night(s) stay (${roomsCount} room${roomsCount > 1 ? 's' : ''})`,
          'Verified tourist neighborhoods',
          'Standard breakfast inclusion',
          'Applicable hospitality taxes',
        ],
        amount: baseLodging,
        minAmount: Math.round((baseLodging * 0.9) / 100) * 100,
        maxAmount: Math.round((baseLodging * 1.15) / 100) * 100,
        percentage: Math.round((baseLodging / total) * 100),
      },
      {
        id: 'activities',
        name: 'Activities & Entry Fees',
        shortName: 'Activities & Fees',
        icon: '🎟️',
        color: '#059669', // Emerald Green
        hoverColor: '#047857',
        lightBg: 'bg-emerald-50',
        textColor: 'text-emerald-950',
        borderColor: 'border-emerald-200',
        description: tierConfig.activitiesLabel,
        inclusions: [
          `Verified entry fees for ${totalStopsCount} curated attractions`,
          'Official ASI ticketing counter rates',
          'Audio guide device rentals',
          'Monument camera permissions',
        ],
        amount: baseActivities,
        minAmount: Math.round((baseActivities * 0.9) / 100) * 100,
        maxAmount: Math.round((baseActivities * 1.15) / 100) * 100,
        percentage: Math.round((baseActivities / total) * 100),
      },
      {
        id: 'meals',
        name: 'Food',
        shortName: 'Food',
        icon: '🍲',
        color: '#E11D48', // Rose / Crimson
        hoverColor: '#BE123C',
        lightBg: 'bg-rose-50',
        textColor: 'text-rose-950',
        borderColor: 'border-rose-200',
        description: tierConfig.diningLabel,
        inclusions: [
          'Daily regional breakfast, lunch & dinner',
          'Authentic local cuisine & dining',
          'Evening tea & light refreshments',
          'Packaged drinking water',
        ],
        amount: baseMeals,
        minAmount: Math.round((baseMeals * 0.9) / 100) * 100,
        maxAmount: Math.round((baseMeals * 1.15) / 100) * 100,
        percentage: Math.round((baseMeals / total) * 100),
      },
    ];

    // Adjust percentages to sum precisely to 100%
    const sumPercents = items.reduce((acc, it) => acc + it.percentage, 0);
    if (sumPercents !== 100 && items.length > 0) {
      items[0].percentage += (100 - sumPercents);
    }

    return items;
  }, [tierConfig, effectiveDays, cityMultiplier, travelersCount, totalStopsCount]);

  const totalCost = useMemo(() => {
    return costBreakdown.reduce((sum, item) => sum + item.amount, 0);
  }, [costBreakdown]);

  const totalMinCost = useMemo(() => {
    return Math.round((totalCost * 0.9) / 500) * 500;
  }, [totalCost]);

  const totalMaxCost = useMemo(() => {
    return Math.round((totalCost * 1.15) / 500) * 500;
  }, [totalCost]);

  const displayedCostRange = useMemo(() => {
    if (viewMode === 'per_day') {
      const minPerDay = Math.round(totalMinCost / effectiveDays / 100) * 100;
      const maxPerDay = Math.round(totalMaxCost / effectiveDays / 100) * 100;
      return `₹${minPerDay.toLocaleString('en-IN')} – ₹${maxPerDay.toLocaleString('en-IN')}`;
    }
    return `₹${totalMinCost.toLocaleString('en-IN')} – ₹${totalMaxCost.toLocaleString('en-IN')}`;
  }, [viewMode, totalMinCost, totalMaxCost, effectiveDays]);

  // Primary D3 Chart Builder - ONLY rebuilds when cost data changes, NOT on hover
  useEffect(() => {
    if (!svgRef.current) return;
    const width = 280;
    const height = 280;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.63; // Donut hole

    // Clear previous SVG contents
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // D3 Pie generator
    const pie = d3
      .pie<CostCategoryItem>()
      .value((d) => d.amount)
      .sort(null)
      .padAngle(0.04);

    // D3 Arc generator (normal)
    const arc = d3
      .arc<d3.PieArcDatum<CostCategoryItem>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(6);

    const pieData = pie(costBreakdown);

    // Render slices
    const slices = g
      .selectAll('.donut-slice')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'donut-slice')
      .attr('data-id', (d) => d.data.id)
      .style('cursor', 'pointer');

    const paths = slices
      .append('path')
      .attr('class', 'slice-path')
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2.5)
      .attr('d', (d) => arc(d) || '')
      .style('transition', 'transform 0.2s ease-out, opacity 0.2s ease, filter 0.2s ease');

    // Smooth enter animation
    paths
      .transition()
      .duration(600)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Mouse events on slices
    slices
      .on('mouseenter', function (event, d) {
        setHoveredCategory(d.data.id);
      })
      .on('mouseleave', function () {
        setHoveredCategory(null);
      })
      .on('click', function (event, d) {
        event.stopPropagation();
        setSelectedCategory((prev) => (prev === d.data.id ? null : d.data.id));
      });

  }, [costBreakdown]);

  // Secondary Effect for Hover/Active highlights - does NOT recreate the SVG
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const activeTarget = hoveredCategory || selectedCategory;

    svg.selectAll<SVGGElement, d3.PieArcDatum<CostCategoryItem>>('.donut-slice').each(function (d) {
      const isHighlighted = activeTarget ? d.data.id === activeTarget : false;
      const isDimmed = activeTarget ? d.data.id !== activeTarget : false;
      const path = d3.select(this).select('path');

      if (isHighlighted) {
        path
          .style('opacity', '1')
          .style('transform', 'scale(1.04)')
          .style('transform-origin', 'center')
          .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))')
          .attr('stroke-width', 3.5);
      } else {
        path
          .style('opacity', isDimmed ? '0.45' : '1')
          .style('transform', 'scale(1)')
          .style('transform-origin', 'center')
          .style('filter', 'none')
          .attr('stroke-width', 2.5);
      }
    });
  }, [hoveredCategory, selectedCategory]);

  const activeItem = useMemo(() => {
    const targetId = hoveredCategory || selectedCategory;
    if (!targetId) return null;
    return costBreakdown.find((it) => it.id === targetId) || null;
  }, [hoveredCategory, selectedCategory, costBreakdown]);

  return (
    <div
      id="itinerary-cost-breakdown-card"
      className="w-full rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* 1. CARD TOP BAR: CLEAN, STRUCTURED & FULLY VISIBLE HEADER */}
      <div className="p-5 sm:p-6 border-b border-stone-100 bg-stone-50/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-xl bg-orange-100 text-[#FF671F]">
              <IndianRupee className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900">
              Estimated Trip Cost
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider border border-stone-300">
              Indicative estimate
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Estimated expenditure range for {selectedCityName} across transport, accommodation, activities & entry fees, and food based on standard regional tariffs.
          </p>
        </div>

        {/* Quick Parameters Switchers */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* Budget Tier Pill Buttons */}
          <div className="inline-flex p-1 rounded-2xl bg-white border border-stone-200 text-xs font-semibold shadow-xs">
            {(['budget', 'moderate', 'luxury'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setBudgetTier(tier)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  budgetTier === tier
                    ? 'bg-[#FF671F] text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tier === 'budget' && 'Budget'}
                {tier === 'moderate' && 'Mid-range'}
                {tier === 'luxury' && 'Luxury'}
              </button>
            ))}
          </div>

          {/* Travelers Count Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-stone-200 text-xs shadow-xs">
            <Users className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={travelersCount}
              onChange={(e) => setTravelersCount(Number(e.target.value))}
              aria-label="Number of travelers"
              className="bg-transparent text-stone-900 font-bold focus:outline-hidden cursor-pointer"
            >
              <option value={1}>1 Traveller (Solo)</option>
              <option value={2}>2 Travellers (Couple)</option>
              <option value={4}>4 Travellers (Group)</option>
            </select>
          </div>

          {/* Total vs Per-day Toggle */}
          <div className="inline-flex p-1 rounded-2xl bg-white border border-stone-200 text-xs font-semibold shadow-xs">
            <button
              onClick={() => setViewMode('total')}
              className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'total'
                  ? 'bg-stone-900 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Total Trip
            </button>
            <button
              onClick={() => setViewMode('per_day')}
              className={`px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                viewMode === 'per_day'
                  ? 'bg-stone-900 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Per Day
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION STAGE: BALANCED & EXPANSIVE GRID */}
      <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left: D3 Donut Chart with Center Callout */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] flex items-center justify-center select-none">
            {/* SVG Render Target */}
            <svg ref={svgRef} className="w-full h-full transform transition-all duration-300" />

            {/* Dynamic Center Hole Card */}
            <div
              className="absolute inset-0 m-auto w-[150px] h-[150px] sm:w-[160px] sm:h-[160px] rounded-full bg-white/98 backdrop-blur-sm border border-stone-200 shadow-inner flex flex-col items-center justify-center text-center p-2.5 pointer-events-none transition-all duration-300"
              style={{
                borderColor: activeItem ? activeItem.color : '#E5E7EB',
              }}
            >
              {activeItem ? (
                <div className="animate-fadeIn space-y-0.5">
                  <div className="text-xl leading-none">{activeItem.icon}</div>
                  <div className="text-[11px] font-bold text-stone-900 line-clamp-1">
                    {activeItem.shortName}
                  </div>
                  <div
                    className="text-xs sm:text-sm font-mono font-extrabold tracking-tight"
                    style={{ color: activeItem.color }}
                  >
                    ₹{activeItem.minAmount.toLocaleString('en-IN')} – ₹{activeItem.maxAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-700">
                    <span>{activeItem.percentage}% allocation</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-stone-400 block">
                    Estimated Trip Cost
                  </span>
                  <div className="text-xs sm:text-sm font-mono font-black text-stone-900 tracking-tight leading-tight">
                    {displayedCostRange}
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 text-[9px] font-bold">
                    Indicative range
                  </span>
                  <div className="text-[9px] text-stone-500 font-medium pt-0.5">
                    {travelersCount} Traveller{travelersCount > 1 ? 's' : ''} • {effectiveDays} Days
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-2">
            <span className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              Hover category segments to inspect breakdown
            </span>
          </div>
        </div>

        {/* Right: The 4 Required Categories Breakdown Cards in 2x2 Grid */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {costBreakdown.map((cat) => {
              const isHovered = (hoveredCategory === cat.id) || (selectedCategory === cat.id);
              const minPerDay = Math.round(cat.minAmount / effectiveDays / 50) * 50;
              const maxPerDay = Math.round(cat.maxAmount / effectiveDays / 50) * 50;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isHovered
                      ? 'ring-2 bg-white shadow-md -translate-y-0.5'
                      : 'bg-stone-50/90 hover:bg-white border-stone-200 shadow-xs'
                  }`}
                  style={{
                    borderColor: isHovered ? cat.color : undefined,
                    // @ts-ignore
                    '--tw-ring-color': cat.color,
                  }}
                >
                  {/* Category Header with Icon & Amount Range */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{cat.icon}</span>
                        <span className="text-xs font-bold text-stone-900">{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">
                        {cat.percentage}%
                      </span>
                    </div>

                    <div
                      className="font-mono font-bold text-xs sm:text-sm"
                      style={{ color: cat.color }}
                    >
                      ₹{cat.minAmount.toLocaleString('en-IN')} – ₹{cat.maxAmount.toLocaleString('en-IN')}
                    </div>

                    {/* Progress Bar Proportion */}
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>

                    {/* Sub-label */}
                    <p className="text-[10px] text-stone-600 line-clamp-1 font-medium pt-0.5">
                      {cat.description}
                    </p>
                  </div>

                  {/* Bullet Inclusions List */}
                  <div className="pt-2 mt-2 border-t border-stone-200/80 text-[10px] text-stone-500 space-y-1">
                    {cat.inclusions.slice(0, 2).map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5 leading-tight">
                        <Check className="w-3 h-3 shrink-0" style={{ color: cat.color }} />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5 font-medium">
                      <span>Daily range:</span>
                      <span className="font-mono font-semibold text-stone-700">
                        ₹{minPerDay.toLocaleString('en-IN')} – ₹{maxPerDay.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. FORMAL PLANNING ASSUMPTIONS CARD */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-500" />
                <span>Planning Assumptions ({selectedCityName}):</span>
              </span>
              <div className="text-[11px] text-stone-600 flex flex-wrap gap-x-3 gap-y-0.5">
                <span>• {travelersCount} traveller{travelersCount > 1 ? 's' : ''}</span>
                <span>• {effectiveDays} days</span>
                <span>• {budgetTier === 'luxury' ? 'Luxury accommodation' : budgetTier === 'budget' ? 'Budget accommodation' : 'Mid-range accommodation'}</span>
                <span>• Local transport included</span>
              </div>
            </div>
            <div className="text-[10px] text-stone-400 max-w-xs sm:text-right leading-tight">
              Indicative estimate for planning purposes. Not a live booking price.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
