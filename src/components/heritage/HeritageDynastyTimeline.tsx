import React from 'react';
import { Sparkles, Calendar, Landmark, ChevronRight, Layers } from 'lucide-react';

export interface ArchitecturalEra {
  id: string;
  name: string;
  period: string;
  dynasty: string;
  signatureSites: string[];
  materials: string;
  architecturalStyle: string;
  iconColor: string;
  bgGradient: string;
  borderAccent: string;
}

export const ARCHITECTURAL_ERAS: ArchitecturalEra[] = [
  {
    id: 'ancient-buddhist',
    name: 'Ancient & Buddhist',
    period: '3rd C. BCE - 2nd C. CE',
    dynasty: 'Mauryan & Satavahana',
    signatureSites: ['Sanchi Stupa', 'Ajanta Caves (Early)', 'Ashokan Pillars'],
    materials: 'Chunar Sandstone & Monolithic Rock',
    architecturalStyle: 'Hemispherical Torana Stupas & Chaitya Halls',
    iconColor: 'text-amber-700',
    bgGradient: 'from-amber-50 to-orange-50/40',
    borderAccent: 'border-amber-200',
  },
  {
    id: 'classical-rockcut',
    name: 'Classical Rock-Cut',
    period: '4th - 8th C. CE',
    dynasty: 'Gupta, Rashtrakuta & Chalukya',
    signatureSites: ['Ellora Kailash Temple', 'Elephanta Caves', 'Mahabalipuram Rathas'],
    materials: 'Monolithic Basalt & Granite',
    architecturalStyle: 'Top-Down Monolithic Excavation & Frescoed Viharas',
    iconColor: 'text-emerald-800',
    bgGradient: 'from-emerald-50 to-teal-50/40',
    borderAccent: 'border-emerald-200',
  },
  {
    id: 'dravidian-chola',
    name: 'Dravidian Grandeur',
    period: '9th - 13th C. CE',
    dynasty: 'Imperial Chola & Pandya',
    signatureSites: ['Brihadisvara Temple', 'Gangaikondacholapuram', 'Airavatesvara'],
    materials: 'Interlocking Granite Slabs (No Mortar)',
    architecturalStyle: 'Towering Pyramidal Vimanas & Sculpted Gopurams',
    iconColor: 'text-indigo-800',
    bgGradient: 'from-indigo-50 to-blue-50/40',
    borderAccent: 'border-indigo-200',
  },
  {
    id: 'kalinga-hoysala',
    name: 'Kalinga & Hoysala',
    period: '11th - 13th C. CE',
    dynasty: 'Eastern Ganga & Hoysala',
    signatureSites: ['Konark Sun Temple', 'Belur & Halebidu', 'Puri Jagannath'],
    materials: 'Khondalite & Chloritic Schist',
    architecturalStyle: 'Astronomical Chariot Wheels & Stellated Star Platforms',
    iconColor: 'text-amber-900',
    bgGradient: 'from-orange-50 to-yellow-50/40',
    borderAccent: 'border-orange-200',
  },
  {
    id: 'indo-islamic',
    name: 'Indo-Islamic & Sultanate',
    period: '12th - 16th C. CE',
    dynasty: 'Mamluk, Khalji & Tughlaq',
    signatureSites: ['Qutub Minar', 'Alai Darwaza', 'Golconda Fort'],
    materials: 'Fluted Red Sandstone & Marble Trims',
    architecturalStyle: 'Corbelled Arches, Fluted Minarets & Geometric Calligraphy',
    iconColor: 'text-rose-800',
    bgGradient: 'from-rose-50 to-stone-50',
    borderAccent: 'border-rose-200',
  },
  {
    id: 'imperial-mughal',
    name: 'Imperial Mughal',
    period: '1526 - 1707 CE',
    dynasty: 'Mughal Empire',
    signatureSites: ['Taj Mahal', 'Red Fort (Delhi)', 'Fatehpur Sikri', 'Humayun’s Tomb'],
    materials: 'Makrana White Marble & Red Sikri Sandstone',
    architecturalStyle: 'Charbagh Symmetry, Double Domes & Pietra Dura Floral Inlays',
    iconColor: 'text-[#FF671F]',
    bgGradient: 'from-orange-50 via-white to-amber-50/50',
    borderAccent: 'border-[#FF671F]/40',
  },
  {
    id: 'rajputana-forts',
    name: 'Rajputana Fortresses',
    period: '15th - 18th C. CE',
    dynasty: 'Kachwaha, Rathore & Sisodia',
    signatureSites: ['Amer Palace', 'Mehrangarh Fort', 'Chittorgarh Fort', 'Kumbhalgarh'],
    materials: 'Yellow Sandstone & Marble Sheesh Mahal',
    architecturalStyle: 'Contoured Ridge Bastions, Jharokha Balconies & Mirror Mosaics',
    iconColor: 'text-amber-800',
    bgGradient: 'from-amber-50 via-stone-50 to-orange-50/30',
    borderAccent: 'border-amber-300',
  },
  {
    id: 'colonial-saracenic',
    name: 'Indo-Saracenic & Deco',
    period: '1850 - 1947 CE',
    dynasty: 'British Indian Empire & Princely States',
    signatureSites: ['Gateway of India', 'Victoria Memorial', 'Chhatrapati Shivaji Maharaj Terminus'],
    materials: 'Yellow Basalt, Rajasthani Marble & Cast Iron',
    architecturalStyle: 'Gothic-Saracenic Synthesis & Grand Triumphal Arches',
    iconColor: 'text-slate-800',
    bgGradient: 'from-slate-50 to-blue-50/30',
    borderAccent: 'border-slate-200',
  },
];

