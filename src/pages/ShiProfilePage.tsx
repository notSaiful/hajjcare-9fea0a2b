import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  User,
  IdCard,
  MapPin,
  Building2,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Users,
  Languages,
  Plane,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HAJ_INSPECTORS, type HajInspector } from "@/data/hajInspectorsData";
import { useCustomInspectors } from "@/hooks/useCustomInspectors";
import { useInspectorOverrides } from "@/hooks/useInspectorOverrides";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DbInspector {
  id: string;
  name: string;
  father_name: string | null;
  state: string;
  cover_number: string | null;
  mobile: string | null;
  whatsapp: string | null;
  duty_location: string;
  language: string;
  gender: string | null;
  result: string | null;
  total_hajis: number | null;
  total_buildings: number | null;
  total_groups: number | null;
  total_doctors: number | null;
  emergency_control_room_no: string | null;
  flight_schedule: string | null;
  live_emergency_cases: number | null;
  live_complaints: number | null;
}

const sanitizePhone = (p: string) => p.replace(/[^\d+]/g, "");

const T: Record<string, Record<string, string>> = {
  en: {
    title: "State Hajj Inspector Profile",
    back: "Back",
    coverNumber: "Cover Number",
    internalId: "ID",
    state: "State",
    dutyLocation: "Duty Location",
    language: "Language",
    contact: "Contact Details",
    indianMobile: "Indian Mobile",
    saudiMobile: "Saudi Mobile",
    whatsapp: "WhatsApp",
    sites: "Assigned Sites",
    makkahBuilding: "Makkah Building",
    madinahBuilding: "Madinah Building",
    operationalStats: "Operational Stats",
    pilgrims: "Pilgrims",
    buildings: "Buildings",
    groups: "Groups",
    doctors: "Doctors",
    emergencies: "Emergencies",
    complaints: "Complaints",
    emergencyRoom: "Emergency Control Room",
    flightSchedule: "Flight Schedule",
    notFound: "Inspector not found",
    notFoundHint: "We could not find an inspector with this cover number.",
    backDirectory: "Back to Directory",
    pending: "No site assigned yet",
    call: "Call",
    copy: "Copy",
  },
  hi: {
    title: "स्टेट हज इंस्पेक्टर प्रोफ़ाइल",
    back: "वापस",
    coverNumber: "कवर नंबर",
    internalId: "आईडी",
    state: "राज्य",
    dutyLocation: "ड्यूटी स्थान",
    language: "भाषा",
    contact: "संपर्क विवरण",
    indianMobile: "भारतीय मोबाइल",
    saudiMobile: "सऊदी मोबाइल",
    whatsapp: "व्हाट्सऐप",
    sites: "नियुक्त स्थल",
    makkahBuilding: "मक्का बिल्डिंग",
    madinahBuilding: "मदीना बिल्डिंग",
    operationalStats: "ऑपरेशनल आँकड़े",
    pilgrims: "हाजी",
    buildings: "बिल्डिंग",
    groups: "ग्रुप",
    doctors: "डॉक्टर",
    emergencies: "आपातकाल",
    complaints: "शिकायतें",
    emergencyRoom: "आपातकालीन कंट्रोल रूम",
    flightSchedule: "फ्लाइट शेड्यूल",
    notFound: "इंस्पेक्टर नहीं मिला",
    notFoundHint: "इस कवर नंबर के साथ कोई इंस्पेक्टर नहीं मिला।",
    backDirectory: "डायरेक्टरी पर वापस",
    pending: "अभी तक कोई स्थल नियुक्त नहीं",
    call: "कॉल",
    copy: "कॉपी",
  },
  ur: {
    title: "اسٹیٹ حج انسپکٹر پروفائل",
    back: "واپس",
    coverNumber: "کور نمبر",
    internalId: "آئی ڈی",
    state: "ریاست",
    dutyLocation: "ڈیوٹی مقام",
    language: "زبان",
    contact: "رابطہ کی تفصیلات",
    indianMobile: "انڈین موبائل",
    saudiMobile: "سعودی موبائل",
    whatsapp: "واٹس ایپ",
    sites: "تفویض کردہ مقامات",
    makkahBuilding: "مکہ بلڈنگ",
    madinahBuilding: "مدینہ بلڈنگ",
    operationalStats: "آپریشنل اعداد و شمار",
    pilgrims: "حجاج",
    buildings: "عمارات",
    groups: "گروپس",
    doctors: "ڈاکٹرز",
    emergencies: "ہنگامی",
    complaints: "شکایات",
    emergencyRoom: "ایمرجنسی کنٹرول روم",
    flightSchedule: "پرواز شیڈول",
    notFound: "انسپکٹر نہیں ملا",
    notFoundHint: "اس کور نمبر کے ساتھ کوئی انسپکٹر نہیں ملا۔",
    backDirectory: "ڈائریکٹری پر واپس",
    pending: "ابھی تک کوئی مقام تفویض نہیں",
    call: "کال",
    copy: "کاپی",
  },
  ar: {
    title: "ملف مفتش الحج",
    back: "رجوع",
    coverNumber: "رقم الغلاف",
    internalId: "المعرّف",
    state: "الولاية",
    dutyLocation: "موقع العمل",
    language: "اللغة",
    contact: "بيانات الاتصال",
    indianMobile: "جوال هندي",
    saudiMobile: "جوال سعودي",
    whatsapp: "واتساب",
    sites: "المواقع المخصصة",
    makkahBuilding: "مبنى مكة",
    madinahBuilding: "مبنى المدينة",
    operationalStats: "إحصائيات تشغيلية",
    pilgrims: "حجاج",
    buildings: "مبانٍ",
    groups: "مجموعات",
    doctors: "أطباء",
    emergencies: "طوارئ",
    complaints: "شكاوى",
    emergencyRoom: "غرفة عمليات الطوارئ",
    flightSchedule: "جدول الرحلات",
    notFound: "المفتش غير موجود",
    notFoundHint: "لم نتمكن من العثور على مفتش بهذا الرقم.",
    backDirectory: "العودة إلى الدليل",
    pending: "لم يتم تعيين موقع بعد",
    call: "اتصال",
    copy: "نسخ",
  },
};

