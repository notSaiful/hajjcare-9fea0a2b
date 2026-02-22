import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Bot, Bell, Heart, Lock, ArrowRight, Sparkles } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const LandingPage = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-background to-background pointer-events-none" />
        
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23888' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />

        {/* Soft glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto">
          {/* Bismillah */}
          <p className="font-arabic text-lg sm:text-xl text-primary/70 mb-6 animate-fade-in" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          {/* Logo */}
          <div className="mb-6 animate-fade-up flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl scale-150" />
              <img
                src={logo}
                alt="HajCare AI"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg ring-2 ring-primary/20 relative z-10"
                loading="eager"
              />
            </div>
          </div>

          {/* Brand */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <span className="text-primary">Haj</span>
            <span className="text-foreground">Care</span>
            <span className="text-muted-foreground ml-1.5 text-2xl sm:text-3xl font-medium">AI</span>
          </h1>

          {/* Headline */}
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed mb-4 animate-fade-up" style={{ animationDelay: "150ms" }}>
            Your Complete Digital Companion for a Peaceful &amp; Organized Hajj Journey
          </h2>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto animate-fade-up" style={{ animationDelay: "200ms" }}>
            Guidance, reminders, logistics, and spiritual support — all in one place
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4 animate-fade-up" style={{ animationDelay: "250ms" }}>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="h-13 px-8 text-base font-semibold rounded-2xl shadow-lg w-full sm:w-auto"
            >
              Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base font-semibold rounded-2xl border-primary/30 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60 animate-fade-up" style={{ animationDelay: "300ms" }}>
            Access your personalized Hajj dashboard
          </p>
        </div>
      </section>

      {/* ===== VALUE CARDS ===== */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: BookOpen, title: "Smart Ritual Guidance", desc: "Step-by-step Hajj flow with real-time stage tracking", color: "text-emerald-500" },
            { icon: Bot, title: "AI Assistance", desc: "Ask questions anytime in your language, get instant answers", color: "text-blue-500" },
            { icon: Bell, title: "Reminders & Planning", desc: "Never miss important steps, vaccinations, or deadlines", color: "text-amber-500" },
            { icon: Heart, title: "Dua & Spiritual Companion", desc: "Curated duas for each stage with transliteration", color: "text-rose-500" },
          ].map((card, i) => (
            <div
              key={card.title}
              className="group relative p-5 sm:p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${350 + i * 60}ms` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
                <h3 className="text-base font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== EMOTIONAL TRUST SECTION ===== */}
      <section className="px-4 sm:px-6 py-10 sm:py-14 text-center">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/40" />
            <div className="w-1.5 h-1.5 rotate-45 bg-primary/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/40" />
          </div>
          <p className="text-lg sm:text-xl font-medium text-foreground/90 leading-relaxed italic">
            "Millions prepare for Hajj physically. Few prepare digitally, spiritually, and mentally."
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/40" />
            <div className="w-1.5 h-1.5 rotate-45 bg-primary/60" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>
      </section>

      {/* ===== BLURRED PREVIEW (ACCESS TEASER) ===== */}
      <section className="px-4 sm:px-6 py-10 sm:py-14 max-w-3xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-border/30">
          {/* Blurred fake dashboard preview */}
          <div className="grid grid-cols-2 gap-3 p-5 blur-[6px] select-none pointer-events-none" aria-hidden>
            {["Hajj Itinerary", "Dua Collection", "AI Chat Assistant", "Preparation Checklist"].map((item) => (
              <div key={item} className="bg-card border border-border/40 rounded-2xl p-4 h-28">
                <div className="w-8 h-8 rounded-xl bg-primary/15 mb-2" />
                <div className="h-3 w-3/4 bg-muted rounded mb-1.5" />
                <div className="h-2 w-1/2 bg-muted/60 rounded" />
                <p className="text-xs text-muted-foreground mt-2 opacity-60">{item}</p>
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl px-6 py-4 flex flex-col items-center gap-2 shadow-lg">
              <Lock className="w-6 h-6 text-primary/70" />
              <p className="text-sm font-semibold text-foreground">Login to unlock your Hajj experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Begin Your Journey
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Your Hajj preparation starts here
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="h-13 px-8 text-base font-semibold rounded-2xl shadow-lg w-full sm:w-auto"
            >
              Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              variant="outline"
              size="lg"
              className="h-13 px-8 text-base font-semibold rounded-2xl border-primary/30 w-full sm:w-auto"
            >
              Create Account
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
            <span>🔒 Secure</span>
            <span className="text-primary/30">✦</span>
            <span>🕋 Islamic</span>
            <span className="text-primary/30">✦</span>
            <span>🇮🇳 Made for India</span>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="px-4 py-6 text-center text-xs text-muted-foreground/50 border-t border-border/20">
        <p>© 2026 HajCare AI. Your trusted Hajj & Umrah companion.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
