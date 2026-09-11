import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Landmark,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface HeritagePassportWidgetProps {
  visitedCount: number;
  totalMonuments: number;
  onResetVisited?: () => void;
  onFilterVisited?: (onlyVisited: boolean) => void;
}

export const HeritagePassportWidget: React.FC<HeritagePassportWidgetProps> = ({
  visitedCount,
  totalMonuments,
  onResetVisited,
  onFilterVisited,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterVisitedActive, setFilterVisitedActive] = useState(false);

  // Compute Rank
  let rankName = 'Heritage Novice';
  let rankBadgeColor = 'bg-stone-100 text-stone-700 border-stone-300';
  let nextRankGoal = 3;

  if (visitedCount >= 10) {
    rankName = 'Grand Virasat Custodian';
    rankBadgeColor = 'bg-gradient-to-r from-orange-100 via-amber-100 to-emerald-100 text-amber-950 border-amber-300 font-bold';
    nextRankGoal = totalMonuments;
  } else if (visitedCount >= 5) {
    rankName = 'Monument Historian';
    rankBadgeColor = 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
    nextRankGoal = 10;
  } else if (visitedCount >= 3) {
    rankName = 'Cultural Explorer';
    rankBadgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
    nextRankGoal = 5;
  }

  const percentage = Math.min(100, Math.round((visitedCount / Math.max(1, totalMonuments)) * 100));

  const stamps = [
    {
      id: 'unesco',
      title: 'UNESCO Heritage Stamp',
      threshold: 1,
      unlocked: visitedCount >= 1,
      tag: 'ASI / World Heritage',
      color: 'border-orange-300 bg-orange-50/50 text-[#FF671F]',
    },
    {
      id: 'fortress',
      title: 'Hill Forts & Bastions',
      threshold: 3,
      unlocked: visitedCount >= 3,
      tag: 'Rajput & Mughal Forts',
      color: 'border-amber-300 bg-amber-50/50 text-amber-800',
    },
    {
      id: 'temple',
      title: 'Sacred Architecture',
      threshold: 5,
      unlocked: visitedCount >= 5,
      tag: 'Dravidian & Kalinga',
      color: 'border-indigo-300 bg-indigo-50/50 text-indigo-800',
    },
    {
      id: 'custodian',
      title: 'Virasat Golden Seal',
      threshold: 10,
      unlocked: visitedCount >= 10,
      tag: 'Grand Custodian',
      color: 'border-emerald-300 bg-emerald-50/50 text-[#046A38]',
    },
  ];

  const handleToggleFilter = () => {
    const nextState = !filterVisitedActive;
    setFilterVisitedActive(nextState);
    if (onFilterVisited) {
      onFilterVisited(nextState);
    }
  };

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-2xl border border-white/60 p-4 sm:p-5 shadow-lg space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Passport Identity & Rank */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B192C] to-[#1E293B] text-amber-400 flex items-center justify-center shadow-xs border border-amber-400/20 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Digital Heritage Passport
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${rankBadgeColor}`}>
                {rankName}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5 font-serif">
              <span>{visitedCount}</span> of <span>{totalMonuments}</span> Monument Sites Visited
            </div>
          </div>
        </div>

        {/* Right: Quick Progress Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleFilter}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterVisitedActive
                ? 'bg-[#046A38] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200/80 backdrop-blur-xs'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{filterVisitedActive ? 'Showing Visited Only' : 'Filter Visited'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-stone-200/80 text-xs font-semibold text-stone-700 flex items-center gap-1 cursor-pointer backdrop-blur-xs"
          >
            <span>{isExpanded ? 'Hide Stamps' : 'View Passport Stamps'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar with Tricolour Accent */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-sans">
          <span>Traveler Exploration Progress</span>
          <span className="font-bold text-stone-800">{percentage}% completed</span>
        </div>
        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF671F] via-amber-500 to-[#046A38] transition-all duration-500"
            style={{ width: `${Math.max(2, percentage)}%` }}
          />
        </div>
      </div>

      {/* Expandable Stamp Collection Grid */}
      {isExpanded && (
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
          {stamps.map((stamp) => (
            <div
              key={stamp.id}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between text-center relative overflow-hidden ${
                stamp.unlocked
                  ? `${stamp.color} shadow-xs`
                  : 'bg-stone-50 border-dashed border-stone-300 text-stone-400 opacity-70'
              }`}
            >
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full mx-auto flex items-center justify-center bg-white shadow-2xs">
                  {stamp.unlocked ? (
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Landmark className="w-4 h-4 text-stone-300" />
                  )}
                </div>
                <div className="font-serif font-bold text-xs leading-tight">
                  {stamp.title}
                </div>
                <div className="text-[10px]">{stamp.tag}</div>
              </div>

              <div className="mt-2 text-[10px] font-bold">
                {stamp.unlocked ? (
                  <span className="text-[#046A38] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span>Visit {stamp.threshold} to unlock</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
