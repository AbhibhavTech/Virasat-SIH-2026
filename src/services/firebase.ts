import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
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
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { UserProfile, TripItem, FavoriteItem } from '../types';
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

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: The app will break without specifying firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
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
    console.log('Firestore connected successfully to database:', firebaseConfig.firestoreDatabaseId);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    // Non-blocking test
    return false;
  }
}

// Run connection check
testFirestoreConnection();

/**
 * Sign in using Google Popup (recommended for AI Studio sandbox)
 */
export async function signInWithGooglePopup() {
  return await signInWithPopup(auth, googleProvider);
}

/**
 * Sign out from Firebase Auth
 */
export async function signOutFirebase() {
  return await firebaseSignOut(auth);
}

/**
 * Sync user profile to Firestore (/users/{userId})
 */
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  const path = `users/${profile.id}`;
  try {
    const userRef = doc(db, 'users', profile.id);
    const existingSnap = await getDoc(userRef);
    const now = new Date().toISOString();

    const data: Record<string, any> = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role || 'traveller',
      avatar_url: profile.avatar_url || '',
      home_city: profile.home_city || 'Mumbai',
      travel_style: profile.travel_style || '',
      updated_at: now,
    };

    if (!existingSnap.exists()) {
      data.created_at = profile.created_at || now;
    } else {
      const existingData = existingSnap.data();
      data.created_at = existingData?.created_at || now;
      if (existingData?.role === 'admin') {
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
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Save user trip to Firestore (/users/{userId}/trips/{tripId})
 */
export async function saveTripToFirestore(userId: string, trip: TripItem): Promise<void> {
  const path = `users/${userId}/trips/${trip.id}`;
  try {
    const tripRef = doc(db, 'users', userId, 'trips', trip.id);
    const payload = {
      id: trip.id,
      userId,
      title: trip.title,
      city: trip.city,
      duration_hours: Number(trip.duration_hours) || 0,
      total_places: Number(trip.total_places || trip.stops?.length) || 0,
      estimated_cost: Number(trip.estimated_cost) || 0,
      created_at: trip.created_at || new Date().toISOString(),
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
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Delete a trip from Firestore
 */
export async function deleteTripFromFirestore(userId: string, tripId: string): Promise<void> {
  const path = `users/${userId}/trips/${tripId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'trips', tripId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Add favorite to Firestore (/users/{userId}/favorites/{placeId})
 */
export async function addFavoriteToFirestore(userId: string, placeId: string): Promise<void> {
  const path = `users/${userId}/favorites/${placeId}`;
  try {
    const favRef = doc(db, 'users', userId, 'favorites', placeId);
    await setDoc(favRef, {
      id: placeId,
      userId,
      place_id: placeId,
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
  const path = `users/${userId}/favorites/${placeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'favorites', placeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Get all favorites from Firestore for a user
 */
export async function getFavoritesFromFirestore(userId: string): Promise<string[]> {
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
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
