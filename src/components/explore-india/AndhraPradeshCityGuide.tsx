import React, { useState } from 'react';
import { ArrowRight, CalendarDays, Camera, Clock3, Hotel, MapPin, X } from 'lucide-react';
import { ANDHRA_PRADESH_CITY_GUIDE, AndhraPradeshCityGuideEntry } from '../../data/andhraPradeshCityGuide';

const CityGuideDetails: React.FC<{ city: AndhraPradeshCityGuideEntry; onClose: () => void }> = ({ city, onClose }) => (
  <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-3 sm:p-6" role="presentation" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section role="dialog" aria-modal="true" aria-labelledby="ap-guide-title" className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#FCFBF9] shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#EFE8DF] bg-[#FCFBF9]/95 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C94D0A]">Andhra Pradesh City Guide</p>
          <h2 id="ap-guide-title" className="font-serif text-2xl font-bold text-[#0B192C]">{city.name}{city.alternateName ? ` (${city.alternateName})` : ''}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close city guide" className="rounded-full border border-stone-200 bg-white p-2 text-stone-700 hover:bg-stone-100">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-5 p-5 sm:p-7">
        <div className="flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-stone-700">
          <Camera className="mt-0.5 h-5 w-5 shrink-0 text-[#E65100]" />
          <p><strong>Photo idea:</strong> {city.imageSuggestion}. Use an original or properly licensed photo.</p>
        </div>
        <GuideBlock title="Overview" text={city.overview} icon={<MapPin className="h-4 w-4" />} />
        <GuideBlock title="History" text={city.history} />
        <div>
          <h3 className="mb-2 font-bold text-[#0B192C]">Famous for</h3>
          <div className="flex flex-wrap gap-2">{city.famousFor.map((item) => <span key={item} className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-sm text-stone-700">{item}</span>)}</div>
        </div>
        <GuideBlock title="What makes it interesting" text={city.interestingPart} />
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoTile title="Best time" text={city.bestTime} icon={<CalendarDays className="h-4 w-4" />} />
          <InfoTile title="Stay ideas" text={city.stayOptions} icon={<Hotel className="h-4 w-4" />} />
        </div>
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
          Travel details are editorial guidance, not live booking information. Hotel operation, rates, transport, access rules, timings, and fees can change. Confirm with the official site or provider before travel.
        </p>
      </div>
    </section>
  </div>
);

const GuideBlock: React.FC<{ title: string; text: string; icon?: React.ReactNode }> = ({ title, text, icon }) => (
  <div>
    <h3 className="mb-1.5 flex items-center gap-2 font-bold text-[#0B192C]">{icon && <span className="text-[#E65100]">{icon}</span>}{title}</h3>
    <p className="text-sm leading-relaxed text-stone-700">{text}</p>
  </div>
);

const InfoTile: React.FC<{ title: string; text: string; icon: React.ReactNode }> = ({ title, text, icon }) => (
  <div className="rounded-2xl border border-[#EFE8DF] bg-white p-4">
    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#0B192C]"><span className="text-[#E65100]">{icon}</span>{title}</h3>
    <p className="text-sm leading-relaxed text-stone-700">{text}</p>
  </div>
);

export const AndhraPradeshCityGuide: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<AndhraPradeshCityGuideEntry | null>(null);

  return (
    <section className="space-y-5 rounded-3xl border border-[#F0D7C5] bg-gradient-to-br from-white via-[#FFFCF8] to-orange-50/70 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C94D0A]">Discover Bharat · Andhra Pradesh</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-[#0B192C] sm:text-3xl">8 city & destination guides</h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-stone-600">Explore history, local highlights, seasons, photo ideas, and stay suggestions. Choose a guide for the full overview.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900"><Clock3 className="h-3.5 w-3.5" /> Travel details need confirmation</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ANDHRA_PRADESH_CITY_GUIDE.map((city, index) => (
          <article key={city.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#EFE8DF] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex min-h-28 flex-col justify-between bg-gradient-to-br from-[#FFF0E4] via-[#FFF8EE] to-[#F3F7F2] p-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#C94D0A]"><span>Destination {String(index + 1).padStart(2, '0')}</span><Camera className="h-4 w-4" /></div>
              <p className="mt-4 text-xs leading-relaxed text-stone-600"><strong className="text-stone-800">Photo:</strong> {city.imageSuggestion}</p>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0B192C]">{city.name}</h3>
                {city.alternateName && <p className="text-xs text-stone-500">Also known as {city.alternateName}</p>}
              </div>
              <p className="line-clamp-3 text-sm leading-relaxed text-stone-600">{city.overview}</p>
              <p className="mt-auto flex items-start gap-2 text-xs text-stone-600"><CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C94D0A]" /><span><strong>Best time:</strong> {city.bestTime}</span></p>
              <button type="button" onClick={() => setSelectedCity(city)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C94D0A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#A83E05] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">
                Explore {city.name}<ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-stone-500">Guide content is an editorial starting point. Confirm historical details with ASI or the relevant authority, pilgrimage information with TTD or temple authorities, and hotels directly. Images are suggestions only; use licensed or original photographs.</p>
      {selectedCity && <CityGuideDetails city={selectedCity} onClose={() => setSelectedCity(null)} />}
    </section>
  );
};

export default AndhraPradeshCityGuide;
