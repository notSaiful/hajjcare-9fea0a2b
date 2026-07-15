import { useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Server, Shield, Wifi, WifiOff, MessageSquare, Bluetooth,
  Clock, Users, Building2, Globe, Scale, Eye, FileCheck,
  CheckCircle2, ArrowRight, Milestone, Layers, Cpu,
  Database, Lock, AlertTriangle, Radio,
} from "lucide-react";

/* ───────── Data ───────── */

const phases = [
  {
    id: 1,
    title: "Phase 1 — Core Infrastructure",
    timeline: "Months 1–4",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/30",
    progress: 35,
    milestones: [
      { name: "Cloud backbone (Mumbai + Jeddah regions)", status: "done" },
      { name: "Edge function deployment pipeline", status: "done" },
      { name: "Offline-first IndexedDB caching layer", status: "done" },
      { name: "Battery-optimized GPS pipeline", status: "done" },
      { name: "SMS fallback via Twilio / WhatsApp Business API", status: "in_progress" },
      { name: "Bluetooth mesh relay (Web BLE scanner)", status: "done" },
      { name: "End-to-end encryption for health & location data", status: "done" },
      { name: "DPDP Act + Saudi PDPL compliance framework", status: "done" },
      { name: "CI/CD + staging/production environments", status: "in_progress" },
      { name: "Load testing (10K concurrent connections)", status: "todo" },
    ],
    manpower: [
      "2× Full-stack engineers",
      "1× DevOps / SRE",
      "1× Security engineer",
      "1× QA lead",
    ],
    infra: [
      "Primary: Supabase + Vercel (ap-south-1)",
      "Secondary: Jeddah edge (me-central-1)",
      "CDN: Cloudflare for static assets",
      "SMS: Twilio programmable messaging",
      "Monitoring: Uptime + Sentry error tracking",
    ],
  },
  {
    id: 2,
    title: "Phase 2 — National Scale Pilot",
    timeline: "Months 5–8",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/30",
    progress: 10,
    milestones: [
      { name: "Pilot with 5 state Haj Committees (10K pilgrims)", status: "todo" },
      { name: "Multi-region database replication (instant failover)", status: "todo" },
      { name: "Real-time national command dashboard stress test", status: "todo" },
      { name: "SHI inspector mobile app hardening", status: "todo" },
      { name: "Volunteer coordination at 3 embarkation points", status: "todo" },
      { name: "Offline emergency mode field testing (Arafat/Mina)", status: "todo" },
      { name: "Government API integration (passport, visa status)", status: "todo" },
      { name: "Disaster management drill simulation", status: "todo" },
      { name: "Accessibility audit (WCAG 2.1 AA)", status: "todo" },
      { name: "Security penetration testing + SOC2 audit", status: "todo" },
    ],
    manpower: [
      "4× Full-stack engineers",
      "2× DevOps / SRE",
      "1× Security engineer",
      "2× QA engineers",
      "1× Product manager",
      "2× Field coordinators",
      "1× Legal / compliance officer",
    ],
    infra: [
      "Multi-region Postgres with read replicas",
      "Redis edge caching for real-time dashboards",
      "Dedicated SMS gateway (high-volume)",
      "BLE mesh relay hardware for testing",
      "Government VPN / secure API tunnel",
      "SOC2 audit infrastructure",
    ],
  },
  {
    id: 3,
    title: "Phase 3 — Government + Saudi Integration",
    timeline: "Months 9–14",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    progress: 0,
    milestones: [
      { name: "Full Haj Committee of India integration", status: "todo" },
      { name: "Saudi MOMRA / Nusuk API integration", status: "todo" },
      { name: "200K+ pilgrim capacity (all Indian states)", status: "todo" },
      { name: "Bi-lingual command center (Eng/Arabic/Urdu/Hindi)", status: "todo" },
      { name: "Real-time crowd density via Saudi telecom data", status: "todo" },
      { name: "Cross-border data sovereignty compliance", status: "todo" },
      { name: "Annual ISO 27001 certification", status: "todo" },
      { name: "Automated DPDP Act annual compliance report", status: "todo" },
      { name: "Saudi DGA (Data & AI Authority) registration", status: "todo" },
      { name: "Open-source community modules", status: "todo" },
    ],
    manpower: [
      "6× Full-stack engineers",
      "3× DevOps / SRE",
      "2× Security engineers",
      "3× QA engineers",
      "1× Product director",
      "4× Field coordinators (India + Saudi)",
      "2× Legal / compliance officers",
      "1× Government liaison",
      "1× Arabic localization specialist",
    ],
    infra: [
      "Sovereign cloud deployment (India + Saudi)",
      "Dedicated government-grade VPN tunnels",
      "HSM (Hardware Security Module) for key management",
      "24/7 NOC (Network Operations Center)",
      "Disaster recovery: RPO < 1 min, RTO < 5 min",
      "Dedicated SMS + voice gateway (Saudi STC)",
    ],
  },
];

