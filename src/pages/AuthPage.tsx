import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Mail, Star } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";

const titleLabels = {
  en: { appName: "Haj Care AI", tagline: "Your Trusted Hajj & Umrah Companion", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", emailTab: "Email" },
  ar: { appName: "حج كير", tagline: "رفيقك الموثوق للحج والعمرة", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", emailTab: "البريد" },
  ur: { appName: "حج کیئر", tagline: "حج و عمرہ کا آپ کا ساتھی", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", emailTab: "ای میل" },
  hi: { appName: "हज केयर AI", tagline: "आपका विश्वसनीय हज और उमरा साथी", bismillah: "बिस्मिल्लाहिर्रहमानिर्रहीम", emailTab: "ईमेल" },
};

const AuthPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();

  const t = titleLabels[language as keyof typeof titleLabels] || titleLabels.en;

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AmbientBackground variant="minimal" />
        <Loader2 className="w-8 h-8 animate-spin text-primary relative z-10" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:p-6 auth-page-bg"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Ambient Background */}
      <AmbientBackground variant="warm" />

      {/* Bismillah */}
      <p className="relative z-10 text-lg sm:text-xl font-arabic text-primary/80 mb-3 animate-fade-up">
        {t.bismillah}
      </p>

      {/* Logo + Branding */}
      <div className="mb-5 animate-fade-up relative z-10 flex flex-col items-center gap-2.5">
        <div className="relative">
          <img
            src={logo}
            alt="Haj Care AI"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-elevated ring-2 ring-primary/20"
          />
          <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl -z-10 animate-ambient-glow" />
          {/* Verified badge */}
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-lg">
            <Star className="w-3.5 h-3.5 text-primary-foreground fill-current" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.appName}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{t.tagline}</p>
        </div>
      </div>

      {/* Auth Card */}
      <Card
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-card/95 backdrop-blur-sm border border-border/50 rounded-3xl animate-fade-up overflow-hidden"
        style={{ animationDelay: "80ms", boxShadow: "var(--shadow-elevated)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2 py-4 border-b border-border/40">
          <Mail className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">{t.emailTab}</span>
        </div>

        <CardContent className="px-5 sm:px-6 py-6">
          <EmailAuthForm onSuccess={() => navigate("/")} />
        </CardContent>
      </Card>

      {/* Trust indicators */}
      <div className="relative z-10 mt-5 flex items-center gap-4 text-xs text-muted-foreground/70 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <span>🔒 Secure</span>
        <span>•</span>
        <span>🕋 Islamic</span>
        <span>•</span>
        <span>🇮🇳 Made for India</span>
      </div>
    </div>
  );
};

export default AuthPage;
