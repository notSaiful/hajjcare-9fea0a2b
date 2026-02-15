import { IndianRupee } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface GstBreakdownProps {
  baseAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  serviceName: string;
}

export function GstBreakdown({ baseAmount, gstRate, gstAmount, totalAmount, serviceName }: GstBreakdownProps) {
  return (
    <div className="rounded-xl border-2 border-border/60 bg-muted/30 p-4 space-y-3">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <IndianRupee className="h-4 w-4 text-primary" />
        Price Breakdown
      </h4>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{serviceName}</span>
          <span className="font-medium text-foreground">₹{baseAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">GST @{gstRate}%</span>
          <span className="font-medium text-foreground">₹{gstAmount.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-base font-bold">
          <span className="text-foreground">Total Payable</span>
          <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
