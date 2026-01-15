import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { isRTL } = useLanguage();

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Shipping Policy", href: "/shipping-policy" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">HajjCare</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A digital guidance and support platform for Hajj and Umrah pilgrims. We provide informational content and assistance tools to make your journey easier.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              © {new Date().getFullYear()} HajjCare. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Support:</strong>{" "}
                <a href="mailto:support@hajjcare.app" className="text-primary hover:underline">
                  support@hajjcare.app
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <strong>Disclaimer:</strong> HajjCare is a digital information and assistance platform. We do not provide religious rulings (fatwas), medical advice, or legal advice. All content is for informational purposes only. Please consult qualified professionals for specific guidance.
          </p>
        </div>
      </div>
    </footer>
  );
}
