import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { HeritageDetail } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { UnescoBadge } from '../components/common/UnescoBadge';
import { getMonumentRealImage } from '../data/monumentRealImages';
import {
  Landmark,
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  ExternalLink,
  Heart,
  Clock,
  Ticket,
  Train,
  Plane,
  Car,
  Compass,
  Sparkles,
  BookOpen,
  Info,
  Camera,
  Share2,
  Check,
  ChevronRight,
  History,
  Building,
  Volume2,
  Image as ImageIcon,
} from 'lucide-react';

interface HeritageDetailPageProps {
  onNavigateTab?: (tab: any) => void;
  onSelectPlace?: (placeId: string) => void;
}

// ---------------------------------------------------------------------------
// Strict Content Validation Helpers (Hide null / empty / placeholder fields)
// ---------------------------------------------------------------------------
function isValidText(text?: string | null): boolean {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (lower === 'null' || lower === 'undefined' || lower === 'none' || lower === 'n/a') return false;
  // Outline draft placeholders (e.g. [400-700 words: ...], [5-10 verified facts...], [verify...])
  if (/^\[\d+-\d+\s+words/i.test(trimmed)) return false;
  if (/^\[\d+-\d+\s+verified\s+facts/i.test(trimmed)) return false;
  if (/^\[verify/i.test(trimmed)) return false;
  return true;
}

function isValidArray<T>(arr?: T[] | null): boolean {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return false;
  return arr.some((item) => {
    if (typeof item === 'string') return isValidText(item);
    if (typeof item === 'object' && item !== null) {
      return Object.values(item).some((v) =>
        typeof v === 'string' ? isValidText(v) : v !== null && v !== undefined
      );
    }
    return item !== null && item !== undefined;
  });
}

function formatCoordinates(lat?: number, lng?: number): string | null {
  if (lat === undefined || lng === undefined || lat === null || lng === null) return null;
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (isNaN(numLat) || isNaN(numLng)) return null;
  return `${numLat.toFixed(4)}° N, ${numLng.toFixed(4)}° E`;
}

export const HeritageDetailPage: React.FC<HeritageDetailPageProps> = ({
  onNavigateTab,
  onSelectPlace,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { currentLanguage, isRTL } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [heritage, setHeritage] = useState<HeritageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    const fetchHeritage = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getHeritageBySlug(slug, currentLanguage);
        if (!isMounted) return;
        if (res && res.data) {
          setHeritage(res.data);
        } else if (res && res.slug) {
          setHeritage(res);
        } else {
          setError('Heritage site not found.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to load heritage detail:', err);
        setError(err?.message || 'Failed to load heritage details.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHeritage();
    return () => {
      isMounted = false;
    };
  }, [slug, currentLanguage]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-8 w-40 bg-stone-200 rounded-xl" />
        <div className="h-[420px] bg-stone-200 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 w-3/4 bg-stone-200 rounded-lg" />
            <div className="h-28 bg-stone-200 rounded-2xl" />
            <div className="h-44 bg-stone-200 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-stone-200 rounded-2xl" />
            <div className="h-32 bg-stone-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !heritage) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
          <Landmark className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          {error || 'Heritage site not found'}
        </h2>
        <p className="text-stone-600 text-sm max-w-md mx-auto">
          We could not locate this monument in the catalog. Please return to the catalog to explore available heritage destinations.
        </p>
        <button
          type="button"
          onClick={() => navigate('/heritage')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF671F] to-[#E06D24] text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Heritage Catalog</span>
        </button>
      </div>
    );
  }

  const isFav = isFavorite(heritage.slug || String(heritage.id));
  const heroImage =
    isValidText(heritage.media?.hero?.url)
      ? heritage.media!.hero!.url!
      : getMonumentRealImage(heritage.slug || String(heritage.id));

  const coordinatesStr = formatCoordinates(heritage.lat, heritage.lng);

  // Field validation checks
  const showOverview = isValidText(heritage.overview);
  const showHistory = isValidText(heritage.history);
  const showArchitecture = isValidText(heritage.architecture);
  const showCultural = isValidText(heritage.cultural_significance);

  const validFeatures = (heritage.features || []).filter(
    (f) => isValidText(f.title) || isValidText(f.description)
  );
  const showFeatures = validFeatures.length > 0;

  const validTimeline = (heritage.timeline || []).filter(
    (t: any) => isValidText(t.event)
  );
  const showTimeline = validTimeline.length > 0;

  const validStops = (heritage.visitor_guide?.stops || []).filter(
    (s: any) => isValidText(s.title) || isValidText(s.description)
  );
  const hasDuration = isValidText(
    heritage.visitor_guide?.recommended_duration || heritage.recommended_duration
  );
  const showVisitorGuide = hasDuration || validStops.length > 0;

  // Practical info validation
  const practicalOpening =
    typeof heritage.practical?.opening_hours === 'string' && isValidText(heritage.practical.opening_hours)
      ? heritage.practical.opening_hours
      : typeof heritage.opening_hours === 'string' && isValidText(heritage.opening_hours)
      ? heritage.opening_hours
      : null;

  const practicalRules = (heritage.practical?.rules || heritage.visitor_rules || []).filter(isValidText);

  let practicalPrices: string | null = null;
  const rawPrices = heritage.practical?.ticket_prices || heritage.ticket_prices;
  if (typeof rawPrices === 'string' && isValidText(rawPrices)) {
    practicalPrices = rawPrices;
  } else if (rawPrices && typeof rawPrices === 'object') {
    const parts: string[] = [];
    if (rawPrices.indian !== undefined && rawPrices.indian !== null) {
      parts.push(`Indian Citizens: ₹${rawPrices.indian}`);
    }
    if (rawPrices.foreign !== undefined && rawPrices.foreign !== null) {
      parts.push(`Foreign Tourists: ₹${rawPrices.foreign}`);
    }
    if (rawPrices.saarc !== undefined && rawPrices.saarc !== null) {
      parts.push(`SAARC / BIMSTEC: ₹${rawPrices.saarc}`);
    }
    if (rawPrices.child_free_under) {
      parts.push(`Children under ${rawPrices.child_free_under} free`);
    }
    if (parts.length > 0) {
      practicalPrices = parts.join(' | ');
    } else if (isValidText(rawPrices.status) && !rawPrices.status.toLowerCase().includes('verify')) {
      practicalPrices = rawPrices.status;
    }
  }

  const practicalAccessibility =
    typeof heritage.practical?.accessibility === 'string' && isValidText(heritage.practical.accessibility)
      ? heritage.practical.accessibility
      : heritage.practical?.accessibility?.notes && isValidText(heritage.practical.accessibility.notes)
      ? heritage.practical.accessibility.notes
      : null;

  const showPractical = Boolean(
    practicalOpening || practicalPrices || practicalAccessibility || practicalRules.length > 0
  );

  const validTravel = (heritage.travel || []).filter(
    (t: any) => isValidText(t.mode) || isValidText(t.hub) || isValidText(t.hub_name)
  );
  const showTravel = validTravel.length > 0;

  const validNearby = (heritage.nearby || []).filter((n: any) => isValidText(n.name));
  const showNearby = validNearby.length > 0;

  const validFacts = (heritage.facts || [])
    .map((f: any) => (typeof f === 'string' ? f : f?.fact))
    .filter(isValidText);
  const showFacts = validFacts.length > 0;

  const galleryMedia = (heritage.media?.gallery || []).filter((item: any) => {
    if (typeof item === 'string') return isValidText(item);
    return item && isValidText(item.url);
  });
  const audioGuideMedia = (heritage.media?.audio_guide || []).filter((item: any) => {
    if (typeof item === 'string') return isValidText(item);
    return item && (isValidText(item.url) || isValidText(item.title));
  });
  const showMedia =
    galleryMedia.length > 0 ||
    audioGuideMedia.length > 0 ||
    isValidText(heritage.media?.hero?.credit) ||
    isValidText(heritage.media?.hero?.licence);

  const validSources = (heritage.sources || []).filter(
    (s: any) => isValidText(s.title) || isValidText(s.publisher) || isValidText(s.url)
  );
  const showSources = validSources.length > 0;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${heritage.name} | Virasat Heritage`,
          text: `Explore ${heritage.name} on Virasat AI`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // Ignored share rejection
    }
  };

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-fadeIn ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Top Navigation & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8DEC8]">
        <button
          type="button"
          onClick={() => navigate('/heritage')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>All Heritage Monuments</span>
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Drop-in Language Selector (Requirement 4) */}
          <LanguageSelector id="detail-lang-selector" />

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
            title="Share or Copy Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>

          {/* Favorite Button */}
          <button
            type="button"
            onClick={() => toggleFavorite(heritage.slug || String(heritage.id))}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer inline-flex items-center gap-1.5 ${
              isFav
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
            title={isFav ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isFav ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Hero Monument Banner */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-stone-900 shadow-[0_20px_60px_rgba(57,39,26,0.18)] border border-[#E8DEC8]">
        <div className="relative h-72 sm:h-96 md:h-[460px] w-full overflow-hidden">
          <img
            src={heroImage}
            alt={heritage.media?.hero?.alt || heritage.name}
            className="w-full h-full object-cover object-center"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = getMonumentRealImage(heritage.slug || String(heritage.id));
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Badges Overlay */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Requirement 3: UNESCO Badge only on inscribed / part_of_inscribed */}
              <UnescoBadge
                status={heritage.unesco_status}
                year={heritage.unesco_inscribed_year}
                siteName={heritage.unesco_site_name}
                size="md"
              />

              {heritage.asi_protected && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#046A38] text-white shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ASI Protected</span>
                </span>
              )}

              {isValidText(heritage.category) && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md capitalize">
                  {heritage.category}
                </span>
              )}
            </div>

            {heritage.list_no && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/50 text-white/90 backdrop-blur-md border border-white/20">
                Catalog #{heritage.list_no}
              </span>
            )}
          </div>

          {/* Bottom Title & Key Metadata Overlay */}
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight drop-shadow-md">
              {heritage.name}
            </h1>

            {isValidArray(heritage.alt_names) && (
              <p className="text-xs sm:text-sm text-stone-200 font-sans italic drop-shadow-xs">
                Also known as: {heritage.alt_names!.filter(isValidText).join(' • ')}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-200 pt-1 font-sans font-medium">
              {(isValidText(heritage.district_city) || isValidText(heritage.state_ut)) && (
                <div className="flex items-center gap-1.5 drop-shadow-xs">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {[heritage.district_city, heritage.state_ut].filter(isValidText).join(', ')}
                  </span>
                </div>
              )}

              {isValidText(heritage.era) && (
                <div className="flex items-center gap-1.5 drop-shadow-xs">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{heritage.era}</span>
                </div>
              )}

              {isValidText(heritage.builder) && (
                <div className="flex items-center gap-1.5 drop-shadow-xs">
                  <User className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Built by {heritage.builder}</span>
                </div>
              )}

              {coordinatesStr && (
                <div className="flex items-center gap-1.5 drop-shadow-xs hidden md:flex">
                  <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{coordinatesStr}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image Attribution Strip */}
        {isValidText(heritage.media?.hero?.credit) && (
          <div className="px-6 py-2 bg-stone-950/80 text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-800">
            <span>Photo credit: {heritage.media!.hero!.credit}</span>
            {isValidText(heritage.media?.hero?.licence) && (
              <span>License: {heritage.media!.hero!.licence}</span>
            )}
          </div>
        )}
      </section>

      {/* Main Content Sections Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Narrative Content & In-Depth Details */}
        <div className="lg:col-span-8 space-y-8 sm:space-y-10">
          {/* Overview */}
          {showOverview && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#FF671F]">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Overview
                </h2>
              </div>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
                {heritage.overview}
              </p>
            </section>
          )}

          {/* History */}
          {showHistory && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#046A38]">
                <History className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Historical Chronicle
                </h2>
              </div>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans whitespace-pre-line">
                {heritage.history}
              </p>
            </section>
          )}

          {/* Architecture */}
          {showArchitecture && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#000080]">
                <Building className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Architectural Grandeur
                </h2>
              </div>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans whitespace-pre-line">
                {heritage.architecture}
              </p>
            </section>
          )}

          {/* Cultural Significance */}
          {showCultural && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-amber-600">
                <BookOpen className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Cultural Significance
                </h2>
              </div>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans whitespace-pre-line">
                {heritage.cultural_significance}
              </p>
            </section>
          )}

          {/* Key Features */}
          {showFeatures && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#FF671F]">
                <Landmark className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Key Architectural & Cultural Features
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {validFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 hover:border-orange-300 transition-all space-y-1.5"
                  >
                    {isValidText(feat.title) && (
                      <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                        {feat.title}
                      </h3>
                    )}
                    {isValidText(feat.description) && (
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                        {feat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Historical Timeline */}
          {showTimeline && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 text-[#046A38]">
                <Clock className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Chronological Timeline
                </h2>
              </div>
              <div className="relative border-l-2 border-stone-200 ml-3 sm:ml-4 space-y-6">
                {validTimeline.map((item: any, idx) => {
                  const year = item.year || item.year_label;
                  return (
                    <div key={idx} className="relative pl-6 sm:pl-8">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-xs" />
                      <div className="space-y-1">
                        {isValidText(year) && (
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {year}
                          </span>
                        )}
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans font-medium">
                          {item.event}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Visitor Guide & Curated Stops */}
          {showVisitorGuide && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 text-[#000080]">
                  <Compass className="w-5 h-5" />
                  <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                    Visitor Guide & Curated Route
                  </h2>
                </div>
                {hasDuration && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-[#000080] font-bold text-xs border border-blue-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Duration: {heritage.visitor_guide?.recommended_duration || heritage.recommended_duration}</span>
                  </span>
                )}
              </div>

              {validStops.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Recommended Route Stops ({validStops.length})
                  </h4>
                  <div className="space-y-3">
                    {validStops.map((stop: any, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <h5 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                              {stop.title}
                            </h5>
                          </div>
                          {isValidText(stop.description) && (
                            <p className="text-xs sm:text-sm text-stone-600 font-sans pl-8">
                              {stop.description}
                            </p>
                          )}
                          {isValidText(stop.photo_tip) && (
                            <div className="flex items-center gap-1.5 text-xs text-amber-700 pl-8 pt-0.5">
                              <Camera className="w-3.5 h-3.5 shrink-0" />
                              <span>Photo tip: {stop.photo_tip}</span>
                            </div>
                          )}
                        </div>

                        {stop.minutes && Number(stop.minutes) > 0 && (
                          <span className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-700 text-xs font-mono font-semibold shrink-0">
                            ~{stop.minutes} mins
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Media Section: Gallery & Audio Guide */}
          {showMedia && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#FF671F]">
                <ImageIcon className="w-5 h-5" />
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Visuals & Media Archive
                </h2>
              </div>

              {galleryMedia.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryMedia.map((m: any, idx) => {
                    const url = typeof m === 'string' ? m : m.url;
                    const alt = typeof m === 'object' ? m.alt_text || m.caption || heritage.name : heritage.name;
                    return (
                      <div key={idx} className="h-36 sm:h-44 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                        <img src={url} alt={alt} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    );
                  })}
                </div>
              )}

              {audioGuideMedia.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Audio Guides & Narratives
                  </h4>
                  {audioGuideMedia.map((audio: any, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Volume2 className="w-4 h-4 text-[#FF671F]" />
                        <span className="text-xs sm:text-sm font-semibold text-stone-800">
                          {audio.title || `Audio Narrative #${idx + 1}`}
                        </span>
                      </div>
                      {isValidText(audio.url) && (
                        <a
                          href={audio.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#FF671F] hover:underline"
                        >
                          Play Guide
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Verified Sources & References */}
          {showSources && (
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-stone-700">
                <BookOpen className="w-5 h-5 text-stone-500" />
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Verified Records & Scholarly Sources
                </h2>
              </div>
              <ul className="space-y-2 pt-1">
                {validSources.map((source: any, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs sm:text-sm flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-stone-900">{source.title}</p>
                      {isValidText(source.publisher) && (
                        <p className="text-[11px] text-stone-500">Publisher: {source.publisher}</p>
                      )}
                    </div>
                    {isValidText(source.url) && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#FF671F] hover:underline shrink-0"
                      >
                        <span>View Source</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column: Practical Logistics, Travel, Nearby & Facts */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          {/* Practical Info Card */}
          {showPractical && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base sm:text-lg pb-2 border-b border-stone-200/80">
                <Info className="w-4 h-4 text-[#FF671F]" />
                <span>Visitor Information</span>
              </div>

              {practicalOpening && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Visiting Hours</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 font-medium font-sans">
                    {practicalOpening}
                  </p>
                </div>
              )}

              {practicalPrices && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Ticket Tariff</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 font-medium font-sans">
                    {practicalPrices}
                  </p>
                </div>
              )}

              {practicalAccessibility && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Accessibility</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-800 font-medium font-sans">
                    {practicalAccessibility}
                  </p>
                </div>
              )}

              {practicalRules.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    Visitor Rules
                  </span>
                  <ul className="space-y-1">
                    {practicalRules.map((rule, idx) => (
                      <li key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Travel & Transit Links */}
          {showTravel && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base sm:text-lg pb-2 border-b border-stone-200/80">
                <Compass className="w-4 h-4 text-[#046A38]" />
                <span>How to Reach</span>
              </div>
              <div className="space-y-3">
                {validTravel.map((item: any, idx) => {
                  const mode = (item.mode || '').toLowerCase();
                  const hub = item.hub || item.hub_name;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {mode.includes('rail') || mode.includes('train') ? (
                            <Train className="w-4 h-4 text-[#000080]" />
                          ) : mode.includes('air') || mode.includes('flight') ? (
                            <Plane className="w-4 h-4 text-sky-600" />
                          ) : (
                            <Car className="w-4 h-4 text-[#046A38]" />
                          )}
                          <span className="font-bold text-xs uppercase text-stone-800 font-sans">
                            {item.mode || 'Transit'}
                          </span>
                        </div>
                        {item.distance_km && (
                          <span className="text-xs font-mono font-semibold text-stone-500">
                            {item.distance_km} km
                          </span>
                        )}
                      </div>

                      {isValidText(hub) && (
                        <p className="text-xs sm:text-sm font-semibold text-stone-900 pl-6">
                          {hub}
                        </p>
                      )}
                      {isValidText(item.note) && (
                        <p className="text-xs text-stone-600 pl-6 font-sans">
                          {item.note}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nearby Sites */}
          {showNearby && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base sm:text-lg pb-2 border-b border-stone-200/80">
                <MapPin className="w-4 h-4 text-[#FF671F]" />
                <span>Nearby Attractions</span>
              </div>
              <div className="space-y-2.5">
                {validNearby.map((near: any, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between gap-2"
                  >
                    <div>
                      <h5 className="font-semibold text-xs sm:text-sm text-stone-900">
                        {near.name}
                      </h5>
                      {isValidText(near.note) && (
                        <p className="text-[11px] text-stone-500 line-clamp-1">{near.note}</p>
                      )}
                    </div>

                    {isValidText(near.related_slug) ? (
                      <Link
                        to={`/heritage/${near.related_slug}`}
                        className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-[#FF671F] font-bold text-xs flex items-center gap-1 shrink-0 transition"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : near.distance_km ? (
                      <span className="text-xs font-mono text-stone-500 shrink-0">
                        {near.distance_km} km
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curated Facts */}
          {showFacts && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8DEC8] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-base sm:text-lg pb-2 border-b border-stone-200/80">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Did You Know?</span>
              </div>
              <ul className="space-y-2">
                {validFacts.map((fact, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs sm:text-sm text-stone-800 leading-relaxed font-sans"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* UNESCO Verification & Authenticity Card */}
          <div className="bg-gradient-to-br from-[#FAF8F5] to-orange-50/50 p-5 sm:p-6 rounded-3xl border border-[#E8DEC8] space-y-3 text-xs text-stone-600">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-[#FF671F]" />
              <span>Authenticity & Status</span>
            </div>
            <div className="space-y-1.5 font-sans">
              <p>
                <strong>UNESCO Status:</strong>{' '}
                <span className="capitalize">{heritage.unesco_status.replace(/_/g, ' ')}</span>
              </p>
              {heritage.unesco_ref_id && (
                <p>
                  <strong>UNESCO Ref ID:</strong> #{heritage.unesco_ref_id}
                </p>
              )}
              {heritage.unesco_url && (
                <p>
                  <a
                    href={heritage.unesco_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF671F] font-bold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>View on UNESCO World Heritage Centre</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              )}
              {heritage.last_verified_on && (
                <p className="text-[11px] text-stone-500 pt-1">
                  Verified date: {heritage.last_verified_on}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
