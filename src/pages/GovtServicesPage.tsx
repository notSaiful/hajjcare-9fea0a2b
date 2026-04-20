import { MainLayout } from "@/components/MainLayout";
import { useLanguage, getLocalizedText, LocalizedString } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Accessibility, 
  Utensils, 
  Building, 
  BookOpen, 
  Stethoscope, 
  Bus, 
  HeartHandshake, 
  Info,
  Search,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Users,
  PhoneCall,
  HelpCircle,
  Lock
} from "lucide-react";
import { govtServicesPageContent, govtServices, GovtService } from "@/data/govtServicesContent";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wheelchair: Accessibility,
  utensils: Utensils,
  building: Building,
  "book-open": BookOpen,
  stethoscope: Stethoscope,
  bus: Bus,
  "heart-handshake": HeartHandshake,
  info: Info,
  search: Search,
  "phone-call": PhoneCall,
};

const providerLabels: Record<string, { label: LocalizedString; color: string }> = {
  india: { 
    label: { en: "India", ar: "الهند", ur: "ہندوستان", hi: "भारत" } as LocalizedString, 
    color: "bg-orange-500/10 text-orange-600 border-orange-500/30" 
  },
  saudi: { 
    label: { en: "Saudi Arabia", ar: "السعودية", ur: "سعودی عرب", hi: "सऊदी अरब" } as LocalizedString, 
    color: "bg-green-500/10 text-green-600 border-green-500/30" 
  },
  both: { 
    label: { en: "India & Saudi", ar: "الهند والسعودية", ur: "ہندوستان اور سعودی", hi: "भारत और सऊदी" } as LocalizedString, 
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30" 
  },
};

