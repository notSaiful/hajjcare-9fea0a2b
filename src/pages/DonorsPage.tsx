import { useState } from "react";
import { Heart, Server, Shield, Languages, Accessibility, RefreshCw, AlertCircle, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage, getLocalizedText } from "@/contexts/LanguageContext";
import { donorsContent } from "@/data/donorsContent";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PRESET_AMOUNTS = [100, 250, 500, 1000];
const MIN_AMOUNT = 10;

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DonorsPage() {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const t = (key: keyof typeof donorsContent) => getLocalizedText(donorsContent[key], language);

  const getAmount = (): number => {
    if (customAmount) {
      return parseInt(customAmount, 10) || 0;
    }
    return selectedAmount || 0;
  };

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
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

  const handleDonate = async () => {
    const amount = getAmount();
    
    if (amount < MIN_AMOUNT) {
      toast({
        title: t("minimumAmount"),
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Failed to load payment gateway");
      }

      // Create order via edge function
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { amount: amount * 100, currency: "INR" },
      });

      if (error || !data?.order_id) {
        throw new Error(error?.message || "Failed to create order");
      }

      // Open Razorpay checkout
      const options = {
        key: data.key_id,
        amount: amount * 100,
        currency: "INR",
        name: "HajjCare",
        description: "Voluntary Donation",
        order_id: data.order_id,
        handler: function () {
          toast({
            title: t("donationSuccess"),
            description: `₹${amount}`,
          });
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        theme: {
          color: "#047857",
        },
        notes: {
          purpose: "HajjCare App Maintenance Donation",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function () {
        toast({
          title: t("donationFailed"),
          variant: "destructive",
        });
      });
      razorpay.open();
    } catch (err) {
      console.error("Donation error:", err);
      toast({
        title: t("donationFailed"),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const supportReasons = [
    { icon: Server, text: t("serverCosts") },
    { icon: Shield, text: t("securityMaintenance") },
    { icon: Languages, text: t("translations") },
    { icon: Accessibility, text: t("accessibilityImprovements") },
    { icon: RefreshCw, text: t("ongoingUpdates") },
  ];

  const disclaimers = [
    { icon: X, text: t("notGovtBody") },
    { icon: X, text: t("noServiceGuarantees") },
    { icon: X, text: t("noReligiousMerit") },
    { icon: Check, text: t("allFeaturesFree") },
    { icon: AlertCircle, text: t("notLinkedToGovt") },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("pageTitle")}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("pageSubtitle")}
            </p>
          </div>

          {/* Why We Need Support */}
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                {t("whySupport")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {supportReasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <reason.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{reason.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Important Disclaimers */}
          <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                {t("importantDisclaimers")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {disclaimers.map((disclaimer, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    disclaimer.icon === Check ? "bg-green-500/20" : "bg-muted"
                  }`}>
                    <disclaimer.icon className={`w-3 h-3 ${
                      disclaimer.icon === Check ? "text-green-600" : 
                      disclaimer.icon === AlertCircle ? "text-amber-500" : "text-muted-foreground"
                    }`} />
                  </div>
                  <span className="text-sm text-muted-foreground">{disclaimer.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Amount Selection */}
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                {t("selectAmount")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset Amounts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_AMOUNTS.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                    className={`h-12 text-base font-medium ${
                      selectedAmount === amount && !customAmount
                        ? "bg-primary text-primary-foreground"
                        : "border-border hover:bg-primary/10"
                    }`}
                    onClick={() => handlePresetSelect(amount)}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  {t("customAmount")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min={MIN_AMOUNT}
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder={t("enterAmount")}
                    className="pl-7 h-12 text-base"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                disabled={isProcessing || getAmount() < MIN_AMOUNT}
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    {t("proceedToDonate")} {getAmount() >= MIN_AMOUNT && `(₹${getAmount()})`}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Refund & Cancellation */}
          <Card className="mb-6 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                {t("refundCancellation")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("refundPolicy")}
              </p>
            </CardContent>
          </Card>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/terms-conditions" className="hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/refund-policy" className="hover:text-foreground transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
