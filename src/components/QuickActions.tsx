import { MapPin, BookOpen, Heart, AlertCircle } from "lucide-react";

interface QuickActionsProps {
  onSelect: (question: string) => void;
}

const quickActions = [
  {
    icon: MapPin,
    label: "خطوات الطواف",
    labelEn: "Tawaf Steps",
    question: "What are the steps for performing Tawaf around the Kaaba?",
  },
  {
    icon: BookOpen,
    label: "أدعية الحج",
    labelEn: "Hajj Duas",
    question: "What are the most important duas to recite during Hajj?",
  },
  {
    icon: AlertCircle,
    label: "محظورات الإحرام",
    labelEn: "Ihram Rules",
    question: "What actions are prohibited while in the state of Ihram?",
  },
  {
    icon: Heart,
    label: "يوم عرفة",
    labelEn: "Day of Arafat",
    question: "What should I do on the Day of Arafat?",
  },
];

const QuickActions = ({ onSelect }: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={() => onSelect(action.question)}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 shadow-soft hover:shadow-elevated group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <action.icon className="w-5 h-5 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-arabic text-sm font-semibold text-foreground">
              {action.label}
            </p>
            <p className="text-xs text-muted-foreground">{action.labelEn}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
