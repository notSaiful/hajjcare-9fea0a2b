import { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, CreditCard, Lock, HeartHandshake } from "lucide-react";

const content = {
  title: {
    en: "How HajjCare Helps You",
    ar: "كيف يساعدك حج كير",
    ur: "حج کیئر آپ کی مدد کیسے کرتا ہے",
    hi: "HajjCare आपकी कैसे मदद करता है",
    ta: "HajjCare உங்களுக்கு எவ்வாறு உதவுகிறது",
    te: "HajjCare మీకు ఎలా సహాయపడుతుంది",
    mr: "HajjCare तुमची कशी मदत करते",
    bn: "HajjCare কীভাবে আপনাকে সাহায্য করে",
    or: "HajjCare ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରେ",
    ml: "HajjCare നിങ്ങളെ എങ്ങനെ സഹായിക്കുന്നു",
    pa: "HajjCare ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰਦਾ ਹੈ",
  },
  subtitle: {
    en: "A trusted digital companion for your sacred journey",
    ar: "رفيق رقمي موثوق لرحلتك المقدسة",
    ur: "آپ کے مقدس سفر کے لیے ایک قابل اعتماد ڈیجیٹل ساتھی",
    hi: "आपकी पवित्र यात्रा के लिए एक विश्वसनीय डिजिटल साथी",
    ta: "உங்கள் புனித பயணத்திற்கான நம்பகமான டிஜிட்டல் துணை",
    te: "మీ పవిత్ర ప్రయాణానికి నమ్మకమైన డిజిటల్ సహచరుడు",
    mr: "तुमच्या पवित्र प्रवासासाठी विश्वासार्ह डिजिटल साथी",
    bn: "আপনার পবিত্র যাত্রার জন্য বিশ্বস্ত ডিজিটাল সঙ্গী",
    or: "ଆପଣଙ୍କ ପବିତ୍ର ଯାତ୍ରା ପାଇଁ ବିଶ୍ୱସ୍ତ ଡିଜିଟାଲ ସାଥୀ",
    ml: "നിങ്ങളുടെ പുണ്യ യാത്രയ്ക്കുള്ള വിശ്വസ്ത ഡിജിറ്റൽ സഹചാരി",
    pa: "ਤੁਹਾਡੀ ਪਵਿੱਤਰ ਯਾਤਰਾ ਲਈ ਭਰੋਸੇਮੰਦ ਡਿਜੀਟਲ ਸਾਥੀ",
  },
  notDonation: {
    en: "This is a Service, Not a Donation",
    ar: "هذه خدمة، وليست تبرعاً",
    ur: "یہ ایک سروس ہے، چندہ نہیں",
    hi: "यह एक सेवा है, दान नहीं",
    ta: "இது ஒரு சேவை, நன்கொடை அல்ல",
    te: "ఇది సేవ, విరాళం కాదు",
    mr: "ही सेवा आहे, देणगी नाही",
    bn: "এটি একটি সেবা, দান নয়",
    or: "ଏହା ଏକ ସେବା, ଦାନ ନୁହେଁ",
    ml: "ഇത് ഒരു സേവനമാണ്, സംഭാവനയല്ല",
    pa: "ਇਹ ਸੇਵਾ ਹੈ, ਦਾਨ ਨਹੀਂ",
  },
  notDonationDesc: {
    en: "HajjCare charges an optional service fee for premium digital guidance and support tools. We do not accept donations, charity, or zakat.",
    ar: "يتقاضى حج كير رسوم خدمة اختيارية مقابل الإرشاد الرقمي المتميز وأدوات الدعم. نحن لا نقبل التبرعات أو الصدقات أو الزكاة.",
    ur: "حج کیئر پریمیم ڈیجیٹل رہنمائی اور سپورٹ ٹولز کے لیے ایک اختیاری سروس فیس لیتا ہے۔ ہم چندہ، صدقہ، یا زکوٰۃ قبول نہیں کرتے۔",
    hi: "HajjCare प्रीमियम डिजिटल मार्गदर्शन और सहायता उपकरणों के लिए एक वैकल्पिक सेवा शुल्क लेता है। हम दान, चैरिटी या ज़कात स्वीकार नहीं करते।",
    ta: "HajjCare பிரீமியம் டிஜிட்டல் வழிகாட்டுதல் மற்றும் ஆதரவு கருவிகளுக்கு விருப்ப சேவைக் கட்டணம் வசூலிக்கிறது. நாங்கள் நன்கொடை, தர்மம் அல்லது ஜக்காத் ஏற்றுக்கொள்வதில்லை.",
    te: "HajjCare ప్రీమియం డిజిటల్ మార్గదర్శకత్వం మరియు మద్దతు సాధనాల కోసం ఐచ్ఛిక సేవా రుసుము వసూలు చేస్తుంది. మేము విరాళాలు, దానం లేదా జకాత్ అంగీకరించము.",
    mr: "HajjCare प्रीमियम डिजिटल मार्गदर्शन आणि समर्थन साधनांसाठी पर्यायी सेवा शुल्क आकारते. आम्ही देणग्या, दान किंवा जकात स्वीकारत नाही.",
    bn: "HajjCare প্রিমিয়াম ডিজিটাল গাইডেন্স এবং সাপোর্ট টুলসের জন্য একটি ঐচ্ছিক সার্ভিস ফি নেয়। আমরা দান, চ্যারিটি বা জাকাত গ্রহণ করি না।",
    or: "HajjCare ପ୍ରିମିୟମ ଡିଜିଟାଲ ଗାଇଡେନ୍ସ ଏବଂ ସପୋର୍ଟ ଟୁଲ୍ସ ପାଇଁ ଏକ ଐଚ୍ଛିକ ସେବା ଶୁଳ୍କ ଆଦାୟ କରେ। ଆମେ ଦାନ, ଚାରିଟି କିମ୍ବା ଜାକାତ ଗ୍ରହଣ କରୁନାହୁଁ।",
    ml: "HajjCare പ്രീമിയം ഡിജിറ്റൽ മാർഗനിർദേശത്തിനും പിന്തുണാ ഉപകരണങ്ങൾക്കും ഐച്ഛിക സേവന ഫീസ് ഈടാക്കുന്നു. ഞങ്ങൾ സംഭാവനകൾ, ദാനം അല്ലെങ്കിൽ സക്കാത്ത് സ്വീകരിക്കുന്നില്ല.",
    pa: "HajjCare ਪ੍ਰੀਮੀਅਮ ਡਿਜੀਟਲ ਮਾਰਗਦਰਸ਼ਨ ਅਤੇ ਸਹਾਇਤਾ ਸਾਧਨਾਂ ਲਈ ਵਿਕਲਪਿਕ ਸੇਵਾ ਫੀਸ ਲੈਂਦਾ ਹੈ। ਅਸੀਂ ਦਾਨ, ਚੈਰਿਟੀ ਜਾਂ ਜ਼ਕਾਤ ਸਵੀਕਾਰ ਨਹੀਂ ਕਰਦੇ।",
  },
  features: [
    {
      icon: Shield,
      title: {
        en: "Digital Guidance",
        ar: "إرشاد رقمي",
        ur: "ڈیجیٹل رہنمائی",
        hi: "डिजिटल मार्गदर्शन",
        ta: "டிஜிட்டல் வழிகாட்டுதல்",
        te: "డిజిటల్ మార్గదర్శకత్వం",
        mr: "डिजिटल मार्गदर्शन",
        bn: "ডিজিটাল গাইডেন্স",
        or: "ଡିଜିଟାଲ ଗାଇଡେନ୍ସ",
        ml: "ഡിജിറ്റൽ മാർഗനിർദേശം",
        pa: "ਡਿਜੀਟਲ ਮਾਰਗਦਰਸ਼ਨ",
      },
      desc: {
        en: "Step-by-step rituals, duas & checklists",
        ar: "الشعائر والأدعية وقوائم المراجعة خطوة بخطوة",
        ur: "قدم بہ قدم مناسک، دعائیں اور چیک لسٹ",
        hi: "चरण-दर-चरण अनुष्ठान, दुआएं और चेकलिस्ट",
        ta: "படிப்படியான சடங்குகள், துஆக்கள் & சரிபார்ப்புப் பட்டியல்கள்",
        te: "దశల వారీగా ఆచారాలు, దుఆలు & చెక్‌లిస్ట్‌లు",
        mr: "चरण-दर-चरण विधी, दुआ आणि चेकलिस्ट",
        bn: "ধাপে ধাপে আচার, দোয়া ও চেকলিস্ট",
        or: "ଧାପେ ଧାପେ ରୀତିନୀତି, ଦୁଆ ଓ ଚେକ୍‌ଲିଷ୍ଟ",
        ml: "ഘട്ടം ഘട്ടമായി ആചാരങ്ങൾ, ദുആകൾ & ചെക്ക്‌ലിസ്റ്റുകൾ",
        pa: "ਕਦਮ-ਦਰ-ਕਦਮ ਰਸਮਾਂ, ਦੁਆਵਾਂ ਅਤੇ ਚੈੱਕਲਿਸਟਾਂ",
      },
    },
    {
      icon: CreditCard,
      title: {
        en: "Secure Payments",
        ar: "مدفوعات آمنة",
        ur: "محفوظ ادائیگی",
        hi: "सुरक्षित भुगतान",
        ta: "பாதுகாப்பான கட்டணங்கள்",
        te: "సురక్షిత చెల్లింపులు",
        mr: "सुरक्षित पेमेंट",
        bn: "নিরাপদ পেমেন্ট",
        or: "ସୁରକ୍ଷିତ ପେମେଣ୍ଟ",
        ml: "സുരക്ഷിത പേയ്‌മെന്റുകൾ",
        pa: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ",
      },
      desc: {
        en: "Razorpay-powered, RBI compliant",
        ar: "مدعوم من رازورباي، متوافق مع RBI",
        ur: "Razorpay سے چلتا ہے، RBI کے مطابق",
        hi: "Razorpay द्वारा संचालित, RBI अनुपालन",
        ta: "Razorpay ஆதரவு, RBI இணக்கமான",
        te: "Razorpay ఆధారిత, RBI అనుకూలం",
        mr: "Razorpay द्वारे समर्थित, RBI अनुरूप",
        bn: "Razorpay চালিত, RBI সম্মত",
        or: "Razorpay ଦ୍ୱାରା ସଂଚାଳିତ, RBI ଅନୁପାଳନ",
        ml: "Razorpay പവർഡ്, RBI കംപ്ലയന്റ്",
        pa: "Razorpay ਦੁਆਰਾ ਸੰਚਾਲਿਤ, RBI ਅਨੁਕੂਲ",
      },
    },
    {
      icon: Lock,
      title: {
        en: "Privacy First",
        ar: "الخصوصية أولاً",
        ur: "پرائیویسی سب سے پہلے",
        hi: "गोपनीयता पहले",
        ta: "தனியுரிமை முதலில்",
        te: "ప్రైవసీ మొదట",
        mr: "गोपनीयता प्रथम",
        bn: "গোপনীয়তা প্রথম",
        or: "ଗୋପନୀୟତା ପ୍ରଥମ",
        ml: "സ്വകാര്യത ആദ്യം",
        pa: "ਪ੍ਰਾਈਵੇਸੀ ਪਹਿਲਾਂ",
      },
      desc: {
        en: "Your data stays private & secure",
        ar: "بياناتك تبقى خاصة وآمنة",
        ur: "آپ کا ڈیٹا نجی اور محفوظ رہتا ہے",
        hi: "आपका डेटा निजी और सुरक्षित रहता है",
        ta: "உங்கள் தரவு தனிப்பட்டதாகவும் பாதுகாப்பானதாகவும் இருக்கும்",
        te: "మీ డేటా ప్రైవేట్ & సురక్షితంగా ఉంటుంది",
        mr: "तुमचा डेटा खाजगी आणि सुरक्षित राहतो",
        bn: "আপনার ডেটা ব্যক্তিগত ও নিরাপদ থাকে",
        or: "ଆପଣଙ୍କ ଡାଟା ବ୍ୟକ୍ତିଗତ ଓ ସୁରକ୍ଷିତ ରହେ",
        ml: "നിങ്ങളുടെ ഡാറ്റ സ്വകാര്യവും സുരക്ഷിതവുമായി തുടരുന്നു",
        pa: "ਤੁਹਾਡਾ ਡਾਟਾ ਨਿੱਜੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦਾ ਹੈ",
      },
    },
    {
      icon: HeartHandshake,
      title: {
        en: "24/7 Support",
        ar: "دعم على مدار الساعة",
        ur: "24/7 سپورٹ",
        hi: "24/7 सहायता",
        ta: "24/7 ஆதரவு",
        te: "24/7 మద్దతు",
        mr: "24/7 समर्थन",
        bn: "24/7 সহায়তা",
        or: "24/7 ସମର୍ଥନ",
        ml: "24/7 പിന്തുണ",
        pa: "24/7 ਸਹਾਇਤਾ",
      },
      desc: {
        en: "AI help + emergency contacts",
        ar: "مساعدة AI + جهات اتصال الطوارئ",
        ur: "AI مدد + ایمرجنسی رابطے",
        hi: "AI मदद + आपातकालीन संपर्क",
        ta: "AI உதவி + அவசர தொடர்புகள்",
        te: "AI సహాయం + అత్యవసర సంప్రదింపులు",
        mr: "AI मदत + आपत्कालीन संपर्क",
        bn: "AI সাহায্য + জরুরি যোগাযোগ",
        or: "AI ସାହାଯ୍ୟ + ଜରୁରୀ ସମ୍ପର୍କ",
        ml: "AI സഹായം + അടിയന്തര കോൺടാക്റ്റുകൾ",
        pa: "AI ਮਦਦ + ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ",
      },
    },
  ],
};

export const TrustSection = memo(function TrustSection() {
  const { language, isRTL } = useLanguage();
  const lang = language as keyof typeof content.title;

  const getText = <T extends Record<string, string>>(obj: T) => obj[lang] || obj.en;

  return (
    <section
      className="bg-card border border-border/60 rounded-2xl shadow-card overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="text-center p-5 sm:p-6 pb-4 space-y-1.5">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          {getText(content.title)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {getText(content.subtitle)}
        </p>
      </div>

      {/* Features Grid */}
      <div className="px-5 sm:px-6 pb-4 grid grid-cols-2 gap-3">
        {content.features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5">
                <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {getText(feature.title)}
              </p>
              <p className="text-xs text-muted-foreground leading-snug mt-1">
                {getText(feature.desc)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Not Donation Notice */}
      <div className="mx-5 sm:mx-6 mb-5 bg-[hsl(var(--sacred-gold-soft))] border border-[hsl(var(--sacred-gold))]/20 rounded-xl p-4">
        <p className="text-sm font-semibold text-foreground mb-1.5">
          {getText(content.notDonation)}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {getText(content.notDonationDesc)}
        </p>
      </div>
    </section>
  );
});
