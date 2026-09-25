import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { UserProfile, OnboardingSurvey } from '../types';
import { api } from '../services/api';
import { safeLocalStorage } from '../utils/storage';
import {
  auth,
  signInWithGooglePopup,
  signOutFirebase,
  syncUserProfileToFirestore,
  getUserProfileFromFirestore,
} from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (payload?: {
    credential?: string;
    id_token?: string;
    client_id?: string;
    user_info?: any;
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
  }) => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

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
              role: fbUser.email === 'abhibhavsinha82@gmail.com' ? 'admin' : 'traveller',
              home_city: 'Mumbai',
              created_at: new Date().toISOString(),
            };
            await syncUserProfileToFirestore(newProfile);
            setUser(newProfile);
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

  const loginWithGoogle = async (payload?: {
    credential?: string;
    id_token?: string;
    client_id?: string;
    user_info?: any;
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
  }) => {
    // If a direct Google credential/profile payload is provided, authenticate directly via backend
    if (payload && (payload.email || payload.credential || payload.id_token)) {
      const res = await api.loginWithGoogle(payload);
      if (res?.profile) {
        setUser(res.profile);
        syncUserProfileToFirestore(res.profile).catch(() => {});
        setIsAuthModalOpen(false);
        if (!res.profile.survey || Object.keys(res.profile.survey).length === 0) {
          setIsOnboardingModalOpen(true);
        }
      }
      return;
    }

    try {
      // 1. Firebase Google Auth Popup
      const userCredential = await signInWithGooglePopup();
      const fbUser = userCredential.user;
      setFirebaseUser(fbUser);

      const idToken = await fbUser.getIdToken();

      // 2. Synchronize with Firestore
      let profile: UserProfile | null = await getUserProfileFromFirestore(fbUser.uid);
      if (!profile) {
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Virasat Traveller',
          email: fbUser.email || '',
          avatar_url: fbUser.photoURL || undefined,
          role: fbUser.email === 'abhibhavsinha82@gmail.com' ? 'admin' : 'traveller',
          home_city: 'Mumbai',
          created_at: new Date().toISOString(),
        };
        await syncUserProfileToFirestore(profile);
      }
      setUser(profile);

      // 3. Mirror session to backend API if available
      try {
        const res = await api.loginWithGoogle({
          id_token: idToken,
          email: fbUser.email || undefined,
          name: fbUser.displayName || undefined,
          picture: fbUser.photoURL || undefined,
          sub: fbUser.uid,
        });
        if (res?.profile) {
          setUser(res.profile);
        }
      } catch (e) {
        console.info('Backend google mirror optional fallback:', e);
      }

      setIsAuthModalOpen(false);
      if (!profile.survey || Object.keys(profile.survey).length === 0) {
        setIsOnboardingModalOpen(true);
      }
    } catch (firebaseErr: any) {
      // If popup was cancelled or domain unauthorized, rethrow for UI handler with context
      throw firebaseErr;
    }
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
