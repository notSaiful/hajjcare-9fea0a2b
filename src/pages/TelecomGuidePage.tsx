import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Smartphone, Wifi, Signal, Globe, MessageSquare } from "lucide-react";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";

const TelecomGuidePage = () => {
  const { language, isRTL } = useLanguage();

  const labels = {
    title: { en: "Telecom Guide", ar: "دليل الاتصالات", ur: "ٹیلی کام گائیڈ", hi: "टेलीकॉम गाइड", ta: "டெலிகாம் வழிகாட்டி", te: "టెలికాం గైడ్", mr: "टेलिकॉम मार्गदर्शक", bn: "টেলিকম গাইড", or: "ଟେଲିକମ ଗାଇଡ୍", ml: "ടെലികോം ഗൈഡ്", pa: "ਟੈਲੀਕਾਮ ਗਾਈਡ" },
    subtitle: { en: "Stay connected during your journey", ar: "ابقَ على اتصال خلال رحلتك", ur: "اپنے سفر کے دوران رابطے میں رہیں", hi: "अपनी यात्रा के दौरान जुड़े रहें", ta: "உங்கள் பயணத்தின் போது இணைந்திருங்கள்", te: "మీ ప్రయాణంలో కనెక్ట్ అయి ఉండండి", mr: "तुमच्या प्रवासात जोडलेले राहा", bn: "আপনার যাত্রায় সংযুক্ত থাকুন", or: "ଆପଣଙ୍କ ଯାତ୍ରାରେ ସଂଯୁକ୍ତ ରୁହନ୍ତୁ", ml: "നിങ്ങളുടെ യാത്രയിൽ കണക്ട് ആയിരിക്കുക", pa: "ਆਪਣੀ ਯਾਤਰਾ ਦੌਰਾਨ ਜੁੜੇ ਰਹੋ" },
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", ta: "பின்", te: "వెనుకకు", mr: "मागे", bn: "পিছনে", or: "ପଛକୁ", ml: "പിന്നിലേക്ക്", pa: "ਵਾਪਸ" },
  };

  const sections = [
    {
      icon: Signal,
      title: { en: "Saudi Mobile Operators", ar: "شركات الاتصالات السعودية", ur: "سعودی موبائل آپریٹرز", hi: "सऊदी मोबाइल ऑपरेटर", tr: "Suudi Mobil Operatörler", ru: "Саудовские мобильные операторы" },
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      items: [
        { en: "STC (Saudi Telecom Company) - Largest network coverage", ar: "STC - أكبر تغطية شبكة", ur: "STC - سب سے بڑی نیٹ ورک کوریج", hi: "STC - सबसे बड़ी नेटवर्क कवरेज", tr: "STC - En geniş ağ kapsama", ru: "STC - Крупнейшее сетевое покрытие" },
        { en: "Mobily - Good coverage and competitive prices", ar: "موبايلي - تغطية جيدة وأسعار تنافسية", ur: "موبائلی - اچھی کوریج اور مسابقتی قیمتیں", hi: "मोबाइली - अच्छी कवरेज और प्रतिस्पर्धी कीमतें", tr: "Mobily - İyi kapsama ve rekabetçi fiyatlar", ru: "Mobily - Хорошее покрытие и конкурентные цены" },
        { en: "Zain - Reliable service with good data plans", ar: "زين - خدمة موثوقة مع خطط بيانات جيدة", ur: "زین - اچھے ڈیٹا پلانز کے ساتھ قابل اعتماد سروس", hi: "ज़ैन - अच्छे डेटा प्लान के साथ विश्वसनीय सेवा", tr: "Zain - İyi veri planlarıyla güvenilir hizmet", ru: "Zain - Надежный сервис с хорошими тарифами" },
      ],
    },
    {
      icon: Smartphone,
      title: { en: "Getting a SIM Card", ar: "الحصول على شريحة SIM", ur: "سم کارڈ حاصل کرنا", hi: "सिम कार्ड प्राप्त करना", tr: "SIM Kart Almak", ru: "Получение SIM-карты" },
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      items: [
        { en: "Available at airports, malls, and telecom stores", ar: "متوفرة في المطارات والمولات ومتاجر الاتصالات", ur: "ایئرپورٹس، مالز اور ٹیلی کام اسٹورز پر دستیاب", hi: "एयरपोर्ट, मॉल और टेलीकॉम स्टोर पर उपलब्ध", tr: "Havalimanları, AVM'ler ve telekom mağazalarında mevcut", ru: "Доступны в аэропортах, торговых центрах и салонах связи" },
        { en: "Passport required for registration", ar: "جواز السفر مطلوب للتسجيل", ur: "رجسٹریشن کے لیے پاسپورٹ درکار", hi: "पंजीकरण के लिए पासपोर्ट आवश्यक", tr: "Kayıt için pasaport gerekli", ru: "Для регистрации требуется паспорт" },
        { en: "Hajj/Umrah visa SIMs available with special packages", ar: "شرائح الحج/العمرة متوفرة مع باقات خاصة", ur: "حج/عمرہ ویزا سمز خاص پیکجز کے ساتھ دستیاب", hi: "हज/उमरा वीजा सिम विशेष पैकेज के साथ उपलब्ध", tr: "Hac/Umre vizeli SIM'ler özel paketlerle mevcut", ru: "SIM-карты для хаджа/умры со специальными пакетами" },
        { en: "Prices: 50-150 SAR including data package", ar: "الأسعار: 50-150 ريال شاملة باقة البيانات", ur: "قیمتیں: 50-150 ریال ڈیٹا پیکج سمیت", hi: "कीमतें: 50-150 रियाल डेटा पैकेज सहित", tr: "Fiyatlar: Veri paketi dahil 50-150 SAR", ru: "Цены: 50-150 SAR включая пакет данных" },
      ],
    },
    {
      icon: Wifi,
      title: { en: "Wi-Fi Availability", ar: "توفر الواي فاي", ur: "وائی فائی کی دستیابی", hi: "वाई-फाई उपलब्धता", tr: "Wi-Fi Erişilebilirliği", ru: "Доступность Wi-Fi" },
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      items: [
        { en: "Free Wi-Fi at Masjid al-Haram and Masjid an-Nabawi", ar: "واي فاي مجاني في المسجد الحرام والمسجد النبوي", ur: "مسجد الحرام اور مسجد نبوی میں مفت وائی فائی", hi: "मस्जिद अल-हराम और मस्जिद अन-नबवी में मुफ्त वाई-फाई", tr: "Mescid-i Haram ve Mescid-i Nebevi'de ücretsiz Wi-Fi", ru: "Бесплатный Wi-Fi в Масджид аль-Харам и Масджид ан-Набави" },
        { en: "Most hotels offer free Wi-Fi", ar: "معظم الفنادق توفر واي فاي مجاني", ur: "زیادہ تر ہوٹلز مفت وائی فائی پیش کرتے ہیں", hi: "अधिकांश होटल मुफ्त वाई-फाई देते हैं", tr: "Çoğu otel ücretsiz Wi-Fi sunar", ru: "Большинство отелей предлагают бесплатный Wi-Fi" },
        { en: "Shopping malls and restaurants have Wi-Fi", ar: "المولات والمطاعم لديها واي فاي", ur: "شاپنگ مالز اور ریستوران میں وائی فائی ہے", hi: "शॉपिंग मॉल और रेस्तरां में वाई-फाई है", tr: "AVM'ler ve restoranlar Wi-Fi'ye sahip", ru: "В торговых центрах и ресторанах есть Wi-Fi" },
        { en: "Download offline maps before going to crowded areas", ar: "حمّل الخرائط غير المتصلة قبل الذهاب للأماكن المزدحمة", ur: "ہجوم والے علاقوں میں جانے سے پہلے آف لائن نقشے ڈاؤن لوڈ کریں", hi: "भीड़ वाले क्षेत्रों में जाने से पहले ऑफलाइन मानचित्र डाउनलोड करें", tr: "Kalabalık alanlara gitmeden önce çevrimdışı haritalar indirin", ru: "Скачайте офлайн-карты перед посещением многолюдных мест" },
      ],
    },
    {
      icon: Globe,
      title: { en: "International Roaming", ar: "التجوال الدولي", ur: "بین الاقوامی رومنگ", hi: "अंतर्राष्ट्रीय रोमिंग", tr: "Uluslararası Dolaşım", ru: "Международный роуминг" },
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      items: [
        { en: "Check with your home operator for roaming rates", ar: "تحقق من مشغلك المحلي لأسعار التجوال", ur: "رومنگ ریٹس کے لیے اپنے ہوم آپریٹر سے چیک کریں", hi: "रोमिंग दरों के लिए अपने होम ऑपरेटर से जांचें", tr: "Dolaşım ücretleri için ev operatörünüzle görüşün", ru: "Уточните у своего оператора тарифы на роуминг" },
        { en: "International roaming can be expensive", ar: "التجوال الدولي قد يكون مكلفاً", ur: "بین الاقوامی رومنگ مہنگی ہو سکتی ہے", hi: "अंतर्राष्ट्रीय रोमिंग महंगी हो सकती है", tr: "Uluslararası dolaşım pahalı olabilir", ru: "Международный роуминг может быть дорогим" },
        { en: "Consider buying local SIM for cost savings", ar: "فكر في شراء شريحة محلية لتوفير التكاليف", ur: "لاگت بچانے کے لیے مقامی سم خریدنے پر غور کریں", hi: "लागत बचत के लिए स्थानीय सिम खरीदने पर विचार करें", tr: "Maliyet tasarrufu için yerel SIM almayı düşünün", ru: "Рассмотрите покупку местной SIM для экономии" },
        { en: "eSIM options available for compatible phones", ar: "خيارات eSIM متاحة للهواتف المتوافقة", ur: "مطابق فونز کے لیے eSIM آپشنز دستیاب", hi: "संगत फोन के लिए eSIM विकल्प उपलब्ध", tr: "Uyumlu telefonlar için eSIM seçenekleri mevcut", ru: "Доступны eSIM для совместимых телефонов" },
      ],
    },
    {
      icon: MessageSquare,
      title: { en: "Useful Apps", ar: "تطبيقات مفيدة", ur: "مفید ایپس", hi: "उपयोगी ऐप्स", tr: "Faydalı Uygulamalar", ru: "Полезные приложения" },
      color: "text-teal-600",
      bgColor: "bg-teal-500/10",
      items: [
        { en: "WhatsApp - Free messaging and calls over Wi-Fi/data", ar: "واتساب - رسائل ومكالمات مجانية", ur: "واٹس ایپ - مفت پیغامات اور کالز", hi: "व्हाट्सएप - मुफ्त मैसेजिंग और कॉल", tr: "WhatsApp - Ücretsiz mesajlaşma ve aramalar", ru: "WhatsApp - Бесплатные сообщения и звонки" },
        { en: "Tawakkalna - Required app for some services", ar: "توكلنا - تطبيق مطلوب لبعض الخدمات", ur: "توکلنا - کچھ خدمات کے لیے درکار ایپ", hi: "तवक्कलना - कुछ सेवाओं के लिए आवश्यक ऐप", tr: "Tawakkalna - Bazı hizmetler için gerekli uygulama", ru: "Tawakkalna - Требуется для некоторых услуг" },
        { en: "Google Maps - Download offline maps of Makkah & Madinah", ar: "خرائط جوجل - حمل خرائط مكة والمدينة", ur: "گوگل میپس - مکہ اور مدینہ کے آف لائن نقشے ڈاؤن لوڈ کریں", hi: "गूगल मैप्स - मक्का और मदीना के ऑफलाइन मानचित्र डाउनलोड करें", tr: "Google Maps - Mekke ve Medine'nin çevrimdışı haritalarını indirin", ru: "Google Maps - Скачайте офлайн-карты Мекки и Медины" },
        { en: "Muslim Pro - Prayer times and Qibla direction", ar: "مسلم برو - أوقات الصلاة واتجاه القبلة", ur: "مسلم پرو - نماز کے اوقات اور قبلہ کی سمت", hi: "मुस्लिम प्रो - नमाज़ के समय और क़िबला दिशा", tr: "Muslim Pro - Namaz vakitleri ve kıble yönü", ru: "Muslim Pro - Время молитв и направление киблы" },
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-500/10 flex items-center justify-center shadow-soft border-2 border-blue-500/20">
              <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
              <p className="text-sm text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
            </div>
          </div>
        </div>

        {/* SIM Card Guide Image */}
        <Card className="border-2 overflow-hidden">
          <CardContent className="p-0">
            <img 
              src="/images/sim-card-guide.jpeg" 
              alt={language === "ar" ? "دليل بطاقة SIM للحج" : "SIM Card Guide for Hajj"} 
              className="w-full h-auto"
            />
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

export default TelecomGuidePage;
