import { useParams, Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import type { LocalizedString } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Users, Shield, Ban, Camera, Heart, BookOpen, Shirt, Tent, Mountain, Moon, Target, Landmark, Building2, MapPin } from "lucide-react";
import { getRulesSectionById, getNextRulesSection, getPreviousRulesSection, RULES_SECTIONS } from "@/data/saudiRulesContent";
import { AccessibleRulesAudioPlayer, type AccessibleRuleAudioItem } from "@/components/AccessibleRulesAudioPlayer";
import { useRulesTranslations } from "@/hooks/useRulesTranslations";

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

const labels: Record<string, LocalizedString> = {
  back: { en: "Back to Rules", ar: "العودة للقواعد", ur: "قواعد پر واپس", hi: "नियमों पर वापस", ta: "விதிகளுக்கு திரும்பு", te: "నియమాలకు తిరిగి", mr: "नियमांकडे परत", bn: "নিয়মে ফিরে যান", or: "ନିୟମକୁ ଫେରନ୍ତୁ", ml: "നിയമങ്ങളിലേക്ക് മടങ്ങുക", pa: "ਨਿਯਮਾਂ ਤੇ ਵਾਪਸ" },
  complete: { en: "Complete", ar: "إكمال", ur: "مکمل", hi: "पूर्ण", ta: "முடிந்தது", te: "పూర్తయింది", mr: "पूर्ण", bn: "সম্পূর্ণ", or: "ସମ୍ପୂର୍ଣ୍ଣ", ml: "പൂർത്തിയായി", pa: "ਮੁਕੰਮਲ" },
  notFound: { en: "Section not found", ar: "القسم غير موجود", ur: "سیکشن نہیں ملا", hi: "अनुभाग नहीं मिला" },
  backToRules: { en: "Back to Rules", ar: "العودة للقواعد", ur: "قواعد پر واپس", hi: "नियमों पर वापस" },
  translationUnavailable: { en: "Some translations are currently unavailable. The original English text is shown for accuracy.", ar: "بعض الترجمات غير متاحة حالياً. يظهر النص الإنجليزي الأصلي لضمان الدقة.", ur: "کچھ تراجم فی الحال دستیاب نہیں ہیں۔ درستگی کے لیے اصل انگریزی متن دکھایا گیا ہے۔", hi: "कुछ अनुवाद अभी उपलब्ध नहीं हैं। सटीकता के लिए मूल अंग्रेज़ी पाठ दिखाया गया है।" },
};

