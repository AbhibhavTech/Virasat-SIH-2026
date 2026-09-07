import React, { useState } from 'react';
import { ItineraryResponse } from '../../types';
import { api } from '../../services/api';
import { 
  Clock, 
  MapPin, 
  Car, 
  Navigation, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  Compass,
  Sparkles,
  Bookmark,
  Check
} from 'lucide-react';

interface ItineraryTimelineProps {
  itinerary: ItineraryResponse;
  onSelectPlace?: (placeId: string) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  onSelectPlace,
}) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [completedStops, setCompletedStops] = useState<Record<string, boolean>>({});

  const toggleStop = (placeId: string) => {
    setCompletedStops((prev) => ({
      ...prev,
      [placeId]: !prev[placeId],
    }));
  };

  if (!itinerary || !itinerary.stops || itinerary.stops.length === 0) {
    return null;
  }

  const validStops = itinerary.stops;

  const handleSaveTrip = async () => {
    setSaving(true);
    try {
      const stopsCount = itinerary.total_places || validStops.length;
      await api.createTrip({
        title: `${itinerary.city} ${itinerary.duration_hours || 8}h Tour`,
        city: itinerary.city,
        duration_hours: itinerary.duration_hours || 8,
        total_places: stopsCount,
        estimated_cost: itinerary.estimated_total_cost || (stopsCount * 45),
        stops: validStops.map((s) => ({
          order: s.order,
          place_id: s.place_id,
          place_name: s.name || s.place_name || 'Destination Stop',
          visit_minutes: s.recommended_duration_minutes,
          travel_minutes: s.travel_time_from_previous_minutes || 0,
        })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('Failed to save trip:', err);
    } finally {
      setSaving(false);
    }
  };

  // Generate multi-stop Google Maps URL
  const stopsQuery = validStops.map((s) => encodeURIComponent(s.name || s.place_name || '')).join('/');
  const multiStopGoogleUrl = `https://www.google.com/maps/dir/${stopsQuery}`;

  const visitedCount = validStops.filter((s) => completedStops[s.place_id]).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* Overview Stats Bar (Light Theme) */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-1">
              <Sparkles className="w-3 h-3 text-amber-700" />
              <span>Optimized {itinerary.city} Tour</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-900">
              {itinerary.duration_hours}-Hour Tour Schedule
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">{itinerary.summary}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <button
              onClick={handleSaveTrip}
              disabled={saving || saved}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                saved
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Bookmark className="w-3.5 h-3.5 text-amber-700" />}
              <span>{saved ? 'Saved to My Trips!' : saving ? 'Saving...' : 'Save to My Trips'}</span>
            </button>

            <a
              href={multiStopGoogleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Tour in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-[11px] text-stone-500 uppercase font-semibold">Total Stops</div>
            <div className="text-lg font-black text-amber-700 font-mono mt-0.5">
              {itinerary.total_places || validStops.length} Destinations
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-[11px] text-stone-500 uppercase font-semibold">Visiting Time</div>
            <div className="text-lg font-black text-stone-800 font-mono mt-0.5">
              {((itinerary.estimated_total_visiting_minutes || 180) / 60).toFixed(1)} hrs
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="text-[11px] text-stone-500 uppercase font-semibold">Travel Time</div>
            <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">
              ~{itinerary.estimated_total_travel_minutes || 45} mins
            </div>
          </div>
        </div>

        {validStops.length > 0 && (
          <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
            <span>Stop Completion Checklist:</span>
            <span className="font-semibold text-stone-900">{visitedCount} of {validStops.length} visited</span>
          </div>
        )}
      </div>

      {/* Sequential Stops Timeline */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-stone-200">
        {validStops.map((stop, idx) => {
          const isDone = !!completedStops[stop.place_id];
          return (
            <div key={stop.place_id || idx} className="relative flex items-start gap-5 group">
              {/* Step Number Circle */}
              <div className={`relative z-10 w-12 h-12 rounded-2xl font-bold text-base flex items-center justify-center transition-transform flex-shrink-0 shadow-xs ${
                isDone
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-br from-amber-600 to-orange-600 text-white group-hover:scale-105'
              }`}>
                {isDone ? <Check className="w-5 h-5" /> : (stop.order || idx + 1)}
              </div>

              {/* Stop Content Card */}
              <div className={`flex-1 rounded-3xl p-5 border transition-all space-y-4 shadow-2xs ${
                isDone
                  ? 'bg-emerald-50/25 border-emerald-200'
                  : 'bg-white border-stone-200 hover:border-amber-300'
              }`}>
                {/* Inter-stop travel segment indicator */}
                {stop.travel_time_from_previous_minutes !== undefined && stop.travel_time_from_previous_minutes !== null && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-50 border border-stone-200 text-[11px] text-stone-700">
                    <Car className="w-3.5 h-3.5 text-amber-700" />
                    <span>
                      ~{stop.travel_time_from_previous_minutes} min travel ({stop.travel_mode_from_previous || 'Drive / Transit'})
                    </span>
                    {stop.distance_from_previous_km && (
                      <span className="text-stone-500">• {stop.distance_from_previous_km.toFixed(1)} km</span>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={stop.thumbnail_url || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f'}
                      alt={stop.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-stone-100 flex-shrink-0 border border-stone-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {stop.category || 'Monument'}
                      </span>
                      <h4 
                        onClick={() => onSelectPlace && onSelectPlace(stop.place_id)}
                        className={`text-base font-bold font-serif hover:text-amber-800 transition-colors cursor-pointer mt-1 ${
                          isDone ? 'text-stone-600 line-through' : 'text-stone-900'
                        }`}
                      >
                        {stop.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Recommended Visit: <strong>{stop.recommended_duration_minutes} minutes</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleStop(stop.place_id)}
                        className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                      />
                      <span>{isDone ? 'Visited' : 'Check off'}</span>
                    </label>

                    <button
                      onClick={() => onSelectPlace && onSelectPlace(stop.place_id)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-xl transition-all border border-stone-200 cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                    </button>
                  </div>
                </div>

                {/* Stop Tips */}
                {stop.visit_tips && (
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{stop.visit_tips}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
