import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Navigation,
  Clock,
  MapPin,
  Landmark,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Car,
  Train,
  Footprints,
  Plus,
  Trash2,
  ArrowRight,
  Info,
  BookOpen,
  RotateCcw,
  Check,
  Compass,
} from 'lucide-react';
import { HeritageRouteAnalysisResult, HeritageRouteStop, HeritageRouteSegment } from '../../types';
import { api } from '../../services/api';

export interface SelectedMonumentItem {
  id: string;
  name: string;
  city?: string;
  state?: string;
  lat: number;
  lng: number;
  summary?: string;
  category?: string;
}

interface HeritageRouteAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  availableMonuments: any[];
  selectedMonuments: SelectedMonumentItem[];
  onAddMonument: (monument: SelectedMonumentItem) => void;
  onRemoveMonument: (monumentId: string) => void;
  onReorderMonuments: (monuments: SelectedMonumentItem[]) => void;
  onClearMonuments: () => void;
  onApplyRouteToMap: (result: HeritageRouteAnalysisResult) => void;
  onHighlightSegmentOnMap?: (segmentIndex: number) => void;
  selectedCity?: string;
}

// Pre-curated iconic Indian heritage circuits for instant 1-click analysis
export const CURATED_HERITAGE_CIRCUITS: Array<{
  id: string;
  title: string;
  region: string;
  city: string;
  description: string;
  badge: string;
  monuments: Array<{ id: string; name: string; city: string; lat: number; lng: number; summary: string }>;
}> = [
  {
    id: 'delhi-imperial-trail',
    title: 'Delhi Imperial Dynasties Trail',
    region: 'North India',
    city: 'Delhi',
    badge: 'Mughal & Sultanate',
    description: 'Traverse 800 years of royal power from the Rajput Tomars and Delhi Sultanate to the Mughal zenith and British Raj.',
    monuments: [
      {
        id: 'qutub-minar',
        name: 'Qutub Minar Complex',
        city: 'Delhi',
        lat: 28.5245,
        lng: 77.1855,
        summary: '12th-century victory minaret of Mehrauli marking the establishment of the Delhi Sultanate.',
      },
      {
        id: 'humayuns-tomb',
        name: "Humayun's Tomb",
        city: 'Delhi',
        lat: 28.5933,
        lng: 77.2507,
        summary: 'First monumental Mughal garden tomb in India, the direct architectural precursor to the Taj Mahal.',
      },
      {
        id: 'india-gate',
        name: 'India Gate & Kartavya Path',
        city: 'Delhi',
        lat: 28.6129,
        lng: 77.2295,
        summary: 'Lutyens imperial civic axis commemorating Indian soldiers with British-Raj neoclassicism.',
      },
      {
        id: 'red-fort',
        name: 'Red Fort (Lal Qila)',
        city: 'Delhi',
        lat: 28.6562,
        lng: 77.241,
        summary: 'Shah Jahan citadel of Shahjahanabad, seat of Mughal sovereignty along the Yamuna.',
      },
    ],
  },
  {
    id: 'agra-fatehpur-sikri',
    title: 'Agra-Fatehpur Sikri Mughal Arc',
    region: 'Uttar Pradesh',
    city: 'Agra',
    badge: 'UNESCO Heritage',
    description: 'The monumental Mughal capital circuit spanning Akbar red sandstone triumph to Shah Jahan white marble poetry.',
    monuments: [
      {
        id: 'taj-mahal',
        name: 'Taj Mahal',
        city: 'Agra',
        lat: 27.1751,
        lng: 78.0421,
        summary: 'Universal masterpiece of white Makrana marble and pietra dura inlay on the Yamuna banks.',
      },
      {
        id: 'agra-fort',
        name: 'Agra Fort',
        city: 'Agra',
        lat: 27.1795,
        lng: 78.0211,
        summary: 'Massive red sandstone imperial fortress housing Diwan-i-Khas and Sheesh Mahal.',
      },
      {
        id: 'mehtab-bagh',
        name: 'Mehtab Bagh',
        city: 'Agra',
        lat: 27.1800,
        lng: 78.0422,
        summary: 'Moonlight pleasure garden perfectly aligned opposite the Taj Mahal across the Yamuna.',
      },
      {
        id: 'fatehpur-sikri',
        name: 'Fatehpur Sikri Citadel',
        city: 'Agra',
        lat: 27.0945,
        lng: 77.6679,
        summary: "Emperor Akbar utopian sandstone capital featuring Buland Darwaza and Salim Chishti tomb.",
      },
    ],
  },
  {
    id: 'jaipur-royal-circuit',
    title: 'Jaipur Royal Forts & Palaces Circuit',
    region: 'Rajasthan',
    city: 'Jaipur',
    badge: 'Rajput Splendor',
    description: 'Ascend from the hilltop defensive strongholds of the Aravallis down into Sawai Jai Singh planned Pink City.',
    monuments: [
      {
        id: 'amber-fort',
        name: 'Amber Palace & Fort',
        city: 'Jaipur',
        lat: 26.9855,
        lng: 75.8513,
        summary: 'Opulent hilltop fortress blending Hindu and Mughal styles with the mirror-laden Sheesh Mahal.',
      },
      {
        id: 'jaigarh-fort',
        name: 'Jaigarh Fort',
        city: 'Jaipur',
        lat: 26.985,
        lng: 75.8456,
        summary: 'Mighty artillery fort perched atop Cheel ka Teela housing the world largest wheeled cannon, Jaivana.',
      },
      {
        id: 'jal-mahal',
        name: 'Jal Mahal (Water Palace)',
        city: 'Jaipur',
        lat: 26.9534,
        lng: 75.8462,
        summary: 'Serene Rajput palace floating serenely in the center of Man Sagar Lake.',
      },
      {
        id: 'city-palace-jaipur',
        name: 'City Palace & Jantar Mantar',
        city: 'Jaipur',
        lat: 26.9258,
        lng: 75.8237,
        summary: 'Royal seat of the Kachwaha Maharajas and the world largest stone astronomical observatory.',
      },
      {
        id: 'hawa-mahal',
        name: 'Hawa Mahal (Palace of Winds)',
        city: 'Jaipur',
        lat: 26.9239,
        lng: 75.8267,
        summary: 'Iconic five-story pink sandstone facade with 953 jharokhas designed for royal court ladies.',
      },
    ],
  },
  {
    id: 'mumbai-colonial-heritage',
    title: 'Mumbai Colonial & Maritime Trail',
    region: 'Maharashtra',
    city: 'Mumbai',
    badge: 'Victorian Gothic & Rock-Cut',
    description: 'From 6th-century rock-cut Shiva caves across the Arabian Sea to the crowning monuments of the British maritime Empire.',
    monuments: [
      {
        id: 'csmt',
        name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
        city: 'Mumbai',
        lat: 18.94,
        lng: 72.8353,
        summary: 'UNESCO Victorian Gothic revival railway headquarters with Indo-Saracenic stone gargoyles.',
      },
      {
        id: 'gateway-of-india',
        name: 'Gateway of India & Apollo Bunder',
        city: 'Mumbai',
        lat: 18.922,
        lng: 72.8347,
        summary: 'Indo-Saracenic basalt ceremonial arch celebrating King George V visit and Indian independence.',
      },
      {
        id: 'elephanta-caves',
        name: 'Elephanta Island Rock-Cut Caves',
        city: 'Mumbai',
        lat: 18.9633,
        lng: 72.9315,
        summary: 'Sublime 6th-century basalt caverns featuring the colossal 20-foot Sadashiva Trimurti.',
      },
    ],
  },
  {
    id: 'varanasi-spiritual-buddhist',
    title: 'Varanasi Sacred Riverfront to Sarnath',
    region: 'Uttar Pradesh',
    city: 'Varanasi',
    badge: 'Living Antiquity',
    description: 'The ancient pilgrimage corridor connecting the timeless cosmic ghats of Shiva with Gautama Buddha first sermon.',
    monuments: [
      {
        id: 'dashashwamedh-ghat',
        name: 'Dashashwamedh Ghat',
        city: 'Varanasi',
        lat: 25.3076,
        lng: 83.0107,
        summary: 'The grandest riverfront ghat on the sacred Ganga, venue of the evening Maha Aarti.',
      },
      {
        id: 'kashi-vishwanath',
        name: 'Kashi Vishwanath Jyotirlinga Temple',
        city: 'Varanasi',
        lat: 25.3109,
        lng: 83.0107,
        summary: 'One of the twelve sacred Jyotirlingas, reconstructed by Ahilyabai Holkar of Indore.',
      },
      {
        id: 'manikarnika-ghat',
        name: 'Manikarnika Ghat',
        city: 'Varanasi',
        lat: 25.3114,
        lng: 83.0135,
        summary: 'The primary cremation ghat symbolizing liberation (Moksha) along the sacred river.',
      },
      {
        id: 'sarnath-dhamek-stupa',
        name: 'Dhamek Stupa & Deer Park (Sarnath)',
        city: 'Varanasi',
        lat: 25.3811,
        lng: 83.0214,
        summary: 'The cradle of Buddhism where Lord Buddha preached the first sermon (Dharmachakra Pravartana).',
      },
    ],
  },
  {
    id: 'hampi-vijayanagara-epic',
    title: 'Hampi Vijayanagara Empire Circuit',
    region: 'Karnataka',
    city: 'Hampi',
    badge: 'Medieval Empire',
    description: 'The boulder-strewn capital of the richest empire in 15th-century Asia along the Tungabhadra River.',
    monuments: [
      {
        id: 'virupaksha-temple',
        name: 'Virupaksha Temple',
        city: 'Hampi',
        lat: 15.3352,
        lng: 76.4597,
        summary: 'Oldest functioning sanctuary of Shiva in Hampi with towering 50-meter gopuram.',
      },
      {
        id: 'vittala-stone-chariot',
        name: 'Vijaya Vittala Temple & Stone Chariot',
        city: 'Hampi',
        lat: 15.3392,
        lng: 76.4746,
        summary: 'Pinnacle of Dravidian stone craftsmanship featuring musical pillars and the iconic Garuda stone chariot.',
      },
      {
        id: 'lotus-mahal',
        name: 'Lotus Mahal & Zenana Enclosure',
        city: 'Hampi',
        lat: 15.3211,
        lng: 76.4705,
        summary: 'Graceful Indo-Islamic pavilion designed for royal women with archways resembling opening lotus buds.',
      },
      {
        id: 'elephant-stables',
        name: 'Royal Elephant Stables',
        city: 'Hampi',
        lat: 15.3223,
        lng: 76.4735,
        summary: 'Grand 11-chamber domed structure showcasing the imperial cavalry might of Krishnadevaraya.',
      },
    ],
  },
];

