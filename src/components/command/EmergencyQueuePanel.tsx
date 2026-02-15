import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Siren } from "lucide-react";
import type { EmergencyQueueItem } from "@/hooks/useNationalCommand";

interface EmergencyQueuePanelProps {
  queue: EmergencyQueueItem[];
  criticalCount: number;
}

const urgencyBadge: Record<string, "destructive" | "secondary" | "outline"> = {
  critical: "destructive",
  high: "destructive",
  medium: "secondary",
  low: "outline",
};

export function EmergencyQueuePanel({ queue, criticalCount }: EmergencyQueuePanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Siren className="w-5 h-5 text-red-500" />
          Emergency Queue
          {criticalCount > 0 && (
            <Badge variant="destructive" className="ml-auto animate-pulse">
              {criticalCount} critical
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          <div className="space-y-2 pr-3">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-2.5 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Badge variant={urgencyBadge[item.urgency] || "outline"} className="text-xs">
                      {item.urgency}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize">{item.zone}</span>
                  </div>
                  <p className="text-sm truncate">{item.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Clock className="w-3 h-3" />
                  {item.wait_minutes}m
                </div>
              </div>
            ))}
            {queue.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No pending emergencies</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
