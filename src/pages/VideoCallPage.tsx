import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  CallControls,
  useCallStateHooks,
  CallingState,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  Video, 
  PhoneCall, 
  Copy, 
  Check, 
  Loader2, 
  LogIn, 
  Heart,
  Shield,
  Wifi,
  WifiOff,
  Clock,
  Users,
  PhoneOff,
  Info
} from "lucide-react";
import { toast } from "sonner";

// Comprehensive 11-language labels for calm, reassurance-focused UI
const labels = {
  title: { 
    en: "Family Reassurance Call", 
    ar: "مكالمة اطمئنان العائلة", 
    ur: "خاندان کی تسلی کی کال", 
    hi: "परिवार आश्वासन कॉल", 
    ta: "குடும்ப நம்பிக்கை அழைப்பு", 
    te: "కుటుంబ భరోసా కాల్", 
    mr: "कुटुंब आश्वासन कॉल", 
    bn: "পারিবারিক আশ্বাস কল", 
    or: "ପରିବାର ଆଶ୍ୱାସନ କଲ", 
    ml: "കുടുംബ ആശ്വാസ കോൾ", 
    pa: "ਪਰਿਵਾਰ ਭਰੋਸਾ ਕਾਲ" 
  },
  subtitle: { 
    en: "A moment of peace with your loved ones", 
    ar: "لحظة سلام مع أحبائك", 
    ur: "اپنے پیاروں کے ساتھ سکون کا لمحہ", 
    hi: "अपने प्रियजनों के साथ शांति का पल", 
    ta: "உங்கள் அன்புக்குரியவர்களுடன் அமைதியான தருணம்", 
    te: "మీ ప్రియమైనవారితో శాంతి క్షణం", 
    mr: "आपल्या प्रियजनांसोबत शांततेचा क्षण", 
    bn: "আপনার প্রিয়জনদের সাথে শান্তির মুহূর্ত", 
    or: "ଆପଣଙ୍କ ପ୍ରିୟଜନଙ୍କ ସହ ଶାନ୍ତିର ମୁହୂର୍ତ୍ତ", 
    ml: "നിങ്ങളുടെ പ്രിയപ്പെട്ടവരുമായി സമാധാനത്തിന്റെ നിമിഷം", 
    pa: "ਆਪਣੇ ਪਿਆਰਿਆਂ ਨਾਲ ਸ਼ਾਂਤੀ ਦਾ ਪਲ" 
  },
  callFamily: { 
    en: "Call Family", 
    ar: "اتصل بالعائلة", 
    ur: "خاندان کو کال کریں", 
    hi: "परिवार को कॉल करें", 
    ta: "குடும்பத்தை அழைக்கவும்", 
    te: "కుటుంబాన్ని కాల్ చేయండి", 
    mr: "कुटुंबाला कॉल करा", 
    bn: "পরিবারকে কল করুন", 
    or: "ପରିବାରକୁ କଲ କରନ୍ତୁ", 
    ml: "കുടുംബത്തെ വിളിക്കുക", 
    pa: "ਪਰਿਵਾਰ ਨੂੰ ਕਾਲ ਕਰੋ" 
  },
  joinFamilyCall: { 
    en: "Join Family Call", 
    ar: "انضم إلى مكالمة العائلة", 
    ur: "خاندان کی کال میں شامل ہوں", 
    hi: "परिवार कॉल में शामिल हों", 
    ta: "குடும்ப அழைப்பில் சேரவும்", 
    te: "కుటుంబ కాల్‌లో చేరండి", 
    mr: "कुटुंब कॉलमध्ये सामील व्हा", 
    bn: "পারিবারিক কলে যোগ দিন", 
    or: "ପରିବାର କଲରେ ଯୋଗ ଦିଅନ୍ତୁ", 
    ml: "കുടുംബ കോളിൽ ചേരുക", 
    pa: "ਪਰਿਵਾਰ ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ" 
  },
  enterCode: { 
    en: "Enter family code", 
    ar: "أدخل رمز العائلة", 
    ur: "خاندان کا کوڈ درج کریں", 
    hi: "परिवार कोड दर्ज करें", 
    ta: "குடும்ப குறியீட்டை உள்ளிடவும்", 
    te: "కుటుంబ కోడ్ నమోదు చేయండి", 
    mr: "कुटुंब कोड प्रविष्ट करा", 
    bn: "পারিবারিক কোড লিখুন", 
    or: "ପରିବାର କୋଡ ପ୍ରବେଶ କରନ୍ତୁ", 
    ml: "കുടുംബ കോഡ് നൽകുക", 
    pa: "ਪਰਿਵਾਰ ਕੋਡ ਦਾਖਲ ਕਰੋ" 
  },
  familyCode: { 
    en: "Family Code", 
    ar: "رمز العائلة", 
    ur: "خاندان کا کوڈ", 
    hi: "परिवार कोड", 
    ta: "குடும்ப குறியீடு", 
    te: "కుటుంబ కోడ్", 
    mr: "कुटुंब कोड", 
    bn: "পারিবারিক কোড", 
    or: "ପରିବାର କୋଡ", 
    ml: "കുടുംബ കോഡ്", 
    pa: "ਪਰਿਵਾਰ ਕੋਡ" 
  },
  copied: { 
    en: "Code copied! Share with family", 
    ar: "تم نسخ الرمز! شاركه مع العائلة", 
    ur: "کوڈ کاپی ہو گیا! خاندان کے ساتھ شیئر کریں", 
    hi: "कोड कॉपी हो गया! परिवार के साथ साझा करें", 
    ta: "குறியீடு நகலெடுக்கப்பட்டது! குடும்பத்துடன் பகிரவும்", 
    te: "కోడ్ కాపీ చేయబడింది! కుటుంబంతో షేర్ చేయండి", 
    mr: "कोड कॉपी झाला! कुटुंबासोबत शेअर करा", 
    bn: "কোড কপি হয়েছে! পরিবারের সাথে শেয়ার করুন", 
    or: "କୋଡ କପି ହୋଇଛି! ପରିବାର ସହ ଅଂଶୀଦାର କରନ୍ତୁ", 
    ml: "കോഡ് പകർത്തി! കുടുംബവുമായി പങ്കിടുക", 
    pa: "ਕੋਡ ਕਾਪੀ ਹੋ ਗਿਆ! ਪਰਿਵਾਰ ਨਾਲ ਸਾਂਝਾ ਕਰੋ" 
  },
  shareCode: { 
    en: "Share this code with ONE family member", 
    ar: "شارك هذا الرمز مع فرد واحد من العائلة", 
    ur: "یہ کوڈ ایک خاندان کے فرد کے ساتھ شیئر کریں", 
    hi: "यह कोड एक परिवार के सदस्य के साथ साझा करें", 
    ta: "இந்த குறியீட்டை ஒரு குடும்ப உறுப்பினருடன் பகிரவும்", 
    te: "ఈ కోడ్‌ను ఒక కుటుంబ సభ్యుడితో షేర్ చేయండి", 
    mr: "हा कोड एका कुटुंबातील सदस्यासोबत शेअर करा", 
    bn: "এই কোডটি এক পরিবারের সদস্যের সাথে শেয়ার করুন", 
    or: "ଏହି କୋଡ ଜଣେ ପରିବାର ସଦସ୍ୟଙ୍କ ସହ ଅଂଶୀଦାର କରନ୍ତୁ", 
    ml: "ഈ കോഡ് ഒരു കുടുംബാംഗവുമായി പങ്കിടുക", 
    pa: "ਇਹ ਕੋਡ ਇੱਕ ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਨਾਲ ਸਾਂਝਾ ਕਰੋ" 
  },
  endCall: { 
    en: "End Call", 
    ar: "إنهاء المكالمة", 
    ur: "کال ختم کریں", 
    hi: "कॉल समाप्त करें", 
    ta: "அழைப்பை முடிக்கவும்", 
    te: "కాల్ ముగించండి", 
    mr: "कॉल समाप्त करा", 
    bn: "কল শেষ করুন", 
    or: "କଲ ଶେଷ କରନ୍ତୁ", 
    ml: "കോൾ അവസാനിപ്പിക്കുക", 
    pa: "ਕਾਲ ਸਮਾਪਤ ਕਰੋ" 
  },
  connecting: { 
    en: "Connecting to your family...", 
    ar: "جاري الاتصال بعائلتك...", 
    ur: "آپ کے خاندان سے جڑ رہے ہیں...", 
    hi: "आपके परिवार से जुड़ रहे हैं...", 
    ta: "உங்கள் குடும்பத்துடன் இணைக்கிறது...", 
    te: "మీ కుటుంబానికి కనెక్ట్ అవుతోంది...", 
    mr: "तुमच्या कुटुंबाशी कनेक्ट होत आहे...", 
    bn: "আপনার পরিবারের সাথে সংযুক্ত হচ্ছে...", 
    or: "ଆପଣଙ୍କ ପରିବାର ସହ ସଂଯୋଗ ହେଉଛି...", 
    ml: "നിങ്ങളുടെ കുടുംബവുമായി ബന്ധിപ്പിക്കുന്നു...", 
    pa: "ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਨਾਲ ਜੁੜ ਰਿਹਾ ਹੈ..." 
  },
  loginRequired: { 
    en: "Please login to call your family", 
    ar: "يرجى تسجيل الدخول للاتصال بعائلتك", 
    ur: "اپنے خاندان کو کال کرنے کے لیے لاگ ان کریں", 
    hi: "अपने परिवार को कॉल करने के लिए लॉगिन करें", 
    ta: "உங்கள் குடும்பத்தை அழைக்க உள்நுழையவும்", 
    te: "మీ కుటుంబాన్ని కాల్ చేయడానికి లాగిన్ అవ్వండి", 
    mr: "तुमच्या कुटुंबाला कॉल करण्यासाठी लॉगिन करा", 
    bn: "আপনার পরিবারকে কল করতে লগইন করুন", 
    or: "ଆପଣଙ୍କ ପରିବାରକୁ କଲ କରିବାକୁ ଲଗଇନ କରନ୍ତୁ", 
    ml: "നിങ്ങളുടെ കുടുംബത്തെ വിളിക്കാൻ ലോഗിൻ ചെയ്യുക", 
    pa: "ਆਪਣੇ ਪਰਿਵਾਰ ਨੂੰ ਕਾਲ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ" 
  },
  login: { 
    en: "Login", 
    ar: "تسجيل الدخول", 
    ur: "لاگ ان", 
    hi: "लॉगिन", 
    ta: "உள்நுழை", 
    te: "లాగిన్", 
    mr: "लॉगिन", 
    bn: "লগইন", 
    or: "ଲଗଇନ", 
    ml: "ലോഗിൻ", 
    pa: "ਲੌਗਇਨ" 
  },
  limitedNotice: { 
    en: "Calls may be limited during Hajj rituals", 
    ar: "قد تكون المكالمات محدودة أثناء مناسك الحج", 
    ur: "حج کی رسومات کے دوران کالز محدود ہو سکتی ہیں", 
    hi: "हज अनुष्ठानों के दौरान कॉल सीमित हो सकती हैं", 
    ta: "ஹஜ் சடங்குகளின் போது அழைப்புகள் குறைக்கப்படலாம்", 
    te: "హజ్ ఆచారాల సమయంలో కాల్స్ పరిమితం కావచ్చు", 
    mr: "हज विधींदरम्यान कॉल मर्यादित असू शकतात", 
    bn: "হজ আচারের সময় কল সীমিত হতে পারে", 
    or: "ହଜ ରୀତିନୀତି ସମୟରେ କଲ ସୀମିତ ହୋଇପାରେ", 
    ml: "ഹജ്ജ് ആചാരങ്ങളിൽ കോളുകൾ പരിമിതമായേക്കാം", 
    pa: "ਹੱਜ ਰਸਮਾਂ ਦੌਰਾਨ ਕਾਲਾਂ ਸੀਮਤ ਹੋ ਸਕਦੀਆਂ ਹਨ" 
  },
  oneToOneOnly: { 
    en: "One-to-one calls only • No group calls", 
    ar: "مكالمات فردية فقط • لا مكالمات جماعية", 
    ur: "صرف ون ٹو ون کالز • کوئی گروپ کالز نہیں", 
    hi: "केवल वन-टू-वन कॉल • कोई ग्रुप कॉल नहीं", 
    ta: "ஒன்றுக்கு ஒன்று அழைப்புகள் மட்டுமே • குழு அழைப்புகள் இல்லை", 
    te: "వన్-టు-వన్ కాల్స్ మాత్రమే • గ్రూప్ కాల్స్ లేవు", 
    mr: "फक्त एक-एक कॉल • कोणतेही ग्रुप कॉल नाहीत", 
    bn: "শুধুমাত্র একে-একে কল • কোনো গ্রুপ কল নেই", 
    or: "କେବଳ ଗୋଟିଏ-ଗୋଟିଏ କଲ • କୌଣସି ଗ୍ରୁପ କଲ ନାହିଁ", 
    ml: "ഒന്നിനൊന്ന് കോളുകൾ മാത്രം • ഗ്രൂപ്പ് കോളുകൾ ഇല്ല", 
    pa: "ਸਿਰਫ਼ ਵਨ-ਟੂ-ਵਨ ਕਾਲਾਂ • ਕੋਈ ਗਰੁੱਪ ਕਾਲਾਂ ਨਹੀਂ" 
  },
  noRecording: { 
    en: "No recording • No call history stored", 
    ar: "لا تسجيل • لا يتم تخزين سجل المكالمات", 
    ur: "کوئی ریکارڈنگ نہیں • کال ہسٹری محفوظ نہیں", 
    hi: "कोई रिकॉर्डिंग नहीं • कॉल हिस्ट्री सेव नहीं", 
    ta: "பதிவு இல்லை • அழைப்பு வரலாறு சேமிக்கப்படவில்லை", 
    te: "రికార్డింగ్ లేదు • కాల్ హిస్టరీ నిల్వ చేయబడదు", 
    mr: "कोणतेही रेकॉर्डिंग नाही • कॉल इतिहास साठवला जात नाही", 
    bn: "কোনো রেকর্ডিং নেই • কল হিস্ট্রি সংরক্ষণ করা হয় না", 
    or: "କୌଣସି ରେକର୍ଡିଂ ନାହିଁ • କଲ ଇତିହାସ ସଂରକ୍ଷିତ ହେଉନାହିଁ", 
    ml: "റെക്കോർഡിംഗ് ഇല്ല • കോൾ ചരിത്രം സംഭരിക്കുന്നില്ല", 
    pa: "ਕੋਈ ਰਿਕਾਰਡਿੰਗ ਨਹੀਂ • ਕਾਲ ਹਿਸਟਰੀ ਸੇਵ ਨਹੀਂ" 
  },
  safetyFirst: { 
    en: "Focus on your Hajj. Family can wait.", 
    ar: "ركز على حجك. العائلة يمكن أن تنتظر.", 
    ur: "اپنے حج پر توجہ دیں۔ خاندان انتظار کر سکتا ہے۔", 
    hi: "अपने हज पर ध्यान दें। परिवार इंतज़ार कर सकता है।", 
    ta: "உங்கள் ஹஜ்ஜில் கவனம் செலுத்துங்கள். குடும்பம் காத்திருக்கும்.", 
    te: "మీ హజ్‌పై దృష్టి పెట్టండి. కుటుంబం వేచి ఉండగలదు.", 
    mr: "तुमच्या हजवर लक्ष केंद्रित करा. कुटुंब थांबू शकतं.", 
    bn: "আপনার হজে মনোযোগ দিন। পরিবার অপেক্ষা করতে পারে।", 
    or: "ଆପଣଙ୍କ ହଜରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ। ପରିବାର ଅପେକ୍ଷା କରିପାରିବ।", 
    ml: "നിങ്ങളുടെ ഹജ്ജിൽ ശ്രദ്ധിക്കുക. കുടുംബം കാത്തിരിക്കും.", 
    pa: "ਆਪਣੇ ਹੱਜ 'ਤੇ ਧਿਆਨ ਦਿਓ। ਪਰਿਵਾਰ ਉਡੀਕ ਕਰ ਸਕਦਾ ਹੈ।" 
  },
  lowBandwidth: { 
    en: "Weak connection detected", 
    ar: "تم اكتشاف اتصال ضعيف", 
    ur: "کمزور کنکشن کا پتہ چلا", 
    hi: "कमज़ोर कनेक्शन का पता चला", 
    ta: "பலவீனமான இணைப்பு கண்டறியப்பட்டது", 
    te: "బలహీనమైన కనెక్షన్ గుర్తించబడింది", 
    mr: "कमकुवत कनेक्शन आढळले", 
    bn: "দুর্বল সংযোগ সনাক্ত করা হয়েছে", 
    or: "ଦୁର୍ବଳ ସଂଯୋଗ ଚିହ୍ନଟ ହୋଇଛି", 
    ml: "ദുർബലമായ കണക്ഷൻ കണ്ടെത്തി", 
    pa: "ਕਮਜ਼ੋਰ ਕਨੈਕਸ਼ਨ ਦਾ ਪਤਾ ਲੱਗਾ" 
  },
  goodConnection: { 
    en: "Good connection", 
    ar: "اتصال جيد", 
    ur: "اچھا کنکشن", 
    hi: "अच्छा कनेक्शन", 
    ta: "நல்ல இணைப்பு", 
    te: "మంచి కనెక్షన్", 
    mr: "चांगले कनेक्शन", 
    bn: "ভালো সংযোগ", 
    or: "ଭଲ ସଂଯୋଗ", 
    ml: "നല്ല കണക്ഷൻ", 
    pa: "ਚੰਗਾ ਕਨੈਕਸ਼ਨ" 
  },
};

