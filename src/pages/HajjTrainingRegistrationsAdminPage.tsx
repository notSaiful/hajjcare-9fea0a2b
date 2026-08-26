import { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { ForbiddenError } from "@/components/ForbiddenError";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Eye,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";

type Registrant = {
  id: string;
  registration_code: string;
  full_name: string;
  mobile: string;
  whatsapp: string;
  email: string | null;
  state: string;
  district: string;
  city: string;
  training_batch: string;
  account_status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  cover_number: string;
  gender: string;
  age: number;
  first_hajj: boolean;
  hajj_year: number;
  embarkation_point: string;
  group_size: number;
  wheelchair_required: boolean;
  preferred_language: string;
};

type Analytics = { total: number; today: number; week: number; month: number; active: number };
type Filters = { state: string; district: string; trainingBatch: string; registrationDate: string };
type FilterOptions = { states: string[]; districts: string[]; trainingBatches: string[] };

const EMPTY_FILTERS: Filters = { state: "", district: "", trainingBatch: "", registrationDate: "" };
const EMPTY_OPTIONS: FilterOptions = { states: [], districts: [], trainingBatches: [] };
const PER_PAGE = 25;

const dateTime = (value: string) => new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
const csvEscape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const exportColumns: Array<[string, keyof Registrant]> = [
  ["Registration ID", "registration_code"], ["Full Name", "full_name"], ["Mobile Number", "mobile"],
  ["Email Address", "email"], ["State", "state"], ["District", "district"],
  ["Training Batch", "training_batch"], ["Registration Date & Time", "created_at"], ["Account Status", "account_status"],
];

function downloadFile(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function HajjTrainingRegistrationsAdminPage() {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [rows, setRows] = useState<Registrant[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [options, setOptions] = useState<FilterOptions>(EMPTY_OPTIONS);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Registrant | null>(null);
  const [editing, setEditing] = useState<Registrant | null>(null);

  const requestBody = (targetPage: number) => ({ action: "admin_list", page: targetPage, search, filters });
  const load = useCallback(async (targetPage = page, quiet = false) => {
    if (!quiet) setLoading(true);
    setError(null);
    const [list, metrics] = await Promise.all([
      supabase.functions.invoke("hajj-training-registration", { body: requestBody(targetPage) }),
      supabase.functions.invoke("hajj-training-registration", { body: { action: "admin_analytics" } }),
    ]);
    const message = list.error?.message || list.data?.error || metrics.error?.message || metrics.data?.error;
    if (message) setError(message);
    else {
      setRows(list.data?.registrations || []);
      setTotal(list.data?.total || 0);
      setOptions(list.data?.filters || EMPTY_OPTIONS);
      setAnalytics(metrics.data?.analytics || null);
    }
    if (!quiet) setLoading(false);
  // The request body deliberately uses the currently applied search and filters.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, filters]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);
  useEffect(() => {
    if (!isAdmin) return;
    const interval = window.setInterval(() => void load(page, true), 30_000);
    return () => window.clearInterval(interval);
  }, [isAdmin, load, page]);
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin-training-registration-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "hajj_training_program_registrants" },
        () => void load(page, true),
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [isAdmin, load, page]);

  const applyFilters = () => { setPage(1); void load(1); };
  const clearFilters = () => { setSearch(""); setFilters(EMPTY_FILTERS); setPage(1); window.setTimeout(() => void load(1), 0); };
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));

  const exportRows = async (format: "csv" | "excel") => {
    setExporting(true);
    const { data, error: exportError } = await supabase.functions.invoke("hajj-training-registration", {
      body: { action: "admin_export", search, filters },
    });
    setExporting(false);
    if (exportError || data?.error) return toast.error(data?.error || exportError?.message || "Export could not be created");
    const exportData = (data?.registrations || []) as Registrant[];
    const heading = exportColumns.map(([label]) => csvEscape(label)).join(",");
    const lines = exportData.map((row) => exportColumns.map(([, key]) => csvEscape(key === "created_at" ? dateTime(row[key]) : row[key])).join(","));
    if (format === "csv") downloadFile(`\uFEFF${[heading, ...lines].join("\n")}`, "hajcare-registrations.csv", "text/csv;charset=utf-8");
    else {
      const table = `<table><thead><tr>${exportColumns.map(([label]) => `<th>${label}</th>`).join("")}</tr></thead><tbody>${exportData.map((row) => `<tr>${exportColumns.map(([, key]) => `<td>${String(key === "created_at" ? dateTime(row[key]) : row[key] ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      downloadFile(`\ufeff<html><head><meta charset="utf-8"></head><body>${table}</body></html>`, "hajcare-registrations.xls", "application/vnd.ms-excel;charset=utf-8");
    }
    toast.success(`${exportData.length} registrations exported`);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    const { data, error: updateError } = await supabase.functions.invoke("hajj-training-registration", {
      body: {
        action: "admin_update", registrationId: editing.id,
        registration: { fullName: editing.full_name, mobile: editing.mobile, whatsapp: editing.whatsapp, email: editing.email, state: editing.state, district: editing.district, trainingBatch: editing.training_batch, accountStatus: editing.account_status },
      },
    });
    setSaving(false);
    if (updateError || data?.error) return toast.error(data?.error || updateError?.message || "Registration could not be updated");
    setEditing(null); toast.success("Registration updated"); void load();
  };
  const deleteRegistration = async (row: Registrant) => {
    if (!window.confirm(`Delete ${row.full_name}'s registration? This cannot be undone.`)) return;
    const { data, error: deleteError } = await supabase.functions.invoke("hajj-training-registration", { body: { action: "admin_delete", registrationId: row.id } });
    if (deleteError || data?.error) return toast.error(data?.error || deleteError?.message || "Registration could not be deleted");
    toast.success("Registration deleted"); setSelected(null); void load(rows.length === 1 && page > 1 ? page - 1 : page);
  };

  if (roleLoading) return <MainLayout><div className="mx-auto max-w-xl p-8"><Loader2 className="mx-auto animate-spin" /></div></MainLayout>;
  if (!isAdmin) return <MainLayout><ForbiddenError /></MainLayout>;

  return <MainLayout>
    <PageHeader title="Training Registration Dashboard" subtitle="Live, protected HajCare AI registration records. Newest registrations appear first." />
    <main className="mx-auto max-w-7xl space-y-5 px-4 pb-16">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Total registrations", analytics?.total, Users], ["Today", analytics?.today, UserCheck],
          ["This week", analytics?.week, Users], ["This month", analytics?.month, Users], ["Active users", analytics?.active, UserCheck],
        ].map(([label, value, Icon]) => { const CardIcon = Icon as typeof Users; return <Card key={String(label)}><CardContent className="p-4"><CardIcon className="h-5 w-5 text-primary" /><p className="mt-2 text-2xl font-bold">{analytics ? String(value ?? 0) : "—"}</p><p className="text-xs text-muted-foreground">{String(label)}</p></CardContent></Card>; })}
      </section>

      <Card><CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && applyFilters()} className="min-h-11 pl-9" placeholder="Name, registration ID, mobile number, or email" /></div>
          <div className="flex gap-2"><Button onClick={applyFilters} disabled={loading} className="min-h-11 gap-2"><Search className="h-4 w-4" />Search</Button><Button variant="outline" onClick={() => void load()} disabled={loading} aria-label="Refresh"><RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /></Button></div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={filters.state || "all"} onValueChange={(value) => setFilters((current) => ({ ...current, state: value === "all" ? "" : value, district: "" }))}>
            <SelectTrigger><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All states</SelectItem>{options.states.map((value) => (<SelectItem key={value} value={value}>{value}</SelectItem>))}</SelectContent>
          </Select>
          <Select value={filters.district || "all"} onValueChange={(value) => setFilters((current) => ({ ...current, district: value === "all" ? "" : value }))}>
            <SelectTrigger><SelectValue placeholder="District" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All districts</SelectItem>{options.districts.filter((value) => !filters.state || rows.some((row) => row.state === filters.state && row.district === value)).map((value) => (<SelectItem key={value} value={value}>{value}</SelectItem>))}</SelectContent>
          </Select>
          <Select value={filters.trainingBatch || "all"} onValueChange={(value) => setFilters((current) => ({ ...current, trainingBatch: value === "all" ? "" : value }))}>
            <SelectTrigger><SelectValue placeholder="Training batch" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All training batches</SelectItem>{options.trainingBatches.map((value) => (<SelectItem key={value} value={value}>{value}</SelectItem>))}</SelectContent>
          </Select>
          <Input type="date" aria-label="Registration date" value={filters.registrationDate} onChange={(event) => setFilters((current) => ({ ...current, registrationDate: event.target.value }))} />
        </div>
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={clearFilters}>Clear filters</Button><Button size="sm" variant="outline" className="gap-1.5" disabled={exporting} onClick={() => void exportRows("csv")}><Download className="h-4 w-4" />CSV</Button><Button size="sm" variant="outline" className="gap-1.5" disabled={exporting} onClick={() => void exportRows("excel")}><FileSpreadsheet className="h-4 w-4" />Excel</Button></div>
      </CardContent></Card>
      {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Card><CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[1050px] text-sm"><thead><tr className="border-b bg-muted/40 text-left"><th className="p-3">Registration ID</th><th className="p-3">Full name / contact</th><th className="p-3">Location</th><th className="p-3">Training batch</th><th className="p-3">Registered</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>
          {loading ? <tr><td colSpan={7} className="p-10 text-center"><Loader2 className="mx-auto animate-spin" /></td></tr> : rows.map((row) => <tr key={row.id} className="border-b align-top"><td className="p-3 font-mono font-semibold text-primary">{row.registration_code}</td><td className="p-3"><p className="font-medium">{row.full_name}</p><p className="text-xs text-muted-foreground">{row.mobile}</p><p className="text-xs text-muted-foreground">{row.email || "No email supplied"}</p></td><td className="p-3">{row.district}, {row.state}</td><td className="p-3">{row.training_batch}</td><td className="p-3 text-xs text-muted-foreground">{dateTime(row.created_at)}</td><td className="p-3"><Badge variant={row.account_status === "active" ? "default" : "secondary"}>{row.account_status === "active" ? "Active" : "Inactive"}</Badge></td><td className="p-3"><div className="flex gap-1"><Button size="icon" variant="ghost" aria-label={`View ${row.full_name}`} onClick={() => setSelected(row)}><Eye className="h-4 w-4" /></Button><Button size="icon" variant="ghost" aria-label={`Edit ${row.full_name}`} onClick={() => setEditing({ ...row })}><Edit3 className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="text-destructive" aria-label={`Delete ${row.full_name}`} onClick={() => void deleteRegistration(row)}><Trash2 className="h-4 w-4" /></Button></div></td></tr>)}
          {!loading && rows.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No registrations match the selected filters.</td></tr>}
        </tbody></table>
      </CardContent></Card>
      <div className="flex items-center justify-between text-sm"><p className="text-muted-foreground">{total === 0 ? "No records" : `${(page - 1) * PER_PAGE + 1}–${Math.min(page * PER_PAGE, total)} of ${total} registrations`}</p><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={loading || page === 1} onClick={() => { setPage(page - 1); void load(page - 1); }}><ChevronLeft className="h-4 w-4" />Previous</Button><span>Page {page} of {pageCount}</span><Button variant="outline" size="sm" disabled={loading || page >= pageCount} onClick={() => { setPage(page + 1); void load(page + 1); }}>Next<ChevronRight className="h-4 w-4" /></Button></div></div>
    </main>
    <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>{selected?.full_name}</DialogTitle><DialogDescription>Registration details</DialogDescription></DialogHeader>{selected && <div className="grid gap-3 text-sm sm:grid-cols-2">{[["Registration ID", selected.registration_code], ["Mobile", selected.mobile], ["WhatsApp", selected.whatsapp], ["Email", selected.email || "Not supplied"], ["State", selected.state], ["District", selected.district], ["City", selected.city], ["Training batch", selected.training_batch], ["Cover number", selected.cover_number], ["Embarkation point", selected.embarkation_point], ["Hajj year", selected.hajj_year], ["Group size", selected.group_size], ["Accessibility", selected.wheelchair_required ? "Wheelchair support requested" : "None"], ["Language", selected.preferred_language], ["Registered", dateTime(selected.created_at)]].map(([label, value]) => <div key={String(label)} className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium">{String(value)}</p></div>)}</div>}</DialogContent></Dialog>
    <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Edit registration</DialogTitle><DialogDescription>Changes are restricted to administrators and added to the audit log.</DialogDescription></DialogHeader>{editing && <div className="grid gap-3 sm:grid-cols-2">{[["Full name", "full_name"], ["Mobile", "mobile"], ["WhatsApp", "whatsapp"], ["Email", "email"], ["State", "state"], ["District", "district"], ["Training batch", "training_batch"]].map(([label, key]) => <div key={key}><Label htmlFor={`edit-${key}`}>{label}</Label><Input id={`edit-${key}`} value={String(editing[key as keyof Registrant] ?? "")} onChange={(event) => setEditing({ ...editing, [key]: event.target.value })} /></div>)}<div><Label>Account status</Label><Select value={editing.account_status} onValueChange={(value) => setEditing({ ...editing, account_status: value as Registrant["account_status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div></div>}<DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={() => void saveEdit()} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save changes</Button></DialogFooter></DialogContent></Dialog>
  </MainLayout>;
}
