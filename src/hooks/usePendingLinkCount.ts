import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/** Lightweight hook that only returns the count of pending incoming link requests. */
export function usePendingLinkCount() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const { count: c } = await supabase
        .from("member_link_requests")
        .select("id", { count: "exact", head: true })
        .eq("target_user_id", user.id)
        .eq("status", "pending")
        .gt("expires_at", new Date().toISOString());
      setCount(c ?? 0);
    };

    fetch();

    const channel = supabase
      .channel("pending-link-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "member_link_requests", filter: `target_user_id=eq.${user.id}` },
        () => fetch()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return count;
}
