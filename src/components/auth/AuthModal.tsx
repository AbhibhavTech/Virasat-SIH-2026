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
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isUnauthorizedDomainError, isFirebaseConfigOrDomainError } from '../../services/firebase';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    register,
    loginWithGoogle,
  } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [homeCity, setHomeCity] = useState('Mumbai');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFirebaseDomainHelper, setShowFirebaseDomainHelper] = useState(false);

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

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'virasat.in';

  const handleGoogleSignIn = async () => {
    setError(null);
    setShowFirebaseDomainHelper(false);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google Auth notice:', err);
      const msg = String(err?.message || '');
      const code = String(err?.code || '');

      if (
        isUnauthorizedDomainError(err) ||
        isFirebaseConfigOrDomainError(err) ||
        code === 'auth/unauthorized-domain' ||
        msg.includes('unauthorized-domain') ||
        msg.includes('auth/unauthorized-domain') ||
        msg.includes('origin_mismatch')
      ) {
        setShowFirebaseDomainHelper(true);
      } else if (
        code === 'auth/popup-blocked' ||
        msg.includes('popup-blocked') ||
        msg.includes('blocked by the browser')
      ) {
        setError('Popup was blocked by your browser. Please allow popups or use email sign-in.');
      } else if (
        code === 'auth/popup-closed-by-user' ||
        msg.includes('popup-closed') ||
        msg.includes('closed-by-user')
      ) {
        // User voluntarily dismissed popup
        setError(null);
      } else {
        setError(msg || 'Google sign-in could not be completed. Please try email sign-in.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('admin@virasat.in', 'AdminVirasat2026!');
    } catch (err: any) {
      setError(err?.message || 'Quick login failed. Please sign in with email.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validations
    if (isRegister) {
      if (!name.trim() || name.trim().length < 2) {
        setError('Please enter your full name (minimum 2 characters).');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(name.trim(), email.trim().toLowerCase(), password, homeCity);
      } else {
        await login(email.trim().toLowerCase(), password);
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('USER_EXISTS') || msg.includes('already exists')) {
        setError('An account with this email already exists. Please switch to Sign In.');
      } else if (msg.includes('INVALID_CREDENTIALS') || msg.includes('Invalid email or password')) {
        setError('Invalid email or password. Please verify your credentials.');
      } else {
        setError(msg || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto"
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
        className="relative w-full max-w-[420px] my-auto max-h-[calc(100vh-2rem)] flex flex-col rounded-3xl bg-[#FAF8F5] border border-stone-200/90 p-6 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 overflow-y-auto"
      >
        {/* Close button with accessible 44px touch area */}
        <button
          id="auth-modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 border border-transparent hover:border-stone-200 transition focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-1 pr-6 pl-6 sm:pr-0 sm:pl-0 space-y-1">
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            {isRegister ? 'Create Virasat Account' : 'Welcome to Virasat'}
          </h2>

          <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
            {isRegister
              ? 'Save custom itineraries, bookmark heritage sites & explore India.'
              : 'Sign in to access your saved trips, favorites & personalized guides.'}
          </p>
        </div>

        {/* Compact, Centered Segmented Tabs */}
        <div className="flex p-1 bg-stone-200/70 rounded-xl border border-stone-200 max-w-[210px] mx-auto select-none">
          <button
            type="button"
            id="auth-tab-signin"
            onClick={() => {
              setIsRegister(false);
              setError(null);
              setShowFirebaseDomainHelper(false);
            }}
            className={`flex-1 py-1.5 px-3 text-[11.5px] font-bold rounded-lg transition-all cursor-pointer ${
              !isRegister
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900'
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
              setShowFirebaseDomainHelper(false);
            }}
            className={`flex-1 py-1.5 px-3 text-[11.5px] font-bold rounded-lg transition-all cursor-pointer ${
              isRegister
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Google Sign In / Create Account Button */}
        <button
          id="google-signin-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full min-h-[44px] rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:scale-[0.99] px-4 py-2.5 text-xs sm:text-[13px] font-semibold text-stone-700 shadow-2xs transition flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
        >
          {googleLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
              <span>Opening Google Sign-In…</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isRegister ? 'Sign Up with Google' : 'Sign In with Google'}</span>
            </>
          )}
        </button>

        {/* Firebase Domain Authorization Helper with Instant 1-Click Fallback */}
        {showFirebaseDomainHelper && (
          <div className="p-3.5 rounded-2xl bg-amber-50/95 border border-amber-200 text-amber-950 space-y-3 text-xs animate-fadeIn shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Firebase Domain Authorization Needed</span>
            </div>

            <p className="text-[11.5px] text-amber-900 leading-relaxed">
              Google Sign-In blocked this request because <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono text-[10.5px] border border-amber-300 font-semibold">{currentDomain}</code> is not yet added in your Firebase Console.
            </p>

            <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-[11px] text-amber-950 space-y-1">
              <div className="font-semibold text-amber-900">How to authorize:</div>
              <div>1. Go to <strong>Firebase Console</strong> → <strong>Authentication</strong> → <strong>Settings</strong> → <strong>Authorized domains</strong></div>
              <div>2. Click <strong>Add domain</strong> and enter: <code className="px-1 bg-amber-100 rounded font-mono font-bold text-amber-900">{currentDomain}</code></div>
            </div>

            <div className="flex flex-col gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={loading}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-amber-200" />
                <span>Instant 1-Click Sign In (Admin / Demo)</span>
              </button>

              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition text-center"
              >
                <span>Open Firebase Console</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </a>
            </div>
          </div>
        )}

        {/* Error Alert with Dismiss */}
        {error && !showFirebaseDomainHelper && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-700 p-0.5 cursor-pointer"
              aria-label="Dismiss error"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Divider with Spacious Margin */}
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative px-3 bg-[#FAF8F5] text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            {isRegister ? 'Or register with email' : 'Or sign in with email'}
          </div>
        </div>

        {/* Form with Clean Spacing */}
        <form id="auth-modal-form" onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div className="space-y-1">
              <label
                htmlFor="auth-name-input"
                className="text-[11px] font-bold text-stone-700 uppercase tracking-wide block"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-[13px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-2xs"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="auth-email-input"
              className="text-[11px] font-bold text-stone-700 uppercase tracking-wide block"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="aarav@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-[13px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="auth-password-input"
                className="text-[11px] font-bold text-stone-700 uppercase tracking-wide block"
              >
                Password
              </label>
              {isRegister && (
                <span className="text-[10px] text-stone-400 font-medium">Min. 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-[13px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition shadow-2xs"
              />
              <button
                id="auth-toggle-password-btn"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 rounded-lg text-stone-400 hover:text-stone-700 transition cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1">
              <label
                htmlFor="auth-home-city-select"
                className="text-[11px] font-bold text-stone-700 uppercase tracking-wide block"
              >
                Home City (Base Hub)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
                <select
                  id="auth-home-city-select"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-[13px] text-stone-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition cursor-pointer shadow-2xs"
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

          {/* Sign In / Sign Up Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>{isRegister ? 'Sign Up & Continue' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Toggle Login/Register Mode */}
        <div className="text-center pt-3 border-t border-stone-200">
          <p className="text-xs text-stone-500">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  id="auth-switch-mode-btn"
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError(null);
                    setShowFirebaseDomainHelper(false);
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
                    setShowFirebaseDomainHelper(false);
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

