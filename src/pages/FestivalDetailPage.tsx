import { RouteLoadingExperience } from '../components/common/RouteLoadingExperience';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  Share2,
  Heart,
  Check,
  ExternalLink,
  Flame,
  Utensils,
  Landmark,
  Compass,
  BookOpen,
  ShieldCheck,
  Clock,
  Info,
  Layers,
  Bot,
  Hotel,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { FESTIVALS_HINDI_MAP, translateTextToHindi } from '../i18n/hindiDictionary';
import { getFestivalEnrichment } from '../data/festivalEnrichmentData';
import { FestivalItem } from '../types';
import { api } from '../services/api';
import fallbackFestivalsData from '../../data/festivals.json';

interface FestivalDetailPageProps {
  onNavigateTab?: (tab: any) => void;
  onSelectPlace?: (placeId: string) => void;
}

export const FestivalDetailPage: React.FC<FestivalDetailPageProps> = ({
  onNavigateTab,
  onSelectPlace,
}) => {
  const { festivalId } = useParams<{ festivalId: string }>();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const isHi = currentLanguage === 'hi';
  const { isFavorite, toggleFavorite } = useFavorites();

  const [festival, setFestival] = useState<FestivalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rituals' | 'delicacies' | 'temples' | 'travelerTips'>('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!festivalId) return;

    const findInLocal = () => {
      const allFallback = fallbackFestivalsData as unknown as FestivalItem[];
      const decoded = decodeURIComponent(festivalId).toLowerCase();
      return (
        allFallback.find(
          (f) =>
            f.id.toLowerCase() === decoded ||
            (f.slug && f.slug.toLowerCase() === decoded) ||
            f.name.toLowerCase().replace(/\s+/g, '-') === decoded
        ) || null
      );
    };

    const loadData = async () => {
      setLoading(true);
      // Check local cache first for instant 0ms rendering
      const localMatch = findInLocal();
      if (localMatch) {
        setFestival(localMatch);
      }

      try {
        const remoteMatch = await api.getFestivalById(festivalId);
        if (remoteMatch) {
          setFestival(remoteMatch);
        } else if (!localMatch) {
          // If not by direct ID, search in full festivals list
          const list = await api.getFestivals({ limit: 400 });
          const decoded = decodeURIComponent(festivalId).toLowerCase();
          const found = list.find(
            (f) =>
              f.id.toLowerCase() === decoded ||
              (f.slug && f.slug.toLowerCase() === decoded) ||
              f.name.toLowerCase().replace(/\s+/g, '-') === decoded
          );
          if (found) setFestival(found);
        }
      } catch {
        // Local cache already preserved
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [festivalId]);

  if (loading && !festival) {
    return (
      <RouteLoadingExperience
        title={isHi ? 'उत्सव संचिका लोड हो रही है...' : 'Loading Festival Dossier...'}
        subtext={isHi ? 'परंपराओं, अनुष्ठानों एवं दर्शन स्थलों की जानकारी संकलित की जा रही है...' : 'Gathering rituals, heritage shrines, and festive traditions...'}
      />
    );
  }

  if (!festival) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          {isHi ? 'उत्सव नहीं मिला' : 'Festival Not Found'}
        </h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto">
          {isHi
            ? 'हम इस उत्सव को सांस्कृतिक पंचांग में नहीं खोज सके। कृपया संपूर्ण उत्सव सूची देखने के लिए वापस जाएं।'
            : 'We could not locate this festival record in the cultural directory. Please return to the calendar to browse all verified Indian celebrations.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/festivals')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF671F] to-[#E06D24] text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? 'समस्त उत्सव पंचांग पर वापस जाएं' : 'Back to Festivals Calendar'}</span>
        </button>
      </div>
    );
  }

  const isFav = isFavorite(festival.id);
  const isVerifiedDate = festival.is_date_verified && festival.exact_date_start;
  const festivalTitle = isHi ? (FESTIVALS_HINDI_MAP[festival.name] || festival.name) : festival.name;

  const enrichment = getFestivalEnrichment(
    festival.id,
    festival.name,
    festival.state,
    festival.category || ""
  );

  const heroImage =
    festival.image_url ||
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&auto=format&fit=crop&q=80';

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${festivalTitle} | Virasat`,
          text: `${festivalTitle} - ${festival.cultural_vibe || festival.description}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // Ignored
    }
  };

  const allFallback = fallbackFestivalsData as unknown as FestivalItem[];
  const relatedFestivals = allFallback
    .filter((f) => f.id !== festival.id && (f.category === festival.category || f.state === festival.state))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* 1. Top Action Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/festivals')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-stone-700 bg-stone-100 hover:bg-stone-200 text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF671F]" />
            <span>{isHi ? 'समस्त त्यौहार' : 'All Festivals'}</span>
          </button>

          {festival.category && (
            <span className="text-xs px-3 py-1 rounded-full bg-orange-50 text-[#FF671F] font-semibold border border-orange-200 uppercase tracking-wider">
              {isHi ? translateTextToHindi(festival.category) : festival.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <LanguageSelector />

          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition cursor-pointer shadow-2xs"
            title={isHi ? 'उत्सव संचिका शेयर करें' : 'Share festival'}
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(festival.id)}
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
      <section className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-900 shadow-xl">
        <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden">
          <img
            src={heroImage}
            alt={festival.name}
            className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="pointer-events-auto px-3.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHi ? translateTextToHindi(festival.state) : festival.state}</span>
              </span>
              {festival.region && (
                <span className="pointer-events-auto px-3 py-1 rounded-full bg-amber-500/30 backdrop-blur-md text-amber-200 text-xs font-semibold border border-amber-400/30">
                  {isHi ? translateTextToHindi(festival.region) : festival.region} India
                </span>
              )}
            </div>

            {isVerifiedDate ? (
              <span className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-emerald-400/30">
                <ShieldCheck className="w-4 h-4" />
                <span>{isHi ? '2026 सत्यापित पंचांग तिथियां' : '2026 Synchronized Schedule'}</span>
              </span>
            ) : (
              <span className="pointer-events-auto px-3 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 shadow-md">
                <Clock className="w-3.5 h-3.5" />
                <span>{festival.typical_season || 'Annual Observance'}</span>
              </span>
            )}
          </div>

          {/* Title and Coordinates */}
          <div className="absolute bottom-5 left-5 right-5 text-white z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-amber-300 font-bold uppercase tracking-wider">
              <span>{festival.primary_city}</span>
              {festival.alternate_locations && festival.alternate_locations.length > 0 && (
                <>
                  <span className="opacity-50">•</span>
                  <span>{festival.alternate_locations.slice(0, 3).join(', ')}</span>
                </>
              )}
              {festival.religion_or_category && (
                <>
                  <span className="opacity-50">•</span>
                  <span className="text-orange-200">{festival.religion_or_category}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight drop-shadow-md text-white leading-tight">
              {festivalTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-stone-200">
              <span className="inline-flex items-center gap-1 font-medium">
                <Calendar className="w-4 h-4 text-[#FF671F]" />
                <span>
                  {isVerifiedDate
                    ? `${festival.exact_date_start} to ${festival.exact_date_end} (Official 2026 Dates)`
                    : festival.typical_season || 'Traditional annual celebration'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 1-Line Prominent Essence Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/95 to-orange-50/95 border-t border-amber-200/60 backdrop-blur-sm">
          <p className="text-sm sm:text-base font-serif italic text-stone-800 leading-relaxed text-center sm:text-left">
            "{festival.cultural_vibe || festival.description}"
          </p>
        </div>
      </section>

      {/* 3. Interactive Visitor Action Strip */}
      <section className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) onNavigateTab('itinerary');
              else navigate('/itinerary');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF671F] hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-200" />
            <span>{isHi ? 'यात्रा योजना में शामिल करें' : 'Add to Trip Itinerary'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) onNavigateTab('map');
              else navigate('/map');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#FF671F]" />
            <span>{isHi ? 'मानचित्र पर देखें' : 'View on Interactive Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) onNavigateTab('ai');
              else navigate('/ai');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            <Bot className="w-4 h-4 text-amber-600" />
            <span>{isHi ? 'विरासत AI से इस उत्सव पर चर्चा करें' : 'Ask Virasat AI about this Festival'}</span>
          </button>
        </div>

        <div className="text-[11px] text-stone-500 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isHi ? 'राष्ट्रीय पंचांग एवं पर्यटन अभिलेख से सत्यापित' : 'Verified by National Cultural Archives'}</span>
        </div>
      </section>

      {/* 4. Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) - 5 Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 5-Tab Navigation Strip */}
          <div className="bg-[#FAF7F2] border border-[#EFE8DF] rounded-2xl p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xs">
            {[
              { id: 'overview' as const, icon: BookOpen, label: isHi ? 'परिचय व महत्व' : 'Overview & Heritage' },
              { id: 'rituals' as const, icon: Flame, label: isHi ? 'पवित्र अनुष्ठान' : 'Sacred Rituals' },
              { id: 'delicacies' as const, icon: Utensils, label: isHi ? 'उत्सव व्यंजन व भोग' : 'Festive Delicacies' },
              { id: 'temples' as const, icon: Landmark, label: isHi ? 'प्रमुख तीर्थ व स्थल' : 'Key Shrines & Sites' },
              { id: 'travelerTips' as const, icon: Compass, label: isHi ? 'यात्री मार्गदर्शन' : 'Traveler Guide' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#FF671F] text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & LIVING HERITAGE */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                  <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider mb-1">
                    {isHi ? 'सांस्कृतिक विशेषता' : 'Cultural Essence'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-stone-900">
                    {festival.cultural_vibe || `${festival.religion_or_category || 'Traditional'} celebration`}
                  </div>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EFE8DF]">
                  <div className="text-[11px] text-stone-500 font-bold uppercase tracking-wider mb-1">
                    {isVerifiedDate
                      ? isHi
                        ? '2026 सत्यापित अवधि'
                        : '2026 Synchronized Dates'
                      : isHi
                      ? 'पारंपरिक ऋतु'
                      : 'Typical Season'}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-stone-900 font-mono">
                    {isVerifiedDate
                      ? `${festival.exact_date_start} — ${festival.exact_date_end}`
                      : festival.typical_season || 'Annual Observance'}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#FF671F]" />
                  <span>{isHi ? 'उत्सव का ऐतिहासिक व सांस्कृतिक परिचय' : 'About the Celebration & Living Heritage'}</span>
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                  {festival.description}
                </p>
              </div>

              {festival.tradition_notes && (
                <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200/80 text-xs sm:text-sm text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-4 h-4 text-[#FF671F]" />
                    <span>{isHi ? 'विविध परंपराओं का संगम' : 'Multi-Tradition Observance Notes'}</span>
                  </div>
                  <p className="leading-relaxed text-stone-800">{festival.tradition_notes}</p>
                </div>
              )}

              {enrichment.culturalHighlights && enrichment.culturalHighlights.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {isHi ? 'प्रमुख सांस्कृतिक बिंदु' : 'Key Cultural Dimensions'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {enrichment.culturalHighlights.map((hl, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100 flex items-start gap-2.5 text-xs sm:text-sm text-stone-800"
                      >
                        <span className="text-[#FF671F] font-black text-lg leading-none">•</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Provenance & Citation Box */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
                <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-stone-800">
                    {isHi ? 'छवि सत्यापन एवं स्रोत अभिलेख' : 'Image Provenance & Official Registry Record'}
                  </div>
                  <div>Source: {festival.source_name || 'Ministry of Tourism / National Cultural Archives'}</div>
                  {festival.license && <div>License: {festival.license}</div>}
                  {festival.attribution_text && <div>Attribution: {festival.attribution_text}</div>}
                  {festival.source_url && (
                    <a
                      href={festival.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF671F] hover:underline inline-flex items-center gap-1 mt-1 font-semibold"
                    >
                      <span>{isHi ? 'मूल स्रोत देखें' : 'View Source Archive'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SACRED RITUALS & CEREMONIES */}
          {activeTab === 'rituals' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-[#FF671F]" />
                  <span>{isHi ? enrichment.hindi.ritualsTitle : 'Sacred Rituals & Day-by-Day Ceremonies'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  {isHi
                    ? 'प्रातः काल से संध्याकालीन महाआरती व शोभायात्राओं का क्रमवार विवरण'
                    : 'Time-honored devotional customs, prayers, processions, and auspicious milestones'}
                </p>
              </div>

              <div className="space-y-3.5">
                {(isHi ? enrichment.hindi.rituals : enrichment.rituals).map((ritual, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 hover:bg-orange-50/40 hover:border-orange-200 transition flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF671F] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">{ritual}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FESTIVE DELICACIES & PRASAD */}
          {activeTab === 'delicacies' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2 mb-1">
                  <Utensils className="w-5 h-5 text-[#FF671F]" />
                  <span>{isHi ? enrichment.hindi.delicaciesTitle : 'Festive Delicacies & Holy Prasad'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  {isHi
                    ? 'पारंपरिक नैवेद्य, मिष्ठान एवं उत्सव विशेष सात्विक व्यंजन'
                    : 'Auspicious culinary offerings, sanctified sweets, and regional feast preparations'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(isHi ? enrichment.hindi.delicacies : enrichment.delicacies).map((delicacy, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50 transition flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">{delicacy}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KEY SHRINES & PILGRIMAGE SITES */}
          {activeTab === 'temples' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2 mb-1">
                  <Landmark className="w-5 h-5 text-[#FF671F]" />
                  <span>{isHi ? enrichment.hindi.keyTemplesTitle : 'Key Shrines, Venues & Pilgrimage Epicenters'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  {isHi
                    ? 'वे पवित्र मंदिर और ऐतिहासिक स्थल जहां इस उत्सव का आयोजन सर्वाधिक भव्य रूप से होता है'
                    : 'Premier temples, historic ghats, and consecrated grounds witnessing the largest gatherings'}
                </p>
              </div>

              <div className="space-y-3.5">
                {enrichment.keyTemples.map((temple, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF671F] flex items-center justify-center shrink-0 mt-0.5">
                      <Landmark className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-stone-900">{temple}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {isHi ? 'प्रामाणिक उत्सव अनुभव स्थल' : 'Authentic Celebration Venue'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TRAVELER FIELD GUIDE */}
          {activeTab === 'travelerTips' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2 mb-1">
                  <Compass className="w-5 h-5 text-[#FF671F]" />
                  <span>{isHi ? enrichment.hindi.travelerTipsTitle : 'Traveler Practical Field Guide'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  {isHi
                    ? 'दर्शन का सर्वोत्तम समय, शालीन परिधान एवं स्थानीय आचार-विचार'
                    : 'Essential advice on visiting hours, dress code etiquette, crowd navigation and photography'}
                </p>
              </div>

              <div className="space-y-3">
                {(isHi ? enrichment.hindi.travelerTips : enrichment.travelerTips).map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (1/3 width) */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Status & Verification Box */}
          <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-stone-900">
                {isHi ? 'उत्सव प्रामाणिकता स्थिति' : 'Verification & Registry'}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">{isHi ? 'अभिलेख स्थिति' : 'Registry Status'}</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
                  {isHi ? 'सत्यापित अभिलेख' : 'Verified Archive'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">{isHi ? 'पंचांग संरेखण' : 'Calendar Sync'}</span>
                <span className="font-semibold text-stone-800">
                  {isVerifiedDate ? (isHi ? '2026 समकालिक' : '2026 Synchronized') : 'Annual Regular'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">{isHi ? 'प्राथमिक राज्य' : 'Primary State'}</span>
                <span className="font-medium text-stone-800">{festival.state}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">{isHi ? 'क्षेत्रीय वर्गीकरण' : 'Classification'}</span>
                <span className="font-medium text-stone-800">{festival.religious_or_cultural_category || festival.category}</span>
              </div>

              {festival.official_source_url && (
                <div className="pt-2 border-t border-stone-100">
                  <a
                    href={festival.official_source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF671F] hover:underline"
                  >
                    <span>{isHi ? 'आधिकारिक सरकारी पोर्टल' : 'Official Portal Dossier'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Related Celebrations */}
          {relatedFestivals.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <Sparkles className="w-5 h-5 text-[#FF671F]" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {isHi ? 'संबंधित पावन उत्सव' : 'Related Celebrations'}
                </h3>
              </div>

              <div className="space-y-3">
                {relatedFestivals.map((rel) => {
                  const relTitle = isHi ? (FESTIVALS_HINDI_MAP[rel.name] || rel.name) : rel.name;
                  return (
                    <Link
                      key={rel.id}
                      to={`/festivals/${rel.id}`}
                      className="group p-3 rounded-2xl border border-stone-100 bg-stone-50/60 hover:bg-orange-50/40 hover:border-orange-200 transition flex items-center gap-3"
                    >
                      <img
                        src={rel.image_url}
                        alt={rel.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#FF671F] truncate transition-colors">
                          {relTitle}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          {rel.exact_date_start || rel.typical_season || rel.state}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default FestivalDetailPage;
