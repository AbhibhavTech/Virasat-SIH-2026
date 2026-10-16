import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { UserProfile, TripItem } from '../types';
import appletConfig from '../../firebase-applet-config.json';

export const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId || '',
  oAuthClientId: import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID || appletConfig.oAuthClientId,
  recaptchaSiteKey: import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY || appletConfig.recaptchaSiteKey || '',
};

export const ADMIN_EMAILS = [
  'abhibhavsinha82@gmail.com',
  'alazelersinha111@gmail.com',
  'sahilacharekar2461968@gmail.com',
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function isUnauthorizedDomainError(error: unknown): boolean {
  if (!error) return false;
  const err = error as Record<string, any>;
  const code = String(err?.code || '');
  const msg = String(err?.message || '');
  return (
    code === 'auth/unauthorized-domain' ||
    msg.includes('auth/unauthorized-domain') ||
    msg.includes('unauthorized-domain')
  );
}

export function isFirebaseConfigOrDomainError(error: unknown): boolean {
  if (!error) return false;
  const err = error as Record<string, any>;
  const code = String(err?.code || '');
  const msg = String(err?.message || '');
  return (
    code === 'auth/unauthorized-domain' ||
    code === 'auth/operation-not-allowed' ||
    code === 'auth/configuration-not-found' ||
    code === 'auth/invalid-api-key' ||
    code === 'auth/internal-error' ||
    msg.includes('auth/unauthorized-domain') ||
    msg.includes('unauthorized-domain') ||
    msg.includes('operation-not-allowed') ||
    msg.includes('configuration-not-found')
  );
}

export function isPopupBlockedError(error: unknown): boolean {
  if (!error) return false;
  const err = error as Record<string, any>;
  const code = String(err?.code || '');
  const msg = String(err?.message || '');
  return (
    code === 'auth/popup-blocked' ||
    msg.includes('auth/popup-blocked') ||
    msg.includes('popup-blocked') ||
    msg.includes('blocked by the browser')
  );
}

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Safe firestore initialization with fallback to default database if database ID is empty
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot as required by Firebase instructions
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connected successfully to database:', firebaseConfig.firestoreDatabaseId || '(default)');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    // Non-blocking test
    return false;
  }
}

// Run connection check non-blocking without unhandled rejections
testFirestoreConnection().catch(() => {});

/**
 * Sign in using Google Popup (recommended for AI Studio sandbox)
 */
export async function signInWithGooglePopup() {
  return await signInWithPopup(auth, googleProvider);
}

/** Use the same Google account picker through a full-page redirect when a
 * browser or embedded webview prevents popups. */
export async function signInWithGoogleRedirect() {
  await signInWithRedirect(auth, googleProvider);
}

/**
 * Sign out from Firebase Auth
 */
export async function signOutFirebase() {
  return await firebaseSignOut(auth);
}

function canAccessFirestoreUser(userId: string): boolean {
  if (!auth.currentUser) return false;
  if (auth.currentUser.uid === userId) return true;
  const email = (auth.currentUser.email || '').toLowerCase().trim();
  return isAdminEmail(email) && Boolean(auth.currentUser.emailVerified);
}

/**
 * Sync user profile to Firestore (/users/{userId})
 */
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  // Only sync to Firestore if Firebase Auth user is active and authorized
  if (!canAccessFirestoreUser(profile.id)) {
    return;
  }

  const path = `users/${profile.id}`;
  try {
    const userRef = doc(db, 'users', profile.id);
    const existingSnap = await getDoc(userRef);
    const now = new Date().toISOString();

    const userEmail = (auth.currentUser?.email || profile.email || '').toLowerCase().trim();
    const isUserAdmin = isAdminEmail(userEmail) && Boolean(auth.currentUser?.emailVerified);
    const safeRole = isUserAdmin ? (profile.role || 'admin') : 'traveller';

    const data: Record<string, any> = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: safeRole,
      avatar_url: profile.avatar_url || '',
      home_city: profile.home_city || 'Mumbai',
      travel_style: profile.travel_style || '',
      updated_at: now,
    };

    if (!existingSnap.exists()) {
      data.created_at = profile.created_at || now;
    } else {
      const existingData = existingSnap.data();
      data.created_at = existingData?.created_at || profile.created_at || now;
      if (existingData?.role === 'admin' || isUserAdmin) {
        data.role = 'admin';
      }
    }

    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch user profile from Firestore
 */
