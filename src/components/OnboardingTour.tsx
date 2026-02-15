import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Users,
  MapPin,
  BookOpen,
  Heart,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
} from "lucide-react";

const TOUR_STORAGE_KEY = "hajjcare_onboarding_complete";

type TourStep = {
  icon: React.ReactNode;
  titleKey: Record<string, string>;
  descKey: Record<string, string>;
  tip: Record<string, string>;
  color: string;
};

const tourSteps: TourStep[] = [
  {
    icon: <Sparkles className="w-10 h-10" />,
    color: "from-emerald-500 to-teal-600",
    titleKey: {
      en: "Welcome to HajjCare AI",
      ar: "مرحباً بك في حج كير",
      ur: "حج کیئر میں خوش آمدید",
      hi: "हज केयर AI में आपका स्वागत है",
      ta: "ஹஜ்கேர் AI-க்கு வரவேற்கிறோம்",
      te: "హజ్‌కేర్ AIకి స్వాగతం",
      mr: "हज केअर AI मध्ये स्वागत",
      bn: "হজকেয়ার AI-তে স্বাগতম",
      or: "ହଜକେୟାର AIରେ ସ୍ୱାଗତ",
      ml: "ഹജ്ജ്‌കെയർ AIലേക്ക് സ്വാഗതം",
      pa: "ਹੱਜ ਕੇਅਰ AI ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
    },
    descKey: {
      en: "Your complete companion for a blessed Hajj journey. Let us show you how this app can help you every step of the way.",
      ar: "رفيقك الكامل لرحلة حج مباركة. دعنا نعرفك كيف يمكن لهذا التطبيق مساعدتك في كل خطوة.",
      ur: "حج کے مبارک سفر کے لیے آپ کا مکمل ساتھی۔ آئیے ہم آپ کو دکھائیں کہ یہ ایپ ہر قدم پر آپ کی مدد کیسے کر سکتی ہے۔",
      hi: "एक मुबारक हज यात्रा के लिए आपका पूर्ण साथी। आइए हम आपको दिखाएं कि यह ऐप हर कदम पर आपकी कैसे मदद कर सकता है।",
      ta: "ஒரு அருளான ஹஜ் பயணத்திற்கான உங்கள் முழுமையான துணை. ஒவ்வொரு அடியிலும் இந்த ஆப் எவ்வாறு உதவும் என்று காட்டுகிறோம்.",
      te: "ధన్యమైన హజ్ ప్రయాణానికి మీ పూర్తి సహచరుడు. ప్రతి అడుగులో ఈ యాప్ మీకు ఎలా సహాయపడుతుందో చూపిస్తాము.",
      mr: "एका मुबारक हज प्रवासासाठी तुमचा संपूर्ण साथीदार. प्रत्येक पावलावर हे ॲप कसे मदत करू शकते ते दाखवू या.",
      bn: "একটি বরকতময় হজ যাত্রার জন্য আপনার সম্পূর্ণ সঙ্গী। প্রতিটি ধাপে এই অ্যাপ কীভাবে সাহায্য করতে পারে তা দেখাই।",
      or: "ଏକ ବରକତମୟ ହଜ ଯାତ୍ରା ପାଇଁ ଆପଣଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ସାଥୀ। ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପରେ ଏହି ଆପ୍ କିପରି ସାହାଯ୍ୟ କରିପାରିବ ତାହା ଦେଖାଇବା।",
      ml: "അനുഗ്രഹപൂർണ്ണമായ ഹജ്ജ് യാത്രയ്ക്കുള്ള നിങ്ങളുടെ പൂർണ്ണ സഹചാരി. എല്ലാ ഘട്ടത്തിലും ഈ ആപ്പ് എങ്ങനെ സഹായിക്കും എന്ന് കാണിക്കട്ടെ.",
      pa: "ਇੱਕ ਮੁਬਾਰਕ ਹੱਜ ਯਾਤਰਾ ਲਈ ਤੁਹਾਡਾ ਪੂਰਾ ਸਾਥੀ। ਆਓ ਤੁਹਾਨੂੰ ਦਿਖਾਈਏ ਕਿ ਇਹ ਐਪ ਹਰ ਕਦਮ ਤੇ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ।",
    },
    tip: {
      en: "Swipe through to learn the key features!",
      ar: "اسحب للتعرف على الميزات الرئيسية!",
      ur: "اہم خصوصیات جاننے کے لیے سوائپ کریں!",
      hi: "मुख्य विशेषताएं जानने के लिए स्वाइप करें!",
      ta: "முக்கிய அம்சங்களை அறிய ஸ்வைப் செய்யுங்கள்!",
      te: "ముఖ్య ఫీచర్‌లను తెలుసుకోవడానికి స్వైప్ చేయండి!",
      mr: "मुख्य वैशिष्ट्ये जाणून घेण्यासाठी स्वाइप करा!",
      bn: "মূল বৈশিষ্ট্যগুলি জানতে সোয়াইপ করুন!",
      or: "ମୁଖ୍ୟ ବୈଶିଷ୍ଟ୍ୟ ଜାଣିବାକୁ ସ୍ୱାଇପ୍ କରନ୍ତୁ!",
      ml: "പ്രധാന ഫീച്ചറുകൾ അറിയാൻ സ്വൈപ്പ് ചെയ്യൂ!",
      pa: "ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਜਾਣਨ ਲਈ ਸਵਾਈਪ ਕਰੋ!",
    },
  },
  {
    icon: <MessageCircle className="w-10 h-10" />,
    color: "from-blue-500 to-indigo-600",
    titleKey: {
      en: "AI Hajj Assistant",
      ar: "مساعد الحج الذكي",
      ur: "AI حج اسسٹنٹ",
      hi: "AI हज सहायक",
      ta: "AI ஹஜ் உதவியாளர்",
      te: "AI హజ్ సహాయకుడు",
      mr: "AI हज सहाय्यक",
      bn: "AI হজ সহায়ক",
      or: "AI ହଜ ସହାୟକ",
      ml: "AI ഹജ്ജ് സഹായി",
      pa: "AI ਹੱਜ ਸਹਾਇਕ",
    },
    descKey: {
      en: "Ask any question about Hajj rituals, duas, health tips, or travel logistics. Our AI understands your language and guides you with authentic Islamic knowledge.",
      ar: "اسأل أي سؤال عن مناسك الحج أو الأدعية أو النصائح الصحية أو اللوجستيات. ذكاؤنا الاصطناعي يفهم لغتك ويرشدك بعلم إسلامي موثوق.",
      ur: "حج کے مناسک، دعاؤں، صحت کی تجاویز، یا سفری معلومات کے بارے میں کوئی بھی سوال پوچھیں۔ ہمارا AI آپ کی زبان سمجھتا ہے۔",
      hi: "हज के रीति-रिवाजों, दुआओं, स्वास्थ्य सुझावों, या यात्रा के बारे में कोई भी सवाल पूछें। हमारा AI आपकी भाषा समझता है।",
      ta: "ஹஜ் சடங்குகள், துஆக்கள், உடல்நல குறிப்புகள் பற்றி எந்த கேள்வியும் கேளுங்கள். AI உங்கள் மொழியைப் புரிந்துகொள்கிறது.",
      te: "హజ్ ఆచారాలు, దుఆలు, ఆరోగ్య చిట్కాలు గురించి ఏ ప్రశ్న అయినా అడగండి. AI మీ భాషను అర్థం చేసుకుంటుంది.",
      mr: "हज विधी, दुआ, आरोग्य टिप्स बद्दल कोणताही प्रश्न विचारा. AI तुमची भाषा समजते.",
      bn: "হজের আচার, দোয়া, স্বাস্থ্য পরামর্শ সম্পর্কে যেকোনো প্রশ্ন করুন। AI আপনার ভাষা বোঝে।",
      or: "ହଜ ରୀତି, ଦୁଆ, ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ। AI ଆପଣଙ୍କ ଭାଷା ବୁଝେ।",
      ml: "ഹജ്ജ് ആചാരങ്ങൾ, ദുആകൾ, ആരോഗ്യ ടിപ്പുകൾ കുറിച്ച് ഏത് ചോദ്യവും ചോദിക്കൂ. AI നിങ്ങളുടെ ഭാഷ മനസ്സിലാക്കുന്നു.",
      pa: "ਹੱਜ ਰੀਤੀ, ਦੁਆਵਾਂ, ਸਿਹਤ ਸੁਝਾਅ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ। AI ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਸਮਝਦਾ ਹੈ।",
    },
    tip: {
      en: "Tap 'AI Help' in the bottom navigation to start chatting!",
      ar: "اضغط على 'مساعدة AI' في الشريط السفلي لبدء المحادثة!",
      ur: "چیٹ شروع کرنے کے لیے نیچے 'AI مدد' پر ٹیپ کریں!",
      hi: "चैट शुरू करने के लिए नीचे 'AI मदद' पर टैप करें!",
      ta: "அரட்டையைத் தொடங்க 'AI உதவி' தட்டவும்!",
      te: "చాట్ ప్రారంభించడానికి 'AI సహాయం' ట్యాప్ చేయండి!",
      mr: "चॅट सुरू करण्यासाठी 'AI मदत' टॅप करा!",
      bn: "চ্যাট শুরু করতে 'AI সাহায্য' ট্যাপ করুন!",
      or: "ଚାଟ୍ ଆରମ୍ଭ କରିବାକୁ 'AI ସାହାଯ୍ୟ' ଟ୍ୟାପ୍ କରନ୍ତୁ!",
      ml: "ചാറ്റ് ആരംഭിക്കാൻ 'AI സഹായം' ടാപ്പ് ചെയ്യൂ!",
      pa: "ਚੈਟ ਸ਼ੁਰੂ ਕਰਨ ਲਈ 'AI ਮਦਦ' ਟੈਪ ਕਰੋ!",
    },
  },
  {
    icon: <Users className="w-10 h-10" />,
    color: "from-purple-500 to-violet-600",
    titleKey: {
      en: "Family Tracking",
      ar: "تتبع العائلة",
      ur: "خاندان کی ٹریکنگ",
      hi: "परिवार ट्रैकिंग",
      ta: "குடும்ப கண்காணிப்பு",
      te: "కుటుంబ ట్రాకింగ్",
      mr: "कुटुंब ट्रॅकिंग",
      bn: "পরিবার ট্র্যাকিং",
      or: "ପରିବାର ଟ୍ରାକିଂ",
      ml: "കുടുംബ ട്രാക്കിംഗ്",
      pa: "ਪਰਿਵਾਰ ਟ੍ਰੈਕਿੰਗ",
    },
    descKey: {
      en: "Stay connected with your family during Hajj. Create a family group, share your location, and see each other's status in real-time. Never worry about losing your loved ones in the crowd.",
      ar: "ابق على اتصال مع عائلتك أثناء الحج. أنشئ مجموعة عائلية وشارك موقعك وتابع حالة بعضكم البعض مباشرة.",
      ur: "حج کے دوران اپنے خاندان سے جڑے رہیں۔ فیملی گروپ بنائیں، اپنا مقام شیئر کریں اور ایک دوسرے کی حالت دیکھیں۔",
      hi: "हज के दौरान अपने परिवार से जुड़े रहें। फैमिली ग्रुप बनाएं, अपना स्थान साझा करें और एक-दूसरे की स्थिति देखें।",
      ta: "ஹஜ்ஜின் போது உங்கள் குடும்பத்துடன் இணைந்திருங்கள். குடும்ப குழு உருவாக்கி, இருப்பிடம் பகிருங்கள்.",
      te: "హజ్ సమయంలో మీ కుటుంబంతో అనుసంధానమై ఉండండి. కుటుంబ గ్రూప్ సృష్టించండి, లొకేషన్ పంచుకోండి.",
      mr: "हज दरम्यान तुमच्या कुटुंबाशी जोडलेले राहा. कुटुंब गट तयार करा, स्थान शेअर करा.",
      bn: "হজের সময় আপনার পরিবারের সাথে সংযুক্ত থাকুন। পরিবার গ্রুপ তৈরি করুন, অবস্থান শেয়ার করুন।",
      or: "ହଜ ସମୟରେ ଆପଣଙ୍କ ପରିବାର ସହ ଯୋଡି ରୁହନ୍ତୁ। ପରିବାର ଗ୍ରୁପ୍ ତିଆରି କରନ୍ତୁ, ସ୍ଥାନ ଶେୟାର କରନ୍ତୁ।",
      ml: "ഹജ്ജ് സമയത്ത് കുടുംബവുമായി ബന്ധപ്പെട്ടിരിക്കൂ. കുടുംബ ഗ്രൂപ്പ് സൃഷ്ടിക്കൂ, ലൊക്കേഷൻ പങ്കിടൂ.",
      pa: "ਹੱਜ ਦੌਰਾਨ ਆਪਣੇ ਪਰਿਵਾਰ ਨਾਲ ਜੁੜੇ ਰਹੋ। ਪਰਿਵਾਰ ਗਰੁੱਪ ਬਣਾਓ, ਸਥਾਨ ਸਾਂਝਾ ਕਰੋ।",
    },
    tip: {
      en: "Go to 'Family' tab to create or join a group!",
      ar: "اذهب إلى تبويب 'العائلة' لإنشاء أو الانضمام لمجموعة!",
      ur: "گروپ بنانے یا شامل ہونے کے لیے 'خاندان' ٹیب پر جائیں!",
      hi: "ग्रुप बनाने या जुड़ने के लिए 'परिवार' टैब पर जाएं!",
      ta: "குழு உருவாக்க 'குடும்பம்' டேப் செல்லுங்கள்!",
      te: "గ్రూప్ సృష్టించడానికి 'కుటుంబం' ట్యాబ్ కు వెళ్ళండి!",
      mr: "गट तयार करण्यासाठी 'कुटुंब' टॅबवर जा!",
      bn: "গ্রুপ তৈরি করতে 'পরিবার' ট্যাবে যান!",
      or: "ଗ୍ରୁପ୍ ତିଆରି କରିବାକୁ 'ପରିବାର' ଟ୍ୟାବ ଯାଆନ୍ତୁ!",
      ml: "ഗ്രൂപ്പ് സൃഷ്ടിക്കാൻ 'കുടുംബം' ടാബിലേക്ക് പോകൂ!",
      pa: "ਗਰੁੱਪ ਬਣਾਉਣ ਲਈ 'ਪਰਿਵਾਰ' ਟੈਬ ਤੇ ਜਾਓ!",
    },
  },
  {
    icon: <BookOpen className="w-10 h-10" />,
    color: "from-amber-500 to-orange-600",
    titleKey: {
      en: "Complete Hajj Guides",
      ar: "أدلة حج كاملة",
      ur: "مکمل حج گائیڈز",
      hi: "पूर्ण हज गाइड",
      ta: "முழுமையான ஹஜ் வழிகாட்டிகள்",
      te: "సంపూర్ణ హజ్ గైడ్‌లు",
      mr: "संपूर्ण हज मार्गदर्शक",
      bn: "সম্পূর্ণ হজ গাইড",
      or: "ସମ୍ପୂର୍ଣ୍ଣ ହଜ ଗାଇଡ୍",
      ml: "സമ്പൂർണ്ണ ഹജ്ജ് ഗൈഡുകൾ",
      pa: "ਪੂਰੀ ਹੱਜ ਗਾਈਡ",
    },
    descKey: {
      en: "Access step-by-step guides for every ritual — Tawaf, Sa'i, Arafat, Muzdalifah, and more. Plus health tips, packing lists, money guides, and Saudi rules — all in your language.",
      ar: "احصل على أدلة خطوة بخطوة لكل منسك — الطواف والسعي وعرفة ومزدلفة وأكثر. بالإضافة إلى نصائح صحية وقوائم التعبئة وأحكام السعودية — كلها بلغتك.",
      ur: "ہر منسک کے لیے مرحلہ وار رہنمائی — طواف، سعی، عرفات، مزدلفہ اور مزید۔ صحت کی تجاویز، پیکنگ لسٹ، اور سعودی قوانین — سب آپ کی زبان میں۔",
      hi: "हर रीति के लिए चरण-दर-चरण गाइड — तवाफ, सई, अरफात, मुज़दलिफा और अधिक। स्वास्थ्य सुझाव, पैकिंग सूची, और सऊदी नियम — सब आपकी भाषा में।",
      ta: "ஒவ்வொரு சடங்கிற்கும் படிப்படியான வழிகாட்டிகள் — தவாஃப், ஸஃஈ, அரஃபா. உடல்நல குறிப்புகள், பேக்கிங் பட்டியல் — உங்கள் மொழியில்.",
      te: "ప్రతి ఆచారానికి దశల వారీ గైడ్‌లు — తవాఫ్, సఈ, అరఫాత్. ఆరోగ్య చిట్కాలు, ప్యాకింగ్ — మీ భాషలో.",
      mr: "प्रत्येक विधीसाठी टप्प्याटप्प्याने मार्गदर्शक — तवाफ, सई, अराफात. आरोग्य टिप्स, पॅकिंग — तुमच्या भाषेत.",
      bn: "প্রতিটি আচারের জন্য ধাপে ধাপে গাইড — তাওয়াফ, সাঈ, আরাফাত। স্বাস্থ্য পরামর্শ, প্যাকিং — আপনার ভাষায়।",
      or: "ପ୍ରତ୍ୟେକ ରୀତି ପାଇଁ ପଦକ୍ଷେପ ଗାଇଡ — ତାୱାଫ, ସାଈ, ଆରାଫାତ। ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ, ପ୍ୟାକିଂ — ଆପଣଙ୍କ ଭାଷାରେ।",
      ml: "ഓരോ ആചാരത്തിനും ഘട്ടം ഘട്ടമായ ഗൈഡുകൾ — ത്വവാഫ്, സഅ്‌യ്, അറഫ. ആരോഗ്യ ടിപ്പുകൾ, പാക്കിംഗ് — നിങ്ങളുടെ ഭാഷയിൽ.",
      pa: "ਹਰ ਰੀਤੀ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ — ਤਵਾਫ਼, ਸਈ, ਅਰਫ਼ਾਤ। ਸਿਹਤ ਸੁਝਾਅ, ਪੈਕਿੰਗ — ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ।",
    },
    tip: {
      en: "Open the sidebar ☰ to browse all guides!",
      ar: "افتح القائمة الجانبية ☰ لتصفح جميع الأدلة!",
      ur: "تمام گائیڈز دیکھنے کے لیے سائیڈبار ☰ کھولیں!",
      hi: "सभी गाइड देखने के लिए साइडबार ☰ खोलें!",
      ta: "அனைத்து வழிகாட்டிகளையும் பார்க்க ☰ திறக்கவும்!",
      te: "అన్ని గైడ్‌లు చూడటానికి ☰ తెరవండి!",
      mr: "सर्व मार्गदर्शक पाहण्यासाठी ☰ उघडा!",
      bn: "সব গাইড দেখতে ☰ খুলুন!",
      or: "ସବୁ ଗାଇଡ ଦେଖିବାକୁ ☰ ଖୋଲନ୍ତୁ!",
      ml: "എല്ലാ ഗൈഡുകളും കാണാൻ ☰ തുറക്കൂ!",
      pa: "ਸਾਰੀਆਂ ਗਾਈਡਾਂ ਦੇਖਣ ਲਈ ☰ ਖੋਲ੍ਹੋ!",
    },
  },
  {
    icon: <Heart className="w-10 h-10" />,
    color: "from-rose-500 to-pink-600",
    titleKey: {
      en: "You're All Set!",
      ar: "أنت جاهز!",
      ur: "آپ تیار ہیں!",
      hi: "आप तैयार हैं!",
      ta: "நீங்கள் தயார்!",
      te: "మీరు సిద్ధంగా ఉన్నారు!",
      mr: "तुम्ही तयार आहात!",
      bn: "আপনি প্রস্তুত!",
      or: "ଆପଣ ପ୍ରସ୍ତୁତ!",
      ml: "നിങ്ങൾ തയ്യാർ!",
      pa: "ਤੁਸੀਂ ਤਿਆਰ ਹੋ!",
    },
    descKey: {
      en: "May Allah accept your Hajj. Start exploring the app — ask the AI assistant, connect with family, or browse the guides. We're here with you every step of the way. Labbaik Allahumma Labbaik! 🕋",
      ar: "تقبل الله حجك. ابدأ باستكشاف التطبيق — اسأل المساعد الذكي أو تواصل مع عائلتك أو تصفح الأدلة. نحن معك في كل خطوة. لبيك اللهم لبيك! 🕋",
      ur: "اللہ آپ کا حج قبول فرمائے۔ ایپ استعمال شروع کریں — AI اسسٹنٹ سے پوچھیں، خاندان سے جڑیں، یا گائیڈز دیکھیں۔ لبیک اللہم لبیک! 🕋",
      hi: "अल्लाह आपका हज कबूल करे। ऐप खोजना शुरू करें — AI से पूछें, परिवार से जुड़ें, या गाइड देखें। लब्बैक अल्लाहुम्मा लब्बैक! 🕋",
      ta: "அல்லாஹ் உங்கள் ஹஜ்ஜை ஏற்றுக்கொள்வானாக. ஆப்பை ஆராயுங்கள். லப்பைக் அல்லாஹும்ம லப்பைக்! 🕋",
      te: "అల్లాహ్ మీ హజ్‌ను స్వీకరించుగాక. యాప్ అన్వేషించండి. లబ్బైక్ అల్లాహుమ్మ లబ్బైక్! 🕋",
      mr: "अल्लाह तुमचा हज कबूल करो. ॲप एक्सप्लोर करा. लब्बैक अल्लाहुम्मा लब्बैक! 🕋",
      bn: "আল্লাহ আপনার হজ কবুল করুন। অ্যাপ এক্সপ্লোর করুন। লাব্বাইক আল্লাহুম্মা লাব্বাইক! 🕋",
      or: "ଆଲ୍ଲାହ ଆପଣଙ୍କ ହଜ କବୁଲ କରନ୍ତୁ। ଆପ୍ ଏକ୍ସପ୍ଲୋର କରନ୍ତୁ। ଲାବ୍ବାଇକ ଆଲ୍ଲାହୁମ୍ମା ଲାବ୍ବାଇକ! 🕋",
      ml: "അല്ലാഹു നിങ്ങളുടെ ഹജ്ജ് സ്വീകരിക്കട്ടെ. ആപ്പ് എക്സ്പ്ലോർ ചെയ്യൂ. ലബ്ബൈക് അല്ലാഹുമ്മ ലബ്ബൈക്! 🕋",
      pa: "ਅੱਲਾਹ ਤੁਹਾਡਾ ਹੱਜ ਕਬੂਲ ਕਰੇ। ਐਪ ਐਕਸਪਲੋਰ ਕਰੋ। ਲੱਬੈਕ ਅੱਲਾਹੁੰਮਾ ਲੱਬੈਕ! 🕋",
    },
    tip: {
      en: "You can replay this tour anytime from the sidebar!",
      ar: "يمكنك إعادة هذه الجولة في أي وقت من القائمة الجانبية!",
      ur: "آپ سائیڈبار سے کبھی بھی یہ ٹور دوبارہ دیکھ سکتے ہیں!",
      hi: "आप साइडबार से कभी भी यह टूर दोबारा देख सकते हैं!",
      ta: "சைட்பாரில் இருந்து எப்போது வேண்டுமானாலும் இந்த சுற்றுப்பயணத்தை மீண்டும் பார்க்கலாம்!",
      te: "సైడ్‌బార్ నుండి ఎప్పుడైనా ఈ టూర్ మళ్ళీ చూడవచ్చు!",
      mr: "साइडबारमधून कधीही हा टूर पुन्हा पाहू शकता!",
      bn: "সাইডবার থেকে যেকোনো সময় এই ট্যুর আবার দেখতে পারেন!",
      or: "ସାଇଡବାରରୁ ଯେକୌଣସି ସମୟରେ ଏହି ଟୁର୍ ପୁନରାବୃତ୍ତି କରିପାରିବେ!",
      ml: "സൈഡ്ബാറിൽ നിന്ന് എപ്പോൾ വേണമെങ്കിലും ഈ ടൂർ വീണ്ടും കാണാം!",
      pa: "ਸਾਈਡਬਾਰ ਤੋਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਇਹ ਟੂਰ ਦੁਬਾਰਾ ਦੇਖ ਸਕਦੇ ਹੋ!",
    },
  },
];

