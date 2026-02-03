import { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, Shield, Check, Info, CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PRESET_AMOUNTS = [99, 199, 499, 999];

export default function PaymentPage() {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number>(199);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const labels = {
    title: {
      en: "Service Fee Payment",
      ar: "دفع رسوم الخدمة",
      ur: "سروس فیس ادائیگی",
      hi: "सेवा शुल्क भुगतान",
    },
    subtitle: {
      en: "Optional fee to support app maintenance",
      ar: "رسوم اختيارية لدعم صيانة التطبيق",
      ur: "ایپ کی دیکھ بھال کے لیے اختیاری فیس",
      hi: "ऐप रखरखाव के लिए वैकल्पिक शुल्क",
    },
    back: {
      en: "Back",
      ar: "رجوع",
      ur: "واپس",
      hi: "वापस",
    },
  };

  const getFinalAmount = () => {
    if (customAmount && parseInt(customAmount) >= 10) {
      return parseInt(customAmount);
    }
    return selectedAmount;
  };

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

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with payment.",
        variant: "destructive",
      });
      return;
    }

    const amount = getFinalAmount();
    if (amount < 10) {
      toast({
        title: "Minimum Amount",
        description: "Minimum amount is ₹10",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Failed to load payment gateway");
      }

      const response = await supabase.functions.invoke("create-razorpay-order", {
        body: { amount: amount * 100, currency: "INR" },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create order");
      }

      const { order_id, key_id, amount: orderAmount, currency } = response.data;

      const options = {
        key: key_id,
        amount: orderAmount,
        currency: currency,
        name: "Hajj Care",
        description: "Service Fee",
        order_id: order_id,
        prefill: {
          email: user.email || "",
        },
        theme: {
          color: "#16a34a",
        },
        handler: function () {
          toast({
            title: "Payment Successful! 🎉",
            description: "Thank you for supporting Hajj Care.",
          });
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description || "Please try again",
          variant: "destructive",
        });
      });
      razorpay.open();
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
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 h-10 sm:h-9 text-sm">
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {labels.back[language] || labels.back.en}
          </Button>
        </Link>

        {/* Header */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-soft border-2 border-primary/20">
              <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
              <p className="text-sm text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
            </div>
          </div>
        </div>

        {/* Amount Selection Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Select Amount
            </CardTitle>
            <CardDescription>
              Choose a preset or enter a custom amount
            </CardDescription>
          </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {PRESET_AMOUNTS.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                    className="h-14 text-lg font-semibold"
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom amount (min ₹10)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="custom-amount"
                    type="number"
                    min="10"
                    max="100000"
                    placeholder="Enter amount"
                    className="pl-9"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full h-12 text-lg"
                onClick={handlePayment}
                disabled={isProcessing || authLoading}
              >
                {isProcessing ? (
                  "Processing..."
                ) : (
                  <>
                    Pay ₹{getFinalAmount()} <Shield className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {!user && !authLoading && (
                <p className="text-center text-sm text-muted-foreground">
                  Please{" "}
                  <a href="/auth" className="text-primary underline">
                    login
                  </a>{" "}
                  to proceed
                </p>
              )}
            </CardContent>
          </Card>

        {/* Benefits Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-lg">Your Support Helps</CardTitle>
          </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "Keep servers running during Hajj season",
                  "Add new features and languages",
                  "Maintain AI chat assistance",
                  "Improve family tracking features",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        {/* Disclaimer */}
        <Card className="border-2 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
              <div>
                <p>This is an optional service fee, not a donation. Fees are non-refundable.</p>
                <p className="mt-1">
                  Contact: <a href="mailto:info@hajjcare.in" className="text-primary underline">info@hajjcare.in</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