export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  // Only query Firestore if a Firebase Auth user is active and authorized
  if (!canAccessFirestoreUser(userId)) {
    return null;
  }

  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch {
      // Graceful fallback on read failure
    }
    return null;
  }
}

/**
 * Save user trip to Firestore (/users/{userId}/trips/{tripId})
 */
export async function saveTripToFirestore(userId: string, trip: TripItem): Promise<void> {
  if (!canAccessFirestoreUser(userId)) {
    return;
  }

  const cleanTripId = (trip.id || '').trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  if (!cleanTripId) return;

  const path = `users/${userId}/trips/${cleanTripId}`;
  try {
    const tripRef = doc(db, 'users', userId, 'trips', cleanTripId);
    const existingSnap = await getDoc(tripRef);
    const createdAt = existingSnap.exists()
      ? (existingSnap.data()?.created_at || trip.created_at || new Date().toISOString())
      : (trip.created_at || new Date().toISOString());

    const payload = {
      id: cleanTripId,
      userId,
      title: (trip.title || 'My Virasat Trip').slice(0, 160),
      city: (trip.city || 'India').slice(0, 128),
      duration_hours: Math.max(0, Math.min(720, Number(trip.duration_hours) || 0)),
      total_places: Math.max(0, Math.min(100, Number(trip.total_places || trip.stops?.length) || 0)),
      estimated_cost: Math.max(0, Math.min(10000000, Number(trip.estimated_cost) || 0)),
      created_at: String(createdAt).slice(0, 64),
    };
    await setDoc(tripRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Get trips from Firestore for a user
 */
export async function getTripsFromFirestore(userId: string): Promise<TripItem[]> {
  if (!canAccessFirestoreUser(userId)) {
    return [];
  }

  const path = `users/${userId}/trips`;
  try {
    const colRef = collection(db, 'users', userId, 'trips');
    const snapshot = await getDocs(colRef);
    const trips: TripItem[] = [];
    snapshot.forEach((docSnap) => {
      trips.push(docSnap.data() as TripItem);
    });
    return trips;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      // Graceful fallback on list failure
    }
    return [];
  }
}

/**
 * Delete a trip from Firestore
 */
export async function deleteTripFromFirestore(userId: string, tripId: string): Promise<void> {
  if (!canAccessFirestoreUser(userId)) {
    return;
  }

  const cleanTripId = (tripId || '').trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  if (!cleanTripId) return;

  const path = `users/${userId}/trips/${cleanTripId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'trips', cleanTripId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Add favorite to Firestore (/users/{userId}/favorites/{placeId})
 */
export async function addFavoriteToFirestore(userId: string, placeId: string): Promise<void> {
  if (!canAccessFirestoreUser(userId)) {
    return;
  }

  const cleanPlaceId = placeId.trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  if (!cleanPlaceId) return;

  const path = `users/${userId}/favorites/${cleanPlaceId}`;
  try {
    const favRef = doc(db, 'users', userId, 'favorites', cleanPlaceId);
    await setDoc(favRef, {
      id: cleanPlaceId,
      userId,
      place_id: cleanPlaceId,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Remove favorite from Firestore
 */
export async function removeFavoriteFromFirestore(userId: string, placeId: string): Promise<void> {
  if (!canAccessFirestoreUser(userId)) {
    return;
  }

  const cleanPlaceId = placeId.trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  if (!cleanPlaceId) return;

  const path = `users/${userId}/favorites/${cleanPlaceId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'favorites', cleanPlaceId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Get all favorites from Firestore for a user
 */
export async function getFavoritesFromFirestore(userId: string): Promise<string[]> {
  if (!canAccessFirestoreUser(userId)) {
    return [];
  }

  const path = `users/${userId}/favorites`;
  try {
    const colRef = collection(db, 'users', userId, 'favorites');
    const snapshot = await getDocs(colRef);
    const favorites: string[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.place_id) {
        favorites.push(data.place_id);
      }
    });
    return favorites;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      // Graceful fallback on list failure
    }
    return [];
  }
}
