import { MainLayout } from "@/components/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones } from "lucide-react";

export default function ContactUsPage() {
  const { language } = useLanguage();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "For general inquiries and support",
      value: "support@hajjcare.app",
      link: "mailto:support@hajjcare.app",
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "For app issues and technical help",
      value: "tech@hajjcare.app",
      link: "mailto:tech@hajjcare.app",
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      description: "Share your suggestions and feedback",
      value: "feedback@hajjcare.app",
      link: "mailto:feedback@hajjcare.app",
    },
  ];

  return (
    <MainLayout>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <Phone className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Contact Us</h1>
          </div>

          <p className="text-muted-foreground mb-8 text-lg">
            We're here to help you with any questions about HajjCare. Reach out to us through any of the channels below.
          </p>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <method.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <a
                    href={method.link}
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    {method.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Business Address</h3>
                    <p className="text-muted-foreground">
                      HajjCare Digital Services<br />
                      India<br />
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      (We are a digital-only platform and do not have a physical walk-in office)
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
                      <li><strong>General Support:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</li>
                      <li><strong>During Hajj Season:</strong> 24/7 emergency support available</li>
                      <li><strong>Response Time:</strong> We aim to respond within 24-48 hours</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Specific Inquiries</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Privacy concerns</span>
                    <a href="mailto:privacy@hajjcare.app" className="text-primary hover:underline">privacy@hajjcare.app</a>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Refund requests</span>
                    <a href="mailto:refunds@hajjcare.app" className="text-primary hover:underline">refunds@hajjcare.app</a>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Legal matters</span>
                    <a href="mailto:legal@hajjcare.app" className="text-primary hover:underline">legal@hajjcare.app</a>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Partnerships & Media</span>
                    <a href="mailto:partnerships@hajjcare.app" className="text-primary hover:underline">partnerships@hajjcare.app</a>
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
                  <li><strong>Saudi Emergency:</strong> 911</li>
                  <li><strong>In-App Chat:</strong> Use our AI assistant for immediate guidance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
