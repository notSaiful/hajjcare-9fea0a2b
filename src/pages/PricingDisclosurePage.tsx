import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Gift, Check, Info } from "lucide-react";

export default function PricingDisclosurePage() {
  const { language } = useLanguage();

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
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <IndianRupee className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pricing & Donations</h1>
          </div>

          <p className="text-muted-foreground mb-8 text-lg">
            Transparency is important to us. Here's everything you need to know about HajjCare's pricing and how we handle donations.
          </p>

          <div className="space-y-6">
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-6 w-6" />
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
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Donations (Voluntary)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you find HajjCare helpful and wish to support our mission, you can make a voluntary donation. These contributions help us:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Maintain and improve the platform</li>
                  <li>Add new languages and features</li>
                  <li>Keep the app running smoothly during peak Hajj season</li>
                  <li>Provide better support to pilgrims</li>
                </ul>
                
                <div className="bg-muted/50 p-4 rounded-lg border border-border mt-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Important Information About Donations
                  </h4>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                    <li>Donations are <strong>completely voluntary</strong> and not required to use the app</li>
                    <li>All features remain free regardless of donation status</li>
                    <li>Donations are processed securely through Razorpay</li>
                    <li>You will receive an email receipt for your records</li>
                    <li>Donations are generally non-refundable (see Refund Policy for details)</li>
                    <li>We do not store your payment card details</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Premium Services (Future Plans)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Currently, all HajjCare services are free. In the future, we may introduce optional premium features. If we do:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Core features will always remain free</li>
                  <li>Premium features will be clearly marked with their prices</li>
                  <li>All prices will be displayed in Indian Rupees (₹)</li>
                  <li>Prices will include all applicable taxes</li>
                  <li>No hidden fees or charges</li>
                  <li>Clear refund terms for any paid services</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Payment Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  All payments and donations are processed through <strong>Razorpay</strong>, a trusted and RBI-compliant payment gateway. When you make a payment:
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

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Currency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All prices and donations on HajjCare are displayed and processed in <strong>Indian Rupees (₹ / INR)</strong>.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Questions About Payments?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  If you have any questions about pricing, donations, or payments, please contact us:
                </p>
                <p className="text-muted-foreground">
                  <strong>Email:</strong> billing@hajjcare.app<br />
                  <strong>Support:</strong> support@hajjcare.app
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
