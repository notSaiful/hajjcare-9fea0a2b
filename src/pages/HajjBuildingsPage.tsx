import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleHeader } from "@/components/SimpleHeader";
import { hajjBuildings, emergencyContacts, type HajjBuilding } from "@/data/hajjBuildingsData";
import { makkahBuildingZones, findZoneByBuildingNumber, type BuildingZone } from "@/data/hajjBuildingZones";
import { findBusPointsForBuilding, type BusPointMatch } from "@/data/hajjBusPoints";
import { madinahHotels, getMadinahMapUrl } from "@/data/madinahHotels";
import { getHotelLocation, formatDistance } from "@/data/madinahHotelCoords";
import { Building, Bus, MapPin, Phone, Search, Stethoscope, Home, Landmark, Hash, Navigation, AlertCircle, ExternalLink, Hotel, Footprints, ArrowRight, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const typeConfig = {
  office: { icon: Landmark, color: "bg-primary/10 text-primary", label: { en: "Office", hi: "कार्यालय", ur: "آفس", ar: "مكتب" } },
  dispensary: { icon: Stethoscope, color: "bg-emerald-500/10 text-emerald-600", label: { en: "Dispensary", hi: "डिस्पेंसरी", ur: "ڈسپنسری", ar: "مستوصف" } },
  accommodation: { icon: Home, color: "bg-amber-500/10 text-amber-600", label: { en: "Accommodation", hi: "आवास", ur: "رہائش", ar: "سكن" } },
  hospital: { icon: Stethoscope, color: "bg-red-500/10 text-red-600", label: { en: "Hospital", hi: "अस्पताल", ur: "ہسپتال", ar: "مستشفى" } },
};

const HajjBuildingsPage = () => {
  const { language, isRTL } = useLanguage();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<"all" | "makkah" | "madinah">("all");
  const [buildingNumber, setBuildingNumber] = useState("");
  const [foundZone, setFoundZone] = useState<BuildingZone | null>(null);
  const [searchedNumber, setSearchedNumber] = useState<number | null>(null);
  const [hotelSearch, setHotelSearch] = useState("");

  const lang = (language === "hi" || language === "ur" || language === "ar") ? language : "en";

  const labels = {
    en: {
      title: "Indian Hajj Buildings", subtitle: "Makkah & Madinah 2026", makkah: "Makkah", madinah: "Madinah", all: "All",
      search: "Search buildings...", emergency: "Emergency Contacts", office: "Main Office", medical: "Medical", emb: "Indian Embassy",
      findBuilding: "Find Your Building", enterNumber: "Enter building number (101-1880)",
      findBtn: "Find Location", yourBuilding: "Your Building", zone: "Zone", area: "Area",
      buildingRange: "Building Range", notFound: "Building number not found. Please enter a number between 101-1880.",
      allZones: "All Makkah Building Zones", zoneNote: "Building numbers 101-1880 are Zone IDs, not actual building count.",
      navigate: "Navigate", openMap: "Open in Google Maps",
      madinahHotels: "Madinah Hotels 2026", searchHotel: "Search by name, code, or Tashee...", hotelsCount: "hotels", locUnavailable: "Location unavailable",
      hotelsSource: "Source: Official MOH/CGI Jeddah list — 381 hotels in Madinah Markaziya",
    },
    hi: {
      title: "भारतीय हज भवन", subtitle: "मक्का और मदीना 2026", makkah: "मक्का", madinah: "मदीना", all: "सभी",
      search: "भवन खोजें...", emergency: "आपातकालीन संपर्क", office: "मुख्य कार्यालय", medical: "चिकित्सा", emb: "भारतीय दूतावास",
      findBuilding: "अपनी बिल्डिंग खोजें", enterNumber: "बिल्डिंग नंबर डालें (101-1880)",
      findBtn: "लोकेशन खोजें", yourBuilding: "आपकी बिल्डिंग", zone: "ज़ोन", area: "इलाका",
      buildingRange: "बिल्डिंग रेंज", notFound: "बिल्डिंग नंबर नहीं मिला। कृपया 101-1880 के बीच नंबर डालें।",
      allZones: "मक्का के सभी बिल्डिंग ज़ोन", zoneNote: "बिल्डिंग नंबर 101-1880 सिर्फ ज़ोन पहचान के लिए हैं, बिल्डिंग की तादाद नहीं।",
      navigate: "नेविगेट करें", openMap: "गूगल मैप में खोलें",
      madinahHotels: "मदीना होटल 2026", searchHotel: "नाम, कोड, या तशी से खोजें...", hotelsCount: "होटल", locUnavailable: "लोकेशन उपलब्ध नहीं",
      hotelsSource: "स्रोत: आधिकारिक MOH/CGI जेद्दा सूची — मदीना मरकज़िया में 381 होटल",
    },
    ur: {
      title: "انڈین حج عمارات", subtitle: "مکہ اور مدینہ 2026", makkah: "مکہ", madinah: "مدینہ", all: "سب",
      search: "عمارات تلاش کریں...", emergency: "ایمرجنسی رابطے", office: "مرکزی آفس", medical: "طبی", emb: "انڈین ایمبیسی",
      findBuilding: "اپنی بلڈنگ تلاش کریں", enterNumber: "بلڈنگ نمبر درج کریں (101-1880)",
      findBtn: "لوکیشن تلاش کریں", yourBuilding: "آپکی بلڈنگ", zone: "زون", area: "علاقہ",
      buildingRange: "بلڈنگ رینج", notFound: "بلڈنگ نمبر نہیں ملا۔ براہ کرم 101-1880 کے درمیان نمبر درج کریں۔",
      allZones: "مکہ کے تمام بلڈنگ زون", zoneNote: "بلڈنگ نمبر 101-1880 صرف زون کی پہچان کے لیے ہیں، عمارتوں کی تعداد نہیں۔",
      navigate: "نیویگیٹ", openMap: "گوگل میپ میں کھولیں",
      madinahHotels: "مدینہ ہوٹل 2026", searchHotel: "نام، کوڈ، یا تشی سے تلاش کریں...", hotelsCount: "ہوٹل", locUnavailable: "لوکیشن دستیاب نہیں",
      hotelsSource: "ماخذ: آفیشل MOH/CGI جدہ فہرست — مدینہ مرکزیہ میں 381 ہوٹل",
    },
    ar: {
      title: "مباني الحج الهندية", subtitle: "مكة والمدينة 2026", makkah: "مكة", madinah: "المدينة", all: "الكل",
      search: "ابحث عن المباني...", emergency: "جهات الاتصال الطارئة", office: "المكتب الرئيسي", medical: "طبي", emb: "السفارة الهندية",
      findBuilding: "ابحث عن مبناك", enterNumber: "أدخل رقم المبنى (101-1880)",
      findBtn: "ابحث عن الموقع", yourBuilding: "مبناك", zone: "المنطقة", area: "الحي",
      buildingRange: "نطاق المباني", notFound: "رقم المبنى غير موجود. الرجاء إدخال رقم بين 101-1880.",
      allZones: "جميع مناطق مباني مكة", zoneNote: "أرقام المباني 101-1880 هي أرقام تعريف المنطقة فقط.",
      navigate: "انتقال", openMap: "افتح في خرائط جوجل",
      madinahHotels: "فنادق المدينة 2026", searchHotel: "ابحث بالاسم أو الرقم أو التشي...", hotelsCount: "فنادق", locUnavailable: "الموقع غير متوفر",
      hotelsSource: "المصدر: قائمة MOH/CGI جدة الرسمية — 381 فندقًا في مركزية المدينة",
    },
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  const openNavigationToZone = (zone: BuildingZone) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${zone.lat},${zone.lng}&travelmode=walking`;
    window.open(url, "_blank");
  };

  const handleFindBuilding = () => {
    const num = parseInt(buildingNumber, 10);
    if (isNaN(num)) { setFoundZone(null); setSearchedNumber(null); return; }
    setSearchedNumber(num);
    setFoundZone(findZoneByBuildingNumber(num));
  };

  const filtered = hajjBuildings.filter((b) => {
    const matchCity = cityFilter === "all" || b.city === cityFilter;
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.area.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  const makkahBuildings = filtered.filter((b) => b.city === "makkah");
  const madinahBuildings = filtered.filter((b) => b.city === "madinah");

  const filteredHotels = madinahHotels.filter((h) => {
    if (!hotelSearch) return true;
    const q = hotelSearch.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      String(h.code) === q ||
      h.madTashee.includes(q)
    );
  });

  const getZoneName = (z: BuildingZone) => lang === "hi" ? z.zoneNameHi : lang === "ur" ? z.zoneNameUr : z.zoneName;
  const getAreaName = (z: BuildingZone) => lang === "hi" ? z.areaHi : z.area;

  const BuildingCard = ({ building }: { building: HajjBuilding }) => {
    const cfg = typeConfig[building.type];
    const Icon = cfg.icon;
    const typeLbl = cfg.label[lang as keyof typeof cfg.label] || cfg.label.en;
    const desc = building.description[lang] || building.description.en;
    return (
      <div className="bg-card rounded-xl border border-border p-4 space-y-2 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight">{lang === "ur" ? building.nameUr : lang === "ar" ? building.nameAr : building.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              {lang === "ar" ? building.areaAr : building.area}
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px] flex-shrink-0">{typeLbl}</Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        {building.phone && (
          <a href={`tel:${building.phone}`} className="flex items-center gap-2 text-xs text-primary font-medium mt-1">
            <Phone className="w-3.5 h-3.5" />
            {building.phone}
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />
      <main className="container max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
            <Building className="w-3.5 h-3.5" />
            Hajj 2026
          </div>
          <h1 className="text-xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* ===== BUILDING NUMBER FINDER ===== */}
        <section className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-4 space-y-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Hash className="w-4 h-4 text-primary" />
            </div>
            {t.findBuilding}
          </h2>
          <div className="flex gap-2">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={t.enterNumber}
              value={buildingNumber}
              onChange={(e) => setBuildingNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFindBuilding()}
              className="rounded-xl flex-1"
              min={101}
              max={1880}
            />
            <Button onClick={handleFindBuilding} className="rounded-xl px-4" size="default">
              <Navigation className="w-4 h-4 mr-1" />
              {t.findBtn}
            </Button>
          </div>

          {/* Result */}
          {searchedNumber !== null && foundZone && (
            <div className="bg-background border border-primary/30 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${foundZone.color}`} />
                <span className="font-bold text-lg text-primary">#{searchedNumber}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">{t.zone}</p>
                  <p className="font-semibold">{getZoneName(foundZone)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t.area}</p>
                  <p className="font-semibold">{getAreaName(foundZone)}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {t.buildingRange}: {foundZone.buildingStart} – {foundZone.buildingEnd}
              </div>
              <Button
                onClick={() => openNavigationToZone(foundZone)}
                className="w-full rounded-xl gap-2"
                size="lg"
              >
                <Navigation className="w-4 h-4" />
                {t.navigate}
                <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
              </Button>
            </div>
          )}

          {searchedNumber !== null && !foundZone && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive">{t.notFound}</p>
            </div>
          )}
        </section>

        {/* ===== ALL ZONES LIST ===== */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {t.allZones}
          </h2>
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            {t.zoneNote}
          </p>
          <div className="grid gap-2">
            {makkahBuildingZones.map((z) => (
              <div
                key={z.id}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:shadow-sm transition-shadow w-full"
              >
                <button
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  onClick={() => {
                    setBuildingNumber(String(z.buildingStart));
                    setSearchedNumber(z.buildingStart);
                    setFoundZone(z);
                  }}
                >
                  <div className={`w-3 h-8 rounded-full ${z.color} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight">{getZoneName(z)}</p>
                    <p className="text-xs text-muted-foreground">{getAreaName(z)}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono flex-shrink-0">
                    {z.buildingStart}–{z.buildingEnd}
                  </Badge>
                </button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 rounded-lg"
                  onClick={() => openNavigationToZone(z)}
                  title={t.openMap}
                >
                  <Navigation className="w-3.5 h-3.5 text-primary" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Search & Filter for offices/dispensaries */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <div className="flex gap-2">
          {(["all", "makkah", "madinah"] as const).map((c) => (
            <Button key={c} variant={cityFilter === c ? "default" : "outline"} size="sm" className="rounded-xl text-xs flex-1" onClick={() => setCityFilter(c)}>
              {c === "all" ? t.all : c === "makkah" ? t.makkah : t.madinah}
            </Button>
          ))}
        </div>

        {/* Makkah Buildings */}
        {makkahBuildings.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              🕋 {t.makkah} ({makkahBuildings.length})
            </h2>
            <div className="space-y-3">
              {makkahBuildings.map((b) => <BuildingCard key={b.id} building={b} />)}
            </div>
          </section>
        )}

        {/* Madinah Buildings */}
        {madinahBuildings.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              🕌 {t.madinah} ({madinahBuildings.length})
            </h2>
            <div className="space-y-3">
              {madinahBuildings.map((b) => <BuildingCard key={b.id} building={b} />)}
            </div>
          </section>
        )}

        {/* ===== MADINAH HOTELS DIRECTORY (Hajj 2026) ===== */}
        <section className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Hotel className="w-4 h-4 text-emerald-600" />
              </div>
              🕌 {t.madinahHotels}
            </h2>
            <Badge variant="secondary" className="text-[10px]">
              {madinahHotels.length} {t.hotelsCount}
            </Badge>
          </div>

          {/* Link to dedicated full page */}
          <Link
            to="/madinah-hotels"
            className="flex items-center justify-between gap-2 bg-card border border-emerald-500/30 rounded-xl p-3 hover:border-emerald-500 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold">
                {lang === "hi"
                  ? "लाइव मानचित्र पर सभी होटल देखें"
                  : lang === "ur"
                  ? "تمام ہوٹلز کو لائیو نقشے پر دیکھیں"
                  : lang === "ar"
                  ? "عرض جميع الفنادق على الخريطة الحية"
                  : "View all hotels on the live map"}
              </span>
            </div>
            <ArrowRight className={`w-4 h-4 text-emerald-600 ${isRTL ? "rotate-180" : ""}`} />
          </Link>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t.searchHotel}
              value={hotelSearch}
              onChange={(e) => setHotelSearch(e.target.value)}
              className="pl-9 rounded-xl h-10"
            />
          </div>
          <div className="grid gap-1.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredHotels.map((hotel) => {
              const url = getMadinahMapUrl(hotel);
              const verified = !!hotel.mapLink;
              const loc = getHotelLocation(hotel);
              return (
                <a
                  key={hotel.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-card border border-border rounded-lg p-2.5 hover:border-emerald-500/50 hover:shadow-sm transition-all active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-emerald-700">#{hotel.code}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs leading-tight truncate">{hotel.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Tashee: {hotel.madTashee} · {hotel.type}
                      {!verified && <span className="ml-1 opacity-60">· Search</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-foreground/75">
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {formatDistance(loc.distanceFromHaramKm)}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Footprints className="w-2.5 h-2.5" />
                        ~{loc.walkMinutes}m
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                </a>
              );
            })}
            {filteredHotels.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-6">
                <AlertCircle className="w-4 h-4 mx-auto mb-1 opacity-60" />
                No hotels found
              </div>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground text-center pt-1 border-t border-border/50">
            {t.hotelsSource}
          </p>
        </section>

        {/* Emergency Contacts */}
        <section className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-destructive flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {t.emergency}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <p className="text-xs font-medium">🕋 {t.makkah}</p>
              <a href={`tel:${emergencyContacts.makkah.mainOffice}`} className="block text-xs text-primary">{t.office}: {emergencyContacts.makkah.mainOffice}</a>
              <a href={`tel:${emergencyContacts.makkah.medical}`} className="block text-xs text-primary">{t.medical}: {emergencyContacts.makkah.medical}</a>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium">🕌 {t.madinah}</p>
              <a href={`tel:${emergencyContacts.madinah.mainOffice}`} className="block text-xs text-primary">{t.office}: {emergencyContacts.madinah.mainOffice}</a>
              <a href={`tel:${emergencyContacts.madinah.medical}`} className="block text-xs text-primary">{t.medical}: {emergencyContacts.madinah.medical}</a>
            </div>
          </div>
          <div className="pt-2 border-t border-destructive/10">
            <a href={`tel:${emergencyContacts.makkah.indianEmbassy}`} className="text-xs text-primary font-medium">
              🇮🇳 {t.emb}: {emergencyContacts.makkah.indianEmbassy}
            </a>
            <p className="text-xs text-muted-foreground mt-1">Emergency (Saudi): 911</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HajjBuildingsPage;
