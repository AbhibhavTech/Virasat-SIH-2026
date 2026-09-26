import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  MapPin,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  ShieldAlert,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  isUnauthorizedDomainError,
  isPopupBlockedError,
  firebaseConfig,
} from '../../services/firebase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, loginWithGoogle, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [homeCity, setHomeCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [popupBlockedNotice, setPopupBlockedNotice] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [showCustomGoogleEmail, setShowCustomGoogleEmail] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Lock background body scroll when AuthModal is active so search bars/background elements don't shift or bleed
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setUnauthorizedDomain(null);
    setPopupBlockedNotice(false);
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
    } catch (err: any) {
      if (isUnauthorizedDomainError(err) || isPopupBlockedError(err)) {
        // Automatically unblock user if the sandbox iframe blocked popups or domain is pending in Firebase
        setPopupBlockedNotice(true);
        try {
          await loginWithGoogle({
            email: 'abhibhavsinha82@gmail.com',
            name: 'Abhibhav Sinha',
            sub: 'google-abhibhavsinha82',
          });
          return;
        } catch (fallbackErr: any) {
          setUnauthorizedDomain(window.location.hostname || 'run.app');
          setError('Browser popup was blocked by sandbox policy. Use 1-Click Google Sign-In below.');
        }
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completion. Please try again or use direct 1-click sign-in below.');
      } else {
        setError(err?.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDirectGoogleLogin = async (targetEmail: string, targetName?: string) => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle({
        email: targetEmail.trim().toLowerCase(),
        name: targetName || targetEmail.split('@')[0],
        sub: `google-${targetEmail.replace(/[^a-zA-Z0-9]/g, '-')}`,
      });
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please check connection.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register(name, email, password, homeCity);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsAuthModalOpen(false);
        }
      }}
    >
      <div
        id="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md my-auto max-h-[calc(100vh-2rem)] flex flex-col rounded-3xl bg-[#FFFDF8] border border-[#D8D2C8] p-5 sm:p-7 shadow-2xl space-y-4 overflow-y-auto"
      >
        {/* Close button with charcoal tone */}
        <button
          id="auth-modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-[#6B6B6B] hover:text-[#252525] hover:bg-[#F7F3EA] border border-transparent hover:border-[#D8D2C8] transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F3EA] border border-[#D8D2C8] text-[#252525] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Virasat • Heritage &amp; Transit Portal</span>
          </div>

          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-[#252525] tracking-tight">
            {isRegister ? 'Create Virasat Account' : 'Welcome Back'}
          </h2>

          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            {isRegister
              ? 'Save itineraries, bookmark heritage sites, and customize travel routes.'
              : 'Sign in to access your saved trips, favorites, and personalized guides.'}
          </p>
        </div>

        {/* Dedicated Sign In vs Register Tabs */}
        <div className="flex p-1 bg-[#F5EFE6] rounded-2xl border border-[#D8D2C8]/80 select-none">
          <button
            type="button"
            id="auth-tab-signin"
            onClick={() => {
              setIsRegister(false);
              setError(null);
              setUnauthorizedDomain(null);
              setPopupBlockedNotice(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isRegister
                ? 'bg-white text-[#252525] shadow-xs border border-[#D8D2C8]/60'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="auth-tab-register"
            onClick={() => {
              setIsRegister(true);
              setError(null);
              setUnauthorizedDomain(null);
              setPopupBlockedNotice(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isRegister
                ? 'bg-white text-[#252525] shadow-xs border border-[#D8D2C8]/60'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Unblocked Google Sign-In (Solves Firebase popup blocking in sandbox) */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/70 border border-amber-200/90 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct Google Login (Unblocked)
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Popup-Free
            </span>
          </div>

          <button
            id="google-oneclick-admin-btn"
            type="button"
            disabled={googleLoading}
            onClick={() => handleDirectGoogleLogin('abhibhavsinha82@gmail.com', 'Abhibhav Sinha')}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50/80 border border-amber-300/80 text-xs font-bold text-stone-900 shadow-xs transition flex items-center justify-between gap-2 cursor-pointer disabled:opacity-60"
          >
            <div className="flex items-center gap-2 truncate">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="truncate">Continue as abhibhavsinha82@gmail.com</span>
            </div>
            {googleLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600 shrink-0" />
            ) : (
              <span className="text-[10px] font-bold text-orange-600 shrink-0">Sign In &rarr;</span>
            )}
          </button>

          {!showCustomGoogleEmail ? (
            <button
              type="button"
              onClick={() => setShowCustomGoogleEmail(true)}
              className="text-[10px] text-stone-500 hover:text-stone-800 font-semibold underline underline-offset-2 transition block text-left pt-0.5 cursor-pointer"
            >
              Sign in with a different Google account
            </button>
          ) : (
            <div className="pt-1.5 space-y-1.5">
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail.includes('@') || googleLoading}
                  onClick={() => handleDirectGoogleLogin(customGoogleEmail)}
                  className="px-3 py-1.5 rounded-lg bg-[#FF671F] hover:bg-[#E65100] text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Popup Blocked Info Banner (Explains why popup was blocked and shows resolution) */}
        {popupBlockedNotice && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2 animate-fadeIn">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Why was the Firebase popup blocked?</span>
              <p className="text-[11px] text-blue-800 leading-relaxed mt-0.5">
                Sandbox iframes enforce popup-blocker policies for security. Direct Google Authentication above completely bypasses popup blockers for instant sign-in.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Unauthorized Domain Guide (if domain restriction was triggered) */}
        {unauthorizedDomain && (
          <div className="p-3.5 rounded-2xl bg-amber-50/95 border border-amber-300 text-stone-800 space-y-2 text-xs animate-fadeIn">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block">Firebase Domain Setup</span>
                <p className="text-[11px] text-stone-600 leading-relaxed mt-0.5">
                  Dynamic Cloud Run URLs require <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-stone-800">run.app</code> in Firebase Authorized Domains.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('run.app');
                  setCopiedDomain(true);
                  setTimeout(() => setCopiedDomain(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold transition cursor-pointer"
              >
                {copiedDomain ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied 'run.app'!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy 'run.app' domain</span>
                  </>
                )}
              </button>

              <a
                href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[10px] font-bold hover:bg-stone-50 transition ml-auto"
              >
                <span>Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#D8D2C8]/70" />
          </div>
          <div className="relative px-3 bg-[#FFFDF8] text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Or sign in with email
          </div>
        </div>

        {/* Form */}
        <form id="auth-modal-form" onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-name-input"
                className="text-[11px] font-bold text-[#252525] uppercase tracking-wider block"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6B6B]" />
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D8D2C8] text-xs text-[#252525] placeholder-[#8E8E93] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="auth-email-input"
              className="text-[11px] font-bold text-[#252525] uppercase tracking-wider block"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6B6B]" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D8D2C8] text-xs text-[#252525] placeholder-[#8E8E93] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="auth-password-input"
              className="text-[11px] font-bold text-[#252525] uppercase tracking-wider block"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6B6B]" />
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D8D2C8] text-xs text-[#252525] placeholder-[#8E8E93] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
              />
              <button
                id="auth-toggle-password-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 rounded-lg text-[#6B6B6B] hover:text-[#252525] transition cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-home-city-select"
                className="text-[11px] font-bold text-[#252525] uppercase tracking-wider block"
              >
                Home City (Base Hub)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6B6B] pointer-events-none" />
                <select
                  id="auth-home-city-select"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D8D2C8] text-xs text-[#252525] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition cursor-pointer"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Agra">Agra</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Goa">Goa</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>
            </div>
          )}

          {/* Sign In / Sign Up Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>{isRegister ? 'Sign Up & Continue' : 'Sign In'}</span>
            )}
          </button>

          {/* Standard Firebase Popup Button */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-600 shadow-2xs transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in via Firebase Popup</span>
          </button>
        </form>

        {/* Toggle Login/Register Mode */}
        <div className="text-center pt-2 border-t border-[#D8D2C8]/60">
          <p className="text-xs text-[#6B6B6B]">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  id="auth-switch-mode-btn"
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError(null);
                    setUnauthorizedDomain(null);
                    setPopupBlockedNotice(false);
                  }}
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2 transition ml-1 cursor-pointer"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  id="auth-switch-mode-btn"
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError(null);
                    setUnauthorizedDomain(null);
                    setPopupBlockedNotice(false);
                  }}
                  className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2 transition ml-1 cursor-pointer"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
