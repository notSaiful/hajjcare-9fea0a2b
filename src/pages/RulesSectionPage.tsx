import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Users, Shield, Ban, Camera, Heart, BookOpen } from "lucide-react";
import { getRulesSectionById, getNextRulesSection, getPreviousRulesSection, RULES_SECTIONS } from "@/data/saudiRulesContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Shield,
  Ban,
  Camera,
  Heart,
  BookOpen,
};

const RulesSectionPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const section = sectionId ? getRulesSectionById(sectionId) : undefined;
  const nextSection = sectionId ? getNextRulesSection(sectionId) : undefined;
  const prevSection = sectionId ? getPreviousRulesSection(sectionId) : undefined;

  // Mark as read when viewing
  useEffect(() => {
    if (section) {
      const saved = localStorage.getItem("hajj-rules-read");
      const readSections: string[] = saved ? JSON.parse(saved) : [];
      if (!readSections.includes(section.id)) {
        readSections.push(section.id);
        localStorage.setItem("hajj-rules-read", JSON.stringify(readSections));
      }
    }
  }, [section]);

  if (!section) {
    return (
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <SimpleHeader />
        <main className="container max-w-lg mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">Section not found</p>
          <Link to="/rules">
            <Button variant="outline" className="mt-4 w-full">Back to Rules</Button>
          </Link>
        </main>
      </div>
    );
  }

  const IconComponent = iconMap[section.icon] || BookOpen;

  const labels = {
    back: { en: "Back to Rules", ar: "العودة للقواعد", ur: "قواعد پر واپس", hi: "नियमों पर वापस", tr: "Kurallara Dön", ru: "Назад к правилам" },
    stepOf: { en: `Section ${section.order} of ${RULES_SECTIONS.length}`, ar: `القسم ${section.order} من ${RULES_SECTIONS.length}`, ur: `سیکشن ${section.order} از ${RULES_SECTIONS.length}`, hi: `अनुभाग ${section.order} में से ${RULES_SECTIONS.length}`, tr: `Bölüm ${section.order} / ${RULES_SECTIONS.length}`, ru: `Раздел ${section.order} из ${RULES_SECTIONS.length}` },
    complete: { en: "Complete", ar: "إكمال", ur: "مکمل", hi: "पूर्ण", tr: "Tamamla", ru: "Завершить" },
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Back Button */}
        <Link to="/rules">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {labels.stepOf[language] || labels.stepOf.en}
          </p>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{section.title[language] || section.title.en}</h1>
              <p className="text-muted-foreground mt-1">{section.description[language] || section.description.en}</p>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <Card className="border-2">
          <CardContent className="p-4 space-y-4">
            {section.rules.map((rule, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-foreground text-base leading-relaxed">
                  {rule.text[language] || rule.text.en}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container max-w-lg mx-auto flex gap-3">
            {prevSection ? (
              <Button variant="outline" className="flex-1" onClick={() => navigate(`/rules/${prevSection.id}`)}>
                {isRTL ? <ArrowRight className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                <span className="truncate">{prevSection.title[language] || prevSection.title.en}</span>
              </Button>
            ) : (
              <div className="flex-1" />
            )}
            {nextSection ? (
              <Button className="flex-1" onClick={() => navigate(`/rules/${nextSection.id}`)}>
                <span className="truncate">{nextSection.title[language] || nextSection.title.en}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            ) : (
              <Link to="/rules" className="flex-1">
                <Button className="w-full bg-status-safe hover:bg-status-safe/90">
                  <Check className="w-5 h-5 mr-2" />
                  {labels.complete[language] || labels.complete.en}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RulesSectionPage;
