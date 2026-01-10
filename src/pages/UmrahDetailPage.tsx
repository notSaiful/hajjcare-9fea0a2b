import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Heart, Shield, BookOpen } from "lucide-react";
import { UMRAH_RITUALS } from "@/data/umrahContent";
import { useState, useEffect } from "react";
import { IconCircle } from "@/components/IconCircle";

const UmrahDetailPage = () => {
  const { ritualId } = useParams();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const ritual = UMRAH_RITUALS.find((r) => r.id === ritualId);

  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    const saved = localStorage.getItem("umrah-completed-steps");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("umrah-completed-steps", JSON.stringify(completedSteps));
  }, [completedSteps]);

  if (!ritual) {
    return (
      <MainLayout>
        <div className="container max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Ritual not found</p>
          <Link to="/umrah">
            <Button className="mt-4">Back to Umrah Guide</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const isCompleted = completedSteps.includes(ritual.id);

  const markComplete = () => {
    if (!isCompleted) {
      setCompletedSteps((prev) => [...prev, ritual.id]);
    }
    const nextRitual = UMRAH_RITUALS.find((r) => r.order === ritual.order + 1);
    if (nextRitual) {
      navigate(`/umrah/${nextRitual.id}`);
    } else {
      navigate("/umrah");
    }
  };

  const labels = {
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", tr: "Geri", ru: "Назад" },
    whatItIs: { en: "What This Is", ar: "ما هذا", ur: "یہ کیا ہے", hi: "यह क्या है", tr: "Bu Nedir", ru: "Что это" },
    whatToDo: { en: "What To Do", ar: "ماذا تفعل", ur: "کیا کرنا ہے", hi: "क्या करना है", tr: "Ne Yapılmalı", ru: "Что делать" },
    duaGuidance: { en: "Du'a Guidance", ar: "إرشاد الدعاء", ur: "دعا کی رہنمائی", hi: "दुआ मार्गदर्शन", tr: "Dua Rehberi", ru: "Руководство по дуа" },
    mistakes: { en: "What To Avoid", ar: "ما يجب تجنبه", ur: "کیا نہ کریں", hi: "क्या न करें", tr: "Nelerden Kaçınmalı", ru: "Чего избегать" },
    safety: { en: "Safety Tips", ar: "نصائح السلامة", ur: "حفاظتی نکات", hi: "सुरक्षा टिप्स", tr: "Güvenlik İpuçları", ru: "Советы по безопасности" },
    hadith: { en: "Relevant Hadith", ar: "الحديث", ur: "متعلقہ حدیث", hi: "प्रासंगिक हदीस", tr: "İlgili Hadis", ru: "Соответствующий хадис" },
    markComplete: { en: "Mark Complete & Continue", ar: "وضع علامة مكتمل", ur: "مکمل کریں", hi: "पूर्ण करें", tr: "Tamamla", ru: "Отметить выполненным" },
    rulings: { en: "Important Rulings", ar: "أحكام مهمة", ur: "اہم احکام", hi: "महत्वपूर्ण नियम", tr: "Önemli Hükümler", ru: "Важные решения" },
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Link to="/umrah">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10 sm:h-9 text-sm">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 sm:gap-4">
            <IconCircle 
              number={ritual.order} 
              isCompleted={isCompleted} 
              size="md"
            />
            <h1 className="text-xl sm:text-2xl font-bold">{ritual.title[language] || ritual.title.en}</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">{ritual.description[language] || ritual.description.en}</p>
        </div>

        {/* What This Is */}
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {labels.whatItIs[language] || labels.whatItIs.en}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base leading-relaxed">{ritual.whatItIs[language] || ritual.whatItIs.en}</p>
          </CardContent>
        </Card>

        {/* What To Do */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">{labels.whatToDo[language] || labels.whatToDo.en}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ritual.steps.map((step) => (
              <div key={step.step} className="flex gap-3 sm:gap-4">
                <IconCircle number={step.step} size="sm" />
                <p className="text-sm sm:text-base pt-2 sm:pt-3">{step.text[language] || step.text.en}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Du'a Guidance */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              {labels.duaGuidance[language] || labels.duaGuidance.en}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base leading-relaxed">{ritual.duaGuidance[language] || ritual.duaGuidance.en}</p>
          </CardContent>
        </Card>

        {/* Hadith */}
        {ritual.hadith && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">{labels.hadith[language] || labels.hadith.en}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base italic">{ritual.hadith.text[language] || ritual.hadith.text.en}</p>
              <p className="text-xs text-muted-foreground mt-2">— {ritual.hadith.source}</p>
            </CardContent>
          </Card>
        )}

        {/* Important Rulings */}
        {ritual.importantRulings && ritual.importantRulings.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">{labels.rulings[language] || labels.rulings.en}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ritual.importantRulings.map((ruling, idx) => (
                <p key={idx} className="text-sm sm:text-base">• {ruling.text[language] || ruling.text.en}</p>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Safety Tips */}
        {ritual.safetyTips && ritual.safetyTips.length > 0 && (
          <Card className="border-status-safe/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-status-safe" />
                {labels.safety[language] || labels.safety.en}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ritual.safetyTips.map((tip, idx) => (
                <p key={idx} className="text-sm sm:text-base">• {tip.text[language] || tip.text.en}</p>
              ))}
            </CardContent>
          </Card>
        )}

        {/* What To Avoid */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              {labels.mistakes[language] || labels.mistakes.en}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ritual.mistakes.map((mistake, idx) => (
              <p key={idx} className="text-sm sm:text-base">• {mistake.text[language] || mistake.text.en}</p>
            ))}
          </CardContent>
        </Card>

        {/* Mark Complete Button */}
        <Button onClick={markComplete} className="w-full h-12 sm:h-14 text-base sm:text-lg" size="lg">
          {isCompleted ? <Check className="w-5 h-5 mr-2" /> : null}
          {labels.markComplete[language] || labels.markComplete.en}
        </Button>
      </div>
    </MainLayout>
  );
};

export default UmrahDetailPage;
