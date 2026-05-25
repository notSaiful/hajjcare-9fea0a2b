import { MainLayout } from "@/components/MainLayout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Ambulance, Shield, Building, Plane, HeartPulse, Car } from "lucide-react";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import { PageHeader } from "@/components/PageHeader";
import { IconCircle } from "@/components/IconCircle";

const ContactNumbersPage = () => {
  const { language } = useLanguage();

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
      variant: "red" as const,
      description: { en: "Police, Ambulance, Fire", ar: "الشرطة، الإسعاف، الإطفاء", ur: "پولیس، ایمبولینس، فائر", hi: "पुलिस, एम्बुलेंस, फायर", tr: "Polis, Ambulans, İtfaiye", ru: "Полиция, скорая, пожарные" },
    },
    {
      icon: Ambulance,
      title: { en: "Red Crescent (Ambulance)", ar: "الهلال الأحمر (الإسعاف)", ur: "ریڈ کریسنٹ (ایمبولینس)", hi: "रेड क्रीसेंट (एम्बुलेंस)", tr: "Kızılhaç (Ambulans)", ru: "Красный Полумесяц (Скорая)" },
      number: "997",
      variant: "rose" as const,
      description: { en: "Medical emergencies", ar: "حالات الطوارئ الطبية", ur: "طبی ایمرجنسی", hi: "चिकित्सा आपात स्थिति", tr: "Tıbbi acil durumlar", ru: "Медицинские экстренные случаи" },
    },
    {
      icon: Shield,
      title: { en: "Police", ar: "الشرطة", ur: "پولیس", hi: "पुलिस", tr: "Polis", ru: "Полиция" },
      number: "999",
      variant: "sky" as const,
      description: { en: "Security and crime reports", ar: "الأمن وتقارير الجرائم", ur: "سیکورٹی اور جرائم کی رپورٹس", hi: "सुरक्षा और अपराध रिपोर्ट", tr: "Güvenlik ve suç raporları", ru: "Безопасность и сообщения о преступлениях" },
    },
    {
      icon: Car,
      title: { en: "Traffic Accidents", ar: "الحوادث المرورية", ur: "ٹریفک حادثات", hi: "यातायात दुर्घटनाएं", tr: "Trafik Kazaları", ru: "ДТП" },
      number: "993",
      variant: "orange" as const,
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
      <SEO title="Emergency Contact Numbers" description="Essential emergency and helpline numbers for Hajj pilgrims in Saudi Arabia and India." path="/contacts" type="website" jsonLd={{"@context":"https://schema.org","@type":"WebPage","headline":"Emergency Contact Numbers","description":"Essential emergency and helpline numbers for Hajj pilgrims in Saudi Arabia and India.","url":"https://hajjcare.in/contacts"}} />
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Consistent Page Header */}
        <PageHeader
          title={labels.title}
          subtitle={labels.subtitle}
          icon={Phone}
          iconVariant="teal"
        />

        {/* Emergency Numbers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-destructive">
              {language === "ar" ? "أرقام الطوارئ" : language === "ur" ? "ایمرجنسی نمبرز" : language === "hi" ? "आपातकालीन नंबर" : language === "tr" ? "Acil Numaralar" : language === "ru" ? "Экстренные номера" : "Emergency Numbers"}
            </h2>
            <TextToSpeechButton
              text={emergencyNumbers.map(item => `${item.title[language] || item.title.en}: ${item.number}. ${item.description[language] || item.description.en}`).join('. ')}
              size="icon"
              variant="ghost"
              showLabel={false}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {emergencyNumbers.map((item, idx) => (
              <a key={idx} href={`tel:${item.number}`} className="block">
                <Card className="border-2 shadow-sm hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-4 text-center">
                    <IconCircle icon={item.icon} variant={item.variant} size="md" className="mx-auto mb-3" />
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">
              {language === "ar" ? "خدمات الحج" : language === "ur" ? "حج خدمات" : language === "hi" ? "हज सेवाएं" : language === "tr" ? "Hac Hizmetleri" : language === "ru" ? "Услуги хаджа" : "Hajj Services"}
            </h2>
            <TextToSpeechButton
              text={hajjServices.map(item => `${item.title[language] || item.title.en}: ${item.number}. ${item.description[language] || item.description.en}`).join('. ')}
              size="icon"
              variant="ghost"
              showLabel={false}
            />
          </div>
          <div className="space-y-2">
            {hajjServices.map((item, idx) => (
              <a key={idx} href={`tel:${item.number}`} className="block">
                <Card className="border-2 shadow-sm hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <IconCircle icon={item.icon} variant="teal" size="sm" />
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {language === "ar" ? "السفارات في الرياض" : language === "ur" ? "ریاض میں سفارت خانے" : language === "hi" ? "रियाद में दूतावास" : language === "tr" ? "Riyad'daki Elçilikler" : language === "ru" ? "Посольства в Эр-Рияде" : "Embassies in Riyadh"}
            </h2>
            <TextToSpeechButton
              text={embassies.map(embassy => `${embassy.country[language] || embassy.country.en}: ${embassy.number}`).join('. ')}
              size="icon"
              variant="ghost"
              showLabel={false}
            />
          </div>
          <Card className="border-2 shadow-sm">
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
