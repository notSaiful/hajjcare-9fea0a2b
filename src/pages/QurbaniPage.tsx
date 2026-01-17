import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import QurbaniStatusTracker from "@/components/QurbaniStatusTracker";
import { Card, CardContent } from "@/components/ui/card";
import { Sword, BookOpen, Info } from "lucide-react";

const labels = {
  title: {
    en: "Qurbani (Adahi)",
    ar: "الأضحية",
    ur: "قربانی (اضحی)",
    hi: "कुर्बानी (अधही)"
  },
  subtitle: {
    en: "Your official Hajj sacrifice arrangements",
    ar: "ترتيبات ذبيحة الحج الرسمية",
    ur: "آپ کے سرکاری حج قربانی کے انتظامات",
    hi: "आपकी आधिकारिक हज कुर्बानी की व्यवस्था"
  },
  aboutTitle: {
    en: "About Qurbani in Hajj",
    ar: "عن الأضحية في الحج",
    ur: "حج میں قربانی کے بارے میں",
    hi: "हज में कुर्बानी के बारे में"
  },
  aboutContent: {
    en: "After stoning Jamrat al-Aqaba on the 10th of Dhul Hijjah, pilgrims offer an animal sacrifice (Qurbani/Hady). This is typically arranged by your Hajj operator through official channels. The sacrifice marks an important milestone in the Hajj rituals.",
    ar: "بعد رمي جمرة العقبة في العاشر من ذي الحجة، يقدم الحجاج أضحية (الهدي). عادة ما يتم ترتيب هذا من قبل منظم الحج عبر القنوات الرسمية. تمثل الذبيحة معلماً مهماً في مناسك الحج.",
    ur: "10 ذی الحجہ کو جمرہ العقبہ پر رمی کے بعد حجاج جانور کی قربانی (ہدی) دیتے ہیں۔ یہ عام طور پر آپ کے حج آپریٹر کی طرف سے سرکاری ذرائع سے کیا جاتا ہے۔ قربانی حج کے مناسک میں ایک اہم سنگ میل ہے۔",
    hi: "10 ज़िल्हिज्जा को जमरात अल-अक़बा पर रमी के बाद, हाजी पशु बलि (कुर्बानी/हद्य) देते हैं। यह आमतौर पर आपके हज ऑपरेटर द्वारा आधिकारिक चैनलों के माध्यम से व्यवस्थित किया जाता है। कुर्बानी हज के अनुष्ठानों में एक महत्वपूर्ण मील का पत्थर है।"
  },
  importantNote: {
    en: "Important Note",
    ar: "ملاحظة مهمة",
    ur: "اہم نوٹ",
    hi: "महत्वपूर्ण नोट"
  },
  noteContent: {
    en: "Do not shave or trim your hair until your Qurbani is confirmed as completed. Maintain the proper sequence of rituals. If you are unsure, please consult your Hajj group leader.",
    ar: "لا تحلق أو تقصر شعرك حتى يتم تأكيد إتمام أضحيتك. حافظ على الترتيب الصحيح للمناسك. إذا لم تكن متأكداً، يرجى استشارة قائد مجموعة الحج.",
    ur: "اپنی قربانی کی تصدیق تک بال نہ منڈوائیں اور نہ چھوٹے کروائیں۔ مناسک کی صحیح ترتیب برقرار رکھیں۔ اگر آپ کو یقین نہیں ہے تو براہ کرم اپنے حج گروپ لیڈر سے مشورہ کریں۔",
    hi: "अपनी कुर्बानी की पुष्टि होने तक बाल न मुंडवाएं या न काटें। अनुष्ठानों का उचित क्रम बनाए रखें। यदि आप अनिश्चित हैं, तो कृपया अपने हज समूह के नेता से परामर्श करें।"
  }
};

const QurbaniPage = () => {
  const { language, isRTL } = useLanguage();
  
  const lang = (language === "en" || language === "ar" || language === "ur" || language === "hi") 
    ? language 
    : "en";

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto border-2 border-orange-500/20">
            <Sword className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {labels.title[lang]}
            </h1>
            <p className="text-muted-foreground mt-1">
              {labels.subtitle[lang]}
            </p>
          </div>
        </div>

        {/* Status Tracker */}
        <QurbaniStatusTracker />

        {/* About Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {labels.aboutTitle[lang]}
            </h2>
            <p className="text-foreground leading-relaxed">
              {labels.aboutContent[lang]}
            </p>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Card className="border-status-assistance/20 bg-status-assistance/5">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-status-assistance" />
              {labels.importantNote[lang]}
            </h2>
            <p className="text-foreground leading-relaxed">
              {labels.noteContent[lang]}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default QurbaniPage;
