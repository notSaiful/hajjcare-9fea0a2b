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

          <p className="text-muted-foreground mb-6">Last Updated: February 3, 2026</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section className="bg-muted/50 p-4 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-3">About This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Privacy Policy is published in compliance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and other applicable Indian laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. About Hajj Care</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hajj Care is a digital guidance and support platform operated by <strong>Sazo Management Private Limited</strong>, a company incorporated under the laws of India. We provide digital services to assist pilgrims during their Hajj and Umrah journey. We are committed to protecting your privacy and handling your personal information in accordance with applicable Indian data protection laws.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                <strong>Company:</strong> Sazo Management Private Limited<br />
                <strong>Platform:</strong> Hajj Care<br />
                <strong>Jurisdiction:</strong> India
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We collect the following categories of information:</p>
              
              <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">2.1 Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Account Information:</strong> Full name, email address, mobile phone number</li>
                <li><strong>Profile Information:</strong> Emergency contact details, embarkation point, family group preferences</li>
                <li><strong>Identity Information:</strong> As may be required for verification purposes</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">2.2 Sensitive Personal Data or Information (SPDI)</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                As defined under the IT Rules, 2011, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Financial Information:</strong> Payment details processed securely via Razorpay (we do not store card details)</li>
                <li><strong>Health Information:</strong> Only if voluntarily provided for emergency assistance purposes</li>
              </ul>

              <h3 className="text-lg font-medium mt-4 mb-2 text-foreground">2.3 Technical Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Location Data:</strong> With explicit consent, for family location sharing features</li>
                <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address</li>
                <li><strong>Usage Data:</strong> App usage patterns, pages visited, features accessed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Purpose of Data Collection</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We use your information for:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Providing Hajj and Umrah digital guidance and support services</li>
                <li>Enabling family location sharing features (with your explicit consent)</li>
                <li>Processing service fee payments through Razorpay</li>
                <li>Sending important notifications about your pilgrimage journey</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Improving our services and user experience</li>
                <li>Complying with legal obligations under Indian law</li>
                <li>Preventing fraud and ensuring platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Consent</h2>
              <p className="text-muted-foreground leading-relaxed">
                By using Hajj Care, you consent to the collection, use, and disclosure of your information as described in this Privacy Policy. For sensitive personal data, we obtain your explicit consent before collection. You may withdraw your consent at any time by contacting us, subject to legal or contractual restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                In accordance with the IT Rules, 2011, we implement reasonable security practices including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Data encryption at rest and in transit using industry-standard protocols</li>
                <li>Secure cloud servers with access controls and authentication</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Restricted access to personal data on a need-to-know basis</li>
                <li>Payment processing via Razorpay, a PCI-DSS compliant payment gateway</li>
                <li>Data retention limited to the period necessary for the purposes collected</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Family Members:</strong> Location data shared only with family group members you explicitly approve</li>
                <li><strong>Service Providers:</strong> Trusted third-party partners (cloud hosting, payment processing) bound by confidentiality obligations</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government authority</li>
                <li><strong>Safety and Security:</strong> To protect the rights, property, or safety of our users or others</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3 font-medium">
                We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Your Rights Under Indian Law</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">You have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Right to Access:</strong> Request access to your personal data held by us</li>
                <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing (may affect service availability)</li>
                <li><strong>Right to Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Right to Grievance Redressal:</strong> Lodge complaints with our Grievance Officer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies and similar technologies to ensure proper functioning of our platform. Analytics data collected is anonymized and not linked to your personal identity. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law. Upon account deletion, your data will be removed within a reasonable timeframe, except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hajj Care is intended for users aged 18 years and above. We do not knowingly collect personal information from persons under 18 years of age. If you are a minor, please use our services under parental supervision.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Cross-Border Data Transfer</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be transferred to and processed in countries outside India where our service providers are located. We ensure that such transfers comply with applicable data protection laws and that adequate safeguards are in place.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. Significant changes will be notified through the app or via email. Continued use of Hajj Care after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Grievance Officer</h2>
              <p className="text-muted-foreground leading-relaxed">
                In accordance with the Information Technology Act, 2000 and rules made thereunder, the contact details of the Grievance Officer are:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border border-border mt-3">
                <p className="text-muted-foreground">
                  <strong>Grievance Officer:</strong> Sazo Management Private Limited<br />
                  <strong>Email:</strong> info@hajjcare.in<br />
                  <strong>Response Time:</strong> Within 30 days of receiving the complaint
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about this Privacy Policy or your personal data, please contact:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Sazo Management Private Limited</strong><br />
                <strong>Email:</strong> info@hajjcare.in
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
