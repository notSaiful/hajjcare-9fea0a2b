import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw } from "lucide-react";

export default function RefundPolicyPage() {
  const { language } = useLanguage();

  return (
    <MainLayout>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <RotateCcw className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Refund & Cancellation Policy</h1>
          </div>

          <p className="text-muted-foreground mb-6">Last Updated: February 3, 2026</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section className="bg-primary/10 p-4 rounded-lg border border-primary/30">
              <h2 className="text-xl font-semibold mb-3 text-foreground">Important Notice</h2>
              <p className="text-muted-foreground leading-relaxed">
                All service fees paid on Hajj Care are <strong>optional and non-refundable</strong>. By making a payment, you acknowledge and agree to this non-refundable policy. Please read this policy carefully before making any payment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">1. About This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Refund and Cancellation Policy is published by <strong>Sazo Management Private Limited</strong> for the Hajj Care platform. This policy governs all payments made through our platform for digital services and premium features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Nature of Payments</h2>
              <div className="bg-muted/50 p-4 rounded-lg border border-border mb-4">
                <p className="text-muted-foreground leading-relaxed mb-3">
                  <strong>CLARIFICATION:</strong> Hajj Care is a paid digital service platform.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Payments are <strong>service fees</strong> for accessing premium app features and assistance services</li>
                  <li>We do NOT accept donations, charity, zakat, or religious contributions</li>
                  <li>All payments are processed through Razorpay as digital service fees</li>
                  <li>This is NOT a charity, crowdfunding, or religious fund collection platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Non-Refundable Service Fee Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                All service fees paid on Hajj Care are <strong>non-refundable</strong>. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Premium feature access fees</li>
                <li>Subscription fees for premium services</li>
                <li>One-time service fees</li>
                <li>Any other payments made for digital services</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                By making a payment, you acknowledge that you have read and understood this non-refundable policy and agree to proceed without expectation of a refund.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Free Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Many core features of Hajj Care are provided free of charge, including basic Hajj and Umrah guidance, ritual instructions, dua guides, and emergency contact information. No payment or refund applies to free services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Exceptional Circumstances</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Refunds may be considered <strong>only</strong> in the following exceptional circumstances, at our sole discretion:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Duplicate Payment:</strong> If the same transaction was charged multiple times due to a technical error</li>
                <li><strong>Incorrect Amount:</strong> If an amount different from the displayed price was charged due to a system error</li>
                <li><strong>Unauthorized Transaction:</strong> If payment was made without your authorization (subject to verification and fraud investigation)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Refund requests for exceptional circumstances must be submitted within <strong>7 days</strong> of the transaction date with supporting documentation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Refunds Will NOT Be Provided For</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">Refunds will NOT be provided in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Change of mind after making payment</li>
                <li>Failure to use the app or services after payment</li>
                <li>Dissatisfaction with free or paid features</li>
                <li>Issues caused by your device, internet connection, or user error</li>
                <li>Account suspension or termination due to violation of Terms and Conditions</li>
                <li>Requests made after 7 days of the transaction date</li>
                <li>Inability to perform Hajj or Umrah for personal reasons</li>
                <li>Travel cancellations or visa issues (we are not a travel agency)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Cancellation of Subscriptions</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have subscribed to a recurring premium service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You may cancel your subscription at any time through the app settings or by contacting support</li>
                <li>Cancellation will take effect at the end of the current billing period</li>
                <li>You will continue to have access to premium features until the end of the paid period</li>
                <li><strong>No refunds</strong> will be provided for the current or any previous billing period</li>
                <li>No partial refunds will be provided for unused days within a billing cycle</li>
                <li>You may resubscribe at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. How to Request a Refund (Exceptional Cases Only)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                For exceptional circumstances as described in Section 5, please submit a refund request by:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Emailing <strong>info@hajjcare.in</strong> with subject line "Refund Request - [Transaction ID]"</li>
                <li>Providing your registered email address and phone number</li>
                <li>Including the transaction ID or Razorpay payment reference number</li>
                <li>Clearly explaining the reason for your refund request</li>
                <li>Attaching relevant screenshots or documentation as evidence</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Refund Processing (If Approved)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If your refund request is approved under exceptional circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Refund requests will be reviewed within 5-7 business days</li>
                <li>If approved, refunds will be processed within 7-10 business days</li>
                <li>Refunds will be credited to the original payment method (bank account or card used)</li>
                <li>Bank processing times may vary; please allow up to 10 additional business days for the amount to reflect in your account</li>
                <li>We reserve the right to reject refund requests that do not meet the exceptional circumstances criteria</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Payment Disputes</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have a dispute regarding a payment, please contact us at <strong>info@hajjcare.in</strong> before initiating a chargeback with your bank or credit card company. We are committed to resolving genuine disputes fairly and promptly. Fraudulent chargebacks may result in permanent account suspension and legal action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Refund and Cancellation Policy is governed by the laws of India. Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For refund-related inquiries, please contact:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border border-border mt-3">
                <p className="text-muted-foreground">
                  <strong>Sazo Management Private Limited</strong><br />
                  <strong>Email:</strong> info@hajjcare.in
                </p>
              </div>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
