import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Client-side hook for Data Protection Compliance
 *
 * Provides:
 *  - Consent management (grant/withdraw/list)
 *  - Data Subject Requests (access, erasure, portability)
 *  - Data export
 *
 * Compliant with: India DPDP Act 2023, Saudi PDPL, ISO 27001, SOC2
 */

export interface ConsentRecord {
  id: string;
  purpose: string;
  status: "granted" | "withdrawn" | "expired";
  granted_at: string;
  withdrawn_at: string | null;
  expires_at: string | null;
  consent_version: string;
  cross_border_transfer: boolean;
}

export interface DSARRequest {
  request_id: string;
  due_by: string;
  message?: string;
}

export function useDataCompliance() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);

  const invoke = useCallback(
    async (action: string, extra: Record<string, unknown> = {}) => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("data-compliance", {
          body: { action, ...extra },
        });
        if (error) throw error;
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ─── Consent Management ───

  const grantConsent = useCallback(
    async (
      purpose: string,
      options?: {
        crossBorderTransfer?: boolean;
        transferDestination?: string;
        expiresInDays?: number;
      }
    ) => {
      return invoke("grant_consent", {
        purpose,
        cross_border_transfer: options?.crossBorderTransfer,
        transfer_destination: options?.transferDestination,
        expires_in_days: options?.expiresInDays,
      });
    },
    [invoke]
  );

  const withdrawConsent = useCallback(
    async (purpose: string) => {
      return invoke("withdraw_consent", { purpose });
    },
    [invoke]
  );

  const loadConsents = useCallback(async () => {
    const result = await invoke("list_consents");
    if (result?.consents) {
      setConsents(result.consents);
    }
    return result?.consents || [];
  }, [invoke]);

  const hasActiveConsent = useCallback(
    (purpose: string): boolean => {
      const latest = consents
        .filter((c) => c.purpose === purpose)
        .sort((a, b) => new Date(b.granted_at).getTime() - new Date(a.granted_at).getTime())[0];

      if (!latest) return false;
      if (latest.status !== "granted") return false;
      if (latest.expires_at && new Date(latest.expires_at) < new Date()) return false;
      return true;
    },
    [consents]
  );

  // ─── Data Subject Access Requests (DSAR) ───

  const requestDataAccess = useCallback(
    async (scope: string[] = ["all"]): Promise<DSARRequest> => {
      return invoke("submit_dsar", {
        request_type: "access",
        description: "Request to access all personal data",
        scope,
      });
    },
    [invoke]
  );

  const requestDataErasure = useCallback(
    async (reason?: string): Promise<DSARRequest> => {
      return invoke("request_erasure", { reason });
    },
    [invoke]
  );

  const requestDataPortability = useCallback(
    async (format: "json" | "csv" = "json"): Promise<DSARRequest> => {
      return invoke("submit_dsar", {
        request_type: "portability",
        description: `Request data export in ${format} format`,
        scope: ["all"],
      });
    },
    [invoke]
  );

  const exportMyData = useCallback(
    async (format: "json" | "csv" = "json") => {
      return invoke("export_data", { format });
    },
    [invoke]
  );

  // ─── Convenience: Grant multiple consents at once ───
  const grantBulkConsent = useCallback(
    async (
      purposes: string[],
      options?: { crossBorderTransfer?: boolean; expiresInDays?: number }
    ) => {
      const results = await Promise.all(
        purposes.map((purpose) => grantConsent(purpose, options))
      );
      return results;
    },
    [grantConsent]
  );

  return {
    // State
    isLoading,
    consents,

    // Consent
    grantConsent,
    withdrawConsent,
    loadConsents,
    hasActiveConsent,
    grantBulkConsent,

    // DSAR
    requestDataAccess,
    requestDataErasure,
    requestDataPortability,
    exportMyData,
  };
}