export const resetOnboardingTour = () => {
  localStorage.removeItem(TOUR_STORAGE_KEY);
};

export const OnboardingTour = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const hasCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!hasCompleted && isAuthenticated) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setStep(0);
  }, []);

  const handleNext = useCallback(() => {
    if (step < tourSteps.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  }, [step, handleClose]);

  const handlePrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  // Public method for re-triggering
  useEffect(() => {
    const handler = () => {
      setStep(0);
      setIsOpen(true);
    };
    window.addEventListener("hajjcare:replay-tour", handler);
    return () => window.removeEventListener("hajjcare:replay-tour", handler);
  }, []);

  const current = tourSteps[step];
  const lang = language as string;

  const nextLabel: Record<string, string> = {
    en: "Next", ar: "التالي", ur: "اگلا", hi: "अगला", ta: "அடுத்து",
    te: "తదుపరి", mr: "पुढे", bn: "পরবর্তী", or: "ପରବର୍ତ୍ତୀ", ml: "അടുത്തത്", pa: "ਅਗਲਾ",
  };
  const prevLabel: Record<string, string> = {
    en: "Back", ar: "رجوع", ur: "پیچھے", hi: "पीछे", ta: "முந்தைய",
    te: "వెనుకకు", mr: "मागे", bn: "পিছনে", or: "ପଛକୁ", ml: "പിന്നോട്ട്", pa: "ਪਿੱਛੇ",
  };
  const doneLabel: Record<string, string> = {
    en: "Start Exploring!", ar: "ابدأ الاستكشاف!", ur: "دریافت شروع کریں!", hi: "खोजना शुरू करें!",
    ta: "ஆராய்வதைத் தொடங்குங்கள்!", te: "అన్వేషించడం ప్రారంభించండి!", mr: "शोधायला सुरुवात करा!",
    bn: "এক্সপ্লোর শুরু করুন!", or: "ଅନ୍ୱେଷଣ ଆରମ୍ଭ କରନ୍ତୁ!", ml: "പര്യവേക്ഷണം ആരംഭിക്കൂ!", pa: "ਖੋਜ ਸ਼ੁਰੂ ਕਰੋ!",
  };
  const skipLabel: Record<string, string> = {
    en: "Skip", ar: "تخطي", ur: "چھوڑیں", hi: "छोड़ें", ta: "தவிர்",
    te: "దాటవేయి", mr: "वगळा", bn: "এড়িয়ে যান", or: "ଛାଡିଦିଅନ୍ତୁ", ml: "ഒഴിവാക്കുക", pa: "ਛੱਡੋ",
  };

  const isRTL = ["ar", "ur"].includes(lang);
  const isLast = step === tourSteps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent
        className="max-w-[92vw] sm:max-w-md p-0 overflow-hidden rounded-2xl border-0 shadow-2xl gap-0 [&>button]:hidden"
      >
        <div dir={isRTL ? "rtl" : "ltr"}>
          {/* Skip button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Icon header */}
          <div className={`bg-gradient-to-br ${current.color} p-8 flex flex-col items-center justify-center text-white`}>
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 animate-scale-in">
              {current.icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-center leading-tight">
              {current.titleKey[lang] || current.titleKey.en}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed text-center">
              {current.descKey[lang] || current.descKey.en}
            </p>

            {/* Tip */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
              <p className="text-sm font-medium text-primary">
                💡 {current.tip[lang] || current.tip.en}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {tourSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === step
                      ? "w-8 h-2.5 bg-primary"
                      : "w-2.5 h-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-2">
              {step > 0 ? (
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1 h-12 text-base rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {prevLabel[lang] || prevLabel.en}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1 h-12 text-base rounded-xl text-muted-foreground"
                >
                  {skipLabel[lang] || skipLabel.en}
                </Button>
              )}
              <Button
                onClick={handleNext}
                className={`flex-1 h-12 text-base rounded-xl bg-gradient-to-r ${current.color} text-white hover:opacity-90`}
              >
                {isLast
                  ? (doneLabel[lang] || doneLabel.en)
                  : (nextLabel[lang] || nextLabel.en)}
                {!isLast && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
