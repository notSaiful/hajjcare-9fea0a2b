import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Heart, BookOpen, Shield } from "lucide-react";
import { MADINAH_GUIDE_TOPICS } from "@/data/madinahGuideContent";
import { useState, useEffect } from "react";

const MadinahGuideDetailPage = () => {
  const { topicId } = useParams();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const topic = MADINAH_GUIDE_TOPICS.find((t) => t.id === topicId);

  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem("madinah-guide-completed");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("madinah-guide-completed", JSON.stringify(completedTopics));
  }, [completedTopics]);

  if (!topic) {
    return (
      <MainLayout>
        <div className="container max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Topic not found</p>
          <Link to="/madinah-guide">
            <Button className="mt-4">Back to Madinah Guide</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const isCompleted = completedTopics.includes(topic.id);

  const markComplete = () => {
    if (!isCompleted) {
      setCompletedTopics((prev) => [...prev, topic.id]);
    }
    const nextTopic = MADINAH_GUIDE_TOPICS.find((t) => t.order === topic.order + 1);
    if (nextTopic) {
      navigate(`/madinah-guide/${nextTopic.id}`);
    } else {
      navigate("/madinah-guide");
    }
  };

  const labels = {
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", tr: "Geri", ru: "Назад" },
    whatItIs: { en: "What This Is", ar: "ما هذا", ur: "یہ کیا ہے", hi: "यह क्या है", tr: "Bu Nedir", ru: "Что это" },
    whatToDo: { en: "What To Do", ar: "ماذا تفعل", ur: "کیا کرنا ہے", hi: "क्या करना है", tr: "Ne Yapılmalı", ru: "Что делать" },
    duaGuidance: { en: "Du'a Guidance", ar: "إرشاد الدعاء", ur: "دعا کی رہنمائی", hi: "दुआ मार्गदर्शन", tr: "Dua Rehberi", ru: "Руководство по дуа" },
    mistakes: { en: "What To Avoid", ar: "ما يجب تجنبه", ur: "کیا نہ کریں", hi: "क्या न करें", tr: "Nelerden Kaçınmalı", ru: "Чего избегать" },
    hadith: { en: "Relevant Hadith", ar: "الحديث", ur: "متعلقہ حدیث", hi: "प्रासंगिक हदीस", tr: "İlgili Hadis", ru: "Соответствующий хадис" },
    boundaries: { en: "Important Boundaries", ar: "حدود مهمة", ur: "اہم حدود", hi: "महत्वपूर्ण सीमाएं", tr: "Önemli Sınırlar", ru: "Важные границы" },
    markComplete: { en: "Mark Complete & Continue", ar: "وضع علامة مكتمل", ur: "مکمل کریں", hi: "पूर्ण करें", tr: "Tamamla", ru: "Отметить выполненным" },
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Link to="/madinah-guide">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10 sm:h-9 text-sm">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? "bg-status-safe" : "bg-primary"} text-white`}>
              {isCompleted ? <Check className="w-5 h-5" /> : <span className="font-bold">{topic.order}</span>}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">{topic.title[language] || topic.title.en}</h1>
          </div>
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
            <p className="text-sm sm:text-base leading-relaxed">{topic.whatItIs[language] || topic.whatItIs.en}</p>
          </CardContent>
        </Card>

        {/* What To Do */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">{labels.whatToDo[language] || labels.whatToDo.en}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topic.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                  {step.order}
                </div>
                <p className="text-sm sm:text-base pt-0.5">{step.instruction[language] || step.instruction.en}</p>
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
            <p className="text-sm sm:text-base leading-relaxed">{topic.duaGuidance[language] || topic.duaGuidance.en}</p>
          </CardContent>
        </Card>

        {/* Hadith */}
        {topic.hadith && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">{labels.hadith[language] || labels.hadith.en}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base italic">{topic.hadith.text[language] || topic.hadith.text.en}</p>
              <p className="text-xs text-muted-foreground mt-2">— {topic.hadith.source}</p>
            </CardContent>
          </Card>
        )}

        {/* Important Boundaries */}
        {topic.importantBoundaries && topic.importantBoundaries.length > 0 && (
          <Card className="border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-amber-600">
                <Shield className="w-5 h-5" />
                {labels.boundaries[language] || labels.boundaries.en}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topic.importantBoundaries.map((boundary, idx) => (
                <p key={idx} className="text-sm sm:text-base">• {boundary.text[language] || boundary.text.en}</p>
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
            {topic.mistakes.map((mistake, idx) => (
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

export default MadinahGuideDetailPage;
