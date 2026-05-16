import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePromoCode = () => {
  const applyCode = useCallback(async (code: string) => {
    const { data } = await supabase.rpc("apply_promo_code", { p_code: code });
    return data as { success: boolean; error?: string; discount_type?: string; discount_value?: number; code?: string } | null;
  }, []);

  const getWelcomePromoRemaining = useCallback(async () => {
    const { data } = await (supabase as any)
      .from("public_promo_codes")
      .select("max_uses, current_uses")
      .eq("code", "HAJJCARE50")
      .maybeSingle();
    if (data && data.max_uses) {
      return data.max_uses - data.current_uses;
    }
    return 0;
  }, []);

  return { applyCode, getWelcomePromoRemaining };
};
