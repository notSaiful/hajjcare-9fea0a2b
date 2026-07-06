import { Link } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Sparkles, Shield, Video, BookOpen, Wrench } from "lucide-react";

const labels = {
  en: {
    title: "Changelog",
    subtitle: "Latest updates to HajCare",
    backToHome: "Back to home",
    heading: "What's new since July 1",
    date: "July 6, 2026",
  },
  ar: {
    title: "سجل التغييرات",
    subtitle: "آخر تحديثات HajCare",
    backToHome: "العودة إلى الرئيسية",
    heading: "ما الجديد منذ ١ يوليو",
    date: "٦ يوليو ٢٠٢٦",
  },
  ur: {
    title: " changelog",
    subtitle: "HajCare کے تازہ ترین اپڈیٹس",
    backToHome: "ہوم پر واپس",
    heading: "۱ جولائی کے بعد کیا نیا ہے",
    date: "۶ جولائی ۲۰۲۶",
  },
  hi: {
    title: "Changelog",
    subtitle: "HajCare के नवीनतम अपडेट",
    backToHome: "होम पर वापस",
    heading: "1 जुलाई के बाद क्या नया है",
    date: "6 जुलाई 2026",
  },
  ta: {
    title: "Changelog",
    subtitle: "HajCare இன் சமீபத்திய புதுப்பிப்புகள்",
    backToHome: "முகப்புக்குத் திரும்பு",
    heading: "ஜூலை 1 முதல் புதியது என்ன",
    date: "ஜூலை 6, 2026",
  },
  te: {
    title: "Changelog",
    subtitle: "HajCare యొక్క తాజా అప్‌డేట్‌లు",
    backToHome: "హోమ్‌కు తిరిగి వెళ్ళు",
    heading: "జులై 1 నుండి కొత్తవి ఏమిటి",
    date: "జులై 6, 2026",
  },
  mr: {
    title: "Changelog",
    subtitle: "HajCare च्या ताज्या अपडेट्स",
    backToHome: "होमवर परत",
    heading: "१ जुलै पासून काय नवीन आहे",
    date: "६ जुलै २०२६",
  },
  bn: {
    title: "Changelog",
    subtitle: "HajCare এর সাম্প্রতিক আপডেট",
    backToHome: "হোমে ফিরুন",
    heading: "১ জুলাই থেকে নতুন কী",
    date: "৬ জুলাই, ২০২৬",
  },
  or: {
    title: "Changelog",
    subtitle: "HajCare ର ସାମ୍ପ୍ରତିକ ଅପଡେଟ୍",
    backToHome: "ହୋମ୍‌କୁ ଫେରନ୍ତୁ",
    heading: "ଜୁଲାଇ 1 ରୁ କଣ ନୂଆ",
    date: "ଜୁଲାଇ 6, 2026",
  },
  ml: {
    title: "Changelog",
    subtitle: "HajCare ന്റെ പുതിയ അപ്ഡേറ്റുകൾ",
    backToHome: "ഹോമിലേക്ക് തിരിച്ച് പോകുക",
    heading: "ജൂലൈ 1 മുതൽ പുതിയത് എന്ത്",
    date: "ജൂലൈ 6, 2026",
  },
  pa: {
    title: "Changelog",
    subtitle: "HajCare ਦੇ ਤਾਜ਼ਾ ਅਪਡੇਟ",
    backToHome: "ਹੋਮ 'ਤੇ ਵਾਪਸ",
    heading: "1 ਜੁਲਾਈ ਤੋਂ ਬਾਅਦ ਕੀ ਨਵਾਂ ਹੈ",
    date: "6 ਜੁਲਾਈ 2026",
  },
};

