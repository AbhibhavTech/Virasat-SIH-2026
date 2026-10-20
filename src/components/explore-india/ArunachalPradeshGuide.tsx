import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, Compass, MapPin, MessageCircle, Mountain, ShieldCheck, Sparkles, Trees } from 'lucide-react';

type ArunachalPlace = { name: string; region: string; kind: string; summary: string; highlight: string; season: string; mapQuery: string; offbeat?: boolean };

const PLACES: ArunachalPlace[] = [
  { name: 'Tawang', region: 'Tawang district', kind: 'Monastery · High Himalaya', summary: 'A high mountain destination shaped by Monpa culture, Buddhist heritage and glacial lakes.', highlight: 'Tawang Monastery was founded in 1680–81. The wider circuit includes Sela Pass and Sangetsar Tso, also called Madhuri Lake.', season: 'Choose a clear-weather window; winter snow and road conditions can disrupt access.', mapQuery: 'Tawang Monastery, Sela Pass, Madhuri Lake, Arunachal Pradesh' },
  { name: 'Ziro Valley', region: 'Lower Subansiri', kind: 'Apatani cultural landscape', summary: 'Pine-covered ridges frame villages and carefully managed rice fields in the Apatani homeland.', highlight: 'Apatani paddy-cum-fish cultivation is a distinctive living agricultural system. Visit respectfully and ask before photographing people or private farms.', season: 'October–April is generally more comfortable; monsoon brings heavy rain.', mapQuery: 'Ziro Valley, Arunachal Pradesh' },
  { name: 'Itanagar', region: 'Papum Pare', kind: 'Capital · History & culture', summary: 'Explore the capital’s brick fort, state museum and forest-ringed Ganga Lake.', highlight: 'Ita Fort means “fort of bricks” and is associated with the medieval history of the capital.', season: 'October–April; allow flexibility for changing weather.', mapQuery: 'Ita Fort, Jawaharlal Nehru State Museum, Itanagar' },
  { name: 'Bomdila & Dirang', region: 'West Kameng', kind: 'Monastery · Mountain circuit', summary: 'A mountain route of monasteries, orchards and valleys on the way to Tawang.', highlight: 'Nearby Sangti Valley is known as a wintering area for black-necked cranes; wildlife sightings are seasonal and never guaranteed.', season: 'October–April; check pass and road conditions before setting out.', mapQuery: 'Bomdila Monastery, Dirang, Sangti Valley, Arunachal Pradesh' },
  { name: 'Mechuka', region: 'Shi-Yomi', kind: 'Remote valley · Memba culture', summary: 'A remote mountain valley with river scenery, village walks and community homestays.', highlight: 'Samten Yongcha Monastery sits on a hill overlooking the valley. Ask locally before visiting villages or photographing residents.', season: 'Confirm road and weather conditions with local operators; leave buffer days.', mapQuery: 'Mechuka Valley, Samten Yongcha Monastery, Arunachal Pradesh', offbeat: true },
  { name: 'Anini', region: 'Dibang Valley', kind: 'Remote highland · Nature', summary: 'A quiet district headquarters and gateway to the dramatic Dibang Valley landscape.', highlight: 'Arunachal Tourism lists the Roing–Mayudia–Anini route as an official tourism circuit. Long, weather-sensitive road journeys need careful planning.', season: 'Check road status and local access before travel; plan generous buffers.', mapQuery: 'Anini, Dibang Valley, Arunachal Pradesh', offbeat: true },
  { name: 'Dong & Kibithoo', region: 'Anjaw', kind: 'Eastern frontier · Sunrise', summary: 'A far-eastern mountain journey through remote settlements and steep Himalayan terrain.', highlight: 'The state is known as the first Indian region to greet the sunrise. Sunrise time changes with date and location; it is not a fixed 4:00 AM event.', season: 'Plan with local authorities and guides; access and weather can change.', mapQuery: 'Dong Valley, Kibithoo, Anjaw, Arunachal Pradesh', offbeat: true },
  { name: 'Sangti Valley', region: 'Near Dirang · West Kameng', kind: 'River valley · Birding', summary: 'A broad, peaceful valley near Dirang with river views, orchards and seasonal birdlife.', highlight: 'Black-necked cranes are seasonal visitors. Keep distance from wildlife and follow local conservation guidance.', season: 'Winter for the crane season; verify current sightings locally.', mapQuery: 'Sangti Valley, Dirang, Arunachal Pradesh', offbeat: true },
  { name: 'Eaglenest Wildlife Sanctuary', region: 'West Kameng', kind: 'Protected forest · Birding', summary: 'A richly varied Himalayan forest landscape popular with birdwatchers and nature researchers.', highlight: 'The Bugun Liocichla is strongly associated with the Eaglenest area. Sightings are not guaranteed; use authorised local guides and follow sanctuary rules.', season: 'Access is seasonal and trail-dependent; check current forest permissions.', mapQuery: 'Eaglenest Wildlife Sanctuary, Arunachal Pradesh', offbeat: true },
];

const FILTERS = [
  { id: 'all', label: 'All destinations' },
  { id: 'core', label: 'Mainstream circuit' },
  { id: 'offbeat', label: 'Deep North · Offbeat' },
] as const;

type Filter = typeof FILTERS[number]['id'];

