import React, { useState, useEffect, useRef } from 'react';
import { PlaceImageItem, PlaceImageBundle } from '../../types';
import { HeritageCategoryIllustration } from './HeritageCategoryIllustrations';
import { 
  Camera, 
  ExternalLink, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2,
  ShieldCheck,
  EyeOff
} from 'lucide-react';

export const SENSITIVE_PLACE_IDS = [
  'mumbai-012',
  'mumbai-khotachiwadi',
  'mumbai-worli-koliwada',
  'mumbai-versova-koliwada',
  'mumbai-khar-danda-koliwada',
  'mumbai-pali-village',
  'mumbai-dadar-parsi-colony',
  'mumbai-sassoon-dock',
  'mumbai-aarey-forest'
];

export function isSensitivePlace(placeId?: string, placeName?: string): boolean {
  if (!placeId && !placeName) return false;
  const pId = (placeId || '').toLowerCase();
  const pName = (placeName || '').toLowerCase();

  return (
    SENSITIVE_PLACE_IDS.some(id => pId.includes(id)) ||
    pName.includes('khotachiwadi') ||
    pName.includes('koliwada') ||
    pName.includes('pali village') ||
    pName.includes('parsi colony') ||
    pName.includes('sassoon dock') ||
    pName.includes('aarey')
  );
}

interface HeritageImageViewerProps {
  placeId: string;
  placeName: string;
  category?: string;
  heroImage?: PlaceImageItem | null;
  galleryImages?: PlaceImageItem[];
  imageBundle?: PlaceImageBundle | null;
  aspectRatioClass?: string;
  className?: string;
  showGalleryThumbnails?: boolean;
}

