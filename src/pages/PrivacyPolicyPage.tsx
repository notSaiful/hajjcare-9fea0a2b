import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  return (
    <MainLayout>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Privacy Policy</h1>
          </div>

          <p className="text-muted-foreground mb-6">Last Updated: January 15, 2025</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. About HajjCare</h2>
              <p className="text-muted-foreground leading-relaxed">
                HajjCare ("we", "our", "us") is a digital guidance and support platform designed to assist pilgrims during their Hajj and Umrah journey. We are committed to protecting your privacy and handling your personal information with care and respect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Account Information:</strong> Name, email address, phone number when you create an account</li>
                <li><strong>Profile Information:</strong> Emergency contact details, embarkation point, family group preferences</li>
                <li><strong>Location Data:</strong> With your permission, we collect location data to help family members stay connected during Hajj</li>
                <li><strong>Usage Data:</strong> How you use our app, pages visited, features used</li>
                <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
                <li><strong>Payment Information:</strong> When making donations, payment details are processed securely by Razorpay</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide Hajj and Umrah guidance and support services</li>
                <li>To enable family location sharing features (only with your consent)</li>
                <li>To send important notifications about your journey</li>
                <li>To improve our services and user experience</li>
                <li>To process donations and provide receipts</li>
                <li>To respond to your questions and support requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Special Care for Sensitive Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                We understand that information related to religious practices is sensitive. We treat all data with the highest level of confidentiality. Your religious journey details are never shared with third parties for marketing or commercial purposes. Location sharing is completely optional and controlled by you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Storage and Security</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your data is stored on secure cloud servers with encryption</li>
                <li>We use industry-standard security measures to protect your information</li>
                <li>Access to personal data is restricted to authorized personnel only</li>
                <li>We regularly review and update our security practices</li>
                <li>Payment processing is handled by Razorpay, a PCI-DSS compliant payment gateway</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We share your information only in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Family Members:</strong> Location data is shared only with family group members you approve</li>
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our services (cloud hosting, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect safety</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                We never sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Disable location sharing at any time</li>
                <li>Opt out of promotional communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies to make our app work properly. We may use analytics to understand how our app is used, but this data is anonymized and not linked to your personal identity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are intended for users aged 13 and above. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or by email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or your data, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Email:</strong> privacy@hajjcare.app<br />
                <strong>Support:</strong> support@hajjcare.app
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