const RulesSectionPage = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const section = sectionId ? getRulesSectionById(sectionId) : undefined;
  const nextSection = sectionId ? getNextRulesSection(sectionId) : undefined;
  const prevSection = sectionId ? getPreviousRulesSection(sectionId) : undefined;
  const [activeRule, setActiveRule] = useState<string | undefined>();

  const translationItems = useMemo(() => {
    const baseItems = [
      { key: "ui.back", text: labels.back.en, nativeText: labels.back[language] },
      { key: "ui.complete", text: labels.complete.en, nativeText: labels.complete[language] },
      { key: "ui.notFound", text: labels.notFound.en, nativeText: labels.notFound[language] },
      { key: "ui.backToRules", text: labels.backToRules.en, nativeText: labels.backToRules[language] },
      { key: "ui.translationUnavailable", text: labels.translationUnavailable.en, nativeText: labels.translationUnavailable[language] },
    ];
    if (!section) return baseItems;
    const stepOf: LocalizedString = {
      en: `Section ${section.order} of ${RULES_SECTIONS.length}`,
      ar: `القسم ${section.order} من ${RULES_SECTIONS.length}`,
      ur: `سیکشن ${section.order} از ${RULES_SECTIONS.length}`,
      hi: `अनुभाग ${section.order} में से ${RULES_SECTIONS.length}`,
      ta: `பகுதி ${section.order} / ${RULES_SECTIONS.length}`,
      te: `విభాగం ${section.order} / ${RULES_SECTIONS.length}`,
      mr: `विभाग ${section.order} / ${RULES_SECTIONS.length}`,
      bn: `বিভাগ ${section.order} / ${RULES_SECTIONS.length}`,
      or: `ବିଭାଗ ${section.order} / ${RULES_SECTIONS.length}`,
      ml: `വിഭാഗം ${section.order} / ${RULES_SECTIONS.length}`,
      pa: `ਭਾਗ ${section.order} / ${RULES_SECTIONS.length}`,
    };
    return [
      ...baseItems,
      { key: "ui.stepOf", text: stepOf.en, nativeText: stepOf[language] },
      { key: `section.${section.id}.title`, text: section.title.en, nativeText: section.title[language] },
      { key: `section.${section.id}.description`, text: section.description.en, nativeText: section.description[language] },
      ...section.rules.map((rule, index) => ({ key: `section.${section.id}.rule.${index}`, text: rule.text.en, nativeText: rule.text[language] })),
      ...(prevSection ? [{ key: `section.${prevSection.id}.title`, text: prevSection.title.en, nativeText: prevSection.title[language] }] : []),
      ...(nextSection ? [{ key: `section.${nextSection.id}.title`, text: nextSection.title.en, nativeText: nextSection.title[language] }] : []),
    ];
  }, [language, nextSection, prevSection, section]);
  const { text: translatedText, usedFallback } = useRulesTranslations(translationItems, language);
  const audioItems = useMemo<AccessibleRuleAudioItem[]>(() => {
    if (!section) return [];
    return [
      { id: `${section.id}.intro`, anchorId: `${section.id}-intro`, label: translatedText(`section.${section.id}.title`), text: `${translatedText(`section.${section.id}.title`)}. ${translatedText(`section.${section.id}.description`)}` },
      ...section.rules.map((rule, index) => ({
        id: `${section.id}.rule.${index}`,
        anchorId: `${section.id}-rule-${index}`,
        label: `${translatedText(`section.${section.id}.title`)} ${index + 1}`,
        text: translatedText(`section.${section.id}.rule.${index}`) || rule.text.en,
      })),
    ];
  }, [section, translatedText]);
  const handleAudioActive = useCallback((anchorId: string | undefined) => {
    setActiveRule(anchorId);
    if (anchorId) document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

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
          <p className="text-center text-muted-foreground">{translatedText("ui.notFound")}</p>
          <Link to="/rules">
            <Button variant="outline" className="mt-4 w-full">{translatedText("ui.backToRules")}</Button>
          </Link>
        </main>
      </div>
    );
  }

  const IconComponent = iconMap[section.icon] || BookOpen;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Back Button */}
        <Link to="/rules">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {translatedText("ui.back")}
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {translatedText("ui.stepOf")}
            </p>
          </div>
          {usedFallback && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">{translatedText("ui.translationUnavailable")}</p>}
          <AccessibleRulesAudioPlayer items={audioItems} language={language} onActiveChange={handleAudioActive} />

          {/* Section Image */}
          {section.image && (
            <div className="rounded-xl overflow-hidden border-2 border-border">
              <img 
                src={section.image} 
                alt={translatedText(`section.${section.id}.title`)}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{translatedText(`section.${section.id}.title`)}</h1>
              <p className="text-muted-foreground mt-1">{translatedText(`section.${section.id}.description`)}</p>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <Card className="border-2">
          <CardContent className="p-4 space-y-4">
            {section.rules.map((rule, idx) => (
              <div id={`${section.id}-rule-${idx}`} key={idx} aria-current={activeRule === `${section.id}-rule-${idx}` ? "step" : undefined} className={`flex gap-3 items-start rounded-xl p-2 transition-colors ${activeRule === `${section.id}-rule-${idx}` ? "bg-primary/10 ring-2 ring-primary/30" : ""}`}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-foreground text-base leading-relaxed">
                  {translatedText(`section.${section.id}.rule.${idx}`)}
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
                <span className="truncate">{translatedText(`section.${prevSection.id}.title`)}</span>
              </Button>
            ) : (
              <div className="flex-1" />
            )}
            {nextSection ? (
              <Button className="flex-1" onClick={() => navigate(`/rules/${nextSection.id}`)}>
                <span className="truncate">{translatedText(`section.${nextSection.id}.title`)}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            ) : (
              <Link to="/rules" className="flex-1">
                <Button className="w-full bg-status-safe hover:bg-status-safe/90">
                  <Check className="w-5 h-5 mr-2" />
                  {translatedText("ui.complete")}
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
