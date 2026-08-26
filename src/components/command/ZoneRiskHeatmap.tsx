import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { ZoneRisk } from "@/hooks/useNationalCommand";

interface ZoneRiskHeatmapProps {
  zoneRisks: ZoneRisk[];
  alertsBySeverity: Record<string, number>;
}

const riskColorMap: Record<string, string> = {
  critical: "bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-400",
  high: "bg-orange-500/20 border-orange-500/50 text-orange-700 dark:text-orange-400",
  medium: "bg-yellow-500/20 border-yellow-500/50 text-yellow-700 dark:text-yellow-400",
  low: "bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-400",
};

export function ZoneRiskHeatmap({ zoneRisks, alertsBySeverity }: ZoneRiskHeatmapProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Zone Risk Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Severity summary */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(alertsBySeverity).map(([sev, count]) => (
            <Badge key={sev} variant={sev === "critical" ? "destructive" : "secondary"} className="text-xs">
              {sev}: {count}
            </Badge>
          ))}
        </div>

        {/* Zone risk cards */}
        <div className="grid grid-cols-1 gap-2">
          {zoneRisks.map((zr) => (
            <div
              key={zr.zone}
              className={`p-3 rounded-lg border ${riskColorMap[zr.risk_level] || riskColorMap.low}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm capitalize">{zr.zone.replace(/_/g, " ")}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{zr.density_pct}% density</Badge>
                  <Badge variant={zr.stampede_probability > 0.5 ? "destructive" : "secondary"} className="text-xs">
                    Stampede: {Math.round(zr.stampede_probability * 100)}%
                  </Badge>
                </div>
              </div>
              {zr.factors.length > 0 && (
                <p className="text-xs opacity-80">{zr.factors.join(" • ")}</p>
              )}
            </div>
          ))}
        </div>

        {zoneRisks.length === 0 && (
          <p className="text-sm text-muted-foreground">Run AI analysis to generate risk assessment</p>
        )}
      </CardContent>
    </Card>
  );
}
