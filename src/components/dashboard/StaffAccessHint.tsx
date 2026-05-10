import { memo, useState } from "react";
import { ShieldAlert, MessageCircle, Mail, Send, Loader2 } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_WHATSAPP = "917588113830";
const ADMIN_EMAIL = "support@hajjcare.in";

type RequestedRole = "inspector" | "coordinator" | "admin";

/**
 * Inline "Access needed" notice on HomePage when a signed-in user lacks
 * inspector/admin/coordinator. Lets them submit an in-app role request,
 * or fall back to WhatsApp / email.
 */
export const StaffAccessHint = memo(function StaffAccessHint() {
  const { language } = useLanguage();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { user } = useAuthContext();
  const { isInspector, isAdmin, isCoordinator, isLoading } = useUserRole();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<RequestedRole>("inspector");
  const [reason, setReason] = useState("");

  const hasStaffAccess = isInspector || isAdmin || isCoordinator;

  if (authLoading || isLoading || !isAuthenticated || hasStaffAccess) return null;

  const copy: Record<
    string,
    {
      title: string;
      body: string;
      roles: string;
      cta: string;
      requestInApp: string;
      whatsapp: string;
      email: string;
      requestMsg: string;
      dialogTitle: string;
      dialogDesc: string;
      roleLabel: string;
      reasonLabel: string;
      reasonPlaceholder: string;
      submit: string;
      cancel: string;
      submitted: string;
      submitFailed: string;
      labelInspector: string;
      labelCoordinator: string;
      labelAdmin: string;
    }
  > = {
    en: {
      title: "Staff Tools hidden",
      body: "Sub-Group Management is restricted. Ask an administrator to assign you a staff role.",
      roles: "Required role: Inspector, Coordinator, or Admin",
      cta: "Want to become Inspector / Coordinator / Admin?",
      requestInApp: "Request in app",
      whatsapp: "WhatsApp",
      email: "Email",
      requestMsg:
        "Assalamu Alaikum, I would like to request a staff role (Inspector / Coordinator / Admin) on HajjCare. Please guide me through the process.",
      dialogTitle: "Request Staff Role",
      dialogDesc:
        "Submit a request to become Inspector, Coordinator, or Admin. An administrator will review it.",
      roleLabel: "Role you want",
      reasonLabel: "Why should you get this role?",
      reasonPlaceholder:
        "e.g. I am a Hajj Coordinator from Maharashtra, posted at embarkation point Mumbai...",
      submit: "Submit Request",
      cancel: "Cancel",
      submitted: "Request submitted. An administrator will review it shortly.",
      submitFailed: "Could not submit request",
      labelInspector: "Inspector",
      labelCoordinator: "Coordinator",
      labelAdmin: "Admin",
    },
    hi: {
      title: "स्टाफ टूल्स छिपे हुए हैं",
      body: "उप-समूह प्रबंधन सीमित है। किसी व्यवस्थापक से स्टाफ भूमिका असाइन करने को कहें।",
      roles: "आवश्यक भूमिका: इंस्पेक्टर, समन्वयक, या व्यवस्थापक",
      cta: "इंस्पेक्टर / समन्वयक / व्यवस्थापक बनना चाहते हैं?",
      requestInApp: "ऐप में अनुरोध करें",
      whatsapp: "WhatsApp",
      email: "ईमेल",
      requestMsg:
        "अस्सलामु अलैकुम, मैं HajjCare पर स्टाफ भूमिका (इंस्पेक्टर / समन्वयक / व्यवस्थापक) का अनुरोध करना चाहता/चाहती हूँ। कृपया मार्गदर्शन करें।",
      dialogTitle: "स्टाफ भूमिका के लिए अनुरोध",
      dialogDesc:
        "इंस्पेक्टर, समन्वयक, या व्यवस्थापक बनने के लिए अनुरोध भेजें। व्यवस्थापक इसकी समीक्षा करेगा।",
      roleLabel: "इच्छित भूमिका",
      reasonLabel: "आप यह भूमिका क्यों चाहते हैं?",
      reasonPlaceholder:
        "उदा. मैं महाराष्ट्र से हज समन्वयक हूँ, मुंबई एम्बार्केशन पॉइंट पर तैनात...",
      submit: "अनुरोध भेजें",
      cancel: "रद्द करें",
      submitted: "अनुरोध भेजा गया। व्यवस्थापक जल्द ही समीक्षा करेगा।",
      submitFailed: "अनुरोध नहीं भेजा जा सका",
      labelInspector: "इंस्पेक्टर",
      labelCoordinator: "समन्वयक",
      labelAdmin: "व्यवस्थापक",
    },
    ur: {
      title: "اسٹاف ٹولز چھپے ہوئے ہیں",
      body: "ذیلی گروپ انتظام محدود ہے۔ منتظم سے اسٹاف کردار تفویض کرنے کو کہیں۔",
      roles: "ضروری کردار: انسپکٹر، کوآرڈینیٹر، یا ایڈمن",
      cta: "انسپکٹر / کوآرڈینیٹر / ایڈمن بننا چاہتے ہیں؟",
      requestInApp: "ایپ میں درخواست دیں",
      whatsapp: "WhatsApp",
      email: "ای میل",
      requestMsg:
        "السلام علیکم، میں HajjCare پر اسٹاف کردار (انسپکٹر / کوآرڈینیٹر / ایڈمن) کی درخواست کرنا چاہتا/چاہتی ہوں۔ براہ کرم رہنمائی فرمائیں۔",
      dialogTitle: "اسٹاف کردار کی درخواست",
      dialogDesc:
        "انسپکٹر، کوآرڈینیٹر، یا ایڈمن بننے کی درخواست بھیجیں۔ منتظم اس کا جائزہ لے گا۔",
      roleLabel: "مطلوبہ کردار",
      reasonLabel: "آپ کو یہ کردار کیوں ملنا چاہیے؟",
      reasonPlaceholder: "مثلاً میں مہاراشٹرا سے حج کوآرڈینیٹر ہوں، ممبئی پر تعینات...",
      submit: "درخواست بھیجیں",
      cancel: "منسوخ",
      submitted: "درخواست بھیج دی گئی۔ منتظم جلد جائزہ لے گا۔",
      submitFailed: "درخواست نہیں بھیجی جا سکی",
      labelInspector: "انسپکٹر",
      labelCoordinator: "کوآرڈینیٹر",
      labelAdmin: "ایڈمن",
    },
    ar: {
      title: "أدوات الموظفين مخفية",
      body: "إدارة المجموعات الفرعية مقيدة. اطلب من المسؤول تعيين دور موظف لك.",
      roles: "الدور المطلوب: مفتش، منسق، أو مسؤول",
      cta: "هل تريد أن تصبح مفتشًا / منسقًا / مسؤولًا؟",
      requestInApp: "اطلب داخل التطبيق",
      whatsapp: "واتساب",
      email: "البريد",
      requestMsg:
        "السلام عليكم، أرغب في طلب دور موظف (مفتش / منسق / مسؤول) على HajjCare. يرجى إرشادي.",
      dialogTitle: "طلب دور موظف",
      dialogDesc: "أرسل طلبًا لتصبح مفتشًا أو منسقًا أو مسؤولًا. سيقوم المسؤول بمراجعته.",
      roleLabel: "الدور المطلوب",
      reasonLabel: "لماذا تستحق هذا الدور؟",
      reasonPlaceholder: "مثلاً: أنا منسق حج من ولاية...",
      submit: "إرسال الطلب",
      cancel: "إلغاء",
      submitted: "تم إرسال الطلب. سيراجعه المسؤول قريبًا.",
      submitFailed: "تعذر إرسال الطلب",
      labelInspector: "مفتش",
      labelCoordinator: "منسق",
      labelAdmin: "مسؤول",
    },
  };

  const t = copy[language] || copy.en;
  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(t.requestMsg)}`;
  const mailUrl = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(
    "Staff Role Request — HajjCare"
  )}&body=${encodeURIComponent(t.requestMsg)}`;

  const roleLabel: Record<RequestedRole, string> = {
    inspector: t.labelInspector,
    coordinator: t.labelCoordinator,
    admin: t.labelAdmin,
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error(t.submitFailed);
      return;
    }
    setSubmitting(true);
    try {
      // Pull profile basics for the admin reviewer
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();

      const { error } = await supabase.from("staff_role_requests").insert({
        user_id: user.id,
        requested_role: role,
        full_name: profile?.full_name ?? null,
        email: user.email ?? null,
        phone: profile?.phone ?? null,
        reason: reason.trim() || null,
      } as never);
      if (error) throw error;

      toast.success(t.submitted);
      setOpen(false);
      setReason("");
      setRole("inspector");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || t.submitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
            <p className="text-sm font-semibold text-foreground leading-tight">{t.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{t.body}</p>
            <p className="text-[11px] font-medium text-primary/80">{t.roles}</p>
            <div className="pt-1.5 border-t border-border/60 space-y-2">
              <p className="text-xs text-foreground/90 leading-relaxed">{t.cta}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity min-h-[40px]"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.requestInApp}
                </button>
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-semibold hover:opacity-90 transition-opacity min-h-[40px]"
                >
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              {t.dialogTitle}
            </DialogTitle>
            <DialogDescription>{t.dialogDesc}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>{t.roleLabel}</Label>
              <Select value={role} onValueChange={(v) => setRole(v as RequestedRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inspector">{roleLabel.inspector}</SelectItem>
                  <SelectItem value="coordinator">{roleLabel.coordinator}</SelectItem>
                  <SelectItem value="admin">{roleLabel.admin}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t.reasonLabel}</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.reasonPlaceholder}
                rows={4}
                maxLength={1000}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              {t.cancel}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {t.submit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default StaffAccessHint;
