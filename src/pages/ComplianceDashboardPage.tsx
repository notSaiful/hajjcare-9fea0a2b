import { useEffect, useState } from "react";
import { useComplianceDashboard } from "@/hooks/useComplianceDashboard";
import { useUserRole } from "@/hooks/useUserRole";
import { SimpleHeader } from "@/components/SimpleHeader";
import { UnauthorizedAlert } from "@/components/UnauthorizedAlert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Shield, FileText, Users, AlertTriangle, Key, Database,
  RefreshCw, Loader2, Clock, CheckCircle2, XCircle,
  ArrowRight, Lock, Eye, Layers, GitBranch,
} from "lucide-react";

const ComplianceDashboardPage = () => {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const {
    data, auditLogs, consentRecords, dsarRequests, breaches,
    isLoading, error, fetchSection,
  } = useComplianceDashboard();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isAdmin) fetchSection("overview");
  }, [isAdmin, fetchSection]);

  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === "audit") fetchSection("audit_logs");
    else if (activeTab === "consent") fetchSection("consent");
    else if (activeTab === "dsar") fetchSection("dsar");
    else if (activeTab === "breaches") fetchSection("breaches");
  }, [activeTab, isAdmin, fetchSection]);

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
          <UnauthorizedAlert requiredRole="admin" pageName="Compliance Dashboard" />
        </main>
      </div>
    );
  }

  const ov = data?.overview;

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Compliance & Audit Center
            </h1>
            <p className="text-sm text-muted-foreground">
              DPDP Act • Saudi PDPL • ISO 27001 • SOC2
              {data?.generated_at && ` • ${new Date(data.generated_at).toLocaleTimeString()}`}
            </p>
          </div>
          <Button onClick={() => fetchSection(activeTab === "overview" ? "overview" : activeTab === "audit" ? "audit_logs" : activeTab)} disabled={isLoading} size="sm">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-4"><p className="text-destructive text-sm">{error}</p></CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="gap-1"><Eye className="w-3.5 h-3.5" /> Overview</TabsTrigger>
            <TabsTrigger value="audit" className="gap-1"><FileText className="w-3.5 h-3.5" /> Audit</TabsTrigger>
            <TabsTrigger value="consent" className="gap-1"><Users className="w-3.5 h-3.5" /> Consent</TabsTrigger>
            <TabsTrigger value="dsar" className="gap-1"><Lock className="w-3.5 h-3.5" /> DSAR</TabsTrigger>
            <TabsTrigger value="lineage" className="gap-1"><GitBranch className="w-3.5 h-3.5" /> Lineage</TabsTrigger>
          </TabsList>

          {/* ═══ OVERVIEW ═══ */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {ov && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <KpiCard icon={<FileText className="w-5 h-5 text-blue-500" />} label="Audit Logs" value={ov.total_audit_logs} />
                  <KpiCard icon={<Users className="w-5 h-5 text-emerald-500" />} label="Consent Records" value={ov.total_consent_records} />
                  <KpiCard icon={<Lock className="w-5 h-5 text-indigo-500" />} label="DSAR Requests" value={ov.total_dsar_requests} />
                  <KpiCard icon={<AlertTriangle className="w-5 h-5 text-red-500" />} label="Breaches" value={ov.total_breaches} highlight={ov.total_breaches > 0} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <KpiCard icon={<Key className="w-5 h-5 text-amber-500" />} label="Encryption Keys" value={ov.total_encryption_keys} />
                  <KpiCard icon={<Database className="w-5 h-5 text-purple-500" />} label="Backups" value={ov.total_backups} />
                  <KpiCard icon={<Clock className="w-5 h-5 text-red-500" />} label="DSAR Overdue" value={ov.dsar_overdue} highlight={ov.dsar_overdue > 0} />
                </div>

                {/* Recent audit activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recent Audit Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data?.recent_audit_logs?.length ? (
                      <div className="space-y-2">
                        {data.recent_audit_logs.map((log, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm p-2 rounded border">
                            <Badge variant="outline" className="text-xs shrink-0">{log.action}</Badge>
                            <span className="capitalize">{log.resource_type}</span>
                            <span className="text-muted-foreground text-xs ml-auto">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No audit activity yet. Logs are recorded automatically when sensitive data is accessed.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Consent breakdown */}
                {Object.keys(ov.consent_by_purpose).length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Consent by Purpose</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(ov.consent_by_purpose).map(([purpose, counts]) => (
                          <div key={purpose} className="flex items-center justify-between text-sm p-2 rounded border">
                            <span className="capitalize">{purpose.replace(/_/g, " ")}</span>
                            <div className="flex gap-2">
                              <Badge variant="default" className="text-xs">{counts.granted} granted</Badge>
                              {counts.withdrawn > 0 && (
                                <Badge variant="destructive" className="text-xs">{counts.withdrawn} withdrawn</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* ═══ AUDIT LOGS ═══ */}
          <TabsContent value="audit" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Data Processing Audit Trail
                  <Badge variant="secondary" className="ml-auto">{auditLogs.length} entries</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-3">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-lg border space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={log.action === "DELETE" ? "destructive" : log.action === "INSERT" ? "default" : "secondary"} className="text-xs">
                            {log.action}
                          </Badge>
                          <span className="text-sm font-medium capitalize">{log.resource_type}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Actor: {log.actor_id?.slice(0, 8) || "system"}...</span>
                          <span>•</span>
                          <span>Resource: {log.resource_id?.slice(0, 8) || "—"}...</span>
                          <span>•</span>
                          <span>Outcome: {log.outcome}</span>
                        </div>
                        {log.data_categories && (
                          <div className="flex gap-1 flex-wrap">
                            {log.data_categories.map((cat) => (
                              <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-12">
                        No audit logs recorded yet. Logs are generated automatically when profiles, health tickets, or locations are modified.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ CONSENT ═══ */}
          <TabsContent value="consent" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Consent Records
                  <Badge variant="secondary" className="ml-auto">{consentRecords.length} records</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-3">
                    {consentRecords.map((c) => (
                      <div key={c.id} className="p-3 rounded-lg border space-y-1">
                        <div className="flex items-center gap-2">
                          {c.status === "granted" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                          <span className="text-sm font-medium capitalize">{c.purpose.replace(/_/g, " ")}</span>
                          <Badge variant={c.status === "granted" ? "default" : "destructive"} className="text-xs ml-auto">
                            {c.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span>Basis: {c.lawful_basis}</span>
                          <span>•</span>
                          <span>Version: {c.consent_version}</span>
                          {c.cross_border_transfer && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">Cross-border</Badge>
                            </>
                          )}
                          {c.expires_at && (
                            <>
                              <span>•</span>
                              <span>Expires: {new Date(c.expires_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Granted: {new Date(c.granted_at).toLocaleString()}
                          {c.withdrawn_at && ` • Withdrawn: ${new Date(c.withdrawn_at).toLocaleString()}`}
                        </div>
                      </div>
                    ))}
                    {consentRecords.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-12">
                        No consent records yet. Records are created when users grant consent for data processing.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ DSAR ═══ */}
          <TabsContent value="dsar" className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Data Subject Access Requests
                  <Badge variant="secondary" className="ml-auto">{dsarRequests.length} requests</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-3">
                    {dsarRequests.map((d) => {
                      const overdue = new Date(d.due_by) < new Date() && !d.completed_at;
                      return (
                        <div key={d.id} className={`p-3 rounded-lg border space-y-1 ${overdue ? "border-destructive bg-destructive/5" : ""}`}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">{d.request_type}</Badge>
                            <Badge variant={d.status === "completed" ? "default" : d.status === "rejected" ? "destructive" : "secondary"} className="text-xs">
                              {d.status}
                            </Badge>
                            {overdue && <Badge variant="destructive" className="text-xs animate-pulse">OVERDUE</Badge>}
                            {d.identity_verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Submitted: {new Date(d.submitted_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Due: {new Date(d.due_by).toLocaleDateString()}</span>
                            {d.completed_at && (
                              <>
                                <span>•</span>
                                <span>Completed: {new Date(d.completed_at).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {dsarRequests.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-12">
                        No data subject requests filed. Users can submit access, erasure, or portability requests.
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ DATA LINEAGE ═══ */}
          <TabsContent value="lineage" className="space-y-4 mt-4">
            {data?.data_lineage && (
              <>
                {/* Audited tables flow */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-primary" />
                      Data Lineage & Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      All sensitive table mutations are automatically captured via the <code className="bg-muted px-1 rounded text-xs">{data.data_lineage.trigger_function}</code> trigger into the immutable audit trail.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
                      {["User Action", "→", "Sensitive Table", "→", "Trigger", "→", "Audit Log", "→", "Compliance Report"].map((s, i) => (
                        s === "→" ? (
                          <ArrowRight key={i} className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Badge key={i} variant="secondary" className="py-1.5 px-3">{s}</Badge>
                        )
                      ))}
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Audited Tables & Data Categories</h4>
                      <div className="grid gap-2">
                        {data.data_lineage.audited_tables.map((table) => (
                          <div key={table} className="flex items-center justify-between p-2.5 rounded-lg border">
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{table}</span>
                            </div>
                            <div className="flex gap-1">
                              {(data.data_lineage.data_categories[table] || []).map((cat) => (
                                <Badge key={cat} variant={cat === "sensitive" || cat === "health" ? "destructive" : "outline"} className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Retention policies */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Data Retention Policies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {Object.entries(data.data_lineage.retention_policies).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-2.5 rounded-lg border text-sm">
                          <span className="capitalize">{key.replace(/_/g, " ")}</span>
                          <Badge variant="secondary">{value}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Encryption standards */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Key className="w-5 h-5 text-primary" />
                      Encryption Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-3">
                      {Object.entries(data.data_lineage.encryption).map(([key, value]) => (
                        <div key={key} className="p-3 rounded-lg border text-center">
                          <p className="text-xs text-muted-foreground capitalize mb-1">{key.replace(/_/g, " ")}</p>
                          <p className="font-semibold text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function KpiCard({ icon, label, value, highlight = false }: {
  icon: React.ReactNode; label: string; value: number; highlight?: boolean;
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

export default ComplianceDashboardPage;
