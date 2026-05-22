import { useState, useEffect, useMemo, useCallback } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Filter, Users, MapPin, Briefcase, Clock,
  ChevronDown, ChevronUp, Phone, Mail, Loader2,
  CheckCircle2, XCircle, UserCheck, GraduationCap, Rocket, Plane,
  Download, AlertTriangle, Copy,
} from "lucide-react";
import { UnauthorizedAlert } from '@/components/UnauthorizedAlert';

const SKILL_LABELS: Record<string, string> = {
  ground_volunteer: "Ground Volunteer",
  helpdesk: "Helpdesk",
  family_update: "Family Update",
  tech_support: "Tech Support",
  translation: "Translation",
  medical: "Medical",
  logistics: "Logistics",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  registered: { label: "Registered", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Users },
  screening: { label: "Screening", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Search },
  shortlisted: { label: "Shortlisted", color: "bg-purple-100 text-purple-700 border-purple-200", icon: UserCheck },
  training: { label: "Training", color: "bg-orange-100 text-orange-700 border-orange-200", icon: GraduationCap },
  assessed: { label: "Assessed", color: "bg-teal-100 text-teal-700 border-teal-200", icon: CheckCircle2 },
  deployed: { label: "Deployed", color: "bg-green-100 text-green-700 border-green-200", icon: Rocket },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle },
};

const AVAILABILITY_LABELS: Record<string, string> = {
  "3": "3 Days",
  "7": "7 Days",
  "15": "15 Days",
  full_season: "Full Season",
};

interface Volunteer {
  id: string;
  volunteer_id: string;
  full_name: string;
  father_name: string;
  age: number;
  mobile: string;
  whatsapp: string;
  email: string | null;
  city: string;
  district: string;
  state: string;
  embarkation_point: string | null;
  skills: string[];
  availability_days: string;
  duty_location: string;
  languages: string[];
  status: string;
  city_tag: string | null;
  skill_tag: string | null;
  availability_tag: string | null;
  created_at: string;
}

