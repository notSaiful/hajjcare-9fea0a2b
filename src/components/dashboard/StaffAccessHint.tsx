import { memo } from "react";
import { ShieldAlert, MessageCircle, Mail } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

const ADMIN_WHATSAPP = "917588113830";
const ADMIN_EMAIL = "support@hajjcare.in";

/**
 * Small inline "Access needed" notice that appears on the HomePage when the
 * user is signed in but lacks the inspector / admin / coordinator role required
 * to see Staff Tools (Sub-Group Management). Stays hidden for guests and for
 * staff who already have access.
 */
export const StaffAccessHint = memo(function StaffAccessHint() {
  const { language } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isInspector, isAdmin, isCoordinator, isLoading } = useUserRole();

  const hasStaffAccess = isInspector || isAdmin || isCoordinator;

  // Hide while loading, for guests, or for staff who already see the menu
  if (authLoading || isLoading || !isAuthenticated || hasStaffAccess) return null;

  const copy: Record<string, { title: string; body: string; roles: string; cta: string; whatsapp: string; email: string; requestMsg: string }> = {
    en: {
      title: "Staff Tools hidden",
      body: "Sub-Group Management is restricted. Ask an administrator to assign you a staff role.",
      roles: "Required role: Inspector, Coordinator, or Admin",
      cta: "Want to become Inspector / Coordinator / Admin? Contact the team:",
      whatsapp: "Request on WhatsApp",
      email: "Email Admin",
      requestMsg: "Assalamu Alaikum, I would like to request a staff role (Inspector / Coordinator / Admin) on HajjCare. Please guide me through the process.",
    },
    hi: {
      title: "स्टाफ टूल्स छिपे हुए हैं",
      body: "उप-समूह प्रबंधन सीमित है। किसी व्यवस्थापक से स्टाफ भूमिका असाइन करने को कहें।",
      roles: "आवश्यक भूमिका: इंस्पेक्टर, समन्वयक, या व्यवस्थापक",
      cta: "इंस्पेक्टर / समन्वयक / व्यवस्थापक बनना चाहते हैं? टीम से संपर्क करें:",
      whatsapp: "WhatsApp पर अनुरोध करें",
      email: "एडमिन को ईमेल करें",
      requestMsg: "अस्सलामु अलैकुम, मैं HajjCare पर स्टाफ भूमिका (इंस्पेक्टर / समन्वयक / व्यवस्थापक) का अनुरोध करना चाहता/चाहती हूँ। कृपया मार्गदर्शन करें।",
    },
    ur: {
      title: "اسٹاف ٹولز چھپے ہوئے ہیں",
      body: "ذیلی گروپ انتظام محدود ہے۔ منتظم سے اسٹاف کردار تفویض کرنے کو کہیں۔",
      roles: "ضروری کردار: انسپکٹر، کوآرڈینیٹر، یا ایڈمن",
      cta: "انسپکٹر / کوآرڈینیٹر / ایڈمن بننا چاہتے ہیں؟ ٹیم سے رابطہ کریں:",
      whatsapp: "WhatsApp پر درخواست کریں",
      email: "ایڈمن کو ای میل کریں",
      requestMsg: "السلام علیکم، میں HajjCare پر اسٹاف کردار (انسپکٹر / کوآرڈینیٹر / ایڈمن) کی درخواست کرنا چاہتا/چاہتی ہوں۔ براہ کرم رہنمائی فرمائیں۔",
    },
    ar: {
      title: "أدوات الموظفين مخفية",
      body: "إدارة المجموعات الفرعية مقيدة. اطلب من المسؤول تعيين دور موظف لك.",
      roles: "الدور المطلوب: مفتش، منسق، أو مسؤول",
      cta: "هل تريد أن تصبح مفتشًا / منسقًا / مسؤولًا؟ تواصل مع الفريق:",
      whatsapp: "اطلب عبر واتساب",
      email: "راسل المسؤول",
      requestMsg: "السلام عليكم، أرغب في طلب دور موظف (مفتش / منسق / مسؤول) على HajjCare. يرجى إرشادي.",
    },
  };

  const t = copy[language] || copy.en;
  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(t.requestMsg)}`;
  const mailUrl = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent("Staff Role Request — HajjCare")}&body=${encodeURIComponent(t.requestMsg)}`;

  return (
    <section
      className="animate-fade-up"
      style={{ animationDelay: "100ms" }}
      aria-label={t.title}
    >
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {t.title}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t.body}
          </p>
          <p className="text-[11px] font-medium text-primary/80">
            {t.roles}
          </p>
          <div className="pt-1.5 border-t border-border/60 space-y-2">
            <p className="text-xs text-foreground/90 leading-relaxed">
              {t.cta}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition-opacity min-h-[40px]"
              >
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {t.whatsapp}
              </a>
              <a
                href={mailUrl}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity min-h-[40px]"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                {t.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default StaffAccessHint;
