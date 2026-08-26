import React, { useState, useMemo } from "react";
import { SEO } from "@/components/SEO";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconCircle } from "@/components/IconCircle";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Heart, TrendingUp, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { dailyPrompts, postHajjSections, pageLabels, DailyPrompt } from "@/data/postHajjContent";

const iconMap: Record<string, React.ElementType> = {
  Calendar,
  Heart,
  TrendingUp,
};

export default function PostHajjGuidePage() {
  const { language, isRTL } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(1);

  const currentPrompt = useMemo(() => {
    return dailyPrompts.find((p) => p.day === selectedDay) || dailyPrompts[0];
  }, [selectedDay]);

  const fullTextForTTS = useMemo(() => {
    if (!currentPrompt) return "";
    return `${currentPrompt.title[language]}. ${currentPrompt.reflection[language]}. ${pageLabels.todaysDua[language]}: ${currentPrompt.duaTranslation[language]}. ${pageLabels.todaysAction[language]}: ${currentPrompt.action[language]}`;
  }, [currentPrompt, language]);

  const navigateDay = (direction: "prev" | "next") => {
    if (direction === "prev" && selectedDay > 1) {
      setSelectedDay(selectedDay - 1);
    } else if (direction === "next" && selectedDay < 40) {
      setSelectedDay(selectedDay + 1);
    }
  };

  return (
    <MainLayout>
      <SEO title="Post-Hajj Guide" description="After-Hajj rituals, returning home, Zamzam handling, and integrating the Hajj experience into daily life." path="/post-hajj" type="article" jsonLd={{"@context":"https://schema.org","@type":"Article","headline":"Post-Hajj Guide","description":"After-Hajj rituals, returning home, Zamzam handling, and integrating the Hajj experience into daily life.","url":"https://hajjcare.in/post-hajj"}} />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {pageLabels.title[language]}
          </h1>
          <p className="text-muted-foreground text-sm">
            {pageLabels.subtitle[language]}
          </p>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Day Selector */}
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDay("prev")}
                  disabled={selectedDay === 1}
                >
                  {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary">{selectedDay}</span>
                  <p className="text-sm text-muted-foreground">{pageLabels.dayLabel[language]}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateDay("next")}
                  disabled={selectedDay === 40}
                >
                  {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>

              {/* Day Quick Select */}
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((day) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      size="sm"
                      className="min-w-[40px] flex-shrink-0"
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Daily Prompt Content */}
          {currentPrompt && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <IconCircle
                      icon={Calendar}
                      size="lg"
                      variant="primary"
                    />
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {currentPrompt.title[language]}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {pageLabels.dayLabel[language]} {currentPrompt.day}
                      </p>
                    </div>
                  </div>
                  <TextToSpeechButton text={fullTextForTTS} size="default" />
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Reflection */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    {pageLabels.reflection[language]}
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-base">
                    {currentPrompt.reflection[language]}
                  </p>
                </div>

                {/* Dua */}
                <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-primary">
                    {pageLabels.todaysDua[language]}
                  </h3>
                  <p className="text-xl text-center font-arabic text-foreground py-2" dir="rtl">
                    {currentPrompt.dua[language]}
                  </p>
                  <p className="text-sm text-muted-foreground text-center italic">
                    {currentPrompt.duaTranslation[language]}
                  </p>
                </div>

                {/* Action */}
                <div className="bg-accent/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {pageLabels.todaysAction[language]}
                  </h3>
                  <p className="text-foreground/90">
                    {currentPrompt.action[language]}
                  </p>
                </div>

                {/* Hadith (if available) */}
                {currentPrompt.hadith && (
                  <div className="border-l-4 border-primary/50 pl-4 py-2">
                    <h3 className="font-semibold text-primary mb-1">
                      {pageLabels.hadith[language]}
                    </h3>
                    <p className="text-sm text-muted-foreground italic">
                      {currentPrompt.hadith[language]}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Section Overview */}
          <div className="space-y-3">
            <div className="grid gap-3">
              {postHajjSections.map((section) => {
                const Icon = iconMap[section.icon] as LucideIcon;
                return (
                  <Card key={section.id} className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <IconCircle
                        icon={Icon || Calendar}
                        size="md"
                        variant="teal"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {section.title[language]}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {section.description[language]}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
