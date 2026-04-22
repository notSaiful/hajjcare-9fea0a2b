import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation, Calendar, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface MashairSite {
  id: string;
  nameEn: string;
  nameAr: string;
  nameHi: string;
  nameUr: string;
  lat: number;
  lng: number;
  color: string;
  hajjDay: string;
  hajjDayEn: string;
  hajjDayHi: string;
  hajjDayUr: string;
  descEn: string;
  descHi: string;
  descUr: string;
  distanceFromMakkahKm: number;
}

const MASHAIR_SITES: MashairSite[] = [
  {
    id: "mina",
    nameEn: "Mina",
    nameAr: "منى",
    nameHi: "मीना",
    nameUr: "منیٰ",
    lat: 21.4133,
    lng: 39.8933,
    color: "#0B3D2E",
    hajjDay: "8, 11–13 Dhul-Hijjah",
    hajjDayEn: "Day 8, 11–13 (Tarwiyah & Tashreeq)",
    hajjDayHi: "दिन 8, 11–13 (तरवियाह और तशरीक़)",
    hajjDayUr: "دن 8، 11–13 (تروییہ اور تشریق)",
    descEn: "Tent city — overnight stay before Arafat and after Muzdalifah for Rami al-Jamarat.",
    descHi: "टेंट शहर — अरफात से पहले और मुज़दलिफा के बाद रमी अल-जमरात के लिए रात्रि विश्राम।",
    descUr: "خیموں کا شہر — عرفات سے پہلے اور مزدلفہ کے بعد رمی الجمرات کے لیے قیام۔",
    distanceFromMakkahKm: 8,
  },
  {
    id: "arafat",
    nameEn: "Arafat",
    nameAr: "عرفات",
    nameHi: "अरफात",
    nameUr: "عرفات",
    lat: 21.3547,
    lng: 39.9842,
    color: "#C9A227",
    hajjDay: "9 Dhul-Hijjah",
    hajjDayEn: "Day 9 (Wuquf — the Standing)",
    hajjDayHi: "दिन 9 (वुक़ूफ़ — ठहराव)",
    hajjDayUr: "دن 9 (وقوف — ٹھہرنا)",
    descEn: "The pillar of Hajj. Stand from Zuhr to sunset in dua. Mount of Mercy (Jabal ar-Rahmah) here.",
    descHi: "हज का मुख्य स्तंभ। ज़ुहर से सूर्यास्त तक दुआ में खड़े रहें। यहाँ रहमत का पहाड़ (जबल अर-रहमह) है।",
    descUr: "حج کا رکن۔ ظہر سے غروب تک دعا میں کھڑے رہیں۔ یہاں جبل الرحمہ ہے۔",
    distanceFromMakkahKm: 22,
  },
  {
    id: "muzdalifah",
    nameEn: "Muzdalifah",
    nameAr: "مزدلفة",
    nameHi: "मुज़दलिफा",
    nameUr: "مزدلفہ",
    lat: 21.3833,
    lng: 39.9367,
    color: "#2F4F4F",
    hajjDay: "Night of 9th → 10th",
    hajjDayEn: "Night between Day 9 & 10",
    hajjDayHi: "दिन 9 और 10 की रात",
    hajjDayUr: "9 اور 10 کی رات",
    descEn: "Open plain for combined Maghrib + Isha and overnight rest. Collect 49–70 pebbles for Jamarat.",
    descHi: "खुला मैदान — मगरिब + इशा एक साथ और रात्रि विश्राम। जमरात के लिए 49–70 कंकड़ इकट्ठा करें।",
    descUr: "کھلا میدان — مغرب اور عشاء جمع کریں اور رات گزاریں۔ جمرات کے لیے 49–70 کنکریاں جمع کریں۔",
    distanceFromMakkahKm: 14,
  },
  {
    id: "jamarat",
    nameEn: "Jamarat",
    nameAr: "الجمرات",
    nameHi: "जमरात",
    nameUr: "جمرات",
    lat: 21.4232,
    lng: 39.8729,
    color: "#800020",
    hajjDay: "10–13 Dhul-Hijjah",
    hajjDayEn: "Day 10–13 (Stoning of the Pillars)",
    hajjDayHi: "दिन 10–13 (शैतान को कंकड़ मारना)",
    hajjDayUr: "دن 10–13 (شیطانوں کو کنکریاں مارنا)",
    descEn: "5-storey bridge with three pillars. Day 10: Jamarah al-Aqaba only. Day 11–13: all three.",
    descHi: "5 मंज़िला पुल, तीन स्तंभ। दिन 10: केवल जमरह अल-अक़बा। दिन 11–13: तीनों।",
    descUr: "5 منزلہ پل، تین ستون۔ دن 10: صرف جمرہ العقبہ۔ دن 11–13: تینوں۔",
    distanceFromMakkahKm: 5,
  },
];

