import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, Shield, Check, Info, CreditCard, Sparkles, AlertTriangle, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";
import { InvoicePreview } from "@/components/billing/GstBreakdown";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const GST_RATE = 0.18;
const ORG_GSTIN = "27ABDCS8059C1Z8";

const PRESET_AMOUNTS = [
  { value: 99, label: "Basic" },
  { value: 199, label: "Standard" },
  { value: 499, label: "Premium" },
  { value: 999, label: "Patron" },
];

const labels = {
  title: {
    en: "Service Fees",
    ar: "رسوم الخدمة",
    ur: "سروس فیس",
    hi: "सेवा शुल्क",
  },
  subtitle: {
    en: "Optional fee to support app maintenance",
    ar: "رسوم اختيارية لدعم صيانة التطبيق",
    ur: "ایپ کی دیکھ بھال کے لیے اختیاری فیس",
    hi: "ऐप रखरखाव के लिए वैकल्पिक शुल्क",
  },
};

export default function PaymentPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number>(199);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getBaseAmount = () => {
    if (isCustomMode && customAmount && parseInt(customAmount) >= 10) {
      return parseInt(customAmount);
    }
    return selectedAmount;
  };

  const baseAmount = getBaseAmount();
  const gstAmount = Math.round(baseAmount * GST_RATE * 100) / 100;
  const totalAmount = Math.round((baseAmount + gstAmount) * 100) / 100;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const verifyAndCreateInvoice = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    status: "paid" | "failed"
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "verify-razorpay-payment",
        {
          body: {
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
            base_amount: Math.round(baseAmount * 100),
            gst_amount: Math.round(gstAmount * 100),
            total_amount: Math.round(totalAmount * 100),
            service_name: "HajjCare App Maintenance Service Fee",
            customer_name: user?.user_metadata?.full_name || null,
            customer_email: user?.email || null,
            org_gstin: ORG_GSTIN || null,
            status,
          },
        }
      );
      if (error) {
        console.error("Verification error:", error);
        return null;
      }
      return data?.invoice_number || null;
    } catch (err) {
      console.error("Failed to verify payment:", err);
      return null;
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with payment.",
        variant: "destructive",
      });
      return;
    }

    if (!ORG_GSTIN) {
      // Allow payment but warn — GST not configured
      console.warn("GSTIN not configured — invoices will be generated without GSTIN");
    }

    if (baseAmount < 10 || baseAmount > 100000) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be between ₹10 and ₹1,00,000",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway");

      // Send total amount (including GST) in paise to Razorpay
      const totalInPaise = Math.round(totalAmount * 100);

      const response = await supabase.functions.invoke("create-razorpay-order", {
        body: { amount: totalInPaise, currency: "INR" },
      });
      razorpay.open();

      if (response.error) throw new Error(response.error.message || "Failed to create order");

      const { order_id, key_id, amount: orderAmount, currency } = response.data;

      const options = {
        key: key_id,
        amount: orderAmount,
        currency: currency,
        name: "Hajj Care",
        description: `Service Fee ₹${baseAmount} + GST @18%`,
        order_id: order_id,
        prefill: {
          email: user.email || "",
        },
        theme: {
          color: "#16a34a",
        },
        handler: async function (resp: any) {
          // Server-side signature verification + invoice creation
          const invoiceNumber = await verifyAndCreateInvoice(
            order_id,
            resp.razorpay_payment_id,
            resp.razorpay_signature,
            "paid"
          );

          if (invoiceNumber) {
            toast({
              title: "Payment Successful! 🎉",
              description: "Invoice generated. View it in your billing history.",
            });
          } else {
            toast({
              title: "Verification Failed",
              description:
                "Payment received but could not be verified. Please contact support.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", async function (resp: any) {
        await verifyAndCreateInvoice(order_id, "", "", "failed");
        toast({
          title: "Payment Failed",
          description: resp.error.description || "Please try again",
          variant: "destructive",
        });
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-5">
        <PageHeader
          title={labels.title}
          subtitle={labels.subtitle}
          icon={CreditCard}
          iconVariant="primary"
        />

        {/* GSTIN Configuration Guidance */}
        {!ORG_GSTIN && (
          <Card className="border-2 border-destructive/20 bg-destructive/5 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 border-b border-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">GSTIN Not Configured</span>
              </div>
              <div className="px-4 py-3 space-y-2 text-sm text-muted-foreground">
                <p>
                  Invoices will be generated <strong className="text-foreground">without GSTIN</strong> until it is configured. 
                  This does not affect payment processing.
                </p>
                <div className="bg-muted/40 rounded-lg p-3 space-y-1.5 text-xs">
                  <p className="font-semibold text-foreground">How to fix:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Obtain your 15-digit GSTIN from the GST portal</li>
                    <li>Contact the admin at <a href="mailto:info@hajjcare.in" className="text-primary underline">info@hajjcare.in</a></li>
                    <li>Once configured, all future invoices will include GSTIN automatically</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amount Selection */}
        <Card className="border-2 border-primary/15 shadow-md overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <IndianRupee className="h-5 w-5 text-primary" />
              Select Amount
            </CardTitle>
            <CardDescription>
              Choose a preset or enter your own amount
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            {/* Preset Amount Grid */}
            <div className="grid grid-cols-2 gap-3">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    setSelectedAmount(preset.value);
                    setIsCustomMode(false);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "relative flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all duration-200",
                    "hover:shadow-md active:scale-[0.97] touch-manipulation select-none",
                    selectedAmount === preset.value && !isCustomMode
                      ? "border-primary bg-primary/8 shadow-sm ring-1 ring-primary/20"
                      : "border-border/60 bg-card hover:border-primary/30"
                  )}
                >
                  {preset.value === 199 && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                  <span className={cn(
                    "text-2xl font-bold",
                    selectedAmount === preset.value && !isCustomMode
                      ? "text-primary"
                      : "text-foreground"
                  )}>
                    ₹{preset.value}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Amount Toggle & Input */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsCustomMode(!isCustomMode);
                  if (!isCustomMode) setCustomAmount("");
                }}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 border-dashed transition-all",
                  "text-sm font-medium touch-manipulation",
                  isCustomMode
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                <IndianRupee className="h-4 w-4" />
                {isCustomMode ? "Custom Amount Selected" : "Enter Custom Amount"}
              </button>

              {isCustomMode && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <Label htmlFor="custom-amount" className="text-sm text-muted-foreground">
                    Enter amount (₹10 – ₹1,00,000)
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="custom-amount"
                      type="number"
                      min="10"
                      max="100000"
                      placeholder="Enter amount"
                      className="pl-9 h-12 text-lg border-2 focus:border-primary"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Persistent Invoice Preview */}
            <InvoicePreview
              baseAmount={baseAmount}
              gstRate={18}
              gstAmount={gstAmount}
              totalAmount={totalAmount}
              serviceName="HajjCare App Maintenance Service Fee"
              orgName="Sazo Management Private Limited"
              orgGstin={ORG_GSTIN || undefined}
            />

            {/* Pay Button */}
            <Button
              className="w-full h-13 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-shadow"
              onClick={handlePayment}
              disabled={isProcessing || authLoading || (isCustomMode && (!customAmount || parseInt(customAmount) < 10))}
              size="lg"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  Pay ₹{totalAmount.toFixed(2)} (incl. GST) <Shield className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {!user && !authLoading && (
              <p className="text-center text-sm text-muted-foreground">
                Please{" "}
                <a href="/auth" className="text-primary underline font-medium">
                  login
                </a>{" "}
                to proceed
              </p>
            )}
          </CardContent>
        </Card>

        {/* View Invoices */}
        {user && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => navigate("/billing-history")}
          >
            <Receipt className="h-4 w-4" />
            View Billing History & Invoices
          </Button>
        )}

        {/* Benefits */}
        <Card className="border-2 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              Your Support Helps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {[
                "Keep servers running during Hajj season",
                "Add new features and languages",
                "Maintain AI chat assistance",
                "Improve family tracking features",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border border-border/40 bg-muted/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary/70" />
              <div className="space-y-1">
                <p>This is an optional service fee, not a donation. Fees are non-refundable. GST @18% is applied as per Indian law.</p>
                <p>
                  Contact:{" "}
                  <a href="mailto:info@hajjcare.in" className="text-primary underline">
                    info@hajjcare.in
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
