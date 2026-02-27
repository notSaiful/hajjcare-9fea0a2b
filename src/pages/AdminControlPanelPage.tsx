import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useAdminAudit } from "@/hooks/useAdminAudit";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UnauthorizedAlert } from "@/components/UnauthorizedAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Search, Loader2, Users, FileText, Shield, Activity,
  Download, Eye, CheckCircle, XCircle, AlertTriangle, Clock,
  BarChart3, Copy, RefreshCw, ExternalLink,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────
interface Applicant {
  id: string;
  application_id: string;
  full_name: string;
  age: number;
  mobile: string;
  state: string;
  city: string | null;
  role: string;
  masjid_name: string;
  years_of_service: number;
  never_umrah: boolean;
  low_income: boolean;
  status: string;
  rejection_reason: string | null;
  proof_url: string | null;
  proof_type: string | null;
  created_at: string;
}

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_table: string;
  target_id: string | null;
  details: any;
  created_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  embarkation_point: string | null;
  created_at: string;
}

// ─── Main Component ─────────────────────────────────
const AdminControlPanelPage = () => {
  const { language, isRTL } = useLanguage();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { logAction } = useAdminAudit();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Data
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [healthTicketCount, setHealthTicketCount] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  // Dialogs
  const [detailApplicant, setDetailApplicant] = useState<Applicant | null>(null);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; applicant: Applicant | null; action: string }>({ open: false, applicant: null, action: "" });
  const [rejectionReason, setRejectionReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState(false);

  // Fetch all data
  useEffect(() => {
    if (!roleLoading && isAdmin) {
      fetchAllData();
    }
  }, [roleLoading, isAdmin]);

  const fetchAllData = async () => {
    setLoading(true);
    const [appRes, profRes, auditRes, ticketRes, volRes] = await Promise.all([
      supabase.from("applicants").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("admin_audit_logs").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("health_tickets").select("id", { count: "exact", head: true }),
      supabase.from("volunteers").select("id", { count: "exact", head: true }),
    ]);

    setApplicants(appRes.data || []);
    setProfiles(profRes.data || []);
    setAuditLogs(auditRes.data || []);
    setHealthTicketCount(ticketRes.count || 0);
    setVolunteerCount(volRes.count || 0);
    setLoading(false);
  };

  // ─── Duplicate Detection ──────────────────────────
  const duplicateApplicants = useMemo(() => {
    const phoneMap = new Map<string, Applicant[]>();
    for (const a of applicants) {
      const list = phoneMap.get(a.mobile) || [];
      list.push(a);
      phoneMap.set(a.mobile, list);
    }
    return new Map([...phoneMap].filter(([, list]) => list.length > 1));
  }, [applicants]);

  // ─── Filtered Applicants ──────────────────────────
  const filteredApplicants = useMemo(() => {
    return applicants.filter(a => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!a.full_name.toLowerCase().includes(q) && !a.application_id.toLowerCase().includes(q) && !a.mobile.includes(q)) return false;
      }
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (stateFilter !== "all" && a.state !== stateFilter) return false;
      return true;
    });
  }, [applicants, searchQuery, statusFilter, stateFilter]);

  const uniqueStates = useMemo(() => [...new Set(applicants.map(a => a.state))].sort(), [applicants]);

  // ─── Status Stats ──────────────────────────────────
  const statusStats = useMemo(() => {
    const s: Record<string, number> = {};
    for (const a of applicants) s[a.status] = (s[a.status] || 0) + 1;
    return s;
  }, [applicants]);

  // ─── Status Update ────────────────────────────────
  const updateApplicantStatus = async () => {
    if (!actionDialog.applicant) return;
    setIsUpdating(true);

    const newStatus = actionDialog.action === "approve" ? "VERIFIED" :
      actionDialog.action === "reject" ? "REJECTED" :
      actionDialog.action === "select" ? "SELECTED" : "UNDER_REVIEW";

    const updateData: any = { status: newStatus };
    if (newStatus === "REJECTED" && rejectionReason.trim()) {
      updateData.rejection_reason = rejectionReason.trim();
    } else if (newStatus !== "REJECTED") {
      updateData.rejection_reason = null;
    }

    const { error } = await supabase
      .from("applicants")
      .update(updateData)
      .eq("id", actionDialog.applicant.id);

    if (error) {
      toast.error("Update failed");
    } else {
      toast.success(`Status updated to ${newStatus}`);
      setApplicants(prev => prev.map(a => a.id === actionDialog.applicant!.id ? { ...a, ...updateData } : a));
      
      await logAction(`status_change_${newStatus.toLowerCase()}`, "applicants", actionDialog.applicant.id, {
        applicant_name: actionDialog.applicant.full_name,
        application_id: actionDialog.applicant.application_id,
        old_status: actionDialog.applicant.status,
        new_status: newStatus,
      });

      // Send WhatsApp notification
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/free-umrah-notify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({
              applicationId: actionDialog.applicant.application_id,
              applicantName: actionDialog.applicant.full_name,
              mobile: actionDialog.applicant.mobile,
              status: newStatus,
              rejectionReason: newStatus === "REJECTED" ? rejectionReason : undefined,
            }),
          });
        }
      } catch { /* non-blocking */ }
    }

    setIsUpdating(false);
    setActionDialog({ open: false, applicant: null, action: "" });
    setRejectionReason("");
  };

  // ─── Document Verification ────────────────────────
  const viewDocument = async (proofUrl: string | null) => {
    if (!proofUrl) { toast.error("No document uploaded"); return; }
    setDocLoading(true);

    try {
      const path = proofUrl.includes("proof-documents/") 
        ? proofUrl.split("proof-documents/").pop()! 
        : proofUrl;

      const { data, error } = await supabase.storage
        .from("proof-documents")
        .createSignedUrl(path, 3600);

      if (error || !data?.signedUrl) throw error;
      setDocUrl(data.signedUrl);
      await logAction("view_document", "applicants", detailApplicant?.id, { proof_type: detailApplicant?.proof_type });
    } catch {
      toast.error("Failed to load document");
    }
    setDocLoading(false);
  };

  // ─── CSV Export ────────────────────────────────────
  const exportCSV = useCallback((dataType: "applicants" | "profiles" | "audit") => {
    let csv = "";
    if (dataType === "applicants") {
      const headers = ["Application ID", "Name", "Age", "Mobile", "State", "City", "Role", "Masjid", "Years", "Status", "Created"];
      csv = [headers.join(","), ...filteredApplicants.map(a =>
        [a.application_id, `"${a.full_name}"`, a.age, a.mobile, a.state, a.city || "", a.role, `"${a.masjid_name}"`, a.years_of_service, a.status, new Date(a.created_at).toLocaleDateString()].join(",")
      )].join("\n");
    } else if (dataType === "profiles") {
      const headers = ["User ID", "Name", "Phone", "Embarkation", "Created"];
      csv = [headers.join(","), ...profiles.map(p =>
        [p.user_id, `"${p.full_name || ""}"`, p.phone || "", p.embarkation_point || "", new Date(p.created_at).toLocaleDateString()].join(",")
      )].join("\n");
    } else {
      const headers = ["Action", "Table", "Target ID", "Timestamp"];
      csv = [headers.join(","), ...auditLogs.map(l =>
        [l.action, l.target_table, l.target_id || "", new Date(l.created_at).toLocaleString()].join(",")
      )].join("\n");
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dataType}-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${dataType} exported`);
    logAction("export_csv", dataType, undefined, { count: dataType === "applicants" ? filteredApplicants.length : dataType === "profiles" ? profiles.length : auditLogs.length });
  }, [filteredApplicants, profiles, auditLogs, logAction]);

  // ─── Status Badge ─────────────────────────────────
  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      SUBMITTED: "bg-muted text-muted-foreground",
      UNDER_REVIEW: "bg-accent text-accent-foreground",
      VERIFIED: "bg-primary/10 text-primary",
      REJECTED: "bg-destructive/10 text-destructive",
      SELECTED: "bg-secondary text-secondary-foreground",
    };
    return <Badge className={map[status] || ""}>{status}</Badge>;
  };

  if (roleLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!isAdmin) return <div className="min-h-screen bg-background flex items-center justify-center p-4"><UnauthorizedAlert requiredRole="admin" pageName="Admin Control Panel" /></div>;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold">Admin Control Panel</h1>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={fetchAllData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm"><BarChart3 className="w-4 h-4 mr-1 hidden sm:inline" />Overview</TabsTrigger>
            <TabsTrigger value="umrah" className="text-xs sm:text-sm"><FileText className="w-4 h-4 mr-1 hidden sm:inline" />Umrah Apps</TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm"><Users className="w-4 h-4 mr-1 hidden sm:inline" />Users</TabsTrigger>
            <TabsTrigger value="audit" className="text-xs sm:text-sm"><Activity className="w-4 h-4 mr-1 hidden sm:inline" />Audit Log</TabsTrigger>
          </TabsList>

          {/* ═══ OVERVIEW TAB ═══ */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card><CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{profiles.length}</p>
                <p className="text-xs text-muted-foreground">Registered Users</p>
              </CardContent></Card>
              <Card><CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{applicants.length}</p>
                <p className="text-xs text-muted-foreground">Umrah Applications</p>
              </CardContent></Card>
              <Card><CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{volunteerCount}</p>
                <p className="text-xs text-muted-foreground">Volunteers</p>
              </CardContent></Card>
              <Card><CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{healthTicketCount}</p>
                <p className="text-xs text-muted-foreground">Health Tickets</p>
              </CardContent></Card>
            </div>

            {/* Umrah Status Breakdown */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Free Umrah Status Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {["SUBMITTED", "UNDER_REVIEW", "VERIFIED", "SELECTED", "REJECTED"].map(s => (
                    <div key={s} className="text-center p-3 rounded-lg border">
                      <p className="text-xl font-bold">{statusStats[s] || 0}</p>
                      <p className="text-[10px] text-muted-foreground">{s}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Duplicate Alert */}
            {duplicateApplicants.size > 0 && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <p className="font-semibold text-destructive">Duplicate Applications Detected ({duplicateApplicants.size})</p>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {[...duplicateApplicants].map(([phone, apps]) => (
                      <p key={phone} className="text-xs text-muted-foreground flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Phone {phone}: {apps.map(a => a.application_id).join(", ")}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: "Volunteers", href: "/admin/volunteers", icon: Users },
                { label: "Health Tickets", href: "/coordinator", icon: Activity },
                { label: "Role Management", href: "/admin/roles", icon: Shield },
                { label: "Circulars", href: "/admin/circulars", icon: FileText },
              ].map(link => (
                <Link key={link.href} to={link.href} className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-sm font-medium">
                  <link.icon className="w-4 h-4 text-primary" />
                  {link.label}
                  <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                </Link>
              ))}
            </div>

            {/* Recent Audit */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Recent Admin Actions</CardTitle></CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No audit logs yet</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {auditLogs.slice(0, 10).map(log => (
                      <div key={log.id} className="flex items-center gap-3 text-xs p-2 rounded bg-muted/30">
                        <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="font-medium">{log.action}</span>
                        <Badge variant="outline" className="text-[10px]">{log.target_table}</Badge>
                        {log.target_id && <span className="text-muted-foreground truncate">{log.target_id.slice(0, 8)}...</span>}
                        <span className="ml-auto text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ UMRAH APPLICATIONS TAB ═══ */}
          <TabsContent value="umrah" className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name, ID, or mobile..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {["SUBMITTED", "UNDER_REVIEW", "VERIFIED", "REJECTED", "SELECTED"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportCSV("applicants")}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">{filteredApplicants.length} of {applicants.length} applications</p>

            {/* Applications Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">App ID</TableHead>
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">State</TableHead>
                        <TableHead className="text-xs">Mobile</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></TableCell></TableRow>
                      ) : filteredApplicants.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No applications found</TableCell></TableRow>
                      ) : filteredApplicants.slice(0, 100).map(a => {
                        const isDuplicate = duplicateApplicants.has(a.mobile);
                        return (
                          <TableRow key={a.id} className={isDuplicate ? "bg-destructive/5" : ""}>
                            <TableCell className="text-xs font-mono">{a.application_id}</TableCell>
                            <TableCell className="text-xs font-medium">
                              {a.full_name}
                              {isDuplicate && <AlertTriangle className="w-3 h-3 text-destructive inline ml-1" />}
                            </TableCell>
                            <TableCell className="text-xs">{a.state}</TableCell>
                            <TableCell className="text-xs">{a.mobile}</TableCell>
                            <TableCell>{getStatusBadge(a.status)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => { setDetailApplicant(a); logAction("view_applicant", "applicants", a.id, { name: a.full_name }); }}>
                                  <Eye className="w-3 h-3" />
                                </Button>
                                {a.status !== "VERIFIED" && a.status !== "SELECTED" && (
                                  <Button variant="ghost" size="sm" className="h-7 px-2 text-primary" onClick={() => setActionDialog({ open: true, applicant: a, action: "approve" })}>
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                )}
                                {a.status !== "REJECTED" && (
                                  <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => setActionDialog({ open: true, applicant: a, action: "reject" })}>
                                    <XCircle className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ USERS TAB ═══ */}
          <TabsContent value="users" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Registered Users ({profiles.length})</h3>
              <Button variant="outline" size="sm" onClick={() => exportCSV("profiles")}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Name</TableHead>
                        <TableHead className="text-xs">Phone</TableHead>
                        <TableHead className="text-xs">Embarkation</TableHead>
                        <TableHead className="text-xs">Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No users</TableCell></TableRow>
                      ) : profiles.map(p => (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs font-medium">{p.full_name || "—"}</TableCell>
                          <TableCell className="text-xs">{p.phone || "—"}</TableCell>
                          <TableCell className="text-xs">{p.embarkation_point || "—"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ AUDIT LOG TAB ═══ */}
          <TabsContent value="audit" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Admin Audit Trail ({auditLogs.length})</h3>
              <Button variant="outline" size="sm" onClick={() => exportCSV("audit")}>
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Timestamp</TableHead>
                        <TableHead className="text-xs">Action</TableHead>
                        <TableHead className="text-xs">Table</TableHead>
                        <TableHead className="text-xs">Target ID</TableHead>
                        <TableHead className="text-xs">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No audit logs</TableCell></TableRow>
                      ) : auditLogs.map(log => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</TableCell>
                          <TableCell className="text-xs font-medium">{log.action}</TableCell>
                          <TableCell><Badge variant="outline" className="text-[10px]">{log.target_table}</Badge></TableCell>
                          <TableCell className="text-xs font-mono">{log.target_id ? log.target_id.slice(0, 12) + "..." : "—"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {log.details ? JSON.stringify(log.details).slice(0, 80) : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ═══ Detail Dialog ═══ */}
      <Dialog open={!!detailApplicant} onOpenChange={() => { setDetailApplicant(null); setDocUrl(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>{detailApplicant?.application_id}</DialogDescription>
          </DialogHeader>
          {detailApplicant && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground text-xs block">Name</span>{detailApplicant.full_name}</div>
                <div><span className="text-muted-foreground text-xs block">Age</span>{detailApplicant.age}</div>
                <div><span className="text-muted-foreground text-xs block">Mobile</span>{detailApplicant.mobile}</div>
                <div><span className="text-muted-foreground text-xs block">State</span>{detailApplicant.state}</div>
                <div><span className="text-muted-foreground text-xs block">City</span>{detailApplicant.city || "—"}</div>
                <div><span className="text-muted-foreground text-xs block">Role</span>{detailApplicant.role}</div>
                <div><span className="text-muted-foreground text-xs block">Masjid</span>{detailApplicant.masjid_name}</div>
                <div><span className="text-muted-foreground text-xs block">Years of Service</span>{detailApplicant.years_of_service}</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {detailApplicant.never_umrah && <Badge variant="secondary" className="text-xs">Never Umrah</Badge>}
                {detailApplicant.low_income && <Badge variant="secondary" className="text-xs">Low Income</Badge>}
              </div>
              <div><span className="text-muted-foreground text-xs block">Status</span>{getStatusBadge(detailApplicant.status)}</div>
              {detailApplicant.rejection_reason && (
                <div className="p-2 rounded bg-destructive/5 text-destructive text-xs">{detailApplicant.rejection_reason}</div>
              )}
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground mb-2">Document Verification</p>
                <Button variant="outline" size="sm" onClick={() => viewDocument(detailApplicant.proof_url)} disabled={docLoading || !detailApplicant.proof_url}>
                  {docLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  View {detailApplicant.proof_type || "Document"}
                </Button>
                {docUrl && (
                  <div className="mt-2">
                    <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Open in new tab
                    </a>
                    {docUrl.match(/\.(jpg|jpeg|png|webp)$/i) && (
                      <img src={docUrl} alt="Proof document" className="mt-2 rounded border max-h-60 object-contain" />
                    )}
                  </div>
                )}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="default" size="sm" onClick={() => { setDetailApplicant(null); setActionDialog({ open: true, applicant: detailApplicant, action: "approve" }); }}>
                  <CheckCircle className="w-4 h-4 mr-1" /> Verify
                </Button>
                <Button variant="destructive" size="sm" onClick={() => { setDetailApplicant(null); setActionDialog({ open: true, applicant: detailApplicant, action: "reject" }); }}>
                  <XCircle className="w-4 h-4 mr-1" /> Reject
                </Button>
                <Button variant="secondary" size="sm" onClick={() => { setDetailApplicant(null); setActionDialog({ open: true, applicant: detailApplicant, action: "select" }); }}>
                  Select for Umrah
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══ Action Confirmation Dialog ═══ */}
      <Dialog open={actionDialog.open} onOpenChange={() => { setActionDialog({ open: false, applicant: null, action: "" }); setRejectionReason(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve" ? "Verify Application" :
               actionDialog.action === "reject" ? "Reject Application" : "Select for Umrah"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.applicant?.full_name} — {actionDialog.applicant?.application_id}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.action === "reject" && (
            <Textarea placeholder="Rejection reason (required)..." value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="min-h-[80px]" />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, applicant: null, action: "" })}>Cancel</Button>
            <Button
              onClick={updateApplicantStatus}
              disabled={isUpdating || (actionDialog.action === "reject" && !rejectionReason.trim())}
              variant={actionDialog.action === "reject" ? "destructive" : "default"}
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminControlPanelPage;
