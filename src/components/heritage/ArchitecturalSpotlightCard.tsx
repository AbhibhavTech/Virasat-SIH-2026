import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Compass,
  Box,
  Volume2,
  VolumeX,
  Clock,
  Sun,
  Camera,
  Layers,
  ShieldCheck,
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';
import { getRealMonumentImage } from '../../data/heritageRealImages';

export interface ArchitecturalSpotlightData {
  id: string;
  name: string;
  hindiName: string;
  city: string;
  state: string;
  dynasty: string;
  era: string;
  architect: string;
  elevation: string;
  heroImage: string;
  blueprintImage?: string;
  has3D: boolean;
  model3DType?: string;
  blueprintHighlights: {
    title: string;
    description: string;
  }[];
  materialsProvenance: {
    material: string;
    origin: string;
    usage: string;
  }[];
  lightingInsights: {
    time: string;
    phase: string;
    visualEffect: string;
  }[];
  audioTheme: {
    title: string;
    description: string;
    frequencyHz: number;
    type: 'chime' | 'drone' | 'breeze';
  };
}

export const SPOTLIGHT_MONUMENTS: ArchitecturalSpotlightData[] = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    hindiName: 'ताज महल',
    city: 'Agra',
    state: 'Uttar Pradesh',
    dynasty: 'Mughal Empire (Shah Jahan)',
    era: '1632 - 1653 CE',
    architect: 'Ustad Ahmad Lahori & Ismail Khan',
    elevation: '73 meters (Dome summit)',
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
    has3D: true,
    model3DType: 'taj-mahal',
    blueprintHighlights: [
      {
        title: 'Bilateral Mirror Symmetry',
        description: 'Every minaret, archway, and garden quadrant exhibits exact axial symmetry, with the sole asymmetry being Shah Jahan’s subsequent tomb placement alongside Mumtaz Mahal.',
      },
      {
        title: 'Seismic Yamuna Well Foundations',
        description: 'Built along the soft alluvial banks of the Yamuna River upon wooden caissons anchored inside deep masonry wells filled with rubble and mortar, dampening earthquakes.',
      },
      {
        title: 'Outward-Tilted Minarets',
        description: 'The four flanking 40-meter minarets were calculatedly engineered with a 2-degree outward tilt so that in a cataclysmic earthquake, they collapse away from the central tomb.',
      },
      {
        title: 'Double-Shell Marble Dome',
        description: 'Features an interior ceiling dome scaled to the human eye, enclosed within an exterior 35-meter high bulbous dome that delivers dramatic skyline presence.',
      },
    ],
    materialsProvenance: [
      {
        material: 'Pure Translucent White Marble',
        origin: 'Makrana Quarries, Rajasthan (carried by 1,000 elephants)',
        usage: 'Exterior cladding, plinth, and ornamental jali lattice screens.',
      },
      {
        material: 'Pietra Dura Semi-Precious Stones',
        origin: 'Lapis Lazuli (Badakhshan), Carnelian (Arabia), Jade (Khotan)',
        usage: 'Micro-chiseled floral botanical scrollwork inlaid into marble.',
      },
      {
        material: 'Deep Red Sandstone',
        origin: 'Fatehpur Sikri & Tantpur Quarries',
        usage: 'The monumental Darwaza-i-Rauza gatehouse and riverfront mosque.',
      },
    ],
    lightingInsights: [
      {
        time: '05:45 AM - 06:45 AM',
        phase: 'Dawn Mist (Subah-e-Benares glow)',
        visualEffect: 'Makrana marble absorbs morning wavelengths, glowing in soft blush pink and pale amber tones.',
      },
      {
        time: '12:00 PM - 02:00 PM',
        phase: 'Midday Solstice',
        visualEffect: 'Brilliant dazzling white with micro-crystal luminescence and razor-sharp shadow geometry in arches.',
      },
      {
        time: '05:30 PM - 06:30 PM',
        phase: 'Golden Hour Sunset',
        visualEffect: 'Warm rich golden ochre reflecting over the placid waters of the Yamuna River.',
      },
    ],
    audioTheme: {
      title: 'Echo Chambers of the Central Octagon',
      description: 'The vaulted inner chamber sustains a unique 28-second acoustic reverberation time.',
      frequencyHz: 216,
      type: 'chime',
    },
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    hindiName: 'कोणार्क सूर्य मंदिर',
    city: 'Konark',
    state: 'Odisha',
    dynasty: 'Eastern Ganga (Narasimhadeva I)',
    era: '1250 CE',
    architect: 'Bishu Maharana (Master Architect)',
    elevation: '68 meters (Original Vimana height)',
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f443a9e1?w=1200&auto=format&fit=crop&q=80',
    has3D: true,
    model3DType: 'konark-sun-temple',
    blueprintHighlights: [
      {
        title: 'Cosmic Chariot Alignment',
        description: 'Designed as a colossal celestial chariot with 24 carved stone wheels pulled by seven mythical horses, precisely aligned to catch dawn sun rays directly upon the sanctum.',
      },
      {
        title: 'Astronomical Sundial Wheels',
        description: 'Each 9.7-foot stone wheel operates as a functioning sundial. The 8 major spokes and 8 minor spokes divide the day into 3-hour praharas, calculating minutes via shadow width.',
      },
      {
        title: 'Iron Cramp Dry-Stone Masonry',
        description: 'Erected without cement or wet mortar. Massive khondalite blocks were slotted together with forged wrought-iron dowels and lead joints.',
      },
    ],
    materialsProvenance: [
      {
        material: 'Khondalite Stone',
        origin: 'Chandaka Forest Hills, Odisha',
        usage: 'Carved bas-reliefs, dancing apsaras, and the multi-tiered jagamohana.',
      },
      {
        material: 'Green Chlorite Stone',
        origin: 'Nilgiri Hills, Balasore',
        usage: 'Polished inner door lintels and magnificent deities of Surya.',
      },
    ],
    lightingInsights: [
      {
        time: '05:30 AM - 06:15 AM',
        phase: 'Equinox Sunrise',
        visualEffect: 'The first beam of sunlight strikes through the eastern Natamandira dancing hall onto the chariot wheels.',
      },
      {
        time: '04:30 PM - 05:45 PM',
        phase: 'Bay of Bengal Dusk',
        visualEffect: 'Khondalite stone weathers into rich chocolate-red tones against the coastal palm silhouette.',
      },
    ],
    audioTheme: {
      title: 'Cosmic Temple Bell Reverberation',
      description: 'Bronze bell harmonics tuned to cosmic solfeggio frequency.',
      frequencyHz: 432,
      type: 'chime',
    },
  },
];

interface ArchitecturalSpotlightCardProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const ArchitecturalSpotlightCard: React.FC<ArchitecturalSpotlightCardProps> = ({
  onSelectPlace,
  onNavigateTab,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'materials' | 'lighting' | 'acoustics'>('blueprint');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const current = SPOTLIGHT_MONUMENTS[activeIdx];

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      // Stop audio
      try {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
          oscillatorRef.current = null;
        }
      } catch {
        // Safe ignore
      }
      setIsPlayingAudio(false);
    } else {
      // Synthesize gentle ambient harmonic tone
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = audioContextRef.current || new AudioCtx();
        audioContextRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(current.audioTheme.frequencyHz, ctx.currentTime);

        // Gentle envelope: fade in softly, then oscillate slowly
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;

        setIsPlayingAudio(true);

        // Auto fade out after 8 seconds
        setTimeout(() => {
          try {
            if (gainNodeRef.current && ctx) {
              gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
              setTimeout(() => {
                try {
                  osc.stop();
                  osc.disconnect();
                } catch {}
                setIsPlayingAudio(false);
              }, 1600);
            }
          } catch {
            setIsPlayingAudio(false);
          }
        }, 8000);
      } catch (err) {
        console.warn('Web Audio synthesis error:', err);
        setIsPlayingAudio(false);
      }
    }
  };

  const activeHeroImage = getRealMonumentImage(current.id, current.name) || current.heroImage;

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl border border-white/60 overflow-hidden shadow-lg">
      {/* Top Banner Bar with Switcher */}
      <div className="bg-white/60 backdrop-blur-xs p-4 sm:p-5 border-b border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#FF671F] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#FF671F] uppercase tracking-wider bg-orange-100/70 px-2 py-0.5 rounded-full">
                Architectural Blueprint Spotlight
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-semibold text-stone-600">Archaeological Dissection</span>
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg sm:text-xl">
              Master Crafts of Ancient India
            </h3>
          </div>
        </div>

        {/* Monument Switcher Buttons */}
        <div className="flex items-center gap-2">
          {SPOTLIGHT_MONUMENTS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                if (isPlayingAudio) handleToggleAudio();
                setActiveIdx(idx);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : 'bg-white/80 backdrop-blur-xs text-stone-700 hover:bg-white border border-stone-200/80'
              }`}
            >
              {m.name}
            </button>
          ))}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 text-xs cursor-pointer ml-1"
            title={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? 'Minimize' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Hero Header for Active Monument */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Hero Image with Overlay Badges */}
            <div className="lg:col-span-5 relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-xs group">
              <img
                src={activeHeroImage}
                alt={current.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF671F] text-white shadow-xs">
                  UNESCO Masterpiece
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                  {current.elevation}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-xs font-semibold text-amber-300 mb-0.5">
                  {current.hindiName}
                </div>
                <h4 className="font-serif text-xl font-bold tracking-tight">
                  {current.name}
                </h4>
                <div className="text-xs text-stone-300 mt-1 flex items-center justify-between">
                  <span>{current.city}, {current.state}</span>
                  <span className="font-mono text-[11px] bg-white/20 px-2 py-0.5 rounded-md">
                    {current.era}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Architectural Dossier Overview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Dynasty / Reign</div>
                  <div className="text-xs font-bold text-stone-900 mt-0.5 truncate">{current.dynasty}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Chief Architect</div>
                  <div className="text-xs font-bold text-stone-900 mt-0.5 truncate">{current.architect}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-bold text-stone-500 uppercase">Summit Height</div>
                  <div className="text-xs font-bold text-[#046A38] mt-0.5 truncate">{current.elevation}</div>
                </div>
              </div>

              {/* Interactive Tabs */}
              <div className="flex items-center gap-1.5 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('blueprint')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'blueprint'
                      ? 'bg-orange-50 text-[#FF671F] font-bold border border-orange-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Engineering Blueprint</span>
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'materials'
                      ? 'bg-orange-50 text-[#FF671F] font-bold border border-orange-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Material Origins</span>
                </button>
                <button
                  onClick={() => setActiveTab('lighting')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'lighting'
                      ? 'bg-orange-50 text-[#FF671F] font-bold border border-orange-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Golden Hour & Light</span>
                </button>
                <button
                  onClick={() => setActiveTab('acoustics')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'acoustics'
                      ? 'bg-orange-50 text-[#FF671F] font-bold border border-orange-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Heritage Soundscape</span>
                </button>
              </div>

              {/* Tab 1: Engineering Blueprint */}
              {activeTab === 'blueprint' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {current.blueprintHighlights.map((item, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-3 rounded-xl bg-orange-50/40 border border-orange-200/70 space-y-1"
                    >
                      <h5 className="font-serif text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]" />
                        {item.title}
                      </h5>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Materials & Provenance */}
              {activeTab === 'materials' && (
                <div className="space-y-2.5 pt-1">
                  {current.materialsProvenance.map((mat, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-stone-900">{mat.material}</div>
                        <div className="text-[11px] text-[#046A38] font-medium">{mat.origin}</div>
                      </div>
                      <div className="text-[11px] text-stone-600 sm:text-right max-w-sm">
                        {mat.usage}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Lighting & Golden Hour */}
              {activeTab === 'lighting' && (
                <div className="space-y-2.5 pt-1">
                  {current.lightingInsights.map((light, lIdx) => (
                    <div
                      key={lIdx}
                      className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white text-amber-700 flex items-center justify-center shrink-0 shadow-2xs border border-amber-200">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{light.phase}</span>
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                            {light.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                          {light.visualEffect}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Heritage Soundscape */}
              {activeTab === 'acoustics' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-[#0B192C] text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-serif font-bold text-sm text-amber-300">
                        {current.audioTheme.title}
                      </h5>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        {current.audioTheme.description}
                      </p>
                    </div>
                    <button
                      onClick={handleToggleAudio}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md animate-pulse'
                          : 'bg-[#FF671F] hover:bg-[#E65100] text-white shadow-xs'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop Ambient Tone</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Play Harmonic Resonance ({current.audioTheme.frequencyHz} Hz)</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-[10px] text-stone-400 italic">
                    Synthesized real-time via Web Audio API replicating acoustic resonance.
                  </div>
                </div>
              )}

              {/* Call to Action Controls */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => onSelectPlace(current.id)}
                  className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Explore Verified Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {current.has3D && (
                  <button
                    onClick={() => onNavigateTab('3d')}
                    className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#000080] border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Launch 3D WebGL Model</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigateTab('itinerary')}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-stone-500" />
                  <span>Plan Visit Route</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
