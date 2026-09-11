import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Image as ImageIcon,
  Play,
  Sparkles,
  MapPin,
  Clock,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Maximize2,
  Camera,
  Layers,
  ChevronRight,
  Sun,
  Flame,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  INCREDIBLE_VIDEOS,
  INCREDIBLE_PHOTOS,
  INCREDIBLE_REELS,
  IncredibleVideo,
  IncrediblePhoto,
  IncredibleReel
} from '../../data/incredibleIndiaMediaData';
import { IncredibleMediaModal } from '../media/IncredibleMediaModal';
import { ScrollReveal } from '../common/ScrollReveal';

interface IncredibleIndiaMediaSectionProps {
  onSelectPlace?: (placeId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

type TabType = 'films' | 'photos' | 'reels';

export const IncredibleIndiaMediaSection: React.FC<IncredibleIndiaMediaSectionProps> = ({
  onSelectPlace,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('films');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [modalVideo, setModalVideo] = useState<IncredibleVideo | null>(null);
  const [modalPhoto, setModalPhoto] = useState<IncrediblePhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Featured video selection
  const [featuredVideoIndex, setFeaturedVideoIndex] = useState(0);
  const featuredVideo = INCREDIBLE_VIDEOS[featuredVideoIndex] || INCREDIBLE_VIDEOS[0];

  // Ambient sound synthesis state (Web Audio API)
  const [isPlayingAmbience, setIsPlayingAmbience] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<Array<OscillatorNode | GainNode>>([]);

  const toggleAmbience = () => {
    if (isPlayingAmbience) {
      // Stop
      droneNodesRef.current.forEach((n) => {
        if ('stop' in n) (n as OscillatorNode).stop();
      });
      droneNodesRef.current = [];
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingAmbience(false);
    } else {
      // Start meditative Indian tanpura drone synthesis (Sa - Pa harmonic drone)
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
        masterGain.connect(ctx.destination);

        // Tanpura base pitch: C# (138.59 Hz), Pa (207.65 Hz), High Sa (277.18 Hz)
        const freqs = [138.59, 207.65, 277.18, 554.37];
        const nodes: Array<OscillatorNode | GainNode> = [masterGain];

        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime);

          // Subtle LFO for gentle acoustic pulsation
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.setValueAtTime(0.2 + i * 0.05, ctx.currentTime);
          lfoGain.gain.setValueAtTime(0.02, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(gain.gain);
          lfo.start();

          gain.gain.setValueAtTime(0.08 / (i + 1), ctx.currentTime);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();

          nodes.push(osc, gain, lfo, lfoGain);
        });

        droneNodesRef.current = nodes;
        setIsPlayingAmbience(true);
      } catch (e) {
        console.warn('AudioContext not supported or permission denied', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      droneNodesRef.current.forEach((n) => {
        if ('stop' in n) (n as OscillatorNode).stop();
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Filtered photos
  const filteredPhotos = INCREDIBLE_PHOTOS.filter((photo) => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const matchesRegion = selectedRegion === 'all' || photo.region === selectedRegion;
    return matchesCategory && matchesRegion;
  });

  const handleOpenVideo = (v: IncredibleVideo) => {
    setModalVideo(v);
    setModalPhoto(null);
    setIsModalOpen(true);
  };

  const handleOpenPhoto = (p: IncrediblePhoto) => {
    setModalPhoto(p);
    setModalVideo(null);
    setIsModalOpen(true);
  };

  return (
    <section id="incredible-media-section" className="space-y-6">
      {/* Media Inspection Modal */}
      <IncredibleMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialVideo={modalVideo}
        initialPhoto={modalPhoto}
        onSelectPlace={onSelectPlace}
      />

      {/* ========================================================================= */}
      {/* INCREDIBLE INDIA HEADER BANNER                                            */}
      {/* ========================================================================= */}
      <ScrollReveal animation="fade-up">
        <div className="rounded-3xl bg-[#171513] border border-stone-800 text-stone-100 p-6 sm:p-8 relative overflow-hidden shadow-xl">
          {/* Subtle warm background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF671F]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#046A38]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-700/80 text-xs font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-pulse" />
                <span className="text-[#FF671F] uppercase">Incredible India</span>
                <span className="text-stone-500">•</span>
                <span className="text-stone-300 font-serif">अतुल्य भारत</span>
                <span className="text-stone-500">•</span>
                <span className="text-[#22C55E]">Official Visual Journey</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Find What You Seek: Films & Visual Tapestry
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 font-normal leading-relaxed">
                Discover India's living heritage through curated cinematic documentaries, high-resolution photography, and vertical visual stories inspired by Incredible India.
              </p>
            </div>

            {/* Ambient Soundscape & Mode Controls */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                onClick={toggleAmbience}
                className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-2 border transition cursor-pointer shadow-xs ${
                  isPlayingAmbience
                    ? 'bg-[#FF671F] border-[#FF671F] text-white shadow-md shadow-[#FF671F]/25'
                    : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700 text-stone-300'
                }`}
                title="Synthesize authentic Tanpura harmonic drone ambient sound"
              >
                {isPlayingAmbience ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span>Ambience Playing</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Play Ambient Raga</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs (Films vs Photos vs Reels) */}
          <div className="relative z-10 flex items-center gap-2 pt-6 border-t border-stone-800/80 mt-6 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveTab('films')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
                activeTab === 'films'
                  ? 'bg-white text-stone-900 shadow-md'
                  : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#FF671F]" />
              <span>Cinematic Films</span>
              <span className="px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-900 text-[10px] font-bold">
                {INCREDIBLE_VIDEOS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-white text-stone-900 shadow-md'
                  : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#046A38]" />
              <span>Visual Tapestry (Photos)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-900 text-[10px] font-bold">
                {INCREDIBLE_PHOTOS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
                activeTab === 'reels'
                  ? 'bg-white text-stone-900 shadow-md'
                  : 'bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Short Visual Reels</span>
              <span className="px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-900 text-[10px] font-bold">
                {INCREDIBLE_REELS.length}
              </span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* ========================================================================= */}
      {/* TAB 1: CINEMATIC FILMS                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'films' && (
        <div className="space-y-6">
          {/* Featured Widescreen Cinema Showcase */}
          <ScrollReveal animation="fade-up">
            <div className="rounded-3xl bg-white border border-[#EFE8DF] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
              {/* Video Preview Container */}
              <div
                onClick={() => handleOpenVideo(featuredVideo)}
                className="lg:col-span-7 relative aspect-video sm:aspect-[16/10] bg-stone-900 cursor-pointer group overflow-hidden"
              >
                <img
                  src={featuredVideo.thumbnailUrl}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                {/* Floating Big Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF671F] group-hover:bg-[#E65100] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Play className="w-8 h-8 ml-1 fill-white" />
                  </div>
                </div>

                {/* Badges on Top */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#FF671F]" />
                    <span>{featuredVideo.duration}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#046A38] text-white text-xs font-bold">
                    Featured Film
                  </span>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
                    <span>{featuredVideo.city}, {featuredVideo.state}</span>
                  </div>
                  <span className="font-semibold text-stone-300">Click to watch full film</span>
                </div>
              </div>

              {/* Curatorial Details Side */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#FF671F]/15 text-[#FF671F] text-xs font-bold uppercase tracking-wider">
                      {featuredVideo.category}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      Incredible India Cinema
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                    {featuredVideo.title}
                  </h3>
                  <p className="font-serif text-xs sm:text-sm text-[#FF671F] font-medium">
                    {featuredVideo.titleHindi}
                  </p>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
                    {featuredVideo.synopsis}
                  </p>

                  {/* Highlights List */}
                  <div className="pt-2 space-y-1.5">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      Civilizational Elements
                    </div>
                    {featuredVideo.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#046A38] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenVideo(featuredVideo)}
                    className="px-5 py-2.5 rounded-full bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Full Video</span>
                  </button>

                  {featuredVideo.relatedPlaceId && (
                    <button
                      onClick={() => onSelectPlace && onSelectPlace(featuredVideo.relatedPlaceId!)}
                      className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-stone-600" />
                      <span>Explore Place</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Grid of Other Curated Films */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  More Curated Travel Films & Documentaries
                </h4>
                <p className="text-xs text-stone-500">
                  Select any film to view details or play fullscreen
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INCREDIBLE_VIDEOS.map((video, idx) => (
                <ScrollReveal key={video.id} animation="fade-up" delay={idx * 50}>
                  <div
                    onClick={() => {
                      setFeaturedVideoIndex(idx);
                      handleOpenVideo(video);
                    }}
                    className={`group cursor-pointer rounded-2xl bg-white border overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full ${
                      idx === featuredVideoIndex
                        ? 'border-[#FF671F] ring-2 ring-[#FF671F]/20'
                        : 'border-[#EFE8DF] hover:border-[#FF671F]/50'
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors" />

                      {/* Play Badge */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 group-hover:bg-[#FF671F] text-stone-900 group-hover:text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                          <Play className="w-4 h-4 ml-0.5 fill-current" />
                        </div>
                      </div>

                      {/* Duration Tag */}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[10px] font-bold">
                        {video.duration}
                      </span>

                      {/* Category Tag */}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#046A38] text-white text-[10px] font-bold capitalize">
                        {video.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                          <MapPin className="w-3 h-3 text-[#FF671F] shrink-0" />
                          <span className="truncate">{video.city}, {video.state}</span>
                        </div>

                        <h5 className="font-serif text-xs sm:text-sm font-bold text-stone-900 group-hover:text-[#FF671F] transition line-clamp-2 mt-0.5">
                          {video.title}
                        </h5>
                        <p className="text-[11px] text-[#FF671F] font-medium truncate">
                          {video.titleHindi}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100">
                        <span>Watch Video</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition text-[#FF671F]" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VISUAL TAPESTRY (HIGH-RES PHOTOGRAPHY)                             */}
      {/* ========================================================================= */}
      {activeTab === 'photos' && (
        <div className="space-y-5">
          {/* Category & Region Filter Bars */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-[#EFE8DF] p-3 sm:p-4 rounded-2xl shadow-2xs">
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <span className="text-xs font-bold text-stone-500 mr-1 hidden sm:inline">Theme:</span>
              {[
                { id: 'all', label: 'All Themes' },
                { id: 'heritage', label: 'Heritage Jewels' },
                { id: 'spiritual', label: 'Spiritual' },
                { id: 'royalty', label: 'Royal Palaces' },
                { id: 'nature', label: 'Wild Nature' },
                { id: 'culture', label: 'Living Culture' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-[#FF671F] text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Region Dropdown / Pill */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-800 bg-stone-50 cursor-pointer"
              >
                <option value="all">All India (Pan-India)</option>
                <option value="North">Northern Realm</option>
                <option value="South">Southern Heartland</option>
                <option value="East">Eastern Frontiers</option>
                <option value="West">Western Horizons</option>
              </select>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, idx) => (
              <ScrollReveal key={photo.id} animation="fade-up" delay={idx * 40}>
                <div
                  onClick={() => handleOpenPhoto(photo)}
                  className="group cursor-pointer rounded-2xl bg-white border border-[#EFE8DF] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#FF671F]/50 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                    {/* Category Pill */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#046A38]/90 backdrop-blur-xs text-white text-[10px] font-bold uppercase">
                      {photo.category}
                    </span>

                    {/* Expand icon on hover */}
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Bottom lighting condition hint */}
                    <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] flex items-center gap-1 font-medium truncate">
                      <Sun className="w-3 h-3 text-amber-300 shrink-0" />
                      <span className="truncate">{photo.bestLighting}</span>
                    </div>
                  </div>

                  {/* Caption & Location */}
                  <div className="p-3.5 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                      <MapPin className="w-3 h-3 text-[#FF671F] shrink-0" />
                      <span className="truncate">{photo.city}, {photo.state}</span>
                    </div>

                    <h5 className="font-serif text-sm font-bold text-stone-900 group-hover:text-[#FF671F] transition line-clamp-1">
                      {photo.title}
                    </h5>
                    <p className="text-xs text-[#FF671F] font-medium truncate">
                      {photo.titleHindi}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-100">
                      <span>View Photo Story</span>
                      <Camera className="w-3 h-3 text-[#046A38]" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="p-10 text-center bg-white rounded-3xl border border-[#EFE8DF] space-y-2">
              <p className="font-serif text-base font-bold text-stone-800">
                No photographs found for this filter combination.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedRegion('all');
                }}
                className="text-xs font-bold text-[#FF671F] hover:underline"
              >
                Reset photo filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VISUAL REELS (SHORT 9:16 VERTICAL STORIES)                         */}
      {/* ========================================================================= */}
      {activeTab === 'reels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h4 className="font-serif text-lg font-bold text-stone-900">
                Incredible India Visual Reels
              </h4>
              <p className="text-xs text-stone-500">
                Quick 30-second immersive vertical snapshots from across India
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INCREDIBLE_REELS.map((reel, idx) => (
              <ScrollReveal key={reel.id} animation="fade-up" delay={idx * 50}>
                <div
                  onClick={() => {
                    const matchedVideo = INCREDIBLE_VIDEOS.find((v) => v.youtubeId === reel.youtubeId) || INCREDIBLE_VIDEOS[0];
                    handleOpenVideo(matchedVideo);
                  }}
                  className="group cursor-pointer rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden shadow-md relative aspect-[9/14] flex flex-col justify-between p-4 text-white"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

                  {/* Top Bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF671F] text-[10px] font-bold">
                      {reel.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold">
                      {reel.duration}
                    </span>
                  </div>

                  {/* Center Play Icon */}
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#FF671F] text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-lg border border-white/30">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="relative z-10 space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-stone-300">
                      <MapPin className="w-3 h-3 text-[#FF671F]" />
                      <span>{reel.state}</span>
                      <span>•</span>
                      <span>{reel.viewsCount} views</span>
                    </div>

                    <h5 className="font-serif text-sm font-bold text-white leading-tight">
                      {reel.title}
                    </h5>
                    <p className="text-[11px] text-[#FF671F]">
                      {reel.titleHindi}
                    </p>
                    <p className="text-[11px] text-stone-300 line-clamp-1 italic">
                      "{reel.keyHighlight}"
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
