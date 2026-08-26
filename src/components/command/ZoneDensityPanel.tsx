import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin } from "lucide-react";

interface ZoneDensityPanelProps {
  byZone: Record<string, number>;
  total: number;
  emergencyCount: number;
}

export function ZoneDensityPanel({ byZone, total, emergencyCount }: ZoneDensityPanelProps) {
  const sorted = Object.entries(byZone).sort((a, b) => b[1] - a[1]);
  const maxCount = sorted.length > 0 ? sorted[0][1] : 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Live Haji Density
          <Badge variant="secondary" className="ml-auto">{total} tracked</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {emergencyCount > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/30">
            <span className="text-xs font-medium text-destructive">🚨 {emergencyCount} in emergency state</span>
          </div>
        )}
        {sorted.map(([zone, count]) => {
          const pct = Math.round((count / Math.max(total, 1)) * 100);
          const density = count / maxCount;
          return (
            <div key={zone} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 capitalize">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  {zone.replace(/_/g, " ")}
                </span>
                <span className="text-muted-foreground text-xs font-mono">{count} ({pct}%)</span>
              </div>
              <Progress
                value={density * 100}
                className={`h-2 ${density > 0.8 ? "[&>div]:bg-red-500" : density > 0.5 ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
              />
            </div>
          );
        })}
        {sorted.length === 0 && <p className="text-sm text-muted-foreground">No density data available</p>}
      </CardContent>
    </Card>
  );
}