// Connection quality hook
function useConnectionQuality() {
  const [quality, setQuality] = useState<"good" | "weak" | "offline">("good");

  useEffect(() => {
    const updateQuality = () => {
      if (!navigator.onLine) {
        setQuality("offline");
        return;
      }
      
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          setQuality("weak");
        } else {
          setQuality("good");
        }
      }
    };

    updateQuality();
    
    window.addEventListener("online", updateQuality);
    window.addEventListener("offline", updateQuality);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener("change", updateQuality);
    }

    return () => {
      window.removeEventListener("online", updateQuality);
      window.removeEventListener("offline", updateQuality);
      if (connection) {
        connection.removeEventListener("change", updateQuality);
      }
    };
  }, []);

  return quality;
}

// Connection status indicator
function ConnectionIndicator() {
  const quality = useConnectionQuality();
  const { language } = useLanguage();

  if (quality === "offline") {
    return (
      <div className="flex items-center gap-2 text-destructive bg-destructive/10 px-4 py-2 rounded-full">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">Offline</span>
      </div>
    );
  }

  if (quality === "weak") {
    return (
      <div className="flex items-center gap-2 text-amber-600 bg-amber-500/10 px-4 py-2 rounded-full">
        <Wifi className="h-4 w-4" />
        <span className="text-sm font-medium">{labels.lowBandwidth[language] || labels.lowBandwidth.en}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600 bg-green-500/10 px-4 py-2 rounded-full">
      <Wifi className="h-4 w-4" />
      <span className="text-sm font-medium">{labels.goodConnection[language] || labels.goodConnection.en}</span>
    </div>
  );
}

// Calming call UI with minimal distractions
function CallUI({ callId, onLeave }: { callId: string; onLeave: () => void }) {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(callId);
    setCopied(true);
    toast.success(labels.copied[language] || labels.copied.en);
    setTimeout(() => setCopied(false), 3000);
  };

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Heart className="h-12 w-12 text-primary" />
        </div>
        <p className="text-xl text-muted-foreground text-center">
          {labels.connecting[language] || labels.connecting.en}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Family code display - for sharing */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{labels.familyCode[language] || labels.familyCode.en}</p>
            <p className="font-mono text-2xl font-bold tracking-wider">{callId.slice(-8).toUpperCase()}</p>
          </div>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleCopy}
            className="h-14 w-14 rounded-full"
          >
            {copied ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          {labels.shareCode[language] || labels.shareCode.en}
        </p>
      </div>

      {/* Video area - simple speaker layout */}
      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>

      {/* Large end call button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onLeave}
          variant="destructive"
          size="lg"
          className="h-20 px-12 rounded-full text-xl gap-3 shadow-lg hover:shadow-xl transition-all"
        >
          <PhoneOff className="h-8 w-8" />
          {labels.endCall[language] || labels.endCall.en}
        </Button>
      </div>
    </div>
  );
}

// Main page component
export default function VideoCallPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const connectionQuality = useConnectionQuality();
  
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<StreamVideoClient["call"]> | null>(null);
  const [callId, setCallId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initializeClient = useCallback(async () => {
    if (!user) return null;

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return null;

      const response = await supabase.functions.invoke("stream-video-token", {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (response.error) {
        console.error("Failed to get Stream token:", response.error);
        toast.error("Failed to initialize video call");
        return null;
      }

      const { token, userId, userName, apiKey } = response.data;

      const streamClient = new StreamVideoClient({
        apiKey,
        user: {
          id: userId,
          name: userName,
        },
        token,
      });

      setClient(streamClient);
      return streamClient;
    } catch (error) {
      console.error("Error initializing Stream client:", error);
      toast.error("Failed to initialize video call");
      return null;
    }
  }, [user]);

  useEffect(() => {
    if (user && !client) {
      initializeClient();
    }

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [user, client, initializeClient]);

  const startFamilyCall = async () => {
    if (connectionQuality === "offline") {
      toast.error("No internet connection");
      return;
    }

    setIsLoading(true);
    try {
      let streamClient = client;
      if (!streamClient) {
        streamClient = await initializeClient();
        if (!streamClient) {
          setIsLoading(false);
          return;
        }
      }

      // Generate simple family code
      const familyCode = `family-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newCall = streamClient.call("default", familyCode);
      
      await newCall.join({ create: true });
      
      setCall(newCall);
      setCallId(familyCode);
    } catch (error) {
      console.error("Error creating call:", error);
      toast.error("Failed to start call");
    } finally {
      setIsLoading(false);
    }
  };

  const joinFamilyCall = async () => {
    if (!joinCode.trim()) return;
    if (connectionQuality === "offline") {
      toast.error("No internet connection");
      return;
    }
    
    setIsLoading(true);
    try {
      let streamClient = client;
      if (!streamClient) {
        streamClient = await initializeClient();
        if (!streamClient) {
          setIsLoading(false);
          return;
        }
      }

      // Handle short code input - try to find matching call
      const codeToJoin = joinCode.trim().toLowerCase();
      const existingCall = streamClient.call("default", codeToJoin.includes("family-") ? codeToJoin : `family-${codeToJoin}`);
      
      await existingCall.join();
      
      setCall(existingCall);
      setCallId(codeToJoin);
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Could not join. Check the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveCall = async () => {
    if (call) {
      await call.leave();
      setCall(null);
      setCallId("");
      setJoinCode("");
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Heart className="h-8 w-8 text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <MainLayout>
        <div className="container max-w-md mx-auto py-12 px-4">
          <Card className="text-center border-2">
            <CardContent className="pt-10 pb-8 space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
                <p className="text-muted-foreground text-lg">
                  {labels.loginRequired[language] || labels.loginRequired.en}
                </p>
              </div>
              <Button 
                onClick={() => navigate("/auth")} 
                size="lg"
                className="w-full h-16 text-lg gap-3 rounded-xl"
              >
                <LogIn className="h-6 w-6" />
                {labels.login[language] || labels.login.en}
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Active call
  if (call && client) {
    return (
      <MainLayout>
        <div className="container max-w-2xl mx-auto py-6 px-4">
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallUI callId={callId} onLeave={leaveCall} />
            </StreamCall>
          </StreamVideo>
        </div>
      </MainLayout>
    );
  }

  // Main interface - calm, simple, elderly-friendly
  return (
    <MainLayout>
      <div className="container max-w-lg mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{labels.title[language] || labels.title.en}</h1>
            <p className="text-muted-foreground text-lg">{labels.subtitle[language] || labels.subtitle.en}</p>
          </div>
          
          {/* Connection status */}
          <div className="flex justify-center">
            <ConnectionIndicator />
          </div>
        </div>

        {/* Important notices - calm, not alarming */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-5 space-y-3">
            <div className="flex items-start gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm">{labels.limitedNotice[language] || labels.limitedNotice.en}</p>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Users className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm">{labels.oneToOneOnly[language] || labels.oneToOneOnly.en}</p>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Shield className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm">{labels.noRecording[language] || labels.noRecording.en}</p>
            </div>
          </CardContent>
        </Card>

        {/* Main action - Start call */}
        <Button
          onClick={startFamilyCall}
          disabled={isLoading || connectionQuality === "offline"}
          size="lg"
          className="w-full h-20 text-xl gap-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Video className="h-8 w-8" />
          )}
          {labels.callFamily[language] || labels.callFamily.en}
        </Button>

        {/* Join existing call */}
        <Card className="border-2">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PhoneCall className="h-5 w-5" />
              <span className="font-medium">{labels.joinFamilyCall[language] || labels.joinFamilyCall.en}</span>
            </div>
            
            <Input
              placeholder={labels.enterCode[language] || labels.enterCode.en}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="h-16 text-xl text-center font-mono tracking-widest rounded-xl"
              maxLength={20}
            />
            
            <Button
              onClick={joinFamilyCall}
              disabled={isLoading || !joinCode.trim() || connectionQuality === "offline"}
              variant="secondary"
              size="lg"
              className="w-full h-14 text-lg gap-3 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <PhoneCall className="h-5 w-5" />
              )}
              {labels.joinFamilyCall[language] || labels.joinFamilyCall.en}
            </Button>
          </CardContent>
        </Card>

        {/* Gentle reminder */}
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Info className="h-4 w-4" />
            {labels.safetyFirst[language] || labels.safetyFirst.en}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
