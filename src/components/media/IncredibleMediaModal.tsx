import React, { useEffect, useState } from 'react';
import {
  X,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  MapPin,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Compass,
  Bookmark,
  Share2,
  Camera,
  Sun,
  ShieldCheck,
  Film,
  Image as ImageIcon,
  ExternalLink,
  Info
} from 'lucide-react';
import { IncredibleVideo, IncrediblePhoto, INCREDIBLE_PHOTOS } from '../../data/incredibleIndiaMediaData';

interface IncredibleMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVideo?: IncredibleVideo | null;
  initialPhoto?: IncrediblePhoto | null;
  onSelectPlace?: (placeId: string) => void;
}

export const IncredibleMediaModal: React.FC<IncredibleMediaModalProps> = ({
  isOpen,
  onClose,
  initialVideo,
  initialPhoto,
  onSelectPlace,
}) => {
  const [activeVideo, setActiveVideo] = useState<IncredibleVideo | null>(initialVideo || null);
  const [activePhoto, setActivePhoto] = useState<IncrediblePhoto | null>(initialPhoto || null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setActiveVideo(initialVideo || null);
    setActivePhoto(initialPhoto || null);
    setIsZoomed(false);
  }, [initialVideo, initialPhoto]);

  // Keyboard navigation (Escape to close, arrows for photos)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (activePhoto && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const currentIdx = INCREDIBLE_PHOTOS.findIndex((p) => p.id === activePhoto.id);
        if (currentIdx !== -1) {
          if (e.key === 'ArrowRight') {
            const nextIdx = (currentIdx + 1) % INCREDIBLE_PHOTOS.length;
            setActivePhoto(INCREDIBLE_PHOTOS[nextIdx]);
          } else {
            const prevIdx = (currentIdx - 1 + INCREDIBLE_PHOTOS.length) % INCREDIBLE_PHOTOS.length;
            setActivePhoto(INCREDIBLE_PHOTOS[prevIdx]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activePhoto, onClose]);

  if (!isOpen) return null;

  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentIdx = INCREDIBLE_PHOTOS.findIndex((p) => p.id === activePhoto.id);
    const nextIdx = (currentIdx + 1) % INCREDIBLE_PHOTOS.length;
    setActivePhoto(INCREDIBLE_PHOTOS[nextIdx]);
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentIdx = INCREDIBLE_PHOTOS.findIndex((p) => p.id === activePhoto.id);
    const prevIdx = (currentIdx - 1 + INCREDIBLE_PHOTOS.length) % INCREDIBLE_PHOTOS.length;
    setActivePhoto(INCREDIBLE_PHOTOS[prevIdx]);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#141210] border border-stone-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-800 bg-[#1A1815]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF671F]/15 border border-[#FF671F]/30 text-[#FF671F] text-[11px] font-bold uppercase tracking-wider">
              {activeVideo ? (
                <>
                  <Film className="w-3.5 h-3.5" />
                  <span>Incredible India Film</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Visual Tapestry</span>
                </>
              )}
            </span>
            <div className="hidden sm:block text-xs text-stone-400 font-medium truncate max-w-xs md:max-w-md">
              {activeVideo ? activeVideo.title : activePhoto?.title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Copy share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
              aria-label="Close media viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          {/* ========================================================================= */}
          {/* VIDEO MODE                                                                */}
          {/* ========================================================================= */}
          {activeVideo && (
            <div className="p-4 sm:p-6 space-y-5">
              {/* Cinema Iframe Player */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-stone-800">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Information & Cultural Details */}
              <div className="space-y-4 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-[#046A38]/20 border border-[#046A38]/40 text-[#22C55E] text-xs font-semibold">
                        {activeVideo.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF671F]" />
                        <span>{activeVideo.city}, {activeVideo.state}</span>
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{activeVideo.duration}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {activeVideo.title}
                    </h2>
                    <p className="font-serif text-sm text-[#FF671F] mt-0.5">
                      {activeVideo.titleHindi}
                    </p>
                  </div>

                  {activeVideo.relatedPlaceId && (
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectPlace && activeVideo.relatedPlaceId) {
                          onSelectPlace(activeVideo.relatedPlaceId);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto shadow-md shadow-[#FF671F]/20"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Explore Destination</span>
                    </button>
                  )}
                </div>

                {/* Synopsis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#FF671F]" />
                      <span>Curatorial Synopsis</span>
                    </h3>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {activeVideo.synopsis}
                    </p>
                    <p className="text-xs text-stone-400 italic">
                      "{activeVideo.subtitle}"
                    </p>
                  </div>

                  {/* Highlights Card */}
                  <div className="bg-[#1A1815] border border-stone-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Visual Highlights</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-stone-300">
                      {activeVideo.highlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F] mt-1.5 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                      <span className="font-semibold text-stone-300">Audio Score: </span>
                      <span>{activeVideo.musicAmbience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PHOTO MODE                                                                */}
          {/* ========================================================================= */}
          {activePhoto && (
            <div className="p-4 sm:p-6 space-y-5">
              {/* Photo Display with Prev/Next Controls */}
              <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center min-h-[360px] max-h-[62vh] border border-stone-800 group">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className={`max-h-[62vh] w-auto max-w-full object-contain transition-transform duration-300 ${
                    isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Left/Right Floating Arrows */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition opacity-80 hover:opacity-100 border border-white/20"
                  aria-label="Previous photograph"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition opacity-80 hover:opacity-100 border border-white/20"
                  aria-label="Next photograph"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Zoom status indicator */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-stone-300 text-[11px] font-medium border border-white/10 backdrop-blur-sm pointer-events-none">
                  {isZoomed ? 'Click image to reset' : 'Click image to zoom'}
                </div>
              </div>

              {/* Photo Info, Field Notes & Story */}
              <div className="space-y-4 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-[#046A38]/20 border border-[#046A38]/40 text-[#22C55E] text-xs font-semibold">
                        {activePhoto.category.toUpperCase()} • {activePhoto.region.toUpperCase()}
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF671F]" />
                        <span>{activePhoto.city}, {activePhoto.state}</span>
                      </span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {activePhoto.title}
                    </h2>
                    <p className="font-serif text-sm text-[#FF671F] mt-0.5">
                      {activePhoto.titleHindi}
                    </p>
                  </div>

                  {activePhoto.relatedPlaceId && (
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectPlace && activePhoto.relatedPlaceId) {
                          onSelectPlace(activePhoto.relatedPlaceId);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto shadow-md shadow-[#FF671F]/20"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>View Destination Dossier</span>
                    </button>
                  )}
                </div>

                {/* Two-Column Story & Field Notes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#FF671F]" />
                      <span>Civilizational Heritage Context</span>
                    </h3>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {activePhoto.culturalContext}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {activePhoto.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Photography Tips Card */}
                  <div className="bg-[#1A1815] border border-stone-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Photographer’s Field Notes</span>
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex items-center gap-1 text-stone-400 font-semibold mb-0.5">
                          <Sun className="w-3 h-3 text-amber-400" />
                          <span>Optimal Lighting Window:</span>
                        </div>
                        <p className="text-stone-300 pl-4">{activePhoto.bestLighting}</p>
                      </div>

                      <div className="pt-2 border-t border-stone-800">
                        <span className="text-stone-400 font-semibold block mb-0.5">Composition Notes:</span>
                        <p className="text-stone-300 italic">{activePhoto.photographerNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
