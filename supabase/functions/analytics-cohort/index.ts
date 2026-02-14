import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller is admin
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await anonClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, supabaseKey);
    const { data: roleCheck } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!roleCheck) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Compute Cohort Retention ──
    // Group users by signup week, track retention over subsequent weeks
    const { data: profiles } = await admin
      .from("profiles")
      .select("user_id, created_at")
      .order("created_at", { ascending: true });

    const { data: locations } = await admin
      .from("member_locations")
      .select("user_id, updated_at")
      .not("user_id", "is", null);

    const { data: familyMembers } = await admin
      .from("group_members")
      .select("user_id, joined_at")
      .not("user_id", "is", null);

    const { data: healthTickets } = await admin
      .from("health_tickets")
      .select("user_id, created_at")
      .not("user_id", "is", null);

    // Build activity map: user_id -> Set of active week numbers
    const userActivity: Record<string, Set<number>> = {};
    const epoch = new Date("2026-01-01").getTime();
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    const getWeek = (dateStr: string) => Math.floor((new Date(dateStr).getTime() - epoch) / weekMs);

    const recordActivity = (userId: string, dateStr: string) => {
      if (!userId || !dateStr) return;
      if (!userActivity[userId]) userActivity[userId] = new Set();
      userActivity[userId].add(getWeek(dateStr));
    };

    // Record all user activities
    locations?.forEach((l) => recordActivity(l.user_id!, l.updated_at));
    familyMembers?.forEach((m) => recordActivity(m.user_id!, m.joined_at));
    healthTickets?.forEach((h) => recordActivity(h.user_id!, h.created_at!));

    // Build cohorts by signup week
    const cohorts: Record<number, string[]> = {};
    profiles?.forEach((p) => {
      const week = getWeek(p.created_at);
      if (week < 0 || week > 10) return; // reasonable range
      if (!cohorts[week]) cohorts[week] = [];
      cohorts[week].push(p.user_id);
      recordActivity(p.user_id, p.created_at); // signup = activity
    });

    // Compute retention matrix
    const currentWeek = getWeek(new Date().toISOString());
    const cohortData: Array<{
      cohort_week: number;
      cohort_label: string;
      users: number;
      retention: number[]; // percentage retained in week 0, 1, 2, ...
    }> = [];

    const sortedWeeks = Object.keys(cohorts).map(Number).sort((a, b) => a - b);
    for (const week of sortedWeeks) {
      const users = cohorts[week];
      const maxOffset = Math.min(currentWeek - week, 6); // up to 6 weeks out
      const retention: number[] = [];
      for (let offset = 0; offset <= maxOffset; offset++) {
        const active = users.filter((uid) => userActivity[uid]?.has(week + offset)).length;
        retention.push(users.length > 0 ? Math.round((active / users.length) * 100) : 0);
      }
      const weekStart = new Date(epoch + week * weekMs);
      cohortData.push({
        cohort_week: week,
        cohort_label: `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        users: users.length,
        retention,
      });
    }

    // ── Compute Funnel ──
    const totalProfiles = profiles?.length || 0;

    // Users who have a profile (signed up)
    const signedUp = new Set(profiles?.map((p) => p.user_id) || []);

    // Users who completed profile (have embarkation_point)
    const { data: completedProfiles } = await admin
      .from("profiles")
      .select("user_id")
      .not("embarkation_point", "is", null);
    const profileCompleted = new Set(completedProfiles?.map((p) => p.user_id) || []);

    // Users who joined a family group
    const familyJoined = new Set(familyMembers?.map((m) => m.user_id) || []);

    // Users who enabled location tracking
    const trackingEnabled = new Set(locations?.map((l) => l.user_id) || []);

    // Users who used AI chat
    const { data: aiUsers } = await admin
      .from("ai_intent_logs")
      .select("user_id");
    const chatUsed = new Set(aiUsers?.map((a) => a.user_id) || []);

    const funnel = [
      { stage: "Signed Up", count: signedUp.size, pct: 100 },
      { stage: "Profile Completed", count: profileCompleted.size, pct: totalProfiles > 0 ? Math.round((profileCompleted.size / totalProfiles) * 100) : 0 },
      { stage: "Joined Family Group", count: familyJoined.size, pct: totalProfiles > 0 ? Math.round((familyJoined.size / totalProfiles) * 100) : 0 },
      { stage: "Location Tracking", count: trackingEnabled.size, pct: totalProfiles > 0 ? Math.round((trackingEnabled.size / totalProfiles) * 100) : 0 },
      { stage: "Used AI Chat", count: chatUsed.size, pct: totalProfiles > 0 ? Math.round((chatUsed.size / totalProfiles) * 100) : 0 },
    ];

    // ── Summary Stats ──
    const summary = {
      total_users: totalProfiles,
      active_this_week: profiles?.filter((p) => userActivity[p.user_id]?.has(currentWeek)).length || 0,
      family_adoption: totalProfiles > 0 ? Math.round((familyJoined.size / totalProfiles) * 100) : 0,
      tracking_adoption: totalProfiles > 0 ? Math.round((trackingEnabled.size / totalProfiles) * 100) : 0,
    };

    return new Response(
      JSON.stringify({ cohorts: cohortData, funnel, summary, generated_at: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
