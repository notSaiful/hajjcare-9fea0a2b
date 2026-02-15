import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Data Protection Compliance API
 * 
 * Handles:
 *  - Consent management (grant/withdraw)
 *  - Data Subject Requests (DSAR) — access, erasure, portability
 *  - Audit trail queries
 *  - Data export generation
 *
 * Compliant with: India DPDP Act 2023, Saudi PDPL, ISO 27001, SOC2
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { action } = body;

    // ─── CONSENT: Grant ───
    if (action === "grant_consent") {
      const { purpose, lawful_basis, consent_version, cross_border_transfer, transfer_destination, expires_in_days } = body;

      const expiresAt = expires_in_days
        ? new Date(Date.now() + expires_in_days * 86400000).toISOString()
        : null;

      const { data, error } = await supabase.from("consent_records").insert({
        user_id: user.id,
        purpose,
        lawful_basis: lawful_basis || "consent",
        status: "granted",
        consent_version: consent_version || "1.0",
        collection_method: "in_app",
        cross_border_transfer: cross_border_transfer || false,
        transfer_destination: transfer_destination || null,
        expires_at: expiresAt,
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        user_agent: req.headers.get("user-agent"),
      }).select().single();

      if (error) throw error;

      // Log the processing event
      await serviceClient.from("data_processing_logs").insert({
        actor_id: user.id,
        action: "create",
        resource_type: "consent",
        resource_id: data.id,
        data_categories: ["personal"],
        purpose: `consent_granted:${purpose}`,
        outcome: "success",
      });

      return json({ success: true, consent_id: data.id });
    }

    // ─── CONSENT: Withdraw ───
    if (action === "withdraw_consent") {
      const { purpose } = body;

      // Insert withdrawal record (append-only)
      const { data, error } = await supabase.from("consent_records").insert({
        user_id: user.id,
        purpose,
        status: "withdrawn",
        withdrawn_at: new Date().toISOString(),
        collection_method: "in_app",
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        user_agent: req.headers.get("user-agent"),
      }).select().single();

      if (error) throw error;

      await serviceClient.from("data_processing_logs").insert({
        actor_id: user.id,
        action: "update",
        resource_type: "consent",
        resource_id: data.id,
        data_categories: ["personal"],
        purpose: `consent_withdrawn:${purpose}`,
        outcome: "success",
      });

      return json({ success: true, withdrawal_id: data.id });
    }

    // ─── CONSENT: List active consents ───
    if (action === "list_consents") {
      const { data, error } = await supabase
        .from("consent_records")
        .select("*")
        .eq("user_id", user.id)
        .order("granted_at", { ascending: false });

      if (error) throw error;
      return json({ consents: data || [] });
    }

    // ─── DSAR: Submit request ───
    if (action === "submit_dsar") {
      const { request_type, description, scope } = body;

      const { data, error } = await supabase.from("data_subject_requests").insert({
        user_id: user.id,
        request_type,
        description,
        scope: scope || ["all"],
        identity_verified: true, // user is authenticated
        verification_method: "authenticated_session",
      }).select().single();

      if (error) throw error;

      await serviceClient.from("data_processing_logs").insert({
        actor_id: user.id,
        action: "create",
        resource_type: "dsar",
        resource_id: data.id,
        data_categories: ["personal"],
        purpose: `dsar_submitted:${request_type}`,
        outcome: "success",
      });

      return json({ success: true, request_id: data.id, due_by: data.due_by });
    }

    // ─── DSAR: Export user data (right to access / portability) ───
    if (action === "export_data") {
      const { format } = body; // json or csv

      // Gather all user data across tables
      const [profiles, locations, consents, healthTickets, familyGroups] = await Promise.all([
        serviceClient.from("profiles").select("full_name, embarkation_point, family_sharing_enabled, created_at").eq("user_id", user.id),
        serviceClient.from("member_locations").select("latitude, longitude, current_stage, pilgrim_status, updated_at").eq("user_id", user.id),
        serviceClient.from("consent_records").select("purpose, status, granted_at, withdrawn_at, expires_at").eq("user_id", user.id),
        serviceClient.from("health_tickets").select("description, symptoms, ai_category, status, created_at").eq("user_id", user.id),
        serviceClient.from("group_members").select("group_id, member_name, joined_at").eq("user_id", user.id),
      ]);

      const exportData = {
        exported_at: new Date().toISOString(),
        data_subject: user.email,
        regulation: "India DPDP Act 2023 / Saudi PDPL",
        data: {
          profile: profiles.data || [],
          locations: (locations.data || []).map(l => ({
            ...l,
            latitude: Math.round(l.latitude * 10000) / 10000,  // privacy: ~11m precision
            longitude: Math.round(l.longitude * 10000) / 10000,
          })),
          consents: consents.data || [],
          health_records: healthTickets.data || [],
          family_memberships: familyGroups.data || [],
        },
      };

      await serviceClient.from("data_processing_logs").insert({
        actor_id: user.id,
        action: "export",
        resource_type: "user_data",
        resource_id: user.id,
        data_categories: ["personal", "health", "location"],
        purpose: "dsar_data_export",
        outcome: "success",
      });

      return json(exportData);
    }

    // ─── DSAR: Request erasure (right to be forgotten) ───
    if (action === "request_erasure") {
      const { data, error } = await supabase.from("data_subject_requests").insert({
        user_id: user.id,
        request_type: "erasure",
        description: body.reason || "User requested data deletion",
        scope: ["all"],
        identity_verified: true,
        verification_method: "authenticated_session",
      }).select().single();

      if (error) throw error;

      await serviceClient.from("data_processing_logs").insert({
        actor_id: user.id,
        action: "create",
        resource_type: "dsar_erasure",
        resource_id: data.id,
        data_categories: ["personal"],
        purpose: "erasure_request",
        outcome: "success",
      });

      return json({
        success: true,
        request_id: data.id,
        due_by: data.due_by,
        message: "Your data deletion request has been submitted. It will be processed within 30 days as required by law.",
      });
    }

    // ─── AUDIT: Get processing logs (admin only) ───
    if (action === "get_audit_logs") {
      const { data: roles } = await serviceClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = roles?.some(r => r.role === "admin");
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: "Admin access required" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { limit = 100, offset = 0, resource_type, actor_id } = body;

      let query = serviceClient
        .from("data_processing_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (resource_type) query = query.eq("resource_type", resource_type);
      if (actor_id) query = query.eq("actor_id", actor_id);

      const { data, error } = await query;
      if (error) throw error;

      return json({ logs: data || [], count: data?.length || 0 });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Compliance API error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function json(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
