import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const svc = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify admin role
    const { data: roles } = await svc.from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some(r => r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { section = "overview" } = await req.json().catch(() => ({ section: "overview" }));

    if (section === "audit_logs") {
      const { data } = await svc
        .from("data_processing_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      return new Response(JSON.stringify({ audit_logs: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (section === "consent") {
      const { data } = await svc
        .from("consent_records")
        .select("*")
        .order("granted_at", { ascending: false })
        .limit(200);
      return new Response(JSON.stringify({ consent_records: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (section === "dsar") {
      const { data } = await svc
        .from("data_subject_requests")
        .select("*")
        .order("submitted_at", { ascending: false })
        .limit(100);
      return new Response(JSON.stringify({ dsar_requests: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (section === "breaches") {
      const { data } = await svc
        .from("data_breach_log")
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(50);
      return new Response(JSON.stringify({ breaches: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (section === "encryption") {
      const { data } = await svc
        .from("encryption_key_registry")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      return new Response(JSON.stringify({ encryption_keys: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Overview: aggregate stats
    const [
      auditRes, consentRes, dsarRes, breachRes, encRes, backupRes,
      recentAuditRes, activeConsentRes,
    ] = await Promise.all([
      svc.from("data_processing_logs").select("id", { count: "exact", head: true }),
      svc.from("consent_records").select("id", { count: "exact", head: true }),
      svc.from("data_subject_requests").select("id", { count: "exact", head: true }),
      svc.from("data_breach_log").select("id", { count: "exact", head: true }),
      svc.from("encryption_key_registry").select("id", { count: "exact", head: true }),
      svc.from("backup_registry").select("id", { count: "exact", head: true }),
      svc.from("data_processing_logs").select("action, resource_type, created_at").order("created_at", { ascending: false }).limit(10),
      svc.from("consent_records").select("purpose, status").eq("status", "granted"),
    ]);

    // Data lineage: which tables are being audited and how
    const lineage = {
      audited_tables: ["profiles", "health_tickets", "member_locations", "responder_profiles"],
      trigger_function: "log_data_processing",
      data_categories: {
        profiles: ["personal"],
        health_tickets: ["personal", "health", "sensitive"],
        member_locations: ["personal", "location"],
        responder_profiles: ["personal"],
      },
      retention_policies: {
        location_data: "90 days post-Hajj",
        health_records: "1 year",
        consent_logs: "5 years",
        audit_trails: "7 years",
        encryption_keys: "Until retired + 1 year",
      },
      encryption: {
        at_rest: "AES-256-GCM",
        in_transit: "TLS 1.3",
        key_rotation: "90-day policy",
      },
    };

    // Consent breakdown by purpose
    const consentByPurpose: Record<string, { granted: number; withdrawn: number }> = {};
    (activeConsentRes.data || []).forEach((c: any) => {
      if (!consentByPurpose[c.purpose]) consentByPurpose[c.purpose] = { granted: 0, withdrawn: 0 };
      if (c.status === "granted") consentByPurpose[c.purpose].granted++;
      else consentByPurpose[c.purpose].withdrawn++;
    });

    // DSAR SLA compliance
    const pendingDsarRes = await svc
      .from("data_subject_requests")
      .select("id, submitted_at, due_by, status")
      .in("status", ["pending", "acknowledged", "processing"]);

    const dsarOverdue = (pendingDsarRes.data || []).filter(
      (d: any) => new Date(d.due_by) < new Date()
    ).length;

    return new Response(JSON.stringify({
      overview: {
        total_audit_logs: auditRes.count || 0,
        total_consent_records: consentRes.count || 0,
        total_dsar_requests: dsarRes.count || 0,
        total_breaches: breachRes.count || 0,
        total_encryption_keys: encRes.count || 0,
        total_backups: backupRes.count || 0,
        dsar_overdue: dsarOverdue,
        consent_by_purpose: consentByPurpose,
      },
      recent_audit_logs: recentAuditRes.data || [],
      data_lineage: lineage,
      generated_at: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Compliance dashboard error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
