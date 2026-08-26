import { MainLayout } from "@/components/MainLayout";
import { SEO } from "@/components/SEO";
import { PageHeader } from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <SEO title="Privacy Policy" description="How HajCare AI collects, uses, and protects your data — DPDP-aligned privacy practices for pilgrims." path="/privacy-policy" type="website" jsonLd={{"@context":"https://schema.org","@type":"WebPage","headline":"Privacy Policy","description":"How HajCare AI collects, uses, and protects your data — DPDP-aligned privacy practices for pilgrims.","url":"https://hajjcare.in/privacy-policy"}} />
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-3xl mx-auto px-4 py-8 pb-24">
          <PageHeader
            title="Privacy Policy"
            subtitle="Your privacy is important to us. This page explains how HajCare AI collects, uses, and protects your information."
            backLink="/"
            icon={ShieldCheck}
            iconVariant="primary"
          />

          <p className="text-sm text-muted-foreground mt-4 mb-8">Last updated: March 2026</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We may collect the following types of information to provide and improve our services:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
                <li>Name</li>
                <li>Email address</li>
                <li>Account login information</li>
                <li>App usage data</li>
                <li>Device information</li>
              </ul>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                This information is collected for the purpose of providing and improving the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The information we collect is used for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
                <li>Account authentication</li>
                <li>Providing app features</li>
                <li>Improving user experience</li>
                <li>App performance monitoring</li>
                <li>Customer support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                User data is stored securely using industry-standard security practices. Access to your data is restricted to authorized personnel only.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our app may integrate with the following types of third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
                <li>Authentication services</li>
                <li>Analytics tools</li>
                <li>Cloud hosting</li>
              </ul>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                These services follow their own privacy policies. We encourage you to review their policies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. User Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">As a user, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
                <li>Request deletion of your data</li>
                <li>Update your account information</li>
                <li>Contact support for any privacy-related questions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                This privacy policy may be updated occasionally. Users will be notified if significant changes occur. Continued use of HajCare AI after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-foreground font-medium mt-2">support@hajcare.ai</p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
