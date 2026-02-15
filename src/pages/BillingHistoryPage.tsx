import { useEffect, useState, useCallback } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Download, Calendar, Hash, FileText, Building2, User, Mail, CreditCard, FileDown, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  service_name: string;
  base_amount: number;
  gst_rate: number;
  gst_amount: number;
  total_amount: number;
  payment_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  org_name: string;
  org_address: string;
  org_gstin: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
}

const formatAmount = (paise: number) => (paise / 100).toFixed(2);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDateShort = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// Generate a printable PDF-style invoice in a new window
function generateInvoicePDF(inv: Invoice) {
  const html = `
<!DOCTYPE html>
<html><head>
<title>Invoice ${inv.invoice_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 3px solid #16a34a; }
  .logo-section h1 { font-size: 24px; color: #16a34a; font-weight: 800; letter-spacing: 1px; }
  .logo-section p { font-size: 11px; color: #666; margin-top: 2px; }
  .invoice-badge { background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 12px 20px; text-align: right; }
  .invoice-badge h2 { font-size: 18px; color: #16a34a; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
  .invoice-badge .inv-num { font-size: 14px; font-weight: 700; color: #1a1a1a; font-family: monospace; margin-top: 4px; }
  .invoice-badge .inv-date { font-size: 11px; color: #666; margin-top: 2px; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
  .party-box { padding: 16px; background: #fafafa; border-radius: 8px; border: 1px solid #e5e5e5; }
  .party-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; font-weight: 600; margin-bottom: 8px; }
  .party-box p { font-size: 13px; line-height: 1.6; }
  .party-box .name { font-weight: 700; font-size: 14px; }
  .party-box .gstin { font-family: monospace; font-size: 12px; color: #16a34a; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead th { background: #16a34a; color: white; padding: 10px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: left; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 13px; }
  tbody td:last-child { text-align: right; font-family: monospace; font-weight: 600; }
  tbody td .sub { font-size: 11px; color: #888; margin-top: 2px; }
  .total-row td { border-top: 2px solid #16a34a; border-bottom: none; font-weight: 700; font-size: 16px; padding-top: 14px; }
  .total-row td:last-child { color: #16a34a; font-size: 18px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: flex-end; }
  .footer-left { font-size: 11px; color: #888; line-height: 1.8; }
  .footer-right { text-align: right; }
  .seal { border: 2px solid #16a34a; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; color: #16a34a; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; text-align: center; line-height: 1.3; }
  .txn-info { background: #f8f8f8; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 12px; color: #555; }
  .txn-info span { font-weight: 600; color: #1a1a1a; }
  @media print { body { padding: 20px; } @page { margin: 1cm; } }
</style>
</head><body>

<div class="header">
  <div class="logo-section">
    <h1>HAJJ CARE</h1>
    <p>Digital Service Platform</p>
  </div>
  <div class="invoice-badge">
    <h2>Invoice</h2>
    <div class="inv-num">${inv.invoice_number}</div>
    <div class="inv-date">${formatDate(inv.invoice_date)}</div>
  </div>
</div>

<div class="parties">
  <div class="party-box">
    <h3>Billed By</h3>
    <p class="name">${inv.org_name}</p>
    <p>${inv.org_address || 'India'}</p>
    ${inv.org_gstin ? `<p class="gstin">GSTIN: ${inv.org_gstin}</p>` : '<p style="color:#cc6600;font-size:11px;">GSTIN: Not configured</p>'}
  </div>
  <div class="party-box">
    <h3>Billed To</h3>
    <p class="name">${inv.customer_name || 'N/A'}</p>
    ${inv.customer_email ? `<p>${inv.customer_email}</p>` : ''}
    ${inv.customer_phone ? `<p>${inv.customer_phone}</p>` : ''}
  </div>
</div>

<table>
  <thead>
    <tr><th>Description</th><th style="text-align:right">Amount (₹)</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>
        ${inv.service_name}
        <div class="sub">Digital service fee (non-refundable)</div>
      </td>
      <td>₹${formatAmount(inv.base_amount)}</td>
    </tr>
    <tr>
      <td>
        GST @${inv.gst_rate}%
        <div class="sub">Goods & Services Tax (India)</div>
      </td>
      <td>₹${formatAmount(inv.gst_amount)}</td>
    </tr>
    <tr class="total-row">
      <td>Total Amount Paid</td>
      <td>₹${formatAmount(inv.total_amount)}</td>
    </tr>
  </tbody>
</table>

${inv.razorpay_payment_id ? `
<div class="txn-info">
  Payment Transaction ID: <span>${inv.razorpay_payment_id}</span>
  ${inv.razorpay_order_id ? `<br/>Order ID: <span>${inv.razorpay_order_id}</span>` : ''}
</div>` : ''}

<div class="footer">
  <div class="footer-left">
    <p>This is a computer-generated invoice.</p>
    <p>For queries: info@hajjcare.in</p>
    <p>© ${new Date().getFullYear()} Sazo Management Pvt Ltd</p>
  </div>
  <div class="footer-right">
    <div class="seal">Digitally<br/>Verified</div>
  </div>
</div>

<script>window.onload = () => window.print();</script>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

function exportToCSV(invoices: Invoice[]) {
  const headers = [
    "Invoice Number",
    "Date",
    "Service",
    "Base Amount (₹)",
    "GST Rate (%)",
    "GST Amount (₹)",
    "Total Amount (₹)",
    "Status",
    "Transaction ID",
    "Organization",
    "GSTIN",
  ];

  const rows = invoices.map((inv) => [
    inv.invoice_number,
    formatDateShort(inv.invoice_date),
    inv.service_name,
    formatAmount(inv.base_amount),
    inv.gst_rate,
    formatAmount(inv.gst_amount),
    formatAmount(inv.total_amount),
    inv.payment_status,
    inv.razorpay_payment_id || "",
    inv.org_name,
    inv.org_gstin || "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hajjcare-invoices-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const statusVariant = (status: string) => {
  switch (status) {
    case "paid": return "default" as const;
    case "failed": return "destructive" as const;
    default: return "secondary" as const;
  }
};

export default function BillingHistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from("billing_invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("invoice_date", { ascending: false });
      if (error) console.error("Fetch invoices error:", error);
      setInvoices((data as Invoice[]) || []);
      setLoading(false);
    };
    fetchInvoices();
  }, [user]);

  const filteredInvoices = statusFilter === "all"
    ? invoices
    : invoices.filter((inv) => inv.payment_status === statusFilter);

  const totalPaid = invoices
    .filter((i) => i.payment_status === "paid")
    .reduce((sum, i) => sum + i.total_amount, 0);

  const handleExportCSV = useCallback(() => {
    if (filteredInvoices.length === 0) {
      toast({ title: "No data", description: "No invoices to export.", variant: "destructive" });
      return;
    }
    exportToCSV(filteredInvoices);
    toast({ title: "Exported!", description: "CSV file downloaded successfully." });
  }, [filteredInvoices, toast]);

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-5">
        <PageHeader
          title={{ en: "Billing History", ar: "سجل الفواتير", ur: "بلنگ ہسٹری", hi: "बिलिंग इतिहास" }}
          subtitle={{ en: "Your invoices and payment records", ar: "فواتيرك وسجلات الدفع", ur: "آپ کی فیسیں اور ادائیگی کے ریکارڈ", hi: "आपके चालान और भुगतान रिकॉर्ड" }}
          icon={Receipt}
          iconVariant="primary"
        />

        {/* Summary Stats */}
        {!loading && invoices.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="border border-border/50">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{invoices.length}</p>
                <p className="text-[11px] text-muted-foreground font-medium">Total Invoices</p>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-primary">₹{formatAmount(totalPaid)}</p>
                <p className="text-[11px] text-muted-foreground font-medium">Total Paid</p>
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardContent className="p-3 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {invoices.filter((i) => i.payment_status === "paid").length}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">Successful</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters & Export */}
        {!loading && invoices.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-sm" onClick={handleExportCSV}>
              <FileDown className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        )}

        {/* Invoice List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <Card className="border-2 border-dashed border-border/60">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{invoices.length === 0
                ? "No invoices found. Make a payment to see your billing history."
                : "No invoices match the selected filter."
              }</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((inv) => (
              <Card key={inv.id} className="border-2 border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  {/* Invoice Card Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-mono text-sm font-bold">{inv.invoice_number}</span>
                    </div>
                    <Badge variant={statusVariant(inv.payment_status)}>
                      {inv.payment_status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Date & Org */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(inv.invoice_date)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3 w-3" />
                        {inv.org_name}
                      </div>
                    </div>

                    {/* Customer */}
                    {(inv.customer_name || inv.customer_email) && (
                      <div className="flex items-center gap-3 text-xs">
                        {inv.customer_name && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground font-medium">{inv.customer_name}</span>
                          </span>
                        )}
                        {inv.customer_email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{inv.customer_email}</span>
                          </span>
                        )}
                      </div>
                    )}

                    <Separator />

                    {/* Amount Breakdown */}
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{inv.service_name}</span>
                        <span className="tabular-nums font-medium">₹{formatAmount(inv.base_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST @{inv.gst_rate}%</span>
                        <span className="tabular-nums font-medium">₹{formatAmount(inv.gst_amount)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                        <span className="text-foreground">Total</span>
                        <span className="text-primary tabular-nums">₹{formatAmount(inv.total_amount)}</span>
                      </div>
                    </div>

                    {/* GSTIN & Txn */}
                    <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
                      {inv.org_gstin ? (
                        <p className="font-mono">GSTIN: {inv.org_gstin}</p>
                      ) : (
                        <p className="text-destructive/70">GSTIN: Not configured</p>
                      )}
                      {inv.razorpay_payment_id && (
                        <p className="font-mono">Txn: {inv.razorpay_payment_id}</p>
                      )}
                    </div>

                    {/* Download Button */}
                    {inv.payment_status === "paid" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 mt-2"
                        onClick={() => generateInvoicePDF(inv)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download Invoice PDF
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
