import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { AttractionEntity } from '../../types/indiaHierarchy';
import { OfficialImagePending } from '../common/OfficialImagePending';

export type StateFeaturedPlace = {
  place: AttractionEntity;
  cityId: string;
  cityName: string;
};

type StateAttractionsSlideshowProps = {
  stateName: string;
  places: StateFeaturedPlace[];
  onPreview: (place: AttractionEntity) => void;
  onExploreCity: (cityId: string) => void;
};

export const StateAttractionsSlideshow: React.FC<StateAttractionsSlideshowProps> = ({
  stateName,
  places,
  onPreview,
  onExploreCity,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setImageFailed(false);
  }, [stateName]);

  useEffect(() => {
    if (paused || places.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % places.length);
      setImageFailed(false);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, places.length, stateName]);

  if (!places.length) return null;
  const active = places[activeIndex % places.length];
  const { place, cityId, cityName } = active;

  const move = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + places.length) % places.length);
    setImageFailed(false);
  };

  return (
    <section
      aria-label={`Featured attractions in ${stateName}`}
      aria-roledescription="carousel"
      className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-4 py-3 sm:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#A83E05]">Discover the state</p>
          <h2 className="font-serif text-lg font-bold text-slate-900 sm:text-xl">Famous attractions in {stateName}</h2>
        </div>
        <span className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-600">
          {activeIndex + 1} / {places.length}
        </span>
      </div>

      <div className="grid min-h-[290px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-56 bg-stone-100 lg:min-h-[340px]">
          {!imageFailed && place.image_url ? (
            <img
              key={place.id}
              src={place.image_url}
              alt={place.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0">
              <OfficialImagePending heightClass="h-full" label="Attraction image under verification" showBadge={false} />
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-emerald-800 shadow-sm">
            {place.category_label || place.category}
          </span>
          <div className="absolute bottom-4 left-4 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
            {cityName}, {stateName}
          </div>
        </div>

        <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[#A83E05]">Featured place</p>
          <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">{place.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{place.summary || place.short_description || 'Explore this destination and check local visitor guidance before travelling.'}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
            {place.best_time_to_visit && <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5"><CalendarDays className="h-3.5 w-3.5 text-[#C94D0A]" />{place.best_time_to_visit}</span>}
            {place.address && <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5"><MapPin className="h-3.5 w-3.5 text-[#C94D0A]" />{place.address}</span>}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => onPreview(place)} className="rounded-xl bg-[#C94D0A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#A83E05]">View attraction</button>
            <button type="button" onClick={() => onExploreCity(cityId)} className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-stone-50">Explore {cityName} <ArrowUpRight className="h-4 w-4" /></button>
            <div className="ml-auto flex gap-1">
              <button type="button" onClick={() => move(-1)} aria-label="Previous attraction" className="rounded-full border border-stone-200 p-2 text-slate-700 hover:bg-stone-50"><ArrowLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(1)} aria-label="Next attraction" className="rounded-full border border-stone-200 p-2 text-slate-700 hover:bg-stone-50"><ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Choose a featured attraction">
            {places.slice(0, 10).map(({ place: item }, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show ${item.name}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => { setActiveIndex(index); setImageFailed(false); }}
                className={`h-2.5 rounded-full transition-all ${index === activeIndex ? 'w-7 bg-[#C94D0A]' : 'w-2.5 bg-stone-300 hover:bg-stone-400'}`}
              />
            ))}
            {places.length > 10 && <span className="self-center pl-1 text-[11px] text-stone-500">+{places.length - 10} more</span>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StateAttractionsSlideshow;
