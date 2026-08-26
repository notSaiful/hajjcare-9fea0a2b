import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck } from "lucide-react";

const labels = {
  en: { title: "Two-Factor Authentication", subtitle: "Enter the 6-digit code from your authenticator app", verify: "Verify", invalid: "Invalid code. Please try again.", error: "Verification failed" },
  ar: { title: "المصادقة الثنائية", subtitle: "أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة", verify: "تحقق", invalid: "رمز غير صالح. حاول مرة أخرى.", error: "فشل التحقق" },
  ur: { title: "دو مرحلی تصدیق", subtitle: "اپنی توثیقی ایپ سے 6 ہندسوں کا کوڈ درج کریں", verify: "تصدیق کریں", invalid: "غلط کوڈ۔ دوبارہ کوشش کریں۔", error: "تصدیق ناکام" },
  hi: { title: "दो-कारक प्रमाणीकरण", subtitle: "अपने ऑथेंटिकेटर ऐप से 6 अंकों का कोड दर्ज करें", verify: "सत्यापित करें", invalid: "अमान्य कोड। कृपया पुनः प्रयास करें।", error: "सत्यापन विफल" },
};

interface MfaVerifyFormProps {
  factorId: string;
  onSuccess: () => void;
}

export function MfaVerifyForm({ factorId, onSuccess }: MfaVerifyFormProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = labels[language as keyof typeof labels] || labels.en;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const totpCode = code.join("");
    if (totpCode.length !== 6) return;

    setIsLoading(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: totpCode,
      });

      if (verifyError) {
        toast({ title: t.invalid, variant: "destructive" });
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        onSuccess();
      }
    } catch (err) {
      toast({ title: t.error, description: err instanceof Error ? err.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{t.title}</h3>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="flex justify-center gap-2.5">
        {code.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-border/60 bg-background/60 focus:border-primary focus:bg-background transition-all"
            autoFocus={i === 0}
          />
        ))}
      </div>

      <Button
        onClick={handleVerify}
        className="w-full h-14 text-lg font-semibold rounded-2xl auth-gradient-btn transition-all duration-300"
        disabled={isLoading || code.join("").length !== 6}
      >
        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t.verify}
      </Button>
    </div>
  );
}
