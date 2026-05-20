import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, MapPin, RefreshCw, Users, Activity, AlertTriangle, ArrowLeft, Shield } from "lucide-react";

interface LiveLocation {
  id: string;
  member_id: string;
  group_id: string;
  latitude: number;
  longitude: number;
  current_stage: string | null;
  pilgrim_status: "normal" | "assisted" | "emergency_managed";
  updated_at: string;
  user_id: string | null;
}

const STATUS_COLOR: Record<string, string> = {
  normal: "#0B3D2E",
  assisted: "#C8A951",
  emergency_managed: "#dc2626",
};

const isActive = (updated_at: string) =>
  Date.now() - new Date(updated_at).getTime() < 30 * 60 * 1000;

const AdminLiveTrackingPage = () => {
  const { user, loading: authLoading } = useAuthContext();
  const { isAdmin, isCoordinator, isLoading: roleLoading } = useUserRole();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Record<string, mapboxgl.Marker>>({});
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [locations, setLocations] = useState<LiveLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  const canAccess = isAdmin || isCoordinator;

  // Fetch mapbox token
  useEffect(() => {
    if (!canAccess) return;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`,
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
        const d = await res.json();
        setMapToken(d.token);
      } catch (e) {
        console.error("mapbox token", e);
      }
    })();
  }, [canAccess]);

  const fetchLocations = useCallback(async () => {
    const { data, error } = await supabase
      .from("member_locations")
      .select("id, member_id, group_id, latitude, longitude, current_stage, pilgrim_status, updated_at, user_id")
      .order("updated_at", { ascending: false })
      .limit(1000);
    if (!error && data) setLocations(data as LiveLocation[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!canAccess) return;
    fetchLocations();
    const ch = supabase
      .channel("admin-live-tracking")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "member_locations" },
        () => fetchLocations())
      .subscribe();
    const interval = setInterval(fetchLocations, 60000);
    return () => { supabase.removeChannel(ch); clearInterval(interval); };
  }, [canAccess, fetchLocations]);

  // Init map
  useEffect(() => {
    if (!mapToken || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = mapToken;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [39.8262, 21.4225], // Makkah
      zoom: 11,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.on("load", () => setMapReady(true));
    return () => { map.current?.remove(); map.current = null; };
  }, [mapToken]);

  // Render markers
  useEffect(() => {
    if (!map.current || !mapReady) return;
    const existingIds = new Set(Object.keys(markers.current));
    const seenIds = new Set<string>();

    locations.forEach((loc) => {
      seenIds.add(loc.id);
      const color = STATUS_COLOR[loc.pilgrim_status] || "#0B3D2E";
      const active = isActive(loc.updated_at);
      const opacity = active ? 1 : 0.4;

      if (markers.current[loc.id]) {
        markers.current[loc.id].setLngLat([loc.longitude, loc.latitude]);
      } else {
        const el = document.createElement("div");
        el.style.cssText = `width:18px;height:18px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${color}40;opacity:${opacity};cursor:pointer;`;
        const popup = new mapboxgl.Popup({ offset: 14 }).setHTML(`
          <div style="font-family:system-ui;font-size:13px;min-width:160px">
            <div style="font-weight:600;color:#0B3D2E;margin-bottom:4px">Pilgrim #${loc.member_id.slice(0, 8)}</div>
            <div>Status: <strong style="color:${color}">${loc.pilgrim_status}</strong></div>
            ${loc.current_stage ? `<div>Stage: ${loc.current_stage}</div>` : ""}
            <div style="color:#666;font-size:11px;margin-top:4px">Updated: ${new Date(loc.updated_at).toLocaleString()}</div>
          </div>
        `);
        markers.current[loc.id] = new mapboxgl.Marker({ element: el })
          .setLngLat([loc.longitude, loc.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      }
    });

    // Remove stale
    existingIds.forEach((id) => {
      if (!seenIds.has(id)) { markers.current[id].remove(); delete markers.current[id]; }
    });
  }, [locations, mapReady]);

  if (authLoading || roleLoading) {
    return <div className="p-6"><Skeleton className="h-12 w-full mb-4" /><Skeleton className="h-96 w-full" /></div>;
  }
  if (!user) return <Navigate to="/" replace />;
  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-3">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold">Restricted Access</h2>
            <p className="text-sm text-muted-foreground">This page is only available to administrators and coordinators.</p>
            <Link to="/"><Button variant="outline">Back to Home</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const active = locations.filter((l) => isActive(l.updated_at));
  const emergency = active.filter((l) => l.pilgrim_status === "emergency_managed").length;
  const assisted = active.filter((l) => l.pilgrim_status === "assisted").length;
  const normal = active.filter((l) => l.pilgrim_status === "normal").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-[#0B3D2E] text-white shadow-md">
        <div className="container mx-auto px-3 py-3 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 text-sm hover:opacity-80">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-base sm:text-lg font-semibold flex items-center justify-center gap-2">
              <Activity className="h-4 w-4" /> Live Pilgrim Tracking
            </h1>
          </div>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={fetchLocations}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-3 py-3 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard icon={<Users />} label="Total Devices" value={locations.length} color="#0B3D2E" />
          <StatCard icon={<Activity />} label="Active (30m)" value={active.length} color="#0B3D2E" />
          <StatCard icon={<MapPin />} label="Assisted" value={assisted} color="#C8A951" />
          <StatCard icon={<AlertTriangle />} label="Emergency" value={emergency} color="#dc2626" />
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="p-3 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-medium">Legend:</span>
            <LegendDot color="#0B3D2E" label={`Normal (${normal})`} />
            <LegendDot color="#C8A951" label={`Assisted (${assisted})`} />
            <LegendDot color="#dc2626" label={`Emergency (${emergency})`} />
            <span className="text-muted-foreground ml-auto">Faded = offline &gt; 30 min</span>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="overflow-hidden">
          <div className="relative" style={{ height: "calc(100vh - 340px)", minHeight: 400 }}>
            {!mapToken && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <div ref={mapContainer} className="absolute inset-0" />
            {loading && (
              <div className="absolute top-3 left-3 bg-white/90 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading…
              </div>
            )}
            {!loading && locations.length === 0 && mapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center max-w-sm p-6">
                  <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-semibold mb-1">No pilgrims tracked yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Pilgrim pins will appear here once users enable Sukoon Tracking and grant location permission.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Recent list */}
        {active.length > 0 && (
          <Card>
            <CardContent className="p-3">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-700" /> Recently active pilgrims
              </h3>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {active.slice(0, 50).map((l) => (
                  <div key={l.id} className="flex items-center justify-between gap-2 p-2 rounded border text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: STATUS_COLOR[l.pilgrim_status] }}
                      />
                      <span className="font-mono truncate">#{l.member_id.slice(0, 12)}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-5">
                      {l.current_stage || l.pilgrim_status}
                    </Badge>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {Math.round((Date.now() - new Date(l.updated_at).getTime()) / 60000)}m ago
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-[11px] text-muted-foreground text-center px-2 pb-4">
          🔒 Only pilgrims who explicitly enabled Sukoon Tracking & granted consent appear here. Data handled per DPDP/PDPL guidelines.
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => (
  <Card>
    <CardContent className="p-3 flex items-center gap-2">
      <div className="p-2 rounded-lg" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xl font-bold leading-tight" style={{ color }}>{value}</div>
        <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
      </div>
    </CardContent>
  </Card>
);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span className="flex items-center gap-1.5">
    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
    {label}
  </span>
);

export default AdminLiveTrackingPage;
