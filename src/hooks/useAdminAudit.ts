import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAudit = () => {
  const logAction = useCallback(async (
    action: string,
    targetTable: string,
    targetId?: string,
    details?: Record<string, any>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("admin_audit_logs").insert({
        admin_id: user.id,
        action,
        target_table: targetTable,
        target_id: targetId || null,
        details: details || {},
      });
    } catch (err) {
      console.error("Audit log error:", err);
    }
  }, []);

  return { logAction };
};
