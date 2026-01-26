import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Haji, HajiStatus, STATUS_COLORS, STATUS_LABELS } from "@/types/haji";
import { Accessibility, Heart, Droplets, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface HajiCardProps {
  haji: Haji;
  onClick?: (haji: Haji) => void;
}

// Background colors matching Android adapter
const STATUS_BG_COLORS: Record<HajiStatus, string> = {
  NORMAL: 'bg-card',
  EMERGENCY: 'bg-destructive/10',
  MISSING: 'bg-amber-100 dark:bg-amber-950/50',
  HOSPITAL: 'bg-blue-100 dark:bg-blue-950/50',
};

export function HajiCard({ haji, onClick }: HajiCardProps) {
  const isHighPriority = haji.wheelchair || haji.age > 60 || haji.status !== 'NORMAL';
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md active:scale-[0.98]",
        STATUS_BG_COLORS[haji.status],
        isHighPriority && "border-l-4 border-l-amber-500"
      )}
      onClick={() => onClick?.(haji)}
    >
      <CardContent className="p-3 space-y-2">
        {/* Name Row - Bold 16sp equivalent */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-foreground">
            {haji.name}
          </h3>
          <Badge 
            variant="secondary"
            className={cn(
              "text-white text-xs",
              STATUS_COLORS[haji.status]
            )}
          >
            {STATUS_LABELS[haji.status]}
          </Badge>
        </div>
        
        {/* Info Row - 14sp equivalent */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{haji.haji_id}</span>
          <span>{haji.gender}, {haji.age}y</span>
          
          <span className="flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-red-500" />
            {haji.blood_group}
          </span>
          
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {haji.family_id}
          </span>
        </div>

        {/* Conditions Row */}
        <div className="flex flex-wrap items-center gap-2">
          {haji.wheelchair && (
            <Badge variant="outline" className="text-xs gap-1 bg-accent">
              <Accessibility className="w-3 h-3" />
              Wheelchair
            </Badge>
          )}
          {haji.disease && haji.disease !== 'None' && (
            <Badge variant="outline" className="text-xs gap-1 bg-destructive/10">
              <Heart className="w-3 h-3" />
              {haji.disease}
            </Badge>
          )}
          {haji.age > 60 && (
            <Badge variant="outline" className="text-xs bg-muted">
              Senior ({haji.age}+)
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
