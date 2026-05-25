import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconCircle } from "@/components/IconCircle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Building2,
  UserCheck,
  Stethoscope,
  Landmark,
  Flag,
  Phone,
  Ambulance,
  ShieldCheck,
  HeartPulse,
  Plane,
  MapPin,
  Users,
  HelpCircle,
  FileText,
  Home,
} from "lucide-react";

const HajMissionDirectoryPage = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const labels = {
    title: {
      en: "Indian Haj Mission Directory",
      ar: "دليل البعثة الهندية للحج",
      ur: "انڈین حج مشن ڈائریکٹری",
      hi: "भारतीय हज मिशन डायरेक्टरी",
      ta: "இந்திய ஹஜ் மிஷன் அடைவு",
      te: "భారతీయ హజ్ మిషన్ డైరెక్టరీ",
      mr: "भारतीय हज मिशन डायरेक्टरी",
      bn: "ভারতীয় হজ মিশন ডিরেক্টরি",
      or: "ଭାରତୀୟ ହଜ ମିଶନ ଡିରେକ୍ଟୋରୀ",
      ml: "ഇന്ത്യൻ ഹജ്ജ് മിഷൻ ഡയറക്ടറി",
      pa: "ਭਾਰਤੀ ਹੱਜ ਮਿਸ਼ਨ ਡਾਇਰੈਕਟਰੀ",
    },
    subtitle: {
      en: "All important contacts at your fingertips",
      ar: "جميع جهات الاتصال المهمة في متناول يدك",
      ur: "تمام اہم رابطے آپ کی انگلیوں پر",
      hi: "सभी महत्वपूर्ण संपर्क आपकी उंगलियों पर",
      ta: "முக்கியமான தொடர்புகள் உங்கள் விரல் நுனியில்",
      te: "అన్ని ముఖ్యమైన సంప్రదింపులు మీ వేలి చివర్లలో",
      mr: "सर्व महत्त्वाचे संपर्क तुमच्या बोटांच्या टोकावर",
      bn: "সব গুরুত্বপূর্ণ যোগাযোগ আপনার আঙুলের ডগায়",
      or: "ସମସ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଯୋଗାଯୋଗ ଆପଣଙ୍କ ଆଙ୍ଗୁଠି ଉପରେ",
      ml: "എല്ലാ പ്രധാന കോൺടാക്റ്റുകളും നിങ്ങളുടെ വിരൽത്തുമ്പിൽ",
      pa: "ਸਾਰੇ ਮਹੱਤਵਪੂਰਨ ਸੰਪਰਕ ਤੁਹਾਡੀਆਂ ਉਂਗਲਾਂ 'ਤੇ",
    },
    back: {
      en: "Back",
      ar: "رجوع",
      ur: "واپس",
      hi: "वापस",
      ta: "பின்செல்",
      te: "వెనక్కి",
      mr: "मागे",
      bn: "পিছনে",
      or: "ପଛକୁ",
      ml: "തിരികെ",
      pa: "ਵਾਪਸ",
    },
    searchPlaceholder: {
      en: "Search building, doctor, inspector...",
      ar: "ابحث عن المبنى، الطبيب، المفتش...",
      ur: "بلڈنگ، ڈاکٹر، انسپکٹر تلاش کریں...",
      hi: "बिल्डिंग, डॉक्टर, इंस्पेक्टर खोजें...",
      ta: "கட்டிடம், மருத்துவர், ஆய்வாளர் தேடுங்கள்...",
      te: "భవనం, డాక్టర్, ఇన్స్పెక్టర్ వెతకండి...",
      mr: "इमारत, डॉक्टर, निरीक्षक शोधा...",
      bn: "বিল্ডিং, ডাক্তার, ইন্সপেক্টর খুঁজুন...",
      or: "ବିଲ୍ଡିଂ, ଡାକ୍ତର, ଇନ୍ସପେକ୍ଟର ଖୋଜନ୍ତୁ...",
      ml: "കെട്ടിടം, ഡോക്ടർ, ഇൻസ്പെക്ടർ തിരയുക...",
      pa: "ਬਿਲਡਿੰਗ, ਡਾਕਟਰ, ਇੰਸਪੈਕਟਰ ਖੋਜੋ...",
    },
    tapToCall: {
      en: "Tap to call",
      ar: "اضغط للاتصال",
      ur: "کال کرنے کے لیے ٹیپ کریں",
      hi: "कॉल करने के लिए टैप करें",
      ta: "அழைக்க தட்டவும்",
      te: "కాల్ చేయడానికి ట్యాప్ చేయండి",
      mr: "कॉल करण्यासाठी टॅप करा",
      bn: "কল করতে ট্যাপ করুন",
      or: "କଲ୍ କରିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ",
      ml: "കോൾ ചെയ്യാൻ ടാപ്പ് ചെയ്യുക",
      pa: "ਕਾਲ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ",
    },
  };

  // Directory categories with icons
  const directoryCategories = [
    {
      id: "building",
      icon: Building2,
      label: { en: "Building No.", ar: "رقم المبنى", ur: "بلڈنگ نمبر", hi: "बिल्डिंग नं.", ta: "கட்டிடம் எண்", te: "భవనం నం.", mr: "इमारत क्र.", bn: "বিল্ডিং নং", or: "ବିଲ୍ଡିଂ ନଂ", ml: "കെട്ടിടം നമ്പർ", pa: "ਬਿਲਡਿੰਗ ਨੰ." },
      color: "amber",
    },
    {
      id: "inspector",
      icon: UserCheck,
      label: { en: "Haj Inspector", ar: "مفتش الحج", ur: "حج انسپکٹر", hi: "हज इंस्पेक्टर", ta: "ஹஜ் ஆய்வாளர்", te: "హజ్ ఇన్స్పెక్టర్", mr: "हज निरीक्षक", bn: "হজ ইন্সপেক্টর", or: "ହଜ୍ ଇନ୍ସପେକ୍ଟର", ml: "ഹജ്ജ് ഇൻസ്പെക്ടർ", pa: "ਹੱਜ ਇੰਸਪੈਕਟਰ" },
      color: "blue",
    },
    {
      id: "doctor",
      icon: Stethoscope,
      label: { en: "Doctor", ar: "طبيب", ur: "ڈاکٹر", hi: "डॉक्टर", ta: "மருத்துவர்", te: "డాక్టర్", mr: "डॉक्टर", bn: "ডাক্তার", or: "ଡାକ୍ତର", ml: "ഡോക്ടർ", pa: "ਡਾਕਟਰ" },
      color: "red",
    },
    {
      id: "branch",
      icon: Landmark,
      label: { en: "Branch Office", ar: "المكتب الفرعي", ur: "برانچ آفس", hi: "ब्रांच ऑफिस", ta: "கிளை அலுவலகம்", te: "బ్రాంచ్ ఆఫీస్", mr: "शाखा कार्यालय", bn: "শাখা অফিস", or: "ଶାଖା କାର୍ଯ୍ୟାଳୟ", ml: "ബ്രാഞ്ച് ഓഫീസ്", pa: "ਬ੍ਰਾਂਚ ਆਫਿਸ" },
      color: "emerald",
    },
    {
      id: "officials",
      icon: Flag,
      label: { en: "Indian Officials", ar: "المسؤولون الهنود", ur: "بھارتی افسران", hi: "भारतीय अधिकारी", ta: "இந்திய அதிகாரிகள்", te: "భారతీయ అధికారులు", mr: "भारतीय अधिकारी", bn: "ভারতীয় কর্মকর্তা", or: "ଭାରତୀୟ ଅଧିକାରୀ", ml: "ഇന്ത്യൻ ഉദ്യോഗസ്ഥർ", pa: "ਭਾਰਤੀ ਅਧਿਕਾਰੀ" },
      color: "orange",
    },
    {
      id: "emergency",
      icon: Ambulance,
      label: { en: "Emergency", ar: "طوارئ", ur: "ایمرجنسی", hi: "आपातकालीन", ta: "அவசரம்", te: "అత్యవసరం", mr: "आणीबाणी", bn: "জরুরি", or: "ଜରୁରୀ", ml: "അടിയന്തരാവസ്ഥ", pa: "ਐਮਰਜੈਂਸੀ" },
      color: "red",
    },
    {
      id: "medical",
      icon: HeartPulse,
      label: { en: "Medical", ar: "طبي", ur: "طبی", hi: "चिकित्सा", ta: "மருத்துவம்", te: "వైద్యం", mr: "वैद्यकीय", bn: "চিকিৎসা", or: "ଚିକିତ୍ସା", ml: "മെഡിക്കൽ", pa: "ਮੈਡੀਕਲ" },
      color: "pink",
    },
    {
      id: "transport",
      icon: Plane,
      label: { en: "Transport", ar: "النقل", ur: "ٹرانسپورٹ", hi: "परिवहन", ta: "போக்குவரத்து", te: "రవాణా", mr: "वाहतूक", bn: "পরিবহন", or: "ପରିବହନ", ml: "ഗതാഗതം", pa: "ਟਰਾਂਸਪੋਰਟ" },
      color: "sky",
    },
    {
      id: "consulate",
      icon: ShieldCheck,
      label: { en: "Consulate", ar: "القنصلية", ur: "قونصل خانہ", hi: "वाणिज्य दूतावास", ta: "தூதரகம்", te: "కాన్సులేట్", mr: "वाणिज्य दूतावास", bn: "কনস্যুলেট", or: "କନ୍ସୁଲେଟ୍", ml: "കോൺസുലേറ്റ്", pa: "ਕੌਂਸਲੇਟ" },
      color: "indigo",
    },
    {
      id: "accommodation",
      icon: Home,
      label: { en: "Accommodation", ar: "الإقامة", ur: "رہائش", hi: "आवास", ta: "தங்குமிடம்", te: "వసతి", mr: "निवास", bn: "থাকার ব্যবস্থা", or: "ଆବାସ", ml: "താമസം", pa: "ਰਿਹਾਇਸ਼" },
      color: "teal",
    },
    {
      id: "location",
      icon: MapPin,
      label: { en: "Locations", ar: "المواقع", ur: "مقامات", hi: "स्थान", ta: "இடங்கள்", te: "లొకేషన్లు", mr: "ठिकाणे", bn: "অবস্থান", or: "ସ୍ଥାନ", ml: "സ്ഥലങ്ങൾ", pa: "ਟਿਕਾਣੇ" },
      color: "violet",
    },
    {
      id: "group",
      icon: Users,
      label: { en: "Group Leader", ar: "قائد المجموعة", ur: "گروپ لیڈر", hi: "ग्रुप लीडर", ta: "குழு தலைவர்", te: "గ్రూప్ లీడర్", mr: "गट नेता", bn: "গ্রুপ লিডার", or: "ଗୋଷ୍ଠୀ ନେତା", ml: "ഗ്രൂപ്പ് ലീഡർ", pa: "ਗਰੁੱਪ ਲੀਡਰ" },
      color: "fuchsia",
    },
    {
      id: "helpline",
      icon: Phone,
      label: { en: "Helpline", ar: "خط المساعدة", ur: "ہیلپ لائن", hi: "हेल्पलाइन", ta: "உதவி எண்", te: "హెల్ప్‌లైన్", mr: "हेल्पलाइन", bn: "হেল্পলাইন", or: "ହେଲ୍ପଲାଇନ", ml: "ഹെൽപ്പ് ലൈൻ", pa: "ਹੈਲਪਲਾਈਨ" },
      color: "cyan",
    },
    {
      id: "complaints",
      icon: FileText,
      label: { en: "Complaints", ar: "الشكاوى", ur: "شکایات", hi: "शिकायतें", ta: "புகார்கள்", te: "ఫిర్యాదులు", mr: "तक्रारी", bn: "অভিযোগ", or: "ଅଭିଯୋଗ", ml: "പരാതികൾ", pa: "ਸ਼ਿਕਾਇਤਾਂ" },
      color: "yellow",
    },
    {
      id: "info",
      icon: HelpCircle,
      label: { en: "Information", ar: "معلومات", ur: "معلومات", hi: "जानकारी", ta: "தகவல்", te: "సమాచారం", mr: "माहिती", bn: "তথ্য", or: "ସୂଚନା", ml: "വിവരങ്ങൾ", pa: "ਜਾਣਕਾਰੀ" },
      color: "lime",
    },
    {
      id: "saudi",
      icon: ShieldCheck,
      label: { en: "Saudi Services", ar: "خدمات سعودية", ur: "سعودی سروسز", hi: "सऊदी सेवाएं", ta: "சவூதி சேவைகள்", te: "సౌదీ సేవలు", mr: "सौदी सेवा", bn: "সৌদি সেবা", or: "ସାଉଦି ସେବା", ml: "സൗദി സേവനങ്ങൾ", pa: "ਸਾਊਦੀ ਸੇਵਾਵਾਂ" },
      color: "emerald",
    },
  ];

  // Sample contact data for each category
  const contactData: Record<string, Array<{ name: Record<string, string>; number: string; description?: Record<string, string> }>> = {
    building: [
      { name: { en: "Building 101 - Azizia", hi: "बिल्डिंग 101 - अज़ीज़िया", ur: "بلڈنگ 101 - عزیزیہ" }, number: "+966-12-5555101", description: { en: "Sector A, Near Masjid Al-Haram", hi: "सेक्टर A, मस्जिद अल-हराम के पास", ur: "سیکٹر اے، مسجد الحرام کے قریب" } },
      { name: { en: "Building 102 - Azizia", hi: "बिल्डिंग 102 - अज़ीज़िया", ur: "بلڈنگ 102 - عزیزیہ" }, number: "+966-12-5555102", description: { en: "Sector B, Main Road", hi: "सेक्टर B, मुख्य सड़क", ur: "سیکٹر بی، مین روڈ" } },
      { name: { en: "Building 103 - Azizia", hi: "बिल्डिंग 103 - अज़ीज़िया", ur: "بلڈنگ 103 - عزیزیہ" }, number: "+966-12-5555103", description: { en: "Sector C, Near Hospital", hi: "सेक्टर C, अस्पताल के पास", ur: "سیکٹر سی، ہسپتال کے قریب" } },
    ],
    inspector: [
      { name: { en: "Haj Inspector - Sector 1", hi: "हज इंस्पेक्टर - सेक्टर 1", ur: "حج انسپکٹر - سیکٹر 1" }, number: "+966-50-1234567", description: { en: "Buildings 101-110", hi: "बिल्डिंग 101-110", ur: "بلڈنگ 101-110" } },
      { name: { en: "Haj Inspector - Sector 2", hi: "हज इंस्पेक्टर - सेक्टर 2", ur: "حج انسپکٹر - سیکٹر 2" }, number: "+966-50-1234568", description: { en: "Buildings 111-120", hi: "बिल्डिंग 111-120", ur: "بلڈنگ 111-120" } },
      { name: { en: "Senior Inspector - Makkah", hi: "वरिष्ठ इंस्पेक्टर - मक्का", ur: "سینئر انسپکٹر - مکہ" }, number: "+966-50-1234569", description: { en: "Overall Coordination", hi: "समग्र समन्वय", ur: "مجموعی ہم آہنگی" } },
    ],
    doctor: [
      { name: { en: "Indian Medical Dispensary - Makkah", hi: "भारतीय चिकित्सा औषधालय - मक्का", ur: "انڈین میڈیکل ڈسپنسری - مکہ" }, number: "+966-12-5577001", description: { en: "24x7 Emergency", hi: "24x7 आपातकालीन", ur: "24x7 ایمرجنسی" } },
      { name: { en: "Dr. Ahmad Khan (On Duty)", hi: "डॉ. अहमद खान (ड्यूटी पर)", ur: "ڈاکٹر احمد خان (ڈیوٹی پر)" }, number: "+966-50-7778881", description: { en: "General Physician", hi: "जनरल फिजिशियन", ur: "جنرل فزیشین" } },
      { name: { en: "Indian Medical Dispensary - Madinah", hi: "भारतीय चिकित्सा औषधालय - मदीना", ur: "انڈین میڈیکل ڈسپنسری - مدینہ" }, number: "+966-14-8877001", description: { en: "Ambulance Available", hi: "एम्बुलेंस उपलब्ध", ur: "ایمبولینس دستیاب" } },
    ],
    branch: [
      { name: { en: "Indian Haj Mission - Makkah", hi: "भारतीय हज मिशन - मक्का", ur: "انڈین حج مشن - مکہ" }, number: "+966-12-5577000", description: { en: "Head Office", hi: "मुख्यालय", ur: "ہیڈ آفس" } },
      { name: { en: "Branch Office - Azizia", hi: "ब्रांच ऑफिस - अज़ीज़िया", ur: "برانچ آفس - عزیزیہ" }, number: "+966-12-5577010", description: { en: "Near Clock Tower", hi: "क्लॉक टावर के पास", ur: "کلاک ٹاور کے قریب" } },
      { name: { en: "Branch Office - Madinah", hi: "ब्रांच ऑफिस - मदीना", ur: "برانچ آفس - مدینہ" }, number: "+966-14-8877000", description: { en: "Near Prophet's Mosque", hi: "मस्जिद-ए-नबवी के पास", ur: "مسجد نبوی کے قریب" } },
    ],
    officials: [
      { name: { en: "Consul General of India - Jeddah", hi: "भारत के महावाणिज्य दूत - जेद्दा", ur: "قونصل جنرل آف انڈیا - جدہ" }, number: "+966-12-6604571", description: { en: "Emergency Assistance", hi: "आपातकालीन सहायता", ur: "ایمرجنسی امداد" } },
      { name: { en: "Deputy Consul General", hi: "उप महावाणिज्य दूत", ur: "ڈپٹی قونصل جنرل" }, number: "+966-12-6604572", description: { en: "Passport & Visa", hi: "पासपोर्ट और वीज़ा", ur: "پاسپورٹ اور ویزا" } },
      { name: { en: "Haj Officer (India House)", hi: "हज अधिकारी (इंडिया हाउस)", ur: "حج آفیسر (انڈیا ہاؤس)" }, number: "+966-12-6604573", description: { en: "Pilgrim Welfare", hi: "तीर्थयात्री कल्याण", ur: "حاجی فلاح" } },
    ],
    emergency: [
      { name: { en: "Saudi Emergency (Police/Ambulance)", hi: "सऊदी आपातकालीन (पुलिस/एम्बुलेंस)", ur: "سعودی ایمرجنسی (پولیس/ایمبولینس)" }, number: "911", description: { en: "All Emergencies", hi: "सभी आपातस्थितियां", ur: "تمام ایمرجنسی" } },
      { name: { en: "Red Crescent Ambulance", hi: "रेड क्रीसेंट एम्बुलेंस", ur: "ریڈ کریسنٹ ایمبولینس" }, number: "997", description: { en: "Medical Emergency", hi: "चिकित्सा आपातकाल", ur: "طبی ایمرجنسی" } },
      { name: { en: "Indian Emergency Helpline", hi: "भारतीय आपातकालीन हेल्पलाइन", ur: "انڈین ایمرجنسی ہیلپ لائن" }, number: "+966-12-5577999", description: { en: "24x7 Support", hi: "24x7 सहायता", ur: "24x7 مدد" } },
    ],
    medical: [
      { name: { en: "Ajyad Hospital - Makkah", hi: "अजयाद अस्पताल - मक्का", ur: "اجیاد ہسپتال - مکہ" }, number: "+966-12-5600000", description: { en: "Near Haram", hi: "हरम के पास", ur: "حرم کے قریب" } },
      { name: { en: "King Faisal Hospital", hi: "किंग फैसल अस्पताल", ur: "کنگ فیصل ہسپتال" }, number: "+966-12-6677000", description: { en: "Multi-Specialty", hi: "मल्टी-स्पेशलिटी", ur: "ملٹی اسپیشلٹی" } },
    ],
    transport: [
      { name: { en: "Makkah-Madinah Bus Service", hi: "मक्का-मदीना बस सेवा", ur: "مکہ-مدینہ بس سروس" }, number: "+966-12-5577050", description: { en: "Pilgrim Transport", hi: "तीर्थयात्री परिवहन", ur: "حاجی ٹرانسپورٹ" } },
      { name: { en: "Airport Assistance", hi: "एयरपोर्ट सहायता", ur: "ایئرپورٹ اسسٹنس" }, number: "+966-12-6855555", description: { en: "Jeddah Airport", hi: "जेद्दा हवाई अड्डा", ur: "جدہ ایئرپورٹ" } },
    ],
    consulate: [
      { name: { en: "Consulate General of India - Jeddah", hi: "भारत का महावाणिज्य दूतावास - जेद्दा", ur: "قونصلیٹ جنرل آف انڈیا - جدہ" }, number: "+966-12-6604571", description: { en: "Main Office", hi: "मुख्य कार्यालय", ur: "مین آفس" } },
    ],
    accommodation: [
      { name: { en: "Accommodation Helpdesk - Makkah", hi: "आवास हेल्पडेस्क - मक्का", ur: "رہائش ہیلپ ڈیسک - مکہ" }, number: "+966-12-5577030", description: { en: "Room Issues", hi: "कमरे की समस्याएं", ur: "کمرے کے مسائل" } },
      { name: { en: "Accommodation Helpdesk - Madinah", hi: "आवास हेल्पडेस्क - मदीना", ur: "رہائش ہیلپ ڈیسک - مدینہ" }, number: "+966-14-8877030", description: { en: "Room Issues", hi: "कमरे की समस्याएं", ur: "کمرے کے مسائل" } },
    ],
    location: [
      { name: { en: "Location Helpdesk", hi: "लोकेशन हेल्पडेस्क", ur: "لوکیشن ہیلپ ڈیسک" }, number: "+966-12-5577040", description: { en: "Find Buildings & Places", hi: "बिल्डिंग और जगहें खोजें", ur: "بلڈنگ اور جگہیں تلاش کریں" } },
    ],
    group: [
      { name: { en: "Group Coordination Office", hi: "ग्रुप समन्वय कार्यालय", ur: "گروپ کوآرڈینیشن آفس" }, number: "+966-12-5577060", description: { en: "Group Issues", hi: "ग्रुप मामले", ur: "گروپ معاملات" } },
    ],
    helpline: [
      { name: { en: "Indian Haj Mission Helpline", hi: "भारतीय हज मिशन हेल्पलाइन", ur: "انڈین حج مشن ہیلپ لائن" }, number: "1800-11-2346", description: { en: "Toll Free (India)", hi: "टोल फ्री (भारत)", ur: "ٹول فری (بھارت)" } },
      { name: { en: "Haj Committee of India", hi: "हज कमेटी ऑफ इंडिया", ur: "حج کمیٹی آف انڈیا" }, number: "+91-22-22621515", description: { en: "Mumbai Office", hi: "मुंबई कार्यालय", ur: "ممبئی آفس" } },
    ],
    complaints: [
      { name: { en: "Grievance Cell - Makkah", hi: "शिकायत प्रकोष्ठ - मक्का", ur: "شکایات سیل - مکہ" }, number: "+966-12-5577070", description: { en: "File Complaints", hi: "शिकायत दर्ज करें", ur: "شکایت درج کریں" } },
      { name: { en: "Ministry of Hajj Complaints", hi: "हज मंत्रालय शिकायतें", ur: "وزارت حج شکایات" }, number: "920002814", description: { en: "Saudi Government", hi: "सऊदी सरकार", ur: "سعودی حکومت" } },
    ],
    info: [
      { name: { en: "General Information", hi: "सामान्य जानकारी", ur: "عام معلومات" }, number: "+966-12-5577080", description: { en: "All Queries", hi: "सभी प्रश्न", ur: "تمام سوالات" } },
    ],
    saudi: [
      { name: { en: "Ministry of Hajj", hi: "हज मंत्रालय", ur: "وزارت حج" }, number: "920002814", description: { en: "Hajj Services", hi: "हज सेवाएं", ur: "حج خدمات" } },
      { name: { en: "Saudi Police", hi: "सऊदी पुलिस", ur: "سعودی پولیس" }, number: "999", description: { en: "Security", hi: "सुरक्षा", ur: "سیکورٹی" } },
      { name: { en: "Ministry of Health", hi: "स्वास्थ्य मंत्रालय", ur: "وزارت صحت" }, number: "937", description: { en: "Health Services", hi: "स्वास्थ्य सेवाएं", ur: "صحت خدمات" } },
    ],
  };

  const getLocalizedText = (obj: Record<string, string> | undefined) => {
    if (!obj) return "";
    return obj[language] || obj.en || "";
  };

  const filteredCategories = searchQuery
    ? directoryCategories.filter((cat) =>
        getLocalizedText(cat.label).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : directoryCategories;

  return (
    <MainLayout>
      <SEO title="Indian Haj Mission Directory" description="Directory of Indian Haj Mission offices in Makkah, Madinah, and Jeddah with contacts and hours." path="/haj-directory" type="website" jsonLd={{"@context":"https://schema.org","@type":"WebPage","headline":"Indian Haj Mission Directory","description":"Directory of Indian Haj Mission offices in Makkah, Madinah, and Jeddah with contacts and hours.","url":"https://hajjcare.in/haj-directory"}} />
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10 sm:h-9 text-sm">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {getLocalizedText(labels.back)}
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-1.5 sm:space-y-2 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-soft border-2 border-primary/20 mx-auto">
            <Flag className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{getLocalizedText(labels.title)}</h1>
          <p className="text-sm text-muted-foreground">{getLocalizedText(labels.subtitle)}</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={getLocalizedText(labels.searchPlaceholder)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* 16-Icon Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {filteredCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => {
                if (category.id === "inspector") {
                  navigate("/inspector-directory");
                } else {
                  setSelectedCategory(category.id);
                }
              }}
              className="flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group animate-fade-up"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <IconCircle
                icon={category.icon}
                size="md"
                variant={category.color as any}
                className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
              />
              <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight line-clamp-2">
                {getLocalizedText(category.label)}
              </span>
            </button>
          ))}
        </div>

        {/* Quick Emergency Section */}
        <Card className="border-2 border-red-500/30 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Ambulance className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-600">
                  {language === "hi" ? "आपातकालीन" : language === "ur" ? "ایمرجنسی" : "Emergency"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === "hi" ? "तुरंत मदद के लिए" : language === "ur" ? "فوری مدد کے لیے" : "For immediate help"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:911" className="flex items-center justify-center gap-2 bg-red-600 text-white rounded-lg py-3 font-bold text-lg hover:bg-red-700 transition-colors">
                <Phone className="w-5 h-5" />
                911
              </a>
              <a href="tel:+966125577999" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-3 font-medium text-sm hover:bg-primary/90 transition-colors">
                <Phone className="w-4 h-4" />
                {language === "hi" ? "भारतीय हेल्पलाइन" : language === "ur" ? "انڈین ہیلپ لائن" : "Indian Helpline"}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Category Detail Dialog */}
        <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedCategory && (
                  <>
                    <IconCircle
                      icon={directoryCategories.find((c) => c.id === selectedCategory)?.icon || Phone}
                      size="sm"
                      variant={directoryCategories.find((c) => c.id === selectedCategory)?.color as any}
                    />
                    {getLocalizedText(directoryCategories.find((c) => c.id === selectedCategory)?.label)}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {selectedCategory &&
                contactData[selectedCategory]?.map((contact, idx) => (
                  <a key={idx} href={`tel:${contact.number}`} className="block">
                    <Card className="border hover:border-primary/50 transition-colors hover:shadow-md">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{getLocalizedText(contact.name)}</p>
                            {contact.description && (
                              <p className="text-xs text-muted-foreground">{getLocalizedText(contact.description)}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            <p className="font-bold text-primary text-sm">{contact.number}</p>
                            <p className="text-xs text-muted-foreground">{getLocalizedText(labels.tapToCall)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default HajMissionDirectoryPage;
