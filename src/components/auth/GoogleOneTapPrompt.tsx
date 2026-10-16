import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronRight, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { safeLocalStorage } from '../../utils/storage';

interface RememberedGoogleAccount {
  email: string;
  name: string;
  picture?: string;
}

export const GoogleOneTapPrompt: React.FC = () => {
  const { user, openGoogleChooser, loginWithGoogleDirect } = useAuth();
  const [visible, setVisible] = useState(false);
  const [account, setAccount] = useState<RememberedGoogleAccount>({
    name: 'Heritage Explorer',
    email: 'traveler.india@gmail.com',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already authenticated, don't show
    if (user) {
      setVisible(false);
      return;
    }

    // Check if dismissed in current session
    try {
      const isDismissed = sessionStorage.getItem('virasat_onetap_dismissed');
      if (isDismissed) return;

      const stored = safeLocalStorage.getItem('virasat_remembered_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAccount(parsed[0]);
        }
      }
    } catch (e) {
      // ignore
    }

    // Gentle delay like real Google One Tap
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [user]);

  const handleDismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem('virasat_onetap_dismissed', 'true');
    } catch (e) {
      // ignore
    }
  };

  const handleQuickSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogleDirect({
        email: account.email,
        name: account.name,
        picture: account.picture,
        home_city: 'Navi Mumbai',
      });
      setVisible(false);
    } catch (err) {
      console.warn('One tap sign-in error:', err);
      // Fallback to chooser
      openGoogleChooser('signin');
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  if (!visible || user) return null;

  return (
    <div
      id="google-onetap-bar"
      aria-label="Google One Tap Sign In"
      className="fixed top-18 right-3 sm:right-6 z-[1200] max-w-[370px] w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-4 transition-all animate-fadeIn"
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header with Google Brand & Close */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          {/* Official Google G Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span className="text-xs font-semibold text-stone-800">
            Sign in to Virasat with Google
          </span>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition cursor-pointer"
          aria-label="Dismiss Google prompt"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Account Row */}
      <div className="py-3 flex items-center gap-3">
        {account.picture ? (
          <img
            src={account.picture}
            alt={account.name}
            className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1a73e8] font-bold text-sm flex items-center justify-center shrink-0">
            {account.name.charAt(0)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-stone-900 truncate">
            {account.name}
          </div>
          <div className="text-[11px] text-stone-500 truncate">
            {account.email}
          </div>
          <div className="text-[10px] text-orange-700 font-medium flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5" />
            <span>Kharghar &amp; Panvel 50km Itineraries</span>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <button
        type="button"
        onClick={handleQuickSignIn}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] active:scale-[0.99] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        <span>Continue as {account.name.split(' ')[0]}</span>
      </button>

      {/* Secondary Switch Account / Custom Link */}
      <div className="pt-2.5 text-center flex items-center justify-between text-[11px] text-stone-500">
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            openGoogleChooser('signin');
          }}
          className="text-[#1a73e8] hover:underline font-medium cursor-pointer"
        >
          Use another account
        </button>

        <span className="text-[10px] text-stone-400">
          🔒 Secure 1-tap Google Auth
        </span>
      </div>
    </div>
  );
};
