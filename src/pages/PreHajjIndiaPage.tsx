import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import MainLayout from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import IconCircle from "@/components/IconCircle";
import { PRE_HAJJ_SECTIONS } from "@/data/preHajjIndiaContent";
import { ChevronLeft, ChevronRight, Building2, Landmark, GraduationCap, UserCheck, Plane, ClipboardList } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Landmark,
  GraduationCap,
  UserCheck,
  Plane,
  ClipboardList,
};

const PreHajjIndiaPage = () => {
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const labels = {
    en: { title: "Pre-Hajj India", subtitle: "Essential information before your journey" },
    ar: { title: "ما قبل الحج - الهند", subtitle: "معلومات أساسية قبل رحلتك" },
    ur: { title: "حج سے پہلے - ہندوستان", subtitle: "آپ کے سفر سے پہلے ضروری معلومات" },
    hi: { title: "हज से पहले - भारत", subtitle: "आपकी यात्रा से पहले आवश्यक जानकारी" },
    ta: { title: "ஹஜ்ஜுக்கு முன் - இந்தியா", subtitle: "உங்கள் பயணத்திற்கு முன் அத்தியாவசிய தகவல்" },
    te: { title: "హజ్ కు ముందు - భారతదేశం", subtitle: "మీ ప్రయాణానికి ముందు అవసరమైన సమాచారం" },
    mr: { title: "हज आधी - भारत", subtitle: "आपल्या प्रवासापूर्वी आवश्यक माहिती" },
    bn: { title: "হজের আগে - ভারত", subtitle: "আপনার যাত্রার আগে প্রয়োজনীয় তথ্য" },
    or: { title: "ହଜ ପୂର୍ବରୁ - ଭାରତ", subtitle: "ଆପଣଙ୍କ ଯାତ୍ରା ପୂର୍ବରୁ ଆବଶ୍ୟକ ସୂଚନା" },
    ml: { title: "ഹജ്ജിന് മുമ്പ് - ഇന്ത്യ", subtitle: "നിങ്ങളുടെ യാത്രയ്ക്ക് മുമ്പ് അത്യാവശ്യ വിവരങ്ങൾ" },
    pa: { title: "ਹੱਜ ਤੋਂ ਪਹਿਲਾਂ - ਭਾਰਤ", subtitle: "ਤੁਹਾਡੀ ਯਾਤਰਾ ਤੋਂ ਪਹਿਲਾਂ ਜ਼ਰੂਰੀ ਜਾਣਕਾਰੀ" },
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  return (
    <MainLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <span>{language === "ar" || language === "ur" ? "الرجوع" : "Back"}</span>
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">{l.title}</h1>
          <p className="text-muted-foreground mt-2">{l.subtitle}</p>
        </div>

        <div className="space-y-4">
          {PRE_HAJJ_SECTIONS.map((section) => {
            const IconComponent = iconMap[section.icon] || Building2;
            return (
              <Card
                key={section.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/pre-hajj-india/${section.id}`)}
              >
                <div className="flex items-center gap-4">
                  <IconCircle>
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </IconCircle>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {section.title[language as keyof typeof section.title] || section.title.en}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {section.description[language as keyof typeof section.description] || section.description.en}
                    </p>
                  </div>
                  {isRTL ? (
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default PreHajjIndiaPage;
