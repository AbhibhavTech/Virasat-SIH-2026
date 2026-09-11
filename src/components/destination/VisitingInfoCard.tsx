import React from 'react';
import { PlaceDetail } from '../../types';
import { 
  Clock, 
  IndianRupee, 
  Camera, 
  Calendar, 
  Check, 
  X, 
  Car, 
  Accessibility, 
  Sparkles,
  Info,
  Tag,
  Compass
} from 'lucide-react';

interface VisitingInfoCardProps {
  place: PlaceDetail;
}

export const VisitingInfoCard: React.FC<VisitingInfoCardProps> = ({ place }) => {
  const p = place as any;
  const info = place.visiting_info;
  const entry = place.entry_fee;

  const displayHours = p.opening_hours || place.visiting_hours || (info?.opening_time ? `${info.opening_time} - ${info.closing_time}` : '09:00 AM - 06:00 PM');
  
  let displayEntry = 'Free Public Entry';
  if (typeof p.entry_fee === 'string') {
    displayEntry = p.entry_fee;
  } else if (typeof p.entry_fee === 'number') {
    displayEntry = p.entry_fee === 0 ? 'Free Public Entry' : `₹${p.entry_fee}`;
  } else if (entry) {
    displayEntry = entry.domestic === 0 ? 'Free Public Entry' : `Domestic: ₹${entry.domestic} | Foreign: ₹${entry.international}`;
  }

  const displayDuration = p.suggested_duration || '1–2 hours';
  const displayBestTime = p.best_time_to_visit || place.best_time_to_visit || 'October to March (Pleasant weather)';
  const visitorNotes = p.visitor_notes;
  const bestFor = Array.isArray(p.best_for) ? p.best_for : [];
  const tags = Array.isArray(p.tags) ? p.tags : [];

  return (
    <div className="rounded-2xl bg-white border border-[#EAE2D5] p-5 sm:p-6 space-y-5 shadow-xs">
      <div className="flex items-center gap-2.5 border-b border-[#EFE8DF] pb-3.5">
        <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF671F] flex items-center justify-center border border-orange-200/60 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-stone-900 font-serif">Practical Visitor Guide</h3>
          <p className="text-[11px] text-stone-500">Official opening hours, admission tariffs, and visitor accessibility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Timings */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-amber-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Visiting Hours</span>
          </div>
          <p className="font-bold text-sm text-stone-900 font-serif">
            {displayHours}
          </p>
          {info?.weekly_closed_day ? (
            <p className="text-[11px] text-rose-600 font-medium">Closed on {info.weekly_closed_day}</p>
          ) : (
            <p className="text-[11px] text-stone-500">Regular visiting schedule</p>
          )}
        </div>

        {/* Entry Fee */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-emerald-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>Entry Fee</span>
          </div>
          <p className="font-bold text-sm text-stone-900 font-serif">
            {displayEntry}
          </p>
          <p className="text-[11px] text-stone-500">Online &amp; on-site counter access rules apply</p>
        </div>

        {/* Best Time & Duration */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-blue-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Best Season &amp; Duration</span>
          </div>
          <p className="font-bold text-sm text-stone-900 font-serif">
            {displayBestTime}
          </p>
          <p className="text-[11px] text-[#FF671F] font-semibold">Suggested Duration: {displayDuration}</p>
        </div>

        {/* Amenities & Rules */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-purple-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <Camera className="w-3.5 h-3.5 text-purple-600" />
            <span>Amenities &amp; Rules</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" /> Photography Allowed
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              <Accessibility className="w-3 h-3 text-blue-600" /> Accessible
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-0.5">Subject to preservation &amp; security guidelines</p>
        </div>
      </div>

      {/* Visitor Notes */}
      {visitorNotes && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 text-stone-800 text-xs shadow-2xs">
          <Info className="w-4 h-4 text-[#FF671F] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#FF671F] uppercase text-[10px] tracking-wider block">Visitor Advisory</span>
            <p className="text-stone-700 leading-relaxed">{visitorNotes}</p>
          </div>
        </div>
      )}

      {/* Best For Badges */}
      {bestFor.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">Best Suited For</span>
          <div className="flex flex-wrap gap-1.5">
            {bestFor.map((item: string, i: number) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-100/80 text-amber-900 text-xs font-semibold">
                ✨ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-stone-100">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Category Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-mono">
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}

      {place.heritage_status && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Heritage Recognition: <strong>{place.heritage_status}</strong></span>
        </div>
      )}
    </div>
  );
};
