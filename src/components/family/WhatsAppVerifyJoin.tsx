import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Shield,
  UserCheck,
  Users,
  Link2,
  Clock,
  Send,
  ChevronDown,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
];

interface VerifyResult {
  success: boolean;
  action?: string;
  full_name?: string;
  group_name?: string;
  invite_code?: string;
  expires_at?: string;
  error?: string;
  message?: string;
}

type Step = "phone" | "verifying" | "result";

const STEPS = [
  { key: "phone", icon: MessageCircle, labelEn: "Enter Phone", labelAr: "أدخل الهاتف" },
  { key: "verifying", icon: Shield, labelEn: "Verify ID", labelAr: "التحقق" },
  { key: "result", icon: Users, labelEn: "Join Group", labelAr: "انضمام" },
];

export const WhatsAppVerifyJoin = () => {
  const { isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryOpen, setCountryOpen] = useState(false);
  const [step, setStep] = useState<Step>("phone");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0];

  const handleVerify = async () => {
    if (!phone.trim()) return;

    const fullPhone = `${countryCode}${phone}`;
    setStep("verifying");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc("whatsapp_verify_and_join", {
        p_phone: fullPhone,
      });

      if (error) throw error;

      const res = data as unknown as VerifyResult;
      setResult(res);
      setStep("result");

      if (res.success) {
        toast({
          title: isRTL ? "تم التحقق ✅" : "Verified ✅",
          description: isRTL
            ? `مرحباً ${res.full_name}! تم ${res.action === "created_group" ? "إنشاء" : "العثور على"} مجموعتك.`
            : `Welcome ${res.full_name}! Group ${res.action === "created_group" ? "created" : "found"}.`,
        });
      }
    } catch (error) {
      console.error("Verify error:", error);
      setResult({ success: false, error: "verify_failed", message: "Verification failed" });
      setStep("result");
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (!result?.invite_code) return;
    const link = `${window.location.origin}/family?join=${result.invite_code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: isRTL ? "تم النسخ" : "Copied!",
      description: isRTL ? "تم نسخ رابط الدعوة" : "Invite link copied to clipboard",
    });
  };

  const shareViaWhatsApp = () => {
    if (!result?.invite_code) return;
    const link = `${window.location.origin}/family?join=${result.invite_code}`;
    const message = isRTL
      ? `السلام عليكم، انضم إلى مجموعتنا العائلية في حج كير!\n\nالمجموعة: ${result.group_name}\nكود الدعوة: ${result.invite_code}\nالرابط: ${link}\n\n⏳ صالح لمدة 72 ساعة`
      : `Assalamu Alaikum! Join our HajjCare family group.\n\nGroup: ${result.group_name}\nInvite Code: ${result.invite_code}\nLink: ${link}\n\n⏳ Valid for 72 hours`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const reset = () => {
    setStep("phone");
    setResult(null);
    setPhone("");
  };

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  if (!isAuthenticated) return null;

  return (
    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-green-600" />
          </div>
          {isRTL ? "التحقق والانضمام عبر واتساب" : "WhatsApp Verify & Join"}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {isRTL
            ? "أدخل رقمك → تحقق → انضم تلقائياً → شارك الرابط"
            : "Enter phone → Verify ID → Auto-group → Share invite link"}
        </p>
      </CardHeader>

      {/* Progress Steps */}
      <div className="px-4 sm:px-6 pb-2">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === currentStepIndex;
            const isDone = i < currentStepIndex;
            return (
              <div key={s.key} className="flex items-center gap-1 flex-1">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                    isDone && "bg-green-500 text-white",
                    isActive && "bg-green-500/20 text-green-600 ring-2 ring-green-500/50",
                    !isActive && !isDone && "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <span className={cn("text-[10px] hidden sm:inline", isActive ? "text-green-600 font-medium" : "text-muted-foreground")}>
                  {isRTL ? s.labelAr : s.labelEn}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-1", isDone ? "bg-green-500" : "bg-muted")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CardContent className="px-4 sm:px-6 space-y-3">
        {/* Step 1: Phone Input */}
        {step === "phone" && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex gap-1.5">
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-11 px-2 gap-1 min-w-[80px] text-xs">
                    <span>{selectedCountry.flag}</span>
                    <span className="font-mono text-xs">{selectedCountry.code}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0" align="start">
                  <ScrollArea className="h-[200px]">
                    <div className="p-1.5 space-y-0.5">
                      {countryCodes.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setCountryCode(c.code); setCountryOpen(false); }}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-sm hover:bg-accent",
                            countryCode === c.code && "bg-accent"
                          )}
                        >
                          <span>{c.flag}</span>
                          <span className="flex-1 truncate">{c.country}</span>
                          <span className="text-xs text-muted-foreground font-mono">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>

              <Input
                type="tel"
                inputMode="numeric"
                placeholder={isRTL ? "رقم الهاتف المسجل" : "Registered phone number"}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                dir="ltr"
                className="h-11 flex-1 font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={!phone.trim()}
              className="w-full h-11 gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Shield className="h-4 w-4" />
              {isRTL ? "تحقق وانضم تلقائياً" : "Verify & Auto-Join"}
            </Button>
          </div>
        )}

        {/* Step 2: Verifying */}
        {step === "verifying" && (
          <div className="flex flex-col items-center gap-3 py-6 animate-in fade-in">
            <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">
              {isRTL ? "جاري التحقق من الهوية..." : "Verifying your identity..."}
            </p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>📱 {isRTL ? "مطابقة الملف" : "Matching profile"}</span>
              <span>→</span>
              <span>👥 {isRTL ? "تعيين المجموعة" : "Assigning group"}</span>
              <span>→</span>
              <span>🔗 {isRTL ? "إنشاء الرابط" : "Generating link"}</span>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === "result" && result && (
          <div className="space-y-3 animate-in fade-in">
            {result.success ? (
              <>
                {/* Success Card */}
                <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-700">
                      {isRTL ? `مرحباً، ${result.full_name}` : `Welcome, ${result.full_name}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-700">
                      <Users className="h-3 w-3 mr-1" />
                      {result.group_name}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-700">
                      {result.action === "created_group"
                        ? isRTL ? "مجموعة جديدة" : "New Group"
                        : isRTL ? "مجموعة موجودة" : "Existing Group"}
                    </Badge>
                  </div>

                  {/* Invite Code */}
                  <div className="bg-background/80 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Link2 className="h-3 w-3" />
                        {isRTL ? "كود الدعوة" : "Invite Code"}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Clock className="h-3 w-3" />
                        {result.expires_at && (
                          <span>
                            {isRTL ? "ينتهي " : "Expires "}
                            {formatDistanceToNow(new Date(result.expires_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="font-mono text-2xl font-bold tracking-[0.3em] text-foreground">
                        {result.invite_code}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={copyInviteLink}
                    className="h-11 gap-2 text-sm"
                  >
                    <Copy className="h-4 w-4" />
                    {isRTL ? "نسخ الرابط" : "Copy Link"}
                  </Button>
                  <Button
                    onClick={shareViaWhatsApp}
                    className="h-11 gap-2 text-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                    {isRTL ? "شارك عبر واتساب" : "Share via WhatsApp"}
                  </Button>
                </div>
              </>
            ) : (
              /* Error State */
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 space-y-3 text-center">
                <p className="text-sm font-medium text-destructive">
                  {result.error === "no_profile"
                    ? isRTL
                      ? "لم يتم العثور على حساب بهذا الرقم أو لم يفعّل المشاركة العائلية"
                      : "No account found for this number, or family sharing is not enabled"
                    : isRTL
                      ? "فشل التحقق. حاول مرة أخرى."
                      : "Verification failed. Please try again."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isRTL
                    ? "تأكد من أن الرقم مسجل وأن المشاركة العائلية مفعّلة"
                    : "Make sure the number is registered and family sharing is enabled"}
                </p>
              </div>
            )}

            <Button
              variant="ghost"
              onClick={reset}
              className="w-full h-9 text-xs text-muted-foreground"
            >
              {isRTL ? "رقم آخر" : "Try another number"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
