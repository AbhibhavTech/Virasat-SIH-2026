import React from 'react';
import { Map as MapIcon, Landmark, Sparkles, Train } from 'lucide-react';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { MapErrorBoundary } from '../components/map/MapErrorBoundary';

interface MapPageProps {
  onSelectPlace: (id: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onView3DPlace?: (placeId: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  onSelectPlace,
  selectedCity,
  onSelectCity,
  onView3DPlace,
}) => {
  return (
    <div className="space-y-4 w-full pb-8">
      {/* Header Banner - Minimal and clean for SIH prototype */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <MapIcon className="w-3.5 h-3.5" />
            <span>Smart SIH Heritage Cartography</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">Interactive Heritage & Discovery Map</h1>
          <p className="text-xs text-stone-500 max-w-2xl">
            Clustered geospatial view of verified UNESCO/ASI monuments and hidden gems across India with Gemini-powered Heritage Route Analyzer, historical segment narratives, and Route Studio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-600 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/80">
          <span className="flex items-center gap-1.5 font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-lg">
            <Sparkles className="w-3 h-3 text-amber-600" /> Route Analyzer
          </span>
          <span className="text-stone-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> 🏛️ Heritage Sites
          </span>
          <span className="text-stone-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> 💎 Hidden Gems
          </span>
          <span className="text-stone-300">•</span>
          <span className="flex items-center gap-1.5 text-stone-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> 🚆 Stations (Default Off)
          </span>
        </div>
      </div>

      {/* Main Map */}
      <MapErrorBoundary height="clamp(480px, 72vh, 660px)">
        <InteractiveMap
          onSelectPlace={onSelectPlace}
          selectedCity={selectedCity}
          onSelectCity={onSelectCity}
          onView3DPlace={onView3DPlace}
          height="clamp(480px, 72vh, 660px)"
        />
      </MapErrorBoundary>
    </div>
  );
};
