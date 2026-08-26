import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from "firebase/auth";
import { firebaseAuth, isFirebaseAuthEnabled } from "./client";

export const isFirebaseAuthReady = isFirebaseAuthEnabled && Boolean(firebaseAuth);
export const FIREBASE_AUTH_RETURN_URL = "https://hajjcare.in/login";

export class FirebaseAuthFlowError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "FirebaseAuthFlowError";
  }
}

const requireAuth = () => {
  if (!isFirebaseAuthReady || !firebaseAuth) {
    throw new Error("Firebase Authentication is not enabled for this deployment.");
  }
  return firebaseAuth;
};

let persistencePromise: Promise<void> | null = null;

const ensurePersistence = async () => {
  const auth = requireAuth();
  persistencePromise ??= setPersistence(auth, browserLocalPersistence).then(() => undefined);
  await persistencePromise;
};

const verificationActionSettings = {
  url: FIREBASE_AUTH_RETURN_URL,
  handleCodeInApp: false,
};

const refreshUser = async (user: User) => {
  await reload(user);
  return user;
};

export async function signUpWithFirebase(
  email: string,
  password: string,
  displayName?: string,
): Promise<UserCredential> {
  await ensurePersistence();
  const credential = await createUserWithEmailAndPassword(requireAuth(), email, password);
  if (displayName?.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  await sendEmailVerification(credential.user, verificationActionSettings);
  return credential;
}

export async function signInWithFirebase(email: string, password: string) {
  await ensurePersistence();
  const credential = await signInWithEmailAndPassword(requireAuth(), email, password);
  const user = await refreshUser(credential.user);
  if (!user.emailVerified) {
    await signOutFromFirebase();
    throw new FirebaseAuthFlowError(
      "auth/email-not-verified",
      "Your email address is not verified. Please check your inbox or spam folder and verify your email.",
    );
  }
  return credential;
}

export async function resendFirebaseVerification(email: string, password: string) {
  await ensurePersistence();
  try {
    const credential = await signInWithEmailAndPassword(requireAuth(), email, password);
    const user = await refreshUser(credential.user);
    if (user.emailVerified) return { alreadyVerified: true };
    await sendEmailVerification(user, verificationActionSettings);
    return { alreadyVerified: false };
  } finally {
    await signOutFromFirebase();
  }
}

export function sendFirebasePasswordReset(email: string) {
  return sendPasswordResetEmail(requireAuth(), email, {
    url: FIREBASE_AUTH_RETURN_URL,
    handleCodeInApp: false,
  });
}

export function signOutFromFirebase() {
  return firebaseAuth ? signOut(firebaseAuth) : Promise.resolve();
}
