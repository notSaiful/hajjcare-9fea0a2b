import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Activity, Brain, Heart, Stethoscope, Eye, Bone, Check } from "lucide-react";
import { useLanguage, LocalizedString } from "@/contexts/LanguageContext";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";

const labels: Record<string, LocalizedString> = {
  title: {
    en: "Preparation Card for Haj Pilgrims",
    ar: "بطاقة التحضير لحجاج بيت الله",
    ur: "حج زائرین کے لیے تیاری کارڈ",
    hi: "हज यात्रियों के लिए तैयारी कार्ड",
    ta: "ஹஜ் புனிதப்பயணிகளுக்கான தயாரிப்பு அட்டை",
    te: "హజ్ యాత్రికులకు తయారీ కార్డు",
    mr: "हज यात्रेकरूंसाठी तयारी कार्ड",
    bn: "হজ তীর্থযাত্রীদের জন্য প্রস্তুতি কার্ড",
    or: "ହଜ ତୀର୍ଥଯାତ୍ରୀଙ୍କ ପାଇଁ ପ୍ରସ୍ତୁତି କାର୍ଡ",
    ml: "ഹജ്ജ് തീർത്ഥാടകർക്കുള്ള തയ്യാറെടുപ്പ് കാർഡ്",
    pa: "ਹੱਜ ਯਾਤਰੀਆਂ ਲਈ ਤਿਆਰੀ ਕਾਰਡ",
  },
  subtitle: {
    en: "Official screening document issued by Ministry of Minority Affairs",
    ar: "وثيقة الفحص الرسمية الصادرة عن وزارة شؤون الأقليات",
    ur: "وزارت اقلیتی امور کی جانب سے جاری سرکاری جانچ دستاویز",
    hi: "अल्पसंख्यक मामलों के मंत्रालय द्वारा जारी आधिकारिक जांच दस्तावेज़",
    ta: "சிறுபான்மை விவகார அமைச்சகம் வெளியிட்ட அதிகாரப்பூர்வ பரிசோதனை ஆவணம்",
    te: "మైనారిటీ వ్యవహారాల మంత్రిత్వ శాఖ జారీ చేసిన అధికారిక పరీక్ష పత్రం",
    mr: "अल्पसंख्याक व्यवहार मंत्रालयाने जारी केलेला अधिकृत तपासणी दस्तऐवज",
    bn: "সংখ্যালঘু বিষয়ক মন্ত্রণালয় দ্বারা জারি করা অফিসিয়াল স্ক্রিনিং নথি",
    or: "ସଂଖ୍ୟାଲଘୁ ବିଷୟ ମନ୍ତ୍ରଣାଳୟ ଦ୍ୱାରା ଜାରି ଅଫିସିଆଲ୍ ସ୍କ୍ରିନିଂ ଡକ୍ୟୁମେଣ୍ଟ",
    ml: "ന്യൂനപക്ഷ കാര്യ മന്ത്രാലയം പുറപ്പെടുവിച്ച ഔദ്യോഗിക സ്ക്രീനിംഗ് രേഖ",
    pa: "ਘੱਟ ਗਿਣਤੀ ਮਾਮਲਿਆਂ ਦੇ ਮੰਤਰਾਲੇ ਦੁਆਰਾ ਜਾਰੀ ਅਧਿਕਾਰਤ ਸਕ੍ਰੀਨਿੰਗ ਦਸਤਾਵੇਜ਼",
  },
  whatIsIt: {
    en: "What is the Health Card?",
    ar: "ما هي البطاقة الصحية؟",
    ur: "ہیلتھ کارڈ کیا ہے؟",
    hi: "हेल्थ कार्ड क्या है?",
    ta: "சுகாதார அட்டை என்றால் என்ன?",
    te: "ఆరోగ్య కార్డు అంటే ఏమిటి?",
    mr: "आरोग्य कार्ड म्हणजे काय?",
    bn: "স্বাস্থ্য কার্ড কি?",
    or: "ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ କ'ଣ?",
    ml: "ആരോഗ്യ കാർഡ് എന്താണ്?",
    pa: "ਹੈਲਥ ਕਾਰਡ ਕੀ ਹੈ?",
  },
  whatIsItDesc: {
    en: "A mandatory medical screening booklet issued to every Haj pilgrim to assess physical fitness for the pilgrimage. It must be filled by a registered government medical officer and carried throughout the journey.",
    ar: "كتيب فحص طبي إلزامي يُصدر لكل حاج لتقييم اللياقة البدنية للحج. يجب أن يملأه طبيب حكومي مسجل ويُحمل طوال الرحلة.",
    ur: "حج کے لیے جسمانی تندرستی کا جائزہ لینے کے لیے ہر حاجی کو جاری کردہ لازمی طبی جانچ کتابچہ۔ یہ رجسٹرڈ سرکاری ڈاکٹر سے بھروانا ہے اور پوری سفر میں ساتھ رکھنا ہے۔",
    hi: "तीर्थयात्रा के लिए शारीरिक तंदुरुस्ती का आकलन करने के लिए हर हज यात्री को जारी की जाने वाली अनिवार्य चिकित्सा जांच पुस्तिका। इसे पंजीकृत सरकारी चिकित्सा अधिकारी द्वारा भरा जाना चाहिए और पूरी यात्रा में साथ रखना चाहिए।",
    ta: "யாத்திரைக்கான உடல் தகுதியை மதிப்பிடுவதற்காக ஒவ்வொரு ஹஜ் யாத்ரிகருக்கும் வழங்கப்படும் கட்டாய மருத்துவ பரிசோதனை கையேடு.",
    te: "తీర్థయాత్ర కోసం శారీరక ఆరోగ్యాన్ని అంచనా వేయడానికి ప్రతి హజ్ యాత్రికుడికి జారీ చేయబడిన తప్పనిసరి వైద్య పరీక్ష పుస్తకం.",
    mr: "तीर्थयात्रेसाठी शारीरिक तंदुरुस्तीचे मूल्यांकन करण्यासाठी प्रत्येक हज यात्रेकरूला दिलेली अनिवार्य वैद्यकीय तपासणी पुस्तिका.",
    bn: "তীর্থযাত্রার জন্য শারীরিক সুস্থতা মূল্যায়ন করতে প্রতিটি হজ তীর্থযাত্রীকে দেওয়া বাধ্যতামূলক মেডিকেল স্ক্রিনিং পুস্তিকা।",
    or: "ତୀର୍ଥଯାତ୍ରା ପାଇଁ ଶାରୀରିକ ସୁସ୍ଥତା ମୂଲ୍ୟାଙ୍କନ କରିବାକୁ ପ୍ରତ୍ୟେକ ହଜ ତୀର୍ଥଯାତ୍ରୀଙ୍କୁ ଦିଆଯାଇଥିବା ବାଧ୍ୟତାମୂଳକ ମେଡିକାଲ ସ୍କ୍ରିନିଂ ପୁସ୍ତିକା।",
    ml: "തീർത്ഥാടനത്തിനുള്ള ശാരീരിക ക്ഷമത വിലയിരുത്തുന്നതിനായി ഓരോ ഹജ്ജ് തീർത്ഥാടകനും നൽകുന്ന നിർബന്ധിത മെഡിക്കൽ സ്ക്രീനിംഗ് ബുക്ക്ലെറ്റ്.",
    pa: "ਤੀਰਥ ਯਾਤਰਾ ਲਈ ਸਰੀਰਕ ਤੰਦਰੁਸਤੀ ਦਾ ਮੁਲਾਂਕਣ ਕਰਨ ਲਈ ਹਰ ਹੱਜ ਯਾਤਰੀ ਨੂੰ ਜਾਰੀ ਕੀਤੀ ਜਾਣ ਵਾਲੀ ਲਾਜ਼ਮੀ ਮੈਡੀਕਲ ਸਕ੍ਰੀਨਿੰਗ ਕਿਤਾਬਚਾ।",
  },
  systemsChecked: {
    en: "Medical Systems Checked",
    ar: "الأنظمة الطبية المفحوصة",
    ur: "طبی نظام کی جانچ",
    hi: "जांचे गए चिकित्सा तंत्र",
    ta: "பரிசோதிக்கப்பட்ட மருத்துவ அமைப்புகள்",
    te: "తనిఖీ చేయబడిన వైద్య వ్యవస్థలు",
    mr: "तपासलेल्या वैद्यकीय प्रणाली",
    bn: "পরীক্ষিত চিকিৎসা সিস্টেম",
    or: "ଯାଞ୍ଚ କରାଯାଇଥିବା ମେଡିକାଲ ସିଷ୍ଟମ୍",
    ml: "പരിശോധിച്ച മെഡിക്കൽ സിസ്റ്റങ്ങൾ",
    pa: "ਜਾਂਚੇ ਗਏ ਮੈਡੀਕਲ ਸਿਸਟਮ",
  },
  instructions: {
    en: "Key Instructions",
    ar: "التعليمات الرئيسية",
    ur: "اہم ہدایات",
    hi: "मुख्य निर्देश",
    ta: "முக்கிய வழிமுறைகள்",
    te: "ముఖ్య సూచనలు",
    mr: "मुख्य सूचना",
    bn: "মূল নির্দেশাবলী",
    or: "ମୁଖ୍ୟ ନିର୍ଦ୍ଦେଶାବଳୀ",
    ml: "പ്രധാന നിർദ്ദേശങ്ങൾ",
    pa: "ਮੁੱਖ ਹਿਦਾਇਤਾਂ",
  },
};

