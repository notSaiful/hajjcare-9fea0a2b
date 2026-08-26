import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleHeader } from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { Globe, Smartphone, Apple, Share2, Copy, Check, ExternalLink, MessageCircle, QrCode } from "lucide-react";

const SITE_URL = "https://hajjcare.in";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(SITE_URL)}`;

const OpenAppPage = () => {
  const { language, isRTL } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
    else if (/Android/i.test(ua)) setPlatform("android");
    else setPlatform("other");
  }, []);

  const lang = (["hi", "ur", "ar"].includes(language) ? language : "en") as "en" | "hi" | "ur" | "ar";

  const t = {
    en: {
      title: "Open HajjCare", subtitle: "The official website is live at hajjcare.in",
      visit: "Visit Website Now", copy: "Copy Link", copied: "Copied!",
      iosTitle: "iPhone / Apple users",
      iosSteps: [
        "Open Safari (not Chrome)",
        "Type hajjcare.in in the address bar at the top",
        "Tap 'Go' on the keyboard — Safari adds https:// automatically",
        "If you see search results instead, type the full https://hajjcare.in",
      ],
      androidTitle: "Android users",
      androidSteps: [
        "Open Chrome browser",
        "Type hajjcare.in in the address bar",
        "Tap Enter / Go",
      ],
      shareTitle: "Share with family",
      shareWA: "Share on WhatsApp", share: "Share Link", scan: "Scan this QR code",
      whyTitle: "Site not opening?",
      whyList: [
        "Check spelling: hajjcare.in (two J's, not one)",
        "Use https://hajjcare.in instead of http://",
        "Clear your browser cache (Settings → Clear browsing data)",
        "Try mobile data instead of Wi-Fi (or vice-versa)",
        "Try incognito / private window",
      ],
    },
    hi: {
      title: "हज केयर खोलें", subtitle: "आधिकारिक वेबसाइट hajjcare.in पर लाइव है",
      visit: "वेबसाइट अभी खोलें", copy: "लिंक कॉपी करें", copied: "कॉपी हो गया!",
      iosTitle: "iPhone / Apple यूज़र्स के लिए",
      iosSteps: [
        "Safari खोलें (Chrome नहीं)",
        "ऊपर एड्रेस बार में hajjcare.in लिखें",
        "कीबोर्ड पर 'Go' दबाएँ — Safari अपने आप https:// लगा देगा",
        "अगर सर्च रिज़ल्ट आ रहे हैं तो पूरा https://hajjcare.in लिखें",
      ],
      androidTitle: "Android यूज़र्स के लिए",
      androidSteps: [
        "Chrome ब्राउज़र खोलें",
        "एड्रेस बार में hajjcare.in लिखें",
        "Enter / Go दबाएँ",
      ],
      shareTitle: "परिवार के साथ शेयर करें",
      shareWA: "WhatsApp पर शेयर", share: "लिंक शेयर करें", scan: "इस QR कोड को स्कैन करें",
      whyTitle: "साइट नहीं खुल रही?",
      whyList: [
        "स्पेलिंग जाँचें: hajjcare.in (दो J, एक नहीं)",
        "http:// की जगह https://hajjcare.in इस्तेमाल करें",
        "ब्राउज़र कैश साफ़ करें (Settings → Clear browsing data)",
        "Wi-Fi की जगह मोबाइल डेटा पर try करें (या उल्टा)",
        "Incognito / Private window try करें",
      ],
    },
    ur: {
      title: "حج کیئر کھولیں", subtitle: "آفیشل ویب سائٹ hajjcare.in پر لائیو ہے",
      visit: "ویب سائٹ ابھی کھولیں", copy: "لنک کاپی کریں", copied: "کاپی ہو گیا!",
      iosTitle: "iPhone / Apple یوزرز کے لیے",
      iosSteps: [
        "Safari کھولیں (Chrome نہیں)",
        "اوپر ایڈریس بار میں hajjcare.in لکھیں",
        "کی بورڈ پر 'Go' دبائیں — Safari خود https:// لگا دے گا",
        "اگر سرچ رزلٹ آ رہے ہیں تو پورا https://hajjcare.in لکھیں",
      ],
      androidTitle: "Android یوزرز کے لیے",
      androidSteps: [
        "Chrome براؤزر کھولیں",
        "ایڈریس بار میں hajjcare.in لکھیں",
        "Enter / Go دبائیں",
      ],
      shareTitle: "اہلِ خانہ سے شیئر کریں",
      shareWA: "WhatsApp پر شیئر", share: "لنک شیئر کریں", scan: "اس QR کوڈ کو اسکین کریں",
      whyTitle: "سائٹ نہیں کھل رہی؟",
      whyList: [
        "ہجے چیک کریں: hajjcare.in (دو J)",
        "http:// کی جگہ https://hajjcare.in استعمال کریں",
        "براؤزر کیش صاف کریں",
        "Wi-Fi کی جگہ موبائل ڈیٹا آزمائیں (یا اُلٹا)",
        "Incognito / Private window آزمائیں",
      ],
    },
    ar: {
      title: "افتح حج كير", subtitle: "الموقع الرسمي يعمل على hajjcare.in",
      visit: "افتح الموقع الآن", copy: "نسخ الرابط", copied: "تم النسخ!",
      iosTitle: "لمستخدمي iPhone / Apple",
      iosSteps: [
        "افتح متصفح Safari (وليس Chrome)",
        "اكتب hajjcare.in في شريط العنوان",
        "اضغط 'Go' — سيضيف Safari تلقائيًا https://",
        "إذا ظهرت نتائج البحث، اكتب https://hajjcare.in بالكامل",
      ],
      androidTitle: "لمستخدمي Android",
      androidSteps: ["افتح متصفح Chrome", "اكتب hajjcare.in في شريط العنوان", "اضغط Enter / Go"],
      shareTitle: "شارك مع العائلة",
      shareWA: "شارك عبر WhatsApp", share: "شارك الرابط", scan: "امسح رمز QR هذا",
      whyTitle: "الموقع لا يفتح؟",
      whyList: [
        "تحقق من التهجئة: hajjcare.in (حرفان J)",
        "استخدم https://hajjcare.in بدلاً من http://",
        "امسح ذاكرة التخزين المؤقت للمتصفح",
        "جرّب بيانات الجوال بدلاً من Wi-Fi",
        "جرّب نافذة التصفح الخاص",
      ],
    },
  }[lang];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = SITE_URL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "HajjCare", text: t.subtitle, url: SITE_URL });
      } catch { /* user cancelled */ }
    } else {
      handleCopy();
    }
  };

  const waMessage = encodeURIComponent(`${t.subtitle}\n\n${SITE_URL}`);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Hero */}
        <section className="text-center space-y-3 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-2xl p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary">{t.title}</h1>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>

          <div className="flex flex-col gap-2 pt-2">
            <Button asChild size="lg" className="w-full rounded-xl gap-2 h-14 text-base font-semibold">
              <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5" />
                {t.visit}
              </a>
            </Button>
            <div className="flex items-center justify-center gap-2 px-3 py-2.5 bg-card border border-border rounded-xl">
              <code className="font-mono text-sm flex-1 text-center select-all">{SITE_URL}</code>
              <Button onClick={handleCopy} variant="ghost" size="sm" className="rounded-lg gap-1.5 h-8">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-xs">{copied ? t.copied : t.copy}</span>
              </Button>
            </div>
          </div>
        </section>

        {/* iPhone instructions — highlighted if user is on iOS */}
        <section className={`rounded-2xl p-5 space-y-3 border-2 ${platform === "ios" ? "bg-primary/5 border-primary/40" : "bg-card border-border"}`}>
          <h2 className="text-base font-bold flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-foreground/10 flex items-center justify-center">
              <Apple className="w-5 h-5" />
            </div>
            {t.iosTitle}
            {platform === "ios" && (
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                You
              </span>
            )}
          </h2>
          <ol className="space-y-2 text-sm leading-relaxed">
            {t.iosSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Android instructions */}
        <section className={`rounded-2xl p-5 space-y-3 border-2 ${platform === "android" ? "bg-primary/5 border-primary/40" : "bg-card border-border"}`}>
          <h2 className="text-base font-bold flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-emerald-700" />
            </div>
            {t.androidTitle}
            {platform === "android" && (
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                You
              </span>
            )}
          </h2>
          <ol className="space-y-2 text-sm leading-relaxed">
            {t.androidSteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* QR + Share */}
        <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-amber-700" />
            </div>
            {t.shareTitle}
          </h2>

          <div className="flex flex-col items-center gap-3 bg-muted/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" />
              {t.scan}
            </p>
            <img src={QR_URL} alt="HajjCare QR Code" className="w-44 h-44 rounded-xl bg-white p-2 shadow-sm" loading="lazy" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button asChild className="rounded-xl gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
              <a href={`https://wa.me/?text=${waMessage}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                {t.shareWA}
              </a>
            </Button>
            <Button onClick={handleShare} variant="outline" className="rounded-xl gap-1.5">
              <Share2 className="w-4 h-4" />
              {t.share}
            </Button>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <h2 className="text-base font-bold text-amber-800">{t.whyTitle}</h2>
          <ul className="space-y-2 text-sm">
            {t.whyList.map((item, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="text-amber-700 flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default OpenAppPage;
