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
    type: "warning",
    title: {
      en: "Hajj 2026 Final Payment Deadline",
      ar: "الموعد النهائي لدفع الحج 2026",
      ur: "حج 2026 آخری ادائیگی کی تاریخ",
      hi: "हज 2026 अंतिम भुगतान की तारीख",
      ta: "ஹஜ் 2026 இறுதி கட்டணம் செலுத்தும் தேதி",
      te: "హజ్ 2026 చివరి చెల్లింపు గడువు",
      mr: "हज 2026 अंतिम भरणा तारीख",
      bn: "হজ ২০২৬ চূড়ান্ত পেমেন্টের তারিখ",
      or: "ହଜ ୨୦୨୬ ଶେଷ ଦେୟ ତାରିଖ",
      ml: "ഹജ്ജ് 2026 അവസാന പേയ്‌മെന്റ് തീയതി",
      pa: "ਹੱਜ 2026 ਅੰਤਿਮ ਭੁਗਤਾਨ ਮਿਤੀ",
    },
    message: {
      en: "Final Hajj payment of ₹3,21,000 must be deposited by March 15, 2026. Pay via Haj Committee portal or designated bank branches.",
      ar: "يجب إيداع دفعة الحج النهائية البالغة ₹3,21,000 بحلول 15 مارس 2026.",
      ur: "حج کی آخری ادائیگی ₹3,21,000 مارچ 15، 2026 تک جمع کروائیں۔ حج کمیٹی پورٹل یا مقررہ بینک شاخوں سے ادائیگی کریں۔",
      hi: "हज की अंतिम राशि ₹3,21,000 मार्च 15, 2026 तक जमा करें। हज कमेटी पोर्टल या निर्धारित बैंक शाखाओं से भुगतान करें।",
      ta: "₹3,21,000 இறுதி ஹஜ் கட்டணம் மார்ச் 15, 2026க்குள் செலுத்தவும்.",
      te: "₹3,21,000 చివరి హజ్ చెల్లింపు మార్చి 15, 2026 లోపు చెల్లించండి.",
      mr: "₹3,21,000 अंतिम हज भरणा 15 मार्च 2026 पूर्वी जमा करा.",
      bn: "₹3,21,000 চূড়ান্ত হজ পেমেন্ট ১৫ মার্চ ২০২৬ এর মধ্যে জমা দিন।",
      or: "₹3,21,000 ଶେଷ ହଜ ଦେୟ ମାର୍ଚ୍ ୧୫, ୨୦୨୬ ମଧ୍ୟରେ ଜମା କରନ୍ତୁ।",
      ml: "₹3,21,000 അവസാന ഹജ്ജ് പേയ്‌മെന്റ് മാർച്ച് 15, 2026-ന് മുമ്പ് അടയ്ക്കുക.",
      pa: "₹3,21,000 ਅੰਤਿਮ ਹੱਜ ਭੁਗਤਾਨ 15 ਮਾਰਚ 2026 ਤੱਕ ਜਮ੍ਹਾਂ ਕਰੋ।",
    },
    date: "2026-02-08",
    isNew: true,
  },
  {
    id: "2",
    type: "info",
    title: {
      en: "Passport Collection & Visa Stamping",
      ar: "استلام جواز السفر وختم التأشيرة",
      ur: "پاسپورٹ وصولی اور ویزا سٹیمپنگ",
      hi: "पासपोर्ट संग्रह और वीजा स्टैम्पिंग",
      ta: "பாஸ்போர்ட் சேகரிப்பு & விசா முத்திரை",
      te: "పాస్‌పోర్ట్ సేకరణ & వీసా స్టాంపింగ్",
      mr: "पासपोर्ट संकलन आणि व्हिसा स्टॅम्पिंग",
      bn: "পাসপোর্ট সংগ্রহ ও ভিসা স্ট্যাম্পিং",
      or: "ପାସପୋର୍ଟ ସଂଗ୍ରହ ଏବଂ ଭିସା ଷ୍ଟାମ୍ପିଂ",
      ml: "പാസ്‌പോർട്ട് ശേഖരണവും വിസ സ്റ്റാമ്പിംഗും",
      pa: "ਪਾਸਪੋਰਟ ਇਕੱਤਰ ਅਤੇ ਵੀਜ਼ਾ ਸਟੈਂਪਿੰਗ",
    },
    message: {
      en: "Submit passports to your State Haj Committee by February 20, 2026 for Saudi visa processing. Ensure passport validity till December 2026.",
      ar: "قدم جوازات السفر إلى لجنة الحج في ولايتك بحلول 20 فبراير 2026.",
      ur: "سعودی ویزا پروسیسنگ کے لیے 20 فروری 2026 تک اپنے ریاستی حج کمیٹی کو پاسپورٹ جمع کرائیں۔ دسمبر 2026 تک پاسپورٹ کی درستگی یقینی بنائیں۔",
      hi: "सऊदी वीजा प्रोसेसिंग के लिए 20 फरवरी 2026 तक अपनी राज्य हज समिति को पासपोर्ट जमा करें। दिसंबर 2026 तक पासपोर्ट की वैधता सुनिश्चित करें।",
      ta: "சவூதி விசா செயலாக்கத்திற்கு பிப்ரவரி 20, 2026க்குள் பாஸ்போர்ட் சமர்ப்பிக்கவும்.",
      te: "సౌదీ వీసా ప్రాసెసింగ్ కోసం ఫిబ్రవరి 20, 2026 లోపు పాస్‌పోర్ట్ సమర్పించండి.",
      mr: "सौदी व्हिसा प्रक्रियेसाठी 20 फेब्रुवारी 2026 पूर्वी पासपोर्ट सादर करा.",
      bn: "সৌদি ভিসা প্রসেসিংয়ের জন্য ২০ ফেব্রুয়ারি ২০২৬ এর মধ্যে পাসপোর্ট জমা দিন।",
      or: "ସାଉଦି ଭିସା ପ୍ରକ୍ରିୟାକରଣ ପାଇଁ ଫେବୃଆରୀ ୨୦, ୨୦୨୬ ମଧ୍ୟରେ ପାସପୋର୍ଟ ଦାଖଲ କରନ୍ତୁ।",
      ml: "സൗദി വിസ പ്രോസസ്സിംഗിനായി ഫെബ്രുവരി 20, 2026-ന് മുമ്പ് പാസ്‌പോർട്ട് സമർപ്പിക്കുക.",
      pa: "ਸਾਊਦੀ ਵੀਜ਼ਾ ਪ੍ਰੋਸੈਸਿੰਗ ਲਈ 20 ਫਰਵਰੀ 2026 ਤੱਕ ਪਾਸਪੋਰਟ ਜਮ੍ਹਾਂ ਕਰੋ।",
    },
    date: "2026-02-05",
    isNew: true,
  },
  {
    id: "3",
    type: "success",
    title: {
      en: "Hajj Training – March 2026",
      ar: "تدريب الحج – مارس 2026",
      ur: "حج تربیت – مارچ 2026",
      hi: "हज प्रशिक्षण – मार्च 2026",
      ta: "ஹஜ் பயிற்சி – மார்ச் 2026",
      te: "హజ్ శిక్షణ – మార్చి 2026",
      mr: "हज प्रशिक्षण – मार्च 2026",
      bn: "হজ প্রশিক্ষণ – মার্চ ২০২৬",
      or: "ହଜ ତାଲିମ – ମାର୍ଚ୍ ୨୦୨୬",
      ml: "ഹജ്ജ് പരിശീലനം – മാർച്ച് 2026",
      pa: "ਹੱਜ ਸਿਖਲਾਈ – ਮਾਰਚ 2026",
    },
    message: {
      en: "District-level Hajj training sessions start March 1-20, 2026. Attendance is mandatory. Bring your Hajj ID card and passport copy.",
      ar: "تبدأ دورات تدريب الحج على مستوى المنطقة من 1 إلى 20 مارس 2026. الحضور إلزامي.",
      ur: "ضلعی سطح پر حج تربیتی سیشن 1-20 مارچ 2026 سے شروع ہوں گے۔ حاضری لازمی ہے۔ اپنا حج شناختی کارڈ اور پاسپورٹ کاپی لائیں۔",
      hi: "जिला स्तर पर हज प्रशिक्षण 1-20 मार्च 2026 से शुरू। उपस्थिति अनिवार्य। अपना हज ID कार्ड और पासपोर्ट कॉपी लाएं।",
      ta: "மாவட்ட அளவில் ஹஜ் பயிற்சி மார்ச் 1-20, 2026 தொடங்குகிறது. வருகை கட்டாயம்.",
      te: "జిల్లా స్థాయి హజ్ శిక్షణ మార్చి 1-20, 2026 ప్రారంభమవుతుంది. హాజరు తప్పనిసరి.",
      mr: "जिल्हा स्तरावर हज प्रशिक्षण 1-20 मार्च 2026 पासून सुरू. उपस्थिती अनिवार्य.",
      bn: "জেলা স্তরে হজ প্রশিক্ষণ ১-২০ মার্চ ২০২৬ শুরু। উপস্থিতি বাধ্যতামূলক।",
      or: "ଜିଲ୍ଲା ସ୍ତରରେ ହଜ ତାଲିମ ମାର୍ଚ୍ ୧-୨୦, ୨୦୨୬ ଆରମ୍ଭ। ଉପସ୍ଥିତି ବାଧ୍ୟତାମୂଳକ।",
      ml: "ജില്ലാ തല ഹജ്ജ് പരിശീലനം മാർച്ച് 1-20, 2026 ആരംഭിക്കുന്നു. ഹാജർ നിർബന്ധമാണ്.",
      pa: "ਜ਼ਿਲ੍ਹਾ ਪੱਧਰ 'ਤੇ ਹੱਜ ਸਿਖਲਾਈ 1-20 ਮਾਰਚ 2026 ਤੋਂ ਸ਼ੁਰੂ। ਹਾਜ਼ਰੀ ਲਾਜ਼ਮੀ।",
    },
    date: "2026-02-01",
    isNew: true,
  },
  {
    id: "4",
    type: "success",
    title: {
      en: "Vaccination Camps Active",
      ar: "مخيمات التطعيم نشطة",
      ur: "ویکسینیشن کیمپ فعال",
      hi: "टीकाकरण शिविर सक्रिय",
      ta: "தடுப்பூசி முகாம்கள் செயலில்",
      te: "టీకాకరణ శిబిరాలు చురుగ్గా",
      mr: "लसीकरण शिबिरे सक्रिय",
      bn: "টিকাদান ক্যাম্প সক্রিয়",
      or: "ଟୀକାକରଣ ଶିବିର ସକ୍ରିୟ",
      ml: "വാക്സിനേഷൻ ക്യാമ്പുകൾ സജീവം",
      pa: "ਟੀਕਾਕਰਨ ਕੈਂਪ ਸਰਗਰਮ",
    },
    message: {
      en: "Meningitis (ACWY) & seasonal flu vaccination camps running at all embarkation points until April 30, 2026. Carry Aadhaar & Hajj ID.",
      ar: "مخيمات تطعيم التهاب السحايا والإنفلونزا الموسمية مستمرة حتى 30 أبريل 2026.",
      ur: "میننجائٹس (ACWY) اور موسمی فلو ویکسینیشن کیمپ تمام روانگی مقامات پر 30 اپریل 2026 تک جاری ہیں۔ آدھار اور حج ID لائیں۔",
      hi: "मेनिनजाइटिस (ACWY) और मौसमी फ्लू टीकाकरण शिविर सभी प्रस्थान स्थलों पर 30 अप्रैल 2026 तक। आधार और हज ID लाएं।",
      ta: "மூளைக்காய்ச்சல் (ACWY) & காலநிலை காய்ச்சல் தடுப்பூசி ஏப்ரல் 30, 2026 வரை. ஆதார் & ஹஜ் ID கொண்டு வரவும்.",
      te: "మెనింజైటిస్ (ACWY) & సీజనల్ ఫ్లూ టీకాకరణ ఏప్రిల్ 30, 2026 వరకు. ఆధార్ & హజ్ ID తీసుకురండి.",
      mr: "मेनिन्जायटिस (ACWY) आणि फ्लू लसीकरण 30 एप्रिल 2026 पर्यंत सर्व निर्गमन स्थळांवर. आधार व हज ID आणा.",
      bn: "মেনিনজাইটিস (ACWY) ও ফ্লু টিকাদান ৩০ এপ্রিল ২০২৬ পর্যন্ত। আধার ও হজ ID আনুন।",
      or: "ମେନିନଜାଇଟିସ୍ (ACWY) ଏବଂ ଫ୍ଲୁ ଟୀକାକରଣ ଏପ୍ରିଲ ୩୦, ୨୦୨୬ ପର୍ଯ୍ୟନ୍ତ। ଆଧାର ଏବଂ ହଜ ID ଆଣନ୍ତୁ।",
      ml: "മെനിഞ്ചൈറ്റിസ് (ACWY), ഫ്ലൂ വാക്സിനേഷൻ ഏപ്രിൽ 30, 2026 വരെ. ആധാറും ഹജ്ജ് ID-യും കൊണ്ടുവരിക.",
      pa: "ਮੈਨਿਨਜਾਈਟਿਸ (ACWY) ਅਤੇ ਫਲੂ ਟੀਕਾਕਰਨ 30 ਅਪ੍ਰੈਲ 2026 ਤੱਕ। ਆਧਾਰ ਅਤੇ ਹੱਜ ID ਲਿਆਓ।",
    },
    date: "2026-01-25",
  },
  {
    id: "5",
    type: "info",
    title: {
      en: "First Hajj Flights – June 2026",
      ar: "أولى رحلات الحج – يونيو 2026",
      ur: "پہلی حج پروازیں – جون 2026",
      hi: "पहली हज उड़ानें – जून 2026",
      ta: "முதல் ஹஜ் விமானங்கள் – ஜூன் 2026",
      te: "మొదటి హజ్ విమానాలు – జూన్ 2026",
      mr: "पहिली हज विमाने – जून 2026",
      bn: "প্রথম হজ ফ্লাইট – জুন ২০২৬",
      or: "ପ୍ରଥମ ହଜ ବିମାନ – ଜୁନ୍ ୨୦୨୬",
      ml: "ആദ്യ ഹജ്ജ് ഫ്ലൈറ്റുകൾ – ജൂൺ 2026",
      pa: "ਪਹਿਲੀ ਹੱਜ ਉਡਾਣਾਂ – ਜੂਨ 2026",
    },
    message: {
      en: "First Hajj flights depart from June 3, 2026 from 21 embarkation points. Flight schedules will be shared via SMS and Haj Committee portal.",
      ar: "أولى رحلات الحج تنطلق من 3 يونيو 2026 من 21 نقطة مغادرة.",
      ur: "پہلی حج پروازیں 3 جون 2026 سے 21 روانگی مقامات سے روانہ ہوں گی۔ فلائٹ شیڈول SMS اور حج کمیٹی پورٹل پر شیئر کیا جائے گا۔",
      hi: "पहली हज उड़ानें 3 जून 2026 से 21 प्रस्थान स्थलों से रवाना होंगी। फ्लाइट शेड्यूल SMS और हज कमेटी पोर्टल पर साझा किया जाएगा।",
      ta: "முதல் ஹஜ் விமானங்கள் ஜூன் 3, 2026 முதல் 21 புறப்பாடு புள்ளிகளிலிருந்து புறப்படும்.",
      te: "మొదటి హజ్ విమానాలు జూన్ 3, 2026 నుండి 21 బయలుదేరే స్థానాల నుండి బయలుదేరతాయి.",
      mr: "पहिली हज विमाने 3 जून 2026 पासून 21 निर्गमन स्थळांवरून सुटतील.",
      bn: "প্রথম হজ ফ্লাইট ৩ জুন ২০২৬ থেকে ২১ যাত্রা পয়েন্ট থেকে যাত্রা শুরু করবে।",
      or: "ପ୍ରଥମ ହଜ ବିମାନ ଜୁନ୍ ୩, ୨୦୨୬ ରୁ ୨୧ ଯାତ୍ରା ସ୍ଥାନରୁ ଯାତ୍ରା ଆରମ୍ଭ କରିବ।",
      ml: "ആദ്യ ഹജ്ജ് ഫ്ലൈറ്റുകൾ ജൂൺ 3, 2026 മുതൽ 21 പുറപ്പെടൽ കേന്ദ്രങ്ങളിൽ നിന്ന്.",
      pa: "ਪਹਿਲੀ ਹੱਜ ਉਡਾਣਾਂ 3 ਜੂਨ 2026 ਤੋਂ 21 ਰਵਾਨਗੀ ਸਥਾਨਾਂ ਤੋਂ ਰਵਾਨਾ ਹੋਣਗੀਆਂ।",
    },
    date: "2026-01-20",
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
