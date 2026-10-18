import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { PlaceSummary } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { UnescoBadge } from '../components/common/UnescoBadge';
import {
  Landmark,
  Search,
  MapPin,
  Clock,
  Ticket,
  Compass,
  Heart,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Train,
  SlidersHorizontal,
  Info,
  Camera,
  Castle,
  Building2,
  Waves,
  Award,
  History,
  ArrowUpRight,
  X,
  RotateCcw,
} from 'lucide-react';
import { GuideIllustration } from '../components/cultural-guides/GuideIllustrations';
import { GuideSpeechBubble } from '../components/cultural-guides/GuideSpeechBubble';
import { getMonumentRealImage } from '../data/monumentRealImages';
import { MonumentARCameraModal } from '../components/ar/MonumentARCameraModal';

interface HeritageSitesPageProps {
  onSelectPlace: (placeId: string) => void;
  onNavigateTab: (tab: any) => void;
  onSelectPlaceForRoute?: (placeId: string) => void;
}

export const HeritageSitesPage: React.FC<HeritageSitesPageProps> = ({
  onSelectPlace,
  onNavigateTab,
  onSelectPlaceForRoute,
}) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { currentLanguage } = useLanguage();
  const [heritageSites, setHeritageSites] = useState<any[]>([]);
  const [allStates, setAllStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedUnescoStatus, setSelectedUnescoStatus] = useState('All');
  const [isARModalOpen, setIsARModalOpen] = useState(false);

  useEffect(() => {
    const fetchHeritage = async () => {
      setLoading(true);
      try {
        const [res, statesRes] = await Promise.allSettled([
          api.getHeritage({ limit: 100, lang: currentLanguage }),
          api.getStates(),
        ]);

        if (res.status === 'fulfilled' && res.value?.data && res.value.data.length > 0) {
          setHeritageSites(res.value.data);
        } else {
          // Fallback to places with heritage category
          const placesRes = await api.getPlaces({ limit: 100 });
          setHeritageSites(placesRes.data || []);
        }

        if (statesRes.status === 'fulfilled' && Array.isArray(statesRes.value)) {
          setAllStates(statesRes.value.map((s: any) => s.name || s.id));
        }
      } catch (err) {
        console.error('Failed to load heritage sites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeritage();
  }, [currentLanguage]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: heritageSites.length,
      'Forts & Palaces': 0,
      'Temples & Sacred': 0,
      'Caves & Rock-Cut': 0,
      'Architectural & Colonial': 0,
      'Natural & Ghats': 0,
    };

    heritageSites.forEach((site) => {
      const siteCat = (site.category || '').toLowerCase();
      const siteTags = (site.tags || []).map((t: string) => t.toLowerCase());

      if (siteCat.includes('fort') || siteCat.includes('palace') || siteTags.includes('fort') || siteTags.includes('palace')) {
        counts['Forts & Palaces']++;
      } else if (siteCat.includes('temple') || siteCat.includes('sacred') || siteCat.includes('church') || siteTags.includes('temple') || siteTags.includes('religious')) {
        counts['Temples & Sacred']++;
      } else if (siteCat.includes('cave') || siteTags.includes('cave') || siteTags.includes('rock-cut')) {
        counts['Caves & Rock-Cut']++;
      } else if (siteCat.includes('colonial') || siteCat.includes('monument') || siteCat.includes('architecture') || siteCat.includes('city') || siteCat.includes('complex') || siteCat.includes('railway') || siteTags.includes('colonial')) {
        counts['Architectural & Colonial']++;
      } else if (siteCat.includes('ghat') || siteCat.includes('nature') || siteCat.includes('natural') || siteTags.includes('ghat') || siteTags.includes('lake') || siteTags.includes('park')) {
        counts['Natural & Ghats']++;
      } else {
        counts['Architectural & Colonial']++;
      }
    });

    return counts;
  }, [heritageSites]);

  const categories = useMemo(() => [
    {
      id: 'All',
      label: 'All Heritage',
      icon: Landmark,
      count: categoryCounts['All'] || heritageSites.length,
    },
    {
      id: 'Forts & Palaces',
      label: 'Forts & Palaces',
      icon: Castle,
      count: categoryCounts['Forts & Palaces'] || 0,
    },
    {
      id: 'Temples & Sacred',
      label: 'Temples & Sacred',
      icon: Sparkles,
      count: categoryCounts['Temples & Sacred'] || 0,
    },
    {
      id: 'Caves & Rock-Cut',
      label: 'Rock-Cut Caves',
      icon: Compass,
      count: categoryCounts['Caves & Rock-Cut'] || 0,
    },
    {
      id: 'Architectural & Colonial',
      label: 'Colonial & Monuments',
      icon: Building2,
      count: categoryCounts['Architectural & Colonial'] || 0,
    },
    {
      id: 'Natural & Ghats',
      label: 'Ghats & Natural',
      icon: Waves,
      count: categoryCounts['Natural & Ghats'] || 0,
    },
  ], [categoryCounts, heritageSites.length]);

  const statesList = useMemo(() => {
    const set = new Set<string>();
    heritageSites.forEach((s) => {
      const st = s.state_ut || s.state;
      if (st) set.add(st);
    });
    allStates.forEach((st) => {
      if (st) set.add(st);
    });
    return ['All', ...Array.from(set).sort()];
  }, [heritageSites, allStates]);

  const filteredSites = useMemo(() => {
    return heritageSites.filter((site) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        site.name?.toLowerCase().includes(q) ||
        (site.district_city && site.district_city.toLowerCase().includes(q)) ||
        (site.city && site.city.toLowerCase().includes(q)) ||
        (site.state_ut && site.state_ut.toLowerCase().includes(q)) ||
        (site.state && site.state.toLowerCase().includes(q)) ||
        (site.overview && site.overview.toLowerCase().includes(q)) ||
        (site.summary && site.summary.toLowerCase().includes(q)) ||
        (site.historical_significance && site.historical_significance.toLowerCase().includes(q)) ||
        (site.alt_names && site.alt_names.some((a: string) => a.toLowerCase().includes(q)));

      const matchesState =
        selectedState === 'All' ||
        site.state_ut === selectedState ||
        site.state === selectedState ||
        (site.state_ut || site.state || '').toLowerCase().includes(selectedState.toLowerCase());

      const matchesUnesco =
        selectedUnescoStatus === 'All' ||
        site.unesco_status === selectedUnescoStatus;

      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        const siteCat = (site.category || '').toLowerCase();
        const siteTags = (site.tags || []).map((t: string) => t.toLowerCase());

        if (selectedCategory === 'Forts & Palaces') {
          matchesCategory = siteCat.includes('fort') || siteCat.includes('palace') || siteTags.includes('fort') || siteTags.includes('palace');
        } else if (selectedCategory === 'Temples & Sacred') {
          matchesCategory = siteCat.includes('temple') || siteCat.includes('sacred') || siteCat.includes('church') || siteTags.includes('temple') || siteTags.includes('religious');
        } else if (selectedCategory === 'Caves & Rock-Cut') {
          matchesCategory = siteCat.includes('cave') || siteTags.includes('cave') || siteTags.includes('rock-cut');
        } else if (selectedCategory === 'Architectural & Colonial') {
          matchesCategory = siteCat.includes('colonial') || siteCat.includes('monument') || siteCat.includes('architecture') || siteCat.includes('city') || siteCat.includes('complex') || siteCat.includes('railway') || siteTags.includes('colonial');
        } else if (selectedCategory === 'Natural & Ghats') {
          matchesCategory = siteCat.includes('ghat') || siteCat.includes('nature') || siteCat.includes('natural') || siteTags.includes('ghat') || siteTags.includes('lake') || siteTags.includes('park');
        }
      }

      return matchesSearch && matchesState && matchesCategory && matchesUnesco;
    });
  }, [heritageSites, searchQuery, selectedCategory, selectedState, selectedUnescoStatus]);

  const isAnyFilterActive =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedState !== 'All' ||
    selectedUnescoStatus !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All');
    setSelectedUnescoStatus('All');
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-fadeIn max-w-[1720px] mx-auto pb-16">
      {/* Grand Hero Section - Immersive, Cultural, Wide Layout */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-[#FFFDF9] via-[#FAF6F0] to-[#F5EFEB] text-stone-900 p-6 sm:p-10 lg:p-12 xl:p-14 shadow-[0_20px_60px_rgba(57,39,26,0.08)] border border-[#E8DEC8]">
        {/* Decorative Indian Tricolour Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF671F] via-[#FAF6F0] to-[#046A38]" />

        {/* Subtle Ambient Background Watermarks & Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-[0.035] pointer-events-none select-none">
          <Landmark className="w-[450px] h-[450px] text-[#FF671F]" />
        </div>

        {/* Hero Split Layout */}
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Typography & Heritage Statistics */}
          <div className="xl:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-950 border border-orange-300/80 text-xs sm:text-sm font-bold shadow-xs backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <ShieldCheck className="w-4 h-4 text-[#FF671F]" />
              <span>Catalogued ASI & UNESCO Heritage Records</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#0B192C] leading-[1.12]">
                Major Monuments, Tourist Places &{' '}
                <span className="bg-gradient-to-r from-[#FF671F] via-[#E06D24] to-[#046A38] bg-clip-text text-transparent">
                  Iconic Heritage
                </span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed font-sans max-w-2xl">
                India’s officially verified national heritage repository. Discover world-renowned monuments, architectural dynasties, verified visiting hours, direct rail corridors, and 3D AR camera lenses.
              </p>
            </div>

            {/* Quick Metrics & Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs text-xs sm:text-sm font-semibold text-stone-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#046A38]" />
                <span>{loading ? '...' : heritageSites.length} Monuments Catalogued</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs text-xs sm:text-sm font-semibold text-stone-800">
                <Award className="w-4 h-4 text-[#FF671F]" />
                <span>UNESCO World Heritage</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs text-xs sm:text-sm font-semibold text-stone-800">
                <History className="w-4 h-4 text-[#000080]" />
                <span>3,500+ Years Architecture</span>
              </div>
              <button
                type="button"
                onClick={() => setIsARModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] text-white shadow-xs hover:shadow-md text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>AR Scanner Ready</span>
              </button>
            </div>
          </div>

          {/* Right Column: Creative Interactive Showcase Quadrant */}
          <div className="xl:col-span-5">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#E8DEC8] shadow-[0_12px_40px_rgba(57,39,26,0.06)] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/70">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF671F]" />
                  <span className="text-xs sm:text-sm font-serif font-bold text-stone-900 uppercase tracking-wider">
                    Interactive Heritage Explorer
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-stone-500">Quick Filters</span>
              </div>

              {/* 4 Interactive Feature Tiles */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                {/* Tile 1: Forts & Palaces */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Forts & Palaces');
                    const element = document.getElementById('heritage-filter-bar');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group/tile p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-50/70 to-amber-50/40 border border-orange-200/70 hover:border-orange-400 hover:shadow-md transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-[#FF671F] group-hover/tile:scale-110 transition-transform">
                      <Castle className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover/tile:text-[#FF671F] transition-colors" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover/tile:text-[#FF671F] transition-colors">
                    Forts & Palaces
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">
                    Rajput & Mughal Bastions
                  </p>
                </button>

                {/* Tile 2: Temples & Sacred */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Temples & Sacred');
                    const element = document.getElementById('heritage-filter-bar');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group/tile p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50/70 to-yellow-50/40 border border-amber-200/70 hover:border-amber-400 hover:shadow-md transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover/tile:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover/tile:text-amber-600 transition-colors" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover/tile:text-amber-600 transition-colors">
                    Temples & Sacred
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">
                    Dravidian & Nagara Vimana
                  </p>
                </button>

                {/* Tile 3: Rock-Cut Caves */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Caves & Rock-Cut');
                    const element = document.getElementById('heritage-filter-bar');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group/tile p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/70 hover:border-emerald-400 hover:shadow-md transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[#046A38] group-hover/tile:scale-110 transition-transform">
                      <Compass className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover/tile:text-[#046A38] transition-colors" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover/tile:text-[#046A38] transition-colors">
                    Rock-Cut Caves
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">
                    Ajanta, Ellora & Elephanta
                  </p>
                </button>

                {/* Tile 4: AR Camera Scan */}
                <button
                  type="button"
                  onClick={() => setIsARModalOpen(true)}
                  className="group/tile p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/70 hover:border-blue-400 hover:shadow-md transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[#000080] group-hover/tile:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover/tile:text-[#000080] transition-colors" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover/tile:text-[#000080] transition-colors">
                    AR Camera Lens
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">
                    Scan & View Monuments
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virasat Cultural Guide Concierge Bar */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-50/90 via-white to-emerald-50/70 border border-[#E8DEC8] shadow-xs">
        <GuideIllustration characterId="virasat" size="lg" animated={true} popIn={true} popDirection="left" />
        <div className="flex-1 w-full min-w-0">
          <GuideSpeechBubble
            characterId="virasat"
            contextMode="heritage"
            speechText="Pranam! India's grand architectural timeline spans 3,500+ years—from the corbelled stone vimanas of Thanjavur to the marble domes of Agra and the basalt rock-cut sanctums of Ajanta. Use the curated filters below or the AR Camera Scanner to explore every historic bastion."
            contextTag="Archaeological & Heritage Curator"
            orientation="right"
            nonBlocking={true}
            quickActions={[
              {
                label: 'AR Camera Lens 📸',
                onClick: () => setIsARModalOpen(true),
                primary: true,
              },
              {
                label: 'UNESCO World Heritage 🏛️',
                onClick: () => {
                  setSelectedCategory('All');
                  setSearchQuery('UNESCO');
                },
              },
              {
                label: 'Hill Forts of Rajasthan 🏰',
                onClick: () => {
                  setSelectedCategory('Forts & Palaces');
                  setSearchQuery('Fort');
                },
              },
              {
                label: 'Dravidian Temples 🛕',
                onClick: () => {
                  setSelectedCategory('Temples & Sacred');
                  setSearchQuery('Temple');
                },
              },
              {
                label: 'Rock-Cut Caves 🗿',
                onClick: () => {
                  setSelectedCategory('Caves & Rock-Cut');
                  setSearchQuery('Cave');
                },
              },
            ]}
          />
        </div>
      </section>

      {/* Filter and Search Bar (Enlarged & Prominent) */}
      <section id="heritage-filter-bar" className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#E8DEC8] shadow-[0_12px_40px_rgba(57,39,26,0.06)] space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search monuments, dynasties, architectural styles, or cities..."
              className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-stone-200 bg-[#FAF8F5]/80 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF671F] transition-all font-sans font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* AR Camera Lens Trigger Button */}
          <button
            type="button"
            onClick={() => setIsARModalOpen(true)}
            title="Scan Monument with AR Camera or Upload Photo"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF671F] via-[#E06D24] to-[#C9510C] hover:from-[#E06D24] hover:to-[#B84000] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>AR Camera Lens 📸</span>
          </button>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-full lg:w-auto">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full lg:w-auto py-3.5 sm:py-4 pl-4 pr-10 rounded-xl sm:rounded-2xl border-2 border-stone-200 bg-[#FAF8F5]/80 text-xs sm:text-sm font-bold text-stone-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-[#FF671F] cursor-pointer appearance-none"
              >
                <option value="All">All States & UTs {statesList.length > 1 ? `(${statesList.length - 1})` : ''}</option>
                {statesList.filter(s => s !== 'All').map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>

            {/* Language Selector (Requirement 4: Heritage Tab) */}
            <LanguageSelector id="heritage-tab-lang-selector" className="h-[48px] sm:h-[54px]" />
          </div>
        </div>

        {/* UNESCO Status Filter Pills (Requirement 3) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs mobile-scroll-row">
          <span className="text-stone-500 font-semibold text-xs shrink-0">UNESCO Status:</span>
          {[
            { id: 'All', label: 'All Heritage Records' },
            { id: 'inscribed', label: 'UNESCO Inscribed Site' },
            { id: 'part_of_inscribed', label: 'Part of UNESCO Site' },
            { id: 'tentative', label: 'Tentative List' },
            { id: 'not_listed', label: 'National Heritage (Not Listed)' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedUnescoStatus(st.id)}
              className={`px-3 py-1.5 rounded-full font-bold transition text-xs shrink-0 cursor-pointer ${
                selectedUnescoStatus === st.id
                  ? 'bg-[#0B192C] text-white shadow-xs'
                  : 'bg-[#F8F5F0] hover:bg-[#EFE8DF] text-stone-700 border border-stone-200/80'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Category Pills (Enlarged with Icons & Live Counters) */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1.5 scrollbar-none text-xs sm:text-sm mobile-scroll-row">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF671F] to-[#E06D24] text-white shadow-[0_8px_20px_rgba(255,103,31,0.25)] scale-[1.02]'
                    : 'bg-[#F8F5F0] hover:bg-[#EFE8DF] text-stone-700 border border-stone-200/80 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{cat.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-200/70 text-stone-700'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Count Bar & Reset Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-stone-600 px-2 font-sans">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            {loading ? (
              <span className="text-stone-400">Loading catalogued heritage destinations...</span>
            ) : (
              <>
                Showing <strong className="text-stone-900 font-bold">{filteredSites.length}</strong> of{' '}
                <strong className="text-stone-900 font-bold">{heritageSites.length}</strong> heritage destinations
              </>
            )}
          </span>
          {selectedCategory !== 'All' && (
            <span className="bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-lg border border-orange-200 font-bold text-xs">
              Category: {selectedCategory}
            </span>
          )}
          {selectedState !== 'All' && (
            <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-lg border border-emerald-200 font-bold text-xs">
              State: {selectedState}
            </span>
          )}
        </div>

        {isAnyFilterActive && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF671F] hover:text-[#C9510C] hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Heritage Cards Grid (Substantially Bigger, Bolder & Immersive) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-stone-100 animate-pulse border border-[#E8DEC8]" />
          ))}
        </div>
      ) : filteredSites.length === 0 ? (
        <div className="p-10 sm:p-16 text-center bg-white rounded-3xl border border-[#E8DEC8] space-y-4 shadow-sm">
          <Landmark className="w-14 h-14 sm:w-16 sm:h-16 text-stone-300 mx-auto" />
          <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-800">No heritage sites found</h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Try adjusting your search keywords or resetting your state and category filters.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] text-white text-xs sm:text-sm font-bold hover:shadow-md transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredSites.map((site) => {
            const siteKey = site.slug || String(site.id);
            const fav = isFavorite(siteKey);
            const siteImage = site.media?.hero?.url || getMonumentRealImage(site.slug || site.id, site.thumbnail_url);
            const locationText = [site.district_city || site.city, site.state_ut || site.state].filter(Boolean).join(', ');
            const summaryText = site.overview || site.summary || site.historical_significance;

            return (
              <div
                key={siteKey}
                onClick={() => navigate(`/heritage/${site.slug || site.id}`)}
                className="group bg-white rounded-3xl border border-[#E8DEC8] hover:border-orange-300 shadow-[0_8px_30px_rgba(57,39,26,0.06)] hover:shadow-[0_20px_50px_rgba(57,39,26,0.14)] transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
              >
                {/* Large Thumbnail Image Container */}
                <div className="relative h-56 sm:h-64 lg:h-72 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={siteImage}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallback = getMonumentRealImage(site.slug || site.id);
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Badges on Image (Requirement 3: Strict UNESCO badge) */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 items-center">
                    <UnescoBadge
                      status={site.unesco_status}
                      year={site.unesco_inscribed_year}
                      siteName={site.unesco_site_name}
                      size="sm"
                    />
                    {site.asi_protected && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#046A38] text-white shadow-xs">
                        ASI Protected
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(siteKey);
                    }}
                    className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      fav
                        ? 'bg-rose-500 text-white shadow-md scale-105'
                        : 'bg-black/40 text-white hover:bg-black/60'
                    }`}
                    title={fav ? 'Remove from saved' : 'Save to favorites'}
                  >
                    <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Location & Star Rating Overlay */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs sm:text-sm">
                    {locationText ? (
                      <div className="flex items-center gap-1.5 font-semibold truncate drop-shadow-md">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">{locationText}</span>
                      </div>
                    ) : <div />}
                    {site.rating && (
                      <span className="text-xs font-bold bg-black/70 px-2.5 py-1 rounded-full text-amber-300 backdrop-blur-md border border-amber-300/30">
                        ★ {site.rating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-black text-stone-900 text-lg sm:text-xl lg:text-2xl leading-snug group-hover:text-[#FF671F] transition-colors">
                      {site.name}
                    </h3>
                    {summaryText && (
                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 sm:line-clamp-3 leading-relaxed font-sans">
                        {summaryText}
                      </p>
                    )}
                  </div>

                  {/* Visiting Details Grid (Hide if not available) */}
                  {(site.visiting_hours || site.timings || site.practical?.opening_hours) && (
                    <div className="pt-3 border-t border-[#F0EAE1] grid grid-cols-2 gap-2 text-xs text-stone-700 font-sans font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">
                          {site.visiting_hours || site.timings || (typeof site.practical?.opening_hours === 'string' ? site.practical.opening_hours : 'Open')}
                        </span>
                      </div>
                      {site.entry_fee?.domestic !== undefined && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Ticket className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">
                            ₹{site.entry_fee.domestic} (INR)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nearest Transit Info */}
                  {(site.nearest_transport?.railway_station || site.visiting_info?.railway_station) && (
                    <div className="flex items-center gap-2 text-xs text-stone-700 bg-orange-50/60 px-3 py-1.5 rounded-xl border border-orange-100 font-sans font-medium">
                      <Train className="w-3.5 h-3.5 text-[#000080] shrink-0" />
                      <span className="truncate">
                        Station: {site.nearest_transport?.railway_station || site.visiting_info?.railway_station}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/heritage/${site.slug || site.id}`);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF671F] to-[#E06D24] hover:from-[#E06D24] hover:to-[#C9510C] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
                    >
                      <span>Explore Monument</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateTab('itinerary');
                      }}
                      className="py-3 px-4 rounded-xl sm:rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Plan visit to this site"
                    >
                      <Compass className="w-4 h-4 text-stone-600" />
                      <span>Plan Trip</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AR Camera & Visual Monument Identification Modal */}
      <MonumentARCameraModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        onSelectPlace={onSelectPlace}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
};
