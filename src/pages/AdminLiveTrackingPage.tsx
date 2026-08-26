import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useLanguage, LANGUAGES, type Language } from "@/contexts/LanguageContext";
import { HAJJ_LOCATIONS } from "@/hooks/useHajjLocation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertOctagon,
  ArrowLeft,
  Bell,
  Bot,
  ChevronRight,
  CircleHelp,
  Clock3,
  Crosshair,
  FileBarChart,
  Fence,
  Globe2,
  HeartHandshake,
  Layers3,
  LayoutDashboard,
  ListFilter,
  LockKeyhole,
  MapPin,
  MapPinned,
  Menu,
  MessageCircle,
  MessageSquare,
  Navigation,
  PanelLeft,
  Phone,
  Radio,
  RadioTower,
  RefreshCw,
  Route,
  Search,
  Settings2,
  Shield,
  ShieldCheck,
  Siren,
  TriangleAlert,
  UserRound,
  UserRoundCog,
  UsersRound,
  Wifi,
  X,
  Zap,
} from "lucide-react";

interface LiveLocation {
  id: string;
  member_id: string;
  group_id: string;
  latitude: number;
  longitude: number;
  current_stage: string | null;
  pilgrim_status: string;
  updated_at: string;
  user_id: string | null;
}

type MarkerEntry = { marker: mapboxgl.Marker; element: HTMLDivElement };

const ACTIVE_WINDOW_MS = 30 * 60 * 1000;
const STATUS_STYLES: Record<string, { label: string; color: string; tint: string }> = {
  normal: { label: "Safe", color: "#34d399", tint: "rgba(52,211,153,.16)" },
  assisted: { label: "Assistance", color: "#fbbf24", tint: "rgba(251,191,36,.17)" },
  emergency_managed: { label: "SOS", color: "#fb7185", tint: "rgba(251,113,133,.18)" },
};

const LANDMARKS = [
  { id: "kaaba", label: "Masjid al-Haram", coord: HAJJ_LOCATIONS.kaaba },
  { id: "mina", label: "Mina", coord: HAJJ_LOCATIONS.mina },
  { id: "arafat", label: "Arafat", coord: HAJJ_LOCATIONS.arafat },
  { id: "muzdalifah", label: "Muzdalifah", coord: HAJJ_LOCATIONS.muzdalifah },
  { id: "jamarat", label: "Jamarat", coord: HAJJ_LOCATIONS.jamarat },
  { id: "madinah", label: "Madinah", coord: { lat: 24.4672, lng: 39.6112 } },
] as const;

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Live Tracking", icon: RadioTower },
  { label: "Pilgrim List", icon: UsersRound },
  { label: "Family Tracking", icon: HeartHandshake },
  { label: "Groups", icon: Layers3 },
  { label: "Geo-Fencing", icon: Fence },
  { label: "SOS Alerts", icon: Siren, href: "/admin/metrics" },
  { label: "Lost Pilgrim", icon: MapPinned, href: "/lost-and-found" },
  { label: "Reports", icon: FileBarChart, href: "/admin/sukoon-metrics" },
  { label: "Messages", icon: MessageSquare, href: "/chat" },
  { label: "AI Assistant", icon: Bot, href: "/chat" },
  { label: "Settings", icon: Settings2, href: "/security-settings" },
] as const;

const isActiveLocation = (updatedAt: string) => Date.now() - new Date(updatedAt).getTime() < ACTIVE_WINDOW_MS;
const minutesSince = (updatedAt: string) => Math.max(0, Math.round((Date.now() - new Date(updatedAt).getTime()) / 60000));
const stageLabel = (stage: string | null) => (stage || "Location shared").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const statusStyle = (status: string) => STATUS_STYLES[status] || { label: "Unknown", color: "#94a3b8", tint: "rgba(148,163,184,.16)" };
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char] || char));