interface HeritageDynastyTimelineProps {
  selectedEraId: string | null;
  onSelectEra: (eraId: string | null) => void;
}

export const HeritageDynastyTimeline: React.FC<HeritageDynastyTimelineProps> = ({
  selectedEraId,
  onSelectEra,
}) => {
  return (
    <div className="bg-white/75 backdrop-blur-md rounded-2xl border border-white/60 p-5 shadow-lg space-y-3.5">
      {/* Header with Title and Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50/90 text-[#FF671F] flex items-center justify-center border border-orange-200/80 backdrop-blur-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-tight">
              Architectural Eras & Civilizational Chronology
            </h3>
            <p className="text-[11px] text-stone-600 font-sans">
              Filter monuments by historical epoch, masonry materials, and dynasty architecture
            </p>
          </div>
        </div>

        {selectedEraId && (
          <button
            onClick={() => onSelectEra(null)}
            className="self-start sm:self-auto text-xs font-bold text-[#FF671F] hover:text-[#E65100] px-3 py-1 rounded-full bg-orange-50/90 hover:bg-orange-100 border border-orange-200 transition-colors cursor-pointer backdrop-blur-xs"
          >
            Show All Eras
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Timeline Cards */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-stone-300">
        {ARCHITECTURAL_ERAS.map((era) => {
          const isSelected = selectedEraId === era.id;
          return (
            <button
              key={era.id}
              onClick={() => onSelectEra(isSelected ? null : era.id)}
              className={`min-w-[240px] max-w-[260px] text-left rounded-xl p-3.5 border transition-all duration-200 flex flex-col justify-between cursor-pointer group shrink-0 backdrop-blur-xs ${
                isSelected
                  ? 'bg-gradient-to-br from-orange-50/90 via-white/95 to-amber-50/90 border-[#FF671F] ring-2 ring-[#FF671F]/20 shadow-md'
                  : 'bg-white/70 hover:bg-white/90 border-white/80 hover:border-stone-300 shadow-xs'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                    {era.period}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-[#FF671F] bg-orange-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-bold text-stone-900 text-sm group-hover:text-[#FF671F] transition-colors leading-snug">
                  {era.name}
                </h4>

                <p className="text-[11px] font-medium text-stone-600 line-clamp-1">
                  {era.dynasty}
                </p>

                <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">
                  {era.architecturalStyle}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-stone-100/90 flex items-center justify-between text-[10px] text-stone-500 font-sans">
                <span className="truncate max-w-[190px] text-[#046A38] font-semibold">
                  {era.signatureSites[0]}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#FF671F] group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