// Localized section labels
const sectionLabels = {
  eligibility: {
    en: "Who Can Use It",
    ar: "من يمكنه استخدامها",
    ur: "یہ کون استعمال کر سکتا ہے",
    hi: "इसका उपयोग कौन कर सकता है",
    ta: "யார் பயன்படுத்தலாம்",
    te: "దీనిని ఎవరు ఉపయోగించవచ్చు",
    mr: "हे कोण वापरू शकतात",
    bn: "কারা ব্যবহার করতে পারে",
    or: "ଏହା କିଏ ବ୍ୟବହାର କରିପାରିବେ",
    ml: "ആർക്ക് ഉപയോഗിക്കാം",
    pa: "ਇਸਦੀ ਵਰਤੋਂ ਕੌਣ ਕਰ ਸਕਦਾ ਹੈ",
    tr: "Kimler Kullanabilir",
    ru: "Кто может использовать",
  } as LocalizedString,
  howToAccess: {
    en: "How to Access",
    ar: "كيفية الوصول",
    ur: "کیسے حاصل کریں",
    hi: "कैसे प्राप्त करें",
    ta: "அணுகுவது எப்படி",
    te: "ఎలా యాక్సెస్ చేయాలి",
    mr: "कसे मिळवायचे",
    bn: "কীভাবে পেতে হবে",
    or: "କିପରି ପାଇବେ",
    ml: "എങ്ങനെ ലഭ്യമാക്കാം",
    pa: "ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰੀਏ",
    tr: "Nasıl Erişilir",
    ru: "Как получить доступ",
  } as LocalizedString,
  whereToFind: {
    en: "Where to Find",
    ar: "أين تجدها",
    ur: "کہاں ملے گا",
    hi: "कहाँ मिलेगा",
    ta: "எங்கே கிடைக்கும்",
    te: "ఎక్కడ కనుగొనాలి",
    mr: "कुठे मिळेल",
    bn: "কোথায় পাবেন",
    or: "କେଉଁଠି ମିଳିବ",
    ml: "എവിടെ കണ്ടെത്താം",
    pa: "ਕਿੱਥੇ ਮਿਲੇਗਾ",
    tr: "Nerede Bulunur",
    ru: "Где найти",
  } as LocalizedString,
  importantNotes: {
    en: "Important Notes",
    ar: "ملاحظات مهمة",
    ur: "اہم نوٹس",
    hi: "महत्वपूर्ण नोट्स",
    ta: "முக்கிய குறிப்புகள்",
    te: "ముఖ్యమైన గమనికలు",
    mr: "महत्त्वाच्या टिपा",
    bn: "গুরুত্বপূর্ণ নোট",
    or: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ନୋଟ୍",
    ml: "പ്രധാന കുറിപ്പുകൾ",
    pa: "ਮਹੱਤਵਪੂਰਨ ਨੋਟਸ",
    tr: "Önemli Notlar",
    ru: "Важные замечания",
  } as LocalizedString,
  needHelp: {
    en: "Need Help?",
    ar: "تحتاج مساعدة؟",
    ur: "مدد چاہیے؟",
    hi: "मदद चाहिए?",
    ta: "உதவி வேண்டுமா?",
    te: "సహాయం కావాలా?",
    mr: "मदत हवी?",
    bn: "সাহায্য দরকার?",
    or: "ସାହାଯ୍ୟ ଦରକାର?",
    ml: "സഹായം വേണോ?",
    pa: "ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    tr: "Yardım mı gerekiyor?",
    ru: "Нужна помощь?",
  } as LocalizedString,
  footerNote: {
    en: "For any assistance not covered here, please contact your building coordinator or visit the Indian Hajj Mission office.",
    ar: "لأي مساعدة غير مشمولة هنا، يرجى الاتصال بمنسق المبنى أو زيارة مكتب بعثة الحج الهندية.",
    ur: "یہاں شامل نہ ہونے والی کسی بھی مدد کے لیے، براہ کرم اپنے بلڈنگ کوآرڈینیٹر سے رابطہ کریں یا ہندوستانی حج مشن آفس جائیں۔",
    hi: "यहां शामिल न होने वाली किसी भी सहायता के लिए, कृपया अपने बिल्डिंग कोऑर्डिनेटर से संपर्क करें या भारतीय हज मिशन कार्यालय जाएं।",
    ta: "இங்கே உள்ளடங்காத எந்த உதவிக்கும், உங்கள் கட்டிட ஒருங்கிணைப்பாளரை தொடர்பு கொள்ளவும் அல்லது இந்திய ஹஜ் மிஷன் அலுவலகத்திற்கு செல்லவும்.",
    te: "ఇక్కడ చేర్చబడని ఏదైనా సహాయం కోసం, దయచేసి మీ బిల్డింగ్ కోఆర్డినేటర్‌ను సంప్రదించండి లేదా ఇండియన్ హజ్ మిషన్ కార్యాలయానికి వెళ్ళండి.",
    mr: "येथे समाविष्ट नसलेल्या कोणत्याही मदतीसाठी, कृपया आपल्या इमारत समन्वयकाशी संपर्क साधा किंवा भारतीय हज मिशन कार्यालयास भेट द्या.",
    bn: "এখানে অন্তর্ভুক্ত নয় এমন কোনো সহায়তার জন্য, অনুগ্রহ করে আপনার বিল্ডিং সমন্বয়কারীর সাথে যোগাযোগ করুন বা ভারতীয় হজ মিশন অফিসে যান।",
    or: "ଏଠାରେ ଅନ୍ତର୍ଭୁକ୍ତ ନଥିବା କୌଣସି ସହାୟତା ପାଇଁ, ଦୟାକରି ଆପଣଙ୍କ ବିଲ୍ଡିଂ କୋଆର୍ଡିନେଟରଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ କିମ୍ବା ଭାରତୀୟ ହଜ ମିଶନ୍ ଅଫିସ୍ ଯାଆନ୍ତୁ।",
    ml: "ഇവിടെ ഉൾപ്പെടാത്ത ഏതെങ്കിലും സഹായത്തിന്, നിങ്ങളുടെ ബിൽഡിംഗ് കോർഡിനേറ്ററെ ബന്ധപ്പെടുക അല്ലെങ്കിൽ ഇന്ത്യൻ ഹജ്ജ് മിഷൻ ഓഫീസ് സന്ദർശിക്കുക.",
    pa: "ਇੱਥੇ ਸ਼ਾਮਲ ਨਾ ਹੋਣ ਵਾਲੀ ਕਿਸੇ ਵੀ ਸਹਾਇਤਾ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਬਿਲਡਿੰਗ ਕੋਆਰਡੀਨੇਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ ਜਾਂ ਭਾਰਤੀ ਹੱਜ ਮਿਸ਼ਨ ਦਫ਼ਤਰ ਜਾਓ।",
    tr: "Burada yer almayan herhangi bir yardım için, lütfen bina koordinatörünüzle iletişime geçin veya Hindistan Hac Misyonu ofisini ziyaret edin.",
    ru: "Для получения любой помощи, не описанной здесь, обратитесь к координатору вашего здания или посетите офис Индийской хадж-миссии.",
  } as LocalizedString,
};

