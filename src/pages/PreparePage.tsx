import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { MANASIK_RITUALS } from "@/data/manasikContent";

const PreparePage = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Load completed steps from localStorage
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    const saved = localStorage.getItem("hajj-completed-steps");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("hajj-completed-steps", JSON.stringify(completedSteps));
  }, [completedSteps]);

  const isStepUnlocked = (order: number) => {
    if (order === 1) return true;
    const previousRitual = MANASIK_RITUALS.find(r => r.order === order - 1);
    return previousRitual ? completedSteps.includes(previousRitual.id) : false;
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const completedCount = completedSteps.length;
  const progress = Math.round((completedCount / MANASIK_RITUALS.length) * 100);

  const labels = {
    title: { en: "Manasik Preparation", ar: "تحضير المناسك", ur: "مناسک کی تیاری", hi: "मनासिक तैयारी", tr: "Menasik Hazırlığı", ru: "Подготовка Манасик" },
    subtitle: { en: "Step-by-step Hajj ritual guidance", ar: "إرشادات مناسك الحج خطوة بخطوة", ur: "قدم بہ قدم حج کے مناسک کی رہنمائی", hi: "कदम-दर-कदम हज अनुष्ठान मार्गदर्शन", tr: "Adım adım hac menasik rehberi", ru: "Пошаговое руководство по ритуалам хаджа" },
    complete: { en: "You are prepared for Hajj", ar: "أنت مستعد للحج", ur: "آپ حج کے لیے تیار ہیں", hi: "आप हज के लिए तैयार हैं", tr: "Hacca hazırsınız", ru: "Вы готовы к хаджу" },
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", tr: "Geri", ru: "Назад" },
    locked: { en: "Complete previous step first", ar: "أكمل الخطوة السابقة أولاً", ur: "پہلے پچھلا مرحلہ مکمل کریں", hi: "पहले पिछला चरण पूरा करें", tr: "Önce önceki adımı tamamlayın", ru: "Сначала завершите предыдущий шаг" },
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
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
            <span className="text-muted-foreground">{completedCount} / {MANASIK_RITUALS.length}</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {progress === 100 && (
          <div className="p-4 bg-status-safe/10 border border-status-safe/30 rounded-xl text-center">
            <Check className="w-8 h-8 text-status-safe mx-auto mb-2" />
            <p className="text-status-safe font-semibold">{labels.complete[language] || labels.complete.en}</p>
          </div>
        )}

        {/* Ritual List */}
        <div className="space-y-3">
          {MANASIK_RITUALS.map((ritual) => {
            const isCompleted = completedSteps.includes(ritual.id);
            const isUnlocked = isStepUnlocked(ritual.order);

            return (
              <Card
                key={ritual.id}
                className={`border-2 transition-all cursor-pointer ${
                  isCompleted ? "border-status-safe/30 bg-status-safe/5" :
                  isUnlocked ? "border-border hover:border-primary/50" : "border-muted bg-muted/30 opacity-60"
                }`}
                onClick={() => isUnlocked && navigate(`/prepare/${ritual.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? "bg-status-safe text-white" :
                    isUnlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> :
                     !isUnlocked ? <Lock className="w-4 h-4" /> :
                     <span className="font-semibold">{ritual.order}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${isCompleted ? "text-status-safe" : "text-foreground"}`}>
                      {ritual.title[language] || ritual.title.en}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {!isUnlocked ? (labels.locked[language] || labels.locked.en) : (ritual.description[language] || ritual.description.en)}
                    </p>
                  </div>
                  {isUnlocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex-shrink-0 ${isCompleted ? "text-status-safe" : ""}`}
                      onClick={(e) => toggleComplete(ritual.id, e)}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default PreparePage;