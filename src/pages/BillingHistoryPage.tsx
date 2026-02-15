import { useEffect, useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download, IndianRupee, Calendar, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

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
  razorpay_payment_id: string | null;
  org_name: string;
  org_gstin: string | null;
  customer_name: string | null;
  customer_email: string | null;
}

export default function BillingHistoryPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchInvoices = async () => {
      const { data } = await supabase
        .from("billing_invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("invoice_date", { ascending: false });
      setInvoices((data as Invoice[]) || []);
      setLoading(false);
    };
    fetchInvoices();
  }, [user]);

  const formatAmount = (paise: number) => (paise / 100).toFixed(2);
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusColor = (status: string) => {
    switch (status) {
      case "paid": return "default";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-5">
        <PageHeader
          title={{ en: "Billing History", ar: "سجل الفواتير", ur: "بلنگ ہسٹری", hi: "बिलिंग इतिहास" }}
          subtitle={{ en: "Your invoices and payment records", ar: "فواتيرك وسجلات الدفع", ur: "آپ کی فیسیں اور ادائیگی کے ریکارڈ", hi: "आपके चालान और भुगतान रिकॉर्ड" }}
          icon={Receipt}
          iconVariant="primary"
        />

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <Card className="border-2 border-dashed border-border/60">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No invoices found. Make a payment to see your billing history.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <Card key={inv.id} className="border-2 border-border/50 overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm font-semibold">{inv.invoice_number}</span>
                    </div>
                    <Badge variant={statusColor(inv.payment_status) as any}>
                      {inv.payment_status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(inv.invoice_date)}
                  </div>

                  <Separator />

                  {/* Amount Breakdown */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{inv.service_name}</span>
                      <span>₹{formatAmount(inv.base_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST @{inv.gst_rate}%</span>
                      <span>₹{formatAmount(inv.gst_amount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total Paid</span>
                      <span className="text-primary">₹{formatAmount(inv.total_amount)}</span>
                    </div>
                  </div>

                  {/* Organization */}
                  <div className="text-xs text-muted-foreground pt-1 space-y-0.5">
                    <p>Billed by: {inv.org_name}</p>
                    {inv.org_gstin && <p>GSTIN: {inv.org_gstin}</p>}
                    {inv.razorpay_payment_id && <p>Txn ID: {inv.razorpay_payment_id}</p>}
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
