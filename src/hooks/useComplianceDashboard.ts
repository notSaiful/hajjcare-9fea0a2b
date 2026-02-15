import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ComplianceOverview {
  total_audit_logs: number;
  total_consent_records: number;
  total_dsar_requests: number;
  total_breaches: number;
  total_encryption_keys: number;
  total_backups: number;
  dsar_overdue: number;
  consent_by_purpose: Record<string, { granted: number; withdrawn: number }>;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  actor_id: string | null;
  data_categories: string[] | null;
  purpose: string | null;
  outcome: string;
  created_at: string;
}

export interface ConsentRecord {
  id: string;
  user_id: string;
  purpose: string;
  status: string;
  granted_at: string;
  withdrawn_at: string | null;
  expires_at: string | null;
  lawful_basis: string;
  consent_version: string;
  cross_border_transfer: boolean;
}

export interface DsarRequest {
  id: string;
  user_id: string;
  request_type: string;
  status: string;
  submitted_at: string;
  due_by: string;
  completed_at: string | null;
  identity_verified: boolean;
}

export interface BreachEntry {
  id: string;
  title: string;
  severity: string;
  status: string;
  breach_type: string;
  detected_at: string;
  affected_users_count: number | null;
  cross_border_impact: boolean;
}

export interface DataLineage {
  audited_tables: string[];
  trigger_function: string;
  data_categories: Record<string, string[]>;
  retention_policies: Record<string, string>;
  encryption: { at_rest: string; in_transit: string; key_rotation: string };
}

export interface ComplianceData {
  overview: ComplianceOverview;
  recent_audit_logs: AuditLogEntry[];
  data_lineage: DataLineage;
  generated_at: string;
}

export function useComplianceDashboard() {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [dsarRequests, setDsarRequests] = useState<DsarRequest[]>([]);
  const [breaches, setBreaches] = useState<BreachEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSection = useCallback(async (section: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke(
        "compliance-dashboard",
        { body: { section } }
      );
      if (fnError) throw fnError;

      if (section === "overview") setData(result);
      else if (section === "audit_logs") setAuditLogs(result.audit_logs || []);
      else if (section === "consent") setConsentRecords(result.consent_records || []);
      else if (section === "dsar") setDsarRequests(result.dsar_requests || []);
      else if (section === "breaches") setBreaches(result.breaches || []);

      return result;
    } catch (err: any) {
      setError(err?.message || "Failed to fetch compliance data");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data, auditLogs, consentRecords, dsarRequests, breaches,
    isLoading, error, fetchSection,
  };
}