export const ArunachalPradeshGuide: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const visiblePlaces = useMemo(() => PLACES.filter((place) => filter === 'all' || (filter === 'offbeat' ? place.offbeat : !place.offbeat)), [filter]);

  return <section className="space-y-8" aria-labelledby="arunachal-guide-title">
    <header className="relative isolate overflow-hidden rounded-3xl border border-orange-100 bg-[#10271f] shadow-lg">
      <img src="/images/arunachal-pradesh-tawang-4k.jpg" alt="Mountain landscape in Arunachal Pradesh" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071b19]/95 via-[#10271f]/70 to-[#10271f]/10" />
      <div className="max-w-3xl space-y-4 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em]"><Sparkles className="h-4 w-4 text-amber-300" />Discover Bharat · Arunachal Pradesh</p>
        <h2 id="arunachal-guide-title" className="font-serif text-3xl font-bold sm:text-5xl">Beyond the familiar</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">Plan from iconic monasteries and valleys to quieter frontier landscapes. Travel times, access and weather can change quickly in the mountains.</p>
        <a href="#arunachal-places" className="inline-flex items-center gap-2 rounded-xl bg-[#E65100] px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-[#C74600]">Explore destinations <ArrowUpRight className="h-4 w-4" /></a>
      </div>
    </header>

    <section className="grid gap-4 lg:grid-cols-2" aria-label="Travel planning tools">
      <article className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-3"><span className="rounded-xl bg-sky-100 p-2.5 text-sky-800"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-sky-800">Before you travel</p><h3 className="mt-1 font-serif text-xl font-bold text-slate-900">Permit planner</h3></div></div>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">Indian citizens need an Inner Line Permit (ILP). Foreign nationals need a Protected Area Permit (PAP); eligibility and rules can vary by itinerary.</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">This is a preparation guide, not an application tracker. Check current rules and apply through the official state portal.</p>
        <div className="mt-4 flex flex-wrap gap-2"><a href="https://eilp.arunachal.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Apply for ILP <ArrowUpRight className="h-4 w-4" /></a><a href="https://arunachaltourism.com/protected-area-permit/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">Foreign visitor PAP guidance <ArrowUpRight className="h-4 w-4" /></a></div>
      </article>
      <article className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-3"><span className="rounded-xl bg-amber-100 p-2.5 text-amber-800"><CalendarDays className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-amber-800">Culture calendar</p><h3 className="mt-1 font-serif text-xl font-bold text-slate-900">Festivals, by community</h3></div></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-amber-100 bg-white p-3"><p className="font-semibold text-slate-900">Myoko · Apatani</p><p className="mt-1 text-xs leading-relaxed text-slate-600">Community festival in the Ziro region. Dates and visitor access are set locally; confirm with the community before planning.</p></div>
          <div className="rounded-2xl border border-amber-100 bg-white p-3"><p className="font-semibold text-slate-900">Tamladu · Mishmi</p><p className="mt-1 text-xs leading-relaxed text-slate-600">Arunachal Tourism lists the annual celebration on 15 February. Confirm this year’s public programme with local organisers.</p></div>
        </div>
        <p className="mt-3 text-xs text-slate-500">No live community calendar is connected yet, so unconfirmed dates are not shown as scheduled events.</p>
      </article>
    </section>

    <section id="arunachal-places" className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C94D0A]">Choose your pace</p><h3 className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">Places to explore</h3><p className="mt-1 text-sm text-slate-600">Offbeat is an editorial label, not a live crowd measurement.</p></div><div className="flex flex-wrap gap-2" aria-label="Filter destinations">{FILTERS.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === item.id ? 'bg-[#C94D0A] text-white' : 'border border-stone-200 bg-white text-stone-700 hover:bg-orange-50'}`}>{item.label}</button>)}</div></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visiblePlaces.map((place) => <article key={place.name} className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${place.offbeat ? 'border-emerald-100' : 'border-stone-200'}`}>
        <div className="flex items-start justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${place.offbeat ? 'bg-emerald-50 text-emerald-800' : 'bg-orange-50 text-orange-800'}`}>{place.offbeat ? 'Deep North · Offbeat' : 'Mainstream circuit'}</span>{place.offbeat ? <Trees className="h-5 w-5 text-emerald-700" /> : <Mountain className="h-5 w-5 text-orange-700" />}</div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{place.region} · {place.kind}</p><h4 className="mt-1 font-serif text-xl font-bold text-slate-950">{place.name}</h4><p className="mt-2 text-sm leading-relaxed text-slate-700">{place.summary}</p>
        <div className="mt-3 rounded-xl bg-stone-50 p-3"><p className="text-xs font-bold uppercase tracking-wide text-slate-600">A detail to know</p><p className="mt-1 text-sm leading-relaxed text-slate-700">{place.highlight}</p></div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600"><strong>When to go:</strong> {place.season}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4"><a href={`/map?q=${encodeURIComponent(place.mapQuery)}`} className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-[#A83E05] hover:bg-orange-100"><MapPin className="h-3.5 w-3.5" />View on map</a><a href={`/ai?prompt=${encodeURIComponent(`Help me plan a respectful, safe visit to ${place.name}, Arunachal Pradesh. Explain current access and permit checks, route planning, and what Virasat can verify.`)}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#C94D0A] px-3 py-2 text-xs font-bold text-white hover:bg-[#A83E05]"><MessageCircle className="h-3.5 w-3.5" />Ask Virasat AI</a></div>
      </article>)}</div>
    </section>
    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><Compass className="mr-1 inline h-4 w-4" />Mountain roads, border-area permissions, forest access and opening schedules can change. Virasat does not currently receive live permit status, official opening times, fees or trail conditions; confirm locally before travelling. Respect community protocols and do not enter restricted areas.</p>
  </section>;
};

export default ArunachalPradeshGuide;
