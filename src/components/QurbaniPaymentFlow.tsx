import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { User, Building2, Landmark, Factory, ArrowDown, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

type Lang = "en" | "ar" | "ur" | "hi";

const labels: Record<string, Record<Lang, string>> = {
  title: {
    en: "Official Qurbani Payment Flow",
    ar: "مسار دفع الأضحية الرسمي",
    ur: "سرکاری قربانی ادائیگی کا طریقہ",
    hi: "आधिकारिक कुर्बानी भुगतान प्रवाह"
  },
  subtitle: {
    en: "Your sacrifice is handled through a secure, Shariah-compliant banking channel",
    ar: "يتم التعامل مع أضحيتك عبر قناة مصرفية آمنة ومتوافقة مع الشريعة",
    ur: "آپ کی قربانی ایک محفوظ، شریعت سے مطابق بینکنگ چینل سے ہوتی ہے",
    hi: "आपकी कुर्बानी एक सुरक्षित, शरीयत-अनुपालक बैंकिंग चैनल से होती है"
  },
  step1Title: {
    en: "You (Pilgrim)",
    ar: "أنت (الحاج)",
    ur: "آپ (حاجی)",
    hi: "आप (हाजी)"
  },
  step1Desc: {
    en: "Pay via your Hajj operator or the official Adahi app/website. No cash needed.",
    ar: "ادفع عبر منظم الحج أو تطبيق/موقع الأضاحي الرسمي. لا حاجة للنقد.",
    ur: "اپنے حج آپریٹر یا سرکاری اضحی ایپ/ویب سائٹ سے ادائیگی کریں۔ نقدی کی ضرورت نہیں۔",
    hi: "अपने हज ऑपरेटर या आधिकारिक अधही ऐप/वेबसाइट से भुगतान करें। नकदी की जरूरत नहीं।"
  },
  step2Title: {
    en: "Al Rajhi Bank",
    ar: "مصرف الراجحي",
    ur: "الراجحی بینک",
    hi: "अल राजी बैंक"
  },
  step2Desc: {
    en: "Saudi Arabia's largest Islamic bank securely processes and holds all Qurbani payments in escrow.",
    ar: "أكبر بنك إسلامي في السعودية يعالج ويحفظ جميع مدفوعات الأضحية في حساب ضمان.",
    ur: "سعودی عرب کا سب سے بڑا اسلامی بینک تمام قربانی کی ادائیگیاں محفوظ طریقے سے ایسکرو میں رکھتا ہے۔",
    hi: "सऊदी अरब का सबसे बड़ा इस्लामी बैंक सभी कुर्बानी भुगतान को एस्क्रो में सुरक्षित रखता है।"
  },
  step3Title: {
    en: "Adahi Platform (IsDB)",
    ar: "منصة أضاحي (البنك الإسلامي للتنمية)",
    ur: "اضحی پلیٹ فارم (اسلامی ترقیاتی بینک)",
    hi: "अधही प्लेटफॉर्म (IsDB)"
  },
  step3Desc: {
    en: "The Islamic Development Bank's official digital platform manages allocation, scheduling, and compliance for all sacrifices.",
    ar: "المنصة الرقمية الرسمية للبنك الإسلامي للتنمية تدير التخصيص والجدولة والامتثال لجميع الذبائح.",
    ur: "اسلامی ترقیاتی بینک کا سرکاری ڈیجیٹل پلیٹ فارم تمام قربانیوں کی تقسیم، شیڈولنگ اور تعمیل کا انتظام کرتا ہے۔",
    hi: "इस्लामी विकास बैंक का आधिकारिक डिजिटल प्लेटफॉर्म सभी कुर्बानियों के आवंटन, शेड्यूलिंग और अनुपालन का प्रबंधन करता है।"
  },
  step4Title: {
    en: "Saudi Slaughterhouses",
    ar: "المسالخ السعودية",
    ur: "سعودی ذبح خانے",
    hi: "सऊदी वधशालाएं"
  },
  step4Desc: {
    en: "Government-certified, Halal-compliant facilities perform the sacrifice under veterinary supervision. Meat is distributed to charity.",
    ar: "منشآت معتمدة حكومياً ومتوافقة مع الحلال تقوم بالذبح تحت إشراف بيطري. يتم توزيع اللحوم للجمعيات الخيرية.",
    ur: "حکومت سے تصدیق شدہ، حلال مطابق سہولیات ویٹرنری نگرانی میں قربانی کرتی ہیں۔ گوشت خیراتی اداروں میں تقسیم ہوتا ہے۔",
    hi: "सरकार-प्रमाणित, हलाल-अनुपालक सुविधाएं पशु चिकित्सा निगरानी में कुर्बानी करती हैं। मांस दान में वितरित होता है।"
  },
  securityTitle: {
    en: "Why This System is Secure",
    ar: "لماذا هذا النظام آمن",
    ur: "یہ نظام محفوظ کیوں ہے",
    hi: "यह प्रणाली सुरक्षित क्यों है"
  },
  security1: {
    en: "End-to-end Shariah-compliant — no interest, no middlemen",
    ar: "متوافق مع الشريعة من البداية للنهاية — بدون فوائد، بدون وسطاء",
    ur: "مکمل شریعت مطابق — کوئی سود نہیں، کوئی بیچولیا نہیں",
    hi: "शुरू से अंत तक शरीयत-अनुपालक — कोई ब्याज नहीं, कोई बिचौलिया नहीं"
  },
  security2: {
    en: "Funds held in escrow by Al Rajhi Bank until sacrifice is confirmed",
    ar: "الأموال محفوظة في حساب ضمان لدى مصرف الراجحي حتى تأكيد الذبح",
    ur: "قربانی کی تصدیق تک رقم الراجحی بینک کے ایسکرو اکاؤنٹ میں محفوظ",
    hi: "कुर्बानी की पुष्टि तक राशि अल राजी बैंक के एस्क्रो में सुरक्षित"
  },
  security3: {
    en: "Digital tracking — get SMS/notification when your Qurbani is completed",
    ar: "تتبع رقمي — احصل على رسالة/إشعار عند إتمام أضحيتك",
    ur: "ڈیجیٹل ٹریکنگ — قربانی مکمل ہونے پر SMS/نوٹیفکیشن حاصل کریں",
    hi: "डिजिटल ट्रैकिंग — कुर्बानी पूरी होने पर SMS/नोटिफिकेशन प्राप्त करें"
  },
  security4: {
    en: "Government-audited slaughterhouses with veterinary oversight",
    ar: "مسالخ مراقبة حكومياً مع إشراف بيطري",
    ur: "حکومتی نگرانی والے ذبح خانے ویٹرنری نگرانی کے ساتھ",
    hi: "सरकारी निरीक्षित वधशालाएं पशु चिकित्सा निगरानी के साथ"
  },
  disclaimer: {
    en: "HajjCare does not process payments. This is an educational guide to the official Saudi Adahi system.",
    ar: "حج كير لا يعالج المدفوعات. هذا دليل تعليمي لنظام الأضاحي السعودي الرسمي.",
    ur: "حج کیئر ادائیگیاں نہیں کرتا۔ یہ سعودی اضحی نظام کی معلوماتی رہنمائی ہے۔",
    hi: "हज केयर भुगतान प्रोसेस नहीं करता। यह आधिकारिक सऊदी अधही प्रणाली की शैक्षिक मार्गदर्शिका है।"
  }
};

const steps = [
  { titleKey: "step1Title", descKey: "step1Desc", Icon: User, color: "text-primary" },
  { titleKey: "step2Title", descKey: "step2Desc", Icon: Building2, color: "text-emerald-600" },
  { titleKey: "step3Title", descKey: "step3Desc", Icon: Landmark, color: "text-blue-600" },
  { titleKey: "step4Title", descKey: "step4Desc", Icon: Factory, color: "text-orange-600" },
];

const QurbaniPaymentFlow = () => {
  const { language } = useLanguage();
  const lang: Lang = (language === "en" || language === "ar" || language === "ur" || language === "hi") ? language : "en";

  return (
    <div className="space-y-5">
      {/* Flow Title */}
      <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <CardContent className="p-5 space-y-5">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{labels.title[lang]}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{labels.subtitle[lang]}</p>
          </div>

          {/* Flow Steps */}
          <div className="space-y-1">
            {steps.map((step, idx) => (
              <div key={step.titleKey}>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-sm">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-background border-2 ${
                    idx === 0 ? "border-primary/30" :
                    idx === 1 ? "border-emerald-500/30" :
                    idx === 2 ? "border-blue-500/30" :
                    "border-orange-500/30"
                  }`}>
                    <step.Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                      <h3 className="font-semibold text-foreground">{labels[step.titleKey][lang]}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {labels[step.descKey][lang]}
                    </p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="p-5 space-y-3">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            {labels.securityTitle[lang]}
          </h2>
          <ul className="space-y-2.5">
            {(["security1", "security2", "security3", "security4"] as const).map((key) => (
              <li key={key} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground leading-relaxed">{labels[key][lang]}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed px-2">
        {labels.disclaimer[lang]}
      </p>
    </div>
  );
};

export default QurbaniPaymentFlow;
