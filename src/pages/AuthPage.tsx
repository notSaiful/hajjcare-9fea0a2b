import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.jpeg";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { lovable } from "@/integrations/lovable/index";
import { Separator } from "@/components/ui/separator";

const titleLabels = {
  en: { appName: "Haj Care AI", tagline: "Your Trusted Hajj & Umrah Companion", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", emailTab: "Email", google: "Continue with Google" },
  ar: { appName: "حج كير", tagline: "رفيقك الموثوق للحج والعمرة", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", emailTab: "البريد", google: "المتابعة مع Google" },
  ur: { appName: "حج کیئر", tagline: "حج و عمرہ کا آپ کا ساتھی", bismillah: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", emailTab: "ای میل", google: "Google کے ساتھ جاری رکھیں" },
  hi: { appName: "हज केयर AI", tagline: "आपका विश्वसनीय हज और उमरा साथी", bismillah: "बिस्मिल्लाहिर्रहमानिर्रहीम", emailTab: "ईमेल", google: "Google से जारी रखें" },
};

const AuthPage = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
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

        <CardContent className="px-5 sm:px-6 py-6 space-y-5">
          <EmailAuthForm onSuccess={() => navigate("/")} />

          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full h-14 text-base font-medium rounded-2xl gap-3 border-border/60"
            onClick={async () => {
              setGoogleLoading(true);
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) {
                setGoogleLoading(false);
              }
            }}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {t.google}
          </Button>
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
