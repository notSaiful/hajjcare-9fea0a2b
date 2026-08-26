import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const FRAUD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fraud-intelligence`;

export interface FraudResult {
  operator_id: string;
  operator_name: string;
  company: string;
  fraud_probability: number;
  risk_factors: Array<{ factor: string; severity: string; description: string }>;
  recommendation: string;
  auto_blacklist_suggested: boolean;
  summary?: string;
}

export const useFraudIntelligence = () => {
  const [results, setResults] = useState<FraudResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      const response = await fetch(FRAUD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "analyze_all" }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResults(data.results || []);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeSingle = useCallback(async (operatorId: string) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      const response = await fetch(FRAUD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "analyze_single", operator_id: operatorId }),
      });

      if (!response.ok) throw new Error("Analysis failed");
      return await response.json();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { results, isLoading, error, analyzeAll, analyzeSingle };
};
