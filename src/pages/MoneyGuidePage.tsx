import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Wallet, CreditCard, Banknote, AlertCircle, ShoppingBag } from "lucide-react";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import sbiHajjCard from "@/assets/sbi-hajj-card.png";

const MoneyGuidePage = () => {
  const { language, isRTL } = useLanguage();

  const labels = {
    title: { en: "Money Management", ar: "إدارة المال", ur: "مالی انتظام", hi: "धन प्रबंधन", ta: "பண மேலாண்மை", te: "డబ్బు నిర్వహణ", mr: "पैसे व्यवस्थापन", bn: "অর্থ ব্যবস্থাপনা", or: "ଅର୍ଥ ପରିଚାଳନା", ml: "പണ മാനേജ്മെന്റ്", pa: "ਪੈਸੇ ਪ੍ਰਬੰਧਨ" },
    subtitle: { en: "Financial tips for your pilgrimage", ar: "نصائح مالية لحجك", ur: "حج کے لیے مالی تجاویز", hi: "तीर्थयात्रा के लिए वित्तीय सुझाव", ta: "உங்கள் யாத்திரைக்கான நிதி குறிப்புகள்", te: "మీ తీర్థయాత్ర కోసం ఆర్థిక చిట్కాలు", mr: "तुमच्या तीर्थयात्रेसाठी आर्थिक टिप्स", bn: "আপনার তীর্থযাত্রার জন্য আর্থিক টিপস", or: "ଆପଣଙ୍କ ତୀର୍ଥଯାତ୍ରା ପାଇଁ ଆର୍ଥିକ ଟିପ୍ସ", ml: "നിങ്ങളുടെ തീർത്ഥാടനത്തിനുള്ള സാമ്പത്തിക നുറുങ്ങുകൾ", pa: "ਤੁਹਾਡੀ ਤੀਰਥ ਯਾਤਰਾ ਲਈ ਵਿੱਤੀ ਸੁਝਾਅ" },
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", ta: "பின்", te: "వెనుకకు", mr: "मागे", bn: "পিছনে", or: "ପଛକୁ", ml: "പിന്നിലേക്ക്", pa: "ਵਾਪਸ" },
  };

  const sbiCardContent = {
    title: { en: "SBI Hajj Card", ar: "بطاقة SBI للحج", ur: "SBI حج کارڈ", hi: "SBI हज कार्ड", ta: "SBI ஹஜ் அட்டை", te: "SBI హజ్ కార్డ్", mr: "SBI हज कार्ड", bn: "SBI হজ কার্ড", or: "SBI ହଜ କାର୍ଡ", ml: "SBI ഹജ്ജ് കാർഡ്", pa: "SBI ਹੱਜ ਕਾਰਡ" },
    description: { 
      en: "A prepaid international card issued for Indian Hajj pilgrims to make payments and withdraw cash safely in Saudi Arabia.", 
      ar: "بطاقة دولية مسبقة الدفع للحجاج الهنود للدفع وسحب النقود بأمان في السعودية.", 
      ur: "ہندوستانی حاجیوں کے لیے سعودی عرب میں محفوظ طریقے سے ادائیگی اور رقم نکالنے کے لیے پری پیڈ انٹرنیشنل کارڈ۔", 
      hi: "भारतीय हज यात्रियों के लिए सऊदी अरब में सुरक्षित भुगतान और नकद निकासी के लिए प्रीपेड अंतर्राष्ट्रीय कार्ड।", 
      ta: "இந்திய ஹஜ் யாத்ரீகர்களுக்காக சவுதி அரேபியாவில் பாதுகாப்பான கட்டணம் மற்றும் பணம் எடுக்க வழங்கப்படும் ப்ரீபெய்ட் சர்வதேச அட்டை.",
      te: "భారతీయ హజ్ యాత్రికులకు సౌదీ అరేబియాలో సురక్షిత చెల్లింపులు మరియు నగదు విత్‌డ్రా కోసం ప్రీపెయిడ్ ఇంటర్నేషనల్ కార్డ్.",
      mr: "भारतीय हज यात्रेकरूंसाठी सौदी अरेबियात सुरक्षित पेमेंट आणि कॅश विड्रॉल करण्यासाठी प्रीपेड आंतरराष्ट्रीय कार्ड.",
      bn: "ভারতীয় হজ যাত্রীদের জন্য সৌদি আরবে নিরাপদ পেমেন্ট এবং নগদ উত্তোলনের জন্য প্রিপেইড আন্তর্জাতিক কার্ড।",
      or: "ଭାରତୀୟ ହଜ ତୀର୍ଥଯାତ୍ରୀଙ୍କ ପାଇଁ ସୌଦି ଆରବରେ ସୁରକ୍ଷିତ ଦେୟ ଏବଂ ନଗଦ ଉଠାଣ ପାଇଁ ପ୍ରିପେଡ୍ ଆନ୍ତର୍ଜାତିକ କାର୍ଡ।",
      ml: "ഇന്ത്യൻ ഹജ്ജ് തീർത്ഥാടകർക്കായി സൗദി അറേബ്യയിൽ സുരക്ഷിത പേയ്‌മെന്റുകളും ക്യാഷ് പിൻവലിക്കലും നടത്താൻ പ്രീപെയ്ഡ് ഇന്റർനാഷണൽ കാർഡ്.",
      pa: "ਭਾਰਤੀ ਹੱਜ ਯਾਤਰੀਆਂ ਲਈ ਸਾਊਦੀ ਅਰਬ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਅਤੇ ਨਕਦ ਕਢਵਾਉਣ ਲਈ ਪ੍ਰੀਪੇਡ ਅੰਤਰਰਾਸ਼ਟਰੀ ਕਾਰਡ।"
    },
    tips: [
      { 
        en: "Carry limited cash and use the card where possible.", 
        ar: "احمل نقوداً محدودة واستخدم البطاقة قدر الإمكان.", 
        ur: "محدود نقد رکھیں اور جہاں ممکن ہو کارڈ استعمال کریں۔", 
        hi: "सीमित नकद रखें और जहां संभव हो कार्ड का उपयोग करें।",
        ta: "குறைந்த பணத்தை எடுத்துச் செல்லுங்கள், முடிந்த இடங்களில் அட்டையைப் பயன்படுத்துங்கள்.",
        te: "పరిమిత నగదు తీసుకెళ్ళండి మరియు సాధ్యమైన చోట కార్డ్ ఉపయోగించండి.",
        mr: "मर्यादित रोख रक्कम घ्या आणि शक्य तिथे कार्ड वापरा.",
        bn: "সীমিত নগদ বহন করুন এবং যেখানে সম্ভব কার্ড ব্যবহার করুন।",
        or: "ସୀମିତ ନଗଦ ରଖନ୍ତୁ ଏବଂ ସମ୍ଭବ ହେଲେ କାର୍ଡ ବ୍ୟବହାର କରନ୍ତୁ।",
        ml: "പരിമിതമായ പണം കൊണ്ടുപോകുക, സാധ്യമായിടത്ത് കാർഡ് ഉപയോഗിക്കുക.",
        pa: "ਸੀਮਤ ਨਕਦ ਰੱਖੋ ਅਤੇ ਜਿੱਥੇ ਸੰਭਵ ਹੋਵੇ ਕਾਰਡ ਵਰਤੋ।"
      },
      { 
        en: "If the card is lost or not working, contact the issuing bank immediately.", 
        ar: "إذا فقدت البطاقة أو لم تعمل، اتصل بالبنك المصدر فوراً.", 
        ur: "اگر کارڈ گم ہو جائے یا کام نہ کرے، فوری طور پر جاری کرنے والے بینک سے رابطہ کریں۔", 
        hi: "यदि कार्ड खो जाए या काम न करे, तो तुरंत जारीकर्ता बैंक से संपर्क करें।",
        ta: "அட்டை தொலைந்தால் அல்லது வேலை செய்யவில்லை என்றால், உடனடியாக வழங்கும் வங்கியைத் தொடர்பு கொள்ளுங்கள்.",
        te: "కార్డ్ పోయినా లేదా పనిచేయకపోతే, వెంటనే జారీ చేసిన బ్యాంకును సంప్రదించండి.",
        mr: "कार्ड हरवले किंवा काम करत नसल्यास, लगेच जारी करणाऱ्या बँकेशी संपर्क साधा.",
        bn: "কার্ড হারিয়ে গেলে বা কাজ না করলে, অবিলম্বে ইস্যুকারী ব্যাংকে যোগাযোগ করুন।",
        or: "କାର୍ଡ ହଜିଗଲେ କିମ୍ବା କାମ ନକଲେ, ତୁରନ୍ତ ଇସ୍ୟୁ କରୁଥିବା ବ୍ୟାଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ।",
        ml: "കാർഡ് നഷ്ടപ്പെടുകയോ പ്രവർത്തിക്കാതിരിക്കുകയോ ചെയ്താൽ, ഉടൻ ഇഷ്യൂ ചെയ്ത ബാങ്കുമായി ബന്ധപ്പെടുക.",
        pa: "ਜੇ ਕਾਰਡ ਗੁੰਮ ਹੋ ਜਾਵੇ ਜਾਂ ਕੰਮ ਨਾ ਕਰੇ, ਤੁਰੰਤ ਜਾਰੀ ਕਰਨ ਵਾਲੇ ਬੈਂਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।"
      },
    ],
  };

  const sections = [
    {
      icon: Banknote,
      title: { en: "Currency & Exchange", ar: "العملة والصرف", ur: "کرنسی اور تبادلہ", hi: "मुद्रा और विनिमय", tr: "Para Birimi ve Döviz", ru: "Валюта и обмен" },
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      items: [
        { en: "Saudi currency: Saudi Riyal (SAR)", ar: "العملة السعودية: الريال السعودي", ur: "سعودی کرنسی: سعودی ریال (SAR)", hi: "सऊदी मुद्रा: सऊदी रियाल (SAR)", tr: "Suudi para birimi: Suudi Riyali (SAR)", ru: "Валюта Саудовской Аравии: Саудовский риял (SAR)" },
        { en: "Exchange money at official exchange offices", ar: "صرف الأموال في مكاتب الصرافة الرسمية", ur: "سرکاری ایکسچینج آفسز میں رقم تبدیل کریں", hi: "आधिकारिक विनिमय कार्यालयों में पैसे बदलें", tr: "Resmi döviz bürolarında para bozdurün", ru: "Обменивайте деньги в официальных обменных пунктах" },
        { en: "Keep small denominations for tips and small purchases", ar: "احتفظ بفئات صغيرة للإكراميات والمشتريات الصغيرة", ur: "چھوٹے نوٹ ٹپس اور چھوٹی خریداری کے لیے رکھیں", hi: "टिप्स और छोटी खरीद के लिए छोटे नोट रखें", tr: "Bahşiş ve küçük alışverişler için küçük banknotlar bulundurun", ru: "Держите мелкие купюры для чаевых и мелких покупок" },
        { en: "Current exchange rate: Check before travel", ar: "سعر الصرف الحالي: تحقق قبل السفر", ur: "موجودہ شرح تبادلہ: سفر سے پہلے چیک کریں", hi: "वर्तमान विनिमय दर: यात्रा से पहले जांचें", tr: "Güncel döviz kuru: Seyahatten önce kontrol edin", ru: "Текущий курс обмена: проверьте перед поездкой" },
      ],
    },
    {
      icon: CreditCard,
      title: { en: "Cards & Digital Payments", ar: "البطاقات والدفع الرقمي", ur: "کارڈز اور ڈیجیٹل ادائیگی", hi: "कार्ड और डिजिटल भुगतान", tr: "Kartlar ve Dijital Ödemeler", ru: "Карты и цифровые платежи" },
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      items: [
        { en: "Visa and Mastercard widely accepted", ar: "فيزا وماستركارد مقبولة على نطاق واسع", ur: "ویزا اور ماسٹر کارڈ بڑے پیمانے پر قبول", hi: "वीजा और मास्टरकार्ड व्यापक रूप से स्वीकृत", tr: "Visa ve Mastercard yaygın olarak kabul edilir", ru: "Visa и Mastercard широко принимаются" },
        { en: "ATMs available at malls, hotels, and near Haram", ar: "أجهزة الصراف الآلي متوفرة في المولات والفنادق وقرب الحرم", ur: "مالز، ہوٹلز اور حرم کے قریب ATM دستیاب", hi: "मॉल, होटल और हरम के पास ATM उपलब्ध", tr: "Alışveriş merkezleri, oteller ve Harem yakınında ATM'ler mevcut", ru: "Банкоматы доступны в торговых центрах, отелях и возле Харама" },
        { en: "Apple Pay and Google Pay accepted at most stores", ar: "Apple Pay و Google Pay مقبولان في معظم المتاجر", ur: "زیادہ تر دکانوں میں Apple Pay اور Google Pay قبول", hi: "अधिकांश दुकानों में Apple Pay और Google Pay स्वीकृत", tr: "Çoğu mağazada Apple Pay ve Google Pay kabul edilir", ru: "Apple Pay и Google Pay принимаются в большинстве магазинов" },
        { en: "Notify your bank before travel to avoid card blocks", ar: "أبلغ البنك قبل السفر لتجنب حظر البطاقة", ur: "کارڈ بلاک ہونے سے بچنے کے لیے سفر سے پہلے بینک کو مطلع کریں", hi: "कार्ड ब्लॉक से बचने के लिए यात्रा से पहले बैंक को सूचित करें", tr: "Kart engellemesini önlemek için seyahatten önce bankanızı bilgilendirin", ru: "Уведомите банк перед поездкой, чтобы избежать блокировки карты" },
      ],
    },
    {
      icon: Wallet,
      title: { en: "Budget Tips", ar: "نصائح الميزانية", ur: "بجٹ کی تجاویز", hi: "बजट सुझाव", tr: "Bütçe İpuçları", ru: "Советы по бюджету" },
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      items: [
        { en: "Estimated daily expenses: 100-300 SAR (excluding accommodation)", ar: "النفقات اليومية المقدرة: 100-300 ريال", ur: "تخمینی روزانہ اخراجات: 100-300 ریال", hi: "अनुमानित दैनिक खर्च: 100-300 रियाल", tr: "Tahmini günlük harcama: 100-300 SAR", ru: "Примерные ежедневные расходы: 100-300 SAR" },
        { en: "Food near Haram: 20-50 SAR per meal", ar: "الطعام قرب الحرم: 20-50 ريال للوجبة", ur: "حرم کے قریب کھانا: 20-50 ریال فی کھانا", hi: "हरम के पास खाना: 20-50 रियाल प्रति भोजन", tr: "Harem yakınında yemek: öğün başına 20-50 SAR", ru: "Еда возле Харама: 20-50 SAR за прием пищи" },
        { en: "Zamzam water is free at the Haram", ar: "ماء زمزم مجاني في الحرم", ur: "زمزم کا پانی حرم میں مفت ہے", hi: "हरम में ज़मज़म पानी मुफ्त है", tr: "Zemzem suyu Harem'de ücretsizdir", ru: "Вода Замзам бесплатна в Хараме" },
        { en: "Consider group tours for cost savings on transport", ar: "فكر في الجولات الجماعية لتوفير تكاليف النقل", ur: "نقل و حمل کی لاگت بچانے کے لیے گروپ ٹورز پر غور کریں", hi: "परिवहन लागत बचाने के लिए ग्रुप टूर पर विचार करें", tr: "Ulaşım maliyetinden tasarruf için grup turlarını düşünün", ru: "Рассмотрите групповые туры для экономии на транспорте" },
      ],
    },
    {
      icon: ShoppingBag,
      title: { en: "Shopping Tips", ar: "نصائح التسوق", ur: "خریداری کی تجاویز", hi: "खरीदारी सुझाव", tr: "Alışveriş İpuçları", ru: "Советы по покупкам" },
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      items: [
        { en: "Bargaining is common in traditional markets", ar: "المساومة شائعة في الأسواق التقليدية", ur: "روایتی بازاروں میں مول تول عام ہے", hi: "पारंपरिक बाजारों में मोलभाव आम है", tr: "Geleneksel pazarlarda pazarlık yaygındır", ru: "Торг распространен на традиционных рынках" },
        { en: "Fixed prices at malls and chain stores", ar: "أسعار ثابتة في المولات والمتاجر المتسلسلة", ur: "مالز اور چین اسٹورز میں فکسڈ قیمتیں", hi: "मॉल और चेन स्टोर में निश्चित कीमतें", tr: "Alışveriş merkezleri ve zincir mağazalarda sabit fiyatlar", ru: "Фиксированные цены в торговых центрах и сетевых магазинах" },
        { en: "Keep receipts for customs declaration", ar: "احتفظ بالإيصالات للتصريح الجمركي", ur: "کسٹمز ڈیکلریشن کے لیے رسیدیں رکھیں", hi: "सीमा शुल्क घोषणा के लिए रसीदें रखें", tr: "Gümrük beyanı için makbuzları saklayın", ru: "Сохраняйте чеки для таможенной декларации" },
        { en: "Popular gifts: prayer beads, dates, oud perfume, prayer mats", ar: "هدايا شائعة: مسبحة، تمر، عود، سجادة", ur: "مشہور تحائف: تسبیح، کھجور، عود، جائے نماز", hi: "लोकप्रिय उपहार: तस्बीह, खजूर, ऊद इत्र, जायनमाज़", tr: "Popüler hediyeler: tesbih, hurma, ud parfüm, seccade", ru: "Популярные подарки: четки, финики, уд, молитвенные коврики" },
      ],
    },
    {
      icon: AlertCircle,
      title: { en: "Safety Tips", ar: "نصائح الأمان", ur: "حفاظتی تجاویز", hi: "सुरक्षा सुझाव", tr: "Güvenlik İpuçları", ru: "Советы по безопасности" },
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      items: [
        { en: "Don't carry large amounts of cash", ar: "لا تحمل مبالغ نقدية كبيرة", ur: "بڑی رقم نقد نہ رکھیں", hi: "बड़ी मात्रा में नकदी न रखें", tr: "Büyük miktarda nakit taşımayın", ru: "Не носите крупные суммы наличных" },
        { en: "Use hotel safe for valuables", ar: "استخدم خزنة الفندق للأشياء الثمينة", ur: "قیمتی اشیاء کے لیے ہوٹل سیف استعمال کریں", hi: "कीमती सामान के लिए होटल सेफ का उपयोग करें", tr: "Değerli eşyalar için otel kasasını kullanın", ru: "Используйте сейф отеля для ценностей" },
        { en: "Beware of unofficial money changers", ar: "احذر من الصرافين غير الرسميين", ur: "غیر سرکاری منی چینجرز سے ہوشیار رہیں", hi: "अनधिकृत मनी चेंजर्स से सावधान रहें", tr: "Yetkisiz döviz tüccarlarından kaçının", ru: "Остерегайтесь неофициальных обменников" },
        { en: "Keep emergency cash separately from wallet", ar: "احتفظ بنقود الطوارئ منفصلة عن المحفظة", ur: "ایمرجنسی رقم بٹوے سے الگ رکھیں", hi: "आपातकालीन नकदी बटुए से अलग रखें", tr: "Acil nakit parayı cüzdandan ayrı tutun", ru: "Храните экстренные наличные отдельно от кошелька" },
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10 sm:h-9 text-sm">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/10 flex items-center justify-center shadow-soft border-2 border-green-500/20">
              <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
              <p className="text-sm text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
            </div>
          </div>
        </div>

        {/* SBI Hajj Card Section */}
        <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-blue-700">{sbiCardContent.title[language] || sbiCardContent.title.en}</h2>
              <TextToSpeechButton
                text={`${sbiCardContent.title[language] || sbiCardContent.title.en}. ${sbiCardContent.description[language] || sbiCardContent.description.en}. ${sbiCardContent.tips.map(tip => tip[language] || tip.en).join('. ')}`}
                size="icon"
                variant="ghost"
                showLabel={false}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <img 
                src={sbiHajjCard} 
                alt="SBI Hajj Card" 
                className="w-full sm:w-48 md:w-56 rounded-lg shadow-md object-contain"
              />
              <div className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {sbiCardContent.description[language] || sbiCardContent.description.en}
                </p>
                <ul className="space-y-2">
                  {sbiCardContent.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{tip[language] || tip.en}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-2">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${section.bgColor} flex items-center justify-center shadow-soft border-2 ${section.color.replace('text-', 'border-')}/20`}>
                      <section.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${section.color}`} />
                    </div>
                    <h2 className="text-lg font-semibold">{section.title[language] || section.title.en}</h2>
                  </div>
                  <TextToSpeechButton
                    text={`${section.title[language] || section.title.en}. ${section.items.map(item => item[language] || item.en).join('. ')}`}
                    size="icon"
                    variant="ghost"
                    showLabel={false}
                  />
                </div>
                <ul className="space-y-2.5">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                      <span className="text-sm text-muted-foreground">{item[language] || item.en}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default MoneyGuidePage;
