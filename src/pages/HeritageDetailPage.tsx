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
  ChevronDown,
  ChevronRight,
  History,
  Building,
  Volume2,
  Image as ImageIcon,
  CheckCircle2,
  Award,
  Lightbulb,
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
  // Suppress draft / outline placeholders
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

function getQuickFactIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('location') || l.includes('city') || l.includes('state')) return MapPin;
  if (l.includes('era') || l.includes('year') || l.includes('century') || l.includes('time')) return Calendar;
  if (l.includes('built') || l.includes('builder') || l.includes('patron')) return User;
  if (l.includes('unesco') || l.includes('status') || l.includes('protect')) return ShieldCheck;
  return Landmark;
}

function getSectionVisuals(key: string) {
  switch (key) {
    case 'history':
      return {
        icon: History,
        bgLight: 'bg-amber-50',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
        iconColor: 'text-[#FF671F]',
      };
    case 'beauty':
      return {
        icon: Sparkles,
        bgLight: 'bg-rose-50/70',
        badgeBg: 'bg-rose-100 text-rose-900 border-rose-200',
        iconColor: 'text-rose-600',
      };
    case 'architecture':
      return {
        icon: Building,
        bgLight: 'bg-sky-50/70',
        badgeBg: 'bg-sky-100 text-sky-900 border-sky-200',
        iconColor: 'text-sky-700',
      };
    case 'famous_for':
    default:
      return {
        icon: Award,
        bgLight: 'bg-emerald-50/70',
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        iconColor: 'text-emerald-700',
      };
  }
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
        <div className="h-8 w-48 bg-stone-200 rounded-xl" />
        <div className="h-[380px] bg-stone-200 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-stone-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-56 bg-stone-200 rounded-2xl" />
          <div className="h-56 bg-stone-200 rounded-2xl" />
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

  // 1-line overview (tagline or fallback overview)
  const oneLineOverview =
    isValidText(heritage.tagline)
      ? heritage.tagline
      : isValidText(heritage.overview)
      ? heritage.overview
      : null;

  // Quick facts
  const validQuickFacts = (heritage.quick_facts || []).filter(
    (q) => isValidText(q.label) && isValidText(q.value)
  );
  const showQuickFacts = validQuickFacts.length > 0;

  // Sections (history, beauty, architecture, famous_for)
  let displaySections: Array<{ key: string; title: string; text: string }> = [];
  if (Array.isArray(heritage.sections) && heritage.sections.length > 0) {
    displaySections = heritage.sections.filter(
      (s) => isValidText(s.text) && isValidText(s.title)
    );
  } else {
    // Fallback to individual fields if sections array is empty
    if (isValidText(heritage.history)) {
      displaySections.push({ key: 'history', title: 'Origins & History', text: heritage.history! });
    }
    if (isValidText(heritage.architecture)) {
      displaySections.push({ key: 'architecture', title: 'Architecture & Highlights', text: heritage.architecture! });
    }
    if (isValidText(heritage.cultural_significance)) {
      displaySections.push({ key: 'famous_for', title: 'Cultural Significance', text: heritage.cultural_significance! });
    }
  }
  const showInfoCards = displaySections.length > 0;

  // Visitor tips
  const validVisitorTips = (heritage.visitor_tips || []).filter(isValidText);
  const showVisitorTips = validVisitorTips.length > 0;

  // Features
  const validFeatures = (heritage.features || []).filter(
    (f) => isValidText(f.title) || isValidText(f.description)
  );
  const showFeatures = validFeatures.length > 0;

  // Timeline
  const validTimeline = (heritage.timeline || []).filter((t: any) => isValidText(t.event));
  const showTimeline = validTimeline.length > 0;

  // Nearby
  const validNearby = (heritage.nearby || []).filter((n: any) => isValidText(n.name));
  const showNearby = validNearby.length > 0;

  // Practical info
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
    if (rawPrices.indian !== undefined && rawPrices.indian !== null) parts.push(`Indian: ₹${rawPrices.indian}`);
    if (rawPrices.foreign !== undefined && rawPrices.foreign !== null) parts.push(`Foreign: ₹${rawPrices.foreign}`);
    if (rawPrices.saarc !== undefined && rawPrices.saarc !== null) parts.push(`SAARC: ₹${rawPrices.saarc}`);
    if (rawPrices.child_free_under) parts.push(`Under ${rawPrices.child_free_under} free`);
    if (parts.length > 0) practicalPrices = parts.join(' • ');
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

  const validSources = (heritage.sources || []).filter(
    (s: any) => isValidText(s.title) || isValidText(s.publisher) || isValidText(s.url)
  );
  const showSources = validSources.length > 0;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${heritage.name} | Virasat Heritage`,
          text: `${heritage.name}: ${oneLineOverview || 'Explore on Virasat AI'}`,
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
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-fadeIn ${
        isRTL ? 'text-right' : 'text-left'
      }`}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Top Action & Navigation Bar                                         */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/heritage')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-stone-700 bg-stone-100 hover:bg-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Heritage Catalog</span>
          </button>
          {isValidText(heritage.category) && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-[#FF671F] font-semibold border border-orange-200 uppercase tracking-wider">
              {heritage.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language Selector Pill */}
          <LanguageSelector />

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition cursor-pointer shadow-xs"
            title="Share heritage page"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Favorites Button */}
          <button
            type="button"
            onClick={() => toggleFavorite(heritage.slug || String(heritage.id))}
            className={`p-2 rounded-xl border transition cursor-pointer shadow-xs ${
              isFav
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-stone-200 bg-white text-stone-500 hover:text-stone-700'
            }`}
            title={isFav ? 'Saved to Favorites' : 'Add to Favorites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 1. Upar: Hero + Name + UNESCO Badge + Overview (1 line)             */}
      {/* ------------------------------------------------------------------- */}
      <section className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-900 shadow-xl">
        {/* Hero Background Image */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <img
            src={heroImage}
            alt={heritage.name}
            className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
            loading="eager"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getMonumentRealImage(heritage.slug || 'taj-mahal');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
            <UnescoBadge
              status={heritage.unesco_status}
              inscribedYear={heritage.unesco_inscribed_year}
              siteName={heritage.unesco_site_name}
              className="pointer-events-auto shadow-md"
            />
            {isValidText(heritage.era) && (
              <span className="pointer-events-auto text-[11px] font-semibold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-200 border border-amber-500/30 shadow-xs">
                {heritage.era}
              </span>
            )}
          </div>

          {/* Title & Location Banner */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-2 z-10">
            <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight drop-shadow-md">
              {heritage.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-200">
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#FF671F]" />
                <span>
                  {heritage.district_city}, {heritage.state_ut}
                </span>
              </span>
              {isValidText(heritage.builder) && (
                <>
                  <span className="opacity-40">•</span>
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-amber-300" />
                    <span>{heritage.builder}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 1-Line Overview (Clean, prominent, no long wall of text) */}
        {oneLineOverview && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/95 to-orange-50/95 border-t border-amber-200/60 backdrop-blur-sm">
            <p className="text-sm sm:text-base font-serif italic text-stone-800 leading-relaxed text-center sm:text-left">
              "{oneLineOverview}"
            </p>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Quick Facts Strip (5 items chhote chips/cards me, ek row me)     */}
      {/* ------------------------------------------------------------------- */}
      {showQuickFacts && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {validQuickFacts.map((fact, idx) => {
              const IconComponent = getQuickFactIcon(fact.label);
              return (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-2xl p-3 sm:p-3.5 shadow-xs hover:border-amber-300 hover:bg-amber-50/30 transition flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF671F] flex items-center justify-center shrink-0">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider truncate">
                      {fact.label}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 truncate" title={fact.value}>
                      {fact.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Main Grid: Left (Cards, Tips, Features, Timeline) + Right Sidebar   */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* ----------------------------------------------------------------- */}
          {/* 3. 4 Info Cards (Desktop 2x2, Mobile 1 col; max 4 lines + expand) */}
          {/* ----------------------------------------------------------------- */}
          {showInfoCards && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FF671F]" />
                <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                  Monument Highlights & Context
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displaySections.map((sec) => {
                  const visuals = getSectionVisuals(sec.key);
                  const Icon = visuals.icon;
                  const isExpanded = !!expandedSections[sec.key];

                  return (
                    <div
                      key={sec.key}
                      className={`p-4 sm:p-5 rounded-2xl border border-stone-200 bg-white shadow-xs hover:shadow-md transition flex flex-col justify-between`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl ${visuals.bgLight} ${visuals.iconColor} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="font-serif font-bold text-base text-stone-900">
                            {sec.title}
                          </h3>
                        </div>

                        <p
                          className={`text-sm text-stone-700 leading-relaxed ${
                            isExpanded ? '' : 'line-clamp-4'
                          }`}
                        >
                          {sec.text}
                        </p>
                      </div>

                      {sec.text.length > 200 && (
                        <div className="pt-3 mt-1 border-t border-stone-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => toggleSection(sec.key)}
                            className="text-xs font-bold text-[#FF671F] hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer transition"
                          >
                            <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* 4. "Visitor Tips" Card (Bullet list)                             */}
          {/* ----------------------------------------------------------------- */}
          {showVisitorTips && (
            <section className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF671F] flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                      Visitor Tips & Guidelines
                    </h3>
                    <p className="text-xs text-stone-500">
                      Essential advice for travellers visiting this heritage site
                    </p>
                  </div>
                </div>

                {isValidText(heritage.visitor_guide?.recommended_duration) && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-white text-stone-700 border border-stone-200 shadow-xs shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#FF671F]" />
                    <span>{heritage.visitor_guide!.recommended_duration}</span>
                  </span>
                )}
              </div>

              <ul className="space-y-2.5">
                {validVisitorTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-stone-700 leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-[#FF671F] mt-2 shrink-0 ring-4 ring-orange-100" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* 5. Features (Chhote cards/chips) & Timeline (Vertical timeline)  */}
          {/* ----------------------------------------------------------------- */}
          {showFeatures && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF671F]" />
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Architectural Features & Complex Highlights
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {validFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-orange-200 hover:bg-orange-50/20 transition shadow-xs space-y-1"
                  >
                    <div className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]" />
                      <span>{feat.title}</span>
                    </div>
                    {isValidText(feat.description) && (
                      <p className="text-xs text-stone-600 leading-relaxed pl-3.5">
                        {feat.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {showTimeline && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#FF671F]" />
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Chronological Timeline
                </h3>
              </div>

              <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs">
                <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-200">
                  {validTimeline.map((item: any, idx: number) => (
                    <div key={idx} className="relative group">
                      {/* Node dot */}
                      <span className="absolute -left-6 sm:-left-8 top-1 w-3 h-3 rounded-full bg-[#FF671F] ring-4 ring-orange-50 group-hover:scale-125 transition-transform" />

                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {item.year_label || item.year || `Phase ${idx + 1}`}
                        </span>
                        <p className="text-sm font-medium text-stone-800 leading-relaxed">
                          {item.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Practical Info (Opening hours, rules, ticketing) if available */}
          {showPractical && (
            <section className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <Info className="w-5 h-5 text-[#FF671F]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                  Practical Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                {practicalOpening && (
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">
                      Opening Timings
                    </div>
                    <div className="text-stone-800 font-medium">{practicalOpening}</div>
                  </div>
                )}
                {practicalPrices && (
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">
                      Ticket Rates
                    </div>
                    <div className="text-stone-800 font-medium">{practicalPrices}</div>
                  </div>
                )}
                {practicalAccessibility && (
                  <div className="space-y-1">
                    <div className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">
                      Accessibility
                    </div>
                    <div className="text-stone-800">{practicalAccessibility}</div>
                  </div>
                )}
                {practicalRules.length > 0 && (
                  <div className="space-y-1 sm:col-span-2">
                    <div className="font-semibold text-stone-400 uppercase tracking-wider text-[10px]">
                      Visitor Rules
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {practicalRules.map((rule: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs border border-stone-200"
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Sources and References */}
          {showSources && (
            <section className="text-xs text-stone-500 space-y-2 pt-2 border-t border-stone-200">
              <span className="font-bold text-stone-600 uppercase tracking-wider text-[10px]">
                Sources & Citations:
              </span>
              <ul className="space-y-1">
                {validSources.map((src: any, i: number) => (
                  <li key={i} className="flex items-center gap-1.5 truncate">
                    <span>• {src.title || src.publisher || 'Reference document'}</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#FF671F] hover:underline inline-flex items-center gap-0.5 shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* 6. Right Sidebar: Nearby aur Authenticity & Status                  */}
        {/* ------------------------------------------------------------------- */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Authenticity & Status Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-stone-900">
                Authenticity & Status
              </h3>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-500">UNESCO Listing</span>
                <UnescoBadge
                  status={heritage.unesco_status}
                  inscribedYear={heritage.unesco_inscribed_year}
                />
              </div>

              {isValidText(heritage.unesco_ref_id) && (
                <div className="flex items-center justify-between gap-2 text-stone-700">
                  <span className="text-stone-500">WHC Reference</span>
                  <span className="font-mono font-bold">#{heritage.unesco_ref_id}</span>
                </div>
              )}

              {isValidText(heritage.unesco_url) && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500">Official Dossier</span>
                  <a
                    href={heritage.unesco_url!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#FF671F] hover:underline font-semibold"
                  >
                    <span>UNESCO Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-500">ASI Protection</span>
                {heritage.asi_protected ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Protected</span>
                  </span>
                ) : (
                  <span className="text-stone-500">Not indicated</span>
                )}
              </div>

              {isValidText(heritage.last_verified_on) && (
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                  <span className="text-stone-500">Last Verified</span>
                  <span className="font-medium text-stone-800">{heritage.last_verified_on}</span>
                </div>
              )}

              {isValidText(heritage.review_status) && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-stone-500">Review Status</span>
                  <span className="capitalize font-semibold text-stone-700">
                    {heritage.review_status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Nearby Sites Card */}
          {showNearby && (
            <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <MapPin className="w-5 h-5 text-[#FF671F]" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Nearby Sights & Monuments
                </h3>
              </div>

              <div className="space-y-2">
                {validNearby.map((near: any, idx: number) => {
                  const isLink = isValidText(near.related_slug);

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-stone-100 bg-stone-50/60 hover:bg-orange-50/40 hover:border-orange-200 transition"
                    >
                      {isLink ? (
                        <Link
                          to={`/heritage/${near.related_slug}`}
                          className="flex items-center justify-between gap-2 text-stone-900 hover:text-[#FF671F] font-semibold text-sm group"
                        >
                          <span className="group-hover:underline">{near.name}</span>
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#FF671F] transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ) : (
                        <div className="text-stone-900 font-semibold text-sm">{near.name}</div>
                      )}

                      {isValidText(near.note) && (
                        <p className="text-xs text-stone-500 mt-1">{near.note}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Travel Gateways Card */}
          {showTravel && (
            <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <Train className="w-5 h-5 text-[#FF671F]" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Travel & Access
                </h3>
              </div>

              <div className="space-y-2.5">
                {validTravel.map((tr: any, idx: number) => {
                  const mode = (tr.mode || '').toLowerCase();
                  const IconMode = mode === 'air' ? Plane : mode === 'rail' ? Train : Car;

                  return (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 mt-0.5">
                        <IconMode className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-stone-900">
                          {tr.hub || tr.hub_name || 'Transport hub'}
                        </div>
                        {isValidText(tr.note) && (
                          <div className="text-stone-500">{tr.note}</div>
                        )}
                      </div>
                    </div>
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

export default HeritageDetailPage;
