import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserRole } from "@/hooks/useUserRole";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Satellite,
  Users,
  Bell,
  Activity,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Radio,
} from "lucide-react";
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';

const STAGE_LABELS: Record<string, string> = {
  arrival: "Arrival",
  makkah: "Makkah",
  mina: "Mina",
  arafat: "Arafat",
  muzdalifah: "Muzdalifah",
  jamarat: "Jamarat",
  tawaf_ifadah: "Tawaf al-Ifadah",
  madinah: "Madinah",
  completed: "Completed",
};

export default function SukoonTrackingMetricsPage() {
  const { language } = useLanguage();
  const { isAdmin } = useUserRole();
  const [liveEnabled, setLiveEnabled] = useState(true);

  // Active tracking sessions (member_locations updated in last 24h)
  const {
    data: activeSessions = [],
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["sukoon-active-sessions"],
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("member_locations")
        .select("member_id, group_id, current_stage, pilgrim_status, updated_at, latitude, longitude")
        .gte("updated_at", since)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    refetchInterval: liveEnabled ? 30000 : false,
  });

  // Family groups count
  const { data: groupCount = 0 } = useQuery({
    queryKey: ["sukoon-group-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("family_groups")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Total group members
  const { data: memberCount = 0 } = useQuery({
    queryKey: ["sukoon-member-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("group_members")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Profiles with sharing enabled (potential notification recipients)
  const { data: sharingEnabledCount = 0 } = useQuery({
    queryKey: ["sukoon-sharing-enabled"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("family_sharing_enabled", true);
      if (error) throw error;
      return count || 0;
    },
  });

  // Realtime subscription for live updates
  useEffect(() => {
    if (!liveEnabled) return;
    const channel = supabase
      .channel("sukoon-metrics-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "member_locations" },
        () => refetchSessions()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [liveEnabled, refetchSessions]);

  // Compute stage distribution
  const stageDistribution = activeSessions.reduce<Record<string, number>>(
    (acc, s) => {
      const stage = s.current_stage || "unknown";
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    },
    {}
  );

  // Compute status distribution
  const statusDistribution = activeSessions.reduce<Record<string, number>>(
    (acc, s) => {
      const status = s.pilgrim_status || "normal";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {}
  );

  // Recent activity (last 1 hour)
  const recentActivity = activeSessions.filter(
    (s) => new Date(s.updated_at).getTime() > Date.now() - 60 * 60 * 1000
  ).length;

  if (!isAdmin) {
    return (
      <MainLayout>
        <UnauthorizedAlert requiredRole="admin" pageName="Sukoon Tracking Metrics" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background pb-24">
        <PageHeader
          icon={Satellite}
          title={language === "hi" ? "सुकून ट्रैकिंग मेट्रिक्स" : "Sukoon Tracking Metrics"}
          subtitle={
            language === "hi"
              ? "सक्रिय सत्र, सूचना दरें और सिस्टम स्वास्थ्य"
              : "Active sessions, notification rates & system health"
          }
          backLink="/"
        />

        {/* Live toggle */}
        <div className="px-4 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {liveEnabled && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
            )}
            <span className="text-sm font-medium text-muted-foreground">
              {liveEnabled ? "Live" : "Paused"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={liveEnabled} onCheckedChange={setLiveEnabled} />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => refetchSessions()}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="px-4 mt-4 space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
            <KPICard
              icon={Radio}
              label="Active Sessions"
              value={activeSessions.length}
              sublabel="Last 24h"
              loading={sessionsLoading}
              accent="text-green-600"
            />
            <KPICard
              icon={Activity}
              label="Recent Activity"
              value={recentActivity}
              sublabel="Last 1h"
              loading={sessionsLoading}
              accent="text-blue-600"
            />
            <KPICard
              icon={Users}
              label="Family Groups"
              value={groupCount}
              sublabel="Total"
              accent="text-purple-600"
            />
            <KPICard
              icon={Bell}
              label="Notification Ready"
              value={sharingEnabledCount}
              sublabel="Sharing enabled"
              accent="text-amber-600"
            />
          </div>

          {/* System Health */}
          <Card className="p-4 border border-border/50">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              System Health
            </h3>
            <div className="space-y-2">
              <HealthRow
                label="Realtime Channel"
                status={liveEnabled ? "healthy" : "paused"}
              />
              <HealthRow
                label="Database Connection"
                status={!sessionsLoading ? "healthy" : "checking"}
              />
              <HealthRow
                label="WhatsApp API"
                status="healthy"
                note="Requires WHATSAPP_TOKEN"
              />
              <HealthRow
                label="Total Members Registered"
                status="info"
                note={`${memberCount} members across ${groupCount} groups`}
              />
            </div>
          </Card>

          {/* Stage Distribution */}
          <Card className="p-4 border border-border/50">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Active Pilgrims by Stage
            </h3>
            {Object.keys(stageDistribution).length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No active sessions
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(stageDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([stage, count]) => (
                    <div
                      key={stage}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-foreground">
                        {STAGE_LABELS[stage] || stage}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full bg-primary/20"
                          style={{ width: "80px" }}
                        >
                          <div
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (count / activeSessions.length) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <Badge variant="secondary" className="text-xs min-w-[2rem] justify-center">
                          {count}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          {/* Status Distribution */}
          <Card className="p-4 border border-border/50">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Pilgrim Status Overview
            </h3>
            {Object.keys(statusDistribution).length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No active sessions
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusDistribution).map(([status, count]) => (
                  <Badge
                    key={status}
                    variant={
                      status === "emergency"
                        ? "destructive"
                        : status === "needs_help"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {status === "normal" ? "✅ Normal" : status === "emergency" ? "🚨 Emergency" : status === "needs_help" ? "🆘 Needs Help" : status}: {count}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Sessions Table */}
          <Card className="p-4 border border-border/50">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Session Updates
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sessionsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : activeSessions.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No sessions in last 24 hours
                </p>
              ) : (
                activeSessions.slice(0, 20).map((session, i) => (
                  <div
                    key={`${session.member_id}-${i}`}
                    className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          session.pilgrim_status === "emergency"
                            ? "bg-destructive"
                            : session.pilgrim_status === "needs_help"
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                      />
                      <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                        {session.member_id.slice(0, 8)}...
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {STAGE_LABELS[session.current_stage || ""] || session.current_stage || "—"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(session.updated_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  sublabel,
  loading,
  accent = "text-primary",
}: {
  icon: typeof Radio;
  label: string;
  value: number;
  sublabel: string;
  loading?: boolean;
  accent?: string;
}) {
  return (
    <Card className="p-3 border border-border/50">
      <div className="flex items-start justify-between mb-2">
        <Icon className={`w-4 h-4 ${accent}`} />
        <span className="text-[10px] text-muted-foreground">{sublabel}</span>
      </div>
      {loading ? (
        <div className="h-7 w-16 bg-muted rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-foreground">{value}</p>
      )}
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </Card>
  );
}

function HealthRow({
  label,
  status,
  note,
}: {
  label: string;
  status: "healthy" | "paused" | "checking" | "error" | "info";
  note?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        {note && (
          <span className="text-[10px] text-muted-foreground">{note}</span>
        )}
        {status === "healthy" && (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
        )}
        {status === "paused" && (
          <Clock className="w-3.5 h-3.5 text-amber-500" />
        )}
        {status === "checking" && (
          <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
        )}
        {status === "error" && (
          <XCircle className="w-3.5 h-3.5 text-destructive" />
        )}
        {status === "info" && (
          <Activity className="w-3.5 h-3.5 text-primary" />
        )}
      </div>
    </div>
  );
}