export const HeritageImageViewer: React.FC<HeritageImageViewerProps> = ({
  placeId,
  placeName,
  category = 'heritage',
  heroImage,
  galleryImages = [],
  imageBundle,
  aspectRatioClass = 'aspect-[16/10]',
  className = '',
  showGalleryThumbnails = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Combine images into clean list: hero first, followed by up to 6 gallery images
  const allImages: PlaceImageItem[] = React.useMemo(() => {
    if (imageBundle) {
      const list: PlaceImageItem[] = [];
      if (imageBundle.hero_image) list.push(imageBundle.hero_image);
      (imageBundle.gallery_images || []).forEach(img => {
        if (!list.some(existing => existing.content_hash === img.content_hash)) {
          list.push(img);
        }
      });
      return list.slice(0, 7);
    }
    const list: PlaceImageItem[] = [];
    if (heroImage) list.push(heroImage);
    galleryImages.forEach(img => {
      if (!list.some(existing => existing.content_hash === img.content_hash)) {
        list.push(img);
      }
    });
    return list.slice(0, 7);
  }, [heroImage, galleryImages, imageBundle]);

  const activeHero = allImages[0] || null;
  const sensitive = isSensitivePlace(placeId, placeName);

  // Only VERIFIED images are publicly shown as place photos. Everything else shows illustration placeholder.
  const isHeroVerified = Boolean(activeHero && activeHero.match_status === 'VERIFIED' && (activeHero.image_url || activeHero.thumbnail_url));
  const shouldShowFallback = hasError || !isHeroVerified;
  const verifiedImages = React.useMemo(() => allImages.filter(img => img.match_status === 'VERIFIED'), [allImages]);

  const handleImageError = () => {
    console.warn(`[ImagePipeline] Broken image detected for place: ${placeId} (${placeName})`);
    setHasError(true);
  };

  // Keyboard navigation for lightbox (verified images only)
  useEffect(() => {
    if (lightboxIndex === null || verifiedImages.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % verifiedImages.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + verifiedImages.length) % verifiedImages.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, verifiedImages.length]);

  // Touch swipe support for mobile lightbox
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || lightboxIndex === null || verifiedImages.length === 0) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      // Swiped left -> next
      setLightboxIndex((lightboxIndex + 1) % verifiedImages.length);
    } else if (diff < -50) {
      // Swiped right -> prev
      setLightboxIndex((lightboxIndex - 1 + verifiedImages.length) % verifiedImages.length);
    }
    touchStartX.current = null;
  };

  return (
    <div className={`space-y-3 w-full ${className}`}>
      {/* Sensitive Place Notice if applicable */}
      {sensitive && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs shadow-xs">
          <Camera className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="font-medium">
            Cultural Courtesy: Please ask before photographing people or private homes.
          </span>
        </div>
      )}

      {/* Main Hero Image Container */}
      <div
        className={`relative ${aspectRatioClass} w-full overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 shadow-md group`}
      >
        {shouldShowFallback ? (
          <div className="relative w-full h-full">
            <HeritageCategoryIllustration category={category} placeName={placeName} />
            {activeHero && activeHero.match_status === 'NEEDS_REVIEW' && (
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Photo under review
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <img
              src={activeHero.image_url || activeHero.thumbnail_url || ''}
              srcSet={
                activeHero.thumbnail_url && activeHero.image_url && activeHero.thumbnail_url !== activeHero.image_url
                  ? `${activeHero.thumbnail_url} 400w, ${activeHero.image_url} 1200w`
                  : undefined
              }
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px"
              alt={activeHero.alt_text || `${placeName} heritage view`}
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
            />

            {/* Gradient shadow overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

            {/* Verification Status Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified Subject
              </span>
            </div>

            {/* Expand / Lightbox Button */}
            <button
              onClick={() => setLightboxIndex(0)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all hover:scale-105 border border-white/20 shadow-md"
              title="Open full gallery lightbox"
              aria-label="View full size image and gallery in lightbox"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Credit, License and Source Link Under Hero Image */}
      {!shouldShowFallback && activeHero && (
        <div className="flex items-center justify-between gap-2 px-1 text-[11px] text-stone-400 flex-wrap">
          <div className="flex items-center gap-1.5 truncate max-w-[85%]">
            <span className="text-stone-500">Photo:</span>
            <span className="font-medium text-stone-300 truncate">
              {activeHero.author || 'Open Heritage Contributor'}
            </span>
            <span className="text-stone-600">•</span>
            <span className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-mono">
              {activeHero.license || 'Permitted Open License'}
            </span>
          </div>

          {activeHero.source_page_url && (
            <a
              href={activeHero.source_page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-terracotta hover:text-amber-300 transition-colors shrink-0 font-medium"
              title="View source page on Wikimedia Commons / Official Authority"
            >
              <span>{activeHero.source_name || 'Source'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Gallery Strip (up to 6 verified thumbnails) */}
      {showGalleryThumbnails && verifiedImages.length > 1 && !shouldShowFallback && (
        <div className="pt-1">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Verified Photographic Dossier ({verifiedImages.length} images)</span>
            <span className="text-[10px] text-stone-500 font-normal">Click any photo to inspect</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {verifiedImages.map((img, idx) => (
              <button
                key={img.content_hash || idx}
                onClick={() => setLightboxIndex(idx)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all ${
                  lightboxIndex === idx
                    ? 'border-terracotta ring-2 ring-terracotta/40 scale-95'
                    : 'border-stone-800 hover:border-stone-600 hover:scale-105'
                } bg-stone-900 group`}
                aria-label={`View photo ${idx + 1}: ${img.caption || placeName}`}
              >
                <img
                  src={img.thumbnail_url || img.image_url || ''}
                  alt={img.alt_text || `${placeName} view ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                {idx === 0 && (
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[8px] font-bold text-amber-300">
                    HERO
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal with Mobile Touch Swipe & Keyboard Navigation */}
      {lightboxIndex !== null && verifiedImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-2 sm:p-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 hover:text-white border border-white/20 transition-all shadow-lg"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length)}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-white/20 transition-all shadow-lg hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLightboxIndex((lightboxIndex + 1) % allImages.length)}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-white/20 transition-all shadow-lg hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Center Content */}
          <div className="max-w-5xl w-full flex flex-col items-center max-h-[92vh] space-y-3">
            <div className="relative max-h-[72vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img
                src={verifiedImages[lightboxIndex].image_url || verifiedImages[lightboxIndex].thumbnail_url || ''}
                alt={verifiedImages[lightboxIndex].alt_text || placeName}
                className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Lightbox Caption, Credit, License and Controls */}
            <div className="w-full bg-stone-950/90 border border-stone-800 rounded-2xl p-4 text-xs space-y-2 text-stone-300">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-bold text-white text-sm font-serif">
                    {placeName} <span className="text-stone-500 font-sans text-xs">({lightboxIndex + 1} / {verifiedImages.length})</span>
                  </h4>
                  {verifiedImages[lightboxIndex].caption && (
                    <p className="text-stone-300 text-[11px] mt-0.5 max-w-xl">
                      {verifiedImages[lightboxIndex].caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-[10px] font-mono">
                    {verifiedImages[lightboxIndex].license || 'Open License'}
                  </span>
                  {verifiedImages[lightboxIndex].source_page_url && (
                    <a
                      href={verifiedImages[lightboxIndex].source_page_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-xl bg-terracotta hover:bg-amber-600 text-stone-950 font-bold inline-flex items-center gap-1 text-[11px] transition"
                    >
                      <span>Verify File Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-800/80">
                <span>
                  Photo Creator: <strong className="text-stone-400 font-medium">{verifiedImages[lightboxIndex].author || 'Open Documentation'}</strong>
                </span>
                {verifiedImages[lightboxIndex].width && verifiedImages[lightboxIndex].height && (
                  <span className="font-mono text-[10px]">
                    {verifiedImages[lightboxIndex].width} × {verifiedImages[lightboxIndex].height} px
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
