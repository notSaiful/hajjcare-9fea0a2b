import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Fingerprint, ShieldCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const labels = {
  en: { btn: "Sign in with Biometrics", unsupported: "Biometrics not available on this device", prompt: "Please authenticate using your device biometrics", success: "Biometric verified", noCredential: "No biometric credential saved. Please sign in with email first, then enroll biometrics from settings." },
  ar: { btn: "تسجيل الدخول بالبصمة", unsupported: "البصمة غير متوفرة على هذا الجهاز", prompt: "يرجى المصادقة باستخدام بصمة جهازك", success: "تم التحقق من البصمة", noCredential: "لا توجد بصمة محفوظة. سجّل دخولك بالبريد أولاً." },
  ur: { btn: "بایومیٹرکس سے لاگ ان", unsupported: "بایومیٹرکس اس آلے پر دستیاب نہیں", prompt: "اپنے آلے کی بایومیٹرکس سے تصدیق کریں", success: "بایومیٹرک تصدیق ہوگئی", noCredential: "کوئی بایومیٹرک محفوظ نہیں۔ پہلے ای میل سے لاگ ان کریں۔" },
  hi: { btn: "बायोमेट्रिक से लॉग इन", unsupported: "बायोमेट्रिक इस डिवाइस पर उपलब्ध नहीं", prompt: "कृपया अपने डिवाइस बायोमेट्रिक से प्रमाणित करें", success: "बायोमेट्रिक सत्यापित", noCredential: "कोई बायोमेट्रिक सहेजा नहीं गया। पहले ईमेल से लॉग इन करें।" },
};

interface BiometricLoginProps {
  onSuccess?: () => void;
}

export function BiometricLogin({ onSuccess }: BiometricLoginProps) {
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = labels[language as keyof typeof labels] || labels.en;

  const isSupported = typeof window !== "undefined" && !!window.PublicKeyCredential;

  const handleBiometric = useCallback(async () => {
    if (!isSupported) {
      toast({ title: t.unsupported, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Use WebAuthn to verify biometric — this is a client-side check
      // In production, you'd do a full WebAuthn assertion with server challenge
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
          allowCredentials: [],
        },
      });

      if (credential) {
        toast({ title: t.success });
        onSuccess?.();
      }
    } catch (err: any) {
      // NotAllowedError = user cancelled, other errors = no credential
      if (err?.name !== "NotAllowedError") {
        toast({ title: t.noCredential, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }, [isSupported, onSuccess, t, toast]);

  if (!isSupported) return null;

  return (
    <div className="space-y-2">
      <div className="relative flex items-center gap-2 py-2">
        <div className="flex-1 border-t border-border/40" />
        <span className="text-xs text-muted-foreground/70 px-2">OR</span>
        <div className="flex-1 border-t border-border/40" />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleBiometric}
        disabled={loading}
        className="w-full h-14 text-base rounded-2xl border-primary/30 bg-primary/5 hover:bg-primary/10 gap-3 transition-all duration-300"
      >
        <Fingerprint className="w-5 h-5 text-primary" />
        {t.btn}
        <ShieldCheck className="w-4 h-4 text-muted-foreground ml-auto" />
      </Button>
      <p className="text-[10px] text-muted-foreground/60 text-center flex items-center justify-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Face ID · Touch ID · Fingerprint
      </p>
    </div>
  );
}
