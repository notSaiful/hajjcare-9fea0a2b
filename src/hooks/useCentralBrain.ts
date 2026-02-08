import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ActiveIncident {
  type: "tracking" | "health" | "fraud" | "crowd";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affected_count: number;
  recommended_action: string;
}

export interface Prediction {
  event: string;
  probability: "low" | "medium" | "high";
  timeframe: string;
  preventive_action: string;
}

export interface BrainAssessment {
  situation_level: "green" | "yellow" | "orange" | "red";
  executive_summary: string;
  active_incidents: ActiveIncident[];
  auto_actions_taken: string[];
  predictions: Prediction[];
  resource_allocation: {
    medical_teams_needed: number;
    priority_zones: string[];
    notification_queue: number;
  };
}

export interface BrainData {
  tracking: {
    total_alerts: number;
    critical: number;
    high: number;
    by_type: Record<string, number>;
  };
  health: {
    open_tickets: number;
    critical: number;
    by_zone: Record<string, number>;
  };
  fraud: {
    active_alerts: number;
    high_severity: number;
  };
  pilgrims: {
    total_tracked: number;
    active_groups: number;
    stage_distribution: Record<string, number>;
    status_distribution: Record<string, number>;
    emergency_count: number;
  };
  auto_actions: string[];
  ai_assessment: BrainAssessment | null;
  generated_at: string;
}

export function useCentralBrain() {
  const [data, setData] = useState<BrainData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const runAssessment = useCallback(async (mode: "assess" | "raw" = "assess") => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "central-ai-brain",
        { body: { action: mode } }
      );

      if (fnError) throw fnError;

      setData(result);
      return result as BrainData;
    } catch (err: any) {
      const msg = err?.message || "Failed to run brain assessment";
      setError(msg);
      toast({
        title: "Brain Error",
        description: msg,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const situationColor = data?.ai_assessment?.situation_level
    ? {
        green: "text-green-600",
        yellow: "text-yellow-600",
        orange: "text-orange-600",
        red: "text-red-600",
      }[data.ai_assessment.situation_level]
    : "text-muted-foreground";

  return {
    data,
    isLoading,
    error,
    runAssessment,
    situationColor,
  };
}
