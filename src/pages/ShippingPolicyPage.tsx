import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package } from "lucide-react";

export default function ShippingPolicyPage() {
  const { language } = useLanguage();

  return (
    <MainLayout>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shipping & Delivery Policy</h1>
          </div>

          <p className="text-muted-foreground mb-6">Last Updated: January 15, 2025</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section className="bg-muted/50 p-4 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-3">Digital Services Only</h2>
              <p className="text-muted-foreground leading-relaxed">
                HajjCare is a <strong>100% digital platform</strong>. We do not sell, ship, or deliver any physical products. All our services are provided electronically through our mobile application and website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Nature of Our Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                HajjCare provides digital guidance and support services for Hajj and Umrah pilgrims. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Digital step-by-step guides for rituals</li>
                <li>Interactive maps and navigation</li>
                <li>Real-time family location sharing</li>
                <li>Audio and text duas</li>
                <li>Health and preparation information</li>
                <li>Emergency contact directories</li>
                <li>AI-powered chat assistance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Delivery of Digital Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All our digital services are delivered instantly upon:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Free Features:</strong> Available immediately upon creating an account or accessing the app</li>
                <li><strong>Premium Features (if applicable):</strong> Activated immediately after successful payment confirmation</li>
                <li><strong>Donations:</strong> No service delivery required; you receive an instant confirmation receipt</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Access Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To access our digital services, you need:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>A smartphone, tablet, or computer with internet access</li>
                <li>A modern web browser or our mobile application</li>
                <li>A valid email address for account creation</li>
                <li>Active internet connection for real-time features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Offline Access</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some features of HajjCare may be available offline after initial download. However, features like family location sharing, chat assistance, and real-time updates require an active internet connection.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Service Availability</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Our services are available 24/7, 365 days a year</li>
                <li>We may occasionally have scheduled maintenance with advance notice</li>
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>During Hajj season, we provide enhanced support and monitoring</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. No Physical Shipments</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be absolutely clear:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>We do not sell any physical products</li>
                <li>We do not ship any packages or materials</li>
                <li>We do not require shipping addresses</li>
                <li>There are no shipping charges or delivery fees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Digital Receipts</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any payments or donations made through our platform, you will receive a digital receipt via email immediately after the transaction is processed. This receipt can be used for your records.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about accessing our digital services, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Email:</strong> support@hajjcare.app
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
