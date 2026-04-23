import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2, AlertCircle, ExternalLink, MapPin, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { madinahHotels, getMadinahMapUrl, type MadinahHotel } from "@/data/madinahHotels";
import { getHotelLocation, MASJID_NABAWI, formatDistance } from "@/data/madinahHotelCoords";

interface MadinahHotelsMapProps {
  /** Optional pre-filtered list (e.g. by search). Defaults to all hotels. */
  hotels?: MadinahHotel[];
  /** Map height class (default h-80) */
  heightClass?: string;
}

/**
 * Live map of Madinah hotels. Renders a marker per hotel; tapping a marker
 * opens a detail popover with name, code, Tashee, walk distance from Masjid
 * an-Nabawi, and a Google Maps link.
 *
 * Cluster labels are off — for 381 markers we use small dots and let the user
 * tap or filter the list above to focus.
 */
const MadinahHotelsMap = ({ hotels, heightClass = "h-80" }: MadinahHotelsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [selected, setSelected] = useState<MadinahHotel | null>(null);

  const data = hotels ?? madinahHotels;

  // Pre-compute locations once
  const locations = useMemo(
    () => data.map((h) => ({ hotel: h, loc: getHotelLocation(h) })),
    [data]
  );

  // Fetch Mapbox token (works anonymously too)
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`,
          { headers }
        );
        if (!response.ok) throw new Error("token unavailable");
        const j = await response.json();
        setMapToken(j.token);
      } catch (err) {
        console.error("Mapbox token error:", err);
        setMapError("static");
        setMapLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapToken) return;
    mapboxgl.accessToken = mapToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [MASJID_NABAWI.lng, MASJID_NABAWI.lat],
      zoom: 14.5,
    });

    map.current.on("load", () => {
      setMapLoading(false);
      map.current?.resize();
    });
    map.current.on("error", (e) => {
      console.error("Mapbox error:", e);
      setMapError("static");
      setMapLoading(false);
    });
    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    // Masjid an-Nabawi anchor marker
    const anchor = document.createElement("div");
    anchor.innerHTML = `
      <div style="
        background: hsl(150 50% 20%);
        color: white;
        padding: 6px 10px;
        border-radius: 14px;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        border: 2px solid white;
      ">🕌 Masjid an-Nabawi</div>
    `;
    new mapboxgl.Marker({ element: anchor })
      .setLngLat([MASJID_NABAWI.lng, MASJID_NABAWI.lat])
      .addTo(map.current);

    return () => {
      markers.current.forEach((m) => m.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [mapToken]);

  // Render hotel markers (re-runs when filtered list changes)
  useEffect(() => {
    if (!map.current || mapLoading) return;

    // Clear previous markers
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    locations.forEach(({ hotel, loc }) => {
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", hotel.name);
      el.style.cursor = "pointer";
      el.style.background = "transparent";
      el.style.border = "none";
      el.style.padding = "0";
      const verified = !!hotel.mapLink;
      const color = verified ? "#0B3D2E" : "#C9A227";
      el.innerHTML = `
        <div style="
          width: 22px;
          height: 22px;
          background: ${color};
          color: white;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        ">${hotel.code}</div>
      `;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelected(hotel);
        map.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 16, duration: 800 });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map.current!);
      markers.current.push(marker);
    });
  }, [locations, mapLoading]);

  if (mapError === "static") {
    return (
      <div className={`relative w-full ${heightClass} rounded-xl border border-border bg-muted flex flex-col items-center justify-center gap-2 p-4 text-center`}>
        <AlertCircle className="w-6 h-6 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Interactive map unavailable. Use the list below.</p>
      </div>
    );
  }

  const selectedLoc = selected ? getHotelLocation(selected) : null;

  return (
    <div className="relative w-full">
      <div className={`relative w-full ${heightClass} rounded-xl border border-border overflow-hidden`}>
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
        {mapLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/60 backdrop-blur-sm">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 py-1.5 text-[10px] space-y-1 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0B3D2E] border border-white" />
            <span>Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#C9A227] border border-white" />
            <span>Approximate</span>
          </div>
        </div>
      </div>

      {/* Selected hotel popover */}
      {selected && selectedLoc && (
        <div className="mt-2 bg-card border-2 border-primary/30 rounded-xl p-3 shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-emerald-700">#{selected.code}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">{selected.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Tashee {selected.madTashee} · {selected.type}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  {formatDistance(selectedLoc.distanceFromHaramKm)}
                </Badge>
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Footprints className="w-2.5 h-2.5" />
                  ~{selectedLoc.walkMinutes} min walk
                </Badge>
                {selectedLoc.isApproximate && (
                  <Badge variant="outline" className="text-[10px]">Approx. position</Badge>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-muted-foreground hover:text-foreground px-1"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <Button
            asChild
            size="sm"
            className="w-full mt-2 rounded-lg gap-1.5"
          >
            <a
              href={getMadinahMapUrl(selected)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MadinahHotelsMap;
