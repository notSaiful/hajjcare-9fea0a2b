import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Archive,
  Bell,
  Bookmark,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock3,
  ExternalLink,
  FileText,
  Filter,
  Landmark,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { useCirculars, Circular } from "@/hooks/useCirculars";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";

const labels = {
  en: {
    title: "Hajj Circular & Notification Center",
    subtitle: "Official Hajj 2027 circulars, notifications and important updates",
    preparing: "Preparing for Hajj 2027",
    verified: "Verified official sources only",
    current: "Current",
    previous: "Previous Years",
    latest: "Latest updates",
    important: "Important",
    new: "Newly added",
    updated: "Recently updated",
    all: "All",
    search: "Search by title, number, authority or keyword",
    authority: "Authority",
    category: "Category",
    status: "Status",
    date: "Date",
    anyDate: "Any date",
    last30: "Last 30 days",
    last90: "Last 90 days",
    thisYear: "This year",
    noCurrent: "No official Hajj 2027 circular has been added yet. This page will update when official information becomes available.",
    noResults: "No circulars match these filters.",
    readMore: "Read full update",
    collapse: "Hide details",
    officialSource: "Official source",
    download: "View document",
    markRead: "Mark as read",
    saved: "Saved",
    save: "Save",
    removeSaved: "Remove saved",
    refresh: "Refresh",
    updating: "Checking official sources…",
    showingSaved: "Showing saved official updates",
    offline: "Couldn’t get the latest circulars. Showing saved updates; tap Refresh to try again.",
    archiveNote: "Previous-year circulars are preserved here for reference and are never presented as Hajj 2027 guidance.",
    circularNumber: "Circular number",
    issued: "Issued",
    checked: "Last checked",
    official: "Official",
    archived: "Archived",
    noAuthority: "All authorities",
    loadMore: "Load more updates",
  },
  hi: {
    title: "हज परिपत्र और अधिसूचना केंद्र",
    subtitle: "हज 2027 के आधिकारिक परिपत्र, अधिसूचनाएं और महत्वपूर्ण अपडेट",
    preparing: "हज 2027 की तैयारी",
    verified: "केवल सत्यापित आधिकारिक स्रोत",
    current: "वर्तमान",
    previous: "पिछले वर्ष",
    latest: "नवीनतम अपडेट",
    important: "महत्वपूर्ण",
    new: "नए अपडेट",
    updated: "हाल में अपडेट",
    all: "सभी",
    search: "शीर्षक, नंबर, प्राधिकरण या शब्द खोजें",
    authority: "प्राधिकरण",
    category: "श्रेणी",
    status: "स्थिति",
    date: "तिथि",
    anyDate: "कोई भी तिथि",
    last30: "पिछले 30 दिन",
    last90: "पिछले 90 दिन",
    thisYear: "इस वर्ष",
    noCurrent: "अभी तक कोई आधिकारिक हज 2027 परिपत्र नहीं जोड़ा गया है। आधिकारिक जानकारी उपलब्ध होने पर यह पृष्ठ अपडेट होगा।",
    noResults: "इन फ़िल्टर से कोई परिपत्र नहीं मिला।",
    readMore: "पूरा अपडेट पढ़ें",
    collapse: "विवरण छिपाएं",
    officialSource: "आधिकारिक स्रोत",
    download: "दस्तावेज़ देखें",
    markRead: "पढ़ा हुआ चिन्हित करें",
    saved: "सहेजे गए",
    save: "सहेजें",
    removeSaved: "सहेजा हुआ हटाएं",
    refresh: "रिफ्रेश",
    updating: "आधिकारिक स्रोत जांचे जा रहे हैं…",
    showingSaved: "सहेजे गए आधिकारिक अपडेट दिखाए जा रहे हैं",
    offline: "नवीनतम परिपत्र नहीं मिल सके। सहेजे गए अपडेट दिख रहे हैं; फिर प्रयास करने के लिए रिफ्रेश दबाएं।",
    archiveNote: "पिछले वर्षों के परिपत्र संदर्भ के लिए सुरक्षित हैं और इन्हें हज 2027 की जानकारी के रूप में नहीं दिखाया जाता।",
    circularNumber: "परिपत्र संख्या",
    issued: "जारी",
    checked: "अंतिम जांच",
    official: "आधिकारिक",
    archived: "संग्रहीत",
    noAuthority: "सभी प्राधिकरण",
    loadMore: "और अपडेट लोड करें",
  },
  ur: {
    title: "حج سرکلر اور نوٹیفکیشن مرکز",
    subtitle: "حج 2027 کے سرکاری سرکلر، نوٹیفکیشن اور اہم اپ ڈیٹس",
    preparing: "حج 2027 کی تیاری",
    verified: "صرف تصدیق شدہ سرکاری ذرائع",
    current: "موجودہ",
    previous: "گزشتہ سال",
    latest: "تازہ ترین اپ ڈیٹس",
    important: "اہم",
    new: "نئی",
    updated: "حال ہی میں اپ ڈیٹ",
    all: "سب",
    search: "عنوان، نمبر، ادارہ یا لفظ تلاش کریں",
    authority: "ادارہ",
    category: "زمرہ",
    status: "حیثیت",
    date: "تاریخ",
    anyDate: "کوئی بھی تاریخ",
    last30: "گزشتہ 30 دن",
    last90: "گزشتہ 90 دن",
    thisYear: "اس سال",
    noCurrent: "ابھی تک حج 2027 کا کوئی سرکاری سرکلر شامل نہیں کیا گیا۔ سرکاری معلومات دستیاب ہوتے ہی یہ صفحہ اپ ڈیٹ ہوگا۔",
    noResults: "ان فلٹرز سے کوئی سرکلر نہیں ملا۔",
    readMore: "مکمل اپ ڈیٹ پڑھیں",
    collapse: "تفصیل چھپائیں",
    officialSource: "سرکاری ماخذ",
    download: "دستاویز دیکھیں",
    markRead: "پڑھا ہوا نشان زد کریں",
    saved: "محفوظ شدہ",
    save: "محفوظ کریں",
    removeSaved: "محفوظ شدہ ہٹائیں",
    refresh: "ریفریش",
    updating: "سرکاری ذرائع چیک ہو رہے ہیں…",
    showingSaved: "محفوظ شدہ سرکاری اپ ڈیٹس دکھائی جا رہی ہیں",
    offline: "تازہ ترین سرکلر نہیں مل سکے۔ محفوظ شدہ اپ ڈیٹس دکھائی جا رہی ہیں؛ دوبارہ کوشش کے لیے ریفریش دبائیں۔",
    archiveNote: "گزشتہ سالوں کے سرکلر حوالہ کے لیے محفوظ ہیں اور انہیں حج 2027 کی رہنمائی کے طور پر پیش نہیں کیا جاتا۔",
    circularNumber: "سرکلر نمبر",
    issued: "جاری",
    checked: "آخری جانچ",
    official: "سرکاری",
    archived: "محفوظ شدہ",
    noAuthority: "تمام ادارے",
    loadMore: "مزید اپ ڈیٹس لوڈ کریں",
  },
} as const;