function ServiceCard({ service }: { service: GovtService }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const IconComponent = iconMap[service.icon] || Info;
  const providerInfo = providerLabels[service.provider];

  const title = getLocalizedText(service.title, language);
  const description = getLocalizedText(service.description, language);
  const eligibility = service.eligibility ? getLocalizedText(service.eligibility, language) : null;

  // Build speech text
  const speechText = `${title}. ${description}. ${eligibility ? `${getLocalizedText(sectionLabels.eligibility, language)}: ${eligibility}.` : ""} ${
    service.howToAccess.map((step) => getLocalizedText(step, language)).join(". ")
  }`;

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg leading-tight">{title}</CardTitle>
              <Badge variant="outline" className={`mt-1.5 text-xs ${providerInfo.color}`}>
                <Users className="h-3 w-3 mr-1" />
                {getLocalizedText(providerInfo.label, language)}
              </Badge>
            </div>
          </div>
          <TextToSpeechButton text={speechText} size="sm" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>

        {eligibility && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-amber-700 mb-1">
                {getLocalizedText(sectionLabels.eligibility, language)}
              </p>
              <p className="text-xs text-amber-600">{eligibility}</p>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            {getLocalizedText(sectionLabels.howToAccess, language)}
          </h4>
          <ol className="space-y-2">
            {service.howToAccess.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                <span>{getLocalizedText(step, language)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {getLocalizedText(sectionLabels.whereToFind, language)}
          </h4>
          <ul className="space-y-1.5">
            {service.locations.map((location, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{getLocalizedText(location, language)}</span>
              </li>
            ))}
          </ul>
        </div>

        {service.importantNotes && service.importantNotes.length > 0 && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1">
              <Info className="h-3 w-3" />
              {getLocalizedText(sectionLabels.importantNotes, language)}
            </p>
            <ul className="space-y-1">
              {service.importantNotes.map((note, index) => (
                <li key={index} className="text-xs text-muted-foreground">
                  • {getLocalizedText(note, language)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Information */}
        {service.contactInfo && (
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs font-medium text-blue-700 mb-2 flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5" />
              {service.contactInfo.helplineLabel ? getLocalizedText(service.contactInfo.helplineLabel, language) : "हेल्पलाइन / Helpline"}
            </p>
            <div className="space-y-2">
              {service.contactInfo.helpline && (
                <a
                  href={`tel:${service.contactInfo.helpline}`}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span className="bg-blue-500/10 px-2 py-1 rounded text-xs">24/7</span>
                  <span dir="ltr">{service.contactInfo.helpline}</span>
                </a>
              )}
              {service.contactInfo.additionalNumbers?.map((numberInfo, idx) => (
                <a
                  key={idx}
                  href={`tel:${numberInfo.number}`}
                  className="flex items-center justify-between text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span className="text-xs text-muted-foreground">{getLocalizedText(numberInfo.label, language)}</span>
                  <span dir="ltr" className="font-medium">{numberInfo.number}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Need Help Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 text-primary hover:text-primary hover:bg-primary/5"
          onClick={() => navigate('/grievances')}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          {getLocalizedText(sectionLabels.needHelp, language)}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function GovtServicesPage() {
  const { language } = useLanguage();

  const title = getLocalizedText(govtServicesPageContent.title, language);
  const subtitle = getLocalizedText(govtServicesPageContent.subtitle, language);
  const disclaimer = getLocalizedText(govtServicesPageContent.disclaimer, language);

  return (
    <MainLayout>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
              </div>
            </div>
            
            {/* Disclaimer Banner */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mt-4">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{disclaimer}</p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid gap-4">
            {govtServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border text-center">
            <p className="text-sm text-muted-foreground">
              {getLocalizedText(sectionLabels.footerNote, language)}
            </p>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