const medicalSystems = [
  { icon: Brain, label: { en: "Nervous System", ar: "الجهاز العصبي", ur: "اعصابی نظام", hi: "तंत्रिका तंत्र", ta: "நரம்பு மண்டலம்", te: "నరాల వ్యవస్థ", mr: "मज्जासंस्था", bn: "স্নায়ুতন্ত্র", or: "ସ୍ନାୟୁ ତନ୍ତ୍ର", ml: "നാഡീവ്യവസ്ഥ", pa: "ਦਿਮਾਗੀ ਪ੍ਰਣਾਲੀ" } },
  { icon: Heart, label: { en: "Cardiovascular", ar: "القلب والأوعية", ur: "دل کا نظام", hi: "हृदय प्रणाली", ta: "இருதய சுற்றோட்டம்", te: "గుండె వ్యవస్థ", mr: "हृदय व रक्तवाहिन्या", bn: "কার্ডিওভাসকুলার", or: "ହୃଦୟ ପ୍ରଣାଳୀ", ml: "ഹൃദയ സിസ്റ്റം", pa: "ਦਿਲ ਦੀ ਪ੍ਰਣਾਲੀ" } },
  { icon: Activity, label: { en: "Respiratory", ar: "الجهاز التنفسي", ur: "سانس کا نظام", hi: "श्वसन तंत्र", ta: "சுவாச மண்டலம்", te: "శ్వాసకోశ వ్యవస్థ", mr: "श्वसन संस्था", bn: "শ্বাসতন্ত্র", or: "ଶ୍ୱାସ ପ୍ରଣାଳୀ", ml: "ശ്വാസകോശ സിസ്റ്റം", pa: "ਸਾਹ ਪ੍ਰਣਾਲੀ" } },
  { icon: Stethoscope, label: { en: "Gastrointestinal", ar: "الجهاز الهضمي", ur: "نظام ہاضمہ", hi: "पाचन तंत्र", ta: "செரிமான மண்டலம்", te: "జీర్ణ వ్యవస్థ", mr: "पचनसंस्था", bn: "পাচনতন্ত্র", or: "ପାଚନ ତନ୍ତ୍ର", ml: "ദഹന വ്യവസ്ഥ", pa: "ਪਾਚਨ ਪ੍ਰਣਾਲੀ" } },
  { icon: Bone, label: { en: "Musculoskeletal", ar: "الجهاز العضلي", ur: "ہڈیوں کا نظام", hi: "मांसपेशी तंत्र", ta: "தசைக்கூட்டு", te: "కండరాల వ్యవస్థ", mr: "स्नायू प्रणाली", bn: "মাসকুলোস্কেলেটাল", or: "ମାଂସପେଶୀ ତନ୍ତ୍ର", ml: "മസ്കുലോസ്കെലെറ്റൽ", pa: "ਮਾਸਪੇਸ਼ੀ ਪ੍ਰਣਾਲੀ" } },
  { icon: Eye, label: { en: "Vision & ENT", ar: "العين والأنف والحنجرة", ur: "آنکھ ناک کان", hi: "आंख नाक कान", ta: "கண் காது மூக்கு", te: "కళ్ళు ముక్కు చెవులు", mr: "डोळे नाक कान", bn: "চোখ কান নাক", or: "ଆଖି ନାକ କାନ", ml: "കണ്ണ് മൂക്ക് ചെവി", pa: "ਅੱਖ ਨੱਕ ਕੰਨ" } },
];

