import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { UserProfile, OnboardingSurvey } from '../types';
import { api } from '../services/api';
import { safeLocalStorage } from '../utils/storage';
import {
  auth,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  signOutFirebase,
  syncUserProfileToFirestore,
} from '../services/firebase';


interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  loginWithGoogleDirect: (googleProfile: { id_token?: string; email: string; name?: string; picture?: string; home_city?: string }) => Promise<void>;
  register: (name: string, email: string, password: string, home_city?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  saveSurvey: (survey: OnboardingSurvey) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const popupInProgress = useRef(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && !popupInProgress.current) {
        try {
          const result = await api.loginWithGoogle({ id_token: await fbUser.getIdToken(), token_type: 'firebase' });
          setUser(result.profile);
        } catch (err) {
          console.warn('Firestore profile sync error:', err);
        }
      }
      setLoading(false);
    });

    // Also check backend session
    const initBackendAuth = async () => {
      try {
        const token = safeLocalStorage.getItem('virasat_token');
        if (token && !user) {
          const profile = await api.getProfile();
          if (profile) setUser(profile);
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        safeLocalStorage.removeItem('virasat_token');
      } finally {
        setLoading(false);
      }
    };
    initBackendAuth();

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.profile);
    if (res.profile) {
      syncUserProfileToFirestore(res.profile).catch(() => {});
    }
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async () => {
    popupInProgress.current = true;
    setLoading(true);
    try {
      const result = await signInWithGooglePopup();
      const backendRes = await api.loginWithGoogle({ id_token: await result.user.getIdToken(), token_type: 'firebase' });
      const profile = backendRes.profile;
      setUser(profile);

      // Save remembered Google account locally
      try {
        const stored = safeLocalStorage.getItem('virasat_remembered_google_accounts');
        const existing: Array<{ email: string; name: string; picture?: string; lastUsed: number }> = stored ? JSON.parse(stored) : [];
        const filtered = existing.filter((a) => a.email.toLowerCase() !== profile.email.toLowerCase());
        filtered.unshift({
          email: profile.email,
          name: profile.name,
          picture: profile.avatar_url,
          lastUsed: Date.now(),
        });
        safeLocalStorage.setItem('virasat_remembered_google_accounts', JSON.stringify(filtered.slice(0, 5)));
      } catch (e) {
        // safe ignore
      }

      // Background Firestore profile mirror
      syncUserProfileToFirestore(profile).catch(() => {});

      setIsAuthModalOpen(false);
      if (!profile.survey || Object.keys(profile.survey).length === 0) {
        setIsOnboardingModalOpen(true);
      }
    } catch (err: any) {
      console.warn('Google sign-in failed.');
      throw err;
    } finally {
      popupInProgress.current = false;
      setLoading(false);
    }
  };

  const loginWithGoogleDirect = async (googleProfile: { id_token?: string; email: string; name?: string; picture?: string; home_city?: string }) => {
    setLoading(true);
    try {
      if (!googleProfile.id_token) { await loginWithGoogle(); return; }
      const res = await api.loginWithGoogle({ id_token: googleProfile.id_token, token_type: 'google' });

      setUser(res.profile);

      // Save remembered Google account locally for instant 1-tap fast switching
      try {
        const stored = safeLocalStorage.getItem('virasat_remembered_google_accounts');
        const existing: Array<{ email: string; name: string; picture?: string; lastUsed: number }> = stored ? JSON.parse(stored) : [];
        const filtered = existing.filter((a) => a.email.toLowerCase() !== res.profile.email.toLowerCase());
        filtered.unshift({
          email: res.profile.email,
          name: res.profile.name,
          picture: res.profile.avatar_url,
          lastUsed: Date.now(),
        });
        safeLocalStorage.setItem('virasat_remembered_google_accounts', JSON.stringify(filtered.slice(0, 5)));
      } catch (e) {
        // safe ignore storage parse
      }

      // Attempt background firestore sync if possible
      syncUserProfileToFirestore(res.profile).catch(() => {});

      setIsAuthModalOpen(false);
      if (!res.profile.survey || Object.keys(res.profile.survey).length === 0) {
        setIsOnboardingModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleRedirect = async () => {
    await signInWithGoogleRedirect();
  };

  const register = async (name: string, email: string, password: string, home_city?: string) => {
    const res = await api.register(name, email, password, home_city);
    setUser(res.profile);
    if (res.profile) {
      syncUserProfileToFirestore(res.profile).catch(() => {});
    }
    setIsAuthModalOpen(false);
    setIsOnboardingModalOpen(true);
  };

  const logout = async () => {
    try {
      await signOutFirebase();
    } catch (err) {
      console.warn('Firebase signOut err:', err);
    }
    safeLocalStorage.removeItem('virasat_token');
    setUser(null);
    setFirebaseUser(null);
  };

  const updateProfile = async (profile: UserProfile) => {
    setUser(profile);
    try {
      await syncUserProfileToFirestore(profile);
    } catch (e) {
      console.warn('Firestore updateProfile err:', e);
    }
    try {
      const updated = await api.updateProfile(profile);
      if (updated) setUser(updated);
    } catch (e) {
      console.warn('API updateProfile err:', e);
    }
  };

  const saveSurvey = async (survey: OnboardingSurvey) => {
    if (user) {
      const updated: UserProfile = { ...user, survey };
      setUser(updated);
      syncUserProfileToFirestore(updated).catch(() => {});
    }
    try {
      const res = await api.saveSurvey(survey);
      if (res) setUser(res);
    } catch (e) {
      console.warn('API saveSurvey err:', e);
    }
    setIsOnboardingModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        loginWithGoogle,
        loginWithGoogleRedirect,
        loginWithGoogleDirect,
        register,
        logout,
        updateProfile,
        saveSurvey,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
