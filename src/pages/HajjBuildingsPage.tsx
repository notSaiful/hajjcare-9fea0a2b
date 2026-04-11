import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleHeader } from "@/components/SimpleHeader";
import { hajjBuildings, emergencyContacts, type HajjBuilding } from "@/data/hajjBuildingsData";
import { Building, MapPin, Phone, Search, Stethoscope, Home, Landmark, ChevronRight } from "lucide-react";
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

  const lang = (language === "hi" || language === "ur" || language === "ar") ? language : "en";

  const labels = {
    en: { title: "Indian Hajj Buildings", subtitle: "Makkah & Madinah 2026", makkah: "Makkah", madinah: "Madinah", all: "All", search: "Search buildings...", emergency: "Emergency Contacts", office: "Main Office", medical: "Medical", emb: "Indian Embassy" },
    hi: { title: "भारतीय हज भवन", subtitle: "मक्का और मदीना 2026", makkah: "मक्का", madinah: "मदीना", all: "सभी", search: "भवन खोजें...", emergency: "आपातकालीन संपर्क", office: "मुख्य कार्यालय", medical: "चिकित्सा", emb: "भारतीय दूतावास" },
    ur: { title: "انڈین حج عمارات", subtitle: "مکہ اور مدینہ 2026", makkah: "مکہ", madinah: "مدینہ", all: "سب", search: "عمارات تلاش کریں...", emergency: "ایمرجنسی رابطے", office: "مرکزی آفس", medical: "طبی", emb: "انڈین ایمبیسی" },
    ar: { title: "مباني الحج الهندية", subtitle: "مكة والمدينة 2026", makkah: "مكة", madinah: "المدينة", all: "الكل", search: "ابحث عن المباني...", emergency: "جهات الاتصال الطارئة", office: "المكتب الرئيسي", medical: "طبي", emb: "السفارة الهندية" },
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  const filtered = hajjBuildings.filter((b) => {
    const matchCity = cityFilter === "all" || b.city === cityFilter;
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.area.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  const makkahBuildings = filtered.filter((b) => b.city === "makkah");
  const madinahBuildings = filtered.filter((b) => b.city === "madinah");

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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>

        {/* City Filter */}
        <div className="flex gap-2">
          {(["all", "makkah", "madinah"] as const).map((c) => (
            <Button
              key={c}
              variant={cityFilter === c ? "default" : "outline"}
              size="sm"
              className="rounded-xl text-xs flex-1"
              onClick={() => setCityFilter(c)}
            >
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

        {/* Emergency Contacts */}
        <section className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-destructive flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {t.emergency}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Makkah */}
            <div className="space-y-2">
              <p className="text-xs font-medium">🕋 {t.makkah}</p>
              <a href={`tel:${emergencyContacts.makkah.mainOffice}`} className="block text-xs text-primary">{t.office}: {emergencyContacts.makkah.mainOffice}</a>
              <a href={`tel:${emergencyContacts.makkah.medical}`} className="block text-xs text-primary">{t.medical}: {emergencyContacts.makkah.medical}</a>
            </div>
            {/* Madinah */}
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
