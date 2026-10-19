import React, { useState } from 'react';
import {
  User,
  MapPin,
  Sparkles,
  LogOut,
  Check,
  Compass,
  Heart,
  Bookmark,
  ShieldCheck,
  Settings,
  Award,
  QrCode,
  Printer,
  Landmark,
  Train,
  Flame,
  Palette,
  Camera,
  Users,
  Share2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { NavTab } from '../components/layout/Sidebar';
import { TricolourTopBar } from '../components/common/TricolourBranding';

interface ProfilePageProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateTab }) => {
  const { user, logout, updateProfile, setIsAuthModalOpen, setIsOnboardingModalOpen } = useAuth();
  const { favorites } = useFavorites();

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [homeCity, setHomeCity] = useState(user?.home_city || 'Mumbai');
  const [travelStyle, setTravelStyle] = useState(user?.travel_style || 'heritage_explorer');
  const [budgetPreference, setBudgetPreference] = useState(user?.budget_preference || 'moderate');
  const [preferredTransport, setPreferredTransport] = useState(user?.preferred_transport || 'mixed');
  const [saved, setSaved] = useState(false);
  const [passCopied, setPassCopied] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-[#EFE8DF] text-[#046A38] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#0B192C]">Traveler Profile</h2>
        <p className="text-xs text-slate-500">
          Sign in to view your personalized heritage preferences, bookmarks, and saved itineraries.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white font-bold text-xs transition shadow-sm cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateProfile({
        ...user,
        name,
        avatar_url: avatarUrl.trim() || undefined,
        home_city: homeCity,
        travel_style: travelStyle,
        budget_preference: budgetPreference,
        preferred_transport: preferredTransport,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleSelectArchetype = async (styleKey: string) => {
    setTravelStyle(styleKey);
    if (!user) return;
    try {
      await updateProfile({
        ...user,
        travel_style: styleKey,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to update archetype:', err);
    }
  };

  const isGoogleUser = user.auth_provider === 'google' || user.auth_provider === 'google_linked' || Boolean(user.google_id);

  const archetypes = [
    {
      id: 'heritage_explorer',
      label: 'Heritage Connoisseur',
      icon: Landmark,
      desc: 'ASI Monuments, Inscriptions, UNESCO Architecture',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'cultural_enthusiast',
      label: 'Spiritual & Cultural Seeker',
      icon: Flame,
      desc: 'Sacred Ghats, Morning Aarti, Living Traditions',
      color: 'from-orange-500 to-rose-600',
    },
    {
      id: 'fast_sightseer',
      label: 'Solo Backpacker',
      icon: Train,
      desc: 'Suburban Rail, Walking Corridors, Budget Trails',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'family_explorer',
      label: 'Family Explorer',
      icon: Users,
      desc: 'Child-friendly, Relaxed Pace, Gardens & Museums',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'photographer',
      label: 'Visual Storyteller',
      icon: Camera,
      desc: 'Golden Hour, Architectural Symmetries & Streets',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const passportNumber = `VIR-${(user.id || user.email || 'BHRT26').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}-2026`;

  const handlePrintPass = () => {
    window.print();
  };

  const handleSharePassport = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`Namaste! Check out my verified Virasat Bharat Yatri Digital Passport [${passportNumber}] on https://virasat.in - Exploring India's living heritage.`);
      setPassCopied(true);
      setTimeout(() => setPassCopied(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6 pb-12">
      {/* Profile Header */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EFE8DF] p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl object-cover border-2 border-[#EFE8DF] shadow-md shrink-0"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FF671F] to-[#046A38] text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'Y'}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0B192C]">{user.name}</h1>
            
            {/* Role Badge */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
              user.role === 'admin'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : user.role === 'heritage_officer'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : user.role === 'moderator'
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <ShieldCheck className="w-3 h-3 text-[#046A38]" />
              <span className="capitalize">{user.role?.replace('_', ' ') || 'Bharat Yatri'}</span>
            </span>

            {/* Auth Provider Badge */}
            {isGoogleUser ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google Verified Account</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                <span>Virasat Citizen ID</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 pt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-xl bg-slate-50 border border-[#EFE8DF] text-slate-700 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Base: {user.home_city || 'Mumbai'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 font-bold capitalize">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              {travelStyle?.replace('_', ' ') || 'Heritage Explorer'}
            </span>
            {user.survey?.interests && user.survey.interests.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                <span>🎯 {user.survey.interests.slice(0, 2).join(', ')}</span>
              </span>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-[#EFE8DF] text-xs font-bold text-slate-600 hover:text-rose-600 transition flex items-center gap-1.5 self-center sm:self-start cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* VIRASAT OFFICIAL DIGITAL BHARAT YATRI PASSPORT */}
      {/* ============================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-[#0B192C] to-stone-950 text-white border-2 border-amber-500/30 p-5 sm:p-8 shadow-2xl overflow-hidden print:border-stone-800 print:text-black print:bg-white">
        {/* Tricolour Accent Line at the Top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF671F] via-white to-[#046A38]" />

        {/* Decorative Watermark Emblem */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none select-none text-amber-100">
          <Award className="w-80 h-80" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase tracking-widest">
                Official Digital Credential
              </span>
              <span className="text-stone-400 text-xs">•</span>
              <span className="text-[11px] text-stone-300 font-mono">National Heritage Edition</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>BHARAT HERITAGE PASSPORT</span>
            </h2>
            <p className="text-xs text-stone-300 max-w-xl">
              Verified digital identity for expedited cultural entry, multimodal ASI circuits, and authentic GI-handicraft patronage across all 36 States &amp; UTs.
            </p>
          </div>

          {/* Action Buttons: Print & Share */}
          <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto print:hidden">
            <button
              onClick={handleSharePassport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition active:scale-95 cursor-pointer"
              title="Share digital pass details"
            >
              {passCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{passCopied ? 'Link Copied!' : 'Share Pass'}</span>
            </button>
            <button
              onClick={handlePrintPass}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:brightness-110 text-white text-xs font-bold transition shadow-md active:scale-95 cursor-pointer"
              title="Print official heritage dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
          </div>
        </div>

        {/* Passport Credential Body */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Column 1: Traveler Details */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90">
              Yatri Credentials
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-stone-400">Cardholder Name</div>
              <div className="text-base font-bold text-white font-serif">{user.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-stone-400">Passport Number</div>
              <div className="text-sm font-mono font-bold text-amber-300 tracking-wider">
                {passportNumber}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div>
                <div className="text-[11px] text-stone-400">Home Base</div>
                <div className="text-xs font-semibold text-stone-200">{homeCity}</div>
              </div>
              <div className="w-px h-7 bg-white/10" />
              <div>
                <div className="text-[11px] text-stone-400">Auth Status</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Verified Citizen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Unlocked Heritage Milestones */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90">
              Heritage Stamps &amp; Badges
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>UNESCO Explorer</span>
                </div>
                <div className="text-[10px] text-stone-400">Verified Elephanta &amp; CST</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Train className="w-3.5 h-3.5 text-blue-400" />
                  <span>Suburban Master</span>
                </div>
                <div className="text-[10px] text-stone-400">Local rail circuits</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Living Culture</span>
                </div>
                <div className="text-[10px] text-stone-400">Ghats &amp; Aarti witness</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Palette className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GI Artisan Patron</span>
                </div>
                <div className="text-[10px] text-stone-400">Vocal for Local crafts</div>
              </div>
            </div>
          </div>

          {/* Column 3: Secure QR Code Fast-Track Gate Seal */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
            <div className="p-2.5 bg-white rounded-xl shadow-inner">
              <QrCode className="w-20 h-20 text-stone-900" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-stone-200">Kiosk &amp; Turnstile Pass</div>
              <div className="text-[10px] text-stone-400">
                Compatible with ASI E-ticket gates &amp; local guide verifications
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE TRAVELER PERSONA ARCHETYPE SELECTOR */}
      {/* ============================================================== */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EFE8DF] p-4 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0B192C] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF671F]" />
              <span>Select Your Traveler Persona Archetype</span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Personalizes AI itinerary generation, recommendations, and local transit priority
            </p>
          </div>
          {saved && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-fadeIn">
              ✓ Preferences Updated
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {archetypes.map((arch) => {
            const Icon = arch.icon;
            const isSelected = travelStyle === arch.id;
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => handleSelectArchetype(arch.id)}
                className={`p-3 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50/70 border-[#FF671F] shadow-xs ring-1 ring-[#FF671F]/40'
                    : 'bg-stone-50/60 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
                    isSelected ? 'bg-[#FF671F]' : 'bg-stone-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-stone-900 truncate">{arch.label}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#FF671F] shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{arch.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigateTab('favorites')}
          className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#EFE8DF] hover:border-[#FF671F]/40 cursor-pointer transition shadow-sm space-y-1 sm:space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Bookmarked Heritage</span>
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500/20 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0B192C]">{favorites.length}</p>
          <p className="text-[11px] sm:text-xs text-[#046A38] font-semibold">View Bookmarks →</p>
        </div>

        <div
          onClick={() => onNavigateTab('trips')}
          className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#EFE8DF] hover:border-[#FF671F]/40 cursor-pointer transition shadow-sm space-y-1 sm:space-y-2 group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Saved Itineraries</span>
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 fill-orange-500/20 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0B192C]">Trips</p>
          <p className="text-[11px] sm:text-xs text-[#046A38] font-semibold">Manage Trips →</p>
        </div>
      </div>

      {/* Edit Preferences Form */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-[#EFE8DF] p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-[#0B192C] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#046A38]" />
            <span>Traveler Preferences & Settings</span>
          </h2>
          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="text-xs text-[#046A38] hover:underline font-bold cursor-pointer"
          >
            Re-run Welcome Survey
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-[#EFE8DF] text-xs text-[#0B192C] font-semibold focus:outline-none focus:border-[#FF671F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Default Home City
              </label>
              <select
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-[#EFE8DF] text-xs text-[#0B192C] font-semibold focus:outline-none focus:border-[#FF671F]"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Agra">Agra</option>
                <option value="Kochi">Kochi</option>
                <option value="Varanasi">Varanasi</option>
                <option value="Goa">Goa</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Travel Style Archetype
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-[#EFE8DF] text-xs text-[#0B192C] font-semibold focus:outline-none focus:border-[#FF671F]"
              >
                <option value="heritage_explorer">Heritage Explorer (Historical Deep Dives)</option>
                <option value="fast_sightseer">Fast Sightseer (Maximum Attractions)</option>
                <option value="photographer">Photographer (Golden Hour & Architecture)</option>
                <option value="cultural_enthusiast">Cultural Enthusiast (Food, Ghats & Temples)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Preferred Transit Mode
              </label>
              <select
                value={preferredTransport}
                onChange={(e) => setPreferredTransport(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-[#EFE8DF] text-xs text-[#0B192C] font-semibold focus:outline-none focus:border-[#FF671F]"
              >
                <option value="mixed">Balanced Multi-modal (Train + Auto + Walk)</option>
                <option value="suburban_rail">Suburban Rail / Metro Enthusiast</option>
                <option value="cab">Taxi / App Cab Priority</option>
                <option value="pedestrian">Pedestrian Heritage Corridors</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Avatar Photo URL (Optional)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.example.com/avatar.jpg"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-[#EFE8DF] text-xs text-[#0B192C] font-semibold focus:outline-none focus:border-[#FF671F]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Saved Successfully!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
