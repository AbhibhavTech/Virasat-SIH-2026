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
  Sparkles 
} from 'lucide-react';

interface VisitingInfoCardProps {
  place: PlaceDetail;
}

export const VisitingInfoCard: React.FC<VisitingInfoCardProps> = ({ place }) => {
  const info = place.visiting_info;
  const entry = place.entry_fee;

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
            {place.visiting_hours || (info?.opening_time ? `${info.opening_time} - ${info.closing_time}` : '09:00 AM - 06:00 PM')}
          </p>
          {info?.weekly_closed_day ? (
            <p className="text-[11px] text-rose-600 font-medium">Closed on {info.weekly_closed_day}</p>
          ) : (
            <p className="text-[11px] text-stone-500">Open all days of the week</p>
          )}
        </div>

        {/* Entry Fee */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-emerald-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>Entry Tickets</span>
          </div>
          <p className="font-bold text-sm text-stone-900 font-serif">
            {entry ? (entry.domestic === 0 ? 'Free Public Entry' : `Domestic: ₹${entry.domestic} | Foreign: ₹${entry.international}`) : 'Free Public Entry'}
          </p>
          <p className="text-[11px] text-stone-500">Online &amp; counter booking available</p>
        </div>

        {/* Best Time */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-blue-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Best Season / Time</span>
          </div>
          <p className="font-bold text-sm text-stone-900 font-serif">
            {place.best_time_to_visit || 'October to March (Pleasant weather)'}
          </p>
          <p className="text-[11px] text-stone-500">Recommended duration: 1–2 hours visit</p>
        </div>

        {/* Photography & Access */}
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
          <p className="text-[11px] text-stone-500 pt-0.5">Subject to ASI architectural preservation rules</p>
        </div>
      </div>

      {place.heritage_status && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Heritage Recognition: <strong>{place.heritage_status}</strong></span>
        </div>
      )}
    </div>
  );
};
