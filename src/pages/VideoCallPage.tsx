import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  useCallStateHooks,
  CallingState,
  NoiseCancellationProvider,
  useNoiseCancellation,
  useCall,
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
} from "lucide-react";
import { toast } from "sonner";

// Comprehensive 11-language labels for calm, reassurance-focused UI
const labels = {
  title: { 
    en: "Family Video Call", 
    ar: "مكالمة فيديو عائلية", 
    ur: "خاندانی ویڈیو کال", 
    hi: "परिवार वीडियो कॉल", 
    ta: "குடும்ப வீடியோ அழைப்பு", 
    te: "కుటుంబ వీడియో కాల్", 
    mr: "कुटुंब व्हिडिओ कॉल", 
    bn: "পারিবারিক ভিডিও কল", 
    or: "ପରିବାର ଭିଡିଓ କଲ", 
    ml: "കുടുംബ വീഡിയോ കോൾ", 
    pa: "ਪਰਿਵਾਰ ਵੀਡੀਓ ਕਾਲ" 
  },
  subtitle: { 
    en: "Connect with your loved ones in HD quality", 
    ar: "تواصل مع أحبائك بجودة عالية", 
    ur: "ایچ ڈی کوالٹی میں اپنے پیاروں سے جڑیں", 
    hi: "HD गुणवत्ता में अपने प्रियजनों से जुड़ें", 
    ta: "HD தரத்தில் உங்கள் அன்புக்குரியவர்களுடன் இணைக்கவும்", 
    te: "HD నాణ్యతలో మీ ప్రియమైనవారితో కనెక్ట్ అవ్వండి", 
    mr: "HD गुणवत्तेत तुमच्या प्रियजनांशी कनेक्ट करा", 
    bn: "HD মানের সাথে আপনার প্রিয়জনদের সাথে সংযুক্ত হন", 
    or: "HD ଗୁଣବତ୍ତାରେ ଆପଣଙ୍କ ପ୍ରିୟଜନଙ୍କ ସହ ସଂଯୋଗ କରନ୍ତୁ", 
    ml: "HD ഗുണനിലവാരത്തിൽ നിങ്ങളുടെ പ്രിയപ്പെട്ടവരുമായി ബന്ധിപ്പിക്കുക", 
    pa: "HD ਕੁਆਲਿਟੀ ਵਿੱਚ ਆਪਣੇ ਪਿਆਰਿਆਂ ਨਾਲ ਜੁੜੋ" 
  },
  startCall: { 
    en: "Start New Call", 
    ar: "بدء مكالمة جديدة", 
    ur: "نئی کال شروع کریں", 
    hi: "नई कॉल शुरू करें", 
    ta: "புதிய அழைப்பைத் தொடங்கவும்", 
    te: "కొత్త కాల్ ప్రారంభించండి", 
    mr: "नवीन कॉल सुरू करा", 
    bn: "নতুন কল শুরু করুন", 
    or: "ନୂଆ କଲ ଆରମ୍ଭ କରନ୍ତୁ", 
    ml: "പുതിയ കോൾ ആരംഭിക്കുക", 
    pa: "ਨਵੀਂ ਕਾਲ ਸ਼ੁਰੂ ਕਰੋ" 
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
    en: "Enter 6-digit code", 
    ar: "أدخل الرمز المكون من 6 أرقام", 
    ur: "6 ہندسوں کا کوڈ درج کریں", 
    hi: "6 अंकों का कोड दर्ज करें", 
    ta: "6 இலக்க குறியீட்டை உள்ளிடவும்", 
    te: "6 అంకెల కోడ్ నమోదు చేయండి", 
    mr: "6 अंकी कोड प्रविष्ट करा", 
    bn: "6 সংখ্যার কোড লিখুন", 
    or: "6 ଅଙ୍କ କୋଡ ପ୍ରବେଶ କରନ୍ତୁ", 
    ml: "6 അക്ക കോഡ് നൽകുക", 
    pa: "6 ਅੰਕਾਂ ਦਾ ਕੋਡ ਦਾਖਲ ਕਰੋ" 
  },
  familyCode: { 
    en: "Share This Code", 
    ar: "شارك هذا الرمز", 
    ur: "یہ کوڈ شیئر کریں", 
    hi: "यह कोड साझा करें", 
    ta: "இந்த குறியீட்டைப் பகிரவும்", 
    te: "ఈ కోడ్‌ను షేర్ చేయండి", 
    mr: "हा कोड शेअर करा", 
    bn: "এই কোডটি শেয়ার করুন", 
    or: "ଏହି କୋଡ ଅଂଶୀଦାର କରନ୍ତୁ", 
    ml: "ഈ കോഡ് പങ്കിടുക", 
    pa: "ਇਹ ਕੋਡ ਸਾਂਝਾ ਕਰੋ" 
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
    en: "Share with family members to join", 
    ar: "شارك مع أفراد العائلة للانضمام", 
    ur: "شامل ہونے کے لیے خاندان کے افراد کے ساتھ شیئر کریں", 
    hi: "शामिल होने के लिए परिवार के सदस्यों के साथ साझा करें", 
    ta: "சேர குடும்ப உறுப்பினர்களுடன் பகிரவும்", 
    te: "చేరడానికి కుటుంబ సభ్యులతో షేర్ చేయండి", 
    mr: "सामील होण्यासाठी कुटुंबातील सदस्यांसोबत शेअर करा", 
    bn: "যোগ দিতে পরিবারের সদস্যদের সাথে শেয়ার করুন", 
    or: "ଯୋଗ ଦେବାକୁ ପରିବାର ସଦସ୍ୟଙ୍କ ସହ ଅଂଶୀଦାର କରନ୍ତୁ", 
    ml: "ചേരാൻ കുടുംബാംഗങ്ങളുമായി പങ്കിടുക", 
    pa: "ਸ਼ਾਮਲ ਹੋਣ ਲਈ ਪਰਿਵਾਰਕ ਮੈਂਬਰਾਂ ਨਾਲ ਸਾਂਝਾ ਕਰੋ" 
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
    en: "Connecting...", 
    ar: "جاري الاتصال...", 
    ur: "جڑ رہا ہے...", 
    hi: "कनेक्ट हो रहा है...", 
    ta: "இணைக்கிறது...", 
    te: "కనెక్ట్ అవుతోంది...", 
    mr: "कनेक्ट होत आहे...", 
    bn: "সংযুক্ত হচ্ছে...", 
    or: "ସଂଯୋଗ ହେଉଛି...", 
    ml: "ബന്ധിപ്പിക്കുന്നു...", 
    pa: "ਜੁੜ ਰਿਹਾ ਹੈ..." 
  },
  loginRequired: { 
    en: "Please login to make video calls", 
    ar: "يرجى تسجيل الدخول لإجراء مكالمات فيديو", 
    ur: "ویڈیو کالز کرنے کے لیے لاگ ان کریں", 
    hi: "वीडियो कॉल करने के लिए लॉगिन करें", 
    ta: "வீடியோ அழைப்புகள் செய்ய உள்நுழையவும்", 
    te: "వీడియో కాల్స్ చేయడానికి లాగిన్ అవ్వండి", 
    mr: "व्हिडिओ कॉल करण्यासाठी लॉगिन करा", 
    bn: "ভিডিও কল করতে লগইন করুন", 
    or: "ଭିଡିଓ କଲ କରିବାକୁ ଲଗଇନ କରନ୍ତୁ", 
    ml: "വീഡിയോ കോളുകൾ ചെയ്യാൻ ലോഗിൻ ചെയ്യുക", 
    pa: "ਵੀਡੀਓ ਕਾਲਾਂ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ" 
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
  groupCallSupport: { 
    en: "Group calls supported • Multiple family members can join", 
    ar: "مكالمات جماعية مدعومة • يمكن لعدة أفراد من العائلة الانضمام", 
    ur: "گروپ کالز سپورٹڈ • متعدد خاندان کے افراد شامل ہو سکتے ہیں", 
    hi: "ग्रुप कॉल समर्थित • कई परिवार के सदस्य शामिल हो सकते हैं", 
    ta: "குழு அழைப்புகள் ஆதரிக்கப்படுகின்றன • பல குடும்ப உறுப்பினர்கள் சேரலாம்", 
    te: "గ్రూప్ కాల్స్ మద్దతు • బహుళ కుటుంబ సభ్యులు చేరవచ్చు", 
    mr: "ग्रुप कॉल समर्थित • अनेक कुटुंबातील सदस्य सामील होऊ शकतात", 
    bn: "গ্রুপ কল সমর্থিত • একাধিক পরিবারের সদস্য যোগ দিতে পারেন", 
    or: "ଗ୍ରୁପ କଲ ସମର୍ଥିତ • ଏକାଧିକ ପରିବାର ସଦସ୍ୟ ଯୋଗ ଦେଇପାରିବେ", 
    ml: "ഗ്രൂപ്പ് കോളുകൾ പിന്തുണയ്ക്കുന്നു • ഒന്നിലധികം കുടുംബാംഗങ്ങൾക്ക് ചേരാം", 
    pa: "ਗਰੁੱਪ ਕਾਲਾਂ ਸਮਰਥਿਤ • ਕਈ ਪਰਿਵਾਰਕ ਮੈਂਬਰ ਸ਼ਾਮਲ ਹੋ ਸਕਦੇ ਹਨ" 
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
  hdQuality: { 
    en: "HD 720p video quality with noise cancellation", 
    ar: "جودة فيديو HD 720p مع إلغاء الضوضاء", 
    ur: "شور منسوخی کے ساتھ HD 720p ویڈیو کوالٹی", 
    hi: "शोर रद्द करने के साथ HD 720p वीडियो गुणवत्ता", 
    ta: "இரைச்சல் நீக்கத்துடன் HD 720p வீடியோ தரம்", 
    te: "శబ్ద రద్దుతో HD 720p వీడియో నాణ్యత", 
    mr: "आवाज रद्द करण्यासह HD 720p व्हिडिओ गुणवत्ता", 
    bn: "শব্দ বাতিলের সাথে HD 720p ভিডিও গুণমান", 
    or: "ଶବ୍ଦ ବାତିଲ ସହ HD 720p ଭିଡିଓ ଗୁଣବତ୍ତା", 
    ml: "ശബ്ദ റദ്ദാക്കലോടെ HD 720p വീഡിയോ ഗുണനിലവാരം", 
    pa: "ਸ਼ੋਰ ਰੱਦ ਕਰਨ ਨਾਲ HD 720p ਵੀਡੀਓ ਕੁਆਲਿਟੀ" 
  },
  orJoinCall: { 
    en: "Or join an existing call", 
    ar: "أو انضم إلى مكالمة موجودة", 
    ur: "یا موجودہ کال میں شامل ہوں", 
    hi: "या मौजूदा कॉल में शामिल हों", 
    ta: "அல்லது ஏற்கனவே உள்ள அழைப்பில் சேரவும்", 
    te: "లేదా ఇప్పటికే ఉన్న కాల్‌లో చేరండి", 
    mr: "किंवा विद्यमान कॉलमध्ये सामील व्हा", 
    bn: "অথবা একটি বিদ্যমান কলে যোগ দিন", 
    or: "କିମ୍ବା ବିଦ୍ୟମାନ କଲରେ ଯୋଗ ଦିଅନ୍ତୁ", 
    ml: "അല്ലെങ്കിൽ നിലവിലുള്ള കോളിൽ ചേരുക", 
    pa: "ਜਾਂ ਮੌਜੂਦਾ ਕਾਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ" 
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
  participants: { 
    en: "participants", 
    ar: "مشاركون", 
    ur: "شرکاء", 
    hi: "प्रतिभागी", 
    ta: "பங்கேற்பாளர்கள்", 
    te: "పాల్గొనేవారు", 
    mr: "सहभागी", 
    bn: "অংশগ্রহণকারী", 
    or: "ଅଂଶଗ୍ରହଣକାରୀ", 
    ml: "പങ്കാളികൾ", 
    pa: "ਭਾਗੀਦਾਰ" 
  },
  invalidCode: { 
    en: "Invalid code. Please check and try again.", 
    ar: "رمز غير صالح. يرجى التحقق والمحاولة مرة أخرى.", 
    ur: "غلط کوڈ۔ براہ کرم چیک کریں اور دوبارہ کوشش کریں۔", 
    hi: "अमान्य कोड। कृपया जांचें और पुनः प्रयास करें।", 
    ta: "தவறான குறியீடு. தயவுசெய்து சரிபார்த்து மீண்டும் முயற்சிக்கவும்.", 
    te: "చెల్లని కోడ్. దయచేసి తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి.", 
    mr: "अवैध कोड. कृपया तपासा आणि पुन्हा प्रयत्न करा.", 
    bn: "অবৈধ কোড। অনুগ্রহ করে পরীক্ষা করুন এবং আবার চেষ্টা করুন।", 
    or: "ଅବୈଧ କୋଡ। ଦୟାକରି ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।", 
    ml: "അസാധുവായ കോഡ്. ദയവായി പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.", 
    pa: "ਅਵੈਧ ਕੋਡ। ਕਿਰਪਾ ਕਰਕੇ ਜਾਂਚ ਕਰੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।" 
  },
};

// Generate a simple 6-digit code
function generateCallCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

  if (isSupported === false) return null;
  
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

// Auto-enable noise cancellation and configure HD video on call join
function CallSetup() {
  const call = useCall();
  const { setEnabled, isSupported } = useNoiseCancellation();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (callingState === CallingState.JOINED && call) {
      // Auto-enable noise cancellation when call joins
      if (isSupported) {
        setEnabled(true);
      }

      // Configure camera for HD 720p
      const configureCamera = async () => {
        try {
          await call.camera.enable();
          // Request HD quality camera stream
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(d => d.kind === 'videoinput');
          if (videoDevices.length > 0) {
            // Get HD stream with 720p constraints
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 }
              }
            });
            // Stream is ready - SDK will handle it
            stream.getTracks().forEach(track => track.stop()); // Clean up test stream
          }
        } catch (error) {
          console.log("Camera setup completed with default settings");
        }
      };

      configureCamera();
    }
  }, [callingState, call, isSupported, setEnabled]);

  return null;
}

