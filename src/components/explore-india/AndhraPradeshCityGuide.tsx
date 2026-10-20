import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Camera, ChevronLeft, ChevronRight, Clock3, Hotel, MapPin } from 'lucide-react';
import { ANDHRA_PRADESH_CITY_GUIDE, AndhraPradeshCityGuideEntry } from '../../data/andhraPradeshCityGuide';

type PlaceSlide = { name: string; area: string; image: string; source: string; credit: string; license: string; summary: string };

// Exact place photographs from Wikimedia Commons; image page and license are linked in the UI.
const PLACES: PlaceSlide[] = [
  { name: 'Tirumala Venkateswara Temple', area: 'Tirupati', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Tirumala_Venkateswara_temple_entrance_09062015.JPG/1920px-Tirumala_Venkateswara_temple_entrance_09062015.JPG', source: 'https://commons.wikimedia.org/wiki/File:Tirumala_Venkateswara_temple_entrance_09062015.JPG', credit: 'Nikhilb239', license: 'CC BY-SA 4.0', summary: 'A major pilgrimage complex in the Tirumala hills. Check TTD for current darshan guidance.' },
  { name: 'Amaravati Mahachaitya', area: 'Amaravati', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Amaravati_Stupa.JPG/1920px-Amaravati_Stupa.JPG', source: 'https://commons.wikimedia.org/wiki/File:Amaravati_Stupa.JPG', credit: 'Shravan Mandepudi', license: 'CC BY 3.0', summary: 'An important Buddhist archaeological site associated with ancient Dhanyakataka.' },
  { name: 'Kanaka Durga Temple', area: 'Vijayawada', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Bezawada_Kanaka_Durga_Temple.jpg/1920px-Bezawada_Kanaka_Durga_Temple.jpg', source: 'https://commons.wikimedia.org/wiki/File:Bezawada_Kanaka_Durga_Temple.jpg', credit: 'EnrichIndegi', license: 'CC BY-SA 4.0', summary: 'A hilltop temple overlooking the Krishna River and Vijayawada.' },
  { name: 'Araku Valley', area: 'Alluri Sitharama Raju district', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Araku_Valley_coffee_plantations_in_Ananthagiri_hills_in_Andhra_Pradesh_01.jpg/1920px-Araku_Valley_coffee_plantations_in_Ananthagiri_hills_in_Andhra_Pradesh_01.jpg', source: 'https://commons.wikimedia.org/wiki/File:Araku_Valley_coffee_plantations_in_Ananthagiri_hills_in_Andhra_Pradesh_01.jpg', credit: 'Pinakpani', license: 'CC BY 4.0', summary: 'A highland landscape known for coffee-growing areas and Adivasi cultures.' },
  { name: 'Borra Caves', area: 'Ananthagiri Hills', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Borra_Caves_or_Borra_Guhalu%2C_at_Ananthagiri_hills_of_the_Araku_Valley_in_Andhra_Pradesh_02.jpg/1920px-The_Borra_Caves_or_Borra_Guhalu%2C_at_Ananthagiri_hills_of_the_Araku_Valley_in_Andhra_Pradesh_02.jpg', source: 'https://commons.wikimedia.org/wiki/File:The_Borra_Caves_or_Borra_Guhalu,_at_Ananthagiri_hills_of_the_Araku_Valley_in_Andhra_Pradesh_02.jpg', credit: 'Pinakpani', license: 'CC BY 4.0', summary: 'Limestone caves in the Eastern Ghats, often visited from the Araku region.' },
  { name: 'RK Beach', area: 'Visakhapatnam', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Face_Rock_Monument_at_RK_Beach_Visakhapatnam_28.jpg/1280px-Face_Rock_Monument_at_RK_Beach_Visakhapatnam_28.jpg', source: 'https://commons.wikimedia.org/wiki/File:Face_Rock_Monument_at_RK_Beach_Visakhapatnam_28.jpg', credit: 'Kasyap', license: 'CC0', summary: 'A well-known seafront promenade in Visakhapatnam.' },
  { name: 'Undavalli Caves', area: 'Near Vijayawada', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/A_view_of_Undavalli_caves%28low_angle%29.jpg/1920px-A_view_of_Undavalli_caves%28low_angle%29.jpg', source: 'https://commons.wikimedia.org/wiki/File:A_view_of_Undavalli_caves(low_angle).jpg', credit: 'Kalli navya', license: 'CC BY-SA 4.0', summary: 'Rock-cut cave architecture overlooking the Krishna River valley.' },
  { name: 'Lepakshi Monolithic Nandi', area: 'Lepakshi', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/LPK19-82-Lepakshi-Monolithic_Nandi_statue_0730.jpg/1920px-LPK19-82-Lepakshi-Monolithic_Nandi_statue_0730.jpg', source: 'https://commons.wikimedia.org/wiki/File:LPK19-82-Lepakshi-Monolithic_Nandi_statue_0730.jpg', credit: 'VasuVR', license: 'CC BY 4.0', summary: 'A monumental sculpture associated with the Vijayanagara-era heritage of Lepakshi.' },
  { name: 'Mallikarjuna Temple', area: 'Srisailam', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Entrance_of_Srisailam_temple.jpg/1920px-Entrance_of_Srisailam_temple.jpg', source: 'https://commons.wikimedia.org/wiki/File:Entrance_of_Srisailam_temple.jpg', credit: 'Ravi Chandra', license: 'CC BY-SA 4.0', summary: 'A major Shaiva pilgrimage site in the Nallamala hills.' },
  { name: 'Gandikota Canyon', area: 'Kadapa district', image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Gandikota_Fort_Cuddapah_Andhra_Pradesh_PIC_0033.JPG/1920px-Gandikota_Fort_Cuddapah_Andhra_Pradesh_PIC_0033.JPG', source: 'https://commons.wikimedia.org/wiki/File:Gandikota_Fort_Cuddapah_Andhra_Pradesh_PIC_0033.JPG', credit: 'PJeganathan', license: 'CC BY-SA 4.0', summary: 'A dramatic Pennar river gorge beside the historic Gandikota fort.' },
];

const CITY_IMAGES: Record<string, number> = { 'amaravati': 1, 'visakhapatnam': 5, 'vijayawada': 2, 'tirupati': 0, 'rajahmundry': 2, 'srisailam': 8, 'lepakshi': 7, 'araku-valley': 3 };

const Attribution: React.FC<{ place: PlaceSlide }> = ({ place }) => (
  <a href={place.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-white/80 underline decoration-white/40 underline-offset-2 hover:text-white" aria-label={`Image credit ${place.credit}, ${place.license}`}>
    <Camera className="h-3 w-3" /> Photo: {place.credit} · {place.license} · Wikimedia Commons
  </a>
);

const GuideBlock: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <section><h3 className="mb-1.5 font-bold text-[#0B192C]">{title}</h3><p className="text-sm leading-relaxed text-stone-700">{text}</p></section>
);

export const AndhraPradeshCityGuide: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCity, setSelectedCity] = useState<AndhraPradeshCityGuideEntry | null>(null);
  const slide = PLACES[activeSlide];
  const setSlide = (index: number) => setActiveSlide((index + PLACES.length) % PLACES.length);

  useEffect(() => {
    if (selectedCity) return;
    const timer = window.setInterval(() => setActiveSlide((index) => (index + 1) % PLACES.length), 6500);
    return () => window.clearInterval(timer);
  }, [selectedCity]);

  if (selectedCity) {
    const featured = PLACES[CITY_IMAGES[selectedCity.id] ?? 0];
    return (
      <section className="space-y-6">
        <button type="button" onClick={() => setSelectedCity(null)} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-[#A83E05] hover:bg-orange-50"><ArrowLeft className="h-4 w-4" /> All Andhra Pradesh destinations</button>
        <article className="overflow-hidden rounded-3xl border border-[#EFE8DF] bg-white shadow-sm">
          <div className="relative h-[300px] sm:h-[420px]">
            <img src={featured.image} alt={`${selectedCity.name} — ${featured.name}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 sm:p-8">
              <p className="text-sm font-semibold text-white/85">Andhra Pradesh · {featured.area}</p>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-5xl">{selectedCity.name}</h2>
              <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">{selectedCity.overview}</p>
              <Attribution place={featured} />
            </div>
          </div>
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              <GuideBlock title="A short history" text={selectedCity.history} />
              <section><h3 className="mb-2 font-bold text-[#0B192C]">Top places and experiences</h3><div className="flex flex-wrap gap-2">{selectedCity.famousFor.map((item) => <span key={item} className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm text-stone-700">{item}</span>)}</div></section>
              <GuideBlock title="What makes it special" text={selectedCity.interestingPart} />
            </div>
            <aside className="space-y-3">
              <div className="rounded-2xl border border-[#EFE8DF] bg-[#FCFBF9] p-4"><h3 className="mb-2 flex items-center gap-2 font-bold text-[#0B192C]"><CalendarDays className="h-4 w-4 text-[#E65100]" />Best time to visit</h3><p className="text-sm text-stone-700">{selectedCity.bestTime}</p></div>
              <div className="rounded-2xl border border-[#EFE8DF] bg-[#FCFBF9] p-4"><h3 className="mb-2 flex items-center gap-2 font-bold text-[#0B192C]"><Hotel className="h-4 w-4 text-[#E65100]" />Where to stay</h3><p className="text-sm leading-relaxed text-stone-700">{selectedCity.stayOptions}</p></div>
              <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950"><Clock3 className="mr-1 inline h-3.5 w-3.5" />Editorial travel guide. Check official sources and providers for current opening, access, rates, and availability.</p>
            </aside>
          </div>
        </article>
        <section className="space-y-3"><h3 className="font-serif text-xl font-bold text-[#0B192C]">Explore another Andhra destination</h3><div className="flex flex-wrap gap-2">{ANDHRA_PRADESH_CITY_GUIDE.filter((city) => city.id !== selectedCity.id).map((city) => <button key={city.id} type="button" onClick={() => setSelectedCity(city)} className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium hover:border-orange-300 hover:bg-orange-50">{city.name}</button>)}</div></section>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="relative isolate overflow-hidden rounded-3xl bg-slate-900 shadow-xl" onMouseEnter={() => undefined}>
        <div className="relative h-[360px] sm:h-[480px] lg:h-[560px]">
          {PLACES.map((place, index) => <img key={place.name} src={place.image} alt={place.name} loading={index === activeSlide ? 'eager' : 'lazy'} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`} />)}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />
          <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur sm:left-8 sm:top-8">Andhra Pradesh · 10 famous places</div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-8 lg:p-10">
            <div className="max-w-3xl space-y-2 sm:space-y-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-white/85"><MapPin className="h-4 w-4" />{slide.area}</p>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-5xl lg:text-6xl">{slide.name}</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">{slide.summary}</p>
              <Attribution place={slide} />
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button type="button" onClick={() => setSlide(activeSlide - 1)} aria-label="Previous famous place" className="rounded-full border border-white/50 bg-black/25 p-3 text-white backdrop-blur hover:bg-black/50"><ChevronLeft className="h-5 w-5" /></button>
              <button type="button" onClick={() => setSlide(activeSlide + 1)} aria-label="Next famous place" className="rounded-full border border-white/50 bg-black/25 p-3 text-white backdrop-blur hover:bg-black/50"><ChevronRight className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="absolute bottom-5 right-5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur sm:bottom-8 sm:right-8">{String(activeSlide + 1).padStart(2, '0')} / {PLACES.length}</div>
        </div>
        <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto" aria-label="Choose a famous place">{PLACES.map((place, index) => <button key={place.name} type="button" onClick={() => setSlide(index)} aria-label={`Show ${place.name}`} aria-current={activeSlide === index ? 'true' : undefined} className={`h-2.5 shrink-0 rounded-full transition-all ${activeSlide === index ? 'w-8 bg-[#E65100]' : 'w-2.5 bg-stone-300 hover:bg-orange-300'}`} />)}</div>
          <div className="flex shrink-0 gap-2 sm:hidden"><button type="button" onClick={() => setSlide(activeSlide - 1)} aria-label="Previous place" className="rounded-full border p-2"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setSlide(activeSlide + 1)} aria-label="Next place" className="rounded-full border p-2"><ChevronRight className="h-4 w-4" /></button></div>
          <span className="hidden text-xs font-semibold text-stone-500 sm:block">Auto-changing · every few seconds</span>
        </div>
      </div>

      <div className="space-y-4" id="andhra-pradesh-destinations">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C94D0A]">Discover Bharat · Andhra Pradesh</p><h2 className="mt-1 font-serif text-2xl font-bold text-[#0B192C] sm:text-3xl">Cities &amp; destinations</h2><p className="mt-1 text-sm text-stone-600">Choose a place to open its guide, highlights, best season, and stay suggestions.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{ANDHRA_PRADESH_CITY_GUIDE.map((city, index) => {
          const photo = PLACES[CITY_IMAGES[city.id] ?? index % PLACES.length];
          return <article key={city.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EFE8DF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <button type="button" onClick={() => setSelectedCity(city)} className="relative block h-44 w-full overflow-hidden text-left"><img src={photo.image} alt={`${photo.name}, ${city.name}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-10 font-serif text-xl font-bold text-white">{city.name}</span></button>
            <div className="flex flex-1 flex-col gap-3 p-4"><p className="line-clamp-3 text-sm leading-relaxed text-stone-600">{city.overview}</p><p className="mt-auto flex items-start gap-2 text-xs text-stone-600"><CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C94D0A]" /><span><strong>Best time:</strong> {city.bestTime}</span></p><button type="button" onClick={() => setSelectedCity(city)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C94D0A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#A83E05] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2">Explore {city.name}<ArrowRight className="h-4 w-4" /></button></div>
          </article>;
        })}</div>
      </div>
      <p className="text-xs leading-relaxed text-stone-500">Travel notes are editorial guidance, not live booking information. Confirm current schedules, fees, access rules, and hotel availability directly with official sources and providers. Each photograph links to its Wikimedia Commons source and license.</p>
    </section>
  );
};

export default AndhraPradeshCityGuide;
