import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Heart, Shield, Volume2, BookOpen, Check } from "lucide-react";
import { MANASIK_RITUALS, getRitualById, getNextRitual, getPreviousRitual } from "@/data/manasikContent";
import { useProgression } from "@/hooks/useProgression";
import QurbaniStatusTracker from "@/components/QurbaniStatusTracker";

const RitualDetailPage = () => {
  const { ritualId } = useParams<{ ritualId: string }>();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const ritual = ritualId ? getRitualById(ritualId) : undefined;
  const nextRitual = ritualId ? getNextRitual(ritualId) : undefined;
  const prevRitual = ritualId ? getPreviousRitual(ritualId) : undefined;

  const { isCompleted, markComplete } = useProgression({
    module: "hajj",
    items: MANASIK_RITUALS,
  });

  // Auto-mark as viewed/read when page loads (like Rules does)
  useEffect(() => {
    if (ritual && ritualId) {
      markComplete(ritualId);
    }
  }, [ritual, ritualId, markComplete]);

  const handleNext = () => {
    if (nextRitual) {
      navigate(`/prepare/${nextRitual.id}`);
    } else {
      navigate("/prepare");
    }
  };

  const handlePrev = () => {
    if (prevRitual) {
      navigate(`/prepare/${prevRitual.id}`);
    }
  };

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

  const completed = ritualId ? isCompleted(ritualId) : false;
  const totalSteps = MANASIK_RITUALS.length;

  const sectionTitles = {
    whatItIs: { en: "What This Ritual Is", ar: "ما هذا المنسك", ur: "یہ منسک کیا ہے", hi: "यह अनुष्ठान क्या है", ta: "இந்த சடங்கு என்ன", te: "ఈ ఆచారం ఏమిటి", mr: "हा विधी काय आहे", bn: "এই আচার কী", or: "ଏହି ଅନୁଷ୍ଠାନ କ'ଣ", ml: "ഈ കർമ്മം എന്താണ്", pa: "ਇਹ ਰੀਤੀ ਕੀ ਹੈ" },
    whatToDo: { en: "What To Do", ar: "ما يجب فعله", ur: "کیا کرنا ہے", hi: "क्या करें", ta: "என்ன செய்ய வேண்டும்", te: "ఏమి చేయాలి", mr: "काय करावे", bn: "কী করতে হবে", or: "କ'ଣ କରିବେ", ml: "എന്ത് ചെയ്യണം", pa: "ਕੀ ਕਰਨਾ ਹੈ" },
    whatToAvoid: { en: "What To Avoid", ar: "ما يجب تجنبه", ur: "کس چیز سے بچیں", hi: "क्या न करें", ta: "தவிர்க்க வேண்டியவை", te: "ఏమి నివారించాలి", mr: "काय टाळावे", bn: "কী এড়ানো উচিত", or: "କ'ଣ ଏଡ଼ାଇବେ", ml: "ഒഴിവാക്കേണ്ടവ", pa: "ਕੀ ਬਚਣਾ ਹੈ" },
    duaGuidance: { en: "Du'a Guidance", ar: "إرشادات الدعاء", ur: "دعا کی رہنمائی", hi: "दुआ मार्गदर्शन", ta: "துஆ வழிகாட்டுதல்", te: "దుఆ మార్గదర్శకత్వం", mr: "दुआ मार्गदर्शन", bn: "দোয়া নির্দেশিকা", or: "ଦୁଆ ମାର୍ଗଦର୍ଶନ", ml: "ദുആ മാർഗ്ഗനിർദ്ദേശം", pa: "ਦੁਆ ਮਾਰਗਦਰਸ਼ਨ" },
    safety: { en: "Safety & Health", ar: "السلامة والصحة", ur: "حفاظت اور صحت", hi: "सुरक्षा और स्वास्थ्य", ta: "பாதுகாப்பு & ஆரோக்கியம்", te: "భద్రత & ఆరోగ్యం", mr: "सुरक्षा आणि आरोग्य", bn: "নিরাপত্তা ও স্বাস্থ্য", or: "ସୁରକ୍ଷା ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ", ml: "സുരക്ഷയും ആരോഗ്യവും", pa: "ਸੁਰੱਖਿਆ ਅਤੇ ਸਿਹਤ" },
    rulings: { en: "Important Rulings", ar: "أحكام مهمة", ur: "اہم احکام", hi: "महत्वपूर्ण नियम", ta: "முக்கிய தீர்ப்புகள்", te: "ముఖ్యమైన తీర్పులు", mr: "महत्त्वाचे नियम", bn: "গুরুত্বপূর্ণ রায়", or: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ନିୟମ", ml: "പ്രധാന വിധികൾ", pa: "ਮਹੱਤਵਪੂਰਨ ਫੈਸਲੇ" },
    hadith: { en: "Relevant Hadith", ar: "الحديث", ur: "متعلقہ حدیث", hi: "प्रासंगिक हदीस", ta: "தொடர்புடைய ஹதீஸ்", te: "సంబంధిత హదీథ్", mr: "संबंधित हदीस", bn: "প্রাসঙ্গিক হাদিস", or: "ସମ୍ପର୍କିତ ହାଦିସ", ml: "ബന്ധപ്പെട്ട ഹദീസ്", pa: "ਸੰਬੰਧਿਤ ਹਦੀਸ" },
  };

  const labels = {
    back: { en: "Back to Preparation", ar: "العودة للتحضير", ur: "تیاری پر واپس", hi: "तैयारी पर वापस", ta: "தயாரிப்புக்கு திரும்பு", te: "తయారీకి తిరిగి", mr: "तयारीकडे परत", bn: "প্রস্তুতিতে ফিরে যান", or: "ପ୍ରସ୍ତୁତିକୁ ଫେରନ୍ତୁ", ml: "തയ്യാറെടുപ്പിലേക്ക് മടങ്ങുക", pa: "ਤਿਆਰੀ ਤੇ ਵਾਪਸ" },
    stepOf: { en: `Step ${ritual.order} of ${totalSteps}`, ar: `الخطوة ${ritual.order} من ${totalSteps}`, ur: `مرحلہ ${ritual.order} از ${totalSteps}`, hi: `चरण ${ritual.order} में से ${totalSteps}`, ta: `படி ${ritual.order} / ${totalSteps}`, te: `దశ ${ritual.order} / ${totalSteps}`, mr: `चरण ${ritual.order} / ${totalSteps}`, bn: `ধাপ ${ritual.order} / ${totalSteps}`, or: `ପଦକ୍ଷେପ ${ritual.order} / ${totalSteps}`, ml: `ഘട്ടം ${ritual.order} / ${totalSteps}`, pa: `ਕਦਮ ${ritual.order} / ${totalSteps}` },
    complete: { en: "Complete", ar: "مكتمل", ur: "مکمل", hi: "पूर्ण", ta: "முடிந்தது", te: "పూర్తయింది", mr: "पूर्ण", bn: "সম্পূর্ণ", or: "ସମ୍ପୂର୍ଣ୍ଣ", ml: "പൂർത്തിയായി", pa: "ਮੁਕੰਮਲ" },
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Back Button */}
        <Link to="/prepare">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {labels.stepOf[language] || labels.stepOf.en}
          </p>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              completed ? "bg-status-safe text-white" : "bg-primary text-primary-foreground"
            }`}>
              {completed ? <Check className="w-5 h-5" /> : ritual.order}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{ritual.title[language] || ritual.title.en}</h1>
              <p className="text-muted-foreground">{ritual.description[language] || ritual.description.en}</p>
            </div>
          </div>
        </div>

        {/* What This Ritual Is */}
        <Card className={`border-primary/20 bg-primary/5 ${ritualId?.includes('tawaf') ? 'sacred-glow-card' : ''}`}>
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {sectionTitles.whatItIs[language] || sectionTitles.whatItIs.en}
            </h2>
            <p className="text-foreground leading-relaxed">
              {ritual.whatItIs[language] || ritual.whatItIs.en}
            </p>
          </CardContent>
        </Card>

        {/* Qurbani Status Tracker - Only show on qurbani-halq page */}
        {ritualId === "qurbani-halq" && (
          <QurbaniStatusTracker />
        )}

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

        {/* Du'a Guidance */}
        <Card className="border-secondary/30 bg-secondary/10">
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              {sectionTitles.duaGuidance[language] || sectionTitles.duaGuidance.en}
            </h2>
            <p className="text-foreground leading-relaxed">
              {ritual.duaGuidance[language] || ritual.duaGuidance.en}
            </p>
          </CardContent>
        </Card>

        {/* Hadith if exists */}
        {ritual.hadith && (
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-muted-foreground" />
                {sectionTitles.hadith[language] || sectionTitles.hadith.en}
              </h2>
              <p className="text-foreground leading-relaxed italic">
                {ritual.hadith.text[language] || ritual.hadith.text.en}
              </p>
              <p className="text-xs text-muted-foreground">— {ritual.hadith.source}</p>
            </CardContent>
          </Card>
        )}

        {/* Important Rulings if exists */}
        {ritual.importantRulings && ritual.importantRulings.length > 0 && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="font-semibold text-lg">
                {sectionTitles.rulings[language] || sectionTitles.rulings.en}
              </h2>
              <ul className="space-y-2">
                {ritual.importantRulings.map((ruling, idx) => (
                  <li key={idx} className="flex gap-2 text-foreground">
                    <span className="text-primary">•</span>
                    {ruling.text[language] || ruling.text.en}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

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
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 safe-area-bottom">
          <div className="container max-w-lg mx-auto flex gap-3">
            {prevRitual ? (
              <Button variant="outline" className="flex-1" onClick={handlePrev}>
                {isRTL ? <ArrowRight className="w-4 h-4 mr-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
                <span className="truncate">{prevRitual.title[language] || prevRitual.title.en}</span>
              </Button>
            ) : (
              <div className="flex-1" />
            )}
            {nextRitual ? (
              <Button className="flex-1" onClick={handleNext}>
                <span className="truncate">{nextRitual.title[language] || nextRitual.title.en}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            ) : (
              <Link to="/prepare" className="flex-1">
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

export default RitualDetailPage;
