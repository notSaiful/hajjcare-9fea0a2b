import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Bot,
  Bell,
  Heart,
  Map as MapIcon,
  Stethoscope,
  ArrowRight,
  Sparkles,
  Star,
  Smartphone,
  Globe,
  CheckCircle2,
} from "lucide-react";
import logo from "@/assets/logo.jpeg";

const PALETTE = {
  emerald: "#0B3D2E",
  emeraldSoft: "#0F5C44",
  gold: "#C8A951",
  goldSoft: "#E4CB87",
  ivory: "#FAF7F2",
};

const FEATURES = [
  { icon: BookOpen, title: "Ritual Guide", desc: "Step-by-step Hajj & Umrah flow with stage tracking" },
  { icon: Bot, title: "AI Assistant", desc: "Ask anything in your language — answers in seconds" },
  { icon: Bell, title: "Smart Reminders", desc: "Never miss vaccinations, flights, or rituals" },
  { icon: Heart, title: "Duas & Adhkar", desc: "Curated supplications for every stage" },
  { icon: MapIcon, title: "Maps & Camps", desc: "Mina tent finder, Mashair maps, hotel directions" },
  { icon: Stethoscope, title: "Pilgrim Assistance", desc: "Travel safety, priority alerts, medical guidance" },
];

const RITUALS = [
  { name: "Ihram", ar: "إحرام" },
  { name: "Tawaf", ar: "طواف" },
  { name: "Sa'i", ar: "سعي" },
  { name: "Arafah", ar: "عرفة" },
  { name: "Muzdalifah", ar: "مزدلفة" },
  { name: "Rami", ar: "رمي" },
];

const CHAT_DEMO = [
  { from: "user", text: "Tawaf ka sahi tarika kya hai?", lang: "ur" },
  { from: "ai", text: "Tawaf 7 chakkar hai — Hajr-e-Aswad se shuru, anti-clockwise. Pehle 3 chakkar mein Ramal (tezi se chalna) sunnat hai." },
  { from: "user", text: "Arafah mein kya karein?" },
  { from: "ai", text: "Zawal ke baad Maghrib tak Dua, Dhikr, aur Istighfar. Ye Hajj ka rukn-e-azam hai." },
];

const TESTIMONIALS = [
  { text: "ہر قدم پر رہنمائی ملی۔ پہلی بار حج کیا اور بالکل پُرسکون رہا۔", name: "Imran S.", role: "Hyderabad" },
  { text: "The reminders saved me — vaccinations, visa, flight. All organized in one place.", name: "Fatima K.", role: "Mumbai" },
  { text: "AI से उर्दू में बात कर सकते हैं — मेरी अम्मी के लिए बहुत आसान।", name: "Abdul R.", role: "Lucknow" },
];

