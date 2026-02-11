import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setIsSupported(supported);

    if (supported && user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration("/sw.js");
      if (registration) {
        const subscription = await (registration as any).pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    } catch (err) {
      console.error("Error checking push subscription:", err);
    }
  };

  const subscribe = useCallback(async () => {
    if (!user || !isSupported) return false;
    setIsLoading(true);

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Get VAPID key from edge function
      const { data: vapidData, error: vapidError } = await supabase.functions.invoke(
        "get-vapid-key"
      );
      if (vapidError || !vapidData?.vapidPublicKey) {
        throw new Error("Failed to get VAPID key");
      }

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return false;
      }

      // Subscribe to push
      const subscription = await (registration as any).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidData.vapidPublicKey),
      });

      const json = subscription.toJSON();
      const p256dh = json.keys?.p256dh || "";
      const auth = json.keys?.auth || "";

      // Save to database
      const { error } = await supabase.from("push_subscriptions").insert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh,
        auth,
      });

      if (error) throw error;

      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error("Push subscription error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.getRegistration("/sw.js");
      if (registration) {
        const subscription = await (registration as any).pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", subscription.endpoint);
        }
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error("Push unsubscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return { isSupported, isSubscribed, isLoading, subscribe, unsubscribe };
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
