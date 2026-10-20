import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, Compass, MapPin, MessageCircle, Mountain, ShieldCheck, Sparkles, Trees } from 'lucide-react';

type Attraction = { name: string; note: string; map: string };
type Region = { name: string; district: string; overview: string; core: Attraction[]; hidden: Attraction[]; source: string; sourceLabel: string };
type Filter = 'all' | 'core' | 'offbeat';

const REGIONS: Region[] = [
  {
    name: 'Tawang', district: 'Tawang district · The Crown Jewel',
    overview: 'A high Himalayan region of Monpa culture, deep valleys, historic monasteries and glacial lakes.',
    core: [
      { name: 'Tawang Monastery', note: 'Founded in 1680–81; Arunachal Tourism describes it as India’s largest monastery. Its assembly hall and library are major highlights.', map: 'Tawang Monastery, Arunachal Pradesh' },
      { name: 'Sela Pass & Sela Lake', note: 'High-altitude mountain pass and lake on the Bomdila–Tawang route. Weather and road conditions can change quickly.', map: 'Sela Pass and Sela Lake, Arunachal Pradesh' },
      { name: 'Sangetsar Tso · Madhuri Lake', note: 'A high-altitude lake known for its mountain setting and submerged tree trunks. Local access permissions may apply.', map: 'Sangetsar Tso Madhuri Lake, Tawang' },
      { name: 'Bum La Pass', note: 'A sensitive border-area visit with specific access requirements. Arrange permissions through authorised local channels before travelling.', map: 'Bum La Pass, Tawang' },
    ],
    hidden: [
      { name: 'Urgelling Monastery', note: 'A modest monastery associated with the birth of the Sixth Dalai Lama; a quieter heritage stop near Tawang.', map: 'Urgelling Monastery, Tawang' },
      { name: 'P.T. Tso Lake', note: 'A scenic high-altitude lake. Do not assume informal trails are open; confirm route and access locally.', map: 'P.T. Tso Lake, Tawang' },
    ],
    source: 'https://arunachaltourism.com/tawang-2/', sourceLabel: 'Arunachal Tourism · Tawang',
  },
  {
    name: 'Ziro Valley', district: 'Lower Subansiri · The Cultural Haven',
    overview: 'Pine-covered ridges, villages and carefully managed rice fields in the Apatani cultural landscape.',
    core: [
      { name: 'Apatani villages & fields', note: 'The Apatani practice paddy-cum-fish cultivation. Ask residents before entering private farms or photographing people and homes.', map: 'Apatani villages, Ziro Valley, Arunachal Pradesh' },
      { name: 'Ziro Puto', note: 'A hillock overlooking the Ziro valley and its agricultural landscape.', map: 'Ziro Puto, Ziro, Arunachal Pradesh' },
      { name: 'Tarin Fish Farm', note: 'A high-altitude farm in Bulla village associated with the local rice-and-fish cultivation system.', map: 'Tarin Fish Farm, Ziro, Arunachal Pradesh' },
    ],
    hidden: [
      { name: 'Talley Valley Wildlife Sanctuary', note: 'A biodiversity-rich sanctuary with subtropical and alpine forest. Arunachal Tourism notes clouded leopard habitat; sightings are not guaranteed.', map: 'Talley Valley Wildlife Sanctuary, Arunachal Pradesh' },
      { name: 'Menga Cave', note: 'A cave site listed in the official Itanagar–Ziro tourism circuit. Confirm local access before setting out.', map: 'Menga Cave, Ziro, Arunachal Pradesh' },
    ],
    source: 'https://arunachaltourism.com/itanagar-ziro-daporijo-aalo-pasighat/', sourceLabel: 'Arunachal Tourism · Itanagar–Ziro circuit',
  },
  {
    name: 'Itanagar', district: 'Papum Pare · Capital & heritage',
    overview: 'The state capital pairs a medieval brick fort with a museum of regional textiles and handicrafts.',
    core: [
      { name: 'Ita Fort', note: 'The “fort of bricks” from which Itanagar takes its name; a key historic site in the capital.', map: 'Ita Fort, Itanagar' },
      { name: 'Jawaharlal Nehru State Museum', note: 'Explore regional material culture, including textiles and handicrafts; check current opening details locally.', map: 'Jawaharlal Nehru State Museum, Itanagar' },
      { name: 'Geker Sinying · Ganga Lake', note: 'A forest-fringed natural lake near the city, known locally as Geker Sinying.', map: 'Geker Sinying Ganga Lake, Itanagar' },
    ], hidden: [], source: 'https://arunachaltourism.com/itanagar/', sourceLabel: 'Arunachal Tourism · Itanagar',
  },
  {
    name: 'Dirang & Bomdila', district: 'West Kameng · Scenic alpine retreats',
    overview: 'A mountain corridor of monasteries, orchards, hot springs and traditional settlements on the route toward Tawang.',
    core: [
      { name: 'Bomdila Monastery', note: 'A Buddhist monastery and cultural centre in Bomdila.', map: 'Bomdila Monastery, Arunachal Pradesh' },
      { name: 'Dirang Dzong', note: 'A fortified Monpa settlement with stone walls and historic gates; visit with respect for community spaces.', map: 'Dirang Dzong, Arunachal Pradesh' },
      { name: 'Dirang hot springs', note: 'A local natural hot-spring stop. Confirm public access and conditions before visiting.', map: 'Dirang Hot Spring, Arunachal Pradesh' },
    ],
    hidden: [
      { name: 'Sangti Valley', note: 'A quiet river valley where black-necked cranes are reported in winter. Wildlife is seasonal; keep a respectful distance.', map: 'Sangti Valley, Dirang, Arunachal Pradesh' },
      { name: 'Mandala Top', note: 'A high viewpoint with a circle of stupas and broad mountain views. Check road and weather status before going.', map: 'Mandala Top, Arunachal Pradesh' },
    ],
    source: 'https://arunachaltourism.com/dirang/', sourceLabel: 'Arunachal Tourism · Dirang',
  },
  {
    name: 'Mechuka Valley', district: 'Shi-Yomi · The remote frontier',
    overview: 'A remote mountain valley along the Siyom (Yargyap Chu) river, with Memba cultural heritage and community stays.',
    core: [
      { name: 'Samten Yongcha Monastery', note: 'A hilltop Mahayana monastery overlooking the valley, described by Arunachal Tourism as one of the region’s oldest.', map: 'Samten Yongcha Monastery, Mechuka' },
      { name: 'Traditional river bridges', note: 'Local bridges and river crossings are part of the valley landscape. Use designated crossings and follow local guidance.', map: 'Mechuka Valley river bridge, Arunachal Pradesh' },
    ],
    hidden: [
      { name: 'Village homestays & valley walks', note: 'Choose locally operated stays and ask hosts which village walks are appropriate. Yarlung and Lamang camp availability is not verified in Virasat.', map: 'Mechuka Valley, Shi-Yomi, Arunachal Pradesh' },
    ],
    source: 'https://arunachaltourism.com/aalo-mechuka-package/', sourceLabel: 'Arunachal Tourism · Aalo–Mechuka',
  },
  {
    name: 'Roing & Anini', district: 'Lower Dibang Valley & Dibang Valley · The Untamed East',
    overview: 'A long, rugged circuit of forest, high passes, lakes and Idu Mishmi cultural landscapes. Allow extra days for road conditions.',
    core: [
      { name: 'Mayudia Pass', note: 'A mountain resort area about 56 km from Roing at roughly 8,000 ft; snow and road access vary by season.', map: 'Mayudia Pass, Arunachal Pradesh' },
      { name: 'Mehao Lake & Wildlife Sanctuary', note: 'The lake lies within a large protected landscape near Roing. Follow forest rules and confirm access before travelling.', map: 'Mehao Lake Wildlife Sanctuary, Arunachal Pradesh' },
      { name: 'Anini', note: 'A remote district headquarters on an official Roing–Mayudia–Anini tourism circuit. Travel conditions and services are limited.', map: 'Anini, Dibang Valley, Arunachal Pradesh' },
    ],
    hidden: [
      { name: 'Dong Valley · sunrise country', note: 'A far-eastern extension in Anjaw district, not a nearby Roing stop. Sunrise time changes by date and location; no fixed 4:00 AM claim is made.', map: 'Dong Valley, Anjaw, Arunachal Pradesh' },
    ],
    source: 'https://arunachaltourism.com/roing-mayudia-anini/', sourceLabel: 'Arunachal Tourism · Roing–Mayudia–Anini',
  },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All places' },
  { id: 'core', label: 'Core attractions' },
  { id: 'offbeat', label: 'Hidden gems' },
];

