import React, { useState } from 'react';
import { Landmark, Sparkles, Layers, Info, Compass, ShieldCheck } from 'lucide-react';

export const Heritage3DPage: React.FC = () => {
  const [selectedMonument, setSelectedMonument] = useState('Gateway of India');

  const monuments = [
    {
      name: 'Gateway of India',
      city: 'Mumbai',
      era: 'Indo-Saracenic (1924)',
      architect: 'George Wittet',
      material: 'Yellow Basalt & Reinforced Concrete',
      imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&auto=format&fit=crop&q=80',
      description: 'Erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder in 1911. Blends 16th-century Gujarati architectural traditions with classical Roman triumphal arch motifs.',
    },
    {
      name: 'Taj Mahal',
      city: 'Agra',
      era: 'Mughal Architectural Apex (1653)',
      architect: 'Ustad Ahmad Lahori',
      material: 'Makrana Pure White Marble',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
      description: 'UNESCO World Heritage monument showcasing fourfold symmetry, intricate pietra dura inlay work, and monumental onion domes set amidst charbagh water channels.',
    },
    {
      name: 'Qutub Minar',
      city: 'Delhi',
      era: 'Delhi Sultanate (1199)',
      architect: 'Qutb-ud-din Aibak & Iltutmish',
      material: 'Fluted Red Sandstone & Marble',
      imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=80',
      description: 'The tallest brick minaret in the world standing at 72.5 meters. Features fluted columns, ornate balcony brackets, and Quranic calligraphic friezes.',
    },
    {
      name: 'Hawa Mahal',
      city: 'Jaipur',
      era: 'Rajput Architecture (1799)',
      architect: 'Lal Chand Ustad',
      material: 'Pink and Red Sandstone',
      imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=1200&auto=format&fit=crop&q=80',
      description: 'The Palace of Winds features 953 intricate jharokha honeycomb windows designed with natural Venturi airflow for royal women to observe street processions.',
    },
  ];

  const current = monuments.find((m) => m.name === selectedMonument) || monuments[0];

  return (
    <div className="space-y-4 sm:space-y-6 w-full animate-fadeIn pb-8">
      <div className="space-y-1.5 sm:space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 text-[#FF671F] border border-orange-200 text-[11px] sm:text-xs font-semibold">
          <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF671F]" />
          <span>Architectural Heritage Archives</span>
        </div>
        <h1 className="font-serif text-xl sm:text-3xl font-bold text-[#0B192C] tracking-tight">Heritage Monument Architecture</h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Historical architectural analysis of iconic Indian structures, examining structural geometry, building materials, and master artisans.
        </p>
      </div>

      {/* Monument selector tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
        {monuments.map((m) => (
          <button
            key={m.name}
            onClick={() => setSelectedMonument(m.name)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
              selectedMonument === m.name
                ? 'bg-[#FF671F] text-white font-bold shadow-xs border border-[#FF671F]'
                : 'bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      {/* Visual Architectural Showcase */}
      <div className="relative h-72 sm:h-96 w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-warm bg-stone-100">
        <img
          src={current.imageUrl}
          alt={current.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">{current.city} • {current.era}</span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold">{current.name}</h2>
        </div>
      </div>

      {/* Architectural Dossier */}
      <div className="rounded-2xl bg-white border border-[#EFE8DF] p-3.5 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B192C]">
          <Info className="w-4 h-4 text-[#046A38] shrink-0" />
          <span>Architectural Breakdown: {current.name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs">
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5 sm:space-y-1">
            <span className="text-stone-500 font-semibold block uppercase text-[9px] sm:text-[10px]">Era & Style</span>
            <span className="font-bold text-stone-900 text-xs sm:text-sm">{current.era}</span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5 sm:space-y-1">
            <span className="text-stone-500 font-semibold block uppercase text-[9px] sm:text-[10px]">Master Architect</span>
            <span className="font-bold text-stone-900 text-xs sm:text-sm">{current.architect}</span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-0.5 sm:space-y-1">
            <span className="text-stone-500 font-semibold block uppercase text-[9px] sm:text-[10px]">Materiality</span>
            <span className="font-bold text-stone-900 text-xs sm:text-sm">{current.material}</span>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
          {current.description}
        </p>
      </div>
    </div>
  );
};