const LandingPage = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: PALETTE.ivory }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: `${PALETTE.gold}33`, borderTopColor: PALETTE.emerald }} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: PALETTE.ivory, color: PALETTE.emerald }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-5 sm:px-6 text-center overflow-hidden">
        {/* Islamic geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230B3D2E' stroke-width='1'%3E%3Cpath d='M40 5L75 40L40 75L5 40Z'/%3E%3Cpath d='M40 20L60 40L40 60L20 40Z'/%3E%3Ccircle cx='40' cy='40' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: `${PALETTE.gold}22` }}
        />

        <div className="relative z-10 max-w-xl mx-auto">
          {/* Bismillah */}
          <p
            className="font-arabic text-2xl sm:text-3xl mb-6 animate-fade-in"
            dir="rtl"
            style={{ color: PALETTE.emerald, letterSpacing: "0.02em" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          {/* Logo */}
          <div className="mb-6 flex justify-center animate-fade-up">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-2xl scale-150"
                style={{ background: `${PALETTE.gold}33` }}
              />
              <img
                src={logo}
                alt="HajCare AI"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-xl relative z-10"
                style={{ boxShadow: `0 0 0 3px ${PALETTE.gold}55, 0 12px 40px ${PALETTE.emerald}33` }}
                loading="eager"
              />
            </div>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 animate-fade-up"
            style={{ animationDelay: "100ms", color: PALETTE.emerald }}
          >
            HajCare <span style={{ color: PALETTE.gold }}>AI</span>
          </h1>

          <p
            className="font-arabic text-lg sm:text-xl mb-4 animate-fade-up"
            style={{ animationDelay: "150ms", color: PALETTE.emeraldSoft }}
            dir="rtl"
          >
            رفيقك الرقمي في رحلة الحج
          </p>

          <h2
            className="text-lg sm:text-xl font-medium leading-relaxed mb-5 animate-fade-up"
            style={{ animationDelay: "200ms", color: PALETTE.emerald }}
          >
            Your Complete Digital Companion for a Peaceful & Organized Hajj Journey
          </h2>

          <p
            className="text-base mb-8 max-w-md mx-auto animate-fade-up"
            style={{ animationDelay: "250ms", color: `${PALETTE.emerald}AA` }}
          >
            Guidance, reminders, logistics, and spiritual support — all in one place
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Button
              onClick={() => navigate("/home")}
              size="lg"
              className="h-14 px-8 text-base font-semibold rounded-2xl w-full sm:w-auto border-0 shadow-lg"
              style={{ background: PALETTE.emerald, color: PALETTE.ivory }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore the Guide
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold rounded-2xl w-full sm:w-auto"
              style={{ borderColor: `${PALETTE.gold}99`, color: PALETTE.emerald, background: "transparent" }}
            >
              Create Account
            </Button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto animate-fade-up" style={{ animationDelay: "350ms" }}>
            {[
              { v: "50K+", l: "Pilgrims" },
              { v: "24/7", l: "AI Support" },
              { v: "11", l: "Languages" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl p-3 backdrop-blur-sm"
                style={{ background: `${PALETTE.gold}15`, border: `1px solid ${PALETTE.gold}33` }}
              >
                <div className="text-xl sm:text-2xl font-bold" style={{ color: PALETTE.emerald }}>{s.v}</div>
                <div className="text-xs" style={{ color: `${PALETTE.emerald}99` }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-5 sm:px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-px" style={{ background: `${PALETTE.gold}80` }} />
            <div className="w-2 h-2 rotate-45" style={{ background: PALETTE.gold }} />
            <div className="w-10 h-px" style={{ background: `${PALETTE.gold}80` }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: PALETTE.emerald }}>
            Everything You Need
          </h2>
          <p className="text-base" style={{ color: `${PALETTE.emerald}99` }}>
            One app for the entire Hajj experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{
                background: "white",
                border: `1px solid ${PALETTE.emerald}15`,
                boxShadow: `0 4px 20px ${PALETTE.emerald}08`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: `${PALETTE.gold}20`, color: PALETTE.emerald }}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-1.5" style={{ color: PALETTE.emerald }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: `${PALETTE.emerald}99` }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== RITUAL STEPS ===== */}
      <section className="px-5 sm:px-6 py-16" style={{ background: `${PALETTE.emerald}` }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-arabic text-xl mb-2" dir="rtl" style={{ color: PALETTE.goldSoft }}>أركان الحج</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: PALETTE.ivory }}>
            The Six Sacred Stages
          </h2>
          <p className="text-base mb-10" style={{ color: `${PALETTE.ivory}AA` }}>
            From Ihram to Rami — guided at every step
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {RITUALS.map((r, i) => (
              <div
                key={r.name}
                className="relative rounded-2xl p-5 text-center animate-fade-up"
                style={{
                  background: `${PALETTE.ivory}0A`,
                  border: `1px solid ${PALETTE.gold}44`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: PALETTE.gold, color: PALETTE.emerald }}
                >
                  {i + 1}
                </div>
                <p className="font-arabic text-lg mt-2 mb-1" dir="rtl" style={{ color: PALETTE.goldSoft }}>
                  {r.ar}
                </p>
                <p className="text-sm font-semibold" style={{ color: PALETTE.ivory }}>{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI CHAT PREVIEW ===== */}
      <section className="px-5 sm:px-6 py-16 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: PALETTE.emerald }}>
            Ask in Your Language
          </h2>
          <p className="text-base" style={{ color: `${PALETTE.emerald}99` }}>
            Urdu, Hindi, English, Arabic & 7 more
          </p>
        </div>

        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "white", border: `1px solid ${PALETTE.emerald}15`, boxShadow: `0 12px 40px ${PALETTE.emerald}15` }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background: `${PALETTE.emerald}`, color: PALETTE.ivory }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: PALETTE.gold, color: PALETTE.emerald }}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">HajCare AI</p>
              <p className="text-xs opacity-75 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="p-5 space-y-3" style={{ background: `${PALETTE.ivory}` }}>
            {CHAT_DEMO.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                  style={
                    m.from === "user"
                      ? { background: PALETTE.emerald, color: PALETTE.ivory, borderBottomRightRadius: "4px" }
                      : { background: "white", color: PALETTE.emerald, border: `1px solid ${PALETTE.gold}33`, borderBottomLeftRadius: "4px" }
                  }
                  dir={m.lang === "ur" ? "rtl" : "ltr"}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/chat")}
            className="w-full py-4 text-sm font-semibold transition-colors hover:opacity-90"
            style={{ background: `${PALETTE.gold}22`, color: PALETTE.emerald, borderTop: `1px solid ${PALETTE.gold}33` }}
          >
            Try the AI Assistant →
          </button>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="px-5 sm:px-6 py-16" style={{ background: `${PALETTE.gold}10` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: PALETTE.emerald }}>
              Trusted by Pilgrims
            </h2>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" style={{ color: PALETTE.gold }} />
              ))}
              <span className="ml-2 text-sm font-medium" style={{ color: PALETTE.emerald }}>4.9 / 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl animate-fade-up"
                style={{
                  background: "white",
                  border: `1px solid ${PALETTE.gold}33`,
                  boxShadow: `0 4px 20px ${PALETTE.emerald}0A`,
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <p className="text-base leading-relaxed mb-4" style={{ color: PALETTE.emerald }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2 pt-3" style={{ borderTop: `1px solid ${PALETTE.gold}22` }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm"
                    style={{ background: `${PALETTE.emerald}`, color: PALETTE.gold }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: PALETTE.emerald }}>{t.name}</p>
                    <p className="text-xs" style={{ color: `${PALETTE.emerald}99` }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DOWNLOAD ===== */}
      <section className="px-5 sm:px-6 py-16 max-w-3xl mx-auto text-center">
        <p className="font-arabic text-xl mb-3" dir="rtl" style={{ color: PALETTE.gold }}>ابدأ رحلتك</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: PALETTE.emerald }}>
          Begin Your Journey
        </h2>
        <p className="text-base mb-8" style={{ color: `${PALETTE.emerald}99` }}>
          Available on web, with mobile apps coming soon
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Button
            onClick={() => navigate("/home")}
            size="lg"
            className="h-14 px-6 rounded-2xl w-full sm:w-auto border-0"
            style={{ background: PALETTE.emerald, color: PALETTE.ivory }}
          >
            <Globe className="w-5 h-5 mr-2" />
            Open Web App
          </Button>
          <Button
            size="lg"
            disabled
            className="h-14 px-6 rounded-2xl w-full sm:w-auto"
            style={{ background: `${PALETTE.emerald}15`, color: PALETTE.emerald, opacity: 0.7 }}
          >
            <Smartphone className="w-5 h-5 mr-2" />
            App Store · Soon
          </Button>
          <Button
            size="lg"
            disabled
            className="h-14 px-6 rounded-2xl w-full sm:w-auto"
            style={{ background: `${PALETTE.emerald}15`, color: PALETTE.emerald, opacity: 0.7 }}
          >
            <Smartphone className="w-5 h-5 mr-2" />
            Play Store · Soon
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm" style={{ color: `${PALETTE.emerald}AA` }}>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: PALETTE.gold }} /> Free to use</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: PALETTE.gold }} /> No ads</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" style={{ color: PALETTE.gold }} /> Privacy-first</span>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="px-5 py-10 text-center"
        style={{ background: PALETTE.emerald, color: PALETTE.ivory }}
      >
        <p className="font-arabic text-lg mb-3" dir="rtl" style={{ color: PALETTE.goldSoft }}>
          صنع بحب للأمة
        </p>
        <p className="text-base mb-2">
          Made with <span style={{ color: PALETTE.gold }}>♥</span> for the Ummah
        </p>
        <p className="text-xs opacity-60">© 2026 HajCare AI · Your trusted Hajj & Umrah companion</p>
      </footer>
    </div>
  );
};

export default LandingPage;
