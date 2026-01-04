import { useState } from "react";
import { Link } from "react-router-dom";
import { SimpleHeader } from "@/components/SimpleHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

interface ManasikStep {
  id: string;
  titleKey: string;
  descKey: string;
  complete: boolean;
}

const PreparePage = () => {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated, loading } = useAuth();

  const [steps, setSteps] = useState<ManasikStep[]>([
    { id: "ihram", titleKey: "Ihram", descKey: "ihramDesc", complete: false },
    { id: "tawaf", titleKey: "Tawaf", descKey: "tawafDesc", complete: false },
    { id: "sai", titleKey: "Sa'i", descKey: "saiDesc", complete: false },
    { id: "mina", titleKey: "Mina", descKey: "minaDesc", complete: false },
    { id: "arafat", titleKey: "Arafat", descKey: "arafatDesc", complete: false },
    { id: "muzdalifah", titleKey: "Muzdalifah", descKey: "muzdalifaDesc", complete: false },
    { id: "rami", titleKey: "Rami al-Jamarat", descKey: "ramiDesc", complete: false },
    { id: "farewell", titleKey: "Tawaf al-Wida", descKey: "farewellDesc", complete: false },
  ]);

  const stepDescriptions: Record<string, Record<string, string>> = {
    ihramDesc: {
      en: "Enter state of Ihram with proper intention and dress",
      ar: "الدخول في حالة الإحرام بالنية والملابس الصحيحة",
      hi: "उचित नीयत और पोशाक के साथ इहराम की स्थिति में प्रवेश करें",
    },
    tawafDesc: {
      en: "Circle the Kaaba seven times",
      ar: "الطواف حول الكعبة سبع مرات",
      hi: "काबा की सात बार परिक्रमा करें",
    },
    saiDesc: {
      en: "Walk between Safa and Marwa seven times",
      ar: "السعي بين الصفا والمروة سبع مرات",
      hi: "सफा और मरवा के बीच सात बार चलें",
    },
    minaDesc: {
      en: "Stay at Mina before Day of Arafat",
      ar: "الإقامة في منى قبل يوم عرفة",
      hi: "अरफात के दिन से पहले मीना में रहें",
    },
    arafatDesc: {
      en: "Stand at Arafat from noon to sunset",
      ar: "الوقوف بعرفة من الظهر إلى الغروب",
      hi: "दोपहर से सूर्यास्त तक अरफात में खड़े रहें",
    },
    muzdalifaDesc: {
      en: "Spend the night at Muzdalifah",
      ar: "المبيت في مزدلفة",
      hi: "मुज़दलिफ़ा में रात बिताएं",
    },
    ramiDesc: {
      en: "Stone the Jamarat pillars",
      ar: "رمي الجمرات",
      hi: "जमरात के स्तंभों पर पत्थर मारें",
    },
    farewellDesc: {
      en: "Perform farewell Tawaf before leaving Makkah",
      ar: "أداء طواف الوداع قبل مغادرة مكة",
      hi: "मक्का छोड़ने से पहले विदाई तवाफ करें",
    },
  };

  const toggleStep = (id: string) => {
    setSteps(prev => 
      prev.map(s => s.id === id ? { ...s, complete: !s.complete } : s)
    );
  };

  const completedCount = steps.filter(s => s.complete).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <SimpleHeader />

      <main className="container max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t("backToChat")}
          </Button>
        </Link>

        {/* Progress Header */}
        <div className="space-y-3">
          <h1 className="text-heading font-semibold">{t("preparationProgress")}</h1>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{completedCount} / {steps.length}</span>
              <span className="font-medium text-primary">{progress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {progress === 100 && (
            <div className="p-4 bg-status-safe-bg rounded-xl text-center">
              <Check className="w-8 h-8 text-status-safe mx-auto mb-2" />
              <p className="text-status-safe font-semibold text-lg">
                {language === "ar" ? "جاهز للحج" : 
                 language === "hi" ? "हज के लिए तैयार" :
                 "Hajj Readiness: Complete"}
              </p>
            </div>
          )}
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <Card 
              key={step.id}
              className={`border-2 transition-colors cursor-pointer ${
                step.complete 
                  ? "border-status-safe/30 bg-status-safe-bg/50" 
                  : "border-border bg-card"
              }`}
              onClick={() => toggleStep(step.id)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                  ${step.complete 
                    ? "bg-status-safe text-white" 
                    : "bg-muted text-muted-foreground"
                  }
                `}>
                  {step.complete ? (
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-lg ${
                    step.complete ? "text-status-safe" : "text-foreground"
                  }`}>
                    {step.titleKey}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stepDescriptions[step.descKey]?.[language] || 
                     stepDescriptions[step.descKey]?.en}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PreparePage;