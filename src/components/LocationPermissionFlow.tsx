import { useState, useEffect, useCallback } from "react";
import { MapPin, Shield, AlertTriangle, Settings, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type PermissionState = "not_requested" | "denied" | "permanently_denied" | "granted" | "dismissed";

const translations = {
  en: {
    preTitle: "Enable Location for Your Safety",
    preMessage: "To ensure your safety and allow your family to track your journey in real time, HajCare AI requires access to your location.",
    preDetail: "Your location is used only for live tracking, emergency assistance, and safety alerts during Hajj & Umrah. We never misuse, sell, or share your data.",
    preButton: "👉 Allow Location Access",
    deniedTitle: "Location Access Needed",
    deniedMessage: "Location access is essential for live tracking, emergency help, and family updates. Without location, HajCare AI cannot protect or support you properly.",
    deniedEnable: "👉 Enable Location",
    deniedSkip: "Continue Without Tracking (Not Recommended)",
    blockedTitle: "Location Access Blocked",
    blockedMessage: "Your browser has blocked location access. To continue safely, please enable it manually:",
    step1: "Open browser Settings",
    step2: "Go to Site Settings → Location",
    step3: "Find hajcare.ai",
    step4: "Select Allow",
    showGuide: "👉 Show Step-by-Step Guide",
    retry: "👉 Retry Permission Request",
  },
  ar: {
    preTitle: "فعّل الموقع لسلامتك",
    preMessage: "لضمان سلامتك والسماح لعائلتك بتتبع رحلتك في الوقت الفعلي، يحتاج حج كير AI إلى الوصول إلى موقعك.",
    preDetail: "يُستخدم موقعك فقط للتتبع المباشر والمساعدة الطارئة وتنبيهات السلامة أثناء الحج والعمرة. لا نسيء استخدام بياناتك أو نبيعها أو نشاركها أبداً.",
    preButton: "👈 السماح بالوصول إلى الموقع",
    deniedTitle: "الوصول إلى الموقع مطلوب",
    deniedMessage: "الوصول إلى الموقع ضروري للتتبع المباشر والمساعدة الطارئة وتحديثات العائلة. بدون الموقع، لا يستطيع حج كير AI حمايتك أو دعمك بشكل صحيح.",
    deniedEnable: "👈 تفعيل الموقع",
    deniedSkip: "المتابعة بدون تتبع (غير مستحسن)",
    blockedTitle: "الوصول إلى الموقع محظور",
    blockedMessage: "قام المتصفح بحظر الوصول إلى الموقع. للمتابعة بأمان، يرجى تفعيله يدوياً:",
    step1: "افتح إعدادات المتصفح",
    step2: "انتقل إلى إعدادات الموقع ← الموقع الجغرافي",
    step3: "ابحث عن hajcare.ai",
    step4: "اختر السماح",
    showGuide: "👈 عرض الدليل خطوة بخطوة",
    retry: "👈 إعادة طلب الإذن",
  },
  ur: {
    preTitle: "اپنی حفاظت کے لیے لوکیشن فعال کریں",
    preMessage: "آپ کی حفاظت کو یقینی بنانے اور آپ کے خاندان کو آپ کے سفر کی ریئل ٹائم ٹریکنگ کی اجازت دینے کے لیے، حج کیئر AI کو آپ کی لوکیشن تک رسائی ضروری ہے۔",
    preDetail: "آپ کی لوکیشن صرف لائیو ٹریکنگ، ایمرجنسی مدد اور حج و عمرہ کے دوران حفاظتی الرٹس کے لیے استعمال ہوتی ہے۔ ہم آپ کا ڈیٹا کبھی غلط استعمال، فروخت یا شیئر نہیں کرتے۔",
    preButton: "👈 لوکیشن تک رسائی کی اجازت دیں",
    deniedTitle: "لوکیشن تک رسائی ضروری ہے",
    deniedMessage: "لائیو ٹریکنگ، ایمرجنسی مدد اور خاندانی اپ ڈیٹس کے لیے لوکیشن تک رسائی ضروری ہے۔ لوکیشن کے بغیر حج کیئر AI آپ کی حفاظت یا مدد نہیں کر سکتا۔",
    deniedEnable: "👈 لوکیشن فعال کریں",
    deniedSkip: "ٹریکنگ کے بغیر جاری رکھیں (تجویز نہیں)",
    blockedTitle: "لوکیشن تک رسائی بلاک ہے",
    blockedMessage: "آپ کے براؤزر نے لوکیشن تک رسائی بلاک کر دی ہے۔ محفوظ طریقے سے جاری رکھنے کے لیے، براہ کرم اسے دستی طور پر فعال کریں:",
    step1: "براؤزر کی سیٹنگز کھولیں",
    step2: "سائٹ سیٹنگز ← لوکیشن پر جائیں",
    step3: "hajcare.ai تلاش کریں",
    step4: "اجازت دیں منتخب کریں",
    showGuide: "👈 قدم بہ قدم گائیڈ دکھائیں",
    retry: "👈 اجازت کی درخواست دوبارہ کریں",
  },
  hi: {
    preTitle: "अपनी सुरक्षा के लिए लोकेशन सक्षम करें",
    preMessage: "आपकी सुरक्षा सुनिश्चित करने और आपके परिवार को आपकी यात्रा को रीयल टाइम में ट्रैक करने की अनुमति देने के लिए, हज केयर AI को आपकी लोकेशन तक पहुँच आवश्यक है।",
    preDetail: "आपकी लोकेशन का उपयोग केवल लाइव ट्रैकिंग, आपातकालीन सहायता और हज व उमरा के दौरान सुरक्षा अलर्ट के लिए किया जाता है। हम कभी भी आपका डेटा दुरुपयोग, बेचते या साझा नहीं करते।",
    preButton: "👉 लोकेशन एक्सेस की अनुमति दें",
    deniedTitle: "लोकेशन एक्सेस आवश्यक है",
    deniedMessage: "लाइव ट्रैकिंग, आपातकालीन सहायता और पारिवारिक अपडेट के लिए लोकेशन एक्सेस आवश्यक है। लोकेशन के बिना हज केयर AI आपकी सुरक्षा या सहायता नहीं कर सकता।",
    deniedEnable: "👉 लोकेशन सक्षम करें",
    deniedSkip: "ट्रैकिंग के बिना जारी रखें (अनुशंसित नहीं)",
    blockedTitle: "लोकेशन एक्सेस ब्लॉक है",
    blockedMessage: "आपके ब्राउज़र ने लोकेशन एक्सेस ब्लॉक कर दी है। सुरक्षित रूप से जारी रखने के लिए, कृपया इसे मैन्युअली सक्षम करें:",
    step1: "ब्राउज़र सेटिंग्स खोलें",
    step2: "साइट सेटिंग्स → लोकेशन पर जाएँ",
    step3: "hajcare.ai खोजें",
    step4: "अनुमति दें चुनें",
    showGuide: "👉 स्टेप-बाय-स्टेप गाइड दिखाएँ",
    retry: "👉 अनुमति अनुरोध पुनः करें",
  },
};

type LangKey = keyof typeof translations;

function getT(language: string) {
  const lang = (language in translations ? language : "en") as LangKey;
  return translations[lang];
}

interface LocationPermissionFlowProps {
  onPermissionGranted?: () => void;
  onDismiss?: () => void;
}

export function LocationPermissionFlow({ onPermissionGranted, onDismiss }: LocationPermissionFlowProps) {
  const { language, isRTL } = useLanguage();
  const t = getT(language);
  const [permState, setPermState] = useState<PermissionState>("not_requested");
  const [showGuide, setShowGuide] = useState(false);
  const [denialCount, setDenialCount] = useState(0);
  const [open, setOpen] = useState(true);

  // Check current permission state on mount
  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          setPermState("granted");
          setOpen(false);
          onPermissionGranted?.();
        } else if (result.state === "denied") {
          setPermState("permanently_denied");
        }
        // "prompt" = not_requested, keep default
        result.addEventListener("change", () => {
          if (result.state === "granted") {
            setPermState("granted");
            setOpen(false);
            onPermissionGranted?.();
          } else if (result.state === "denied") {
            setPermState("permanently_denied");
          }
        });
      }).catch(() => {
        // permissions API not supported, stay at not_requested
      });
    }
  }, [onPermissionGranted]);

  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => {
        setPermState("granted");
        setOpen(false);
        onPermissionGranted?.();
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          const newCount = denialCount + 1;
          setDenialCount(newCount);
          // After 2 denials, consider it permanently blocked
          if (newCount >= 2) {
            setPermState("permanently_denied");
          } else {
            setPermState("denied");
          }
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [denialCount, onPermissionGranted]);

  const handleDismiss = () => {
    setOpen(false);
    setPermState("dismissed");
    onDismiss?.();
  };

  // Don't show if already granted or dismissed
  if (permState === "granted" || permState === "dismissed") return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); }}>
      <DialogContent
        className="max-w-md mx-auto rounded-2xl border-primary/20"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* PRE-REQUEST STATE */}
        {permState === "not_requested" && (
          <>
            <DialogHeader className="items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <DialogTitle className="text-lg font-bold">
                {t.preTitle}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {t.preMessage}
              </DialogDescription>
            </DialogHeader>
            <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
              {t.preDetail}
            </p>
            <Button
              onClick={requestPermission}
              className="w-full h-14 text-base font-semibold rounded-xl mt-2"
              size="lg"
            >
              <MapPin className="w-5 h-5" />
              {t.preButton}
            </Button>
          </>
        )}

        {/* DENIED STATE */}
        {permState === "denied" && (
          <>
            <DialogHeader className="items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-accent-foreground" />
              </div>
              <DialogTitle className="text-lg font-bold">
                {t.deniedTitle}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {t.deniedMessage}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <Button
                onClick={requestPermission}
                className="w-full h-14 text-base font-semibold rounded-xl"
                size="lg"
              >
                <MapPin className="w-5 h-5" />
                {t.deniedEnable}
              </Button>
              <Button
                variant="ghost"
                onClick={handleDismiss}
                className="w-full h-12 text-sm text-muted-foreground rounded-xl"
              >
                <X className="w-4 h-4" />
                {t.deniedSkip}
              </Button>
            </div>
          </>
        )}

        {/* PERMANENTLY BLOCKED STATE */}
        {permState === "permanently_denied" && (
          <>
            <DialogHeader className="items-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Settings className="w-8 h-8 text-destructive" />
              </div>
              <DialogTitle className="text-lg font-bold">
                {t.blockedTitle}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed">
                {t.blockedMessage}
              </DialogDescription>
            </DialogHeader>

            {showGuide && (
              <div className="bg-muted/50 rounded-xl p-4 space-y-2.5 mt-1">
                {[t.step1, t.step2, t.step3, t.step4].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 mt-2">
              {!showGuide && (
                <Button
                  onClick={() => setShowGuide(true)}
                  variant="outline"
                  className="w-full h-14 text-base font-semibold rounded-xl"
                  size="lg"
                >
                  <Settings className="w-5 h-5" />
                  {t.showGuide}
                </Button>
              )}
              <Button
                onClick={requestPermission}
                className="w-full h-14 text-base font-semibold rounded-xl"
                size="lg"
              >
                <RefreshCw className="w-5 h-5" />
                {t.retry}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