const keyInstructions = [
  { en: "Always carry this booklet during the entire Haj journey", ar: "احمل هذا الكتيب دائماً طوال رحلة الحج", ur: "پوری حج کی سفر میں یہ کتابچہ ہمیشہ ساتھ رکھیں", hi: "पूरी हज यात्रा के दौरान इस पुस्तिका को हमेशा साथ रखें", ta: "முழு ஹஜ் பயணத்தின் போதும் இந்த கையேட்டை எப்போதும் எடுத்துச் செல்லுங்கள்", te: "మొత్తం హజ్ ప్రయాణంలో ఈ పుస్తకాన్ని ఎల్లప్పుడూ మీతో ఉంచుకోండి", mr: "संपूर्ण हज यात्रेदरम्यान ही पुस्तिका नेहमी सोबत ठेवा", bn: "সম্পূর্ণ হজ যাত্রায় সর্বদা এই পুস্তিকা সাথে রাখুন", or: "ସମ୍ପୂର୍ଣ୍ଣ ହଜ ଯାତ୍ରା ସମୟରେ ଏହି ପୁସ୍ତିକା ସର୍ବଦା ସାଥିରେ ରଖନ୍ତୁ", ml: "മുഴുവൻ ഹജ്ജ് യാത്രയിലും ഈ ബുക്ക്ലെറ്റ് എപ്പോഴും കൂടെ കൊണ്ടുനടക്കുക", pa: "ਪੂਰੀ ਹੱਜ ਯਾਤਰਾ ਦੌਰਾਨ ਇਹ ਕਿਤਾਬਚਾ ਹਮੇਸ਼ਾ ਨਾਲ ਰੱਖੋ" },
  { en: "Record all your medications with dosages", ar: "سجل جميع أدويتك مع الجرعات", ur: "اپنی تمام ادویات خوراک کے ساتھ درج کریں", hi: "खुराक के साथ अपनी सभी दवाइयां दर्ज करें", ta: "உங்கள் அனைத்து மருந்துகளையும் அளவுகளுடன் பதிவு செய்யுங்கள்", te: "మీ మందులన్నింటినీ మోతాదులతో నమోదు చేయండి", mr: "डोससह तुमची सर्व औषधे नोंदवा", bn: "ডোজ সহ আপনার সমস্ত ওষুধ রেকর্ড করুন", or: "ଡୋଜ ସହିତ ଆପଣଙ୍କ ସମସ୍ତ ଔଷଧ ରେକର୍ଡ କରନ୍ତୁ", ml: "ഡോസേജുകളോടെ നിങ്ങളുടെ എല്ലാ മരുന്നുകളും രേഖപ്പെടുത്തുക", pa: "ਖੁਰਾਕ ਦੇ ਨਾਲ ਆਪਣੀਆਂ ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਦਰਜ ਕਰੋ" },
  { en: "Carry sufficient medicines for the entire trip plus extra", ar: "احمل أدوية كافية للرحلة بأكملها مع إضافي", ur: "پوری سفر کے لیے کافی دوائیں اور اضافی لائیں", hi: "पूरी यात्रा के लिए पर्याप्त दवाएं और अतिरिक्त लाएं", ta: "முழு பயணத்திற்கும் போதுமான மருந்துகள் மற்றும் கூடுதலாக எடுத்துச் செல்லுங்கள்", te: "మొత్తం ప్రయాణానికి తగినన్ని మందులు మరియు అదనపు తీసుకెళ్ళండి", mr: "संपूर्ण प्रवासासाठी पुरेशी औषधे आणि अतिरिक्त आणा", bn: "সম্পূর্ণ ভ্রমণের জন্য পর্যাপ্ত ওষুধ এবং অতিরিক্ত আনুন", or: "ସମ୍ପୂର୍ଣ୍ଣ ଯାତ୍ରା ପାଇଁ ପର୍ଯ୍ୟାପ୍ତ ଔଷଧ ଏବଂ ଅତିରିକ୍ତ ଆଣନ୍ତୁ", ml: "മുഴുവൻ യാത്രയ്ക്കും മതിയായ മരുന്നുകളും അധികവും കൊണ്ടുവരിക", pa: "ਪੂਰੀ ਯਾਤਰਾ ਲਈ ਕਾਫ਼ੀ ਦਵਾਈਆਂ ਅਤੇ ਵਾਧੂ ਲਿਆਓ" },
  { en: "Keep valid prescriptions for all medications", ar: "احتفظ بوصفات صالحة لجميع الأدوية", ur: "تمام ادویات کے لیے درست نسخے رکھیں", hi: "सभी दवाओं के लिए वैध नुस्खे रखें", ta: "அனைத்து மருந்துகளுக்கும் செல்லுபடியான மருந்து சீட்டுகளை வைத்திருங்கள்", te: "అన్ని మందులకు చెల్లుబాటు అయ్యే ప్రిస్క్రిప్షన్లను ఉంచండి", mr: "सर्व औषधांसाठी वैध प्रिस्क्रिप्शन ठेवा", bn: "সমস্ত ওষুধের জন্য বৈধ প্রেসক্রিপশন রাখুন", or: "ସମସ୍ତ ଔଷଧ ପାଇଁ ବୈଧ ପ୍ରେସ୍କ୍ରିପସନ ରଖନ୍ତୁ", ml: "എല്ലാ മരുന്നുകൾക്കും സാധുവായ പ്രിസ്ക്രിപ്ഷനുകൾ സൂക്ഷിക്കുക", pa: "ਸਾਰੀਆਂ ਦਵਾਈਆਂ ਲਈ ਵੈਧ ਨੁਸਖ਼ੇ ਰੱਖੋ" },
  { en: "Diabetic patients: Keep insulin cool and monitor glucose regularly", ar: "مرضى السكري: حافظ على الأنسولين بارداً وراقب الجلوكوز بانتظام", ur: "ذیابیطس کے مریض: انسولین ٹھنڈا رکھیں اور شوگر باقاعدگی سے چیک کریں", hi: "मधुमेह रोगी: इंसुलिन ठंडा रखें और नियमित रूप से शुगर जांचें", ta: "நீரிழிவு நோயாளிகள்: இன்சுலினை குளிர்ச்சியாக வைத்து குளுக்கோஸை தவறாமல் கண்காணிக்கவும்", te: "డయాబెటిక్ రోగులు: ఇన్సులిన్ చల్లగా ఉంచండి మరియు గ్లూకోజ్ క్రమం తప్పకుండా పర్యవేక్షించండి", mr: "मधुमेह रुग्ण: इन्सुलिन थंड ठेवा आणि ग्लुकोज नियमितपणे तपासा", bn: "ডায়াবেটিস রোগী: ইনসুলিন ঠান্ডা রাখুন এবং নিয়মিত গ্লুকোজ পরীক্ষা করুন", or: "ଡାଇବେଟିସ ରୋଗୀ: ଇନସୁଲିନ ଥଣ୍ଡା ରଖନ୍ତୁ ଏବଂ ନିୟମିତ ଗ୍ଲୁକୋଜ ଯାଞ୍ଚ କରନ୍ତୁ", ml: "പ്രമേഹ രോഗികൾ: ഇൻസുലിൻ തണുപ്പിച്ച് വയ്ക്കുക, ഗ്ലൂക്കോസ് പതിവായി പരിശോധിക്കുക", pa: "ਸ਼ੂਗਰ ਦੇ ਮਰੀਜ਼: ਇਨਸੁਲਿਨ ਠੰਡਾ ਰੱਖੋ ਅਤੇ ਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਗਲੂਕੋਜ਼ ਦੀ ਜਾਂਚ ਕਰੋ" },
];

