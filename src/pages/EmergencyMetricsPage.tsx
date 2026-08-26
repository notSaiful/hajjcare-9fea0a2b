import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  TrendingUp,
  Timer,
  Users,
  ShieldAlert,
  RefreshCw,
  Wifi,
  Calendar as CalendarIcon,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DateRangePreset = "7days" | "30days" | "90days" | "custom";

interface DateRange {
  from: Date;
  to: Date;
}

interface HealthTicket {
  id: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  status: string;
  ai_urgency_level: string;
  zone: string | null;
}

interface MetricsData {
  totalTickets: number;
  resolvedTickets: number;
  avgResponseTimeMinutes: number;
  avgResolutionTimeMinutes: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  ticketsByZone: { zone: string; count: number }[];
  ticketsByDay: { date: string; count: number; resolved: number }[];
  urgencyDistribution: { name: string; value: number; color: string }[];
  resolutionRate: number;
}

const labels = {
  title: { en: "Emergency Response Metrics", hi: "आपातकालीन प्रतिक्रिया मेट्रिक्स", ar: "مقاييس الاستجابة للطوارئ" },
  back: { en: "Back", hi: "वापस", ar: "رجوع" },
  totalTickets: { en: "Total Tickets", hi: "कुल टिकट", ar: "إجمالي التذاكر" },
  resolved: { en: "Resolved", hi: "हल किया गया", ar: "تم الحل" },
  avgResponse: { en: "Avg Response Time", hi: "औसत प्रतिक्रिया समय", ar: "متوسط وقت الاستجابة" },
  avgResolution: { en: "Avg Resolution Time", hi: "औसत समाधान समय", ar: "متوسط وقت الحل" },
  resolutionRate: { en: "Resolution Rate", hi: "समाधान दर", ar: "معدل الحل" },
  urgencyBreakdown: { en: "Urgency Breakdown", hi: "तात्कालिकता विश्लेषण", ar: "تحليل الإلحاح" },
  ticketsByZone: { en: "Tickets by Zone", hi: "क्षेत्र के अनुसार टिकट", ar: "التذاكر حسب المنطقة" },
  trendsOverTime: { en: "Trends Over Time", hi: "समय के साथ रुझान", ar: "الاتجاهات بمرور الوقت" },
  critical: { en: "Critical", hi: "गंभीर", ar: "حرج" },
  high: { en: "High", hi: "उच्च", ar: "عالي" },
  medium: { en: "Medium", hi: "मध्यम", ar: "متوسط" },
  low: { en: "Low", hi: "कम", ar: "منخفض" },
  minutes: { en: "min", hi: "मिनट", ar: "دقيقة" },
  noAccess: { en: "Access Denied", hi: "पहुंच अस्वीकृत", ar: "تم رفض الوصول" },
  noAccessDesc: { en: "You don't have permission to view this page.", hi: "आपके पास इस पृष्ठ को देखने की अनुमति नहीं है।", ar: "ليس لديك إذن لعرض هذه الصفحة." },
  submitted: { en: "Submitted", hi: "प्रस्तुत", ar: "مقدم" },
  loading: { en: "Loading metrics...", hi: "मेट्रिक्स लोड हो रहे हैं...", ar: "جاري تحميل المقاييس..." },
  liveUpdates: { en: "Live", hi: "लाइव", ar: "مباشر" },
  dataUpdated: { en: "Data updated", hi: "डेटा अपडेट किया गया", ar: "تم تحديث البيانات" },
  last7Days: { en: "Last 7 days", hi: "पिछले 7 दिन", ar: "آخر 7 أيام" },
  last30Days: { en: "Last 30 days", hi: "पिछले 30 दिन", ar: "آخر 30 يوم" },
  last90Days: { en: "Last 90 days", hi: "पिछले 90 दिन", ar: "آخر 90 يوم" },
  customRange: { en: "Custom range", hi: "कस्टम अवधि", ar: "نطاق مخصص" },
  exportCSV: { en: "Export CSV", hi: "CSV निर्यात", ar: "تصدير CSV" },
  exportReport: { en: "Export Report", hi: "रिपोर्ट निर्यात", ar: "تصدير التقرير" },
  export: { en: "Export", hi: "निर्यात करें", ar: "تصدير" },
  dateRange: { en: "Date Range", hi: "तिथि सीमा", ar: "نطاق التاريخ" },
  from: { en: "From", hi: "से", ar: "من" },
  to: { en: "To", hi: "तक", ar: "إلى" },
  apply: { en: "Apply", hi: "लागू करें", ar: "تطبيق" },
  exportSuccess: { en: "Export successful", hi: "निर्यात सफल", ar: "تم التصدير بنجاح" },
};

