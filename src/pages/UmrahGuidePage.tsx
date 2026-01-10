import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, ChevronRight } from "lucide-react";
import { UMRAH_RITUALS } from "@/data/umrahContent";
import { useProgression } from "@/hooks/useProgression";

const UmrahGuidePage = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const {
    progress,
    completedCount,
    totalCount,
    isCompleted,
    isUnlocked,
    toggleComplete,
  } = useProgression({
    module: "umrah",
    items: UMRAH_RITUALS,
  });

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComplete(id);
  };

  const labels = {
    title: {
      en: "Umrah Guide",
      ar: "دليل العمرة",
      ur: "عمرہ گائیڈ",
      hi: "उमरा गाइड",
      tr: "Umre Rehberi",
      ru: "Руководство по умре",
    },
    subtitle: {
      en: "Step-by-step Umrah ritual guidance",
      ar: "إرشادات مناسك العمرة خطوة بخطوة",
      ur: "قدم بہ قدم عمرہ کے مناسک کی رہنمائی",
      hi: "कदम-दर-कदम उमरा अनुष्ठान मार्गदर्शन",
      tr: "Adım adım Umre ibadet rehberi",
      ru: "Пошаговое руководство по ритуалам умры",
    },
    complete: {
      en: "You have completed Umrah preparation",
      ar: "لقد أكملت تحضير العمرة",
      ur: "آپ نے عمرہ کی تیاری مکمل کر لی",
      hi: "आपने उमरा की तैयारी पूरी कर ली",
      tr: "Umre hazırlığını tamamladınız",
      ru: "Вы завершили подготовку к умре",
    },
    locked: {
      en: "Complete previous step first",
      ar: "أكمل الخطوة السابقة أولاً",
      ur: "پہلے پچھلا مرحلہ مکمل کریں",
      hi: "पहले पिछला चरण पूरा करें",
      tr: "Önce önceki adımı tamamlayın",
      ru: "Сначала завершите предыдущий шаг",
    },
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">
            {labels.title[language] || labels.title.en}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {labels.subtitle[language] || labels.subtitle.en}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">
              {completedCount} / {totalCount}
            </span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {progress === 100 && (
          <div className="p-3 sm:p-4 bg-status-safe/10 border border-status-safe/30 rounded-xl text-center">
            <Check className="w-6 h-6 sm:w-8 sm:h-8 text-status-safe mx-auto mb-2" />
            <p className="text-sm sm:text-base text-status-safe font-semibold">
              {labels.complete[language] || labels.complete.en}
            </p>
          </div>
        )}

        {/* Ritual List */}
        <div className="space-y-2.5 sm:space-y-3">
          {UMRAH_RITUALS.map((ritual) => {
            const completed = isCompleted(ritual.id);
            const unlocked = isUnlocked(ritual.order);

            return (
              <Card
                key={ritual.id}
                className={`border-2 transition-all cursor-pointer ${
                  completed
                    ? "border-status-safe/30 bg-status-safe/5"
                    : unlocked
                    ? "border-border hover:border-primary/50"
                    : "border-muted bg-muted/30 opacity-60"
                }`}
                onClick={() => unlocked && navigate(`/umrah/${ritual.id}`)}
              >
                <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${
                      completed
                        ? "bg-status-safe text-white"
                        : unlocked
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completed ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : !unlocked ? (
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <span className="font-semibold">{ritual.order}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm sm:text-base ${
                        completed ? "text-status-safe" : "text-foreground"
                      }`}
                    >
                      {ritual.title[language] || ritual.title.en}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {!unlocked
                        ? labels.locked[language] || labels.locked.en
                        : ritual.description[language] || ritual.description.en}
                    </p>
                  </div>
                  {unlocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 p-0 ${
                        completed ? "text-status-safe" : ""
                      }`}
                      onClick={(e) => handleToggle(ritual.id, e)}
                    >
                      {completed ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default UmrahGuidePage;
