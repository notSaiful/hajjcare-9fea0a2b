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

          <p className="text-muted-foreground mb-6">Last Updated: January 15, 2025</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using HajjCare ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. About Our Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                HajjCare is a digital guidance and support platform that provides informational content and assistance tools for Hajj and Umrah pilgrims. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>Step-by-step guidance for Hajj and Umrah rituals</li>
                <li>Maps and navigation assistance</li>
                <li>Family location sharing features</li>
                <li>Dua and prayer guidance</li>
                <li>Health and preparation tips</li>
                <li>Emergency contact information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Important Disclaimers</h2>
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-muted-foreground leading-relaxed mb-3">
                  <strong>Please understand that HajjCare:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Does NOT provide religious rulings (fatwas).</strong> For religious guidance, please consult qualified Islamic scholars or your local religious authority.</li>
                  <li><strong>Does NOT provide medical advice.</strong> For health concerns, please consult qualified medical professionals.</li>
                  <li><strong>Does NOT provide legal advice.</strong> For legal matters, please consult qualified legal professionals.</li>
                  <li><strong>All content is informational and for assistance purposes only.</strong></li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">As a user of HajjCare, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide accurate and truthful information when creating your account</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Use the app only for its intended purpose</li>
                <li>Respect other users and not engage in harassment or abuse</li>
                <li>Not attempt to hack, disrupt, or misuse the app</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not share your account with others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">You must NOT use HajjCare to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Spread misinformation or false content</li>
                <li>Engage in any illegal activities</li>
                <li>Harass, threaten, or harm other users</li>
                <li>Attempt to access other users' accounts or data</li>
                <li>Upload malicious software or content</li>
                <li>Use automated systems to access the app without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Account Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate your account if you violate these terms, engage in abusive behavior, or use the app in ways that harm other users or our services. You may also delete your account at any time through the app settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                HajjCare is provided "as is" without warranties of any kind. We strive to provide accurate and helpful information, but we cannot guarantee that all content is error-free or complete. To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>We are not liable for any direct, indirect, or consequential damages arising from your use of the app</li>
                <li>We are not responsible for actions you take based on information provided in the app</li>
                <li>We are not liable for technical issues, service interruptions, or data loss</li>
                <li>Our total liability shall not exceed the amount you paid for our services, if any</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of HajjCare, including but not limited to text, graphics, logos, and software, are owned by HajjCare or its licensors and are protected by intellectual property laws. You may not copy, modify, distribute, or reproduce our content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                HajjCare may integrate with third-party services (such as payment processors, map providers). These services have their own terms and privacy policies, and we are not responsible for their content or practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms and Conditions from time to time. We will notify you of significant changes through the app or by email. Continued use of the app after changes means you accept the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of HajjCare shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Email:</strong> legal@hajjcare.app<br />
                <strong>Support:</strong> support@hajjcare.app
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
