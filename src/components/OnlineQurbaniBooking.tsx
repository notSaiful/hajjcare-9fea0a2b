import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Search, AlertTriangle } from "lucide-react";

type Lang = "en" | "ur" | "hi";

const t = (translations: Record<Lang, string>, lang: Lang) =>
  translations[lang] || translations.en;

const labels = {
  sectionTitle: { en: "Online Qurbani Booking", ur: "آن لائن قربانی بکنگ", hi: "ऑनलाइन कुर्बानी बुकिंग" },
  sectionSubtitle: {
    en: "Book your sacrifice through authorized international partners",
    ur: "بین الاقوامی مجاز شراکت داروں کے ذریعے اپنی قربانی بک کریں",
    hi: "अधिकृत अंतरराष्ट्रीय साझेदारों के माध्यम से अपनी कुर्बानी बुक करें",
  },
  bookNow: { en: "Book Now", ur: "ابھی بک کریں", hi: "अभी बुक करें" },
  trackStatus: { en: "Track Booking Status", ur: "بکنگ کی حالت دیکھیں", hi: "बुकिंग स्थिति ट्रैक करें" },
  disclaimer: {
    en: "Qurbani is performed through authorized international partners. HajjCare AI is not responsible for third-party services.",
    ur: "قربانی مجاز بین الاقوامی شراکت داروں کے ذریعے انجام دی جاتی ہے۔ HajjCare AI فریق ثالث خدمات کا ذمہ دار نہیں ہے۔",
    hi: "कुर्बानी अधिकृत अंतरराष्ट्रीय साझेदारों के माध्यम से की जाती है। HajjCare AI तीसरे पक्ष की सेवाओं के लिए जिम्मेदार नहीं है।",
  },
  priceLabel: { en: "Starting from", ur: "شروع قیمت", hi: "शुरुआती कीमत" },
  confirmationTitle: { en: "Booking Confirmed!", ur: "بکنگ کی تصدیق!", hi: "बुकिंग की पुष्टि!" },
  confirmationMsg: {
    en: "Your Qurbani has been booked successfully. You will receive a confirmation via SMS/Email.",
    ur: "آپ کی قربانی کامیابی سے بک ہو گئی ہے۔ آپ کو SMS/ای میل کے ذریعے تصدیق موصول ہوگی۔",
    hi: "आपकी कुर्बानी सफलतापूर्वक बुक हो गई है। आपको SMS/ईमेल के माध्यम से पुष्टि प्राप्त होगी।",
  },
} as const;

interface AnimalOption {
  id: string;
  emoji: string;
  name: Record<Lang, string>;
  price: string;
  bookingUrl: string;
}

const animals: AnimalOption[] = [
  {
    id: "goat",
    emoji: "🐐",
    name: { en: "Goat", ur: "بکرا", hi: "बकरा" },
    price: "SAR 850",
    bookingUrl: "https://adahi.gov.sa",
  },
  {
    id: "sheep",
    emoji: "🐑",
    name: { en: "Sheep", ur: "بھیڑ", hi: "भेड़" },
    price: "SAR 750",
    bookingUrl: "https://adahi.gov.sa",
  },
  {
    id: "cow-share",
    emoji: "🐄",
    name: { en: "Cow (1/7 Share)", ur: "گائے (1/7 حصہ)", hi: "गाय (1/7 हिस्सा)" },
    price: "SAR 550",
    bookingUrl: "https://adahi.gov.sa",
  },
  {
    id: "camel-share",
    emoji: "🐪",
    name: { en: "Camel (1/7 Share)", ur: "اونٹ (1/7 حصہ)", hi: "ऊंट (1/7 हिस्सा)" },
    price: "SAR 700",
    bookingUrl: "https://adahi.gov.sa",
  },
];

const TRACKING_URL = "https://adahi.gov.sa";

const OnlineQurbaniBooking = () => {
  const { language, isRTL } = useLanguage();
  const lang: Lang = (["en", "ur", "hi"].includes(language) ? language : "en") as Lang;

  // Check if redirected back with confirmation
  const params = new URLSearchParams(window.location.search);
  const confirmed = params.get("qurbani_confirmed") === "true";

  const handleBook = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          🕋 {t(labels.sectionTitle, lang)}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t(labels.sectionSubtitle, lang)}
        </p>
      </div>

      {/* Confirmation Banner */}
      {confirmed && (
        <Card className="border-primary/30 bg-primary/10">
          <CardContent className="p-4 text-center space-y-1">
            <p className="font-semibold text-primary">
              ✅ {t(labels.confirmationTitle, lang)}
            </p>
            <p className="text-sm text-foreground">
              {t(labels.confirmationMsg, lang)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Animal Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        {animals.map((animal) => (
          <Card
            key={animal.id}
            className="border-border hover:border-primary/40 transition-colors"
          >
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <span className="text-4xl">{animal.emoji}</span>
              <h3 className="font-semibold text-foreground text-sm">
                {t(animal.name, lang)}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t(labels.priceLabel, lang)}: <span className="font-medium text-foreground">{animal.price}</span>
              </p>
              <Button
                size="sm"
                className="w-full mt-1 gap-1.5"
                onClick={() => handleBook(animal.bookingUrl)}
              >
                {t(labels.bookNow, lang)}
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Track Status */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() => window.open(TRACKING_URL, "_blank", "noopener,noreferrer")}
      >
        <Search className="w-4 h-4" />
        {t(labels.trackStatus, lang)}
      </Button>

      {/* Disclaimer */}
      <Card className="border-status-assistance/20 bg-status-assistance/5">
        <CardContent className="p-3 flex gap-2 items-start">
          <AlertTriangle className="w-4 h-4 text-status-assistance mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t(labels.disclaimer, lang)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnlineQurbaniBooking;
