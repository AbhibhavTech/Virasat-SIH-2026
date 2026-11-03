import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  Share2,
  Heart,
  Check,
  ExternalLink,
  ShieldCheck,
  Star,
  Clock,
  Compass,
  BedDouble,
  Navigation,
  Utensils,
  Car,
  Wifi,
  Waves,
  AirVent,
  Coffee,
  Tv,
  Phone,
  Info,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { getHotelDossierBySlug, HotelDossier, AmenityDetail } from '../utils/hotelDossierResolver';
import { updatePageSEO } from '../utils/seo';

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
};

interface HotelDetailPageProps {
  onNavigateTab?: (tab: any, city?: string) => void;
  onSelectPlace?: (placeId: string) => void;
}

export const HotelDetailPage: React.FC<HotelDetailPageProps> = ({
  onNavigateTab,
  onSelectPlace,
}) => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const isHi = currentLanguage === 'hi';
  const { isFavorite, toggleFavorite } = useFavorites();

  const [dossier, setDossier] = useState<HotelDossier | null>(null);
  const [activeTab, setActiveTab] = useState<'amenities' | 'tariffs' | 'monuments' | 'dining' | 'policies'>('amenities');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!hotelId) return;

    const data = getHotelDossierBySlug(hotelId);
    if (data) {
      setDossier(data);
      updatePageSEO({
        title: `${data.name}, ${data.cityName} • Verified Stay & Amenities | Virasat`,
        description: `Explore verified amenities, tariffs, proximity to monuments, and booking details for ${data.name} in ${data.cityName}, ${data.stateName}.`,
      });
    }
  }, [hotelId]);

  if (!dossier) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
          <BedDouble className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          {isHi ? 'आवास संचिका खोजी जा रही है...' : 'Hotel Dossier Not Found'}
        </h2>
        <p className="text-sm text-stone-600 max-w-md">
          {isHi
            ? 'क्षमा करें, अनुरोधित आवास की जानकारी उपलब्ध नहीं हो सकी। कृपया भारत दर्शन निर्देशिका में पुनः प्रयास करें।'
            : 'The requested stay record could not be loaded. Please browse available verified accommodations in Discover Bharat.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="px-5 py-2.5 rounded-xl bg-amber-800 text-white font-bold text-sm hover:bg-amber-900 transition"
        >
          {isHi ? 'भारत दर्शन पर लौटें' : 'Return to Discover Bharat'}
        </button>
      </div>
    );
  }

  const isFav = isFavorite(dossier.slug);
  const currentPhoto = selectedPhoto || dossier.coverImage;

  const handleShare = () => {
    const text = `${dossier.name} — ${dossier.category}\n${dossier.locality}, ${dossier.cityName}, ${dossier.stateName}\nNight Tariff: ${dossier.nightTariff}\nDay Transit Pass: ${dossier.dayTariff}\n${window.location.href}`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen pb-28 pt-2 sm:pt-4 max-w-7xl mx-auto space-y-6">
      {/* 1. Breadcrumbs & Top Navigation Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 sm:px-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 transition font-semibold cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'पीछे जाएं' : `Back to ${dossier.cityName}`}</span>
          </button>
          <span className="text-stone-300">/</span>
          <Link to="/explore" className="hover:text-amber-800 transition font-medium">
            Discover Bharat
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-900 font-semibold truncate max-w-[150px] sm:max-w-[200px]">
            {dossier.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />

          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition cursor-pointer shadow-2xs"
            title={isHi ? 'संचिका शेयर करें' : 'Share stay details'}
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(dossier.slug)}
            className={`p-2.5 rounded-xl border transition cursor-pointer shadow-2xs ${
              isFav
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-stone-200 bg-white text-stone-500 hover:text-stone-700'
            }`}
            title={isFav ? 'सहेजा गया' : 'पसंदीदा में जोड़ें'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Grand Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-950 shadow-xl">
        <div className="relative h-72 sm:h-96 md:h-[440px] w-full overflow-hidden">
          <img
            src={currentPhoto}
            alt={dossier.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/45 to-stone-950/20" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="pointer-events-auto px-3.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{dossier.cityName}, {dossier.stateName}</span>
              </span>
              <span className="pointer-events-auto px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md text-amber-200 text-xs font-semibold border border-amber-400/30">
                {dossier.propertyType}
              </span>
            </div>

            <span className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4" />
              <span>{isHi ? 'विरासत प्रमाणित' : 'Virasat Verified Stay'}</span>
            </span>
          </div>

          {/* Title and Locality */}
          <div className="absolute bottom-6 left-6 right-6 text-white z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-amber-300 font-bold uppercase tracking-wider">
              <span>{dossier.locality}</span>
              <span className="opacity-50">•</span>
              <span className="inline-flex items-center gap-1 text-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{dossier.rating} ({dossier.reviewsCount})</span>
              </span>
              <span className="opacity-50">•</span>
              <span className="text-white/80">{dossier.stars}-Star Quality Standard</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight drop-shadow-md text-white leading-tight">
              {dossier.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-200 max-w-2xl leading-relaxed">
              {dossier.category}
            </p>
          </div>
        </div>

        {/* Integrated Photo Gallery Strip */}
        {dossier.galleryImages && dossier.galleryImages.length > 0 && (
          <div className="bg-stone-900/90 px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto scrollbar-none border-t border-stone-800">
            <span className="text-xs font-semibold text-stone-400 shrink-0">
              {isHi ? 'चित्र वीथिका:' : 'Photo Views:'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedPhoto(dossier.coverImage)}
              className={`h-12 w-20 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                currentPhoto === dossier.coverImage ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-stone-700 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={dossier.coverImage} alt="Main view" className="w-full h-full object-cover" />
            </button>
            {dossier.galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPhoto(img)}
                className={`h-12 w-20 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                  currentPhoto === img ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-stone-700 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 3. Tariffs & Dual Stay Affairs Highlight Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Overnight Stay Affair */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-amber-700" />
              <span>{isHi ? 'रात्रि विश्राम प्रभार' : 'Night Stay Affair'}</span>
            </span>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
              {isHi ? 'नाश्ता शामिल' : 'Breakfast Included'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
              {dossier.nightTariff}
            </span>
          </div>

          <div className="text-xs text-stone-600 flex items-center gap-2 pt-1 border-t border-amber-200/60">
            <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>{dossier.nightStayTiming}</span>
          </div>
        </div>

        {/* Day-Use / Transit Pass */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-5 border border-emerald-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>{isHi ? 'दिन का ट्रांजिट पास' : 'Day Stay & Transit Pass'}</span>
            </span>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
              {isHi ? 'तीर्थयात्री व यात्री अनुकूल' : 'Pilgrim & Transit Friendly'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
              {dossier.dayTariff}
            </span>
          </div>

          <div className="text-xs text-stone-600 flex items-center gap-2 pt-1 border-t border-emerald-200/60">
            <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{dossier.dayStayTiming}</span>
          </div>
        </div>
      </section>

      {/* 4. Tab Navigation Strip */}
      <div className="border-b border-stone-200 flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none pt-2">
        <button
          type="button"
          onClick={() => setActiveTab('amenities')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'amenities'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isHi ? 'प्रमाणित सुविधाएं' : 'Verified Amenities'}</span>
          <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600">
            {dossier.amenities.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('monuments')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'monuments'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{isHi ? 'धरोहर निकटता' : 'Monuments Proximity'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dining')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'dining'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>{isHi ? 'स्थानीय खानपान' : 'Regional Dining'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'policies'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>{isHi ? 'नियम व नीतियां' : 'Rules & Darshan Support'}</span>
        </button>
      </div>

      {/* 5. Tab Content Sections */}
      <div className="space-y-6">
        {/* Tab 1: AMENITIES */}
        {activeTab === 'amenities' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span>{isHi ? 'होटल सुविधाएं व सेवाएं' : 'Verified Amenities & Guest Privileges'}</span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                {dossier.description}
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {dossier.highlights.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-950 font-medium">
                    <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span className="leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorized Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {dossier.amenities.map((amenity) => {
                const IconComponent = ICON_MAP[amenity.icon] || BedDouble;
                return (
                  <div
                    key={amenity.id}
                    className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-900 border border-amber-200 shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h4 className="text-sm font-bold text-stone-900 leading-tight">
                          {amenity.name}
                        </h4>
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                          {amenity.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {amenity.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: MONUMENTS PROXIMITY */}
        {activeTab === 'monuments' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-700" />
                <span>{isHi ? `${dossier.cityName} के प्रमुख स्मारकों से दूरी` : `Proximity to ${dossier.cityName}'s Sacred Geometry & Heritage`}</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Distances measured from {dossier.locality}. The front desk provides local autorickshaw fares and temple pass assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {dossier.nearbyHeritage.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 transition flex items-center justify-between"
                >
                  <div className="space-y-0.5 min-w-0 pr-3">
                    <div className="font-bold text-stone-900 text-sm truncate">{item.name}</div>
                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      <span>{item.category || 'Heritage Site'}</span>
                      {item.driveTime && (
                        <>
                          <span>•</span>
                          <span>{item.driveTime}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-xs text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      {item.distance}
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${dossier.name}, ${dossier.cityName}`)}&destination=${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 transition"
                      title="Directions"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: REGIONAL DINING */}
        {activeTab === 'dining' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-700" />
              <span>{isHi ? 'खानपान व पाककला अनुभव' : 'Regional Culinary Flavors & Kitchen Specialties'}</span>
            </h2>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-stone-800 leading-relaxed space-y-2">
              <div className="font-bold text-amber-950">
                {isHi ? `${dossier.cityName} की विशिष्ट स्वाद परंपरा` : `Authentic Local Dining Heritage in ${dossier.cityName}`}
              </div>
              <div>{dossier.diningNote}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900 text-xs">Authentic Regional Thalis</div>
                <div className="text-[11px] text-stone-600">Fresh local ingredients cooked with traditional homestyle recipes and tempered spices.</div>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900 text-xs">Sattvic & Pure Veg Options</div>
                <div className="text-[11px] text-stone-600">Strict no-onion, no-garlic options prepared in dedicated kitchens for pilgrimage devotees.</div>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900 text-xs">24/7 Room Service</div>
                <div className="text-[11px] text-stone-600">In-room hot beverage service, midnight comfort snacks, and early morning pilgrim tea.</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: POLICIES & GUIDELINES */}
        {activeTab === 'policies' && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-700" />
              <span>{isHi ? 'होटल नीतियां व तीर्थ सेवा' : 'Guest Policies & Pilgrimage Guidelines'}</span>
            </h2>

            <div className="space-y-2.5">
              {dossier.rulesAndPolicies.map((rule, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5 text-xs text-stone-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rule}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-stone-100 text-xs text-stone-600 space-y-1">
              <div><strong>Address:</strong> {dossier.address}</div>
              {dossier.phone && <div><strong>Reception Phone:</strong> {dossier.phone}</div>}
            </div>
          </div>
        )}
      </div>

      {/* 6. Sticky Bottom Action Bar for Instant Booking & Routing */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 hidden sm:block">
            <div className="text-xs text-stone-500 font-medium truncate">{dossier.name}</div>
            <div className="text-sm font-bold font-serif text-stone-900">{dossier.nightTariff}</div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <a
              href={dossier.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition border border-stone-300"
            >
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>{isHi ? 'नेविगेशन' : 'Directions'}</span>
            </a>

            <a
              href={dossier.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-md transition"
            >
              <span>{isHi ? 'बुकिंग जांचें' : 'Check Availability'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => {
                navigate(`/ai?prompt=${encodeURIComponent(`Give me a detailed staying guide for ${dossier.name} in ${dossier.cityName}, ${dossier.stateName}: room categories, best time to visit, and temple darshan support.`)}`);
              }}
              className="hidden md:inline-flex px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHi ? 'विरासत एआई से पूछें' : 'Ask Virasat AI'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
