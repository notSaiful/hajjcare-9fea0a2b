import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ArrowLeft, ChevronRight, Users, Shield, Ban, Camera, Heart, BookOpen } from "lucide-react";
import { RULES_SECTIONS } from "@/data/saudiRulesContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Shield,
  Ban,
  Camera,
  Heart,
  BookOpen,
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
    title: { en: "Saudi Rules & Conduct", ar: "قواعد السلوك السعودية", ur: "سعودی قواعد و آداب", hi: "सऊदी नियम और आचरण", tr: "Suudi Kuralları ve Davranış", ru: "Правила Саудовской Аравии" },
    subtitle: { en: "Essential guidelines for a safe pilgrimage", ar: "إرشادات أساسية لحج آمن", ur: "محفوظ حج کے لیے ضروری رہنما اصول", hi: "सुरक्षित तीर्थयात्रा के लिए आवश्यक दिशानिर्देश", tr: "Güvenli hac için temel yönergeler", ru: "Основные рекомендации для безопасного паломничества" },
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", tr: "Geri", ru: "Назад" },
    confirm: { en: "I have read and understood these rules", ar: "لقد قرأت وفهمت هذه القواعد", ur: "میں نے یہ قواعد پڑھ لیے اور سمجھ لیے ہیں", hi: "मैंने ये नियम पढ़ और समझ लिए हैं", tr: "Bu kuralları okudum ve anladım", ru: "Я прочитал и понял эти правила" },
    confirmed: { en: "Rules Understood", ar: "تم فهم القواعد", ur: "قواعد سمجھ گئے", hi: "नियम समझ गए", tr: "Kurallar Anlaşıldı", ru: "Правила поняты" },
    readAll: { en: "Please read all sections first", ar: "يرجى قراءة جميع الأقسام أولاً", ur: "پہلے تمام سیکشنز پڑھیں", hi: "पहले सभी अनुभाग पढ़ें", tr: "Önce tüm bölümleri okuyun", ru: "Сначала прочитайте все разделы" },
  };

  return (
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
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                    isRead ? "bg-status-safe text-white" : "bg-primary/10 text-primary"
                  }`}>
                    {isRead ? <Check className="w-6 h-6" /> : <IconComponent className="w-6 h-6" />}
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
  );
};

export default RulesBriefingPage;
