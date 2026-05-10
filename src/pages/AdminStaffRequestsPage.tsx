import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { MainLayout } from "@/components/MainLayout";
import { UnauthorizedAlert } from "@/components/UnauthorizedAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  RefreshCw,
  Check,
  X,
  Crown,
  ClipboardList,
  Stethoscope,
  Inbox,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type AppRole = "admin" | "coordinator" | "medical_staff" | "inspector";

interface StaffRoleRequest {
  id: string;
  user_id: string;
  requested_role: AppRole;
  zone: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
}

const roleMeta: Record<AppRole, { icon: React.ElementType; color: string; label: string }> = {
  admin: { icon: Crown, color: "text-amber-600", label: "Admin" },
  coordinator: { icon: ClipboardList, color: "text-blue-600", label: "Coordinator" },
  medical_staff: { icon: Stethoscope, color: "text-green-600", label: "Medical Staff" },
  inspector: { icon: ShieldCheck, color: "text-emerald-600", label: "Inspector" },
};

const zoneOptions = [
  { value: "none", label: "No zone" },
  { value: "general", label: "General" },
  { value: "makkah_medical", label: "Makkah Medical" },
  { value: "madinah_medical", label: "Madinah Medical" },
  { value: "mina_medical", label: "Mina Medical" },
  { value: "arafat_medical", label: "Arafat Medical" },
];

const AdminStaffRequestsPage: React.FC = () => {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [requests, setRequests] = useState<StaffRoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [overrideRole, setOverrideRole] = useState<Record<string, AppRole>>({});
  const [overrideZone, setOverrideZone] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase
        .from("staff_role_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (filter === "pending") q = q.eq("status", "pending");
      const { data, error } = await q;
      if (error) throw error;
      setRequests((data ?? []) as StaffRoleRequest[]);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!roleLoading && isAdmin) fetchRequests();
  }, [roleLoading, isAdmin, fetchRequests]);

  const handleApprove = async (req: StaffRoleRequest) => {
    setBusyId(req.id);
    try {
      const role = overrideRole[req.id] ?? req.requested_role;
      const zoneRaw = overrideZone[req.id] ?? req.zone ?? "none";
      const zone = zoneRaw === "none" || role === "admin" || role === "inspector" ? null : zoneRaw;

      const { data, error } = await supabase.rpc("assign_user_role", {
        p_identifier: req.user_id,
        p_role: role as never,
        p_zone: zone,
      });
      if (error) throw error;
      const result = data as { success: boolean; error?: string };
      if (!result?.success) {
        toast.error(result?.error || "Failed to assign role");
        return;
      }

      const { error: updErr } = await supabase
        .from("staff_role_requests")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          review_notes: notes[req.id] || null,
        })
        .eq("id", req.id);
      if (updErr) throw updErr;

      toast.success(`${roleMeta[role].label} role assigned`);
      await fetchRequests();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Approval failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (req: StaffRoleRequest) => {
    setBusyId(req.id);
    try {
      const { error } = await supabase
        .from("staff_role_requests")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          review_notes: notes[req.id] || null,
        })
        .eq("id", req.id);
      if (error) throw error;
      toast.success("Request rejected");
      await fetchRequests();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Reject failed");
    } finally {
      setBusyId(null);
    }
  };

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
        <UnauthorizedAlert requiredRole="admin" pageName="Staff Role Requests" />
      </MainLayout>
    );
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <header className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Inbox className="w-6 h-6 text-primary" />
              Staff Role Requests
            </h1>
            <p className="text-sm text-muted-foreground">
              Review and approve Inspector / Coordinator / Admin requests submitted by users.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as "pending" | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending only</SelectItem>
                <SelectItem value="all">All requests</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchRequests} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </header>

        {filter === "pending" && (
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            {pendingCount === 0
              ? "No pending requests. New submissions will appear here."
              : `${pendingCount} pending request${pendingCount === 1 ? "" : "s"}.`}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No requests found.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const Meta = roleMeta[req.requested_role];
              const Icon = Meta.icon;
              const isPending = req.status === "pending";
              const role = overrideRole[req.id] ?? req.requested_role;
              const supportsZone = role !== "admin" && role !== "inspector";

              return (
                <Card key={req.id} className="border-border/80">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${Meta.color}`} />
                        Request: {Meta.label}
                        {req.zone && (
                          <span className="text-xs font-normal text-muted-foreground">
                            · {req.zone}
                          </span>
                        )}
                      </CardTitle>
                      <Badge
                        variant={
                          isPending ? "secondary" : req.status === "approved" ? "default" : "outline"
                        }
                        className={
                          req.status === "approved"
                            ? "bg-green-600 text-white"
                            : req.status === "rejected"
                            ? "border-destructive text-destructive"
                            : ""
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{req.full_name || "Unnamed user"}</span>
                      </div>
                      {req.email && (
                        <div className="flex items-center gap-2 text-muted-foreground break-all">
                          <Mail className="w-4 h-4" />
                          {req.email}
                        </div>
                      )}
                      {req.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {req.phone}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground/80 font-mono break-all sm:col-span-2">
                        UID: {req.user_id}
                      </div>
                    </div>

                    {req.reason && (
                      <div className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                        <span className="text-xs font-semibold text-muted-foreground block mb-1">
                          Reason
                        </span>
                        {req.reason}
                      </div>
                    )}

                    {isPending ? (
                      <div className="space-y-3 pt-1 border-t border-border/60">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">
                              Role to assign
                            </label>
                            <Select
                              value={role}
                              onValueChange={(v) =>
                                setOverrideRole((prev) => ({ ...prev, [req.id]: v as AppRole }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {(Object.keys(roleMeta) as AppRole[]).map((r) => {
                                  const M = roleMeta[r];
                                  const I = M.icon;
                                  return (
                                    <SelectItem key={r} value={r}>
                                      <span className="flex items-center gap-2">
                                        <I className={`w-4 h-4 ${M.color}`} />
                                        {M.label}
                                      </span>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          {supportsZone && (
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-muted-foreground">
                                Zone (optional)
                              </label>
                              <Select
                                value={overrideZone[req.id] ?? req.zone ?? "none"}
                                onValueChange={(v) =>
                                  setOverrideZone((prev) => ({ ...prev, [req.id]: v }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {zoneOptions.map((z) => (
                                    <SelectItem key={z.value} value={z.value}>
                                      {z.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <Textarea
                          placeholder="Review notes (optional)"
                          value={notes[req.id] ?? ""}
                          onChange={(e) =>
                            setNotes((prev) => ({ ...prev, [req.id]: e.target.value }))
                          }
                          rows={2}
                        />

                        <div className="flex gap-2 flex-wrap">
                          <Button
                            onClick={() => handleApprove(req)}
                            disabled={busyId === req.id}
                            className="flex-1 sm:flex-none"
                          >
                            {busyId === req.id ? (
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 mr-2" />
                            )}
                            Approve & assign {roleMeta[role].label}
                          </Button>
                          <Button
                            onClick={() => handleReject(req)}
                            disabled={busyId === req.id}
                            variant="outline"
                            className="border-destructive/40 text-destructive hover:bg-destructive/5"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground border-t border-border/60 pt-3 space-y-1">
                        {req.reviewed_at && (
                          <p>
                            Reviewed{" "}
                            {formatDistanceToNow(new Date(req.reviewed_at), { addSuffix: true })}
                          </p>
                        )}
                        {req.review_notes && (
                          <p className="italic">Notes: {req.review_notes}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminStaffRequestsPage;
