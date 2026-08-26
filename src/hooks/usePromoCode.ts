import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePromoCode = () => {
  const applyCode = useCallback(async (code: string) => {
    const { data } = await supabase.rpc("apply_promo_code", { p_code: code });
    return data as { success: boolean; error?: string; discount_type?: string; discount_value?: number; code?: string } | null;
  }, []);

  const getWelcomePromoRemaining = useCallback(async () => {
    const { data } = await supabase.rpc("get_public_promo_code" as never, { p_code: "HAJJCARE50" } as never);
    const row = (data && (Array.isArray(data) ? data[0] : data)) as { max_uses?: number; current_uses?: number } | null;
    if (row && row.max_uses) {
      return row.max_uses - (row.current_uses ?? 0);
    }
    return 0;
  }, []);

  return { applyCode, getWelcomePromoRemaining };
};
