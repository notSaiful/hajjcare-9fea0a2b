import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Heart, Thermometer, Droplets, AlertTriangle, Pill, Sun } from "lucide-react";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import MedicalStaffSection from "@/components/MedicalStaffSection";

const HealthGuidePage = () => {
  const { language, isRTL } = useLanguage();

  const labels = {
    title: { en: "Health Guide", ar: "دليل الصحة", ur: "صحت گائیڈ", hi: "स्वास्थ्य गाइड", ta: "உடல்நல வழிகாட்டி", te: "ఆరోగ్య గైడ్", mr: "आरोग्य मार्गदर्शक", bn: "স্বাস্থ্য গাইড", or: "ସ୍ୱାସ୍ଥ୍ୟ ଗାଇଡ୍", ml: "ആരോഗ്യ ഗൈഡ്", pa: "ਸਿਹਤ ਗਾਈਡ" },
    subtitle: { en: "Stay healthy during your pilgrimage", ar: "حافظ على صحتك خلال الحج", ur: "حج کے دوران صحت مند رہیں", hi: "तीर्थयात्रा के दौरान स्वस्थ रहें", ta: "யாத்திரையின் போது ஆரோக்கியமாக இருங்கள்", te: "తీర్థయాత్ర సమయంలో ఆరోగ్యంగా ఉండండి", mr: "तीर्थयात्रेदरम्यान निरोगी राहा", bn: "তীর্থযাত্রার সময় সুস্থ থাকুন", or: "ତୀର୍ଥଯାତ୍ରା ସମୟରେ ସୁସ୍ଥ ରୁହନ୍ତୁ", ml: "തീർത്ഥാടനത്തിനിടെ ആരോഗ്യമായിരിക്കുക", pa: "ਤੀਰਥ ਯਾਤਰਾ ਦੌਰਾਨ ਸਿਹਤਮੰਦ ਰਹੋ" },
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", ta: "பின்", te: "వెనుకకు", mr: "मागे", bn: "পিছনে", or: "ପଛକୁ", ml: "പിന്നിലേക്ക്", pa: "ਵਾਪਸ" },
  };

  const healthTopics = [
    {
      icon: Thermometer,
      title: { en: "Heat Management", ar: "إدارة الحرارة", ur: "گرمی کا انتظام", hi: "गर्मी प्रबंधन", tr: "Sıcaklık Yönetimi", ru: "Управление теплом" },
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      tips: [
        { en: "Avoid outdoor activities during peak heat (10 AM - 4 PM)", ar: "تجنب الأنشطة الخارجية خلال ذروة الحرارة", ur: "شدید گرمی کے دوران باہری سرگرمیوں سے بچیں", hi: "चरम गर्मी में बाहरी गतिविधियों से बचें", tr: "Yoğun sıcaklıkta dış aktivitelerden kaçının", ru: "Избегайте активности на улице в жару" },
        { en: "Wear light-colored, loose clothing", ar: "ارتدِ ملابس فاتحة اللون وفضفاضة", ur: "ہلکے رنگ کے ڈھیلے کپڑے پہنیں", hi: "हल्के रंग के ढीले कपड़े पहनें", tr: "Açık renkli, bol giysiler giyin", ru: "Носите светлую свободную одежду" },
        { en: "Use umbrella for shade during rituals", ar: "استخدم مظلة للظل أثناء المناسك", ur: "رسومات کے دوران سایہ کے لیے چھتری استعمال کریں", hi: "अनुष्ठानों के दौरान छाया के लिए छाता उपयोग करें", tr: "Ritüeller sırasında gölge için şemsiye kullanın", ru: "Используйте зонт для тени во время ритуалов" },
        { en: "Recognize heat exhaustion signs: dizziness, nausea, headache", ar: "تعرف على علامات الإنهاك الحراري", ur: "گرمی کی تھکاوٹ کی علامات پہچانیں", hi: "गर्मी की थकान के लक्षण पहचानें", tr: "Sıcak çarpması belirtilerini tanıyın", ru: "Распознавайте признаки теплового истощения" },
      ],
    },
    {
      icon: Droplets,
      title: { en: "Hydration", ar: "الترطيب", ur: "پانی کی کمی", hi: "हाइड्रेशन", tr: "Hidrasyon", ru: "Гидратация" },
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      tips: [
        { en: "Drink at least 3-4 liters of water daily", ar: "اشرب 3-4 لترات من الماء يومياً", ur: "روزانہ کم از کم 3-4 لیٹر پانی پئیں", hi: "रोजाना कम से कम 3-4 लीटर पानी पिएं", tr: "Günde en az 3-4 litre su için", ru: "Пейте не менее 3-4 литров воды в день" },
        { en: "Carry a water bottle at all times", ar: "احمل زجاجة ماء دائماً", ur: "ہر وقت پانی کی بوتل ساتھ رکھیں", hi: "हर समय पानी की बोतल रखें", tr: "Her zaman su şişesi taşıyın", ru: "Всегда носите бутылку воды" },
        { en: "Use oral rehydration salts if needed", ar: "استخدم أملاح الإماهة الفموية عند الحاجة", ur: "ضرورت پر ORS استعمال کریں", hi: "जरूरत पर ORS का उपयोग करें", tr: "Gerekirse oral rehidrasyon tuzları kullanın", ru: "При необходимости используйте соли для регидратации" },
        { en: "Avoid caffeinated drinks which cause dehydration", ar: "تجنب المشروبات التي تحتوي على الكافيين", ur: "کیفین والے مشروبات سے پرہیز کریں", hi: "कैफीन युक्त पेय से बचें", tr: "Dehidratasyona neden olan kafeinli içeceklerden kaçının", ru: "Избегайте кофеиносодержащих напитков" },
      ],
    },
    {
      icon: Pill,
      title: { en: "Medications", ar: "الأدوية", ur: "ادویات", hi: "दवाइयाँ", tr: "İlaçlar", ru: "Лекарства" },
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      tips: [
        { en: "Bring enough medication for entire trip plus extra", ar: "احضر أدوية كافية للرحلة بأكملها مع إضافي", ur: "پوری سفر کے لیے کافی دوائیں لائیں", hi: "पूरी यात्रा के लिए पर्याप्त दवाएं लाएं", tr: "Tüm yolculuk için yeterli ilaç getirin", ru: "Возьмите достаточно лекарств на всю поездку" },
        { en: "Keep medications in original containers with labels", ar: "احفظ الأدوية في عبواتها الأصلية", ur: "دوائیں اصل کنٹینرز میں رکھیں", hi: "दवाइयां मूल कंटेनरों में रखें", tr: "İlaçları etiketli orijinal ambalajlarında saklayın", ru: "Храните лекарства в оригинальных упаковках" },
        { en: "Carry prescription copies", ar: "احمل نسخ الوصفات الطبية", ur: "نسخوں کی کاپیاں رکھیں", hi: "पर्चे की प्रतियां रखें", tr: "Reçete kopyalarını taşıyın", ru: "Носите копии рецептов" },
        { en: "Know common pain relievers available locally", ar: "تعرف على مسكنات الألم المتاحة محلياً", ur: "مقامی طور پر دستیاب درد کش ادویات جانیں", hi: "स्थानीय रूप से उपलब्ध दर्द निवारक जानें", tr: "Yerel olarak bulunan ağrı kesicileri bilin", ru: "Знайте местные обезболивающие" },
      ],
    },
    {
      icon: Sun,
      title: { en: "Skin Protection", ar: "حماية الجلد", ur: "جلد کی حفاظت", hi: "त्वचा की सुरक्षा", tr: "Cilt Koruması", ru: "Защита кожи" },
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      tips: [
        { en: "Apply SPF 50+ sunscreen regularly (unscented during Ihram)", ar: "ضع واقي الشمس SPF 50+ بانتظام", ur: "باقاعدگی سے SPF 50+ سن سکرین لگائیں", hi: "नियमित रूप से SPF 50+ सनस्क्रीन लगाएं", tr: "Düzenli olarak SPF 50+ güneş kremi uygulayın", ru: "Регулярно наносите солнцезащитный крем SPF 50+" },
        { en: "Wear a hat or use umbrella", ar: "ارتدِ قبعة أو استخدم مظلة", ur: "ٹوپی پہنیں یا چھتری استعمال کریں", hi: "टोपी पहनें या छाता उपयोग करें", tr: "Şapka takın veya şemsiye kullanın", ru: "Носите головной убор или используйте зонт" },
        { en: "Moisturize skin to prevent cracking", ar: "رطب البشرة لمنع التشقق", ur: "جلد کی پھٹن روکنے کے لیے موئسچرائز کریں", hi: "त्वचा को फटने से बचाने के लिए मॉइस्चराइज करें", tr: "Cildin çatlamasını önlemek için nemlendirin", ru: "Увлажняйте кожу для предотвращения трещин" },
      ],
    },
    {
      icon: AlertTriangle,
      title: { en: "When to Seek Help", ar: "متى تطلب المساعدة", ur: "مدد کب لینی چاہیے", hi: "मदद कब लें", tr: "Ne Zaman Yardım İstenmeli", ru: "Когда обращаться за помощью" },
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      tips: [
        { en: "Severe chest pain or difficulty breathing", ar: "ألم شديد في الصدر أو صعوبة في التنفس", ur: "شدید سینے میں درد یا سانس لینے میں دشواری", hi: "गंभीर सीने में दर्द या सांस लेने में कठिनाई", tr: "Şiddetli göğüs ağrısı veya nefes almada zorluk", ru: "Сильная боль в груди или затрудненное дыхание" },
        { en: "High fever that doesn't respond to medication", ar: "حمى شديدة لا تستجيب للأدوية", ur: "تیز بخار جو دوا سے کم نہ ہو", hi: "तेज बुखार जो दवा से कम न हो", tr: "İlaca yanıt vermeyen yüksek ateş", ru: "Высокая температура, не снижающаяся лекарствами" },
        { en: "Signs of severe dehydration", ar: "علامات الجفاف الشديد", ur: "شدید پانی کی کمی کی علامات", hi: "गंभीर निर्जलीकरण के लक्षण", tr: "Şiddetli dehidrasyon belirtileri", ru: "Признаки сильного обезвоживания" },
        { en: "Loss of consciousness or confusion", ar: "فقدان الوعي أو الارتباك", ur: "ہوش کھونا یا الجھن", hi: "बेहोशी या भ्रम", tr: "Bilinç kaybı veya kafa karışıklığı", ru: "Потеря сознания или спутанность" },
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/10 flex items-center justify-center shadow-soft border-2 border-red-500/20">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
              <p className="text-sm text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {healthTopics.map((topic, idx) => (
            <Card key={idx} className="border-2">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${topic.bgColor} flex items-center justify-center shadow-soft border-2 ${topic.color.replace('text-', 'border-')}/20`}>
                      <topic.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${topic.color}`} />
                    </div>
                    <h2 className="text-lg font-semibold">{topic.title[language] || topic.title.en}</h2>
                  </div>
                  <TextToSpeechButton
                    text={`${topic.title[language] || topic.title.en}. ${topic.tips.map(tip => tip[language] || tip.en).join('. ')}`}
                    size="icon"
                    variant="ghost"
                    showLabel={false}
                  />
                </div>
                <ul className="space-y-2.5">
                  {topic.tips.map((tip, tipIdx) => (
                    <li key={tipIdx} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${topic.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                      <span className="text-sm text-muted-foreground">{tip[language] || tip.en}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Medical Staff Section */}
        <MedicalStaffSection />
      </div>
    </MainLayout>
  );
};

export default HealthGuidePage;
