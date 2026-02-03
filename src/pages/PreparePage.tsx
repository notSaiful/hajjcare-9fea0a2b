import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import { MANASIK_RITUALS } from "@/data/manasikContent";
import { useProgression } from "@/hooks/useProgression";
import HajjJourneyVisuals from "@/components/HajjJourneyVisuals";

const PreparePage = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const { 
    completedSteps, 
    progress, 
    completedCount, 
    totalCount, 
    isCompleted, 
    isUnlocked, 
    toggleComplete 
  } = useProgression({
    module: "hajj",
    items: MANASIK_RITUALS,
  });

  const labels = {
    title: { en: "Mental Preparation", ar: "التحضير الذهني", ur: "ذہنی تیاری", hi: "मानसिक तैयारी", ta: "மன தயாரிப்பு", te: "మానసిక సన్నాహం", mr: "मानसिक तयारी", bn: "মানসিক প্রস্তুতি", or: "ମାନସିକ ପ୍ରସ୍ତୁତି", ml: "മാനസിക തയ്യാറെടുപ്പ്", pa: "ਮਾਨਸਿਕ ਤਿਆਰੀ" },
    subtitle: { en: "Prepare your mind and spirit for the journey ahead", ar: "أعد عقلك وروحك للرحلة القادمة", ur: "آگے کے سفر کے لیے اپنے ذہن اور روح کو تیار کریں", hi: "आगे की यात्रा के लिए अपने मन और आत्मा को तैयार करें", ta: "வரும் பயணத்திற்கு உங்கள் மனதையும் ஆன்மாவையும் தயார் செய்யுங்கள்", te: "ముందున్న ప్రయాణానికి మీ మనసు మరియు ఆత్మను సిద్ధం చేసుకోండి", mr: "पुढच्या प्रवासासाठी आपले मन आणि आत्मा तयार करा", bn: "সামনের যাত্রার জন্য আপনার মন ও আত্মাকে প্রস্তুত করুন", or: "ଆଗାମୀ ଯାତ୍ରା ପାଇଁ ଆପଣଙ୍କ ମନ ଓ ଆତ୍ମାକୁ ପ୍ରସ୍ତୁତ କରନ୍ତୁ", ml: "വരാനിരിക്കുന്ന യാത്രയ്ക്കായി നിങ്ങളുടെ മനസ്സും ആത്മാവും തയ്യാറാക്കുക", pa: "ਆਉਣ ਵਾਲੀ ਯਾਤਰਾ ਲਈ ਆਪਣੇ ਮਨ ਅਤੇ ਆਤਮਾ ਨੂੰ ਤਿਆਰ ਕਰੋ" },
    complete: { en: "You are prepared for Hajj", ar: "أنت مستعد للحج", ur: "آپ حج کے لیے تیار ہیں", hi: "आप हज के लिए तैयार हैं", ta: "நீங்கள் ஹஜ்ஜுக்கு தயாராகிவிட்டீர்கள்", te: "మీరు హజ్ కోసం సిద్ధంగా ఉన్నారు", mr: "तुम्ही हजसाठी तयार आहात", bn: "আপনি হজের জন্য প্রস্তুত", or: "ଆପଣ ହଜ୍ଜ ପାଇଁ ପ୍ରସ୍ତୁତ", ml: "നിങ്ങൾ ഹജ്ജിന് തയ്യാറാണ്", pa: "ਤੁਸੀਂ ਹੱਜ ਲਈ ਤਿਆਰ ਹੋ" },
    back: { en: "Back", ar: "رجوع", ur: "واپس", hi: "वापस", ta: "பின்", te: "వెనుకకు", mr: "मागे", bn: "পিছনে", or: "ପଛକୁ", ml: "പിന്നിലേക്ക്", pa: "ਵਾਪਸ" },
    locked: { en: "Complete previous step first", ar: "أكمل الخطوة السابقة أولاً", ur: "پہلے پچھلا مرحلہ مکمل کریں", hi: "पहले पिछला चरण पूरा करें", ta: "முதலில் முந்தைய படியை முடிக்கவும்", te: "ముందుగా మునుపటి దశను పూర్తి చేయండి", mr: "आधी मागील पायरी पूर्ण करा", bn: "আগে আগের ধাপ সম্পূর্ণ করুন", or: "ପ୍ରଥମେ ପୂର୍ବ ପଦକ୍ଷେପ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ", ml: "ആദ്യം മുൻ ഘട്ടം പൂർത്തിയാക്കുക", pa: "ਪਹਿਲਾਂ ਪਿਛਲਾ ਕਦਮ ਪੂਰਾ ਕਰੋ" },
  };

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComplete(id);
  };

  return (
    <MainLayout showFooter={false}>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-24 space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10 sm:h-9 text-sm">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">{completedCount} / {totalCount}</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {progress === 100 && (
          <div className="p-3 sm:p-4 bg-status-safe/10 border border-status-safe/30 rounded-xl text-center">
            <Check className="w-6 h-6 sm:w-8 sm:h-8 text-status-safe mx-auto mb-2" />
            <p className="text-sm sm:text-base text-status-safe font-semibold">{labels.complete[language] || labels.complete.en}</p>
          </div>
        )}

        {/* Hajj Journey Visual Guide */}
        <HajjJourneyVisuals />

        {/* Ritual List */}
        <div className="space-y-2.5 sm:space-y-3">
          {MANASIK_RITUALS.map((ritual) => {
            const completed = isCompleted(ritual.id);
            const unlocked = isUnlocked(ritual.order);

            return (
              <Card
                key={ritual.id}
                className={`border-2 transition-all cursor-pointer ${
                  completed ? "border-status-safe/30 bg-status-safe/5" :
                  unlocked ? "border-border hover:border-primary/50" : "border-muted bg-muted/30 opacity-60"
                }`}
                onClick={() => unlocked && navigate(`/prepare/${ritual.id}`)}
              >
                <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-sm sm:text-base shadow-soft border-2 ${
                    completed ? "bg-status-safe text-white border-status-safe/30" :
                    unlocked ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-muted"
                  }`}>
                    {completed ? <Check className="w-6 h-6 sm:w-7 sm:h-7" /> :
                     !unlocked ? <Lock className="w-5 h-5 sm:w-6 sm:h-6" /> :
                     <span className="font-bold text-lg sm:text-xl">{ritual.order}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm sm:text-base ${completed ? "text-status-safe" : "text-foreground"}`}>
                      {ritual.title[language] || ritual.title.en}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {!unlocked ? (labels.locked[language] || labels.locked.en) : (ritual.description[language] || ritual.description.en)}
                    </p>
                  </div>
                  {unlocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 p-0 ${completed ? "text-status-safe" : ""}`}
                      onClick={(e) => handleToggle(ritual.id, e)}
                    >
                      {completed ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNavigation />
    </MainLayout>
  );
};

export default PreparePage;
