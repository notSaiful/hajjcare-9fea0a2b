import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Plus, Trash2, Star, Search } from "lucide-react";
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';

interface OperatorForm {
  name: string;
  company_name: string;
  license_number: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  is_verified: boolean;
}

const emptyForm: OperatorForm = {
  name: "",
  company_name: "",
  license_number: "",
  city: "",
  state: "",
  phone: "",
  email: "",
  is_verified: false,
};

export default function AdminOperatorsPage() {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<OperatorForm>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: operators = [], isLoading } = useQuery({
    queryKey: ["admin-operators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verified_operators")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: OperatorForm) => {
      const { error } = await supabase.from("verified_operators").insert({
        ...data,
        verification_date: data.is_verified ? new Date().toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-operators"] });
      setForm(emptyForm);
      setDialogOpen(false);
      toast({ title: "Operator added successfully" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const toggleBlacklist = useMutation({
    mutationFn: async ({ id, blacklisted }: { id: string; blacklisted: boolean }) => {
      const { error } = await supabase
        .from("verified_operators")
        .update({ is_blacklisted: blacklisted, is_verified: blacklisted ? false : undefined })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-operators"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("verified_operators").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-operators"] });
      toast({ title: "Operator deleted" });
    },
  });

  if (roleLoading) return <MainLayout><div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div></MainLayout>;
  if (!isAdmin) return <MainLayout><UnauthorizedAlert requiredRole="admin" pageName="Verified Operators" /></MainLayout>;

  const filtered = operators.filter(
    (op) =>
      op.company_name.toLowerCase().includes(search.toLowerCase()) ||
      op.name.toLowerCase().includes(search.toLowerCase()) ||
      op.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24">
        <PageHeader icon={ShieldCheck} title="Manage Operators" subtitle="Add, verify, or blacklist tour operators" backLink="/" />

        <div className="px-4 mt-4 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search operators..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add New Operator</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Contact Person Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input placeholder="Company Name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
                  <Input placeholder="License Number (MOHME)" value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  </div>
                  <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_verified} onCheckedChange={(v) => setForm({ ...form, is_verified: v })} />
                    <span className="text-sm">Mark as Verified</span>
                  </div>
                  <Button className="w-full" onClick={() => createMutation.mutate(form)} disabled={!form.name || !form.company_name || !form.state || createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Operator"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">{filtered.length} operators</p>
              {filtered.map((op) => (
                <Card key={op.id} className={`p-4 border ${op.is_blacklisted ? "border-destructive/30 bg-destructive/5" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm truncate">{op.company_name}</span>
                        {op.is_blacklisted && <Badge variant="destructive" className="text-xs">Blacklisted</Badge>}
                        {op.is_verified && !op.is_blacklisted && <Badge className="bg-primary/10 text-primary text-xs">Verified</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{op.name} • {op.city}, {op.state}</p>
                      {op.avg_rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs">{Number(op.avg_rating).toFixed(1)} ({op.total_reviews})</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant={op.is_blacklisted ? "outline" : "destructive"}
                        size="sm"
                        className="text-xs"
                        onClick={() => toggleBlacklist.mutate({ id: op.id, blacklisted: !op.is_blacklisted })}
                      >
                        {op.is_blacklisted ? "Unblock" : "Blacklist"}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteMutation.mutate(op.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
