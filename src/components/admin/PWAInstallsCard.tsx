import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface WeeklyPoint {
  week: string;
  installs: number;
  cumulative: number;
}

export function PWAInstallsCard() {
  const [total, setTotal] = useState(0);
  const [last7, setLast7] = useState(0);
  const [prev7, setPrev7] = useState(0);
  const [series, setSeries] = useState<WeeklyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Pull all install events (deduped by visitor_id)
      const { data, error } = await supabase
        .from("app_analytics")
        .select("visitor_id, created_at")
        .eq("event_type", "pwa_install")
        .order("created_at", { ascending: true })
        .limit(5000);

      if (error || !data) {
        setLoading(false);
        return;
      }

      // Dedupe — first install timestamp per visitor
      const firstByVisitor = new Map<string, Date>();
      for (const row of data) {
        if (!firstByVisitor.has(row.visitor_id)) {
          firstByVisitor.set(row.visitor_id, new Date(row.created_at));
        }
      }
      const installs = Array.from(firstByVisitor.values()).sort(
        (a, b) => a.getTime() - b.getTime()
      );

      const now = new Date();
      const day = 24 * 60 * 60 * 1000;
      const cutoff7 = new Date(now.getTime() - 7 * day);
      const cutoff14 = new Date(now.getTime() - 14 * day);

      setTotal(installs.length);
      setLast7(installs.filter((d) => d >= cutoff7).length);
      setPrev7(installs.filter((d) => d >= cutoff14 && d < cutoff7).length);

      // Build last 8 weeks bucket
      const weeks: WeeklyPoint[] = [];
      for (let i = 7; i >= 0; i--) {
        const start = new Date(now.getTime() - (i + 1) * 7 * day);
        const end = new Date(now.getTime() - i * 7 * day);
        const count = installs.filter((d) => d >= start && d < end).length;
        weeks.push({
          week: end.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          installs: count,
          cumulative: 0,
        });
      }
      // Cumulative running total (including pre-window installs)
      const baseline = installs.filter(
        (d) => d < new Date(now.getTime() - 8 * 7 * day)
      ).length;
      let cum = baseline;
      for (const w of weeks) {
        cum += w.installs;
        w.cumulative = cum;
      }
      setSeries(weeks);
      setLoading(false);
    };

    load().catch(console.error);
  }, []);

  const growthPct =
    prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : last7 > 0 ? 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          PWA Installs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Total Installs" value={total} />
          <Stat label="Last 7 days" value={last7} />
          <Stat
            label="vs prev 7d"
            value={`${growthPct >= 0 ? "+" : ""}${growthPct}%`}
            badge={
              <Badge
                variant={growthPct >= 0 ? "default" : "destructive"}
                className="text-[10px] gap-0.5"
              >
                <TrendingUp className="w-3 h-3" />
              </Badge>
            }
            highlight={growthPct >= 0}
          />
        </div>

        <div className="h-48">
          {loading ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -10, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="installFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="installs"
                  stroke="hsl(var(--primary))"
                  fill="url(#installFill)"
                  name="New Installs"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground">
          Installs are detected when users open the app from the home screen (standalone mode)
          or accept the install prompt. Counts are deduplicated per device.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  badge,
  highlight,
}: {
  label: string;
  value: string | number;
  badge?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        {badge}
      </div>
      <div
        className={`text-xl font-bold ${
          highlight ? "text-emerald-600 dark:text-emerald-400" : ""
        }`}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </div>
  );
}
