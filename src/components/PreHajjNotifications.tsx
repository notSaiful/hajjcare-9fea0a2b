import { Bell, AlertCircle, Info, CheckCircle2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface Notification {
  id: string;
  type: "info" | "warning" | "success";
  title: {
    en: string;
    ar: string;
    ur: string;
    hi: string;
    ta?: string;
    te?: string;
    mr?: string;
    bn?: string;
    or?: string;
    ml?: string;
    pa?: string;
  };
  message: {
    en: string;
    ar: string;
    ur: string;
    hi: string;
    ta?: string;
    te?: string;
    mr?: string;
    bn?: string;
    or?: string;
    ml?: string;
    pa?: string;
  };
  date: string;
  isNew?: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "info",
    title: {
      en: "Hajj 2026 Registration Open",
      ar: "تسجيل الحج 2026 مفتوح",
      ur: "حج 2026 رجسٹریشن کھل گئی",
      hi: "हज 2026 पंजीकरण खुला",
      ta: "ஹஜ் 2026 பதிவு தொடங்கியது",
      te: "హజ్ 2026 నమోదు ప్రారంభమైంది",
      mr: "हज 2026 नोंदणी सुरू",
      bn: "হজ ২০২৬ নিবন্ধন শুরু",
      or: "ହଜ ୨୦୨୬ ପଞ୍ଜିକରଣ ଆରମ୍ଭ",
      ml: "ഹജ്ജ് 2026 രജിസ്ട്രേഷൻ ആരംഭിച്ചു",
      pa: "ਹੱਜ 2026 ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਖੁੱਲ੍ਹੀ",
    },
    message: {
      en: "Online registration for Hajj 2026 is now open through Haj Committee of India portal.",
      ar: "التسجيل الإلكتروني للحج 2026 مفتوح الآن عبر بوابة لجنة الحج الهندية.",
      ur: "حج 2026 کے لیے آن لائن رجسٹریشن حج کمیٹی آف انڈیا پورٹل کے ذریعے کھل گئی ہے۔",
      hi: "हज 2026 के लिए ऑनलाइन पंजीकरण हज कमेटी ऑफ इंडिया पोर्टल के माध्यम से खुला है।",
      ta: "ஹஜ் 2026 ஆன்லைன் பதிவு இந்தியா ஹஜ் குழு போர்ட்டல் மூலம் திறந்துள்ளது.",
      te: "హజ్ 2026 ఆన్‌లైన్ నమోదు హజ్ కమిటీ ఆఫ్ ఇండియా పోర్టల్ ద్వారా ప్రారంభమైంది.",
      mr: "हज 2026 ऑनलाइन नोंदणी हज कमिटी ऑफ इंडिया पोर्टलद्वारे सुरू आहे.",
      bn: "হজ ২০২৬ অনলাইন নিবন্ধন হজ কমিটি অফ ইন্ডিয়া পোর্টালে শুরু হয়েছে।",
      or: "ହଜ ୨୦୨୬ ଅନଲାଇନ୍ ପଞ୍ଜିକରଣ ହଜ କମିଟି ଅଫ୍ ଇଣ୍ଡିଆ ପୋର୍ଟାଲରେ ଆରମ୍ଭ ହୋଇଛି।",
      ml: "ഹജ്ജ് 2026 ഓൺലൈൻ രജിസ്ട്രേഷൻ ഹജ്ജ് കമ്മിറ്റി ഓഫ് ഇന്ത്യ പോർട്ടലിൽ ആരംഭിച്ചു.",
      pa: "ਹੱਜ 2026 ਆਨਲਾਈਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਹੱਜ ਕਮੇਟੀ ਆਫ ਇੰਡੀਆ ਪੋਰਟਲ ਰਾਹੀਂ ਖੁੱਲ੍ਹੀ ਹੈ।",
    },
    date: "2026-01-15",
    isNew: true,
  },
  {
    id: "2",
    type: "warning",
    title: {
      en: "Document Submission Deadline",
      ar: "الموعد النهائي لتقديم المستندات",
      ur: "دستاویزات جمع کرانے کی آخری تاریخ",
      hi: "दस्तावेज़ जमा करने की अंतिम तिथि",
      ta: "ஆவண சமர்ப்பிப்பு காலக்கெடு",
      te: "పత్రాల సమర్పణ గడువు",
      mr: "कागदपत्रे सादर करण्याची अंतिम तारीख",
      bn: "নথি জমার শেষ তারিখ",
      or: "ଦଲିଲ ଦାଖଲ ଶେଷ ତାରିଖ",
      ml: "രേഖകൾ സമർപ്പിക്കാനുള്ള അവസാന തീയതി",
      pa: "ਦਸਤਾਵੇਜ਼ ਜਮ੍ਹਾਂ ਕਰਨ ਦੀ ਆਖਰੀ ਮਿਤੀ",
    },
    message: {
      en: "Submit all required documents to your State Haj Committee before February 28, 2026.",
      ar: "قدم جميع المستندات المطلوبة إلى لجنة الحج في ولايتك قبل 28 فبراير 2026.",
      ur: "28 فروری 2026 سے پہلے اپنی ریاستی حج کمیٹی کو تمام مطلوبہ دستاویزات جمع کرائیں۔",
      hi: "28 फरवरी 2026 से पहले अपनी राज्य हज समिति को सभी आवश्यक दस्तावेज जमा करें।",
      ta: "பிப்ரவரி 28, 2026க்கு முன் உங்கள் மாநில ஹஜ் குழுவிடம் அனைத்து ஆவணங்களையும் சமர்ப்பிக்கவும்.",
      te: "ఫిబ్రవరి 28, 2026 లోపు మీ రాష్ట్ర హజ్ కమిటీకి అన్ని అవసరమైన పత్రాలను సమర్పించండి.",
      mr: "28 फेब्रुवारी 2026 पूर्वी आपल्या राज्य हज समितीला सर्व आवश्यक कागदपत्रे सादर करा.",
      bn: "২৮ ফেব্রুয়ারি ২০২৬ এর আগে আপনার রাজ্য হজ কমিটিতে সমস্ত প্রয়োজনীয় নথি জমা দিন।",
      or: "ଫେବୃଆରୀ ୨୮, ୨୦୨୬ ପୂର୍ବରୁ ଆପଣଙ୍କ ରାଜ୍ୟ ହଜ କମିଟିକୁ ସମସ୍ତ ଆବଶ୍ୟକ ଦଲିଲ ଦାଖଲ କରନ୍ତୁ।",
      ml: "ഫെബ്രുവരി 28, 2026-ന് മുമ്പ് നിങ്ങളുടെ സ്റ്റേറ്റ് ഹജ്ജ് കമ്മിറ്റിയിൽ എല്ലാ രേഖകളും സമർപ്പിക്കുക.",
      pa: "28 ਫਰਵਰੀ 2026 ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੀ ਰਾਜ ਹੱਜ ਕਮੇਟੀ ਨੂੰ ਸਾਰੇ ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼ ਜਮ੍ਹਾਂ ਕਰੋ।",
    },
    date: "2026-01-10",
    isNew: true,
  },
  {
    id: "3",
    type: "success",
    title: {
      en: "Vaccination Camp Schedule",
      ar: "جدول مخيم التطعيم",
      ur: "ویکسینیشن کیمپ شیڈول",
      hi: "टीकाकरण शिविर कार्यक्रम",
      ta: "தடுப்பூசி முகாம் அட்டவணை",
      te: "టీకాకరణ శిబిరం షెడ్యూల్",
      mr: "लसीकरण शिबिर वेळापत्रक",
      bn: "টিকাদান ক্যাম্প সময়সূচী",
      or: "ଟୀକାକରଣ ଶିବିର ସୂଚୀ",
      ml: "വാക്സിനേഷൻ ക്യാമ്പ് ഷെഡ്യൂൾ",
      pa: "ਟੀਕਾਕਰਨ ਕੈਂਪ ਅਨੁਸੂਚੀ",
    },
    message: {
      en: "Free meningitis vaccination camps are being organized at all embarkation points. Check your State Haj Committee for dates.",
      ar: "يتم تنظيم مخيمات تطعيم مجانية ضد التهاب السحايا في جميع نقاط المغادرة. تحقق من لجنة الحج في ولايتك للتواريخ.",
      ur: "تمام روانگی مقامات پر مفت میننجائٹس ویکسینیشن کیمپ منعقد کیے جا رہے ہیں۔ تاریخوں کے لیے اپنی ریاستی حج کمیٹی سے رابطہ کریں۔",
      hi: "सभी प्रस्थान स्थलों पर मुफ्त मेनिनजाइटिस टीकाकरण शिविर आयोजित किए जा रहे हैं। तारीखों के लिए अपनी राज्य हज समिति से संपर्क करें।",
      ta: "அனைத்து புறப்பாடு புள்ளிகளிலும் இலவச மூளைக்காய்ச்சல் தடுப்பூசி முகாம்கள் நடத்தப்படுகின்றன. தேதிகளுக்கு உங்கள் மாநில ஹஜ் குழுவை சரிபார்க்கவும்.",
      te: "అన్ని బయలుదేరే స్థానాల్లో ఉచిత మెనింజైటిస్ టీకాకరణ శిబిరాలు నిర్వహించబడుతున్నాయి. తేదీల కోసం మీ రాష్ట్ర హజ్ కమిటీని సంప్రదించండి.",
      mr: "सर्व निर्गमन स्थळांवर मोफत मेनिन्जायटिस लसीकरण शिबिरे आयोजित केली जात आहेत. तारखांसाठी आपल्या राज्य हज समितीशी संपर्क साधा.",
      bn: "সমস্ত যাত্রা পয়েন্টে বিনামূল্যে মেনিনজাইটিস টিকাদান ক্যাম্প আয়োজন করা হচ্ছে। তারিখের জন্য আপনার রাজ্য হজ কমিটিতে যোগাযোগ করুন।",
      or: "ସମସ୍ତ ଯାତ୍ରା ସ୍ଥାନରେ ମାଗଣା ମେନିନଜାଇଟିସ୍ ଟୀକାକରଣ ଶିବିର ଆୟୋଜିତ ହେଉଛି। ତାରିଖ ପାଇଁ ଆପଣଙ୍କ ରାଜ୍ୟ ହଜ କମିଟି ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।",
      ml: "എല്ലാ പുറപ്പെടൽ കേന്ദ്രങ്ങളിലും സൗജന്യ മെനിഞ്ചൈറ്റിസ് വാക്സിനേഷൻ ക്യാമ്പുകൾ നടക്കുന്നു. തീയതികൾക്കായി നിങ്ങളുടെ സ്റ്റേറ്റ് ഹജ്ജ് കമ്മിറ്റിയെ ബന്ധപ്പെടുക.",
      pa: "ਸਾਰੇ ਰਵਾਨਗੀ ਸਥਾਨਾਂ 'ਤੇ ਮੁਫ਼ਤ ਮੈਨਿਨਜਾਈਟਿਸ ਟੀਕਾਕਰਨ ਕੈਂਪ ਲਗਾਏ ਜਾ ਰਹੇ ਹਨ। ਤਾਰੀਖਾਂ ਲਈ ਆਪਣੀ ਰਾਜ ਹੱਜ ਕਮੇਟੀ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    },
    date: "2026-01-05",
  },
  {
    id: "4",
    type: "info",
    title: {
      en: "Hajj Training Sessions",
      ar: "دورات تدريب الحج",
      ur: "حج تربیتی سیشن",
      hi: "हज प्रशिक्षण सत्र",
      ta: "ஹஜ் பயிற்சி அமர்வுகள்",
      te: "హజ్ శిక్షణ సెషన్లు",
      mr: "हज प्रशिक्षण सत्रे",
      bn: "হজ প্রশিক্ষণ সেশন",
      or: "ହଜ ତାଲିମ ସେସନ୍",
      ml: "ഹജ്ജ് പരിശീലന സെഷനുകൾ",
      pa: "ਹੱਜ ਸਿਖਲਾਈ ਸੈਸ਼ਨ",
    },
    message: {
      en: "Mandatory Hajj training sessions will be conducted at district level. Attendance is compulsory for all registered pilgrims.",
      ar: "ستُعقد دورات تدريب الحج الإلزامية على مستوى المنطقة. الحضور إلزامي لجميع الحجاج المسجلين.",
      ur: "ضلعی سطح پر لازمی حج تربیتی سیشن منعقد کیے جائیں گے۔ تمام رجسٹرڈ حاجیوں کے لیے حاضری لازمی ہے۔",
      hi: "जिला स्तर पर अनिवार्य हज प्रशिक्षण सत्र आयोजित किए जाएंगे। सभी पंजीकृत हाजियों के लिए उपस्थिति अनिवार्य है।",
      ta: "மாவட்ட அளவில் கட்டாய ஹஜ் பயிற்சி அமர்வுகள் நடத்தப்படும். பதிவு செய்த அனைத்து யாத்ரீகர்களுக்கும் வருகை கட்டாயம்.",
      te: "జిల్లా స్థాయిలో తప్పనిసరి హజ్ శిక్షణ సెషన్లు నిర్వహించబడతాయి. నమోదు చేసుకున్న అన్ని యాత్రికులకు హాజరు తప్పనిసరి.",
      mr: "जिल्हा स्तरावर अनिवार्य हज प्रशिक्षण सत्रे आयोजित केली जातील. सर्व नोंदणीकृत यात्रेकरूंसाठी उपस्थिती अनिवार्य आहे.",
      bn: "জেলা স্তরে বাধ্যতামূলক হজ প্রশিক্ষণ সেশন অনুষ্ঠিত হবে। সমস্ত নিবন্ধিত তীর্থযাত্রীদের উপস্থিতি বাধ্যতামূলক।",
      or: "ଜିଲ୍ଲା ସ୍ତରରେ ବାଧ୍ୟତାମୂଳକ ହଜ ତାଲିମ ସେସନ୍ ଆୟୋଜିତ ହେବ। ସମସ୍ତ ପଞ୍ଜିକୃତ ତୀର୍ଥଯାତ୍ରୀଙ୍କ ପାଇଁ ଉପସ୍ଥିତି ବାଧ୍ୟତାମୂଳକ।",
      ml: "ജില്ലാ തലത്തിൽ നിർബന്ധിത ഹജ്ജ് പരിശീലന സെഷനുകൾ നടക്കും. രജിസ്റ്റർ ചെയ്ത എല്ലാ തീർത്ഥാടകർക്കും ഹാജർ നിർബന്ധമാണ്.",
      pa: "ਜ਼ਿਲ੍ਹਾ ਪੱਧਰ 'ਤੇ ਲਾਜ਼ਮੀ ਹੱਜ ਸਿਖਲਾਈ ਸੈਸ਼ਨ ਕਰਵਾਏ ਜਾਣਗੇ। ਸਾਰੇ ਰਜਿਸਟਰਡ ਯਾਤਰੀਆਂ ਲਈ ਹਾਜ਼ਰੀ ਲਾਜ਼ਮੀ ਹੈ।",
    },
    date: "2026-01-01",
  },
];

const labels = {
  en: { title: "Notifications & Updates", newBadge: "New", count: "updates" },
  ar: { title: "الإشعارات والتحديثات", newBadge: "جديد", count: "تحديثات" },
  ur: { title: "اطلاعات اور اپڈیٹس", newBadge: "نیا", count: "اپڈیٹس" },
  hi: { title: "सूचनाएं और अपडेट", newBadge: "नया", count: "अपडेट" },
  ta: { title: "அறிவிப்புகள் & புதுப்பிப்புகள்", newBadge: "புதியது", count: "புதுப்பிப்புகள்" },
  te: { title: "నోటిఫికేషన్లు & అప్‌డేట్‌లు", newBadge: "కొత్త", count: "అప్‌డేట్‌లు" },
  mr: { title: "सूचना आणि अपडेट्स", newBadge: "नवीन", count: "अपडेट्स" },
  bn: { title: "বিজ্ঞপ্তি ও আপডেট", newBadge: "নতুন", count: "আপডেট" },
  or: { title: "ବିଜ୍ଞପ୍ତି ଏବଂ ଅପଡେଟ୍", newBadge: "ନୂଆ", count: "ଅପଡେଟ୍" },
  ml: { title: "അറിയിപ്പുകളും അപ്‌ഡേറ്റുകളും", newBadge: "പുതിയത്", count: "അപ്‌ഡേറ്റുകൾ" },
  pa: { title: "ਸੂਚਨਾਵਾਂ ਅਤੇ ਅੱਪਡੇਟ", newBadge: "ਨਵਾਂ", count: "ਅੱਪਡੇਟ" },
};

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "warning":
      return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
    default:
      return <Info className="w-4 h-4 text-primary flex-shrink-0" />;
  }
};

export const PreHajjNotifications = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const l = labels[language as keyof typeof labels] || labels.en;
  
  const newCount = NOTIFICATIONS.filter((n) => n.isNew).length;

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-primary/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-foreground">{l.title}</h2>
              <p className="text-sm text-muted-foreground">
                {NOTIFICATIONS.length} {l.count}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {newCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {newCount} {l.newBadge}
              </Badge>
            )}
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2">
            {NOTIFICATIONS.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-sm text-foreground">
                      {notification.title[language as keyof typeof notification.title] ||
                        notification.title.en}
                    </h3>
                    {notification.isNew && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary px-1.5 py-0">
                        {l.newBadge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification.message[language as keyof typeof notification.message] ||
                      notification.message.en}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground/60 flex-shrink-0">
                  {new Date(notification.date).toLocaleDateString(
                    language === "ar" || language === "ur" ? "ar-SA" : "en-IN",
                    { month: "short", day: "numeric" }
                  )}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
