import { useState, useMemo } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Home, Users, Bell, Megaphone, UserCircle, Search, AlertTriangle,
  Heart, MapPin, Send, CheckCircle2, Phone, Shield, Activity, Info, X, UserPlus
} from "lucide-react";

type Status = "safe" | "missing" | "medical" | "nusuk";
type AlertType = "missing" | "medical" | "nusuk" | "info";

interface Pilgrim {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
  district: string;
  location: string;
  status: Status;
  phone: string;
  note?: string;
}

interface AlertItem {
  id: string;
  pilgrimId: string;
  type: AlertType;
  title: string;
  time: string;
  read: boolean;
}

const INITIAL_PILGRIMS: Pilgrim[] = [
  { id: "IND-2025-04872", name: "Mohammed Abdullah", age: 58, gender: "M", district: "Mumbai", location: "Mina Camp-7", status: "safe", phone: "+966 50 111 2233" },
  { id: "IND-2025-04873", name: "Salim Ahmed", age: 64, gender: "M", district: "Pune", location: "Last seen: Jamarat", status: "missing", phone: "+966 50 222 3344", note: "Family से 4 घंटे से contact नहीं" },
  { id: "IND-2025-04874", name: "Fatima Begum", age: 71, gender: "F", district: "Hyderabad", location: "King Abdullah Hospital", status: "medical", phone: "+966 50 333 4455", note: "BP high, admitted" },
  { id: "IND-2025-04875", name: "Ayesha Khatoon", age: 45, gender: "F", district: "Mumbai", location: "Arafat Tent-12", status: "safe", phone: "+966 50 444 5566" },
  { id: "IND-2025-04876", name: "Imran Sheikh", age: 52, gender: "M", district: "Nashik", location: "Muzdalifah", status: "safe", phone: "+966 50 555 6677" },
  { id: "IND-2025-04877", name: "Yusuf Ansari", age: 68, gender: "M", district: "Pune", location: "Mina Camp-7", status: "nusuk", phone: "+966 50 666 7788", note: "Nusuk card missing" },
  { id: "IND-2025-04878", name: "Khadija Bano", age: 60, gender: "F", district: "Mumbai", location: "Arafat Tent-12", status: "safe", phone: "+966 50 777 8899" },
  { id: "IND-2025-04879", name: "Rashid Khan", age: 55, gender: "M", district: "Hyderabad", location: "Mina Camp-7", status: "safe", phone: "+966 50 888 9900" },
];

const INITIAL_ALERTS: AlertItem[] = [
  { id: "a1", pilgrimId: "IND-2025-04873", type: "missing", title: "Salim Ahmed — 4 घंटे से missing", time: "2 min ago", read: false },
  { id: "a2", pilgrimId: "IND-2025-04874", type: "medical", title: "Fatima Begum — Hospital admitted", time: "25 min ago", read: false },
  { id: "a3", pilgrimId: "IND-2025-04877", type: "nusuk", title: "Yusuf Ansari — Nusuk card खो गया", time: "1 hr ago", read: false },
  { id: "a4", pilgrimId: "IND-2025-04872", type: "info", title: "Mina movement update", time: "2 hr ago", read: true },
];

const TEMPLATES = [
  "सभी हाजी कृपया अपने camp पर लौटें",
  "कल सुबह 5 बजे Arafat के लिए bus रवाना होगी",
  "Medical camp Tent-5 के पास खुल गया है",
  "अपना Nusuk card हमेशा साथ रखें",
];

const STATUS_META: Record<Status, { label: string; color: string; icon: any }> = {
  safe: { label: "Safe", color: "bg-emerald-100 text-emerald-700 border-emerald-300", icon: CheckCircle2 },
  missing: { label: "Missing", color: "bg-red-100 text-red-700 border-red-300", icon: AlertTriangle },
  medical: { label: "Medical", color: "bg-blue-100 text-blue-700 border-blue-300", icon: Heart },
  nusuk: { label: "Nusuk", color: "bg-amber-100 text-amber-700 border-amber-300", icon: Shield },
};

const ALERT_META: Record<AlertType, { color: string; icon: any }> = {
  missing: { color: "bg-red-50 border-red-300 text-red-800", icon: AlertTriangle },
  medical: { color: "bg-blue-50 border-blue-300 text-blue-800", icon: Heart },
  nusuk: { color: "bg-amber-50 border-amber-300 text-amber-800", icon: Shield },
  info: { color: "bg-slate-50 border-slate-300 text-slate-700", icon: Info },
};

