import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MapPin, Clock, Phone, Utensils, Heart, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import foodGuideImage from "@/assets/food-guide-pilgrims.jpeg";

const FoodGuidePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRtl = language === "ar" || language === "ur";

  const content = {
    en: {
      title: "Food Guide",
      subtitle: "Food options for pilgrims in Saudi Arabia",
      foodGuide: "Popular & Hajj-Friendly Foods",
      freeFoodTitle: "Free Food Centers for Hajis",
      freeFoodSubtitle: "Charitable organizations providing free meals",
      foodStoresTitle: "Food Stores Available",
      foodStoresSubtitle: "Where to buy food during Hajj",
      viewImage: "Tap image to enlarge",
      locations: "Locations",
      timing: "Timing",
      contact: "Contact",
    },
    ar: {
      title: "دليل الطعام",
      subtitle: "خيارات الطعام للحجاج في السعودية",
      foodGuide: "الأطعمة الشائعة والمناسبة للحج",
      freeFoodTitle: "مراكز الطعام المجاني للحجاج",
      freeFoodSubtitle: "منظمات خيرية تقدم وجبات مجانية",
      foodStoresTitle: "متاجر الطعام المتاحة",
      foodStoresSubtitle: "أماكن شراء الطعام خلال الحج",
      viewImage: "اضغط على الصورة للتكبير",
      locations: "المواقع",
      timing: "التوقيت",
      contact: "التواصل",
    },
    ur: {
      title: "کھانے کی گائیڈ",
      subtitle: "سعودی عرب میں حجاج کے لیے کھانے کے اختیارات",
      foodGuide: "مقبول اور حج کے لیے موزوں کھانے",
      freeFoodTitle: "حجاج کے لیے مفت کھانے کے مراکز",
      freeFoodSubtitle: "مفت کھانا فراہم کرنے والی خیراتی تنظیمیں",
      foodStoresTitle: "دستیاب فوڈ اسٹورز",
      foodStoresSubtitle: "حج کے دوران کھانا کہاں سے خریدیں",
      viewImage: "تصویر بڑی کرنے کے لیے ٹیپ کریں",
      locations: "مقامات",
      timing: "اوقات",
      contact: "رابطہ",
    },
    hi: {
      title: "खाद्य गाइड",
      subtitle: "सऊदी अरब में हाजियों के लिए खाने के विकल्प",
      foodGuide: "लोकप्रिय और हज के अनुकूल खाद्य पदार्थ",
      freeFoodTitle: "हाजियों के लिए मुफ्त भोजन केंद्र",
      freeFoodSubtitle: "मुफ्त भोजन प्रदान करने वाली धर्मार्थ संस्थाएं",
      foodStoresTitle: "उपलब्ध खाद्य दुकानें",
      foodStoresSubtitle: "हज के दौरान भोजन कहां से खरीदें",
      viewImage: "बड़ा करने के लिए छवि टैप करें",
      locations: "स्थान",
      timing: "समय",
      contact: "संपर्क",
    },
    ta: {
      title: "உணவு வழிகாட்டி",
      subtitle: "சவுதி அரேபியாவில் ஹாஜிகளுக்கான உணவு விருப்பங்கள்",
      foodGuide: "பிரபலமான மற்றும் ஹஜ்-நட்பு உணவுகள்",
      freeFoodTitle: "ஹாஜிகளுக்கான இலவச உணவு மையங்கள்",
      freeFoodSubtitle: "இலவச உணவு வழங்கும் அறக்கட்டளைகள்",
      foodStoresTitle: "கிடைக்கும் உணவுக் கடைகள்",
      foodStoresSubtitle: "ஹஜ்ஜின் போது உணவை எங்கே வாங்குவது",
      viewImage: "பெரிதாக்க படத்தைத் தட்டவும்",
      locations: "இடங்கள்",
      timing: "நேரம்",
      contact: "தொடர்பு",
    },
    te: {
      title: "ఆహార గైడ్",
      subtitle: "సౌదీ అరేబియాలో హాజీలకు ఆహార ఎంపికలు",
      foodGuide: "ప్రసిద్ధ మరియు హజ్-అనుకూల ఆహారాలు",
      freeFoodTitle: "హాజీలకు ఉచిత ఆహార కేంద్రాలు",
      freeFoodSubtitle: "ఉచిత భోజనం అందించే దాతృత్వ సంస్థలు",
      foodStoresTitle: "అందుబాటులో ఉన్న ఆహార దుకాణాలు",
      foodStoresSubtitle: "హజ్ సమయంలో ఆహారం ఎక్కడ కొనాలి",
      viewImage: "పెద్దది చేయడానికి చిత్రాన్ని నొక్కండి",
      locations: "ప్రదేశాలు",
      timing: "సమయం",
      contact: "సంప్రదింపు",
    },
    mr: {
      title: "अन्न मार्गदर्शक",
      subtitle: "सौदी अरेबियात हाजींसाठी अन्न पर्याय",
      foodGuide: "लोकप्रिय आणि हज-अनुकूल खाद्यपदार्थ",
      freeFoodTitle: "हाजींसाठी मोफत अन्न केंद्रे",
      freeFoodSubtitle: "मोफत जेवण देणाऱ्या धर्मादाय संस्था",
      foodStoresTitle: "उपलब्ध अन्न दुकाने",
      foodStoresSubtitle: "हजच्या काळात अन्न कुठे विकत घ्यावे",
      viewImage: "मोठे करण्यासाठी प्रतिमेवर टॅप करा",
      locations: "ठिकाणे",
      timing: "वेळ",
      contact: "संपर्क",
    },
    bn: {
      title: "খাদ্য গাইড",
      subtitle: "সৌদি আরবে হাজীদের জন্য খাবারের বিকল্প",
      foodGuide: "জনপ্রিয় এবং হজ-বান্ধব খাবার",
      freeFoodTitle: "হাজীদের জন্য বিনামূল্যে খাবার কেন্দ্র",
      freeFoodSubtitle: "বিনামূল্যে খাবার সরবরাহকারী দাতব্য সংস্থা",
      foodStoresTitle: "উপলব্ধ খাদ্য দোকান",
      foodStoresSubtitle: "হজের সময় খাবার কোথায় কিনবেন",
      viewImage: "বড় করতে ছবিতে ট্যাপ করুন",
      locations: "স্থান",
      timing: "সময়",
      contact: "যোগাযোগ",
    },
    or: {
      title: "ଖାଦ୍ୟ ଗାଇଡ୍",
      subtitle: "ସାଉଦି ଆରବରେ ହାଜୀମାନଙ୍କ ପାଇଁ ଖାଦ୍ୟ ବିକଳ୍ପ",
      foodGuide: "ଲୋକପ୍ରିୟ ଏବଂ ହଜ-ଅନୁକୂଳ ଖାଦ୍ୟ",
      freeFoodTitle: "ହାଜୀମାନଙ୍କ ପାଇଁ ମାଗଣା ଖାଦ୍ୟ କେନ୍ଦ୍ର",
      freeFoodSubtitle: "ମାଗଣା ଖାଦ୍ୟ ଯୋଗାଇ ଦେଉଥିବା ଦାତବ୍ୟ ସଂସ୍ଥା",
      foodStoresTitle: "ଉପಲବ୍ଧ ଖାଦ୍ୟ ଦୋକାନ",
      foodStoresSubtitle: "ହଜ ସମୟରେ ଖାଦ୍ୟ କେଉଁଠାରୁ କିଣିବେ",
      viewImage: "ବଡ଼ କରିବାକୁ ଛବିରେ ଟ୍ୟାପ୍ କରନ୍ତୁ",
      locations: "ସ୍ଥାନ",
      timing: "ସମୟ",
      contact: "ଯୋଗାଯୋଗ",
    },
    ml: {
      title: "ഭക്ഷണ ഗൈഡ്",
      subtitle: "സൗദി അറേബ്യയിൽ ഹാജിമാർക്കുള്ള ഭക്ഷണ ഓപ്ഷനുകൾ",
      foodGuide: "ജനപ്രിയവും ഹജ്-സൗഹൃദവുമായ ഭക്ഷണങ്ങൾ",
      freeFoodTitle: "ഹാജിമാർക്കുള്ള സൗജന്യ ഭക്ഷണ കേന്ദ്രങ്ങൾ",
      freeFoodSubtitle: "സൗജന്യ ഭക്ഷണം നൽകുന്ന ചാരിറ്റി സംഘടനകൾ",
      foodStoresTitle: "ലഭ്യമായ ഭക്ഷണ കടകൾ",
      foodStoresSubtitle: "ഹജ് സമയത്ത് ഭക്ഷണം എവിടെ നിന്ന് വാങ്ങാം",
      viewImage: "വലുതാക്കാൻ ചിത്രത്തിൽ ടാപ്പ് ചെയ്യുക",
      locations: "സ്ഥലങ്ങൾ",
      timing: "സമയം",
      contact: "ബന്ധപ്പെടുക",
    },
    pa: {
      title: "ਭੋਜਨ ਗਾਈਡ",
      subtitle: "ਸਾਊਦੀ ਅਰਬ ਵਿੱਚ ਹਾਜੀਆਂ ਲਈ ਭੋਜਨ ਵਿਕਲਪ",
      foodGuide: "ਪ੍ਰਸਿੱਧ ਅਤੇ ਹੱਜ-ਅਨੁਕੂਲ ਭੋਜਨ",
      freeFoodTitle: "ਹਾਜੀਆਂ ਲਈ ਮੁਫ਼ਤ ਭੋਜਨ ਕੇਂਦਰ",
      freeFoodSubtitle: "ਮੁਫ਼ਤ ਭੋਜਨ ਪ੍ਰਦਾਨ ਕਰਨ ਵਾਲੀਆਂ ਚੈਰਿਟੀ ਸੰਸਥਾਵਾਂ",
      foodStoresTitle: "ਉਪਲਬਧ ਭੋਜਨ ਸਟੋਰ",
      foodStoresSubtitle: "ਹੱਜ ਦੌਰਾਨ ਭੋਜਨ ਕਿੱਥੋਂ ਖਰੀਦਣਾ ਹੈ",
      viewImage: "ਵੱਡਾ ਕਰਨ ਲਈ ਤਸਵੀਰ 'ਤੇ ਟੈਪ ਕਰੋ",
      locations: "ਸਥਾਨ",
      timing: "ਸਮਾਂ",
      contact: "ਸੰਪਰਕ",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  const freeFoodCenters = [
    {
      nameEn: "Indian Hajj Mission Food Service",
      nameAr: "خدمة الطعام لبعثة الحج الهندية",
      locationEn: "Makkah & Mina Camps",
      locationAr: "مكة ومخيمات منى",
      timingEn: "Breakfast, Lunch & Dinner",
      timingAr: "إفطار، غداء وعشاء",
      icon: "🇮🇳",
    },
    {
      nameEn: "Saudi Red Crescent Distribution",
      nameAr: "توزيع الهلال الأحمر السعودي",
      locationEn: "All Hajj sites - Mina, Arafat, Muzdalifah",
      locationAr: "جميع مواقع الحج - منى، عرفات، مزدلفة",
      timingEn: "During Hajj days",
      timingAr: "خلال أيام الحج",
      icon: "🏥",
    },
    {
      nameEn: "Makkah Municipality Free Meals",
      nameAr: "وجبات أمانة مكة المكرمة المجانية",
      locationEn: "Grand Mosque area",
      locationAr: "منطقة المسجد الحرام",
      timingEn: "After prayers",
      timingAr: "بعد الصلوات",
      icon: "🕌",
    },
    {
      nameEn: "Local Charity Organizations",
      nameAr: "منظمات خيرية محلية",
      locationEn: "Various locations in Makkah & Madinah",
      locationAr: "مواقع متعددة في مكة والمدينة",
      timingEn: "24/7 during Hajj season",
      timingAr: "على مدار الساعة خلال موسم الحج",
      icon: "❤️",
    },
  ];

  const foodStores = [
    {
      nameEn: "Al-Othaim Markets",
      nameAr: "أسواق العثيم",
      typeEn: "Supermarket",
      typeAr: "سوبرماركت",
      locationEn: "Multiple locations in Makkah & Madinah",
      locationAr: "مواقع متعددة في مكة والمدينة",
      icon: "🛒",
    },
    {
      nameEn: "Panda Hypermarket",
      nameAr: "هايبر بنده",
      typeEn: "Hypermarket",
      typeAr: "هايبر ماركت",
      locationEn: "Aziziya, Makkah",
      locationAr: "العزيزية، مكة",
      icon: "🏪",
    },
    {
      nameEn: "Bin Dawood Supermarket",
      nameAr: "سوبرماركت بن داود",
      typeEn: "Supermarket",
      typeAr: "سوبرماركت",
      locationEn: "Near Haram, Makkah",
      locationAr: "قرب الحرم، مكة",
      icon: "🛍️",
    },
    {
      nameEn: "Local Bakeries (Khubz)",
      nameAr: "المخابز المحلية (خبز)",
      typeEn: "Fresh Bread",
      typeAr: "خبز طازج",
      locationEn: "Throughout Makkah & Madinah",
      locationAr: "في جميع أنحاء مكة والمدينة",
      icon: "🥖",
    },
    {
      nameEn: "Street Food Vendors",
      nameAr: "باعة الطعام المتجولون",
      typeEn: "Quick Meals",
      typeAr: "وجبات سريعة",
      locationEn: "Near accommodations",
      locationAr: "بالقرب من السكن",
      icon: "🍢",
    },
    {
      nameEn: "Indian Restaurants",
      nameAr: "مطاعم هندية",
      typeEn: "Familiar Food",
      typeAr: "طعام مألوف",
      locationEn: "Aziziya & near Haram",
      locationAr: "العزيزية وقرب الحرم",
      icon: "🍛",
    },
  ];

  return (
    <MainLayout>
      <div className={`min-h-screen bg-background ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4 py-4 safe-area-top">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-3 gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8 space-y-6">
          {/* Food Guide Image */}
          <Card className="overflow-hidden border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🍽️</span>
                {t.foodGuide}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={foodGuideImage} 
                  alt="Food Guide for Pilgrims" 
                  className="w-full h-auto object-contain rounded-lg"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">{t.viewImage}</p>
              </div>
            </CardContent>
          </Card>

          {/* Free Food Centers */}
          <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                <Heart className="w-5 h-5" />
                {t.freeFoodTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t.freeFoodSubtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {freeFoodCenters.map((center, index) => (
                <div 
                  key={index}
                  className="p-4 bg-background rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{center.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {language === "ar" ? center.nameAr : center.nameEn}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {language === "ar" ? center.locationAr : center.locationEn}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {language === "ar" ? center.timingAr : center.timingEn}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      {language === "ar" ? "مجاني" : "Free"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Food Stores */}
          <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Store className="w-5 h-5" />
                {t.foodStoresTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{t.foodStoresSubtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {foodStores.map((store, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-background rounded-lg border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{store.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {language === "ar" ? store.nameAr : store.nameEn}
                        </h3>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {language === "ar" ? store.typeAr : store.typeEn}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                          <MapPin className="w-3 h-3" />
                          {language === "ar" ? store.locationAr : store.locationEn}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                    {language === "ar" ? "نصيحة مهمة" : "Important Tip"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "ar" 
                      ? "في منى وعرفات، يتم تقديم وجبات معبأة فقط. اختر الأطعمة الخفيفة المعتمدة على الأرز واشرب الكثير من الماء للبقاء رطبًا."
                      : "In Mina/Arafat, only packed meals are served. Go for light, rice-based foods and drink plenty of water to stay hydrated."
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default FoodGuidePage;
