import { MapPin, BookOpen, Heart, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickActionsProps {
  onSelect: (question: string) => void;
}

const quickActions = [
  {
    icon: MapPin,
    labelKey: "tawafSteps" as const,
    questionAr: "ما هي خطوات الطواف حول الكعبة؟",
    questionEn: "What are the steps for performing Tawaf around the Kaaba?",
  },
  {
    icon: BookOpen,
    labelKey: "hajjDuas" as const,
    questionAr: "ما هي أهم الأدعية خلال الحج؟",
    questionEn: "What are the most important duas to recite during Hajj?",
  },
  {
    icon: AlertCircle,
    labelKey: "ihramRules" as const,
    questionAr: "ما هي الأفعال المحظورة أثناء الإحرام؟",
    questionEn: "What actions are prohibited while in the state of Ihram?",
  },
  {
    icon: Heart,
    labelKey: "dayOfArafat" as const,
    questionAr: "ماذا أفعل في يوم عرفة؟",
    questionEn: "What should I do on the Day of Arafat?",
  },
];

const QuickActions = ({ onSelect }: QuickActionsProps) => {
  const { t, language } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={() => onSelect(language === "ar" || language === "ur" ? action.questionAr : action.questionEn)}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 shadow-soft hover:shadow-elevated group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-soft border-2 border-primary/20">
            <action.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <p className="text-sm font-semibold text-foreground text-center">
            {t(action.labelKey)}
          </p>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
