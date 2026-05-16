import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePromoCode = () => {
  const applyCode = useCallback(async (code: string) => {
    const { data } = await supabase.rpc("apply_promo_code", { p_code: code });
    return data as { success: boolean; error?: string; discount_type?: string; discount_value?: number; code?: string } | null;
  }, []);

  const getWelcomePromoRemaining = useCallback(async () => {
    const { data } = await (supabase as any).rpc("get_public_promo_code", { p_code: "HAJJCARE50" });
    const row = Array.isArray(data) ? data[0] : data;
    if (row && row.max_uses) {
      return row.max_uses - (row.current_uses ?? 0);
    }
    return 0;
  }, []);

  return { applyCode, getWelcomePromoRemaining };
};
