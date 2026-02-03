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

          <p className="text-muted-foreground mb-6">Last Updated: February 3, 2026</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section className="bg-primary/10 p-4 rounded-lg border border-primary/30">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Digital Services Only</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hajj Care, operated by <strong>Sazo Management Private Limited</strong>, is a <strong>100% digital platform</strong>. We do not sell, ship, or deliver any physical products. All our services are provided electronically through our mobile application and website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Nature of Our Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Hajj Care provides digital guidance and support services for Hajj and Umrah pilgrims. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Digital step-by-step guides for Hajj and Umrah rituals</li>
                <li>Interactive maps and navigation tools</li>
                <li>Real-time family location sharing features</li>
                <li>Audio and text dua guides</li>
                <li>Health and preparation information</li>
                <li>Emergency contact directories</li>
                <li>AI-powered chat assistance</li>
                <li>Document checklists and logistics guidance</li>
                <li>Safety tips and awareness content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Delivery of Digital Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All our digital services are delivered <strong>instantly</strong> upon:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Free Features:</strong> Available immediately upon creating an account or accessing the app—no payment required</li>
                <li><strong>Premium Features:</strong> Activated immediately after successful payment confirmation via Razorpay</li>
                <li><strong>Service Receipts:</strong> Digital payment confirmation sent instantly via email</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Access Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To access our digital services, you need:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>A smartphone, tablet, or computer with internet access</li>
                <li>A modern web browser (Chrome, Safari, Firefox, Edge) or our mobile application</li>
                <li>A valid email address for account creation and communication</li>
                <li>Active internet connection for real-time features (location sharing, chat assistance)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Offline Access</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some features of Hajj Care may be available offline after initial download, including saved dua guides, ritual instructions, and reference materials. However, features requiring real-time data—such as family location sharing, AI chat assistance, and live updates—require an active internet connection.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Service Availability</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Our services are available <strong>24 hours a day, 7 days a week, 365 days a year</strong></li>
                <li>Scheduled maintenance may occur occasionally with advance notice when possible</li>
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>During Hajj season (Dhul Hijjah), we provide enhanced support and monitoring</li>
                <li>Service disruptions may occur due to factors beyond our control (internet outages, server issues, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. No Physical Shipments</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To be absolutely clear:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We do <strong>NOT</strong> sell any physical products</li>
                <li>We do <strong>NOT</strong> ship any packages, parcels, or materials</li>
                <li>We do <strong>NOT</strong> require shipping addresses for our services</li>
                <li>There are <strong>NO</strong> shipping charges, delivery fees, or handling costs</li>
                <li>We do <strong>NOT</strong> arrange Hajj packages, travel, visas, or physical logistics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Digital Receipts and Invoices</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any payments made through our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>You will receive a digital receipt via email immediately after successful payment</li>
                <li>Receipts include transaction ID, amount, date, and service description</li>
                <li>Payment receipts can be used for your personal records</li>
                <li>Invoices are generated through Razorpay payment gateway</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Delivery Failures</h2>
              <p className="text-muted-foreground leading-relaxed">
                Since all services are digital, there are no physical delivery failures. However, if you experience issues accessing premium features after payment, please contact us immediately at <strong>support@hajjcare.app</strong> with your transaction details, and we will resolve the issue promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about accessing our digital services, please contact:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border border-border mt-3">
                <p className="text-muted-foreground">
                  <strong>Sazo Management Private Limited</strong><br />
                  <strong>Email:</strong> support@hajjcare.app<br />
                  <strong>Technical Support:</strong> tech@hajjcare.app
                </p>
              </div>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
