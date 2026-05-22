import { useNavigate } from "react-router-dom";
import { Hand, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const T: Record<string, { title: string; subtitle: string; cta: string }> = {
  en: { title: "Tawaf & Sa'i Counter", subtitle: "Count 7 rounds with duas — calm and focused", cta: "Open counter" },
  ur: { title: "طواف اور سعی کاؤنٹر", subtitle: "دعاؤں کے ساتھ ۷ چکر گنیں — سکون سے", cta: "کاؤنٹر کھولیں" },
  hi: { title: "तवाफ़ और सई काउंटर", subtitle: "दुआओं के साथ 7 चक्कर गिनें — सुकून से", cta: "काउंटर खोलें" },
  ar: { title: "عدّاد الطواف والسعي", subtitle: "احسب سبعة أشواط مع الأدعية بسكينة", cta: "افتح العدّاد" },
};

export const TawafCounterQuickAction = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const t = T[language as keyof typeof T] ?? T.en;

  return (
    <button
      onClick={() => navigate("/tawaf-counter")}
      className="w-full bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-soft text-left transition-all hover:border-islamic-gold/40 hover:shadow-md active:scale-[0.99]"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ minHeight: 72 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-islamic-gold/15 flex items-center justify-center shrink-0">
          <Hand className="w-6 h-6 text-islamic-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base leading-tight">{t.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-islamic-gold shrink-0">
          {t.cta}
          <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
        </div>
      </div>
    </button>
  );
};
