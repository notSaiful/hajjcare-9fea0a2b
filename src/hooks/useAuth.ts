import { useState, useEffect, useCallback } from "react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import {
  FIREBASE_AUTH_RETURN_URL,
  isFirebaseAuthReady,
  resendFirebaseVerification,
  sendFirebasePasswordReset,
  signInWithFirebase,
  signOutFromFirebase,
  signUpWithFirebase,
} from "@/integrations/firebase/auth";

const shouldRetryAuthRequest = (error: { message?: string; status?: number } | null) => {
  if (!error) return false;
  const message = error.message?.toLowerCase() ?? "";
  return error.status === undefined || error.status >= 500 || /network|fetch|timeout|temporar/.test(message);
};

const waitForRetry = (attempt: number) => new Promise<void>((resolve) => window.setTimeout(resolve, 400 * (attempt + 1)));

const syncFirebaseAuth = isFirebaseAuthReady;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const finish = (nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        finish(session);
      }
    );

    // Never leave the app blocked if an embedded browser cannot complete the
    // initial auth check. Public pages can safely render as signed out.
    const timeout = window.setTimeout(() => finish(null), 3500);

    // THEN check for an existing session
    supabase.auth.getSession()
      .then(({ data: { session } }) => finish(session))
      .catch(() => finish(null))
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string, embarkationPoint?: string) => {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: new Error("Authentication service is not configured. Please contact HajCare support."),
      };
    }

    const redirectUrl = FIREBASE_AUTH_RETURN_URL;
    
    let result: Awaited<ReturnType<typeof supabase.auth.signUp>> | undefined;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              embarkation_point: embarkationPoint,
            },
          },
        });

        if (!result.error || !shouldRetryAuthRequest(result.error) || attempt === 1) break;
        console.warn("HajCare signup request failed temporarily; retrying.", { status: result.error.status, message: result.error.message });
      } catch (error) {
        console.error("HajCare signup request failed.", error);
        if (attempt === 1) throw error;
      }
      await waitForRetry(attempt);
    }

    if (!result) throw new Error("Unable to contact the authentication service.");
    const { data, error } = result;

    // Keep Firebase accounts in sync while Supabase remains the session/RLS
    // authority used by existing HajCare pages and edge functions.
    let requiresEmailVerification = false;
    if (!error && syncFirebaseAuth) {
      try {
        await signUpWithFirebase(email, password, fullName);
        requiresEmailVerification = true;
      } catch (firebaseError) {
        console.error("Firebase signup or verification email failed.", firebaseError);
        await signOutFromFirebase();
        return {
          data,
          error: firebaseError instanceof Error ? firebaseError : new Error("Unable to send the verification email."),
        };
      }
    }

    // Update profile with embarkation point after successful signup
    if (!error && data.user && embarkationPoint) {
      await supabase
        .from("profiles")
        .update({ embarkation_point: embarkationPoint })
        .eq("user_id", data.user.id);
    }

    if (requiresEmailVerification) {
      // Supabase remains the data/session authority, but users must not be
      // admitted until Firebase email verification is complete.
      await supabase.auth.signOut();
      await signOutFromFirebase();
    }

    return { data, error, requiresEmailVerification };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        data: null,
        error: new Error("Authentication service is not configured. Please contact HajCare support."),
      };
    }

    let result: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>> | undefined;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        result = await supabase.auth.signInWithPassword({ email, password });
        if (!result.error || !shouldRetryAuthRequest(result.error) || attempt === 1) break;
        console.warn("HajCare sign-in request failed temporarily; retrying.", { status: result.error.status, message: result.error.message });
      } catch (error) {
        console.error("HajCare sign-in request failed.", error);
        if (attempt === 1) throw error;
      }
      await waitForRetry(attempt);
    }
    if (!result) throw new Error("Unable to contact the authentication service.");

    if (!result.error && syncFirebaseAuth) {
      try {
        await signInWithFirebase(email, password);
      } catch (firebaseError) {
        console.error("Firebase sign-in or email verification failed.", firebaseError);
        await supabase.auth.signOut();
        return {
          data: null,
          error: firebaseError instanceof Error ? firebaseError : new Error("Firebase sign-in failed."),
        };
      }
    }
    return result;
  }, []);

  const resendVerificationEmail = useCallback(async (email: string, password: string) => {
    if (!syncFirebaseAuth) {
      return { alreadyVerified: false, error: new Error("Firebase Authentication is not enabled for this deployment.") };
    }

    try {
      const result = await resendFirebaseVerification(email, password);
      return { ...result, error: null };
    } catch (error) {
      console.error("Firebase verification email resend failed.", error);
      return {
        alreadyVerified: false,
        error: error instanceof Error ? error : new Error("Unable to resend the verification email."),
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (!error && syncFirebaseAuth) {
      try {
        await signOutFromFirebase();
      } catch (firebaseError) {
        console.warn("Firebase sign-out sync failed.", firebaseError);
      }
    }
    return { error };
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const supabaseResult = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (!supabaseResult.error && syncFirebaseAuth) {
      try {
        await sendFirebasePasswordReset(email);
      } catch (firebaseError) {
        console.warn("Firebase password reset sync failed; Supabase reset email was sent.", firebaseError);
      }
    }

    return supabaseResult;
  }, []);

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    resendVerificationEmail,
    signOut,
    resetPassword,
    isAuthenticated: !!session,
  };
};
