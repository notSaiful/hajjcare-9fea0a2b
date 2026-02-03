import { Link } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Gift, Check, Info, ArrowLeft, ArrowRight, CreditCard, Shield } from "lucide-react";

export default function PricingDisclosurePage() {
  const { language, isRTL } = useLanguage();

  const labels = {
    title: {
      en: "Pricing & Service Fees",
      ar: "الأسعار ورسوم الخدمة",
      ur: "قیمتیں اور سروس فیس",
      hi: "मूल्य निर्धारण और सेवा शुल्क",
    },
    subtitle: {
      en: "Transparency is important to us",
      ar: "الشفافية مهمة بالنسبة لنا",
      ur: "شفافیت ہمارے لیے اہم ہے",
      hi: "पारदर्शिता हमारे लिए महत्वपूर्ण है",
    },
    back: {
      en: "Back",
      ar: "رجوع",
      ur: "واپس",
      hi: "वापस",
    },
  };

  const freeFeatures = [
    "Step-by-step Hajj and Umrah guidance",
    "Interactive maps of Makkah and Madinah",
    "Complete Dua and prayer collections",
    "Family location sharing",
    "AI-powered chat assistance",
    "Health and preparation guides",
    "Emergency contact directory",
    "Multi-language support (11+ languages)",
    "Offline access to key content",
    "Real-time family coordination",
  ];

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
              <IndianRupee className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{labels.title[language] || labels.title.en}</h1>
              <p className="text-sm text-muted-foreground">{labels.subtitle[language] || labels.subtitle.en}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Free Features Card */}
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Free for Everyone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                HajjCare's core features are <strong>completely free</strong>. We believe every pilgrim deserves access to quality guidance and support, regardless of their financial situation.
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Fee Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Optional Service Fee
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you find HajjCare helpful and wish to support app maintenance, you can pay an optional service fee. These contributions help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Maintain and improve the platform</li>
                <li>Add new languages and features</li>
                <li>Keep the app running smoothly during peak Hajj season</li>
                <li>Provide better support to pilgrims</li>
              </ul>
              
              <div className="bg-muted/50 p-4 rounded-lg border-2 border-border mt-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Important Information
                </h4>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Service fees are <strong>completely optional</strong> and not required to use the app</li>
                  <li>All features remain free regardless of payment</li>
                  <li>Payments are processed securely through Razorpay</li>
                  <li>You will receive an email receipt for your records</li>
                  <li>Service fees are <strong>non-refundable</strong> (see Refund Policy for details)</li>
                  <li>We do not store your payment card details</li>
                  <li>This is NOT a donation, charity, zakat, or religious contribution</li>
                </ul>
              </div>

              <Link to="/payment">
                <Button className="w-full mt-4">
                  Pay Optional Service Fee
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Payment Processing Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Payment Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                All payments are processed through <strong>Razorpay</strong>, a trusted and RBI-compliant payment gateway. When you make a payment:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your payment is processed securely using bank-grade encryption</li>
                <li>We accept UPI, debit cards, credit cards, and net banking</li>
                <li>Your card details are never stored on our servers</li>
                <li>Razorpay is PCI-DSS compliant for maximum security</li>
                <li>You'll receive an instant confirmation and receipt via email</li>
              </ul>
            </CardContent>
          </Card>

          {/* Currency Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Currency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All prices and service fees on HajjCare are displayed and processed in <strong>Indian Rupees (₹ / INR)</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Questions About Payments?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">
                If you have any questions about pricing or payments, please contact us:
              </p>
              <p className="text-muted-foreground">
                <strong>Email:</strong> info@hajjcare.in
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
