import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface InspectorStatsCardProps {
  stats: {
    total: number;
    selected: number;
    waitlisted: number;
    male: number;
    female: number;
  };
  translations: Record<string, string>;
}

export const InspectorStatsCard = ({ stats, translations: t }: InspectorStatsCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-emerald-200 dark:border-emerald-800">
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
            <div className="text-2xl font-bold text-emerald-600">{stats.selected}</div>
            <div className="text-xs text-muted-foreground">{t.selected}</div>
          </div>
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
            <div className="text-2xl font-bold text-amber-600">{stats.waitlisted}</div>
            <div className="text-xs text-muted-foreground">{t.waitlisted}</div>
          </div>
          <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-muted-foreground">{t.total}</div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" /> {stats.male} {t.male}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" /> {stats.female} {t.female}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
