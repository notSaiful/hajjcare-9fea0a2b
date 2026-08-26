import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Bell, CalendarDays, ChevronRight, FileText, Globe2, RefreshCw, Search, ShieldCheck, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotices, useNoticeFilters, type Notice } from "@/hooks/useNotices";
import { INDIA_DISTRICT_CATALOG } from "@/data/indiaDistricts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const STATES = Array.from(new Map(INDIA_DISTRICT_CATALOG.map((item) => [item.stateCode, item.state])).entries()).sort((a, b) => a[1].localeCompare(b[1]));
const CATEGORIES = ["official_circular", "hajj_2027", "government_notification", "training", "medical", "travel", "flight", "emergency", "state_update", "general_announcement"];
const categoryLabel = (value: string) => value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const dateLabel = (value: string | null) => value ? format(new Date(value), "dd MMM yyyy") : "Date not available";

function NoticeCard({ notice }: { notice: Notice }) {
  const urgent = notice.priority === "urgent";
  return (
    <Card className={`group overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-lg ${urgent ? "border-destructive/40" : ""}`}>
      <div className={`h-1 ${urgent ? "bg-destructive" : notice.priority === "important" ? "bg-amber-400" : "bg-primary"}`} />
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">{categoryLabel(notice.category)}</Badge>
          {notice.hajj_year !== "unknown" && <Badge variant="outline" className="border-primary/30 text-primary">Hajj {notice.hajj_year}</Badge>}
          {notice.priority !== "normal" && <Badge variant={urgent ? "destructive" : "secondary"}>{notice.priority === "urgent" ? "URGENT" : "IMPORTANT"}</Badge>}
          {Date.now() - new Date(notice.created_at).getTime() < 14 * 86400000 && <Badge className="bg-sky-600">NEW</Badge>}
        </div>
        <CardTitle className="text-lg leading-snug">{notice.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{dateLabel(notice.published_at || notice.created_at)}</span>
          {notice.state_name && <span>{notice.state_name}{notice.district ? ` · ${notice.district}` : ""}</span>}
          {notice.source_name && <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />{notice.source_name}</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{notice.message}</p>
        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <Button size="sm" asChild><Link to={`/notices/${notice.id}`}>View Details <ChevronRight className="ml-1 h-4 w-4" /></Link></Button>
          {notice.document_url && <Button variant="outline" size="sm" asChild><a href={notice.document_url} target="_blank" rel="noopener noreferrer"><FileText className="mr-1.5 h-4 w-4" />Read PDF</a></Button>}
          {notice.source_url && <Button variant="ghost" size="sm" asChild><a href={notice.source_url} target="_blank" rel="noopener noreferrer"><Globe2 className="mr-1.5 h-4 w-4" />Official source</a></Button>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function NoticesPage() {
  const { notices, isLoading, isError, refetch, dataUpdatedAt } = useNotices();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("2027");
  const [category, setCategory] = useState("all");
  const [state, setState] = useState("all");
  const [priority, setPriority] = useState("all");
  const filtered = useNoticeFilters(notices, { query, year, category, state, priority });
  const latestUpdated = dataUpdatedAt ? format(new Date(dataUpdatedAt), "dd MMM yyyy, HH:mm") : "—";
  const grouped = useMemo(() => ({ live: filtered.filter((n) => n.priority === "urgent"), important: filtered.filter((n) => n.priority === "important"), rest: filtered.filter((n) => n.priority === "normal") }), [filtered]);
  const selectState = async (value: string) => {
    setState(value);
    if (!user) return;
    const selected = STATES.find(([code]) => code === value);
    await supabase.from("profiles").update({ state_code: value === "all" ? null : value, state_name: selected?.[1] || null }).eq("user_id", user.id);
    await refetch();
  };

  return (
    <MainLayout>
      <SEO title="HajCare AI Notice Board" description="Latest official Hajj announcements, circulars, training updates and notifications." path="/notices" />
      <PageHeader title="HajCare AI Notice Board" subtitle="Latest announcements, Hajj updates, training information and important notifications" />
      <div className="mx-auto max-w-6xl space-y-5 px-4 pb-24">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-amber-500/10">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-3"><div className="rounded-2xl bg-primary p-3 text-primary-foreground"><Bell className="h-6 w-6" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Live updates</p><h2 className="mt-1 text-xl font-semibold">Official information, clearly organized</h2><p className="mt-1 text-sm text-muted-foreground">Last updated: {latestUpdated}. Only published notices from authorized sources are shown.</p></div></div>
            <Button variant="outline" onClick={() => void refetch()}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
          </CardContent>
        </Card>

        <Card><CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_160px_220px_180px_150px]">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, notice ID, authority, state…" /></div>
          <Select value={year} onValueChange={setYear}><SelectTrigger><SelectValue placeholder="Hajj year" /></SelectTrigger><SelectContent><SelectItem value="all">All years</SelectItem><SelectItem value="2027">Hajj 2027</SelectItem><SelectItem value="2026">Hajj 2026</SelectItem><SelectItem value="2025">Hajj 2025</SelectItem></SelectContent></Select>
          <Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{CATEGORIES.map((item) => <SelectItem key={item} value={item}>{categoryLabel(item)}</SelectItem>)}</SelectContent></Select>
          <Select value={state} onValueChange={(value) => void selectState(value)}><SelectTrigger><SelectValue placeholder="State" /></SelectTrigger><SelectContent><SelectItem value="all">All India</SelectItem>{STATES.map(([code, name]) => <SelectItem key={code} value={code}>{name}</SelectItem>)}</SelectContent></Select>
          <Select value={priority} onValueChange={setPriority}><SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent><SelectItem value="all">All priority</SelectItem><SelectItem value="urgent">Urgent</SelectItem><SelectItem value="important">Important</SelectItem><SelectItem value="normal">Normal</SelectItem></SelectContent></Select>
        </CardContent></Card>

        {!user && state !== "all" && <p className="text-xs text-muted-foreground">Sign in to securely receive state-specific notices. Guests see All India notices only.</p>}
        {isError && <Card className="border-destructive/30 bg-destructive/5"><CardContent className="flex items-center gap-3 p-5 text-sm"><AlertTriangle className="h-5 w-5 text-destructive" />Unable to load the latest notices. Please refresh and try again.</CardContent></Card>}
        {isLoading ? <div className="grid gap-4 md:grid-cols-2">{[1, 2, 3, 4].map((item) => <Card key={item}><CardContent className="space-y-3 p-5"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-20 w-full" /></CardContent></Card>)}</div> : !filtered.length ? <Card><CardContent className="flex flex-col items-center gap-3 p-12 text-center"><Sparkles className="h-8 w-8 text-primary" /><h2 className="text-lg font-semibold">{year === "2027" ? "No official Hajj 2027 notices have been published yet." : "No notices match your filters."}</h2><p className="max-w-md text-sm text-muted-foreground">Try another category, state or search term. Older-year notices are never presented as Hajj 2027 guidance.</p></CardContent></Card> : <div className="space-y-7">
          {grouped.live.length > 0 && <section><div className="mb-3 flex items-center gap-2"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-destructive" /><h2 className="text-sm font-semibold uppercase tracking-wide">Live updates</h2></div><div className="grid gap-4 md:grid-cols-2">{grouped.live.map((notice) => <NoticeCard key={notice.id} notice={notice} />)}</div></section>}
          {grouped.important.length > 0 && <section><div className="mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /><h2 className="text-sm font-semibold uppercase tracking-wide">Important</h2></div><div className="grid gap-4 md:grid-cols-2">{grouped.important.map((notice) => <NoticeCard key={notice.id} notice={notice} />)}</div></section>}
          <section><div className="mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold uppercase tracking-wide">Latest announcements</h2></div><div className="grid gap-4 md:grid-cols-2">{grouped.rest.map((notice) => <NoticeCard key={notice.id} notice={notice} />)}</div></section>
        </div>}
      </div>
    </MainLayout>
  );
}
