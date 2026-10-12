import React, { useState } from 'react';
import { HeritageCategoryIllustration } from './HeritageCategoryIllustrations';
import { isSensitivePlace } from './HeritageImageViewer';
import { ShieldCheck, Camera } from 'lucide-react';

interface HeritagePlaceCardImageProps {
  placeId: string;
  placeName: string;
  category?: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  altText?: string | null;
  author?: string | null;
  license?: string | null;
  isVerified?: boolean;
  className?: string;
  aspectRatioClass?: string;
}

export const HeritagePlaceCardImage: React.FC<HeritagePlaceCardImageProps> = ({
  placeId,
  placeName,
  category = 'heritage',
  imageUrl,
  thumbnailUrl,
  altText,
  author,
  license,
  isVerified = false,
  className = '',
  aspectRatioClass = 'h-44 sm:h-48 w-full'
}) => {
  const [hasError, setHasError] = useState(false);
  const sensitive = isSensitivePlace(placeId, placeName);
  const targetSrc = thumbnailUrl || imageUrl;

  const handleImageError = () => {
    console.warn(`[ImagePipeline] PlaceCard broken image for place: ${placeId} (${placeName})`);
    setHasError(true);
  };

  if (hasError || !targetSrc || !isVerified) {
    return (
      <div className={`relative ${aspectRatioClass} overflow-hidden ${className}`}>
        <HeritageCategoryIllustration category={category} placeName={placeName} />
        {targetSrc && !isVerified && (
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-xs">
              Photo under review
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatioClass} overflow-hidden bg-stone-900 ${className} group`}>
      <img
        src={targetSrc}
        srcSet={
          thumbnailUrl && imageUrl && thumbnailUrl !== imageUrl
            ? `${thumbnailUrl} 400w, ${imageUrl} 800w`
            : undefined
        }
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={altText || `${placeName} heritage destination`}
        loading="lazy"
        onError={handleImageError}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
      />

      {/* Gradient shading */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

      {/* Top badges: Category & Verified Subject */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 text-terracotta border border-amber-500/30 backdrop-blur-md">
          {category}
        </span>

        {isVerified && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Verified
          </span>
        )}
      </div>

      {/* Sensitive place note overlay banner */}
      {sensitive && (
        <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-amber-500/40 text-[9px] text-amber-300 flex items-center gap-1 pointer-events-none">
          <Camera className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">Ask before photographing people/homes</span>
        </div>
      )}

      {/* Discrete bottom attribution bar */}
      {author && !sensitive && (
        <div className="absolute bottom-1 right-2 text-[9px] text-white/70 font-mono drop-shadow pointer-events-none truncate max-w-[80%]">
          Photo: {author} {license ? `(${license})` : ''}
        </div>
      )}
    </div>
  );
};
