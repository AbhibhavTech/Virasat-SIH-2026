import React, { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, Compass, MapPin, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

type Photo = { src: string; alt: string; credit: string; license?: string; source: string };
type Attraction = { name: string; note: string; map: string; type: 'core' | 'hidden'; photo?: Photo };
type Region = { id: string; name: string; district: string; overview: string; photo: Photo; attractions: Attraction[]; source: string };
type Filter = 'all' | 'core' | 'hidden';

const commonsPhoto = (file: string, alt: string, imagePath: string, credit: string, license: string): Photo => ({
  src: `https://thumb.wikimedia.org/wikipedia/commons/thumb/${imagePath}/960px-${file.split(' ').join('_')}`,
  alt, credit, license,
  source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replace(/%2F/g, '/')}`,
});
const officialPhoto = (src: string, alt: string, source: string, credit = 'Arunachal Tourism'): Photo => ({ src, alt, credit, source });

const TAWANG_PHOTO = officialPhoto('/images/arunachal-pradesh-tawang-4k.jpg', 'Mountain scenery in the Tawang region', 'https://arunachaltourism.com/tawang-2/');
const ZIRO_PHOTO = commonsPhoto('Apatani Rice Paddies.jpg', 'Apatani rice fields in Ziro Valley', 'f/f7/Apatani_Rice_Paddies.jpg', 'Kuntal Narayan Chaudhuri', 'CC BY-SA 4.0');
const ITANAGAR_PHOTO = commonsPhoto('Ita fort itanagar 161010 (3).jpg', 'Brick walls at Ita Fort, Itanagar', '9/91/Ita_fort_itanagar_161010_(3).jpg', 'आशीष भटनागर', 'Public domain');
const BOMDILA_PHOTO = officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/upper-gompa-bomdila3.jpg', 'Upper Gompa at Bomdila', 'https://arunachaltourism.com/bomdila/');
const MECHUKA_PHOTO = officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/mechuka-ariel-view.jpg', 'Aerial view of Mechuka Valley', 'https://arunachaltourism.com/aalo-mechuka-package/');
const ROING_PHOTO = officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/mayodia-pass.svg', 'Mayudia Pass in the Roing circuit', 'https://arunachaltourism.com/roing-mayudia-anini/');

const REGIONS: Region[] = [
  {
    id: 'tawang', name: 'Tawang', district: 'Tawang district · The Crown Jewel', overview: 'A high Himalayan destination of Monpa culture, historic monasteries, dramatic passes and glacial lakes.', photo: TAWANG_PHOTO, source: 'https://arunachaltourism.com/tawang-2/',
    attractions: [
      { name: 'Tawang Monastery', type: 'core', note: 'Founded in 1680–81. Arunachal Tourism describes it as India’s largest monastery; explore the assembly hall, library and museum.', map: 'Tawang Monastery, Arunachal Pradesh', photo: commonsPhoto('Tawang Monastery (Tibetan Buddhist).jpg', 'Tawang Monastery on its mountain setting', '2/2a/Tawang_Monastery_(Tibetan_Buddhist).jpg', 'Vikramjit Kakati', 'CC BY-SA 4.0') },
      { name: 'Sela Pass & Sela Lake', type: 'core', note: 'High-altitude pass and lake on the Bomdila–Tawang road. Weather, snow and road conditions can change quickly.', map: 'Sela Pass and Sela Lake, Arunachal Pradesh', photo: commonsPhoto('Sela Lake near Sela pass, Arunachal Pradesh, India.jpg', 'Sela Lake beside Sela Pass', 'f/f8/Sela_Lake_near_Sela_pass,_Arunachal_Pradesh,_India.jpg', 'Rohit Sharma', 'CC BY-SA 4.0') },
      { name: 'Madhuri Lake · Sangetsar Tso', type: 'core', note: 'A high-altitude lake known for its mountain setting and submerged tree trunks. Confirm current access permissions locally.', map: 'Sangetsar Tso Madhuri Lake, Tawang', photo: commonsPhoto('Sangestar Tso, Tawang, Arunachal Pradesh, India.jpg', 'Sangestar Tso, also known as Madhuri Lake', '0/03/Sangestar_Tso,_Tawang,_Arunachal_Pradesh,_India.jpg', 'Rohit Sharma', 'CC BY-SA 4.0') },
      { name: 'Bum La Pass', type: 'core', note: 'A sensitive border-area visit with special access requirements. Arrange permissions through authorised local channels before travelling.', map: 'Bum La Pass, Tawang', photo: officialPhoto('https://arunachaltourism.com/wp-content/uploads/2026/06/bumla-pass.jpg', 'Bum La Pass in Tawang', 'https://arunachaltourism.com/army-assets/') },
      { name: 'Urgelling Monastery', type: 'hidden', note: 'A quieter monastery associated with the birthplace of the Sixth Dalai Lama, Tsangyang Gyatso.', map: 'Urgelling Monastery, Tawang', photo: commonsPhoto('Ugyenling monastery oak tree.jpg', 'Oak tree at Ugyenling Monastery', '1/16/Ugyenling_monastery_oak_tree.jpg', 'Rohit Sharma', 'CC BY-SA 4.0') },
      { name: 'P.T. Tso Lake', type: 'hidden', note: 'A high-altitude lake away from the main town. Use established access routes; informal trekking access is not verified.', map: 'P.T. Tso Lake, Tawang', photo: commonsPhoto('PT Tso, Tawang, India.jpg', 'P.T. Tso high-altitude lake', 'd/d9/PT_Tso,_Tawang,_India.jpg', 'Prof Ranga Sai', 'CC BY-SA 4.0') },
    ],
  },
  {
    id: 'ziro', name: 'Ziro Valley', district: 'Lower Subansiri · The Cultural Haven', overview: 'Pine-covered ridges, Apatani villages and a distinctive rice-and-fish farming landscape.', photo: ZIRO_PHOTO, source: 'https://arunachaltourism.com/itanagar-ziro-daporijo-aalo-pasighat/',
    attractions: [
      { name: 'Apatani villages & rice fields', type: 'core', note: 'The Apatani practice paddy-cum-fish cultivation. Ask residents before entering private farms or photographing people and homes.', map: 'Apatani villages, Ziro Valley, Arunachal Pradesh', photo: ZIRO_PHOTO },
      { name: 'Ziro Puto Hill', type: 'core', note: 'A hillock overlooking the valley and its agricultural landscape. This card uses a verified Ziro Valley landscape image.', map: 'Ziro Puto, Ziro, Arunachal Pradesh', photo: { ...ZIRO_PHOTO, alt: 'Regional view of Apatani fields in Ziro Valley; exact Ziro Puto viewpoint photo not verified' } },
      { name: 'Tarin Fish Farm', type: 'core', note: 'A high-altitude farm in Bulla village associated with the area’s rice-and-fish cultivation system. Exact farm photograph not verified; showing a regional Apatani fields image.', map: 'Tarin Fish Farm, Ziro, Arunachal Pradesh', photo: { ...ZIRO_PHOTO, alt: 'Regional Apatani rice fields near Ziro; exact Tarin Fish Farm photo not verified' } },
      { name: 'Talley Valley Wildlife Sanctuary', type: 'hidden', note: 'A biodiversity-rich sanctuary of subtropical and alpine forest. Arunachal Tourism notes clouded leopard habitat; sightings are not guaranteed.', map: 'Talley Valley Wildlife Sanctuary, Arunachal Pradesh', photo: commonsPhoto('Close wing position of Delias belladonna Fabricius, 1793 – Hill Jezebel Butterflies of Talle valley - 5.jpg', 'Hill Jezebel butterfly photographed in Talle Valley', '0/0f/Close_wing_position_of_Delias_belladonna_Fabricius,_1793_–_Hill_Jezebel_Butterflies_of_Talle_valley_-_5.jpg', 'Subhendukhan', 'CC BY-SA 3.0') },
      { name: 'Menga Cave', type: 'hidden', note: 'A cave stop listed in Arunachal Tourism’s Itanagar–Ziro circuit. Confirm local access before setting out; a site-specific photo was not verified.', map: 'Menga Cave, Arunachal Pradesh', photo: { ...ZIRO_PHOTO, alt: 'Regional Ziro Valley landscape; exact Menga Cave photo not verified' } },
    ],
  },
  {
    id: 'itanagar', name: 'Itanagar', district: 'Papum Pare · Capital & heritage', overview: 'The state capital pairs a medieval brick fort with regional textiles, handicrafts and a forest-fringed lake.', photo: ITANAGAR_PHOTO, source: 'https://arunachaltourism.com/itanagar/',
    attractions: [
      { name: 'Ita Fort', type: 'core', note: 'The “fort of bricks” from which Itanagar takes its name; a key historic site in the capital.', map: 'Ita Fort, Itanagar', photo: ITANAGAR_PHOTO },
      { name: 'Jawaharlal Nehru State Museum', type: 'core', note: 'Regional textiles and handicrafts are among the museum highlights. Check current opening details locally; a museum-specific photo was not verified.', map: 'Jawaharlal Nehru State Museum, Itanagar', photo: { ...ITANAGAR_PHOTO, alt: 'Ita Fort regional heritage image; museum-specific photo not verified' } },
      { name: 'Geker Sinying · Ganga Lake', type: 'core', note: 'A forest-fringed natural lake near the city, known locally as Geker Sinying.', map: 'Geker Sinying Ganga Lake, Itanagar', photo: commonsPhoto('Gyakar Sinyi or Ganga Lake.jpg', 'Ganga Lake, also known as Gyakar Sinyi', '5/5c/Gyakar_Sinyi_or_Ganga_Lake.jpg', 'Mrkrish', 'CC BY-SA 3.0') },
    ],
  },
  {
    id: 'bomdila', name: 'Bomdila', district: 'West Kameng · Himalayan town', overview: 'A mountain town known for its monastery, apple orchards and wide Himalayan views.', photo: BOMDILA_PHOTO, source: 'https://arunachaltourism.com/bomdila/',
    attractions: [
      { name: 'Bomdila Monastery · Upper Gompa', type: 'core', note: 'A Buddhist monastery and cultural centre in Bomdila.', map: 'Bomdila Monastery, Arunachal Pradesh', photo: BOMDILA_PHOTO },
    ],
  },
  {
    id: 'dirang', name: 'Dirang', district: 'West Kameng · Monpa heritage', overview: 'A scenic valley settlement with a historic fortified village, hot springs and access to quiet Sangti Valley.', photo: officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/hot-spring.jpg', 'Hot spring in the Dirang region', 'https://arunachaltourism.com/dirang/'), source: 'https://arunachaltourism.com/dirang/',
    attractions: [
      { name: 'Dirang Dzong', type: 'core', note: 'A fortified Monpa settlement with stone walls and historic gates. Respect community spaces and ask before photographing residents.', map: 'Dirang Dzong, Arunachal Pradesh', photo: { ...BOMDILA_PHOTO, alt: 'Regional West Kameng image; exact Dirang Dzong photograph not verified' } },
      { name: 'Dirang hot springs', type: 'core', note: 'A local natural hot-spring stop. Confirm public access and conditions before visiting.', map: 'Dirang Hot Spring, Arunachal Pradesh', photo: officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/hot-spring.jpg', 'Hot spring in the Dirang region', 'https://arunachaltourism.com/dirang/') },
      { name: 'Sangti Valley', type: 'hidden', note: 'A quiet river valley where black-necked cranes are reported in winter. Wildlife is seasonal; keep a respectful distance.', map: 'Sangti Valley, Dirang, Arunachal Pradesh', photo: { ...BOMDILA_PHOTO, alt: 'Regional West Kameng image; exact Sangti Valley photo not verified' } },
      { name: 'Mandala Top', type: 'hidden', note: 'A high viewpoint with 108 Buddhist stupas and broad mountain views. Check road and weather status before going.', map: 'Mandala Top, Arunachal Pradesh', photo: officialPhoto('https://pbs.twimg.com/media/F4IwyIdbAAAuTRa.jpg', 'Mandala Top Buddhist stupas in West Kameng', 'https://x.com/CSArunachal/status/1693970118148251857', 'Chief Secretary, Arunachal Pradesh') },
    ],
  },
  {
    id: 'mechuka', name: 'Mechuka Valley', district: 'Shi-Yomi · The remote frontier', overview: 'A remote mountain valley along the Siyom (Yargyap Chu) river, with Memba cultural heritage and community stays.', photo: MECHUKA_PHOTO, source: 'https://arunachaltourism.com/aalo-mechuka-package/',
    attractions: [
      { name: 'Samten Yongcha Monastery', type: 'core', note: 'A hilltop Mahayana monastery overlooking the valley, described by Arunachal Tourism as one of the region’s oldest.', map: 'Samten Yongcha Monastery, Mechuka', photo: officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/mechuka-stupa-1024x986.jpg', 'Buddhist stupa in the Mechuka valley area', 'https://arunachaltourism.com/aalo-mechuka-package/') },
      { name: 'Traditional river bridges', type: 'core', note: 'Local river crossings are part of the valley landscape. Use designated bridges and follow local guidance; a bridge-specific photo was not verified.', map: 'Mechuka Valley river bridge, Arunachal Pradesh', photo: { ...MECHUKA_PHOTO, alt: 'Regional Mechuka Valley image; exact bridge photograph not verified' } },
      { name: 'Village homestays & valley walks', type: 'hidden', note: 'Choose locally operated stays and ask hosts which walks are appropriate. Yarlung and Lamang camp availability is not verified in Virasat.', map: 'Mechuka Valley, Shi-Yomi, Arunachal Pradesh', photo: { ...MECHUKA_PHOTO, alt: 'Regional Mechuka Valley image; exact homestay/camp photo not verified' } },
    ],
  },
  {
    id: 'roing', name: 'Roing', district: 'Lower Dibang Valley · Gateway to the eastern hills', overview: 'A riverside town and base for nearby forest, lake and mountain excursions. Road conditions can add time.', photo: ROING_PHOTO, source: 'https://arunachaltourism.com/roing-mayudia-anini/',
    attractions: [
      { name: 'Mayudia Pass', type: 'core', note: 'A mountain resort area about 56 km from Roing at roughly 8,000 ft; snow and road access vary by season.', map: 'Mayudia Pass, Arunachal Pradesh', photo: ROING_PHOTO },
      { name: 'Mehao Lake & Wildlife Sanctuary', type: 'core', note: 'A clear-water lake within a large protected landscape near Roing. Follow forest rules and confirm access before travelling.', map: 'Mehao Lake Wildlife Sanctuary, Arunachal Pradesh', photo: { ...ROING_PHOTO, alt: 'Regional Roing–Mayudia image; exact Mehao Lake photo not verified' } },
    ],
  },
  {
    id: 'anini', name: 'Anini', district: 'Dibang Valley · Remote highland town', overview: 'A remote mountain destination with Idu Mishmi cultural landscapes. Plan for long road transfers and limited services.', photo: { ...ROING_PHOTO, alt: 'Regional Dibang Valley image; exact Anini photograph not verified' }, source: 'https://arunachaltourism.com/roing-mayudia-anini/',
    attractions: [
      { name: 'Anini town & viewpoints', type: 'core', note: 'The district headquarters is a base for exploring the Dibang Valley. Local access, weather and services should be checked before setting out.', map: 'Anini, Dibang Valley, Arunachal Pradesh', photo: { ...ROING_PHOTO, alt: 'Regional Dibang Valley image; exact Anini photograph not verified' } },
      { name: 'Dibang River valley', type: 'hidden', note: 'A remote river landscape best explored with local guidance. Virasat has not verified specific public trails or camping access.', map: 'Dibang River, Anini, Arunachal Pradesh', photo: { ...ROING_PHOTO, alt: 'Regional Dibang Valley image; exact river viewpoint photo not verified' } },
    ],
  },
  {
    id: 'dong', name: 'Dong Valley', district: 'Anjaw · India’s eastern sunrise region', overview: 'A remote eastern destination near Walong. Treat it as its own journey, not as a quick side trip from Roing.', photo: officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/mayodia-pass.svg', 'Arunachal mountain-route illustration; exact Dong Valley photo not verified', 'https://arunachaltourism.com/dong-valley/'), source: 'https://arunachaltourism.com/dong-valley/',
    attractions: [
      { name: 'Dong village sunrise viewpoint', type: 'core', note: 'A remote eastern viewpoint reached with local transport and walking. Sunrise time changes by date; no fixed 4:00 AM time is promised.', map: 'Dong Valley, Anjaw, Arunachal Pradesh', photo: officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/mayodia-pass.svg', 'Arunachal route illustration; exact Dong sunrise photo not verified', 'https://arunachaltourism.com/dong-valley/') },
      { name: 'Lohit suspension bridge', type: 'hidden', note: 'The area is known for a suspension bridge and views over the Lohit. Confirm current access and safety locally.', map: 'Dong Valley suspension bridge, Arunachal Pradesh', photo: officialPhoto('https://arunachaltourism.com/wp-content/uploads/2021/07/mayodia-pass.svg', 'Arunachal route illustration; exact Dong bridge photo not verified', 'https://arunachaltourism.com/dong-valley/') },
    ],
  },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All places' },
  { id: 'core', label: 'Core attractions' },
  { id: 'hidden', label: 'Hidden gems' },
];

export const ArunachalPradeshGuide: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRegion = REGIONS.find((region) => region.id === selectedId) ?? REGIONS[0];
  const visibleAttractions = useMemo(() => selectedId ? selectedRegion.attractions.filter((item) => filter === 'all' || item.type === filter) : [], [filter, selectedId, selectedRegion]);

  const selectRegion = (id: string) => {
    setSelectedId(id);
    setFilter('all');
    window.setTimeout(() => document.getElementById('arunachal-attractions')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return <section className="space-y-8" aria-labelledby="arunachal-guide-title">
    <header className="relative isolate overflow-hidden rounded-3xl border border-orange-100 bg-[#10271f] shadow-lg">
      <img src={TAWANG_PHOTO.src} alt={TAWANG_PHOTO.alt} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071b19]/95 via-[#10271f]/70 to-[#10271f]/10" />
      <div className="max-w-3xl space-y-4 px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em]"><Sparkles className="h-4 w-4 text-amber-300" />Discover Bharat · Arunachal Pradesh</p>
        <h2 id="arunachal-guide-title" className="font-serif text-3xl font-bold sm:text-5xl">Pick a destination. Find your next stop.</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">Explore each destination first, then browse individual heritage, nature and offbeat place cards.</p>
        <a href="#arunachal-destinations" className="inline-flex items-center gap-2 rounded-xl bg-[#E65100] px-5 py-3 text-sm font-bold text-white shadow transition hover:bg-[#C74600]">Choose a destination <ArrowRight className="h-4 w-4" /></a>
      </div>
    </header>

    <section className="grid gap-4 lg:grid-cols-2" aria-label="Travel planning tools">
      <article className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-3"><span className="rounded-xl bg-sky-100 p-2.5 text-sky-800"><ShieldCheck className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-sky-800">Before you travel</p><h3 className="mt-1 font-serif text-xl font-bold text-slate-900">Permit planner</h3></div></div>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">Indian citizens need an Inner Line Permit (ILP). Foreign nationals need a Protected Area Permit (PAP); check current rules for your itinerary.</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">Official application links only; Virasat cannot check application status or store permit documents.</p>
        <div className="mt-4 flex flex-wrap gap-2"><a href="https://eilp.arunachal.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Apply for ILP <ArrowUpRight className="h-4 w-4" /></a><a href="https://arunachaltourism.com/protected-area-permit/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">Foreign visitor PAP guidance <ArrowUpRight className="h-4 w-4" /></a></div>
      </article>
      <article className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 sm:p-6">
        <div className="flex items-start gap-3"><span className="rounded-xl bg-amber-100 p-2.5 text-amber-800"><CalendarDays className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-wider text-amber-800">Culture calendar</p><h3 className="mt-1 font-serif text-xl font-bold text-slate-900">Festivals, by community</h3></div></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-amber-100 bg-white p-3"><p className="font-semibold text-slate-900">Myoko · Apatani</p><p className="mt-1 text-xs leading-relaxed text-slate-600">Dates and visitor access are set locally; confirm with the community before planning.</p></div><div className="rounded-2xl border border-amber-100 bg-white p-3"><p className="font-semibold text-slate-900">Tamladu · Mishmi</p><p className="mt-1 text-xs leading-relaxed text-slate-600">Arunachal Tourism lists 15 February; confirm this year’s programme with local organisers.</p></div></div>
        <p className="mt-3 text-xs text-slate-500">No live community calendar is connected, so unconfirmed dates are not shown as scheduled events.</p>
      </article>
    </section>

    <section className="grid gap-4 rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 to-white p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6" aria-label="Trip planning guidance">
      <div><p className="text-xs font-bold uppercase tracking-wider text-[#A83E05]">Plan by circuit</p><h3 className="mt-1 font-serif text-xl font-bold text-slate-900">Allow 7–10 days for a selected route</h3><p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">October–April is a common starting window for clearer travel conditions. July–September is monsoon season and can bring heavy rain and closures. Seven to ten days fits one or two circuits; combining distant regions may take longer.</p></div>
      <a href="/itinerary?destination=Arunachal%20Pradesh" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C94D0A] px-4 py-3 text-sm font-bold text-white hover:bg-[#A83E05]">Plan a trip <ArrowUpRight className="h-4 w-4" /></a>
    </section>

    <section id="arunachal-destinations" className="scroll-mt-24 space-y-5">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C94D0A]">Discover destinations</p><h3 className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">Choose a city or region</h3><p className="mt-1 text-sm text-slate-600">Select a card to open its attractions and hidden places below.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{REGIONS.map((region) => {
        const active = selectedId === region.id;
        const regionalPhoto = /not verified/i.test(region.photo.alt);
        return <article key={region.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${active ? 'border-orange-400 ring-2 ring-orange-100' : 'border-stone-200'}`}>
          <button type="button" onClick={() => selectRegion(region.id)} aria-pressed={active} className="block w-full text-left">
            <div className="relative h-44 overflow-hidden bg-slate-200"><img src={region.photo.src} alt={region.photo.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />{regionalPhoto && <span className="absolute left-3 top-3 rounded-md bg-black/75 px-2 py-1 text-[10px] font-semibold text-white">Regional photo · exact image unverified</span>}<span className="absolute bottom-3 left-4 right-4 font-serif text-2xl font-bold text-white">{region.name}</span></div>
            <div className="space-y-3 p-4"><p className="text-[11px] font-bold uppercase tracking-wide text-[#A83E05]">{region.district}</p><p className="line-clamp-3 text-sm leading-relaxed text-slate-700">{region.overview}</p><p className="text-[11px] text-slate-500">Photo: {region.photo.credit}{region.photo.license ? ` · ${region.photo.license}` : ''}</p><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-slate-500">{region.attractions.length} place cards</span><span className="inline-flex items-center gap-1 rounded-lg bg-[#C94D0A] px-3 py-2 text-xs font-bold text-white">Explore <ArrowRight className="h-3.5 w-3.5" /></span></div></div>
          </button>
        </article>;
      })}</div>
    </section>

    {selectedId && <section id="arunachal-attractions" className="scroll-mt-24 space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C94D0A]">Selected destination</p><h3 className="mt-1 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">{selectedRegion.name}</h3><p className="mt-1 max-w-3xl text-sm text-slate-600">{selectedRegion.overview}</p></div><div className="flex flex-wrap gap-2" aria-label="Filter place cards">{FILTERS.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === item.id ? 'bg-[#C94D0A] text-white' : 'border border-stone-200 bg-white text-stone-700 hover:bg-orange-50'}`}>{item.label}</button>)}</div></div>
      <button type="button" onClick={() => { setSelectedId(null); setFilter('all'); document.getElementById('arunachal-destinations')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-orange-50">← All Arunachal destinations</button>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleAttractions.map((attraction) => {
        const photo = attraction.photo ?? { ...selectedRegion.photo, alt: `Regional landscape for ${selectedRegion.name}; exact view of ${attraction.name} not verified` };
        const regionalImage = /not verified/i.test(photo.alt);
        return <article key={attraction.name} className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="relative h-48 overflow-hidden bg-stone-200"><img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" /><span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${attraction.type === 'hidden' ? 'bg-emerald-700 text-white' : 'bg-white/95 text-[#A83E05]'}`}>{attraction.type === 'hidden' ? 'Hidden gem' : 'Core attraction'}</span>{regionalImage && <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-1 text-[10px] font-semibold text-white">Regional photo · exact site image unverified</span>}</div>
          <div className="flex flex-1 flex-col p-4"><h4 className="font-serif text-xl font-bold text-slate-950">{attraction.name}</h4><p className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">{attraction.note}</p>
            <p className="mt-3 text-[11px] text-slate-500">Photo: {photo.credit}{photo.license ? ` · ${photo.license}` : ''}</p>
            <div className="mt-3 flex flex-wrap gap-2"><a href={`/map?q=${encodeURIComponent(attraction.map)}`} className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-[#A83E05]"><MapPin className="h-3.5 w-3.5" />View map</a><a href={`/ai?prompt=${encodeURIComponent(`Tell me what is verified about ${attraction.name} in ${selectedRegion.name}, Arunachal Pradesh. Explain access, what to see, and what needs local confirmation.`)}`} className="inline-flex items-center gap-1.5 rounded-full bg-[#C94D0A] px-3 py-2 text-xs font-bold text-white"><MessageCircle className="h-3.5 w-3.5" />Ask Virasat AI</a><a href={photo.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-3 py-2 text-xs font-semibold text-slate-600"><ArrowUpRight className="h-3 w-3" />Photo source</a></div>
          </div>
        </article>;
      })}</div>
      <a href={selectedRegion.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#A83E05]">Official tourism details for {selectedRegion.name} <ArrowUpRight className="h-3.5 w-3.5" /></a>
    </section>}
    <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><Compass className="mr-1 inline h-4 w-4" />Some cards use a regional landscape when an exact site photo could not be verified; the image caption says so. Mountain roads, border-area permissions, forest access and schedules can change. Virasat has no live permit status, official opening times, fees or trail conditions; confirm locally before travelling.</p>
  </section>;
};

export default ArunachalPradeshGuide;