const ShiDashboardDemoPage = () => {
  const [tab, setTab] = useState<"home" | "pilgrims" | "alerts" | "broadcast" | "me">("home");
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>(INITIAL_PILGRIMS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Pilgrim | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({ name: "", age: "", gender: "M" as "M" | "F", district: "", location: "", phone: "", id: "" });

  const addPilgrim = () => {
    if (!newP.name.trim() || !newP.age || !newP.district.trim()) {
      toast({ title: "Name, age, जिला ज़रूरी है", variant: "destructive" });
      return;
    }
    const id = newP.id.trim() || `IND-2025-${String(4880 + pilgrims.length).padStart(5, "0")}`;
    const p: Pilgrim = {
      id, name: newP.name.trim(), age: Number(newP.age) || 0, gender: newP.gender,
      district: newP.district.trim(), location: newP.location.trim() || "Camp",
      phone: newP.phone.trim() || "+966 50 000 0000", status: "safe",
    };
    setPilgrims(prev => [p, ...prev]);
    setShowAdd(false);
    setNewP({ name: "", age: "", gender: "M", district: "", location: "", phone: "", id: "" });
    toast({ title: "✅ Pilgrim जोड़ दिया", description: `${p.name} (${p.id})` });
  };

  const stats = useMemo(() => ({
    total: pilgrims.length,
    safe: pilgrims.filter(p => p.status === "safe").length,
    missing: pilgrims.filter(p => p.status === "missing").length,
    medical: pilgrims.filter(p => p.status === "medical").length,
    nusuk: pilgrims.filter(p => p.status === "nusuk").length,
  }), [pilgrims]);

  const locations = useMemo(() => {
    const map: Record<string, number> = {};
    pilgrims.forEach(p => {
      const key = p.location.includes("Mina") ? "Mina" :
                  p.location.includes("Arafat") ? "Arafat" :
                  p.location.includes("Muzdalifah") ? "Muzdalifah" :
                  p.location.includes("Hospital") ? "Hospital" : "Other";
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [pilgrims]);

  const unreadAlerts = alerts.filter(a => !a.read).length;

  const filteredPilgrims = useMemo(() => {
    return pilgrims.filter(p => {
      if (filter !== "all" && p.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.district.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [pilgrims, search, filter]);

  const resolvePilgrim = (id: string) => {
    setPilgrims(prev => prev.map(p => p.id === id ? { ...p, status: "safe", note: undefined, location: "Camp पर लौट आए" } : p));
    setAlerts(prev => prev.map(a => a.pilgrimId === id ? { ...a, read: true } : a));
    setSelected(null);
    toast({ title: "✅ Case Resolved", description: "Pilgrim status → Safe, family को notify किया" });
  };

  const sendMissingAlert = (p: Pilgrim) => {
    setPilgrims(prev => prev.map(x => x.id === p.id ? { ...x, status: "missing" } : x));
    setAlerts(prev => [{
      id: `a${Date.now()}`, pilgrimId: p.id, type: "missing",
      title: `${p.name} — Missing alert raised`, time: "just now", read: false
    }, ...prev]);
    toast({ title: "🚨 Missing alert भेज दिया", description: `${p.name} — Family + Coordinator को notify किया` });
  };

  const callPilgrim = (p: Pilgrim) => {
    toast({ title: "📞 Calling…", description: `${p.name} — ${p.phone}` });
  };

  const sendBroadcast = (msg: string) => {
    if (!msg.trim()) {
      toast({ title: "Message empty", variant: "destructive" });
      return;
    }
    toast({ title: "📢 Broadcast sent", description: `285 हाजियों को push भेज दिया` });
    setBroadcastMsg("");
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    toast({ title: "सभी alerts पढ़े गए" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <SimpleHeader />

      <div className="max-w-3xl mx-auto p-3 space-y-3">
        {/* Demo banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl p-3 text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span>SHI Dashboard Demo — interactive prototype</span>
        </div>

        {/* HOME */}
        {tab === "home" && (
          <>
            {/* Urgent alerts */}
            {alerts.filter(a => !a.read && (a.type === "missing" || a.type === "medical")).slice(0, 3).map(a => {
              const meta = ALERT_META[a.type];
              const Icon = meta.icon;
              const p = pilgrims.find(x => x.id === a.pilgrimId);
              return (
                <button key={a.id} onClick={() => { setTab("pilgrims"); setSelected(p || null); }}
                  className={`w-full text-left border-2 rounded-xl p-3 flex items-start gap-2 ${meta.color}`}>
                  <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{a.title}</div>
                    <div className="text-xs opacity-80">{a.time} • Tap for details</div>
                  </div>
                </button>
              );
            })}

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Total Haji</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
                <CardContent className="p-3">
                  <div className="text-xs text-emerald-700">Safe</div>
                  <div className="text-2xl font-bold text-emerald-700">{stats.safe}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-3">
                  <div className="text-xs text-red-700">Missing</div>
                  <div className="text-2xl font-bold text-red-700">{stats.missing}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-3">
                  <div className="text-xs text-blue-700">Medical</div>
                  <div className="text-2xl font-bold text-blue-700">{stats.medical}</div>
                </CardContent>
              </Card>
            </div>

            {/* Locations */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4" />हाजी कहाँ हैं</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-1.5">
                {Object.entries(locations).map(([loc, count]) => (
                  <div key={loc} className="flex justify-between items-center text-sm py-1 border-b last:border-0">
                    <span>{loc}</span>
                    <Badge variant="secondary">{count} हाजी</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setTab("broadcast")} className="h-14">
                <Megaphone className="h-4 w-4 mr-1" /> Broadcast
              </Button>
              <Button variant="outline" onClick={() => setTab("alerts")} className="h-14">
                <Bell className="h-4 w-4 mr-1" /> Alerts
                {unreadAlerts > 0 && <Badge className="ml-1 bg-red-500">{unreadAlerts}</Badge>}
              </Button>
            </div>
          </>
        )}

        {/* PILGRIMS */}
        {tab === "pilgrims" && !selected && (
          <>
            <div className="flex gap-2 items-center">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Name / जिला / ID से search…" value={search} onChange={e => setSearch(e.target.value)} />
              <Button size="sm" onClick={() => setShowAdd(s => !s)} className="shrink-0">
                <UserPlus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {showAdd && (
              <Card className="border-emerald-300 bg-emerald-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    नया हाजी जोड़ें
                    <Button size="icon" variant="ghost" onClick={() => setShowAdd(false)}><X className="h-4 w-4" /></Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input placeholder="नाम *" value={newP.name} onChange={e => setNewP({ ...newP, name: e.target.value })} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Age *" value={newP.age} onChange={e => setNewP({ ...newP, age: e.target.value })} />
                    <div className="flex gap-1">
                      <Button size="sm" variant={newP.gender === "M" ? "default" : "outline"} className="flex-1" onClick={() => setNewP({ ...newP, gender: "M" })}>पुरुष</Button>
                      <Button size="sm" variant={newP.gender === "F" ? "default" : "outline"} className="flex-1" onClick={() => setNewP({ ...newP, gender: "F" })}>महिला</Button>
                    </div>
                  </div>
                  <Input placeholder="जिला *" value={newP.district} onChange={e => setNewP({ ...newP, district: e.target.value })} />
                  <Input placeholder="Location (e.g. Mina Camp-7)" value={newP.location} onChange={e => setNewP({ ...newP, location: e.target.value })} />
                  <Input placeholder="Saudi number" value={newP.phone} onChange={e => setNewP({ ...newP, phone: e.target.value })} />
                  <Input placeholder="Cover ID (optional)" value={newP.id} onChange={e => setNewP({ ...newP, id: e.target.value })} />
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={addPilgrim}>
                    <UserPlus className="h-4 w-4 mr-1" /> जोड़ें
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {(["all", "safe", "missing", "medical", "nusuk"] as const).map(f => (
                <Button key={f} size="sm" variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f)} className="shrink-0 capitalize">
                  {f === "all" ? "सभी" : STATUS_META[f].label}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredPilgrims.map(p => {
                const meta = STATUS_META[p.status];
                const Icon = meta.icon;
                return (
                  <Card key={p.id} className="cursor-pointer active:scale-[0.99] transition" onClick={() => setSelected(p)}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${meta.color} border`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.district} • {p.age}y • {p.location}</div>
                      </div>
                      <Badge variant="outline" className={meta.color}>{meta.label}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
              {filteredPilgrims.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">कोई हाजी नहीं मिला</div>
              )}
            </div>
          </>
        )}

        {/* PILGRIM DETAIL */}
        {tab === "pilgrims" && selected && (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
              <div>
                <CardTitle className="text-lg">{selected.name}</CardTitle>
                <div className="text-xs text-muted-foreground mt-1">{selected.id}</div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setSelected(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Age:</span> {selected.age}</div>
                <div><span className="text-muted-foreground">District:</span> {selected.district}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Location:</span> {selected.location}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Phone:</span> {selected.phone}</div>
              </div>

              <Badge variant="outline" className={STATUS_META[selected.status].color}>
                Status: {STATUS_META[selected.status].label}
              </Badge>

              {selected.note && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-sm text-amber-800">
                  ⚠️ {selected.note}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" onClick={() => callPilgrim(selected)}>
                  <Phone className="h-4 w-4 mr-1" /> Call
                </Button>
                {selected.status === "safe" ? (
                  <Button variant="destructive" onClick={() => sendMissingAlert(selected)}>
                    <AlertTriangle className="h-4 w-4 mr-1" /> Missing Alert
                  </Button>
                ) : (
                  <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => resolvePilgrim(selected.id)}>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Case Resolve
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ALERTS */}
        {tab === "alerts" && (
          <>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">{unreadAlerts} unread</div>
              <Button size="sm" variant="outline" onClick={markAllRead}>सभी पढ़ें</Button>
            </div>
            <div className="space-y-2">
              {alerts.map(a => {
                const meta = ALERT_META[a.type];
                const Icon = meta.icon;
                const p = pilgrims.find(x => x.id === a.pilgrimId);
                return (
                  <button key={a.id} onClick={() => { if (p) { setTab("pilgrims"); setSelected(p); } }}
                    className={`w-full text-left border rounded-xl p-3 flex items-start gap-2 ${meta.color} ${a.read ? "opacity-60" : ""}`}>
                    <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{a.title}</div>
                      <div className="text-xs opacity-80">{a.time}</div>
                    </div>
                    {!a.read && <div className="h-2 w-2 rounded-full bg-red-500 mt-2" />}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* BROADCAST */}
        {tab === "broadcast" && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">📢 सभी 285 हाजियों को message भेजें</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea placeholder="Message type करें…" value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} rows={4} />
                <Button className="w-full" onClick={() => sendBroadcast(broadcastMsg)}>
                  <Send className="h-4 w-4 mr-2" /> Push भेजें (285)
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TEMPLATES.map((t, i) => (
                  <button key={i} onClick={() => setBroadcastMsg(t)}
                    className="w-full text-left p-2 rounded-lg border hover:bg-muted text-sm">
                    {t}
                  </button>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* ME */}
        {tab === "me" && (
          <>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <UserCircle className="h-10 w-10 text-emerald-700" />
                </div>
                <div>
                  <div className="font-bold">Inspector Ahmed Khan</div>
                  <div className="text-xs text-muted-foreground">SHI-MH-2025-014 • Mumbai Zone</div>
                  <Badge className="mt-1 bg-emerald-600">Active Duty</Badge>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <Card><CardContent className="p-3"><div className="text-xs text-muted-foreground">Pilgrims Assigned</div><div className="text-2xl font-bold">285</div></CardContent></Card>
              <Card><CardContent className="p-3"><div className="text-xs text-muted-foreground">Cases Resolved</div><div className="text-2xl font-bold text-emerald-700">47</div></CardContent></Card>
              <Card><CardContent className="p-3"><div className="text-xs text-muted-foreground">Avg Response</div><div className="text-2xl font-bold">8 min</div></CardContent></Card>
              <Card><CardContent className="p-3"><div className="text-xs text-muted-foreground">Rating</div><div className="text-2xl font-bold">⭐ 4.9</div></CardContent></Card>
            </div>
          </>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
        <div className="max-w-3xl mx-auto grid grid-cols-5">
          {[
            { k: "home", icon: Home, label: "Home" },
            { k: "pilgrims", icon: Users, label: "Pilgrims" },
            { k: "alerts", icon: Bell, label: "Alerts", badge: unreadAlerts },
            { k: "broadcast", icon: Megaphone, label: "Broadcast" },
            { k: "me", icon: UserCircle, label: "My Info" },
          ].map(t => {
            const Icon = t.icon as any;
            const active = tab === t.k;
            return (
              <button key={t.k} onClick={() => { setTab(t.k as any); setSelected(null); }}
                className={`flex flex-col items-center gap-0.5 py-2 relative ${active ? "text-emerald-700" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t.label}</span>
                {t.badge ? (
                  <span className="absolute top-1 right-3 bg-red-500 text-white text-[9px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">{t.badge}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShiDashboardDemoPage;