const resilienceArch = [
  {
    icon: Globe,
    title: "Multi-Region Hosting",
    desc: "Primary in Mumbai (ap-south-1), hot standby in Jeddah (me-central-1). DNS-level failover via Cloudflare with < 30s switchover. Read replicas serve location queries from nearest region.",
    status: "Phase 1",
  },
  {
    icon: Radio,
    title: "Instant Failover",
    desc: "Database streaming replication with automatic promotion. Edge functions deployed to both regions. Health checks every 10s trigger automatic traffic rerouting. Zero-downtime deployments.",
    status: "Phase 2",
  },
  {
    icon: WifiOff,
    title: "Offline Emergency Mode",
    desc: "IndexedDB caches last 200 location updates + emergency contacts. Service Worker intercepts failed requests and queues for sync. Critical SOS alerts use SMS fallback immediately. Offline-capable dua/health guides.",
    status: "Phase 1 ✅",
  },
  {
    icon: MessageSquare,
    title: "SMS Fallback",
    desc: "When internet fails: SMS-based SOS (text 'HELP' to shortcode). Location shared via Google Maps link in SMS. Health ticket creation via structured SMS. WhatsApp Business API as intermediate fallback layer.",
    status: "Phase 1",
  },
  {
    icon: Bluetooth,
    title: "Bluetooth Relay Backup",
    desc: "Web BLE mesh creates peer-to-peer network among nearby pilgrims. Crowd-sourced location relay when GPS/cellular fails. Emergency broadcasts propagate through BLE mesh within 500m radius. Battery-optimized scanning intervals.",
    status: "Phase 1 ✅",
  },
];

const legalFramework = [
  {
    icon: Scale,
    category: "Legal Compliance",
    items: [
      { law: "India DPDP Act 2023", status: "Implemented", details: "Consent management, data minimization, purpose limitation, breach notification (72h), data fiduciary obligations" },
      { law: "Saudi PDPL", status: "Implemented", details: "Cross-border transfer controls, data localization for Saudi health data, DPO appointment, NDMO registration" },
      { law: "ISO 27001:2022", status: "Phase 2", details: "ISMS framework, risk assessment, access control, cryptography, physical security, supplier management" },
      { law: "SOC2 Type II", status: "Phase 2", details: "Security, availability, processing integrity, confidentiality, privacy — annual audit" },
      { law: "IT Act 2000 (India)", status: "Implemented", details: "Reasonable security practices (S.43A), data protection rules, intermediary guidelines compliance" },
    ],
  },
  {
    icon: Database,
    category: "Data Governance",
    items: [
      { law: "Data Classification", status: "Implemented", details: "4-tier: Public, Internal, Confidential (PII), Restricted (health/biometric). Each tier has encryption, access, and retention rules." },
      { law: "Retention Policy", status: "Implemented", details: "Location data: 90 days post-Hajj. Health records: 1 year. Consent logs: 5 years. Audit trails: 7 years. Auto-purge with cryptographic erasure." },
      { law: "Cross-Border Transfer", status: "Implemented", details: "India↔Saudi transfers via adequacy assessment. Standard contractual clauses. Data localization for health data in originating country." },
      { law: "Access Control Matrix", status: "Implemented", details: "RBAC with 5 roles (user, coordinator, medical_staff, inspector, admin). Principle of least privilege. Session-based JWT with 1h expiry." },
    ],
  },
  {
    icon: Eye,
    category: "Audit & Transparency",
    items: [
      { law: "Automated Audit Trails", status: "Implemented", details: "data_processing_logs table captures every CRUD on sensitive tables (profiles, health_tickets, member_locations). Immutable, append-only." },
      { law: "DSAR Portal", status: "Implemented", details: "data_subject_requests table with 30-day SLA. Supports: access, erasure, portability, rectification. Admin workflow for processing." },
      { law: "Breach Notification", status: "Implemented", details: "data_breach_log with severity classification. 72h DPA notification. Affected user notification. Root cause analysis template." },
      { law: "Transparency Dashboard", status: "Phase 2", details: "Public-facing data practices page. Real-time consent statistics. Annual compliance report generation. Third-party audit results." },
      { law: "Encryption Key Lifecycle", status: "Implemented", details: "encryption_key_registry tracks all keys. AES-256-GCM for data at rest. TLS 1.3 in transit. 90-day rotation policy." },
    ],
  },
];