export const ArunachalPradeshGuide: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const visibleRegions = useMemo(() => REGIONS.filter((region) => filter === 'all' || (filter === 'core' ? region.core.length > 0 : region.hidden.length > 0)), [filter]);
  const showCore = filter !== 'offbeat';
  const showHidden = filter !== 'core';

  return <section className="space-y-8" aria-labelledby="arunachal-guide-title">
    <header className="relative isolate overflow-hidden rounded-3xl border border-orange-100 bg-[#10271f] shadow-lg">
      <img src="/images/arunachal-pradesh-tawang-4k.jpg" alt="Mountain landscape in Arunachal Pradesh" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071b19]/95 via-[#10271f]/70 to-[#10271f]/10" />
      <div className="max-w-3xl space-y-4 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em]"><Sparkles className="h-4 w-4 text-amber-300" />Discover Bharat · Arunachal Pradesh</p>
        <h2 id="arunachal-guide-title" className="font-serif text-3xl font-bold sm:text-5xl">Mountain circuits, local stories</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">Start with the best-known heritage, then find quieter valleys, wildlife and community-led experiences. Distances are long and conditions change, so plan by circuit.</p>
        <a href="#arunachal-places" className="inline-flex items-center gap-2 rounded-xl bg-[#E65100] px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-[#C74600]">Explore destinations <ArrowUpRight className="h-4 w-4" /></a>
      </div>
    </header>

    <section className="grid gap-4 lg:grid-cols-2" aria-label="Travel planning tools">
      <article className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-3"><span className="rounded-xl bg-sky-100 p-2.5 text-sky-800"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-sky-800">Before you travel</p><h3 className="mt-1 font-serif text-xl font-bold text-slate-900">Permit planner</h3></div></div>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">Indian citizens need an Inner Line Permit (ILP). Foreign nationals need a Protected Area Permit (PAP); eligibility and rules can vary by itinerary.</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">This is an official-link guide, not a permit tracker. The app cannot check application status or store permit documents.</p>
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

    <section className="grid gap-4 rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 to-white p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6" aria-label="Trip planning guidance">
      <div><p className="text-xs font-bold uppercase tracking-wider text-[#A83E05]">Plan by circuit</p><h3 className="mt-1 font-serif text-xl font-bold text-slate-900">Allow 7–10 days for a selected route</h3><p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">October–April is a common starting window for clearer travel conditions. July–September is monsoon season and can bring heavy rain and closures. Seven to ten days fits one or two circuits; combining distant regions may take longer.</p></div>
      <a href="/itinerary?destination=Arunachal%20Pradesh" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C94D0A] px-4 py-3 text-sm font-bold text-white hover:bg-[#A83E05]">Plan a trip <ArrowUpRight className="h-4 w-4" /></a>
    </section>

    <section id="arunachal-places" className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C94D0A]">Choose your pace</p><h3 className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">Core attractions &amp; hidden gems</h3><p className="mt-1 text-sm text-slate-600">“Hidden gem” is Virasat’s editorial category, not a live crowd measurement.</p></div><div className="flex flex-wrap gap-2" aria-label="Filter destinations">{FILTERS.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === item.id ? 'bg-[#C94D0A] text-white' : 'border border-stone-200 bg-white text-stone-700 hover:bg-orange-50'}`}>{item.label}</button>)}</div></div>
      <div className="grid gap-4 xl:grid-cols-2">{visibleRegions.map((region) => <article key={region.name} className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{region.district}</p><h4 className="mt-1 font-serif text-2xl font-bold text-slate-950">{region.name}</h4><p className="mt-2 text-sm leading-relaxed text-slate-700">{region.overview}</p>
        {showCore && region.core.length > 0 && <div className="mt-4"><h5 className="flex items-center gap-2 text-sm font-bold text-[#A83E05]"><Mountain className="h-4 w-4" />Core attractions</h5><ul className="mt-2 space-y-2">{region.core.map((attraction) => <li key={attraction.name} className="rounded-xl bg-orange-50/70 p-3"><p className="font-semibold text-slate-900">{attraction.name}</p><p className="mt-1 text-xs leading-relaxed text-slate-700">{attraction.note}</p><a href={`/map?q=${encodeURIComponent(attraction.map)}`} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#A83E05]"><MapPin className="h-3 w-3" />Map</a></li>)}</ul></div>}
        {showHidden && region.hidden.length > 0 && <div className="mt-4"><h5 className="flex items-center gap-2 text-sm font-bold text-emerald-800"><Trees className="h-4 w-4" />Hidden gems &amp; quieter stops</h5><ul className="mt-2 space-y-2">{region.hidden.map((attraction) => <li key={attraction.name} className="rounded-xl bg-emerald-50/70 p-3"><p className="font-semibold text-slate-900">{attraction.name}</p><p className="mt-1 text-xs leading-relaxed text-slate-700">{attraction.note}</p><a href={`/map?q=${encodeURIComponent(attraction.map)}`} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-800"><MapPin className="h-3 w-3" />Map</a></li>)}</ul></div>}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4"><a href={region.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-stone-50">Official tourism details <ArrowUpRight className="h-3.5 w-3.5" /></a><a href={`/ai?prompt=${encodeURIComponent(`Help plan a respectful, safe visit to ${region.name}, Arunachal Pradesh. Explain current access and permit checks, route planning, and clearly distinguish verified details from estimates.`)}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#C94D0A] px-3 py-2 text-xs font-bold text-white hover:bg-[#A83E05]"><MessageCircle className="h-3.5 w-3.5" />Ask Virasat AI</a></div>
      </article>)}</div>
    </section>
    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><Compass className="mr-1 inline h-4 w-4" />Mountain roads, border-area permissions, forest access and opening schedules can change. Virasat does not currently receive live permit status, official opening times, fees or trail conditions; confirm locally before travelling. Respect community protocols and do not enter restricted areas.</p>
  </section>;
};

export default ArunachalPradeshGuide;
