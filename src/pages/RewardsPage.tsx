import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useReferral } from "@/hooks/useReferral";
import { usePromoCode } from "@/hooks/usePromoCode";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet, Gift, Share2, Copy, ArrowUpCircle, ArrowDownCircle,
  Clock, CheckCircle2, Users, Trophy, Sparkles, Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function RewardsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { wallet, transactions, loading: walletLoading } = useWallet();
  const { stats, applyReferralCode, loading: refLoading } = useReferral();
  const { applyCode, getWelcomePromoRemaining } = usePromoCode();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [referralInput, setReferralInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [referralLoading, setReferralLoading] = useState(false);
  const [welcomeRemaining, setWelcomeRemaining] = useState<number>(0);

  useEffect(() => {
    getWelcomePromoRemaining().then(setWelcomeRemaining);
  }, [getWelcomePromoRemaining]);

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
          <Wallet className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-xl font-bold text-foreground">Login Required</h2>
          <p className="text-muted-foreground text-center">Sign in to access your wallet, referrals & promo codes.</p>
          <Button onClick={() => navigate("/auth")} className="mt-2">Sign In</Button>
        </div>
      </MainLayout>
    );
  }

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    try {
      const result = await applyCode(promoInput.trim());
      if (result?.success) {
        toast({ title: "🎉 Promo Applied!", description: `${result.discount_type === "percentage" ? result.discount_value + "% off" : "₹" + result.discount_value + " off"} activated!` });
        setPromoInput("");
        getWelcomePromoRemaining().then(setWelcomeRemaining);
      } else {
        toast({ title: "Error", description: result?.error || "Invalid promo code", variant: "destructive" });
      }
    } finally {
      setPromoLoading(false);
    }
  };

  const handleApplyReferral = async () => {
    if (!referralInput.trim()) return;
    setReferralLoading(true);
    try {
      const result = await applyReferralCode(referralInput.trim());
      if (result?.success) {
        toast({ title: "🎉 Referral Applied!", description: result.message || "₹50 credited!" });
        setReferralInput("");
      } else {
        toast({ title: "Error", description: result?.error || "Invalid referral code", variant: "destructive" });
      }
    } finally {
      setReferralLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (stats?.code) {
      navigator.clipboard.writeText(stats.code);
      toast({ title: "Copied!", description: `Referral code ${stats.code} copied to clipboard` });
    }
  };

  const shareReferral = async () => {
    if (!stats?.code) return;
    const text = `Join HajjCare AI – Har qadam par saath! 🕋\nUse my referral code: ${stats.code}\nGet ₹50 bonus on signup!\nhttps://hajjcare.lovable.app`;
    if (navigator.share) {
      try { await navigator.share({ title: "HajjCare AI", text }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Referral message copied" });
    }
  };

  const isLoading = walletLoading || refLoading;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24">
        <PageHeader
          title={{ en: "Rewards & Wallet", ar: "المكافآت والمحفظة", ur: "انعامات اور والیٹ", hi: "रिवॉर्ड्स और वॉलेट" }}
          subtitle={{ en: "Earn, share & save with HajjCare AI", ar: "اكسب وشارك ووفر", ur: "کمائیں، شیئر کریں اور بچائیں", hi: "कमाएं, शेयर करें और बचाएं" }}
        />

        <div className="px-4 max-w-lg mx-auto space-y-5">
          {/* Welcome Promo Banner */}
          {welcomeRemaining > 0 && (
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-bold text-foreground">HAJJCARE50</span>
                  <Badge variant="secondary" className="text-xs">10% OFF</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Welcome offer for first-time users</p>
                <p className="text-xs text-primary font-semibold mt-1">
                  🔥 Only {welcomeRemaining.toLocaleString()} left out of 20,000!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Wallet Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-primary/80">
            <CardContent className="p-5 text-primary-foreground">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-6 h-6" />
                  <span className="font-semibold text-lg">My Wallet</span>
                </div>
                <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/80 text-xs">
                  HajjCare AI
                </Badge>
              </div>
              {isLoading ? (
                <div className="h-16 animate-pulse bg-primary-foreground/10 rounded-lg" />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-primary-foreground/70">Balance</p>
                    <p className="text-2xl font-bold">₹{wallet?.balance || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/70">Reward Credits</p>
                    <p className="text-2xl font-bold">₹{wallet?.reward_credits || 0}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="referral" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="referral" className="text-xs">Referrals</TabsTrigger>
              <TabsTrigger value="promo" className="text-xs">Promo Code</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            </TabsList>

            {/* REFERRAL TAB */}
            <TabsContent value="referral" className="space-y-4 mt-4">
              {/* My Referral Code */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    Your Referral Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                    <code className="flex-1 text-lg font-mono font-bold text-foreground tracking-wider">
                      {stats?.code || "Loading..."}
                    </code>
                    <Button size="sm" variant="ghost" onClick={copyReferralCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={shareReferral} className="w-full gap-2" size="sm">
                    <Share2 className="w-4 h-4" /> Share & Earn ₹50
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Both you and your friend get ₹50 reward credits!
                  </p>
                </CardContent>
              </Card>

              {/* Referral Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Total Referrals</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{stats?.totalReferrals || 0}</p>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-muted-foreground">Successful</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{stats?.successfulReferrals || 0}</p>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{stats?.pendingReferrals || 0}</p>
                </Card>
                <Card className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Earned</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">₹{stats?.totalEarned || 0}</p>
                </Card>
              </div>

              {/* Apply Someone's Referral */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Have a Referral Code?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="HC-XXXXXX"
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                      className="font-mono"
                      maxLength={10}
                    />
                    <Button onClick={handleApplyReferral} disabled={referralLoading || !referralInput.trim()} size="sm">
                      {referralLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PROMO CODE TAB */}
            <TabsContent value="promo" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Apply Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="font-mono"
                    />
                    <Button onClick={handleApplyPromo} disabled={promoLoading || !promoInput.trim()}>
                      {promoLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Try these codes:</p>
                    <div className="flex flex-wrap gap-2">
                      {["HAJJCARE50"].map(code => (
                        <Badge
                          key={code}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => setPromoInput(code)}
                        >
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* HISTORY TAB */}
            <TabsContent value="history" className="space-y-3 mt-4">
              {transactions.length === 0 ? (
                <Card className="p-8 text-center">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No transactions yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Earn rewards through referrals!</p>
                </Card>
              ) : (
                transactions.map((tx) => (
                  <Card key={tx.id} className="p-3">
                    <div className="flex items-center gap-3">
                      {tx.type === "credit" ? (
                        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <ArrowUpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <ArrowDownCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{tx.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className={cn("font-bold text-sm", tx.type === "credit" ? "text-emerald-600" : "text-red-500")}>
                        {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
