import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleHeader } from "@/components/SimpleHeader";
import MadinahHotelsMap from "@/components/MadinahHotelsMap";
import { madinahHotels, getMadinahMapUrl } from "@/data/madinahHotels";
import { getHotelLocation, formatDistance } from "@/data/madinahHotelCoords";
import { Hotel, Search, ExternalLink, MapPin, Footprints, AlertCircle, ArrowUpDown, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type SortMode = "code" | "distance" | "name";

const MadinahHotelsPage = () => {
  const { language, isRTL } = useLanguage();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("code");
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  const lang = (["hi", "ur", "ar"].includes(language) ? language : "en") as "en" | "hi" | "ur" | "ar";

  const labels = {
    en: {
      title: "Madinah Hotels — Hajj 2026",
      subtitle: "381 official MOH/CGI Jeddah hotels in Markaziya",
      search: "Search by name, code, or Tashee...",
      sortCode: "Code",
      sortDistance: "Distance",
      sortName: "Name",
      verified: "Verified only",
      results: "results",
      noResults: "No hotels found",
      noResultsHint: "Try a different name, code, or Tashee number.",
      from: "from Haram",
      walk: "min walk",
      tashee: "Tashee",
      back: "Back",
      mapTitle: "Live Map",
      mapHint: "Tap any marker to see hotel details and open in Google Maps.",
      sourceNote: "Source: Official MOH/CGI Jeddah list. Some marker positions are approximate within Markaziya.",
    },
    hi: {
      title: "मदीना होटल — हज 2026",
      subtitle: "मरकज़िया में 381 आधिकारिक MOH/CGI जेद्दा होटल",
      search: "नाम, कोड, या तशी से खोजें...",
      sortCode: "कोड",
      sortDistance: "दूरी",
      sortName: "नाम",
      verified: "केवल सत्यापित",
      results: "परिणाम",
      noResults: "कोई होटल नहीं मिला",
      noResultsHint: "कोई दूसरा नाम, कोड, या तशी आज़माएं।",
      from: "हरम से",
      walk: "मिनट पैदल",
      tashee: "तशी",
      back: "वापस",
      mapTitle: "लाइव मानचित्र",
      mapHint: "किसी भी मार्कर पर टैप करें — विवरण और Google Maps खुलेगा।",
      sourceNote: "स्रोत: आधिकारिक MOH/CGI जेद्दा सूची। कुछ मार्कर मरकज़िया में अनुमानित हैं।",
    },
    ur: {
      title: "مدینہ ہوٹل — حج 2026",
      subtitle: "مرکزیہ میں 381 آفیشل MOH/CGI جدہ ہوٹل",
      search: "نام، کوڈ، یا تشی سے تلاش کریں...",
      sortCode: "کوڈ",
      sortDistance: "فاصلہ",
      sortName: "نام",
      verified: "صرف تصدیق شدہ",
      results: "نتائج",
      noResults: "کوئی ہوٹل نہیں ملا",
      noResultsHint: "کوئی دوسرا نام، کوڈ یا تشی نمبر آزمائیں۔",
      from: "حرم سے",
      walk: "منٹ پیدل",
      tashee: "تشی",
      back: "واپس",
      mapTitle: "لائیو نقشہ",
      mapHint: "کسی بھی مارکر پر ٹیپ کریں — تفصیلات اور Google Maps کھلے گا۔",
      sourceNote: "ماخذ: آفیشل MOH/CGI جدہ فہرست۔ کچھ مارکر مرکزیہ کے اندر تخمینی ہیں۔",
    },
    ar: {
      title: "فنادق المدينة — حج 2026",
      subtitle: "381 فندقًا رسميًا من قائمة MOH/CGI جدة في مركزية المدينة",
      search: "ابحث بالاسم أو الرقم أو التشي...",
      sortCode: "الرقم",
      sortDistance: "المسافة",
      sortName: "الاسم",
      verified: "المؤكدة فقط",
      results: "نتيجة",
      noResults: "لم يتم العثور على فنادق",
      noResultsHint: "جرّب اسمًا أو رقمًا أو تشي مختلفًا.",
      from: "من الحرم",
      walk: "دقيقة سيرًا",
      tashee: "تشي",
      back: "رجوع",
      mapTitle: "الخريطة الحية",
      mapHint: "اضغط على أي علامة لرؤية تفاصيل الفندق وفتحه في خرائط جوجل.",
      sourceNote: "المصدر: قائمة MOH/CGI جدة الرسمية. بعض المواقع تقريبية ضمن المركزية.",
    },
  } as const;

  const t = labels[lang];

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = madinahHotels.filter((h) => {
      if (showOnlyVerified && !h.mapLink) return false;
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        String(h.code) === q ||
        String(h.code).includes(q) ||
        h.madTashee.includes(q)
      );
    });

    if (sort === "distance") {
      list = [...list].sort(
        (a, b) => getHotelLocation(a).distanceFromHaramKm - getHotelLocation(b).distanceFromHaramKm
      );
    } else if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort((a, b) => a.code - b.code);
    }
    return list;
  }, [search, sort, showOnlyVerified]);

  return (
    <div className="min-h-screen bg-background pb-16" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />
      <main className="container max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Header */}
        <div>
          <Link to="/hajj-buildings" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
            {t.back}
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Hotel className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">{t.title}</h1>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Live Map */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {t.mapTitle}
          </h2>
          <MadinahHotelsMap hotels={filtered} heightClass="h-72 sm:h-96" />
          <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            {t.mapHint}
          </p>
        </section>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl h-11"
          />
        </div>

        {/* Sort + filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            Sort:
          </span>
          {(["code", "distance", "name"] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={sort === mode ? "default" : "outline"}
              className="h-7 text-[11px] rounded-full px-3"
              onClick={() => setSort(mode)}
            >
              {mode === "code" ? t.sortCode : mode === "distance" ? t.sortDistance : t.sortName}
            </Button>
          ))}
          <Button
            size="sm"
            variant={showOnlyVerified ? "default" : "outline"}
            className="h-7 text-[11px] rounded-full px-3"
            onClick={() => setShowOnlyVerified((v) => !v)}
          >
            ✓ {t.verified}
          </Button>
          <Badge variant="secondary" className="ml-auto text-[10px]">
            {filtered.length} {t.results}
          </Badge>
        </div>

        {/* List */}
        <div className="grid gap-2">
          {filtered.map((hotel) => {
            const loc = getHotelLocation(hotel);
            const verified = !!hotel.mapLink;
            return (
              <a
                key={hotel.id}
                href={getMadinahMapUrl(hotel)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-emerald-500/50 hover:shadow-sm transition-all active:scale-[0.99]"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-700">#{hotel.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight truncate">{hotel.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {t.tashee}: {hotel.madTashee} · {hotel.type}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] text-foreground/80">
                      <MapPin className="w-2.5 h-2.5" />
                      {formatDistance(loc.distanceFromHaramKm)} {t.from}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-foreground/80">
                      <Footprints className="w-2.5 h-2.5" />
                      ~{loc.walkMinutes} {t.walk}
                    </span>
                    {!verified && (
                      <span className="text-[10px] opacity-60">· approx.</span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </a>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium">{t.noResults}</p>
              <p className="text-xs mt-1">{t.noResultsHint}</p>
            </div>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground text-center pt-2 border-t border-border/50">
          {t.sourceNote}
        </p>
      </main>
    </div>
  );
};

export default MadinahHotelsPage;
