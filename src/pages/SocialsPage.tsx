import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Youtube, Instagram, AlertCircle, Twitter } from "lucide-react";

const socialLinks = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    name: { en: "WhatsApp", ar: "واتساب", ur: "واٹس ایپ", hi: "व्हाट्सएप", ta: "வாட்ஸ்அப்", te: "వాట్సాప్", mr: "व्हाट्सअॅप", bn: "হোয়াটসঅ্যাপ", or: "ହ୍ୱାଟ୍ସଆପ", ml: "വാട്ട്സ്ആപ്പ്", pa: "ਵਟਸਐਪ" },
    description: { en: "Official HajjCare Channel", ar: "قناة HajjCare الرسمية", ur: "آفیشل HajjCare چینل", hi: "आधिकारिक HajjCare चैनल", ta: "அதிகாரப்பூர்வ HajjCare சேனல்", te: "అధికారిక HajjCare ఛానెల్", mr: "अधिकृत HajjCare चॅनल", bn: "অফিসিয়াল HajjCare চ্যানেল", or: "ଅଫିସିଆଲ HajjCare ଚ୍ୟାନେଲ", ml: "ഔദ്യോഗിക HajjCare ചാനൽ", pa: "ਅਧਿਕਾਰਤ HajjCare ਚੈਨਲ" },
    url: "https://wa.me/917588113830?text=Assalamu%20Alaikum%2C%20I%20would%20like%20to%20join%20the%20HajjCare%20WhatsApp%20group.%20Please%20add%20me.%20JazakAllah%20Khair!",
    color: "bg-green-500",
  },
  {
    id: "x",
    icon: Twitter,
    name: { en: "X (Twitter)", ar: "إكس (تويتر)", ur: "ایکس (ٹویٹر)", hi: "एक्स (ट्विटर)", ta: "எக்ஸ் (ட்விட்டர்)", te: "ఎక్స్ (ట్విట్టర్)", mr: "एक्स (ट्विटर)", bn: "এক্স (টুইটার)", or: "ଏକ୍ସ (ଟ୍ୱିଟର)", ml: "എക്സ് (ട്വിറ്റർ)", pa: "ਐਕਸ (ਟਵਿੱਟਰ)" },
    description: { en: "HajjCare Updates & News", ar: "تحديثات وأخبار HajjCare", ur: "HajjCare اپڈیٹس اور خبریں", hi: "HajjCare अपडेट और समाचार", ta: "HajjCare புதுப்பிப்புகள் & செய்திகள்", te: "HajjCare అప్‌డేట్లు & వార్తలు", mr: "HajjCare अद्यतने आणि बातम्या", bn: "HajjCare আপডেট ও সংবাদ", or: "HajjCare ଅପଡେଟ ଓ ଖବର", ml: "HajjCare അപ്ഡേറ്റുകളും വാർത്തകളും", pa: "HajjCare ਅੱਪਡੇਟ ਅਤੇ ਖ਼ਬਰਾਂ" },
    url: "https://x.com/UlHaramain50604",
    color: "bg-black",
  },
  {
    id: "youtube",
    icon: Youtube,
    name: { en: "YouTube", ar: "يوتيوب", ur: "یوٹیوب", hi: "यूट्यूब", ta: "யூடியூப்", te: "యూట్యూబ్", mr: "यूट्यूब", bn: "ইউটিউব", or: "ୟୁଟ୍ୟୁବ", ml: "യൂട്യൂബ്", pa: "ਯੂਟਿਊਬ" },
    description: { en: "HajjCare Videos & Guides", ar: "فيديوهات وإرشادات HajjCare", ur: "HajjCare ویڈیوز اور گائیڈز", hi: "HajjCare वीडियो और गाइड", ta: "HajjCare வீடியோக்கள் & வழிகாட்டிகள்", te: "HajjCare వీడియోలు & గైడ్లు", mr: "HajjCare व्हिडिओ आणि मार्गदर्शक", bn: "HajjCare ভিডিও ও গাইড", or: "HajjCare ଭିଡିଓ ଓ ଗାଇଡ", ml: "HajjCare വീഡിയോകളും ഗൈഡുകളും", pa: "HajjCare ਵੀਡੀਓ ਅਤੇ ਗਾਈਡ" },
    url: "https://youtube.com/@rafiqulharmain-y8d?si=7_kH_Kie4nZYMVyP",
    color: "bg-red-500",
  },
  {
    id: "instagram",
    icon: Instagram,
    name: { en: "Instagram", ar: "انستغرام", ur: "انسٹاگرام", hi: "इंस्टाग्राम", ta: "இன்ஸ்டாகிராம்", te: "ఇన్‌స్టాగ్రామ్", mr: "इंस्टाग्राम", bn: "ইনস্টাগ্রাম", or: "ଇନଷ୍ଟାଗ୍ରାମ", ml: "ഇൻസ്റ്റാഗ്രാം", pa: "ਇੰਸਟਾਗ੍ਰਾਮ" },
    description: { en: "HajjCare Updates & Photos", ar: "تحديثات وصور HajjCare", ur: "HajjCare اپڈیٹس اور تصاویر", hi: "HajjCare अपडेट और फोटो", ta: "HajjCare புதுப்பிப்புகள் & புகைப்படங்கள்", te: "HajjCare అప్‌డేట్లు & ఫోటోలు", mr: "HajjCare अद्यतने आणि फोटो", bn: "HajjCare আপডেট ও ছবি", or: "HajjCare ଅପଡେଟ ଓ ଫଟୋ", ml: "HajjCare അപ്ഡേറ്റുകളും ഫോട്ടോകളും", pa: "HajjCare ਅੱਪਡੇਟ ਅਤੇ ਫੋਟੋ" },
    url: "https://www.instagram.com/rafiqulharmain?igsh=cDd5NnoxbnVwYWN2",
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
  },
];

