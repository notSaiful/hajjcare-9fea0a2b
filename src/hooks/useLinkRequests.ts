import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface LinkRequest {
  id: string;
  requester_id: string;
  target_user_id: string;
  group_id: string;
  status: "pending" | "approved" | "rejected" | "expired";
  message: string | null;
  responded_at: string | null;
  expires_at: string;
  created_at: string;
  // Joined fields
  requester_name?: string;
  group_name?: string;
}

export function useLinkRequests() {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<LinkRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<LinkRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch incoming pending requests
      const { data: incoming } = await supabase
        .from("member_link_requests")
        .select("*")
        .eq("target_user_id", user.id)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false });

      // Fetch outgoing requests (all statuses, recent)
      const { data: outgoing } = await supabase
        .from("member_link_requests")
        .select("*")
        .eq("requester_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      // Enrich incoming with requester names
      if (incoming && incoming.length > 0) {
        const requesterIds = [...new Set(incoming.map((r) => r.requester_id))];
        const groupIds = [...new Set(incoming.map((r) => r.group_id))];

        const { data: profiles } = await supabase
          .from("profiles_limited")
          .select("user_id, full_name")
          .in("user_id", requesterIds);

        const { data: groups } = await supabase
          .from("family_groups")
          .select("id, name")
          .in("id", groupIds);

        const profileMap = new Map((profiles || []).map((p) => [p.user_id, p.full_name]));
        const groupMap = new Map((groups || []).map((g) => [g.id, g.name]));

        setIncomingRequests(
          (incoming as LinkRequest[]).map((r) => ({
            ...r,
            requester_name: profileMap.get(r.requester_id) || "Unknown",
            group_name: groupMap.get(r.group_id) || "Family Group",
          }))
        );
      } else {
        setIncomingRequests([]);
      }

      setOutgoingRequests((outgoing || []) as LinkRequest[]);
    } catch (err) {
      console.error("[LinkRequests] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Realtime subscription for instant updates
  useEffect(() => {
    if (!user) return;

    fetchRequests();

    const channel = supabase
      .channel("link-requests-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "member_link_requests",
          filter: `target_user_id=eq.${user.id}`,
        },
        () => fetchRequests()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "member_link_requests",
          filter: `requester_id=eq.${user.id}`,
        },
        () => fetchRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchRequests]);

  const sendRequest = useCallback(
    async (targetUserId: string, groupId: string, message?: string) => {
      if (!user) return { error: "Not authenticated" };

      const { error } = await supabase.from("member_link_requests").insert({
        requester_id: user.id,
        target_user_id: targetUserId,
        group_id: groupId,
        message: message || null,
      });

      if (error) {
        if (error.code === "23505") {
          return { error: "A pending request already exists for this person" };
        }
        return { error: error.message };
      }

      // Trigger push notification to target
      try {
        await supabase.functions.invoke("link-request-notify", {
          body: {
            targetUserId,
            groupId,
            action: "new_request",
          },
        });
      } catch (e) {
        console.warn("[LinkRequests] Notification failed:", e);
      }

      await fetchRequests();
      return { error: null };
    },
    [user, fetchRequests]
  );

  const respondToRequest = useCallback(
    async (requestId: string, approve: boolean) => {
      if (!user) return { error: "Not authenticated" };

      const request = incomingRequests.find((r) => r.id === requestId);
      if (!request) return { error: "Request not found" };

      // Update request status
      const { error: updateError } = await supabase
        .from("member_link_requests")
        .update({
          status: approve ? "approved" : "rejected",
          responded_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (updateError) return { error: updateError.message };

      // If approved, add the target user to the group
      if (approve) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single();

        const memberName = profile?.full_name || "Member";
        const newMemberId = crypto.randomUUID();

        const { error: insertError } = await supabase
          .from("group_members")
          .insert({
            group_id: request.group_id,
            member_name: memberName,
            member_id: newMemberId,
            user_id: user.id,
          });

        if (insertError && insertError.code !== "23505") {
          return { error: insertError.message };
        }
      }

      // Notify requester of response
      try {
        await supabase.functions.invoke("link-request-notify", {
          body: {
            targetUserId: request.requester_id,
            groupId: request.group_id,
            action: approve ? "approved" : "rejected",
          },
        });
      } catch (e) {
        console.warn("[LinkRequests] Response notification failed:", e);
      }

      await fetchRequests();
      return { error: null };
    },
    [user, incomingRequests, fetchRequests]
  );

  const cancelRequest = useCallback(
    async (requestId: string) => {
      if (!user) return;
      await supabase.from("member_link_requests").delete().eq("id", requestId);
      await fetchRequests();
    },
    [user, fetchRequests]
  );

  return {
    incomingRequests,
    outgoingRequests,
    loading,
    sendRequest,
    respondToRequest,
    cancelRequest,
    refresh: fetchRequests,
  };
}
