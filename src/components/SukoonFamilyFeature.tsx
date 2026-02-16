import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Bell, Users, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import sukoonPosterMobile from "@/assets/sukoon-poster-mobile.webp";
import sukoonPoster from "@/assets/sukoon-poster-622.webp";
import sukoonPosterLarge from "@/assets/sukoon-tracking-poster-optimized.webp";

interface LocalizedText {
  en: string;
  ar: string;
  ur: string;
  hi: string;
  ta: string;
  te: string;
  mr: string;
  bn: string;
  or: string;
  ml: string;
  pa: string;
}

const content: {
  title: LocalizedText;
  subtitle: LocalizedText;
  tagline: LocalizedText;
  features: Array<{
    icon: React.ReactNode;
    title: LocalizedText;
    description: LocalizedText;
  }>;
  ctaFamily: LocalizedText;
  ctaView: LocalizedText;
} = {
  title: {
    en: "Sukoon Tracking System",
    ar: "نظام السكون للتتبع",
    ur: "سکون ٹریکنگ سسٹم",
    hi: "सुकून ट्रैकिंग सिस्टम",
    ta: "சுகூன் கண்காணிப்பு அமைப்பு",
    te: "సుకూన్ ట్రాకింగ్ సిస్టమ్",
    mr: "सुकून ट्रॅकिंग सिस्टम",
    bn: "সুকুন ট্র্যাকিং সিস্টেম",
    or: "ସୁକୁନ ଟ୍ରାକିଂ ସିଷ୍ଟମ",
    ml: "സുകൂൺ ട്രാക്കിംഗ് സിസ്റ്റം",
    pa: "ਸੁਕੂਨ ਟ੍ਰੈਕਿੰਗ ਸਿਸਟਮ",
  },
  subtitle: {
    en: "Haji in Saudi, Family at Peace",
    ar: "الحاج في السعودية، الأهل في طمأنينة",
    ur: "حاجی سعودی میں، گھر والے سکون میں",
    hi: "हाजी सऊदी में, परिवार सुकून में",
    ta: "ஹாஜி சவூதியில், குடும்பம் நிம்மதியில்",
    te: "హాజీ సౌదీలో, కుటుంబం ప్రశాంతంగా",
    mr: "हाजी सौदीत, कुटुंब शांततेत",
    bn: "হাজী সৌদিতে, পরিবার শান্তিতে",
    or: "ହାଜୀ ସାଉଦିରେ, ପରିବାର ଶାନ୍ତିରେ",
    ml: "ഹാജി സൗദിയിൽ, കുടുംബം സമാധാനത്തിൽ",
    pa: "ਹਾਜੀ ਸਾਊਦੀ ਵਿੱਚ, ਪਰਿਵਾਰ ਸੁਕੂਨ ਵਿੱਚ",
  },
  tagline: {
    en: "A trusted companion for the Guests of Allah",
    ar: "رفيق موثوق لضيوف الرحمن",
    ur: "اللہ کے مہمانوں کے لیے ایک قابل اعتماد ساتھی",
    hi: "अल्लाह के मेहमानों के लिए एक भरोसेमंद साथी",
    ta: "அல்லாஹ்வின் விருந்தினர்களுக்கு நம்பகமான துணை",
    te: "అల్లాహ్ అతిథులకు నమ్మకమైన సహచరుడు",
    mr: "अल्लाहच्या पाहुण्यांसाठी विश्वासार्ह साथी",
    bn: "আল্লাহর মেহমানদের জন্য বিশ্বস্ত সঙ্গী",
    or: "ଆଲ୍ଲାହଙ୍କ ଅତିଥିମାନଙ୍କ ପାଇଁ ବିଶ୍ୱସ୍ତ ସାଥୀ",
    ml: "അല്ലാഹുവിന്റെ അതിഥികൾക്ക് വിശ്വസ്ത സഹചാരി",
    pa: "ਅੱਲਾਹ ਦੇ ਮਹਿਮਾਨਾਂ ਲਈ ਭਰੋਸੇਮੰਦ ਸਾਥੀ",
  },
  features: [
    {
      icon: <MapPin className="w-4 h-4" />,
      title: {
        en: "Hajj Status Updates",
        ar: "تحديثات حالة الحج",
        ur: "حج کی حالت کی تازہ کاری",
        hi: "हज स्थिति अपडेट",
        ta: "ஹஜ் நிலை புதுப்பிப்புகள்",
        te: "హజ్ స్థితి నవీకరణలు",
        mr: "हज स्थिती अपडेट्स",
        bn: "হজ স্ট্যাটাস আপডেট",
        or: "ହଜ ସ୍ଥିତି ଅପଡେଟ",
        ml: "ഹജ്ജ് സ്റ്റാറ്റസ് അപ്ഡേറ്റുകൾ",
        pa: "ਹੱਜ ਸਥਿਤੀ ਅੱਪਡੇਟ",
      },
      description: {
        en: "Know your Haji's ritual stage",
        ar: "اعرف مرحلة شعائر حاجك",
        ur: "اپنے حاجی کے مناسک کا مرحلہ جانیں",
        hi: "अपने हाजी के मनासिक चरण जानें",
        ta: "உங்கள் ஹாஜியின் சடங்கு நிலை அறியுங்கள்",
        te: "మీ హాజీ ఆచార దశ తెలుసుకోండి",
        mr: "तुमच्या हाजींच्या विधी टप्प्याची माहिती",
        bn: "আপনার হাজীর আচার পর্যায় জানুন",
        or: "ଆପଣଙ୍କ ହାଜୀଙ୍କ ରୀତି ସ୍ତର ଜାଣନ୍ତୁ",
        ml: "നിങ്ങളുടെ ഹാജിയുടെ ആചാര ഘട്ടം അറിയുക",
        pa: "ਆਪਣੇ ਹਾਜੀ ਦੇ ਰਸਮ ਪੜਾਅ ਜਾਣੋ",
      },
    },
    {
      icon: <Bell className="w-4 h-4" />,
      title: {
        en: "Ibadat-based Alerts",
        ar: "تنبيهات عبادة",
        ur: "عبادات پر مبنی الرٹس",
        hi: "इबादत-आधारित अलर्ट",
        ta: "இபாதத் அடிப்படையிலான எச்சரிக்கைகள்",
        te: "ఇబాదత్ ఆధారిత హెచ్చరికలు",
        mr: "इबादत-आधारित अलर्ट",
        bn: "ইবাদত-ভিত্তিক সতর্কতা",
        or: "ଇବାଦତ-ଆଧାରିତ ସତର୍କତା",
        ml: "ഇബാദത്ത് അടിസ്ഥാനമാക്കിയ അലേർട്ടുകൾ",
        pa: "ਇਬਾਦਤ-ਆਧਾਰਿਤ ਅਲਰਟ",
      },
      description: {
        en: "Updates aligned with rituals",
        ar: "تحديثات متوافقة مع الشعائر",
        ur: "مناسک کے مطابق اپڈیٹس",
        hi: "रस्मों के अनुसार अपडेट",
        ta: "சடங்குகளுடன் இணைந்த புதுப்பிப்புகள்",
        te: "ఆచారాలతో అనుసంధానమైన నవీకరణలు",
        mr: "विधींशी संरेखित अपडेट्स",
        bn: "আচারের সাথে সামঞ্জস্যপূর্ণ আপডেট",
        or: "ରୀତିନୀତି ସହିତ ସମ୍ପର୍କିତ ଅପଡେଟ",
        ml: "ആചാരങ്ങളുമായി ചേർന്ന അപ്ഡേറ്റുകൾ",
        pa: "ਰਸਮਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਅੱਪਡੇਟ",
      },
    },
    {
      icon: <Phone className="w-4 h-4" />,
      title: {
        en: "Emergency Help",
        ar: "مساعدة طوارئ",
        ur: "ایمرجنسی مدد",
        hi: "आपातकालीन सहायता",
        ta: "அவசர உதவி",
        te: "ఎమర్జెన్సీ సహాయం",
        mr: "आपत्कालीन मदत",
        bn: "জরুরি সাহায্য",
        or: "ଜରୁରୀ ସାହାଯ୍ୟ",
        ml: "അടിയന്തര സഹായം",
        pa: "ਐਮਰਜੈਂਸੀ ਮਦਦ",
      },
      description: {
        en: "Quick access when needed",
        ar: "وصول سريع عند الحاجة",
        ur: "ضرورت پڑنے پر فوری رسائی",
        hi: "जरूरत पड़ने पर त्वरित पहुंच",
        ta: "தேவைப்படும்போது விரைவான அணுகல்",
        te: "అవసరమైనప్పుడు త్వరిత ప్రాప్యత",
        mr: "गरज असताना जलद प्रवेश",
        bn: "প্রয়োজনে দ্রুত অ্যাক্সেস",
        or: "ଆବଶ୍ୟକ ସମୟରେ ଦ୍ରୁତ ପ୍ରବେଶ",
        ml: "ആവശ്യമുള്ളപ്പോൾ വേഗത്തിൽ ആക്സസ്",
        pa: "ਲੋੜ ਪੈਣ 'ਤੇ ਤੇਜ਼ ਪਹੁੰਚ",
      },
    },
    {
      icon: <Shield className="w-4 h-4" />,
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
      description: {
        en: "Consent-based sharing only",
        ar: "مشاركة بموافقة فقط",
        ur: "صرف رضامندی پر مبنی شیئرنگ",
        hi: "केवल सहमति-आधारित शेयरिंग",
        ta: "ஒப்புதல் அடிப்படையிலான பகிர்வு மட்டுமே",
        te: "సమ్మతి ఆధారిత భాగస్వామ్యం మాత్రమే",
        mr: "फक्त संमती-आधारित शेअरिंग",
        bn: "শুধুমাত্র সম্মতি-ভিত্তিক শেয়ারিং",
        or: "କେବଳ ସମ୍ମତି-ଆଧାରିତ ଅଂଶୀଦାରୀ",
        ml: "സമ്മതി അടിസ്ഥാനത്തിൽ മാത്രം പങ്കിടൽ",
        pa: "ਸਿਰਫ਼ ਸਹਿਮਤੀ-ਆਧਾਰਿਤ ਸ਼ੇਅਰਿੰਗ",
      },
    },
  ],
  ctaFamily: {
    en: "Join Family Group",
    ar: "انضم لمجموعة العائلة",
    ur: "خاندانی گروپ میں شامل ہوں",
    hi: "परिवार समूह में शामिल हों",
    ta: "குடும்பக் குழுவில் சேரவும்",
    te: "కుటుంబ సమూహంలో చేరండి",
    mr: "कुटुंब गटात सामील व्हा",
    bn: "পারিবারিক গ্রুপে যোগ দিন",
    or: "ପରିବାର ଗୋଷ୍ଠୀରେ ଯୋଗ ଦିଅନ୍ତୁ",
    ml: "കുടുംബ ഗ്രൂപ്പിൽ ചേരുക",
    pa: "ਪਰਿਵਾਰਕ ਗਰੁੱਪ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
  },
  ctaView: {
    en: "View Family Status",
    ar: "عرض حالة العائلة",
    ur: "خاندان کی حالت دیکھیں",
    hi: "परिवार की स्थिति देखें",
    ta: "குடும்ப நிலையைக் காண்க",
    te: "కుటుంబ స్థితి చూడండి",
    mr: "कुटुंब स्थिती पहा",
    bn: "পারিবারিক অবস্থা দেখুন",
    or: "ପରିବାର ସ୍ଥିତି ଦେଖନ୍ତୁ",
    ml: "കുടുംബ സ്റ്റാറ്റസ് കാണുക",
    pa: "ਪਰਿਵਾਰਕ ਸਥਿਤੀ ਵੇਖੋ",
  },
};

