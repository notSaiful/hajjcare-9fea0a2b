import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Plus, Trash2, Clock, MapPin } from "lucide-react";
import { Navigate } from "react-router-dom";

interface AlertForm {
  title: string;
  description: string;
  severity: string;
  location: string;
}

const emptyForm: AlertForm = { title: "", description: "", severity: "warning", location: "" };

export default function AdminFraudAlertsPage() {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AlertForm>(emptyForm);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["admin-fraud-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fraud_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: AlertForm) => {
      const { error } = await supabase.from("fraud_alerts").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fraud-alerts"] });
      setForm(emptyForm);
      setDialogOpen(false);
      toast({ title: "Alert published" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("fraud_alerts").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-fraud-alerts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fraud_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fraud-alerts"] });
      toast({ title: "Alert deleted" });
    },
  });

  if (roleLoading) return <MainLayout><div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div></MainLayout>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24">
        <PageHeader icon={AlertTriangle} title="Manage Fraud Alerts" subtitle="Publish and manage public fraud warnings" backLink="/" />

        <div className="px-4 mt-4 space-y-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full"><Plus className="w-4 h-4 mr-1" /> Publish New Alert</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Fraud Alert</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Alert Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Textarea placeholder="Description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
                <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Location (e.g. Delhi NCR)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <Button className="w-full" onClick={() => createMutation.mutate(form)} disabled={!form.title || !form.description || createMutation.isPending}>
                  {createMutation.isPending ? "Publishing..." : "Publish Alert"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">{alerts.length} alerts</p>
              {alerts.map((alert) => (
                <Card key={alert.id} className={`p-4 border ${alert.is_active ? "" : "opacity-50"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{alert.title}</span>
                        <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {alert.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location}</span>}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(alert.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Switch checked={alert.is_active} onCheckedChange={(v) => toggleActive.mutate({ id: alert.id, active: v })} />
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteMutation.mutate(alert.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
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
