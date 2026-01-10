import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Phone, Ambulance, Shield, Building, Plane, HeartPulse, Car } from "lucide-react";

const ContactNumbersPage = () => {
  const { language, isRTL } = useLanguage();

  const labels = {
    title: {
      en: "Important Contact Numbers",
      ar: "أرقام الاتصال المهمة",
      ur: "اہم رابطہ نمبر",
      hi: "महत्वपूर्ण संपर्क नंबर",
      tr: "Önemli İletişim Numaraları",
      ru: "Важные контактные номера",
    },
    subtitle: {
      en: "Emergency and essential services in Saudi Arabia",
      ar: "خدمات الطوارئ والخدمات الأساسية في السعودية",
      ur: "سعودی عرب میں ایمرجنسی اور ضروری خدمات",
      hi: "सऊदी अरब में आपातकालीन और आवश्यक सेवाएं",
      tr: "Suudi Arabistan'da acil ve temel hizmetler",
      ru: "Экстренные и основные службы в Саудовской Аравии",
    },
    back: {
      en: "Back",
      ar: "رجوع",
      ur: "واپس",
      hi: "वापस",
      tr: "Geri",
      ru: "Назад",
    },
    tapToCall: {
      en: "Tap to call",
      ar: "اضغط للاتصال",
      ur: "کال کرنے کے لیے ٹیپ کریں",
      hi: "कॉल करने के लिए टैप करें",
      tr: "Aramak için dokunun",
      ru: "Нажмите, чтобы позвонить",
    },
  };

  const emergencyNumbers = [
    {
      icon: Phone,
      title: { en: "Unified Emergency Number", ar: "رقم الطوارئ الموحد", ur: "یونیفائیڈ ایمرجنسی نمبر", hi: "एकीकृत आपातकालीन नंबर", tr: "Birleşik Acil Durum Numarası", ru: "Единый номер экстренной помощи" },
      number: "911",
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      description: { en: "Police, Ambulance, Fire", ar: "الشرطة، الإسعاف، الإطفاء", ur: "پولیس، ایمبولینس، فائر", hi: "पुलिस, एम्बुलेंस, फायर", tr: "Polis, Ambulans, İtfaiye", ru: "Полиция, скорая, пожарные" },
    },
    {
      icon: Ambulance,
      title: { en: "Red Crescent (Ambulance)", ar: "الهلال الأحمر (الإسعاف)", ur: "ریڈ کریسنٹ (ایمبولینس)", hi: "रेड क्रीसेंट (एम्बुलेंस)", tr: "Kızılhaç (Ambulans)", ru: "Красный Полумесяц (Скорая)" },
      number: "997",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      description: { en: "Medical emergencies", ar: "حالات الطوارئ الطبية", ur: "طبی ایمرجنسی", hi: "चिकित्सा आपात स्थिति", tr: "Tıbbi acil durumlar", ru: "Медицинские экстренные случаи" },
    },
    {
      icon: Shield,
      title: { en: "Police", ar: "الشرطة", ur: "پولیس", hi: "पुलिस", tr: "Polis", ru: "Полиция" },
      number: "999",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      description: { en: "Security and crime reports", ar: "الأمن وتقارير الجرائم", ur: "سیکورٹی اور جرائم کی رپورٹس", hi: "सुरक्षा और अपराध रिपोर्ट", tr: "Güvenlik ve suç raporları", ru: "Безопасность и сообщения о преступлениях" },
    },
    {
      icon: Car,
      title: { en: "Traffic Accidents", ar: "الحوادث المرورية", ur: "ٹریفک حادثات", hi: "यातायात दुर्घटनाएं", tr: "Trafik Kazaları", ru: "ДТП" },
      number: "993",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      description: { en: "Road accidents and traffic", ar: "حوادث الطرق والمرور", ur: "سڑک حادثات اور ٹریفک", hi: "सड़क दुर्घटनाएं और यातायात", tr: "Yol kazaları ve trafik", ru: "Дорожные аварии и движение" },
    },
  ];

  const hajjServices = [
    {
      icon: Building,
      title: { en: "Ministry of Hajj & Umrah", ar: "وزارة الحج والعمرة", ur: "وزارت حج و عمرہ", hi: "हज और उमरा मंत्रालय", tr: "Hac ve Umre Bakanlığı", ru: "Министерство хаджа и умры" },
      number: "920002814",
      description: { en: "Hajj services and complaints", ar: "خدمات الحج والشكاوى", ur: "حج خدمات اور شکایات", hi: "हज सेवाएं और शिकायतें", tr: "Hac hizmetleri ve şikayetler", ru: "Услуги хаджа и жалобы" },
    },
    {
      icon: HeartPulse,
      title: { en: "Ministry of Health", ar: "وزارة الصحة", ur: "وزارت صحت", hi: "स्वास्थ्य मंत्रालय", tr: "Sağlık Bakanlığı", ru: "Министерство здравоохранения" },
      number: "937",
      description: { en: "Health inquiries and services", ar: "استفسارات وخدمات صحية", ur: "صحت سے متعلق پوچھ گچھ اور خدمات", hi: "स्वास्थ्य पूछताछ और सेवाएं", tr: "Sağlık soruları ve hizmetler", ru: "Медицинские вопросы и услуги" },
    },
    {
      icon: Plane,
      title: { en: "Saudi Airlines", ar: "الخطوط السعودية", ur: "سعودی ایئر لائنز", hi: "सऊदी एयरलाइंस", tr: "Suudi Havayolları", ru: "Saudi Airlines" },
      number: "920022222",
      description: { en: "Flight bookings and inquiries", ar: "حجوزات واستفسارات الرحلات", ur: "فلائٹ بکنگ اور پوچھ گچھ", hi: "उड़ान बुकिंग और पूछताछ", tr: "Uçuş rezervasyonları ve sorular", ru: "Бронирование и вопросы по рейсам" },
    },
  ];

  const embassies = [
    { country: { en: "India", ar: "الهند", ur: "بھارت", hi: "भारत", tr: "Hindistan", ru: "Индия" }, number: "+966-11-4884144" },
    { country: { en: "Pakistan", ar: "باكستان", ur: "پاکستان", hi: "पाकिस्तान", tr: "Pakistan", ru: "Пакистан" }, number: "+966-11-4544434" },
    { country: { en: "Bangladesh", ar: "بنغلاديش", ur: "بنگلہ دیش", hi: "बांग्लादेश", tr: "Bangladeş", ru: "Бангладеш" }, number: "+966-11-4194500" },
    { country: { en: "Indonesia", ar: "إندونيسيا", ur: "انڈونیشیا", hi: "इंडोनेशिया", tr: "Endonezya", ru: "Индонезия" }, number: "+966-11-4882800" },
    { country: { en: "Malaysia", ar: "ماليزيا", ur: "ملائیشیا", hi: "मलेशिया", tr: "Malezya", ru: "Малайзия" }, number: "+966-11-4887100" },
    { country: { en: "Turkey", ar: "تركيا", ur: "ترکی", hi: "तुर्की", tr: "Türkiye", ru: "Турция" }, number: "+966-11-4889100" },
    { country: { en: "Egypt", ar: "مصر", ur: "مصر", hi: "मिस्र", tr: "Mısır", ru: "Египет" }, number: "+966-11-4644049" },
    { country: { en: "United Kingdom", ar: "المملكة المتحدة", ur: "برطانیہ", hi: "यूनाइटेड किंगडम", tr: "Birleşik Krallık", ru: "Великобритания" }, number: "+966-11-4819100" },
    { country: { en: "United States", ar: "الولايات المتحدة", ur: "امریکہ", hi: "संयुक्त राज्य अमेरिका", tr: "Amerika Birleşik Devletleri", ru: "США" }, number: "+966-11-4883800" },
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-soft border-2 border-primary/20">
              <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
              <p className="text-sm text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
            </div>
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-red-600">
            {language === "ar" ? "أرقام الطوارئ" : language === "ur" ? "ایمرجنسی نمبرز" : language === "hi" ? "आपातकालीन नंबर" : language === "tr" ? "Acil Numaralar" : language === "ru" ? "Экстренные номера" : "Emergency Numbers"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {emergencyNumbers.map((item, idx) => (
              <a key={idx} href={`tel:${item.number}`} className="block">
                <Card className="border-2 hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-4 text-center">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-3 shadow-soft border-2 ${item.color.replace('text-', 'border-')}/20`}>
                      <item.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${item.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-primary mb-1">{item.number}</p>
                    <p className="text-sm font-medium">{item.title[language] || item.title.en}</p>
                    <p className="text-xs text-muted-foreground">{item.description[language] || item.description.en}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Hajj Services */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">
            {language === "ar" ? "خدمات الحج" : language === "ur" ? "حج خدمات" : language === "hi" ? "हज सेवाएं" : language === "tr" ? "Hac Hizmetleri" : language === "ru" ? "Услуги хаджа" : "Hajj Services"}
          </h2>
          <div className="space-y-2">
            {hajjServices.map((item, idx) => (
              <a key={idx} href={`tel:${item.number}`} className="block">
                <Card className="border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-soft border-2 border-primary/20">
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.title[language] || item.title.en}</p>
                      <p className="text-xs text-muted-foreground">{item.description[language] || item.description.en}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{item.number}</p>
                      <p className="text-xs text-muted-foreground">{labels.tapToCall[language] || labels.tapToCall.en}</p>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Embassies */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            {language === "ar" ? "السفارات في الرياض" : language === "ur" ? "ریاض میں سفارت خانے" : language === "hi" ? "रियाद में दूतावास" : language === "tr" ? "Riyad'daki Elçilikler" : language === "ru" ? "Посольства в Эр-Рияде" : "Embassies in Riyadh"}
          </h2>
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="space-y-3">
                {embassies.map((embassy, idx) => (
                  <a
                    key={idx}
                    href={`tel:${embassy.number}`}
                    className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded transition-colors"
                  >
                    <span className="font-medium">{embassy.country[language] || embassy.country.en}</span>
                    <span className="text-primary font-mono text-sm">{embassy.number}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactNumbersPage;
