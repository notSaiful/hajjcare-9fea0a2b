import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

const requiredConfig: FirebaseWebConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() || undefined,
};

export const isFirebaseConfigured = Object.values(requiredConfig)
  .filter((value) => value !== undefined)
  .every(Boolean);

/**
 * Optional Firebase bridge. Supabase remains HajCare's source of truth until
 * each Firebase product is explicitly enabled, secured, and migrated.
 */
export const firebaseApp: FirebaseApp | null = isFirebaseConfigured
  ? (getApps().length ? getApp() : initializeApp(requiredConfig))
  : null;

/**
 * Firebase Authentication is opt-in so the existing Supabase session and RLS
 * remain the source of truth until the backend migration is complete. Set
 * VITE_FIREBASE_AUTH_ENABLED=true in the deployment environment to enable the
 * dual-write authentication bridge.
 */
export const isFirebaseAuthEnabled =
  Boolean(firebaseApp) && import.meta.env.VITE_FIREBASE_AUTH_ENABLED === "true";

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
