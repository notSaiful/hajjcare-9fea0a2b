import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  useCallStateHooks,
  CallingState,
  NoiseCancellationProvider,
  useNoiseCancellation,
} from "@stream-io/video-react-sdk";
import { NoiseCancellation } from "@stream-io/audio-filters-web";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { PhoneInputWithCountry } from "@/components/PhoneInputWithCountry";
import { OutgoingCallScreen } from "@/components/OutgoingCallScreen";
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
  Info,
  Volume2,
  VolumeX,
  AlertCircle,
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
  callThisNumber: { 
    en: "Call This Number", 
    ar: "اتصل بهذا الرقم", 
    ur: "اس نمبر پر کال کریں", 
    hi: "इस नंबर पर कॉल करें", 
    ta: "இந்த எண்ணை அழைக்கவும்", 
    te: "ఈ నంబర్‌కు కాల్ చేయండి", 
    mr: "या नंबरवर कॉल करा", 
    bn: "এই নম্বরে কল করুন", 
    or: "ଏହି ନମ୍ବରରେ କଲ କରନ୍ତୁ", 
    ml: "ഈ നമ്പറിലേക്ക് വിളിക്കുക", 
    pa: "ਇਸ ਨੰਬਰ 'ਤੇ ਕਾਲ ਕਰੋ" 
  },
  orJoinCall: { 
    en: "Or join with a code", 
    ar: "أو انضم باستخدام رمز", 
    ur: "یا کوڈ کے ساتھ شامل ہوں", 
    hi: "या कोड के साथ शामिल हों", 
    ta: "அல்லது குறியீட்டுடன் சேரவும்", 
    te: "లేదా కోడ్‌తో చేరండి", 
    mr: "किंवा कोडसह सामील व्हा", 
    bn: "অথবা কোড দিয়ে যোগ দিন", 
    or: "କିମ୍ବା କୋଡ ସହ ଯୋଗ ଦିଅନ୍ତୁ", 
    ml: "അല്ലെങ്കിൽ കോഡ് ഉപയോഗിച്ച് ചേരുക", 
    pa: "ਜਾਂ ਕੋਡ ਨਾਲ ਸ਼ਾਮਲ ਹੋਵੋ" 
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
  noiseCancellationOn: { 
    en: "Clear Audio ON", 
    ar: "صوت واضح مفعل", 
    ur: "صاف آڈیو آن", 
    hi: "स्पष्ट ऑडियो चालू", 
    ta: "தெளிவான ஆடியோ இயக்கம்", 
    te: "స్పష్టమైన ఆడియో ఆన్", 
    mr: "स्पष्ट ऑडिओ चालू", 
    bn: "পরিষ্কার অডিও চালু", 
    or: "ସ୍ୱଚ୍ଛ ଅଡିଓ ଚାଲୁ", 
    ml: "വ്യക്തമായ ഓഡിയോ ഓൺ", 
    pa: "ਸਾਫ਼ ਆਡੀਓ ਚਾਲੂ" 
  },
  noiseCancellationOff: { 
    en: "Clear Audio OFF", 
    ar: "صوت واضح متوقف", 
    ur: "صاف آڈیو آف", 
    hi: "स्पष्ट ऑडियो बंद", 
    ta: "தெளிவான ஆடியோ அணைப்பு", 
    te: "స్పష్టమైన ఆడియో ఆఫ్", 
    mr: "स्पष्ट ऑडिओ बंद", 
    bn: "পরিষ্কার অডিও বন্ধ", 
    or: "ସ୍ୱଚ୍ଛ ଅଡିଓ ବନ୍ଦ", 
    ml: "വ്യക്തമായ ഓഡിയോ ഓഫ്", 
    pa: "ਸਾਫ਼ ਆਡੀਓ ਬੰਦ" 
  },
  clearerAudio: { 
    en: "Clearer audio for noisy environments", 
    ar: "صوت أوضح للبيئات الصاخبة", 
    ur: "شور والے ماحول کے لیے صاف آواز", 
    hi: "शोर भरे वातावरण के लिए स्पष्ट ऑडियो", 
    ta: "சத்தமான சூழலுக்கு தெளிவான ஆடியோ", 
    te: "శబ్దంతో కూడిన వాతావరణాల కోసం స్పష్టమైన ఆడియో", 
    mr: "गोंगाटाच्या वातावरणासाठी स्पष्ट ऑडिओ", 
    bn: "শোরগোল পরিবেশের জন্য পরিষ্কার অডিও", 
    or: "ଗୋଳମାଳିଆ ପରିବେଶ ପାଇଁ ସ୍ୱଚ୍ଛ ଅଡିଓ", 
    ml: "ശബ്ദമുള്ള പരിതസ്ഥിതികൾക്കുള്ള വ്യക്തമായ ഓഡിയോ", 
    pa: "ਸ਼ੋਰ ਭਰੇ ਮਾਹੌਲ ਲਈ ਸਾਫ਼ ਆਡੀਓ" 
  },
  userNotFound: {
    en: "This person hasn't registered on HajjCare yet",
    ar: "هذا الشخص لم يسجل في حج كير بعد",
    ur: "یہ شخص ابھی حج کیئر پر رجسٹرڈ نہیں ہے",
    hi: "यह व्यक्ति अभी हज केयर पर पंजीकृत नहीं है",
    ta: "இந்த நபர் இன்னும் ஹஜ்கேரில் பதிவு செய்யவில்லை",
    te: "ఈ వ్యక్తి ఇంకా హజ్‌కేర్‌లో నమోదు కాలేదు",
    mr: "या व्यक्तीने अजून हजकेअरवर नोंदणी केलेली नाही",
    bn: "এই ব্যক্তি এখনও হজ কেয়ারে নিবন্ধন করেননি",
    or: "ଏହି ବ୍ୟକ୍ତି ଏପର୍ଯ୍ୟନ୍ତ ହଜକେୟାରରେ ପଞ୍ଜିକୃତ ହୋଇନାହାନ୍ତି",
    ml: "ഈ വ്യക്തി ഇതുവരെ ഹജ്ജ് കെയറിൽ രജിസ്റ്റർ ചെയ്തിട്ടില്ല",
    pa: "ਇਹ ਵਿਅਕਤੀ ਅਜੇ ਹੱਜ ਕੇਅਰ 'ਤੇ ਰਜਿਸਟਰਡ ਨਹੀਂ ਹੈ",
  },
  askToInstall: {
    en: "Ask them to install HajjCare and enable Family Sharing",
    ar: "اطلب منهم تثبيت حج كير وتمكين مشاركة العائلة",
    ur: "انہیں حج کیئر انسٹال کرنے اور فیملی شیئرنگ فعال کرنے کو کہیں",
    hi: "उन्हें हज केयर इंस्टॉल करने और परिवार साझाकरण सक्षम करने के लिए कहें",
    ta: "ஹஜ்கேர் நிறுவி குடும்ப பகிர்வை இயக்கச் சொல்லுங்கள்",
    te: "హజ్‌కేర్ ఇన్‌స్టాల్ చేసి ఫ్యామిలీ షేరింగ్ ఎనేబుల్ చేయమని వారిని అడగండి",
    mr: "त्यांना हजकेअर इंस्टॉल करण्यास आणि फॅमिली शेअरिंग सक्षम करण्यास सांगा",
    bn: "তাদের হজ কেয়ার ইনস্টল করতে এবং পারিবারিক শেয়ারিং সক্ষম করতে বলুন",
    or: "ସେମାନଙ୍କୁ ହଜକେୟାର ଇନଷ୍ଟଲ କରି ଫ୍ୟାମିଲି ସେୟାରିଂ ସକ୍ଷମ କରିବାକୁ କୁହନ୍ତୁ",
    ml: "ഹജ്ജ് കെയർ ഇൻസ്റ്റാൾ ചെയ്യാനും ഫാമിലി ഷെയറിംഗ് പ്രവർത്തനക്ഷമമാക്കാനും അവരോട് ആവശ്യപ്പെടുക",
    pa: "ਉਨ੍ਹਾਂ ਨੂੰ ਹੱਜ ਕੇਅਰ ਇੰਸਟਾਲ ਕਰਨ ਅਤੇ ਫੈਮਿਲੀ ਸ਼ੇਅਰਿੰਗ ਸਮਰੱਥ ਕਰਨ ਲਈ ਕਹੋ",
  },
  lookingUp: {
    en: "Finding family member...",
    ar: "جارٍ البحث عن فرد العائلة...",
    ur: "خاندان کے فرد کو تلاش کر رہے ہیں...",
    hi: "परिवार के सदस्य को खोज रहे हैं...",
    ta: "குடும்ப உறுப்பினரைத் தேடுகிறது...",
    te: "కుటుంబ సభ్యుడిని కనుగొంటోంది...",
    mr: "कुटुंबातील सदस्य शोधत आहे...",
    bn: "পরিবারের সদস্য খুঁজছে...",
    or: "ପରିବାର ସଦସ୍ୟ ଖୋଜୁଛି...",
    ml: "കുടുംബാംഗത്തെ കണ്ടെത്തുന്നു...",
    pa: "ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਲੱਭ ਰਿਹਾ ਹੈ...",
  },
  recipientMustHaveAppOpen: {
    en: "Note: They must have HajjCare open to receive the call",
    ar: "ملاحظة: يجب أن يكون تطبيق حج كير مفتوحاً لديهم لاستقبال المكالمة",
    ur: "نوٹ: کال وصول کرنے کے لیے ان کے پاس حج کیئر کھلا ہونا ضروری ہے",
    hi: "नोट: कॉल प्राप्त करने के लिए उनके पास हज केयर खुला होना चाहिए",
    ta: "குறிப்பு: அழைப்பைப் பெற அவர்களிடம் ஹஜ்கேர் திறந்திருக்க வேண்டும்",
    te: "గమనిక: కాల్ స్వీకరించడానికి వారికి హజ్‌కేర్ ఓపెన్‌గా ఉండాలి",
    mr: "टीप: कॉल प्राप्त करण्यासाठी त्यांचे हजकेअर उघडे असणे आवश्यक आहे",
    bn: "দ্রষ্টব্য: কল পেতে তাদের হজ কেয়ার খোলা থাকতে হবে",
    or: "ଟିପ୍ପଣୀ: କଲ ଗ୍ରହଣ କରିବାକୁ ସେମାନଙ୍କର ହଜକେୟାର ଖୋଲା ଥିବା ଆବଶ୍ୟକ",
    ml: "കുറിപ്പ്: കോൾ സ്വീകരിക്കാൻ അവരുടെ ഹജ്ജ് കെയർ തുറന്നിരിക്കണം",
    pa: "ਨੋਟ: ਕਾਲ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਉਨ੍ਹਾਂ ਕੋਲ ਹੱਜ ਕੇਅਰ ਖੁੱਲ੍ਹਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ",
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

// Noise cancellation toggle button
function NoiseCancellationToggle() {
  const { isSupported, isEnabled, setEnabled } = useNoiseCancellation();
  const { language } = useLanguage();

  // Don't show if not supported
  if (isSupported === false) return null;
  
  // Show loading state while checking
  if (isSupported === undefined) {
    return (
      <div className="flex items-center gap-3 bg-muted/50 px-4 py-3 rounded-xl animate-pulse">
        <Volume2 className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">...</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEnabled(!isEnabled)}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${
        isEnabled 
          ? "bg-green-500/20 text-green-600 border border-green-500/30" 
          : "bg-muted/50 text-muted-foreground border border-border"
      }`}
    >
      {isEnabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
      <div className="text-left">
        <p className="text-sm font-medium">
          {isEnabled 
            ? (labels.noiseCancellationOn[language] || labels.noiseCancellationOn.en)
            : (labels.noiseCancellationOff[language] || labels.noiseCancellationOff.en)
          }
        </p>
        <p className="text-xs opacity-70">
          {labels.clearerAudio[language] || labels.clearerAudio.en}
        </p>
      </div>
    </button>
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

      {/* Noise Cancellation toggle - for noisy Hajj environments */}
      <div className="flex justify-center">
        <NoiseCancellationToggle />
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
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const connectionQuality = useConnectionQuality();
  
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<ReturnType<StreamVideoClient["call"]> | null>(null);
  const [callId, setCallId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [familyPhone, setFamilyPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [callState, setCallState] = useState<"idle" | "looking-up" | "outgoing" | "connected">("idle");
  const [calleeName, setCalleeName] = useState("");

  // Initialize noise cancellation for clearer audio in noisy Hajj environments
  const noiseCancellation = useMemo(() => new NoiseCancellation(), []);

  // Check for incoming call ID in URL params (from GlobalCallListener redirect)
  useEffect(() => {
    const incomingCallId = searchParams.get("callId");
    if (incomingCallId && client && !call) {
      // Join the call that was accepted via incoming call overlay
      const joinIncomingCall = async () => {
        try {
          const incomingCall = client.call("default", incomingCallId);
          await incomingCall.join();
          setCall(incomingCall);
          setCallId(incomingCallId);
          setCallState("connected");
        } catch (error) {
          console.error("Error joining incoming call:", error);
          toast.error("Failed to join call");
        }
      };
      joinIncomingCall();
    }
  }, [searchParams, client, call]);

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

  // Call family member by phone number - uses ring call
  const startFamilyCall = async () => {
    if (connectionQuality === "offline") {
      toast.error("No internet connection");
      return;
    }

    const fullPhone = `${countryCode}${familyPhone}`;
    
    if (familyPhone.length < 6) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setCallState("looking-up");
    
    try {
      let streamClient = client;
      if (!streamClient) {
        streamClient = await initializeClient();
        if (!streamClient) {
          setIsLoading(false);
          setCallState("idle");
          return;
        }
      }

      // Get current session for auth
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Please login first");
        setIsLoading(false);
        setCallState("idle");
        return;
      }

      // Look up the recipient by phone number
      const lookupResponse = await supabase.functions.invoke("lookup-user-by-phone", {
        body: { phone: fullPhone },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (lookupResponse.error) {
        console.error("Lookup error:", lookupResponse.error);
        toast.error("Failed to look up family member");
        setIsLoading(false);
        setCallState("idle");
        return;
      }

      const { found, userId: recipientUserId, userName: recipientName } = lookupResponse.data;

      if (!found || !recipientUserId) {
        // User not found - show helpful message
        toast.error(labels.userNotFound[language] || labels.userNotFound.en, {
          description: labels.askToInstall[language] || labels.askToInstall.en,
          duration: 5000,
        });
        setIsLoading(false);
        setCallState("idle");
        return;
      }

      // Create a ring call with the recipient
      const familyCode = `call-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newCall = streamClient.call("default", familyCode);
      
      // Create call with ring: true to notify the recipient
      await newCall.getOrCreate({
        ring: true,
        data: {
          members: [
            { user_id: user!.id },
            { user_id: recipientUserId },
          ],
        },
      });
      
      setCall(newCall);
      setCallId(familyCode);
      setCalleeName(recipientName || "Family Member");
      setCallState("outgoing");

      // Listen for call state changes
      newCall.on("call.accepted", () => {
        setCallState("connected");
      });

      newCall.on("call.rejected", () => {
        toast.error("Call was declined");
        leaveCall();
      });

      newCall.on("call.ended", () => {
        leaveCall();
      });

    } catch (error) {
      console.error("Error creating call:", error);
      toast.error("Failed to start call");
      setCallState("idle");
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
      const existingCall = streamClient.call("default", codeToJoin.includes("call-") || codeToJoin.includes("family-") ? codeToJoin : `family-${codeToJoin}`);
      
      await existingCall.join();
      
      setCall(existingCall);
      setCallId(codeToJoin);
      setCallState("connected");
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Could not join. Check the code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveCall = async () => {
    if (call) {
      try {
        await call.leave();
      } catch (e) {
        // Ignore errors on leave
      }
      setCall(null);
      setCallId("");
      setJoinCode("");
      setCallState("idle");
      setCalleeName("");
    }
  };

  const cancelOutgoingCall = async () => {
    if (call) {
      try {
        await call.leave({ reject: true });
      } catch (e) {
        // Ignore errors
      }
    }
    setCall(null);
    setCallId("");
    setCallState("idle");
    setCalleeName("");
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

  // Outgoing call - ringing
  if (callState === "outgoing" && call && client) {
    return (
      <MainLayout>
        <div className="container max-w-lg mx-auto py-8 px-4">
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <OutgoingCallScreen 
                call={call} 
                calleeName={calleeName}
                onCancel={cancelOutgoingCall}
              />
            </StreamCall>
          </StreamVideo>
        </div>
      </MainLayout>
    );
  }

  // Active call with noise cancellation for clearer audio
  if ((callState === "connected" || call) && client) {
    return (
      <MainLayout>
        <div className="container max-w-2xl mx-auto py-6 px-4">
          <StreamVideo client={client}>
            <StreamCall call={call!}>
              <NoiseCancellationProvider noiseCancellation={noiseCancellation}>
                <CallUI callId={callId} onLeave={leaveCall} />
              </NoiseCancellationProvider>
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

        {/* Phone number input - Main calling method with ring calls */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6 space-y-5">
            <PhoneInputWithCountry
              value={familyPhone}
              countryCode={countryCode}
              onValueChange={setFamilyPhone}
              onCountryCodeChange={setCountryCode}
            />
            
            {/* Note about recipient needing app open */}
            <div className="flex items-start gap-2 text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="text-xs">
                {labels.recipientMustHaveAppOpen[language] || labels.recipientMustHaveAppOpen.en}
              </p>
            </div>
            
            <Button
              onClick={startFamilyCall}
              disabled={isLoading || connectionQuality === "offline" || familyPhone.length < 6}
              size="lg"
              className="w-full h-20 text-xl gap-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin" />
                  {callState === "looking-up" 
                    ? (labels.lookingUp[language] || labels.lookingUp.en)
                    : (labels.connecting[language] || labels.connecting.en)
                  }
                </>
              ) : (
                <>
                  <Video className="h-8 w-8" />
                  {labels.callThisNumber[language] || labels.callThisNumber.en}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Join existing call - Secondary option (fallback) */}
        <Card className="border border-border">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PhoneCall className="h-5 w-5" />
              <span className="font-medium">{labels.orJoinCall[language] || labels.orJoinCall.en}</span>
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
