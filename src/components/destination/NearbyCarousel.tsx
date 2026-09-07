import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface NearbyCarouselProps {
  nearby?: any[];
  places?: any[];
  currentPlaceName?: string;
  onSelectPlace: (id: string) => void;
}

export const NearbyCarousel: React.FC<NearbyCarouselProps> = ({
  nearby,
  places,
  currentPlaceName,
  onSelectPlace,
}) => {
  const items = nearby || places || [];

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
          <Navigation className="w-4 h-4 text-orange-500" />
          <span>Nearby Heritage & Attractions {currentPlaceName ? `near ${currentPlaceName}` : ''}</span>
        </h3>
        <span className="text-xs text-charcoal-light">{items.length} places nearby</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item: any) => (
          <div
            key={item.id}
            onClick={() => onSelectPlace(item.id)}
            className="group cursor-pointer rounded-2xl bg-[#FAF8F5] hover:bg-white border border-[#EAE2D5] hover:border-orange-300 p-3.5 transition-all flex items-start gap-3 shadow-2xs hover:shadow-xs"
          >
            {item.thumbnail_url ? (
              <img
                src={item.thumbnail_url}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#FF671F] flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 capitalize font-medium">
                  {item.category || 'Sight'}
                </span>
                {item.distance_km !== undefined && (
                  <span className="text-[10px] text-[#FF671F] font-mono font-bold">
                    {item.distance_km.toFixed(1)} km away
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-stone-900 truncate group-hover:text-[#FF671F] transition-colors font-serif">
                {item.name}
              </h4>
              <p className="text-[11px] text-stone-500 line-clamp-1">
                {item.summary || item.city}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
