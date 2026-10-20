import React, { useMemo, useState } from 'react';

type DraftImage = { url: string | null; status: string; brief: string };
type DraftAttraction = {
  id: string; name: string; summary: string; category: string; is_hidden_gem: boolean;
  image: DraftImage; verification_status: string;
};
type DraftCity = { id: string; name: string; tagline: string; blurb: string; attractions: string[]; hidden_gems: string[] };
type DraftRegion = {
  region: { name: string; tagline: string; overview: string; top_attractions: string[] };
  cities: DraftCity[];
  attractions: DraftAttraction[];
};

const regionModules = import.meta.glob('../../../data/discover_bharat/regions/*.json', { eager: true, import: 'default' }) as Record<string, DraftRegion>;
const drafts = Object.values(regionModules);

export function DiscoverBharatDraftPreview({ stateName }: { stateName: string }) {
  const draft = useMemo(() => drafts.find((entry) => entry.region.name.toLowerCase() === stateName.toLowerCase()), [stateName]);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  if (!import.meta.env.DEV || !draft) return null;

  const selectedCity = draft.cities.find((city) => city.id === selectedCityId);
  const attractionById = new Map(draft.attractions.map((attraction) => [attraction.id, attraction]));
  const shownIds = selectedCity
    ? [...selectedCity.attractions, ...selectedCity.hidden_gems]
    : draft.region.top_attractions;

  return (
    <section className="rounded-3xl border-2 border-amber-300 bg-amber-50/80 p-4 sm:p-6 space-y-5" aria-label={`${stateName} draft preview`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-block rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-950">LOCAL EDITORIAL PREVIEW · NOT VERIFIED</span>
          <h2 className="mt-3 font-serif text-2xl font-bold text-stone-950">{draft.region.name} · Discover Bharat draft</h2>
          <p className="mt-1 max-w-3xl text-sm text-stone-700">{draft.region.tagline}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs text-stone-700">{draft.cities.length} cities · {draft.attractions.length} draft places</span>
      </div>
      <p className="text-xs text-amber-950">Place details, visitor information and dates need independent verification. Photo briefs are pending licensed images.</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button type="button" onClick={() => setSelectedCityId(null)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${!selectedCity ? 'bg-[#C74B0A] text-white' : 'bg-white text-stone-800 border border-stone-200'}`}>Top attractions</button>
        {draft.cities.map((city) => (
          <button key={city.id} type="button" onClick={() => setSelectedCityId(city.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${selectedCity?.id === city.id ? 'bg-[#C74B0A] text-white' : 'bg-white text-stone-800 border border-stone-200'}`}>{city.name}</button>
        ))}
      </div>
      {selectedCity && <p className="text-sm text-stone-700"><strong>{selectedCity.name}:</strong> {selectedCity.blurb}</p>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shownIds.map((id) => {
          const place = attractionById.get(id);
          if (!place) return null;
          return <article key={id} className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-orange-50 to-stone-100 px-4 text-center text-xs text-stone-500">Photo awaiting licensed or original image</div>
            <div className="space-y-2 p-4">
              <div className="flex flex-wrap gap-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800"><span>{place.category}</span>{place.is_hidden_gem && <span>· Hidden gem candidate</span>}</div>
              <h3 className="font-serif text-lg font-bold text-stone-950">{place.name}</h3>
              <p className="text-sm leading-relaxed text-stone-700">{place.summary}</p>
              <span className="inline-block text-xs text-amber-900">Editorial review pending</span>
            </div>
          </article>;
        })}
      </div>
    </section>
  );
}
