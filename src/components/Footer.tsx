import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Shield, 
  FileText, 
  RotateCcw, 
  Package, 
  Phone, 
  Info, 
  IndianRupee,
  Mail,
  Home,
  Heart
} from "lucide-react";

export function Footer() {
  const { isRTL } = useLanguage();

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy", icon: Shield },
    { label: "Terms & Conditions", href: "/terms-conditions", icon: FileText },
    { label: "Refund Policy", href: "/refund-policy", icon: RotateCcw },
    { label: "Shipping Policy", href: "/shipping-policy", icon: Package },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about-us", icon: Info },
    { label: "Contact Us", href: "/contact-us", icon: Phone },
    { label: "Pricing", href: "/pricing", icon: IndianRupee },
    { label: "Support Us", href: "/donors", icon: Heart },
  ];

  const quickLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Hajj Guide", href: "/prepare", icon: FileText },
    { label: "Umrah Guide", href: "/umrah", icon: FileText },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-lg text-foreground mb-3">HajjCare</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A digital guidance and support platform for Hajj and Umrah pilgrims.
            </p>
            <a 
              href="mailto:support@hajjcare.app" 
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              support@hajjcare.app
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HajjCare. All rights reserved.
            </p>
            
            {/* Compact Footer Links for Mobile */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link to="/terms-conditions" className="text-xs text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link to="/refund-policy" className="text-xs text-muted-foreground hover:text-foreground">
                Refunds
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link to="/contact-us" className="text-xs text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground/70 text-center mt-4 leading-relaxed">
            <strong>Disclaimer:</strong> HajjCare is a digital information platform. We do not provide religious rulings, medical advice, or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
