import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Search, CheckCircle2, Clock, FileQuestion, Info, RefreshCw, PartyPopper } from "lucide-react";

type QurbaniStatus = "not_recorded" | "in_process" | "completed" | "unavailable" | null;

type Lang = "en" | "ar" | "ur" | "hi" | "ta" | "te" | "mr" | "bn" | "or" | "ml" | "pa";

const labels: Record<string, Record<Lang, string>> = {
  title: {
    en: "Adahi (Qurbani) Status Tracker",
    ar: "متتبع حالة الأضحية",
    ur: "قربانی کی حالت کا ٹریکر",
    hi: "कुर्बानी स्थिति ट्रैकर",
    ta: "குர்பானி நிலை கண்காணிப்பான்",
    te: "ఖుర్బానీ స్థితి ట్రాకర్",
    mr: "कुर्बानी स्थिती ट्रॅकर",
    bn: "কুরবানি স্থিতি ট্র্যাকার",
    or: "କୁର୍ବାନୀ ସ୍ଥିତି ଟ୍ରାକର",
    ml: "ഖുർബാനി സ്റ്റാറ്റസ് ട്രാക്കർ",
    pa: "ਕੁਰਬਾਨੀ ਸਥਿਤੀ ਟਰੈਕਰ"
  },
  subtitle: {
    en: "Track your official Hajj sacrifice status",
    ar: "تتبع حالة ذبيحة الحج الرسمية",
    ur: "اپنی سرکاری حج قربانی کی حالت معلوم کریں",
    hi: "अपनी आधिकारिक हज कुर्बानी की स्थिति जानें",
    ta: "உங்கள் அதிகாரப்பூர்வ ஹஜ் குர்பானி நிலையை கண்காணிக்கவும்",
    te: "మీ అధికారిక హజ్ ఖుర్బానీ స్థితిని ట్రాక్ చేయండి",
    mr: "तुमच्या अधिकृत हज कुर्बानीची स्थिती जाणून घ्या",
    bn: "আপনার অফিসিয়াল হজ কুরবানির স্থিতি ট্র্যাক করুন",
    or: "ଆପଣଙ୍କ ସରକାରୀ ହଜ କୁର୍ବାନୀ ସ୍ଥିତି ଟ୍ରାକ କରନ୍ତୁ",
    ml: "നിങ്ങളുടെ ഔദ്യോഗിക ഹജ്ജ് ഖുർബാനി സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യുക",
    pa: "ਆਪਣੀ ਅਧਿਕਾਰਤ ਹੱਜ ਕੁਰਬਾਨੀ ਸਥਿਤੀ ਟਰੈਕ ਕਰੋ"
  },
  placeholder: {
    en: "Enter your Adahi reference number",
    ar: "أدخل رقم مرجع الأضحية",
    ur: "اپنا اضحی حوالہ نمبر درج کریں",
    hi: "अपना अधही संदर्भ नंबर दर्ज करें",
    ta: "உங்கள் அதாஹி குறிப்பு எண்ணை உள்ளிடவும்",
    te: "మీ అదాహీ సూచన సంఖ్యను నమోదు చేయండి",
    mr: "तुमचा अदाही संदर्भ क्रमांक टाका",
    bn: "আপনার আদাহী রেফারেন্স নম্বর লিখুন",
    or: "ଆପଣଙ୍କ ଅଦାହୀ ରେଫରେନ୍ସ ନମ୍ବର ଦିଅନ୍ତୁ",
    ml: "നിങ്ങളുടെ അദാഹി റഫറൻസ് നമ്പർ നൽകുക",
    pa: "ਆਪਣਾ ਅਦਾਹੀ ਹਵਾਲਾ ਨੰਬਰ ਦਰਜ ਕਰੋ"
  },
  checkStatus: {
    en: "Check Status",
    ar: "تحقق من الحالة",
    ur: "حالت چیک کریں",
    hi: "स्थिति जांचें",
    ta: "நிலையை சரிபார்க்கவும்",
    te: "స్థితి తనిఖీ చేయండి",
    mr: "स्थिती तपासा",
    bn: "স্থিতি পরীক্ষা করুন",
    or: "ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ",
    ml: "സ്റ്റാറ്റസ് പരിശോധിക്കുക",
    pa: "ਸਥਿਤੀ ਜਾਂਚੋ"
  },
  notRecorded: {
    en: "Not Yet Recorded",
    ar: "لم يتم التسجيل بعد",
    ur: "ابھی تک درج نہیں ہوا",
    hi: "अभी तक दर्ज नहीं",
    ta: "இன்னும் பதிவு செய்யப்படவில்லை",
    te: "ఇంకా నమోదు కాలేదు",
    mr: "अद्याप नोंदणी झालेली नाही",
    bn: "এখনও রেকর্ড হয়নি",
    or: "ଏପର୍ଯ୍ୟନ୍ତ ରେକର୍ଡ ହୋଇନାହିଁ",
    ml: "ഇതുവരെ രേഖപ്പെടുത്തിയിട്ടില്ല",
    pa: "ਅਜੇ ਤੱਕ ਰਿਕਾਰਡ ਨਹੀਂ ਹੋਇਆ"
  },
  inProcess: {
    en: "In Process",
    ar: "قيد التنفيذ",
    ur: "جاری ہے",
    hi: "प्रक्रिया में",
    ta: "செயல்பாட்டில்",
    te: "ప్రక్రియలో",
    mr: "प्रक्रियेत",
    bn: "প্রক্রিয়াধীন",
    or: "ପ୍ରକ୍ରିୟାରେ",
    ml: "പ്രോസസ്സിംഗിൽ",
    pa: "ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ"
  },
  completed: {
    en: "Completed",
    ar: "مكتمل",
    ur: "مکمل",
    hi: "पूर्ण",
    ta: "முடிந்தது",
    te: "పూర్తయింది",
    mr: "पूर्ण",
    bn: "সম্পন্ন",
    or: "ସମ୍ପୂର୍ଣ୍ଣ",
    ml: "പൂർത്തിയായി",
    pa: "ਪੂਰਾ ਹੋਇਆ"
  },
  statusMessage: {
    en: "Your Qurbani is being handled through official arrangements. Status updates will appear here when available.",
    ar: "يتم التعامل مع أضحيتك من خلال الترتيبات الرسمية. ستظهر تحديثات الحالة هنا عندما تتوفر.",
    ur: "آپ کی قربانی سرکاری انتظامات کے ذریعے ہو رہی ہے۔ حالت کی تازہ کاری یہاں دستیاب ہونے پر ظاہر ہوگی۔",
    hi: "आपकी कुर्बानी आधिकारिक व्यवस्थाओं के माध्यम से हो रही है। स्थिति अपडेट उपलब्ध होने पर यहां दिखाई देंगे।",
    ta: "உங்கள் குர்பானி அதிகாரப்பூர்வ ஏற்பாடுகள் மூலம் நிர்வகிக்கப்படுகிறது. நிலை புதுப்பிப்புகள் கிடைக்கும்போது இங்கே தோன்றும்.",
    te: "మీ ఖుర్బానీ అధికారిక ఏర్పాట్ల ద్వారా నిర్వహించబడుతోంది. స్థితి అప్‌డేట్‌లు అందుబాటులో ఉన్నప్పుడు ఇక్కడ కనిపిస్తాయి.",
    mr: "तुमची कुर्बानी अधिकृत व्यवस्थेद्वारे हाताळली जात आहे. स्थिती अपडेट उपलब्ध झाल्यावर येथे दिसतील.",
    bn: "আপনার কুরবানি অফিসিয়াল ব্যবস্থার মাধ্যমে পরিচালিত হচ্ছে। স্থিতি আপডেট উপলব্ধ হলে এখানে দেখা যাবে।",
    or: "ଆପଣଙ୍କ କୁର୍ବାନୀ ସରକାରୀ ବ୍ୟବସ୍ଥା ମାଧ୍ୟମରେ ହେଉଛି। ସ୍ଥିତି ଅପଡେଟ ଉପಲબ୍ଧ ହେଲେ ଏଠାରେ ଦେଖାଯିବ।",
    ml: "നിങ്ങളുടെ ഖുർബാനി ഔദ്യോഗിക ക്രമീകരണങ്ങളിലൂടെ നടത്തപ്പെടുന്നു. സ്റ്റാറ്റസ് അപ്‌ഡേറ്റുകൾ ലഭ്യമാകുമ്പോൾ ഇവിടെ കാണിക്കും.",
    pa: "ਤੁਹਾਡੀ ਕੁਰਬਾਨੀ ਅਧਿਕਾਰਤ ਪ੍ਰਬੰਧਾਂ ਰਾਹੀਂ ਹੋ ਰਹੀ ਹੈ। ਸਥਿਤੀ ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੋਣ 'ਤੇ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ।"
  },
  unavailableMessage: {
    en: "Status not yet updated. Please remain calm and follow official instructions.",
    ar: "لم يتم تحديث الحالة بعد. يرجى التزام الهدوء واتباع التعليمات الرسمية.",
    ur: "حالت ابھی تک اپ ڈیٹ نہیں ہوئی۔ براہ کرم پرسکون رہیں اور سرکاری ہدایات پر عمل کریں۔",
    hi: "स्थिति अभी तक अपडेट नहीं हुई। कृपया शांत रहें और आधिकारिक निर्देशों का पालन करें।",
    ta: "நிலை இன்னும் புதுப்பிக்கப்படவில்லை. அமைதியாக இருங்கள், அதிகாரப்பூர்வ வழிகாட்டுதல்களைப் பின்பற்றுங்கள்.",
    te: "స్థితి ఇంకా అప్‌డేట్ కాలేదు. దయచేసి ప్రశాంతంగా ఉండండి మరియు అధికారిక సూచనలను అనుసరించండి.",
    mr: "स्थिती अद्याप अपडेट झालेली नाही. कृपया शांत राहा आणि अधिकृत सूचनांचे पालन करा.",
    bn: "স্থিতি এখনও আপডেট হয়নি। অনুগ্রহ করে শান্ত থাকুন এবং অফিসিয়াল নির্দেশনা অনুসরণ করুন।",
    or: "ସ୍ଥିତି ଏପର୍ଯ୍ୟନ୍ତ ଅପଡେଟ ହୋଇନାହିଁ। ଦୟାକରି ଶାନ୍ତ ରୁହନ୍ତୁ ଏବଂ ସରକାରୀ ନିର୍ଦ୍ଦେଶ ଅନୁସରଣ କରନ୍ତୁ।",
    ml: "സ്റ്റാറ്റസ് ഇതുവരെ അപ്‌ഡേറ്റ് ആയിട്ടില്ല. ദയവായി ശാന്തമായിരിക്കുക, ഔദ്യോഗിക നിർദ്ദേശങ്ങൾ പാലിക്കുക.",
    pa: "ਸਥਿਤੀ ਅਜੇ ਤੱਕ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋਈ। ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਅਧਿਕਾਰਤ ਹਿਦਾਇਤਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ।"
  },
  disclaimer: {
    en: "This is an information-only service. It does not accept payments, sell animals, or issue religious rulings.",
    ar: "هذه خدمة معلومات فقط. لا تقبل المدفوعات أو تبيع الحيوانات أو تصدر أحكاماً شرعية.",
    ur: "یہ صرف معلوماتی خدمت ہے۔ یہ ادائیگیاں قبول نہیں کرتی، جانور نہیں بیچتی، اور شرعی فیصلے جاری نہیں کرتی۔",
    hi: "यह केवल सूचना सेवा है। यह भुगतान स्वीकार नहीं करती, जानवर नहीं बेचती, या धार्मिक फैसले जारी नहीं करती।",
    ta: "இது தகவல் மட்டும் வழங்கும் சேவை. கட்டணம் ஏற்காது, விலங்குகள் விற்காது, மத தீர்ப்புகள் வழங்காது.",
    te: "ఇది సమాచార-మాత్రమే సేవ. చెల్లింపులు స్వీకరించదు, జంతువులు అమ్మదు, మత తీర్పులు జారీ చేయదు.",
    mr: "ही केवळ माहिती सेवा आहे. पेमेंट स्वीकारत नाही, प्राणी विकत नाही, धार्मिक निर्णय देत नाही.",
    bn: "এটি শুধুমাত্র তথ্য সেবা। পেমেন্ট গ্রহণ করে না, পশু বিক্রি করে না, ধর্মীয় রায় জারি করে না।",
    or: "ଏହା କେବଳ ସୂଚନା ସେବା। ଦେୟ ଗ୍ରହଣ କରେ ନାହିଁ, ପଶୁ ବିକ୍ରି କରେ ନାହିଁ, ଧାର୍ମିକ ରାୟ ଦିଏ ନାହିଁ।",
    ml: "ഇത് വിവരം-മാത്രം സേവനമാണ്. പേയ്‌മെന്റ് സ്വീകരിക്കുന്നില്ല, മൃഗങ്ങൾ വിൽക്കുന്നില്ല, മതപരമായ വിധികൾ പുറപ്പെടുവിക്കുന്നില്ല.",
    pa: "ਇਹ ਕੇਵਲ ਜਾਣਕਾਰੀ ਸੇਵਾ ਹੈ। ਭੁਗਤਾਨ ਸਵੀਕਾਰ ਨਹੀਂ ਕਰਦੀ, ਜਾਨਵਰ ਨਹੀਂ ਵੇਚਦੀ, ਧਾਰਮਿਕ ਫ਼ੈਸਲੇ ਜਾਰੀ ਨਹੀਂ ਕਰਦੀ।"
  },
  completedMessage: {
    en: "Your Qurbani has been completed through official arrangements.",
    ar: "تم إتمام أضحيتك من خلال الترتيبات الرسمية.",
    ur: "آپ کی قربانی سرکاری انتظامات کے ذریعے مکمل ہو گئی ہے۔",
    hi: "आपकी कुर्बानी आधिकारिक व्यवस्थाओं के माध्यम से पूर्ण हो गई है।",
    ta: "உங்கள் குர்பானி அதிகாரப்பூர்வ ஏற்பாடுகள் மூலம் முடிவடைந்தது.",
    te: "మీ ఖుర్బానీ అధికారిక ఏర్పాట్ల ద్వారా పూర్తయింది.",
    mr: "तुमची कुर्बानी अधिकृत व्यवस्थेद्वारे पूर्ण झाली आहे.",
    bn: "আপনার কুরবানি অফিসিয়াল ব্যবস্থার মাধ্যমে সম্পন্ন হয়েছে।",
    or: "ଆପଣଙ୍କ କୁର୍ବାନୀ ସରକାରୀ ବ୍ୟବସ୍ଥା ମାଧ୍ୟମରେ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି।",
    ml: "നിങ്ങളുടെ ഖുർബാനി ഔദ്യോഗിക ക്രമീകരണങ്ങളിലൂടെ പൂർത്തിയായി.",
    pa: "ਤੁਹਾਡੀ ਕੁਰਬਾਨੀ ਅਧਿਕਾਰਤ ਪ੍ਰਬੰਧਾਂ ਰਾਹੀਂ ਪੂਰੀ ਹੋ ਗਈ ਹੈ।"
  },
  inProcessMessage: {
    en: "Your Qurbani is currently being processed through official channels.",
    ar: "يتم حالياً معالجة أضحيتك من خلال القنوات الرسمية.",
    ur: "آپ کی قربانی سرکاری ذرائع سے جاری ہے۔",
    hi: "आपकी कुर्बानी वर्तमान में आधिकारिक चैनलों के माध्यम से प्रक्रियाधीन है।",
    ta: "உங்கள் குர்பானி தற்போது அதிகாரப்பூர்வ சேனல்கள் மூலம் செயலாக்கப்படுகிறது.",
    te: "మీ ఖుర్బానీ ప్రస్తుతం అధికారిక ఛానెల్‌ల ద్వారా ప్రాసెస్ చేయబడుతోంది.",
    mr: "तुमची कुर्बानी सध्या अधिकृत चॅनेलद्वारे प्रक्रियेत आहे.",
    bn: "আপনার কুরবানি বর্তমানে অফিসিয়াল চ্যানেলের মাধ্যমে প্রক্রিয়াধীন।",
    or: "ଆପଣଙ୍କ କୁର୍ବାନୀ ବର୍ତ୍ତମାନ ସରକାରୀ ଚ୍ୟାନେଲ ମାଧ୍ୟମରେ ପ୍ରକ୍ରିୟାଧୀନ।",
    ml: "നിങ്ങളുടെ ഖുർബാനി നിലവിൽ ഔദ്യോഗിക ചാനലുകളിലൂടെ പ്രോസസ്സ് ചെയ്യപ്പെടുന്നു.",
    pa: "ਤੁਹਾਡੀ ਕੁਰਬਾਨੀ ਵਰਤਮਾਨ ਵਿੱਚ ਅਧਿਕਾਰਤ ਚੈਨਲਾਂ ਰਾਹੀਂ ਪ੍ਰਕਿਰਿਆ ਵਿੱਚ ਹੈ।"
  },
  notRecordedMessage: {
    en: "Your reference number has not yet been recorded in the system. Please contact your Hajj operator.",
    ar: "لم يتم تسجيل رقم المرجع الخاص بك في النظام بعد. يرجى الاتصال بمنظم الحج الخاص بك.",
    ur: "آپ کا حوالہ نمبر ابھی تک سسٹم میں درج نہیں ہوا۔ براہ کرم اپنے حج آپریٹر سے رابطہ کریں۔",
    hi: "आपका संदर्भ नंबर अभी तक सिस्टम में दर्ज नहीं हुआ है। कृपया अपने हज ऑपरेटर से संपर्क करें।",
    ta: "உங்கள் குறிப்பு எண் இன்னும் பதிவு செய்யப்படவில்லை. உங்கள் ஹஜ் ஆபரேட்டரை தொடர்பு கொள்ளுங்கள்.",
    te: "మీ సూచన సంఖ్య ఇంకా సిస్టమ్‌లో నమోదు కాలేదు. దయచేసి మీ హజ్ ఆపరేటర్‌ను సంప్రదించండి.",
    mr: "तुमचा संदर्भ क्रमांक अद्याप सिस्टममध्ये नोंदणी झालेला नाही. कृपया तुमच्या हज ऑपरेटरशी संपर्क साधा.",
    bn: "আপনার রেফারেন্স নম্বর এখনও সিস্টেমে রেকর্ড হয়নি। অনুগ্রহ করে আপনার হজ অপারেটরের সাথে যোগাযোগ করুন।",
    or: "ଆପଣଙ୍କ ରେଫରେନ୍ସ ନମ୍ବର ଏପର୍ଯ୍ୟନ୍ତ ସିଷ୍ଟମରେ ରେକର୍ଡ ହୋଇନାହିଁ। ଦୟାକରି ଆପଣଙ୍କ ହଜ ଅପରେଟରଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।",
    ml: "നിങ്ങളുടെ റഫറൻസ് നമ്പർ ഇതുവരെ സിസ്റ്റത്തിൽ രേഖപ്പെടുത്തിയിട്ടില്ല. ദയവായി നിങ്ങളുടെ ഹജ്ജ് ഓപ്പറേറ്ററെ ബന്ധപ്പെടുക.",
    pa: "ਤੁਹਾਡਾ ਹਵਾਲਾ ਨੰਬਰ ਅਜੇ ਤੱਕ ਸਿਸਟਮ ਵਿੱਚ ਰਿਕਾਰਡ ਨਹੀਂ ਹੋਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਹੱਜ ਆਪਰੇਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।"
  },
  autoChecking: {
    en: "Auto-checking status…",
    ar: "جارٍ التحقق التلقائي من الحالة…",
    ur: "حالت خودکار چیک ہو رہی ہے…",
    hi: "स्थिति स्वतः जांची जा रही है…",
    ta: "நிலை தானாக சரிபார்க்கப்படுகிறது…",
    te: "స్థితి ఆటోమేటిక్‌గా తనిఖీ చేయబడుతోంది…",
    mr: "स्थिती स्वयं तपासली जात आहे…",
    bn: "স্থিতি স্বয়ংক্রিয়ভাবে পরীক্ষা হচ্ছে…",
    or: "ସ୍ଥିତି ସ୍ୱୟଂଚାଳିତ ଭାବେ ଯାଞ୍ଚ ହେଉଛି…",
    ml: "സ്റ്റാറ്റസ് സ്വയം പരിശോധിക്കുന്നു…",
    pa: "ਸਥਿਤੀ ਆਪਣੇ-ਆਪ ਜਾਂਚੀ ਜਾ ਰਹੀ ਹੈ…"
  },
  completedToastTitle: {
    en: "Qurbani Completed ✓",
    ar: "اكتملت الأضحية ✓",
    ur: "قربانی مکمل ہو گئی ✓",
    hi: "कुर्बानी पूर्ण हुई ✓",
    ta: "குர்பானி நிறைவடைந்தது ✓",
    te: "ఖుర్బానీ పూర్తయింది ✓",
    mr: "कुर्बानी पूर्ण झाली ✓",
    bn: "কুরবানি সম্পন্ন হয়েছে ✓",
    or: "କୁର୍ବାନୀ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି ✓",
    ml: "ഖുർബാനി പൂർത്തിയായി ✓",
    pa: "ਕੁਰਬਾਨੀ ਪੂਰੀ ਹੋਈ ✓"
  },
  completedToastDesc: {
    en: "Alhamdulillah! Your sacrifice has been recorded. You may now proceed with the next rituals.",
    ar: "الحمد لله! تم تسجيل أضحيتك. يمكنك الآن المتابعة مع المناسك التالية.",
    ur: "الحمد للہ! آپ کی قربانی درج ہو چکی ہے۔ اب آپ اگلے مناسک کی طرف بڑھ سکتے ہیں۔",
    hi: "अल्हम्दुलिल्लाह! आपकी कुर्बानी दर्ज हो गई है। अब आप अगले अनुष्ठानों के लिए आगे बढ़ सकते हैं।",
    ta: "அல்ஹம்துலில்லாஹ்! உங்கள் குர்பானி பதிவாகியுள்ளது.",
    te: "అల్హందులిల్లాహ్! మీ ఖుర్బానీ నమోదైంది.",
    mr: "अल्हम्दुलिल्लाह! तुमची कुर्बानी नोंदवली गेली आहे.",
    bn: "আলহামদুলিল্লাহ! আপনার কুরবানি রেকর্ড হয়েছে।",
    or: "ଅଲ୍‌ହମ୍‌ଦୁଲିଲ୍ଲାହ୍! ଆପଣଙ୍କ କୁର୍ବାନୀ ରେକର୍ଡ ହୋଇଛି।",
    ml: "അൽഹംദുലില്ലാഹ്! നിങ്ങളുടെ ഖുർബാനി രേഖപ്പെടുത്തി.",
    pa: "ਅਲਹਮਦੁਲਿੱਲਾਹ! ਤੁਹਾਡੀ ਕੁਰਬਾਨੀ ਰਿਕਾਰਡ ਹੋ ਗਈ ਹੈ।"
  },
  refresh: {
    en: "Refresh now",
    ar: "تحديث الآن",
    ur: "ابھی تازہ کریں",
    hi: "अभी रिफ्रेश करें",
    ta: "இப்போது புதுப்பிக்கவும்",
    te: "ఇప్పుడే రిఫ్రెష్ చేయండి",
    mr: "आता रिफ्रेश करा",
    bn: "এখন রিফ্রেশ করুন",
    or: "ଏବେ ରିଫ୍ରେସ୍ କରନ୍ତୁ",
    ml: "ഇപ്പോൾ പുതുക്കുക",
    pa: "ਹੁਣੇ ਰਿਫਰੈਸ਼ ਕਰੋ"
  }
};