const VolunteerDashboardPage = () => {
  const { isRTL } = useLanguage();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { toast } = useToast();

  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [filterEmbarkation, setFilterEmbarkation] = useState("");
  const [groupByEmbarkation, setGroupByEmbarkation] = useState(true);

  useEffect(() => {
    if (!roleLoading && isAdmin) fetchVolunteers();
  }, [roleLoading, isAdmin]);

  const fetchVolunteers = async () => {
    setLoading(true);
    // Use admin RPC: regular SELECT on volunteers no longer returns
    // PII columns (mobile/whatsapp/email/address/father_name) to
    // any authenticated user. The SECURITY DEFINER function checks
    // admin role server-side before returning full rows.
    const { data, error } = await (supabase as any).rpc("admin_list_volunteers");

    if (error) {
      toast({ title: "Error loading volunteers", description: error.message, variant: "destructive" });
    } else {
      setVolunteers(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const volunteer = volunteers.find(v => v.id === id);
    const { error } = await (supabase as any)
      .from("volunteers")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
      toast({ title: `Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}` });

      // Send WhatsApp notification
      if (volunteer) {
        try {
          await supabase.functions.invoke("volunteer-status-notify", {
            body: {
              volunteer_id: volunteer.volunteer_id,
              volunteer_name: volunteer.full_name,
              mobile: volunteer.mobile,
              new_status: newStatus,
              whatsapp_number: volunteer.whatsapp || volunteer.mobile,
            },
          });
          toast({ title: "WhatsApp notification sent" });
        } catch {
          // Non-blocking - status update already succeeded
        }
      }
    }
    setUpdatingId(null);
  };

  // Duplicate detection
  const duplicates = useMemo(() => {
    const phoneMap = new Map<string, string[]>();
    for (const v of volunteers) {
      const existing = phoneMap.get(v.mobile) || [];
      existing.push(v.volunteer_id);
      phoneMap.set(v.mobile, existing);
    }
    return new Map([...phoneMap].filter(([, ids]) => ids.length > 1));
  }, [volunteers]);

  // Derived data
  const cities = useMemo(() => [...new Set(volunteers.map(v => v.city))].sort(), [volunteers]);
  const allSkills = useMemo(() => [...new Set(volunteers.flatMap(v => v.skills))].sort(), [volunteers]);
  const embarkationPoints = useMemo(() => [...new Set(volunteers.map(v => v.embarkation_point || "Unassigned"))].sort(), [volunteers]);

  const filtered = useMemo(() => {
    return volunteers.filter(v => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!v.full_name.toLowerCase().includes(q) && !v.volunteer_id.toLowerCase().includes(q) && !v.mobile.includes(q)) return false;
      }
      if (filterCity && v.city.toLowerCase() !== filterCity.toLowerCase()) return false;
      if (filterSkill && !v.skills.includes(filterSkill)) return false;
      if (filterStatus && v.status !== filterStatus) return false;
      if (filterAvailability && v.availability_days !== filterAvailability) return false;
      if (filterEmbarkation && (v.embarkation_point || "Unassigned") !== filterEmbarkation) return false;
      return true;
    });
  }, [volunteers, searchQuery, filterCity, filterSkill, filterStatus, filterAvailability, filterEmbarkation]);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = ["Volunteer ID", "Name", "Father Name", "Age", "Mobile", "WhatsApp", "Email", "City", "District", "State", "Embarkation", "Skills", "Availability", "Languages", "Status", "Registered"];
    const rows = filtered.map(v => [
      v.volunteer_id, v.full_name, v.father_name, v.age, v.mobile, v.whatsapp,
      v.email || "", v.city, v.district, v.state, v.embarkation_point || "",
      v.skills.map(s => SKILL_LABELS[s] || s).join("; "),
      AVAILABILITY_LABELS[v.availability_days] || v.availability_days,
      v.languages.join("; "), v.status,
      new Date(v.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${filtered.length} volunteers` });
  }, [filtered, toast]);

  // Stats
  const stats = useMemo(() => {
    const s: Record<string, number> = {};
    for (const v of volunteers) s[v.status] = (s[v.status] || 0) + 1;
    return s;
  }, [volunteers]);

  // Embarkation stats with counts and percentages
  const embarkationStats = useMemo(() => {
    const total = volunteers.length;
    const counts: Record<string, number> = {};
    for (const v of volunteers) {
      const ep = v.embarkation_point || "Unassigned";
      counts[ep] = (counts[ep] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([ep, count]) => ({
        name: ep,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }));
  }, [volunteers]);

  const renderVolunteerCard = (v: Volunteer) => {
    const isExpanded = expandedId === v.id;
    const statusCfg = STATUS_CONFIG[v.status] || STATUS_CONFIG.registered;
    return (
      <Card key={v.id} className="overflow-hidden">
        <button
          className="w-full text-left p-4 flex items-center gap-3"
          onClick={() => setExpandedId(isExpanded ? null : v.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground truncate">{v.full_name}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{v.volunteer_id}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{v.city}, {v.state}</span>
              {v.embarkation_point && (
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Plane className="w-3 h-3" />{v.embarkation_point}</span>
              )}
              <Badge variant="outline" className={`text-[10px] ${statusCfg.color}`}>{statusCfg.label}</Badge>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
        </button>

        {isExpanded && (
          <CardContent className="pt-0 pb-4 space-y-4 border-t">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-3">
              <div><span className="text-muted-foreground text-xs">Father</span><p>{v.father_name}</p></div>
              <div><span className="text-muted-foreground text-xs">Age</span><p>{v.age}</p></div>
              <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" /><span>{v.mobile}</span></div>
              <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-muted-foreground" /><span className="truncate">{v.email || "—"}</span></div>
              <div><span className="text-muted-foreground text-xs">District</span><p>{v.district}</p></div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-muted-foreground" /><span>{AVAILABILITY_LABELS[v.availability_days] || v.availability_days}</span></div>
              <div><span className="text-muted-foreground text-xs">Embarkation</span><p>{v.embarkation_point || "—"}</p></div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3" />Skills</p>
              <div className="flex flex-wrap gap-1">
                {v.skills.map(s => <Badge key={s} variant="secondary" className="text-[10px]">{SKILL_LABELS[s] || s}</Badge>)}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Languages</p>
              <div className="flex flex-wrap gap-1">
                {v.languages.map(l => <Badge key={l} variant="outline" className="text-[10px] capitalize">{l}</Badge>)}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Update Status</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={v.status === key ? "default" : "outline"}
                    className="text-xs h-7 px-2"
                    disabled={updatingId === v.id}
                    onClick={() => updateStatus(v.id, key)}
                  >
                    {updatingId === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    {cfg.label}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground">Registered: {new Date(v.created_at).toLocaleDateString()}</p>
          </CardContent>
        )}
      </Card>
    );
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleHeader />
        <main className="container max-w-2xl mx-auto px-4 py-16">
          <UnauthorizedAlert requiredRole="admin" pageName="Volunteer Dashboard" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />
      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Volunteer Dashboard
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={filtered.length === 0}>
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={fetchVolunteers}>
              <Loader2 className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Duplicate Alert */}
        {duplicates.size > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Duplicate Registrations Detected</p>
                <div className="mt-1 space-y-0.5">
                  {[...duplicates].map(([phone, ids]) => (
                    <p key={phone} className="text-xs text-muted-foreground flex items-center gap-1">
                      <Copy className="w-3 h-3" />
                      Phone {phone}: {ids.join(", ")}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "" : key)}
              className={`p-2 rounded-lg border text-center transition-all ${filterStatus === key ? "ring-2 ring-primary" : ""} ${cfg.color}`}
            >
              <p className="text-lg font-bold">{stats[key] || 0}</p>
              <p className="text-[10px] font-medium">{cfg.label}</p>
            </button>
          ))}
        </div>

        {/* Embarkation Point Summary */}
        {embarkationStats.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Plane className="w-4 h-4 text-primary" />
                Embarkation Point Overview
                <Badge variant="secondary" className="text-[10px] ml-auto">{volunteers.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {embarkationStats.map(({ name, count, percentage }) => (
                <button
                  key={name}
                  onClick={() => setFilterEmbarkation(filterEmbarkation === name ? "" : name)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all hover:bg-muted/50 ${
                    filterEmbarkation === name ? "ring-1 ring-primary bg-primary/5" : ""
                  }`}
                >
                  <span className="text-xs font-medium text-foreground flex-1 min-w-0 truncate">{name}</span>
                  <span className="text-xs font-bold text-foreground tabular-nums">{count}</span>
                  <div className="w-20 h-2 bg-muted rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-8 text-right tabular-nums">{percentage}%</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, ID, or mobile..."
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={filterEmbarkation}
                onChange={e => setFilterEmbarkation(e.target.value)}
              >
                <option value="">All Embarkation Points</option>
                {embarkationPoints.map(ep => <option key={ep} value={ep}>{ep}</option>)}
              </select>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={filterCity}
                onChange={e => setFilterCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={filterSkill}
                onChange={e => setFilterSkill(e.target.value)}
              >
                <option value="">All Skills</option>
                {allSkills.map(s => <option key={s} value={s}>{SKILL_LABELS[s] || s}</option>)}
              </select>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={filterAvailability}
                onChange={e => setFilterAvailability(e.target.value)}
              >
                <option value="">All Availability</option>
                {Object.entries(AVAILABILITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between">
              {(searchQuery || filterCity || filterSkill || filterStatus || filterAvailability || filterEmbarkation) && (
                <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(""); setFilterCity(""); setFilterSkill(""); setFilterStatus(""); setFilterAvailability(""); setFilterEmbarkation(""); }}>
                  Clear all filters
                </Button>
              )}
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer ml-auto">
                <input type="checkbox" checked={groupByEmbarkation} onChange={e => setGroupByEmbarkation(e.target.checked)} className="rounded" />
                Group by Embarkation Point
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <p className="text-sm text-muted-foreground">{filtered.length} volunteer{filtered.length !== 1 ? "s" : ""} found</p>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No volunteers match filters</CardContent></Card>
        ) : groupByEmbarkation ? (
          <div className="space-y-6">
            {embarkationPoints
              .filter(ep => filtered.some(v => (v.embarkation_point || "Unassigned") === ep))
              .map(ep => {
                const groupVolunteers = filtered.filter(v => (v.embarkation_point || "Unassigned") === ep);
                return (
                  <div key={ep} className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                      <Plane className="w-4 h-4 text-primary" />
                      <h2 className="text-sm font-bold text-foreground">{ep}</h2>
                      <Badge variant="secondary" className="text-[10px]">{groupVolunteers.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {groupVolunteers.map(v => renderVolunteerCard(v))}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(v => renderVolunteerCard(v))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VolunteerDashboardPage;
