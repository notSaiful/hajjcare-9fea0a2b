import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

function getVisitorId(): string {
  const key = "hajjcare_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
    localStorage.setItem(key, id);
  }
  return id;
}

export function useAppAnalytics() {
  useEffect(() => {
    const visitorId = getVisitorId();
    const sessionKey = "hajjcare_visit_logged";

    // Log visit once per session
    if (!sessionStorage.getItem(sessionKey)) {
      supabase
        .from("app_analytics")
        .insert({
          event_type: "visit",
          visitor_id: visitorId,
          user_agent: navigator.userAgent?.substring(0, 200),
        })
        .then(() => {
          sessionStorage.setItem(sessionKey, "1");
        });
    }

    // Track PWA install
    const handleInstall = () => {
      supabase.from("app_analytics").insert({
        event_type: "pwa_install",
        visitor_id: visitorId,
        user_agent: navigator.userAgent?.substring(0, 200),
      });
    };

    window.addEventListener("appinstalled", handleInstall);
    return () => window.removeEventListener("appinstalled", handleInstall);
  }, []);
}
