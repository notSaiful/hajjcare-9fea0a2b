import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface WhatToDoCardProps {
  instruction: string;
  subtext?: string;
  className?: string;
}

export const WhatToDoCard = ({ instruction, subtext, className = "" }: WhatToDoCardProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className={`bg-card shadow-card border-0 ${className}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowRight className={`w-5 h-5 text-primary ${isRTL ? "rtl-flip" : ""}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {t("whatToDoNow")}
            </p>
            <p className="text-body-lg font-medium text-foreground leading-relaxed">
              {instruction}
            </p>
            {subtext && (
              <p className="text-sm text-muted-foreground mt-2">
                {subtext}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
