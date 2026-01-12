import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useHajjLocation, HAJJ_LOCATIONS, HAJJ_STAGES } from "@/hooks/useHajjLocation";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  Compass,
  Target,
  Users,
  FileText,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const familyMarkers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const { lat, lng, stage, stageInfo, error, isLoading, refresh } = useHajjLocation();
  const { t, language, isRTL } = useLanguage();
  const { group, memberLocations, memberId, updateLocation } = useFamilyGroup();
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [showFamily, setShowFamily] = useState(true);
  const [showMaps, setShowMaps] = useState(false);

  const downloadableMaps = [
    {
      id: "makkah-building",
      nameEn: "Makkah Building Map",
      nameAr: "خريطة مباني مكة",
      descEn: "Indian Hajj Pilgrims Building Location Map",
      descAr: "خريطة مواقع مباني الحجاج الهنود",
      file: "/maps/makkah-building-map.pdf"
    },
    {
      id: "azizia",
      nameEn: "Azizia Map",
      nameAr: "خريطة العزيزية",
      descEn: "Azizia Area Accommodation Map",
      descAr: "خريطة سكن منطقة العزيزية",
      file: "/maps/azizia-map.pdf"
    }
  ];

  // Update family group with location
  useEffect(() => {
    if (group && lat && lng) {
      updateLocation(lat, lng, stage);
    }
  }, [group, lat, lng, stage, updateLocation]);

  // Fetch Mapbox token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setMapError("Please log in to view the map");
          return;
        }
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
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
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [HAJJ_LOCATIONS.kaaba.lng, HAJJ_LOCATIONS.kaaba.lat],
      zoom: 11,
      pitch: 45,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    // Add markers for all Hajj locations
    const locations = [
      { ...HAJJ_LOCATIONS.kaaba, key: "kaaba" },
      { ...HAJJ_LOCATIONS.mina, key: "mina" },
      { ...HAJJ_LOCATIONS.arafat, key: "arafat" },
      { ...HAJJ_LOCATIONS.muzdalifah, key: "muzdalifah" },
      { ...HAJJ_LOCATIONS.jamarat, key: "jamarat" },
    ];

    locations.forEach((loc) => {
      const stageData = HAJJ_STAGES[loc.key as keyof typeof HAJJ_STAGES];
      const el = document.createElement("div");
      el.className = "hajj-marker";
      el.innerHTML = `
        <div style="
          background: ${stageData.color};
          color: white;
          padding: 8px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
          ${language === "ar" ? stageData.nameAr : stageData.nameEn}
        </div>
      `;

      new mapboxgl.Marker({ element: el })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapToken, language]);

  // Update user marker
  useEffect(() => {
    if (!map.current || !lat || !lng) return;

    if (userMarker.current) {
      userMarker.current.setLngLat([lng, lat]);
    } else {
      const el = document.createElement("div");
      el.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background: #166534;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          position: relative;
        ">
          <div style="
            position: absolute;
            inset: -8px;
            border: 2px solid #166534;
            border-radius: 50%;
            animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
            opacity: 0.5;
          "></div>
        </div>
      `;

      userMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map.current);
    }

    map.current.flyTo({
      center: [lng, lat],
      zoom: 15,
      duration: 1500,
    });
  }, [lat, lng]);

  // Update family member markers
  useEffect(() => {
    if (!map.current || !showFamily) return;

    memberLocations.forEach((loc) => {
      // Skip self
      if (loc.member_id === memberId) return;

      const existingMarker = familyMarkers.current.get(loc.member_id);
      
      if (existingMarker) {
        existingMarker.setLngLat([loc.longitude, loc.latitude]);
      } else {
        const el = document.createElement("div");
        
        // Create marker using DOM manipulation to prevent XSS
        const container = document.createElement("div");
        container.style.cssText = `
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 4px;
          border: 2px solid white;
        `;
        
        const dot = document.createElement("div");
        dot.style.cssText = "width: 6px; height: 6px; background: white; border-radius: 50%;";
        
        const nameSpan = document.createElement("span");
        // Use textContent to safely render member name (prevents XSS)
        nameSpan.textContent = loc.member_name || "Member";
        
        container.appendChild(dot);
        container.appendChild(nameSpan);
        el.appendChild(container);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([loc.longitude, loc.latitude])
          .addTo(map.current!);
        
        familyMarkers.current.set(loc.member_id, marker);
      }
    });

    // Remove markers for members no longer in the list
    familyMarkers.current.forEach((marker, id) => {
      if (!memberLocations.find(l => l.member_id === id)) {
        marker.remove();
        familyMarkers.current.delete(id);
      }
    });
  }, [memberLocations, memberId, showFamily]);

  const flyToUser = () => {
    if (lat && lng && map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        duration: 1500,
      });
    }
  };

  const flyToLocation = (targetLng: number, targetLat: number) => {
    map.current?.flyTo({
      center: [targetLng, targetLat],
      zoom: 15,
      duration: 1500,
    });
  };

  if (mapError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <span className="text-lg text-destructive">{t("unableToLoadMap")}</span>
          <Link to="/">
            <Button variant="outline">{t("backToChat")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stageNameByLang: Record<string, { ar: string; en: string }> = {
    kaaba: { ar: "الكعبة", en: "Kaaba" },
    mina: { ar: "منى", en: "Mina" },
    arafat: { ar: "عرفات", en: "Arafat" },
    muzdalifah: { ar: "مزدلفة", en: "Muzdalifah" },
    jamarat: { ar: "الجمرات", en: "Jamarat" },
  };

  const otherMembers = memberLocations.filter(l => l.member_id !== memberId);

  return (
    <div className="h-screen w-screen relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/95 to-transparent p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="secondary" size="sm" className="shadow-elevated gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("backToChat")}
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-elevated">
            <Compass className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">{t("liveMap")}</span>
          </div>
          <Button 
            variant="secondary" 
            size="icon"
            className="shadow-elevated"
            onClick={() => {
              refresh();
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Top Action Buttons */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
        {/* Downloadable Maps Button */}
        <Dialog open={showMaps} onOpenChange={setShowMaps}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="shadow-elevated gap-2"
            >
              <FileText className="w-4 h-4" />
              {language === "ar" ? "الخرائط" : "Maps"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {language === "ar" ? "تحميل الخرائط" : "Downloadable Maps"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {downloadableMaps.map((map) => (
                <a
                  key={map.id}
                  href={map.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {language === "ar" ? map.nameAr : map.nameEn}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {language === "ar" ? map.descAr : map.descEn}
                    </p>
                  </div>
                  <Download className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </a>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Family Toggle Button */}
        {group && (
          <Button
            onClick={() => setShowFamily(!showFamily)}
            size="sm"
            variant={showFamily ? "default" : "secondary"}
            className="shadow-elevated gap-2"
          >
            <Users className="w-4 h-4" />
            {otherMembers.length}
          </Button>
        )}
      </div>

      {/* Current Location Button */}
      <Button
        onClick={flyToUser}
        disabled={!lat || !lng}
        size="icon"
        className="absolute bottom-32 right-4 z-10 h-12 w-12 rounded-full shadow-elevated bg-primary hover:bg-primary/90"
      >
        <Target className="w-5 h-5 text-primary-foreground" />
      </Button>

      {/* Location Quick Access */}
      <div className="absolute bottom-32 left-4 z-10 flex flex-col gap-2">
        {[
          { key: "kaaba", loc: HAJJ_LOCATIONS.kaaba, color: "#D4AF37" },
          { key: "mina", loc: HAJJ_LOCATIONS.mina, color: "#C9A227" },
          { key: "arafat", loc: HAJJ_LOCATIONS.arafat, color: "#8B4513" },
          { key: "muzdalifah", loc: HAJJ_LOCATIONS.muzdalifah, color: "#2F4F4F" },
          { key: "jamarat", loc: HAJJ_LOCATIONS.jamarat, color: "#800020" },
        ].map(({ key, loc, color }) => (
          <Button
            key={key}
            variant="secondary"
            size="sm"
            className="shadow-elevated text-xs justify-start gap-2"
            onClick={() => flyToLocation(loc.lng, loc.lat)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            {language === "ar" 
              ? stageNameByLang[key]?.ar 
              : stageNameByLang[key]?.en}
          </Button>
        ))}
      </div>

      {/* Bottom Info Card */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-10 transition-transform duration-300 ${
          showInfo ? "translate-y-0" : "translate-y-[calc(100%-48px)]"
        }`}
      >
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="w-full flex justify-center py-2"
        >
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </button>
        
        <div className="bg-card/95 backdrop-blur-md rounded-t-3xl shadow-elevated p-4 pb-8">
          {/* Stage Indicator */}
          <div 
            className="flex items-center gap-3 p-3 rounded-2xl mb-3"
            style={{ backgroundColor: `${stageInfo.color}20` }}
          >
            <div 
              className="w-4 h-4 rounded-full animate-pulse"
              style={{ backgroundColor: stageInfo.color }}
            />
            <div className="flex-1">
              <p className="font-arabic font-bold" style={{ color: stageInfo.color }}>
                {language === "ar" ? stageInfo.nameAr : stageInfo.nameEn}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? stageInfo.descriptionAr : stageInfo.descriptionEn}
              </p>
            </div>
            <MapPin className="w-5 h-5" style={{ color: stageInfo.color }} />
          </div>

          {/* Family Members in Group */}
          {group && otherMembers.length > 0 && (
            <div className="mb-3 p-3 bg-blue-500/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-medium text-blue-500">{t("familyGroup")}: {group.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {otherMembers.map((loc) => (
                  <button
                    key={loc.member_id}
                    onClick={() => flyToLocation(loc.longitude, loc.latitude)}
                    className="flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 px-2 py-1 rounded-full text-xs transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    {loc.member_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Next Step */}
          <div className="flex items-start gap-3 mb-3">
            <Navigation className="w-5 h-5 text-islamic-gold mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">{t("nextStep")}</p>
              <p className="text-sm font-medium">
                {language === "ar" ? stageInfo.nextStageAr : stageInfo.nextStageEn}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">{t("tips")}</p>
            <ul className="space-y-1">
              {(language === "ar" ? stageInfo.tipsAr : stageInfo.tipsEn).slice(0, 2).map((tip, i) => (
                <li key={i} className="text-xs flex items-start gap-2">
                  <span className="text-islamic-gold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 p-3 bg-destructive/10 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-xs text-destructive flex-1">{error}</span>
              <Button variant="ghost" size="sm" className="text-xs" onClick={refresh}>
                {t("tryAgain")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
