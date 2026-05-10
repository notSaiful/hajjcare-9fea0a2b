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

  const copy: Record<string, { title: string; body: string; roles: string }> = {
    en: {
      title: "Staff Tools hidden",
      body: "Sub-Group Management is restricted. Ask an administrator to assign you a staff role.",
      roles: "Required role: Inspector, Coordinator, or Admin",
    },
    hi: {
      title: "स्टाफ टूल्स छिपे हुए हैं",
      body: "उप-समूह प्रबंधन सीमित है। किसी व्यवस्थापक से स्टाफ भूमिका असाइन करने को कहें।",
      roles: "आवश्यक भूमिका: इंस्पेक्टर, समन्वयक, या व्यवस्थापक",
    },
    ur: {
      title: "اسٹاف ٹولز چھپے ہوئے ہیں",
      body: "ذیلی گروپ انتظام محدود ہے۔ منتظم سے اسٹاف کردار تفویض کرنے کو کہیں۔",
      roles: "ضروری کردار: انسپکٹر، کوآرڈینیٹر، یا ایڈمن",
    },
    ar: {
      title: "أدوات الموظفين مخفية",
      body: "إدارة المجموعات الفرعية مقيدة. اطلب من المسؤول تعيين دور موظف لك.",
      roles: "الدور المطلوب: مفتش، منسق، أو مسؤول",
    },
  };

  const t = copy[language] || copy.en;

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
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {t.title}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t.body}
          </p>
          <p className="text-[11px] font-medium text-primary/80 pt-0.5">
            {t.roles}
          </p>
        </div>
      </div>
    </section>
  );
});

export default StaffAccessHint;
