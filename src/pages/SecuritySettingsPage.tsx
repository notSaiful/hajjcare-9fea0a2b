import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { MfaEnrollForm } from "@/components/auth/MfaEnrollForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const labels = {
  en: { title: "Security Settings", back: "Back" },
  ar: { title: "إعدادات الأمان", back: "رجوع" },
  ur: { title: "سیکیورٹی سیٹنگز", back: "واپس" },
  hi: { title: "सुरक्षा सेटिंग्स", back: "वापस" },
};

const SecuritySettingsPage = () => {
  const { loading } = useAuth();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const t = labels[language as keyof typeof labels] || labels.en;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 max-w-lg mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">{t.title}</h1>
      </div>

      <MfaEnrollForm />
    </div>
  );
};

export default SecuritySettingsPage;