interface UnifiedSHI {
  id: string;
  coverNumber?: string;
  name: string;
  state: string;
  dutyLocation?: string;
  language?: string;
  gender?: string;
  result?: string;
  indianMobile?: string;
  ksaMobile?: string;
  whatsapp?: string;
  makkahBuilding?: string;
  madinahBuilding?: string;
  totalHajis?: number;
  totalBuildings?: number;
  totalGroups?: number;
  totalDoctors?: number;
  liveEmergencies?: number;
  liveComplaints?: number;
  emergencyControlRoom?: string;
  flightSchedule?: string;
  source: "db" | "local" | "custom";
}

const fromDb = (r: DbInspector): UnifiedSHI => ({
  id: r.id,
  coverNumber: r.cover_number ?? undefined,
  name: r.name,
  state: r.state,
  dutyLocation: r.duty_location,
  language: r.language,
  gender: r.gender ?? undefined,
  result: r.result ?? undefined,
  indianMobile: r.mobile ?? undefined,
  whatsapp: r.whatsapp ?? undefined,
  totalHajis: r.total_hajis ?? undefined,
  totalBuildings: r.total_buildings ?? undefined,
  totalGroups: r.total_groups ?? undefined,
  totalDoctors: r.total_doctors ?? undefined,
  liveEmergencies: r.live_emergency_cases ?? undefined,
  liveComplaints: r.live_complaints ?? undefined,
  emergencyControlRoom: r.emergency_control_room_no ?? undefined,
  flightSchedule: r.flight_schedule ?? undefined,
  source: "db",
});

