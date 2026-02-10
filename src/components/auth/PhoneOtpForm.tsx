import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Phone, ArrowLeft, ShieldCheck, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
];

const labels = {
  en: { title: "Login with Phone", subtitle: "We'll send a verification code to your mobile", phonePlaceholder: "Phone Number", sendOtp: "Send OTP", verifyOtp: "Verify & Login", otpSent: "OTP sent to", resendIn: "Resend in", resend: "Resend OTP", changeNumber: "Change Number", enterOtp: "Enter 6-digit OTP", otpSuccess: "Welcome!", secure: "Secured with OTP verification" },
  ar: { title: "الدخول بالهاتف", subtitle: "سنرسل رمز التحقق إلى هاتفك", phonePlaceholder: "رقم الهاتف", sendOtp: "إرسال الرمز", verifyOtp: "تحقق وادخل", otpSent: "تم إرسال الرمز إلى", resendIn: "إعادة الإرسال خلال", resend: "إعادة إرسال", changeNumber: "تغيير الرقم", enterOtp: "أدخل الرمز المكون من 6 أرقام", otpSuccess: "مرحباً!", secure: "محمي بالتحقق" },
  ur: { title: "فون سے لاگ ان", subtitle: "ہم آپ کے فون پر تصدیقی کوڈ بھیجیں گے", phonePlaceholder: "فون نمبر", sendOtp: "OTP بھیجیں", verifyOtp: "تصدیق کریں", otpSent: "OTP بھیجا گیا", resendIn: "دوبارہ بھیجیں", resend: "دوبارہ بھیجیں", changeNumber: "نمبر بدلیں", enterOtp: "6 ہندسوں کا کوڈ درج کریں", otpSuccess: "خوش آمدید!", secure: "OTP تصدیق سے محفوظ" },
  hi: { title: "फ़ोन से लॉगिन", subtitle: "हम आपके मोबाइल पर OTP भेजेंगे", phonePlaceholder: "फ़ोन नंबर", sendOtp: "OTP भेजें", verifyOtp: "सत्यापित करें", otpSent: "OTP भेजा गया", resendIn: "पुनः भेजें", resend: "पुनः भेजें", changeNumber: "नंबर बदलें", enterOtp: "6 अंकों का OTP दर्ज करें", otpSuccess: "स्वागत है!", secure: "OTP सत्यापन से सुरक्षित" },
};

interface PhoneOtpFormProps {
  onSuccess: () => void;
}

export function PhoneOtpForm({ onSuccess }: PhoneOtpFormProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [countryOpen, setCountryOpen] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();

  const t = labels[language as keyof typeof labels] || labels.en;
  const fullPhone = `${countryCode}${phoneNumber}`;
  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0];

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (phoneNumber.length < 7) {
      toast({ title: "Error", description: "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
      if (error) throw error;
      setStep("otp");
      setResendTimer(60);
      toast({ title: t.otpSent, description: fullPhone });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to send OTP", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast({ title: "Error", description: "Please enter the complete 6-digit OTP", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: otpCode, type: "sms" });
      if (error) throw error;
      toast({ title: t.otpSuccess, description: isRTL ? "مرحباً بك في حج كير" : "Welcome to Haj Care AI" });
      onSuccess();
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Invalid OTP", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    await handleSendOtp();
  };

  // Phone input step
  if (step === "phone") {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="space-y-4">
          {/* Phone with country selector */}
          <div className="flex gap-2">
            <Popover open={countryOpen} onOpenChange={setCountryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-14 px-3 gap-1.5 text-base font-medium min-w-[110px] justify-between rounded-2xl border-border/60 bg-background/60"
                >
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <span className="font-mono text-sm">{selectedCountry.code}</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[260px] p-0" align="start">
                <ScrollArea className="h-[280px]">
                  <div className="p-2 space-y-0.5">
                    {countryCodes.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCountryCode(c.code); setCountryOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-accent",
                          countryCode === c.code && "bg-accent"
                        )}
                      >
                        <span className="text-xl">{c.flag}</span>
                        <span className="flex-1 text-sm font-medium">{c.country}</span>
                        <span className="text-xs text-muted-foreground font-mono">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <div className="relative flex-1">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="tel"
                inputMode="numeric"
                placeholder={t.phonePlaceholder}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 15))}
                className="pl-12 h-14 text-lg font-mono tracking-wider rounded-2xl border-border/60 bg-background/60 focus:bg-background transition-colors"
              />
            </div>
          </div>

          <Button
            onClick={handleSendOtp}
            className="w-full h-14 text-lg font-semibold rounded-2xl auth-gradient-btn transition-all duration-300"
            disabled={isLoading || phoneNumber.length < 7}
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t.sendOtp}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t.secure}</span>
          </div>
        </div>
      </div>
    );
  }

  // OTP verification step
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">{t.otpSent}</p>
        <p className="text-base font-mono font-semibold tracking-wide">{fullPhone}</p>
      </div>

      <div className="space-y-4">
        {/* OTP boxes */}
        <div className="flex justify-center gap-2.5">
          {otp.map((digit, i) => (
            <Input
              key={i}
              ref={(el) => { otpRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-border/60 bg-background/60 focus:border-primary focus:bg-background transition-all"
              autoFocus={i === 0}
            />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">{t.enterOtp}</p>

        <Button
          onClick={handleVerifyOtp}
          className="w-full h-14 text-lg font-semibold rounded-2xl auth-gradient-btn transition-all duration-300"
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t.verifyOtp}
        </Button>

        {/* Resend & change number */}
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => { setStep("phone"); setOtp(["", "", "", "", "", ""]); }}
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.changeNumber}
          </button>
          <button
            type="button"
            onClick={handleResend}
            className={cn(
              "transition-colors",
              resendTimer > 0 ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:text-primary/80"
            )}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0 ? `${t.resendIn} ${resendTimer}s` : t.resend}
          </button>
        </div>
      </div>
    </div>
  );
}
