import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Hotel,
  ShieldCheck,
  Star,
  MapPin,
  ExternalLink,
  Wifi,
  Waves,
  Utensils,
  Sparkles,
  Clock,
  Compass,
  IndianRupee,
  Share2,
  Check,
  Car,
  Coffee,
  Tv,
  AirVent,
  Navigation,
  ArrowRight,
  Phone,
  BedDouble,
  ChevronRight,
  Info,
} from 'lucide-react';
import { HotelDossier, AmenityDetail } from '../../utils/hotelDossierResolver';
import { useLanguage } from '../../contexts/LanguageContext';

interface HotelAmenitiesModalProps {
  dossier: HotelDossier | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAIChat?: (prompt: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Wifi,
  Waves,
  Utensils,
  Sparkles,
  AirVent,
  Compass,
  Car,
  Navigation,
  Clock,
  Coffee,
  ShieldCheck,
  Tv,
  BedDouble,
  Hotel,
};

export const HotelAmenitiesModal: React.FC<HotelAmenitiesModalProps> = ({
  dossier,
  isOpen,
  onClose,
  onOpenAIChat,
}) => {
  const { currentLanguage } = useLanguage();
  const isHi = currentLanguage === 'hi';
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !dossier) return null;

  const currentCover = selectedImage || dossier.coverImage;

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/hotel/${dossier.slug}`;
    const text = `${dossier.name} — ${dossier.category}\nLocation: ${dossier.locality}, ${dossier.cityName}, ${dossier.stateName}\nVerified Tariffs: ${dossier.nightTariff}\nExplore on Virasat: ${shareUrl}`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotel-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar with Close Button */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md transition cursor-pointer backdrop-blur-xs"
            title={isHi ? 'शेयर करें' : 'Share stay details'}
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-md transition cursor-pointer backdrop-blur-xs"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 divide-y divide-stone-100">
          {/* 1. Hero Showcase Image */}
          <div className="relative h-60 sm:h-72 md:h-80 w-full bg-stone-900 overflow-hidden">
            <img
              src={currentCover}
              alt={dossier.name}
              className="w-full h-full object-cover transition-all duration-500"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  '/images/maharashtra/taj-mahal-palace.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent" />

            {/* Badges on Top Left */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1 shadow-md border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHi ? 'विरासत सत्यापित आवास' : 'Virasat Verified Heritage Stay'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-amber-950 text-[11px] font-bold backdrop-blur-md flex items-center gap-1 shadow-md border border-amber-300">
                <Star className="w-3 h-3 fill-amber-950" />
                <span>{dossier.stars}-Star {dossier.tier.toUpperCase()}</span>
              </span>
            </div>

            {/* Bottom Title & Details */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{dossier.locality}, {dossier.cityName}, {dossier.stateName}</span>
              </div>
              <h2 id="hotel-modal-title" className="text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-tight drop-shadow-md text-white">
                {dossier.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 line-clamp-1">{dossier.category}</p>
            </div>
          </div>

          {/* Thumbnail Gallery Picker */}
          {dossier.galleryImages && dossier.galleryImages.length > 0 && (
            <div className="bg-stone-50 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-semibold text-stone-500 shrink-0 mr-1">
                {isHi ? 'चित्र पूर्वावलोकन:' : 'Photos:'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(dossier.coverImage)}
                className={`h-12 w-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                  currentCover === dossier.coverImage ? 'border-amber-600 ring-2 ring-amber-300' : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={dossier.coverImage} alt="Main cover" className="w-full h-full object-cover" />
              </button>
              {dossier.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`h-12 w-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                    currentCover === img ? 'border-amber-600 ring-2 ring-amber-300' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Gallery view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* 2. Tariffs & Affairs Dual Cards */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Overnight Stay Affair */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-amber-700" />
                    <span>{isHi ? 'रात्रि विश्राम प्रभार' : 'Night Stay Affair'}</span>
                  </span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                    {isHi ? 'अल्पाहार सहित' : 'Breakfast Included'}
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  {dossier.nightTariff}
                </div>
                <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{dossier.nightStayTiming}</span>
                </div>
              </div>

              {/* Day-Use / Transit Pass */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>{isHi ? 'दिन का ट्रांजिट पास' : 'Day Stay & Transit Pass'}</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                    {isHi ? '6-8 घंटे विश्राम' : '6–8 Hrs Refresh'}
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  {dossier.dayTariff}
                </div>
                <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{dossier.dayStayTiming}</span>
                </div>
              </div>
            </div>

            {/* Overview Narrative */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {isHi ? 'आवास का विवरण' : 'About the Property'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                {dossier.description}
              </p>
            </div>
          </div>

          {/* 3. Verified Amenities Master Grid */}
          <div className="p-4 sm:p-6 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isHi ? 'प्रमाणित सुविधाएं व सेवाएं' : 'Verified Amenities & Facilities'}</span>
              </h3>
              <span className="text-[11px] text-stone-500">
                {dossier.amenities.length} {isHi ? 'सुविधाएं सूचीबद्ध' : 'Amenities Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {dossier.amenities.map((amenity) => {
                const IconComponent = ICON_MAP[amenity.icon] || Hotel;
                return (
                  <div
                    key={amenity.id}
                    className="p-3 rounded-xl bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/80 transition flex items-start gap-2.5"
                  >
                    <div className="p-2 rounded-lg bg-amber-100/80 text-amber-900 border border-amber-200 shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-stone-900 leading-snug truncate">
                        {amenity.name}
                      </div>
                      <div className="text-[11px] text-stone-600 leading-relaxed line-clamp-2">
                        {amenity.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Proximity to Heritage Monuments */}
          {dossier.nearbyHeritage && dossier.nearbyHeritage.length > 0 && (
            <div className="p-4 sm:p-6 space-y-3 bg-stone-50/50">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-700" />
                <span>{isHi ? 'निकटवर्ती प्रमुख धरोहर व मंदिर' : 'Proximity to Heritage Monuments'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dossier.nearbyHeritage.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-semibold text-stone-800 truncate">{item.name}</span>
                    </div>
                    <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0 text-[11px]">
                      {item.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Policies & Address */}
          <div className="p-4 sm:p-6 space-y-2 text-xs text-stone-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <span><strong>Address:</strong> {dossier.address}</span>
            </div>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <span><strong>Check-in / Check-out:</strong> Standard Check-in {dossier.checkInTime} · Check-out {dossier.checkOutTime}. Early arrival luggage holding provided.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2.5">
          <Link
            to={`/hotel/${dossier.slug}`}
            className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <span>{isHi ? 'समग्र विवरण पृष्ठ खोलें' : 'Open Dedicated Page'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={dossier.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Maps</span>
            </a>

            <a
              href={dossier.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <span>{isHi ? 'बुकिंग जांचें' : 'Check Availability'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {onOpenAIChat && (
              <button
                type="button"
                onClick={() =>
                  onOpenAIChat(
                    `Tell me about room availability, best season, dining recommendations, and temple darshan support for ${dossier.name} in ${dossier.cityName}, ${dossier.stateName}.`
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHi ? 'एआई से पूछें' : 'Ask AI'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
