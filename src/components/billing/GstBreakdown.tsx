import { IndianRupee, FileText, Building2, Calendar, Hash, User, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface InvoicePreviewProps {
  baseAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  serviceName: string;
  customerName?: string | null;
  customerEmail?: string | null;
  orgName?: string;
  orgGstin?: string;
}

export function InvoicePreview({
  baseAmount,
  gstRate,
  gstAmount,
  totalAmount,
  serviceName,
  customerName,
  customerEmail,
  orgName = "Sazo Management Private Limited",
  orgGstin,
}: InvoicePreviewProps) {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
      {/* Invoice Header */}
      <div className="bg-primary/5 border-b border-primary/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">
                Invoice Preview
              </h3>
              <p className="text-[11px] text-muted-foreground">GST-Compliant • Pre-Checkout</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
            Draft
          </span>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Organization & Date Row */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <Building2 className="h-3 w-3" /> Billed By
            </div>
            <p className="font-semibold text-foreground text-[13px] leading-tight">{orgName}</p>
            {orgGstin && (
              <p className="text-muted-foreground font-mono text-[11px]">GSTIN: {orgGstin}</p>
            )}
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium justify-end">
              <Calendar className="h-3 w-3" /> Date
            </div>
            <p className="font-semibold text-foreground text-[13px]">{today}</p>
            <p className="text-muted-foreground font-mono text-[11px]">
              <Hash className="h-2.5 w-2.5 inline mr-0.5" />
              Auto-generated on payment
            </p>
          </div>
        </div>

        {/* Customer Info */}
        {(customerName || customerEmail) && (
          <>
            <Separator />
            <div className="text-xs space-y-1">
              <p className="text-muted-foreground font-medium mb-1.5">Billed To</p>
              {customerName && (
                <div className="flex items-center gap-1.5">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground font-medium">{customerName}</span>
                </div>
              )}
              {customerEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-foreground">{customerEmail}</span>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Line Items Table */}
        <div className="space-y-0">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto] gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2">
            <span>Description</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Service Row */}
          <div className="grid grid-cols-[1fr_auto] gap-2 py-2.5 text-sm border-t border-border/40">
            <div>
              <p className="font-medium text-foreground">{serviceName}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Digital service fee (non-refundable)</p>
            </div>
            <span className="font-semibold text-foreground tabular-nums text-right">
              ₹{baseAmount.toFixed(2)}
            </span>
          </div>

          {/* GST Row */}
          <div className="grid grid-cols-[1fr_auto] gap-2 py-2.5 text-sm border-t border-border/40">
            <div>
              <p className="font-medium text-foreground">GST @{gstRate}%</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Goods & Services Tax (India)
              </p>
            </div>
            <span className="font-semibold text-foreground tabular-nums text-right">
              ₹{gstAmount.toFixed(2)}
            </span>
          </div>

          {/* Total */}
          <div className="grid grid-cols-[1fr_auto] gap-2 py-3 border-t-2 border-primary/20 mt-1">
            <span className="text-base font-bold text-foreground">Total Payable</span>
            <span className="text-lg font-bold text-primary tabular-nums text-right">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5 leading-relaxed">
          <p>
            This is a preview of your invoice. A final GST-compliant invoice with a unique
            invoice number and transaction ID will be generated after successful payment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Keep backward compatibility
export function GstBreakdown(props: {
  baseAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  serviceName: string;
}) {
  return <InvoicePreview {...props} />;
}
