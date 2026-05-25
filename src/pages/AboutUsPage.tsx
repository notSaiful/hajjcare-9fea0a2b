import { MainLayout } from "@/components/MainLayout";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Heart, Target, Users, Shield, Globe } from "lucide-react";

export default function AboutUsPage() {
  const { language } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: "Service to Pilgrims",
      description: "Our primary mission is to make the Hajj and Umrah journey easier and more meaningful for every pilgrim.",
    },
    {
      icon: Target,
      title: "Accuracy & Clarity",
      description: "We provide clear, accurate information in simple language that everyone can understand.",
    },
    {
      icon: Users,
      title: "Family Unity",
      description: "We help families stay connected during the sacred journey through innovative technology.",
    },
    {
      icon: Shield,
      title: "Privacy & Trust",
      description: "We handle your personal and religious data with the utmost care and confidentiality.",
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Our platform supports 11+ languages to serve pilgrims from diverse backgrounds.",
    },
  ];

  return (
    <MainLayout>
      <SEO title="About HajCare AI" description="Learn about HajCare AI — our mission to support Indian Hajj pilgrims with multilingual digital guidance and AI assistance." path="/about-us" type="website" jsonLd={{"@context":"https://schema.org","@type":"WebPage","headline":"About HajCare AI","description":"Learn about HajCare AI — our mission to support Indian Hajj pilgrims with multilingual digital guidance and AI assistance.","url":"https://hajjcare.in/about-us"}} />
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
          <div className="flex items-center gap-3 mb-6">
            <Info className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">About HajjCare</h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                HajjCare is a digital guidance and support platform created to assist Muslims on their sacred journey of Hajj and Umrah. We believe that technology can serve faith by making information accessible, keeping families connected, and providing support when pilgrims need it most.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">What We Do</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We provide comprehensive digital assistance for Hajj and Umrah pilgrims, including:
              </p>
              <ul className="grid gap-3 md:grid-cols-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Step-by-step ritual guidance
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Interactive maps and navigation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Family location sharing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Dua and prayer collections
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Health and preparation tips
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Emergency contact information
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  AI-powered chat assistance
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Multi-language support
                </li>
              </ul>
            </section>

            <section className="bg-muted/50 p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Important Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                HajjCare is an <strong>informational and assistance platform</strong>. We want you to understand that:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We do <strong>not</strong> provide religious rulings (fatwas). For religious guidance, please consult qualified Islamic scholars.</li>
                <li>We do <strong>not</strong> provide medical advice. For health concerns, please consult medical professionals.</li>
                <li>We do <strong>not</strong> provide legal advice. For legal matters, please consult legal professionals.</li>
                <li>All content is for <strong>informational and assistance purposes only</strong>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-6">Our Values</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {values.map((value, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <value.icon className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
                          <p className="text-sm text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Languages Supported</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We understand that pilgrims come from diverse linguistic backgrounds. HajjCare currently supports:
              </p>
              <div className="flex flex-wrap gap-2">
                {["English", "Arabic (العربية)", "Urdu (اردو)", "Hindi (हिन्दी)", "Tamil (தமிழ்)", "Telugu (తెలుగు)", "Marathi (मराठी)", "Bengali (বাংলা)", "Odia (ଓଡ଼ିଆ)", "Malayalam (മലയാളം)", "Punjabi (ਪੰਜਾਬੀ)"].map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to continuously improving HajjCare based on feedback from pilgrims. Our goal is to be a trusted digital companion that enhances your spiritual journey while respecting your privacy and cultural values.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                We'd love to hear from you. For any questions, suggestions, or feedback, please reach out to us at:
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Email:</strong> hello@hajjcare.app<br />
                <strong>Support:</strong> support@hajjcare.app
              </p>
            </section>
          </div>
        </div>
      </ScrollArea>
    </MainLayout>
  );
}
