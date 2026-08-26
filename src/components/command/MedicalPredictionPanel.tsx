import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, ShieldAlert } from "lucide-react";
import type { MedicalPrediction } from "@/hooks/useNationalCommand";

interface MedicalPredictionPanelProps {
  predictions: MedicalPrediction[];
}

const probColor: Record<string, string> = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-emerald-500",
};

export function MedicalPredictionPanel({ predictions }: MedicalPredictionPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-pink-500" />
          Medical Risk Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {predictions.map((p, i) => (
          <div key={i} className="p-3 rounded-lg border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{p.risk}</span>
              <Badge variant={p.probability === "high" ? "destructive" : "secondary"} className="text-xs">
                {p.probability}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground capitalize">Zone: {p.zone.replace(/_/g, " ")}</p>
            <div className="flex items-start gap-1.5 mt-1">
              <ShieldAlert className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${probColor[p.probability] || ""}`} />
              <p className="text-xs">{p.preventive_action}</p>
            </div>
          </div>
        ))}
        {predictions.length === 0 && (
          <p className="text-sm text-muted-foreground">Run AI analysis to generate predictions</p>
        )}
      </CardContent>
    </Card>
  );
}
