import { useState, useEffect } from "react";
import { MapPin, X, Settings, Smartphone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const LOCATION_OK_STORAGE_KEY = "hajj_location_ok_at";
const LOCATION_UPDATED_EVENT = "hajj-location-updated";
const RECENT_LOCATION_WINDOW_MS = 10 * 60 * 1000;

const labels = {
  en: {
    msg: "Location is off. Enable it for live tracking & safety.",
    btn: "Enable",
    title: "Allow Location Access",
    intro: "Location is blocked by your browser. Follow the steps below to enable it in settings.",
    iosTitle: "iPhone (Safari / Chrome)",
    ios: [
      "Open Settings → Safari → Location",
      "Choose 'Ask' or 'Allow'",
      "Or: Settings → Privacy → Location Services → enable for the browser",
      "Return to this app and tap Enable again",
    ],
    androidTitle: "Android (Chrome)",
    android: [
      "Tap the lock icon next to the URL",
      "Tap Permissions → Location → Allow",
      "Or: Settings → Apps → Chrome → Permissions → Location",
      "Reload this page and tap Enable",
    ],
    desktopTitle: "Desktop browser",
    desktop: [
      "Click the lock icon in the address bar",
      "Set Location to 'Allow'",
      "Reload the page",
    ],
    close: "Got it",
  },
  ar: {
    msg: "الموقع معطل. فعّله للتتبع المباشر والسلامة.",
    btn: "تفعيل",
    title: "السماح بالوصول إلى الموقع",
    intro: "تم حظر الموقع بواسطة متصفحك. اتبع الخطوات التالية لتفعيله في الإعدادات.",
    iosTitle: "آيفون (Safari / Chrome)",
    ios: [
      "افتح الإعدادات → Safari → الموقع",
      "اختر 'السؤال' أو 'السماح'",
      "أو: الإعدادات → الخصوصية → خدمات الموقع → فعّل للمتصفح",
      "ارجع للتطبيق واضغط تفعيل مرة أخرى",
    ],
    androidTitle: "أندرويد (Chrome)",
    android: [
      "اضغط على رمز القفل بجانب الرابط",
      "اضغط الأذونات → الموقع → السماح",
      "أو: الإعدادات → التطبيقات → Chrome → الأذونات → الموقع",
      "أعد تحميل الصفحة واضغط تفعيل",
    ],
    desktopTitle: "متصفح الكمبيوتر",
    desktop: [
      "اضغط على رمز القفل في شريط العنوان",
      "اضبط الموقع على 'السماح'",
      "أعد تحميل الصفحة",
    ],
    close: "حسناً",
  },
  ur: {
    msg: "لوکیشن بند ہے۔ لائیو ٹریکنگ اور حفاظت کے لیے فعال کریں۔",
    btn: "فعال کریں",
    title: "لوکیشن کی اجازت دیں",
    intro: "آپ کے براؤزر نے لوکیشن بلاک کر دی ہے۔ سیٹنگز میں فعال کرنے کے لیے درج ذیل اقدامات پر عمل کریں۔",
    iosTitle: "آئی فون (Safari / Chrome)",
    ios: [
      "Settings → Safari → Location کھولیں",
      "'Ask' یا 'Allow' منتخب کریں",
      "یا: Settings → Privacy → Location Services → براؤزر کے لیے آن کریں",
      "ایپ پر واپس آ کر دوبارہ فعال کریں دبائیں",
    ],
    androidTitle: "اینڈرائیڈ (Chrome)",
    android: [
      "ایڈریس بار کے قریب لاک آئیکن پر ٹیپ کریں",
      "Permissions → Location → Allow پر ٹیپ کریں",
      "یا: Settings → Apps → Chrome → Permissions → Location",
      "صفحہ ریلوڈ کریں اور فعال کریں دبائیں",
    ],
    desktopTitle: "ڈیسک ٹاپ براؤزر",
    desktop: [
      "ایڈریس بار میں لاک آئیکن پر کلک کریں",
      "Location کو 'Allow' پر سیٹ کریں",
      "صفحہ ریلوڈ کریں",
    ],
    close: "سمجھ گیا",
  },
  hi: {
    msg: "लोकेशन बंद है। लाइव ट्रैकिंग और सुरक्षा के लिए सक्षम करें।",
    btn: "सक्षम करें",
    title: "लोकेशन एक्सेस की अनुमति दें",
    intro: "आपके ब्राउज़र ने लोकेशन ब्लॉक कर दी है। सेटिंग्स में सक्षम करने के लिए नीचे दिए चरणों का पालन करें।",
    iosTitle: "iPhone (Safari / Chrome)",
    ios: [
      "Settings → Safari → Location खोलें",
      "'Ask' या 'Allow' चुनें",
      "या: Settings → Privacy → Location Services → ब्राउज़र के लिए चालू करें",
      "ऐप पर वापस आएं और फिर से सक्षम करें दबाएं",
    ],
    androidTitle: "Android (Chrome)",
    android: [
      "URL के पास लॉक आइकन पर टैप करें",
      "Permissions → Location → Allow पर टैप करें",
      "या: Settings → Apps → Chrome → Permissions → Location",
      "पेज रीलोड करें और सक्षम करें दबाएं",
    ],
    desktopTitle: "डेस्कटॉप ब्राउज़र",
    desktop: [
      "एड्रेस बार में लॉक आइकन पर क्लिक करें",
      "Location को 'Allow' पर सेट करें",
      "पेज रीलोड करें",
    ],
    close: "समझ गया",
  },
};

type LangKey = keyof typeof labels;

export function LocationReminderBanner() {
  const { language, isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [permState, setPermState] = useState<PermissionState | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const t = labels[(language in labels ? language : "en") as LangKey];

  useEffect(() => {
    const hasRecentLocation = () => {
      const lastOkAt = Number(localStorage.getItem(LOCATION_OK_STORAGE_KEY) || 0);
      return lastOkAt > 0 && Date.now() - lastOkAt < RECENT_LOCATION_WINDOW_MS;
    };

    const hideIfLocationWorks = () => {
      if (hasRecentLocation()) setVisible(false);
    };

    window.addEventListener(LOCATION_UPDATED_EVENT, hideIfLocationWorks);

    if (!("permissions" in navigator)) {
      setVisible(!hasRecentLocation());
      return () => window.removeEventListener(LOCATION_UPDATED_EVENT, hideIfLocationWorks);
    }

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      setPermState(result.state);
      if (result.state !== "granted" && !hasRecentLocation()) setVisible(true);
      result.addEventListener("change", () => {
        setPermState(result.state);
        if (result.state === "granted") setVisible(false);
      });
    }).catch(() => {});

    return () => window.removeEventListener(LOCATION_UPDATED_EVENT, hideIfLocationWorks);
  }, []);

  if (!visible || dismissed) return null;

  const requestLocation = () => {
    // If permission is already denied, browser won't reprompt — show instructions
    if (permState === "denied") {
      setShowHelp(true);
      return;
    }
    navigator.geolocation?.getCurrentPosition(
      () => {
        localStorage.setItem(LOCATION_OK_STORAGE_KEY, String(Date.now()));
        window.dispatchEvent(new Event(LOCATION_UPDATED_EVENT));
        setVisible(false);
      },
      (err) => {
        if (err?.code === 1) setShowHelp(true); // PERMISSION_DENIED
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-fade-up"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-md px-4 py-3 shadow-lg">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
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

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent dir={isRTL ? "rtl" : "ltr"} className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Settings className="w-5 h-5 text-primary" />
              {t.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-1">
              {t.intro}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <section className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Smartphone className="w-4 h-4 text-primary" /> {t.iosTitle}
              </h4>
              <ol className="list-decimal ps-5 space-y-1 text-sm text-foreground/85 leading-relaxed">
                {t.ios.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </section>

            <section className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Smartphone className="w-4 h-4 text-primary" /> {t.androidTitle}
              </h4>
              <ol className="list-decimal ps-5 space-y-1 text-sm text-foreground/85 leading-relaxed">
                {t.android.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </section>

            <section className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Globe className="w-4 h-4 text-primary" /> {t.desktopTitle}
              </h4>
              <ol className="list-decimal ps-5 space-y-1 text-sm text-foreground/85 leading-relaxed">
                {t.desktop.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </section>
          </div>

          <Button onClick={() => setShowHelp(false)} className="w-full rounded-xl h-11">
            {t.close}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
