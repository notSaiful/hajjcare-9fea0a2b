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
  Download,
  ChevronUp,
  ChevronDown,
  MapPinned,
  Home
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
  const [mapLoading, setMapLoading] = useState(true);
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
          setMapLoading(false);
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
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [HAJJ_LOCATIONS.kaaba.lng, HAJJ_LOCATIONS.kaaba.lat],
      zoom: 11,
      pitch: 45,
    });

    // Handle map load event
    map.current.on('load', () => {
      setMapLoading(false);
      map.current?.resize();
    });

    // Handle map errors
    map.current.on('error', (e) => {
      console.error('Mapbox error:', e);
      setMapError('Unable to load map');
      setMapLoading(false);
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
      el.className = "user-location-marker";
      el.innerHTML = `
        <div class="user-marker-inner">
          <div class="user-marker-ping"></div>
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

  const stageNameByLang: Record<string, { ar: string; en: string }> = {
    kaaba: { ar: "الكعبة", en: "Kaaba" },
    mina: { ar: "منى", en: "Mina" },
    arafat: { ar: "عرفات", en: "Arafat" },
    muzdalifah: { ar: "مزدلفة", en: "Muzdalifah" },
    jamarat: { ar: "الجمرات", en: "Jamarat" },
  };

  const otherMembers = memberLocations.filter(l => l.member_id !== memberId);

  // Enhanced Error State
  if (mapError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex flex-col items-center justify-center p-6" dir={isRTL ? "rtl" : "ltr"}>
        {/* Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm text-center">
          {/* Icon Container */}
          <div className="w-24 h-24 rounded-full bg-muted/50 backdrop-blur-sm flex items-center justify-center border border-border/50">
            <MapPinned className="w-12 h-12 text-muted-foreground" />
          </div>
          
          {/* Error Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {language === "ar" ? "تعذر تحميل الخريطة" : "Unable to Load Map"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mapError === "Please log in to view the map" 
                ? (language === "ar" ? "يرجى تسجيل الدخول لعرض الخريطة" : "Please log in to view the map")
                : (language === "ar" ? "حدث خطأ أثناء تحميل الخريطة. يرجى المحاولة مرة أخرى." : "An error occurred while loading the map. Please try again.")
              }
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              onClick={() => window.location.reload()}
              className="flex-1 gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {language === "ar" ? "إعادة المحاولة" : "Try Again"}
            </Button>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" />
                {language === "ar" ? "الصفحة الرئيسية" : "Go Home"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      {/* Enhanced Loading Overlay */}
      {mapLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-primary/10">
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Map Icon with Loader */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border/50 shadow-lg">
                <Compass className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="text-center space-y-1">
              <p className="text-lg font-medium text-foreground">
                {language === "ar" ? "جارٍ تحميل الخريطة" : "Loading Map"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "ar" ? "يرجى الانتظار..." : "Please wait..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Frosted Glass Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 safe-area-top">
        <div className="bg-background/70 backdrop-blur-xl border-b border-border/30">
          <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 hover:bg-background/50 rounded-full px-4"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                <span className="hidden sm:inline">{language === "ar" ? "الرئيسية" : "Home"}</span>
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <Compass className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-primary">{t("liveMap")}</span>
            </div>
            
            <Button 
              variant="ghost"
              size="icon"
              className="hover:bg-background/50 rounded-full"
              onClick={() => refresh()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side Action Buttons */}
      <div className={`absolute top-24 ${isRTL ? 'left-4' : 'right-4'} z-10 flex flex-col gap-2`}>
        {/* Downloadable Maps Button */}
        <Dialog open={showMaps} onOpenChange={setShowMaps}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="shadow-lg gap-2 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-card"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">{language === "ar" ? "الخرائط" : "Maps"}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {language === "ar" ? "تحميل الخرائط" : "Downloadable Maps"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {downloadableMaps.map((mapItem) => (
                <a
                  key={mapItem.id}
                  href={mapItem.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {language === "ar" ? mapItem.nameAr : mapItem.nameEn}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {language === "ar" ? mapItem.descAr : mapItem.descEn}
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
            className={`shadow-lg gap-2 rounded-full ${!showFamily ? 'bg-card/90 backdrop-blur-sm border border-border/50 hover:bg-card' : ''}`}
          >
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold">{otherMembers.length}</span>
          </Button>
        )}
      </div>

      {/* Quick Location Pills - Horizontal Scroll */}
      <div className={`absolute ${showInfo ? 'bottom-[340px]' : 'bottom-24'} left-0 right-0 z-10 transition-all duration-300`}>
        <div className="overflow-x-auto scrollbar-hide px-4">
          <div className="flex gap-2 pb-2">
            {[
              { key: "kaaba", loc: HAJJ_LOCATIONS.kaaba, color: "#D4AF37" },
              { key: "mina", loc: HAJJ_LOCATIONS.mina, color: "#C9A227" },
              { key: "arafat", loc: HAJJ_LOCATIONS.arafat, color: "#8B4513" },
              { key: "muzdalifah", loc: HAJJ_LOCATIONS.muzdalifah, color: "#2F4F4F" },
              { key: "jamarat", loc: HAJJ_LOCATIONS.jamarat, color: "#800020" },
            ].map(({ key, loc, color }) => (
              <button
                key={key}
                className="flex items-center gap-2 px-4 py-2.5 bg-card/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 whitespace-nowrap transition-all hover:scale-105 active:scale-95 min-h-[44px]"
                onClick={() => flyToLocation(loc.lng, loc.lat)}
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-medium">
                  {language === "ar" 
                    ? stageNameByLang[key]?.ar 
                    : stageNameByLang[key]?.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Current Location Button */}
      <Button
        onClick={flyToUser}
        disabled={!lat || !lng}
        size="icon"
        className={`absolute ${showInfo ? 'bottom-[400px]' : 'bottom-32'} ${isRTL ? 'left-4' : 'right-4'} z-10 h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-all duration-300 disabled:opacity-50`}
      >
        <Target className="w-6 h-6 text-primary-foreground" />
        {lat && lng && (
          <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        )}
      </Button>

      {/* Elegant Bottom Drawer */}
      <div 
        className={`absolute bottom-0 left-0 right-0 z-10 transition-transform duration-300 ease-out ${
          showInfo ? "translate-y-0" : "translate-y-[calc(100%-60px)]"
        }`}
      >
        {/* Drawer Handle */}
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="w-full flex flex-col items-center pt-2 pb-3 bg-card/95 backdrop-blur-xl rounded-t-3xl border-t border-x border-border/30"
        >
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mb-2" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {showInfo ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            <span>{showInfo ? (language === "ar" ? "إخفاء التفاصيل" : "Hide Details") : (language === "ar" ? "عرض التفاصيل" : "Show Details")}</span>
          </div>
        </button>
        
        <div className="bg-card/95 backdrop-blur-xl px-4 pb-8 safe-area-bottom">
          {/* Stage Indicator */}
          <div 
            className="flex items-center gap-3 p-4 rounded-2xl mb-4 border"
            style={{ 
              backgroundColor: `${stageInfo.color}10`,
              borderColor: `${stageInfo.color}30`
            }}
          >
            <div 
              className="w-5 h-5 rounded-full animate-pulse shadow-lg"
              style={{ 
                backgroundColor: stageInfo.color,
                boxShadow: `0 0 12px ${stageInfo.color}50`
              }}
            />
            <div className="flex-1">
              <p className="font-semibold text-base" style={{ color: stageInfo.color }}>
                {language === "ar" ? stageInfo.nameAr : stageInfo.nameEn}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {language === "ar" ? stageInfo.descriptionAr : stageInfo.descriptionEn}
              </p>
            </div>
            <MapPin className="w-6 h-6" style={{ color: stageInfo.color }} />
          </div>

          {/* Family Members in Group */}
          {group && otherMembers.length > 0 && (
            <div className="mb-4 p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium text-blue-500">{t("familyGroup")}: {group.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {otherMembers.map((loc) => (
                  <button
                    key={loc.member_id}
                    onClick={() => flyToLocation(loc.longitude, loc.latitude)}
                    className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95 min-h-[36px]"
                  >
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                    {loc.member_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Next Step */}
          <div className="flex items-start gap-3 mb-4 p-3 bg-muted/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-islamic-gold/10 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-5 h-5 text-islamic-gold" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">{t("nextStep")}</p>
              <p className="text-sm font-medium mt-0.5">
                {language === "ar" ? stageInfo.nextStageAr : stageInfo.nextStageEn}
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">{t("tips")}</p>
            <ul className="space-y-2">
              {(language === "ar" ? stageInfo.tipsAr : stageInfo.tipsEn).slice(0, 2).map((tip, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-islamic-gold text-lg leading-none">•</span>
                  <span className="text-foreground/80">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-destructive/10 rounded-xl flex items-center gap-3 border border-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <span className="text-sm text-destructive flex-1">{error}</span>
              <Button variant="ghost" size="sm" className="text-xs shrink-0" onClick={refresh}>
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