export const HeritageRouteAnalyzer: React.FC<HeritageRouteAnalyzerProps> = ({
  isOpen,
  onClose,
  availableMonuments,
  selectedMonuments,
  onAddMonument,
  onRemoveMonument,
  onReorderMonuments,
  onClearMonuments,
  onApplyRouteToMap,
  onHighlightSegmentOnMap,
  selectedCity = 'Delhi',
}) => {
  const [transportMode, setTransportMode] = useState<'DRIVE' | 'TRANSIT' | 'WALK'>('DRIVE');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<HeritageRouteAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedSegmentIdx, setExpandedSegmentIdx] = useState<number | null>(0);
  const [searchMonumentQuery, setSearchMonumentQuery] = useState('');
  const [showMonumentPicker, setShowMonumentPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'plan' | 'results' | 'circuits'>('plan');

  // Filter available monuments for the picker
  const filteredAvailableMonuments = availableMonuments
    .filter((m) => {
      if (!m || !m.name) return false;
      const q = searchMonumentQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchCity = (m.city || m.city_id || '').toLowerCase().includes(q);
      const notAlreadySelected = !selectedMonuments.some((sm) => sm.id === m.id || sm.name.toLowerCase() === m.name.toLowerCase());
      return (matchName || matchCity) && notAlreadySelected;
    })
    .slice(0, 10);

  // Load a pre-curated circuit
  const handleLoadCuratedCircuit = (circuit: (typeof CURATED_HERITAGE_CIRCUITS)[0]) => {
    onClearMonuments();
    circuit.monuments.forEach((m) => {
      onAddMonument({
        id: m.id,
        name: m.name,
        city: m.city,
        lat: m.lat,
        lng: m.lng,
        summary: m.summary,
      });
    });
    setAnalysisResult(null);
    setErrorMessage(null);
    setActiveTab('plan');
  };

  // Reorder up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...selectedMonuments];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onReorderMonuments(next);
  };

  // Reorder down
  const handleMoveDown = (index: number) => {
    if (index === selectedMonuments.length - 1) return;
    const next = [...selectedMonuments];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onReorderMonuments(next);
  };

  // Run Route Analyzer via Gemini API
  const handleRunAnalysis = async () => {
    if (selectedMonuments.length < 2) {
      setErrorMessage('Please select at least 2 monuments to analyze a heritage route.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const payload = {
        monuments: selectedMonuments.map((m) => ({
          id: m.id,
          name: m.name,
          city: m.city || selectedCity,
          lat: m.lat,
          lng: m.lng,
          summary: m.summary || '',
        })),
        transport_mode: transportMode,
        city: selectedCity,
      };

      const result = await api.analyzeHeritageRoute(payload);

      if (result && result.ordered_stops && result.ordered_stops.length > 0) {
        setAnalysisResult(result);
        setActiveTab('results');
        setExpandedSegmentIdx(0);
        // Apply route segments & stops to the interactive map
        onApplyRouteToMap(result);
      } else {
        throw new Error('Analysis returned incomplete route data.');
      }
    } catch (err: any) {
      console.error('Heritage route analyzer error:', err);
      setErrorMessage(err.message || 'Failed to complete route analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate full multi-stop Google Maps directions link
  const getGoogleMapsFullCircuitUrl = () => {
    if (!analysisResult || !analysisResult.ordered_stops || analysisResult.ordered_stops.length < 2) {
      return '#';
    }
    const stops = analysisResult.ordered_stops;
    const origin = encodeURIComponent(`${stops[0].name}, ${stops[0].lat},${stops[0].lng}`);
    const destination = encodeURIComponent(
      `${stops[stops.length - 1].name}, ${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`
    );
    const waypoints = stops
      .slice(1, -1)
      .map((st) => encodeURIComponent(`${st.name}`))
      .join('|');

    const travelModeParam = transportMode === 'TRANSIT' ? 'transit' : transportMode === 'WALK' ? 'walking' : 'driving';

    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelModeParam}`;
    if (waypoints) {
      url += `&waypoints=${waypoints}`;
    }
    return url;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-[480] sm:inset-auto sm:top-4 sm:right-4 sm:w-[460px] md:w-[500px] bg-white/98 backdrop-blur-md rounded-t-3xl sm:rounded-3xl border border-stone-200/90 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[calc(100%-32px)] animate-fadeIn font-sans overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 text-white flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-base shrink-0 border border-white/30">
            🏛️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black tracking-tight text-white truncate">Heritage Route Analyzer</h3>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/25 text-[9px] font-extrabold uppercase tracking-wider text-amber-100">
                <Sparkles className="w-2.5 h-2.5" /> AI Engine
              </span>
            </div>
            <p className="text-[10px] text-amber-100 truncate">
              Optimized multi-monument transit & historical segment insights
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition"
          aria-label="Close Analyzer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-stone-100/90 p-1 border-b border-stone-200 text-xs font-bold text-stone-600 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'plan'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'hover:text-stone-900 text-stone-500'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>Route Stops ({selectedMonuments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('circuits')}
          className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'circuits'
              ? 'bg-white text-stone-900 shadow-2xs'
              : 'hover:text-stone-900 text-stone-500'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-purple-600" />
          <span>Iconic Circuits</span>
        </button>

        {analysisResult && (
          <button
            type="button"
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'results'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'hover:text-stone-900 text-emerald-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Analysis</span>
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="overflow-y-auto p-4 space-y-4 flex-1 text-xs text-stone-700">
        {/* TAB 1: ROUTE PLAN & MONUMENTS */}
        {activeTab === 'plan' && (
          <div className="space-y-3.5">
            {/* Mode selection banner */}
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">
                Preferred Transit Mode
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mode: 'DRIVE' as const, icon: Car, label: 'Taxi / Cab / Auto', tip: 'Fastest urban road transit' },
                  { mode: 'TRANSIT' as const, icon: Train, label: 'Metro / Rail', tip: 'Public transit & commuter lines' },
                  { mode: 'WALK' as const, icon: Footprints, label: 'Heritage Walk', tip: 'Pedestrian historical alleys' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = transportMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setTransportMode(item.mode)}
                      className={`p-2 rounded-2xl border text-left transition flex flex-col items-center sm:items-start text-center sm:text-left ${
                        isSel
                          ? 'bg-amber-50 text-amber-950 border-amber-400 shadow-2xs ring-1 ring-amber-300'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSel ? 'text-amber-600' : 'text-stone-400'}`} />
                      <div className="font-bold text-[11px]">{item.label}</div>
                      <div className="text-[9px] text-stone-400 hidden sm:block">{item.tip}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monuments list */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  Selected Monuments ({selectedMonuments.length})
                </span>
                {selectedMonuments.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearMonuments}
                    className="text-[10px] text-rose-600 hover:text-rose-700 font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>

              {selectedMonuments.length === 0 ? (
                <div className="p-4 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-2">
                  <Landmark className="w-6 h-6 text-stone-400 mx-auto" />
                  <p className="text-xs font-semibold text-stone-600">No monuments selected yet.</p>
                  <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                    Add monuments below, load an iconic circuit, or click any monument marker on the map to add it!
                  </p>
                  <div className="pt-1 flex flex-wrap justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLoadCuratedCircuit(CURATED_HERITAGE_CIRCUITS[0])}
                      className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[10px] transition"
                    >
                      Try Delhi Trail
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadCuratedCircuit(CURATED_HERITAGE_CIRCUITS[1])}
                      className="px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[10px] transition"
                    >
                      Try Agra Circuit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {selectedMonuments.map((m, idx) => (
                    <div
                      key={`stop-${m.id}-${idx}`}
                      className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-amber-300 transition"
                    >
                      <div className="w-6 h-6 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-stone-900 truncate">{m.name}</div>
                        <div className="text-[10px] text-stone-400 truncate">
                          {m.city || selectedCity || 'India'} {m.summary ? `• ${m.summary}` : ''}
                        </div>
                      </div>

                      {/* Reorder actions */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveUp(idx)}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                          title="Move earlier"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === selectedMonuments.length - 1}
                          onClick={() => handleMoveDown(idx)}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 transition"
                          title="Move later"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveMonument(m.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition ml-0.5"
                          title="Remove monument"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Monument Button & Search Picker */}
            <div className="space-y-2">
              {!showMonumentPicker ? (
                <button
                  type="button"
                  onClick={() => setShowMonumentPicker(true)}
                  className="w-full py-2 px-3 rounded-2xl border border-stone-200 hover:border-amber-400 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Add Monument from Database</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-stone-500">Search Monument</span>
                    <button
                      type="button"
                      onClick={() => setShowMonumentPicker(false)}
                      className="text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={searchMonumentQuery}
                    onChange={(e) => setSearchMonumentQuery(e.target.value)}
                    placeholder="Search monument name (e.g. Red Fort, Hawa Mahal)..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                  <div className="max-h-40 overflow-y-auto divide-y divide-stone-100 rounded-xl bg-white border border-stone-100">
                    {filteredAvailableMonuments.length === 0 ? (
                      <div className="p-2 text-center text-[11px] text-stone-400">No matching monuments found</div>
                    ) : (
                      filteredAvailableMonuments.map((cand) => (
                        <div
                          key={`cand-${cand.id}`}
                          onClick={() => {
                            onAddMonument({
                              id: cand.id,
                              name: cand.name,
                              city: cand.city || cand.city_id,
                              state: cand.state,
                              lat: cand.lat || (cand.coordinates && cand.coordinates[0]),
                              lng: cand.lng || (cand.coordinates && cand.coordinates[1]),
                              summary: cand.summary || cand.description,
                              category: cand.category,
                            });
                            setSearchMonumentQuery('');
                            setShowMonumentPicker(false);
                          }}
                          className="p-2 hover:bg-amber-50 transition cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-stone-800 truncate">{cand.name}</div>
                            <div className="text-[10px] text-stone-400 truncate">{cand.city || cand.state || 'India'}</div>
                          </div>
                          <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
                <Info className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || selectedMonuments.length < 2}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gemini API Analyzing Transit & Heritage Segments...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Heritage Route & Plot Segments</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CURATED CIRCUITS */}
        {activeTab === 'circuits' && (
          <div className="space-y-3">
            <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Iconic Pre-Curated Heritage Circuits
            </div>
            <div className="space-y-2.5">
              {CURATED_HERITAGE_CIRCUITS.map((cir) => (
                <div
                  key={cir.id}
                  className="p-3 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {cir.badge}
                      </span>
                      <h4 className="font-bold text-xs text-stone-900 mt-1">{cir.title}</h4>
                      <p className="text-[10px] text-stone-500 mt-0.5">{cir.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[10px] text-stone-600 font-medium">
                    {cir.monuments.map((m, i) => (
                      <React.Fragment key={m.id}>
                        <span className="shrink-0 bg-stone-100 px-2 py-0.5 rounded-lg truncate max-w-[120px]">
                          {m.name}
                        </span>
                        {i < cir.monuments.length - 1 && <span className="text-stone-300">➔</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-semibold">
                      {cir.monuments.length} Monuments • {cir.region}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLoadCuratedCircuit(cir)}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition shadow-2xs flex items-center gap-1"
                    >
                      <span>Load Circuit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ANALYSIS RESULTS & SEGMENTS */}
        {activeTab === 'results' && analysisResult && (
          <div className="space-y-4">
            {/* Title & Theme Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-600 text-white">
                  Gemini Optimized Route
                </span>
                <span className="text-[10px] font-bold text-amber-800">
                  {analysisResult.ordered_stops.length} Stops • {analysisResult.segments.length} Segments
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-stone-900 leading-tight">
                {analysisResult.circuit_title}
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {analysisResult.narrative_theme}
              </p>
            </div>

            {/* Overview Metrics Cards */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
                <div className="text-[9px] uppercase font-bold text-stone-400">Total Transit</div>
                <div className="text-sm font-black text-stone-900 mt-0.5">
                  {analysisResult.total_transit_minutes} min
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
                <div className="text-[9px] uppercase font-bold text-stone-400">Distance</div>
                <div className="text-sm font-black text-stone-900 mt-0.5">
                  {analysisResult.total_distance_km} km
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
                <div className="text-[9px] uppercase font-bold text-stone-400">Total Experience</div>
                <div className="text-sm font-black text-emerald-700 mt-0.5">
                  ~{analysisResult.total_recommended_hours} hrs
                </div>
              </div>
            </div>

            {/* Segment by Segment Breakdown */}
            <div className="space-y-3">
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center justify-between">
                <span>Segment Transit & Historical Significance</span>
                <span className="text-stone-400">Click segment to focus map</span>
              </div>

              {analysisResult.ordered_stops.map((stop, stopIdx) => {
                const isLast = stopIdx === analysisResult.ordered_stops.length - 1;
                const segment = !isLast ? analysisResult.segments[stopIdx] : null;

                return (
                  <div key={`stop-step-${stop.id}-${stopIdx}`} className="space-y-2">
                    {/* Monument Stop Node */}
                    <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-stone-50 border border-stone-200">
                      <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                        {stop.stop_order}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-stone-900 truncate">{stop.name}</div>
                        <div className="text-[10px] text-amber-800 font-medium truncate">
                          🏛️ {stop.historical_era} {stop.visit_duration_minutes ? `• ~${stop.visit_duration_minutes}m visit` : ''}
                        </div>
                      </div>
                    </div>

                    {/* Transit Segment to Next Monument */}
                    {segment && (
                      <div className="ml-3.5 pl-3 border-l-2 border-dashed border-amber-300 py-1">
                        <div
                          className={`p-3 rounded-2xl border transition cursor-pointer ${
                            expandedSegmentIdx === stopIdx
                              ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                              : 'bg-white border-stone-200 hover:border-amber-200'
                          }`}
                          onClick={() => {
                            setExpandedSegmentIdx(expandedSegmentIdx === stopIdx ? null : stopIdx);
                            if (onHighlightSegmentOnMap) {
                              onHighlightSegmentOnMap(stopIdx);
                            }
                          }}
                        >
                          {/* Segment Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                              <span className="text-amber-600">Segment {segment.segment_index}:</span>
                              <span className="truncate max-w-[140px]">{segment.from_name}</span>
                              <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{segment.to_name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-extrabold text-stone-800 bg-amber-100/70 px-2 py-0.5 rounded-full shrink-0">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>{segment.travel_time_minutes} min</span>
                              <span className="text-stone-300">•</span>
                              <span>{segment.distance_km} km</span>
                            </div>
                          </div>

                          {/* Historical Significance Story */}
                          <div className="mt-2 space-y-1.5">
                            <div className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>Historical Significance of this Segment</span>
                            </div>
                            <p className="text-xs text-stone-700 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-amber-100">
                              {segment.historical_significance}
                            </p>
                          </div>

                          {/* Expanded Architectural & Transit Details */}
                          {expandedSegmentIdx === stopIdx && (
                            <div className="mt-2.5 pt-2.5 border-t border-amber-200/60 space-y-2 text-[11px] text-stone-600">
                              {segment.architectural_transition && (
                                <div>
                                  <span className="font-bold text-stone-800">Architectural Transition: </span>
                                  <span>{segment.architectural_transition}</span>
                                </div>
                              )}

                              {segment.transit_tip && (
                                <div className="p-2 rounded-xl bg-sky-50 border border-sky-100 text-sky-800">
                                  <span className="font-bold">Transit Guidance: </span>
                                  <span>{segment.transit_tip}</span>
                                </div>
                              )}

                              {segment.notable_landmarks_en_route && segment.notable_landmarks_en_route.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="font-bold text-stone-700 text-[10px]">En-route landmarks:</span>
                                  {segment.notable_landmarks_en_route.map((lm, lIdx) => (
                                    <span
                                      key={lIdx}
                                      className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[9px] font-semibold"
                                    >
                                      {lm}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="pt-1 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onHighlightSegmentOnMap) {
                                      onHighlightSegmentOnMap(stopIdx);
                                    }
                                  }}
                                  className="py-1 px-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[10px] transition flex items-center gap-1"
                                >
                                  <Navigation className="w-3 h-3 text-amber-600" />
                                  <span>Focus on Map</span>
                                </button>

                                <a
                                  href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(segment.from_name)}&destination=${encodeURIComponent(segment.to_name)}&travelmode=${transportMode === 'TRANSIT' ? 'transit' : transportMode === 'WALK' ? 'walking' : 'driving'}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="py-1 px-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200 transition flex items-center gap-1"
                                >
                                  <span>Segment in Google Maps</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Expert Recommendation */}
            {analysisResult.expert_recommendation && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                <div className="font-extrabold flex items-center gap-1 text-[11px] uppercase tracking-wider text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Virasat Historian Advice</span>
                </div>
                <p className="leading-relaxed text-[11px]">{analysisResult.expert_recommendation}</p>
              </div>
            )}

            {/* External Navigation Link for entire circuit */}
            <div className="space-y-2 pt-1">
              <a
                href={getGoogleMapsFullCircuitUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate Entire Multi-Stop Route on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setActiveTab('plan')}
                className="w-full py-2 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition text-center"
              >
                Modify Monuments & Transit Options
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
