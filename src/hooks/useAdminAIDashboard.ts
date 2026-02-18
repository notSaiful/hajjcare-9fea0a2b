import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardData {
  tracking_alerts: {
    total: number;
    critical: number;
    by_type: Record<string, number>;
  };
  health_tickets: {
    total: number;
    critical: number;
    by_zone: Record<string, number>;
  };
  fraud: {
    high_risk_operators: number;
    active_alerts: number;
    top_risks: Array<{
      operator: string;
      company: string;
      probability: number;
      auto_blacklist: boolean;
    }>;
  };
  tracking: {
    pilgrims_tracked: number;
    location_heatmap: Array<{
      lat: number;
      lng: number;
      stage: string;
      status: string;
    }>;
  };
  ai_usage: {
    total_queries_24h: number;
    by_module: Record<string, number>;
  };
  ai_analysis?: {
    risk_summary: string;
    emergency_priority: Array<{ zone: string; urgency: string; reason: string }>;
    operator_risks: Array<{ name: string; risk_level: string; action: string }>;
    recommendations: string[];
    metrics: {
      total_pilgrims_tracked: number;
      active_emergencies: number;
      fraud_alerts: number;
      health_tickets_open: number;
    };
  } | null;
  generated_at?: string;
}

const DASHBOARD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-dashboard`;

export const useAdminAIDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forbiddenError, setForbiddenError] = useState<{ statusCode: number; endpoint: string; detail: string } | null>(null);

  const fetchDashboard = useCallback(async (action: "dashboard" | "raw" = "dashboard") => {
    setIsLoading(true);
    setError(null);
    setForbiddenError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      const response = await fetch(DASHBOARD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          setForbiddenError({
            statusCode: 403,
            endpoint: "admin-ai-dashboard",
            detail: "This endpoint requires admin-level server authentication.",
          });
          return null;
        }
        if (response.status === 429) {
          setForbiddenError({
            statusCode: 429,
            endpoint: "admin-ai-dashboard",
            detail: "Rate limit reached. Please wait before retrying.",
          });
          return null;
        }
        throw new Error("Failed to fetch dashboard");
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, forbiddenError, fetchDashboard };
};
