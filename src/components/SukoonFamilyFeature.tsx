import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Battery, Heart, MapPin, ShieldCheck, Siren, Users } from "lucide-react";
import { Link } from "react-router-dom";

const copy = {
  en: {
    title: "Sukoon Tracking System – Family Connect",
    description: "Your family can see you are safe — only when you choose to share.",
    ready: "Sharing ready",
    privacy: "Consent required",
    location: "Live location",
    checkIn: "Last check-in",
    family: "Family connected",
    sos: "SOS help",
    share: "Share live location",
    open: "Open Family Connect",
  },
  hi: {
    title: "सुकून ट्रैकिंग सिस्टम – फैमिली कनेक्ट",
    description: "आपकी अनुमति से ही परिवार देख सकता है कि आप सुरक्षित हैं।",
    ready: "शेयरिंग तैयार",
    privacy: "सहमति आवश्यक",
    location: "लाइव लोकेशन",
    checkIn: "अंतिम चेक-इन",
    family: "परिवार से जुड़ें",
    sos: "SOS सहायता",
    share: "लाइव लोकेशन शेयर करें",
    open: "फैमिली कनेक्ट खोलें",
  },
  ur: {
    title: "سکون ٹریکنگ سسٹم – فیملی کنیکٹ",
    description: "آپ کی اجازت سے ہی خاندان دیکھ سکتا ہے کہ آپ محفوظ ہیں۔",
    ready: "شیئرنگ تیار ہے",
    privacy: "رضامندی ضروری",
    location: "لائیو لوکیشن",
    checkIn: "آخری چیک اِن",
    family: "خاندان سے جڑیں",
    sos: "SOS مدد",
    share: "لائیو لوکیشن شیئر کریں",
    open: "فیملی کنیکٹ کھولیں",
  },
};

export default function SukoonFamilyFeature() {
  const { language, isRTL } = useLanguage();
  const t = copy[language as keyof typeof copy] ?? copy.en;

  const statusItems = [
    { icon: MapPin, label: t.location, value: t.ready, tone: "text-primary" },
    { icon: ShieldCheck, label: t.checkIn, value: t.privacy, tone: "text-emerald-700" },
    { icon: Users, label: t.family, value: t.ready, tone: "text-amber-700" },
    { icon: Battery, label: t.sos, value: t.privacy, tone: "text-destructive" },
  ];

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/10 shadow-soft" dir={isRTL ? "rtl" : "ltr"}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Heart className="h-5 w-5 fill-current" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold">{t.title}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> {t.privacy}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {statusItems.map(({ icon: Icon, label, value, tone }) => (
            <div key={label} className="rounded-xl border border-border/60 bg-background/70 p-2.5">
              <Icon className={`mb-1.5 h-4 w-4 ${tone}`} aria-hidden="true" />
              <p className="text-[11px] font-medium leading-tight text-foreground">{label}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button asChild size="sm" className="min-h-11 flex-1">
            <Link to="/sukoon-tracking"><MapPin className="mr-2 h-4 w-4" />{t.share}</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="min-h-11 flex-1">
            <Link to="/sukoon-tracking"><Siren className="mr-2 h-4 w-4" />{t.open}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
