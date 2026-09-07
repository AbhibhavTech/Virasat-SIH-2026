import React from 'react';
import { RailwayStationInfo } from '../../types';
import { Train, Navigation, Footprints, Car, ArrowRight, ShieldCheck } from 'lucide-react';

interface RailwayStationsCardProps {
  stations: RailwayStationInfo[];
  placeName: string;
  onSelectStationForRoute?: (stationName: string) => void;
}

export const RailwayStationsCard: React.FC<RailwayStationsCardProps> = ({
  stations,
  placeName,
  onSelectStationForRoute,
}) => {
  if (!stations || stations.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white border border-[#EAE2D5] p-5 sm:p-6 space-y-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#EFE8DF] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF671F] flex items-center justify-center border border-orange-200/60 shrink-0">
            <Train className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-serif">
              Nearby Railway Stations &amp; Transit Hubs
            </h3>
            <p className="text-[11px] text-stone-500">
              Verified rail connections and last-mile accessibility for {placeName}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-50/80 text-orange-800 border border-orange-200/70 shrink-0">
          Indian Railways &amp; Transit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stations.map((st) => (
          <div
            key={st.id}
            className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] hover:border-orange-300 hover:bg-white transition-all space-y-3 group shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#FF671F] transition-colors font-serif">
                    {st.name}
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    {st.code}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  {st.line}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs sm:text-sm font-extrabold text-[#FF671F] font-mono">
                  {st.distance_km} km
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-600 pt-2 border-t border-[#EFE8DF]">
              <div className="flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-amber-700" />
                <span>{st.walking_time_mins} min walk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-600" />
                <span>{st.road_time_mins} min drive</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {st.transfer_modes.map((mode, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white text-stone-700 border border-stone-200 shadow-2xs"
                  >
                    {mode}
                  </span>
                ))}
              </div>
              {onSelectStationForRoute && (
                <button
                  onClick={() => onSelectStationForRoute(st.name)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF671F] hover:text-[#E65100] transition-colors cursor-pointer"
                >
                  <span>Route</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