const pageContent = {
  title: { en: "Official Channels", ar: "القنوات الرسمية", ur: "آفیشل چینلز", hi: "आधिकारिक चैनल", ta: "அதிகாரப்பூர்வ சேனல்கள்", te: "అధికారిక ఛానెల్స్", mr: "अधिकृत चॅनल", bn: "অফিসিয়াল চ্যানেল", or: "ଅଫିସିଆଲ ଚ୍ୟାନେଲ", ml: "ഔദ്യോഗിക ചാനലുകൾ", pa: "ਅਧਿਕਾਰਤ ਚੈਨਲ" },
  subtitle: { en: "Connect with HajjCare", ar: "تواصل مع HajjCare", ur: "HajjCare سے جڑیں", hi: "HajjCare से जुड़ें", ta: "HajjCare உடன் இணையுங்கள்", te: "HajjCare తో కనెక్ట్ అవ్వండి", mr: "HajjCare शी जोडले जा", bn: "HajjCare এর সাথে যুক্ত হন", or: "HajjCare ସହ ସଂଯୋଗ କରନ୍ତୁ", ml: "HajjCare മായി ബന്ധപ്പെടുക", pa: "HajjCare ਨਾਲ ਜੁੜੋ" },
  disclaimer: { 
    en: "For emergencies or grievances, please use in-app support features.", 
    ar: "للطوارئ أو الشكاوى، يرجى استخدام ميزات الدعم داخل التطبيق.", 
    ur: "ہنگامی صورتحال یا شکایات کے لیے، براہ کرم ایپ میں سپورٹ استعمال کریں۔", 
    hi: "आपातकाल या शिकायतों के लिए, कृपया इन-ऐप सहायता का उपयोग करें।", 
    ta: "அவசரநிலை அல்லது புகார்களுக்கு, ஆப்-இல் உதவியைப் பயன்படுத்தவும்.", 
    te: "అత్యవసర పరిస్థితులు లేదా ఫిర్యాదుల కోసం, దయచేసి యాప్‌లో సపోర్ట్ ఉపయోగించండి.", 
    mr: "आणीबाणी किंवा तक्रारींसाठी, कृपया अॅप-मधील समर्थन वापरा.", 
    bn: "জরুরি অবস্থা বা অভিযোগের জন্য, অ্যাপ-এর সাপোর্ট ব্যবহার করুন।", 
    or: "ଜରୁରୀ ବା ଅଭିଯୋଗ ପାଇଁ, ଆପ ସପୋର୍ଟ ବ୍ୟବହାର କରନ୍ତୁ।", 
    ml: "അടിയന്തിരാവസ്ഥകൾക്കോ പരാതികൾക്കോ, ആപ്പ് സപ്പോർട്ട് ഉപയോഗിക്കുക.", 
    pa: "ਐਮਰਜੈਂਸੀ ਜਾਂ ਸ਼ਿਕਾਇਤਾਂ ਲਈ, ਐਪ ਸਪੋਰਟ ਵਰਤੋ।" 
  },
};

export default function SocialsPage() {
  const { language } = useLanguage();

  const handleOpenLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-4 pb-24">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pt-4">
            <h1 className="text-2xl font-bold text-foreground">
              {pageContent.title[language] || pageContent.title.en}
            </h1>
            <p className="text-muted-foreground">
              {pageContent.subtitle[language] || pageContent.subtitle.en}
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            {socialLinks.map((social, index) => (
              <Card
                key={social.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleOpenLink(social.url)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full ${social.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <social.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg">
                      {social.name[language] || social.name.en}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {social.description[language] || social.description.en}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Disclaimer */}
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/50">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {pageContent.disclaimer[language] || pageContent.disclaimer.en}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
