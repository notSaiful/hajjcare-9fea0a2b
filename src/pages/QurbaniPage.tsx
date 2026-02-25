import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import QurbaniStatusTracker from "@/components/QurbaniStatusTracker";
import QurbaniPaymentFlow from "@/components/QurbaniPaymentFlow";
import OnlineQurbaniBooking from "@/components/OnlineQurbaniBooking";
import { Card, CardContent } from "@/components/ui/card";
import { Sword, BookOpen, Info } from "lucide-react";

type Lang = "en" | "ar" | "ur" | "hi" | "ta" | "te" | "mr" | "bn" | "or" | "ml" | "pa";

const labels: Record<string, Record<Lang, string>> = {
  title: {
    en: "Qurbani (Adahi)",
    ar: "الأضحية",
    ur: "قربانی (اضحی)",
    hi: "कुर्बानी (अधही)",
    ta: "குர்பானி (அதாஹி)",
    te: "ఖుర్బానీ (అదాహీ)",
    mr: "कुर्बानी (अदाही)",
    bn: "কুরবানি (আদাহী)",
    or: "କୁର୍ବାନୀ (ଅଦାହୀ)",
    ml: "ഖുർബാനി (അദാഹി)",
    pa: "ਕੁਰਬਾਨੀ (ਅਦਾਹੀ)"
  },
  subtitle: {
    en: "Your official Hajj sacrifice arrangements",
    ar: "ترتيبات ذبيحة الحج الرسمية",
    ur: "آپ کے سرکاری حج قربانی کے انتظامات",
    hi: "आपकी आधिकारिक हज कुर्बानी की व्यवस्था",
    ta: "உங்கள் அதிகாரப்பூர்வ ஹஜ் குர்பானி ஏற்பாடுகள்",
    te: "మీ అధికారిక హజ్ ఖుర్బానీ ఏర్పాట్లు",
    mr: "तुमच्या अधिकृत हज कुर्बानीच्या व्यवस्था",
    bn: "আপনার অফিসিয়াল হজ কুরবানির ব্যবস্থা",
    or: "ଆପଣଙ୍କ ସରକାରୀ ହଜ କୁର୍ବାନୀ ବ୍ୟବସ୍ଥା",
    ml: "നിങ്ങളുടെ ഔദ്യോഗിക ഹജ്ജ് ഖുർബാനി ക്രമീകരണങ്ങൾ",
    pa: "ਤੁਹਾਡੇ ਅਧਿਕਾਰਤ ਹੱਜ ਕੁਰਬਾਨੀ ਪ੍ਰਬੰਧ"
  },
  aboutTitle: {
    en: "About Qurbani in Hajj",
    ar: "عن الأضحية في الحج",
    ur: "حج میں قربانی کے بارے میں",
    hi: "हज में कुर्बानी के बारे में",
    ta: "ஹஜ்ஜில் குர்பானி பற்றி",
    te: "హజ్‌లో ఖుర్బానీ గురించి",
    mr: "हजमधील कुर्बानीबद्दल",
    bn: "হজে কুরবানি সম্পর্কে",
    or: "ହଜରେ କୁର୍ବାନୀ ବିଷୟରେ",
    ml: "ഹജ്ജിൽ ഖുർബാനിയെ കുറിച്ച്",
    pa: "ਹੱਜ ਵਿੱਚ ਕੁਰਬਾਨੀ ਬਾਰੇ"
  },
  aboutContent: {
    en: "After stoning Jamrat al-Aqaba on the 10th of Dhul Hijjah, pilgrims offer an animal sacrifice (Qurbani/Hady). This is typically arranged by your Hajj operator through official channels. The sacrifice marks an important milestone in the Hajj rituals.",
    ar: "بعد رمي جمرة العقبة في العاشر من ذي الحجة، يقدم الحجاج أضحية (الهدي). عادة ما يتم ترتيب هذا من قبل منظم الحج عبر القنوات الرسمية. تمثل الذبيحة معلماً مهماً في مناسك الحج.",
    ur: "10 ذی الحجہ کو جمرہ العقبہ پر رمی کے بعد حجاج جانور کی قربانی (ہدی) دیتے ہیں۔ یہ عام طور پر آپ کے حج آپریٹر کی طرف سے سرکاری ذرائع سے کیا جاتا ہے۔ قربانی حج کے مناسک میں ایک اہم سنگ میل ہے۔",
    hi: "10 ज़िल्हिज्जा को जमरात अल-अक़बा पर रमी के बाद, हाजी पशु बलि (कुर्बानी/हद्य) देते हैं। यह आमतौर पर आपके हज ऑपरेटर द्वारा आधिकारिक चैनलों के माध्यम से व्यवस्थित किया जाता है। कुर्बानी हज के अनुष्ठानों में एक महत्वपूर्ण मील का पत्थर है।",
    ta: "துல் ஹிஜ்ஜா 10-ம் நாளில் ஜம்ரத் அல்-அகபா கல் எறிந்த பிறகு, யாத்ரீகர்கள் குர்பானி (ஹத்ய்) செய்கிறார்கள். இது உங்கள் ஹஜ் ஆபரேட்டரால் அதிகாரப்பூர்வ சேனல்கள் வழியாக ஏற்பாடு செய்யப்படுகிறது.",
    te: "దుల్ హిజ్జా 10వ రోజు జమ్రత్ అల్-అఖబాపై రాళ్లు విసిరిన తర్వాత, యాత్రికులు ఖుర్బానీ (హద్య్) ఇస్తారు. ఇది సాధారణంగా మీ హజ్ ఆపరేటర్ ద్వారా అధికారిక ఛానెల్‌ల ద్వారా ఏర్పాటు చేయబడుతుంది.",
    mr: "जिल्हिज्जाच्या 10 व्या दिवशी जमरात अल-अकबा येथे दगडफेक केल्यानंतर, हाजी कुर्बानी (हद्य) करतात. हे सहसा तुमच्या हज ऑपरेटरद्वारे अधिकृत चॅनेलद्वारे व्यवस्थित केले जाते.",
    bn: "জিলহজ্জের 10 তারিখে জামারাত আল-আকাবায় পাথর মারার পর, হাজীরা কুরবানি (হাদ্য) দেন। এটি সাধারণত আপনার হজ অপারেটর দ্বারা অফিসিয়াল চ্যানেলের মাধ্যমে আয়োজিত হয়।",
    or: "ଜିଲହଜ 10 ତାରିଖରେ ଜମରାତ ଅଲ-ଅକାବାରେ ପଥର ମାରିବା ପରେ, ହାଜୀମାନେ କୁର୍ବାନୀ (ହଦ୍ୟ) ଦିଅନ୍ତି। ଏହା ସାଧାରଣତଃ ଆପଣଙ୍କ ହଜ ଅପରେଟର ସରକାରୀ ଚ୍ୟାନେଲ ମାଧ୍ୟମରେ ବ୍ୟବସ୍ଥା କରନ୍ତି।",
    ml: "ദുൽഹിജ്ജ 10-ന് ജമ്രത്ത് അൽ-അഖബയിൽ കല്ലെറിഞ്ഞ ശേഷം, ഹാജിമാർ ഖുർബാനി (ഹദ്യ്) നൽകുന്നു. ഇത് സാധാരണയായി നിങ്ങളുടെ ഹജ്ജ് ഓപ്പറേറ്റർ ഔദ്യോഗിക ചാനലുകളിലൂടെ ക്രമീകരിക്കുന്നു.",
    pa: "ਜ਼ਿਲਹਿੱਜਾ ਦੀ 10 ਤਾਰੀਖ਼ ਨੂੰ ਜਮਰਾਤ ਅਲ-ਅਕ਼ਬਾ 'ਤੇ ਪੱਥਰ ਮਾਰਨ ਤੋਂ ਬਾਅਦ, ਹਾਜੀ ਕੁਰਬਾਨੀ (ਹਦਯ) ਦਿੰਦੇ ਹਨ। ਇਹ ਆਮ ਤੌਰ 'ਤੇ ਤੁਹਾਡੇ ਹੱਜ ਆਪਰੇਟਰ ਦੁਆਰਾ ਅਧਿਕਾਰਤ ਚੈਨਲਾਂ ਰਾਹੀਂ ਪ੍ਰਬੰਧ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"
  },
  importantNote: {
    en: "Important Note",
    ar: "ملاحظة مهمة",
    ur: "اہم نوٹ",
    hi: "महत्वपूर्ण नोट",
    ta: "முக்கிய குறிப்பு",
    te: "ముఖ్యమైన గమనిక",
    mr: "महत्त्वाची सूचना",
    bn: "গুরুত্বপূর্ণ নোট",
    or: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସୂଚନା",
    ml: "പ്രധാന കുറിപ്പ്",
    pa: "ਮਹੱਤਵਪੂਰਨ ਨੋਟ"
  },
  noteContent: {
    en: "Do not shave or trim your hair until your Qurbani is confirmed as completed. Maintain the proper sequence of rituals. If you are unsure, please consult your Hajj group leader.",
    ar: "لا تحلق أو تقصر شعرك حتى يتم تأكيد إتمام أضحيتك. حافظ على الترتيب الصحيح للمناسك. إذا لم تكن متأكداً، يرجى استشارة قائد مجموعة الحج.",
    ur: "اپنی قربانی کی تصدیق تک بال نہ منڈوائیں اور نہ چھوٹے کروائیں۔ مناسک کی صحیح ترتیب برقرار رکھیں۔ اگر آپ کو یقین نہیں ہے تو براہ کرم اپنے حج گروپ لیڈر سے مشورہ کریں۔",
    hi: "अपनी कुर्बानी की पुष्टि होने तक बाल न मुंडवाएं या न काटें। अनुष्ठानों का उचित क्रम बनाए रखें। यदि आप अनिश्चित हैं, तो कृपया अपने हज समूह के नेता से परामर्श करें।",
    ta: "குர்பானி முடிந்ததாக உறுதி செய்யப்படும் வரை தலை முடியை எடுக்கவோ வெட்டவோ வேண்டாம். சடங்குகளின் சரியான வரிசையை பின்பற்றுங்கள்.",
    te: "ఖుర్బానీ పూర్తయినట్లు నిర్ధారించబడే వరకు జుట్టు గీయవద్దు లేదా కత్తిరించవద్దు. ఆచారాల సరైన క్రమాన్ని పాటించండి.",
    mr: "कुर्बानी पूर्ण झाल्याची पुष्टी होईपर्यंत केस कापू किंवा मुंडन करू नका. विधींचा योग्य क्रम पाळा.",
    bn: "কুরবানি সম্পন্ন হওয়ার নিশ্চিতকরণ পর্যন্ত মাথা মুণ্ডন বা চুল ছোট করবেন না। আচারের সঠিক ক্রম বজায় রাখুন।",
    or: "କୁର୍ବାନୀ ସମ୍ପୂର୍ଣ୍ଣ ହେବା ନିଶ୍ଚିତ ନହେବା ପର୍ଯ୍ୟନ୍ତ ମୁଣ୍ଡନ କରନ୍ତୁ ନାହିଁ। ଆଚାରର ସଠିକ କ୍ରମ ବଜାୟ ରଖନ୍ତୁ।",
    ml: "ഖുർബാനി പൂർത്തിയായതായി സ്ഥിരീകരിക്കുന്നത് വരെ മുടി കളയുകയോ വെട്ടുകയോ ചെയ്യരുത്. ആചാരങ്ങളുടെ ശരിയായ ക്രമം പാലിക്കുക.",
    pa: "ਕੁਰਬਾਨੀ ਪੂਰੀ ਹੋਣ ਦੀ ਪੁਸ਼ਟੀ ਹੋਣ ਤੱਕ ਵਾਲ ਨਾ ਮੁੰਡਾਓ ਅਤੇ ਨਾ ਕਟਵਾਓ। ਰੀਤੀ ਰਿਵਾਜਾਂ ਦਾ ਸਹੀ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ।"
  }
};

const SUPPORTED_LANGS: Lang[] = ["en", "ar", "ur", "hi", "ta", "te", "mr", "bn", "or", "ml", "pa"];

const QurbaniPage = () => {
  const { language, isRTL } = useLanguage();
  
  const lang: Lang = SUPPORTED_LANGS.includes(language as Lang) ? (language as Lang) : "en";

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

        {/* Online Qurbani Booking */}
        <OnlineQurbaniBooking />

        {/* Payment Flow */}
        <QurbaniPaymentFlow />

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