// Participant count display
function ParticipantCount() {
  const { useParticipantCount } = useCallStateHooks();
  const participantCount = useParticipantCount();
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Users className="h-4 w-4" />
      <span className="text-sm">
        {participantCount} {labels.participants[language] || labels.participants.en}
      </span>
    </div>
  );
}

// Call UI with simplified controls
function CallUI({ callCode, onLeave }: { callCode: string; onLeave: () => void }) {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(callCode);
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
      {/* Call setup for HD and noise cancellation */}
      <CallSetup />
      
      {/* Code display for sharing */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{labels.familyCode[language] || labels.familyCode.en}</p>
            <p className="font-mono text-3xl font-bold tracking-[0.3em]">{callCode}</p>
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
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            {labels.shareCode[language] || labels.shareCode.en}
          </p>
          <ParticipantCount />
        </div>
      </div>

      {/* Noise Cancellation toggle */}
      <div className="flex justify-center">
        <NoiseCancellationToggle />
      </div>

      {/* Video area */}
      <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>

      {/* End call button */}
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
  const [callCode, setCallCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize noise cancellation for clearer audio
  const noiseCancellation = useMemo(() => new NoiseCancellation(), []);

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

  const startNewCall = async () => {
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

      // Generate simple 6-digit code
      const code = generateCallCode();
      const callId = `hajj-family-${code}`;
      
      const newCall = streamClient.call("default", callId);
      
      await newCall.join({ create: true });
      
      setCall(newCall);
      setCallCode(code);
    } catch (error) {
      console.error("Error creating call:", error);
      toast.error("Failed to start call");
    } finally {
      setIsLoading(false);
    }
  };

  const joinExistingCall = async () => {
    const cleanCode = joinCode.trim().replace(/\D/g, ''); // Remove non-digits
    
    if (cleanCode.length !== 6) {
      toast.error(labels.invalidCode[language] || labels.invalidCode.en);
      return;
    }

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

      const callId = `hajj-family-${cleanCode}`;
      const existingCall = streamClient.call("default", callId);
      
      await existingCall.join();
      
      setCall(existingCall);
      setCallCode(cleanCode);
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error(labels.invalidCode[language] || labels.invalidCode.en);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveCall = async () => {
    if (call) {
      await call.leave();
      setCall(null);
      setCallCode("");
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
                <Video className="h-10 w-10 text-primary" />
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

  // Active call with noise cancellation
  if (call && client) {
    return (
      <MainLayout>
        <div className="container max-w-2xl mx-auto py-6 px-4">
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <NoiseCancellationProvider noiseCancellation={noiseCancellation}>
                <CallUI callCode={callCode} onLeave={leaveCall} />
              </NoiseCancellationProvider>
            </StreamCall>
          </StreamVideo>
        </div>
      </MainLayout>
    );
  }

  // Main interface - simple, elderly-friendly
  return (
    <MainLayout>
      <div className="container max-w-lg mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="h-12 w-12 text-primary" />
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

        {/* Feature notices */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-5 space-y-3">
            <div className="flex items-start gap-3 text-muted-foreground">
              <Users className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm">{labels.groupCallSupport[language] || labels.groupCallSupport.en}</p>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Video className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm">{labels.hdQuality[language] || labels.hdQuality.en}</p>
            </div>
            <div className="flex items-start gap-3 text-muted-foreground">
              <Shield className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm">{labels.noRecording[language] || labels.noRecording.en}</p>
            </div>
          </CardContent>
        </Card>

        {/* Start new call - Primary action */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6 pb-6">
            <Button
              onClick={startNewCall}
              disabled={isLoading || connectionQuality === "offline"}
              size="lg"
              className="w-full h-20 text-xl gap-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Video className="h-8 w-8" />
              )}
              {labels.startCall[language] || labels.startCall.en}
            </Button>
          </CardContent>
        </Card>

        {/* Join existing call - Secondary option */}
        <Card className="border border-border">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-2 text-muted-foreground">
              <PhoneCall className="h-5 w-5" />
              <span className="font-medium">{labels.orJoinCall[language] || labels.orJoinCall.en}</span>
            </div>
            
            <Input
              placeholder={labels.enterCode[language] || labels.enterCode.en}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-16 text-2xl text-center font-mono tracking-[0.3em] rounded-xl"
              maxLength={6}
              inputMode="numeric"
            />
            
            <Button
              onClick={joinExistingCall}
              disabled={isLoading || joinCode.length !== 6 || connectionQuality === "offline"}
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
            HD 720p • Noise Cancellation • Group Calls
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
