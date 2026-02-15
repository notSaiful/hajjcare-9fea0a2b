import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ZoneRisk {
  zone: string;
  risk_level: "low" | "medium" | "high" | "critical";
  density_pct: number;
  stampede_probability: number;
  factors: string[];
}

export interface EmergencyQueueItem {
  id: string;
  urgency: string;
  zone: string;
  description: string;
  wait_minutes: number;
  status: string;
}

export interface VolunteerAllocation {
  zone: string;
  current: number;
  needed: number;
  gap: number;
  priority: string;
}

export interface MedicalPrediction {
  risk: string;
  probability: string;
  zone: string;
  preventive_action: string;
}

export interface CommandData {
  density: {
    total_tracked: number;
    by_zone: Record<string, number>;
    zone_statuses: Record<string, Record<string, number>>;
    emergency_count: number;
  };
  alerts: {
    total: number;
    critical: number;
    by_type: Record<string, number>;
    by_severity: Record<string, number>;
  };
  health: {
    open_tickets: number;
    critical: number;
    queue: EmergencyQueueItem[];
  };
  volunteers: {
    total_available: number;
    active_assignments: number;
    by_zone: Record<string, number>;
  };
  geofence_zones: Array<{
    name: string;
    type: string;
    center: { lat: number; lng: number };
    radius: number;
  }>;
  ai_analysis?: {
    situation_level: "green" | "yellow" | "orange" | "red";
    executive_summary: string;
    zone_risks: ZoneRisk[];
    emergency_queue: any[];
    volunteer_allocation: VolunteerAllocation[];
    medical_predictions: MedicalPrediction[];
    crowd_analysis: {
      total_tracked: number;
      peak_zones: string[];
      flow_direction: string;
      bottleneck_zones: string[];
    };
    auto_actions: string[];
  } | null;
  generated_at: string;
}

export function useNationalCommand() {
  const [data, setData] = useState<CommandData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const channelRef = useRef<any>(null);

  const fetchData = useCallback(async (action: "full" | "raw" = "full") => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "national-command",
        { body: { action } }
      );
      if (fnError) throw fnError;
      setData(result);
      return result as CommandData;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch command data";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Realtime subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel("national-command-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "member_locations" }, () => {
        // Debounced refresh on location changes
        setIsLive(true);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "health_tickets" }, () => {
        setIsLive(true);
      })
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-refresh when live changes detected
  useEffect(() => {
    if (!isLive) return;
    const timer = setTimeout(() => {
      fetchData("raw"); // Use raw for faster realtime updates
      setIsLive(false);
    }, 3000); // 3s debounce
    return () => clearTimeout(timer);
  }, [isLive, fetchData]);

  const situationColor = data?.ai_analysis?.situation_level
    ? { green: "text-green-500", yellow: "text-yellow-500", orange: "text-orange-500", red: "text-red-500" }[data.ai_analysis.situation_level]
    : "text-muted-foreground";

  const situationBg = data?.ai_analysis?.situation_level
    ? { green: "bg-green-500/10 border-green-500/30", yellow: "bg-yellow-500/10 border-yellow-500/30", orange: "bg-orange-500/10 border-orange-500/30", red: "bg-red-500/10 border-red-500/30" }[data.ai_analysis.situation_level]
    : "bg-muted/50 border-border";

  return { data, isLoading, error, fetchData, situationColor, situationBg, isLive };
}
