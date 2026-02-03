import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Building2, Shield } from "lucide-react";

export default function ContactUsPage() {
  const { language } = useLanguage();

  return (
    <MainLayout>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Contact Us</h1>
          </div>

          <p className="text-muted-foreground mb-8 text-lg">
            We're here to help you with any questions about Hajj Care. Reach out to us at the email below.
          </p>

          <Card className="border-primary/30 bg-primary/5 mb-8">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground text-lg mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-4">For all inquiries, support, feedback, refunds, and assistance</p>
              <a
                href="mailto:info@hajjcare.in"
                className="text-primary hover:underline font-semibold text-lg"
              >
                info@hajjcare.in
              </a>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Building2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Company Information</h3>
                    <p className="text-muted-foreground">
                      <strong>Sazo Management Private Limited</strong><br />
                      India
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Hajj Care is a digital services platform. We are a technology company providing digital guidance and support for pilgrims. We are <strong>not</strong> a travel agency, tour operator, or religious organization.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Registered Office</h3>
                    <p className="text-muted-foreground">
                      Sazo Management Private Limited<br />
                      India
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Note: We are a digital-only platform and do not have a physical walk-in office for customer visits. All support is provided remotely via email.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Support Hours</h3>
                    <ul className="text-muted-foreground space-y-1">
                      <li><strong>General Support:</strong> Monday – Saturday, 9:00 AM – 6:00 PM IST</li>
                      <li><strong>During Hajj Season:</strong> 24/7 enhanced support available</li>
                      <li><strong>Response Time:</strong> We aim to respond within 24-48 business hours</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Grievance Officer</h3>
                    <p className="text-muted-foreground mb-3">
                      In accordance with the Information Technology Act, 2000 and rules made thereunder, the details of the Grievance Officer are:
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Grievance Officer:</strong> Sazo Management Private Limited<br />
                      <strong>Email:</strong> info@hajjcare.in<br />
                      <strong>Response Time:</strong> Within 30 days of receiving the complaint
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Emergency During Hajj?</h3>
                <p className="text-muted-foreground mb-4">
                  If you're in Saudi Arabia during Hajj and facing an emergency, please use the emergency contacts provided in the app or contact:
                </p>
                <ul className="text-muted-foreground space-y-2">
                  <li><strong>Indian Hajj Mission:</strong> Available in the app under "Contact Numbers"</li>
                  <li><strong>Saudi Emergency Services:</strong> 911</li>
                  <li><strong>In-App AI Assistant:</strong> Available 24/7 for immediate guidance</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4 italic">
                  Note: Hajj Care provides digital guidance only. For medical emergencies, contact local emergency services immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-3">Important Notice</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hajj Care is a digital guidance platform operated by Sazo Management Private Limited. We provide informational content and digital assistance services only. We are <strong>not</strong> affiliated with any government body, religious authority, or travel agency. We do not provide religious rulings (fatwas), medical advice, legal advice, or travel/visa services. All payments made on this platform are service fees for digital services, not donations or charitable contributions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