const fromLocal = (i: HajInspector, source: "local" | "custom"): UnifiedSHI => ({
  id: i.id,
  coverNumber: i.coverNumber,
  name: i.name,
  state: i.state,
  gender: i.gender,
  result: i.result,
  indianMobile: i.indianMobile,
  ksaMobile: i.ksaMobile,
  makkahBuilding: i.makkahBuilding,
  madinahBuilding: i.madinahBuilding,
  source,
});

const ShiProfilePage = () => {
  const { coverNumber: rawParam } = useParams<{ coverNumber: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = T[language] || T.en;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const param = decodeURIComponent(rawParam ?? "").trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);

  const { custom } = useCustomInspectors();
  const { applyOverride } = useInspectorOverrides();

  const { data: dbInspector, isLoading } = useQuery({
    queryKey: ["shi-profile", param],
    queryFn: async (): Promise<DbInspector | null> => {
      let q = supabase.from("haj_inspectors").select("*").eq("is_active", true).limit(1);
      q = isUuid ? q.eq("id", param) : q.ilike("cover_number", param);
      const { data, error } = await q.maybeSingle();
      if (error) throw error;
      return data as DbInspector | null;
    },
    enabled: !!param,
  });

  const localMatch = useMemo<UnifiedSHI | null>(() => {
    const all = [...custom, ...HAJ_INSPECTORS];
    const norm = (v?: string) => (v ?? "").toLowerCase().replace(/\s+/g, "");
    const target = norm(param);
    const found = all.find(
      (i) => norm(i.coverNumber) === target || norm(i.id) === target
    );
    if (!found) return null;
    const merged = applyOverride(found);
    return fromLocal(merged, custom.includes(found) ? "custom" : "local");
  }, [param, custom, applyOverride]);

  const inspector: UnifiedSHI | null = dbInspector
    ? fromDb(dbInspector)
    : localMatch;

  const copy = async (value: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast({ title: `${label} ${t.copy.toLowerCase()}`, description: value });
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      toast({ title: "Copy failed" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <div className="container max-w-2xl mx-auto px-4 py-12 text-center text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (!inspector) {
    return (
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <main className="container max-w-2xl mx-auto px-4 py-8 space-y-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> {t.back}
          </Button>
          <Card>
            <CardContent className="p-8 text-center space-y-3">
              <ShieldAlert className="w-10 h-10 text-muted-foreground mx-auto" />
              <h1 className="text-lg font-semibold">{t.notFound}</h1>
              <p className="text-sm text-muted-foreground">{t.notFoundHint}</p>
              <Button asChild variant="default" size="sm" className="mt-2">
                <Link to="/haj-inspectors">{t.backDirectory}</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const phones: Array<{
    key: string;
    label: string;
    value: string;
    flag: string;
  }> = [];
  if (inspector.indianMobile)
    phones.push({ key: "in", label: t.indianMobile, value: inspector.indianMobile, flag: "🇮🇳" });
  if (inspector.ksaMobile)
    phones.push({ key: "ksa", label: t.saudiMobile, value: inspector.ksaMobile, flag: "🇸🇦" });
  if (inspector.whatsapp)
    phones.push({ key: "wa", label: t.whatsapp, value: inspector.whatsapp, flag: "💬" });

  const stats: Array<{ label: string; value: number | string; tone?: string }> = [];
  if (inspector.totalHajis != null) stats.push({ label: t.pilgrims, value: inspector.totalHajis });
  if (inspector.totalBuildings != null) stats.push({ label: t.buildings, value: inspector.totalBuildings });
  if (inspector.totalGroups != null) stats.push({ label: t.groups, value: inspector.totalGroups });
  if (inspector.totalDoctors != null) stats.push({ label: t.doctors, value: inspector.totalDoctors });
  if (inspector.liveEmergencies != null)
    stats.push({ label: t.emergencies, value: inspector.liveEmergencies, tone: "text-red-600" });
  if (inspector.liveComplaints != null)
    stats.push({ label: t.complaints, value: inspector.liveComplaints, tone: "text-amber-600" });

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> {t.back}
        </Button>

        {/* Header card */}
        <Card className="overflow-hidden border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                  {t.title}
                </p>
                <h1 className="text-xl font-bold text-foreground break-words">
                  {inspector.name}
                </h1>
                {inspector.coverNumber && (
                  <div className="flex items-center gap-1.5 text-sm mt-1.5">
                    <IdCard className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{t.coverNumber}:</span>
                    <strong className="text-foreground tracking-wide">
                      {inspector.coverNumber}
                    </strong>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="w-3 h-3" /> {inspector.state}
                  </Badge>
                  {inspector.dutyLocation && (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">
                      {inspector.dutyLocation}
                    </Badge>
                  )}
                  {inspector.gender && (
                    <Badge variant="outline">{inspector.gender}</Badge>
                  )}
                  {inspector.language && (
                    <Badge variant="outline" className="gap-1">
                      <Languages className="w-3 h-3" /> {inspector.language}
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2 break-all">
                  {t.internalId}: {inspector.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned sites */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" /> {t.sites}
            </h2>
            {inspector.makkahBuilding && (
              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md px-3 py-2.5">
                <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    🕋 {t.makkahBuilding}
                  </div>
                  <div className="text-sm font-medium text-foreground break-words">
                    {inspector.makkahBuilding}
                  </div>
                </div>
              </div>
            )}
            {inspector.madinahBuilding && (
              <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-md px-3 py-2.5">
                <Building2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                    🕌 {t.madinahBuilding}
                  </div>
                  <div className="text-sm font-medium text-foreground break-words">
                    {inspector.madinahBuilding}
                  </div>
                </div>
              </div>
            )}
            {!inspector.makkahBuilding && !inspector.madinahBuilding && (
              <p className="text-xs text-muted-foreground italic">{t.pending}</p>
            )}
          </CardContent>
        </Card>

        {/* Contact */}
        {phones.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-2.5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-primary" /> {t.contact}
              </h2>
              {phones.map((p) => (
                <div
                  key={p.key}
                  className="flex items-center justify-between gap-2 bg-muted/40 rounded-md px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] text-muted-foreground">
                      {p.flag} {p.label}
                    </div>
                    <div className="text-sm font-medium truncate">{p.value}</div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9"
                      onClick={() => copy(p.value, `${p.key}-${inspector.id}`, p.label)}
                      aria-label={t.copy}
                    >
                      {copiedKey === `${p.key}-${inspector.id}` ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button asChild size="icon" variant="outline" className="h-9 w-9">
                      <a href={`tel:${sanitizePhone(p.value)}`} aria-label={t.call}>
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 border-emerald-300 dark:border-emerald-700"
                    >
                      <a
                        href={`https://wa.me/${sanitizePhone(p.value).replace(/^\+/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Operational stats */}
        {stats.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" /> {t.operationalStats}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-muted/50 rounded-lg p-2.5 text-center"
                  >
                    <div className={cn("text-xl font-bold", s.tone ?? "text-primary")}>
                      {s.value}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              {(inspector.flightSchedule || inspector.emergencyControlRoom) && (
                <div className="space-y-2 pt-2 border-t">
                  {inspector.flightSchedule && (
                    <div className="flex items-start gap-2 text-sm">
                      <Plane className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          {t.flightSchedule}
                        </div>
                        <div className="font-medium">{inspector.flightSchedule}</div>
                      </div>
                    </div>
                  )}
                  {inspector.emergencyControlRoom && (
                    <div className="flex items-start gap-2 text-sm">
                      <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-muted-foreground">
                          {t.emergencyRoom}
                        </div>
                        <div className="font-medium">
                          {inspector.emergencyControlRoom}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ShiProfilePage;
