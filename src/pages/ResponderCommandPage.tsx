import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useResponderLocation } from "@/hooks/useResponderLocation";
import { UnauthorizedAlert } from "@/components/UnauthorizedAlert";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, Star, BookOpen, MapPin, Clock, ChevronUp, Upload, CheckCircle2,
  AlertTriangle, Activity, Users, Award, FileText, Radio,
} from "lucide-react";
import { toast } from "sonner";

const RANK_CONFIG = {
  trainee: { label: "Trainee", level: 1, color: "bg-slate-500", icon: "🔰" },
  field_responder: { label: "Field Responder", level: 2, color: "bg-emerald-500", icon: "🟢" },
  senior_responder: { label: "Senior Responder", level: 3, color: "bg-blue-500", icon: "🔵" },
  zone_commander: { label: "Zone Commander", level: 4, color: "bg-purple-500", icon: "🟣" },
  war_room_commander: { label: "War Room Commander", level: 5, color: "bg-amber-500", icon: "⭐" },
};

type RankKey = keyof typeof RANK_CONFIG;

export default function ResponderCommandPage() {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, isCoordinator, isMedicalStaff, hasAnyCoordinatorRole } = useUserRole();
  const { isResponder, isTracking, startTracking, stopTracking, setAvailability } = useResponderLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [allResponders, setAllResponders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    const [profileRes, modulesRes, recordsRes, deploymentsRes] = await Promise.all([
      supabase.from("responder_profiles" as any).select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("training_modules" as any).select("*").eq("is_active", true).order("sort_order"),
      supabase.from("training_records" as any).select("*").eq("user_id", user.id),
      supabase.from("deployment_logs" as any).select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    ]);

    setProfile(profileRes.data);
    setModules(modulesRes.data || []);
    setRecords(recordsRes.data || []);
    setDeployments(deploymentsRes.data || []);

    if (hasAnyCoordinatorRole) {
      const [auditRes, respondersRes] = await Promise.all([
        supabase.from("hierarchy_audit_log" as any).select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("responder_profiles" as any).select("*").order("rank"),
      ]);
      setAuditLogs(auditRes.data || []);
      setAllResponders(respondersRes.data || []);
    }

    setLoading(false);
  };

  const createProfile = async () => {
    if (!user) return;
    const { data: p } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle();
    const { error } = await supabase.from("responder_profiles" as any).insert({
      user_id: user.id,
      rank: "trainee",
      specialty: [],
      languages: [],
    });
    if (error) {
      toast.error("Failed to create profile");
    } else {
      toast.success("Responder profile created! You start as Trainee.");
      loadData();
    }
  };

  const enrollInModule = async (moduleId: string) => {
    if (!user) return;
    const { error } = await supabase.from("training_records" as any).upsert({
      user_id: user.id,
      module_id: moduleId,
      status: "enrolled",
      attempts: 0,
    }, { onConflict: "user_id,module_id" });
    if (error) toast.error("Failed to enroll");
    else {
      toast.success("Enrolled in training module");
      loadData();
    }
  };

  const completedModuleIds = useMemo(() => 
    new Set(records.filter(r => r.status === "completed").map(r => r.module_id)),
    [records]
  );

  const trainingProgress = useMemo(() => {
    const mandatory = modules.filter(m => m.is_mandatory);
    const completed = mandatory.filter(m => completedModuleIds.has(m.id));
    return mandatory.length > 0 ? Math.round((completed.length / mandatory.length) * 100) : 0;
  }, [modules, completedModuleIds]);

  const rankStats = useMemo(() => {
    const counts: Record<string, number> = {};
    allResponders.forEach(r => { counts[r.rank] = (counts[r.rank] || 0) + 1; });
    return counts;
  }, [allResponders]);

  if (!isAuthenticated) return <UnauthorizedAlert requiredRole="any_staff" pageName="Command Center" />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const rank = profile?.rank as RankKey | undefined;
  const rankInfo = rank ? RANK_CONFIG[rank] : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Command Center" subtitle="Responder Hierarchy & Operations" />

      <div className="max-w-4xl mx-auto px-4 space-y-6 mt-4">

        {/* Rank & Identity Card */}
        {!profile ? (
          <Card className="border-primary/30">
            <CardContent className="pt-6 text-center space-y-4">
              <Shield className="w-12 h-12 mx-auto text-primary" />
              <h3 className="text-lg font-bold">Join the Response Force</h3>
              <p className="text-sm text-muted-foreground">Register as a responder to access the hierarchy system, training modules, and field deployments.</p>
              <Button onClick={createProfile} className="w-full">
                <Shield className="w-4 h-4 mr-2" /> Enlist as Responder
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-primary/30 overflow-hidden">
            <div className={`h-2 ${rankInfo?.color || "bg-muted"}`} />
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{rankInfo?.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{rankInfo?.label || "Unknown"}</h3>
                    <p className="text-xs text-muted-foreground">Level {rankInfo?.level}/5</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={profile.id_verified ? "default" : "destructive"} className="text-xs">
                    {profile.id_verified ? "✅ Verified" : "⚠️ Unverified"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    BG: {profile.background_check_status}
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-lg font-bold">{profile.total_deployments}</p>
                  <p className="text-[10px] text-muted-foreground">Deployments</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-lg font-bold">{profile.total_incidents_resolved}</p>
                  <p className="text-[10px] text-muted-foreground">Resolved</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-lg font-bold">{profile.performance_score || "—"}</p>
                  <p className="text-[10px] text-muted-foreground">Score</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2">
                  <p className="text-lg font-bold">{profile.avg_response_time_seconds ? `${Math.round(profile.avg_response_time_seconds / 60)}m` : "—"}</p>
                  <p className="text-[10px] text-muted-foreground">Avg Response</p>
                </div>
              </div>

              {/* Field Ready Toggle */}
              <div className="flex items-center justify-between bg-muted/20 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Radio className={`w-5 h-5 ${isTracking ? "text-emerald-500 animate-pulse" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">
                    {isTracking ? "Live — Broadcasting Location" : "Offline — Not Tracking"}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant={isTracking ? "destructive" : "default"}
                  onClick={() => isTracking ? stopTracking() : startTracking(profile.zone)}
                >
                  {isTracking ? "Go Offline" : "Go Live"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="training" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="training" className="text-xs"><BookOpen className="w-3 h-3 mr-1" /> Training</TabsTrigger>
            <TabsTrigger value="deployments" className="text-xs"><MapPin className="w-3 h-3 mr-1" /> Ops</TabsTrigger>
            {hasAnyCoordinatorRole && (
              <TabsTrigger value="roster" className="text-xs"><Users className="w-3 h-3 mr-1" /> Roster</TabsTrigger>
            )}
            <TabsTrigger value="audit" className="text-xs"><FileText className="w-3 h-3 mr-1" /> Audit</TabsTrigger>
          </TabsList>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4">
            {profile && (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Training Progress</CardTitle>
                    <span className="text-sm font-bold text-primary">{trainingProgress}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={trainingProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {records.filter(r => r.status === "completed").length} / {modules.filter(m => m.is_mandatory).length} mandatory modules completed
                  </p>
                </CardContent>
              </Card>
            )}

            {modules.map((mod) => {
              const record = records.find(r => r.module_id === mod.id);
              const isCompleted = record?.status === "completed";
              const isEnrolled = !!record;

              return (
                <Card key={mod.id} className={`transition-all ${isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : ""}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                          )}
                          <h4 className="font-semibold text-sm">{mod.title}</h4>
                        </div>
                        {mod.title_ar && <p className="text-xs text-muted-foreground mb-1" dir="rtl">{mod.title_ar}</p>}
                        <p className="text-xs text-muted-foreground">{mod.description}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px]">{mod.category}</Badge>
                          <Badge variant="outline" className="text-[10px]">{mod.duration_minutes} min</Badge>
                          <Badge variant="outline" className="text-[10px]">Pass: {mod.passing_score}%</Badge>
                          {mod.is_mandatory && <Badge variant="destructive" className="text-[10px]">Mandatory</Badge>}
                        </div>
                      </div>
                      <div className="text-right">
                        {isCompleted ? (
                          <Badge className="bg-emerald-500 text-white text-xs">✅ Passed</Badge>
                        ) : isEnrolled ? (
                          <Badge variant="secondary" className="text-xs">{record.status}</Badge>
                        ) : profile ? (
                          <Button size="sm" variant="outline" onClick={() => enrollInModule(mod.id)}>
                            Enroll
                          </Button>
                        ) : null}
                        {record?.score != null && (
                          <p className="text-xs mt-1 text-muted-foreground">Score: {record.score}%</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Deployments Tab */}
          <TabsContent value="deployments" className="space-y-3">
            {deployments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm">No deployments yet</p>
                </CardContent>
              </Card>
            ) : (
              deployments.map((dep) => (
                <Card key={dep.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={dep.deployment_type === "emergency" ? "destructive" : "secondary"} className="text-xs">
                        {dep.deployment_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(dep.started_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{dep.zone || "General"}</span>
                      <div className="flex items-center gap-2">
                        {dep.outcome && <Badge variant="outline" className="text-xs">{dep.outcome}</Badge>}
                        {dep.performance_rating && (
                          <span className="text-xs font-bold">⭐ {dep.performance_rating}/10</span>
                        )}
                      </div>
                    </div>
                    {dep.duration_minutes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />{dep.duration_minutes} min
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Roster Tab (Admin/Coordinator) */}
          {hasAnyCoordinatorRole && (
            <TabsContent value="roster" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Force Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(Object.entries(RANK_CONFIG) as [RankKey, typeof RANK_CONFIG[RankKey]][]).map(([key, config]) => {
                      const count = rankStats[key] || 0;
                      const pct = allResponders.length > 0 ? Math.round((count / allResponders.length) * 100) : 0;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-lg">{config.icon}</span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span>{config.label}</span>
                              <span className="font-bold">{count} ({pct}%)</span>
                            </div>
                            <Progress value={pct} className="h-1.5 mt-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Total force: {allResponders.length} responders
                  </p>
                </CardContent>
              </Card>

              {/* Responder List */}
              {allResponders.map((r) => {
                const rk = RANK_CONFIG[r.rank as RankKey];
                return (
                  <Card key={r.id} className="border-l-4" style={{ borderLeftColor: `var(--${r.rank === "war_room_commander" ? "amber" : r.rank === "zone_commander" ? "purple" : "primary"})` }}>
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{rk?.icon}</span>
                          <div>
                            <p className="text-sm font-medium">{r.user_id.slice(0, 8)}...</p>
                            <p className="text-xs text-muted-foreground">{rk?.label}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={r.id_verified ? "default" : "outline"} className="text-[10px]">
                            {r.id_verified ? "Verified" : "Pending"}
                          </Badge>
                          <Badge variant={r.is_field_ready ? "default" : "secondary"} className="text-[10px]">
                            {r.is_field_ready ? "Field Ready" : "Not Ready"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          )}

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-3">
            {auditLogs.length === 0 && deployments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm">No audit trail entries yet</p>
                </CardContent>
              </Card>
            ) : (
              (hasAnyCoordinatorRole ? auditLogs : []).map((log) => (
                <Card key={log.id}>
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">{log.action}</Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    {log.previous_value && log.new_value && (
                      <p className="text-xs">
                        <span className="text-muted-foreground">{log.previous_value}</span>
                        <ChevronUp className="w-3 h-3 inline mx-1 rotate-90" />
                        <span className="font-medium text-primary">{log.new_value}</span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
