import { useState, useEffect, useCallback } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { UnauthorizedAlert } from "@/components/UnauthorizedAlert";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import {
  Loader2,
  RefreshCw,
  Users,
  MapPin,
  TrendingDown,
  Activity,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PWAInstallsCard } from "@/components/admin/PWAInstallsCard";

interface CohortRow {
  cohort_week: number;
  cohort_label: string;
  users: number;
  retention: number[];
}

interface FunnelStep {
  stage: string;
  count: number;
  pct: number;
}

interface AnalyticsData {
  cohorts: CohortRow[];
  funnel: FunnelStep[];
  summary: {
    total_users: number;
    active_this_week: number;
    family_adoption: number;
    tracking_adoption: number;
  };
  generated_at: string;
}

const FUNNEL_COLORS = [
  "hsl(var(--primary))",
  "hsl(142 71% 45%)",
  "hsl(217 91% 60%)",
  "hsl(38 92% 50%)",
  "hsl(280 67% 55%)",
];

const RETENTION_COLORS = [
  "bg-primary/10 text-primary",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "bg-red-500/15 text-red-700 dark:text-red-400",
];

function getRetentionColor(pct: number): string {
  if (pct >= 60) return "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300";
  if (pct >= 30) return "bg-amber-500/20 text-amber-800 dark:text-amber-300";
  if (pct > 0) return "bg-red-500/15 text-red-700 dark:text-red-400";
  return "bg-muted/30 text-muted-foreground";
}

const AdminAnalyticsPage = () => {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("analytics-cohort", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      setData(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchAnalytics();
  }, [isAdmin, fetchAnalytics]);

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-2xl mx-auto px-4 py-16">
          <UnauthorizedAlert requiredRole="admin" pageName="Analytics" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              HajjCare Analytics
            </h1>
            <p className="text-muted-foreground text-sm">
              Cohort retention &amp; user journey funnel
              {data?.generated_at && ` • ${new Date(data.generated_at).toLocaleTimeString()}`}
            </p>
          </div>
          <Button onClick={fetchAnalytics} disabled={loading} size="sm">
            <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-4">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading && !data && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {data && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard icon={<Users className="w-5 h-5 text-primary" />} label="Total Users" value={data.summary.total_users} />
              <KpiCard icon={<Activity className="w-5 h-5 text-emerald-500" />} label="Active This Week" value={data.summary.active_this_week} />
              <KpiCard icon={<Users className="w-5 h-5 text-sky-500" />} label="Family Adoption" value={`${data.summary.family_adoption}%`} />
              <KpiCard icon={<MapPin className="w-5 h-5 text-amber-500" />} label="Tracking Adoption" value={`${data.summary.tracking_adoption}%`} />
            </div>

            {/* PWA Installs Tracking */}
            <PWAInstallsCard />

            {/* Funnel Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  Pilgrim Journey Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.funnel} layout="vertical" margin={{ left: 20, right: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, "dataMax"]} hide />
                      <YAxis
                        type="category"
                        dataKey="stage"
                        width={130}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                          `${value} users (${props.payload.pct}%)`,
                          "Count",
                        ]}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
                        {data.funnel.map((_, i) => (
                          <Cell key={i} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} />
                        ))}
                        <LabelList
                          dataKey="pct"
                          position="right"
                          formatter={(v: number) => `${v}%`}
                          style={{ fontSize: 12, fontWeight: 600 }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Drop-off insights */}
                <div className="mt-4 space-y-2">
                  {data.funnel.slice(1).map((step, i) => {
                    const prev = data.funnel[i];
                    const dropoff = prev.count > 0 ? Math.round(((prev.count - step.count) / prev.count) * 100) : 0;
                    return dropoff > 0 ? (
                      <div key={step.stage} className="flex items-center gap-2 text-sm">
                        <Badge variant={dropoff > 50 ? "destructive" : "secondary"} className="text-xs">
                          −{dropoff}%
                        </Badge>
                        <span className="text-muted-foreground">
                          drop from <strong>{prev.stage}</strong> → <strong>{step.stage}</strong>
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Cohort Retention Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Cohort Retention (Weekly)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.cohorts.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    Not enough data for cohort analysis yet. Users need to sign up across multiple weeks.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left py-2 pr-4 font-medium text-muted-foreground whitespace-nowrap">Cohort</th>
                          <th className="text-center py-2 px-2 font-medium text-muted-foreground">Users</th>
                          {[0, 1, 2, 3, 4, 5, 6].map((w) => (
                            <th key={w} className="text-center py-2 px-2 font-medium text-muted-foreground">
                              W{w}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.cohorts.map((cohort) => (
                          <tr key={cohort.cohort_week} className="border-t border-border/30">
                            <td className="py-2 pr-4 whitespace-nowrap font-medium">{cohort.cohort_label}</td>
                            <td className="py-2 px-2 text-center">
                              <Badge variant="outline" className="text-xs">{cohort.users}</Badge>
                            </td>
                            {[0, 1, 2, 3, 4, 5, 6].map((w) => (
                              <td key={w} className="py-2 px-1 text-center">
                                {w < cohort.retention.length ? (
                                  <span
                                    className={cn(
                                      "inline-block w-12 py-1 rounded text-xs font-semibold",
                                      getRetentionColor(cohort.retention[w])
                                    )}
                                  >
                                    {cohort.retention[w]}%
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/30">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default AdminAnalyticsPage;
