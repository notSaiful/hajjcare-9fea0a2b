import { useEffect } from "react";
import { useNationalCommand } from "@/hooks/useNationalCommand";
import { useUserRole } from "@/hooks/useUserRole";
import { SimpleHeader } from "@/components/SimpleHeader";
import { UnauthorizedAlert } from "@/components/UnauthorizedAlert";
import { ZoneDensityPanel } from "@/components/command/ZoneDensityPanel";
import { ZoneRiskHeatmap } from "@/components/command/ZoneRiskHeatmap";
import { EmergencyQueuePanel } from "@/components/command/EmergencyQueuePanel";
import { VolunteerAllocationPanel } from "@/components/command/VolunteerAllocationPanel";
import { MedicalPredictionPanel } from "@/components/command/MedicalPredictionPanel";
import { CrowdAnalysisPanel } from "@/components/command/CrowdAnalysisPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  RefreshCw,
  Loader2,
  Radio,
  Shield,
  Activity,
  Users,
  Siren,
} from "lucide-react";

const NationalCommandPage = () => {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { data, isLoading, error, fetchData, situationColor, situationBg, isLive } = useNationalCommand();

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, fetchData]);

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-2xl mx-auto px-4 py-16">
          <UnauthorizedAlert requiredRole="admin" pageName="National Command" />
        </main>
      </div>
    );
  }

  const ai = data?.ai_analysis;

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Command Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              National Command Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time Hajj operations intelligence
              {data?.generated_at && ` • ${new Date(data.generated_at).toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <Badge variant="outline" className="gap-1 border-emerald-500/50 text-emerald-600">
                <Radio className="w-3 h-3 animate-pulse" />
                Live
              </Badge>
            )}
            <Button onClick={() => fetchData("full")} disabled={isLoading} size="sm">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              {isLoading ? "Analyzing..." : "AI Analysis"}
            </Button>
            <Button onClick={() => fetchData("raw")} disabled={isLoading} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Quick Refresh
            </Button>
          </div>
        </div>

        {/* Situation Banner */}
        {ai && (
          <Card className={`border ${situationBg}`}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start gap-3">
                <Brain className={`w-6 h-6 mt-0.5 shrink-0 ${situationColor}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold uppercase ${situationColor}`}>
                      Level: {ai.situation_level}
                    </span>
                  </div>
                  <p className="text-sm">{ai.executive_summary}</p>
                  {ai.auto_actions?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ai.auto_actions.map((a, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-4"><p className="text-destructive text-sm">{error}</p></CardContent>
          </Card>
        )}

        {/* KPI Row */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KpiCard icon={<Users className="w-5 h-5 text-blue-500" />} label="Tracked" value={data.density.total_tracked} />
            <KpiCard icon={<Siren className="w-5 h-5 text-red-500" />} label="Emergencies" value={data.density.emergency_count} highlight={data.density.emergency_count > 0} />
            <KpiCard icon={<Activity className="w-5 h-5 text-amber-500" />} label="Health Queue" value={data.health.open_tickets} />
            <KpiCard icon={<Shield className="w-5 h-5 text-indigo-500" />} label="Volunteers" value={data.volunteers.total_available} />
            <KpiCard icon={<Brain className="w-5 h-5 text-emerald-500" />} label="Active Alerts" value={data.alerts.total} />
          </div>
        )}

        {/* Main Grid */}
        {data && (
          <div className="grid lg:grid-cols-2 gap-4">
            <ZoneDensityPanel
              byZone={data.density.by_zone}
              total={data.density.total_tracked}
              emergencyCount={data.density.emergency_count}
            />
            <ZoneRiskHeatmap
              zoneRisks={ai?.zone_risks || []}
              alertsBySeverity={data.alerts.by_severity}
            />
            <EmergencyQueuePanel
              queue={data.health.queue}
              criticalCount={data.health.critical}
            />
            <VolunteerAllocationPanel
              allocations={ai?.volunteer_allocation || []}
              rawVolunteers={data.volunteers}
            />
            <MedicalPredictionPanel predictions={ai?.medical_predictions || []} />
            <CrowdAnalysisPanel crowdAnalysis={ai?.crowd_analysis || null} />
          </div>
        )}
      </div>
    </div>
  );
};

function KpiCard({ icon, label, value, highlight = false }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-destructive" : ""}>
      <CardContent className="pt-3 pb-2.5">
        <div className="flex items-center gap-2 mb-0.5">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
        <p className={`text-xl font-bold ${highlight ? "text-destructive" : ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

export default NationalCommandPage;
