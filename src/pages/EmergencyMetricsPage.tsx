import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  ResponsiveContainer,
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
} from "lucide-react";

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

  useEffect(() => {
    if (!roleLoading && isAdmin) {
      fetchMetrics();
    }
  }, [roleLoading, isAdmin]);

  const fetchMetrics = async () => {
    try {
      const { data: tickets, error } = await supabase
        .from("health_tickets")
        .select("id, created_at, updated_at, resolved_at, status, ai_urgency_level, zone")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const ticketData = (tickets || []) as HealthTicket[];
      const processedMetrics = calculateMetrics(ticketData);
      setMetrics(processedMetrics);
    } catch (err) {
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (tickets: HealthTicket[]): MetricsData => {
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

    // Group by day (last 7 days)
    const dayMap = new Map<string, { count: number; resolved: number }>();
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
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
        weekday: "short",
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
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 space-y-4">
            <ShieldAlert className="w-16 h-16 mx-auto text-destructive" />
            <h2 className="text-xl font-semibold">{t("noAccess")}</h2>
            <p className="text-muted-foreground">{t("noAccessDesc")}</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              {t("back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chartConfig = {
    count: { label: "Tickets", color: "hsl(var(--chart-1))" },
    resolved: { label: "Resolved", color: "hsl(var(--chart-2))" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="font-semibold text-lg">{t("title")}</h1>
          </div>
        </div>
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
                    <Badge className="text-xs bg-orange-500">{metrics.highCount} {t("high")}</Badge>
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
