import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useHajjLocation, HAJJ_LOCATIONS, HAJJ_STAGES } from "@/hooks/useHajjLocation";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Navigation, RefreshCw, Loader2, AlertCircle, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAPBOX_TOKEN = "pk.placeholder"; // Will be replaced by edge function

interface HajjMapProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const HajjMap = ({ isExpanded = false, onToggleExpand }: HajjMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const { lat, lng, stage, stageInfo, error, isLoading, refresh } = useHajjLocation();
  const { t, isArabic } = useLanguage();
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Fetch Mapbox token from edge function
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to get map token");
        const data = await response.json();
        setMapToken(data.token);
      } catch (err) {
        console.error("Error fetching Mapbox token:", err);
        setMapError("Unable to load map");
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
      style: "mapbox://styles/mapbox/light-v11",
      center: [HAJJ_LOCATIONS.kaaba.lng, HAJJ_LOCATIONS.kaaba.lat],
      zoom: 12,
      pitch: 30,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    // Add markers for all Hajj locations
    const locations = [
      { ...HAJJ_LOCATIONS.kaaba, name: "الكعبة", nameEn: "Kaaba", color: "#D4AF37" },
      { ...HAJJ_LOCATIONS.mina, name: "منى", nameEn: "Mina", color: "#C9A227" },
      { ...HAJJ_LOCATIONS.arafat, name: "عرفات", nameEn: "Arafat", color: "#8B4513" },
      { ...HAJJ_LOCATIONS.muzdalifah, name: "مزدلفة", nameEn: "Muzdalifah", color: "#2F4F4F" },
      { ...HAJJ_LOCATIONS.jamarat, name: "الجمرات", nameEn: "Jamarat", color: "#800020" },
    ];

    locations.forEach((loc) => {
      const el = document.createElement("div");
      el.className = "hajj-location-marker";
      el.innerHTML = `
        <div style="
          background: ${loc.color};
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${isArabic ? loc.name : loc.nameEn}
        </div>
      `;

      new mapboxgl.Marker({ element: el })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapToken, isArabic]);

  // Update user marker when location changes
  useEffect(() => {
    if (!map.current || !lat || !lng) return;

    if (userMarker.current) {
      userMarker.current.setLngLat([lng, lat]);
    } else {
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="
          width: 20px;
          height: 20px;
          background: #166534;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `;

      userMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map.current);
    }

    // Fly to user location
    map.current.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1500,
    });
  }, [lat, lng]);

  const flyToLocation = (targetLng: number, targetLat: number) => {
    map.current?.flyTo({
      center: [targetLng, targetLat],
      zoom: 15,
      duration: 1500,
    });
  };

  if (mapError) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-destructive" />
        <span className="text-sm text-destructive">{t("تعذر تحميل الخريطة", "Unable to load map")}</span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 bg-primary/5 border-b border-border cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{t("موقعك الحالي", "Your Location")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              refresh();
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          {onToggleExpand && (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            )
          )}
        </div>
      </div>

      {/* Stage Info Bar */}
      <div 
        className="p-3 border-b border-border"
        style={{ backgroundColor: `${stageInfo.color}15` }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: stageInfo.color }}
          />
          <div className="flex-1">
            <p className="font-arabic font-semibold text-sm" style={{ color: stageInfo.color }}>
              {isArabic ? stageInfo.nameAr : stageInfo.nameEn}
            </p>
            <p className="text-xs text-muted-foreground">
              {isArabic ? stageInfo.descriptionAr : stageInfo.descriptionEn}
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className={`w-full transition-all duration-300 ${isExpanded ? "h-64" : "h-40"}`}
      />

      {/* Next Step & Tips */}
      {isExpanded && stage !== "unknown" && (
        <div className="p-3 space-y-3">
          {/* Next Step */}
          <div className="flex items-start gap-2">
            <Navigation className="w-4 h-4 text-islamic-gold mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">{t("الخطوة التالية", "Next Step")}</p>
              <p className="text-sm font-medium">
                {isArabic ? stageInfo.nextStageAr : stageInfo.nextStageEn}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-2">{t("نصائح", "Tips")}</p>
            <ul className="space-y-1">
              {(isArabic ? stageInfo.tipsAr : stageInfo.tipsEn).map((tip, i) => (
                <li key={i} className="text-xs flex items-start gap-2">
                  <span className="text-islamic-gold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Nav Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "kaaba", loc: HAJJ_LOCATIONS.kaaba },
              { key: "mina", loc: HAJJ_LOCATIONS.mina },
              { key: "arafat", loc: HAJJ_LOCATIONS.arafat },
            ].map(({ key, loc }) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => flyToLocation(loc.lng, loc.lat)}
              >
                {isArabic ? HAJJ_STAGES[key as keyof typeof HAJJ_STAGES].nameAr : HAJJ_STAGES[key as keyof typeof HAJJ_STAGES].nameEn}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-3 bg-destructive/10 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-xs text-destructive">{error}</span>
          <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={refresh}>
            {t("حاول مجدداً", "Try Again")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HajjMap;