const ROUTE_ORDER = [
  { from: "mina", to: "arafat", labelEn: "Day 8 → 9 morning", labelHi: "दिन 8 → 9 सुबह", labelUr: "دن 8 → 9 صبح" },
  { from: "arafat", to: "muzdalifah", labelEn: "Day 9 sunset", labelHi: "दिन 9 सूर्यास्त", labelUr: "دن 9 غروب" },
  { from: "muzdalifah", to: "jamarat", labelEn: "Day 10 dawn", labelHi: "दिन 10 भोर", labelUr: "دن 10 فجر" },
  { from: "jamarat", to: "mina", labelEn: "Day 10–13 return", labelHi: "दिन 10–13 वापसी", labelUr: "دن 10–13 واپسی" },
];

const MashairMapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { language, isRTL } = useLanguage();
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [activeSite, setActiveSite] = useState<MashairSite>(MASHAIR_SITES[0]);

  const lang = (["hi", "ur", "ar"].includes(language) ? language : "en") as "en" | "hi" | "ur" | "ar";
  const isArabicScript = language === "ar" || language === "ur";

  const getName = (s: MashairSite) =>
    lang === "ar" ? s.nameAr : lang === "ur" ? s.nameUr : lang === "hi" ? s.nameHi : s.nameEn;
  const getDay = (s: MashairSite) =>
    lang === "hi" ? s.hajjDayHi : lang === "ur" || lang === "ar" ? s.hajjDayUr : s.hajjDayEn;
  const getDesc = (s: MashairSite) =>
    lang === "hi" ? s.descHi : lang === "ur" || lang === "ar" ? s.descUr : s.descEn;
  const getRouteLabel = (r: typeof ROUTE_ORDER[number]) =>
    lang === "hi" ? r.labelHi : lang === "ur" || lang === "ar" ? r.labelUr : r.labelEn;

  // Fetch Mapbox token (reuses existing edge function, falls back to public mode if not logged in)
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`,
          { headers }
        );
        if (!response.ok) throw new Error("token unavailable");
        const data = await response.json();
        setMapToken(data.token);
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

    const bounds = new mapboxgl.LngLatBounds();
    MASHAIR_SITES.forEach((s) => bounds.extend([s.lng, s.lat]));

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      bounds,
      fitBoundsOptions: { padding: 60, maxZoom: 13 },
      pitch: 35,
    });

    map.current.on("load", () => {
      setMapLoading(false);
      map.current?.resize();

      // Draw connecting route line
      const coords = ROUTE_ORDER.map((r) => {
        const site = MASHAIR_SITES.find((s) => s.id === r.from)!;
        return [site.lng, site.lat] as [number, number];
      });
      // Close loop back to Mina
      const minaSite = MASHAIR_SITES.find((s) => s.id === "mina")!;
      coords.push([minaSite.lng, minaSite.lat]);

      map.current?.addSource("mashair-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: coords },
        },
      });
      map.current?.addLayer({
        id: "mashair-route-line",
        type: "line",
        source: "mashair-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#C9A227",
          "line-width": 3,
          "line-dasharray": [2, 1.5],
          "line-opacity": 0.85,
        },
      });
    });

    map.current.on("error", (e) => {
      console.error("Mapbox error:", e);
      setMapError("static");
      setMapLoading(false);
    });

    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    // Add site markers
    MASHAIR_SITES.forEach((site) => {
      const el = document.createElement("div");
      el.style.cursor = "pointer";
      el.innerHTML = `
        <div style="
          background: ${site.color};
          color: white;
          padding: 6px 12px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          border: 2px solid white;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <span style="width: 8px; height: 8px; background: white; border-radius: 50%;"></span>
          ${getName(site)}
        </div>
      `;
      el.addEventListener("click", () => {
        setActiveSite(site);
        map.current?.flyTo({ center: [site.lng, site.lat], zoom: 14, duration: 1200 });
      });

      new mapboxgl.Marker({ element: el })
        .setLngLat([site.lng, site.lat])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapToken, lang]);

  const focusSite = (site: MashairSite) => {
    setActiveSite(site);
    if (map.current) {
      map.current.flyTo({ center: [site.lng, site.lat], zoom: 14, duration: 1200 });
    }
  };

  const openInGoogleMaps = (site: MashairSite) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`, "_blank");
  };

  const titles: Record<string, string> = {
    en: "Mashair Map — Hajj 2026",
    hi: "मशा'इर मानचित्र — हज 2026",
    ur: "مشاعر کا نقشہ — حج 2026",
    ar: "خريطة المشاعر — حج 2026",
  };
  const subtitles: Record<string, string> = {
    en: "Mina · Arafat · Muzdalifah · Jamarat — with day-wise flow",
    hi: "मीना · अरफात · मुज़दलिफा · जमरात — दिनवार मार्ग",
    ur: "منیٰ · عرفات · مزدلفہ · جمرات — دن کے حساب سے",
    ar: "منى · عرفات · مزدلفة · الجمرات — حسب الأيام",
  };
  const labelDirections: Record<string, string> = {
    en: "Directions",
    hi: "दिशा-निर्देश",
    ur: "راستہ",
    ar: "الاتجاهات",
  };
  const labelOrder: Record<string, string> = {
    en: "Day-wise Movement Order",
    hi: "दिनवार यात्रा क्रम",
    ur: "دن کے حساب سے سفر",
    ar: "ترتيب التنقل اليومي",
  };
  const labelDistance: Record<string, string> = {
    en: "from Makkah",
    hi: "मक्का से",
    ur: "مکہ سے",
    ar: "من مكة",
  };

  return (
    <div className="min-h-screen bg-background pb-20" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/home">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className={`text-base font-bold leading-tight ${isArabicScript ? "font-arabic" : ""}`}>
              {titles[lang]}
            </h1>
            <p className="text-xs text-muted-foreground truncate">{subtitles[lang]}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Map container */}
        <Card className="overflow-hidden border-border shadow-soft">
          <div className="relative w-full h-72 sm:h-96 bg-muted">
            {mapError === "static" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {lang === "hi"
                    ? "इंटरैक्टिव मानचित्र अभी उपलब्ध नहीं — नीचे दी गई जानकारी का उपयोग करें"
                    : lang === "ur" || lang === "ar"
                    ? "انٹرایکٹو نقشہ دستیاب نہیں — نیچے دی گئی معلومات استعمال کریں"
                    : "Interactive map unavailable — use the info cards below"}
                </p>
              </div>
            ) : (
              <>
                <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
                {mapLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/60 backdrop-blur-sm">
                    <Loader2 className="w-7 h-7 animate-spin text-primary" />
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Site quick-select chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {MASHAIR_SITES.map((site) => {
            const active = activeSite.id === site.id;
            return (
              <button
                key={site.id}
                onClick={() => focusSite(site)}
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-semibold transition-all border-2 ${
                  active
                    ? "text-white shadow-md scale-105"
                    : "bg-card text-foreground hover:bg-muted"
                }`}
                style={{
                  background: active ? site.color : undefined,
                  borderColor: site.color,
                }}
              >
                {getName(site)}
              </button>
            );
          })}
        </div>

        {/* Active site detail card */}
        <Card className="p-4 border-border shadow-soft">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${activeSite.color}20` }}
            >
              <MapPin className="w-6 h-6" style={{ color: activeSite.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`text-lg font-bold ${isArabicScript ? "font-arabic" : ""}`}>
                  {getName(activeSite)}
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  {activeSite.distanceFromMakkahKm} km {labelDistance[lang]}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>{getDay(activeSite)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {getDesc(activeSite)}
              </p>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1.5"
                  onClick={() => openInGoogleMaps(activeSite)}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {labelDirections[lang]}
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Day-wise route order */}
        <Card className="p-4 border-border shadow-soft">
          <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isArabicScript ? "font-arabic" : ""}`}>
            <Calendar className="w-4 h-4 text-primary" />
            {labelOrder[lang]}
          </h3>
          <ol className="space-y-2.5">
            {ROUTE_ORDER.map((r, i) => {
              const fromSite = MASHAIR_SITES.find((s) => s.id === r.from)!;
              const toSite = MASHAIR_SITES.find((s) => s.id === r.to)!;
              return (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                    <span
                      className="px-2 py-0.5 rounded-md text-xs font-semibold text-white"
                      style={{ background: fromSite.color }}
                    >
                      {getName(fromSite)}
                    </span>
                    <span className="text-muted-foreground text-xs">→</span>
                    <span
                      className="px-2 py-0.5 rounded-md text-xs font-semibold text-white"
                      style={{ background: toSite.color }}
                    >
                      {getName(toSite)}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{getRouteLabel(r)}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        {/* All sites list */}
        <div className="space-y-2">
          {MASHAIR_SITES.map((site) => (
            <Card
              key={site.id}
              className="p-3 border-border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => focusSite(site)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-12 rounded-full shrink-0"
                  style={{ background: site.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-semibold text-sm ${isArabicScript ? "font-arabic" : ""}`}>
                      {getName(site)}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      {site.distanceFromMakkahKm} km
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{getDay(site)}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    openInGoogleMaps(site);
                  }}
                >
                  <Navigation className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground text-center pt-2">
          {lang === "hi"
            ? "नोट: GPS निर्देशांक संदर्भ के लिए हैं — तंबू स्थान आपके मक्तब के अनुसार बदल सकता है।"
            : lang === "ur" || lang === "ar"
            ? "نوٹ: GPS مقامات حوالے کے لیے ہیں — خیمے کا مقام آپ کے مکتب کے مطابق مختلف ہو سکتا ہے۔"
            : "Note: GPS coordinates are reference points — your tent location depends on your Maktab assignment."}
        </p>
      </main>
    </div>
  );
};

export default MashairMapPage;