const SukoonFamilyFeature = () => {
  const { language, isRTL } = useLanguage();
  const lang = language as keyof LocalizedText;

  const getText = (textObj: LocalizedText) => textObj[lang] || textObj.en;

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      <CardContent className="p-0">
        {/* Poster Image */}
        <div className="relative">
          <img
            src={sukoonPosterMobile}
            srcSet={`${sukoonPosterMobile} 400w, ${sukoonPoster} 622w, ${sukoonPosterLarge} 1024w`}
            sizes="(max-width: 430px) 100vw, (max-width: 672px) 100vw, 622px"
            alt="Sukoon Tracking System - Family Peace Feature"
            width={622}
            height={622}
            decoding="async"
            fetchPriority="high"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4" dir={isRTL ? "rtl" : "ltr"}>
          {/* Title & Subtitle */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary/20" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground">
                {getText(content.title)}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {getText(content.subtitle)}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  {feature.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground leading-tight">
                    {getText(feature.title)}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {getText(feature.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <p className="text-xs text-center text-muted-foreground italic">
            "{getText(content.tagline)}"
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1 gap-2" size="sm">
              <Link to="/family">
                <Users className="w-4 h-4" />
                {getText(content.ctaFamily)}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 gap-2" size="sm">
              <Link to="/hajj-progress">
                <Heart className="w-4 h-4" />
                {getText(content.ctaView)}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SukoonFamilyFeature;
