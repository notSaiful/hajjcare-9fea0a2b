import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MapPin, Clock, Utensils, Heart, Store, Calendar, Search, ExternalLink, Navigation, AlertTriangle, Info, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import foodGuideImage from "@/assets/food-guide-pilgrims.jpeg";

const FoodGuidePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === "ar" || language === "ur";
  const [searchQuery, setSearchQuery] = useState("");

  const content = {
    en: {
      title: "Food Guide",
      subtitle: "Food options for pilgrims in Saudi Arabia",
      foodGuide: "Popular & Hajj-Friendly Foods",
      freeFoodTitle: "Free Food Centers",
      freeFoodSubtitle: "Charitable organizations providing free meals",
      foodStoresTitle: "Food Stores",
      foodStoresSubtitle: "Where to buy food during Hajj",
      mealSchedule: "Meal Schedule",
      mealScheduleSubtitle: "Plan meals around prayer times",
      restaurantFinder: "Restaurant Finder",
      restaurantFinderSubtitle: "Find restaurants near you",
      searchPlaceholder: "Search restaurants...",
      viewImage: "Tap image to enlarge",
      locations: "Locations",
      timing: "Timing",
      contact: "Contact",
      getDirections: "Directions",
      openNow: "Open Now",
      halal: "Halal Certified",
      cuisine: "Cuisine",
      suhoor: "Suhoor",
      breakfast: "Breakfast",
      lunch: "Lunch",
      asr: "Asr Snack",
      iftar: "Iftar/Dinner",
      lateNight: "Late Night",
    },
    ar: {
      title: "دليل الطعام",
      subtitle: "خيارات الطعام للحجاج في السعودية",
      foodGuide: "الأطعمة الشائعة والمناسبة للحج",
      freeFoodTitle: "مراكز الطعام المجاني",
      freeFoodSubtitle: "منظمات خيرية تقدم وجبات مجانية",
      foodStoresTitle: "متاجر الطعام",
      foodStoresSubtitle: "أماكن شراء الطعام خلال الحج",
      mealSchedule: "جدول الوجبات",
      mealScheduleSubtitle: "خطط وجباتك حول أوقات الصلاة",
      restaurantFinder: "البحث عن المطاعم",
      restaurantFinderSubtitle: "ابحث عن المطاعم القريبة منك",
      searchPlaceholder: "ابحث عن مطاعم...",
      viewImage: "اضغط على الصورة للتكبير",
      locations: "المواقع",
      timing: "التوقيت",
      contact: "التواصل",
      getDirections: "الاتجاهات",
      openNow: "مفتوح الآن",
      halal: "حلال معتمد",
      cuisine: "نوع المطبخ",
      suhoor: "السحور",
      breakfast: "الإفطار",
      lunch: "الغداء",
      asr: "وجبة العصر",
      iftar: "الإفطار/العشاء",
      lateNight: "وجبة متأخرة",
    },
    ur: {
      title: "کھانے کی گائیڈ",
      subtitle: "سعودی عرب میں حجاج کے لیے کھانے کے اختیارات",
      foodGuide: "مقبول اور حج کے لیے موزوں کھانے",
      freeFoodTitle: "مفت کھانے کے مراکز",
      freeFoodSubtitle: "مفت کھانا فراہم کرنے والی خیراتی تنظیمیں",
      foodStoresTitle: "فوڈ اسٹورز",
      foodStoresSubtitle: "حج کے دوران کھانا کہاں سے خریدیں",
      mealSchedule: "کھانے کا شیڈول",
      mealScheduleSubtitle: "نماز کے اوقات کے مطابق کھانے کی منصوبہ بندی",
      restaurantFinder: "ریستوراں تلاش کریں",
      restaurantFinderSubtitle: "قریبی ریستوراں تلاش کریں",
      searchPlaceholder: "ریستوراں تلاش کریں...",
      viewImage: "تصویر بڑی کرنے کے لیے ٹیپ کریں",
      locations: "مقامات",
      timing: "اوقات",
      contact: "رابطہ",
      getDirections: "راستہ",
      openNow: "ابھی کھلا ہے",
      halal: "حلال تصدیق شدہ",
      cuisine: "کھانے کی قسم",
      suhoor: "سحری",
      breakfast: "ناشتہ",
      lunch: "دوپہر کا کھانا",
      asr: "عصر کا ناشتہ",
      iftar: "افطار/رات کا کھانا",
      lateNight: "رات کا کھانا",
    },
    hi: {
      title: "खाद्य गाइड",
      subtitle: "सऊदी अरब में हाजियों के लिए खाने के विकल्प",
      foodGuide: "लोकप्रिय और हज के अनुकूल खाद्य पदार्थ",
      freeFoodTitle: "मुफ्त भोजन केंद्र",
      freeFoodSubtitle: "मुफ्त भोजन प्रदान करने वाली संस्थाएं",
      foodStoresTitle: "खाद्य दुकानें",
      foodStoresSubtitle: "हज के दौरान भोजन कहां से खरीदें",
      mealSchedule: "भोजन अनुसूची",
      mealScheduleSubtitle: "नमाज़ के समय के अनुसार भोजन की योजना",
      restaurantFinder: "रेस्टोरेंट खोजें",
      restaurantFinderSubtitle: "आस-पास के रेस्टोरेंट खोजें",
      searchPlaceholder: "रेस्टोरेंट खोजें...",
      viewImage: "बड़ा करने के लिए छवि टैप करें",
      locations: "स्थान",
      timing: "समय",
      contact: "संपर्क",
      getDirections: "दिशा",
      openNow: "अभी खुला",
      halal: "हलाल प्रमाणित",
      cuisine: "व्यंजन",
      suhoor: "सहरी",
      breakfast: "नाश्ता",
      lunch: "दोपहर का भोजन",
      asr: "अस्र का नाश्ता",
      iftar: "इफ्तार/रात का खाना",
      lateNight: "देर रात का खाना",
    },
    ta: {
      title: "உணவு வழிகாட்டி",
      subtitle: "சவுதி அரேபியாவில் ஹாஜிகளுக்கான உணவு விருப்பங்கள்",
      foodGuide: "பிரபலமான மற்றும் ஹஜ்-நட்பு உணவுகள்",
      freeFoodTitle: "இலவச உணவு மையங்கள்",
      freeFoodSubtitle: "இலவச உணவு வழங்கும் அறக்கட்டளைகள்",
      foodStoresTitle: "உணவுக் கடைகள்",
      foodStoresSubtitle: "ஹஜ்ஜின் போது உணவை எங்கே வாங்குவது",
      mealSchedule: "உணவு அட்டவணை",
      mealScheduleSubtitle: "தொழுகை நேரங்களுக்கு ஏற்ப உணவை திட்டமிடுங்கள்",
      restaurantFinder: "உணவகம் தேடுங்கள்",
      restaurantFinderSubtitle: "அருகிலுள்ள உணவகங்களைக் கண்டறியுங்கள்",
      searchPlaceholder: "உணவகம் தேடுங்கள்...",
      viewImage: "பெரிதாக்க படத்தைத் தட்டவும்",
      locations: "இடங்கள்",
      timing: "நேரம்",
      contact: "தொடர்பு",
      getDirections: "திசைகள்",
      openNow: "இப்போது திறந்திருக்கிறது",
      halal: "ஹலால் சான்றிதழ்",
      cuisine: "சமையல்",
      suhoor: "சஹர்",
      breakfast: "காலை உணவு",
      lunch: "மதிய உணவு",
      asr: "அஸர் சிற்றுண்டி",
      iftar: "இஃப்தார்/இரவு உணவு",
      lateNight: "இரவு நேர உணவு",
    },
    te: {
      title: "ఆహార గైడ్",
      subtitle: "సౌదీ అరేబియాలో హాజీలకు ఆహార ఎంపికలు",
      foodGuide: "ప్రసిద్ధ మరియు హజ్-అనుకూల ఆహారాలు",
      freeFoodTitle: "ఉచిత ఆహార కేంద్రాలు",
      freeFoodSubtitle: "ఉచిత భోజనం అందించే సంస్థలు",
      foodStoresTitle: "ఆహార దుకాణాలు",
      foodStoresSubtitle: "హజ్ సమయంలో ఆహారం ఎక్కడ కొనాలి",
      mealSchedule: "భోజన షెడ్యూల్",
      mealScheduleSubtitle: "నమాజ్ సమయాల ప్రకారం భోజనం ప్లాన్ చేయండి",
      restaurantFinder: "రెస్టారెంట్ కనుగొనండి",
      restaurantFinderSubtitle: "సమీపంలోని రెస్టారెంట్లను కనుగొనండి",
      searchPlaceholder: "రెస్టారెంట్ వెతకండి...",
      viewImage: "పెద్దది చేయడానికి చిత్రాన్ని నొక్కండి",
      locations: "ప్రదేశాలు",
      timing: "సమయం",
      contact: "సంప్రదింపు",
      getDirections: "దిశలు",
      openNow: "ఇప్పుడు తెరిచి ఉంది",
      halal: "హలాల్ ధృవీకరించబడింది",
      cuisine: "వంటకాలు",
      suhoor: "సహూర్",
      breakfast: "అల్పాహారం",
      lunch: "మధ్యాహ్న భోజనం",
      asr: "అస్ర్ స్నాక్",
      iftar: "ఇఫ్తార్/డిన్నర్",
      lateNight: "రాత్రి భోజనం",
    },
    mr: {
      title: "अन्न मार्गदर्शक",
      subtitle: "सौदी अरेबियात हाजींसाठी अन्न पर्याय",
      foodGuide: "लोकप्रिय आणि हज-अनुकूल खाद्यपदार्थ",
      freeFoodTitle: "मोफत अन्न केंद्रे",
      freeFoodSubtitle: "मोफत जेवण देणाऱ्या संस्था",
      foodStoresTitle: "अन्न दुकाने",
      foodStoresSubtitle: "हजच्या काळात अन्न कुठे विकत घ्यावे",
      mealSchedule: "जेवणाचे वेळापत्रक",
      mealScheduleSubtitle: "नमाजच्या वेळेनुसार जेवणाचे नियोजन करा",
      restaurantFinder: "रेस्टॉरंट शोधा",
      restaurantFinderSubtitle: "जवळपासचे रेस्टॉरंट शोधा",
      searchPlaceholder: "रेस्टॉरंट शोधा...",
      viewImage: "मोठे करण्यासाठी प्रतिमेवर टॅप करा",
      locations: "ठिकाणे",
      timing: "वेळ",
      contact: "संपर्क",
      getDirections: "दिशा",
      openNow: "आता उघडे",
      halal: "हलाल प्रमाणित",
      cuisine: "पाककृती",
      suhoor: "सहरी",
      breakfast: "नाश्ता",
      lunch: "दुपारचे जेवण",
      asr: "अस्र नाश्ता",
      iftar: "इफ्तार/रात्रीचे जेवण",
      lateNight: "उशिरा रात्रीचे जेवण",
    },
    bn: {
      title: "খাদ্য গাইড",
      subtitle: "সৌদি আরবে হাজীদের জন্য খাবারের বিকল্প",
      foodGuide: "জনপ্রিয় এবং হজ-বান্ধব খাবার",
      freeFoodTitle: "বিনামূল্যে খাবার কেন্দ্র",
      freeFoodSubtitle: "বিনামূল্যে খাবার সরবরাহকারী সংস্থা",
      foodStoresTitle: "খাদ্য দোকান",
      foodStoresSubtitle: "হজের সময় খাবার কোথায় কিনবেন",
      mealSchedule: "খাবারের সময়সূচী",
      mealScheduleSubtitle: "নামাজের সময় অনুযায়ী খাবার পরিকল্পনা",
      restaurantFinder: "রেস্টুরেন্ট খুঁজুন",
      restaurantFinderSubtitle: "কাছাকাছি রেস্টুরেন্ট খুঁজুন",
      searchPlaceholder: "রেস্টুরেন্ট খুঁজুন...",
      viewImage: "বড় করতে ছবিতে ট্যাপ করুন",
      locations: "স্থান",
      timing: "সময়",
      contact: "যোগাযোগ",
      getDirections: "দিকনির্দেশ",
      openNow: "এখন খোলা",
      halal: "হালাল সার্টিফাইড",
      cuisine: "রান্না",
      suhoor: "সেহরি",
      breakfast: "সকালের নাস্তা",
      lunch: "দুপুরের খাবার",
      asr: "আসর স্ন্যাক",
      iftar: "ইফতার/রাতের খাবার",
      lateNight: "রাতের খাবার",
    },
    or: {
      title: "ଖାଦ୍ୟ ଗାଇଡ୍",
      subtitle: "ସାଉଦି ଆରବରେ ହାଜୀମାନଙ୍କ ପାଇଁ ଖାଦ୍ୟ ବିକଳ୍ପ",
      foodGuide: "ଲୋକପ୍ରିୟ ଏବଂ ହଜ-ଅନୁକୂଳ ଖାଦ୍ୟ",
      freeFoodTitle: "ମାଗଣା ଖାଦ୍ୟ କେନ୍ଦ୍ର",
      freeFoodSubtitle: "ମାଗଣା ଖାଦ୍ୟ ଯୋଗାଇ ଦେଉଥିବା ସଂସ୍ଥା",
      foodStoresTitle: "ଖାଦ୍ୟ ଦୋକାନ",
      foodStoresSubtitle: "ହଜ ସମୟରେ ଖାଦ୍ୟ କେଉଁଠାରୁ କିଣିବେ",
      mealSchedule: "ଖାଦ୍ୟ ସମୟସୂଚୀ",
      mealScheduleSubtitle: "ନମାଜ ସମୟ ଅନୁସାରେ ଖାଦ୍ୟ ଯୋଜନା",
      restaurantFinder: "ରେଷ୍ଟୁରାଣ୍ଟ ଖୋଜନ୍ତୁ",
      restaurantFinderSubtitle: "ନିକଟସ୍ଥ ରେଷ୍ଟୁରାଣ୍ଟ ଖୋଜନ୍ତୁ",
      searchPlaceholder: "ରେଷ୍ଟୁରାଣ୍ଟ ଖୋଜନ୍ତୁ...",
      viewImage: "ବଡ଼ କରିବାକୁ ଛବିରେ ଟ୍ୟାପ୍ କରନ୍ତୁ",
      locations: "ସ୍ଥାନ",
      timing: "ସମୟ",
      contact: "ଯୋଗାଯୋଗ",
      getDirections: "ଦିଗନିର୍ଦେଶ",
      openNow: "ବର୍ତ୍ତମାନ ଖୋଲା",
      halal: "ହାଲାଲ ପ୍ରମାଣିତ",
      cuisine: "ରନ୍ଧନ",
      suhoor: "ସହୂର",
      breakfast: "ପ୍ରାତଃରାଶ",
      lunch: "ମଧ୍ୟାହ୍ନ ଭୋଜନ",
      asr: "ଆସର ସ୍ନାକ୍ସ",
      iftar: "ଇଫ୍ତାର/ରାତ୍ରି ଭୋଜନ",
      lateNight: "ରାତ୍ରି ଭୋଜନ",
    },
    ml: {
      title: "ഭക്ഷണ ഗൈഡ്",
      subtitle: "സൗദി അറേബ്യയിൽ ഹാജിമാർക്കുള്ള ഭക്ഷണ ഓപ്ഷനുകൾ",
      foodGuide: "ജനപ്രിയവും ഹജ്-സൗഹൃദവുമായ ഭക്ഷണങ്ങൾ",
      freeFoodTitle: "സൗജന്യ ഭക്ഷണ കേന്ദ്രങ്ങൾ",
      freeFoodSubtitle: "സൗജന്യ ഭക്ഷണം നൽകുന്ന സംഘടനകൾ",
      foodStoresTitle: "ഭക്ഷണ കടകൾ",
      foodStoresSubtitle: "ഹജ് സമയത്ത് ഭക്ഷണം എവിടെ നിന്ന് വാങ്ങാം",
      mealSchedule: "ഭക്ഷണ ഷെഡ്യൂൾ",
      mealScheduleSubtitle: "നമസ്കാര സമയങ്ങൾക്കനുസരിച്ച് ഭക്ഷണം ആസൂത്രണം ചെയ്യുക",
      restaurantFinder: "റെസ്റ്റോറന്റ് കണ്ടെത്തുക",
      restaurantFinderSubtitle: "സമീപത്തുള്ള റെസ്റ്റോറന്റുകൾ കണ്ടെത്തുക",
      searchPlaceholder: "റെസ്റ്റോറന്റ് തിരയുക...",
      viewImage: "വലുതാക്കാൻ ചിത്രത്തിൽ ടാപ്പ് ചെയ്യുക",
      locations: "സ്ഥലങ്ങൾ",
      timing: "സമയം",
      contact: "ബന്ധപ്പെടുക",
      getDirections: "ദിശകൾ",
      openNow: "ഇപ്പോൾ തുറന്നിരിക്കുന്നു",
      halal: "ഹലാൽ സർട്ടിഫൈഡ്",
      cuisine: "പാചകം",
      suhoor: "സുഹൂർ",
      breakfast: "പ്രഭാതഭക്ഷണം",
      lunch: "ഉച്ചഭക്ഷണം",
      asr: "അസർ സ്നാക്ക്",
      iftar: "ഇഫ്താർ/അത്താഴം",
      lateNight: "രാത്രി ഭക്ഷണം",
    },
    pa: {
      title: "ਭੋਜਨ ਗਾਈਡ",
      subtitle: "ਸਾਊਦੀ ਅਰਬ ਵਿੱਚ ਹਾਜੀਆਂ ਲਈ ਭੋਜਨ ਵਿਕਲਪ",
      foodGuide: "ਪ੍ਰਸਿੱਧ ਅਤੇ ਹੱਜ-ਅਨੁਕੂਲ ਭੋਜਨ",
      freeFoodTitle: "ਮੁਫ਼ਤ ਭੋਜਨ ਕੇਂਦਰ",
      freeFoodSubtitle: "ਮੁਫ਼ਤ ਭੋਜਨ ਪ੍ਰਦਾਨ ਕਰਨ ਵਾਲੀਆਂ ਸੰਸਥਾਵਾਂ",
      foodStoresTitle: "ਭੋਜਨ ਸਟੋਰ",
      foodStoresSubtitle: "ਹੱਜ ਦੌਰਾਨ ਭੋਜਨ ਕਿੱਥੋਂ ਖਰੀਦਣਾ ਹੈ",
      mealSchedule: "ਭੋਜਨ ਸ਼ਡਿਊਲ",
      mealScheduleSubtitle: "ਨਮਾਜ਼ ਦੇ ਸਮੇਂ ਅਨੁਸਾਰ ਭੋਜਨ ਦੀ ਯੋਜਨਾ",
      restaurantFinder: "ਰੈਸਟੋਰੈਂਟ ਲੱਭੋ",
      restaurantFinderSubtitle: "ਨੇੜੇ ਦੇ ਰੈਸਟੋਰੈਂਟ ਲੱਭੋ",
      searchPlaceholder: "ਰੈਸਟੋਰੈਂਟ ਲੱਭੋ...",
      viewImage: "ਵੱਡਾ ਕਰਨ ਲਈ ਤਸਵੀਰ 'ਤੇ ਟੈਪ ਕਰੋ",
      locations: "ਸਥਾਨ",
      timing: "ਸਮਾਂ",
      contact: "ਸੰਪਰਕ",
      getDirections: "ਦਿਸ਼ਾਵਾਂ",
      openNow: "ਹੁਣ ਖੁੱਲ੍ਹਾ",
      halal: "ਹਲਾਲ ਪ੍ਰਮਾਣਿਤ",
      cuisine: "ਪਕਵਾਨ",
      suhoor: "ਸਹਿਰੀ",
      breakfast: "ਨਾਸ਼ਤਾ",
      lunch: "ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ",
      asr: "ਅਸਰ ਸਨੈਕ",
      iftar: "ਇਫ਼ਤਾਰ/ਰਾਤ ਦਾ ਖਾਣਾ",
      lateNight: "ਦੇਰ ਰਾਤ ਦਾ ਖਾਣਾ",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  // Meal schedule aligned with prayer times
  const mealSchedule = [
    {
      mealEn: "Suhoor",
      mealAr: "السحور",
      timeEn: "3:00 AM - 4:30 AM",
      timeAr: "٣:٠٠ ص - ٤:٣٠ ص",
      descEn: "Pre-dawn meal before Fajr",
      descAr: "وجبة ما قبل الفجر",
      icon: "🌙",
      color: "bg-indigo-500",
    },
    {
      mealEn: "Breakfast",
      mealAr: "الإفطار",
      timeEn: "6:30 AM - 8:00 AM",
      timeAr: "٦:٣٠ ص - ٨:٠٠ ص",
      descEn: "After Fajr prayer",
      descAr: "بعد صلاة الفجر",
      icon: "🌅",
      color: "bg-amber-500",
    },
    {
      mealEn: "Lunch",
      mealAr: "الغداء",
      timeEn: "12:30 PM - 2:00 PM",
      timeAr: "١٢:٣٠ م - ٢:٠٠ م",
      descEn: "After Dhuhr prayer",
      descAr: "بعد صلاة الظهر",
      icon: "☀️",
      color: "bg-yellow-500",
    },
    {
      mealEn: "Asr Snack",
      mealAr: "وجبة العصر",
      timeEn: "4:00 PM - 5:00 PM",
      timeAr: "٤:٠٠ م - ٥:٠٠ م",
      descEn: "Light snack after Asr",
      descAr: "وجبة خفيفة بعد العصر",
      icon: "🍎",
      color: "bg-orange-500",
    },
    {
      mealEn: "Iftar/Dinner",
      mealAr: "الإفطار/العشاء",
      timeEn: "6:30 PM - 8:00 PM",
      timeAr: "٦:٣٠ م - ٨:٠٠ م",
      descEn: "After Maghrib prayer",
      descAr: "بعد صلاة المغرب",
      icon: "🌆",
      color: "bg-rose-500",
    },
    {
      mealEn: "Late Night",
      mealAr: "وجبة متأخرة",
      timeEn: "10:00 PM - 11:30 PM",
      timeAr: "١٠:٠٠ م - ١١:٣٠ م",
      descEn: "After Isha prayer",
      descAr: "بعد صلاة العشاء",
      icon: "🌃",
      color: "bg-purple-500",
    },
  ];

  const freeFoodCenters = [
    {
      nameEn: "Indian Hajj Mission Food Service",
      nameAr: "خدمة الطعام لبعثة الحج الهندية",
      locationEn: "Makkah & Mina Camps",
      locationAr: "مكة ومخيمات منى",
      timingEn: "Breakfast, Lunch & Dinner",
      timingAr: "إفطار، غداء وعشاء",
      icon: "🇮🇳",
      lat: 21.4225,
      lng: 39.8262,
    },
    {
      nameEn: "Saudi Red Crescent Distribution",
      nameAr: "توزيع الهلال الأحمر السعودي",
      locationEn: "All Hajj sites - Mina, Arafat, Muzdalifah",
      locationAr: "جميع مواقع الحج - منى، عرفات، مزدلفة",
      timingEn: "During Hajj days",
      timingAr: "خلال أيام الحج",
      icon: "🏥",
      lat: 21.4133,
      lng: 39.8933,
    },
    {
      nameEn: "Makkah Municipality Free Meals",
      nameAr: "وجبات أمانة مكة المكرمة المجانية",
      locationEn: "Grand Mosque area",
      locationAr: "منطقة المسجد الحرام",
      timingEn: "After prayers",
      timingAr: "بعد الصلوات",
      icon: "🕌",
      lat: 21.4225,
      lng: 39.8262,
    },
    {
      nameEn: "Local Charity Organizations",
      nameAr: "منظمات خيرية محلية",
      locationEn: "Various locations in Makkah & Madinah",
      locationAr: "مواقع متعددة في مكة والمدينة",
      timingEn: "24/7 during Hajj season",
      timingAr: "على مدار الساعة خلال موسم الحج",
      icon: "❤️",
      lat: 21.4267,
      lng: 39.8261,
    },
  ];

  const foodStores = [
    {
      nameEn: "Al-Othaim Markets",
      nameAr: "أسواق العثيم",
      typeEn: "Supermarket",
      typeAr: "سوبرماركت",
      locationEn: "Multiple locations in Makkah & Madinah",
      locationAr: "مواقع متعددة في مكة والمدينة",
      icon: "🛒",
      lat: 21.4171,
      lng: 39.8135,
    },
    {
      nameEn: "Panda Hypermarket",
      nameAr: "هايبر بنده",
      typeEn: "Hypermarket",
      typeAr: "هايبر ماركت",
      locationEn: "Aziziya, Makkah",
      locationAr: "العزيزية، مكة",
      icon: "🏪",
      lat: 21.3998,
      lng: 39.8375,
    },
    {
      nameEn: "Bin Dawood Supermarket",
      nameAr: "سوبرماركت بن داود",
      typeEn: "Supermarket",
      typeAr: "سوبرماركت",
      locationEn: "Near Haram, Makkah",
      locationAr: "قرب الحرم، مكة",
      icon: "🛍️",
      lat: 21.4211,
      lng: 39.8269,
    },
    {
      nameEn: "Local Bakeries (Khubz)",
      nameAr: "المخابز المحلية (خبز)",
      typeEn: "Fresh Bread",
      typeAr: "خبز طازج",
      locationEn: "Throughout Makkah & Madinah",
      locationAr: "في جميع أنحاء مكة والمدينة",
      icon: "🥖",
      lat: 21.4234,
      lng: 39.8234,
    },
    {
      nameEn: "Street Food Vendors",
      nameAr: "باعة الطعام المتجولون",
      typeEn: "Quick Meals",
      typeAr: "وجبات سريعة",
      locationEn: "Near accommodations",
      locationAr: "بالقرب من السكن",
      icon: "🍢",
      lat: 21.4150,
      lng: 39.8300,
    },
    {
      nameEn: "Indian Restaurants",
      nameAr: "مطاعم هندية",
      typeEn: "Familiar Food",
      typeAr: "طعام مألوف",
      locationEn: "Aziziya & near Haram",
      locationAr: "العزيزية وقرب الحرم",
      icon: "🍛",
      lat: 21.4010,
      lng: 39.8350,
    },
  ];

  const restaurants = [
    {
      nameEn: "Al Baik",
      nameAr: "البيك",
      cuisineEn: "Fast Food - Fried Chicken",
      cuisineAr: "وجبات سريعة - دجاج مقلي",
      locationEn: "Multiple locations near Haram",
      locationAr: "مواقع متعددة قرب الحرم",
      timingEn: "24 Hours",
      timingAr: "٢٤ ساعة",
      icon: "🍗",
      halal: true,
      lat: 21.4225,
      lng: 39.8265,
    },
    {
      nameEn: "Kudu Restaurant",
      nameAr: "مطعم كودو",
      cuisineEn: "Fast Food - Sandwiches",
      cuisineAr: "وجبات سريعة - ساندويتشات",
      locationEn: "Aziziya & Central Area",
      locationAr: "العزيزية والمنطقة المركزية",
      timingEn: "6:00 AM - 2:00 AM",
      timingAr: "٦ ص - ٢ ص",
      icon: "🥪",
      halal: true,
      lat: 21.4100,
      lng: 39.8350,
    },
    {
      nameEn: "Spice Village",
      nameAr: "قرية التوابل",
      cuisineEn: "Indian & Pakistani",
      cuisineAr: "هندي وباكستاني",
      locationEn: "Aziziya, Makkah",
      locationAr: "العزيزية، مكة",
      timingEn: "11:00 AM - 12:00 AM",
      timingAr: "١١ ص - ١٢ ص",
      icon: "🍛",
      halal: true,
      lat: 21.3995,
      lng: 39.8380,
    },
    {
      nameEn: "Hyderabad House",
      nameAr: "حيدر أباد هاوس",
      cuisineEn: "South Indian - Biryani",
      cuisineAr: "جنوب هندي - برياني",
      locationEn: "Near Clock Tower",
      locationAr: "قرب برج الساعة",
      timingEn: "10:00 AM - 1:00 AM",
      timingAr: "١٠ ص - ١ ص",
      icon: "🍚",
      halal: true,
      lat: 21.4190,
      lng: 39.8275,
    },
    {
      nameEn: "Turkish Döner",
      nameAr: "دونر تركي",
      cuisineEn: "Turkish - Kebab",
      cuisineAr: "تركي - كباب",
      locationEn: "Ajyad Area",
      locationAr: "منطقة أجياد",
      timingEn: "9:00 AM - 11:00 PM",
      timingAr: "٩ ص - ١١ م",
      icon: "🥙",
      halal: true,
      lat: 21.4205,
      lng: 39.8290,
    },
    {
      nameEn: "Arabian Nights Restaurant",
      nameAr: "مطعم ليالي عربية",
      cuisineEn: "Arabic - Traditional",
      cuisineAr: "عربي - تقليدي",
      locationEn: "Central Makkah",
      locationAr: "وسط مكة",
      timingEn: "12:00 PM - 12:00 AM",
      timingAr: "١٢ م - ١٢ ص",
      icon: "🍖",
      halal: true,
      lat: 21.4180,
      lng: 39.8245,
    },
    {
      nameEn: "Shawarma Corner",
      nameAr: "ركن الشاورما",
      cuisineEn: "Lebanese - Shawarma",
      cuisineAr: "لبناني - شاورما",
      locationEn: "Multiple Locations",
      locationAr: "مواقع متعددة",
      timingEn: "24 Hours",
      timingAr: "٢٤ ساعة",
      icon: "🌯",
      halal: true,
      lat: 21.4150,
      lng: 39.8320,
    },
    {
      nameEn: "Falafel House",
      nameAr: "بيت الفلافل",
      cuisineEn: "Middle Eastern - Vegetarian",
      cuisineAr: "شرق أوسطي - نباتي",
      locationEn: "Near Haram Gates",
      locationAr: "قرب أبواب الحرم",
      timingEn: "5:00 AM - 11:00 PM",
      timingAr: "٥ ص - ١١ م",
      icon: "🧆",
      halal: true,
      lat: 21.4220,
      lng: 39.8258,
    },
  ];

  const filteredRestaurants = restaurants.filter((r) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.nameEn.toLowerCase().includes(query) ||
      r.nameAr.includes(query) ||
      r.cuisineEn.toLowerCase().includes(query) ||
      r.cuisineAr.includes(query)
    );
  });

  const openGoogleMaps = (lat: number, lng: number, name: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`, "_blank");
  };

  return (
    <MainLayout>
      <div className={`min-h-screen bg-background ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4 py-4 safe-area-top">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-3 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8">
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-6">
              <TabsTrigger value="schedule" className="text-xs sm:text-sm gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t.mealSchedule}</span>
              </TabsTrigger>
              <TabsTrigger value="free" className="text-xs sm:text-sm gap-1">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t.freeFoodTitle}</span>
              </TabsTrigger>
              <TabsTrigger value="stores" className="text-xs sm:text-sm gap-1">
                <Store className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t.foodStoresTitle}</span>
              </TabsTrigger>
              <TabsTrigger value="restaurants" className="text-xs sm:text-sm gap-1">
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t.restaurantFinder}</span>
              </TabsTrigger>
            </TabsList>

            {/* Meal Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <Card className="border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {t.mealSchedule}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{t.mealScheduleSubtitle}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mealSchedule.map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50"
                    >
                      <div className={`w-12 h-12 rounded-full ${meal.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {meal.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {language === "ar" ? meal.mealAr : meal.mealEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === "ar" ? meal.descAr : meal.descEn}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="font-mono text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {language === "ar" ? meal.timeAr : meal.timeEn}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Food Guide Image */}
              <Card className="overflow-hidden border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>🍽️</span>
                    {t.foodGuide}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={foodGuideImage} 
                      alt="Food Guide for Pilgrims" 
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <p className="text-xs text-muted-foreground text-center mt-2">{t.viewImage}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Free Food Centers Tab */}
            <TabsContent value="free" className="space-y-4">
              <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Heart className="w-5 h-5" />
                    {t.freeFoodTitle}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{t.freeFoodSubtitle}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {freeFoodCenters.map((center, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-background rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{center.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {language === "ar" ? center.nameAr : center.nameEn}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            {language === "ar" ? center.locationAr : center.locationEn}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            {language === "ar" ? center.timingAr : center.timingEn}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            {language === "ar" ? "مجاني" : "Free"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-xs"
                            onClick={() => openGoogleMaps(center.lat, center.lng, language === "ar" ? center.nameAr : center.nameEn)}
                          >
                            <Navigation className="w-3 h-3" />
                            {t.getDirections}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Food Stores Tab */}
            <TabsContent value="stores" className="space-y-4">
              <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <Store className="w-5 h-5" />
                    {t.foodStoresTitle}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{t.foodStoresSubtitle}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {foodStores.map((store, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-background rounded-lg border border-amber-200 dark:border-amber-800"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{store.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">
                              {language === "ar" ? store.nameAr : store.nameEn}
                            </h3>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {language === "ar" ? store.typeAr : store.typeEn}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                              <MapPin className="w-3 h-3" />
                              {language === "ar" ? store.locationAr : store.locationEn}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full mt-3 gap-2 text-amber-700 dark:text-amber-400"
                          onClick={() => openGoogleMaps(store.lat, store.lng, language === "ar" ? store.nameAr : store.nameEn)}
                        >
                          <Navigation className="w-4 h-4" />
                          {t.getDirections}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Restaurant Finder Tab */}
            <TabsContent value="restaurants" className="space-y-4">
              <Card className="border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <Search className="w-5 h-5" />
                    {t.restaurantFinder}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{t.restaurantFinderSubtitle}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRtl ? 'right-3' : 'left-3'}`} />
                    <Input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`${isRtl ? 'pr-10' : 'pl-10'}`}
                    />
                  </div>

                  {/* Restaurant List */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredRestaurants.map((restaurant, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-background rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{restaurant.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-foreground">
                                {language === "ar" ? restaurant.nameAr : restaurant.nameEn}
                              </h3>
                              {restaurant.halal && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-[10px]">
                                  {t.halal}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {language === "ar" ? restaurant.cuisineAr : restaurant.cuisineEn}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                              <MapPin className="w-3 h-3" />
                              {language === "ar" ? restaurant.locationAr : restaurant.locationEn}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              {language === "ar" ? restaurant.timingAr : restaurant.timingEn}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full mt-3 gap-2 text-blue-700 dark:text-blue-400"
                          onClick={() => openGoogleMaps(restaurant.lat, restaurant.lng, language === "ar" ? restaurant.nameAr : restaurant.nameEn)}
                        >
                          <Navigation className="w-4 h-4" />
                          {t.getDirections}
                        </Button>
                      </div>
                    ))}
                  </div>

                  {filteredRestaurants.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>{language === "ar" ? "لم يتم العثور على مطاعم" : "No restaurants found"}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Tips Card */}
          <Card className="border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 mt-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                    {language === "ar" ? "نصيحة مهمة" : "Important Tip"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "ar" 
                      ? "في منى وعرفات، يتم تقديم وجبات معبأة فقط. اختر الأطعمة الخفيفة المعتمدة على الأرز واشرب الكثير من الماء للبقاء رطبًا."
                      : "In Mina/Arafat, only packed meals are served. Go for light, rice-based foods and drink plenty of water to stay hydrated."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default FoodGuidePage;
