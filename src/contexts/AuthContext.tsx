import React, { createContext, useContext, useState, useEffect } from 'react';
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
  getUserProfileFromFirestore,
  isAdminEmail,
} from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  loginWithGoogleDirect: (googleProfile: { email: string; name?: string; picture?: string; home_city?: string }) => Promise<void>;
  register: (name: string, email: string, password: string, home_city?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  saveSurvey: (survey: OnboardingSurvey) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
  isGoogleChooserOpen: boolean;
  setIsGoogleChooserOpen: (open: boolean) => void;
  googleChooserMode: 'signin' | 'signup';
  setGoogleChooserMode: (mode: 'signin' | 'signup') => void;
  openGoogleChooser: (mode?: 'signin' | 'signup') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [googleChooserMode, setGoogleChooserMode] = useState<'signin' | 'signup'>('signin');

  const openGoogleChooser = (mode: 'signin' | 'signup' = 'signin') => {
    setGoogleChooserMode(mode);
    setIsGoogleChooserOpen(true);
  };

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          // Attempt restoring profile from Firestore
          const firestoreProfile = await getUserProfileFromFirestore(fbUser.uid);
          if (firestoreProfile) {
            setUser(firestoreProfile);
          } else {
            // Build and sync initial profile
            const newProfile: UserProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Virasat Traveller',
              email: fbUser.email || '',
              avatar_url: fbUser.photoURL || undefined,
              role: isAdminEmail(fbUser.email) ? 'admin' : 'traveller',
              home_city: 'Mumbai',
              created_at: new Date().toISOString(),
            };
            setUser(newProfile);
            await syncUserProfileToFirestore(newProfile).catch((e) => {
              console.warn('Initial Firestore sync warning:', e);
            });
          }
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
    try {
      // 1. Firebase Google Auth Popup
      const userCredential = await signInWithGooglePopup();
      const fbUser = userCredential.user;
      setFirebaseUser(fbUser);

      // 2. Synchronize with Firestore
      let profile: UserProfile | null = await getUserProfileFromFirestore(fbUser.uid);
      if (!profile) {
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Virasat Traveller',
          email: fbUser.email || '',
          avatar_url: fbUser.photoURL || undefined,
          role: isAdminEmail(fbUser.email) ? 'admin' : 'traveller',
          home_city: 'Mumbai',
          created_at: new Date().toISOString(),
        };
        await syncUserProfileToFirestore(profile).catch((e) => {
          console.warn('Initial Google login Firestore sync warning:', e);
        });
      }

      // 3. Mirror session to Virasat Backend for JWT persistence
      try {
        const backendRes = await api.loginWithGoogle({
          email: fbUser.email || undefined,
          name: fbUser.displayName || undefined,
          picture: fbUser.photoURL || undefined,
          sub: fbUser.uid,
        });
        if (backendRes?.profile) {
          profile = { ...profile, ...backendRes.profile };
        }
      } catch (beErr) {
        console.warn('Backend Google mirror sync warning:', beErr);
      }

      setUser(profile);
      setIsAuthModalOpen(false);
      if (!profile.survey || Object.keys(profile.survey).length === 0) {
        setIsOnboardingModalOpen(true);
      }
    } catch (firebaseErr: any) {
      // If popup was cancelled or domain unauthorized, rethrow for UI handler with context
      throw firebaseErr;
    }
  };

  const loginWithGoogleDirect = async (googleProfile: { email: string; name?: string; picture?: string; home_city?: string }) => {
    setLoading(true);
    try {
      const res = await api.loginWithGoogle({
        email: googleProfile.email,
        name: googleProfile.name || googleProfile.email.split('@')[0],
        picture: googleProfile.picture,
      });

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
      setIsGoogleChooserOpen(false);
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
        isGoogleChooserOpen,
        setIsGoogleChooserOpen,
        googleChooserMode,
        setGoogleChooserMode,
        openGoogleChooser,
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
