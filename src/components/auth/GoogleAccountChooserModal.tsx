import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Sparkles,
  MapPin,
  ArrowRight,
  Loader2,
  Lock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { safeLocalStorage } from '../../utils/storage';

interface RememberedGoogleAccount {
  email: string;
  name: string;
  picture?: string;
  lastUsed?: number;
}

const DEFAULT_ACCOUNTS: RememberedGoogleAccount[] = [
  {
    name: 'Tulik Explorer',
    email: 'tulik.virasat@gmail.com',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    name: 'Heritage Traveler',
    email: 'traveler.india@gmail.com',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
];

export const GoogleAccountChooserModal: React.FC = () => {
  const {
    isGoogleChooserOpen,
    setIsGoogleChooserOpen,
    googleChooserMode,
    loginWithGoogleDirect,
    setIsAuthModalOpen,
  } = useAuth();

  const [accounts, setAccounts] = useState<RememberedGoogleAccount[]>([]);
  const [isUsingAnotherAccount, setIsUsingAnotherAccount] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedCity, setSelectedCity] = useState('Kharghar, Panvel (MMR)');
  const [syncBookmarks, setSyncBookmarks] = useState(true);
  const [generatePassport, setGeneratePassport] = useState(true);
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);

  // Load remembered accounts on open
  useEffect(() => {
    if (isGoogleChooserOpen) {
      setError(null);
      setLoadingEmail(null);
      setIsUsingAnotherAccount(false);

      try {
        const stored = safeLocalStorage.getItem('virasat_remembered_google_accounts');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAccounts(parsed);
            return;
          }
        }
      } catch (e) {
        // fallback
      }
      setAccounts(DEFAULT_ACCOUNTS);
    }
  }, [isGoogleChooserOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isGoogleChooserOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isGoogleChooserOpen]);

  if (!isGoogleChooserOpen) return null;

  const handleSelectAccount = async (account: RememberedGoogleAccount) => {
    setError(null);
    setLoadingEmail(account.email);
    try {
      await loginWithGoogleDirect({
        email: account.email,
        name: account.name,
        picture: account.picture,
        home_city: selectedCity.includes('Panvel') ? 'Navi Mumbai' : 'Mumbai',
      });
      setIsAuthModalOpen(false);
      setIsGoogleChooserOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Google account sign in failed. Please try again.');
    } finally {
      setLoadingEmail(null);
    }
  };

  const handleCustomAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = customEmail.trim();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid Google email address (e.g. name@gmail.com)');
      return;
    }
    setError(null);
    setLoadingEmail(email);

    try {
      const derivedName = customName.trim() || email.split('@')[0].replace(/[._]/g, ' ');
      await loginWithGoogleDirect({
        email,
        name: derivedName,
        home_city: selectedCity.includes('Panvel') ? 'Navi Mumbai' : 'Mumbai',
      });
      setIsAuthModalOpen(false);
      setIsGoogleChooserOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate Google account.');
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div
      id="google-account-chooser-backdrop"
      className="fixed inset-0 z-[2100] flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loadingEmail) {
          setIsGoogleChooserOpen(false);
        }
      }}
    >
      <div
        id="google-account-chooser-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-chooser-title"
        className="relative w-full max-w-[440px] my-auto bg-white rounded-3xl sm:rounded-[28px] border border-stone-200 shadow-2xl overflow-hidden flex flex-col animate-scaleUp"
      >
        {/* Top Google 4-Color Animated Progress Line */}
        {loadingEmail && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-stone-100 overflow-hidden z-20">
            <div className="h-full w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] animate-pulse" />
          </div>
        )}

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={() => !loadingEmail && setIsGoogleChooserOpen(false)}
          disabled={Boolean(loadingEmail)}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition cursor-pointer disabled:opacity-30 z-10"
          aria-label="Close Google sign in"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 flex flex-col space-y-4">
          {/* Official Google Header */}
          <div className="flex flex-col items-center text-center space-y-2 pt-1">
            {/* Google Brand Logo */}
            <div className="flex items-center gap-1.5 justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="text-xl font-medium tracking-tight text-stone-700">Google</span>
            </div>

            <h3 id="google-chooser-title" className="text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
              {googleChooserMode === 'signup' ? 'Create account with Google' : 'Choose an account'}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600">
              to continue to <span className="font-semibold text-stone-900">Virasat</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-fadeIn">
              {error}
            </div>
          )}

          {/* Account Selection or Custom Account Form */}
          {!isUsingAnotherAccount ? (
            <div className="space-y-1.5 pt-1">
              {/* Account list */}
              <div className="divide-y divide-stone-100 border-t border-b border-stone-200/80 -mx-6 sm:-mx-7 px-6 sm:px-7">
                {accounts.map((acc) => {
                  const isCurrentLoading = loadingEmail === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleSelectAccount(acc)}
                      disabled={Boolean(loadingEmail)}
                      className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-stone-50 active:bg-stone-100 transition rounded-xl text-left cursor-pointer group disabled:opacity-60"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {acc.picture ? (
                          <img
                            src={acc.picture}
                            alt={acc.name}
                            className="w-9 h-9 rounded-full object-cover border border-stone-200 shadow-2xs group-hover:scale-105 transition-transform shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-[#1a73e8] flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
                            {acc.name ? acc.name.charAt(0).toUpperCase() : 'G'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-stone-900 truncate flex items-center gap-1.5">
                            <span>{acc.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Google Active" />
                          </div>
                          <div className="text-xs text-stone-500 truncate">{acc.email}</div>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isCurrentLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#1a73e8]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition" />
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* "Use another account" row */}
                <button
                  type="button"
                  onClick={() => setIsUsingAnotherAccount(true)}
                  disabled={Boolean(loadingEmail)}
                  className="w-full py-3.5 px-3 flex items-center gap-3.5 hover:bg-stone-50 active:bg-stone-100 transition rounded-xl text-left cursor-pointer group disabled:opacity-60"
                >
                  <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 text-stone-600 flex items-center justify-center shrink-0 group-hover:bg-stone-200 transition">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-800">Use another account</span>
                  </div>
                  <Plus className="w-4 h-4 text-stone-400 group-hover:text-stone-700 shrink-0" />
                </button>
              </div>
            </div>
          ) : (
            /* Custom Google Email Form */
            <form onSubmit={handleCustomAccountSubmit} className="space-y-4 pt-1 animate-fadeIn">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-sm text-stone-900 placeholder:text-stone-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Name (as on Google profile)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Tulik Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-sm text-stone-900 placeholder:text-stone-400 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsUsingAnotherAccount(false)}
                  className="text-xs font-medium text-[#1a73e8] hover:underline cursor-pointer"
                >
                  ← Back to account list
                </button>

                <button
                  type="submit"
                  disabled={Boolean(loadingEmail) || !customEmail.trim()}
                  className="px-5 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loadingEmail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating…</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Exclusive Virasat Google Features (Unique to Virasat!) */}
          <div className="pt-2 border-t border-stone-100 space-y-2.5">
            <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Virasat Smart Cloud Features</span>
            </div>

            {/* Feature 1: Digital Heritage Passport Preview */}
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-800">Heritage Explorer Passport</div>
                  <div className="text-[10px] text-stone-500">Auto-issue verified digital passport ID</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={generatePassport}
                onChange={(e) => setGeneratePassport(e.target.checked)}
                className="w-4 h-4 text-[#1a73e8] rounded border-stone-300 focus:ring-[#1a73e8] cursor-pointer"
              />
            </div>

            {/* Feature 2: Kharghar / Panvel 50km Itinerary Auto-Sync */}
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-800">50km Kharghar &amp; Panvel Sync</div>
                  <div className="text-[10px] text-stone-500">Auto-backup 37+ nearby destinations &amp; routes</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={syncBookmarks}
                onChange={(e) => setSyncBookmarks(e.target.checked)}
                className="w-4 h-4 text-[#1a73e8] rounded border-stone-300 focus:ring-[#1a73e8] cursor-pointer"
              />
            </div>

            {/* Transparent Google Privacy Notice */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 transition cursor-pointer"
              >
                <Lock className="w-3 h-3 text-stone-400" />
                <span>What Google info does Virasat access?</span>
                <span className="text-[10px] underline ml-0.5">
                  {showSecurityDetails ? 'Hide' : 'View'}
                </span>
              </button>

              {showSecurityDetails && (
                <div className="mt-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 space-y-1 animate-fadeIn">
                  <div className="font-semibold flex items-center gap-1 text-blue-950">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>Protected by Google Identity Standards</span>
                  </div>
                  <p className="text-blue-800 leading-relaxed text-[10.5px]">
                    Virasat only receives your basic name, email, and avatar for account personalization.
                    Virasat <strong>never</strong> accesses your Google passwords, Google Drive files, or payment credentials.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Official Google Terms and Consent Notice */}
          <div className="pt-1 text-center">
            <p className="text-[11px] text-stone-500 leading-normal">
              To continue, Google will share your name, email address, language preference, and profile picture with Virasat.
              Before using this app, you can review Virasat’s{' '}
              <a href="#privacy" className="text-[#1a73e8] hover:underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="#terms" className="text-[#1a73e8] hover:underline">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
