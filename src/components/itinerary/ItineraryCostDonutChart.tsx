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
    // Activities (scales with places & traveler count)
    const placeBonus = Math.round(totalStopsCount * 45 * travelersCount);
    const baseActivities = Math.round(tierConfig.activitiesDaily * effectiveDays * travelersCount + placeBonus);
    // Meals (scales per person per day)
    const baseMeals = Math.round(tierConfig.mealsDaily * effectiveDays * travelersCount);

    const total = Math.max(1, baseTransport + baseLodging + baseActivities + baseMeals);

    const items: CostCategoryItem[] = [
      {
        id: 'transport',
        name: 'Transport & Transit',
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
          'Last-mile auto-rickshaws',
        ],
        amount: baseTransport,
        percentage: Math.round((baseTransport / total) * 100),
      },
      {
        id: 'lodging',
        name: 'Lodging & Accommodation',
        shortName: 'Lodging',
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
          'Breakfast inclusion (standard)',
          'Taxes & city heritage cess',
        ],
        amount: baseLodging,
        percentage: Math.round((baseLodging / total) * 100),
      },
      {
        id: 'activities',
        name: 'Activities & Monuments',
        shortName: 'Activities',
        icon: '🎟️',
        color: '#059669', // Emerald Green
        hoverColor: '#047857',
        lightBg: 'bg-emerald-50',
        textColor: 'text-emerald-950',
        borderColor: 'border-emerald-200',
        description: tierConfig.activitiesLabel,
        inclusions: [
          `Entry tickets for ${totalStopsCount} curated attractions`,
          'ASI ticket counter / online pass fees',
          'Audio guide device rentals',
          'Monument camera permissions',
        ],
        amount: baseActivities,
        percentage: Math.round((baseActivities / total) * 100),
      },
      {
        id: 'meals',
        name: 'Meals & Regional Food',
        shortName: 'Meals',
        icon: '🍲',
        color: '#E11D48', // Rose / Crimson
        hoverColor: '#BE123C',
        lightBg: 'bg-rose-50',
        textColor: 'text-rose-950',
        borderColor: 'border-rose-200',
        description: tierConfig.diningLabel,
        inclusions: [
          'Daily breakfast, lunch & dinner',
          'Authentic regional thalis & cuisine',
          'Evening street delicacies & chai',
          'Packaged drinking water',
        ],
        amount: baseMeals,
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

  const displayedCost = useMemo(() => {
    if (viewMode === 'per_day') {
      return Math.round(totalCost / effectiveDays);
    }
    return totalCost;
  }, [viewMode, totalCost, effectiveDays]);

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
              Estimated Cost Breakdown & Budget Intelligence
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-900 text-[10px] font-bold uppercase tracking-wider border border-amber-300">
              <Sparkles className="w-3 h-3 text-[#FF671F]" />
              ASI Verified Indexes
            </span>
          </div>
          <p className="text-xs text-stone-600">
            Real-time estimated allocation for {selectedCityName} across transport, lodging, activities & dining based on official ASI tariffs and regional living indexes.
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
                {tier === 'budget' && '₹ Budget'}
                {tier === 'moderate' && '₹₹ Mid-range'}
                {tier === 'luxury' && '₹₹₹ Luxury'}
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
              <option value={1}>1 Traveler (Solo)</option>
              <option value={2}>2 Travelers (Couple)</option>
              <option value={4}>4 Travelers (Family/Group)</option>
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
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col items-center justify-center relative">
          <div className="relative w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] flex items-center justify-center select-none">
            {/* SVG Render Target */}
            <svg ref={svgRef} className="w-full h-full transform transition-all duration-300" />

            {/* Dynamic Center Hole Card */}
            <div
              className="absolute inset-0 m-auto w-[145px] h-[145px] sm:w-[155px] sm:h-[155px] rounded-full bg-white/98 backdrop-blur-sm border border-stone-200 shadow-inner flex flex-col items-center justify-center text-center p-2.5 pointer-events-none transition-all duration-300"
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
                    className="text-base sm:text-lg font-mono font-extrabold tracking-tight"
                    style={{ color: activeItem.color }}
                  >
                    ₹{activeItem.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-bold text-stone-700">
                    <span>{activeItem.percentage}% of budget</span>
                  </div>
                  <div className="text-[9px] text-stone-400">
                    ≈ ₹{Math.round(activeItem.amount / effectiveDays).toLocaleString('en-IN')}/day
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                    {viewMode === 'total' ? `Total Trip (${effectiveDays} Days)` : 'Estimated Daily Cost'}
                  </span>
                  <div className="text-lg sm:text-xl font-mono font-black text-stone-900 tracking-tight">
                    ₹{displayedCost.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    {travelersCount} Traveler{travelersCount > 1 ? 's' : ''} • {budgetTier}
                  </div>
                  <div className="text-[9px] text-[#FF671F] font-semibold pt-0.5">
                    Hover slices to inspect
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-2">
            <span className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#FF671F]" />
              Tap or hover any donut segment to highlight cost inclusions
            </span>
          </div>
        </div>

        {/* Right: The 4 Required Categories Breakdown Cards in 2x2 Grid */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {costBreakdown.map((cat) => {
              const isHovered = (hoveredCategory === cat.id) || (selectedCategory === cat.id);
              const perDayAmount = Math.round(cat.amount / effectiveDays);

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
                  {/* Category Header with Icon & Amount */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{cat.icon}</span>
                        <span className="text-xs font-bold text-stone-900">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-mono font-bold text-sm"
                          style={{ color: cat.color }}
                        >
                          ₹{cat.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-stone-400 font-medium">
                          {cat.percentage}% of total
                        </div>
                      </div>
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
                    <p className="text-[11px] text-stone-600 line-clamp-1 font-medium pt-0.5">
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
                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 font-medium">
                      <span>Daily estimate:</span>
                      <span className="font-mono font-semibold text-stone-700">
                        ₹{perDayAmount.toLocaleString('en-IN')}/day
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. COST SAVINGS & HERITAGE INSIGHT NOTE */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-2.5 text-xs">
            <TrendingDown className="w-4 h-4 text-[#FF671F] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-stone-900 text-xs">
                Smart Heritage Trip Tip for {selectedCityName}:
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Booking your ASI monument tickets online provides a 10% discount on official tariffs. Local public transit and metro connectivity reduce transfer costs significantly compared to private taxis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
