import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface ReferralStats {
  code: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
}

export const useReferral = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReferral = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      // Get or create referral code
      let { data: codeData } = await supabase
        .from("referral_codes")
        .select("code")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!codeData) {
        const { data: newCode } = await supabase.rpc("generate_referral_code");
        if (newCode) {
          await supabase
            .from("referral_codes")
            .insert({ user_id: user.id, code: newCode as string });
          codeData = { code: newCode as string };
        }
      }

      // Get referral stats
      const { data: referrals } = await supabase
        .from("referrals")
        .select("id, status, reward_credited")
        .eq("referrer_id", user.id);

      const allRefs = referrals || [];
      setStats({
        code: codeData?.code || "",
        totalReferrals: allRefs.length,
        successfulReferrals: allRefs.filter(r => r.status === "completed").length,
        pendingReferrals: allRefs.filter(r => r.status === "pending").length,
        totalEarned: allRefs.filter(r => r.reward_credited).length * 50,
      });
    } catch (err) {
      console.error("Referral error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const applyReferralCode = useCallback(async (code: string) => {
    const { data } = await supabase.rpc("process_referral", { p_referral_code: code });
    return data as { success: boolean; error?: string; message?: string } | null;
  }, []);

  useEffect(() => { fetchReferral(); }, [fetchReferral]);

  return { stats, loading, applyReferralCode, refetch: fetchReferral };
};
