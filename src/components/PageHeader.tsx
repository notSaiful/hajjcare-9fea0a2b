import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string | Record<string, string>;
  subtitle?: string | Record<string, string>;
  backLink?: string;
  icon?: LucideIcon;
  iconVariant?: "primary" | "emerald" | "amber" | "rose" | "teal" | "sky" | "violet";
  className?: string;
  children?: React.ReactNode;
}

const backLabels: Record<string, string> = {
  en: "Back",
  ar: "رجوع",
  ur: "واپس",
  hi: "वापस",
  ta: "பின்செல்",
  te: "వెనక్కి",
  mr: "मागे",
  bn: "পিছনে",
  or: "ପଛକୁ",
  ml: "തിരികെ",
  pa: "ਵਾਪਸ",
};

const iconVariantClasses: Record<string, string> = {
  primary: "bg-primary/10 text-primary border-primary/20",
  emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  teal: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  sky: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  violet: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

export function PageHeader({
  title,
  subtitle,
  backLink = "/",
  icon: Icon,
  iconVariant = "primary",
  className,
  children,
}: PageHeaderProps) {
  const { language, isRTL } = useLanguage();

  const titleText = typeof title === "string" ? title : title[language] || title.en;
  const subtitleText = subtitle
    ? typeof subtitle === "string"
      ? subtitle
      : subtitle[language] || subtitle.en
    : undefined;

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Back Button */}
      <Link
        to={backLink}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <BackArrow className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">{backLabels[language] || backLabels.en}</span>
      </Link>

      {/* Title Section */}
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={cn(
              "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border-2",
              iconVariantClasses[iconVariant]
            )}
          >
            <Icon className="w-7 h-7" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {titleText}
          </h1>
          {subtitleText && (
            <p className="text-muted-foreground mt-1 text-base">{subtitleText}</p>
          )}
        </div>
      </div>

      {/* Optional children (search bar, filters, etc.) */}
      {children}
    </div>
  );
}