type Language = keyof typeof labels;
const getLabels = (language: string) => labels[language as Language] ?? labels.en;

const statusStyle: Record<string, { label: keyof typeof labels.en; className: string }> = {
  new: { label: "new", className: "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200" },
  updated: { label: "updated", className: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200" },
  important: { label: "important", className: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200" },
  archived: { label: "archived", className: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" },
};

const statusLabel = (status: string, l: typeof labels.en) => {
  const key = statusStyle[status]?.label;
  return key === "new" ? l.new : key === "updated" ? l.updated : key === "important" ? l.important : l.archived;
};

const NEW_BADGE_DAYS = 14;

function formatCircularDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : format(date, "dd MMM yyyy");
}

function statusFor(circular: Circular) {
  if (circular.status === "important" || circular.priority === "high" || circular.priority === "urgent") return "important";
  if (circular.status === "archived" || circular.is_current_version === false) return "archived";
  if (circular.status === "new") {
    const detectedAt = new Date(circular.detected_at || circular.created_at).getTime();
    if (Number.isFinite(detectedAt) && Date.now() - detectedAt > NEW_BADGE_DAYS * 86400000) return "updated";
  }
  return circular.status === "new" || circular.status === "updated" ? circular.status : "updated";
}

function CircularCard({
  circular,
  isRead,
  isSaved,
  onMarkRead,
  onToggleSaved,
  lang,
}: {
  circular: Circular;
  isRead: boolean;
  isSaved: boolean;
  onMarkRead: () => void;
  onToggleSaved: () => void;
  lang: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const l = getLabels(lang);
  const status = statusFor(circular);
  const style = statusStyle[status];
  const title = lang === "hi" && circular.title_hi ? circular.title_hi : lang === "ur" && circular.title_ur ? circular.title_ur : circular.title;
  const summary = lang === "hi" && circular.summary_hi ? circular.summary_hi : lang === "ur" && circular.summary_ur ? circular.summary_ur : circular.summary_en;
  const documentUrl = circular.document_url || circular.source_url;
  const officialUrl = circular.official_url || circular.source_url;

  return (
    <Card className={`overflow-hidden border transition-all ${status === "important" ? "border-amber-300 shadow-amber-100/70 dark:border-amber-800" : "border-border/70"}`}>
      <div className={`h-1 ${status === "important" ? "bg-amber-400" : status === "new" ? "bg-sky-400" : status === "updated" ? "bg-violet-400" : "bg-slate-300"}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="border-primary/25 bg-primary/5 text-primary">Hajj {circular.hajj_year === "unknown" ? "—" : circular.hajj_year}</Badge>
              <Badge variant="outline" className={style.className}>{statusLabel(status, l)}</Badge>
              {circular.source_name_display && <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3 w-3" />{circular.source_name_display}</Badge>}
            </div>
            <div className="flex items-start gap-2">
              <CardTitle className="text-base leading-snug sm:text-lg">{title}</CardTitle>
              <TextToSpeechButton text={[title, summary, expanded ? circular.original_content : ""].filter(Boolean).join(". ")} size="icon" variant="ghost" showLabel={false} className="h-8 w-8 shrink-0" />
            </div>
          </div>
          {isRead && <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-emerald-600" aria-label={l.markRead} />}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {circular.circular_number && <span>{l.circularNumber}: <strong className="font-medium text-foreground">{circular.circular_number}</strong></span>}
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{l.issued}: {formatCircularDate(circular.circular_date)}</span>
          <span className="inline-flex items-center gap-1"><Landmark className="h-3.5 w-3.5" />{circular.issuing_authority || circular.source_name_display || circular.source}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {summary && <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Badge variant="secondary" className="capitalize">{circular.category.replace(/_/g, " ")}</Badge>
          {circular.auto_scraped && <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />{l.verified}</span>}
          {circular.last_checked_at && <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{l.checked}: {formatCircularDate(circular.last_checked_at)}</span>}
        </div>
        {expanded && <div className="whitespace-pre-wrap border-t pt-3 text-sm leading-6 text-foreground/90">{circular.original_content}</div>}
        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <Button variant="ghost" size="sm" onClick={onToggleSaved} aria-pressed={isSaved} aria-label={isSaved ? l.removeSaved : l.save}>
            <Bookmark className={`mr-1.5 h-4 w-4 ${isSaved ? "fill-current" : ""}`} />{isSaved ? l.saved : l.save}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setExpanded((value) => !value)}>
            {expanded ? <><ChevronUp className="mr-1.5 h-4 w-4" />{l.collapse}</> : <><ChevronDown className="mr-1.5 h-4 w-4" />{l.readMore}</>}
          </Button>
          {documentUrl && <Button variant="outline" size="sm" asChild><a href={documentUrl} target="_blank" rel="noopener noreferrer"><FileText className="mr-1.5 h-4 w-4" />{l.download}</a></Button>}
          {officialUrl && <Button variant="ghost" size="sm" asChild><a href={officialUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1.5 h-4 w-4" />{l.officialSource}</a></Button>}
          {!isRead && <Button variant="outline" size="sm" onClick={onMarkRead}><CheckCircle className="mr-1.5 h-4 w-4" />{l.markRead}</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CircularsPage() {
  const { circulars, isLoading, isRefreshing, error, lastUpdated, readIds, markRead, refresh, loadMore, hasMore } = useCirculars();
  const { language } = useLanguage();
  const l = getLabels(language);
  const [selectedYear, setSelectedYear] = useState("2027");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [authority, setAuthority] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hajcare-saved-circulars") || "[]");
      if (Array.isArray(saved)) setSavedIds(new Set(saved.filter((id): id is string => typeof id === "string")));
    } catch { /* Optional saved state must never block official updates. */ }
  }, []);

  const years = useMemo(() => {
    const dynamic = circulars.map((c) => c.hajj_year).filter((year) => /^20\d{2}$/.test(year));
    return [...new Set(["2027", "2026", "2025", ...dynamic])].sort((a, b) => Number(b) - Number(a));
  }, [circulars]);
  const categories = useMemo(() => [...new Set(circulars.map((c) => c.category).filter(Boolean))].sort(), [circulars]);
  const authorities = useMemo(() => [...new Set(circulars.map((c) => c.issuing_authority || c.source_name_display || c.source).filter(Boolean))].sort(), [circulars]);

  const toggleSaved = (id: string) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("hajcare-saved-circulars", JSON.stringify([...next]));
      return next;
    });
  };

  const yearCirculars = useMemo(() => circulars.filter((c) => selectedYear === "previous" ? !["2027", "2026", "2025"].includes(c.hajj_year) : c.hajj_year === selectedYear), [circulars, selectedYear]);
  const visibleCirculars = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const cutoff = dateRange === "30" ? Date.now() - 30 * 86400000 : dateRange === "90" ? Date.now() - 90 * 86400000 : dateRange === "year" ? new Date(new Date().getFullYear(), 0, 1).getTime() : 0;
    return yearCirculars.filter((c) => {
      if (savedOnly && !savedIds.has(c.id)) return false;
      if (category !== "all" && c.category !== category) return false;
      if (authority !== "all" && (c.issuing_authority || c.source_name_display || c.source) !== authority) return false;
      if (status !== "all" && statusFor(c) !== status) return false;
      if (cutoff && new Date(c.circular_date || c.created_at).getTime() < cutoff) return false;
      if (!normalizedQuery) return true;
      return [c.title, c.title_hi, c.title_ur, c.summary_en, c.summary_hi, c.summary_ur, c.category, c.source, c.source_name_display, c.issuing_authority, c.circular_number, c.hajj_year]
        .filter(Boolean).some((value) => value!.toLocaleLowerCase().includes(normalizedQuery));
    }).sort((a, b) => {
      const rank = (item: Circular) => statusFor(item) === "important" ? 0 : statusFor(item) === "new" ? 1 : statusFor(item) === "updated" ? 2 : 3;
      return rank(a) - rank(b) || (new Date(b.circular_date || b.created_at).getTime() - new Date(a.circular_date || a.created_at).getTime());
    });
  }, [authority, category, dateRange, query, savedIds, savedOnly, status, yearCirculars]);

  const counts = useMemo(() => ({
    latest: yearCirculars.length,
    important: yearCirculars.filter((c) => statusFor(c) === "important").length,
    newItems: yearCirculars.filter((c) => statusFor(c) === "new").length,
    updated: yearCirculars.filter((c) => statusFor(c) === "updated").length,
  }), [yearCirculars]);

  const selectClass = "h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const isCurrentYearEmpty = selectedYear === "2027" && yearCirculars.length === 0;

  return (
    <MainLayout>
      <SEO title="Hajj Circular & Notification Center" description="Verified official Hajj 2027 circulars, notifications and important updates from authorised government sources." path="/circulars" type="website" jsonLd={{ "@context": "https://schema.org", "@type": "WebPage", headline: "Hajj Circular & Notification Center", description: "Verified official Hajj 2027 circulars and notifications.", url: "https://hajjcare.in/circulars" }} />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-4 sm:px-6">
        <PageHeader title={l.title} subtitle={l.subtitle} icon={Bell} iconVariant="emerald" />

        <section className="relative mt-5 overflow-hidden rounded-3xl border border-emerald-900/15 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-5 text-white shadow-xl sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-white/10 px-3 py-1 text-xs font-semibold text-amber-100"><Sparkles className="h-3.5 w-3.5" />{l.preparing}</div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{l.subtitle}</h2>
              <p className="flex items-center gap-2 text-sm text-emerald-100"><ShieldCheck className="h-4 w-4 text-amber-300" />{l.verified}</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><Landmark className="h-5 w-5 text-amber-300" /><span>HajCare AI<br /><span className="text-xs text-emerald-100">Official information desk</span></span></div>
          </div>
        </section>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Hajj circular year">
          {years.map((year) => <Button key={year} role="tab" aria-selected={selectedYear === year} variant={selectedYear === year ? "default" : "outline"} className="h-11 shrink-0 rounded-xl" onClick={() => setSelectedYear(year)}>Hajj {year}{year === "2027" && <span className="ml-1 text-xs opacity-70">· {l.current}</span>}</Button>)}
          <Button role="tab" aria-selected={selectedYear === "previous"} variant={selectedYear === "previous" ? "default" : "outline"} className="h-11 shrink-0 rounded-xl" onClick={() => setSelectedYear("previous")}><Archive className="mr-1.5 h-4 w-4" />{l.previous}</Button>
        </div>

        {selectedYear === "previous" && <div className="mt-3 flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"><Archive className="mt-0.5 h-4 w-4 shrink-0" />{l.archiveNote}</div>}

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[{ label: l.latest, value: counts.latest, icon: Bell, tone: "text-emerald-600 bg-emerald-500/10" }, { label: l.important, value: counts.important, icon: Landmark, tone: "text-amber-600 bg-amber-500/10" }, { label: l.new, value: counts.newItems, icon: Sparkles, tone: "text-sky-600 bg-sky-500/10" }, { label: l.updated, value: counts.updated, icon: RefreshCw, tone: "text-violet-600 bg-violet-500/10" }].map(({ label, value, icon: Icon, tone }) => <Card key={label} className="border-border/70"><CardContent className="flex items-center gap-3 p-4"><div className={`rounded-xl p-2.5 ${tone}`}><Icon className="h-5 w-5" /></div><div><p className="text-2xl font-bold leading-none">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div></CardContent></Card>)}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={l.search} className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label>
            <Button variant={savedOnly ? "default" : "outline"} className="h-11 rounded-xl" onClick={() => setSavedOnly((value) => !value)} aria-pressed={savedOnly}><Bookmark className={`mr-1.5 h-4 w-4 ${savedOnly ? "fill-current" : ""}`} />{l.saved}</Button>
            <Button variant="outline" className="h-11 rounded-xl" onClick={() => void refresh()} disabled={isRefreshing}><RefreshCw className={`mr-1.5 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />{l.refresh}</Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="sr-only" htmlFor="circular-category">{l.category}</label><select id="circular-category" value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}><option value="all">{l.category}: {l.all}</option>{categories.map((item) => <option key={item} value={item}>{item.replace(/_/g, " ")}</option>)}</select>
            <label className="sr-only" htmlFor="circular-authority">{l.authority}</label><select id="circular-authority" value={authority} onChange={(event) => setAuthority(event.target.value)} className={selectClass}><option value="all">{l.noAuthority}</option>{authorities.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            <label className="sr-only" htmlFor="circular-status">{l.status}</label><select id="circular-status" value={status} onChange={(event) => setStatus(event.target.value)} className={selectClass}><option value="all">{l.status}: {l.all}</option><option value="important">{l.important}</option><option value="new">{l.new}</option><option value="updated">{l.updated}</option><option value="archived">{l.archived}</option></select>
            <label className="sr-only" htmlFor="circular-date">{l.date}</label><select id="circular-date" value={dateRange} onChange={(event) => setDateRange(event.target.value)} className={selectClass}><option value="all">{l.date}: {l.anyDate}</option><option value="30">{l.last30}</option><option value="90">{l.last90}</option><option value="year">{l.thisYear}</option></select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5" aria-live="polite"><Filter className="h-3.5 w-3.5" />{isRefreshing ? l.updating : lastUpdated ? `${l.checked}: ${formatCircularDate(new Date(lastUpdated).toISOString())}` : l.showingSaved}</span><span>{visibleCirculars.length} / {yearCirculars.length}</span></div>
        {error && <div role="alert" className="mt-3 flex gap-2 rounded-xl border border-amber-500/35 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950/25 dark:text-amber-100"><WifiOff className="mt-0.5 h-4 w-4 shrink-0" />{l.offline}</div>}

        {isLoading ? <div className="mt-4 space-y-3">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-48 w-full rounded-2xl" />)}</div> : isCurrentYearEmpty ? <Card className="mt-4 border-dashed"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><Bell className="h-12 w-12 text-muted-foreground/35" /><p className="max-w-lg text-sm text-muted-foreground">{l.noCurrent}</p></CardContent></Card> : visibleCirculars.length === 0 ? <Card className="mt-4 border-dashed"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><Search className="h-10 w-10 text-muted-foreground/35" /><p className="text-sm text-muted-foreground">{l.noResults}</p></CardContent></Card> : <div className="mt-4 space-y-4">{visibleCirculars.map((circular) => <CircularCard key={circular.id} circular={circular} isRead={readIds.has(circular.id)} isSaved={savedIds.has(circular.id)} onMarkRead={() => markRead(circular.id)} onToggleSaved={() => toggleSaved(circular.id)} lang={language} />)}{hasMore && <div className="flex justify-center pt-2"><Button variant="outline" className="rounded-xl" onClick={loadMore} disabled={isRefreshing}>{isRefreshing && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}{l.loadMore}</Button></div>}</div>}
      </div>
    </MainLayout>
  );
}
