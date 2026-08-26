import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Landmark } from "lucide-react";
import { MAKKAH_GUIDE_TOPICS } from "@/data/makkahGuideContent";
import { PageHeader } from "@/components/PageHeader";
import { IconCircle } from "@/components/IconCircle";

const MakkahGuidePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem("makkah-guide-completed");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("makkah-guide-completed", JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedTopics((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const completedCount = completedTopics.length;
  const progress = Math.round((completedCount / MAKKAH_GUIDE_TOPICS.length) * 100);

  const labels = {
    title: {
      en: "Makkah Etiquette Guide",
      ar: "دليل آداب مكة",
      ur: "مکہ آداب گائیڈ",
      hi: "मक्का शिष्टाचार गाइड",
      tr: "Mekke Adabı Rehberi",
      ru: "Руководство по этикету Мекки",
    },
    subtitle: {
      en: "Proper conduct in Masjid al-Haram and around the Kaaba",
      ar: "السلوك الصحيح في المسجد الحرام وحول الكعبة",
      ur: "مسجد الحرام اور کعبہ کے آس پاس کا صحیح طرز عمل",
      hi: "मस्जिद अल-हराम और काबा के आसपास उचित आचरण",
      tr: "Mescid-i Haram'da ve Kâbe çevresinde doğru davranış",
      ru: "Правильное поведение в Мечети аль-Харам и вокруг Каабы",
    },
    complete: {
      en: "You have reviewed all Makkah etiquette",
      ar: "لقد راجعت جميع آداب مكة",
      ur: "آپ نے مکہ کے تمام آداب کا جائزہ لے لیا",
      hi: "आपने सभी मक्का शिष्टाचार की समीक्षा कर ली",
      tr: "Tüm Mekke adabını gözden geçirdiniz",
      ru: "Вы просмотрели весь этикет Мекки",
    },
  };

  return (
    <MainLayout>
      <SEO title="Makkah Guide" description="Navigate Makkah with confidence: Haram zones, prayer times, building locator, transport, and key logistics for pilgrims." path="/makkah-guide" type="article" jsonLd={{"@context":"https://schema.org","@type":"Article","headline":"Makkah Guide","description":"Navigate Makkah with confidence: Haram zones, prayer times, building locator, transport, and key logistics for pilgrims.","url":"https://hajjcare.in/makkah-guide"}} />
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Consistent Page Header */}
        <PageHeader
          title={labels.title}
          subtitle={labels.subtitle}
          icon={Landmark}
          iconVariant="amber"
        />

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">
              {completedCount} / {MAKKAH_GUIDE_TOPICS.length}
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

        {/* Topic List */}
        <div className="space-y-2.5 sm:space-y-3">
          {MAKKAH_GUIDE_TOPICS.map((topic) => {
            const isCompleted = completedTopics.includes(topic.id);

            return (
              <Card
                key={topic.id}
                className={`border-2 transition-all cursor-pointer ${
                  isCompleted
                    ? "border-status-safe/30 bg-status-safe/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => navigate(`/makkah-guide/${topic.id}`)}
              >
                <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base ${
                      isCompleted
                        ? "bg-status-safe text-white"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span className="font-semibold">{topic.order}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold text-sm sm:text-base ${
                        isCompleted ? "text-status-safe" : "text-foreground"
                      }`}
                    >
                      {topic.title[language] || topic.title.en}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 p-0 ${
                      isCompleted ? "text-status-safe" : ""
                    }`}
                    onClick={(e) => toggleComplete(topic.id, e)}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default MakkahGuidePage;
