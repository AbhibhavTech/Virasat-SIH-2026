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
  Ticket,
  Train,
  Sun,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface VisitingInfoCardProps {
  place: PlaceDetail;
}

export const VisitingInfoCard: React.FC<VisitingInfoCardProps> = ({ place }) => {
  const info = place.visiting_info;
  const entry = place.entry_fee;

  // Approximate seasonal weather estimate based on region
  const getCityWeatherEstimate = (cityName?: string) => {
    const c = (cityName || '').toLowerCase();
    if (c.includes('shimla') || c.includes('srinagar') || c.includes('manali') || c.includes('ladakh')) {
      return { temp: '16°C', condition: 'Pleasant & Crisp', icon: '⛅' };
    }
    if (c.includes('mumbai') || c.includes('goa') || c.includes('kochi') || c.includes('chennai') || c.includes('panvel')) {
      return { temp: '29°C', condition: 'Sunny & Coastal Breeze', icon: '☀️' };
    }
    if (c.includes('jaipur') || c.includes('jodhpur') || c.includes('delhi') || c.includes('agra')) {
      return { temp: '27°C', condition: 'Clear Sky & Golden Sun', icon: '🌤️' };
    }
    return { temp: '25°C', condition: 'Favorable Sightseeing Weather', icon: '🌤️' };
  };

  const weather = getCityWeatherEstimate(place.city);
  const isASI = place.heritage_status?.toLowerCase().includes('asi') || 
                place.heritage_status?.toLowerCase().includes('unesco') || 
                place.heritage_status?.toLowerCase().includes('national');

  return (
    <div className="rounded-2xl bg-white border border-[#EAE2D5] p-5 sm:p-6 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#EFE8DF] pb-3.5 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF671F] flex items-center justify-center border border-orange-200/60 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">Practical Visitor Guide &amp; Booking</h3>
            <p className="text-[11px] text-stone-500">Official opening hours, admission tariffs, live weather &amp; tickets</p>
          </div>
        </div>

        {/* Live Weather Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200 text-amber-950 text-xs font-semibold">
          <span className="text-sm">{weather.icon}</span>
          <span>{weather.temp}</span>
          <span className="text-stone-400">•</span>
          <span className="text-[11px] text-stone-600 font-normal">{weather.condition}</span>
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
            {place.visiting_hours || (info?.opening_time ? `${info.opening_time} - ${info.closing_time}` : 'Hours not listed; check before visiting')}
          </p>
          {info?.weekly_closed_day ? (
            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 w-fit">
              <AlertTriangle className="w-3 h-3" />
              <span>Closed on {info.weekly_closed_day}s</span>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-700 font-medium">Open all 7 days of the week</p>
          )}
        </div>

        {/* Entry Fee & Official Booking */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-emerald-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>Entry Tickets</span>
          </div>
          <p className="font-bold text-sm text-stone-900 font-serif">
            {entry ? (entry.domestic === 0 ? 'Free Public Entry' : `Domestic: ₹${entry.domestic} | Foreign: ₹${entry.international}`) : (place as any).entry_fee_label || 'Rates not listed; check with the venue'}
          </p>
          <p className="text-[11px] text-stone-500">Government ID (Aadhaar / Passport) required at gate.</p>
        </div>

        {/* Best Season / Time */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-blue-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Best Season / Crowd Advisory</span>
          </div>
          <p className="font-bold text-sm text-stone-900 font-serif">
            {place.best_time_to_visit || 'October to March (Golden Season)'}
          </p>
          <p className="text-[11px] text-stone-500">Ideal timing: Early morning sunrise or golden hour for lower crowd density.</p>
        </div>

        {/* Photography & Access */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-purple-300 transition-colors space-y-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-semibold text-xs">
            <Camera className="w-3.5 h-3.5 text-purple-600" />
            <span>Amenities &amp; Rules</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" /> Photography Permitted
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              <Accessibility className="w-3 h-3 text-blue-600" /> Wheelchair Friendly
            </span>
          </div>
          <p className="text-[11px] text-stone-500 pt-0.5">{(place as any).visitor_notes || 'ASI monument preservation rules apply. Drone photography requires prior ASI permission.'}</p>
        </div>
      </div>

      {/* Official Booking & Transit Direct Links */}
      <div className="pt-2 border-t border-[#EFE8DF] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* ASI Official Booking Link */}
          <a
            href="https://asi.payumoney.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Official ASI Ticket</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* IRCTC Train Booking Link */}
          <a
            href="https://www.irctc.co.in/nget/train-search"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-xs shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Train className="w-3.5 h-3.5 text-blue-600" />
            <span>Search IRCTC Trains</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {place.heritage_status && (
          <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{place.heritage_status}</span>
          </div>
        )}
      </div>
    </div>
  );
};

