import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ArrowLeft, ChevronRight, Users, Shield, Ban, Camera, Heart, BookOpen, Shirt, Tent, Mountain, Moon, Target, Landmark, Building2, MapPin } from "lucide-react";
import { RULES_SECTIONS } from "@/data/saudiRulesContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Shield,
  Ban,
  Camera,
  Heart,
  BookOpen,
  Shirt,
  Tent,
  Mountain,
  Moon,
  Target,
  Landmark,
  Building2,
  MapPin,
};

const RulesBriefingPage = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [readSections, setReadSections] = useState<string[]>(() => {
    const saved = localStorage.getItem("hajj-rules-read");
    return saved ? JSON.parse(saved) : [];
  });

  const [confirmed, setConfirmed] = useState<boolean>(() => {
    return localStorage.getItem("hajj-rules-confirmed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("hajj-rules-read", JSON.stringify(readSections));
  }, [readSections]);

  const allRead = readSections.length === RULES_SECTIONS.length;
  const progress = Math.round((readSections.length / RULES_SECTIONS.length) * 100);

  const handleConfirm = () => {
    setConfirmed(true);
    localStorage.setItem("hajj-rules-confirmed", "true");
  };

  const labels = {
    title: { en: "Saudi Rules & Conduct", ar: "قواعد السلوك السعودية", ur: "سعودی قواعد و آداب", hi: "सऊदी नियम और आचरण", ta: "சவுதி விதிகள் மற்றும் நடத்தை", te: "సౌదీ నియమాలు & ప్రవర్తన", mr: "सौदी नियम आणि वर्तन", bn: "সৌদি নিয়ম ও আচরণ", or: "ସାଉଦି ନିୟମ ଏବଂ ଆଚରଣ", ml: "സൗദി നിയമങ്ങളും പെരുമാറ്റവും", pa: "ਸਾਊਦੀ ਨਿਯਮ ਅਤੇ ਆਚਰਣ" },
    subtitle: { en: "Essential guidelines for a safe pilgrimage", ar: "إرشادات أساسية لحج آمن", ur: "محفوظ حج کے لیے ضروری رہنما اصول", hi: "सुरक्षित तीर्थयात्रा के लिए आवश्यक दिशानिर्देश", ta: "பாதுகாப்பான யாத்திரைக்கான அத்தியாவசிய வழிகாட்டுதல்கள்", te: "సురక్షిత తీర్థయాత్ర కోసం అవసరమైన మార్గదర్శకాలు", mr: "सुरक्षित तीर्थयात्रेसाठी आवश्यक मार्गदर्शक तत्त्वे", bn: "নিরাপদ তীর্থযাত্রার জন্য প্রয়োজনীয় নির্দেশিকা", or: "ନିରାପଦ ତୀର୍ଥଯାତ୍ରା ପାଇଁ ଆବଶ୍ୟକ ନିର୍ଦ୍ଦେଶିକା", ml: "സുരക്ഷിതമായ തീർത്ഥാടനത്തിനുള്ള അത്യാവശ്യ മാർഗ്ഗനിർദ്ദേശങ്ങൾ", pa: "ਸੁਰੱਖਿਅਤ ਤੀਰਥ ਯਾਤਰਾ ਲਈ ਜ਼ਰੂਰੀ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼" },
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", ta: "பின்", te: "వెనుకకు", mr: "मागे", bn: "পিছনে", or: "ପଛକୁ", ml: "പിന്നിലേക്ക്", pa: "ਵਾਪਸ" },
    confirm: { en: "I have read and understood these rules", ar: "لقد قرأت وفهمت هذه القواعد", ur: "میں نے یہ قواعد پڑھ لیے اور سمجھ لیے ہیں", hi: "मैंने ये नियम पढ़ और समझ लिए हैं", ta: "இந்த விதிகளைப் படித்து புரிந்து கொண்டேன்", te: "ఈ నియమాలను నేను చదివి అర్థం చేసుకున్నాను", mr: "मी हे नियम वाचले आणि समजले", bn: "আমি এই নিয়মগুলো পড়েছি এবং বুঝেছি", or: "ମୁଁ ଏହି ନିୟମଗୁଡ଼ିକୁ ପଢ଼ିଛି ଏବଂ ବୁଝିଛି", ml: "ഈ നിയമങ്ങൾ വായിച്ച് മനസ്സിലാക്കി", pa: "ਮੈਂ ਇਹ ਨਿਯਮ ਪੜ੍ਹੇ ਅਤੇ ਸਮਝੇ ਹਨ" },
    confirmed: { en: "Rules Understood", ar: "تم فهم القواعد", ur: "قواعد سمجھ گئے", hi: "नियम समझ गए", ta: "விதிகள் புரிந்தன", te: "నియమాలు అర్థమయ్యాయి", mr: "नियम समजले", bn: "নিয়ম বোঝা হয়েছে", or: "ନିୟମ ବୁଝାଗଲା", ml: "നിയമങ്ങൾ മനസ്സിലായി", pa: "ਨਿਯਮ ਸਮਝ ਆ ਗਏ" },
    readAll: { en: "Please read all sections first", ar: "يرجى قراءة جميع الأقسام أولاً", ur: "پہلے تمام سیکشنز پڑھیں", hi: "पहले सभी अनुभाग पढ़ें", ta: "முதலில் அனைத்து பிரிவுகளையும் படிக்கவும்", te: "దయచేసి ముందుగా అన్ని విభాగాలను చదవండి", mr: "कृपया आधी सर्व विभाग वाचा", bn: "অনুগ্রহ করে আগে সব বিভাগ পড়ুন", or: "ଦୟାକରି ପ୍ରଥମେ ସମସ୍ତ ବିଭାଗ ପଢ଼ନ୍ତୁ", ml: "ദയവായി ആദ്യം എല്ലാ വിഭാഗങ്ങളും വായിക്കുക", pa: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਸਾਰੇ ਭਾਗ ਪੜ੍ਹੋ" },
  };

  return (
    <>
      <SEO title="Saudi Rules & Conduct Briefing" description="Important rules and conduct guidance for Saudi Arabia — pilgrim safety, public behavior, and legal essentials." path="/rules" type="article" jsonLd={{"@context":"https://schema.org","@type":"Article","headline":"Saudi Rules & Conduct Briefing","description":"Important rules and conduct guidance for Saudi Arabia — pilgrim safety, public behavior, and legal essentials.","url":"https://hajjcare.in/rules"}} />
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
          <p className="text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{readSections.length} / {RULES_SECTIONS.length}</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-3">
          {RULES_SECTIONS.map((section) => {
            const isRead = readSections.includes(section.id);
            const IconComponent = iconMap[section.icon] || BookOpen;

            return (
              <Card
                key={section.id}
                className={`border-2 transition-all cursor-pointer hover:border-primary/50 ${
                  isRead ? "border-status-safe/30 bg-status-safe/5" : "border-border"
                }`}
                onClick={() => navigate(`/rules/${section.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-soft border-2 ${
                    isRead ? "bg-status-safe text-white border-status-safe/30" : "bg-primary/10 text-primary border-primary/20"
                  }`}>
                    {isRead ? <Check className="w-7 h-7 sm:w-8 sm:h-8" /> : <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${isRead ? "text-status-safe" : "text-foreground"}`}>
                      {section.title[language] || section.title.en}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {section.description[language] || section.description.en}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isRead ? "text-status-safe" : "text-muted-foreground"}`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Confirmation Section */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container max-w-lg mx-auto">
            {confirmed ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-status-safe/10 rounded-xl border border-status-safe/30">
                <Check className="w-5 h-5 text-status-safe" />
                <span className="font-medium text-status-safe">{labels.confirmed[language] || labels.confirmed.en}</span>
              </div>
            ) : allRead ? (
              <Button className="w-full h-12 text-base" onClick={handleConfirm}>
                <Check className="w-5 h-5 mr-2" />
                {labels.confirm[language] || labels.confirm.en}
              </Button>
            ) : (
              <div className="text-center text-muted-foreground py-2">
                {labels.readAll[language] || labels.readAll.en}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  </>

  );
};

export default RulesBriefingPage;