const entries = {
  en: [
    {
      icon: Video,
      badge: "New",
      title: "Hajj Training Hub",
      body: "AI-generated summaries in 6 languages, watch-progress tracking, and end-of-topic quizzes with instant feedback.",
    },
    {
      icon: BookOpen,
      badge: "Improved",
      title: "Bengali, Tamil & Malayalam quizzes",
      body: "Every training topic now has 3 MCQs translated into BN, TA, and ML — no English fallback.",
    },
    {
      icon: Shield,
      badge: "Security",
      title: "Lost & Found privacy hardening",
      body: "Removed exposed public contact details from Lost & Found listings and claim cards.",
    },
    {
      icon: Wrench,
      badge: "Fix",
      title: "TypeScript build fixes",
      body: "Resolved NodeJS namespace and node:fs type errors for a cleaner build.",
    },
  ],
  ar: [
    {
      icon: Video,
      badge: "جديد",
      title: "مركز تدريب الحج",
      body: "ملخصات ذكية بـ 6 لغات، وتتبع تقدم المشاهدة، واختبارات نهاية كل موضوع مع ملاحظات فورية.",
    },
    {
      icon: BookOpen,
      badge: "محسّن",
      title: "اختبارات البنغالية والتاميل والمالايالام",
      body: "كل موضوع تدريبي يتضمن الآن 3 أسئلة متعددة الخيارات بـ BN وTA وML دون الرجوع إلى الإنجليزية.",
    },
    {
      icon: Shield,
      badge: "أمان",
      title: "تعزيز خصوصية المفقودات",
      body: "تمت إزالة تفاصيل الاتصال العامة المعروضة من قوائم المفقودات وبطاقات المطالبة.",
    },
    {
      icon: Wrench,
      badge: "إصلاح",
      title: "إصلاحات بناء TypeScript",
      body: "تم حل أخطاء مساحة اسم NodeJS وأنواع node:fs لبناء أنظف.",
    },
  ],
  ur: [
    {
      icon: Video,
      badge: "نیا",
      title: "حج ٹریننگ ہب",
      body: "۶ زبانوں میں AI تیار کردہ خلاصے، دیکھنے کی پیشرفت کی ٹریکنگ، اور ہر موضوع کے آخر میں فوری فید بیک کے ساتھ کوئز۔",
    },
    {
      icon: BookOpen,
      badge: "بہتر",
      title: "بنگالی، تامل اور ملیالم کوئز",
      body: "ہر تربیتی موضوع کے اب BN، TA اور ML میں 3 MCQs ہیں — انگریزی فال بیک کے بغیر۔",
    },
    {
      icon: Shield,
      badge: "سیکیورٹی",
      title: "لاپتہ و مکمل کے پرائیویسی میں سختی",
      body: "لاپتہ و مکمل کی فہرستوں اور دعویٰ کارڈز سے عوامی رابطہ کی تفصیلات ہٹا دی گئیں۔",
    },
    {
      icon: Wrench,
      badge: "درستگی",
      title: "TypeScript build درستگیاں",
      body: "NodeJS namespace اور node:fs type کی خرابیوں کو حل کر دیا گیا۔",
    },
  ],
  hi: [
    {
      icon: Video,
      badge: "नया",
      title: "हज ट्रेनिंग हब",
      body: "६ भाषाओं में AI-जनित सारांश, वॉच प्रोग्रेस ट्रैकिंग, और त्वरित फीडबैक के साथ अंत-विषय क्विज़।",
    },
    {
      icon: BookOpen,
      badge: "बेहतर",
      title: "बंगाली, तमिल और मलयालम क्विज़",
      body: "प्रत्येक प्रशिक्षण विषय के अब BN, TA और ML में 3 MCQ हैं — बिना अंग्रेजी फॉलबैक के।",
    },
    {
      icon: Shield,
      badge: "सुरक्षा",
      title: "लॉस्ट एंड फाउंड प्राइवेसी हार्डनिंग",
      body: "लॉस्ट एंड फाउंड सूचियों और दावा कार्ड से सार्वजनिक संपर्क विवरण हटा दिए गए।",
    },
    {
      icon: Wrench,
      badge: "फिक्स",
      title: "TypeScript बिल्ड फिक्स",
      body: "NodeJS namespace और node:fs type errors को हल करके साफ बिल्ड सुनिश्चित किया।",
    },
  ],
  ta: [
    {
      icon: Video,
      badge: "புதிய",
      title: "ஹஜ் பயிற்சி மையம்",
      body: "6 மொழிகளில் AI உருவாக்கிய சுருக்கங்கள், பார்க்கும் முன்னேற்ற கண்காணிப்பு, உடனடி கருத்துடன் இறுதி வினாடி வினா.",
    },
    {
      icon: BookOpen,
      badge: "மேம்படுத்தப்பட்ட",
      title: "வங்காளம், தமிழ், மலையாளம் வினாடி வினா",
      body: "ஒவ்வொரு பயிற்சி தலைப்பிலும் இப்போது BN, TA, ML மொழிகளில் 3 MCQகள் — ஆங்கில மாற்று இல்லாமல்.",
    },
    {
      icon: Shield,
      badge: "பாதுகாப்பு",
      title: "Lost & Found தனியுரிமை கடினமாக்கல்",
      body: "Lost & Found பட்டியல்களிலும் கிளெய்ம் கார்டுகளிலும் வெளிப்படையான தொடர்பு விவரங்கள் நீக்கப்பட்டன.",
    },
    {
      icon: Wrench,
      badge: "திருத்தம்",
      title: "TypeScript build திருத்தங்கள்",
      body: "NodeJS namespace மற்றும் node:fs type பிழைகள் சரி செய்யப்பட்டன.",
    },
  ],
  te: [
    {
      icon: Video,
      badge: "కొత్త",
      title: "హజ్ శిక్షణ హబ్",
      body: "6 భాషలలో AI-సృష్టించిన సారాంశాలు, వాచ్ ప్రోగ్రెస్ ట్రాకింగ్, తక్షణ ఫీడ్‌బ్యాక్‌తో టాపిక్ చివరి క్విజ్.",
    },
    {
      icon: BookOpen,
      badge: "మెరుగుపరచబడిన",
      title: "బెంగాలీ, తమిళ, మలయాళ క్విజ్‌లు",
      body: "ప్రతి శిక్షణా అంశానికి ఇప్పుడు BN, TA, ML భాషల్లో 3 MCQలు — ఆంగ్ల ఫాల్‌బ్యాక్ లేకుండా.",
    },
    {
      icon: Shield,
      badge: "భద్రత",
      title: "Lost & Found ప్రైవసీ గట్టిపరచడం",
      body: "Lost & Found జాబితాలు మరియు క్లెయిమ్ కార్డుల నుండి బహిరంగ సంప్రదింపు వివరాలను తొలగించారు.",
    },
    {
      icon: Wrench,
      badge: "ఫిక్స్",
      title: "TypeScript build ఫిక్స్‌లు",
      body: "NodeJS namespace మరియు node:fs type ఎర్రర్లను పరిష్కరించారు.",
    },
  ],
  mr: [
    {
      icon: Video,
      badge: "नवीन",
      title: "हज प्रशिक्षण केंद्र",
      body: "६ भाषांमध्ये AI-तयार सारांश, पाहणी प्रगती ट्रॅकिंग, आणि तात्काळ अभिप्रायासह विषय शेवटची क्विझ.",
    },
    {
      icon: BookOpen,
      badge: "सुधारित",
      title: "बंगाली, तमिळ आणि मल्याळम क्विझ",
      body: "प्रत्येक प्रशिक्षण विषयास आता BN, TA आणि ML मध्ये 3 MCQ आहेत — इंग्रजी फॉलबॅक न करता.",
    },
    {
      icon: Shield,
      badge: "सुरक्षा",
      title: "Lost & Found गोपनीयता सक्ती",
      body: "Lost & Found यादी आणि दावा कार्डांवरून सार्वजनिक संपर्क तपशील काढून टाकले.",
    },
    {
      icon: Wrench,
      badge: "दुरुस्ती",
      title: "TypeScript build दुरुस्त्या",
      body: "NodeJS namespace आणि node:fs type चुका सोडवल्या.",
    },
  ],
  bn: [
    {
      icon: Video,
      badge: "নতুন",
      title: "হজ প্রশিক্ষণ কেন্দ্র",
      body: "৬টি ভাষায় AI-জনিত সারসংক্ষেপ, দেখার অগ্রগতি ট্র্যাকিং, এবং তাৎক্ষণিক ফিডব্যাক সহ বিষয় শেষে কুইজ।",
    },
    {
      icon: BookOpen,
      badge: "উন্নত",
      title: "বাংলা, তামিল ও মালয়ালম কুইজ",
      body: "প্রতিটি প্রশিক্ষণ বিষয়ে এখন BN, TA ও ML-এ ৩টি MCQ আছে — ইংরেজি ফলব্যাক ছাড়া।",
    },
    {
      icon: Shield,
      badge: "নিরাপত্তা",
      title: "Lost & Found গোপনীয়তা শক্তিশালীকরণ",
      body: "Lost & Found তালিকা এবং দাবি কার্ড থেকে প্রকাশ্য যোগাযোগের বিবরণ সরানো হয়েছে।",
    },
    {
      icon: Wrench,
      badge: "ফিক্স",
      title: "TypeScript build ফিক্স",
      body: "NodeJS namespace এবং node:fs type ত্রুটি সমাধান করা হয়েছে।",
    },
  ],
  or: [
    {
      icon: Video,
      badge: "ନୂତନ",
      title: "ହଜ୍ଜ ତାଲିମ କେନ୍ଦ୍ର",
      body: "୬ ଭାଷାରେ AI-ନିର୍ମିତ ସାରାଂଶ, ଦେଖିବା ପ୍ରଗତି ଟ୍ରାକିଂ, ଏବଂ ତାତ୍କାଳିକ ମତାମତ ସହିତ ବିଷୟ ଶେଷ କ୍ୱିଜ୍।",
    },
    {
      icon: BookOpen,
      badge: "ଉନ୍ନତ",
      title: "ବଙ୍ଗାଳୀ, ତାମିଲ ଏବଂ ମାଲୟାଳମ କ୍ୱିଜ୍",
      body: "ପ୍ରତ୍ୟେକ ତାଲିମ ବିଷୟରେ ବର୍ତ୍ତମାନ BN, TA ଏବଂ ML ରେ ୩ଟି MCQ ଅଛି — ଇଂରାଜୀ ଫଲବ୍ୟାକ୍ ବିନା।",
    },
    {
      icon: Shield,
      badge: "ସୁରକ୍ଷା",
      title: "Lost & Found ଗୋପନୀୟତା ସୁଦୃଢ଼ୀକରଣ",
      body: "Lost & Found ତାଲିକା ଏବଂ ଦାବି କାର୍ଡରୁ ସାର୍ବଜନୀନ ଯୋଗାଯୋଗ ବିବରଣୀ ଅପସାରଣ କରାଯାଇଛି।",
    },
    {
      icon: Wrench,
      badge: "ସମାଧାନ",
      title: "TypeScript build ସମାଧାନ",
      body: "NodeJS namespace ଏବଂ node:fs type ତ୍ରୁଟିଗୁଡ଼ିକ ସମାଧାନ କରାଯାଇଛି।",
    },
  ],
  ml: [
    {
      icon: Video,
      badge: "പുതിയ",
      title: "ഹജ്ജ് പരിശീലന ഹബ്ബ്",
      body: "6 ഭാഷകളിൽ AI-സൃഷ്ടിച്ച സംഗ്രഹങ്ങൾ, കാണുന്ന പ്രഗതി ട്രാക്കിംഗ്, തൽക്ഷണ ഫീഡ്‌ബാക്കോടെ അവസാന വിഷയ ക്വിസ്.",
    },
    {
      icon: BookOpen,
      badge: "മെച്ചപ്പെടുത്തി",
      title: "ബംഗാളി, തമിഴ്, മലയാളം ക്വിസുകൾ",
      body: "ഓരോ പരിശീലന വിഷയത്തിനും ഇപ്പോൾ BN, TA, ML ഭാഷകളിൽ 3 MCQകൾ — ഇംഗ്ലീഷ് ഫോൾബാക്ക് ഇല്ലാതെ.",
    },
    {
      icon: Shield,
      badge: "സുരക്ഷ",
      title: "Lost & Found സ്വകാര്യത കർശനമാക്കൽ",
      body: "Lost & Found പട്ടികകളിലും ക്ലെയിം കാർഡുകളിലും പരസ്യമായ കോൺടാക്റ്റ് വിശദാംശങ്ങൾ നീക്കം ചെയ്തു.",
    },
    {
      icon: Wrench,
      badge: "ഫിക്‌സ്",
      title: "TypeScript build ഫിക്‌സുകൾ",
      body: "NodeJS namespace, node:fs type errors പരിഹരിച്ചു.",
    },
  ],
  pa: [
    {
      icon: Video,
      badge: "ਨਵਾਂ",
      title: "ਹੱਜ ਟ੍ਰੇਨਿੰਗ ਹੱਬ",
      body: "੬ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ AI-ਬਣਾਏ ਸਾਰ, ਵਾਚ ਪ੍ਰਗਤੀ ਟਰੈਕਿੰਗ, ਅਤੇ ਤੁਰੰਤ ਫੀਡਬੈਕ ਨਾਲ ਟਾਪਿਕ ਅੰਤ ਦੀ ਕੁਇਜ਼।",
    },
    {
      icon: BookOpen,
      badge: "ਵਧੀਆ",
      title: "ਬੰਗਾਲੀ, ਤਮਿਲ ਅਤੇ ਮਲਯਾਲਮ ਕੁਇਜ਼",
      body: "ਹਰ ਟ੍ਰੇਨਿੰਗ ਟਾਪਿਕ ਲਈ ਹੁਣ BN, TA, ML ਵਿੱਚ 3 MCQ ਹਨ — ਅੰਗਰੇਜ਼ੀ ਫਾਲਬੈਕ ਤੋਂ ਬਿਨਾਂ।",
    },
    {
      icon: Shield,
      badge: "ਸੁਰੱਖਿਆ",
      title: "Lost & Found ਪ੍ਰਾਈਵਸੀ ਹਾਰਡਨਿੰਗ",
      body: "Lost & Found ਸੂਚੀਆਂ ਅਤੇ ਦਾਅਵਾ ਕਾਰਡਾਂ ਤੋਂ ਸਾਰ੍ਹੇ ਸੰਪਰਕ ਵੇਰਵੇ ਹਟਾ ਦਿੱਤੇ ਗਏ।",
    },
    {
      icon: Wrench,
      badge: "ਫਿਕਸ",
      title: "TypeScript build ਫਿਕਸ",
      body: "NodeJS namespace ਅਤੇ node:fs type errors ਹੱਲ ਕੀਤੇ ਗਏ।",
    },
  ],
};

const ChangelogPage = () => {
  const { language, isRTL } = useLanguage();
  const t = labels[(language in labels ? language : "en") as keyof typeof labels];
  const items = entries[(language in entries ? language : "en") as keyof typeof entries];

  return (
    <>
      <SEO
        title="Changelog — HajCare"
        description="Recent updates, improvements, and security fixes for HajCare."
        path="/changelog"
        type="website"
      />
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleHeader />
        <main className="container max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-xl px-3 h-10 text-sm gap-2 -ms-3"
            >
              <Link to="/home">
                <ArrowLeft className="w-4 h-4 rtl-flip" />
                {t.backToHome}
              </Link>
            </Button>
          </div>

          <div className="space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              {t.title}
            </h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>

          <Card className="border border-border/60 shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
                  {t.heading}
                </CardTitle>
                <Badge variant="outline" className="text-xs h-7 px-3 gap-1.5 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  {t.date}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {items.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-muted/30 border border-border/40"
                >
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <entry.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm sm:text-base text-foreground">
                        {entry.title}
                      </span>
                      <Badge variant="secondary" className="text-[10px] sm:text-xs h-5 px-2 rounded-full">
                        {entry.badge}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {entry.body}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default ChangelogPage;
