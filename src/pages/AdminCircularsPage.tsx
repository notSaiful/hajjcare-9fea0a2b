import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Archive, Loader2, Plus, Sparkles, Eye, EyeOff, Pencil, Save, X, RefreshCw, Clock, CheckCircle2, AlertCircle, Upload, XCircle, FileText, ShieldCheck } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ForbiddenError } from "@/components/ForbiddenError";
import type { Circular } from "@/hooks/useCirculars";
import { duplicateStatusLabel, reviewActionPatch, reviewStatusLabel, type CircularReviewAction } from "@/lib/circularNoticeLifecycle";

type SyncStatus = {
  source_code: string;
  sync_enabled: boolean;
  sync_interval_hours: number;
  sync_status: string;
  scheduler_active: boolean;
  schedule: string | null;
  last_attempted_at: string | null;
  last_success_at: string | null;
  next_scheduled_at: string | null;
  new_circulars: number;
  updated_circulars: number;
  duplicate_circulars: number;
  last_error: string | null;
};

export default function AdminCircularsPage() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [circularNumber, setCircularNumber] = useState("");
  const [circularDate, setCircularDate] = useState("");
  const [hajjYear, setHajjYear] = useState("2027");
  const [sourceUrl, setSourceUrl] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("normal");
  const [source, setSource] = useState("HCI");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEn, setEditEn] = useState("");
  const [editHi, setEditHi] = useState("");
  const [editUr, setEditUr] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editTitleHi, setEditTitleHi] = useState("");
  const [editTitleUr, setEditTitleUr] = useState("");
  const [editYear, setEditYear] = useState("2027");
  const [editStatus, setEditStatus] = useState("updated");

  const SOURCE_LABELS: Record<string, string> = {
    HCI: "Haj Committee of India",
    MoMA: "Ministry of Minority Affairs",
    State_Haj: "State Haj Committee",
    Saudi_MoHU: "Saudi Ministry of Hajj & Umrah",
    Nusuk: "Nusuk Platform",
    GACA: "GACA (Saudi Aviation)",
    MoFA_KSA: "Saudi Ministry of Foreign Affairs",
    Other: "Other Official Source",
  };

  const circularsQuery = useQuery({
    queryKey: ["admin-circulars"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hajj_circulars")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Circular[];
    },
  });

  const fetchLogQuery = useQuery({
    queryKey: ["circular-fetch-log"],
    enabled: isAdmin,
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("circular_fetch_log")
        .select("id, ran_at, success, added_count, updated_count, duplicate_count, error_code, message, triggered_by")
        .order("ran_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const syncStatusQuery = useQuery({
    queryKey: ["circular-sync-status"],
    enabled: isAdmin,
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_hci_circular_sync_status");
      if (error) throw error;
      return (data?.[0] || null) as SyncStatus | null;
    },
  });

  const manualFetchMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-hci-circulars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ manual: true }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || "Fetch failed");
      return json;
    },
    onSuccess: (json) => {
      toast({ title: "Fetch complete", description: json.message });
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
      queryClient.invalidateQueries({ queryKey: ["circular-fetch-log"] });
      queryClient.invalidateQueries({ queryKey: ["circular-sync-status"] });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });


  const createMutation = useMutation({
    mutationFn: async () => {
      let attachmentPath: string | undefined;
      let publicUrl = sourceUrl || undefined;
      if (attachment) {
        const extension = attachment.name.split(".").pop()?.toLowerCase() || "file";
        const path = `${user?.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("circular-files").upload(path, attachment, { upsert: false, contentType: attachment.type });
        if (uploadError) throw uploadError;
        attachmentPath = path;
        publicUrl = supabase.storage.from("circular-files").getPublicUrl(path).data.publicUrl;
      }
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-circular`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ title, original_content: content, hajj_year: hajjYear, circular_number: circularNumber, circular_date: circularDate, official_url: sourceUrl || publicUrl, document_url: publicUrl, source_url: publicUrl, attachment_path: attachmentPath, category, priority, status: priority === "high" || priority === "urgent" ? "important" : "new", issuing_authority: SOURCE_LABELS[source] || source, source, source_name_display: SOURCE_LABELS[source] || source }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not publish circular");
      return result;
    },
    onSuccess: (result) => {
      toast({ title: "Circular published", description: result.delivery?.sent ? `Sent to ${result.delivery.sent} subscribed devices.` : "Live in all active apps now." });
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
      setShowForm(false);
      setTitle(""); setContent(""); setCircularNumber(""); setCircularDate(""); setHajjYear("2027"); setSourceUrl(""); setAttachment(null);
      setSource("HCI");
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const summarizeMutation = useMutation({
    mutationFn: async (circularId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/summarize-circular`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ circular_id: circularId }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Failed to summarize");
      }
      return resp.json();
    },
    onSuccess: () => {
      toast({ title: "AI summaries generated!" });
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: CircularReviewAction }) => {
      const { error } = await supabase
        .from("hajj_circulars")
        .update(reviewActionPatch(action))
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      const labels: Record<CircularReviewAction, string> = { verify: "Circular verified", publish: "Circular published", reject: "Circular rejected", archive: "Circular archived" };
      toast({ title: labels[variables.action] });
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
      queryClient.invalidateQueries({ queryKey: ["hajj-circulars"] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (e: Error) => toast({ title: "Review action failed", description: e.message, variant: "destructive" }),
  });

  const updateSummariesMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("hajj_circulars")
        .update({
          title: editTitle,
          title_hi: editTitleHi || null,
          title_ur: editTitleUr || null,
          summary_en: editEn || null,
          summary_hi: editHi || null,
          summary_ur: editUr || null,
          hajj_year: editYear,
          status: editStatus,
          ai_processed: true,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Summaries updated" });
      queryClient.invalidateQueries({ queryKey: ["admin-circulars"] });
      queryClient.invalidateQueries({ queryKey: ["hajj-circulars"] });
      setEditingId(null);
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEdit = (c: Circular) => {
    setEditingId(c.id);
    setEditTitle(c.title || "");
    setEditTitleHi(c.title_hi || "");
    setEditTitleUr(c.title_ur || "");
    setEditYear(c.hajj_year || "2027");
    setEditStatus(c.status || "updated");
    setEditEn(c.summary_en || "");
    setEditHi(c.summary_hi || "");
    setEditUr(c.summary_ur || "");
  };

  const duplicateCounts = new Map<string, number>();
  (circularsQuery.data || []).forEach((item) => {
    if (item.external_id) duplicateCounts.set(item.external_id, (duplicateCounts.get(item.external_id) || 0) + 1);
  });

  if (!isAdmin) return <MainLayout><ForbiddenError /></MainLayout>;

  return (
    <MainLayout>
      <PageHeader title="Hajj Circular Management" subtitle="Review, publish and monitor official Hajj 2027 updates without mixing previous years" />
      <div className="px-4 pb-24 max-w-4xl mx-auto space-y-4">
        {(() => {
          const logs = fetchLogQuery.data || [];
          const lastSuccess = logs.find((l: { success: boolean }) => l.success);
          const lastRun = logs[0];
          const status = syncStatusQuery.data;
          const schedulerActive = Boolean(status?.scheduler_active && status.sync_enabled);
          const dateLabel = (value: string | null | undefined) => value ? `${format(new Date(value), "dd MMM yyyy, HH:mm")} · ${formatDistanceToNow(new Date(value), { addSuffix: true })}` : "Not recorded";
          return (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Official HCoI Monitor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">Automatic synchronization:</span>
                  <Badge variant={schedulerActive ? "default" : "secondary"}>{schedulerActive ? "ACTIVE" : "INACTIVE"}</Badge>
                  {status?.schedule ? ` · every ${status.sync_interval_hours} hours (${status.schedule})` : ""}
                </p>
                {status && (
                  <div className="grid gap-2 sm:grid-cols-2 text-muted-foreground">
                    <p><span className="font-medium text-foreground">Last attempted:</span> {dateLabel(status.last_attempted_at)}</p>
                    <p><span className="font-medium text-foreground">Last successful:</span> {dateLabel(status.last_success_at)}</p>
                    <p><span className="font-medium text-foreground">Next scheduled:</span> {dateLabel(status.next_scheduled_at)}</p>
                    <p><span className="font-medium text-foreground">Latest results:</span> +{status.new_circulars} new · {status.updated_circulars} updated · {status.duplicate_circulars} duplicates skipped</p>
                  </div>
                )}
                {lastSuccess ? (
                  <p className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="font-medium">Last successful fetch:</span>{" "}
                    {format(new Date(lastSuccess.ran_at), "dd MMM yyyy, HH:mm")} ·{" "}
                    {formatDistanceToNow(new Date(lastSuccess.ran_at), { addSuffix: true })} ·{" "}
                    +{lastSuccess.added_count} added · {(lastSuccess as { updated_count?: number }).updated_count || 0} updated · {(lastSuccess as { duplicate_count?: number }).duplicate_count || 0} duplicates ({lastSuccess.triggered_by})
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-3 h-3" /> No successful fetch recorded yet.
                  </p>
                )}
                {((status?.last_error) || (lastRun && !lastRun.success)) && (
                  <p className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    <span className="font-medium">Last error:</span> {status?.last_error || lastRun?.message}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => manualFetchMutation.mutate()}
                  disabled={manualFetchMutation.isPending}
                  className="mt-1"
                >
                  {manualFetchMutation.isPending ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3 mr-1" />
                  )}
                  Check official HCoI updates
                </Button>
                <p className="text-[11px] text-muted-foreground">Only allow-listed official sources are checked. AI summaries are optional enrichment; missing AI credentials never block official circular ingestion. New detections remain <strong>Awaiting Admin Review</strong> until an administrator verifies and publishes them.</p>
              </CardContent>
            </Card>
          );
        })()}

        {(() => {
          const detected = (circularsQuery.data || []).filter((c) => c.auto_scraped && !c.is_published).slice(0, 5);
          if (!detected.length) return null;
          return (
            <Card className="border-sky-300 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm"><Sparkles className="h-4 w-4 text-sky-600" />New Hajj 2027 Circular Detected</CardTitle>
                <p className="text-xs text-muted-foreground">Review the original official source before publishing this update to pilgrims.</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {detected.map((item) => <div key={item.id} className="flex flex-col gap-2 rounded-xl border bg-background/80 p-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate text-sm font-medium">{item.title}</p><p className="text-xs text-muted-foreground">Hajj {item.hajj_year} · {item.issuing_authority || item.source_name_display || item.source} · {item.circular_date || "Date pending"}</p></div>{(item.official_url || item.source_url) && <Button size="sm" variant="outline" asChild><a href={item.official_url || item.source_url || "#"} target="_blank" rel="noopener noreferrer">View official source</a></Button>}</div>)}
              </CardContent>
            </Card>
          );
        })()}

        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          <Plus className="w-4 h-4 mr-2" />{showForm ? "Cancel" : "New Circular"}
        </Button>


        {showForm && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
              <Select value={hajjYear} onValueChange={setHajjYear}>
                <SelectTrigger><SelectValue placeholder="Hajj year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2027">Hajj 2027 · Current</SelectItem>
                  <SelectItem value="2028">Hajj 2028 · Future</SelectItem>
                  <SelectItem value="2026">Hajj 2026</SelectItem>
                  <SelectItem value="2025">Hajj 2025</SelectItem>
                </SelectContent>
              </Select>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
              <Input placeholder="Title (English)" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea placeholder="Full circular content..." value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Circular No." value={circularNumber} onChange={(e) => setCircularNumber(e.target.value)} />
                <Input type="date" value={circularDate} onChange={(e) => setCircularDate(e.target.value)} />
              </div>
              <Input placeholder="Official source URL (required for verification)" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="ministry">Ministry of Minority Affairs</SelectItem>
                    <SelectItem value="hci">Haj Committee of India</SelectItem>
                    <SelectItem value="state">State Haj Committee</SelectItem>
                    <SelectItem value="saudi">Saudi Arabia</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Attachment (PDF, image, or text; max 15 MB)</label>
                <Input type="file" accept="application/pdf,image/jpeg,image/png,image/webp,text/plain" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
              </div>
              <Button onClick={() => createMutation.mutate()} disabled={!title || !content || createMutation.isPending}>
                {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Publish Circular
              </Button>
            </CardContent>
          </Card>
        )}

        {circularsQuery.data?.map((c) => {
          const reviewStatus = c.review_status || (c.is_published ? "published" : "pending_review");
          const duplicateCount = c.external_id ? (duplicateCounts.get(c.external_id) || 1) : 0;
          const dateLabel = (value: string | null | undefined) => value ? format(new Date(value), "dd MMM yyyy, HH:mm") : "Not recorded";
          return (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm">{c.title}</CardTitle>
                <div className="flex gap-1">
                  <Badge variant={c.is_published ? "default" : reviewStatus === "rejected" || reviewStatus === "archived" ? "destructive" : "secondary"}>
                    {reviewStatusLabel(reviewStatus, c.is_published)}
                  </Badge>
                  {c.ai_processed && <Badge variant="outline" className="text-xs">AI ✓</Badge>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Hajj {c.hajj_year} · {dateLabel(c.created_at)} · <span className="font-medium">{c.issuing_authority || c.source_name_display || c.source}</span></p>
            </CardHeader>
            <CardContent className="pt-0">
              {editingId === c.id ? (
                <div className="space-y-2 mb-3 p-3 rounded-md bg-muted/40 border">
                  <p className="text-xs font-semibold">Edit Title & Summaries</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={editYear} onValueChange={setEditYear}>
                      <SelectTrigger><SelectValue placeholder="Hajj year" /></SelectTrigger>
                      <SelectContent><SelectItem value="2027">Hajj 2027 · Current</SelectItem><SelectItem value="2028">Hajj 2028 · Future</SelectItem><SelectItem value="2026">Hajj 2026</SelectItem><SelectItem value="2025">Hajj 2025</SelectItem><SelectItem value="unknown">Unknown / archive</SelectItem></SelectContent>
                    </Select>
                    <Select value={editStatus} onValueChange={setEditStatus}>
                      <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                      <SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="updated">Updated</SelectItem><SelectItem value="important">Important</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <Input placeholder="Title (EN)" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <Input placeholder="Title (HI)" value={editTitleHi} onChange={(e) => setEditTitleHi(e.target.value)} />
                  <Input placeholder="Title (UR)" value={editTitleUr} onChange={(e) => setEditTitleUr(e.target.value)} dir="rtl" />
                  <Textarea placeholder="Summary (English)" value={editEn} onChange={(e) => setEditEn(e.target.value)} rows={3} />
                  <Textarea placeholder="Summary (Hindi)" value={editHi} onChange={(e) => setEditHi(e.target.value)} rows={3} />
                  <Textarea placeholder="Summary (Urdu)" value={editUr} onChange={(e) => setEditUr(e.target.value)} rows={3} dir="rtl" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateSummariesMutation.mutate(c.id)} disabled={updateSummariesMutation.isPending}>
                      {updateSummariesMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="w-3 h-3 mr-1" />Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
              <div className="mb-3 grid gap-1 rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground sm:grid-cols-2">
                <p><span className="font-semibold text-foreground">Circular number:</span> {c.circular_number || "Not recorded"}</p>
                <p><span className="font-semibold text-foreground">Issue date:</span> {c.circular_date || "Not recorded"}</p>
                <p><span className="font-semibold text-foreground">Authority:</span> {c.issuing_authority || c.source_name_display || c.source}</p>
                <p><span className="font-semibold text-foreground">Hajj year:</span> {c.hajj_year}</p>
                <p><span className="font-semibold text-foreground">Detected:</span> {dateLabel(c.detected_at)}</p>
                <p><span className="font-semibold text-foreground">Last checked:</span> {dateLabel(c.last_checked_at)}</p>
                <p><span className="font-semibold text-foreground">Sync source:</span> {c.source}</p>
                <p><span className="font-semibold text-foreground">Duplicate status:</span> {duplicateStatusLabel(duplicateCount, Boolean(c.external_id))}</p>
                <p className="sm:col-span-2"><span className="font-semibold text-foreground">Lifecycle:</span> {reviewStatusLabel(reviewStatus, c.is_published)}</p>
                <p className="sm:col-span-2"><span className="font-semibold text-foreground">Official source:</span> {c.source_name_display || c.issuing_authority || c.source}</p>
              </div>
              {c.summary_en && <p className="text-xs text-muted-foreground mb-1"><span className="font-semibold">EN:</span> {c.summary_en}</p>}
                  {c.summary_hi && <p className="text-xs text-muted-foreground mb-1"><span className="font-semibold">HI:</span> {c.summary_hi}</p>}
                  {c.summary_ur && <p className="text-xs text-muted-foreground mb-2" dir="rtl"><span className="font-semibold">UR:</span> {c.summary_ur}</p>}
                </>
              )}
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="capitalize">{c.status || "updated"}</Badge>
                {!c.ai_processed && (
                  <Button size="sm" variant="outline" onClick={() => summarizeMutation.mutate(c.id)}
                    disabled={summarizeMutation.isPending}>
                    {summarizeMutation.isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    AI Summarize
                  </Button>
                )}
                {editingId !== c.id && (
                  <Button size="sm" variant="outline" onClick={() => startEdit(c)}>
                    <Pencil className="w-3 h-3 mr-1" />Edit Summaries
                  </Button>
                )}
                {(c.official_url || c.source_url) && <Button size="sm" variant="outline" asChild><a href={c.official_url || c.source_url || "#"} target="_blank" rel="noopener noreferrer"><Eye className="w-3 h-3 mr-1" />Preview</a></Button>}
                {c.document_url && c.document_url !== (c.official_url || c.source_url) && <Button size="sm" variant="outline" asChild><a href={c.document_url} target="_blank" rel="noopener noreferrer"><FileText className="w-3 h-3 mr-1" />PDF / document</a></Button>}
                {!c.is_published && reviewStatus !== "verified" && reviewStatus !== "approved" && reviewStatus !== "archived" && <Button size="sm" variant="outline" onClick={() => reviewMutation.mutate({ id: c.id, action: "verify" })} disabled={reviewMutation.isPending}><ShieldCheck className="w-3 h-3 mr-1" />Verify</Button>}
                {!c.is_published && (reviewStatus === "verified" || reviewStatus === "approved") && <Button size="sm" onClick={() => reviewMutation.mutate({ id: c.id, action: "publish" })} disabled={reviewMutation.isPending}><Eye className="w-3 h-3 mr-1" />Publish</Button>}
                {!c.is_published && reviewStatus !== "rejected" && reviewStatus !== "archived" && <Button size="sm" variant="outline" className="text-destructive" onClick={() => reviewMutation.mutate({ id: c.id, action: "reject" })} disabled={reviewMutation.isPending}><XCircle className="w-3 h-3 mr-1" />Reject</Button>}
                {c.is_published && <Button size="sm" variant="outline" onClick={() => reviewMutation.mutate({ id: c.id, action: "reject" })} disabled={reviewMutation.isPending}><EyeOff className="w-3 h-3 mr-1" />Unpublish</Button>}
                {reviewStatus !== "archived" && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => reviewMutation.mutate({ id: c.id, action: "archive" })} disabled={reviewMutation.isPending}><Archive className="w-3 h-3 mr-1" />Archive</Button>}
              </div>
            </CardContent>
          </Card>
        );
        })}
      </div>
    </MainLayout>
  );
}