/* ───────── Component ───────── */

const DeploymentRoadmapPage = () => {
  const [activeTab, setActiveTab] = useState("roadmap");

  const statusIcon = (s: string) => {
    if (s === "done") return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    if (s === "in_progress") return <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />;
    return <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Milestone className="w-6 h-6 text-primary" />
            Deployment Roadmap & Governance
          </h1>
          <p className="text-sm text-muted-foreground">
            3-phase execution plan with resilience architecture and legal compliance framework
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roadmap" className="gap-1.5"><Layers className="w-4 h-4" /> Roadmap</TabsTrigger>
            <TabsTrigger value="resilience" className="gap-1.5"><Server className="w-4 h-4" /> Resilience</TabsTrigger>
            <TabsTrigger value="legal" className="gap-1.5"><Scale className="w-4 h-4" /> Legal</TabsTrigger>
          </TabsList>

          {/* ═══ ROADMAP TAB ═══ */}
          <TabsContent value="roadmap" className="space-y-6 mt-4">
            {phases.map((phase) => (
              <Card key={phase.id} className={`border ${phase.bg}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-lg flex items-center gap-2 ${phase.color}`}>
                      <Cpu className="w-5 h-5" />
                      {phase.title}
                    </CardTitle>
                    <Badge variant="outline">{phase.timeline}</Badge>
                  </div>
                  <Progress value={phase.progress} className="h-2 mt-2" />
                  <span className="text-xs text-muted-foreground">{phase.progress}% complete</span>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Milestones */}
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Key Milestones</h4>
                    <div className="grid gap-1.5">
                      {phase.milestones.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {statusIcon(m.status)}
                          <span className={m.status === "done" ? "line-through opacity-60" : ""}>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Manpower */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <Users className="w-4 h-4" /> Manpower
                      </h4>
                      <ul className="space-y-1">
                        {phase.manpower.map((m, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {m}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Infrastructure */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" /> Infrastructure
                      </h4>
                      <ul className="space-y-1">
                        {phase.infra.map((inf, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {inf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* ═══ RESILIENCE TAB ═══ */}
          <TabsContent value="resilience" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Technical Resilience Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  5-layer failover stack ensuring zero service disruption during Hajj peak operations.
                </p>
              </CardContent>
            </Card>

            {resilienceArch.map((r, i) => (
              <Card key={i}>
                <CardContent className="pt-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                      <r.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm">{r.title}</h3>
                        <Badge variant="outline" className="text-xs">{r.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Architecture diagram */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Failover Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
                  {["GPS + Cell", "→", "Cloud Primary", "→", "Cloud Failover", "→", "SMS Fallback", "→", "BLE Mesh"].map((s, i) => (
                    s === "→" ? (
                      <ArrowRight key={i} className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Badge key={i} variant="secondary" className="py-1.5 px-3">{s}</Badge>
                    )
                  ))}
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Each layer activates automatically when the previous layer fails. Total failover time: &lt; 30 seconds.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ LEGAL TAB ═══ */}
          <TabsContent value="legal" className="space-y-6 mt-4">
            {legalFramework.map((section, si) => (
              <Card key={si}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <section.icon className="w-5 h-5 text-primary" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.items.map((item, ii) => (
                    <div key={ii} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{item.law}</span>
                        <Badge
                          variant={item.status === "Implemented" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {item.status === "Implemented" ? "✓ " : ""}{item.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.details}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Governance model summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Governance Model Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-1.5"><Lock className="w-4 h-4" /> Data Protection Officer</h4>
                    <p className="text-muted-foreground">Appointed DPO per DPDP Act S.10. Responsible for compliance oversight, DSAR processing, and breach response coordination.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Incident Response</h4>
                    <p className="text-muted-foreground">4-tier severity classification. P1 (critical): 15-min response, 72h DPA notification. Automated containment triggers for data breaches.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-1.5"><Shield className="w-4 h-4" /> Annual Audits</h4>
                    <p className="text-muted-foreground">ISO 27001 surveillance audit (annual). SOC2 Type II (annual). VAPT quarterly. DPDP compliance self-assessment (bi-annual).</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-1.5"><Eye className="w-4 h-4" /> Transparency</h4>
                    <p className="text-muted-foreground">Public data practices page. Annual transparency report. Consent statistics dashboard. Open audit findings (redacted) published quarterly.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeploymentRoadmapPage;
