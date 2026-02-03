import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

export default function TermsConditionsPage() {
  const { language } = useLanguage();

  return (
    <MainLayout>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Terms & Conditions</h1>
          </div>

          <p className="text-muted-foreground mb-6">Last Updated: February 3, 2026</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions constitute a legally binding agreement between you ("User", "you", "your") and <strong>Sazo Management Private Limited</strong> ("Company", "we", "us", "our"), governing your use of the Hajj Care platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing, downloading, installing, or using Hajj Care ("the App", "the Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any provision of these terms, you must immediately discontinue use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Definitions</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>"Platform"</strong> refers to the Hajj Care mobile application and website</li>
                <li><strong>"Services"</strong> refers to all digital services, features, and content provided through the Platform</li>
                <li><strong>"Service Fee"</strong> refers to the optional, non-refundable fee charged for premium features and services</li>
                <li><strong>"User"</strong> refers to any individual who accesses or uses the Platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Nature of Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Hajj Care is a digital guidance and support platform that provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Step-by-step guidance for Hajj and Umrah rituals</li>
                <li>Interactive maps and navigation assistance</li>
                <li>Family location sharing features</li>
                <li>Dua and prayer guides</li>
                <li>Health and preparation tips</li>
                <li>Emergency contact directories</li>
                <li>Document checklists and logistics assistance</li>
                <li>AI-powered chat support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Service Fee and Payment Terms</h2>
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/30 mb-4">
                <p className="text-foreground font-semibold mb-2">IMPORTANT CLARIFICATION:</p>
                <p className="text-muted-foreground leading-relaxed">
                  Hajj Care is a <strong>paid digital service platform</strong>. We do NOT accept donations, charity, zakat, or religious contributions. Any payment made on this platform is a <strong>service fee for digital services</strong>, not a charitable contribution.
                </p>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Service fees are charged for accessing premium features and assistance services</li>
                <li>All payments are processed securely through Razorpay payment gateway</li>
                <li>Service fees are <strong>optional and non-refundable</strong> once paid</li>
                <li>Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes</li>
                <li>We reserve the right to modify pricing with prior notice</li>
                <li>Payment confirmation will be sent via email</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Important Disclaimers</h2>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground leading-relaxed mb-3">
                  <strong>Please understand that Hajj Care:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Does NOT provide religious rulings (fatwas).</strong> For religious guidance, consult qualified Islamic scholars.</li>
                  <li><strong>Does NOT provide medical advice.</strong> For health concerns, consult qualified medical professionals.</li>
                  <li><strong>Does NOT provide legal advice.</strong> For legal matters, consult qualified legal professionals.</li>
                  <li><strong>Does NOT arrange Hajj/Umrah packages, visas, or travel.</strong> We provide digital guidance only.</li>
                  <li><strong>Is NOT a charity, crowdfunding, or religious fund collection platform.</strong></li>
                  <li><strong>All content is informational and for digital assistance purposes only.</strong></li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. User Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">To use Hajj Care, you must:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Be at least 18 years of age (or use under parental supervision if a minor)</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Provide accurate and complete registration information</li>
                <li>Comply with all applicable Indian laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">As a user, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and truthful information during registration</li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Use the Platform only for its intended purpose</li>
                <li>Respect other users and refrain from harassment or abuse</li>
                <li>Not attempt to hack, disrupt, or misuse the Platform</li>
                <li>Not share your account with unauthorized persons</li>
                <li>Promptly notify us of any unauthorized account access</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Prohibited Activities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">You must NOT use Hajj Care to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Spread misinformation, false content, or propaganda</li>
                <li>Engage in any illegal, fraudulent, or unauthorized activities</li>
                <li>Harass, threaten, defame, or harm other users</li>
                <li>Attempt to access other users' accounts or data</li>
                <li>Upload malicious software, viruses, or harmful content</li>
                <li>Use automated bots or scrapers without permission</li>
                <li>Circumvent security measures or access controls</li>
                <li>Infringe upon intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Intellectual Property Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, functionality, trademarks, logos, graphics, software, and intellectual property on Hajj Care are owned by Sazo Management Private Limited or its licensors and are protected under Indian intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the Platform for personal, non-commercial purposes. Any unauthorized reproduction, distribution, or modification is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Account Suspension and Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend, restrict, or terminate your account without prior notice if you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Violate these Terms and Conditions</li>
                <li>Engage in fraudulent or abusive behavior</li>
                <li>Cause harm to other users or the Platform</li>
                <li>Fail to pay applicable service fees</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                You may delete your account at any time through the app settings. Upon termination, your right to use the Platform ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To the maximum extent permitted by applicable Indian law:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Hajj Care is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, express or implied</li>
                <li>We do not warrant that the Platform will be uninterrupted, error-free, or completely secure</li>
                <li>We are not liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform</li>
                <li>We are not responsible for actions you take based on information provided on the Platform</li>
                <li>We are not liable for technical failures, service interruptions, or data loss</li>
                <li>Our maximum aggregate liability shall not exceed the total service fees paid by you in the preceding 12 months, or INR 1,000, whichever is higher</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless Sazo Management Private Limited, its directors, officers, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hajj Care may integrate with third-party services including payment processors (Razorpay), map providers, and cloud services. These services operate under their own terms and privacy policies. We are not responsible for the content, practices, or availability of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms and Conditions at any time. Significant changes will be notified through the Platform or via email at least 15 days before they take effect. Your continued use of Hajj Care after such changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">15. Governing Law and Jurisdiction</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of Hajj Care shall be subject to the exclusive jurisdiction of the courts in [City], India. Before initiating legal proceedings, parties agree to attempt resolution through good-faith negotiation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">16. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such invalidity shall not affect the validity of the remaining provisions, which shall continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">17. Entire Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Sazo Management Private Limited regarding your use of Hajj Care, superseding any prior agreements or understandings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">18. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms and Conditions, please contact:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border border-border mt-3">
                <p className="text-muted-foreground">
                  <strong>Sazo Management Private Limited</strong><br />
                  <strong>Email:</strong> legal@hajjcare.app<br />
                  <strong>Support:</strong> support@hajjcare.app<br />
                  <strong>Jurisdiction:</strong> India
                </p>
              </div>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
