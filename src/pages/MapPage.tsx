import { useEffect, useRef, useState } from "react";
import { LocationPermissionFlow } from "@/components/LocationPermissionFlow";
import { LocationReminderBanner } from "@/components/LocationReminderBanner";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useHajjLocation, HAJJ_LOCATIONS, HAJJ_STAGES } from "@/hooks/useHajjLocation";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useFamilyGroup } from "@/hooks/useFamilyGroup";
import { useGeofencedTracking } from "@/hooks/useGeofencedTracking";
import { useGeofenceMonitor } from "@/hooks/useGeofenceMonitor";
import { Link, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  ShieldAlert,
  ArrowLeft,
  Compass,
  Target,
  Users,
  FileText,
  Download,
  ChevronUp,
  ChevronDown,
  MapPinned,
  Home,
  Eye,
  X
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
  const { lat, lng, accuracy, stage, stageInfo, error, isLoading, refresh, isStale, lastUpdatedAt } = useHajjLocation();
  const { t, language, isRTL } = useLanguage();
  const { group, memberLocations, memberId, updateLocation } = useFamilyGroup();
  const { processLocation, geofenceStatus, lastSensorResult } = useGeofencedTracking(group?.id ?? null);
  const { zones: geofenceZones, loadZones } = useGeofenceMonitor();
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showFamily, setShowFamily] = useState(true);
  const [showMaps, setShowMaps] = useState(false);

  const [selectedMapView, setSelectedMapView] = useState<string | null>(null);

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

  // Pipe GPS updates through Smart Sensor + Geofence pipeline
  useEffect(() => {
    if (lat && lng && group) {
      // Process through Smart Sensor → Geofence Monitor pipeline
      processLocation(lat, lng, accuracy, stage, memberId).then((result) => {
        // Only push to family group when sensor says "send"
        if (result.decision === "send") {
          updateLocation(lat, lng, stage);
        }
      });
    }
  }, [group, lat, lng, stage, accuracy, memberId, processLocation, updateLocation]);

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
      // Load geofence zones for circle overlays
      loadZones();
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
  }, [mapToken, language, loadZones]);

  // Draw geofence zone circles on the map
  useEffect(() => {
    if (!map.current || geofenceZones.length === 0) return;
    const m = map.current;

    // Wait for map style to be loaded
    const addCircles = () => {
      // Remove old layers/sources if they exist
      geofenceZones.forEach((zone) => {
        const layerId = `geofence-fill-${zone.id}`;
        const outlineId = `geofence-outline-${zone.id}`;
        const labelId = `geofence-label-${zone.id}`;
        const sourceId = `geofence-${zone.id}`;
        const labelSourceId = `geofence-label-src-${zone.id}`;
        if (m.getLayer(layerId)) m.removeLayer(layerId);
        if (m.getLayer(outlineId)) m.removeLayer(outlineId);
        if (m.getLayer(labelId)) m.removeLayer(labelId);
        if (m.getSource(sourceId)) m.removeSource(sourceId);
        if (m.getSource(labelSourceId)) m.removeSource(labelSourceId);
      });

      geofenceZones.forEach((zone) => {
        const sourceId = `geofence-${zone.id}`;
        const fillLayerId = `geofence-fill-${zone.id}`;
        const outlineLayerId = `geofence-outline-${zone.id}`;

        // Generate circle polygon (64 points)
        const center = [zone.center_lng, zone.center_lat];
        const radiusKm = zone.radius_meters / 1000;
        const points = 64;
        const coords: [number, number][] = [];

        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * 2 * Math.PI;
          const dx = radiusKm * Math.cos(angle);
          const dy = radiusKm * Math.sin(angle);
          const lat = center[1] + (dy / 111.32);
          const lng = center[0] + (dx / (111.32 * Math.cos((center[1] * Math.PI) / 180)));
          coords.push([lng, lat]);
        }

        const isCity = zone.zone_type === "city_zone";
        const fillColor = isCity ? "#3b82f6" : "#22c55e";
        const outlineColor = isCity ? "#2563eb" : "#16a34a";

        m.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: { name: zone.name, name_ar: zone.name_ar, zone_type: zone.zone_type },
            geometry: { type: "Polygon", coordinates: [coords] },
          },
        });

        m.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": fillColor,
            "fill-opacity": isCity ? 0.06 : 0.1,
          },
        });

        m.addLayer({
          id: outlineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": outlineColor,
            "line-width": isCity ? 1.5 : 2,
            "line-dasharray": isCity ? [4, 3] : [1],
            "line-opacity": 0.6,
          },
        });

        // Add zone name label at center
        const labelSourceId = `geofence-label-src-${zone.id}`;
        const labelLayerId = `geofence-label-${zone.id}`;
        const isArabic = language === "ar" || language === "ur";
        const labelText = isArabic && zone.name_ar ? zone.name_ar : zone.name;

        m.addSource(labelSourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: { label: labelText },
            geometry: { type: "Point", coordinates: [zone.center_lng, zone.center_lat] },
          },
        });

        m.addLayer({
          id: labelLayerId,
          type: "symbol",
          source: labelSourceId,
          layout: {
            "text-field": ["get", "label"],
            "text-size": isCity ? 11 : 12,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": outlineColor,
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.5,
            "text-opacity": 0.85,
          },
        });
      });
    };

    if (m.isStyleLoaded()) {
      addCircles();
    } else {
      m.once("style.load", addCircles);
    }
  }, [geofenceZones, language]);

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

  // Status color mapping for family members
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "emergency": return "#ef4444";
      case "help": case "missing": return "#f59e0b";
      case "hospital": return "#3b82f6";
      default: return "#22c55e"; // normal
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "emergency": return language === "ar" ? "طوارئ" : "Emergency";
      case "help": return language === "ar" ? "يحتاج مساعدة" : "Needs Help";
      case "missing": return language === "ar" ? "مفقود" : "Missing";
      case "hospital": return language === "ar" ? "مستشفى" : "Hospital";
      default: return language === "ar" ? "طبيعي" : "Normal";
    }
  };

  const getTimeSinceUpdate = (updatedAt: string) => {
    const diff = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 60000);
    if (diff < 1) return language === "ar" ? "الآن" : "Just now";
    if (diff < 60) return language === "ar" ? `${diff} دقيقة` : `${diff}m ago`;
    const hrs = Math.floor(diff / 60);
    return language === "ar" ? `${hrs} ساعة` : `${hrs}h ago`;
  };

  // Update family member markers with status colors + popups
  useEffect(() => {
    if (!map.current || !showFamily) return;

    memberLocations.forEach((loc) => {
      if (loc.member_id === memberId) return;

      const statusColor = getStatusColor(loc.pilgrim_status);
      const statusLabel = getStatusLabel(loc.pilgrim_status);
      const stageLabel = loc.current_stage 
        ? (HAJJ_STAGES[loc.current_stage as keyof typeof HAJJ_STAGES]
            ? (language === "ar" 
                ? HAJJ_STAGES[loc.current_stage as keyof typeof HAJJ_STAGES].nameAr 
                : HAJJ_STAGES[loc.current_stage as keyof typeof HAJJ_STAGES].nameEn)
            : loc.current_stage)
        : (language === "ar" ? "غير محدد" : "Unknown");
      const timeAgo = getTimeSinceUpdate(loc.updated_at);
      const isEmergency = ["emergency", "help", "missing"].includes(loc.pilgrim_status?.toLowerCase());

      const existingMarker = familyMarkers.current.get(loc.member_id);
      
      if (existingMarker) {
        existingMarker.setLngLat([loc.longitude, loc.latitude]);
        // Update marker element colors
        const markerEl = existingMarker.getElement();
        const container = markerEl.querySelector(".family-marker-container") as HTMLElement;
        if (container) {
          container.style.background = statusColor;
          container.style.boxShadow = isEmergency 
            ? `0 0 16px ${statusColor}80, 0 4px 12px rgba(0,0,0,0.3)` 
            : `0 4px 12px rgba(0,0,0,0.3)`;
        }
      } else {
        const el = document.createElement("div");
        
        const container = document.createElement("div");
        container.className = "family-marker-container";
        container.style.cssText = `
          background: ${statusColor};
          color: white;
          padding: 6px 10px;
          border-radius: 14px;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: ${isEmergency ? `0 0 16px ${statusColor}80,` : ""} 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 5px;
          border: 2px solid white;
          cursor: pointer;
          transition: transform 0.15s;
          ${isEmergency ? "animation: pulse 2s infinite;" : ""}
        `;
        
        const dot = document.createElement("div");
        dot.style.cssText = `width: 7px; height: 7px; background: white; border-radius: 50%; ${isEmergency ? "animation: ping 1.5s infinite;" : ""}`;
        
        const nameSpan = document.createElement("span");
        nameSpan.textContent = loc.member_name || "Member";
        
        container.appendChild(dot);
        container.appendChild(nameSpan);
        el.appendChild(container);

        // Create popup with member details
        const popupContent = document.createElement("div");
        popupContent.style.cssText = "padding: 4px 0; min-width: 160px;";
        
        const nameRow = document.createElement("div");
        nameRow.style.cssText = "font-weight: 700; font-size: 14px; margin-bottom: 8px;";
        nameRow.textContent = loc.member_name || "Member";
        
        const statusRow = document.createElement("div");
        statusRow.style.cssText = `display: flex; align-items: center; gap: 6px; margin-bottom: 4px;`;
        const statusDot = document.createElement("span");
        statusDot.style.cssText = `width: 8px; height: 8px; border-radius: 50%; background: ${statusColor}; display: inline-block;`;
        const statusText = document.createElement("span");
        statusText.style.cssText = "font-size: 12px;";
        statusText.textContent = statusLabel;
        statusRow.appendChild(statusDot);
        statusRow.appendChild(statusText);
        
        const stageRow = document.createElement("div");
        stageRow.style.cssText = "font-size: 12px; color: #666; margin-bottom: 4px;";
        stageRow.textContent = `📍 ${stageLabel}`;
        
        const timeRow = document.createElement("div");
        timeRow.style.cssText = "font-size: 11px; color: #999;";
        timeRow.textContent = `🕐 ${timeAgo}`;

        popupContent.appendChild(nameRow);
        popupContent.appendChild(statusRow);
        popupContent.appendChild(stageRow);
        popupContent.appendChild(timeRow);

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setDOMContent(popupContent);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([loc.longitude, loc.latitude])
          .setPopup(popup)
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
  }, [memberLocations, memberId, showFamily, language]);

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

      {/* Location Permission Prompt - shown when GPS is unavailable */}
      {!mapLoading && !isLoading && !lat && !lng && !error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <Navigation className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                {language === "ar" ? "يحتاج إلى إذن الموقع" : language === "ur" ? "لوکیشن کی اجازت درکار ہے" : language === "hi" ? "लोकेशन की अनुमति आवश्यक है" : "Location Permission Needed"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === "ar"
                  ? "السماح بالوصول إلى موقعك لعرض موقعك على الخريطة وتتبع مراحل الحج"
                  : language === "ur"
                  ? "نقشے پر اپنا مقام دکھانے اور حج کے مراحل کی نگرانی کے لیے لوکیشن تک رسائی کی اجازت دیں"
                  : language === "hi"
                  ? "नक्शे पर अपना स्थान दिखाने और हज चरणों की निगरानी के लिए लोकेशन एक्सेस की अनुमति दें"
                  : "Allow location access to show your position on the map and track your Hajj stages"}
              </p>
            </div>
            <Button
              className="w-full gap-2 h-12 text-base"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    () => window.location.reload(),
                    () => {
                      setMapError(
                        language === "ar"
                          ? "يرجى السماح بالوصول إلى الموقع من إعدادات المتصفح"
                          : language === "ur"
                          ? "براہ کرم براؤزر سیٹنگز سے لوکیشن تک رسائی کی اجازت دیں"
                          : language === "hi"
                          ? "कृपया ब्राउज़र सेटिंग्स से लोकेशन एक्सेस की अनुमति दें"
                          : "Please allow location access in your browser settings"
                      );
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                  );
                }
              }}
            >
              <MapPin className="w-5 h-5" />
              {language === "ar" ? "السماح بالوصول إلى الموقع" : language === "ur" ? "لوکیشن تک رسائی کی اجازت دیں" : language === "hi" ? "लोकेशन एक्सेस की अनुमति दें" : "Allow Location Access"}
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                {language === "ar" ? "العودة للرئيسية" : language === "ur" ? "ہوم پیج پر جائیں" : language === "hi" ? "होम पेज पर जाएं" : "Go Home"}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Location Error with Settings Guidance */}
      {!mapLoading && error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6">
          <div className="relative z-10 flex flex-col items-center gap-5 max-w-sm text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center border-2 border-destructive/20">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                {language === "ar" ? "تعذر الوصول للموقع" : language === "ur" ? "لوکیشن تک رسائی مسترد" : language === "hi" ? "लोकेशन एक्सेस अस्वीकृत" : "Location Access Denied"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {error}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === "ar"
                  ? "يرجى السماح بالوصول إلى الموقع من إعدادات المتصفح ثم إعادة المحاولة"
                  : language === "ur"
                  ? "براہ کرم براؤزر سیٹنگز سے لوکیشن تک رسائی کی اجازت دیں اور دوبارہ کوشش کریں"
                  : language === "hi"
                  ? "कृपया ब्राउज़र सेटिंग्स से लोकेशन एक्सेस की अनुमति दें और पुनः प्रयास करें"
                  : "Please allow location access in your browser settings and try again"}
              </p>
            </div>
            <Button
              className="w-full gap-2 h-12"
              onClick={() => {
                refresh();
              }}
            >
              <RefreshCw className="w-4 h-4" />
              {language === "ar" ? "إعادة المحاولة" : language === "ur" ? "دوبارہ کوشش کریں" : language === "hi" ? "पुनः प्रयास करें" : "Try Again"}
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                {language === "ar" ? "العودة للرئيسية" : language === "ur" ? "ہوم پیج پر جائیں" : language === "hi" ? "होम पेज पर जाएं" : "Go Home"}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Geofence Violation Alert Banner */}
      {geofenceStatus.violations > 0 && !geofenceStatus.insideCityZone && (
        <div className="absolute top-16 left-0 right-0 z-10 px-4">
          <div className="bg-destructive/90 backdrop-blur-xl text-destructive-foreground rounded-2xl p-3 flex items-center gap-3 shadow-lg border border-destructive/50 animate-pulse">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">
                {language === "ar" ? "تنبيه: خارج المنطقة الآمنة" : "Alert: Outside Safe Zone"}
              </p>
              <p className="text-xs opacity-90">
                {language === "ar" 
                  ? "أنت خارج حدود المشاعر المقدسة. يرجى العودة إلى المنطقة المحددة."
                  : "You are outside the sacred sites boundary. Please return to the designated area."}
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
          <DialogContent className="max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {language === "ar" ? "خرائط الحج" : "Hajj Maps"}
              </DialogTitle>
            </DialogHeader>
            
            {selectedMapView ? (
              // PDF Viewer Mode
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMapView(null)}
                    className="gap-2"
                  >
                    <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    {language === "ar" ? "رجوع" : "Back"}
                  </Button>
                  <a
                    href={selectedMapView}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    {language === "ar" ? "تحميل" : "Download"}
                  </a>
                </div>
                <div className="flex-1 min-h-[60vh] bg-muted/30 rounded-xl overflow-hidden">
                  <iframe
                    src={selectedMapView}
                    className="w-full h-full border-0"
                    title="Map Viewer"
                  />
                </div>
              </div>
            ) : (
              // Map List Mode
              <div className="space-y-3 mt-4 overflow-y-auto">
                {downloadableMaps.map((mapItem) => (
                  <div
                    key={mapItem.id}
                    className="flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-xl transition-all"
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
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedMapView(mapItem.file)}
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">{language === "ar" ? "عرض" : "View"}</span>
                      </Button>
                      <a
                        href={mapItem.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">{language === "ar" ? "تحميل" : "Download"}</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <div className="mb-4 p-4 bg-card/80 rounded-2xl border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold">{language === "ar" ? "سكون كونكت" : "Sukoon CONNECT"}</p>
                </div>
                <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
                  {otherMembers.length} {language === "ar" ? "أعضاء" : "members"}
                </span>
              </div>
              
              {/* Status Legend */}
              <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-border/30">
                {[
                  { color: "#22c55e", label: language === "ar" ? "طبيعي" : "Normal" },
                  { color: "#ef4444", label: language === "ar" ? "طوارئ" : "Emergency" },
                  { color: "#f59e0b", label: language === "ar" ? "تنبيه" : "Alert" },
                  { color: "#3b82f6", label: language === "ar" ? "مستشفى" : "Hospital" },
                ].map(({ color, label }) => (
                  <div key={color} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Member Cards */}
              <div className="space-y-2">
                {otherMembers.map((loc) => {
                  const statusColor = getStatusColor(loc.pilgrim_status);
                  const statusLabel = getStatusLabel(loc.pilgrim_status);
                  const stageLabel = loc.current_stage 
                    ? (HAJJ_STAGES[loc.current_stage as keyof typeof HAJJ_STAGES]
                        ? (language === "ar" 
                            ? HAJJ_STAGES[loc.current_stage as keyof typeof HAJJ_STAGES].nameAr 
                            : HAJJ_STAGES[loc.current_stage as keyof typeof HAJJ_STAGES].nameEn)
                        : loc.current_stage)
                    : "-";
                  const timeAgo = getTimeSinceUpdate(loc.updated_at);
                  
                  return (
                    <button
                      key={loc.member_id}
                      onClick={() => flyToLocation(loc.longitude, loc.latitude)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-all active:scale-[0.98] min-h-[48px]"
                    >
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0"
                        style={{ borderColor: statusColor, backgroundColor: `${statusColor}15` }}
                      >
                        <Users className="w-4 h-4" style={{ color: statusColor }} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium truncate">{loc.member_name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                            {statusLabel}
                          </span>
                          <span>•</span>
                          <span>{stageLabel}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{timeAgo}</span>
                    </button>
                  );
                })}
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
      <LocationPermissionFlow />
      <LocationReminderBanner />
    </div>
  );
};

export default MapPage;
