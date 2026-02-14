import { useEffect } from "react";
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';
import { useNavigate } from "react-router-dom";
import { useAdminAIDashboard } from "@/hooks/useAdminAIDashboard";
import { useFraudIntelligence } from "@/hooks/useFraudIntelligence";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Shield,
  MapPin,
  Heart,
  AlertTriangle,
  RefreshCw,
  Activity,
  Users,
  TrendingUp,
  Loader2,
} from "lucide-react";

const AdminAIDashboardPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { data, isLoading, error, fetchDashboard } = useAdminAIDashboard();
  const { results: fraudResults, isLoading: fraudLoading, analyzeAll } = useFraudIntelligence();

  // Access check handled below in render

  useEffect(() => {
    if (isAdmin) {
      fetchDashboard();
    }
  }, [isAdmin, fetchDashboard]);

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
          <UnauthorizedAlert requiredRole="admin" pageName="AI Dashboard" />
        </main>
      </div>
    );
  }

  const modules = [
    { key: "ilm", label: "ILM Engine", icon: Brain, color: "text-emerald-500" },
    { key: "fraud", label: "Fraud Intel", icon: Shield, color: "text-red-500" },
    { key: "tracking", label: "Tracking", icon: MapPin, color: "text-blue-500" },
    { key: "emotional", label: "Emotional", icon: Heart, color: "text-pink-500" },
    { key: "general", label: "General", icon: Activity, color: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">HajjCare AI Command Center</h1>
            <p className="text-muted-foreground text-sm">
              National-level intelligence overview
              {data?.generated_at && ` • Updated ${new Date(data.generated_at).toLocaleTimeString()}`}
            </p>
          </div>
          <Button onClick={() => fetchDashboard()} disabled={isLoading} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-4">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Metrics */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<Users className="w-5 h-5 text-blue-500" />}
              label="Pilgrims Tracked"
              value={data.tracking.pilgrims_tracked}
            />
            <MetricCard
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              label="Active Emergencies"
              value={data.tracking_alerts.critical}
              highlight={data.tracking_alerts.critical > 0}
            />
            <MetricCard
              icon={<Shield className="w-5 h-5 text-amber-500" />}
              label="Fraud Alerts"
              value={data.fraud.active_alerts}
            />
            <MetricCard
              icon={<Activity className="w-5 h-5 text-emerald-500" />}
              label="AI Queries (24h)"
              value={data.ai_usage.total_queries_24h}
            />
          </div>
        )}

        {/* AI Analysis */}
        {data?.ai_analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{data.ai_analysis.risk_summary}</p>

              {data.ai_analysis.recommendations?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {data.ai_analysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.ai_analysis.emergency_priority?.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Emergency Priority</h4>
                  <div className="space-y-2">
                    {data.ai_analysis.emergency_priority.map((ep, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge variant={ep.urgency === "critical" ? "destructive" : "secondary"}>
                          {ep.urgency}
                        </Badge>
                        <span className="text-sm font-medium">{ep.zone}</span>
                        <span className="text-xs text-muted-foreground">— {ep.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Module Usage */}
        {data?.ai_usage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Module Usage (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {modules.map(({ key, label, icon: Icon, color }) => {
                  const count = data.ai_usage.by_module[key] || 0;
                  const total = data.ai_usage.total_queries_24h || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${color} shrink-0`} />
                      <span className="text-sm w-24">{label}</span>
                      <Progress value={pct} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-16 text-right">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fraud Intelligence */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              Fraud Intelligence
            </CardTitle>
            <Button onClick={analyzeAll} disabled={fraudLoading} size="sm" variant="outline">
              {fraudLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Analyze Operators
            </Button>
          </CardHeader>
          <CardContent>
            {data?.fraud.top_risks?.length ? (
              <div className="space-y-3">
                {data.fraud.top_risks.map((risk, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{risk.operator}</p>
                      <p className="text-xs text-muted-foreground">{risk.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={risk.probability * 100}
                        className="w-20 h-2"
                      />
                      <Badge variant={risk.probability > 0.7 ? "destructive" : risk.probability > 0.4 ? "secondary" : "outline"}>
                        {Math.round(risk.probability * 100)}%
                      </Badge>
                      {risk.auto_blacklist && (
                        <Badge variant="destructive">Auto-blacklist</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No high-risk operators detected. Run analysis to scan.</p>
            )}
          </CardContent>
        </Card>

        {/* Health & Tracking Alerts */}
        {data && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tracking Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(data.tracking_alerts.by_type).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="capitalize">{type.replace("_", " ")}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(data.tracking_alerts.by_type).length === 0 && (
                    <p className="text-sm text-muted-foreground">No active tracking alerts</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Open Tickets</span>
                    <Badge variant={data.health_tickets.total > 10 ? "destructive" : "secondary"}>
                      {data.health_tickets.total}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Critical</span>
                    <Badge variant={data.health_tickets.critical > 0 ? "destructive" : "outline"}>
                      {data.health_tickets.critical}
                    </Badge>
                  </div>
                  <Separator />
                  {Object.entries(data.health_tickets.by_zone).map(([zone, count]) => (
                    <div key={zone} className="flex justify-between text-sm">
                      <span className="capitalize">{zone}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

function MetricCard({ icon, label, value, highlight = false }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-destructive" : ""}>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
        <p className={`text-2xl font-bold ${highlight ? "text-destructive" : ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

export default AdminAIDashboardPage;
