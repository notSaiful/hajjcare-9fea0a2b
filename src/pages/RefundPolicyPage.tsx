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

          <p className="text-muted-foreground mb-6">Last Updated: January 15, 2025</p>

          <div className="prose prose-lg max-w-none space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                HajjCare is committed to ensuring your satisfaction with our digital guidance and support services. This policy explains our refund and cancellation procedures for any paid services or donations made through our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Free Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                The core features of HajjCare, including Hajj and Umrah guidance, ritual instructions, maps, duas, and family location sharing, are provided free of charge. No refund applies to free services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Donations</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Donations made to HajjCare are voluntary contributions to support the development and maintenance of our platform. Regarding donations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Donations are generally non-refundable</strong> as they are considered gifts to support our mission</li>
                <li>If a donation was made in error (wrong amount, duplicate payment), please contact us within 7 days</li>
                <li>We will review error cases on an individual basis and process refunds where appropriate</li>
                <li>Refund requests for donations made more than 7 days ago will not be considered</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Premium Services (If Applicable)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If HajjCare offers any premium or paid services in the future, the following refund conditions will apply:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Within 7 days of purchase:</strong> Full refund available if you have not substantially used the service</li>
                <li><strong>7-14 days after purchase:</strong> 50% refund may be considered on a case-by-case basis</li>
                <li><strong>After 14 days:</strong> No refund will be provided</li>
                <li>Subscription services can be cancelled at any time, but no refund will be provided for the current billing period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Conditions for Refund</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">Refunds may be granted in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Technical error resulting in duplicate payment</li>
                <li>Incorrect amount charged due to system error</li>
                <li>Unauthorized transaction (with proper verification)</li>
                <li>Service not provided as described (with valid documentation)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Non-Refundable Cases</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">Refunds will NOT be provided in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Change of mind after making a donation</li>
                <li>Failure to use the app or services</li>
                <li>Dissatisfaction with free features</li>
                <li>Issues caused by user's device or internet connection</li>
                <li>Violation of our Terms and Conditions leading to account suspension</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. How to Request a Refund</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">To request a refund, please:</p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Email us at <strong>refunds@hajjcare.app</strong> with the subject line "Refund Request"</li>
                <li>Include your registered email address and phone number</li>
                <li>Provide the transaction ID or payment reference number</li>
                <li>Explain the reason for your refund request</li>
                <li>Attach any relevant screenshots or documentation</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Refund Processing Time</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We will review your refund request within 3-5 business days</li>
                <li>If approved, refunds will be processed within 5-7 business days</li>
                <li>Refunds will be credited to the original payment method used</li>
                <li>Bank processing times may vary; please allow up to 10 business days for the amount to reflect in your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Cancellation of Subscriptions</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you wish to cancel any subscription service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-3">
                <li>You can cancel at any time through the app settings or by contacting support</li>
                <li>Access will continue until the end of the current billing period</li>
                <li>No partial refunds will be provided for unused days</li>
                <li>You can resubscribe at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For refund-related inquiries, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Refunds:</strong> refunds@hajjcare.app<br />
                <strong>Support:</strong> support@hajjcare.app
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