const AdminLiveTrackingPage = () => {
  const { user, loading: authLoading } = useAuthContext();
  const { isAdmin, isCoordinator, isLoading: roleLoading } = useUserRole();
  const { language, setLanguage } = useLanguage();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Record<string, MarkerEntry>>({});
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [locations, setLocations] = useState<LiveLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "sos" | "stale">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supportMetrics, setSupportMetrics] = useState({ linkedMembers: null as number | null, inspectors: null as number | null });
  const accessAuditLoggedRef = useRef(false);

  const canAccess = isAdmin || isCoordinator;

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    const [locationsResult, membersResult, inspectorsResult] = await Promise.all([
      supabase
        .from("member_locations")
        .select("id, member_id, group_id, latitude, longitude, current_stage, pilgrim_status, updated_at, user_id")
        .order("updated_at", { ascending: false })
        .limit(1000),
      supabase.from("group_members").select("id", { count: "exact", head: true }),
      supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "inspector"),
    ]);

    if (locationsResult.error) console.error("Sukoon live locations:", locationsResult.error);
    if (locationsResult.data) {
      const authorizedLocations = locationsResult.data as LiveLocation[];
      setLocations(authorizedLocations);
      if (authorizedLocations.length && !accessAuditLoggedRef.current) {
        accessAuditLoggedRef.current = true;
        void supabase.rpc("log_sukoon_location_access", {
          p_location_ids: authorizedLocations.map((location) => location.id),
          p_context: "admin_live_tracking",
        }).then(({ error }) => {
          if (error) console.warn("[SukoonTracking] Access audit failed:", error);
        });
      }
    }
    setSupportMetrics({
      linkedMembers: membersResult.error ? null : membersResult.count ?? 0,
      inspectors: inspectorsResult.error ? null : inspectorsResult.count ?? 0,
    });
    setLastSyncedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!canAccess) return;
    void fetchLocations();
    const channel = supabase
      .channel("admin-sukoon-command-center")
      .on("postgres_changes", { event: "*", schema: "public", table: "member_locations" }, () => void fetchLocations())
      .subscribe();
    const interval = window.setInterval(() => void fetchLocations(), 60000);
    return () => {
      supabase.removeChannel(channel);
      window.clearInterval(interval);
    };
  }, [canAccess, fetchLocations]);

  useEffect(() => {
    if (!canAccess) return;
    let cancelled = false;
    const loadToken = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("A secure session is required to load the operations map.");
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!response.ok) throw new Error("Map service unavailable.");
        const data = await response.json();
        if (!data.token) throw new Error("Map token was not returned.");
        if (!cancelled) setMapToken(data.token);
      } catch (error) {
        console.error("Sukoon Mapbox token:", error);
        if (!cancelled) setMapError("The live map is unavailable. Location list and alerts remain available.");
      }
    };
    void loadToken();
    return () => { cancelled = true; };
  }, [canAccess]);

  useEffect(() => {
    if (!mapToken || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = mapToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [HAJJ_LOCATIONS.kaaba.lng, HAJJ_LOCATIONS.kaaba.lat],
      zoom: 10,
      pitch: 35,
    });
    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.current.on("load", () => { setMapReady(true); map.current?.resize(); });
    map.current.on("error", (event) => {
      console.error("Sukoon map:", event.error);
      setMapError("The live map could not be rendered. Refresh to try again.");
    });
    return () => { map.current?.remove(); map.current = null; setMapReady(false); };
  }, [mapToken]);

  useEffect(() => {
    if (!map.current || !mapReady) return;
    const seen = new Set<string>();
    locations.forEach((location) => {
      seen.add(location.id);
      const style = statusStyle(location.pilgrim_status);
      const active = isActiveLocation(location.updated_at);
      let entry = markers.current[location.id];
      if (!entry) {
        const element = document.createElement("div");
        element.setAttribute("aria-label", `Pilgrim ${location.member_id.slice(0, 8)}`);
        element.setAttribute("role", "button");
        element.tabIndex = 0;
        const popup = new mapboxgl.Popup({ offset: 15, closeButton: true }).setHTML(`
          <div style="font-family:system-ui;min-width:190px;color:#0f172a;font-size:13px">
            <strong style="display:block;margin-bottom:6px">Consented pilgrim · #${escapeHtml(location.member_id.slice(0, 8))}</strong>
            <div>Status: <b>${escapeHtml(style.label)}</b></div>
            <div>Stage: ${escapeHtml(stageLabel(location.current_stage))}</div>
            <div style="color:#64748b;margin-top:6px">Last update: ${escapeHtml(new Date(location.updated_at).toLocaleString())}</div>
          </div>
        `);
        const marker = new mapboxgl.Marker({ element }).setPopup(popup).addTo(map.current!);
        entry = { marker, element };
        markers.current[location.id] = entry;
      }
      entry.marker.setLngLat([location.longitude, location.latitude]);
      entry.element.style.cssText = `width:16px;height:16px;border-radius:50%;background:${style.color};border:2px solid rgba(255,255,255,.95);box-shadow:0 0 0 5px ${style.color}33,0 0 16px ${style.color}99;opacity:${active ? 1 : .42};cursor:pointer;transition:transform .2s ease,opacity .2s ease;`;
    });
    Object.keys(markers.current).forEach((id) => {
      if (!seen.has(id)) { markers.current[id].marker.remove(); delete markers.current[id]; }
    });
  }, [locations, mapReady]);

  const metrics = useMemo(() => {
    const active = locations.filter((location) => isActiveLocation(location.updated_at));
    return {
      total: locations.length,
      active: active.length,
      safe: active.filter((location) => location.pilgrim_status === "normal").length,
      sos: active.filter((location) => location.pilgrim_status === "emergency_managed").length,
      assisted: active.filter((location) => location.pilgrim_status === "assisted").length,
      stale: locations.filter((location) => !isActiveLocation(location.updated_at)).length,
    };
  }, [locations]);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return locations.filter((location) => {
      const matchesSearch = !query || [location.member_id, location.group_id, location.current_stage, location.pilgrim_status].some((value) => value?.toLowerCase().includes(query));
      const matchesFilter = statusFilter === "all" || (statusFilter === "active" && isActiveLocation(location.updated_at)) || (statusFilter === "stale" && !isActiveLocation(location.updated_at)) || (statusFilter === "sos" && location.pilgrim_status === "emergency_managed");
      return matchesSearch && matchesFilter;
    });
  }, [locations, search, statusFilter]);

  const focusLandmark = (landmark: typeof LANDMARKS[number]) => {
    map.current?.flyTo({ center: [landmark.coord.lng, landmark.coord.lat], zoom: landmark.id === "madinah" ? 11 : 13, duration: 900 });
  };

  const focusAttention = (filter: "all" | "sos" | "stale") => {
    setStatusFilter(filter);
    window.requestAnimationFrame(() => document.getElementById("pilgrim-list")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (authLoading || roleLoading) return <div className="min-h-screen bg-[#071321] p-6"><Skeleton className="h-16 w-full bg-white/10" /><Skeleton className="mt-5 h-[70vh] w-full bg-white/10" /></div>;
  if (!user) return <Navigate to="/" replace />;
  if (!canAccess) {
    return <div className="min-h-screen bg-[#071321] flex items-center justify-center p-6 text-white"><div className="max-w-md rounded-3xl border border-white/10 bg-white/[.06] p-8 text-center"><Shield className="mx-auto h-12 w-12 text-amber-300" /><h2 className="mt-4 text-xl font-semibold">Restricted operations view</h2><p className="mt-2 text-sm text-slate-300">Only authorised administrators and coordinators can access consented live location data.</p><Link to="/"><Button className="mt-6 bg-emerald-500 text-slate-950 hover:bg-emerald-400"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Button></Link></div></div>;
  }

  const selectedLanguage = LANGUAGES.find((item) => item.code === language);
  const saudiTime = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }).format(new Date());

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#071321] text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(circle_at_30%_0%,rgba(22,101,84,.24),transparent_38%),radial-gradient(circle_at_90%_30%,rgba(30,64,175,.18),transparent_32%)]" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071321]/90 backdrop-blur-xl">
        <div className="flex min-h-[72px] items-center gap-3 px-4 sm:px-6">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle navigation">{sidebarOpen ? <X /> : <Menu />}</Button>
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="HajCare AI home"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-emerald-700 text-[#061c19] shadow-lg shadow-emerald-950/30"><RadioTower className="h-5 w-5" /></div><div className="hidden sm:block"><div className="text-sm font-bold tracking-wide">HajCare AI</div><div className="text-[10px] uppercase tracking-[.22em] text-slate-400">Mission control</div></div></Link>
          <div className="hidden h-8 w-px bg-white/10 lg:block" />
          <div className="min-w-0"><div className="truncate text-sm font-semibold sm:text-base">Sukoon Tracking System</div><div className="mt-0.5 flex items-center gap-2 text-[11px] text-emerald-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Live safety overview <span className="hidden text-slate-500 sm:inline">• consent-gated</span></div></div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3"><div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-slate-300 xl:flex"><Clock3 className="h-3.5 w-3.5 text-emerald-300" />Saudi Arabia · {saudiTime}</div><div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-2.5 py-2 md:flex"><Globe2 className="h-3.5 w-3.5 text-slate-400" /><select aria-label="Dashboard language" value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="bg-transparent text-xs text-slate-200 outline-none"><option className="bg-[#0b1c2d]" value={selectedLanguage?.code}>{selectedLanguage?.nativeName}</option>{LANGUAGES.filter((item) => item.code !== language).map((item) => <option className="bg-[#0b1c2d]" key={item.code} value={item.code}>{item.nativeName}</option>)}</select></div><Button variant="ghost" size="icon" className="relative text-slate-300 hover:bg-white/10" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-300" /></Button><div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-2.5 py-2 sm:flex"><div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-400/15 text-blue-200"><UserRoundCog className="h-4 w-4" /></div><div><div className="text-xs font-medium">Hajj Inspector</div><div className="text-[10px] text-slate-400">{isAdmin ? "Administrator" : "Coordinator"}</div></div></div></div>
        </div>
      </header>

      <div className="relative z-10 flex">
        <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed inset-y-[73px] left-0 z-30 w-64 border-r border-white/10 bg-[#091a2a]/95 p-3 backdrop-blur-xl transition-transform lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:translate-x-0`}>
          <div className="mb-4 flex items-center justify-between px-3 pt-2 lg:hidden"><span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Navigation</span><Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300" onClick={() => setSidebarOpen(false)}><X className="h-4 w-4" /></Button></div>
          <div className="mb-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[.06] p-3"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-200"><ShieldCheck className="h-4 w-4" />Secure command view</div><p className="mt-1.5 text-[11px] leading-4 text-slate-400">Only explicitly shared locations are shown to authorised staff.</p></div>
          <nav className="space-y-1" aria-label="Sukoon navigation">{navigationItems.map((item) => { const Icon = item.icon; const content = <><Icon className="h-4 w-4 shrink-0" /><span>{item.label}</span>{item.active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-300" />}</>; return item.href ? <Link key={item.label} to={item.href} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-slate-400 transition hover:bg-white/[.06] hover:text-white">{content}</Link> : <button key={item.label} type="button" onClick={() => setSidebarOpen(false)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition ${item.active ? "bg-emerald-400/15 font-semibold text-emerald-100 ring-1 ring-emerald-300/15" : "text-slate-400 hover:bg-white/[.06] hover:text-white"}`}>{content}</button>; })}</nav>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.03] p-3"><div className="flex items-center gap-2 text-xs font-semibold text-slate-200"><LockKeyhole className="h-3.5 w-3.5 text-emerald-300" />Privacy boundary</div><p className="mt-1 text-[10px] leading-4 text-slate-500">Location data is used for safety operations and audit logged under your organisation’s policy.</p></div>
        </aside>
        {sidebarOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1800px] space-y-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.2em] text-emerald-300"><Radio className="h-3.5 w-3.5" />Hajj safety dashboard</div><h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Safety at a glance</h1><p className="mt-1 max-w-2xl text-sm text-slate-400">Start with the red or amber items. Everything else can wait.</p></div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-slate-400">Last sync {lastSyncedAt ? lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</span><Button onClick={() => void fetchLocations()} disabled={loading} variant="outline" className="min-h-10 border-white/15 bg-white/[.04] text-slate-200 hover:bg-white/10 hover:text-white"><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh data</Button></div></div>

            <div className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${metrics.sos > 0 ? "border-rose-300/30 bg-rose-300/[.08]" : metrics.stale > 0 ? "border-amber-300/25 bg-amber-300/[.06]" : "border-emerald-300/20 bg-emerald-300/[.06]"}`} role="status" aria-live="polite">
              <div className="flex items-start gap-3"><div className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${metrics.sos > 0 ? "bg-rose-400/20 text-rose-200" : metrics.stale > 0 ? "bg-amber-300/20 text-amber-200" : "bg-emerald-300/20 text-emerald-200"}`}><ShieldCheck className="h-5 w-5" /></div><div><p className="text-sm font-semibold text-white">{metrics.sos > 0 ? `${metrics.sos} SOS alert${metrics.sos === 1 ? "" : "s"} need attention` : metrics.stale > 0 ? `${metrics.stale} location${metrics.stale === 1 ? "" : "s"} need a check-in` : "All tracked pilgrims look safe"}</p><p className="mt-1 text-xs leading-5 text-slate-400">Only explicitly shared locations are shown. Access is logged for privacy.</p></div></div>
              {(metrics.sos > 0 || metrics.stale > 0) && <Button type="button" variant="outline" className="min-h-10 shrink-0 border-white/15 bg-white/[.05] text-slate-100 hover:bg-white/10" onClick={() => focusAttention(metrics.sos > 0 ? "sos" : "stale")}>{metrics.sos > 0 ? "Review SOS alerts" : "Review stale updates"}<ChevronRight className="ml-1 h-4 w-4" /></Button>}
            </div>

            <section className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Safety summary">
              <KpiCard label="Tracked pilgrims" value={metrics.total} icon={UsersRound} tone="emerald" detail="consented feed" />
              <KpiCard label="Live now" value={metrics.active} icon={Activity} tone="blue" detail="updated in 30 min" />
              <KpiCard label="Needs attention" value={metrics.sos + metrics.stale} icon={metrics.sos > 0 ? Siren : Wifi} tone={metrics.sos > 0 ? "rose" : "amber"} detail="SOS or stale update" emphasis={metrics.sos > 0} />
              <KpiCard label="Family linked" value={supportMetrics.linkedMembers ?? "—"} icon={HeartHandshake} tone="violet" detail="registered members" />
            </section>

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="order-2 min-w-0 space-y-4 2xl:order-1">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1e30]/80 shadow-2xl shadow-black/20">
                  <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-semibold"><MapPinned className="h-4 w-4 text-emerald-300" />Live Mashair map</div><p className="mt-1 text-xs text-slate-500">Blue map markers are consented live location updates; faded markers are stale.</p></div><div className="flex items-center gap-2 text-[10px] text-slate-400"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Safe</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-300" />Assist</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" />SOS</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400" />Stale</span></div></div>
                  <div className="relative h-[300px] min-h-[280px] sm:h-[460px] lg:h-[520px]"><div ref={mapContainer} className="absolute inset-0" />{!mapToken && !mapError && <MapOverlay icon={<RadioTower className="h-7 w-7 animate-pulse text-emerald-300" />} title="Connecting to secure map" body="Authorised map access is being established." />}{mapError && <MapOverlay icon={<TriangleAlert className="h-7 w-7 text-amber-300" />} title="Map unavailable" body={mapError} action={<Button size="sm" onClick={() => window.location.reload()} className="mt-3 bg-emerald-400 text-slate-950 hover:bg-emerald-300">Retry map</Button>} />}{mapReady && !loading && locations.length === 0 && <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4"><div className="rounded-2xl border border-white/10 bg-[#071321]/90 px-4 py-3 text-center shadow-xl backdrop-blur"><MapPin className="mx-auto h-5 w-5 text-slate-400" /><p className="mt-1 text-xs font-medium text-slate-200">No consented live locations yet</p><p className="mt-1 text-[11px] text-slate-500">Pilgrim pins appear after Sukoon Tracking is enabled and permission is granted.</p></div></div>}{loading && <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-[#071321]/85 px-3 py-2 text-[11px] text-slate-300 backdrop-blur"><RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-300" />Syncing consented feed…</div>}</div>
                  <div className="flex gap-2 overflow-x-auto border-t border-white/10 p-3">{LANDMARKS.map((landmark) => <button type="button" key={landmark.id} onClick={() => focusLandmark(landmark)} className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-[11px] text-slate-300 transition hover:border-emerald-300/40 hover:bg-emerald-300/10 hover:text-emerald-100"><Crosshair className="h-3 w-3 text-emerald-300" />{landmark.label}</button>)}</div>
                </div>

                <div className="grid gap-4 md:grid-cols-3"><OperationsCard icon={Siren} title="SOS command center" tone="rose" value={metrics.sos} detail={metrics.sos ? "Immediate welfare review required" : "No active SOS in the live feed"} href="/admin/metrics" action="Open SOS queue" /><OperationsCard icon={Fence} title="Geo-fence watch" tone="amber" value={LANDMARKS.length} detail="Sacred sites and operational zones configured" href="/mashair-map" action="Review zones" /><OperationsCard icon={Bot} title="AI operations assistant" tone="blue" value="Ready" detail="Use Zoya for guided triage and official Hajj information." href="/chat" action="Ask Zoya" /></div>
              </section>

              <aside id="pilgrim-list" className="order-1 min-w-0 scroll-mt-24 rounded-3xl border border-white/10 bg-[#0b1e30]/80 shadow-2xl shadow-black/20 2xl:order-2"><div className="border-b border-white/10 p-4"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-semibold"><ListFilter className="h-4 w-4 text-emerald-300" />Find a pilgrim</div><p className="mt-1 text-xs text-slate-500">Search only the consented tracking feed.</p></div><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">{filteredLocations.length} shown</span></div><div className="relative mt-4"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by Haj ID or group" aria-label="Search pilgrims by Haj ID or group" className="h-11 border-white/10 bg-white/[.05] pl-9 text-sm text-white placeholder:text-slate-500 focus-visible:ring-emerald-400/40" /></div><div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Location status filters">{(["all", "active", "sos", "stale"] as const).map((filter) => <button type="button" key={filter} onClick={() => setStatusFilter(filter)} className={`min-h-9 shrink-0 rounded-full px-3 text-xs font-medium capitalize transition ${statusFilter === filter ? "bg-emerald-400 text-slate-950" : "bg-white/[.05] text-slate-400 hover:bg-white/10"}`}>{filter === "all" ? "Everyone" : filter === "active" ? "Live now" : filter === "sos" ? "SOS" : "Needs check-in"}</button>)}</div></div><div className="max-h-[620px] overflow-y-auto p-2">{loading && locations.length === 0 ? <div className="space-y-2 p-2">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-16 rounded-2xl bg-white/[.06]" />)}</div> : filteredLocations.length === 0 ? <div className="px-5 py-14 text-center"><CircleHelp className="mx-auto h-8 w-8 text-slate-600" /><p className="mt-3 text-sm font-medium text-slate-300">No matching locations</p><p className="mt-1 text-xs text-slate-500">Try another search or filter.</p></div> : filteredLocations.map((location) => <PilgrimRow key={location.id} location={location} onFocus={() => map.current?.flyTo({ center: [location.longitude, location.latitude], zoom: 14, duration: 800 })} />)}</div><div className="border-t border-white/10 p-3"><div className="flex items-start gap-2 text-[10px] leading-4 text-slate-500"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />Names, photos, battery and passport data are not exposed because they are not present in the consented location feed.</div></div></aside>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /><span>Consent-gated live tracking · encrypted transport · audit-ready access controls</span></div><Link to="/privacy-policy" className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200">Privacy & data use <ChevronRight className="h-3 w-3" /></Link></div>
            <footer className="flex flex-col gap-1 pb-4 text-center text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between"><span>HajCare AI · Sukoon Tracking System</span><span>Your safety, our priority</span></footer>
          </div>
        </main>
      </div>
    </div>
  );
};

const toneClasses: Record<string, { icon: string; value: string }> = {
  emerald: { icon: "bg-emerald-400/15 text-emerald-300", value: "text-emerald-200" },
  blue: { icon: "bg-blue-400/15 text-blue-300", value: "text-blue-100" },
  rose: { icon: "bg-rose-400/15 text-rose-300", value: "text-rose-100" },
  amber: { icon: "bg-amber-300/15 text-amber-200", value: "text-amber-100" },
  violet: { icon: "bg-violet-400/15 text-violet-200", value: "text-violet-100" },
  slate: { icon: "bg-slate-400/15 text-slate-300", value: "text-slate-100" },
};

const KpiCard = ({ label, value, icon: Icon, tone, detail, emphasis }: { label: string; value: number | string; icon: typeof Activity; tone: keyof typeof toneClasses; detail: string; emphasis?: boolean }) => <div className={`rounded-2xl border ${emphasis ? "border-rose-300/30" : "border-white/10"} bg-white/[.045] p-3 shadow-lg shadow-black/10`}><div className="flex items-center justify-between gap-2"><div className={`grid h-8 w-8 place-items-center rounded-xl ${toneClasses[tone].icon}`}><Icon className="h-4 w-4" /></div>{emphasis && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />}</div><div className={`mt-3 text-xl font-semibold tracking-tight ${toneClasses[tone].value}`}>{value}</div><div className="mt-0.5 truncate text-[11px] font-medium text-slate-300">{label}</div><div className="mt-1 truncate text-[10px] text-slate-500">{detail}</div></div>;

const OperationsCard = ({ icon: Icon, title, tone, value, detail, href, action }: { icon: typeof Siren; title: string; tone: keyof typeof toneClasses; value: number | string; detail: string; href: string; action: string }) => <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><div className="flex items-center justify-between"><div className={`grid h-9 w-9 place-items-center rounded-xl ${toneClasses[tone].icon}`}><Icon className="h-4 w-4" /></div><span className={`text-xl font-semibold ${toneClasses[tone].value}`}>{value}</span></div><div className="mt-3 text-sm font-semibold text-white">{title}</div><p className="mt-1 min-h-8 text-[11px] leading-4 text-slate-500">{detail}</p><Link to={href} className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200">{action}<ChevronRight className="h-3 w-3" /></Link></div>;

const PilgrimRow = ({ location, onFocus }: { location: LiveLocation; onFocus: () => void }) => { const style = statusStyle(location.pilgrim_status); const active = isActiveLocation(location.updated_at); return <button type="button" onClick={onFocus} className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-white/[.06]"><div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-[#102b3c] text-slate-300"><UserRound className="h-4 w-4" /><span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b1e30]" style={{ background: active ? style.color : "#64748b" }} /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="truncate text-xs font-semibold text-slate-200">Pilgrim #{location.member_id.slice(0, 8)}</span><span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold" style={{ background: style.tint, color: style.color }}>{active ? style.label : "Stale"}</span></div><div className="mt-1 flex items-center gap-2 truncate text-[10px] text-slate-500"><span>{stageLabel(location.current_stage)}</span><span>•</span><span>{minutesSince(location.updated_at)}m ago</span></div></div><MapPin className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-emerald-300" /></button>; };

const MapOverlay = ({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) => <div className="absolute inset-0 z-10 grid place-items-center bg-[#071321]/80 p-6 text-center backdrop-blur-sm"><div className="max-w-xs"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[.06]">{icon}</div><h3 className="mt-4 text-sm font-semibold text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-400">{body}</p>{action}</div></div>;

export default AdminLiveTrackingPage;