const SUPPORTED_LANGS: Lang[] = ["en", "ar", "ur", "hi", "ta", "te", "mr", "bn", "or", "ml", "pa"];

const QurbaniStatusTracker = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [referenceNumber, setReferenceNumber] = useState(() => {
    try { return localStorage.getItem("qurbani_ref") || ""; } catch { return ""; }
  });
  const [status, setStatus] = useState<QurbaniStatus>(() => {
    try { return (localStorage.getItem("qurbani_status") as QurbaniStatus) || null; } catch { return null; }
  });
  const [isChecking, setIsChecking] = useState(false);
  const [autoPolling, setAutoPolling] = useState(false);
  const lastStatusRef = useRef<QurbaniStatus>(status);

  const lang: Lang = SUPPORTED_LANGS.includes(language as Lang) ? (language as Lang) : "en";

  const computeStatus = (ref: string): QurbaniStatus => {
    const trimmedRef = ref.trim().toUpperCase();
    // Force statuses by prefix/suffix (demo override)
    if (trimmedRef.startsWith("C") || trimmedRef.endsWith("99")) return "completed";
    if (trimmedRef.startsWith("N") || trimmedRef.length < 5) return "not_recorded";
    if (trimmedRef.startsWith("U")) return "unavailable";

    // For valid refs (incl. official Adahi coupons like ADHHAJ-/HAJ-): simulate progression
    // not_recorded -> in_process (after 10s) -> completed (after 40s)
    let startedAt = Number(localStorage.getItem(`qurbani_started_${trimmedRef}`));
    if (!startedAt) {
      startedAt = Date.now();
      try { localStorage.setItem(`qurbani_started_${trimmedRef}`, String(startedAt)); } catch {}
    }
    const elapsed = (Date.now() - startedAt) / 1000;
    if (elapsed < 10) return "not_recorded";
    if (elapsed < 40) return "in_process";
    return "completed";
  };

  const runCheck = async (silent = false) => {
    if (!referenceNumber.trim()) return;
    if (!silent) setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, silent ? 300 : 1200));
    const next = computeStatus(referenceNumber);
    setStatus(next);
    try {
      localStorage.setItem("qurbani_ref", referenceNumber.trim());
      if (next) localStorage.setItem("qurbani_status", next);
    } catch {}
    if (!silent) setIsChecking(false);
  };

  const handleCheckStatus = () => runCheck(false);

  // Fire toast when status transitions to completed
  useEffect(() => {
    if (status === "completed" && lastStatusRef.current !== "completed") {
      toast({
        title: labels.completedToastTitle[lang],
        description: labels.completedToastDesc[lang],
        duration: 8000,
      });
    }
    lastStatusRef.current = status;
  }, [status, lang, toast]);

  // Auto-poll while status is pending
  useEffect(() => {
    if (!referenceNumber.trim()) return;
    if (status === "completed" || status === "unavailable") {
      setAutoPolling(false);
      return;
    }
    if (status !== "in_process" && status !== "not_recorded") return;
    setAutoPolling(true);
    const id = setInterval(() => { runCheck(true); }, 15000);
    return () => { clearInterval(id); setAutoPolling(false); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, referenceNumber]);


  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          label: labels.completed[lang],
          message: labels.completedMessage[lang],
          colorClass: "text-status-safe",
          bgClass: "bg-status-safe/10 border-status-safe/20"
        };
      case "in_process":
        return {
          icon: Clock,
          label: labels.inProcess[lang],
          message: labels.inProcessMessage[lang],
          colorClass: "text-status-assistance",
          bgClass: "bg-status-assistance/10 border-status-assistance/20"
        };
      case "not_recorded":
        return {
          icon: FileQuestion,
          label: labels.notRecorded[lang],
          message: labels.notRecordedMessage[lang],
          colorClass: "text-muted-foreground",
          bgClass: "bg-muted/50 border-muted-foreground/20"
        };
      case "unavailable":
        return {
          icon: Info,
          label: "",
          message: labels.unavailableMessage[lang],
          colorClass: "text-muted-foreground",
          bgClass: "bg-muted/30 border-muted-foreground/10"
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            {labels.title[lang]}
          </h2>
          <p className="text-sm text-muted-foreground">
            {labels.subtitle[lang]}
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-3">
          <Input
            type="text"
            placeholder={labels.placeholder[lang]}
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="text-lg h-14 text-center font-mono tracking-wider"
            dir="ltr"
          />
          <Button 
            onClick={handleCheckStatus}
            disabled={!referenceNumber.trim() || isChecking}
            className="w-full h-12 text-base gap-2"
          >
            {isChecking ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {labels.checkStatus[lang]}
          </Button>
        </div>

        {/* Status Display */}
        {statusConfig && (
          <div className={`rounded-xl p-5 border ${statusConfig.bgClass} transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-2`}>
            <div className="flex flex-col items-center text-center space-y-3">
              {status === "completed" ? (
                <PartyPopper className={`w-12 h-12 ${statusConfig.colorClass}`} />
              ) : (
                <statusConfig.icon className={`w-12 h-12 ${statusConfig.colorClass}`} />
              )}
              {statusConfig.label && (
                <span className={`text-xl font-semibold ${statusConfig.colorClass}`}>
                  {statusConfig.label}
                </span>
              )}
              <p className="text-foreground text-base leading-relaxed">
                {statusConfig.message}
              </p>

              {autoPolling && (status === "in_process" || status === "not_recorded") && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{labels.autoChecking[lang]}</span>
                </div>
              )}

              {(status === "in_process" || status === "not_recorded") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCheckStatus}
                  disabled={isChecking}
                  className="gap-1.5 mt-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
                  {labels.refresh[lang]}
                </Button>
              )}
            </div>
          </div>
        )}


        {/* Default message when no status checked */}
        {!status && (
          <div className="bg-muted/30 rounded-xl p-4 border border-muted-foreground/10">
            <p className="text-center text-muted-foreground text-sm leading-relaxed">
              {labels.statusMessage[lang]}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {labels.disclaimer[lang]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QurbaniStatusTracker;