const URGENCY_COLORS = {
  critical: "hsl(0, 70%, 50%)",
  high: "hsl(25, 80%, 50%)",
  medium: "hsl(40, 85%, 48%)",
  low: "hsl(155, 55%, 35%)",
};

const EmergencyMetricsPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Date range state
  const [datePreset, setDatePreset] = useState<DateRangePreset>("7days");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [customFromDate, setCustomFromDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [customToDate, setCustomToDate] = useState<Date | undefined>(new Date());
  const [isCustomPopoverOpen, setIsCustomPopoverOpen] = useState(false);

  // Update date range when preset changes
  const handlePresetChange = (preset: DateRangePreset) => {
    setDatePreset(preset);
    const now = new Date();
    
    switch (preset) {
      case "7days":
        setDateRange({ from: subDays(now, 7), to: now });
        break;
      case "30days":
        setDateRange({ from: subDays(now, 30), to: now });
        break;
      case "90days":
        setDateRange({ from: subDays(now, 90), to: now });
        break;
      case "custom":
        setIsCustomPopoverOpen(true);
        break;
    }
  };

  const applyCustomRange = () => {
    if (customFromDate && customToDate) {
      setDateRange({ from: customFromDate, to: customToDate });
      setIsCustomPopoverOpen(false);
    }
  };

  const fetchMetrics = useCallback(async (showToast = false) => {
    try {
      const fromDate = startOfDay(dateRange.from).toISOString();
      const toDate = endOfDay(dateRange.to).toISOString();

      const { data: tickets, error } = await supabase
        .from("health_tickets")
        .select("id, created_at, updated_at, resolved_at, status, ai_urgency_level, zone")
        .gte("created_at", fromDate)
        .lte("created_at", toDate)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const ticketData = (tickets || []) as HealthTicket[];
      const processedMetrics = calculateMetrics(ticketData, dateRange);
      setMetrics(processedMetrics);
      setLastUpdated(new Date());
      
      if (showToast) {
        toast.success(labels.dataUpdated[language] || labels.dataUpdated.en);
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  }, [language, dateRange]);

  // Initial fetch
  useEffect(() => {
    if (!roleLoading && isAdmin) {
      fetchMetrics();
    }
  }, [roleLoading, isAdmin, fetchMetrics]);

  // Real-time subscription
  useEffect(() => {
    if (!isAdmin || !isLive) return;

    const channel = supabase
      .channel("metrics-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "health_tickets",
        },
        () => {
          // Refetch metrics on any change
          fetchMetrics(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, isLive, fetchMetrics]);

  const calculateMetrics = (tickets: HealthTicket[], range: DateRange): MetricsData => {
    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;

    // Calculate response times (time from creation to first update)
    const responseTimes = tickets
      .filter((t) => t.updated_at && t.created_at !== t.updated_at)
      .map((t) => {
        const created = new Date(t.created_at).getTime();
        const updated = new Date(t.updated_at).getTime();
        return (updated - created) / 60000; // Convert to minutes
      });

    const avgResponseTimeMinutes =
      responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 0;

    // Calculate resolution times
    const resolutionTimes = tickets
      .filter((t) => t.resolved_at)
      .map((t) => {
        const created = new Date(t.created_at).getTime();
        const resolved = new Date(t.resolved_at!).getTime();
        return (resolved - created) / 60000; // Convert to minutes
      });

    const avgResolutionTimeMinutes =
      resolutionTimes.length > 0
        ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length)
        : 0;

    // Count by urgency
    const criticalCount = tickets.filter((t) => t.ai_urgency_level === "critical").length;
    const highCount = tickets.filter((t) => t.ai_urgency_level === "high").length;
    const mediumCount = tickets.filter((t) => t.ai_urgency_level === "medium").length;
    const lowCount = tickets.filter((t) => t.ai_urgency_level === "low").length;

    // Group by zone
    const zoneMap = new Map<string, number>();
    tickets.forEach((t) => {
      const zone = t.zone || "Unknown";
      zoneMap.set(zone, (zoneMap.get(zone) || 0) + 1);
    });
    const ticketsByZone = Array.from(zoneMap.entries())
      .map(([zone, count]) => ({ zone, count }))
      .sort((a, b) => b.count - a.count);

    // Group by day based on date range
    const dayMap = new Map<string, { count: number; resolved: number }>();
    const diffDays = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
    const daysToShow = Math.min(diffDays, 30); // Show up to 30 days
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(range.to);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dayMap.set(dateStr, { count: 0, resolved: 0 });
    }

    tickets.forEach((t) => {
      const dateStr = t.created_at.split("T")[0];
      if (dayMap.has(dateStr)) {
        const current = dayMap.get(dateStr)!;
        current.count++;
        if (t.status === "resolved") current.resolved++;
      }
    });

    const ticketsByDay = Array.from(dayMap.entries()).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString(language === "hi" ? "hi-IN" : language === "ar" ? "ar-SA" : "en-US", {
        weekday: daysToShow <= 7 ? "short" : undefined,
        month: "short",
        day: "numeric",
      }),
      count: data.count,
      resolved: data.resolved,
    }));

    // Urgency distribution for pie chart
    const urgencyDistribution = [
      { name: "Critical", value: criticalCount, color: URGENCY_COLORS.critical },
      { name: "High", value: highCount, color: URGENCY_COLORS.high },
      { name: "Medium", value: mediumCount, color: URGENCY_COLORS.medium },
      { name: "Low", value: lowCount, color: URGENCY_COLORS.low },
    ].filter((d) => d.value > 0);

    const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

    return {
      totalTickets,
      resolvedTickets,
      avgResponseTimeMinutes,
      avgResolutionTimeMinutes,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      ticketsByZone,
      ticketsByDay,
      urgencyDistribution,
      resolutionRate,
    };
  };

  const t = (key: keyof typeof labels) => labels[key][language] || labels[key].en;

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <UnauthorizedAlert requiredRole="admin" pageName="Emergency Metrics" />
      </div>
    );
  }

  const chartConfig = {
    count: { label: "Tickets", color: "hsl(var(--chart-1))" },
    resolved: { label: "Resolved", color: "hsl(var(--chart-2))" },
  };

  // Export functions
  const exportToCSV = () => {
    if (!metrics) return;
    
    const headers = [
      "Metric",
      "Value",
    ];
    
    const rows = [
      ["Report Period", `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`],
      ["Total Tickets", metrics.totalTickets.toString()],
      ["Resolved Tickets", metrics.resolvedTickets.toString()],
      ["Resolution Rate", `${metrics.resolutionRate}%`],
      ["Avg Response Time (min)", metrics.avgResponseTimeMinutes.toString()],
      ["Avg Resolution Time (min)", metrics.avgResolutionTimeMinutes.toString()],
      ["Critical Count", metrics.criticalCount.toString()],
      ["High Count", metrics.highCount.toString()],
      ["Medium Count", metrics.mediumCount.toString()],
      ["Low Count", metrics.lowCount.toString()],
      [""],
      ["Zone", "Count"],
      ...metrics.ticketsByZone.map(z => [z.zone, z.count.toString()]),
      [""],
      ["Date", "Submitted", "Resolved"],
      ...metrics.ticketsByDay.map(d => [d.date, d.count.toString(), d.resolved.toString()]),
    ];
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `emergency-metrics-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(t("exportSuccess"));
  };

  const exportReport = () => {
    if (!metrics) return;

    const reportContent = `
EMERGENCY RESPONSE METRICS REPORT
=================================
Generated: ${format(new Date(), "PPP p")}
Period: ${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}

KEY PERFORMANCE INDICATORS
--------------------------
Total Tickets: ${metrics.totalTickets}
Resolved Tickets: ${metrics.resolvedTickets}
Resolution Rate: ${metrics.resolutionRate}%
Average Response Time: ${metrics.avgResponseTimeMinutes} minutes
Average Resolution Time: ${metrics.avgResolutionTimeMinutes} minutes

URGENCY BREAKDOWN
-----------------
Critical: ${metrics.criticalCount}
High: ${metrics.highCount}
Medium: ${metrics.mediumCount}
Low: ${metrics.lowCount}

TICKETS BY ZONE
---------------
${metrics.ticketsByZone.map(z => `${z.zone}: ${z.count}`).join("\n")}

DAILY TRENDS
------------
${metrics.ticketsByDay.map(d => `${d.date}: ${d.count} submitted, ${d.resolved} resolved`).join("\n")}
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `emergency-report-${format(new Date(), "yyyy-MM-dd")}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(t("exportSuccess"));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h1 className="font-semibold text-lg hidden sm:block">{t("title")}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="gap-2"
            >
              <Wifi className={`w-4 h-4 ${isLive ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">{t("liveUpdates")}</span>
            </Button>
            
            {/* Manual refresh */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchMetrics(true)}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        
        {/* Date Range & Export Controls */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-border/50 bg-muted/30">
          {/* Date Range Preset Selector */}
          <Select value={datePreset} onValueChange={(v) => handlePresetChange(v as DateRangePreset)}>
            <SelectTrigger className="w-[140px] h-9">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{t("last7Days")}</SelectItem>
              <SelectItem value="30days">{t("last30Days")}</SelectItem>
              <SelectItem value="90days">{t("last90Days")}</SelectItem>
              <SelectItem value="custom">{t("customRange")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Custom Date Range Popover */}
          {datePreset === "custom" && (
            <Popover open={isCustomPopoverOpen} onOpenChange={setIsCustomPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {customFromDate && customToDate 
                      ? `${format(customFromDate, "MMM d")} - ${format(customToDate, "MMM d")}`
                      : t("customRange")
                    }
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">{t("from")}</label>
                    <Calendar
                      mode="single"
                      selected={customFromDate}
                      onSelect={setCustomFromDate}
                      disabled={(date) => date > new Date()}
                      className={cn("p-3 pointer-events-auto border rounded-md")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">{t("to")}</label>
                    <Calendar
                      mode="single"
                      selected={customToDate}
                      onSelect={setCustomToDate}
                      disabled={(date) => date > new Date() || (customFromDate && date < customFromDate)}
                      className={cn("p-3 pointer-events-auto border rounded-md")}
                    />
                  </div>
                  <Button onClick={applyCustomRange} className="w-full">
                    {t("apply")}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Current Date Range Display */}
          <div className="text-xs text-muted-foreground hidden md:block">
            {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
          </div>

          <div className="flex-1" />

          {/* Export Buttons */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t("export")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={exportToCSV}
                  disabled={!metrics}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  {t("exportCSV")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={exportReport}
                  disabled={!metrics}
                >
                  <FileText className="w-4 h-4" />
                  {t("exportReport")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Last updated indicator */}
        {lastUpdated && (
          <div className="px-4 pb-2 text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString(language === "hi" ? "hi-IN" : language === "ar" ? "ar-SA" : "en-US")}
          </div>
        )}
      </header>

      <main className="p-4 space-y-6 pb-8 max-w-6xl mx-auto">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : metrics ? (
          <>
            {/* Key Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("totalTickets")}
                  </CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metrics.totalTickets}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    <Badge variant="destructive" className="text-xs">
                      {metrics.criticalCount} {t("critical")}
                    </Badge>
                    <Badge className="text-xs bg-[hsl(var(--status-warning))]">{metrics.highCount} {t("high")}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("resolutionRate")}
                  </CardTitle>
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[hsl(var(--status-safe))]">
                    {metrics.resolutionRate}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {metrics.resolvedTickets} / {metrics.totalTickets} {t("resolved")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("avgResponse")}
                  </CardTitle>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.avgResponseTimeMinutes}
                    <span className="text-lg font-normal text-muted-foreground ml-1">
                      {t("minutes")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Time to first action
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("avgResolution")}
                  </CardTitle>
                  <Timer className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.avgResolutionTimeMinutes}
                    <span className="text-lg font-normal text-muted-foreground ml-1">
                      {t("minutes")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Time to close ticket
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Urgency Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {t("urgencyBreakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <PieChart>
                      <Pie
                        data={metrics.urgencyDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {metrics.urgencyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {metrics.urgencyDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tickets by Zone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    {t("ticketsByZone")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <BarChart data={metrics.ticketsByZone.slice(0, 6)} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="zone" type="category" width={80} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Trends Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t("trendsOverTime")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={metrics.ticketsByDay}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))" }}
                      name="Submitted"
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-2))" }}
                      name="Resolved"
                    />
                  </LineChart>
                </ChartContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))]" />
                    <span className="text-sm text-muted-foreground">{t("submitted")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]" />
                    <span className="text-sm text-muted-foreground">{t("resolved")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No data available</p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EmergencyMetricsPage;
