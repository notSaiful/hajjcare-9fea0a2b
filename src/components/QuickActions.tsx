import { MapPin, BookOpen, Heart, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickActionsProps {
  onSelect: (question: string) => void;
}

const quickActions = [
  {
    icon: MapPin,
    labelAr: "خطوات الطواف",
    labelEn: "Tawaf Steps",
    questionAr: "ما هي خطوات الطواف حول الكعبة؟",
    questionEn: "What are the steps for performing Tawaf around the Kaaba?",
  },
  {
    icon: BookOpen,
    labelAr: "أدعية الحج",
    labelEn: "Hajj Duas",
    questionAr: "ما هي أهم الأدعية خلال الحج؟",
    questionEn: "What are the most important duas to recite during Hajj?",
  },
  {
    icon: AlertCircle,
    labelAr: "محظورات الإحرام",
    labelEn: "Ihram Rules",
    questionAr: "ما هي الأفعال المحظورة أثناء الإحرام؟",
    questionEn: "What actions are prohibited while in the state of Ihram?",
  },
  {
    icon: Heart,
    labelAr: "يوم عرفة",
    labelEn: "Day of Arafat",
    questionAr: "ماذا أفعل في يوم عرفة؟",
    questionEn: "What should I do on the Day of Arafat?",
  },
];

const QuickActions = ({ onSelect }: QuickActionsProps) => {
  const { isArabic } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={() => onSelect(isArabic ? action.questionAr : action.questionEn)}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 shadow-soft hover:shadow-elevated group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <action.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-arabic text-sm font-semibold text-foreground">
              {isArabic ? action.labelAr : action.labelEn}
            </p>
            <p className="text-xs text-muted-foreground">
              {isArabic ? action.labelEn : action.labelAr}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
