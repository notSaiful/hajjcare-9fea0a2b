import { useRef } from "react";
import { IndianRupee, FileText, Building2, Calendar, Hash, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const handleDownloadPDF = () => {
    const html = `
      <!DOCTYPE html><html><head><title>Invoice Preview - HajjCare</title>
      <style>
        body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#1a1a1a}
        .header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #16a34a;padding-bottom:16px;margin-bottom:24px}
        .header h1{font-size:22px;color:#16a34a;margin:0}
        .badge{background:#f0fdf4;color:#16a34a;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase}
        .meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;font-size:13px}
        .meta .label{color:#666;font-size:11px;text-transform:uppercase;font-weight:600;margin-bottom:4px}
        table{width:100%;border-collapse:collapse;margin:20px 0}
        th{text-align:left;font-size:11px;text-transform:uppercase;color:#666;padding:8px 0;border-bottom:2px solid #e5e7eb}
        th:last-child,td:last-child{text-align:right}
        td{padding:12px 0;border-bottom:1px solid #f3f4f6;font-size:14px}
        .total-row td{border-top:3px solid #16a34a;border-bottom:none;font-size:18px;font-weight:700;padding-top:16px}
        .total-row td:last-child{color:#16a34a}
        .footer{margin-top:24px;padding:12px 16px;background:#f9fafb;border-radius:8px;font-size:11px;color:#666}
        @media print{body{margin:0;padding:20px}}
      </style></head><body>
      <div class="header">
        <h1>📋 Invoice Preview</h1>
        <span class="badge">Draft</span>
      </div>
      <div class="meta">
        <div><div class="label">Billed By</div><strong>${orgName}</strong>${orgGstin ? `<br><span style="font-size:11px;color:#666">GSTIN: ${orgGstin}</span>` : ""}</div>
        <div style="text-align:right"><div class="label">Date</div><strong>${today}</strong></div>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>${serviceName}<br><span style="font-size:11px;color:#888">Digital service fee (non-refundable)</span></td><td>₹${baseAmount.toFixed(2)}</td></tr>
          <tr><td>GST @${gstRate}%<br><span style="font-size:11px;color:#888">Goods & Services Tax (India)</span></td><td>₹${gstAmount.toFixed(2)}</td></tr>
          <tr class="total-row"><td>Total Payable</td><td>₹${totalAmount.toFixed(2)}</td></tr>
        </tbody>
      </table>
      <div class="footer">This is a draft invoice preview. A final GST-compliant invoice will be generated after successful payment.</div>
      </body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 300);
    }
  };

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

        {/* Download PDF Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-sm"
          onClick={handleDownloadPDF}
        >
          <Download className="h-4 w-4" />
          Download Invoice Preview as PDF
        </Button>
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
