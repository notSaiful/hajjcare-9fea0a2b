import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import all Hajj journey images
import umrahSteps from "@/assets/hajj-journey/umrah-steps.png";
import day1Mina from "@/assets/hajj-journey/day1-mina.png";
import day2Arafat from "@/assets/hajj-journey/day2-arafat.png";
import day3Eid from "@/assets/hajj-journey/day3-eid.png";
import day4Jamarat from "@/assets/hajj-journey/day4-jamarat.png";
import day5Completion from "@/assets/hajj-journey/day5-completion.png";

const journeyImages = [
  {
    id: "umrah",
    image: umrahSteps,
    title: {
      en: "How to Perform Umrah",
      ar: "كيفية أداء العمرة",
      ur: "عمرہ کیسے کریں",
      hi: "उमराह कैसे करें",
      ta: "உம்ரா எப்படி செய்வது",
      te: "ఉమ్రా ఎలా చేయాలి",
      mr: "उमराह कसे करावे",
      bn: "উমরাহ কিভাবে করবেন",
      or: "ଉମରାହ କିପରି କରିବେ",
      ml: "ഉംറ എങ്ങനെ ചെയ്യാം",
      pa: "ਉਮਰਾਹ ਕਿਵੇਂ ਕਰਨਾ ਹੈ",
    },
    description: {
      en: "Complete 12-step guide to performing Umrah",
      ar: "دليل من 12 خطوة لأداء العمرة",
      ur: "عمرہ کرنے کا مکمل 12 مراحل کا رہنما",
      hi: "उमराह करने की पूर्ण 12-चरणीय मार्गदर्शिका",
      ta: "உம்ரா செய்வதற்கான முழுமையான 12-படி வழிகாட்டி",
      te: "ఉమ్రా చేయడానికి పూర్తి 12-దశల మార్గదర్శి",
      mr: "उमराह करण्याचे संपूर्ण 12-चरण मार्गदर्शक",
      bn: "উমরাহ করার সম্পূর্ণ 12-ধাপ নির্দেশিকা",
      or: "ଉମରାହ କରିବାର ସମ୍ପୂର୍ଣ 12-ପଦକ୍ଷେପ ଗାଇଡ",
      ml: "ഉംറ ചെയ്യുന്നതിനുള്ള പൂർണ 12-ഘട്ട ഗൈഡ്",
      pa: "ਉਮਰਾਹ ਕਰਨ ਦੀ ਪੂਰੀ 12-ਕਦਮ ਗਾਈਡ",
    },
  },
  {
    id: "day1",
    image: day1Mina,
    title: {
      en: "First Day of Hajj (8th Dhul Hijjah)",
      ar: "اليوم الأول من الحج (8 ذو الحجة)",
      ur: "حج کا پہلا دن (8 ذوالحجہ)",
      hi: "हज का पहला दिन (8 ज़ुल-हिज्जाह)",
      ta: "ஹஜ்ஜின் முதல் நாள் (துல் ஹிஜ்ஜா 8)",
      te: "హజ్ మొదటి రోజు (8 జుల్-హిజ్జా)",
      mr: "हजचा पहिला दिवस (8 जुल-हिज्जा)",
      bn: "হজের প্রথম দিন (৮ জিলহজ)",
      or: "ହଜ୍ଜର ପ୍ରଥମ ଦିନ (8 ଜିଲ ହିଜ୍ଜା)",
      ml: "ഹജ്ജിന്റെ ആദ്യ ദിനം (ദുൽഹിജ്ജ 8)",
      pa: "ਹੱਜ ਦਾ ਪਹਿਲਾ ਦਿਨ (8 ਜ਼ੁਲ-ਹਿੱਜਾ)",
    },
    description: {
      en: "Mina - You are in Mina",
      ar: "منى - أنت في منى",
      ur: "منیٰ - آپ منیٰ میں ہیں",
      hi: "मिना - आप मिना में हैं",
      ta: "மினா - நீங்கள் மினாவில் இருக்கிறீர்கள்",
      te: "మినా - మీరు మినాలో ఉన్నారు",
      mr: "मिना - तुम्ही मिनामध्ये आहात",
      bn: "মিনা - আপনি মিনায় আছেন",
      or: "ମିନା - ଆପଣ ମିନାରେ ଅଛନ୍ତି",
      ml: "മിനാ - നിങ്ങൾ മിനായിലാണ്",
      pa: "ਮਿਨਾ - ਤੁਸੀਂ ਮਿਨਾ ਵਿੱਚ ਹੋ",
    },
  },
  {
    id: "day2",
    image: day2Arafat,
    title: {
      en: "Second Day of Hajj (9th Dhul Hijjah)",
      ar: "اليوم الثاني من الحج (9 ذو الحجة)",
      ur: "حج کا دوسرا دن (9 ذوالحجہ)",
      hi: "हज का दूसरा दिन (9 ज़ुल-हिज्जाह)",
      ta: "ஹஜ்ஜின் இரண்டாம் நாள் (துல் ஹிஜ்ஜா 9)",
      te: "హజ్ రెండో రోజు (9 జుల్-హిజ్జా)",
      mr: "हजचा दुसरा दिवस (9 जुल-हिज्जा)",
      bn: "হজের দ্বিতীয় দিন (৯ জিলহজ)",
      or: "ହଜ୍ଜର ଦ୍ୱିତୀୟ ଦିନ (9 ଜିଲ ହିଜ୍ଜା)",
      ml: "ഹജ്ജിന്റെ രണ്ടാം ദിനം (ദുൽഹിജ്ജ 9)",
      pa: "ਹੱਜ ਦਾ ਦੂਜਾ ਦਿਨ (9 ਜ਼ੁਲ-ਹਿੱਜਾ)",
    },
    description: {
      en: "Arafat - The Day of Arafat",
      ar: "عرفات - يوم عرفة",
      ur: "عرفات - یوم عرفہ",
      hi: "अराफात - अराफात का दिन",
      ta: "அரஃபா - அரஃபா நாள்",
      te: "అరఫాత్ - అరఫాత్ రోజు",
      mr: "अराफात - अराफातचा दिवस",
      bn: "আরাফাত - আরাফাত দিবস",
      or: "ଆରଫାତ - ଆରଫାତ ଦିନ",
      ml: "അറഫ - അറഫ ദിനം",
      pa: "ਅਰਾਫਾਤ - ਅਰਾਫਾਤ ਦਾ ਦਿਨ",
    },
  },
  {
    id: "day3",
    image: day3Eid,
    title: {
      en: "Third Day of Hajj (10th Dhul Hijjah)",
      ar: "اليوم الثالث من الحج (10 ذو الحجة)",
      ur: "حج کا تیسرا دن (10 ذوالحجہ)",
      hi: "हज का तीसरा दिन (10 ज़ुल-हिज्जाह)",
      ta: "ஹஜ்ஜின் மூன்றாம் நாள் (துல் ஹிஜ்ஜா 10)",
      te: "హజ్ మూడో రోజు (10 జుల్-హిజ్జా)",
      mr: "हजचा तिसरा दिवस (10 जुल-हिज्जा)",
      bn: "হজের তৃতীয় দিন (১০ জিলহজ)",
      or: "ହଜ୍ଜର ତୃତୀୟ ଦିନ (10 ଜିଲ ହିଜ୍ଜା)",
      ml: "ഹജ്ജിന്റെ മൂന്നാം ദിനം (ദുൽഹിജ്ജ 10)",
      pa: "ਹੱਜ ਦਾ ਤੀਜਾ ਦਿਨ (10 ਜ਼ੁਲ-ਹਿੱਜਾ)",
    },
    description: {
      en: "Eid Day - First Day of Eid (Stay in Mina)",
      ar: "يوم العيد - أول أيام العيد (البقاء في منى)",
      ur: "عید کا دن - عید کا پہلا دن (منیٰ میں قیام)",
      hi: "ईद का दिन - ईद का पहला दिन (मिना में रहें)",
      ta: "ஈத் நாள் - ஈத்தின் முதல் நாள் (மினாவில் தங்கவும்)",
      te: "ఈద్ రోజు - ఈద్ మొదటి రోజు (మినాలో ఉండండి)",
      mr: "ईद दिवस - ईदचा पहिला दिवस (मिनात रहा)",
      bn: "ঈদের দিন - ঈদের প্রথম দিন (মিনায় থাকুন)",
      or: "ଈଦ ଦିନ - ଈଦର ପ୍ରଥମ ଦିନ (ମିନାରେ ରୁହନ୍ତୁ)",
      ml: "ഈദ് ദിനം - ഈദിന്റെ ആദ്യ ദിനം (മിനായിൽ തങ്ങുക)",
      pa: "ਈਦ ਦਾ ਦਿਨ - ਈਦ ਦਾ ਪਹਿਲਾ ਦਿਨ (ਮਿਨਾ ਵਿੱਚ ਰਹੋ)",
    },
  },
  {
    id: "day4",
    image: day4Jamarat,
    title: {
      en: "Fourth Day of Hajj (11th Dhul Hijjah)",
      ar: "اليوم الرابع من الحج (11 ذو الحجة)",
      ur: "حج کا چوتھا دن (11 ذوالحجہ)",
      hi: "हज का चौथा दिन (11 ज़ुल-हिज्जाह)",
      ta: "ஹஜ்ஜின் நான்காம் நாள் (துல் ஹிஜ்ஜா 11)",
      te: "హజ్ నాలుగో రోజు (11 జుల్-హిజ్జా)",
      mr: "हजचा चौथा दिवस (11 जुल-हिज्जा)",
      bn: "হজের চতুর্থ দিন (১১ জিলহজ)",
      or: "ହଜ୍ଜର ଚତୁର୍ଥ ଦିନ (11 ଜିଲ ହିଜ୍ଜା)",
      ml: "ഹജ്ജിന്റെ നാലാം ദിനം (ദുൽഹിജ്ജ 11)",
      pa: "ਹੱਜ ਦਾ ਚੌਥਾ ਦਿਨ (11 ਜ਼ੁਲ-ਹਿੱਜਾ)",
    },
    description: {
      en: "Jamarat - 2nd Day of Eid (Stay in Mina)",
      ar: "الجمرات - ثاني أيام العيد (البقاء في منى)",
      ur: "جمرات - عید کا دوسرا دن (منیٰ میں قیام)",
      hi: "जमरात - ईद का दूसरा दिन (मिना में रहें)",
      ta: "ஜமராத் - ஈத்தின் 2வது நாள் (மினாவில் தங்கவும்)",
      te: "జమరాత్ - ఈద్ రెండో రోజు (మినాలో ఉండండి)",
      mr: "जमरात - ईदचा दुसरा दिवस (मिनात रहा)",
      bn: "জামারাত - ঈদের ২য় দিন (মিনায় থাকুন)",
      or: "ଜାମାରାତ - ଈଦର 2ୟ ଦିନ (ମିନାରେ ରୁହନ୍ତୁ)",
      ml: "ജമറാത്ത് - ഈദിന്റെ 2-ാം ദിനം (മിനായിൽ തങ്ങുക)",
      pa: "ਜਮਰਾਤ - ਈਦ ਦਾ ਦੂਜਾ ਦਿਨ (ਮਿਨਾ ਵਿੱਚ ਰਹੋ)",
    },
  },
  {
    id: "day5",
    image: day5Completion,
    title: {
      en: "Fifth Day of Hajj (12th Dhul Hijjah)",
      ar: "اليوم الخامس من الحج (12 ذو الحجة)",
      ur: "حج کا پانچواں دن (12 ذوالحجہ)",
      hi: "हज का पांचवां दिन (12 ज़ुल-हिज्जाह)",
      ta: "ஹஜ்ஜின் ஐந்தாம் நாள் (துல் ஹிஜ்ஜா 12)",
      te: "హజ్ ఐదో రోజు (12 జుల్-హిజ్జా)",
      mr: "हजचा पाचवा दिवस (12 जुल-हिज्जा)",
      bn: "হজের পঞ্চম দিন (১২ জিলহজ)",
      or: "ହଜ୍ଜର ପଞ୍ଚମ ଦିନ (12 ଜିଲ ହିଜ୍ଜା)",
      ml: "ഹജ്ജിന്റെ അഞ്ചാം ദിനം (ദുൽഹിജ്ജ 12)",
      pa: "ਹੱਜ ਦਾ ਪੰਜਵਾਂ ਦਿਨ (12 ਜ਼ੁਲ-ਹਿੱਜਾ)",
    },
    description: {
      en: "Hajj Completion - Tawaf al-Wida",
      ar: "اكتمال الحج - طواف الوداع",
      ur: "حج کی تکمیل - طواف الوداع",
      hi: "हज पूर्णता - तवाफ अल-विदा",
      ta: "ஹஜ் நிறைவு - தவாஃப் அல்-விதா",
      te: "హజ్ పూర్తి - తవాఫ్ అల్-విదా",
      mr: "हज पूर्णता - तवाफ अल-विदा",
      bn: "হজ সমাপ্তি - তাওয়াফ আল-বিদা",
      or: "ହଜ୍ଜ ସମାପ୍ତି - ତାୱାଫ ଆଲ-ୱିଦା",
      ml: "ഹജ്ജ് പൂർത്തിയാക്കൽ - തവാഫ് അൽ-വിദാ",
      pa: "ਹੱਜ ਮੁਕੰਮਲ - ਤਵਾਫ਼ ਅਲ-ਵਿਦਾ",
    },
  },
];

