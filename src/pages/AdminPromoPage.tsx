import { useState, useEffect, useCallback } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Tag, Plus, BarChart3, Users, TrendingUp, Trash2, Edit, Copy,
  CheckCircle, XCircle, Gift, Award, Sparkles, RefreshCw
} from "lucide-react";
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';
import { cn } from "@/lib/utils";

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  max_uses_per_user: number;
  valid_until: string | null;
  is_active: boolean;
  creator_type: string;
  commission_percentage: number;
  description: string | null;
  created_at: string;
}

export default function AdminPromoPage() {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState("percentage");
  const [formValue, setFormValue] = useState("");
  const [formMaxUses, setFormMaxUses] = useState("");
  const [formMaxPerUser, setFormMaxPerUser] = useState("1");
  const [formCreatorType, setFormCreatorType] = useState("admin");
  const [formCommission, setFormCommission] = useState("0");
  const [formDescription, setFormDescription] = useState("");
  const [formExpiry, setFormExpiry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Stats
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalWalletCredits, setTotalWalletCredits] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const { data: codes } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });
      setPromoCodes((codes || []) as PromoCode[]);

      const { count: refCount } = await supabase
        .from("referrals")
        .select("id", { count: "exact", head: true });
      setTotalReferrals(refCount || 0);

      const { data: walletData } = await supabase
        .from("wallet_transactions")
        .select("amount, type");
      const credits = (walletData || [])
        .filter((t: any) => t.type === "credit")
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
      setTotalWalletCredits(credits);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, roleLoading, fetchData]);

  if (roleLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <UnauthorizedAlert requiredRole="admin" pageName="Promo Code Management" />
      </MainLayout>
    );
  }

  const handleCreate = async () => {
    if (!formCode.trim() || !formValue) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("promo_codes").insert({
        code: formCode.trim().toUpperCase(),
        discount_type: formType,
        discount_value: Number(formValue),
        max_uses: formMaxUses ? Number(formMaxUses) : null,
        max_uses_per_user: Number(formMaxPerUser) || 1,
        creator_type: formCreatorType,
        commission_percentage: Number(formCommission) || 0,
        description: formDescription || null,
        valid_until: formExpiry || null,
        is_active: true,
      });
      if (error) throw error;
      toast({ title: "✅ Promo Code Created", description: `${formCode.toUpperCase()} is now active` });
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormCode(""); setFormType("percentage"); setFormValue(""); setFormMaxUses("");
    setFormMaxPerUser("1"); setFormCreatorType("admin"); setFormCommission("0");
    setFormDescription(""); setFormExpiry("");
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("promo_codes").update({ is_active: !active }).eq("id", id);
    fetchData();
  };

  const deleteCode = async (id: string) => {
    await supabase.from("promo_codes").delete().eq("id", id);
    fetchData();
    toast({ title: "Deleted", description: "Promo code removed" });
  };

  if (roleLoading || loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const totalConversions = promoCodes.reduce((s, c) => s + c.current_uses, 0);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24">
        <PageHeader
          title={{ en: "Promo & Rewards Admin", ar: "إدارة العروض", ur: "پرومو ایڈمن", hi: "प्रोमो एडमिन" }}
          subtitle={{ en: "Manage promo codes, referrals & rewards", ar: "إدارة الأكواد والإحالات", ur: "کوڈز اور ریفرلز کا انتظام", hi: "कोड और रेफरल प्रबंधित करें" }}
        />

        <div className="px-4 max-w-2xl mx-auto space-y-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-3 text-center">
              <Tag className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{promoCodes.length}</p>
              <p className="text-xs text-muted-foreground">Total Codes</p>
            </Card>
            <Card className="p-3 text-center">
              <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{totalConversions}</p>
              <p className="text-xs text-muted-foreground">Conversions</p>
            </Card>
            <Card className="p-3 text-center">
              <Users className="w-5 h-5 text-sky-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{totalReferrals}</p>
              <p className="text-xs text-muted-foreground">Referrals</p>
            </Card>
            <Card className="p-3 text-center">
              <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">₹{totalWalletCredits}</p>
              <p className="text-xs text-muted-foreground">Credits Given</p>
            </Card>
          </div>

          {/* Create Button */}
          <Button onClick={() => setShowForm(!showForm)} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Create New Promo Code"}
          </Button>

          {/* Create Form */}
          {showForm && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">New Promo Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Code</Label>
                    <Input value={formCode} onChange={e => setFormCode(e.target.value.toUpperCase())} placeholder="IMAM2026" className="font-mono" />
                  </div>
                  <div>
                    <Label className="text-xs">Discount Type</Label>
                    <Select value={formType} onValueChange={setFormType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="flat">Flat (₹)</SelectItem>
                        <SelectItem value="free_trial">Free Trial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Discount Value</Label>
                    <Input type="number" value={formValue} onChange={e => setFormValue(e.target.value)} placeholder="10" />
                  </div>
                  <div>
                    <Label className="text-xs">Max Uses (total)</Label>
                    <Input type="number" value={formMaxUses} onChange={e => setFormMaxUses(e.target.value)} placeholder="Unlimited" />
                  </div>
                  <div>
                    <Label className="text-xs">Max Per User</Label>
                    <Input type="number" value={formMaxPerUser} onChange={e => setFormMaxPerUser(e.target.value)} placeholder="1" />
                  </div>
                  <div>
                    <Label className="text-xs">Creator Type</Label>
                    <Select value={formCreatorType} onValueChange={setFormCreatorType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="influencer">Influencer</SelectItem>
                        <SelectItem value="imam">Imam</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Commission %</Label>
                    <Input type="number" value={formCommission} onChange={e => setFormCommission(e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <Label className="text-xs">Expiry Date</Label>
                    <Input type="datetime-local" value={formExpiry} onChange={e => setFormExpiry(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="20% off for Nagpur Haj Committee" />
                </div>
                <Button onClick={handleCreate} disabled={submitting || !formCode || !formValue} className="w-full">
                  {submitting ? "Creating..." : "Create Promo Code"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Existing Codes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">All Promo Codes</h3>
            {promoCodes.map(code => (
              <Card key={code.id} className={cn("transition-opacity", !code.is_active && "opacity-60")}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-foreground">{code.code}</code>
                      <Badge variant={code.is_active ? "default" : "secondary"} className="text-xs">
                        {code.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">{code.creator_type}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(code.id, code.is_active)}>
                        {code.is_active ? <XCircle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteCode(code.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span>
                      {code.discount_type === "percentage" ? `${code.discount_value}% off` :
                       code.discount_type === "flat" ? `₹${code.discount_value} off` : "Free Trial"}
                    </span>
                    <span>Uses: {code.current_uses}/{code.max_uses || "∞"}</span>
                    <span>Commission: {code.commission_percentage}%</span>
                  </div>
                  {code.description && (
                    <p className="text-xs text-muted-foreground mt-1">{code.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
