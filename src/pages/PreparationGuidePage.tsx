import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, Briefcase, FileText, Stethoscope, Plane } from "lucide-react";

const PreparationGuidePage = () => {
  const { language, isRTL } = useLanguage();

  const labels = {
    title: {
      en: "Preparation Guide",
      ar: "دليل التحضير",
      ur: "تیاری گائیڈ",
      hi: "तैयारी गाइड",
      ta: "தயாரிப்பு வழிகாட்டி",
      te: "తయారీ గైడ్",
      mr: "तयारी मार्गदर्शक",
      bn: "প্রস্তুতি গাইড",
      or: "ପ୍ରସ୍ତୁତି ଗାଇଡ୍",
      ml: "തയ്യാറെടുപ്പ് ഗൈഡ്",
      pa: "ਤਿਆਰੀ ਗਾਈਡ",
    },
    subtitle: {
      en: "Essential checklist before your journey",
      ar: "قائمة التحقق الأساسية قبل رحلتك",
      ur: "سفر سے پہلے ضروری چیک لسٹ",
      hi: "यात्रा से पहले आवश्यक चेकलिस्ट",
      ta: "உங்கள் பயணத்திற்கு முன் அத்தியாவசிய சரிபார்ப்பு பட்டியல்",
      te: "మీ ప్రయాణానికి ముందు అవసరమైన చెక్‌లిస్ట్",
      mr: "आपल्या प्रवासापूर्वी आवश्यक चेकलिस्ट",
      bn: "আপনার যাত্রার আগে প্রয়োজনীয় চেকলিস্ট",
      or: "ଆପଣଙ୍କ ଯାତ୍ରା ପୂର୍ବରୁ ଆବଶ୍ୟକ ଚେକ୍‌ଲିଷ୍ଟ",
      ml: "നിങ്ങളുടെ യാത്രയ്ക്ക് മുമ്പ് അത്യാവശ്യ ചെക്ക്‌ലിസ്റ്റ്",
      pa: "ਤੁਹਾਡੀ ਯਾਤਰਾ ਤੋਂ ਪਹਿਲਾਂ ਜ਼ਰੂਰੀ ਚੈਕਲਿਸਟ",
    },
    back: {
      en: "Back",
      ar: "رجوع",
      ur: "واپس",
      hi: "वापस",
      ta: "பின்செல்",
      te: "వెనక్కు",
      mr: "मागे",
      bn: "ফিরে যান",
      or: "ପଛକୁ",
      ml: "തിരികെ",
      pa: "ਪਿੱਛੇ",
    },
  };

  const sections = [
    {
      icon: FileText,
      title: { en: "Documents", ar: "المستندات", ur: "دستاویزات", hi: "दस्तावेज़", tr: "Belgeler", ru: "Документы" },
      items: [
        { en: "Valid passport (6+ months validity)", ar: "جواز سفر ساري المفعول (صلاحية 6 أشهر+)", ur: "درست پاسپورٹ (6+ ماہ کی میعاد)", hi: "वैध पासपोर्ट (6+ महीने की वैधता)", tr: "Geçerli pasaport (6+ ay geçerlilik)", ru: "Действующий паспорт (6+ месяцев)" },
        { en: "Hajj/Umrah visa", ar: "تأشيرة الحج/العمرة", ur: "حج/عمرہ ویزا", hi: "हज/उमरा वीजा", tr: "Hac/Umre vizesi", ru: "Виза на хадж/умру" },
        { en: "Vaccination certificates", ar: "شهادات التطعيم", ur: "ویکسینیشن سرٹیفکیٹس", hi: "टीकाकरण प्रमाणपत्र", tr: "Aşı sertifikaları", ru: "Сертификаты о вакцинации" },
        { en: "Travel insurance documents", ar: "وثائق تأمين السفر", ur: "ٹریول انشورنس دستاویزات", hi: "यात्रा बीमा दस्तावेज़", tr: "Seyahat sigortası belgeleri", ru: "Документы страхования путешествий" },
        { en: "Hotel booking confirmations", ar: "تأكيدات حجز الفندق", ur: "ہوٹل بکنگ کنفرمیشن", hi: "होटल बुकिंग पुष्टि", tr: "Otel rezervasyon onayları", ru: "Подтверждения бронирования отеля" },
      ],
    },
    {
      icon: Stethoscope,
      title: { en: "Health", ar: "الصحة", ur: "صحت", hi: "स्वास्थ्य", tr: "Sağlık", ru: "Здоровье" },
      items: [
        { en: "Required vaccinations (Meningitis, COVID-19)", ar: "التطعيمات المطلوبة (التهاب السحايا، كوفيد-19)", ur: "ضروری ویکسین (گردن توڑ بخار، کوویڈ-19)", hi: "आवश्यक टीके (मेनिनजाइटिस, COVID-19)", tr: "Gerekli aşılar (Menenjit, COVID-19)", ru: "Обязательные прививки (менингит, COVID-19)" },
        { en: "Personal medications (3-month supply)", ar: "الأدوية الشخصية (مخزون 3 أشهر)", ur: "ذاتی دوائیں (3 ماہ کی سپلائی)", hi: "व्यक्तिगत दवाएं (3 महीने की आपूर्ति)", tr: "Kişisel ilaçlar (3 aylık stok)", ru: "Личные лекарства (запас на 3 месяца)" },
        { en: "First aid kit", ar: "حقيبة الإسعافات الأولية", ur: "فرسٹ ایڈ کٹ", hi: "प्राथमिक चिकित्सा किट", tr: "İlk yardım çantası", ru: "Аптечка первой помощи" },
        { en: "Medical prescription copies", ar: "نسخ الوصفات الطبية", ur: "طبی نسخوں کی کاپیاں", hi: "चिकित्सा पर्चे की प्रतियां", tr: "Tıbbi reçete kopyaları", ru: "Копии медицинских рецептов" },
      ],
    },
    {
      icon: Briefcase,
      title: { en: "Packing Essentials", ar: "أساسيات التعبئة", ur: "سامان کی ضروریات", hi: "पैकिंग आवश्यकताएं", tr: "Paketleme Temelleri", ru: "Основы упаковки" },
      items: [
        { en: "Ihram clothing (2 sets for men)", ar: "ملابس الإحرام (مجموعتان للرجال)", ur: "احرام کے کپڑے (مردوں کے لیے 2 سیٹ)", hi: "इहराम के कपड़े (पुरुषों के लिए 2 सेट)", tr: "İhram kıyafeti (erkekler için 2 takım)", ru: "Одежда ихрама (2 комплекта для мужчин)" },
        { en: "Comfortable walking shoes", ar: "أحذية مريحة للمشي", ur: "آرام دہ چلنے والے جوتے", hi: "आरामदायक चलने के जूते", tr: "Rahat yürüyüş ayakkabısı", ru: "Удобная обувь для ходьбы" },
        { en: "Prayer mat and Quran", ar: "سجادة صلاة ومصحف", ur: "جائے نماز اور قرآن", hi: "प्रार्थना की चटाई और कुरान", tr: "Seccade ve Kur'an", ru: "Молитвенный коврик и Коран" },
        { en: "Unscented toiletries", ar: "أدوات النظافة بدون رائحة", ur: "بغیر خوشبو کے ٹوائلٹریز", hi: "बिना सुगंध वाले टॉयलेटरीज़", tr: "Kokusuz kişisel bakım ürünleri", ru: "Туалетные принадлежности без запаха" },
        { en: "Sunscreen and umbrella", ar: "واقي الشمس ومظلة", ur: "سن سکرین اور چھتری", hi: "सनस्क्रीन और छाता", tr: "Güneş kremi ve şemsiye", ru: "Солнцезащитный крем и зонт" },
      ],
    },
    {
      icon: Plane,
      title: { en: "Travel Tips", ar: "نصائح السفر", ur: "سفری تجاویز", hi: "यात्रा सुझाव", tr: "Seyahat İpuçları", ru: "Советы по путешествию" },
      items: [
        { en: "Arrive 2-3 days before Hajj begins", ar: "الوصول قبل 2-3 أيام من بداية الحج", ur: "حج شروع ہونے سے 2-3 دن پہلے پہنچیں", hi: "हज शुरू होने से 2-3 दिन पहले पहुंचें", tr: "Hac başlamadan 2-3 gün önce varın", ru: "Прибудьте за 2-3 дня до начала хаджа" },
        { en: "Keep copies of all documents", ar: "احتفظ بنسخ من جميع المستندات", ur: "تمام دستاویزات کی کاپیاں رکھیں", hi: "सभी दस्तावेजों की प्रतियां रखें", tr: "Tüm belgelerin kopyalarını saklayın", ru: "Храните копии всех документов" },
        { en: "Share itinerary with family", ar: "شارك خط سير الرحلة مع العائلة", ur: "خاندان کے ساتھ سفر نامہ شیئر کریں", hi: "परिवार के साथ यात्रा कार्यक्रम साझा करें", tr: "Seyahat planını aileyle paylaşın", ru: "Поделитесь маршрутом с семьей" },
        { en: "Download offline maps", ar: "تنزيل الخرائط غير المتصلة", ur: "آف لائن نقشے ڈاؤن لوڈ کریں", hi: "ऑफलाइन मानचित्र डाउनलोड करें", tr: "Çevrimdışı haritaları indirin", ru: "Скачайте офлайн-карты" },
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
          <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-2">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-soft border-2 border-primary/20">
                    <section.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">{section.title[language] || section.title.en}</h2>
                </div>
                <ul className="space-y-2.5">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-status-safe mt-0.5 flex-shrink-0" />
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

export default PreparationGuidePage;
