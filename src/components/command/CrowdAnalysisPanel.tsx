import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, ArrowRight } from "lucide-react";

interface CrowdAnalysisPanelProps {
  crowdAnalysis: {
    total_tracked: number;
    peak_zones: string[];
    flow_direction: string;
    bottleneck_zones: string[];
  } | null;
}

export function CrowdAnalysisPanel({ crowdAnalysis }: CrowdAnalysisPanelProps) {
  if (!crowdAnalysis) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Crowd & Stampede Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Run AI analysis for crowd flow intelligence</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Crowd & Stampede Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Flow direction */}
        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2 mb-1">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Crowd Flow</span>
          </div>
          <p className="text-sm text-muted-foreground">{crowdAnalysis.flow_direction}</p>
        </div>

        {/* Peak zones */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Peak Zones</h4>
          <div className="flex gap-1.5 flex-wrap">
            {crowdAnalysis.peak_zones.map((z) => (
              <Badge key={z} variant="secondary" className="capitalize">{z.replace(/_/g, " ")}</Badge>
            ))}
          </div>
        </div>

        {/* Bottleneck zones */}
        {crowdAnalysis.bottleneck_zones.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-destructive mb-1.5 uppercase tracking-wider">⚠ Bottleneck Zones</h4>
            <div className="flex gap-1.5 flex-wrap">
              {crowdAnalysis.bottleneck_zones.map((z) => (
                <Badge key={z} variant="destructive" className="capitalize">{z.replace(/_/g, " ")}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
