import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Star } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { BiometricLogin } from "@/components/auth/BiometricLogin";
import { IslamicPattern } from "@/components/auth/IslamicPattern";
import { MosqueSilhouette } from "@/components/auth/MosqueSilhouette";

const titleLabels = {
  en: { appName: "Haj Care AI", tagline: "Your Trusted Hajj & Umrah Companion", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" },
  ar: { appName: "حج كير", tagline: "رفيقك الموثوق للحج والعمرة", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" },
  ur: { appName: "حج کیئر", tagline: "حج و عمرہ کا آپ کا ساتھی", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" },
  hi: { appName: "हज केयर AI", tagline: "आपका विश्वसनीय हज और उमरा साथी", bismillah: "बिस्मिल्लाहिर्रहमानिर्रहीम" },
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
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:p-6 auth-page-bg overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Layered backgrounds */}
      <AmbientBackground variant="warm" />
      <IslamicPattern />
      <MosqueSilhouette />

      {/* Crescent accent top-right */}
      <div className="absolute top-6 right-8 sm:top-10 sm:right-14 opacity-[0.10] pointer-events-none" aria-hidden>
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-primary" fill="currentColor">
          <circle cx="30" cy="30" r="24" />
          <circle cx="36" cy="28" r="20" fill="hsl(var(--background))" />
        </svg>
      </div>

      {/* Bismillah */}
      <p className="relative z-10 text-xl sm:text-2xl font-arabic text-primary/80 mb-4 animate-fade-up tracking-wide">
        {t.bismillah}
      </p>

      {/* Logo + Branding */}
      <div className="mb-6 animate-fade-up relative z-10 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl -z-10 scale-150 animate-ambient-glow" />
          <img
            src={logo}
            alt="Haj Care AI"
            className="w-22 h-22 sm:w-28 sm:h-28 rounded-full shadow-elevated ring-[3px] ring-primary/25"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-lg">
            <Star className="w-3.5 h-3.5 text-primary-foreground fill-current" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.appName}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t.tagline}</p>
        </div>
      </div>

      {/* Auth Card */}
      <Card
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-card/95 backdrop-blur-md border border-border/40 rounded-3xl animate-fade-up overflow-hidden"
        style={{ animationDelay: "80ms", boxShadow: "0 8px 40px -12px hsl(var(--primary) / 0.15)" }}
      >
        {/* Decorative top arc */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <CardContent className="px-5 sm:px-6 py-6">
          <EmailAuthForm onSuccess={() => navigate("/")} />
          <BiometricLogin onSuccess={() => navigate("/")} />
        </CardContent>
      </Card>

      {/* Trust indicators */}
      <div className="relative z-10 mt-6 flex items-center gap-4 text-xs text-muted-foreground/70 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <span>🔒 Secure</span>
        <span className="text-primary/30">✦</span>
        <span>🕋 Islamic</span>
        <span className="text-primary/30">✦</span>
        <span>🇮🇳 Made for India</span>
      </div>
    </div>
  );
};

export default AuthPage;
