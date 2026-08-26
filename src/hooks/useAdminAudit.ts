import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export const useAdminAudit = () => {
  const logAction = useCallback(async (
    action: string,
    targetTable: string,
    targetId?: string,
    details?: Record<string, unknown>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("admin_audit_logs").insert({
        admin_id: user.id,
        action,
        target_table: targetTable,
        target_id: targetId || null,
        details: (details || {}) as Json,
      });
    } catch (err) {
      console.error("Audit log error:", err);
    }
  }, []);

  return { logAction };
};
