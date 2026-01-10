import { useParams, Link, useNavigate } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Heart, Shield, Volume2 } from "lucide-react";
import { getRitualById, getNextRitual, getPreviousRitual } from "@/data/manasikContent";

const RitualDetailPage = () => {
  const { ritualId } = useParams<{ ritualId: string }>();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const ritual = ritualId ? getRitualById(ritualId) : undefined;
  const nextRitual = ritualId ? getNextRitual(ritualId) : undefined;
  const prevRitual = ritualId ? getPreviousRitual(ritualId) : undefined;

  if (!ritual) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleHeader />
        <main className="container max-w-lg mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">Ritual not found</p>
          <Link to="/prepare">
            <Button variant="outline" className="mt-4 w-full">Back to Preparation</Button>
          </Link>
        </main>
      </div>
    );
  }

  const sectionTitles = {
    whatItIs: { en: "What This Ritual Is", ar: "ما هذا المنسك", ur: "یہ منسک کیا ہے", hi: "यह अनुष्ठान क्या है", tr: "Bu İbadet Nedir", ru: "Что это за ритуал" },
    whatToDo: { en: "What To Do", ar: "ما يجب فعله", ur: "کیا کرنا ہے", hi: "क्या करें", tr: "Ne Yapmalı", ru: "Что делать" },
    whatToAvoid: { en: "What To Avoid", ar: "ما يجب تجنبه", ur: "کس چیز سے بچیں", hi: "क्या न करें", tr: "Nelerden Kaçınmalı", ru: "Чего избегать" },
    duaGuidance: { en: "Du'a Guidance", ar: "إرشادات الدعاء", ur: "دعا کی رہنمائی", hi: "दुआ मार्गदर्शन", tr: "Dua Rehberi", ru: "Руководство по дуа" },
    safety: { en: "Safety & Health", ar: "السلامة والصحة", ur: "حفاظت اور صحت", hi: "सुरक्षा और स्वास्थ्य", tr: "Güvenlik ve Sağlık", ru: "Безопасность и здоровье" },
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Back Button */}
        <Link to="/prepare">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {language === "ar" ? "العودة للتحضير" : language === "ur" ? "تیاری پر واپس" : language === "hi" ? "तैयारी पर वापस" : "Back to Preparation"}
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {language === "ar" ? `الخطوة ${ritual.order} من 9` : language === "ur" ? `مرحلہ ${ritual.order} از 9` : language === "hi" ? `चरण ${ritual.order} में से 9` : `Step ${ritual.order} of 9`}
          </p>
          <h1 className="text-2xl font-bold text-foreground">{ritual.title[language] || ritual.title.en}</h1>
          <p className="text-muted-foreground">{ritual.description[language] || ritual.description.en}</p>
        </div>

        {/* What This Ritual Is */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              {sectionTitles.whatItIs[language] || sectionTitles.whatItIs.en}
            </h2>
            <p className="text-foreground leading-relaxed">
              {ritual.whatItIs[language] || ritual.whatItIs.en}
            </p>
          </CardContent>
        </Card>

        {/* What To Do */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-status-safe" />
              {sectionTitles.whatToDo[language] || sectionTitles.whatToDo.en}
            </h2>
            <ol className="space-y-4">
              {ritual.steps.map((step) => (
                <li key={step.step} className="flex gap-3 sm:gap-4">
                  <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm sm:text-base font-semibold shadow-soft border-2 border-primary/20">
                    {step.step}
                  </span>
                  <p className="text-foreground pt-2 sm:pt-3">{step.text[language] || step.text.en}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* What To Avoid */}
        <Card className="border-status-emergency/20 bg-status-emergency/5">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-status-emergency" />
              {sectionTitles.whatToAvoid[language] || sectionTitles.whatToAvoid.en}
            </h2>
            <ul className="space-y-2">
              {ritual.mistakes.map((mistake, idx) => (
                <li key={idx} className="flex gap-2 text-foreground">
                  <span className="text-status-emergency">•</span>
                  {mistake.text[language] || mistake.text.en}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Du'a Guidance */}
        <Card className="border-secondary/30 bg-secondary/10">
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-secondary-foreground" />
              {sectionTitles.duaGuidance[language] || sectionTitles.duaGuidance.en}
            </h2>
            <p className="text-foreground leading-relaxed">
              {ritual.duaGuidance[language] || ritual.duaGuidance.en}
            </p>
          </CardContent>
        </Card>

        {/* Safety */}
        <Card className="border-status-assistance/20 bg-status-assistance/5">
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-status-assistance" />
              {sectionTitles.safety[language] || sectionTitles.safety.en}
            </h2>
            <ul className="space-y-2">
              {ritual.safetyTips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-foreground">
                  <span className="text-status-assistance">•</span>
                  {tip.text[language] || tip.text.en}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container max-w-lg mx-auto flex gap-3">
            {prevRitual ? (
              <Button variant="outline" className="flex-1" onClick={() => navigate(`/prepare/${prevRitual.id}`)}>
                {isRTL ? <ArrowRight className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                {prevRitual.title[language] || prevRitual.title.en}
              </Button>
            ) : (
              <div className="flex-1" />
            )}
            {nextRitual ? (
              <Button className="flex-1" onClick={() => navigate(`/prepare/${nextRitual.id}`)}>
                {nextRitual.title[language] || nextRitual.title.en}
                {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            ) : (
              <Link to="/prepare" className="flex-1">
                <Button className="w-full bg-status-safe hover:bg-status-safe/90">
                  {language === "ar" ? "مكتمل" : language === "ur" ? "مکمل" : language === "hi" ? "पूर्ण" : "Complete"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RitualDetailPage;
