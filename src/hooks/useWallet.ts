import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface WalletData {
  id: string;
  balance: number;
  reward_credits: number;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  reason: string;
  reference_id: string | null;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      // Get or create wallet
      let { data, error } = await supabase
        .from("wallets")
        .select("id, balance, reward_credits")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!data && !error) {
        const { data: created } = await supabase
          .from("wallets")
          .insert({ user_id: user.id })
          .select("id, balance, reward_credits")
          .single();
        data = created;
      }

      if (data) {
        setWallet(data as WalletData);
        // Fetch transactions
        const { data: txns } = await supabase
          .from("wallet_transactions")
          .select("id, type, amount, reason, reference_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);
        setTransactions((txns || []) as WalletTransaction[]);
      }
    } catch (err) {
      console.error("Wallet error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  return { wallet, transactions, loading, refetch: fetchWallet };
};