const HajjJourneyVisuals = () => {
  const { language, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const labels = {
    sectionTitle: {
      en: "Visual Journey Guide",
      ar: "دليل الرحلة المرئي",
      ur: "بصری سفر گائیڈ",
      hi: "दृश्य यात्रा मार्गदर्शिका",
      ta: "காட்சி பயண வழிகாட்டி",
      te: "దృశ్య ప్రయాణ గైడ్",
      mr: "दृश्य प्रवास मार्गदर्शिका",
      bn: "ভিজ্যুয়াল যাত্রা গাইড",
      or: "ଭିଜୁଆଲ ଯାତ୍ରା ଗାଇଡ",
      ml: "വിഷ്വൽ യാത്രാ ഗൈഡ്",
      pa: "ਵਿਜ਼ੁਅਲ ਯਾਤਰਾ ਗਾਈਡ",
    },
    tapToZoom: {
      en: "Tap image to zoom",
      ar: "اضغط على الصورة للتكبير",
      ur: "زوم کرنے کے لیے تصویر پر ٹیپ کریں",
      hi: "ज़ूम करने के लिए छवि पर टैप करें",
      ta: "பெரிதாக்க படத்தை தட்டவும்",
      te: "జూమ్ చేయడానికి చిత్రంపై ట్యాప్ చేయండి",
      mr: "झूम करण्यासाठी प्रतिमेवर टॅप करा",
      bn: "জুম করতে ছবিতে ট্যাপ করুন",
      or: "ଜୁମ୍ କରିବାକୁ ଚିତ୍ରରେ ଟ୍ୟାପ୍ କରନ୍ତୁ",
      ml: "സൂം ചെയ്യാൻ ചിത്രത്തിൽ ടാപ്പ് ചെയ്യുക",
      pa: "ਜ਼ੂਮ ਕਰਨ ਲਈ ਚਿੱਤਰ 'ਤੇ ਟੈਪ ਕਰੋ",
    },
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? journeyImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === journeyImages.length - 1 ? 0 : prev + 1));
  };

  const currentImage = journeyImages[currentIndex];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <span className="text-2xl">📸</span>
          {labels.sectionTitle[language] || labels.sectionTitle.en}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Image Carousel */}
        <div className="relative">
          <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer group rounded-lg overflow-hidden border-2 border-border shadow-md">
                <img
                  src={currentImage.image}
                  alt={currentImage.title[language] || currentImage.title.en}
                  className="w-full h-auto object-contain aspect-square transition-transform group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-2 sm:p-4">
              <div className="relative overflow-auto max-h-[85vh]">
                <img
                  src={currentImage.image}
                  alt={currentImage.title[language] || currentImage.title.en}
                  className="w-full h-auto object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Navigation Arrows */}
          <Button
            variant="secondary"
            size="icon"
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-2" : "left-2"} h-9 w-9 rounded-full shadow-lg opacity-90 hover:opacity-100`}
            onClick={goToPrevious}
          >
            {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-2" : "right-2"} h-9 w-9 rounded-full shadow-lg opacity-90 hover:opacity-100`}
            onClick={goToNext}
          >
            {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        {/* Image Info */}
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-sm sm:text-base text-foreground">
            {currentImage.title[language] || currentImage.title.en}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {currentImage.description[language] || currentImage.description.en}
          </p>
          <p className="text-xs text-muted-foreground/70 flex items-center justify-center gap-1">
            <ZoomIn className="w-3 h-3" />
            {labels.tapToZoom[language] || labels.tapToZoom.en}
          </p>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-1.5">
          {journeyImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HajjJourneyVisuals;
