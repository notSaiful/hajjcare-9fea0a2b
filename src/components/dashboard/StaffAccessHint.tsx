import { memo, useState } from "react";
import { ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * Small inline "Access needed" notice that appears on the HomePage when the
 * user is signed in but lacks the inspector / admin / coordinator role required
 * to see Staff Tools (Sub-Group Management). Stays hidden for guests and for
 * staff who already have access.
 *
 * Includes a one-click "Create demo roles" testing helper that invokes the
 * `grant_demo_staff_roles` RPC to self-assign inspector + coordinator + admin.
 */
export const StaffAccessHint = memo(function StaffAccessHint() {
  const { language } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isInspector, isAdmin, isCoordinator, isLoading } = useUserRole();
  const { toast } = useToast();
  const [granting, setGranting] = useState(false);

  const hasStaffAccess = isInspector || isAdmin || isCoordinator;

  // Hide while loading, for guests, or for staff who already see the menu
  if (authLoading || isLoading || !isAuthenticated || hasStaffAccess) return null;

  const copy: Record<
    string,
    { title: string; body: string; roles: string; demo: string; demoHint: string; granting: string }
  > = {
    en: {
      title: "Staff Tools hidden",
      body: "Sub-Group Management is restricted. Ask an administrator to assign you a staff role.",
      roles: "Required role: Inspector, Coordinator, or Admin",
      demo: "Create demo roles",
      demoHint: "For testing only — grants you Inspector, Coordinator, and Admin instantly.",
      granting: "Granting…",
    },
    hi: {
      title: "स्टाफ टूल्स छिपे हुए हैं",
      body: "उप-समूह प्रबंधन सीमित है। किसी व्यवस्थापक से स्टाफ भूमिका असाइन करने को कहें।",
      roles: "आवश्यक भूमिका: इंस्पेक्टर, समन्वयक, या व्यवस्थापक",
      demo: "डेमो रोल बनाएं",
      demoHint: "केवल परीक्षण के लिए — तुरंत इंस्पेक्टर, समन्वयक और व्यवस्थापक देता है।",
      granting: "असाइन हो रहा है…",
    },
    ur: {
      title: "اسٹاف ٹولز چھپے ہوئے ہیں",
      body: "ذیلی گروپ انتظام محدود ہے۔ منتظم سے اسٹاف کردار تفویض کرنے کو کہیں۔",
      roles: "ضروری کردار: انسپکٹر، کوآرڈینیٹر، یا ایڈمن",
      demo: "ڈیمو رولز بنائیں",
      demoHint: "صرف ٹیسٹنگ کے لیے — فوری طور پر انسپکٹر، کوآرڈینیٹر اور ایڈمن دیتا ہے۔",
      granting: "تفویض ہو رہا ہے…",
    },
    ar: {
      title: "أدوات الموظفين مخفية",
      body: "إدارة المجموعات الفرعية مقيدة. اطلب من المسؤول تعيين دور موظف لك.",
      roles: "الدور المطلوب: مفتش، منسق، أو مسؤول",
      demo: "إنشاء أدوار تجريبية",
      demoHint: "للاختبار فقط — يمنحك مفتش ومنسق ومسؤول على الفور.",
      granting: "جارٍ التعيين…",
    },
  };

  const t = copy[language] || copy.en;

  const handleGrantDemo = async () => {
    setGranting(true);
    try {
      const { data, error } = await supabase.rpc("grant_demo_staff_roles");
      if (error) throw error;

      const result = data as { success: boolean; inserted?: number; skipped?: number; error?: string } | null;
      if (!result?.success) {
        throw new Error(result?.error || "Failed to grant demo roles");
      }

      toast({
        title: t.demo + " ✓",
        description: `Inserted: ${result.inserted ?? 0} · Already had: ${result.skipped ?? 0}. Reloading…`,
      });

      // Reload so useUserRole re-fetches and the staff menu appears
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error("[StaffAccessHint] grant demo roles failed:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to grant demo roles",
        variant: "destructive",
      });
      setGranting(false);
    }
  };

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
          <div className="space-y-1">
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

          <div className="pt-1 border-t border-border/60">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGrantDemo}
              disabled={granting}
              className="h-8 text-xs gap-1.5"
            >
              {granting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  {t.granting}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.demo}
                </>
              )}
            </Button>
            <p className="text-[10px] text-muted-foreground mt-1.5 leading-snug">
              {t.demoHint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default StaffAccessHint;