const HealthCardSection = () => {
  const { language } = useLanguage();

  const speakText = `${labels.title[language] || labels.title.en}. ${labels.whatIsItDesc[language] || labels.whatIsItDesc.en}. ${labels.instructions[language] || labels.instructions.en}: ${keyInstructions.map(i => i[language] || i.en).join('. ')}`;

  return (
    <Card className="border-2 border-cyan-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cyan-500/10 flex items-center justify-center shadow-soft border-2 border-cyan-500/20">
              <ClipboardCheck className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-500" />
            </div>
            <div>
              <CardTitle className="text-lg">{labels.title[language] || labels.title.en}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {labels.subtitle[language] || labels.subtitle.en}
              </p>
            </div>
          </div>
          <TextToSpeechButton
            text={speakText}
            size="icon"
            variant="ghost"
            showLabel={false}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* What is it? */}
        <div className="bg-muted/50 rounded-lg p-3">
          <h3 className="font-medium text-sm mb-1.5">{labels.whatIsIt[language] || labels.whatIsIt.en}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {labels.whatIsItDesc[language] || labels.whatIsItDesc.en}
          </p>
        </div>

        {/* Medical Systems Checked */}
        <div>
          <h3 className="font-medium text-sm mb-2">{labels.systemsChecked[language] || labels.systemsChecked.en}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {medicalSystems.map((system, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-background border rounded-lg p-2"
              >
                <system.icon className="w-4 h-4 text-cyan-500 shrink-0" />
                <span className="text-xs truncate">{system.label[language] || system.label.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Instructions */}
        <div>
          <h3 className="font-medium text-sm mb-2">{labels.instructions[language] || labels.instructions.en}</h3>
          <ul className="space-y-1.5">
            {keyInstructions.map((instruction, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-xs text-muted-foreground">
                  {instruction[language] || instruction.en}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(HealthCardSection);
