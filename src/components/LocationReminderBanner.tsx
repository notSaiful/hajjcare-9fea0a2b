import { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: { msg: "Location is off. Enable it for live tracking & safety.", btn: "Enable" },
  ar: { msg: "الموقع معطل. فعّله للتتبع المباشر والسلامة.", btn: "تفعيل" },
  ur: { msg: "لوکیشن بند ہے۔ لائیو ٹریکنگ اور حفاظت کے لیے فعال کریں۔", btn: "فعال کریں" },
  hi: { msg: "लोकेशन बंद है। लाइव ट्रैकिंग और सुरक्षा के लिए सक्षम करें।", btn: "सक्षम करें" },
};

type LangKey = keyof typeof labels;

export function LocationReminderBanner() {
  const { language, isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const t = labels[(language in labels ? language : "en") as LangKey];

  useEffect(() => {
    // Show banner only if permission is not granted
    if (!("permissions" in navigator)) return;
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state !== "granted") setVisible(true);
      result.addEventListener("change", () => {
        if (result.state === "granted") setVisible(false);
      });
    }).catch(() => {});
  }, []);

  if (!visible || dismissed) return null;

  const requestLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      () => setVisible(false),
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-fade-up"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-md px-4 py-3 shadow-lg">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-4.5 h-4.5 text-primary" />
        </div>
        <p className="flex-1 text-sm text-foreground leading-snug">{t.msg}</p>
        <Button size="sm" onClick={requestLocation} className="rounded-xl text-xs h-8 px-3">
          {t.btn}
        </Button>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-muted/80 text-muted-foreground"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
