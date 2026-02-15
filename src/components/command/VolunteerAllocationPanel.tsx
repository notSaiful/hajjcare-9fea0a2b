import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HandHelping } from "lucide-react";
import type { VolunteerAllocation } from "@/hooks/useNationalCommand";

interface VolunteerAllocationPanelProps {
  allocations: VolunteerAllocation[];
  rawVolunteers: { total_available: number; active_assignments: number; by_zone: Record<string, number> };
}

export function VolunteerAllocationPanel({ allocations, rawVolunteers }: VolunteerAllocationPanelProps) {
  const hasAI = allocations.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <HandHelping className="w-5 h-5 text-indigo-500" />
          Volunteer Allocation
          <Badge variant="secondary" className="ml-auto">{rawVolunteers.total_available} available</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Active:</span>{" "}
            <span className="font-semibold">{rawVolunteers.active_assignments}</span>
          </div>
        </div>

        {hasAI ? (
          <div className="space-y-2">
            {allocations.map((a) => (
              <div key={a.zone} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{a.zone.replace(/_/g, " ")}</span>
                  <span className="text-xs">
                    {a.current}/{a.needed}
                    {a.gap > 0 && (
                      <Badge variant="destructive" className="ml-1.5 text-xs">-{a.gap}</Badge>
                    )}
                  </span>
                </div>
                <Progress value={a.needed > 0 ? (a.current / a.needed) * 100 : 100} className="h-1.5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(rawVolunteers.by_zone).map(([zone, count]) => (
              <div key={zone} className="flex justify-between text-sm">
                <span className="capitalize">{zone.replace(/_/g, " ")}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
            {Object.keys(rawVolunteers.by_zone).length === 0 && (
              <p className="text-sm text-muted-foreground">No zone data available</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
