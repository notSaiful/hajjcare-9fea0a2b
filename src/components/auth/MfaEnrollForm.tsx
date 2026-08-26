import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ShieldCheck, Copy, CheckCircle2, XCircle } from "lucide-react";

const labels = {
  en: { title: "Enable Two-Factor Authentication", desc: "Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)", secretLabel: "Or enter this secret manually:", verify: "Verify & Enable", disable: "Disable 2FA", enabled: "2FA is enabled", enabledDesc: "Your account is protected with two-factor authentication.", verifyCode: "Enter verification code", copied: "Copied!", disableConfirm: "2FA has been disabled", enableSuccess: "2FA enabled successfully!" },
  ar: { title: "تفعيل المصادقة الثنائية", desc: "امسح رمز QR بتطبيق المصادقة", secretLabel: "أو أدخل هذا السر يدوياً:", verify: "تحقق وتفعيل", disable: "تعطيل المصادقة الثنائية", enabled: "المصادقة الثنائية مفعلة", enabledDesc: "حسابك محمي بالمصادقة الثنائية.", verifyCode: "أدخل رمز التحقق", copied: "تم النسخ!", disableConfirm: "تم تعطيل المصادقة الثنائية", enableSuccess: "تم تفعيل المصادقة الثنائية!" },
  ur: { title: "دو مرحلی تصدیق فعال کریں", desc: "اپنی توثیقی ایپ سے QR کوڈ اسکین کریں", secretLabel: "یا یہ خفیہ کوڈ دستی طور پر درج کریں:", verify: "تصدیق اور فعال کریں", disable: "دو مرحلی تصدیق غیر فعال کریں", enabled: "دو مرحلی تصدیق فعال ہے", enabledDesc: "آپ کا اکاؤنٹ دو مرحلی تصدیق سے محفوظ ہے۔", verifyCode: "تصدیقی کوڈ درج کریں", copied: "کاپی ہوگیا!", disableConfirm: "دو مرحلی تصدیق غیر فعال ہوگئی", enableSuccess: "دو مرحلی تصدیق فعال ہوگئی!" },
  hi: { title: "दो-कारक प्रमाणीकरण सक्षम करें", desc: "अपने ऑथेंटिकेटर ऐप से QR कोड स्कैन करें", secretLabel: "या यह सीक्रेट मैन्युअली दर्ज करें:", verify: "सत्यापित करें और सक्षम करें", disable: "2FA अक्षम करें", enabled: "2FA सक्षम है", enabledDesc: "आपका खाता दो-कारक प्रमाणीकरण से सुरक्षित है।", verifyCode: "सत्यापन कोड दर्ज करें", copied: "कॉपी किया!", disableConfirm: "2FA अक्षम किया गया", enableSuccess: "2FA सफलतापूर्वक सक्षम!" },
};

export function MfaEnrollForm() {
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [factorId, setFactorId] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolledFactorId, setEnrolledFactorId] = useState<string>("");
  const [isChecking, setIsChecking] = useState(true);
  const [copied, setCopied] = useState(false);

  const { language } = useLanguage();
  const { toast } = useToast();
  const t = labels[language as keyof typeof labels] || labels.en;

  useEffect(() => {
    checkExistingFactors();
  }, []);

  const checkExistingFactors = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      const verified = data.totp.find((f) => f.status === "verified");
      if (verified) {
        setIsEnrolled(true);
        setEnrolledFactorId(verified.id);
      }
    } catch (err) {
      console.error("MFA check error:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Haj Care Authenticator" });
      if (error) throw error;
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to set up 2FA", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndEnable = async () => {
    if (verifyCode.length !== 6) return;
    setIsLoading(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;
      toast({ title: t.enableSuccess });
      setIsEnrolled(true);
      setEnrolledFactorId(factorId);
      setQrCode("");
      setSecret("");
      setVerifyCode("");
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Verification failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: enrolledFactorId });
      if (error) throw error;
      toast({ title: t.disableConfirm });
      setIsEnrolled(false);
      setEnrolledFactorId("");
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to disable 2FA", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-base">{t.enabled}</CardTitle>
              <CardDescription className="text-sm">{t.enabledDesc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDisable}
            disabled={isLoading}
            className="w-full rounded-xl"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <span className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {t.disable}
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!qrCode) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{t.title}</CardTitle>
              <CardDescription className="text-sm">{t.desc}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={handleEnroll} disabled={isLoading} className="w-full rounded-xl">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.title}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          {t.title}
        </CardTitle>
        <CardDescription className="text-sm">{t.desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center p-4 bg-white rounded-xl">
          <img src={qrCode} alt="QR Code" className="w-48 h-48" />
        </div>

        {/* Manual secret */}
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">{t.secretLabel}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-muted p-2 rounded-lg font-mono break-all">{secret}</code>
            <Button variant="ghost" size="icon" onClick={copySecret} className="shrink-0">
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Verification */}
        <div className="space-y-2">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t.verifyCode}
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-12 text-center text-xl font-mono tracking-[0.5em] rounded-xl"
          />
          <Button
            onClick={handleVerifyAndEnable}
            disabled={isLoading || verifyCode.length !== 6}
            className="w-full h-12 rounded-xl"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.verify}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
