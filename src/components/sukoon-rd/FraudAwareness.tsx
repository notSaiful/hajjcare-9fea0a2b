import { useLanguage } from "@/contexts/LanguageContext";
import { sukoonRdContent } from "@/data/sukoonRdContent";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";

export default function FraudAwareness() {
  const { language } = useLanguage();
  const awareness = sukoonRdContent.awareness;
  const benefits = sukoonRdContent.rdBenefits;

  const getLabel = (obj: Record<string, string>) => obj[language] || obj.en;
  const getList = (obj: Record<string, string[]>) => obj[language] || obj.en;

  return (
    <div className="space-y-5">
      {/* Why Fraud Happens */}
      <Card className="p-5 border-2 border-destructive/20 bg-gradient-to-br from-background to-destructive/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {getLabel(awareness.title)}
          </h3>
        </div>
        <ul className="space-y-3">
          {getList(awareness.points).map((point, i) => (
            <li key={i} className="flex gap-3 items-start">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Benefits of RD */}
      <Card className="p-5 border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">
            {getLabel(benefits.title)}
          </h3>
        </div>
        <ul className="space-y-3">
          {getList(benefits.items).map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="text-primary font-bold mt-0.5">✓</span>
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
