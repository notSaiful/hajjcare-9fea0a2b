import { Phone, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { IconCircle } from "@/components/IconCircle";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface QuickContactCardProps {
  title: string | Record<string, string>;
  number: string;
  description?: string | Record<string, string>;
  icon?: LucideIcon;
  variant?: "primary" | "emerald" | "amber" | "rose" | "red" | "teal" | "sky";
  className?: string;
}

const tapToCallLabels: Record<string, string> = {
  en: "Tap to call",
  ar: "اضغط للاتصال",
  ur: "کال کرنے کے لیے ٹیپ کریں",
  hi: "कॉल करने के लिए टैप करें",
  ta: "அழைக்க தட்டவும்",
  te: "కాల్ చేయడానికి ట్యాప్ చేయండి",
  mr: "कॉल करण्यासाठी टॅप करा",
  bn: "কল করতে ট্যাপ করুন",
  or: "କଲ୍ କରିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ",
  ml: "കോൾ ചെയ്യാൻ ടാപ്പ് ചെയ്യുക",
  pa: "ਕਾਲ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ",
};

export function QuickContactCard({
  title,
  number,
  description,
  icon: Icon = Phone,
  variant = "primary",
  className,
}: QuickContactCardProps) {
  const { language } = useLanguage();

  const titleText = typeof title === "string" ? title : title[language] || title.en;
  const descText = description
    ? typeof description === "string"
      ? description
      : description[language] || description.en
    : undefined;

  return (
    <a href={`tel:${number.replace(/[^+\d]/g, "")}`} className="block">
      <Card
        className={cn(
          "hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] border-2 border-border/50 hover:border-primary/30",
          className
        )}
      >
        <CardContent className="p-4 flex items-center gap-4">
          <IconCircle icon={Icon} size="sm" variant={variant as any} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{titleText}</h3>
            {descText && (
              <p className="text-sm text-muted-foreground truncate">{descText}</p>
            )}
            <p className="text-sm text-primary font-medium mt-1">
              {tapToCallLabels[language] || tapToCallLabels.en}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono text-muted-foreground">{number}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
